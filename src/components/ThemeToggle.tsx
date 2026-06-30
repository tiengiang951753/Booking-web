"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800/40 animate-pulse border border-zinc-200/50 dark:border-zinc-800/40" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 shadow-sm active:scale-90 flex items-center justify-center cursor-pointer"
      title={
        isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"
      }
      aria-label="Toggle theme"
    >
      {isDark ? (
        <WbSunnyIcon
          className="w-5 h-5 text-amber-500 "
          sx={{ fontSize: 18 }}
        />
      ) : (
        <NightsStayIcon
          className="w-5 h-5 text-indigo-500"
          sx={{ fontSize: 18 }}
        />
      )}
    </button>
  );
}
