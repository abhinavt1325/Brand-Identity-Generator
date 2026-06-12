import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { generateInputSchema } from '../schemas/generate.schema';
import { JobService } from '../services/job.service';
import { jobStore } from '../store/postgres.store';
import { v4 as uuidv4 } from 'uuid';
import { authenticateRequest } from '../utils/auth.middleware';

const jobsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/jobs', { preHandler: authenticateRequest }, async (request, reply) => {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized', message: 'User not found' });
    }
    const jobs = await jobStore.getUserJobs(userId);
    return reply.status(200).send(jobs);
  });

  fastify.post('/jobs', { preHandler: authenticateRequest }, async (request, reply) => {
    const input = generateInputSchema.parse(request.body);
    const jobId = uuidv4();
    const userId = request.user?.userId;
    
    // Create job in store with user ID association
    const job = await jobStore.createJob(jobId, input, userId);
    
    // Start background processing (intentionally not awaited)
    JobService.startJob(jobId, input).catch(err => {
      fastify.log.error({ err, jobId }, 'Background job failed to start');
    });

    return reply.status(202).send({
      jobId: job.jobId,
      status: job.status,
    });
  });

  fastify.get('/jobs/:jobId', { preHandler: authenticateRequest }, async (request, reply) => {
    const { jobId } = request.params as { jobId: string };
    const job = await jobStore.getJob(jobId);
    
    if (!job) {
      return reply.status(404).send({ error: 'Not Found', message: 'Job not found' });
    }

    // Auth ownership check: if the job has a userId, check it matches the authenticated user
    if (job.userId && job.userId !== request.user?.userId) {
      return reply.status(403).send({ error: 'Forbidden', message: 'You do not have permission to access this job' });
    }

    const { result, ...publicJobInfo } = job;
    return reply.status(200).send(publicJobInfo);
  });

  fastify.get('/jobs/:jobId/result', { preHandler: authenticateRequest }, async (request, reply) => {
    const { jobId } = request.params as { jobId: string };
    const job = await jobStore.getJob(jobId);
    
    if (!job) {
      return reply.status(404).send({ error: 'Not Found', message: 'Job not found' });
    }

    // Auth ownership check: if the job has a userId, check it matches the authenticated user
    if (job.userId && job.userId !== request.user?.userId) {
      return reply.status(403).send({ error: 'Forbidden', message: 'You do not have permission to access this job' });
    }

    if (job.status !== 'completed') {
      return reply.status(409).send({ error: 'Conflict', message: 'Job is not completed yet', status: job.status });
    }

    return reply.status(200).send({
      jobId: job.jobId,
      input: job.input,
      result: job.result,
      createdAt: job.createdAt,
      completedAt: job.updatedAt,
    });
  });

  fastify.delete('/jobs/:jobId', { preHandler: authenticateRequest }, async (request, reply) => {
    const { jobId } = request.params as { jobId: string };
    const job = await jobStore.getJob(jobId);

    if (!job) {
      return reply.status(404).send({ error: 'Not Found', message: 'Job not found' });
    }

    // Ownership check
    if (job.userId && job.userId !== request.user?.userId) {
      return reply.status(403).send({ error: 'Forbidden', message: 'You do not have permission to delete this job' });
    }

    await jobStore.deleteJob(jobId);
    return reply.status(200).send({ success: true, jobId });
  });
};

export default jobsRoutes;
