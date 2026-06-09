# Brand Identity Generator Backend

A production-style MVP backend for the Brand Identity Generator.

## Tech Stack
- Node.js + TypeScript
- Fastify
- Zod (Validation)
- OpenAI (GPT-4o-mini)
- In-memory data store

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Copy `.env.example` to `.env` and configure it.
   ```bash
   cp .env.example .env
   ```
   *Note: Set `USE_MOCK_FALLBACK=true` if you don't have an OpenAI API key yet.*

3. **Run the server in development mode:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

5. **Run Tests:**
   ```bash
   npm run test
   ```

## Architecture
- **Agents (`src/agents/`)**: Isolated modules for each stage of generation (Research, Strategy, Design, Copy, Coherence).
- **Services (`src/services/`)**: Orchestration layer. `generation.service.ts` runs the sync process, `job.service.ts` handles the async pipeline.
- **Store (`src/store/`)**: `memory.store.ts` implements a clean datastore interface that can be easily swapped with Redis/Postgres later.
- **Routes (`src/routes/`)**: Fastify plugin routing for API endpoints.

## Endpoints

### 1. Health Check
\`\`\`bash
curl http://localhost:3000/health
\`\`\`

### 2. Synchronous Generation
\`\`\`bash
curl -X POST http://localhost:3000/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "startupName": "Nexus",
    "industry": "FinTech",
    "valueProp": "Democratizing financial tools for freelancers."
  }'
\`\`\`

### 3. Asynchronous Pipeline
**Create a Job:**
\`\`\`bash
curl -X POST http://localhost:3000/api/v1/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "startupName": "Nexus",
    "industry": "FinTech",
    "valueProp": "Democratizing financial tools for freelancers."
  }'
\`\`\`

**Poll Job Status:**
\`\`\`bash
curl http://localhost:3000/api/v1/jobs/<JOB_ID>
\`\`\`

**Fetch Final Result:**
\`\`\`bash
curl http://localhost:3000/api/v1/jobs/<JOB_ID>/result
\`\`\`
