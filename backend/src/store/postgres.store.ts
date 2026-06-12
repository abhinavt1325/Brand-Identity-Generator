import { db } from '../db';
import { jobsTable } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { Job, JobStatus, StageStatus } from '../types';

export class PostgresStore {
  
  private mapToJob(row: any): Job {
    return {
      ...row,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async createJob(jobId: string, input: Job['input'], userId?: string | null): Promise<Job> {
    const newJob = {
      jobId,
      userId: userId || null,
      status: 'queued' as JobStatus,
      input,
      stages: {
        research: 'idle' as StageStatus,
        strategy: 'idle' as StageStatus,
        design: 'idle' as StageStatus,
        copy: 'idle' as StageStatus,
        coherence: 'idle' as StageStatus,
      },
      progress: 0,
      error: null,
      result: null,
    };
    
    const [inserted] = await db.insert(jobsTable).values(newJob).returning();
    return this.mapToJob(inserted);
  }

  async getJob(jobId: string): Promise<Job | null> {
    const [row] = await db.select().from(jobsTable).where(eq(jobsTable.jobId, jobId));
    if (!row) return null;
    return this.mapToJob(row);
  }

  async updateJobStatus(jobId: string, status: JobStatus, error?: string): Promise<Job | null> {
    const errorObj = error ? { message: error } : null;
    const [updated] = await db.update(jobsTable)
      .set({ 
        status, 
        error: errorObj, 
        updatedAt: new Date() 
      })
      .where(eq(jobsTable.jobId, jobId))
      .returning();
      
    if (!updated) return null;
    return this.mapToJob(updated);
  }

  async updateJobStage(jobId: string, stage: keyof Job['stages'], status: StageStatus): Promise<Job | null> {
    const currentJob = await this.getJob(jobId);
    if (!currentJob) return null;

    const newStages = { ...currentJob.stages, [stage]: status };
    
    // Recalculate progress
    const totalStages = Object.keys(newStages).length;
    const completedStages = Object.values(newStages).filter((s) => s === 'completed').length;
    const progress = Math.round((completedStages / totalStages) * 100);

    const [updated] = await db.update(jobsTable)
      .set({
        stages: newStages,
        progress,
        updatedAt: new Date()
      })
      .where(eq(jobsTable.jobId, jobId))
      .returning();

    return this.mapToJob(updated);
  }

  async updateJobResult(jobId: string, partialResult: Partial<Job['result']>): Promise<Job | null> {
    const currentJob = await this.getJob(jobId);
    if (!currentJob) return null;

    const newResult = { ...(currentJob.result || {}), ...partialResult };

    const [updated] = await db.update(jobsTable)
      .set({
        result: newResult,
        updatedAt: new Date()
      })
      .where(eq(jobsTable.jobId, jobId))
      .returning();

    return this.mapToJob(updated);
  }

  async getUserJobs(userId: string): Promise<Job[]> {
    const rows = await db.select()
      .from(jobsTable)
      .where(eq(jobsTable.userId, userId))
      .orderBy(desc(jobsTable.createdAt));
    return rows.map(row => this.mapToJob(row));
  }

  async deleteJob(jobId: string): Promise<boolean> {
    const result = await db.delete(jobsTable).where(eq(jobsTable.jobId, jobId)).returning();
    return result.length > 0;
  }
}

export const jobStore = new PostgresStore();
