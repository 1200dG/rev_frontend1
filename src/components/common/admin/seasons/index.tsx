"use client";

import React, { useState, useMemo } from "react";
import { SeasonsProps, Seasons } from "@/lib/types/admin";
import Dropdown from "../../dropdown";
import CreateSeasonModal from "../modalCards/seasonModal";
import AdminTableCard from "../adminTableCard";
import TableLoader from "../dotsLoader";
import Pagination from "../pagination";
import { deleteSeason, updateSeason } from "@/lib/services/common/adminActions";
import { ConfirmationModal } from "../modalCards/confirmationModal/ConfirmationModal";
import { handleApiError } from "@/lib/errorHandler";
import { AxiosError } from "axios";
import { SeasonData } from "@/lib/types/common/types";

type Season = {
  id: number;
  title: string;
  number?: number;
  status?: string;
};

const SeasonsTable: React.FC<SeasonsProps> = React.memo(({ seasons, onDataChange, isLoading = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirm, setShowConfirm] = useState({
    deleteModal: false,
    updateModal: false,
    searchTerm: "",
    errorMessage: "",
  })
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedSeasonAction, setSelectedSeasonAction] = useState<{season: SeasonData, action: "Active" | "Inactive"} | null>(null);
  const [editSeason, setEditSeason] = useState<Season | null>(null);

  const itemsPerPage = 3;
  const filteredSeason = useMemo(() => {
    return seasons.filter((p) =>
      p.title.toLowerCase().includes(showConfirm.searchTerm.toLowerCase())
    )
  }, [showConfirm.searchTerm, seasons]);


  const paginatedSeasons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSeason.slice(startIndex, endIndex);
  }, [filteredSeason, currentPage, itemsPerPage]);

  React.useEffect(() => {
    if (seasons.length > 0 && paginatedSeasons.length === 0 && currentPage > 1) {
      const newTotalPages = Math.ceil(seasons.length / itemsPerPage);
      const newCurrentPage = Math.min(currentPage, newTotalPages);
      setCurrentPage(newCurrentPage);
    }
  }, [seasons.length, paginatedSeasons.length, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateSeason = () => {
    setEditSeason(null);
    setIsModalOpen(true);
    setModalMode("create")
  };


  const totalPages = Math.ceil(filteredSeason.length / itemsPerPage);


  const handleDropdownAction = async (action: string, season: SeasonData) => {

    if (action === "Delete") {
      setSelectedSeason(season);
      setShowConfirm((prev) => ({...prev , deleteModal: true}));
    }
    else if (action === "Edit") {
      setIsModalOpen(true);
      setEditSeason(season);
      setModalMode("edit")
    } else if (action === "Active" || action === "Inactive") {
      try {
        const newStatus = action === "Active" ? "ACTIVE" : "INACTIVE";
        await updateSeason(season.id, { status: newStatus });

        if (onDataChange) {
          onDataChange();
        }
      } catch (err) {
        const error = err as AxiosError<{ errors : {detail: string}}>
        setShowConfirm((prev) => ({...prev , updateModal: true, errorMessage: error?.response?.data?.errors?.detail || "Failed to update season data"}));
        setSelectedSeasonAction({season,action})
      }
    }
  };

  const handleSaveSeason = () => {
    if (onDataChange) {
      onDataChange();
    }
  };

  const handleEdit = async (): Promise<boolean> =>{
    if (!selectedSeasonAction) return false;
     try {
        const {season , action} = selectedSeasonAction;
        const newStatus = action === "Active" ? "ACTIVE" : "INACTIVE";
        await updateSeason(season.id, { status: newStatus, force : true });

        if (onDataChange) {
          onDataChange();
        }
        return true;
      } catch (error) {
        handleApiError(error, "Failed to update season status.");
        setShowConfirm((prev) => ({...prev , updateModal: false}));
        return false;
      }
  }

  const confirmDelete = async (): Promise<boolean> => {
    if (!selectedSeason) return false;
    try {
      await deleteSeason(selectedSeason.id);
      setShowConfirm((prev) => ({...prev , deleteModal: false}));
      if (onDataChange) onDataChange();
      return true;
    } catch (error) {
      console.error("Failed to delete season:", error);
      handleApiError(error, "Failed to delete season. Please try again.");
      setShowConfirm((prev) => ({...prev , deleteModal: false}));
      return false;
    }
  };



  return (
    <>
      <AdminTableCard
        title="Seasons"
        headerActions={
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-[#919EAB52] rounded-lg px-3 py-2 gap-1 md:gap-2 w-[200px]">
              <img src="/admin/search.svg" alt="search icon" />
              <input
                type="search"
                placeholder="Search"
                className="w-full placeholder:text-[#919EAB] text-[#212B36] text-md font-normal focus:outline-none"
                value={showConfirm.searchTerm}
                onChange={(e) => setShowConfirm((prev) => ({...prev , searchTerm: e.target.value}))}
              />
            </div>
            <button onClick={handleCreateSeason} 
              className="flex justify-center items-center px-2 gap-2 bg-[#22222C] hover:bg-[#454F5B] w-[180px] h-10 cursor-pointer"
            >
              <img src="/admin/plus.svg" />
              <span className="text-white text-sm font-medium">
                Create Season
              </span>
            </button>
          </div>
        }
      >
        <div className="overflow-visible">
          <div className="grid grid-cols-3 text-xs min-w-[800px] bg-[#FAFAFC] uppercase text-[#32475CDE] font-medium sticky top-0">
            <div className="flex justify-between p-4">
              Season Number
              <i className="border border-[#32475C1F]" />
            </div>
            <div className="flex justify-between p-4">
              Status
              <i className="border border-[#32475C1F]" />
            </div>
            <div className="flex justify-between p-4">
              Title
              <i className="border border-[#32475C1F]" />
            </div>
          </div>
          <div>
            {isLoading ? (
              <TableLoader message="Loading seasons..." />
            ) : paginatedSeasons.map((season, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 text-sm min-w-[800px] text-[#32475CDE] font-medium ${index < paginatedSeasons.length - 1 ? "border-b border-[#32475C1F]" : ""}`}
              >
                <div className="px-4 py-5">{season.id}</div>
                <div className="px-4 py-5">{season.status}</div>
                <div className="flex justify-between ps-4 py-5">
                  <span>{season.title}</span>
                  <Dropdown
                    options={["Edit", "Active", "Inactive", "Delete"]}
                    placeholder=""
                    value=""
                    onChange={async (selectedOption) => {
                      if (selectedOption) {
                       await handleDropdownAction(selectedOption, season);
                      }
                    }}
                    status = {season.status}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </AdminTableCard>
      <CreateSeasonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSeason}
        mode={modalMode}
        seasonData={editSeason}
        onDataChange={onDataChange}
      />
      <ConfirmationModal
        isOpen={showConfirm.deleteModal}
        onClose={() => setShowConfirm((prev) => ({...prev , deleteModal: false}))}
        onConfirm={confirmDelete}
        title="Delete Season"
        description={`Are you sure you want to delete ?`}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <ConfirmationModal
        isOpen={showConfirm.updateModal}
        onClose={() => setShowConfirm((prev) => ({...prev ,updateModal : false}))}
        onConfirm={handleEdit}
        title="Update Season Status"
        description={ showConfirm.errorMessage}
        confirmText="Ok"
        cancelText="Cancel"
        mode="Edit"
      />

    </>
  );
});

SeasonsTable.displayName = 'SeasonsTable';

export default SeasonsTable;
