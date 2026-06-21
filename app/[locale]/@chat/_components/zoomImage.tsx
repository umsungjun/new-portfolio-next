"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";
import PulseLoader from "react-spinners/PulseLoader";

import { XMarkIcon } from "@heroicons/react/24/solid";

interface ZoomImageProps {
  zoomSrc: string;
  alt?: string;
  children: ReactNode;
}

/**
 * 자식으로 받은 썸네일을 클릭하면 이미지를 전체화면으로 확대해 보여주는 래퍼.
 * 좁은 채팅 폭(약 288px)에 압축돼 작게 보이는 SVG 목업·참고 이미지의 가독성을 보완한다.
 * `createPortal`로 body 직속에 오버레이를 그려 475px 채팅 컨테이너 밖으로 벗어난다.
 *
 * 확대본(`zoomSrc`)이 썸네일과 다른 원격 이미지(예: 구글 드라이브 고해상도)일 때는 클릭 시점에
 * 처음 네트워크로 받아오므로, hover 시 미리 받아두고(prefetch) 로딩 중 스피너를 보여 체감 지연을 줄인다.
 *
 * @param zoomSrc - 확대 시 표시할 이미지 URL (썸네일과 달라도 됨, 예: 고해상도 변형)
 * @param alt - 확대 이미지의 대체 텍스트
 * @param children - 클릭 트리거로 감쌀 썸네일 미디어 (`<img>` / Next `<Image>` 등)
 * @example
 * <ZoomImage zoomSrc="/images/answers/foo.svg" alt="설명">
 *   <img src="/images/answers/foo.svg" alt="설명" loading="lazy" />
 * </ZoomImage>
 */
export default function ZoomImage({ zoomSrc, alt, children }: ZoomImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefetchedRef = useRef(false);

  // 포털은 클라이언트 마운트 이후에만 생성해 SSR 하이드레이션 불일치를 방지한다.
  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  // 클릭 전 hover/focus 시 확대본을 미리 받아 캐시에 올려둔다(원격 이미지 지연 완화). 한 번만 수행.
  const prefetch = useCallback(() => {
    if (prefetchedRef.current || typeof window === "undefined") return;
    prefetchedRef.current = true;
    const img = new window.Image();
    img.src = zoomSrc;
  }, [zoomSrc]);

  // 모달이 열려 있는 동안: Escape로 닫기, body 스크롤 잠금, 닫기 버튼에 포커스.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  return (
    <>
      <button
        type="button"
        className="lightboxTrigger"
        onClick={() => {
          setIsLoaded(false);
          setIsOpen(true);
        }}
        onMouseEnter={prefetch}
        onFocus={prefetch}
        aria-label={alt ? `${alt} — 확대해서 보기` : "이미지 확대해서 보기"}
      >
        {children}
      </button>

      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="lightboxOverlay"
            role="dialog"
            aria-modal="true"
            aria-label={alt || "확대 이미지"}
            onClick={close}
          >
            <button
              type="button"
              ref={closeButtonRef}
              className="lightboxClose"
              onClick={close}
              aria-label="닫기"
            >
              <XMarkIcon className="size-6" />
            </button>

            {!isLoaded && (
              <div className="lightboxSpinner">
                <PulseLoader
                  color="#e2e8f0"
                  size={10}
                  speedMultiplier={0.8}
                  aria-label="이미지 로딩 중"
                />
              </div>
            )}

            {/* 이미지 자체 클릭은 오버레이로 전파되지 않게 막아 닫히지 않도록 한다. */}
            {/* 캐시된 이미지(SVG 등)는 마운트 시 이미 complete=true라 스피너 깜빡임 없이 바로 표시. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={(node) => {
                if (node?.complete) setIsLoaded(true);
              }}
              className={`lightboxImage${isLoaded ? " is-loaded" : ""}`}
              src={zoomSrc}
              alt={alt ?? ""}
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsLoaded(true)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
