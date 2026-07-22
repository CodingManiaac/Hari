"use client";

import { useEffect, useRef, useState } from "react";
import reasonsData from "@/chapters/chapter-14/content/reasons.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import FadeIn from "./FadeIn";
import { X, Sparkles, Heart } from "lucide-react";

interface Reason {
  title: string;
  description: string;
  emoji: string;
}

// Canvas sparkles and hearts particle generator
function ReasonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      type: "heart" | "sparkle";
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
    }> = [];

    const spawnParticle = (isInitial = false) => {
      const type = Math.random() > 0.55 ? "heart" : "sparkle";
      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : height + 20,
        size: type === "heart" ? Math.random() * 5 + 4 : Math.random() * 3.5 + 1.5,
        type,
        speedY: -(Math.random() * 1.0 + 0.5),
        speedX: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.45 + 0.25,
        fadeSpeed: Math.random() * 0.0012 + 0.0006,
      };
    };

    const max = 30;
    for (let i = 0; i < max; i++) {
      particles.push(spawnParticle(true));
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.moveTo(x, y + size / 4);
      ctx.quadraticCurveTo(x, y, x + size / 2, y);
      ctx.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      ctx.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
      ctx.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 3);
      ctx.quadraticCurveTo(x, y, x, y + size / 4);
    };

    const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size * 0.3, y - size * 0.3);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size * 0.3, y + size * 0.3);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size * 0.3, y + size * 0.3);
      ctx.lineTo(x - size, y);
      ctx.lineTo(x - size * 0.3, y - size * 0.3);
    };

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity -= p.fadeSpeed;

        if (p.y < -20 || p.opacity <= 0) {
          Object.assign(p, spawnParticle(false));
        }

        ctx.beginPath();
        if (p.type === "heart") {
          drawHeart(ctx, p.x, p.y, p.size);
          ctx.fillStyle = `rgba(244, 63, 94, ${p.opacity})`;
          ctx.fill();
        } else {
          drawSparkle(ctx, p.x, p.y, p.size);
          ctx.fillStyle = `rgba(253, 224, 71, ${p.opacity})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />;
}

export default function Chapter14View() {
  const [selectedReason, setSelectedReason] = useState<Reason | null>(null);

  // Soft pastel gradients for Chapter 14
  const gradients = [
    "from-pink-50/70 to-rose-100/40 border-pink-200/50 hover:border-pink-300",
    "from-purple-50/70 to-lavender-100/40 border-purple-200/50 hover:border-purple-300",
    "from-orange-50/70 to-peach-100/40 border-orange-200/50 hover:border-orange-300",
  ];

  return (
    <ChapterContainer
      chapterId={14}
      title="Reasons Why You're Special"
      subtitle="Just a few of the infinite reasons why having you as my sister is the greatest gift in my entire life."
    >
      <div className="relative w-full py-8 space-y-12 select-none flex flex-col items-center">
        {/* Glow circles and default hearts background */}
        <BackgroundGlow color="rose" size={500} className="top-1/4 -left-20" />
        <BackgroundGlow color="violet" size={400} className="bottom-1/4 -right-20" />
        <FloatingHearts />

        {/* Staggered Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full px-6 z-10">
          {reasonsData.map((r: Reason, idx: number) => {
            const gradClass = gradients[idx % gradients.length];

            return (
              <FadeIn
                key={idx}
                direction="up"
                delay={idx * 0.06}
                className="h-full cursor-pointer"
              >
                <div
                  style={{
                    animationDelay: `${idx * 0.25}s`,
                  } as any}
                  onClick={() => setSelectedReason(r)}
                  className={`p-6 border bg-gradient-to-tr rounded-2xl shadow-sm hover:shadow-md hover:scale-103 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center space-y-3 h-full justify-between relative group animate-card-float cursor-pointer`}
                >
                  {/* Decorative Washi Tape */}
                  <div className="absolute -top-3 left-6 w-10 h-3.5 washi-tape opacity-80 z-10 pointer-events-none" />

                  <div className="w-12 h-12 rounded-full bg-white/60 border border-white/50 shadow-inner flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {r.emoji}
                  </div>

                  <div className="space-y-1 flex-1 flex flex-col justify-center">
                    <h4 className="text-base font-display font-extrabold text-pink-700 leading-tight">
                      {r.title}
                    </h4>
                    <p className="text-xs text-rose-950/75 leading-relaxed font-sans line-clamp-2">
                      {r.description}
                    </p>
                  </div>

                  <span className="text-[9px] uppercase tracking-wider font-bold text-rose-300/60 block pt-1 select-none">
                    Unfold Reason &rarr;
                  </span>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Detailed Expandable Popup (React Conditional Mount) */}
        {selectedReason && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setSelectedReason(null)}
              className="absolute inset-0 bg-pink-950/40 backdrop-blur-md animate-backdrop"
            />

            {/* Canvas Sparkles & Hearts */}
            <ReasonCanvas />

            <div className="relative z-20 w-full max-w-md animate-envelope-open select-none">
              <div className="w-full scrapbook-page border-glow-pink shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between items-center text-center space-y-6">
                
                {/* Washi tape details */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 washi-tape opacity-80 z-10 pointer-events-none" />

                <button
                  onClick={() => setSelectedReason(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-100/50 shadow-sm transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-100 shadow-inner flex items-center justify-center text-3xl animate-bounce mt-4">
                  {selectedReason.emoji}
                </div>

                <div className="space-y-3 w-full">
                  <span className="text-[10px] font-sans font-bold text-primary tracking-widest uppercase block flex justify-center items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> WHY YOU ARE SPECIAL
                  </span>
                  
                  <h3 className="text-xl md:text-2xl font-display font-extrabold text-pink-700 leading-snug">
                    {selectedReason.title}
                  </h3>
                  
                  <p className="text-sm md:text-base text-rose-950/80 leading-relaxed font-sans bg-white/30 border border-pink-50/50 p-5 rounded-2xl shadow-inner font-medium">
                    {selectedReason.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-rose-300 font-bold font-sans uppercase tracking-widest border-t border-pink-100/50 w-full pt-4 justify-center">
                  <Heart className="w-4 h-4 fill-primary text-primary" /> Forever Special
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </ChapterContainer>
  );
}
