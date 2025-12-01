import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Step4({ answers, handleChange }) {
  const router = useRouter();

  return (
    <div style={{ padding: '50px' }}>
      <h2>Step 4: 거주지 정보</h2>
      <p>질문 4: 거주하시는 주소를 입력하세요.</p>
      
      <input 
        type="text" 
        placeholder="서울시 강남구..." 
        style={{ marginBottom: '20px', padding: '5px', width: '300px' }} 
        value={answers.address || ''} 
        onChange={(e) => handleChange('address', e.target.value)}
      />
      
      <br /><br />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => router.back()}>이전</button>
        <Link href="/step5"><button>다음 단계 (Next)</button></Link>
      </div>
    </div>
  );
}