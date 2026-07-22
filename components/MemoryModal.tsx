"use client";

import { useEffect } from "react";
import { X, MapPin } from "lucide-react";
import Image from "next/image";

interface Memory {
  year: string;
  age: string;
  title: string;
  description: string;
  image: string;
  location?: string;
}

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memory: Memory | null;
  basePath: string;
}

export default function MemoryModal({
  isOpen,
  onClose,
  memory,
  basePath,
}: MemoryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !memory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Pink Tinted Backdrop Blur (pure CSS animation) */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-pink-950/40 backdrop-blur-md animate-backdrop"
      />

      {/* Modal Diary Sheet (pure CSS animation) */}
      <div className="relative z-10 w-full max-w-3xl animate-modal-sheet">
        <div className="w-full p-0 overflow-hidden scrapbook-page border-glow-pink shadow-2xl rounded-3xl relative">
          {/* Close Icon Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 transition-all cursor-pointer shadow-sm border border-pink-100/50"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col md:flex-row min-h-[22rem]">
            {/* Left Side: Photo panel */}
            <div className="relative flex-1 min-h-[16rem] md:min-h-auto bg-pink-50/50 border-b md:border-b-0 md:border-r border-pink-100">
              <Image
                src={`${basePath}${memory.image}`}
                alt={memory.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white/90 via-white/5 to-transparent pointer-events-none" />
            </div>

            {/* Right Side: Text details */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-sans text-primary font-bold tracking-widest uppercase">
                  <span>YEAR {memory.year}</span>
                  {memory.age !== "N/A" && <span>{memory.age}</span>}
                </div>

                <h3 className="text-xl md:text-2xl font-display font-bold text-pink-700 leading-snug">
                  {memory.title}
                </h3>

                <p className="text-sm text-rose-950/80 leading-relaxed font-sans">
                  {memory.description}
                </p>
              </div>

              {memory.location && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 border-t border-pink-100 pt-4 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{memory.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
