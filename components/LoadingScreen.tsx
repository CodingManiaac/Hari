"use client";

import { useEffect, useState } from "react";
import { useChapterTransition } from "./TransitionScreen";
import Image from "next/image";
import content from "@/chapters/chapter-00-loading/content/content.json";
import FloatingHearts from "./FloatingHearts";

export default function LoadingScreen() {
  const [scene, setScene] = useState(1);
  const [captionOpacity, setCaptionOpacity] = useState(1);
  const [typedText, setTypedText] = useState("");
  const transitionTo = useChapterTransition();

  // Timeline scheduler for the cinematic Scenes 1-5
  useEffect(() => {
    // Scene 1: Starts soft. particles fade in after 1.5s
    const t2 = setTimeout(() => setScene(2), 1500); // Start Scene 2 typewriter
    const t3 = setTimeout(() => {
      // Scene 3: Fade in main title
      setScene(3);
      setCaptionOpacity(0.65); // Scene 2 caption opacity dims to 65%
    }, 6000);
    const t4 = setTimeout(() => setScene(4), 8000);  // Scene 4: Portrait appears
    const t5 = setTimeout(() => setScene(5), 10500); // Scene 5: CTA button appears

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Typewriter effect logic for Scene 2
  useEffect(() => {
    if (scene < 2) return;
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + content.caption.charAt(index));
      index++;
      if (index >= content.caption.length) {
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [scene]);

  const handleStart = () => {
    // Scene 6: Trigger transition and switch to Chapter 1
    transitionTo(1);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-tr from-[#FFF5F7] via-[#FFF0F5] to-[#F5F3FF] flex flex-col items-center justify-center py-16 px-6 text-center select-none overflow-y-auto">
      {/* Floating particles background */}
      <FloatingHearts />

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center gap-12">
        {/* Caption (Scene 2) */}
        <div className="h-10 flex items-center justify-center">
          {scene >= 2 && (
            <p
              style={{
                opacity: captionOpacity,
                transition: "opacity 0.8s ease",
              }}
              className="text-xs md:text-sm uppercase tracking-widest text-primary font-bold italic"
            >
              {typedText}
              {typedText.length < content.caption.length && (
                <span className="animate-pulse">|</span>
              )}
            </p>
          )}
        </div>

        {/* Main Title (Scene 3) */}
        <div className="h-20 flex items-center justify-center">
          <h1
            className={`text-3xl md:text-5xl font-display font-bold text-pink-700 text-glow-rose leading-tight tracking-tight transition-all duration-[1200ms] ease-out transform ${
              scene >= 3 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
            }`}
          >
            {content.mainTitle}
          </h1>
        </div>

        {/* Portrait Image (Scene 4) */}
        <div className="min-h-[20rem] flex items-center justify-center">
          <div
            className={`relative w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden scrapbook-page p-2.5 border border-pink-100 shadow-xl transition-all duration-[1500ms] ease-out transform ${
              scene >= 4 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
            }`}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden border border-pink-50 bg-pink-50">
              {/* Ken Burns slow zoom animation using hardware-accelerated CSS keyframes */}
              {scene >= 4 && (
                <div className="w-full h-full relative animate-gentle-zoom">
                  <Image
                    src="/api/assets/chapters/chapter-00-loading/images/Potrait.jpeg"
                    alt={content.name}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* CTA Button (Scene 5) */}
        <div className="h-16 flex items-center justify-center">
          <button
            onClick={handleStart}
            className={`px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold uppercase tracking-widest text-xs shadow-xl shadow-primary/10 hover:shadow-primary/25 hover:scale-105 active:scale-95 border border-pink-100/50 cursor-pointer transition-all duration-[800ms] ease-out transform ${
              scene >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            🎁 Begin the Journey
          </button>
        </div>
      </div>
    </div>
  );
}
