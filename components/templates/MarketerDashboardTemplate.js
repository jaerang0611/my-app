import { useState, useEffect, useRef } from 'react';
import { Responsive, WidthProvider } from "react-grid-layout";
import PortfolioBackground from "../PortfolioBackground";
import { getStyleByMood } from "./moodColorMap";

const ResponsiveGridLayout = WidthProvider(Responsive);

const bgmFiles = {
  "새벽 코딩 (Lo-Fi)": "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3", 
  "카페 백색소음 (Jazz)": "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
  "활기찬 시작 (Pop)": "https://cdn.pixabay.com/download/audio/2022/10/25/audio_9593259345.mp3",
  "깊은 집중 (Ambient)": "https://cdn.pixabay.com/download/audio/2022/03/10/audio_5b98f26703.mp3",
  "음악 없음 (Mute)": null
};

// 기본 레이아웃
const defaultLayouts = {
  lg: [
    { i: 'profile', x: 0, y: 0, w: 3, h: 2 },
    { i: 'metric', x: 3, y: 0, w: 1, h: 1 },
    { i: 'tools', x: 3, y: 1, w: 1, h: 2 },
    { i: 'project-main', x: 0, y: 2, w: 3, h: 2 },
  ]
};

export default function MarketerDashboardTemplate({ answers, isEditing }) {
  const selectedMoods = answers.moods || [];
  const selectedBgmTitle = answers.bgm || "음악 없음 (Mute)";
  const style = getStyleByMood(selectedMoods);
  
  const [mounted, setMounted] = useState(false);
  const [layouts, setLayouts] = useState(defaultLayouts);

  const projects = [];
  for (let i = 1; i <= 3; i++) {
    if (answers[`project${i}_title`]) {
      projects.push({ id: i, title: answers[`project${i}_title`], desc: answers[`project${i}_desc`], link: answers[`project${i}_link`] });
    }
  }

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLayout = localStorage.getItem('dashboard_layout');
    if (savedLayout) setLayouts(JSON.parse(savedLayout));
  }, []);

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

  const onLayoutChange = (currentLayout, allLayouts) => {
    setLayouts(allLayouts);
    localStorage.setItem('dashboard_layout', JSON.stringify(allLayouts));
  };

  const cardClass = `bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg overflow-hidden flex flex-col justify-between`;
  const dragStyle = isEditing ? "cursor-move ring-2 ring-emerald-400 z-50" : "";
  const ResizeHandle = () => isEditing ? <div className="absolute bottom-1 right-1 text-emerald-500 z-50 pointer-events-none">◢</div> : null;

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-slate-100 font-sans relative overflow-x-hidden bg-gray-900 transition-colors duration-500">
      <PortfolioBackground moods={selectedMoods} />



      <main className="relative z-10 max-w-6xl mx-auto pt-10 pb-20 px-4">
        
        {isEditing && <div className="mb-4 text-center p-2 bg-emerald-500/20 text-emerald-400 rounded-lg animate-pulse">✨ 편집 모드: 대시보드 위젯을 자유롭게 배치해보세요!</div>}

        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
          rowHeight={150}
          onLayoutChange={onLayoutChange}
          isDraggable={isEditing}
          isResizable={isEditing}
          margin={[16, 16]}
        >
           {/* 1. Profile */}
           <div key="profile" className={`${cardClass} ${dragStyle}`}>
               <div className={`absolute right-0 top-0 w-64 h-64 bg-linear-to-br ${style.headerGradient} opacity-20 blur-3xl`} />
               <h1 className="text-4xl font-bold mb-2 z-10 font-serif select-none">{answers.name}'s Lab</h1>
               <p className="text-slate-300 z-10 text-lg select-none">{answers.intro}</p>
               <div className="flex gap-2 mt-4 z-10">
                 {selectedMoods.map(tag => <span key={tag} className={`text-[10px] px-2 py-1 rounded border bg-white/5 ${style.pill}`}>{tag}</span>)}
               </div>
               <ResizeHandle />
           </div>

           {/* 2. Key Metric */}
           <div key="metric" className={`${cardClass} items-center justify-center text-center ring-1 ${style.accentRing} ${dragStyle}`}>
               <span className="text-sm text-slate-400 mb-1 select-none">Focus</span>
               <span className={`text-3xl font-black drop-shadow-md ${style.textHighlight} wrap-break-word select-none`}>{answers.strength}</span>
               <ResizeHandle />
           </div>

           {/* 3. Tools */}
           <div key="tools" className={`${cardClass} ${dragStyle}`}>
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2 select-none"><span className={`w-2 h-2 rounded-full ${style.dot.replace('bg-', 'bg-')}`}></span> Career</h3>
               <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line select-none">{answers.career_summary}</p>
               <ResizeHandle />
           </div>

           {/* 4. Projects */}
           <div key="project-main" className={`${cardClass} ${dragStyle}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold select-none">Campaigns</h3>
                    <span className={`text-xs px-2 py-1 rounded bg-white/10 ${style.textHighlight} select-none`}>{projects.length} Projects</span>
                </div>
                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    {projects.map((item, idx) => (
                        <div key={idx} className="group p-4 rounded-2xl bg-white/5 border border-white/5">
                            <h4 className={`font-bold text-lg text-white`}>{item.title}</h4>
                            <p className="text-sm text-slate-400 mb-2">{item.desc}</p>
                        </div>
                    ))}
                </div>
                <ResizeHandle />
           </div>

        </ResponsiveGridLayout>
      </main>
    </div>
  );
}