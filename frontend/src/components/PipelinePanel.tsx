import { motion } from "framer-motion";
import { AgentsState, AppState, AgentStatus } from "@/app/page";
import { Search, BrainCircuit, PenTool, Type, Network, CheckCircle2, CircleDashed, Loader2 } from "lucide-react";

interface PipelinePanelProps {
  agents: AgentsState;
  appState: AppState;
}

const AGENT_CONFIG = [
  { id: "research", label: "Research Agent", description: "Market & Competitor Analysis", icon: Search },
  { id: "strategy", label: "Strategy Agent", description: "Brand Positioning & Tone", icon: BrainCircuit },
  { id: "design", label: "Design Agent", description: "Color & Typography Systems", icon: PenTool },
  { id: "copy", label: "Copy Agent", description: "Taglines & Brand Story", icon: Type },
  { id: "coherence", label: "Coherence Agent", description: "Final Brand Verification", icon: Network },
] as const;

export default function PipelinePanel({ agents, appState }: PipelinePanelProps) {
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
            />
          );
        })}
      </div>

      {appState === "done" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center gap-3 text-blue-700 shadow-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold">Pipeline execution completed successfully.</span>
        </motion.div>
      )}
    </div>
  );
}

function AgentCard({ 
  agent, 
  status, 
  isLast 
}: { 
  agent: typeof AGENT_CONFIG[number]; 
  status: AgentStatus; 
  isLast: boolean; 
}) {
  const Icon = agent.icon;
  
  const getStatusColor = () => {
    switch (status) {
      case "completed": return "text-blue-700 border-blue-200 bg-blue-50 shadow-sm";
      case "processing": return "text-blue-600 border-blue-300 bg-white shadow-saas ring-1 ring-blue-100";
      default: return "text-slate-400 border-slate-200 bg-slate-50/50";
    }
  };

  const getIconColor = () => {
    switch (status) {
      case "completed": return "text-blue-600 bg-blue-100 border-blue-200";
      case "processing": return "text-blue-500 bg-blue-50 border-blue-200";
      default: return "text-slate-400 bg-slate-100 border-slate-200";
    }
  };

  return (
    <div className="relative">
      {!isLast && (
        <>
          {/* Background line */}
          <div className="absolute left-6 top-12 bottom-[-24px] w-[2px] bg-slate-100" />
          
          {/* Animated fill line */}
          <motion.div 
            className="absolute left-6 top-12 w-[2px] bg-blue-500 origin-top rounded-full"
            initial={{ scaleY: 0 }}
            animate={{ 
              scaleY: status === "completed" ? 1 : status === "processing" ? [0, 0.5, 0] : 0,
              opacity: status === "completed" ? 1 : status === "processing" ? [0.4, 1, 0.4] : 0
            }}
            transition={{ 
              scaleY: { duration: status === "completed" ? 0.5 : 2, repeat: status === "processing" ? Infinity : 0 },
              opacity: { duration: 2, repeat: status === "processing" ? Infinity : 0 }
            }}
            style={{ bottom: "-24px" }}
          />
        </>
      )}
      
      <motion.div 
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative flex items-start gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-500 z-10 ${getStatusColor()}`}
      >
        <div className={`mt-0.5 rounded-full p-2 border ${getIconColor()}`}>
          <Icon className="w-4 h-4" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold ${status === "idle" ? "text-slate-400" : "text-slate-800"}`}>
              {agent.label}
            </h3>
            <StatusIndicator status={status} />
          </div>
          <p className={`text-xs font-medium ${status === "idle" ? "text-slate-400" : "text-slate-500"}`}>{agent.description}</p>
        </div>
        
        {/* Glow effect for processing state */}
        {status === "processing" && (
          <motion.div 
            className="absolute inset-0 rounded-xl border-2 border-blue-400/30 pointer-events-none"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.div>
    </div>
  );
}

function StatusIndicator({ status }: { status: AgentStatus }) {
  if (status === "completed") {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-1.5 text-xs font-bold text-blue-600"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Done
      </motion.div>
    );
  }

  if (status === "processing") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-1.5 text-xs font-bold text-blue-500"
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        Active
      </motion.div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
      <CircleDashed className="w-3.5 h-3.5" />
      Waiting
    </div>
  );
}
