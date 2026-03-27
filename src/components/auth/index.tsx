"use client";

import React, { ReactNode, use, useState } from "react";
import Header from "@/components/common/header";
import Loader from "@/components/common/loader";
import { useImagePreloader } from "@/lib/hooks/useImagePreloader";
import { useAppContext } from "@/lib/hooks/useAppContext";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const pathName = usePathname();
  const isSignUp = pathName.endsWith("sign-up");
  useImagePreloader(
    ["/register/Registration.png"],
    () => setImagesLoaded(true)
  );

  if (!imagesLoaded) return <Loader />;

  return (
    <>
      <div className="hidden sm:block">
        <div className=" bg-[#1E120B] w-full h-full" >
          <img
            src="/register/Registration.png"
            className="fixed w-full h-full object-cover pointer-events-none"
            alt="Background Layer"
          />

          <div className="relative flex flex-col justify-between w-[calc(1440/1440*100vw)] h-[calc(900/900*100vh)]">
            <div className="w-[calc(1440/1440*100vw)] h-[calc(70/900*100vh)]">
              <Header />
            </div>
            <main className={`flex flex-col items-center w-[calc(1440/1440*100vw)] h-[calc(830/900*100vh)]`}>
              {children}
            </main>
          </div>
        </div>
      </div>
      <div className="block sm:hidden">
        <div className={`block sm:hidden min-h-screen  ${isSignUp ? "bg-[url('/auth/RegistrationMobile.png')] " : "bg-[url('/auth/LoginMobile.png')] " } bg-no-repeat bg-cover w-[calc(375/375*100vw)] h-[calc(812/812*100vh)]`}>
          <div className="w-[calc(375/375*100vw)] h-[calc(70/812*100vh)]">
            <Header />
          </div>
          <>
            {children}
          </>
        </div>
      </div>
    </>
  );
};

export default Layout;
