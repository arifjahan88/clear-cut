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
      {/* Precision Brand Icon - Vibrant Electric Blue/Cyan Gradient Squircle */}
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-blue-500/25 ring-1 ring-white/20 transition-all duration-200 group-hover:scale-105 group-hover:shadow-blue-500/35 shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white drop-shadow-xs"
        >
          {/* Scissor Top Loop */}
          <circle
            cx="6"
            cy="6"
            r="3"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          {/* Scissor Bottom Loop */}
          <circle
            cx="6"
            cy="18"
            r="3"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          {/* Lower Blade cutting to bottom-right */}
          <path
            d="M8.2 8.2L19.5 19.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Upper Blade cutting toward top-right */}
          <path
            d="M8.2 15.8L12.5 11.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M14.5 9.5L19.5 4.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Precision Center Pivot Screw */}
          <circle cx="12.5" cy="11.5" r="1.4" fill="#38bdf8" />
          {/* 4-point AI Magic Sparkle Star */}
          <path
            d="M19.5 1L20.1 2.7L21.8 3.3L20.1 3.9L19.5 5.6L18.9 3.9L17.2 3.3L18.9 2.7L19.5 1Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex items-center gap-2">
        <span className="font-extrabold text-xl tracking-tight text-foreground leading-none">
          Clear<span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">Cut</span>
        </span>
        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 leading-none">
          Studio
        </span>
      </div>
    </Link>
  );
}
