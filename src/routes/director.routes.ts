import { FastifyInstance } from 'fastify';
import {Director, directorSchema} from '../models/director.model';
import * as DirectorController from '../controllers/director.controllers';

interface DirectorParams {
    id: string;
}

const deleteDirectorSchema = {
    querystring: {
        type: 'object',
        properties: {
            force: { type: 'boolean', default: false }
        }
    }
};

export default async function directorRoutes(fastify: FastifyInstance) {
    // Create new director
    fastify.post<{ Body: Director }>(
        '/directors',
         DirectorController.createDirector
    );

    // Get all directors
    fastify.get('/directors', {
        handler: DirectorController.getAllDirectors
    });

    // Get director by id
    fastify.get<{ Params: DirectorParams }>('/directors/:id', {
        handler: DirectorController.getDirectorById
    });

    // Delete director
    fastify.delete<{ Params: DirectorParams; Querystring: { force?: boolean } }>('/directors/:id', {
        schema: deleteDirectorSchema,
        handler: DirectorController.deleteDirector
    });

    // Update director
    fastify.put<{ Params: DirectorParams; Body: Director }>('/directors/:id', {
        schema: {
            body: directorSchema
        },
        handler: DirectorController.updateDirector
    });
}