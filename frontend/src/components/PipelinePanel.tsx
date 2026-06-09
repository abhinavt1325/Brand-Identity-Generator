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
