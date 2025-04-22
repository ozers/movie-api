import { FastifyInstance } from 'fastify';

export const serverConfig = {
    port: Number(process.env.PORT),
    host: process.env.HOST
};

export const startServer = async (fastify: FastifyInstance) => {
    try {
        await fastify.ready();
        await fastify.listen(serverConfig);

        const address = fastify.server.address();
        const port = typeof address === 'string' ? address : address?.port;
        console.log(`Server is running on http://${process.env.HOST}:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}; 