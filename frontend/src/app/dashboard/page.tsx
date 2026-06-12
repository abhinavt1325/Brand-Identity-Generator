"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputPanel from "@/components/InputPanel";
import PipelinePanel from "@/components/PipelinePanel";
import OutputPanel from "@/components/OutputPanel";
import { MockData } from "@/lib/mockData";
import { AppState, AgentsState, BrandData } from "@/lib/types";
import ExportButton from "@/components/ExportButton";
import { isAuthenticated, getAuthHeaders, logout } from "@/lib/auth";

/**
 * Maps the compact backend GenerateResult into the richer MockData shape
 * that OutputPanel / the UI cards expect.
 * Fields that the backend doesn't produce are synthesised from what it does return.
 */
function transformApiResult(raw: any): MockData {
  const r = raw?.research ?? {};
  const s = raw?.strategy ?? {};
  const d = raw?.design ?? {};
  const c = raw?.copy ?? {};
  const co = raw?.coherence ?? {};

  // --- Research ---
  const competitors: MockData["research"]["competitors"] = (r.competitors ?? []).map(
    (comp: { name: string; analysis: string }) => ({
      name: comp.name ?? "Competitor",
      // Split the single `analysis` string into strengths/weaknesses on a dash/semicolon
      strengths: comp.analysis?.split(/[;\-–]/)[0]?.trim() ?? comp.analysis ?? "",
      weaknesses: comp.analysis?.split(/[;\-–]/)[1]?.trim() ?? "Limited public information.",
    })
  );

  // Derive audiencePainPoints from the audience string (split on commas / periods if present)
  // so the UI always gets a non-empty array.
  const audience: string = r.audience ?? "";
  const painPointsFromAudience = audience
    .split(/[,.]/)                       // split on commas or periods
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 10);  // discard fragments that are too short
  const audiencePainPoints: string[] =
    painPointsFromAudience.length > 0
      ? painPointsFromAudience.slice(0, 4)
      : ["Finding the right solution for their needs", "Lack of quality options in the market"];

  // --- Strategy ---
  const tone: string = s.tone ?? "";
  const positioning: string = s.positioning ?? "";
  const mission: string = s.mission ?? "";
  // Derive brandPersonality from tone string words
  const brandPersonality: string[] = tone
    .split(/[,.\/&]/)
    .map((w: string) => w.trim())
    .filter((w: string) => w.length > 2)
    .slice(0, 5);

  // --- Design ---
  const colorPalette = d.colorPalette ?? [];
  const primaryPalette: MockData["design"]["primaryPalette"] = colorPalette.map(
    (col: { hex: string; name: string }) => ({
      hex: col.hex,
      name: col.name,
      usage: "Brand color",
    })
  );
  const typography = d.typography ?? { heading: "Inter", body: "Roboto" };

  // --- Coherence ---
  const alignmentMetrics: { label: string; value: number }[] = co.alignmentMetrics ?? [];
  const getMetric = (kw: string, fallback: number) =>
    alignmentMetrics.find((m: { label: string; value: number }) =>
      m.label.toLowerCase().includes(kw)
    )?.value ?? fallback;

  return {
    research: {
      competitors,
      audience,
      audiencePainPoints,
      marketTrends: r.marketTrends ?? [],
      marketPositioning: positioning || `Positioned within the ${audience} market segment.`,
    },
    strategy: {
      mission,
      vision: `A world powered by ${mission.split(" ").slice(0, 6).join(" ") || "innovation"}.`,
      brandPersonality: brandPersonality.length > 0 ? brandPersonality : ["Innovative", "Trusted", "Forward-thinking"],
      brandVoice: tone || "Professional and approachable.",
      positioningStatement: positioning || mission,
      messagingStrategy: `Lead with the value proposition. ${tone}`,
    },
    design: {
      primaryPalette,
      secondaryPalette: [],
      typography: {
        heading: typography.heading ?? "Inter",
        body: typography.body ?? "Roboto",
        accent: "JetBrains Mono",
        headingExample: `The Future of ${audience.split(" ").slice(0, 3).join(" ") || "Innovation"}`,
        bodyExample: mission || "Building something great.",
      },
      logoDirection: d.logoDirection ?? "A clean, modern wordmark with geometric accents.",
      visualLanguage: ["Clean layouts", "Bold typography", "Strategic use of color", "Modern aesthetic"],
      moodboard: `A modern visual identity combining ${colorPalette.map((c: { name: string }) => c.name).join(", ")} to create a professional and trustworthy brand presence.`,
    },
    copy: {
      tagline: c.tagline ?? "",
      elevatorPitch: c.elevatorPitch ?? "",
      brandStory: c.story ?? "",
      heroHeadline: c.tagline ?? "",
      heroSubheadline: c.elevatorPitch ?? "",
      marketingMessages: [c.tagline ?? "", c.elevatorPitch ?? ""].filter(Boolean),
      socialMediaTone: tone || "Engaging and professional.",
    },
    coherence: {
      score: co.score ?? 0,
      toneConsistency: getMetric("tone", co.score ?? 80),
      audienceAlignment: getMetric("audience", co.score ?? 80),
      visualConsistency: getMetric("visual", co.score ?? 80),
      messagingAlignment: getMetric("messag", co.score ?? 80),
      strategicConsistency: getMetric("strateg", co.score ?? 80),
      validationSummary: co.validationSummary ?? "Brand analysis complete.",
      recommendations: [],
    },
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
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

  const fetchSessions = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/v1/jobs", {
        headers: getAuthHeaders()
      });
      if (res.status === 401 || res.status === 403) {
        logout();
        router.push("/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      console.error("Failed to fetch sessions", e);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setIsAuthorized(true);
      fetchSessions();
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [router]);

  const startPolling = (jobId: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const statusRes = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}`, {
          headers: getAuthHeaders()
        });

        if (statusRes.status === 401 || statusRes.status === 403) {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          logout();
          router.push("/login");
          return;
        }

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
          
          const resultRes = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}/result`, {
            headers: getAuthHeaders()
          });

          if (resultRes.status === 401 || resultRes.status === 403) {
            logout();
            router.push("/login");
            return;
          }

          const resultData = await resultRes.json();
          setMockOutput(transformApiResult(resultData.result));
          setAppState("done");
          fetchSessions();
        } else if (job.status === "failed") {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setAppState("idle");
          alert("Generation failed: " + (job.error?.message || "Unknown error"));
          fetchSessions();
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 1000);
  };

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
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders()
        },
        body: JSON.stringify(data),
      });
      
      if (response.status === 401 || response.status === 403) {
        logout();
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to initialize job");
      }
      
      const { jobId } = await response.json();
      
      startPolling(jobId);
      fetchSessions();

    } catch (err) {
      console.error(err);
      setAppState("idle");
      alert("Failed to connect to backend or start job generation");
    }
  };

  const handleDeleteSession = async (jobId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        router.push("/login");
        return;
      }

      if (!res.ok) {
        alert("Failed to delete session.");
        return;
      }

      // Remove from local list immediately (optimistic update)
      setSessions((prev: any[]) => prev.filter((s) => s.jobId !== jobId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete session.");
    }
  };

  const handleSelectSession = async (jobId: string) => {
    try {
      const statusRes = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}`, {
        headers: getAuthHeaders()
      });

      if (statusRes.status === 401 || statusRes.status === 403) {
        logout();
        router.push("/login");
        return;
      }

      if (!statusRes.ok) {
        alert("Failed to load session details");
        return;
      }

      const job = await statusRes.json();

      // Clear previous output immediately so OutputPanel never renders with stale/undefined data
      setMockOutput(null);
      setBrandData(job.input ?? { startupName: "", industry: "", valueProp: "" });
      setAgents({
        research: job.stages?.research ?? "idle",
        strategy: job.stages?.strategy ?? "idle",
        design: job.stages?.design ?? "idle",
        copy: job.stages?.copy ?? "idle",
        coherence: job.stages?.coherence ?? "idle",
      });

      if (job.status === "completed") {
        setAppState("generating");
        const resultRes = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}/result`, {
          headers: getAuthHeaders()
        });

        if (resultRes.status === 401 || resultRes.status === 403) {
          logout();
          router.push("/login");
          return;
        }

        const resultData = await resultRes.json();
        setMockOutput(transformApiResult(resultData.result));
        setAppState("done");
      } else if (job.status === "failed") {
        setAppState("idle");
        setMockOutput(null);
        alert("This session failed: " + (job.error?.message || "Unknown error"));
      } else {
        setAppState("generating");
        setMockOutput(null);
        startPolling(jobId);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load past session");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Left Panel: Input */}
      <section className="w-1/4 h-full bg-slate-900 text-slate-50 flex-shrink-0 z-20 shadow-2xl relative overflow-y-auto">
        <InputPanel 
          onGenerate={handleGenerate} 
          isGenerating={appState === "generating"} 
          sessions={sessions}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
        />
      </section>

      {/* Center Panel: Pipeline */}
      <section className="w-1/3 h-full border-r border-slate-200 bg-white flex-shrink-0 relative overflow-y-auto z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <PipelinePanel agents={agents} appState={appState} />
      </section>

      {/* Right Panel: Output Feed */}
      <section className="flex-1 h-full bg-slate-50/50 relative overflow-y-auto scroll-smooth">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent pointer-events-none fixed" />
        {/* Export bar */}
        {appState === "done" && mockOutput && (
          <div className="sticky top-0 z-20 flex justify-end px-10 py-4 bg-white/80 backdrop-blur border-b border-slate-100">
            <ExportButton data={brandData} mock={mockOutput} />
          </div>
        )}
        {mockOutput && (
          <OutputPanel agents={agents} data={brandData} mockOutput={mockOutput} />
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
