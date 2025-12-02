import '../styles/globals.css';
import { useState } from 'react';
import ChatWidget from '../components/ChatWidget'; // 👈 1. 불러오기

export default function App({ Component, pageProps }) {
  const [answers, setAnswers] = useState({});

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const resetAnswers = () => {
    setAnswers({});
  };

  return (
    <>
      <Component 
        {...pageProps} 
        answers={answers} 
        handleChange={handleChange}
        resetAnswers={resetAnswers} 
      />
      
      {/* 👇 2. 여기에 위젯 추가! (모든 페이지 공통 적용) */}
      <ChatWidget />
    </>
  );
}