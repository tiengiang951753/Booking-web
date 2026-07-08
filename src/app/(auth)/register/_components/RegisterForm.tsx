"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/services/firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { registerSchema, RegisterInput } from "./register-schema";
import { CommonTextField, CommonSelect } from "@/components/common";

interface RegisterFormProps {
  role: "user" | "owner";
}

export default function RegisterForm({ role }: RegisterFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "user",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      businessName: "",
      businessAddress: "",
      sportType: "badminton",
      acceptTerms: false,
    },
  });

  // Đồng bộ hóa trạng thái role từ prop bên ngoài vào react-hook-form
  useEffect(() => {
    setValue("role", role, { shouldValidate: true });
  }, [role, setValue]);

  const onSubmit = async (data: RegisterInput) => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      // 1. Tạo user bằng Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // 2. Cập nhật profile (Họ tên)
      await updateProfile(userCredential.user, {
        displayName: data.fullName,
      });

      // 3. Lưu thông tin bổ sung vào Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        role: data.role,
        createdAt: new Date().toISOString(),
        ...(data.role === "owner" && {
          businessName: data.businessName,
          businessAddress: data.businessAddress,
          sportType: data.sportType,
        }),
      });

      // 4. Nếu là chủ sân, tự động khởi tạo 1 sân trống ban đầu
      if (data.role === "owner") {
        await addDoc(collection(db, "courts"), {
          name: data.businessName || "Sân thể thao mới",
          sportType: data.sportType || "badminton",
          address: data.businessAddress || "",
          priceMin: 50000,
          priceMax: 100000,
          openingTime: "06:00",
          closingTime: "22:00",
          subCourtsCount: 1,
          subCourts: [{ name: "Sân số 1" }],
          description: "Chưa có mô tả chi tiết.",
          imageUrl: "",
          ownerId: userCredential.user.uid,
          ownerName: data.fullName,
          active: false,
          featured: false,
          createdAt: new Date().toISOString(),
        });
      }

      console.log("Đăng ký thành công!", {
        uid: userCredential.user.uid,
        role: data.role,
        fullName: data.fullName,
        phone: data.phone,
        ...(data.role === "owner" && {
          businessName: data.businessName,
          businessAddress: data.businessAddress,
          sportType: data.sportType,
        }),
      });

      toast.success(`Đăng ký thành công tài khoản: ${data.role === "user" ? "Khách hàng" : "Chủ sân"}`);
      
      // Chuyển hướng người dùng về trang chủ
      router.push("/");
    } catch (err: any) {
      console.error("Firebase Register Error:", err);
      switch (err.code) {
        case "auth/email-already-in-use":
          setErrorMsg("Email này đã được sử dụng bởi một tài khoản khác.");
          break;
        case "auth/invalid-email":
          setErrorMsg("Địa chỉ email không hợp lệ.");
          break;
        case "auth/weak-password":
          setErrorMsg("Mật khẩu quá yếu (phải chứa ít nhất 6 ký tự).");
          break;
        default:
          setErrorMsg("Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      {/* Input Full Name */}
      <CommonTextField
        size="small"
        label={role === "user" ? "Họ và tên khách hàng" : "Họ và tên chủ cơ sở"}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
        {...register("fullName")}
        placeholder={role === "user" ? "Nguyễn Văn A" : "Phạm Hoàng B"}
      />

      {/* Dynamic Fields for Owner Role */}
      {role === "owner" && (
        <>
          {/* Business Name */}
          <CommonTextField
            size="small"
            label="Tên cơ sở / Câu lạc bộ"
            error={!!errors.businessName}
            helperText={errors.businessName?.message}
            {...register("businessName")}
            placeholder="Ví dụ: Câu Lạc Bộ Cầu Lông Him Lam"
          />

          {/* Sport Type Select */}
          <Controller
            name="sportType"
            control={control}
            render={({ field }) => (
              <CommonSelect
                size="small"
                label="Môn thể thao hoạt động chính"
                error={!!errors.sportType}
                helperText={errors.sportType?.message}
                {...field}
                options={[
                  { value: "badminton", label: "Cầu lông (🏸)" },
                  { value: "pickleball", label: "Pickleball (🏓)" },
                  { value: "tennis", label: "Tennis (🎾)" },
                  { value: "football", label: "Bóng đá (⚽)" },
                  { value: "basketball", label: "Bóng rổ (🏀)" },
                ]}
              />
            )}
          />

          {/* Business Address */}
          <CommonTextField
            size="small"
            label="Địa chỉ cơ sở sân"
            error={!!errors.businessAddress}
            helperText={errors.businessAddress?.message}
            {...register("businessAddress")}
            placeholder="Số, tên đường, quận, thành phố..."
          />
        </>
      )}

      {/* Common Contact Fields (Email & Phone) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <CommonTextField
          size="small"
          type="email"
          label="Email"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
          placeholder="partner@sporthub.vn"
        />
        <CommonTextField
          size="small"
          type="tel"
          label="Số điện thoại"
          error={!!errors.phone}
          helperText={errors.phone?.message}
          {...register("phone")}
          placeholder="09..."
        />
      </div>

      {/* Passwords Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <CommonTextField
          size="small"
          type="password"
          label="Mật khẩu"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
          placeholder="••••••••"
        />
        <CommonTextField
          size="small"
          type="password"
          label="Xác nhận lại"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          {...register("confirmPassword")}
          placeholder="••••••••"
        />
      </div>

      {/* Checkbox Accept terms */}
      <div className="flex flex-col pt-2">
        <div className="flex items-start text-xs font-medium text-zinc-500 dark:text-zinc-400 select-none">
          <label className="flex gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register("acceptTerms")}
              className="w-4.5 h-4.5 rounded border-zinc-300 text-primary focus:ring-primary dark:bg-zinc-900 dark:border-zinc-800 mt-0.5"
            />
            <span>
              Tôi hoàn toàn đồng ý với các{" "}
              <Link href="/terms" className="text-primary dark:text-highlight font-bold hover:underline">
                Điều khoản sử dụng
              </Link>{" "}
              và{" "}
              <Link href="/privacy" className="text-primary dark:text-highlight font-bold hover:underline">
                Chính sách bảo mật
              </Link>{" "}
              của SportHub.
            </span>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-red-500 text-[10px] mt-1.5 font-bold">{errors.acceptTerms.message}</p>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 mt-3 rounded-xl font-extrabold text-xs tracking-wider text-button-text bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Đang đăng ký tài khoản...</span>
          </>
        ) : (
          <span>Đăng ký</span>
        )}
      </button>
    </form>
  );
}
