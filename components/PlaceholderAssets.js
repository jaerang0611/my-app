import React from "react";
import Image from "next/image";

// 1. 배경
export const LayerBack = () => (
  <div className="absolute inset-0 w-full h-full">
    <Image
      src="/forest-bg.webp"
      alt="Forest Background"
      layout="fill"
      objectFit="cover"
      className="opacity-50"
      priority
    />
  </div>
);

// 2. 왼쪽 나무
export const TreeLeft = () => (
  <div className="relative w-full h-full">
    <Image
      src="/tree-left.png"
      alt="Left Tree"
      layout="fill"
      objectFit="cover"
      objectPosition="right top"
      priority
    />
  </div>
);

// 3. 오른쪽 나무
export const TreeRight = () => (
  <div className="relative w-full h-full">
    <Image
      src="/tree-right.png"
      alt="Right Tree"
      layout="fill"
      objectFit="cover"
      objectPosition="left top"
      priority
    />
  </div>
);

// 4. [수정됨] 바닥
export const GroundFront = () => (
  <div className="relative w-full h-full">
    <Image
      src="/ground-front.png" // 확장자(.png 또는 .jpg) 꼭 확인해주세요!
      alt="Forest Ground"
      layout="fill"
      // [핵심] cover로 꽉 채우되, 'top'을 기준으로 정렬하여 윗부분 잘림 방지
      objectFit="cover"
      objectPosition="bottom" 
      priority
    />
  </div>
);