"use client";
import React, { useContext, useEffect, useState } from "react";
import { routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";
import StatisticsCards from "./StatisticsCard";
import api from "@/lib/axios";
import { handleApiError } from "@/lib/errorHandler";
import { AppContext } from "../context/AppContext";

interface MainStats {
  ranking: number | null;
  points: number;
  wins: number;
  streak: number;
  hints: number;
  lives: number;
}

interface TournamentStats {
  wins: number;
  top_3: number;
  top_10: number;
  top_100: number;
  best_position: number;
}

interface RankingStats {
  current_rank: number;
  best_rank: number;
}

interface OtherStats {
  number_of_tournaments: number;
  total_hours_played: number;
  average_time_per_riddle: number;
  total_hints: number;
  total_lives: number;
}

export interface StatsResponse {
  main_stats: MainStats;
  tournaments: TournamentStats;
  ranking_stats: RankingStats;
  other: OtherStats;
}

type TournamentKey = keyof TournamentStats;
type RankingKey = keyof RankingStats;
type OtherKey = keyof OtherStats;


const MyStatistics: React.FC = () => {
  const [statsData, setStatsData] = useState<StatsResponse | null>(null);
  const { isCollapsed } = useContext(AppContext)!;

  const tournamentStats: {
    label: string;
    key: TournamentKey;
  }[] = [
      { label: "Wins", key: "wins" },
      { label: "Top 3", key: "top_3" },
      { label: "Top 10", key: "top_10" },
      { label: "Top 100", key: "top_100" },
      { label: "Best Position", key: "best_position" },
    ];

  const rankingStats: {
    label: string;
    key: RankingKey;
  }[] = [
      { label: "Current Rank", key: "current_rank" },
      { label: "Best Rank", key: "best_rank" },
    ];

  const otherStats: {
    label: string;
    key: OtherKey;
  }[] = [
      { label: "Number of Tournaments", key: "number_of_tournaments" },
      { label: "Total Hours Played", key: "total_hours_played" },
      { label: "Average Time per Riddle", key: "average_time_per_riddle" },
      { label: "Total Hints", key: "total_hints" },
      { label: "Total Lives", key: "total_lives" },
    ];

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const res = await api.get("stats/");
        if (res.data.status === 200) {
          setStatsData(res.data.data);
        }
      } catch (err) {
        console.error(err);
        handleApiError(err, "Failed to load statistics. Please try again.");
      }
    };

    fetchStatsData();
  }, []);

  return (
    <>
      <div className="hidden sm:block">
        <div className={`flex flex-col items-center gap-2 overflow-auto ${isCollapsed ? " w-[calc(1392/1440*100vw)]" : "w-[calc(1312/1440*100vw)]"} `}>
          <div className={`flex flex-col gap-2 overflow-auto ${isCollapsed ? " w-[calc(1265/1440*100vw)]" : "w-[calc(1137/1440*100vw)]"} `}>
            <div className={`flex flex-col gap-1 ${isCollapsed ? "w-[calc(1265/1440*100vw)]" : "w-[calc(1137/1440*100vw)]"}`}>
              <div className="inline-block">
                <Link
                  href={routes.ui.gamehub}
                  className="inline-flex items-center gap-1 py-1.5 rounded-md transition-all duration-200 cursor-pointer hover:drop-shadow-[0_0_5px_#facc15]"
                >
                  <Image
                    src="/clash/arrow_back.svg"
                    alt="Back Icon"
                    height={16}
                    width={16}
                  />
                  <p
                    className="whitespace-nowrap text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-sm 2xl:text-base font-medium text-[#898989] "
                  >
                    BACK
                  </p>
                </Link>
              </div>

              <div className="flex justify-between items-baseline w-full flex-wrap">
                <h2 className="text-white text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-medium">
                  My Statistics
                </h2>
              </div>
            </div>
            <div className="bg-no-repeat bg-cover border border-[#B3B3B3]/50 rounded">
              <div className="grid grid-cols-6 py-5 relative border-b border-[#947c5b] aspect-[1083/124] bg-[url('/statistics/Header.png')] bg-no-repeat bg-cover">
                {[
                  { label: "Ranking", value: statsData?.main_stats.ranking ?? "-" },
                  { label: "Points", value: statsData?.main_stats.points || "-" },
                  { label: "Wins", value: statsData?.main_stats.wins || "-" },
                  { label: "Streak", value: statsData?.main_stats.streak || "-" },
                  { label: "Hints", value: statsData?.main_stats.hints || "-" },
                  { label: "Lives", value: statsData?.main_stats.lives || "-" },
                ].map((stat, key) => (
                  <div
                    key={key}
                    className="flex flex-col justify-center items-center relative after:content-[''] after:absolute after:right-0 after:top-0 after:h-full after:w-[2px] after:bg-gradient-to-b after:from-[rgba(40,32,22,0)] after:via-[#D4B588] after:to-[rgba(40,32,22,0)] after:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] last:after:hidden"
                  >
                    <p className="text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-[#E2AC5D] font-Freeman font-normal">
                      {stat.value}
                    </p>
                    <p className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base text-[#D1D1D1] font-normal">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 mt-5 pb-1.5 border-b border-[#947c5b]">
                <p className="text-lg font-bold text-white pl-4">Tournaments</p>
                <p className="text-lg font-bold text-white pl-4">Ranking</p>
                <p className="text-lg font-bold text-white pl-4">Other</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 mt-1.5 gap-1.5 relative">
                <div className="flex flex-col gap-1">
                  {[
                    { label: "Wins", value: statsData?.tournaments.wins || "-" },
                    { label: "Top 3", value: statsData?.tournaments.top_3 || "-" },
                    { label: "Top 10", value: statsData?.tournaments.top_10 || "-" },
                    {
                      label: "Top 100",
                      value: statsData?.tournaments.top_100 || "-",
                    },
                    {
                      label: "Best Position",
                      value: statsData?.tournaments.best_position || "-",
                    },
                  ].map((stat, key) => {
                    return (
                      <StatisticsCards key={key}>
                        <div className="flex justify-between items-center">
                          <p className="font-normal text-lg text-white">
                            {stat.label}
                          </p>
                          <div className="absolute top-0 bottom-0 right-30 w-[2px] tapered-line" />
                          <p className="text-3xl px-7 text-[#E2AC5D] font-normal">
                            {stat.value}
                          </p>
                        </div>
                      </StatisticsCards>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-1">
                  {[
                    {
                      label: "Current Rank",
                      value: statsData?.ranking_stats.current_rank || "-",
                    },
                    {
                      label: "Best Rank",
                      value: statsData?.ranking_stats.best_rank || "-",
                    },
                  ].map((stat, key) => {
                    return (
                      <StatisticsCards key={key}>
                        <div className="flex justify-between items-center">
                          <p className="font-normal text-lg text-white">
                            {stat.label}
                          </p>
                          <div className="absolute top-0 bottom-0 right-30 w-[2px] tapered-line" />
                          <p className="text-3xl px-7 text-[#E2AC5D] font-normal">
                            {stat.value}
                          </p>
                        </div>
                      </StatisticsCards>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-1">
                  {[
                    {
                      label: "Number of Tournaments",
                      value: statsData?.other.number_of_tournaments || "-",
                    },
                    {
                      label: "Total Hours",
                      value: statsData?.other.total_hours_played || "-",
                    },
                    {
                      label: "Average Time Per Riddle",
                      value: statsData?.other.average_time_per_riddle || "-",
                    },
                    {
                      label: "Total Hints",
                      value: statsData?.other.total_hints || "-",
                    },
                    {
                      label: "Total Lives",
                      value: statsData?.other.total_lives || "-",
                    },
                  ].map((stat, key) => {
                    return (
                      <StatisticsCards key={key}>
                        <div className="flex justify-between items-center">
                          <p className="font-normal text-lg text-white">
                            {stat.label}
                          </p>
                          <div className="absolute top-0 bottom-0 right-30 w-[2px] tapered-line" />
                          <p className="text-3xl px-7 text-[#E2AC5D] font-normal">
                            {stat.value}
                          </p>
                        </div>
                      </StatisticsCards>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block sm:hidden w-[calc(375/375*100vw)]  h-[calc(600/812*100vh)] overflow-y-auto">
        <div className={`flex flex-col items-center w-[calc(375/375*100vw)] `}>
          <div className={`flex flex-col justify-center items-center w-[calc(375/375*100vw)]  gap-[calc(18/845*100vh)] `}>
            <div className={"flex flex-col w-[calc(321/375*100vw)] h-[58/812*100vh)]"}>
              <div className="inline-block h-[11/812*100vh)]">
                <Link
                  href={routes.ui.gamehub}
                  className="inline-flex items-center gap-1 rounded-md transition-all duration-200 cursor-pointer hover:drop-shadow-[0_0_5px_#facc15]"
                >
                  <Image
                    src="/statistics/backArrow.svg"
                    alt="Back Icon"
                    height={11.67}
                    width={6.87}
                  />
                  <p
                    className="whitespace-nowrap text-[clamp(8px,20vw,14px)] text-[#cc9a53] font-semibold"
                  >
                    BACK
                  </p>
                </Link>
              </div>

              <div className="flex justify-between items-baseline w-[calc(321/375*100vw)] h-[calc(23/812*100vh)] flex-wrap">
                <h2 className="text-white text-[clamp(10px,20vw,18px)]  font-bold">
                  My Statistics
                </h2>
              </div>
            </div>
            <div className="relative w-[calc(321/375*100vw)] h-[calc(134/812*100vh)] rounded-md border-2 border-[#D4B588]/50">
              <img src="/statistics/statsHome.png" alt="Statistics" className="absolute w-full h-full object-cover rounded-md" />
              <div className="flex justify-between items-center absolute w-[calc(321/375*100vw)] h-[calc(130/812*100vh)]  ">
                <div className="flex flex-col justify-between w-[calc(102/375*100vw)] h-[calc(130/812*100vh)] ">
                  <div className="flex flex-col items-center justify-center w-[calc(102/375*100vw)] h-[calc(63/812*100vh)] ">
                    <div className="h-[calc(25/812*100vh)] w-[calc(102/375*100vw)] flex flex-col items-center justify-between">
                      <p className="text-[clamp(12px,3.5vw,20px)] font-bold text-[#E2AC5D]">
                        {statsData?.main_stats.ranking ?? "-"}
                      </p>
                      <p className="text-[clamp(12px,2.8vw,24px)] font-bold text-white">
                        Ranking
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-[calc(102/375*100vw)] h-[calc(63/812*100vh)] ">
                    <div className="h-[calc(25/812*100vh)] w-[calc(102/375*100vw)] flex flex-col items-center justify-between">
                      <p className="text-[clamp(12px,3.5vw,20px)] font-bold text-[#E2AC5D]">
                        {statsData?.main_stats.streak ?? "-"}
                      </p>
                      <p className="text-[clamp(12px,2.5vw,24px)] font-bold text-white">
                        Streak
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between w-[calc(102/375*100vw)] h-[calc(130/812*100vh)] ">
                  <div className="flex flex-col items-center justify-center w-[calc(102/375*100vw)] h-[calc(63/812*100vh)] ">
                    <div className="h-[calc(25/812*100vh)] w-[calc(102/375*100vw)] flex flex-col items-center justify-between">
                      <p className="text-[clamp(12px,3.5vw,20px)] font-bold text-[#E2AC5D]">
                        {statsData?.main_stats.points ?? "-"}
                      </p>
                      <p className="text-[clamp(12px,2.8vw,24px)] font-bold text-white">
                        Points
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-[calc(102/375*100vw)] h-[calc(63/812*100vh)] ">
                    <div className="h-[calc(25/812*100vh)] w-[calc(102/375*100vw)] flex flex-col items-center justify-between">
                      <p className="text-[clamp(12px,3.5vw,20px)] font-bold text-[#E2AC5D]">
                        {statsData?.main_stats.lives ?? "-"}
                      </p>
                      <p className="text-[clamp(12px,2.5vw,24px)] font-bold text-white">
                        Lives
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between w-[calc(102/375*100vw)] h-[calc(130/812*100vh)] ">
                  <div className="flex flex-col items-center justify-center w-[calc(102/375*100vw)] h-[calc(63/812*100vh)] ">
                    <div className="h-[calc(25/812*100vh)] w-[calc(102/375*100vw)] flex flex-col items-center justify-between">
                      <p className="text-[clamp(12px,3.5vw,20px)] font-bold text-[#E2AC5D]">
                        {statsData?.main_stats.wins ?? "-"}
                      </p>
                      <p className="text-[clamp(12px,2.8vw,24px)] font-bold text-white">
                        Wins
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center w-[calc(102/375*100vw)] h-[calc(63/812*100vh)] ">
                    <div className="h-[calc(25/812*100vh)] w-[calc(102/375*100vw)] flex flex-col items-center justify-between">
                      <p className="text-[clamp(12px,3.5vw,20px)] font-bold text-[#E2AC5D]">
                        {statsData?.main_stats.hints ?? "-"}
                      </p>
                      <p className="text-[clamp(12px,2.5vw,24px)] font-bold text-white">
                        Hints
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[calc(321/375*100vw)] h-[calc(192/812*100vh)] rounded-md border-2 border-[#D4B588]/50">
              <div className="flex justify-center items-center bg-[#4a1e04] border-b-2 rounded-t-sm border-[#D4B588]/50 w-[calc(316.30/375*100vw)] h-[calc(30/812*100vh)] ">
                <div className="flex items-center gap-[calc(10/375*100vw)] w-[calc(281/375*100vw)] h-[calc(30/812*100vh)] ">
                  <img src={"/statistics/trophyStats.svg"} width={12.5} height={12.5} />
                  <p className="text-[clamp(12px,3.0vw,20px)] font-bold text-white">
                    TOURNAMENTS
                  </p>
                </div>
              </div>
              <div className="relative flex flex-col justify-between items-center w-[calc(316.5/375*100vw)] h-[calc(158/812*100vh)]">
                <img src="/statistics/tournamentStatsBg.png" alt="Statistics" className="absolute w-full h-full object-cover rounded-b-md" />
                {tournamentStats.map((item, index) => (
                  <div key={index} className="flex flex-col items-center justify-center w-[calc(316.5/375*100vw)] h-[calc(32/812*100vh)] z-10">
                    <div className="flex justify-between items-center w-[calc(275/375*100vw)] h-[calc(32/812*100vh)]" >
                      <p className="text-[clamp(12px,4vw,24px)] font-bold text-white">
                        {item.label}
                      </p>
                      <p className="text-[clamp(12px,4vw,20px)] font-semibold text-[#E2AC5D]">
                        {statsData?.tournaments?.[item.key] || "-"}
                      </p>
                    </div>
                    <img src="/statistics/LineEnd.png" alt="End Line" className="w-[calc(316.5/375*100vw)] h-[calc(2/812*100vh)]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[calc(321/375*100vw)] h-[calc(96/812*100vh)] rounded-md border-2 border-[#D4B588]/50">
              <div className="flex justify-center items-center bg-[#4a1e04] border-b-2 border-[#D4B588]/50 rounded-t-md w-[calc(316/375*100vw)] h-[calc(30/812*100vh)] ">
                <div className="flex items-center gap-[calc(10/375*100vw)] w-[calc(281/375*100vw)] h-[calc(30/812*100vh)] ">
                  <img src={"/statistics/ranking.svg"} width={12.5} height={12.5} />
                  <p className="text-[clamp(12px,3.0vw,20px)] font-bold text-white">
                    RANKING
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between items-center relative w-[calc(316.5/375*100vw)] h-[calc(64/812*100vh)]">
                <img src="/statistics/rankingStatsBg.png" alt="Statistics" className="absolute w-full h-full rounded-b-md" />
                {rankingStats.map((item, index) => (
                  <div key={index} className="flex flex-col items-center justify-center w-[calc(316.5/375*100vw)] h-[calc(32/812*100vh)] z-10">
                    <div className="flex justify-between items-center w-[calc(275/375*100vw)] h-[calc(32/812*100vh)]" >
                      <p className="text-[clamp(12px,3.5vw,20px)] font-bold text-white">
                        {item.label}
                      </p>
                      <p className="text-[clamp(12px,4vw,20px)] font-semibold text-[#E2AC5D]">
                        {statsData?.ranking_stats?.[item.key] || "-"}
                      </p>
                    </div>
                    <img src="/statistics/LineEnd.png" alt="End Line" className="w-[calc(316.5/375*100vw)] h-[calc(2/812*100vh)]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[calc(321/375*100vw)] h-[calc(192/812*100vh)] rounded-md border-2 border-[#D4B588]/50">
              <div className="flex justify-center items-center bg-[#4a1e04] border-b-2 border-[#D4B588]/50 rounded-t-md w-[calc(316.3/375*100vw)] h-[calc(30/812*100vh)] ">
                <div className="flex items-center gap-[calc(10/375*100vw)] w-[calc(281/375*100vw)] h-[calc(30/812*100vh)] ">
                  <img src={"/statistics/others.svg"} width={12.5} height={12.5} />
                  <p className="text-[clamp(12px,3.0vw,20px)] font-bold text-white">
                    OTHER
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between items-center relative w-[calc(316.5/375*100vw)] h-[calc(158/812*100vh)]">
                <img src="/statistics/tournamentStatsBg.png" alt="Statistics" className="absolute w-full h-full object-cover" />

                {otherStats.map((item, index) => (
                  <div key={index} className="flex flex-col items-center justify-center w-[calc(316.5/375*100vw)] h-[calc(32/812*100vh)] z-10 ">
                    <div className="flex justify-between items-center w-[calc(275/375*100vw)] h-[calc(32/812*100vh)]" >
                      <p className="text-[clamp(12px,3.5vw,20px)] font-bold text-white">
                        {item.label}
                      </p>
                      <p className="text-[clamp(12px,4vw,20px)] font-semibold text-[#E2AC5D]">
                        {statsData?.other?.[item.key] || "-"}
                      </p>
                    </div>
                    <img src="/statistics/LineEnd.png" alt="End Line" className="w-[calc(316.5/375*100vw)] h-[calc(2/812*100vh)]" />
                  </div>
                ))}
              </div>
                            <div className="flex flex-col justify-between items-center relative w-[calc(316.5/375*100vw)] h-[calc(28/812*100vh)]">
</div>
            </div>
          </div >
        </div >
      </div >
    </>
  );
};

export default MyStatistics;
