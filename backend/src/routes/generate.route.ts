import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { generateInputSchema } from '../schemas/generate.schema';
import { GenerationService } from '../services/generation.service';

const generateRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post('/generate', async (request, reply) => {
    const input = generateInputSchema.parse(request.body);
    
    const startTime = Date.now();
    const result = await GenerationService.generateBrandIdentity(input);
    const latencyMs = Date.now() - startTime;

    return reply.status(200).send({
      requestId: request.id,
      input,
      result,
      meta: {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        latencyMs,
        createdAt: new Date().toISOString(),
      },
    });
  });
};

export default generateRoutes;
