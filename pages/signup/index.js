import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

// 컴포넌트 불러오기
import HeroSection from '../../components/HeroSection';
import { LayerBack, TreeLeft, TreeRight, GroundFront } from '../../components/PlaceholderAssets';

// --- 애니메이션 설정 (배경 유지) ---
const windAnimation = {
  rotate: [0, -1.5, 0, 1.5, 0], 
  transition: { duration: 6, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1], repeat: Infinity, repeatType: "loop" }
};

// ==========================================
// [내부 컴포넌트 1] 회원가입 폼
// ==========================================
function SignupForm({ onComplete }) {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', name: '' });
  const [agreements, setAgreements] = useState({ terms: false, privacy: false, marketing: false });

  const handleSocialSuccess = (data, type) => {
    alert(`🎉 ${type} 계정으로 가입되었습니다.`);
    onComplete({ 
        email: data.email || "social@login.com", 
        name: data.user_name || "Social User",
        password: "social-login-password" 
    });
  };
  const handleGoogleSuccess = (res) => handleSocialSuccess({ user_name: "Google User" }, "Google");
  const loginWithKakao = () => alert("카카오 로그인 (구현 필요)");
  const loginWithNaver = () => alert("네이버 로그인 (구현 필요)");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    setAgreements(prev => ({ ...prev, [name]: checked }));
  };
  const handleAllAgreement = (e) => {
    const { checked } = e.target;
    setAgreements({ terms: checked, privacy: checked, marketing: checked });
  };
  const isAllRequiredChecked = agreements.terms && agreements.privacy;

  const handleSignup = () => {
    if (!formData.email || !formData.password || !formData.name) return alert("필수 항목을 입력해주세요.");
    if (formData.password !== formData.confirmPassword) return alert("비밀번호가 일치하지 않습니다.");
    if (!isAllRequiredChecked) return alert("필수 약관에 동의해주세요.");
    onComplete(formData);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="w-full max-w-md p-8 rounded-3xl bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-blue-400 font-serif">회원가입</h2>
      
      {/* 소셜 로그인 */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white cursor-pointer hover:scale-110 transition shadow-lg">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('Fail')} type="icon" theme="filled_black" shape="circle" />
        </div>
        <button onClick={loginWithKakao} className="w-12 h-12 bg-[#FEE500] rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg text-black font-bold text-xs">TALK</button>
        <button onClick={loginWithNaver} className="w-12 h-12 bg-[#03C75A] rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg text-white font-bold text-lg">N</button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-px bg-white/10 flex-1" />
        <span className="text-xs text-gray-400 uppercase font-medium tracking-wide">Or Email</span>
        <div className="h-px bg-white/10 flex-1" />
      </div>

      {/* 입력 폼 */}
      <div className="space-y-4">
        {['email', 'password', 'confirmPassword', 'name'].map((field) => (
          <input key={field} name={field} type={field.toLowerCase().includes('password') ? 'password' : 'text'} placeholder={field} onChange={handleChange} className="w-full p-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-white/10 focus:outline-none transition-all"/>
        ))}
        <div className="space-y-3 mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 cursor-pointer"><input type="checkbox" id="all" checked={isAllRequiredChecked} onChange={handleAllAgreement} className="accent-emerald-500 w-5 h-5 cursor-pointer"/><label htmlFor="all" className="text-sm font-bold text-gray-200 cursor-pointer">약관 전체 동의</label></div>
          <div className="pl-2 space-y-2 text-xs text-gray-400">
            <div className="flex items-center gap-2"><input type="checkbox" name="terms" checked={agreements.terms} onChange={handleAgreementChange} className="accent-emerald-500 cursor-pointer"/> [필수] 서비스 이용약관</div>
            <div className="flex items-center gap-2"><input type="checkbox" name="privacy" checked={agreements.privacy} onChange={handleAgreementChange} className="accent-emerald-500 cursor-pointer"/> [필수] 개인정보 수집 및 이용</div>
          </div>
        </div>
      </div>
      <button onClick={handleSignup} disabled={!isAllRequiredChecked} className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 ${isAllRequiredChecked ? 'bg-linear-to-r from-emerald-400 to-blue-500 text-black shadow-[0_0_20px_rgba(52,211,153,0.4)]' : 'bg-gray-700/50 text-gray-500 cursor-not-allowed border border-white/5'}`}>이메일로 회원가입</button>
      <div className="text-center mt-6"><Link href="/" className="text-sm text-gray-400 hover:text-white underline transition-colors underline-offset-4">메인으로 돌아가기</Link></div>
    </motion.div>
  );
}

// ==========================================
// [내부 컴포넌트 2] Step3: 기본 정보 입력
// ==========================================
function Step3Content({ answers, handleChange, onNext, onPrev }) {
  const [localData, setLocalData] = useState(answers || {});
  useEffect(() => { setLocalData(answers || {}); }, [answers]);

  const handleLocalChange = (key, value) => {
      setLocalData(prev => ({ ...prev, [key]: value }));
      handleChange(key, value);
  };

  const handleComplete = () => {
      if (onNext) onNext(localData);
  }

  const inputStyle = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all";

  return (
    <div className="w-full max-w-2xl p-8 rounded-3xl bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-200 via-white to-emerald-200 mb-2 drop-shadow-sm font-serif">
            기본 정보 입력
          </h2>
          <p className="text-emerald-100/70 text-sm">입력한 정보를 확인하고 추가 내용을 작성해주세요.</p>
        </div>

        <div className="space-y-6 mb-10">
          <div><label className="block text-sm font-bold text-gray-200 mb-2">이름 <span className="text-xs text-emerald-400/60 font-normal">(가입 정보)</span></label><input type="text" readOnly className={`${inputStyle} cursor-not-allowed opacity-60`} value={localData.name || ''} /></div>
          <div><label className="block text-sm font-bold text-gray-200 mb-2">한 줄 소개</label><input type="text" placeholder="예: 3년차 프론트엔드 개발자 김이름입니다." className={inputStyle} value={localData.intro || ''} onChange={(e) => handleLocalChange('intro', e.target.value)} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-200 mb-2">연락처</label><input type="text" placeholder="010-0000-0000" className={inputStyle} value={localData.phone || ''} onChange={(e) => handleLocalChange('phone', e.target.value)} /></div>
            <div><label className="block text-sm font-bold text-gray-200 mb-2">이메일 <span className="text-xs text-emerald-400/60 font-normal">(수정 불가)</span></label><input type="text" readOnly className={`${inputStyle} cursor-not-allowed opacity-60`} value={localData.email || ''} /></div>
          </div>
          <div><label className="block text-sm font-bold text-gray-200 mb-2">관련 링크</label><input type="text" placeholder="Github, Blog URL 등" className={inputStyle} value={localData.link || ''} onChange={(e) => handleLocalChange('link', e.target.value)} /></div>
        </div>

        <div className="flex gap-4">
          <button onClick={onPrev} className="flex-1 py-4 px-6 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold hover:bg-white/10 hover:text-white transition-all">이전 단계</button>
          <button onClick={onNext} className="flex-1 py-4 px-6 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:brightness-110 transition-all transform active:scale-95">다음 단계</button>
        </div>
    </div>
  );
}

// ==========================================
// [내부 컴포넌트 3] Step4: 경력 및 갤러리
// ==========================================
function Step4Content({ answers, handleChange, onNext, onPrev }) {
  const isDesigner = answers.job?.includes("디자인") || answers.job?.includes("Designer");
  const [visibleProjects, setVisibleProjects] = useState(1);
  
  useEffect(() => {
    if (answers.project3_title) setVisibleProjects(3);
    else if (answers.project2_title) setVisibleProjects(2);
  }, []);

  const handleAddProject = () => { if (visibleProjects < 3) setVisibleProjects(prev => prev + 1); };
  const handleRemoveProject = () => {
    if (visibleProjects > 1) {
      const targetNum = visibleProjects;
      setVisibleProjects(prev => prev - 1);
      handleChange(`project${targetNum}_title`, '');
      handleChange(`project${targetNum}_desc`, '');
      handleChange(`project${targetNum}_link`, '');
    }
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("2MB 이하 파일만 가능합니다.");
      const reader = new FileReader();
      reader.onloadend = () => handleChange(key, reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleNextClick = () => {
    if (isDesigner) {
      let count = 0;
      for (let i = 1; i <= 6; i++) { if (answers[`design_project${i}_title`] && (answers[`design_project${i}_link`] || answers[`design_project${i}_file`])) count++; }
      if (count < 6) return alert(`🎨 디자이너는 6개 프로젝트를 모두 채워주세요! (${count}/6)`);
    } else {
      if (!answers.project1_title) return alert("최소 1개의 프로젝트는 입력해주세요!");
    }
    onNext();
  };

  const filledCount = [1, 2, 3, 4, 5, 6].filter(i => answers[`design_project${i}_title`] && (answers[`design_project${i}_link`] || answers[`design_project${i}_file`])).length;
  const inputStyle = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all";

  return (
    <div className="w-full max-w-5xl p-8 rounded-3xl bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-200 via-white to-emerald-200 mb-2 font-serif">
            {isDesigner ? "디자인 갤러리 구성" : "핵심 경력 기술"}
          </h2>
          <p className="text-emerald-100/70 text-sm">{isDesigner ? "작품 6개를 선정하여 등록해주세요." : "포트폴리오의 알맹이를 채워주세요."}</p>
        </div>

        <div className="mb-12">
          <label className="block text-lg font-bold text-white mb-3">경력 요약</label>
          <textarea rows="4" placeholder="주요 경력 사항을 입력하세요..." className={inputStyle} value={answers.career_summary || ''} onChange={(e) => handleChange('career_summary', e.target.value)}/>
        </div>

        {isDesigner ? (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
              <div><strong className="text-emerald-300 block mb-1">📢 디자이너 미션</strong><span className="text-sm text-gray-300">이미지 파일이나 URL 중 선택하세요.</span></div>
              <span className={`text-2xl font-bold ${filledCount === 6 ? 'text-emerald-400' : 'text-orange-400'}`}>{filledCount} / 6</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-emerald-500/50 transition-all">
                  <div className="flex justify-between items-center mb-3"><span className="text-xs font-bold text-gray-400">WORK 0{num}</span>{(answers[`design_project${num}_link`] || answers[`design_project${num}_file`]) && <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded">✔ 완료</span>}</div>
                  <input type="text" placeholder="작품 제목" className={`mb-3 ${inputStyle} py-2 text-sm`} value={answers[`design_project${num}_title`] || ''} onChange={(e) => handleChange(`design_project${num}_title`, e.target.value)}/>
                  <div className="flex gap-2 mb-2 text-xs">
                    <button onClick={() => handleChange(`design_type_${num}`, 'link')} className={`flex-1 py-2 rounded-lg transition-colors ${!answers[`design_type_${num}`] || answers[`design_type_${num}`] === 'link' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'}`}>🔗 링크</button>
                    <button onClick={() => handleChange(`design_type_${num}`, 'file')} className={`flex-1 py-2 rounded-lg transition-colors ${answers[`design_type_${num}`] === 'file' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-400'}`}>🖼️ 파일</button>
                  </div>
                  {answers[`design_type_${num}`] === 'file' ? (
                    <div className="relative"><input type="file" accept="image/*" onChange={(e) => handleFileChange(e, `design_project${num}_file`)} className="w-full text-xs text-gray-400 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"/>{answers[`design_project${num}_file`] && <img src={answers[`design_project${num}_file`]} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg border border-white/10" />}</div>
                  ) : (
                    <input type="text" placeholder="https://..." className={`${inputStyle} py-2 text-sm`} value={answers[`design_project${num}_link`] || ''} onChange={(e) => handleChange(`design_project${num}_link`, e.target.value)}/>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-10">
             <div className="flex justify-between items-center mb-4"><label className="block text-lg font-bold text-white">대표 프로젝트</label><span className="text-sm text-gray-400">({visibleProjects}/3)</span></div>
            {[1, 2, 3].slice(0, visibleProjects).map((num) => (
              <div key={num} className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6 relative">
                <div className="flex justify-between items-center mb-4"><h4 className="text-emerald-400 font-bold">📂 프로젝트 {num}</h4>{num > 1 && num === visibleProjects && <button onClick={handleRemoveProject} className="text-xs bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition-colors">삭제 🗑️</button>}</div>
                <div className="grid grid-cols-1 gap-4">
                  <input type="text" placeholder="프로젝트명" className={inputStyle} value={answers[`project${num}_title`] || ''} onChange={(e) => handleChange(`project${num}_title`, e.target.value)} />
                  <input type="text" placeholder="간단 설명 (50자 내외)" className={inputStyle} value={answers[`project${num}_desc`] || ''} onChange={(e) => handleChange(`project${num}_desc`, e.target.value)} />
                  <input type="text" placeholder="참조 링크 (URL)" className={inputStyle} value={answers[`project${num}_link`] || ''} onChange={(e) => handleChange(`project${num}_link`, e.target.value)} />
                </div>
              </div>
            ))}
            {visibleProjects < 3 && <button onClick={handleAddProject} className="w-full py-4 border-2 border-dashed border-white/20 text-gray-400 rounded-xl hover:border-emerald-500 hover:text-emerald-400 transition-all font-bold">+ 프로젝트 추가하기</button>}
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={onPrev} className="flex-1 py-4 px-6 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold hover:bg-white/10 hover:text-white transition-all">이전 단계</button>
          <button onClick={handleNextClick} className="flex-1 py-4 px-6 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:brightness-110 transition-all transform active:scale-95">다음 단계</button>
        </div>
    </div>
  );
}

// ==========================================
// [내부 컴포넌트 4] Step5: AI 코칭 (버튼 색상 수정됨)
// ==========================================
function Step5Content({ answers, handleChange, onNext, onPrev }) {
  const options = [
    { label: "문장 다듬기가 어려워요", desc: "자소서/경력기술서 윤문 요청", reaction: "✍️ 문장 다듬기? 제가 전문입니다!" },
    { label: "어떤 내용을 강조할지 모르겠어요", desc: "강점 발굴 요청", reaction: "💎 숨겨진 강점, 제가 찾아드릴게요!" },
    { label: "면접 질문이 궁금해요", desc: "예상 질문 추출 요청", reaction: "🧐 면접관의 마음을 읽어드릴게요!" },
  ];

  const handleSelect = (label) => { handleChange('ai_request', label); };

  return (
    <div className="w-full max-w-2xl p-8 rounded-3xl bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-emerald-200 via-white to-emerald-200 mb-2 font-serif">
            AI 코칭 설정
          </h2>
          <p className="text-emerald-100/70 text-sm">가장 고민되는 점을 선택하면 AI가 도와줍니다.</p>
        </div>

        <div className="mb-12">
          <label className="block text-lg font-bold text-white mb-4">Q8. 현재 가장 고민되는 점은?</label>
          <div className="grid grid-cols-1 gap-4">
            {options.map((opt) => (
              <button key={opt.label} onClick={() => handleSelect(opt.label)}
                className={`p-6 rounded-2xl border text-left transition-all flex flex-col group backdrop-blur-sm
                  ${answers.ai_request === opt.label 
                    ? 'border-emerald-400/60 bg-emerald-600/20 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                    : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/30'
                  }`}
              >
                <span className="text-lg font-bold mb-1 group-hover:text-emerald-300 transition-colors">{opt.label}</span>
                <span className="text-sm opacity-70">👉 {opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={onPrev} className="flex-1 py-4 px-6 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold hover:bg-white/10 hover:text-white transition-all">이전 단계</button>
          
          {/* [수정됨] 완료 버튼: Emerald/Cyan 계열로 변경 */}
          <button onClick={onNext} className="w-full py-4 px-6 rounded-xl bg-linear-to-r from-emerald-400 to-cyan-500 text-white font-bold hover:opacity-90 shadow-lg transition-all transform active:scale-95">설정 완료 & 제출하기 ✨</button>
        </div>
    </div>
  );
}

// ==========================================
// [메인] 통합 페이지 (배경 포함)
// ==========================================
export default function SignUpPage() {
  const router = useRouter();
  const [view, setView] = useState('form'); 
  const [userData, setUserData] = useState({});

  const handleSignupComplete = (signupData) => { setUserData(prev => ({ ...prev, ...signupData })); setView('hero'); };
  const handleHeroComplete = (heroData) => { setUserData(prev => ({ ...prev, ...heroData })); setView('step3'); };
  const handleStep3Next = () => { setView('step4'); };
  const handleStep3Prev = () => { setView('hero'); };
  const handleStep4Next = () => { setView('step5'); };
  const handleStep4Prev = () => { setView('step3'); };
  
  // [수정됨] 최종 완료 -> 로컬스토리지 저장 & 결과 페이지 이동
  const handleStep5Next = () => { 
    console.log("최종 제출 데이터:", userData); 
    localStorage.setItem('portfolio_data', JSON.stringify(userData));
    alert("설정이 완료되었습니다! 결과 페이지로 이동합니다."); 
    router.push('/result'); 
  };
  const handleStep5Prev = () => { setView('step4'); };

  return (
    <div className="min-h-screen bg-[#1a2e35] flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 배경 요소 (나무 흔들림, 땅 위치 복구됨) */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0 z-0 opacity-80"><LayerBack /></motion.div>
      <motion.div initial={{ x: "-100%", opacity: 0 }} animate={{ x: "0%", opacity: 1, rotate: [0, -1.5, 0, 1.5, 0] }} style={{ transformOrigin: "bottom left" }} transition={{ x: { delay: 0.3, duration: 1.2, ease: "easeOut" }, opacity: { delay: 0.3, duration: 1.2 }, rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" } }} className="absolute top-[-10%] left-[-20%] w-[70%] h-[110%] z-10 pointer-events-none"><TreeLeft /></motion.div>
      <motion.div initial={{ x: "100%", opacity: 0 }} animate={{ x: "0%", opacity: 1, rotate: [0, 1.5, 0, -1.5, 0] }} style={{ transformOrigin: "bottom right" }} transition={{ x: { delay: 0.4, duration: 1.2, ease: "easeOut" }, opacity: { delay: 0.4, duration: 1.2 }, rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 } }} className="absolute top-[-10%] right-[-20%] w-[70%] h-[110%] z-10 pointer-events-none"><TreeRight /></motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 2.5, ease: "easeInOut" }} className="absolute bottom-[-30%] w-full h-[50%] z-20 pointer-events-none"><GroundFront /></motion.div>

      {/* 컨텐츠 영역 */}
      <div className="relative z-30 w-full h-full flex items-center justify-center px-4 overflow-y-auto py-10">
        <AnimatePresence mode="wait">
          
          {view === 'form' && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="w-full flex justify-center">
              <SignupForm onComplete={handleSignupComplete} />
            </motion.div>
          )}

          {view === 'hero' && (
            <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="w-full h-full flex items-center justify-center">
              <HeroSection answers={userData} handleChange={(key, value) => setUserData(prev => ({...prev, [key]: value}))} onComplete={handleHeroComplete} />
            </motion.div>
          )}

          {view === 'step3' && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }} className="w-full h-full flex items-center justify-center">
               <Step3Content answers={userData} handleChange={(key, value) => setUserData(prev => ({...prev, [key]: value}))} onNext={handleStep3Next} onPrev={handleStep3Prev} />
            </motion.div>
          )}

          {view === 'step4' && (
             <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }} className="w-full h-full flex items-center justify-center">
                <Step4Content answers={userData} handleChange={(key, value) => setUserData(prev => ({...prev, [key]: value}))} onNext={handleStep4Next} onPrev={handleStep4Prev} />
             </motion.div>
          )}

          {view === 'step5' && (
             <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }} className="w-full h-full flex items-center justify-center">
                <Step5Content answers={userData} handleChange={(key, value) => setUserData(prev => ({...prev, [key]: value}))} onNext={handleStep5Next} onPrev={handleStep5Prev} />
             </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}