"use client";
import { useRef, useContext, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Header from "../common/header";
import Sidebar from "../common/sidebar";
import Footer from "../common/footer";
import GameplaySection from "./gameplay-section";
import AboutSection from "./about-section";
import { AppContext } from "../context/AppContext";
import { useImagePreloader } from "@/lib/hooks/useImagePreloader";
import Loader from "../common/loader";

type Tab = "gameplay" | "about";

const AboutUsPage = () => {
  const { currentTab, setCurrentTab } = useContext(AppContext)!;
  const [imagesLoaded, setImagesLoaded] = useState(false);


  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const isGameplay = currentTab === "gameplay";

  useImagePreloader(
    ["/about-us/GameplayBg.png", "/about-us/AboutBg.png", "/about-us/highlight-bar.svg"],
    () => setImagesLoaded(true)
  );

  useGSAP(() => {
    if (!contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        backgroundImage: isGameplay
          ? "url('/about-us/GameplayBg.png')"
          : "url('/about-us/AboutBg.png')",
        duration: 0.6,
        ease: "power1.inOut",
      });
    }
  }, [currentTab, isGameplay, imagesLoaded]);

  if (!imagesLoaded) return <Loader />;

  return (
    <>
      <div className="hidden sm:block">
        <div className="bg-black min-h-screen w-full flex flex-col">
          <div ref={bgRef} className={`transition-all duration-500 ease-in-out ${isGameplay ? "aspect-[1280/2012]" : "aspect-[1280/896]"} bg-no-repeat bg-top bg-cover w-full`}>
            <Header />
            <div className="flex">
              <div className="py-[1.5%]">
                <Sidebar />
              </div>
              <div className="flex-1 px-[4%] py-[3%]">
                <div className="relative aspect-[1112/623] bg-[url('/about-us/highlight-bar.svg')] bg-no-repeat bg-top bg-cover w-full">
                  <div className="flex justify-between items-center text-[#898989] absolute aspect-[240/38] -ms-[1%] -mt-[1.9%] left-1/2 -translate-x-1/2 z-10 w-[21.6%] border border-white/10 bg-black/70 rounded-[2.74rem] shadow-[inset_0_0_1px_0_#fff]">
                    <div className={`absolute top-0 h-full w-1/2 bg-[#2E0A0A] border border-[#FF9D00] ${isGameplay ? " translate-x-0" : "translate-x-full"} rounded-[2.74rem] shadow-[0_8px_8px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-in-out`} />
                    <button onClick={() => setCurrentTab("gameplay")} className={`relative z-10 w-1/2 h-full font-bold cursor-pointer transition-all duration-300 text-[6px] sm:text-[8px] md:text-xs lg:text-[0.9375rem] ${isGameplay ? "text-[#D1A760]" : "hover:text-[#D1A760]"}`}>
                      GAMEPLAY
                    </button>
                    <button onClick={() => setCurrentTab("about")} className={`relative z-10 w-1/2 h-full font-bold cursor-pointer transition-all duration-300 text-[6px] sm:text-[8px] md:text-xs lg:text-[0.9375rem] ${!isGameplay ? "text-[#D1A760]" : "hover:text-[#D1A760]"}`}>
                      ABOUT US
                    </button>
                  </div>
                  <div className="absolute inset-0 flex flex-col w-full">
                    <div ref={contentRef}>
                      {isGameplay ? <GameplaySection /> : <AboutSection />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <div className="block sm:hidden">
        <AboutSection />
      </div>
    </>
  );
};

export default AboutUsPage;
