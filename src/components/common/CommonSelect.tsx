"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { TextField, TextFieldProps, MenuItem, SelectProps } from "@mui/material";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type CommonSelectProps = Omit<TextFieldProps, "variant" | "select"> & {
  options: SelectOption[];
};

const selectStyles = {
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
    "&::placeholder": {
      color: "#a1a1aa",
      opacity: 1,
    },
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.75rem",
    fontWeight: 600,
    marginLeft: 0,
    marginTop: "0.375rem",
  },
};

export const CommonSelect = forwardRef<HTMLDivElement, CommonSelectProps>(
  ({ options, sx, slotProps, label, size, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const [openedAt, setOpenedAt] = useState(0);

    useEffect(() => {
      if (!open) return;

      const handleScroll = () => {
        // Bỏ qua sự kiện cuộn được kích hoạt quá nhanh sau khi mở (do quán tính cuộn từ trước)
        if (Date.now() - openedAt < 150) return;
        setOpen(false);
      };

      // Đăng ký sự kiện scroll trên toàn bộ các container (capture: true)
      window.addEventListener("scroll", handleScroll, { capture: true, passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll, { capture: true });
      };
    }, [open, openedAt]);

    const isSmall = size === "small";
    const labelSpacingClass = isSmall ? "space-y-1.5" : "space-y-2";
    const labelTextClass = isSmall
      ? "text-[10px] font-bold uppercase tracking-wider block"
      : "text-xs font-bold uppercase tracking-wider block";

    const selectElement = (
      <TextField
        ref={ref}
        select
        variant="outlined"
        size={size}
        sx={{ ...selectStyles, ...sx }}
        slotProps={{
          ...slotProps,
          select: (ownerState: unknown) => {
            const resolvedProps =
              typeof slotProps?.select === "function"
                ? (slotProps.select as (state: unknown) => SelectProps)(ownerState)
                : (slotProps?.select as SelectProps | undefined);

            return {
              ...resolvedProps,
              open: open,
              onOpen: (e: React.SyntheticEvent) => {
                setOpen(true);
                setOpenedAt(Date.now());
                if (resolvedProps?.onOpen) resolvedProps.onOpen(e);
              },
              onClose: (e: React.SyntheticEvent) => {
                setOpen(false);
                if (resolvedProps?.onClose) resolvedProps.onClose(e);
              },
              MenuProps: {
                disableScrollLock: true,
                ...resolvedProps?.MenuProps,
                slotProps: {
                  ...resolvedProps?.MenuProps?.slotProps,
                  paper: {
                    ...resolvedProps?.MenuProps?.slotProps?.paper,
                    sx: {
                      borderRadius: "0.75rem",
                      boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      backgroundColor: "var(--input-bg, #ffffff)",
                      backgroundImage: "none",
                      border: "1px solid var(--input-border, #e4e4e7)",
                      "& .MuiMenuItem-root": {
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "var(--foreground, #171717)",
                        padding: "10px 16px",
                        "&:hover": {
                          backgroundColor: "var(--input-hover-bg, rgba(0, 0, 0, 0.04))",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(46, 126, 122, 0.08)",
                          color: "var(--primary)",
                          "&:hover": {
                            backgroundColor: "rgba(46, 126, 122, 0.12)",
                          },
                        },
                      },
                      ...(resolvedProps?.MenuProps?.slotProps?.paper as any)?.sx,
                    },
                  },
                },
              },
            } as SelectProps;
          },
        }}
        {...props}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );

    if (label) {
      return (
        <div className={`${labelSpacingClass} w-full`}>
          <label className={labelTextClass} style={{ color: "var(--input-label)" }}>
            {label}
          </label>
          {selectElement}
        </div>
      );
    }

    return selectElement;
  },
);

CommonSelect.displayName = "CommonSelect";
