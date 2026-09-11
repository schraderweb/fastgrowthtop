"use client";

import { Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCarousel } from "@/hooks/useCarousel";
import { useEffect, useState } from "react";

const reviews = [
  {
    name: "Sarah M.",
    business: "Local Boutique",
    rating: 5,
    text: "Working with Schrader completely transformed our online presence. Our website finally brings in real leads and our phone actually rings now. Couldn't be happier.",
  },
  {
    name: "James T.",
    business: "Construction Company",
    rating: 5,
    text: "Straightforward, no jargon, just results. They redesigned our website and set up automations that save us hours every week. Highly recommend.",
  },
  {
    name: "Emily R.",
    business: "Health & Wellness",
    rating: 5,
    text: "Finally a web person who actually listens. The new site is beautiful, loads fast, and we've seen a noticeable increase in bookings since launch.",
  },
  {
    name: "Mike D.",
    business: "Real Estate",
    rating: 5,
    text: "I was spending money on ads with no idea what was working. They built us a system where we can actually see our ROI. Game changer.",
  },
  {
    name: "Lisa K.",
    business: "Restaurant Group",
    rating: 5,
    text: "Professional, responsive, and truly cares about results. Our Google visibility has improved dramatically since we started working together.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "fill-[#F7931E] text-[#F7931E]" : "text-[#98C1D9]"}`}
        />
      ))}
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function Reviews() {
  const ref = useScrollReveal();
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    currentIndex,
    currentPage,
    totalPages,
    canGoPrev,
    canGoNext,
    next,
    prev,
    goToPage,
    containerRef,
    handlers,
  } = useCarousel({
    totalItems: reviews.length,
    itemsPerView,
    gap: 20,
  });

  const cardWidthPercent = 100 / itemsPerView;
  const translateX = -(currentIndex * cardWidthPercent);

  return (
    <section id="reviews" className="section-padding" ref={ref}>
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-14">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 lg:mb-16">
          <div>

            <div className="reveal mb-3">
              <span className="label-eyebrow text-[#3D5A80]">Client Reviews</span>
            </div>
            <h2 className="reveal reveal-delay-1 text-section-heading mb-4">
              What my clients say.
            </h2>
            <p className="reveal reveal-delay-2 text-body-large max-w-md">
              Real feedback from real businesses. I'm proud of the results we've achieved together.
            </p>
          </div>

          {/* Google Rating Badge */}
          <div className="reveal bg-white border border-[#98C1D9]/60 rounded-[var(--radius-lg)] px-6 py-4 flex items-center gap-4">
            <GoogleLogo />
            <div>
              <div className="flex items-center gap-2.5 mb-0.5">
                <span className="font-serif text-[24px] text-[#293241]">5.0</span>
                <StarRating rating={5} />
              </div>
              <span className="text-[12px] text-[#3D5A80]/75">Based on Google Reviews</span>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="reveal carousel-container mb-10" ref={containerRef} {...handlers}>
          <div
            className="carousel-track"
            style={{ transform: `translateX(${translateX}%)`, gap: "20px" }}
          >
            {reviews.map((review, i) => (
              <div
                key={i}
                className="flex-shrink-0"
                style={{ width: `calc(${cardWidthPercent}% - ${(20 * (itemsPerView - 1)) / itemsPerView}px)` }}
              >
                <div className="card p-7 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h4 className="text-[15px] font-semibold text-[#293241]">{review.name}</h4>
                      <span className="text-[12px] text-[#3D5A80]/75">{review.business}</span>
                    </div>
                    <GoogleLogo />
                  </div>

                  {/* Stars */}
                  <div className="mb-5">
                    <StarRating rating={review.rating} />
                  </div>

                  {/* Text */}
                  <p className="text-[14px] text-[#3D5A80] leading-[1.6] flex-grow mb-6">
                    "{review.text}"
                  </p>

                  {/* Link */}
                  <a href="#" className="link-arrow text-[12px] text-[#3D5A80]/75 hover:text-[#293241] mt-auto">
                    View on Google
                    <ExternalLink className="w-3 h-3 arrow-icon" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`carousel-dot ${i === currentPage ? "active" : ""}`}
                aria-label={`Group ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={prev} disabled={!canGoPrev} className="carousel-arrow" aria-label="Previous">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={next} disabled={!canGoNext} className="carousel-arrow" aria-label="Next">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
