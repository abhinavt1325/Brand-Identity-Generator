import { motion, AnimatePresence } from "framer-motion";
import { AgentsState, AppState, BrandData } from "@/app/page";
import { LayoutGrid, Type, Palette, MessageSquare, Target, ActivitySquare, CheckCircle, TrendingUp, Fingerprint } from "lucide-react";
import { MockData } from "@/lib/mockData";
import Typewriter from "./Typewriter";

interface OutputPanelProps {
  agents: AgentsState;
  appState: AppState;
  data: BrandData;
  mockOutput: MockData;
}

export default function OutputPanel({ agents, appState, data, mockOutput }: OutputPanelProps) {
  return (
    <div className="h-full p-10 overflow-y-auto z-10 relative">
      <div className="max-w-4xl mx-auto space-y-8 pb-32">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-slate-200 pb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
            {data.startupName || "Startup"}
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Brand Identity Protocol for <span className="text-blue-600">{data.industry || "Unknown"}</span>
          </p>
        </motion.div>

        {/* Live Feed Container */}
        <div className="flex flex-col gap-8">
          
          {/* Research Outputs */}
          <AnimatePresence>
            {agents.research === "completed" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl bg-white border border-slate-200/60 shadow-saas"
              >
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Market Intelligence</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Target Audience</h4>
                    <Typewriter text={mockOutput.research.audience} className="text-slate-700 leading-relaxed font-medium" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockOutput.research.competitors.map((comp, idx) => (
                      <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 mb-1">{comp.name}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{comp.analysis}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Market Trends
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {mockOutput.research.marketTrends.map((trend, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                          {trend}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Strategy Outputs */}
          <AnimatePresence>
            {agents.strategy === "completed" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl bg-white border border-slate-200/60 shadow-saas"
              >
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Brand Strategy</h3>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Core Positioning</h4>
                    <div className="text-xl font-semibold text-slate-800 leading-snug border-l-4 border-blue-500 pl-5 py-1">
                      <Typewriter text={mockOutput.strategy.positioning} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Brand Tone</h4>
                      <div className="text-slate-700 font-medium">{mockOutput.strategy.tone}</div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Mission Statement</h4>
                      <Typewriter text={mockOutput.strategy.mission} className="text-slate-600 text-sm leading-relaxed" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Design Outputs */}
          <AnimatePresence>
            {agents.design === "completed" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl bg-white border border-slate-200/60 shadow-saas"
              >
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Palette className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Design System</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Color Palette</h4>
                    <div className="flex flex-wrap gap-5">
                      {mockOutput.design.colorPalette.map((color, idx) => (
                        <div key={idx} className="flex flex-col gap-3">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="w-16 h-16 rounded-2xl shadow-md ring-1 ring-slate-900/5"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-700">{color.name}</div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">{color.hex}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Type className="w-4 h-4" /> Typography
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div className="text-xs font-semibold text-slate-400 mb-1">Display: {mockOutput.design.typography.heading}</div>
                          <div className="text-3xl font-bold text-slate-900 tracking-tight">Aa Bb Cc</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div className="text-xs font-semibold text-slate-400 mb-1">Body: {mockOutput.design.typography.body}</div>
                          <div className="text-base text-slate-700">Aa Bb Cc Dd Ee Ff Gg Hh Ii</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Fingerprint className="w-4 h-4" /> Logo Direction
                      </h4>
                      <Typewriter text={mockOutput.design.logoDirection} className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Copy Outputs */}
          <AnimatePresence>
            {agents.copy === "completed" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                
                <h4 className="text-sm font-bold text-blue-200 mb-4 uppercase tracking-wider">The Tagline</h4>
                <div className="text-4xl md:text-5xl font-bold text-white mb-10 tracking-tight drop-shadow-sm">
                  <Typewriter text={`"${mockOutput.copy.tagline}"`} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 bg-white/10 p-6 rounded-xl backdrop-blur-sm border border-white/10">
                  <div>
                    <h4 className="text-sm font-bold text-blue-200 mb-2 uppercase tracking-wider">Elevator Pitch</h4>
                    <Typewriter text={mockOutput.copy.elevatorPitch} className="text-blue-50 leading-relaxed text-sm font-medium" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-200 mb-2 uppercase tracking-wider">Brand Story</h4>
                    <Typewriter text={mockOutput.copy.story} className="text-blue-100 leading-relaxed text-sm" delay={0.03} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Coherence Outputs */}
          <AnimatePresence>
            {agents.coherence === "completed" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl bg-white border-2 border-blue-100 shadow-saas relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 pl-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <ActivitySquare className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">Coherence Verified</h3>
                    </div>
                    <Typewriter text={mockOutput.coherence.validationSummary} className="text-sm text-slate-600 mb-6 font-medium" />
                    
                    <div className="flex flex-wrap gap-4">
                      {mockOutput.coherence.alignmentMetrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-xs font-bold text-slate-700">{metric.label}: <span className="text-blue-600">{metric.value}%</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center md:text-right shrink-0 bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5, delay: 0.5 }}
                      className="text-6xl font-black text-blue-600 tracking-tighter"
                    >
                      {mockOutput.coherence.score}%
                    </motion.div>
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-2">Global Alignment</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
