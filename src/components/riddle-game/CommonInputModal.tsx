"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CommonInputModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  placeholder?: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
}

export default function CommonInputModal({
  isOpen,
  title,
  description,
  placeholder = "Type your message...",
  onSubmit,
  onCancel,
  submitText = "Submit",
  cancelText = "Cancel",
}: CommonInputModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
  if (!isOpen) {
    setInputValue("");
  }
}, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async() => {
    if (inputValue.trim() === "") {
    toast.warn("Please describe the issue before submitting.");
    return;
  }

  try {
    setLoading(true);
    await onSubmit(inputValue);
    setInputValue(""); 
  } catch (err) {
    console.error("Error submitting:", err);
  } finally {
    setLoading(false);
  }

  };

  const handleCancel = () => {
    setInputValue(""); 
    onCancel();        
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleCancel}
      ></div>

      <div className="relative bg-black border-2 border-[#E3BE76] rounded-2xl p-6 w-[90%] max-w-md shadow-2xl z-10">
        <h2 className="text-[#E3BE76] text-lg font-bold mb-3 text-center">
          {title}
        </h2>

        {description && (
          <p className="text-[#E3BE76] text-sm text-center mb-4">
            {description}
          </p>
        )}

        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-28 bg-transparent border border-[#E3BE76] rounded-lg p-3 text-[#E3BE76] placeholder-[#bfa96b] focus:outline-none focus:ring-1 focus:ring-[#E3BE76] resize-none mb-4"
        />

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="bg-transparent border border-[#E3BE76] text-[#E3BE76] px-6 py-2 rounded-lg font-medium hover:bg-[#3b2f1a] transition-colors text-sm cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 text-black rounded-lg font-medium transition-colors text-sm ${
    loading
      ? "bg-[#bfa96b] opacity-60 cursor-not-allowed"
      : "bg-[#E3BE76] hover:bg-[#d4a866] cursor-pointer"
  } `}
          >
            {loading ? "Submitting..." : submitText}
          </button>
        </div>
      </div>
    </div>
  );
}
