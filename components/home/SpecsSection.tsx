"use client";


import { motion } from "framer-motion";
import { Maximize2, FileCheck2, Cpu, HardDrive } from "lucide-react";

export function SpecsSection() {
  const specs = [
    {
      icon: Maximize2,
      label: "Standard Resolution",
      value: "Up to 2048 px",
      desc: "Preserves exact aspect ratio with high-fidelity bicubic smoothing.",
      color: "text-indigo-500",
    },
    {
      icon: FileCheck2,
      label: "Upload Limit & Formats",
      value: "5 MB Standard",
      desc: "Supports PNG, JPG, WEBP, AVIF, and BMP with in-memory validation.",
      color: "text-emerald-500",
    },
    {
      icon: Cpu,
      label: "Segmentation Model",
      value: "ISNet ONNX",
      desc: "Deep salient feature extraction for fine hair, fur, and edges.",
      color: "text-amber-500",
    },
    {
      icon: HardDrive,
      label: "Storage & Cache",
      value: "IndexedDB",
      desc: "Model weights stored locally for instant offline repeat operations.",
      color: "text-sky-500",
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 flex flex-col gap-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Performance Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            Production-grade image standards
          </h2>
        </div>
        <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
          Safeguards browser tab memory and ensures responsive inference across mobile devices and laptops.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {specs.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="p-5 rounded-2xl border border-border bg-card flex flex-col gap-2 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                {item.label}
              </span>
              <span className="text-lg font-bold text-foreground">
                {item.value}
              </span>
              <span className="text-xs text-muted-foreground leading-relaxed">
                {item.desc}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
