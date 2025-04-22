import { FastifyReply } from 'fastify';
import { BadRequestError, NotFoundError } from './errors';
import { fastifyResponse } from './response.helper';

export const handleError = (error: unknown, reply: FastifyReply) => {
    if (error instanceof BadRequestError) {
        return fastifyResponse.badRequest(reply, error.message);
    }
    if (error instanceof NotFoundError) {
        return fastifyResponse.notFound(reply, error.message);
    }
    return fastifyResponse.serverError(reply, 'An unexpected error occurred');
}; 