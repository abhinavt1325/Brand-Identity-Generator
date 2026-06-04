import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { generateInputSchema } from '../schemas/generate.schema';
import { JobService } from '../services/job.service';
import { jobStore } from '../store/memory.store';
import { v4 as uuidv4 } from 'uuid';

const jobsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post('/jobs', async (request, reply) => {
    const input = generateInputSchema.parse(request.body);
    const jobId = uuidv4();
    
    // Create job in store
    const job = jobStore.createJob(jobId, input);
    
    // Start background processing (intentionally not awaited)
    JobService.startJob(jobId, input).catch(err => {
      fastify.log.error({ err, jobId }, 'Background job failed to start');
    });

    return reply.status(202).send({
      jobId: job.jobId,
      status: job.status,
    });
  });

  fastify.get('/jobs/:jobId', async (request, reply) => {
    const { jobId } = request.params as { jobId: string };
    const job = jobStore.getJob(jobId);
    
    if (!job) {
      return reply.status(404).send({ error: 'Not Found', message: 'Job not found' });
    }

    const { input, result, ...publicJobInfo } = job;
    return reply.status(200).send(publicJobInfo);
  });

  fastify.get('/jobs/:jobId/result', async (request, reply) => {
    const { jobId } = request.params as { jobId: string };
    const job = jobStore.getJob(jobId);
    
    if (!job) {
      return reply.status(404).send({ error: 'Not Found', message: 'Job not found' });
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
};

export default jobsRoutes;
