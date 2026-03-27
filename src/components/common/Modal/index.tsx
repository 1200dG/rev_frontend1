"use client";

import React from "react";
import { X } from "lucide-react";
import { ModalLayoutProps } from "@/lib/types/common/types";
import { head } from "lodash";

const ModalLayout: React.FC<ModalLayoutProps> = ({
  isOpen,
  onClose,
  header,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-white/45 flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-[800px] max-h-[85vh] flex flex-col shadow-lg drop-shadow-lg border border-[#EBEDEF] mb-6">
        {header && (
          
            <div className="flex justify-between items-center p-5 bg-[#FAFAFA] border-b border-[#EBEDEF]">
              {header}
              <button
                onClick={onClose}
                className="text-black hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
        )
        }

        <div className="flex-1 p-4 pt-7 pb-7 overflow-hidden">{children}</div>

        <div className="flex justify-end gap-4 p-6 bg-[#FAFAFA] border-t border-[#EBEDEF]">
          {footer}
        </div>
      </div>
    </div>
  );
};

export default ModalLayout;
