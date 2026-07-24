"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

/* swiper css */
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

/* Swiper의 loop 모드를 사용하려면 최소 5장 이상의 이미지가 필요 */
const googleImgId = [
  "1mHmEA6_u4HVNLZE-P8SeiyJUOw4VWY6P",
  "1mqLoHWEo5l-xD8fNnn6BXhM-SpX13sG4",
  "1pND2J6AogJTsuOR6L3PGMlTaM5Ck6TVF",
];

export default function ProfileSwiper() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  /* 숨김 상태에서 초기화된 Swiper 재마운트용 key */
  const [swiperKey, setSwiperKey] = useState(0);

  /* display:none 상태에서 초기화된 Swiper는 카드 위치 계산이 틀어지므로, 숨김(폭 0) → 노출 전환 시 재마운트하여 레이아웃 재계산 (@side와 모바일 히어로가 브레이크포인트에 따라 교차 노출되는 구조 대응) */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    let wasHidden = el.offsetWidth === 0;
    const observer = new ResizeObserver(() => {
      const hidden = el.offsetWidth === 0;
      if (wasHidden && !hidden) setSwiperKey((prev) => prev + 1);
      wasHidden = hidden;
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef}>
      <Swiper
        key={swiperKey}
        effect={"cards"}
        modules={[EffectCards]}
        className="w-[215px] h-[286px]"
        loop={false}
        /* 커서 끌기 여부 */
        grabCursor={true}
        /* 클릭 슬라이드 이동 여부 */
        slideToClickedSlide={true}
      >
        {googleImgId.map((imgId, index) => {
          return (
            <SwiperSlide
              key={`${index}+${imgId}`}
              className="relative w-[215px] h-[290px] rounded-2xl overflow-hidden"
            >
              <Image
                fill
                src={`${process.env.NEXT_PUBLIC_GOOGLE_DRIVE_IMG_URL}${imgId}&sz=w250`}
                priority={true}
                alt="profile"
                sizes="(max-width: 215px) 100vw"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
