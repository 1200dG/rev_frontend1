"use client";

import { handleApiError } from "@/lib/errorHandler";
import { getCheckoutData } from "@/lib/services/paymentActions";
import { PaymentModalProps } from "@/lib/types/common/types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PaymentModal: React.FC<PaymentModalProps> = ({ onBack, success }) => {
  const router = useRouter();
  const search = useSearchParams();
  const session = React.useMemo(() => search.get("session_id") ?? "", [search]);
  const token = React.useMemo(() => search.get("token") ?? "", [search]);

  const [amount, setAmount] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session) {
          const res = await getCheckoutData(session);
          setAmount(res.amount)
        } else if (token) {
          const res = await getCheckoutData(token);
          setAmount(res.amount);
        } else {
          return;
        }
      } catch (err) {
        handleApiError(err);
      }
    };

    fetchData();
  }, [session, token]);

  const continePlaying = () => {
    const redirectUrl = localStorage.getItem("redirectUrl");
    if (redirectUrl) {
      router.push(redirectUrl);
      localStorage.removeItem("redirectUrl");
    } else {
      router.push('/gamehub');
    }
  };

  return (
    <div className="flex justify-center items-center fixed inset-0 z-50">
      <div className="absolute inset-0 bg-transparent backdrop-blur-sm pointer-events-none" />

      <div className="z-10 flex flex-col items-center justify-center border-2 border-[#d4b588] sm:border-none bg-[#260c06]/70 sm:bg-transparent sm:bg-[url('/payments/paymentModal.png')] sm:bg-no-repeat sm:bg-contain sm:bg-center rounded-md  w-[calc(321/375*100vw)] h-[calc(350/812*100vh)] px-4 gap-3 sm:w-[calc(395.1/1440*100vw)] sm:h-[calc(420/900*100vh)] " >
        <div className=" bg-[url('/landingPage/pulseAura.svg')] bg-no-repeat bg-contain bg-center flex items-center justify-center w-[calc(140/375*100vw)] h-[calc(140/812*100vh)] sm:w-full sm:max-w-50 sm:aspect-[392.3/419]" >
          <div className=" bg-[url('/payments/circle.svg')] bg-no-repeat bg-contain bg-center flex justify-center items-center w-[calc(108/375*100vw)] h-[calc(108/812*100vh)] sm:w-full sm:max-w-40 sm:aspect-98/98">
            <div className={` ${success ? "bg-[url('/payments/check.svg')]" : "bg-[url('/payments/crosss.svg')]"} bg-no-repeat bg-contain bg-center w-[calc(50/375*100vw)] h-[calc(50/812*100vh)] sm:w-full sm:max-w-17.5 sm:aspect-[42.31/42.31]`} />
          </div>
        </div>

        <h1 className="text-white text-md sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold"> {success ? "Purchase Completed" : "Payment Cancelled"} </h1>
        <div className="flex flex-col items-center">
          <p className="text-s sm:text-sm md:text-xs lg:text-xs xl:text-md 2xl:text-lg text-white"> {success ? "Your account got credited." : "No charges were made to your account."} </p>
          <p className={`text-s sm:text-sm md:text-xs ${amount > 0 ? "text-[#d4b588] font-bold lg:text-lg xl:text-xl 2xl:text-2xl" : "text-white lg:text-xs xl:text-md 2xl:text-lg"}`}> {!success ? "You can try again anytime." : amount == 0 ? "Loading ..." : amount + " Credits"} </p>
        </div>
        {!success &&
          <button className=" aspect-195/32 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-s md:text-sm lg:text-xs xl:text-md 2xl:text-lg border border-[#d4b588] bg-[#2e0a0a] text-[#d4b588] rounded-md font-bold cursor-pointer hover:shadow-[0_0_8px_#FACC15]" onClick={() => router.push('/payments')}> Try Again </button>
        }
        <button className={`aspect-195/32 sm:px-6 py-1.5 sm:py-2 text-s sm:text-s md:text-sm lg:text-xs xl:text-md 2xl:text-lg border border-[#d4b588] ${success ? "bg-[#2e0a0a] mt-[3%]" : "bg-[#1b221f]"} text-[#d4b588] rounded-md font-bold cursor-pointer hover:shadow-[0_0_8px_#FACC15]`} onClick={() => continePlaying()}> Continue Playing </button>
        <p onClick={() => router.push('/gamehub')} className="text-s sm:text-sm md:text-xs lg:text-xs xl:text-md 2xl:text-lg text-white cursor-pointer hover:drop-shadow-[0_0_5px_#facc15]"> Back to Home </p>

      </div>
    </div>

  )
};


export default PaymentModal;
