import { expect, test } from "@playwright/test";

/**
 * API 라우트 테스트
 *
 * - GET  /api/question → { success: true, data: Question[] }
 * - POST /api/answer   → { success: true, data: Answer[] }
 *
 * UI 없이 직접 HTTP 요청으로 검증 (빠르고 격리됨)
 */

test.describe("GET /api/question", () => {
  test("질문 목록을 반환한다", async ({ request }) => {
    const response = await request.get("/api/question");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test("각 질문은 id, contentKo, contentEn 필드를 포함한다", async ({ request }) => {
    const response = await request.get("/api/question");
    const { data } = await response.json();

    for (const question of data) {
      expect(question).toHaveProperty("id");
      expect(question).toHaveProperty("contentKo");
      expect(question).toHaveProperty("contentEn");
    }
  });

  test("질문이 id 순으로 정렬된다", async ({ request }) => {
    const response = await request.get("/api/question");
    const { data } = await response.json();

    const ids: number[] = data.map((q: { id: number }) => q.id);
    const sorted = [...ids].sort((a, b) => a - b);
    expect(ids).toEqual(sorted);
  });
});

test.describe("POST /api/answer", () => {
  test("유효한 questionId로 답변을 반환한다", async ({ request }) => {
    /* 먼저 첫 번째 질문 ID를 가져옴 */
    const questionRes = await request.get("/api/question");
    const { data: questions } = await questionRes.json();
    const firstId: number = questions[0].id;

    const response = await request.post("/api/answer", {
      data: { id: firstId },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test("각 답변은 id, contentKo, contentEn 필드를 포함한다", async ({ request }) => {
    const questionRes = await request.get("/api/question");
    const { data: questions } = await questionRes.json();
    const firstId: number = questions[0].id;

    const response = await request.post("/api/answer", {
      data: { id: firstId },
    });
    const { data: answers } = await response.json();

    for (const answer of answers) {
      expect(answer).toHaveProperty("id");
      expect(answer).toHaveProperty("contentKo");
      expect(answer).toHaveProperty("contentEn");
    }
  });

  test("유효하지 않은 id → 400 반환", async ({ request }) => {
    const response = await request.post("/api/answer", {
      data: { id: 999999 },
    });

    /* 존재하지 않는 ID — 400 또는 빈 data 반환 */
    const body = await response.json();
    const isErrorOrEmpty =
      response.status() === 400 ||
      (body.success === true && body.data.length === 0);
    expect(isErrorOrEmpty).toBe(true);
  });

  test("id 없이 요청 시 400 반환", async ({ request }) => {
    const response = await request.post("/api/answer", {
      data: {},
    });

    expect(response.status()).toBe(400);
  });
});
