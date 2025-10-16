// Função para mostrar/esconder senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
}

// Login com Discord
function loginWithDiscord() {
    // Aqui você integraria com OAuth2 do Discord
    alert('Redirecionando para login com Discord...');
    // window.location.href = 'https://discord.com/oauth2/authorize?client_id=SEU_CLIENT_ID&redirect_uri=SUA_URL&response_type=code&scope=identify%20email';
}

// Login com Google
function loginWithGoogle() {
    alert('Redirecionando para login com Google...');
    // Integração com Google OAuth
}

// Login com Apple
function loginWithApple() {
    alert('Redirecionando para login com Apple...');
    // Integração com Apple Sign In
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
        alert('As senhas não coincidem!');
        return;
    }
    
    if (password.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    // Simular envio de código de verificação
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Salvar dados temporariamente (em produção, isso seria no backend)
    sessionStorage.setItem('tempUser', JSON.stringify({
        username,
        email,
        password,
        verificationCode
    }));
    
    // Simular envio de email
    alert(`Código de verificação enviado para ${email}\nCódigo: ${verificationCode} (apenas para teste)`);
    
    // Redirecionar para verificação
    window.location.href = 'verify-email.html';
});

// Formulário de Verificação
document.getElementById('verifyForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userInput = document.getElementById('verificationCode').value;
    const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));
    
    if (userInput === tempUser.verificationCode) {
        // Código correto - criar conta
        alert('Conta criada com sucesso! Redirecionando...');
        sessionStorage.removeItem('tempUser');
        sessionStorage.setItem('user', JSON.stringify({
            username: tempUser.username,
            email: tempUser.email
        }));
        window.location.href = 'dashboard.html';
    } else {
        alert('Código de verificação incorreto!');
    }
});

// Reenviar código
function resendCode() {
    const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));
    if (tempUser) {
        alert(`Novo código enviado para ${tempUser.email}\nCódigo: ${tempUser.verificationCode}`);
    }
}

// Formulário de Login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simular login (em produção, isso verifica no backend)
    if (email && password) {
        sessionStorage.setItem('user', JSON.stringify({
            username: 'UsuarioTeste',
            email: email
        }));
        window.location.href = 'dashboard.html';
    } else {
        alert('Por favor, preencha todos os campos!');
    }
});
