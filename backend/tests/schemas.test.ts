import { describe, it, expect } from 'vitest';
import { generateInputSchema } from '../src/schemas/generate.schema';

describe('Schema Validation', () => {
  it('should validate valid input', () => {
    const validData = {
      startupName: 'Acme',
      industry: 'Tech',
      valueProp: 'We build awesome tech solutions',
    };
    const result = generateInputSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid input', () => {
    const invalidData = {
      startupName: '', // empty
      industry: 'Tech',
      valueProp: 'short', // less than 10 chars
    };
    const result = generateInputSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
