"use client";

import { useState } from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { CourtInput } from "./court-schema";
import SubCourtsConfig from "./SubCourtsConfig";
import {
  CommonTextField,
  CommonSelect,
  CommonDatePicker,
  CommonSwitch,
  CommonButton,
  CommonImageInput,
  CommonNumberField,
} from "@/components/common";

const sportOptions = [
  { value: "badminton", label: "Cầu lông (🏸)" },
  { value: "pickleball", label: "Pickleball (🏓)" },
  { value: "tennis", label: "Tennis (🎾)" },
  { value: "football", label: "Bóng đá (⚽)" },
  { value: "basketball", label: "Bóng rổ (🏀)" },
];

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
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const imageUrlValue = watch("imageUrl");

  const handleFormSubmit = async (data: CourtInput) => {
    await onSubmit(data, imageFile);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Tên Sân */}
      <CommonTextField
        label="Tên sân thể thao / Cơ sở"
        fullWidth
        error={!!errors.name}
        helperText={errors.name ? `⚠️ ${errors.name.message}` : ""}
        {...register("name")}
        placeholder="Ví dụ: Sân Cầu Lông Him Lam - Sân Số 1"
      />

      {/* Môn thể thao & Số lượng sân nhỏ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="sportType"
          control={control}
          render={({ field }) => (
            <CommonSelect
              label="Môn thể thao áp dụng"
              fullWidth
              error={!!errors.sportType}
              helperText={
                errors.sportType ? `⚠️ ${errors.sportType.message}` : ""
              }
              {...field}
              options={sportOptions}
            />
          )}
        />

        <CommonTextField
          label="Số lượng sân nhỏ thành viên"
          type="number"
          fullWidth
          error={!!errors.subCourtsCount}
          helperText={
            errors.subCourtsCount ? `⚠️ ${errors.subCourtsCount.message}` : ""
          }
          {...register("subCourtsCount", { valueAsNumber: true })}
          placeholder="Ví dụ: 6"
        />
      </div>

      {/* Danh sách tên các sân con */}
      <SubCourtsConfig
        control={control}
        register={register}
        errors={errors}
        setValue={setValue}
      />

      {/* Địa chỉ cụ thể */}
      <CommonTextField
        label="Địa chỉ chi tiết cơ sở sân"
        fullWidth
        error={!!errors.address}
        helperText={errors.address ? `⚠️ ${errors.address.message}` : ""}
        {...register("address")}
        placeholder="Số 123, Đường Nguyễn Thị Thập, Quận 7, TP.HCM"
      />

      {/* Giá tiền thuê và Giờ hoạt động */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Controller
          name="pricePerHour"
          control={control}
          render={({ field }) => (
            <CommonNumberField
              label="Giá thuê (VNĐ/giờ)"
              suffix="VNĐ"
              fullWidth
              error={!!errors.pricePerHour}
              helperText={
                errors.pricePerHour ? `⚠️ ${errors.pricePerHour.message}` : ""
              }
              {...field}
            />
          )}
        />

        <CommonTextField
          label="Giờ mở cửa"
          type="time"
          fullWidth
          error={!!errors.openingTime}
          helperText={
            errors.openingTime ? `⚠️ ${errors.openingTime.message}` : ""
          }
          {...register("openingTime")}
        />

        <CommonTextField
          label="Giờ đóng cửa"
          type="time"
          fullWidth
          error={!!errors.closingTime}
          helperText={
            errors.closingTime ? `⚠️ ${errors.closingTime.message}` : ""
          }
          {...register("closingTime")}
        />
      </div>

      {/* Tải hình ảnh file đại diện */}
      <CommonImageInput
        label="Hình ảnh đại diện của sân thể thao"
        value={imageUrlValue}
        onChange={setImageFile}
        error={!!errors.imageUrl}
        helperText={errors.imageUrl?.message}
        isSubmitting={isSubmitting}
      />

      {/* Mô tả chi tiết */}
      <CommonTextField
        label="Mô tả chi tiết về sân thể thao"
        multiline
        rows={3}
        fullWidth
        error={!!errors.description}
        helperText={
          errors.description ? `⚠️ ${errors.description.message}` : ""
        }
        {...register("description")}
        placeholder="Giới thiệu về dịch vụ tiện ích đi kèm (ví dụ: nước uống miễn phí, bãi xe rộng, dịch vụ cho thuê vợt...)"
      />

      {/* Trạng thái kích hoạt hiển thị */}
      <CommonSwitch
        label="🌐 Kích hoạt hiển thị sân"
        description="Khi bật, khách hàng có thể tìm thấy và đặt lịch sân này trên trang chủ."
        checked={!!watch("active")}
        {...register("active")}
      />

      {/* Submit & Cancel Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
        <CommonButton
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          text="Hủy bỏ"
        />
        <CommonButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          text={submitText}
        />
      </div>
    </form>
  );
}
