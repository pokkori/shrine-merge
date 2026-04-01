"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface SakuraParticleCanvasProps {
  active: boolean;
  intensity?: "light" | "heavy";
  duration?: number;
}

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  size: number;
  color: string;
  opacity: number;
  alive: boolean;
}

const PETAL_COLORS = ["#ffb7c5", "#ff8fab", "#ff6b9d", "#ffc0cb", "#ffaec0"];

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal) {
  ctx.save();
  ctx.translate(petal.x, petal.y);
  ctx.rotate(petal.rotation);
  ctx.globalAlpha = petal.opacity;

  const s = petal.size;
  ctx.fillStyle = petal.color;
  ctx.beginPath();

  // 5弁bezier curve 花びら
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const petalX = Math.cos(angle) * s * 0.5;
    const petalY = Math.sin(angle) * s * 0.5;
    const cp1x = Math.cos(angle - 0.4) * s * 1.1;
    const cp1y = Math.sin(angle - 0.4) * s * 1.1;
    const cp2x = Math.cos(angle + 0.4) * s * 1.1;
    const cp2y = Math.sin(angle + 0.4) * s * 1.1;
    if (i === 0) {
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(cp1x * 0.5, cp1y * 0.5, petalX + cp1x * 0.4, petalY + cp1y * 0.4, petalX, petalY);
    }
    ctx.bezierCurveTo(cp2x * 0.5, cp2y * 0.5, 0, 0, 0, 0);
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(cp1x * 0.5, cp1y * 0.5, petalX + cp1x * 0.4, petalY + cp1y * 0.4, petalX, petalY);
  }
  ctx.closePath();
  ctx.fill();

  // 中心の白い円
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export default function SakuraParticleCanvas({
  active,
  intensity = "light",
  duration = 5000,
}: SakuraParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const rafRef = useRef<number>(0);
  const stoppedRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  const spawnCount = intensity === "heavy" ? 3 : 1;
  const maxPetals = intensity === "heavy" ? 60 : 25;

  const spawnPetal = useCallback((width: number) => {
    const size = intensity === "heavy" ? 10 + Math.random() * 8 : 7 + Math.random() * 6;
    petalsRef.current.push({
      x: Math.random() * width,
      y: -20,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1.2 + Math.random() * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      size,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      opacity: 0.7 + Math.random() * 0.3,
      alive: true,
    });
  }, [intensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    stoppedRef.current = false;
    startTimeRef.current = Date.now();
    petalsRef.current = [];

    let spawnTimer = 0;

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = Date.now() - startTimeRef.current;
      const shouldSpawn = active && elapsed < duration && !stoppedRef.current;

      // 新規追加
      if (shouldSpawn) {
        spawnTimer++;
        if (spawnTimer % 6 === 0 && petalsRef.current.length < maxPetals) {
          for (let i = 0; i < spawnCount; i++) {
            spawnPetal(canvas.width);
          }
        }
      }

      // 更新・描画
      petalsRef.current = petalsRef.current.filter(p => p.alive);
      for (const petal of petalsRef.current) {
        petal.x += petal.vx + Math.sin(Date.now() * 0.001 + petal.y * 0.01) * 0.3;
        petal.y += petal.vy;
        petal.rotation += petal.rotSpeed;
        // フェードアウト（画面下部）
        if (petal.y > canvas.height * 0.8) {
          petal.opacity -= 0.02;
        }
        if (petal.y > canvas.height + 20 || petal.opacity <= 0) {
          petal.alive = false;
          continue;
        }
        drawPetal(ctx, petal);
      }

      // 全落下後に停止
      if (!shouldSpawn && petalsRef.current.length === 0) {
        cancelAnimationFrame(rafRef.current);
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
      stoppedRef.current = true;
    };
  }, [active, intensity, duration, spawnPetal, maxPetals, spawnCount]);

  if (!active && petalsRef.current.length === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 199,
      }}
      aria-hidden="true"
    />
  );
}
