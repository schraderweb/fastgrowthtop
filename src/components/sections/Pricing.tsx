"use client";

import { useState } from "react";
import {
  Check,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type BillingCycle = "monthly" | "project";

interface Plan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  description: string;
  monthlyPrice: number;
  projectPrice: number;
  monthlyNote: string;
  projectNote: string;
  coreFeatures: string[];
  expandedFeatures: string[];
  highlightFeatures?: string[];
  ctaText: string;
  ctaHref: string;
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description:
      "A fast, modern digital presence engineered to establish credibility and convert local searchers into callers.",
    monthlyPrice: 199,
    projectPrice: 1800,
    monthlyNote: "Includes managed hosting, security & ongoing updates",
    projectNote: "One-time build & turnkey launch",
    coreFeatures: [
      "Custom 3–5 page high-speed Next.js website",
      "95+ Google PageSpeed & Core Web Vitals guarantee",
      "Mobile-first design built for smartphone callers",
      "Direct 1-on-1 developer collaboration & launch support",
    ],
    expandedFeatures: [
      "High-converting lead capture form & instant notifications",
      "Managed ultra-fast cloud hosting & SSL certificate",
      "Google Maps & local business profile integration",
      "On-page SEO fundamentals & clean semantic structure",
    ],
    ctaText: "Get Started with Starter",
    ctaHref: "#contact",
  },
  {
    id: "growth",
    name: "Growth Engine",
    badge: "Most Popular",
    isPopular: true,
    description:
      "The all-in-one growth system designed to rank in local search, capture high-intent leads, and boost revenue.",
    monthlyPrice: 399,
    projectPrice: 3400,
    monthlyNote: "Includes hosting, proactive SEO & monthly CRO updates",
    projectNote: "One-time build, full SEO launch & integrations",
    coreFeatures: [
      "Everything in Starter (turnkey high-speed website)",
      "Up to 8 custom high-converting service & local area pages",
      "Full Local SEO & Google Business Profile optimization",
      "Automated lead capture & instant SMS/Email alerts",
    ],
    expandedFeatures: [
      "Interactive booking forms & quote calculation funnels",
      "Automated 5-star Google review collection workflow",
      "Monthly conversion rate tuning & performance reports",
      "Priority 24-hour turnaround on edits & revisions",
    ],
    highlightFeatures: [
      "Full Local SEO & Google Business Profile optimization",
      "Automated lead capture & instant SMS/Email alerts",
      "Monthly conversion rate tuning & performance reports",
    ],
    ctaText: "Choose Growth Engine",
    ctaHref: "#contact",
  },
  {
    id: "scale",
    name: "Scale & Partner",
    badge: "Dedicated Partner",
    description:
      "For established businesses needing custom workflow automations, CRM integration, and a dedicated digital partner.",
    monthlyPrice: 699,
    projectPrice: 5900,
    monthlyNote: "Includes full digital management & ongoing optimization",
    projectNote: "One-time custom multi-system build & automations",
    coreFeatures: [
      "Everything in Growth Engine",
      "Custom multi-step quote engines & CRM integrations",
      "Advanced workflow automations (Zapier / Webhooks / Booking)",
      "Dedicated VIP communication channel & direct phone access",
    ],
    expandedFeatures: [
      "Multi-location or complex regional service architecture",
      "Quarterly competitor search benchmarking & SEO push",
      "Ongoing A/B testing on key conversion pathways",
      "Unlimited monthly updates, design tweaks & asset changes",
    ],
    ctaText: "Book Strategy Call",
    ctaHref: "#contact",
  },
];

const guarantees = [
  {
    icon: Zap,
    title: "95+ PageSpeed Guarantee",
    desc: "Blazing performance on mobile & desktop, optimized for maximum Google rankings.",
  },
  {
    icon: UserCheck,
    title: "Direct 1-on-1 Collaboration",
    desc: "You work directly with me from day one — zero account managers or junior handoffs.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent & Flexible",
    desc: "100% code ownership, clear milestone deliverables, and zero long-term lock-in.",
  },
];

