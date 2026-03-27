"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { handleLogout } from "@/lib/utils/signout";
import { routes } from "@/lib/routes";
import { useGuestSession } from "@/lib/hooks/useGuestSession";
import Portal from "@/components/common/Portal";
import { ProfileDropdownProps } from "@/lib/types/common/types";

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ profileInitials }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [dropdownState, setDropdownState] = useState({
    isOpen: false,
    position: { top: 0, right: 0 }
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { guestSession } = useGuestSession();

  const isAdmin = session?.user?.role === "ADMIN";

  const getDisplayName = useCallback(() => {
    const sessionUser = session?.user;
    const guest = guestSession;

    if (sessionUser?.username) {
      return `${sessionUser.username}`;
    }
    if (guest?.username) {
      return `${guest.username}`;
    }
    return "User";
  }, [session?.user, guestSession]);

  const displayName = getDisplayName();
  const displayEmail = session?.user?.email || guestSession?.email || "";

  const toggleDropdown = useCallback(() => {
    if (!dropdownState.isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownState(prev => ({
        ...prev,
        isOpen: !prev.isOpen,
        position: {
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right,
        }
      }));
    } else {
      setDropdownState(prev => ({ ...prev, isOpen: !prev.isOpen }));
    }
  }, [dropdownState.isOpen]);

  const handleDashboardClick = useCallback(() => {
    setDropdownState(prev => ({ ...prev, isOpen: false }));
    router.push(routes.ui.admin.dashboard);
  }, [router]);

  const handleLogoutClick = useCallback(async () => {
    setDropdownState(prev => ({ ...prev, isOpen: false }));

    if (guestSession) {
      document.cookie = 'guest_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    await handleLogout();
  }, [guestSession]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node) &&
      dropdownState.isOpen
    ) {
      const dropdownElement = document.querySelector('[data-dropdown-portal]');
      if (!dropdownElement || !dropdownElement.contains(event.target as Node)) {
        setDropdownState(prev => ({ ...prev, isOpen: false }));
      }
    }
  }, [dropdownState.isOpen]);

  const handleScroll = useCallback(() => {
    if (dropdownState.isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownState(prev => ({
        ...prev,
        position: {
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right,
        }
      }));
    }
  }, [dropdownState.isOpen]);

  useEffect(() => {
    if (dropdownState.isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll);
      document.addEventListener("resize", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("resize", handleScroll);
    };
  }, [dropdownState.isOpen, handleClickOutside, handleScroll]);

  return (
    <div className="relative flex justify-end items-center w-[calc(32/375*100vw)] sm:w-full h-full" ref={dropdownRef}>
      <div
        ref={buttonRef}
        className="w-[calc(32/375*100vw)] sm:w-[clamp(1.5rem,2.5vw,3rem)] h-[calc(32/812*100vh)] sm:h-[clamp(1.5rem,2.5vw,3rem)] bg-transparent border border-white rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
        onClick={toggleDropdown}
      >
        <span className="text-white text-[10px] sm:text-xs xl:text-sm 2xl:text-base font-semibold">
          {profileInitials}
        </span>
      </div>

      {dropdownState.isOpen && (
        <Portal>
          <div
            data-dropdown-portal
            className="fixed w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] py-3 px-4 space-y-3"
            style={{
              top: `${dropdownState.position.top}px`,
              right: `${dropdownState.position.right}px`,
            }}
          >
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              {displayName}
            </span>
            <span className="text-xs text-gray-500 truncate">
              {displayEmail}
            </span>
          </div>

          <hr className="border-t border-gray-100" />

          {isAdmin && (
            <>
              <button
                onClick={handleDashboardClick}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer flex items-center gap-2"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                  />
                </svg>
                Dashboard
              </button>
              <hr className="border-t border-gray-100" />
            </>
          )}

          <button
            onClick={handleLogoutClick}
            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer flex items-center gap-2"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
            Logout
          </button>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default ProfileDropdown;
