"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, BrainCircuit, Target, Palette, PenTool, Layers } from "lucide-react";

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

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            BrandForge
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Animated Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>The Next Generation AI Branding Platform</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Forge your brand identity with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI precision.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
              Deploy a multi-agent AI pipeline to research, strategize, design, and write cohesive brand assets in minutes, not months.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <Link
                href="/login"
                className="group flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all hover:shadow-[0_0_24px_rgba(15,23,42,0.2)]"
              >
                Try Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-4 text-slate-600 font-medium hover:text-slate-900 transition-colors"
              >
                See how it works
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI Workflow Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">The Multi-Agent Pipeline</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Five specialized AI agents working in harmony to synthesize your brand.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {[
              { icon: BrainCircuit, label: "Research", color: "blue" },
              { icon: Target, label: "Strategy", color: "indigo" },
              { icon: Palette, label: "Design", color: "cyan" },
              { icon: PenTool, label: "Copy", color: "sky" },
              { icon: Layers, label: "Coherence", color: "blue" }
            ].map((step, i, arr) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                key={step.label} 
                className="flex items-center flex-col md:flex-row relative group"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-${step.color}-600 group-hover:border-${step.color}-300 group-hover:shadow-md transition-all duration-300 relative z-10`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <span className="mt-4 font-medium text-slate-700">{step.label}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-8 w-px md:w-16 md:h-px bg-slate-200 md:mx-4 my-2 md:my-0 md:-translate-y-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise-grade capabilities</h2>
            <p className="text-slate-500 max-w-2xl">Everything you need to launch a cohesive brand identity.</p>
          </div>

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
