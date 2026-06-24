import * as z from "zod";

export const courtSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên sân"),
  sportType: z.string().min(1, "Vui lòng chọn môn thể thao"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ cụ thể"),
  pricePerHour: z
    .number()
    .min(1000, "Giá thuê tối thiểu là 1,000đ/giờ"),
  openingTime: z.string().min(1, "Vui lòng chọn giờ mở cửa"),
  closingTime: z.string().min(1, "Vui lòng chọn giờ đóng cửa"),
  subCourtsCount: z
    .number()
    .min(1, "Số lượng sân nhỏ tối thiểu là 1"),
  subCourts: z
    .array(
      z.object({
        name: z.string().min(1, "Tên sân nhỏ không được để trống"),
      })
    )
    .min(1, "Phải có ít nhất 1 sân nhỏ"),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .url("Vui lòng nhập định dạng URL hình ảnh hợp lệ")
    .or(z.string().length(0))
    .optional(),
  active: z.boolean().optional(),
});

export type CourtInput = z.infer<typeof courtSchema>;
