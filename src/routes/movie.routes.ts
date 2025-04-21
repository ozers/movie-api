import {FastifyInstance} from 'fastify';
import * as MovieController from '../controllers/movie.controllers';
import {Movie} from '../models/movie.model';

interface MovieParams {
    id: string;
}

const deleteMovieSchema = {
    querystring: {
        type: 'object',
        properties: {
            force: { type: 'boolean', default: false }
        }
    }
};

export default async function movieRoutes(fastify: FastifyInstance) {
    // Create a new movie
    fastify.post<{ Body: Movie }>(
        '/movies',
        MovieController.createMovie
    );

    // Get all movies
    fastify.get('/movies', MovieController.getAllMovies);

    // Get a movie by ID
    fastify.get<{ Params: MovieParams }>(
        '/movies/:id',
        MovieController.getMovieById
    );

    // Delete a movie (queryString: force=true hard delete, default soft delete)
    fastify.delete<{ Params: MovieParams; Querystring: { force?: boolean } }>(
        '/movies/:id',
        {
            schema: deleteMovieSchema
        },
        MovieController.deleteMovie
    );

    // Update a movie
    fastify.put<{ Params: MovieParams; Body: Movie }>(
        '/movies/:id',
        MovieController.updateMovie
    );


}
