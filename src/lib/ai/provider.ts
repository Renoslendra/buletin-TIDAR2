import type { AiProvider } from "@/lib/ai/types";
import { mockAiProvider } from "@/lib/ai/mock-provider";
import { geminiProvider } from "@/lib/ai/gemini-provider";
import { mimoProvider } from "@/lib/ai/mimo-provider";

export function getAiProvider(): AiProvider {
  const provider = (process.env.AI_PROVIDER ?? "mock").toLowerCase();

  if (provider === "gemini") {
    return geminiProvider;
  }

  if (provider === "mimo" || provider.startsWith("mimo")) {
    return mimoProvider;
  }

  return mockAiProvider;
}
