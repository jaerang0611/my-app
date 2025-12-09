import Link from 'next/link';
import { useRouter } from 'next/router';

// 👇 triggerChatbot 도구를 받아옵니다.
export default function Step5({ answers, handleChange, triggerChatbot }) {
  const router = useRouter();

  // 옵션별 챗봇 반응 메시지 설정
  const options = [
    { label: "문장 다듬기가 어려워요", desc: "자소서/경력기술서 윤문 요청", 
      reaction: "✍️ 문장 다듬기? 제가 전문입니다!" },
    { label: "어떤 내용을 강조할지 모르겠어요", desc: "강점 발굴 요청", 
      reaction: "💎 숨겨진 강점, 제가 찾아드릴게요!" },
    { label: "면접 질문이 궁금해요", desc: "예상 질문 추출 요청", 
      reaction: "🧐 면접관의 마음을 읽어드릴게요!" },
  ];

  const handleSelect = (label, reaction) => {
    // 1. 데이터 저장
    handleChange('ai_request', label);
    // 2. ✨ 챗봇 말풍선 띄우기!
    triggerChatbot(reaction);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 py-20">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-400 to-blue-500 mb-2">
          STEP 5. AI 코칭 설정
        </h2>
        <p className="text-gray-400 mb-8">가장 고민되는 점을 선택하면 AI가 도와줍니다.</p>

        <div className="mb-12">
          <label className="block text-lg font-bold text-white mb-4">Q8. 현재 가장 고민되는 점은?</label>
          <div className="grid grid-cols-1 gap-4">
            {options.map((opt) => (
              <button
                key={opt.label}
                // 👇 클릭 시 선택과 동시에 말풍선 발사!
                onClick={() => handleSelect(opt.label, opt.reaction)}
                className={`p-5 rounded-xl border text-left transition-all flex flex-col ${
                  answers.ai_request === opt.label 
                    ? 'border-purple-400 bg-gray-800 text-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.4)] scale-105' 
                    : 'border-gray-600 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:border-gray-500'
                }`}
              >
                <span className="text-lg font-bold mb-1">{opt.label}</span>
                <span className="text-sm opacity-70">👉 {opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => router.back()} className="flex-1 py-3 px-6 rounded-lg bg-gray-700 text-gray-300 font-bold hover:bg-gray-600">
            이전
          </button>
          <Link href="/complete" className="flex-1">
            <button className="w-full py-3 px-6 rounded-lg bg-linear-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 shadow-lg">
              설정 완료 & 제출하기 ✨
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}