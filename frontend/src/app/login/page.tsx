"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only animate after mount so SSR and initial client render are identical
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    }
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "28rem",
    zIndex: 10,
    padding: "1rem",
    position: "relative",
    // Animate in after mount
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? "translateY(0)" : "translateY(24px)",
    transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
  };

  return (
    <main
      suppressHydrationWarning
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* Animated Background Blobs */}
      <div
        style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <div
          className="animate-blob"
          style={{
            position: "absolute",
            top: "5%",
            left: "15%",
            width: "24rem",
            height: "24rem",
            background: "#bfdbfe",
            borderRadius: "50%",
            filter: "blur(64px)",
            opacity: 0.35,
            mixBlendMode: "multiply",
          }}
        />
        <div
          className="animate-blob animation-delay-2000"
          style={{
            position: "absolute",
            top: "30%",
            right: "10%",
            width: "24rem",
            height: "24rem",
            background: "#a5f3fc",
            borderRadius: "50%",
            filter: "blur(64px)",
            opacity: 0.35,
            mixBlendMode: "multiply",
          }}
        />
        <div
          className="animate-blob animation-delay-4000"
          style={{
            position: "absolute",
            bottom: "5%",
            left: "35%",
            width: "24rem",
            height: "24rem",
            background: "#c7d2fe",
            borderRadius: "50%",
            filter: "blur(64px)",
            opacity: 0.35,
            mixBlendMode: "multiply",
          }}
        />
      </div>

      {/* Login Card — CSS transition replaces framer-motion to avoid hydration mismatch */}
      <div style={cardStyle}>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow:
              "0 8px 40px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
            borderRadius: "1.5rem",
            padding: "2.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Shine overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
              pointerEvents: "none",
            }}
          />

          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                height: "3rem",
                width: "3rem",
                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                borderRadius: "0.875rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(37,99,235,0.3)",
                marginBottom: "1rem",
              }}
            >
              <Sparkles style={{ color: "white", width: "1.5rem", height: "1.5rem" }} />
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.025em",
                margin: 0,
                textAlign: "center",
              }}
            >
              Welcome to BrandForge
            </h1>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginTop: "0.5rem",
                textAlign: "center",
              }}
            >
              Sign in to your AI brand workspace
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Email Field */}
            <div>
              <label
                htmlFor="login-email"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: "0.375rem",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0.75rem",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Mail style={{ height: "1.25rem", width: "1.25rem", color: "#94a3b8" }} />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                  style={{
                    display: "block",
                    width: "100%",
                    paddingLeft: "2.75rem",
                    paddingRight: "0.75rem",
                    paddingTop: "0.625rem",
                    paddingBottom: "0.625rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.75rem",
                    background: "rgba(255,255,255,0.7)",
                    color: "#0f172a",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="login-password"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: "0.375rem",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0.75rem",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Lock style={{ height: "1.25rem", width: "1.25rem", color: "#94a3b8" }} />
                </div>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    display: "block",
                    width: "100%",
                    paddingLeft: "2.75rem",
                    paddingRight: "0.75rem",
                    paddingTop: "0.625rem",
                    paddingBottom: "0.625rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.75rem",
                    background: "rgba(255,255,255,0.7)",
                    color: "#0f172a",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ paddingTop: "0.5rem" }}>
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 1rem",
                  border: "none",
                  borderRadius: "0.875rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#ffffff",
                  background:
                    isLoading || !email || !password ? "#94a3b8" : "#0f172a",
                  cursor:
                    isLoading || !email || !password ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && email && password) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#1e293b";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && email && password) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#0f172a";
                  }
                }}
              >
                {isLoading ? (
                  "Authenticating..."
                ) : (
                  <>
                    Enter BrandForge
                    <ArrowRight style={{ width: "1rem", height: "1rem" }} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer hint */}
          <div
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              Mock login flow. Enter any credentials to continue.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
