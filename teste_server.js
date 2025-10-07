import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Rota de teste que SÓ aceita POST
app.post("/testepost", (req, res) => {
  // Se a requisição chegar aqui, veremos esta mensagem no console do Replit
  console.log("✅ ROTA /testepost ACIONADA!"); 
  res.json({ message: "Sucesso! O POST foi recebido." });
});

app.listen(3000, () => {
  console.log("🚀 Servidor de TESTE rodando na porta 3000");
});