"use client";

import React from "react";
import { ConfirmationModalProps } from "@/lib/types/admin";
import ConfirmModalLayout from "@/components/common/confirmModal/ConfirmationModalLayout";
import { BeatLoader } from "react-spinners";

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  mode = "Delete"
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const shouldClose = await onConfirm();
      if (shouldClose) onClose();
    } catch (error) {
      console.error("Error in confirmation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfirmModalLayout
      isOpen={isOpen}
      onClose={onClose}
      header={null}
      footer={
        <div className="flex justify-end gap-3 border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-800 cursor-pointer bg-gray-200 hover:bg-gray-300 transition-all duration-200 font-medium"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-all duration-200 
            ${mode === "Edit"
                ? isLoading
                  ? "bg-black opacity-70 cursor-not-allowed"
                  : "bg-black hover:bg-gray-300 text-white cursor-pointer"
                : isLoading
                  ? "bg-red-400 opacity-70 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-500 text-white cursor-pointer"
              }`}
          >
            {isLoading ? (
              <>
                <BeatLoader size={8} color="white" />
                <span>{mode === "Edit" ? "Updating..." : "Deleting..."}</span>
              </>
            ) : (
              <span>{mode === "Edit" ? "Update" : confirmText}</span>
            )}
          </button>
        </div>
      }
    >
      <div className="bg-white text-gray-700 p-4 text-center space-y-3">
        <p className="text-lg font-semibold leading-relaxed">{description}</p>
      </div>
    </ConfirmModalLayout>
  );
};
