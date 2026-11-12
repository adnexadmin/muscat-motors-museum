// Cinematic full-viewport hero with mouse 3D tilt, scroll zoom/parallax and staggered entrance.
// Uses the existing poster as background until a looping video is added.
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import posterAsset from "@/assets/hero-cover-title.jpg.asset.json";
import { HeroShowcase } from "./HeroShowcase";
import { useSiteMedia } from "@/lib/site-media";

gsap.registerPlugin(ScrollTrigger);

export function VisionHero({ mode }: { mode?: "investor" | "app"; portraitSrc?: string }) {
  const cover = useSiteMedia().hero || posterAsset.url;
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const content = contentRef.current;
    if (!section || !bg || !content) return;

    // Entrance staggered reveal
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-badge", { opacity: 0, y: 24, duration: 0.7 })
      .from(".hero-title span", { y: 90, opacity: 0, duration: 0.9, stagger: 0.14 }, "-=0.3")
      .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.6 }, "-=0.45")
      .from(".hero-cta", { y: 20, opacity: 0, duration: 0.5, stagger: 0.12 }, "-=0.3")
      .from(".hero-stats > *", { y: 16, opacity: 0, duration: 0.45, stagger: 0.08 }, "-=0.2");

    // Mouse 3D tilt
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(bg, {
        rotateY: x * 7,
        rotateX: -y * 5,
        duration: 0.55,
        ease: "power2.out",
        transformPerspective: 1200,
      });
    };
    section.addEventListener("mousemove", onMove);

    // Scroll scrub: zoom + parallax + content fade/slide
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1.1,
      },
    });
    scrollTl
      .to(bg, { scale: 1.28, yPercent: 18, ease: "none" }, 0)
      .to(content, { yPercent: -35, opacity: 0, ease: "power2.in" }, 0);

    return () => {
      section.removeEventListener("mousemove", onMove);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative h-screen w-full overflow-hidden bg-black"
      style={{ perspective: "1200px" }}
      aria-label="GearHead RC Hub — A New RC Experience for Oman"
    >
      {/* Background + overlays */}
      <div
        ref={bgRef}
        className="absolute inset-0 origin-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <img
          src={cover}
          alt="GEARHEAD RC HUB"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        {/* Letterbox gradients */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/60 to-transparent" />
        {/* Dark radial color-grade */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white"
      >
        <span className="hero-badge mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-black/40 px-4 py-1.5 text-xs font-medium tracking-widest text-orange-400 backdrop-blur-sm">
          MUSCAT, OMAN · EST. 2024
        </span>

        <h1 className="hero-title text-6xl font-black leading-none tracking-tighter md:text-8xl lg:text-9xl">
          <span className="block">Gear</span>
          <span className="block italic text-gold-gradient">Head</span>
          <span className="block">GALLERY</span>
        </h1>

        <p className="hero-subtitle mt-6 max-w-xl text-lg text-white/80 md:text-xl">
          The Art of Automotive Passion
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href="#categories" className="hero-cta btn-gold">
            Explore Collection
          </a>
          <a href="#experience" className="hero-cta btn-ghost-gold">
            360° Experience
          </a>
        </div>

        {/* Stats */}
        <div className="hero-stats mt-14 flex flex-wrap justify-center gap-8 text-sm uppercase tracking-wider text-white/70">
          <div><span className="text-2xl font-bold text-gold-gradient">200+</span><br />Vehicles</div>
          <div><span className="text-2xl font-bold text-gold-gradient">4</span><br />Categories</div>
          <div><span className="text-2xl font-bold text-gold-gradient">∞</span><br />Passion</div>
        </div>
      </div>

      {/* Scroll chevron */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/60">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {/* Oman plate badge */}
      <div className="absolute bottom-6 right-6 z-10 rounded border border-yellow-400/50 bg-yellow-400/10 px-3 py-1 text-xs font-mono text-yellow-300 backdrop-blur-sm">
        OMAN YELLOW PLATE
      </div>

      {/* Existing showcase (optional, can be moved later) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-full">
        <HeroShowcase variant={mode === "app" ? "app" : "investor"} />
      </div>
    </section>
  );
}
