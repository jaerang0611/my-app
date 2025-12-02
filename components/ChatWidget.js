import { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false); // 채팅창 열림/닫힘 상태
  const [messages, setMessages] = useState([
    { type: 'bot', text: '안녕하세요! 포트폴리오 작성을 도와드릴까요? 🤖' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); // 스크롤 자동 내리기용

  // 새 메시지 오면 스크롤 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송 함수
  const handleSend = () => {
    if (!input.trim()) return;

    // 1. 내 메시지 추가
    const newMessages = [...messages, { type: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    // 2. (가짜) AI 응답 시뮬레이션
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { type: 'bot', text: '아직 FastAPI 연결 전이라 답장할 수 없어요! 😅 (3교시에 연결해요)' }
      ]);
    }, 1000);
  };

  // 엔터키 지원
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* 🟢 채팅창 (열렸을 때만 보임) */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          
          {/* 헤더 */}
          <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="text-white font-bold text-sm">AI Coach Yong</h3>
                <span className="text-green-400 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#111]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* 스크롤 바닥 감지용 */}
          </div>

          {/* 입력창 영역 */}
          <div className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="궁금한 점을 물어보세요..."
              className="flex-1 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:border-green-400"
            />
            <button 
              onClick={handleSend}
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-2 transition-colors"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* 🟢 둥둥 떠있는 버튼 (토글) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-[0_0_20px_rgba(74,222,128,0.5)] flex items-center justify-center text-3xl hover:scale-110 transition-transform"
      >
        {isOpen ? '✕' : '💬'}
      </button>

    </div>
  );
}