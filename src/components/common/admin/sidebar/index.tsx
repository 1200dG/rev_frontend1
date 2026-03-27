"use client";
import Link from "next/link";
import { adminRoutes } from "@/lib/constants/admin";
import { usePathname, useRouter } from "next/navigation";
import { routes } from "@/lib/routes";

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathName = usePathname();

  const handleLogoClick = () => {
    if (pathName === routes.ui.admin.dashboard) {
      router.push(routes.ui.root);
    } else {
      router.push(routes.ui.admin.dashboard);
    }
  };

  return (
    <aside
      aria-label="Sidebar"
      className="w-full md:h-screen md:w-64 bg-white md:border-r border-[#F0F1F3] sticky bottom-0 z-10 md:overflow-hidden"
    >
      <div className="flex md:block w-full md:w-auto">
        <div className="hidden md:flex items-center px-5 py-2">
          <img onClick={handleLogoClick} className="cursor-pointer transition-transform duration-200 hover:scale-105 hover:opacity-90" src="/admin/sidebar/logo.svg" alt="REV logo black text with icon" />
        </div>
        <nav className="flex flex-row justify-between md:flex-col flex-1 gap-2 overflow-x-auto md:overflow-visible px-5 py-2 md:py-6">
          {adminRoutes.map((data, index) => {
            const isActive = pathName && data.href === pathName;
            return (
              <div key={index}>
                <Link
                  href={data.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isActive ? "bg-[#22222C]" : "text-[#667085] hover:text-[#22222C]"}`}
                >
                  <img
                    src={isActive ? data.activeSrc : data.src}
                    alt={`${data.title} icon`}
                    className="w-5 h-5 object-contain"
                  />
                  <span
                    className={`${isActive ? "text-white font-bold" : "font-semibold"} text-sm  whitespace-nowrap md:whitespace-normal hidden sm:inline-block`}
                  >
                    {data.title}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
