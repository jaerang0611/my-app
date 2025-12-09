import { useState, useEffect, useRef } from 'react';
import { Responsive, WidthProvider } from "react-grid-layout";
import PortfolioBackground from "../PortfolioBackground";
import { getStyleByMood } from "./moodColorMap";

// RGL 설정
const ResponsiveGridLayout = WidthProvider(Responsive);

const bgmFiles = {
  "새벽 코딩 (Lo-Fi)": "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3", 
  "카페 백색소음 (Jazz)": "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
  "활기찬 시작 (Pop)": "https://cdn.pixabay.com/download/audio/2022/10/25/audio_9593259345.mp3",
  "깊은 집중 (Ambient)": "https://cdn.pixabay.com/download/audio/2022/03/10/audio_5b98f26703.mp3",
  "음악 없음 (Mute)": null
};

// 기본 레이아웃 (반응형)
const defaultLayouts = {
  lg: [
    { i: 'profile', x: 0, y: 0, w: 2, h: 2 },
    { i: 'contact', x: 2, y: 0, w: 1, h: 1 },
    { i: 'proj-1', x: 2, y: 1, w: 1, h: 1 },
    { i: 'proj-2', x: 0, y: 2, w: 1, h: 1 },
    { i: 'proj-3', x: 1, y: 2, w: 1, h: 1 },
    { i: 'empty', x: 2, y: 2, w: 1, h: 1 },
  ],
  md: [
    { i: 'profile', x: 0, y: 0, w: 2, h: 2 },
    { i: 'contact', x: 2, y: 0, w: 2, h: 1 },
    { i: 'proj-1', x: 2, y: 1, w: 2, h: 1 },
    { i: 'proj-2', x: 0, y: 2, w: 2, h: 1 },
    { i: 'proj-3', x: 2, y: 2, w: 2, h: 1 },
  ]
};

