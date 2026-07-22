"use client";

import { useEffect, useRef, useState } from "react";
import gratitudeData from "@/chapters/chapter-19/content/gratitude.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import { Sparkles, Heart } from "lucide-react";
import { useChapterTransition } from "./TransitionScreen";

interface GratitudeNote {
  title: string;
  message: string;
  emoji: string;
}

// Custom canvas drawing rising hearts, falling cherry blossoms, and sparkles
function FinalGratitudeEffectsCanvas() {
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
      type: "heart" | "petal" | "sparkle";
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      angle?: number;
      spinSpeed?: number;
    }> = [];

    const spawnParticle = (isInitial = false) => {
      const rand = Math.random();
      const type = rand < 0.35 ? "heart" : rand < 0.7 ? "petal" : "sparkle";
      return {
        x: Math.random() * width,
        y: type === "petal" ? (isInitial ? Math.random() * height : -20) : (isInitial ? Math.random() * height : height + 20),
        size: type === "heart" ? Math.random() * 6 + 4 : type === "petal" ? Math.random() * 8 + 6 : Math.random() * 3 + 1.5,
        type,
        speedY: type === "petal" ? Math.random() * 1.0 + 0.6 : -(Math.random() * 1.2 + 0.5),
        speedX: type === "petal" ? Math.random() * 0.8 - 0.2 : Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.5 + 0.3,
        fadeSpeed: Math.random() * 0.001 + 0.0005,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() * 0.02 - 0.01) * Math.PI,
      };
    };

    const count = 40;
    for (let i = 0; i < count; i++) {
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

    const drawPetal = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number) => {
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(size / 2, -size / 2, size, 0);
      ctx.quadraticCurveTo(size / 2, size / 2, 0, 0);
      ctx.rotate(-angle);
      ctx.translate(-x, -y);
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

        if (p.type === "petal" && p.angle !== undefined && p.spinSpeed !== undefined) {
          p.angle += p.spinSpeed;
        }

        if (p.y < -30 || p.y > height + 30 || p.opacity <= 0) {
          Object.assign(p, spawnParticle(false));
        }

        ctx.beginPath();
        if (p.type === "heart") {
          drawHeart(ctx, p.x, p.y, p.size);
          ctx.fillStyle = `rgba(244, 63, 94, ${p.opacity})`;
          ctx.fill();
        } else if (p.type === "petal" && p.angle !== undefined) {
          drawPetal(ctx, p.x, p.y, p.size, p.angle);
          ctx.fillStyle = `rgba(251, 113, 133, ${p.opacity})`;
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

export default function Chapter19View() {
  const transitionTo = useChapterTransition();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFloating, setIsFloating] = useState(false);

  const handleContinue = () => {
    if (activeIdx >= gratitudeData.length - 1) return;
    
    setIsFloating(true);
    
    // Switch to the next note card after lantern floats off-screen
    setTimeout(() => {
      setActiveIdx((prev) => prev + 1);
      setIsFloating(false);
    }, 600);
  };

  const isFinalNote = activeIdx === gratitudeData.length - 1;
  const currentNote: GratitudeNote = gratitudeData[activeIdx];

  return (
    <ChapterContainer
      chapterId={19}
      title="Moments of Gratitude"
      subtitle="A page of my diary dedicated to the silent help, the noisy fights, and the constant support you've given me."
      showNext={false} // Manage progression button inside the view layout
    >
      <div className="relative w-full py-8 select-none flex flex-col items-center justify-center min-h-[30rem]">
        {/* Paper Lantern floating keyframe override */}
        <style>{`
          @keyframes float-up-lantern {
            0% {
              transform: translateY(0) scale(1) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(-450px) scale(0.7) rotate(6deg);
              opacity: 0;
            }
          }
          .animate-lantern {
            animation: float-up-lantern 0.65s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
        `}</style>

        {/* Ambient Lights */}
        <BackgroundGlow color="rose" size={500} className="top-1/4 left-1/4" />
        <BackgroundGlow color="violet" size={400} className="bottom-1/4 right-1/4" />
        <FloatingHearts />

        {/* Dynamic particles for the final note card */}
        {isFinalNote && <FinalGratitudeEffectsCanvas />}

        {/* Counter Tag */}
        <div className="z-10 mb-6 bg-white/70 px-4 py-1.5 rounded-full border border-pink-100 shadow-sm text-xs font-sans font-bold text-primary">
          📖 Diary Note {activeIdx + 1} of {gratitudeData.length}
        </div>

        {/* Diary card wrapper */}
        <div className="relative w-full max-w-md h-80 z-20 flex justify-center">
          
          {/* Note Card */}
          <div
            className={`w-full absolute scrapbook-page border-glow-pink shadow-2xl rounded-3xl p-6 md:p-8 flex flex-col justify-between items-center text-center space-y-4 ${
              isFloating ? "animate-lantern" : "animate-envelope-open"
            }`}
          >
            {/* Washi tape details */}
            <div className="absolute -top-3 left-12 w-10 h-3.5 washi-tape opacity-80 z-10 pointer-events-none" />
            <div className="absolute -top-3 right-12 w-10 h-3.5 washi-tape opacity-80 z-10 pointer-events-none" />

            {/* Note Header Emoji */}
            <div className="w-14 h-14 rounded-full bg-pink-50 border border-pink-100 shadow-inner flex items-center justify-center text-3xl animate-bounce mt-2">
              {currentNote.emoji}
            </div>

            {/* Note text contents */}
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              <h4 className="text-lg font-display font-extrabold text-pink-700 leading-tight">
                {currentNote.title}
              </h4>
              <p className="text-xs md:text-sm text-rose-950/80 leading-relaxed font-sans font-semibold">
                {currentNote.message}
              </p>
            </div>

            {/* Footer trigger button */}
            <div className="w-full border-t border-pink-100/30 pt-4 flex justify-center">
              {isFinalNote ? (
                <button
                  onClick={() => transitionTo(20)} // Transition to the grand finale (Chapter 20)
                  className="px-8 py-3 bg-gradient-to-r from-primary via-accent to-primary text-white rounded-full font-bold uppercase tracking-wider text-xs border border-pink-100/50 hover:shadow-primary/20 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse"
                >
                  🎂 Open My Final Gift
                </button>
              ) : (
                <button
                  onClick={handleContinue}
                  className="px-6 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/10 text-primary rounded-full font-bold uppercase tracking-wider text-[10px] shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  Continue &rarr;
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </ChapterContainer>
  );
}
