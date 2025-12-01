import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Step7({ answers, handleChange }) {
  const router = useRouter();

  return (
    <div style={{ padding: '50px' }}>
      <h2>Step 7: 마지막 질문</h2>
      <p>질문 7: 하고 싶은 말을 자유롭게 적어주세요.</p>
      
      <input 
        type="text" 
        placeholder="자유롭게 입력..." 
        style={{ marginBottom: '20px', padding: '5px', width: '300px' }} 
        value={answers.comment || ''} 
        onChange={(e) => handleChange('comment', e.target.value)}
      />
      
      <br /><br />

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => router.back()}>이전</button>
        
        {/* 여기가 중요! 마지막은 Step 8(완료 페이지)로 갑니다 */}
        <Link href="/step8">
          <button style={{ fontWeight: 'bold', color: 'blue' }}>
            제출하러 가기 (Go to Finish)
          </button>
        </Link>
      </div>
    </div>
  );
}