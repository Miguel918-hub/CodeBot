const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');

// Criar uma mensagem no chat
function addMessage(content, sender='bot', isThinking=false) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    if(isThinking) msg.classList.add('thinking');

    if(content instanceof File){
        const reader = new FileReader();
        reader.onload = () => {
            if(content.type.startsWith('image/')){
                msg.innerHTML = `<img src="${reader.result}" alt="${content.name}">`;
            } else {
                msg.textContent = `Arquivo enviado: ${content.name}`;
            }
            chat.appendChild(msg);
            chat.scrollTop = chat.scrollHeight;
        }
        reader.readAsDataURL(content);
    } else if(typeof content === 'string'){
        if(content.startsWith("```") && content.endsWith("```")){
            const codeContent = content.replace(/```/g, '');
            msg.innerHTML = `<code class="language-javascript">${codeContent}</code>`;
            Prism.highlightAll();
        } else {
            msg.textContent = content;
        }
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    }
}

// Enviar mensagem
function sendMessage() {
    const text = userInput.value.trim();
    if(!text) return;

    addMessage(text, 'user');
    userInput.value = '';

    // Indicador "IA está pensando"
    const thinkingMsg = document.createElement('div');
    thinkingMsg.classList.add('message', 'bot', 'thinking');
    thinkingMsg.textContent = "IA está pensando...";
    chat.appendChild(thinkingMsg);
    chat.scrollTop = chat.scrollHeight;

    // Simula chamada da IA
    setTimeout(() => {
        chat.removeChild(thinkingMsg);
        const botResponse = generateBotResponse(text);
        addMessage(botResponse, 'bot');
    }, 1000);
}

// Enter envia mensagem
userInput.addEventListener('keypress', e => { if(e.key==='Enter') sendMessage(); });
sendBtn.addEventListener('click', sendMessage);

// Upload de arquivos/imagens
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => {
    for(const file of fileInput.files){
        addMessage(file, 'user');
    }
    fileInput.value = '';
});

// Função simulada para respostas da IA
function generateBotResponse(text){
    if(text.toLowerCase().includes("função")){
        return "```javascript\nfunction exemplo(){\n  console.log('Olá mundo!');\n}\n```";
    }
    return "Desculpe, ainda estou aprendendo. Peça uma função de exemplo ou código!";
}
