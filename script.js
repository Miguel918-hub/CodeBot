const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Função para criar uma mensagem no chat
function addMessage(text, sender='bot') {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);

    // Verifica se a mensagem é código
    if(text.startsWith("```") && text.endsWith("```")){
        const codeContent = text.replace(/```/g, '');
        msg.innerHTML = `<code class="language-javascript">${codeContent}</code>`;
        Prism.highlightAll();
    } else {
        msg.textContent = text;
    }

    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

// Enviar mensagem
sendBtn.addEventListener('click', () => {
    const text = userInput.value.trim();
    if(!text) return;
    
    addMessage(text, 'user');
    userInput.value = '';

    // Chamada simulada da IA (substitua pela API real)
    setTimeout(() => {
        const botResponse = generateBotResponse(text);
        addMessage(botResponse, 'bot');
    }, 500);
});

// Enter envia mensagem
userInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') sendBtn.click();
});

// Função simulada para respostas da IA
function generateBotResponse(text){
    // Aqui você pode integrar com a OpenAI API
    if(text.toLowerCase().includes("função")){
        return "```javascript\nfunction exemplo(){\n  console.log('Olá mundo!');\n}\n```";
    }
    return "Desculpe, ainda estou aprendendo. Peça uma função de exemplo ou código!";
}
