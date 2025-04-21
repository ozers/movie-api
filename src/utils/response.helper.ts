import { FastifyReply } from 'fastify';

export const fastifyResponse = {
    success: <T>(reply: FastifyReply, data?: T, message?: string) => {
        return reply.status(200).send({ status: 'Success', data, message });
    },
    created: <T>(reply: FastifyReply, data?: T, message?: string) => {
        return reply.status(201).send({ status: 'Success', data, message });
    },
    notFound: (reply: FastifyReply, message: string = 'Not found') => {
        return reply.status(404).send({ status: 'Error', message });
    },
    serverError: (reply: FastifyReply, message: string = 'Internal server error') => {
        return reply.status(500).send({ status: 'Error', message });
    }
}; 