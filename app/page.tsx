"use client";

import { useStore } from "@/lib/store";
import LoadingScreen from "@/components/LoadingScreen";
import HeroScreen from "@/components/HeroScreen";
import TransitionScreen from "@/components/TransitionScreen";
import Navigation from "@/components/Navigation";
import ProgressBar from "@/components/ProgressBar";
import StarField from "@/components/StarField";
import BackgroundParticles from "@/components/BackgroundParticles";
import Chapter2View from "@/components/Chapter2View";
import Chapter3View from "@/components/Chapter3View";
import Chapter4View from "@/components/Chapter4View";
import Chapter5View from "@/components/Chapter5View";
import Chapter6View from "@/components/Chapter6View";
import Chapter7View from "@/components/Chapter7View";
import Chapter8View from "@/components/Chapter8View";
import Chapter9View from "@/components/Chapter9View";
import Chapter10View from "@/components/Chapter10View";
import Chapter11View from "@/components/Chapter11View";
import Chapter12View from "@/components/Chapter12View";
import Chapter13View from "@/components/Chapter13View";
import Chapter14View from "@/components/Chapter14View";
import Chapter15View from "@/components/Chapter15View";
import Chapter16View from "@/components/Chapter16View";
import Chapter17View from "@/components/Chapter17View";
import Chapter18View from "@/components/Chapter18View";
import Chapter19View from "@/components/Chapter19View";
import Chapter20View from "@/components/Chapter20View";

export default function Home() {
  const currentChapter = useStore((state) => state.currentChapter);

  return (
    <div className="relative w-full min-h-screen overflow-hidden select-none">
      {/* Background Ambience Layers */}
      <StarField />
      <BackgroundParticles />

      {/* Cinematic Chapter Transition Overlays */}
      <TransitionScreen />
      
      {/* Global Overlays */}
      <Navigation />
      <ProgressBar />

      {/* Active Chapter Rendering System */}
      <div className="relative z-10 w-full min-h-screen">
        {currentChapter === 0 && <LoadingScreen />}
        {currentChapter === 1 && <HeroScreen />}
        {currentChapter === 2 && <Chapter2View />}
        {currentChapter === 3 && <Chapter3View />}
        {currentChapter === 4 && <Chapter4View />}
        {currentChapter === 5 && <Chapter5View />}
        {currentChapter === 6 && <Chapter6View />}
        {currentChapter === 7 && <Chapter7View />}
        {currentChapter === 8 && <Chapter8View />}
        {currentChapter === 9 && <Chapter9View />}
        {currentChapter === 10 && <Chapter10View />}
        {currentChapter === 11 && <Chapter11View />}
        {currentChapter === 12 && <Chapter12View />}
        {currentChapter === 13 && <Chapter13View />}
        {currentChapter === 14 && <Chapter14View />}
        {currentChapter === 15 && <Chapter15View />}
        {currentChapter === 16 && <Chapter16View />}
        {currentChapter === 17 && <Chapter17View />}
        {currentChapter === 18 && <Chapter18View />}
        {currentChapter === 19 && <Chapter19View />}
        {currentChapter === 20 && <Chapter20View />}
        {currentChapter > 20 && (
          <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <div className="glassmorphism-pink max-w-xl p-10 rounded-2xl border border-primary/10 space-y-6">
              <span className="text-xs uppercase tracking-widest text-primary font-semibold">
                Locked
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-glow-rose text-pink-700 leading-tight">
                Chapter {currentChapter.toString().padStart(2, "0")}
              </h1>
              <p className="text-sm md:text-base text-rose-950/70 max-w-md mx-auto leading-relaxed font-sans font-medium">
                This chapter is locked and will be built in the next development phase.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={() => useStore.getState().setCurrentChapter(1)}
                  className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-white text-xs uppercase tracking-wider font-semibold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 border border-pink-100/50 cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
