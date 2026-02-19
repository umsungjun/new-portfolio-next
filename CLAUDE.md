# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Next.js 15 풀스택 포트폴리오 애플리케이션 (React에서 마이그레이션). 사용자가 미리 정의된 질문을 선택하면 애니메이션과 함께 답변(선택적 미디어 포함)이 표시되는 채팅 스타일 UI. Vercel에 배포: https://next-umsungjun.vercel.app/

## 명령어

- `npm run dev` — Turbopack 개발 서버
- `npm run build` — Prisma 클라이언트 생성 후 빌드 (`prisma generate && next build`)
- `npm run lint` — ESLint 실행
- `npm run prettier` — Prettier로 전체 파일 포맷팅
- `npm run download:i18n` — Google Sheets에서 번역 파일을 `messages/` 디렉토리로 동기화 (`i18n/credentials.js` Google 서비스 계정 파일 필요, `.gitignore`에 포함됨)
- `npx prisma migrate dev` — DB 스키마 변경 후 마이그레이션 실행 (`DIRECT_URL` 환경 변수 필요)
- `npx prisma studio` — DB 데이터 확인/편집 GUI

**테스트:** 테스트 프레임워크 미설정 (Jest/Vitest 없음)

## 기술 스택

- **프레임워크:** Next.js 15, React 19, TypeScript (strict 모드)
- **스타일링:** Tailwind CSS 3 (커스텀 브레이크포인트 `web: 1055px`) + CSS 변수 기반 테마
- **상태 관리:** Zustand — `useChatStore` (sessionStorage 영속), `useThemeStore` (URL `?theme=` 파라미터 영속)
- **데이터 페칭:** SWR (클라이언트), Prisma 7 + PostgreSQL/Supabase (서버)
- **i18n:** next-intl — 한국어(기본) 및 영어, URL에 항상 locale 접두사 포함
- **폰트:** Pretendard Variable (layout에서 CDN으로 로드)

## 아키텍처

### 라우팅 & 렌더링

모든 페이지는 `app/[locale]/` 하위에 위치. 미들웨어(`middleware.ts`)가 `/` 및 locale만 있는 경로를 `/[locale]/home`으로 리다이렉트.

홈 페이지는 **Next.js 병렬 라우트** 사용:
- `@chat/` — 클라이언트 사이드 렌더링 채팅 인터페이스 (475px 고정 너비)
- `@side/` — 서버 사이드 렌더링 프로필/연락처 섹션 (1055px 미만에서 숨김)

### API 라우트

- `GET /api/question` — ID 순으로 정렬된 전체 질문 반환
- `POST /api/answer` — `{ id: number }`를 받아 해당 질문의 답변 반환

둘 다 `{ success: boolean, data: T[] }` 형태로 응답.

### 데이터베이스 (Prisma + Supabase PostgreSQL)

스키마: `prisma/schema.prisma` — `Question` → 다수의 `Answer` 보유 (cascade 삭제). Answer는 선택적으로 `mediaUrl`(Google Drive 파일 ID)과 `mediaType`(IMAGE | VIDEO)을 가질 수 있음.

Prisma 클라이언트는 `lib/server/prisma.ts`에서 **싱글톤 패턴**을 사용하여 개발 핫 리로드 시 커넥션 누적 방지. Supabase pgBouncer를 통한 커넥션 풀링에 `@prisma/adapter-pg` 사용.

### 채팅 흐름

1. `SelectQuestion`이 SWR로 질문을 가져오고, 이미 질문한 항목을 필터링
2. 사용자가 질문 클릭 → Zustand 스토어에 추가 → POST `/api/answer`로 답변 페칭
3. 답변은 1초 로딩 애니메이션 후 텍스트 + 선택적 미디어 표시
4. 채팅 기록은 sessionStorage 기반 Zustand 스토어에 저장 (세션마다 초기화)
5. 초기 인사 메시지 2개는 하드코딩(ID 998, 999)으로 DB 조회 없이 스토어 초기값으로 설정

미디어 렌더링: 이미지는 Next.js `<Image>` (Google Drive 원격 패턴 허용), 동영상은 `react-player`. 프로필 이미지 슬라이더는 Swiper 사용.

### 멀티 테마 시스템

5가지 테마 지원: Light(기본), Dark, Ocean, Rose, Forest.

- `app/globals.css`에서 `[data-theme]` 속성 선택자로 CSS 변수 정의 (`--color-bg-*`, `--color-text-*`, `--color-border-*` 등)
- Light/Dark: 전체 CSS 변수 독립 정의, Ocean/Rose/Forest: Light 기반 포인트 컬러 오버라이드
- `components/themeProvider.tsx`가 `<html data-theme="...">` 속성 및 0.3초 전환 관리
- `components/themeToggle.tsx`가 컬러 스와치 드롭다운 UI 제공
- `store/useThemeStore.ts`에서 상태 관리, URL `?theme=` 파라미터로 영속 (localStorage 미사용)

### i18n

- 라우팅 설정: `i18n/routing.ts` — 래핑된 Next.js 네비게이션 API 내보냄 (Link, redirect, usePathname, useRouter). next/navigation 대신 이 파일에서 import 해야 함.
- 서버 요청 설정: `i18n/request.ts`
- 번역 파일: `messages/ko.json`, `messages/en.json` (총 19개 키)
- DB 콘텐츠는 이중 언어: `contentKo` / `contentEn` 필드, 컴포넌트에서 locale에 따라 선택
- `lib/client/constants.ts`에 `LOCALE_KO`, `LOCALE_EN`, `SUPPORTED_LOCALES` 상수 정의

### 코드 구조 컨벤션

- `_components/` — 라우트 전용 컴포넌트 (해당 경로에만 사용, colocate)
- `_lib/` — 라우트 전용 유틸/상수
- `components/` (루트) — 앱 전역 공유 컴포넌트
- `lib/client/` — 클라이언트용 타입/상수 (`type.ts`, `constants.ts`)
- `lib/server/` — 서버 전용 모듈 (Prisma 싱글톤 등)

### 공유 컴포넌트 (`components/`)

- `swrProvider.tsx` — SWR 전역 설정 프로바이더
- `themeProvider.tsx` — `data-theme` 속성 및 테마 전환 관리
- `themeToggle.tsx` — 테마 선택 드롭다운 UI
- `channelTalk.tsx` — Channel.io 채팅 위젯 초기화

### 환경 변수

클라이언트 (`NEXT_PUBLIC_`): `PHONE_NUMBER`, `MAIL`, `GOOGLE_DRIVE_IMG_URL`, `CHANNEL_PLUGIN_KEY`
서버: `DATABASE_URL` (풀링), `DIRECT_URL` (마이그레이션)

## 커밋 컨벤션

한국어 커밋 메시지, 접두사: `Feat`, `Fix`, `Docs`, `Style`, `Refactor`, `Test`, `Chore`, `Design`, `Rename`, `Remove`

## 코드 스타일

- Prettier: 큰따옴표, 2칸 들여쓰기, trailing comma ES5
- `@trivago/prettier-plugin-sort-imports`로 import 순서 강제: CSS → React → Next → `@/` 별칭 → node_modules → 상대 경로
- 경로 별칭: `@/*`는 프로젝트 루트에 매핑
