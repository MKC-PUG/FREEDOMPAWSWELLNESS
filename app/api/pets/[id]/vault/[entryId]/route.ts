import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { deleteVaultEntryForPet } from '@/lib/mypets/vault-server';

type Params = { params: Promise<{ id: string; entryId: string }> };

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  const { id, entryId } = await params;

  try {
    const ok = await deleteVaultEntryForPet(user!.id, id, entryId);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Entry not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/pets vault DELETE]', err);
    return NextResponse.json({ success: false, error: 'Could not delete entry.' }, { status: 500 });
  }
}
