import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { getPetForUser } from '@/lib/pets/server';
import {
  countVaultEntriesForPet,
  createVaultEntryForPet,
  listVaultEntriesForPet,
} from '@/lib/mypets/vault-server';
import type { VaultEntryKind } from '@/lib/mypets/vault-types';

type Params = { params: Promise<{ id: string }> };

const KINDS: VaultEntryKind[] = ['vet_record', 'vaccination', 'daily_note'];

export async function GET(request: NextRequest, { params }: Params) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  const { id } = await params;
  const kind = request.nextUrl.searchParams.get('kind') as VaultEntryKind | null;
  const countOnly = request.nextUrl.searchParams.get('count') === '1';

  if (kind && !KINDS.includes(kind)) {
    return NextResponse.json({ success: false, error: 'Invalid vault kind.' }, { status: 400 });
  }

  try {
    const pet = await getPetForUser(user!.id, id);
    if (!pet) {
      return NextResponse.json({ success: false, error: 'Pet not found.' }, { status: 404 });
    }

    if (countOnly) {
      const count = await countVaultEntriesForPet(user!.id, id);
      return NextResponse.json({ success: true, count });
    }

    const entries = await listVaultEntriesForPet(user!.id, id, kind ?? undefined);
    return NextResponse.json({ success: true, entries });
  } catch (err) {
    console.error('[api/pets vault GET]', err);
    return NextResponse.json({ success: false, error: 'Could not load vault.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  const { id } = await params;

  try {
    const body = (await request.json()) as {
      kind?: VaultEntryKind;
      title?: string;
      body?: string;
      recordDate?: string | null;
      attachmentThumb?: string | null;
      attachmentName?: string | null;
    };

    if (!body.kind || !KINDS.includes(body.kind)) {
      return NextResponse.json({ success: false, error: 'Valid vault kind required.' }, { status: 400 });
    }
    if (!body.title?.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required.' }, { status: 400 });
    }

    const entry = await createVaultEntryForPet(user!.id, id, {
      kind: body.kind,
      title: body.title,
      body: body.body,
      recordDate: body.recordDate,
      attachmentThumb: body.attachmentThumb,
      attachmentName: body.attachmentName,
    });

    if (!entry) {
      return NextResponse.json({ success: false, error: 'Pet not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, entry });
  } catch (err) {
    console.error('[api/pets vault POST]', err);
    return NextResponse.json({ success: false, error: 'Could not save vault entry.' }, { status: 500 });
  }
}
