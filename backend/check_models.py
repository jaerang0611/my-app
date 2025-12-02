import os
from dotenv import load_dotenv
import google.generativeai as genai

# .env에서 키 가져오기
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# 구글 AI 설정
genai.configure(api_key=GOOGLE_API_KEY)

print("🔍 사용 가능한 모델 목록을 조회합니다...\n")

try:
    # 모델 리스트 가져오기
    for m in genai.list_models():
        # '대화(generateContent)'가 가능한 모델만 출력
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
            
except Exception as e:
    print(f"❌ 에러 발생: {e}")
    print("팁: .env 파일에 GOOGLE_API_KEY가 제대로 들어있는지 확인해주세요.")