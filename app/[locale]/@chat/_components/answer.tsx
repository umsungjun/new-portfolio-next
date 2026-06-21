import { useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import { LOCALE_KO } from "@/lib/client/constants";

import ReactMarkdown from "react-markdown";
import YoutubePlayer from "react-player";
import PulseLoader from "react-spinners/PulseLoader";
import rehypeSanitize from "rehype-sanitize";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { PhotoIcon, VideoCameraIcon } from "@heroicons/react/24/solid";
import { Answer as AnswerType } from "@prisma/client";

import ZoomImage from "./zoomImage";

interface AnswerProps {
  isRefresh: boolean;
  locale: string;
  chat: AnswerType;
}

const IMAGE_TYPE = "IMAGE";
const VIDEO_TYPE = "VIDEO";

export default function Answer({ isRefresh, locale, chat }: AnswerProps) {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loaderColor, setLoaderColor] = useState("#94a3b8");
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (loaderRef.current) {
      const color = getComputedStyle(loaderRef.current)
        .getPropertyValue("--color-loader")
        .trim();
      if (color) setLoaderColor(color);
    }
  }, []);

  return (
    <>
      {!isRefresh && isLoading ? (
        <div className="answerLoader" ref={loaderRef}>
          <PulseLoader
            color={loaderColor}
            size={8}
            loading={true}
            speedMultiplier={0.8}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="answerWrapper">
          <div className="answerMark" aria-hidden="true">
            A
          </div>
          <div className="answer">
            <div className="answer-md-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeSanitize]}
                components={{
                  // react-markdown 내부용 node prop만 제외하고 나머지 props는 그대로 전달
                  // (title, className 등 마크다운 링크 속성 보존)
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                  // 인라인 이미지(SVG 목업 등)는 클릭 시 전체화면으로 확대 가능하도록 래핑
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  img: ({ node, ...props }) => {
                    if (!props.src) return null;
                    const altText =
                      typeof props.alt === "string" ? props.alt : "";
                    return (
                      <ZoomImage zoomSrc={String(props.src)} alt={altText}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img {...props} alt={altText} loading="lazy" />
                      </ZoomImage>
                    );
                  },
                }}
              >
                {locale === LOCALE_KO ? chat.contentKo : chat.contentEn}
              </ReactMarkdown>
            </div>
            {/* 참고 이미지 */}
            {chat.mediaType === IMAGE_TYPE && chat.mediaUrl !== null && (
              <div className="">
                <span className="flex items-center gap-1 font-bold">
                  <PhotoIcon
                    className="size-5"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  {t("referenceImage")}
                </span>
                {/* 썸네일과 확대본이 같은 URL(w640)을 공유 → 확대 시 새 요청 없이 캐시된 이미지를 즉시 사용.
                    숫자(w640)를 키우면 확대가 선명해지나 초기 로드가 무거워지고, 줄이면 그 반대. */}
                <ZoomImage
                  zoomSrc={`${process.env.NEXT_PUBLIC_GOOGLE_DRIVE_IMG_URL}${chat.mediaUrl}&sz=w640`}
                  alt={t("referenceImage")}
                >
                  <div
                    className="relative mt-3 flex h-[200px] w-full rounded-lg overflow-hidden"
                    style={{ backgroundColor: "var(--color-bg-secondary)" }}
                  >
                    {/* Next/Image는 최적화 URL을 써서 확대본과 캐시가 갈리므로, 동일 URL 재사용을 위해 일반 img 사용 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="h-full w-full object-contain p-1"
                      src={`${process.env.NEXT_PUBLIC_GOOGLE_DRIVE_IMG_URL}${chat.mediaUrl}&sz=w640`}
                      alt="referenceImage"
                      loading="lazy"
                    />
                  </div>
                </ZoomImage>
              </div>
            )}
            {/* 참고 영상 */}
            {chat.mediaType === VIDEO_TYPE && chat.mediaUrl !== null && (
              <div className="mt-3 flex flex-col gap-3">
                <span className="flex items-center gap-1 font-bold">
                  <VideoCameraIcon
                    className="size-5"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  {t("referenceVideo")}
                </span>
                <div className="videoPlayer flex justify-center ">
                  <YoutubePlayer url={chat.mediaUrl} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