export default function DeveloperBentoTemplate({ answers, isEditing }) {
  const selectedMoods = answers.moods || [];
  const selectedBgmTitle = answers.bgm || "음악 없음 (Mute)";
  const currentStyle = getStyleByMood(selectedMoods);
  
  const [mounted, setMounted] = useState(false);
  const [layouts, setLayouts] = useState(defaultLayouts);

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

  // BGM 로직
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLayout = localStorage.getItem('bento_layout');
    if (savedLayout) {
      setLayouts(JSON.parse(savedLayout));
    }
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
    localStorage.setItem('bento_layout', JSON.stringify(allLayouts));
  };

  const baseBg = "bg-white/90 dark:bg-slate-900/90";
  const baseBorder = "border-slate-200 dark:border-white/10";
  const baseText = "text-slate-900 dark:text-white";
  const subText = "text-slate-600 dark:text-slate-400";

  // 박스 스타일
  const boxStyle = `rounded-3xl shadow-lg backdrop-blur-md relative overflow-hidden flex flex-col justify-between transition-all ${baseBg} ${baseBorder} border`;
  
  // [수정] 드래그 중일 때 스타일 (흔들림 효과 제거, 테두리만 강조)
  const dragStyle = isEditing ? "cursor-move ring-2 ring-emerald-400 ring-offset-2 ring-offset-transparent z-50" : "";

  // [NEW] 리사이즈 핸들 아이콘 (우측 하단)
  const ResizeHandle = () => (
    isEditing && (
      <div className="absolute bottom-1 right-1 text-emerald-500 z-50 pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM14 22H12V20H14V22ZM18 18H16V16H18V18Z" />
        </svg>
      </div>
    )
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative p-6 md:p-10 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <PortfolioBackground moods={selectedMoods} />

      {selectedBgmTitle !== "음악 없음 (Mute)" && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 p-3 rounded-full backdrop-blur-md border ${baseBorder} bg-white/10 shadow-lg`}>
          <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white hover:scale-105 transition-transform">{isPlaying ? "⏸" : "▶"}</button>
        </div>
      )}

      {/* [수정] 에디터가 열려있으면(isEditing) 오른쪽 여백을 확보해서 가려짐 방지 */}
      <main 
        className={`relative z-10 max-w-6xl mx-auto pt-10 pb-40 transition-all duration-300 ${isEditing ? 'mr-[420px]' : ''}`}
      >
        <header className="mb-12">
          <h1 className={`text-5xl font-extrabold tracking-tight mb-2 ${baseText} font-serif`}>
            {answers.name}
          </h1>
          <p className={`text-xl font-medium ${subText}`}>
             <span className={`font-bold ${currentStyle.textHighlight}`}>Full-Stack Developer</span> Portfolio
          </p>
          {isEditing && (
            <div className="mt-4 p-3 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm inline-flex items-center gap-2 animate-pulse border border-emerald-500/50">
               <span>✋</span> 박스를 드래그하여 옮기고, 우측 하단을 잡아 크기를 조절하세요!
            </div>
          )}
        </header>

        {/* [수정 사항]
            1. draggableHandle 삭제 -> 박스 전체 드래그 가능
            2. isDraggable, isResizable -> isEditing 상태와 연동
            3. rowHeight -> 150으로 조정
        */}
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
          // resizeHandles={['se']} // 기본값(우측하단) 사용
        >
           {/* 1. 프로필 박스 */}
           <div key="profile" className={`${boxStyle} ${dragStyle}`}>
              <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-current opacity-10 blur-3xl" style={{ color: currentStyle.glowColor }}></div>
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                 <div>
                     <h2 className={`text-3xl font-bold ${baseText} mb-2`}>About Me</h2>
                     <p className={`text-lg leading-relaxed ${subText}`}>{answers.intro || "기술로 세상을 더 편리하게 만드는 개발자입니다."}</p>
                     <p className={`mt-4 text-sm ${subText} line-clamp-3`}>{answers.career_summary}</p>
                 </div>
                 <div className="mt-6 flex gap-2 flex-wrap">
                    {selectedMoods.map(m => <span key={m} className={`px-3 py-1 rounded-full text-xs border ${currentStyle.pill}`}>{m}</span>)}
                 </div>
              </div>
              <ResizeHandle />
           </div>

           {/* 2. 연락처 박스 */}
           <div key="contact" className={`${boxStyle} ${dragStyle} p-6 flex flex-col justify-center`}>
              <h3 className={`text-lg font-bold ${baseText} mb-4`}>Contact</h3>
              <div className={`text-sm ${subText} space-y-2`}>
                  <p>📧 {answers.email}</p>
                  <p>📞 {answers.phone}</p>
                  <a href={answers.link} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline truncate block">🔗 Link</a>
              </div>
              <ResizeHandle />
           </div>

           {/* 3. 프로젝트 박스들 */}
           {projects.map((item) => (
             <div key={item.id} className={`${boxStyle} ${dragStyle} p-6 group`}>
                <div className="flex flex-col h-full justify-between">
                   <div>
                      <div className="text-3xl mb-3">🚀</div>
                      <h3 className={`font-bold text-lg ${baseText} mb-2`}>{item.title}</h3>
                      <p className={`text-sm ${subText} line-clamp-3`}>{item.desc}</p>
                   </div>
                   {item.link && (
                     <a href={item.link} target="_blank" rel="noreferrer" className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-500 hover:text-blue-400">
                        View Project ↗
                     </a>
                   )}
                </div>
                <ResizeHandle />
             </div>
           ))}

           {/* 4. 빈 공간 (데코) */}
           <div key="empty" className={`border-2 border-dashed border-slate-300 dark:border-white/10 rounded-3xl flex items-center justify-center text-slate-400 ${isEditing ? 'cursor-move bg-white/5' : ''}`}>
              {isEditing ? "Empty Space" : ""}
              <ResizeHandle />
           </div>

        </ResponsiveGridLayout>
      </main>
    </div>
  );
}