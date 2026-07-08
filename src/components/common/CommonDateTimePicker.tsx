"use client";

import React, { forwardRef } from "react";
import { CommonTextField, CommonTextFieldProps } from "./CommonTextField";

export type CommonDateTimePickerProps = Omit<CommonTextFieldProps, "type">;

export const CommonDateTimePicker = forwardRef<HTMLDivElement, CommonDateTimePickerProps>(
  (props, ref) => {
    return (
      <CommonTextField
        ref={ref}
        type="datetime-local"
        {...props}
      />
    );
  }
);

CommonDateTimePicker.displayName = "CommonDateTimePicker";
