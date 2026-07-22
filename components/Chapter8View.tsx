"use client";

import { useEffect, useRef, useState } from "react";
import lettersData from "@/chapters/chapter-08/content/letters.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import { X, Heart, MailOpen } from "lucide-react";

interface Letter {
  id: number;
  title: string;
  author: string;
  message: string;
}

// Canvas-based hearts rising effect when opening a letter
function RisingHeartsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const hearts: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      scaleSpeed: number;
      scale: number;
    }> = [];

    const spawnHeart = (isInitial = false) => ({
      x: Math.random() * width,
      y: isInitial ? Math.random() * height : height + 20,
      size: Math.random() * 8 + 6,
      speedY: -(Math.random() * 1.5 + 0.8), // rising up
      speedX: Math.random() * 0.8 - 0.4, // slight side drift
      opacity: Math.random() * 0.6 + 0.3,
      scaleSpeed: Math.random() * 0.01 + 0.005,
      scale: Math.random() * 0.5 + 0.5,
    });

    const maxHearts = 30;
    for (let i = 0; i < maxHearts; i++) {
      hearts.push(spawnHeart(true));
    }

    let animationId: number;

    const drawHeartPath = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.moveTo(x, y + size / 4);
      ctx.quadraticCurveTo(x, y, x + size / 2, y);
      ctx.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      ctx.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
      ctx.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 3);
      ctx.quadraticCurveTo(x, y, x, y + size / 4);
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      hearts.forEach((h) => {
        h.y += h.speedY;
        h.x += h.speedX;
        h.opacity -= 0.0015; // slow fade

        if (h.y < -20 || h.opacity <= 0) {
          Object.assign(h, spawnHeart(false));
        }

        ctx.beginPath();
        drawHeartPath(ctx, h.x, h.y, h.size);
        ctx.fillStyle = `rgba(244, 63, 94, ${h.opacity})`;
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

export default function Chapter8View() {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [typedMessage, setTypedMessage] = useState("");

  // Staggered envelope offsets for a hand-crafted scrapbook look
  const rotations = [-4, 3, -1, 4, -2];
  const colors = [
    "from-pink-50 to-rose-100/50 border-pink-200",
    "from-purple-50 to-lavender-100/50 border-purple-200",
    "from-orange-50 to-peach-100/50 border-orange-200",
    "from-rose-50 to-pink-100/50 border-pink-200",
    "from-purple-50 to-pink-100/50 border-purple-200",
  ];

  // Typewriter effect inside the letter modal
  useEffect(() => {
    if (!selectedLetter) {
      setTypedMessage("");
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      setTypedMessage((prev) => prev + selectedLetter.message.charAt(index));
      index++;
      if (index >= selectedLetter.message.length) {
        clearInterval(interval);
      }
    }, 20); // Steady reading speed typing

    return () => clearInterval(interval);
  }, [selectedLetter]);

  return (
    <ChapterContainer
      chapterId={8}
      title="Secret Letters"
      subtitle="Handwritten letters filled with thoughts, apologies, and the promises I hold dear."
    >
      <div className="relative w-full py-8 min-h-[30rem] flex flex-col items-center justify-center select-none">
        {/* Glow rings & default floating heart particles */}
        <BackgroundGlow color="rose" size={500} className="top-1/4 left-1/4" />
        <BackgroundGlow color="violet" size={400} className="bottom-1/4 right-1/4" />
        <FloatingHearts />

        {/* Collaged Envelopes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-4xl w-full px-6 z-10 justify-items-center">
          {lettersData.map((letter: Letter, index: number) => {
            const rotation = rotations[index % rotations.length];
            const colorClass = colors[index % colors.length];

            return (
              <div
                key={letter.id}
                style={{
                  "--rot": `${rotation}deg`,
                  animationDelay: `${index * 0.25}s`,
                } as any}
                onClick={() => setSelectedLetter(letter)}
                className="relative w-64 h-44 bg-gradient-to-tr border rounded-2xl shadow-lg flex flex-col items-center justify-center cursor-pointer group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 animate-letter-float active:scale-95"
              >
                {/* Envelope fold diagonal lines */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${colorClass}`} />
                
                {/* Envelope Flap Overlay Triangle */}
                <div className="absolute top-0 left-0 w-full h-0 border-t-[88px] border-t-pink-200/20 border-x-[128px] border-x-transparent z-10 pointer-events-none" />

                {/* Envelope seal shadow */}
                <div className="absolute bottom-4 left-6 right-6 text-center z-10 select-none opacity-40 group-hover:opacity-80 transition-opacity duration-300">
                  <span className="text-[10px] font-sans font-bold text-rose-950 uppercase tracking-widest block">
                    Click to Open
                  </span>
                </div>

                {/* Red Wax Seal badge */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-red-600 shadow-md border-2 border-red-400 flex items-center justify-center text-white z-20 transition-all duration-300 group-hover:scale-115 group-hover:rotate-12">
                  <Heart className="w-5 h-5 fill-white text-white" />
                </div>

                {/* Mini author index sticker */}
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-white/70 border border-pink-100 rounded-md text-[8px] font-sans font-bold text-rose-400 select-none z-10 uppercase tracking-widest">
                  Letter {letter.id}
                </div>
              </div>
            );
          })}
        </div>

        {/* Backdrop modal reader sheet (React Conditional Mount) */}
        {selectedLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur overlay */}
            <div
              onClick={() => setSelectedLetter(null)}
              className="absolute inset-0 bg-pink-950/45 backdrop-blur-md animate-backdrop"
            />

            {/* Rising hearts canvas inside the modal */}
            <RisingHeartsCanvas />

            {/* Letter Paper sheet */}
            <div className="relative z-20 w-full max-w-xl animate-envelope-open select-none">
              <div className="w-full scrapbook-page border-glow-pink shadow-2xl rounded-3xl p-6 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[26rem]">
                
                {/* Washi tape overlays at top corners */}
                <div className="absolute -top-3 left-10 w-12 h-4 washi-tape opacity-80 z-10 pointer-events-none" />
                <div className="absolute -top-3 right-10 w-12 h-4 washi-tape opacity-80 z-10 pointer-events-none" />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 transition-all cursor-pointer border border-pink-100/50 shadow-sm"
                  aria-label="Close letter"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Letter Content */}
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  
                  {/* Header Title */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-sans font-bold text-primary tracking-widest uppercase block border-b border-pink-100 pb-2">
                      Secret Letter
                    </span>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-pink-700 leading-snug">
                      {selectedLetter.title}
                    </h3>
                  </div>

                  {/* Body message paper lines */}
                  <div className="flex-1 my-4 min-h-[12rem] bg-repeat-y bg-[linear-gradient(rgba(244,63,94,0.05)_1px,transparent_1px)] bg-[size:100%_2rem] py-1">
                    <p className="font-display text-base md:text-lg text-rose-950/90 leading-[2rem] font-medium whitespace-pre-line">
                      {typedMessage}
                      {typedMessage.length < selectedLetter.message.length && (
                        <span className="animate-pulse text-primary font-bold ml-0.5">|</span>
                      )}
                    </p>
                  </div>

                  {/* Cursive Signature Footer */}
                  <div className="flex justify-between items-end border-t border-pink-100 pt-4 font-sans text-xs">
                    <span className="text-[9px] uppercase tracking-wider text-rose-300 font-bold flex items-center gap-1">
                      <MailOpen className="w-3.5 h-3.5" /> Opened
                    </span>
                    <div className="text-right">
                      <span className="text-[9px] uppercase text-rose-400 block tracking-widest">With Love,</span>
                      <span className="font-display text-lg text-pink-600 font-extrabold block leading-tight">
                        {selectedLetter.author}
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </ChapterContainer>
  );
}
