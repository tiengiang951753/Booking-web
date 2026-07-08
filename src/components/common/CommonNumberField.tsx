"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { CommonTextField, CommonTextFieldProps } from "./CommonTextField";

export interface CommonNumberFieldProps extends Omit<CommonTextFieldProps, "value" | "onChange"> {
  value?: number | string | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement> & { target: { value: number | null } }) => void;
}

export const CommonNumberField = forwardRef<HTMLDivElement, CommonNumberFieldProps>(
  ({ value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");

    const formatNumber = (val: number | string | null | undefined): string => {
      if (val === undefined || val === null || val === "") return "";
      // Chỉ giữ lại các chữ số
      const cleaned = String(val).replace(/\D/g, "");
      if (!cleaned) return "";
      const num = parseInt(cleaned, 10);
      return num.toLocaleString("vi-VN");
    };

    // Đồng bộ hóa hiển thị khi giá trị value từ React Hook Form thay đổi
    useEffect(() => {
      setDisplayValue(formatNumber(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawVal = e.target.value;
      // Loại bỏ mọi ký tự không phải số
      const cleaned = rawVal.replace(/\D/g, "");

      // Định dạng hiển thị dấu chấm ngăn cách hàng nghìn
      const formatted = formatNumber(cleaned);
      setDisplayValue(formatted);

      if (onChange) {
        const numericValue = cleaned ? parseInt(cleaned, 10) : null;
        // Mock event object để tương thích ngược với react-hook-form
        onChange({
          ...e,
          target: {
            ...e.target,
            name: props.name || "",
            value: numericValue,
          },
        } as any);
      }
    };

    return (
      <CommonTextField
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

CommonNumberField.displayName = "CommonNumberField";
