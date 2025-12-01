import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Step5({ answers, handleChange }) {
  const router = useRouter();

  const options = [
    { label: "문장 다듬기가 어려워요", desc: "자소서/경력기술서 윤문 요청" },
    { label: "어떤 내용을 강조할지 모르겠어요", desc: "강점 발굴 요청" },
    { label: "면접 질문이 궁금해요", desc: "예상 질문 추출 요청" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
          STEP 5. AI 코칭 설정
        </h2>
        <p className="text-gray-400 mb-8">가장 고민되는 점을 선택하면 AI가 도와줍니다.</p>

        {/* Q8. 고민 선택 */}
        <div className="mb-12">
          <label className="block text-lg font-bold text-white mb-4">Q8. 현재 가장 고민되는 점은?</label>
          <div className="grid grid-cols-1 gap-4">
            {options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => handleChange('ai_request', opt.label)}
                className={`p-5 rounded-xl border text-left transition-all flex flex-col ${
                  answers.ai_request === opt.label 
                    ? 'border-purple-400 bg-gray-800 text-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.4)]' 
                    : 'border-gray-600 bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span className="text-lg font-bold mb-1">{opt.label}</span>
                <span className="text-sm opacity-70">👉 {opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <button onClick={() => router.back()} className="flex-1 py-3 px-6 rounded-lg bg-gray-700 text-gray-300 font-bold hover:bg-gray-600">
            이전
          </button>
          
          {/* 완료 페이지로 이동 */}
          <Link href="/complete" className="flex-1">
            <button className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 shadow-lg">
              설정 완료 & 제출하기 ✨
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}