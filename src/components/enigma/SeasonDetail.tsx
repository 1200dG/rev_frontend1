"use client";
import { routes } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";
import {
  Column,
  SeasonApiData,
  SeasonDetailProps,
  SeasonRiddle,
  SeasonLevelProgress,
} from "@/lib/types/common/types";
import { useState, useEffect } from "react";
import { getActiveSeasonLevels } from "@/lib/services/seasonActions";
import { BeatLoader } from "react-spinners";
import { handleApiError } from "@/lib/errorHandler";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/lib/hooks/useAppContext";

const SeasonRiddleTable = ({
  data,
  columns,
  selectedRowIndex,
  setSelectedRowIndex,
}: {
  data: SeasonRiddle[];
  columns: Column<SeasonRiddle>[];
  selectedRowIndex: number | null;
  setSelectedRowIndex: (index: number | null) => void;
}) => {
  const { isCollapsed } = useAppContext();
  const visibleColumns = columns.filter(col => ['level', 'title', 'status'].includes(col.accessor))
  return (
    <>
      <div className="hidden sm:block">
        <div className={`relative ${isCollapsed ? " w-[calc(1016/1440*100vw)]" : "w-[calc(913.55/1440*100vw)]"} h-[calc(552/900*100vh)] flex flex-col border border-[#D4B588] rounded-md overflow-hidden`}>
          <div className="grid grid-cols-6 items-center w-full h-[8.2%] bg-transparent border-b border-[#D4B588]">
            {columns.map((col, index) => (
              <div key={index} className={`${col.accessor === "title" ? "col-span-2 text-left" : "text-center"} `}>
                <span className="uppercase font-medium text-sm text-white"> {col.header} </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center overflow-y-auto h-[91.7%] [scrollbar-width:none]">
            {data.map((row, rowIndex) => {
              const isNextRiddle = row.status === "current";
              return (
                <div key={rowIndex}
                  onClick={() => setSelectedRowIndex(
                    selectedRowIndex === rowIndex ? null : rowIndex
                  )
                  }
                  className={`grid grid-cols-6 justify-center items-center w-full min-h-[40px] cursor-pointer border-b border-[#8282821F]
                ${selectedRowIndex === rowIndex && !isNextRiddle
                      ? row.status === "locked"
                        ? "bg-[#8282821F]"
                        : "bg-[#49A45975]"
                      : row.status === "completed"
                        ? "bg-[#0B9A362E]"
                        : isNextRiddle
                          ? "bg-[#D4B588]"
                          : "bg-transparent"
                    }
              `}
                >
                  {columns.map((col, colIndex) => (
                    <div
                      key={colIndex}
                      className={`${col.accessor === "title" ? "col-span-2 text-left" : "text-center"} 
                        ${selectedRowIndex === rowIndex && !isNextRiddle
                          ? col.accessor === "status"
                            ? "text-white font-medium"
                            : "text-[#D1D1D1]"
                          : isNextRiddle
                            ? "text-black"
                            : "text-[#D1D1D1]"
                        }`}
                    >
                      {col.render ? col.render(row[col.accessor], row) : String(row[col.accessor])}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="block sm:hidden w-full h-full">
        <div className={`relative w-full h-full flex flex-col border-2 border-[#D4B588]/50 rounded-md overflow-hidden`}>
          <div className="grid grid-cols-3 items-center w-full h-[calc(32/812*100vh)] border-b-2 border-[#D4B588]/50 bg-[#3e1600]">
            {visibleColumns.map((col, index) => (
              <div key={index} className="flex items-center justify-center" >
                <span className="text-center uppercase font-medium text-sm text-white"> {col.header} </span>
              </div>
            ))}
          </div>
          <div className="flex-1 flex-col items-center overflow-y-auto w-full bg-[#3e231d] [scrollbar-width:none]">
            {data.map((row, rowIndex) => {
              const isNextRiddle = row.status === "current";
              return (
                <div
                  key={rowIndex}
                  onClick={() => setSelectedRowIndex( selectedRowIndex === rowIndex ? null : rowIndex )}
                  className={`grid grid-cols-3 justify-center items-center w-full h-[calc(41/812*100vh)] cursor-pointer border-b-2 border-[#6f3f34]/50
                  ${selectedRowIndex === rowIndex && !isNextRiddle
                      ? row.status === "locked"
                        ? "bg-[#8282821F]"
                        : "bg-[#49A45975]"
                      : row.status === "completed"
                        ? "bg-[#14471A]"
                        : isNextRiddle
                          ? "bg-[#D4B588]"
                          : "bg-transparent"
                    }
                `}
                >
                  {visibleColumns.map((col, colIndex) => {
                    const value = row[col.accessor];
                    const isSecondColumn = colIndex === 1;
                    const isLongText = typeof value === "string" && value.length > 12;

                    return (
                      <div
                        key={colIndex}
                        className={`text-center
                          ${selectedRowIndex === rowIndex && !isNextRiddle
                            ? col.accessor === "status"
                              ? "text-white font-medium"
                              : "text-[#D1D1D1]"
                            : isNextRiddle
                              ? "text-black"
                              : "text-[#D1D1D1]"
                          }`}
                      >
                        {isSecondColumn ? (
                          <div className="relative overflow-hidden w-full">
                            <div className={`whitespace-nowrap ${isLongText ? "animate-marquee" : ""}`}>
                              <span className="uppercase text-[12px]">
                                {col.render ? col.render(value, row) : String(value)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          col.render ? col.render(value, row) : String(value)
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            {data.length > 5 &&
              [0, 1].map((i) => (
                <div key={`empty-mobile-${i}`} className="grid grid-cols-3 justify-center items-center w-full h-[calc(41/812*100vh)] bg-[#482E1D]/20" >
                  {visibleColumns.map((col, colIndex) => (
                    <div key={colIndex} className="text-center text-[#FFFFFF80]">
                      &nbsp;
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

const SeasonDetail: React.FC<SeasonDetailProps> = ({ seasonId }) => {
  const [seasonData, setSeasonData] = useState<SeasonApiData | null>(null);
  const [riddleData, setRiddleData] = useState<SeasonRiddle[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const { setPreviousUrl } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [seasonStats, setSeasonStats] = useState<{
    averageTime: string;
    points: number;
    ranking: number;
  } | null>(null);
  const seasonDetailUrl = usePathname();
  const { isCollapsed } = useAppContext();
  const route = useRouter();

  useEffect(() => {
    fetchSeasonData();
  }, [seasonId]);

  useEffect(() => {
    if (!seasonDetailUrl) return;
    setPreviousUrl(seasonDetailUrl);
  }, []);

  const fetchSeasonData = async () => {
    try {
      const activeSeasonData = await getActiveSeasonLevels();

      setSeasonData({
        id: activeSeasonData.season_id,
        title: activeSeasonData.season_title,
        status: "active",
        start_date: "",
        end_date: "",
      });

      setSeasonStats({
        averageTime: activeSeasonData.average_time,
        points: activeSeasonData.points,
        ranking: activeSeasonData.ranking,
      });

      const transformedRiddles = transformSeasonLevelsWithProgress(
        activeSeasonData.detail
      );
      setRiddleData(transformedRiddles);
    } catch (error) {
      console.error("Error fetching active season data:", error);
      handleApiError(error, "Failed to fetch season data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const transformSeasonLevelsWithProgress = (
    levelProgress: SeasonLevelProgress[]
  ): SeasonRiddle[] => {
    const transformedLevels: SeasonRiddle[] = [];
    const firstNotCompletedIndex = levelProgress.findIndex(
      (level) => level.status === "not_completed"
    );

    levelProgress.forEach((level, index) => {
      let status: string;
      let title: string;
      let lives: string;
      let hints: string;

      if (level.status === "completed") {
        status = "completed";
        title = level.title;
        lives = level.lives.toString();
        hints = level.hints.toString();
      } else if (index === firstNotCompletedIndex) {
        status = "current";
        title = level.title;
        lives = "-";
        hints = "-";
      } else {
        status = "locked";
        title = "-";
        lives = "-";
        hints = "-";
      }

      transformedLevels.push({
        level: level.level.toString(),
        title,
        lives,
        hints,
        status,
        riddleId: status !== "locked" ? level.id : undefined,
      });
    });

    return transformedLevels;
  };

  const getPlayButtonLevel = () => {
    if (selectedRowIndex !== null) {
      const selected = riddleData[selectedRowIndex];
      if (selected && selected.status !== "locked" && selected.level) {
        return selected.level;
      }
    }
    const currentRiddle = riddleData.find((r) => r.status === "current");
    return currentRiddle?.level || "0";
  };

  const getPlayRiddleId = () => {
    if (selectedRowIndex !== null) {
      const selected = riddleData[selectedRowIndex];
      if (selected && selected.status !== "locked" && selected.level) {
        return selected.level;
      }
    }
    const currentRiddle = riddleData.find((r) => r.status === "current");
    return currentRiddle?.level;
  };

  const getPlayButtonHref = () => {
    const levelNumber = getPlayRiddleId();
    if (levelNumber) {
      return `${routes.ui.enigma.seasonPlay(seasonId)}?levelNumber=${levelNumber}`;
    }
    return routes.ui.enigma.seasonDetail(seasonId);
  };

  const isPlayButtonDisabled = () => {
    const chosenRiddleId = getPlayRiddleId();
    return !chosenRiddleId;
  };

  const isSelectedRiddleLocked = () => {
    if (selectedRowIndex !== null && riddleData[selectedRowIndex]) {
      return riddleData[selectedRowIndex].status === "locked";
    }
    return false;
  };

  const getCurrentRiddleLevel = () => {
    const currentRiddle = riddleData.find((r) => r.status === "current");
    return currentRiddle?.level || "0";
  };

  const getSeasonRiddleColumns = (): Column<SeasonRiddle>[] => [
    { header: "LEVEL", accessor: "level" },
    { header: "TITLE", accessor: "title" },
    { header: "LIVES", accessor: "lives" },
    { header: "HINTS", accessor: "hints" },
    {
      header: "STATUS",
      accessor: "status",
      render: (value, row) => {
        const rowIndex = riddleData.findIndex((r) => r === row);
        const isRowSelected = selectedRowIndex === rowIndex;

        return (
          <div className="flex justify-center">
            {value === "completed" ? (
              <Image
                src={isRowSelected ? "/enigma/check_circle_1.svg" : "/enigma/check_circle.svg"}
                alt="Completed"
                width={20}
                height={20}
              />
            ) : value === "current" ? (
              <Image src="/enigma/key.svg" alt="Current" width={24} height={24} />
            ) : value === "locked" ? (
              <Image src={selectedRowIndex === rowIndex ? "/enigma/lock2.svg" : "/enigma/lock.svg"} alt="Locked" width={16} height={16} />
            ) : (
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            )}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center absolute inset-0 z-50 overflow-hidden">
        <BeatLoader color="white" />
      </div>
    );
  }

  if (!seasonData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Season not found
      </div>
    );
  }

  return (
    <>
      <div className="hidden sm:block">
        <div className={`flex flex-col items-center justify-between ${isCollapsed ? " w-[calc(1392/1440*100vw)]" : "w-[calc(1312/1440*100vw)]"} h-[calc(660/900*100vh)]`}>
          <div className={`flex flex-col justify-between ${isCollapsed ? " w-[calc(1269.5/1440*100vw)]" : "w-[calc(1141.5/1440*100vw)]"} h-[calc(86/900*100vh)]`}>
            <div>
              <Link href={routes.ui.gamehub} className="inline-flex items-center gap-1 py-1 rounded-md transition-all duration-300 hover:drop-shadow-[0_0_5px_#facc15] hover:scale-105" >
                <img src="/clash/arrow_back.svg" alt="Back Icon" height={14} width={14} />
                <p className="text-sm font-medium text-[#898989] will-change-transform">BACK</p>
              </Link>
            </div>

            <div className="flex justify-between items-baseline w-full flex-wrap">
              <p className="text-white text-4xl font-medium">{seasonData.title}</p>
            </div>
            <p className="text-[#D1D1D1] text-sm"> You are currently on Level {getCurrentRiddleLevel()} </p>
          </div>
          <div className={`flex justify-between ${isCollapsed ? " w-[calc(1269.5/1440*100vw)]" : "w-[calc(1141.5/1440*100vw)]"} h-[calc(552/900*100vh)]`}>
            <div className={`${isCollapsed ? " w-[calc(1016/1440*100vw)]" : "w-[calc(913.55/1440*100vw)]"} h-[calc(552/900*100vh)]`}>
              <SeasonRiddleTable
                data={riddleData}
                columns={getSeasonRiddleColumns()}
                selectedRowIndex={selectedRowIndex}
                setSelectedRowIndex={setSelectedRowIndex}
              />
            </div>
            <div className={`flex flex-col ${isCollapsed ? " w-[calc(230/1440*100vw)]" : "w-[calc(206.80/1440*100vw)]"} h-[calc(552/900*100vh)] `}>
              <div className={`relative ${isCollapsed ? " w-[calc(230/1440*100vw)]" : "w-[calc(206.80/1440*100vw)]"} h-[calc(480/900*100vh)] bg-[url('/enigma/Overlay.png')] bg-no-repeat bg-cover flex flex-col border border-[#D4B588] rounded-md shadow-lg text-[#E2AC5D] enigma-card`}>
                <img src="/enigma/seasonOwl.svg" alt="Season Owl" className={`absolute -top-[7.8%] left-1/2 transform -translate-x-1/2 z-10 ${isCollapsed ? " w-[calc(104/1440*100vw)]" : "w-[calc(93.51/1440*100vw)]"} h-[calc(75/900*100vh)]`} />

                <div className={`relative flex flex-col justify-center items-center ${isCollapsed ? " w-[calc(230/1440*100vw)]" : "w-[calc(206.80/1440*100vw)]"} h-[calc(373/900*100vh)]`}>
                  <div className={` flex flex-col justify-end items-center ${isCollapsed ? " w-[calc(230/1440*100vw)]" : "w-[calc(205.02/1440*100vw)]"} h-[calc(122/900*100vh)]`}>
                    <div className="text-[12px] sm:text-[18px] md:text-[24px] lg:text-[28px] xl:text-[36px] 2xl:text-[36px] font-normal font-Freeman "> {seasonStats?.averageTime || "00:00"} </div>
                    <div className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] text-[#D1D1D1] "> Average time </div>
                    <div className={`h-[calc(2/900*100vh)] ${isCollapsed ? " w-[calc(230/1440*100vw)]" : "w-[calc(205.02/1440*100vw)]"} bg-[linear-gradient(90deg,rgba(40,32,22,0)_10%,#D4B588_50%,rgba(40,32,22,0)_89.9%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]`} />
                  </div>

                  <div className={`relative flex flex-col justify-end items-center ${isCollapsed ? " w-[calc(230/1440*100vw)]" : "w-[calc(205.02/1440*100vw)]"} h-[calc(102/900*100vh)]`}>
                    <div className="text-[12px] sm:text-[18px] md:text-[24px] lg:text-[28px] xl:text-[30px] 2xl:text-[36px] font-normal font-Freeman "> {seasonStats?.points || 0} </div>
                    <div className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] text-[#D1D1D1] "> Points </div>
                    <div className="h-[calc(2/900*100vh)] w-full bg-[linear-gradient(90deg,rgba(40,32,22,0)_10%,#D4B588_50%,rgba(40,32,22,0)_89.9%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                  </div>

                  <div className={`relative flex flex-col justify-end items-center ${isCollapsed ? " w-[calc(230/1440*100vw)]" : "w-[calc(205.02/1440*100vw)]"} h-[calc(106/900*100vh)]`}>
                    <div className="text-[12px] sm:text-[15px] md:text-[20px] lg:text-[25px] xl:text-[32px] 2xl:text-[36px] font-normal font-Freeman"> {seasonStats?.ranking || 0} </div>
                    <p className="text-[8px] sm:text-[10px] md:text-[8px] lg:text-[9px] xl:text-[10px] 2xl:text-[15px] text-[#D1D1D1]"> Ranking </p>
                    <div className="h-[calc(1.5/900*100vh)] w-full bg-[linear-gradient(90deg,rgba(40,32,22,0)_10%,#D4B588_50%,rgba(40,32,22,0)_89.9%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]" />
                  </div>

                  <Link href={routes.ui.leaderboard} className={`flex flex-col justify-end items-center text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] xl:text-[11px] 2xl:text-sm font-normal text-[#D1D1D1] ${isCollapsed ? " w-[calc(230/1440*100vw)]" : "w-[calc(205.02/1440*100vw)]"} h-[calc(43/900*100vh)] transition-colors duration-300 hover:text-[#F4CF8B]`} >
                    See Leaderboard →
                  </Link>
                </div>
                <div className={`absolute -bottom-[16%] left-1/2 transform -translate-x-1/2 z-10 ${isCollapsed ? " w-[calc(228/1440*100vw)]" : "w-[calc(205.02/1440*100vw)]"} h-[calc(150/900*100vh)] flex items-center justify-center play-button`}>
                  {isSelectedRiddleLocked() ? (
                    <div className="relative block cursor-default">
                      <div className="relative w-full h-full">
                        <Image src="/enigma/seasonPlay.svg" alt="Season Play Button" width={200} height={200} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image src="/enigma/lock2.svg" alt="Locked" width={45} height={45} />
                        </div>
                      </div>
                    </div>
                  ) : isPlayButtonDisabled() ? (
                    <div className="relative block cursor-not-allowed">
                      <div className="relative w-full h-full">
                        <Image src="/enigma/seasonPlay.svg" alt="Season Play Button" width={200} height={200} className="w-full h-full object-contain" />
                        <div className="absolute inset-0 flex justify-center items-center">
                          <span className="font-bold text-[10px] sm:text-[14px] md:text-[18px] lg:text-[22px] xl:text-[28px] 2xl:text-[36px] font-Farsan"> DONE </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* --- LIGHTER PLASMA BUTTON --- */
                    <Link href={getPlayButtonHref()} className="relative block cursor-pointer group rounded-full">
                      <div className="relative w-full h-full flex items-center justify-center">

                        {/* 1. Base Image - Scales Up smoothly on Hover */}
                        <Image
                          src="/enigma/seasonPlay.svg"
                          alt="Season Play Button"
                          width={200}
                          height={200}
                          className="cursor-pointer transition-transform duration-500 ease-out group-hover:scale-110 z-10 relative"
                        />

                        {/* 2. PLASMA RING OVERLAY */}
                        <div className="absolute inset-[-18%] pointer-events-none z-20 w-[136%] h-[136%] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <svg className="w-full h-full plasma-glow-light" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              {/* LIGHTER GRADIENT: Royal Blue -> Cyan -> White -> Cyan -> Royal Blue */}
                              <linearGradient id="light-plasma-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#0044cc" stopOpacity="0" />
                                <stop offset="20%" stopColor="#0088ff" stopOpacity="1" />
                                <stop offset="50%" stopColor="#e0ffff" stopOpacity="1" />
                                <stop offset="80%" stopColor="#0088ff" stopOpacity="1" />
                                <stop offset="100%" stopColor="#0044cc" stopOpacity="0" />
                              </linearGradient>

                              {/* TURBULENCE FILTER */}
                              <filter id="plasma-noise" x="-20%" y="-20%" width="140%" height="140%">
                                <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
                                <feGaussianBlur stdDeviation="0.5" />
                              </filter>
                            </defs>

                            {/* RING 1: Main Ring */}
                            <circle
                              cx="50" cy="50" r="44"
                              fill="none"
                              stroke="url(#light-plasma-gradient)"
                              strokeWidth="4"
                              className="animate-plasma-cw"
                              filter="url(#plasma-noise)"
                            />

                            {/* RING 2: Inner Ring */}
                            <circle
                              cx="50" cy="50" r="42"
                              fill="none"
                              stroke="url(#light-plasma-gradient)"
                              strokeWidth="2"
                              className="animate-plasma-ccw"
                              filter="url(#plasma-noise)"
                              opacity="0.7"
                            />
                          </svg>
                        </div>

                        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none transition-transform duration-500 group-hover:scale-110">
                          <div className="text-[12px] sm:text-[18px] md:text-[24px] lg:text-[28px] xl:text-[36px] 2xl:text-[48px] font-bold leading-none drop-shadow-lg bg-gradient-to-br from-[#EAC999] to-[#999999] bg-clip-text text-transparent transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(0,200,255,0.8)]">
                            {getPlayButtonLevel()}
                          </div>
                          <div className="text-[8px] sm:text-[10px] md:text-[13px] lg:text-[17px] xl:text-[23px] 2xl:text-[30px] font-black drop-shadow-lg bg-gradient-to-b from-[#EAC999] to-[#999999] bg-clip-text text-transparent transition-all duration-300 group-hover:text-white">
                            Play
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block sm:hidden w-[calc(375/375*100vw)]  h-[calc(600/812*100vh)] overflow-y-auto">
        <div className={`flex flex-col items-center w-[calc(375/375*100vw)] `}>
          <div className={`flex flex-col justify-center items-center w-[calc(375/375*100vw)]  gap-[calc(18/845*100vh)] `}>
            <div className={`flex flex-col justify-between w-[calc(321/375*100vw)] h-[calc(78/812*100vh)]`}>
              <div>
                <Link href={routes.ui.gamehub} className="inline-flex items-center gap-1 h-[calc(13/1033*100vh)] w-[calc(321/375*100vw)] rounded-md transition-all duration-300 hover:drop-shadow-[0_0_5px_#facc15] hover:scale-105" >
                  <img src="/statistics/backArrow.svg" alt="Back Icon" height={11.67} width={6.87} />
                  <p className="whitespace-nowrap text-[clamp(8px,20vw,14px)] text-[#cc9a53] font-semibold">  BACK </p>
                </Link>
              </div>

              <div className="flex items-baseline w-full flex-wrap">
                <p className="text-white text-3xl font-medium">{seasonData.title}</p>
              </div>
              <p className="text-[#cc9a53] text-sm"> You are currently on Level {getCurrentRiddleLevel()} </p>
            </div>
            <div className="relative w-[calc(321/375*100vw)] h-[calc(109/812*100vh)] flex flex-col rounded-md border-2 border-[#D4B588]/30">
              <img src={'/enigma/OverlaySeason.png'} className="absolute w-full h-full" />
              <div className="w-[calc(317/375*100vw)] h-[calc(63/812*100vh)] flex z-10">
                <div className="w-[calc(106/375*100vw)] h-[calc(63/812*100vh)] flex">
                  <div className="w-[calc(103/375*100vw)] h-[calc(63/812*100vh)] flex flex-col items-center justify-center">
                    <p className="text-[clamp(8px,2.5vw,15px)] font-bold text-[#FFBD60] "> {seasonStats?.averageTime || "00:00"} </p>
                    <p className="text-[clamp(8px,2.5vw,15px)] font-bold text-[#D1D1D1] "> AVERAGE TIME </p>
                  </div>
                  <img src={'/enigma/seasonDetailLine.png'} alt="Center Line" className="h-full " />
                </div>
                <div className="w-[calc(112/375*100vw)] h-[calc(63/812*100vh)] flex">
                  <div className="w-[calc(109/375*100vw)] h-[calc(63/812*100vh)] flex flex-col items-center justify-center">
                    <p className="text-[clamp(8px,2.5vw,15px)] font-bold text-[#FFBD60] "> {seasonStats?.points || 0} </p>
                    <p className="text-[clamp(8px,2.5vw,15px)] font-bold text-[#D1D1D1] "> POINTS </p>
                  </div>
                  <img src={'/enigma/seasonDetailLine.png'} alt="Center Line" />
                </div>
                <div className="w-[calc(98/375*100vw)] h-[calc(63/812*100vh)] flex flex-col items-center justify-center">
                  <p className="text-[clamp(8px,2.5vw,15px)] font-bold text-[#FFBD60] "> {seasonStats?.ranking || 0} </p>
                  <p className="text-[clamp(8px,2.5vw,15px)] font-bold text-[#D1D1D1] "> RANKING </p>
                </div>
              </div>
              <img src={'/enigma/lineSeason.png'} alt="Center Line" className="w-full z-10" />
              <div className="w-[calc(317/375*100vw)] h-[calc(40/812*100vh)] flex z-10 gap-[calc(7/375*100vw)] items-center justify-center" onClick={() => route.push(routes.ui.leaderboard)}>
                <p className="text-[clamp(10px,4vw,15px)] font-bold text-[#D1D1D1] "> Leaderboard </p>
                <img src={'/enigma/arrowRight.svg'} alt="Right Icon" />
              </div>
            </div>
            <div className="relative w-[calc(321/375*100vw)] h-[calc(402/812*100vh)] flex flex-col rounded-md">
              <div className={`w-[calc(321/375*100vw)]  h-[calc(327/812*100vh)]`}>
                <SeasonRiddleTable
                  data={riddleData}
                  columns={getSeasonRiddleColumns()}
                  selectedRowIndex={selectedRowIndex}
                  setSelectedRowIndex={setSelectedRowIndex}
                />
              </div>
              <div className={`absolute -bottom-[4%] left-1/2 transform -translate-x-1/2 z-10  h-[calc(150/812*100vh)] flex items-center justify-center play-button`}>
                {isSelectedRiddleLocked() ? (
                  <div className="relative block cursor-default">
                    <div className="relative w-full h-full">
                      <Image src="/enigma/seasonPlay.svg" alt="Season Play Button" width={200} height={200} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image src="/enigma/lock2.svg" alt="Locked" width={45} height={45} />
                      </div>
                    </div>
                  </div>
                ) : isPlayButtonDisabled() ? (
                  <div className="relative block cursor-not-allowed">
                    <div className="relative w-full h-full">
                      <Image src="/enigma/seasonPlay.svg" alt="Season Play Button" width={200} height={200} className="w-full h-full object-contain" />
                      <div className="absolute inset-0 flex justify-center items-center">
                        <span className="text-[clamp(12px,6vw,50px)] font-bold leading-none font-Farsan"> DONE </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href={getPlayButtonHref()} className="relative block cursor-pointer group overflow-hidden rounded-full">
                    <div className="relative w-full h-full transition-transform duration-300">
                      <Image src="/enigma/seasonPlay.svg" alt="Season Play Button" width={200} height={200} className="cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:rotate-1" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <div className="text-[clamp(20px,8vw,50px)] font-bold leading-none drop-shadow-lg bg-gradient-to-br from-[#EAC999] to-[#999999] bg-clip-text text-transparent"> {getPlayButtonLevel()} </div>
                        <div className="text-[clamp(14px,5vw,40px)] font-black drop-shadow-lg bg-gradient-to-b from-[#EAC999] to-[#999999] bg-clip-text text-transparent"> Play </div>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
            <div className="w-[calc(321/375*100vw)] h-[calc(40/812*100vh)]"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeasonDetail;
