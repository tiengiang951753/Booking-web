"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { CommonTextField } from "./CommonTextField";

export interface CommonPriceRangeFieldProps {
  label?: string;
  error?: boolean;
  helperText?: string;

  // Props for Min Input
  valueMin?: number | string | null;
  onChangeMin?: (val: number | null) => void;
  minPlaceholder?: string;

  // Props for Max Input
  valueMax?: number | string | null;
  onChangeMax?: (val: number | null) => void;
  maxPlaceholder?: string;

  suffix?: string;
}

const borderlessStyles = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "transparent",
    padding: 0,
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  "& .MuiOutlinedInput-input": {
    textAlign: "left",
    padding: "10px 8px",
    color: "var(--foreground, #171717)",
  },
};

export const CommonPriceRangeField = forwardRef<
  HTMLDivElement,
  CommonPriceRangeFieldProps
>(
  (
    {
      label,
      error,
      helperText,
      valueMin,
      onChangeMin,
      minPlaceholder = "",
      valueMax,
      onChangeMax,
      maxPlaceholder = "",
      suffix = '',
    },
    ref,
  ) => {
    const [displayMin, setDisplayMin] = useState("");
    const [displayMax, setDisplayMax] = useState("");

    const formatNumber = (val: any): string => {
      if (val === undefined || val === null || val === "") return "";
      const cleaned = String(val).replace(/\D/g, "");
      if (!cleaned) return "";
      return parseInt(cleaned, 10).toLocaleString("vi-VN");
    };

    useEffect(() => {
      setDisplayMin(formatNumber(valueMin));
    }, [valueMin]);

    useEffect(() => {
      setDisplayMax(formatNumber(valueMax));
    }, [valueMax]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const cleaned = raw.replace(/\D/g, "");
      setDisplayMin(formatNumber(cleaned));
      if (onChangeMin) {
        onChangeMin(cleaned ? parseInt(cleaned, 10) : null);
      }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const cleaned = raw.replace(/\D/g, "");
      setDisplayMax(formatNumber(cleaned));
      if (onChangeMax) {
        onChangeMax(cleaned ? parseInt(cleaned, 10) : null);
      }
    };

    return (
      <div ref={ref} className="space-y-2 w-full">
        {label && (
          <label
            className="text-xs font-bold uppercase tracking-wider block"
            style={{ color: "var(--input-label)" }}
          >
            {label}
          </label>
        )}
        <div
          className={`flex items-center gap-1 bg-[var(--input-bg,#ffffff)] border ${error ? "border-red-500 dark:border-red-500" : "border-[var(--input-border,#e4e4e7)] hover:border-[var(--input-border-focus,#2E7E7A)] focus-within:border-[var(--input-border-focus,#2E7E7A)]"} rounded-xl px-3 shadow-sm transition-colors duration-200`}
        >
          <CommonTextField
            value={displayMin}
            onChange={handleMinChange}
            placeholder={minPlaceholder}
            sx={borderlessStyles}
          />
          <span className="text-zinc-300 dark:text-zinc-700 font-light select-none">
            |
          </span>
          <CommonTextField
            value={displayMax}
            onChange={handleMaxChange}
            placeholder={maxPlaceholder}
            sx={borderlessStyles}
          />
          {suffix && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400 pr-2 select-none whitespace-nowrap">
              {suffix}
            </span>
          )}
        </div>
        {error && helperText && (
          <p className="text-[11px] font-bold text-red-500 mt-1 pl-1">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

CommonPriceRangeField.displayName = "CommonPriceRangeField";
