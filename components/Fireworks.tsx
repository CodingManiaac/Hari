"use client";

import { useEffect, useRef } from "react";

interface FireworksProps {
  active?: boolean;
}

class Firework {
  x: number;
  y: number;
  tx: number;
  ty: number;
  d: number;
  speed: number;
  angle: number;
  particles: Particle[];
  alpha: number;
  dead: boolean;

  constructor(sx: number, sy: number, tx: number, ty: number) {
    this.x = sx;
    this.y = sy;
    this.tx = tx;
    this.ty = ty;
    this.d = Math.hypot(tx - sx, ty - sy);
    this.speed = 4;
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.particles = [];
    this.alpha = 1;
    this.dead = false;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    const remaining = Math.hypot(this.tx - this.x, this.ty - this.y);
    if (remaining <= this.speed) {
      this.explode();
      this.dead = true;
    }
  }

  explode() {
    const colors = ["#ff0055", "#00ffcc", "#ffcc00", "#ff00ff", "#00ff00"];
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 60; i++) {
      this.particles.push(new Particle(this.tx, this.ty, randColor));
    }
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 1;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.015;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05; // gravity
    this.alpha -= this.decay;
  }
}

export default function Fireworks({ active = false }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let fireworks: Firework[] = [];
    let particles: Particle[] = [];
    let animationId: number;

    const loop = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";

      // Random launching
      if (Math.random() < 0.04) {
        const sx = width / 2 + (Math.random() * 200 - 100);
        const sy = height;
        const tx = Math.random() * width;
        const ty = (Math.random() * height) / 2;
        fireworks.push(new Firework(sx, sy, tx, ty));
      }

      fireworks.forEach((fw, index) => {
        fw.update();
        ctx.beginPath();
        ctx.arc(fw.x, fw.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffcc00";
        ctx.fill();

        if (fw.dead) {
          particles.push(...fw.particles);
          fireworks.splice(index, 1);
        }
      });

      particles.forEach((p, index) => {
        p.update();
        if (p.alpha <= 0) {
          particles.splice(index, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.restore();
        }
      });

      animationId = requestAnimationFrame(loop);
    };

    loop();

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
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}
