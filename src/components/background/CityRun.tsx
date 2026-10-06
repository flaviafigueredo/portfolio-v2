"use client";

import { useEffect, useRef } from "react";
import { createLayerCanvas, drawSkyline, randomBetween, randomItem, readMonoFont, windowChars } from "./canvasHelpers";

type BuildingWindow = {
  offset: number;
  elevation: number;
  char: string;
  color: string;
  brightness: number;
};

type Building = {
  side: number;
  start: number;
  length: number;
  height: number;
  edgeColor: string;
  windows: BuildingWindow[];
};

type FloatingGlyph = {
  x: number;
  y: number;
  depth: number;
  token: string;
  color: string;
};

type ProjectedPoint = {
  x: number;
  y: number;
  scale: number;
  fog: number;
};

const tokens = ["0", "1", "{", "}", "<", ">", "/", "=", ";", "$", "#", "&&", "=>", "0xFF", "sudo", "ssh", "git", "npm", "root", "ACK", "200"];

const colors = {
  green: "42, 229, 0",
  cyan: "0, 251, 251",
  pink: "255, 0, 255",
};

const viewDepth = 30;
const loopLength = 48;
const streetHalfWidth = 1.6;
const groundLevel = 0.75;
const railOffset = 0.3;
const buildingThickness = 3;
const nearPlane = 0.25;
const windowSpacing = 0.32;
const windowWorldSize = 0.11;
const glyphWorldSize = 0.07;
const baseFontSize = 20;
const floatingGlyphCount = 200;
const idleSpeed = 1.2;
const scrollFactor = 0.005;

function randomGlyphColor() {
  const roll = Math.random();
  if (roll < 0.05) return colors.pink;
  if (roll < 0.15) return colors.cyan;
  return colors.green;
}

function createWindows(length: number, height: number, accent: string) {
  const windows: BuildingWindow[] = [];
  for (let offset = 0.15; offset < length - 0.15; offset += windowSpacing) {
    for (let elevation = 0.3; elevation < height - 0.2; elevation += windowSpacing) {
      if (Math.random() > 0.4) continue;
      const lit = Math.random() < 0.1;
      windows.push({
        offset,
        elevation,
        char: randomItem(windowChars),
        color: lit ? accent : colors.green,
        brightness: lit ? 0.9 : 0.35,
      });
    }
  }
  return windows;
}

// Gera uma fileira de prédios de um lado da rua. A fileira se repete a cada loopLength unidades.
function createBuildingRow(side: number) {
  const buildings: Building[] = [];
  let start = 0;

  while (start < loopLength) {
    const gap = randomBetween(0.3, 1);
    let length = randomBetween(1.5, 4);
    if (start + length + gap > loopLength) {
      length = loopLength - start - gap;
      if (length < 0.8) break;
    }

    const height = randomBetween(1.2, 3.2);
    const accent = Math.random() < 0.5 ? colors.cyan : colors.pink;
    buildings.push({
      side,
      start,
      length,
      height,
      edgeColor: accent,
      windows: createWindows(length, height, accent),
    });
    start += length + gap;
  }

  return buildings;
}

function createFloatingGlyph(): FloatingGlyph {
  return {
    x: randomBetween(-streetHalfWidth * 0.9, streetHalfWidth * 0.9),
    y: randomBetween(-2.5, 0.4),
    depth: Math.random() * viewDepth,
    token: randomItem(tokens),
    color: randomGlyphColor(),
  };
}

// Desvio lateral da rua em cada profundidade, o que faz a rua parecer fazer curvas.
function curveX(depth: number) {
  return Math.sin(depth * 0.08) * 1.2;
}

function wrapDepth(value: number, length: number) {
  return ((value % length) + length) % length;
}

