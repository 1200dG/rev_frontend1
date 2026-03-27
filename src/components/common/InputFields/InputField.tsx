import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { InputFieldProps } from "@/lib/types/common/types";

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  customClass = "",
  disabled = false,
  value,
  register,
  errorMessage,
  showEyeIcon = true,
  accept,
  icon,
  autoComplete = "off",
  maxLength,
  mode = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white">
            {icon}
          </div>
        )}
        <input
          {...register}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          {...(autoComplete ? { autoComplete } : {})}
          className={`w-full ${mode!= "" ? "" : "h-12"} px-4 outline-none rounded-lg font-circular placeholder:font-circular border focus:border focus:border-white transition-colors ${customClass} ${disabled ? "bg-[#38190B] sm:!bg-[#2d291c]" : ""}`}
          disabled={disabled}
          value={value}
          accept={type === "file" ? accept : undefined}
          maxLength={maxLength}
        />
        {type === "password" && showEyeIcon && (
          <button
            type="button"
            className="absolute right-3 top-6 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
        {errorMessage && (
          <p className="sm:mt-1 mt-0 text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default InputField;
