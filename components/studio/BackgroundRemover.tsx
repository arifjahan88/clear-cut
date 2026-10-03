"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/ui/toast";
import { UploadZone } from "@/components/studio/UploadZone";
import { ProcessingState, ProcessingProgress } from "@/components/studio/ProcessingState";
import { ImageComparison } from "@/components/studio/ImageComparison";
import { BackgroundReplacer } from "@/components/studio/BackgroundReplacer";
import { OptimizedImageResult, formatBytes } from "@/lib/image-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Lock,
  Cpu,
  HardDrive,
  Play,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function BackgroundRemover() {
  const [selectedImage, setSelectedImage] = useState<OptimizedImageResult | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({
    stage: "init",
    percentage: 0,
    message: "Initializing engine...",
  });

  const abortControllerRef = useRef<boolean>(false);
  const { toast } = useToast();

  const handleImageSelected = useCallback(
    (optimizedResult: OptimizedImageResult) => {
      setSelectedImage(optimizedResult);
      setProcessedBlob(null);
      setProcessedUrl(null);
      setIsProcessing(false);
    },
    []
  );

  const handleStartProcessing = useCallback(async () => {
    if (!selectedImage) return;
    setProcessedBlob(null);
    setProcessedUrl(null);
    setIsProcessing(true);
    abortControllerRef.current = false;

    setProgress({
      stage: "init",
      percentage: 5,
      message: "Loading in-browser ONNX ML engine...",
      details: "Setting up WebAssembly environment",
    });

    try {
      /**
       * AGPL-3.0 License Notice:
       * In-browser segmentation powered by @imgly/background-removal (AGPLv3).
       * Free for open-source and personal usage. Commercial closed-source deployments
       * may require a commercial license from IMG.LY.
       */
      const imgly = await import("@imgly/background-removal");
      const removeBackgroundFn =
        imgly.removeBackground ||
        (imgly as unknown as { default: typeof imgly.removeBackground }).default;

      if (abortControllerRef.current) return;

      setProgress({
        stage: "download",
        percentage: 15,
        message: "Preparing neural network...",
        details: "Checking IndexedDB local cache",
        isCached: false,
      });

      // Track download / compute progress
      const config = {
        debug: false,
        model: "isnet_fp16" as const,
        output: {
          format: "image/png" as const,
          quality: 1.0,
          type: "foreground" as const,
        },
        progress: (key: string, current: number, total: number) => {
          if (abortControllerRef.current) return;

          if (key.startsWith("fetch:")) {
            const percent = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 50;
            const mappedPercent = 15 + Math.round((percent * 55) / 100);

            setProgress({
              stage: "download",
              percentage: mappedPercent,
              message: `Downloading neural model weights...`,
              details: `${formatBytes(current)} / ${formatBytes(total)} (${percent}%) • Cached in IndexedDB`,
              isCached: false,
            });
          } else if (key === "compute:decode") {
            setProgress({
              stage: "inference",
              percentage: 72,
              message: "Decoding and preparing image tensors...",
              details: "Analyzing pixel channels",
            });
          } else if (key === "compute:inference") {
            setProgress({
              stage: "inference",
              percentage: 82,
              message: "Running ISNet neural segmentation...",
              details: "WASM inference across image",
            });
          } else if (key === "compute:mask") {
            setProgress({
              stage: "compositing",
              percentage: 92,
              message: "Computing alpha matte...",
              details: "Smoothing boundary edges & hair strands",
            });
          } else if (key === "compute:encode") {
            setProgress({
              stage: "compositing",
              percentage: 98,
              message: "Generating transparent PNG cutout...",
              details: "Finalizing pixel buffer",
            });
          }
        },
      };

      const resultBlob: Blob = await removeBackgroundFn(selectedImage.blob, config);

      if (abortControllerRef.current) return;

      const resultUrl = URL.createObjectURL(resultBlob);

      setProgress({
        stage: "complete",
        percentage: 100,
        message: "Background removed successfully!",
      });

      setProcessedBlob(resultBlob);
      setProcessedUrl(resultUrl);
      setIsProcessing(false);

      toast({
        title: "Background Removed",
        description: "Cutout generated with transparent alpha channel.",
        type: "success",
      });
    } catch (err: unknown) {
      if (abortControllerRef.current) return;
      console.error("Background removal error:", err);
      const errMsg = err instanceof Error ? err.message : "Background removal failed.";
      toast({
        title: "Processing Failed",
        description: errMsg,
        type: "error",
        duration: 6000,
      });
      setIsProcessing(false);
    }
  }, [selectedImage, toast]);

  // Press Enter key while viewing ready image to start
  useEffect(() => {
    if (!selectedImage || isProcessing || processedBlob) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        handleStartProcessing();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, isProcessing, processedBlob, handleStartProcessing]);

  const handleReset = useCallback(() => {
    abortControllerRef.current = true;
    if (processedUrl) {
      URL.revokeObjectURL(processedUrl);
    }
    setSelectedImage(null);
    setProcessedBlob(null);
    setProcessedUrl(null);
    setIsProcessing(false);
  }, [processedUrl]);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* State 1: Upload View */}
      {!selectedImage && (
        <UploadZone
          onImageSelected={handleImageSelected}
          isProcessing={isProcessing}
        />
      )}

      {/* State 2: Image Added - Ready to Start */}
      {selectedImage && !isProcessing && !processedBlob && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6"
        >
          <Card className="w-full p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm flex flex-col gap-6">
            {/* Header info */}
            <div className="w-full flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="blue" className="py-1 px-3 gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  Image Loaded
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">
                  Ready to remove background
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono bg-muted/30 border-border/80">
                  {selectedImage.width} × {selectedImage.height} px
                </Badge>
                <Badge variant="outline" className="text-xs font-mono bg-muted/30 border-border/80">
                  {formatBytes(selectedImage.sizeBytes)}
                </Badge>
              </div>
            </div>

            {/* Image Preview Box */}
            <div className="relative w-full aspect-square sm:aspect-4/3 rounded-2xl overflow-hidden border border-border/80 bg-zinc-950/20 dark:bg-zinc-950/60 flex items-center justify-center shadow-inner">
              <Image
                src={selectedImage.dataUrl}
                alt="Selected image ready for background removal"
                fill
                unoptimized
                className="object-contain p-2"
              />
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium pointer-events-none">
                Original Image
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="w-full sm:w-auto gap-2 cursor-pointer rounded-2xl text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Choose Another Image</span>
              </Button>

              <Button
                variant="accent"
                size="lg"
                onClick={handleStartProcessing}
                className="w-full sm:w-auto gap-2.5 cursor-pointer rounded-2xl font-semibold shadow-md px-8 min-w-[200px]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Removal</span>
                <ArrowRight className="w-4 h-4 ml-0.5 opacity-70" />
              </Button>
            </div>

            {/* Client-Side Privacy Badge */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>100% Client-Side AI • Your photo never leaves your device</span>
            </div>
          </Card>
        </motion.div>
      )}

      {/* State 3: Active Processing View */}
      {selectedImage && isProcessing && (
        <ProcessingState
          originalImageSrc={selectedImage.dataUrl}
          progress={progress}
          onCancel={handleReset}
          imageDimensions={{
            width: selectedImage.width,
            height: selectedImage.height,
          }}
        />
      )}

      {/* State 4: Completed Result & Studio View */}
      {selectedImage && !isProcessing && processedBlob && processedUrl && (
        <div className="w-full flex flex-col items-center gap-10">
          {/* Top Status Bar with Resolution and privacy info */}
          <div className="w-full max-w-4xl flex flex-col gap-2.5 px-1">
            <div className="w-full flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="py-1 px-3 gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  Done (In-Browser ML)
                </Badge>
                <Badge variant="outline" className="text-xs font-mono bg-muted/30 border-border/80">
                  Output: {selectedImage.width} × {selectedImage.height} px
                </Badge>
              </div>

              <button
                type="button"
                onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium transition-colors cursor-pointer"
                title="Click to inspect client-side privacy guarantee"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>0 Bytes Sent to Server</span>
                {showPrivacyInfo ? (
                  <ChevronUp className="w-3 h-3 ml-0.5 opacity-70" />
                ) : (
                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
                )}
              </button>
            </div>

            {/* Expandable Privacy Architecture Details */}
            <AnimatePresence>
              {showPrivacyInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xs text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-start gap-2">
                      <Cpu className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground block font-semibold">100% Client-Side</strong>
                        <span className="text-muted-foreground leading-relaxed">
                          Inference executes in WebAssembly on your device&apos;s CPU/GPU.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground block font-semibold">Zero Remote Storage</strong>
                        <span className="text-muted-foreground leading-relaxed">
                          No images or metadata are ever transmitted or uploaded anywhere.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <HardDrive className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground block font-semibold">Offline IndexedDB</strong>
                        <span className="text-muted-foreground leading-relaxed">
                          Neural network weights stay stored locally in your browser.
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          {/* Before / After Comparison */}
          <div className="w-full max-w-4xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Precision Edge Comparison
              </h3>
              <span className="text-xs text-muted-foreground">
                Drag divider to inspect cut precision
              </span>
            </div>
            <ImageComparison
              originalSrc={selectedImage.dataUrl}
              processedSrc={processedUrl}
              width={selectedImage.width}
              height={selectedImage.height}
            />
          </div>

          {/* Background Replacement & Export Studio */}
          <div className="w-full max-w-4xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Export & Studio Backdrops
              </h3>
            </div>
            <BackgroundReplacer
              processedBlob={processedBlob}
              processedUrl={processedUrl}
              originalWidth={selectedImage.width}
              originalHeight={selectedImage.height}
              onReset={handleReset}
            />
          </div>
        </div>
      )}
    </div>
  );
}
