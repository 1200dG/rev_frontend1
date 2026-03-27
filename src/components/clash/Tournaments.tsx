"use client";

import { routes } from "@/lib/routes";
import { getAllTournaments } from "@/lib/services/tournamentActions";
import { TournamentsType } from "@/lib/types/common/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import SelectMenu from "../common/select-menu";
import { handleApiError } from "@/lib/errorHandler";
import { useAppContext } from "@/lib/hooks/useAppContext";
import { usePathname } from "next/navigation";
import { AppContext } from "../context/AppContext";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<TournamentsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);
  const { setPreviousUrl } = useAppContext();
  const router = useRouter();
  const tournamentUrl = usePathname();
  const { isCollapsed } = useContext(AppContext)!;

  const goToTournament = (id: string) => {
    setPreviousUrl(tournamentUrl);
    router.push(routes.ui.clash.tournamentDetail(id));
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await getAllTournaments();
      if (response) {
        const sortedTournaments = response.sort(
          (a: TournamentsType, b: TournamentsType) => {
            const aId = parseInt(a.tournament_id.replace(/[^0-9]/g, "")) || 0;
            const bId = parseInt(b.tournament_id.replace(/[^0-9]/g, "")) || 0;
            return bId - aId;
          }
        );
        setTournaments(sortedTournaments);
      }
    } catch (error) {
      handleApiError(error, "Failed to load tournaments. Please try again.");
      return error;
    } finally {
      setLoading(false);
    }
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    const tournamentStatus = tournament.status?.toUpperCase();
    const tournamentType = tournament.type?.toUpperCase();

    if (statusFilter !== "ALL" && tournamentStatus !== statusFilter) {
      return false;
    }

    if (typeFilter !== "ALL" && tournamentType !== typeFilter) {
      return false;
    }

    if ( searchTerm && !tournament.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });



  return !loading ? (
    <>
      <div className="hidden sm:block overflow-x-hidden">
        <div className={`flex flex-col items-center gap-4 h-[calc(100dvh-140px)] overflow-x-hidden overflow-y-auto ${isCollapsed ? "w-[calc(1392/1440*100vw)]" : "w-[calc(1312/1440*100vw)]"}`}>
          <div className={`shrink-0 flex flex-col gap-6 ${isCollapsed ? " w-[calc(1265/1440*100vw)]" : "w-[calc(1137/1440*100vw)]"}`}>
            <div className="flex justify-between items-baseline w-full flex-wrap">
              <p className="text-white text-4xl font-medium">Clash</p>
              <Link
                href={routes.ui.leaderboard}
                className="border border-[#FFD279] bg-[#451b1b] px-4 py-1 mr-1 rounded-lg transition-all duration-300 hover:border-[#f4cf8b] hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box"
              >
                <div className="flex gap-2 items-center will-change-transform">
                  <Image src="/clash/trophy.svg" alt="Trophy Icon" height={25} width={25}  />
                  <p className="text-base font-bold text-white">Leaderboard</p>
                </div>
              </Link>
            </div>
            <div className="flex border border-[#D4B588] w-full rounded-lg">
              <div className="flex flex-wrap gap-2 px-3 py-2.5 bg-[linear-gradient(90deg,rgba(28,38,37,0.30)_0%,rgba(75,75,75,0.30)_89.62%)] border-r border-[#D4B588] w-[80%]" onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}>
                <SelectMenu
                  id="status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  openId={openId}
                  setOpenId={setOpenId}
                  options={[
                    { label: "All", value: "ALL" },
                    { label: "Live", value: "LIVE" },
                    { label: "Scheduled", value: "SCHEDULED" },
                    { label: "Concluded", value: "CONCLUDED" },
                  ]}
                />
                <SelectMenu
                  id="type"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  openId={openId}
                  setOpenId={setOpenId}
                  options={[
                    { label: "All Types", value: "ALL" },
                    { label: "Free", value: "FREE" },
                    { label: "Paid", value: "PAID" },
                  ]}
                />
              </div>
              <div className="flex gap-2 justify-center items-center w-[20%] pl-2.5">
                <div className="pointer-events-none">
                  <Image src="/clash/search.svg" alt="search icon" width={24} height={24} />
                </div>
                <input
                  type="text"
                  placeholder="SEARCH"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className=" w-full text-[#D4B588] placeholder:text-[#D4B588] placeholder:text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto no-scrollbar">
            {filteredTournaments.length > 0 &&
              filteredTournaments.map((tournament, key) => {
                return (
                  <div key={key} className={`group border border-[#ba9f79] ${isCollapsed ? " w-[calc(1265/1440*100vw)]" : "w-[calc(1137/1440*100vw)]"} rounded-lg overflow-hidden flex mb-2.5 cursor-pointer transition-shadow duration-200 hover:border-[#F4CF8B] hover:ring-2 hover:ring-[#F4CF8B]/50 hover:shadow-[0_6px_20px_rgba(244,207,139,0.35)]`} >
                    <div className="border-r border-[#ba9f79] w-fit relative transition-colors duration-200 group-hover:border-[#F4CF8B]">
                      <img src="/clash/mask.png" className="bg-cover" alt="tournament image" height={88} width={164} />
                    </div>
                    <div
                      className="flex justify-between items-center w-full pl-4 pr-12 bg-[#171A20]/60"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToTournament(tournament.tournament_id);
                      }}

                    >
                      <div className="py-2 flex flex-col gap-2.5">
                        <div className="flex gap-3 items-center">
                          <p className="text-2xl font-semibold text-white"> {tournament.title} </p>
                          <div className={`rounded-full h-5.5 w-auto px-4 flex justify-center items-center ${tournament.type === "FREE" ? "bg-[#2dbd00]" : "bg-[#dd8101]"}`} >
                            <p className="text-white text-[10px] font-semibold"> {tournament.type} </p>
                          </div>
                          <div
                            className={`rounded-full h-5.5 w-auto px-4 flex justify-center items-center ${tournament.status === "LIVE"
                              ? "bg-[#2dbd00]"
                              : tournament.status === "SCHEDULED"
                                ? "bg-[#dd8101]"
                                : "bg-[#6B200D]"
                              }`}
                          >
                            <p className="text-white text-[10px] font-semibold"> {tournament.status} </p>
                          </div>
                        </div>
                        <p className="text-white font-normal text-base"> {tournament.description} </p>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToTournament(tournament.tournament_id);
                        }}
                      >
                        <Image src="/clash/chevron_right.svg" height={24} width={24} alt="chevron icon" />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="block sm:hidden">
        <div className={`flex flex-col items-center w-[calc(375/375*100vw)] h-[calc(746/812*100dvh)] `}>
          <div className={`flex flex-col justify-between w-[calc(321/375*100vw)] h-[calc(607/812*100vh)] `}>
            <div className="flex flex-col justify-between items-baseline w-[calc(321/375*100vw)] h-[calc(45/812*100vh)] ">
              <p className="text-white text-[clamp(10px,20vw,18px)] font-medium">Clash</p>
              <p className="text-[#E2AC5D] text-[clamp(8px,10vw,14px)] font-medium">For the competitive minds</p>
            </div>
            <div className="flex flex-col justify-between w-[calc(321/375*100vw)] h-[calc(96/821*100vh)] rounded-lg">
              <div className="flex justify-between gap-2 w-[calc(321/375*100vw)] h-[calc(41/96*100vh)] ">
                <SelectMenu
                  id="status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  openId={openId}
                  setOpenId={setOpenId}
                  options={[
                    { label: "All", value: "ALL" },
                    { label: "Live", value: "LIVE" },
                    { label: "Scheduled", value: "SCHEDULED" },
                    { label: "Concluded", value: "CONCLUDED" },
                  ]}
                />
                <SelectMenu
                  id="type"
                  value={typeFilter}
                  onChange={setTypeFilter}
                  openId={openId}
                  setOpenId={setOpenId}
                  options={[
                    { label: "All Types", value: "ALL" },
                    { label: "Free", value: "FREE" },
                    { label: "Paid", value: "PAID" },
                  ]}
                />
              </div>
              <div className="flex h-[calc(41/821*100vh)] w-[calc(321/375*100vw)] bg-[#472016] rounded-md border-2 border-[#d4b588] justify-center items-center">
                <div className="h-[calc(37/821*100vh)] w-[calc(284/375*100vw)] flex items-center justify-center">
                  <div className="pointer-events-none flex items-center justify-center h-[calc(37/821*100vh)] w-[calc(30/375*100vw)]">
                    <Image src="/clash/search.svg" alt="search icon" width={17.49} height={17.49} />
                  </div>
                  <input
                    type="text"
                    placeholder="SEARCH TOURNAMENTS"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-[#D4B588] placeholder:text-[#D4B588] placeholder:text-[clamp(8px,8vw,12px)] focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col overflow-auto h-[calc(411/812*100vh)] w-[calc(321/375*100vw)] no-scrollbar scroll-ios">
              {filteredTournaments.length > 0 &&
                filteredTournaments.map((tournament, key) => {
                  return (
                    <div
                      key={key}
                      className={`group flex-shrink-0 border border-t-2 border-[#ba9f79] mb-[1.5%] rounded-lg overflow-hidden flex w-[calc(321/375*100vw)] h-[calc(61/821*100vh)] cursor-pointer transition-shadow duration-200 `}
                    >
                      <div className="flex justify-center items-center w-full  bg-[#2c1b15]/60" onClick={() => goToTournament(tournament.tournament_id)} >
                        <div className="w-[calc(285/375*100vw)] h-[calc(61/821*100vh)] flex justify-between items-center">
                          <div className="flex flex-col justify-between h-[calc(41/821*100vh)] w-[calc(285/375*100vw)]">
                            <div className="flex gap-3 items-center">
                              <p className="text-[clamp(10px,8vw,14px)] font-semibold text-[#FFD278]"> {tournament.title} </p>
                              <div className={`rounded-full h-[calc(17/812*100vh)] w-[calc(38/375*100vw)] flex justify-center items-center px-[clamp(6px,calc(8/375*100vw),10px)] ${tournament.type === "FREE" ? "bg-[#2dbd00]" : "bg-[#dd8101]"}`}>
                                <p className="text-white text-[10px] font-semibold"> {tournament.type} </p>
                              </div>
                              <div
                                className={`rounded-full h-[calc(17/812*100vh)] w-[calc(38/375*100vw)] px-4 flex justify-center items-center ${tournament.status === "LIVE"
                                  ? "bg-[#2dbd00]"
                                  : tournament.status === "SCHEDULED"
                                    ? "bg-[#dd8101] w-[calc(65/375*100vw)] "
                                    : "bg-[#6B200D] w-[calc(71/375*100vw)]"
                                  }`}
                              >
                                <p className="text-white text-[10px] font-semibold"> {tournament.status} </p>
                              </div>
                            </div>
                            <p className="text-white font-normal text-[clamp(8px,8vw,12px)]"> {tournament.description} </p>
                          </div>
                          <div className="cursor-pointer" onClick={() => goToTournament(tournament.tournament_id)} >
                            <Image src="/clash/chevron_right.svg" height={24} width={24} alt="chevron icon" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className=" h-[calc(20/812*100vh)] w-[calc(321/375*100vw)]"> </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="hidden sm:block">
        <div className={`flex ${isCollapsed ? " w-[calc(1392/1440*100vw)]" : "w-[calc(1264/1440*100vw)]"} h-screen justify-center items-center`}>
          <BeatLoader color="white" />
        </div>
      </div>
      <div className="block sm:hidden">
        <div className={`flex w-[calc(375/375*100vw)] h-[calc(746/812*100vh)] justify-center items-center`}>
          <BeatLoader color="white" />
        </div>
      </div>
    </>
  );
};

export default Tournaments;
