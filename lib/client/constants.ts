/* 언어 관련 전역 상수 */
export const LOCALE_KO = "ko";
export const LOCALE_EN = "en";
export const SUPPORTED_LOCALES = [LOCALE_KO, LOCALE_EN];

/**
 * 운영 중인 채널(유튜브·인스타그램). 사이드 영역과 모바일 히어로가 같이 쓴다. 인스타그램 조회수가 더 잘 나와 유튜브와 같은 무게로 보여 준다.
 * 소개 문구는 i18n 시트 동기화 대상이 아니라 여기서 로케일별로 둔다(시트를 내려받으면 messages/ 가 덮어써진다).
 */
export const YOUTUBE_CHANNELS = [
  {
    id: "sungjunn",
    name: "SUNGJUNN",
    youtube: "https://www.youtube.com/@sungjunnmusic",
    instagram: null,
    image: "/images/channels/sungjunn.png",
    descriptionKo: "게임·운동·드라이브할 때 듣는 EDM 음악 채널",
    descriptionEn: "EDM for gaming, workouts and night drives",
  },
  {
    id: "dev-interview",
    name: "3초 개발 면접",
    youtube: "https://www.youtube.com/@3초개발면접",
    instagram: "https://www.instagram.com/3sec.dev.interview/",
    image: "/images/channels/dev-interview.png",
    descriptionKo: "개발 면접 단골 질문을 3초 퀴즈로",
    descriptionEn: "Common dev interview questions as 3-second quizzes",
  },
  {
    id: "econ-basics",
    name: "3초 경제 상식",
    youtube: "https://www.youtube.com/@3초경제상식",
    instagram: "https://www.instagram.com/3sec.econ.basics/",
    image: "/images/channels/econ-basics.png",
    descriptionKo: "생활 속 돈 계산을 공식 자료로 짚는 쇼츠",
    descriptionEn: "Everyday money math, checked against official sources",
  },
] as const;
