"use client";

import React, { forwardRef } from "react";
import { CommonTextField, CommonTextFieldProps } from "./CommonTextField";

export type CommonTimePickerProps = Omit<CommonTextFieldProps, "type">;

export const CommonTimePicker = forwardRef<HTMLDivElement, CommonTimePickerProps>(
  (props, ref) => {
    return (
      <CommonTextField
        ref={ref}
        type="time"
        {...props}
      />
    );
  }
);

CommonTimePicker.displayName = "CommonTimePicker";
