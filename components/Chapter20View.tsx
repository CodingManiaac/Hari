"use client";

import { useEffect, useRef, useState } from "react";
import finalLetterData from "@/chapters/chapter-20-ending/content/final-letter.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import { Sparkles, Heart, RefreshCw, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import Polaroid from "./Polaroid";

interface Particle {
  x: number;
  y: number;
  r: number;
  color: string;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  color: string;
  exploded: boolean;
}

interface Balloon {
  x: number;
  y: number;
  r: number;
  color: string;
  speedY: number;
  wobble: number;
  wobbleSpeed: number;
}

interface Petal {
  x: number;
  y: number;
  r: number;
  speedY: number;
  speedX: number;
  alpha: number;
  angle: number;
  spin: number;
}

// Complete Canvas celebration engine drawing fireworks, balloons, petals, and hearts
function FinaleCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const rockets: Rocket[] = [];
    const particles: Particle[] = [];
    const balloons: Balloon[] = [];
    const petals: Petal[] = [];

    const colors = ["#F43F5E", "#EC4899", "#A855F7", "#F97316", "#FBBF24", "#34D399", "#60A5FA"];

    const spawnRocket = () => ({
      x: Math.random() * (width * 0.8) + width * 0.1,
      y: height + 20,
      targetY: Math.random() * (height * 0.5) + height * 0.1,
      speed: Math.random() * 5 + 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      exploded: false,
    });

    const spawnBalloon = (isInitial = false): Balloon => ({
      x: Math.random() * width,
      y: isInitial ? Math.random() * height : height + 30,
      r: Math.random() * 12 + 15,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: -(Math.random() * 0.8 + 0.4),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.005,
    });

    const spawnPetal = (isInitial = false): Petal => ({
      x: Math.random() * width,
      y: isInitial ? Math.random() * height : -20,
      r: Math.random() * 6 + 4,
      speedY: Math.random() * 0.8 + 0.5,
      speedX: Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.4 + 0.4,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() * 0.02 - 0.01) * Math.PI,
    });

    // Populate balloons and petals
    for (let i = 0; i < 12; i++) balloons.push(spawnBalloon(true));
    for (let i = 0; i < 25; i++) petals.push(spawnPetal(true));

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

      // 1. Draw drifting balloons
      balloons.forEach((b) => {
        b.y += b.speedY;
        b.wobble += b.wobbleSpeed;
        const currentX = b.x + Math.sin(b.wobble) * 2;

        if (b.y < -40) {
          Object.assign(b, spawnBalloon(false));
        }

        ctx.beginPath();
        ctx.ellipse(currentX, b.y, b.r, b.r * 1.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.globalAlpha = 0.55;
        ctx.fill();

        // Balloon string line
        ctx.beginPath();
        ctx.moveTo(currentX, b.y + b.r * 1.3);
        ctx.lineTo(currentX, b.y + b.r * 1.3 + 25);
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.stroke();
      });
      ctx.globalAlpha = 1.0;

      // 2. Draw falling petals
      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += p.spin;

        if (p.y > height + 20) {
          Object.assign(p, spawnPetal(false));
        }

        ctx.beginPath();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(p.r / 2, -p.r / 2, p.r, 0);
        ctx.quadraticCurveTo(p.r / 2, p.r / 2, 0, 0);
        ctx.rotate(-p.angle);
        ctx.translate(-p.x, -p.y);
        ctx.fillStyle = `rgba(251, 113, 133, ${p.alpha})`;
        ctx.fill();
      });

      // 3. Spawn rockets
      if (Math.random() < 0.02 && rockets.length < 4) {
        rockets.push(spawnRocket());
      }

      // 4. Update rockets
      rockets.forEach((r, idx) => {
        r.y -= r.speed;

        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        // Spark tail
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x, r.y + 15);
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.stroke();

        // Explode check
        if (r.y <= r.targetY) {
          r.exploded = true;
          // Spawn sparks
          for (let i = 0; i < 35; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            particles.push({
              x: r.x,
              y: r.y,
              r: Math.random() * 2 + 1.5,
              color: r.color,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1.0,
              decay: Math.random() * 0.02 + 0.015,
            });
          }
          rockets.splice(idx, 1);
        }
      });

      // 5. Update sparks
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.vx *= 0.98; // friction
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(idx, 1);
          return;
        }

        ctx.beginPath();
        // Alternating heart particles & circles
        if (Math.random() > 0.75) {
          drawHeart(ctx, p.x, p.y, p.r * 1.5);
        } else {
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

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
  }, [active]);

  if (!active) return null;

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />;
}

