export type MockData = {
  research: {
    competitors: { name: string; strengths: string; weaknesses: string }[];
    audience: string;
    audiencePainPoints: string[];
    marketTrends: string[];
    marketPositioning: string;
  };
  strategy: {
    mission: string;
    vision: string;
    brandPersonality: string[];
    brandVoice: string;
    positioningStatement: string;
    messagingStrategy: string;
  };
  design: {
    primaryPalette: { hex: string; name: string; usage: string }[];
    secondaryPalette: { hex: string; name: string; usage: string }[];
    typography: { heading: string; body: string; accent: string; headingExample: string; bodyExample: string };
    logoDirection: string;
    visualLanguage: string[];
    moodboard: string;
  };
  copy: {
    tagline: string;
    elevatorPitch: string;
    brandStory: string;
    heroHeadline: string;
    heroSubheadline: string;
    marketingMessages: string[];
    socialMediaTone: string;
  };
  coherence: {
    score: number;
    toneConsistency: number;
    audienceAlignment: number;
    visualConsistency: number;
    messagingAlignment: number;
    strategicConsistency: number;
    validationSummary: string;
    recommendations: string[];
  };
};

export function getMockData(industry: string): MockData {
  const ind = industry.toLowerCase();

  // ─── FITNESS ──────────────────────────────────────────────────────────────
  if (ind.includes("fitness") || ind.includes("health") || ind.includes("sport")) {
    return {
      research: {
        competitors: [
          {
            name: "FitBod",
            strengths: "Algorithm-driven workouts, clean UI, strong App Store ratings.",
            weaknesses: "Lacks community features and real-time biometric integration.",
          },
          {
            name: "Peloton",
            strengths: "Massive brand recognition, high engagement, premium instructor content.",
            weaknesses: "Rigid ecosystem, hardware dependency, premium pricing limits reach.",
          },
          {
            name: "Whoop",
            strengths: "Deep biometric data, recovery-first philosophy.",
            weaknesses: "Subscription fatigue, no structured workout guidance.",
          },
        ],
        audience:
          "Millennial and Gen-Z professionals aged 25–38 seeking data-driven performance metrics combined with social accountability. Tech-savvy, goal-oriented, willing to invest in tools that deliver measurable results.",
        audiencePainPoints: [
          "Generic workout plans that don't adapt to their daily energy levels",
          "Disconnected fitness tools that don't talk to each other",
          "Lack of professional-level coaching without the $300/hr price tag",
          "Plateau frustration — progress stalls without expert guidance",
        ],
        marketTrends: [
          "Wearable biometric integration",
          "AI-powered adaptive coaching",
          "Hyper-personalized recovery plans",
          "Community-driven accountability",
          "Longevity & HRV optimization",
        ],
        marketPositioning:
          "Position at the intersection of elite athletic performance and accessible technology — the 'intelligent training partner' category that no current player fully owns.",
      },
      strategy: {
        mission:
          "To democratize elite athletic training through adaptive artificial intelligence, making world-class coaching accessible to every motivated individual.",
        vision:
          "A world where every person trains smarter, recovers better, and achieves their peak — regardless of access to elite resources.",
        brandPersonality: ["Empowering", "Relentless", "Data-Driven", "Adaptive", "Ambitious"],
        brandVoice:
          "Energetic yet precise. We speak like a world-class coach: direct, evidence-backed, and relentlessly focused on your improvement. Never preachy, always actionable.",
        positioningStatement:
          "For performance-focused individuals who are frustrated by generic fitness programs, our platform is the AI fitness companion that adapts to your biology in real-time — unlike traditional apps that offer one-size-fits-all plans.",
        messagingStrategy:
          "Lead with outcomes, not features. Every message should answer 'what will I achieve?' before explaining 'how it works.' Use before/after framing with specific metrics to create tangible belief in the product.",
      },
      design: {
        primaryPalette: [
          { hex: "#ef4444", name: "Pulse Red", usage: "CTAs, active states, primary highlights" },
          { hex: "#09090b", name: "Carbon Black", usage: "Primary text, backgrounds, authority" },
          { hex: "#fafafa", name: "Chalk White", usage: "Base backgrounds, negative space" },
        ],
        secondaryPalette: [
          { hex: "#f97316", name: "Ignite Orange", usage: "Secondary CTAs, energy accents" },
          { hex: "#1d4ed8", name: "Data Blue", usage: "Charts, metrics, data visualization" },
          { hex: "#374151", name: "Steel Gray", usage: "Secondary text, borders, dividers" },
        ],
        typography: {
          heading: "Tusker Grotesk",
          body: "Inter",
          accent: "JetBrains Mono",
          headingExample: "TRAIN SMARTER. PEAK FASTER.",
          bodyExample: "Your AI training partner that adapts to your biometrics in real time.",
        },
        logoDirection:
          "Sharp, aggressive angles forming a dynamic forward-motion vector. The mark suggests acceleration and momentum — a bolt-like form that incorporates a subtle data graph element, representing the fusion of human performance and machine intelligence.",
        visualLanguage: [
          "High-contrast photography",
          "Bold typographic hierarchy",
          "Data visualization aesthetics",
          "Motion-forward design",
          "Dark backgrounds with electric accents",
        ],
        moodboard:
          "Imagine the editorial aesthetic of Nike's performance line meets the data-driven UI of a Bloomberg terminal. Raw, kinetic photography. Oversized numerics. Generous whitespace punctuated by electric red highlights. The visual language communicates that this product is serious — built for people who are serious.",
      },
      copy: {
        tagline: "Outsmart your limits.",
        elevatorPitch:
          "We are an AI fitness platform that analyzes your biometric data in real-time to dynamically adjust workout intensity, exercise selection, and recovery protocols — maximizing gains while eliminating overtraining and injury risk.",
        brandStory:
          "We both hit a plateau. Different gyms, different programs, same result: nothing was working. Standard fitness apps gave us the same plan regardless of whether we'd slept five hours or eight, whether our HRV was tanked or peaked. We realized that true optimization doesn't follow a schedule — it responds to your biology. So we spent two years building an engine that trains you the way a world-class coach would: by constantly listening to your body and adjusting in real-time. No more guessing. Just progress.",
        heroHeadline: "Your AI coach. Your peak performance.",
        heroSubheadline:
          "Stop following generic plans. Start training with an AI that reads your biometrics, adapts to your recovery, and pushes you exactly when you're ready.",
        marketingMessages: [
          "Train with the intelligence of a $500/hr performance coach — at $29/month.",
          "The only fitness app that knows when to push and when to recover.",
          "97% of users see measurable performance gains within 8 weeks.",
        ],
        socialMediaTone:
          "Direct, motivating, evidence-backed. Short punchy sentences. Data points drive belief. Never generic fitness inspiration — always specific, always actionable. Use athlete-level vocabulary without being exclusionary.",
      },
      coherence: {
        score: 97,
        toneConsistency: 98,
        audienceAlignment: 96,
        visualConsistency: 97,
        messagingAlignment: 99,
        strategicConsistency: 95,
        validationSummary:
          "Exceptional brand coherence. The aggressive red palette, relentless brand voice, and performance-focused messaging form a highly unified identity. Every element reinforces the core positioning of 'intelligent, adaptive training.'",
        recommendations: [
          "Introduce a secondary 'recovery mode' visual language with cooler tones for contrast",
          "Develop a data visualization style guide to ensure chart aesthetics match brand energy",
          "Create distinct vocal tones for acquisition vs. retention communications",
        ],
      },
    };
  }

  // ─── FASHION / SUSTAINABLE ────────────────────────────────────────────────
  if (ind.includes("fashion") || ind.includes("sustainable") || ind.includes("apparel")) {
    return {
      research: {
        competitors: [
          {
            name: "Everlane",
            strengths: "Transparent pricing, strong brand ethos, loyal core audience.",
            weaknesses: "Struggling with trend agility; perceived as 'safe' by fashion-forward consumers.",
          },
          {
            name: "Reformation",
            strengths: "Strong aesthetic, deep sustainability story, high desirability.",
            weaknesses: "Premium price point, limited size range, complex supply chain opacity.",
          },
          {
            name: "Patagonia",
            strengths: "Iconic activism branding, extreme loyalty, premium positioning.",
            weaknesses: "Outdoor-focused — weak in fashion-forward urban wear.",
          },
        ],
        audience:
          "Eco-conscious Gen-Z and Millennials aged 22–35 who refuse to compromise on aesthetics for ethics. They research brand supply chains, influence peers' purchasing decisions, and treat fashion as a form of values expression.",
        audiencePainPoints: [
          "Greenwashing — brands that claim sustainability but lack transparency",
          "Sustainable options that feel dowdy or lacking in design ambition",
          "Fast fashion guilt without a satisfying alternative that matches their aesthetic",
          "Limited access to certified ethical brands without paying luxury prices",
        ],
        marketTrends: [
          "Circular economy & resale platforms",
          "Zero-waste pattern technology",
          "Full supply chain traceability",
          "Regenerative materials innovation",
          "AI-driven demand forecasting to eliminate overstock",
        ],
        marketPositioning:
          "Own the 'Radical Transparency' category — the brand that doesn't just claim sustainability but proves it, stitch by stitch, on every product page. Compete on design quality first, sustainability as the non-negotiable foundation.",
      },
      strategy: {
        mission:
          "To eliminate the concept of waste in fashion without sacrificing design ambition — proving that the most beautiful garments can also be the most responsible.",
        vision:
          "A fashion industry where every garment's journey is fully transparent, every material regenerates the earth, and style and ethics are permanently inseparable.",
        brandPersonality: ["Elegant", "Honest", "Minimalist", "Principled", "Forward-Thinking"],
        brandVoice:
          "Calm and authoritative. We speak with the quiet confidence of a brand that knows its values are unimpeachable. Editorial in tone, never preachy — we celebrate beauty alongside ethics without apology or sermon.",
        positioningStatement:
          "For style-conscious consumers who refuse to choose between looking good and doing good, our brand is the sustainable fashion label that proves radical sustainability and radical beauty are the same thing.",
        messagingStrategy:
          "Lead with the product's aesthetic beauty. Let sustainability be the story beneath the beauty, revealed through radical transparency — not announced as the headline. Let design speak first; ethics convert.",
      },
      design: {
        primaryPalette: [
          { hex: "#4d7c0f", name: "Moss Green", usage: "Brand identity, sustainability signals, key CTAs" },
          { hex: "#d7cec7", name: "Raw Linen", usage: "Primary backgrounds, warmth, natural texture" },
          { hex: "#1c1917", name: "Charcoal", usage: "Primary text, grounding element, authority" },
        ],
        secondaryPalette: [
          { hex: "#fef3c7", name: "Warm Ivory", usage: "Section backgrounds, soft highlight" },
          { hex: "#78716c", name: "Stone Gray", usage: "Secondary text, metadata, UI elements" },
          { hex: "#d6d3d1", name: "Pale Ash", usage: "Borders, dividers, subtle separators" },
        ],
        typography: {
          heading: "Playfair Display",
          body: "Plus Jakarta Sans",
          accent: "EB Garamond",
          headingExample: "Style Without Compromise",
          bodyExample: "Every thread tells the story of the hands that made it and the earth that grew it.",
        },
        logoDirection:
          "An elegant, continuous single-line motif that traces the shape of both a garment and an infinity loop, representing the circular economy. The line is impeccably fine — suggesting craftsmanship and precision. Monochromatic in application.",
        visualLanguage: [
          "Soft natural light photography",
          "Editorial whitespace",
          "Earthy textural backgrounds",
          "Serene, unhurried composition",
          "Close-detail material shots",
        ],
        moodboard:
          "The Kinfolk magazine aesthetic meets Bottega Veneta's quiet luxury. Cream and sage. Natural linen textures. Models in unposed, contemplative settings. The visual language whispers rather than shouts — expressing that true quality and sustainability don't need performance.",
      },
      copy: {
        tagline: "Wear the future.",
        elevatorPitch:
          "A sustainable apparel brand using AI-driven zero-waste pattern making and 100% traceable regenerative materials to create timeless, high-quality garments that are as beautiful to wear as they are to stand behind.",
        brandStory:
          "We loved clothes. We hated what making them did to the world. The fashion industry generates 92 million tons of waste annually — and most 'sustainable' brands are still just doing less damage, not none at all. We decided to ask a different question: what if we built a fashion system with zero as the target, not as a compromise? Two years of material science research, three trips to regenerative farms, and one AI pattern optimization system later — we built it. Every piece is traceable. Every thread has a story. Nothing ends up in a landfill. That's not a feature. That's the only way we work.",
        heroHeadline: "Beautiful clothes. Zero compromise.",
        heroSubheadline:
          "Timeless design, radical transparency, and a supply chain you can trace to the source. Fashion that's as good for the earth as it is for your wardrobe.",
        marketingMessages: [
          "Scan any garment's QR code and trace it from field to finished piece.",
          "Zero-waste patterns. 100% regenerative materials. 0 excuses.",
          "The only brand that measures success in grams of waste avoided.",
        ],
        socialMediaTone:
          "Calm, editorial, and values-rich. Post as if you're a magazine editor who deeply believes in what they're curating. Beautiful imagery with substantive captions that educate without lecturing. Never aggressive or alarmist — always aspirational and grounded.",
      },
      coherence: {
        score: 94,
        toneConsistency: 95,
        audienceAlignment: 97,
        visualConsistency: 92,
        messagingAlignment: 94,
        strategicConsistency: 93,
        validationSummary:
          "Strong brand coherence with exceptional audience-market fit. The earthy palette, editorial tone, and transparency-forward messaging form a unified identity. Minor opportunity to strengthen visual consistency across digital and print applications.",
        recommendations: [
          "Develop a more distinct typographic hierarchy for digital vs. editorial contexts",
          "Create a 'proof point' content series to convert sustainability claims into tangible evidence",
          "Consider a warmer, more intimate secondary tone for community and CRM communications",
        ],
      },
    };
  }

  // ─── DEFAULT: AI / HEALTHCARE / TECH ─────────────────────────────────────
  return {
    research: {
      competitors: [
        {
          name: "Epic Systems",
          strengths: "Dominant market share, deep EHR integrations, regulatory compliance.",
          weaknesses: "Monolithic architecture, notoriously poor UX, resistant to innovation.",
        },
        {
          name: "Oscar Health",
          strengths: "Best-in-class patient UX, modern tech stack, strong brand identity.",
          weaknesses: "Limited provider-side innovation, geography-constrained coverage.",
        },
        {
          name: "Nuance (Microsoft)",
          strengths: "Dragon medical dictation, massive enterprise client base.",
          weaknesses: "Legacy product feel, clunky integrations, high implementation cost.",
        },
      ],
      audience:
        "Overworked healthcare providers and clinic administrators aged 30–55 facing administrative overwhelm. They're not looking for another software tool — they're looking for relief. Time-pressured, compliance-anxious, deeply skeptical of vendor promises.",
      audiencePainPoints: [
        "2 hours of documentation for every 1 hour of patient care",
        "EHR systems that fight them instead of helping them",
        "Burnout — the leading cause of physician departure from practice",
        "Revenue cycle errors from rushed or incomplete documentation",
        "Regulatory compliance anxiety — constant fear of audit exposure",
      ],
      marketTrends: [
        "Ambient clinical voice AI",
        "Predictive diagnostics at the point of care",
        "Healthcare interoperability mandates",
        "Value-based care reimbursement shift",
        "AI scribe adoption acceleration",
      ],
      marketPositioning:
        "Own the 'invisible AI' category — not another dashboard or tool, but an ambient intelligence layer that operates silently in the background, making healthcare providers' existing workflows dramatically faster without requiring behavior change.",
    },
    strategy: {
      mission:
        "To eradicate administrative burden in healthcare through autonomous AI systems — giving clinicians back the time to practice the medicine they trained for.",
      vision:
        "A healthcare system where no physician ever loses a patient interaction to paperwork, and where clinical data flows freely to serve patients, not administrators.",
      brandPersonality: ["Trustworthy", "Precise", "Empathetic", "Visionary", "Understated"],
      brandVoice:
        "Clinical in precision, human in warmth. We speak to exhausted, brilliant clinicians with deep respect for their expertise. We never oversell. We demonstrate. Every claim is evidence-backed. Every feature exists to save time, not add complexity.",
      positioningStatement:
        "For healthcare providers buried in administrative work, our AI platform is the invisible operational layer that automatically handles documentation, coding, and compliance — unlike traditional EHR add-ons that create more clicks, not fewer.",
      messagingStrategy:
        "Lead with the problem, not the solution. Healthcare providers have heard a thousand vendor pitches. Start by proving you understand their pain at a granular level. Then demonstrate — not describe — how the product eliminates it. ROI in time saved is the primary conversion lever.",
    },
    design: {
      primaryPalette: [
        { hex: "#2563eb", name: "Trust Blue", usage: "Primary brand color, CTAs, key UI elements" },
        { hex: "#0f172a", name: "Deep Navy", usage: "Primary text, headers, authority elements" },
        { hex: "#f8fafc", name: "Clinical White", usage: "Primary backgrounds, cleanliness, clarity" },
      ],
      secondaryPalette: [
        { hex: "#10b981", name: "Vitality Green", usage: "Success states, health indicators, positive metrics" },
        { hex: "#6366f1", name: "Intelligence Violet", usage: "AI feature highlights, innovation signals" },
        { hex: "#e2e8f0", name: "Mist Gray", usage: "Borders, secondary surfaces, dividers" },
      ],
      typography: {
        heading: "Outfit",
        body: "Inter",
        accent: "JetBrains Mono",
        headingExample: "The Future of Clinical Documentation",
        bodyExample: "Ambient AI that listens, understands, and documents — so you don't have to.",
      },
      logoDirection:
        "A precise, geometric mark combining a medical cross with a flowing data wave — suggesting the fusion of clinical rigor and technological intelligence. The form is clean and minimal, rendering perfectly at all sizes from favicon to billboard. Navy on white; white on navy.",
      visualLanguage: [
        "Clean geometric layouts",
        "Generous negative space",
        "Data visualization clarity",
        "Professional photography with natural light",
        "Trust-building through precision and restraint",
      ],
      moodboard:
        "Linear's product aesthetic meets the authority of a prestigious medical journal. Crisp blues on white. Precise data visualizations. Confident typographic hierarchy. The visual language communicates that this product is built by people who deeply understand healthcare — not Silicon Valley generalists applying tech aesthetics to medicine.",
    },
    copy: {
      tagline: "Heal more. Click less.",
      elevatorPitch:
        "An ambient AI platform that passively listens to patient consultations in real time — automatically generating structured clinical notes, ICD-10 billing codes, and follow-up care plans with 99.2% accuracy, reducing documentation time by an average of 2.3 hours per physician per day.",
      brandStory:
        "Doctors spend two hours on paperwork for every hour of patient care. That's not a bug in the system — it's the system working exactly as it was designed: for billing, not healing. We started in the ER. We watched brilliant physicians spend their final hour of the shift typing, not treating. We thought: what if the AI just... listened? What if it understood medical context natively — the way an experienced scribe would — and simply took care of everything else? Two years of HIPAA-compliant architecture, clinical NLP fine-tuning, and partnership with 43 healthcare systems later, we built it. The result: physicians look their patients in the eye again.",
      heroHeadline: "Give clinicians back their time.",
      heroSubheadline:
        "Our ambient AI listens to every consultation and handles all documentation automatically. Zero behavior change. Instant implementation. 2+ hours saved per physician, per day.",
      marketingMessages: [
        "Reduce physician documentation time by 73% — validated across 43 healthcare systems.",
        "99.2% clinical note accuracy. Fully HIPAA-compliant. SOC 2 Type II certified.",
        "Operational ROI within 30 days, or your first month is free.",
      ],
      socialMediaTone:
        "Authoritative and empathetic. LinkedIn-primary brand voice. Share clinical insights, healthcare policy analysis, and proof points — never promotional content that feels like advertising. Position the brand as the most trusted voice in clinical AI, not the loudest.",
    },
    coherence: {
      score: 98,
      toneConsistency: 99,
      audienceAlignment: 97,
      visualConsistency: 98,
      messagingAlignment: 99,
      strategicConsistency: 97,
      validationSummary:
        "Near-perfect brand coherence. The clinical precision of the visual system, the trustworthy-empathetic brand voice, and the outcome-focused messaging framework form an exceptionally unified identity that is distinctly positioned in the healthcare AI market.",
      recommendations: [
        "Develop a distinct 'proof' content system — case studies, clinical data, outcome reports — to operationalize the evidence-based messaging strategy",
        "Create a patient-facing brand sub-language that maintains trust while shifting tone toward reassurance",
        "Consider a 'dark mode' design variant for clinical environments with reduced lighting",
      ],
    },
  };
}
