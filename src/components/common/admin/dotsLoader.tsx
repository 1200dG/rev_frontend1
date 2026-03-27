"use client";

import { DotsLoaderProps } from "@/lib/types/common/types";
import React from "react";
import { BeatLoader } from "react-spinners";

const TableLoader: React.FC<DotsLoaderProps> = ({ 
  message = "Loading...", 
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <BeatLoader color="#22222C" size={8} />
        <p className="text-sm text-[#919EAB] font-medium">{message}</p>
      </div>
    </div>
  );
};

export default TableLoader;
