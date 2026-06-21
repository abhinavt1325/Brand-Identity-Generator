"use client";

import { motion } from "framer-motion";
import { X, Check, Shield, Zap, Sparkles, Building2 } from "lucide-react";
import { useEffect } from "react";

interface Plan {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  icon: any;
  color: string;
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onUpgrade: (planName: string) => void;
}

const plans: Plan[] = [
  {
    id: "Free Trial",
    name: "Free Trial",
    price: "FREE",
    description: "Ideal for trying out BrandForge's core capabilities.",
    features: [
      "1 brand generation",
      "4 agent execution",
      "Watermarked PDF downloads",
    ],
    icon: Sparkles,
    color: "from-blue-50 to-indigo-50 text-blue-600 border-blue-100",
  },
  {
    id: "Starter",
    name: "Starter",
    price: "$9",
    period: "/mo",
    description: "Perfect for early-stage founders and creators.",
    features: [
      "2 brand generations",
      "All agents included",
      "PDF + PNG high-res exports",
    ],
    icon: Zap,
    color: "from-cyan-50 to-blue-50 text-cyan-600 border-cyan-100",
  },
  {
    id: "Growth",
    name: "Growth",
    price: "$49",
    period: "/mo",
    description: "Best for growing businesses needing multiple iterations.",
    features: [
      "10 brand generations",
      "Access to all agents",
      "Premium exports (SVG, PDF, PNG)",
    ],
    icon: Shield,
    color: "from-violet-50 to-purple-50 text-violet-600 border-violet-100",
  },
  {
    id: "Enterprise",
    name: "Enterprise",
    price: "Custom",
    description: "For teams requiring scale, security, and integration.",
    features: [
      "Unlimited generations",
      "White-label support",
      "Dedicated API access",
    ],
    icon: Building2,
    color: "from-emerald-50 to-teal-50 text-emerald-600 border-emerald-100",
  },
];

export default function PricingModal({
  isOpen,
  onClose,
  currentPlan,
  onUpgrade,
}: PricingModalProps) {
  // Prevent scrolling behind modal when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
        className="relative w-full max-w-6xl max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xl text-slate-800 overflow-hidden z-10"
      >
        {/* Decorative subtle background gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-50 rounded-full blur-[100px] pointer-events-none opacity-60" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-50 rounded-full blur-[100px] pointer-events-none opacity-60" />

        {/* Modal Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 relative z-10 bg-white/50 backdrop-blur">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Business Model
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Select the optimal plan to scale your brand identity generation pipeline.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-800 transition-all text-slate-400 cursor-pointer shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable grid */}
        <div className="flex-1 overflow-y-auto px-8 py-8 relative z-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const isCurrent = currentPlan === plan.id;
              const Icon = plan.icon;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between p-6 rounded-2xl transition-all duration-300 bg-slate-50/40 border ${
                    isCurrent
                      ? "border-blue-600 bg-white shadow-[0_8px_30px_rgba(37,99,235,0.08)] ring-1 ring-blue-600/30"
                      : "border-slate-200/80 hover:border-slate-350 hover:bg-white hover:shadow-lg"
                  }`}
                >
                  {/* Highlight current plan badge */}
                  {isCurrent && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow-[0_2px_10px_rgba(37,99,235,0.3)]">
                      Current Plan
                    </span>
                  )}

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold tracking-wide text-slate-700">
                        {plan.name}
                      </span>
                      <div className={`p-2 rounded-lg bg-gradient-to-br border ${plan.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline mb-3">
                      <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-slate-500 text-xs ml-1 font-semibold">
                          {plan.period}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 mb-6 leading-relaxed">
                      {plan.description}
                    </p>

                    {/* Divider */}
                    <div className="h-[1px] bg-slate-100 mb-6" />

                    {/* Features */}
                    <ul className="space-y-3.5 mb-8">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-600 font-medium leading-normal">
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div>
                    {isCurrent ? (
                      <button
                        type="button"
                        disabled
                        className="w-full bg-slate-50 text-slate-400 border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide cursor-not-allowed transition-all"
                      >
                        Active Plan
                      </button>
                    ) : plan.id === "Enterprise" ? (
                      <button
                        type="button"
                        onClick={() => {
                          onUpgrade(plan.id);
                          onClose();
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md hover:shadow-lg hover:-translate-y-[1px] active:translate-y-[0px] py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer"
                      >
                        Contact Sales
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onUpgrade(plan.id);
                          onClose();
                        }}
                        className="w-full bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-900 border border-slate-200 hover:border-slate-350 hover:-translate-y-[1px] active:translate-y-[0px] py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-sm"
                      >
                        Upgrade Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 text-center relative z-10">
          <p className="text-[10px] text-slate-500 font-medium">
            Secure billing powered by BrandForge Finance. Need assistance?{" "}
            <a href="mailto:support@brandforge.com" className="text-blue-600 hover:underline">
              Contact our team
            </a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
