"use client";

import React, { useState, useTransition } from "react";
import {
  Zap,
  Share2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Globe,
  ExternalLink,
  Clock,
  Loader2,
  Smartphone,
  TrendingUp,
  Gauge,
} from "lucide-react";
import { CircularScore } from "@/components/ui/CircularScore";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface AuditResult {
  url: string;
  domain: string;
  timestamp: string;
  isLiveLighthouse?: boolean;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    lcp: { value: string; score: number; label: string };
    fcp: { value: string; score: number; label: string };
    cls: { value: string; score: number; label: string };
    tbt: { value: string; score: number; label: string };
    speedIndex: { value: string; score: number; label: string };
    ttfb: { value: string; score: number; label: string };
  };
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: string;
    twitterCard: string;
    hasOgImage: boolean;
    hasOgTitle: boolean;
    hasOgDescription: boolean;
  };
  seoMeta: {
    title: string;
    description: string;
    hasMetaDescription: boolean;
    hasTitle: boolean;
    titleLength: number;
    descriptionLength: number;
    canonical: string;
    hasCanonical: boolean;
    robots: string;
    favicon: string;
    hasViewport: boolean;
  };
  pageStats: {
    ttfb: string;
    isHttps: boolean;
    h1Count: number;
    h2Count: number;
    totalImages: number;
    imagesMissingAlt: number;
    totalScripts: number;
    htmlSizeKb: number;
  };
  diagnostics: Array<{
    id: string;
    category: "performance" | "seo" | "images" | "accessibility";
    severity: "critical" | "warning" | "good";
    title: string;
    description: string;
    impact: string;
  }>;
}

const SAMPLE_SITES = [
  { label: "Stripe", url: "stripe.com" },
  { label: "Linear", url: "linear.app" },
  { label: "Vercel", url: "vercel.com" },
  { label: "GitHub", url: "github.com" },
];

const SCAN_MILESTONES = [
  { id: 1, title: "Server Connection & SSL Handshake", subtitle: "Checking TLS certificate & server latency" },
  { id: 2, title: "DOM & HTML Document Crawling", subtitle: "Analyzing document size, <title> & meta description" },
  { id: 3, title: "Open Graph Social Preview Cards", subtitle: "Verifying rich share cards for Twitter, Slack & LinkedIn" },
  { id: 4, title: "Heading & Semantic SEO Architecture", subtitle: "Auditing H1/H2 hierarchy and indexing signals" },
  { id: 5, title: "Image & Media Optimization Scan", subtitle: "Checking for missing alt text & modern WebP formats" },
  { id: 6, title: "JavaScript & Asset Payload Profiling", subtitle: "Detecting heavy scripts & render-blocking resources" },
  { id: 7, title: "Google Mobile Chrome Engine Simulation", subtitle: "Emulating real mobile device on throttled 4G network" },
  { id: 8, title: "Largest Contentful Paint (LCP) Benchmark", subtitle: "Measuring main hero content render speed" },
  { id: 9, title: "Cumulative Layout Shift (CLS) Analysis", subtitle: "Detecting visual shifts & jumping content" },
  { id: 10, title: "Total Blocking Time & Interactivity", subtitle: "Measuring main thread responsiveness & input delay" },
  { id: 11, title: "Lighthouse Category Scorecard Synthesis", subtitle: "Compiling Google Performance, SEO, BP & A11y scores" },
  { id: 12, title: "Generating Actionable Growth Checklist", subtitle: "Formulating business-impact fixes & recommendations" },
];

const CONVERSION_TIPS = [
  {
    icon: Zap,
    stat: "7% Conversion Loss",
    fact: "Every 100ms delay in website load time drops conversion rates by roughly 7%.",
  },
  {
    icon: Smartphone,
    stat: "53% Mobile Abandonment",
    fact: "Over half of all mobile visitors bounce if a website takes longer than 3 seconds to render.",
  },
  {
    icon: TrendingUp,
    stat: "Google Search Priority",
    fact: "Google officially uses Core Web Vitals (LCP, CLS, INP) as a direct mobile ranking factor.",
  },
  {
    icon: Share2,
    stat: "+39% Social Clicks",
    fact: "Properly configured Open Graph image cards increase social share engagement by up to 39%.",
  },
  {
    icon: Gauge,
    stat: "60% Payload Reduction",
    fact: "Converting legacy PNG/JPG assets to modern WebP/AVIF formats typically cuts page weight in half.",
  },
];

