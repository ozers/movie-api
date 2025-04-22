import 'dotenv/config'
import Fastify, { FastifyInstance } from 'fastify'
import movieRoutes from './routes/movie.routes'
import directorRoutes from "./routes/director.routes";
import { registerSwagger } from './config/swagger.config';
import { registerCors } from './config/cors.config';
import { startServer } from './config/server.config';

const app: FastifyInstance = Fastify({
    logger: true
})

const registerPlugins = async () => {
    await registerCors(app);
    await registerSwagger(app);
};

const registerRoutes = () => {
    app.register(movieRoutes, { prefix: process.env.API_PREFIX });
    app.register(directorRoutes, { prefix: process.env.API_PREFIX });
};

app.get('/ping', async () => ({ pong: 'it worked!' }));

const initializeApp = async () => {
    try {
        await registerPlugins();
        registerRoutes();
        await startServer(app);
    } catch (err) {
        console.error('Error starting server:', err);
        process.exit(1);
    }
};

initializeApp();