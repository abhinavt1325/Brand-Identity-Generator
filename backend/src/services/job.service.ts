import { GenerateInput, Job } from '../types';
import { jobStore } from '../store/memory.store';
import { researchAgent } from '../agents/researchAgent';
import { strategyAgent } from '../agents/strategyAgent';
import { designAgent } from '../agents/designAgent';
import { copyAgent } from '../agents/copyAgent';
import { coherenceAgent } from '../agents/coherenceAgent';
import { logger } from '../utils/logger';

export class JobService {
  static async startJob(jobId: string, input: GenerateInput): Promise<void> {
    jobStore.updateJobStatus(jobId, 'processing');
    
    try {
      // Research
      jobStore.updateJobStage(jobId, 'research', 'processing');
      const research = await researchAgent(input);
      jobStore.updateJobResult(jobId, { research });
      jobStore.updateJobStage(jobId, 'research', 'completed');

      // Strategy
      jobStore.updateJobStage(jobId, 'strategy', 'processing');
      const strategy = await strategyAgent(input, research);
      jobStore.updateJobResult(jobId, { strategy });
      jobStore.updateJobStage(jobId, 'strategy', 'completed');

      // Design & Copy in parallel
      jobStore.updateJobStage(jobId, 'design', 'processing');
      jobStore.updateJobStage(jobId, 'copy', 'processing');
      
      const [design, copy] = await Promise.all([
        designAgent(input, strategy).then(res => {
          jobStore.updateJobResult(jobId, { design: res });
          jobStore.updateJobStage(jobId, 'design', 'completed');
          return res;
        }).catch(err => {
          jobStore.updateJobStage(jobId, 'design', 'failed');
          throw err;
        }),
        copyAgent(input, strategy).then(res => {
          jobStore.updateJobResult(jobId, { copy: res });
          jobStore.updateJobStage(jobId, 'copy', 'completed');
          return res;
        }).catch(err => {
          jobStore.updateJobStage(jobId, 'copy', 'failed');
          throw err;
        })
      ]);

      // Coherence
      jobStore.updateJobStage(jobId, 'coherence', 'processing');
      const coherence = await coherenceAgent(research, strategy, design, copy);
      jobStore.updateJobResult(jobId, { coherence });
      jobStore.updateJobStage(jobId, 'coherence', 'completed');

      jobStore.updateJobStatus(jobId, 'completed');
      logger.info({ jobId }, 'Job completed successfully');

    } catch (error: any) {
      logger.error({ jobId, err: error }, 'Job failed');
      jobStore.updateJobStatus(jobId, 'failed', error.message);
    }
  }
}
