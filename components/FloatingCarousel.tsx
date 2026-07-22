"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FloatingCarouselProps {
  basePath: string;
}

export default function FloatingCarousel({ basePath }: FloatingCarouselProps) {
  const defaultImages = [
    { name: "profile.jpeg", label: "Profile" },
    { name: "smile.jpeg", label: "Smiling Sweetly" },
    { name: "traditional.jpeg", label: "Traditional Look" },
    { name: "selfie.jpeg", label: "Selfie Moment" },
    { name: "funny.jpeg", label: "Funny Face" },
  ];

  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const availableImages = defaultImages.filter((img) => !failedImages[img.name]);

  const handlePrev = () => {
    if (availableImages.length === 0) return;
    setCurrentIndex(
      (prev) => (prev - 1 + availableImages.length) % availableImages.length
    );
  };

  const handleNext = () => {
    if (availableImages.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % availableImages.length);
  };

  const handleImageError = (name: string) => {
    setFailedImages((prev) => ({ ...prev, [name]: true }));
    setCurrentIndex(0);
  };

  if (availableImages.length === 0) {
    return (
      <div className="w-72 h-96 md:w-80 md:h-[26rem] scrapbook-page rounded-2xl border border-pink-100 flex flex-col items-center justify-center text-center p-6 text-pink-300 text-xs">
        📸
        <span className="mt-2 font-semibold">No Carousel Images Loaded</span>
        <span className="text-[10px] text-rose-300/60 mt-1 max-w-[200px]">
          (Place profile.jpeg, smile.jpeg, traditional.jpeg, selfie.jpeg, or funny.jpeg inside chapters/chapter-02/images)
        </span>
      </div>
    );
  }

  const activeImage = availableImages[currentIndex] || availableImages[0];

  return (
    <div
      className="relative w-72 h-96 md:w-80 md:h-[26rem] rounded-2xl overflow-hidden scrapbook-page p-2.5 border border-pink-100 shadow-lg flex flex-col justify-between animate-carousel-float"
    >
      {/* Decorative Washi Tape clip */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-14 h-4 washi-tape opacity-80 z-20 pointer-events-none" />

      {/* Slides display */}
      <div className="relative flex-1 w-full rounded-xl overflow-hidden bg-pink-50 border border-pink-100">
        <AnimatePresence mode="wait">
          {activeImage && (
            <motion.div
              key={activeImage.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={`${basePath}${activeImage.name}`}
                alt={activeImage.label}
                fill
                sizes="(max-width: 768px) 256px, 320px"
                onError={() => handleImageError(activeImage.name)}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/10 via-transparent to-transparent pointer-events-none" />
              
              {/* Caption */}
              <div className="absolute bottom-4 inset-x-0 text-center">
                <span className="text-lg font-display font-bold text-pink-600 text-glow-rose">
                  {activeImage.label}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Controls */}
      {availableImages.length > 1 && (
        <div className="flex justify-between items-center px-4 py-2 mt-2 flex-shrink-0">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-full hover:bg-pink-50 text-rose-300 hover:text-rose-500 transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="text-[10px] font-sans font-bold text-rose-400">
            {currentIndex + 1} / {availableImages.length}
          </span>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-full hover:bg-pink-50 text-rose-300 hover:text-rose-500 transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
