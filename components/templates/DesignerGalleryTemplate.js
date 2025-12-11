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

// 기본 레이아웃 (헤더 + 갤러리 6개 + 연락처)
const defaultLayouts = {
  lg: [
    { i: 'header', x: 0, y: 0, w: 3, h: 2 },
    { i: 'item-1', x: 0, y: 2, w: 1, h: 2 },
    { i: 'item-2', x: 1, y: 2, w: 1, h: 2 },
    { i: 'item-3', x: 2, y: 2, w: 1, h: 2 },
    { i: 'item-4', x: 0, y: 4, w: 1, h: 2 },
    { i: 'item-5', x: 1, y: 4, w: 1, h: 2 },
    { i: 'item-6', x: 2, y: 4, w: 1, h: 2 },
    { i: 'contact', x: 1, y: 6, w: 1, h: 2 },
  ],
  md: [
    { i: 'header', x: 0, y: 0, w: 2, h: 2 },
    { i: 'item-1', x: 0, y: 2, w: 1, h: 2 },
    { i: 'item-2', x: 1, y: 2, w: 1, h: 2 },
    // ... (md 사이즈 생략, 자동 정렬됨)
  ]
};

export default function DesignerGalleryTemplate({ answers, isEditing }) {
  const selectedMoods = answers.moods || [];
  const selectedBgmTitle = answers.bgm || "음악 없음 (Mute)";
  const currentStyle = getStyleByMood(selectedMoods);
  
  const [mounted, setMounted] = useState(false);
  const [layouts, setLayouts] = useState(defaultLayouts);

  // 프로젝트 데이터 파싱
  const projects = [];
  for (let i = 1; i <= 6; i++) {
    if (answers[`design_project${i}_title`]) {
      projects.push({
        id: i,
        title: answers[`design_project${i}_title`],
        type: answers[`design_type_${i}`],
        src: answers[`design_type_${i}`] === 'file' ? answers[`design_project${i}_file`] : answers[`design_project${i}_link`]
      });
    }
  }

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLayout = localStorage.getItem('gallery_layout');
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
    localStorage.setItem('gallery_layout', JSON.stringify(allLayouts));
  };

  const cardBg = "bg-white/90 dark:bg-black/40";
  const cardBorder = "border-slate-200 dark:border-white/10";
  const titleText = "text-slate-900 dark:text-white";
  const subText = "text-slate-600 dark:text-slate-400";
  const dragStyle = isEditing ? "cursor-move ring-2 ring-emerald-400 ring-offset-2 ring-offset-transparent z-50" : "";

  // 리사이즈 핸들
  const ResizeHandle = () => (
    isEditing && (
      <div className="absolute bottom-1 right-1 text-emerald-500 z-50 pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM14 22H12V20H14V22ZM18 18H16V16H18V18Z" /></svg>
      </div>
    )
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative p-6 md:p-10 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <PortfolioBackground moods={selectedMoods} />



      <main className="relative z-10 max-w-7xl mx-auto pt-10 pb-20">
        
        {isEditing && <div className="mb-4 text-center p-2 bg-emerald-500/20 text-emerald-400 rounded-lg animate-pulse">✨ 편집 모드: 박스를 드래그하거나 크기를 조절해보세요!</div>}

        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 3, md: 2, sm: 1, xs: 1, xxs: 1 }}
          rowHeight={150}
          onLayoutChange={onLayoutChange}
          isDraggable={isEditing}
          isResizable={isEditing}
          margin={[16, 16]}
        >
          {/* Header */}
          <div key="header" className={`flex flex-col justify-center text-center ${dragStyle}`}>
              <h1 className={`text-6xl md:text-8xl font-black tracking-tighter mb-4 ${titleText} font-serif select-none`}>
                {answers.name || "Designer"}
              </h1>
              <p className={`text-xl font-medium ${subText} select-none`}>
                {answers.job || "Visual Designer"} | <span className={`${currentStyle.textHighlight}`}>{answers.strength || "Portfolio"}</span>
              </p>
              <ResizeHandle />
          </div>

          {/* Projects */}
          {projects.map((item) => (
            <div key={`item-${item.id}`} className={`group relative rounded-2xl overflow-hidden shadow-lg ${cardBg} ${cardBorder} border hover:ring-4 ${currentStyle.accentRing} ${dragStyle}`}>
               <div className="w-full h-full flex items-center justify-center relative bg-gray-100 dark:bg-gray-800">
                  {item.type === 'file' && item.src ? (
                      <img src={item.src} alt={item.title} className="w-full h-full object-cover pointer-events-none" />
                  ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center select-none">
                          <span className="text-4xl mb-2 opacity-50">🔗</span>
                          <span className="text-xs text-slate-400 break-all px-4">{item.src || "No Link"}</span>
                      </div>
                  )}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-linear-to-br ${currentStyle.headerGradient} transition-opacity`}></div>
               </div>
               <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className={`text-xs font-bold uppercase tracking-widest mb-1 ${currentStyle.textHighlight}`}>PROJECT 0{item.id}</span>
                  <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
               </div>
               <ResizeHandle />
            </div>
          ))}

          {/* Contact */}
          <div key="contact" className={`group relative rounded-2xl overflow-hidden shadow-lg border ${cardBorder} flex items-center justify-center flex-col p-6 ${cardBg} ${dragStyle}`}>
              <div className="text-4xl mb-4 select-none">✨</div>
              <h3 className={`text-2xl font-bold ${titleText} mb-2 select-none`}>Contact Me</h3>
              <p className={`${subText} select-none`}>{answers.email}</p>
              <ResizeHandle />
          </div>

        </ResponsiveGridLayout>
      </main>
    </div>
  );
}