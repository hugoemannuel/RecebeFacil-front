"use client";

import { useTheme } from "../../../context/ThemeContext";
import { IconSun, IconMoon } from "@/components/ui/Icons";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-white dark:bg-surface-dark border border-zinc-100 dark:border-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm"
      aria-label="Alternar tema"
    >
      {theme === 'light' ? (
        <IconMoon className="w-5 h-5" />
      ) : (
        <IconSun className="w-5 h-5" />
      )}
    </button>
  );
}
