"use client";

// components/copy-button.tsx — Clipboard copy with visual success/error feedback state

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
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
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
      icon: <Copy size={14} />,
      label: "Copy",
      className: "text-slate-400 hover:text-slate-200 hover:bg-white/10",
    },
    copied: {
      icon: <Check size={14} />,
      label: "Copied!",
      className: "text-emerald-400 bg-emerald-400/10",
    },
    error: {
      icon: <X size={14} />,
      label: "Failed",
      className: "text-red-400 bg-red-400/10",
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
