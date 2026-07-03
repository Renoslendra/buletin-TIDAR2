import { getAiProvider } from "@/lib/ai/provider";
import { validateScheduleExtraction } from "@/lib/validation/schedule-schema";
import type { ExtractScheduleInput } from "@/lib/ai/types";

export async function extractScheduleFromImage(input: ExtractScheduleInput) {
  const provider = getAiProvider();
  const raw = await provider.extractSchedule(input);

  return {
    provider: provider.name,
    data: validateScheduleExtraction(raw, input.type),
    raw,
  };
}
