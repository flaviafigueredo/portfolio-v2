export type SkylineOptions = {
  baseline: number;
  minHeight: number;
  maxHeight: number;
  minWidth: number;
  maxWidth: number;
  bodyColor: string;
  edgeColor: string;
  windowColor: string;
  litColor: string;
  litChance: number;
  fontSize: number;
};

export const windowChars = "01#=:|[]";

export function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function randomItem<T>(items: ArrayLike<T>) {
  return items[Math.floor(Math.random() * items.length)];
}

// Lê a fonte mono do projeto (Geist Mono) para usar no canvas.
export function readMonoFont() {
  return getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "monospace";
}

// Cria um canvas fora da tela, já ajustado para a densidade de pixels da tela.
export function createLayerCanvas(width: number, height: number, pixelRatio: number) {
  const image = document.createElement("canvas");
  image.width = Math.round(width * pixelRatio);
  image.height = Math.round(height * pixelRatio);
  const context = image.getContext("2d")!;
  context.scale(pixelRatio, pixelRatio);
  return { image, context };
}

// Desenha uma fileira de prédios que emenda perfeitamente no começo e no fim, para poder repetir sem corte.
export function drawSkyline(context: CanvasRenderingContext2D, tileWidth: number, height: number, options: SkylineOptions, fontFamily: string) {
  context.font = `${options.fontSize}px ${fontFamily}`;
  context.textBaseline = "top";

  const cellWidth = options.fontSize * 0.9;
  const cellHeight = options.fontSize * 1.5;
  let x = 0;

  while (x < tileWidth) {
    const remaining = tileWidth - x;
    const slotWidth = remaining < options.maxWidth + options.minWidth ? remaining : randomBetween(options.minWidth, options.maxWidth);
    const buildingWidth = slotWidth - randomBetween(2, 10);
    const top = options.baseline - randomBetween(options.minHeight, options.maxHeight) * height;

    context.fillStyle = options.bodyColor;
    context.fillRect(x, top, buildingWidth, height - top);
    context.fillStyle = options.edgeColor;
    context.fillRect(x, top, buildingWidth, 1);

    if (Math.random() < 0.3) {
      const antennaX = x + randomBetween(6, buildingWidth - 6);
      const antennaHeight = randomBetween(8, 26);
      context.fillRect(antennaX, top - antennaHeight, 1, antennaHeight);
      context.fillStyle = "rgba(255, 0, 255, 0.8)";
      context.fillRect(antennaX - 1, top - antennaHeight - 1, 3, 2);
    }

    for (let rowY = top + 8; rowY < options.baseline - cellHeight; rowY += cellHeight) {
      for (let columnX = x + 6; columnX < x + buildingWidth - cellWidth - 4; columnX += cellWidth) {
        if (Math.random() > options.litChance) continue;
        context.fillStyle = Math.random() < 0.12 ? options.litColor : options.windowColor;
        context.fillText(randomItem(windowChars), columnX, rowY);
      }
    }

    x += slotWidth;
  }
}