export default function Chapter20View() {
  const setCurrentChapter = useStore((state) => state.setCurrentChapter);
  const [readComplete, setReadComplete] = useState(false);

  // Sequences
  const [sequenceStep, setSequenceStep] = useState(0);
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [bookClosing, setBookClosing] = useState(false);
  const [showHeartOnly, setShowHeartOnly] = useState(false);
  const [showCreditsText, setShowCreditsText] = useState(false);

  // List of memories images to float in the background
  const memoriesPhotos = [
    "/api/assets/chapters/chapter-06/images/memory.jpeg",
    "/api/assets/chapters/chapter-07/images/childhood.jpeg",
    "/api/assets/chapters/chapter-16/images/memory-01.jpeg",
    "/api/assets/chapters/chapter-16/images/memory-03.jpeg",
    "/api/assets/chapters/chapter-16/images/memory-04.jpeg",
    "/api/assets/chapters/chapter-16/images/memory-05.jpeg",
    "/api/assets/chapters/chapter-16/images/memory-06.jpeg",
  ];

  const handleFinishReading = () => {
    setReadComplete(true);

    // Sequence timing cascade
    setTimeout(() => setSequenceStep(1), 500);  // "One Last Thing..."
    setTimeout(() => setSequenceStep(2), 2500); // "Thank you for being my sister."
    setTimeout(() => setSequenceStep(3), 4500); // "Happy Birthday, Hari." ❤️
    setTimeout(() => {
      setSequenceStep(4);
      setCelebrationActive(true); // Fire up full particle chimes fireworks!
    }, 6500);
  };

  const handleReplay = () => {
    setBookClosing(true);

    // 1. Pages slide closed overlay
    setTimeout(() => {
      setShowHeartOnly(true);
    }, 1200);

    // 2. Display credit quote
    setTimeout(() => {
      setShowCreditsText(true);
    }, 2400);

    // 3. Reset state back to Chapter 1
    setTimeout(() => {
      // Clear final states and set chapter
      setCurrentChapter(1);
      setReadComplete(false);
      setSequenceStep(0);
      setCelebrationActive(false);
      setBookClosing(false);
      setShowHeartOnly(false);
      setShowCreditsText(false);
    }, 5500);
  };

  return (
    <ChapterContainer
      chapterId={20}
      title=""
      subtitle=""
      showNext={false} // Finale manages navigation internally
    >
      {/* Background Override for gold/pink starlit final sky */}
      <style>{`
        body {
          background: ${
            readComplete
              ? "linear-gradient(to bottom, #11102A, #281B43, #50275B, #881B56)"
              : "linear-gradient(to bottom, #FFF1F2, #FFFBEB, #FFE4E6)"
          } !important;
          transition: background 3.5s ease-in-out;
        }
        @keyframes drift-fade-photo {
          0% {
            transform: translateY(100vh) rotate(0deg) scale(0.65);
            opacity: 0;
          }
          10% {
            opacity: 0.38;
          }
          90% {
            opacity: 0.38;
          }
          100% {
            transform: translateY(-20vh) rotate(15deg) scale(0.9);
            opacity: 0;
          }
        }
        .animate-floating-photo {
          animation: drift-fade-photo 16s linear forwards;
        }
        @keyframes page-close-slide {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-book-close {
          animation: page-close-slide 1.2s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
      `}</style>

      {/* Main Canvas Celebration engine */}
      <FinaleCanvas active={celebrationActive} />

      <div className="relative w-full py-4 select-none flex flex-col items-center justify-center min-h-[36rem]">
        
        {/* CHAPTER 20 PART 1: The Final Thank You Letter */}
        {!readComplete && (
          <div className="w-full max-w-2xl bg-white/90 border-glow-pink shadow-xl rounded-3xl p-6 md:p-10 z-10 flex flex-col items-center space-y-6 animate-envelope-open">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 washi-tape opacity-80 z-10 pointer-events-none" />

            <div className="text-center space-y-1">
              <span className="text-[10px] font-sans font-bold text-primary tracking-widest uppercase block flex justify-center items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> THE CLIMAX
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-pink-700 leading-tight">
                {finalLetterData.title}
              </h2>
            </div>

            <div className="w-full space-y-4 font-sans text-sm md:text-base text-rose-950/85 leading-relaxed text-left max-w-xl mx-auto bg-pink-50/20 p-5 rounded-2xl border border-pink-100/30">
              {finalLetterData.paragraphs.map((para, i) => (
                <p key={i} className="indent-4">
                  {para}
                </p>
              ))}
            </div>

            <div className="pt-4 w-full flex justify-center border-t border-pink-100/40">
              <button
                onClick={handleFinishReading}
                className="px-8 py-3 bg-gradient-to-r from-primary via-accent to-primary text-white rounded-full font-bold uppercase tracking-wider text-xs border border-pink-100/50 hover:shadow-primary/20 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse"
              >
                Finish Reading 💌
              </button>
            </div>
          </div>
        )}

        {/* CHAPTER 20 PART 2: Cinematic Sky and Sequences */}
        {readComplete && (
          <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center space-y-12 z-20">
            
            {/* Floating Polaroid Photos (Fade and rise in the background) */}
            {sequenceStep >= 1 && sequenceStep < 4 && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {memoriesPhotos.map((src, i) => (
                  <div
                    key={i}
                    style={{
                      left: `${10 + (i * 12)}%`,
                      animationDelay: `${i * 1.5}s`,
                    }}
                    className="absolute bottom-0 w-24 md:w-32 animate-floating-photo opacity-0 pointer-events-none"
                  >
                    <Polaroid src={src} alt="Memory" rotate={i % 2 === 0 ? -5 : 5} />
                  </div>
                ))}
              </div>
            )}

            {/* Sequence 1: "One Last Thing..." */}
            {sequenceStep === 1 && (
              <div className="animate-envelope-open">
                <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-wide text-glow-rose">
                  One Last Thing...
                </h1>
              </div>
            )}

            {/* Sequence 2: "Thank you for being my sister." */}
            {sequenceStep === 2 && (
              <div className="animate-envelope-open">
                <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-wide text-glow-rose">
                  Thank you for being my sister.
                </h1>
              </div>
            )}

            {/* Sequence 3: "Happy Birthday, Hari." ❤️ */}
            {sequenceStep === 3 && (
              <div className="animate-envelope-open flex flex-col items-center space-y-3">
                <Heart className="w-16 h-16 text-primary fill-primary animate-pulse" />
                <h1 className="text-4xl md:text-6xl font-display font-extrabold text-glow-rose text-white leading-tight">
                  Happy Birthday, Hari. ❤️
                </h1>
              </div>
            )}

            {/* Sequence 4: Grand Finale Climax Page */}
            {sequenceStep === 4 && (
              <div className="w-full flex flex-col items-center space-y-8 animate-envelope-open max-w-3xl">
                
                {/* Hero Header */}
                <div className="space-y-3 text-center">
                  <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white leading-tight drop-shadow-[0_4px_16px_rgba(244,63,94,0.4)]">
                    🎂 Happy Birthday Haripriya ❤️
                  </h1>
                  <p className="text-sm md:text-lg text-pink-200/90 font-display italic font-semibold max-w-xl mx-auto">
                    &ldquo;The best gift I could ever give you isn't something I could buy... It's the memories we've created together.&rdquo;
                  </p>
                </div>

                {/* Sibling & Family Photos framed side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl px-6">
                  
                  {/* Sibling Frame */}
                  <div className="scrapbook-page bg-white p-4 shadow-2xl rounded-2xl hover:scale-102 hover:rotate-1 transition-all duration-300 border border-glow-pink">
                    <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border bg-neutral-100 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/api/assets/chapters/chapter-20-ending/images/siblings.jpeg"
                        alt="Siblings photo"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="font-display font-bold text-pink-700 block text-center mt-3 text-sm">
                      My Favorite Sister ❤️
                    </span>
                  </div>

                  {/* Family Frame */}
                  <div className="scrapbook-page bg-white p-4 shadow-2xl rounded-2xl hover:scale-102 hover:-rotate-1 transition-all duration-300 border border-glow-pink">
                    <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border bg-neutral-100 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/api/assets/chapters/chapter-20-ending/images/Family.jpeg"
                        alt="Family photo"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="font-display font-bold text-pink-700 block text-center mt-3 text-sm">
                      Our Pillars 🏡
                    </span>
                  </div>

                </div>

                {/* Final message text */}
                <p className="text-xs md:text-sm text-neutral-300/90 leading-relaxed font-sans max-w-md mx-auto font-medium">
                  No matter where life takes us... you'll always be my favourite sister, my biggest supporter, and one of the greatest blessings in my life.
                </p>

                {/* Replay controller button */}
                <div className="pt-4 flex flex-col items-center space-y-4">
                  <button
                    onClick={handleReplay}
                    className="px-8 py-3 bg-gradient-to-r from-primary via-accent to-primary text-white rounded-full font-bold uppercase tracking-wider text-xs border border-pink-500/20 hover:shadow-primary/20 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" /> Read Our Story Again
                  </button>

                  <span className="text-[10px] italic font-display text-pink-300 font-extrabold">
                    &ldquo;Made with all my love, time, memories... and a little bit of annoying brother energy. 🤍&rdquo;
                  </span>
                </div>

              </div>
            )}

          </div>
        )}

        {/* CHAPTER 20 PART 3: Grand Book Closing Animation overlay */}
        {bookClosing && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6 animate-book-close select-none">
            {showHeartOnly && (
              <div className="text-center space-y-6 animate-envelope-open flex flex-col items-center">
                <Heart className="w-20 h-20 fill-primary text-primary animate-pulse-heart shadow-primary/30" />
                
                {showCreditsText && (
                  <div className="space-y-1 animate-line">
                    <h2 className="text-2xl font-display font-extrabold text-white tracking-wide">
                      Made with ❤️ by your annoying little brother.
                    </h2>
                    <p className="text-[10px] uppercase font-sans tracking-widest text-neutral-500 font-bold">
                      Thanks for playing through
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </ChapterContainer>
  );
}
