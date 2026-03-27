"use client";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import AccordionSection from "../accordion-section";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/lib/hooks/useAppContext";
import { useCalculateScreenWidth } from "@/lib/hooks/calculateScreenWidth";

const tabs = [
  {
    title: "Overview",
    desc: "Within the REV ecosystem, the main tool you have is your brain. <br /> Alongside it, you will have Lives and Hints.",
  },
  {
    title: "Lives",
    desc: "This is the number of attemps the user currently has. These lives <br /> regenerate based on progression and time.",
  },
  {
    title: "Hints",
    desc: "Hints are designed to assist the user and, in most cases, will <br /> provide helpful guidance.",
  },
];

const GameplaySection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { previousUrl } = useAppContext();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const container1Ref = useRef<HTMLDivElement>(null);
  const container2Ref = useRef<HTMLDivElement>(null);
  const container3Ref = useRef<HTMLDivElement>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { screenWidth } = useCalculateScreenWidth();


  // Add ref for the point system section
  const pointSystemRef = useRef<HTMLDivElement>(null);

  // Scroll effect using the ref directly
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash !== '#point-system') return;

    const scrollToPointSystem = () => {
      const scrollContainer = scrollContainerRef.current;

      // Mobile scroll logic
      if (screenWidth <= 650 && scrollContainer && pointSystemRef.current) {

        // Check if element has rendered
        const elementHeight = pointSystemRef.current.offsetHeight;

        if (elementHeight === 0) {
          return false;
        }

        // Get all parent elements' offsetTop to calculate absolute position
        let element: HTMLElement | null = pointSystemRef.current;
        let totalOffset = 0;

        while (element && element !== scrollContainer) {
          totalOffset += element.offsetTop;
          element = element.offsetParent as HTMLElement;

          // Safety check to prevent infinite loop
          if (!element || element === document.body) break;
        }


        const scrollPosition = totalOffset - 80;

        // Scroll to position
        scrollContainer.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: "smooth",
        });

        return true;
      }
      // Desktop scroll logic
      else if (screenWidth > 650 && pointSystemRef.current) {
        const elementTop = pointSystemRef.current.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: elementTop - 80,
          behavior: "smooth",
        });
        return true;
      }

      return false;
    };

    // Try multiple times
    let attempts = 0;
    const maxAttempts = 15;

    const tryScroll = () => {
      attempts++;
      const success = scrollToPointSystem();

    };

    setTimeout(tryScroll, 200);

  }, [pathname, screenWidth]);


  useGSAP(() => {
    if (contentRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        contentRef.current,
        { opacity: 0, x: 10, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );
      tl.to(
        contentRef.current,
        { boxShadow: "0 0 25px rgba(255,174,61,0.4)", duration: 0.3, yoyo: true, repeat: 1 },
        "-=0.3"
      );
      tl.fromTo(
        contentRef.current.querySelectorAll("p, span"),
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" },
        "-=0.2"
      );
    }
  }, [activeTab]);

  const toggleContainer1 = () => {
    if (!container1Ref.current) return;

    const tl = gsap.timeline();
    const contentElements = container1Ref.current.querySelectorAll("p, img");

    if (!open) {
      tl.to(container1Ref.current, {
        height: "calc(476/1089*100vh)",
        duration: 0.3,
        ease: "power3.out"
      })
        .fromTo(
          contentElements,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: "power2.out" },
          "-=0.2"
        );
      setOpen(true);
    } else {
      tl.to(container1Ref.current, {
        height: "calc(51/1089*100vh)",
        duration: 0.3,
        ease: "power3.inOut"
      });
      setOpen(false);
    }
  };

  const toggleContainer2 = () => {
    if (!container2Ref.current) return;

    const tl = gsap.timeline();
    const content = container2Ref.current.querySelectorAll("p, img");

    if (!open1) {
      tl.to(container2Ref.current, {
        height: "calc(425/1089*100vh)",
        duration: 0.3,
        ease: "power3.out",
      }).fromTo(
        content,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.3 },
        "-=0.2"
      );
      setOpen1(true);
    } else {
      tl.to(container2Ref.current, {
        height: "calc(51/1089*100vh)",
        duration: 0.3,
        ease: "power3.inOut",
      });
      setOpen1(false);
    }
  };


  const toggleContainer3 = () => {
    if (!container3Ref.current) return;

    const tl = gsap.timeline();
    const content = container3Ref.current.querySelectorAll("p, img");

    if (!open2) {
      tl.to(container3Ref.current, {
        height: "calc(554/1089*100vh)",
        duration: 0.3,
        ease: "power3.out",
      }).fromTo(
        content,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.3 },
        "-=0.2"
      );
      setOpen2(true);
    } else {
      tl.to(container3Ref.current, {
        height: "calc(51/1089*100vh)",
        duration: 0.3,
        ease: "power3.inOut",
      });
      setOpen2(false);
    }
  };

  const toggleSection = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <>
      {(screenWidth > 650 && pathname !== '/game-rules') ? (
        <div className="w-full aspect-[1112/1825]">
          <div className="relative w-full h-full text-white">
            <AccordionSection
              title="Seasons"
              buttonText="Play Now"
              redirectTo="/gamehub"
              description={
                <>
                  Casual gameplay for players that are seeking challenging riddles, without having the pressure of competition.
                  <br />
                  We are currently in
                  <strong className="text-[#DEDEDE] font-bold"> Season I</strong>, and for the first set, we have 50 levels, for you to have fun while solving interesting riddles. Every 6-months, the season will be refreshed with brand new riddles.
                  <br /><br />
                  The lives and hints system apply at this game mode. After level 40, there are no hints available.
                  <br /><br />
                  Players will earn rewards by progressing on REV: Season I.
                </>
              }
              expanded={openIndex === 0}
              onToggle={() => toggleSection(0)}
            />
            <AccordionSection
              title="Daily Riddle"
              buttonText="Play Now"
              redirectTo="/riddles/daily"
              description={
                <>
                  Riddles usually with a lower difficulty level, aimed to expand the knowledge of our players. The focus of the riddle can be anything.
                  <br />
                  The lives system do not apply (you can submit an answer an infinite number of times).  Hints are available.
                  <br /><br />
                  Playing the daily riddle counts towards a player streak!
                </>
              }
              expanded={openIndex === 1}
              onToggle={() => toggleSection(1)}
            />
            <AccordionSection
              title="Tournaments"
              buttonText="Check available tournaments"
              redirectTo="/clash/tournaments"
              description={
                <>
                  For the competitive minds, we are creating on a monthly basis, tournaments with prizes.  We plan to have free and premium clashes, both
                  <br />
                  with prizes. Each tournament will have its dedicated page, where players can consult the details about such event.
                  <br /><br />
                  Although in the beginning, the prizes will be in the form of achievements, free hints and free lives, we intend to move towards cash prizes.
                </>
              }
              expanded={openIndex === 2}
              onToggle={() => toggleSection(2)}
            />

            <div className="absolute top-[32.5%] sm:top-[33%] md:top-[33.5%] -translate-x-1/2 left-1/2">
              <h2 className="text-[#FFBF7E] text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium">GAME MECHANICS</h2>
            </div>
            <div className="absolute left-0 top-[50.25%] sm:top-[50.75%]  -translate-y-1/2 w-full aspect-[1112/455] flex items-center">
              <div className="flex flex-col justify-between h-full w-1/2">
                {tabs.map((tab, index) => (
                  <div key={index} onClick={() => setActiveTab(index)}>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-md" />
                    <div className={`relative w-full aspect-[552/132.31] flex flex-col justify-center gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-3.5 xl:gap-4 2xl:gap-5 p-[5%] rounded-[0.625rem] bg-[rgba(105,69,28,0.5)] overflow-hidden cursor-pointer border transition-colors duration-500 ease-in-out shadow-[0_0_5px_#facc15] box ${activeTab === index ? "border-[#D4B588]/70" : "border-transparent"}`} >
                      <h4 className={`text-[9px] sm:text-[11px] md:text-sm lg:text-base xl:text-xl 2xl:text-2xl font-semibold z-10 transition-all duration-700 will-change-transform ${activeTab === index ? "text-white" : "text-[#D0DBE5]/50"}`}>{tab.title}</h4>
                      <p className={`text-[6px] sm:text-[8px] md:text-[9px] lg:text-xs xl:text-base 2xl:text-lg leading-normal font-semibold z-10 transition-all duration-700 will-change-transform ${activeTab === index ? "text-[#E8EFFD]" : "text-[#E8EFFD]/50"}`} dangerouslySetInnerHTML={{ __html: tab.desc }} />
                      <div className="absolute left-0 top-0 rotate-0 w-1/4 h-full bg-[linear-gradient(270deg,rgba(0,1,13,0)_0%,rgba(0,1,13,0.4)_100%)]" />
                      <div className="absolute right-0 top-0 rotate-0 w-1/4 h-full bg-[linear-gradient(90deg,rgba(0,1,13,0)_0%,rgba(0,1,13,0.4)_100%)]" />
                      <div className="absolute left-0 -bottom-[15%] w-[125%] h-[200%] rounded-[29.72194rem] opacity-30 bg-[radial-gradient(50%_50%_at_51.6%_50%,rgba(70,209,252,0.3)_0%,rgba(2,117,151,0)_100%)]" />
                      <div className="absolute right-0 -bottom-[15%] w-[125%] h-[200%] rounded-[29.72194rem] opacity-30 bg-[radial-gradient(50%_50%_at_51.6%_50%,rgba(70,209,252,0.3)_0%,rgba(2,117,151,0)_100%)]" />
                      <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${activeTab === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                        <div className="absolute left-0 top-0 w-1/4 h-full bg-[linear-gradient(270deg,rgba(0,1,13,0)_0%,rgba(0,1,13,0.4)_100%)]" />
                        <div className="absolute right-0 top-0 w-1/4 h-full bg-[linear-gradient(90deg,rgba(0,1,13,0)_0%,rgba(0,1,13,0.4)_100%)]" />
                        <div className="absolute left-0 -bottom-[15%] w-[125%] h-[200%] rounded-full opacity-30 bg-[radial-gradient(50%_50%_at_51.6%_50%,rgba(70,209,252,0.3)_0%,rgba(2,117,151,0)_100%)]" />
                        <div className="absolute left-0 -bottom-[15%] w-[125%] h-[200%] rounded-full opacity-30 bg-[radial-gradient(50%_50%_at_51.6%_50%,rgba(70,209,252,0.3)_0%,rgba(2,117,151,0)_100%)]" />
                        <div className="absolute right-0 -bottom-[15%] w-[125%] h-[200%] rounded-full opacity-30 bg-[radial-gradient(50%_50%_at_51.6%_50%,rgba(70,209,252,0.3)_0%,rgba(2,117,151,0)_100%)]" />
                        <div className="absolute right-0 -bottom-[15%] w-[125%] h-[200%] rounded-full opacity-30 bg-[radial-gradient(50%_50%_at_51.6%_50%,rgba(70,209,252,0.3)_0%,rgba(2,117,151,0)_100%)]" />
                      </div>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-md" />
                  </div>
                ))}
              </div>

              {
                activeTab === 0 ? (
                  <div ref={contentRef} className="w-[30%] aspect-[342/455] rounded-[7%] ms-[12.2%] sm:ms-[12.3%] lg:ms-[12.4%] 2xl:ms-[12.5%] flex justify-center items-center px-[2.5%]">
                    <p className="text-[#FFAE3D] text-justify text-[6px] sm:text-[8px] md:text-[10px] lg:text-sm xl:text-base 2xl:text-xl">
                      To submit an answer to a riddle, you have a bar at the bottom of the riddle page where you can insert the solution
                      <span className="text-[#FDFAF5]"> (sometimes there are other ways to pass a given level)</span>. <br /><br />
                      In order for your attempt to be valid, you need to have lives. For REV: Season I and Tournaments, you will only be able to submit answers if you have available lives:
                      <br /><br /><br /><br />
                      For the Daily Riddle, Lives do not apply, you can try as many times as you wish.
                    </p>
                  </div>
                ) : (
                  activeTab === 1 ? (
                    <div ref={contentRef} className="w-[30%] aspect-[342/455] rounded-[7%] ms-[12.2%] sm:ms-[12.3%] lg:ms-[12.4%] 2xl:ms-[12.5%] flex flex-col justify-between gap-1 p-[1%] pt-0">
                      <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] opacity-0" />
                      <div className="w-full flex justify-center items-center">
                        <p className="text-[#FFAE3D] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-bold">Free Live Refill System</p>
                      </div>
                      <div className="w-full flex items-center">
                        <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal ps-[10%]">+1 Live / per sucessful riddle</p>
                      </div>
                      <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                      <div className="w-full flex items-center">
                        <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal ps-[10%]">+3 Lives / per day</p>
                      </div>
                      <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                      <div className="w-full flex items-center">
                        <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal ps-[10%]">+1 Live / per 2hours</p>
                      </div>
                      <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                      <div className="w-full flex justify-center items-center">
                        <p className="text-[#FFAE3D] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-bold text-center">The free lives refill system will only be <br /> applicable if you have 4 or less lives</p>
                      </div>
                      <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                      <div className="w-full flex justify-center items-center">
                        <p className="text-[#FFAE3D] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-bold text-center">Stacking Lives is possible, if you buy <br /> Lives or enroll in paid tournaments</p>
                      </div>
                      <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] opacity-0" />
                    </div>
                  ) : (
                    <div ref={contentRef} className="w-[30%] aspect-[342/455] rounded-[7%] ms-[12.2%] sm:ms-[12.3%] lg:ms-[12.4%] 2xl:ms-[12.5%] flex flex-col justify-between gap-1 p-[1%] pt-0">
                      <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] opacity-0" />
                      <div className="w-full flex justify-center items-center">
                        <p className="text-[#FFAE3D] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-bold">Generate Hint</p>
                      </div>
                      <div className="w-full flex justify-center items-center">
                        <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center">Nudges the logic direction without <br /> revealing much</p>
                      </div>
                      <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                      <div className="w-full flex justify-center items-center">
                        <p className="text-[#FFAE3D] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-bold">Intermediate Hint</p>
                      </div>
                      <div className="w-full flex justify-center items-center">
                        <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center">Provides a more focused clue</p>
                      </div>
                      <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                      <div className="w-full flex justify-center items-center">
                        <p className="text-[#FFAE3D] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-bold">Final Hint</p>
                      </div>
                      <div className="w-full flex justify-center items-center">
                        <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center">Essentially solves the riddle</p>
                      </div>
                      <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                      <div className="w-full flex justify-center items-center">
                        <p className="text-[#FFAE3D] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-bold">Using hints impacts player ranking</p>
                      </div>
                      <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] opacity-0" />
                    </div>
                  )
                )
              }
            </div>

            <div id="point-system" ref={pointSystemRef} className="absolute bottom-[2%] flex flex-col items-center gap-2 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 w-full">
              <div className="flex flex-col items-center gap-0 sm:gap-1 md:gap-1.5 lg:gap-2 xl:gap-3 2xl:gap-4">
                <h2 className="text-[#FFBF7E] text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-medium">POINT SYSTEM</h2>
                <p className="text-white/90 font-Sora text-[6px] sm:text-[9px] md:text-xs lg:text-sm xl:text-base 2xl:text-xl">
                  The number of Lives you spent on a given level won’t impact the point system - only HINTS!
                </p>
              </div>

              <div className="w-full aspect-[1112/379] flex justify-between items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6">
                <div className="border border-[#FFCE96]/70 rounded-[0.3125rem] bg-[url('/about-us/frosted-top-bar-bg.png')] bg-no-repeat bg-cover w-1/3 h-full">
                  <div className="relative flex justify-center items-center w-full aspect-[354/52] border-b border-[#FFCE96]/70">
                    <h3 className="text-[#FBFBFB] text-[6px] sm:text-[9px] md:text-xs lg:text-sm xl:text-lg 2xl:text-xl font-bold text-center">Seasons & Tournaments</h3>
                  </div>
                  <div className="flex flex-col justify-between w-full aspect-[354/309] gap-1">
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] opacity-0" />
                    <div className="w-full flex justify-center items-center">
                      <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]">No Hints: 100% of the points </p>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                    <div className="w-full flex justify-center items-center">
                      <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]">The usage of hints affect the points you <br /> receive per riddle!</p>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                    <div className="w-full flex justify-center items-center">
                      <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]">General Hints: 80% of the points </p>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                    <div className="w-full flex justify-center items-center">
                      <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]">Intermediate Hints: 70% of the points </p>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                    <div className="w-full flex justify-center items-center">
                      <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]">Final Hints: 50% of the points </p>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] opacity-0" />
                  </div>
                </div>
                <div className="border border-[#FFCE96]/70 rounded-[0.3125rem] bg-[url('/about-us/frosted-top-bar-bg.png')] bg-no-repeat bg-cover w-1/3 h-full">
                  <div className="relative flex justify-center items-center w-full aspect-[354/52] border-b border-[#FFCE96]/70">
                    <h3 className="text-[#FBFBFB] text-[6px] sm:text-[9px] md:text-xs lg:text-sm xl:text-lg 2xl:text-xl font-bold text-center">Examples // Seasons & Tournaments</h3>
                  </div>
                  <div className="flex flex-col justify-between w-full aspect-[354/309] gap-1">
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] opacity-0" />
                    <div className="w-full flex justify-center items-center">
                      <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]">General Hint: 80% of the points</p>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                    <div className="w-full flex justify-center items-center">
                      <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]">General + intermediate + Final: 50% of the <br />points</p>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                    <div className="w-full flex justify-center items-center">
                      <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]">General  + Final Hint: 50% of the points</p>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                    <div className="w-full flex justify-center items-center">
                      <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]">Final Hint: 50% of the points</p>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                    <div className="w-full flex justify-center items-center">
                      <pre className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]"> </pre>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] opacity-0" />
                  </div>
                </div>
                <div className="border border-[#FFCE96]/70 rounded-[0.3125rem] bg-[url('/about-us/frosted-top-bar-bg.png')] bg-no-repeat bg-cover w-1/3 h-full">
                  <div className="relative flex justify-center items-center w-full aspect-[354/52] border-b border-[#FFCE96]/70">
                    <h3 className="text-[#FBFBFB] text-[6px] sm:text-[9px] md:text-xs lg:text-sm xl:text-lg 2xl:text-xl font-bold text-center">Daily Riddle</h3>
                  </div>
                  <div className="flex flex-col justify-between w-full aspect-[354/309] gap-1">
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] opacity-0" />
                    <div className="w-full flex justify-center items-center">
                      <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]">No Hints: 500 Points</p>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                    <div className="w-full flex justify-center items-center">
                      <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]">The usage of hints affect the points you <br />receive per riddle!</p>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                    <div className="w-full flex justify-center items-center">
                      <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]">General Hints: 350 Points</p>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                    <div className="w-full flex justify-center items-center">
                      <p className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]">Final Hints: 150 Points</p>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                    <div className="w-full flex justify-center items-center">
                      <pre className="text-[#E8EFFD] text-[6px] sm:text-[8px] md:text-[11px] lg:text-sm xl:text-lg 2xl:text-xl font-normal text-center transition-all duration-300 ease-in-out hover:font-bold hover:scale-105 hover:text-[#FFAE3D]"> </pre>
                    </div>
                    <div className="w-full h-[0.0625rem] bg-[linear-gradient(90deg,rgba(40,32,22,0)_0%,#D4B588_50%,rgba(40,32,22,0)_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] opacity-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div ref={scrollContainerRef} className="block sm:hidden w-[calc(375/375*100vw)]  h-[calc(600/812*100vh)] overflow-y-auto">
          <div className={`flex flex-col items-center w-[calc(375/375*100vw)] `}>
            <div className={`flex flex-col justify-center items-center w-[calc(375/375*100vw)]  gap-[calc(18/845*100vh)] `}>
              <div className={`flex flex-col justify-between w-[calc(321/375*100vw)] h-[calc(47/1089*100vh)]`}>
                <button onClick={() => router.push(previousUrl)} className="inline-flex items-center gap-1 rounded-md transition-all duration-200 cursor-pointer hover:drop-shadow-[0_0_5px_#facc15] sm:hidden">
                  <Image src="/statistics/backArrow.svg" alt="Back Icon" height={11.67} width={6.87} />
                  <p className="whitespace-nowrap text-[clamp(8px,20vw,14px)] text-[#cc9a53] font-semibold">  BACK </p>
                </button>
                <p className="text-[clamp(10px,4.0vw,16px)] text-white font-bold">Games Rules</p>
              </div>
              <div className={`flex flex-col gap-2 w-[calc(321/375*100vw)] `} >
                <AccordionSection
                  title="Seasons"
                  buttonText="Play Now"
                  redirectTo="/gamehub"
                  icon="alarm.svg"
                  description={
                    <>
                      Casual gameplay for players that are seeking challenging riddles, without having the pressure of competition.
                      <br />
                      We are currently in
                      <strong className="text-[#DEDEDE] font-bold"> Season I</strong>, and for the first set, we have 50 levels, for you to have fun while solving interesting riddles. Every 6-months, the season will be refreshed with brand new riddles.
                      <br /><br />
                      The lives and hints system apply at this game mode. After level 40, there are no hints available.
                      <br /><br />
                      Players will earn rewards by progressing on REV: Season I.
                    </>
                  }
                  expanded={openIndex === 0}
                  onToggle={() => toggleSection(0)}
                />
                <AccordionSection
                  title="Daily Riddle"
                  buttonText="Play Now"
                  icon="calendarCheck.svg"
                  redirectTo="/riddles/daily"
                  description={
                    <>
                      Riddles usually with a lower difficulty level, aimed to expand the knowledge of our players. The focus of the riddle can be anything.
                      <br />
                      The lives system do not apply (you can submit an answer an infinite number of times).  Hints are available.
                      <br /><br />
                      Playing the daily riddle counts towards a player streak!
                    </>
                  }
                  expanded={openIndex === 1}
                  onToggle={() => toggleSection(1)}
                />
                <AccordionSection
                  title="Tournaments"
                  buttonText="Check available tournaments"
                  redirectTo="/clash/tournaments"
                  icon="trophyGamePlay.svg"
                  description={
                    <>
                      For the competitive minds, we are creating on a monthly basis, tournaments with prizes.  We plan to have free and premium clashes, both
                      <br />
                      with prizes. Each tournament will have its dedicated page, where players can consult the details about such event.
                      <br /><br />
                      Although in the beginning, the prizes will be in the form of achievements, free hints and free lives, we intend to move towards cash prizes.
                    </>
                  }
                  expanded={openIndex === 2}
                  onToggle={() => toggleSection(2)}
                />
              </div>
              <div className={`flex flex-col justify-between  w-[calc(321/375*100vw)] gap-4`}>
                <div className={`flex flex-col justify-between  w-[calc(321/375*100vw)] h-[calc(42/1089*100vh)] mb-[calc(10/1089*100vh)]`}>
                  <h1 className="text-white text-center text-[clamp(8px,10.0vw,14px)] font-bold">Game Mechanics</h1>
                  <p className="text-center text-[#E2AC5D]">Everything you need to know</p>
                </div>
                {/*Container 1*/}
                <div ref={container1Ref} onClick={toggleContainer1} className={`relative overflow-hidden transition-all ease-in-out w-[calc(321/375*100vw)] rounded-md ${!open ? "border-t-2 border border-[#D4B588] bg-[#342317]/50" : ""}  h-[calc(51/1089*100vh)]`}>
                  {open && (
                    <img src="/gamePlay/Container1Overlay.png" alt="Overlay" className="absolute w-full h-full rounded-md animate-fadeIn z-0" />)}

                  {/* Header */}
                  <div className={`relative z-10 flex justify-center items-center h-[calc(51/1089*100vh)] ${open ? "border-b-2 border-t-0 border-[#D4B588]" : ""}`}>
                    <div className="flex justify-between w-[calc(289/375*100vw)]">
                      <div className="flex items-center gap-2">
                        <img src="/gamePlay/psychology.svg" width={18.89} />
                        <h2 className="w-full uppercase text-sm font-Sora font-bold text-[#D4B588]"> OVERVIEW</h2>
                      </div>
                      <img src={open ? "/gamePlay/crossIcon.svg" : "/gamePlay/add.svg"} alt={open ? "Close" : "Open"} width={10.43} />
                    </div>
                  </div>

                  {open && (
                    <div className="relative z-10 px-4 text-[clamp(8px,5vw,14px)] leading-relaxed h-[calc(425/1089*100vh)] no-scrollbar overflow-y-auto">
                      <p className="text-white mt-1.5"> Within the REV ecosystem, the main tool you have is your brain.</p>
                      <img src="/gamePlay/LineContainer1.png" alt="Line" className="mt-1" />
                      <p className="mt-1 text-white"> To submit an answer to a riddle, you have a bar at the bottom of the riddle page where you can insert the solution.</p>
                      <p className="text-[#FFD278] "> ( sometimes there are other ways to pass a given level )</p>
                      <p className="mt-3 text-white "> In order for your attempt to be valid, you need to have lives. For REV: Season I and Tournaments, you will only be able to submit answers if you have available lives. </p>
                      <p className="mt-3 text-[#FFD278]"> For the Daily Riddle, lives do not apply. You can try as many times as you wish.</p>
                    </div>
                  )}
                </div>

                {/*Container 2*/}
                <div ref={container2Ref} className={`relative overflow-hidden transition-all ease-in-out w-[calc(321/375*100vw)] rounded-md ${!open1 ? "border-t-2 border border-[#D4B588] bg-[#342317]/50" : ""}  h-[calc(51/1089*100vh)]`}>
                  {open1 && (
                    <img src="/gamePlay/Container1Overlay.png" alt="Overlay" className="absolute w-full h-full rounded-md animate-fadeIn z-0" />)}

                  {/* Header */}
                  <div onClick={toggleContainer2} className={`relative z-10 flex justify-center items-center h-[calc(51/1089*100vh)] ${open1 ? "border-b-2 border-t-0 border-[#D4B588]" : ""}`}>
                    <div className="flex justify-between w-[calc(289/375*100vw)]">
                      <div className="flex items-center gap-2">
                        <img src="/gamePlay/favorite.svg" width={18.89} />
                        <h2 className="text-[#D4B588] text-sm font-bold">LIVES</h2>
                      </div>
                      <img src={open1 ? "/gamePlay/crossIcon.svg" : "/gamePlay/add.svg"} alt={open1 ? "Close" : "Open"} width={10.43} />
                    </div>
                  </div>

                  {open1 && (
                    <div className="relative z-10 px-4 text-[clamp(8px,5vw,14px)] leading-relaxed h-[calc(373/1089*100vh)] no-scrollbar overflow-y-auto">
                      <p className="text-white text-[clamp(10px,6vw,16px)] mt-1"> This is the number of attemps the user currently has. These lives regenerate based on progression and time.</p>
                      <img src="/gamePlay/LineContainer1.png" alt="Line" className="mt-2" />
                      <p className="text-[#D4B588] "> Free Live Refill System </p>
                      <p className="mt-1 text-white"> +1 Live / per sucessful riddle</p>
                      <p className="mt-1 text-white"> +3 Lives / per day </p>
                      <p className="mt-[calc(10/1089*100vh)] text-[#FFAE3D] font-bold text-center"> The free lives refill system will only be applicable if you have 4 or less lives </p>
                      <p className="mt-[calc(10/1089*100vh)] text-[#FFAE3D] font-bold text-center"> Stacking Lives is possible, if you buy Lives or enroll in paid tournaments </p>
                    </div>
                  )}
                </div>
                {/*Container 3*/}
                <div ref={container3Ref} className={`relative flex flex-col items-center justify-center overflow-hidden transition-all ease-in-out w-[calc(321/375*100vw)] rounded-md ${!open2 ? "border-t-2 border border-[#D4B588] bg-[#2b201d]/50" : ""}  h-[calc(51/1089*100vh)]`}>
                  {open2 && (
                    <img src="/gamePlay/OverlayContainer3.png" alt="Overlay" className="absolute w-full h-full rounded-md  z-0" />)}

                  {/* Header */}
                  <div onClick={toggleContainer3} className={`relative z-10 flex justify-center overflow-hidden items-center w-[calc(319/375*100vw)] h-[calc(51/1089*100vh)] ${open2 ? "border-b  border-[#2b201d]/900 bg-[#2b201d]/30" : ""}`}>
                    <div className="flex justify-between w-[calc(289/375*100vw)]">
                      <div className="flex items-center gap-2">
                        <img src="/gamePlay/LightBulb.svg" width={24} />
                        <h2 className="text-[#D4B588] text-sm font-bold">HINTS</h2>
                      </div>

                      <img src={open2 ? "/gamePlay/crossIcon.svg" : "/gamePlay/add.svg"} width={10.43} />
                    </div>
                  </div>

                  {open2 && (
                    <div className="relative z-10 flex flex-col justify-center text-[clamp(8px,5vw,14px)] leading-relaxed h-[calc(502/1089*100vh)] no-scrollbar overflow-y-auto">
                      <div className="h-[calc(502/1089*100vh)] w-[calc(291/375*100vw)] flex flex-col ">
                        <p className="text-white text-[clamp(10px,6vw,16px)] mt-2">
                          Hints are designed to assist the player and, in most cases, will provide helpful guidance.
                        </p>
                        <img src="/gamePlay/LineContainer1.png"  alt="Line" className="mt-2" />
                        <div className=" flex justify-center items-center w-[calc(289/375*100vw)] h-[calc(282/1089*100vh)] rounded-xl max-w-md">

                          <div className=" text-[#f5c16c] flex flex-col justify-between w-[calc(321/375*100vw)] h-[calc(236/1089*100vh)]">
                            <div className="flex justify-between h-[calc(106/1089*100vh)]">
                              <div className="w-[calc(10/375*100vw)] h-full flex flex-col items-center mt-1">
                                {/* Top Dot */}
                                <span className="w-3 h-3 block rounded-full bg-[#f5c16c]" />

                                {/* Dotted line */}
                                <div className="flex-1 flex flex-col justify-between mt-1">
                                  {Array.from({ length: 11 }).map((_, i) => (
                                    <span key={i} className="w-0.5 h-0.5 block rounded-full bg-[#f5c16c]" />
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col justify-between w-[calc(255/375*100vw)] h-[calc(74/1089*100vh)]">
                                <h3 className="text-sm font-semibold tracking-wide uppercase">
                                  GENERAL HINTS
                                </h3>
                                <p className="text-sm text-white">
                                  Nudges the logic direction without revealing much
                                </p>
                              </div>
                            </div>


                            <div className="flex justify-between h-[calc(80/1089*100vh)]">
                              <div className="w-[calc(10/375*100vw)] h-full flex flex-col items-center mt-1">
                                {/* Top Dot */}
                                <span className="w-3 h-3 block rounded-full bg-[#f5c16c]" />

                                {/* Dotted line */}
                                <div className="flex-1 flex flex-col justify-between mt-1">
                                  {Array.from({ length: 8 }).map((_, i) => (
                                    <span key={i} className="w-0.5 h-0.5 block rounded-full bg-[#f5c16c]" />
                                  ))}
                                </div>
                              </div>

                              <div className="w-[calc(255/375*100vw)] h-full">
                                <h3 className="text-sm font-semibold tracking-wide uppercase">
                                  INTERMEDIATE HINTS
                                </h3>
                                <p className="text-sm text-white">
                                  Provides a more focus clue
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between h-[calc(50/1089*100vh)]">
                              <div className="w-[calc(10/375*100vw)] h-full flex flex-col items-center mt-1">
                                {/* Top Dot */}
                                <span className="w-3 h-3 block rounded-full bg-[#f5c16c]" />

                                {/* Dotted line */}
                                <div className="flex-1 flex flex-col justify-between mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className="w-0.5 h-0.5 block rounded-full bg-[#f5c16c]" />
                                  ))}
                                </div>
                              </div>

                              <div className="w-[calc(255/375*100vw)] h-full">
                                <h3 className="text-sm font-semibold tracking-wide uppercase">
                                  FINAL HINTS
                                </h3>
                                <p className="text-sm text-white">
                                  Essentially solves the riddle
                                </p>
                              </div>
                            </div>
                          </div>

                        </div>
                        <div className="flex flex-col justify-between items-center gap-2 w-[calc(291/375*100vw)] h-[calc(72/1089*100vh)]">
                          <img src={'/gamePlay/warning.svg'} alt="Warning icon" width={52.84} height={47.28} />
                          <p className="text-white font-bold text-sm">USING HINTS IMPACTS YOUR RANK</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div id="point-system" ref={pointSystemRef} className={`flex flex-col justify-between w-[calc(321/375*100vw)] gap-[calc(13/1089*100vh)]`}>
                <div className="flex flex-col">
                  <h1 className="text-white font-bold text-center">Point System</h1>
                  <p className="text-[#FFAE3D] text-center"> Lives do not impact points, only hints.</p>
                </div>
                <div className={`flex flex-col items-center justify-start rounded-md  border-2 border-[#746651] w-[calc(321/375*100vw)] h-[calc(179/1089*100vh)] pt-0.5`}>
                  <div className={`flex flex-col items-center justify-center rounded-t-md bg-[#17171B] w-[calc(318/375*100vw)] h-[calc(28/1089*100vh)]`}>
                    <div className={`flex gap-3 items-center  w-[calc(275/375*100vw)] h-[calc(28/1089*100vh)]`}>
                      <img src={'/payments/trophyMobile.svg'} alt="Trophy " width={12.15} height={12.15} />
                      <h3 className="text-white font-bold text-xs">SEASONS & TOURNAMENTS</h3>
                    </div>
                  </div>
                  <div className={` text-xs flex flex-col border-t-2 rounded-b-md border-[#746651] bg-[#161B1D] justify-between w-[calc(319/375*100vw)] h-[calc(144/1089*100vh)]`}>
                    <div className={` flex flex-col justify-center items-center border-b-2 bg-[#0C1D17] border-[#369E5E] w-[calc(318/375*100vw)] h-[calc(42/1089*100vh)]`}>
                      <div className={`flex justify-between items-center w-[calc(275/375*100vw)] h-[calc(42/1089*100vh)]`}>
                        <h2 className="text-[#39A762] font-bold">NO HINTS USED</h2>
                        <h2 className="text-white">100% Points</h2>
                      </div>
                    </div>
                    <div className={` flex flex-col justify-center items-center w-[calc(318/375*100vw)] h-[calc(35/1089*100vh)]`}>
                      <div className={`flex justify-between items-center w-[calc(275/375*100vw)] h-[calc(32/1089*100vh)]`}>
                        <h2 className="text-white">GENERAL HINTS</h2>
                        <h2 className="text-white">80%</h2>
                      </div>
                      <img src={'/gamePlay/PointCenterLine.png'} alt="Center Line" className="w-full" />
                    </div>
                    <div className={` flex flex-col justify-center items-center w-[calc(318/375*100vw)] h-[calc(35/1089*100vh)]`}>
                      <div className={`flex justify-between items-center w-[calc(275/375*100vw)] h-[calc(32/1089*100vh)]`}>
                        <h2 className="text-white">INTERMEDIATE HINTS</h2>
                        <h2 className="text-white">70%</h2>
                      </div>
                      <img src={'/gamePlay/PointCenterLine.png'} alt="Center Line" className="w-full" />
                    </div>
                    <div className={`z-10 flex flex-col justify-center items-center w-[calc(318/375*100vw)] h-[calc(35/1089*100vh)]`}>
                      <div className={`flex justify-between items-center w-[calc(275/375*100vw)] h-[calc(32/1089*100vh)]`}>
                        <h2 className="text-white">FINAL HINTS</h2>
                        <h2 className="text-white">50%</h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`flex flex-col rounded-md border-2 border-[#746651] justify-between w-[calc(321/375*100vw)] h-[calc(149/1089*100vh)]`}>
                  <div className={`flex flex-col items-center justify-center rounded-t-md bg-[#17171B] w-[calc(318/375*100vw)] h-[calc(28/1089*100vh)]`}>
                    <div className={`flex gap-3 items-center  w-[calc(275/375*100vw)] h-[calc(28/1089*100vh)]`}>
                      <img src={'/gamePlay/calendar.svg'} alt="Trophy " width={12.94} height={13.83} />
                      <h3 className="text-white font-bold text-xs">DAILY RIDDLE</h3>
                    </div>
                  </div>
                  <div className={` text-xs flex flex-col bg-[#161B1D] border-t-2 border-[#746651] rounded-b-md justify-between w-[calc(318/375*100vw)] h-[calc(147/1089*100vh)]`}>
                    <div className={`flex flex-col justify-center items-center border-b-2 bg-[#0C1D17] border-[#369E5E] w-[calc(318/375*100vw)] h-[calc(42/1089*100vh)]`}>
                      <div className={`flex justify-between items-center w-[calc(275/375*100vw)] h-[calc(42/1089*100vh)]`}>
                        <h2 className="text-[#39A762] font-bold">NO HINTS USED</h2>
                        <h2 className="text-white">500 Points</h2>
                      </div>
                    </div>
                    <div className={`z-10 flex flex-col justify-center items-center w-[calc(318/375*100vw)] h-[calc(35/1089*100vh)]`}>
                      <div className={`flex justify-between items-center w-[calc(275/375*100vw)] h-[calc(32/1089*100vh)]`}>
                        <h2 className="text-white">GENERAL HINTS</h2>
                        <h2 className="text-white">350</h2>
                      </div>
                      <img src={'/gamePlay/PointCenterLine.png'} alt="Center Line" className="w-full" />
                    </div>
                    <div className={`z-10 flex flex-col justify-center items-center w-[calc(318/375*100vw)] h-[calc(32/1089*100vh)]`}>
                      <div className={`flex justify-between items-center w-[calc(275/375*100vw)] h-[calc(32/1089*100vh)]`}>
                        <h2 className="text-white">FINAL HINTS</h2>
                        <h2 className="text-white">150</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`w-[calc(321/375*100vw)] h-[calc(40/1089*100vh)]`}> </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default GameplaySection;
