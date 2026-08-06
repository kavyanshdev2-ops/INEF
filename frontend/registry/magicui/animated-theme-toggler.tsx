"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnimatedThemeTogglerProps {
  isDark?: boolean;
  isDarkMode?: boolean;
  onToggle?: () => void;
  onToggleDarkMode?: () => void;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function AnimatedThemeToggler({
  isDark: propIsDark,
  isDarkMode: propIsDarkMode,
  onToggle,
  onToggleDarkMode,
  className,
  showLabel = false,
  size = "md",
}: AnimatedThemeTogglerProps) {
  const controlledIsDark = propIsDark ?? propIsDarkMode;
  const handleToggleProp = onToggle ?? onToggleDarkMode;

  const [internalIsDark, setInternalIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });

  const isDark = controlledIsDark !== undefined ? controlledIsDark : internalIsDark;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isDocumentDark = document.documentElement.classList.contains("dark");
    if (isDocumentDark !== isDark && controlledIsDark === undefined) {
      setInternalIsDark(isDocumentDark);
    }
  }, [controlledIsDark, isDark]);

  const toggleTheme = useCallback(
    (event?: React.MouseEvent<HTMLButtonElement>) => {
      const nextIsDark = !isDark;

      const rect = buttonRef.current?.getBoundingClientRect();
      const x = event ? event.clientX : rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const y = event ? event.clientY : rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      if (
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        const transition = (document as any).startViewTransition(() => {
          if (handleToggleProp) {
            handleToggleProp();
          } else {
            if (nextIsDark) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
            setInternalIsDark(nextIsDark);
          }
        });

        transition.ready.then(() => {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ];
          document.documentElement.animate(
            {
              clipPath: nextIsDark ? clipPath : [...clipPath].reverse(),
            },
            {
              duration: 500,
              easing: "ease-in-out",
              pseudoElement: nextIsDark
                ? "::view-transition-new(root)"
                : "::view-transition-old(root)",
            }
          );
        });
      } else {
        if (handleToggleProp) {
          handleToggleProp();
        } else {
          if (nextIsDark) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          setInternalIsDark(nextIsDark);
        }
      }
    },
    [isDark, handleToggleProp]
  );

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  }[size];

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size];

  return (
    <motion.button
      ref={buttonRef}
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className={cn(
        "relative flex items-center justify-center rounded-xl p-2 font-mono transition-colors focus:outline-none cursor-pointer select-none overflow-hidden border backdrop-blur-md shadow-md",
        isDark
          ? "bg-zinc-900/90 text-amber-300 border-zinc-700/80 hover:border-amber-400/50 hover:bg-zinc-800/90 shadow-amber-500/10"
          : "bg-amber-50/90 text-amber-600 border-amber-200/80 hover:border-amber-400/80 hover:bg-amber-100/90 shadow-amber-500/10",
        sizeClasses,
        className
      )}
      aria-label="Toggle dark and light theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <motion.div
        animate={{
          scale: isDark ? [1, 1.2, 1] : [1, 1.15, 1],
          opacity: isDark ? [0.15, 0.3, 0.15] : [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute inset-0 rounded-xl pointer-events-none filter blur-sm",
          isDark ? "bg-amber-400" : "bg-amber-500"
        )}
      />

      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
            }}
            className="relative flex items-center justify-center z-10"
          >
            <Moon className={cn(iconSizes, "fill-amber-300/20 stroke-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.5)]")} />
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-1 -right-1 text-amber-200 pointer-events-none"
            >
              <Sparkles className="w-2.5 h-2.5" />
            </motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
            }}
            className="relative flex items-center justify-center z-10"
          >
            <Sun className={cn(iconSizes, "fill-amber-500/20 stroke-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]")} />
          </motion.div>
        )}
      </AnimatePresence>

      {showLabel && (
        <span className="ml-2 text-xs font-bold font-mono tracking-wider uppercase">
          {isDark ? "DARK" : "LIGHT"}
        </span>
      )}
    </motion.button>
  );
}

export default AnimatedThemeToggler;
