import { FastifyInstance, FastifyPluginAsync } from 'fastify';

const healthRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/health', async (request, reply) => {
    return reply.send({
      status: 'ok',
      service: 'brand-identity-backend',
      timestamp: new Date().toISOString(),
    });
  });
};

export default healthRoutes;
