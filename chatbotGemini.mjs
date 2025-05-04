import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';

const API_KEY = process.env.GENAI_API_KEY;
if (!API_KEY) {
  throw new Error('A chave de API não está configurada.');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const systemPrompt = `
Você é o ChatBot Oficial dos Fãs da FURIA Esports (CS2).
Função:
- Verificar todos os json disponíveis na pasta data para sempre responder as perguntas da melhor forma possivel.
- Mesmo que não tenha dados "ao vivo" , responder com dados que voce tem nos arquivos json.
- Responder perguntas sobre a FURIA, incluindo estatísticas, resultados, eventos e jogadores.
- Responder com paixão, energia e orgulho da torcida.
- Não inventar dados.
- Mensagens de boas-vindas ou agradecimentos devem ser calorosas.
- Não usar ids de jogadores ou times nas respostas, apenas nomes e nicks.
`;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadJsonFiles() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    const files = (await fs.readdir(dataDir)).filter(f => f.endsWith('.json'));
    const data = {};
    for (const file of files) {
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
    const dados = await loadJsonFiles();
    if (!Object.keys(dados).length) {
      console.log('Nenhuma informação encontrada nos arquivos JSON.');
    }

    // Gera um resumo bruto de cada JSON
    const resumoDados = Object.entries(dados)
      .map(([nome, conteudo]) => {
        return `Arquivo: ${nome}\nConteúdo: ${JSON.stringify(conteudo)}`;
      })
      .join('\n\n');

    const historico = contexto.length ? contexto.join('\n') : 'Nenhuma conversa anterior.';

    const fullPrompt = `${systemPrompt}\n\nDados:\n${resumoDados}\n\nHistórico:\n${historico}\n\nPergunta:\n${prompt}`;

    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    console.error('Erro ao gerar resposta:', error.message);
    if (error.message.includes('503') && retries > 0) {
      await delay(2000);
      return gerarResposta(prompt, contexto, retries - 1);
    }
    return 'Desculpe, ocorreu um problema. Tente novamente mais tarde.';
  }
}
