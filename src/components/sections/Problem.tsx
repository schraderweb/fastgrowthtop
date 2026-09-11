"use client";

import { ArrowDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const problems = [
  {
    number: "01",
    title: "Your website isn't getting calls.",
    description:
      "People visit, but don't take the next step. Your website might be confusing, slow, or simply not built to convert.",
  },
  {
    number: "02",
    title: "You're hard to find online.",
    description:
      "When people search for what you offer, your competitors show up before you do.",
  },
  {
    number: "03",
    title: "You're spending money without knowing what works.",
    description:
      "Ads, SEO, social media — you're investing, but don't have a clear picture of what's actually bringing in customers.",
  },
  {
    number: "04",
    title: "You're doing everything manually.",
    description:
      "Following up with leads, sending emails, managing tasks — it's slowing you down and taking time you don't have.",
  },
];

export function Problem() {
  const ref = useScrollReveal();

  return (
    <section id="problem" className="section-padding" ref={ref}>
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-14">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 mb-10 lg:mb-14">
          <div className="lg:col-span-7">
            <div className="reveal mb-4">
              <span className="label-eyebrow">The Problem</span>
            </div>
            <h2 className="reveal reveal-delay-1 text-section-heading">
              Something<br />
              isn't working.
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-8">
            <p className="reveal reveal-delay-2 text-body-large max-w-md">
              You know your business is great. But your website, marketing, or systems might be holding you back.
            </p>
          </div>
        </div>

        {/* Problem Cards — 2×2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-[#98C1D9]/40 rounded-[var(--radius-lg)] overflow-hidden mb-12 stagger-children">
          {problems.map((problem) => (
            <div
              key={problem.number}
              className="reveal bg-white p-8 lg:p-10 group"
            >
              {/* Number */}
              <span className="text-[12px] font-semibold text-[#3D5A80]/75 tracking-[0.14em] uppercase block mb-6">
                {problem.number}
              </span>

              {/* Title — serif for emotion */}
              <h3 className="font-serif text-[24px] lg:text-[28px] text-[#293241] leading-[1.15] mb-4">
                {problem.title}
              </h3>

              {/* Description — sans for information */}
              <p className="text-[15px] text-[#3D5A80] leading-[1.6]">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Transition */}
        <div className="reveal flex flex-col items-center text-center">
          <p className="font-serif text-[22px] text-[#293241] mb-3">
            That's where I come in.
          </p>
          <ArrowDown className="w-4 h-4 text-[#F7931E]" />
        </div>
      </div>
    </section>
  );
}
