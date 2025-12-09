import PortfolioBackground from "../PortfolioBackground";
import { getStyleByMood } from "./moodColorMap";

export default function DesignerMagazineTemplate({ answers }) {
  const selectedMoods = answers.moods || [];
  const currentStyle = getStyleByMood(selectedMoods);
  
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

  // 레이아웃 스타일 클래스 (순서대로 반복)
  const layoutClasses = [
      "md:col-span-2 md:aspect-video", // 1번: 큼
      "md:col-span-1 md:aspect-[3/4]", // 2번: 세로
      "md:col-span-1 md:aspect-[4/3]", // 3번: 가로
      "md:col-span-2 md:aspect-[16/9]"  // 4번: 와이드
  ];

  const baseBg = "bg-white/95 dark:bg-slate-900/95";
  const subText = "text-slate-600 dark:text-slate-400";
  const titleText = "text-slate-900 dark:text-white";

  return (
    <div className="min-h-screen relative font-serif bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <PortfolioBackground moods={selectedMoods} />

      <main className="relative z-10 max-w-7xl mx-auto py-12 px-6 md:px-12">
        
        {/* 헤더 */}
        <header className="mb-20 pt-10 border-b border-white/10 dark:border-white/10">
          <p className={`text-sm font-sans tracking-widest uppercase mb-4 ${currentStyle.textHighlight}`}>
            {answers.job} / {answers.strength}
          </p>
          <h1 className={`text-7xl md:text-9xl font-extrabold tracking-tighter mb-8 ${titleText} wrap-break-word`}>
            {answers.name || "Portfolio"}
          </h1>
          {answers.career_summary && (
            <p className={`text-xl md:text-2xl font-light italic ${subText} mb-12 border-l-4 pl-6 border-current opacity-80`}>
                "{answers.career_summary}"
            </p>
          )}
        </header>

        {/* 프로젝트 그리드 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((item, index) => {
             // 레이아웃 클래스 순환 할당
             const styleClass = layoutClasses[index % layoutClasses.length];
             
             return (
                <div 
                  key={item.id} 
                  className={`${styleClass} rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] 
                            ${baseBg} ${titleText} border border-transparent hover:border-slate-300 relative overflow-hidden group`}
                >
                  <div className="flex flex-col h-full justify-between relative z-10">
                      {/* 상단 정보 */}
                      <div className="flex justify-between items-start mb-4">
                          <span className={`text-xs font-sans font-semibold uppercase ${subText}`}>PROJECT 0{item.id}</span>
                          <span className={`text-xs font-sans font-bold px-3 py-1 rounded-full border ${currentStyle.pill}`}>
                              {new Date().getFullYear()}
                          </span>
                      </div>

                      {/* 중앙 컨텐츠 */}
                      <div className="flex-1 my-4 flex items-center justify-center relative">
                          {item.type === 'file' && item.src ? (
                              <img src={item.src} alt={item.title} className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                          ) : (
                              <div className={`absolute inset-0 opacity-10 dark:opacity-20 bg-linear-to-tr ${currentStyle.headerGradient} rounded-xl`}></div>
                          )}
                          
                          {/* 텍스트는 이미지 위에 뜸 */}
                          <h2 className={`relative text-4xl md:text-5xl font-black leading-tight ${titleText} text-center drop-shadow-lg z-20 mix-blend-difference text-white`}>
                              {item.title}
                          </h2>
                      </div>

                      {/* 하단 설명 */}
                      <div className={`text-sm ${subText} mt-4 pt-4 border-t border-slate-300 dark:border-white/10 flex justify-between items-center`}>
                          <span>{item.type === 'file' ? 'Image Work' : 'Link Available'}</span>
                          {item.type === 'link' && item.src && (
                              <a href={item.src} target="_blank" rel="noreferrer" className="underline hover:text-blue-500">Visit Link ↗</a>
                          )}
                      </div>
                  </div>
                </div>
             );
          })}
        </section>

      </main>
      
      <footer className="relative z-10 py-20 text-center">
          <p className={subText}>© {new Date().getFullYear()} {answers.name}</p>
          <p className={`text-xs mt-2 ${subText}`}>{answers.email}</p>
      </footer>
    </div>
  );
}