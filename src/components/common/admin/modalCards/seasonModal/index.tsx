"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, Trash2, ChevronDown } from "lucide-react";
import { CreateSeasonModalProps, CreateSeasonRequest, RiddleApiData, UpdateSeasonRequest } from "@/lib/types/common/types";
import { createSeason, updateSeasonData } from "@/lib/services/common/adminActions";
import api from "@/lib/axios";
import { handleApiError } from "@/lib/errorHandler";

interface SeasonLevel {
  levelNumber: number;
  riddleId: string | null;
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    if (disabled) return;
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    if (isOpen && onOpen) {
      requestAnimationFrame(() => onOpen());
    }
  }, [isOpen, onOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setDropdownPosition(
        spaceBelow < 200 && spaceAbove > spaceBelow ? 'top' : 'bottom'
      );
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        className="w-full px-4 py-2.5 border border-gray-300 cursor-pointer rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={selectedOption?.value ? "text-gray-900" : "text-gray-500"}> {selectedOption?.value ? selectedOption.label : placeholder} </span>
        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div ref={menuRef} className={`absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto ${dropdownPosition === "top" ? "bottom-full mb-1" : "top-full mt-1"}`} >
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors ${value === option.value ? "bg-blue-50 text-blue-700" : "text-gray-900"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CreateSeasonModal: React.FC<CreateSeasonModalProps> = React.memo(({ isOpen, onClose, onSave, mode = "create", seasonData = null, onDataChange }) => {
  const [seasonName, setSeasonName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [levels, setLevels] = useState<SeasonLevel[]>([{ levelNumber: 1, riddleId: null },]);
  const [riddles, setRiddles] = useState<RiddleApiData[]>([]);
  const [isLoading, setIsLoading] = useState({
    form: false,
    riddles: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const levelRefs = useRef<HTMLDivElement[]>([]);
  levelRefs.current = levels.map((_, i) => levelRefs.current[i] ?? null);

  const handleDropdownOpen = (index: number) => {
    const levelDiv = levelRefs.current[index];
    const container = containerRef.current;

    if (!levelDiv || !container) return;

    requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const levelRect = levelDiv.getBoundingClientRect();

      const dropdownHeight = 260;
      const levelOffsetTop = levelRect.top - containerRect.top + container.scrollTop;

      const targetScroll =
        levelOffsetTop - container.clientHeight + dropdownHeight + 40; // padding bottom

      if (targetScroll > container.scrollTop) {
        container.scrollTo({
          top: targetScroll,
          behavior: "smooth",
        });
      }
    });
  };

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchRiddles = async () => {
      try {
        setIsLoading(prev => ({ ...prev, riddles: true }));
        const riddlesData = await api.get("riddle-list/");
        setRiddles(riddlesData.data.data);
      } catch (error) {
        console.error("Failed to fetch riddles:", error);
        handleApiError(error, "Failed to fetch riddles.");
      } finally {
        setIsLoading(prev => ({ ...prev, riddles: false }));
      }
    };

    if (isOpen) {
      fetchRiddles();
      if (mode === "edit" && seasonData) {
        setSeasonName(seasonData.title || '');
        setStartDate(seasonData.start_date || '');
        setEndDate(seasonData.end_date || '');
      } else {
        setSeasonName('');
        setStartDate('');
        setEndDate('');
        setLevels([{ levelNumber: 1, riddleId: null }]);
      }
    }
  }, [isOpen, mode, seasonData]);

  const handleRiddleSelect = (levelIndex: number, riddleId: string) => {
    const updatedLevels = [...levels];
    updatedLevels[levelIndex].riddleId = riddleId;
    setLevels(updatedLevels);

    if (levelIndex === levels.length - 1 && riddleId) {
      setLevels([
        ...updatedLevels,
        { levelNumber: levels.length + 1, riddleId: null },
      ]);
    }
  };

  const handleRemoveLevel = (levelIndex: number) => {
    if (levels.length === 1) return;
    const updatedLevels = levels.filter((_, index) => index !== levelIndex);
    updatedLevels.forEach((level, index) => {
      level.levelNumber = index + 1;
    });
    setLevels(updatedLevels);
  };

  const getAvailableRiddles = (currentLevelIndex: number) => {
    const selectedRiddleIds = levels
      .filter((_, index) => index !== currentLevelIndex)
      .map((level) => level.riddleId)
      .filter(Boolean);
    return riddles.filter((riddle) => !selectedRiddleIds.includes(riddle.id.toString()));
  };

  const getSelectedRiddle = (riddleId: string | null) => {
    if (!riddleId) return null;
    return riddles.find((r) => r.id.toString() === riddleId);
  };

  const isFormValid = () => {
      if (!seasonName.trim() || !startDate || !endDate) return false;
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      if (end <= start) return false;
      if (mode === "create") {
          return levels.some((level) => level.riddleId !== null);
      }
      return true;
  };

  const handleSave = async () => {
    setIsLoading(prev => ({ ...prev, form: true }));

    try {
      if (mode === "edit" && seasonData?.id) {
        const updateData: UpdateSeasonRequest = {
          title: seasonName,
          start_date: startDate,
          end_date: endDate,
          status: seasonData.status || "ACTIVE",
        };

        await updateSeasonData(seasonData.id, updateData);
        if (onDataChange) {
          onDataChange();
        }
      } else {
        const filledLevels = levels.filter((level) => level.riddleId !== null);
        const riddleIds = filledLevels.map((level) => parseInt(level.riddleId || '0'));

        const createData: CreateSeasonRequest = {
          title: seasonName,
          start_date: startDate,
          end_date: endDate,
          riddle_ids: riddleIds,
        };

        await createSeason(createData);
      }

      setIsLoading(prev => ({ ...prev, form: false }));

      // Reset form
      setSeasonName('');
      setStartDate('');
      setEndDate('');
      setLevels([{ levelNumber: 1, riddleId: null }]);

      onClose();
      if (onSave) {
        onSave();
      }
    } catch (err: unknown) {
      setIsLoading(prev => ({ ...prev, form: false }));
      handleApiError(err, "Failed to save season. Please try again.");
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
      <div onClick={handleBackdropClick} className="fixed inset-0 bg-white/45 flex items-center justify-center z-[9999] p-4">
          <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-lg drop-shadow-lg border border-[#EBEDEF] relative"
          >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-900"> {mode === "edit" ? "Edit Season" : "Create Season"} </h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" disabled={isLoading.form}>
                      <X size={24} />
                  </button>
              </div>

              <div ref={containerRef} className="flex-1 overflow-y-auto px-6 py-6 overflow-x-hidden">
                  <div className="space-y-6">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2"> Season Name </label>
                          <input
                              type="text"
                              value={seasonName}
                              onChange={(e) => setSeasonName(e.target.value)}
                              placeholder="Enter season name"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              disabled={isLoading.form}
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2"> Start Date </label>
                              <input
                                  type="date"
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  min={today}
                                  className="w-full px-4 py-3 border border-gray-300 cursor-pointer rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                  disabled={isLoading.form}
                                  onClick={(e) => {
                                      const input = e.currentTarget as HTMLInputElement;
                                      input.showPicker?.();
                                  }}
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2"> End Date </label>
                              <input
                                  type="date"
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  min={startDate ? new Date(new Date(startDate).getTime() + 86400000).toISOString().split("T")[0] : today}
                                  className="w-full px-4 py-3 cursor-pointer border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                  disabled={isLoading.form}
                                  style={{ caretColor: "transparent" }}
                                  onClick={(e) => {
                                      const input = e.currentTarget as HTMLInputElement;
                                      input.showPicker?.();
                                  }}
                              />
                              {endDate && new Date(endDate) <= new Date(startDate) && (
                                  <p className="text-sm text-red-500 mt-1">End date must be at least 1 day after the start date.</p>
                              )}
                          </div>
                      </div>

                      {mode === "create" && (
                          <div>
                              <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-semibold text-gray-900"> Season Levels </h3>
                                  <span className="text-sm text-gray-500"> {levels.filter((l) => l.riddleId).length} riddle(s) added </span>
                              </div>

                              {isLoading.riddles ? (
                                  <div className="text-center py-8 text-gray-500"> Loading riddles... </div>
                              ) : (
                                  <>
                                      <div className="space-y-3">
                                          {levels.map((level, index) => {
                                              const availableRiddles = getAvailableRiddles(index);
                                              const selectedRiddle = getSelectedRiddle(level.riddleId);
                                              const isLastLevel = index === levels.length - 1;
                                              const canRemove = levels.length > 1 && !isLastLevel;

                                              return (
                                                  <div
                                                      key={index}
                                                      ref={(el) => {
                                                          if (el) levelRefs.current[index] = el;
                                                      }}
                                                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                                  >
                                                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-700 font-semibold rounded-lg flex-shrink-0">
                                                          {level.levelNumber}
                                                      </div>

                                                      <div className="flex-1 relative">
                                                          <CustomDropdown
                                                              value={level.riddleId || ""}
                                                              onChange={(value) => handleRiddleSelect(index, value)}
                                                              placeholder="Select a riddle for this level"
                                                              disabled={isLoading.form}
                                                              options={[
                                                                  { value: "", label: "Select a riddle for this level" },
                                                                  ...(selectedRiddle
                                                                      ? [
                                                                            {
                                                                                value: selectedRiddle.id.toString(),
                                                                                label: `${selectedRiddle.title} (ID: ${
                                                                                    selectedRiddle.level_id || selectedRiddle.id
                                                                                })`,
                                                                            },
                                                                        ]
                                                                      : []),
                                                                  ...availableRiddles.map((riddle) => ({
                                                                      value: riddle.id.toString(),
                                                                      label: `${riddle.title} (ID: ${riddle.level_id || riddle.id})`,
                                                                  })),
                                                              ]}
                                                              onOpen={() => handleDropdownOpen(index)}
                                                          />
                                                      </div>

                                                      {canRemove && (
                                                          <button
                                                              onClick={() => handleRemoveLevel(index)}
                                                              className="p-2 text-red-500 cursor-pointer hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                                              title="Remove level"
                                                              disabled={isLoading.form}
                                                              type="button"
                                                          >
                                                              <Trash2 size={20} />
                                                          </button>
                                                      )}
                                                  </div>
                                              );
                                          })}
                                      </div>

                                      <p className="text-sm text-gray-500 mt-3">
                                          Select a riddle for each level. A new level will appear automatically after you make a selection.
                                      </p>
                                  </>
                              )}
                          </div>
                      )}
                  </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <button
                      onClick={onClose}
                      disabled={isLoading.form}
                      className="px-6 py-2.5 border border-gray-300 cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      type="button"
                  >
                      Cancel
                  </button>
                  <button
                      onClick={handleSave}
                      disabled={!isFormValid() || isLoading.form}
                      className={`px-6 py-2.5  font-medium transition-colors ${
                          isFormValid() && !isLoading.form
                              ? "bg-gray-900 text-white hover:bg-gray-600 cursor-pointer "
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      type="button"
                  >
                      {isLoading.form ? (mode === "edit" ? "Updating..." : "Creating...") : mode === "edit" ? "Update Season" : "Save Season"}
                  </button>
              </div>
          </div>
      </div>
  );
});

CreateSeasonModal.displayName = 'CreateSeasonModal';

export default CreateSeasonModal;