// Fundo fixo: uma corrida por uma rua entre prédios de código, com trilhos no chão e a cidade distante no horizonte.
export function CityRun() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fontFamily = readMonoFont();
    const buildings = [...createBuildingRow(-1), ...createBuildingRow(1)];
    const floatingGlyphs = Array.from({ length: floatingGlyphCount }, createFloatingGlyph);

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let horizonY = 0;
    let focal = 0;
    let backdrop: HTMLCanvasElement | null = null;
    let backdropWidth = 0;
    let backdropHeight = 0;
    let sky: CanvasGradient | null = null;
    let ground: CanvasGradient | null = null;
    let vignette: CanvasGradient | null = null;
    let cameraDepth = 0;
    let lastScroll = window.scrollY;
    let lastTime = performance.now();
    let frameId = 0;

    // Desenha a cidade distante do horizonte. Só refaz quando a largura muda, para a barra do navegador no celular não gerar outra cidade.
    const buildBackdrop = () => {
      const nextWidth = Math.max(width, 900);
      if (backdrop && nextWidth === backdropWidth) return;

      backdropWidth = nextWidth;
      backdropHeight = height * 0.3;
      const layer = createLayerCanvas(backdropWidth, backdropHeight, pixelRatio);
      drawSkyline(layer.context, backdropWidth, backdropHeight, {
        baseline: backdropHeight,
        minHeight: 0.25,
        maxHeight: 0.9,
        minWidth: 30,
        maxWidth: 80,
        bodyColor: "#0e0a14",
        edgeColor: "rgba(255, 171, 243, 0.3)",
        windowColor: "rgba(255, 171, 243, 0.15)",
        litColor: "rgba(255, 171, 243, 0.5)",
        litChance: 0.25,
        fontSize: 7,
      }, fontFamily);
      backdrop = layer.image;
    };

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      horizonY = height * 0.45;
      focal = Math.min(width, height) * 0.7;

      buildBackdrop();

      sky =context.createLinearGradient(0, 0, 0, horizonY);
      sky.addColorStop(0, "#040306");
      sky.addColorStop(1, "#1a0b22");

      ground = context.createLinearGradient(0, horizonY, 0, height);
      ground.addColorStop(0, "#12081a");
      ground.addColorStop(0.3, "#060508");
      ground.addColorStop(1, "#050507");

      vignette = context.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.25, width / 2, height / 2, Math.max(width, height) * 0.75);
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.8)");
    };

    // Converte um ponto do mundo 3D para a posição na tela. "relative" é a distância até a câmera.
    const project = (x: number, y: number, relative: number): ProjectedPoint => {
      const scale = focal / relative;
      return {
        x: width / 2 + (x + curveX(cameraDepth + relative) - curveX(cameraDepth)) * scale,
        y: horizonY + y * scale,
        scale,
        fog: Math.max(0, 1 - relative / viewDepth),
      };
    };

    const resetTransform = () => context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const fillShape = (points: ProjectedPoint[]) => {
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
      context.closePath();
      context.fill();
    };

    const drawLine = (from: ProjectedPoint, to: ProjectedPoint) => {
      context.beginPath();
      context.moveTo(from.x, from.y);
      context.lineTo(to.x, to.y);
      context.stroke();
    };

    const drawText = (text: string, point: ProjectedPoint, worldSize: number, alpha: number, color: string) => {
      const textScale = (point.scale * worldSize) / baseFontSize;
      if (textScale * baseFontSize < 3) return;
      context.globalAlpha = alpha;
      context.fillStyle = `rgb(${color})`;
      context.setTransform(pixelRatio * textScale, 0, 0, pixelRatio * textScale, pixelRatio * point.x, pixelRatio * point.y);
      context.fillText(text, 0, 0);
    };

    const drawBackdrop = () => {
      if (!backdrop) return;
      const offset = wrapDepth(curveX(cameraDepth) * width * 0.2, backdropWidth);
      for (let x = -offset; x < width; x += backdropWidth) {
        context.drawImage(backdrop, x, horizonY - backdropHeight, backdropWidth, backdropHeight);
      }
    };

    const drawStreet = () => {
      context.lineWidth = 1;
      const step = 0.75;
      const firstStep = Math.ceil((cameraDepth + nearPlane) / step) * step;
      let previous: Record<string, ProjectedPoint> | null = null;

      for (let depth = firstStep; depth < cameraDepth + viewDepth; depth += step) {
        const relative = depth - cameraDepth;
        const current = {
          leftRail: project(-railOffset, groundLevel, relative),
          rightRail: project(railOffset, groundLevel, relative),
          leftCurb: project(-streetHalfWidth, groundLevel, relative),
          rightCurb: project(streetHalfWidth, groundLevel, relative),
        };
        const fog = current.leftRail.fog;

        context.strokeStyle = `rgba(${colors.cyan}, ${fog * 0.2})`;
        drawLine(project(-railOffset - 0.15, groundLevel, relative), project(railOffset + 0.15, groundLevel, relative));

        if (previous) {
          context.strokeStyle = `rgba(${colors.cyan}, ${fog * 0.7})`;
          drawLine(previous.leftRail, current.leftRail);
          drawLine(previous.rightRail, current.rightRail);
          context.strokeStyle = `rgba(${colors.pink}, ${fog * 0.35})`;
          drawLine(previous.leftCurb, current.leftCurb);
          drawLine(previous.rightCurb, current.rightCurb);
        }
        previous = current;
      }
    };

    const drawBuilding = (building: Building, relative: number) => {
      const faceX = building.side * streetHalfWidth;
      const outerX = building.side * (streetHalfWidth + buildingThickness);
      const top = groundLevel - building.height;
      const nearDepth = Math.max(relative, nearPlane);
      const farDepth = Math.min(relative + building.length, viewDepth);

      const nearBottom = project(faceX, groundLevel, nearDepth);
      const nearTop = project(faceX, top, nearDepth);
      const farTop = project(faceX, top, farDepth);
      const farBottom = project(faceX, groundLevel, farDepth);

      resetTransform();
      context.globalAlpha = Math.min(1, nearBottom.fog * 2.5);
      context.lineWidth = 1;

      if (relative >= nearPlane) {
        const capTop = project(outerX, top, relative);
        const capBottom = project(outerX, groundLevel, relative);
        context.fillStyle = "#0c0b13";
        fillShape([nearBottom, nearTop, capTop, capBottom]);
        context.strokeStyle = `rgba(${building.edgeColor}, 0.5)`;
        drawLine(nearTop, capTop);
      }

      context.fillStyle = "#08070d";
      fillShape([nearBottom, nearTop, farTop, farBottom]);
      context.strokeStyle = `rgba(${building.edgeColor}, 0.6)`;
      drawLine(nearTop, farTop);
      context.strokeStyle = `rgba(${building.edgeColor}, 0.25)`;
      drawLine(nearBottom, nearTop);

      for (const buildingWindow of building.windows) {
        const windowDepth = relative + buildingWindow.offset;
        if (windowDepth < nearPlane + 0.2 || windowDepth > viewDepth) continue;
        const point = project(faceX, groundLevel - buildingWindow.elevation, windowDepth);
        const nearFade = Math.min(1, (windowDepth - nearPlane) / 1.5);
        drawText(buildingWindow.char, point, windowWorldSize, Math.pow(point.fog, 1.4) * buildingWindow.brightness * nearFade, buildingWindow.color);
      }

      context.globalAlpha = 1;
    };

    const drawBuildings = () => {
      context.font = `${baseFontSize}px ${fontFamily}`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      const visible: { building: Building; relative: number }[] = [];
      for (const building of buildings) {
        let relative = wrapDepth(building.start - cameraDepth, loopLength);
        if (relative > loopLength - 6) relative -= loopLength;
        if (relative + building.length < nearPlane || relative > viewDepth) continue;
        visible.push({ building, relative });
      }

      visible.sort((first, second) => second.relative - first.relative);
      visible.forEach(({ building, relative }) => drawBuilding(building, relative));
    };

    const drawFloatingGlyphs = () => {
      for (const glyph of floatingGlyphs) {
        const relative = wrapDepth(glyph.depth - cameraDepth, viewDepth);
        if (relative < 0.3) continue;
        if (Math.random() < 0.002) glyph.token = randomItem(tokens);
        const point = project(glyph.x, glyph.y, relative);
        const nearFade = Math.min(1, (relative - 0.3) / 2);
        drawText(glyph.token, point, glyphWorldSize, Math.pow(point.fog, 1.6) * nearFade * 0.8, glyph.color);
      }
      context.globalAlpha = 1;
    };

    const render = (now: number) => {
      const deltaTime = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const scroll = window.scrollY;
      cameraDepth += (reducedMotion ? 0 : idleSpeed * deltaTime) + (scroll - lastScroll) * scrollFactor;
      lastScroll = scroll;

      resetTransform();
      if (sky) context.fillStyle = sky;
      context.fillRect(0, 0, width, horizonY);
      if (ground) context.fillStyle = ground;
      context.fillRect(0, horizonY, width, height - horizonY);

      drawBackdrop();
      drawStreet();
      drawBuildings();
      drawFloatingGlyphs();

      resetTransform();
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
