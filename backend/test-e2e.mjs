import 'dotenv/config';
import { OpenAIService } from './src/services/openai.service.js';
import { researchSchema } from './src/schemas/generate.schema.js';

console.log('OPENAI_API_KEY set:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_BASE_URL:', process.env.OPENAI_BASE_URL);
console.log('USE_MOCK_FALLBACK:', process.env.USE_MOCK_FALLBACK);
console.log('OPENAI_MODEL:', process.env.OPENAI_MODEL);
console.log('');
console.log('Calling ResearchAgent via OpenAIService...');

try {
  const result = await OpenAIService.generateStructuredOutput(
    'You are an expert market researcher. Conduct preliminary research for a new startup. Return the output matching the requested JSON schema.',
    'Startup Name: AstroBrew\nIndustry: Specialty Coffee\nValue Proposition: Space-roasted coffee beans.\n\nProvide an analysis of competitors, target audience, and market trends.',
    researchSchema,
    'ResearchOutput',
    'Market research analysis'
  );
  console.log('SUCCESS! Result:');
  console.log(JSON.stringify(result, null, 2));
} catch (e) {
  console.error('FAILED:', e.message);
}
