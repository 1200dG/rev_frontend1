"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

const SessionManager: React.FC = () => {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === 'authenticated' && session) {
      window.dispatchEvent(new CustomEvent('sessionUpdated', {
        detail: { session }
      }));
    }
  }, [session, status]);

  return null;
};

export default SessionManager;
