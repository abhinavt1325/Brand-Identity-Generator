export type MockData = {
  research: {
    competitors: { name: string; analysis: string }[];
    audience: string;
    marketTrends: string[];
  };
  strategy: {
    positioning: string;
    tone: string;
    mission: string;
  };
  design: {
    colorPalette: { hex: string; name: string }[];
    typography: { heading: string; body: string };
    logoDirection: string;
  };
  copy: {
    tagline: string;
    elevatorPitch: string;
    story: string;
  };
  coherence: {
    score: number;
    alignmentMetrics: { label: string; value: number }[];
    validationSummary: string;
  };
};

export function getMockData(industry: string): MockData {
  const ind = industry.toLowerCase();
  
  if (ind.includes("fitness")) {
    return {
      research: {
        competitors: [
          { name: "FitBod", analysis: "Algorithm-driven, but lacks community features." },
          { name: "Peloton", analysis: "High engagement, premium pricing, rigid ecosystem." }
        ],
        audience: "Millennial and Gen-Z professionals seeking data-driven performance metrics combined with social accountability.",
        marketTrends: ["Wearable integration", "AI coaching", "Hyper-personalized recovery plans"]
      },
      strategy: {
        positioning: "The intelligent fitness companion that adapts to your biology in real-time.",
        tone: "Energetic, Data-Driven, Empowering, Relentless.",
        mission: "To democratize elite athletic training through adaptive artificial intelligence."
      },
      design: {
        colorPalette: [
          { hex: "#ef4444", name: "Pulse Red" },
          { hex: "#09090b", name: "Carbon Black" },
          { hex: "#f4f4f5", name: "Chalk White" }
        ],
        typography: { heading: "Tusker Grotesk", body: "Inter" },
        logoDirection: "Sharp, aggressive angles forming a dynamic forward motion vector."
      },
      copy: {
        tagline: "Outsmart your limits.",
        elevatorPitch: "We are an AI fitness platform that analyzes your biometric data in real-time to adjust your workout intensity, maximizing gains while preventing injury.",
        story: "We hit a plateau. Standard programs couldn't account for daily fatigue, stress, or recovery. We realized that true optimization requires constant adaptation. That's why we built an engine that trains you the way a world-class coach would—by listening to your body."
      },
      coherence: {
        score: 97,
        alignmentMetrics: [
          { label: "Visual-Tone Synergy", value: 98 },
          { label: "Market Fit", value: 95 },
          { label: "Copy Effectiveness", value: 99 }
        ],
        validationSummary: "Strong cohesion between aggressive red color palette and empowering, relentless brand voice."
      }
    };
  }
  
  if (ind.includes("fashion") || ind.includes("sustainable")) {
    return {
      research: {
        competitors: [
          { name: "Everlane", analysis: "Transparent pricing, but struggling with trend agility." },
          { name: "Reformation", analysis: "Strong aesthetic, high price point, complex supply chain." }
        ],
        audience: "Eco-conscious Gen-Z and Millennials who refuse to compromise on aesthetics for ethics.",
        marketTrends: ["Circular economy", "Zero-waste patterns", "Supply chain traceability"]
      },
      strategy: {
        positioning: "Uncompromising style born from radical sustainability.",
        tone: "Elegant, Honest, Minimalist, Forward-Thinking.",
        mission: "To eliminate the concept of waste in the fashion industry without sacrificing design."
      },
      design: {
        colorPalette: [
          { hex: "#4d7c0f", name: "Moss Green" },
          { hex: "#d7cec7", name: "Raw Linen" },
          { hex: "#1c1917", name: "Charcoal" }
        ],
        typography: { heading: "Playfair Display", body: "Plus Jakarta Sans" },
        logoDirection: "An elegant, continuous line motif representing the circular economy."
      },
      copy: {
        tagline: "Wear the future.",
        elevatorPitch: "A sustainable apparel brand utilizing AI-driven zero-waste pattern making and 100% traceable regenerative materials to create timeless, high-quality garments.",
        story: "Fashion is the world's second most polluting industry. We loved clothes but hated the waste. By combining centuries-old craftsmanship with modern algorithmic pattern optimization, we've created a system where every thread serves a purpose. Beautiful clothes, zero guilt."
      },
      coherence: {
        score: 94,
        alignmentMetrics: [
          { label: "Visual-Tone Synergy", value: 92 },
          { label: "Market Fit", value: 97 },
          { label: "Copy Effectiveness", value: 94 }
        ],
        validationSummary: "Earthy color palette aligns perfectly with the 'honest' and 'minimalist' brand tone."
      }
    };
  }

  // Default to AI Healthcare / Tech
  return {
    research: {
      competitors: [
        { name: "Epic Systems", analysis: "Monopoly status, monolithic architecture, poor UX." },
        { name: "Oscar Health", analysis: "Great patient UX, limited provider-side innovation." }
      ],
      audience: "Overworked healthcare providers and clinic administrators needing workflow automation.",
      marketTrends: ["Ambient clinical voice", "Predictive diagnostics", "Interoperability"]
    },
    strategy: {
      positioning: "The invisible operational layer that lets doctors be doctors.",
      tone: "Clinical, Trustworthy, Clear, Visionary.",
      mission: "To eradicate administrative burden in healthcare through autonomous systems."
    },
    design: {
      colorPalette: [
        { hex: "#3b82f6", name: "Trust Blue" },
        { hex: "#10b981", name: "Vitality Green" },
        { hex: "#0f172a", name: "Deep Navy" }
      ],
      typography: { heading: "Outfit", body: "Inter" },
      logoDirection: "A precise, geometric cross merging into a data wave."
    },
    copy: {
      tagline: "Heal more. Click less.",
      elevatorPitch: "An ambient AI platform that passively listens to patient consultations, automatically generating structured clinical notes, billing codes, and follow-up plans with 99% accuracy.",
      story: "Doctors spend two hours on paperwork for every hour of patient care. It's a system designed for billing, not healing. We built an AI that understands medical context natively, silently operating in the background so clinicians can look their patients in the eye again."
    },
    coherence: {
      score: 98,
      alignmentMetrics: [
        { label: "Visual-Tone Synergy", value: 99 },
        { label: "Market Fit", value: 96 },
        { label: "Copy Effectiveness", value: 99 }
      ],
      validationSummary: "Highly coherent. 'Trust Blue' reinforces the clinical and secure tone required for healthcare SaaS."
    }
  };
}
