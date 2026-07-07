"use client";

import React, { forwardRef } from "react";
import { Switch, SwitchProps } from "@mui/material";

export interface CommonSwitchProps extends Omit<SwitchProps, "size"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  fullWidth?: boolean;
  isRow?: boolean;
  size?: "small" | "medium";
}

const switchStyles = {
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "var(--primary, #2E7E7A)",
    "&:hover": {
      backgroundColor: "rgba(46, 126, 122, 0.08)",
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "var(--primary, #2E7E7A)",
    opacity: 0.5,
  },
  "& .MuiSwitch-track": {
    backgroundColor: "var(--text-muted, #71717a)",
  },
};

export const CommonSwitch = forwardRef<HTMLButtonElement, CommonSwitchProps>(
  (
    { label, description, fullWidth = false, isRow = true, size = "medium", sx, ...props },
    ref
  ) => {
    const isSmall = size === "small";
    const labelTextClass = isSmall
      ? "text-[10px] font-bold uppercase tracking-wider block"
      : "text-xs font-bold uppercase tracking-wider block";

    const labelSpacingClass = isSmall ? "space-y-0.5" : "space-y-1";

    const contentElement = (
      <div className={`${labelSpacingClass} flex-1`}>
        {label && (
          <label className={labelTextClass} style={{ color: "var(--input-label)" }}>
            {label}
          </label>
        )}
        {description && (
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
            {description}
          </p>
        )}
      </div>
    );

    const switchElement = (
      <Switch
        ref={ref}
        size={size}
        sx={{ ...switchStyles, ...sx }}
        {...props}
      />
    );

    if (isRow) {
      return (
        <div
          className={`flex items-center justify-between gap-4 p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/[0.3] dark:bg-zinc-900/10 transition-colors ${
            fullWidth ? "w-full" : "w-auto"
          }`}
        >
          {contentElement}
          <div className="flex-shrink-0">{switchElement}</div>
        </div>
      );
    }

    return (
      <div
        className={`flex flex-col gap-2.5 p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/[0.3] dark:bg-zinc-900/10 transition-colors ${
          fullWidth ? "w-full" : "w-auto"
        }`}
      >
        {contentElement}
        <div className="flex items-center">{switchElement}</div>
      </div>
    );
  }
);

CommonSwitch.displayName = "CommonSwitch";
