"use client";
import Link from "next/link";

interface SocialLinksProps {
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  facebook?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  instagram,
  twitter,
  tiktok,
  facebook,
}) => {
  const socialLinks = [instagram, twitter, tiktok, facebook].filter(Boolean);

  const widthClassMap: Record<number, string> = {
    1: "w-[10%]",
    2: "w-[20%]",
    3: "w-[30%]",
    4: "w-[40%]",
  };

  const parentWidthClass = widthClassMap[socialLinks.length] || "w-[10%]";

  return (
    <div className={`flex justify-evenly items-center gap-1 md:gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 pe-0 sm:pe-[2%] h-full sm:h-[26%] ${parentWidthClass}`} >
      {instagram && (
        <Link
          href={instagram}
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
          className=" w-full h-full transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_5px_#facc15]"
        >
          <img src="/profile/instagram.svg" alt="Instagram Icon" className=" w-full h-full"/>
        </Link>
      )}

      {twitter && (
        <Link
          href={twitter}
          aria-label="X"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-full transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_5px_#facc15]"
        >
          <img src="/profile/twitter.svg" alt="Twitter Icon" className="w-full h-full" />
        </Link>
      )}
      {tiktok && (
        <Link
          href={tiktok}
          aria-label="TikTok"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-full transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_5px_#facc15]"
        >
          <img src="/profile/tiktok.svg" alt="Tiktok Icon" className="w-full h-full " />
        </Link>
      )}
      {facebook && (
        <Link
          href={facebook}
          aria-label="Facebook"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-full transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_5px_#facc15]"
        >
          <img src="/profile/facebook.svg" alt="Facebook Icon" className="w-1/2 h-full"/>
        </Link>
      )}
    </div>
  );
};

export default SocialLinks;
