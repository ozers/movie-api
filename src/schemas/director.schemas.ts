import {CreateDirectorFastifySchema, DirectorFastifySchema, UpdateDirectorFastifySchema, ByIdDirectorFastifySchema} from '../models/director.model';

export const directorSchemas = {
    create: {
        tags: ['directors'],
        summary: 'Create a new director',
        description: 'Creates a new director with the request body.',
        body: CreateDirectorFastifySchema,
        response: {
            201: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['Success'] },
                    data: DirectorFastifySchema,
                    message: { type: 'string' }
                }
            }
        }
    },
    getAll: {
        tags: ['directors'],
        summary: 'Get all directors',
        description: 'Retrieves a list of all directors.',
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['Success'] },
                    data: {
                        type: 'array',
                        items: DirectorFastifySchema
                    },
                    message: { type: 'string' }
                }
            }
        }
    },
    getById: {
        tags: ['directors'],
        summary: 'Get director by ID',
        description: 'Retrieves a specific director by their ID.',
        params: ByIdDirectorFastifySchema,
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['Success'] },
                    data: DirectorFastifySchema,
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
        tags: ['directors'],
        summary: 'Delete a director',
        description: 'Deletes a director by their ID.',
        params: ByIdDirectorFastifySchema,
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
        tags: ['directors'],
        summary: 'Update a director',
        description: 'Updates the director with the provided information.',
        params: ByIdDirectorFastifySchema,
        body: UpdateDirectorFastifySchema,
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['Success'] },
                    data: DirectorFastifySchema,
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