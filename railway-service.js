const fetch = require('node-fetch');

class RailwayService {
    constructor() {
        this.apiKey = process.env.RAILWAY_API_KEY;
        this.baseURL = 'https://backboard.railway.app/graphql/v2';
    }

    // Query GraphQL para Railway
    async graphqlQuery(query, variables = {}) {
        const response = await fetch(this.baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        const data = await response.json();
        
        if (data.errors) {
            throw new Error(`Railway API Error: ${data.errors[0].message}`);
        }

        return data.data;
    }

    // Criar projeto
    async createProject(name) {
        const query = `
            mutation CreateProject($name: String!) {
                projectCreate(input: { name: $name }) {
                    id
                    name
                    services {
                        edges {
                            node {
                                id
                                name
                            }
                        }
                    }
                }
            }
        `;

        const result = await this.graphqlQuery(query, { name });
        return result.projectCreate;
    }

    // Deploy de código
    async deployCode(projectId, zipBuffer) {
        // Primeiro precisamos criar um deployment
        const deploymentQuery = `
            mutation CreateDeployment($projectId: String!) {
                deploymentCreate(input: { projectId: $projectId }) {
                    id
                    status
                }
            }
        `;

        const deployment = await this.graphqlQuery(deploymentQuery, { projectId });
        
        // Aqui iria o upload do ZIP via API REST
        // (Railway tem método específico para upload)
        
        return deployment.deploymentCreate;
    }

    // Configurar variáveis de ambiente
    async setEnvironmentVariables(projectId, variables) {
        const query = `
            mutation SetVariables($projectId: String!, $variables: [VariableInput!]!) {
                projectUpdate(input: { 
                    id: $projectId, 
                    variables: $variables 
                }) {
                    id
                    name
                }
            }
        `;

        const vars = Object.entries(variables).map(([key, value]) => ({
            name: key,
            value: value
        }));

        return await this.graphqlQuery(query, {
            projectId,
            variables: vars
        });
    }

    // Reiniciar serviço
    async restartService(serviceId) {
        const query = `
            mutation RestartService($serviceId: String!) {
                serviceRestart(id: $serviceId) {
                    id
                    status
                }
            }
        `;

        return await this.graphqlQuery(query, { serviceId });
    }

    // Obter status do deployment
    async getDeploymentStatus(deploymentId) {
        const query = `
            query GetDeployment($deploymentId: String!) {
                deployment(id: $deploymentId) {
                    id
                    status
                    createdAt
                    updatedAt
                }
            }
        `;

        const result = await this.graphqlQuery(query, { deploymentId });
        return result.deployment;
    }

    // Listar projetos do usuário
    async listProjects() {
        const query = `
            query GetProjects {
                projects {
                    edges {
                        node {
                            id
                            name
                            services {
                                edges {
                                    node {
                                        id
                                        name
                                        status
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const result = await this.graphqlQuery(query);
        return result.projects.edges.map(edge => edge.node);
    }

    // Deletar projeto
    async deleteProject(projectId) {
        const query = `
            mutation DeleteProject($projectId: String!) {
                projectDelete(id: $projectId)
            }
        `;

        return await this.graphqlQuery(query, { projectId });
    }
}

module.exports = RailwayService;
