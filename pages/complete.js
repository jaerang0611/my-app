import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

export default function Complete({ answers, resetAnswers }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  // 1. 저장 후 나가기
  const handleSaveAndExit = () => {
    console.log("데이터 저장 완료:", answers);
    alert("저장되었습니다! (시뮬레이션)");
    resetAnswers(); 
    router.push('/'); 
  };

  // 2. 저장 안 하고 나가기
  const handleDiscardAndExit = () => {
    resetAnswers(); 
    router.push('/'); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#111] text-white py-20">
      <div className="w-full max-w-3xl">
        
        {/* 상단 메시지 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            All Set! 🚀
          </h1>
          <p className="text-gray-400 text-lg">
            작성하신 내용을 확인해주세요.<br/>이대로 AI 분석을 시작하시겠습니까?
          </p>
        </div>

        {/* 📝 요약 카드 */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl mb-10">
          
          {/* 기본 정보 */}
          <div className="border-b border-gray-800 pb-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-bold text-green-400 bg-green-900/30 rounded-full mb-2">
                  {answers.job || '직무 미선택'}
                </span>
                <h2 className="text-3xl font-bold text-white">{answers.name || '이름 없음'}</h2>
                <p className="text-gray-400 mt-1">{answers.intro || '한 줄 소개 없음'}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>{answers.email}</p>
                <p>{answers.phone}</p>
              </div>
            </div>
          </div>

          {/* 무드 & 강점 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Mood & Vibe</h3>
              <div className="flex flex-wrap gap-2">
                {(answers.moods || []).map((mood, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-900/40 text-purple-300 rounded-lg text-sm border border-purple-500/30">
                    {mood}
                  </span>
                ))}
                {(!answers.moods || answers.moods.length === 0) && <span className="text-gray-600">-</span>}
              </div>
              <p className="text-xs text-gray-500 mt-2">🎵 BGM: {answers.bgm || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Main Strength</h3>
              <p className="text-blue-300 font-medium">
                {answers.strength ? `🎯 ${answers.strength}` : '-'}
              </p>
            </div>
          </div>

          {/* 경력 요약 */}
          <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase">Career & Projects</h3>
            <div className="mb-6">
              <h4 className="text-white font-bold mb-2 text-sm">📌 경력 요약</h4>
              <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                {answers.career_summary || '입력된 경력이 없습니다.'}
              </p>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(num => (
                answers[`project${num}_title`] && (
                  <div key={num} className="border-l-2 border-green-500 pl-4">
                    <h5 className="text-white font-bold text-sm">{answers[`project${num}_title`]}</h5>
                    <p className="text-gray-400 text-xs mt-1">{answers[`project${num}_desc`]}</p>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* AI 요청 */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-bold block mb-1">AI Request</span>
              <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                {answers.ai_request || '선택 안 함'}
              </span>
            </div>
            <span className="text-2xl">🤖</span>
          </div>
        </div>

        {/* 👇 버튼 위치 변경 완료 (AI 분석이 왼쪽 / 수정하기가 오른쪽) */}
        <div className="flex gap-4 justify-center">
          {/* 메인 버튼: AI 분석 시작 */}
          <button 
            onClick={() => alert("3교시(FastAPI)에서 기능을 붙일 예정입니다!")}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold hover:opacity-90 shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-all transform hover:scale-105"
          >
            AI 분석 시작하기 ⚡
          </button>

          {/* 서브 버튼: 수정하기 */}
          <button 
            onClick={() => router.back()} 
            className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-all font-bold"
          >
            수정하기
          </button>
        </div>

        {/* 처음으로 돌아가기 */}
        <div className="mt-8 text-center">
            <button 
              onClick={() => setShowModal(true)} 
              className="text-gray-600 hover:text-white underline text-sm"
            >
              처음으로 돌아가기
            </button>
        </div>
      </div>

      {/* 팝업 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">처음으로 돌아가시겠어요?</h3>
            <p className="text-gray-400 mb-8">작성한 내용은 사라질 수 있습니다.</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleSaveAndExit} className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-black font-bold">💾 저장 후 처음으로</button>
              <button onClick={handleDiscardAndExit} className="w-full py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">🗑️ 저장 안 함 (초기화)</button>
              <button onClick={() => setShowModal(false)} className="w-full py-3 rounded-lg text-gray-500 hover:text-white mt-2">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}