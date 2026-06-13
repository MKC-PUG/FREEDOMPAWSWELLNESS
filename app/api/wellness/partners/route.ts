import { NextResponse } from 'next/server';
import {
  getWellnessPartnerConfig,
  toPublicWellnessConfig,
} from '@/lib/wellness/partners';

export async function GET() {
  const config = toPublicWellnessConfig(getWellnessPartnerConfig());
  return NextResponse.json({ success: true, ...config });
}
