"use client";

import React from "react";
import Image from "next/image";
import { createCheckoutSession, redirectToStripe } from "@/lib/services/paymentActions";
import { toast } from "react-toastify";
import { handleApiError } from "@/lib/errorHandler";

interface OutOfLivesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OutOfLivesModal: React.FC<OutOfLivesModalProps> = ({ isOpen, onClose }) => {
  const handlePurchaseLives = async () => {
    try {
      // Product ID 3 is for lives (5 lives for $2.99) based on memories
      const checkoutResponse = await createCheckoutSession(3);
      await redirectToStripe(checkoutResponse.session_id);
    } catch (error) {
      handleApiError(error, "Failed to initiate purchase. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black border border-[#FFCE96B2] rounded-[20px] p-6 max-w-md w-full mx-4 shadow-lg">
        <div className="text-center">
          <div className="mb-4">
            <Image
              src="/riddles/lives.svg"
              width={48}
              height={48}
              alt="No Lives"
              className="mx-auto opacity-50"
            />
          </div>
          
          <h2 className="text-[#E3BE76] text-xl font-bold mb-2">
            Out of Lives!
          </h2>
          
          <p className="text-white/70 text-sm mb-6">
            You've run out of lives. Purchase more lives to continue playing riddles.
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={handlePurchaseLives}
              className="w-full bg-[#E3BE76] text-black py-3 rounded-[10px] font-bold text-sm hover:bg-[#E3BE76]/90 transition-colors"
            >
              Purchase Lives ($2.99)
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-transparent border border-white/30 text-white py-3 rounded-[10px] font-medium text-sm hover:bg-white/10 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutOfLivesModal;
