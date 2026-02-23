import {FastifyInstance} from 'fastify';
import * as MovieController from '../controllers/movie.controllers';
import {CreateMovie, UpdateMovie} from '../models/movie.model';
import {movieSchemas} from '../schemas/movie.schemas';

interface MovieParams {
    id: string;
}

export default async function movieRoutes(fastify: FastifyInstance) {
    // Create a new movie
    fastify.post<{ Body: CreateMovie }>(
        '/movies',
        {
            schema: movieSchemas.create
        },
        MovieController.createMovie
    );

    // Get all movies
    fastify.get('/movies', {
        schema: movieSchemas.getAll
    }, MovieController.getAllMovies);

    // Get a movie by ID
    fastify.get<{ Params: MovieParams }>(
        '/movies/:id',
        {
            schema: movieSchemas.getById
        },
        MovieController.getMovieById
    );

    // Delete a movie
    fastify.delete<{ Params: MovieParams; Querystring: { force?: boolean } }>(
        '/movies/:id',
        {
            schema: movieSchemas.delete
        },
        MovieController.deleteMovie
    );

    // Update a movie
    fastify.put<{ Params: MovieParams; Body: UpdateMovie }>(
        '/movies/:id',
        {
            schema: movieSchemas.update
        },
        MovieController.updateMovie
    );
}
