import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Step2({ answers, handleChange }) {
  const router = useRouter();

  // 분위기 태그 목록
  const moods = ["#차분한", "#열정적인", "#신뢰감있는", "#힙한(Hip)", "#창의적인", "#미니멀한", "#클래식한"];
  // BGM 목록
  const bgms = ["새벽 코딩 (Lo-Fi)", "카페 백색소음 (Jazz)", "활기찬 시작 (Pop)", "깊은 집중 (Ambient)", "음악 없음 (Mute)"];

  // 복수 선택 처리 함수 (최대 3개 제한)
  const toggleMood = (tag) => {
    const currentMoods = answers.moods || []; // 기존에 선택한게 없으면 빈 배열
    let newMoods;

    if (currentMoods.includes(tag)) {
      // 이미 선택된 거면 뺌 (취소)
      newMoods = currentMoods.filter(m => m !== tag);
    } else {
      // 새로 선택하는 거면
      if (currentMoods.length >= 3) return; // 3개 꽉 찼으면 무시
      newMoods = [...currentMoods, tag]; // 추가
    }
    handleChange('moods', newMoods);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
          STEP 2. 무드 설정
        </h2>
        <p className="text-gray-400 mb-8">포트폴리오의 분위기를 결정합니다.</p>

        {/* Q3. 분위기 선택 (다중 선택) */}
        <div className="mb-8">
          <label className="block text-lg font-bold text-white mb-2">
            Q3. 보여주고 싶은 분위기는? <span className="text-sm text-gray-500">(최대 3개)</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {moods.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleMood(tag)}
                className={`px-4 py-2 rounded-full border transition-all ${
                  (answers.moods || []).includes(tag)
                    ? 'border-purple-400 bg-purple-900/30 text-purple-300 shadow-[0_0_10px_rgba(192,132,252,0.3)]'
                    : 'border-gray-600 text-gray-400 hover:border-gray-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Q4. BGM 선택 (단일 선택) */}
        <div className="mb-10">
          <label className="block text-lg font-bold text-white mb-3">Q4. 배경 음악(BGM)을 골라주세요.</label>
          <div className="grid grid-cols-1 gap-2">
            {bgms.map((bgm) => (
              <label key={bgm} className="flex items-center space-x-3 p-3 rounded hover:bg-gray-800 cursor-pointer">
                <input 
                  type="radio" 
                  name="bgm" 
                  value={bgm}
                  checked={answers.bgm === bgm}
                  onChange={(e) => handleChange('bgm', e.target.value)}
                  className="w-5 h-5 accent-green-500"
                />
                <span className="text-gray-300">{bgm}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-4">
          <button onClick={() => router.back()} className="flex-1 py-3 px-6 rounded-lg bg-gray-700 text-gray-300 font-bold hover:bg-gray-600">
            이전
          </button>
          <Link href="/step3" className="flex-1">
            <button className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-black font-bold hover:opacity-90">
              다음 단계 →
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}