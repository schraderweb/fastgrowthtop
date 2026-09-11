"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

export function GoalBanner() {
  const ref = useScrollReveal();

  return (
    <section className="py-[24px] lg:py-[36px]" ref={ref}>
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-14">
        <div className="reveal flex items-center justify-center">
          {/* Content */}
          <div className="flex flex-col items-center text-center max-w-[620px] px-6">
            <h2 className="font-serif text-[22px] lg:text-[26px] text-[#293241] leading-[1.25] mb-3">
              The goal is simple: more customers and less stress.
            </h2>
            <p className="text-[16px] text-[#3D5A80] leading-[1.6]">
              I handle the digital. You focus on your business.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
