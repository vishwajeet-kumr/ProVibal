"use client";

// components/copy-button.tsx — Clipboard copy with visual feedback — warm design system

import { useState, useEffect, useRef } from "react";
import { Copy, Check, X } from "lucide-react";

type CopyState = "idle" | "copied" | "error";

const RESET_DELAY_MS = 2000;

interface CopyButtonProps {
  readonly text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  async function handleCopy() {
    if (state !== "idle") return;
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("error");
    }
    timerRef.current = setTimeout(() => {
      setState("idle");
      timerRef.current = null;
    }, RESET_DELAY_MS);
  }

  const config = {
    idle: {
      icon: <Copy size={13} />,
      label: "Copy",
      className: "border border-[#E2D9CF] text-[#6B6457] hover:bg-[#EDE5DA] hover:text-[#111111]",
    },
    copied: {
      icon: <Check size={13} />,
      label: "Copied!",
      className: "border border-green-200 bg-green-50 text-green-700",
    },
    error: {
      icon: <X size={13} />,
      label: "Failed",
      className: "border border-red-200 bg-red-50 text-red-600",
    },
  } satisfies Record<CopyState, { icon: React.ReactNode; label: string; className: string }>;

  const { icon, label, className } = config[state];

  return (
    <button
      onClick={handleCopy}
      disabled={state !== "idle"}
      aria-label={state === "idle" ? "Copy to clipboard" : label}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-150 ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
