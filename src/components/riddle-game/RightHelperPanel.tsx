"use client";
import { HintData, HintDeductionResponse, HintError, RightSidebarProps } from "@/lib/types/common/types";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useGuestSession } from "@/lib/hooks/useGuestSession";
import { addLives, deductCreditsForHint, getHintData } from "@/lib/services/riddleActions";
import CommonPopup from "./CommonPopup";
import CommonInputModal from "./CommonInputModal";
import Tooltip from "../common/tooltip/ToolTip";
import api from "../../lib/axios";
import { handleApiError } from "@/lib/errorHandler";
import { useAppContext } from "@/lib/hooks/useAppContext";
import HintHelperModal from "./HintHelperModal";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { formatHintType, getHintIcon } from "@/lib/utils/helpers";


export default function RightHelperPanel({
  balance = 0,
  helpers = [],
  riddleData = null,
  onHintUsed,
  gameMode = "OTHER",
  modeId,
  accountId,
  onBalanceUpdate,
  lives,
  tabIndex,
  setTabIndex,
  onUpdateLives,
}: RightSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullPath = `${pathname}${searchParams ? "?" + searchParams.toString() : ""}`;
  const { guestSession } = useGuestSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { previousUrl } = useAppContext();
  const originalEntryRouteRef = useRef<string | null>(null);
  const [isHintUsed, setIsHintUsed] = useState(false);
  const [isHintLocked, setIsHintLocked] = useState(false);

  const [panelState, setPanelState] = useState({
    isCollapsed: false,
    currentHintLevel: 0,
    isHintPopupOpen: false,
    showInfoPopup: false,
    showLogoutPopup: false,
    showBugModal: false,
    isProcessing: false,
    hintPopupMessage: "",
    hintPopupTitle: "",
  });

  const [hintModalData, setHintModalData] = useState<HintDeductionResponse | null>(null);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [modalHintData, setModalHintData] = useState<HintData | null>(null);
  const [displayText, setDisplayText] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    if (!pathname) return;

    if (pathname === "/riddles/daily") {
      originalEntryRouteRef.current = "/gamehub";
      sessionStorage.setItem("gameEntryRoute", "/gamehub");
      return;
    }

    const storedEntryRoute = sessionStorage.getItem("gameEntryRoute");
    if (storedEntryRoute) {
      originalEntryRouteRef.current = storedEntryRoute;
      return;
    }

    let entryRoute: string | null = null;

    const enigmaMatch = pathname.match(/^\/enigma\/seasons\/([^\/]+)\/play/);
    if (enigmaMatch) {
      entryRoute = `/enigma/seasons/${enigmaMatch[1]}`;
    }
    else {
      const clashMatch = pathname.match(/^\/clash\/tournaments\/([^\/]+)\/play/);
      if (clashMatch) {
        entryRoute = `/clash/tournaments/${clashMatch[1]}`;
      }
      else {
        entryRoute = "/gamehub";
      }
    }

    originalEntryRouteRef.current = entryRoute;
    sessionStorage.setItem("gameEntryRoute", entryRoute);
  }, [pathname]);


  useEffect(() => {
    setPanelState((prev) => ({ ...prev, currentHintLevel: 0 }));
  }, [riddleData?.id]);

  useEffect(() => {
    setIsHintUsed(false);
    setIsHintLocked(false);
    setHintModalData(null);
  }, [riddleData?.id]);


  useEffect(() => {
    if (panelState.showLogoutPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [panelState.showLogoutPopup]);

  const toggleSidebar = () => {
    setPanelState((prev) => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  };

  useEffect(() => {
    const hint = modalHintData?.hint ?? "";

    if (!hint) {
      setDisplayText("");
      return;
    }

    setDisplayText("");
    let index = 0;

    const type = () => {
      if (index >= hint.length) return;
      const char = hint.charAt(index);
      setDisplayText((prev) => prev + char);
      index++;
      setTimeout(type, 25);
    };

    type();
  }, [modalHintData?.hint]);

  const handleAddFunds = () => {
    const redirectUrl = fullPath;
    localStorage.setItem("redirectUrl", redirectUrl);
    router.push("/payments");
  };

  const handleInfoClick = () => {
    setPanelState((prev) => ({ ...prev, showInfoPopup: true }));
  };

  const handleBugReport = () => {
    setPanelState((prev) => ({ ...prev, showBugModal: true }));
  };

  const handleLogout = () => {
    setPanelState((prev) => ({ ...prev, showLogoutPopup: true }));
  };

  const submitBugReport = async (reportText: string) => {
    try {
      const response = await api.post("/bug-report/", {
        description: reportText.trim(),
      });

      if (response.status == 200 || response.status == 204) {

        toast.success("Bug report submitted successfully!");
        setPanelState((prev) => ({ ...prev, showBugModal: false }));
      }

    } catch (error: unknown) {
      console.error("Bug report submission failed:", error);

      handleApiError(error, "Failed to submit bug report. Please try again.");
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const confirmLogout = async () => {
    try {
      setPanelState((prev) => ({ ...prev, showLogoutPopup: false }));

      if (guestSession) {
        document.cookie =
          "guest_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }

      toast.success("Logged out successfully");
      await handleLogout();
    } catch (error) {
      handleApiError(error, "Logout failed. Please try again.");
    }
  };

  const cancelLogout = () => {
    setPanelState((prev) => ({ ...prev, showLogoutPopup: false }));
  };

  const handleHelperClick = async () => {

    if (!riddleData || !accountId) {
      toast.error("Missing required data for hint usage");
      return;
    }

    try {
      const requestData = {
        account_id: accountId,
        riddle: riddleData.id,
        mode: gameMode,
        mode_id: modeId,
      };

      const response = await deductCreditsForHint(requestData);
      setHintModalData(response);
      setIsHintModalOpen(true);

    } catch (error: unknown) {
      console.error("Failed to use hint:", error);

      const errorMessage = "Failed to use hint. Please try again.";
      handleApiError(error, errorMessage);

    } finally {
      setPanelState((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  const closeHintPopup = () => {
    setPanelState((prev) => ({
      ...prev,
      isHintPopupOpen: false,
      //currentHintLevel: prev.currentHintLevel + 1
    }));
  };

  const getCurrentHintInfo = () => {
    if (!riddleData)
      return { title: "Hint", text: panelState.hintPopupMessage || "" };

    const fallback = () => {
      switch (panelState.currentHintLevel) {
        case 0:
          return { title: "Hint 1", text: riddleData.general_hint || "" };
        case 1:
          return { title: "Hint 2", text: riddleData.intermediate_hint || "" };
        case 2:
          return { title: "Final Hint", text: riddleData.final_hint || "" };
        default:
          return { title: "No More Hints", text: "" };
      }
    };

    const fallbackInfo = fallback();
    return {
      title: fallbackInfo.title,
      text: panelState.hintPopupMessage || fallbackInfo.text,
    };
  };

  const handleHelperClickMobile = async () => {

    if (!riddleData || !accountId) {
      toast.error("Missing required data for hint usage");
      return;
    }

    setIsHintUsed(false);
    setIsHintLocked(false);

    try {
      const requestData = {
        account_id: accountId,
        riddle: riddleData.id,
        mode: gameMode,
        mode_id: modeId,
      };

      const response = await deductCreditsForHint(requestData);

      setHintModalData(response);
      setTabIndex?.(1)

    } catch (error: unknown) {
      console.error("Failed to use hint:", error);

      const errorMessage = "Failed to use hint. Please try again.";
      handleApiError(error, errorMessage);

    } finally {
      setPanelState((prev) => ({ ...prev, isProcessing: false }));
    }
  }

  const handleExit = () => {
    let exitRoute = "/gamehub";

    if (pathname === "/riddles/daily") {
      exitRoute = "/gamehub";
    }
    else if (originalEntryRouteRef.current) {
      exitRoute = originalEntryRouteRef.current;
    }
    else if (previousUrl && previousUrl !== "/") {
      exitRoute = previousUrl;
    }

    sessionStorage.removeItem("gameEntryRoute");
    router.push(exitRoute);
  };

  const handlehintClick = async () => {
    if (isHintUsed || isHintLocked) return;

    if (!riddleData || !accountId) {
      toast.error("Missing required data for hint usage");
      return;
    }

    try {
      const requestData = {
        account_id: accountId,
        riddle: riddleData.id,
        mode: gameMode,
        mode_id: modeId,
      };

      const response = await getHintData(requestData);

      if (response.hint) {
        setModalHintData(response);
        onUpdateLives(response.user.lives, response.user.credits);
        setIsHintUsed(true);
      }

      if (response.message && !response.hint) {
        toast.success(response.message);
        setIsHintLocked(true);
      }
    } catch (error: unknown) {
      console.error("Failed to use hint:", error);
      handleApiError(error);
    }
  };

  const handleAddLives = async () => {

    if (!riddleData || !accountId) {
      toast.error("Missing required data for hint usage");
      return;
    }
    try {
      const requestData = {
        credits: 20,
        lives: 5,
      };

      const response = await addLives(requestData);
      const { lives, credits } = response.user;
      onUpdateLives(lives, credits);
      toast.success(response.detail);

    } catch (error: unknown) {
      console.error("Failed to use hint:", error);
      handleApiError(error);
    }
  };

  return (
    <>
      <div className="hidden sm:block">
        <div className="relative h-full bg-transparent" style={{ minHeight: "calc(100vh - 80px)" }}>
          <button
            onClick={toggleSidebar}
            className={`absolute top-12 z-20 rounded-full transition-all duration-300 cursor-pointer ${panelState.isCollapsed
              ? "-left-6 w-10 h-10 p-2 bg-black border-2 border-white/30 shadow-lg hover:bg-black/90 hover:border-white/60 hover:scale-110 hover:shadow-xl active:scale-95"
              : "-left-3 hover:scale-110 hover:opacity-80 active:scale-95"
              }`}
          >
            <img className={`transition-all duration-300 w-2 sm:w-3 lg:w-4 xl:w-5 h-2 sm:h-3 lg:h-4 xl:h-5 ${panelState.isCollapsed ? "rotate-180" : ""}`} src="/sidebar/expand.svg" />
          </button>

          <div className={`h-full transition-all duration-300 bg-transparent ${panelState.isCollapsed ? "w-0 overflow-hidden" : "w-48"}`} style={{ height: "calc(100vh - 80px)" }}>
            <div className="h-full border-l border-white/50 bg-transparent" style={{ minHeight: "calc(100vh - 80px)" }} >
              {!panelState.isCollapsed && (
                <div className="h-full flex flex-col p-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleHelperClick();
                    }}
                    disabled={!riddleData || panelState.isProcessing}
                    className={`w-full h-9.5 gap-2 rounded-[10px] font-bold text-base flex items-center justify-center mb-4 border shadow-lg font-circular ${riddleData && !panelState.isProcessing
                      ? "bg-[#5a1804] text-[#E3BE76] border-[#FFD278] outline-none cursor-pointer duration-300 shadow-[0px_3px_4px_rgba(255,252,250,0)] hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box" : "bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed opacity-50"}`}
                  >
                    <div className="flex gap-2 will-change-transform" >

                      <Image src="/riddles/star.svg" width={23} height={23} alt="Star" className="shrink-0 items-center" />
                      {panelState.isProcessing ? "Processing..." : "Helpers"}
                    </div>
                  </button>

                  <div className="flex-1">
                    <div className="text-white/50 text-sm font-medium mb-2"> History </div>
                    <div className="space-y-2 overflow-hidden max-h-80">
                      {helpers.length > 0 ? (
                        helpers.map((helper, index) => (
                          <div key={index} className="text-white text-sm">
                            {helper}
                          </div>
                        ))
                      ) : (
                        <div className="text-white/50 text-sm italic">
                          Your submitted solutions will appear here
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="text-white text-[13px] font-medium mb-2">
                      Balance
                    </div>
                    <div className="relative border border-white rounded-[10px] w-38.25 h-9.5 flex items-center justify-between px-3 mb-3">

                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">Credits</span>
                        <div className="w-px h-5 bg-white/50"></div>
                      </div>

                      <div className="text-white text-sm font-medium tracking-tight">
                        {balance}
                      </div>

                    </div>

                    <div className="text-white/90 text-xs text-center mb-5">
                      Every single day you will receive +3 lives
                    </div>

                    <div className="w-full h-px bg-white/50 mb-4"></div>

                    <button
                      onClick={handleAddFunds}
                      className="w-full bg-white cursor-pointer text-black py-2 rounded-[10px] text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2 font-circular"
                    >
                      <Image
                        src="/riddles/funds.svg"
                        width={21}
                        height={21}
                        alt="Fund"
                      />
                      Add Funds
                    </button>

                    <div className="w-full h-px bg-white/50 mt-4"></div>

                    <div className="flex justify-center mt-4">
                      <Tooltip text="Information" position="top">
                        <button
                          onClick={handleInfoClick}
                          title="Show info about this riddle"
                          className="p-1 hover:opacity-70 cursor-pointer transition-opacity"
                        >
                          <Image
                            src="/riddles/info.svg"
                            width={43}
                            height={38}
                            alt="Info"
                          />
                        </button>
                      </Tooltip>
                      <Tooltip text="Bug Report" position="top">
                        <button
                          onClick={handleBugReport}
                          className="p-1 hover:opacity-70 cursor-pointer transition-opacity"
                        >
                          <Image
                            src="/riddles/bug.svg"
                            width={43}
                            height={38}
                            alt="Bug Report"
                          />
                        </button>
                      </Tooltip>
                      <Tooltip text="Exit" position="top">
                        <button
                          onClick={handleExit}
                          className="p-1 hover:opacity-70 cursor-pointer transition-opacity"
                        >
                          <Image
                            src="/riddles/exit.svg"
                            width={43}
                            height={38}
                            alt="Exit to App"
                          />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <CommonPopup
            isOpen={panelState.isHintPopupOpen}
            title={panelState.hintPopupTitle || getCurrentHintInfo().title}
            message={panelState.hintPopupMessage || getCurrentHintInfo().text}
            buttonText="Got it!"
            onButtonClick={closeHintPopup}
          />

          <CommonPopup
            isOpen={panelState.showInfoPopup}
            title="Game Information"
            message={`
🎯 Current Riddle: ${riddleData?.title || "Loading..."}
📊 Level ID: ${riddleData?.level_number || "N/A"}
💰 Your Balance: €${balance?.toFixed(2) || "0.00"}

🎮 How to Play:
• Solve riddles to earn XP and progress
• Use hints if you're stuck (costs credits)
• You get 3 lives daily
• Wrong answers cost 1 life

💡 Hint Costs:
• General Hint: 1 credit
• Intermediate Hint: 3 credits
• Final Hint: 5 credits

Need more help? Visit the About page or report bugs using the bug icon.
        `}
            buttonText="Got it!"
            onButtonClick={() =>
              setPanelState((prev) => ({ ...prev, showInfoPopup: false }))
            }
          />

          <CommonInputModal
            isOpen={panelState.showBugModal}
            title="Report a Bug"
            description="Describe the issue or bug you encountered."
            placeholder="Write your bug report here..."
            onSubmit={submitBugReport}
            onCancel={() =>
              setPanelState((prev) => ({ ...prev, showBugModal: false }))
            }
            submitText="Submit"
            cancelText="Cancel"
            loading={isSubmitting}
          />
          <HintHelperModal
            isOpen={isHintModalOpen}
            hintData={hintModalData}
            onClose={() => setIsHintModalOpen(false)}
            account_id={accountId}
            riddle={riddleData?.id}
            mode={gameMode}
            mode_id={modeId}
            lives={lives}
            onUpdateLives={onUpdateLives}
          />

          {panelState.showLogoutPopup && (
            <div className="fixed inset-0 z-9999 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
              <div className="relative bg-black border-2 border-[#E3BE76] rounded-2xl p-6 w-90 shadow-2xl">
                <h2 className="text-[#E3BE76] text-lg font-bold mb-3 text-center">
                  Confirm Logout
                </h2>
                <p className="text-[#E3BE76] text-sm leading-relaxed text-center mb-4">
                  Are you sure you want to logout? Your progress will be saved, but
                  you'll need to sign in again to continue playing.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={cancelLogout}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="bg-[#E3BE76] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#d4a866] transition-colors text-sm cursor-pointer"
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="block sm:hidden w-full bg-[url('/sidebar/mobileSidebar.png')] fixed bottom-0 z-10 left-1/2 transform -translate-x-1/2 bg-no-repeat bg-cover border-2 border-t-[#FFEFD8] aspect-[375/70.56]">
        <img src={"/sidebar/mobileSidebar.png"} alt="Mobile Sidebar Background" width={375} height={70.56} />
        {session && (
          <>
            <div className="absolute left-0 top-0 h-full flex items-center gap-6 w-[36%] justify-evenly">
              <div onClick={() => setTabIndex?.(0)} className="flex flex-col justify-between items-center w-1/2 h-[70%]">
                <img src="/gamePlay/historyHelper.svg" width={22.88} height={22.88} />
                <span className="text-white text-xs">History</span>
              </div>

              <Link href="/game-rules" className="flex flex-col justify-between items-center w-1/2 h-[70%]">
                <img src="/gamePlay/gavel.svg" width={22} height={22} />
                <span className="text-white text-xs">Rules</span>
              </Link>
            </div>

            <div onClick={handleHelperClickMobile} className="absolute left-1/2 -top-4 -translate-x-1/2 flex flex-col items-center ">
              <div className=" w-15 h-15 rounded-full bg-[#330000] border-4 border-[#fbebd4] shadow-lg flex items-center justify-center">
                <img src="/gamePlay/star_shine.svg" width={26.75} height={23.75} />
              </div>
              <span className="pt-[6%] text-white text-xs font-medium font-noto-sans-jp select-none"> Helpers </span>
            </div>


            <div className="absolute right-0 top-0 h-full flex items-center gap-6 w-[36%] justify-evenly">
              <Link href="/payments" className="flex flex-col justify-between items-center w-1/2 h-[70%]">
                <img src="/gamePlay/contactless.svg" width={25.66} height={25.66} />
                <span className="text-white text-xs">Shop</span>
              </Link>

              <Link href="#" onClick={(e) => { e.preventDefault(); handleExit(); }} className="flex flex-col justify-between items-center w-1/2 h-[70%]">
                <img src="/gamePlay/undo.svg" width={22} height={18} />
                <span className="text-white text-xs">Back</span>
              </Link>
            </div>
          </>
        )}
      </div>
      {tabIndex === 0 && (
        <div className="fixed left-0 right-0 bottom-[calc(70/812*100vh)] rounded-md w-full h-[calc(390/812*100vh)] px-0.25">
          <div className="relative text-white h-full flex flex-col items-center rounded-md w-full">
            <img src={'/gamePlay/history.png'} alt="History Background" className="absolute rounded-t-md w-full h-full " />
            <div className="absolute w-[calc(375/375*100vw)]  h-[calc(390/812*100vh)] flex flex-col justify-between items-center ">
              <div className="w-[calc(375/375*100vw)] h-[calc(51/812*100vh)] p-0.5 flex flex-col justify-between items-center ">
                <div className="w-[calc(371/375*100vw)] rounded-t-2xl border-b-2 border-b-[#543D2A] h-[calc(51/812*100vh)] bg-[#3C2E22] p-0.5 flex flex-col justify-between items-center ">

                  <div className="w-[calc(321/375*100vw)] h-[calc(51/812*100vh)] flex justify-between items-center ">
                    <div className="w-[calc(100/375*100vw)] h-[calc(51/812*100vh)] flex justify-between items-center ">
                      <img src={'/gamePlay/history.svg'} alt="History Icon" width={18} height={18} />
                      <h3 className="text-md text-[#D4B588] uppercase font-semibold">History</h3>
                    </div>
                    <button onClick={() => setTabIndex?.(null)} className="text-white/70 hover:text-white" > <img src={'/gamePlay/crossIcon.svg'} alt="Cross icon" /> </button>
                  </div>
                </div>
              </div>

              <div className="h-[calc(334/812*100vh)] w-[calc(321/375*100vw)] overflow-y-auto space-y-2">
                {helpers.length > 0 ? (
                  helpers.map((helper, index) => (
                    <div key={index} className="text-white text-md"> {helper} </div>
                  ))
                ) : (
                  <div className="text-white/50 text-center text-sm italic"> Your submitted solutions will appear here </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {tabIndex === 1 && (
        <div className="fixed left-0 right-0 bottom-[calc(70/812*100vh)] rounded-md w-full h-[calc(390/812*100vh)] px-0.25">
          <div className="relative text-white h-full flex flex-col items-center rounded-md w-full">
            <img src={'/gamePlay/history.png'} alt="History Background" className="absolute rounded-t-md w-full h-full " />
            <div className="absolute w-[calc(375/375*100vw)]  h-[calc(390/812*100vh)] flex flex-col justify-between items-center ">
              <div className="w-[calc(375/375*100vw)] h-[calc(51/812*100vh)] p-0.5 flex flex-col justify-between items-center ">
                <div className="w-[calc(371/375*100vw)] rounded-t-2xl border-b-2 border-b-[#543D2A] h-[calc(51/812*100vh)] bg-[#3C2E22] p-0.5 flex flex-col justify-between items-center ">

                  <div className="w-[calc(321/375*100vw)] h-[calc(51/812*100vh)] flex justify-between items-center ">
                    <div className="w-[calc(100/375*100vw)] h-[calc(51/812*100vh)] flex justify-between items-center ">
                      <img src={'/gamePlay/star_shine_helper.svg'} alt="History Icon" width={24.97} height={22.17} />
                      <h3 className="text-md text-[#D4B588] uppercase font-bold">Helpers</h3>
                    </div>
                    <button onClick={() => { setTabIndex?.(null); setModalHintData(null); setDisplayText(""); }} className="text-white/70 hover:text-white" >
                     <img src={'/gamePlay/crossIcon.svg'} alt="Cross icon" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-[calc(336/812*100vh)] w-[calc(375/375*100vw)] ">
                <div className="h-[calc(144/812*100vh)] w-[calc(375/375*100vw)] flex ">
                  <div className={`h-[calc(144/812*100vh)] w-[calc(183/375*100vw)] ${isHintUsed || isHintLocked || lives === 0 || hintModalData?.message ? "opacity-50 pointer-events-none" : ""} flex flex-col items-center justify-center`} onClick={handlehintClick}>
                    <div className="h-[calc(102/812*100vh)] w-[calc(183/375*100vw)] flex flex-col justify-between items-center">
                      <div className={`${getHintIcon(hintModalData?.hint_type)} w-[37%] bg-no-repeat bg-contain rounded-md aspect-68/63`} />
                      {(!hintModalData?.message || hintModalData.message.trim() === "") && (
                        <h3 className="text-[#C0A160] text-md font-bold"> {hintModalData?.price} CREDITS</h3>
                      )}
                      <p>{formatHintType(hintModalData?.hint_type)} {hintModalData?.message}</p>
                    </div>
                  </div>
                  <img src={'/gamePlay/centerLine.svg'} className="h-[calc(144/812*100vh)] w-[calc(2/375*100vw)] " />
                  <div className="h-[calc(144/812*100vh)] w-[calc(183/375*100vw)] flex flex-col items-center justify-center" onClick={handleAddLives}>
                    <div className="h-[calc(102/812*100vh)] w-[calc(183/375*100vw)] flex flex-col justify-between items-center ">
                      <img src={'/gamePlay/filter_tilt_shift.svg'} alt="Filter shift" width={58.03} height={58} />
                      <h3 className="text-[#C0A160] text-md font-bold"> 20 CREDITS </h3>
                      <p className="text-white text-sm "> +5 Lives </p>
                    </div>
                  </div>
                </div>
                <div className="h-[calc(71/812*100vh)] w-[calc(375/375*100vw)] flex flex-col justify-between">
                  <img src={'/gamePlay/secondCenter.svg'} alt="Center Line" className="w-full" />
                  <div className="flex justify-between items-center">
                    <h3 className={`italic ${displayText ? "w-[75%]" : "w-full"} text-white text-center`}>{displayText || "Your hint will be displayed here"} </h3>
                    {displayText && (
                      <div className="w-10 h-10 bg-[url('/riddles/content_copy.png')] object-contain aspect-[12.75/15] bg-no-repeat bg-center mr-6 cursor-pointer"
                        onClick={() => { if (modalHintData?.hint) { navigator.clipboard.writeText(modalHintData.hint); toast.success("Hint copied to clipboard!"); } }}
                      />
                    )}
                  </div>
                  <img src={'/gamePlay/secondCenter.svg'} alt="Center Line" className="w-full" />
                </div>
                <div className="h-[calc(120/812*100vh)] w-[calc(375/375*100vw)] flex  items-center justify-center">
                  <div className="h-[calc(70/812*100vh)] w-[calc(321/375*100vw)] flex flex-col justify-between">
                    <div className="h-[calc(40/812*100vh)] w-[calc(321/375*100vw)] flex items-center justify-between">
                      <div className="h-[calc(40/812*100vh)] w-[calc(152/375*100vw)] border border-white rounded-md flex items-center justify-center">
                        <div className="h-[calc(40/812*100vh)] w-[calc(125/375*100vw)]  rounded-md flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-medium">Credits</span>
                            <div className="w-px h-5 bg-white/50"></div>
                          </div>

                          <div className="text-white text-sm font-medium tracking-tight"> {balance} </div>
                        </div>
                      </div>
                      <div className="h-[calc(40/812*100vh)] w-[calc(152/375*100vw)] border border-[#D4B588] bg-[#3c1c13] rounded-md flex items-center justify-between">
                        <button onClick={handleAddFunds} className="w-full cursor-pointer font-bold text-[#D4B588] uppercase text-md transition-colors flex items-center justify-center gap-2 font-circular" >
                          <Image src="/gamePlay/adjust.svg" width={21} height={21} alt="Fund" />
                          Add Funds
                        </button>
                      </div>
                    </div>
                    <h3 className="italic text-white text-center">Every Single day you will receive +3 Lives </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
