import React, { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer("");
    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Rk Hub | Chat ai 🤖</h1>
      <form onSubmit={handleAsk}>
        <label htmlFor="question">Digite sua pergunta:</label>
        <textarea
          id="question"
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: "100%", padding: 10, margin: "10px 0" }}
          required
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Enviar
        </button>
      </form>
      {loading && <div>Pensando...</div>}
      {answer && (
        <div
          style={{
            background: "#f5f5f5",
            padding: 15,
            borderRadius: 5,
            marginTop: 10,
          }}
        >
          <strong>Resposta:</strong>
          <pre>{answer}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
