"use client";

import { useEffect, useState } from "react";
import videosData from "@/chapters/chapter-15/content/videos.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import FadeIn from "./FadeIn";
import { X, Play, Video, Film, Sparkles, AlertCircle, Heart } from "lucide-react";

interface VideoEntry {
  id: number;
  title: string;
  caption: string;
  video: string;
  thumbnail: string;
}

export default function Chapter15View() {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoEntry | null>(null);
  const [thumbErrors, setThumbErrors] = useState<Set<string>>(new Set());
  const [videoError, setVideoError] = useState(false);

  // Cinema modal state properties
  const [modalCurtainsOpen, setModalCurtainsOpen] = useState(false);
  const [countdown, setCountdown] = useState<string | number | null>(null);
  const [playbackActive, setPlaybackActive] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Trigger curtain opening for the main page entrance
  useEffect(() => {
    const timer = setTimeout(() => setCurtainsOpen(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Handle countdown cascade when a video modal opens
  useEffect(() => {
    if (!selectedVideo) return;

    // Reset playback triggers
    setModalCurtainsOpen(false);
    setCountdown(null);
    setPlaybackActive(false);
    setVideoEnded(false);
    setVideoError(false);

    // 1. Close modal curtains initially, then slide them open
    const openTimer = setTimeout(() => {
      setModalCurtainsOpen(true);
    }, 400);

    // 2. Once curtains slide open, launch the countdown cascade (after 1200ms slide duration)
    const count3Timer = setTimeout(() => setCountdown(3), 1600);
    const count2Timer = setTimeout(() => setCountdown(2), 2600);
    const count1Timer = setTimeout(() => setCountdown(1), 3600);
    const enjoyTimer = setTimeout(() => setCountdown("Enjoy the Memory 🍿"), 4600);
    
    // 3. Clear countdown and start video playback
    const playTimer = setTimeout(() => {
      setCountdown(null);
      setPlaybackActive(true);
    }, 6000);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(count3Timer);
      clearTimeout(count2Timer);
      clearTimeout(count1Timer);
      clearTimeout(enjoyTimer);
      clearTimeout(playTimer);
    };
  }, [selectedVideo]);

  const handleThumbError = (filename: string) => {
    setThumbErrors((prev) => {
      const next = new Set(prev);
      next.add(filename);
      return next;
    });
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
    setPlaybackActive(false);
    setIsCompleted(true); // Unlocks the page footer transition button
  };

  const handleVideoClose = () => {
    setSelectedVideo(null);
    setModalCurtainsOpen(false);
    setCountdown(null);
    setPlaybackActive(false);
    setVideoEnded(false);
  };

  return (
    <ChapterContainer
      chapterId={15}
      title="Our Little Sibling Cinema"
      subtitle="Relive the funniest road trips, racing battles, and everyday sibling giggles in our cozy home movie theatre."
      showNext={isCompleted} // Unlocks next chapter button only after she finishes at least one clip
    >
      <div className="relative w-full py-8 select-none flex flex-col items-center justify-center min-h-[30rem]">
        {/* Glow rings & hearts background */}
        <BackgroundGlow color="rose" size={500} className="top-1/4 left-1/4" />
        <BackgroundGlow color="violet" size={400} className="bottom-1/4 right-1/4" />
        <FloatingHearts />

        {/* Film Strip Left Decoration */}
        <div className="hidden xl:flex flex-col justify-between items-center w-10 bg-neutral-900 border-y-4 border-neutral-900 border-x-4 border-dashed border-white/60 py-8 absolute left-2 top-16 bottom-16 rounded-xl opacity-30 z-0 pointer-events-none shadow-md animate-card-float">
          <Film className="w-5 h-5 text-white/50 animate-pulse" />
          <div className="h-40 border-l border-white/10" />
          <Film className="w-5 h-5 text-white/50" />
        </div>

        {/* Film Strip Right Decoration */}
        <div className="hidden xl:flex flex-col justify-between items-center w-10 bg-neutral-900 border-y-4 border-neutral-900 border-x-4 border-dashed border-white/60 py-8 absolute right-2 top-16 bottom-16 rounded-xl opacity-30 z-0 pointer-events-none shadow-md animate-card-float" style={{ animationDelay: "1s" }}>
          <Film className="w-5 h-5 text-white/50" />
          <div className="h-40 border-l border-white/10" />
          <Film className="w-5 h-5 text-white/50 animate-pulse" />
        </div>

        {/* Movie cards list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-6 z-10 my-auto">
          {videosData.map((vid: VideoEntry, idx: number) => {
            const hasThumbError = thumbErrors.has(vid.thumbnail);
            const thumbPath = `/api/assets/chapters/chapter-15/thumbnails/${vid.thumbnail}`;

            return (
              <FadeIn
                key={idx}
                direction="up"
                delay={idx * 0.1}
                className="h-full"
              >
                <div
                  onClick={() => setSelectedVideo(vid)}
                  className="group bg-white rounded-3xl border border-pink-100/50 shadow-md hover:shadow-xl hover:scale-103 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full relative cursor-pointer"
                >
                  {/* Decorative Washi Tape top clip */}
                  <div className="absolute -top-3 left-6 w-10 h-3.5 washi-tape opacity-80 z-20 pointer-events-none" />

                  {/* Thumbnail Cover / Fallback */}
                  <div className="relative aspect-video w-full bg-gradient-to-tr from-pink-50 to-lavender-50 overflow-hidden border-b border-pink-50 flex items-center justify-center">
                    {!hasThumbError ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={thumbPath}
                        alt={vid.title}
                        onError={() => handleThumbError(vid.thumbnail)}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-pink-300 space-y-1">
                        <Video className="w-10 h-10 text-primary" />
                        <span className="text-[9px] font-sans text-pink-400">({vid.thumbnail})</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-45 group-hover:opacity-15 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-white/80 border border-white flex items-center justify-center text-primary shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-5 h-5 fill-current ml-0.5 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Card copy text */}
                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[8px] uppercase tracking-widest text-primary font-bold">Reel #{vid.id}</span>
                      <h4 className="text-base font-display font-extrabold text-pink-700 leading-tight">
                        {vid.title}
                      </h4>
                      <p className="text-xs text-rose-950/75 leading-relaxed font-sans line-clamp-2">
                        {vid.caption}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[9px] font-sans font-bold text-rose-300 uppercase tracking-widest pt-2 border-t border-pink-50">
                      <Film className="w-3.5 h-3.5" /> Play Video Clip
                    </div>
                  </div>

                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Fullscreen Video Modal player (React Conditional Mount) */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Cinematic dark blur overlay */}
            <div
              onClick={handleVideoClose}
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md"
            />

            {/* Glowing frame */}
            <div className="relative z-10 w-full max-w-3xl flex flex-col items-center select-none">
              
              <button
                onClick={handleVideoClose}
                className="absolute -top-12 right-0 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-md transition-all cursor-pointer z-30 flex items-center gap-1 text-xs font-sans uppercase font-bold tracking-widest"
                aria-label="Close cinema player"
              >
                <X className="w-4 h-4" /> Close Cinema
              </button>

              <div className="w-full bg-neutral-900 aspect-video rounded-3xl border border-neutral-800 shadow-[0_0_50px_rgba(244,63,94,0.4)] overflow-hidden relative flex items-center justify-center">
                
                {/* 1. Modal Curtain Opening Overlay (Slides open when modal opens) */}
                {/* Left Curtain */}
                <div 
                  style={{
                    transform: modalCurtainsOpen ? "translateX(-100%)" : "translateX(0)",
                    transition: "transform 1.2s cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                  className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-red-800 via-rose-900 to-red-950 z-20 shadow-2xl border-r-2 border-red-950/40 pointer-events-none"
                >
                  {/* Decorative golden curtain fold accent line */}
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-yellow-400/20" />
                </div>

                {/* Right Curtain */}
                <div 
                  style={{
                    transform: modalCurtainsOpen ? "translateX(100%)" : "translateX(0)",
                    transition: "transform 1.2s cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                  className="absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-red-800 via-rose-900 to-red-950 z-20 shadow-2xl border-l-2 border-red-950/40 pointer-events-none"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400/20" />
                </div>

                {/* 2. Popcorn Bucket Indicator in the corner */}
                <div className="absolute top-4 left-4 z-10 bg-black/45 px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 text-xs text-yellow-300 font-bold animate-pulse">
                  <span>🍿</span>
                  <span className="text-[10px] uppercase font-sans tracking-wider">Sibling Theater</span>
                </div>

                {/* 3. 3...2...1... Countdown Display Screen */}
                {countdown !== null && (
                  <div className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center z-15 text-center text-white space-y-4">
                    <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center text-4xl font-display font-extrabold text-glow-rose text-primary bg-white/5 animate-ping absolute" />
                    <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center text-4xl font-display font-extrabold text-glow-rose text-primary bg-black/50 relative z-10">
                      {countdown}
                    </div>
                    <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-sans">
                      Enjoy the Memory
                    </span>
                  </div>
                )}

                {/* 4. Active HTML5 Video Player */}
                {playbackActive && !videoError && (
                  <video
                    src={`/api/assets/chapters/chapter-15/videos/${selectedVideo.video}`}
                    controls
                    autoPlay
                    onEnded={handleVideoEnded}
                    onError={() => setVideoError(true)}
                    className="w-full h-full rounded-3xl"
                  />
                )}

                {/* 5. Video Ended Overlay Message */}
                {videoEnded && (
                  <div className="absolute inset-0 bg-neutral-950/90 flex flex-col items-center justify-center z-15 text-center p-8 space-y-6 animate-backdrop">
                    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                      <Heart className="w-8 h-8 text-primary fill-primary" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xl md:text-2xl font-display font-extrabold text-pink-500 leading-snug">
                        &ldquo;Some moments are too precious to stay only in memory.&rdquo; ❤️
                      </h4>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                        Every laugh, every silly face, and every quiet record is a treasure I get to keep forever.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleVideoClose}
                        className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white text-xs uppercase tracking-wider font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 border border-pink-500/20 cursor-pointer"
                      >
                        Back to Theater
                      </button>
                    </div>
                  </div>
                )}

                {/* 6. Video streaming error fallback */}
                {videoError && (
                  <div className="absolute inset-0 bg-neutral-900/90 flex flex-col items-center justify-center text-center p-8 z-15 space-y-4">
                    <AlertCircle className="w-12 h-12 text-rose-500 animate-bounce" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-sans font-bold text-rose-400 tracking-widest uppercase block flex justify-center items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> CINEMA ERROR
                      </span>
                      <h4 className="text-lg font-display font-extrabold text-white leading-tight">
                        Video File Missing
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-sm mx-auto">
                        Please copy your video file **`{selectedVideo.video}`** to the folder:
                        <code className="block mt-1 bg-neutral-800 text-rose-300 p-1.5 rounded-md text-[10px]">
                          E:\Hari\chapters\chapter-15\videos\
                        </code>
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* Main page entry Curtain Opening Overlay */}
        {/* Left Curtain */}
        <div 
          style={{
            transform: curtainsOpen ? "translateX(-100%)" : "translateX(0)",
            transition: "transform 1.2s cubic-bezier(0.76, 0, 0.24, 1)",
          }}
          className="fixed top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-rose-700 to-red-800 z-50 shadow-2xl border-r border-red-950 pointer-events-none"
        />
        {/* Right Curtain */}
        <div 
          style={{
            transform: curtainsOpen ? "translateX(100%)" : "translateX(0)",
            transition: "transform 1.2s cubic-bezier(0.76, 0, 0.24, 1)",
          }}
          className="fixed top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-rose-700 to-red-800 z-50 shadow-2xl border-l border-red-950 pointer-events-none"
        />

      </div>
    </ChapterContainer>
  );
}
