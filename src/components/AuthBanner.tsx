import React from "react";
import Link from "next/link";

interface AuthBannerProps {
  badge: string;
  title: React.ReactNode;
  subtitle: string;
  children?: React.ReactNode;
}

export default function AuthBanner({
  badge,
  title,
  subtitle,
  children,
}: AuthBannerProps) {
  return (
    <div className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen bg-gradient-to-br from-primary to-secondary p-16 flex-col justify-between overflow-hidden">
      {/* Decorative background glow circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-highlight/25 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl" />

      {/* Brand logo */}
      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl font-black text-white tracking-tight">
            SportHub
          </span>
          <span className="px-2 py-0.5 rounded bg-white/10 backdrop-blur-md text-highlight font-extrabold text-xs tracking-wider uppercase border border-white/10">
            Pro
          </span>
        </Link>
      </div>

      {/* Captions and illustrations */}
      <div className="relative z-10 max-w-md my-auto space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-highlight font-bold text-xs uppercase tracking-wider border border-white/10">
          {badge}
        </span>

        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
          {title}
        </h2>

        <p className="text-emerald-100/85 text-base font-light leading-relaxed">
          {subtitle}
        </p>

        {/* Dynamic bottom section (Stats or checklist) */}
        {children}
      </div>

      {/* Footer info */}
      <div className="relative z-10 text-xs text-emerald-200/60 font-light">
        © {new Date().getFullYear()} SportHub Pro. Đã đăng ký bản quyền.
      </div>
    </div>
  );
}
