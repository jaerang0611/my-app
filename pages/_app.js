// pages/_app.js (참고용)
import '../styles/globals.css';
import { useState } from 'react';

export default function App({ Component, pageProps }) {
  const [answers, setAnswers] = useState({}); // 1. 데이터 주머니

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const resetAnswers = () => {
    setAnswers({});
  };

  return (
    <Component 
      {...pageProps} 
      answers={answers}   // 👈 이게 꼭 있어야 합니다!
      handleChange={handleChange} 
      resetAnswers={resetAnswers}
    />
  );
}