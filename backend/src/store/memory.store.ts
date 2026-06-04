import { Job, JobStatus, StageStatus } from '../types';

export class MemoryStore {
  private jobs: Map<string, Job> = new Map();

  createJob(jobId: string, input: Job['input']): Job {
    const job: Job = {
      jobId,
      status: 'queued',
      input,
      stages: {
        research: 'idle',
        strategy: 'idle',
        design: 'idle',
        copy: 'idle',
        coherence: 'idle',
      },
      progress: 0,
      error: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.jobs.set(jobId, job);
    return job;
  }

  getJob(jobId: string): Job | null {
    return this.jobs.get(jobId) || null;
  }

  updateJobStatus(jobId: string, status: JobStatus, error?: string): Job | null {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    job.status = status;
    if (error) job.error = { message: error };
    job.updatedAt = new Date().toISOString();
    this.jobs.set(jobId, job);
    return job;
  }

  updateJobStage(jobId: string, stage: keyof Job['stages'], status: StageStatus): Job | null {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    job.stages[stage] = status;
    job.updatedAt = new Date().toISOString();
    
    // Recalculate progress
    const totalStages = Object.keys(job.stages).length;
    const completedStages = Object.values(job.stages).filter((s) => s === 'completed').length;
    job.progress = Math.round((completedStages / totalStages) * 100);

    this.jobs.set(jobId, job);
    return job;
  }

  updateJobResult(jobId: string, partialResult: Partial<Job['result']>): Job | null {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    job.result = { ...job.result, ...partialResult };
    job.updatedAt = new Date().toISOString();
    this.jobs.set(jobId, job);
    return job;
  }
}

export const jobStore = new MemoryStore();
