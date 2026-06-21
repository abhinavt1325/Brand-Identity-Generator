import { GenerateInput, Job } from '../types';
import { jobStore } from '../store/postgres.store';
import { researchAgent } from '../agents/researchAgent';
import { strategyAgent } from '../agents/strategyAgent';
import { designAgent } from '../agents/designAgent';
import { copyAgent } from '../agents/copyAgent';
import { coherenceAgent } from '../agents/coherenceAgent';
import { logger } from '../utils/logger';

export class JobService {
  static async startJob(jobId: string, input: GenerateInput): Promise<void> {
    await jobStore.updateJobStatus(jobId, 'processing');
    
    try {
      // Research
      await jobStore.updateJobStage(jobId, 'research', 'processing');
      const research = await researchAgent(input);
      await jobStore.updateJobResult(jobId, { research });
      await jobStore.updateJobStage(jobId, 'research', 'completed');

      // Strategy
      await jobStore.updateJobStage(jobId, 'strategy', 'processing');
      const strategy = await strategyAgent(input, research);
      await jobStore.updateJobResult(jobId, { strategy });
      await jobStore.updateJobStage(jobId, 'strategy', 'completed');

      // Design
      await jobStore.updateJobStage(jobId, 'design', 'processing');
      const design = await designAgent(input, strategy).then(async res => {
        await jobStore.updateJobResult(jobId, { design: res });
        await jobStore.updateJobStage(jobId, 'design', 'completed');
        return res;
      }).catch(async err => {
        await jobStore.updateJobStage(jobId, 'design', 'failed');
        throw err;
      });

      // Copy
      await jobStore.updateJobStage(jobId, 'copy', 'processing');
      const copy = await copyAgent(input, strategy).then(async res => {
        await jobStore.updateJobResult(jobId, { copy: res });
        await jobStore.updateJobStage(jobId, 'copy', 'completed');
        return res;
      }).catch(async err => {
        await jobStore.updateJobStage(jobId, 'copy', 'failed');
        throw err;
      });

      // Coherence
      await jobStore.updateJobStage(jobId, 'coherence', 'processing');
      const coherence = await coherenceAgent(research, strategy, design, copy);
      await jobStore.updateJobResult(jobId, { coherence });
      await jobStore.updateJobStage(jobId, 'coherence', 'completed');

      await jobStore.updateJobStatus(jobId, 'completed');
      logger.info({ jobId }, 'Job completed successfully');

    } catch (error: any) {
      logger.error({ jobId, err: error }, 'Job failed');
      await jobStore.updateJobStatus(jobId, 'failed', error.message);
    }
  }
}
