"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BrainCircuit,
  Target,
  Palette,
  PenTool,
  Layers,
} from "lucide-react";

const agentSteps = [
  { icon: BrainCircuit, label: "Research", iconColor: "#2563eb" },
  { icon: Target, label: "Strategy", iconColor: "#4f46e5" },
  { icon: Palette, label: "Design", iconColor: "#0891b2" },
  { icon: PenTool, label: "Copy", iconColor: "#0284c7" },
  { icon: Layers, label: "Coherence", iconColor: "#2563eb" },
];

const features = [
  {
    title: "Deep Market Research",
    desc: "Our research agent analyzes competitors and market positioning instantly.",
  },
  {
    title: "Strategic Positioning",
    desc: "Develop compelling value propositions and core brand pillars.",
  },
  {
    title: "Visual Identity Systems",
    desc: "Generate color palettes, typography pairs, and logo concepts.",
  },
  {
    title: "Brand Voice & Messaging",
    desc: "Craft taglines, elevator pitches, and consistent brand tone.",
  },
  {
    title: "Automated Coherence Check",
    desc: "The final agent ensures perfect alignment across all generated assets.",
  },
  {
    title: "Export Ready Assets",
    desc: "Download your brand guidelines directly to PDF or Figma tokens.",
  },
];

// Hook: returns true after component mounts, so animations only fire client-side
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

// Staggered fade-up helper
function fadeUp(
  mounted: boolean,
  delay: number = 0
): React.CSSProperties {
  return {
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
  };
}

