"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import RiddleGameLayout from "@/components/riddle-game/RiddleGameLayout";
import RiddleLoader from "@/components/riddle-game/RiddleLoader";
import CommonPopup from "@/components/riddle-game/CommonPopup";
import { getTourPlayRiddle, submitTournamentPlaySolution } from "@/lib/services/riddleActions";
import { gettournamentDetail } from "@/lib/services/tournamentActions";
import { formatDateForAPI } from "@/lib/utils/dateUtils";
import { routes } from "@/lib/routes";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import {
  RiddleApiData,
  TournamentPlaySubmissionRequest,
  PopupState,
  TourPlayRequest,
  TournamentDetail,
  LevelSuccessProps,
  BottomSolveAreaProps,
  URlRiddleData,
} from "@/lib/types/common/types";

import type { Session as NextAuthSession } from "next-auth";
import { handleApiError } from "@/lib/errorHandler";
import LevelSuccessPopup from "../riddle-game/LevelSuccessPopup";
import { BottomSolveArea } from "../riddle-game";
import CongratulationsPage from "../riddle-game/CongratulationsPage";

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
    handleApiError(error, "Failed to retrieve guest session data.");
  }

  return null;
};

interface TournamentPlayProps {
  tournamentId: string;
  levelNumber?: number;
}

