import {FastifyReply, FastifyRequest} from 'fastify';
import * as movieService from '../services/movie.service';
import {Movie} from '../models/movie.model';
import {fastifyResponse} from '../utils/response.helper';

export const getAllMovies = async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
        const movies = await movieService.getAllMovies();
        return fastifyResponse.success(reply, {movies});
    } catch (error) {
        console.error('Error getting all:', error);
        return fastifyResponse.serverError(reply);
    }
};

export const getMovieById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
) => {
    try {
        const movie = await movieService.getMovieById(request.params.id);

        if (!movie) {
            return fastifyResponse.notFound(reply, 'Movie not found');
        }

        return fastifyResponse.success(reply, {...movie});
    } catch (error) {
        console.error(`Error get ${request.params.id}:`, error);
        return fastifyResponse.serverError(reply);
    }
};

export const createMovie = async (
    request: FastifyRequest<{ Body: Movie }>,
    reply: FastifyReply
) => {
    try {
        const movie = await movieService.createMovie(request.body);
        return fastifyResponse.created(reply, {...movie}, 'Movie created successfully');
    } catch (error) {
        console.error('Error create:', error);
        return fastifyResponse.serverError(reply);
    }
};

export const updateMovie = async (
    request: FastifyRequest<{
        Params: { id: string };
        Body: Movie
    }>,
    reply: FastifyReply
) => {
    try {
        const movie = await movieService.updateMovie(request.params.id, request.body);

        if (!movie) {
            return fastifyResponse.notFound(reply, 'Movie not found');
        }

        return fastifyResponse.success(reply, {...movie}, 'Movie updated successfully');
    } catch (error) {
        console.error(`Error update ${request.params.id}:`, error);
        return fastifyResponse.serverError(reply);
    }
};

export const deleteMovie = async (
    request: FastifyRequest<{
        Params: { id: string };
        Querystring: { force?: boolean }
    }>,
    reply: FastifyReply
) => {
    try {
        const deleted = await movieService.deleteMovie(
            request.params.id,
            request.query.force
        );

        if (!deleted) {
            return fastifyResponse.notFound(reply, 'Movie not found');
        }

        const message = request.query.force
            ? 'Movie permanently deleted!'
            : 'Movie deleted successfully';

        return fastifyResponse.success(reply, null, message);
    } catch (error) {
        console.error(`Error delete ${request.params.id}:`, error);
        return fastifyResponse.serverError(reply);
    }
};
