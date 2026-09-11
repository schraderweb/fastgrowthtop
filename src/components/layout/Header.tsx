"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const navItems = [
  { label: "Audit", href: "#audit" },
  { label: "Work", href: "#work" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // 1. Throttled scroll position tracker for header blur/shadow (zero layout thrashing)
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 20;
        setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
        if (window.scrollY < 140) {
          setActiveSection("");
        }
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // 2. High-performance IntersectionObserver for active navigation section
    const sectionIds = ["audit", "work", "reviews", "contact"];
    const visibleEntries = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleEntries.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleEntries.delete(entry.target.id);
          }
        });

        if (window.scrollY < 140) {
          setActiveSection("");
          return;
        }

        // Determine the first active section in reading order
        for (const id of sectionIds) {
          if (visibleEntries.has(id)) {
            setActiveSection(id);
            break;
          }
        }
      },
      {
        rootMargin: "-80px 0px -45% 0px",
        threshold: [0, 0.15],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-[#E0FBFC]/90 backdrop-blur-[16px] shadow-sm border-b border-[#98C1D9]/50"
            : "bg-[#E0FBFC]"
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-14">
          <div className="flex items-center justify-between h-[72px] lg:h-[80px]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <span className="font-serif text-[22px] text-[#293241] tracking-tight transition-opacity group-hover:opacity-70">
                Schrader
              </span>
              <span className="text-[12px] text-[#3D5A80] font-medium tracking-[0.02em] hidden sm:block">
                Digital Marketing & Automation
              </span>
            </Link>

            {/* Desktop Nav with Glow Pill */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-[#98C1D9]/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#98C1D9]/70 shadow-[inset_0_1px_2px_rgba(41,50,65,0.03)]">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative px-4 py-1.5 rounded-full text-[12px] uppercase tracking-[0.08em] font-medium transition-all duration-300 ${
                      isActive
                        ? "text-[#293241] font-semibold bg-white/95 shadow-[0_0_16px_rgba(247,147,30,0.35),0_2px_8px_rgba(41,50,65,0.06)] border border-[#F7931E]/60"
                        : "text-[#3D5A80] hover:text-[#293241] hover:bg-white/50 border border-transparent"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <Link
              href="#contact"
              className={`hidden lg:flex btn-primary text-[13px] py-3 px-6 transition-all duration-300 ${
                activeSection === "contact"
                  ? "shadow-[0_0_20px_rgba(247,147,30,0.4)] border-[#F7931E]"
                  : ""
              }`}
            >
              Let's Talk
              <ArrowRight className="w-3.5 h-3.5 arrow-icon" />
            </Link>

            {/* Mobile burger */}
            <button
              className="lg:hidden relative w-8 h-8 flex items-center justify-center z-[110]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <div className="flex flex-col gap-[6px]">
                <span
                  className={`block w-6 h-[1.5px] bg-[#293241] rounded-full transition-all duration-300 ${
                    mobileOpen ? "rotate-45 translate-y-[7.5px]" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-[1.5px] bg-[#293241] rounded-full transition-all duration-300 ${
                    mobileOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-[1.5px] bg-[#293241] rounded-full transition-all duration-300 ${
                    mobileOpen ? "-rotate-45 -translate-y-[7.5px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-[90] bg-[#E0FBFC] transition-all duration-500 lg:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-start justify-center h-full px-10 gap-3">
          {navItems.map((item, i) => {
            const isActive = activeSection === item.href.replace("#", "");
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`font-serif text-[38px] transition-all duration-300 py-1.5 ${
                  isActive
                    ? "text-[#293241] font-medium translate-x-2"
                    : "text-[#3D5A80] hover:text-[#293241]"
                }`}
                style={{
                  transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms",
                }}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-8 pt-8 border-t border-[#98C1D9] w-full">
            <Link
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="btn-primary"
            >
              Let's Talk
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
