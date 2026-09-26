import { ShieldCheck, Lock } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-muted/20 py-6 text-xs text-muted-foreground transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-sm">
            <Logo />
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              Private, instant, AI background removal for designers, e-commerce stores, and developers. No files ever leave your device.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero Server Uploads</span>
            </div>
          
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-sky-500" />
              <span>IndexedDB Caching</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground/80">
          <p>© {new Date().getFullYear()} ClearCut Studio. Free and open source under GNU AGPLv3.</p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/arifjahan88/clear-cut"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground underline underline-offset-2 transition-colors"
            >
              Source Code (GitHub)
            </a>
            <span>•</span>
            <a
              href="https://github.com/arifjahan88/clear-cut/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground underline underline-offset-2 transition-colors"
            >
              AGPL-3.0 License
            </a>
            <span>•</span>
            <a
              href="https://img.ly/company/contact"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground underline underline-offset-2 transition-colors"
            >
              Commercial License (IMG.LY)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
