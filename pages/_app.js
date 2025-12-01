// pages/_app.js
import { useState } from 'react';
import '../styles/globals.css'; // 스타일 파일 경로 (없으면 이 줄 삭제해도 됨)

export default function App({ Component, pageProps }) {
  // 1. 모든 답변을 모아둘 큰 주머니 (State)
  const [answers, setAnswers] = useState({});

  // 2. 답변을 기록하는 함수 (이름표, 값)
  const handleChange = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 3. 모든 페이지(Component)에 주머니와 기록 함수를 빌려줌
  return (
    <Component 
      {...pageProps} 
      answers={answers} 
      handleChange={handleChange} 
    />
  );
}