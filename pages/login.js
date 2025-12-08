import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });

  // 👇 [필수] 여기에 네이버 Client ID를 넣으세요!
  const NAVER_CLIENT_ID = "swARffOTqIry7j2VG7GK";
  const NAVER_CALLBACK_URL = "http://localhost:3000/login"; // 네이버 콘솔과 똑같아야 함

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSuccess = (data, type) => {
    alert(`🎉 환영합니다, ${data.user_name}님! (${type})`);
    localStorage.setItem('user_name', data.user_name);
    localStorage.setItem('user_email', data.email);
    router.push('/step1');
  };

  // --- 네이버 로그인 로직 (팝업) ---
  const loginWithNaver = () => {
    const state = Math.random().toString(36).substring(7);
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=token&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_CALLBACK_URL)}&state=${state}`;
    
    // 팝업 열기 (가운데 정렬 계산)
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(naverAuthUrl, 'naverloginpop', `width=${width},height=${height},top=${top},left=${left}`);
  };

  // ✨ [핵심] 네이버 팝업에서 돌아왔을 때 토큰 감지
  useEffect(() => {
    // URL에 #access_token이 있으면 (네이버 로그인 성공 후 돌아온 것)
    if (window.location.hash && window.location.hash.includes('access_token')) {
      const token = window.location.hash.split('=')[1].split('&')[0];
      
      // 백엔드로 전송
      fetch("http://127.0.0.1:8000/naver-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token })
      })
      .then(res => res.json())
      .then(data => {
        if (data.user_name) {
          // 팝업이라면 창을 닫고 부모창을 이동시켜야 하지만, 
          // 같은 창(Redirect)이라면 바로 이동
          if (window.opener) {
             // 팝업인 경우: 부모창에게 알림 (여기선 간단히 alert 후 닫기)
             alert(`네이버 로그인 성공! ${data.user_name}님 환영합니다.`);
             window.opener.location.href = "/step1";
             window.opener.localStorage.setItem('user_name', data.user_name);
             window.opener.localStorage.setItem('user_email', data.email);
             window.close();
          } else {
             handleSuccess(data, "Naver");
          }
        } else {
          alert("네이버 로그인 실패: " + data.detail);
        }
      })
      .catch(err => console.error("네이버 연동 에러", err));
    }
  }, []);


  // ... (기존 네이버, 이메일, 구글, 카카오 로그인 함수들) ...
  const handleLogin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        handleSuccess(data, "Email");
      } else {
        alert("로그인 실패: " + data.detail);
      }
    } catch (error) {
      console.error("로그인 에러", error);
      alert("로그인 중 문제가 발생했습니다.");
    }
  };

  const handleGoogleSuccess = async (res) => {
    try {
      const backendRes = await fetch("http://127.0.0.1:8000/google-login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: res.credential })
      });
      const data = await backendRes.json();
      if (backendRes.ok) {
        handleSuccess(data, "Google");
      } else {
        alert("구글 로그인 실패: " + data.detail);
      }
    } catch (error) {
      console.error("구글 연동 에러", error);
      alert("구글 로그인 중 문제가 발생했습니다.");
    }
  };

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
              handleSuccess(data, "Kakao");
            } else {
              alert("카카오 로그인 실패: " + data.detail);
            }
          } catch (error) {
            console.error("카카오 연동 에러", error);
            alert("카카오 로그인 중 문제가 발생했습니다.");
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#111] text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">로그인</h2>
        
        {/* SNS 버튼 영역 */}
        <div className="flex justify-center gap-4 mb-6">
          {/* 구글 */}
          <div className="w-12 h-12 rounded-full overflow-hidden">
             <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log('Fail')} type="icon" theme="filled_black" shape="circle" />
          </div>
          {/* 카카오 */}
          <button onClick={loginWithKakao} className="w-12 h-12 bg-[#FEE500] rounded-full flex items-center justify-center hover:opacity-90">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#3c1e1e"><path d="M12 3c-5.52 0-10 3.68-10 8.21 0 2.91 1.87 5.48 4.75 6.95-.21.78-.76 2.76-.87 3.16-.14.51.19.51.39.37.16-.11 2.56-1.74 3.57-2.42.69.1 1.41.15 2.16.15 5.52 0 10-3.68 10-8.21C22 6.68 17.52 3 12 3z"/></svg>
          </button>
          
          {/* 👇 [추가] 네이버 버튼 (초록색 N) */}
          <button onClick={loginWithNaver} className="w-12 h-12 bg-[#03C75A] rounded-full flex items-center justify-center hover:opacity-90 text-white font-black text-xl">
            N
          </button>
        </div>

        <div className="relative mb-6"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-700"></span></div><div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-gray-900 text-gray-500">Or Email</span></div></div>

        {/* ... (이메일 입력창 등 기존 코드 유지) ... */}
        <div className="space-y-5">
          <input name="email" type="email" placeholder="example@email.com" onChange={handleChange} className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white"/>
          <input name="password" type="password" placeholder="********" onChange={handleChange} className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white"/>
        </div>
        <button onClick={handleLogin} className="w-full mt-10 py-4 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-black font-bold">로그인 하기</button>
        <div className="text-center mt-6 flex justify-center gap-4 text-sm"><Link href="/signup" className="text-gray-500 hover:text-white underline">회원가입</Link><span className="text-gray-700">|</span><Link href="/" className="text-gray-500 hover:text-white underline">메인으로</Link></div>
      </div>
    </div>
  );
}