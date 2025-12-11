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

export default function DeveloperDocsTemplate({ answers }) {
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
        content: answers[`project${i}_desc`],
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
  
  const baseBg = "bg-white/95 dark:bg-slate-900/95";
  const baseBorder = "border-slate-200 dark:border-white/10";
  const baseText = "text-slate-900 dark:text-white";
  const subText = "text-slate-600 dark:text-slate-400";
  const highlightColor = currentStyle.textHighlight;

  return (
    <div className="min-h-screen relative p-0 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <PortfolioBackground moods={selectedMoods} />



      <div className="flex relative z-10 max-w-7xl mx-auto min-h-screen">
        
        {/* 사이드바 */}
        <aside className={`w-64 hidden lg:block shrink-0 sticky top-0 h-screen overflow-y-auto p-6 ${baseBg} ${baseBorder} border-r`}>
          <div className="pt-10">
            <h1 className={`text-xl font-black mb-6 ${baseText}`}>
              <span className={`font-mono text-2xl mr-2 ${highlightColor}`}>&lt;/&gt;</span>
              Dev Docs
            </h1>
            
            <nav className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Projects</h3>
              {projects.map((proj) => (
                <a key={proj.id} href={`#${proj.id}`} className={`block px-3 py-2 rounded-lg text-sm transition-colors hover:bg-slate-100 dark:hover:bg-white/5 ${baseText}`}>
                  {proj.title}
                </a>
              ))}
            </nav>
            
            <div className={`mt-8 pt-4 border-t ${baseBorder}`}>
                <p className={`text-sm font-bold ${baseText}`}>{answers.name}</p>
                <p className="text-xs text-slate-400">{answers.email}</p>
            </div>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className={`flex-1 overflow-y-auto p-8 md:p-12 lg:p-16`}>
            <header className="mb-16 pt-10 border-b pb-6 dark:border-white/10">
                <p className={`text-sm font-medium ${subText} mb-2`}>{answers.job} | {answers.strength}</p>
                <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight ${baseText} font-serif`}>Technical Documentation</h1>
                <p className={`mt-4 text-lg ${subText}`}>{answers.intro}</p>
            </header>

            <article className="max-w-3xl space-y-16">
                {projects.map((proj, index) => (
                    <section key={proj.id} id={proj.id}>
                        <h2 className={`text-2xl font-bold mb-4 ${baseText} flex items-center gap-2`}>
                            <span style={{ color: currentStyle.glowColor }}>#</span> {proj.title}
                        </h2>
                        
                        <div className={`p-6 rounded-lg border ${baseBorder} bg-white/50 dark:bg-black/20`}>
                            <p className={`text-lg ${subText} leading-relaxed whitespace-pre-line`}>
                                {proj.content}
                            </p>
                            {proj.link && (
                                <a href={proj.link} target="_blank" rel="noreferrer" className="inline-block mt-4 text-blue-500 hover:underline">
                                    🔗 Repository Link
                                </a>
                            )}
                        </div>

                        {/* 장식용 코드 블록 */}
                        <div className={`mt-4 p-4 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs text-gray-500`}>
                            // Project Configuration loaded...<br/>
                            // Status: Completed<br/>
                            // Year: {2024 - index}
                        </div>
                    </section>
                ))}
            </article>
        </main>
      </div>
    </div>
  );
}