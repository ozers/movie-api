import 'dotenv/config'
import Fastify, { FastifyInstance } from 'fastify'
import movieRoutes from './routes/movie.routes'
import directorRoutes from "./routes/director.routes";
import { registerSwagger } from './config/swagger.config';
import { registerCors } from './config/cors.config';
import { startServer } from './config/server.config';
import { errorHandler } from './middleware/errorHandler';
import connectDB from './config/mongoose.config';

connectDB();

const app: FastifyInstance = Fastify({
    logger: true
})

const registerPlugins = async () => {
    await registerCors(app);
    await registerSwagger(app);
    app.setErrorHandler(errorHandler);
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