"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { AppContext } from "@/components/context/AppContext";

interface PeriodDropdownProps {
  options?: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  mode?: "global" | "local";
}

const PeriodDropdown: React.FC<PeriodDropdownProps> = ({
  options = ["Monthly", "Yearly"],
  defaultValue = "Monthly",
  onChange,
  mode = "local",
}) => {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { selectedPeriod, setSelectedPeriod } = useContext(AppContext) ?? {};

  useEffect(() => {
    if (mode === "local") {
      setLocalValue(defaultValue);
    }
  }, [defaultValue, mode]);

  const selected = mode === "global" ? selectedPeriod ?? defaultValue : localValue;

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleSelect = (val: string) => {
    if (mode === "global" && setSelectedPeriod) {
      setSelectedPeriod(val);
    } else {
      setLocalValue(val);
    }
    onChange?.(val);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button type="button" onClick={toggleDropdown}
        className="flex items-center cursor-pointer gap-2 min-w-36 w-[120px] border border-gray-300 rounded-lg px-3 py-2 text-gray-700 text-sm hover:bg-gray-50"
      >
        <img src="/admin/header/calendar.svg" alt="Calendar icon" className="w-5 h-5" />
        <span>{selected}</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 ${selected === option ? "bg-gray-50 font-medium" : ""
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PeriodDropdown;
