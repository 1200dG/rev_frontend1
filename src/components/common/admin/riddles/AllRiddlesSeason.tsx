"use client";
import React, { useState } from "react";
import AdminTableCard from "../adminTableCard";
import { ArrowLeft, Plus } from "lucide-react";
import { AllRiddlesSeason, Level, SeasonLevelItem } from "@/lib/types/common/types";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { saveLevelOrder, saveRiddleOrder } from "@/lib/services/common/adminActions";
import { usePathname } from "next/navigation";
import { handleApiError } from "@/lib/errorHandler";

type AllRiddlesProps = {
  riddles?: AllRiddlesSeason[];
  levels?: SeasonLevelItem[];
  onClose: () => void;
  selectedSeasonId?: number;
  selectedTournamentId?: number;
  onDataChange?: ()=>void;
};

type SortableItem = {
  id: string;
  levelId: string;
  title: string;
  riddle_id: number;
};

const SortableRow = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="grid grid-cols-3 text-sm text-[#32475CDE] font-medium cursor-pointer hover:bg-[#f8f4f4] border-b border-[#32475C1F]"
    >
      {children}
    </div>
  );
};

const AllRiddles: React.FC<AllRiddlesProps> = ({ riddles, levels, onClose, selectedSeasonId, selectedTournamentId, onDataChange }) => {
  const [riddlesSearch, setRiddlesSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const pathName = usePathname();



  const normalizeData = (): SortableItem[] => {
    if (riddles?.length) {
      return riddles.map((r) => ({
        id: r.id.toString(),
        levelId: r.level_id,
        title: r.title,
        riddle_id: r.riddle_id,
      }));
    }

    if (levels?.length) {
      return levels.map((l) => ({
        id: l.id.toString(),
        levelId: (l?.riddle_level_id || "")?.toString(),
        title: l.riddle_title?.toString() || '',
        riddle_id: l.riddle_level_id ?? 0,
      }));
    }

    return [];
  };



  const [items, setItems] = useState<SortableItem[]>(normalizeData());
  const initialItems = normalizeData();

  const [initialOrder] = useState<string[]>(
    initialItems.map((item) => item.id)
  );

  const isOrderChanged = () => {
    const currentOrder = items.map((item) => item.id);

    if (currentOrder.length !== initialOrder.length) return true;

    return currentOrder.some((id, index) => id !== initialOrder[index]);
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(riddlesSearch.toLowerCase())
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);
    setIsSaved(false); 
  };

  const handleSave = async() => {
    if (!selectedSeasonId) return;

    const payload = {
      levels_list: filteredItems.map((item, index) => ({
        riddle_id: Number(item.id) || 0,
        level_number: index + 1,
      })),
    };
    try {
        setIsSaving(true);
      const response = await saveRiddleOrder(selectedSeasonId, payload);
      if (response.detail as string) {
        onDataChange?.();
        setIsSaved(true);
      }
    } catch (err) {
      handleApiError(err, "Error saving riddle order. Please try again.");
      setIsSaved(false);
    } finally {
        setIsSaving(false);
    }

  };
  const handleLevelSave = async() => {
    if (!selectedTournamentId) return;

    const payload = {
      levels_list: filteredItems.map((item, index) => ({
        riddle_id: Number(item.id) || 0,
        level_number: index + 1,
      })),
    };
    try {
        setIsSaving(true);
      const response = await saveLevelOrder(selectedTournamentId, payload);
      if (response.detail) {
        onDataChange?.();
        setIsSaved(true);
      }
    } catch (err) {
      handleApiError(err, "Error saving level order. Please try again.");
      setIsSaved(false);
    } finally {
        setIsSaving(false); 
    }
  };

  return (
      <>
          <div className="flex items-center mb-4">
              <button onClick={onClose} className="flex cursor-pointer items-center gap-2 bg-[#E0E0E0] hover:bg-[#5f5e5e] text-[#212B36] px-4 py-2">
                  <ArrowLeft size={16} />
                  <span className="text-sm font-medium">Back</span>
              </button>
          </div>

          <AdminTableCard
              title="ALL RIDDLES"
              headerActions={
                  <div className="flex items-center gap-3 w-full ">
                      <div className="flex items-center border border-[#919EAB52] rounded-lg px-3 py-2 gap-1 w-full">
                          <img src="/admin/search.svg" alt="search icon" />
                          <input
                              type="search"
                              placeholder="Search"
                              className="w-full placeholder:text-[#919EAB] text-[#212B36] text-md font-normal focus:outline-none"
                              value={riddlesSearch}
                              onChange={(e) => setRiddlesSearch(e.target.value)}
                          />
                      </div>
                      <button
                          disabled={!isOrderChanged() || isSaving || isSaved}
                          className={`flex justify-center items-center px-2 gap-2 w-full h-10 cursor-pointer ${
                              !isOrderChanged() || isSaving || isSaved ? "bg-gray-400 cursor-not-allowed" : "bg-[#22222C] hover:bg-[#454F5B]"
                          }`}
                          onClick={() => {
                              if (!isOrderChanged() || isSaved || isSaving) return;
                              if (pathName.includes("enigma")) handleSave();
                              else if (pathName.includes("clash")) handleLevelSave();
                          }}
                      >
                          <Plus size={16} color="white" />
                          <span className="text-white text-sm font-medium">{isSaving ? "Saving..." : "Save"}</span>
                      </button>
                  </div>
              }
          >
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={filteredItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                      <div className="grid grid-cols-3 text-xs bg-[#FAFAFC] uppercase text-[#32475CDE] font-medium sticky top-0">
                          <div className="p-4">Level Number</div>
                          <div className="p-4">Level ID</div>
                          <div className="p-4">Title</div>
                      </div>

                      {filteredItems.length > 0 ? (
                          filteredItems.map((level, index) => (
                              <SortableRow key={level.id} id={level.id}>
                                  <div className="px-4 py-5">{index + 1}</div>
                                  <div className="px-4 py-5">#{level.levelId}</div>
                                  <div className="px-4 py-5">{level.title}</div>
                              </SortableRow>
                          ))
                      ) : (
                          <div className="text-center py-6 text-sm text-gray-500">No levels found.</div>
                      )}
                  </SortableContext>
              </DndContext>
          </AdminTableCard>
      </>
  );
};

export default AllRiddles;
