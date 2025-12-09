import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';

// 무드 이펙트 & 에디터
import MoodEffectLayer from '../components/MoodEffectLayer';
import PortfolioEditor from '../components/PortfolioEditor';

// --- 템플릿 컴포넌트 임포트 ---
// 개발자
import DeveloperTimelineTemplate from '../components/templates/DeveloperTimelineTemplate';
import DeveloperBentoTemplate from '../components/templates/DeveloperBentoTemplate';
import DeveloperDocsTemplate from '../components/templates/DeveloperDocsTemplate';
// 디자이너
import DesignerGalleryTemplate from '../components/templates/DesignerGalleryTemplate';
import DesignerMagazineTemplate from '../components/templates/DesignerMagazineTemplate';
import DesignerCaseStudyTemplate from '../components/templates/DesignerCaseStudyTemplate';
// 마케터
import MarketerDashboardTemplate from '../components/templates/MarketerDashboardTemplate';
import MarketerDeckTemplate from '../components/templates/MarketerDeckTemplate';
import MarketerFeedTemplate from '../components/templates/MarketerFeedTemplate';
// 서비스기획
import ServiceJourneyTemplate from '../components/templates/ServiceJourneyTemplate';
import ServiceRoadmapTemplate from '../components/templates/ServiceRoadmapTemplate';
import ServiceWikiTemplate from '../components/templates/ServiceWikiTemplate';

// BGM 파일 목록
const bgmFiles = {
  "새벽 코딩 (Lo-Fi)": "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3", 
  "카페 백색소음 (Jazz)": "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
  "활기찬 시작 (Pop)": "https://cdn.pixabay.com/download/audio/2022/10/25/audio_9593259345.mp3",
  "깊은 집중 (Ambient)": "https://cdn.pixabay.com/download/audio/2022/03/10/audio_5b98f26703.mp3",
  "음악 없음 (Mute)": null
};

export default function ResultPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // 추천 뱃지용 초기 직무 저장
  const [initialJob, setInitialJob] = useState(null);

  // --- BGM 로직 ---
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const savedData = localStorage.getItem('portfolio_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserData(parsed);
      setInitialJob(parsed.job); 
    }
  }, []);

  // 데이터 변경 시 자동 저장
  useEffect(() => {
    if (userData) {
      localStorage.setItem('portfolio_data', JSON.stringify(userData));
    }
  }, [userData]);

  // BGM 재생
  useEffect(() => {
    if (!userData) return;
    const selectedBgm = userData.bgm || "음악 없음 (Mute)";
    const bgmUrl = bgmFiles[selectedBgm];

    if (bgmUrl) {
      if (!audioRef.current) audioRef.current = new Audio(bgmUrl);
      else audioRef.current.src = bgmUrl;

      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, [userData?.bgm]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause(); else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) audioRef.current.volume = newVol;
  };

  if (!userData) return <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">포트폴리오 생성 중...</div>;

  const { job, strength, moods } = userData;
  const jobKey = job?.toLowerCase() || 'developer';

  // --- [핵심] 템플릿 렌더링 로직 (매칭 강화) ---
  const renderTemplate = () => {
    // 템플릿에 전달할 공통 props
    const props = { 
      answers: userData, 
      moods, 
      isEditing 
    };

    // 1. 개발자 (Developer)
    if (jobKey.includes('develop') || jobKey.includes('개발')) {
      if (strength === 'tech') return <DeveloperDocsTemplate {...props} />;
      if (strength === 'impl') return <DeveloperBentoTemplate {...props} />;
      return <DeveloperTimelineTemplate {...props} />; // 기본값: problem (Timeline)
    }

    // 2. 디자이너 (Designer)
    if (jobKey.includes('design') || jobKey.includes('디자인')) {
      if (strength === 'visual') return <DesignerGalleryTemplate {...props} />;
      if (strength === 'brand') return <DesignerMagazineTemplate {...props} />;
      return <DesignerCaseStudyTemplate {...props} />; // 기본값: ux (CaseStudy)
    }

    // 3. 마케터 (Marketer)
    if (jobKey.includes('market') || jobKey.includes('기획')) {
      if (strength === 'data') return <MarketerDashboardTemplate {...props} />;
      if (strength === 'strategy') return <MarketerDeckTemplate {...props} />;
      return <MarketerFeedTemplate {...props} />; // 기본값: creative (Feed)
    }

    // 4. 서비스 기획/비즈니스 (Service)
    if (jobKey.includes('service') || jobKey.includes('business') || jobKey.includes('비즈니스')) {
      if (strength === 'revenue') return <ServiceJourneyTemplate {...props} />;
      if (strength === 'ops') return <ServiceRoadmapTemplate {...props} />;
      return <ServiceWikiTemplate {...props} />; // 기본값: comm (Wiki)
    }

    // 5. 매칭되는 게 없을 때 (최종 기본값)
    return <DeveloperTimelineTemplate {...props} />;
  };

  return (
    <>
      <MoodEffectLayer mood={moods} />
      
      {/* 템플릿 렌더링 */}
      {renderTemplate()}

      {/* --- [좌측 하단] 컨트롤러 그룹 --- */}
      <div className="fixed bottom-8 left-8 z-50 flex flex-col gap-4 items-start">
        
        {/* 수정 버튼 */}
        <button
          onClick={() => setIsEditing(true)}
          className="p-4 bg-white text-black rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 font-bold group"
        >
          <span>✏️</span>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">Edit & Theme</span>
        </button>

        {/* BGM 플레이어 */}
        {userData.bgm !== "음악 없음 (Mute)" && (
          <div className="flex items-center gap-3 p-3 rounded-full backdrop-blur-md border border-white/20 bg-black/40 shadow-lg text-white">
            <button onClick={togglePlay} className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform">
              {isPlaying ? "⏸" : "▶"}
            </button>
            <div className="flex flex-col pr-2">
              <span className="text-xs font-bold mb-1 px-1 line-clamp-1 max-w-[100px]">
                 {userData.bgm?.split('(')[0] || 'Music'}
              </span>
              <input 
                type="range" min="0" max="1" step="0.1" 
                value={volume} onChange={handleVolumeChange} 
                className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* 에디터 패널 */}
      <AnimatePresence>
        {isEditing && (
            <PortfolioEditor 
                isOpen={isEditing} 
                onClose={() => setIsEditing(false)} 
                answers={userData} 
                setAnswers={setUserData}
                initialJob={initialJob} 
            />
        )}
      </AnimatePresence>
    </>
  );
}