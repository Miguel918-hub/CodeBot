const RailwayService = require('./railway-service');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

class BotManager {
    constructor() {
        this.railway = new RailwayService();
        this.bots = new Map(); // Em produção, usar database
    }

    // Deploy de um novo bot
    async deployBot(userId, botData) {
        const { 
            name, 
            zipBuffer, 
            discordToken, 
            config 
        } = botData;

        const botId = uuidv4();

        try {
            // 1. Criar projeto no Railway
            const project = await this.railway.createProject(`cloudix-${name}-${botId}`);
            
            // 2. Configurar variáveis de ambiente
            await this.railway.setEnvironmentVariables(project.id, {
                DISCORD_TOKEN: discordToken,
                BOT_NAME: name,
                NODE_ENV: 'production',
                PORT: '3000'
            });

            // 3. Fazer deploy do código
            const deployment = await this.railway.deployCode(project.id, zipBuffer);

            // 4. Salvar informações do bot
            const botInfo = {
                id: botId,
                userId: userId,
                name: name,
                projectId: project.id,
                deploymentId: deployment.id,
                config: config,
                status: 'deploying',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            this.bots.set(botId, botInfo);

            // 5. Iniciar monitoramento
            this.monitorDeployment(botId);

            return {
                success: true,
                botId: botId,
                projectId: project.id,
                deploymentId: deployment.id,
                status: 'deploying'
            };

        } catch (error) {
            console.error('Deploy error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Monitorar deployment
    async monitorDeployment(botId) {
        const bot = this.bots.get(botId);
        if (!bot) return;

        const checkStatus = async () => {
            try {
                const status = await this.railway.getDeploymentStatus(bot.deploymentId);
                
                bot.status = status.status.toLowerCase();
                bot.updatedAt = new Date();

                if (['success', 'failed', 'cancelled'].includes(bot.status)) {
                    // Deployment finalizado
                    console.log(`Deployment ${botId} finished with status: ${bot.status}`);
                } else {
                    // Continuar monitorando
                    setTimeout(checkStatus, 5000);
                }

            } catch (error) {
                console.error('Monitor error:', error);
                setTimeout(checkStatus, 10000);
            }
        };

        checkStatus();
    }

    // Reiniciar bot
    async restartBot(botId) {
        const bot = this.bots.get(botId);
        if (!bot) {
            throw new Error('Bot não encontrado');
        }

        try {
            // Obter service ID do projeto
            const projects = await this.railway.listProjects();
            const project = projects.find(p => p.id === bot.projectId);
            
            if (!project || !project.services.edges.length) {
                throw new Error('Serviço não encontrado');
            }

            const serviceId = project.services.edges[0].node.id;
            await this.railway.restartService(serviceId);

            bot.status = 'restarting';
            bot.updatedAt = new Date();

            return { success: true, message: 'Bot reiniciado' };

        } catch (error) {
            throw new Error(`Erro ao reiniciar: ${error.message}`);
        }
    }

    // Parar bot (deletar projeto)
    async stopBot(botId) {
        const bot = this.bots.get(botId);
        if (!bot) {
            throw new Error('Bot não encontrado');
        }

        try {
            await this.railway.deleteProject(bot.projectId);
            bot.status = 'stopped';
            bot.updatedAt = new Date();

            return { success: true, message: 'Bot parado' };

        } catch (error) {
            throw new Error(`Erro ao parar bot: ${error.message}`);
        }
    }

    // Atualizar código do bot
    async updateBotCode(botId, zipBuffer) {
        const bot = this.bots.get(botId);
        if (!bot) {
            throw new Error('Bot não encontrado');
        }

        try {
            const deployment = await this.railway.deployCode(bot.projectId, zipBuffer);
            
            bot.deploymentId = deployment.id;
            bot.status = 'updating';
            bot.updatedAt = new Date();

            // Reiniciar monitoramento
            this.monitorDeployment(botId);

            return { 
                success: true, 
                deploymentId: deployment.id,
                message: 'Código atualizado' 
            };

        } catch (error) {
            throw new Error(`Erro ao atualizar código: ${error.message}`);
        }
    }

    // Obter status do bot
    getBotStatus(botId) {
        const bot = this.bots.get(botId);
        if (!bot) {
            throw new Error('Bot não encontrado');
        }

        return {
            id: bot.id,
            name: bot.name,
            status: bot.status,
            projectId: bot.projectId,
            createdAt: bot.createdAt,
            updatedAt: bot.updatedAt,
            config: bot.config
        };
    }

    // Listar bots do usuário
    getUserBots(userId) {
        const userBots = [];
        
        for (const [botId, bot] of this.bots) {
            if (bot.userId === userId) {
                userBots.push({
                    id: bot.id,
                    name: bot.name,
                    status: bot.status,
                    createdAt: bot.createdAt,
                    config: bot.config
                });
            }
        }

        return userBots;
    }

    // Deletar bot
    async deleteBot(botId) {
        const bot = this.bots.get(botId);
        if (!bot) {
            throw new Error('Bot não encontrado');
        }

        try {
            await this.railway.deleteProject(bot.projectId);
            this.bots.delete(botId);

            return { success: true, message: 'Bot deletado' };

        } catch (error) {
            throw new Error(`Erro ao deletar bot: ${error.message}`);
        }
    }
}

module.exports = BotManager;
