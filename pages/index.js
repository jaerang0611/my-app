import Link from 'next/link';

export default function Home() {
  return (
    // 전체 배경 및 중앙 정렬
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#111]">
      
      {/* 배경 꾸밈 효과 (은은한 빛) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-green-500/20 to-blue-500/20 rounded-full blur-[100px] -z-10"></div>

      <div className="text-center max-w-3xl space-y-8 p-10">
        
        {/* 1. 메인 타이틀 (크고 화려하게) */}
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 leading-tight">
            Mood-Folio
          </span>
        </h1>

        {/* 2. 서브 타이틀 (설명) */}
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
          당신만의 무드가 담긴 포트폴리오, <br className="hidden md:block" />
          <strong className="text-green-400">AI 코칭</strong>과 함께 완성해보세요.
        </p>

        {/* 3. 시작 버튼 (가장 돋보이게) */}
        <div className="mt-12">
          <Link href="/step1">
            <button className="group relative inline-flex items-center px-12 py-5 text-xl font-bold text-black transition-all duration-300 bg-gradient-to-r from-green-400 to-blue-500 rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(74,222,128,0.7)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 ring-offset-[#111]">
              <span className="mr-2">지금 시작하기</span>
              {/* 마우스 올리면 화살표가 움직임 */}
              <span className="transition-transform group-hover:translate-x-2">🚀</span>
              
              {/* 버튼 뒤에 퍼지는 빛 효과 */}
              <div className="absolute inset-0 h-full w-full rounded-full bg-gradient-to-r from-green-400 to-blue-500 blur-md opacity-70 -z-10 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </Link>
        </div>

      </div>
      
      {/* 하단 카피라이트 */}
      <p className="absolute bottom-8 text-gray-600 text-sm">
        © 2025 Mood-Folio Project. All rights reserved.
      </p>
    </div>
  );
}