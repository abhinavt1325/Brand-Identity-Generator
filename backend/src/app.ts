import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { logger } from './utils/logger';
import { errorHandler } from './utils/errors';
import healthRoutes from './routes/health.route';
import generateRoutes from './routes/generate.route';
import jobsRoutes from './routes/jobs.route';
import { v4 as uuidv4 } from 'uuid';

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    genReqId: () => uuidv4(),
  });

  // Register Plugins
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Error Handler
  app.setErrorHandler(errorHandler);

  // Register Routes
  app.register(healthRoutes);
  app.register(generateRoutes, { prefix: '/api/v1' });
  app.register(jobsRoutes, { prefix: '/api/v1' });

  return app;
};
