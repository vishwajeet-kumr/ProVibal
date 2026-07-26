"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CheckoutApiResponse {
  status: "success" | "error";
  data?: { checkoutUrl: string };
  error?: string;
}

export function BuyRefillButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleBuyRefill() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType: "refill_pack" }),
      });
      const json = (await response.json()) as CheckoutApiResponse;

      if (json.status === "success" && json.data) {
        window.location.href = json.data.checkoutUrl;
      } else {
        toast.error(json.error ?? "Checkout failed. Please try again.");
      }
    } catch {
      toast.error("Network error. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleBuyRefill}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-light)] disabled:opacity-60"
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Redirecting…
        </>
      ) : (
        "Buy Refill Pack"
      )}
    </button>
  );
}
