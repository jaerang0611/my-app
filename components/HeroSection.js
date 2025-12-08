import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// [확인] 배경 에셋 import가 없는지 확인
import { JOB_SPECS, normalizeJob } from "../lib/jobData";

// --- 데이터 설정 (동일) ---
const MOOD_OPTIONS = ["#차분한", "#열정적인", "#신뢰감있는", "#힙한(Hip)", "#창의적인", "#미니멀한", "#클래식한"];
const BGM_OPTIONS = ["새벽 코딩 (Lo-Fi)", "카페 백색소음 (Jazz)", "활기찬 시작 (Pop)", "깊은 집중 (Ambient)", "음악 없음 (Mute)"];

const initialJobOptions = Object.entries(JOB_SPECS).map(([key, data]) => ({
  label: data.label.split(" (")[0] + "\n(" + data.label.split(" (")[1],
  value: key
}));

const initialQuestions = [
  { id: 'job', text: "지원하시는 직무 분야를\n선택해주세요.", options: initialJobOptions },
  { id: 'strength', text: "잠시만 기다려주세요...", options: [] },
  { id: 'moods', text: "보여주고 싶은 분위기는?\n(최대 3개)", options: MOOD_OPTIONS.map(mood => ({ label: mood, value: mood })) },
  { id: 'bgm', text: "배경 음악(BGM)을\n골라주세요.", options: BGM_OPTIONS.map(bgm => ({ label: bgm, value: bgm })) }
];

// --- 애니메이션 설정 (동일) ---
const titleAnim = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

const buttonAnim = {
  initial: { opacity: 0, scale: 0.5 },
  animate: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20, delay: i * 0.1 }
  }),
  exit: (i) => ({
    scale: [1, 1.4, 0],
    opacity: [1, 1, 0],
    transition: { duration: 0.4, ease: "easeInOut", delay: i * 0.05 }
  })
};
// [확인] windAnimation 제거됨

export default function HeroSection({ answers, handleChange, onComplete }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentStep, setCurrentStep] = useState(0);
  const [localAnswers, setLocalAnswers] = useState(answers || {});
  
  useEffect(() => { setLocalAnswers(answers || {}); }, [answers]);

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  // 답변 선택 핸들러 (동일)
  const handleSelect = (value) => {
    const qId = currentQuestion.id;
    let newAnswers = { ...localAnswers };

    if (qId === 'moods') {
      const currentMoods = localAnswers.moods || [];
      let newMoods;
      if (currentMoods.includes(value)) newMoods = currentMoods.filter(m => m !== value);
      else {
        if (currentMoods.length >= 3) return;
        newMoods = [...currentMoods, value];
      }
      newAnswers[qId] = newMoods;
    } else {
      newAnswers[qId] = value;
      if (qId === 'job') {
        const jobKey = normalizeJob(value);
        const jobData = JOB_SPECS[jobKey];
        if (jobData) {
          const strengthOptions = jobData.strengths.map(s => ({
            label: s.label.replace(" (", "\n("),
            value: s.id
          }));
          const jobName = jobData.label.split(" ")[1] || "직무";
          setQuestions(prev => {
            const newQ = [...prev];
            newQ[1] = { id: 'strength', text: `${jobName}로서\n가장 돋보이는 강점은?`, options: strengthOptions };
            return newQ;
          });
        }
      }
    }
    setLocalAnswers(newAnswers);
    if (handleChange) handleChange(qId, newAnswers[qId]);
  };

  // 네비게이션 핸들러 (동일)
  const handleNext = () => {
    if (isLastStep) { if (onComplete) onComplete(localAnswers); } 
    else { setCurrentStep((prev) => prev + 1); }
  };

  const handlePrev = () => {
    if (currentStep > 0) { setCurrentStep((prev) => prev - 1); }
  };

  const isStepValid = () => {
    const ans = localAnswers[currentQuestion.id];
    if (currentQuestion.id === 'moods') return ans && ans.length > 0;
    return !!ans;
  };

  return (
    // [확인] 배경 태그 없이 컨텐츠 컨테이너만 존재
    <div className="relative w-full max-w-4xl h-[60vh] flex flex-col items-center justify-center text-center px-4">
        
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
            
            <motion.div className="mb-16 flex flex-col items-center" variants={titleAnim} initial="initial" animate="animate" exit="exit">
              <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight whitespace-pre-line">
                {currentQuestion.text}
              </h2>
            </motion.div>
            
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {currentQuestion.options.map((option, idx) => {
                const qId = currentQuestion.id;
                let isSelected = false;
                if (qId === 'moods') isSelected = localAnswers.moods?.includes(option.value);
                else isSelected = localAnswers[qId] === option.value;
                
                return (
                  <motion.button key={option.value} onClick={() => handleSelect(option.value)} custom={idx} variants={buttonAnim} initial="initial" animate="animate" exit="exit" whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}
                    className={`
                      relative group flex items-center justify-center
                      rounded-2xl backdrop-blur-md border transition-all duration-300
                      min-w-40 max-w-60 px-8 py-6
                      bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 shadow-lg text-lg font-medium text-gray-100
                      ${isSelected ? "bg-emerald-600/20 border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.3)] text-white" : ""}
                      ${isStepValid() && !isSelected ? (qId === 'moods' ? "opacity-70" : "opacity-40 grayscale-50") : "opacity-100"}
                    `}
                  >
                    <span className="relative z-10 drop-shadow-md whitespace-pre-wrap break-keep leading-snug">{option.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* 네비게이션 버튼 영역 (동일) */}
        <div className="flex items-center gap-6 min-h-[50px]">
          <AnimatePresence>
            {currentStep > 0 && (
              <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} onClick={handlePrev} className="text-gray-400 hover:text-white transition-colors text-sm underline underline-offset-4">
                ← 이전 질문
              </motion.button>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {isStepValid() && (
              <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={handleNext} className="group flex items-center gap-3 text-emerald-300 hover:text-white transition-colors text-lg font-semibold tracking-wide">
                <span>{isLastStep ? "다음 단계로" : "다음 질문"}</span>
                <span className="p-2 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {isLastStep ? <path d="M20 6 9 17l-5-5"/> : <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>}
                  </svg>
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

      </div>
  );
}