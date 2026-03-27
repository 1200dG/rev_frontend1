"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Session } from "next-auth";
import RiddleGameLayout from "./RiddleGameLayout";
import RiddleLoader from "./RiddleLoader";
import CommonPopup from "./CommonPopup";
import OutOfLivesModal from "./OutOfLivesModal";
import { RiddleApiData, RiddlePageProps, PopupState } from "@/lib/types/common/types";
import { getUserPlayRiddle, submitUserPlaySolution } from "@/lib/services/riddleActions";
import { RIDDLE_DEFAULTS } from "@/lib/constants/riddle";
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

const getEffectiveAccountId = (session: Session | null): string | null => {
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

export default function RiddlePage({
  profileInitials = RIDDLE_DEFAULTS.PROFILE_INITIALS,
  currency = RIDDLE_DEFAULTS.CURRENCY,
}: RiddlePageProps = {}) {
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

    return profileInitials;
  };

  const calculatedProfileInitials = getProfileInitials();
  const [gameState, setGameState] = useState({
    isSubmitting: false,
    currentLives: 0,
    currentCredits: 0,
    creditsUsed: 0,
  });
  const [currentRiddleId, setCurrentRiddleId] = useState<number | null>(null);
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

  useEffect(() => {
    const loadInitialRiddle = async () => {
      const accountId = getEffectiveAccountId(session);
      if (!accountId) {
        router.push("/");
        return;
      }

      try {
        const response = await getUserPlayRiddle(accountId);
        setCurrentRiddleId(response.riddle.id);
        setCurrentRiddleData(response.riddle);
        setGameState(prev => ({
          ...prev,
          currentLives: response.user.lives,
          currentCredits: response.user.credits,
          creditsUsed: 0,
        }));

        const startTime = formatDateForAPI(new Date());
        setRiddleStartTime(startTime);
        setSubmittedSolutions([]);
        setHintsUsed({ general: 0, intermediate: 0, final: 0 });
      } catch (error: unknown) {
        console.error('Failed to load riddle:', error);
        console.error('Error response data:', error && typeof error === 'object' && 'response' in error ? (error as { response?: { data?: unknown } }).response?.data : 'No response data');
        
        // Extract error message from API response
        let errorMessage = "Failed to load riddle";
        
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { errors?: Record<string, string[]>, message?: string } } };
          if (axiosError.response?.data?.errors) {
            // Handle validation errors
            const errors = axiosError.response.data.errors;
            const firstError = Object.values(errors)[0];
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = firstError[0];
            }
          } else if (axiosError.response?.data?.message) {
            // Handle general API error messages
            errorMessage = axiosError.response.data.message;
          }
        } else if (error instanceof Error) {
          // Handle network or other errors
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        router.push("/");
      }
    };

    const accountId = getEffectiveAccountId(session);
    if (accountId && !currentRiddleId) {
      loadInitialRiddle();
    }
  }, [session?.user?.account_id, currentRiddleId, router]);

  const handleHintUsed = async (hintType: 'general' | 'intermediate' | 'final') => {
    const accountId = getEffectiveAccountId(session);
    if (!accountId) return;

    // No local state updates needed - RightHelperPanel handles API call and balance update
    // This function is kept for compatibility but doesn't modify state
    setHintsUsed(prev => ({
      ...prev,
      [hintType]: prev[hintType] + 1
    }));
  };

  const handleNextRiddle = async () => {
    setPopupState(prev => ({ ...prev, isOpen: false }));

    const accountId = getEffectiveAccountId(session);
    if (accountId) {
      try {
        const nextRiddleResponse = await getUserPlayRiddle(accountId);
        setCurrentRiddleId(nextRiddleResponse.riddle.id);
        setCurrentRiddleData(nextRiddleResponse.riddle);
        setGameState(prev => ({
          ...prev,
          currentLives: nextRiddleResponse.user.lives,
          currentCredits: nextRiddleResponse.user.credits,
          creditsUsed: 0,
        }));

        const newStartTime = formatDateForAPI(new Date());
        setRiddleStartTime(newStartTime);
        setSubmittedSolutions([]);
        setHintsUsed({ general: 0, intermediate: 0, final: 0 });
      } catch (error) {
        toast.success("Congratulations! You've completed all available riddles!");
      }
    }
  };

  const handleRetry = () => {
    setPopupState(prev => ({ ...prev, isOpen: false }));
  };


  const handleSolutionSubmit = async (solution: string, riddleIdParam: number) => {
    const accountId = getEffectiveAccountId(session);
    if (!solution.trim() || !accountId || !riddleStartTime) return;

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
        solution: solution.trim(),
        started_at: riddleStartTime,
        completed_at: completedTime,
        credits_used: gameState.creditsUsed,
        hints_used: hintsUsed,
        other: "True"
      };

      const result = await submitUserPlaySolution(submissionData);

      if (result.solved) {
        if (result.user) {
          setGameState(prev => ({
            ...prev,
            currentLives: result.user!.lives,
            currentCredits: result.user!.credits,
            creditsUsed: 0,
          }));
        }

        setPopupState({
          isOpen: true,
          type: 'correct',
          title: 'Congratulations!',
          message: 'You solved the riddle correctly! Ready for the next challenge?',
          buttonText: 'Next Riddle',
          onButtonClick: handleNextRiddle
        });
      } else {
        if (result.user) {
          setGameState(prev => ({
            ...prev,
            currentLives: result.user!.lives,
            currentCredits: result.user!.credits,
            creditsUsed: 0,
          }));

        }

        setPopupState({
          isOpen: true,
          type: 'incorrect',
          title: 'Incorrect Solution',
          message: "That's not quite right. Don't give up - try again!",
          buttonText: 'Try Again',
          onButtonClick: handleRetry
        });
        const newStartTime = formatDateForAPI(new Date());
        setRiddleStartTime(newStartTime);

        if (result.user && result.user.lives === 0) {
          setTimeout(() => {
            toast.error("Game Over! You've run out of lives.");
          }, 0);
        }
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit solution. Please try again.";
      toast.error(errorMessage);
    } finally {
      setGameState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  if (currentRiddleId === null) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6 p-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-yellow-500/30 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-gray-900 font-bold text-sm">?</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Loading Riddles
            </h3>
            <p className="text-gray-300 text-sm animate-pulse">
              Selecting a random riddle for you...
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
        currency={currency}
        helpers={submittedSolutions}
        levelDescription={currentRiddleData?.level_id ? `Level ${currentRiddleData.level_id}: ${currentRiddleData.title}` : `Level ${currentRiddleId}: ${currentRiddleData?.title || ''}`}
        onSubmit={handleSolutionSubmit}
        isLoading={gameState.isSubmitting}
        placeholder={"Solve it here..."}
        riddleId={currentRiddleId}
        riddleData={currentRiddleData}
        onHintUsed={handleHintUsed}
        gameMode="OTHER"
        accountId={getEffectiveAccountId(session) || undefined}
        onBalanceUpdate={(newBalance) => {
          setGameState(prev => ({ ...prev, currentCredits: newBalance }));
        }}
      >
        <RiddleLoader riddleId={currentRiddleId} riddleData={currentRiddleData} />
      </RiddleGameLayout>

      <CommonPopup
        isOpen={popupState.isOpen}
        title={popupState.title}
        message={popupState.message}
        buttonText={popupState.buttonText}
        onButtonClick={popupState.onButtonClick}
      />

      <OutOfLivesModal
        isOpen={isOutOfLivesModalOpen}
        onClose={() => setIsOutOfLivesModalOpen(false)}
      />
    </>
  );
}
