import "../globals.css";

import { Suspense } from "react";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { ChannelTalk } from "@/components/channelTalk";
import { SwrProviders } from "@/components/swrProvider";
import { ThemeProvider } from "@/components/themeProvider";
import { LOCALE_EN, LOCALE_KO } from "@/lib/client/constants";
import { localeType } from "@/lib/client/type";

interface LocaleLayoutParams {
  locale: localeType;
}

// SEO 최적화: 정적 메타데이터 객체를 미리 정의하여 빠른 resolve 보장
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
  params: Promise<LocaleLayoutParams>;
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
      "Next.js",
    ],
    // canonical URL 추가 (중복 콘텐츠 방지)
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
    // 추가 SEO 메타데이터
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

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<LocaleLayoutParams>;
}>) {
  const { locale } = await params;

  /* locale을 인자로 전달해야 정상적으로 언어가 변경 됨 */
  const messages = await getMessages({ locale });

  // 구조화된 데이터 (JSON-LD) - 검색 엔진이 페이지 타입을 이해하도록 지원
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* 구조화된 데이터 (JSON-LD) - SEO 최적화 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {/* Microsoft Clarity 분석 스크립트 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "vkw20l8bc4");`,
          }}
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <ThemeProvider>
            <SwrProviders>
              <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
              </NextIntlClientProvider>
            </SwrProviders>
          </ThemeProvider>
        </Suspense>
        <ChannelTalk />
      </body>
    </html>
  );
}
