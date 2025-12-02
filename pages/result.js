import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Result() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('portfolio_result');
    if (storedData) {
      try {
        setData(JSON.parse(storedData));
      } catch (e) {
        console.error("JSON 파싱 에러:", e);
      }
    }
  }, []);

  if (!data) return <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">Loading... 🎨</div>;

  const mainColor = data.theme?.color || '#a855f7'; 

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans">
      
      {/* 1. Hero Section (넓게!) */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 pointer-events-none"
          style={{ backgroundColor: mainColor }}
        ></div>

        <span className="text-8xl mb-8 animate-bounce">{data.theme?.mood_emoji}</span>
        
        <h1 className="text-6xl md:text-8xl font-extrabold mb-8 tracking-tight leading-tight max-w-5xl">
          {data.hero?.title}
        </h1>
        
        <p className="text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
          {data.hero?.subtitle}
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          {data.hero?.tags?.map((tag, i) => (
            <span key={i} className="px-6 py-3 rounded-full border border-white/20 bg-white/5 text-lg backdrop-blur-md">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* 2. About & Projects (컨테이너 폭 확장: max-w-7xl) */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* About */}
        <section className="mb-32">
          <h2 className="text-4xl font-bold mb-10 flex items-center gap-4">
            <span style={{ color: mainColor }}>01.</span> About Me
          </h2>
          <div className="bg-gray-900/50 p-10 rounded-3xl border border-white/10">
            <h3 className="text-3xl font-bold mb-6">{data.about?.intro}</h3>
            <p className="text-gray-300 leading-relaxed text-xl whitespace-pre-line">
              {data.about?.description}
            </p>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-32">
          <h2 className="text-4xl font-bold mb-10 flex items-center gap-4">
            <span style={{ color: mainColor }}>02.</span> Projects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {data.projects?.map((project, i) => (
              <div key={i} className="group relative bg-gray-900 border border-gray-800 rounded-3xl p-10 hover:border-gray-600 transition-all hover:-translate-y-2">
                <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
                <p className="text-xl text-gray-400 mb-6 font-medium">{project.desc}</p>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {project.detail}
                </p>
                <div className="flex gap-3 flex-wrap">
                  {project.tags?.map((tag, idx) => (
                    <span key={idx} className="text-sm px-3 py-1 bg-white/10 rounded-full text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="text-center py-32 border-t border-white/10">
        <h2 className="text-5xl font-bold mb-10">Let's work together!</h2>
        <div className="flex justify-center gap-8 text-xl">
          <a href={`mailto:${data.contact?.email}`} className="hover:text-white text-gray-400">Email</a>
          <span className="text-gray-600">|</span>
          <a href={data.contact?.github} className="hover:text-white text-gray-400">GitHub</a>
        </div>
        <div className="mt-16">
          <Link href="/">
             <button className="px-8 py-4 rounded-xl border border-gray-700 text-lg hover:bg-gray-800 transition-all">
               🔄 다시 만들기
             </button>
          </Link>
        </div>
      </footer>

    </div>
  );
}