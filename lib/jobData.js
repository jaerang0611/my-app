// lib/jobData.js

export const JOB_SPECS = {
  developer: {
    label: "💻 개발 (Developer)",
    strengths: [
      { id: "tech", label: "기술 탐구 (Deep Dive)", desc: "코드 깊이와 기술적 챌린지", recTheme: "typeA" },     
      { id: "impl", label: "서비스 구현 (Implementation)", desc: "완성된 프로덕트와 스택 시각화", recTheme: "typeB" }, 
      { id: "problem", label: "문제 해결 (Troubleshooting)", desc: "논리적인 해결 과정 기술", recTheme: "typeC" }, 
    ],
  },
  designer: {
    label: "🎨 디자인 (Designer)",
    strengths: [
      { id: "visual", label: "비주얼 임팩트 (Visual Impact)", desc: "압도적인 그래픽과 심미성", recTheme: "typeA" }, 
      { id: "brand", label: "브랜드 스토리 (Brand Story)", desc: "브랜드 철학과 컨셉 에디토리얼", recTheme: "typeB" }, 
      { id: "ux", label: "UX 논리 (Logic & Flow)", desc: "사용자 경험 설계의 논리적 흐름", recTheme: "typeC" },    
    ],
  },
  marketer: {
    label: "📈 기획/마케팅 (Marketer)",
    strengths: [
      { id: "data", label: "데이터 성과 (Performance)", desc: "수치와 KPI 달성률 시각화", recTheme: "typeA" },     
      { id: "creative", label: "크리에이티브 (Creative)", desc: "트렌디한 콘텐츠와 캠페인 소재", recTheme: "typeB" }, 
      { id: "strategy", label: "전략 인사이트 (Strategy)", desc: "시장 분석과 전략 수립 제안서", recTheme: "typeC" }, 
    ],
  },
  service: {
    label: "💼 비즈니스/기타 (Service Planner)",
    strengths: [
      { id: "revenue", label: "매출 견인 (Business Impact)", desc: "비즈니스 목표 달성 스토리", recTheme: "typeA" }, 
      { id: "ops", label: "운영 효율화 (Efficiency)", desc: "체계적인 프로세스 관리 능력", recTheme: "typeB" },      
      { id: "comm", label: "소통 협업 (Collaboration)", desc: "협업 툴 활용과 커뮤니케이션", recTheme: "typeC" },   
    ],
  },
};

export function normalizeJob(jobRaw = "") {
  if (jobRaw.includes("개발")) return "developer";
  if (jobRaw.includes("디자인")) return "designer";
  if (jobRaw.includes("기획") || jobRaw.includes("마케팅")) return "marketer";
  if (jobRaw.includes("비즈니스") || jobRaw.includes("서비스")) return "service";
  return "developer";
}