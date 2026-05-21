# GitHub Copilot Instructions

## 응답 언어

- **모든 코드 리뷰 코멘트, 제안, 설명은 반드시 한국어로 작성합니다.**
- 영어 기술 용어(예: `props`, `prop drilling`, `SSR`, `XSS`, `DOM`, `eslint` 등)는 그대로 사용해도 되지만, 문장 자체는 한국어로 작성합니다.
- 코드 블록과 식별자(변수명, 함수명 등)는 원본 그대로 유지합니다.

## 리뷰 스타일

- 간결하고 명확하게 작성합니다.
- "왜" 이슈인지 함께 설명합니다 (단순히 "이렇게 바꾸세요"가 아닌 이유 명시).
- 권장 수정안은 코드 블록으로 제시합니다.
- 심각도(High/Medium/Low)는 그대로 영어로 표기해도 됩니다.

## 프로젝트 컨벤션

- 커밋 메시지 prefix: `Feat`, `Fix`, `Docs`, `Style`, `Refactor`, `Test`, `Chore`, `Design`, `Rename`, `Remove`
- TypeScript strict 모드, React 19, Next.js 15 App Router
- 패키지 매니저: pnpm
- 스타일링: Tailwind CSS 3 + CSS 변수 기반 다중 테마
- 함수 컨벤션:
  - 뷰 컴포넌트(React): `export default function ComponentName()`
  - util/hook/handler: 화살표 함수 `export const fn = () => {}`
- 타입 컨벤션:
  - `interface`: Props, API 요청/응답 등 외부 계약
  - `type`: 유니온/인터섹션 등 내부 타입 조합
