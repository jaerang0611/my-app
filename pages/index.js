import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GoogleLogin } from '@react-oauth/google';

export default function Home() {
  const router = useRouter();
  const [moodOn, setMoodOn] = useState(false);

  // --- Signup/Login Logic (from signup.js & login.js) ---
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', name: '' });
  const [agreements, setAgreements] = useState({ terms: false, privacy: false });

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
    setAgreements({ terms: checked, privacy: checked });
  };

  const isAllRequiredChecked = agreements.terms && agreements.privacy;

  // 이메일 회원가입 처리
  const handleSignup = async () => {
    if (!formData.email || !formData.password || !formData.name) return alert("모든 항목을 입력해주세요.");
    if (formData.password !== formData.confirmPassword) return alert("비밀번호가 일치하지 않습니다.");
    if (formData.password.length < 8) return alert("비밀번호는 8자 이상이어야 합니다.");
    if (!isAllRequiredChecked) return alert("필수 약관에 모두 동의해주세요.");

    try {
      const res = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password, name: formData.name })
      });
      const data = await res.json();
      if (res.ok) {
        alert("🎉 가입 성공! 로그인 페이지로 이동합니다.");
        router.push('/login');
      } else {
        alert("❌ 가입 실패: " + data.detail);
      }
    } catch (error) {
      console.error(error);
      alert("서버 연결 실패! 백엔드를 켜주세요.");
    }
  };

  // 소셜 로그인/가입 성공 공통 처리
  const handleSocialSuccess = (data, type) => {
    alert(`🎉 ${type} 계정으로 시작합니다, ${data.user_name}님!`);
    localStorage.setItem('user_name', data.user_name);
    localStorage.setItem('user_email', data.email);
    router.push('/step1');
  };

  // 구글
  const handleGoogleSuccess = async (res) => {
    try {
      const backendRes = await fetch("http://127.0.0.1:8000/google-login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: res.credential })
      });
      const data = await backendRes.json();
      if (backendRes.ok) {
        handleSocialSuccess(data, "Google");
      } else {
        alert("구글 연동 실패: " + data.detail);
      }
    } catch (error) {
      console.error("구글 연동 에러", error);
      alert("구글 연동 중 문제가 발생했습니다.");
    }
  };

  // 카카오
  const loginWithKakao = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Auth.login({
        success: async (authObj) => {
          try {
            const res = await fetch("http://127.0.0.1:8000/kakao-login", {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: authObj.access_token })
            });
            const data = await res.json();
            if (res.ok) {
              handleSocialSuccess(data, "Kakao");
            } else {
              alert("카카오 연동 실패: " + data.detail);
            }
          } catch (error) {
            console.error("카카오 연동 에러", error);
          }
        },
        fail: (err) => {
          console.error(err);
          alert("카카오 로그인에 실패했습니다.");
        },
      });
    } else {
      alert("카카오 SDK가 로드되지 않았습니다.");
    }
  };

  // 네이버
  const NAVER_CLIENT_ID = "swARffOTqIry7j2VG7GK"; 
  const NAVER_CALLBACK_URL = "http://localhost:3000/"; // 메인 페이지로 콜백

  const loginWithNaver = () => {
    const state = Math.random().toString(36).substring(7);
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_CALLBACK_URL)}&state=${state}`;
    const width = 500, height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(naverAuthUrl, 'naverloginpop', `width=${width},height=${height},top=${top},left=${left}`);
  };

  useEffect(() => {
    if (window.location.hash && window.location.hash.includes('access_token')) {
      const token = window.location.hash.split('=')[1].split('&')[0];
      
      // 부모 창으로 메시지 전송
      if (window.opener) {
        window.opener.postMessage({ type: 'naver-token', token: token }, window.location.origin);
        window.close();
      }
    }

    const handleNaverMessage = async (event) => {
      if (event.origin !== window.location.origin || event.data.type !== 'naver-token') return;
      
      try {
        const res = await fetch("http://127.0.0.1:8000/naver-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: event.data.token })
        });
        const data = await res.json();
        if (res.ok) {
          handleSocialSuccess(data, "Naver");
        } else {
          alert("네이버 연동 실패: " + data.detail);
        }
      } catch (err) {
        console.error("네이버 연동 에러", err)
      }
    };
    
    window.addEventListener('message', handleNaverMessage);
    return () => window.removeEventListener('message', handleNaverMessage);
  }, []);

  return (
    <div className={`min-h-screen relative flex flex-col items-center justify-center p-6 transition-all duration-700 ${moodOn ? 'bg-[#111] text-white' : 'bg-gray-100 text-black'}`}>
      
                  {!moodOn && (
                    <>
                      <div className="absolute top-6 right-8">
                        <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-green-400 transition-colors">
                          로그인
                        </Link>
                      </div>
            
                      <div className="text-center space-y-8 mb-12 animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                          커리어에 <span className={moodOn ? "text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500" : "text-black"}>Mood</span>를 켜다,
                          <br /><span className="block mt-2">MoodFolio</span>
                        </h1>
            
                        <div className="flex items-center justify-center gap-4">
                          <span className="text-xl font-bold text-gray-500">OFF</span>
                          <button 
                            onClick={() => setMoodOn(!moodOn)}
                            className={`w-20 h-10 rounded-full p-1 shadow-inner transition-colors duration-300 ${moodOn ? 'bg-green-500' : 'bg-gray-300'}`}
                          >
                            <div className={`bg-white w-8 h-8 rounded-full shadow-lg transform transition-transform duration-300 ${moodOn ? 'translate-x-10' : ''}`}></div>
                          </button>
                          <span className={`text-xl font-bold ${moodOn ? 'text-green-400' : 'text-gray-500'}`}>MOOD ON</span>
                        </div>
                      </div>
                    </>
                  )}      
            <div className="w-full max-w-md transition-all duration-500">
              {moodOn ? (
                <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 shadow-2xl animate-fade-in-up">
                  {/* --- SNS 회원가입 --- */}
                  <div className="flex justify-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-black">
                      <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('Fail')} type="icon" theme="filled_black" shape="circle" />
                    </div>
                    <button onClick={loginWithKakao} className="w-12 h-12 bg-[#FEE500] rounded-full flex items-center justify-center hover:opacity-90">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#3c1e1e"><path d="M12 3c-5.52 0-10 3.68-10 8.21 0 2.91 1.87 5.48 4.75 6.95-.21.78-.76 2.76-.87 3.16-.14.51.19.51.39.37.16-.11 2.56-1.74 3.57-2.42.69.1 1.41.15 2.16.15 5.52 0 10-3.68 10-8.21C22 6.68 17.52 3 12 3z"/></svg>
                    </button>
                    <button onClick={loginWithNaver} className="w-12 h-12 bg-[#03C75A] rounded-full flex items-center justify-center hover:opacity-90 text-white font-black text-xl">
                      N
                    </button>
                  </div>
                  <div className="relative mb-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-700"></span></div><div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-gray-900/0 text-gray-500">Or Email</span></div></div>
      
                  {/* --- 이메일 회원가입 --- */}
                  <div className="space-y-3">
                    <input name="email" type="email" placeholder="이메일" onChange={handleChange} className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700"/>
                    <input name="password" type="password" placeholder="비밀번호 (8자 이상)" onChange={handleChange} className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700"/>
                    <input name="confirmPassword" type="password" placeholder="비밀번호 확인" onChange={handleChange} className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700"/>
                    <input name="name" type="text" placeholder="이름" onChange={handleChange} className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700"/>
                  </div>
                  
                  {/* --- 약관 동의 --- */}
                  <div className="space-y-2 mt-4 text-sm">
                    <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-md">
                      <input type="checkbox" id="all" checked={isAllRequiredChecked} onChange={handleAllAgreement} className="accent-green-500 w-4 h-4"/>
                      <label htmlFor="all" className="font-bold">전체 동의</label>
                    </div>
                    <div className="pl-2 space-y-1 text-gray-400">
                      <div className="flex items-center gap-2"><input type="checkbox" name="terms" checked={agreements.terms} onChange={handleAgreementChange} className="accent-green-500 w-4 h-4"/> [필수] 서비스 이용약관</div>
                      <div className="flex items-center gap-2"><input type="checkbox" name="privacy" checked={agreements.privacy} onChange={handleAgreementChange} className="accent-green-500 w-4 h-4"/> [필수] 개인정보 수집 및 이용</div>
                    </div>
                  </div>
      
                  <button onClick={handleSignup} disabled={!isAllRequiredChecked} className={`w-full mt-6 py-3 rounded-xl font-bold text-lg transition-all ${isAllRequiredChecked ? 'bg-gradient-to-r from-green-500 to-blue-500 text-black' : 'bg-gray-700 text-gray-500'}`}>
                    이메일로 시작하기
                  </button>
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center">
                  <p className="font-bold text-gray-500 animate-pulse text-center">
                    MOOD를 ON으로 바꿔<br/>포트폴리오 제작을 시작해보세요!
                  </p>
                </div>
              )}
            </div>
      <p className="absolute bottom-6 text-gray-600 text-xs">© 2025 MoodFolio. All rights reserved.</p>
    </div>
  );
}