# Next Portfolio(https://next-umsungjun.vercel.app/ko/home)

<img width="100%" src="https://drive.google.com/thumbnail?id=1_OWiDt2NzD4g2pdq0wdsZsctNaHC5zpu&sz=w1000"/>

## 프로젝트 소개

Next Portfolio는 기존에 React로 개발된 New Portfolio(https://github.com/umsungjun/new_portfolio)를 Next.js로 마이그레이션한 프로젝트입니다.

2년간의 실무 경험을 통해 습득한 기술들을 바탕으로 제작되었으며, 데이터 관리와 렌더링 최적화에 중점을 두었습니다. 실무에서 접할 수 없었던 Next.js를 학습하고 활용하기 위한 목적으로 개발했습니다.

## 기존 React 프로젝트와의 차이점 및 개선점

```
1. 데이터 관리 방식 개선

기존에는 Google Cloud Sheet를 데이터 저장소처럼 활용하였으나, 실무 경험을 쌓으며 데이터베이스를 활용한 관리 방식이 더 효율적이라는 점을 깨달았습니다.

이를 개선하기 위해 Supabase를 도입하여 Question, Answer 테이블을 생성하고 Prisma ORM을 활용하여 데이터 조작을 보다 쉽게 수행할 수 있도록 했습니다.

2. CSR과 SSR의 적절한 조합

SSR(Server-Side Rendering): 웹 화면의 좌측 소개 영역은 SSR을 사용하여 빠르게 렌더링되도록 구현하였습니다.

CSR(Client-Side Rendering): 우측 질문-답변 UI(채팅 영역)은 CSR 방식을 적용하여 사용자와의 상호작용이 원활하도록 구성했습니다.

3. Next.js 활용 극대화

기존 React 프로젝트는 CSR 중심이었지만, Next.js의 서버 컴포넌트 기능을 활용하여 성능과 SEO를 최적화하였습니다.

Next.js의 Metadata API를 사용하여 각 언어별 title, description, keywords를 동적으로 설정하여 SEO를 강화했습니다.
```

### 프로젝트 사용 기술

```
Next.js(15.1.4), TypeScript, Tailwind CSS, Zustand, next-intl, Prisma, Supabase
```

### 폴더 구조

```
├─ app
│  ├─ [locale]
│  │  ├─ home
│  │  │  ├─ @chat
│  │  │  │  ├─ _components
│  │  │  │  │  ├─ answer.tsx
│  │  │  │  │  ├─ question.tsx
│  │  │  │  │  └─ selectQuestion.tsx
│  │  │  │  ├─ _lib
│  │  │  │  │  └─ constants.ts
│  │  │  │  ├─ body.tsx
│  │  │  │  ├─ header.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ @side
│  │  │  │  ├─ _components
│  │  │  │  │  ├─ contactInfo.tsx
│  │  │  │  │  └─ profileSwiper.tsx
│  │  │  │  └─ page.tsx
│  │  │  └─ layout.tsx
│  │  └─ layout.tsx
│  ├─ api
│  │  ├─ answer
│  │  │  └─ route.ts
│  │  └─ question
│  │     └─ route.ts
│  └─ globals.css
├─ components
│  └─ swrProvider.tsx
├─ i18n
│  ├─ loadSpreadSheet.js
│  ├─ request.ts
│  └─ routing.ts
├─ lib
│  ├─ client
│  │  ├─ constants.ts
│  │  └─ type.ts
│  └─ server
│     └─ prisma.ts
├─ messages
│  ├─ en.json
│  └─ ko.json
├─ middleware.ts
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ migrations
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ public
│  ├─ favicon.ico
│  └─ robots.txt
├─ store
│  └─ useChatStore.ts
├─ tailwind.config.ts
└─ tsconfig.json
```

## 커밋 컨벤션

```
Feat : 새로운 기능을 추가하는 경우
Fix : 버그를 고친경우
Docs : 문서를 수정한 경우
Style : 코드 포맷 변경, 세미콜론 누락, 코드 수정이 없는경우
Refactor : 코드 리펙토링
Test : 테스트 코드 추가 및 리팩토링
Chore : 빌드 업무 수정, 패키지 매니저 수정
Design : CSS 등 UI 디자인 변경
Rename : 파일명(or 폴더명) 수정
Remove : 코드(파일) 삭제
```

## 트러블 슈팅 기록

### 1. Hydration failed 오류 해결

```
문제점: .env 파일에서 PUBLIC_PHONE_NUMBER를 사용했을 때 Hydration 오류 발생

해결 방법
- 기존 `.env` 파일에 있었던 상수 `PUBLIC_PHONE_NUMBER`를 `NEXT_PUBLIC_PHONE_NUMBER`로 변경하여 해결
- `NEXT_PUBLIC_PHONE_NUMBER`는 클라이언트에서 접근 가능, `PHONE_NUMBER`는 서버 컴포넌트에서 접근 가능

📌 참고 문서: [Next.js Hydration Error] (https://nextjs.org/docs/messages/react-hydration-error)
```

### 2. next-intl의 getTranslations 작동 오류 해결

```
문제점: 서버 컴포넌트에서 getTranslations() 작동 오류

해결 방법
- getTranslations()에 locale 값을 명시적으로 전달

export default async function Side({ params }: SideProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
}

```

### 3. Next.js 15.2.3에서 generateMetadata 함수 작동 오류 해결

```
문제점: Next.js 15.2.3에서 generateMetadata 함수가 호출되지 않는 문제 발생

해결 방법
- Next.js 버전을 15.1.4로 다운그레이드하여 정상 동작 확인
- Next.js의 Metadata API를 활용하여 SEO 메타데이터를 동적으로 생성하도록 수정
- 다국어 지원을 위해 locale에 따라 title, description, keywords 등을 설정
```
