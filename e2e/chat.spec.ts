import { expect, test } from "@playwright/test";

/**
 * 채팅 UI 플로우 테스트
 *
 * 흐름:
 * 1. 초기 인사 메시지 2개 표시 (ID 998, 999 - 하드코딩, DB 조회 없음)
 * 2. 질문 선택 버튼 로드 (SWR → /api/question)
 * 3. 질문 클릭 → Q 버블 추가 → 1초 로더 → A 버블 표시
 * 4. 이미 선택한 질문은 목록에서 제거
 */

test.describe("채팅 UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    /* 클라이언트 컴포넌트(Zustand) 하이드레이션 완료 대기 */
    await page.waitForLoadState("networkidle");
  });

  test("초기 인사 메시지 2개가 표시된다", async ({ page }) => {
    /* .questionWrapper 가 렌더됐을 때 텍스트 확인 */
    await page.locator(".questionWrapper").first().waitFor();

    /* .questionWrapper 안의 <p> 로 범위 한정 — 사이드 패널의 <h3>과 중복 방지 */
    await expect(
      page.locator(".questionWrapper p", { hasText: "방문해주셔서 감사합니다." })
    ).toBeVisible();
    await expect(
      page.locator(".questionWrapper p", { hasText: "프론트엔드 개발자 엄성준입니다." })
    ).toBeVisible();
  });

  test("질문 선택 버튼이 로드된다", async ({ page }) => {
    /* 스켈레톤이 사라지고 실제 버튼이 나타날 때까지 대기 */
    await page
      .locator(".questionButtonBox button:not(.questionButtonSkeleton)")
      .first()
      .waitFor();

    const buttons = page.locator(
      ".questionButtonBox button:not(.questionButtonSkeleton)"
    );
    await expect(buttons.first()).toBeVisible();
    expect(await buttons.count()).toBeGreaterThan(0);
  });

  test("질문 클릭 시 Q 버블이 추가된다", async ({ page }) => {
    const firstButton = page.locator(
      ".questionButtonBox button:not(.questionButtonSkeleton)"
    ).first();
    await firstButton.waitFor();

    const questionText = await firstButton.textContent();
    await firstButton.click();

    await expect(page.getByText(questionText!.trim())).toBeVisible();
  });

  test("질문 클릭 후 로더가 표시되다 사라진다", async ({ page }) => {
    const firstButton = page.locator(
      ".questionButtonBox button:not(.questionButtonSkeleton)"
    ).first();
    await firstButton.waitFor();
    await firstButton.click();

    /* .answerLoader 가 나타남 (react-spinners는 data-testid를 DOM으로 포워딩하지 않음) */
    const loader = page.locator(".answerLoader");
    await expect(loader).toBeVisible();

    /* 1초 로딩 후 사라짐 (최대 5초 대기) */
    await expect(loader).not.toBeVisible({ timeout: 5000 });
  });

  test("답변이 로더 후 표시된다", async ({ page }) => {
    const firstButton = page.locator(
      ".questionButtonBox button:not(.questionButtonSkeleton)"
    ).first();
    await firstButton.waitFor();
    await firstButton.click();

    await expect(page.locator(".answerLoader")).not.toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator(".answer")).toBeVisible();
  });

  test("선택한 질문은 버튼 목록에서 제거된다", async ({ page }) => {
    const buttons = page.locator(
      ".questionButtonBox button:not(.questionButtonSkeleton)"
    );
    await buttons.first().waitFor();

    const initialCount = await buttons.count();
    const questionText = await buttons.first().textContent();

    await buttons.first().click();
    await expect(page.locator(".answerLoader")).not.toBeVisible({
      timeout: 5000,
    });

    /* 선택 후 버튼이 1개 줄어야 함 */
    await expect(buttons).toHaveCount(initialCount - 1);

    const remainingTexts = await buttons.allTextContents();
    expect(remainingTexts.map((t) => t.trim())).not.toContain(
      questionText!.trim()
    );
  });

  test("채팅 기록이 sessionStorage에 저장된다", async ({ page }) => {
    const firstButton = page.locator(
      ".questionButtonBox button:not(.questionButtonSkeleton)"
    ).first();
    await firstButton.waitFor();
    await firstButton.click();

    /* .answer 가 DOM에 나타날 때까지 대기
     * - isRefresh=true 구간엔 loader 없이 바로 .answer 렌더
     * - isRefresh=false 구간엔 loader(1초) 후 .answer 렌더
     * 두 경우 모두 .answer 출현이 "API 완료 + setChatHistory 호출" 시점 */
    await page.locator(".answer").waitFor({ timeout: 8000 });

    /* Zustand persist가 sessionStorage에 쓸 때까지 폴링 대기 */
    await page.waitForFunction(
      () => sessionStorage.getItem("useChatStore") !== null,
      { timeout: 3000 }
    );

    const raw = await page.evaluate(() =>
      sessionStorage.getItem("useChatStore")
    );
    const parsed = JSON.parse(raw!);
    /* 초기 메시지 2개 + 질문 1개 + 답변 1개 이상 */
    expect(parsed.state.chatHistory.length).toBeGreaterThan(2);
  });
});
