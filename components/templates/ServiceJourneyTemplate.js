import { useState, useEffect, useRef } from 'react';
import PortfolioBackground from "../PortfolioBackground";
import { getStyleByMood } from "./moodColorMap";

const bgmFiles = {
  "새벽 코딩 (Lo-Fi)": "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3", 
  "카페 백색소음 (Jazz)": "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
  "활기찬 시작 (Pop)": "https://cdn.pixabay.com/download/audio/2022/10/25/audio_9593259345.mp3",
  "깊은 집중 (Ambient)": "https://cdn.pixabay.com/download/audio/2022/03/10/audio_5b98f26703.mp3",
  "음악 없음 (Mute)": null
};

export default function ServiceJourneyTemplate({ answers }) {
  const selectedMoods = answers.moods || [];
  const selectedBgmTitle = answers.bgm || "음악 없음 (Mute)";
  const currentStyle = getStyleByMood(selectedMoods);
  
  // 프로젝트 데이터 변환
  const projects = [];
  for (let i = 1; i <= 3; i++) {
    if (answers[`project${i}_title`]) {
      projects.push({
        step: `0${i}`,
        label: `PROJECT ${i}`,
        title: answers[`project${i}_title`],
        desc: answers[`project${i}_desc`],
        link: answers[`project${i}_link`]
      });
    }
  }

  // BGM 로직
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const bgmUrl = bgmFiles[selectedBgmTitle];
    if (bgmUrl) {
      audioRef.current = new Audio(bgmUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };
  }, [selectedBgmTitle]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause(); else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };
  
  const titleText = "text-slate-900 dark:text-white";
  const descText = "text-slate-600 dark:text-slate-400";
  const cardBg = "bg-white/80 dark:bg-slate-900/80";
  const cardBorder = "border-slate-200 dark:border-white/10";

  return (
    <div className="min-h-screen relative font-sans overflow-x-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <PortfolioBackground moods={selectedMoods} />

      {selectedBgmTitle !== "음악 없음 (Mute)" && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 p-3 rounded-full backdrop-blur-md border border-white/20 bg-white/10 shadow-lg`}>
          <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white">{isPlaying ? "⏸" : "▶"}</button>
        </div>
      )}

      {/* Hero Section */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 relative z-10">
        <span className={`text-sm font-bold tracking-[0.3em] uppercase mb-6 ${currentStyle.textHighlight}`}>Service Strategy & Planning</span>
        <h1 className={`text-5xl md:text-7xl font-extrabold leading-tight max-w-4xl ${titleText} mb-8 drop-shadow-sm font-serif`}>
          비즈니스의 문제를 정의하고<br/>
          <span className={`text-transparent bg-clip-text bg-linear-to-r ${currentStyle.headerGradient}`}>실질적인 솔루션</span>을 만듭니다.
        </h1>
        <p className={`text-lg md:text-xl font-light max-w-2xl ${descText}`}>
          안녕하세요, <strong>{answers.name || "Service Planner"}</strong>입니다.<br/>
          {answers.intro || "사용자의 니즈와 비즈니스 목표 사이의 최적점을 찾아내는 여정을 소개합니다."}
        </p>
        <div className="absolute bottom-10 animate-bounce"><span className="text-2xl text-slate-400">↓</span></div>
      </section>

      {/* Journey Steps */}
      <section className="max-w-5xl mx-auto px-6 pb-40 relative z-10">
        <div className={`absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -ml-px bg-linear-to-b ${currentStyle.headerGradient} opacity-30`}></div>
        
        <div className="space-y-32">
            {/* 경력 요약 (Start Point) */}
            <div className={`relative flex flex-col md:flex-row items-center justify-between`}>
                <div className={`absolute left-6 md:left-1/2 -ml-2.5 w-5 h-5 rounded-full border-4 z-10 shadow-lg bg-white dark:bg-slate-900`} style={{ borderColor: currentStyle.glowColor }}></div>
                <div className={`md:w-[45%] pl-16 md:pl-0 md:text-right md:pr-16`}>
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-4 backdrop-blur-sm shadow-sm ${currentStyle.pill}`}>ABOUT ME</span>
                    <div className={`p-8 rounded-2xl backdrop-blur-md shadow-xl ${cardBg} ${cardBorder} border`}>
                        <h3 className={`text-2xl font-bold mb-4 ${titleText} font-serif`}>Career Summary</h3>
                        <p className={`text-base leading-relaxed ${descText} whitespace-pre-line`}>{answers.career_summary || "입력된 경력 사항이 없습니다."}</p>
                    </div>
                </div>
                <div className="hidden md:block md:w-[45%]"></div>
            </div>

            {/* 프로젝트 리스트 */}
            {projects.map((item, idx) => (
                <div key={item.step} className={`relative flex flex-col md:flex-row items-center justify-between ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`absolute left-6 md:left-1/2 -ml-2.5 w-5 h-5 rounded-full border-4 z-10 shadow-lg bg-white dark:bg-slate-900`} style={{ borderColor: currentStyle.glowColor }}></div>
                    <div className={`hidden md:block md:w-[45%] ${idx % 2 === 0 ? 'text-right pr-16' : 'text-left pl-16'}`}>
                         <span className={`text-6xl font-black opacity-10 ${titleText}`}>{item.step}</span>
                    </div>
                    <div className={`md:w-[45%] pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:text-left md:pl-16' : 'md:text-right md:pr-16'}`}>
                        <div className={`p-8 rounded-2xl backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${cardBg} ${cardBorder} border`}>
                            <h3 className={`text-2xl font-bold mb-4 ${titleText} font-serif`}>{item.title}</h3>
                            <p className={`text-base leading-relaxed ${descText}`}>{item.desc}</p>
                            {item.link && (
                                <a href={item.link} target="_blank" rel="noreferrer" className={`inline-block mt-4 text-sm font-bold underline ${currentStyle.textHighlight}`}>
                                    자세히 보기 →
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      <footer className="text-center pb-20 relative z-10">
          <div className="mb-4">
             <p className={titleText}>Contact</p>
             <p className={descText}>{answers.email}</p>
          </div>
          <button className={`px-10 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-lg border-2 ${currentStyle.textHighlight} border-current bg-white dark:bg-slate-900`}>전체 포트폴리오 다운로드</button>
      </footer>
    </div>
  );
}