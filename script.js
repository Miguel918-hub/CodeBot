const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');

// **Sua chave provisória (não compartilhe publicamente)**
const OPENAI_API_KEY = "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";

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
  }
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
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
    const res = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages:[
          { role: "system", content: "Você é um assistente de programação que responde perguntas, gera códigos e explica conceitos claramente." },
          { role: "user", content: text }
        ],
        temperature: 0.2
      })
    });

    const data = await res.json();
    chat.removeChild(thinkingMsg);
    const botMessage = data.choices[0].message.content;
    addMessage(botMessage,'bot');
  } catch(err){
    chat.removeChild(thinkingMsg);
    addMessage("Erro ao se conectar à IA.","bot");
    console.error(err);
  }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e=>{if(e.key==='Enter') sendMessage();});
uploadBtn.addEventListener('click', ()=>fileInput.click());
fileInput.addEventListener('change', ()=>{
  for(const file of fileInput.files) addMessage(`Arquivo enviado: ${file.name}`,'user');
  fileInput.value='';
});
