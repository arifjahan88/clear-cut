
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { SpecsSection } from "@/components/home/SpecsSection";
import { FaqSection } from "@/components/home/FaqSection";
import { FAQ_ITEMS } from "@/lib/constants";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://clear-cut.arifjahan.com/#app",
        name: "ClearCut Studio",
        url: "https://clear-cut.arifjahan.com",
        description:
          "Free, 100% in-browser AI background remover with zero server uploads. Multi-format PNG, WebP, JPEG, and AVIF exports with client-side WebAssembly and ONNX neural models.",
        applicationCategory: "DesignApplication",
        operatingSystem: "All (Modern Web Browsers: Chrome, Firefox, Safari, Edge)",
        browserRequirements: "Requires WebAssembly (WASM) and WebGL support",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Zero Server Uploads — 100% Private In-Browser AI",
          "WebAssembly (WASM) and ONNX Neural Network Inference",
          "Interactive Split Before/After Slider",
          "Solid Color, Gradient & Custom Photo Backdrop Replacement",
          "Multi-Format Export: PNG, WebP, JPEG, AVIF with Live Download Size Preview",
          "Direct Copy-to-Clipboard for Figma, Canva, and Photoshop",
          "Drag-and-Drop and System Clipboard (Ctrl+V / Cmd+V) Paste",
          "Image Preview with Start Trigger",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://clear-cut.arifjahan.com/#website",
        url: "https://clear-cut.arifjahan.com",
        name: "ClearCut Studio",
        description: "100% Private In-Browser AI Background Remover",
        publisher: {
          "@type": "Organization",
          name: "ClearCut Studio",
          url: "https://clear-cut.arifjahan.com",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://clear-cut.arifjahan.com/#faq",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-blue-500/20 selection:text-blue-600 dark:selection:text-blue-400">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 flex flex-col items-center w-full">
        <Hero />
        <FeaturesSection />
        <SpecsSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