const TournamentPlay: React.FC<TournamentPlayProps> = ({ tournamentId, levelNumber: urlRiddleId }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [tournamentDetails, setTournamentDetails] = useState<TournamentDetail | null>(null);
  const [currentRiddleId, setCurrentRiddleId] = useState<number | null>(null);
  const [currentRiddleData, setCurrentRiddleData] = useState<RiddleApiData | null>(null);
  const [urlRiddle, setUrlRiddle] = useState<URlRiddleData | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [gameState, setGameState] = useState({
    currentLives: 5,
    currentCredits: 200,
    creditsUsed: 0,
    isSubmitting: false,
  });
  const [riddleStartTime, setRiddleStartTime] = useState<string>("");
  const [submittedSolutions, setSubmittedSolutions] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState({ general: 0, intermediate: 0, final: 0 });
  const [popupState, setPopupState] = useState<PopupState>({
    isOpen: false,
    type: 'correct',
    title: '',
    message: '',
    buttonText: '',
    onButtonClick: () => { },
    secondaryButtonText: '',
    onSecondaryButtonClick: () => { },
  });
  const [levelSuccess, setLevelSuccess] = useState<LevelSuccessProps>({
    isOpen: false,
    level: null,
    onButtonClick: null,
  });
  const [answerState, setAnswerState] = useState<BottomSolveAreaProps['success']>(undefined);

  const profileInitials = (session?.user?.username || "") || "U";
  const currency = "Credits";
  const secretKey = "url_special_riddle";
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const urlLevelNumber = searchParams.get("levelNumber");

  useEffect(() => {
    const storedType = localStorage.getItem("type");
    const storedId = localStorage.getItem("id");
    const storedTime = localStorage.getItem("time");
    const storedUrl = localStorage.getItem("url");


    let decryptedType = "";
    let decryptedId = 0;
    let decryptedTime = "";
    let decryptedUrl = ""

    if (storedType) {
      const bytes = CryptoJS.AES.decrypt(storedType, secretKey);
      decryptedType = bytes.toString(CryptoJS.enc.Utf8);
    }

    if (storedId) {
      const bytes = CryptoJS.AES.decrypt(storedId, secretKey);
      decryptedId = Number(bytes.toString(CryptoJS.enc.Utf8));
    }

    if (storedTime) {
      const bytes = CryptoJS.AES.decrypt(storedTime, secretKey);
      decryptedTime = String(bytes.toString(CryptoJS.enc.Utf8));
    }

    if (storedUrl) {
      const bytes = CryptoJS.AES.decrypt(storedUrl, secretKey);
      decryptedUrl = String(bytes.toString(CryptoJS.enc.Utf8));
    }

    // Single state update
    if (decryptedType || decryptedId) {
      setUrlRiddle({
        riddle_id: decryptedId,
        type: decryptedType,
        started_at: decryptedTime,
        url: decryptedUrl,
      });
    }
  }, []);

  useEffect(() => {
    const loadTournamentRiddle = async () => {
      if (!session?.user?.account_id) {
        router.push("/");
        return;
      }

      const riddleId = urlRiddleId;

      if (!riddleId) {
        toast.error("No riddle selected");
        router.push(routes.ui.clash.tournamentDetail(tournamentId));
        return;
      }

      try {
        const tournamentData = await gettournamentDetail(tournamentId);
        setTournamentDetails(tournamentData);
        if (!tournamentData?.id) {
          toast.error("Tournament not found");
          router.push(routes.ui.clash.tournaments);
          return;
        }
        if (urlRiddle?.type === "URL_ACTION") {
          setGameState(prev => ({ ...prev, isSubmitting: true }));
          setAnswerState(() => undefined)
          try {
            const currentTime = formatDateForAPI(new Date());
            const submissionData: TournamentPlaySubmissionRequest = {
              account_id: session.user.account_id,
              riddle_id: urlRiddle.riddle_id,
              started_at: urlRiddle.started_at,
              completed_at: currentTime,
              credits_used: gameState.creditsUsed,
              tournament: "True",
              mode_id: tournamentData.id,
              extra_param: `levelNumber=${urlLevelNumber}`,
            };

            const response = await submitTournamentPlaySolution(submissionData);
            if (response.solved) {
              localStorage.removeItem('url');
              localStorage.removeItem('type');
              localStorage.removeItem('id');
              localStorage.removeItem('time');
              try {
                const accountId = session?.user?.account_id;
                if (!accountId) {
                  toast.error("Account ID is missing");
                  return;
                }
                const tourPlayData: TourPlayRequest = {
                  account_id: session.user.account_id,
                  tour_id: tournamentData.id,
                };
                const nextRiddleResponse = await getTourPlayRiddle(tourPlayData);
                if (nextRiddleResponse.detail) {
                  setPopupState({
                    isOpen: true,
                    type: 'finish',
                    title: "Finished!",
                    message: nextRiddleResponse.detail,
                  })

                  setTimeout(() => {
                    setPopupState(prev => ({ ...prev, isOpen: false }));
                    setShowCongratulations(true);
                  }, 3500);
                } else {
                  setCurrentRiddleId(nextRiddleResponse.riddle.id);
                  setCurrentRiddleData(nextRiddleResponse.riddle);
                  setGameState(prev => ({
                    ...prev,
                    currentLives: nextRiddleResponse.user.lives,
                    currentCredits: nextRiddleResponse.user.credits,
                    creditsUsed: 0,
                  }));
                  if (nextRiddleResponse.riddle.type === "URL_ACTION") {
                    const encryptedType = CryptoJS.AES.encrypt(nextRiddleResponse.riddle.type ?? "", secretKey).toString();
                    localStorage.setItem("type", encryptedType);
                    const encryptedId = CryptoJS.AES.encrypt(String(nextRiddleResponse.riddle.id), secretKey).toString();
                    localStorage.setItem("id", encryptedId);
                    const encryptedUrl = CryptoJS.AES.encrypt(String(`${urlLevelNumber}`), secretKey).toString();
                    localStorage.setItem("url", encryptedUrl);
                    const encryptedTime = CryptoJS.AES.encrypt(String(formatDateForAPI(new Date())), secretKey).toString();
                    localStorage.setItem("time", encryptedTime);
                  }
                  const params = new URLSearchParams(window.location.search);
                  params.set("levelNumber", String(nextRiddleResponse.riddle.level_number));
                  router.push(`${pathName}?${params.toString()}`);
                  setRiddleStartTime(formatDateForAPI(new Date()));
                  setSubmittedSolutions(nextRiddleResponse.prev_answers ?? []);
                  setHintsUsed({ general: 0, intermediate: 0, final: 0 });

                }
              } catch (error) {
                handleApiError(error);
              }

              //   level: currentRiddleData?.level_number ?? null,
              //   onButtonClick: async () => {
              //     setAnswerState(undefined)
              //     await new Promise(r => setTimeout(r, 100));

              //     try {
              //       const accountId = session?.user?.account_id;
              //       if (!accountId) {
              //         toast.error("Account ID is missing");
              //         return;
              //       }
              //       const level_number = urlRiddleId ?? "";

              //       const payload: SeasonPlayRequest = {
              //         account_id: accountId,
              //         season_id: parseInt(seasonId),
              //         current_level_number: parseInt(level_number),
              //       };
              //       const nextRiddleResponse = await playSeasonRiddle(payload);

              //       if (nextRiddleResponse.detail) {
              //         setPopupState({
              //           isOpen: true,
              //           type: 'finish',
              //           title: "Finished!",
              //           message: nextRiddleResponse.detail,
              //         })

              //         setTimeout(() => {
              //           setPopupState(prev => ({ ...prev, isOpen: false }));
              //           setShowCongratulations(true);
              //         }, 3500);
              //       } else {
              //         setCurrentRiddleId(nextRiddleResponse.riddle.id);
              //         setCurrentRiddleData(nextRiddleResponse.riddle);
              //         setGameState(prev => ({
              //           ...prev,
              //           currentLives: nextRiddleResponse.user.lives,
              //           currentCredits: nextRiddleResponse.user.credits,
              //           creditsUsed: 0,
              //         }));
              //         const params = new URLSearchParams(window.location.search);
              //         params.set("levelNumber", String(nextRiddleResponse.riddle.level_number));
              //         router.push(`${pathName}?${params.toString()}`);
              //         setRiddleStartTime(formatDateForAPI(new Date()));
              //         setSubmittedSolutions(nextRiddleResponse.prev_answers ?? []);
              //         setHintsUsed({ general: 0, intermediate: 0, final: 0 });
              //       }
              //     } catch (error) {
              //       handleApiError(error);
              //     }
              //     setLevelSuccess(prev => ({ ...prev, isOpen: false }));
              //   },
              //   bottomSolveArea: (
              //     <BottomSolveArea
              //       currentLevel={currentRiddleId}
              //       levelDescription={currentRiddleData?.level_number ? `Level ${currentRiddleData.level_number}: ${currentRiddleData.title}` : `Level ${currentRiddleId}: ${currentRiddleData?.title || ''}`}
              //       onSubmit={handleSolutionSubmit}
              //       isLoading={gameState.isSubmitting}
              //       placeholder={"Solve it here..."}
              //       riddleId={currentRiddleId}
              //       riddleData={currentRiddleData}
              //       gameMode="SEASON"
              //       success="True"
              //     />
              //   )
              // });
            } else {
              localStorage.removeItem('url');
              localStorage.removeItem('type');
              localStorage.removeItem('id');
              localStorage.removeItem('time');
              router.back();
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to submit solution";
            handleApiError(error, errorMessage);
          } finally {
            setGameState(prev => ({ ...prev, isSubmitting: false }));
          }

        }
        else {
          const tourPlayData: TourPlayRequest = {
            account_id: session.user.account_id,
            tour_id: tournamentData.id,
          };

          const response = await getTourPlayRiddle(tourPlayData);
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
          setSubmittedSolutions(response.prev_answers ?? []);
          setHintsUsed({ general: 0, intermediate: 0, final: 0 });
          if (response.riddle.type === "URL_ACTION") {
            const encryptedType = CryptoJS.AES.encrypt(response.riddle.type ?? "", secretKey).toString();
            localStorage.setItem("type", encryptedType);
            const encryptedId = CryptoJS.AES.encrypt(String(response.riddle.id), secretKey).toString();
            localStorage.setItem("id", encryptedId);
            const encryptedUrl = CryptoJS.AES.encrypt(String(`${urlLevelNumber}`), secretKey).toString();
            localStorage.setItem("url", encryptedUrl);
            const encryptedTime = CryptoJS.AES.encrypt(String(startTime), secretKey).toString();
            localStorage.setItem("time", encryptedTime);
          }
          router.replace(`${pathName}?levelNumber=${response.riddle.level_number}`);
        }
      } catch (error: unknown) {
        console.error('Failed to load tournament riddle:', error);
        console.error('Error response data:', error && typeof error === 'object' && 'response' in error ? (error as { response?: { data?: unknown } }).response?.data : 'No response data');

        // Extract error message from API response
        let errorMessage = "Failed to load tournament riddle";

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
        router.push(routes.ui.clash.tournamentDetail(tournamentId));
      }
    };

    if (session?.user?.account_id && !currentRiddleId) {
      loadTournamentRiddle();
    }
  }, [session, tournamentId, currentRiddleId, router]);

  const handleSolutionSubmit = async (solution: string | null, riddleId: number, isClickable: boolean = false) => {
    if (!session?.user?.account_id || !currentRiddleData) return;

    setGameState(prev => ({ ...prev, isSubmitting: true }));
    setAnswerState(() => undefined);

    try {
      const currentTime = formatDateForAPI(new Date());
      const submissionData: TournamentPlaySubmissionRequest = {
        account_id: session.user.account_id,
        riddle_id: riddleId,
        solution: solution?.trim(),
        started_at: riddleStartTime || currentTime,
        completed_at: currentTime,
        credits_used: gameState.creditsUsed,
        tournament: "True",
        mode_id: tournamentDetails?.id || 0,
        ...(isClickable && { is_checked: isClickable }),
      };

      const response = await submitTournamentPlaySolution(submissionData);

      if (response.solved) {
        setAnswerState(() => "True");
        setLevelSuccess({
          isOpen: true,
          level: currentRiddleData.level_number ?? null,
          onButtonClick: async () => {
            setAnswerState(undefined)
            await new Promise(r => setTimeout(r, 100));
            try {
              const accountId = session?.user?.account_id;
              if (!accountId) {
                toast.error("Account ID is missing");
                return;
              }

              const payload: TourPlayRequest = {
                account_id: accountId,
                tour_id: tournamentDetails?.id ?? 0,
              };
              const nextRiddleResponse = await getTourPlayRiddle(payload);
              if (nextRiddleResponse.detail) {
                setPopupState({
                  isOpen: true,
                  type: "finish",
                  title: "Finished",
                  message: nextRiddleResponse.detail,
                })
                setTimeout(() => {
                  setPopupState(prev => ({ ...prev, isOpen: false }));
                  setShowCongratulations(true);
                }, 3500);
              }
              else {
                setCurrentRiddleId(nextRiddleResponse.riddle.id);
                setCurrentRiddleData(nextRiddleResponse.riddle);
                setGameState(prev => ({
                  ...prev,
                  currentLives: nextRiddleResponse.user.lives,
                  currentCredits: nextRiddleResponse.user.credits,
                  creditsUsed: 0,
                }));

                const params = new URLSearchParams(window.location.search);
                params.set("levelNumber", String(nextRiddleResponse.riddle.level_number));
                router.push(`${window.location.pathname}?${params.toString()}`);

                setRiddleStartTime(formatDateForAPI(new Date()));
                setSubmittedSolutions(nextRiddleResponse.prev_answers ?? []);
                setHintsUsed({ general: 0, intermediate: 0, final: 0 });

              }
            } catch (error) {
              handleApiError(error);
            }
            setLevelSuccess(prev => ({ ...prev, isOpen: false }));
          },
          bottomSolveArea: (
            <BottomSolveArea
              currentLevel={currentRiddleId}
              levelDescription={currentRiddleData ? `Level ${currentRiddleData}: ${currentRiddleData.title}` : `Level ${currentRiddleId}: ${currentRiddleData || ''}`}
              onSubmit={handleSolutionSubmit}
              isLoading={gameState.isSubmitting}
              placeholder={"Solve it here..."}
              riddleId={currentRiddleId}
              riddleData={currentRiddleData}
              gameMode="TOURNAMENT"
              success="True"
            />)
        });
      } else {
        setAnswerState(() => "False");
        const newLives = response.user?.lives || (gameState.currentLives - 1);
        const newCredits = response.user?.credits || gameState.currentCredits;
        setGameState(prev => ({
          ...prev,
          currentLives: newLives,
          currentCredits: newCredits
        }));
        if (typeof solution === 'string')
          setSubmittedSolutions(prev => [...prev, solution]);
        setRiddleStartTime(formatDateForAPI(new Date()));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit solution";
      handleApiError(error, errorMessage);
    } finally {
      setGameState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleHintUsed = async (hintType: 'general' | 'intermediate' | 'final') => {
    if (!session?.user?.account_id || !currentRiddleData) return;

    // No local state updates needed - RightHelperPanel handles API call and balance update
    // This function is kept for compatibility but doesn't modify state
  };

  if (!currentRiddleId || !currentRiddleData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white">Loading tournament riddle...</div>
      </div>
    );
  }

  return (
    <>
      {!showCongratulations && (

        <RiddleGameLayout
          lives={gameState.currentLives}
          currentLevel={currentRiddleId}
          profileInitials={profileInitials}
          balance={gameState.currentCredits}
          currency={currency}
          helpers={submittedSolutions}
          levelDescription={currentRiddleData ? `Level ${currentRiddleData}: ${currentRiddleData.title}` : `Level ${currentRiddleId}: ${currentRiddleData || ''}`}
          onSubmit={handleSolutionSubmit}
          isLoading={gameState.isSubmitting}
          placeholder={"Solve it here..."}
          riddleId={currentRiddleId}
          riddleData={currentRiddleData}
          onHintUsed={handleHintUsed}
          gameMode="TOURNAMENT"
          success={answerState}
          modeId={tournamentDetails?.id}
          accountId={getEffectiveAccountId(session) || undefined}
          onBalanceUpdate={(newBalance) => {
            setGameState(prev => ({ ...prev, currentCredits: newBalance }));
          }}
        >
          <RiddleLoader riddleId={currentRiddleId} riddleData={currentRiddleData} handleSolutionSubmit={handleSolutionSubmit} />
        </RiddleGameLayout>
      )}

      <CommonPopup
        isOpen={popupState.isOpen}
        title={popupState.title}
        message={popupState.message}
        buttonText={popupState.buttonText}
        onButtonClick={popupState.onButtonClick}
        secondaryButtonText={popupState.secondaryButtonText}
        onSecondaryButtonClick={popupState.onSecondaryButtonClick}
      />
      <LevelSuccessPopup
        isOpen={levelSuccess.isOpen}
        level={levelSuccess.level}
        onButtonClick={levelSuccess.onButtonClick}
        bottomSolveArea={levelSuccess.bottomSolveArea}
      />
      {showCongratulations && <CongratulationsPage />}
    </>
  );
};

export default TournamentPlay;
