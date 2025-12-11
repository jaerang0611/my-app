import json
import os
import re
import requests
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# AI 도구
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

# DB & 보안 도구
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext

# 구글 인증 도구
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# 1. 환경 설정
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

app = FastAPI()

# CORS 설정 (모든 주소 허용)
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

# User 테이블 정의
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    name = Column(String)
    portfolio_data = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)

# 비밀번호 암호화
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- 데이터 모델 정의 ---
class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class GoogleToken(BaseModel):
    token: str

class KakaoToken(BaseModel):
    token: str

class NaverToken(BaseModel):
    token: str

class UserAnswers(BaseModel):
    answers: dict

class ChatRequest(BaseModel):
    message: str

class PortfolioUpdate(BaseModel):
    email: str
    portfolio_data: dict

# DB 세션
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- [API] 포트폴리오 저장 ---
@app.post("/save-portfolio")
def save_portfolio(data: PortfolioUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.portfolio_data = json.dumps(data.portfolio_data)
    db.commit()
    return {"message": "Portfolio saved successfully"}

# --- [API] 포트폴리오 불러오기 ---
@app.get("/get-portfolio/{email}")
def get_portfolio(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.portfolio_data:
        raise HTTPException(status_code=404, detail="Portfolio data not found")

    return {"portfolio_data": json.loads(user.portfolio_data)}



# --- [API 1] 이메일 회원가입 ---
@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 등록된 이메일입니다.")
    
    hashed_password = pwd_context.hash(user.password)
    new_user = User(email=user.email, password=hashed_password, name=user.name)
    db.add(new_user)
    db.commit()
    return {"message": "회원가입 성공"}

# --- [API 2] 이메일 로그인 ---
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="이메일 또는 비밀번호가 틀렸습니다.")
    
    portfolio_data = json.loads(db_user.portfolio_data) if db_user.portfolio_data else None
    return {"message": "로그인 성공", "user_name": db_user.name, "email": db_user.email, "portfolio_data": portfolio_data}

# --- [API 3] 구글 로그인 ---
@app.post("/google-login")
def google_login(data: GoogleToken, db: Session = Depends(get_db)):
    try:
        id_info = id_token.verify_oauth2_token(data.token, google_requests.Request())
        email = id_info['email']
        name = id_info.get('name', 'Google User')

        db_user = db.query(User).filter(User.email == email).first()
        if not db_user:
            new_user = User(email=email, password="SOCIAL_GOOGLE", name=name)
            db.add(new_user)
            db.commit()
            db_user = new_user
        
        portfolio_data = json.loads(db_user.portfolio_data) if db_user.portfolio_data else None
        return {"message": "구글 로그인 성공", "user_name": db_user.name, "email": db_user.email, "portfolio_data": portfolio_data}
    except ValueError:
        raise HTTPException(status_code=400, detail="유효하지 않은 구글 토큰입니다.")

# --- [API 4] 카카오 로그인 ---
@app.post("/kakao-login")
def kakao_login(data: KakaoToken, db: Session = Depends(get_db)):
    try:
        headers = {'Authorization': f'Bearer {data.token}'}
        me_res = requests.get("https://kapi.kakao.com/v2/user/me", headers=headers)
        me_data = me_res.json()
        
        kakao_account = me_data.get('kakao_account')
        if not kakao_account:
             raise HTTPException(status_code=400, detail="카카오 계정 정보를 불러올 수 없습니다.")

        email = kakao_account.get('email')
        profile = kakao_account.get('profile')
        nickname = profile.get('nickname') if profile else 'Kakao User'
        
        # 이메일 동의 안 했을 경우 임시 아이디 생성
        if not email:
             email = f"{me_data['id']}@kakao.temp" 

        db_user = db.query(User).filter(User.email == email).first()
        if not db_user:
            new_user = User(email=email, password="SOCIAL_KAKAO", name=nickname)
            db.add(new_user)
            db.commit()
            db_user = new_user
            
        portfolio_data = json.loads(db_user.portfolio_data) if db_user.portfolio_data else None
        return {"message": "카카오 로그인 성공", "user_name": db_user.name, "email": db_user.email, "portfolio_data": portfolio_data}
    except Exception as e:
        print("카카오 에러:", e)
        raise HTTPException(status_code=400, detail="카카오 로그인 실패")

# --- [API 5] 네이버 로그인 (추가됨) ---
@app.post("/naver-login")
def naver_login(data: NaverToken, db: Session = Depends(get_db)):
    try:
        # 네이버에 토큰 확인 요청
        headers = {'Authorization': f'Bearer {data.token}'}
        res = requests.get("https://openapi.naver.com/v1/nid/me", headers=headers)
        info = res.json()
        
        if info.get('resultcode') != '00':
            raise Exception("네이버 인증 실패")

        naver_account = info['response']
        email = naver_account.get('email')
        name = naver_account.get('name', 'Naver User')

        if not email:
             raise HTTPException(status_code=400, detail="이메일 정보가 없습니다.")

        # DB 확인 및 가입
        db_user = db.query(User).filter(User.email == email).first()
        if not db_user:
            new_user = User(email=email, password="SOCIAL_NAVER", name=name)
            db.add(new_user)
            db.commit()
            db_user = new_user
            
        portfolio_data = json.loads(db_user.portfolio_data) if db_user.portfolio_data else None
        return {"message": "네이버 로그인 성공", "user_name": db_user.name, "email": db_user.email, "portfolio_data": portfolio_data}
        
    except Exception as e:
        print("네이버 에러:", e)
        raise HTTPException(status_code=400, detail="네이버 로그인 실패")

# --- [API 6] AI 포트폴리오 생성 ---
llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest",
    temperature=0.7,
    google_api_key=GOOGLE_API_KEY
)

portfolio_prompt = ChatPromptTemplate.from_messages([
    ("system", """
    당신은 전문 웹 디자이너입니다. 사용자 정보를 바탕으로 포트폴리오 웹사이트 JSON 데이터를 생성하세요.
    Markdown 코드블럭 없이 순수 JSON 문자열만 출력하세요.
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
    projects_str = ""
    
    # 직무 확인 (디자이너 vs 일반)
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

# --- [API 7] 챗봇 ---
chat_chain = ChatPromptTemplate.from_messages([("system", "친절한 코치"), ("human", "{input}")]) | llm
@app.post("/chat")
def chat_bot(request: ChatRequest):
    try:
        response = chat_chain.invoke({"input": request.message})
        return {"reply": response.content}
    except Exception:
        return {"reply": "AI 오류 발생"}