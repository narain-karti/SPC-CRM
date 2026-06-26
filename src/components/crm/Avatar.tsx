"use client";

import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  color?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  ring?: boolean;
}

const sizeMap = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, color = "#D6F04C", size = "md", className, ring = true }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-[#1a1a1a] uppercase tracking-tight",
        sizeMap[size],
        ring && "ring-2 ring-white/80 dark:ring-white/10",
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
      }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