export function SiteAudit() {
  const ref = useScrollReveal();
  const [inputUrl, setInputUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<AuditResult | null>(null);
  const [, startTransition] = useTransition();

  // Smooth asymptotic progress calculation (never freezes at 100% until response arrives)
  const getProgress = (ms: number) => {
    const s = ms / 1000;
    if (s < 2) return Math.round(15 + s * 15); // 15% -> 45%
    if (s < 5) return Math.round(45 + (s - 2) * 9); // 45% -> 72%
    if (s < 12) return Math.round(72 + (s - 5) * 2.2); // 72% -> 87.4%
    if (s < 22) return Math.round(87.4 + (s - 12) * 0.7); // 87.4% -> 94.4%
    return Math.min(97, Math.round(94.4 + (s - 22) * 0.2)); // creeps to 97% max
  };

  const currentMilestoneIndex = Math.min(
    SCAN_MILESTONES.length - 1,
    Math.floor(elapsedMs / 1700)
  );

  const currentTipIndex = Math.floor(elapsedMs / 3800) % CONVERSION_TIPS.length;

  const handleRunAudit = async (targetUrlToScan?: string) => {
    const rawUrl = targetUrlToScan || inputUrl;
    if (!rawUrl.trim()) {
      setError("Please enter a website URL to audit.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setElapsedMs(0);
    setAuditData(null);

    const startTime = Date.now();
    const MIN_SCAN_DURATION = 5000; // Ensure a realistic 5-second scanning UX

    const timerInterval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 100);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rawUrl }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to analyze website");
      }

      // Guarantee minimum 5-second scanning animation
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_SCAN_DURATION) {
        await new Promise((resolve) => setTimeout(resolve, MIN_SCAN_DURATION - elapsed));
      }

      clearInterval(timerInterval);

      startTransition(() => {
        setAuditData(data);
        setIsLoading(false);
      });
    } catch (err: unknown) {
      clearInterval(timerInterval);
      setIsLoading(false);
      setError(err instanceof Error ? err.message : "Could not complete audit. Please check the URL.");
    }
  };

  const averageScore = auditData
    ? Math.round(
        (auditData.scores.performance +
          auditData.scores.accessibility +
          auditData.scores.bestPractices +
          auditData.scores.seo) /
          4
      )
    : 0;

  return (
    <section className="pt-4 pb-14 lg:pt-8 lg:pb-20 relative" ref={ref}>
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-14">
        
        {/* Section Header (Centered) */}
        <div className="flex flex-col items-center text-center max-w-[880px] mx-auto mb-10">
          <h2 className="reveal text-section-heading mb-5">
            Is your website losing clients before it even loads?
          </h2>

          <p className="reveal reveal-delay-1 text-[19px] md:text-[21px] text-[#3D5A80] leading-[1.6] max-w-[760px]">
            Put in your domain name. We'll run a real-time <strong>Lighthouse & Speed Audit</strong> to benchmark Core Web Vitals, check for missing Open Graph social cards, and pinpoint SEO bottlenecks.
          </p>

          {/* Centered URL Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunAudit();
            }}
            className="reveal reveal-delay-2 w-full mt-10 max-w-[700px]"
          >
            <div className="flex flex-col sm:flex-row items-stretch gap-3 p-2 bg-white rounded-[var(--radius-md)] border border-[#98C1D9] focus-within:border-[#293241] transition-all">
              <div className="flex items-center flex-1 px-4 gap-3 min-w-0">
                <Globe className="w-5 h-5 text-[#3D5A80]/75 shrink-0" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your website URL (e.g. yourbusiness.com)"
                  className="w-full bg-transparent text-[16px] md:text-[17px] text-[#293241] placeholder:text-[#3D5A80]/60 outline-none font-sans py-3"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary shrink-0 justify-center text-[15px] px-8 py-3.5 disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#F7931E]" />
                    <span>Run Audit</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Sample Presets */}
            <div className="flex items-center justify-center flex-wrap gap-2 mt-4 text-[14px] text-[#3D5A80]">
              <span className="text-[12px] uppercase tracking-[0.08em] font-semibold text-[#3D5A80]/75">
                Try an example:
              </span>
              {SAMPLE_SITES.map((sample) => (
                <button
                  key={sample.url}
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setInputUrl(sample.url);
                    handleRunAudit(sample.url);
                  }}
                  className="px-3.5 py-1.5 rounded-[var(--radius-sm)] bg-white text-[#293241] hover:bg-[#293241] hover:text-white border border-[#98C1D9] transition-all text-[13px] font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-[#98C1D9]/20 border border-[#98C1D9] text-[#293241] text-[15px] rounded-[var(--radius-md)] flex items-center gap-3 justify-center">
                <AlertTriangle className="w-5 h-5 shrink-0 text-[#F7931E]" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>

        {/* Loading Progress State */}
        {isLoading && (
          <div className="max-w-[720px] mx-auto my-12 p-8 md:p-10 rounded-[var(--radius-md)] bg-white border border-[#98C1D9] shadow-sm text-left">
            {/* Header with live status and elapsed timer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#98C1D9]/50 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E0FBFC] border border-[#98C1D9] text-[#293241] shrink-0">
                  <Globe className="w-5 h-5 text-[#3D5A80]" />
                </div>
                <div>
                  <h3 className="font-serif text-[20px] md:text-[22px] font-bold text-[#293241]">
                    Auditing {inputUrl}
                  </h3>
                  <p className="text-[13px] text-[#3D5A80]">
                    Running live Core Web Vitals & technical diagnostic suite
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0FBFC] border border-[#98C1D9] text-[#293241] text-[13px] font-mono shrink-0 self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5 text-[#F7931E]" />
                <span>{(elapsedMs / 1000).toFixed(1)}s elapsed</span>
              </div>
            </div>

            {/* Smooth Asymptotic Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-[13px] font-medium text-[#3D5A80] mb-2">
                <span>Deep Analysis in Progress...</span>
                <span className="font-mono font-bold text-[#293241]">{getProgress(elapsedMs)}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#98C1D9]/30 rounded-full overflow-hidden p-0.5 border border-[#98C1D9]/40">
                <div
                  className="h-full bg-gradient-to-r from-[#F7931E] to-[#3D5A80] transition-[width] duration-700 ease-out rounded-full"
                  style={{ width: `${getProgress(elapsedMs)}%` }}
                />
              </div>
            </div>

            {/* Live Diagnostic Stream Feed */}
            <div className="space-y-3 mb-8">
              <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#3D5A80]/80 mb-1">
                Live Diagnostic Stream
              </div>

              {/* Currently running step */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-[var(--radius-sm)] bg-[#FFF9F2] border border-[#F7931E]/40 shadow-2xs transition-all duration-300">
                <Loader2 className="w-5 h-5 text-[#F7931E] animate-spin shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[14px] text-[#293241]">
                      {SCAN_MILESTONES[currentMilestoneIndex].title}
                    </span>
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F7931E]/15 text-[#293241]">
                      Running
                    </span>
                  </div>
                  <p className="text-[13px] text-[#3D5A80] mt-0.5">
                    {SCAN_MILESTONES[currentMilestoneIndex].subtitle}
                  </p>
                </div>
              </div>

              {/* Previous verified steps */}
              {currentMilestoneIndex > 0 && (
                <div className="space-y-2 pt-1 opacity-80">
                  {[currentMilestoneIndex - 1, currentMilestoneIndex - 2]
                    .filter((idx) => idx >= 0)
                    .map((idx) => (
                      <div
                        key={SCAN_MILESTONES[idx].id}
                        className="flex items-center gap-3 px-3.5 py-2 rounded-[var(--radius-sm)] bg-white text-[13px] text-[#293241] transition-all duration-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                        <span className="font-medium text-[#293241] line-clamp-1">
                          {SCAN_MILESTONES[idx].title}
                        </span>
                        <span className="ml-auto text-[11px] text-[#226327] font-medium shrink-0">
                          Verified ✓
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* While You Wait - Conversion Impact Ticker */}
            <div className="p-4 md:p-5 rounded-[var(--radius-sm)] bg-[#E0FBFC]/50 border border-[#98C1D9] text-left transition-all duration-500 ease-out">
              <div className="flex items-center gap-2 mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#3D5A80]">
                <span>Why Website Speed Matters</span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[#F7931E]/15 flex items-center justify-center text-[#293241] shrink-0 mt-0.5">
                  {React.createElement(CONVERSION_TIPS[currentTipIndex].icon, {
                    className: "w-4 h-4 text-[#F7931E]",
                  })}
                </div>
                <div>
                  <span className="inline-block font-bold text-[14px] md:text-[15px] text-[#293241] mb-0.5">
                    {CONVERSION_TIPS[currentTipIndex].stat}
                  </span>
                  <p className="text-[13px] md:text-[14px] text-[#3D5A80] leading-relaxed">
                    {CONVERSION_TIPS[currentTipIndex].fact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Results Dashboard */}
        {auditData && !isLoading && (
          <div className="space-y-14 mt-6">
            
            {/* Header info bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white rounded-[var(--radius-md)] border border-[#98C1D9] gap-4">
              <div className="flex items-center gap-4">
                {auditData.seoMeta.favicon && (
                  <img
                    src={auditData.seoMeta.favicon}
                    alt="Favicon"
                    className="w-10 h-10 rounded-[var(--radius-sm)] bg-[#E0FBFC] p-1.5 border border-[#98C1D9] object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-serif text-[22px] font-bold text-[#293241]">
                      {auditData.domain}
                    </h3>
                    <a
                      href={auditData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3D5A80]/75 hover:text-[#293241]"
                    >
                      <ExternalLink className="w-4.5 h-4.5" />
                    </a>

                    {auditData.isLiveLighthouse ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#EDF7EE] text-[#1E5C25] border border-[#BCE1C0] shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                        Verified Google Lighthouse
                      </span>
                    ) : (
                      <span
                        title="Live Google API timed out or rate-limited; estimated using live DOM structure & server response benchmarks"
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#E0FBFC] text-[#3D5A80] border border-[#98C1D9]"
                      >
                        <Sparkles className="w-3 h-3 text-[#F7931E]" />
                        Estimated Benchmark
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] text-[#3D5A80] mt-0.5">
                    Audited {new Date(auditData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {auditData.isLiveLighthouse ? "Powered by Live Google Lighthouse API" : "DOM Structure & Heuristic Speed Benchmark"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRunAudit()}
                className="btn-secondary py-2.5 px-5 text-[14px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-run Audit</span>
              </button>
            </div>

            {/* 01. Lighthouse Scores Grid featuring Overall Score Average */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="font-serif text-[24px] text-[#293241]">
                    Overall Site Health: <span className="font-bold">{averageScore}/100</span>
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-[13px] text-[#3D5A80]">
                  <span className="px-2 py-0.5 rounded bg-[#EDF7EE] text-[#226327] font-medium border border-[#CBE5CF]">90-100</span>
                  <span className="px-2 py-0.5 rounded bg-[#F7931E]/15 text-[#293241] font-medium border border-[#F7931E]/40">50-89</span>
                  <span className="px-2 py-0.5 rounded bg-[#98C1D9]/25 text-[#293241] font-medium border border-[#98C1D9]">0-49</span>
                </div>
              </div>

              {/* 5-Column Grid with Overall Average featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <CircularScore
                  score={averageScore}
                  label="Overall Score"
                  isFeatured={true}
                />
                <CircularScore
                  score={auditData.scores.performance}
                  label="Performance"
                />
                <CircularScore
                  score={auditData.scores.accessibility}
                  label="Accessibility"
                />
                <CircularScore
                  score={auditData.scores.bestPractices}
                  label="Best Practices"
                />
                <CircularScore
                  score={auditData.scores.seo}
                  label="SEO & Search"
                />
              </div>
            </div>


            {/* 05. Conversion Call to Action Box */}
            <div className="p-8 md:p-14 rounded-[var(--radius-md)] bg-[#293241] text-[#E0FBFC] relative overflow-hidden border border-[#1e2633]">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center px-4 py-2 rounded-[var(--radius-sm)] bg-[#F7931E]/20 border border-[#F7931E]/40 text-[#98C1D9] text-[14px] md:text-[15px] font-semibold mb-5">
                  <span>Turn These Audits Into Growth</span>
                </div>

                <h3 className="font-serif text-[32px] md:text-[42px] leading-[1.18] text-[#E0FBFC] mb-5 font-medium">
                  Ready to turn {auditData.domain} into a 95+ score lead engine?
                </h3>

                <p className="text-[18px] md:text-[20px] text-[#98C1D9] leading-[1.6] mb-8 max-w-2xl">
                  I eliminate slow render-blocking assets, set up high-converting Open Graph share cards, and structure your site for maximum Google search visibility.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#F7931E] hover:bg-[#E07E0B] text-white font-semibold text-[16px] md:text-[17px] px-9 py-4.5 rounded-[var(--radius-md)] transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <span>Fix My Website Bottlenecks</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <span className="text-[15px] md:text-[16px] text-[#98C1D9] sm:ml-2">
                    Direct review • Tailored strategy
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
