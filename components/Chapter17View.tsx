"use client";

import { useEffect, useRef, useState } from "react";
import starsData from "@/chapters/chapter-17/content/stars.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import { X, Sparkles, Star, Heart, Moon } from "lucide-react";

interface StarNode {
  id: number;
  title: string;
  message: string;
  emoji?: string;
}

interface TwinkleStar {
  x: number;
  y: number;
  r: number;
  alpha: number;
  speed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  len: number;
  speed: number;
  angle: number;
  alpha: number;
}

// Background canvas drawing twinkling stars and shooting stars
function NightSkyCanvas({ triggerShooting }: { triggerShooting: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars: TwinkleStar[] = [];
    const shoots: ShootingStar[] = [];

    const spawnStar = (): TwinkleStar => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
    });

    const spawnShooting = (): ShootingStar => ({
      x: Math.random() * (width * 0.6),
      y: Math.random() * (height * 0.4),
      len: Math.random() * 80 + 40,
      speed: Math.random() * 12 + 6,
      angle: (Math.random() * 15 + 30) * (Math.PI / 180), // angle down-right
      alpha: 1.0,
    });

    // Spawn 80 background stars
    for (let i = 0; i < 80; i++) {
      stars.push(spawnStar());
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw twinkling background stars
      stars.forEach((s) => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.alpha)})`;
        ctx.fill();
      });

      // 2. Spawn random shooting stars (or trigger one on demand)
      if (Math.random() < 0.0035 || (triggerShooting && Math.random() < 0.05 && shoots.length < 3)) {
        shoots.push(spawnShooting());
      }

      // 3. Draw shooting stars
      shoots.forEach((s, idx) => {
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.025; // fade

        if (s.alpha <= 0 || s.x > width || s.y > height) {
          shoots.splice(idx, 1);
          return;
        }

        ctx.beginPath();
        const grad = ctx.createLinearGradient(
          s.x,
          s.y,
          s.x - Math.cos(s.angle) * s.len,
          s.y - Math.sin(s.angle) * s.len
        );
        grad.addColorStop(0, `rgba(253, 224, 71, ${s.alpha})`);
        grad.addColorStop(1, `rgba(253, 224, 71, 0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.0;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        ctx.stroke();
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
  }, [triggerShooting]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

