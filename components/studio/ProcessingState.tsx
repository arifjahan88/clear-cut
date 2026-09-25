"use client";


import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Cpu, HardDrive, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ProcessingProgress {
  stage: "init" | "download" | "inference" | "compositing" | "complete";
  percentage: number;
  message: string;
  details?: string;
  isCached?: boolean;
}

interface ProcessingStateProps {
  originalImageSrc: string;
  progress: ProcessingProgress;
  onCancel?: () => void;
  imageDimensions?: { width: number; height: number };
}

export function ProcessingState({
  originalImageSrc,
  progress,
  onCancel,
  imageDimensions,
}: ProcessingStateProps) {
  const steps = [
    {
      id: "init",
      label: "WASM / GPU Engine",
      icon: Cpu,
      isDone: ["download", "inference", "compositing", "complete"].includes(progress.stage),
      isActive: progress.stage === "init",
    },
    {
      id: "download",
      label: progress.isCached ? "Model Cache" : "Neural Weights",
      icon: HardDrive,
      isDone: ["inference", "compositing", "complete"].includes(progress.stage),
      isActive: progress.stage === "download",
    },
    {
      id: "inference",
      label: "ISNet ML Segmentation",
      icon: Sparkles,
      isDone: ["compositing", "complete"].includes(progress.stage),
      isActive: progress.stage === "inference",
    },
    {
      id: "compositing",
      label: "Alpha Matting & Render",
      icon: CheckCircle2,
      isDone: progress.stage === "complete",
      isActive: progress.stage === "compositing",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6 p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm"
    >
      {/* Visual Scanning Preview */}
      <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-border/80 bg-zinc-950 shadow-inner group">
        <Image
          src={originalImageSrc}
          alt="Processing original image"
          fill
          unoptimized
          className="object-contain filter brightness-95 opacity-80"
        />

        {/* Laser Scanner Beam */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 right-0 h-1 bg-linear-to-r from-indigo-500 via-sky-400 to-indigo-500 shadow-[0_0_15px_4px_rgba(99,102,241,0.6)] animate-scanline" />
        </div>

        {/* Live Status Overlay Pill */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <Badge variant="indigo" className="bg-indigo-950/80 backdrop-blur-md text-indigo-300 border-indigo-500/40 py-1 px-3 shadow-md">
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
            AI Processing in Browser
          </Badge>
          {imageDimensions && (
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-zinc-300 border border-white/10">
              {imageDimensions.width} × {imageDimensions.height} px
            </span>
          )}
        </div>
      </div>

      {/* Progress Metric & Stage Details */}
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-foreground flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            {progress.message || "Analyzing image..."}
          </span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {Math.round(progress.percentage)}%
          </span>
        </div>

        <Progress value={progress.percentage} className="h-2.5" />

        {progress.details && (
          <p className="text-xs text-muted-foreground text-center font-mono">
            {progress.details}
          </p>
        )}
      </div>

      {/* Stepper Status Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full pt-1">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all ${
                step.isActive
                  ? "border-indigo-500/40 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : step.isDone
                  ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                  : "border-border/60 bg-muted/30 text-muted-foreground opacity-60"
              }`}
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-full mb-1.5 bg-background shadow-xs">
                {step.isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span className="text-[11px] font-medium leading-tight">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Cache & Privacy Notice */}
      <div className="w-full text-xs text-muted-foreground bg-muted/50 rounded-2xl p-3.5 border border-border/60 text-center flex flex-col gap-1">
        <p className="font-semibold text-foreground">
          🔒 100% In-Browser Privacy
        </p>
        <p className="text-[11px] leading-relaxed">
          The ONNX ML model runs directly in your browser tab. Your photo never leaves your device. Model weights are cached locally in IndexedDB for instant future removals.
        </p>
      </div>

      {onCancel && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
        >
          Cancel & choose another photo
        </Button>
      )}
    </motion.div>
  );
}
