import { expect, test } from "@playwright/test";

/**
 * 다국어(i18n) 테스트
 *
 * - 기본(한국어): / — prefix 없음
 * - 영어: /en
 * - 언어 전환 버튼: 헤더의 "A" (→ 영어) / "한" (→ 한국어)
 * - 테마 파라미터(?theme=)는 언어 전환 시 보존됨
 */

test.describe("i18n — 한국어 (기본)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("페이지 타이틀이 한국어다", async ({ page }) => {
    await expect(page).toHaveTitle(/엄성준/);
  });

  test("초기 인사 메시지가 한국어다", async ({ page }) => {
    await expect(page.getByText("방문해주셔서 감사합니다.")).toBeVisible();
  });

  test("질문 선택 안내 문구가 한국어다", async ({ page }) => {
    await expect(
      page.getByText("원하는 질문 카테고리를 선택해 주세요!")
    ).toBeVisible();
  });
});

test.describe("i18n — 영어", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en");
  });

  test("페이지 타이틀이 영어다", async ({ page }) => {
    await expect(page).toHaveTitle(/Sungjun/);
  });

  test("초기 인사 메시지가 영어다", async ({ page }) => {
    await expect(page.getByText("Thank you for visiting.")).toBeVisible();
  });

  test("질문 선택 안내 문구가 영어다", async ({ page }) => {
    await expect(
      page.getByText("Select your desired question category!")
    ).toBeVisible();
  });
});

test.describe("언어 전환", () => {
  test("한국어 → 영어 전환", async ({ page }) => {
    await page.goto("/");

    /* 헤더의 "A" 링크 클릭 → /en 으로 이동 */
    await page.getByRole("link", { name: "A" }).click();
    await expect(page).toHaveURL("/en");
    await expect(page.getByText("Thank you for visiting.")).toBeVisible();
  });

  test("영어 → 한국어 전환", async ({ page }) => {
    await page.goto("/en");

    /* 헤더의 "한" 링크 클릭 → / 로 이동 */
    await page.getByRole("link", { name: "한" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByText("방문해주셔서 감사합니다.")).toBeVisible();
  });

  test("언어 전환 시 테마 파라미터가 보존된다", async ({ page }) => {
    await page.goto("/?theme=dark");

    await page.getByRole("link", { name: "A" }).click();
    await expect(page).toHaveURL("/en?theme=dark");
  });
});
