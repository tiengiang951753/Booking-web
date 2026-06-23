import * as z from "zod";

export const registerSchema = z
  .object({
    role: z.enum(["user", "owner"]),
    fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
    email: z
      .string()
      .min(1, "Vui lòng nhập email")
      .email("Email không đúng định dạng"),
    phone: z
      .string()
      .min(1, "Vui lòng nhập số điện thoại")
      .regex(/^[0-9]{9,10}$/, "Số điện thoại phải có 9 hoặc 10 chữ số"),
    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    // Các trường tùy chọn hoặc bắt buộc có điều kiện cho chủ sân
    businessName: z.string().optional(),
    businessAddress: z.string().optional(),
    sportType: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với Điều khoản sử dụng và Chính sách bảo mật",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "owner") {
        return !!data.businessName && data.businessName.trim().length > 0;
      }
      return true;
    },
    {
      message: "Vui lòng nhập tên cơ sở / câu lạc bộ",
      path: ["businessName"],
    },
  )
  .refine(
    (data) => {
      if (data.role === "owner") {
        return !!data.businessAddress && data.businessAddress.trim().length > 0;
      }
      return true;
    },
    {
      message: "Vui lòng nhập địa chỉ cơ sở sân",
      path: ["businessAddress"],
    },
  );

export type RegisterInput = z.infer<typeof registerSchema>;
