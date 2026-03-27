"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { UserGameData } from "@/lib/types/common/types";


export const useUserGameData = () => {
  const { data: session, update } = useSession();
  const [gameData, setGameData] = useState<UserGameData>({
    credits: session?.user?.credits || 200,
    lives: session?.user?.lives || 5
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setGameData({
        credits: session.user.credits || 200,
        lives: session.user.lives || 5
      });
    }
  }, [session]);

  const refreshGameData = async () => {
    if (!session?.user?.account_id) return;

    setIsLoading(true);
    try {
      const currentData = {
        credits: session.user.credits || 200,
        lives: session.user.lives || 5
      };
      setGameData(currentData);

      await update({
        ...session,
        user: {
          ...session.user,
          credits: currentData.credits,
          lives: currentData.lives
        }
      });
    } catch (error) {
      console.error("Failed to refresh game data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCredits = (newCredits: number) => {
    setGameData(prev => ({ ...prev, credits: newCredits }));
  };

  const updateLives = (newLives: number) => {
    setGameData(prev => ({ ...prev, lives: newLives }));
  };

  const deductCredits = (amount: number) => {
    setGameData(prev => ({ 
      ...prev, 
      credits: Math.max(0, prev.credits - amount) 
    }));
  };

  const deductLives = (amount: number = 1) => {
    setGameData(prev => ({ 
      ...prev, 
      lives: Math.max(0, prev.lives - amount) 
    }));
  };

  const addCredits = (amount: number) => {
    setGameData(prev => ({ 
      ...prev, 
      credits: prev.credits + amount 
    }));
  };

  const addLives = (amount: number) => {
    setGameData(prev => ({ 
      ...prev, 
      lives: prev.lives + amount 
    }));
  };

  return {
    gameData,
    isLoading,
    refreshGameData,
    updateCredits,
    updateLives,
    deductCredits,
    deductLives,
    addCredits,
    addLives
  };
};
