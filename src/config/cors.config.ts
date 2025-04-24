import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { FastifyCorsOptions } from '@fastify/cors';

export const corsConfig: FastifyCorsOptions = {
    origin: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true
};

export const registerCors = async (fastify: FastifyInstance) => {
    await fastify.register(cors, corsConfig);
}; 