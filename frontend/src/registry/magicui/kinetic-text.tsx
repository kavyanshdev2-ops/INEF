"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface KineticTextProps {
  text: string;
  className?: string;
  stiffness?: number;
  damping?: number;
  interactive?: boolean;
  perspective?: number;
  letterSpacing?: string;
  unhoveredOpacity?: number;
  hoveredOpacity?: number;
}

interface LetterData {
  char: string;
  id: string;
  isSpace: boolean;
}

export function KineticText({
  text,
  className,
  stiffness = 300,
  damping = 18,
  interactive = true,
  perspective = 1000,
  letterSpacing = "0.18em",
  unhoveredOpacity = 0.32,
  hoveredOpacity = 1.0,
}: KineticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Split text into characters with unique keys
  const letters: LetterData[] = React.useMemo(() => {
    return text.split("").map((char, index) => ({
      char,
      id: `${char}-${index}`,
      isSpace: char === " ",
    }));
  }, [text]);

  // Handle Mouse Movement
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMousePosition(null);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={interactive ? handleMouseMove : undefined}
      onMouseEnter={interactive ? handleMouseEnter : undefined}
      onMouseLeave={interactive ? handleMouseLeave : undefined}
      style={{ perspective: `${perspective}px` }}
      className={cn(
        "relative inline-flex flex-nowrap whitespace-nowrap items-center justify-center select-none py-4 px-1 sm:px-2 overflow-visible w-auto max-w-full",
        className
      )}
    >
      {letters.map((letter, idx) => {
        if (letter.isSpace) {
          return (
            <span key={letter.id} className="inline-block w-[0.4em]">
              &nbsp;
            </span>
          );
        }

        return (
          <KineticChar
            key={letter.id}
            ref={(el) => {
              letterRefs.current[idx] = el;
            }}
            char={letter.char}
            index={idx}
            totalLetters={letters.length}
            mousePosition={mousePosition}
            isHovered={isHovered}
            stiffness={stiffness}
            damping={damping}
            letterSpacing={idx === letters.length - 1 ? "0" : letterSpacing}
            unhoveredOpacity={unhoveredOpacity}
            hoveredOpacity={hoveredOpacity}
            containerRef={containerRef}
          />
        );
      })}
    </div>
  );
}

interface KineticCharProps {
  char: string;
  index: number;
  totalLetters: number;
  mousePosition: { x: number; y: number } | null;
  isHovered: boolean;
  stiffness: number;
  damping: number;
  letterSpacing?: string;
  unhoveredOpacity: number;
  hoveredOpacity: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const KineticChar = React.forwardRef<HTMLSpanElement, KineticCharProps>(
  (
    {
      char,
      index,
      totalLetters,
      mousePosition,
      isHovered,
      stiffness,
      damping,
      letterSpacing,
      unhoveredOpacity,
      hoveredOpacity,
      containerRef,
    },
    ref
  ) => {
    const charRef = useRef<HTMLSpanElement | null>(null);
    const [charPos, setCharPos] = useState<{ x: number; y: number } | null>(null);

    // Update character relative center position inside container
    useEffect(() => {
      const updatePosition = () => {
        if (charRef.current && containerRef.current) {
          const charRect = charRef.current.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          setCharPos({
            x: charRect.left - containerRect.left + charRect.width / 2,
            y: charRect.top - containerRect.top + charRect.height / 2,
          });
        }
      };

      updatePosition();
      window.addEventListener("resize", updatePosition);
      return () => window.removeEventListener("resize", updatePosition);
    }, [containerRef]);

    // Calculate proximity physics
    let deltaX = 0;
    let deltaY = 0;
    let distance = 9999;
    let intensity = 0;

    if (mousePosition && charPos) {
      deltaX = mousePosition.x - charPos.x;
      deltaY = mousePosition.y - charPos.y;
      distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const radius = 220; // Proximity effect radius in px
      if (distance < radius) {
        intensity = Math.pow(1 - distance / radius, 2); // Non-linear falloff
      }
    }

    // Target transformation values
    const targetY = intensity * -32; // Lift character up to 32px
    const targetScale = 1 + intensity * 0.38; // Scale up to 1.38x
    const targetRotateX = deltaY ? (deltaY / 200) * intensity * -35 : 0;
    const targetRotateY = deltaX ? (deltaX / 200) * intensity * 35 : 0;
    const targetRotateZ = (deltaX / 200) * intensity * 15;

    // Opacity calculation: reduced when not hovered (unhoveredOpacity e.g. 0.35), full/bold when hovered
    const targetOpacity = isHovered
      ? Math.min(hoveredOpacity, 0.6 + intensity * (hoveredOpacity - 0.6 + 0.1))
      : unhoveredOpacity;

    // Ambient floating wave index offset
    const waveDelay = index * 0.15;

    return (
      <motion.span
        ref={(node) => {
          charRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLSpanElement | null>).current = node;
        }}
        animate={{
          y: isHovered ? targetY : [0, -8, 0],
          scale: isHovered ? targetScale : [1, 1.02, 1],
          opacity: targetOpacity,
          rotateX: isHovered ? targetRotateX : 0,
          rotateY: isHovered ? targetRotateY : 0,
          rotateZ: isHovered ? targetRotateZ : 0,
        }}
        transition={
          isHovered
            ? {
                type: "spring",
                stiffness,
                damping,
                mass: 0.6,
                opacity: { duration: 0.2 },
              }
            : {
                y: {
                  duration: 2.8,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: waveDelay,
                },
                scale: {
                  duration: 2.8,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                  delay: waveDelay,
                },
                opacity: { duration: 0.35, ease: "easeOut" },
              }
        }
        className="inline-block transform-gpu origin-center cursor-default transition-colors duration-200"
        style={{
          display: "inline-block",
          willChange: "transform, opacity",
          marginRight: letterSpacing,
        }}
      >
        <span
          className={cn(
            "relative inline-block transition-all duration-300",
            isHovered
              ? "drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_12px_32px_rgba(255,255,255,0.45)] font-black"
              : "drop-shadow-none font-extrabold"
          )}
        >
          {char}
        </span>
      </motion.span>
    );
  }
);

KineticChar.displayName = "KineticChar";

export default KineticText;
