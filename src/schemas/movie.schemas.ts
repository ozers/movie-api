import { CreateMovieFastifySchema, MovieFastifySchema, UpdateMovieFastifySchema, ByIdMovieFastifySchema } from '../models/movie.model';

export const movieSchemas = {
    create: {
        tags: ['movies'],
        summary: 'Create a new movie',
        description: 'Creates a new movie with the request body.',
        body: CreateMovieFastifySchema,
        response: {
            201: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['Success'] },
                    data: MovieFastifySchema,
                    message: { type: 'string' }
                }
            }
        }
    },
    getAll: {
        tags: ['movies'],
        summary: 'Get all movies',
        description: 'Retrieves a list of all movies.',
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['Success'] },
                    data: {
                        type: 'array',
                        items: MovieFastifySchema
                    },
                    message: { type: 'string' }
                }
            }
        }
    },
    getById: {
        tags: ['movies'],
        summary: 'Get movie by ID',
        description: 'Retrieves a specific movie by its ID.',
        params: ByIdMovieFastifySchema,
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['Success'] },
                    data: MovieFastifySchema,
                    message: { type: 'string' }
                }
            },
            404: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['Error'] },
                    message: { type: 'string' }
                }
            }
        }
    },
    delete: {
        tags: ['movies'],
        summary: 'Delete a movie',
        description: 'Deletes a movie by its ID.',
        params: ByIdMovieFastifySchema,
        querystring: {
            type: 'object',
            properties: {
                force: { type: 'boolean', default: false }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['Success'] },
                    message: { type: 'string' }
                }
            },
            404: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['Error'] },
                    message: { type: 'string' }
                }
            }
        }
    },
    update: {
        tags: ['movies'],
        summary: 'Update a movie',
        description: 'Updates the movie with the provided information.',
        params: ByIdMovieFastifySchema,
        body: UpdateMovieFastifySchema,
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['Success'] },
                    data: MovieFastifySchema,
                    message: { type: 'string' }
                }
            },
            404: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['Error'] },
                    message: { type: 'string' }
                }
            }
        }
    }
}; 