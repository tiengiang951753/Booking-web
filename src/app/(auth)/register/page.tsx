"use client";

import { useState } from "react";
import Link from "next/link";
import AuthBanner from "@/components/AuthBanner";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import RegisterForm from "./_components/RegisterForm";
import ThemeToggle from "@/components/ThemeToggle";

export default function RegisterPage() {
  const [role, setRole] = useState<"user" | "owner">("user");

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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
        {/* Floating Theme Toggle */}
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
          <ThemeToggle />
        </div>

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

          {/* Register Form Component */}
          <RegisterForm role={role} />

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
