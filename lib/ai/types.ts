// lib/ai/types.ts
// Freedom Paws Wellness – AI Diagnostics Structured Output Schema
// Version: May 19, 2026

export interface ProtocolRecommendation {
  protocol: 
    | "Allergy Shield – Skin & Coat Glow"
    | "Buddy's Gut Balance & Cleanse"
    | "Max Movement Pro"
    | "Foundation Liver & Kidney Detox"
    | "Heart Strong"
    | "Clear Vision Defender"
    | "Freedom Calm"
    | "Infra-Red Spine & Joint"
    | "Fresh Smile"
    | "Patriot Immune Defender"
    | "Uncertain";

  finding: string;
  reasoning: string;
  confidence: number;
  recommendations: string[];
  uncertaintyFlags: string[];
  disclaimer: string;
  analyzedAt: string;
  visualSigns?: string[];
}

export interface AnalysisRequest {
  image: File;
  petName?: string;
  age?: string;
  breed?: string;
  knownConditions?: string[];
}

export interface AnalysisResponse {
  success: boolean;
  data?: ProtocolRecommendation;
  error?: string;
  message?: string;
}

export const VALID_PROTOCOLS = [
  "Allergy Shield – Skin & Coat Glow",
  "Buddy's Gut Balance & Cleanse",
  "Max Movement Pro",
  "Foundation Liver & Kidney Detox",
  "Heart Strong",
  "Clear Vision Defender",
  "Freedom Calm",
  "Infra-Red Spine & Joint",
  "Fresh Smile",
  "Patriot Immune Defender",
] as const;

export type ValidProtocol = typeof VALID_PROTOCOLS[number];

export interface ImageQuality {
  isValid: boolean;
  issues: string[];
  score: number;
  suggestions: string[];
}