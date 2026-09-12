import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Audit", href: "#audit" },
  { label: "Work", href: "#work" },
  { label: "Reviews", href: "#reviews" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-[#293241] text-[#E0FBFC]/80">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-14 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block mb-3.5 group">
              <Image
                src="/logo.png"
                alt="Schrader"
                width={140}
                height={31}
                className="h-7 w-auto object-contain transition-opacity group-hover:opacity-80"
              />
            </Link>
            <span className="text-[12px] text-[#98C1D9]/80 uppercase tracking-[0.1em] block mb-5">
              Digital Marketing & Automation
            </span>
            <p className="text-[14px] text-[#E0FBFC]/70 leading-[1.6] max-w-sm">
              Helping businesses build better websites, get found online, and grow. Based in Traverse City, Michigan.
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold text-[#98C1D9]/70 uppercase tracking-[0.14em] mb-6">
              Navigation
            </h4>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[14px] text-[#E0FBFC]/70 hover:text-[#E0FBFC] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CTA */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between">
            <div className="lg:text-right mb-8">
              <h4 className="text-[11px] font-semibold text-[#98C1D9]/70 uppercase tracking-[0.14em] mb-6">
                Ready to grow?
              </h4>
              <p className="text-[14px] text-[#E0FBFC]/70 leading-[1.6] max-w-xs lg:ml-auto">
                Let's talk about your business and see how I can help.
              </p>
            </div>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#F7931E] hover:bg-[#E07E0B] text-white px-6 py-3 rounded-[var(--radius-md)] text-[13px] font-medium transition-all group shadow-sm hover:shadow-md"
            >
              Let's Talk
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar — Copyright in Solid Black */}
      <div className="bg-black border-t border-neutral-800">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 lg:px-14 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[12px] text-neutral-400">
            © 2026 Schrader.co. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-[12px] text-neutral-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-neutral-600">·</span>
            <Link href="#" className="text-[12px] text-neutral-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
