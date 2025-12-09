import React, { useState, useEffect } from 'react';

export default function Step3({ answers, handleChange, onNext, onPrev }) {
  const [localData, setLocalData] = useState(answers || {});

  useEffect(() => {
      setLocalData(answers || {});
  }, [answers]);

  const handleLocalChange = (key, value) => {
      setLocalData(prev => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
      if (onNext) onNext(localData);
  }

  // 공통 입력창 스타일 (유리 질감)
  const inputStyle = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all";

  return (
    // [수정] 전체 컨테이너: 반투명 유리 스타일
    <div className="w-full max-w-2xl p-8 rounded-3xl bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl">
        
        {/* 타이틀 */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-200 via-white to-emerald-200 mb-2 drop-shadow-sm">
            STEP 3. 기본 정보
          </h2>
          <p className="text-emerald-100/70 text-sm">입력한 정보를 확인하고 추가 내용을 작성해주세요.</p>
        </div>

        {/* 입력 폼 영역 */}
        <div className="space-y-6 mb-10">
          
          {/* 이름 (수정 불가) */}
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-2">
              이름 <span className="text-xs text-emerald-400/60 font-normal ml-1">(가입 정보)</span>
            </label>
            <input 
              type="text" 
              readOnly 
              className={`${inputStyle} cursor-not-allowed opacity-60`}
              value={localData.name || ''} 
            />
          </div>

          {/* 한 줄 소개 */}
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-2">한 줄 소개</label>
            <input 
              type="text" 
              placeholder="예: 3년차 프론트엔드 개발자 김이름입니다." 
              className={inputStyle}
              value={localData.intro || ''} 
              onChange={(e) => handleLocalChange('intro', e.target.value)} 
            />
          </div>

          {/* 연락처 & 이메일 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-200 mb-2">연락처</label>
              <input 
                type="text" 
                placeholder="010-0000-0000" 
                className={inputStyle}
                value={localData.phone || ''} 
                onChange={(e) => handleLocalChange('phone', e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-200 mb-2">
                이메일 <span className="text-xs text-emerald-400/60 font-normal ml-1">(수정 불가)</span>
              </label>
              <input 
                type="text" 
                readOnly 
                className={`${inputStyle} cursor-not-allowed opacity-60`}
                value={localData.email || ''} 
              />
            </div>
          </div>

          {/* 관련 링크 */}
          <div>
            <label className="block text-sm font-bold text-gray-200 mb-2">관련 링크</label>
            <input 
              type="text" 
              placeholder="Github, Blog, Notion URL 등" 
              className={inputStyle}
              value={localData.link || ''} 
              onChange={(e) => handleLocalChange('link', e.target.value)} 
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-4">
          <button 
            onClick={onPrev} 
            className="flex-1 py-4 px-6 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold hover:bg-white/10 hover:text-white transition-all"
          >
            이전 단계
          </button>
          
          <button 
            onClick={handleComplete} 
            className="flex-1 py-4 px-6 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:brightness-110 transition-all transform active:scale-95"
          >
            다음 단계
          </button>
        </div>

      </div>
  );
}