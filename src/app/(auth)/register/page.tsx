"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/services/firebase";
import AuthBanner from "@/components/AuthBanner";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"user" | "owner">("user");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Common and dynamic fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Owner specific fields
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [sportType, setSportType] = useState("badminton");

  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (!acceptTerms) {
      setErrorMsg("Bạn phải đồng ý với Điều khoản và Chính sách của SportHub!");
      return;
    }
    
    setIsLoading(true);
    try {
      // 1. Tạo user bằng Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Cập nhật profile (Họ tên)
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      console.log("Đăng ký thành công!", {
        uid: userCredential.user.uid,
        role,
        fullName,
        phone,
        ...(role === "owner" && { businessName, businessAddress, sportType })
      });

      alert(`Đăng ký thành công tài khoản: ${role === "user" ? "Khách hàng" : "Chủ sân"}`);
      
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
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      
      {/* LEFT COLUMN: VISUAL BRANDING BANNER */}
      <AuthBanner
        badge="🏸 Đăng ký đối tác - Nhận ngàn ưu đãi"
        title={<>Gia nhập cộng đồng <br />thể thao lớn nhất</>}
        subtitle="Chỉ với vài thao tác đơn giản, đăng ký thành viên để bắt đầu hành trình nâng tầm sức khỏe và trải nghiệm công nghệ đặt sân tiện lợi nhất."
      >
        {/* Quick highlights list */}
        <div className="space-y-3.5 pt-4 text-sm text-emerald-100/90 font-light">
          <div className="flex items-center gap-3">
            <span className="text-highlight">✓</span>
            <span>Đặt sân siêu nhanh, giữ chỗ tức thì</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-highlight">✓</span>
            <span>Tích điểm đổi quà, ưu đãi giờ vàng hấp dẫn</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-highlight">✓</span>
            <span>Hỗ trợ quản lý chuyên nghiệp cho chủ sân</span>
          </div>
        </div>
      </AuthBanner>

      {/* RIGHT COLUMN: INTERACTIVE FORM CONTAINER */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-7">
          
          {/* Mobile brand header (Visible only on mobile/tablet) */}
          <div className="lg:hidden text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-3xl font-black bg-gradient-to-r from-primary to-highlight bg-clip-text text-transparent tracking-tight">
                SportHub
              </span>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary dark:text-highlight font-extrabold text-xs tracking-wider uppercase">
                Pro
              </span>
            </Link>
          </div>

          {/* Titles */}
          <div className="text-center lg:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Tạo tài khoản mới
            </h1>
            <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
              Khám phá và kết nối hệ thống sân thể thao đẳng cấp nhất
            </p>
          </div>

          {/* Interactive Role Tabs */}
          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={(e, newRole) => newRole && setRole(newRole)}
            fullWidth
            sx={{
              backgroundColor: "var(--input-bg)",
              p: "4px",
              borderRadius: "1rem",
              border: "1px solid",
              borderColor: "var(--input-border)",
              "& .MuiToggleButtonGroup-grouped": {
                border: 0,
                "&.Mui-disabled": {
                  border: 0,
                },
              },
            }}
          >
            <ToggleButton
              value="user"
              sx={{
                borderRadius: "0.75rem !important",
                py: 1.5,
                fontSize: "0.75rem",
                fontWeight: "bold",
                textTransform: "none",
                color: "var(--text-muted)",
                backgroundColor: "transparent !important",
                "&.Mui-selected": {
                  backgroundColor: "var(--primary) !important",
                  color: "white !important",
                  border: "1px solid var(--primary)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  "&:hover": {
                    backgroundColor: "var(--primary-hover) !important",
                  },
                },
              }}
            >
              🏸 Khách hàng
            </ToggleButton>
            <ToggleButton
              value="owner"
              sx={{
                borderRadius: "0.75rem !important",
                py: 1.5,
                fontSize: "0.75rem",
                fontWeight: "bold",
                textTransform: "none",
                color: "var(--text-muted)",
                backgroundColor: "transparent !important",
                "&.Mui-selected": {
                  backgroundColor: "var(--primary) !important",
                  color: "white !important",
                  border: "1px solid var(--primary)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  "&:hover": {
                    backgroundColor: "var(--primary-hover) !important",
                  },
                },
              }}
            >
              🏢 Chủ sân / Đối tác
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {role === "user" ? "Họ và tên khách hàng" : "Họ và tên chủ cơ sở"}
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === "user" ? "Nguyễn Văn A" : "Phạm Hoàng B"}
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
              />
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
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ví dụ: Câu Lạc Bộ Cầu Lông Him Lam"
                    className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
                  />
                </div>

                {/* Sport Type Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Môn thể thao hoạt động chính
                  </label>
                  <select
                    value={sportType}
                    onChange={(e) => setSportType(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
                  >
                    <option value="badminton">Cầu lông (🏸)</option>
                    <option value="pickleball">Pickleball (🏓)</option>
                    <option value="tennis">Tennis (🎾)</option>
                    <option value="football">Bóng đá (⚽)</option>
                    <option value="basketball">Bóng rổ (🏀)</option>
                  </select>
                </div>

                {/* Business Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Địa chỉ cơ sở sân
                  </label>
                  <input
                    type="text"
                    required
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="Số, tên đường, quận, thành phố..."
                    className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
                  />
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@sporthub.vn"
                  className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09..."
                  className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
                />
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Xác nhận lại
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Checkbox Accept terms */}
            <div className="flex items-start text-xs font-medium text-zinc-500 dark:text-zinc-400 select-none pt-2">
              <label className="flex gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
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

          {/* Go to Login */}
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
            Đã có tài khoản?{" "}
            <Link
              href="/login"
              className="font-extrabold text-primary hover:text-primary-hover dark:text-highlight dark:hover:text-teal-400 transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
