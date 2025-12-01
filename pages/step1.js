import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Step1({ answers, handleChange }) {
  const router = useRouter();

  const jobs = [
    "개발 (Developer)", "디자인 (Designer)", "기획/마케팅 (Planner/Marketer)", "비즈니스/기타 (Business/Etc)"
  ];

  const strengths = [
    "경력의 흐름 (Time-line 중심)", "시각적 결과물 (Image/Video 중심)", 
    "데이터와 성과 (Number/Chart 중심)", "나의 가치관과 이야기 (Text/Essay 중심)"
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
          STEP 1. 구조 설정
        </h2>
        <p className="text-gray-400 mb-8">어떤 포트폴리오를 만들고 싶으신가요?</p>

        {/* Q1. 직무 선택 */}
        <div className="mb-8">
          <label className="block text-lg font-bold text-white mb-3">Q1. 지원하시는 직무 분야를 선택해주세요.</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {jobs.map((job) => (
              <button
                key={job}
                onClick={() => handleChange('job', job)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  answers.job === job 
                    ? 'border-green-400 bg-gray-800 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.3)]' 
                    : 'border-gray-600 bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {job}
              </button>
            ))}
          </div>
        </div>

        {/* Q2. 강점 선택 */}
        <div className="mb-10">
          <label className="block text-lg font-bold text-white mb-3">Q2. 가장 강조하고 싶은 '강점'은?</label>
          <div className="grid grid-cols-1 gap-3">
            {strengths.map((item) => (
              <button
                key={item}
                onClick={() => handleChange('strength', item)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  answers.strength === item 
                    ? 'border-blue-400 bg-gray-800 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.3)]' 
                    : 'border-gray-600 bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* 👇 버튼 영역 수정됨 (이전 버튼 추가) */}
        <div className="flex gap-4">
          <button 
            onClick={() => router.back()}
            className="flex-1 py-3 px-6 rounded-lg bg-gray-700 text-gray-300 font-bold hover:bg-gray-600 transition-colors"
          >
            이전
          </button>

          <Link href="/step2" className="flex-1">
            <button className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold hover:opacity-90 shadow-lg">
              다음 단계 →
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}