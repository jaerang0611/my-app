import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

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
  "Smart & Professional": [
    "/music/Midnight Logic.mp3",
    "/music/Deep Dive.mp3",
    "/music/Urban Step.mp3",
    "/music/Gray Jazz.mp3",
    "/music/Afternoon Tea.mp3"
  ],
  "Emotion & Storytelling": [
    "/music/Modern Art.mp3",
    "/music/Silent Space.mp3",
    "/music/White Page.mp3",
    "/music/Wooden Memory.mp3",
    "/music/Silk Wave.mp3",
    "/music/Fresh Awake.mp3"
  ],
  "Impact & Creative": [
    "/music/The Voyage.mp3",
    "/music/Mystic East.mp3",
    "/music/The Legend.mp3",
    "/music/Glorious Moment.mp3"
  ],
  "Mute": null
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
  const [currentSongTitle, setCurrentSongTitle] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  
  // --- BGM History Logic ---
  const [songHistory, setSongHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // 🎵 Function to play a specific song URL
  const playSong = (bgmUrl) => {
    if (bgmUrl) {
      const title = bgmUrl.split('/').pop().replace('.mp3', '');
      setCurrentSongTitle(decodeURIComponent(title));
      if (!audioRef.current) audioRef.current = new Audio(bgmUrl);
      else audioRef.current.src = bgmUrl;

      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      setCurrentSongTitle('');
    }
  };

  // 🎵 Function to play the next song (random or from history)
  const playNextSong = () => {
    if (!userData) return;

    // If we are in the middle of history, play the next song from history
    if (historyIndex < songHistory.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      playSong(songHistory[nextIndex]);
      return;
    }

    // Otherwise, play a new random song
    const selectedBgmCategory = userData.bgm || "음악 없음 (Mute)";
    const musicList = bgmFiles[selectedBgmCategory];
    if (Array.isArray(musicList) && musicList.length > 0) {
      let randomIndex;
      let nextSongUrl;
      // Avoid playing the same song twice in a row if possible
      do {
        randomIndex = Math.floor(Math.random() * musicList.length);
        nextSongUrl = musicList[randomIndex];
      } while (musicList.length > 1 && nextSongUrl === songHistory[historyIndex]);

      const newHistory = [...songHistory, nextSongUrl];
      setSongHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      playSong(nextSongUrl);
    }
  };
  
  // 🎵 Function to play the previous song from history
  const playPreviousSong = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      playSong(songHistory[prevIndex]);
    }
  };

  // Main BGM useEffect: Triggers when the BGM *category* changes
  useEffect(() => {
    if (userData?.bgm) {
      setSongHistory([]);
      setHistoryIndex(-1);
      playNextSong(); 
    }
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, [userData?.bgm]);

  // General useEffects for setup and data saving
  useEffect(() => {
    const savedData = localStorage.getItem('portfolio_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserData(parsed);
      setInitialJob(parsed.job);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      localStorage.setItem('portfolio_data', JSON.stringify(userData));
    }
  }, [userData]);

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
        <AnimatePresence>
          {userData.bgm !== "Mute" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg text-white"
            >
              <button 
                onClick={playPreviousSong}
                disabled={historyIndex <= 0}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 17 6 12 11 7 11 17"></polygon><polygon points="18 17 13 12 18 7 18 17"></polygon></svg>
              </button>
              <button 
                onClick={togglePlay} 
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all group"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h4v16H6zM14 4h4v16h-4z"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                )}
              </button>
              <button 
                onClick={playNextSong} 
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 17 18 12 13 7 13 17"></polygon><polygon points="6 17 11 12 6 7 6 17"></polygon></svg>
              </button>
              <div className="flex flex-col justify-center w-32">
                <div className="w-full overflow-hidden">
                  <p className="text-sm font-bold whitespace-nowrap marquee">{currentSongTitle || 'Loading...'}</p>
                </div>
                <div className="w-full flex items-center gap-2 mt-1">
                  <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                    {isMuted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>
                    )}
                  </button>
                  <input 
                    type="range" min="0" max="1" step="0.05" 
                    value={volume} onChange={handleVolumeChange} 
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 10s linear infinite;
        }
        @keyframes marquee {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

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