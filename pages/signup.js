import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', name: '' });
  const [agreements, setAgreements] = useState({ terms: false, privacy: false, marketing: false });

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#111] text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">회원가입</h2>
        <div className="space-y-4">
          <input name="email" type="email" placeholder="이메일 (ID)" onChange={handleChange} className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white"/>
          <input name="password" type="password" placeholder="비밀번호 (8자 이상)" onChange={handleChange} className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white"/>
          <input name="confirmPassword" type="password" placeholder="비밀번호 확인" onChange={handleChange} className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white"/>
          <input name="name" type="text" placeholder="이름 (실명)" onChange={handleChange} className="w-full p-3 bg-gray-800 rounded border border-gray-700 text-white"/>
          
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded">
              <input type="checkbox" id="all" checked={agreements.terms && agreements.privacy && agreements.marketing} onChange={handleAllAgreement} className="accent-green-500"/>
              <label htmlFor="all" className="text-sm font-bold">약관 전체 동의</label>
            </div>
            <div className="pl-2 space-y-1 text-sm text-gray-400">
              <div className="flex items-center gap-2"><input type="checkbox" name="terms" checked={agreements.terms} onChange={handleAgreementChange} className="accent-green-500"/> [필수] 서비스 이용약관</div>
              <div className="flex items-center gap-2"><input type="checkbox" name="privacy" checked={agreements.privacy} onChange={handleAgreementChange} className="accent-green-500"/> [필수] 개인정보 수집 및 이용</div>
            </div>
          </div>
        </div>
        <button onClick={handleSignup} disabled={!isAllRequiredChecked} className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition-all ${isAllRequiredChecked ? 'bg-gradient-to-r from-green-500 to-blue-500 text-black hover:opacity-90' : 'bg-gray-700 text-gray-500'}`}>회원가입 완료</button>
        <div className="text-center mt-6"><Link href="/" className="text-sm text-gray-500 hover:text-white underline">메인으로 돌아가기</Link></div>
      </div>
    </div>
  );
}