export default function Chapter17View() {
  const [unlockedCount, setUnlockedCount] = useState(1);
  const [openedStars, setOpenedStars] = useState<Set<number>>(new Set());
  const [selectedStar, setSelectedStar] = useState<StarNode | null>(null);

  // Staggered coordinate positions (%) inside the night sky viewport box
  const starCoordinates = [
    { x: 18, y: 22 },
    { x: 42, y: 15 },
    { x: 74, y: 20 },
    { x: 12, y: 40 },
    { x: 34, y: 35 },
    { x: 58, y: 30 },
    { x: 86, y: 42 },
    { x: 24, y: 55 },
    { x: 50, y: 52 },
    { x: 76, y: 56 },
    { x: 14, y: 72 },
    { x: 38, y: 68 },
    { x: 64, y: 65 },
    { x: 88, y: 72 },
    { x: 28, y: 84 },
    { x: 60, y: 82 },
  ];

  const handleStarClick = (star: StarNode, idx: number) => {
    setSelectedStar(star);
    setOpenedStars((prev) => new Set([...prev, star.id]));

    // If she clicked the latest unlocked star, unlock the next star in sequence
    if (idx === unlockedCount - 1) {
      setUnlockedCount((prev) => Math.min(prev + 1, starsData.length));
    }
  };

  const isCompleted = openedStars.size === starsData.length;

  return (
    <ChapterContainer
      chapterId={17}
      title="A Sky Full of Memories"
      subtitle="The sky starts calm and empty. Click the twinkling stars to release our secrets, lighting up the sky together."
      showNext={isCompleted} // Unlocks the page footer transition button when all 16 stars have been read
    >
      <div className="relative w-full py-8 select-none flex flex-col items-center justify-center">
        {/* Night Sky Styles */}
        <style>{`
          @keyframes glow-pulse {
            0%, 100% {
              filter: drop-shadow(0 0 4px rgba(253, 224, 71, 0.4));
              transform: scale(1);
            }
            50% {
              filter: drop-shadow(0 0 16px rgba(253, 224, 71, 0.95));
              transform: scale(1.18);
            }
          }
          .animate-star-active {
            animation: glow-pulse 1.8s ease-in-out infinite;
          }
          @keyframes slow-drift {
            0%, 100% { transform: translateX(-15px); }
            50% { transform: translateX(15px); }
          }
          .animate-cloud-drift {
            animation: slow-drift 18s ease-in-out infinite;
          }
        `}</style>

        {/* Twinkling star field canvas */}
        <NightSkyCanvas triggerShooting={isCompleted} />

        {/* Dark night sky viewport box */}
        <div className="relative w-full max-w-3xl h-[30rem] bg-gradient-to-b from-indigo-950/95 via-slate-900/95 to-pink-950/90 rounded-3xl border border-indigo-900/40 shadow-2xl overflow-hidden z-10">
          
          {/* Crescent Moon */}
          <div className="absolute top-8 right-12 w-14 h-14 rounded-full bg-yellow-100/90 shadow-[0_0_24px_rgba(253,224,71,0.4)] flex items-center justify-center animate-pulse z-0">
            <div className="w-10 h-10 rounded-full bg-slate-900 absolute top-1 left-3.5" />
          </div>

          {/* Drifting Clouds */}
          <div className="absolute -bottom-8 left-0 right-0 h-28 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none z-10" />
          
          {/* Soft SVG clouds */}
          <svg viewBox="0 0 100 100" className="absolute top-1/4 left-1/4 w-32 h-16 text-white/5 opacity-15 animate-cloud-drift pointer-events-none z-0">
            <path d="M10,40 C10,25 30,25 35,30 C40,25 60,25 60,40 C70,40 75,50 65,55 C55,60 15,60 10,55 Z" fill="currentColor" />
          </svg>
          <svg viewBox="0 0 100 100" className="absolute bottom-1/3 right-1/4 w-40 h-20 text-white/5 opacity-10 animate-cloud-drift pointer-events-none z-0" style={{ animationDelay: "4s" }}>
            <path d="M10,40 C10,25 30,25 35,30 C40,25 60,25 60,40 C70,40 75,50 65,55 C55,60 15,60 10,55 Z" fill="currentColor" />
          </svg>

          {/* Render Active Star Constellations */}
          {starsData.map((star: StarNode, idx: number) => {
            const coord = starCoordinates[idx];
            const isUnlocked = idx < unlockedCount;
            const isOpened = openedStars.has(star.id);
            const isCurrent = idx === unlockedCount - 1 && !isOpened;

            if (!isUnlocked) return null;

            return (
              <button
                key={star.id}
                onClick={() => handleStarClick(star, idx)}
                style={{
                  left: `${coord.x}%`,
                  top: `${coord.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className={`absolute w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:scale-125 hover:z-30 transition-all duration-300 ${
                  isCurrent
                    ? "text-yellow-300 animate-star-active z-20 scale-110"
                    : isOpened
                    ? "text-yellow-100/70 opacity-90"
                    : "text-yellow-200/90 animate-pulse"
                }`}
                title={star.title}
              >
                <Star 
                  className={`w-6 h-6 ${
                    isCurrent ? "fill-yellow-300 text-yellow-300" : isOpened ? "fill-yellow-200/40 text-yellow-200" : "text-yellow-100"
                  }`} 
                />
              </button>
            );
          })}
        </div>

        {/* Star Memory Modal overlay (React Conditional Mount) */}
        {selectedStar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setSelectedStar(null)}
              className="absolute inset-0 bg-pink-950/45 backdrop-blur-md animate-backdrop"
            />
            <div className="relative z-10 w-full max-w-sm animate-envelope-open select-none">
              <div className="w-full scrapbook-page border-glow-pink shadow-2xl rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between items-center text-center space-y-4">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 washi-tape opacity-80 z-10 pointer-events-none" />

                <button
                  onClick={() => setSelectedStar(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-100/50 shadow-sm transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-14 h-14 rounded-full bg-pink-50 border border-pink-100 shadow-inner flex items-center justify-center text-3xl animate-bounce mt-4">
                  {selectedStar.emoji || "⭐"}
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-sans font-bold tracking-widest text-primary block flex justify-center items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> CONSTELLATION MEMORY
                  </span>
                  <h3 className="text-lg font-display font-extrabold text-pink-700 leading-tight">
                    {selectedStar.title}
                  </h3>
                  <p className="text-xs md:text-sm text-rose-950/80 leading-relaxed font-sans bg-white/30 border border-pink-50/50 p-4 rounded-xl shadow-inner font-medium">
                    {selectedStar.message}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[9px] text-rose-300 font-bold uppercase tracking-widest pt-2">
                  <Heart className="w-3.5 h-3.5 fill-primary text-primary" /> Lighting Up The Sky
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ChapterContainer>
  );
}
