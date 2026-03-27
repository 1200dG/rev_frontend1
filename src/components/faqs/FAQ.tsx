"use client";
import { handleApiError } from "@/lib/errorHandler";
import { useAppContext } from "@/lib/hooks/useAppContext";
import { getFaqs } from "@/lib/services/faqsAction";
import { FAQS } from "@/lib/types/common/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

const FAQ: React.FC = () => {
  const [activeElement, setActiveElement] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const [faqs, setFaqs] = useState<FAQS[]>([]);
  const { isCollapsed } = useAppContext();
  const router = useRouter();

  const handleClick = (value: number) => {
    setActiveElement(value === activeElement ? -1 : value);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await getFaqs();
      if (response && response.length > 0) {
        const active = response.filter((faq: FAQS) => faq.active === true)
        setFaqs(active);
      }
    } catch (error) {
      handleApiError(error, "Failed to load FAQs. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return !loading ? (
    <>
      <div className="hidden sm:block">
        <div className={`flex flex-col items-center gap-6 overflow-auto ${isCollapsed ? " w-[calc(1392/1440*100vw)]" : "w-[calc(1312/1440*100vw)]"}`}>
          <div className={`flex flex-col gap-6 ${isCollapsed ? "w-[calc(1265/1440*100vw)]" : "w-[calc(1137/1440*100vw)]"}`}>
            <p className="text-white text-4xl font-bold">FAQs</p>
            <div className={`flex flex-col gap-6 overflow-y-auto no-scrollbar w-full ${isCollapsed ? "max-h-[80vh]" : "max-h-[80vh]"}`} >
              {faqs
                .filter((faq) => faq.active)
                .map((faq, key) => (
                  <div key={key} className="border-[#453e37] border-t-2 pt-4">
                    <button type="button" onClick={() => handleClick(key)} className="w-full flex justify-between cursor-pointer "  >
                      <p className="text-white font-normal text-xl wrap-break-words" > {faq.question} </p>
                      {activeElement !== key ? (
                        <Image src="/faqs/plus.svg" alt="plus icon" width={24} height={24} />
                      ) : (
                        <Image src="/faqs/xmark.svg" alt="X mark" width={24} height={24} />
                      )}
                    </button>

                    {activeElement === key && (
                      <div className="pl-3 border-[#453e37] border-t-2 mt-4">
                        <p className="text-[#DADADAD9] font-normal text-base mt-4 wrap-break-words"> {faq.answer} </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>
      <div className="block sm:hidden  w-[calc(375/375*100vw)] h-[calc(610/812*100vh)] overflow-y-auto">
        <div className="w-[calc(375/375*100vw)] flex flex-col items-center ">
          <div className={`flex flex-col  w-[calc(321/375*100vw)] gap-[calc(18/812*100vh)]`}>
          <div className="flex flex-col justify-between w-[calc(321/375*100vw)] h-[calc(52/812*100vh)]">
            <button onClick={() => router.back()} className="inline-flex gap-1 rounded-md transition-all duration-200 cursor-pointer hover:drop-shadow-[0_0_5px_#facc15] sm:hidden">
              <Image src="/statistics/backArrow.svg" alt="Back Icon" height={11.67} width={6.87} />
              <p className="whitespace-nowrap text-[clamp(8px,20vw,14px)] text-[#cc9a53] font-semibold">  BACK </p>
            </button>
             <p className="text-white text-4xl font-bold">FAQs</p>
            </div>
            <div className={`flex flex-col gap-3 w-[calc(321/375*100vw)] overflow-y-auto`}>

             
              {faqs
                .filter((faq) => faq.active)
                .map((faq, key) => {
                  return (
                    <div key={key} className={`rounded-md bg-[#D9D9D933] ${activeElement !== key ? 'flex justify-center' : 'flex flex-col justify-center items-center'}`}>
                      <div className="w-[calc(294/375*100vw)] py-[2%]">
                        <button type="button" onClick={() => handleClick(key)} className=" flex justify-between cursor-pointer w-[calc(294/375*100vw)] items-center" >
                          <p className="text-white font-normal text-xl">{faq.question}</p>
                          {activeElement !== key ? (
                            <Image src="/faqs/plus.svg" alt="plus icon" width={24} height={24} />
                          ) : (
                            <Image src="/faqs/xmark.svg" alt="X mark" width={24} height={24} />
                          )}
                        </button>
                        {activeElement === key && (
                          <div className=" border-[#453e37] ">
                            <p className="text-[#DADADAD9] font-normal text-base mt-4"> {faq.answer} </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
            <p className="text-[#E2AC5D] text-xs">If you have any further questions, please do not hesitate in reaching out: <span className="text-white"> info@revs.com </span> </p>
            <div className="w-[calc(375/375*100vw)] h-[calc(20/812*100vh)]"></div>
          </div>
        </div>
      </div>

    </>
  ) : (
    <div className="flex w-full h-full justify-center items-center">
      <BeatLoader color="white" />
    </div>
  );
};

export default FAQ;
