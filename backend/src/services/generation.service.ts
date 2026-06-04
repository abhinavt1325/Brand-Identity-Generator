import { GenerateInput, GenerateResult } from '../types';
import { researchAgent } from '../agents/researchAgent';
import { strategyAgent } from '../agents/strategyAgent';
import { designAgent } from '../agents/designAgent';
import { copyAgent } from '../agents/copyAgent';
import { coherenceAgent } from '../agents/coherenceAgent';
import { logger } from '../utils/logger';

export class GenerationService {
  static async generateBrandIdentity(input: GenerateInput): Promise<GenerateResult> {
    logger.info({ startupName: input.startupName }, 'Starting brand generation (Sync)');

    // Stage 1: Research
    const research = await researchAgent(input);

    // Stage 2: Strategy (depends on Research)
    const strategy = await strategyAgent(input, research);

    // Stage 3: Design & Copy (depend on Strategy, can run in parallel)
    const [design, copy] = await Promise.all([
      designAgent(input, strategy),
      copyAgent(input, strategy),
    ]);

    // Stage 4: Coherence (depends on all)
    const coherence = await coherenceAgent(research, strategy, design, copy);

    logger.info({ startupName: input.startupName }, 'Brand generation completed');

    return {
      research,
      strategy,
      design,
      copy,
      coherence,
    };
  }
}
