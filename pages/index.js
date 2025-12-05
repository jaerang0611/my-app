import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [moodOn, setMoodOn] = useState(true);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-700 ${moodOn ? 'bg-[#111] text-white' : 'bg-gray-100 text-black'}`}>
      
      <div className="text-center space-y-8 mb-16 animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
          커리어에 <span className={moodOn ? "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500" : "text-black"}>Mood</span>를 켜다,
          <br /><span className="block mt-2">MoodFolio</span>
        </h1>

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

      <div className="w-full max-w-sm space-y-6">
        <Link href="/signup">
          <button className="w-full py-4 rounded-xl border-2 border-dashed border-gray-500 text-gray-400 font-bold hover:border-green-400 hover:text-green-400 transition-all flex items-center justify-center gap-2 group">
            <span>📧</span> 이메일로 시작하기
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </Link>

        <div className="text-center">
           <Link href="/login" className="text-sm text-gray-500 underline hover:text-green-400 transition-colors">
             이미 계정이 있으신가요? 로그인
           </Link>
        </div>
      </div>

      <p className="absolute bottom-6 text-gray-600 text-xs">© 2025 MoodFolio. All rights reserved.</p>
    </div>
  );
}