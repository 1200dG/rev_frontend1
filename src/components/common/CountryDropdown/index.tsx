"use client";

import { useState, useRef, useEffect } from "react";
import { CountryDropdownProps } from "@/lib/types/common/types";
import { COUNTRIES } from "@/lib/constants/countries";

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  value,
  onChange,
  placeholder = "Select Country"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES.find(country => country.code === value);

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (countryCode: string) => {
    onChange(countryCode);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      
      <div onClick={() => setIsOpen(prev => !prev)} className="bg-white sm:bg-white/10 border border-white text-black sm:text-white rounded-sm px-3 py-3 text-base font-circular cursor-pointer flex items-center justify-between h-[calc(32/812*100vh)] sm:h-[48px]" >
        <div className="flex items-center gap-3">
          {selectedCountry ? (
            <>
              <span className="text-3xl">{selectedCountry.flag}</span>
              <span className="font-medium">{selectedCountry.code}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>

        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-sm shadow-lg z-50 max-h-60 overflow-hidden">

          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* LIST */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country.code}
                  onClick={() => handleSelect(country.code)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-black"
                >
                  <span className="text-3xl">{country.flag}</span>
                  <span className="font-medium">{country.code}</span>
                </div>
              ))
            ) : (
              <p className="px-3 py-2 text-gray-500 text-sm">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryDropdown;
