"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { X, Trash2, ChevronDown } from "lucide-react";
import { TournamentFormValues, CreateTournamentRequest, UpdateTournamentRequest, RiddleApiData } from "@/lib/types/common/types";
import { TournamentModalProps } from "@/lib/types/admin";
import { createTournament, updateTournament, deleteTournament, getAllRiddles, getTournamentById, duplicateTournament } from "@/lib/services/common/adminActions";
import TableLoader from "../../dotsLoader";
import moment from "moment";
import { handleApiError } from "@/lib/errorHandler";

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
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
            setIsOpen(prev => {
              const next = !prev;
              if (next && onOpen) onOpen();
              return next;
            });
          }
        }}
        disabled={disabled}
        className="w-full px-4 py-2.5 cursor-pointer border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={selectedOption && selectedOption.value ? "text-gray-900" : "text-gray-500"}>
          {selectedOption && selectedOption.value ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'}`} >
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                if (!disabled) {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
              className={`w-full px-4 py-2 cursor-pointer text-left hover:bg-gray-100 transition-colors ${value === option.value && option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const formatForDateTimeLocal = (utcString?: string) => {
  if (!utcString) return "";
  return moment.utc(utcString).local().format("YYYY-MM-DDTHH:mm");
};

const normalizeDate = (dateStr?: string, endOfDay = false) => {
  if (!dateStr) return "";

  let m = moment(dateStr, "YYYY-MM-DDTHH:mm");
  m = endOfDay ? m.endOf("minute") : m.startOf("minute");

  return m.toDate().toISOString();
};

const AddTournamentModal: React.FC<TournamentModalProps> = React.memo(({
  isOpen,
  onClose,
  editData = null,
  mode = 'create',
  onSave,
  onDelete
}) => {
  const [levels, setLevels] = useState<TournamentLevel[]>([{ levelNumber: 1, riddleId: null },]);
  const [riddles, setRiddles] = useState<RiddleApiData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const levelRefs = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    levelRefs.current = levelRefs.current.slice(0, levels.length);
  }, [levels.length]);

  const [isLoading, setIsLoading] = useState({
    form: false,
    riddles: false,
  });

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting }, } = useForm<TournamentFormValues>({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      startDate: "",
      endDate: "",
      details: "",
    },
  });

  const today = moment().format("YYYY-MM-DDTHH:mm");
  const minStartDate = moment().add(6, 'minutes').format("YYYY-MM-DDTHH:mm");
  const startDate = watch("startDate");

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!isSubmitting && !isLoading.form) {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, isSubmitting, isLoading.form, onClose]);

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

  const fetchRiddles = async () => {
    try {
      setIsLoading(prev => ({ ...prev, riddles: true }));
      const riddlesData = await getAllRiddles();
      setRiddles(riddlesData);
    } catch (error) {
      handleApiError(error, "Failed to fetch riddles. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, riddles: false }));
    }
  };

  useEffect(() => {


    const fetchTournamentDetails = async () => {
      if (mode === 'edit' && editData?.numericId) {
        try {
          const tournamentDetails = await getTournamentById(editData.numericId.toString());

          reset({
            title: tournamentDetails.title || '',
            description: tournamentDetails.description || '',
            price: tournamentDetails.price?.toString() || '',
            startDate: formatForDateTimeLocal(tournamentDetails.start_date),
            endDate: formatForDateTimeLocal(tournamentDetails.end_date),
            details: tournamentDetails.details || '',
          });

          // if (tournamentDetails.levels && tournamentDetails.levels.length > 0) {
          //   const tournamentLevels = tournamentDetails.levels.map((level, index) => ({
          //     levelNumber: level.level_number,
          //     riddleId: level.riddle.toString(),
          //   }));
          //   setLevels(tournamentLevels);
          // } else {
          //   setLevels([{ levelNumber: 1, riddleId: null }]);
          // }
        } catch (error) {
          console.error('Failed to fetch tournament details:', error);
        }
      }
    };

    const fetchDuplicate = async () => {
      if (mode === "duplicate" && editData?.numericId) {
        try {
          const res = await duplicateTournament(editData.numericId);
          reset({
            title: res.title || "",
            description: res.description || "",
            price: res.price?.toString() || "",
            startDate: formatForDateTimeLocal(res.start_date),
            endDate: formatForDateTimeLocal(res.end_date),
            details: res.details || "",
          });

          let tournamentLevels: TournamentLevel[] = [];

          if (res.riddle_ids && res.riddle_ids.length > 0) {
            tournamentLevels = res.riddle_ids.map((id: number, index: number) => ({
              levelNumber: index + 1,
              riddleId: id.toString(),
            }));
          }

          tournamentLevels.push({
            levelNumber: tournamentLevels.length + 1,
            riddleId: null,
          });

          setLevels(tournamentLevels);

        } catch (error) {
          handleApiError(error, "Error in fetching Duplicate tournament response");
          throw error;
        }
      }
    };


    if (isOpen) {
      if (mode != 'edit') {
        fetchRiddles();
      }
      if (mode === 'edit' && editData?.numericId) {
        fetchTournamentDetails();
      } else if (mode === 'create') {
        reset({
          title: "",
          description: "",
          price: "",
          startDate: "",
          endDate: "",
          details: "",
        });
        setLevels([{ levelNumber: 1, riddleId: null }]);
      }
      else if (mode === 'duplicate' && editData?.numericId) {
        fetchDuplicate()
      }
    }
  }, [isOpen, mode, editData?.numericId, reset]);

  const handleRiddleSelect = useCallback((levelIndex: number, riddleId: string) => {
    const updatedLevels = [...levels];
    updatedLevels[levelIndex].riddleId = riddleId;

    // Only add a new level if the selected level was the last one
    if (levelIndex === levels.length - 1 && riddleId) {
      updatedLevels.push({ levelNumber: levels.length + 1, riddleId: null });
    }

    setLevels(updatedLevels);
  }, [levels]);


  const handleRemoveLevel = useCallback((levelIndex: number) => {
    if (levels.length === 1) return;
    const updatedLevels = levels.filter((_, index) => index !== levelIndex);
    updatedLevels.forEach((level, index) => {
      level.levelNumber = index + 1;
    });
    setLevels(updatedLevels);
  }, [levels]);

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

  const onSubmit = async (data: TournamentFormValues) => {
    setIsLoading(prev => ({ ...prev, form: true }));

    try {
      if (mode === 'edit' && editData) {
        const updateData: UpdateTournamentRequest = {
          title: data.title,
          description: data.description?.trim() || editData?.description?.trim() || 'Tournament description',
          detail: data.description?.trim() || editData?.details?.trim(),
          price: parseFloat(data.price) || 0,
        };

        // const filledLevels = levels.filter((level) => level.riddleId !== null);
        // if (filledLevels.length > 0) {
        //   updateData.riddle_ids = filledLevels.map(level => parseInt(level.riddleId || '0'));
        // }

        if (data.startDate) {
          updateData.start_date = normalizeDate(data.startDate);
        } else if (editData?.start_date) {
          updateData.start_date = editData.start_date;
        }

        if (data.endDate) {
          updateData.end_date = normalizeDate(data.endDate, true);
        } else if (editData?.end_date) {
          updateData.end_date = editData.end_date;
        }

        await updateTournament(editData.numericId?.toString() || editData.id, updateData);
      } else if (mode === "duplicate") {
        const tournamentData: CreateTournamentRequest = {
          title: data.title,
          description: data.description,
          start_date: normalizeDate(data.startDate),
          end_date: normalizeDate(data.endDate, true),
          price: parseFloat(data.price) || 0,
          details: data.details,
          riddle_ids: levels.filter((level) => level.riddleId !== null).map(level => parseInt(level.riddleId || '0'))
        };
        await createTournament(tournamentData);
      } else {
        const tournamentData: CreateTournamentRequest = {
          title: data.title,
          description: data.description,
          start_date: normalizeDate(data.startDate),
          end_date: normalizeDate(data.endDate, true),
          price: parseFloat(data.price) || 0,
          details: data.details,
          riddle_ids: levels.filter((level) => level.riddleId !== null).map(level => parseInt(level.riddleId || '0'))
        };
        await createTournament(tournamentData);
      }

      setIsLoading(prev => ({ ...prev, form: false }));
      onClose();
      if (onSave) {
        onSave();
      }
    } catch (err: unknown) {
      setIsLoading(prev => ({ ...prev, form: false }));
      onClose();
      if (onSave) {
        onSave();
      }
      handleApiError(err, "Failed to save tournament. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!editData?.numericId) return;

    const confirmed = window.confirm("Are you sure you want to delete this tournament?");
    if (!confirmed) return;

    setIsLoading(prev => ({ ...prev, form: true }));

    try {
      await deleteTournament(editData.numericId);
    } catch (err: unknown) {
      handleApiError(err, "Failed to delete tournament. Please try again.");
    }

    setIsLoading(prev => ({ ...prev, form: false }));
    onClose();
    if (onDelete) {
      onDelete();
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  const filledLevels = levels.filter((level) => level.riddleId !== null);
  const showLevelsSection = mode === "create" || mode === "duplicate";

  return (
    <div onClick={handleBackdropClick} className="fixed inset-0 bg-white/45 flex items-center justify-center z-[9999] p-4" >
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-lg drop-shadow-lg border border-[#EBEDEF] relative overflow-hidden" >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900"> {mode === 'edit' ? 'Edit Tournament' : 'Create Tournament'} </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" disabled={isSubmitting || isLoading.form} >
            <X size={24} />
          </button>
        </div>

        <div ref={containerRef} className="flex-1 overflow-y-auto px-6 py-6 overflow-x-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" >
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-black">Title</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="Title"
                  className="w-full h-8 px-3 py-2 border border-[#DCDEE4] rounded-lg bg-white text-[#33394A] shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (<p className="text-sm text-red-500">{errors.title.message}</p>)}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-black">Price</label>
                <input
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    validate: (v) =>
                      !isNaN(parseFloat(v)) || "Price must be a valid number",
                    min: {
                      value: 0,
                      message: "Only positive number allowed"
                    },
                    valueAsNumber: true,
                  })}
                  placeholder="Price"
                  className="w-full h-8 px-3 py-2 border border-[#DCDEE4] rounded-lg bg-white text-[#33394A] shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.price && (<p className="text-sm text-red-500">{errors.price.message}</p>)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-black"> Start Date </label>
                <input
                  {...register("startDate", {
                    required: "Start Date is required",
                    validate: (value) => {
                      const nowPlus7 = moment().add(7, "minutes");
                      const selectedStart = moment(value);

                      if (!selectedStart.isValid()) {
                        return "Invalid start date";
                      }

                      if (!selectedStart.isSameOrAfter(nowPlus7)) {
                        return "Start date must be at least 7 minutes from now";
                      }

                      return true;
                    },
                  })}
                  type="datetime-local"
                  min={minStartDate}
                  disabled={editData?.status === 'CONCLUDED'}
                  onClick={(e) => e.currentTarget.showPicker?.()}
                  className={`w-full h-8 px-3 py-2 ${editData?.status === "CONCLUDED" ? "cursor-not-allowed bg-gray-200" : "cursor-pointer bg-white"} border border-[#DCDEE4] rounded-lg bg-white text-[#33394A] shadow focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.startDate && (<p className="text-sm text-red-500">{errors.startDate.message}</p>)}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-black"> End Date </label>
                <input
                  {...register("endDate", {
                    required: "End Date is required",
                    validate: (value, formValues) => {
                      const start = moment(formValues.startDate);
                      const end = moment(value);

                      if (!start.isValid() || !end.isValid()) {
                        return "Invalid date selection";
                      }

                      if (!end.isAfter(start)) {
                        return "End date must be greater than start date";
                      }

                      if (end.diff(start, "minutes") < 7) {
                        return "End date must be at least 7 minutes after start date";
                      }

                      return true;
                    },
                  })}
                  type="datetime-local"
                  min={startDate || today}
                  disabled={editData?.status === 'CONCLUDED'}
                  onClick={(e) => e.currentTarget.showPicker?.()}
                  className={`w-full h-8 px-3 py-2 ${editData?.status === "CONCLUDED" ? "cursor-not-allowed bg-gray-200" : "cursor-pointer bg-white"} border border-[#DCDEE4] rounded-lg text-[#33394A] shadow focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.endDate && (<p className="text-sm text-red-500">{errors.endDate.message}</p>)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-black">Description</label>
                <div className="border border-[#DCDEE4] rounded-lg bg-white h-[119px]">
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 3,
                        message: "Description must be at least 3 characters",
                      },
                      maxLength: {
                        value: 24,
                        message: "Description cannot exceed 24 characters",
                      },
                    })}
                    placeholder="Description"
                    className="w-full h-full px-3 py-2 resize-none border-0 rounded-lg bg-transparent text-sm font-semibold text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.description && (<p className="text-sm text-red-500">{errors.description.message}</p>)}
              </div>
              <div className="space-y-6.5">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-black">Details</label>
                  <div className="border border-[#DCDEE4] rounded-lg bg-white h-[119px]">
                    <textarea
                      {...register("details", { required: "Details is required" })}
                      placeholder="Details"
                      className="w-full h-full px-3 py-2 resize-none border-0 rounded-lg bg-transparent text-sm font-semibold text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.details && (<p className="text-sm text-red-500">{errors.details.message}</p>)}
                </div>
              </div>
            </div>
            {showLevelsSection && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900"> Tournament Levels </h3>
                  <span className="text-sm text-gray-500"> {filledLevels.length} riddle(s) added </span>
                </div>

                {isLoading.riddles ? (
                  <div className="text-center py-8 text-gray-500">
                    <TableLoader message="Loading riddles..." />
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {levels.map((level, index) => {
                        const availableRiddles = getAvailableRiddles(index);
                        const selectedRiddle = getSelectedRiddle(level.riddleId);
                        const isLastLevel = index === levels.length - 1;
                        const canRemove = levels.length > 1; // allow removing any level if more than 1
                        const dropdownOptions = [
                          { value: '', label: 'Select a riddle for this level' },
                          ...availableRiddles.map(riddle => ({
                            value: riddle.id.toString(),
                            label: `${riddle.title} (ID: ${riddle.level_id || riddle.id})`
                          }))
                        ];


                        return (
                          <div key={index} ref={(el) => { if (el) levelRefs.current[index] = el; }} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200" >
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-700 font-semibold rounded-lg flex-shrink-0">
                              {level.levelNumber}
                            </div>

                            <div className="flex-1 relative">
                              <CustomDropdown
                                value={level.riddleId || ''}
                                onChange={(value) => handleRiddleSelect(index, value)}
                                placeholder="Select a riddle for this level"
                                disabled={isSubmitting || isLoading.form}
                                options={dropdownOptions}
                                onOpen={() => handleDropdownOpen(index)}
                              />
                            </div>

                            {canRemove && (
                              <button
                                onClick={() => handleRemoveLevel(index)}
                                className="p-2 text-red-500 hover:bg-red-50 cursor-pointer rounded-lg transition-colors flex-shrink-0"
                                title="Remove level"
                                disabled={isSubmitting || isLoading.form}
                                type="button"
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-sm text-gray-500 mt-3"> Select a riddle for each level. A new level will appear automatically after you make a selection. </p>
                  </>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting || isLoading.form}
            className="px-6 py-2.5 cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || isLoading.form}
            className="px-6 py-2.5 bg-gray-900 cursor-pointer text-white font-medium hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading.form ? (mode === 'edit' ? 'Updating...' : 'Creating...') : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
});

AddTournamentModal.displayName = 'AddTournamentModal';

export default AddTournamentModal;
