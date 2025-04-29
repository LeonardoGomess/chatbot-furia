document.addEventListener('DOMContentLoaded', function() {
    const messages = document.getElementById('messages');
    const chatbox = document.getElementById('chatbox');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message');

    const modal1 = document.getElementById('modal1');
    const modal2 = document.getElementById('modal2');
    const toModal2Button = document.getElementById('to-modal2');
    const closeModal2 = document.getElementById('back-to-modal1');
    const helpButton = document.getElementById('help-button');

    toModal2Button.addEventListener('click', () => {
        modal1.style.display = 'none';
    });

    closeModal2.addEventListener('click', () => {
        modal2.style.display = 'none';
    });

    helpButton.addEventListener('click', () => {
        modal1.style.display = 'flex'; // Mostra o primeiro modal
        modal2.style.display = 'none'; // Oculta o segundo modal
    });

     // Scroll automático para o final do chatbox
     chatbox.scrollTop = chatbox.scrollHeight;

     // Evento de envio do formulário
     chatForm.addEventListener('submit', function (event) {
         event.preventDefault();
 
         const userMessage = messageInput.value.trim();
         if (userMessage !== '') {
             // Adiciona a mensagem do usuário ao chat
             const messageElement = createMessageElement(userMessage, 'user-message');
             messages.appendChild(messageElement);
             messageInput.value = '';
 
             // Adiciona a animação de "digitando"
             const typingMessageElement = createMessageElement('Pensando...', 'chatbot-message');
             messages.appendChild(typingMessageElement);
             chatbox.scrollTop = chatbox.scrollHeight;
 
             // Envia a mensagem para o servidor
             fetch('/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ message: userMessage })
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro na resposta do servidor');
    }
    return response.text();
  })
  .then(chatbotResponse => {
    // Exibe a resposta do chatbot
    messages.removeChild(typingMessageElement);
    const responseElement = createMessageElement(chatbotResponse, 'chatbot-message');
    messages.appendChild(responseElement);
    chatbox.scrollTop = chatbox.scrollHeight;
  })
  .catch(error => {
    console.error('Erro ao enviar mensagem:', error);
    // Exibe uma mensagem de erro amigável
    messages.removeChild(typingMessageElement);
    const errorElement = createMessageElement(
      'O chatbot está indisponível no momento. Por favor, tente novamente mais tarde.',
      'error-message'
    );
    messages.appendChild(errorElement);
  });
         }
     });
 
     // Observador para manter o scroll no final do chatbox
     const observer = new MutationObserver(() => {
         chatbox.scrollTop = chatbox.scrollHeight;
     });
 
     observer.observe(messages, { childList: true });
 
     // Função para criar elementos de mensagem
     function createMessageElement(text, className) {
         const messageElement = document.createElement('div');
         messageElement.classList.add('chat-message', className);
 
         if (className === 'chatbot-message') {
             const botImage = document.createElement('img');
             botImage.src = 'roboimg.png';
             botImage.alt = 'Chatbot';
             messageElement.appendChild(botImage);
 
             const messageText = document.createElement('div');
             messageText.classList.add('message-text');
             messageElement.appendChild(messageText);
 
             typeText(messageText, text, 0);
         } else {
             const messageText = document.createElement('div');
             messageText.textContent = text;
             messageElement.appendChild(messageText);
         }
 
         return messageElement;
     }
 
     // Função para simular digitação do chatbot
     function typeText(element, text, index) {
         const typingSpeed = 5; // Velocidade de digitação em milissegundos
         if (index < text.length) {
             element.textContent += text.charAt(index);
             setTimeout(() => typeText(element, text, index + 1), typingSpeed);
         }
     }
 });
 
 // Adicionando o menu lateral
 document.addEventListener('DOMContentLoaded', function () {
     const menuLateral = document.getElementById('menuLateral');
     const menuLateralToggle = document.getElementById('menuLateralToggle');
 
     menuLateralToggle.addEventListener('click', function () {
         menuLateral.classList.toggle('active');
     });
 });
 
 // Função para baixar PDFs
 document.getElementById('downloadPdfBtn').addEventListener('click', function () {
     const pdfSelect = document.getElementById('pdfSelect');
     const selectedPdf = pdfSelect.value;
     if (selectedPdf) {
         const link = document.createElement('a');
         link.href = selectedPdf;
         link.download = selectedPdf.split('/').pop(); // Nome do arquivo
         link.click();
     } else {
         alert('Por favor, selecione um PDF.');
     }
 });