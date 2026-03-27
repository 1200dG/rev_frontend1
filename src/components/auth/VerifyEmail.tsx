import React, { useEffect, useState } from "react";
import { verifyEmailAction } from "@/lib/services/authActions";
import { EmailStatus } from "@/lib/types/common/types";
import { useSearchParams, useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { handleApiError } from "@/lib/errorHandler";

const VerifyEmail: React.FC = () => {
  const [emailStatus, setEmailStatus] = useState<EmailStatus>({
    status: "Loading",
    message: "",
  });
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    verifyEmail();
  });
  
  const verifyEmail = async () => {
    try {
      if (!searchParams) {
        setEmailStatus({
          status: "error",
          message: "Unable to access URL parameters",
        });
        return;
      }

      const token = searchParams.get("token");
      if (!token) {
        setEmailStatus({
          status: "error",
          message: "Invalid or missing token",
        });
        return;
      }
      const response = await verifyEmailAction(token);
      if (response?.data) {
        setEmailStatus({
          status: "success",
          message: "Email verified successfully! Redirecting to login...",
        });
        setTimeout(() => {
          router.push(routes.ui.auth.signIn);
        }, 2000);
      }
    } catch (error) {
      setEmailStatus({
        status: "error",
        message: `Invalid or expired verification link ${error}`,
      });
      handleApiError(error, "Email verification failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#120A03] relative overflow-hidden flex items-center justify-center">
      <div className="relative z-10 flex flex-col items-center px-4 sm:px-0 gap-4 w-full max-w-md sm:max-w-lg text-white font-circular">
        {emailStatus.status === "Loading" && (
          <p className="text-lg font-medium">Verifying your email....</p>
        )}
        {emailStatus.status === "success" ||
          (emailStatus.status === "error" && (
            <div className="text-center">
              <p
                className={`text-lg ${emailStatus.status === "error" ? "text-red-600" : "text-green-500"}`}
              >
                {emailStatus.message}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default VerifyEmail;
