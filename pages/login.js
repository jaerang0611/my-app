import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    // 1. 유효성 검사
    if (!formData.email || !formData.password) return alert("이메일과 비밀번호를 입력해주세요.");

    try {
      // 2. 백엔드(FastAPI)로 로그인 요청
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        // 3. 로그인 성공!
        alert(`🎉 환영합니다, ${data.user_name}님! 👋\n멋진 포트폴리오를 만들어볼까요?`);
        
        // (선택) 사용자 이름을 브라우저에 기억해두기
        localStorage.setItem('user_name', data.user_name);
        localStorage.setItem('user_email', data.email);
        
        // Step 1 페이지로 이동
        router.push('/step1');
      } else {
        // 4. 로그인 실패 (비번 틀림 등)
        alert("❌ 로그인 실패: " + data.detail);
      }
    } catch (error) {
      console.error(error);
      alert("서버 연결 실패! 백엔드가 켜져 있는지 확인해주세요.");
    }
  };

  // 엔터키 누르면 로그인
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#111] text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        
        <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          로그인
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">이메일</label>
            <input 
              name="email" 
              type="email" 
              placeholder="example@email.com" 
              onChange={handleChange} 
              onKeyDown={handleKeyDown}
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-green-400 focus:outline-none text-white transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">비밀번호</label>
            <input 
              name="password" 
              type="password" 
              placeholder="********" 
              onChange={handleChange} 
              onKeyDown={handleKeyDown}
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-green-400 focus:outline-none text-white transition-colors"
            />
          </div>
        </div>

        <button 
          onClick={handleLogin} 
          className="w-full mt-10 py-4 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-black font-bold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-green-500/20"
        >
          로그인 하기
        </button>

        <div className="text-center mt-6 flex justify-center gap-4 text-sm">
          <Link href="/signup" className="text-gray-500 hover:text-white underline">
            회원가입
          </Link>
          <span className="text-gray-700">|</span>
          <Link href="/" className="text-gray-500 hover:text-white underline">
            메인으로
          </Link>
        </div>

      </div>
    </div>
  );
}