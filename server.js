import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===== API KEY =====
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("⚠️ GEMINI_API_KEY não configurada nos Secrets do Replit!");
}

// Endpoint do Google Gemini
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

// ===== Endpoint de Chat =====
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });
    if (!API_KEY) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

    // Requisição para Gemini
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ content: message }],
        parameters: { temperature: 0.7, maxOutputTokens: 300 }
      })
    });


    if (!resp.ok) {
      const text = await resp.text();
      return res.status(resp.status).json({ reply: `Erro da API Gemini: ${text}` });
    }

    const data = await resp.json();
    const aiText = data.candidates?.[0]?.content?.[0]?.text || "Sem resposta.";
    res.json({ reply: aiText });

  } catch (error) {
    console.error("Erro /chat:", error);
    res.status(500).json({ error: error.message });
  }
});

// ===== Servidor =====
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT} (PORT=${PORT})`);
});
