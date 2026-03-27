import { ButtonProps } from "@/lib/types/common/types";
import type React from "react";

const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
  customStyle,
  customClass,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={customStyle}
      className={`px-4 py-2 rounded-[10px] transition-colors ${className} ${customClass || ""} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
