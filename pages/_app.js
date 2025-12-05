import '../styles/globals.css';
import { useState, useEffect } from 'react';
import ChatWidget from '../components/ChatWidget';

export default function App({ Component, pageProps }) {
  const [answers, setAnswers] = useState({});
  const [chatbotMsg, setChatbotMsg] = useState(""); // 🗣️ 챗봇 말풍선 메시지

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const resetAnswers = () => {
    setAnswers({});
  };

  // ✨ 말풍선 띄우기 함수 (3초 뒤 자동 사라짐)
  const triggerChatbot = (msg) => {
    setChatbotMsg(msg);
    setTimeout(() => {
      setChatbotMsg(""); // 3초 뒤 초기화
    }, 8000);
  };

  return (
    <>
      <Component 
        {...pageProps} 
        answers={answers} 
        handleChange={handleChange}
        resetAnswers={resetAnswers} 
        triggerChatbot={triggerChatbot} // 👇 페이지에 "말풍선 도구" 빌려줌
      />
      
      {/* 👇 챗봇에게 "지금 이 말풍선 띄워!" 하고 전달 */}
      <ChatWidget customMessage={chatbotMsg} />
    </>
  );
}