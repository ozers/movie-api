import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export const swaggerConfig = {
    swagger: {
        info: {
            title: 'Movie API Documentation',
            description: 'API documentation for Movie API',
            version: '1.0.0'
        },
        host: `${process.env.HOST}:${process.env.PORT}`,
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
            { name: 'movies', description: 'Movie related end-points' },
            { name: 'directors', description: 'Director related end-points' }
        ]
    }
};

export const swaggerUiConfig = {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list' as const,
        deepLinking: false
    }
};

export const registerSwagger = async (fastify: FastifyInstance) => {
    await fastify.register(swagger, swaggerConfig);
    await fastify.register(swaggerUi, swaggerUiConfig);
}; 