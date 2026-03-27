"use client"
import { HeaderProps } from "@/lib/types/common/types";
import { RIDDLE_DEFAULTS } from "@/lib/constants/riddle";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";
import ProfileDropdown from "@/components/common/ProfileDropdown";
import { useGuestSession } from "@/lib/hooks/useGuestSession";

export default function Header({
  showGameElements = false,
  lives = 0,
  profileInitials = RIDDLE_DEFAULTS.PROFILE_INITIALS,
  showBorder = false,
}: HeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { hasGuestSession, getGuestInitials } = useGuestSession();


  const handlePlayClick = () => {
    if (session?.user?.account_id) {
      router.push(routes.ui.gamehub);
    } else {
      router.push(routes.ui.auth.signIn)
    }
  }

  const getProfileInitials = () => {
    if (session?.user?.username) {
      return `${session.user.username[0]}`.toUpperCase();
    }
    if (hasGuestSession) {
      return getGuestInitials();
    }
    return profileInitials;
  };

  const calculatedProfileInitials = getProfileInitials();
  const isLoggedIn = !!session?.user?.account_id || hasGuestSession;

  return (
    <>
      <div className="hidden sm:block">
        <header className={`flex justify-between items-center px-[2.5%] py-[1%] border-b ${showBorder ? "border-white/50" : "border-transparent"}`}>
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4 xl:gap-5 2xl:gap-6 w-[20%]">
            <Link href="/" className="w-2/5 xl:w-auto">
              <img
                className="cursor-pointer translate-all duration-500 ease-in-out transform hover:scale-105 hover:drop-shadow-[0_0_2px_#facc15] hover:animate-pulse"
                src="/header/logo.svg"
                alt="Company Logo"
              />
            </Link>
            <Link href="/gamehub" className="block w-3/5 text-white will-change-transform text-[clamp(4px,1vw,16px)] font-medium font-noto-sans-jp transition-transform duration-300 hover:scale-105 cursor-pointer select-none">
              Challenge yourself
            </Link>
          </div>

          {showGameElements ? (
            <div className="flex justify-end items-center gap-2 lg:gap-3 2xl:gap-4 w-[30%]">
              <div className="flex items-center">
                <span className="block w-3/5 text-white text-[clamp(4px,1vw,16px)] font-medium font-noto-sans-jp transition-transform duration-300 hover:scale-105 cursor-default select-none">+{lives}&nbsp;LIVES</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => {
                  const emptyLivesCount = 5 - lives;
                  const isEmptyLife = index < emptyLivesCount;
                  return (
                    <Image
                      width={24}
                      height={24}
                      key={index}
                      src={
                        isEmptyLife ? "/riddles/lives.svg" : "/riddles/lives1.svg"
                      }
                      alt={isEmptyLife ? "Empty life" : "Life"}
                      className="w-6 h-6"
                    />
                  );
                })}
              </div>
              <div>
                <ProfileDropdown profileInitials={calculatedProfileInitials} />
              </div>
            </div>
          ) : (
            <div className="flex justify-end items-center gap-2 lg:gap-3 2xl:gap-4 w-[20%]">
              {pathname === "/" && (
                <div className="relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:animate-pulse" onClick={handlePlayClick}>
                  <img src="/header/play.svg" alt="Play Button" className="w-[clamp(3rem,7vw,6.5rem)] h-auto" />
                  <span className="absolute top-1/2 left-3/5 md:left-[65%] -translate-x-1/2 -translate-y-1/2 text-[#1B1B2E] text-[8px] sm:text-[10px] md:text-xs lg:text-sm font-bold">
                    Play
                  </span>
                </div>
              )}
              {isLoggedIn && (
                <div>
                  <ProfileDropdown profileInitials={calculatedProfileInitials} />
                </div>
              )}
            </div>
          )}
        </header>
      </div>
      <div className="block sm:hidden">
        <header className={`sticky top-0 left-0 flex flex-col justify-center items-center w-[calc(375/375*100vw)] h-[calc(70/812*100vh)] ${showBorder ? "border-white/50" : "border-transparent"}`}>
          <div className={`flex justify-between items-center w-[calc(321/375*100vw)] h-[calc(70/812*100vh)] ${showBorder ? "border-white/50" : "border-transparent"}`}>
            <div className="flex flex-col ">
              <Link href="/" className="flex items-center">
                <img src="/landingPage/mobileLogo.svg" alt="Company Logo" className="cursor-pointer transform transition-transform duration-500 hover:scale-105 hover:drop-shadow-[0_0_2px_#facc15] hover:animate-pulse" />
              </Link>
              {(pathname === "/" || pathname.includes("play")) && (
                <Link
                  href="/gamehub"
                  className="text-white text-[clamp(10px,2.5vw,14px)] font-medium font-noto-sans-jp transition-transform duration-300 hover:scale-105 select-none"
                >
                  Challenge yourself
                </Link>
              )}
            </div>

            {showGameElements ? (
              <div className="flex flex-col items-end gap-1 justify-end w-[50%]">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, index) => {
                    const emptyLivesCount = 5 - lives;
                    const isEmptyLife = index < emptyLivesCount;
                    return (
                      <Image
                        key={index}
                        src={isEmptyLife ? "/riddles/lives.svg" : "/riddles/lives1.svg"}
                        alt={isEmptyLife ? "Empty life" : "Life"}
                        width={24}
                        height={24}
                        className="w-5 h-5"
                      />
                    );
                  })}
                </div>
                <span className="text-white text-[clamp(12px,2.8vw,16px)] text-end font-semibold select-none">
                  +{lives} LIVES
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-2">
                {pathname === "/" && (
                  <div
                    className="relative cursor-pointer h-[calc(32/812*100vh)] flex items-center justify-center w-[calc(89/375*100vw)] transition-transform duration-300 hover:scale-105 hover:animate-pulse"
                    onClick={handlePlayClick}
                  >
                    <img
                      src="/header/Subtract.svg"
                      alt="Play Button"
                    />
                    <span className="absolute top-1/2 left-[65%] -translate-x-1/2 -translate-y-1/2 text-[#723303] sm:text-[#1B1B2E] text-[14px] sm:text-[10px] md:text-xs lg:text-sm font-bold">
                      Play
                    </span>
                  </div>
                )}
                {isLoggedIn && (
                  <ProfileDropdown profileInitials={calculatedProfileInitials} />
                )}
              </div>
            )}
          </div>
          {pathname.includes("play") && (
            <img src={'/header/headerEndLine.svg'} alt="End Line" className="w-full bottom-0 left-0 "/>
          )}
        </header>
      </div>
    </>
  );
}
