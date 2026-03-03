import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { LOCALE_EN, LOCALE_KO } from "./lib/client/constants";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 루트 경로나 locale만 있는 경우 /home으로 리다이렉트
  if (
    pathname === "/" ||
    pathname === `/${LOCALE_KO}` ||
    pathname === `/${LOCALE_EN}`
  ) {
    // locale 추출
    let locale = LOCALE_KO;
    if (pathname === `/${LOCALE_EN}`) {
      locale = LOCALE_EN;
    } else if (pathname === `/${LOCALE_KO}`) {
      locale = LOCALE_KO;
    }

    // 직접 리다이렉트 반환
    const url = new URL(`/${locale}/home`, request.url);
    return NextResponse.redirect(url);
  }

  // 나머지는 next-intl middleware에게 위임
  return intlMiddleware(request);
}

export const config = {
  /* 정규식 설명:
    - / : 루트 경로부터 시작
    - (?! ... ) : negative lookahead - 괄호 안의 패턴과 일치하지 않는 경우만 선택
  */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.html).*)",
  ],
};
