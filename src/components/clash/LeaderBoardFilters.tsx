import { leaderboardFilters } from "@/lib/constants/clash";
import Image from "next/image";

interface LeaderBoardFiltersProps {
  selected: string[];
  onSelect: (value: string) => void;
}

const LeaderBoardFilters: React.FC<LeaderBoardFiltersProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <>
      <div className="hidden sm:block">
        <div className="grid grid-cols-2 gap-2">
          {leaderboardFilters.map((filter, key) => {
            const isSelected = selected.includes(filter.value);
            return (
              <div
                key={key}
                onClick={() => onSelect(filter.value)}
                className={`relative border border-[#D4B588] py-4 cursor-pointer rounded-md transition-all duration-300
                  ${isSelected
                    ? "bg-[#D4B588]"
                    : "bg-[#3A0001]/30 shadow-[0px_3px_6px_rgba(255,252,250,0.25)] hover:shadow-[0px_6px_12px_rgba(244,207,139,0.6)]"
                  }`}
              >
                <div className="flex flex-col gap-1.5 items-center justify-center">
                  <Image src={isSelected ? filter.a_src : filter.src} alt="icon" height={38} width={38} className="transition-transform duration-300" />
                  <p className={`text-sm font-medium transition-colors duration-300 ${isSelected ? "text-[#3A0001]" : "text-[#D4B588] hover:text-[#F4CF8B]"}`} >
                    {filter.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div >
      <div className="block sm:hidden">
        <div className="grid grid-cols-4 w-[calc(318/375*100vw)] h-[calc(66/812*100vh)] rounded-b-lg">
          {leaderboardFilters.map((filter, key) => {
            const isSelected = selected.includes(filter.value);
            const isLast = key === leaderboardFilters.length - 1;
            const isFirst = key === 0;
            return (
              <div
                key={key}
                onClick={() => onSelect(filter.value)}
                className={`relative border-[#D4B588]/50 cursor-pointer transition-all duration-300 flex items-center justify-center ${!isLast ? "border-r-2 border-[#D4B588]/50" : ""}
                    ${isSelected ? "bg-[#D4B588]" : "bg-[#45251b] shadow-[0px_3px_6px_rgba(255,252,250,0.25)] hover:shadow-[0px_6px_12px_rgba(244,207,139,0.6)]"}
                    ${isFirst ? "rounded-bl-md" : ""}  ${isLast ? "rounded-br-md" : ""}
               `}
              >
                <div className="flex flex-col h-[calc(39/812*100vh)] items-center justify-between">
                  <Image src={isSelected ? filter.a_src : filter.src} alt="icon" height={21} width={21} className="transition-transform duration-300" />
                  <p className={`text-xs font-medium transition-colors duration-300 ${isSelected ? "text-[#3A0001]" : "text-[#D4B588] hover:text-[#F4CF8B]"}`} >
                    {filter.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>

  );
};

export default LeaderBoardFilters;
