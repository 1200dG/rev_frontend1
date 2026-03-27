"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, Check, ChevronDown } from "lucide-react";
import { ProfileSearch } from "@/lib/types/common/types";

interface AutoCompleteProps {
  name: string;
  placeholder?: string;
  options: ProfileSearch[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  customClass?: string;
  label?: string;
  labelClass?: string;
  errorMessage?: string;
  isSimpleDropdown?: boolean;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  name,
  placeholder = "Search...",
  options,
  value,
  onChange,
  disabled = false,
  customClass = "",
  label,
  labelClass = "",
  errorMessage,
  isSimpleDropdown = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState<ProfileSearch | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchTerm
  ? options.filter((opt) =>
      opt.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];


  useEffect(() => {
    if (value) {
      const option = options.find((opt) => opt.username === value);
      setSelectedOption(option || null);
      setSearchTerm(option?.username || "");
    } else {
      setSelectedOption(null);
      setSearchTerm("");
    }
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: ProfileSearch) => {
    setSelectedOption(option);
    setSearchTerm(option.username);
    onChange?.(option.username);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedOption(null);
    setSearchTerm("");
    onChange?.("");
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (!disabled && !isSimpleDropdown) setIsOpen(true);
  };

  return (
    <div className="relative w-full h-full" ref={dropdownRef}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-circular ${labelClass}`}
        >
          {label}
        </label>
      )}

      <div
        className={`flex items-center h-[calc(39/812*100vh)] sm:h-full w-auto px-3 overflow-hidden py-2 sm:rounded-[0.3125rem] border-r-2 border-t-2 sm:border border-[#D4B588]/50 sm:border-[#D4B588] bg-[#441d0d] sm:bg-[#050505] text-[#D4B588] ${customClass} ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-[#d0a462]"
        }`}
      >
        {!isSimpleDropdown && <Search size={18} className="mr-2 flex-shrink-0" />}

          <input
            id={name}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            className="w-full bg-transparent border-none outline-none text-sm placeholder:text-[#D4B588]"
          />

        <div className="flex items-center ml-2 space-x-1">
          {selectedOption && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {searchTerm && (
        <div className="absolute z-50 w-full mt-1 bg-[#050505] border border-[#D4B588] rounded-[0.3125rem] shadow-lg max-h-60 overflow-y-auto no-scrollbar">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-center text-[#D4B588] text-sm">No options found</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`px-3 py-2 cursor-pointer text-[#D4B588] hover:bg-[#D4B588]/20 ${
                  selectedOption?.username === option.username ? "bg-[#D4B588]/30" : ""
                }`}
              >
                {option.username}
              </div>
            ))
          )}
        </div>
      )}

      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default AutoComplete;
