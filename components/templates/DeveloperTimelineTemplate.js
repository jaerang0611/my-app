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

export default function DeveloperTimelineTemplate({ answers }) {
  const selectedMoods = answers.moods || [];
  const selectedBgmTitle = answers.bgm || "음악 없음 (Mute)";
  const currentStyle = getStyleByMood(selectedMoods);
  
  // 프로젝트 데이터 변환
  const projects = [];
  for (let i = 1; i <= 3; i++) {
    if (answers[`project${i}_title`]) {
      projects.push({
        id: i,
        year: `PROJECT 0${i}`,
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

  const baseBg = "bg-white/90 dark:bg-slate-900/90";
  const baseBorder = "border-slate-200 dark:border-white/10";
  const baseShadow = "shadow-xl dark:shadow-2xl dark:shadow-black/50";
  const baseText = "text-slate-900 dark:text-white";
  const subText = "text-slate-600 dark:text-slate-400";

  return (
    <div className="min-h-screen relative p-8 md:p-12 bg-gray-50 dark:bg-gray-900 text-slate-900 dark:text-white transition-colors duration-500">
      <PortfolioBackground moods={selectedMoods} />



      <main className="relative z-10 max-w-4xl mx-auto pt-10 pb-20">
        
        {/* 헤더 */}
        <header className={`p-8 rounded-2xl backdrop-blur-lg transition-all duration-500 ${baseBg} ${baseBorder} ${baseShadow} mb-12`}>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className={`w-20 h-20 rounded-full border-4 ${baseBorder} bg-slate-300 dark:bg-slate-700 shrink-0 flex items-center justify-center text-3xl`}>
               💻
            </div>
            <div className="text-center md:text-left">
              <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${currentStyle.textHighlight} font-serif`}>
                {answers.name || "Developer"}
              </h1>
              <p className={`text-lg font-medium ${subText} mt-2`}>
                {answers.job} | {answers.strength}
              </p>
              <p className={`text-sm ${subText} mt-2 max-w-lg whitespace-pre-line`}>
                {answers.intro || "안녕하세요, 코드로 가치를 만드는 개발자입니다."}
              </p>
            </div>
          </div>
          
          <div className={`mt-6 pt-4 border-t ${baseBorder} grid grid-cols-1 md:grid-cols-2 gap-4 text-sm ${subText}`}>
             <p>📞 {answers.phone || "연락처 없음"}</p>
             <p>📧 {answers.email || "이메일 없음"}</p>
             <p className="md:col-span-2 text-blue-500 hover:underline"><a href={answers.link} target="_blank" rel="noreferrer">🔗 {answers.link || "링크 없음"}</a></p>
          </div>
        </header>

        {/* 타임라인 섹션 */}
        <section className="relative pt-8">
          <h2 className={`text-3xl font-bold mb-12 tracking-tight ${baseText} font-serif text-center md:text-left`}>
            Problem Solving Log
          </h2>

          <div className={`absolute left-4 md:left-1/2 md:-translate-x-1/2 top-24 bottom-0 w-0.5 opacity-40`} style={{ backgroundColor: currentStyle.glowColor }}></div>

          {projects.map((project, index) => (
            <div key={index} className={`mb-16 flex flex-col md:flex-row relative ${baseText} ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              
              {/* 타임라인 점 */}
              <div className={`absolute left-4 md:left-1/2 top-0 w-4 h-4 rounded-full z-10 -translate-x-[7px] md:-translate-x-1/2 border-2 bg-white dark:bg-gray-900`} style={{ borderColor: currentStyle.glowColor }}></div>

              {/* 날짜/라벨 */}
              <div className={`md:w-1/2 md:px-10 mb-2 md:mb-0 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'} pl-10 md:pl-0`}>
                 <span className={`text-sm font-bold px-2 py-1 rounded ${currentStyle.pill}`}>{project.year}</span>
              </div>

              {/* 프로젝트 카드 */}
              <div className={`w-full md:w-1/2 pl-10 md:pl-0 ${index % 2 === 0 ? 'md:pl-10' : 'md:pr-10'}`}>
                <div className={`p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] ${baseBg} ${baseBorder} ${baseShadow} hover:ring-1 ${currentStyle.accentRing}`}>
                  <h3 className={`text-xl font-bold ${baseText} mb-2`}>{project.title}</h3>
                  <p className={`text-sm ${subText} mb-4 leading-relaxed`}>{project.desc}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noreferrer" className="text-xs font-mono text-blue-500 hover:underline">
                        View Project →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>

      </main>
    </div>
  );
}