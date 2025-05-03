import dotenv from 'dotenv';
dotenv.config(); 

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';


const API_KEY = process.env.GENAI_API_KEY;
<<<<<<< HEAD

=======
console.log('API_KEY:', API_KEY);  
>>>>>>> ad1c03edd676b5805dd8b5c4354ac5baa7917e9a
if (!API_KEY) {
  throw new Error('A chave de API não está configurada.');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const systemPrompt = `
Você é o ChatBot Oficial dos Fãs da FURIA Esports (CS2).
Função:
- Atualizar com notícias, estatísticas, resultados ao vivo e eventos da FURIA.
- Fornecer sempre informações atualizadas.
- Responder com paixão, energia e orgulho da torcida.
- Quando não souber uma resposta, peça desculpas e incentive o usuário a seguir a FURIA nas redes sociais.
- Sempre cite a fonte da informação coletada (HLTV.org).
- Não inventar dados.
- Mensagens de boas-vindas ou agradecimentos devem ser calorosas.
- Não usar ids de jogadores ou times nas respostas, apenas nomes e nicks.
`;

const keywordToJsonMap = {
  "estatísticas": ["teamStats.json", "playerStats.json"],
  "resultados": ["teamStats.json"],
  "eventos": ["events.json", "pastEvents.json"],
  "jogadores": ["playerStats.json"],
  "times": ["teamInfo.json"],
  "ranking": ["teamRanking.json"]
};

async function loadJsonFiles(prompt) {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    const relevantFiles = new Set();
    for (const [keyword, files] of Object.entries(keywordToJsonMap)) {
      if (prompt.toLowerCase().includes(keyword)) {
        files.forEach(file => relevantFiles.add(file));
      }
    }

    const filesToLoad = relevantFiles.size > 0
      ? Array.from(relevantFiles)
      : (await fs.readdir(dataDir)).filter(f => f.endsWith('.json'));

    const data = {};
    for (const file of filesToLoad) {
      const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
      data[file] = JSON.parse(content);
    }
    return data;
  } catch (e) {
    console.error('Erro ao carregar JSONs:', e);
    return {};
  }
}

export async function gerarResposta(prompt, contexto = [], retries = 3) {
  try {
    const dados = await loadJsonFiles(prompt);

    const resumoDados = Object.entries(dados).map(([nome, conteudo]) => {
      return `Arquivo: ${nome}\nResumo:
` + JSON.stringify(conteudo).slice(0, 1000); // ✅ Resumo limitado
    }).join('\n\n');

    const historico = contexto.length ? contexto.join('\n') : "Nenhuma conversa anterior.";

    const fullPrompt = `${systemPrompt}\n\nDados:\n${resumoDados}\n\nHistórico:\n${historico}\n\nPergunta:\n${prompt}`;

    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error('Erro ao gerar resposta:', error.message);
    if (error.message.includes('503') && retries > 0) {
      await new Promise(r => setTimeout(r, 2000));
      return gerarResposta(prompt, contexto, retries - 1);
    }
    return 'Desculpe, ocorreu um problema. Tente novamente mais tarde.';
  }
}



