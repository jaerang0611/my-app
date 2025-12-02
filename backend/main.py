import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# 1. LangChain & Gemini 도구 불러오기
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

# 2. .env 파일에서 API 키 꺼내오기
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

app = FastAPI()

# CORS 설정 (그대로 유지)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

# 3. AI 모델 준비 (Gemini-1.5-Flash 사용)
# temperature=0.7: 적당히 창의적이게 설정
llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest", 
    temperature=0.7,
    google_api_key=GOOGLE_API_KEY
)

# 4. AI에게 "너는 누구인지" 가르치기 (페르소나 설정)
prompt = ChatPromptTemplate.from_messages([
    ("system", "당신은 'Mood-Folio'라는 포트폴리오 사이트의 AI 코치 'Yong'입니다. 사용자에게 친절하고 전문적으로 조언해주세요. 답변은 3문장 이내로 간결하게 해주세요."),
    ("human", "{input}"),
])

# 체인 연결 (프롬프트 -> AI)
chain = prompt | llm

@app.post("/chat")
def chat_bot(request: ChatRequest):
    print(f"📩 질문 수신: {request.message}")
    
    # 5. 진짜 AI에게 질문 던지기
    response = chain.invoke({"input": request.message})
    
    print(f"🤖 AI 답변: {response.content}")
    return {"reply": response.content}