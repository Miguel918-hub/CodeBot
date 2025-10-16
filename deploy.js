let currentStep = 1;
let selectedFiles = [];

// Navegação entre steps
function nextStep(step) {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`stepContent${currentStep}`).classList.remove('active');
    
    currentStep++;
    
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.getElementById(`stepContent${currentStep}`).classList.add('active');
    
    updateDeployButton();
}

function prevStep(step) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`stepContent${currentStep}`).classList.remove('active');
    
    currentStep--;
    
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.getElementById(`stepContent${currentStep}`).classList.add('active');
}

// Validação do Step 1
function validateStep1() {
    const botName = document.getElementById('botName').value;
    const botToken = document.getElementById('botToken').value;
    
    if (!botName.trim()) {
        alert('❌ Por favor, insira um nome para o bot!');
        return false;
    }
    
    if (!botToken.trim()) {
        alert('❌ Por favor, insira o token do bot Discord!');
        return false;
    }
    
    if (botToken.length < 10) {
        alert('❌ Token inválido! Verifique o token do bot.');
        return false;
    }
    
    return true;
}

// Validação do Step 2
function validateStep2() {
    const hasFiles = selectedFiles.length > 0;
    const hasCode = document.getElementById('codeEditor').value.trim().length > 0;
    
    if (!hasFiles && !hasCode) {
        alert('❌ Por favor, faça upload dos arquivos do bot ou cole o código!');
        return false;
    }
    
    return true;
}

// Sistema de Upload de Arquivos
document.addEventListener('DOMContentLoaded', function() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileList = document.getElementById('fileList');
    
    // Clique na área de upload
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    // Seleção de arquivos
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
});

function handleFiles(files) {
    selectedFiles = Array.from(files);
    updateFileList();
    updateDeployButton();
}

function updateFileList() {
    const fileList = document.getElementById('fileList');
    const fileInfo = document.getElementById('fileInfo');
    
    if (selectedFiles.length === 0) {
        fileInfo.style.display = 'none';
        return;
    }
    
    fileInfo.style.display = 'block';
    fileList.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            📄 ${file.name} (${formatFileSize(file.size)})
            <button onclick="removeFile(${index})" style="margin-left: 10px; color: #dc3545; background: none; border: none; cursor: pointer;">🗑️</button>
        `;
        fileList.appendChild(li);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateFileList();
    updateDeployButton();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateDeployButton() {
    const deployBtn = document.getElementById('deployBtn');
    const hasFiles = selectedFiles.length > 0;
    const hasCode = document.getElementById('codeEditor').value.trim().length > 0;
    
    deployBtn.disabled = !(hasFiles || hasCode);
}

// Implantação do Bot
function deployBot() {
    const deployLog = document.getElementById('deployLog');
    const finalDeployBtn = document.getElementById('finalDeployBtn');
    
    deployLog.style.display = 'block';
    finalDeployBtn.disabled = true;
    finalDeployBtn.textContent = '🔄 Implantando...';
    
    // Simular processo de deploy
    simulateDeployProcess();
}

function simulateDeployProcess() {
    const deployLog = document.getElementById('deployLog');
    const finalDeployBtn = document.getElementById('finalDeployBtn');
    
    const steps = [
        { message: '✅ Configuração validada', delay: 1000 },
        { message: '📦 Criando container...', delay: 1500 },
        { message: '🔧 Configurando ambiente Node.js...', delay: 2000 },
        { message: '📥 Instalando dependências...', delay: 2500 },
        { message: '🔗 Conectando ao Discord...', delay: 3000 },
        { message: '🎉 Bot implantado com sucesso!', delay: 1000 }
    ];
    
    let currentStep = 0;
    
    function nextStep() {
        if (currentStep >= steps.length) {
            // Deploy completo
            finalDeployBtn.textContent = '✅ Deploy Concluído';
            finalDeployBtn.style.background = '#28a745';
            
            // Salvar bot no localStorage
            saveBotToDashboard();
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
            
            return;
        }
        
        const step = steps[currentStep];
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${currentStep === steps.length - 1 ? 'success' : 'info'}`;
        logEntry.textContent = step.message;
        deployLog.appendChild(logEntry);
        deployLog.scrollTop = deployLog.scrollHeight;
        
        currentStep++;
        setTimeout(nextStep, step.delay);
    }
    
    nextStep();
}

function saveBotToDashboard() {
    const botName = document.getElementById('botName').value;
    const botData = {
        id: 'bot_' + Date.now(),
        name: botName,
        status: 'online',
        ram: '124',
        uptime: '100%',
        createdAt: new Date().toISOString()
    };
    
    // Salvar no localStorage (em produção seria no backend)
    let userBots = JSON.parse(localStorage.getItem('userBots')) || [];
    userBots.push(botData);
    localStorage.setItem('userBots', JSON.stringify(userBots));
}

// Monitorar editor de código
document.getElementById('codeEditor')?.addEventListener('input', updateDeployButton);
