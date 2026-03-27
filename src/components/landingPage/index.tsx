"use client";
import { Suspense, useRef, useState } from "react";
import MainPage from "./mainPage";
import Footer from "../common/footer";
import Loader from "../common/loader";

const LandingPage: React.FC = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const footerSentinelRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div className="hidden sm:block">
        <div className={`relative w-full overflow-hidden bg-black ${!imagesLoaded ? "h-screen" : ""}`}>
          {!imagesLoaded && <Loader />}
          <div className={`transition-opacity duration-1000 ${imagesLoaded ? "opacity-100" : "opacity-0"}`}>
            <Suspense>
              <MainPage onAllImagesLoad={() => setImagesLoaded(true)} />
            </Suspense>
          </div>
          {imagesLoaded && (
            <div className="transition-opacity duration-1000 opacity-100">
              <Footer />
            </div>
          )}
        </div>
      </div>
      <div className="block sm:hidden">
        <div className={`relative w-[calc(375/375*100vw)] overflow-hidden bg-black ${!imagesLoaded ? "h-screen" : ""}`}>
          {!imagesLoaded && <Loader />}
          <div className={`transition-opacity duration-1000 ${imagesLoaded ? "opacity-100" : "opacity-0"}`}>
            <Suspense>
              <MainPage
                onAllImagesLoad={() => setImagesLoaded(true)}
                footerSentinelRef={footerSentinelRef} />
            </Suspense>
          </div>
          {imagesLoaded && (
            <>
              <div ref={footerSentinelRef} className="h-px w-full" />
              <Footer />
            </>
          )}

        </div>

      </div>
    </>
  );
};

export default LandingPage;
