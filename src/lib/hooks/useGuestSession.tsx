"use client";

import { useState, useEffect } from "react";
import { GuestSessionData, UseGuestSessionReturn } from "@/lib/types/common/types";

export const useGuestSession = (): UseGuestSessionReturn => {
  const [guestSession, setGuestSession] = useState<GuestSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getGuestSession = () => {
      try {
        const guestSessionCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('guest_session='));
        
        if (guestSessionCookie) {
          const guestSessionValue = guestSessionCookie.split('=')[1];
          const guestSession = JSON.parse(decodeURIComponent(guestSessionValue));
          setGuestSession(guestSession);
        }
      } catch (error) {
        console.error("Failed to parse guest session:", error);
        setGuestSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    getGuestSession();
  }, []);

  const getGuestInitials = () => {
    if (guestSession?.first_name || guestSession?.last_name) {
      return `${guestSession.first_name?.charAt(0) || 'G'}${guestSession.last_name?.charAt(0) || 'U'}`.toUpperCase();
    }
    return 'GU';
  };

  return {
    guestSession,
    isLoading,
    hasGuestSession: !!guestSession,
    getGuestInitials,
  };
};
