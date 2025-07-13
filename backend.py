from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    question = data.get("question", "")
    
    # Aqui você pode integrar com uma API de IA, como OpenAI, Ollama etc.
    # Exemplo de resposta fixa (substitua pela integração real):
    if "lua" in question.lower():
        answer = '''local part = Instance.new("Part")
part.Parent = workspace
part.Position = Vector3.new(0, 10, 0)'''
    else:
        answer = "Desculpe, ainda não sei responder essa pergunta. Em breve, integração com IA!"
    
    return JSONResponse(content={"answer": answer})

# Para rodar:
# uvicorn backend.main:app --reload
