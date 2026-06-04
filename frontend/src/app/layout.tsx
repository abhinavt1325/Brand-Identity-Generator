import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Brand Identity Generator | AI SaaS",
  description: "Generate a complete startup brand identity using a multi-agent AI workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-slate-50 text-slate-900 min-h-screen font-sans selection:bg-blue-500/30">
        {children}
      </body>
    </html>
  );
}
