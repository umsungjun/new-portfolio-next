import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";

import { Answer, Question } from "@prisma/client";

type Chat = Question | Answer;

interface UseChatStore {
  chatHistory: Chat[];
  setChatHistory: (updateChatHistory: Chat) => void;
  popChatHistory: () => void;
}

/* 초기 채팅 데이터 */
const initialChatHistory: Chat[] = [
  {
    id: 998,
    contentKo: "방문해주셔서 감사합니다.",
    contentEn: "Thank you for visiting.",
    type: "QUESTION",
    isDraft: false,
  },
  {
    id: 999,
    contentKo: "프론트엔드 개발자 엄성준입니다.",
    contentEn: "I am a frontend developer.",
    type: "QUESTION",
    isDraft: false,
  },
];

export const useChatStore = create<UseChatStore>()(
  persist(
    (set, get) => ({
      chatHistory: initialChatHistory,
      setChatHistory: (updateChatHistory) =>
        set(() => ({
          chatHistory: [...get().chatHistory, updateChatHistory],
        })),
      popChatHistory: () =>
        set(() => ({ chatHistory: get().chatHistory.slice(0, -1) })),
    }),
    {
      name: "useChatStore",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
