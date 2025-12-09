import PortfolioBackground from "../PortfolioBackground";
import { getStyleByMood } from "./moodColorMap";

export default function DesignerCaseStudyTemplate({ answers }) {
  const selectedMoods = answers.moods || [];
  const currentStyle = getStyleByMood(selectedMoods);
  
  // 프로젝트 데이터
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

  const baseBg = "bg-white/90 dark:bg-slate-900/90";
  const titleText = "text-slate-900 dark:text-white";
  const subText = "text-slate-600 dark:text-slate-400";
  const cardBg = "bg-white dark:bg-slate-800";
  const borderStyle = "border border-slate-200 dark:border-slate-700";

  return (
    <div className="min-h-screen relative font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <PortfolioBackground moods={selectedMoods} />

      <main className="relative z-10 max-w-5xl mx-auto py-16 px-6 md:px-12">
        {/* 헤더 */}
        <header className="mb-24 text-center md:text-left">
          <span className={`inline-block py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border ${currentStyle.pill}`}>
            UX/UI Case Studies
          </span>
          <h1 className={`text-5xl md:text-7xl font-bold leading-tight mb-6 ${titleText}`}>
            Thinking beyond pixels,<br />
            Designing <span className={`text-transparent bg-clip-text bg-linear-to-r ${currentStyle.headerGradient}`}>Impact.</span>
          </h1>
          <div className={`p-6 rounded-2xl bg-white/50 dark:bg-black/20 border ${borderStyle} backdrop-blur-sm`}>
              <p className={`text-lg md:text-xl ${subText} leading-relaxed`}>
                "안녕하세요, <b>{answers.name}</b>입니다. <br/>
                {answers.career_summary || "사용자 중심의 논리적인 해결책을 설계합니다."}"
              </p>
          </div>
        </header>

        {/* 프로젝트 리스트 */}
        <section className="space-y-16">
          {projects.map((study, index) => (
            <article 
              key={study.id} 
              className={`group relative flex flex-col md:flex-row gap-8 p-8 rounded-3xl transition-all duration-300 hover:shadow-xl ${cardBg} ${borderStyle}`}
            >
              {/* 왼쪽: 타이틀 및 정보 */}
              <div className="w-full md:w-1/3 flex flex-col justify-between space-y-6">
                <div>
                  <span className={`text-6xl font-black opacity-10 absolute top-4 left-6 pointer-events-none ${titleText}`}>
                    0{index + 1}
                  </span>
                  <div className="relative z-10">
                    <h2 className={`text-3xl font-bold mb-2 group-hover:underline decoration-2 underline-offset-4 ${titleText}`}>
                      {study.title}
                    </h2>
                    <p className={`text-sm font-medium ${currentStyle.textHighlight} mb-4`}>
                      {study.type === 'file' ? "Design Work" : "Web/App Link"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 오른쪽: 이미지 또는 링크 미리보기 */}
              <div className="w-full md:w-2/3 border-l-0 md:border-l border-slate-200 dark:border-slate-700 md:pl-8 flex flex-col justify-center">
                 <div className="aspect-video w-full bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-600">
                    {study.type === 'file' && study.src ? (
                        <img src={study.src} alt={study.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                            <span className="text-4xl mb-2">🔗</span>
                            <span className="text-sm px-4 text-center break-all">{study.src || "Link not provided"}</span>
                        </div>
                    )}
                 </div>

                 <div className="pt-6 flex justify-end">
                    {study.type === 'link' && study.src ? (
                        <a href={study.src} target="_blank" rel="noreferrer" className={`text-sm font-bold flex items-center gap-2 transition-colors hover:gap-3 ${titleText}`}>
                           Visit Project <span>→</span>
                        </a>
                    ) : (
                        <span className={`text-sm text-slate-400`}>Image Only</span>
                    )}
                 </div>
              </div>
            </article>
          ))}
        </section>

        {/* 하단 CTA */}
        <section className="mt-32 text-center">
          <h2 className={`text-3xl font-bold mb-6 ${titleText}`}>
            Contact
          </h2>
          <a href={`mailto:${answers.email}`} className={`inline-block px-8 py-4 rounded-full text-white font-bold shadow-lg transition-transform hover:-translate-y-1 bg-linear-to-r ${currentStyle.headerGradient}`}>
            {answers.email}
          </a>
        </section>

      </main>
    </div>
  );
}