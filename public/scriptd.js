// Função para adicionar uma mensagem do usuário
function addUserMessage(text) {
    const chatBox = document.getElementById('chat-box');
    const message = document.createElement('div');
    message.classList.add('message', 'user');
    message.textContent = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  
  // Função para adicionar uma mensagem do chatbot com efeito de digitação
  function addBotMessage(text) {
    const chatBox = document.getElementById('chat-box');
    const message = document.createElement('div');
    message.classList.add('message', 'bot');
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
  
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        message.textContent += text.charAt(index);
        index++;
        chatBox.scrollTop = chatBox.scrollHeight;
      } else {
        clearInterval(typingInterval);
      }
    }, 10); // Ajuste a velocidade da digitação conforme necessário
  }

  function addBotMessage(text) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'bot');
  
    const avatar = document.createElement('img');
    avatar.src = 'logos/furia-logo.png';
    avatar.alt = 'FURIA Logo';
    avatar.classList.add('bot-avatar');
  
    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    messageText.textContent = text;
  
    messageElement.appendChild(avatar);
    messageElement.appendChild(messageText);
    chatBox.appendChild(messageElement);
  }
  

  
  // Manipulador de envio do formulário
  document.getElementById('chat-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const userInput = document.getElementById('user-input');
    const text = userInput.value.trim();
    if (text !== '') {
      addUserMessage(text);
      userInput.value = '';
      // Simule uma resposta do chatbot após um pequeno atraso
      setTimeout(() => {
        addBotMessage('Esta é uma resposta simulada do chatbot.');
      }, 500);
    }
  });
  