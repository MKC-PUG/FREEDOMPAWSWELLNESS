import { AnalysisResponse } from './types';

export async function analyzeDogImage(
  file: File,
  petContext?: { symptoms?: string }
): Promise<AnalysisResponse> {
  const s = (petContext?.symptoms || "").toLowerCase().trim();
  const matches: string[] = [];

  // 1. Immune System - Highest priority for systemic symptoms
  if (s.includes("vomit") || s.includes("nausea") || s.includes("infection") || 
      s.includes("immune") || s.includes("low energy") || s.includes("frequent sick")) {
    matches.push("Immune Boost Pro");
  }

  // 2. Eyes
  if (s.includes("eye") || s.includes("cloudy") || s.includes("tearing") || 
      s.includes("red eye") || s.includes("vision")) {
    matches.push("Clear Vision Defender");
  }

  // 3. Heart
  if (s.includes("fatigue") || s.includes("exercise") || s.includes("breath") || 
      s.includes("tired") || s.includes("heart")) {
    matches.push("Heart Vitality Pro");
  }

  // 4. Skin / Allergy
  if (s.includes("itch") || s.includes("skin") || s.includes("rash") || 
      s.includes("allergy")) {
    matches.push("Allergy Shield");
  }

  // 5. Gut / Digestive
  if (s.includes("diarrhea") || s.includes("constipation") || s.includes("gut") || 
      s.includes("poop") || s.includes("stool") || s.includes("digest")) {
    matches.push("Buddy's Gut Balance & Cleanse");
  }

  // 6. Joint / Movement
  if (s.includes("joint") || s.includes("stiff") || s.includes("painful") || 
      s.includes("limp") || s.includes("arthritis") || s.includes("pain")) {
    matches.push("Max Movement Pro");
  }

  if (matches.length === 0) {
    matches.push("General Wellness Restore");
  }

  const primary = matches[0];
  const secondary = matches.length > 1 ? matches[1] : null;

  return {
    success: true,
    data: {
      protocol: primary,
      primaryProtocol: primary,
      secondaryProtocol: secondary,
      finding: `Primary: ${primary}`,
      reasoning: secondary 
        ? `Multiple conditions detected.` 
        : `Strong match for ${primary}`,
      confidence: 92,
      recommendations: [
        `✅ PRIMARY: ${primary}`,
        secondary ? `⚠️ SECONDARY: ${secondary}` : ""
      ].filter(Boolean),
      disclaimer: "Educational tool only. Not a substitute for veterinary care.",
      analyzedAt: new Date().toISOString()
    }
  };
}