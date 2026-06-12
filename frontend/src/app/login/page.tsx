"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, User } from "lucide-react";
import { setToken, setUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only animate after mount so SSR and initial client render are identical
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const url = mode === "login"
        ? "http://localhost:3001/api/v1/auth/login"
        : "http://localhost:3001/api/v1/auth/signup";

      const body = mode === "login"
        ? { username, password }
        : { username, email, password, confirmPassword };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "An authentication error occurred");
        setIsLoading(false);
        return;
      }

      // Save token and user details to local storage
      setToken(data.token);
      setUser(data.user);

      // Redirect to the workspace dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError("Unable to connect to the authentication server. Please ensure the backend is running.");
      setIsLoading(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "28rem",
    zIndex: 10,
    padding: "1rem",
    position: "relative",
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

      {/* Login / Signup Card */}
      <div style={cardStyle}>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 8px 40px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
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
              background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.4), rgba(255,255,255,0.1))",
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
              {mode === "login" ? "Welcome to BrandForge" : "Create Account"}
            </h1>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#64748b",
                marginTop: "0.5rem",
                textAlign: "center",
              }}
            >
              {mode === "login"
                ? "Sign in to your AI brand workspace"
                : "Register to build cohesive brand identities with AI"}
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div
              style={{
                background: "rgba(254, 242, 242, 0.8)",
                border: "1px solid rgba(254, 226, 226, 1)",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                marginBottom: "1.25rem",
                fontSize: "0.825rem",
                color: "#991b1b",
                lineHeight: "1.4",
                zIndex: 1,
                position: "relative",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: "0.375rem",
                }}
              >
                Username
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
                  <User style={{ height: "1.25rem", width: "1.25rem", color: "#94a3b8" }} />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="brandbuilder"
                  autoComplete="username"
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

            {/* Email Field (Signup Mode only) */}
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="email"
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
                    id="email"
                    type="email"
                    required={mode === "signup"}
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
            )}

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#374151",
                  marginBottom: "0.375rem",
                }}
              >
                {mode === "login" ? "Password" : "Create Password"}
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
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
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

            {/* Confirm Password Field (Signup Mode only) */}
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="confirm-password"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#374151",
                    marginBottom: "0.375rem",
                  }}
                >
                  Confirm Password
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
                    id="confirm-password"
                    type="password"
                    required={mode === "signup"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
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
            )}

            {/* Submit Button */}
            <div style={{ paddingTop: "0.5rem" }}>
              <button
                type="submit"
                disabled={isLoading || !username || !password || (mode === "signup" && (!email || !confirmPassword))}
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
                    isLoading || !username || !password || (mode === "signup" && (!email || !confirmPassword))
                      ? "#94a3b8"
                      : "#0f172a",
                  cursor:
                    isLoading || !username || !password || (mode === "signup" && (!email || !confirmPassword))
                      ? "not-allowed"
                      : "pointer",
                  transition: "background 0.2s",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && username && password && (mode === "login" || (email && confirmPassword))) {
                    (e.currentTarget as HTMLButtonElement).style.background = "#1e293b";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && username && password && (mode === "login" || (email && confirmPassword))) {
                    (e.currentTarget as HTMLButtonElement).style.background = "#0f172a";
                  }
                }}
              >
                {isLoading ? (
                  mode === "login" ? "Authenticating..." : "Creating Account..."
                ) : (
                  <>
                    {mode === "login" ? "Enter BrandForge" : "Register and Create"}
                    <ArrowRight style={{ width: "1rem", height: "1rem" }} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer toggle (Login / Signup switch) */}
          <div
            style={{
              marginTop: "1.75rem",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <button
              onClick={handleToggleMode}
              style={{
                background: "none",
                border: "none",
                fontSize: "0.825rem",
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: 500,
                textDecoration: "underline",
              }}
            >
              {mode === "login"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
