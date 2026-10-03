
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    const clampedValue = Math.min(Math.max(value || 0, 0), 100);

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedValue}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-secondary/80",
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
