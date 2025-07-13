from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

history = []  # Novo: histórico na memória

def generate_code(question):
    q = question.lower()
    if "lua" in q:
        return '''local part = Instance.new("Part")\npart.Parent = workspace\npart.Position = Vector3.new(0, 10, 0)'''
    elif "python" in q:
        return '''print("Olá, mundo!")\nfor i in range(5):\n    print(i)'''
    elif "javascript" in q:
        return '''console.log("Olá, mundo!");\nfor(let i=0; i<5; i++) {\n  console.log(i);\n}'''
    elif "c#" in q:
        return '''using System;\nclass Program {\n  static void Main() {\n    Console.WriteLine("Olá, mundo!");\n  }\n}'''
    else:
        return "Desculpe, não tenho exemplo para essa linguagem ainda."

@app.post("/ask")
async def ask(request: Request):
    data = await request.json()
    question = data.get("question", "")
    answer = generate_code(question)
    history.append({"question": question, "answer": answer})  # Salva no histórico
    return JSONResponse(content={"answer": answer})

@app.get("/history")
async def get_history():
    return JSONResponse(content={"history": history})
