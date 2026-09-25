
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 group select-none transition-opacity hover:opacity-90",
        className
      )}
    >
      {/* Refined Brand Icon - Vibrant Blue/Cyan Gradient that stays consistent & gorgeous in both light & dark mode */}
      <div className="relative w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 via-blue-500 to-cyan-500 text-white flex items-center justify-center shadow-sm shadow-blue-500/25 transition-transform duration-200 group-hover:scale-105 shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          {/* Outer dashed aperture */}
          <circle cx="9" cy="12" r="5" strokeDasharray="3 2" className="text-white/70" />
          {/* Clean focal cutout */}
          <circle cx="15" cy="12" r="5" />
          {/* Precision laser cut line */}
          <line x1="16" y1="8" x2="8" y2="16" className="text-sky-200" />
        </svg>
      </div>

      {/* Brand Typography using semantic theme tokens (zero light/dark mismatch) */}
      <div className="flex flex-col">
        <span className="font-extrabold text-lg tracking-tight text-foreground leading-none">
          Clear<span className="text-blue-600 dark:text-blue-400">Cut</span>
        </span>
        <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase mt-0.5">
          Studio
        </span>
      </div>
    </Link>
  );
}
