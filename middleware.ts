import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { LOCALE_EN, LOCALE_KO } from "./lib/client/constants";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const permanentRedirect = { status: 301 as const };

  // searchParams 보존하며 리다이렉트하는 헬퍼
  const redirectTo = (newPath: string) => {
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    return NextResponse.redirect(url, permanentRedirect);
  };

  // trailing slash 정규화 (예: /en/ → /en)
  if (pathname !== "/" && pathname.endsWith("/")) {
    return redirectTo(pathname.slice(0, -1));
  }

  // 기존 /home, /ko/home, /en/home URL → 루트로 301 영구 리다이렉트 (이전 URL 호환)
  if (pathname === "/home" || pathname === `/${LOCALE_KO}/home`) {
    return redirectTo("/");
  }
  if (pathname === `/${LOCALE_EN}/home`) {
    return redirectTo(`/${LOCALE_EN}`);
  }

  // 유효한 경로만 허용, 나머지는 루트로 리다이렉트
  const validPaths = ["/", `/${LOCALE_EN}`];
  if (!validPaths.includes(pathname)) {
    return redirectTo("/");
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
