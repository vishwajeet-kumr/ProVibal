// app/generate/page.tsx — Server component: metadata + client wrapper

import type { Metadata } from "next";
import { GenerateClient } from "./generate-client";

export const metadata: Metadata = {
  title: "Generate Prompt Kit",
  description:
    "Describe your project and get a complete AI prompt kit instantly — foundation prompt, file map, and ordered build sequence.",
};

export default function GeneratePage() {
  return <GenerateClient />;
}
