"use client";
import React, { useState, useRef, useEffect } from "react";
import { DropdownProps } from "@/lib/types/common/types";

const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  value,
  status,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState<'below' | 'above'>('below');
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const selectedIndex = value ? options.indexOf(value) : -1;

  const calculateDropdownPosition = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dropdownHeight = options.length * 40 + 16;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownPosition('above');
    } else {
      setDropdownPosition('below');
    }
  };

  const openDropdown = () => {
    calculateDropdownPosition();
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const onSelect = (index: number) => {
    const option = options[index];

  if (option.toLowerCase() === status?.toLowerCase()) return;
    if (onChange) {
      onChange(options[index]);
    }
    closeDropdown();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }

    function handleResize() {
      if (isOpen) {
        calculateDropdownPosition();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDropdown();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : options.length - 1,
        );
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlightedIndex >= 0) onSelect(highlightedIndex);
        break;
      case "Escape":
        e.preventDefault();
        closeDropdown();
        break;
      default:
        break;
    }
  };
  return (
      <div className="relative inline-block w-auto" ref={containerRef}>
          <div className="flex justify-between items-center gap-1 mr-2">
              <span className="select-none text-black text-md font-normal">{selectedIndex !== -1 ? options[selectedIndex] : placeholder}</span>
              <img
                  src="/admin/virtiDots.svg"
                  alt="Menu"
                  tabIndex={0}
                  role="button"
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                  onClick={toggleDropdown}
                  onKeyDown={onKeyDown}
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"} cursor-pointer max-w-min`}
              />
          </div>

          {isOpen && (
              <ul
                  ref={dropdownRef}
                  role="listbox"
                  aria-activedescendant={highlightedIndex >= 0 ? `dropdown-item-${highlightedIndex}` : undefined}
                  tabIndex={-1}
                  className={`absolute left-auto right-0 bg-[#F6F7F9] border border-[#CACDD6] rounded-lg w-[190px] shadow-lg z-[9999] p-2 ${
                      dropdownPosition === "above" ? "bottom-8" : "top-8"
                  }`}
                  style={{
                      boxShadow: "0px 1px 2px 0px rgba(9, 15, 13, 0.10)",
                  }}
              >
                  {options.map((item, index) => {
                      let isDisabled = item.toLowerCase() === status?.toLowerCase();
                      if (item.toLowerCase() === "edit" && (status?.toLowerCase() === "active" || status?.toLowerCase() === "concluded")) {
                        isDisabled = true;
                      }
                      if (item.toLowerCase() === "active" && (status?.toLowerCase() === "concluded")) {
                        isDisabled = true;
                      }
                      if (item.toLowerCase() === "concluded" && (status?.toLowerCase() === "pending")) {
                        isDisabled = true;
                      }
                      if (item.toLowerCase() === "delete" && (status?.toLowerCase() === "active")) {
                        isDisabled = true;
                      }

                      return (
                          <li
                              id={`dropdown-item-${index}`}
                              key={index}
                              role="option"
                              aria-selected={selectedIndex === index}
                              aria-disabled={isDisabled}
                              onClick={() => !isDisabled && onSelect(index)}
                              onMouseEnter={() => !isDisabled && setHighlightedIndex(index)}
                              className={`select-none px-4 py-2
                                ${index < options.length - 1 ? "border-b border-[#CACDD6]" : ""}
                                ${isDisabled ? "text-gray-400 cursor-not-allowed" : highlightedIndex === index ? "bg-blue-500 text-white rounded-lg cursor-pointer" : "text-black cursor-pointer" }
                                ${selectedIndex === index && highlightedIndex !== index ? "font-semibold" : ""}
                              `}
                              >
                              {item}
                          </li>
                      );
                  })}
              </ul>
          )}
      </div>
  );
};

export default Dropdown;
