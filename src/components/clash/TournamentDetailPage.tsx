"use client";
import { useEffect, useState } from "react";
import TournamentFilters from "./TournamentFilter";
import Image from "next/image";
import Table from "../common/tables/Table";
import { gettournamentDetail } from "@/lib/services/tournamentActions";
import { useParams, useRouter } from "next/navigation";
import { TournamentDetail, TournamentLeaderboardColumns } from "@/lib/types/common/types";
import { BeatLoader } from "react-spinners";
import { routes } from "@/lib/routes";
import { useSession } from "next-auth/react";
import { getTournamentTimeInfo } from "@/lib/utils/helpers";
import { tournamentLeaderBoardColumns } from "@/lib/constants/clash";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { handleApiError } from "@/lib/errorHandler";
import CommonPopup from "../riddle-game/CommonPopup";
import { AxiosError } from "axios";
import { useAppContext } from "@/lib/hooks/useAppContext";


interface LeaderboardApiItem {
  id: number;
  user: { id: number; name: string };
  total_points: number;
  levels_solved: number;
  time_played: string;
  rank: number;
  best_rank: number | null;
  is_current_user: boolean;
}

const TournamentDetailPage = () => {
  const [tabIndex, setTabIndex] = useState<0 | 1>(0);
  const [tournamentDetail, setTournamentDetail] = useState<TournamentDetail | null>(null);
  const [loader, setLoader] = useState<boolean>(true);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [tournamentLeaderBoard, setTournamentLeaderBoard] = useState([]);
  const [userHasJoined, setUserHasJoined] = useState<boolean>(false);
  const [userHasCompleted, setUserHasCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [yesActionType, setYesActionType] = useState<"JOIN_FREE" | "JOIN_PAID" | "LEAVE_FREE" | "LEAVE_PAID" | null>(null);
  const { previousUrl } = useAppContext();
  const { isCollapsed } = useAppContext();

  useEffect(() => {
    if (!tournamentDetail?.id) return;
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get(`${"leaderboard/"}${tournamentDetail.id}/`);
        if (res.data.status === 200 && res.data.data) {
          const mapped = res.data.data.map((item: LeaderboardApiItem) => ({
            user_id: item.user.id,
            rank: item.rank || "-",
            username: item.user.name || "-",
            totalPoints: item.total_points || "-",
            level: item.levels_solved || "-",
            is_current_user: item.is_current_user,
          }));
          setTournamentLeaderBoard(mapped);
        }
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
        handleApiError(err, "Failed to load leaderboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [tournamentDetail]);

  const fetchTournamentDetail = async () => {
    try {
      if (!params?.id) {
        console.error("Tournament ID is missing from URL parameters");
        return;
      }

      const response = await gettournamentDetail(params.id);
      if (response) {
        setTournamentDetail(response);
        setUserHasJoined(response.user_has_joined);
        setUserHasCompleted(response.user_has_completed);
      }
    } catch (error) {
      console.error("Error fetching tournament detail:", error);
      handleApiError(error, "Failed to load tournament details. Please try again.");
      return error;
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchTournamentDetail();
  }, []);

  const handleJoinTournament = async () => {
    if (!session?.user?.account_id) {
      router.push("/auth/sign-in");
      return;
    }

    if (!params?.id) {
      console.error("Tournament ID is missing");
      return;
    }

    if (statusInfo?.buttonText === "Join Now") {
      if (tournamentDetail?.type === "FREE") {
        setConfirmMessage("Are you sure you want to join this tournament?")
        setYesActionType("JOIN_FREE")
      }
      else {
        setConfirmMessage(`Are you sure you want to join this tournament? ${tournamentDetail?.price} credits will be deducted from your account!`)
        setYesActionType("JOIN_PAID")
      }
      setIsConfirmOpen(true);

    }
    else {

      if (tournamentDetail?.type === "FREE") {
        setConfirmMessage("Are you sure you want to leave this tournament? You won't be able to play this tournament once it begins!")
        setYesActionType("LEAVE_FREE")
      }
      else {
        setConfirmMessage("Are you sure you want to leave this tournament? Your credits won't be refunded!")
        setYesActionType("LEAVE_PAID")
      }
      setIsConfirmOpen(true);
    }
  };


  const handlePlayTournament = () => {
    if (!session?.user?.account_id) {
      router.push("/auth/sign-in");
      return;
    }

    if (!params?.id) {
      console.error("Tournament ID is missing");
      return;
    }

    if (userHasCompleted) {
      toast.info("You have already completed this tournament.");
      return;
    }
    if (!tournamentDetail) return;
    // redirect to tournament play with a riddle ID (need to get this from tournament details)
    // for now using a default riddle ID - will be updated to get actual riddle from tournament
    const levelNumber = tournamentDetail.level_number ?? null;
    router.push(`${routes.ui.clash.tournamentPlay(params.id)}?levelNumber=${levelNumber}`);
  };

  const statusInfo = tournamentDetail
    ? getTournamentTimeInfo(
      tournamentDetail.start_date,
      tournamentDetail.end_date,
      tournamentDetail.status as "SCHEDULED" | "LIVE" | "CONCLUDED",
      userHasJoined
    ) : null;

  const handleRowClick = (row: TournamentLeaderboardColumns) => {
    if (row.user_id) {
      router.push(`/profile/${row.user_id}`);
    }
  };

  const handleYesClick = async () => {
    setIsConfirmOpen(false);

    try {
      if (yesActionType === "JOIN_FREE") {
        const res = await api.get(`tournaments/${params.id}/join/`);
        if (res.data.success) {
          toast.success(res.data.data.detail);
          setUserHasJoined(res.data.data.user_has_joined);
          fetchTournamentDetail();
        } else {
          toast.error(res.data.message);
        }
      }

      else if (yesActionType === "JOIN_PAID") {
        const res = await api.get(`tournaments/${params.id}/join/`);
        if (res.data.success) {
          toast.success(res.data.data.detail);
          setUserHasJoined(res.data.data.user_has_joined);
          fetchTournamentDetail();
        } else {
          toast.error(res.data.message);
        }
      }

      else if (yesActionType === "LEAVE_FREE") {
        const res = await api.get(`tournaments/${params.id}/join/`);
        if (res.data.success) {
          toast.success(res.data.data.detail);
          setUserHasJoined(res.data.data.user_has_joined);
          fetchTournamentDetail();
        } else {
          toast.error(res.data.message);
        }
      }

      else if (yesActionType === "LEAVE_PAID") {
        const res = await api.get(`tournaments/${params.id}/join/`);
        if (res.data.success) {
          toast.success(res.data.data.detail);
          setUserHasJoined(res.data.data.user_has_joined);
          fetchTournamentDetail();
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      handleApiError(error, "Failed to join tournament. Please try again.");
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as AxiosError<{
          errors?: { detail?: string };
          message?: string;
        }>;

        const data = axiosError.response?.data;

        const errorMessage = data?.errors?.detail
        if (errorMessage === "You don't have enough credits.") {
          router.push("/payments");
        }
      }
    };
  }
  return loader ? (
    <div className="flex items-center justify-center absolute inset-0 z-50 overflow-hidden">
      <BeatLoader color="white" />
    </div>
  ) : (
    <>
      <div className="hidden sm:block">
        <div className={`flex flex-col items-center gap-6 ${isCollapsed ? " w-[calc(1392/1440*100vw)]" : "w-[calc(1312/1440*100vw)]"} h-[calc(597/900*100vh)]`}>
          <div className={`${isCollapsed ? " w-[calc(1392/1440*100vw)]" : "w-[calc(1312/1440*100vw)]"} flex flex-col items-center justify-between h-[calc(597/900*100vh)]`}>
            <div className={`flex flex-col justify-between gap-2 ${isCollapsed ? " w-[calc(1265/1440*100vw)]" : "w-[calc(1137/1440*100vw)]"} h-[calc(66/900*100vh)]`}>
              <div className={`flex items-center justify-between ${isCollapsed ? " w-[calc(1265/1440*100vw)]" : "w-[calc(1137/1440*100vw)]"}`}>
                <div className="relative flex gap-4 items-center">
                  <button onClick={() => router.push(previousUrl)} className="absolute -left-10 top-1/2 -translate-y-1/2 z-10 hover:drop-shadow-[0_0_5px_#facc15] cursor-pointer" >
                    <Image src="/clash/expand_circle_right.svg" alt="back icon" height={32} width={32} />
                  </button>
                  <p className="text-white text-4xl font-medium"> {tournamentDetail?.title || "Tournament Name"} </p>
                  <div
                    className={`rounded-full py-1 px-2 items-center ${tournamentDetail?.status === "LIVE" ||
                      tournamentDetail?.status === "ACTIVE"
                      ? "bg-[#2dbd00]"
                      : tournamentDetail?.status === "CONCLUDED"
                        ? "bg-[#6B200D]"
                        : "bg-[#dd8101]"
                      }`}
                  >
                    <p className="capitalize text-center text-[10px] text-white font-semibold"> {tournamentDetail?.status} </p>
                  </div>
                </div>
                <button
                  onClick={tournamentDetail?.status === "SCHEDULED" || (tournamentDetail?.status === "LIVE" && !userHasJoined) ? handleJoinTournament : handlePlayTournament}
                  disabled={statusInfo?.buttonDisabled}
                  className={`border border-[#ffd279] px-4 py-2 rounded-lg transition-colors ${statusInfo?.buttonDisabled || tournamentDetail?.user_has_completed
                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                    : "bg-[#451b1b] cursor-pointer shadow-[0px_3px_4px_rgba(255,252,250,0)] transition-opacity duration-300 hover:shadow-[0px_3px_4px_rgba(255,252,250,0.25)] box"}`}
                >
                  <p className="text-base font-bold text-white will-change-transform"> {tournamentDetail?.status === "LIVE" && !userHasJoined ? "Join Now" : statusInfo?.buttonText} </p>
                </button>
              </div>
              <p className="text-sm font-medium text-white"> {statusInfo?.message || "Loading..."} </p>
            </div>
            <div className={`${isCollapsed ? " w-[calc(1247/1440*100vw)]" : "w-[calc(1120/1440*100vw)]"} h-[calc(504/900*100vh)] flex flex-col justify-between`}>
              <div className="flex gap-2 sm:gap-3 md:gap-4 border-b-[1.5px] border-[#88724B] h-[calc(24.5/900*100vh)] ">
                <button
                  onClick={() => setTabIndex(0)}
                  className={` text-xs sm:text-sm md:text-base lg:text-sm text-center h-[calc(24.5/900*100vh)] whitespace-nowrap cursor-pointer font-bold  ${tabIndex === 0 ? "text-white border-b-[1.5px] border-[#dd8101]" : "text-[#8e8e8e]"}`}
                >
                  OVERVIEW
                </button>
                <button
                  onClick={() => setTabIndex(1)}
                  className={` text-xs sm:text-sm md:text-base lg:text-sm h-[calc(24.5/900*100vh)] cursor-pointer whitespace-nowrap text-center font-bold -mb-[1.5px] ${tabIndex === 1
                    ? "text-white border-b-[1.5px] border-[#dd8101]" : "text-[#8e8e8e]"}`}
                >
                  LEADERBOARD
                </button>
              </div>
              {tabIndex === 0 && (
                <div className={`${isCollapsed ? " w-[calc(1247/1440*100vw)]" : "w-[calc(1120/1440*100vw)]"} h-[calc(455/900*100vh)] flex flex-col items-center justify-between`}>
                  <div className={`flex justify-between ${isCollapsed ? " w-[calc(1247/1440*100vw)]" : "w-[calc(1120/1440*100vw)]"} h-[calc(95/900*100vh)]`}>
                    <div className={`flex justify-between ${isCollapsed ? " w-[calc(764/1440*100vw)]" : "w-[calc(686.7/1440*100vw)]"} h-[calc(95/900*100vh)]`}>
                      <TournamentFilters tournamentDetail={tournamentDetail} />
                    </div>
                    <div className={`relative flex justify-end border border-[#FFD278]/50 bg-[url('/clash/owlbgTournament.png')] bg-no-repeat bg-cover ${isCollapsed ? " w-[calc(457/1440*100vw)]" : "w-[calc(410.75/1440*100vw)]"} h-[calc(95/900*100vh)]`}>

                      <div className="w-1/2">
                        <div className="absolute h-full w-[50%] flex justify-evenly items-center">
                          <img src="/clash/wings.svg" alt="Wings" className={`${isCollapsed ? " w-[calc(64/1440*100vw)]" : "w-[calc(57.52/1440*100vw)]"} h-[calc(50/900*100vh)]`} />
                          <div className="flex flex-col ">
                            <h4 className="text-lg text-white font-normal leading-[0.75919rem] ps-1"> Created by </h4>
                            <img src="/clash/revlogo.svg" className={`${isCollapsed ? " w-[calc(83/1440*100vw)]" : "w-[calc(74.60/1440*100vw)]"} h-[calc(28/900*100vh)]`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`flex justify-between ${isCollapsed ? " w-[calc(1245/1440*100vw)]" : "w-[calc(1117/1440*100vw)]"} h-[calc(343/900*100vh)]`}>
                    <div className={`relative ${isCollapsed ? " w-[calc(499/1440*100vw)]" : "w-[calc(447.69/1440*100vw)]"} h-[calc(343/900*100vh)] flex justify-center items-center`}>
                      <img src="/clash/overlayPrize.png" className={`absolute ${isCollapsed ? " w-[calc(499/1440*100vw)]" : "w-[calc(447.69/1440*100vw)]"} h-[calc(343/900*100vh)] `} />
                      <div className={`absolute ${isCollapsed ? " w-[calc(451.49/1440*100vw)]" : "w-[calc(405.07/1440*100vw)]"} h-[calc(305/900*100vh)] flex flex-col justify-between`}>
                        <div className={`${isCollapsed ? " w-[calc(451.49/1440*100vw)]" : "w-[calc(405.07/1440*100vw)]"} h-[calc(35/900*100vh)] flex border-b-2 border-[#d4b588]`}>
                          <p className="text-left text-[7px] sm:text-[9px] md:text-xs lg:text-base xl:text-lg 2xl:text-xl font-bold text-[#d4b588]"> PRIZES </p>
                        </div>
                        <div className={`${isCollapsed ? " w-[calc(451.49/1440*100vw)]" : "w-[calc(405.07/1440*100vw)]"} h-[calc(256/900*100vh)] flex flex-col justify-between`}>
                          <div className={`${isCollapsed ? " w-[calc(451.49/1440*100vw)]" : "w-[calc(405.07/1440*100vw)]"} h-[calc(28/900*100vh)] border border-[#d4b588] grid grid-cols-4 items-center text-[5px] sm:text-[7px] md:text-[9px] lg:text-[11px] xl:text-xs 2xl:text-xs font-semibold font-Sora text-white `}>
                            <span className="text-center">RANK</span>
                            <span className="text-center">USER</span>
                            <span className="text-center">LEADERBOARD POINTS</span>
                            <span className="text-center">CASH PRIZE</span>
                          </div>
                          <div className={`flex flex-col gap-0.5 lg:gap-1 ${isCollapsed ? " w-[calc(451.49/1440*100vw)]" : "w-[calc(405.07/1440*100vw)]"} h-[calc(222/900*100vh)] overflow-y-auto no-scrollbar`}>
                            {tournamentDetail?.prizes.map(
                              ({ id, start_rank, end_rank, points, cash_prize, user }) => (
                                <div
                                  key={id}
                                  className={`w-full h-[calc(30/900*100vh)] grid grid-cols-4 items-center
                                    ${start_rank === 1
                                      ? "border-[0.29px] border-[#F7CB45] bg-[linear-gradient(90deg,rgba(235,170,31,2.5)_3.56%,rgba(196,153,44,0.80)_47.88%,rgba(152,122,42,0.60)_80%,rgba(139,102,24,0.25)_98.11%)] backdrop-blur-[1.74609375px] "
                                      : start_rank === 2
                                        ? "border-[0.29px] border-[#EEEEEE] [background:linear-gradient(90deg,rgba(238,238,238,0.50)_3.56%,rgba(238,238,238,0.30)_47.88%,rgba(238,238,238,0.50)_98.11%)] backdrop-blur-[1.74609375px]"
                                        : start_rank === 3
                                          ? "border-[0.29px] border-[#D9B28880] [background:linear-gradient(90deg,rgba(217,178,136,0.50)_3.56%,rgba(217,178,136,0.20)_47.88%,rgba(217,178,136,0.50)_98.11%)] backdrop-blur-[1.74609375px]"
                                          : "border-[0.5px] border-[#372819] bg-linear-to-b from-transparent to-[rgb(80,73,57)]"
                                    }
                                    text-[5px] sm:text-[7px] md:text-[9px] lg:text-[11px] xl:text-xs font-semibold text-white
                                  `}
                                >
                                  <div className="relative flex justify-center items-center gap-4 h-full">
                                    {start_rank === 1 ? (
                                      <img src="/gamehub/rank1.svg" alt="Gold medal" width={23.28} height={18.62} className="w-[calc(23.28/1440*100vw)] h-[calc(18.62/900*100vh)]" />
                                    ) : start_rank === 2 ? (
                                      <img src="/gamehub/rank2.svg" alt="Silver medal" width={23.28} height={18.62} className="w-[calc(23.28/1440*100vw)] h-[calc(18.62/900*100vh)]"/>
                                    ) : start_rank === 3 ? (
                                      <img src="/gamehub/rank3.svg" alt="Bronze medal" width={23.28} height={18.62} className="w-[calc(23.28/1440*100vw)] h-[calc(18.62/900*100vh)]"/>
                                    ) : (
                                      <span className="text-center">{`${start_rank} - ${end_rank}`}</span>
                                    )}
                                    <div
                                      className={`absolute h-full ${start_rank === 1
                                        ? "bg-[#ebcd9b]"
                                        : start_rank === 2
                                          ? "bg-[#eeeeee]"
                                          : start_rank === 3
                                            ? "bg-[#BB9986]"
                                            : "bg-[#99C9B8]/33"
                                        } ${isCollapsed ? " w-[calc(5/1440*100vw)]" : "w-[calc(4.48/1440*100vw)]"} left-0 bottom-0`}
                                    />
                                  </div>
                                  <div className={`flex gap-[calc(10/1440*100vw)] items-center ${isCollapsed ? "w-[calc(100/1440*100vw)]" : "w-[calc(88.8/1440*100vw)]" }`} >
                                    <img src="/clash/TO_BE_DETERMINED.svg" width={20} height={20} />
                                    <div className="relative overflow-hidden w-full">
                                      <div className={`whitespace-nowrap ${user?.length > 13 ? "animate-marquee" : "" }`} >
                                        <span className="uppercase text-[4px] sm:text-[6px] md:text-[8px] lg:text-[10px] xl:text-2xs text-white"> {user} </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-center">{points}</div>
                                  <div className="text-center">{cash_prize}</div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`relative ${isCollapsed ? " w-[calc(724.94/1440*100vw)]" : "w-[calc(650.40/1440*100vw)]"} h-[calc(343/900*100vh)] flex justify-center items-center`}>
                      <img src="/clash/Overlaydetail.png" className={`${isCollapsed ? " w-[calc(724.94/1440*100vw)]" : "w-[calc(650.40/1440*100vw)]"} h-[calc(343/900*100vh)] bg-no-repeat bg-contain`} />
                      <div className={`absolute z-10 flex flex-col justify-between ${isCollapsed ? " w-[calc(666.99/1440*100vw)]" : "w-[calc(598.41/1440*100vw)]"} h-[calc(300/900*100vh)]`}>
                        <div className="w-full h-[calc(35/900*100vh)] flex border-b border-[#88724B]">
                          <p className="text-left text-[7px] sm:text-[9px] md:text-xs lg:text-base xl:text-lg 2xl:text-xl font-bold text-[#d4b588]"> DETAILS </p>
                        </div>
                        <div className="text-[5px] sm:text-[7px] md:text-xs lg:text-sm xl:text-md 2xl:text-lg font-Sora text-white h-[calc(255/900*100vh)]">
                          <p> {tournamentDetail?.details} </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
              {tabIndex === 1 && (
                <div className={`${isCollapsed ? " w-[calc(1247/1440*100vw)]" : "w-[calc(1120/1440*100vw)]"} h-[calc(455/900*100vh)] flex flex-col items-center justify-between`}>
                  {loading ? (
                    <p className="text-white">Loading...</p>
                  ) : (
                    <Table
                      data={tournamentLeaderBoard}
                      onRowClick={handleRowClick}
                      columns={tournamentLeaderBoardColumns}
                      mode="tournament"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <CommonPopup
            isOpen={isConfirmOpen}
            title="Confirmation"
            message={confirmMessage}
            buttonText="Yes"
            onButtonClick={handleYesClick}
            secondaryButtonText="No"
            onSecondaryButtonClick={() => setIsConfirmOpen(false)}
          />
        </div>
      </div>
      <div className="block sm:hidden w-[calc(375/375*100vw)] h-[calc(620/812*100vh)] overflow-y-auto ">
        <div className={`flex flex-col items-center w-[calc(375/375*100vw)] `}>
          <div className={`flex flex-col items-center justify-between w-[calc(321/375*100vw)] gap-[calc(18/845*100vh)]`}>
            <div className={`flex flex-col items-center justify-between w-[calc(321/375*100vw)] h-[calc(933/1033*100vh)]`}>
              <div className={`flex flex-col justify-between h-[calc(146/1033*100vh)]`}>
                <button
                  onClick={() => router.push(previousUrl)}
                  className="inline-flex items-center gap-1 rounded-md transition-all duration-200 cursor-pointer hover:drop-shadow-[0_0_5px_#facc15]"
                >
                  <Image src="/statistics/backArrow.svg" alt="Back Icon" height={11.67} width={6.87} />
                  <p className="whitespace-nowrap text-[clamp(8px,20vw,14px)] text-[#cc9a53] font-semibold">  BACK </p>
                </button>
                <div className="relative flex gap-4 items-center">
                  <p className="text-white text-[clamp(12px,20vw,20px)] font-bold">
                    {tournamentDetail?.title || "Tournament Name"}
                  </p>
                  <div
                    className={`rounded-full flex items-center justify-center w-[calc(38.53/375*100vw)] h-[calc(17.73/812*100vh)] ${tournamentDetail?.status === "LIVE" ||
                      tournamentDetail?.status === "ACTIVE"
                      ? "bg-[#2dbd00]"
                      : tournamentDetail?.status === "CONCLUDED"
                        ? "bg-[#6B200D] w-[calc(70.53/375*100vw)]  h-[calc(25.73/812*100vh)]"
                        : "bg-[#dd8101] w-[calc(65.53/375*100vw)]  h-[calc(22.73/812*100vh)]"
                      }`}
                  >
                    <p className="capitalize text-center text-[clamp(6px,3vw,10px)] text-white font-semibold"> {tournamentDetail?.status} </p>
                  </div>
                </div>
                <p className="text-[clamp(6px,8vw,10px)] font-medium text-[#cc9a53]">
                  {statusInfo?.message || "Loading..."}
                </p>
                <button
                  onClick={tournamentDetail?.status === "SCHEDULED" || (tournamentDetail?.status === "LIVE" && !userHasJoined) ? handleJoinTournament : handlePlayTournament}
                  disabled={statusInfo?.buttonDisabled}
                  className={`border border-[#ffd279] gap-[calc(24/375*100vw)] flex justify-center items-center w-[calc(321/375*100vw)] h-[calc(54/1033*100vh)] rounded-lg transition-colors ${statusInfo?.buttonDisabled
                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                    : "bg-[url('/clash/playBg.png')] bg-cover bg-center bg-no-repeat cursor-pointer"
                    }`}
                >
                  <img src={'/clash/swords.svg'} alt="Sword" />
                  <p className="text-base uppercase font-bold text-[#D4B588]">
                    {tournamentDetail?.status === "LIVE" && !userHasJoined ? "Join Now" : statusInfo?.buttonText}
                  </p>
                </button>
              </div>
              <div className={`${tabIndex === 1 ? "gap-[calc(16/1033*100vh)]" : ""} h-[calc(773/1033*100vh)] w-[calc(321/375*100vw)] flex flex-col items-center justify-between`}>
                <div className="flex border-b-[1.5px] border-[#88724B] h-[calc(23/1033*100vh)] w-[calc(321/375*100vw)]">
                  <button
                    onClick={() => setTabIndex(0)}
                    className={` text-xs sm:text-sm md:text-base lg:text-sm text-center w-[calc(164/375*100vw)] h-[calc(23/1033*100vh)] whitespace-nowrap cursor-pointer font-bold  ${tabIndex === 0
                      ? "text-[#E2AC5D] border-b-[1.5px] border-[#E2AC5D]"
                      : "text-[#A78B7D]"
                      }`}
                  >
                    OVERVIEW
                  </button>
                  <button
                    onClick={() => setTabIndex(1)}
                    className={` text-xs sm:text-sm md:text-base lg:text-sm w-[calc(164/375*100vw)] h-[calc(23/1033*100vh)] cursor-pointer whitespace-nowrap text-center font-bold ${tabIndex === 1
                      ? "text-[#E2AC5D] border-b-[1.5px] border-[#E2AC5D]"
                      : "text-[#A78B7D]"
                      }`}
                  >
                    LEADERBOARD
                  </button>
                </div>
                {tabIndex === 0 && (
                  <div className="flex flex-col items-center justify-between h-[calc(728/1033*100vh)] w-[calc(321/375*100vw)]">
                    <div className="flex h-[calc(175/1033*100vh)] w-[calc(321/375*100vw)]">
                      <TournamentFilters tournamentDetail={tournamentDetail} />
                    </div>
                    <div className="flex flex-col items-center justify-center border-2 border-[#D4B588]/30 rounded-md h-[calc(220/1033*100vh)] w-[calc(321/375*100vw)]">
                      <div className="flex items-center justify-center w-[calc(317/375*100vw)] h-[calc(30/1033*100vh)]  rounded-t-md border-b-2 border-[#D4B588]/30 bg-[#3e1701]">
                        <div className="flex items-center gap-[calc(4/375*100vw)] w-[calc(281/375*100vw)] h-[calc(30/1033*100vh)]">
                          <img src={'/clash/info.svg'} />
                          <p className="text-white text-[clamp(6px,3vw,14px)] font-bold">DETAILS</p>
                        </div>
                      </div>
                      <div className="relative w-[calc(317/375*100vw)] h-[calc(195/1033*100vh)] flex items-center justify-center bg-[#4c301f]">
                        <img src={'/clash/detailsBg.png'} className="absolute rounded-md w-full h-full " />
                        <div className="w-[calc(290/375*100vw)] h-[calc(160/1033*100vh)] z-10">
                          <p className="text-white">{tournamentDetail?.details}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col rounded-md border-2 border-[#D4B588]/30 h-[calc(289/1033*100vh)] w-[calc(321/375*100vw)]">
                      <div className={`w-[calc(318/375*100vw)] h-[calc(30/1033*100vh)] border-b-2 border-[#D4B588]/30 bg-[#3e1701] rounded-t-md grid grid-cols-3 items-center text-[clamp(6px,3vw,10px)] font-semibold font-Sora text-white `}>
                        <span className="text-center">RANK</span>
                        <span className="text-center">TOTAL POINTS</span>
                        <span className="text-center">CASH PRIZE</span>
                      </div>
                      <div className={`flex flex-col gap-0.5 lg:gap-1 bg-[#4c301f] h-[calc(254/1033*100vh)] overflow-y-auto no-scrollbar`}>
                        {tournamentDetail?.prizes.map(
                          ({ id, start_rank, end_rank, points, cash_prize }, index) => {
                            const isLast = index === tournamentDetail.prizes.length - 1;
                            return (
                              <div
                                key={id}
                                className={`relative w-[calc(318/375*100vw)] h-[calc(35/1033*100vh)] grid grid-cols-3 items-center
                                ${start_rank === 1
                                    ? "bg-[linear-gradient(90deg,rgba(235,170,31,2.5)_3.56%,rgba(196,153,44,0.80)_47.88%,rgba(152,122,42,0.60)_80%,rgba(139,102,24,0.25)_98.11%)] backdrop-blur-[1.74609375px] "
                                    : start_rank === 2
                                      ? " [background:linear-gradient(90deg,rgba(238,238,238,0.50)_3.56%,rgba(238,238,238,0.30)_47.88%,rgba(238,238,238,0.50)_98.11%)] backdrop-blur-[1.74609375px]"
                                      : start_rank === 3
                                        ? " [background:linear-gradient(90deg,rgba(217,178,136,0.50)_3.56%,rgba(217,178,136,0.20)_47.88%,rgba(217,178,136,0.50)_98.11%)] backdrop-blur-[1.74609375px]"
                                        : " bg-linear-to-b from-[#4e3321] to-[#C09B64]/35"
                                  }
                                    ${isLast ? "rounded-b-md" : ""}
                                    text-[clamp(6px,3vw,10px)] font-semibold text-white
                                  `}
                              >

                                <img
                                  src={`/clash/borderRow1.png`}
                                  alt={`Rank ${start_rank} border`}
                                  className="absolute inset-0 w-full h-full "
                                />

                                <div className="w-[calc(102/375*100vw)] flex justify-center items-center h-full">
                                  {start_rank === 1 ? (
                                    <img
                                      src="/gamehub/rank1.svg"
                                      alt="Gold medal"
                                      width={23.28}
                                      height={18.62}
                                    />
                                  ) : start_rank === 2 ? (
                                    <img
                                      src="/gamehub/rank2.svg"
                                      alt="Silver medal"
                                      width={23.28}
                                      height={18.62}
                                    />
                                  ) : start_rank === 3 ? (
                                    <img
                                      src="/gamehub/rank3.svg"
                                      alt="Bronze medal"
                                      width={23.28}
                                      height={18.62}
                                    />
                                  ) : (
                                    <span className="text-center">{`${start_rank} - ${end_rank}`}</span>
                                  )}
                                </div>
                                <div className="flex justify-center items-center h-full">{points}</div>
                                <div className="flex justify-center items-center h-full">{cash_prize}</div>
                              </div>
                            )
                          }
                        )}
                      </div>
                    </div>
                  </div>

                )}
                {tabIndex === 1 && (
                  <div className={`h-[calc(773/1033*100vh)] w-[calc(321/375*100vw)] flex flex-col items-center justify-between`}>
                    {loading ? (
                      <p className="text-white">Loading...</p>
                    ) : (
                      <Table
                        data={tournamentLeaderBoard}
                        onRowClick={handleRowClick}
                        columns={tournamentLeaderBoardColumns}
                        mode="tournament"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="w-[calc(375/375*100vw)] h-[calc(30/812*100vh)]"></div>
            <CommonPopup
              isOpen={isConfirmOpen}
              title="Confirmation"
              message={confirmMessage}
              buttonText="Yes"
              onButtonClick={handleYesClick}
              secondaryButtonText="No"
              onSecondaryButtonClick={() => setIsConfirmOpen(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TournamentDetailPage;
