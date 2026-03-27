"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { X, Trash2, ChevronDown } from "lucide-react";
import TableLoader from "@/components/common/admin/dotsLoader";
import {
  getAddRiddleList,
  addRiddlesToClash,
  getTournamentById,
} from "@/lib/services/common/adminActions";
import { handleApiError } from "@/lib/errorHandler";

interface AddRiddleModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentNumericId: number;
  onRiddlesAdded: (selectedRiddleIds: string[]) => void;
}

interface RiddleListItem {
  id: number;
  level_id: number;
  title: string;
}

interface TournamentLevel {
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(prev => {
              const next = !prev;
              if (next && onOpen) onOpen();
              return next;
            });
          }
        }}
        disabled={disabled}
        className="w-full px-4 py-2.5 border border-gray-300 cursor-pointer rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={selectedOption && selectedOption.value ? "text-gray-900" : "text-gray-500"}>
          {selectedOption && selectedOption.value ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className={`absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1' }`} >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left cursor-pointer hover:bg-gray-100 transition-colors ${value === option.value && option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AddRiddleModal: React.FC<AddRiddleModalProps> = ({
  isOpen,
  onClose,
  tournamentNumericId,
  onRiddlesAdded,
}) => {
  const [levels, setLevels] = useState<TournamentLevel[]>([
    { levelNumber: 1, riddleId: null },
  ]);
  const [riddles, setRiddles] = useState<RiddleListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [startingLevelNumber, setStartingLevelNumber] = useState(1);
  const levelRefs = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    levelRefs.current = levelRefs.current.slice(0, levels.length);
  }, [levels.length]);


  // 🔹 Fetch riddles and tournament data when modal opens
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || !tournamentNumericId) return;

      setIsLoading(true);
      setLevels([{ levelNumber: 1, riddleId: null }]);
      setStartingLevelNumber(1);

      try {
        // Fetch tournament data to get existing levels
        const tournamentData = await getTournamentById(tournamentNumericId.toString());

        // Calculate starting level number
        if (tournamentData.levels && tournamentData.levels.length > 0) {
          const maxLevelNumber = Math.max(...tournamentData.levels.map(level => level.level_number));
          const newStartingLevel = maxLevelNumber + 1;
          setStartingLevelNumber(newStartingLevel);
          setLevels([{ levelNumber: newStartingLevel, riddleId: null }]);
        } else {
          setStartingLevelNumber(1);
          setLevels([{ levelNumber: 1, riddleId: null }]);
        }

        // Fetch available riddles
        const data = await getAddRiddleList(tournamentNumericId);
        setRiddles(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        handleApiError(error, "Failed to fetch data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, tournamentNumericId]);

  const handleDropdownOpen = (index: number) => {
    requestAnimationFrame(() => {
      const levelDiv = levelRefs.current[index];
      const container = containerRef.current;

      if (!levelDiv || !container) return;

      const containerRect = container.getBoundingClientRect();
      const levelRect = levelDiv.getBoundingClientRect();
      const dropdownHeight = 300;
      const padding = 20;
      const levelTop = levelRect.top - containerRect.top + container.scrollTop;
      const dropdownBottom = levelTop + levelRect.height + dropdownHeight;
      const visibleBottom = container.scrollTop + container.clientHeight - padding;

      if (dropdownBottom > visibleBottom) {
        container.scrollTo({
          top: container.scrollTop + (dropdownBottom - visibleBottom) + 8,
          behavior: "smooth",
        });
      }
    });
  };


  const handleRiddleSelect = useCallback((levelIndex: number, riddleId: string) => {
    const updatedLevels = [...levels];
    updatedLevels[levelIndex].riddleId = riddleId;
    setLevels(updatedLevels);

    if (levelIndex === levels.length - 1 && riddleId) {
      const nextLevelNumber = startingLevelNumber + updatedLevels.length;
      setLevels([
        ...updatedLevels,
        { levelNumber: nextLevelNumber, riddleId: null },
      ]);
    }
  }, [levels, startingLevelNumber]);

  const handleRemoveLevel = useCallback((levelIndex: number) => {
    if (levels.length === 1) return;
    const updatedLevels = levels.filter((_, index) => index !== levelIndex);
    updatedLevels.forEach((level, index) => {
      level.levelNumber = startingLevelNumber + index;
    });
    setLevels(updatedLevels);
  }, [levels, startingLevelNumber]);

  const getAvailableRiddles = useCallback((currentLevelIndex: number) => {
    const selectedRiddleIds = levels
      .filter((_, index) => index !== currentLevelIndex)
      .map((level) => level.riddleId)
      .filter(Boolean);
    return riddles.filter((riddle) => !selectedRiddleIds.includes(riddle.id.toString()));
  }, [levels, riddles]);

  const getSelectedRiddle = useCallback((riddleId: string | null) => {
    if (!riddleId) return null;
    return riddles.find((r) => r.id.toString() === riddleId);
  }, [riddles]);

  // Save selected riddles
  const handleSave = useCallback(async () => {
    const filledLevels = levels.filter((level) => level.riddleId !== null);
    const riddleIds = filledLevels.map((level) => level.riddleId).filter(Boolean) as string[];

    if (riddleIds.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addRiddlesToClash(
        tournamentNumericId,
        riddleIds.map((id) => Number(id))
      );

      onRiddlesAdded(riddleIds);
      setLevels([{ levelNumber: 1, riddleId: null }]);
      setStartingLevelNumber(1);
      onClose();
    } catch (error) {
      console.error(" Failed to add riddles:", error);
      handleApiError(error, "Failed to add riddles. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    levels,
    tournamentNumericId,
    onRiddlesAdded,
    onClose,
    isSubmitting,
  ]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const filledLevels = levels.filter((level) => level.riddleId !== null);
  const isFormValid = filledLevels.length > 0;

  return (
    <div
      className="fixed inset-0 bg-white/45 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col shadow-lg drop-shadow-lg border border-[#EBEDEF] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            Add Riddle
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        <div ref={containerRef} className="scroll-container flex-1 overflow-y-auto px-6 py-6 overflow-x-hidden">
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <TableLoader message="Loading riddles..." />
              </div>
            ) : riddles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No more riddles to add.
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tournament Levels
                  </h3>
                  <span className="text-sm text-gray-500">
                    {filledLevels.length} riddle(s) added
                  </span>
                </div>

                <div className="space-y-3">
                  {levels.map((level, index) => {
                    const availableRiddles = getAvailableRiddles(index);
                    const selectedRiddle = getSelectedRiddle(level.riddleId);
                    const isLastLevel = index === levels.length - 1;
                    const canRemove = levels.length > 1 && !isLastLevel;

                    return (
                      <div
                        key={index}   ref={(el) => { if (el) levelRefs.current[index] = el; }}

                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-700 font-semibold rounded-lg flex-shrink-0">
                          {level.levelNumber}
                        </div>

                        <div className="flex-1 relative">
                          <CustomDropdown
                            value={level.riddleId || ''}
                            onChange={(value) => handleRiddleSelect(index, value)}
                            placeholder="Select a riddle for this level"
                            disabled={isSubmitting}
                            options={[
                              { value: '', label: 'Select a riddle for this level' },
                              ...(selectedRiddle ? [{
                                value: selectedRiddle.id.toString(),
                                label: `${selectedRiddle.title} (ID: ${selectedRiddle.level_id})`
                              }] : []),
                              ...availableRiddles.map(riddle => ({
                                value: riddle.id.toString(),
                                label: `${riddle.title} (ID: ${riddle.level_id})`
                              }))
                            ]}
                            onOpen={() => handleDropdownOpen(index)}

                          />
                        </div>

                        {canRemove && (
                          <button
                            onClick={() => handleRemoveLevel(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            title="Remove level"
                            disabled={isSubmitting}
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
                  Select a riddle for each level. A new level will appear automatically
                  after you make a selection.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid || isSubmitting}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${isFormValid && !isSubmitting
                ? 'bg-gray-900 text-white hover:bg-gray-500 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            type="button"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AddRiddleModal);
