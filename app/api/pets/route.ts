import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { createPetForUser, listPetsForUser } from '@/lib/pets/server';

export async function GET() {
  const { user, error } = await requireApiUser();
  if (error) return error;

  try {
    const pets = await listPetsForUser(user!.id);
    return NextResponse.json({ success: true, pets, source: 'server' });
  } catch (err) {
    console.error('[api/pets GET]', err);
    return NextResponse.json({ success: false, error: 'Could not load pets.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireApiUser();
  if (error) return error;

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

    const pet = await createPetForUser(user!.id, {
      name: body.name,
      breed: body.breed ?? '',
      age: body.age ?? '',
      notes: body.notes ?? '',
      photoThumb: body.photoThumb ?? null,
    });

    return NextResponse.json({ success: true, pet });
  } catch (err) {
    console.error('[api/pets POST]', err);
    return NextResponse.json({ success: false, error: 'Could not create pet.' }, { status: 500 });
  }
}
