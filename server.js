// Instalar dependências: npm install express cors dotenv openai
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config(); // Lê a chave do arquivo .env

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    if(!message) return res.status(400).json({ error: "Mensagem vazia" });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "Você é um assistente de programação que responde perguntas, gera códigos e explica conceitos claramente." },
                { role: "user", content: message }
            ],
            temperature: 0.2
        });

        const botMessage = response.choices[0].message.content;
        res.json({ message: botMessage });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
