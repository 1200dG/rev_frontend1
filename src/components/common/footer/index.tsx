import React from "react";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/routes";

const socialLinks = [
  {
    href: "#",
    src: "/footer/facebook.svg",
    alt: "Facebook",
  },
  {
    href: "#",
    src: "/footer/instagram.svg",
    alt: "Instagram",
  },
  {
    href: "#",
    src: "/footer/twitter.svg",
    alt: "Twitter",
  },
];

const Footer: React.FC = () => {
  return (
    <>
      <div className="hidden sm:block">
        <footer className="w-full aspect-1280/323 bg-[url('/footer/bg.png')] bg-no-repeat bg-cover border-t border-white font-NotoSansJP text-white px-[8%] pt-[5%] pb-[3%]">
          <div className="flex flex-col justify-between items-center w-full h-full gap-4">
            <div className="flex flex-col md:flex-row justify-between gap-4 md:w-full">
              <div className="flex flex-col gap-0.5">
                <img src="/footer/logo.svg" className="2xl:w-36" />
                <p className="text-xs 2xl:text-base font-medium">Challenge yourself</p>
              </div>
              <div className="text-center md:text-left flex flex-col gap-[1.19rem]">
                <h3 className="text-base md:text-lg 2xl:text-xl font-medium">Quick Links</h3>
                <nav className="flex flex-col gap-2 2xl:gap-4 text-sm 2xl:text-lg text-white opacity-80">
                  <Link href={routes.ui.enigma.seasonDetail("1")} className="hover:opacity-80 hover:animate-pulse transition-opacity">Play</Link>
                  <Link href={routes.ui.clash.tournaments} className="hover:opacity-80 hover:animate-pulse transition-opacity">Clash</Link>
                  <Link href={routes.ui.about} className="hover:opacity-80 hover:animate-pulse transition-opacity">About</Link>
                  <Link href={routes.ui.faq} className="hover:opacity-80 hover:animate-pulse transition-opacity">FAQ</Link>
                </nav>
              </div>

              <div className="text-center md:text-left flex flex-col gap-[1.6rem]">
                <h3 className="text-base md:text-lg 2xl:text-xl font-medium hover:opacity-80 hover:animate-pulse transition-opacity">Contact Us</h3>
                <div className="flex items-center gap-2.5">
                  <h4 className="text-sm 2xl:text-base text-white/70 font-medium hover:opacity-80 hover:animate-pulse transition-opacity">Email</h4>
                  <p className="text-sm 2xl:text-base font-medium hover:opacity-80 hover:animate-pulse transition-opacity">info@rev.com</p>
                </div>
              </div>

              <div className="text-center md:text-left flex flex-col gap-8">
                <h3 className="text-base md:text-lg 2xl:text-xl font-medium">Social</h3>
                <div className="flex justify-start items-center gap-4 md:gap-8 -ms-1.5">
                  {socialLinks.map((link, index) => (
                    <Link href={link.href} passHref key={index} className="hover:opacity-80 hover:animate-pulse transition-opacity">
                      <Image
                        src={link.src}
                        alt={link.alt}
                        width={24}
                        height={28}
                        className="w-6 h-7 md:w-8 md:h-8.5"
                      />
                    </Link>
                  ))}
                </div>
              </div>
              <div />
            </div>

            <div className="flex flex-col items-center gap-[1.41rem] w-full">
              <hr className="w-full h-[0.12063rem] border border-[#FFFAFA] opacity-20 bg-[#0A142F] p-[0.025rem]" />
              <p className="text-sm opacity-65 z-10 text-center">© {new Date().getFullYear()} REV | All Rights Reserved</p>
            </div>
          </div>
        </footer>
      </div>
      <div className="block sm:hidden">
        <footer className="w-full flex items-center justify-center aspect-375/204 bg-[url('/footer/bg.png')] bg-no-repeat bg-cover border-t border-white font-NotoSansJP text-white">
          <div className="flex flex-col justify-between items-center w-[calc(255/375*100vw)] h-[calc(165/812*100vh)]">
            <div className="flex justify-between items-center w-[calc(255/375*100vw)] h-[calc(112/812*100vh)]">
              <div className="flex flex-col justify-between items-center w-[calc(126/375*100vw)] h-[calc(112/812*100vh)]">
                <div className="flex flex-col justify-between w-[calc(126/375*100vw)] h-[calc(43/812*100vh)]">
                  <h3 className="text-base md:text-lg 2xl:text-xl font-medium">Social</h3>
                  <div className="flex justify-start items-center gap-4 md:gap-8 -ms-1.5">
                    {socialLinks.map((link, index) => (
                      <Link href={link.href} passHref key={index} className="hover:opacity-80 hover:animate-pulse transition-opacity">
                        <img
                          src={link.src}
                          alt={link.alt}
                          className="w-6 h-6"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-between w-[calc(126/375*100vw)] h-[calc(43/812*100vh)]">
                  <h3 className="text-base md:text-lg 2xl:text-xl font-medium">Contact Us</h3>
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-sm 2xl:text-base text-white/70 font-medium hover:opacity-80 hover:animate-pulse transition-opacity">Email</h4>
                    <p className="text-sm 2xl:text-base font-medium hover:opacity-80 hover:animate-pulse transition-opacity">info@rev.com</p>
                  </div>
                </div>

              </div>
              <div className=" h-full flex flex-col items-end justify-between w-[calc(126/375*100vw)]">
                <div className=" h-full flex flex-col items-end justify-between w-[calc(82/375*100vw)]">
                  <h3 className="text-[clamp(8px, 3.0vw, 12px)] no-wrap whitespace-nowrap">Quick Links</h3>
                  <nav className="flex flex-col w-full gap-1.5 text-xs text-white opacity-80 pl-1">
                    <Link href={routes.ui.enigma.seasonDetail("1")} className="hover:opacity-80 hover:animate-pulse transition-opacity">Play</Link>
                    <Link href={routes.ui.clash.tournaments} className="hover:opacity-80 hover:animate-pulse transition-opacity">Clash</Link>
                    <Link href={routes.ui.about} className="hover:opacity-80 hover:animate-pulse transition-opacity">About</Link>
                    <Link href={routes.ui.faq} className="hover:opacity-80 hover:animate-pulse transition-opacity">FAQ</Link>
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between items-center w-[calc(255/375*100vw)] h-[calc(25/812*100vh)]">
                <hr className="w-full h-[0.12063rem] border border-[#FFFAFA] opacity-20 bg-[#FFFAFA]" />
                <p className="text-xs opacity-65 z-10 text-center">© {new Date().getFullYear()} REV | All Rights Reserved</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
