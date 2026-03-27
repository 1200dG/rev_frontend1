"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import AdminTableCard from "../adminTableCard";
import TableLoader from "../dotsLoader";
import { Tournament } from "@/lib/types/admin";
import Dropdown from "../../dropdown";
import Pagination from "../pagination";
import { getTournamentDataById } from "@/lib/services/common/adminActions";
import { AllRiddlesSeason, Level } from "@/lib/types/common/types";
import { Pen, Trash2, ArrowLeft, Plus, Pencil } from "lucide-react";
import TournamentLeaderboardPage from "./TournamentLeaderboard";
import { CreatePrizeRequest } from "@/lib/types/common/types";
import AddRiddleModal from "../../admin/modalCards/addTournamentModal";
import {
  createCustomPrize,
  deleteCustomPrize,
  getCustomPrizes,
  updateCustomPrize,
  deleteTournamentLevel,
} from "@/lib/services/common/adminActions";
import { toast } from "react-toastify";
import { ConfirmationModal } from "../modalCards/confirmationModal/ConfirmationModal";
import { AxiosError } from "axios";
import { handleApiError } from "@/lib/errorHandler";
import AllRiddles from "../riddles/AllRiddlesSeason";
interface TournamentDetailsCardProps {
  tournament: Tournament;
  onClose: () => void;
}

interface CustomRow {
  id?: number;
  startRank: string;
  endRank: string;
  cashPrize: string;
  isEditing: boolean;
  isNew?: boolean;
}

