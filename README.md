# ClearCut Studio ✂️✨

> **100% Private, In-Browser AI Background Remover**  
> Powered by WebAssembly (WASM) and ONNX neural models. Zero server uploads. Free, fast, and unlimited.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-WASM_SIMD-654ff0?style=flat-square&logo=webassembly)](https://webassembly.org/)
[![ONNX Runtime](https://img.shields.io/badge/ONNX_Runtime-Web-005ced?style=flat-square)](https://onnxruntime.ai/)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_Client--Side-emerald?style=flat-square)](https://github.com/arifjahan88/clear-cut)
[![License](https://img.shields.io/badge/License-MIT-amber?style=flat-square)](LICENSE)

---

## 🌟 Overview

**ClearCut Studio** is a modern, high-performance web application that removes image backgrounds completely inside your browser. Unlike traditional cloud-based background removers that upload your photos to remote servers, ClearCut runs state-of-the-art neural network inference locally in your browser tab using WebAssembly and ONNX Runtime Web.

Your photos **never leave your device**. Perfect for confidential documents, personal portraits, e-commerce products, and creative workflows.

---

## ✨ Features

- 🔒 **100% Client-Side Privacy**  
  Zero bytes are uploaded to any server. Inference executes strictly within your device's memory. Safe for sensitive photos and private documents.
- ⚡ **Hardware-Accelerated WASM Execution**  
  Powered by WebAssembly SIMD and ONNX Runtime Web with cross-origin isolated multi-threading for rapid tensor computations.
- 💾 **IndexedDB Model Weight Caching**  
  Neural network weights are downloaded once on initial use and securely stored in your browser's local IndexedDB cache for near-instant repeat processing even offline.
- 🎚️ **Interactive Before / After Comparison**  
  Inspect fine edge cuts (hair strands, fur, transparent glass) with an interactive split slider, side-by-side mode, or cutout-only preview.
- 🎨 **Studio Background Replacer**  
  Replace removed backgrounds directly within the studio:
  - **Transparent** with checkerboard inspection grid
  - **Solid Colors** with curated studio presets and HTML5 color picker
  - **Vibrant Gradients** (linear multi-stop blends)
  - **Custom Image Upload** for custom backdrops
- 📋 **1-Click Copy & Export**  
  Copy transparent PNG cutouts directly to your system clipboard (ready to paste into Figma, Canva, or Photoshop) or export full-resolution PNG files.
- 🖼️ **Built-in Sample Gallery**  
  Test background removal instantly with 1-click sample photos for portraits, pets, and e-commerce products.
- 🌗 **Adaptive Dark & Light Theme**  
  Tailored design system using modern typography (**Plus Jakarta Sans** & **JetBrains Mono**) and dynamic theme transitions.

---

## 🏗️ Architecture & Pipeline

```
[ User Image (Drag & Drop / Paste / File Picker) ]
                         │
                         ▼
[ Client-Side Validation & Memory Optimization (Max 2048px Bicubic) ]
                         │
                         ▼
[ IndexedDB Model Cache Check ] ──(If Missing)──► [ Chunked Weight Download ]
                         │                                  │
                         └─────────────────┬────────────────┘
                                           ▼
             [ ISNet Deep Salient Neural Network (WASM / ONNX) ]
                                           │
                                           ▼
             [ High-Precision Alpha Matte Segmentation ]
                                           │
                                           ▼
             [ HTML5 Canvas Compositing & Transparency Layer ]
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
       [ 1-Click Clipboard Copy ]                    [ Full Resolution PNG Export ]
```

1. **Input & Validation**: The input image is parsed locally. Dimensions exceeding 2048px are smoothly downscaled preserving exact aspect ratio to safeguard device memory.
2. **Model Persistence**: Model weights are checked against local IndexedDB storage. Cached models load near-instantly without network round-trips.
3. **Inference**: WebAssembly executes the ISNet segmentation model across image color channels to generate an alpha transparency mask.
4. **Compositing**: The mask is rendered with sub-pixel boundary smoothing onto an HTML5 canvas for live background replacement and export.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) | Fast compilation and static page generation |
| **Library** | [React 19](https://react.dev/) | Component architecture & hooks |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first design system with `@theme` |
| **Components** | [Base UI](https://base-ui.com/) / [shadcn](https://ui.shadcn.com/) | Accessible headless primitives & animations |
| **Machine Learning** | [@imgly/background-removal](https://github.com/imgly/background-removal-js) | In-browser ISNet neural inference via ONNX Web |
| **Typography** | [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | Clean geometric grotesque and monospace fonts |
| **Motion** | [Framer Motion](https://www.framer.com/motion/) | Smooth UI layout and state transitions |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, lightweight vector iconography |
| **Theme** | [next-themes](https://github.com/pacocoursey/next-themes) | Seamless dark and light mode switching |

---

## 📁 Project Structure

```
bg-remove/
├── app/
│   ├── globals.css          # Tailwind CSS v4 design tokens & keyframes
│   ├── icon.svg             # Dynamic SVG favicon & app icon
│   ├── layout.tsx           # Root layout with fonts, metadata, and providers
│   └── page.tsx             # Studio landing page entrypoint
├── components/
│   ├── home/
│   │   ├── FaqSection.tsx       # Animated Base UI accordion with product FAQs
│   │   ├── FeaturesSection.tsx  # Product highlights & privacy guarantees
│   │   ├── Hero.tsx             # Landing hero with embedded studio workspace
│   │   └── SpecsSection.tsx     # Technical resolution, limits, and engine specs
│   ├── layout/
│   │   ├── Footer.tsx           # Clean footer with architecture callouts
│   │   ├── Header.tsx           # Sticky topbar with privacy badge & theme toggle
│   │   └── Logo.tsx             # Aperture gradient mark & brand typography
│   ├── studio/
│   │   ├── BackgroundRemover.tsx    # Primary studio pipeline controller
│   │   ├── BackgroundReplacer.tsx   # Color/gradient/custom backdrop editor
│   │   ├── ImageComparison.tsx      # Split before/after draggable slider
│   │   ├── ProcessingState.tsx      # Live progress bar & engine status
│   │   └── UploadZone.tsx           # Drag & drop area with demo sample gallery
│   ├── ui/                  # Reusable UI primitives (Button, Card, Badge, etc.)
│   ├── ThemeProvider.tsx    # Dark/light theme context wrapper
│   └── ThemeToggle.tsx      # Smooth theme switcher component
├── lib/
│   ├── constants.ts         # Sample images, color presets, and FAQ items
│   ├── image-utils.ts       # Canvas processing, scaling, and export helpers
│   └── utils.ts             # Tailwind class merging utility (`cn`)
├── public/
│   ├── favicon.svg          # Vector aperture brand favicon
│   └── samples/             # Demo images (portrait, product, pet)
├── next.config.ts           # Next.js configuration with COOP/COEP headers
├── package.json             # Project dependencies and build scripts
└── tsconfig.json            # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 18.18+** or **Node.js 20+** installed:

```bash
node -v
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arifjahan88/clear-cut.git
   cd clear-cut
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## ⚡ Production Build

To create an optimized production build:

```bash
npm run build
npm run start
```

---

## 🌐 Browser Compatibility & Acceleration

ClearCut Studio is optimized for all modern web browsers supporting WebAssembly and Web Workers:

| Browser | Supported | WASM Multi-Threading |
|---|---|---|
| **Google Chrome / Chromium** | 92+ | ✅ Supported |
| **Microsoft Edge** | 92+ | ✅ Supported |
| **Mozilla Firefox** | 89+ | ✅ Supported |
| **Apple Safari** | 15.2+ | ✅ Supported |

> **Note on WebAssembly Multi-Threading:**  
> Multi-threaded tensor inference utilizes `SharedArrayBuffer`, which requires Cross-Origin Isolation headers (`Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless`). These headers are pre-configured in `next.config.ts`. If running in environments where isolation is unavailable, the engine gracefully falls back to single-threaded WebAssembly execution.

---

## 🔒 Privacy Guarantee

- **No Remote Processing**: All neural segmentation calculations run strictly on your CPU/GPU inside your local browser tab.
- **No Telemetry**: No images, thumbnails, or user data are ever uploaded, logged, or tracked.
- **Offline Capable**: Once the model weights are cached in your browser's IndexedDB, the application can remove backgrounds completely offline.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
