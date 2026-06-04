"use client";

import { useState, useRef } from "react";
import InputPanel from "@/components/InputPanel";
import PipelinePanel from "@/components/PipelinePanel";
import OutputPanel from "@/components/OutputPanel";
import { MockData } from "@/lib/mockData";


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

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const { jobId } = await response.json();
      
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

      pollIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}`);
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
            
            const resultRes = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}/result`);
            const resultData = await resultRes.json();
            setMockOutput(resultData.result);
            setAppState("done");
          } else if (job.status === "failed") {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setAppState("idle");
            alert("Generation failed: " + (job.error?.message || "Unknown error"));
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 1000);

    } catch (err) {
      console.error(err);
      setAppState("idle");
      alert("Failed to connect to backend on port 3001");
    }
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
