import { ReactNode } from "react";

import type { Metadata } from "next";

import { LOCALE_EN, LOCALE_KO } from "@/lib/client/constants";
import { localeType } from "@/lib/client/type";

interface MainLayoutProps {
  side: ReactNode;
  chat: React.ReactNode;
  params: Promise<{ locale: localeType }>;
}

// SEO 최적화: 페이지 레벨 메타데이터 (Layout보다 우선순위 높음)
const SITE_URL = "https://next-umsungjun.vercel.app" as const;

const METADATA_CONFIG = {
  [LOCALE_KO]: {
    title: "프론트엔드 개발자 엄성준 Next 포트폴리오",
    description:
      "꾸준함이 강점이자 자랑인 프론트엔드 개발자 엄성준 Next 포트폴리오입니다.",
    ogImage: "/og-image-ko.png",
    ogImageAlt: "프론트엔드 개발자 엄성준 포트폴리오",
  },
  [LOCALE_EN]: {
    title: "Frontend Developer Sungjun Um Next Portfolio",
    description:
      "This is the Next portfolio of Frontend Developer Sungjun Um, whose strength and pride is consistency.",
    ogImage: "/og-image-en.png",
    ogImageAlt: "Frontend Developer Sungjun Um Portfolio",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: localeType }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const config = METADATA_CONFIG[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: config.title,
    description: config.description,
    keywords: [
      "프론트엔드 개발자",
      "엄성준",
      "포트폴리오",
      "frontend developer",
      "umsungjun",
      "portfolio",
      "React",
      "Next.js",
      "TypeScript",
    ],
    alternates: {
      canonical: `/${locale}/home`,
      languages: {
        ko: "/ko/home",
        en: "/en/home",
      },
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: `${SITE_URL}/${locale}/home`,
      siteName: config.title,
      locale: locale === LOCALE_KO ? "ko_KR" : "en_US",
      type: "website",
      images: [
        {
          url: config.ogImage,
          width: 1200,
          height: 630,
          alt: config.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
      images: [config.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "FkVxpqkKnBQlSm1tgTF-GyQP0GLfhX_z03E6h21lipo",
      other: {
        "naver-site-verification": "5fe2f129f487d23b1b660ac6081da25d14f95e7a",
      },
    },
  };
}

export default async function MainLayout({
  side,
  chat,
  params,
}: MainLayoutProps) {
  const { locale } = await params;

  // 구조화된 데이터 (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "엄성준",
    alternateName: "Sungjun Um",
    jobTitle: locale === LOCALE_KO ? "프론트엔드 개발자" : "Frontend Developer",
    description: METADATA_CONFIG[locale].description,
    url: `${SITE_URL}/${locale}/home`,
    image: `${SITE_URL}${METADATA_CONFIG[locale].ogImage}`,
    sameAs: [
      "https://github.com/umsungjun",
      "https://developer-sungjun.tistory.com",
      "https://www.linkedin.com/in/frontend-developer-umsungjun",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Frontend Development",
      "Web Development",
    ],
  };

  return (
    <>
      {/* 구조화된 데이터를 head에 주입 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <section className="flex justify-center gap-32 overflow-hidden">
        {side}
        {chat}
      </section>
    </>
  );
}
