import OpenAI from 'openai';
import { logger } from '../utils/logger';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

export class OpenAIService {
  static async generateStructuredOutput<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodType<T>,
    schemaName: string,
    schemaDescription: string
  ): Promise<T> {
    const useMock = process.env.USE_MOCK_FALLBACK === 'true';

    if (useMock || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      logger.info(`[OpenAIService] Using MOCK fallback for ${schemaName}`);
      throw new Error('MOCK_FALLBACK_REQUESTED');
    }

    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: schemaName,
            description: schemaDescription,
            schema: zodToJsonSchema(schema) as any,
            strict: true
          }
        },
        timeout: parseInt(process.env.AI_TIMEOUT_MS || '60000', 10),
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('OpenAI returned empty content');

      const parsed = JSON.parse(content);
      return schema.parse(parsed) as T;
    } catch (error) {
      logger.error({ err: error }, `[OpenAIService] Failed generating output for ${schemaName}`);
      throw error;
    }
  }
}
