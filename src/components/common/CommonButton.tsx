"use client";

import React, { forwardRef } from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material";

export interface CommonButtonProps extends Omit<MuiButtonProps, "variant"> {
  variant?: "contained" | "fill" | "outlined" | "text";
  text?: React.ReactNode;
  loading?: boolean;
}

const getButtonSx = (variant: string, color: string) => {
  const base = {
    textTransform: "none" as const,
    borderRadius: "0.75rem",
    fontWeight: "bold",
    transition: "all 0.2s ease-in-out",
  };

  if (variant === "contained" || variant === "fill") {
    return {
      ...base,
      backgroundColor: "var(--primary, #2E7E7A)",
      color: "var(--button-text, #ffffff)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      "&:hover": {
        backgroundColor: "var(--primary-hover, #28666b)",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      "&.Mui-disabled": {
        backgroundColor: "rgba(46, 126, 122, 0.5)",
        color: "rgba(255, 255, 255, 0.5)",
      },
    };
  }

  if (variant === "outlined") {
    if (color === "secondary" || color === "inherit") {
      return {
        ...base,
        borderColor: "var(--input-border, #e4e4e7)",
        color: "var(--text-muted, #71717a)",
        "&:hover": {
          borderColor: "var(--text-muted, #71717a)",
          backgroundColor: "rgba(0, 0, 0, 0.02)",
        },
      };
    }
    // Default primary outlined
    return {
      ...base,
      borderColor: "var(--primary, #2E7E7A)",
      color: "var(--primary, #2E7E7A)",
      "&:hover": {
        borderColor: "var(--primary-hover, #28666b)",
        backgroundColor: "rgba(46, 126, 122, 0.04)",
      },
      "&.Mui-disabled": {
        borderColor: "rgba(46, 126, 122, 0.5)",
        color: "rgba(46, 126, 122, 0.5)",
      },
    };
  }

  // Text variant
  return {
    ...base,
    color: color === "secondary" || color === "inherit" ? "var(--text-muted, #71717a)" : "var(--primary, #2E7E7A)",
    "&:hover": {
      backgroundColor: color === "secondary" || color === "inherit" ? "rgba(0, 0, 0, 0.02)" : "rgba(46, 126, 122, 0.04)",
    },
  };
};

export const CommonButton = forwardRef<HTMLButtonElement, CommonButtonProps>(
  (
    {
      variant = "contained",
      color = "primary",
      text,
      loading = false,
      disabled,
      children,
      sx,
      size = "medium",
      ...props
    },
    ref
  ) => {
    const isSmall = size === "small";
    const sizeStyles = isSmall
      ? { fontSize: "0.725rem", padding: "6px 14px" }
      : { fontSize: "0.75rem", padding: "8px 20px" };

    const buttonSx = {
      ...getButtonSx(variant, color),
      ...sizeStyles,
      ...sx,
    };

    const loadingSpinner = (
      <span className="flex items-center gap-2">
        <svg className="animate-spin h-4 w-4 text-inherit" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Đang xử lý...</span>
      </span>
    );

    return (
      <MuiButton
        ref={ref}
        disabled={disabled || loading}
        sx={buttonSx}
        {...props}
      >
        {loading ? loadingSpinner : text || children}
      </MuiButton>
    );
  }
);

CommonButton.displayName = "CommonButton";
