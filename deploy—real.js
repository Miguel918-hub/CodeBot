class CloudiXDeployer {
    constructor() {
        this.currentBot = null;
        this.deployLog = [];
    }

    // Validar arquivo ZIP e config
    async validateBotPackage(zipFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const zip = await JSZip.loadAsync(e.target.result);
                    
                    // Verificar se tem cloudix.config
                    if (!zip.files['cloudix.config']) {
                        throw new Error('❌ Arquivo cloudix.config não encontrado no ZIP');
                    }
                    
                    // Ler configuração
                    const configContent = await zip.files['cloudix.config'].async('text');
                    const config = this.parseConfig(configContent);
                    
                    // Validar configuração
                    this.validateConfig(config);
                    
                    // Verificar arquivo principal
                    if (!zip.files[config.MAIN]) {
                        throw new Error(`❌ Arquivo principal "${config.MAIN}" não encontrado`);
                    }
                    
                    resolve({
                        valid: true,
                        config: config,
                        zip: zip
                    });
                    
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.readAsArrayBuffer(zipFile);
        });
    }

    // Parse do cloudix.config
    parseConfig(configContent) {
        const lines = configContent.split('\n');
        const config = {};
        
        lines.forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#')) {
                const [key, value] = line.split('=');
                if (key && value) {
                    config[key.trim()] = value.trim().replace(/"/g, '');
                }
            }
        });
        
        return config;
    }

    // Validar configuração
    validateConfig(config) {
        const required = ['NAME', 'TYPE', 'MAIN', 'RAM', 'AUTORESTART', 'VERSION', 'APT'];
        
        required.forEach(field => {
            if (!config[field]) {
                throw new Error(`❌ Campo obrigatório faltando: ${field}`);
            }
        });
        
        if (config.TYPE !== 'bot') {
            throw new Error('❌ TYPE deve ser "bot"');
        }
        
        if (!['512', '1024', '2048'].includes(config.RAM)) {
            throw new Error('❌ RAM deve ser 512, 1024 ou 2048');
        }
        
        if (!['true', 'false'].includes(config.AUTORESTART)) {
            throw new Error('❌ AUTORESTART deve ser true ou false');
        }
    }

    // Fazer deploy REAL no Railway
    async deployToRailway(botConfig, zipFile, discordToken) {
        this.addLog('🚀 Iniciando deploy no Railway...', 'info');
        
        try {
            // 1. Criar projeto no Railway
            this.addLog('📦 Criando projeto no Railway...', 'info');
            const project = await this.createRailwayProject(botConfig.NAME);
            
            // 2. Fazer upload do código
            this.addLog('📤 Enviando arquivos...', 'info');
            await this.uploadToRailway(project.id, zipFile);
            
            // 3. Configurar variáveis de ambiente
            this.addLog('🔧 Configurando ambiente...', 'info');
            await this.setEnvironmentVariables(project.id, {
                DISCORD_TOKEN: discordToken,
                BOT_NAME: botConfig.NAME,
                MAIN_FILE: botConfig.MAIN
            });
            
            // 4. Iniciar deploy
            this.addLog('🎯 Iniciando implantação...', 'info');
            const deployment = await this.startDeployment(project.id);
            
            this.addLog('✅ Deploy iniciado com sucesso!', 'success');
            return {
                success: true,
                projectId: project.id,
                deploymentId: deployment.id,
                url: project.url
            };
            
        } catch (error) {
            this.addLog(`❌ Erro no deploy: ${error.message}`, 'error');
            throw error;
        }
    }

    // Criar projeto no Railway
    async createRailwayProject(name) {
        // Em produção, isso usaria a API real do Railway
        const response = await this.mockRailwayAPI('projects', {
            method: 'POST',
            body: JSON.stringify({ name: name })
        });
        
        return response;
    }

    // Upload para Railway
    async uploadToRailway(projectId, zipFile) {
        const formData = new FormData();
        formData.append('file', zipFile);
        
        const response = await this.mockRailwayAPI(`projects/${projectId}/deployments`, {
            method: 'POST',
            body: formData
        });
        
        return response;
    }

    // Configurar variáveis de ambiente
    async setEnvironmentVariables(projectId, variables) {
        for (const [key, value] of Object.entries(variables)) {
            await this.mockRailwayAPI(`projects/${projectId}/variables`, {
                method: 'POST',
                body: JSON.stringify({ key, value })
            });
        }
    }

    // Iniciar deployment
    async startDeployment(projectId) {
        const response = await this.mockRailwayAPI(`projects/${projectId}/deployments`, {
            method: 'POST'
        });
        
        return response;
    }

    // SIMULAÇÃO da API Railway (substituir por API real)
    async mockRailwayAPI(endpoint, options = {}) {
        this.addLog(`🔗 API Call: ${endpoint}`, 'debug');
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simular respostas da API
        const mockResponses = {
            'projects': { id: 'proj_' + Date.now(), name: options.body?.name, url: 'https://mybot.up.railway.app' },
            'projects/proj_123/deployments': { id: 'dep_' + Date.now(), status: 'building' },
            'projects/proj_123/variables': { success: true }
        };
        
        return mockResponses[endpoint] || { success: true };
    }

    // Controles do Bot
    async restartBot(projectId) {
        this.addLog('🔄 Reiniciando bot...', 'info');
        await this.mockRailwayAPI(`projects/${projectId}/restart`, { method: 'POST' });
        this.addLog('✅ Bot reiniciado!', 'success');
    }

    async stopBot(projectId) {
        this.addLog('⏹️ Parando bot...', 'info');
        await this.mockRailwayAPI(`projects/${projectId}/stop`, { method: 'POST' });
        this.addLog('✅ Bot parado!', 'success');
    }

    async startBot(projectId) {
        this.addLog('▶️ Iniciando bot...', 'info');
        await this.mockRailwayAPI(`projects/${projectId}/start`, { method: 'POST' });
        this.addLog('✅ Bot iniciado!', 'success');
    }

    async updateBotCode(projectId, zipFile) {
        this.addLog('📤 Atualizando código...', 'info');
        await this.uploadToRailway(projectId, zipFile);
        this.addLog('✅ Código atualizado!', 'success');
    }

    // Sistema de Logs
    addLog(message, type = 'info') {
        const logEntry = {
            timestamp: new Date().toLocaleTimeString(),
            message: message,
            type: type
        };
        
        this.deployLog.push(logEntry);
        this.updateLogDisplay();
    }

    updateLogDisplay() {
        const logContainer = document.getElementById('deployLog');
        if (logContainer) {
            logContainer.innerHTML = this.deployLog.map(entry => 
                `<div class="log-entry log-${entry.type}">[${entry.timestamp}] ${entry.message}</div>`
            ).join('');
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    }

    // Verificar status do deployment
    async getDeploymentStatus(projectId, deploymentId) {
        const status = await this.mockRailwayAPI(`projects/${projectId}/deployments/${deploymentId}`);
        return status;
    }
}

// Inicializar deployer global
window.cloudixDeployer = new CloudiXDeployer();
