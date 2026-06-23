"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  // Hide the header completely on auth pages (login, register)
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              SportHub
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs tracking-wider uppercase">
              Pro
            </span>
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-20 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-3.5">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Chào, <strong className="font-semibold text-zinc-900 dark:text-zinc-50">{user.displayName || user.email}</strong>
              </span>
              <button
                onClick={logout}
                className="text-sm font-semibold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850/50 text-zinc-700 dark:text-zinc-300 px-4.5 py-2 rounded-full transition-all"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-zinc-700 hover:text-emerald-500 dark:text-zinc-300 dark:hover:text-emerald-400 px-4 py-2 rounded-full transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-primary hover:bg-primary-hover text-button-text shadow-md shadow-primary/20 px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
