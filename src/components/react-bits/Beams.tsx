"use client";

import { useEffect, useRef } from "react";

interface BeamsProps {
  beamCount?: number;
  beamColor?: string;
  speed?: number;
  opacity?: number;
  className?: string;
}

interface Beam {
  x: number;
  width: number;
  opacity: number;
  speed: number;
  angle: number;
}

export function Beams({
  beamCount = 5,
  beamColor = "#7cb68a",
  speed = 0.2,
  opacity = 0.15,
  className,
}: BeamsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let beams: Beam[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createBeams = () => {
      beams = [];
      for (let i = 0; i < beamCount; i++) {
        beams.push({
          x: Math.random() * canvas.width,
          width: Math.random() * 100 + 50,
          opacity: Math.random() * opacity,
          speed: Math.random() * speed + 0.05,
          angle: Math.random() * 0.5 - 0.25,
        });
      }
    };

    const drawBeam = (beam: Beam) => {
      ctx.save();
      ctx.translate(beam.x, canvas.height / 2);
      ctx.rotate(beam.angle);

      const gradient = ctx.createLinearGradient(0, -canvas.height, 0, canvas.height);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.5, beamColor);
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.globalAlpha = beam.opacity;
      ctx.fillRect(-beam.width / 2, -canvas.height, beam.width, canvas.height * 2);

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      beams.forEach((beam) => {
        beam.x += beam.speed;
        if (beam.x > canvas.width + beam.width) {
          beam.x = -beam.width;
        }
        drawBeam(beam);
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    resize();
    createBeams();
    animate();

    window.addEventListener("resize", () => {
      resize();
      createBeams();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [beamCount, beamColor, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}
