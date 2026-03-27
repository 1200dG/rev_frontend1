import { routes } from "../routes";

export const imageRoutes = [
  {
    href: routes.ui.settings,
    src: "/settings/bgsettings.svg",
    activeSrc: "/admin/bgsettings.svg",
  },
  {
    href: routes.ui.root,
    src: "/dashboard/bgdash.svg",
    activeSrc: "/register/bgreg.png",
  },
  {
    href: routes.ui.profile,
    src: "/settings/bgsettings.svg",
    activeSrc: "/settings/bgsettings.svg",
  },
  {
    href: routes.ui.faq,
    src: "/faqs/FaqBg.svg",
    activeSrc: "/faqs/FaqBg.svg",
  },
  {
    href: routes.ui.clash.tournaments,
    src: "/videos/userLayoutVideo.mp4",
    activeSrc: "/videos/userLayoutVideo.mp4",
  },
  {
    href: routes.ui.enigma.seasonDetail("1"),
    src: "/videos/userLayoutVideo.mp4",
    activeSrc: "/videos/userLayoutVideo.mp4",
  },
  { href: routes.ui.about, src: "/about/about.svg" },
  {
    href: routes.ui.leaderboard,
    src: "/videos/userLayoutVideo.mp4",
    activeSrc: "/videos/userLayoutVideo.mp4",
  },
  {
    href: routes.ui.clash.tournaments,
    src: "/videos/userLayoutVideo.mp4",
    activeSrc: "/videos/userLayoutVideo.mp4",
    dynamic: true,
  },
  {
    href: routes.ui.enigma.seasonDetail("1"),
    src: "/videos/userLayoutVideo.mp4",
    activeSrc: "/videos/userLayoutVideo.mp4",
    dynamic: true,
  },
  {
    href: "/enigma/seasons",
    src: "/videos/userLayoutVideo.mp4",
    activeSrc: "/videos/userLayoutVideo.mp4",
    dynamic: true,
  },
  {
    href: routes.ui.gamehub,
    src: "/videos/userLayoutVideo.mp4",
    activeSrc: "/videos/userLayoutVideo.mp4",
    dynamic: true,
  },
  {
    href: routes.ui.payments.index,
    src: "/videos/userLayoutVideo.mp4",
    activeSrc: "/videos/userLayoutVideo.mp4",
    dynamic: true,
  },
  {
    href: routes.ui.mystatistics,
    src: "/videos/userLayoutVideo.mp4",
    activeSrc: "/videos/userLayoutVideo.mp4",
    dynamic: true,
  },
];
