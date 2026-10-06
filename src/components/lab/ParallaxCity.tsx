"use client";

import { useEffect, useRef } from "react";
import { createLayerCanvas, drawSkyline, randomBetween, randomItem, readMonoFont } from "@/components/background/canvasHelpers";

type TiledLayer = {
  image: HTMLCanvasElement;
  speed: number;
};

type RainDrop = {
  x: number;
  y: number;
  speed: number;
  char: string;
};

const rainChars = "01<>/{}=*+";
const codeTokens = [
  "import", "export", "await", "fetch()", "</div>", "useEffect", "return", "null", "0xFF",
  "git push", "npm run dev", "=>", "{}", "const", "type", "async", "ssh root@", "200 OK",
];

const idleSpeed = 40;
const scrollFactor = 0.8;
const pillarSpacing = 160;
const trainCarWidth = 150;
const trainCarHeight = 30;
const trainCars = 5;
const trainSpeed = 260;
const rainCount = 60;

function drawStars(context: CanvasRenderingContext2D, tileWidth: number, height: number) {
  for (let index = 0; index < 140; index++) {
    context.fillStyle = `rgba(220, 190, 212, ${randomBetween(0.1, 0.5)})`;
    context.fillRect(Math.random() * tileWidth, Math.random() * height * 0.6, 1, 1);
  }
}

function drawTrack(context: CanvasRenderingContext2D, tileWidth: number, height: number) {
  const railY = height * 0.78;

  for (let x = 0; x < tileWidth; x += pillarSpacing) {
    context.fillStyle = "#09090d";
    context.fillRect(x + 70, railY + 6, 14, height - railY);
    context.fillStyle = "rgba(42, 229, 0, 0.12)";
    context.fillRect(x + 70, railY + 6, 1, height - railY);
  }

  context.fillStyle = "#09090d";
  context.fillRect(0, railY, tileWidth, 8);
  context.fillStyle = "rgba(0, 251, 251, 0.6)";
  context.fillRect(0, railY, tileWidth, 1);
  context.fillStyle = "rgba(0, 251, 251, 0.2)";
  context.fillRect(0, railY + 7, tileWidth, 1);

  for (let x = 20; x < tileWidth; x += 40) {
    context.fillStyle = "rgba(255, 0, 255, 0.5)";
    context.fillRect(x, railY + 3, 2, 2);
  }
}

function drawGroundCode(context: CanvasRenderingContext2D, tileWidth: number, height: number, fontFamily: string) {
  context.font = `11px ${fontFamily}`;
  context.textBaseline = "top";
  context.fillStyle = "rgba(42, 229, 0, 0.22)";

  for (let rowY = height * 0.9; rowY < height; rowY += 16) {
    let x = randomBetween(0, 40);
    while (x < tileWidth) {
      const token = randomItem(codeTokens);
      context.fillText(token, x, rowY);
      context.fillText(token, x - tileWidth, rowY);
      x += context.measureText(token).width + randomBetween(12, 40);
    }
  }
}

function createTrain(pixelRatio: number, fontFamily: string) {
  const gap = 6;
  const width = trainCars * (trainCarWidth + gap);
  const { image, context } = createLayerCanvas(width, trainCarHeight, pixelRatio);
  context.font = `9px ${fontFamily}`;
  context.textBaseline = "middle";

  for (let car = 0; car < trainCars; car++) {
    const carX = car * (trainCarWidth + gap);
    context.fillStyle = "#0d0d14";
    context.fillRect(carX, 0, trainCarWidth, trainCarHeight);
    context.strokeStyle = "rgba(0, 251, 251, 0.6)";
    context.strokeRect(carX + 0.5, 0.5, trainCarWidth - 1, trainCarHeight - 1);

    for (let windowX = carX + 10; windowX < carX + trainCarWidth - 18; windowX += 16) {
      context.fillStyle = Math.random() < 0.2 ? "rgba(255, 171, 243, 0.8)" : "rgba(0, 251, 251, 0.35)";
      context.fillRect(windowX, 7, 10, 8);
    }

    context.fillStyle = "rgba(42, 229, 0, 0.6)";
    context.fillText(`CAR_0${car + 1}`, carX + 10, 23);
  }

  context.fillStyle = "rgba(255, 0, 255, 0.9)";
  context.fillRect(0, 10, 3, 6);

  return { image, width };
}

