import json
import os
import re  # 정규표현식 추가
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

app = FastAPI()

# 1. CORS 설정 (모든 곳에서 허용 - 강력하게 품)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 주소 허용 (개발용)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserAnswers(BaseModel):
    answers: dict

class ChatRequest(BaseModel):
    message: str

llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest", 
    temperature=0.7,
    google_api_key=GOOGLE_API_KEY
)

# ... (portfolio_prompt는 기존과 동일하게 유지) ...
portfolio_prompt = ChatPromptTemplate.from_messages([
    ("system", """
    당신은 전문 웹 디자이너입니다. 사용자 정보를 바탕으로 포트폴리오 웹사이트 데이터를 JSON 형식으로만 출력하세요.
    반드시 아래 JSON 구조를 지키세요. Markdown 코드블럭(```json)을 사용하지 마세요.
    
    {{
        "theme": {{ "color": "#HexCode", "font": "sans", "mood_emoji": "🚀" }},
        "hero": {{ "title": "제목", "subtitle": "부제목", "tags": ["태그1"] }},
        "about": {{ "intro": "소개", "description": "내용" }},
        "projects": [ {{ "title": "프로젝트명", "desc": "설명", "detail": "상세", "tags": ["기술"] }} ],
        "contact": {{ "email": "이메일", "github": "링크" }}
    }}
    """),
    ("human", "{input}")
])

portfolio_chain = portfolio_prompt | llm

# --- [핵심 수정] JSON 정제 기능 강화 ---
@app.post("/submit")
def submit_data(data: UserAnswers):
    print("📢 [생성 요청] AI가 포트폴리오 설계도를 그립니다...")
    answers = data.answers
    
    # 프로젝트 정보 정리
    projects_str = ""
    for i in range(1, 4):
        title = answers.get(f"project{i}_title")
        if title:
            projects_str += f"- {title}: {answers.get(f'project{i}_desc', '')}\n"

    try:
        # AI 호출
        result = portfolio_chain.invoke({
            "input": f"""
            이름: {answers.get('name', 'User')}
            직무: {answers.get('job', '')}
            강점: {answers.get('strength', '')}
            분위기: {', '.join(answers.get('moods', []))}
            경력: {answers.get('career_summary', '')}
            프로젝트: {projects_str}
            """
        })
        
        # 🧹 AI 응답 청소 (JSON만 추출)
        content = result.content
        # 1. Markdown 코드블럭 제거
        content = content.replace("```json", "").replace("```", "").strip()
        
        # 2. 혹시라도 앞뒤에 잡다한 말이 있으면 JSON 부분만 찾기 (중괄호 찾기)
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            content = match.group(0)
            
        portfolio_data = json.loads(content)
        print("✅ 설계도 완성!")

        return {
            "status": "success", 
            "message": "포트폴리오 생성 완료!",
            "data": portfolio_data
        }
        
    except Exception as e:
        print(f"❌ 생성 실패: {e}")
        # 실패 시 기본 데이터라도 보내서 에러 방지
        return {
            "status": "error", 
            "message": str(e),
            "data": {
                "hero": {"title": "AI 생성 실패", "subtitle": "다시 시도해주세요."},
                "theme": {"color": "#333", "mood_emoji": "😢"}
            }
        }

# ... (chat_bot 함수는 그대로) ...
@app.post("/chat")
def chat_bot(request: ChatRequest):
    # ... 기존 코드 ...
    return {"reply": "AI 응답 테스트"}