import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

import { LOCALE_KO, SUPPORTED_LOCALES } from "@/lib/client/constants";

export const routing = defineRouting({
  /* 지원하는 언어 설정 */
  locales: SUPPORTED_LOCALES,
  /* 기본 언어 설정 */
  defaultLocale: LOCALE_KO,
  /* 언어별 경로 설정 */
  localePrefix: "as-needed",
});

/* export const { Link, redirect, usePathname, useRouter } = createNavigation(routing); 코드는 Next.js의 Link, redirect, usePathname, useRouter를 사용할 수 있도록 래핑한 것입니다. 이를 사용하여 기존 next j에서 제공하는 API를 대체할 수 있습니다. */
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
