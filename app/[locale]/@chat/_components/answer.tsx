import { useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";
import Image from "next/image";

import { LOCALE_KO } from "@/lib/client/constants";

import YoutubePlayer from "react-player";
import PulseLoader from "react-spinners/PulseLoader";

import { PhotoIcon, VideoCameraIcon } from "@heroicons/react/24/solid";
import { Answer as AnswerType } from "@prisma/client";

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
        <div className="answer">
          <p className="whitespace-pre-line">
            <span
              className="font-semibold pr-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              A.
            </span>
            {locale === LOCALE_KO ? chat.contentKo : chat.contentEn}
          </p>
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
              <div
                className="relative mt-3 flex h-[200px] w-full rounded-lg overflow-hidden"
                style={{ backgroundColor: "var(--color-bg-secondary)" }}
              >
                <Image
                  className="object-contain p-1"
                  fill
                  src={`${process.env.NEXT_PUBLIC_GOOGLE_DRIVE_IMG_URL}${chat.mediaUrl}&sz=w300`}
                  alt="referenceImage"
                  sizes="(max-width: 215px) 100vw"
                />
              </div>
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
      )}
    </>
  );
}
