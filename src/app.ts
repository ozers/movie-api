import 'dotenv/config'
import Fastify, { FastifyInstance } from 'fastify'
import movieRoutes from './routes/movie.routes'
import directorRoutes from "./routes/director.routes";
import { registerSwagger } from './config/swagger.config';
import { registerCors } from './config/cors.config';
import { startServer } from './config/server.config';
import { errorHandler } from './middleware/errorHandler';
import connectDB from './config/mongoose.config';
import { connectRedis } from './utils/redis.client';

const app: FastifyInstance = Fastify({
    logger: true
})

// Redirect to docs page
app.get('/', async (_request, reply) => {
    reply.redirect('/docs');
});

app.get('/home', async (_request, reply) => {
    reply.redirect('/docs');
});

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
        await connectDB();
        
        await connectRedis();

        await registerPlugins();
        registerRoutes();
        await startServer(app);
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

initializeApp().catch(error => {
    console.error('Failed to initialize application:', error);
    process.exit(1);
});