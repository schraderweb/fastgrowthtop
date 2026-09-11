"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ProjectItem } from "@/data/projects";

interface DeviceMockupProps {
  project: ProjectItem;
}

export function DeviceMockup({ project }: DeviceMockupProps) {
  // Dual-layer state for zero-flash screenshot transitions
  const [currentProject, setCurrentProject] = useState<ProjectItem>(project);
  const [prevProject, setPrevProject] = useState<ProjectItem | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Mouse Parallax Refs (Direct DOM manipulation for 60/120fps performance without re-renders)
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRectRef = useRef<DOMRect | null>(null);
  const laptopParallaxRef = useRef<HTMLDivElement>(null);
  const phoneParallaxRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const mouseAnimFrameRef = useRef<number | null>(null);

  // Current interpolated positions
  const targetLaptopPos = useRef({ x: 0, y: 0, r: 0 });
  const currentLaptopPos = useRef({ x: 0, y: 0, r: 0 });
  const targetPhonePos = useRef({ x: 0, y: 0, r: 0 });
  const currentPhonePos = useRef({ x: 0, y: 0, r: 0 });

  // Handle project change with cross-scaling
  useEffect(() => {
    if (project.id !== currentProject.id) {
      setPrevProject(currentProject);
      setCurrentProject(project);
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setPrevProject(null);
        setIsTransitioning(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [project, currentProject]);

  // Smooth lerp / requestAnimationFrame loop for device mouse parallax
  const updateParallax = useCallback(() => {
    const lerpFactor = 0.08;

    // Laptop lerp
    currentLaptopPos.current.x += (targetLaptopPos.current.x - currentLaptopPos.current.x) * lerpFactor;
    currentLaptopPos.current.y += (targetLaptopPos.current.y - currentLaptopPos.current.y) * lerpFactor;
    currentLaptopPos.current.r += (targetLaptopPos.current.r - currentLaptopPos.current.r) * lerpFactor;

    // Phone lerp (higher responsiveness/depth)
    currentPhonePos.current.x += (targetPhonePos.current.x - currentPhonePos.current.x) * (lerpFactor * 1.25);
    currentPhonePos.current.y += (targetPhonePos.current.y - currentPhonePos.current.y) * (lerpFactor * 1.25);
    currentPhonePos.current.r += (targetPhonePos.current.r - currentPhonePos.current.r) * (lerpFactor * 1.25);

    if (laptopParallaxRef.current) {
      laptopParallaxRef.current.style.transform = `translate3d(${currentLaptopPos.current.x.toFixed(2)}px, ${currentLaptopPos.current.y.toFixed(2)}px, 0) rotate(${currentLaptopPos.current.r.toFixed(2)}deg)`;
    }

    if (phoneParallaxRef.current) {
      phoneParallaxRef.current.style.transform = `translate3d(${currentPhonePos.current.x.toFixed(2)}px, ${currentPhonePos.current.y.toFixed(2)}px, 0) rotate(${currentPhonePos.current.r.toFixed(2)}deg)`;
    }

    // Continue loop if hovered or returning to origin
    const delta =
      Math.abs(targetLaptopPos.current.x - currentLaptopPos.current.x) +
      Math.abs(targetLaptopPos.current.y - currentLaptopPos.current.y) +
      Math.abs(targetPhonePos.current.x - currentPhonePos.current.x) +
      Math.abs(targetPhonePos.current.y - currentPhonePos.current.y);

    if (isHoveredRef.current || delta > 0.05) {
      mouseAnimFrameRef.current = requestAnimationFrame(updateParallax);
    } else {
      mouseAnimFrameRef.current = null;
    }
  }, []);

  const handleMouseEnter = () => {
    if (containerRef.current) {
      containerRectRef.current = containerRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if device supports hover/fine pointer
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    if (!containerRectRef.current && containerRef.current) {
      containerRectRef.current = containerRef.current.getBoundingClientRect();
    }
    const rect = containerRectRef.current;
    if (!rect) return;

    isHoveredRef.current = true;

    // Normalized from -1 to 1
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    // Laptop: gentle 6–8px movement, subtle 0.3deg rotation
    targetLaptopPos.current = {
      x: normX * 8,
      y: normY * 5,
      r: normX * 0.3,
    };

    // Phone: stronger 12–16px movement, 0.6deg rotation (creates 3D parallax depth)
    targetPhonePos.current = {
      x: normX * 14,
      y: normY * 9,
      r: normX * 0.6,
    };

    if (!mouseAnimFrameRef.current) {
      mouseAnimFrameRef.current = requestAnimationFrame(updateParallax);
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    containerRectRef.current = null;
    targetLaptopPos.current = { x: 0, y: 0, r: 0 };
    targetPhonePos.current = { x: 0, y: 0, r: 0 };

    if (!mouseAnimFrameRef.current) {
      mouseAnimFrameRef.current = requestAnimationFrame(updateParallax);
    }
  };

  useEffect(() => {
    return () => {
      if (mouseAnimFrameRef.current) {
        cancelAnimationFrame(mouseAnimFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[1040px] mx-auto select-none pt-2 pb-2 group"
    >
      {/* DEVICES STAGE: Laptop on left/center (dominant), Phone cleanly overlapping on the right */}
      <div className="relative flex items-end justify-between w-full">
        {/* ========================================================
            1. LAPTOP (MacBook Pro) — Scaled up dominant showcase
           ======================================================== */}
        <div className="relative w-[80%] sm:w-[82%] xl:w-[83%] z-10">
          {/* Mouse Parallax Wrapper */}
          <div ref={laptopParallaxRef} className="w-full will-change-transform">
            {/* Idle Floating Animation */}
            <div className="w-full animate-laptop-float">
              {/* Laptop Lid Screen Frame */}
              <div className="relative bg-[#1a1715] rounded-t-[18px] sm:rounded-t-[24px] p-[7px] sm:p-[12px] pb-0 border border-[#3e3833] shadow-[0_28px_60px_rgba(41,50,65,0.25)]">
                {/* Screen Top Camera Notch */}
                <div className="absolute top-[2px] sm:top-[4px] left-1/2 -translate-x-1/2 z-30 flex items-center justify-center w-24 sm:w-36 h-2.5 sm:h-4 bg-[#1a1715] rounded-b-md">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#0d0c0b] border border-[#2e2a27] flex items-center justify-center">
                    <div className="w-0.5 h-0.5 rounded-full bg-[#1b3a4b]/90" />
                  </div>
                </div>

                {/* Screen Display Area (16:10) with Overflow Hidden */}
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-[12px] sm:rounded-t-[16px] bg-[#1d1a18]">
                  {/* Background Layer (Previous Project during transition to prevent flashes) */}
                  {prevProject && (
                    <div className="absolute inset-0 z-0 animate-screen-exit pointer-events-none">
                      <Image
                        src={prevProject.desktopImage}
                        alt={`${prevProject.name} Desktop Website`}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 60vw, 780px"
                      />
                    </div>
                  )}

                  {/* Foreground Layer (Active Project Screenshot) */}
                  <div
                    key={`desktop-${currentProject.id}`}
                    className={`absolute inset-0 z-10 ${isTransitioning ? "animate-screen-enter" : ""}`}
                  >
                    <Image
                      src={currentProject.desktopImage}
                      alt={`${currentProject.name} Desktop Website`}
                      fill
                      priority
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 90vw, (max-width: 1200px) 60vw, 780px"
                    />

                    {/* In-screen Website Navigation Header Simulation */}
                    <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/85 via-black/50 to-transparent p-3 sm:p-4 text-white z-20 flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/80 flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-serif tracking-wider uppercase font-semibold text-white/95">
                          {currentProject.name}
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center gap-4 text-[10px] font-sans tracking-wide text-white/90">
                        <span>Services</span>
                        <span>Portfolio</span>
                        <span>About</span>
                        <span>Contact</span>
                        <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded text-[9px] font-medium border border-white/30 text-white">
                          Get a Quote
                        </span>
                      </div>
                    </div>

                    {/* Realistic Specular Glass Sheen */}
                    <div
                      className="absolute inset-0 pointer-events-none z-20"
                      style={{
                        background:
                          "linear-gradient(125deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 38%, transparent 62%)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Laptop Aluminum Base & Hinge */}
              <div className="relative w-[105%] -left-[2.5%] z-20">
                {/* Keyboard Deck Top Lip */}
                <div className="h-[10px] sm:h-[14px] bg-gradient-to-r from-[#2c2825] via-[#4a443f] to-[#2c2825] rounded-b-[4px] border-t border-[#5c544d] flex items-start justify-center shadow-md">
                  {/* Center Thumb Notch */}
                  <div className="w-16 sm:w-24 h-[3px] sm:h-[4px] bg-[#181615] rounded-b-md" />
                </div>

                {/* Bottom Footpad Shadow */}
                <div className="h-[3px] sm:h-[5px] bg-gradient-to-r from-transparent via-[#181615]/80 to-transparent w-[96%] mx-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. MOBILE (iPhone) — Sits in foreground (higher z-index),
               overlapping the laptop base cleanly on the right
           ======================================================== */}
        <div className="relative w-[23%] sm:w-[22%] max-w-[215px] sm:max-w-[230px] min-w-[110px] z-30 -ml-[4.5%] sm:-ml-[5%] mb-[2px] sm:mb-[4px]">
          {/* Mouse Parallax Wrapper */}
          <div ref={phoneParallaxRef} className="w-full will-change-transform">
            {/* Idle Floating Animation (offset timing) */}
            <div className="w-full animate-phone-float">
              {/* iPhone Chassis */}
              <div className="relative bg-[#191716] p-[5px] sm:p-[7px] pb-[6px] rounded-[26px] sm:rounded-[40px] border-[2.5px] sm:border-[4.5px] border-[#38332f] shadow-[0_28px_50px_rgba(41,50,65,0.38),0_10px_20px_rgba(0,0,0,0.3)]">
                {/* Dynamic Island */}
                <div className="absolute top-[7px] sm:top-[11px] left-1/2 -translate-x-1/2 z-30 w-11 sm:w-16 h-2.5 sm:h-3.5 bg-black rounded-full flex items-center justify-end pr-1 sm:pr-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1b3a4b]/80" />
                </div>

                {/* iPhone Display */}
                <div className="relative w-full aspect-[9/19] overflow-hidden rounded-[20px] sm:rounded-[32px] bg-[#1d1a18]">
                  {/* Background Layer (Previous Project) */}
                  {prevProject && (
                    <div className="absolute inset-0 z-0 animate-screen-exit pointer-events-none">
                      <Image
                        src={prevProject.mobileImage}
                        alt={`${prevProject.name} Mobile Website`}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 35vw, 200px"
                      />
                    </div>
                  )}

                  {/* Foreground Layer (Active Project) */}
                  <div
                    key={`mobile-${currentProject.id}`}
                    className={`absolute inset-0 z-10 ${isTransitioning ? "animate-screen-enter" : ""}`}
                  >
                    <Image
                      src={currentProject.mobileImage}
                      alt={`${currentProject.name} Mobile Website`}
                      fill
                      priority
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 35vw, 200px"
                    />

                    {/* Mobile Header Bar Overlay */}
                    <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/85 to-transparent p-2.5 sm:p-3 pt-5 text-white z-20 flex items-center justify-between pointer-events-none">
                      <span className="text-[8px] sm:text-[10px] font-serif font-semibold tracking-wider uppercase truncate max-w-[70px]">
                        {currentProject.name}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="w-3 sm:w-4 h-[1px] bg-white rounded-full" />
                        <span className="w-3 sm:w-4 h-[1px] bg-white rounded-full" />
                      </div>
                    </div>

                    {/* Mobile Specular Glass Reflection */}
                    <div
                      className="absolute inset-0 pointer-events-none z-20"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 46%)",
                      }}
                    />
                  </div>
                </div>

                {/* Home Bar Indicator */}
                <div className="absolute bottom-[5px] sm:bottom-[7px] left-1/2 -translate-x-1/2 w-12 sm:w-16 h-[2.5px] bg-white/45 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ambient grounding shadow below devices */}
      <div className="relative -mt-1 sm:-mt-2 w-[90%] mx-auto pointer-events-none">
        <div className="h-4 sm:h-6 bg-[#293241]/15 blur-xl rounded-full" />
      </div>
    </div>
  );
}
