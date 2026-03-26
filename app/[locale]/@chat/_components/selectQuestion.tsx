import { useState } from "react";

import { useLocale, useTranslations } from "next-intl";

import { LOCALE_KO } from "@/lib/client/constants";
import { useChatStore } from "@/store/useChatStore";

import useSWR from "swr";

import { Answer, Question } from "@prisma/client";

interface QuestionResponse {
  success: boolean;
  data: Question[];
  shownQuestionIds: number[];
}

interface SelectQuestionProps {
  shownQuestionIds: number[];
}

export default function SelectQuestion({
  shownQuestionIds,
}: SelectQuestionProps) {
  /* 현재 설정 된 언어 값 */
  const locale = useLocale();
  const t = useTranslations();
  const { setChatHistory } = useChatStore();

  /* 답변 추가 중 상태 */
  const [isAnswering, setIsAnswering] = useState(false);

  const { data, isLoading, error } = useSWR<QuestionResponse>("/api/question");

  /* ToDo 에러 처리 */
  if (error || !data) {
    return null;
  }

  const getAnswer = async (question: Question) => {
    setIsAnswering(true);
    try {
      const response = await fetch(`/api/answer`, {
        method: "POST",
        body: JSON.stringify({ id: question.id }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        /* 질문 추가 */
        setChatHistory(question);
        /* 답변 추가 */
        data.data.forEach((answer: Answer) => {
          setChatHistory(answer);
        });
      }
    } catch (error) {
      console.error("답변을 불러오는 중 오류가 발생했습니다.", error);
    } finally {
      setIsAnswering(false);
    }
  };

  /* 이미 선택된 질문은 비노출 */
  const filteredQuestions = data.data.filter(
    (question) => !shownQuestionIds.includes(question.id)
  );

  if (filteredQuestions.length === 0) return null;

  return (
    <div className="questionWrapper">
      <div className="questionButtonBox">
        <span>{t("chatSelectQuestion")}</span>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <button key={index} className="questionButtonSkeleton" />
          ))
        ) : (
          <>
            {filteredQuestions.map((question) => {
              return (
                <button
                  key={question.id}
                  onClick={() => getAnswer(question)}
                  disabled={isAnswering}
                >
                  {locale === LOCALE_KO
                    ? question.contentKo
                    : question.contentEn}
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
