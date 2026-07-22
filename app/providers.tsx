"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/lib/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const currentChapter = useStore((state) => state.currentChapter);

  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Synchronize Lenis with GSAP ScrollTrigger updates
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, []);

  // Control scrolling lock based on chapter state (e.g. locks scrolling on Chapter 0 loading screen)
  useEffect(() => {
    if (lenisRef.current) {
      if (currentChapter === 0) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [currentChapter]);

  return <>{children}</>;
}
