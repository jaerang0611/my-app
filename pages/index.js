import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [moodOn, setMoodOn] = useState(true); // 무드 스위치 (Dark/Light)

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-700 ${moodOn ? 'bg-[#111] text-white' : 'bg-gray-100 text-black'}`}>
      
      {/* 1. 타이틀 & 스위치 */}
      <div className="text-center space-y-8 mb-16 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
          커리어에 <span className={moodOn ? "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500" : "text-black"}>Mood</span>를 켜다,
          <br /><span className="block mt-2">MoodFolio</span>
        </h1>

        {/* 무드 스위치 UI */}
        <div className="flex items-center justify-center gap-4">
          <span className="text-xl font-bold text-gray-500">OFF</span>
          <button 
            onClick={() => setMoodOn(!moodOn)}
            className={`w-20 h-10 rounded-full p-1 shadow-inner transition-colors duration-300 ${moodOn ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <div className={`bg-white w-8 h-8 rounded-full shadow-lg transform transition-transform duration-300 ${moodOn ? 'translate-x-10' : ''}`}></div>
          </button>
          <span className={`text-xl font-bold ${moodOn ? 'text-green-400' : 'text-gray-500'}`}>MOOD ON</span>
        </div>
      </div>

      {/* 2. 로그인 섹션 */}
      <div className="w-full max-w-sm space-y-6">
        <p className="text-center text-gray-500 font-medium">⚡️ SNS 계정으로 3초 만에 시작하기</p>
        
        {/* SNS 버튼 (UI만) */}
        <div className="grid grid-cols-4 gap-4">
          <button className="h-14 bg-white text-black rounded-2xl border border-gray-200 text-xl font-bold hover:scale-105 transition-transform">G</button>
          <button className="h-14 bg-black text-white rounded-2xl border border-gray-700 text-xl font-bold hover:scale-105 transition-transform"></button>
          <button className="h-14 bg-[#FEE500] text-[#3c1e1e] rounded-2xl text-sm font-bold hover:scale-105 transition-transform">TALK</button>
          <button className="h-14 bg-[#03C75A] text-white rounded-2xl text-xl font-bold hover:scale-105 transition-transform">N</button>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-600"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className={`px-2 ${moodOn ? 'bg-[#111] text-gray-500' : 'bg-gray-100 text-gray-400'}`}>Or</span></div>
        </div>

        {/* 이메일 가입 버튼 */}
        <Link href="/signup">
          <button className="w-full py-4 rounded-xl border-2 border-dashed border-gray-500 text-gray-400 font-bold hover:border-green-400 hover:text-green-400 transition-all flex items-center justify-center gap-2 group">
            <span>📧</span> 이메일로 시작하기
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </Link>

        {/* 로그인 링크 */}
        <div className="text-center">
           <Link href="/login" className="text-sm text-gray-500 underline hover:text-green-400 transition-colors">
             이미 계정이 있으신가요?
           </Link>
        </div>
      </div>

      <p className="absolute bottom-6 text-gray-600 text-xs">© 2025 MoodFolio. All rights reserved.</p>
    </div>
  );
}