"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const generate_schema_1 = require("../src/schemas/generate.schema");
(0, vitest_1.describe)('Schema Validation', () => {
    (0, vitest_1.it)('should validate valid input', () => {
        const validData = {
            startupName: 'Acme',
            industry: 'Tech',
            valueProp: 'We build awesome tech solutions',
        };
        const result = generate_schema_1.generateInputSchema.safeParse(validData);
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)('should reject invalid input', () => {
        const invalidData = {
            startupName: '', // empty
            industry: 'Tech',
            valueProp: 'short', // less than 10 chars
        };
        const result = generate_schema_1.generateInputSchema.safeParse(invalidData);
        (0, vitest_1.expect)(result.success).toBe(false);
    });
});
