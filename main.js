// Smooth scroll para links internos
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Animação de digitação no terminal
    const terminalContent = document.querySelector('.terminal-content');
    if (terminalContent) {
        setTimeout(() => {
            terminalContent.innerHTML = `
                <p><span class="green">$</span> cloudix deploy</p>
                <p>🚀 Iniciando deploy...</p>
                <p>📦 Instalando dependências...</p>
                <p>🔗 Conectando ao Discord...</p>
                <p>✅ Bot conectado com sucesso!</p>
                <p>📊 Status: <span class="green">ONLINE</span></p>
                <p>💾 RAM: <span class="green">124MB</span></p>
                <p>⏱️ Uptime: <span class="green">100%</span></p>
            `;
        }, 1000);
    }
});

// Verificar se usuário está logado para mostrar botão diferente
function updateNavigation() {
    const user = sessionStorage.getItem('user');
    const navLinks = document.querySelector('.nav-links');
    
    if (user && navLinks) {
        navLinks.innerHTML = `
            <li><a href="#features">Recursos</a></li>
            <li><a href="#pricing">Planos</a></li>
            <li><a href="#about">Sobre</a></li>
            <li><a href="dashboard.html" class="btn-login">Dashboard</a></li>
            <li><a href="#" onclick="logoutFromHome()" class="btn-register">Sair</a></li>
        `;
    }
}

// Logout da página inicial
function logoutFromHome() {
    if (confirm('🚪 Tem certeza que deseja sair?')) {
        sessionStorage.removeItem('user');
        location.reload();
    }
}

// Atualizar navegação quando a página carregar
document.addEventListener('DOMContentLoaded', updateNavigation);
