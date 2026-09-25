/**
 * Centralized application constants and configurations.
 */

// Production upload file size thresholds
export const MAX_UPLOAD_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB hard limit
export const SOFT_SIZE_WARNING_BYTES = 3 * 1024 * 1024; // 3 MB soft optimization warning
export const STANDARD_MAX_DIMENSION = 2048; // Standard maximum resolution (px)

// Allowed image MIME types
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/bmp",
];

// Sample demo images for 1-click testing
export const SAMPLE_IMAGES = [
  {
    id: "portrait",
    title: "Portrait",
    tag: "Fine Hair & Edges",
    src: "/samples/portrait.jpg",
  },
  {
    id: "product",
    title: "Product",
    tag: "E-Commerce",
    src: "/samples/product.jpg",
  },
  {
    id: "pet",
    title: "Pet",
    tag: "Fur & Detail",
    src: "/samples/pet.jpg",
  },
];

// Curated solid studio backdrops
export const COLOR_PRESETS = [
  { id: "white", label: "Pure White", color: "#ffffff", border: true },
  { id: "offblack", label: "Studio Dark", color: "#09090b" },
  { id: "sand", label: "Warm Sand", color: "#f4ede4" },
  { id: "slate", label: "Slate", color: "#475569" },
  { id: "sky", label: "Sky Blue", color: "#38bdf8" },
  { id: "emerald", label: "Sage Green", color: "#10b981" },
  { id: "rose", label: "Pastel Rose", color: "#fb7185" },
  { id: "electric-blue", label: "Electric Blue", color: "#2563eb" },
];

// Modern gradient backdrops
export const GRADIENT_PRESETS = [
  {
    id: "studio-light",
    label: "Studio Glow",
    gradient: { from: "#f8fafc", to: "#cbd5e1", direction: "to bottom" as const },
  },
  {
    id: "sunset",
    label: "Warm Dusk",
    gradient: { from: "#f97316", to: "#db2777", direction: "to bottom right" as const },
  },
  {
    id: "ocean",
    label: "Deep Ocean",
    gradient: { from: "#0284c7", to: "#0f172a", direction: "to bottom right" as const },
  },
  {
    id: "cyber",
    label: "Cyber Neon",
    gradient: { from: "#8b5cf6", to: "#ec4899", direction: "to right" as const },
  },
];

// Curated export formats
export type ExportImageFormat = "png" | "webp" | "jpeg" | "avif";

export interface ExportFormatConfig {
  id: ExportImageFormat;
  extension: string;
  mimeType: string;
  name: string;
  tag: string;
  badge: string;
  supportsTransparency: boolean;
  description: string;
  idealFor: string;
}

export const EXPORT_FORMATS: ExportFormatConfig[] = [
  {
    id: "png",
    extension: "png",
    mimeType: "image/png",
    name: "PNG",
    tag: "Lossless Alpha",
    badge: "Transparent",
    supportsTransparency: true,
    description: "Lossless quality with transparent background.",
    idealFor: "Design & editing cutouts",
  },
  {
    id: "webp",
    extension: "webp",
    mimeType: "image/webp",
    name: "WebP",
    tag: "Web Optimized",
    badge: "Ultra Light",
    supportsTransparency: true,
    description: "Ultra-small size with transparency preserved.",
    idealFor: "Websites & apps",
  },
  {
    id: "jpeg",
    extension: "jpg",
    mimeType: "image/jpeg",
    name: "JPEG",
    tag: "Clean Backdrop",
    badge: "Universal",
    supportsTransparency: false,
    description: "Standard photo format with solid backdrop.",
    idealFor: "Marketplaces & print",
  },
  {
    id: "avif",
    extension: "avif",
    mimeType: "image/avif",
    name: "AVIF",
    tag: "Next-Gen",
    badge: "Max Savings",
    supportsTransparency: true,
    description: "Next-gen maximum compression & HDR fidelity.",
    idealFor: "Modern high-speed web",
  },
];

// FAQ items
export const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "Does any photo data get sent to a remote server?",
    answer:
      "No. Absolutely zero bytes leave your device. The machine learning model runs 100% inside your browser tab using WebAssembly (WASM) and ONNX Runtime Web. Even if you disconnect from the internet after loading the page, background removal continues to work seamlessly.",
  },
  {
    id: "faq-2",
    question: "What is the recommended photo size and format?",
    answer:
      "ClearCut accepts PNG, JPG, WEBP, AVIF, and BMP files up to 5 MB. Photos are automatically normalized to a standard production resolution (up to 2048 px) while strictly preserving original aspect ratio and fine edge details.",
  },
  {
    id: "faq-3",
    question: "Why does the first image take a few seconds?",
    answer:
      "On the initial run, the browser retrieves the neural network model (~40 MB) and initializes the WASM engine. The model is immediately cached locally in your browser's IndexedDB storage, making every subsequent background removal nearly instantaneous.",
  },
  {
    id: "faq-4",
    question: "Can I paste screenshots directly from my clipboard?",
    answer:
      "Yes! Simply take a screenshot or copy any image to your clipboard, then press Ctrl+V (or Cmd+V on Mac) anywhere on this page to remove its background instantly.",
  },
  {
    id: "faq-5",
    question: "Are there any usage limits, watermarks, or subscriptions?",
    answer:
      "None. ClearCut is completely free to use directly in your browser with zero watermarks, zero subscriptions, and multi-format exports in PNG, WEBP, JPEG, and AVIF.",
  },
];

