"use client";
import React, { useMemo, useState, useEffect } from "react";
import api from "@/lib/axios";
import Dropdown from "../../dropdown";
import AdminTableCard from "../adminTableCard";
import TableLoader from "../dotsLoader";
import Pagination from "../pagination";
import DailyRiddleModal from "../modalCards/dailyRiddleModal";
import { filterBySearchTerm } from "@/lib/utils/admin";
import { DailyRiddleApiData, RiddleApiData } from "@/lib/types/common/types";
import { toast } from "react-toastify";
import { ConfirmationModal } from "../modalCards/confirmationModal/ConfirmationModal";
import { handleApiError } from "@/lib/errorHandler";
import SelectRiddleModal from "../modalCards/riddleModal/addRiddle";

interface DailyRiddlesTableProps {
  riddles: RiddleApiData[];
  dailyRiddlesData: DailyRiddleApiData[];
  onDataChange: () => void;
  isLoading: boolean;
}

interface RiddleEditData {
  id: number;
  date: string;
  riddle: number | null;
  level_id: number | null;
}

const DailyRiddlesTable: React.FC<DailyRiddlesTableProps> = React.memo(({ riddles, dailyRiddlesData, onDataChange, isLoading = false }) => {
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [dailyRiddles, setDailyRiddles] = useState(dailyRiddlesData);
  const [riddleSearch, setRiddleSearch] = useState("");
  const [openDailyRiddleModal, setOpenDailyRiddleModal] = useState(false)
  const [editingRiddle, setEditingRiddle] = useState<RiddleEditData | null>(null);
  const [dailyRiddleToDelete, setDailyRiddleToDelete] = useState<RiddleEditData | null>(null);
  const [openDailyDeleteModal, setOpenDailyDeleteModal] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "create" | "edit" | "add";
    editingRiddle: RiddleEditData | null;
  }>({
    isOpen: false,
    mode: "create",
    editingRiddle: null,
  });


  const filteredAllRiddles = riddles.filter((ridd) => ridd.type != 'URL_ACTION');
  const filteredRiddles = useMemo(
    () => filterBySearchTerm(dailyRiddles, riddleSearch),
    [dailyRiddles, riddleSearch],
  );

  const paginatedRiddles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRiddles.slice(startIndex, endIndex);
  }, [filteredRiddles, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredRiddles.length / itemsPerPage);

  useEffect(() => {
    setDailyRiddles(dailyRiddlesData);
  }, [dailyRiddlesData]);


  useEffect(() => {
    if (filteredRiddles.length > 0 && paginatedRiddles.length === 0 && currentPage > 1) {
      const newTotalPages = Math.ceil(filteredRiddles.length / itemsPerPage);
      const newCurrentPage = Math.min(currentPage, newTotalPages);
      setCurrentPage(newCurrentPage);
    }
  }, [filteredRiddles.length, paginatedRiddles.length, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddDailyRiddle = () => {
    setEditingRiddle(null);
    setOpenDailyRiddleModal(true);
  };

  const handleEditRiddle = (riddle: DailyRiddleApiData) => {
    setEditingRiddle(riddle);
    setOpenDailyRiddleModal(true);
  };

  const handleAddRiddleClick = () => {
    setModalState({ isOpen: true, mode: "add", editingRiddle: null });
  };

  const handleDropdownAction = async (action: string, riddle: RiddleEditData) => {
    try {
      if (action === "Edit") {
        handleEditRiddle(riddle as DailyRiddleApiData);
      } else if (action === "Delete") {
        setDailyRiddleToDelete(riddle);
        setOpenDailyDeleteModal(true);
      }
      // else if (action === "Add to Daily Riddle") {
      //   if (confirm("Do you want to add this riddle to Daily Riddles?")) {
      //     try {
      //       const res = await api.post("/admin-panel/daily-riddles/", {
      //         date: new Date().toISOString().split("T")[0],
      //         riddle: riddle.level_id,
      //       });
      //       alert(res?.data?.message || " Riddle added to Daily Riddles!");
      //       onDataChange();
      //     } catch (error: unknown) {
      //       const axiosError = error as AxiosError<{ errors?: Record<string, string[]>; message?: string }>;
      //       handleApiError(error)
      //     }
      //   }
      // }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      handleApiError(error)
    }
  };


  return (
    <>
      <AdminTableCard
        title="Daily Riddles"
        headerActions={
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-[#919EAB52] rounded-lg px-3 py-2 gap-1 md:gap-2 w-full max-w-48 md:max-w-xs">
              <img src="/admin/search.svg" alt="search icon" />
              <input
                type="search"
                placeholder="Search"
                className="w-full placeholder:text-[#919EAB] text-[#212B36] text-md font-normal focus:outline-none"
                value={riddleSearch}
                onChange={(e) => setRiddleSearch(e.target.value)}
              />
            </div>
            <button className="flex justify-center items-center hover:bg-[#454F5B] px-2 gap-2 bg-[#22222C] w-full h-10 cursor-pointer" onClick={handleAddRiddleClick}>
              <img src="/admin/plus.svg" alt="plus icon" />
              <span className="text-white text-sm font-medium">Add Daily Riddle</span>
            </button>
          </div>
        }
      >
        <>
          <div className="overflow-visible">
            <div className="grid grid-cols-3 text-xs min-w-[800px] bg-[#FAFAFC] uppercase text-[#32475CDE] font-medium sticky top-0">
              <div className="flex justify-between p-4">
                Date
                <i className="border border-[#32475C1F]" />
              </div>
              <div className="flex justify-between p-4">
                Title
                <i className="border border-[#32475C1F]" />
              </div>
              <div className="flex justify-between p-4">
                Level Id
                <i className="border border-[#32475C1F]" />
              </div>
            </div>
            <div>
              {isLoading ? (
                <TableLoader message="Loading riddles..." />
              ) : paginatedRiddles.length > 0 ? (
                paginatedRiddles.map((daily_riddle, index) => (
                  <div key={index} className={`grid grid-cols-3 text-sm min-w-[800px] text-[#32475CDE] font-medium ${index < paginatedRiddles.length - 1 ? "border-b border-[#32475C1F]" : ""}`}>
                    <div className="px-4 py-5">{daily_riddle.date}</div>
                    <div className="px-4 py-5">{daily_riddle.title}</div>
                    <div className="flex justify-between ps-4 py-5">
                      <span>{daily_riddle.level_id}</span>
                      <Dropdown options={["Edit", "Delete"]} placeholder="" value=""
                        onChange={(selectedOption) => {
                          if (selectedOption) {
                            handleDropdownAction(selectedOption, daily_riddle);
                          }
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-gray-500">
                  No results found.
                </div>
              )}
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      </AdminTableCard>

      <DailyRiddleModal
        isOpen={openDailyRiddleModal}
        initialData={editingRiddle ? { date: editingRiddle.date || "", riddle: editingRiddle.level_id ?? null } : null}
        onClose={() => setOpenDailyRiddleModal(false)}
        onSave={async (data) => {
          try {
            if (editingRiddle) {
              const response = await api.put(`/admin-panel/daily-riddles/${editingRiddle.id}/`, data);
              if (response.status === 200 || response.status === 201) {
                toast.success("Daily Riddle updated successfully!");
              }
            } else {
              const response = await api.post("/admin-panel/daily-riddles/", data);
              if (response.status === 200 || response.status === 201) {
                toast.success("Daily Riddle added successfully!");
              }
            }
            onDataChange();
          } catch (error) {
            console.error("Error saving daily riddle:", error);
            handleApiError(error)
            throw error;
          } finally {
            setOpenDailyRiddleModal(false);
          }
        }}
      />

      <ConfirmationModal
        isOpen={openDailyDeleteModal}
        onClose={() => setOpenDailyDeleteModal(false)}
        title="Delete Daily Riddle"
        description={"Are you sure you want to delete this daily riddle?"}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={async () => {
          if (!dailyRiddleToDelete) return false;
          try {
            const res = await api.delete(
              `/admin-panel/daily-riddles/${dailyRiddleToDelete.id}/`
            );
            toast.success(res?.data?.message || "Daily riddle deleted successfully!");
            onDataChange?.();
            setOpenDailyDeleteModal(false);
            return true;
          } catch (error) {
            handleApiError(error)
            setOpenDailyDeleteModal(false);
            return false;
          }
        }}
      />
      <SelectRiddleModal
        isOpen={modalState.isOpen && modalState.mode === "add"}
        onClose={() => {
          setModalState({
            isOpen: false,
            mode: "create",
            editingRiddle: null,
          })
          onDataChange?.();
        }}
        riddles={filteredAllRiddles}
        isLoading={false}
        dailyRiddles={dailyRiddlesData}
      />

    </>
  );
});

DailyRiddlesTable.displayName = "DailyRiddlesTable";

export default DailyRiddlesTable;
