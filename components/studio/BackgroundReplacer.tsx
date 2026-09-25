"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Copy,
  RotateCcw,
  Upload,
  Palette,
  Check,
  CheckCircle2,
  FileDown,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import {
  BackgroundConfig,
  copyImageBlobToClipboard,
  downloadBlob,
  exportImageBlob,
  formatBytes,
} from "@/lib/image-utils";
import {
  COLOR_PRESETS,
  GRADIENT_PRESETS,
  EXPORT_FORMATS,
  ExportImageFormat,
} from "@/lib/constants";
import { ChangeEvent, useEffect, useRef, useState } from "react";

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
  const [selectedFormat, setSelectedFormat] = useState<ExportImageFormat>("png");
  const [quality, setQuality] = useState<number>(0.92);
  const [jpegBgColor, setJpegBgColor] = useState<string>("#ffffff");
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [downloadSize, setDownloadSize] = useState<number | null>(() => processedBlob.size);
  const [formatSizes, setFormatSizes] = useState<Partial<Record<ExportImageFormat, number>>>(() => ({
    png: processedBlob.size,
  }));
  const [isCalculatingSize, setIsCalculatingSize] = useState(false);
  const [lastExportInfo, setLastExportInfo] = useState<{
    format: string;
    sizeBytes: number;
    filename: string;
  } | null>(null);

  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const activeFormatConfig =
    EXPORT_FORMATS.find((f) => f.id === selectedFormat) || EXPORT_FORMATS[0];

  // Calculate download size for selected format & options
  useEffect(() => {
    let isMounted = true;

    if (selectedFormat === "png" && bgConfig.type === "transparent") {
      const timer = setTimeout(() => {
        if (isMounted) {
          setDownloadSize(processedBlob.size);
          setFormatSizes((prev) => ({ ...prev, png: processedBlob.size }));
        }
      }, 0);
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }

    const timer = setTimeout(async () => {
      if (!isMounted) return;
      setIsCalculatingSize(true);
      try {
        const res = await exportImageBlob(
          processedBlob,
          bgConfig,
          {
            format: selectedFormat,
            quality,
            jpegBackground: jpegBgColor,
          },
          originalWidth,
          originalHeight
        );
        if (isMounted) {
          setDownloadSize(res.sizeBytes);
          setFormatSizes((prev) => ({ ...prev, [selectedFormat]: res.sizeBytes }));
        }
      } catch {
        // ignore size calculation error
      } finally {
        if (isMounted) {
          setIsCalculatingSize(false);
        }
      }
    }, 80);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [processedBlob, bgConfig, selectedFormat, quality, jpegBgColor, originalWidth, originalHeight]);

  // Pre-estimate sizes across all export formats for quick comparison
  useEffect(() => {
    let isMounted = true;

    const computeAll = async () => {
      for (const fmt of EXPORT_FORMATS) {
        if (!isMounted) break;
        if (fmt.id === "png" && bgConfig.type === "transparent") {
          setFormatSizes((prev) => ({ ...prev, png: processedBlob.size }));
          continue;
        }
        try {
          const res = await exportImageBlob(
            processedBlob,
            bgConfig,
            {
              format: fmt.id,
              quality: fmt.id === selectedFormat ? quality : 0.92,
              jpegBackground: jpegBgColor,
            },
            originalWidth,
            originalHeight
          );
          if (isMounted) {
            setFormatSizes((prev) => ({ ...prev, [fmt.id]: res.sizeBytes }));
          }
        } catch {
          // ignore background estimation error
        }
      }
    };

    const timer = setTimeout(computeAll, 200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [processedBlob, bgConfig, jpegBgColor, originalWidth, originalHeight, quality, selectedFormat]);

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

  // Download high-resolution image in selected format
  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const exportResult = await exportImageBlob(
        processedBlob,
        bgConfig,
        {
          format: selectedFormat,
          quality,
          jpegBackground: jpegBgColor,
        },
        originalWidth,
        originalHeight
      );

      downloadBlob(exportResult.blob, exportResult.filename);

      setLastExportInfo({
        format: exportResult.format.toUpperCase(),
        sizeBytes: exportResult.sizeBytes,
        filename: exportResult.filename,
      });

      toast({
        title: `Exported ${exportResult.format.toUpperCase()}`,
        description: `Saved as ${exportResult.filename} (${formatBytes(exportResult.sizeBytes)}).`,
        type: "success",
      });
    } catch (err: unknown) {
      console.error("Export error:", err);
      const errMsg = err instanceof Error ? err.message : "Could not export image.";
      toast({
        title: "Export Error",
        description: errMsg,
        type: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to clipboard (PNG standard)
  const handleCopyClipboard = async () => {
    try {
      let finalBlob = processedBlob;
      if (bgConfig.type !== "transparent") {
        const result = await exportImageBlob(
          processedBlob,
          bgConfig,
          { format: "png" },
          originalWidth,
          originalHeight
        );
        finalBlob = result.blob;
      }
      await copyImageBlobToClipboard(finalBlob);
      setIsCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "Image copied as PNG. Ready to paste in Figma, Slack, or Canva.",
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
      {/* 1. Studio Canvas Preview */}
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
          <div className="absolute top-3 right-3 pointer-events-none flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-zinc-200 border border-white/10 shadow-xs">
              {originalWidth} × {originalHeight} px
            </span>
          </div>

          {/* Format Indicator Badge */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-white border border-blue-400/20 shadow-xs">
              {selectedFormat.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Backdrop Customizer */}
      <Card className="p-4 sm:p-6 rounded-3xl border border-border bg-card shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-semibold text-foreground">
              Studio Backdrop
            </h4>
          </div>
          <span className="text-xs text-muted-foreground capitalize">
            {bgConfig.type === "transparent"
              ? "Transparent Alpha"
              : bgConfig.type === "color"
              ? `Solid Color (${bgConfig.color})`
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

      {/* 3. Multi-Format Export Options */}
      <Card className="p-4 sm:p-6 rounded-3xl border border-border bg-card shadow-xs flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileDown className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-semibold text-foreground">
              Export Format
            </h4>
          </div>
          <span className="text-xs text-muted-foreground">
            Processed 100% locally in your browser
          </span>
        </div>

        {/* Format Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EXPORT_FORMATS.map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
            const formatSize = formatSizes[fmt.id];
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt.id)}
                className={`relative flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 ring-2 ring-blue-500/40 shadow-xs"
                    : "border-border/80 hover:border-zinc-300 dark:hover:border-zinc-700 bg-card hover:bg-muted/30"
                }`}
              >
                <div className="w-full flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-foreground">
                    {fmt.name}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {fmt.badge}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-foreground/80 line-clamp-1">
                  {fmt.tag}
                </span>
                <div className="w-full flex items-center justify-between mt-2 pt-1.5 border-t border-border/40 text-[10px]">
                  <span className="text-muted-foreground font-mono">
                    .{fmt.extension}
                  </span>
                  {formatSize ? (
                    <span
                      className={`font-semibold font-mono ${
                        isSelected
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-foreground/80"
                      }`}
                    >
                      {formatBytes(formatSize)}
                    </span>
                  ) : isCalculatingSize && isSelected ? (
                    <span className="text-muted-foreground animate-pulse">
                      ...
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Format Contextual Options & Download Size */}
        <div className="p-3 rounded-2xl bg-muted/30 border border-border/80 flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-foreground font-medium">
                {activeFormatConfig.description}
              </span>
              <span className="text-muted-foreground/50 hidden sm:inline">•</span>
              <span className="text-muted-foreground hidden sm:inline">
                {activeFormatConfig.idealFor}
              </span>
            </div>

            {/* Live Download Size Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium">
              <span className="text-muted-foreground">Download size:</span>
              <span className="font-semibold font-mono">
                {downloadSize !== null
                  ? formatBytes(downloadSize)
                  : isCalculatingSize
                  ? "Calculating..."
                  : "—"}
              </span>
            </div>
          </div>

          {/* Quality Slider / Presets for WebP, JPEG, AVIF */}
          {selectedFormat !== "png" && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
              <span className="text-xs font-medium text-foreground">
                Compression Quality
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "Standard (80%)", val: 0.8 },
                  { label: "High (92%)", val: 0.92 },
                  { label: "Max (100%)", val: 1.0 },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setQuality(opt.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      quality === opt.val
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Smart JPEG Backdrop Alert */}
          {selectedFormat === "jpeg" && bgConfig.type === "transparent" && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
              <span className="text-[11px] text-muted-foreground">
                JPEG has no alpha channel. Backdrop color:
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "Studio White", color: "#ffffff" },
                  { label: "Studio Dark", color: "#09090b" },
                ].map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => setJpegBgColor(c.color)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all cursor-pointer ${
                      jpegBgColor === c.color
                        ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 4. Main Action Bar */}
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
            title="Copies PNG image to system clipboard"
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
            className="gap-2 cursor-pointer rounded-2xl font-semibold shadow-md min-w-[190px]"
          >
            {isExporting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>
                  Download {selectedFormat.toUpperCase()}
                  {downloadSize ? ` (${formatBytes(downloadSize)})` : ""}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Last export confirmation chip */}
      <AnimatePresence>
        {lastExportInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full flex items-center justify-center pt-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
              <Check className="w-3.5 h-3.5" />
              <span>
                Downloaded <strong>{lastExportInfo.filename}</strong> (
                {formatBytes(lastExportInfo.sizeBytes)})
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
