import { Answer, Question } from "@/lib/client/type";

import qna from "./qna.json";

// 2026-11 Supabase 를 끊으면서 공개 질문·답변을 그대로 떠 둔 것. 임시저장(isDraft) 항목은 없다
const questions = qna.questions as Question[];
const answers = qna.answers as Answer[];

export const getQuestions = () => questions;

export const getAnswers = (questionId: number) =>
  answers.filter((answer) => answer.questionId === questionId);
