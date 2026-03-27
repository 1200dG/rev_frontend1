"use client";

import { adminRoutes } from "@/lib/constants/admin";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { handleLogout } from "@/lib/utils/signout";
import PeriodDropdown from "../periodDropdown";

const Header: React.FC = () => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const activeItem = adminRoutes.find((route) => pathName && route.href === pathName);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center border-b border-[#DBDBDB] px-10 py-3 md:px-6 md:py-4 sticky top-0 z-10 bg-white">
      <h2 className="text-[#1C1C1C] text-sm font-normal">
        {activeItem?.title}
      </h2>

      <div className="relative flex items-center gap-4 h-10" ref={dropdownRef}>
        {pathName === "/admin/dashboard" && (
          <div className="hidden sm:block">
            <PeriodDropdown
              mode="global"
              defaultValue="Monthly"
              options={["Monthly", "Yearly"]}
            />
          </div>
        )}
        <img onClick={toggleDropdown} alt="User avatar" className="w-10 h-10 rounded-full object-cover cursor-pointer" src={ "https://storage.googleapis.com/a1aa/image/79050233-64cd-4cb0-a251-50e0f0ce501a.jpg" } />

        {dropdownOpen && (
          <div className="absolute mt-[180px] right-0 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-3 px-4 space-y-3">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800"> {session?.user?.username || "User"} </span>
              <span className="text-xs text-gray-500 truncate"> {session?.user?.email} </span>
            </div>

            <hr className="border-t border-gray-100" />

            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer" >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
