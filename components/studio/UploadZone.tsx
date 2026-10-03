"use client";

import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { UploadCloud, ShieldCheck, FileType } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  validateImageFile,
  optimizeToStandardSize,
  OptimizedImageResult,
} from "@/lib/image-utils";
import {
  SAMPLE_IMAGES,
  STANDARD_MAX_DIMENSION,
} from "@/lib/constants";

interface UploadZoneProps {
  onImageSelected: (result: OptimizedImageResult) => void;
  isProcessing?: boolean;
}

export function UploadZone({ onImageSelected, isProcessing = false }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleProcessFile = useCallback(
    async (file: File | Blob) => {
      // 1. Validate file format and size (< 5MB)
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: "File Not Supported",
          description: validation.error || "Please select a supported image under 5 MB.",
          type: "error",
        });
        return;
      }

      if (validation.warning) {
        toast({
          title: "Optimizing Resolution",
          description: validation.warning,
          type: "warning",
          duration: 3500,
        });
      }

      setIsValidating(true);
      try {
        // 2. Standardize dimensions (max 2048px, preserving exact aspect ratio)
        const optimized = await optimizeToStandardSize(file, STANDARD_MAX_DIMENSION);

        if (optimized.wasResized) {
          toast({
            title: "Standardized Resolution",
            description: `Original ${optimized.originalWidth}×${optimized.originalHeight}px was resized to ${optimized.width}×${optimized.height}px for optimal ML inference.`,
            type: "info",
            duration: 3500,
          });
        }

        onImageSelected(optimized);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load and decode image.";
        toast({
          title: "Image Loading Error",
          description: message,
          type: "error",
        });
      } finally {
        setIsValidating(false);
      }
    },
    [onImageSelected, toast]
  );

  // Drag and drop event handlers
  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        handleProcessFile(file);
      }
    },
    [handleProcessFile]
  );

  const handleFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        handleProcessFile(file);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleProcessFile]
  );

  // Global Clipboard Paste (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isProcessing) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            toast({
              title: "Pasted from Clipboard",
              description: `Loaded image from clipboard (${file.type}).`,
              type: "success",
            });
            handleProcessFile(file);
            return;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleProcessFile, isProcessing, toast]);

  // Load sample demo image
  const handleSelectSample = async (sampleSrc: string, sampleTitle: string) => {
    if (isProcessing || isValidating) return;
    setIsValidating(true);
    try {
      const response = await fetch(sampleSrc);
      const blob = await response.blob();
      const file = new File([blob], `${sampleTitle.toLowerCase()}.jpg`, {
        type: "image/jpeg",
      });
      await handleProcessFile(file);
    } catch {
      toast({
        title: "Sample Load Error",
        description: "Could not fetch sample image. Please try uploading your own.",
        type: "error",
      });
      setIsValidating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/bmp"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={isProcessing || isValidating}
      />

      {/* Main Drag & Drop Card */}
      <Card
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!isProcessing && !isValidating) {
            fileInputRef.current?.click();
          }
        }}
        className={`w-full relative overflow-hidden cursor-pointer transition-all duration-300 border-2 border-dashed p-8 sm:p-12 text-center rounded-3xl flex flex-col items-center justify-center gap-5 group select-none ${
          isDragging
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.01]"
            : "border-border hover:border-zinc-300 dark:hover:border-zinc-700 bg-card hover:bg-muted/30 shadow-xs"
        }`}
      >
        {/* Upload Icon Circle with subtle pulse */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xs ${
            isDragging
              ? "bg-blue-600 text-white"
              : "bg-secondary text-foreground group-hover:bg-blue-600 group-hover:text-white"
          }`}
        >
          <UploadCloud className="w-8 h-8" />
        </div>

        {/* Text Prompt */}
        <div className="flex flex-col items-center gap-1.5 max-w-md">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Drop your image here, or{" "}
            <span className="text-blue-600 dark:text-blue-400 underline-offset-4 group-hover:underline">
              browse files
            </span>
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Supports PNG, JPG, WEBP, or AVIF up to 5 MB.
          </p>
        </div>

        {/* Badges / Specs strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <Badge variant="outline" className="text-[11px] py-1 px-2.5 font-medium bg-background/50 border-border/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1" />
            100% In-Browser Privacy
          </Badge>
         
          <Badge variant="outline" className="text-[11px] py-1 px-2.5 font-mono text-zinc-500 bg-background/50 hidden sm:inline-flex border-border/80">
            ⌘V / Ctrl+V to paste
          </Badge>
        </div>

        {/* Size Warning Box */}
        <div className="mt-1 text-xs text-muted-foreground/80 flex items-center gap-1.5">
          <FileType className="w-3.5 h-3.5" />
          <span>Standard maximum resolution: 2048 px (aspect ratio preserved)</span>
        </div>
      </Card>

      {/* 1-Click Sample Demos */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span className="h-px w-10 bg-border" />
          <span>Or test with a sample photo</span>
          <span className="h-px w-10 bg-border" />
        </div>

        <div className="grid grid-cols-3 gap-3 w-full max-w-md">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.id}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectSample(sample.src, sample.title);
              }}
              disabled={isProcessing || isValidating}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-border/80 bg-card hover:bg-muted/60 transition-all hover:border-blue-500/50 hover:shadow-xs group cursor-pointer text-left"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={sample.src}
                  alt={`${sample.title} - Sample test photo for AI background removal`}
                  fill
                  loading="eager"
                  priority
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="120px"
                />
              </div>
              <div className="flex flex-col items-center w-full">
                <span className="text-xs font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {sample.title}
                </span>
                <span className="text-[10px] text-muted-foreground line-clamp-1">
                  {sample.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
