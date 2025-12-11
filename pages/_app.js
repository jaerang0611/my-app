import '@/styles/globals.css';
import { useState, useEffect } from 'react';
import ChatWidget from '../components/ChatWidget';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Script from 'next/script';
import Head from 'next/head';

// [추가 1] 폰트 설정을 위해 import
import { Noto_Sans_KR, Gowun_Batang } from 'next/font/google';

// [추가 2] Bento 템플릿의 드래그&리사이즈 기능을 위한 필수 CSS
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// 폰트 설정 (구글 폰트 최적화)
const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-noto', // Tailwind에서 font-sans로 연결됨
});

const gowunBatang = Gowun_Batang({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-gowun', // Tailwind에서 font-serif로 연결됨
});

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

  // 🔑 키 설정
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
      {/* [추가] 폰트 변수를 최상위 div에 적용하여 전역에서 사용 가능하게 함 */}
      <div className={`${notoSansKr.variable} ${gowunBatang.variable} font-sans antialiased`}>
        <Head>
          <title>MoodFolio</title>
        </Head>
        
        {/* 카카오 SDK 로드 */}
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
      </div>
    </GoogleOAuthProvider>
  );
}