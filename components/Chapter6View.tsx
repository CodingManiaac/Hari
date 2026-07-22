"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import content from "@/chapters/chapter-06/content/content.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";

export default function Chapter6View() {
  const [typedText, setTypedText] = useState("");
  const [imageError, setImageError] = useState(false);

  // Typewriter effect triggered after the Polaroid lands (1.4s delay)
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        setTypedText((prev) => prev + content.description.charAt(index));
        index++;
        if (index >= content.description.length) {
          clearInterval(interval);
        }
      }, 25); // 25ms delay per char for steady typing speed
      return () => clearInterval(interval);
    }, 1400);

    return () => clearTimeout(startTimeout);
  }, []);

  const imagePath = "/api/assets/chapters/chapter-06/images/memory.jpeg";

  return (
    <ChapterContainer
      chapterId={6}
      title={content.title}
      subtitle="A lighthearted reminder of those precious little moments where you are completely in your own world."
    >
      <div className="relative w-full py-8 space-y-12 flex flex-col items-center select-none">
        {/* Ambient sparkles and floating heart particles */}
        <BackgroundGlow color="rose" size={500} className="top-1/4 -left-20" />
        <BackgroundGlow color="violet" size={400} className="bottom-1/4 -right-20" />
        <FloatingHearts />

        {/* Central Scrapbook Polaroid Frame Container */}
        <div className="relative w-full max-w-sm md:max-w-md px-6 py-4 flex justify-center z-10">
          
          {/* Polaroid photo dropping into place */}
          <div className="relative bg-white p-4 pb-12 shadow-2xl border border-pink-100/50 rounded-sm w-72 h-96 md:w-80 md:h-[26rem] flex flex-col justify-between animate-polaroid-drop">
            
            {/* Washi tape appearing on the card top */}
            <div 
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 washi-tape z-20 pointer-events-none animate-tape-reveal" 
            />

            {/* Polaroid Photo Image Cover */}
            <div className="relative flex-1 w-full overflow-hidden bg-pink-50 rounded-sm border border-pink-50">
              {!imageError ? (
                <Image
                  src={imagePath}
                  alt={content.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 256px, 320px"
                  onError={() => setImageError(true)}
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-lavender-50 flex flex-col items-center justify-center text-pink-300 text-xs">
                  📸
                  <span className="mt-1 text-[10px] text-pink-400">(memory.jpg)</span>
                </div>
              )}
            </div>

            {/* Cursive Polaroid Footer Caption */}
            <div className="mt-4 text-center">
              <span className="font-display text-xl text-pink-700/80 font-bold">
                Mood: {content.mood} 💖
              </span>
            </div>

            {/* Cute stickers scattered around the Polaroid */}
            
            {/* Sticker 1: Headphones (Top Left) */}
            <div 
              style={{ 
                "--sticker-rot": "-12deg",
                "--sticker-rot-hover": "-16deg",
                animationDelay: "1.4s"
              } as any}
              className="absolute -top-4 -left-6 w-11 h-11 bg-pink-50 border border-pink-100 rounded-xl shadow-md flex items-center justify-center text-xl select-none z-10 animate-sticker-pop hover:scale-110 transition-transform duration-300"
            >
              🎧
            </div>

            {/* Sticker 2: Music notes (Top Right) */}
            <div 
              style={{ 
                "--sticker-rot": "15deg",
                "--sticker-rot-hover": "20deg",
                animationDelay: "1.6s"
              } as any}
              className="absolute -top-1 -right-6 w-11 h-11 bg-purple-50 border border-purple-100 rounded-xl shadow-md flex items-center justify-center text-xl select-none z-10 animate-sticker-pop hover:scale-110 transition-transform duration-300"
            >
              🎶
            </div>

            {/* Sticker 3: Pizza snack (Bottom Left) */}
            <div 
              style={{ 
                "--sticker-rot": "8deg",
                "--sticker-rot-hover": "12deg",
                animationDelay: "1.8s"
              } as any}
              className="absolute -bottom-4 -left-6 w-11 h-11 bg-orange-50 border border-orange-100 rounded-xl shadow-md flex items-center justify-center text-xl select-none z-10 animate-sticker-pop hover:scale-110 transition-transform duration-300"
            >
              🍕
            </div>

            {/* Sticker 4: Smirk sticker (Bottom Right) */}
            <div 
              style={{ 
                "--sticker-rot": "-10deg",
                "--sticker-rot-hover": "-15deg",
                animationDelay: "2.0s"
              } as any}
              className="absolute -bottom-6 -right-6 w-11 h-11 bg-pink-50 border border-pink-100 rounded-xl shadow-md flex items-center justify-center text-xl select-none z-10 animate-sticker-pop hover:scale-110 transition-transform duration-300"
            >
              😏
            </div>

          </div>
        </div>

        {/* Cursive handwritten story display */}
        <div className="w-full max-w-xl px-6 min-h-[8rem] text-center z-10">
          <p className="font-sans text-sm md:text-base text-rose-950/80 leading-relaxed font-medium bg-white/40 backdrop-blur-sm border border-pink-100/50 p-6 rounded-2xl shadow-sm">
            {typedText}
            {typedText.length < content.description.length && (
              <span className="animate-pulse font-sans font-bold text-primary ml-0.5">|</span>
            )}
          </p>
        </div>

      </div>
    </ChapterContainer>
  );
}
