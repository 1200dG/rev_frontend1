"use client";

import React, { useMemo, useCallback } from "react";
import { PaginationProps } from "@/lib/types/common/types";

const STYLES = {
    base: "px-3 py-1 text-sm border border-[#32475C1F] rounded",
    active: "bg-[#22222C] text-white cursor-pointer",
    inactive: "text-[#32475CDE] bg-white hover:bg-gray-50 cursor-pointer",
    disabled: "text-[#919EAB] bg-gray-50 cursor-not-allowed",
} as const;

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const visiblePages = useMemo(() => {
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (currentPage <= 3) {
      pages.push(
        ...Array.from({ length: 4 }, (_, i) => i + 1),
        "...",
        totalPages
      );
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        ...Array.from({ length: 4 }, (_, i) => totalPages - 3 + i)
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }

    return pages;
  }, [currentPage, totalPages]);

  const getButtonClass = useCallback(
    (isActive: boolean, isDisabled: boolean) => {
      if (isDisabled) return `${STYLES.base} ${STYLES.disabled}`;
      if (isActive) return `${STYLES.base} ${STYLES.active}`;
      return `${STYLES.base} ${STYLES.inactive}`;
    },
    []
  );

  if (totalPages <= 1) return null;

  return (
      <div className={`flex items-center justify-center px-4 py-3 bg-white border-t border-[#32475C1F] ${className}`}>
          <div className="flex items-center space-x-2">
              <button onClick={handlePrevious} disabled={currentPage === 1} className={`${getButtonClass(false, currentPage === 1)} `}>
                  Previous
              </button>

              <div className="flex items-center space-x-1">
                  {visiblePages.map((page, index) => (
                      <React.Fragment key={index}>
                          {page === "..." ? (
                              <span className="px-3 py-1 text-sm text-[#919EAB]">...</span>
                          ) : (
                              <button
                                  onClick={() => onPageChange(page as number)}
                                  className={`${getButtonClass(currentPage === page, false)} cursor-pointer`}
                              >
                                  {page}
                              </button>
                          )}
                      </React.Fragment>
                  ))}
              </div>

              <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`${getButtonClass(false, currentPage === totalPages)}`}
              >
                  Next
              </button>
          </div>
      </div>
  );
};

export default Pagination;
