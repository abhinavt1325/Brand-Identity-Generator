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
