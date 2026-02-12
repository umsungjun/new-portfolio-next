"use client";

import { useEffect, useRef, useState } from "react";

import {
  THEMES,
  THEME_LIGHT,
  THEME_SWATCHES,
  ThemeName,
  useThemeStore,
} from "@/store/useThemeStore";

import { SwatchIcon } from "@heroicons/react/24/solid";

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);

    /* URL 파라미터 업데이트 */
    const url = new URL(window.location.href);
    if (newTheme === THEME_LIGHT) {
      url.searchParams.delete("theme");
    } else {
      url.searchParams.set("theme", newTheme);
    }
    window.history.replaceState({}, "", url.toString());

    setIsOpen(false);
  };

  return (
    <div className="absolute left-3" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 cursor-pointer"
        style={{ color: "var(--color-text-muted)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-hover-bg)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
        aria-label="Theme toggle"
      >
        <SwatchIcon className="size-5" />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-10 z-50 flex gap-2 p-2.5 rounded-xl shadow-lg border border-solid"
          style={{
            backgroundColor: "var(--color-bg-primary)",
            borderColor: "var(--color-border-primary)",
          }}
        >
          {THEMES.map((t) => (
            <button
              key={t}
              onClick={() => handleThemeChange(t)}
              className="w-7 h-7 rounded-full cursor-pointer transition-all duration-150 shrink-0 border"
              style={{
                backgroundColor: THEME_SWATCHES[t],
                borderColor: "var(--color-border-primary)",
                boxShadow:
                  theme === t
                    ? `0 0 0 2px var(--color-bg-primary), 0 0 0 4px ${THEME_SWATCHES[t]}`
                    : "none",
              }}
              aria-label={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}
