"use client";

import content from "@/chapters/chapter-01-home/content/content.json";
import FadeIn from "./FadeIn";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import HeroImage from "./HeroImage";
import { ArrowRight } from "lucide-react";
import { useChapterTransition } from "./TransitionScreen";

export default function HeroScreen() {
  const transitionTo = useChapterTransition();

  const handleContinue = () => {
    transitionTo(2);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-tr from-[#FFF5F7] via-[#FFF0F5] to-[#F5F3FF] flex flex-col justify-between items-center py-16 px-6 overflow-hidden select-none">
      {/* Background glow & floating hearts */}
      <BackgroundGlow color="rose" size={500} className="top-1/4 left-1/4" />
      <BackgroundGlow color="violet" size={400} className="bottom-1/4 right-1/4" />
      <FloatingHearts />

      {/* Main Grid Content */}
      <div className="flex-1 max-w-4xl w-full flex flex-col md:flex-row justify-center items-center gap-12 md:gap-16 z-10 my-auto">
        
        {/* Left Side: Text Details */}
        <div className="flex-1 text-center md:text-left space-y-6 max-w-md">
          <FadeIn delay={0.2} direction="up">
            <span className="text-xs uppercase tracking-widest text-primary font-bold text-glow-rose">
              Welcome Portal
            </span>
          </FadeIn>

          <div className="space-y-2">
            <FadeIn delay={0.4} direction="up">
              <h1 className="text-4xl md:text-5xl font-display font-extrabold text-pink-700 leading-tight tracking-tight">
                {content.title}
              </h1>
            </FadeIn>
            <FadeIn delay={0.6} direction="up">
              <p className="text-base text-rose-400 font-sans font-bold tracking-wider">
                {content.date}
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.8} direction="up">
            <p className="text-sm md:text-base text-rose-950/80 leading-relaxed italic border-l-2 border-primary/30 pl-4 py-1">
              "{content.quote}"
            </p>
          </FadeIn>
        </div>

        {/* Right Side: Floating Portrait Photo */}
        <div className="flex-1 flex justify-center items-center">
          <FadeIn delay={0.6} direction="none">
            <HeroImage
              src="/api/assets/chapters/chapter-01-home/images/hero.jpeg"
              alt="Hari Hero Photo"
            />
          </FadeIn>
        </div>

      </div>

      {/* Bottom Center Navigation Button */}
      <div className="z-10 mt-12">
        <FadeIn delay={1.0} direction="up">
          <button
            onClick={handleContinue}
            className="group px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold uppercase tracking-wider text-xs flex items-center gap-2 border border-pink-100/50 hover:shadow-primary/25 transition-all duration-300 shadow-md cursor-pointer"
          >
            🌸 Open My Gift
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </button>
        </FadeIn>
      </div>
    </div>
  );
}
