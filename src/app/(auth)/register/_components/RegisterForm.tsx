"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { registerSchema, RegisterInput } from "./register-schema";

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

      alert(`Đăng ký thành công tài khoản: ${data.role === "user" ? "Khách hàng" : "Chủ sân"}`);
      
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
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          {role === "user" ? "Họ và tên khách hàng" : "Họ và tên chủ cơ sở"}
        </label>
        <input
          type="text"
          {...register("fullName")}
          placeholder={role === "user" ? "Nguyễn Văn A" : "Phạm Hoàng B"}
          className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
        />
        {errors.fullName && (
          <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.fullName.message}</p>
        )}
      </div>

      {/* Dynamic Fields for Owner Role */}
      {role === "owner" && (
        <>
          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Tên cơ sở / Câu lạc bộ
            </label>
            <input
              type="text"
              {...register("businessName")}
              placeholder="Ví dụ: Câu Lạc Bộ Cầu Lông Him Lam"
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
            />
            {errors.businessName && (
              <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.businessName.message}</p>
            )}
          </div>

          {/* Sport Type Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Môn thể thao hoạt động chính
            </label>
            <select
              {...register("sportType")}
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
            >
              <option value="badminton">Cầu lông (🏸)</option>
              <option value="pickleball">Pickleball (🏓)</option>
              <option value="tennis">Tennis (🎾)</option>
              <option value="football">Bóng đá (⚽)</option>
              <option value="basketball">Bóng rổ (🏀)</option>
            </select>
            {errors.sportType && (
              <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.sportType.message}</p>
            )}
          </div>

          {/* Business Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Địa chỉ cơ sở sân
            </label>
            <input
              type="text"
              {...register("businessAddress")}
              placeholder="Số, tên đường, quận, thành phố..."
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
            />
            {errors.businessAddress && (
              <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.businessAddress.message}</p>
            )}
          </div>
        </>
      )}

      {/* Common Contact Fields (Email & Phone) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="partner@sporthub.vn"
            className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
          />
          {errors.email && (
            <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Số điện thoại
          </label>
          <input
            type="tel"
            {...register("phone")}
            placeholder="09..."
            className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
          />
          {errors.phone && (
            <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Passwords Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Mật khẩu
          </label>
          <input
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
          />
          {errors.password && (
            <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Xác nhận lại
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="••••••••"
            className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.confirmPassword.message}</p>
          )}
        </div>
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
