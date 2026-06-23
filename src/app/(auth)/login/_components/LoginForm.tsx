"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import { loginSchema, LoginInput } from "./login-schema";
import {
  TextField,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface LoginFormProps {
  role: "user" | "owner";
}

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.75rem",
    backgroundColor: "var(--input-bg)",
    "& fieldset": {
      borderColor: "var(--input-border)",
      transition: "border-color 0.2s ease",
    },
    "&:hover fieldset": {
      borderColor: "var(--input-border-focus)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--input-border-focus)",
      borderWidth: "1px",
    },
  },
  "& .MuiOutlinedInput-input": {
    fontSize: "0.875rem",
    padding: "14px 16px",
    color: "var(--foreground)",
    "&::placeholder": {
      color: "#a1a1aa", // zinc-400
      opacity: 1,
    },
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.75rem",
    fontWeight: 600,
    marginLeft: 0,
    marginTop: "0.375rem",
  },
};

export default function LoginForm({ role }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      // Đăng nhập thành công, điều hướng user về trang phù hợp
      router.push(role === "owner" ? "/bookings" : "/");
    } catch (err: any) {
      console.error("Firebase Login Error:", err);
      switch (err.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setErrorMsg("Email hoặc mật khẩu không chính xác.");
          break;
        case "auth/invalid-email":
          setErrorMsg("Địa chỉ email không hợp lệ.");
          break;
        case "auth/user-disabled":
          setErrorMsg("Tài khoản này đã bị khóa.");
          break;
        case "auth/too-many-requests":
          setErrorMsg("Quá nhiều yêu cầu thất bại. Vui lòng thử lại sau.");
          break;
        default:
          setErrorMsg("Lỗi hệ thống khi đăng nhập. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Input Email */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          {role === "user" ? "Email đăng nhập" : "Email doanh nghiệp"}
        </label>
        <TextField
          type="text"
          placeholder={
            role === "user" ? "user@example.com" : "business@sporthub.vn"
          }
          variant="outlined"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register("email")}
          sx={textFieldStyles}
        />
      </div>

      {/* Input Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Mật khẩu
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-primary hover:text-primary-hover dark:text-highlight dark:hover:text-teal-400 transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <TextField
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          variant="outlined"
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{
                      color: "#71717a",
                      ".dark &": {
                        color: "#a1a1aa",
                      },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={textFieldStyles}
        />
      </div>

      {/* Remember Me checkbox */}
      <div className="flex items-center justify-between select-none">
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              sx={{
                color: "#d4d4d8", // zinc-300
                "&.Mui-checked": {
                  color: "var(--primary)",
                },
                ".dark &": {
                  color: "#27272a", // zinc-800
                  "&.Mui-checked": {
                    color: "var(--primary)",
                  },
                },
              }}
            />
          }
          label="Ghi nhớ đăng nhập"
          sx={{
            "& .MuiFormControlLabel-label": {
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "#71717a", // zinc-500
              ".dark &": {
                color: "#a1a1aa", // zinc-400
              },
            },
          }}
        />
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
        className="w-full py-4 rounded-xl font-extrabold text-sm tracking-wide text-button-text bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Đang đăng nhập...</span>
          </>
        ) : (
          <span>Đăng nhập</span>
        )}
      </button>

      {/* Go to Register */}
      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-2">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-extrabold text-primary hover:text-primary-hover dark:text-highlight dark:hover:text-teal-400 transition-colors"
        >
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
}
