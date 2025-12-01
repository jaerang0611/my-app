import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Step6({ answers, handleChange }) {
  const router = useRouter();

  return (
    <div style={{ padding: '50px' }}>
      <h2>Step 6: 성향 파악</h2>
      <p>질문 6: 당신의 MBTI는 무엇인가요?</p>
      
      <input 
        type="text" 
        placeholder="ENFP, ISTJ 등" 
        style={{ marginBottom: '20px', padding: '5px' }} 
        value={answers.mbti || ''} 
        onChange={(e) => handleChange('mbti', e.target.value)}
      />
      
      <br /><br />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => router.back()}>이전</button>
        <Link href="/step7"><button>다음 단계 (Next)</button></Link>
      </div>
    </div>
  );
}