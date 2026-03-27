"use client";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { BottomSolveAreaProps, SolveFormData } from "@/lib/types/common/types";
import { useState, useEffect, useRef } from "react";

export default function BottomSolveArea({
  levelDescription = "What's missing?",
  onSubmit,
  isLoading = false,
  placeholder = "Solve it here...",
  riddleId = 1,
  riddleData = null,
  gameMode = "OTHER",
  success,
}: BottomSolveAreaProps) {
  const { register, handleSubmit, reset } = useForm<SolveFormData>();
  const [borderColor, setBorderColor] = useState("border border-white/50");
  const [inputDisabled, setInputDisabled] = useState(isLoading);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFormSubmit = (data: SolveFormData) => {
    if (onSubmit && riddleId) {
      onSubmit(data.solution, riddleId);
    }
    reset();
  };

  useEffect(() => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (success === "True") {
      setBorderColor("border-2 border-green-500");
      setInputDisabled(true);
      return;
    }

    if (success === "False") {
      setBorderColor("border-2 border-red-500");
      setInputDisabled(true);
      setShowIncorrect(true);

      timeoutRef.current = setTimeout(() => {
        setBorderColor("border border-white/50");
        setInputDisabled(false);
        setShowIncorrect(false);
      }, 1500);

      return;
    }
    setBorderColor("border border-white/50");
    setInputDisabled(isLoading);
  }, [success, isLoading]);

  return (
    <div className="sm:px-6 sm:py-4 w-full">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {success === "True" && (
            <div className="mb-2 text-white font-bold text-center">
              Correct!
            </div>
          )}
          {showIncorrect && (
            <div className="mb-2 text-white font-bold text-center">
              Incorrect Answered !
            </div>
          )}

          <div className="relative">
            <input
              {...register("solution", {
                required: true,
                maxLength: {
                  value: 20,
                  message: "Solution cannot exceed 25 characters",
                },
              })}
              type="text"
              placeholder={placeholder}
              disabled={inputDisabled}
              autoComplete="off"
              className={`w-full bg-transparent border rounded-full px-6 py-2 pr-12 text-white placeholder-white/50 focus:outline-none ${borderColor}`}
            />
            <button
              type="submit"
              disabled={inputDisabled}
              className={`absolute right-2 top-1/2 -translate-y-1/2 bg-transparent text-white w-8 h-8 font-bold disabled:cursor-not-allowed flex items-center justify-center`}
            >
              <Image
                src="/dashboard/errEast.svg"
                width={38}
                height={36}
                alt="Submit arrow"
                className="mr-1"
              />
            </button>
          </div>
          <div className="text-center mt-3">
            <span className="text-white/60 text-sm">
              {gameMode === "DAILY" ? `Daily Riddle: ${riddleData?.title ?? ""}`
                : riddleData?.level_number ? `Level ${riddleData.level_number}: ${riddleData.title}` : `Level ${riddleId}: ${levelDescription}`}
            </span>
          </div>
          <div className="block sm:hidden h-[calc(15/812*100vh)]"></div>
        </form>
      </div>
    </div>
  );
}