// Fundo fixo: uma cidade em camadas que passa de lado. Cada camada anda numa velocidade, e o scroll acelera o movimento.
export function ParallaxCity() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fontFamily = readMonoFont();

    let width = 0;
    let height = 0;
    let layerHeight = 0;
    let tileWidth = 0;
    let pixelRatio = 1;
    let layers: TiledLayer[] = [];
    let train: ReturnType<typeof createTrain> | null = null;
    let sky: CanvasGradient | null = null;
    let haze: CanvasGradient | null = null;
    let rain: RainDrop[] = [];
    let worldPosition = 0;
    let trainPosition = 0;
    let lastScroll = window.scrollY;
    let lastTime = performance.now();
    let frameId = 0;
    let resizeTimer = 0;

    const buildScene = () => {
      layerHeight = height;
      tileWidth = Math.ceil(Math.max(width, 900) / pillarSpacing) * pillarSpacing;

      const layerSpecs: { speed: number; draw: (layerContext: CanvasRenderingContext2D) => void }[] = [
        { speed: 0.03, draw: (layerContext) => drawStars(layerContext, tileWidth, height) },
        {
          speed: 0.12,
          draw: (layerContext) =>
            drawSkyline(layerContext, tileWidth, height, {
              baseline: height * 0.72,
              minHeight: 0.2,
              maxHeight: 0.45,
              minWidth: 50,
              maxWidth: 110,
              bodyColor: "#0e0a14",
              edgeColor: "rgba(255, 171, 243, 0.25)",
              windowColor: "rgba(255, 171, 243, 0.15)",
              litColor: "rgba(255, 171, 243, 0.55)",
              litChance: 0.25,
              fontSize: 8,
            }, fontFamily),
        },
        {
          speed: 0.35,
          draw: (layerContext) =>
            drawSkyline(layerContext, tileWidth, height, {
              baseline: height * 0.86,
              minHeight: 0.15,
              maxHeight: 0.4,
              minWidth: 70,
              maxWidth: 150,
              bodyColor: "#07070b",
              edgeColor: "rgba(0, 251, 251, 0.35)",
              windowColor: "rgba(42, 229, 0, 0.25)",
              litColor: "rgba(0, 251, 251, 0.8)",
              litChance: 0.3,
              fontSize: 10,
            }, fontFamily),
        },
        { speed: 0.8, draw: (layerContext) => drawTrack(layerContext, tileWidth, height) },
        { speed: 1.3, draw: (layerContext) => drawGroundCode(layerContext, tileWidth, height, fontFamily) },
      ];

      layers = layerSpecs.map((spec) => {
        const { image, context: layerContext } = createLayerCanvas(tileWidth, height, pixelRatio);
        spec.draw(layerContext);
        return { image, speed: spec.speed };
      });

      train = createTrain(pixelRatio, fontFamily);

      sky = context.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#040306");
      sky.addColorStop(0.7, "#120a18");
      sky.addColorStop(1, "#050507");

      haze = context.createLinearGradient(0, height * 0.45, 0, height * 0.75);
      haze.addColorStop(0, "rgba(162, 0, 255, 0)");
      haze.addColorStop(1, "rgba(162, 0, 255, 0.08)");

      rain = Array.from({ length: rainCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: randomBetween(30, 90),
        char: randomItem(rainChars),
      }));
    };

    const resizeCanvas = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
    };

    // Só recria a cidade se o tamanho mudou de verdade, para a barra do navegador no celular não gerar uma cidade nova a cada scroll.
    const handleResize = () => {
      const previousWidth = width;
      resizeCanvas();
      if (width === previousWidth && Math.abs(height - layerHeight) < 150) return;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(buildScene, 150);
    };

    const drawTiled = (layer: TiledLayer) => {
      const offset = (((worldPosition * layer.speed) % tileWidth) + tileWidth) % tileWidth;
      for (let x = -offset; x < width; x += tileWidth) {
        context.drawImage(layer.image, x, height - layerHeight, tileWidth, layerHeight);
      }
    };

    const drawTrain = () => {
      if (!train) return;
      const cycle = width * 2.5 + train.width;
      const position = ((trainPosition % cycle) + cycle) % cycle;
      const x = width - position;
      const y = height - layerHeight * 0.22 - trainCarHeight - 1;
      context.drawImage(train.image, x, y, train.width, trainCarHeight);
    };

    const drawRain = (deltaTime: number, movement: number) => {
      context.font = `12px ${fontFamily}`;
      context.textBaseline = "top";
      context.fillStyle = "rgba(42, 229, 0, 0.35)";

      for (const drop of rain) {
        if (!reducedMotion) drop.y += drop.speed * deltaTime;
        drop.x -= movement * 1.6;
        if (drop.y > height) {
          drop.y = -12;
          drop.char = randomItem(rainChars);
        }
        drop.x = ((drop.x % width) + width) % width;
        context.fillText(drop.char, drop.x, drop.y);
      }
    };

    const render = (now: number) => {
      const deltaTime = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const scroll = window.scrollY;
      const movement = (reducedMotion ? 0 : idleSpeed * deltaTime) + (scroll - lastScroll) * scrollFactor;
      lastScroll = scroll;
      worldPosition += movement;
      trainPosition += (reducedMotion ? 0 : trainSpeed * deltaTime) + movement * 0.8;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      if (sky) context.fillStyle = sky;
      context.fillRect(0, 0, width, height);

      layers.forEach((layer, index) => {
        drawTiled(layer);
        if (index === 1 && haze) {
          context.fillStyle = haze;
          context.fillRect(0, 0, width, height);
        }
        if (index === 3) drawTrain();
      });

      drawRain(deltaTime, movement);

      frameId = requestAnimationFrame(render);
    };

    resizeCanvas();
    buildScene();
    window.addEventListener("resize", handleResize);
    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="scanlines absolute inset-0" />
    </div>
  );
}
