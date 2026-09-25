"use client";


import { motion } from "framer-motion";
import { BackgroundRemover } from "@/components/studio/BackgroundRemover";
import { Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 flex flex-col items-center text-center">
      {/* Animated Eyebrow Pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 bg-muted/60 text-xs font-medium text-foreground mb-6 shadow-2xs backdrop-blur-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
        <span>100% Client-Side Machine Learning • Zero Cloud Processing</span>
      </motion.div>

      {/* Animated Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl leading-[1.12]"
      >
        Remove backgrounds.{" "}
        <span className="text-indigo-600 dark:text-indigo-400">
          Instantly.
        </span>{" "}
        Privately.
      </motion.h1>

      {/* Animated Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed"
      >
        High-precision neural segmentation running directly in your browser.
        No server uploads, no privacy compromises, and unlimited free exports.
      </motion.p>

      {/* Interactive Tool Area */}
      <div className="w-full mt-10">
        <BackgroundRemover />
      </div>
    </section>
  );
}
