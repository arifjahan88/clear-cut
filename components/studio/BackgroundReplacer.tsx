"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Download,
  Copy,
  RotateCcw,
  Upload,
  Palette,
  Check,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  BackgroundConfig,
  compositeBackground,
  copyImageBlobToClipboard,
  downloadBlob,
} from "@/lib/image-utils";
import { COLOR_PRESETS, GRADIENT_PRESETS } from "@/lib/constants";
import { ChangeEvent, useRef, useState } from "react";

interface BackgroundReplacerProps {
  processedBlob: Blob;
  processedUrl: string;
  originalWidth: number;
  originalHeight: number;
  onReset: () => void;
}

export function BackgroundReplacer({
  processedBlob,
  processedUrl,
  originalWidth,
  originalHeight,
  onReset,
}: BackgroundReplacerProps) {
  const [bgConfig, setBgConfig] = useState<BackgroundConfig>({
    type: "transparent",
  });
  const [customColor, setCustomColor] = useState("#ffffff");
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle custom background image upload
  const handleCustomBgUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setBgConfig({
        type: "image",
        imageSrc: url,
      });
      toast({
        title: "Backdrop Applied",
        description: `Applied ${file.name} as backdrop.`,
        type: "success",
      });
    }
  };

  // Download high-resolution PNG
  const handleDownload = async () => {
    setIsExporting(true);
    try {
      let finalBlob = processedBlob;
      if (bgConfig.type !== "transparent") {
        finalBlob = await compositeBackground(
          processedBlob,
          bgConfig,
          originalWidth,
          originalHeight
        );
      }
      downloadBlob(finalBlob, `clearcut-${Date.now()}.png`);
      toast({
        title: "Download Started",
        description: `Exported ${originalWidth}×${originalHeight}px PNG.`,
        type: "success",
      });
    } catch {
      toast({
        title: "Download Error",
        description: "Could not export image.",
        type: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to clipboard
  const handleCopyClipboard = async () => {
    try {
      let finalBlob = processedBlob;
      if (bgConfig.type !== "transparent") {
        finalBlob = await compositeBackground(
          processedBlob,
          bgConfig,
          originalWidth,
          originalHeight
        );
      }
      await copyImageBlobToClipboard(finalBlob);
      setIsCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "Image is ready to paste into Figma, Slack, or Canva.",
        type: "success",
      });
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      toast({
        title: "Clipboard Error",
        description: "Could not copy image. Check browser permissions.",
        type: "error",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto flex flex-col gap-6"
    >
      {/* Studio Canvas Preview */}
      <div className="w-full flex flex-col items-center">
        <div
          className={`relative w-full aspect-square sm:aspect-4/3 rounded-3xl overflow-hidden border border-border shadow-md flex items-center justify-center ${
            bgConfig.type === "transparent" ? "bg-checkerboard" : ""
          }`}
          style={
            bgConfig.type === "color"
              ? { backgroundColor: bgConfig.color }
              : bgConfig.type === "gradient" && bgConfig.gradient
              ? {
                  background: `linear-gradient(${
                    bgConfig.gradient.direction || "to bottom"
                  }, ${bgConfig.gradient.from}, ${bgConfig.gradient.to})`,
                }
              : undefined
          }
        >
          {bgConfig.type === "image" && bgConfig.imageSrc && (
            <Image
              src={bgConfig.imageSrc}
              alt="Custom backdrop"
              fill
              unoptimized
              className="object-cover"
            />
          )}

          <Image
            src={processedUrl}
            alt="Foreground cutout"
            fill
            unoptimized
            className="object-contain"
          />

          {/* Resolution Badge */}
          <div className="absolute top-3 right-3 pointer-events-none">
            <span className="text-[11px] font-mono font-medium px-2 py-1 rounded bg-black/60 backdrop-blur-md text-zinc-200 border border-white/10 shadow-xs">
              {originalWidth} × {originalHeight} px
            </span>
          </div>
        </div>
      </div>

      {/* Background Replacement Customizer Controls */}
      <Card className="p-4 sm:p-6 rounded-3xl border border-border bg-card shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-semibold text-foreground">
              Backdrop & Replacement
            </h4>
          </div>
          <span className="text-xs text-muted-foreground capitalize">
            {bgConfig.type === "transparent"
              ? "Transparent PNG"
              : bgConfig.type === "color"
              ? `Solid (${bgConfig.color})`
              : bgConfig.type === "gradient"
              ? "Studio Gradient"
              : "Custom Image"}
          </span>
        </div>

        {/* Color / Backdrop Selector Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Transparent Button */}
          <button
            onClick={() => setBgConfig({ type: "transparent" })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              bgConfig.type === "transparent"
                ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                : "border-border hover:bg-muted text-muted-foreground"
            }`}
          >
            <div className="w-3.5 h-3.5 rounded border border-zinc-400 bg-checkerboard" />
            Transparent
          </button>

          <span className="h-4 w-px bg-border mx-1 hidden sm:block" />

          {/* Curated Color Swatches */}
          {COLOR_PRESETS.map((p) => {
            const isSelected =
              bgConfig.type === "color" && bgConfig.color === p.color;
            return (
              <button
                key={p.id}
                onClick={() =>
                  setBgConfig({ type: "color", color: p.color })
                }
                title={p.label}
                className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                  p.border ? "border border-zinc-300 dark:border-zinc-700" : ""
                } ${isSelected ? "ring-2 ring-blue-500 ring-offset-2 scale-110" : "hover:scale-105"}`}
                style={{ backgroundColor: p.color }}
              >
                {isSelected && (
                  <Check
                    className={`w-3.5 h-3.5 ${
                      p.color === "#ffffff" || p.color === "#f4ede4"
                        ? "text-black"
                        : "text-white"
                    }`}
                  />
                )}
              </button>
            );
          })}

          {/* Custom Color Input */}
          <label
            title="Custom Hex Color"
            className="w-7 h-7 rounded-full border border-dashed border-border flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors relative overflow-hidden"
          >
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                setBgConfig({ type: "color", color: e.target.value });
              }}
              className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
            />
            <span
              className="w-full h-full rounded-full"
              style={{ backgroundColor: customColor }}
            />
          </label>

          <span className="h-4 w-px bg-border mx-1 hidden sm:block" />

          {/* Gradients */}
          {GRADIENT_PRESETS.map((g) => {
            const isSelected =
              bgConfig.type === "gradient" &&
              bgConfig.gradient?.from === g.gradient.from;
            return (
              <button
                key={g.id}
                onClick={() =>
                  setBgConfig({
                    type: "gradient",
                    gradient: g.gradient,
                  })
                }
                title={g.label}
                className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                  isSelected ? "ring-2 ring-blue-500 ring-offset-2 scale-110" : "hover:scale-105"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${g.gradient.from}, ${g.gradient.to})`,
                }}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}

          <span className="h-4 w-px bg-border mx-1 hidden sm:block" />

          {/* Custom Background Image Button */}
          <input
            ref={bgFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCustomBgUpload}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => bgFileInputRef.current?.click()}
            className="h-8 text-xs gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Upload Backdrop</span>
          </Button>
        </div>
      </Card>

      {/* Main Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          size="lg"
          onClick={onReset}
          className="gap-2 cursor-pointer rounded-2xl text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Upload Another Image</span>
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleCopyClipboard}
            className="gap-2 cursor-pointer rounded-2xl font-medium"
          >
            {isCopied ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{isCopied ? "Copied!" : "Copy PNG"}</span>
          </Button>

          <Button
            variant="accent"
            size="lg"
            onClick={handleDownload}
            disabled={isExporting}
            className="gap-2 cursor-pointer rounded-2xl font-semibold shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? "Exporting..." : "Download Full PNG"}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
