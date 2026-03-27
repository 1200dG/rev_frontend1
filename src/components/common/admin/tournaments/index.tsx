"use client";
import React, { useMemo, useState, useCallback } from "react";
import { TournamentsProps, Tournament } from "@/lib/types/admin";
import { filterBySearchTerm } from "@/lib/utils/admin";
import Dropdown from "../../dropdown";
import AddTournamentModal from "../modalCards/tournamentModal";
import AdminTableCard from "../adminTableCard";
import TableLoader from "../dotsLoader";
import Pagination from "../pagination";
import { TournamentEditData } from "@/lib/types/admin";
import TournamentDetailsCard from "./TournamentDetails";
import { ConfirmationModal } from "../modalCards/confirmationModal/ConfirmationModal";
import { handleApiError } from "@/lib/errorHandler";

const TournamentsTable: React.FC<TournamentsProps> = React.memo(
  ({ tournaments: initialTournaments, onDataChange, isLoading = false }) => {
    const [tournaments, setTournaments] = useState(initialTournaments);
    const [tournamentSearch, setTournamentSearch] = useState("");
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [tournamentToDelete, setTournamentToDelete] = useState<{ id: number; title: string } | null>(null);

    const [modalState, setModalState] = useState<{
      isOpen: boolean;
      mode: "create" | "edit" | "duplicate";
      editingTournament: TournamentEditData | null; 
    }>({
      isOpen: false,
      mode: "create",
      editingTournament: null,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    React.useEffect(() => {
      setTournaments(initialTournaments);
    }, [initialTournaments]);

    const filteredTournaments = useMemo(
      () => filterBySearchTerm(tournaments, tournamentSearch),
      [tournaments, tournamentSearch]
    );

    const paginatedTournaments = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredTournaments.slice(startIndex, endIndex);
    }, [filteredTournaments, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage);

    React.useEffect(() => {
      if (
        filteredTournaments.length > 0 &&
        paginatedTournaments.length === 0 &&
        currentPage > 1
      ) {
        const newTotalPages = Math.ceil(
          filteredTournaments.length / itemsPerPage
        );
        const newCurrentPage = Math.min(currentPage, newTotalPages);
        setCurrentPage(newCurrentPage);
      }
    }, [
      filteredTournaments.length,
      paginatedTournaments.length,
      currentPage,
      itemsPerPage,
    ]);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    const handleCreateTournament = () => {
      setModalState({ isOpen: true, mode: "create", editingTournament: null });
    };

    const handleEditTournament = (tournament: TournamentEditData) => {
      setModalState({
        isOpen: true,
        mode: "edit",
        editingTournament: tournament,
      });
    };

    const handleDuplicateTournament = (tournament: TournamentEditData) => {
      setModalState({
        isOpen: true,
        mode: "duplicate",
        editingTournament: tournament,
      });
    };

    const handleDropdownAction = async (
      action: string,
      tournament: Tournament
    ) => {
      if (action === "Edit") {
        const editData: TournamentEditData = {
          id: tournament.id,
          numericId: tournament.numericId,
          title: tournament.title,
          paid: tournament.paid,
          start_date: tournament.start_date,
          end_date: tournament.end_date,
          price: tournament.price,
          status: tournament.status,
          description: tournament.description,
        };
        handleEditTournament(editData);
      } else if (action === "Delete") {
        setTournamentToDelete({
          id: tournament.numericId,
          title: tournament.title,
        });
        setShowConfirm(true);
      } else if (action === "Active") {
        await handleUpdateTournamentStatus(tournament.numericId, "ACTIVE");
      } else if (action === "Concluded") {
        await handleUpdateTournamentStatus(tournament.numericId, "CONCLUDED");
      }
      else if(action === "Duplicate"){
        const editData: TournamentEditData = {
          id: "",
          numericId: tournament.numericId,
          title: "",
          paid: "",
          start_date: "",
          end_date: "",
          price: "",
          status: "",
          description: "",
        };
         handleDuplicateTournament(editData);
      }
    };

    const handleSaveTournament = useCallback(() => {
      onDataChange?.();
    }, [onDataChange]);

    const handleDeleteTournament = useCallback(
      async (id: number) => {
        try {
          const { deleteTournament } = await import(
            "@/lib/services/common/adminActions"
          );
          await deleteTournament(id);
          onDataChange?.();
        } catch (err) {
          console.error("Error deleting tournament:", err);
          throw err;
        }
      },
      [onDataChange]
    );

    const handleUpdateTournamentStatus = useCallback(
      async (tournamentId: number, status: string) => {
        try {
          const { updateTournamentStatus } = await import(
            "@/lib/services/common/adminActions"
          );
          await updateTournamentStatus(tournamentId.toString(), status);
          onDataChange?.();
        } catch (err) {
          handleApiError(err, "Failed to update tournament status. Please try again.");
        }
      },
      [onDataChange]
    );

    const handleConfirmDelete = async (): Promise<boolean> => {
      if (!tournamentToDelete) return false;
      try {
        await handleDeleteTournament(tournamentToDelete.id);
        setShowConfirm(false);
        setTournamentToDelete(null);
        return true;
      } catch (error) {
        handleApiError(error, "Failed to delete tournament. Please try again.");
        setShowConfirm(false);
        return false;
      }
    };

    return (
      <>
        {selectedTournament ? (
          <TournamentDetailsCard
            tournament={selectedTournament}
            onClose={() => setSelectedTournament(null)}
          />
        ) : (
          <>
            <AdminTableCard
              title="Tournament"
              headerActions={
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#919EAB52] rounded-lg px-3 py-2 gap-1 md:gap-2 w-full max-w-48 md:max-w-xs">
                    <img src="/admin/search.svg" />
                    <input
                      type="search"
                      placeholder="Search"
                      className="w-full placeholder:text-[#919EAB] text-[#212B36] text-md font-normal focus:outline-none"
                      value={tournamentSearch}
                      onChange={(e) => setTournamentSearch(e.target.value)}
                    />
                  </div>
                  <button
                    className="flex justify-center items-center gap-2 bg-[#22222C] hover:bg-[#454F5B] w-full h-10 cursor-pointer px-2"
                    onClick={handleCreateTournament}
                  >
                    <img src="/admin/plus.svg" />
                    <span className="text-white text-sm font-medium">
                      Create Tournament
                    </span>
                  </button>
                </div>
              }
            >
              <div className="overflow-visible">
                <div className="grid grid-cols-4 text-xs min-w-[800px] bg-[#FAFAFC] uppercase text-[#32475CDE] font-medium sticky top-0">
                  <div className="flex justify-between p-4">
                    Tournament ID
                    <i className="border border-[#32475C1F]" />
                  </div>
                  <div className="flex justify-between p-4">
                    Title
                    <i className="border border-[#32475C1F]" />
                  </div>
                  <div className="flex justify-between p-4">
                    Paid
                    <i className="border border-[#32475C1F]" />
                  </div>
                  <div className="flex justify-between p-4">
                    Status
                    <i className="border border-[#32475C1F]" />
                  </div>
                </div>
                <div>
                  {isLoading ? (
                    <TableLoader message="Loading tournaments..." />
                  ) : paginatedTournaments.length > 0 ? (
                    paginatedTournaments.map((tournament, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedTournament(tournament)}
                        className={`grid grid-cols-4 text-sm cursor-pointer min-w-[800px] text-[#32475CDE] hover:bg-gray-100 transition-colors duration-200 font-medium ${index < paginatedTournaments.length - 1
                            ? "border-b border-[#32475C1F]"
                            : ""
                          }`}
                      >
                        <div className="px-4 py-5">#{tournament.id}</div>
                        <div className="px-4 py-5">{tournament.title}</div>
                        <div className="px-4 py-5">{tournament.paid}</div>
                        <div className="flex justify-between ps-4 py-5">
                          <div className="flex items-center gap-3.5">
                            <span
                              className={`inline-block text-xs font-bold px-3 py-1 rounded-md select-none ${tournament.status === "ACTIVE"
                                  ? "bg-[#54D62C29] text-[#229A16]"
                                  : tournament.status === "CONCLUDED"
                                    ? "bg-[#FF484229] text-[#B72136]"
                                    : "bg-[#FFE0C5] text-[#BD6213]"
                                }`}
                            >
                              {tournament.status}
                            </span>
                            <span
                              className={`inline-block text-xs font-bold px-3 py-1 rounded-md select-none ${tournament.result_status === "ANALYZE RESULTS"
                                  ? "bg-[#FF7F0F]/16 text-[#FF8000]"
                                  : tournament.result_status === "SUBMITTED"
                                    ? "bg-[#FF7F0F]/16 text-[#FF1E00]"
                                    : "opacity-0"
                                }`}
                            >
                              {tournament.result_status}
                            </span>
                          </div>
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex justify-end items-center"
                          >
                            <Dropdown
                              options={[ "Edit", "Active", "Concluded", "Duplicate", "Delete" ]}
                              placeholder=""
                              value=""
                              onChange={async (selectedOption) => {
                                if (selectedOption) {
                                  await handleDropdownAction(
                                    selectedOption,
                                    tournament
                                  );
                                }
                              }}
                              status={tournament.status}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-sm text-gray-500"> No results found. </div>
                  )}
                </div>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </AdminTableCard>
            <AddTournamentModal
              isOpen={modalState.isOpen}
              onClose={() =>
                setModalState({
                  isOpen: false,
                  mode: "create",
                  editingTournament: null,
                })
              }
              editData={modalState.editingTournament}
              mode={modalState.mode}
              onSave={() => handleSaveTournament()}
              onDelete={() =>
                modalState.editingTournament?.numericId &&
                handleDeleteTournament(modalState.editingTournament.numericId)
              }
            />
            <ConfirmationModal
              isOpen={showConfirm}
              onClose={() => {
                setShowConfirm(false);
                setTournamentToDelete(null);
              }}
              onConfirm={handleConfirmDelete}
              title="Delete Tournament"
              description={`Are you sure you want to delete the tournament ? `}
              confirmText="Delete"
              cancelText="Cancel"
            />
          </>
        )}
      </>
    );
  }
);

TournamentsTable.displayName = "TournamentsTable";

export default TournamentsTable;
