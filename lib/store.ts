import { create } from "zustand";

interface AppState {
  // Navigation & Chapters
  currentChapter: number;
  maxUnlockedChapter: number;
  setCurrentChapter: (chapter: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  unlockChapter: (chapter: number) => void;

  // Global Loader
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;

  // Audio / Music Player
  isMuted: boolean;
  volume: number;
  currentTrack: string | null;
  isPlaying: boolean;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (track: string | null) => void;
  setPlaying: (playing: boolean) => void;

  // Cinematic Transitions
  isTransitioning: boolean;
  setTransitioning: (transitioning: boolean) => void;

  // Wishes Left by Users
  wishes: string[];
  addWish: (wish: string) => void;

  // Custom Cursor trailing mode
  cursorType: "default" | "heart" | "sparkle" | "pointer";
  setCursorType: (type: "default" | "heart" | "sparkle" | "pointer") => void;
}

export const useStore = create<AppState>((set) => ({
  currentChapter: 0,
  maxUnlockedChapter: 1,
  setCurrentChapter: (chapter) =>
    set((state) => ({
      currentChapter: chapter,
      maxUnlockedChapter: Math.max(state.maxUnlockedChapter, chapter),
    })),
  nextChapter: () =>
    set((state) => {
      const next = Math.min(state.currentChapter + 1, 20);
      return {
        currentChapter: next,
        maxUnlockedChapter: Math.max(state.maxUnlockedChapter, next),
      };
    }),
  prevChapter: () =>
    set((state) => ({ currentChapter: Math.max(state.currentChapter - 1, 0) })),
  unlockChapter: (chapter) =>
    set((state) => ({
      maxUnlockedChapter: Math.max(state.maxUnlockedChapter, chapter),
    })),

  // Global loader state
  isLoading: true,
  setLoading: (loading) => set({ isLoading: loading }),
  loadingProgress: 0,
  setLoadingProgress: (progress) => set({ loadingProgress: progress }),

  // Music state
  isMuted: false,
  volume: 0.5,
  currentTrack: null,
  isPlaying: false,
  setMuted: (muted) => set({ isMuted: muted }),
  setVolume: (volume) => set({ volume }),
  setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: !!track }),
  setPlaying: (playing) => set({ isPlaying: playing }),

  // Transitions
  isTransitioning: false,
  setTransitioning: (transitioning) => set({ isTransitioning: transitioning }),

  // Wishes state
  wishes: [],
  addWish: (wish) => set((state) => ({ wishes: [...state.wishes, wish] })),

  // Interactive Custom cursor state
  cursorType: "default",
  setCursorType: (cursorType) => set({ cursorType }),
}));
