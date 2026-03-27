"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PortalProps } from "@/lib/types/common/types";

const Portal: React.FC<PortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, document.body) : null;
};

export default Portal;
