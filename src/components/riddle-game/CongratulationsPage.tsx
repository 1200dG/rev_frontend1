import Image from "next/image";
import Header from "../common/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getVideoPath } from "@/lib/utils/video";
import { externalVideos, localVideos } from "@/lib/constants/videos";

const CongratulationsPage: React.FC = () => {
  const [videoEnded, setVideoEnded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoKey, setVideoKey] = useState(0);
  const router = useRouter();

  const videoSrc = getVideoPath( localVideos.congratulationDesktop, externalVideos.congratulationDesktop);
  const videoMobileSrc = getVideoPath( localVideos.congratulationsMobile, externalVideos.congratulationsMobile);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const selectedVideoSrc = isMobile ? videoMobileSrc : videoSrc;

  return (
    <div className="fixed inset-0 z-[1000] w-full h-full bg-[#1E120B]">
      {!videoEnded && (
        <>
          <video
            key={videoKey}
            autoPlay
            muted
            playsInline
            className="fixed inset-0 w-full h-full object-cover z-[1001]"
            onEnded={() => setVideoEnded(true)}
          >
            <source src={selectedVideoSrc} type="video/mp4" />
          </video>

          <button
            onClick={() => setVideoEnded(true)}
            className="fixed top-4 right-4 z-[1002] w-[80px] cursor-pointer bg-black/60 text-white flex justify-center items-center rounded-lg text-lg font-medium backdrop-blur-md hover:bg-black/80 transition"
          >
            Skip
          </button>
        </>
      )}

      {videoEnded && (
        <div className={`fixed inset-0 w-[calc(375/375*100vw)] h-[calc(812/812*100vh)] sm:w-full sm:h-full z-[1001] `} >
          <img src="/riddles/Congratulations.png" className="fixed w-full h-full object-cover pointer-events-none" alt="Background Layer" />

          <div className="relative flex flex-col z-50 justify-between w-[calc(375/375*100vw)] h-[calc(812/812*100vh)] sm:w-full sm:h-full">
            <div className="w-full h-[calc(70/812*100vh)] sm:h-[calc(70/900*100vh)]">
              <Header />
            </div>

            <div className="flex flex-col justify-between items-center w-[calc(375/375*100vw)] h-[calc(742/812*100vh)] sm:w-full sm:h-[calc(830/900*100vh)]">
              <div className="flex flex-col items-center justify-center gap-6 cursor-pointer w-[calc(375/375*100vw)] h-[calc(470/812*100vh)] sm:w-full sm:h-[calc(470/900*100vh)]" onClick={() => router.push("/gamehub")}>
                <h1 className="text-4xl font-bold text-[#492626]">Congratulations!</h1>
                <p className="text-lg text-[#492626] text-center max-w-2xl px-4"> You solved the unsolvable </p>
                <img src="/riddles/arrowDown.svg" alt="Repeat Overview" width={23.5} height={21} />
              </div>

              <div className="flex items-center justify-between w-[calc(321/375*100vw)] h-[calc(250/812*100vh)] sm:w-[calc(1170/1440*100vw)] sm:h-[calc(100/900*100vh)]">
                <div className="text-white text-2xl font-bold rounded-[10px] sm:w-[calc(70/1440*100vw)] sm:h-[calc(64/900*100vh)] w-[calc(60/375*100vw)] h-[calc(70/812*100vh)] flex items-center justify-between cursor-pointer" onClick={() => router.push("/gamehub")} >
                  <Image src="/riddles/backbutton.svg" alt="Back Icon" height={20} width={20} />
                  <p className="text-white text-lg sm:text-2xl">Back</p>
                </div>

                <div className="cursor-pointer flex items-center justify-between w-[calc(180/375*100vw)] h-[calc(70/812*100vh)] sm:w-[calc(200/1440*100vw)] sm:h-[calc(64/900*100vh)]"
                  onClick={() => {
                    setVideoKey((prev) => prev + 1); 
                    setVideoEnded(false);
                  }}
                >
                  <img src="/riddles/replay-video.svg" alt="Repeat Overview" width={22} height={22} />
                  <p className="text-white text-lg sm:text-2xl">REPEAT OVERVIEW</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CongratulationsPage;
