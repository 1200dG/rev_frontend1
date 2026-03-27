"use client";
import React, { useMemo, useState, useCallback, useRef, useEffect, } from "react";
import { filterBySearchTerm } from "@/lib/utils/admin";
import Dropdown from "../../dropdown";
import CreateRiddleModal from "../modalCards/riddleModal";
import SelectRiddleModal from "../modalCards/riddleModal/addRiddle";
import AdminTableCard from "../adminTableCard";
import TableLoader from "../dotsLoader";
import Pagination from "../pagination";
import { RiddleEditData } from "@/lib/types/admin";
import { RiddleData, RiddlesTableProps, SeasonData, SeasonLevelItem } from "@/lib/types/common/types";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import { ConfirmationModal } from "../modalCards/confirmationModal/ConfirmationModal";
import { handleDeleteRiddleFromDropdown1 } from "@/lib/services/common/adminActions";
import { handleApiError } from "@/lib/errorHandler";
import ImportRiddles from "../importRiddle";
import { usePathname } from "next/navigation";
import { Pencil } from "lucide-react";

const RiddlesTable: React.FC<RiddlesTableProps> = React.memo(
  ({
    riddles: initialRiddles,
    viewMode = "full",
    onDataChange,
    onRiddlesAdded,
    allRiddles = [],
    isLoading = false,
    itemsPerPage = 5,
    selectedSeasonId,
    onSeasonSelect,
    seasons: externalSeasons,
    onShowAllRiddles,
    handleSetSeasonRiddle,
  }) => {
    const [riddles, setRiddles] = useState<RiddleData[]>(initialRiddles ?? []);
    const [riddleSearch, setRiddleSearch] = useState("");
    const [showImport, setShowImport] = useState(false);
    const pathName = usePathname();
    const importRiddleButton = pathName.endsWith('riddles');
    const [modalState, setModalState] = useState<{
      isOpen: boolean;
      mode: "create" | "edit" | "add";
      editingRiddle: RiddleEditData | null;
    }>({
      isOpen: false,
      mode: "create",
      editingRiddle: null,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSeasonData, setSelectedSeasonData] = useState<SeasonData>();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [riddleToDelete, setRiddleToDelete] = useState<RiddleEditData | null>(null);
    const [riddleSeasonToDelete, setRiddleSeasonToDelete] = useState<SeasonLevelItem | null>(null);
    const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
    const seasonDropdownRef = useRef<HTMLDivElement>(null);
    const seasons = externalSeasons || [];

    const filteredRiddles = useMemo(
      () => filterBySearchTerm(riddles || [], riddleSearch),
      [riddles, riddleSearch]
    );

    const seasonLevels = useMemo(() => {
      const levels = selectedSeasonData?.levels;
      return Array.isArray(levels) ? levels : [];
    }, [selectedSeasonData?.levels?.length]);

    const filteredSeasonRiddles = useMemo(
      () => filterBySearchTerm(seasonLevels, riddleSearch),
      [seasonLevels, riddleSearch]
    );

    const paginatedSeasonLevels = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredSeasonRiddles.slice(startIndex, endIndex);
    }, [filteredSeasonRiddles, currentPage, itemsPerPage]);

    const paginatedRiddles = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredRiddles.slice(startIndex, endIndex);
    }, [filteredRiddles, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredRiddles.length / itemsPerPage);

    // useEffect(() => {
    //   const fetchRiddlesBySeason = async (seasonId: string) => {
    //     try {
    //       const response = await api.get(`riddle-list/?season_id=${seasonId}`);
    //       setRiddles(response.data.data ?? []);
    //       handleSetSeasonRiddle?.(response.data.data);
    //     } catch (err) {
    //       handleApiError(err, "Failed to fetch riddles for the selected season.");
    //       setRiddles([]);
    //     }
    //   };

    //   if (selectedSeasonData?.id) {
    //     fetchRiddlesBySeason(selectedSeasonData.id.toString());
    //   }
    // }, [selectedSeasonData]);

    useEffect(() => {
      if (!selectedSeasonData && initialRiddles && initialRiddles.length > 0) {
        setRiddles(initialRiddles);
      }

      if (!selectedSeasonData && (!initialRiddles || initialRiddles.length === 0)) {
        setRiddles([]);
      }
    }, [initialRiddles, selectedSeasonData]);

    useEffect(() => {
      if (
        filteredSeasonRiddles.length > 0 &&
        paginatedSeasonLevels.length === 0 &&
        currentPage > 1
      ) {
        const newTotalPages = Math.ceil(filteredSeasonRiddles.length / itemsPerPage);
        const newCurrentPage = Math.min(currentPage, newTotalPages);
        setCurrentPage(newCurrentPage);
      }
    }, [
      filteredSeasonRiddles.length,
      paginatedSeasonLevels.length,
      currentPage,
      itemsPerPage,
    ]);

    React.useEffect(() => {
      if (
        filteredRiddles.length > 0 &&
        paginatedRiddles.length === 0 &&
        currentPage > 1
      ) {
        const newTotalPages = Math.ceil(filteredRiddles.length / itemsPerPage);
        const newCurrentPage = Math.min(currentPage, newTotalPages);
        setCurrentPage(newCurrentPage);
      }
    }, [
      filteredRiddles.length,
      paginatedRiddles.length,
      currentPage,
      itemsPerPage,
    ]);

    useEffect(() => {
      if (!seasons || seasons.length === 0) {
        setSelectedSeasonData(undefined);
        return;
      }

      if (selectedSeasonData) {
        const updatedSeason = seasons.find(season => season.id === selectedSeasonData.id);
        if (updatedSeason) {
          setSelectedSeasonData(updatedSeason);
        } else {
          setSelectedSeasonData(seasons[0]);
          onSeasonSelect?.(seasons[0].id);
        }
      }
    }, [seasons]);


    useEffect(() => {
      if (!selectedSeasonData && seasons.length > 0) {
        const activeSeason = seasons.find(s => s.status.toUpperCase() === "ACTIVE");
        if (activeSeason) {
          setSelectedSeasonData(activeSeason);
          onSeasonSelect?.(activeSeason.id);
        } else {
          setSelectedSeasonData(seasons[0]);
          onSeasonSelect?.(seasons[0].id);
        }
      }
    }, [seasons, selectedSeasonData, onSeasonSelect]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          seasonDropdownRef.current &&
          !seasonDropdownRef.current.contains(event.target as Node)
        ) {
          setIsSeasonDropdownOpen(false);
        }
      };

      if (isSeasonDropdownOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isSeasonDropdownOpen]);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    const handleAddRiddleClick = () => {
      if (viewMode === "simple") {
        setModalState({ isOpen: true, mode: "add", editingRiddle: null });
      } else {
        setModalState({ isOpen: true, mode: "create", editingRiddle: null });
      }
    };

    const handleEditRiddle = (riddle: RiddleEditData) => {
      setModalState({ isOpen: true, mode: "edit", editingRiddle: riddle });
    };

    const handleDropdownAction = async (
      action: string,
      riddle: RiddleEditData
    ) => {
      if (action === "Edit") {
        handleEditRiddle(riddle);
      } else if (action === "Delete") {
        setRiddleToDelete(riddle);
        setOpenDeleteModal(true);
      }
      else if (action === "Add to Daily Riddle") {
        if (confirm("Do you want to add this riddle to Daily Riddles?")) {
          try {
            const res = await api.post("/admin-panel/daily-riddles/", {
              date: new Date().toISOString().split("T")[0],
              riddle: riddle.level_id,
            });
            if (res.status === 200 || res.status === 201) {
              toast.success("Riddle added to Daily Riddles successfully!");
            }
          } catch (error: unknown) {
            handleApiError(error, "Failed to add riddle to Daily Riddles.");
          }
        }
      }
    };

    const handleSaveRiddle = useCallback(() => {
      onDataChange?.();
    }, [onDataChange]);

    const handleDeleteRiddle = useCallback(() => {
      onDataChange?.();
    }, [onDataChange]);



    const handleDeleteRiddleFromDropdown = useCallback(
      (riddle: SeasonLevelItem) => {
        if (!riddle.id) {
          console.error("No riddle ID found:", riddle);
          return;
        }

        const seasonId = selectedSeasonId || selectedSeasonData?.id;
        if (!seasonId) {
          toast.error("Please select a season first!");
          return;
        }

        setRiddleSeasonToDelete(riddle);
        setOpenDeleteModal(true);
      },
      [selectedSeasonId, selectedSeasonData]
    );

    const confirmDeleteRiddle = async (riddle: SeasonLevelItem) => {
      try {
        const seasonId = selectedSeasonId || selectedSeasonData?.id;
        if (!seasonId) {
          toast.error("Please select a season first!");
          return false;
        }

        const response = await api.post(
          `/admin-panel/enigma/${seasonId}/remove-riddle/`,
          { riddle_id: riddle.id }
        );

        if (response.status === 200 || response.status === 204) {
          toast.success("Riddle removed successfully!");

          setSelectedSeasonData((prevSeason) => {
            if (!prevSeason) return prevSeason;

            const updatedLevels = prevSeason.levels?.filter(
              (lvl) => lvl.id !== riddle.id && lvl.riddle_level_id !== riddle.riddle_level_id
            );

            const temp = {
              ...prevSeason,
              levels: updatedLevels,
            };
            return temp;
          });

          onDataChange?.();
          return true;
        } else {
          throw new Error(response.data?.message || "Failed to remove riddle");
        }
      } catch (error) {
        console.error("Error deleting riddle:", error);
        handleApiError(error, "Failed to remove riddle. Please try again.");
        return false;
      }
    };

    return (
        <>
            <AdminTableCard
                title="Riddles"
                headerActions={
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-[#919EAB52] rounded-lg px-3 py-2 gap-1 md:gap-2 w-[210px]">
                            <img src="/admin/search.svg" alt="search icon" />
                            <input
                                type="search"
                                placeholder="Search"
                                className="w-full placeholder:text-[#919EAB] text-[#212B36] text-md font-normal focus:outline-none"
                                value={riddleSearch}
                                onChange={(e) => setRiddleSearch(e.target.value)}
                            />
                        </div>
                        {importRiddleButton && (
                            <button
                                className="flex justify-center items-center px-2 gap-2 bg-[#22222C] hover:bg-[#454F5B] w-[170px] h-10 cursor-pointer"
                                onClick={() => setShowImport(true)}
                            >
                                <img src="/admin/download.svg" alt="download icon" />
                                <span className="text-white text-sm font-medium">Import Riddles</span>
                            </button>
                        )}
                        {viewMode === "simple" && (
                            <>
                                <div className="relative" ref={seasonDropdownRef}>
                                    <div
                                        className="w-[200px] border-2 border-[#919EAB52] border-opacity-30 cursor-pointer rounded-lg bg-transparent flex items-center justify-between px-3 py-2"
                                        onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
                                    >
                                        <span className="text-base font-medium text-[#919EAB]">{selectedSeasonData?.title || "Select Season"}</span>
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 hover:opacity-80 ${
                                                isSeasonDropdownOpen ? "rotate-180" : ""
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    {isSeasonDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#919EAB52] border-opacity-30 rounded-lg shadow-lg z-50">
                                            {seasons.map((season) => (
                                                <div
                                                    key={season.id}
                                                    className="px-3 py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center"
                                                    onClick={() => {
                                                        setSelectedSeasonData(season);
                                                        setIsSeasonDropdownOpen(false);
                                                        onSeasonSelect?.(season.id);
                                                    }}
                                                >
                                                    {season.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    className={`flex justify-center items-center px-2 gap-2 w-[200px] h-10 ${
                                        selectedSeasonData?.status === "ACTIVE" || !selectedSeasonData
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#22222C] hover:bg-[#454F5B] cursor-pointer"
                                    }`}
                                    onClick={() => onShowAllRiddles!(selectedSeasonData || null)}
                                    disabled={selectedSeasonData?.status === "ACTIVE" || !selectedSeasonData}
                                >
                                    <Pencil size={16} color="white" />
                                    <span className="text-white text-sm font-medium"> Edit Level Number </span>
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleAddRiddleClick}
                            disabled={viewMode === "simple" && (!selectedSeasonData || selectedSeasonData?.status === "ACTIVE")}
                            className={`flex justify-center items-center px-2 gap-2 ${viewMode == "full" ? "w-[200px]" : "w-[150px]"} h-10 ${
                                viewMode === "simple" && (!selectedSeasonData || selectedSeasonData?.status === "ACTIVE")
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#22222C] hover:bg-[#454F5B] cursor-pointer"
                            }`}
                        >
                            <img src="/admin/plus.svg" alt="plus icon" />
                            <span className="text-white text-sm font-medium"> {viewMode === "full" ? "Create Riddle" : "Add Riddle"} </span>
                        </button>
                    </div>
                }
            >
                <>
                    {viewMode === "simple" ? (
                        <div>
                            <div className="grid grid-cols-3 text-xs min-w-[800px] bg-[#FAFAFC] uppercase text-[#32475CDE] font-medium sticky top-0">
                                <div className="flex justify-between p-4">
                                    Level Number
                                    <i className="border border-[#32475C1F]" />
                                </div>
                                <div className="flex justify-between p-4">
                                    Level ID
                                    <i className="border border-[#32475C1F]" />
                                </div>
                                <div className="flex justify-between p-4">
                                    Title
                                    <i className="border border-[#32475C1F]" />
                                </div>
                            </div>
                            <div>
                                {isLoading ? (
                                    <TableLoader message="Loading riddles..." />
                                ) : paginatedSeasonLevels.length > 0 ? (
                                    paginatedSeasonLevels.map((riddle, index) => (
                                        <div
                                            key={index}
                                            className={`grid grid-cols-3 text-sm min-w-[800px] text-[#32475CDE] font-medium ${
                                                index < paginatedRiddles.length - 1 || index < paginatedSeasonLevels.length - 1
                                                    ? "border-b border-[#32475C1F]"
                                                    : ""
                                            }`}
                                        >
                                            <div className="px-4 py-5">{riddle.level_number || ""}</div>
                                            <div className="px-4 py-5">#{riddle.riddle_level_id}</div>
                                            <div className="flex justify-between ps-4 py-5">
                                                <span>{riddle.riddle_title}</span>
                                                {selectedSeasonData?.status !== "ACTIVE" && (
                                                    <Dropdown
                                                        options={["Remove"]}
                                                        placeholder=""
                                                        value=""
                                                        onChange={(option) => {
                                                            if (option === "Remove") {
                                                                handleDeleteRiddleFromDropdown(riddle);
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-sm text-gray-500">
                                        No riddles selected. Click "Add Riddle" to get started.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-visible">
                            <div className="grid grid-cols-6 text-xs min-w-[800px] bg-[#FAFAFC] uppercase text-[#32475CDE] font-medium sticky top-0">
                                <div className="flex justify-between p-4">
                                    Level ID
                                    <i className="border border-[#32475C1F]" />
                                </div>
                                <div className="flex justify-between p-4">
                                    Title
                                    <i className="border border-[#32475C1F]" />
                                </div>
                                <div className="flex justify-between p-4">
                                    Solution
                                    <i className="border border-[#32475C1F]" />
                                </div>
                                <div className="flex justify-between p-4">
                                    Hint 1<i className="border border-[#32475C1F]" />
                                </div>
                                <div className="flex justify-between p-4">
                                    Hint 2<i className="border border-[#32475C1F]" />
                                </div>
                                <div className="flex justify-between p-4">
                                    Hint 3<i className="border border-[#32475C1F]" />
                                </div>
                            </div>
                            <div>
                                {isLoading ? (
                                    <TableLoader message="Loading riddles..." />
                                ) : paginatedRiddles.length > 0 ? (
                                    paginatedRiddles.map((riddle, index) => (
                                        <div
                                            key={index}
                                            className={`grid grid-cols-6 text-sm min-w-[800px] text-[#32475CDE] font-medium ${
                                                index < paginatedRiddles.length - 1 ? "border-b border-[#32475C1F]" : ""
                                            }`}
                                        >
                                            <div className="px-4 py-5">{riddle.level_id}</div>
                                            <div className="px-4 py-5">{riddle.title}</div>
                                            <div className="px-4 py-5">{riddle.solution.answer}</div>
                                            <div className="px-4 py-5">{riddle.hint1}</div>
                                            <div className="px-4 py-5">{riddle.hint2}</div>
                                            <div className="flex justify-between ps-4 py-5">
                                                <span>{riddle.hint3}</span>
                                                <Dropdown
                                                    options={["Edit"]}
                                                    placeholder=""
                                                    value=""
                                                    onChange={(selectedOption) => {
                                                        if (selectedOption) {
                                                            handleDropdownAction(selectedOption, riddle);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-sm text-gray-500">No results found.</div>
                                )}
                            </div>
                        </div>
                    )}
                    {selectedSeasonData ? (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(filteredSeasonRiddles.length / itemsPerPage)}
                            onPageChange={handlePageChange}
                        />
                    ) : (
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    )}
                </>
            </AdminTableCard>
            <CreateRiddleModal
                isOpen={modalState.isOpen && (modalState.mode === "create" || modalState.mode === "edit")}
                onClose={() =>
                    setModalState({
                        isOpen: false,
                        mode: "create",
                        editingRiddle: null,
                    })
                }
                riddles={riddles ?? []}
                editData={modalState.editingRiddle}
                mode={modalState.mode === "edit" ? "edit" : "create"}
                onSave={() => handleSaveRiddle()}
                onDelete={handleDeleteRiddle}
            />

            <ConfirmationModal
                isOpen={openDeleteModal}
                onClose={() => {
                    setOpenDeleteModal(false);
                    setRiddleToDelete(null);
                    setRiddleSeasonToDelete(null);
                }}
                title={selectedSeasonData ? "Remove Riddle" : "Delete Riddle"}
                description={
                    selectedSeasonData ? (
                        <>Are you sure you want to remove this riddle from the season?</>
                    ) : (
                        <>Are you sure you want to permanently delete this riddle?</>
                    )
                }
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={async () => {
                    try {
                        if (selectedSeasonData && riddleSeasonToDelete) {
                            const success = await confirmDeleteRiddle(riddleSeasonToDelete);
                            setOpenDeleteModal(false);
                            setRiddleSeasonToDelete(null);
                            return success;
                        }

                        if (riddleToDelete) {
                            await handleDeleteRiddleFromDropdown1(riddleToDelete.id);
                            setRiddles((prev) => prev.filter((r) => r.id !== riddleToDelete.id));
                            onDataChange?.();
                            setOpenDeleteModal(false);
                            setRiddleToDelete(null);
                            return true;
                        }
                        return false;
                    } catch (err) {
                        handleApiError(err, "Failed to delete riddle. Please try again.");
                        setOpenDeleteModal(false);
                        return false;
                    }
                }}
            />

            <SelectRiddleModal
                isOpen={modalState.isOpen && modalState.mode === "add"}
                onClose={() =>
                    setModalState({
                        isOpen: false,
                        mode: "create",
                        editingRiddle: null,
                    })
                }
                onRiddlesAdded={onRiddlesAdded}
                seasonDataa={selectedSeasonData}
                isLoading={false}
            />
            {showImport && <ImportRiddles onClose={() => setShowImport(false)} onDataChange={onDataChange} />}
        </>
    );
  }
);

RiddlesTable.displayName = "RiddlesTable";

export default RiddlesTable;
