import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Step4({ answers, handleChange }) {
  const router = useRouter();

  // 처음에 몇 개의 프로젝트 입력창을 보여줄지 결정
  const [visibleProjects, setVisibleProjects] = useState(1);

  // 이미 입력된 데이터가 있다면 그만큼 창을 열어둠 (새로고침 해도 유지)
  useEffect(() => {
    if (answers.project3_title) setVisibleProjects(3);
    else if (answers.project2_title) setVisibleProjects(2);
  }, [answers]);

  // 프로젝트 추가 (최대 3개)
  const handleAddProject = () => {
    if (visibleProjects < 3) {
      setVisibleProjects(prev => prev + 1);
    }
  };

  // 프로젝트 삭제 (마지막 프로젝트부터 삭제)
  const handleRemoveProject = () => {
    if (visibleProjects > 1) {
      // 1. 화면에서 줄이기
      setVisibleProjects(prev => prev - 1);
      
      // 2. 데이터 지우기 (삭제된 칸의 데이터 초기화)
      const targetNum = visibleProjects; // 현재 지워질 번호
      handleChange(`project${targetNum}_title`, '');
      handleChange(`project${targetNum}_desc`, '');
      handleChange(`project${targetNum}_link`, '');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 py-20">
      <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
          STEP 4. 핵심 경력
        </h2>
        <p className="text-gray-400 mb-8">포트폴리오에 들어갈 알맹이를 채워주세요.</p>

        {/* Q6. 경력 요약 */}
        <div className="mb-12">
          <label className="block text-lg font-bold text-white mb-3">Q6. 핵심 경력 요약</label>
          <p className="text-sm text-gray-500 mb-2">기존 이력서의 '경력 기술' 부분을 복사해서 붙여넣어 주세요.</p>
          <textarea 
            rows="6"
            placeholder="예: - OO 프로젝트 프론트엔드 리딩 (2023.01 ~ 2023.12)\n- 성능 최적화를 통해 로딩 속도 50% 개선"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            value={answers.career_summary || ''} 
            onChange={(e) => handleChange('career_summary', e.target.value)}
          />
        </div>

        {/* Q7. 대표 프로젝트 (동적 추가/삭제) */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-lg font-bold text-white">Q7. 대표 프로젝트</label>
            <span className="text-sm text-gray-400">({visibleProjects}/3)</span>
          </div>
          
          {/* 프로젝트 리스트 반복 */}
          {[1, 2, 3].slice(0, visibleProjects).map((num) => (
            <div key={num} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-6 animate-fade-in-up relative">
              
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-green-400 font-bold">📂 프로젝트 {num}</h4>
                
                {/* 🗑️ 삭제 버튼: 1번이 아니고, 가장 마지막 항목일 때만 보임 */}
                {num > 1 && num === visibleProjects && (
                  <button 
                    onClick={handleRemoveProject}
                    className="text-xs bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-colors"
                  >
                    삭제 🗑️
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <input 
                  type="text" 
                  placeholder="프로젝트명" 
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-green-400"
                  value={answers[`project${num}_title`] || ''} 
                  onChange={(e) => handleChange(`project${num}_title`, e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="간단 설명 (50자 내외)" 
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-green-400"
                  value={answers[`project${num}_desc`] || ''} 
                  onChange={(e) => handleChange(`project${num}_desc`, e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="참조 링크 (URL)" 
                  className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-green-400"
                  value={answers[`project${num}_link`] || ''} 
                  onChange={(e) => handleChange(`project${num}_link`, e.target.value)}
                />
              </div>
            </div>
          ))}

          {/* 프로젝트 추가 버튼 (3개 미만일 때만 보임) */}
          {visibleProjects < 3 && (
            <button 
              onClick={handleAddProject}
              className="w-full py-3 border-2 border-dashed border-gray-600 text-gray-400 rounded-xl hover:border-green-400 hover:text-green-400 transition-all font-bold"
            >
              + 프로젝트 추가하기
            </button>
          )}
        </div>

        {/* 네비게이션 */}
        <div className="flex gap-4">
          <button onClick={() => router.back()} className="flex-1 py-3 px-6 rounded-lg bg-gray-700 text-gray-300 font-bold hover:bg-gray-600">
            이전
          </button>
          <Link href="/step5" className="flex-1">
            <button className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold hover:opacity-90 shadow-lg">
              다음 단계 →
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}