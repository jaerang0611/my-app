import Link from 'next/link';
import { useRouter } from 'next/router';

// 👇 answers를 받아옵니다.
export default function Step8({ answers }) {
  const router = useRouter();

  return (
    <div style={{ padding: '50px' }}>
      <h2>🎉 제출 완료!</h2>
      <p>아래 내용으로 접수되었습니다.</p>
      
      {/* 👇 입력된 결과(데이터)를 화면에 보여주기 */}
      <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
        <p><strong>이름:</strong> {answers.name}</p>
        <p><strong>이메일:</strong> {answers.email}</p>
        <p><strong>전화번호:</strong> {answers.phone}</p>
        <p><strong>주소:</strong> {answers.address}</p>
        <p><strong>직업:</strong> {answers.job}</p>
        <p><strong>MBTI:</strong> {answers.mbti}</p>
        <p><strong>한마디:</strong> {answers.comment}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => router.back()}>수정하기 (이전)</button>
        <Link href="/">
          <button style={{ backgroundColor: 'black', color: 'white' }}>처음으로</button>
        </Link>
      </div>
    </div>
  );
}