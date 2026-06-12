import { z } from 'zod';
import { 
  generateInputSchema, 
  generateResultSchema,
  researchSchema,
  strategySchema,
  designSchema,
  copySchema,
  coherenceSchema
} from '../schemas/generate.schema';

export type GenerateInput = z.infer<typeof generateInputSchema>;
export type GenerateResult = z.infer<typeof generateResultSchema>;

export type ResearchResult = z.infer<typeof researchSchema>;
export type StrategyResult = z.infer<typeof strategySchema>;
export type DesignResult = z.infer<typeof designSchema>;
export type CopyResult = z.infer<typeof copySchema>;
export type CoherenceResult = z.infer<typeof coherenceSchema>;

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';
export type StageStatus = 'idle' | 'processing' | 'completed' | 'failed';

export interface Job {
  jobId: string;
  userId?: string | null;
  status: JobStatus;
  input: GenerateInput;
  result?: Partial<GenerateResult>;
  stages: {
    research: StageStatus;
    strategy: StageStatus;
    design: StageStatus;
    copy: StageStatus;
    coherence: StageStatus;
  };
  progress: number;
  error: { message: string } | null;
  createdAt: string;
  updatedAt: string;
}
