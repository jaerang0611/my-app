import { useState, useRef, useEffect } from "react";

export default function ChatWidget({ customMessage }) {
  const [isOpen, setIsOpen] = useState(false);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "안녕하세요! 포포(Popo)입니다.🌱\n혼자 쓰기 막막한 포트폴리오,\n저랑 같이 쉽고 빠르게 완성해볼까요?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/chat`, {
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
        <div className="mb-4 w-[360px] h-[550px] bg-black/90 border-emerald-500 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.6)] flex flex-col overflow-hidden backdrop-blur-md animate-fade-in-up transition-all duration-300">
          <div className="bg-emerald-950/80 p-4 border-b border-emerald-500/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌱</span>
              <span className="text-emerald-400 font-bold tracking-wider drop-shadow-md">Career Mate 포포</span>
            </div>
            <div>

              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white hover:rotate-90 transition-transform duration-200">✕</button>
            </div>
          </div>
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 text-sm leading-relaxed rounded-2xl shadow-sm ${
                  msg.role === "user" ? "bg-emerald-700 text-white rounded-tr-none" : "bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 p-3 rounded-2xl rounded-tl-none text-emerald-500 text-xs flex items-center gap-2 animate-pulse">
                  <span>AI가 생각 중입니다...</span><span className="animate-spin">⏳</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-3 bg-gray-900/90 border-t border-gray-700 flex gap-2">
            <input className="flex-1 bg-gray-800 text-white text-sm rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500 transition-all" placeholder="궁금한 점을 입력하세요..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} />
            <button onClick={sendMessage} disabled={isLoading} className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all shadow-lg hover:shadow-cyan-500/50">➤</button>
          </div>
        </div>
      )}

      {/* 🟢 GIF/Image 토글 코드 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 transition-transform duration-300 hover:scale-110 active:scale-95 ${isOpen && 'hidden'}`}
      >
        <div className="w-40 h-40 relative flex items-center justify-center">
          <img 
            src="/character.gif"  // 👈 isGif 상태에 따라 이미지 변경
            alt="AI Coach" 
            className="w-full h-full object-contain"
          />
        </div>
      </button>
    </div>
  );
}