"use client";

import { useLocale, useTranslations } from "next-intl";

import ContactInfo from "@/components/contactInfo";
import ProfileSwiper from "@/components/profileSwiper";
import SocialLinks from "@/components/socialLinks";
import { LOCALE_KO } from "@/lib/client/constants";

/* 아이콘 */
import {
  DevicePhoneMobileIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { ArrowDownIcon } from "@heroicons/react/24/solid";

interface MobileHeroProps {
  /* CTA 클릭 시 채팅 영역으로 스크롤하는 콜백 */
  onStart: () => void;
}

/* 모바일(web 브레이크포인트 미만)에서만 노출되는 프로필 인트로 히어로 — 데스크탑에서는 @side가 대신 노출 */
export default function MobileHero({ onStart }: MobileHeroProps) {
  const t = useTranslations();
  const locale = useLocale();

  /* 히어로 전용 문구는 i18n 시트 동기화 대상이 아니라 로케일 분기로 처리 (헤더의 언어 링크와 동일 패턴) */
  const startLabel =
    locale === LOCALE_KO ? "궁금한 점 물어보기" : "Ask me anything";

  return (
    <section className="web:hidden">
      <div
        className="flex flex-col items-center gap-6 rounded-2xl border p-6 text-center"
        style={{
          borderColor: "var(--color-border-primary)",
          backgroundImage:
            "linear-gradient(165deg, color-mix(in srgb, var(--color-bg-accent), transparent 88%), var(--color-bg-secondary))",
        }}
      >
        {/* 프로필 이미지 슬라이더 */}
        <ProfileSwiper />

        {/* 이름 및 소개 */}
        <div className="flex flex-col gap-2">
          <h1
            className="text-3xl font-semibold tracking-tight"
            style={{ color: "var(--color-text-heading)" }}
          >
            {t("portfolioTitle")}
          </h1>
          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            &ldquo;{t("introduce1")} {t("introduce2")}&rdquo;
          </p>
        </div>

        {/* 연락처 (라벨·값을 한 줄로 카드 좌측 정렬, 430px 이하에서는 두 값 모두 라벨 아래로 내려 줄바꿈 모양 통일) */}
        <div className="w-full flex flex-col items-start gap-3 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <DevicePhoneMobileIcon
              className="size-5"
              style={{ color: "var(--color-text-muted)" }}
            />
            <span
              className="w-14 text-sm font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("phone")}
            </span>
            <ContactInfo
              value={process.env.NEXT_PUBLIC_PHONE_NUMBER || ""}
              type="phone"
              className="text-base max-[430px]:basis-full max-[430px]:ml-7"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <EnvelopeIcon
              className="size-5"
              style={{ color: "var(--color-text-muted)" }}
            />
            <span
              className="w-14 text-sm font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("mail")}
            </span>
            <ContactInfo
              value={process.env.NEXT_PUBLIC_MAIL || ""}
              type="email"
              className="text-base max-[430px]:basis-full max-[430px]:ml-7"
            />
          </div>
        </div>

        {/* 소셜 링크 */}
        <SocialLinks />

        {/* 질문하기 CTA (채팅 영역으로 스크롤) */}
        <button
          type="button"
          onClick={onStart}
          className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
          style={{
            backgroundColor: "var(--color-bg-accent)",
            color: "var(--color-text-on-accent)",
          }}
        >
          {startLabel}
          <ArrowDownIcon className="size-4" />
        </button>
      </div>
    </section>
  );
}
