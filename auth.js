// Função para mostrar/esconder senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
}

// Login com Discord
function loginWithDiscord() {
    alert('🚀 Redirecionando para login com Discord...\n\n📝 Em produção, isso integraria com OAuth2 do Discord');
    // window.location.href = 'https://discord.com/oauth2/authorize?client_id=SEU_CLIENT_ID&redirect_uri=SUA_URL&response_type=code&scope=identify%20email';
}

// Login com Google
function loginWithGoogle() {
    alert('🔐 Redirecionando para login com Google...\n\n📝 Em produção, isso integraria com Google OAuth');
}

// Login com Apple
function loginWithApple() {
    alert('🍎 Redirecionando para login com Apple...\n\n📝 Em produção, isso integraria com Apple Sign In');
}

// Formulário de Registro
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validações
    if (password !== confirmPassword) {
        alert('❌ As senhas não coincidem!');
        return;
    }
    
    if (password.length < 6) {
        alert('❌ A senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    if (!email.includes('@')) {
        alert('❌ Por favor, insira um email válido!');
        return;
    }
    
    // Simular envio de código de verificação
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Salvar dados temporariamente
    sessionStorage.setItem('tempUser', JSON.stringify({
        username,
        email,
        password,
        verificationCode
    }));
    
    // Simular envio de email
    alert(`📧 Código de verificação enviado para: ${email}\n\n🔐 Código: ${verificationCode}\n\n💡 Apenas para teste - em produção isso seria enviado por email real`);
    
    // Redirecionar para verificação
    window.location.href = 'verify-email.html';
});

// Formulário de Verificação
document.getElementById('verifyForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userInput = document.getElementById('verificationCode').value.toUpperCase();
    const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));
    
    if (!tempUser) {
        alert('❌ Sessão expirada. Por favor, registre-se novamente.');
        window.location.href = 'register.html';
        return;
    }
    
    if (userInput === tempUser.verificationCode) {
        // Código correto - criar conta
        alert('✅ Email verificado com sucesso!\n\n🎉 Conta CloudiX criada! Redirecionando...');
        
        // Salvar usuário logado
        const userData = {
            username: tempUser.username,
            email: tempUser.email,
            plan: 'free',
            joined: new Date().toISOString()
        };
        
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.removeItem('tempUser');
        
        window.location.href = 'dashboard.html';
    } else {
        alert('❌ Código de verificação incorreto!\n\n💡 Verifique se digitou o código corretamente.');
    }
});

// Reenviar código
function resendCode() {
    const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));
    if (tempUser) {
        alert(`📧 Novo código enviado para: ${tempUser.email}\n\n🔐 Código: ${tempUser.verificationCode}\n\n💡 Apenas para teste`);
    } else {
        alert('❌ Sessão expirada. Por favor, registre-se novamente.');
        window.location.href = 'register.html';
    }
}

// Formulário de Login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validação básica
    if (!email || !password) {
        alert('❌ Por favor, preencha todos os campos!');
        return;
    }
    
    // Simular login bem-sucedido
    alert('🔐 Login realizado com sucesso!\n\n🎉 Redirecionando para o Dashboard...');
    
    const userData = {
        username: email.split('@')[0],
        email: email,
        plan: 'free',
        joined: new Date().toISOString()
    };
    
    sessionStorage.setItem('user', JSON.stringify(userData));
    window.location.href = 'dashboard.html';
});

// Verificar se usuário já está logado
function checkAuth() {
    const user = sessionStorage.getItem('user');
    if (user && (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html'))) {
        window.location.href = 'dashboard.html';
    }
}

// Executar verificação quando a página carregar
document.addEventListener('DOMContentLoaded', checkAuth);
