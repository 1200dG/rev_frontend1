"use client";
import React, { useEffect, useRef, useState } from "react";
import { useCalculateScreenWidth } from "@/lib/hooks/calculateScreenWidth";

type Option = {
  label: string;
  value: string;
};

type SelectMenuProps = {
  id: string;
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  align?: "start" | "end";
  customClass?: string;
};

export default function SelectMenu({ id, options, value, onChange, openId, setOpenId, align, customClass }: SelectMenuProps) {
  const open = openId === id;
  const selected = options.find((opt) => opt.value === value);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasWidth = (cls = "") => /\bw-\[|\bw-\d|\bw-full|\bw-screen/.test(cls);
  const hasHeight = (cls = "") => /\bh-\[|\bh-\d|\bh-full|\bh-screen/.test(cls);
  const { screenWidth } = useCalculateScreenWidth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current?.contains(event.target as Node)) return;
      setOpenId(null);
    }

    if (open) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open, setOpenId]);

  return (
    <>
      {screenWidth > 650 ? (
        <div ref={menuRef} className="relative w-32" >
          <div className={`flex ${align === "end" ? "justify-end" : "justify-start"} items-center`}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenId(open ? null : id);
              }}
              className="inline-flex items-center gap-2 bg-transparent cursor-pointer select-none px-2 py-1 rounded-md transition-all duration-200 hover:bg-white/5 hover:shadow-[0_0_10px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-100"
            >
              <img src="/profile/arrowDown.svg" className={`w-2 h-2 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-4.5 xl:h-4.5 2xl:w-5 2xl:h-5 transition-transform ${open ? "rotate-180" : ""}`} />
              <span className="text-white text-xs sm:text-sm lg:text-base xl:text-lg font-medium">
                {selected ? selected.label : "Select"}
              </span>
            </button>
          </div>

          {open && (
            <div className="absolute left-0 top-full mt-4 p-2 flex flex-col gap-1 w-full bg-black/80 text-white border border-[#D4B588] rounded-md shadow-lg z-10">
              {options.map((opt, index) => (
                <React.Fragment key={index}>
                  <div
                    key={opt.value}
                    className={`px-3 py-2 cursor-pointer hover:bg-[#ba9f79]/40 rounded ${opt.value === value ? "bg-[#ba9f79]/60" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(opt.value);
                      setOpenId(null);
                    }}
                  >
                    {opt.label}
                  </div>
                  <div className={`${index === options.length - 1 ? "hidden" : "w-full h-px border-b border-[#D4B588]"}`} />
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={`relative w-[calc(148/375*100vw)] h-[calc(41/812*100vh)]`}>
          <div className={`flex ${align === "end" ? "justify-end" : "justify-center"} items-center w-[calc(148/375*100vw)] h-[calc(41/812*100vh)] rounded-md border-2 border-[#d4b588] bg-[#472016] ${customClass}`}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenId(open ? null : id);
              }}
              className={`inline-flex justify-between items-center ${!hasWidth(customClass) ? "w-[calc(118/375*100vw)]" : ""} ${!hasHeight(customClass) ? "h-[calc(41/812*100vh)]" : ""} ${customClass} gap-2 bg-transparent cursor-pointer select-none rounded-md transition-all duration-200 hover:bg-white/5 hover:shadow-[0_0_10px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-100`}
            >
              <span className={`text-[clamp(8px,5.5vw,12px)] text-[#d4b588] font-bold ${customClass}`}>
                {selected ? selected.label : "Select"}
              </span>
              <img src="/clash/down.svg" className={`w-[calc(12/375*100vw)] h-[calc(12/812*100vh)] transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
          </div>

          {open && (
            <div className="absolute left-0 top-full mt-4 p-2 flex flex-col gap-1 w-full bg-black/80 text-white border border-[#D4B588] rounded-md shadow-lg z-10">
              {options.map((opt, index) => (
                <React.Fragment key={index}>
                  <div
                    key={index}
                    className={`px-3 py-2 cursor-pointer hover:bg-[#ba9f79]/40 rounded ${opt.value === value ? "bg-[#ba9f79]/60" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(opt.value);
                      setOpenId(null);
                    }}
                  >
                    {opt.label}
                  </div>
                  <div className={`${index === options.length - 1 ? "hidden" : "w-full h-px border-b border-[#D4B588]"}`} />
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}

    </>
  );
}
