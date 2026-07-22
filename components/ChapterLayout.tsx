"use client";

import { useState } from "react";
import { useChapterTransition } from "./TransitionScreen";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Toast from "./Toast";

interface ChapterLayoutProps {
  chapterId: number;
  title: React.ReactNode; // Accept ReactNode to allow custom titles with icons
  subtitle?: string;
  children: React.ReactNode;
  showNext?: boolean;
}

export default function ChapterLayout({
  chapterId,
  title,
  subtitle,
  children,
  showNext = true,
}: ChapterLayoutProps) {
  const transitionTo = useChapterTransition();
  const [showToast, setShowToast] = useState(false);

  const handleNext = () => {
    // Show toast for Chapter 20 which is currently the end of progression scope
    if (chapterId >= 20) {
      setShowToast(true);
    } else {
      transitionTo(chapterId + 1);
    }
  };

  const handlePrev = () => {
    transitionTo(Math.max(chapterId - 1, 1));
  };

  // Custom button labels requested for the story progression
  const getNextButtonLabel = () => {
    switch (chapterId) {
      case 2:
        return "💖 Show Me More";
      case 3:
        return "🦋 Another Memory";
      case 4:
        return "✨ Let's Go";
      case 5:
        return "🎈 Next Surprise";
      case 6:
        return "🎁 Reveal Another Memory";
      case 7:
        return "🌸 Continue Our Journey";
      case 8:
        return "💖 Open Another Surprise";
      case 9:
        return "🌸 Continue Our Journey";
      case 10:
        return "🌷 See My Wishes For You";
      case 11:
        return "🌸 Continue Our Journey";
      case 12:
        return "🎀 One More Surprise Awaits";
      case 13:
        return "🌸 Continue Our Journey";
      case 14:
        return "🌸 One Last Adventure";
      case 15:
        return "🌸 Continue Our Journey";
      case 16:
        return "✨ Almost There...";
      case 17:
        return "🌸 Continue Our Journey";
      case 18:
        return "🌸 One Last Page";
      case 19:
        return "🎂 Open My Final Gift";
      default:
        return "Keep Exploring 🎂";
    }
  };

  return (
    <div className="w-full min-h-screen relative flex flex-col justify-between py-12 px-6 overflow-hidden">
      {/* Chapter header */}
      <header className="max-w-4xl mx-auto w-full text-center mb-12 space-y-2">
        <span className="text-xs uppercase tracking-widest text-primary font-bold">
          Chapter {chapterId.toString().padStart(2, "0")}
        </span>
        <h2 className="text-3xl md:text-5xl font-display font-bold text-pink-700 text-glow-rose">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-rose-950/70 max-w-md mx-auto font-sans font-medium">
            {subtitle}
          </p>
        )}
      </header>

      {/* Main Chapter Content Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full z-10">
        {children}
      </main>

      {/* Bottom chapter nav buttons */}
      <footer className="max-w-4xl mx-auto w-full flex justify-between items-center mt-16 pt-6 border-t border-pink-100/50">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-rose-400 font-bold hover:text-rose-600 transition-colors duration-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          disabled={chapterId <= 1}
        >
          <ChevronLeft className="w-4 h-4" />
          Prev Page
        </button>

        <span className="text-xs font-sans font-semibold text-rose-300/80">
          Page {chapterId}
        </span>

        {showNext ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-primary font-bold hover:text-pink-600 transition-colors duration-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            disabled={chapterId === 20}
          >
            {getNextButtonLabel()}
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-24" />
        )}
      </footer>

      {/* Centralized Toast Warning for Locked Chapters */}
      <Toast
        message={`Chapter ${(chapterId + 1).toString().padStart(2, "0")} will be added in the next development phase.`}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
