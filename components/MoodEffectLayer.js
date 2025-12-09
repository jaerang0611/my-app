import { useEffect, useState } from 'react';
// motion import는 필요 없으면 지워도 되지만, 혹시 모를 확장성을 위해 남겨둡니다.
// import { motion } from 'framer-motion'; 

// SVG 노이즈 필터 (파일 없이 코드로 질감 생성)
const noiseSVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`;

// 스캔라인 패턴
const scanlineCSS = "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))";

const moodEffects = {
  "#차분한": {
    texture: noiseSVG,
    textureOpacity: 0.05,
    filter: "grayscale(30%) sepia(10%)",
    fontClass: "font-serif"
  },
  "#열정적인": {
    texture: "none",
    textureOpacity: 0,
    filter: "contrast(110%) saturate(120%)",
    fontClass: "font-sans"
  },
  "#신뢰감있는": {
    texture: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
    textureSize: "20px 20px",
    textureOpacity: 0.3,
    filter: "none",
    fontClass: "font-sans"
  },
  "#힙한(Hip)": {
    texture: scanlineCSS,
    textureSize: "100% 4px",
    textureOpacity: 0.3,
    filter: "contrast(110%) hue-rotate(-5deg)",
    fontClass: "font-mono"
  },
  "#창의적인": {
    texture: noiseSVG,
    textureOpacity: 0.07,
    filter: "saturate(110%) brightness(105%)",
    fontClass: "font-sans"
  },
  "#미니멀한": {
    texture: "none",
    textureOpacity: 0,
    filter: "grayscale(100%)",
    fontClass: "font-sans tracking-tight"
  },
  "#클래식한": {
    texture: noiseSVG,
    textureOpacity: 0.08,
    filter: "sepia(40%) contrast(90%)",
    fontClass: "font-serif"
  },
  // 기본값
  "default": {
    texture: "none",
    textureOpacity: 0,
    filter: "none",
    fontClass: "font-sans"
  }
};

export default function MoodEffectLayer({ mood }) {
  const primaryMood = Array.isArray(mood) ? mood[0] : mood;
  const effect = moodEffects[primaryMood] || moodEffects["default"];
  
  // [삭제됨] 마우스 추적 로직 제거

  return (
    <div className={`pointer-events-none fixed inset-0 z-9999 overflow-hidden ${effect.fontClass}`}>
      
      {/* 1. 전체 색감 필터 */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-700"
        style={{ backdropFilter: effect.filter }}
      />

      {/* 2. 질감(Texture) 오버레이 */}
      <div 
        className="fixed inset-0 pointer-events-none transition-opacity duration-700"
        style={{ 
            backgroundImage: effect.texture,
            backgroundSize: effect.textureSize || 'auto',
            opacity: effect.textureOpacity
        }}
      />

      {/* [삭제됨] 커스텀 마우스 커서 제거 */}
    </div>
  );
}