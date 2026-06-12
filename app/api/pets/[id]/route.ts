import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { deletePetForUser, updatePetForUser } from '@/lib/pets/server';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  const { id } = await params;

  try {
    const body = (await request.json()) as {
      name?: string;
      breed?: string;
      age?: string;
      notes?: string;
      photoThumb?: string | null;
    };

    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: 'Pet name is required.' }, { status: 400 });
    }

    const pet = await updatePetForUser(user!.id, id, {
      name: body.name,
      breed: body.breed ?? '',
      age: body.age ?? '',
      notes: body.notes ?? '',
      photoThumb: body.photoThumb ?? null,
    });

    if (!pet) {
      return NextResponse.json({ success: false, error: 'Pet not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, pet });
  } catch (err) {
    console.error('[api/pets PATCH]', err);
    return NextResponse.json({ success: false, error: 'Could not update pet.' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  const { id } = await params;

  try {
    const ok = await deletePetForUser(user!.id, id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Pet not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/pets DELETE]', err);
    return NextResponse.json({ success: false, error: 'Could not delete pet.' }, { status: 500 });
  }
}
