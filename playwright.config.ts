import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  /* 각 테스트 파일은 순서대로 실행, 파일 간 병렬 실행 */
  fullyParallel: true,
  /* CI 환경에서 only 실수 방지 */
  forbidOnly: !!process.env.CI,
  /* CI에서 실패 시 재시도 없음 */
  retries: process.env.CI ? 2 : 0,
  /* CI에서 워커 수 제한 */
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    /* 브라우저 Accept-Language를 한국어로 고정 — 영어 locale이면 next-intl이 /en으로 리다이렉트함 */
    locale: "ko-KR",
    /* 실패 시 스크린샷 저장 */
    screenshot: "only-on-failure",
    /* 액션 추적 (디버깅용) */
    trace: "on-first-retry",
  },
  projects: [
    /* 데스크톱 브라우저 */
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    /* 모바일 브라우저 — 1055px 미만에서 사이드 패널이 숨겨지는 레이아웃 검증에 유용 */
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 14"] },
    },
  ],
  /* 테스트 전 개발 서버 자동 시작 */
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    /* 이미 실행 중인 서버 재사용 (로컬 개발 편의) */
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
