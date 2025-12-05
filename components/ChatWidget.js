import { useState, useRef, useEffect } from "react";

export default function ChatWidget({ customMessage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "안녕하세요! AI 자소서 코치입니다. \n포트폴리오 작성이나 면접 고민을 물어보세요! 🤖" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }), 
      });
      
      if (!res.ok) throw new Error(`Server Error: ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "ai", text: "죄송합니다. 서버가 꺼져있는 것 같아요! 😢" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* 말풍선 */}
      {!isOpen && customMessage && (
        <div className="mb-4 mr-2 bg-white text-black px-4 py-3 rounded-2xl rounded-br-none shadow-xl border border-gray-200 animate-bounce transition-all max-w-[200px] text-sm font-bold relative z-50">
          {customMessage}
          <div className="absolute -bottom-3 right-0 w-5 h-5 bg-white border-b border-r border-gray-200 transform rotate-45"></div>
        </div>
      )}

      {/* 채팅창 본체 */}
      {isOpen && (
        <div className="mb-4 w-[360px] h-[550px] bg-black/90 border border-cyan-500 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.6)] flex flex-col overflow-hidden backdrop-blur-md animate-fade-in-up transition-all duration-300">
          <div className="bg-cyan-950/80 p-4 border-b border-cyan-500/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <span className="text-cyan-400 font-bold tracking-wider drop-shadow-md">AI Coach Yong</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white hover:rotate-90 transition-transform duration-200">✕</button>
          </div>
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 text-sm leading-relaxed rounded-2xl shadow-sm ${
                  msg.role === "user" ? "bg-cyan-700 text-white rounded-tr-none" : "bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 p-3 rounded-2xl rounded-tl-none text-cyan-500 text-xs flex items-center gap-2 animate-pulse">
                  <span>AI가 생각 중입니다...</span><span className="animate-spin">⏳</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-3 bg-gray-900/90 border-t border-gray-700 flex gap-2">
            <input className="flex-1 bg-gray-800 text-white text-sm rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500 transition-all" placeholder="궁금한 점을 입력하세요..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} />
            <button onClick={sendMessage} disabled={isLoading} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all shadow-lg hover:shadow-cyan-500/50">➤</button>
          </div>
        </div>
      )}

      {/* 🟢 GIF 사용 코드 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        {isOpen ? (
          /* 닫기 버튼 */
          <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center text-2xl text-white shadow-lg border border-gray-500 hover:bg-gray-600">
            ✕
          </div>
        ) : (
          /* 캐릭터 GIF */
          // w-40 h-40 숫자를 조절해서 크기를 키우거나 줄이세요
          <div className="w-40 h-40 relative flex items-center justify-center">
            <img 
              src="/character.gif"  // 👈 파일 이름 확인!
              alt="AI Coach" 
              className="w-full h-full object-contain" // object-contain: 비율 유지하며 다 보여줌
            />
          </div>
        )}
      </button>
    </div>
  );
}