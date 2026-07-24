import { getTranslations } from "next-intl/server";

import ContactInfo from "@/components/contactInfo";
import ProfileSwiper from "@/components/profileSwiper";
import SocialLinks from "@/components/socialLinks";
import { localeType } from "@/lib/client/type";

/* 아이콘 */
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

interface SideProps {
  params: Promise<{ locale: string }>;
}

export default async function Side({ params }: SideProps) {
  const { locale } = (await params) as { locale: localeType };
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
          <SocialLinks />
        </div>
      </div>
    </aside>
  );
}
