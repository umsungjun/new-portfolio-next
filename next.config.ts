import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // 이미지·영상까지 색인에서 빼려고 HTML 밖 응답에도 건다. robots.txt 로 막으면 크롤러가 이 헤더를 못 봐서 이미 색인된 페이지가 남는다
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
