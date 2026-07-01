"use client";

import { useState, useEffect } from "react";

interface TypewriterEffectProps {
  readonly text: string;
  readonly speedMs?: number;
}

export function TypewriterEffect({ text, speedMs = 15 }: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const isComplete = currentIndex >= text.length;

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speedMs);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speedMs]);

  return (
    <span className="font-mono">
      {displayedText}
      {!isComplete && (
        <span className="ml-0.5 inline-block h-3.5 w-2 animate-pulse bg-[#8C6A4A] align-middle dark:bg-[#A38563]" />
      )}
    </span>
  );
}
