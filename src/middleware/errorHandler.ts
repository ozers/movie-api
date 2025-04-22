import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../utils/errors';

interface ErrorResponse {
    status: string;
    message: string;
    stack?: string;
}

export const errorHandler = (
    error: FastifyError | AppError,
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const isAppError = error instanceof AppError;

    const statusCode = isAppError
        ? error.statusCode
        : typeof error.statusCode === 'number'
            ? error.statusCode
            : 500;

    const message = error.message || 'Internal Server Error';

    const stack = process.env.NODE_ENV === 'development' ? error.stack : undefined;

    // Log error with request context
    request.log.error({
        err: error,
        reqId: request.id,
        url: request.url,
        method: request.method,
        statusCode
    }, `Error occurred: ${message}`);

    const errorResponse: ErrorResponse = {
        status: 'error',
        message,
        ...(stack && { stack })
    };

    reply.status(statusCode).send(errorResponse);
}; 