"use client";

import { useEffect, useRef } from "react";

import { useLocale } from "next-intl";

import { useChatStore } from "@/store/useChatStore";

import { Answer as AnswerType, Question as QuestionType } from "@prisma/client";

import Answer from "./_components/answer";
import Question from "./_components/question";
import SelectQuestion from "./_components/selectQuestion";
import { CHAT_TYPE_ANSWER, CHAT_TYPE_QUESTION } from "./_lib/constants";

export default function ChatBody() {
  /* 현재 설정 된 언어 값 */
  const locale = useLocale();
  const { chatHistory } = useChatStore();

  /* 새로 고침 여부를 ref로 관리 */
  const isRefresh = useRef(true);

  useEffect(() => {
    setTimeout(() => {
      isRefresh.current = false;
    }, 1000);
  }, []);

  const shownQuestionIds = chatHistory
    .filter((chat) => chat.type === CHAT_TYPE_QUESTION)
    .map((chat) => chat.id);

  return (
    <div
      className={`relative h-full px-5 pt-6 pb-20 max-h-dvh flex flex-col gap-4 overflow-y-auto`}
    >
      {chatHistory.map((chat) => {
        /* 질문 */
        if (chat.type === CHAT_TYPE_QUESTION) {
          return (
            <Question
              key={`QUESTION${chat.id}`}
              locale={locale}
              chat={chat as QuestionType}
              /* 999는 고정 인삿말 이기 때문에 마크를 비노출 */
              showMark={chat.id !== 999}
            />
          );
        }
        /* 답변 */
        if (chat.type === CHAT_TYPE_ANSWER) {
          return (
            <Answer
              key={`ANSWER${chat.id}`}
              isRefresh={isRefresh.current}
              locale={locale}
              chat={chat as AnswerType}
            />
          );
        }
      })}
      {/* 질문 선택 리스트 */}
      <SelectQuestion shownQuestionIds={shownQuestionIds} />
    </div>
  );
}
