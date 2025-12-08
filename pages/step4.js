import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Step4({ answers, handleChange }) {
  const router = useRouter();
  const isDesigner = answers.job?.includes("디자인") || answers.job?.includes("Designer");

  // [일반용] 프로젝트 개수 관리
  const [visibleProjects, setVisibleProjects] = useState(1);
  useEffect(() => {
    if (answers.project3_title) setVisibleProjects(3);
    else if (answers.project2_title) setVisibleProjects(2);
  }, [answers]);

  const handleAddProject = () => { if (visibleProjects < 3) setVisibleProjects(prev => prev + 1); };
  const handleRemoveProject = () => {
    if (visibleProjects > 1) {
      setVisibleProjects(prev => prev - 1);
      const targetNum = visibleProjects;
      handleChange(`project${targetNum}_title`, '');
      handleChange(`project${targetNum}_desc`, '');
      handleChange(`project${targetNum}_link`, '');
    }
  };

  // 🖼️ [핵심] 파일 업로드 핸들러 (이미지를 텍스트로 변환)
  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB 제한
        alert("이미지 용량이 너무 큽니다! (2MB 이하로 올려주세요)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(key, reader.result); // Base64 문자열로 저장
      };
      reader.readAsDataURL(file);
    }
  };

  // 다음 단계 검증
  const handleNext = (e) => {
    if (isDesigner) {
      let count = 0;
      for (let i = 1; i <= 6; i++) {
        // 제목이 있고 + (링크가 있거나 OR 파일이 있거나)
        if (answers[`design_project${i}_title`] && 
           (answers[`design_project${i}_link`] || answers[`design_project${i}_file`])) {
          count++;
        }
      }
      if (count < 6) {
        e.preventDefault();
        alert(`🎨 디자이너 포트폴리오는 시각 자료가 생명입니다!\n\n현재 ${count}/6개 작성되었습니다.\n6칸을 모두 채워주세요.`);
      }
    } else {
      if (!answers.project1_title) {
        e.preventDefault();
        alert("최소 1개의 프로젝트는 입력해주세요!");
      }
    }
  };

  // [디자인용] 입력 개수 계산
  const filledCount = [1, 2, 3, 4, 5, 6].filter(i => 
    answers[`design_project${i}_title`] && 
    (answers[`design_project${i}_link`] || answers[`design_project${i}_file`])
  ).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 py-20">
      <div className="w-full max-w-5xl bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-400 to-blue-500 mb-2">
          STEP 4. {isDesigner ? "디자인 갤러리 구성" : "핵심 경력"}
        </h2>
        <p className="text-gray-400 mb-8">
          {isDesigner 
            ? "작품 6개를 선정하여 링크 또는 이미지를 등록해주세요." 
            : "포트폴리오에 들어갈 알맹이를 채워주세요."}
        </p>

        {/* Q6. 경력 요약 */}
        <div className="mb-12">
          <label className="block text-lg font-bold text-white mb-3">Q6. 핵심 경력 요약</label>
          <textarea 
            rows="4"
            placeholder="주요 경력 사항을 입력하세요..."
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            value={answers.career_summary || ''} 
            onChange={(e) => handleChange('career_summary', e.target.value)}
          />
        </div>

        {/* 🎨 [디자이너 모드] */}
        {isDesigner ? (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6 bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
              <div>
                <strong className="text-blue-300 block mb-1">📢 디자이너 미션</strong>
                <span className="text-sm text-gray-300">이미지 파일이나 URL 중 편한 방식을 선택하세요.</span>
              </div>
              <span className={`text-2xl font-bold ${filledCount === 6 ? 'text-green-400' : 'text-orange-400'}`}>
                {filledCount} / 6
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-500">WORK 0{num}</span>
                    {/* 상태 표시 뱃지 */}
                    {(answers[`design_project${num}_link`] || answers[`design_project${num}_file`]) && 
                      <span className="text-xs bg-green-900 text-green-400 px-2 py-1 rounded">✔ 완료</span>}
                  </div>
                  
                  {/* 제목 입력 */}
                  <input 
                    type="text" 
                    placeholder="작품 제목" 
                    className="w-full px-3 py-2 mb-3 rounded bg-gray-900 border border-gray-600 text-white text-sm focus:border-blue-400 focus:outline-none"
                    value={answers[`design_project${num}_title`] || ''} 
                    onChange={(e) => handleChange(`design_project${num}_title`, e.target.value)}
                  />

                  {/* 탭: 링크 vs 파일 */}
                  <div className="flex gap-2 mb-2 text-xs">
                    <button 
                      onClick={() => handleChange(`design_type_${num}`, 'link')}
                      className={`flex-1 py-1 rounded ${!answers[`design_type_${num}`] || answers[`design_type_${num}`] === 'link' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                    >
                      🔗 링크
                    </button>
                    <button 
                      onClick={() => handleChange(`design_type_${num}`, 'file')}
                      className={`flex-1 py-1 rounded ${answers[`design_type_${num}`] === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                    >
                      🖼️ 파일
                    </button>
                  </div>

                  {/* 입력창 (조건부 렌더링) */}
                  {answers[`design_type_${num}`] === 'file' ? (
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, `design_project${num}_file`)}
                        className="w-full text-xs text-gray-400 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
                      />
                      {/* 이미지 미리보기 */}
                      {answers[`design_project${num}_file`] && (
                        <img src={answers[`design_project${num}_file`]} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg border border-gray-600" />
                      )}
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-white text-sm focus:border-blue-400 focus:outline-none"
                      value={answers[`design_project${num}_link`] || ''} 
                      onChange={(e) => handleChange(`design_project${num}_link`, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* [일반 모드] 기존 유지 */
          <div className="mb-10">
            {/* ... 기존 일반 모드 코드 ... (공간 절약을 위해 생략, 아까 그 코드 그대로 두시면 됩니다!) */}
             <div className="flex justify-between items-center mb-4">
              <label className="block text-lg font-bold text-white">Q7. 대표 프로젝트</label>
              <span className="text-sm text-gray-400">({visibleProjects}/3)</span>
            </div>
            {[1, 2, 3].slice(0, visibleProjects).map((num) => (
              <div key={num} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 mb-6 animate-fade-in-up relative">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-green-400 font-bold">📂 프로젝트 {num}</h4>
                  {num > 1 && num === visibleProjects && (
                    <button onClick={handleRemoveProject} className="text-xs bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-colors">삭제 🗑️</button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <input type="text" placeholder="프로젝트명" className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-green-400" value={answers[`project${num}_title`] || ''} onChange={(e) => handleChange(`project${num}_title`, e.target.value)} />
                  <input type="text" placeholder="간단 설명 (50자 내외)" className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-green-400" value={answers[`project${num}_desc`] || ''} onChange={(e) => handleChange(`project${num}_desc`, e.target.value)} />
                  <input type="text" placeholder="참조 링크 (URL)" className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-green-400" value={answers[`project${num}_link`] || ''} onChange={(e) => handleChange(`project${num}_link`, e.target.value)} />
                </div>
              </div>
            ))}
            {visibleProjects < 3 && (
              <button onClick={handleAddProject} className="w-full py-3 border-2 border-dashed border-gray-600 text-gray-400 rounded-xl hover:border-green-400 hover:text-green-400 transition-all font-bold">+ 프로젝트 추가하기</button>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={() => router.back()} className="flex-1 py-3 px-6 rounded-lg bg-gray-700 text-gray-300 font-bold hover:bg-gray-600">이전</button>
          <Link href="/step5" className="flex-1" onClick={handleNext}>
            <button className={`w-full py-3 px-6 rounded-lg font-bold transition-all shadow-lg
              ${isDesigner && filledCount < 6 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-linear-to-r from-green-400 to-blue-500 text-black hover:opacity-90'}`}>
              다음 단계 →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}