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
