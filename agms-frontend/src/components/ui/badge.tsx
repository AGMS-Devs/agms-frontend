import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "destructive" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const colorMap = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold",
        colorMap[variant],
        className
      )}
      {...props}
    />
  );
} 