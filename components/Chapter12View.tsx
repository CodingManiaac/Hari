"use client";

import { useEffect, useRef, useState } from "react";
import treasuresData from "@/chapters/chapter-12/content/treasures.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import { X, Sparkles, Trophy, Heart } from "lucide-react";

interface Treasure {
  id: number;
  title: string;
  message: string;
  icon: string;
  rewardType: string;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  color: string;
  velocityX: number;
  velocityY: number;
}

// Confetti burst for correct selections / completions
function ConfettiBurstCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const colors = ["#FF69B4", "#FFC0CB", "#FFB6C1", "#DB7093", "#E6E6FA", "#D8BFD8", "#F43F5E", "#FFD700"];

    const createParticle = (): Particle => {
      const angle = (Math.random() * 180 + 180) * (Math.PI / 180); // spray upwards
      const speed = Math.random() * 14 + 6;
      return {
        x: width / 2,
        y: height / 2,
        r: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
      };
    };

    const count = 90;
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }

    let timer = 0;
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      timer++;

      particles.forEach((p) => {
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.velocityY += 0.25; // gravity
        p.velocityX *= 0.98; // friction

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      if (timer < 180) {
        animationId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
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
  }, [active]);

  if (!active) return null;

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[99]" />;
}

export default function Chapter12View() {
  const [collected, setCollected] = useState<Set<number>>(new Set());
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Absolute board layout coordinates (%) for objects
  const positions = [
    { x: 12, y: 18, delay: "0.2s" },
    { x: 74, y: 14, delay: "0.8s" },
    { x: 35, y: 26, delay: "0.4s" },
    { x: 88, y: 38, delay: "1.4s" },
    { x: 20, y: 55, delay: "0.6s" },
    { x: 55, y: 18, delay: "1.0s" },
    { x: 80, y: 68, delay: "1.6s" },
    { x: 14, y: 78, delay: "1.8s" },
    { x: 48, y: 70, delay: "1.2s" },
    { x: 65, y: 48, delay: "0.5s" },
  ];

  const handleTreasureClick = (item: Treasure) => {
    setSelectedTreasure(item);
    
    // Add to collected state list
    const updated = new Set([...collected, item.id]);
    setCollected(updated);

    if (updated.size === 10) {
      setShowConfetti(true);
      setIsCompleted(true);
    }
  };

  return (
    <ChapterContainer
      chapterId={12}
      title="Surprise Treasure Hunt"
      subtitle="I've hidden 10 tiny gifts and gratitude secrets around the room. Click on all of them to open them!"
      showNext={isCompleted} // Only unlock the next page progression button when complete
    >
      <div className="relative w-full py-8 select-none flex flex-col items-center justify-center">
        {/* Celebration Confetti & Sparkles */}
        <ConfettiBurstCanvas active={showConfetti} />
        <BackgroundGlow color="rose" size={500} className="top-1/4 left-1/4" />
        <BackgroundGlow color="violet" size={400} className="bottom-1/4 right-1/4" />
        <FloatingHearts />

        {/* Counter Tag */}
        <div className="z-10 mb-6 bg-white/70 px-4 py-1.5 rounded-full border border-pink-100 shadow-sm text-xs font-sans font-bold text-primary flex items-center gap-1.5">
          🎁 Collected surprises: {collected.size} of 10
        </div>

        {/* Illustrated Playroom Board Panel */}
        <div className="relative w-full max-w-2xl h-[28rem] bg-gradient-to-tr from-pink-50/40 via-white/50 to-purple-50/40 rounded-3xl border border-pink-100/50 shadow-inner overflow-hidden z-10">
          
          {/* Subtle grid pattern background for scrapbook feeling */}
          <div className="absolute inset-0 bg-repeat bg-[radial-gradient(rgba(244,63,94,0.06)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />

          {/* Hidden absolute items */}
          {treasuresData.map((item: Treasure, idx: number) => {
            const coord = positions[idx];
            const isCollected = collected.has(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleTreasureClick(item)}
                style={{
                  left: `${coord.x}%`,
                  top: `${coord.y}%`,
                  animationDelay: coord.delay,
                }}
                className={`absolute w-12 h-12 rounded-full bg-white/80 border flex items-center justify-center text-2xl shadow-sm hover:shadow-md cursor-pointer hover:z-20 transition-all duration-300 hover-wiggle animate-card-float hover:scale-115 ${
                  isCollected
                    ? "border-primary bg-pink-50/90 scale-95 opacity-60 grayscale-[40%]"
                    : "border-pink-100 hover:border-primary"
                }`}
                title={item.title}
              >
                {item.icon}

                {/* Checked mini badge if collected */}
                {isCollected && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] flex items-center justify-center rounded-full shadow-sm font-bold border border-white">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Celebration popup modal overlay when all 10 are found */}
        {isCompleted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setIsCompleted(false)}
              className="absolute inset-0 bg-pink-950/40 backdrop-blur-md animate-backdrop"
            />
            <div className="relative z-10 w-full max-w-md animate-envelope-open select-none">
              <div className="w-full scrapbook-page border-glow-pink shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between items-center text-center space-y-6">
                {/* Washi tape details */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 washi-tape opacity-80 z-10 pointer-events-none" />

                <button
                  onClick={() => setIsCompleted(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-100/50 shadow-sm transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto shadow-inner">
                  <Trophy className="w-8 h-8 text-primary animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-display font-extrabold text-pink-700 leading-tight text-glow-rose">
                    🎉 You Found Every Surprise!
                  </h3>
                  <p className="text-xs md:text-sm text-rose-950/80 leading-relaxed font-sans max-w-xs mx-auto font-medium">
                    You have harvested every hidden message and surprise! You can now move on to the next chapter of surprises.
                  </p>
                </div>

                <div className="flex justify-center">
                  <Heart className="w-12 h-12 fill-primary text-primary animate-pulse-heart" />
                </div>

                <div className="border-t border-pink-100 pt-4 text-center w-full">
                  <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-rose-400 block animate-pulse">
                    Click the navigation button below to proceed
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Individual Treasure Modal Popup (React Conditional Mount) */}
        {selectedTreasure && !showConfetti && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setSelectedTreasure(null)}
              className="absolute inset-0 bg-pink-950/40 backdrop-blur-md animate-backdrop"
            />
            <div className="relative z-10 w-full max-w-sm animate-envelope-open select-none">
              <div className="w-full scrapbook-page border-glow-pink shadow-2xl rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between items-center text-center space-y-4">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 washi-tape opacity-80 z-10 pointer-events-none" />

                <button
                  onClick={() => setSelectedTreasure(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-100/50 shadow-sm transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="w-14 h-14 rounded-full bg-pink-50 border border-pink-100 shadow-inner flex items-center justify-center text-3xl animate-bounce mt-4">
                  {selectedTreasure.icon}
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-sans font-bold tracking-widest text-primary block flex justify-center items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> {selectedTreasure.rewardType}
                  </span>
                  <h3 className="text-lg font-display font-extrabold text-pink-700 leading-tight">
                    {selectedTreasure.title}
                  </h3>
                  <p className="text-xs md:text-sm text-rose-950/80 leading-relaxed font-sans bg-white/30 border border-pink-50/50 p-4 rounded-xl shadow-inner font-medium">
                    {selectedTreasure.message}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[9px] text-rose-300 font-bold uppercase tracking-widest pt-2">
                  Collected surprise! ✓
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ChapterContainer>
  );
}
