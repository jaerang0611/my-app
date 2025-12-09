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

export default function ServiceWikiTemplate({ answers }) {
  const selectedMoods = answers.moods || [];
  const selectedBgmTitle = answers.bgm || "음악 없음 (Mute)";
  const currentStyle = getStyleByMood(selectedMoods);
  
  // 프로젝트 데이터
  const projects = [];
  for (let i = 1; i <= 3; i++) {
    if (answers[`project${i}_title`]) {
      projects.push({
        id: `proj-${i}`,
        title: answers[`project${i}_title`],
        desc: answers[`project${i}_desc`],
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

  const pageBg = "bg-white dark:bg-[#191919]";
  const textMain = "text-[#37352f] dark:text-[#d9d9d9]";
  const textSub = "text-slate-500 dark:text-slate-400";
  const borderLine = "border-slate-200 dark:border-white/10";
  const hoverBg = "hover:bg-slate-100 dark:hover:bg-white/5";

  return (
    <div className="min-h-screen relative font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <PortfolioBackground moods={selectedMoods} />
      
      {selectedBgmTitle !== "음악 없음 (Mute)" && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 p-3 rounded-full backdrop-blur-md border border-white/20 bg-white/10 shadow-lg`}>
          <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white">{isPlaying ? "⏸" : "▶"}</button>
        </div>
      )}

      <div className="flex relative z-10 max-w-7xl mx-auto min-h-screen">
         {/* Sidebar */}
         <aside className={`w-64 hidden lg:block shrink-0 sticky top-0 h-screen overflow-y-auto p-6 ${pageBg} ${borderLine} border-r`}>
             <div className="pt-10">
                 <h1 className={`text-xl font-black mb-6 ${textMain}`}>
                     <span className="text-2xl mr-2">📑</span>Wiki
                 </h1>
                 <nav className="space-y-2">
                     <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{answers.name}'s Space</h3>
                     <a href="#intro" className={`block px-3 py-2 rounded-lg text-sm ${hoverBg} ${textMain}`}>1. Introduction</a>
                     <a href="#projects" className={`block px-3 py-2 rounded-lg text-sm ${hoverBg} ${textMain}`}>2. Key Projects</a>
                     {projects.map(p => (
                         <a key={p.id} href={`#${p.id}`} className={`block px-3 py-2 ml-4 rounded-lg text-xs ${hoverBg} ${textSub}`}>- {p.title}</a>
                     ))}
                 </nav>
             </div>
         </aside>

         {/* Main Content */}
         <main className={`flex-1 overflow-y-auto p-8 md:p-12 lg:p-16 ${pageBg}`}>
             {/* Cover */}
             <div className={`h-40 w-full relative overflow-hidden bg-linear-to-r ${currentStyle.headerGradient} opacity-90 rounded-xl mb-10`}>
                 <div className="absolute inset-0 bg-black/10"></div>
                 <div className="absolute bottom-4 left-6 text-white font-bold text-3xl drop-shadow-md font-serif">{answers.name}</div>
             </div>

             <article className="max-w-3xl space-y-16">
                 {/* Intro */}
                 <section id="intro">
                     <h2 className={`text-2xl font-bold mb-4 ${textMain} border-b ${borderLine} pb-2`}>Introduction</h2>
                     <div className={`p-5 rounded-lg border ${borderLine} bg-slate-50 dark:bg-white/5`}>
                        <div className="flex items-center gap-2 mb-2 text-xl">💡 <span className="font-bold">About Me</span></div>
                        <p className={`text-base ${textMain} leading-relaxed whitespace-pre-line`}>
                            {answers.intro || "소개가 없습니다."}
                        </p>
                        <div className={`mt-4 text-sm ${textSub} pt-4 border-t ${borderLine}`}>
                             {answers.career_summary}
                        </div>
                     </div>
                 </section>

                 {/* Projects */}
                 <section id="projects">
                     <h2 className={`text-2xl font-bold mb-6 ${textMain} border-b ${borderLine} pb-2`}>Key Projects</h2>
                     <div className="space-y-8">
                         {projects.map((proj, i) => (
                             <div key={proj.id} id={proj.id}>
                                 <h3 className={`text-xl font-bold mb-2 ${textMain} flex items-center gap-2`}>
                                     <span className="text-slate-400 text-sm">0{i+1}.</span> {proj.title}
                                 </h3>
                                 <p className={`text-base ${textSub} leading-relaxed whitespace-pre-line mb-3 pl-6 border-l-2`} style={{borderColor: currentStyle.glowColor}}>
                                     {proj.desc}
                                 </p>
                                 {proj.link && (
                                     <a href={proj.link} target="_blank" rel="noreferrer" className="ml-6 text-sm text-blue-500 hover:underline">
                                         🔗 Reference Link
                                     </a>
                                 )}
                             </div>
                         ))}
                     </div>
                 </section>
             </article>
         </main>
      </div>
    </div>
  );
}