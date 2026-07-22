"use client";

import { useEffect, useRef } from "react";

interface Heart {
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
  angle: number;
  wobbleSpeed: number;
  scaleSpeed: number;
}

export default function FloatingHearts() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const hearts: Heart[] = [];
    const maxHearts = 40;

    const createHeart = (x?: number, y?: number): Heart => ({
      x: x !== undefined ? x : Math.random() * width,
      y: y !== undefined ? y : height + 50,
      size: Math.random() * 8 + 6,
      speedY: -(Math.random() * 1.2 + 0.6),
      opacity: Math.random() * 0.5 + 0.3,
      angle: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      scaleSpeed: 0,
    });

    // Populate initially
    for (let i = 0; i < maxHearts; i++) {
      hearts.push(createHeart(Math.random() * width, Math.random() * height + height / 2));
    }

    const drawHeartShape = (context: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      context.moveTo(x, y + size / 4);
      context.quadraticCurveTo(x, y, x + size / 2, y);
      context.quadraticCurveTo(x + size, y, x + size, y + size / 3);
      context.quadraticCurveTo(x + size, y + (size * 2) / 3, x + size / 2, y + size);
      context.quadraticCurveTo(x, y + (size * 2) / 3, x, y + size / 3);
      context.quadraticCurveTo(x, y, x, y);
    };

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      hearts.forEach((h, index) => {
        h.y += h.speedY;
        h.angle += h.wobbleSpeed;
        h.x += Math.sin(h.angle) * 0.4;

        // Reset if goes off-screen
        if (h.y < -50 || h.opacity <= 0) {
          hearts[index] = createHeart();
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.globalAlpha = h.opacity;
          ctx.fillStyle = "#EC4899"; // Pink
          drawHeartShape(ctx, h.x, h.y, h.size);
          ctx.fill();
          ctx.restore();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleClick = (e: MouseEvent) => {
      // Spawn extra hearts on click
      for (let i = 0; i < 5; i++) {
        hearts.push(
          createHeart(
            e.clientX + (Math.random() * 40 - 20),
            e.clientY + (Math.random() * 40 - 20)
          )
        );
      }
      if (hearts.length > maxHearts + 20) {
        hearts.splice(0, 5); // keep count clean
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full bg-transparent"
    />
  );
}
