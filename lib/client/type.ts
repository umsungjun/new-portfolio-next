export type localeType = "ko" | "en";

export type MediaType = "IMAGE" | "VIDEO";

/** 채팅 질문. 데이터 원본은 `lib/server/qna.json` */
export interface Question {
  id: number;
  type: "QUESTION";
  isDraft: boolean;
  contentKo: string;
  contentEn: string;
}

/** 채팅 답변. mediaUrl 은 IMAGE·VIDEO 모두 `public/` 아래 경로 */
export interface Answer {
  id: number;
  type: "ANSWER";
  isDraft: boolean;
  contentKo: string;
  contentEn: string;
  mediaUrl: string | null;
  mediaType: MediaType | null;
  questionId: number;
}
