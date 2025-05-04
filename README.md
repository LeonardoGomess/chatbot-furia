# 🤖 Chatbot FURIA Esports — Desafio Técnico

Este é um chatbot inteligente desenvolvido como parte de um desafio técnico para um processo seletivo da FURIA. O objetivo principal é simular um assistente virtual apaixonado pelos times de CS2 da FURIA Esports, capaz de responder perguntas sobre resultados, estatísticas, rankings, eventos e jogadores — com base em arquivos locais .json.

As informações utilizadas pelo chatbot são obtidas a partir de uma API externa do site HLTV.org da comunidade, especializada em eSports, e convertidas previamente para arquivos .json, que são lidos localmente para compor as respostas com mais rapidez e confiabilidade.

Link para o site : https://chatbot-furia-s3un.onrender.com/index.html

---

## 🧠 Objetivo do Desafio

Criar um chatbot funcional e interativo com as seguintes capacidades:

- ⚡ Utilizar a API **Google Gemini (1.5 Flash)** para gerar respostas em linguagem natural.
- 📚 Buscar e interpretar dados de arquivos locais `.json` como fonte de conhecimento.
- 🧾 Manter um **contexto de conversa** com o usuário (memória curta).
- 🕐 Responder com **rapidez**, **precisão** e **personalidade de marca** (tom esportivo, apaixonado).
- 💡 Lidar com erros e indisponibilidades da API de forma amigável.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** + **Express.js** — Backend e API HTTP
- **Google Generative AI (Gemini)** — Geração de respostas
- **ES Modules (.mjs)** — Estrutura moderna de importação
- **HTML + CSS + JS** — Front-end simples e responsivo
- **Fetch API com timeout** — Controle de falhas em tempo real
- **Arquivos JSON** — Base de conhecimento simulada (em `./data`)

---



## ⚙️ Configuração e Execução

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/chatbot-furia.git
cd chatbot-furia
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz e adicione sua chave da API Gemini:

```
GENAI_API_KEY=sua-chave-google-aqui
```

> **Atenção**: para segurança, a chave da API **não** deve ser exposta em nenhum arquivo versionado.

### 4. Executar o servidor
```bash
node server.mjs
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 💬 Exemplos de Perguntas

- "Qual foi o último resultado da FURIA?"
- "Quem são os jogadores atuais do time?"
- "Quais eventos estão por vir?"
- "Mostre as estatísticas do KSCERATO"
- "Qual é o ranking atual da FURIA?"

---

## 🛡️ Tratamento de Erros

- A API possui **retries automáticos** em caso de erro 503 (Service Unavailable).
- O front-end implementa um **timeout de 15 segundos** para evitar travamentos.
- O chatbot sempre dá uma resposta amigável em caso de falha.

---



## 👨‍💻 Autor - Leonardo Gomes

Desenvolvido como parte de um **processo seletivo técnico** para avaliação de habilidades com:

- Integração de APIs
- Manipulação de dados
- Estruturação de projetos web
- Tratamento de erros
- Experiência do usuário (UX)

---
📸 Ilustrações do Site

![Image](https://github.com/user-attachments/assets/a94c7b14-4dfa-4ab7-9a25-4652baec31ec)

![Image](https://github.com/user-attachments/assets/b2d36a43-2448-4b8e-b7af-f903f91bd39b)

![Image](https://github.com/user-attachments/assets/69ff974a-858e-4286-b785-09dcc2e5121e)

## 🐾 Vai FURIA! #DaleFuria #FURIAEsports
