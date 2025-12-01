import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Step2({ answers, handleChange }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        
        {/* 제목 */}
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
          Step 2
        </h2>
        <p className="text-gray-400 mb-8">
          연락 받으실 <strong>이메일 주소</strong>를 알려주세요.
        </p>

        {/* 입력창 (여기만 내용이 바뀝니다) */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">이메일</label>
          <input 
            type="text" 
            placeholder="example@email.com" 
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
            
            // 👇 데이터 연결 (Key: email)
            value={answers.email || ''} 
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <button 
            onClick={() => router.back()}
            className="flex-1 py-3 px-6 rounded-lg bg-gray-700 text-gray-300 font-bold hover:bg-gray-600 transition-colors"
          >
            이전
          </button>

          <Link href="/step3" className="flex-1">
            <button className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(52,211,153,0.5)]">
              다음 단계 →
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}