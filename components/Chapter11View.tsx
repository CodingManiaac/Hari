"use client";

import { useEffect, useRef, useState } from "react";
import wishesData from "@/chapters/chapter-11/content/wishes.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import { X, Sparkles, Heart } from "lucide-react";
import { useChapterTransition } from "./TransitionScreen";

interface Wish {
  title: string;
  wishMessage: string;
  emoji?: string;
}

interface Butterfly {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  angle: number;
  flap: number;
  flapSpeed: number;
}

interface FloatingHeart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
}

// Canvas engine drawing fluttering butterflies and rising heart particles
function TreeEffectsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const butterflies: Butterfly[] = [];
    const hearts: FloatingHeart[] = [];
    const colors = ["rgba(244, 63, 94, 0.6)", "rgba(168, 85, 247, 0.6)", "rgba(236, 72, 153, 0.6)", "rgba(251, 146, 60, 0.6)"];

    const createButterfly = (): Butterfly => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.6) + height * 0.1,
      size: Math.random() * 4 + 4,
      speedX: Math.random() * 1.0 - 0.5,
      speedY: Math.random() * 0.8 - 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      flap: Math.random(),
      flapSpeed: Math.random() * 0.15 + 0.08,
    });

    const createHeart = (isInitial = false): FloatingHeart => ({
      x: Math.random() * width,
      y: isInitial ? Math.random() * height : height + 20,
      size: Math.random() * 8 + 5,
      speedY: -(Math.random() * 1.2 + 0.5),
      opacity: Math.random() * 0.5 + 0.2,
    });

    for (let i = 0; i < 5; i++) butterflies.push(createButterfly());
    for (let i = 0; i < 20; i++) hearts.push(createHeart(true));

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.moveTo(x, y + size / 4);
      ctx.quadraticCurveTo(x, y, x + size / 2, y);
      ctx.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      ctx.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
      ctx.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 3);
      ctx.quadraticCurveTo(x, y, x, y + size / 4);
    };

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw rising hearts
      hearts.forEach((h) => {
        h.y += h.speedY;
        h.opacity -= 0.001;
        if (h.y < -20 || h.opacity <= 0) {
          Object.assign(h, createHeart(false));
        }
        ctx.beginPath();
        drawHeart(ctx, h.x, h.y, h.size);
        ctx.fillStyle = `rgba(244, 63, 94, ${h.opacity})`;
        ctx.fill();
      });

      // 2. Draw flapping butterflies
      butterflies.forEach((b) => {
        b.x += b.speedX;
        b.y += b.speedY;
        b.flap += b.flapSpeed;

        // Wander direction slightly
        b.speedX += Math.random() * 0.1 - 0.05;
        b.speedY += Math.random() * 0.08 - 0.04;
        
        // Clamp speed
        b.speedX = Math.max(-1.5, Math.min(1.5, b.speedX));
        b.speedY = Math.max(-1.0, Math.min(1.0, b.speedY));

        // Wrap edges
        if (b.x < -20) b.x = width + 20;
        if (b.x > width + 20) b.x = -20;
        if (b.y < -20) b.y = height + 20;
        if (b.y > height + 20) b.y = -20;

        const flapScale = Math.sin(b.flap);

        // Draw Left Wing (ellipse)
        ctx.beginPath();
        ctx.ellipse(
          b.x - b.size * 0.8 * Math.abs(flapScale),
          b.y - b.size * 0.2,
          b.size * 0.8 * Math.abs(flapScale),
          b.size,
          -0.2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = b.color;
        ctx.fill();

        // Draw Right Wing (ellipse)
        ctx.beginPath();
        ctx.ellipse(
          b.x + b.size * 0.8 * Math.abs(flapScale),
          b.y - b.size * 0.2,
          b.size * 0.8 * Math.abs(flapScale),
          b.size,
          0.2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = b.color;
        ctx.fill();

        // Draw body
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, b.size * 0.2, b.size * 0.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(136, 19, 55, 0.8)";
        ctx.fill();
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

export default function Chapter11View() {
  const transitionTo = useChapterTransition();
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [openedWishes, setOpenedWishes] = useState<Set<number>>(new Set());
  const [isSpecialPromise, setIsSpecialPromise] = useState(false);
  const [typedPromise, setTypedPromise] = useState("");
  const [showPromiseButton, setShowPromiseButton] = useState(false);

  // Organic leaf layout position coordinates (%) relative to the tree container
  const leafCoordinates = [
    { id: 1, x: 23, y: 18, rot: "-20deg" },
    { id: 2, x: 48, y: 11, rot: "10deg" },
    { id: 3, x: 74, y: 16, rot: "40deg" },
    { id: 4, x: 14, y: 40, rot: "-45deg" },
    { id: 5, x: 34, y: 32, rot: "-15deg" },
    { id: 6, x: 64, y: 28, rot: "25deg" },
    { id: 7, x: 86, y: 38, rot: "50deg" },
    { id: 8, x: 25, y: 56, rot: "-30deg" },
    { id: 9, x: 75, y: 54, rot: "35deg" },
    { id: 10, x: 50, y: 48, rot: "0deg" }, // Promise Leaf center
  ];

  const handleLeafClick = (wish: Wish, idx: number) => {
    setSelectedWish(wish);
    setSelectedIdx(idx);
    setOpenedWishes((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });

    if (idx === 9) {
      // 10th Leaf - Promise Special Flow
      setIsSpecialPromise(true);
      setTypedPromise("");
      setShowPromiseButton(false);
    }
  };

  const handleClose = () => {
    setSelectedWish(null);
    setSelectedIdx(null);
    setIsSpecialPromise(false);
  };

  // Promise typewriter effect
  useEffect(() => {
    if (!isSpecialPromise || !selectedWish) return;

    let index = 0;
    const interval = setInterval(() => {
      setTypedPromise((prev) => prev + selectedWish.wishMessage.charAt(index));
      index++;
      if (index >= selectedWish.wishMessage.length) {
        clearInterval(interval);
        setShowPromiseButton(true);
      }
    }, 25); // Gentle handwriting reading pace

    return () => clearInterval(interval);
  }, [isSpecialPromise, selectedWish]);

  return (
    <ChapterContainer
      chapterId={11}
      title="Magical Wishing Tree"
      subtitle="A sacred tree growing under soft starlight. Click the glowing leaves to harvest my promises and wishes for you."
      showNext={false} // Hidden footer navigation progression; Leaf 10 unlocks a dedicated transition
    >
      <div className="relative w-full py-8 min-h-[36rem] flex flex-col items-center justify-center select-none">
        {/* Particle and Butterfly Canvas overlay */}
        <TreeEffectsCanvas />
        <BackgroundGlow color="rose" size={500} className="top-1/4 left-1/4" />
        <BackgroundGlow color="violet" size={400} className="bottom-1/4 right-1/4" />
        <FloatingHearts />

        {/* Tree Container block */}
        <div className="relative w-full max-w-lg aspect-square flex justify-center items-center z-10 mt-8">
          
          {/* Swaying magical SVG tree drawing */}
          <div className="relative w-80 h-80 md:w-96 md:h-96 animate-tree-sway">
            <svg viewBox="0 0 200 200" className="w-full h-full text-pink-200 fill-current opacity-90 drop-shadow-[0_4px_12px_rgba(244,63,94,0.1)]">
              {/* Brown wood trunk */}
              <path
                d="M95,185 C95,155 90,145 85,125 C82,112 85,103 90,83 C95,63 105,63 110,83 C115,103 118,112 115,125 C110,145 105,155 105,185 Z"
                fill="#8C6239"
              />
              <path d="M85,125 C70,115 50,115 40,125 C50,110 70,110 85,125 Z" fill="#734F2F" />
              <path d="M115,125 C130,115 150,115 160,125 C150,110 130,110 115,125 Z" fill="#734F2F" />
              <path d="M90,83 C75,73 60,73 50,83 C60,68 75,68 90,83 Z" fill="#734F2F" />
              <path d="M110,83 C125,73 140,73 150,83 C140,68 125,68 110,83 Z" fill="#734F2F" />

              {/* Cloud canopy clusters */}
              <circle cx="100" cy="72" r="42" className="text-pink-100/40" />
              <circle cx="75" cy="85" r="32" className="text-purple-100/40" />
              <circle cx="125" cy="85" r="32" className="text-pink-100/40" />
              <circle cx="60" cy="110" r="24" className="text-orange-100/30" />
              <circle cx="140" cy="110" r="24" className="text-purple-100/30" />
              <circle cx="100" cy="110" r="38" className="text-pink-100/40" />
            </svg>
          </div>

          {/* Absolute Positioned Glowing Wish Leaves */}
          {wishesData.map((wish: Wish, idx: number) => {
            const coord = leafCoordinates[idx];
            const isPromiseLeaf = idx === 9;
            const isOpened = openedWishes.has(idx);

            return (
              <button
                key={idx}
                onClick={() => handleLeafClick(wish, idx)}
                style={{
                  left: `${coord.x}%`,
                  top: `${coord.y}%`,
                  transform: `translate(-50%, -50%) rotate(${coord.rot})`,
                  animationDelay: `${idx * 0.15}s`,
                }}
                className={`absolute w-9 h-9 flex items-center justify-center text-xs font-sans font-bold shadow-md cursor-pointer transition-all duration-300 hover:scale-125 hover:z-20 active:scale-95 ${
                  isPromiseLeaf
                    ? "rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 border border-rose-300 text-white animate-pulse shadow-rose-300/40"
                    : isOpened
                    ? "rounded-tr-2xl rounded-bl-2xl bg-gradient-to-tr from-green-200 to-emerald-300 border border-green-100 text-emerald-800 opacity-80"
                    : "rounded-tr-2xl rounded-bl-2xl bg-gradient-to-tr from-green-300 to-emerald-400 border border-green-200 text-white animate-leaf-glow"
                }`}
              >
                {isPromiseLeaf ? "❤️" : idx + 1}
              </button>
            );
          })}
        </div>

        {/* Wish Popup Dialog (React Conditional Mount) */}
        {selectedWish && selectedIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Soft backdrop dims background */}
            <div
              onClick={handleClose}
              className={`absolute inset-0 backdrop-blur-md animate-backdrop ${
                isSpecialPromise ? "bg-pink-950/65" : "bg-pink-950/45"
              }`}
            />

            {/* Special glowing lights surrounding popup */}
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              <div className="w-full max-w-lg aspect-square border border-pink-400/20 rounded-full animate-ping opacity-30 pointer-events-none" />
            </div>

            {/* Popup parchment card */}
            <div className="relative z-20 w-full max-w-md animate-envelope-open select-none">
              <div 
                className={`w-full scrapbook-page border-glow-pink shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between items-center text-center space-y-6 ${
                  isSpecialPromise ? "bg-white/95 ring-4 ring-primary/20" : ""
                }`}
              >
                {/* Washi tape details */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 washi-tape opacity-80 z-10 pointer-events-none" />

                {/* Close button (only show if not writing the locked promise continue button) */}
                {!showPromiseButton && (
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-100/50 shadow-sm transition-all cursor-pointer"
                    aria-label="Close wish"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Badge Header emoji */}
                <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-100 shadow-inner flex items-center justify-center text-3xl animate-bounce mt-4">
                  {selectedWish.emoji || "🍃"}
                </div>

                {/* Wish Content Details */}
                <div className="space-y-3 w-full">
                  <span className="text-[10px] font-sans font-bold text-primary tracking-widest uppercase block flex justify-center items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> {isSpecialPromise ? "A Sibling Promise" : `WISH FOR HARIPRIYA #${selectedIdx + 1}`}
                  </span>
                  
                  <h3 className="text-xl md:text-2xl font-display font-extrabold text-pink-700 leading-snug">
                    {selectedWish.title}
                  </h3>

                  <div className="text-sm md:text-base text-rose-950/80 leading-relaxed font-sans bg-white/40 border border-pink-50/50 p-5 rounded-2xl shadow-inner font-medium min-h-[8rem] flex items-center justify-center">
                    {isSpecialPromise ? (
                      <p className="whitespace-pre-line text-left">
                        {typedPromise}
                        {typedPromise.length < selectedWish.wishMessage.length && (
                          <span className="animate-pulse text-primary font-bold ml-0.5">|</span>
                        )}
                      </p>
                    ) : (
                      <p>{selectedWish.wishMessage}</p>
                    )}
                  </div>
                </div>

                {/* Special Transition Button fades in after promise is typed */}
                {isSpecialPromise && showPromiseButton ? (
                  <div className="w-full pt-2 flex justify-center animate-line">
                    <button
                      onClick={() => {
                        handleClose();
                        transitionTo(12); // proceeds to next phase (triggers locked toast)
                      }}
                      className="px-8 py-3 bg-gradient-to-r from-primary via-accent to-primary text-white rounded-full font-bold uppercase tracking-wider text-xs border border-pink-100/50 hover:shadow-primary/20 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse"
                    >
                      🎁 I Have One Last Surprise For You...
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] text-rose-300 font-bold font-sans uppercase tracking-widest border-t border-pink-100/50 w-full pt-4 justify-center">
                    <Heart className="w-4 h-4 fill-primary text-primary" /> With All My Heart
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </ChapterContainer>
  );
}
