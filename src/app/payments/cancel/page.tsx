"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserLayout from "@/components/layouts/userLayout";
import { routes } from "@/lib/routes";

const PaymentCancelPage: React.FC = () => {
  const router = useRouter();

  const handleTryAgain = () => {
    router.push(routes.ui.payments.index);
  };

  const handleContinue = () => {
    const redirectUrl = localStorage.getItem("redirectUrl") || "/";
    router.push(redirectUrl);
  };

  return (
    <UserLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-[#534741] border border-[#FFCE96B2] rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">
              Payment Cancelled
            </h1>

            <p className="text-[#D4B588] text-lg mb-6">
              Your payment was cancelled. No charges were made to your account. You can try again anytime.
            </p>

            <div className="bg-[#6C5C434D] rounded-lg p-4 mb-6">
              <p className="text-[#D4B588] text-sm">
                Need help? Contact our support team for assistance with your purchase.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleTryAgain}
                className="w-full bg-gradient-to-r from-[#FFCE96] to-[#D4B588] text-black font-bold py-3 px-6 rounded-lg hover:from-[#D4B588] hover:to-[#FFCE96] transition-all duration-300"
              >
                Try Again
              </button>

              <button
                onClick={handleContinue}
                className="w-full border border-[#FFCE96] text-[#FFCE96] font-bold py-3 px-6 rounded-lg hover:bg-[#FFCE96] hover:text-black transition-all duration-300"
              >
                Continue Playing
              </button>

              <Link
                href={routes.ui.root}
                className="block w-full text-[#D4B588] hover:text-white transition-colors duration-300 text-center py-2"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default PaymentCancelPage;
