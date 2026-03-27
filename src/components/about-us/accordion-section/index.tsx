import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useCalculateScreenWidth } from "@/lib/hooks/calculateScreenWidth";

interface AccordionSectionProps {
  title: string;
  description: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  buttonText: string;
  redirectTo: string;
  onExpandHeight?: (height: number) => void;
  icon?: string;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  description,
  expanded,
  onToggle,
  buttonText,
  redirectTo,
  icon,
  onExpandHeight,
}) => {
  const iconRefDesktop = useRef<HTMLImageElement>(null);
  const iconRefMobile = useRef<HTMLImageElement>(null);
  const contentRefDesktop = useRef<HTMLDivElement>(null);
  const bgRefDesktop = useRef<HTMLDivElement>(null);
  const contentRefMobile = useRef<HTMLDivElement>(null);
  const bgRefMobile = useRef<HTMLDivElement>(null);
  const { screenWidth } = useCalculateScreenWidth();
  

  const iconRef = screenWidth > 650 ? iconRefDesktop : iconRefMobile;
  const contentRef = screenWidth > 650 ? contentRefDesktop : contentRefMobile;
  const bgRef = screenWidth > 650 ? bgRefDesktop : bgRefMobile;


  useGSAP(() => {
    if (!iconRef.current) return;

    gsap.to(iconRef.current, {
      rotate: expanded ? 180 : 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.6)",
    });
  }, [expanded, screenWidth]);

  useGSAP(() => {
    const el = contentRef.current;
    if (!el) return;

    // stop conflicting tweens
    gsap.killTweensOf(el);

    if (expanded) {
      const height = el.scrollHeight;

      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          onComplete: () => {
            el.style.height = "auto";
            if (onExpandHeight) onExpandHeight(el.scrollHeight);
          },
        }
      );
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
      });
      if (onExpandHeight) onExpandHeight(0);
    }
  }, [expanded, screenWidth]);


  useGSAP(() => {
    if (!bgRef.current) return;

    if (bgRef.current) {
      if (expanded) {
        gsap.to(bgRef.current, {
          opacity: 0.2,
          duration: 0.6,
          ease: "power3.out",
        });
      } else {
        gsap.to(bgRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power3.inOut",
        });
      }
    }
  }, [expanded, screenWidth]);

  return (
    <>
      {screenWidth > 650 ? (
        <div className=" w-full">
          <div className=" text-white">
            <section className="relative px-[3%] overflow-hidden">
              <div onClick={onToggle} className="relative cursor-pointer flex justify-between items-center gap-4 w-full aspect-[1112/88] z-10" >
                <h1 className="w-full text-xs sm:text-base md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl font-Sora font-normal select-none"> {title} </h1>
                <button className="flex justify-center items-center cursor-pointer transition-transform duration-300 hover:scale-110">
                  <img ref={iconRefDesktop} src={expanded ? "/about-us/subtract.svg" : "/about-us/plus.svg"} className="w-2 sm:w-3 md:w-4 lg:w-5 xl:w-6 h-auto select-none" />
                </button>
              </div>
              <div className={`absolute w-full transition-all pointer-events-none duration-1000 ease-in-out ${expanded ? "h-full -top-[50%]" : "h-[200%] -top-[70%]" } rounded-[29.72194rem] opacity-30 bg-[radial-gradient(50%_50%_at_51.6%_50%,rgba(70,209,252,0.30)_0%,rgba(2,117,151,0)_100%)]`} />
              <div ref={contentRefDesktop} className="flex flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 h-auto overflow-hidden" >
                <p className="text-[#999] text-[6px] sm:text-[9px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg"> {description} </p>
                <div className=" flex items-center pl-2 gap-2 lg:gap-3 xl:gap-4 2xl:gap-5  w-full pb-[1%] z-10 rounded-md " >
                  <Link href={redirectTo} className="flex items-center gap-2 cursor-pointer transition-all duration-500 ease-in-out hover:opacity-90 hover:drop-shadow-[0_0_5px_#facc15] hover-scale-105" >
                    <img src="/about-us/play.svg" alt="Play Button" className="w-4 h-auto sm:w-5 md:w-6 lg:w-7 xl:w-8 2xl:w-9 transition-transform duration-500 ease-in-out group-hover:scale-110" />
                    <span className="text-white text-[9px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-Sora"> {buttonText} </span>
                  </Link>
                </div>
              </div>
              <div ref={bgRefDesktop} className="absolute -bottom-1/3 w-full h-full rounded-[30.23338rem] opacity-20 bg-[radial-gradient(50%_50%_at_50%_50%,_#FFD278_8.43%,_rgba(255,210,120,0)_100%)]" />
              <div className="absolute bottom-0 w-full h-[0.0625rem] bg-gradient-to-r from-[rgba(40,32,22,0)] via-[#D4B588] to-[rgba(40,32,22,0)] shadow-[0_4px_4px_rgba(0,0,0,0.25)]" />
            </section>
          </div>
        </div>
      ) : (
        <div className="block sm:hidden w-full">
          <div className=" text-white">
            <section className={`relative rounded-md mb-[1%] bg-[#342317]/50 ${expanded ? "border-t-2 border border-[#D4B588]" : "border-none"} overflow-hidden`}>
              <div onClick={() => { onToggle() }} className={`relative cursor-pointer flex justify-center items-center rounded-md ${!expanded ? "border-t-2 border border-[#D4B588]" : "border-none"} items-center gap-4 w-full h-[calc(51/1089*100vh)] z-10`} >
                <div className="w-[calc(292/375*100vw)] h-[calc(51/1089*100vh)] flex justify-between items-center">
                  <div className="w-[calc(292/375*100vw)] h-[calc(51/1089*100vh)] flex items-center gap-[calc(10/375*100vw)]">
                    <img src={`/gamePlay/${icon}`} alt={`${icon}`} width={21.3} height={19.65} />
                    <h1 className="w-full uppercase text-xs sm:text-base md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl font-Sora font-bold text-[#D4B588] select-none"> {title} </h1>
                  </div>
                  <button className="flex justify-center items-center cursor-pointer transition-transform duration-300 hover:scale-110">
                    <img ref={iconRefMobile} src={expanded ? "/gamePlay/crossIcon.svg" : "/gamePlay/add.svg"} className="w-2.5 h-2.5 select-none" />
                  </button>
                </div>
              </div>
              <div className={`absolute w-full transition-all pointer-events-none duration-1000 ease-in-out ${expanded ? "h-full -top-[67%]" : "h-[200%] -top-[70%]" } opacity-30 bg-[#543321]/50 `} />
              <div ref={contentRefMobile} className="flex flex-col justify-center items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 h-auto w-full overflow-hidden" >
                <div className="flex flex-col w-[calc(292/375*100vw)] justify-between items-center">
                  <p className="text-white text-[14px] sm:text-[9px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg"> {description} </p>
                </div>
                <div className="relative flex items-center justify-center gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 w-full z-10 rounded-md transition-all duration-500 ease-in-out hover:drop-shadow-[0_0_5px_#facc15] hover-scale-105">
                  <img src={'/gamePlay/PlayNowButton.png'} className="w-[calc(321/375*100vw)]" />
                  <Link href={redirectTo} className="absolute flex items-center justify-center gap-2 cursor-pointer transition-all duration-500 ease-in-out hover:opacity-90" >
                    <img src="/gamePlay/swords.svg" className="w-4 h-auto sm:w-5 md:w-6 lg:w-7 xl:w-8 2xl:w-9 transition-transform duration-500 ease-in-out group-hover:scale-110"/>
                    <span className="text-[#D4B588] uppercase text-[14px] font-bold font-Sora"> {buttonText} </span>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
};
export default AccordionSection;
