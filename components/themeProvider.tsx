"use client";

import { useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { THEMES, ThemeName, useThemeStore } from "@/store/useThemeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const urlTheme = searchParams.get("theme") as ThemeName | null;

    if (urlTheme && THEMES.includes(urlTheme)) {
      setTheme(urlTheme);
      document.documentElement.setAttribute("data-theme", urlTheme);
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }

    /* 마운트 후 테마 전환 트랜지션 활성화 */
    requestAnimationFrame(() => {
      document.documentElement.classList.add("theme-transition");
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* 테마 변경 시 data-theme 동기화 */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}
