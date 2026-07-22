"use client";

import { useStore } from "@/lib/store";

export default function TransitionScreen() {
  const isTransitioning = useStore((state) => state.isTransitioning);

  if (!isTransitioning) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-t from-primary via-accent to-secondary flex items-center justify-center pointer-events-auto animate-wipe">
      {/* Central glowing transition mark */}
      <div className="w-16 h-16 rounded-full border-2 border-primary/25 bg-white/80 flex items-center justify-center text-glow-rose text-primary animate-petal shadow-md">
        🌸
      </div>
    </div>
  );
}

export function useChapterTransition() {
  const setTransitioning = useStore((state) => state.setTransitioning);
  const setCurrentChapter = useStore((state) => state.setCurrentChapter);

  const transitionTo = (chapter: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentChapter(chapter);
    }, 700);
    setTimeout(() => {
      setTransitioning(false);
    }, 1400);
  };

  return transitionTo;
}
