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

  /* 스크롤 컨테이너 및 방금 선택한 질문 말풍선 ref */
  const containerRef = useRef<HTMLDivElement>(null);
  const lastQuestionRef = useRef<HTMLDivElement>(null);
  /* 이전 질문 개수 추적 (초기 null = 최초 마운트/새로고침 복원) */
  const prevQuestionCountRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeout(() => {
      isRefresh.current = false;
    }, 1000);
  }, []);

  const shownQuestionIds = chatHistory
    .filter((chat) => chat.type === CHAT_TYPE_QUESTION)
    .map((chat) => chat.id);

  /* 질문 개수 (답변 push로는 변하지 않아 질문 1개당 스크롤 1회만 트리거) */
  const questionCount = shownQuestionIds.length;
  /* 배열에 append만 되므로 마지막 질문 = 방금 선택한 질문 */
  const lastQuestionId = shownQuestionIds[shownQuestionIds.length - 1];

  /* 방금 선택한 질문을 스크롤 영역 최상단으로 올림 (ChatGPT식) */
  const scrollToLastQuestion = () => {
    requestAnimationFrame(() => {
      const container = containerRef.current;
      const target = lastQuestionRef.current;
      if (!container || !target) return;

      /* 컨테이너 기준 타깃 위치 = (타깃 top - 컨테이너 top) + 현재 scrollTop, 상단 소폭 여백 8px */
      const top = Math.max(
        0,
        target.getBoundingClientRect().top -
          container.getBoundingClientRect().top +
          container.scrollTop -
          8
      );

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      /* scrollIntoView는 window까지 번질 수 있어 컨테이너만 직접 스크롤 */
      container.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  };

  useEffect(() => {
    /* 최초 마운트(새로고침 복원)는 카운트만 기록하고 스크롤하지 않음 */
    if (prevQuestionCountRef.current === null) {
      prevQuestionCountRef.current = questionCount;
      return;
    }
    /* 질문이 늘어난 경우(=사용자가 새로 선택)에만 스크롤 */
    if (questionCount > prevQuestionCountRef.current) {
      scrollToLastQuestion();
    }
    prevQuestionCountRef.current = questionCount;
  }, [questionCount]);

  return (
    <div
      ref={containerRef}
      className={`relative h-full px-5 pt-6 pb-20 max-h-dvh flex flex-col gap-4 overflow-y-auto`}
    >
      {chatHistory.map((chat) => {
        /* 질문 */
        if (chat.type === CHAT_TYPE_QUESTION) {
          const questionEl = (
            <Question
              locale={locale}
              chat={chat as QuestionType}
              /* 999는 고정 인삿말 이기 때문에 마크를 비노출 */
              showMark={chat.id !== 999}
            />
          );
          /* 마지막(방금 선택한) 질문만 스크롤 타깃 ref용 래퍼로 감쌈 */
          return chat.id === lastQuestionId ? (
            <div key={`QUESTION${chat.id}`} ref={lastQuestionRef}>
              {questionEl}
            </div>
          ) : (
            <div key={`QUESTION${chat.id}`}>{questionEl}</div>
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
