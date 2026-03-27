"use client";
import { links } from "@/lib/constants/routeLinks";
import { useSession } from "next-auth/react";
import { useContext } from "react";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { AppContext } from "@/components/context/AppContext";

export default function Sidebar() {
  const { data: session } = useSession();
  const { isCollapsed, setIsCollappsed } = useContext(AppContext)!;

  const toggleSidebar = () => {
    setIsCollappsed(prev => !prev);
  };

  return (
    <>
      <div className="hidden sm:block">
        <div className={`relative flex flex-col border-r border-white/50 text-white transition-all duration-300 h-[calc(442/900*100vh)] ${isCollapsed ? "w-[calc(48/1440*100vw)]" : "w-[calc(128/1440*100vw)]"}`}>
          <button onClick={toggleSidebar} className={`absolute top-[5%] md:top-[6%] 2xl:top-[4.5%] cursor-pointer transition-all duration-300 ease-in-out ${isCollapsed ? "-right-[22.5%] sm:-right-[26%] md:-right-[20%] lg:-right-[24%] 2xl:-right-[20%] hover:scale-110 active:scale-95" : "-right-[5.5%] sm:-right-[8%] md:-right-[9%] lg:-right-[7%] 2xl:-right-[6%] hover:scale-110 hover:opacity-80 active:scale-95"} z-10`}>
            <img className={`transition-all duration-1000 ease-in-out w-2 sm:w-3 lg:w-4 xl:w-5 h-2 sm:h-3 lg:h-4 xl:h-5 ${!isCollapsed ? "rotate-180" : "rotate-0"}`} src="/sidebar/expand.svg" alt="Expand Icon" />
          </button>
          <div className={`flex flex-col justify-between h-[calc(442/900*100vh)] ${isCollapsed ? "py-[10%]" : "py-[3%]"}`}>
            <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 xl:gap-5">
              {links.map((link, index) => {
                if (link.authRequired && !session) return null;
                return (
                  <div key={index} className={`${isCollapsed ? "px-[15%]" : "px-[5%]"}`}>
                    {link.hasBorder ? (
                      <Link href={link.href} className={`flex ${isCollapsed ? "justify-center" : "justify-start "} items-center gap-1 h-[calc(45/900*100vh)] lg:gap-2 border-y border-white/50 translate-all duration-300  transform hover:drop-shadow-[0_0_10px_#facc15] `}>
                        <div className="flex items-center justify-center h-[calc(20/900*100vh)] shrink-0">
                          <img src={link.src} alt="Sidebar icons" width={20} height={20} />
                        </div>
                        {!isCollapsed && <span className="whitespace-nowrap text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm overflow-hidden">{link.text}</span>}
                      </Link>
                    ) : (
                      <Link href={link.href} className={`flex ${isCollapsed ? "justify-center px-[10%]" : "justify-start px-[2.5%]"} items-center gap-1 lg:gap-2 translate-all duration-300 transform hover:drop-shadow-[0_0_10px_#facc15] `}>
                        <div className="flex items-center justify-center h-[calc(25/900*100vh)] shrink-0">
                          <img src={link.src} alt="Sidebar icons" width={20} height={20} />
                        </div>
                        {!isCollapsed && <span className="whitespace-nowrap text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm overflow-hidden">{link.text}</span>}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
            {session && (
              <div className={`${isCollapsed ? "px-[15%]" : "px-[5%]"}`}>
                <Link href={routes.ui.settings} className={`flex ${isCollapsed ? "justify-center px-[10%]" : "justify-start px-[2.5%]"} items-center gap-1 lg:gap-2 translate-all duration-300 ease-in-out transform hover:drop-shadow-[0_0_10px_#facc15]`}>
                  <div className="flex items-center justify-center h-[calc(25/900*100vh)] shrink-0">
                    <img src="/sidebar/setting.svg" alt="Setting Icon" width={20} height={20} />
                  </div>
                  {!isCollapsed && <span className="whitespace-nowrap text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm overflow-hidden">Settings</span>}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {session && (
        <div className="relative block sm:hidden w-full bg-[url('/sidebar/mobileSidebar.png')] bg-no-repeat bg-cover border-2 border-t-[#FFEFD8] aspect-[375/70.56]">
          <img src={"/sidebar/mobileSidebar.png"} alt="Mobile Sidebar Background" width={375} height={70.56} />
          <div className="absolute left-0 top-0 h-full flex items-center gap-6 w-[36%] justify-evenly">
            <Link href="/" className="flex flex-col justify-between items-center w-1/2 h-[70%]">
              <img src="/sidebar/globe.svg" width={22.88} height={22.88} />
              <span className="text-white text-xs">Home</span>
            </Link>

            <Link href="/clash/tournaments" className="flex flex-col justify-between items-center w-1/2 h-[70%]">
              <img src="/sidebar/trophy.svg" width={22} height={22} />
              <span className="text-white text-xs">Clash</span>
            </Link>
          </div>

          <Link href="/gamehub" className="absolute left-1/2 -top-4 -translate-x-1/2 flex flex-col items-center ">
            <div className=" w-15 h-15 rounded-full bg-[#330000] border-4 border-[#fbebd4] shadow-lg flex items-center justify-center">
              <img src="/sidebar/gamehubMobileicon.svg" width={20.25} height={20.25} />
            </div>
            <span className="pt-[6%] text-white text-xs font-medium font-noto-sans-jp select-none">
              Play
            </span>
          </Link>


          <div className="absolute right-0 top-0 h-full flex items-center gap-6 w-[36%] justify-evenly">
            <Link href="/profile" className="flex flex-col justify-between items-center w-1/2 h-[70%]">
              <img src="/sidebar/profileMoile.svg" width={24} height={24} />
              <span className="text-white text-xs">Profile</span>
            </Link>

            <Link href="/vault" className="flex flex-col justify-between items-center w-1/2 h-[70%]">
              <img src="/sidebar/vault.svg" width={24} height={18} />
              <span className="text-white text-xs">Vault</span>
            </Link>
          </div>
        </div>
      )}

    </>

  );
} 
