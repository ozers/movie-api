import {FastifyReply, FastifyRequest} from 'fastify';
import * as movieService from '../services/movie.service';
import {Movie, UpdateMovie} from '../models/movie.model';
import { fastifyResponse } from '../utils/response.helper';
import { handleError } from '../utils/error.helper';

export const getAllMovies = async (_request: FastifyRequest, reply: FastifyReply): Promise<Movie[]> => {
    try {
        const movies = await movieService.getAllMovies();
        return fastifyResponse.success(reply, movies, 'Movies retrieved successfully');
    } catch (error) {
        _request.log.error('Error getting all movies:', error);
        return handleError(error, reply);
    }
};

export const getMovieById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
): Promise<Movie> => {
    try {
        const movie = await movieService.getMovieById(request.params.id);
        return fastifyResponse.success(reply, movie, 'Movie retrieved successfully');
    } catch (error) {
        request.log.error(`Error getting movie ${request.params.id}:`, error);
        return handleError(error, reply);
    }
};

export const createMovie = async (
    request: FastifyRequest<{ Body: Movie }>,
    reply: FastifyReply
): Promise<Movie> => {
    try {
        const movie = await movieService.createMovie(request.body);
        return fastifyResponse.created(reply, movie, 'Movie created successfully');
    } catch (error) {
        request.log.error('Error creating movie:', error);
        
        if (error instanceof Error && error.name === 'ValidationError') {
            request.log.error(`Validation error: ${error.message}`);
        }
        
        return handleError(error, reply);
    }
};

export const updateMovie = async (
    request: FastifyRequest<{
        Params: { id: string };
        Body: UpdateMovie;
    }>,
    reply: FastifyReply
): Promise<Movie> => {
    try {
        const movie = await movieService.updateMovie(request.params.id, request.body);
        return fastifyResponse.success(reply, movie, 'Movie updated successfully');
    } catch (error) {
        request.log.error(`Error updating movie ${request.params.id}:`, error);
        return handleError(error, reply);
    }
};

export const deleteMovie = async (
    request: FastifyRequest<{
        Params: { id: string };
        Querystring: { force?: boolean }
    }>,
    reply: FastifyReply
): Promise<void> => {
    try {
        await movieService.deleteMovie(
            request.params.id,
            request.query.force
        );

        const message = request.query.force
            ? 'Movie permanently deleted!'
            : 'Movie deleted successfully';

        return fastifyResponse.success(reply, null, message);
    } catch (error) {
        request.log.error(`Error deleting movie ${request.params.id}:`, error);
        return handleError(error, reply);
    }
};
