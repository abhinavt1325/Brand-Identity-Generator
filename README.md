<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/flame.svg" alt="BrandForge Logo" width="80" height="80" />

  # 🔥 BrandForge
  
  **Your complete AI-Powered Brand Identity Generator in minutes.**
  
  <p align="center">
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#features">Features</a> •
    <a href="#how-it-works">How It Works</a> •
    <a href="#getting-started">Getting Started</a>
  </p>

  <p align="center">
    <a href="https://brand-identity-generator-zeta.vercel.app/"><strong>Explore the Live App »</strong></a>
  </p>

  [![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![Fastify](https://img.shields.io/badge/Fastify-API-000000?style=flat-square&logo=fastify)](https://fastify.io/)
  [![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
  [![Neon Postgres](https://img.shields.io/badge/Database-Neon_Postgres-00E599?style=flat-square&logo=postgresql)](https://neon.tech/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
</div>

---

## 🚀 What is BrandForge?

**BrandForge** is an end-to-end, multi-agent AI application designed to replace a traditional branding agency. By simply providing a startup name, industry, and a short value proposition, BrandForge orchestrates a specialized team of **five AI agents** to generate a cohesive, professional brand identity kit.

No more generic outputs. BrandForge cross-references market research, brand strategy, visual design, and copywriting to build a unified brand narrative, and exports it directly to a stunning PDF.

---

## ✨ Features

- **🤖 5-Agent Pipeline:** Specialized AI agents handle Research, Strategy, Design, Copywriting, and Coherence.
- **⚡ Parallel Processing:** Design and Copy agents run concurrently to drastically reduce generation time.
- **📄 Instant PDF Export:** Generates a professional 6-page A4 PDF brand kit directly in the browser using `jsPDF`.
- **💾 Session Persistence:** Fully resumable and persistent sessions powered by **Neon PostgreSQL** and **Drizzle ORM**.
- **🔐 Secure Authentication:** JWT-based user authentication ensures all your generated brand kits are private and secure.
- **💫 Modern UI/UX:** Built with Next.js 16 App Router, Tailwind CSS v4, and Framer Motion for buttery-smooth animations and real-time status updates.

---

## 🏗️ Architecture & How It Works

BrandForge employs a sophisticated multi-agent orchestration architecture:

1. **Research Agent (Sequential):** Analyzes competitors, audience, and market trends.
2. **Strategy Agent (Sequential):** Builds positioning, tone, and mission based on the research.
3. **Design & Copy Agents (Parallel):** Run concurrently to create the color palette, typography, logo direction, tagline, and elevator pitch.
4. **Coherence Agent (Sequential):** Evaluates all outputs to ensure a unified and consistent brand identity, providing a final alignment score.

```mermaid
graph TD
    A[User Input] --> B[Research Agent]
    B --> C[Strategy Agent]
    C --> D[Design Agent]
    C --> E[Copy Agent]
    D --> F[Coherence Agent]
    E --> F[Coherence Agent]
    F --> G[Final Brand Kit & PDF]
    
    style B fill:#f9f,stroke:#333,stroke-width:2px,color:#000
    style C fill:#bbf,stroke:#333,stroke-width:2px,color:#000
    style D fill:#bfb,stroke:#333,stroke-width:2px,color:#000
    style E fill:#bfb,stroke:#333,stroke-width:2px,color:#000
    style F fill:#fbb,stroke:#333,stroke-width:2px,color:#000
```

*(For an exhaustive engineering and architecture deep dive, see [ARCHITECTURE.md](./ARCHITECTURE.md))*

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **PDF Generation:** jsPDF + html2canvas
- **Icons:** Lucide React

### Backend (API Server)
- **Server:** Node.js + Fastify
- **Language:** TypeScript
- **Database:** Serverless Neon PostgreSQL
- **ORM:** Drizzle ORM
- **Validation:** Zod

### AI & LLM integration
- **Model:** Google `gemini-3.1-flash-lite`
- **Orchestration:** Custom Multi-Agent Pipeline with structured JSON outputs.

---

## 🌐 Live Deployments

- **Frontend (Vercel):** [brand-identity-generator-zeta.vercel.app](https://brand-identity-generator-zeta.vercel.app)
- **Backend API (Render):** [brand-identity-generator.onrender.com](https://brand-identity-generator.onrender.com)

---

## 🚦 Getting Started

### Prerequisites
- **Node.js** (v20+ recommended)
- **Neon PostgreSQL** database URL
- **Google AI Studio API Key**

### 1. Clone & Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

**Backend (`backend/.env`):**
```env
DATABASE_URL=postgres://user:pass@ep-rest-of-url.neon.tech/neondb
OPENAI_API_KEY=your_google_ai_studio_key
OPENAI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
OPENAI_MODEL=gemini-3.1-flash-lite
JWT_SECRET=super-secret-key-change-me-in-production
CORS_ORIGIN=http://localhost:3002
```

### 3. Run the Development Servers

**Start Backend (Port 3001):**
```bash
cd backend
npm run dev
```

**Start Frontend (Port 3002):**
```bash
cd frontend
npm run dev
```

Navigate to `http://localhost:3002` to start generating your brand identity!

---

## 🔮 Roadmap

- [ ] Transition from polling to WebSockets/SSE for real-time frontend updates.
- [ ] Implement BullMQ/Inngest for robust background job queuing.
- [ ] Add rate limiting and robust DoS protection.
- [ ] Support custom font uploads for the generated PDFs.

---

<div align="center">
  <i>Built with ❤️ for the Hackathon</i>
</div>
