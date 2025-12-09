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

export default function MarketerDeckTemplate({ answers }) {
  const selectedMoods = answers.moods || [];
  const selectedBgmTitle = answers.bgm || "음악 없음 (Mute)";
  const currentStyle = getStyleByMood(selectedMoods);
  
  // 프로젝트 데이터 변환
  const projects = [];
  for (let i = 1; i <= 3; i++) {
    if (answers[`project${i}_title`]) {
      projects.push({
        id: `0${i}`,
        title: answers[`project${i}_title`],
        subtitle: "Key Strategy",
        content: answers[`project${i}_desc`],
        link: answers[`project${i}_link`]
      });
    }
  }

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
  
  const slideBg = "bg-white/95 dark:bg-slate-900/90";
  const slideBorder = "border border-slate-200 dark:border-white/10";
  const textMain = "text-slate-900 dark:text-white";
  const textSub = "text-slate-500 dark:text-slate-400";

  return (
    <div className="min-h-screen relative font-sans py-12 md:py-20 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <PortfolioBackground moods={selectedMoods} />

      {selectedBgmTitle !== "음악 없음 (Mute)" && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 p-3 rounded-full backdrop-blur-md border border-white/20 bg-white/10 shadow-lg`}>
          <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white">{isPlaying ? "⏸" : "▶"}</button>
        </div>
      )}

      <main className="relative z-10 max-w-5xl mx-auto space-y-16">
          
         {/* Slide 1: Cover Page */}
         <div className={`aspect-video w-full ${slideBg} ${slideBorder} rounded-xl shadow-2xl p-10 md:p-20 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl`}>
            <div className={`absolute top-0 right-0 w-2/3 h-full bg-linear-to-l ${currentStyle.headerGradient} opacity-20 dark:opacity-30`}></div>
            <div className="relative z-10">
                <div className={`text-sm font-bold tracking-[0.3em] uppercase mb-6 ${currentStyle.textHighlight}`}>Marketing Strategy Portfolio</div>
                <h1 className={`text-5xl md:text-7xl font-black ${textMain} leading-tight drop-shadow-sm font-serif`}>
                    {answers.name || "Marketer"}<br/>PORTFOLIO
                </h1>
            </div>
            <div className="relative z-10 border-t-2 border-slate-900 dark:border-white pt-8 flex justify-between items-end">
                <div><h2 className={`text-2xl font-bold ${textMain}`}>{answers.job}</h2><p className={textSub}>{answers.strength}</p></div>
                <div className="text-right"><p className={`font-mono text-xs ${textSub}`}>CONFIDENTIAL</p><p className={`font-mono text-xs ${textSub}`}>{new Date().toLocaleDateString()}</p></div>
            </div>
         </div>

         {/* Slide Loop: Projects */}
         {projects.map((slide, i) => (
             <div key={i} className={`aspect-video w-full ${slideBg} ${slideBorder} rounded-xl shadow-xl p-8 md:p-16 flex flex-col relative backdrop-blur-md`}>
                <div className="flex justify-between items-start mb-8 md:mb-12 border-b border-slate-200 dark:border-white/10 pb-6">
                    <div><span className={`text-xs font-bold uppercase tracking-widest ${textSub} mb-1 block`}>{slide.subtitle}</span><h2 className={`text-3xl md:text-4xl font-bold ${textMain}`}>{slide.title}</h2></div>
                    <div className={`text-4xl font-black ${textSub} opacity-20`}>{slide.id}</div>
                </div>
                <div className="flex-1 grid md:grid-cols-2 gap-12 items-center">
                    <p className={`text-xl md:text-2xl font-medium leading-relaxed ${textMain} whitespace-pre-line`}>{slide.content}</p>
                    
                    {/* Visual Placeholder */}
                    <div className="w-full aspect-video bg-slate-100 dark:bg-black/30 rounded-lg border border-dashed border-slate-300 dark:border-white/20 flex items-center justify-center relative overflow-hidden group">
                        <div className={`absolute inset-0 bg-linear-to-br ${currentStyle.headerGradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                        {slide.link ? (
                             <a href={slide.link} target="_blank" rel="noreferrer" className={`font-bold underline ${currentStyle.textHighlight}`}>View Detail ↗</a>
                        ) : (
                             <span className={`font-mono text-sm ${textSub}`}>( Strategy Visualization )</span>
                        )}
                    </div>
                </div>
                <div className="mt-8 flex justify-between text-[10px] font-mono uppercase tracking-widest opacity-50 text-slate-500 dark:text-slate-400"><span>{answers.name} Portfolio</span><span>Page {i+2}</span></div>
             </div>
         ))}
         
         {projects.length === 0 && <div className="text-center text-slate-500">등록된 프로젝트가 없습니다.</div>}

      </main>
    </div>
  );
}