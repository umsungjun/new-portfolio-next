import { expect, test } from "@playwright/test";

/**
 * 미들웨어 리다이렉트 및 라우팅 규칙 테스트
 *
 * 규칙:
 * - /        → 한국어 홈 (200)
 * - /en      → 영어 홈 (200)
 * - /home    → 301 → /
 * - /ko/home → 301 → /
 * - /en/home → 301 → /en
 * - /en/     → 301 → /en (trailing slash 정규화)
 * - /invalid → 301 → /
 */

test.describe("라우팅 & 리다이렉트", () => {
  test("/ 는 한국어 홈을 정상 렌더링한다", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
    await expect(page).toHaveTitle(/엄성준/);
  });

  test("/en 은 영어 홈을 정상 렌더링한다", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveURL("/en");
    await expect(page).toHaveTitle(/Sungjun/);
  });

  test("/home → / 로 301 리다이렉트", async ({ page }) => {
    const response = await page.goto("/home");
    await expect(page).toHaveURL("/");
    /* Next.js가 301을 처리해 최종 응답은 200 */
    expect(response?.status()).toBe(200);
  });

  test("/ko/home → / 로 301 리다이렉트", async ({ page }) => {
    await page.goto("/ko/home");
    await expect(page).toHaveURL("/");
  });

  test("/en/home → /en 으로 301 리다이렉트", async ({ page }) => {
    await page.goto("/en/home");
    await expect(page).toHaveURL("/en");
  });

  test("/en/ (trailing slash) → /en 으로 리다이렉트", async ({ page }) => {
    await page.goto("/en/");
    await expect(page).toHaveURL("/en");
  });

  test("유효하지 않은 경로 → / 로 리다이렉트", async ({ page }) => {
    await page.goto("/invalid-path");
    await expect(page).toHaveURL("/");
  });

  test("쿼리 파라미터가 리다이렉트 후 보존된다", async ({ page }) => {
    await page.goto("/home?theme=dark");
    await expect(page).toHaveURL("/?theme=dark");
  });
});
