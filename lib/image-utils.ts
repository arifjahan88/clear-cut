/**
 * Image processing, validation, and canvas compositing utilities.
 * 100% Client-Side operations.
 */

import {
  ALLOWED_MIME_TYPES,
  ExportImageFormat,
  MAX_UPLOAD_FILE_SIZE_BYTES,
  SOFT_SIZE_WARNING_BYTES,
  STANDARD_MAX_DIMENSION,
} from "./constants";

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
}

export interface OptimizedImageResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  wasResized: boolean;
  sizeBytes: number;
}

export type BackgroundType = "transparent" | "color" | "gradient" | "image";

export interface BackgroundConfig {
  type: BackgroundType;
  color?: string;
  gradient?: {
    from: string;
    to: string;
    direction?: "to bottom" | "to right" | "to bottom right" | "radial";
  };
  imageSrc?: string;
}

/**
 * Format bytes into readable string (e.g. "2.4 MB", "780 KB")
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Validate image file type and size before processing
 */
export function validateImageFile(file: File | Blob): ImageValidationResult {
  if (!file) {
    return { valid: false, error: "No image file provided." };
  }

  // Type check
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || "unknown"}). Please upload JPG, PNG, WEBP, or AVIF.`,
    };
  }

  // Hard limit check (production standard 5 MB to prevent tab memory crash)
  if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${formatBytes(file.size)}). Max allowed upload is 5 MB.`,
    };
  }

  // Soft warning (> 3 MB)
  let warning: string | undefined;
  if (file.size > SOFT_SIZE_WARNING_BYTES) {
    warning = `File size is ${formatBytes(file.size)}. Normalizing to standard 2048px resolution for smooth inference.`;
  }

  return { valid: true, warning };
}

/**
 * Load a Blob into an HTMLImageElement with error handling
 */
export function loadImageElement(source: Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    let urlToRevoke: string | null = null;
    if (typeof source === "string") {
      img.src = source;
    } else {
      urlToRevoke = URL.createObjectURL(source);
      img.src = urlToRevoke;
    }

    img.onload = () => {
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
      resolve(img);
    };

    img.onerror = () => {
      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
      reject(new Error("Unable to decode image. The file may be corrupted or unreadable."));
    };
  });
}

/**
 * Convert Blob to DataURL
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Maintain standard size (downscale if > maxDimension preserving exact aspect ratio)
 * and generate optimized preview Blob + DataURL
 */
export async function optimizeToStandardSize(
  source: File | Blob,
  maxDimension: number = STANDARD_MAX_DIMENSION
): Promise<OptimizedImageResult> {
  const img = await loadImageElement(source);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  if (origW === 0 || origH === 0) {
    throw new Error("Invalid image dimensions (0x0).");
  }

  let targetW = origW;
  let targetH = origH;
  let wasResized = false;

  const maxSide = Math.max(origW, origH);
  if (maxSide > maxDimension) {
    const scale = maxDimension / maxSide;
    targetW = Math.round(origW * scale);
    targetH = Math.round(origH * scale);
    wasResized = true;
  }

  // If already within standard bounds and is a Blob/File, check if resizing needed
  if (!wasResized && source instanceof Blob) {
    const dataUrl = await blobToDataUrl(source);
    return {
      blob: source,
      dataUrl,
      width: origW,
      height: origH,
      originalWidth: origW,
      originalHeight: origH,
      wasResized: false,
      sizeBytes: source.size,
    };
  }

  // Render to canvas with high smoothing
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d", { willReadFrequently: false });

  if (!ctx) {
    throw new Error("Could not initialize 2D canvas context.");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const optimizedBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Canvas blob conversion failed."));
      },
      "image/png",
      1.0
    );
  });

  const dataUrl = canvas.toDataURL("image/png");

  return {
    blob: optimizedBlob,
    dataUrl,
    width: targetW,
    height: targetH,
    originalWidth: origW,
    originalHeight: origH,
    wasResized,
    sizeBytes: optimizedBlob.size,
  };
}

export interface ExportOptions {
  format: ExportImageFormat;
  quality?: number; // 0.1 to 1.0 (default 0.95 for webp/jpeg/avif)
  jpegBackground?: string; // Default "#ffffff" if transparent
  filenamePrefix?: string;
}

export interface ExportResult {
  blob: Blob;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  format: ExportImageFormat;
}

/**
 * Export foreground cutout composited with backdrop in multiple formats (PNG, WEBP, JPEG, AVIF)
 * 100% Client-Side using HTML5 Canvas.
 */
