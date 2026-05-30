export interface AnalysisResponse {
  success: boolean;
  data?: {
    protocol: string;
    primaryProtocol: string;
    secondaryProtocol: string | null;
    finding: string;
    reasoning: string;
    confidence: number;
    recommendations: string[];
    disclaimer: string;
    analyzedAt: string;
  };
  error?: string;
}

export interface ImageQuality {
  isValid: boolean;
  issues: string[];
  score: number;
  suggestions: string[];
}