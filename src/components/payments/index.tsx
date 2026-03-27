"use client";

import React, { useEffect, useState } from "react";
import CheckoutPage from "./Checkout";
import { StripeProduct, TransactionApiResponse } from "@/lib/types/common/types";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentModal from "./PaymentModal";
import { fetchProducts } from "@/lib/services/stripeActions";
import { handleApiError } from "@/lib/errorHandler";
import Image from "next/image";
import { useAppContext } from "@/lib/hooks/useAppContext";
import { cardAssets } from "@/lib/constants/payment";
import { capturePayPalPayment } from "@/lib/services/paypalActions";
import { toast } from "react-toastify";
import { createPortal } from 'react-dom';
import { BeatLoader } from "react-spinners";
import TransactionModal from "./TransactionModal";
import { transactionHistoryApi } from "@/lib/services/paymentActions";

const GameShopPage: React.FC = () => {
  const hasCapturedPayment = React.useRef(false);

  const [selectedCard, setSelectedCard] = React.useState<StripeProduct | null>(null);
  const [allProduct, setAllProducts] = useState<StripeProduct[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<TransactionApiResponse[]>([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [paymentState, setPaymentState] = useState({
    paymentModalOpen: false,
    loading: false,
    transaction: false,
  });
  const [tabIndex, setTabIndex] = useState<0 | 1>(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success') as string || '';

  const orderId = searchParams.get("token") as string || '';
  const payerId = searchParams.get("PayerID");
  const { isCollapsed } = useAppContext();
  const session = searchParams.get('session_id') as string || '';

  useEffect(() => {
    if (!orderId && !success) { return; }

    const storageKey = `paypal_captured_${orderId}`;
    const alreadyCaptured = sessionStorage.getItem(storageKey);

    if (alreadyCaptured || hasCapturedPayment.current) {
      return;
    }

    hasCapturedPayment.current = true;
    sessionStorage.setItem(storageKey, 'true');

    const capturePayment = async () => {
      try {
        setIsCapturing(true);
        const response = await capturePayPalPayment(orderId);

        if (response.data) {
          toast.success("Payment completed successfully");
          setPaymentState((prev) => ({ ...prev, paymentModalOpen: true }));
        }
      } catch (error) {
        toast.error("Payment failed");
        hasCapturedPayment.current = false;
        sessionStorage.removeItem(storageKey);
        router.replace("/payments");
      } finally {
        setIsCapturing(false);
      }
    };

    capturePayment();
  }, [orderId, success, router]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setPaymentState((prev) => ({ ...prev, loading: true }));
        const allProducts = await fetchProducts();
        setAllProducts(allProducts);
      } catch (err) {
        handleApiError(err);
      } finally {
        setPaymentState((prev) => ({ ...prev, loading: false }));
      }
    };

    loadProducts();

    setTimeout(() => {
      setInitialLoading(true);
    }, 2000)

  }, []);

  // useEffect(() => {
  //   if (session) {
  //     setPaymentState((prev) => ({ ...prev, paymentModalOpen: true }));
  //   }
  // }, [session]);

  const handleCardSelect = (product: StripeProduct) => {
    setSelectedCard(product);
  }

  const handleBack = () => {
    const redirect = localStorage.getItem('redirectUrl');
    localStorage.removeItem("redirectUrl");
    if (redirect) {
      router.push(redirect);
    }
    else {
      router.push("/gamehub");
    }
  }

  const openTransactionModal = async () => {
    setPaymentState(prev => ({ ...prev, transaction: true }))
    try{
      const response = await transactionHistoryApi();
      setTransactionHistory(response);
    }catch(err){
      handleApiError(err);
    }

  }

  if (selectedCard) {
    return (<CheckoutPage onBack={() => setSelectedCard(null)} selectedProduct={selectedCard} />);
  }

  return (
    <>
      {typeof window !== 'undefined' && isCapturing && createPortal(
        <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center gap-4 bg-black/80 z-[9998]" onClick={(e) => e.stopPropagation()} >
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E4BD6E] border-t-transparent" />
          <p className="text-white text-lg font-medium px-4 text-center"> Wait, we are verifying your payment... </p>
        </div>,
        document.body
      )}

      {typeof window !== 'undefined' && paymentState.paymentModalOpen && createPortal(
        <PaymentModal
          onBack={() =>
            setPaymentState((prev) => ({ ...prev, paymentModalOpen: false }))
          }
          success={success === "true"}
        />,
        document.body
      )}

      {typeof window !== 'undefined' && paymentState.transaction && createPortal(
        <TransactionModal
          onClose={() => setPaymentState(prev => ({ ...prev, transaction: false }))}
          transactionData={transactionHistory}
        />,
        document.body
      )}

      {initialLoading ? (
        <>
          <div className="hidden sm:block">
            <div className={`flex flex-col justify-between items-center ${isCollapsed ? " w-[calc(1392/1440*100vw)]" : "w-[calc(1312/1440*100vw)]"} h-[calc(657/900*100vh)]`}>
              <div className={`flex flex-col justify-between ${isCollapsed ? " w-[calc(1293/1440*100vw)]" : "w-[calc(1165/1440*100vw)]"} h-[calc(87/900*100vh)]`}>
                <div>
                  <button className="flex items-center gap-1 rounded-md transition-all duration-200 cursor-pointer hover:drop-shadow-[0_0_5px_#facc15]" onClick={handleBack} >
                    <Image src="/clash/arrow_back.svg" alt="Back Icon" height={14} width={14} />
                    <p className="whitespace-nowrap text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-sm 2xl:text-base  font-medium text-[#898989] " > BACK </p>
                  </button>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <h2 className="text-white text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium"> Game Shop </h2>
                    <p className="text-[#CAC6DD] text-[6px] sm:text-[7px] md:text-[9px] lg:text-[10px] xl:text-xs 2xl:text-lg font-normal">
                      Credits allow you to unlock hints, lives and tournaments - choose the package that best fits your playing style.
                    </p>
                  </div>
                  <button onClick={openTransactionModal}
                    className="border border-[#FFD279] cursor-pointer flex items-center  bg-[#451b1b]  h-[calc(45/900*100vh)] px-4 py-1 mr-1 rounded-lg transition-all duration-300 hover:border-[#f4cf8b] hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box"
                  >
                    <p className="text-base font-bold text-white">Transaction History</p>
                  </button>
                </div>
              </div>
              <div className={`${isCollapsed ? "w-[calc(1293/1440*100vw)]" : "w-[calc(1165/1440*100vw)]"} h-[calc(327/900*100vh)] flex justify-between`} >
                {allProduct?.slice(0, 5).map((product, index) => {
                  const asset = cardAssets[index];

                  return (
                    <div key={product.id} onClick={() => handleCardSelect(product)} className={`relative rounded-xl cursor-pointer transition-transform  hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box duration-300 ${isCollapsed ? "w-[calc(247/1440*100vw)]" : "w-[calc(222.54/1440*100vw)]"} h-[calc(327/900*100vh)] `} >
                      <img src={asset.bg} className="absolute w-full h-full rounded-md" alt="Card Background" />
                      {asset.badge && (
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10">
                          <span className="px-6 py-2 text-xs border-2 border-[#d4b588] bg-[#2e0a0a] text-[#d4b588] rounded-full font-bold"> {asset.badge} </span>
                        </div>
                      )}

                      <div className="absolute inset-0 flex flex-col items-center justify-center will-change-transform">
                        <div className="relative flex justify-center items-center h-[calc(147.9/900*100vh)]">
                          <img src="/landingPage/pulseAura.svg" className="relative w-[calc(108/1440*100vw)]" alt="Pulse Aura" />
                          <img src={asset.icon} className="absolute" alt="Icon" />
                        </div>

                        <div className="flex flex-col items-center gap-2 text-center ">
                          <h3 className="text-white font-semibold">  {product.quantity ?? 0} {product.type} </h3>
                          <p className="text-gray-400 text-sm px-3">  {product.description ?? ""} </p>
                          <div className="w-full h-0.5 bg-[url('/payments/Line.png')] bg-no-repeat bg-cover my-2" />
                          <span className="font-bold text-[#E4BD6E] text-xl"> ${product.price ?? 0} </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`${isCollapsed ? "w-[calc(1293/1440*100vw)]" : "w-[calc(1165/1440*100vw)]"} h-[calc(154/900*100vh)] flex justify-center`}>
                <div className={`${isCollapsed ? "w-[calc(1293/1440*100vw)]" : "w-[calc(1165/1440*100vw)]"} h-[calc(154/900*100vh)] relative rounded-md overflow-hidden`} />
                <img src="/payments/Helper.png" className={`absolute ${isCollapsed ? " w-[calc(1293/1440*100vw)]" : "w-[calc(1165/1440*100vw)]"} h-[calc(155/900*100vh)] `} />
                <div className="absolute -mt-5">
                  <button className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-xs md:text-md lg:text-lg xl:text-xl 2xl:text-2xl border-2 border-[#d4b588] bg-[#2e0a0a] text-[#d4b588] rounded-full font-bold transition"> HELPERS </button>
                </div>

                <div className={`absolute flex justify-between ${isCollapsed ? " w-[calc(1231/1440*100vw)]" : "w-[calc(1109.13/1440*100vw)]"}`}>
                  <div className={`flex flex-col justify-center ${isCollapsed ? " w-[calc(708/1440*100vw)]" : "w-[calc(637.91/1440*100vw)]"} h-[calc(155/900*100vh)] `}>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-white text-sm sm:text-xs md:text-md lg:text-md xl:text-xl 2xl:text-2xl font-semibold"> HINTS</h3>
                      <div className="w-full h-0.5 sm:h-0.5 md:h-0.5 bg-[#d4b588] "></div>
                    </div>

                    <div className={`flex justify-between ${isCollapsed ? " w-[calc(708/1440*100vw)]" : "w-[calc(637.91/1440*100vw)]"}`}>
                      <div className={`flex  items-center justify-center ${isCollapsed ? " w-[calc(190/1440*100vw)]" : "w-[calc(171.19/1440*100vw)]"}  h-[calc(97/900*100vh)]`}>
                        <img src="/payments/filter_tilt.svg" className={`${isCollapsed ? " w-[calc(43.18/1440*100vw)]" : "w-[calc(38.90/1440*100vw)]"} h-[calc(42.96/900*100vh)] `} />
                        <div className={`flex flex-col ${isCollapsed ? " w-[calc(158/1440*100vw)]" : "w-[calc(142.35/1440*100vw)]"} justify-center text-center `}>
                          <h3 className="text-white text-s sm:text-sm md:text-xs lg:text-lg xl:text-xl 2xl:text-2xl font-semibold"> General </h3>
                          <p className="text-sm sm:text-xs md:text-md lg:text-lg xl:text-xl 2xl:text-3xl font-bold text-[#E4BD6E]"> 20 Credits </p>
                        </div>
                      </div>

                      <div className="w-1 h-[calc(97/900*100vh)] bg-[url('/payments/CenterLine.svg')] bg-no-repeat bg-center bg-cover" />

                      <div className={`flex  items-center justify-center ${isCollapsed ? " w-[calc(190/1440*100vw)]" : "w-[calc(171.19/1440*100vw)]"} h-[calc(97/900*100vh)]`}>
                        <img src="/payments/intermediate.svg" className={`${isCollapsed ? " w-[calc(51/1440*100vw)]" : "w-[calc(45.12/1440*100vw)]"} h-[calc(51/900*100vh)] `} />
                        <div className={`flex flex-col ${isCollapsed ? " w-[calc(158/1440*100vw)]" : "w-[calc(142.35/1440*100vw)]"} justify-center text-center `}>
                          <h3 className="text-white text-s sm:text-sm md:text-xs lg:text-lg xl:text-xl 2xl:text-2xl font-semibold"> Intermediate </h3>
                          <p className="text-sm sm:text-xs md:text-md lg:text-lg xl:text-xl 2xl:text-3xl font-bold text-[#E4BD6E]"> 45 Credits </p>
                        </div>
                      </div>
                      <div className=" w-0.5 h-full bg-[url('/payments/CenterLine.svg')] bg-no-repeat bg-center bg-cover" />

                      <div className="flex  items-center justify-center h-[calc(97/900*100vh)]">
                        <img src="/payments/final.svg" className={`${isCollapsed ? " w-[calc(51/1440*100vw)]" : "w-[calc(45.12/1440*100vw)]"} h-[calc(51/900*100vh)] `} />
                        <div className={`flex flex-col ${isCollapsed ? " w-[calc(158/1440*100vw)]" : "w-[calc(142.35/1440*100vw)]"} justify-center text-center `}>
                          <h3 className="text-white text-s sm:text-sm md:text-xs lg:text-lg xl:text-xl 2xl:text-2xl font-semibold"> Final </h3>
                          <p className="text-sm sm:text-xs md:text-md lg:text-lg xl:text-xl 2xl:text-3xl font-bold text-[#E4BD6E]"> 100 Credits </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`flex ${isCollapsed ? " w-[calc(249/1440*100vw)]" : "w-[calc(224.35/1440*100vw)]"} h-[calc(155/900*100vh)] column-border flex-col items-center justify-center`}>
                    <img src="/payments/heart.png" className={`${isCollapsed ? " w-[calc(68/1440*100vw)]" : "w-[calc(61.26/1440*100vw)]"} h-[calc(63/900*100vh)] `} />
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-sm sm:text-xs md:text-md lg:text-lg xl:text-lg 2xl:text-2xl font-bold text-[#E4BD6E]"> 20 Credits </p>
                      <p className="text-white text-xs sm:text-s md:text-sm lg:text-xs xl:text-md 2xl:text-lg"> +5 LIVES </p>
                    </div>
                  </div>

                  <div className={`flex ${isCollapsed ? " w-[calc(229/1440*100vw)]" : "w-[calc(206.33/1440*100vw)]"} h-[calc(155/900*100vh)] flex-col items-center justify-center`}>
                    <img src="/payments/paidClash.png" className={`${isCollapsed ? " w-[calc(68/1440*100vw)]" : "w-[calc(61.26/1440*100vw)]"} h-[calc(63/900*100vh)] `} />
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-sm sm:text-xs md:text-md lg:text-lg xl:text-xl 2xl:text-3xl font-bold text-[#E4BD6E]"> 30 Credits </p>
                      <p className="text-white text-xs sm:text-s md:text-sm lg:text-xs xl:text-md 2xl:text-lg"> PAID CLASH ACCESS </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="block sm:hidden w-[calc(375/375*100vw)]  h-[calc(660/812*100vh)] overflow-y-auto">
            <div className={`flex flex-col items-center w-[calc(375/375*100vw)] `}>
              <div className={`flex flex-col justify-center items-center w-[calc(375/375*100vw)]  gap-[calc(18/845*100vh)] `}>
                <div className={`flex flex-col justify-between w-[calc(321/375*100vw)]`}>
                  <button onClick={handleBack} className="inline-flex items-center gap-1 h-[calc(13/812*100vh)] w-[calc(321/375*100vw)] rounded-md transition-all duration-300 hover:drop-shadow-[0_0_5px_#facc15] hover:scale-105" >
                    <img src="/statistics/backArrow.svg" alt="Back Icon" height={11.67} width={6.87} />
                    <p className="whitespace-nowrap text-[clamp(8px,20vw,14px)] text-[#cc9a53] font-semibold">  BACK </p>
                  </button>

                  <div className="flex items-baseline w-full flex-wrap">
                    <p className="text-white text-3xl font-medium">GameShop</p>
                  </div>
                  <p className="text-[#cc9a53] text-[clamp(8px,4.0vw,14px)]"> Select your preferred package </p>
                </div>
                <div className="flex flex-col items-center gap-[calc(15/812*100vh)] w-[calc(321/375*100vw)] ">
                  <div className="flex border-b-[1.5px] border-[#88724B] w-[calc(321/375*100vw)] h-[calc(23/812*100vh)] ">
                    <button onClick={() => setTabIndex(0)} className={`text-[clamp(8px,3.5vw,16px)] text-center h-[calc(23/812*100vh)] whitespace-nowrap w-[calc(160.5/375*100vw)] cursor-pointer font-bold  ${tabIndex === 0 ? "text-[#E2AC5D] border-b-2 border-[#E2AC5D]" : "text-[#CAAA9AC7]/78"}`} >
                      PACKAGES
                    </button>
                    <button onClick={() => setTabIndex(1)} className={`text-[clamp(8px,3.75vw,16px)] h-[calc(23/812*100vh)] w-[calc(160.5/375*100vw)] cursor-pointer whitespace-nowrap text-center font-bold -mb-[1.5px] ${tabIndex === 1 ? "text-[#E2AC5D] border-b-2 border-[#E2AC5D]" : "text-[#CAAA9AC7]/78"}`} >
                      DETAILS
                    </button>
                  </div>
                  {tabIndex === 0 && (
                    <div className="flex flex-col gap-[calc(15/812*100vh)] w-[calc(321/375*100vw)]  ">
                      <div className="flex w-[calc(321/375*100vw)] h-[calc(164/812*100vh)] justify-between">
                        <div className="flex justify-center items-center cursor-pointer w-[calc(155/375*100vw)] h-[calc(164/812*100vh)] bg-[#260c06]/70 border-2 border-[#D4B588]" onClick={() => handleCardSelect(allProduct?.[0])} >
                          <div className={`flex flex-col justify-center items-center w-[calc(155/375*100vw)] h-[calc(133/812*100vh)]`}>
                            <div className={`flex flex-col justify-between items-center w-[calc(155/375*100vw)] h-[calc(133/812*100vh)]`}>

                              <div className={`relative flex justify-center items-center gap-2  w-[calc(155/375*100vw)] h-[calc(45/812*100vh)]`}>
                                <img src="/landingPage/pulseAura.svg" className={`relative  w-[calc(48.95/375*100vw)] h-[calc(46.82/812*100vh)]`} alt="Pulse Aura" />
                                <img src="/payments/card1inn.png" className={`absolute w-[calc(33/375*100vw)] h-[calc(32/812*100vh)]`} alt="Card Inner" />
                              </div>

                              <div className={`flex flex-col justify-between items-center w-[calc(155/375*100vw)] h-[calc(78/812*100vh)] `}>
                                <h3 className="text-white text-[clamp(10px,3.5vw,18px)]  font-semibold"> {allProduct?.[0]?.quantity ?? "25 Credits"} {allProduct?.[0]?.type ?? ""} </h3>
                                <p className="text-gray-400 text-[clamp(6px,3.0vw,14px)] text-center"> {allProduct?.[0]?.description ?? "Perfect for Casual Players"} </p>
                                <div className={`w-[calc(155/375*100vw)] h-[calc(5/812*100vh)] bg-[url('/payments/paymentCenterLine.png')] bg-no-repeat `} />
                                <span className="text-xs sm:text-base md:text-md lg:text-lg xl:text-xl 2xl:text-3xl font-bold text-[#E4BD6E]"> ${allProduct?.[0]?.price ?? ""} </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center items-center w-[calc(155/375*100vw)] h-[calc(164/812*100vh)] bg-[#260c06]/70 border-2 border-[#D4B588]" onClick={() => handleCardSelect(allProduct?.[1])} >
                          <div className={`flex flex-col justify-center items-center w-[calc(155/375*100vw)] h-[calc(133/812*100vh)]`}>
                            <div className={`flex flex-col justify-between items-center w-[calc(155/375*100vw)] h-[calc(133/812*100vh)]`}>
                              <div className={`relative flex justify-center items-center gap-2  w-[calc(155/375*100vw)] h-[calc(45/812*100vh)]`}>
                                <img src="/landingPage/pulseAura.svg" className={`relative  w-[calc(48.95/375*100vw)] h-[calc(46.82/812*100vh)]`} alt="Pulse Aura" />
                                <img src="/landingPage/pulse.svg" className={`absolute w-[calc(28.54/375*100vw)] h-[calc(24.61/812*100vh)]`} alt="Card Inner" />
                              </div>

                              <div className={`flex flex-col justify-between items-center w-[calc(155/375*100vw)] h-[calc(78/812*100vh)] `}>
                                <h3 className="text-white text-[clamp(10px,3.5vw,18px)]  font-semibold"> {allProduct?.[1]?.quantity ?? "25 Credits"} {allProduct?.[1]?.type ?? ""} </h3>
                                <p className="text-gray-400 text-[clamp(6px,3.0vw,14px)] text-center"> {allProduct?.[1]?.description ?? "Perfect for Casual Players"} </p>
                                <div className={`w-[calc(155/375*100vw)] h-[calc(5/812*100vh)] bg-[url('/payments/paymentCenterLine.png')] bg-no-repeat `} />
                                <span className="text-xs sm:text-base md:text-md lg:text-lg xl:text-xl 2xl:text-3xl font-bold text-[#E4BD6E]"> ${allProduct?.[1]?.price ?? ""} </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative flex flex-col w-[calc(321/375*100vw)] h-[calc(151/812*100vh)] border-2 border-[#D4B588]" onClick={() => handleCardSelect(allProduct?.[2])}>
                        <img src={'/payments/PaymentCenterBg.png'} alt="Center Image" className="absolute w-full h-full" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 ">
                          <button className="px-4 sm:px-6 text-sm sm:text-sm md:text-xs lg:text-md xl:text-lg 2xl:text-xl border-2 border-[#d4b588] bg-[#2e0a0a] text-[#d4b588] rounded-full font-bold transition"> POPULAR </button>
                        </div>
                        <div className={`absolute z-10 top-[calc(18/812*100vh)] flex flex-col justify-between items-center w-[calc(321/375*100vw)] h-[calc(116/812*100vh)]`}>
                          <div className={`relative flex justify-center items-center h-[calc(45/812*100vh)]`}>
                            <img src="/landingPage/pulseAura.svg" className={`relative h-[calc(46.48/812*100vh)] w-[calc(49.48/375*100vw)]`} alt="Pulse Aura" />
                            <img src="/payments/tree.svg" className={`absolute  h-[calc(31.59/812*100vh)] w-[calc(47.58/375*100vw)]`} alt="Card Inner" />
                          </div>

                          <div className={`flex flex-col justify-between items-center w-[calc(321/375*100vw)] h-[calc(64/812*100vh)]`}>
                            <h3 className="text-white text-[clamp(10px,3.5vw,18px)]  font-semibold"> {allProduct?.[2]?.quantity ?? 0} {allProduct?.[2]?.type ?? ""} </h3>
                            <p className="text-gray-400 text-[clamp(6px,3.0vw,14px)] text-center"> {allProduct?.[2]?.description ?? "GREAT"} </p>
                            <div className={`h-[calc(5/812*100vh)] w-[calc(319/375*100vw)] bg-[url('/payments/CenterLineThird.png')] bg-no-repeat `} />
                            <span className="font-bold text-[#E4BD6E] text-[clamp(8px,4.0vw,14px)] text-center"> ${allProduct?.[2]?.price ?? ""} </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-[calc(321/375*100vw)] h-[calc(164/812*100vh)] justify-between">
                        <div className="flex justify-center items-center w-[calc(155/375*100vw)] h-[calc(164/812*100vh)] bg-[#260c06]/70 border-2 border-[#D4B588]" onClick={() => handleCardSelect(allProduct?.[3])}>
                          <div className={`flex flex-col justify-center items-center w-[calc(155/375*100vw)] h-[calc(133/812*100vh)]`}>
                            <div className={`flex flex-col justify-between items-center w-[calc(155/375*100vw)] h-[calc(133/812*100vh)]`}>

                              <div className={`relative flex justify-center items-center w-[calc(155/375*100vw)] h-[calc(45/812*100vh)]`}>
                                <img src="/landingPage/pulseAura.svg" className={`relative  w-[calc(48.95/375*100vw)] h-[calc(46.82/812*100vh)]`} alt="Pulse Aura" />
                                <img src="/payments/falcon.svg" className={`absolute w-[calc(37.59/375*100vw)] h-[calc(27.47/812*100vh)]`} alt="Card Inner" />
                              </div>

                              <div className={`flex flex-col justify-between items-center w-[calc(155/375*100vw)] h-[calc(78/812*100vh)] `}>
                                <h3 className="text-white text-[clamp(10px,3.5vw,18px)]  font-semibold"> {allProduct?.[3]?.quantity ?? "25 Credits"} {allProduct?.[3]?.type ?? ""} </h3>
                                <p className="text-gray-400 text-[clamp(6px,3.0vw,14px)] text-center"> {allProduct?.[3]?.description ?? "Perfect for Casual Players"} </p>
                                <div className={`w-[calc(155/375*100vw)] h-[calc(5/812*100vh)] bg-[url('/payments/paymentCenterLine.png')] bg-no-repeat `} />
                                <span className="text-xs sm:text-base md:text-md lg:text-lg xl:text-xl 2xl:text-3xl font-bold text-[#E4BD6E]"> ${allProduct?.[3]?.price ?? ""} </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center items-center w-[calc(155/375*100vw)] h-[calc(164/812*100vh)] bg-[#260c06]/70 border-2 border-[#D4B588]" onClick={() => handleCardSelect(allProduct?.[4])}>
                          <div className={`flex flex-col justify-center items-center w-[calc(155/375*100vw)] h-[calc(133/812*100vh)]`}>
                            <div className={`flex flex-col justify-between items-center w-[calc(155/375*100vw)] h-[calc(133/812*100vh)]`}>
                              <div className={`relative flex justify-center items-center gap-2  w-[calc(155/375*100vw)] h-[calc(45/812*100vh)]`}>
                                <img src="/landingPage/pulseAura.svg" className={`relative  w-[calc(48.95/375*100vw)] h-[calc(46.82/812*100vh)]`} alt="Pulse Aura" />
                                <img src="/payments/wingscard5.svg" className={`absolute w-[calc(30/375*100vw)] h-[calc(30/812*100vh)]`} alt="Card Inner" width={22.54} height={24.61} />
                              </div>

                              <div className={`flex flex-col justify-between items-center w-[calc(155/375*100vw)] h-[calc(78/812*100vh)] `}>
                                <h3 className="text-white text-[clamp(10px,3.5vw,18px)]  font-semibold"> {allProduct?.[4]?.quantity ?? "0 Credits"} {allProduct?.[4]?.type ?? ""} </h3>
                                <p className="text-gray-400 text-[clamp(6px,3.0vw,14px)] text-center"> {allProduct?.[4]?.description ?? "Perfect for Casual Players"} </p>
                                <div className={`w-[calc(155/375*100vw)] h-[calc(5/812*100vh)] bg-[url('/payments/paymentCenterLine.png')] bg-no-repeat `} />
                                <span className="text-xs sm:text-base md:text-md lg:text-lg xl:text-xl 2xl:text-3xl font-bold text-[#E4BD6E]"> ${allProduct?.[4]?.price ?? ""} </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {tabIndex === 1 && (
                    <div className="flex flex-col justify-between w-[calc(321/375*100vw)] h-[calc(508/812*100vh)] ">
                      <div className="flex flex-col justify-between w-[calc(321/375*100vw)] h-[calc(338/812*100vh)]">
                        <div className="flex flex-col justify-between items-center w-[calc(321/375*100vw)] h-[calc(128/812*100vh)] rounded-md border-2 border-[#D4B588]/50">
                          <div className="flex justify-center items-center  rounded-t-md w-[calc(318/375*100vw)] h-[calc(32/812*100vh)] bg-[#4a1d02] border-b-2 border-[#D4B588]/50">
                            <div className="flex items-center gap-[calc(7/375*100vw)] w-[calc(269/375*100vw)] h-[calc(32/812*100vh)] ">
                              <img src={'/payments/lightbulb.svg'} alt="lightbulb" className="w-[calc(10.12/375*100vw)] h-[calc(13.49/812*100vh)]" />
                              <h2 className="text-white text-[clamp(8px,3.0vw,14px)] font-bold">HINTS CREDITS</h2>
                            </div>
                          </div>
                          <div className="flex justify-center relative w-[calc(321/375*100vw)] h-[calc(96/812*100vh)]">
                            <img src={'/payments/OverlayFirst.png'} alt="Background Overlay" className="w-[calc(318/375*100vw)]  rounded-b-md  h-full absolute" />
                            <div className="absolute z-10 w-[calc(321/375*100vw)] h-[calc(96/812*100vh)]">
                              <div className="flex flex-col justify-center items-center  w-[calc(321/375*100vw)] h-[calc(32/812*100vh)] ">
                                <div className="flex justify-between items-center w-[calc(269/375*100vw)] h-[calc(30/812*100vh)] ">
                                  <h2 className="text-white text-[clamp(8px,3.0vw,14px)]">General</h2>
                                  <p className="text-[#D4B588] font-bold text-[clamp(8px,3.0vw,14px)]"> 20 </p>
                                </div>
                                <img src={'/payments/CenterPaymentDetail.png'} alt="Center Line" className="w-full h-[calc(2/812*100vh)]" />
                              </div>
                              <div className="flex flex-col justify-center items-center  w-[calc(321/375*100vw)] h-[calc(32/812*100vh)] ">
                                <div className="flex justify-between items-center w-[calc(269/375*100vw)] h-[calc(30/812*100vh)] ">
                                  <h2 className="text-white text-[clamp(8px,3.0vw,14px)]">Intermediate</h2>
                                  <p className="text-[#D4B588] font-bold text-[clamp(8px,3.0vw,14px)]"> 45 </p>
                                </div>
                                <img src={'/payments/CenterPaymentDetail.png'} alt="Center Line" className="w-full h-[calc(2/812*100vh)]" />
                              </div>
                              <div className="flex flex-col justify-center items-center  w-[calc(321/375*100vw)] h-[calc(32/812*100vh)] ">
                                <div className="flex justify-between items-center w-[calc(269/375*100vw)] h-[calc(30/812*100vh)] ">
                                  <h2 className="text-white text-[clamp(8px,3.0vw,14px)]">Final</h2>
                                  <p className="text-[#D4B588] font-bold text-[clamp(8px,3.0vw,14px)]"> 100 </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col w-[calc(321/375*100vw)] h-[calc(64/812*100vh)] rounded-md border-2 border-[#D4B588]/50">
                          <div className="flex justify-center w-[calc(318/375*100vw)] h-[calc(30/812*100vh)] rounded-t-md bg-[#4a1d02] border-b-2 border-[#D4B588]/50">
                            <div className="flex items-center gap-[calc(7/375*100vw)] w-[calc(269/375*100vw)] h-[calc(32/812*100vh)] ">
                              <img src={'/payments/heartPayment.svg'} alt="lightbulb" className="w-[calc(13.49/375*100vw)] h-[calc(12.38/812*100vh)]" />
                              <h2 className="text-white text-[clamp(8px,3.0vw,14px)] font-bold">LIVE CREDITS</h2>
                            </div>
                          </div>
                          <div className="flex justify-center w-[calc(318/375*100vw)] h-[calc(30/812*100vh)] relative">
                            <img src={'/payments/OverlaySecond.png'} alt="Second Overlay" className="w-full h-full absolute" />
                            <div className="absolute z-10 flex justify-between items-center w-[calc(269/375*100vw)] h-[calc(30/812*100vh)]">
                              <h2 className="text-white font-semibold text-[clamp(8px,3.0vw,14px)]">+5 LIVES</h2>
                              <p className="text-[#D4B588] font-bold text-[clamp(8px,3.0vw,14px)]"> 100 </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col w-[calc(321/375*100vw)] h-[calc(64/812*100vh)] rounded-md border-2 border-[#D4B588]/50">
                          <div className="flex justify-center w-[calc(318/375*100vw)] h-[calc(30/812*100vh)] rounded-t-md bg-[#4a1d02] border-b-2 border-[#D4B588]/50">
                            <div className="flex items-center gap-[calc(7/375*100vw)] w-[calc(269/375*100vw)] h-[calc(32/812*100vh)] ">
                              <img src={'/payments/trophyMobile.svg'} alt="lightbulb" className="w-[calc(12.15/375*100vw)] h-[calc(12.15/812*100vh)]" />
                              <h2 className="text-white text-[clamp(8px,3.0vw,14px)] font-bold">PAID TOURNAMENTS</h2>
                            </div>
                          </div>
                          <div className="flex justify-center w-[calc(318/375*100vw)] h-[calc(30/812*100vh)] relative">
                            <img src={'/payments/OverlaySecond.png'} alt="Second Overlay" className="w-full h-full absolute" />
                            <div className="absolute z-10 flex justify-between items-center w-[calc(269/375*100vw)] h-[calc(30/812*100vh)]">
                              <h2 className="text-white font-semibold text-[clamp(8px,3.0vw,14px)]">ACCESS</h2>
                              <p className="text-[#D4B588] font-bold text-[clamp(8px,3.0vw,14px)]"> 30 </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex w-[calc(321/375*100vw)] h-[calc(15/812*100vh)] justify-between ">
                          <p className="text-[#D4B588] text-[clamp(8px,3.0vw,14px)]">The above reflects the current cost of HELPERS, in credits</p>
                        </div>
                      </div>
                    </div>

                  )}
                </div>
                <div className="w-full h-[calc(80/812*100vh)]" ></div>
              </div>
            </div>

          </div>
        </>
      ) : (
        <div className={`flex w-full h-full justify-center items-center`}>
          <BeatLoader color="white" />
        </div>
      )}
    </>

  );
};

export default GameShopPage;