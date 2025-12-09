import React from 'react';
import { motion } from 'framer-motion';

const TEMPLATE_OPTIONS = {
  developer: [
    { id: 'problem', name: 'Timeline', desc: '문제 해결 과정 (타임라인)' },
    { id: 'impl', name: 'Bento', desc: '구현 결과물 (그리드)' },
    { id: 'tech', name: 'Docs', desc: '기술 깊이 (문서)' },
  ],
  designer: [
    { id: 'visual', name: 'Gallery', desc: '비주얼 임팩트 (갤러리)' },
    { id: 'brand', name: 'Magazine', desc: '브랜드 스토리 (매거진)' },
    { id: 'ux', name: 'Case Study', desc: '논리적 흐름 (케이스)' },
  ],
  marketer: [
    { id: 'data', name: 'Dashboard', desc: '성과 데이터 (대시보드)' },
    { id: 'strategy', name: 'Deck', desc: '전략 제안 (슬라이드)' },
    { id: 'creative', name: 'Feed', desc: '콘텐츠 (피드)' },
  ],
  service: [
    { id: 'revenue', name: 'Journey', desc: '비즈니스 임팩트 (여정)' },
    { id: 'ops', name: 'Roadmap', desc: '운영 효율화 (로드맵)' },
    { id: 'comm', name: 'Wiki', desc: '협업 문서화 (위키)' },
  ]
};

const MOOD_OPTIONS = ["#차분한", "#열정적인", "#신뢰감있는", "#힙한(Hip)", "#창의적인", "#미니멀한", "#클래식한"];

export default function PortfolioEditor({ isOpen, onClose, answers, setAnswers, aiRecommendation }) {
  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleThemeChange = (jobCategory, templateId) => {
    setAnswers(prev => ({
      ...prev,
      job: jobCategory,
      strength: templateId
    }));
  };

  const userJobRaw = answers.job?.toLowerCase() || '';
  const isDesigner = userJobRaw.includes('design');
  const projectCount = isDesigner ? 6 : 3;
  const currentMood = answers.moods && answers.moods.length > 0 ? answers.moods[0] : "";

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-gray-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-9999 overflow-y-auto"
    >
      <div className="p-6 pb-20">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <span>⚙️</span> Portfolio Settings
          </h2>
          <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition">
            ✕
          </button>
        </div>

        <div className="space-y-12">
          
          {/* 1. 템플릿 테마 변경 */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
              🎨 Change Template
            </h3>
            <div className="space-y-6">
              {Object.entries(TEMPLATE_OPTIONS).map(([category, templates]) => {
                
                // [NEW] AI 추천 여부 확인
                const isAiRecommendedCat = aiRecommendation && aiRecommendation.job === category;

                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-2 ml-1">
                        <h4 className={`text-xs font-bold uppercase ${isAiRecommendedCat ? 'text-emerald-400' : 'text-gray-500'}`}>
                            {category}
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {templates.map((t) => {
                         // [NEW] 템플릿 ID까지 정확히 일치하는지 확인
                         const isAiPick = isAiRecommendedCat && aiRecommendation.strength === t.id;

                         return (
                            <div 
                              key={t.id}
                              onClick={() => handleThemeChange(category, t.id)} 
                              className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between group relative overflow-hidden
                                ${answers.strength === t.id && answers.job.toLowerCase().includes(category)
                                  ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }
                                ${isAiPick ? 'border-yellow-400/50' : ''}
                              `}
                            >
                              {/* AI 추천 하이라이트 배경 */}
                              {isAiPick && <div className="absolute inset-0 bg-yellow-400/5 pointer-events-none"></div>}

                              <div>
                                <span className={`font-bold text-sm flex items-center gap-2 ${answers.strength === t.id && answers.job.toLowerCase().includes(category) ? 'text-emerald-400' : 'text-gray-200'}`}>
                                  {t.name}
                                  {/* [NEW] AI Pick 뱃지 */}
                                  {isAiPick && (
                                    <span className="text-[10px] bg-yellow-400 text-black px-1.5 py-0.5 rounded font-bold animate-pulse">
                                      AI Pick
                                    </span>
                                  )}
                                </span>
                                <span className="text-[10px] text-gray-400">{t.desc}</span>
                              </div>
                              {answers.strength === t.id && answers.job.toLowerCase().includes(category) && (
                                <span className="text-emerald-400 font-bold text-lg">✓</span>
                              )}
                            </div>
                         );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2. 무드, 3. 정보, 4. 프로젝트 (기존 코드 유지) */}
          {/* ... (이전 코드와 동일하므로 생략하지 않고 아래에 전체 포함합니다) ... */}
          
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2">✨ Mood & Vibe</h3>
            <div className="flex flex-wrap gap-2">
              {["#차분한", "#열정적인", "#신뢰감있는", "#힙한(Hip)", "#창의적인", "#미니멀한", "#클래식한"].map((mood) => (
                <button key={mood} onClick={() => handleChange('moods', [mood])} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${(answers.moods?.[0] === mood) ? 'bg-pink-500/20 border-pink-500 text-pink-300' : 'bg-white/5 border-white/10 text-gray-400'}`}>{mood}</button>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Profile Info</h3>
            <div className="space-y-3">
              <div className="flex flex-col"><label className="text-xs text-gray-400 mb-1">이름</label><input type="text" value={answers.name || ''} onChange={(e) => handleChange('name', e.target.value)} className="w-full p-3 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" /></div>
              <div className="flex flex-col"><label className="text-xs text-gray-400 mb-1">한 줄 소개</label><textarea rows="2" value={answers.intro || ''} onChange={(e) => handleChange('intro', e.target.value)} className="w-full p-3 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:border-emerald-500 outline-none resize-none" /></div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Projects Data</h3>
            <div className="space-y-3">
              {[...Array(projectCount)].map((_, i) => {
                const num = i + 1;
                const titleKey = isDesigner ? `design_project${num}_title` : `project${num}_title`;
                const descKey = isDesigner ? `design_project${num}_link` : `project${num}_desc`; 
                return (
                  <div key={num} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <span className="text-xs font-bold text-gray-500">PROJECT 0{num}</span>
                    <input type="text" value={answers[titleKey] || ''} onChange={(e) => handleChange(titleKey, e.target.value)} className="w-full p-2 bg-black/30 border border-white/10 rounded text-sm text-white focus:border-blue-500 outline-none" />
                    <textarea rows="2" value={answers[descKey] || ''} onChange={(e) => handleChange(descKey, e.target.value)} className="w-full p-2 bg-black/30 border border-white/10 rounded text-sm text-white focus:border-blue-500 outline-none resize-none" />
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 pb-6">
            <button onClick={onClose} className="w-full py-4 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg hover:brightness-110 transition active:scale-95">수정 완료 (Apply)</button>
        </div>
      </div>
    </motion.div>
  );
}