"use client";

import React from "react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { X, Trash2, ChevronDown } from "lucide-react";

import { SelectRiddleModalProps, SeasonData } from "@/lib/types/common/types";
import { getSeasonRiddleList, createDailyRiddle } from "@/lib/services/common/adminActions";
import { handleApiError } from "@/lib/errorHandler";
import { DailyRiddleFormData } from "@/lib/types/admin";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


interface getSeasonData {
  id: number;
  level_id: number;
  title: string;
}

interface SeasonLevel {
  levelNumber: number;
  riddleId: string | null;
  date?: string | null;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  disabled?: boolean;
  onOpen?: () => void;

}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, placeholder, disabled, onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Check if dropdown should open upward
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        setDropdownPosition(spaceBelow < 200 && spaceAbove > spaceBelow ? 'top' : 'bottom');
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) onOpen?.();
          }
        }} disabled={disabled}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={selectedOption && selectedOption.value ? "text-gray-900" : "text-gray-500"}>
          {selectedOption && selectedOption.value ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'}`} >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left cursor-pointer hover:bg-gray-100 transition-colors ${value === option.value && option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
const SelectRiddleModal: React.FC<SelectRiddleModalProps> = React.memo(
  ({
    isOpen,
    onClose,
    riddles,
    onRiddlesAdded,
    seasonDataa,
    isLoading = false,
    dailyRiddles,
    onDataChange,
  }) => {
    const [levels, setLevels] = useState<SeasonLevel[]>([
      { levelNumber: 1, riddleId: null, date: null },
    ]);
    const { formState: { errors } } = useForm<DailyRiddleFormData>({ defaultValues: { date: "", riddle: null } });

    const [seasons, setSeasons] = useState<SeasonData[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [seasonData, setSeasonData] = useState<getSeasonData[]>([]);
    const [selectedSeasonData, setSelectedSeasonData] = useState<SeasonData | null>(null);
    const [startingLevelNumber, setStartingLevelNumber] = useState(1);
    const pathName = usePathname();
    const levelRefs = useRef<HTMLDivElement[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    levelRefs.current = levels.map((_, i) => levelRefs.current[i] ?? null);
    const handleDropdownOpen = (index: number) => {
      const levelDiv = levelRefs.current[index];
      const container = containerRef.current;

      if (levelDiv && container) {
        requestAnimationFrame(() => {
          const containerRect = container.getBoundingClientRect();
          const levelRect = levelDiv.getBoundingClientRect();
          const dropdownHeight = 240; // approx height of your dropdown, adjust if needed

          const levelBottom = levelRect.bottom - containerRect.top; // position relative to container top

          // If the bottom of the level + dropdown overflows container, scroll down
          if (levelBottom + dropdownHeight > container.clientHeight) {
            const scrollAmount = levelBottom + dropdownHeight - container.clientHeight + container.scrollTop + 10; // extra padding
            container.scrollTo({
              top: scrollAmount,
              behavior: "smooth",
            });
          } else if (levelRect.top < containerRect.top) {
            container.scrollTo({
              top: container.scrollTop - (containerRect.top - levelRect.top) - 10,
              behavior: "smooth",
            });
          }
        });
      }
    };

    useEffect(() => {
      if (!isOpen) return;

      setIsSubmitting(false);

      setLevels([{ levelNumber: 1, riddleId: null, date: null }]);
      setStartingLevelNumber(1);
      setSelectedSeason("");
      setSelectedSeasonData(null);

      if (seasonDataa) {
        setSeasons([seasonDataa]);
        setSelectedSeason(seasonDataa.title);
        setSelectedSeasonData(seasonDataa);

        const maxLevel = seasonDataa.levels?.length
          ? Math.max(...seasonDataa.levels.map(l => l.level_number))
          : 0;

        const nextLevel = maxLevel + 1 || 1;

        setStartingLevelNumber(nextLevel);
        setLevels([{ levelNumber: nextLevel, riddleId: null, date: null }]);

        fetchSeasonData(seasonDataa.id);
      }
    }, [isOpen, seasonDataa]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      };

      if (isDropdownOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isDropdownOpen]);

    const fetchSeasonData = async (seasonId: number) => {
      try {
        const riddles = await getSeasonRiddleList(seasonId);
        setSeasonData(riddles ?? []);
      } catch (error) {
        handleApiError(error);
      }
    };

    const transformedRiddles = useMemo(() => {
      return seasonData.map((riddle) => ({
        id: riddle.id?.toString() || "0",
        levelId: riddle.level_id?.toString() || "0",
        title: riddle.title || "",
      }));
    }, [seasonData]);

    const normalizedRiddles = useMemo(() => {
      if (!riddles) return [];

      const list = Array.isArray(riddles) ? riddles : [riddles];

      return list.map(r => ({
        id: r.id.toString(),
        levelId: r.level_id?.toString() || "0",
        title: r.title,
      }));
    }, [riddles]);

    const allRiddles = pathName.includes('/riddles') ? normalizedRiddles : transformedRiddles;

    const handleRiddleSelect = useCallback((levelIndex: number, riddleId: string) => {
      setLevels(prev => {
        const updated = [...prev];
        updated[levelIndex].riddleId = riddleId;

        if (levelIndex === updated.length - 1 && riddleId) {
          updated.push({
            levelNumber: startingLevelNumber + updated.length,
            riddleId: null,
            date: null,
          });
        }

        return updated;
      });
    }, [startingLevelNumber]);


    const handleRemoveLevel = useCallback((levelIndex: number) => {
      if (levels.length === 1) return;
      const updatedLevels = levels.filter((_, index) => index !== levelIndex);
      updatedLevels.forEach((level, index) => {
        level.levelNumber = startingLevelNumber + index;
      });
      setLevels(updatedLevels);
    }, [levels, startingLevelNumber]);

    const getAvailableRiddles = useCallback(
      (currentIndex: number) => {
        const selectedIds = levels
          .filter((_, i) => i !== currentIndex)
          .map(l => l.riddleId)
          .filter(Boolean);

        return allRiddles.filter(r => !selectedIds.includes(r.id));
      },
      [levels, allRiddles]
    );

    const getSelectedRiddle = useCallback(
      (riddleId: string | null) => {
        if (!riddleId) return null;
        return allRiddles.find(r => r.id === riddleId);
      },
      [allRiddles]
    );

    const selectedDates = useMemo(() => {
      return levels.map(l => l.date).filter(Boolean);
    }, [levels]);

    const filledLevels = useMemo(() => {
      return levels.filter((level) => {
        if (pathName.includes("/riddle")) {
          return level.riddleId && level.date;
        }
        return level.riddleId;
      });
    }, [levels, pathName]);

    const isFormValid = useMemo(() => {
      if (pathName.includes("/riddle")) {
        return filledLevels.length > 0;
      }
      return Boolean(selectedSeason && filledLevels.length > 0);
    }, [filledLevels, selectedSeason, pathName]);

    const handleDateChange = (index: number, date: string) => {
      if (selectedDates.includes(date)) {
        toast.error("This date is already selected for another riddle");
        return;
      }

      if (dailyRiddles?.some(r => r.date === date)) {
        toast.error("This date has already been used in daily riddles");
        return;
      }

      const updatedLevels = [...levels];
      updatedLevels[index].date = date;
      setLevels(updatedLevels);
    };

    const onSubmit = useCallback(async () => {
      if (filledLevels.length === 0) {
        toast.error("Please select riddle and date.");
        return;
      }

      setIsSubmitting(true);

      try {
        if (pathName.includes("/riddle")) {
          const riddlesPayload = filledLevels.map((level) => ({
            riddle: level.riddleId!,
            date: level.date!,
          }));

          const payload = { all_daily_riddles: riddlesPayload };
          await createDailyRiddle(payload);
          onClose();
          onDataChange?.();
        } else {
          // Handle adding riddles to a season
          const riddleIds = filledLevels.map((level) => level.riddleId!) as string[];

          if (onRiddlesAdded && riddleIds.length > 0 && selectedSeason) {
            const selectedSeasonData = seasons.find(
              (season) => season.title === selectedSeason
            );
            onRiddlesAdded(riddleIds, selectedSeasonData?.id);

            // Reset form
            setLevels([{ levelNumber: 1, riddleId: null, date: null }]);
            setStartingLevelNumber(1);
            setSelectedSeason("");
            setSelectedSeasonData(null);
            onClose();
          }
        }
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsSubmitting(false);
      }
    }, [
      filledLevels, pathName, onRiddlesAdded, seasons, selectedSeason, onClose, onDataChange
    ]);



    // const saveDailyRiddleData = async (selectedRiddleData:DailyRiddleData[]) => {
    //  await createDailyRiddle(selectedRiddleData)
    // }

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <div className="fixed inset-0 bg-white/45 flex items-center justify-center z-[9999] p-4" onClick={handleBackdropClick} >
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-lg drop-shadow-lg border border-[#EBEDEF] relative" onClick={(e) => e.stopPropagation()} >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-8">
              <h2 className="text-2xl font-semibold text-gray-900"> Add Riddle </h2>
              {!pathName.includes('/riddle') && (
                <div className="relative" ref={dropdownRef}>
                  <div className="w-48 h-9 border border-[#919EAB52] border-opacity-30 rounded-lg bg-transparent flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="text-base font-medium text-[#919EAB]"> {selectedSeason || "Select Season"} </span>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#919EAB52] border-opacity-30 rounded-lg shadow-lg z-50">
                      {seasons.map((season) => (
                        <div
                          key={season.id}
                          className="px-3 py-2 text-sm text-gray-500 cursor-pointer hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center justify-center"
                          onClick={async () => {
                            setSelectedSeason(season.title);
                            setIsDropdownOpen(false);
                            await fetchSeasonData(season.id);
                          }}
                        >
                          {season.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" disabled={isSubmitting} >
              <X size={24} />
            </button>
          </div>

          <div ref={containerRef}
            className="flex-1 overflow-y-auto px-6 py-6 overflow-x-hidden">

            <div className="space-y-3">
              {levels.map((level, index) => {
                const availableRiddles = getAvailableRiddles(index);
                const selectedRiddle = getSelectedRiddle(level.riddleId);
                const isLastLevel = index === levels.length - 1;

                return (
                  <div key={index} ref={(el) => { levelRefs.current[index] = el as HTMLDivElement }}
                    className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border" >
                    {pathName.includes('/riddles') && (
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-black">Choose Date</label>
                        <input
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={level.date || ""}
                          onChange={(e) => handleDateChange(index, e.target.value)}
                          className="w-full h-10 px-3 py-2 border border-[#DCDEE4] rounded-lg bg-white text-[#33394A]"
                          disabled={
                            selectedDates.includes(level.date ?? "") === false &&
                            selectedDates.length > 0 &&
                            selectedDates.includes(level.date ?? "")
                          }
                        />

                        {errors.date && (
                          <p className="text-red-500 text-xs">{errors.date.message}</p>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg " >

                      <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-700 font-semibold rounded-lg">
                        {level.levelNumber}
                      </div>

                      <div className="flex-1">
                        <CustomDropdown
                          value={level.riddleId || ""}
                          onChange={(value) => handleRiddleSelect(index, value)}
                          placeholder="Select a riddle"
                          options={[
                            { value: "", label: "Select a riddle" },
                            ...(selectedRiddle
                              ? [{
                                value: selectedRiddle.id,
                                label: `${selectedRiddle.title} (ID: ${selectedRiddle.levelId})`,
                              }]
                              : []),
                            ...availableRiddles.map(r => ({
                              value: r.id,
                              label: `${r.title} (ID: ${r.levelId})`,
                            })),
                          ]}
                          onOpen={() => handleDropdownOpen(index)}

                        />
                      </div>

                      {levels.length > 1 && !isLastLevel && (
                        <button onClick={() => handleRemoveLevel(index)} className="p-2 text-red-500 hover:bg-red-50 cursor-pointer rounded-lg" >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`px-6 py-2.5 font-medium transition-colors ${isFormValid && !isSubmitting ? 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              type="button"
            >
              {isSubmitting ? "Adding..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

SelectRiddleModal.displayName = "SelectRiddleModal";

export default SelectRiddleModal;
