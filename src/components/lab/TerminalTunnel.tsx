"use client";

import { useEffect, useRef } from "react";

type Glyph = {
  wall: number;
  offset: number;
  depth: number;
  token: string;
  color: string;
};

const tokens = [
  "0", "1", "0", "1", "{", "}", "<", ">", "/", "=", ";", "$", "#", "&&", "=>", "[]", "::",
  "0x1F", "0xFF", "sudo", "ssh", "git", "npm", "const", "null", "root", "ACK", "SYN", "200", "404",
];

const colors = {
  green: "42, 229, 0",
  cyan: "0, 251, 251",
  pink: "255, 0, 255",
};

const tunnelDepth = 24;
const halfWidth = 1.2;
const halfHeight = 0.75;
const ringSpacing = 1.5;
const railOffset = 0.3;
const glyphCount = 650;
const glyphWorldSize = 0.07;
const baseFontSize = 20;
const idleSpeed = 0.8;
const scrollFactor = 0.004;

function randomToken() {
  return tokens[Math.floor(Math.random() * tokens.length)];
}

function randomColor() {
  const roll = Math.random();
  if (roll < 0.05) return colors.pink;
  if (roll < 0.15) return colors.cyan;
  return colors.green;
}

function createGlyph(): Glyph {
  return {
    wall: Math.floor(Math.random() * 4),
    offset: Math.random() * 2 - 1,
    depth: Math.random() * tunnelDepth,
    token: randomToken(),
    color: randomColor(),
  };
}

// Desvio lateral e vertical do túnel em cada profundidade, o que dá a sensação de curva.
function curveX(depth: number) {
  return Math.sin(depth * 0.15) * 0.8;
}

function curveY(depth: number) {
  return Math.cos(depth * 0.11) * 0.3;
}

// Fundo fixo: um túnel de código em perspectiva. A câmera anda sozinha devagar e o scroll empurra pra frente ou pra trás.
export function TerminalTunnel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fontFamily = getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "monospace";
    const glyphs = Array.from({ length: glyphCount }, createGlyph);

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let vignette: CanvasGradient | null = null;
    let cameraDepth = 0;
    let lastScroll = window.scrollY;
    let lastTime = performance.now();
    let frameId = 0;

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      vignette = context.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.2, width / 2, height / 2, Math.max(width, height) * 0.75);
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.85)");
    };

    // Converte um ponto do mundo 3D para a posição na tela.
    const project = (x: number, y: number, depth: number, focal: number) => {
      const relative = depth - cameraDepth;
      const scale = focal / relative;
      return {
        x: width / 2 + (x + curveX(depth) - curveX(cameraDepth)) * scale,
        y: height / 2 + (y + curveY(depth) - curveY(cameraDepth)) * scale,
        scale,
        fog: 1 - relative / tunnelDepth,
      };
    };

    const drawStructure = (focal: number) => {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.lineWidth = 1;

      const firstRing = Math.ceil((cameraDepth + 0.3) / ringSpacing) * ringSpacing;
      for (let depth = firstRing; depth < cameraDepth + tunnelDepth; depth += ringSpacing) {
        const point = project(-halfWidth, -halfHeight, depth, focal);
        context.strokeStyle = `rgba(${colors.green}, ${point.fog * point.fog * 0.3})`;
        context.strokeRect(point.x, point.y, halfWidth * 2 * point.scale, halfHeight * 2 * point.scale);

        const leftRail = project(-railOffset, halfHeight, depth, focal);
        const rightRail = project(railOffset, halfHeight, depth, focal);
        context.strokeStyle = `rgba(${colors.cyan}, ${point.fog * 0.2})`;
        context.beginPath();
        context.moveTo(leftRail.x - 0.15 * leftRail.scale, leftRail.y);
        context.lineTo(rightRail.x + 0.15 * rightRail.scale, rightRail.y);
        context.stroke();
      }

      const railStep = 0.5;
      const firstStep = Math.ceil((cameraDepth + 0.3) / railStep) * railStep;
      [-railOffset, railOffset].forEach((railX) => {
        let previous: ReturnType<typeof project> | null = null;
        for (let depth = firstStep; depth < cameraDepth + tunnelDepth; depth += railStep) {
          const point = project(railX, halfHeight, depth, focal);
          if (previous) {
            context.strokeStyle = `rgba(${colors.cyan}, ${point.fog * 0.7})`;
            context.beginPath();
            context.moveTo(previous.x, previous.y);
            context.lineTo(point.x, point.y);
            context.stroke();
          }
          previous = point;
        }
      });
    };

    const drawGlyphs = (focal: number) => {
      context.font = `${baseFontSize}px ${fontFamily}`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      for (const glyph of glyphs) {
        const relative = (((glyph.depth - cameraDepth) % tunnelDepth) + tunnelDepth) % tunnelDepth;
        if (relative < 0.3) continue;

        let x = glyph.offset * halfWidth;
        let y = glyph.offset * halfHeight;
        if (glyph.wall === 0) y = halfHeight;
        if (glyph.wall === 1) y = -halfHeight;
        if (glyph.wall === 2) x = -halfWidth;
        if (glyph.wall === 3) x = halfWidth;

        const point = project(x, y, cameraDepth + relative, focal);
        const textScale = (point.scale * glyphWorldSize) / baseFontSize;
        if (textScale * baseFontSize < 3) continue;

        if (Math.random() < 0.002) glyph.token = randomToken();

        const nearFade = Math.min(1, (relative - 0.3) / 2);
        context.globalAlpha = Math.pow(point.fog, 1.6) * nearFade * 0.85;
        context.fillStyle = `rgb(${glyph.color})`;
        context.setTransform(pixelRatio * textScale, 0, 0, pixelRatio * textScale, pixelRatio * point.x, pixelRatio * point.y);
        context.fillText(glyph.token, 0, 0);
      }

      context.globalAlpha = 1;
    };

    const render = (now: number) => {
      const deltaTime = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const scroll = window.scrollY;
      cameraDepth += (reducedMotion ? 0 : idleSpeed * deltaTime) + (scroll - lastScroll) * scrollFactor;
      lastScroll = scroll;

      const focal = Math.min(width, height) * 0.7;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.fillStyle = "#050507";
      context.fillRect(0, 0, width, height);

      drawStructure(focal);
      drawGlyphs(focal);

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      if (vignette) {
        context.fillStyle = vignette;
        context.fillRect(0, 0, width, height);
      }

      frameId = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="scanlines absolute inset-0" />
    </div>
  );
}
