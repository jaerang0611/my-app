// components/templates/moodColorMap.js

// 무드 태그에 따른 색상 테마 정의
const moodThemes = {
  "#차분한": {
    headerGradient: "from-slate-500 to-gray-700",
    textHighlight: "text-slate-600 dark:text-slate-300",
    accentRing: "ring-slate-400",
    pill: "border-slate-400 text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300",
    glowColor: "#94a3b8", // slate-400
    dot: "bg-slate-500"
  },
  "#열정적인": {
    headerGradient: "from-red-500 to-orange-500",
    textHighlight: "text-red-600 dark:text-red-400",
    accentRing: "ring-red-400",
    pill: "border-red-400 text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-300",
    glowColor: "#ef4444", // red-500
    dot: "bg-red-500"
  },
  "#신뢰감있는": {
    headerGradient: "from-blue-600 to-cyan-500",
    textHighlight: "text-blue-600 dark:text-blue-400",
    accentRing: "ring-blue-400",
    pill: "border-blue-400 text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300",
    glowColor: "#3b82f6", // blue-500
    dot: "bg-blue-500"
  },
  "#힙한(Hip)": {
    headerGradient: "from-purple-500 to-pink-500",
    textHighlight: "text-purple-600 dark:text-purple-400",
    accentRing: "ring-purple-400",
    pill: "border-purple-400 text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-300",
    glowColor: "#a855f7", // purple-500
    dot: "bg-purple-500"
  },
  "#창의적인": {
    headerGradient: "from-yellow-400 to-orange-400",
    textHighlight: "text-orange-600 dark:text-yellow-400",
    accentRing: "ring-yellow-400",
    pill: "border-yellow-400 text-orange-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-300",
    glowColor: "#eab308", // yellow-500
    dot: "bg-yellow-500"
  },
  "#미니멀한": {
    headerGradient: "from-gray-400 to-gray-600",
    textHighlight: "text-gray-800 dark:text-gray-200",
    accentRing: "ring-gray-400",
    pill: "border-gray-400 text-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-gray-300",
    glowColor: "#9ca3af", // gray-400
    dot: "bg-gray-500"
  },
  "#클래식한": {
    headerGradient: "from-amber-700 to-brown-700", // brown은 tailwind 기본에 없으므로 amber 사용
    textHighlight: "text-amber-800 dark:text-amber-200",
    accentRing: "ring-amber-600",
    pill: "border-amber-600 text-amber-800 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-200",
    glowColor: "#d97706", // amber-600
    dot: "bg-amber-700"
  }
};

// 기본 스타일 (매칭되는 게 없을 때)
const defaultStyle = moodThemes["#신뢰감있는"];

export function getStyleByMood(selectedMoods = []) {
  if (!selectedMoods || selectedMoods.length === 0) return defaultStyle;
  // 첫 번째 선택된 무드를 기준으로 스타일 반환 (필요시 로직 고도화 가능)
  return moodThemes[selectedMoods[0]] || defaultStyle;
}