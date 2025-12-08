import React from 'react';
import HeroSection from '../components/HeroSection';

export default function Step1({ answers, handleChange }) {
  // HeroSection에게 데이터 관리 함수를 넘겨줍니다.
  return (
    <div className="min-h-screen bg-[#1a2e35]">
      <HeroSection answers={answers} handleChange={handleChange} />
    </div>
  );
}