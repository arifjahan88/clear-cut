"use client";

import * as React from "react";
import { useToast } from "@/components/ui/toast";
import { UploadZone } from "@/components/studio/UploadZone";
import { ProcessingState, ProcessingProgress } from "@/components/studio/ProcessingState";
import { ImageComparison } from "@/components/studio/ImageComparison";
import { BackgroundReplacer } from "@/components/studio/BackgroundReplacer";
import { OptimizedImageResult, formatBytes } from "@/lib/image-utils";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShieldCheck } from "lucide-react";

export function BackgroundRemover() {
  const [selectedImage, setSelectedImage] = React.useState<OptimizedImageResult | null>(null);
  const [processedBlob, setProcessedBlob] = React.useState<Blob | null>(null);
  const [processedUrl, setProcessedUrl] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [progress, setProgress] = React.useState<ProcessingProgress>({
    stage: "init",
    percentage: 0,
    message: "Initializing engine...",
  });
  const abortControllerRef = React.useRef<boolean>(false);
  const { toast } = useToast();

  const handleImageSelected = React.useCallback(
    async (optimizedResult: OptimizedImageResult) => {
      setSelectedImage(optimizedResult);
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

        const resultBlob: Blob = await removeBackgroundFn(optimizedResult.blob, config);

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
    },
    [toast]
  );

  const handleReset = React.useCallback(() => {
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

      {/* State 2: Active Processing View */}
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

      {/* State 3: Completed Result & Studio View */}
      {selectedImage && !isProcessing && processedBlob && processedUrl && (
        <div className="w-full flex flex-col items-center gap-10">
          {/* Top Status Bar with Resolution and privacy info */}
          <div className="w-full max-w-4xl flex items-center justify-between flex-wrap gap-2 px-1">
            <div className="flex items-center gap-2">
              <Badge variant="success" className="py-1 px-3 gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Done (In-Browser ML)
              </Badge>
              <Badge variant="outline" className="text-xs font-mono bg-muted/30 border-border/80">
                Output: {selectedImage.width} × {selectedImage.height} px
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[11px] text-muted-foreground gap-1 bg-muted/20 border-border/80">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                0 Bytes Sent to Server
              </Badge>
            </div>
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
