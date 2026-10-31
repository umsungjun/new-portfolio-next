"use client";

import { useId } from "react";

import { useLocale } from "next-intl";
import Image from "next/image";

import { LOCALE_KO, YOUTUBE_CHANNELS } from "@/lib/client/constants";

interface YoutubeChannelsProps {
  /* compact: 사진·이름·버튼을 가로 세 칸(사이드 영역), list: 한 줄 소개까지 세로 목록(모바일 히어로) */
  variant?: "compact" | "list";
}

interface PlatformLinksProps {
  name: string;
  youtube: string;
  instagram: string | null;
}

/* 유튜브·인스타그램 아이콘 버튼. 인스타그램이 없는 채널은 유튜브만 */
function PlatformLinks({ name, youtube, instagram }: PlatformLinksProps) {
  /* 같은 그라데이션 id 가 여러 번 나오면 숨겨진 모바일 히어로 쪽 정의를 집어 색이 빠질 수 있어 카드마다 고유 id 를 쓴다 */
  const gradientId = `ig-${useId()}`;

  return (
    <span className="flex items-center gap-2">
      <a
        className="linkCard flex size-9 items-center justify-center rounded-lg border transition-colors duration-200"
        style={{ borderColor: "var(--color-border-primary)" }}
        href={youtube}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} YouTube`}
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path
            fill="#FF0000"
            d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8"
          />
          <path fill="#FFFFFF" d="M9.6 15.6 15.8 12 9.6 8.4z" />
        </svg>
      </a>
      {instagram ? (
        <a
          className="linkCard flex size-9 items-center justify-center rounded-lg border transition-colors duration-200"
          style={{ borderColor: "var(--color-border-primary)" }}
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} Instagram`}
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#FEDA75" />
                <stop offset="0.35" stopColor="#FA7E1E" />
                <stop offset="0.6" stopColor="#D62976" />
                <stop offset="0.85" stopColor="#962FBF" />
                <stop offset="1" stopColor="#4F5BD5" />
              </linearGradient>
            </defs>
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              rx="6"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="2.2"
            />
            <circle
              cx="12"
              cy="12"
              r="4.4"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="2.2"
            />
            <circle cx="17.4" cy="6.6" r="1.3" fill={`url(#${gradientId})`} />
          </svg>
        </a>
      ) : null}
    </span>
  );
}

/**
 * 운영 중인 채널 카드 (사이드 영역 / 모바일 히어로 공용).
 * 채널마다 유튜브·인스타그램 버튼을 나란히 둔다. 사이드 영역은 화면 높이에 맞춰져 있어 compact 로 높이를 아낀다.
 */
export default function YoutubeChannels({
  variant = "list",
}: YoutubeChannelsProps) {
  const locale = useLocale();
  const describe = (channel: (typeof YOUTUBE_CHANNELS)[number]) =>
    locale === LOCALE_KO ? channel.descriptionKo : channel.descriptionEn;

  if (variant === "compact") {
    return (
      <ul className="grid w-full grid-cols-3 gap-3">
        {YOUTUBE_CHANNELS.map((channel) => (
          <li
            key={channel.id}
            className="linkCard flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-center"
            title={describe(channel)}
          >
            <Image
              src={channel.image}
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-full"
            />
            <span className="text-sm font-semibold break-keep linkCardText">
              {channel.name}
            </span>
            <PlatformLinks
              name={channel.name}
              youtube={channel.youtube}
              instagram={channel.instagram}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-2">
      {YOUTUBE_CHANNELS.map((channel) => (
        <li
          key={channel.id}
          className="linkCard flex items-center gap-3 rounded-xl px-3 py-2.5 text-left"
        >
          <Image
            src={channel.image}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full"
          />
          <span className="flex min-w-0 flex-1 flex-col">
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-heading)" }}
            >
              {channel.name}
            </span>
            <span className="truncate text-xs linkCardText">
              {describe(channel)}
            </span>
          </span>
          <PlatformLinks
            name={channel.name}
            youtube={channel.youtube}
            instagram={channel.instagram}
          />
        </li>
      ))}
    </ul>
  );
}
