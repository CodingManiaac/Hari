"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { VolumeX, Music } from "lucide-react";

export default function MusicPlayer() {
  const {
    isMuted,
    volume,
    currentTrack,
    isPlaying,
    setMuted,
    setPlaying,
    setCurrentTrack,
  } = useStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize track default for loading
  useEffect(() => {
    const checkAudio = async () => {
      try {
        const response = await fetch("/api/assets/assets/music/birthday-ambient.mp3", { method: "HEAD" });
        if (response.ok) {
          setCurrentTrack("/api/assets/assets/music/birthday-ambient.mp3");
        } else {
          // Fallback to a beautiful ambient piano track
          setCurrentTrack("https://www.chosic.com/wp-content/uploads/2021/04/Warm-Memories.mp3");
        }
      } catch (err) {
        setCurrentTrack("https://www.chosic.com/wp-content/uploads/2021/04/Warm-Memories.mp3");
      }
    };
    checkAudio();
  }, [setCurrentTrack]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack || "");
      audioRef.current.loop = true;
    } else if (currentTrack) {
      audioRef.current.src = currentTrack;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && !isMuted) {
      audioRef.current.play().catch(() => {
        // Handle autoplay policy block
        setPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, isMuted, setPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    setPlaying(!isPlaying);
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
      {/* Small Floating Bouncing Music Icon (no Framer Motion) */}
      <button
        onClick={togglePlay}
        className={`w-11 h-11 rounded-full glassmorphism-pink border border-primary/20 flex items-center justify-center shadow-lg text-primary hover:text-primary hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer relative ${
          isPlaying && !isMuted ? "animate-pulse" : ""
        }`}
        aria-label="Toggle music"
      >
        {isPlaying && !isMuted ? (
          <Music className="w-5 h-5 text-primary" />
        ) : (
          <VolumeX className="w-5 h-5 text-rose-300" />
        )}

        {/* Small floating particles when playing */}
        {isPlaying && !isMuted && (
          <div className="absolute -top-2 -left-2 flex gap-0.5 pointer-events-none">
            <span className="text-[10px] animate-pulse">🎵</span>
            <span className="text-[8px] animate-bounce">❤️</span>
          </div>
        )}
      </button>
    </div>
  );
}
