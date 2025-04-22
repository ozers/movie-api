import { FastifyInstance } from 'fastify';
import {Director} from '../models/director.model';
import * as DirectorController from '../controllers/director.controllers';
import {directorSchemas} from '../schemas/director.schemas';

interface DirectorParams {
    id: string;
}

export default async function directorRoutes(fastify: FastifyInstance) {
    // Create new director
    fastify.post<{ Body: Director }>(
        '/directors',
        {
            schema: directorSchemas.create
        },
        DirectorController.createDirector
    );

    // Get all directors
    fastify.get('/directors', {
        schema: directorSchemas.getAll,
        handler: DirectorController.getAllDirectors
    });

    // Get director by id
    fastify.get<{ Params: DirectorParams }>('/directors/:id', {
        schema: directorSchemas.getById,
        handler: DirectorController.getDirectorById
    });

    // Delete director
    fastify.delete<{ Params: DirectorParams; Querystring: { force?: boolean } }>('/directors/:id', {
        schema: directorSchemas.delete,
        handler: DirectorController.deleteDirector
    });

    // Update director
    fastify.put<{ Params: DirectorParams; Body: Director }>('/directors/:id', {
        schema: directorSchemas.update,
        handler: DirectorController.updateDirector
    });
}