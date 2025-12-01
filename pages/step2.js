import Link from 'next/link';
import { useRouter } from 'next/router';

// 👇 1. 프론트 데스크에서 도구 받아오기
export default function Step2({ answers, handleChange }) {
  const router = useRouter();

  return (
    <div style={{ padding: '50px' }}>
      <h2>Step 2: 연락처 정보</h2>
      <p>질문 2: 이메일 주소를 입력해주세요.</p>
      
      {/* 👇 2. 데이터 연결 (Key: email) */}
      <input 
        type="text" 
        placeholder="example@email.com" 
        style={{ marginBottom: '20px', padding: '5px', width: '200px' }} 
        
        // 데이터가 있으면 보여주고, 없으면 빈칸
        value={answers.email || ''} 
        
        // 입력할 때마다 'email'이라는 이름표로 저장
        onChange={(e) => handleChange('email', e.target.value)}
      />
      
      <br /><br />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => router.back()}>이전</button>
        <Link href="/step3"><button>다음 단계 (Next)</button></Link>
      </div>
    </div>
  );
}