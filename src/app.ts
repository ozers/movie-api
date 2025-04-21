import 'dotenv/config'
import Fastify, {FastifyInstance, RouteShorthandOptions} from 'fastify'
import cors from '@fastify/cors'
import movieRoutes from './routes/movie.routes'
import directorRoutes from "./routes/director.routes";

const fastify: FastifyInstance = Fastify({
    logger: true
})

fastify.register(cors, {
    origin: '*',
    methods: ['GET,PUT,POST,DELETE,OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600,
})

// Register Routes
fastify.register(movieRoutes, { prefix: process.env.API_PREFIX });
fastify.register(directorRoutes, { prefix: process.env.API_PREFIX });

const opts: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    pong: {
                        type: 'string'
                    }
                }
            }
        }
    }
}

fastify.get('/ping', opts, async () => {
    return {pong: 'it worked!'}
})

const start = async () => {
    try {
        await fastify.ready()
        await fastify.listen({port: Number(process.env.PORT)})

        const address = fastify.server.address()
        const port = typeof address === 'string' ? address : address?.port
        console.log(`Server is running on http://${process.env.HOST}:${port}`);
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

(async () => {
    try {
        await start()
    } catch (err) {
        console.error('Error starting server:', err)
        process.exit(1)
    }
})()