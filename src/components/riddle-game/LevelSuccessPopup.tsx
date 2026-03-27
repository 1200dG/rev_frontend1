"use client";
import { useEffect } from "react";
import { LevelSuccessProps } from "@/lib/types/common/types";
import Image from "next/image";

export default function LevelSuccessPopup({
  isOpen,
  level,
  onButtonClick,
  bottomSolveArea,
}: LevelSuccessProps) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProceed = () => {
    onButtonClick?.();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">

      <div className="relative bg-black/30 backdrop-blur-sm gap-2 rounded-2xl cursor-pointer p-6 w-90 shadow-2xl" onClick={handleProceed}>

        <div className="text-white mb-3 text-sm">
          Level {level} - Success
        </div>
        <div className="relative w-52 md:w-72 mb-4">
          <Image
            src="/footer/logo.svg"
            alt="Level logo"
            width={300}
            height={300}
            priority
          />
        </div>
        <div className="flex flex-col items-center justify-center">

          <p className="text-[#E4BD6E] text-sm mb-2 cursor-pointer">
            Progress to the next level
          </p>

          <div className="text-white text-4xl  animate-bounce cursor-pointer select-none">
            ⌄
          </div>
        </div>
        {/* <div className="fixed bottom-0 z-10 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
                    {bottomSolveArea && (
                        <div className="absolute bottom-2 w-full flex justify-center px-4">
                            <div className="w-full">
                                {bottomSolveArea}
                            </div>
                        </div>
                    )}
                </div> */}
      </div>
    </div>
  );
}
