import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { getPetForUser } from '@/lib/pets/server';
import { createVitRunForPet, listVitRunsForPet } from '@/lib/vit/pet-runs-server';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  const { id } = await params;

  try {
    const pet = await getPetForUser(user!.id, id);
    if (!pet) {
      return NextResponse.json({ success: false, error: 'Pet not found.' }, { status: 404 });
    }

    const runs = await listVitRunsForPet(user!.id, id, pet.name);
    return NextResponse.json({ success: true, runs });
  } catch (err) {
    console.error('[api/pets vit-runs GET]', err);
    return NextResponse.json({ success: false, error: 'Could not load ViT history.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  const { id } = await params;

  try {
    const body = (await request.json()) as {
      primarySlug?: string | null;
      primaryTitle?: string | null;
      primaryConfidence?: number | null;
      secondarySlug?: string | null;
      secondaryTitle?: string | null;
      vetUrgent?: boolean;
      mediaType?: string | null;
      analysisId?: string | null;
    };

    const run = await createVitRunForPet(user!.id, id, body);
    if (!run) {
      return NextResponse.json({ success: false, error: 'Pet not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, run });
  } catch (err) {
    console.error('[api/pets vit-runs POST]', err);
    return NextResponse.json({ success: false, error: 'Could not save ViT run.' }, { status: 500 });
  }
}
