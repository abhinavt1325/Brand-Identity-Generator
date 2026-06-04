"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { MockData } from "@/lib/mockData";
import { BrandData } from "@/lib/types";
import { generateBrandKitPDF } from "@/lib/generatePDF";

interface ExportButtonProps {
  data: BrandData;
  mock: MockData;
}

export default function ExportButton({ data, mock }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await generateBrandKitPDF(data, mock);
    } catch (e) {
      console.error("PDF export failed", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF…</>
      ) : (
        <><Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Export Brand Kit PDF</>
      )}
    </button>
  );
}
