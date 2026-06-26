"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  footer?: React.ReactNode;
}

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-7xl",
};

export function Modal({
  open, onOpenChange, title, description, children, size = "md", footer,
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onOpenChange(false);
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className={cn(
              "relative z-10 w-full bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl ring-1 ring-border flex flex-col max-h-[92vh] sm:max-h-[88vh]",
              sizeMap[size]
            )}
          >
            {(title || description) && (
              <div className="flex items-start justify-between gap-3 px-5 sm:px-6 py-4 border-b border-border/60">
                <div className="min-w-0 flex-1">
                  {title && <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>}
                  {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="shrink-0 h-8 w-8 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto scrollbar-premium px-5 sm:px-6 py-5">
              {children}
            </div>
            {footer && (
              <div className="border-t border-border/60 px-5 sm:px-6 py-4 flex items-center justify-end gap-2 bg-muted/30 rounded-b-3xl">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-end gap-2", className)}>{children}</div>;
}
