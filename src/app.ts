import 'dotenv/config'
import Fastify from 'fastify'
import movieRoutes from './routes/movie.routes'
import directorRoutes from "./routes/director.routes";
import { registerSwagger } from './config/swagger.config';
import { registerCors } from './config/cors.config';
import { startServer } from './config/server.config';
import { errorHandler } from './middleware/errorHandler';
import connectDB from './config/mongoose.config';
import { connectRedis } from './utils/redis.client';
import { join } from 'path';
import { registerLogHooks } from './utils/log-hooks';

declare module 'fastify' {
  interface FastifyRequest {
    requestId: string
  }
}
const simpleId = () => Math.random().toString(36).substring(2, 2 + 8);

const logPath = process.env.LOG_PATH || join('./logs', 'app.log');

const app = Fastify({
    logger: {
        level: 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                destination: logPath,
                mkdir: true,
                singleLine: true,
                colorize: true,
                messageFormat: '{msg}',
                ignore: 'pid,hostname'
            },
        },
        serializers: {
            req: (req) => ({
                method: req.method,
                url: req.url,
                host: req.hostname,
                remoteAddress: req.ip,
                remotePort: req.socket.remotePort,
                headers: req.headers,
                body: req.body
            }),
            res: (res) => ({
                statusCode: res.statusCode,
                headers: res.headers
            }),
            err: (err) => ({
                type: err.constructor.name,
                message: err.message,
                stack: err.stack || '',
                code: err.code,
                statusCode: err.statusCode,
                validation: err.validation
            })
        },
        redact: ['request.headers.authorization', 'request.headers["x-api-key"]']
    },
    disableRequestLogging: true,
    genReqId: simpleId
})

// Decorate request with requestId
app.decorateRequest('requestId', '')

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
        registerLogHooks(app);
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