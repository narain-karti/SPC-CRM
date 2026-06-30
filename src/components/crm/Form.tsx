"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({ label, error, required, hint, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label className="text-xs font-medium text-foreground">
          {label} {required && <span className="text-rose-500">*</span>}
        </Label>
      )}
      {children}
      {hint && !error && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      {error && <p className="text-[11px] text-rose-500">{error}</p>}
    </div>
  );
}

export const TextInput = forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { invalid?: boolean }>(
  function TextInput({ className, invalid, ...props }, ref) {
    return (
      <ShadcnInput
        ref={ref}
        className={cn(
          "h-10 rounded-xl",
          invalid && "border-rose-400 ring-1 ring-rose-200 focus-visible:ring-rose-200/50",
          className
        )}
        {...props}
      />
    );
  }
);

export const TextArea = forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea"> & { invalid?: boolean }>(
  function TextArea({ className, invalid, ...props }, ref) {
    return (
      <ShadcnTextarea
        ref={ref}
        className={cn(
          "rounded-xl min-h-[80px]",
          invalid && "border-rose-400 ring-1 ring-rose-200 focus-visible:ring-rose-200/50",
          className
        )}
        {...props}
      />
    );
  }
);

interface SelectInputProps {
  value: string;
  onValueChange: (val: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  className?: string;
  invalid?: boolean;
}

export function SelectInput({ value, onValueChange, placeholder, options, className, invalid }: SelectInputProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(
        "h-10 rounded-xl w-full",
        invalid && "border-rose-400 ring-1 ring-rose-200",
        className
      )}>
        <SelectValue placeholder={placeholder || "Select an option..."} />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {options.map(o => (
          <SelectItem key={o.value} value={o.value} className="rounded-lg">{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function Button({
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: "default" | "outline" | "ghost" | "destructive" | "lime" | "purple" | "secondary";
  size?: "sm" | "default" | "lg" | "icon";
}) {
  const variants: Record<string, string> = {
    default: "bg-foreground text-background hover:bg-foreground/90",
    outline: "border border-border bg-background hover:bg-muted",
    ghost: "hover:bg-muted text-foreground",
    destructive: "bg-rose-500 text-white hover:bg-rose-600",
    lime: "bg-gradient-to-br from-[#D6F04C] to-[#A3C128] text-[#0F1117] hover:shadow-[0_8px_24px_-6px_rgba(214,240,76,0.5)]",
    purple: "bg-gradient-to-br from-[#B79AFB] to-[#7C5BD9] text-white hover:shadow-[0_8px_24px_-6px_rgba(183,154,251,0.5)]",
    secondary: "bg-muted text-foreground hover:bg-muted/70",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-xs",
    default: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