const TournamentDetailsCard: React.FC<TournamentDetailsCardProps> = ({
  tournament,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [levels, setLevels] = useState<Level[]>([]);
  const [tournamentSearch, setTournamentSearch] = useState("");
  const [customRows, setCustomRows] = useState<CustomRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const levelsPerPage = 5;
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const [isAddRiddleModalOpen, setIsAddRiddleModalOpen] = useState(false);
  const [previousRow, setPreviousRow] = useState<CustomRow | null>(null);
  const [showLevelConfirm, setShowLevelConfirm] = useState(false);
  const [showAllRiddles, setShowAllRiddles] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState<{ levelId: number; index: number } | null>(null);

  const handleOpenAddRiddleModal = () => setIsAddRiddleModalOpen(true);
  const handleCloseAddRiddleModal = () => setIsAddRiddleModalOpen(false);

  // Fetch tournament data
  const fetchTournamentDetails = useCallback(async () => {
    if (!tournament?.id) return;

    setIsLoading(true);
    try {
      const data = await getTournamentDataById(tournament.numericId);
      setLevels(data.levels || []);
      const prizes = (data.prizes || [])

      if (!Array.isArray(prizes)) {
        console.warn("Prizes not found or invalid:", prizes);
        setCustomRows([]);
        return;
      }

      const mapped = prizes.map((p) => ({
        id: p.id,
        startRank: p.start_rank?.toString() ?? "",
        endRank: p.end_rank?.toString() ?? "",
        cashPrize: p.cash_prize != null ? parseFloat(p.cash_prize).toFixed(2) : "0.00",
        isEditing: false,
      }));

      setCustomRows(mapped);

    } catch (error) {
      handleApiError(error, "Failed to load tournament details.");
    } finally {
      setIsLoading(false);
    }
  }, [tournament]);

  useEffect(() => {
    fetchTournamentDetails();
  }, [fetchTournamentDetails]);



  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) {
        setCustomRows((prev) =>
          prev.map((row) => ({
            ...row,
            isEditing: false, 
          }))
        );
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLevels = levels.filter((level) =>
    level.riddle_title?.toLowerCase().includes(tournamentSearch.toLowerCase())
  );

  useEffect(() => {
    const totalPages = Math.ceil(filteredLevels.length / levelsPerPage) || 1;
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredLevels.length, currentPage]);

  const totalPages = Math.ceil(filteredLevels.length / levelsPerPage);
  const currentLevels = filteredLevels.slice(
    (currentPage - 1) * levelsPerPage,
    currentPage * levelsPerPage
  );

  const onViewLeaderboard = () => setShowLeaderboard(true);
  if (showLeaderboard)
    return (
      <TournamentLeaderboardPage
        tournament={tournament}
        onBack={() => setShowLeaderboard(false)}
      />
    );

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  // Add Row
  const handleAddRow = () => {
    let start = "";
    let end = "";

    if (customRows.length < 3) {
      // Auto-fill first 3 ranks
      const usedRanks = customRows
        .map((row) => Number(row.startRank))
        .filter((rank) => rank >= 1 && rank <= 3);

      const possibleRanks = [1, 2, 3];
      const missingRank = possibleRanks.find((rank) => !usedRanks.includes(rank));

      if (missingRank) {
        start = String(missingRank);
        end = String(missingRank);
      }
    } else {
      // From 4th row onward, startRank = last row's endRank + 1
      const lastRow = customRows[customRows.length - 1];
      const lastEndRank = Number(lastRow.endRank) || 0;

      start = String(lastEndRank + 1);
      end = ""; // leave end empty for user to fill
    }

    const newRow: CustomRow = {
      startRank: start,
      endRank: end,
      cashPrize: "",
      isEditing: true,
      isNew: true,
    };

    setCustomRows((prev) => [...prev, newRow]);
  };

  // Handle Input Change
  type RowField = "startRank" | "endRank" | "points" | "cashPrize";
  const handleInputChange = (index: number, field: RowField, value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) return;

    setCustomRows((prev) => {
      const updated = prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      );
      return updated;
    });
  };

  // Save Row
  const handleSaveRow = async (index: number) => {
    try {
      const row = customRows[index];
      const clashId = tournament?.numericId;

      if (!clashId) {
        toast.error("Missing Tournament ID.");
        return;
      }

      // If cashPrize is empty, treat it as 0
      const formattedCashPrize = row.cashPrize
        ? parseFloat(row.cashPrize).toFixed(2)
        : "0.00";

      const payload: CreatePrizeRequest = {
        tournament: clashId,
        start_rank: Number(row.startRank),
        end_rank: Number(row.endRank),
        cash_prize: parseFloat(formattedCashPrize),
      };

      if (!row.id) {
        // Create new prize
        const response = await createCustomPrize(clashId, payload);
        const updatedRow = {
          ...row,
          id: response.id,
          isEditing: false,
          isNew: false,
          cashPrize: formattedCashPrize, // <-- ensure 0.00 shows immediately
        };

        setCustomRows((prev) =>
          prev.map((r, i) => (i === index ? updatedRow : r))
        );

        toast.success("Prize added successfully!");
      } else {
        // Update existing prize
        await updateCustomPrize(clashId, row.id, payload);

        setCustomRows((prev) =>
          prev.map((r, i) =>
            i === index
              ? {
                  ...r,
                  isEditing: false,
                  startRank: String(payload.start_rank ?? ""),
                  endRank: String(payload.end_rank ?? ""),
                  cashPrize: formattedCashPrize, // <-- ensure 0.00 shows immediately
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error("Error updating prize:", error);
    }
  };

  const handleRemoveLevel = (levelId: number, index: number) => {
    if (!tournament?.numericId) {
      toast.error("Missing Tournament ID.");
      return;
    }
    setLevelToDelete({ levelId, index });
    setShowLevelConfirm(true);
  };

  const confirmRemoveLevel = async (): Promise<boolean> => {
    if (!levelToDelete || !tournament?.numericId) return false;

    try {

      await deleteTournamentLevel(tournament.numericId, levelToDelete.levelId);
      setLevels((prev) => prev.filter((lvl) => lvl.id !== levelToDelete.levelId));
      toast.success("Level removed successfully!");
      setShowLevelConfirm(false);
      setLevelToDelete(null);
      return true;
    } catch (error) {
      handleApiError(error, "Failed to remove level. Please try again.");
      setShowLevelConfirm(false);
      setLevelToDelete(null);
      return false;
    }
  };


  const handleEditRow = (index: number) => {
    setCustomRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, isEditing: true } : row))
    );
    setPreviousRow(customRows[index]);
  };

  // Delete Row
  const handleDeleteRow = async (index: number) => {
    try {
      const row = customRows[index];
      const clashId = tournament?.numericId;

      if (!clashId) {
        toast.error("Missing Tournament ID.");
        return;
      }

      if (row.id) {
        await deleteCustomPrize(clashId, row.id);
      } else {
        toast.info("Row not yet saved to backend, removed locally only.");
      }

      setCustomRows((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {

      handleApiError(error, "Failed to delete prize. Please try again.");
    }
  };

  if (isLoading) return null;

  const isEditingAnyRow = customRows.some((row) => row.isNew);

  return (
    <>
      {showAllRiddles ? (
        <AllRiddles
          levels={levels}
          onClose={() => setShowAllRiddles(false)}
          selectedTournamentId={tournament.numericId}
          onDataChange={fetchTournamentDetails}
        />
      ) : (
        <>
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="flex cursor-pointer items-center gap-2 bg-[#E0E0E0] hover:bg-[#CFCFCF] text-[#212B36] px-4 py-2"
            >
              <ArrowLeft size={16} />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          <AdminTableCard
            title={`TOURNAMENT | #${tournament.id}`}
            headerActions={
              <div className="flex items-center gap-3 w-full md:w-auto">
                

                <div className="flex items-center border border-[#919EAB52] rounded-lg px-3 py-2 gap-1 w-full md:w-64">
                  <img src="/admin/search.svg" alt="search icon" />
                  <input
                    type="search"
                    placeholder="Search"
                    className="w-full placeholder:text-[#919EAB] text-[#212B36] text-md font-normal focus:outline-none"
                    value={tournamentSearch}
                    onChange={(e) => setTournamentSearch(e.target.value)}
                  />
                </div>

                <button
                  className={`flex justify-center items-center ${tournament?.status !== "PENDING" ? "bg-gray-400 cursor-not-allowed" : "bg-[#22222C] hover:bg-[#454F5B] cursor-pointer"} px-2 gap-2 w-full md:w-50 h-10`}
                  onClick={() => setShowAllRiddles(true)} disabled={tournament.status !== "PENDING"}
                >
                  <Pencil size={16} color="white" />
                  <span className="text-white text-sm font-medium"> Edit Level Number </span>
                </button>

                <button
                  onClick={onViewLeaderboard}
                  className="flex cursor-pointer items-center gap-2 bg-[#212B36] hover:bg-[#454F5B] text-white px-4 py-2"
                >
                  <span className="text-s font-medium">View Leaderboard</span>
                </button>

                <button
                  onClick={() => {
                    setIsAddRiddleModalOpen(true);
                  }}
                  disabled={tournament.status !== "PENDING"}
                  className={`flex md:flex-none gap-2 ${tournament?.status !== "PENDING" ? "bg-gray-400 cursor-not-allowed" : "bg-[#22222C] hover:bg-[#454F5B] cursor-pointer"} items-center text-sm text-white px-4 py-2 w-full md:w-auto h-10`}
                >
                  <Plus size={18} />
                  <span className="text-s font-medium">Add Riddles</span>
                </button>
              </div>
            }
          >
            {/* Tournament Levels Table */}
            <div>
              <div className="overflow-visible">
                <div className="grid grid-cols-3 text-xs bg-[#FAFAFC] uppercase text-[#32475CDE] font-medium sticky top-0">
                  <div className="p-4">Level Number</div>
                  <div className="p-4">Level ID</div>
                  <div className="p-4">Title</div>
                </div>
              </div>

              {isLoading ? (
                <TableLoader message="Loading levels..." />
              ) : currentLevels.length > 0 ? (
                currentLevels.map((level, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-3 text-sm text-[#32475CDE] font-medium ${index < currentLevels.length - 1
                      ? "border-b border-[#32475C1F]"
                      : ""
                      }`}
                  >
                    <div className="px-4 py-5">{level.level_number}</div>
                    <div className="px-4 py-5">#{level.riddle_level_id}</div>
                    <div className="flex justify-between items-center">
                      <div className="px-4 py-5">{level.riddle_title}</div>
                      {tournament.status !== "ACTIVE" && tournament.status !== "CONCLUDED" && (

                      <Dropdown
                        options={["Remove"]}
                        placeholder=""
                        value=""
                        onChange={(option) => {
                          if (option === "Remove")
                            handleRemoveLevel(level.id, index);
                        }}
                      />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-gray-500">
                  No levels found.
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </AdminTableCard>

          {/* Custom Ranking Table */}
          <div className="pt-6 flex justify-start">
            <div
              ref={tableRef}
              className="w-full md:w-1/2 border border-[#E0E0E0] rounded-md overflow-hidden shadow-sm bg-white"
            >
              <div className="grid grid-cols-3 text-xs bg-[#FAFAFC] uppercase text-[#32475CDE] font-medium items-center">
                <div className="p-3 text-center">Ranking</div>
                <div className="p-3 text-center">CASH PRIZE</div>
                <div className="p-1 flex justify-center">
                  <button
                    onClick={handleAddRow}
                    disabled={tournament.status !== "PENDING" || isEditingAnyRow}
                    className={`flex gap-2 text-sm cursor-pointer ${tournament?.status !== "PENDING" || isEditingAnyRow ? "bg-gray-400 cursor-not-allowed" : "bg-[#22222C] hover:bg-[#454F5B] cursor-pointer"} text-white px-4 py-2`}
                  >
                    <Plus size={18} />
                    <span className="text-s font-medium">Add Row</span>
                  </button>
                </div>
              </div>

              {customRows.length === 0 ? (
                <div className="text-center text-sm text-gray-500 py-6">
                  No rows yet. Click <strong> Add Row</strong> to start.
                </div>
              ) : (
                customRows.map((row, index) => {
                  const isLastRow = index === customRows.length - 1;
                  const isTournamentLocked =
                    tournament.status === "ACTIVE" || tournament.status === "CONCLUDED";
                  const canDelete = isLastRow && !isTournamentLocked;

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-3 border-t border-[#E0E0E0] bg-white text-sm text-[#32475CDE]"
                    >
                      
                      {row.isEditing ? (
                      
                        <>
                          <div className="flex justify-center gap-2 p-2 border-r">
                            <input
                              type="text"
                              className="w-16 p-2 text-center border rounded-md outline-none"
                              placeholder="Start"
                              value={row.startRank}
                              onChange={(e) =>
                                handleInputChange(index, "startRank", e.target.value)
                              }
                              disabled={index < 3}
                            />
                            <input
                              type="text"
                              className="w-16 p-2 text-center border rounded-md outline-none"
                              placeholder="End"
                              value={row.endRank}
                              onChange={(e) =>
                                handleInputChange(index, "endRank", e.target.value)
                              }
                              disabled={index < 3}
                            />
                          </div>

                          <input
                            type="text"
                            className="p-3 border-r outline-none text-center"
                            placeholder="Cash Prize"
                            value={row.cashPrize}
                            onChange={(e) =>
                              handleInputChange(index, "cashPrize", e.target.value)
                            }
                          />

                          {(() => {
                            const start = Number(row.startRank);
                            const end = Number(row.endRank);
                            const isRowValid =
                              row.startRank !== "" &&
                              row.endRank !== "" &&
                              !isNaN(start) &&
                              !isNaN(end) &&
                              end >= start;

                            return (
                              <div className="flex justify-center items-center">
                                <button
                                  className={`text-white bg-[#212B36] hover:bg-[#454F5B] m-2 text-m px-6 py-1 ${ !isRowValid ? "opacity-50 cursor-not-allowed hover:bg-[#212B36]" : "cursor-pointer" }`}
                                  onClick={() => handleSaveRow(index)}
                                  disabled={!isRowValid}
                                >
                                  {row.isNew ? "Save" : "Update"}
                                </button>
                              </div>
                            );
                          })()}
                        </>
                      ) : (
                        <>
                          <div className="p-3 text-center">
                            {row.startRank === row.endRank || !row.endRank
                              ? row.startRank
                              : `${row.startRank}-${row.endRank}`}
                          </div>
                          <div className="p-3 text-center">{row.cashPrize}</div>
                          <div className="flex justify-center items-center gap-3 p-2">
                            <button className={`${tournament.status === "ACTIVE" || tournament.status === "CONCLUDED" ? "text-gray-400 hover:cursor-not-allowed" : "text-[#212B36] cursor-pointer hover:underline" }`}      
                              onClick={() => handleEditRow(index)}
                              disabled={tournament.status === "ACTIVE" || tournament.status === "CONCLUDED"}
                            >
                              <Pen size={18} className="text-blue-500" />
                            </button>
                            <button className={`${!canDelete ? "text-gray-400 cursor-not-allowed" : "text-[#212B36] cursor-pointer hover:underline" }`}
                              onClick={() => handleDeleteRow(index)}
                              disabled={!canDelete}
                            >
                              <Trash2 size={18} color={canDelete ? "red" : "#BDBDBD"} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={showLevelConfirm}
        onClose={() => {
          setShowLevelConfirm(false);
          setLevelToDelete(null);
        }}
        onConfirm={confirmRemoveLevel}
        title="Remove Level"
        description={`Are you sure you want to delete ?`}
        confirmText="Remove"
        cancelText="Cancel"
      />

      <AddRiddleModal
        isOpen={isAddRiddleModalOpen}
        onClose={handleCloseAddRiddleModal}
        tournamentNumericId={tournament.numericId}
        onRiddlesAdded={async (selectedRiddleIds) => {
          handleCloseAddRiddleModal();
          // Refetch tournament data to update the levels list
          await fetchTournamentDetails();
        }}
      />
    </>
  );
};

export default TournamentDetailsCard;
