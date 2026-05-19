import { useState } from "react";
import { Sparkles, Activity } from "lucide-react";
import { BrandData } from "@/lib/types";

interface InputPanelProps {
  onGenerate: (data: BrandData) => void;
  isGenerating: boolean;
}

export default function InputPanel({ onGenerate, isGenerating }: InputPanelProps) {
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

  return (
    <div className="flex flex-col h-full p-8 text-slate-100">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
          <Activity className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">BrandForge</h1>
          <p className="text-xs text-blue-200/60 font-medium tracking-wide uppercase">Identity Engine</p>
        </div>
      </div>

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
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating || !formData.startupName || !formData.industry}
            className="w-full relative group overflow-hidden rounded-lg bg-blue-600 text-white font-medium py-3 px-4 transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-[1px]"
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
