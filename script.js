const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');

function addMessage(content, sender='bot', isThinking=false){
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    if(isThinking) msg.classList.add('thinking');

    if(typeof content === 'string'){
        if(content.startsWith("```") && content.endsWith("```")){
            const codeContent = content.replace(/```/g,'');
            msg.innerHTML = `<code class="language-javascript">${codeContent}</code>`;
            Prism.highlightAll();
        } else {
            msg.textContent = content;
        }
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    }
}

async function sendMessage(){
    const text = userInput.value.trim();
    if(!text) return;

    addMessage(text, 'user');
    userInput.value = '';

    const thinkingMsg = document.createElement('div');
    thinkingMsg.classList.add('message','bot','thinking');
    thinkingMsg.textContent = "IA está pensando...";
    chat.appendChild(thinkingMsg);
    chat.scrollTop = chat.scrollHeight;

    try {
        const res = await fetch('http://localhost:3000/chat',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        chat.removeChild(thinkingMsg);
        addMessage(data.message,'bot');
    } catch(err){
        chat.removeChild(thinkingMsg);
        addMessage("Erro ao se conectar à IA.","bot");
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e=>{if(e.key==='Enter') sendMessage();});

uploadBtn.addEventListener('click', ()=>fileInput.click());
fileInput.addEventListener('change', ()=>{
    for(const file of fileInput.files) addMessage(`Arquivo enviado: ${file.name}`,'user');
    fileInput.value='';
});
