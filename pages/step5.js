import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Step5({ answers, handleChange }) {
  const router = useRouter();

  return (
    <div style={{ padding: '50px' }}>
      <h2>Step 5: 직업 정보</h2>
      <p>질문 5: 현재 직업은 무엇인가요?</p>
      
      <input 
        type="text" 
        placeholder="개발자, 디자이너, 학생 등" 
        style={{ marginBottom: '20px', padding: '5px' }} 
        value={answers.job || ''} 
        onChange={(e) => handleChange('job', e.target.value)}
      />
      
      <br /><br />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => router.back()}>이전</button>
        <Link href="/step6"><button>다음 단계 (Next)</button></Link>
      </div>
    </div>
  );
}