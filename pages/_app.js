import '../styles/globals.css';
import { useState, useEffect } from 'react';
import ChatWidget from '../components/ChatWidget';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  const [answers, setAnswers] = useState({});
  const [chatbotMsg, setChatbotMsg] = useState("");

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };
  const resetAnswers = () => setAnswers({});
  const triggerChatbot = (msg) => {
    setChatbotMsg(msg);
    setTimeout(() => setChatbotMsg(""), 5000);
  };

  // 🔑 키 설정 (님이 주신 것 그대로 넣었습니다)
  const GOOGLE_CLIENT_ID = "53061006744-9mlb2lh79kurhcs635c5io0972ag430t.apps.googleusercontent.com";
  const KAKAO_JS_KEY = "3aa4f7b9b1ad2576fc71d8b5ef610825";

  const kakaoInit = () => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_JS_KEY);
      console.log("🟡 카카오 SDK 초기화 완료");
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* 구버전 SDK (팝업 로그인 안정성 위해) */}
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        strategy="lazyOnload"
        onLoad={kakaoInit}
      />

      <Component 
        {...pageProps} 
        answers={answers} 
        handleChange={handleChange}
        resetAnswers={resetAnswers} 
        triggerChatbot={triggerChatbot} 
      />
      <ChatWidget customMessage={chatbotMsg} />
    </GoogleOAuthProvider>
  );
}