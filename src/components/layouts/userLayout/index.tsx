"use client";
import Header from "@/components/common/header";
import Sidebar from "@/components/common/sidebar";
import { usePathname } from "next/navigation";
import { imageRoutes } from "@/lib/constants/bgimages";
import { UserLayoutProps } from "@/lib/types/common/types";
import { useState } from "react";
import { useImagePreloader } from "@/lib/hooks/useImagePreloader";
import Loader from "@/components/common/loader";
import { useAppContext } from "@/lib/hooks/useAppContext";

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const matchedRoute = imageRoutes.find(
    (route) =>
      route.href === pathname ||
      (pathname && pathname.includes(route.href) && route.dynamic),
  );
  const backgroundImage = matchedRoute?.src;
  const { isCollapsed } = useAppContext();

  const isVideo = (file?: string) => file?.endsWith(".mp4");
  const isImage = (file?: string) =>
    file?.endsWith(".svg") || file?.endsWith(".png") || file?.endsWith(".jpg");

  const [imagesLoaded, setImagesLoaded] = useState(false);

  useImagePreloader(
    isImage(backgroundImage) ? [backgroundImage!] : [],
    () => setImagesLoaded(true)
  );

  //const getBackgroundStyle = () => backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined;

  if (isImage(backgroundImage) && !imagesLoaded) return <Loader />;

  return (
    <>
      <div className="hidden sm:block">

        <div className="relativ min-h-screen w-full bg-[#1E120B] bg-no-repeat bg-cover" style={isImage(backgroundImage) ? { backgroundImage: `url(${backgroundImage})` } : undefined}>
          {isVideo(backgroundImage) && (
            <>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="fixed top-0 left-0 w-full h-full opacity-30 object-cover pointer-events-none z-0"
              >
                <source src={backgroundImage} type="video/mp4" />
              </video>

              <img
                src="/videos/backkk.png"
                className="fixed top-0 left-0 w-full h-full object-cover pointer-events-none z-10"
                alt="Background Layer"
              />
            </>
          )}

          <div className="relative z-10 w-full min-h-screen">
            <div className="w-full h-[calc(70/900*100vh)]">
              <Header />
            </div>
            <div className="flex w-full h-[calc(830/900*100vh)] py-[1%]">
              <Sidebar />
              <main className={`${isCollapsed ? " w-[calc(1392/1440*100vw)]" : "w-[calc(1312/1440*100vw)]"}`}>
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
      <div className={`block sm:hidden min-h-screen fixed ${pathname.endsWith('/game-rules') ? "bg-[url('/gamePlay/GAMERULES.png')] h-[calc(1159/1159*100vh)]" : "bg-[url('/gamehub/background.png')] h-[calc(812/812*100vh)]"} bg-no-repeat bg-cover w-[calc(375/375*100vw)]`}>
        <div className="w-[calc(375/375*100vw)] h-[calc(70/812*100vh)]">
          <Header />
        </div>
        <>
          {children}
        </>
        <div className="fixed bottom-0 left-0 w-full z-50">
          <Sidebar />
        </div>
      </div>
    </>

  );
};

export default UserLayout;
