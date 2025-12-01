import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Step3({ answers, handleChange }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
          STEP 3. 기본 정보
        </h2>
        <p className="text-gray-400 mb-8">연락처와 기본 인적사항을 입력해주세요.</p>

        {/* 입력 필드 모음 */}
        <div className="space-y-6 mb-10">
          
          {/* 이름 */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">이름</label>
            <input 
              type="text" 
              placeholder="홍길동" 
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              value={answers.name || ''} 
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          {/* 한 줄 소개 */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">한 줄 소개</label>
            <input 
              type="text" 
              placeholder="예: 3년차 프론트엔드 개발자 김코딩입니다" 
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              value={answers.intro || ''} 
              onChange={(e) => handleChange('intro', e.target.value)}
            />
          </div>

          {/* 연락처 & 이메일 (반반 나누기) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">연락처</label>
              <input 
                type="text" 
                placeholder="010-0000-0000" 
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                value={answers.phone || ''} 
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">이메일</label>
              <input 
                type="text" 
                placeholder="email@example.com" 
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                value={answers.email || ''} 
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </div>

          {/* 링크 */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">관련 링크 (선택)</label>
            <input 
              type="text" 
              placeholder="GitHub, LinkedIn, Blog URL 등" 
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              value={answers.link || ''} 
              onChange={(e) => handleChange('link', e.target.value)}
            />
          </div>

        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <button onClick={() => router.back()} className="flex-1 py-3 px-6 rounded-lg bg-gray-700 text-gray-300 font-bold hover:bg-gray-600">
            이전
          </button>
          <Link href="/step4" className="flex-1">
            <button className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold hover:opacity-90 shadow-lg">
              다음 단계 →
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}