export async function exportImageBlob(
  foregroundBlobOrUrl: Blob | string,
  background: BackgroundConfig,
  options: ExportOptions = { format: "png" },
  targetWidth?: number,
  targetHeight?: number
): Promise<ExportResult> {
  const fgImg = await loadImageElement(foregroundBlobOrUrl);
  const width = targetWidth || fgImg.naturalWidth || fgImg.width;
  const height = targetHeight || fgImg.naturalHeight || fgImg.height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: false });

  if (!ctx) {
    throw new Error("Unable to create canvas 2D context for compositing.");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const isJpeg = options.format === "jpeg";
  const quality = options.quality ?? 0.95;

  // 1. Draw Background
  if (background.type === "color" && background.color) {
    ctx.fillStyle = background.color;
    ctx.fillRect(0, 0, width, height);
  } else if (background.type === "gradient" && background.gradient) {
    const { from, to, direction = "to bottom" } = background.gradient;
    let grad: CanvasGradient;

    if (direction === "to right") {
      grad = ctx.createLinearGradient(0, 0, width, 0);
    } else if (direction === "to bottom right") {
      grad = ctx.createLinearGradient(0, 0, width, height);
    } else if (direction === "radial") {
      grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) / 2
      );
    } else {
      grad = ctx.createLinearGradient(0, 0, 0, height);
    }

    grad.addColorStop(0, from);
    grad.addColorStop(1, to);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else if (background.type === "image" && background.imageSrc) {
    const bgImg = await loadImageElement(background.imageSrc);
    const scale = Math.max(width / bgImg.width, height / bgImg.height);
    const bgW = bgImg.width * scale;
    const bgH = bgImg.height * scale;
    const offsetX = (width - bgW) / 2;
    const offsetY = (height - bgH) / 2;
    ctx.drawImage(bgImg, offsetX, offsetY, bgW, bgH);
  } else if (isJpeg && background.type === "transparent") {
    // When exporting transparent cutout as JPEG, fill with clean studio white (or custom background)
    // to avoid the black box artifact of transparent canvases
    ctx.fillStyle = options.jpegBackground || "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Draw Foreground on top
  ctx.drawImage(fgImg, 0, 0, width, height);

  // 3. Determine MIME type and extension
  let mimeType: string = "image/png";
  let extension: string = "png";
  let blobQuality: number | undefined = undefined;

  switch (options.format) {
    case "webp":
      mimeType = "image/webp";
      extension = "webp";
      blobQuality = quality;
      break;
    case "jpeg":
      mimeType = "image/jpeg";
      extension = "jpg";
      blobQuality = quality;
      break;
    case "avif":
      mimeType = "image/avif";
      extension = "avif";
      blobQuality = quality;
      break;
    case "png":
    default:
      mimeType = "image/png";
      extension = "png";
      blobQuality = 1.0;
      break;
  }

  // 4. Convert canvas to Blob
  let exportedBlob = await new Promise<Blob | null>((resolve) => {
    try {
      canvas.toBlob((b) => resolve(b), mimeType, blobQuality);
    } catch {
      resolve(null);
    }
  });

  // Handle AVIF fallback in case browser does not support canvas.toBlob("image/avif")
  let effectiveFormat = options.format;
  if (!exportedBlob || (options.format === "avif" && exportedBlob.type !== "image/avif")) {
    if (options.format === "avif") {
      // Fallback to high-quality WebP
      mimeType = "image/webp";
      extension = "webp";
      effectiveFormat = "webp";
      exportedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Image export failed."))),
          "image/webp",
          quality
        );
      });
    } else {
      throw new Error(`Failed to export image in ${options.format.toUpperCase()} format.`);
    }
  }

  const prefix = options.filenamePrefix || "clearcut";
  const filename = `${prefix}-${Date.now()}.${extension}`;

  return {
    blob: exportedBlob,
    filename,
    mimeType,
    sizeBytes: exportedBlob.size,
    width,
    height,
    format: effectiveFormat,
  };
}

/**
 * Composite the transparent foreground cutout onto a desired background
 * (solid color, gradient, or custom background image)
 */
export async function compositeBackground(
  foregroundBlobOrUrl: Blob | string,
  background: BackgroundConfig,
  targetWidth?: number,
  targetHeight?: number
): Promise<Blob> {
  const result = await exportImageBlob(
    foregroundBlobOrUrl,
    background,
    { format: "png" },
    targetWidth,
    targetHeight
  );
  return result.blob;
}


/**
 * Copy image blob directly to user's system clipboard (PNG ClipboardItem)
 */
export async function copyImageBlobToClipboard(blob: Blob): Promise<boolean> {
  if (!navigator.clipboard || !window.ClipboardItem) {
    throw new Error("ClipboardItem API is not supported in this browser.");
  }

  let pngBlob = blob;
  if (blob.type !== "image/png") {
    const img = await loadImageElement(blob);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context failed.");
    ctx.drawImage(img, 0, 0);
    pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG conversion failed"))), "image/png");
    });
  }

  const item = new ClipboardItem({ "image/png": pngBlob });
  await navigator.clipboard.write([item]);
  return true;
}

/**
 * Trigger browser file download for a Blob
 */
export function downloadBlob(blob: Blob, filename = "background-removed.png") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
