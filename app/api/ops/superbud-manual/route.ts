import { readFile } from 'node:fs/promises';
import { NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { SUPERBUD_PAGE_MANUAL_PDF } from '@/lib/ops/manual-source';

export async function GET() {
  const { error } = await requireFpOps();
  if (error) return error;

  try {
    const pdf = await readFile(SUPERBUD_PAGE_MANUAL_PDF);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename="Freedom-Paws-SuperBud-Page-Click-by-Click-Manual.pdf"',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'SuperBud page manual PDF is not on this server yet.' },
      { status: 404 }
    );
  }
}
