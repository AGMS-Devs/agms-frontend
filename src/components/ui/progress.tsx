import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
}

export function ProgressBar({ value, className, ...props }: ProgressProps) {
  return (
    <div className={cn("w-full h-3 bg-gray-200 rounded-full", className)} {...props}>
      <div
        className="h-3 rounded-full bg-black transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
} 