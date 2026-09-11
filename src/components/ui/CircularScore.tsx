"use client";

import React, { useEffect, useState } from "react";

interface CircularScoreProps {
  score: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  isFeatured?: boolean;
}

export function CircularScore({
  score,
  label,
  size = 120,
  strokeWidth = 8,
  isFeatured = false,
}: CircularScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = Math.max(1, Math.ceil(score / 30));
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [score]);

  // Brand Palette Tiers:
  // - 90-100: Olive Green (#2E7D32)
  // - 50-89: Brand Orange (#F7931E)
  // - 0-49: Brand Dusk Blue (#3D5A80)
  let color = "#3D5A80"; // Dusk Blue
  let trackColor = "#E0FBFC";
  let textColor = "text-[#3D5A80]";
  let bgBadge = "bg-[#98C1D9]/25 text-[#293241] border-[#98C1D9]";
  let statusText = "Needs Rebuild";

  if (score >= 90) {
    color = "#2E7D32"; // Olive Green
    trackColor = "#E4EFE6";
    textColor = "text-[#2E7D32]";
    bgBadge = "bg-[#EDF7EE] text-[#226327] border-[#CBE5CF]";
    statusText = "Fast & Healthy";
  } else if (score >= 50) {
    color = "#F7931E"; // Orange
    trackColor = "#E0FBFC";
    textColor = "text-[#F7931E]";
    bgBadge = "bg-[#F7931E]/15 text-[#293241] border-[#F7931E]/40";
    statusText = "Needs Work";
  }

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-[var(--radius-md)] border transition-all ${
        isFeatured
          ? "bg-white border-[#F7931E]/60 shadow-[0_4px_16px_rgba(247,147,30,0.15)] ring-1 ring-[#F7931E]/20"
          : "bg-white border-[#98C1D9]"
      }`}
    >
      {isFeatured && (
        <span className="text-[11px] uppercase tracking-[0.1em] font-semibold text-[#F7931E] mb-3 font-sans">
          Overall Health Score
        </span>
      )}

      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg] transform">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Score Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-serif ${
              isFeatured ? "text-[36px]" : "text-[30px]"
            } font-bold leading-none ${textColor}`}
          >
            {animatedScore}
          </span>
          <span className="text-[12px] text-[#3D5A80] font-mono mt-1">/100</span>
        </div>
      </div>

      {/* Label and Badge */}
      <div className="mt-4 text-center">
        <h4 className="text-[14px] font-semibold text-[#293241] tracking-[0.04em] uppercase font-sans">
          {label}
        </h4>
        <span
          className={`inline-block mt-2 text-[12px] font-medium px-3 py-0.5 rounded-[var(--radius-sm)] border ${bgBadge}`}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
}
