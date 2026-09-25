"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SlidersHorizontal, Columns2, Eye } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ImageComparisonProps {
  originalSrc: string;
  processedSrc: string;
  width?: number;
  height?: number;
}

export function ImageComparison({
  originalSrc,
  processedSrc,
  width,
  height,
}: ImageComparisonProps) {
  const [viewMode, setViewMode] = React.useState<"slider" | "side" | "result">("slider");
  const [sliderPosition, setSliderPosition] = React.useState(50);
  const [isDragging, setIsDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMove = React.useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(pos);
    },
    []
  );

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handlePointerUp = React.useCallback(
    (e: React.PointerEvent) => {
      if (isDragging) {
        setIsDragging(false);
        try {
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    },
    [isDragging]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-center gap-4"
    >
      {/* Controls Bar */}
      <div className="w-full flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Tabs
            value={viewMode}
            onValueChange={(val) => setViewMode(val as "slider" | "side" | "result")}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="slider" className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Split Slider</span>
                <span className="sm:hidden">Slider</span>
              </TabsTrigger>
              <TabsTrigger value="side" className="flex items-center gap-1.5">
                <Columns2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Side-by-Side</span>
                <span className="sm:hidden">Side</span>
              </TabsTrigger>
              <TabsTrigger value="result" className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Result</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {width && height && (
          <Badge variant="outline" className="text-xs font-mono text-muted-foreground bg-muted/40 border-border/80">
            {width} × {height} px
          </Badge>
        )}
      </div>

      {/* View Mode 1: Interactive Split Slider */}
      {viewMode === "slider" && (
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-full max-w-3xl aspect-square sm:aspect-4/3 rounded-3xl overflow-hidden border border-border bg-card shadow-sm cursor-ew-resize select-none touch-none"
        >
          {/* Background Layer: Processed Result on Checkerboard */}
          <div className="absolute inset-0 bg-checkerboard flex items-center justify-center">
            <Image
              src={processedSrc}
              alt="Processed background removed"
              fill
              unoptimized
              className="object-contain pointer-events-none"
            />
            <div className="absolute bottom-3 right-3 pointer-events-none">
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-xs">
                Background Removed
              </span>
            </div>
          </div>

          {/* Foreground Layer: Original Image (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center">
              <Image
                src={originalSrc}
                alt="Original photo"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
            <div className="absolute bottom-3 left-3 pointer-events-none">
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-xs">
                Original
              </span>
            </div>
          </div>

          {/* Draggable Divider Handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-zinc-900 shadow-lg border border-zinc-200 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>
      )}

      {/* View Mode 2: Side-by-Side */}
      {viewMode === "side" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Original Photo
            </span>
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-zinc-950 shadow-xs">
              <Image
                src={originalSrc}
                alt="Original photo"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Removed Background
            </span>
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-checkerboard shadow-xs">
              <Image
                src={processedSrc}
                alt="Removed background"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* View Mode 3: Isolated Result Preview */}
      {viewMode === "result" && (
        <div className="relative w-full max-w-3xl aspect-square sm:aspect-4/3 rounded-3xl overflow-hidden border border-border bg-checkerboard shadow-sm flex items-center justify-center">
          <Image
            src={processedSrc}
            alt="Removed background cutout"
            fill
            unoptimized
            className="object-contain"
          />
        </div>
      )}
    </motion.div>
  );
}
