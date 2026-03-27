import { StatisticsCardProps } from "@/lib/types/common/types";
import React from "react";

const StatisticsCards: React.FC<StatisticsCardProps> = ({ children }) => {
  return <div className="px-4 py-5 relative bg-[#D9D9D91A]">{children}</div>;
};

export default StatisticsCards;
