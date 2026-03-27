import React, { useState, useEffect } from "react";
import AdminTableCard from "../adminTableCard";
import TableLoader from "../dotsLoader";
import { getTournamentLeaderboard } from "@/lib/services/common/adminActions";
import { ArrowLeft, ArrowDownToLine } from "lucide-react";
import { Tournament } from "@/lib/types/admin";
import { exportToCSV } from "@/lib/utils/admin";
import {
  distributePrizes,
  getCustomPrizes,
} from "@/lib/services/common/adminActions";
import { toast } from "react-toastify";
import { handleApiError } from "@/lib/errorHandler";

interface LeaderboardEntry {
  id: number;
  rank: number;
  total_points: number;
  time_played: string;
  user: {
    id?: number;
    name?: string;
  };
}

interface LeaderboardViewProps {
  tournament: Tournament;
  onBack: () => void;
}

interface CustomRow {
  startRank: number;
  endRank: number;
  cashPrize: number;
}

const TournamentLeaderboardPage: React.FC<LeaderboardViewProps> = ({
  tournament,
  onBack,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customRows, setCustomRows] = useState<CustomRow[]>([]);
  const [isDistributed, setIsDistributed] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {

        const data = await getTournamentLeaderboard(tournament?.numericId);

        let normalized: LeaderboardEntry[] = [];

        if (Array.isArray(data)) {
          normalized = data as LeaderboardEntry[];
        } else {
          toast.warn("Unexpected leaderboard format:", data);
        }
        if (mounted) {
          setLeaderboard(normalized);
        }
      } catch (err) {
        if (mounted) setLeaderboard([]);
        handleApiError(err)
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (tournament?.numericId || tournament?.id) {
      fetchLeaderboard();
    } else {
      toast.warn(
        "Tournament prop missing numericId/id — skipping leaderboard fetch."
      );
      setIsLoading(false);
      setLeaderboard([]);
    }

    return () => {
      mounted = false;
    };
  }, [tournament]);

  useEffect(() => {
    const fetchCustomPrizes = async () => {
      try {
        if (!tournament?.numericId) {
          toast.warn("Missing tournament ID, skipping custom prize fetch.");
          return;
        }

        // getCustomPrizes returns { is_distributed, prizes }
        const { is_distributed, prizes } = await getCustomPrizes(tournament.numericId);

        // Update distribution state
        setIsDistributed(is_distributed ?? null);

        // Map data safely
        const mapped =
          prizes?.map((p) => ({
            id: p.id,
            startRank: p.start_rank,
            endRank: p.end_rank,
            cashPrize: Number(p.cash_prize),
          })) ?? [];

        setCustomRows(mapped);
      } catch (err) {
        handleApiError(err)
        toast.error("Failed to load custom prizes.");
        setIsDistributed(null); // fallback
      }
    };

    fetchCustomPrizes();
  }, [tournament]);

  const filteredData = leaderboard.filter(
    (entry) =>
      entry.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user?.id?.toString().includes(searchTerm)
  );

  const handleExport = () => {
    if (filteredData.length === 0) {
      toast.info("No leaderboard data to export");
      return;
    }

    // Transform to flat CSV-friendly objects
    const exportData = filteredData.map((entry) => ({
      Rank: entry.rank,
      AccountID: entry.user?.id ?? "-",
      UserName: entry.user?.name ?? "-",
      Points: entry.total_points ?? "-",
      TimePlayed: entry.time_played ?? "-",
    }));

    exportToCSV(
      `tournament_${tournament?.numericId ?? tournament?.id ?? "leaderboard"
      }.csv`,
      exportData
    );
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitPrizes = async () => {
    try {
      setIsSubmitting(true);

      const clashId = tournament?.numericId;

      if (!clashId) {
        toast.error("Missing Tournament ID — unable to distribute prizes.");
        setIsSubmitting(false);
        return;
      }

      // const payload: DistributePrizesRequest = {
      //   prizes: customRows.map((r) => ({
      //     start_rank: Number(r.startRank),
      //     end_rank: Number(r.endRank),
      //     cashPrize: Number(r.cashPrize),
      //   })),
      // };

      const response = await distributePrizes(clashId);

      if (response.success) {
        setIsSubmitted(true);
      } else if (response?.errors?.detail === "Prizes already distributed.") {
        toast.info(
          "ℹ️ Prizes for this tournament have already been distributed."
        );
        setIsSubmitted(true); 
      } else {
        toast.error(response.message || "Failed to distribute prizes.");
      }
    } catch (error) {
      console.error("Error distributing prizes:", error);
      handleApiError(error)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <button onClick={onBack} className="flex cursor-pointer items-center gap-2 bg-[#E0E0E0] hover:bg-[#CFCFCF] text-[#212B36] px-4 py-2" >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <AdminTableCard
        title={`TOURNAMENT | #${tournament?.id ?? tournament?.numericId ?? ""}`}
        headerActions={
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center border border-[#919EAB52] rounded-lg px-3 py-2 gap-1 w-full md:w-64">
              <img src="/admin/search.svg" alt="search icon" />
              <input
                type="search"
                placeholder="Search by name or ID"
                className="w-full placeholder:text-[#919EAB] text-[#212B36] text-md font-normal focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={handleExport}
              disabled={filteredData.length === 0}
              className={`flex items-center gap-2 px-4 py-2 text-m font-medium ${
                filteredData.length === 0
                  ? "bg-gray-400 cursor-not-allowed text-gray-200" 
                  : "bg-[#212B36] hover:bg-[#454F5B] text-white cursor-pointer" 
              }`}
            >
              <ArrowDownToLine size={18} />
              <span>Export</span>
            </button>
          </div>
        }
      >
        {isLoading ? (
          <TableLoader message="Loading leaderboard..." />
        ) : filteredData.length > 0 ? (
          <div className="overflow-visible">
            <div className="grid grid-cols-5 text-xs min-w-[800px] bg-[#FAFAFC] uppercase text-[#32475CDE] font-medium">
              <div className="flex justify-between p-4">
                Rank
                <i className="border border-[#32475C1F]" />
              </div>
              <div className="flex justify-between p-4">
                AccountID
                <i className="border border-[#32475C1F]" />
              </div>
              <div className="flex justify-between p-4">
                User Name
                <i className="border border-[#32475C1F]" />
              </div>
              <div className="flex justify-between p-4">
                Points
                <i className="border border-[#32475C1F]" />
              </div>
              <div className="flex justify-between p-4">
                Time Played
                <i className="border border-[#32475C1F]" />
              </div>
            </div>

            {filteredData.map((entry, index) => (
              <div
                key={entry.id ?? index}
                className={`grid grid-cols-5 text-sm min-w-[800px] text-[#32475CDE] font-medium ${index < filteredData.length - 1
                    ? "border-b border-[#32475C1F]"
                    : ""
                  }`}
              >
                <div className="px-4 py-5">{entry.rank}</div>
                <div className="px-4 py-5">{entry.user?.id ?? "-"}</div>
                <div className="px-4 py-5">{entry.user?.name ?? "-"}</div>
                <div className="px-4 py-5">{entry.total_points ?? "-"}</div>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="bg-[#FF563029] text-[#FF5630] px-4 py-1 rounded-md text-sm md:text-base font-semibold min-w-[120px] text-center">
                    {entry.time_played ?? "-"}
                  </span>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-6 text-sm">
            No leaderboard data found.
          </div>
        )}
      </AdminTableCard>

      <div className="flex flex-1 justify-start pt-6">
        <div className="w-full md:w-1/2 border border-[#E0E0E0] rounded-md overflow-hidden shadow-sm bg-white">
          {customRows.length === 0 ? (
            <div className="text-center text-gray-500 py-6 text-sm">
              No custom rows found
            </div>
          ) : (
            <div className="overflow-visible">
              <div className="grid grid-cols-2 text-xs min-w-[600px] bg-[#FAFAFC] uppercase text-[#32475CDE] font-medium">
                <div className="flex justify-between p-4">
                  Ranking
                  <i className="border border-[#32475C1F]" />
                </div>
                <div className="flex justify-between p-4">
                  CASH PRIZE
                  <i className="border border-[#32475C1F]" />
                </div>
              </div>

              {customRows.map((row, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-2 bg-white text-sm min-w-[600px] text-[#32475CDE] font-medium ${index < customRows.length - 1
                      ? "border-b border-[#32475C1F]"
                      : ""
                    }`}
                >
                  <div className="px-4 py-5">
                    {row.startRank === row.endRank
                      ? row.startRank ?? "-"
                      : `${row.startRank ?? "-"}–${row.endRank ?? "-"}`}
                  </div>
                  <div className="px-4 py-5">{row.cashPrize ?? "-"}</div>
                </div>
              ))}
            </div>
          )}

          {/* Only show submit section if isDistributed is NOT null */}
          {isDistributed !== null && (
            <div className="flex justify-end p-4 border-t border-[#E0E0E0] bg-[#FAFAFC]">
              <button
                onClick={handleSubmitPrizes}
                disabled={isDistributed || isSubmitting || isSubmitted || tournament.status === "ACTIVE" || tournament.status === "PENDING" || customRows.length == 0}
                className={`px-6 py-3 text-white font-medium transition ${isDistributed || isSubmitted || tournament.status === "ACTIVE" || tournament.status === "PENDING" || customRows.length == 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : isSubmitting
                      ? "bg-[#454F5B] cursor-wait"
                      : "bg-[#212B36] hover:bg-[#454F5B] cursor-pointer"
                  }`}
              >
                {isDistributed
                  ? "Prizes Already Distributed"
                  : isSubmitting
                    ? "Submitting..."
                    : "Submit"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TournamentLeaderboardPage;
