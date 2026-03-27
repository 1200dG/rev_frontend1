"use client";

import { CheckoutPageProps } from "@/lib/types/common/types";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { createStripeCheckoutSession } from "@/lib/services/stripeActions";
import { useSession } from "next-auth/react";
import { useAppContext } from "@/lib/hooks/useAppContext";
import { cardAssetsMobile } from "@/lib/constants/payment";
import { createPayPalCheckoutSession } from "@/lib/services/paypalActions";
import { BeatLoader } from "react-spinners";

enum PaymentMethod {
  Stripe = "Stripe",
  PayPal = "PayPal",
}
const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, selectedProduct }: CheckoutPageProps) => {

  const [selectedPayment, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isCollapsed } = useAppContext();
  const { data: session } = useSession();
  const handlePurchase = async () => {
    try {
      await createStripeCheckoutSession(selectedProduct, session?.user?.email);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process payment. Please try again.');
    }
  };

  const handlePayPal = async () => {
    try {
      const response = await createPayPalCheckoutSession(selectedProduct);
      window.location.href = response.data.approval_url;
    } catch (error) {
      setIsLoading(false);
      toast.error(error instanceof Error ? error.message : 'Failed to process payment. Please try again.');
    }
  };

  const paymentConfirmHande = () => {
    if (selectedPayment === PaymentMethod.Stripe) {
      handlePurchase();
      setIsLoading(true);
    }
    else {
      handlePayPal();
      setIsLoading(true);
    }
  }
  return (
    <>
      <div className="hidden sm:block">
        <div className={`flex flex-col items-center ${isCollapsed ? " w-[calc(1392/1440*100vw)]" : "w-[calc(1312/1440*100vw)]"} h-[calc(407/900*100vh)]`}>
          <div className={`flex flex-col ${isCollapsed ? " w-[calc(1286/1440*100vw)]" : "w-[calc(1158/1440*100vw)]"} h-[calc(87/900*100vh)]`}>
            <div>
              <button className="inline-flex items-center gap-1 py-1.5 rounded-md transition-all duration-200 cursor-pointer hover:drop-shadow-[0_0_5px_#facc15]" onClick={onBack} >
                <Image src="/clash/arrow_back.svg" alt="Back Icon" height={14} width={14} />
                <p className="whitespace-nowrap text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-sm 2xl:text-base  font-medium text-[#898989] "> BACK </p>
              </button>
            </div>
            <h1 className="text-white text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold"> CheckOut </h1>
          </div>
          <div className={`${isCollapsed ? " w-[calc(1286/1440*100vw)]" : "w-[calc(1158/1440*100vw)]"} h-[calc(327/900*100vh)] flex justify-between`}>
            {/* Card 1 */}

            <div className={`relative ${isCollapsed ? " w-[calc(273.5/1440*100vw)]" : "w-[calc(246.27/1440*100vw)]"} h-[calc(327/900*100vh)] rounded-md overflow-hidden flex flex-col `}>
              <img src="/payments/card1.png" className={`absolute ${isCollapsed ? " w-[calc(273/1440*100vw)]" : "w-[calc(246/1440*100vw)]"} h-[calc(327/900*100vh)] `} />
              <div className={`absolute flex flex-col justify-center items-center ${isCollapsed ? " w-[calc(273.5/1440*100vw)]" : "w-[calc(246.27/1440*100vw)]"} h-[calc(327/900*100vh)]`}>
                <div className={`relative flex justify-center items-center gap-2 ${isCollapsed ? " w-[calc(157.64/1440*100vw)]" : "w-[calc(142.03/1440*100vw)]"} h-[calc(147.9/900*100vh)]`}>
                  <img src="/landingPage/pulseAura.svg" alt="Pulse Aura" className={`relative ${isCollapsed ? " w-[calc(120.5/1440*100vw)]" : "w-[calc(108.57/1440*100vw)]"} h-[calc(113.07/900*100vh)]`} />
                  <img src="/payments/card1inn.png" className={`absolute`} alt="Card Inner" />
                </div>

                <div className={`flex flex-col justify-between items-center h-[calc(130/900*100vh)] ${isCollapsed ? " w-[calc(246.64/1440*100vw)]" : "w-[calc(222.22/1440*100vw)]"}`}>
                  <h3 className="text-white text-sm sm:text-base md:text-md lg:text-md xl:text-xl 2xl:text-2xl font-semibold"> {selectedProduct?.quantity} {selectedProduct?.type} </h3>
                  <p className="text-gray-400 text-sm text-center"> {selectedProduct?.description} </p>
                  <div className={`${isCollapsed ? " w-[calc(246.64/1440*100vw)]" : "w-[calc(200.22/1440*100vw)]"} h-0.75 bg-[url('/payments/Line.png')] bg-no-repeat bg-cover my-2`} />
                  <span className="text-xs sm:text-base md:text-md lg:text-lg xl:text-xl 2xl:text-3xl font-bold text-[#E4BD6E]"> {selectedProduct ? `$${selectedProduct.price}` : '$0.00'} </span>
                </div>
              </div>
            </div>


            {/* Card 2 */}
            <div className={`relative ${isCollapsed ? " w-[calc(995/1440*100vw)]" : "w-[calc(895.96/1440*100vw)]"} h-[calc(327/900*100vh)] rounded-md overflow-hidden flex flex-col justify-center items-center`}>
              <img src="/payments/checkoutbgcard.png" className={`absolute ${isCollapsed ? " w-[calc(994.75/1440*100vw)]" : "w-[calc(895.73/1440*100vw)]"} h-[calc(327/900*100vh)] `} />
              <div className={`absolute flex flex-col justify-between ${isCollapsed ? " w-[calc(935/1440*100vw)]" : "w-[calc(841.93/1440*100vw)]"} h-[calc(277/900*100vh)]`}>
                <div className={`flex flex-col justify-between ${isCollapsed ? " w-[calc(935/1440*100vw)]" : "w-[calc(841.93/1440*100vw)]"} h-[calc(67/900*100vh)]`}>
                  <p className="text-s sm:text-sm md:text-xs lg:text-md xl:text-lg 2xl:text-xl text-[#E4BD6E]">
                    Great Choice!
                    <span className="text-white"> Your account will receive </span>
                    45 CREDITS
                  </p>
                  <div className="w-full h-0.5 bg-[#d4b588]" />

                  <p className="text-s sm:text-sm md:text-xs lg:text-md xl:text-lg 2xl:text-xl text-white"> Select your preferred method of payment. </p>
                </div>

                <div className={`flex justify-between ${isCollapsed ? " w-[calc(403/1440*100vw)]" : "w-[calc(362.88/1440*100vw)]"} h-[calc(118/900*100vh)]`}>
                  <div className={`relative ${isCollapsed ? " w-[calc(193/1440*100vw)]" : "w-[calc(173.79/1440*100vw)]"} h-[calc(118/900*100vh)] flex items-center justify-center  rounded-2xl cursor-pointer ${selectedPayment === PaymentMethod.PayPal ? "scale-[1.05] brightness-105" : "hover:scale-[1.03] hover:shadow-[0_0_7px_#FACC15]"}`} onClick={() => setSelectedPaymentMethod(PaymentMethod.PayPal)}>
                    <img src="/payments/payment_bgcheckout.png" className={`absolute ${isCollapsed ? " w-[calc(193/1440*100vw)]" : "w-[calc(173.79/1440*100vw)]"} h-[calc(118/900*100vh)] `} />
                    {selectedPayment === PaymentMethod.PayPal && (
                      <div className="absolute inset-0 ring-2 ring-yellow-400 rounded-2xl pointer-events-none animate-pulse"></div>
                    )}
                    <img src="/payments/PayPal.svg" className={` ${isCollapsed ? " w-[calc(78.85/1440*100vw)]" : "w-[calc(71.00/1440*100vw)]"} h-[calc(68.43/900*100vh)] `} />
                  </div>

                  {/* <div className={`relative ${isCollapsed ? " w-[calc(193/1440*100vw)]" : "w-[calc(173.79/1440*100vw)]"} h-[calc(118/900*100vh)] flex items-center justify-center rounded-2xl cursor-pointer ${selectedPayment === PaymentMethod.Stripe ? "scale-[1.05] brightness-105" : "brightness-100 hover:scale-[1.03] hover:brightness-105 hover:shadow-[0_0_7px_#FACC15]"}`} onClick={() => setSelectedPaymentMethod(PaymentMethod.Stripe)}>
                    <img src="/payments/payment_bgcheckout.png" className={`absolute ${isCollapsed ? " w-[calc(193/1440*100vw)]" : "w-[calc(173.79/1440*100vw)]"} h-[calc(118/900*100vh)] `} />
                    {selectedPayment === PaymentMethod.Stripe && (
                      <div className="absolute inset-0 ring-2 ring-yellow-400 rounded-2xl pointer-events-none animate-pulse"></div>
                    )}
                    <img src="/payments/Stripe.svg" className={` ${isCollapsed ? " w-[calc(100.42/1440*100vw)]" : "w-[calc(90.42/1440*100vw)]"} h-[calc(41.64/900*100vh)] `} />
                  </div> */}
                </div>

                <div className={`${isCollapsed ? " w-[calc(935/1440*100vw)]" : "w-[calc(841.93/1440*100vw)]"} h-[calc(48/900*100vh)]`}>
                  <div className={`${isCollapsed ? " w-[calc(935/1440*100vw)]" : "w-[calc(841.93/1440*100vw)]"} h-[calc(13/900*100vh)] flex items-center`}>
                    <p className="text-sm sm:text-sm md:text-sm lg:text-xs xl:text-md 2xl:text-lg text-white"> Integrated with </p>
                  </div>
                  <div className={`flex justify-between ${isCollapsed ? " w-[calc(935/1440*100vw)]" : "w-[calc(841.93/1440*100vw)]"} h-[calc(39/900*100vh)]`}>
                    <div className={`flex items-center justify-between ${isCollapsed ? " w-[calc(322/1440*100vw)]" : "w-[calc(289.95/1440*100vw)]"} h-[calc(39/900*100vh)]`}>
                      <img src="/payments/visa-logo.svg" className={`${isCollapsed ? " w-[calc(52.5/1440*100vw)]" : "w-[calc(47.27/1440*100vw)]"} h-[calc(16.62/900*100vh)] `} />
                      <img src="/payments/Mastercard.svg" className={`${isCollapsed ? " w-[calc(40.5/1440*100vw)]" : "w-[calc(36.46/1440*100vw)]"} h-[calc(24.74/900*100vh)] `} />
                      <img src="/payments/GooglePay.svg" className={`${isCollapsed ? " w-[calc(63.54/1440*100vw)]" : "w-[calc(57.21/1440*100vw)]"} h-[calc(26.16/900*100vh)] `} />
                      <img src="/payments/ApplePay.svg" className={`${isCollapsed ? " w-[calc(62.31/1440*100vw)]" : "w-[calc(56.10/1440*100vw)]"} h-[calc(26.05/900*100vh)] `} />

                    </div>
                    <div className={`flex items-start ${isCollapsed ? " w-[calc(124/1440*100vw)]" : "w-[calc(111.65/1440*100vw)]"} h-[calc(39/900*100vh)]`}>
                      <button disabled={selectedPayment === null} className={`w-full h-full text-sm sm:text-xs md:text-md lg:text-lg xl:text-xl 2xl:text-2xl border border-[#d4b588] rounded-md font-semibold ${selectedPayment
                        ? "bg-[#2e0a0a] text-[#d4b588] cursor-pointer hover:shadow-[0_0_8px_#FACC15]"
                        : "text-gray-300 bg-gray-500 cursor-not-allowed opacity-60"
                        }`} onClick={() => paymentConfirmHande()} >
                        {isLoading ? <BeatLoader color="white" /> : "Confirm"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" sm:hidden w-[calc(375/375*100vw)] h-[calc(503/812*100vh)] flex justify-center">
        <div className="flex flex-col items-center justify-between w-[calc(321/375*100vw)] h-[calc(503/812*100vh)]">
          <div className={`flex flex-col justify-between w-[calc(321/375*100vw)]  h-[calc(81/812*100vh)]`}>
            <div>
              <button onClick={onBack} className="inline-flex items-center gap-1 h-[calc(13/812*100vh)] cc rounded-md transition-all duration-300 hover:drop-shadow-[0_0_5px_#facc15] hover:scale-105" >
                <img src="/statistics/backArrow.svg" alt="Back Icon" height={11.67} width={6.87} />
                <p className="whitespace-nowrap text-[clamp(8px,20vw,14px)] text-[#cc9a53] font-semibold">  BACK </p>
              </button>
            </div>
            <div className="flex items-baseline w-full flex-wrap">
              <p className="text-white text-3xl font-medium">Checkout</p>
            </div>
            <p className="text-[#cc9a53] text-[clamp(8px,4.0vw,14px)]"> Your account will receive X Credits </p>
          </div>
          <div className={`flex flex-col justify-between h-[calc(400/812*100vh)] w-[calc(321/375*100vw)] `}>
            {/* Card 1 */}
            <div className={` w-[calc(321/375*100vw)] h-[calc(157/812*100vh)] rounded-md flex items-center justify-center bg-[#2A0B00]/50 border-2 border-[#D4B588]/50`}>
              <div className={` flex flex-col justify-between items-center w-[calc(321/375*100vw)]  h-[calc(127/812*100vh)]`}>
                <div className={`relative flex justify-center items-center gap-2  h-[calc(157/812*100vh)]`}>
                  <img src="/landingPage/pulseAura.svg" alt="Pulse Aura" className={`relative w-[calc(61.92/375*100vw)]  h-[calc(57.73/900*100vh)]`} />
                  <img src={cardAssetsMobile[selectedProduct?.id]?.["icon-1"]}
                    className={`absolute w-[calc(41.92/375*100vw)]  h-[calc(47.73/900*100vh)]`} alt="Card Inner" />
                </div>

                <div className={`flex flex-col justify-between items-center h-[calc(68/812*100vh)] `}>
                  <h3 className="text-white text-[clamp(10px,3.5vw,18px)]  font-semibold"> {selectedProduct?.quantity} {selectedProduct?.type} </h3>
                  <p className="text-gray-400 text-[clamp(6px,3.0vw,14px)] text-center"> {selectedProduct?.description} </p>
                  <div className={`h-[calc(5/812*100vh)] w-[calc(319/375*100vw)] bg-[url('/payments/CenterLineThird.png')] bg-no-repeat my-1`} />
                  <span className="text-xs sm:text-base md:text-md lg:text-lg xl:text-xl 2xl:text-3xl font-bold text-[#E4BD6E]"> {selectedProduct ? `$${selectedProduct.price}` : '$0.00'} </span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className={`w-[calc(321/375*100vw)] h-[calc(224/812*100vh)] rounded-md overflow-hidden flex flex-col justify-between items-center`}>
              <p className="text-s sm:text-sm md:text-xs lg:text-md xl:text-lg 2xl:text-xl text-white"> Select your preferred method of payment. </p>

              <div className={`flex w-[calc(321/375*100vw)] justify-between h-[calc(84/812*100vh)]`}>
                <div className={`w-[calc(156/375*100vw)] h-[calc(84/900*100vh)] border-2 border-[#D4B588]/50 flex items-center justify-center  rounded-md cursor-pointer ${selectedPayment === PaymentMethod.PayPal ? " brightness-105 bg-[#581C12]" : " hover:shadow-[0_0_7px_#FACC15] bg-[#2A0B00]/50"}`} onClick={() => setSelectedPaymentMethod(PaymentMethod.PayPal)}>
                  <img src="/payments/PayPalMobile.svg" className={`w-[calc(65.59/375*100vw)] h-[calc(56.92/812*100vh)] `} />
                </div>

                {/* <div className={`w-[calc(156/375*100vw)] h-[calc(84/900*100vh)] border-2 border-[#D4B588]/50 flex items-center justify-center rounded-md cursor-pointer ${selectedPayment === PaymentMethod.Stripe ? "brightness-105 bg-[#581C12]" : "bg-[#2A0B00]/50 brightness-100 hover:brightness-105 hover:shadow-[0_0_7px_#FACC15]"}`} onClick={() => setSelectedPaymentMethod(PaymentMethod.Stripe)}>
                  <img src="/payments/StripeMobile.svg" className={`w-[calc(83.91/375*100vw)] h-[calc(34.79/812*100vh)] `} />
                </div> */}
              </div>
              <div className={`flex items-start justify-between w-[calc(285/375*100vw)]  h-[calc(21/812*100vh)]`}>
                <p className="text-sm sm:text-sm md:text-sm lg:text-xs xl:text-md 2xl:text-lg text-white"> Integrated with</p>
                <img src="/payments/visa-logo.svg" className={`w-[calc(32.45/375*100vw)] h-[calc(16.62/900*100vh)] `} />
                <img src="/payments/Mastercard.svg" className={`w-[calc(25.08/375*100vw)]  h-[calc(15.39/900*100vh)] `} />
                <img src="/payments/GooglePay.svg" className={`w-[calc(39.44/375*100vw)]  h-[calc(16.24/812*100vh)] `} />
                <img src="/payments/ApplePay.svg" className={`w-[calc(38.79/375*100vw)] h-[calc(16.12/812*100vh)] `} />

              </div>
              <div className={`flex items-center justify-center w-[calc(321/375*100vw)] h-[calc(39/812*100vh)]`}>
                <button disabled={selectedPayment === null} className={`w-full h-full flex items-center justify-center text-sm sm:text-xs md:text-md lg:text-lg xl:text-xl 2xl:text-2xl border border-[#d4b588] rounded-md font-semibold ${selectedPayment
                  ? "bg-[#2e0a0a] text-[#d4b588] cursor-pointer hover:shadow-[0_0_8px_#FACC15]" : "text-gray-300 bg-gray-500 cursor-not-allowed opacity-60"}`} onClick={() => paymentConfirmHande()} >
                  <img src={'/payments/checkButton.svg'} width={22} height={22} alt="Chcek Button" />
                  <span className="text-[#E4BD6E] px-3 text-[clamp(10px,3.5vw,18px)] font-semibold">
                    {isLoading ? <BeatLoader color="white" /> : "Confirm"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;

