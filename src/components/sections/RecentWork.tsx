"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Code2,
  Server,
  Headphones,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Plus,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DeviceMockup } from "@/components/ui/DeviceMockup";
import { projectsData, ProjectItem } from "@/data/projects";

export function RecentWork() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalProjects = projectsData.length;
  const activeProject: ProjectItem = projectsData[activeIndex];

  // DOM Refs
  const sectionRef = useRef<HTMLElement>(null);
  const headingLine1Ref = useRef<HTMLSpanElement>(null);
  const headingLine2Ref = useRef<HTMLSpanElement>(null);
  const headingItalicRef = useRef<HTMLSpanElement>(null);
  const introParagraphRef = useRef<HTMLParagraphElement>(null);
  const counterNumberRef = useRef<HTMLDivElement>(null);
  const projectTitleRef = useRef<HTMLHeadingElement>(null);
  const projectCategoryRef = useRef<HTMLDivElement>(null);
  const projectDescRef = useRef<HTMLParagraphElement>(null);
  const servicePillsRef = useRef<HTMLDivElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const deviceContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailsContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRailRef = useRef<HTMLDivElement>(null);

  // Transition and Gesture Refs
  const isTransitioningRef = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // ==========================================================
  // 1. Centralized Project Transition Engine (Section 33)
  // ==========================================================
  const changeProject = useCallback(
    (targetIndex: number, direction: "next" | "prev" = "next") => {
      // Prevent duplicate transition triggers / rapid click spamming
      if (isTransitioningRef.current || targetIndex === activeIndex) return;

      isTransitioningRef.current = true;

      // Check reduced motion preference
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        setActiveIndex(targetIndex);
        isTransitioningRef.current = false;
        return;
      }

      // Collect strictly what is changing:
      // Category tag, project title, narrative description, service pills, and counter number
      const changingElements = [
        projectCategoryRef.current,
        projectTitleRef.current,
        projectDescRef.current,
        servicePillsRef.current,
        counterNumberRef.current,
      ].filter(Boolean);

      // Phase 1: Clean fade out IN PLACE (no up/down movement, elements stay in place)
      gsap.to(changingElements, {
        opacity: 0,
        duration: 0.18,
        ease: "power2.inOut",
        onComplete: () => {
          // Switch state while elements are invisible
          setActiveIndex(targetIndex);

          // Phase 2: Fade in from left to right smoothly
          gsap.fromTo(
            changingElements,
            {
              opacity: 0,
              x: -16,
            },
            {
              opacity: 1,
              x: 0,
              duration: 0.32,
              stagger: 0.035,
              ease: "power2.out",
              clearProps: "transform",
              onComplete: () => {
                isTransitioningRef.current = false;
              },
            }
          );
        },
      });
    },
    [activeIndex]
  );

  const handlePrev = useCallback(() => {
    const nextIdx = activeIndex === 0 ? totalProjects - 1 : activeIndex - 1;
    changeProject(nextIdx, "prev");
  }, [activeIndex, totalProjects, changeProject]);

  const handleNext = useCallback(() => {
    const nextIdx = activeIndex === totalProjects - 1 ? 0 : activeIndex + 1;
    changeProject(nextIdx, "next");
  }, [activeIndex, totalProjects, changeProject]);

  // ==========================================================
  // 2. Scroll Active Thumbnail into View
  // ==========================================================
  useEffect(() => {
    if (thumbnailsContainerRef.current) {
      const activeEl = thumbnailsContainerRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeIndex]);

  // ==========================================================
  // 3. Page Load / Section Entrance Sequence (GSAP ScrollTrigger)
  // ==========================================================
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 78%",
          once: true,
        },
        defaults: { ease: "power3.out" },
      });

      // Line 1 heading reveal: "Websites"
      if (headingLine1Ref.current) {
        entranceTl.fromTo(
          headingLine1Ref.current,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.8 },
          0
        );
      }

      // Line 2 heading reveal: "Built for"
      if (headingLine2Ref.current) {
        entranceTl.fromTo(
          headingLine2Ref.current,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.8 },
          0.12
        );
      }

      // Italic accent delay reveal: "What's Next."
      if (headingItalicRef.current) {
        entranceTl.fromTo(
          headingItalicRef.current,
          { yPercent: 90, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.85 },
          0.24
        );
      }

      // Intro body paragraph
      if (introParagraphRef.current) {
        entranceTl.fromTo(
          introParagraphRef.current,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65 },
          0.3
        );
      }

      // Devices entrance from right / depth
      if (deviceContainerRef.current) {
        entranceTl.fromTo(
          deviceContainerRef.current,
          { x: 36, opacity: 0, scale: 0.97 },
          { x: 0, opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" },
          0.35
        );
      }

      // Bottom thumbnail carousel rail entrance
      if (thumbnailRailRef.current) {
        entranceTl.fromTo(
          thumbnailRailRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          0.5
        );
      }
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  // ==========================================================
  // 4. Keyboard Navigation (Section 28)
  // ==========================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isInViewport) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // ==========================================================
  // 5. Mobile Touch / Swipe Handling (Section 27)
  // ==========================================================
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Threshold ~48px and verify horizontal swipe intent to preserve vertical scroll
    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const getServiceIcon = (service: string) => {
    const s = service.toLowerCase();
    if (s.includes("design") || s.includes("layout")) return Monitor;
    if (s.includes("dev") || s.includes("gallery") || s.includes("funnel")) return Code2;
    if (s.includes("host")) return Server;
    if (s.includes("support")) return Headphones;
    if (s.includes("lead") || s.includes("seo") || s.includes("catalog")) return Sparkles;
    return ShieldCheck;
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative flex flex-col justify-between py-8 sm:py-12 lg:py-16 bg-[#E0FBFC] overflow-hidden"
    >
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-14 flex flex-col flex-grow justify-between">
        {/* ========================================================
            HEADER ROW: Section Title + Intro
           ======================================================== */}
        <div className="relative mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto text-center flex flex-col items-center">
          {/* Masked Line-by-Line Headline Reveal (Section 5) */}
          <h2 className="font-serif text-[34px] sm:text-[46px] lg:text-[54px] xl:text-[60px] leading-[1.04] text-[#293241] mb-3 tracking-tight text-center">
            <span className="block overflow-hidden pb-1">
              <span ref={headingLine1Ref} className="inline-block will-change-transform">
                Websites
              </span>
            </span>
            <span className="block overflow-hidden">
              <span ref={headingLine2Ref} className="inline-block will-change-transform">
                Built for{" "}
                <span
                  ref={headingItalicRef}
                  className="italic inline-block will-change-transform"
                >
                  What's Next.
                </span>
              </span>
            </span>
          </h2>

          <p
            ref={introParagraphRef}
            className="text-sm sm:text-base text-[#3D5A80] leading-[1.6] max-w-xl mx-auto text-center"
          >
            Every business has a different story. We design, develop, and host
            websites that bring those stories to life — and turn visitors into
            customers.
          </p>
        </div>

        {/* ========================================================
            MAIN SHOWCASE GRID:
            Left: Active Project Narrative & Controls (42%)
            Right: Large Dominant Device Showcase (58%)
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center mb-8 sm:mb-12">
          {/* LEFT COLUMN: Project Details & Navigation */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
            {/* Sliding Project Counter & Circular Arrow Controls (Section 13 & 21) */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#3D5A80]">
                <div className="relative h-5 w-6 overflow-hidden flex items-center justify-center">
                  <div
                    ref={counterNumberRef}
                    className="absolute inset-0 flex items-center justify-center will-change-transform"
                  >
                    {activeProject.number}
                  </div>
                </div>
                <span>/ 0{totalProjects}</span>
              </div>

              {/* Prev / Next Circular Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="group w-9 h-9 rounded-full border border-[#98C1D9] flex items-center justify-center text-[#293241] hover:bg-[#98C1D9]/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                </button>
                <button
                  onClick={handleNext}
                  className="group w-9 h-9 rounded-full bg-[#293241] text-[#E0FBFC] flex items-center justify-center hover:bg-[#3D5A80] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm"
                  aria-label="Next project"
                >
                  <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Dynamic Project Text Container */}
            <div className="flex flex-col">
              {/* Category & Location Tag */}
              <div
                ref={projectCategoryRef}
                className="text-[11px] sm:text-xs font-semibold tracking-[0.14em] text-[#3D5A80]/85 uppercase mb-1.5 will-change-transform"
              >
                {activeProject.categoryTag}
              </div>

              {/* Project Title (Section 22) */}
              <div className="min-h-[38px] sm:min-h-[48px] xl:min-h-[52px] flex items-center mb-3">
                <h3
                  ref={projectTitleRef}
                  className="font-serif text-[30px] sm:text-[38px] xl:text-[44px] text-[#293241] font-normal leading-[1.08] tracking-tight will-change-transform"
                >
                  {activeProject.name}
                </h3>
              </div>

              {/* Narrative Description */}
              <div className="min-h-[70px] sm:min-h-[76px] mb-5 max-w-md">
                <p
                  ref={projectDescRef}
                  className="text-[14px] sm:text-[15px] text-[#3D5A80] leading-[1.65] will-change-transform"
                >
                  {activeProject.description}
                </p>
              </div>

              {/* Staggered Service Feature Pills (Section 20) */}
              <div ref={servicePillsRef} className="flex flex-wrap gap-2 mb-6 sm:mb-8 min-h-[38px] will-change-transform">
                {activeProject.services.map((service) => {
                  const IconComponent = getServiceIcon(service);
                  return (
                    <div
                      key={service}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#98C1D9] bg-white/80 text-[#3D5A80] text-[11px] sm:text-[12px] font-medium shadow-[0_1px_2px_rgba(41,50,65,0.04)] hover:border-[#F7931E] transition-colors"
                    >
                      <IconComponent className="w-3.5 h-3.5 text-[#F7931E]" />
                      <span>{service}</span>
                    </div>
                  );
                })}
              </div>

              {/* Action CTAs (Section 14 & 15) */}
              <div ref={ctaContainerRef} className="flex items-center gap-4 sm:gap-6">
                {activeProject.liveUrl && activeProject.liveUrl.startsWith("http") ? (
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#293241] text-[#E0FBFC] text-xs sm:text-sm font-medium shadow-md hover:bg-[#3D5A80] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                  >
                    <span>View Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#293241] text-[#E0FBFC] text-xs sm:text-sm font-medium shadow-md hover:bg-[#3D5A80] hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                )}

                <button
                  onClick={handleNext}
                  className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#293241] hover:text-[#F7931E] transition-colors cursor-pointer py-2"
                >
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    Next Project
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Dominant Device Mockup Showcase (Section 7, 8, 9, 37) */}
          <div
            ref={deviceContainerRef}
            className="lg:col-span-7 order-1 lg:order-2 flex items-center justify-center w-full will-change-transform"
          >
            <DeviceMockup project={activeProject} />
          </div>
        </div>

        {/* ========================================================
            BOTTOM: HORIZONTAL PROJECT THUMBNAIL CAROUSEL (Section 11 & 36)
           ======================================================== */}
        <div
          ref={thumbnailRailRef}
          className="pt-4 pb-2 border-t border-[#98C1D9]/50"
        >
          <div
            ref={thumbnailsContainerRef}
            data-lenis-prevent
            className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-2 px-1 no-scrollbar"
          >
            {projectsData.map((project, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={project.id}
                  onClick={() => changeProject(idx, idx > activeIndex ? "next" : "prev")}
                  className={`group relative flex-shrink-0 w-[110px] sm:w-[135px] md:w-[150px] aspect-[16/10] rounded-lg overflow-hidden cursor-pointer transition-all duration-300 text-left ${
                    isActive
                      ? "ring-2 ring-[#293241] ring-offset-2 ring-offset-[#E0FBFC] shadow-md scale-105 opacity-100 z-10"
                      : "opacity-65 hover:opacity-100 hover:scale-103 border border-[#98C1D9]/80"
                  }`}
                  aria-label={`Select ${project.name}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={project.thumbnailImage}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="160px"
                    />
                  </div>
                  {/* Subtle Dark Vignette with Project Name */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2 flex items-end">
                    <span className="text-[10px] sm:text-[11px] font-medium text-white line-clamp-1 group-hover:text-[#E0FBFC]">
                      {project.name}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Special Final CTA Card: "Your Business Could Be Next" (Section 36) */}
            <a
              href="#contact"
              className="group flex-shrink-0 w-[110px] sm:w-[135px] md:w-[150px] aspect-[16/10] rounded-lg border-2 border-dashed border-[#F7931E]/80 hover:border-[#293241] bg-white/65 hover:bg-white p-2 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-103"
            >
              <div className="w-6 h-6 rounded-full bg-[#F7931E]/15 group-hover:bg-[#293241]/15 flex items-center justify-center text-[#F7931E] group-hover:text-[#293241] mb-1 transition-all duration-300">
                <Plus className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-serif text-[#293241] font-medium leading-tight transition-colors">
                Your Business
                <br />
                Could Be Next
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
