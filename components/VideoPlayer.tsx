"use client";

import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
}

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    if (duration > 0) {
      setProgress((current / duration) * 100);
    }
  };

  const handleScrub = (value: number) => {
    if (!videoRef.current) return;
    const duration = videoRef.current.duration;
    if (duration > 0) {
      videoRef.current.currentTime = (value / 100) * duration;
      setProgress(value);
    }
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden glassmorphism p-2 border border-white/10 group shadow-2xl">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60">
        {src ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-dark/40 via-magenta-dark/20 to-gold-950/20 flex flex-col items-center justify-center text-white/20 gap-3">
            <span className="text-sm">Video Player Placeholder</span>
            <span className="text-xs text-muted-foreground/60">(Drop video files in chapter asset directories to render)</span>
          </div>
        )}

        {/* Cinematic play overlays */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          >
            <div className="p-4 rounded-full bg-primary/95 text-primary-foreground shadow-lg scale-100 hover:scale-105 active:scale-95 transition-all duration-300">
              <Play className="w-6 h-6 fill-current" />
            </div>
          </div>
        )}

        {/* Video Control Bar overlay */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Progress bar */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => handleScrub(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
          />

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="hover:text-primary transition-colors">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button onClick={toggleMute} className="hover:text-primary transition-colors">
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={handleFullscreen} className="hover:text-primary transition-colors">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
