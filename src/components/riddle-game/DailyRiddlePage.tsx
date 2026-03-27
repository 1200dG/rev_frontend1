"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import RiddleGameLayout from "./RiddleGameLayout";
import RiddleLoader from "./RiddleLoader";
import CommonPopup from "./CommonPopup";
import OutOfLivesModal from "./OutOfLivesModal";
import { RiddleApiData, PopupState } from "@/lib/types/common/types";
import { getDailyRiddle, submitUserPlaySolution } from "@/lib/services/riddleActions";
import { RIDDLE_DEFAULTS } from "@/lib/constants/riddle";
import { routes } from "@/lib/routes";
import Cookies from "js-cookie";

const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

import type { Session as NextAuthSession } from "next-auth";
import { handleApiError } from "@/lib/errorHandler";

const getEffectiveAccountId = (session: NextAuthSession | null): string | null => {
  if (session?.user?.account_id) {
    return session.user.account_id;
  }
  try {
    const guestSessionCookie = Cookies.get("guest_session");
    if (guestSessionCookie) {
      const guestSession = JSON.parse(guestSessionCookie);
      return guestSession.account_id;
    }
  } catch (error) {
    console.error("Failed to parse guest session:", error);
  }

  return null;
};

export default function DailyRiddlePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const getProfileInitials = () => {
    if (session?.user?.username) {
      return `${session.user.username?.charAt(0) || 'G'}`;
    }

    try {
      const guestSessionCookie = Cookies.get("guest_session");
      if (guestSessionCookie) {
        const guestSession = JSON.parse(guestSessionCookie);
        return `${guestSession.username?.charAt(0) || 'G'}`;
      }
    } catch (error) {
      console.error("Failed to parse guest session for initials:", error);
    }

    return RIDDLE_DEFAULTS.PROFILE_INITIALS;
  };

  const calculatedProfileInitials = getProfileInitials();
  const [gameState, setGameState] = useState({
    isSubmitting: false,
    currentLives: 0,
    currentCredits: 0,
    creditsUsed: 0,
  });
  const [currentRiddleId, setCurrentRiddleId] = useState<number | null>(null);
  const [modeId, setModeId] = useState<number | null>(null);
  const [currentRiddleData, setCurrentRiddleData] = useState<RiddleApiData | null>(null);
  const [riddleStartTime, setRiddleStartTime] = useState<string | null>(null);
  const [submittedSolutions, setSubmittedSolutions] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState({ general: 0, intermediate: 0, final: 0 });
  const [popupState, setPopupState] = useState<PopupState>({
    isOpen: false,
    type: null,
    title: '',
    message: '',
    buttonText: '',
    onButtonClick: null
  });
  const [isOutOfLivesModalOpen, setIsOutOfLivesModalOpen] = useState(false);

  const loadDailyRiddle = async () => {
    try {
      const response = await getDailyRiddle();

      if (response.errors) {
        handleApiError(response.errors)
        router.push(routes.ui.gamehub);
        return;
      }

      if (!response.data?.riddle) {
        toast.success(response.data?.detail || "No riddle available today.");
        router.push(routes.ui.gamehub);
        return;
      }

      const data = response.data;
      const user = data?.user;

      setCurrentRiddleId(response.data.riddle.id);
      setModeId(data?.id || null);
      setCurrentRiddleData(response.data.riddle);
      setGameState(prev => ({
        ...prev,
        currentLives: user?.lives ?? 0,
        currentCredits: user?.credits ?? 0,
        creditsUsed: 0,
      }));
      const startTime = formatDateForAPI(new Date());
      setRiddleStartTime(startTime);
      setSubmittedSolutions(response.data.prev_answers ?? []);
      setHintsUsed({ general: 0, intermediate: 0, final: 0 });
    } catch (error: unknown) {
      console.error("Failed to load daily riddle:", error);

      handleApiError(error, "Failed to load daily riddle. Please try again.");
      router.push(routes.ui.gamehub);
    }
  };

  useEffect(() => {
    if (!currentRiddleId) {
      loadDailyRiddle();
    }
  }, [currentRiddleId]);

  const handleHintUsed = async (hintType: 'general' | 'intermediate' | 'final') => {
    const accountId = getEffectiveAccountId(session);
    if (!accountId) return;

    // Update local hint counters only. The API call is handled by RightHelperPanel.
    setHintsUsed(prev => ({
      ...prev,
      [hintType]: prev[hintType] + 1,
    }));
  };


  const handleExitToHub = () => {
    setPopupState(prev => ({ ...prev, isOpen: false }));
    router.push(routes.ui.gamehub);
  };

  const handleRetry = () => {
    setPopupState(prev => ({ ...prev, isOpen: false }));
  };

  const handleSolutionSubmit = async (solution: string | null, riddleIdParam: number, isClickable: boolean = false) => {
    const accountId = getEffectiveAccountId(session);
    if (!solution?.trim() || !accountId || !riddleStartTime) return;

    if (gameState.currentLives <= 0) {
      setIsOutOfLivesModalOpen(true);
      return;
    }

    setSubmittedSolutions(prev => [...prev, solution.trim()]);

    setGameState(prev => ({ ...prev, isSubmitting: true }));
    try {
      const completedTime = formatDateForAPI(new Date());

      const submissionData = {
        account_id: accountId,
        riddle_id: riddleIdParam,
        ...(typeof solution === 'string' && { solution: solution.trim() }),
        started_at: riddleStartTime,
        completed_at: completedTime,
        credits_used: gameState.creditsUsed,
        daily_riddle: true,
        mode_id: modeId,
        ...(isClickable && { is_checked: isClickable }),
      } as const;

      const result = await submitUserPlaySolution(submissionData);

      if (result.solved) {
        setPopupState({
          isOpen: true,
          type: 'correct',
          title: 'Congratulations!',
          message: 'You solved today’s daily riddle! Come back tomorrow for a new challenge.',
          onButtonClick: handleExitToHub,
        });
      } else {
        setPopupState({
          isOpen: true,
          type: 'incorrect',
          title: 'Incorrect Solution',
          message: "That's not quite right. Try again!",
          buttonText: 'Try Again',
          onButtonClick: handleRetry,
        });
        setRiddleStartTime(formatDateForAPI(new Date()));

        if (result.user && typeof result.user.lives === "number") {
          setGameState(prev => ({ ...prev, currentLives: result.user.lives }));
          if (result.user.lives === 0) {
            setTimeout(() => {
              toast.error("Game Over! You've run out of lives.");
              setIsOutOfLivesModalOpen(true);
            }, 0);
          }
        }
      }
    } catch (error) {
      handleApiError(error, "Failed to submit solution. Please try again.");
    } finally {
      setGameState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  if (currentRiddleId === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6 p-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-yellow-500/30 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-gray-900 font-bold text-sm">?</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Loading Daily Riddle
            </h3>
            <p className="text-gray-300 text-sm animate-pulse">
              Fetching today's challenge...
            </p>
          </div>

          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <RiddleGameLayout
        lives={gameState.currentLives}
        currentLevel={currentRiddleId}
        profileInitials={calculatedProfileInitials}
        balance={gameState.currentCredits}
        currency={RIDDLE_DEFAULTS.CURRENCY}
        helpers={submittedSolutions}
        levelDescription={currentRiddleData?.level_number ? `Level ${currentRiddleData.level_number}: ${currentRiddleData.title}` : `Level ${currentRiddleId}: ${currentRiddleData?.title || ''}`}
        onSubmit={handleSolutionSubmit}
        isLoading={gameState.isSubmitting}
        placeholder={"Solve it here..."}
        riddleId={currentRiddleId}
        riddleData={currentRiddleData}
        onHintUsed={handleHintUsed}
        gameMode="DAILY"
        modeId={modeId}
        accountId={getEffectiveAccountId(session) || undefined}
        onBalanceUpdate={(newBalance) => {
          setGameState(prev => ({ ...prev, currentCredits: newBalance }));
        }}
      >
        <RiddleLoader riddleId={currentRiddleId} riddleData={currentRiddleData} handleSolutionSubmit={handleSolutionSubmit}/>
      </RiddleGameLayout>

      <CommonPopup
        isOpen={popupState.isOpen}
        title={popupState.title}
        message={popupState.message}
        buttonText={popupState.buttonText}
        onButtonClick={popupState.onButtonClick}
        secondaryButtonText={'Return to GameHub'}
        onSecondaryButtonClick={handleExitToHub}
      />

      <OutOfLivesModal
        isOpen={isOutOfLivesModalOpen}
        onClose={() => setIsOutOfLivesModalOpen(false)}
      />
    </>
  );
}

