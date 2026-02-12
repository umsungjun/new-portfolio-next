"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { Link } from "@/i18n/routing";
import { LOCALE_EN, LOCALE_KO } from "@/lib/client/constants";
import {
  THEME_LIGHT,
  useThemeStore,
} from "@/store/useThemeStore";

import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/solid";

import ThemeToggle from "@/components/themeToggle";

export default function ChatHeader() {
  const { locale } = useParams();
  const t = useTranslations();
  const { theme } = useThemeStore();

  const showBubbleGuide = locale === LOCALE_KO;

  /* 언어 전환 시 현재 테마 파라미터 보존 */
  const langHref =
    theme === THEME_LIGHT ? "/home" : `/home?theme=${theme}`;

  return (
    <header
      className="sticky top-0 z-10 w-full h-14 backdrop-blur-md border-b flex items-center justify-center text-[15px] font-semibold tracking-tight"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-bg-header), transparent 20%)",
        borderColor: "var(--color-border-subtle)",
        color: "var(--color-text-primary)",
      }}
    >
      <ThemeToggle />
      {t("portfolioTitle")}
      {/* 언어 변경 */}
      <Link
        href={langHref}
        locale={locale === LOCALE_KO ? LOCALE_EN : LOCALE_KO}
        className="absolute right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
        style={{ color: "var(--color-text-secondary)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-hover-bg)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="w-5 h-5"
          viewBox="0 0 16 16"
        >
          <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z" />
          <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31" />
        </svg>
        <span>{locale === LOCALE_KO ? "A" : "한"}</span>
      </Link>
      {showBubbleGuide && (
        <div className="bubbleGuide">
          <GlobeAsiaAustraliaIcon
            className="size-4"
            style={{ color: "var(--color-text-muted)" }}
          />
          We offer English translation services.
        </div>
      )}
    </header>
  );
}
