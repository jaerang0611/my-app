import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Step3({ answers, handleChange }) {
  const router = useRouter();

  return (
    <div style={{ padding: '50px' }}>
      <h2>Step 3: 연락처 정보</h2>
      <p>질문 3: 전화번호를 입력하세요.</p>
      
      <input 
        type="text" 
        placeholder="010-0000-0000" 
        style={{ marginBottom: '20px', padding: '5px' }} 
        value={answers.phone || ''} 
        onChange={(e) => handleChange('phone', e.target.value)}
      />
      
      <br /><br />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => router.back()}>이전</button>
        <Link href="/step4"><button>다음 단계 (Next)</button></Link>
      </div>
    </div>
  );
}