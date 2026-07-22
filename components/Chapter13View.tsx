"use client";

import { useEffect, useRef, useState } from "react";
import playlistData from "@/chapters/chapter-13/content/playlist.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import { Music, Play, Heart, Disc } from "lucide-react";

interface Song {
  title: string;
  artist: string;
  reason: string;
}

interface NoteParticle {
  x: number;
  y: number;
  char: string;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  wobbleSpeed: number;
  wobbleAngle: number;
}

// Canvas engine drawing floating music notes
function MusicNotesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const notesList: NoteParticle[] = [];
    const noteChars = ["🎵", "🎶", "♪", "♩", "♫", "♬"];

    const createNote = (isInitial = false): NoteParticle => ({
      x: Math.random() * width,
      y: isInitial ? Math.random() * height : height + 20,
      char: noteChars[Math.floor(Math.random() * noteChars.length)],
      size: Math.random() * 8 + 12,
      speedY: -(Math.random() * 1.0 + 0.4), // rise speed
      speedX: Math.random() * 0.4 - 0.2, // sideways speed
      opacity: Math.random() * 0.5 + 0.2,
      wobbleSpeed: Math.random() * 0.02 + 0.005,
      wobbleAngle: Math.random() * Math.PI * 2,
    });

    const count = 16;
    for (let i = 0; i < count; i++) {
      notesList.push(createNote(true));
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      notesList.forEach((n) => {
        n.y += n.speedY;
        n.wobbleAngle += n.wobbleSpeed;
        n.x += n.speedX + Math.sin(n.wobbleAngle) * 0.2; // wobble wave
        n.opacity -= 0.0008; // slow fade

        if (n.y < -30 || n.opacity <= 0) {
          Object.assign(n, createNote(false));
        }

        ctx.beginPath();
        ctx.font = `${n.size}px sans-serif`;
        ctx.fillStyle = `rgba(244, 63, 94, ${n.opacity})`;
        ctx.fillText(n.char, n.x, n.y);
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

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />;
}

export default function Chapter13View() {
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const colors = [
    "from-pink-100 to-rose-200 border-pink-200 shadow-pink-100/50",
    "from-purple-100 to-lavender-200 border-purple-200 shadow-purple-100/50",
    "from-orange-100 to-peach-200 border-orange-200 shadow-orange-100/50",
  ];

  return (
    <ChapterContainer
      chapterId={13}
      title="Playlist of Memories"
      subtitle="A collection of beautiful songs that always bring back memories of my sister, our home, and family."
    >
      <div className="relative w-full py-8 select-none flex flex-col items-center justify-center space-y-12">
        {/* Floating notes canvas overlays */}
        <MusicNotesCanvas />
        <BackgroundGlow color="rose" size={500} className="top-1/4 left-1/4" />
        <BackgroundGlow color="violet" size={400} className="bottom-1/4 right-1/4" />
        <FloatingHearts />

        {/* Vinyl / Cassette Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl w-full px-6 z-10">
          {playlistData.map((song: Song, idx: number) => {
            const isSelected = selectedTitle === song.title;
            const colorClass = colors[idx % colors.length];

            return (
              <div
                key={song.title}
                onClick={() => setSelectedTitle(isSelected ? null : song.title)}
                className="flex flex-col items-center cursor-pointer relative group"
              >
                {/* Vinyl Record sleeve cover (card) */}
                <div 
                  className={`relative w-56 h-56 rounded-2xl bg-gradient-to-tr border p-4 shadow-lg flex flex-col justify-between z-20 transition-all duration-500 ${colorClass} ${
                    isSelected ? "translate-y-[-10px] shadow-2xl scale-102 border-primary" : "hover:-translate-y-1"
                  }`}
                >
                  {/* Decorative Washi Tape top clip */}
                  <div className="absolute -top-3 left-6 w-10 h-3.5 washi-tape opacity-80 z-20 pointer-events-none" />

                  {/* Vinyl grooves overlay illustration (sleeve center cutout circle) */}
                  <div className="w-20 h-20 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm shadow-inner absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center">
                      <Music className={`w-4 h-4 text-primary ${isSelected ? "animate-pulse" : ""}`} />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase tracking-widest font-sans font-bold text-rose-400 block">
                      Track #{idx + 1}
                    </span>
                    <h4 className="text-base font-display font-extrabold text-pink-700 leading-tight truncate max-w-[12rem]">
                      {song.title}
                    </h4>
                    <p className="text-[10px] font-sans font-bold text-rose-950/60 leading-tight">
                      by {song.artist}
                    </p>
                  </div>

                  {/* Read / Tap prompt */}
                  <div className="flex justify-between items-center text-[9px] font-sans font-bold text-rose-300 uppercase tracking-widest pt-2 border-t border-pink-200/30">
                    <span>Tape Box</span>
                    <span className="group-hover:text-primary transition-colors">
                      {isSelected ? "Tap to Close ✕" : "Tap to Open 🔀"}
                    </span>
                  </div>
                </div>

                {/* Spinning Vinyl Record popping out from behind */}
                <div
                  style={{
                    "--vinyl-x": "0px",
                    "--vinyl-y": isSelected ? "-50px" : "0px",
                    opacity: isSelected ? 1 : 0,
                    zIndex: isSelected ? 10 : 0,
                    transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
                  } as any}
                  className={`absolute w-48 h-48 rounded-full bg-neutral-900 border-[6px] border-neutral-800 flex items-center justify-center shadow-2xl shadow-primary/20 pointer-events-none transform translate-y-0 ${
                    isSelected ? "animate-spin-slow ring-4 ring-primary/10 shadow-primary/20" : ""
                  }`}
                >
                  {/* Vinyl grooves rings */}
                  <div className="absolute inset-2 rounded-full border border-neutral-700/40 pointer-events-none" />
                  <div className="absolute inset-5 rounded-full border border-neutral-700/40 pointer-events-none" />
                  <div className="absolute inset-8 rounded-full border border-neutral-700/40 pointer-events-none" />
                  <div className="absolute inset-11 rounded-full border border-neutral-700/40 pointer-events-none" />
                  
                  {/* Vinyl Label */}
                  <div className="w-16 h-16 rounded-full bg-pink-100 border-[3px] border-pink-200 flex flex-col items-center justify-center text-center p-1 pointer-events-none">
                    <span className="text-[7px] font-display font-extrabold text-pink-700 leading-tight truncate w-12">
                      {song.title}
                    </span>
                    <Heart className="w-2.5 h-2.5 fill-primary text-primary mt-0.5 animate-pulse" />
                  </div>
                </div>

                {/* Expandable handwritten reason message (slides down/reveals) */}
                <div
                  style={{
                    maxHeight: isSelected ? "300px" : "0px",
                    opacity: isSelected ? 1 : 0,
                    marginTop: isSelected ? "14px" : "0px",
                    transition: "all 0.5s ease-in-out",
                  }}
                  className="w-56 overflow-hidden z-20 text-center"
                >
                  <div className="p-4 scrapbook-page border-glow-pink rounded-xl shadow-md text-left space-y-3 bg-white/95">
                    <p className="text-xs font-sans text-rose-950/80 leading-relaxed font-semibold italic border-l-2 border-primary/20 pl-2">
                      &ldquo;{song.reason}&rdquo;
                    </p>

                    <button
                      disabled
                      className="w-full py-1.5 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/10 text-primary rounded-lg text-[9px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 cursor-not-allowed opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Play Song (Locked)
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* sibling theme quotes footer sticker */}
        <div className="z-10 bg-white/70 border border-pink-100/50 p-5 rounded-2xl shadow-sm text-center max-w-sm mt-12 animate-card-float">
          <p className="font-display text-lg text-pink-700 font-extrabold italic leading-snug">
            &ldquo;Every song has a memory. Every memory has you.&rdquo; ❤️
          </p>
        </div>
      </div>
    </ChapterContainer>
  );
}
