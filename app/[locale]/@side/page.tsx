import { getTranslations } from "next-intl/server";

import { localeType } from "@/lib/client/type";

/* 아이콘 */
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

import ContactInfo from "./_components/contactInfo";
import ProfileSwiper from "./_components/profileSwiper";

interface SideProps {
  params: {
    locale: localeType;
  };
}

export default async function Side({ params }: SideProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <aside className="hidden max-w-[450px] w-[450px] h-screen items-center web:flex">
      <div className="w-full flex flex-col gap-10">
        {/* 제목 및 소개 */}
        <div className="flex flex-col gap-10">
          <h1
            className="text-5xl text-center font-semibold tracking-tight"
            style={{ color: "var(--color-text-heading)" }}
          >
            {t("portfolioTitle")}
          </h1>
          <div className="flex flex-col gap-2">
            <h3
              className="text-xl"
              style={{ color: "var(--color-text-secondary)" }}
            >
              &ldquo;{t("introduce1")}
            </h3>
            <h3
              className="text-xl text-right"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("introduce2")}&rdquo;
            </h3>
          </div>
        </div>
        {/* 연락처 */}
        <div className="flex gap-8">
          <div className="w-1/2">
            <h3
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("contact")}
            </h3>
            <ul className="pt-4 flex flex-col gap-4">
              <li>
                <div className="flex items-center gap-1.5">
                  <DevicePhoneMobileIcon
                    className="size-5"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <h5
                    className="text-base font-medium"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {t("phone")}
                  </h5>
                </div>
                <ContactInfo
                  value={process.env.NEXT_PUBLIC_PHONE_NUMBER || ""}
                  type="phone"
                />
              </li>
              <li>
                <div className="flex items-center gap-1.5">
                  <EnvelopeIcon
                    className="size-5"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <h5
                    className="text-base font-medium"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    {t("mail")}
                  </h5>
                </div>
                <ContactInfo
                  value={process.env.NEXT_PUBLIC_MAIL || ""}
                  type="email"
                />
              </li>
            </ul>
          </div>
          {/* 프로필 이미지 스와이퍼 */}
          <ProfileSwiper />
        </div>
        {/* git, blog, linkedin 링크 */}
        <div className="flex flex-col gap-3">
          <h3
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("links")}
          </h3>
          <div className="flex w-full gap-3">
            <a
              className="linkCard flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl transition-colors duration-200"
              href="https://github.com/umsungjun"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-6"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
              </svg>
              <span className="text-sm font-semibold linkCardText">
                {t("gitHub")}
              </span>
            </a>
            <a
              className="linkCard flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl transition-colors duration-200"
              href="https://developer-sungjun.tistory.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EB531F"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
              >
                <path d="M4 4h16" />
                <path d="M12 4v16" />
              </svg>
              <span className="text-sm font-semibold linkCardText">
                {t("blog")}
              </span>
            </a>
            <a
              className="linkCard flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl transition-colors duration-200"
              href="https://www.linkedin.com/in/frontend-developer-umsungjun"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#0A66C2"
                className="w-6"
                viewBox="0 0 16 16"
              >
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
              </svg>
              <span className="text-sm font-semibold text-nowrap linkCardText">
                {t("linkedIn")}
              </span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
