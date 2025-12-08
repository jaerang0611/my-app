import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

import HeroSection from '../../components/HeroSection';
import Step3 from '../../pages/step3';
import { LayerBack, TreeLeft, TreeRight, GroundFront } from '../../components/PlaceholderAssets';

// --- 애니메이션 설정 ---
const windAnimation = {
  rotate: [0, -1.5, 0, 1.5, 0], 
  transition: { duration: 6, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1], repeat: Infinity, repeatType: "loop" }
};

// --- [내부 컴포넌트] 회원가입 폼 ---
function SignupForm({ onComplete }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', name: '' });
  const [agreements, setAgreements] = useState({ terms: false, privacy: false, marketing: false });

  // --- 소셜 로그인 핸들러 ---
  const handleSocialSuccess = (data, type) => {
    alert(`🎉 ${type} 계정으로 가입되었습니다. 환영합니다!`);
    onComplete({ 
        email: data.email || "social@login.com", 
        name: data.user_name || "Social User",
        password: "social-login-password" 
    });
  };

  const handleGoogleSuccess = async (res) => {
      console.log("Google Token:", res.credential);
      handleSocialSuccess({ user_name: "Google User", email: "google@test.com" }, "Google");
  };

  const loginWithKakao = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Auth.login({
        success: (authObj) => {
           handleSocialSuccess({ user_name: "Kakao User", email: "kakao@test.com" }, "Kakao");
        },
        fail: (err) => alert("카카오 로그인 실패"),
      });
    } else {
      alert("카카오 SDK가 로드되지 않았습니다.");
    }
  };

  const NAVER_CLIENT_ID = "swARffOTqIry7j2VG7GK"; 
  const NAVER_CALLBACK_URL = "http://localhost:3000/"; 

  const loginWithNaver = () => {
    const state = Math.random().toString(36).substring(7);
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_CALLBACK_URL)}&state=${state}`;
    const width = 500, height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(naverAuthUrl, 'naverloginpop', `width=${width},height=${height},top=${top},left=${left}`);
  };

  useEffect(() => {
    const handleNaverMessage = async (event) => {
      if (event.origin !== window.location.origin || event.data.type !== 'naver-token') return;
      handleSocialSuccess({ user_name: "Naver User", email: "naver@test.com" }, "Naver");
    };
    window.addEventListener('message', handleNaverMessage);
    return () => window.removeEventListener('message', handleNaverMessage);
  }, []);

  // --- 이메일 가입 로직 ---
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
    if (!formData.email || !formData.password || !formData.name) return alert("모든 항목을 입력해주세요.");
    if (formData.password !== formData.confirmPassword) return alert("비밀번호가 일치하지 않습니다.");
    if (!isAllRequiredChecked) return alert("필수 약관에 모두 동의해주세요.");
    onComplete(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md p-8 rounded-3xl bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-blue-400 drop-shadow-sm">
        회원가입
      </h2>

      {/* 소셜 로그인 버튼 */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white cursor-pointer hover:scale-110 transition shadow-lg">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('Fail')} type="icon" theme="filled_black" shape="circle" />
        </div>
        <button onClick={loginWithKakao} className="w-12 h-12 bg-[#FEE500] rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg text-black font-bold text-xs">
            TALK
        </button>
        <button onClick={loginWithNaver} className="w-12 h-12 bg-[#03C75A] rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg text-white font-bold text-lg">
            N
        </button>
      </div>

      {/* [수정됨] Or Email 구분선 (취소선 효과 제거) */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px bg-white/10 flex-1" />
        <span className="text-xs text-gray-400 uppercase font-medium tracking-wide">Or Email</span>
        <div className="h-px bg-white/10 flex-1" />
      </div>

      {/* 이메일 입력 폼 */}
      <div className="space-y-4">
        {['email', 'password', 'confirmPassword', 'name'].map((field) => (
          <input
            key={field}
            name={field}
            type={field.includes('password') ? 'password' : 'text'}
            placeholder={field === 'email' ? '이메일 (ID)' : field === 'name' ? '이름 (실명)' : field === 'password' ? '비밀번호 (8자 이상)' : '비밀번호 확인'}
            onChange={handleChange}
            className="w-full p-4 bg-white/5 rounded-xl border border-white/10 text-white placeholder-gray-400 focus:border-emerald-500 focus:bg-white/10 focus:outline-none transition-all"
          />
        ))}
        
        <div className="space-y-3 mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" id="all" checked={isAllRequiredChecked} onChange={handleAllAgreement} className="accent-emerald-500 w-5 h-5 cursor-pointer"/>
            <label htmlFor="all" className="text-sm font-bold text-gray-300 cursor-pointer">약관 전체 동의</label>
          </div>
          <div className="pl-2 space-y-2 text-xs text-gray-400">
            <div className="flex items-center gap-2"><input type="checkbox" name="terms" checked={agreements.terms} onChange={handleAgreementChange} className="accent-emerald-500 cursor-pointer"/> [필수] 서비스 이용약관</div>
            <div className="flex items-center gap-2"><input type="checkbox" name="privacy" checked={agreements.privacy} onChange={handleAgreementChange} className="accent-emerald-500 cursor-pointer"/> [필수] 개인정보 수집 및 이용</div>
          </div>
        </div>
      </div>
      <button 
        onClick={handleSignup} 
        disabled={!isAllRequiredChecked} 
        className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 duration-300
          ${isAllRequiredChecked 
            ? 'bg-linear-to-r from-emerald-400 to-blue-500 text-black shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] hover:brightness-110' 
            : 'bg-gray-700/50 text-gray-500 cursor-not-allowed border border-white/5'}`}
      >
        이메일로 시작하기
      </button>
      
      <div className="text-center mt-6">
        <Link href="/" className="text-sm text-gray-400 hover:text-white underline transition-colors underline-offset-4">
          메인으로 돌아가기
        </Link>
      </div>
    </motion.div>
  );
}

