"use client";

import { useEffect, useRef } from "react";

import { useLocale } from "next-intl";

import { useChatStore } from "@/store/useChatStore";

import { Answer as AnswerType, Question as QuestionType } from "@prisma/client";

import Answer from "./_components/answer";
import MobileHero from "./_components/mobileHero";
import Question from "./_components/question";
import SelectQuestion from "./_components/selectQuestion";
import { CHAT_TYPE_ANSWER, CHAT_TYPE_QUESTION } from "./_lib/constants";

/* 컨테이너 내부에서 특정 요소를 상단으로 스크롤 (window로 번지지 않게 컨테이너만 직접 조작) */
const scrollElementToTop = (
  container: HTMLDivElement,
  target: HTMLElement,
  offset = 8
) => {
  const top = Math.max(
    0,
    target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      offset
  );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  container.scrollTo({
    top,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
};

export default function ChatBody() {
  /* 현재 설정 된 언어 값 */
  const locale = useLocale();
  const { chatHistory } = useChatStore();

  /* 새로 고침 여부를 ref로 관리 */
  const isRefresh = useRef(true);

  /* 스크롤 컨테이너 및 방금 선택한 질문 말풍선 ref */
  const containerRef = useRef<HTMLDivElement>(null);
  const lastQuestionRef = useRef<HTMLDivElement>(null);
  /* 모바일 히어로 CTA가 스크롤할 채팅 영역 시작점 ref */
  const chatStartRef = useRef<HTMLDivElement>(null);
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
      scrollElementToTop(container, target);
    });
  };

  /* 모바일 히어로의 CTA 클릭 시 채팅 영역 시작점으로 스크롤 */
  const scrollToChat = () => {
    requestAnimationFrame(() => {
      const container = containerRef.current;
      const target = chatStartRef.current;
      if (!container || !target) return;
      scrollElementToTop(container, target);
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
      {/* 모바일 전용 프로필 인트로 (web 미만에서만 노출) */}
      <MobileHero onStart={scrollToChat} />
      {/* 채팅 영역 — 히어로 CTA 스크롤 타깃 */}
      <div ref={chatStartRef} className="flex flex-col gap-4">
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
    </div>
  );
}
