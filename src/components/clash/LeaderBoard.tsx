"use client";
import { useEffect, useState } from "react";
import LeaderBoardFilters from "./LeaderBoardFilters";
import Image from "next/image";
import Table from "../common/tables/Table";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { LeaderBoardColumns } from "@/lib/types/common/types";
import { leaderBoardTableColumns } from "@/lib/constants/clash";
import { handleApiError } from "@/lib/errorHandler";
import { useAppContext } from "@/lib/hooks/useAppContext";

interface LeaderboardApiItem {
  id: number;
  user: { id: number; username: string };
  total_points: number;
  wins: number;
  streak: number;
  time_played: string;
  rank: number;
  best_rank: number;
  is_current_user: boolean;
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderBoardColumns[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["world"]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { isCollapsed } = useAppContext();

  const fetchLeaderboard = async (scopes: string[]) => {
    setLoading(true);
    try {
      const query = scopes.map((s) => `scope=${s}`).join("&");
      const res = await api.get(`leaderboard/?${query}`);

      if (res.data.status === 200 && res.data.data) {
        const mapped = res.data.data.map((item: LeaderboardApiItem) => ({
          user_id: item.user.id,
          rank: item.rank || "-",
          username: item.user.username || "-",
          totalPoints: item.total_points || "-",
          wins: item.wins || "-",
          streak: item.streak || "-",
          is_current_user: item.is_current_user,
        }));
        setLeaderboardData(mapped);
      }
    } catch (err) {
      handleApiError(err, "Failed to load leaderboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedFilters);
    setSearchTerm("");
  }, [selectedFilters]);

  const filteredData = leaderboardData.filter((item) =>
    item.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFilter = (value: string) => {
    setSelectedFilters((prev) => {
      if (value === "reset") {
        return [];
      }
      if (value === "world") {
        return prev.includes("top_rank") ? ["world", "top_rank"] : ["world"];
      }
      if (value === "my_country") {
        return prev.includes("top_rank")
          ? ["my_country", "top_rank"]
          : ["my_country"];
      }

      if (value === "top_rank") {
        if (prev.includes("top_rank")) {
          return prev.filter((f) => f !== "top_rank");
        }
        return [...prev, "top_rank"];
      }

      return prev;
    });
  };


  const handleRowClick = (row: LeaderBoardColumns) => {
    if (row.user_id) {
      router.push(`/profile/${row.user_id}`);
    }
  };

  return (
    <>
      <div className="hidden sm:block">
        <div className={`flex flex-col  items-center gap-6 overflow-auto ${isCollapsed ? " w-[calc(1392/1440*100vw)]" : "w-[calc(1312/1440*100vw)]"}  h-[calc(653/900*100vh)]`}>
          <div className={`flex flex-col gap-1 ${isCollapsed ? "w-[calc(1265/1440*100vw)] " : "w-[calc(1137/1440*100vw)]"}`}>
            <div>
              <button
                onClick={() => router.back()}
                className={`inline-flex items-center gap-1 py-1.5 rounded-md ${isCollapsed ? "w-[calc(1265/1440*100vw)] " : "w-[calc(1137/1440*100vw)]"}
               transition-all duration-200 cursor-pointer
               hover:drop-shadow-[0_0_5px_#facc15]`}
              >
                <Image
                  src="/clash/arrow_back.svg"
                  alt="Back Icon"
                  height={14}
                  width={14}
                />
                <p className="whitespace-nowrap text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] xl:text-sm 2xl:text-base  font-medium text-[#898989] " > BACK </p>
              </button>
            </div>

            <div className="flex justify-between items-baseline w-full flex-wrap">
              <p className="text-white text-4xl font-medium">Leaderboard</p>
            </div>
          </div>
          <div className={`flex ${isCollapsed ? "w-[calc(1265/1440*100vw)] " : "w-[calc(1137/1440*100vw)]"} gap-8`}>
            <div className="relative w-full ">
              <Table
                data={filteredData}
                columns={leaderBoardTableColumns}
                loading={loading}
                onRowClick={handleRowClick}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 border border-[#D4B588] w-68 py-3.5 p-4">
                <img src="/clash/search.svg" alt="search icon" />
                <input
                  type="text"
                  placeholder="SEARCH"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-[#D4B588] placeholder:text-[#D4B588] placeholder:text-xs font-medium focus:outline-none w-full"
                />
              </div>
              <LeaderBoardFilters
                selected={selectedFilters}
                onSelect={toggleFilter}
              />
            </div>
          </div>
        </div>
      </div >
      <div className="block sm:hidden w-[calc(375/375*100vw)]  h-[calc(600/812*100vh)] overflow-y-auto">
        <div className={`flex flex-col items-center w-[calc(375/375*100vw)] `}>
          <div className={`flex flex-col justify-center items-center w-[calc(375/375*100vw)]  gap-[calc(18/845*100vh)] `}>
            <div className={"flex flex-col w-[calc(321/375*100vw)] h-[58/812*100vh)]"}>
              <div className="inline-block h-[11/812*100vh)]">
                <button onClick={() => router.back()} className="inline-flex items-center gap-1 rounded-md transition-all duration-200 cursor-pointer hover:drop-shadow-[0_0_5px_#facc15]" >
                  <Image src="/statistics/backArrow.svg" alt="Back Icon" height={11.67} width={6.87} />
                  <p className="whitespace-nowrap text-[clamp(8px,20vw,14px)] text-[#cc9a53] font-semibold" > BACK </p>
                </button>
              </div>

              <div className="flex justify-between items-baseline w-[calc(321/375*100vw)] h-[calc(23/812*100vh)] flex-wrap">
                <h2 className="text-white text-[clamp(12px,20vw,20px)]  font-bold">
                  Leaderboard
                </h2>
              </div>
            </div>
            <div className="flex flex-col h-[calc(110/812*100vh)] w-[calc(322/375*100vw)] border-2 border-[#D4B588]/50 rounded-md ">
              <div className="flex items-center justify-center border-b-2 border-[#D4B588]/50 bg-[#451910] rounded-t-md  h-[calc(41/812*100vh)] w-[calc(318/375*100vw)]">
                <div className="flex w-[calc(285/375*100vw)] gap-[calc(10/375*100vw)] h-[calc(41/812*100vh)]">
                  <img src="/clash/search.svg" alt="search icon" width={18} height={15} />
                  <input
                    type="text"
                    placeholder="SEARCH PLAYER"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-[#D4B588] placeholder:text-[#D4B588] placeholder:text-[clamp(12px,3.5vw,20px)] font-bold focus:outline-none w-[calc(271/375*100vw)] h-[calc(41/812*100vh)]"
                  />
                </div>
              </div>
              <LeaderBoardFilters
                selected={selectedFilters}
                onSelect={toggleFilter}
              />
            </div>
            <div className="relative w-full flex items-center justify-center">
              <Table
                data={filteredData}
                columns={leaderBoardTableColumns}
                loading={loading}
                onRowClick={handleRowClick}
              />
            </div>
            <div className="h-[calc(20/812*100vh)] w-[calc(322/375*100vw)]"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
