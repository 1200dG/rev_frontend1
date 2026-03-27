"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserLayout from "@/components/layouts/userLayout";
import { routes } from "@/lib/routes";

const PaymentSuccessContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    const redirectUrl = localStorage.getItem("redirectUrl") || "/";
    router.push(redirectUrl);
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFCE96] mx-auto mb-4"></div>
            <p className="text-white text-lg">Processing your payment...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-[#534741] border border-[#FFCE96B2] rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">
              Payment Successful!
            </h1>

            <p className="text-[#D4B588] text-lg mb-6">
              Thank you for your purchase! Your credits and lives have been added to your account.
            </p>

            {sessionId && (
              <div className="bg-[#6C5C434D] rounded-lg p-4 mb-6">
                <p className="text-[#D4B588] text-sm mb-2">Transaction ID:</p>
                <p className="text-white font-mono text-xs break-all bg-black/20 p-2 rounded">
                  {sessionId}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-[#FFCE96] to-[#D4B588] text-black font-bold py-3 px-6 rounded-lg hover:from-[#D4B588] hover:to-[#FFCE96] transition-all duration-300"
              >
                Continue Playing
              </button>

              <Link
                href={routes.ui.profile}
                className="block w-full text-[#FFCE96] hover:text-white transition-colors duration-300 text-center py-2"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

const LoadingFallback: React.FC = () => (
  <UserLayout>
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FFCE96] mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  </UserLayout>
);

const PaymentSuccessPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;