export function Pricing() {
  const ref = useScrollReveal();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});

  const togglePlanExpansion = (planId: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  return (
    <section id="pricing" className="pt-4 pb-16 lg:pt-6 lg:pb-24 relative overflow-hidden" ref={ref}>
      {/* Subtle atmospheric accents matching the site's palette */}
      <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-[#98C1D9]/25 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-[5%] right-[-5%] w-[500px] h-[500px] bg-[#F7931E]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-14">
        {/* Section Header (clean center heading without small caps text) */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
          <h2 className="reveal text-section-heading mb-4">
            Simple, predictable plans for real business growth.
          </h2>

          <p className="reveal reveal-delay-1 text-body-large text-[#3D5A80] max-w-2xl mx-auto">
            Choose between a continuous growth partnership with managed hosting, updates, and SEO, or a turnkey one-time project build.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="reveal reveal-delay-2 mt-7 flex justify-center">
            <div className="inline-flex items-center p-1.5 rounded-full bg-white border border-[#98C1D9] shadow-sm">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`relative px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#293241] text-white shadow-sm"
                    : "text-[#3D5A80] hover:text-[#293241]"
                }`}
              >
                Monthly Partner
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("project")}
                className={`relative px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === "project"
                    ? "bg-[#293241] text-white shadow-sm"
                    : "text-[#3D5A80] hover:text-[#293241]"
                }`}
              >
                <span>One-Time Build</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F7931E]/15 text-[#F7931E]">
                  Turnkey
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 items-start mb-14 lg:mb-18">
          {plans.map((plan, index) => {
            const price =
              billingCycle === "monthly" ? plan.monthlyPrice : plan.projectPrice;
            const note =
              billingCycle === "monthly" ? plan.monthlyNote : plan.projectNote;
            const isExpanded = !!expandedPlans[plan.id];
            const totalFeaturesCount =
              plan.coreFeatures.length + plan.expandedFeatures.length;

            return (
              <div
                key={plan.id}
                className={`reveal reveal-delay-${(index % 3) + 1} flex flex-col h-full`}
              >
                <div
                  className={`card flex flex-col p-8 sm:p-9 relative rounded-[var(--radius-lg)] transition-all duration-300 ${
                    plan.isPopular
                      ? "bg-white border-2 border-[#F7931E] shadow-[0_12px_36px_rgba(247,147,30,0.14)] lg:-translate-y-1.5 hover:shadow-[0_16px_44px_rgba(247,147,30,0.2)]"
                      : "bg-white/95 border border-[#98C1D9] hover:border-[#293241]/50 shadow-[0_4px_24px_rgba(41,50,65,0.05)]"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 bg-[#F7931E] text-white text-[11px] font-bold uppercase tracking-[0.1em] px-3.5 py-1 rounded-full shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Card Top: Name & Desc */}
                  <div className="mb-6 pt-2">
                    <h3 className="font-serif text-[24px] lg:text-[26px] text-[#293241] font-medium mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-[14px] text-[#3D5A80] leading-[1.6]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="mb-6 pb-6 border-b border-[#98C1D9]/40">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[20px] font-medium text-[#3D5A80]">$</span>
                      <span className="font-serif text-[44px] lg:text-[48px] font-medium text-[#293241] tracking-tight leading-none">
                        {price.toLocaleString()}
                      </span>
                      <span className="text-[14px] font-medium text-[#3D5A80]/80">
                        {billingCycle === "monthly" ? "/month" : "one-time"}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#3D5A80]/75 mt-2.5 font-medium">
                      {note}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mb-7">
                    <a
                      href={plan.ctaHref}
                      className={
                        plan.isPopular
                          ? "btn-primary w-full justify-center text-[14px] py-3.5"
                          : "btn-secondary w-full justify-center text-[14px] py-3.5"
                      }
                    >
                      <span>{plan.ctaText}</span>
                      <ArrowRight className="w-4 h-4 arrow-icon" />
                    </a>
                  </div>

                  {/* Feature Checklist */}
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[12px] font-semibold text-[#293241]">
                        What&apos;s Included
                      </span>
                      <span className="text-[11px] text-[#3D5A80]/75">
                        {isExpanded
                          ? `Showing all ${totalFeaturesCount} perks`
                          : `Top ${plan.coreFeatures.length} of ${totalFeaturesCount} perks`}
                      </span>
                    </div>

                    {/* Core Features (Always Visible) */}
                    <ul className="flex flex-col gap-3">
                      {plan.coreFeatures.map((feature, fIdx) => {
                        const isHighlight =
                          plan.highlightFeatures &&
                          plan.highlightFeatures.includes(feature);

                        return (
                          <li key={fIdx} className="flex items-start gap-3">
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                plan.isPopular
                                  ? "bg-[#F7931E]/15 text-[#F7931E]"
                                  : "bg-[#98C1D9]/30 text-[#3D5A80]"
                              }`}
                            >
                              <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                            </div>
                            <span
                              className={`text-[13.5px] leading-[1.5] ${
                                isHighlight
                                  ? "font-medium text-[#293241]"
                                  : "text-[#3D5A80]"
                              }`}
                            >
                              {feature}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Expandable Additional Perks */}
                    {isExpanded && (
                      <div className="mt-4 pt-3.5 border-t border-[#98C1D9]/30">
                        <span className="text-[11px] font-semibold text-[#3D5A80] block mb-2.5">
                          Additional Perks:
                        </span>
                        <ul className="flex flex-col gap-3">
                          {plan.expandedFeatures.map((feature, eIdx) => {
                            const isHighlight =
                              plan.highlightFeatures &&
                              plan.highlightFeatures.includes(feature);

                            return (
                              <li key={eIdx} className="flex items-start gap-3">
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                    plan.isPopular
                                      ? "bg-[#F7931E]/15 text-[#F7931E]"
                                      : "bg-[#98C1D9]/30 text-[#3D5A80]"
                                  }`}
                                >
                                  <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                                </div>
                                <span
                                  className={`text-[13.5px] leading-[1.5] ${
                                    isHighlight
                                      ? "font-medium text-[#293241]"
                                      : "text-[#3D5A80]"
                                  }`}
                                >
                                  {feature}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Expand / Collapse Button */}
                    <div className="mt-5 pt-3 border-t border-[#98C1D9]/25">
                      <button
                        type="button"
                        onClick={() => togglePlanExpansion(plan.id)}
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#3D5A80] hover:text-[#293241] transition-colors cursor-pointer group"
                      >
                        <span>
                          {isExpanded
                            ? "Hide additional perks"
                            : `View all ${totalFeaturesCount} perks`}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5 text-[#F7931E]" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5 text-[#F7931E]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantees / Reassurance Row */}
        <div className="reveal bg-white/70 backdrop-blur-sm border border-[#98C1D9] rounded-[var(--radius-lg)] p-8 lg:p-10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guarantees.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[#E0FBFC] border border-[#98C1D9] flex items-center justify-center flex-shrink-0 text-[#293241]">
                    <Icon className="w-5 h-5 text-[#F7931E]" />
                  </div>
                  <div>
                    <h4 className="text-[15px] font-semibold text-[#293241] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[13.5px] text-[#3D5A80] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Scope Footer Note */}
        <div className="reveal text-center">
          <p className="text-[14px] text-[#3D5A80]">
            Looking for an e-commerce catalog, custom software integrations, or an enterprise multi-site migration?{" "}
            <a
              href="#contact"
              className="text-[#293241] font-semibold underline underline-offset-4 hover:text-[#F7931E] transition-colors"
            >
              Let&apos;s build a custom plan →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
