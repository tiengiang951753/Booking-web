"use client";

import React, { forwardRef } from "react";
import { TextField, TextFieldProps, InputAdornment } from "@mui/material";

export type CommonTextFieldProps = Omit<TextFieldProps, "variant"> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

const textFieldStyles = {
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
    "&.MuiOutlinedInput-multiline": {
      padding: "0",
    },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: "0.875rem",
    padding: "12px 16px",
    color: "var(--foreground, #171717)",
    "&::placeholder": {
      color: "#a1a1aa", // zinc-400
      opacity: 1,
    },
  },
  "& .MuiOutlinedInput-inputMultiline": {
    padding: "12px 16px",
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.75rem",
    fontWeight: 600,
    marginLeft: 0,
    marginTop: "0.375rem",
  },
};

export const CommonTextField = forwardRef<HTMLDivElement, CommonTextFieldProps>(
  (
    {
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      sx,
      slotProps,
      label,
      size,
      ...props
    },
    ref,
  ) => {
    const inputSlotProps = {
      ...slotProps?.input,
      ...((leftIcon || prefix) && {
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{
              color: "var(--foreground, #171717)",
              "& .MuiTypography-root": {
                color: "inherit",
                fontWeight: "semibold",
                fontSize: "0.875rem",
              },
            }}
          >
            {leftIcon || prefix}
          </InputAdornment>
        ),
      }),
      ...((rightIcon || suffix) && {
        endAdornment: (
          <InputAdornment
            position="end"
            sx={{
              color: "var(--foreground, #171717)",
              "& .MuiTypography-root": {
                color: "inherit",
                fontWeight: "semibold",
                fontSize: "0.875rem",
              },
            }}
          >
            {rightIcon || suffix}
          </InputAdornment>
        ),
      }),
    };

    const isSmall = size === "small";
    const labelSpacingClass = isSmall ? "space-y-1.5" : "space-y-2";
    const labelTextClass = isSmall
      ? "text-[10px] font-bold uppercase tracking-wider block"
      : "text-xs font-bold uppercase tracking-wider block";

    const textFieldElement = (
      <TextField
        ref={ref}
        variant="outlined"
        size={size}
        sx={{ ...textFieldStyles, ...sx }}
        slotProps={{
          ...slotProps,
          input: inputSlotProps,
        }}
        {...props}
      />
    );

    if (label) {
      return (
        <div className={`${labelSpacingClass} w-full`}>
          <label
            className={labelTextClass}
            style={{ color: "var(--input-label)" }}
          >
            {label}
          </label>
          {textFieldElement}
        </div>
      );
    }

    return textFieldElement;
  },
);

CommonTextField.displayName = "CommonTextField";
