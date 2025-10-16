// Carregar dados do usuário
function loadUserData() {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
    
    // Atualizar interface
    document.getElementById('userName').textContent = userData.username;
    document.getElementById('usernameDisplay').textContent = userData.username;
    
    // Atualizar avatar
    const avatar = document.querySelector('.avatar');
    if (avatar) {
        avatar.textContent = userData.username.charAt(0).toUpperCase();
    }
}

// Logout
function logout() {
    if (confirm('🚪 Tem certeza que deseja sair da sua conta CloudiX?')) {
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}

// Carregar bots do usuário
function loadUserBots() {
    const userBots = JSON.parse(localStorage.getItem('userBots')) || [];
    const botsGrid = document.querySelector('.bots-grid');
    
    if (userBots.length === 0) {
        botsGrid.innerHTML = `
            <div class="no-bots">
                <div class="no-bots-icon">🤖</div>
                <h3>Nenhum bot implantado</h3>
                <p>Comece implantando seu primeiro bot Discord na CloudiX</p>
                <a href="deploy.html" class="btn-primary">🚀 Implantar Primeiro Bot</a>
            </div>
        `;
    } else {
        // Mostrar lista de bots
        botsGrid.innerHTML = userBots.map(bot => `
            <div class="bot-card">
                <div class="bot-header">
                    <h3>${bot.name}</h3>
                    <span class="bot-status ${bot.status}">${bot.status === 'online' ? '🟢 Online' : '🔴 Offline'}</span>
                </div>
                <div class="bot-info">
                    <p><strong>ID:</strong> ${bot.id}</p>
                    <p><strong>RAM:</strong> ${bot.ram} MB</p>
                    <p><strong>Uptime:</strong> ${bot.uptime}</p>
                </div>
                <div class="bot-actions">
                    <button class="btn-small" onclick="restartBot('${bot.id}')">🔄 Reiniciar</button>
                    <button class="btn-small btn-danger" onclick="stopBot('${bot.id}')">⏹️ Parar</button>
                    <button class="btn-small btn-danger" onclick="deleteBot('${bot.id}')">🗑️ Excluir</button>
                </div>
            </div>
        `).join('');
    }
}

// Funções de controle de bots
function restartBot(botId) {
    alert(`🔄 Reiniciando bot ${botId}...\n\n💡 Em produção, isso reiniciaria o processo do bot`);
}

function stopBot(botId) {
    if (confirm(`⏹️ Tem certeza que deseja parar o bot ${botId}?`)) {
        alert(`🔴 Bot ${botId} parado!\n\n💡 Em produção, isso pararia o processo do bot`);
    }
}

function deleteBot(botId) {
    if (confirm(`🗑️ Tem certeza que deseja excluir o bot ${botId}?\n\n⚠️ Esta ação não pode ser desfeita!`)) {
        alert(`✅ Bot ${botId} excluído!\n\n💡 Em produção, isso removeria o bot do sistema`);
    }
}

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadUserBots();
    
    // Adicionar estilo para bot-card se não existir
    if (!document.querySelector('.bot-card')) {
        const style = document.createElement('style');
        style.textContent = `
            .bot-card {
                background: #2d2d2d;
                padding: 1.5rem;
                border-radius: 8px;
                border: 1px solid #333;
                margin-bottom: 1rem;
            }
            .bot-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            .bot-status {
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: bold;
            }
            .bot-status.online {
                background: #28a745;
                color: white;
            }
            .bot-status.offline {
                background: #dc3545;
                color: white;
            }
            .bot-info p {
                margin-bottom: 0.5rem;
                color: #ccc;
            }
            .bot-actions {
                display: flex;
                gap: 0.5rem;
                margin-top: 1rem;
            }
            .btn-small {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.8rem;
            }
            .btn-danger {
                background: #dc3545;
                color: white;
            }
        `;
        document.head.appendChild(style);
    }
});
