import {fastifyResponse} from "../utils/response.helper";
import {FastifyReply, FastifyRequest} from "fastify";
import * as directorService from '../services/director.service'
import {Director} from "../models/director.model";

export const getAllDirectors = async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
        const directors = await directorService.getAllDirectors();
        return fastifyResponse.success(reply, {directors});
    } catch (error) {
        console.error('Error getting all directors:', error);
        return fastifyResponse.serverError(reply);
    }
}

export const getDirectorById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply) => {
    try {
        const director = await directorService.getDirectorById(request.params.id);

        if (!director) {
            return fastifyResponse.notFound(reply, 'Director not found');
        }

        return fastifyResponse.success(reply, {...director});
    } catch (error) {
        console.error(`Error getting director ${request.params.id}:`, error);
        return fastifyResponse.serverError(reply);
    }
}

export const createDirector = async (
    request: FastifyRequest<{ Body: Director }>,
    reply: FastifyReply
) => {
    try {
        const director = await directorService.createDirector(request.body);
        return fastifyResponse.created(reply, {...director}, 'Director created successfully');
    } catch (error) {
        console.error('Error creating director:', error);
        return fastifyResponse.serverError(reply);
    }
}

export const updateDirector = async (
    request: FastifyRequest<{
        Params: { id: string };
        Body: Director
    }>,
    reply: FastifyReply
) => {
    try {
        const director = await directorService.updateDirector(request.params.id, request.body);

        if (!director) {
            return fastifyResponse.notFound(reply, 'Director not found');
        }

        return fastifyResponse.success(reply, {...director}, 'Director updated successfully');
    } catch (error) {
        console.error(`Error updating director ${request.params.id}:`, error);
        return fastifyResponse.serverError(reply);
    }
};

export const deleteDirector = async (
    request: FastifyRequest<{
        Params: { id: string };
        Querystring: { force?: boolean }
    }>,
    reply: FastifyReply
) => {
    try {
        const deleted = await directorService.deleteDirector(
            request.params.id,
            request.query.force
        );

        if (!deleted) {
            return fastifyResponse.notFound(reply, 'Director not found');
        }

        const message = request.query.force
            ? 'Director permanently deleted!'
            : 'Director deleted successfully';

        return fastifyResponse.success(reply, null, message);
    } catch (error) {
        console.error(`Error deleting director ${request.params.id}:`, error);
        return fastifyResponse.serverError(reply);
    }
};
