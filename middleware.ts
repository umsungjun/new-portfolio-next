import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { LOCALE_EN } from "./lib/client/constants";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 루트 경로 → /home으로 리다이렉트 (기본 locale은 prefix 없이)
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // /en만 접속한 경우 → /en/home으로 리다이렉트
  if (pathname === `/${LOCALE_EN}`) {
    return NextResponse.redirect(new URL(`/${LOCALE_EN}/home`, request.url));
  }

  // 유효한 경로만 허용, 나머지는 /home으로 리다이렉트
  const validPaths = ["/home", `/${LOCALE_EN}/home`];
  if (!validPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/home", request.url));
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
