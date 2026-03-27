import { useAppContext } from "@/lib/hooks/useAppContext";
import { TournamentDetailProps } from "@/lib/types/common/types";
import { tournamentOverview } from "@/lib/utils/helpers";

const TournamentFilters: React.FC<TournamentDetailProps> = ({
  tournamentDetail,

}) => {
  const { isCollapsed } = useAppContext();

  return (
    <>
      <div className="hidden sm:flex w-full h-full justify-between">
        {tournamentDetail &&
          tournamentOverview(tournamentDetail).map((filter, key) => (
            <div
              key={key}
              className={`${isCollapsed ? " w-[calc(107/1440*100vw)]" : "w-[calc(95/1440*100vw)]"} border border-[#D4B588] bg-[#08171F]/30 shadow h-[calc(91/900*100vh)]`}
            >
              <div className={`flex flex-col items-center justify-center gap-1 h-[calc(95/900*100vh)] ${isCollapsed ? " w-[calc(107/1440*100vw)]" : "w-[calc(91.78/1440*100vw)]"}`}>
                <img className={`w-[calc(30/1440*100vw)] h-[calc(30/900*100vh)]`} src={filter.src} alt="icon" />
                <div className="flex flex-col justify-center items-center gap-0.5">
                  <p className="text-[6px] sm:text-[7px] md:text-2xs lg:text-xs xl:text-md font-base text-[#D4B588]">{filter.value}</p>
                  <p className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-[8px] xl:text-[12px] font-medium text-[#D4B588]">{filter.label}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="block sm:hidden  w-full h-full">
        {tournamentDetail && (
          <div className="grid grid-cols-3 grid-rows-2 gap-1 w-full h-full">
            {tournamentOverview(tournamentDetail).map((filter, key) => (
              <div key={key} className={`rounded-md border-2 border-[#D4B588]/30 bg-[#321813]/30 shadow w-full h-full`} >
                <div className={`flex flex-col items-center justify-center w-full h-full`}>
                  <img className="w-[calc(29.17/375*100vw)] h-[calc(29.17/1033*100vh)]" src={filter.src} alt="icon" />
                  <div className="flex flex-col justify-center items-center gap-0.5">
                    <p className="text-[clamp(6px,3vw,10px)] font-bold text-[#D4B588]">{filter.value}</p>
                    <p className="text-[clamp(6px,3vw,10px)] font-medium text-[#D4B588]">{filter.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>)}
      </div>
    </>
  );
};

export default TournamentFilters;



