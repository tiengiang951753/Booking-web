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
      <label className="text-xs font-bold text-zinc-650 dark:text-zinc-350 uppercase tracking-wider block">
        ⚙️ Cấu hình tên từng sân con
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Sân nhỏ #{index + 1}
            </label>
            <input
              type="text"
              {...register(`subCourts.${index}.name` as const)}
              // placeholder={`Sân số ${index + 1}`}
              className="w-full text-xs p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
            />
            {errors.subCourts?.[index]?.name && (
              <p className="text-red-500 text-[10px] font-bold mt-0.5">
                ⚠️ {errors.subCourts[index].name?.message}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
