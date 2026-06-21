# Brand Identity Generator

## Team Name

Not Specified (Hackathon Submission)

## Project Overview

**BrandForge** is a complete, multi-agent AI application designed to function as an automated branding agency. By taking a startup's name, industry, and a short value proposition as input, BrandForge orchestrates a pipeline of **five specialized AI agents** (Research, Strategy, Design, Copywriting, and Coherence) to generate a unified, cohesive brand identity. 

The application utilizes parallel processing to run the Design and Copywriting agents concurrently, drastically reducing execution time. Once generated, the complete brand kit—including target audience analysis, brand strategy, color palette, typography pairs, copy guidelines, and a consistency evaluation—is presented in a modern dashboard interface and can be immediately exported as a professionally formatted 6-page A4 PDF document.

## Tech Stack

| Component | Technology / Platform |
| :--- | :--- |
| **Frontend Technologies** | Next.js 16 (App Router, React 19), Tailwind CSS v4, Framer Motion, Lucide Icons |
| **Backend Technologies** | Node.js, Fastify (TypeScript), Zod Validation |
| **Database** | Serverless Neon PostgreSQL, Drizzle ORM |
| **AI/LLM Services** | Google Gemini (`gemini-3.1-flash-lite`), OpenAI SDK Client Wrapper |
| **PDF Generation** | jsPDF, html2canvas (Client-side rendering) |
| **Deployment Platform** | Vercel (Frontend), Neon Console (Database) [Placeholder] |

## Folder Structure

```text
BrandForge/
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── coherenceAgent.ts
│   │   │   ├── copyAgent.ts
│   │   │   ├── designAgent.ts
│   │   │   ├── researchAgent.ts
│   │   │   └── strategyAgent.ts
│   │   ├── db/
│   │   │   ├── index.ts
│   │   │   └── schema.ts
│   │   ├── routes/
│   │   │   ├── auth.route.ts
│   │   │   ├── generate.route.ts
│   │   │   ├── health.route.ts
│   │   │   └── jobs.route.ts
│   │   ├── schemas/
│   │   │   └── generate.schema.ts
│   │   ├── services/
│   │   │   ├── generation.service.ts
│   │   │   ├── job.service.ts
│   │   │   └── openai.service.ts
│   │   ├── store/
│   │   │   ├── memory.store.ts
│   │   │   └── postgres.store.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── errors.ts
│   │   │   └── logger.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── drizzle.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── test-e2e.mjs
│   └── test-gemini.mjs
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── BrandKitPDF.tsx
│   │   │   ├── ExportButton.tsx
│   │   │   ├── InputPanel.tsx
│   │   │   ├── OutputPanel.tsx
│   │   │   ├── PipelinePanel.tsx
│   │   │   └── Typewriter.tsx
│   │   └── lib/
│   │       ├── auth.ts
│   │       ├── generatePDF.ts
│   │       ├── mockData.ts
│   │       └── types.ts
│   ├── next.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   └── eslint.config.mjs
├── .gitignore
├── README.md
└── requirements.txt
```

### Folder Purpose Descriptions
* **`backend/src/agents/`**: Contains the prompt configurations and mock fallbacks for each of the five branding agents.
* **`backend/src/db/`**: Defines the database schema tables (users, jobs) and instantiates the Drizzle-Postgres connection client.
* **`backend/src/routes/`**: Handles incoming API requests for user signup/login and starting/polling job instances.
* **`backend/src/services/`**: Orchestrates the multi-agent execution pipeline and provides normalizations/retries for raw LLM outputs.
* **`frontend/src/app/`**: Implements global styling and core app routes for landing, login, and workspace views.
* **`frontend/src/components/`**: Hosts React components that render form inputs, real-time pipeline status updates, and interactive result panels.
* **`frontend/src/lib/`**: Manages user authentication headers and runs the custom jsPDF formatting scripts.

---

## Important Code Files

Here are key system-level configuration and utility files for request schemas, database stores, and helper functions:

### generate.schema.ts

