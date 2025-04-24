import {FastifyReply, FastifyRequest} from "fastify";
import * as directorService from '../services/director.service'
import {CreateDirector, Director, ByIdDirector, UpdateDirector} from "../models/director.model";
import { fastifyResponse } from '../utils/response.helper';
import { handleError } from '../utils/error.helper';

export const getAllDirectors = async (_request: FastifyRequest, reply: FastifyReply): Promise<Director[]> => {
    try {
        const directors = await directorService.getAllDirectors();
        return fastifyResponse.success(reply, directors, 'Directors retrieved successfully');
    } catch (error) {
        _request.log.error('Error getting all directors:', error);
        return handleError(error, reply);
    }
}

export const getDirectorById = async (
    request: FastifyRequest<{ Params: ByIdDirector }>,
    reply: FastifyReply): Promise<Director> => {
    try {
        const director = await directorService.getDirectorById(request.params.id);
        return fastifyResponse.success(reply, director, 'Director retrieved successfully');
    } catch (error) {
        request.log.error(`Error getting director ${request.params.id}:`, error);
        return handleError(error, reply);
    }
}

export const createDirector = async (
    request: FastifyRequest<{ Body: Director }>,
    reply: FastifyReply
): Promise<CreateDirector> => {
    try {
        const director = await directorService.createDirector(request.body);
        return fastifyResponse.created(reply, director, 'Director created successfully');
    } catch (error) {
        request.log.error('Error creating director:', error);
        
        if (error instanceof Error && error.name === 'ValidationError') {
            request.log.error(`Validation error: ${error.message}`);
        }
        
        return handleError(error, reply);
    }
}

export const updateDirector = async (
    request: FastifyRequest<{
        Params: { id: string };
        Body: UpdateDirector
    }>,
    reply: FastifyReply
): Promise<Director> => {
    try {
        const director = await directorService.updateDirector(request.params.id, request.body);
        return fastifyResponse.success(reply, director, 'Director updated successfully');
    } catch (error) {
        request.log.error(`Error updating director ${request.params.id}:`, error);
        return handleError(error, reply);
    }
};

export const deleteDirector = async (
    request: FastifyRequest<{
        Params: { id: string };
        Querystring: { force?: boolean }
    }>,
    reply: FastifyReply
): Promise<void> => {
    try {
        await directorService.deleteDirector(
            request.params.id,
            request.query.force
        );

        const message = request.query.force
            ? 'Director permanently deleted!'
            : 'Director deleted successfully';

        return fastifyResponse.success(reply, null, message);
    } catch (error) {
        request.log.error(`Error deleting director ${request.params.id}:`, error);
        return handleError(error, reply);
    }
};
