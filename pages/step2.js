// props에 onNext, onPrev를 추가로 받으세요!
export default function Step2({ answers, handleChange, onNext, onPrev }) {
  
  // ... (기존 로직 생략) ...

  return (
    // ... (기존 UI 생략) ...

    /* 버튼 영역 수정 */
    <div className="flex gap-4">
      {/* 이전 버튼 */}
      <button 
        onClick={onPrev} // router.back() 대신 onPrev 사용
        className="flex-1 py-3 px-6 rounded-lg bg-gray-700 text-gray-300 font-bold hover:bg-gray-600"
      >
        이전
      </button>

      {/* 다음 버튼 */}
      <button 
        onClick={onNext} // Link 태그 제거하고 onNext 직접 실행
        className="w-full py-3 px-6 rounded-lg bg-linear-to-r from-green-400 to-blue-500 text-black font-bold hover:opacity-90"
      >
        다음 단계 →
      </button>
    </div>
  );
}