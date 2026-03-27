import { TooltipProps } from "../../../lib/types/common/types";
import React from "react";

const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  position = "top",
}) => {
  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-white",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-white",
    left: "left-full top-1/2 -translate-y-1/2 border-l-white",
    right: "right-full top-1/2 -translate-y-1/2 border-r-white",
  };

  return (
    <div className="relative inline-flex group">
      {children}
      <div
        className={`absolute ${positionClasses[position]} opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50`}
      >
        <div className="relative bg-white text-[#5a1804] text-xs rounded-md px-2 py-1 shadow-md whitespace-nowrap">
          {text}
          <div
            className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
