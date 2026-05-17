"use client";

import { useState } from "react";
import InputPanel from "@/components/InputPanel";
import PipelinePanel from "@/components/PipelinePanel";
import OutputPanel from "@/components/OutputPanel";
import { getMockData, MockData } from "@/lib/mockData";

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

export default function Dashboard() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [brandData, setBrandData] = useState<BrandData>({ startupName: "", industry: "", valueProp: "" });
  const [mockOutput, setMockOutput] = useState<MockData | null>(null);
  
  const [agents, setAgents] = useState<AgentsState>({
    research: "idle",
    strategy: "idle",
    design: "idle",
    copy: "idle",
    coherence: "idle",
  });

  const handleGenerate = (data: BrandData) => {
    setBrandData(data);
    setAppState("generating");
    
    // Generate contextual mock data
    const generatedData = getMockData(data.industry);
    setMockOutput(generatedData);

    // Reset agents
    setAgents({
      research: "idle",
      strategy: "idle",
      design: "idle",
      copy: "idle",
      coherence: "idle",
    });

    // Mock the pipeline sequence with realistic staggered delays
    const sequence = [
      { key: "research" as const, delay: 500, duration: 3000 },
      { key: "strategy" as const, delay: 3500, duration: 3000 },
      { key: "design" as const, delay: 6500, duration: 2500 },
      { key: "copy" as const, delay: 9000, duration: 3000 },
      { key: "coherence" as const, delay: 12000, duration: 2500 },
    ];

    sequence.forEach(({ key, delay, duration }) => {
      setTimeout(() => {
        setAgents((prev) => ({ ...prev, [key]: "processing" }));
      }, delay);

      setTimeout(() => {
        setAgents((prev) => ({ ...prev, [key]: "completed" }));
      }, delay + duration);
    });

    // Complete the app state
    setTimeout(() => {
      setAppState("done");
    }, 15000); // After all agents finish
  };

  return (
    <main className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Left Panel: Input */}
      <section className="w-1/4 h-full bg-slate-900 text-slate-50 flex-shrink-0 z-20 shadow-2xl relative">
        <InputPanel onGenerate={handleGenerate} isGenerating={appState === "generating"} />
      </section>

      {/* Center Panel: Pipeline */}
      <section className="w-1/3 h-full border-r border-slate-200 bg-white flex-shrink-0 relative overflow-y-auto z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <PipelinePanel agents={agents} appState={appState} />
      </section>

      {/* Right Panel: Output Feed */}
      <section className="flex-1 h-full bg-slate-50/50 relative overflow-y-auto scroll-smooth">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none fixed" />
        {mockOutput && (
          <OutputPanel agents={agents} appState={appState} data={brandData} mockOutput={mockOutput} />
        )}
        {!mockOutput && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <p>Awaiting initialization...</p>
          </div>
        )}
      </section>
    </main>
  );
}
