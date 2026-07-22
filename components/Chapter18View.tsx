"use client";

import { useEffect, useState } from "react";
import letterData from "@/chapters/chapter-18/content/future-letter.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import { Sparkles, Edit3, Heart } from "lucide-react";

export default function Chapter18View() {
  const paragraphs = letterData.body.split("\n\n");
  const [completedParagraphs, setCompletedParagraphs] = useState<string[]>([]);
  const [activeParaIndex, setActiveParaIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Type out the active paragraph letter-by-letter
  useEffect(() => {
    if (activeParaIndex >= paragraphs.length) return;

    setIsTyping(true);
    setTypedText("");
    const textToType = paragraphs[activeParaIndex];
    let index = 0;
    
    const interval = setInterval(() => {
      setTypedText((prev) => prev + textToType.charAt(index));
      index++;
      if (index >= textToType.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15); // Handwriting ink speed

    return () => clearInterval(interval);
  }, [activeParaIndex]);

  const handleNextParagraph = () => {
    if (isTyping) return;
    
    // Add current typed paragraph to completed list
    setCompletedParagraphs((prev) => [...prev, paragraphs[activeParaIndex]]);
    setActiveParaIndex((prev) => prev + 1);
  };

  const isLetterComplete = activeParaIndex >= paragraphs.length - 1 && !isTyping;

  return (
    <ChapterContainer
      chapterId={18}
      title="To My Future Sister"
      subtitle="A letter written from the present to your future self, wrapped in sibling bonds and time."
      showNext={isLetterComplete} // Show page progress continue button only when all paragraphs are typed out
    >
      <div className="relative w-full py-8 select-none flex flex-col items-center justify-center">
        {/* Ambience & petals */}
        <BackgroundGlow color="rose" size={500} className="top-1/4 left-1/4" />
        <BackgroundGlow color="violet" size={400} className="bottom-1/4 right-1/4" />
        <FloatingHearts />

        {/* Large Unfolding Parchment Letter Sheet */}
        <div className="relative w-full max-w-2xl bg-[#FFFDF6] border-glow-pink shadow-2xl rounded-3xl p-6 md:p-10 z-10 flex flex-col items-center justify-between border border-pink-100/50 min-h-[34rem]">
          
          {/* Pink Ribbon & Wax Seal Decoration top headers */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
            {/* Soft pink ribbon wrap */}
            <div className="w-20 h-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full shadow-md" />
            {/* Wax seal circle stamp decoration */}
            <div className="w-8 h-8 rounded-full bg-red-700/90 border-2 border-amber-500 flex items-center justify-center shadow-md -mt-2 animate-pulse text-white text-[8px] font-sans font-bold uppercase tracking-wider">
              ❤️
            </div>
          </div>

          {/* Letter Body Parchment */}
          <div className="w-full space-y-6 mt-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Handwritten Title */}
              <h3 className="text-2xl md:text-3xl font-display font-extrabold text-pink-700 leading-tight text-center flex items-center justify-center gap-1.5 border-b border-pink-100/40 pb-4">
                <Edit3 className="w-5 h-5 text-primary" /> {letterData.title}
              </h3>

              {/* Typed/Revealed paragraphs */}
              <div className="space-y-4 font-display text-base md:text-lg text-rose-950/80 leading-relaxed text-left max-w-xl mx-auto px-2">
                {completedParagraphs.map((para, i) => (
                  <p key={i} className="whitespace-pre-line bg-gradient-to-r from-pink-50/20 to-transparent p-1.5 rounded-lg border-l-2 border-primary/10">
                    {para}
                  </p>
                ))}
                
                {/* Active typing paragraph */}
                {activeParaIndex < paragraphs.length && (
                  <p className="whitespace-pre-line bg-gradient-to-r from-pink-50/40 to-transparent p-1.5 rounded-lg border-l-2 border-primary">
                    {typedText}
                    {isTyping && <span className="animate-pulse text-primary font-bold ml-0.5">|</span>}
                  </p>
                )}
              </div>
            </div>

            {/* Paragraph trigger button */}
            {!isLetterComplete && (
              <div className="w-full pt-6 border-t border-pink-100/30 flex justify-center">
                <button
                  onClick={handleNextParagraph}
                  disabled={isTyping}
                  className={`px-8 py-3 bg-gradient-to-r from-primary via-accent to-primary text-white rounded-full font-bold uppercase tracking-wider text-xs border border-pink-100/50 shadow-md hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 ${
                    isTyping ? "opacity-50 cursor-not-allowed" : "cursor-pointer animate-pulse"
                  }`}
                >
                  {isTyping ? "Ink writing... ✍️" : "Read Next Paragraph ✍️"}
                </button>
              </div>
            )}

            {/* Signature at bottom */}
            {isLetterComplete && (
              <div className="w-full text-right font-display text-lg text-pink-700 font-extrabold pr-4 border-t border-pink-100/30 pt-4 flex justify-between items-center">
                <span className="text-[10px] text-rose-300 font-sans uppercase font-bold tracking-widest flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-primary text-primary" /> Letter Read
                </span>
                <span>{letterData.signature}</span>
              </div>
            )}

          </div>

        </div>
      </div>
    </ChapterContainer>
  );
}
