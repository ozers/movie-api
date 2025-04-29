import { FastifyInstance } from 'fastify';

export function registerLogHooks(app: FastifyInstance) {
  // Request logging
  app.addHook('onRequest', async (request) => {
    const { nanoid } = await import('nanoid');
    request.requestId = nanoid(8);
    request.log.info(
      {
        url: request.raw.url,
        reqId: request.requestId,
        method: request.method,
        remoteAddress: request.ip,
        remotePort: request.socket.remotePort,
        request: {
          protocol: request.protocol,
          body: request.body,
          query: request.query,
          params: request.params,
          headers: request.headers,
        }
      },
      `incoming request ${request.method} ${request.url}`
    );
  });

  // Response logging
  app.addHook('onResponse', (request, reply) => {
    request.log.info(
      {
        url: request.raw.url,
        reqId: request.requestId,
        method: request.method,
        remoteAddress: request.ip,
        remotePort: request.socket.remotePort,
        response: {
          headers: reply.getHeaders(),
          statusCode: reply.statusCode
        },
        responseTime: reply.elapsedTime
      },
      `request completed ${request.method} ${request.url} ${reply.statusCode} ${reply.elapsedTime}ms`
    );
  });

  // Error logging
  app.addHook('onError', (request, _reply, error) => {
    request.log.error(
      {
        url: request.raw.url,
        reqId: request.requestId,
        method: request.method,
        remoteAddress: request.ip,
        remotePort: request.socket.remotePort,
        error: {
          type: error.constructor.name,
          message: error.message,
          stack: error.stack,
          code: error.code,
          statusCode: error.statusCode,
          validation: error.validation
        }
      },
      `error: ${error.message}`
    );
  });

  // x-request-id header
  app.addHook('onSend', (request, reply, _payload, next) => {
    reply.header('x-request-id', request.requestId);
    next();
  });
}