export default function LandingPage() {
  const mounted = useMounted();

  return (
    <main
      suppressHydrationWarning
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        overflowX: "hidden",
        fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* ── Navigation ─────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 700,
              fontSize: "1.25rem",
              letterSpacing: "-0.025em",
              color: "#0f172a",
            }}
          >
            <div
              style={{
                height: "2rem",
                width: "2rem",
                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles style={{ width: "1rem", height: "1rem", color: "#fff" }} />
            </div>
            BrandForge
          </div>
          <Link
            href="/login"
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#475569",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "#0f172a")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "#475569")
            }
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: "9rem",
          paddingBottom: "6rem",
        }}
      >
        {/* Background blobs */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            className="animate-blob"
            style={{
              position: "absolute",
              top: "5%",
              left: "20%",
              width: "18rem",
              height: "18rem",
              background: "#93c5fd",
              borderRadius: "50%",
              filter: "blur(64px)",
              opacity: 0.25,
              mixBlendMode: "multiply",
            }}
          />
          <div
            className="animate-blob animation-delay-2000"
            style={{
              position: "absolute",
              top: "25%",
              right: "15%",
              width: "18rem",
              height: "18rem",
              background: "#67e8f9",
              borderRadius: "50%",
              filter: "blur(64px)",
              opacity: 0.25,
              mixBlendMode: "multiply",
            }}
          />
          <div
            className="animate-blob animation-delay-4000"
            style={{
              position: "absolute",
              bottom: "5%",
              left: "35%",
              width: "18rem",
              height: "18rem",
              background: "#a5b4fc",
              borderRadius: "50%",
              filter: "blur(64px)",
              opacity: 0.25,
              mixBlendMode: "multiply",
            }}
          />
        </div>

        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            position: "relative",
            zIndex: 10,
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "56rem",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Badge */}
            <div
              style={{
                ...fadeUp(mounted, 0),
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.375rem 1rem",
                borderRadius: "9999px",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                color: "#2563eb",
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: "2rem",
              }}
            >
              <Sparkles style={{ width: "1rem", height: "1rem" }} />
              <span>The Next Generation AI Branding Platform</span>
            </div>

            {/* H1 */}
            <h1
              style={{
                ...fadeUp(mounted, 0.1),
                fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                color: "#0f172a",
                marginBottom: "1.5rem",
                textWrap: "balance",
              }}
            >
              Forge your brand identity with{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI precision.
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                ...fadeUp(mounted, 0.2),
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                color: "#64748b",
                marginBottom: "2.5rem",
                maxWidth: "40rem",
                lineHeight: 1.7,
              }}
            >
              Deploy a multi-agent AI pipeline to research, strategize, design,
              and write cohesive brand assets in minutes, not months.
            </p>

            {/* CTA */}
            <div
              style={{
                ...fadeUp(mounted, 0.3),
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <Link
                href="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "1rem 2rem",
                  background: "#0f172a",
                  color: "#fff",
                  borderRadius: "9999px",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "#1e293b";
                  el.style.boxShadow = "0 8px 24px rgba(15,23,42,0.25)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "#0f172a";
                  el.style.boxShadow = "none";
                }}
              >
                Try Demo
                <ArrowRight style={{ width: "1rem", height: "1rem" }} />
              </Link>
              <Link
                href="#how-it-works"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "1rem 2rem",
                  color: "#475569",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#0f172a")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#475569")
                }
              >
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Workflow Section ──────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          paddingTop: "6rem",
          paddingBottom: "6rem",
          background: "#f8fafc",
          borderTop: "1px solid #f1f5f9",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "1.875rem",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#0f172a",
                marginBottom: "1rem",
              }}
            >
              The Multi-Agent Pipeline
            </h2>
            <p style={{ color: "#64748b", maxWidth: "36rem", margin: "0 auto" }}>
              Five specialized AI agents working in harmony to synthesize your
              brand.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "0",
            }}
          >
            {agentSteps.map((step, i) => (
              <div
                key={step.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  ...fadeUp(mounted, 0.1 + i * 0.1),
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: "4rem",
                      height: "4rem",
                      borderRadius: "1rem",
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: step.iconColor,
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.borderColor = "#bfdbfe";
                      el.style.boxShadow = "0 4px 12px rgba(37,99,235,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement;
                      el.style.borderColor = "#e2e8f0";
                      el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                    }}
                  >
                    <step.icon style={{ width: "2rem", height: "2rem" }} />
                  </div>
                  <span
                    style={{
                      marginTop: "1rem",
                      fontWeight: 500,
                      color: "#374151",
                      fontSize: "0.875rem",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                {i < agentSteps.length - 1 && (
                  <div
                    aria-hidden="true"
                    style={{
                      width: "3rem",
                      height: "1px",
                      background: "#e2e8f0",
                      margin: "0 0.5rem",
                      marginBottom: "1.5rem",
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────── */}
      <section style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "1.875rem",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "#0f172a",
                marginBottom: "1rem",
              }}
            >
              Enterprise-grade capabilities
            </h2>
            <p style={{ color: "#64748b", maxWidth: "36rem" }}>
              Everything you need to launch a cohesive brand identity.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {features.map((feature, i) => (
              <div
                key={feature.title}
                style={{
                  ...fadeUp(mounted, 0.05 + i * 0.08),
                  padding: "2rem",
                  borderRadius: "1.5rem",
                  background: "#f8fafc",
                  border: "1px solid #f1f5f9",
                  transition:
                    "background 0.2s, border-color 0.2s, box-shadow 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "#fff";
                  el.style.borderColor = "#bfdbfe";
                  el.style.boxShadow = "0 8px 30px rgba(0,0,0,0.05)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.background = "#f8fafc";
                  el.style.borderColor = "#f1f5f9";
                  el.style.boxShadow = "none";
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "#0f172a",
                    marginBottom: "0.75rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, fontSize: "0.9rem" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section
        style={{
          paddingTop: "6rem",
          paddingBottom: "6rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, background: "#0f172a" }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(37,99,235,0.3) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: "56rem",
            margin: "0 auto",
            padding: "0 1.5rem",
            position: "relative",
            zIndex: 10,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "1.5rem",
            }}
          >
            Start Building Your Brand
          </h2>
          <p
            style={{
              color: "#bfdbfe",
              fontSize: "1.125rem",
              maxWidth: "36rem",
              margin: "0 auto 2.5rem",
              lineHeight: 1.7,
            }}
          >
            Join innovative startups using BrandForge to establish their market
            presence in record time.
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 2rem",
              background: "#fff",
              color: "#0f172a",
              borderRadius: "9999px",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background = "#f1f5f9")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background = "#fff")
            }
          >
            Launch Prototype
            <ArrowRight style={{ width: "1rem", height: "1rem" }} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer
        style={{
          padding: "2rem 1.5rem",
          textAlign: "center",
          color: "#94a3b8",
          fontSize: "0.875rem",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <p>© 2026 BrandForge. Prototype demo.</p>
      </footer>
    </main>
  );
}
