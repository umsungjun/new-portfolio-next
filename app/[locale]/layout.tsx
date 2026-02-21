import "../globals.css";

import { Suspense } from "react";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { ChannelTalk } from "@/components/channelTalk";
import { SwrProviders } from "@/components/swrProvider";
import { ThemeProvider } from "@/components/themeProvider";
import { LOCALE_KO } from "@/lib/client/constants";
import { localeType } from "@/lib/client/type";

interface LocaleLayoutParams {
  locale: localeType;
}

export async function generateMetadata({
  params,
}: {
  params: LocaleLayoutParams;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL("https://next-umsungjun.vercel.app"),
    title:
      locale === LOCALE_KO
        ? "프론트엔드 개발자 엄성준 Next 포트폴리오"
        : "Frontend Developer Sungjun Um Next Portfolio",
    description:
      locale === LOCALE_KO
        ? "꾸준함이 강점이자 자랑인 프론트엔드 개발자 엄성준 Next 포트폴리오입니다."
        : "This is the Next portfolio of Frontend Developer Sungjun Um, whose strength and pride is consistency.",
    keywords: [
      "프론트엔드 개발자",
      "엄성준",
      "포트폴리오",
      "frontend developer",
      "umsungjun",
      "portfolio",
    ],
    openGraph: {
      title:
        locale === LOCALE_KO
          ? "프론트엔드 개발자 엄성준 Next 포트폴리오"
          : "Frontend Developer Sungjun Um Next Portfolio",
      description:
        locale === LOCALE_KO
          ? "꾸준함이 강점이자 자랑인 프론트엔드 개발자 엄성준 Next 포트폴리오입니다."
          : "This is the Next portfolio of Frontend Developer Sungjun Um, whose strength and pride is consistency.",
      url: "https://next-umsungjun.vercel.app/",
      siteName:
        locale === LOCALE_KO
          ? "프론트엔드 개발자 엄성준 Next 포트폴리오"
          : "Frontend Developer Sungjun Um Next Portfolio",
      images: [
        {
          url: "/favicon.ico",
        },
      ],
      type: "website",
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
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
