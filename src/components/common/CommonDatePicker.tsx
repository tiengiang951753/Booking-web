"use client";

import React, { forwardRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

export interface CommonDatePickerProps {
  value?: string | null; // ISO string or date string
  onChange?: (dateString: string | null) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  sx?: any;
  placeholder?: string;
  size?: "small" | "medium";
}

const datePickerStyles = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.75rem",
    backgroundColor: "var(--input-bg, #ffffff)",
    "& fieldset": {
      borderColor: "var(--input-border, #e4e4e7)",
      transition: "border-color 0.2s ease",
    },
    "&:hover fieldset": {
      borderColor: "var(--input-border-focus, #2E7E7A)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--input-border-focus, #2E7E7A)",
      borderWidth: "1px",
    },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: "0.875rem",
    padding: "12px 16px",
    color: "var(--foreground, #171717)",
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.75rem",
    fontWeight: 600,
    marginLeft: 0,
    marginTop: "0.375rem",
  },
};

export const CommonDatePicker = forwardRef<HTMLDivElement, CommonDatePickerProps>(
  ({ value, onChange, label, error, helperText, disabled, sx, placeholder, size }, ref) => {
    const parsedValue = value ? dayjs(value) : null;

    const handleDateChange = (date: Dayjs | null) => {
      if (onChange) {
        onChange(date ? date.toISOString() : null);
      }
    };

    const isSmall = size === "small";
    const labelSpacingClass = isSmall ? "space-y-1.5" : "space-y-2";
    const labelTextClass = isSmall
      ? "text-[10px] font-bold uppercase tracking-wider block"
      : "text-xs font-bold uppercase tracking-wider block";

    const datePickerElement = (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          ref={ref}
          value={parsedValue}
          onChange={handleDateChange}
          disabled={disabled}
          sx={{ ...datePickerStyles, ...sx }}
          slotProps={{
            textField: {
              error,
              helperText,
              fullWidth: true,
              placeholder,
              size,
            } as any,
          }}
        />
      </LocalizationProvider>
    );

    if (label) {
      return (
        <div className={`${labelSpacingClass} w-full`}>
          <label className={labelTextClass} style={{ color: "var(--input-label)" }}>
            {label}
          </label>
          {datePickerElement}
        </div>
      );
    }

    return datePickerElement;
  }
);

CommonDatePicker.displayName = "CommonDatePicker";
