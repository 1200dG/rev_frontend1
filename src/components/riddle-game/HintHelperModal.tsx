"use client";

import { handleApiError } from "@/lib/errorHandler";
import { addLives, getHintData } from "@/lib/services/riddleActions";
import { HintData, HintHelperModalProps } from "@/lib/types/common/types";
import { formatHintType, getHintIcon } from "@/lib/utils/helpers";
import React, { useState } from "react";
import { toast } from "react-toastify";

const HintHelperModal: React.FC<HintHelperModalProps> = ({
  isOpen,
  onClose,
  hintData,
  account_id,
  riddle,
  mode,
  mode_id,
  lives,
  onUpdateLives,
}) => {

  const [modalHintData, setModalHintData] = useState<HintData | null>(null);
  const [isHintUsed, setIsHintUsed] = useState<boolean>(false);

  if (!isOpen) return null;
  const handlehintClick = async () => {

    if (isHintUsed) return;

    if (!riddle || !account_id) {
      toast.error("Missing required data for hint usage");
      return;
    }
    try {
      const requestData = {
        account_id: account_id,
        riddle: riddle,
        mode: mode,
        mode_id: mode_id,
      };

      const response = await getHintData(requestData);
      if (response.hint) {
        setModalHintData(response);
        onUpdateLives(response.user.lives, response.user.credits);
        setIsHintUsed(true);
      }
      if (response.message) {
        toast.success(response?.message);
        setIsHintUsed(true);
      }
    } catch (error: unknown) {
      console.error("Failed to use hint:", error);
      handleApiError(error);
    }
  };

  const handleAddLives = async () => {

    if (!riddle || !account_id) {
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
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      <div className="absolute inset-0 bg-transparent backdrop-blur-sm"></div>

      <div className="relative w-full max-w-162.5">
        <div className={`flex flex-col items-center justify-between w-full px-[3%] gap-5 rounded-md ${modalHintData ? "aspect-443/192" : "aspect-443/155"}`}>
          <img
            src={modalHintData === null ? "/riddles/HelperModal1.png" : "/riddles/helperModal.png" }
            alt="Hint Helper Top"
            className=" w-full h-full rounded-md"
          />

          <div className="absolute flex items-center justify-between w-full">
            <div className="w-full flex flex-col items-center justify-center relative px-4 py-2 gap-6">
              <div className={` flex items-center justify-between w-full ${modalHintData ? "pt-[3%] pb-[1%]" : "py-[5%]"}`}>
                <div className={`w-1/2 flex flex-col items-center justify-center cursor-pointer px-[3%] ${isHintUsed || lives == 0 || hintData?.message? "opacity-50 pointer-events-none" : ""}`} onClick={handlehintClick}>
                  <div className={`${getHintIcon(hintData?.hint_type)} w-[35%] bg-no-repeat bg-contain rounded-md aspect-68/63`} />
                  {(!hintData?.message || hintData.message.trim() === "") && (
                    <p className="text-sm sm:text-xs md:text-md lg:text-lg xl:text-xl 2xl:text-3xl font-bold text-[#E4BD6E]">
                      {hintData?.price} Credits
                    </p>
                  )}
                  <p className={`text-white text-xs sm:text-s md:text-sm lg:text-xs xl:text-md 2xl:text-lg ${hintData?.message ? "mt-[8%]" : "mt-[0%]"}`}>
                    {formatHintType(hintData?.hint_type)} {hintData?.message}
                  </p>
                </div>

                <div className="w-13px h-130px bg-[url('/riddles/linehelper.png')] bg-no-repeat bg-center bg-cover" />

                <div className="w-1/2 flex flex-col items-center justify-center gap-2 px-[3%] cursor-pointer" onClick={handleAddLives}>
                  <div className="bg-[url('/payments/heart.png')] flex flex-col items-center justify-center w-[35%] bg-no-repeat bg-contain px-[3%] rounded-md aspect-68/63" />
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm sm:text-xs md:text-md lg:text-lg xl:text-xl 2xl:text-3xl font-bold text-[#E4BD6E]">
                      20 Credits
                    </p>
                    <p className="text-white text-xs sm:text-s md:text-sm lg:text-xs xl:text-md 2xl:text-lg">
                      +5 LIVES
                    </p>
                  </div>
                </div>
              </div>
              <div className={`w-full h-full flex flex-col items-center justify-between ${modalHintData ? "flex" : "hidden"}`}>
                <div className="w-full h-0.5 bg-[url('/riddles/lineCenter.svg')] bg-no-repeat bg-cover" />
                <div className="flex items-center w-full justify-between mt-[1%]">
                  <p className="text-white text-xs sm:text-sm md:text-sm lg:text-xs xl:text-md 2xl:text-lg text-center flex-1 pl-[5%]">
                    {modalHintData?.hint}
                  </p>

                  <div className="w-10 h-10 bg-[url('/riddles/content_copy.png')] object-contain aspect-[12.75/15] bg-no-repeat bg-center mr-4 cursor-pointer"
                    onClick={() => { if (modalHintData?.hint) { navigator.clipboard.writeText(modalHintData.hint); toast.success("Hint copied to clipboard!"); } }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-center text-white text-xs sm:text-s md:text-sm lg:text-xs xl:text-md 2xl:text-lg mt-2 cursor-pointer hover:underline"
            onClick={() => {
              setModalHintData(null);
              setIsHintUsed(false);
              onClose();
            }}>
            Click here to leave the window
          </p>
        </div>
        <div className="absolute left-1/2 -top-5 transform -translate-x-1/2">
          <button className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-xs md:text-md lg:text-lg xl:text-xl 2xl:text-2xl border-2 border-[#d4b588] bg-[#2e0a0a] text-[#d4b588] rounded-full font-bold transition">
            HELPERS
          </button>
        </div>
      </div>
    </div >
  );
};

export default HintHelperModal;
