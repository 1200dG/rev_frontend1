import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/common/header";
import Sidebar from "@/components/common/sidebar";
import { routes } from "@/lib/routes";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import GLBModelViewer from "../3D-Model";
import { useImagePreloader } from "@/lib/hooks/useImagePreloader";
import PrimaryButton from "@/components/common/buttons/PrimaryButton";
import { getVideoPath } from "@/lib/utils/video";
import { externalVideos, localVideos } from "@/lib/constants/videos";

interface MainPageProps {
  onAllImagesLoad?: () => void;
  footerSentinelRef?: React.RefObject<HTMLDivElement | null>;
}

gsap.registerPlugin(ScrollTrigger);

const MainPage: React.FC<MainPageProps> = ({ onAllImagesLoad, footerSentinelRef, }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [hideSidebar, setHideSidebar] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    if (window.innerWidth >= 640) return;

    const onScroll = () => {
      const footerTop = footerSentinelRef?.current?.getBoundingClientRect().top ?? Infinity;
      const viewportHeight = window.innerHeight;

      // sidebar should hide if footer is in viewport
      setHideSidebar(footerTop < viewportHeight);
      setShowSidebar(footerTop >= viewportHeight);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const handlePlayClick = () => {
    if (session?.user?.account_id) {
      router.push(routes.ui.gamehub);
    } else {
      router.push(routes.ui.auth.signIn)
    }
  };

  useImagePreloader(
    [
      '/landingPage/Section1.png',
      '/landingPage/Section2.png',
      '/landingPage/key.png',
      '/landingPage/sun.svg',
    ],
    () => onAllImagesLoad?.()
  );

  useEffect(() => {
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    if (error === 'access_denied' && message) {
      toast.error(message);
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      url.searchParams.delete('message');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  useGSAP(() => {
    const images = gsap.utils.toArray(".riddle-image") as HTMLElement[];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".riddle-stage",
        start: "top top",
        end: `+=${images.length * 1000}`,
        scrub: true,
        pin: true,
        markers: false
      }
    });

    images.forEach((img, i) => {
      if (i === 0) return;
      tl.fromTo(img, {
        y: "100%",
        opacity: 0
      }, {
        y: "0%",
        opacity: 1,
        duration: 1
      });

      tl.to(images[i - 1], {
        scale: 0.97,
        opacity: 0.3,
        duration: 1,
        ease: "power1.out"
      }, "<");
    });
  }, []);

  const videoSrc = getVideoPath(localVideos.landingDesktop, externalVideos.landingDesktop);
  return (
    <>
      <div className="hidden sm:block">
        <div className="relative aspect-1280/2410 bg-[url('/landingPage/Section1.png')] bg-no-repeat bg-cover w-full">
          <div className="relative w-full aspect-1280/896">
            <Header />
            <div className="flex">
              <div className="py-[1.5%]">
                <Sidebar />
              </div>
              <div className="inline-flex flex-col items-start gap-1 lg:gap-2 xl:gap-3 2xl:gap-4 px-[4%] 2xl:px-[5%] py-[10%] sm:py-[11%] lg:py-[13%] xl:py-[12%]">
                <h1 className="text-white text-lg sm:text-2xl md:text-3xl lg:text-[2.5rem] xl:text-[3.3rem] 2xl:text-6xl font-bold">
                  Smart enough to<br /> solve the unsolvable?
                </h1>
                <button onClick={handlePlayClick} className="group flex justify-center items-center border border-[#CFA1A1] rounded-full px-2 md:px-3 lg:px-4 xl:px-5 2xl:px-6 py-1 xl:py-2 gap-1 lg:gap-2 hover:bg-[#CFA1A1]/10 cursor-pointer transition-transform duration-300 hover:scale-105">
                  <span className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-sm xl:text-base 2xl:text-lg font-normal text-white will-change-transform">Ready</span>
                  <img src="/landingPage/err_east.svg" className="w-2 h-auto sm:w-3 md:w-4 lg:w-5 xl:w-6 2xl:w-7 transform transition-transform duration-300 group-hover:translate-x-2" />
                </button>
              </div>
            </div>

          </div>

          <div className="w-full aspect-1280/775 flex flex-col justify-between items-center pt-6 lg:pt-8 pb-10 sm:pb-16 md:pb-20 lg:pb-32 xl:pb-36 2xl:pb-40">
            <img src="/landingPage/key.png" className="w-20 sm:w-40 lg:w-60 xl:w-80 transition-all duration-300 hover:scale-110" />
            <div className="relative flex justify-between items-center w-full h-48 sm:h-60 md:h-72 lg:h-80 xl:h-96 2xl:h-112">
              <div className="flex flex-col gap-3 ps-[10%]">
                <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-5xl font-bold">REV UNIVERSE</h2>
                <p className="text-[#E6E6E6] text-[0.5rem] sm:text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-normal">
                  It starts simple — but only your mind can open the path.<br />
                  A world of puzzles awaits — but only the worthy will see it all.<br />
                  <br />The riddles span countless realms — dare to discover them all?
                </p>
              </div>
              <div className="relative flex justify-center items-center z-10">
                <img src="/landingPage/sunBg.svg" className="w-48 sm:w-60 md:w-72 lg:w-80 xl:w-96 2xl:w-104 h-48 sm:h-60 md:h-72 lg:h-80 xl:h-96 2xl:h-104 rounded-full animate-pulse scale-150" />
                <div className="absolute left-1/2 -translate-x-1/2 w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56 2xl:w-64 rounded-full sunShadow">
                  <img src="/landingPage/sun.svg" className="animate-spin [animation-duration:100s] [animation-timing-function:linear] [animation-iteration-count:infinite transition-transform duration-700 ease-in-out hover:scale-105 w-full" />
                </div>
              </div>
              <img src="/landingPage/astronaut.png" alt="" className="absolute bottom-5 z-10 right-[30%] sm:right-[28%] md:right-[26%] lg:right-[24%] xl:right-[22%] 2xl:right-[20%] w-15 sm:w-25 md:w-30 lg:w-35 xl:w-40 2xl:w-48 h-15 sm:h-25 md:h-30 lg:h-35 xl:h-40 2xl:h-48 animate-float" />
              <div className="meteor-1" /><div className="meteor-3" /><div className="meteor-5" /> <div className="meteor-7" /><div className="meteor-9" /><div className="meteor-11" /><div className="meteor-13" /><div className="meteor-15" />
            </div>
          </div>

          <div className="w-full aspect-1280/730">
            <div className="flex flex-col items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-12 2xl:gap-16 w-full">
              <div className="flex flex-col items-center gap-1 sm:gap-2 xl:gap-3">
                <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold">Gameplay</h2>
                <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-normal">
                  From casual to competitive gameplay, we got you!
                </p>
              </div>
              <div className="relative flex items-center gap-1 lg:gap-1.5 2xl:gap-2 w-full px-[10%] py-2">
                <div className="relative z-10 flex flex-col items-center w-1/2 h-auto border border-[#FFCE96]/70 bg-[#6C5C43]/30 rounded fill-[rgba(108,92,67,0.30)] stroke-[rgba(255,206,150,0.70)] [stroke-width:1px] [filter:drop-shadow(0_4px_4px_rgba(0,0,0,0.25))_drop-shadow(0_4px_4px_rgba(0,0,0,0.25))]">
                  <div className="absolute top-5 right-[35%] translate-x-1/2 w-[40%] h-[20%] rounded-[15.53rem] opacity-30 bg-[radial-gradient(50%_50%_at_51.6%_50%,_rgba(70,_209,_252,_0.30)_0%,_rgba(2,_117,_151,_0.00)_100%)]" />
                  <div className="absolute -bottom-2 w-[80%] h-[50%] rounded-[30.125rem] bg-black mix-blend-luminosity blur-[150px] -z-10" />
                  <div className="relative flex justify-center items-center w-full h-auto">
                    <img src="/landingPage/Illustration1.png" className="opacity-0" />
                    <div className="absolute top-1/2 left-1/2 -translate-1/2 flex justify-center w-full h-2/3">
                      <div className="relative flex justify-center w-full h-full">
                        <div className="absolute -bottom-[13%] left-[53%] -translate-x-1/2 w-[40%] h-[110%] rounded-full opacity-40 bg-[radial-gradient(50%_50%_at_50%_50%,_#FFD278_8.43%,_rgba(255,_210,_120,_0)_100%)]" />
                        <img src="/landingPage/pulseAura.svg" className="-scale-x-100 animate-spin [animation-duration:100s] [animation-timing-function:linear] [animation-iteration-count:infinite" />
                        <img src="/landingPage/pulse.svg" className="absolute top-1/2 left-1/2 -translate-1/2 w-full h-[65%]" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 sm:gap-3 px-[12%] pb-[15%] -mt-[6%]">
                    <div className="flex flex-col items-center">
                      <h2 className="text-white text-[0.5rem] sm:text-[0.6rem] md:text-xs lg:text-base xl:text-xl 2xl:text-2xl font-bold">REV Season I</h2>
                      <span className="text-white/56 text-[0.3rem] sm:text-[0.4rem] md:text-[0.5rem] lg:text-[0.7rem] xl:text-sm 2xl:text-base font-normal">Casual Gameplay</span>
                    </div>
                    <p className="text-[#E8EFFD] text-center text-[0.4rem] sm:text-[0.5rem] md:text-[0.6rem] lg:text-xs xl:text-base 2xl:text-lg font-normal">
                      We have a set of 50 levels, for you to have fun while solving interesting riddles.
                    </p>
                  </div>
                </div>
                <img src="/landingPage/lock.svg" className="absolute left-1/2 transform -translate-x-1/2 z-20 w-[10%] h-[26%] transition-all duration-300 hover:scale-105  translate-all ease-in-out  hover:drop-shadow-[0_0_2px_#facc15]" />
                <div className="relative z-10 flex flex-col items-center w-1/2 h-auto border border-[#FFCE96]/70 bg-[#6C5C43]/30 rounded fill-[rgba(108,92,67,0.30)] stroke-[rgba(255,206,150,0.70)] stroke-width:[1px] [filter:drop-shadow(0_4px_4px_rgba(0,0,0,0.25))_drop-shadow(0_4px_4px_rgba(0,0,0,0.25))]">
                  <div className="relative flex justify-center items-center w-full h-auto">
                    <img src="/landingPage/Illustration1.png" className="mask-fade" />
                    <div className="absolute top-1/2 left-1/2 -translate-1/2 flex justify-center w-full h-2/3">
                      <div className="absolute top-1/2 left-1/2 -translate-1/2 w-[40%] h-[115%] rounded-[20.24463rem] opacity-50 bg-[radial-gradient(50%_50%_at_50%_50%,_#FFD278_0%,_rgba(94,_48,_7,_0)_100%)] -z-10" />
                      <img src="/landingPage/pulseAura.svg" className="animate-spin [animation-duration:100s] [animation-timing-function:linear] [animation-iteration-count:infinite" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 w-[80%] h-[50%] rounded-[30.125rem] bg-black mix-blend-luminosity blur-[150px] -z-10" />
                  <div className="flex flex-col items-center gap-2 sm:gap-3 px-[12%] pb-[15%] -mt-[6%]">
                    <div className="flex flex-col items-center">
                      <h2 className="text-white text-[0.5rem] sm:text-[0.6rem] md:text-xs lg:text-base xl:text-xl 2xl:text-2xl font-bold">Tournaments</h2>
                      <span className="text-white/56 text-[0.3rem] sm:text-[0.4rem] md:text-[0.5rem] lg:text-[0.7rem] xl:text-sm 2xl:text-base font-normal">Competitive</span>
                    </div>
                    <p className="text-[#E8EFFD] text-center text-[0.4rem] sm:text-[0.5rem] md:text-[0.6rem] lg:text-xs xl:text-base 2xl:text-lg font-normal">
                      For the competitive minds, we are creating on a monthly basis, tournments with prizes.
                    </p>
                  </div>
                </div>
                <div className="meteor-2" /><div className="meteor-4" /><div className="meteor-6" /> <div className="meteor-8" /><div className="meteor-10" /><div className="meteor-12" /><div className="meteor-14" />
              </div>
            </div>
          </div>
        </div>
        <div className="riddle-stage aspect-1280/2538 bg-[url('/landingPage/Section2.png')] bg-no-repeat bg-cover flex flex-col justify-between w-full">
          <div className="flex flex-col items-center gap-0 2xl:gap-[6.145rem] ">
            <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 w-full mt-[4%] py-[7%] px-[7%]">
              <div className="flex flex-col items-center gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 xl:gap-2.5 2xl:gap-3 ">
                <h2 className="text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold">Unique Riddles</h2>
                <p className="text-white  text-[7px] sm:text-[9px] md:text-xs lg:text-sm xl:text-lg 2xl:text-xl font-normal">
                  We are committed in designing challenging levels for your&nbsp;
                  <span className="text-[#F80]">mind</span>
                </p>
              </div>
              <div onClick={() => setShowVideo(true)} className="relative w-[calc(1077/1280*100vw)] h-[calc(633/930*100vh)] border border-[#FFCE96]/70 overflow-hidden rounded-xl lg:rounded-2xl cursor-pointer" >
                {!showVideo ? (
                  <>
                    <img src="/landingPage/uniqueRiddle.png" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img src="/landingPage/playVideo.svg" width={33} height={40} />
                    </div>
                  </>
                ) : (
                  <video
                    src={videoSrc}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col items-center gap-3 sm:gap-4 lg:gap-6 xl:gap-7 2xl:gap-8 w-full py-[25%] px-[7%]">
                <div className="flex flex-col items-center gap-0 lg:gap-2">
                  <h2 className="text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold">All in one place</h2>
                  <p className="text-white/90 text-[8px] sm:text-[11px] lg:text-sm xl:text-base 2xl:text-xl font-normal">Your journey starts here</p>
                </div>
                <div className="grid grid-cols-4 gap-1 md:gap-2 lg:gap-3 2xl:gap-4 w-full">
                  <div className="flex flex-col items-center gap-1 md:gap-2 lg:gap-3 2xl:gap-4 w-full col-span-3">
                    <div className="flex items-center gap-1 md:gap-2 lg:gap-3 2xl:gap-4 w-full">

                      {/* REV Season I */}
                      <div className="relative w-full aspect-[272.75/196]">
                        <Link href="/gamehub" className="absolute inset-0 block  bg-[url('/landingPage/Overlay.png')] bg-no-repeat bg-top bg-cover border border-white rounded-lg lg:rounded-xl 2xl:rounded-2xl bg-[#534741] shadow-[0px_3px_4px_rgba(255,252,250,0)] transition-shadow duration-300 hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box" />
                        <div className="absolute bottom-[7%] flex flex-col items-center gap-0 w-full pointer-events-none">
                          <h2 className="text-white text-[9px] sm:text-xs md:text-[15px] lg:text-lg xl:text-xl 2xl:text-2xl font-bold">
                            REV Season I
                          </h2>
                          <p className="text-white/56 text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-normal">
                            Casual Gameplay
                          </p>
                        </div>
                      </div>

                      {/* Daily Riddle */}
                      <div className="relative w-full aspect-[272.75/196]">
                        <Link href="/gamehub" className="absolute inset-0 block  bg-[url('/landingPage/Overlay-2.png')] bg-no-repeat bg-top bg-cover border border-white rounded-lg lg:rounded-xl 2xl:rounded-2xl bg-[#534741] shadow-[0px_3px_4px_rgba(255,252,250,0)] transition-shadow duration-300 hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box" />
                        <div className="absolute bottom-[18%] xl:bottom-[20%] left-[10%] pointer-events-none">
                          <h2 className="text-white text-[9px] sm:text-xs md:text-[15px] lg:text-lg xl:text-xl 2xl:text-2xl font-bold">
                            Daily Riddle
                          </h2>
                        </div>
                      </div>

                      {/* Lives System */}
                      <div className="relative w-full aspect-[272.75/196]">
                        <Link href="/about" className="absolute inset-0 block  bg-[url('/landingPage/Overlay-3.png')] bg-no-repeat bg-top bg-cover border border-white rounded-lg lg:rounded-xl 2xl:rounded-2xl bg-[#534741] shadow-[0px_3px_4px_rgba(255,252,250,0)] transition-shadow duration-300 hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box" />
                        <div className="absolute bottom-[18%] xl:bottom-[20%] flex justify-center w-full pointer-events-none">
                          <h2 className="text-white text-[9px] sm:text-xs md:text-[15px] lg:text-lg xl:text-xl 2xl:text-2xl font-bold">
                            Lives System
                          </h2>
                        </div>
                      </div>

                    </div>

                    <div className="flex items-center gap-1 md:gap-2 lg:gap-3 2xl:gap-4 w-full">

                      {/* Leaderboards */}
                      <div className="relative w-full aspect-[409.48/375.4]">
                        <Link href="/leaderboard" className="absolute inset-0 block bg-[url('/landingPage/Overlay-5.png')] bg-no-repeat bg-top bg-cover border border-white  rounded-lg lg:rounded-xl 2xl:rounded-3xl  bg-[#534741]  shadow-[0px_3px_4px_rgba(255,252,250,0)]  transition-shadow duration-300  hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box" />
                        <div className="absolute bottom-[8%] flex flex-col items-center w-full pointer-events-none">
                          <h2 className="text-white text-[10px] sm:text-sm md:text-base lg:text-xl xl:text-2xl 2xl:text-3xl font-bold">
                            Leaderboards
                          </h2>
                          <p className="text-white/56 text-[10px] sm:text-sm md:text-base lg:text-xl xl:text-2xl 2xl:text-3xl font-normal md:leading-4 xl:leading-6">
                            Play to earn rewards
                          </p>
                        </div>
                      </div>

                      {/* Monthly Tournaments */}
                      <div className="relative w-full aspect-[409.48/375.4]">
                        <Link href="/clash/tournaments" className="absolute inset-0 block bg-[url('/landingPage/Overlay-6.png')] bg-no-repeat bg-top bg-cover border border-white rounded-lg lg:rounded-xl 2xl:rounded-3xl bg-[#534741] shadow-[0px_3px_4px_rgba(255,252,250,0)] transition-shadow duration-300 hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box" />
                        <div className="absolute bottom-[8%] left-[9%] pointer-events-none">
                          <h2 className="text-white text-[10px] sm:text-sm md:text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
                            Monthly <br /> Tournaments
                          </h2>
                        </div>
                      </div>

                    </div>

                  </div>
                  <div className="flex flex-col gap-1 md:gap-2 lg:gap-3 2xl:gap-4 items-center w-full col-span-1">
                    <div className="relative w-full aspect-[272.75/196]">
                      <Link href="/about" className="absolute inset-0 block bg-[url('/landingPage/Overlay-4.png')] bg-no-repeat bg-top bg-cover border-[0.5px] border-white rounded-lg lg:rounded-xl 2xl:rounded-2xl bg-[#534741] shadow-[0px_3px_4px_rgba(255,252,250,0)] transition-shadow duration-300 hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box" />
                      <div className="absolute bottom-[18%] xl:bottom-[20%] flex justify-center w-full pointer-events-none">
                        <h2 className="text-white text-[9px] sm:text-xs md:text-[15px] lg:text-lg xl:text-xl 2xl:text-2xl font-bold">
                          Hints System
                        </h2>
                      </div>
                    </div>

                    <div className="relative w-full aspect-270/109">
                      <Link href="/about" className="absolute inset-0 block bg-[url('/landingPage/Overlay-7.png')] bg-no-repeat bg-top bg-cover border-[0.5px] border-white rounded-lg lg:rounded-xl 2xl:rounded-2xl bg-[#534741] shadow-[0px_3px_4px_rgba(255,252,250,0)] transition-shadow duration-600  hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box" />
                      <div className="absolute top-1/2 -translate-y-1/2 left-[10%] w-full flex items-center pointer-events-none">
                        <h2 className="text-white text-[8px] sm:text-xs md:text-[15px] lg:text-lg xl:text-xl 2xl:text-2xl font-bold 2xl:font-semibold lg:leading-6 xl:leading-7 2xl:leading-8">
                          Bragging <br /> Rights
                        </h2>
                      </div>
                    </div>
                    {/* Payment Methods */}
                    <div className="relative w-full h-full aspect-270/109">
                      <Link href="/about" className="absolute inset-0 block bg-[url('/landingPage/Overlay-8.png')] bg-no-repeat bg-top bg-cover rounded-lg lg:rounded-xl 2xl:rounded-2xl border-[0.5px] border-white shadow-[0px_3px_4px_rgba(255,252,250,0.25)] transition-shadow duration-300 hover:shadow-[0px_3px_4px_rgba(255,252,250,0.4)] box" />
                      <div className="absolute top-1/2 -translate-y-1/2 left-[10%] flex items-center pointer-events-none">
                        <h2 className="text-white text-[8px] sm:text-xs md:text-[15px] lg:text-lg xl:text-xl 2xl:text-2xl font-bold 2xl:font-semibold lg:leading-6 xl:leading-7 2xl:leading-8">
                          Payment <br /> Methods
                        </h2>
                      </div>
                    </div>

                    {/* Challenge Yourself */}
                    <div className="relative w-full h-full aspect-270/109">
                      <Link href="/gamehub" className="absolute inset-0 block bg-[url('/landingPage/Overlay-9.png')] bg-no-repeat bg-top bg-cover rounded-lg lg:rounded-xl 2xl:rounded-2xl border-[0.5px] border-white shadow-[0px_3px_4px_rgba(255,252,250,0.25)] transition-shadow duration-300 hover:shadow-[0px_3px_4px_rgba(255,252,250,0.4)] box" />
                      <div className="absolute top-1/2 -translate-y-1/2 left-[10%] flex items-center pointer-events-none">
                        <h2 className="text-white text-[8px] sm:text-xs md:text-[15px] lg:text-lg xl:text-xl 2xl:text-2xl font-bold 2xl:font-semibold lg:leading-6 xl:leading-7 2xl:leading-8">
                          Challenge <br /> Yourself
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-white/80 text-[7px] sm:text-[9px] md:text-xs lg:text-sm xl:text-lg 2xl:text-xl font-normal">
                  On REV: Season I, after level 40, there are no hints available. This is not a pay to win game!
                </p>
              </div>
            </div>
            <div className="flex aspect-1280/350 w-full ">
              <div className="relative flex flex-col justify-center items-center w-full gap-3 sm:gap-4 md:gap-5 lg:gap-7 xl:gap-9 2xl:gap-11 pb-[22%]">
                <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 xl:gap-6 2xl:gap-7">
                  <h2 className="text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold">Are you ready ?</h2>
                </div>
                <PrimaryButton onClick={() => router.push('/gamehub')} customClass={` relative flex justify-center items-center aspect-194/40 h-11 bg-[#5E350E] border border-[#D4B588] rounded-[10px] bg-[url('/register/Button.png')] bg-cover bg-center text-white font-bold font-circular text-base leading-[20px] transition-shadow duration-300 ease-in-out hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box  transform-gpu will-change-transform overflow-visible `} >
                  <span className="pointer-events-none"> Let's Go </span>
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block sm:hidden relative w-full ">
        <div className="relative w-full">
          <img src="/landingPage/landingPageMobile.png" className="w-full h-full object-cover" />

          <div className="absolute top-0 left-0 w-full z-50 flex flex-col">
            <Header />

            <div className=" flex flex-col items-center  aspect-375/680">
              <div className="w-full h-[calc(130/812*100vh)]"></div>
              <div className=" h-[calc(100/812*100vh)]  w-[calc(321/375*100vw)]">
                <p className="text-white font-extrabold text-[clamp(20px,calc(47/375*100vw),28px)]">Smart enough to <br /> solve the unsolvable ? </p>
              </div>
              <div className=" h-[calc(100/812*100vh)]  w-[calc(321/375*100vw)] " >
                <button className="text-white flex items-center justify-center border-2 border-[#B07B5A] gap-[calc(4/375*100vw)] rounded-full h-[calc(40/812*100vh)] w-[calc(110/375*100vw)]" onClick={handlePlayClick}>
                  <span>Ready</span>
                  <img src="/landingPage/rightArrow.svg" className="w-[calc(24/375*100vw)] transform transition-transform duration-300 group-hover:translate-x-2" />
                </button>
              </div>
            </div>
            <div className=" flex flex-col items-center  aspect-375/440">
              <div className=" h-[calc(135/812*100vh)] flex justify-center items-center w-[calc(321/375*100vw)]">
                <img src="/landingPage/key.png" className="w-20 sm:w-40 lg:w-60 xl:w-80 transition-all duration-300 hover:scale-110" />
              </div>
              <div className=" h-[calc(240/812*100vh)] flex flex-col items-center w-[calc(321/375*100vw)]">
                <img src={'/landingPage/revText.png'} className="w-full" />
                <p className="text-white text-sm text-center mb-[calc(5/812*100vh)]">It starts simple, but only your mind can open the path. A world of puzzles awaits, but only the worthy will see it all.</p>
                <p className="text-white text-sm text-center"> The riddles span countless realms ... dare to discover them all?</p>
              </div>
            </div>
            <div className=" flex flex-col justify-evenly items-center aspect-375/660 ">
              <h1 className="text-white font-extrabold text-[clamp(14px,calc(30/375*100vw),20px)]">GAMEPLAY</h1>
              <p className="text-center text-white text-xs">From casual to competitive gameplay, we got you!</p>
              <div className="relative h-[calc(568/812*100vh)] rounded-md mt-2 border-2 border-[#B89058] flex justify-center items-center  w-[calc(321/375*100vw)]">
                <img src={'/landingPage/centerContainer1.png'} alt="Background Container" className="w-full h-full" />
                <div className="absolute w-full h-[calc(568/812*100vh)] flex flex-col justify-between ">
                  <div className=" flex flex-col justify-center items-center w-full h-[calc(280/812*100vh)] ">
                    <div className="relative flex flex-col justify-between items-center w-full h-[calc(221/812*100vh)] ">
                      <div className="relative flex flex-col justify-center items-center w-full h-auto">
                        <div className="absolute top-1/2 left-1/2 -translate-1/2 flex justify-center w-full h-full">
                          <div className="relative flex justify-center w-full  h-[calc(123/812*100vh)]">
                            <div className="absolute -bottom-[13%] left-[53%] -translate-x-1/2 w-[40%] h-[110%] rounded-full opacity-40 bg-[radial-gradient(50%_50%_at_50%_50%,_#FFD278_8.43%,_rgba(255,_210,_120,_0)_100%)]" />
                            <img src="/landingPage/pulseAura.svg" className="-scale-x-100 h-full animate-spin [animation-duration:100s] [animation-timing-function:linear] [animation-iteration-count:infinite" />
                            <img src="/landingPage/pulse.svg" className="absolute top-1/2 left-1/2 -translate-1/2 w-full h-[65%]" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex flex-col items-center">
                          <h2 className="text-white text-[clamp(12px,calc(30/375*100vw),20px)] font-bold">REV Season </h2>
                          <span className="text-white/56  text-[12px] font-normal">Casual Gameplay</span>
                        </div>
                        <p className="text-[#E8EFFD] text-center text-[11px] font-normal">
                          We have a set of 50 levels, for you to have fun <br /> while solving interesting riddles.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className=" flex justify-center items-center w-full h-[calc(32/812*100vh)] ">
                    <img src={'/landingPage/leftLine.png'} className="w-full  " />
                    <img src={'/landingPage/Group.svg'} className=" h-full " />
                    <img src={'/landingPage/rightLine.png'} className="w-full  " />

                  </div>
                  <div className="relative z-10 flex flex-col items-center w-full h-[calc(280/812*100vh)] ">
                    <div className="relative flex justify-center items-center w-full h-[calc(221/812*100vh)]">
                      <img src="/landingPage/tournamentGamePlay.png" className=" w-full h-[calc(216.39/812*100vh)]" />
                      <div className="absolute top-1/2 left-1/2 -translate-1/2 flex justify-center w-full h-[calc(123/812*100vh)]">
                        <img src="/landingPage/pulseAura.svg" className="h-full animate-spin [animation-duration:100s] [animation-timing-function:linear] [animation-iteration-count:infinite" />
                      </div>
                    </div>
                    <div className="flex flex-col items-center -mt-[calc(35/812*100vh)] ">
                      <div className="flex flex-col items-center">
                        <h2 className="text-white text-[clamp(12px,calc(30/375*100vw),20px)] font-bold">Tournaments </h2>
                        <span className="text-white/56  text-center text-[12px] font-normal">Competitive</span>
                      </div>
                      <p className="text-[#E8EFFD] text-center text-[10px] font-normal">
                        For the competitive minds, we are creating on a <br /> monthly basis, tournments with prizes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className=" flex flex-col justify-between items-center gap-[calc(4/812*100vh)] aspect-375/370">
              <div className="w-[calc(375/375*100vw)] h-[calc(30/812*100vh)]"></div>
              <div className="flex flex-col gap-[calc(7/812*100vh)]">
                <h1 className="text-white text-center text-[clamp(14px,calc(20/375*100vw),24px)] font-extrabold">UNIQUE RIDDLES</h1>
                <p className="text-center text-white text-sm">We are committed in designing challenging <br /> levels for you.</p>
              </div>
              <div className="border border-[#D4B588] rounded-md w-[calc(321/375*100vw)] h-[calc(209/812*100vh)]">
                <img src={'/landingPage/uniqueMobile.png'} className="w-full rounded-md h-full " />
              </div>
            </div>
            <div className=" flex flex-col justify-between items-center gap-[calc(4/812*100vh)] aspect-375/545">
              <div className="w-[calc(375/375*100vw)] h-[calc(75/812*100vh)]"></div>
              <div className="flex flex-col justify-between h-[calc(462/812*100vh)] ">
                <div className="flex flex-col h-[calc(52/812*100vh)] gap-[calc(3/812*100vh)]">
                  <h1 className="text-white text-center text-[clamp(14px,calc(20/375*100vw),24px)] font-extrabold">ALL IN ONE PLACE</h1>
                  <p className="text-center text-white text-sm">Your journey starts here.</p>
                </div>
                <div className="flex flex-col items-center justify-between rounded-md w-[calc(321/375*100vw)] h-[calc(335/812*100vh)]">
                  <div className="flex justify-between rounded-md w-[calc(310/375*100vw)] h-[calc(108/812*100vh)]">
                    <div className="relative border border-[#D4B588] flex items-end rounded-md w-[calc(152/375*100vw)] h-[calc(108/812*100vh)]">
                      <img src={'/landingPage/journey1.png'} alt="Journey 1" className="absolute rounded-md w-full h-full" />
                      <div className="z-10 flex flex-col justify-center items-center rounded-md w-[calc(152/375*100vw)] h-[calc(38/812*100vh)]">
                        <p className="text-white text-md font-bold">REV SEASONS</p>
                        <p className="text-white/50 text-xs">CASUAL GAMEPLAY</p>
                      </div>
                    </div>
                    <div className="relative border border-[#D4B588] flex items-end rounded-md w-[calc(152/375*100vw)] h-[calc(108/812*100vh)]">
                      <img src={'/landingPage/journey2.png'} alt="Journey 1" className="absolute rounded-md w-full h-full" />
                      <div className="z-10 flex flex-col justify-start items-start pl-[calc(10/375*100vw)] rounded-md w-[calc(152/375*100vw)] h-[calc(38/812*100vh)]">
                        <p className="text-white text-md font-bold">DAILY RIDDLES</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between rounded-md w-[calc(310/375*100vw)] h-[calc(108/812*100vh)]">
                    <div className="relative border border-[#D4B588] flex items-end rounded-md w-[calc(152/375*100vw)] h-[calc(108/812*100vh)]">
                      <img src={'/landingPage/journey3.png'} alt="Journey 1" className="absolute rounded-md w-full h-full" />
                      <div className="z-10 flex flex-col justify-center items-center rounded-md w-[calc(152/375*100vw)] h-[calc(38/812*100vh)]">
                        <p className="text-white text-md font-bold">LEADERBOARDS</p>
                        <p className="text-white/50 text-xs">Play to earn rewards</p>
                      </div>
                    </div>
                    <div className="relative border border-[#D4B588] flex items-end rounded-md w-[calc(152/375*100vw)] h-[calc(108/812*100vh)]">
                      <img src={'/landingPage/journey4.png'} alt="Journey 1" className="absolute rounded-md w-full h-full" />
                      <div className="z-10 flex flex-col justify-center items-center rounded-md w-[calc(152/375*100vw)] h-[calc(38/812*100vh)]">
                        <p className="text-white text-md font-bold">MONTHLY</p>
                        <p className="text-white text-md font-bold">TOURNAMENTS</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between rounded-md w-[calc(310/375*100vw)] h-[calc(108/812*100vh)]">
                    <div className="relative border border-[#D4B588] flex items-end rounded-md w-[calc(152/375*100vw)] h-[calc(108/812*100vh)]">
                      <img src={'/landingPage/journey5.png'} alt="Journey 1" className="absolute rounded-md w-full h-full" />
                      <div className="z-10 flex flex-col justify-center items-center rounded-md w-[calc(152/375*100vw)] h-[calc(38/812*100vh)]">
                        <p className="text-white text-md font-bold">LIVES SYSTEM</p>
                      </div>
                    </div>
                    <div className="relative border border-[#D4B588] flex items-end rounded-md w-[calc(152/375*100vw)] h-[calc(108/812*100vh)]">
                      <img src={'/landingPage/journey6.png'} alt="Journey 1" className="absolute rounded-md w-full h-full" />
                      <div className="z-10 flex flex-col justify-center items-center rounded-md w-[calc(152/375*100vw)] h-[calc(38/812*100vh)]">
                        <p className="text-white text-md font-bold">HINTS SYSTEM</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[calc(321/375*100vw)] h-[calc(38/812*100vh)]">
                  <p className="text-center text-white text-sm">On REV Seasons, after level 40, there are no hints <br /> available. This is not a pay to win game!</p>

                </div>
              </div>
            </div>
            <div className=" flex items-end justify-center gap-[calc(4/812*100vh)] aspect-375/200">
              <div className=" flex flex-col items-center justify-between gap-[calc(4/812*100vh)] w-[calc(321/375*100vw)] h-[calc(80/812*100vh)]">
                <h1 className="text-white text-2xl font-extrabold">ARE YOU READY ?</h1>
                <PrimaryButton
                  onClick={() => router.push('/gamehub')}
                  customClass={`w-[calc(164.88/375*100vw)] h-[calc(38/812*100vh)] flex flex-col justify-center items-center bg-[#5E350E] border border-[#D4B588] text-white font-bold rounded-[10px] bg-[url('/register/Button.png')] bg-cover bg-center font-circular h-11 text-base leading-[20px]`} >
                  Let's Go
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
        {hideSidebar !== undefined && (
          <div className={`fixed bottom-0 left-0 w-full z-50 transition-all duration-1000 ease-in-out ${hideSidebar ? "opacity-0 translate-y-full pointer-events-none" : "opacity-100 translate-y-0 pointer-events-auto"}`}>
            <Sidebar />
          </div>
        )}
      </div>

    </>
  );
}

export default MainPage;
