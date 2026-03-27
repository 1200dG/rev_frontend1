"use client";
import { useContext, useEffect, useState } from "react";
import { routes } from "@/lib/routes";
import { usePathname, useRouter } from "next/navigation";
import { fetchGamehubData, getActiveSeasonLevels } from "@/lib/services/seasonActions";
import { toast } from "react-toastify";
import Link from "next/link";
import { BeatLoader } from "react-spinners";
import { getDailyRiddle } from "@/lib/services/riddleActions";
import { AppContext } from "../context/AppContext";
import { useImagePreloader } from "@/lib/hooks/useImagePreloader";
import { LeaderboardEntry, Season, Tournament, Stats } from "@/lib/types/gamehub";
import Loader from "../common/loader";
import { handleApiError } from "@/lib/errorHandler";

const GameHub: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [season, setSeason] = useState<Season | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"active" | "archive">("active");
  const [statsData, setStatsData] = useState<Stats | null>(null);
  const [hasPlayedDailyRiddle, setHasPlayedDailyRiddle] = useState(false);
  const [isdailyriddleavailable, setIsDailyRiddleAvailable] = useState(false);
  const [tournamentsLoading, setTournamentsLoading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setCurrentTab, setPreviousUrl } = useContext(AppContext)!;
  const { isCollapsed } = useContext(AppContext)!;

  useImagePreloader(
    [
      "/gamehub/Overlay.png",
      "/gamehub/Overlay-2.png",
      "/gamehub/Overlay-3.png",
      "/gamehub/T_Overlay-4.png",
      "/gamehub/Overlay-4.png",
      "/gamehub/Overlay-5.png",
    ],
    () => setImagesLoaded(true)
  );

  const loadData = async (tab: "active" | "archive") => {
    try {
      setTournamentsLoading(true);
      const data = await fetchGamehubData(tab);
      setSeason(data.season);
      setLeaderboard(data.leaderboard);
      setStatsData(data.stats);
      setTournaments(data.tournaments);
      setHasPlayedDailyRiddle(data.has_played_daily_riddle);
      setIsDailyRiddleAvailable(data.is_daily_riddle_available)
    } catch (error) {
      handleApiError(error, "Failed to load gamehub data. Please try again.");
    } finally {
      setTournamentsLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab]);

  const goToTournament = (id: string) => {
    setPreviousUrl(pathname);
    router.push(routes.ui.clash.tournamentDetail(id));
  };

  const handleRevSeasonClick = async () => {
    try {
      if (!season || !season.is_active) {
        toast.info("No active season available right now!");
        return;
      }
      const seasonData = await getActiveSeasonLevels();
      router.push(routes.ui.enigma.seasonDetail(seasonData.season_id.toString()));
    } catch (error) {
      console.error("Error loading season levels:", error);
      handleApiError(error, "Failed to load season levels. Please try again.");
    }
  };

  const handleDailyRiddleClick = async () => {
    if (!pathname) return;
    setPreviousUrl(pathname);
    try {
      if (!isdailyriddleavailable) {
        toast.info("No riddles for today")
        return;
      }
      else {
        if (hasPlayedDailyRiddle) {
          toast.info("You have already played the daily riddle for today!");
          return;
        }

        const response = await getDailyRiddle();
        if (Array.isArray(response.errors)) {
          handleApiError(response.errors)
          return;
        }

        router.push(routes.ui.riddles.daily);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load daily riddle";
      handleApiError(error, message);
    }
  };

  const handleTabChange = (tab: "active" | "archive") => {
    setActiveTab(tab);
    setTournaments([]);
    setTournamentsLoading(true);
  };


  if (!imagesLoaded) return <Loader />;

  return !loading ? (
    <>
      <div className="hidden sm:block">
        <div className={`flex flex-col items-center overflow-x-hidden gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 ${isCollapsed ? "w-[96.7%]" : "w-[calc(1312/1440*100vw)]"} max-w-full `}>
          <div className={`flex flex-col items-start gap-0.5 ${isCollapsed ? "w-[calc(1265/1440*100vw)]" : "w-[calc(1137/1440*100vw)]"} xl:gap-1`}>
            <h2 className="text-white text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium">
              Gamehub
            </h2>
            <p className="text-[#CAC6DD] text-[6px] sm:text-[7px] md:text-[9px] lg:text-[10px] xl:text-xs 2xl:text-sm font-normal">
              All in one place!
            </p>
          </div>

          <div className={`flex flex-col justify-between items-center ${isCollapsed ? "w-[calc(1265/1440*100vw)] h-[calc(653/900*100vh)]" : "w-[calc(1137/1440*100vw)] h-[calc(653/900*100vh)]"}`}>
            <div className={`flex justify-between items-start ${isCollapsed ? "w-[calc(1265/1440*100vw)] h-[calc(472/900*100vh)]" : "w-[calc(1137/1440*100vw)] h-[calc(472/900*100vh)]"}`}>
              <div className={`flex flex-col justify-between items-center ${isCollapsed ? "w-[calc(627/1440*100vw)] h-[calc(472/900*100vh)]" : "w-[calc(563.57/1440*100vw)] h-[calc(472/900*100vh)]"}`}>
                <div className={`flex justify-between ${isCollapsed ? "w-[calc(627/1440*100vw)] h-[calc(151/900*100vh)]" : "w-[calc(563.57/1440*100vw)] h-[calc(151/900*100vh)]"} `}>
                  <button onClick={handleRevSeasonClick} className={` ${isCollapsed ? "w-[calc(305/1440*100vw)] h-[calc(151/900*100vh)]" : "w-[calc(273.87/1440*100vw)] h-[calc(151/900*100vh)]"} flex justify-between rounded lg:rounded-md border border-[#FFD278]/50 bg-[url('/gamehub/button1bg.png')] bg-no-repeat bg-cover cursor-pointer shadow-[0px_3px_4px_rgba(255,252,250,0)] transition-opacity duration-300 hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box `} >
                    <div className="flex flex-col justify-between  px-[4%] py-[2.5%] will-change-transform" >
                      <h3 className="text-left text-[7px] sm:text-[9px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg font-bold w-[calc(113/1440*100vw)] h-[calc(43/900*100vh)] text-white">
                        REV
                        <br />
                        <span className="block break-words"> {season?.title || "Season"} </span>
                      </h3>
                      <div className="flex items-center gap-1 cursor-pointer">
                        <p className="text-[5px] sm:text-[8px] md:text-[11px] lg:text-xs xl:text-sm 2xl:text-base font-normal text-white"> Play </p>
                        <img src="/gamehub/arrow_right.svg" alt="right arrow icon" className="w-2 sm:w-3 md:w-4 xl:w-5 2xl:w-6" />
                      </div>
                    </div>
                    <div>
                      <img src="/gamehub/button1Aura.svg" alt="right arrow icon" className="w-full h-full aspect-auto" />
                    </div>
                  </button>
                  <button onClick={handleDailyRiddleClick} className={`${isCollapsed ? "w-[calc(305/1440*100vw)] h-[calc(151/900*100vh)]" : "w-[calc(273.87/1440*100vw)] h-[calc(151/900*100vh)]"} flex justify-between rounded lg:rounded-md border border-[#FFD278]/50  bg-[url('/gamehub/button1bg.png')] bg-no-repeat bg-cover cursor-pointer transition-opacity duration-300  hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box`} >
                    <div className="flex flex-col justify-between px-[4%] py-[2.5%] will-change-transform">
                      <h3 className="text-left text-[7px] sm:text-[9px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg font-bold text-white"> Daily Riddle </h3>
                      <div className="flex items-center gap-1 cursor-pointer">
                        <p className="text-[5px] sm:text-[8px] md:text-[11px] lg:text-xs xl:text-sm 2xl:text-base font-normal text-white"> Play </p>
                        <img src="/gamehub/arrow_right.svg" alt="right arrow icon" className="w-2 sm:w-3 md:w-4 xl:w-5 2xl:w-6" />
                      </div>
                    </div>
                    <div>
                      <img src="/gamehub/button2Aura.svg" alt="right arrow icon" className="w-full h-full aspect-auto" />
                    </div>
                  </button>
                </div>
                <div className={`flex justify-center ${isCollapsed ? "w-[calc(627/1440*100vw)] h-[calc(303/900*100vh)]" : "w-[calc(563.57/1440*100vw)] h-[calc(303/900*100vh)]"} rounded border border-[#FFD278]/50 bg-[url('/gamehub/Overlayfinal.png')] bg-no-repeat bg-cover`}>
                  <div className="h-[calc(303/900*100vh)]">
                    <div className={`${isCollapsed ? "w-[calc(586/1440*100vw)] h-[calc(43/900*100vh)]" : "w-[calc(526.71/1440*100vw)] h-[calc(43/900*100vh)]"} py-[0.5%] xl:py-[1%] flex justify-between items-center border-b border-[#88724B]`}>
                      <p className="text-left text-[7px] sm:text-[9px] md:text-xs lg:text-base xl:text-lg 2xl:text-xl font-bold text-white">
                        Leaderboard
                      </p>
                      <Link href="/leaderboard" className="flex justify-center items-center cursor-pointer" >
                        <span className="flex justify-center items-center whitespace-nowrap px-3 sm:px-4 py-1 sm:py-1.5 text-[4px] sm:text-[5px] md:text-[6px] lg:text-[7px] xl:text-[9px] 2xl:text-xs font-normal text-[#f5f1f1] rounded-lg  transition-all duration-300  hover:drop-shadow-[0_0_10px_#facc15] hover:scale-105 will-change-transform" > View All </span>
                      </Link>
                    </div>
                    <div>
                      <div className={`${isCollapsed ? "w-[calc(590/1440*100vw)] " : "w-[calc(530.30/1440*100vw)] "} h-[calc(35/900*100vh)] grid grid-cols-5 items-center text-[5px] sm:text-[7px] md:text-[9px] lg:text-[11px] xl:text-xs 2xl:text-sm font-semibold font-Sora text-white`}>
                        <span className="col-span-2 ps-[5%]">User</span>
                        <span className="text-center">Total Points</span>
                        <span className="text-center">Wins</span>
                        <span className="text-center">Streak</span>
                      </div>
                      <div className="flex flex-col gap-[calc(4.5/900*100vh)] items-center h-[calc(178/900*100vh)]">
                        {leaderboard.map(
                          ({ rank, user, total_points, wins, streak, is_current }) => (
                            <div key={rank} className={`${isCollapsed ? "w-[calc(590/1440*100vw)] h-[calc(34/900*100vh)]" : "w-[calc(530.30/1440*100vw)] h-[calc(34/900*100vh)]"} gap-1 grid grid-cols-5 items-center 
                            ${rank === 1
                                ? "border-[#F7CB45] text-white [background:linear-gradient(90deg,rgba(247,203,69,0.50)_3.56%,rgba(247,203,69,0.30)_47.88%,rgba(247,203,69,0.50)_98.11%)] backdrop-blur-[1.74609375px]"
                                : rank === 2
                                  ? "border-[#EEE] text-white [background:linear-gradient(90deg,rgba(238,238,238,0.50)_3.56%,rgba(238,238,238,0.30)_47.88%,rgba(238,238,238,0.50)_98.11%)] backdrop-blur-[1.74609375px]"
                                  : rank === 3
                                    ? "border-[#D9B288] text-white [background:linear-gradient(90deg,rgba(217,178,136,0.50)_3.56%,rgba(217,178,136,0.20)_47.88%,rgba(217,178,136,0.50)_98.11%)] backdrop-blur-[1.74609375px]"
                                    : is_current && rank > 3
                                      ? "bg-[rgb(212,181,136)] text-[rgb(98,59,20)] backdrop-blur-[1.74609375px]"
                                      : "border-[#F4CF8B] text-white [background:linear-gradient(353deg,rgba(192,155,100,0.41)_-40.83%,rgba(192,155,100,0)_118.76%)]"
                              }
                            text-[5px] sm:text-[7px] md:text-[9px] lg:text-[11px] xl:text-xs font-semibold
                            ${is_current && rank < 3 ? "border-2 " : "border [border-width:0.291px]"} 
                          `}
                            >
                              <div className="relative flex items-center gap-4 col-span-2 ps-[5%] h-full ">
                                {rank === 1 ? (
                                  <img src="/gamehub/rank1.svg" alt="Gold medal" className="w-[10%]" />
                                ) : rank === 2 ? (
                                  <img src="/gamehub/rank2.svg" alt="Silver medal" className="w-[10%]" />
                                ) : rank === 3 ? (
                                  <img src="/gamehub/rank3.svg" alt="Bronze medal" className="w-[10%]" />
                                ) : (
                                  <span className="w-[10%] text-center"> {rank} </span>
                                )}
                                <span>{user}</span>
                                <div
                                  className={`absolute w-[2.5%] ${rank === 1
                                    ? "bg-[#F7CB45]"
                                    : rank === 2
                                      ? "bg-[#EEEEEE]"
                                      : rank === 3
                                        ? "bg-[#BB9986]"
                                        : is_current && rank > 3
                                          ? "bg-[#fcffac]"
                                          : "bg-[#5f5954]"
                                    } h-[99%] left-0 bottom-0`}
                                />
                              </div>
                              <div className="text-center">{total_points}</div>
                              <div className="text-center">{wins}</div>
                              <div className="text-center">{streak}</div>
                            </div>
                          )
                        )}
                      </div>

                    </div>
                    <div className={`${isCollapsed ? "w-[calc(590/1440*100vw)]" : "w-[calc(530.30/1440*100vw)] "} h-[calc(45/900*100vh)] flex justify-end items-center sm:justify-end sm:item-center`}>
                      <div className="group flex items-center gap-0.5 lg:gap-1 will-change-transform cursor-pointer transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0_0_10px_#facc15]"
                        onClick={() => {
                          setCurrentTab("gameplay");
                          router.push("/about#point-system");
                        }}
                      >
                        <span className="text-[4px] sm:text-[6px] md:text-[8px] lg:text-[10px] xl:text-xs 2xl:text-sm font-normal text-white "> Points System </span>
                        <img src="/gamehub/arrow_right.svg" alt="right arrow icon" className="w-2 sm:w-3 md:w-4 xl:w-5 2xl:w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${isCollapsed ? "w-[calc(614/1440*100vw)] h-[calc(472/900*100vh)]" : "w-[calc(551.89/1440*100vw)] h-[calc(472/900*100vh)]"} rounded flex justify-center border border-[#FFD278]/50 bg-[url('/gamehub/OverlayTournament.png')] bg-no-repeat bg-cover`} >
                <div className={`${isCollapsed ? "w-[calc(572/1440*100vw)]" : "w-[calc(510.30/1440*100vw)]"} h-[calc(472/900*100vh)] flex flex-col items-center justify-between gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3`}>
                  <div className={`${isCollapsed ? "w-[calc(572/1440*100vw)]" : "w-[calc(510.30/1440*100vw)]"} h-[calc(42/900*100vh)] py-[0.5%] xl:py-[1%] flex justify-between items-end border-b border-[#88724B]`}>
                    <p className="text-left text-[clamp(1.125rem,1.25vw,20rem)] font-bold text-white"> Tournaments </p>
                    <div className="flex justify-between items-center w-[calc(122/1440*100vw)] h-[calc(22/900*100vh)]">
                      <button onClick={() => handleTabChange("active")} className={`w-[calc(57/1440*100vw)] h-[calc(22/900*100vh)] border rounded-[2px] lg:rounded ${activeTab === "active" ? "border-[#FFD278] bg-[#402526]" : "border-[#8D8D8D] bg-[#292929]"} w-[calc(57/1440*100vw)] h-[calc(22/900*100vh)] flex justify-center items-center cursor-pointer hover:scale-105 hover:drop-shadow-[0_0_5px_#facc15]`} >
                        <span className="text-[3px] sm:text-[4px] md:text-[5px] lg:text-[6px] xl:text-[8px] 2xl:text-[10px] font-bold text-white"> ACTIVE </span>
                      </button>
                      <button onClick={() => handleTabChange("archive")} className={`w-[calc(57/1440*100vw)] h-[calc(22/900*100vh)] border rounded-[2px] lg:rounded ${activeTab === "archive" ? "border-[#FFD278] bg-[#402526]" : "border-[#8D8D8D] bg-[#292929]"} flex justify-center items-center cursor-pointer hover:scale-105 hover:drop-shadow-[0_0_5px_#facc15]`} >
                        <span className="text-[3px] sm:text-[4px] md:text-[5px] lg:text-[6px] xl:text-[8px] 2xl:text-[10px] font-bold text-white"> ARCHIVED </span>
                      </button>
                    </div>
                  </div>
                  {tournamentsLoading ? (
                    <div className="flex justify-center items-center h-[80%]">
                      <BeatLoader color="white" size={8} />
                    </div>
                  ) : tournaments?.length >= 0 ? (
                    <div className={`${isCollapsed ? "w-[calc(572/1440*100vw)]" : "w-[calc(510.30/1440*100vw)]"} h-[calc(417/900*100vh)] flex flex-col gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 overflow-y-auto no-scrollbar `}>
                      <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3">
                        {tournaments.map(({ id, tournament_id, title }) => (
                          <div key={id} onClick={() => goToTournament(tournament_id)} className={`flex justify-between items-center ${isCollapsed ? "w-[calc(572/1440*100vw)]" : "w-[calc(510.30/1440*100vw)]"} h-[calc(40/900*100vh)] bg-[url('/gamehub/ItemBase.png')] bg-no-repeat bg-cover border-2 border-[#F4CF8B]/60 rounded cursor-pointer hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] transition-shadow duration-300`} >
                            <div className="flex items-center gap-0.5 lg:gap-1 xl:gap-1.5 2xl:gap-2 w-1/2 ">
                              <img src="/gamehub/wings.svg" className={`h-[calc(31/900*100vh)] ${isCollapsed ? "w-[calc(41/1440*100vw)]" : "w-[calc(36.85/1440*100vw)]"}`} />
                              <h3 className="text-left italic uppercase text-[7px] sm:text-[9px] md:text-xs lg:text-base xl:text-lg 2xl:text-xl font-bold text-white whitespace-nowrap"> {title} </h3>
                            </div>
                            {activeTab === "active" && (
                              <div className="flex justify-end items-center gap-1 cursor-pointer w-1/2 px-[4%]">
                                <p className="text-[5px] sm:text-[8px] md:text-[11px] lg:text-xs xl:text-sm 2xl:text-base font-normal text-white">
                                  Play
                                </p>
                                <img src="/gamehub/arrow_right.svg" alt="right arrow icon" className="w-2 sm:w-3 md:w-4 xl:w-5 2xl:w-6" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={`${isCollapsed ? "w-[calc(572/1440*100vw)]" : "w-[calc(510.30/1440*100vw)]"} h-[calc(417/900*100vh)] flex flex-col justify-center items-center`}>
                      <div className={`flex flex-col justify-center items-center h-[calc(165/900*100vh)] ${isCollapsed ? "w-[calc(330/1440*100vw)]" : "w-[calc(300.67/1440*100vw)]"}`}>
                        <img src="/gamehub/gamehubTournament.svg" alt="right arrow icon" className={`${isCollapsed ? "w-[calc(101/1440*100vw)]" : "w-[calc(90.61/1440*100vw)]"} h-[calc(101/900*100vh)]`} />
                        <div className={`${isCollapsed ? "w-[calc(330/1440*100vw)]" : "w-[calc(300.67/1440*100vw)]"} h-[calc(64/900*100vh)] flex items-center justify-center border-y-2 border-[#D5B075]`}>
                          <p className="text-[4px] sm:text-[6px] md:text-[8px] lg:text-[10px] xl:text-xs 2xl:text-sm text-[#D5B175] text-center">
                            You are not enrolled in any tournament so far, visit here{" "}
                            <br />
                            and play your first competitive riddle game!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={`flex justify-center ${isCollapsed ? "w-[calc(1265/1440*100vw)] h-[calc(154/900*100vh)]" : "w-[calc(1137/1440*100vw)] h-[calc(154/900*100vh)]"} rounded border border-white/40 bg-[url('/gamehub/stats.png')] bg-no-repeat bg-cover`}>
              <div className={`${isCollapsed ? "w-[calc(1226/1440*100vw)] h-[calc(42/900*100vh)]" : "w-[calc(1101.96/1440*100vw)] h-[calc(42/900*100vh)]"}`}>
                <div className={`${isCollapsed ? "w-[calc(1226/1440*100vw)] h-[calc(42/900*100vh)]" : "w-[calc(1101.96/1440*100vw)] h-[calc(42/900*100vh)]"} py-[0.5%] xl:py-[1%] flex justify-between items-center border-b border-[#88724B]`}>
                  <p className="text-left text-[7px] sm:text-[9px] md:text-xs lg:text-base xl:text-lg 2xl:text-xl font-bold text-white"> My Statistics </p>
                  <Link href={routes.ui.mystatistics} className=" h-[calc(27/900*100vh)] flex justify-center items-center cursor-pointer" >
                    <span className="whitespace-nowrap px-2 sm:px-2.5 md:px-3 lg:px-3.5 xl:px-4  py-1 sm:py-1.5 md:py-1.5  text-[4px] sm:text-[5px] md:text-[6px] lg:text-[7px] xl:text-[9px] 2xl:text-xs font-normal text-white  rounded-md  transition-all duration-300  hover:drop-shadow-[0_0_10px_#facc15] hover:scale-105 will-change-transform" > View All </span>
                  </Link>
                </div>
                <div className="grid grid-cols-7 relative h-[calc(110/900*100vh)]">
                  {statsData && (
                    <>
                      {[
                        { label: "Ranking", value: statsData.ranking ?? "-" },
                        { label: "Points", value: statsData.points || "-" },
                        { label: "Wins", value: statsData.wins || "-" },
                        { label: "Streak", value: statsData.streak || "-" },
                        { label: "Hints", value: statsData.hints || "-" },
                        { label: "Lives", value: statsData.lives || "-" },
                        { label: "Best Rankings", value: statsData.best_ranking || "-" },
                      ].map((stat, key) => (
                        <div
                          key={key}
                          className="flex flex-col justify-center items-center relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[2px] after:bg-gradient-to-b after:from-[rgba(40,32,22,0)] after:via-[#D4B588] after:to-[rgba(40,32,22,0)] after:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] last:after:hidden"
                        >
                          <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-[#E2AC5D] font-Freeman font-normal"> {stat.value} </p>
                          <p className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base text-[#D1D1D1] font-normal"> {stat.label} </p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block sm:hidden w-[calc(375/375*100vw)]  h-[calc(660/812*100dvh)] overflow-y-auto scroll-ios">
        <div className={`flex flex-col items-center w-[calc(375/375*100vw)] `}>
          <div className={`flex flex-col justify-center items-center w-[calc(375/375*100vw)]  gap-[calc(18/845*100vh)] `}>
            <div className={`flex flex-col items-start justify-between w-[calc(321/375*100vw)] h-[calc(47/812*100vh)]`}>
              <h2 className="text-white text-lg sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium"> Gamehub </h2>
              <p className="text-[#CAC6DD] text-[12px] sm:text-[7px] md:text-xs lg:text-sm xl:text-md 2xl:text-lg font-normal"> All in one place! </p>
            </div>
            <div className={`flex justify-between items-center w-[calc(321/375*100vw)] h-[calc(109/812*100vh)] `}>
              <div className="relative flex items-end border-2 border-[#D4B588]/50 rounded-md w-[calc(155/375*100vw)] h-[calc(109/812*100vh)]" onClick={handleRevSeasonClick}>
                <img src={'/gamehub/card1Mobile.png'} alt="Card1" className="absolute w-full h-full rounded-md" />
                <div className="absolute flex flex-col items-center w-[calc(155/375*100vw)] h-[calc(38/812*100vh)]">
                  <h3 className="text-left text-[10px] sm:text-[9px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg font-bold text-white"> REV Seasons </h3>
                  <p className="text-[10px] sm:text-[8px] md:text-[11px] lg:text-xs xl:text-sm 2xl:text-base font-normal text-[#FFFFFF8F]"> Casual Gameplay </p>
                </div>
              </div>
              <div className="relative flex justify-end items-end border-2 border-[#D4B588]/50 rounded-md w-[calc(155/375*100vw)] h-[calc(109/812*100vh)] " onClick={handleDailyRiddleClick}>
                <img src={'/gamehub/card2Mobile.png'} alt="Card1" className="absolute w-full h-full rounded-md" />
                <div className="absolute flex flex-col items-start w-[calc(142/375*100vw)] h-[calc(38/812*100vh)]">
                  <h3 className="text-left text-[14px] sm:text-[9px] md:text-xs lg:text-sm xl:text-base 2xl:text-lg font-bold text-white"> Daily Riddle </h3>
                </div>
              </div>

            </div>
            <div className="relative flex justify-center items-center border-2 border-[#D4B588]/50 rounded-md w-[calc(321/375*100vw)] h-[calc(224/812*100dvh)]">
              <img src={'/gamehub/TournamentMobile.png'} alt="Tournament Background" className="absolute w-full h-full" />
              <div className="absolute flex flex-col items-center w-[calc(285/375*100vw)] h-[calc(202/812*100dvh)]">
                <div className={`w-[calc(281/375*100vw)] h-[calc(202/812*100dvh)] flex flex-col items-center justify-between gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3`}>
                  <div className={`w-[calc(281/375*100vw)] h-[calc(20/812*100dvh)] flex justify-between items-end`}>
                    <p className="text-[clamp(10px,2.5vw,14px)]  font-bold text-white"> Tournaments </p>
                    <div className="flex justify-between items-center w-[calc(102/375*100vw)] h-[calc(16/812*100dvh)]">
                      <button onClick={() => handleTabChange("active")} className={`w-[calc(50/375*100vw)] h-[calc(16/812*100vh)] border rounded-[2px] lg:rounded ${activeTab === "active" ? "border-[#FFD278] bg-[#402526]" : "border-[#8D8D8D] bg-[#292929]"} flex justify-center items-center cursor-pointer`} >
                        <span className="text-[clamp(4px,1.8vw,8px)] font-bold text-center text-white"> ACTIVE </span>
                      </button>
                      <button onClick={() => handleTabChange("archive")} className={`w-[calc(50/375*100vw)] h-[calc(16/812*100vh)] border rounded-[2px] lg:rounded ${activeTab === "archive" ? "border-[#FFD278] bg-[#402526]" : "border-[#8D8D8D] bg-[#292929]"} flex justify-center items-center cursor-pointer`} >
                        <span className="text-[clamp(4px,1.8vw,8px)] font-bold text-white"> INACTIVE </span>
                      </button>
                    </div>
                  </div>
                  {tournamentsLoading ? (
                    <div className="flex justify-center items-center h-[calc(177/812*100dvh)]">
                      <BeatLoader color="white" size={8} />
                    </div>
                  ) : tournaments?.length > 0 ? (
                    <div className={`w-[calc(281/375*100vw)] h-[calc(177/812*100dvh)] flex flex-col gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 overflow-y-auto no-scrollbar `}>
                      <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3">
                        {tournaments.map(({ id, tournament_id, title }) => (
                          <div key={id} onClick={() => goToTournament(tournament_id)} className={`flex justify-between items-center w-[calc(281/375*100vw)] h-[calc(35/812*100dvh)] bg-[url('/gamehub/ItemBase.png')] bg-no-repeat bg-cover border-2 border-[#F4CF8B]/60 rounded cursor-pointer hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] transition-shadow duration-300`} >
                            <div className="flex items-center gap-[clamp(3px,1vw,8px)] w-1/2 pl-[2.5%]">
                              <img src="/gamehub/wings.svg" alt="Wings" className={`h-[calc(31/900*100dvh)] w-[calc(23/375*100vw)]`} />
                              <h3 className="text-left italic uppercase text-[clamp(8px,2.8vw,14px)]  font-bold text-white whitespace-nowrap"> {title} </h3>
                            </div>
                            {activeTab === "active" && (
                              <div className="flex justify-end items-center gap-1 cursor-pointer w-1/2 px-[4%]">
                                <p className="text-[clamp(10px,2.8vw,14px)]  font-normal text-white"> Play </p>
                                <img src="/gamehub/arrow_right.svg" alt="right arrow icon" className="w-2 sm:w-3 md:w-4 xl:w-5 2xl:w-6" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={`flex-1 flex flex-col justify-center items-center`}>
                      <div className={`flex flex-col justify-center items-center h-[calc(126/812*100dvh)] w-[calc(245.67/375*100vw)]`}>
                        <img src="/gamehub/gamehubTournament.svg" alt="right arrow icon" className={`h-[calc(72/812*100dvh)]`} />
                        <div className={`h-[calc(51/812*100dvh)] w-[calc(245.67/375*100vw)] flex items-center justify-center border-y-2 border-[#D5B075]`}>
                          <p className="text-[clamp(10px,2.0vw,14px)] text-[#D5B175] text-center"> You are not enrolled in any tournament so <br /> far, visit Clash Section and play your <br /> first competitive riddle game! </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="relative flex justify-center items-center border-2 border-[#D4B588]/50 rounded-md w-[calc(321/375*100vw)] h-[calc(232/812*100vh)]">
              <img src={'/gamehub/leaderboardBgMobile.png'} alt="Leaderboard Background" className="absolute w-full h-full" />
              <div className="absolute flex flex-col items-center w-[calc(285/375*100vw)] h-[calc(205/812*100vh)]">

                <div className={`flex justify-between items-center w-[calc(285/375*100vw)] h-[calc(20/812*100vh)] border-b border-[#88724B]`}>
                  <p className="text-left text-[clamp(10px,2.8vw,14px)] font-bold text-white"> Leaderboard </p>
                  <Link href="/leaderboard" className="flex justify-center items-center rounded-md cursor-pointer border border-[#FFD278] bg-[#550707] w-[calc(50/375*100vw)] h-[calc(16/812*100vh)]" >
                    <span className="flex justify-center items-center whitespace-nowrap text-[clamp(7px,1.9vw,10px)] font-normal text-white rounded-lg  transition-all duration-300  hover:drop-shadow-[0_0_10px_#facc15] hover:scale-105" > View All </span>
                  </Link>
                </div>
                <div>
                  <div className={`w-[calc(285/375*100vw)] h-[calc(26/812*100vh)] grid grid-cols-5 items-center text-[clamp(7px,2.0vw,12px)] font-semibold font-Sora text-white`}>
                    <span className="col-span-2 ps-[5%]">User</span>
                    <span className="text-center">Total Points</span>
                    <span className="text-center">Wins</span>
                    <span className="text-center">Streak</span>
                  </div>
                  <div className="flex flex-col gap-[calc(4/812*100vh)] items-center h-[calc(133/812*100vh)]">
                    {leaderboard.map(
                      ({ rank, user, total_points, wins, streak, is_current }) => (
                        <div key={rank}
                          className={`
                            w-[calc(285/375*100vw)] h-[calc(25/812*100vh)] gap-1 grid grid-cols-5 items-center border [border-width:0.291px] 
                            ${rank === 1
                              ? "border-[#F7CB45] [background:linear-gradient(90deg,rgba(247,203,69,0.50)_3.56%,rgba(247,203,69,0.30)_47.88%,rgba(247,203,69,0.50)_98.11%)] backdrop-blur-[1.74609375px]"
                              : rank === 2
                                ? "border-[#EEE] [background:linear-gradient(90deg,rgba(238,238,238,0.50)_3.56%,rgba(238,238,238,0.30)_47.88%,rgba(238,238,238,0.50)_98.11%)] backdrop-blur-[1.74609375px]"
                                : rank === 3
                                  ? "border-[#D9B288] [background:linear-gradient(90deg,rgba(217,178,136,0.50)_3.56%,rgba(217,178,136,0.20)_47.88%,rgba(217,178,136,0.50)_98.11%)] backdrop-blur-[1.74609375px]"
                                  : is_current && rank > 3
                                    ? "bg-[rgb(212,181,136)] text-[rgb(98,59,20)] backdrop-blur-[1.74609375px]"
                                    : "border-[#F4CF8B] [background:linear-gradient(353deg,rgba(192,155,100,0.41)_-40.83%,rgba(192,155,100,0)_118.76%)]"
                            }
                            text-[clamp(8px,1.8vw,12px)] font-semibold
                            ${is_current && rank > 3 ? "text-[rgb(98,59,20)]" : "text-white"}
                          `}
                        >
                          <div className="relative flex items-center gap-4 col-span-2 ps-[5%] h-full ">
                            {rank === 1 ? (
                              <img src="/gamehub/rank1.svg" alt="Gold medal" className="w-[15%]" />
                            ) : rank === 2 ? (
                              <img src="/gamehub/rank2.svg" alt="Silver medal" className="w-[15%]" />
                            ) : rank === 3 ? (
                              <img src="/gamehub/rank3.svg" alt="Bronze medal" className="w-[15%]" />
                            ) : (
                              <span className="w-[20%] text-center">{rank}</span>
                            )}

                            <div className="relative w-[60%] h-full  flex items-center overflow-hidden">
                              <span className={` ${user.length > 20 ? "animate-marquee whitespace-nowrap inline-block" : "truncate block"}`} >
                                {user}
                              </span>
                            </div>
                            <div className={`absolute w-[2.5%] ${rank === 1
                              ? "bg-[#F7CB45]"
                              : rank === 2
                                ? "bg-[#EEEEEE]"
                                : rank === 3
                                  ? "bg-[#BB9986]"
                                  : is_current && rank > 3
                                    ? "bg-[#fcffac]"
                                    : "bg-[#5f5954]"
                              } h-[99%] left-0 bottom-0`}
                            />
                          </div>

                          <div className="text-center">{total_points}</div>
                          <div className="text-center">{wins}</div>
                          <div className="text-center">{streak}</div>
                        </div>
                      )
                    )}
                  </div>

                </div>
                <div className={`flex justify-end items-end sm:justify-end sm:item-center w-[calc(285/375*100vw)] h-[calc(21/812*100vh)]`}>
                  <div className="group flex items-center gap-0.5 lg:gap-1 cursor-pointer transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0_0_10px_#facc15]"
                    onClick={() => {
                      setCurrentTab("gameplay");
                      router.push("/game-rules#point-system");
                    }}
                  >
                    <span className="text-[clamp(8px,2.2vw,14px)] font-normal text-white "> Points System </span>
                    <img src="/gamehub/arrow_right.svg" alt="right arrow icon" className="w-2 sm:w-3 md:w-4 xl:w-5 2xl:w-6" />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center items-center border-2 border-[#D4B588]/50 rounded-md w-[calc(321/375*100vw)] h-[calc(54/812*100vh)]">
              <img src={'/gamehub/statsBgMobile.png'} alt="Stats Background" className="absolute w-full h-full" />
              <div className="absolute flex justify-center items-center w-[calc(285/375*100vw)] h-[calc(60/812*100vh)]" onClick={() => router.push("/statistics")}>
                <div className="flex items-center justify-between w-[calc(122/375*100vw)]">
                  <img src="/gamehub/searchStats.svg" alt="Stats Background" className="w-[calc(22/375*100vw)] h-[calc(20.9/812*100vh)]" />
                  <span className="text-[clamp(15px,2.8vw,24px)] font-bold text-white "> My Statistics </span>
                </div>
              </div>
            </div>
            <div className=" flex justify-center items-center rounded-md w-[calc(321/375*100vw)] h-[calc(30/812*100vh)]"> </div>
          </div>
        </div>
      </div>
    </>

  ) : (
    <div className={`flex ${isCollapsed ? " w-[calc(1392/1440*100vw)]" : "w-[calc(1264/1440*100vw)]"} h-full justify-center items-center`}>
      <BeatLoader color="white" />
    </div>
  );
};

export default GameHub;
