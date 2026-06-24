"use client";

import { useState } from "react";
import Link from "next/link";
import AuthBanner from "@/components/AuthBanner";
import LoginForm from "./_components/LoginForm";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

export default function LoginPage() {
  const [role, setRole] = useState<"user" | "owner">("user");

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      {/* LEFT COLUMN: VISUAL BRANDING BANNER */}
      <AuthBanner
        badge="🏸 Đồng hành cùng đam mê thể thao"
        title={
          <>
            Nền tảng đặt sân <br />& quản lý tối ưu nhất
          </>
        }
        subtitle="Giữ chỗ sân chỉ trong 30 giây, kết nối người chơi dễ dàng và cung cấp giải pháp vận hành sân chuyên nghiệp cho các doanh nghiệp."
      >
        {/* Quick stats cards */}
        <div className="grid grid-cols-2 gap-4 pt-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <p className="text-2xl font-black text-white">500+</p>
            <p className="text-xs text-emerald-250 font-medium">
              Sân liên kết rộng khắp
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <p className="text-2xl font-black text-white">50k+</p>
            <p className="text-xs text-emerald-250 font-medium">
              Lượt đặt sân mỗi tháng
            </p>
          </div>
        </div>
      </AuthBanner>

      {/* RIGHT COLUMN: INTERACTIVE FORM CONTAINER */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
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
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-highlight">
              Đăng nhập
            </h1>
            {/* <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
              Đăng nhập để quản lý lịch đặt sân và khám phá ưu đãi mới
            </p> */}
          </div>

          {/* Interactive Role Tabs */}
          {/* <ToggleButtonGroup
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
          </ToggleButtonGroup> */}

          {/* Login Form */}
          <LoginForm role={role} />

          {/* Dynamic Content Area (keeps height stable to prevent layout shifting) */}
          <div className="min-h-[160px] flex flex-col justify-center">
            {/* Social Logins (Only visible for client role) */}
            {role === "user" && (
              <div className="space-y-4">
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
                  <span className="px-3 text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-bold">
                    Hoặc đăng nhập bằng
                  </span>
                  <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <button className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-xs font-bold text-white transition-all duration-200 shadow-sm border border-transparent">
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            )}

            {/* Owner info section on tab transition */}
            {role === "owner" && (
              <div className="p-4 bg-primary/5 border border-primary/20 dark:border-primary/10 rounded-2xl text-xs leading-relaxed space-y-1.5 text-zinc-650 dark:text-zinc-350">
                <p className="font-bold text-primary dark:text-highlight">
                  ⚡ Quản lý sân thể thao dễ dàng:
                </p>
                <p>• Theo dõi lịch đặt sân trực tiếp theo thời gian thực.</p>
                <p>• Thống kê doanh thu chi tiết theo ngày, tuần, tháng.</p>
                <p>• Tiếp cận hàng ngàn khách hàng chơi thể thao tiềm năng.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
