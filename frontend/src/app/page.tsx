"use client";

import { useState, useRef } from "react";
import InputPanel from "@/components/InputPanel";
import PipelinePanel from "@/components/PipelinePanel";
import OutputPanel from "@/components/OutputPanel";
import { MockData } from "@/lib/mockData";


export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const { jobId } = await response.json();
      
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

      pollIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}`);
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
            
            const resultRes = await fetch(`http://localhost:3001/api/v1/jobs/${jobId}/result`);
            const resultData = await resultRes.json();
            setMockOutput(resultData.result);
            setAppState("done");
          } else if (job.status === "failed") {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setAppState("idle");
            alert("Generation failed: " + (job.error?.message || "Unknown error"));
          }
        } catch (e) {
          console.error("Polling error", e);
        }
      }, 1000);

    } catch (err) {
      console.error(err);
      setAppState("idle");
      alert("Failed to connect to backend on port 3001");
    }
  };

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Deep Market Research", desc: "Our research agent analyzes competitors and market positioning instantly." },
              { title: "Strategic Positioning", desc: "Develop compelling value propositions and core brand pillars." },
              { title: "Visual Identity Systems", desc: "Generate color palettes, typography pairs, and logo concepts." },
              { title: "Brand Voice & Messaging", desc: "Craft taglines, elevator pitches, and consistent brand tone." },
              { title: "Automated Coherence Check", desc: "The final agent ensures perfect alignment across all generated assets." },
              { title: "Export Ready Assets", desc: "Download your brand guidelines directly to PDF or Figma tokens." }
            ].map((feature, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                key={feature.title}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Start Building Your Brand</h2>
          <p className="text-blue-200 mb-10 text-lg max-w-2xl mx-auto">
            Join innovative startups using BrandForge to establish their market presence in record time.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-semibold hover:bg-slate-50 transition-colors shadow-xl"
          >
            Launch Prototype
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-100 text-center text-slate-500 text-sm">
        <p>© 2026 BrandForge. Prototype demo.</p>
      </footer>
    </main>
  );
}
