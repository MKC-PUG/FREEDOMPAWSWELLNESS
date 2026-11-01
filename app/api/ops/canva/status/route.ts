import { NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { canvaAppConfigured, listBrandTemplates, readCanvaConnection } from '@/lib/ops/canva';

export async function GET() {
  const { error } = await requireFpOps();
  if (error) return error;

  const clientReady = canvaAppConfigured();
  const connection = clientReady ? await readCanvaConnection().catch(() => null) : null;
  let templates: { id: string; title: string }[] = [];
  let listError: string | null = null;
  if (connection) {
    try {
      templates = await listBrandTemplates();
    } catch (e) {
      listError = e instanceof Error ? e.message : 'Canva template list failed';
    }
  }

  return NextResponse.json({
    success: true,
    clientReady,
    connected: Boolean(connection),
    templates,
    saved: connection?.templates ?? { end_card: '', thumbnail: '', one_pager: '' },
    listError,
  });
}
