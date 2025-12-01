// pages/step1.js
import Link from 'next/link';
import { useRouter } from 'next/router';

// 👇 1. 프론트 데스크에서 answers(답변들)와 handleChange(적는 도구)를 받아옵니다.
export default function Step1({ answers, handleChange }) {
  const router = useRouter();

  return (
    <div style={{ padding: '50px' }}>
      <h2>Step 1: 기본 정보 입력</h2>
      <p>질문 1: 당신의 이름은 무엇인가요?</p>
      
      {/* 👇 2. 입력창을 프론트 데스크와 연결합니다 */}
      <input 
        type="text" 
        placeholder="이름 입력" 
        style={{ marginBottom: '20px', padding: '5px' }} 
        
        // (중요) 프론트 데스크에 저장된 'name' 값을 가져옴 (없으면 빈칸)
        value={answers.name || ''} 
        
        // (중요) 글자를 칠 때마다 프론트 데스크에 'name'이라는 이름표로 저장
        onChange={(e) => handleChange('name', e.target.value)}
      />
      
      <br /><br />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => router.back()}>이전</button>

        <Link href="/step2">
          <button>다음 단계 (Next)</button>
        </Link>
      </div>
    </div>
  );
}