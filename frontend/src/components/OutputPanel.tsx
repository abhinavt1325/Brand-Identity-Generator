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
