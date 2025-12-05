import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Signup() {
  const router = useRouter();
  
  // 입력 정보
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  // 약관 동의 상태
  const [agreements, setAgreements] = useState({
    terms: false,   // 이용약관 (필수)
    privacy: false, // 개인정보 (필수)
    marketing: false // 마케팅 (선택)
  });

  // 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 개별 약관 체크 핸들러
  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    setAgreements(prev => ({ ...prev, [name]: checked }));
  };

  // '전체 동의' 체크 핸들러
  const handleAllAgreement = (e) => {
    const { checked } = e.target;
    setAgreements({
      terms: checked,
      privacy: checked,
      marketing: checked
    });
  };

  // 모든 필수 약관이 체크되었는지 확인
  const isAllRequiredChecked = agreements.terms && agreements.privacy;

  // 회원가입 요청
  const handleSignup = async () => {
    // 1. 유효성 검사
    if (!formData.email || !formData.password || !formData.name) return alert("모든 항목을 입력해주세요.");
    if (formData.password !== formData.confirmPassword) return alert("비밀번호가 일치하지 않습니다.");
    if (formData.password.length < 8) return alert("비밀번호는 8자 이상이어야 합니다.");
    
    // 약관 동의 검사 (이중 체크)
    if (!isAllRequiredChecked) return alert("필수 약관에 모두 동의해주세요.");

    try {
      // 2. 백엔드 전송
      const res = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name
        })
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

  // 약관 내용 보여주기 (임시)
  const showTerms = (type) => {
    if(type === 'terms') alert("제1조 (목적)\n본 약관은 MoodFolio 서비스의 이용 조건 및 절차...");
    if(type === 'privacy') alert("1. 수집하는 개인정보 항목\n이메일, 이름, 비밀번호...");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#111] text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          회원가입
        </h2>

        <div className="space-y-4">
          {/* 이메일 */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">이메일 (ID)</label>
            <input name="email" type="email" placeholder="example@email.com" onChange={handleChange} 
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-green-400 focus:outline-none text-white"/>
          </div>
          
          {/* 비밀번호 */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">비밀번호 (8자 이상)</label>
            <input name="password" type="password" placeholder="********" onChange={handleChange} 
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-green-400 focus:outline-none text-white"/>
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">비밀번호 확인</label>
            <input name="confirmPassword" type="password" placeholder="********" onChange={handleChange} 
              className={`w-full p-3 bg-gray-800 rounded border focus:outline-none text-white 
                ${formData.password && formData.password === formData.confirmPassword ? 'border-green-500' : 'border-gray-700 focus:border-red-400'}`}/>
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">이름 (실명)</label>
            <input name="name" type="text" placeholder="홍길동" onChange={handleChange} 
              className="w-full p-3 bg-gray-800 rounded border border-gray-700 focus:border-green-400 focus:outline-none text-white"/>
          </div>

          <hr className="border-gray-800 my-4"/>

          {/* 📝 약관 동의 섹션 */}
          <div className="space-y-3">
            {/* 전체 동의 */}
            <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <input 
                type="checkbox" 
                id="all" 
                checked={agreements.terms && agreements.privacy && agreements.marketing}
                onChange={handleAllAgreement}
                className="w-5 h-5 accent-green-500 cursor-pointer"
              />
              <label htmlFor="all" className="text-sm font-bold text-white cursor-pointer select-none">
                약관 전체 동의
              </label>
            </div>

            {/* 개별 약관들 */}
            <div className="pl-2 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="terms" id="terms" checked={agreements.terms} onChange={handleAgreementChange} className="w-4 h-4 accent-green-500 cursor-pointer"/>
                  <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer select-none">[필수] 서비스 이용약관 동의</label>
                </div>
                <button onClick={() => showTerms('terms')} className="text-xs text-gray-500 underline hover:text-white">보기</button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="privacy" id="privacy" checked={agreements.privacy} onChange={handleAgreementChange} className="w-4 h-4 accent-green-500 cursor-pointer"/>
                  <label htmlFor="privacy" className="text-sm text-gray-400 cursor-pointer select-none">[필수] 개인정보 수집 및 이용 동의</label>
                </div>
                <button onClick={() => showTerms('privacy')} className="text-xs text-gray-500 underline hover:text-white">보기</button>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="marketing" id="marketing" checked={agreements.marketing} onChange={handleAgreementChange} className="w-4 h-4 accent-green-500 cursor-pointer"/>
                <label htmlFor="marketing" className="text-sm text-gray-400 cursor-pointer select-none">[선택] 마케팅 정보 수신 동의</label>
              </div>
            </div>
          </div>
        </div>

        {/* 가입 버튼 */}
        <button 
          onClick={handleSignup} 
          disabled={!isAllRequiredChecked} // 필수 체크 안되면 버튼 비활성화
          className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all 
            ${isAllRequiredChecked 
              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-black hover:opacity-90 shadow-lg' 
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
        >
          회원가입 완료
        </button>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-white underline">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}