* **File Path**: [`backend/src/schemas/generate.schema.ts`](file:///d:/BrandForge/backend/src/schemas/generate.schema.ts)
* **Purpose**: Zod Validation Schemas
* **Main Functionality**: Specifies structured validation objects for request validation payloads and LLM outputs parsing checks.
* **Key Components**: `generateInputSchema`, `generateResultSchema`, `researchSchema`, `designSchema`, `copySchema`, `coherenceSchema`.

```typescript
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

```

---

### errors.ts

* **File Path**: [`backend/src/utils/errors.ts`](file:///d:/BrandForge/backend/src/utils/errors.ts)
* **Purpose**: Expressive Global Error Handler
* **Main Functionality**: Interceptors for parsing Zod schema failures and converting internal application faults to readable JSON error replies.
* **Key Components**: `errorHandler()`, `AppError`

```typescript
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { logger } from './logger';

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  logger.error({ err: error, reqId: request.id }, 'Request error');

  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation failed',
      issues: error.issues,
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
    });
  }

  // Fastify internal errors (e.g., body parsing)
  if (error.statusCode && error.statusCode < 500) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.code,
      message: error.message,
    });
  }

  // Fallback for unhandled errors
  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Something went wrong',
  });
};

```

---

### postgres.store.ts

* **File Path**: [`backend/src/store/postgres.store.ts`](file:///d:/BrandForge/backend/src/store/postgres.store.ts)
* **Purpose**: Postgres Persistent Job Store
* **Main Functionality**: Writes active jobs, step-progress milestones, and completed brand kits to the database using Drizzle queries.
* **Key Components**: `PostgresStore` class.

```typescript
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

```

---


---

## Frontend Code

This section lists, explains, and provides the complete source code for all components, styling configs, and libraries used to construct the Next.js frontend workspace:

### types.ts

* **File Path**: [`frontend/src/lib/types.ts`](file:///d:/BrandForge/frontend/src/lib/types.ts)
* **Purpose**: Frontend Data Type Definitions
* **Main Functionality**: Standardizes layout declarations (AppState, AgentsState, BrandData) shared between UI state hooks.
* **Key Components**: `AppState`, `BrandData`, `AgentStatus` interfaces.

```typescript
export type AppState = "idle" | "generating" | "done";

export type AgentStatus = "idle" | "processing" | "completed";

export type AgentsState = {
  research: AgentStatus;
  strategy: AgentStatus;
  design: AgentStatus;
  copy: AgentStatus;
  coherence: AgentStatus;
};

export type BrandData = {
  startupName: string;
  industry: string;
  valueProp: string;
};

```

---

### auth.ts

* **File Path**: [`frontend/src/lib/auth.ts`](file:///d:/BrandForge/frontend/src/lib/auth.ts)
* **Purpose**: Client Authentication Library
* **Main Functionality**: Saves tokens and profile profiles in localStorage and structures Authorization headers for API queries.
* **Key Components**: `getToken()`, `getUser()`, `isAuthenticated()`, `getAuthHeaders()`.

```typescript
export const TOKEN_KEY = 'brandforge_token';
export const USER_KEY = 'brandforge_user';

export interface User {
  id: string;
  username: string;
  email: string;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as User;
  } catch (e) {
    return null;
  }
}

export function setUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

```

---

### generatePDF.ts

* **File Path**: [`frontend/src/lib/generatePDF.ts`](file:///d:/BrandForge/frontend/src/lib/generatePDF.ts)
* **Purpose**: PDF Layout Generation Utility
* **Main Functionality**: Constructs a 6-page A4 document directly on the client side using the jsPDF API canvas controls.
* **Key Components**: `generateBrandKitPDF()`, `coverPage()`, `researchPage()`, `strategyPage()`, `designPage()`, `copyPage()`, `coherencePage()`.

```typescript
import jsPDF from "jspdf";
import { BrandData } from "./types";
import { MockData } from "./mockData";

// ── helpers ───────────────────────────────────────────────────────────────────
const W = 595.28;
const M = 48;
const CW = W - M * 2;

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function tc(pdf: jsPDF, hex: string) { pdf.setTextColor(...rgb(hex)); }
function fc(pdf: jsPDF, hex: string) { pdf.setFillColor(...rgb(hex)); }
function dc(pdf: jsPDF, hex: string) { pdf.setDrawColor(...rgb(hex)); }

function label(pdf: jsPDF, text: string, x: number, y: number) {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  tc(pdf, "#94a3b8");
  pdf.text(text.toUpperCase(), x, y);
}

function bodyText(pdf: jsPDF, text: string, x: number, y: number, maxWidth = CW, color = "#475569"): number {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  tc(pdf, color);
  const lines = pdf.splitTextToSize(text, maxWidth);
  pdf.text(lines, x, y);
  return lines.length * 14;
}

function card(pdf: jsPDF, x: number, y: number, w: number, h: number, bg = "#f8fafc", border = "#e2e8f0") {
  fc(pdf, bg); dc(pdf, border); pdf.setLineWidth(0.5);
  pdf.roundedRect(x, y, w, h, 4, 4, "FD");
}

function accentBar(pdf: jsPDF) {
  fc(pdf, "#2563eb"); pdf.rect(0, 0, W / 2, 4, "F");
  fc(pdf, "#6366f1"); pdf.rect(W / 2, 0, W / 2, 4, "F");
}

function pageHeader(pdf: jsPDF, agent: string, title: string) {
  accentBar(pdf);
  label(pdf, agent, M, 24);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  tc(pdf, "#0f172a");
  pdf.text(title, M, 48);
}

function footer(pdf: jsPDF) {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  tc(pdf, "#94a3b8");
  dc(pdf, "#e2e8f0"); pdf.setLineWidth(0.5);
  pdf.line(M, 820, W - M, 820);
  pdf.text("Generated by BrandForge AI", M, 832);
  pdf.text("Confidential — Brand Kit", W - M, 832, { align: "right" });
}

// ── PAGE 1: COVER ─────────────────────────────────────────────────────────────
function coverPage(pdf: jsPDF, data: BrandData, mock: MockData) {
  fc(pdf, "#0f172a"); pdf.rect(0, 0, W, 841.89, "F");
  fc(pdf, "#1e3a8a"); pdf.ellipse(W - 80, 80, 180, 180, "F");
  fc(pdf, "#312e81"); pdf.ellipse(60, 780, 130, 130, "F");

  // Logo
  fc(pdf, "#2563eb"); pdf.roundedRect(M, 52, 24, 24, 3, 3, "F");
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(13);
  tc(pdf, "#ffffff"); pdf.text("B", M + 8, 68);
  pdf.setFontSize(11); tc(pdf, "#94a3b8");
  pdf.text("BRANDFORGE", M + 30, 68);

  // Badge
  pdf.setFontSize(9); pdf.setFont("helvetica", "bold"); tc(pdf, "#3b82f6");
  pdf.text("AI BRAND IDENTITY REPORT", M, 130);

  // Startup name
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(42); tc(pdf, "#ffffff");
  const nameLines = pdf.splitTextToSize(data.startupName, CW);
  pdf.text(nameLines, M, 165);

  // Tagline
  const nameH = nameLines.length * 48;
  pdf.setFont("helvetica", "bolditalic"); pdf.setFontSize(16); tc(pdf, "#93c5fd");
  pdf.text(`"${mock.copy.tagline}"`, M, 165 + nameH + 10);

  // Elevator pitch
  const pitchY = 165 + nameH + 30;
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(10); tc(pdf, "#64748b");
  const pitchLines = pdf.splitTextToSize(mock.copy.elevatorPitch, CW - 40);
  pdf.text(pitchLines, M, pitchY);

  // Bottom row
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); tc(pdf, "#475569");
  pdf.text("Industry", M, 780);
  pdf.setFont("helvetica", "bold"); tc(pdf, "#94a3b8");
  pdf.text(data.industry, M, 793);

  pdf.setFont("helvetica", "normal"); tc(pdf, "#475569");
  pdf.text("Coherence Score", W - M, 780, { align: "right" });
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(28); tc(pdf, "#3b82f6");
  pdf.text(`${mock.coherence.score}%`, W - M, 810, { align: "right" });
}

// ── PAGE 2: RESEARCH ──────────────────────────────────────────────────────────
function researchPage(pdf: jsPDF, mock: MockData) {
  pageHeader(pdf, "Research Agent · Market Intelligence", "Market Research & Audience Analysis");
  let y = 68;

  // Audience
  label(pdf, "Target Audience", M, y); y += 10;
  card(pdf, M, y, CW, 52, "#eff6ff", "#bfdbfe");
  dc(pdf, "#2563eb"); pdf.setLineWidth(2); pdf.line(M, y, M, y + 52);
  bodyText(pdf, mock.research.audience, M + 12, y + 14, CW - 20, "#1e40af");
  y += 62;

  // Pain points
  label(pdf, "Audience Pain Points", M, y); y += 10;
  const ppH = Math.min(mock.research.audiencePainPoints.length * 18 + 20, 90);
  card(pdf, M, y, CW, ppH);
  let py = y + 14;
  mock.research.audiencePainPoints.forEach((p) => {
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); tc(pdf, "#2563eb");
    pdf.text("›", M + 8, py);
    bodyText(pdf, p, M + 18, py, CW - 30);
    py += 16;
  });
  y += ppH + 10;

  // Competitors
  label(pdf, "Competitor Analysis", M, y); y += 10;
  mock.research.competitors.forEach((c) => {
    const ch = 72;
    card(pdf, M, y, CW, ch);
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(11); tc(pdf, "#0f172a");
    pdf.text(c.name, M + 12, y + 16);
    const half = (CW - 24) / 2;
    label(pdf, "Strengths", M + 12, y + 30);
    pdf.setFillColor(220, 252, 231); pdf.roundedRect(M + 10, y + 32, 8, 8, 2, 2, "F");
    bodyText(pdf, c.strengths, M + 12, y + 44, half - 4, "#16a34a");
    label(pdf, "Weaknesses", M + 14 + half, y + 30);
    bodyText(pdf, c.weaknesses, M + 14 + half, y + 44, half - 4, "#dc2626");
    y += ch + 8;
  });

  // Trends
  label(pdf, "Industry Trends", M, y); y += 12;
  let tx = M;
  mock.research.marketTrends.forEach((t) => {
    const tw = pdf.getStringUnitWidth(t) * 10 + 16;
    fc(pdf, "#eff6ff"); dc(pdf, "#bfdbfe"); pdf.roundedRect(tx, y, tw, 16, 8, 8, "FD");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); tc(pdf, "#1d4ed8");
    pdf.text(t, tx + 8, y + 11);
    tx += tw + 6;
  });
  y += 26;

  label(pdf, "Market Positioning Insight", M, y); y += 10;
  card(pdf, M, y, CW, 44, "#eff6ff", "#bfdbfe");
  bodyText(pdf, mock.research.marketPositioning, M + 12, y + 16, CW - 24, "#1e40af");

  footer(pdf);
}

// ── PAGE 3: STRATEGY ──────────────────────────────────────────────────────────
function strategyPage(pdf: jsPDF, mock: MockData) {
  pageHeader(pdf, "Strategy Agent · Brand Foundation", "Mission, Vision & Brand Strategy");
  let y = 68;

  // Mission + Vision side by side
  const hw = (CW - 8) / 2;
  [
    { label: "Mission", text: mock.strategy.mission, bg: "#f5f3ff", border: "#e9d5ff", tc: "#7c3aed", body: "#1e1b4b" },
    { label: "Vision", text: mock.strategy.vision, bg: "#eef2ff", border: "#c7d2fe", tc: "#4338ca", body: "#1e1b4b" },
  ].forEach(({ label: lbl, text, bg, border, tc: tcolor, body }, i) => {
    const cx = M + i * (hw + 8);
    const lines = pdf.splitTextToSize(text, hw - 20);
    const h = lines.length * 14 + 36;
    card(pdf, cx, y, hw, h, bg, border);
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); tc(pdf, tcolor);
    pdf.text(lbl.toUpperCase(), cx + 10, y + 16);
    bodyText(pdf, text, cx + 10, y + 28, hw - 20, body);
  });

  const mlines = pdf.splitTextToSize(mock.strategy.mission, hw - 20);
  const vlines = pdf.splitTextToSize(mock.strategy.vision, hw - 20);
  y += Math.max(mlines.length, vlines.length) * 14 + 46;

  // Positioning
  card(pdf, M, y, CW, 58, "#f8fafc", "#6366f1");
  dc(pdf, "#6366f1"); pdf.setLineWidth(3); pdf.line(M, y, M, y + 58);
  label(pdf, "Positioning Statement", M + 10, y + 14);
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(11); tc(pdf, "#1e293b");
  const posLines = pdf.splitTextToSize(mock.strategy.positioningStatement, CW - 20);
  pdf.text(posLines, M + 10, y + 28);
  y += 68;

  // Personality pills
  label(pdf, "Brand Personality", M, y); y += 12;
  let px = M;
  mock.strategy.brandPersonality.forEach((p) => {
    const pw = pdf.getStringUnitWidth(p) * 10 + 16;
    fc(pdf, "#eff6ff"); dc(pdf, "#bfdbfe"); pdf.roundedRect(px, y, pw, 16, 8, 8, "FD");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); tc(pdf, "#1d4ed8");
    pdf.text(p, px + 8, y + 11);
    px += pw + 6;
  });
  y += 26;

  // Voice
  label(pdf, "Brand Voice", M, y); y += 10;
  const vlines2 = pdf.splitTextToSize(mock.strategy.brandVoice, CW - 20);
  card(pdf, M, y, CW, vlines2.length * 14 + 24);
  bodyText(pdf, mock.strategy.brandVoice, M + 10, y + 16, CW - 20);
  y += vlines2.length * 14 + 34;

  // Messaging strategy
  label(pdf, "Messaging Strategy", M, y); y += 10;
  const mslines = pdf.splitTextToSize(mock.strategy.messagingStrategy, CW - 20);
  card(pdf, M, y, CW, mslines.length * 14 + 24);
  bodyText(pdf, mock.strategy.messagingStrategy, M + 10, y + 16, CW - 20);

  footer(pdf);
}

// ── PAGE 4: DESIGN ────────────────────────────────────────────────────────────
function designPage(pdf: jsPDF, mock: MockData) {
  pageHeader(pdf, "Design Agent · Visual Identity", "Color Palette, Typography & Visual System");
  let y = 68;

  // Primary palette
  label(pdf, "Primary Color Palette", M, y); y += 12;
  mock.design.primaryPalette.forEach((c, i) => {
    const x = M + i * 90;
    fc(pdf, c.hex); dc(pdf, "#e2e8f0"); pdf.roundedRect(x, y, 70, 70, 6, 6, "FD");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); tc(pdf, "#0f172a");
    pdf.text(c.name, x, y + 82);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); tc(pdf, "#94a3b8");
    pdf.text(c.hex, x, y + 93);
  });
  y += 108;

  // Secondary palette
  label(pdf, "Secondary Color Palette", M, y); y += 12;
  mock.design.secondaryPalette.forEach((c, i) => {
    const x = M + i * 90;
    card(pdf, x, y, 80, 36);
    fc(pdf, c.hex); pdf.roundedRect(x + 8, y + 10, 18, 18, 3, 3, "F");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); tc(pdf, "#0f172a");
    pdf.text(c.name, x + 30, y + 18);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(7); tc(pdf, "#94a3b8");
    pdf.text(c.hex, x + 30, y + 28);
  });
  y += 52;

  // Typography
  label(pdf, "Typography System", M, y); y += 12;
  card(pdf, M, y, CW, 56);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); tc(pdf, "#94a3b8");
  pdf.text(`Display — ${mock.design.typography.heading}`, M + 10, y + 14);
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(20); tc(pdf, "#0f172a");
  pdf.text(mock.design.typography.headingExample, M + 10, y + 36, { maxWidth: CW - 20 });
  y += 64;

  card(pdf, M, y, CW, 44);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); tc(pdf, "#94a3b8");
  pdf.text(`Body — ${mock.design.typography.body}`, M + 10, y + 14);
  pdf.setFontSize(10); tc(pdf, "#475569");
  pdf.text(mock.design.typography.bodyExample, M + 10, y + 30, { maxWidth: CW - 20 });
  y += 54;

  // Logo direction
  label(pdf, "Logo Direction", M, y); y += 10;
  const logoLines = pdf.splitTextToSize(mock.design.logoDirection, CW - 90);
  card(pdf, M, y, CW, Math.max(logoLines.length * 14 + 24, 60));
  fc(pdf, "#1e293b"); pdf.roundedRect(M + 10, y + 10, 50, 40, 4, 4, "F");
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(14); tc(pdf, "#ffffff");
  pdf.text("BF", M + 22, y + 35);
  bodyText(pdf, mock.design.logoDirection, M + 72, y + 18, CW - 90);
  y += Math.max(logoLines.length * 14 + 34, 70);

  // Visual language
  label(pdf, "Visual Language", M, y); y += 12;
  let vx = M;
  mock.design.visualLanguage.forEach((v) => {
    const vw = pdf.getStringUnitWidth(v) * 9 + 16;
    fc(pdf, "#ecfdf5"); dc(pdf, "#a7f3d0"); pdf.roundedRect(vx, y, vw, 16, 8, 8, "FD");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); tc(pdf, "#065f46");
    pdf.text(v, vx + 8, y + 11);
    vx += vw + 6;
  });

  footer(pdf);
}

// ── PAGE 5: COPY ──────────────────────────────────────────────────────────────
function copyPage(pdf: jsPDF, mock: MockData) {
  pageHeader(pdf, "Copy Agent · Brand Voice", "Brand Story, Messaging & Copy");
  let y = 68;

  // Tagline banner
  fc(pdf, "#0f172a"); pdf.roundedRect(M, y, CW, 58, 6, 6, "F");
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); tc(pdf, "#3b82f6");
  pdf.text("THE TAGLINE", M + 12, y + 16);
  pdf.setFont("helvetica", "bolditalic"); pdf.setFontSize(20); tc(pdf, "#ffffff");
  pdf.text(`"${mock.copy.tagline}"`, M + 12, y + 40, { maxWidth: CW - 24 });
  y += 68;

  // Hero copy
  label(pdf, "Homepage Hero", M, y); y += 10;
  card(pdf, M, y, CW, 56);
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(14); tc(pdf, "#0f172a");
  pdf.text(mock.copy.heroHeadline, M + 12, y + 20, { maxWidth: CW - 24 });
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(10); tc(pdf, "#475569");
  const heroSubLines = pdf.splitTextToSize(mock.copy.heroSubheadline, CW - 24);
  pdf.text(heroSubLines, M + 12, y + 36);
  y += 66;

  // Elevator pitch
  label(pdf, "Elevator Pitch", M, y); y += 10;
  const epLines = pdf.splitTextToSize(mock.copy.elevatorPitch, CW - 20);
  card(pdf, M, y, CW, epLines.length * 14 + 24);
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); tc(pdf, "#0f172a");
  pdf.text(epLines, M + 10, y + 18);
  y += epLines.length * 14 + 34;

  // Brand story
  label(pdf, "Brand Story", M, y); y += 10;
  const storyLines = pdf.splitTextToSize(mock.copy.brandStory, CW - 20);
  const storyH = storyLines.length * 13 + 24;
  card(pdf, M, y, CW, storyH);
  bodyText(pdf, mock.copy.brandStory, M + 10, y + 16, CW - 20);
  y += storyH + 10;

  // Marketing messages
  label(pdf, "Key Marketing Messages", M, y); y += 10;
  mock.copy.marketingMessages.forEach((msg) => {
    const msgLines = pdf.splitTextToSize(msg, CW - 30);
    const mh = msgLines.length * 13 + 20;
    card(pdf, M, y, CW, mh, "#fffbeb", "#fde68a");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(11); tc(pdf, "#d97706");
    pdf.text("★", M + 10, y + 15);
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); tc(pdf, "#92400e");
    pdf.text(msgLines, M + 24, y + 15);
    y += mh + 6;
  });

  footer(pdf);
}

// ── PAGE 6: COHERENCE ─────────────────────────────────────────────────────────
function coherencePage(pdf: jsPDF, mock: MockData) {
  pageHeader(pdf, "Coherence Agent · AI Validation", "Brand Coherence Analysis");
  let y = 68;

  // Score + metrics row
  card(pdf, M, y, 110, 90, "#eff6ff", "#bfdbfe");
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(42); tc(pdf, "#1d4ed8");
  pdf.text(`${mock.coherence.score}`, M + 12, y + 56);
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); tc(pdf, "#60a5fa");
  pdf.text("GLOBAL SCORE", M + 10, y + 70);

  const metrics = [
    { label: "Tone Consistency", value: mock.coherence.toneConsistency },
    { label: "Audience Alignment", value: mock.coherence.audienceAlignment },
    { label: "Visual Consistency", value: mock.coherence.visualConsistency },
    { label: "Messaging Alignment", value: mock.coherence.messagingAlignment },
    { label: "Strategic Consistency", value: mock.coherence.strategicConsistency },
  ];
  const barX = M + 120;
  const barW = CW - 120;
  metrics.forEach((m, i) => {
    const my = y + 6 + i * 17;
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); tc(pdf, "#475569");
    pdf.text(m.label, barX, my + 5);
    pdf.setFont("helvetica", "bold"); tc(pdf, "#0f172a");
    pdf.text(`${m.value}%`, barX + barW, my + 5, { align: "right" });
    fc(pdf, "#e2e8f0"); dc(pdf, "#e2e8f0"); pdf.roundedRect(barX, my + 8, barW, 5, 2, 2, "FD");
    fc(pdf, "#2563eb"); dc(pdf, "#2563eb");
    pdf.roundedRect(barX, my + 8, barW * m.value / 100, 5, 2, 2, "FD");
  });
  y += 100;

  // Validation summary
  label(pdf, "AI Validation Summary", M, y); y += 10;
  const sumLines = pdf.splitTextToSize(mock.coherence.validationSummary, CW - 20);
  card(pdf, M, y, CW, sumLines.length * 14 + 24, "#eff6ff", "#bfdbfe");
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); tc(pdf, "#1e40af");
  pdf.text(sumLines, M + 10, y + 16);
  y += sumLines.length * 14 + 34;

  // Recommendations
  label(pdf, "Strategic Recommendations", M, y); y += 10;
  mock.coherence.recommendations.forEach((rec) => {
    const rlines = pdf.splitTextToSize(rec, CW - 30);
    const rh = rlines.length * 13 + 20;
    card(pdf, M, y, CW, rh);
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(12); tc(pdf, "#d97706");
    pdf.text("→", M + 10, y + 16);
    bodyText(pdf, rec, M + 24, y + 16, CW - 34);
    y += rh + 6;
  });

  footer(pdf);
}

// ── MAIN EXPORT FUNCTION ──────────────────────────────────────────────────────
export async function generateBrandKitPDF(data: BrandData, mock: MockData): Promise<void> {
  const jsPDFLib = (await import("jspdf")).default;
  const pdf = new jsPDFLib({ orientation: "portrait", unit: "pt", format: "a4" });

  // Page 1
  coverPage(pdf, data, mock);
  pdf.addPage();

  // Page 2
  researchPage(pdf, mock);
  pdf.addPage();

  // Page 3
  strategyPage(pdf, mock);
  pdf.addPage();

  // Page 4
  designPage(pdf, mock);
  pdf.addPage();

  // Page 5
  copyPage(pdf, mock);
  pdf.addPage();

  // Page 6
  coherencePage(pdf, mock);

  pdf.save(`${data.startupName.replace(/\s+/g, "_")}_BrandKit.pdf`);
}

```

---

### Typewriter.tsx

* **File Path**: [`frontend/src/components/Typewriter.tsx`](file:///d:/BrandForge/frontend/src/components/Typewriter.tsx)
* **Purpose**: Animated Text Effect Component
* **Main Functionality**: Loops through characters with dynamic delays to simulate typewriter prompt renderings.
* **Key Components**: `Typewriter` react component.

```typescript
"use client";
import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  delay?: number; // seconds before starting (kept for API compat)
  className?: string;
}

export default function Typewriter({ text, delay = 0, className = "" }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(0);

  // Start typing when element is in view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Type out characters once started
  useEffect(() => {
    if (!started) return;
    indexRef.current = 0;
    setDisplayed("");

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        indexRef.current += 1;
        setDisplayed(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length) clearInterval(interval);
      }, 18);
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(startTimeout);
  }, [started, text, delay]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {displayed.length < text.length && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "2px",
            height: "1em",
            background: "currentColor",
            marginLeft: "1px",
            verticalAlign: "text-bottom",
            animation: "blink 0.8s step-end infinite",
          }}
        />
      )}
    </span>
  );
}

```

---

### ExportButton.tsx

* **File Path**: [`frontend/src/components/ExportButton.tsx`](file:///d:/BrandForge/frontend/src/components/ExportButton.tsx)
* **Purpose**: PDF Download Action Button
* **Main Functionality**: Fires the client-side PDF document construction functions with loading indicators.
* **Key Components**: `ExportButton` UI handler.

```typescript
"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { MockData } from "@/lib/mockData";
import { BrandData } from "@/lib/types";
import { generateBrandKitPDF } from "@/lib/generatePDF";

interface ExportButtonProps {
  data: BrandData;
  mock: MockData;
}

export default function ExportButton({ data, mock }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await generateBrandKitPDF(data, mock);
    } catch (e) {
      console.error("PDF export failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF…</>
      ) : (
        <><Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Export Brand Kit PDF</>
      )}
    </button>
  );
}

```

---

### InputPanel.tsx

* **File Path**: [`frontend/src/components/InputPanel.tsx`](file:///d:/BrandForge/frontend/src/components/InputPanel.tsx)
* **Purpose**: Workspace Input Form Controller
* **Main Functionality**: Handles text area inputs, checks requirements, lists historical generation records, and requests deletions.
* **Key Components**: `InputPanel` panel views.

```typescript
import { useState } from "react";
import { Sparkles, Activity, Trash2, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { BrandData } from "@/lib/types";

interface InputPanelProps {
  onGenerate: (data: BrandData) => void;
  isGenerating: boolean;
  sessions?: any[];
  onSelectSession?: (jobId: string) => void;
  onDeleteSession?: (jobId: string) => void;
}

function StatusIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />;
  if (status === "failed") return <XCircle className="w-3 h-3 text-red-400 shrink-0" />;
  return <Loader2 className="w-3 h-3 text-blue-400 animate-spin shrink-0" />;
}

export default function InputPanel({ onGenerate, isGenerating, sessions = [], onSelectSession, onDeleteSession }: InputPanelProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BrandData>({
    startupName: "",
    industry: "",
    valueProp: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startupName || !formData.industry) return;
    onGenerate(formData);
  };

  const handleDelete = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation(); // prevent row click from firing
    if (!confirm("Delete this session? This cannot be undone.")) return;
    setDeletingId(jobId);
    try {
      await onDeleteSession?.(jobId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col p-8 text-slate-100">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
            <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">BrandForge</h1>
            <p className="text-xs text-blue-200/60 font-medium tracking-wide uppercase">Identity Engine</p>
          </div>
        </div>
      </div>


      {sessions.length > 0 && (
        <div className="mb-8 pb-6 border-b border-slate-800/80">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 block">
            Past Sessions
          </label>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-0.5 custom-scrollbar">
            {sessions.map((session: any) => (
              <div
                key={session.jobId}
                onClick={() => onSelectSession?.(session.jobId)}
                className="group flex items-center gap-2 w-full bg-slate-800/40 hover:bg-slate-700/50 border border-slate-700/40 hover:border-slate-600/60 rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-150"
              >
                {/* Status icon */}
                <StatusIcon status={session.status} />

                {/* Session info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate leading-tight">
                    {session.input?.startupName || "Untitled"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-2.5 h-2.5 text-slate-500" />
                    <p className="text-[10px] text-slate-500 truncate">
                      {session.input?.industry || "—"} · {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, session.jobId)}
                  disabled={deletingId === session.jobId}
                  title="Delete session"
                  className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {deletingId === session.jobId ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-2 text-white">New Identity</h2>
        <p className="text-slate-400 text-sm mb-8 text-balance">
          Define your startup&apos;s core parameters to initialize the multi-agent generation pipeline.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Startup Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Nexus, Acme Corp"
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500 text-white shadow-inner"
              value={formData.startupName}
              onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
              disabled={isGenerating}
              suppressHydrationWarning
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Industry / Niche</label>
            <input
              type="text"
              required
              placeholder="e.g., AI Healthcare, FinTech"
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500 text-white shadow-inner"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              disabled={isGenerating}
              suppressHydrationWarning
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Core Value Proposition</label>
            <textarea
              required
              rows={4}
              placeholder="What makes your product fundamentally different? Who is it for?"
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500 text-white resize-none shadow-inner"
              value={formData.valueProp}
              onChange={(e) => setFormData({ ...formData, valueProp: e.target.value })}
              disabled={isGenerating}
              suppressHydrationWarning
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating || !formData.startupName || !formData.industry}
            className="w-full relative group overflow-hidden rounded-lg bg-blue-600 text-white font-medium py-3 px-4 transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-[1px]"
            suppressHydrationWarning
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
                  <Activity className="w-4 h-4 animate-pulse" />
                  Generating Pipeline...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Initialize AI Agents
                </>
              )}
            </span>
            {!isGenerating && (
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            )}
          </button>
        </form>
      </div>
      
      <div className="pt-6 mt-6 border-t border-slate-800/50 text-xs text-slate-500 flex justify-between font-medium">
        <span>v2.5.0 Build 902</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Secure Engine
        </span>
      </div>
    </div>
  );
}

```

---

### PipelinePanel.tsx

* **File Path**: [`frontend/src/components/PipelinePanel.tsx`](file:///d:/BrandForge/frontend/src/components/PipelinePanel.tsx)
* **Purpose**: Real-time Step Progress Visualizer
* **Main Functionality**: Shows connecting progress bars and step states (waiting, processing, done) for each of the 5 agents.
* **Key Components**: `PipelinePanel`, `AgentCard`, `StatusIndicator` components.

```typescript
"use client";
import { useState, useEffect } from "react";
import { AgentsState, AppState, AgentStatus } from "@/lib/types";
import {
  Search, BrainCircuit, PenTool, Type, Network,
  CheckCircle2, CircleDashed, Loader2,
} from "lucide-react";

interface PipelinePanelProps {
  agents: AgentsState;
  appState: AppState;
}

const AGENT_CONFIG = [
  { id: "research",  label: "Research Agent",  description: "Market & Competitor Analysis",  icon: Search },
  { id: "strategy",  label: "Strategy Agent",  description: "Brand Positioning & Tone",      icon: BrainCircuit },
  { id: "design",    label: "Design Agent",    description: "Color & Typography Systems",    icon: PenTool },
  { id: "copy",      label: "Copy Agent",      description: "Taglines & Brand Story",        icon: Type },
  { id: "coherence", label: "Coherence Agent", description: "Final Brand Verification",      icon: Network },
] as const;

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

export default function PipelinePanel({ agents, appState }: PipelinePanelProps) {
  const mounted = useMounted();

  return (
    <div className="flex flex-col h-full p-8 bg-white">
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-2 text-slate-800">Agent Pipeline</h2>
        <p className="text-slate-500 text-sm font-medium">Real-time status of generative micro-agents.</p>
      </div>

      <div className="flex-1 space-y-6 relative">
        {AGENT_CONFIG.map((agent, index) => {
          const status = agents[agent.id];
          return (
            <AgentCard
              key={agent.id}
              agent={agent}
              status={status}
              isLast={index === AGENT_CONFIG.length - 1}
              mounted={mounted}
            />
          );
        })}
      </div>

      {appState === "done" && (
        <div
          className="mt-8 p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center gap-3 text-blue-700 shadow-sm"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
          }}
        >
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold">Pipeline execution completed successfully.</span>
        </div>
      )}
    </div>
  );
}

function AgentCard({
  agent,
  status,
  isLast,
  mounted,
}: {
  agent: typeof AGENT_CONFIG[number];
  status: AgentStatus;
  isLast: boolean;
  mounted: boolean;
}) {
  const Icon = agent.icon;

  const cardColor =
    status === "completed" ? "text-blue-700 border-blue-200 bg-blue-50 shadow-sm"
    : status === "processing" ? "text-blue-600 border-blue-300 bg-white shadow-saas ring-1 ring-blue-100"
    : "text-slate-400 border-slate-200 bg-slate-50/50";

  const iconColor =
    status === "completed" ? "text-blue-600 bg-blue-100 border-blue-200"
    : status === "processing" ? "text-blue-500 bg-blue-50 border-blue-200"
    : "text-slate-400 bg-slate-100 border-slate-200";

  // Connector line fill: animate via CSS width/height transition
  const lineStyle: React.CSSProperties =
    status === "completed"
      ? { height: "100%", opacity: 1, transition: "height 0.5s ease-out, opacity 0.3s" }
      : status === "processing"
      ? { height: "50%", opacity: 0.5, transition: "height 0.5s ease-out, opacity 0.3s" }
      : { height: "0%", opacity: 0 };

  return (
    <div
      className="relative"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateX(0)" : "translateX(-20px)",
        transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
      }}
    >
      {/* Connector lines */}
      {!isLast && (
        <>
          {/* Background track */}
          <div className="absolute left-6 top-12 bottom-[-24px] w-[2px] bg-slate-100" />
          {/* Animated fill */}
          <div
            className="absolute left-6 top-12 w-[2px] bg-blue-500 origin-top rounded-full overflow-hidden"
            style={{ bottom: "-24px", ...lineStyle }}
          />
        </>
      )}

      {/* Card */}
      <div
        className={`relative flex items-start gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-500 z-10 ${cardColor}`}
      >
        <div className={`mt-0.5 rounded-full p-2 border ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold ${status === "idle" ? "text-slate-400" : "text-slate-800"}`}>
              {agent.label}
            </h3>
            <StatusIndicator status={status} mounted={mounted} />
          </div>
          <p className={`text-xs font-medium ${status === "idle" ? "text-slate-400" : "text-slate-500"}`}>
            {agent.description}
          </p>
        </div>

        {/* Processing glow — CSS keyframe animation */}
        {status === "processing" && (
          <div
            className="absolute inset-0 rounded-xl border-2 border-blue-400/30 pointer-events-none"
            style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
          />
        )}
      </div>
    </div>
  );
}

function StatusIndicator({ status, mounted }: { status: AgentStatus; mounted: boolean }) {
  if (status === "completed") {
    return (
      <div
        className="flex items-center gap-1.5 text-xs font-bold text-blue-600"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "scale(1)" : "scale(0)",
          transition: "opacity 0.3s, transform 0.3s",
        }}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Done
      </div>
    );
  }

  if (status === "processing") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Active
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
      <CircleDashed className="w-3.5 h-3.5" />
      Waiting
    </div>
  );
}

```

---

### OutputPanel.tsx

* **File Path**: [`frontend/src/components/OutputPanel.tsx`](file:///d:/BrandForge/frontend/src/components/OutputPanel.tsx)
* **Purpose**: Brand Guidelines Output Viewer
* **Main Functionality**: Displays research insights, core strategy guidelines, typography styling blocks, visual palettes, and final coherence parameters.
* **Key Components**: `OutputPanel`, `TabButton`, `ResearchTab`, `StrategyTab`, `DesignTab`, `CopyTab`, `CoherenceTab` UI sections.

```typescript
"use client";
import { useState, useEffect } from "react";
import { AgentsState, BrandData } from "@/lib/types";
import { MockData } from "@/lib/mockData";
import {
  Target, MessageSquare, Palette, PenTool, ActivitySquare,
  CheckCircle, TrendingUp, Fingerprint, Users, Lightbulb,
  AlertCircle, Eye, Volume2, Layers, Star, ChevronRight,
} from "lucide-react";
import Typewriter from "./Typewriter";

interface OutputPanelProps {
  agents: AgentsState;
  data: BrandData;
  mockOutput: MockData;
}

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return mounted;
}

function cardStyle(mounted: boolean, delay = 0): React.CSSProperties {
  return {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.55s ease-out ${delay}s, transform 0.55s ease-out ${delay}s`,
  };
}

function SectionHeader({ icon: Icon, label, color = "blue" }: { icon: React.ElementType; label: string; color?: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
      <div className={`p-2 rounded-lg ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">{label}</h3>
    </div>
  );
}

function Pill({ text, color = "blue" }: { text: string; color?: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[color]}`}>{text}</span>
  );
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold text-slate-800">{value}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          style={{
            width: `${value}%`,
            transition: "width 1s ease-out 0.3s",
          }}
        />
      </div>
    </div>
  );
}

// ── RESEARCH CARD ─────────────────────────────────────────────────────────────
function ResearchCard({ data }: { data: MockData["research"] }) {
  const mounted = useMounted();
  return (
    <div style={cardStyle(mounted)} className="p-8 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-8">
      <SectionHeader icon={Target} label="Market Intelligence" color="blue" />

      {/* Competitor Analysis */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Competitor Analysis</h4>
        <div className="space-y-4">
          {data.competitors.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="font-bold text-slate-800 mb-2">{c.name}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex gap-2">
                  <span className="mt-0.5 text-emerald-500"><CheckCircle className="w-4 h-4" /></span>
                  <p className="text-sm text-slate-600">{c.strengths}</p>
                </div>
                <div className="flex gap-2">
                  <span className="mt-0.5 text-rose-400"><AlertCircle className="w-4 h-4" /></span>
                  <p className="text-sm text-slate-600">{c.weaknesses}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Users className="w-4 h-4" /> Target Audience
        </h4>
        <p className="text-slate-700 leading-relaxed font-medium">{data.audience}</p>
      </div>

      {/* Pain Points */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Audience Pain Points</h4>
        <div className="space-y-2">
          {data.audiencePainPoints.map((p, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-600">{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trends */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Industry Trends
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.marketTrends.map((t, i) => <Pill key={i} text={t} color="blue" />)}
        </div>
      </div>

      {/* Positioning */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Market Positioning Insight</h4>
        <p className="text-blue-800 font-medium leading-relaxed text-sm">{data.marketPositioning}</p>
      </div>
    </div>
  );
}

// ── STRATEGY CARD ─────────────────────────────────────────────────────────────
function StrategyCard({ data }: { data: MockData["strategy"] }) {
  const mounted = useMounted();
  return (
    <div style={cardStyle(mounted)} className="p-8 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-8">
      <SectionHeader icon={MessageSquare} label="Brand Strategy" color="violet" />

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-violet-50 border border-violet-100">
          <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Mission</h4>
          <Typewriter text={data.mission} className="text-slate-700 font-medium leading-relaxed text-sm" />
        </div>
        <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-100">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Vision</h4>
          <Typewriter text={data.vision} className="text-slate-700 font-medium leading-relaxed text-sm" />
        </div>
      </div>

      {/* Brand Personality */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Brand Personality</h4>
        <div className="flex flex-wrap gap-2">
          {data.brandPersonality.map((p, i) => <Pill key={i} text={p} color="violet" />)}
        </div>
      </div>

      {/* Brand Voice */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Volume2 className="w-4 h-4" /> Brand Voice
        </h4>
        <p className="text-slate-700 leading-relaxed">{data.brandVoice}</p>
      </div>

      {/* Positioning Statement */}
      <div className="border-l-4 border-violet-500 pl-5 py-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Positioning Statement</h4>
        <Typewriter text={data.positioningStatement} className="text-xl font-semibold text-slate-800 leading-snug" />
      </div>

      {/* Messaging Strategy */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" /> Messaging Strategy
        </h4>
        <p className="text-slate-600 leading-relaxed text-sm">{data.messagingStrategy}</p>
      </div>
    </div>
  );
}

// ── DESIGN CARD ───────────────────────────────────────────────────────────────
function DesignCard({ data }: { data: MockData["design"] }) {
  const mounted = useMounted();
  return (
    <div style={cardStyle(mounted)} className="p-8 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-8">
      <SectionHeader icon={Palette} label="Design System" color="emerald" />

      {/* Primary Palette */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Primary Color Palette</h4>
        <div className="flex flex-wrap gap-5">
          {data.primaryPalette.map((c, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div
                className="w-20 h-20 rounded-2xl shadow-lg ring-1 ring-black/5"
                style={{ backgroundColor: c.hex }}
              />
              <div>
                <div className="text-xs font-bold text-slate-800">{c.name}</div>
                <div className="text-xs text-slate-400 font-mono">{c.hex}</div>
                <div className="text-xs text-slate-500 mt-0.5 max-w-[80px]">{c.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary Palette */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Secondary Color Palette</h4>
        <div className="flex flex-wrap gap-4">
          {data.secondaryPalette.map((c, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: c.hex }} />
              <div>
                <div className="text-xs font-bold text-slate-700">{c.name}</div>
                <div className="text-xs font-mono text-slate-400">{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Typography System</h4>
        <div className="space-y-4">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="text-xs font-semibold text-slate-400 mb-2">Display / Heading — {data.typography.heading}</div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">{data.typography.headingExample}</div>
          </div>
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <div className="text-xs font-semibold text-slate-400 mb-2">Body — {data.typography.body}</div>
            <div className="text-base text-slate-700 leading-relaxed">{data.typography.bodyExample}</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="text-xs font-semibold text-slate-400">Accent / Mono —</div>
            <div className="font-mono text-sm text-slate-600">{data.typography.accent}</div>
          </div>
        </div>
      </div>

      {/* Logo Direction */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Fingerprint className="w-4 h-4" /> Logo Direction
        </h4>
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shrink-0 shadow-lg">
            <span className="text-white text-2xl font-black tracking-tighter">BF</span>
          </div>
          <Typewriter text={data.logoDirection} className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1" />
        </div>
      </div>

      {/* Visual Language */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4" /> Visual Language
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.visualLanguage.map((v, i) => <Pill key={i} text={v} color="emerald" />)}
        </div>
      </div>

      {/* Moodboard */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Moodboard Summary</h4>
        <p className="text-emerald-900 leading-relaxed text-sm font-medium">{data.moodboard}</p>
      </div>
    </div>
  );
}

// ── COPY CARD ─────────────────────────────────────────────────────────────────
function CopyCard({ data }: { data: MockData["copy"] }) {
  const mounted = useMounted();
  return (
    <div style={cardStyle(mounted)} className="space-y-6">
      {/* Tagline Hero */}
      <div className="p-10 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl" />
        <div className="relative z-10">
          <h4 className="text-xs font-bold text-blue-200 mb-3 uppercase tracking-widest">The Tagline</h4>
          <div className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight drop-shadow-sm">
            <Typewriter text={`"${data.tagline}"`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/10">
            <div className="min-w-0 overflow-hidden">
              <h4 className="text-xs font-bold text-blue-200 mb-2 uppercase tracking-wider">Elevator Pitch</h4>
              <Typewriter text={data.elevatorPitch} className="text-blue-50 leading-relaxed text-sm font-medium break-words" />
            </div>
            <div className="min-w-0 overflow-hidden">
              <h4 className="text-xs font-bold text-blue-200 mb-2 uppercase tracking-wider">Social Media Tone</h4>
              <Typewriter text={data.socialMediaTone} className="text-blue-100 leading-relaxed text-sm break-words" delay={0.02} />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Story + Hero Copy */}
      <div className="p-8 rounded-2xl bg-white border border-slate-200/60 shadow-sm space-y-6">
        <SectionHeader icon={PenTool} label="Brand Copy" color="amber" />
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Homepage Hero</h4>
          <div className="bg-slate-900 text-white p-6 rounded-xl">
            <div className="text-2xl font-bold mb-2">{data.heroHeadline}</div>
            <div className="text-slate-300 text-sm leading-relaxed">{data.heroSubheadline}</div>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Brand Story</h4>
          <Typewriter text={data.brandStory} className="text-slate-600 leading-relaxed text-sm" delay={0.015} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" /> Key Marketing Messages
          </h4>
          <div className="space-y-3">
            {data.marketingMessages.map((m, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                <Star className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-700 font-medium">{m}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COHERENCE CARD ────────────────────────────────────────────────────────────
function CoherenceCard({ data }: { data: MockData["coherence"] }) {
  const metrics = [
    { label: "Tone Consistency", value: data.toneConsistency },
    { label: "Audience Alignment", value: data.audienceAlignment },
    { label: "Visual Consistency", value: data.visualConsistency },
    { label: "Messaging Alignment", value: data.messagingAlignment },
    { label: "Strategic Consistency", value: data.strategicConsistency },
  ];
  const mounted = useMounted();
  return (
    <div style={cardStyle(mounted)} className="p-8 rounded-2xl bg-white border-2 border-blue-100 shadow-sm relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 to-indigo-500" />
      <div className="pl-4">
        <SectionHeader icon={ActivitySquare} label="Coherence Analysis" color="blue" />
        <div className="flex flex-col md:flex-row gap-8">
          {/* Score Circle */}
          <div className="shrink-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-8">
            <div className="text-7xl font-black text-blue-600 tracking-tighter tabular-nums">
              {data.score}%
            </div>
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-2">Global Coherence</div>
          </div>

          {/* Metrics */}
          <div className="flex-1 space-y-4">
            {metrics.map((m) => <MetricBar key={m.label} label={m.label} value={m.value} />)}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 p-5 bg-blue-50 border border-blue-100 rounded-xl">
          <Typewriter text={data.validationSummary} className="text-blue-900 font-medium text-sm leading-relaxed" />
        </div>

        {/* Recommendations */}
        <div className="mt-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">AI Recommendations</h4>
          <div className="space-y-2">
            {data.recommendations.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-600">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FINAL BRAND KIT SUMMARY ───────────────────────────────────────────────────
function FinalBrandKit({ data, mock }: { data: BrandData; mock: MockData }) {
  const mounted = useMounted();
  return (
    <div style={cardStyle(mounted)} className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
      {/* Header */}
      <div className="bg-slate-900 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#1e3a8a,_transparent_60%)]" />
        <div className="relative z-10">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Final Brand Kit</div>
          <h2 className="text-4xl font-black text-white tracking-tight">{data.startupName}</h2>
          <p className="text-blue-200 text-lg mt-1 font-medium">{`"${mock.copy.tagline}"`}</p>
          <p className="text-slate-400 text-sm mt-3 max-w-lg">{mock.copy.elevatorPitch}</p>
        </div>
      </div>

      <div className="bg-white p-8 space-y-8">
        {/* Visual Identity Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Primary Palette</h4>
            <div className="flex gap-2">
              {mock.design.primaryPalette.map((c) => (
                <div key={c.hex} title={c.name} className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: c.hex }} />
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Typography</h4>
            <div className="text-sm">
              <span className="font-bold text-slate-700">{mock.design.typography.heading}</span>
              <span className="text-slate-400 mx-2">+</span>
              <span className="text-slate-600">{mock.design.typography.body}</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Coherence Score</h4>
            <div className="text-3xl font-black text-blue-600">{mock.coherence.score}%</div>
          </div>
        </div>

        {/* Mission */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mission</h4>
          <p className="text-slate-700 font-medium">{mock.strategy.mission}</p>
        </div>

        {/* Personality */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Brand Personality</h4>
          <div className="flex flex-wrap gap-2">
            {mock.strategy.brandPersonality.map((p) => <Pill key={p} text={p} color="blue" />)}
          </div>
        </div>

        {/* Hero Copy */}
        <div className="bg-blue-600 text-white p-6 rounded-xl">
          <div className="text-xl font-bold mb-1">{mock.copy.heroHeadline}</div>
          <div className="text-blue-100 text-sm">{mock.copy.heroSubheadline}</div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function OutputPanel({ agents, data, mockOutput }: OutputPanelProps) {
  return (
    <div className="h-full p-10 overflow-y-auto z-10 relative">
      <div className="max-w-4xl mx-auto space-y-8 pb-32">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">{data?.startupName || "Startup"}</h1>
          <p className="text-lg text-slate-500 font-medium">
            Brand Identity Protocol for <span className="text-blue-600">{data?.industry || "Unknown"}</span>
          </p>
        </div>

        {agents.research === "completed" && <ResearchCard data={mockOutput.research} />}
        {agents.strategy === "completed" && <StrategyCard data={mockOutput.strategy} />}
        {agents.design === "completed" && <DesignCard data={mockOutput.design} />}
        {agents.copy === "completed" && <CopyCard data={mockOutput.copy} />}
        {agents.coherence === "completed" && <CoherenceCard data={mockOutput.coherence} />}
        {agents.coherence === "completed" && <FinalBrandKit data={data} mock={mockOutput} />}
      </div>
    </div>
  );
}

```

---

### BrandKitPDF.tsx

* **File Path**: [`frontend/src/components/BrandKitPDF.tsx`](file:///d:/BrandForge/frontend/src/components/BrandKitPDF.tsx)
* **Purpose**: Hidden PDF Layout Component
* **Main Functionality**: Pre-renders print layout sections offscreen to enable correct HTML canvas exports if required.
* **Key Components**: `BrandKitPDF`, `CoverPage`, `ResearchPage`, `StrategyPage` classes.

```typescript
import React from "react";
import { MockData } from "@/lib/mockData";
import { BrandData } from "@/lib/types";

interface BrandKitPDFProps {
  data: BrandData;
  mock: MockData;
  innerRef: React.RefObject<HTMLDivElement | null>;
}

// Base text reset — must be applied to every text node so html2canvas
// renders word-spacing correctly after stylesheets are stripped.
const txt = {
  wordSpacing: "normal",
  whiteSpace: "normal" as const,
  wordBreak: "break-word" as const,
  overflowWrap: "break-word" as const,
};

const s = {
  page: {
    width: "794px",
    minHeight: "1123px",
    background: "#fff",
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    color: "#0f172a",
    pageBreakAfter: "always" as const,
    padding: "64px",
    boxSizing: "border-box" as const,
    position: "relative" as const,
    overflow: "hidden" as const,
    ...txt,
  },
  label: { fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#94a3b8", marginBottom: "6px", ...txt },
  h2: { fontSize: "22px", fontWeight: 700, color: "#0f172a", marginBottom: "4px", ...txt },
  h3: { fontSize: "16px", fontWeight: 700, color: "#0f172a", marginBottom: "12px", ...txt },
  body: { fontSize: "13px", lineHeight: 1.7, color: "#475569", ...txt },
  pill: { display: "inline-block", padding: "4px 12px", borderRadius: "999px", background: "#eff6ff", color: "#1d4ed8", fontSize: "11px", fontWeight: 600, marginRight: "6px", marginBottom: "6px", ...txt },
  card: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", marginBottom: "16px" },
  divider: { height: "1px", background: "#e2e8f0", margin: "24px 0" },
  blueAccent: { position: "absolute" as const, top: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #2563eb, #6366f1)" },
  metric: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  metricBar: { height: "6px", background: "#e2e8f0", borderRadius: "99px", marginTop: "4px", overflow: "hidden" },
};

// ── PAGE 1: COVER ─────────────────────────────────────────────────────────────
function CoverPage({ data, mock }: { data: BrandData; mock: MockData }) {
  return (
    <div style={{ ...s.page, background: "#0f172a", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "400px", height: "400px", background: "radial-gradient(circle, #1e3a8a 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: "300px", height: "300px", background: "radial-gradient(circle, #312e81 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "80px" }}>
          <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg,#2563eb,#6366f1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: "14px", fontWeight: 900 }}>B</span>
          </div>
          <span style={{ color: "#94a3b8", fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em" }}>BRANDFORGE</span>
        </div>
        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "16px" }}>AI Brand Identity Report</div>
        <div style={{ fontSize: "56px", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", color: "#fff", marginBottom: "16px" }}>{data.startupName}</div>
        <div style={{ fontSize: "22px", color: "#93c5fd", fontStyle: "italic", marginBottom: "24px" }}>{`"${mock.copy.tagline}"`}</div>
        <div style={{ fontSize: "14px", color: "#64748b", maxWidth: "500px", lineHeight: 1.6 }}>{mock.copy.elevatorPitch}</div>
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: "11px", color: "#475569", marginBottom: "4px" }}>Industry</div>
          <div style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 600 }}>{data.industry}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", color: "#475569", marginBottom: "4px" }}>Coherence Score</div>
          <div style={{ fontSize: "32px", fontWeight: 900, color: "#3b82f6" }}>{mock.coherence.score}%</div>
        </div>
      </div>
    </div>
  );
}

// ── PAGE 2: RESEARCH ──────────────────────────────────────────────────────────
function ResearchPage({ mock }: { mock: MockData }) {
  return (
    <div style={s.page}>
      <div style={s.blueAccent} />
      <div style={{ marginBottom: "32px" }}>
        <div style={s.label}>Research Agent · Market Intelligence</div>
        <div style={s.h2}>Market Research & Audience Analysis</div>
      </div>

      <div style={s.label}>Target Audience</div>
      <div style={{ ...s.card, borderLeft: "3px solid #2563eb" }}>
        <p style={s.body}>{mock.research.audience}</p>
      </div>

      <div style={s.label}>Audience Pain Points</div>
      <div style={{ ...s.card, marginBottom: "24px" }}>
        {mock.research.audiencePainPoints.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <span style={{ color: "#2563eb", fontWeight: 700 }}>›</span>
            <span style={s.body}>{p}</span>
          </div>
        ))}
      </div>

      <div style={s.label}>Competitor Analysis</div>
      {mock.research.competitors.map((c, i) => (
        <div key={i} style={s.card}>
          <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "8px" }}>{c.name}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <div style={{ ...s.label, color: "#16a34a" }}>Strengths</div>
              <p style={s.body}>{c.strengths}</p>
            </div>
            <div>
              <div style={{ ...s.label, color: "#dc2626" }}>Weaknesses</div>
              <p style={s.body}>{c.weaknesses}</p>
            </div>
          </div>
        </div>
      ))}

      <div style={s.label}>Industry Trends</div>
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px", marginBottom: "16px" }}>
        {mock.research.marketTrends.map((t, i) => <span key={i} style={s.pill}>{t}</span>)}
      </div>

      <div style={{ ...s.card, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <div style={{ ...s.label, color: "#1d4ed8" }}>Market Positioning Insight</div>
        <p style={{ ...s.body, color: "#1e40af", fontWeight: 500 }}>{mock.research.marketPositioning}</p>
      </div>
    </div>
  );
}

// ── PAGE 3: STRATEGY ──────────────────────────────────────────────────────────
function StrategyPage({ mock }: { mock: MockData }) {
  return (
    <div style={s.page}>
      <div style={s.blueAccent} />
      <div style={{ marginBottom: "32px" }}>
        <div style={s.label}>Strategy Agent · Brand Foundation</div>
        <div style={s.h2}>Mission, Vision & Brand Strategy</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ ...s.card, background: "#f5f3ff", border: "1px solid #e9d5ff" }}>
          <div style={{ ...s.label, color: "#7c3aed" }}>Mission</div>
          <p style={{ ...s.body, color: "#1e1b4b", fontWeight: 500 }}>{mock.strategy.mission}</p>
        </div>
        <div style={{ ...s.card, background: "#eef2ff", border: "1px solid #c7d2fe" }}>
          <div style={{ ...s.label, color: "#4338ca" }}>Vision</div>
          <p style={{ ...s.body, color: "#1e1b4b", fontWeight: 500 }}>{mock.strategy.vision}</p>
        </div>
      </div>

      <div style={{ ...s.card, borderLeft: "3px solid #6366f1", marginBottom: "24px" }}>
        <div style={s.label}>Positioning Statement</div>
        <p style={{ ...s.body, fontSize: "15px", fontWeight: 600, color: "#1e293b" }}>{mock.strategy.positioningStatement}</p>
      </div>

      <div style={s.label}>Brand Personality</div>
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px", marginBottom: "24px" }}>
        {mock.strategy.brandPersonality.map((p, i) => <span key={i} style={s.pill}>{p}</span>)}
      </div>

      <div style={s.card}>
        <div style={s.label}>Brand Voice</div>
        <p style={s.body}>{mock.strategy.brandVoice}</p>
      </div>

      <div style={s.card}>
        <div style={s.label}>Messaging Strategy</div>
        <p style={s.body}>{mock.strategy.messagingStrategy}</p>
      </div>
    </div>
  );
}

// ── PAGE 4: DESIGN ────────────────────────────────────────────────────────────
function DesignPage({ mock }: { mock: MockData }) {
  return (
    <div style={s.page}>
      <div style={s.blueAccent} />
      <div style={{ marginBottom: "32px" }}>
        <div style={s.label}>Design Agent · Visual Identity</div>
        <div style={s.h2}>Color Palette, Typography & Visual System</div>
      </div>

      <div style={s.label}>Primary Color Palette</div>
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {mock.design.primaryPalette.map((c, i) => (
          <div key={i} style={{ textAlign: "center" as const }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "12px", background: c.hex, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", marginBottom: "8px" }} />
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#0f172a" }}>{c.name}</div>
            <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#94a3b8" }}>{c.hex}</div>
          </div>
        ))}
      </div>

      <div style={s.label}>Secondary Palette</div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        {mock.design.secondaryPalette.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", ...s.card, padding: "10px 14px", marginBottom: 0 }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: c.hex }} />
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700 }}>{c.name}</div>
              <div style={{ fontFamily: "monospace", fontSize: "10px", color: "#94a3b8" }}>{c.hex}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={s.label}>Typography System</div>
      <div style={{ ...s.card, marginBottom: "16px" }}>
        <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "4px" }}>Display — {mock.design.typography.heading}</div>
        <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.02em", color: "#0f172a" }}>{mock.design.typography.headingExample}</div>
      </div>
      <div style={s.card}>
        <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "4px" }}>Body — {mock.design.typography.body}</div>
        <div style={{ fontSize: "14px", lineHeight: 1.6, color: "#475569" }}>{mock.design.typography.bodyExample}</div>
      </div>

      <div style={s.label}>Logo Direction</div>
      <div style={{ ...s.card, borderLeft: "3px solid #10b981" }}>
        <p style={s.body}>{mock.design.logoDirection}</p>
      </div>

      <div style={s.label}>Visual Language</div>
      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px" }}>
        {mock.design.visualLanguage.map((v, i) => (
          <span key={i} style={{ ...s.pill, background: "#ecfdf5", color: "#065f46" }}>{v}</span>
        ))}
      </div>
    </div>
  );
}

// ── PAGE 5: COPY ──────────────────────────────────────────────────────────────
function CopyPage({ mock }: { mock: MockData }) {
  return (
    <div style={s.page}>
      <div style={s.blueAccent} />
      <div style={{ marginBottom: "32px" }}>
        <div style={s.label}>Copy Agent · Brand Voice</div>
        <div style={s.h2}>Brand Story, Messaging & Copy</div>
      </div>

      <div style={{ background: "#0f172a", borderRadius: "12px", padding: "28px", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3b82f6", marginBottom: "8px" }}>The Tagline</div>
        <div style={{ fontSize: "32px", fontWeight: 900, color: "#fff", marginBottom: "0" }}>{`"${mock.copy.tagline}"`}</div>
      </div>

      <div style={s.card}>
        <div style={s.label}>Homepage Hero</div>
        <div style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>{mock.copy.heroHeadline}</div>
        <p style={s.body}>{mock.copy.heroSubheadline}</p>
      </div>

      <div style={s.card}>
        <div style={s.label}>Elevator Pitch</div>
        <p style={{ ...s.body, fontWeight: 500 }}>{mock.copy.elevatorPitch}</p>
      </div>

      <div style={s.card}>
        <div style={s.label}>Brand Story</div>
        <p style={s.body}>{mock.copy.brandStory}</p>
      </div>

      <div style={s.label}>Key Marketing Messages</div>
      {mock.copy.marketingMessages.map((m, i) => (
        <div key={i} style={{ ...s.card, background: "#fffbeb", border: "1px solid #fde68a", display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <span style={{ color: "#d97706", fontWeight: 700 }}>★</span>
          <p style={{ ...s.body, color: "#92400e", fontWeight: 500, margin: 0 }}>{m}</p>
        </div>
      ))}
    </div>
  );
}

// ── PAGE 6: COHERENCE ─────────────────────────────────────────────────────────
function CoherencePage({ mock }: { mock: MockData }) {
  const metrics = [
    { label: "Tone Consistency", value: mock.coherence.toneConsistency },
    { label: "Audience Alignment", value: mock.coherence.audienceAlignment },
    { label: "Visual Consistency", value: mock.coherence.visualConsistency },
    { label: "Messaging Alignment", value: mock.coherence.messagingAlignment },
    { label: "Strategic Consistency", value: mock.coherence.strategicConsistency },
  ];
  return (
    <div style={{ ...s.page, pageBreakAfter: "auto" as const }}>
      <div style={s.blueAccent} />
      <div style={{ marginBottom: "32px" }}>
        <div style={s.label}>Coherence Agent · AI Validation</div>
        <div style={s.h2}>Brand Coherence Analysis</div>
      </div>

      <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "24px 32px", textAlign: "center" as const, minWidth: "140px" }}>
          <div style={{ fontSize: "56px", fontWeight: 900, color: "#1d4ed8", lineHeight: 1 }}>{mock.coherence.score}</div>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>Global Score</div>
        </div>
        <div style={{ flex: 1 }}>
          {metrics.map((m) => (
            <div key={m.label} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                <span style={{ color: "#475569", fontWeight: 500 }}>{m.label}</span>
                <span style={{ color: "#0f172a", fontWeight: 700 }}>{m.value}%</span>
              </div>
              <div style={s.metricBar}>
                <div style={{ height: "6px", width: `${m.value}%`, background: "linear-gradient(90deg, #2563eb, #6366f1)", borderRadius: "99px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...s.card, background: "#eff6ff", border: "1px solid #bfdbfe", marginBottom: "24px" }}>
        <div style={{ ...s.label, color: "#1d4ed8" }}>AI Validation Summary</div>
        <p style={{ ...s.body, color: "#1e40af", fontWeight: 500 }}>{mock.coherence.validationSummary}</p>
      </div>

      <div style={s.label}>Strategic Recommendations</div>
      {mock.coherence.recommendations.map((r, i) => (
        <div key={i} style={{ ...s.card, display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <span style={{ color: "#d97706", fontWeight: 700, fontSize: "14px" }}>→</span>
          <p style={{ ...s.body, margin: 0 }}>{r}</p>
        </div>
      ))}

      {/* Footer */}
      <div style={{ position: "absolute", bottom: "48px", left: "64px", right: "64px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
        <span style={{ fontSize: "11px", color: "#94a3b8" }}>Generated by BrandForge AI</span>
        <span style={{ fontSize: "11px", color: "#94a3b8" }}>Confidential — Brand Kit</span>
      </div>
    </div>
  );
}

// ── ROOT COMPONENT ────────────────────────────────────────────────────────────
export default function BrandKitPDF({ data, mock, innerRef }: BrandKitPDFProps) {
  return (
    <div
      ref={innerRef}
      style={{ position: "absolute", left: "-9999px", top: 0, zIndex: -1, width: "794px", background: "#fff", ...txt }}
      aria-hidden="true"
    >
      <CoverPage data={data} mock={mock} />
      <ResearchPage mock={mock} />
      <StrategyPage mock={mock} />
      <DesignPage mock={mock} />
      <CopyPage mock={mock} />
      <CoherencePage mock={mock} />
    </div>
  );
}

```

---

### globals.css

* **File Path**: [`frontend/src/app/globals.css`](file:///d:/BrandForge/frontend/src/app/globals.css)
* **Purpose**: Tailwind V4 Style Entrypoint
* **Main Functionality**: Defines root font variables, standard animations, background gradients, and generic transitions.
* **Key Components**: CSS imports and custom rules.

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --shadow-saas: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03), 0 12px 24px -4px rgba(37, 99, 235, 0.05);
}

@layer base {
  :root {
    --background: #ffffff;
    --foreground: #0f172a;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: #f8fafc;
    color: #0f172a;
    min-height: 100vh;
    font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  /* Custom scrollbar for webkit (Light Theme) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  @keyframes shimmer {
    100% { transform: translateX(100%); }
  }

  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.05); }
    66% { transform: translate(-20px, 20px) scale(0.95); }
  }

  @keyframes fillBar {
    from { width: 0%; }
    to { width: var(--bar-width); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-blob { animation: blob 8s ease-in-out infinite; }
  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }
  .animate-fade-up { animation: fadeUp 0.5s ease-out forwards; }

  @keyframes pulse-glow {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
}

```

---

### layout.tsx

* **File Path**: [`frontend/src/app/layout.tsx`](file:///d:/BrandForge/frontend/src/app/layout.tsx)
* **Purpose**: Next.js App Root Layout
* **Main Functionality**: Wraps all pages with HTML5 layouts and injects web typography styles (Google Fonts Inter/Outfit).
* **Key Components**: `RootLayout` layout wrapper.

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Brand Identity Generator | AI SaaS",
  description: "Generate a complete startup brand identity using a multi-agent AI workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body
        className="bg-slate-50 text-slate-900 min-h-screen font-sans selection:bg-blue-500/30"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

```

---

### page.tsx

* **File Path**: [`frontend/src/app/page.tsx`](file:///d:/BrandForge/frontend/src/app/page.tsx)
* **Purpose**: Marketing Landing Page
* **Main Functionality**: Displays the platform features overview, agent pipeline workflow, and links users to the workspace dashboard.
* **Key Components**: `LandingPage`, `useMounted()`, `fadeUp()` UI animation settings.

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BrainCircuit,
  Target,
  Palette,
  PenTool,
  Layers,
} from "lucide-react";

const agentSteps = [
  { icon: BrainCircuit, label: "Research", iconColor: "#2563eb" },
  { icon: Target, label: "Strategy", iconColor: "#4f46e5" },
  { icon: Palette, label: "Design", iconColor: "#0891b2" },
  { icon: PenTool, label: "Copy", iconColor: "#0284c7" },
  { icon: Layers, label: "Coherence", iconColor: "#2563eb" },
];

const features = [
  {
    title: "Deep Market Research",
    desc: "Our research agent analyzes competitors and market positioning instantly.",
  },
  {
    title: "Strategic Positioning",
    desc: "Develop compelling value propositions and core brand pillars.",
  },
  {
    title: "Visual Identity Systems",
    desc: "Generate color palettes, typography pairs, and logo concepts.",
  },
  {
    title: "Brand Voice & Messaging",
    desc: "Craft taglines, elevator pitches, and consistent brand tone.",
  },
  {
    title: "Automated Coherence Check",
    desc: "The final agent ensures perfect alignment across all generated assets.",
  },
  {
    title: "Export Ready Assets",
    desc: "Download your brand guidelines directly to PDF or Figma tokens.",
  },
];

// Hook: returns true after component mounts, so animations only fire client-side
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

// Staggered fade-up helper
function fadeUp(
  mounted: boolean,
  delay: number = 0
): React.CSSProperties {
  return {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
  };
}

export default function LandingPage() {
  const mounted = useMounted();

  return (
    <main
      suppressHydrationWarning
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        overflowX: "hidden",
        fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* ── Navigation ─────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 700,
              fontSize: "1.25rem",
              letterSpacing: "-0.025em",
              color: "#0f172a",
            }}
          >
            <div
              style={{
                height: "2rem",
                width: "2rem",
                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles style={{ width: "1rem", height: "1rem", color: "#fff" }} />
            </div>
            BrandForge
          </div>
          <Link
            href="/login"
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#475569",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "#0f172a")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "#475569")
            }
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: "9rem",
          paddingBottom: "6rem",
        }}
      >
        {/* Background blobs */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            className="animate-blob"
            style={{
              position: "absolute",
              top: "5%",
              left: "20%",
              width: "18rem",
              height: "18rem",
              background: "#93c5fd",
              borderRadius: "50%",
              filter: "blur(64px)",
              opacity: 0.25,
              mixBlendMode: "multiply",
            }}
          />
          <div
            className="animate-blob animation-delay-2000"
            style={{
              position: "absolute",
              top: "25%",
              right: "15%",
              width: "18rem",
              height: "18rem",
              background: "#67e8f9",
              borderRadius: "50%",
              filter: "blur(64px)",
              opacity: 0.25,
              mixBlendMode: "multiply",
            }}
          />
          <div
            className="animate-blob animation-delay-4000"
            style={{
              position: "absolute",
              bottom: "5%",
              left: "35%",
              width: "18rem",
              height: "18rem",
              background: "#a5b4fc",
              borderRadius: "50%",
              filter: "blur(64px)",
              opacity: 0.25,
              mixBlendMode: "multiply",
            }}
          />
        </div>

        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            position: "relative",
            zIndex: 10,
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "56rem",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Badge */}
            <div
              style={{
                ...fadeUp(mounted, 0),
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.375rem 1rem",
                borderRadius: "9999px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                color: "#2563eb",
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: "2rem",
              }}
            >
              <Sparkles style={{ width: "1rem", height: "1rem" }} />
              <span>The Next Generation AI Branding Platform</span>
            </div>

            {/* H1 */}
            <h1
              style={{
                ...fadeUp(mounted, 0.1),
                fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                color: "#0f172a",
                marginBottom: "1.5rem",
                textWrap: "balance",
              }}
            >
              Forge your brand identity with{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI precision.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                ...fadeUp(mounted, 0.2),
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                color: "#64748b",
                marginBottom: "2.5rem",
                maxWidth: "40rem",
                lineHeight: 1.7,
              }}
            >
              Deploy a multi-agent AI pipeline to research, strategize, design,
              and write cohesive brand assets in minutes, not months.
            </p>

            {/* CTA */}
            <div
              style={{
                ...fadeUp(mounted, 0.3),
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "1rem 2rem",
                  background: "#0f172a",
                  color: "#fff",
                  borderRadius: "9999px",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "#1e293b";
                  el.style.boxShadow = "0 8px 24px rgba(15,23,42,0.25)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "#0f172a";
                  el.style.boxShadow = "none";
                }}
              >
                Try Demo
                <ArrowRight style={{ width: "1rem", height: "1rem" }} />
              </Link>
              <Link
                href="#how-it-works"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 2rem",
                  color: "#475569",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#0f172a")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#475569")
                }
              >
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Workflow Section ──────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          paddingTop: "6rem",
          paddingBottom: "6rem",
          background: "#f8fafc",
          borderTop: "1px solid #f1f5f9",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "1.875rem",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#0f172a",
                marginBottom: "1rem",
              }}
            >
              The Multi-Agent Pipeline
            </h2>
            <p style={{ color: "#64748b", maxWidth: "36rem", margin: "0 auto" }}>
              Five specialized AI agents working in harmony to synthesize your
              brand.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "0",
            }}
          >
            {agentSteps.map((step, i) => (
              <div
                key={step.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  ...fadeUp(mounted, 0.1 + i * 0.1),
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: "4rem",
                      height: "4rem",
                      borderRadius: "1rem",
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: step.iconColor,
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.borderColor = "#bfdbfe";
                      el.style.boxShadow = "0 4px 12px rgba(37,99,235,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.borderColor = "#e2e8f0";
                      el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                    }}
                  >
                    <step.icon style={{ width: "2rem", height: "2rem" }} />
                  </div>
                  <span
                    style={{
                      marginTop: "1rem",
                      fontWeight: 500,
                      color: "#374151",
                      fontSize: "0.875rem",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                {i < agentSteps.length - 1 && (
                  <div
                    aria-hidden="true"
                    style={{
                      width: "3rem",
                      height: "1px",
                      background: "#e2e8f0",
                      margin: "0 0.5rem",
                      marginBottom: "1.5rem",
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────── */}
      <section style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "1.875rem",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#0f172a",
                marginBottom: "1rem",
              }}
            >
              Enterprise-grade capabilities
            </h2>
            <p style={{ color: "#64748b", maxWidth: "36rem" }}>
              Everything you need to launch a cohesive brand identity.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {features.map((feature, i) => (
              <div
                key={feature.title}
                style={{
                  ...fadeUp(mounted, 0.05 + i * 0.08),
                  padding: "2rem",
                  borderRadius: "1.5rem",
                  background: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  transition:
                    "background 0.2s, border-color 0.2s, box-shadow 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "#fff";
                  el.style.borderColor = "#bfdbfe";
                  el.style.boxShadow = "0 8px 30px rgba(0,0,0,0.05)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "#f8fafc";
                  el.style.borderColor = "#f1f5f9";
                  el.style.boxShadow = "none";
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "#0f172a",
                    marginBottom: "0.75rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: "0.9rem" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section
        style={{
          paddingTop: "6rem",
          paddingBottom: "6rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, background: "#0f172a" }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(37,99,235,0.3) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: "56rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            position: "relative",
            zIndex: 10,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "1.5rem",
            }}
          >
            Start Building Your Brand
          </h2>
          <p
            style={{
              color: "#bfdbfe",
              fontSize: "1.125rem",
              maxWidth: "36rem",
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
            }}
          >
            Join innovative startups using BrandForge to establish their market
            presence in record time.
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 2rem",
              background: "#fff",
              color: "#0f172a",
              borderRadius: "9999px",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background = "#f1f5f9")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background = "#fff")
            }
          >
            Launch Prototype
            <ArrowRight style={{ width: "1rem", height: "1rem" }} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer
        style={{
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "0.875rem",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <p>© 2026 BrandForge. Prototype demo.</p>
      </footer>
    </main>
  );
}

```

---

### page.tsx

* **File Path**: [`frontend/src/app/login/page.tsx`](file:///d:/BrandForge/frontend/src/app/login/page.tsx)
* **Purpose**: Authentication page
* **Main Functionality**: Handles user authorization logins and account registration forms with background animation layers.
* **Key Components**: `LoginPage` container.

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, User } from "lucide-react";
import { setToken, setUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only animate after mount so SSR and initial client render are identical
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const url = mode === "login"
        ? "http://localhost:3001/api/v1/auth/login"
        : "http://localhost:3001/api/v1/auth/signup";

      const body = mode === "login"
        ? { username, password }
        : { username, email, password, confirmPassword };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "An authentication error occurred");
        setIsLoading(false);
        return;
      }

      // Save token and user details to local storage
      setToken(data.token);
      setUser(data.user);

      // Redirect to the workspace dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError("Unable to connect to the authentication server. Please ensure the backend is running.");
      setIsLoading(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "28rem",
    zIndex: 10,
    padding: "1rem",
    position: "relative",
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? "translateY(0)" : "translateY(24px)",
    transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
  };

  return (
    <main
      suppressHydrationWarning
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* Animated Background Blobs */}
      <div
        style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <div
          className="animate-blob"
          style={{
            position: "absolute",
            top: "5%",
            left: "15%",
            width: "24rem",
            height: "24rem",
            background: "#bfdbfe",
            borderRadius: "50%",
            filter: "blur(64px)",
            opacity: 0.35,
            mixBlendMode: "multiply",
          }}
        />
        <div
          className="animate-blob animation-delay-2000"
          style={{
            position: "absolute",
            top: "30%",
            right: "10%",
            width: "24rem",
            height: "24rem",
            background: "#a5f3fc",
            borderRadius: "50%",
            filter: "blur(64px)",
            opacity: 0.35,
            mixBlendMode: "multiply",
          }}
        />
        <div
          className="animate-blob animation-delay-4000"
          style={{
            position: "absolute",
            bottom: "5%",
            left: "35%",
            width: "24rem",
            height: "24rem",
            background: "#c7d2fe",
            borderRadius: "50%",
            filter: "blur(64px)",
            opacity: 0.35,
            mixBlendMode: "multiply",
          }}
        />
      </div>

      {/* Login / Signup Card */}
      <div style={cardStyle}>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 8px 40px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
            borderRadius: "1.5rem",
            padding: "2.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Shine overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
              pointerEvents: "none",
            }}
          />

          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                height: "3rem",
                width: "3rem",
                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                borderRadius: "0.875rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(37,99,235,0.3)",
                marginBottom: "1rem",
              }}
            >
              <Sparkles style={{ color: "white", width: "1.5rem", height: "1.5rem" }} />
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.025em",
                margin: 0,
                textAlign: "center",
              }}
            >
              {mode === "login" ? "Welcome to BrandForge" : "Create Account"}
            </h1>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginTop: "0.5rem",
                textAlign: "center",
              }}
            >
              {mode === "login"
                ? "Sign in to your AI brand workspace"
                : "Register to build cohesive brand identities with AI"}
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div
              style={{
                background: "rgba(254, 242, 242, 0.8)",
                border: "1px solid rgba(254, 226, 226, 1)",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem",
                fontSize: "0.825rem",
                color: "#991b1b",
                lineHeight: "1.4",
                zIndex: 1,
                position: "relative",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: "0.375rem",
                }}
              >
                Username
              </label>
              <div style={{ position: "relative" }}>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0.75rem",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <User style={{ height: "1.25rem", width: "1.25rem", color: "#94a3b8" }} />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="brandbuilder"
                  autoComplete="username"
                  style={{
                    display: "block",
                    width: "100%",
                    paddingLeft: "2.75rem",
                    paddingRight: "0.75rem",
                    paddingTop: "0.625rem",
                    paddingBottom: "0.625rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.75rem",
                    background: "rgba(255,255,255,0.7)",
                    color: "#0f172a",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Email Field (Signup Mode only) */}
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: "0.375rem",
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "0.75rem",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Mail style={{ height: "1.25rem", width: "1.25rem", color: "#94a3b8" }} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required={mode === "signup"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                    style={{
                      display: "block",
                      width: "100%",
                      paddingLeft: "2.75rem",
                      paddingRight: "0.75rem",
                      paddingTop: "0.625rem",
                      paddingBottom: "0.625rem",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.75rem",
                      background: "rgba(255,255,255,0.7)",
                      color: "#0f172a",
                      fontSize: "0.9rem",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6";
                      e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: "0.375rem",
                }}
              >
                {mode === "login" ? "Password" : "Create Password"}
              </label>
              <div style={{ position: "relative" }}>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0.75rem",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Lock style={{ height: "1.25rem", width: "1.25rem", color: "#94a3b8" }} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  style={{
                    display: "block",
                    width: "100%",
                    paddingLeft: "2.75rem",
                    paddingRight: "0.75rem",
                    paddingTop: "0.625rem",
                    paddingBottom: "0.625rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.75rem",
                    background: "rgba(255,255,255,0.7)",
                    color: "#0f172a",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Confirm Password Field (Signup Mode only) */}
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="confirm-password"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: "0.375rem",
                  }}
                >
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "0.75rem",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Lock style={{ height: "1.25rem", width: "1.25rem", color: "#94a3b8" }} />
                  </div>
                  <input
                    id="confirm-password"
                    type="password"
                    required={mode === "signup"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    style={{
                      display: "block",
                      width: "100%",
                      paddingLeft: "2.75rem",
                      paddingRight: "0.75rem",
                      paddingTop: "0.625rem",
                      paddingBottom: "0.625rem",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.75rem",
                      background: "rgba(255,255,255,0.7)",
                      color: "#0f172a",
                      fontSize: "0.9rem",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6";
                      e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div style={{ paddingTop: "0.5rem" }}>
              <button
                type="submit"
                disabled={isLoading || !username || !password || (mode === "signup" && (!email || !confirmPassword))}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 1rem",
                  border: "none",
                  borderRadius: "0.875rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#ffffff",
                  background:
                    isLoading || !username || !password || (mode === "signup" && (!email || !confirmPassword))
                      ? "#94a3b8"
                      : "#0f172a",
                  cursor:
                    isLoading || !username || !password || (mode === "signup" && (!email || !confirmPassword))
                      ? "not-allowed"
                      : "pointer",
                  transition: "background 0.2s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && username && password && (mode === "login" || (email && confirmPassword))) {
                    (e.currentTarget as HTMLButtonElement).style.background = "#1e293b";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && username && password && (mode === "login" || (email && confirmPassword))) {
                    (e.currentTarget as HTMLButtonElement).style.background = "#0f172a";
                  }
                }}
              >
                {isLoading ? (
                  mode === "login" ? "Authenticating..." : "Creating Account..."
                ) : (
                  <>
                    {mode === "login" ? "Enter BrandForge" : "Register and Create"}
                    <ArrowRight style={{ width: "1rem", height: "1rem" }} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer toggle (Login / Signup switch) */}
          <div
            style={{
              marginTop: "1.75rem",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <button
              onClick={handleToggleMode}
              style={{
                background: "none",
                border: "none",
                fontSize: "0.825rem",
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: 500,
                textDecoration: "underline",
              }}
            >
              {mode === "login"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

```

---

### page.tsx

* **File Path**: [`frontend/src/app/dashboard/page.tsx`](file:///d:/BrandForge/frontend/src/app/dashboard/page.tsx)
* **Purpose**: Dashboard View Workspace Controller
* **Main Functionality**: Manages global workspace state, polls job updates, processes data formatting, and triggers delete requests.
* **Key Components**: `Dashboard`, `transformApiResult()`, `startPolling()`.

```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputPanel from "@/components/InputPanel";
import PipelinePanel from "@/components/PipelinePanel";
import OutputPanel from "@/components/OutputPanel";
import { MockData } from "@/lib/mockData";
import { AppState, AgentsState, BrandData } from "@/lib/types";
import ExportButton from "@/components/ExportButton";
import { isAuthenticated, getAuthHeaders, logout, getUser } from "@/lib/auth";

/**
 * Maps the compact backend GenerateResult into the richer MockData shape
 * that OutputPanel / the UI cards expect.
 * Fields that the backend doesn't produce are synthesised from what it does return.
 */
function transformApiResult(raw: any): MockData {
  const r = raw?.research ?? {};
  const s = raw?.strategy ?? {};
  const d = raw?.design ?? {};
  const c = raw?.copy ?? {};
  const co = raw?.coherence ?? {};

  // --- Research ---
  const competitors: MockData["research"]["competitors"] = (r.competitors ?? []).map(
    (comp: { name: string; analysis: string }) => ({
      name: comp.name ?? "Competitor",
      // Split the single `analysis` string into strengths/weaknesses on a dash/semicolon
      strengths: comp.analysis?.split(/[;\-–]/)[0]?.trim() ?? comp.analysis ?? "",
      weaknesses: comp.analysis?.split(/[;\-–]/)[1]?.trim() ?? "Limited public information.",
    })
  );

  // Derive audiencePainPoints from the audience string (split on commas / periods if present)
  // so the UI always gets a non-empty array.
  const audience: string = r.audience ?? "";
  const painPointsFromAudience = audience
    .split(/[,.]/)                       // split on commas or periods
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 10);  // discard fragments that are too short
  const audiencePainPoints: string[] =
    painPointsFromAudience.length > 0
      ? painPointsFromAudience.slice(0, 4)
      : ["Finding the right solution for their needs", "Lack of quality options in the market"];

  // --- Strategy ---
  const tone: string = s.tone ?? "";
  const positioning: string = s.positioning ?? "";
  const mission: string = s.mission ?? "";
  // Derive brandPersonality from tone string words
  const brandPersonality: string[] = tone
    .split(/[,.\/&]/)
    .map((w: string) => w.trim())
    .filter((w: string) => w.length > 2)
    .slice(0, 5);

  // --- Design ---
  const colorPalette = d.colorPalette ?? [];
  const primaryPalette: MockData["design"]["primaryPalette"] = colorPalette.map(
    (col: { hex: string; name: string }) => ({
      hex: col.hex,
      name: col.name,
      usage: "Brand color",
    })
  );
  const typography = d.typography ?? { heading: "Inter", body: "Roboto" };

  // --- Coherence ---
  const alignmentMetrics: { label: string; value: number }[] = co.alignmentMetrics ?? [];
  const getMetric = (kw: string, fallback: number) =>
    alignmentMetrics.find((m: { label: string; value: number }) =>
      m.label.toLowerCase().includes(kw)
    )?.value ?? fallback;

  return {
    research: {
      competitors,
      audience,
      audiencePainPoints,
      marketTrends: r.marketTrends ?? [],
      marketPositioning: positioning || `Positioned within the ${audience} market segment.`,
    },
    strategy: {
      mission,
      vision: `A world powered by ${mission.split(" ").slice(0, 6).join(" ") || "innovation"}.`,
      brandPersonality: brandPersonality.length > 0 ? brandPersonality : ["Innovative", "Trusted", "Forward-thinking"],
      brandVoice: tone || "Professional and approachable.",
      positioningStatement: positioning || mission,
      messagingStrategy: `Lead with the value proposition. ${tone}`,
    },
    design: {
      primaryPalette,
      secondaryPalette: [],
      typography: {
        heading: typography.heading ?? "Inter",
        body: typography.body ?? "Roboto",
        accent: "JetBrains Mono",
        headingExample: `The Future of ${audience.split(" ").slice(0, 3).join(" ") || "Innovation"}`,
        bodyExample: mission || "Building something great.",
      },
      logoDirection: d.logoDirection ?? "A clean, modern wordmark with geometric accents.",
      visualLanguage: ["Clean layouts", "Bold typography", "Strategic use of color", "Modern aesthetic"],
      moodboard: `A modern visual identity combining ${colorPalette.map((c: { name: string }) => c.name).join(", ")} to create a professional and trustworthy brand presence.`,
    },
    copy: {
      tagline: c.tagline ?? "",
      elevatorPitch: c.elevatorPitch ?? "",
      brandStory: c.story ?? "",
      heroHeadline: c.tagline ?? "",
      heroSubheadline: c.elevatorPitch ?? "",
      marketingMessages: [c.tagline ?? "", c.elevatorPitch ?? ""].filter(Boolean),
      socialMediaTone: tone || "Engaging and professional.",
    },
    coherence: {
      score: co.score ?? 0,
      toneConsistency: getMetric("tone", co.score ?? 80),
      audienceAlignment: getMetric("audience", co.score ?? 80),
      visualConsistency: getMetric("visual", co.score ?? 80),
      messagingAlignment: getMetric("messag", co.score ?? 80),
      strategicConsistency: getMetric("strateg", co.score ?? 80),
      validationSummary: co.validationSummary ?? "Brand analysis complete.",
      recommendations: [],
    },
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [appState, setAppState] = useState<AppState>("idle");
  const [brandData, setBrandData] = useState<BrandData>({ startupName: "", industry: "", valueProp: "" });
  const [mockOutput, setMockOutput] = useState<MockData | null>(null);
  const [username, setUsername] = useState("");
  
  const [agents, setAgents] = useState<AgentsState>({
    research: "idle",
    strategy: "idle",
    design: "idle",
    copy: "idle",
    coherence: "idle",
  });

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/jobs", {
        headers: getAuthHeaders()
      });
      if (res.status === 401 || res.status === 403) {
        logout();
        router.push("/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      console.error("Failed to fetch sessions", e);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setIsAuthorized(true);
      fetchSessions();
      const user = getUser();
      if (user) {
        setUsername(user.username);
      }
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [router]);

  const startPolling = (jobId: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const statusRes = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}`, {
          headers: getAuthHeaders()
        });

        if (statusRes.status === 401 || statusRes.status === 403) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          logout();
          router.push("/login");
          return;
        }

        if (!statusRes.ok) return;
        const job = await statusRes.json();
        
        setAgents({
          research: job.stages.research,
          strategy: job.stages.strategy,
          design: job.stages.design,
          copy: job.stages.copy,
          coherence: job.stages.coherence,
        });

        if (job.status === "completed") {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          
          const resultRes = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}/result`, {
            headers: getAuthHeaders()
          });

          if (resultRes.status === 401 || resultRes.status === 403) {
            logout();
            router.push("/login");
            return;
          }

          const resultData = await resultRes.json();
          setMockOutput(transformApiResult(resultData.result));
          setAppState("done");
          fetchSessions();
        } else if (job.status === "failed") {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setAppState("idle");
          alert("Generation failed: " + (job.error?.message || "Unknown error"));
          fetchSessions();
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 1000);
  };

  const handleGenerate = async (data: BrandData) => {
    setBrandData(data);
    setAppState("generating");
    setMockOutput(null);

    setAgents({
      research: "idle",
      strategy: "idle",
      design: "idle",
      copy: "idle",
      coherence: "idle",
    });

    try {
      const response = await fetch("http://localhost:3001/api/v1/jobs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(data),
      });
      
      if (response.status === 401 || response.status === 403) {
        logout();
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to initialize job");
      }
      
      const { jobId } = await response.json();
      
      startPolling(jobId);
      fetchSessions();

    } catch (err) {
      console.error(err);
      setAppState("idle");
      alert("Failed to connect to backend or start job generation");
    }
  };

  const handleDeleteSession = async (jobId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        router.push("/login");
        return;
      }

      if (!res.ok) {
        alert("Failed to delete session.");
        return;
      }

      // Remove from local list immediately (optimistic update)
      setSessions((prev: any[]) => prev.filter((s) => s.jobId !== jobId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete session.");
    }
  };

  const handleSelectSession = async (jobId: string) => {
    try {
      const statusRes = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}`, {
        headers: getAuthHeaders()
      });

      if (statusRes.status === 401 || statusRes.status === 403) {
        logout();
        router.push("/login");
        return;
      }

      if (!statusRes.ok) {
        alert("Failed to load session details");
        return;
      }

      const job = await statusRes.json();

      // Clear previous output immediately so OutputPanel never renders with stale/undefined data
      setMockOutput(null);
      setBrandData(job.input ?? { startupName: "", industry: "", valueProp: "" });
      setAgents({
        research: job.stages?.research ?? "idle",
        strategy: job.stages?.strategy ?? "idle",
        design: job.stages?.design ?? "idle",
        copy: job.stages?.copy ?? "idle",
        coherence: job.stages?.coherence ?? "idle",
      });

      if (job.status === "completed") {
        setAppState("generating");
        const resultRes = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}/result`, {
          headers: getAuthHeaders()
        });

        if (resultRes.status === 401 || resultRes.status === 403) {
          logout();
          router.push("/login");
          return;
        }

        const resultData = await resultRes.json();
        setMockOutput(transformApiResult(resultData.result));
        setAppState("done");
      } else if (job.status === "failed") {
        setAppState("idle");
        setMockOutput(null);
        alert("This session failed: " + (job.error?.message || "Unknown error"));
      } else {
        setAppState("generating");
        setMockOutput(null);
        startPolling(jobId);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load past session");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Left Panel: Input */}
      <section className="w-1/4 h-full bg-slate-900 text-slate-50 flex-shrink-0 z-20 shadow-2xl relative overflow-y-auto">
        <InputPanel 
          onGenerate={handleGenerate} 
          isGenerating={appState === "generating"} 
          sessions={sessions}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
        />
      </section>

      {/* Center Panel: Pipeline */}
      <section className="w-1/3 h-full border-r border-slate-200 bg-white flex-shrink-0 relative overflow-y-auto z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <PipelinePanel agents={agents} appState={appState} />
      </section>

      {/* Right Panel: Output Feed */}
      <section className="flex-1 h-full bg-slate-50/50 relative flex flex-col overflow-hidden">
        {/* Top Header: Workspace Info + User Profile & Logout */}
        <header className="flex-shrink-0 z-20 flex justify-between items-center px-10 py-4 bg-white/90 backdrop-blur border-b border-slate-100/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Workspace
            </span>
            {appState === "done" && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Brand Kit Ready
                </span>
              </>
            )}
          </div>
          
          {username && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs text-blue-600 font-bold uppercase shadow-sm">
                  {username[0]}
                </div>
                <span className="text-xs font-semibold text-slate-700">@{username}</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-200" />
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-slate-500 hover:text-red-500 transition-colors font-semibold uppercase tracking-wider cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scroll-smooth relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none" />
          
          {mockOutput ? (
            <OutputPanel agents={agents} data={brandData} mockOutput={mockOutput} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <p className="text-sm font-medium">Awaiting initialization...</p>
            </div>
          )}
        </div>

        {/* Floating Export Button (Bottom Right) */}
        {appState === "done" && mockOutput && (
          <div className="absolute bottom-6 right-8 z-30 shadow-lg hover:shadow-xl transition-all duration-200 scale-100 hover:scale-105 active:scale-95">
            <ExportButton data={brandData} mock={mockOutput} />
          </div>
        )}
      </section>
    </main>
  );
}

```

---


---

## Backend Code

This section details and provides the complete code for the API server entry points, routers, authentication controllers, and handler middlewares:

### server.ts

* **File Path**: [`backend/src/server.ts`](file:///d:/BrandForge/backend/src/server.ts)
* **Purpose**: Application Entrypoint
* **Main Functionality**: Loads environment variables, builds the Fastify application instance, and starts listening on the configured host/port.
* **Key Components**: `start()`: bootstrapping function.

```typescript
import 'dotenv/config';
import { buildApp } from './app';
import { logger } from './utils/logger';

const start = async () => {
  try {
    const app = await buildApp();
    const port = parseInt(process.env.PORT || '3000', 10);
    
    await app.listen({ port, host: '0.0.0.0' });
    logger.info(`🚀 Server running on port ${port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();

```

---

### app.ts

* **File Path**: [`backend/src/app.ts`](file:///d:/BrandForge/backend/src/app.ts)
* **Purpose**: Fastify Application Builder
* **Main Functionality**: Registers plugins (CORS), sets global error handler, and configures versioned API endpoints.
* **Key Components**: `buildApp()`: configures Fastify plugins and routes.

```typescript
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { logger } from './utils/logger';
import { errorHandler } from './utils/errors';
import healthRoutes from './routes/health.route';
import generateRoutes from './routes/generate.route';
import jobsRoutes from './routes/jobs.route';
import authRoutes from './routes/auth.route';
import { v4 as uuidv4 } from 'uuid';

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    genReqId: () => uuidv4(),
  });

  // Register Plugins
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Error Handler
  app.setErrorHandler(errorHandler);

  // Register Routes
  app.register(healthRoutes);
  app.register(authRoutes, { prefix: '/api/v1' });
  app.register(generateRoutes, { prefix: '/api/v1' });
  app.register(jobsRoutes, { prefix: '/api/v1' });

  return app;
};

```

---

### logger.ts

* **File Path**: [`backend/src/utils/logger.ts`](file:///d:/BrandForge/backend/src/utils/logger.ts)
* **Purpose**: Pino Logger Utility
* **Main Functionality**: Instantiates the Pino logging engine with pretty-printing capabilities enabled in local dev modes.
* **Key Components**: `logger`: pino logger configuration instance.

```typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
      : undefined,
});

```

---

### auth.middleware.ts

* **File Path**: [`backend/src/utils/auth.middleware.ts`](file:///d:/BrandForge/backend/src/utils/auth.middleware.ts)
* **Purpose**: JWT Authentication Guard
* **Main Functionality**: Reads Bearer tokens from authorization headers and decodes them using the secret key to authenticate route access.
* **Key Components**: `authenticateRequest()`: preHandler hook for Fastify routes.

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  userId: string;
  username: string;
  email: string;
}

// Extend FastifyRequest definition to include user object
declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

export const authenticateRequest = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Authorization token missing or invalid'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';
    
    const decoded = jwt.verify(token, secret) as AuthenticatedUser;
    request.user = decoded;
  } catch (err) {
    return reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
};

```

---

### health.route.ts

* **File Path**: [`backend/src/routes/health.route.ts`](file:///d:/BrandForge/backend/src/routes/health.route.ts)
* **Purpose**: System Health Checker API
* **Main Functionality**: Simple response handler returning API server check information.
* **Key Components**: `healthRoutes` fastify register handle.

```typescript
import { FastifyInstance, FastifyPluginAsync } from 'fastify';

const healthRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/health', async (request, reply) => {
    return reply.send({
      status: 'ok',
      service: 'brand-identity-backend',
      timestamp: new Date().toISOString(),
    });
  });
};

export default healthRoutes;

```

---

### auth.route.ts

* **File Path**: [`backend/src/routes/auth.route.ts`](file:///d:/BrandForge/backend/src/routes/auth.route.ts)
* **Purpose**: Authentication API Controller
* **Main Functionality**: Signup and login logic verifying inputs, storing hashed passwords, and returning valid JWT session tokens.
* **Key Components**: `authRoutes`, `POST /auth/signup`, `POST /auth/login`.

```typescript
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const signupSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string()
});

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  
  // POST /signup
  fastify.post('/auth/signup', async (request, reply) => {
    try {
      const { username, email, password, confirmPassword } = signupSchema.parse(request.body);

      if (password !== confirmPassword) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Passwords do not match'
        });
      }

      // Check if username or email already exists
      const existingUser = await db.select()
        .from(usersTable)
        .where(
          or(
            eq(usersTable.username, username),
            eq(usersTable.email, email)
          )
        )
        .limit(1);

      if (existingUser.length > 0) {
        const field = existingUser[0].username === username ? 'Username' : 'Email';
        return reply.status(409).send({
          error: 'Conflict',
          message: `${field} is already registered`
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      // Insert user
      const [user] = await db.insert(usersTable).values({
        id: userId,
        username,
        email,
        passwordHash
      }).returning();

      // Sign JWT
      const secret = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';
      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        secret,
        { expiresIn: '7d' }
      );

      return reply.status(201).send({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: err.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
        });
      }
      throw err;
    }
  });

  // POST /login
  fastify.post('/auth/login', async (request, reply) => {
    try {
      const { username, password } = loginSchema.parse(request.body);

      // Find user
      const [user] = await db.select()
        .from(usersTable)
        .where(eq(usersTable.username, username))
        .limit(1);

      if (!user) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'Invalid username or password'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'Invalid username or password'
        });
      }

      // Sign JWT
      const secret = process.env.JWT_SECRET || 'super-secret-key-change-me-in-production';
      const token = jwt.sign(
        { userId: user.id, username: user.username, email: user.email },
        secret,
        { expiresIn: '7d' }
      );

      return reply.status(200).send({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: err.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
        });
      }
      throw err;
    }
  });

};

export default authRoutes;

```

---

### generate.route.ts

* **File Path**: [`backend/src/routes/generate.route.ts`](file:///d:/BrandForge/backend/src/routes/generate.route.ts)
* **Purpose**: Synchronous Generation Controller
* **Main Functionality**: Synchronous endpoint triggering immediate generation requests for fast testing response validation.
* **Key Components**: `generateRoutes` sync callback controller.

```typescript
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { generateInputSchema } from '../schemas/generate.schema';
import { GenerationService } from '../services/generation.service';

const generateRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post('/generate', async (request, reply) => {
    const input = generateInputSchema.parse(request.body);
    
    const startTime = Date.now();
    const result = await GenerationService.generateBrandIdentity(input);
    const latencyMs = Date.now() - startTime;

    return reply.status(200).send({
      requestId: request.id,
      input,
      result,
      meta: {
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        latencyMs,
        createdAt: new Date().toISOString(),
      },
    });
  });
};

export default generateRoutes;

```

---

### jobs.route.ts

* **File Path**: [`backend/src/routes/jobs.route.ts`](file:///d:/BrandForge/backend/src/routes/jobs.route.ts)
* **Purpose**: Asynchronous Job API Controller
* **Main Functionality**: Creates background tasks, returns queued state markers, serves polled agent details, and checks job ownership rules.
* **Key Components**: `jobsRoutes`, `POST /jobs`, `GET /jobs/:jobId`, `GET /jobs/:jobId/result`.

```typescript
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { generateInputSchema } from '../schemas/generate.schema';
import { JobService } from '../services/job.service';
import { jobStore } from '../store/postgres.store';
import { v4 as uuidv4 } from 'uuid';
import { authenticateRequest } from '../utils/auth.middleware';

const jobsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/jobs', { preHandler: authenticateRequest }, async (request, reply) => {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ error: 'Unauthorized', message: 'User not found' });
    }
    const jobs = await jobStore.getUserJobs(userId);
    return reply.status(200).send(jobs);
  });

  fastify.post('/jobs', { preHandler: authenticateRequest }, async (request, reply) => {
    const input = generateInputSchema.parse(request.body);
    const jobId = uuidv4();
    const userId = request.user?.userId;
    
    // Create job in store with user ID association
    const job = await jobStore.createJob(jobId, input, userId);
    
    // Start background processing (intentionally not awaited)
    JobService.startJob(jobId, input).catch(err => {
      fastify.log.error({ err, jobId }, 'Background job failed to start');
    });

    return reply.status(202).send({
      jobId: job.jobId,
      status: job.status,
    });
  });

  fastify.get('/jobs/:jobId', { preHandler: authenticateRequest }, async (request, reply) => {
    const { jobId } = request.params as { jobId: string };
    const job = await jobStore.getJob(jobId);
    
    if (!job) {
      return reply.status(404).send({ error: 'Not Found', message: 'Job not found' });
    }

    // Auth ownership check: if the job has a userId, check it matches the authenticated user
    if (job.userId && job.userId !== request.user?.userId) {
      return reply.status(403).send({ error: 'Forbidden', message: 'You do not have permission to access this job' });
    }

    const { result, ...publicJobInfo } = job;
    return reply.status(200).send(publicJobInfo);
  });

  fastify.get('/jobs/:jobId/result', { preHandler: authenticateRequest }, async (request, reply) => {
    const { jobId } = request.params as { jobId: string };
    const job = await jobStore.getJob(jobId);
    
    if (!job) {
      return reply.status(404).send({ error: 'Not Found', message: 'Job not found' });
    }

    // Auth ownership check: if the job has a userId, check it matches the authenticated user
    if (job.userId && job.userId !== request.user?.userId) {
      return reply.status(403).send({ error: 'Forbidden', message: 'You do not have permission to access this job' });
    }

    if (job.status !== 'completed') {
      return reply.status(409).send({ error: 'Conflict', message: 'Job is not completed yet', status: job.status });
    }

    return reply.status(200).send({
      jobId: job.jobId,
      input: job.input,
      result: job.result,
      createdAt: job.createdAt,
      completedAt: job.updatedAt,
    });
  });

  fastify.delete('/jobs/:jobId', { preHandler: authenticateRequest }, async (request, reply) => {
    const { jobId } = request.params as { jobId: string };
    const job = await jobStore.getJob(jobId);

    if (!job) {
      return reply.status(404).send({ error: 'Not Found', message: 'Job not found' });
    }

    // Ownership check
    if (job.userId && job.userId !== request.user?.userId) {
      return reply.status(403).send({ error: 'Forbidden', message: 'You do not have permission to delete this job' });
    }

    await jobStore.deleteJob(jobId);
    return reply.status(200).send({ success: true, jobId });
  });
};

export default jobsRoutes;

```

---


---

## AI Generation Logic

This section outlines how the custom multi-agent pipeline is integrated with LLM endpoints, showing the orchestration service, unwrapping handler, and the five prompt agents:

### openai.service.ts

* **File Path**: [`backend/src/services/openai.service.ts`](file:///d:/BrandForge/backend/src/services/openai.service.ts)
* **Purpose**: LLM Orchestration Layer
* **Main Functionality**: Manages API connectivity, structure formatting protocols, unwrapping, and exponential backoff retry flows.
* **Key Components**: `OpenAIService.generateStructuredOutput()`, `unwrapIfNeeded()`, `sleep()`.

```typescript
import OpenAI from 'openai';
import { logger } from '../utils/logger';
import { z } from 'zod';

// Initialise lazily so dotenv has already loaded when this runs
let _openai: OpenAI | null = null;
function getOpenAIClient(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    });
  }
  return _openai;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 8000;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Normalise raw parsed JSON from the model before we validate with Zod.
 *
 * Smaller models (e.g. gemini-3.1-flash-lite) sometimes wrap the result in a
 * superfluous outer key like `{ "properties": { ... actual keys ... } }` or
 * `{ "output": { ... } }` or even `{ "ResearchOutput": { ... } }`.
 *
 * This function detects that pattern and unwraps one level so the root keys
 * match what Zod expects.
 */
function unwrapIfNeeded(parsed: any, expectedKeys: string[]): any {
  if (typeof parsed !== 'object' || parsed === null) return parsed;

  // Check how many top-level keys overlap with what we expect
  const topLevelMatches = expectedKeys.filter(k => k in parsed).length;
  if (topLevelMatches >= 1) {
    // Already looks correct (at least one expected key is at the root)
    return parsed;
  }

  // Try one level of unwrapping — pick the single child object whose keys
  // include at least one expected key
  const childKeys = Object.keys(parsed);
  for (const ck of childKeys) {
    const child = parsed[ck];
    if (typeof child === 'object' && child !== null) {
      const childMatches = expectedKeys.filter(k => k in child).length;
      if (childMatches >= 1) {
        logger.warn(`[OpenAIService] Unwrapping model output from key "${ck}"`);
        return child;
      }
    }
  }

  // Nothing matched — return as-is and let Zod produce a useful error
  return parsed;
}

/**
 * Extract just the required keys from the Zod schema so we can pass them
 * explicitly to the prompt and to unwrapIfNeeded.
 */
function getTopLevelKeys(schema: z.ZodType<any>): string[] {
  if (schema instanceof z.ZodObject) {
    return Object.keys(schema.shape);
  }
  return [];
}

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

    const openai = getOpenAIClient();
    const timeoutMs = parseInt(process.env.AI_TIMEOUT_MS || '60000', 10);

    const expectedKeys = getTopLevelKeys(schema);
    const keysStr = expectedKeys.length > 0 ? expectedKeys.map(k => `"${k}"`).join(', ') : '(see schema)';

    const fullSystemPrompt = `${systemPrompt}

You MUST respond with a single, valid JSON object. Follow these rules exactly:
1. The top-level JSON object must have ONLY these keys: ${keysStr}
2. Do NOT wrap the result inside any other object. Do NOT use keys like "properties", "output", "result", "${schemaName}", "data", or "response" as wrappers.
3. Use the EXACT key names listed above — correct spelling and camelCase where specified.
4. Return ONLY the raw JSON. No markdown fences (no \`\`\`json), no explanatory text before or after.

Example of CORRECT format (using placeholder values):
{
  ${expectedKeys.map(k => `"${k}": <value>`).join(',\n  ')}
}`;

    let lastError: any;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        logger.info(`[OpenAIService] Attempt ${attempt}/${MAX_RETRIES} for ${schemaName}`);

        const response = await openai.chat.completions.create(
          {
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
              { role: 'system', content: fullSystemPrompt },
              { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
          },
          { timeout: timeoutMs }
        );

        const content = response.choices[0].message.content;
        if (!content) throw new Error('Model returned empty content');

        let rawParsed: any;
        try {
          rawParsed = JSON.parse(content);
        } catch (parseErr) {
          // Try stripping markdown fences some models still add
          const stripped = content.replace(/^\`\`\`(?:json)?\s*/i, '').replace(/\s*\`\`\`$/, '').trim();
          rawParsed = JSON.parse(stripped);
        }

        // Normalise the response structure before Zod validation
        const normalised = unwrapIfNeeded(rawParsed, expectedKeys);

        logger.debug({ normalised }, `[OpenAIService] Normalised response for ${schemaName}`);

        return schema.parse(normalised) as T;

      } catch (error: any) {
        lastError = error;

        // Log Zod validation errors clearly so we can see what the model actually returned
        if (error?.name === 'ZodError') {
          logger.error({ zodIssues: error.issues }, `[OpenAIService] Schema validation failed for ${schemaName} on attempt ${attempt}`);
          // Zod errors are not retryable HTTP errors — break immediately
          if (attempt >= MAX_RETRIES) throw error;
          const delay = RETRY_DELAY_MS;
          logger.warn(`[OpenAIService] Retrying after schema validation failure in ${delay}ms...`);
          await sleep(delay);
          continue;
        }

        const isRetryable = error?.status === 503 || error?.status === 429 || error?.status === 500;

        if (isRetryable && attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY_MS * attempt;
          logger.warn(`[OpenAIService] ${error.status} error on attempt ${attempt}, retrying in ${delay}ms...`);
          await sleep(delay);
        } else {
          logger.error({ err: error }, `[OpenAIService] Failed generating output for ${schemaName} after ${attempt} attempts`);
          throw error;
        }
      }
    }

    throw lastError;
  }
}

```

---

### job.service.ts

* **File Path**: [`backend/src/services/job.service.ts`](file:///d:/BrandForge/backend/src/services/job.service.ts)
* **Purpose**: Multi-Agent Job Pipeline Orchestrator
* **Main Functionality**: Coordinates execution flow among Research, Strategy, Design, Copy, and Coherence agents in a mix of sequential and parallel steps.
* **Key Components**: `JobService.startJob()`: asynchronous task handler.

```typescript
import { GenerateInput, Job } from '../types';
import { jobStore } from '../store/postgres.store';
import { researchAgent } from '../agents/researchAgent';
import { strategyAgent } from '../agents/strategyAgent';
import { designAgent } from '../agents/designAgent';
import { copyAgent } from '../agents/copyAgent';
import { coherenceAgent } from '../agents/coherenceAgent';
import { logger } from '../utils/logger';

export class JobService {
  static async startJob(jobId: string, input: GenerateInput): Promise<void> {
    await jobStore.updateJobStatus(jobId, 'processing');
    
    try {
      // Research
      await jobStore.updateJobStage(jobId, 'research', 'processing');
      const research = await researchAgent(input);
      await jobStore.updateJobResult(jobId, { research });
      await jobStore.updateJobStage(jobId, 'research', 'completed');

      // Strategy
      await jobStore.updateJobStage(jobId, 'strategy', 'processing');
      const strategy = await strategyAgent(input, research);
      await jobStore.updateJobResult(jobId, { strategy });
      await jobStore.updateJobStage(jobId, 'strategy', 'completed');

      // Design & Copy in parallel
      await jobStore.updateJobStage(jobId, 'design', 'processing');
      await jobStore.updateJobStage(jobId, 'copy', 'processing');
      
      const [design, copy] = await Promise.all([
        designAgent(input, strategy).then(async res => {
          await jobStore.updateJobResult(jobId, { design: res });
          await jobStore.updateJobStage(jobId, 'design', 'completed');
          return res;
        }).catch(async err => {
          await jobStore.updateJobStage(jobId, 'design', 'failed');
          throw err;
        }),
        copyAgent(input, strategy).then(async res => {
          await jobStore.updateJobResult(jobId, { copy: res });
          await jobStore.updateJobStage(jobId, 'copy', 'completed');
          return res;
        }).catch(async err => {
          await jobStore.updateJobStage(jobId, 'copy', 'failed');
          throw err;
        })
      ]);

      // Coherence
      await jobStore.updateJobStage(jobId, 'coherence', 'processing');
      const coherence = await coherenceAgent(research, strategy, design, copy);
      await jobStore.updateJobResult(jobId, { coherence });
      await jobStore.updateJobStage(jobId, 'coherence', 'completed');

      await jobStore.updateJobStatus(jobId, 'completed');
      logger.info({ jobId }, 'Job completed successfully');

    } catch (error: any) {
      logger.error({ jobId, err: error }, 'Job failed');
      await jobStore.updateJobStatus(jobId, 'failed', error.message);
    }
  }
}

```

---

### generation.service.ts

* **File Path**: [`backend/src/services/generation.service.ts`](file:///d:/BrandForge/backend/src/services/generation.service.ts)
* **Purpose**: Synchronous Pipeline Orchestrator
* **Main Functionality**: Allows starting immediate synchronous multi-agent executions for testing or fallback API runs.
* **Key Components**: `GenerationService.generateBrandIdentity()`

```typescript
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

```

---

### researchAgent.ts

* **File Path**: [`backend/src/agents/researchAgent.ts`](file:///d:/BrandForge/backend/src/agents/researchAgent.ts)
* **Purpose**: Market Research Agent logic
* **Main Functionality**: Gathers audience demographics, competitor attributes, and trend lists through targeted LLM prompting.
* **Key Components**: `researchAgent()` endpoint prompt parser.

```typescript
import { GenerateInput, ResearchResult } from '../types';
import { researchSchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const researchAgent = async (input: GenerateInput): Promise<ResearchResult> => {
  const systemPrompt = `You are an expert market researcher. Conduct preliminary research for a new startup.`;
  const userPrompt = `Startup Name: ${input.startupName}\nIndustry: ${input.industry}\nValue Proposition: ${input.valueProp}

Provide market research with these EXACT top-level keys:
- "competitors": an array of objects, each with "name" (string) and "analysis" (string)
- "audience": a string describing the target audience
- "marketTrends": an array of strings listing market trends

Your JSON must look like:
{
  "competitors": [{"name": "...", "analysis": "..."}],
  "audience": "...",
  "marketTrends": ["...", "..."]
}`;

  try {
    return await OpenAIService.generateStructuredOutput(
      systemPrompt,
      userPrompt,
      researchSchema,
      "ResearchOutput",
      "Market research analysis"
    );
  } catch (error: any) {
    if (error.message === 'MOCK_FALLBACK_REQUESTED') {
      logger.info(`[ResearchAgent] Mocking data for ${input.startupName}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        competitors: [{ name: "Mock Competitor", analysis: "They are doing well but lack focus." }],
        audience: "Tech-savvy millennials interested in " + input.industry,
        marketTrends: ["AI automation", "Sustainability"]
      };
    }
    throw error;
  }
};

```

---

### strategyAgent.ts

* **File Path**: [`backend/src/agents/strategyAgent.ts`](file:///d:/BrandForge/backend/src/agents/strategyAgent.ts)
* **Purpose**: Brand Strategy Agent logic
* **Main Functionality**: Formulates missions, brand positioning insights, and voice specifications based on target market inputs.
* **Key Components**: `strategyAgent()` strategy layout renderer.

```typescript
import { GenerateInput, ResearchResult, StrategyResult } from '../types';
import { strategySchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const strategyAgent = async (input: GenerateInput, research: ResearchResult): Promise<StrategyResult> => {
  const systemPrompt = `You are an expert brand strategist. Based on the startup's info and market research, formulate a brand strategy.`;
  const userPrompt = `Startup Name: ${input.startupName}\nIndustry: ${input.industry}\nValue Proposition: ${input.valueProp}

Research Data:
${JSON.stringify(research)}

Define the positioning, tone of voice, and brand mission using these EXACT top-level keys:
- "positioning": a string describing the brand's market position
- "tone": a string describing the tone of voice
- "mission": a string with the brand mission statement

Your JSON must look like:
{
  "positioning": "...",
  "tone": "...",
  "mission": "..."
}`;

  try {
    return await OpenAIService.generateStructuredOutput(
      systemPrompt,
      userPrompt,
      strategySchema,
      "StrategyOutput",
      "Brand strategy definition"
    );
  } catch (error: any) {
    if (error.message === 'MOCK_FALLBACK_REQUESTED') {
      logger.info(`[StrategyAgent] Mocking data for ${input.startupName}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        positioning: `The premier solution for ${input.industry} that actually cares.`,
        tone: "Professional, friendly, and innovative.",
        mission: `To disrupt the ${input.industry} space with uncompromised quality.`
      };
    }
    throw error;
  }
};

```

---

### designAgent.ts

* **File Path**: [`backend/src/agents/designAgent.ts`](file:///d:/BrandForge/backend/src/agents/designAgent.ts)
* **Purpose**: Visual Design System Agent logic
* **Main Functionality**: Establishes complementary color hex keys, default font styles, and logo concept rules.
* **Key Components**: `designAgent()` Zod schema binder.

```typescript
import { GenerateInput, StrategyResult, DesignResult } from '../types';
import { designSchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const designAgent = async (input: GenerateInput, strategy: StrategyResult): Promise<DesignResult> => {
  const systemPrompt = `You are an expert brand designer. Based on the startup's strategy, define the design system.`;
  const userPrompt = `Startup Name: ${input.startupName}\nIndustry: ${input.industry}

Brand Strategy:
${JSON.stringify(strategy)}

Define a design system using these EXACT top-level keys:
- "colorPalette": an array of exactly 3 objects, each with "hex" (string, e.g. "#FF5733") and "name" (string)
- "typography": an object with "heading" (string font name) and "body" (string font name)
- "logoDirection": a string describing the logo concept

Your JSON must look like:
{
  "colorPalette": [
    {"hex": "#FF5733", "name": "Primary"},
    {"hex": "#F3F4F6", "name": "Background"},
    {"hex": "#1F2937", "name": "Text"}
  ],
  "typography": {"heading": "Inter", "body": "Roboto"},
  "logoDirection": "..."
}`;

  try {
    return await OpenAIService.generateStructuredOutput(
      systemPrompt,
      userPrompt,
      designSchema,
      "DesignOutput",
      "Brand design system"
    );
  } catch (error: any) {
    if (error.message === 'MOCK_FALLBACK_REQUESTED') {
      logger.info(`[DesignAgent] Mocking data for ${input.startupName}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        colorPalette: [
          { hex: "#FF5733", name: "Primary Brand" },
          { hex: "#F3F4F6", name: "Background" },
          { hex: "#1F2937", name: "Text" }
        ],
        typography: { heading: "Inter", body: "Roboto" },
        logoDirection: "Minimalist geometric icon paired with a bold sans-serif wordmark."
      };
    }
    throw error;
  }
};

```

---

### copyAgent.ts

* **File Path**: [`backend/src/agents/copyAgent.ts`](file:///d:/BrandForge/backend/src/agents/copyAgent.ts)
* **Purpose**: Copywriting Agent logic
* **Main Functionality**: Outputs taglines, elevator pitches, and brand backstory narratives mapped from strategy directives.
* **Key Components**: `copyAgent()` copy template constructor.

```typescript
import { GenerateInput, StrategyResult, CopyResult } from '../types';
import { copySchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const copyAgent = async (input: GenerateInput, strategy: StrategyResult): Promise<CopyResult> => {
  const systemPrompt = `You are an expert copywriter. Based on the startup's info and strategy, write the foundational brand copy.`;
  const userPrompt = `Startup Name: ${input.startupName}\nValue Proposition: ${input.valueProp}

Brand Strategy:
${JSON.stringify(strategy)}

Write brand copy using these EXACT top-level keys:
- "tagline": a short, memorable brand tagline (string)
- "elevatorPitch": a 2-3 sentence elevator pitch (string)
- "story": the brand origin and mission story, 3-4 sentences (string)

Your JSON must look like:
{
  "tagline": "...",
  "elevatorPitch": "...",
  "story": "..."
}`;

  try {
    return await OpenAIService.generateStructuredOutput(
      systemPrompt,
      userPrompt,
      copySchema,
      "CopyOutput",
      "Brand copywriting elements"
    );
  } catch (error: any) {
    if (error.message === 'MOCK_FALLBACK_REQUESTED') {
      logger.info(`[CopyAgent] Mocking data for ${input.startupName}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        tagline: "Empowering your future.",
        elevatorPitch: `We are ${input.startupName}, providing the best in ${input.industry} by focusing on ${input.valueProp}.`,
        story: "It started with a simple idea: to make things better. Now, we are leading the way."
      };
    }
    throw error;
  }
};

```

---

### coherenceAgent.ts

* **File Path**: [`backend/src/agents/coherenceAgent.ts`](file:///d:/BrandForge/backend/src/agents/coherenceAgent.ts)
* **Purpose**: Coherence Audit Agent logic
* **Main Functionality**: Performs final cross-component checks, calculates alignment parameters, and suggests corrective steps.
* **Key Components**: `coherenceAgent()` consistency auditing interface.

```typescript
import { ResearchResult, StrategyResult, DesignResult, CopyResult, CoherenceResult } from '../types';
import { coherenceSchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const coherenceAgent = async (
  research: ResearchResult,
  strategy: StrategyResult,
  design: DesignResult,
  copy: CopyResult
): Promise<CoherenceResult> => {
  const systemPrompt = `You are an expert brand auditor. Review the generated brand components for consistency and alignment.`;
  const userPrompt = `Review these brand components for coherence:

Research: ${JSON.stringify(research)}
Strategy: ${JSON.stringify(strategy)}
Design: ${JSON.stringify(design)}
Copy: ${JSON.stringify(copy)}

Evaluate brand coherence using these EXACT top-level keys:
- "score": a number from 0 to 100 indicating overall brand coherence
- "alignmentMetrics": an array of objects, each with "label" (string) and "value" (number 0-100)
- "validationSummary": a string summarising the coherence assessment

Your JSON must look like:
{
  "score": 87,
  "alignmentMetrics": [
    {"label": "Tone vs Audience", "value": 90},
    {"label": "Design vs Strategy", "value": 85}
  ],
  "validationSummary": "..."
}`;

  try {
    return await OpenAIService.generateStructuredOutput(
      systemPrompt,
      userPrompt,
      coherenceSchema,
      "CoherenceOutput",
      "Brand coherence analysis"
    );
  } catch (error: any) {
    if (error.message === 'MOCK_FALLBACK_REQUESTED') {
      logger.info(`[CoherenceAgent] Mocking data.`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        score: 95,
        alignmentMetrics: [
          { label: "Tone vs Audience", value: 98 },
          { label: "Design vs Strategy", value: 92 }
        ],
        validationSummary: "The brand elements are highly aligned and present a unified front."
      };
    }
    throw error;
  }
};

```

---


---

## Database Schema

This section shows the Drizzle configuration schemas and Neon connectivity files:

### index.ts

* **File Path**: [`backend/src/db/index.ts`](file:///d:/BrandForge/backend/src/db/index.ts)
* **Purpose**: Database Connection Client
* **Main Functionality**: Initializes the Neon Serverless Postgres driver connection and binds Drizzle ORM mapping schemas.
* **Key Components**: `db`: drizzle database interface handle.

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

```

---

### schema.ts

* **File Path**: [`backend/src/db/schema.ts`](file:///d:/BrandForge/backend/src/db/schema.ts)
* **Purpose**: Database Drizzle Schemas
* **Main Functionality**: Defines database structures for persistent entity models including Users and Job tracking tables.
* **Key Components**: `usersTable`, `jobsTable`: Drizzle ORM tables.

```typescript
import { pgTable, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { JobStatus, StageStatus, GenerateInput, GenerateResult } from "../types";

export const usersTable = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const jobsTable = pgTable("jobs", {
  jobId: varchar("job_id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => usersTable.id),
  status: varchar("status", { length: 50 }).$type<JobStatus>().notNull(),
  input: jsonb("input").$type<GenerateInput>().notNull(),
  result: jsonb("result").$type<Partial<GenerateResult>>(),
  stages: jsonb("stages").$type<{
    research: StageStatus;
    strategy: StageStatus;
    design: StageStatus;
    copy: StageStatus;
    coherence: StageStatus;
  }>().notNull(),
  progress: integer("progress").notNull().default(0),
  error: jsonb("error").$type<{ message: string }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

```

---

### index.ts

* **File Path**: [`backend/src/types/index.ts`](file:///d:/BrandForge/backend/src/types/index.ts)
* **Purpose**: Data Type Definitions
* **Main Functionality**: Defines TypeScript interfaces and types inferred from Zod schemas for application state representation.
* **Key Components**: `GenerateInput`, `GenerateResult`, `Job`, `JobStatus`, `StageStatus`.

```typescript
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

```

---


---

## GitHub Repository

GitHub Link: _____________________
