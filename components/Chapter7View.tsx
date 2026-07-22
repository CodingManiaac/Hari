"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import content from "@/chapters/chapter-07/content/content.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import { Heart } from "lucide-react";

interface Petal {
  x: number;
  y: number;
  r: number;
  d: number;
  horizontalMovementSpeed: number;
  verticalMovementSpeed: number;
  angle: number;
  spinSpeed: number;
}

// Canvas-based drifting cherry blossom petals animation
function BlossomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const petals: Petal[] = [];
    const maxPetals = 22;

    const createPetal = (isInitial = false): Petal => ({
      x: Math.random() * width,
      y: isInitial ? Math.random() * height : -20,
      r: Math.random() * 5 + 4, // size
      d: Math.random() * 0.4 + 0.2, // drift factor
      horizontalMovementSpeed: Math.random() * 0.7 - 0.1, // slight rightward wind
      verticalMovementSpeed: Math.random() * 0.8 + 0.5, // fall speed
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() * 0.015 - 0.007) * Math.PI,
    });

    for (let i = 0; i < maxPetals; i++) {
      petals.push(createPetal(true));
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        // Update drift path values
        p.y += p.verticalMovementSpeed;
        p.x += p.horizontalMovementSpeed + p.d * 0.4;
        p.angle += p.spinSpeed;

        // Reset if off bounds
        if (p.y > height + 20 || p.x > width + 20 || p.x < -20) {
          Object.assign(p, createPetal(false));
        }

        // Draw soft pink cherry blossom shapes
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r * 1.5, p.r, p.angle, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(244, 63, 94, 0.18)"; // soft rose pink tint
        ctx.shadowColor = "rgba(244, 63, 94, 0.04)";
        ctx.shadowBlur = 3;
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

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

export default function Chapter7View() {
  const [imageError, setImageError] = useState(false);

  const imagePath = "/api/assets/chapters/chapter-07/images/childhood.jpeg";

  return (
    <ChapterContainer
      chapterId={7}
      title={
        <span className="inline-flex items-center gap-3">
          {content.title}
          <Heart className="w-6 h-6 fill-primary text-primary animate-pulse-heart flex-shrink-0" />
        </span>
      }
      subtitle="The foundational page of our storybook: capturing a beautiful, eternal bond."
    >
      <div className="relative w-full py-8 space-y-12 flex flex-col items-center select-none overflow-hidden">
        {/* Ambient glow backgrounds and custom blossom shower particles */}
        <BackgroundGlow color="violet" size={500} className="top-1/4 left-1/4" />
        <BackgroundGlow color="magenta" size={400} className="bottom-1/4 right-1/4" />
        <FloatingHearts />
        <BlossomCanvas />

        {/* Nostalgic childhood image cover card */}
        <div 
          style={{ animationDelay: "0.2s" }}
          className="relative w-full max-w-sm md:max-w-md px-6 py-4 flex justify-center z-10 animate-line"
        >
          <div className="bg-white p-3 shadow-2xl rounded-2xl border-2 border-pink-200/50 shadow-primary/10 overflow-hidden relative group max-w-xs md:max-w-sm">
            
            {/* Forever favourite badge sticker */}
            <div className="absolute top-6 left-6 px-3 py-1 bg-gradient-to-r from-primary to-accent text-white text-[9px] uppercase tracking-wider font-bold rounded-full shadow-md z-20 flex items-center gap-1 border border-pink-100/50 animate-bounce">
              <span>❤️</span> Forever My Favourite Memory
            </div>

            <div className="relative aspect-[3/4] w-64 md:w-80 rounded-xl overflow-hidden bg-pink-50 border border-pink-50">
              {!imageError ? (
                <div className="w-full h-full relative overflow-hidden">
                  {/* Ken Burns slow zoom animation */}
                  <Image
                    src={imagePath}
                    alt={content.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 256px, 320px"
                    onError={() => setImageError(true)}
                    className="object-cover animate-portrait-zoom"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-lavender-50 flex flex-col items-center justify-center text-pink-300 text-xs">
                  📸
                  <span className="mt-1 text-[10px] text-pink-400">(childhood.jpg)</span>
                </div>
              )}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none rounded-xl" />
          </div>
        </div>

        {/* Handwritten Staggered Story details */}
        <div className="w-full max-w-xl px-6 space-y-6 z-10 text-center">
          
          {/* Main Story Paragraph */}
          <p 
            style={{ animationDelay: "0.8s" }}
            className="font-sans text-sm md:text-base text-rose-950/80 leading-relaxed font-medium bg-white/40 backdrop-blur-sm border border-pink-100/50 p-6 rounded-2xl shadow-sm animate-line"
          >
            {content.description}
          </p>

          {/* Quote Card Display */}
          {content.quote && (
            <div 
              style={{ animationDelay: "1.4s" }}
              className="bg-pink-50/50 border border-pink-100 p-4 rounded-xl shadow-inner animate-line"
            >
              <p className="font-display text-lg text-pink-700/80 font-bold italic leading-relaxed">
                &ldquo;{content.quote}&rdquo;
              </p>
            </div>
          )}

        </div>

      </div>
    </ChapterContainer>
  );
}
