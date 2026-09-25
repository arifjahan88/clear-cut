"use client";


import { motion } from "framer-motion";
import { ShieldCheck, Zap, Sparkles, Check } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% Client-Side Privacy",
    description:
      "Unlike cloud services that ingest and store your personal or confidential photos, inference runs strictly inside your local browser memory.",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    bullets: [
      "Zero bytes sent to any remote server",
      "Safe for sensitive & private documents",
      "No telemetry or data logging",
    ],
  },
  {
    icon: Zap,
    title: "Hardware Accelerated Speed",
    description:
      "Powered by WebAssembly (WASM) and ONNX Runtime Web. Neural weights are cached locally via IndexedDB for near-instant repeat processing.",
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    bullets: [
      "No waiting in cloud API queues",
      "Persistent IndexedDB offline model cache",
      "Optimized CPU / WebGPU tensor operations",
    ],
  },
  {
    icon: Sparkles,
    title: "Unlimited Free Studio",
    description:
      "No paywalls, subscriptions, or intrusive watermarks. Inspect edge cuts with the split slider, customize backdrops, and copy directly to clipboard.",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    bullets: [
      "Interactive Before / After split comparison",
      "Solid, gradient, and custom image backdrops",
      "1-click copy to clipboard for Figma & Canva",
    ],
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full border-t border-border/80 bg-muted/20 py-20 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Next-Generation Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2">
            Why client-side AI is superior
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Eliminate server roundtrips, recurring subscriptions, and third-party data tracking with local on-device machine learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="h-full rounded-3xl border border-border/80 bg-card p-7 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between group">
                  <div className="flex flex-col gap-4">
                    {/* Icon Container with Refined Padding */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs transition-transform duration-300 group-hover:scale-105 ${feat.iconBg}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col gap-2">
                      <CardTitle className="text-lg font-bold text-foreground tracking-tight">
                        {feat.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                        {feat.description}
                      </CardDescription>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="mt-6 pt-5 border-t border-border/60 flex flex-col gap-2.5">
                    {feat.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-center gap-2 text-xs text-foreground/80 font-medium">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
