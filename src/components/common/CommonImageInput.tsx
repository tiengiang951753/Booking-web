"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export interface CommonImageInputProps {
  value?: string | null; // Đường dẫn ảnh ban đầu
  onChange?: (file: File | null) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  isSubmitting?: boolean;
  maxSizeMB?: number;
  heightClass?: string; // Tùy biến chiều cao container
}

export const CommonImageInput: React.FC<CommonImageInputProps> = ({
  value,
  onChange,
  label,
  error = false,
  helperText,
  isSubmitting = false,
  maxSizeMB = 5,
  heightClass,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Đồng bộ ảnh xem trước khi dữ liệu từ bên ngoài thay đổi
  useEffect(() => {
    if (value) {
      setImagePreview(value);
      setImageFile(null);
    } else {
      setImagePreview(null);
      setImageFile(null);
    }
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Giới hạn dung lượng file
    const limitBytes = maxSizeMB * 1024 * 1024;
    if (file.size > limitBytes) {
      toast.warning(`Dung lượng file quá lớn. Vui lòng chọn ảnh nhỏ hơn ${maxSizeMB}MB.`);
      return;
    }

    setImageFile(file);

    // Tạo preview cục bộ tạm thời
    const localPreviewUrl = URL.createObjectURL(file);
    setImagePreview(localPreviewUrl);

    if (onChange) {
      onChange(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const containerHeight = heightClass 
    ? heightClass 
    : imagePreview ? "h-56" : "h-40";

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
          {label}
        </label>
      )}

      {/* Input ẩn để chọn file */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Drag / Upload Container Zone */}
      <div
        onClick={triggerFileSelect}
        className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${containerHeight} ${
          imagePreview
            ? "border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/20"
            : "border-zinc-300 dark:border-zinc-700 bg-zinc-50/40 dark:bg-zinc-900/5 hover:border-primary hover:bg-zinc-50/80 dark:hover:bg-zinc-900/20"
        } ${error ? "border-red-500 hover:border-red-650" : ""}`}
      >
        {imagePreview ? (
          <>
            {/* Image Preview */}
            <img
              src={imagePreview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-contain rounded-2xl opacity-90"
            />
            {/* Glass overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white rounded-2xl backdrop-blur-[2px]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-extrabold tracking-wider uppercase">Thay đổi hình ảnh</span>
            </div>
          </>
        ) : (
          <>
            {/* No image view */}
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 dark:text-zinc-500">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300">
                Nhấp để chọn file ảnh đại diện
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                Hỗ trợ định dạng JPG, PNG, WEBP (Tối đa {maxSizeMB}MB)
              </p>
            </div>
          </>
        )}

        {/* Uploading Overlay */}
        {isSubmitting && imageFile && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-2 text-white z-10">
            <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-[10px] font-bold tracking-wider uppercase animate-pulse">Đang tải ảnh lên...</span>
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-red-500 text-xs font-bold mt-1">⚠️ {helperText}</p>
      )}
    </div>
  );
};
