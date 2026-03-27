"use client";
import { useEffect } from "react";
import { CommonPopupProps } from "@/lib/types/common/types";

export default function CommonPopup({
  isOpen,
  title,
  message,
  buttonText,
  onButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick
}: CommonPopupProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="relative bg-black border-2 border-[#E3BE76] rounded-2xl p-6 w-90 shadow-2xl">
        <h2 className="text-[#E3BE76] text-lg font-bold mb-3 text-center">
          {title}
        </h2>

        <p className="text-[#E3BE76] text-sm leading-relaxed text-center mb-4">
          {message}
        </p>

        <div className="flex justify-center gap-3">
          {secondaryButtonText && onSecondaryButtonClick &&(
            <button
              onClick={onSecondaryButtonClick || undefined}
              className="bg-transparent border border-[#E3BE76] text-[#E3BE76] px-6 py-2 rounded-lg font-medium hover:bg-[#3b2f1a] transition-colors text-sm cursor-pointer"
            >
              {secondaryButtonText}
            </button>
          )}
          {buttonText && (
            <button
            onClick={onButtonClick || undefined}
            className="bg-[#E3BE76] text-black px-6 py-2 rounded-lg font-medium hover:bg-[#d4a866] transition-colors text-sm cursor-pointer"
            >
              {buttonText}
            </button>
          )
        }
        </div>
      </div>
    </div>
  );
}
