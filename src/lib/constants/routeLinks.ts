import { routes } from "../routes";

export const links = [
  { href: routes.ui.gamehub, src: "/sidebar/enigma.svg", text: "Play" },
  {
    href: routes.ui.clash.tournaments,
    src: "/sidebar/clash.svg",
    text: "Clash",
  },
  {
    href: routes.ui.about,
    src: "/sidebar/about.svg",
    text: "About",
    hasBorder: true,
  },
  { href: routes.ui.faq, src: "/sidebar/faq.svg", text: "FAQ" },
  {
    href: routes.ui.profile,
    src: "/sidebar/profile.svg",
    text: "Profile",
    authRequired: true,
  },
];
