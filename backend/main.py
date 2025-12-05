import json
import os
import re
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# AI 관련
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

# DB & 보안 관련
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext

# 1. 환경 설정
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. 데이터베이스 설정 (SQLite)
SQLALCHEMY_DATABASE_URL = "sqlite:///./users.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 3. User 테이블 (회원 정보)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)

# 테이블 생성
Base.metadata.create_all(bind=engine)

# 4. 비밀번호 암호화 도구
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 5. 데이터 모델 (Pydantic)
class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserAnswers(BaseModel):
    answers: dict

class ChatRequest(BaseModel):
    message: str

# DB 세션
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- [API 1] 회원가입 ---
@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # 이메일 중복 체크
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다.")
    
    # 비밀번호 암호화 및 저장
    hashed_password = pwd_context.hash(user.password)
    new_user = User(email=user.email, password=hashed_password, name=user.name)
    db.add(new_user)
    db.commit()
    
    return {"message": "회원가입 성공"}

# --- [API 2] 로그인 ---
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="이메일 또는 비밀번호가 잘못되었습니다.")
    
    return {"message": "로그인 성공", "user_name": db_user.name, "email": db_user.email}

# --- [API 3] AI 포트폴리오 생성 ---
# (기존 코드 유지: AI 모델 설정)
llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest",
    temperature=0.7,
    google_api_key=GOOGLE_API_KEY
)

portfolio_prompt = ChatPromptTemplate.from_messages([
    ("system", """
    당신은 전문 웹 디자이너입니다. 사용자 정보를 바탕으로 포트폴리오 웹사이트 JSON 데이터를 생성하세요.
    Markdown 없이 순수 JSON만 출력하세요.
    {{
        "theme": {{ "color": "#HEX", "font": "sans", "mood_emoji": "🚀", "layout": "gallery_grid" }},
        "hero": {{ "title": "제목", "subtitle": "부제", "tags": ["태그"] }},
        "about": {{ "intro": "소개", "description": "내용" }},
        "projects": [ {{ "title": "제목", "desc": "설명", "detail": "상세", "tags": ["기술"] }} ],
        "contact": {{ "email": "이메일", "github": "링크" }}
    }}
    """),
    ("human", "{input}")
])
portfolio_chain = portfolio_prompt | llm

@app.post("/submit")
def submit_data(data: UserAnswers):
    print("📢 [생성 요청] AI 작업 시작...")
    answers = data.answers
    
    # 프로젝트 정보 파싱 (일반/디자인)
    projects_str = ""
    is_designer = "디자인" in answers.get("job", "") or "Designer" in answers.get("job", "")
    
    if is_designer:
        for i in range(1, 7):
            title = answers.get(f"design_project{i}_title")
            if title: projects_str += f"- 작품 {i}: {title}\n"
    else:
        for i in range(1, 4):
            title = answers.get(f"project{i}_title")
            if title: projects_str += f"- 프로젝트 {i}: {title}\n"

    try:
        result = portfolio_chain.invoke({
            "input": f"이름:{answers.get('name')} 직무:{answers.get('job')} 강점:{answers.get('strength')} 분위기:{answers.get('moods')} 경력:{answers.get('career_summary')} 프로젝트:{projects_str}"
        })
        
        # JSON 정제
        content = result.content.replace("```json", "").replace("```", "").strip()
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match: content = match.group(0)
        
        return {"status": "success", "message": "완료!", "data": json.loads(content)}
    except Exception as e:
        print(f"❌ 생성 실패: {e}")
        return {"status": "error", "message": str(e)}

# --- [API 4] 챗봇 ---
chat_chain = ChatPromptTemplate.from_messages([("system", "친절한 코치"), ("human", "{input}")]) | llm
@app.post("/chat")
def chat_bot(request: ChatRequest):
    try:
        response = chat_chain.invoke({"input": request.message})
        return {"reply": response.content}
    except Exception:
        return {"reply": "AI 오류 발생"}