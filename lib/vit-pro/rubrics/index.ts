import type { VitProRegion } from '../types';
import eyeRubric from './eye.json';
import skinRubric from './skin.json';
import oralRubric from './oral.json';

export type VitProRubricField = {
  key: string;
  label: string;
  type: string;
  values?: string[];
  description?: string;
};

export type VitProRegionRubric = {
  region: VitProRegion;
  version: string;
  protocolSlug: string;
  captureGuidance: string[];
  findingFields: VitProRubricField[];
  differentialConsiderations: string[];
  suggestedDiagnostics: string[];
  urgentIndicators: string[];
};

const RUBRICS: Record<VitProRegion, VitProRegionRubric> = {
  eye: eyeRubric as VitProRegionRubric,
  skin: skinRubric as VitProRegionRubric,
  oral: oralRubric as VitProRegionRubric,
};

export function getRegionRubric(region: VitProRegion): VitProRegionRubric {
  return RUBRICS[region];
}

export function getAllRubrics(): VitProRegionRubric[] {
  return Object.values(RUBRICS);
}

export function rubricFieldKeys(region: VitProRegion): string[] {
  return getRegionRubric(region).findingFields.map((f) => f.key);
}
