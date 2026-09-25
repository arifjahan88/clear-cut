import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://clearcut.studio"),
  title: {
    default: "ClearCut Studio — Free In-Browser AI Background Remover | 100% Private",
    template: "%s | ClearCut Studio",
  },
  description:
    "Remove image backgrounds instantly in your browser with zero server uploads. Powered by client-side WebAssembly & ONNX neural models. 100% private, free, and unlimited high-resolution exports.",
  applicationName: "ClearCut Studio",
  authors: [{ name: "ClearCut Studio", url: "https://clearcut.studio" }],
  generator: "Next.js",
  keywords: [
    "background remover",
    "remove background from image",
    "free background remover",
    "remove bg free",
    "in browser background removal",
    "private image editor",
    "client-side AI",
    "wasm background remover",
    "onnx web background remover",
    "transparent png maker",
    "photo cutout",
    "clearcut studio",
  ],
  referrer: "origin-when-cross-origin",
  creator: "ClearCut Studio",
  publisher: "ClearCut Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ClearCut Studio — Free In-Browser AI Background Remover",
    description:
      "Remove image backgrounds instantly in your browser with zero server uploads. 100% private, client-side AI. Free, unlimited, full-resolution exports.",
    url: "https://clearcut.studio",
    siteName: "ClearCut Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearCut Studio — Free In-Browser AI Background Remover",
    description:
      "Remove image backgrounds instantly in your browser with zero server uploads. 100% private, client-side AI.",
    creator: "@clearcutstudio",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", fontSans.variable, fontMono.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-blue-500/20 selection:text-blue-600 dark:selection:text-blue-400">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
