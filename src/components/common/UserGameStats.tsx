"use client";

import React from "react";
import { useUserGameData } from "@/lib/hooks/useUserGameData";

const UserGameStats: React.FC = () => {
  const { gameData } = useUserGameData();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 bg-[#534741] border border-[#FFCE96B2] rounded-lg px-3 py-2">
        <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">C</span>
        </div>
        <span className="text-[#FFCE96] font-bold">{gameData.credits}</span>
      </div>

      <div className="flex items-center space-x-2 bg-[#534741] border border-[#FFCE96B2] rounded-lg px-3 py-2">
        <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">♥</span>
        </div>
        <span className="text-[#FFCE96] font-bold">{gameData.lives}</span>
      </div>
    </div>
  );
};

export default UserGameStats;
