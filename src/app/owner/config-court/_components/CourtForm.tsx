"use client";

import { useState, useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { CourtInput } from "./court-schema";
import SubCourtsConfig from "./SubCourtsConfig";

interface CourtFormProps {
  form: UseFormReturn<CourtInput>;
  onSubmit: (data: CourtInput, imageFile: File | null) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
  submitText: string;
}

export default function CourtForm({
  form,
  onSubmit,
  isSubmitting,
  onCancel,
  submitText,
}: CourtFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const imageUrlValue = watch("imageUrl");

  // Đồng bộ ảnh xem trước khi dữ liệu thay đổi (ví dụ: khi load thông tin sân cũ)
  useEffect(() => {
    if (imageUrlValue) {
      setImagePreview(imageUrlValue);
    } else {
      setImagePreview(null);
    }
  }, [imageUrlValue]);

  // Xử lý khi chọn file ảnh mới
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Giới hạn kích thước file (ví dụ: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Dung lượng file quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.");
      return;
    }

    // Lưu file vào state để tải lên khi submit
    setImageFile(file);

    // Hiển thị preview cục bộ tạm thời
    const localPreviewUrl = URL.createObjectURL(file);
    setImagePreview(localPreviewUrl);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFormSubmit = async (data: CourtInput) => {
    await onSubmit(data, imageFile);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Tên Sân */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Tên sân thể thao / Cơ sở
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="Ví dụ: Sân Cầu Lông Him Lam - Sân Số 1"
          className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
        />
        {errors.name && (
          <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.name.message}</p>
        )}
      </div>

      {/* Môn thể thao & Số lượng sân nhỏ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Môn thể thao áp dụng
          </label>
          <select
            {...register("sportType")}
            className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
          >
            <option value="badminton">Cầu lông (🏸)</option>
            <option value="pickleball">Pickleball (🏓)</option>
            <option value="tennis">Tennis (🎾)</option>
            <option value="football">Bóng đá (⚽)</option>
            <option value="basketball">Bóng rổ (🏀)</option>
          </select>
          {errors.sportType && (
            <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.sportType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Số lượng sân nhỏ thành viên
          </label>
          <input
            type="number"
            {...register("subCourtsCount", { valueAsNumber: true })}
            placeholder="Ví dụ: 6"
            className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
          />
          {errors.subCourtsCount && (
            <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.subCourtsCount.message}</p>
          )}
        </div>
      </div>

      {/* Danh sách tên các sân con */}
      <SubCourtsConfig
        control={control}
        register={register}
        errors={errors}
        setValue={setValue}
      />

      {/* Địa chỉ cụ thể */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Địa chỉ chi tiết cơ sở sân
        </label>
        <input
          type="text"
          {...register("address")}
          placeholder="Số 123, Đường Nguyễn Thị Thập, Quận 7, TP.HCM"
          className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
        />
        {errors.address && (
          <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.address.message}</p>
        )}
      </div>

      {/* Giá tiền thuê và Giờ hoạt động */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Giá thuê (đ/giờ)
          </label>
          <input
            type="number"
            {...register("pricePerHour", { valueAsNumber: true })}
            placeholder="50000"
            className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
          />
          {errors.pricePerHour && (
            <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.pricePerHour.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Giờ mở cửa
          </label>
          <input
            type="time"
            {...register("openingTime")}
            className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
          />
          {errors.openingTime && (
            <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.openingTime.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Giờ đóng cửa
          </label>
          <input
            type="time"
            {...register("closingTime")}
            className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
          />
          {errors.closingTime && (
            <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.closingTime.message}</p>
          )}
        </div>
      </div>

      {/* Tải hình ảnh file đại diện */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Hình ảnh đại diện của sân thể thao
        </label>
        
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
          className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
            imagePreview
              ? "border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-955/20 h-56"
              : "border-zinc-300 dark:border-zinc-700 bg-zinc-50/40 dark:bg-zinc-900/5 hover:border-primary hover:bg-zinc-50/80 dark:hover:bg-zinc-900/20 h-40"
          }`}
        >
          {imagePreview ? (
            <>
              {/* Image Preview */}
              <img
                src={imagePreview}
                alt="Sân thể thao preview"
                className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-90"
              />
              {/* Glass overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white rounded-2xl backdrop-blur-[2px]">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-extrabold tracking-wider uppercase">Thay đổi hình ảnh</span>
              </div>
            </>
          ) : (
            <>
              {/* No image view */}
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-400 dark:text-zinc-500">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300">
                  Nhấp để chọn file ảnh đại diện
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  Hỗ trợ định dạng JPG, PNG, WEBP (Tối đa 5MB)
                </p>
              </div>
            </>
          )}
          {/* Uploading Overlay */}
          {isSubmitting && imageFile && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-2 text-white z-10">
              <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-[10px] font-bold tracking-wider uppercase animate-pulse">Đang tải ảnh lên...</span>
            </div>
          )}
        </div>
        {errors.imageUrl && (
          <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.imageUrl.message}</p>
        )}
      </div>

      {/* Mô tả chi tiết */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Mô tả chi tiết về sân thể thao
        </label>
        <textarea
          rows={3}
          {...register("description")}
          placeholder="Giới thiệu về dịch vụ tiện ích đi kèm (ví dụ: nước uống miễn phí, bãi xe rộng, dịch vụ cho thuê vợt...)"
          className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100 resize-none"
        />
        {errors.description && (
          <p className="text-red-500 text-xs font-bold mt-1">⚠️ {errors.description.message}</p>
        )}
      </div>

      {/* Trạng thái kích hoạt hiển thị */}
      <div className="p-4.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/[0.3] dark:bg-zinc-900/10 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
            🌐 Kích hoạt hiển thị sân
          </label>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Khi bật, khách hàng có thể tìm thấy và đặt lịch sân này trên trang chủ.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            {...register("active")}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-focus:ring-1 peer-focus:ring-primary dark:peer-focus:ring-primary/50 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      {/* Submit & Cancel Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 transition-colors cursor-pointer"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl font-extrabold text-xs tracking-wider text-button-text bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Đang lưu...</span>
            </>
          ) : (
            <span>{submitText}</span>
          )}
        </button>
      </div>
    </form>
  );
}
