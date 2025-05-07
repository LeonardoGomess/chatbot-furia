import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { gerarResposta } from './chatbotGemini.mjs';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let contexto = [];
const cache = new Map(); 

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).send('Mensagem vazia.');

  if (cache.has(userMessage)) {
    return res.send(cache.get(userMessage));
  }

  const start = Date.now();
  const resposta = await gerarResposta(userMessage, contexto);
  console.log(`Resposta gerada em ${Date.now() - start}ms`);

  contexto.push(`Usuário: ${userMessage}`);
  contexto.push(`Chatbot: ${resposta}`);
  if (contexto.length > 10) contexto = contexto.slice(-10);

  cache.set(userMessage, resposta);
  res.send(resposta);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
