const express = require('express');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const BotManager = require('./bot-manager');

const app = express();
const PORT = process.env.PORT || 3000;
const botManager = new BotManager();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
}));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas da API
app.post('/api/deploy', async (req, res) => {
    try {
        if (!req.files || !req.files.botZip) {
            return res.status(400).json({ 
                success: false, 
                error: 'Arquivo ZIP do bot é obrigatório' 
            });
        }

        const { discordToken, userId } = req.body;
        
        if (!discordToken || !userId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Token do Discord e User ID são obrigatórios' 
            });
        }

        const zipBuffer = req.files.botZip.data;
        
        // Em produção, extrair e validar cloudix.config do ZIP
        const config = {
            name: req.body.botName || 'MeuBot',
            main: req.body.mainFile || 'index.js',
            ram: req.body.ram || '512'
        };

        const result = await botManager.deployBot(userId, {
            name: config.name,
            zipBuffer: zipBuffer,
            discordToken: discordToken,
            config: config
        });

        res.json(result);

    } catch (error) {
        console.error('Deploy error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.post('/api/bots/:botId/restart', async (req, res) => {
    try {
        const { botId } = req.params;
        const result = await botManager.restartBot(botId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.post('/api/bots/:botId/stop', async (req, res) => {
    try {
        const { botId } = req.params;
        const result = await botManager.stopBot(botId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.post('/api/bots/:botId/update', async (req, res) => {
    try {
        const { botId } = req.params;
        
        if (!req.files || !req.files.botZip) {
            return res.status(400).json({ 
                success: false, 
                error: 'Arquivo ZIP é obrigatório' 
            });
        }

        const zipBuffer = req.files.botZip.data;
        const result = await botManager.updateBotCode(botId, zipBuffer);
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.get('/api/bots/:botId/status', async (req, res) => {
    try {
        const { botId } = req.params;
        const status = botManager.getBotStatus(botId);
        res.json({ success: true, status });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.get('/api/users/:userId/bots', async (req, res) => {
    try {
        const { userId } = req.params;
        const bots = botManager.getUserBots(userId);
        res.json({ success: true, bots });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.delete('/api/bots/:botId', async (req, res) => {
    try {
        const { botId } = req.params;
        const result = await botManager.deleteBot(botId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'online', 
        service: 'CloudiX API',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Servir frontend para todas as outras rotas
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 CloudiX Server running on port ${PORT}`);
    console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
});
