import { z } from 'zod';

export const generateInputSchema = z.object({
  startupName: z.string().min(1, 'Startup name is required').max(100),
  industry: z.string().min(1, 'Industry is required').max(100),
  valueProp: z.string().min(10, 'Value proposition should be at least 10 characters').max(500),
});

export const competitorSchema = z.object({
  name: z.string(),
  analysis: z.string(),
});

export const researchSchema = z.object({
  competitors: z.array(competitorSchema),
  audience: z.string(),
  marketTrends: z.array(z.string()),
});

export const strategySchema = z.object({
  positioning: z.string(),
  tone: z.string(),
  mission: z.string(),
});

export const designSchema = z.object({
  colorPalette: z.array(z.object({
    hex: z.string(),
    name: z.string(),
  })),
  typography: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  logoDirection: z.string(),
});

export const copySchema = z.object({
  tagline: z.string(),
  elevatorPitch: z.string(),
  story: z.string(),
});

export const coherenceSchema = z.object({
  score: z.number().min(0).max(100),
  alignmentMetrics: z.array(z.object({
    label: z.string(),
    value: z.number(),
  })),
  validationSummary: z.string(),
});

export const generateResultSchema = z.object({
  research: researchSchema,
  strategy: strategySchema,
  design: designSchema,
  copy: copySchema,
  coherence: coherenceSchema,
});
