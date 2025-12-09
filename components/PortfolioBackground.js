import React from 'react';
import { motion } from 'framer-motion';
// moodColorMap 경로가 components/templates 안에 있다면 아래 경로가 맞습니다.
// 만약 에러가 난다면 경로를 확인해주세요.
import { getStyleByMood } from './templates/moodColorMap'; 

export default function PortfolioBackground({ moods }) {
  // 선택된 무드에 따른 스타일 가져오기
  const style = getStyleByMood(moods);

  // 그라데이션 클래스에서 색상 정보만 추출하거나, 
  // moodColorMap의 glowColor를 활용하여 배경 톤을 결정합니다.
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-gray-50 dark:bg-gray-900 transition-colors duration-700">
      
      {/* 1. 기본 배경 그라데이션 (은은하게 깔림) */}
      <div className={`absolute inset-0 opacity-10 bg-linear-to-br ${style.headerGradient}`}></div>

      {/* 2. 움직이는 오로라 효과 (블러된 원) */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1], 
          opacity: [0.3, 0.5, 0.3],
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-30"
        style={{ backgroundColor: style.glowColor }}
      />

      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2], 
          opacity: [0.2, 0.4, 0.2],
          x: [0, -100, 0],
          y: [0, 50, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
        style={{ backgroundColor: style.glowColor }}
      />

      {/* 3. 노이즈 텍스처 (질감 추가) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
      
    </div>
  );
}