// --- [메인] 통합 페이지 ---
export default function SignUpPage() {
  const router = useRouter();
  const [view, setView] = useState('form'); 
  const [userData, setUserData] = useState({});

  const handleSignupComplete = (signupData) => {
    setUserData(signupData);
    setView('hero');
  };

  const handleHeroComplete = (heroData) => {
    const finalData = { ...userData, ...heroData };
    console.log("최종 전송 데이터:", finalData);
    setView('step3');
  };

  const handleStep3Next = (step3Data) => {
      const finalData = { ...userData, ...step3Data };
      console.log("최종 완료 데이터:", finalData);
      alert("모든 설정 완료! 대시보드로 이동합니다.");
      // router.push('/dashboard');
  };

  const handleStep3Prev = () => {
      setView('hero');
  }

  return (
    <div className="min-h-screen bg-[#1a2e35] flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 배경 요소 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="absolute inset-0 z-0 opacity-80"><LayerBack /></motion.div>
      <motion.div initial={{ x: "-100%", opacity: 0 }} animate={{ x: "0%", opacity: 1, rotate: [0, 1.5, 0, -1.5, 0] }} style={{ transformOrigin: "top left" }} transition={{ x: { delay: 0.3, duration: 1.2, ease: "easeOut" }, opacity: { delay: 0.3, duration: 1.2 }, rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 } }} className="absolute top-[-5%] left-[-10%] w-[45%] h-[70%] z-10 pointer-events-none"><TreeLeft /></motion.div>
      <motion.div initial={{ x: "100%", opacity: 0 }} animate={{ x: "0%", opacity: 1, rotate: [0, 1.5, 0, -1.5, 0] }} style={{ transformOrigin: "top right" }} transition={{ x: { delay: 0.4, duration: 1.2, ease: "easeOut" }, opacity: { delay: 0.4, duration: 1.2 }, rotate: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 } }} className="absolute top-[-5%] right-[-10%] w-[45%] h-[70%] z-10 pointer-events-none"><TreeRight /></motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 2.5, ease: "easeInOut" }} className="absolute bottom-[-30%] w-full h-[40%] md:h-[50%] z-20 pointer-events-none"><GroundFront /></motion.div>

      {/* 컨텐츠 영역 */}
      <div className="relative z-30 w-full h-full flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          
          {view === 'form' && (
            <SignupForm key="form" onComplete={handleSignupComplete} />
          )}

          {view === 'hero' && (
            <motion.div key="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="w-full h-full flex items-center justify-center">
              <HeroSection 
                answers={userData}
                handleChange={(key, value) => setUserData(prev => ({...prev, [key]: value}))}
                onComplete={handleHeroComplete}
              />
            </motion.div>
          )}

          {view === 'step3' && (
             <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="w-full h-full flex items-center justify-center">
                <Step3 
                    answers={userData}
                    handleChange={(key, value) => setUserData(prev => ({...prev, [key]: value}))}
                    onNext={handleStep3Next}
                    onPrev={handleStep3Prev}
                />
             </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}