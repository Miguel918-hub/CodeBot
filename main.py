from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import openai
import os

app = FastAPI()

# Coloque sua chave da OpenAI aqui, ou use uma variável de ambiente
openai.api_key = os.getenv("OPENAI_API_KEY", "SUA_CHAVE_AQUI")

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    question = data.get("question", "")

    # Chamada à API do ChatGPT
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", # ou "gpt-4" se tiver acesso
            messages=[
                {"role": "system", "content": "Você é um assistente que responde dúvidas sobre automação e gera códigos para Lua/Roblox."},
                {"role": "user", "content": question}
            ],
            max_tokens=300
        )
        answer = response.choices[0].message['content'].strip()
    except Exception as e:
        answer = f"Erro na integração com IA: {str(e)}"

    return JSONResponse(content={"answer": answer})

# Para rodar:
# export OPENAI_API_KEY=suachaveaqui
# uvicorn backend.main:app --reload
