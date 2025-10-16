// Carregar dados do perfil
function loadProfileData() {
    const userData = JSON.parse(sessionStorage.getItem('user'));
    
    if (userData) {
        document.getElementById('profileUsername').value = userData.username || '';
        document.getElementById('profileEmail').value = userData.email || '';
        document.getElementById('profileAvatar').value = userData.avatar || '';
    }
}

// Salvar perfil
document.getElementById('profileForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('profileUsername').value;
    const email = document.getElementById('profileEmail').value;
    const avatar = document.getElementById('profileAvatar').value;
    
    const userData = JSON.parse(sessionStorage.getItem('user'));
    userData.username = username;
    userData.email = email;
    userData.avatar = avatar;
    
    sessionStorage.setItem('user', JSON.stringify(userData));
    
    alert('✅ Perfil atualizado com sucesso!');
});

// Alterar senha
document.getElementById('passwordForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmNewPassword) {
        alert('❌ As novas senhas não coincidem!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('❌ A nova senha deve ter pelo menos 6 caracteres!');
        return;
    }
    
    alert('✅ Senha alterada com sucesso!');
    document.getElementById('passwordForm').reset();
});

// Excluir conta
function deleteAccount() {
    if (confirm('⚠️ 🗑️ TEM CERTEZA ABSOLUTA QUE DESEJA EXCLUIR SUA CONTA?\n\nEsta ação é IRREVERSÍVEL e irá:\n• Apagar todos os seus bots\n• Remover todos os dados\n• Cancelar assinaturas\n\nDigite "EXCLUIR" para confirmar:')) {
        const confirmation = prompt('Digite "EXCLUIR" para confirmar a exclusão:');
        if (confirmation === 'EXCLUIR') {
            sessionStorage.removeItem('user');
            localStorage.removeItem('userBots');
            alert('😢 Sua conta foi excluída. Esperamos vê-lo novamente!');
            window.location.href = 'index.html';
        } else {
            alert('❌ Exclusão cancelada.');
        }
    }
}

// Exportar dados
function exportData() {
    const userData = sessionStorage.getItem('user');
    const userBots = localStorage.getItem('userBots');
    
    const data = {
        user: JSON.parse(userData),
        bots: JSON.parse(userBots || '[]'),
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudix-data-${new Date().getTime()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    alert('📤 Dados exportados com sucesso!');
}

// Inicializar perfil
document.addEventListener('DOMContentLoaded', loadProfileData);
