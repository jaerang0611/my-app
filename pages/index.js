// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>서비스 이름 (메인)</h1>
      <p>환영합니다. 아래 버튼을 눌러 시작하세요.</p>
      
      <br />
      
      {/* Step 1으로 가는 링크 버튼 */}
      <Link href="/step1">
        <button style={{ padding: '10px 20px', fontSize: '20px', cursor: 'pointer' }}>
          시작하기 (Go to Step 1)
        </button>
      </Link>
    </div>
  );
}