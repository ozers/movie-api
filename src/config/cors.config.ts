import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export const corsConfig = {
    origin: '*',
    methods: ['GET,PUT,POST,DELETE,OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600,
};

export const registerCors = async (fastify: FastifyInstance) => {
    await fastify.register(cors, corsConfig);
}; 