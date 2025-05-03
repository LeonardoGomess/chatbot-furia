document.addEventListener('DOMContentLoaded', function () {
    const chatbox = document.getElementById('chatbox');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message');

    function addUserMessage(text) {
        const messageElement = createMessageElement(text, 'user-message');
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function addBotMessage(text) {
        const messageElement = createMessageElement(text, 'chatbot-message');
        const botImage = document.createElement('img');
        botImage.src = 'logos/furia-logo.png';
        botImage.alt = 'FURIA Logo';
        botImage.classList.add('bot-avatar');
        messageElement.prepend(botImage);
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function createMessageElement(text, className) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', className);

        const messageText = document.createElement('div');
        messageText.classList.add('message-text');
        messageElement.appendChild(messageText);

        if (className === 'chatbot-message') {
            typeText(messageText, text, 0);
        } else {
            messageText.textContent = text;
        }

        return messageElement;
    }


    

    function typeText(element, text, index) {
        const typingSpeed = 15;
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => typeText(element, text, index + 1), typingSpeed);
        }
    }

    chatForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const userMessage = messageInput.value.trim();
        if (userMessage !== '') {
            addUserMessage(userMessage);
            messageInput.value = '';

            const typingMessageElement = createMessageElement('Pensando...', 'chatbot-message');
            chatbox.appendChild(typingMessageElement);
            chatbox.scrollTop = chatbox.scrollHeight;

            fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            })
                .then(response => {
                    if (!response.ok) throw new Error('Erro na resposta do servidor');
                    return response.text();
                })
                .then(chatbotResponse => {
                    chatbox.removeChild(typingMessageElement);
                    addBotMessage(chatbotResponse);
                })
                .catch(error => {
                    console.error('Erro:', error);
                    chatbox.removeChild(typingMessageElement);
                    const errorElement = createMessageElement(
                        'O chatbot está indisponível no momento. Tente novamente mais tarde.',
                        'error-message'
                    );
                    chatbox.appendChild(errorElement);
                });
        }
    });

    const observer = new MutationObserver(() => {
        chatbox.scrollTop = chatbox.scrollHeight;
    });

    observer.observe(chatbox, { childList: true });
});

const openBtn = document.getElementById('open-modal');
const closeBtn = document.getElementById('close-modal');
const overlay = document.getElementById('modal-overlay');

openBtn.addEventListener('click', (e) => {
  e.preventDefault(); // impede recarregamento da página
  overlay.style.display = 'flex';
});
closeBtn.addEventListener('click', () => overlay.style.display = 'none');
overlay.addEventListener('click', e => {
  if (e.target === overlay) overlay.style.display = 'none';
});
