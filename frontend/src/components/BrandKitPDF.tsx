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
