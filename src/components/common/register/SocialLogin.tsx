import PrimaryButton from "../buttons/PrimaryButton";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { routes } from "@/lib/routes";
import { SocialLoginProps } from "@/lib/types/common/types";

const SocialLogin: React.FC<SocialLoginProps> = ({ mode }) => {
  const handleSocialLogin = async (type: string) => {
    if (type === "Google")
      await signIn("google", { callbackUrl: routes.ui.root });
    else if (type === " Apple") await signIn("apple", { callbackUrl: routes.ui.root })
    else await signIn("facebook", { callbackUrl: routes.ui.root });
  };

  const social = [
    {
      src: "/auth/Google.svg",
      label: "Google"
    },
    {
      src: "/auth/Fb.svg",
      label: "Facebook"
    },
    // {
    //   src: "/auth/Apple.svg",
    //   label: "Apple"
    // }
  ]

  return (
    <div className="flex flex-col justify-center items-center ">
      <span className="text-white font-circular text-s font-medium">
        {mode === "login" ? "Or Login with" : "Or register with"}
      </span>
      <div className="flex flex-row justify-center">
        {social.map((btn) => (
          <PrimaryButton
            key={btn.label}
            onClick={() => handleSocialLogin(btn.label)}
            customClass="!px-2"
          >
            <div className="relative w-9 h-9">
              <Image src={btn.src} alt={btn.label} fill className="w-35 object-cover" />
            </div>
          </PrimaryButton>
        ))}
      </div>
    </div>
  );
};

export default SocialLogin;
