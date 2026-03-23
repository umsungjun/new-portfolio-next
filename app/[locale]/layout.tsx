import "../globals.css";

import { Suspense } from "react";

import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { ChannelTalk } from "@/components/channelTalk";
import { SwrProviders } from "@/components/swrProvider";
import { ThemeProvider } from "@/components/themeProvider";
import { localeType } from "@/lib/client/type";

interface LocaleLayoutParams {
  locale: localeType;
}

// 공통 메타데이터 베이스 URL (하위 페이지에서 상속됨)
export const metadata: Metadata = {
  metadataBase: new URL("https://umsungjun.kro.kr"),
};

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
