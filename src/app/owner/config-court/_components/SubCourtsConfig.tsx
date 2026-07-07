"use client";

import { useEffect } from "react";
import {
  Control,
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { CourtInput } from "./court-schema";
import { CommonTextField } from "@/components/common";

interface SubCourtsConfigProps {
  control: Control<CourtInput>;
  register: UseFormRegister<CourtInput>;
  errors: FieldErrors<CourtInput>;
  setValue: UseFormSetValue<CourtInput>;
}

export default function SubCourtsConfig({
  control,
  register,
  errors,
  setValue,
}: SubCourtsConfigProps) {
  const { fields, replace } = useFieldArray({
    control,
    name: "subCourts",
  });

  // Sử dụng useWatch để theo dõi các trường mà không kích hoạt rerender ở trang cha
  const subCourtsCount = useWatch({
    control,
    name: "subCourtsCount",
  });

  const currentSubCourts =
    useWatch({
      control,
      name: "subCourts",
    }) || [];

  // Đồng bộ hóa số lượng sân nhỏ với mảng subCourts
  useEffect(() => {
    const count = Math.max(1, Number(subCourtsCount) || 1);

    // Nếu giá trị nhập vào bé hơn 1, tự động gán lại thành 1
    if (Number(subCourtsCount) < 1) {
      setValue("subCourtsCount", 1);
    }

    const currentLength = currentSubCourts.length;

    if (count > currentLength) {
      const newFields = [];
      for (let i = currentLength; i < count; i++) {
        newFields.push({ name: `Sân số ${i + 1}` });
      }
      replace([...currentSubCourts, ...newFields]);
    } else if (count < currentLength) {
      replace(currentSubCourts.slice(0, count));
    }
  }, [subCourtsCount, setValue, replace]);

  if (fields.length === 0) return null;

  return (
    <div className="space-y-3.5 p-4 bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl">
      <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
        ⚙️ Cấu hình tên từng sân con
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {fields.map((field, index) => (
          <CommonTextField
            key={field.id}
            size="small"
            label={`Sân #${index + 1}`}
            error={!!errors.subCourts?.[index]?.name}
            helperText={
              errors.subCourts?.[index]?.name
                ? `⚠️ ${errors.subCourts[index].name?.message}`
                : ""
            }
            {...register(`subCourts.${index}.name` as const)}
          />
        ))}
      </div>
    </div>
  );
}
