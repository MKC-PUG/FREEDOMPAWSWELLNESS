import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { createGaitCloudEntry } from '@/lib/mypets/consult';
import { getPetForUser } from '@/lib/pets/server';

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  const { id } = await params;
  const pet = await getPetForUser(user!.id, id);
  if (!pet) {
    return NextResponse.json({ success: false, error: 'Pet not found.' }, { status: 404 });
  }

  try {
    const body = (await request.json()) as {
      seen?: string;
      fileName?: string;
      contentType?: string;
      clipId?: string;
    };
    if (!body.clipId?.trim() || !body.seen?.trim()) {
      return NextResponse.json({ success: false, error: 'A finding and clip id are required.' }, { status: 400 });
    }
    const prepared = await createGaitCloudEntry({
      userId: user!.id,
      petId: id,
      seen: body.seen,
      fileName: body.fileName || 'gait-video',
      contentType: body.contentType || 'video/mp4',
      clipId: body.clipId,
    });
    return NextResponse.json({ success: true, ...prepared });
  } catch (err) {
    console.error('[api/pets vault gait]', err);
    return NextResponse.json(
      { success: false, error: 'Could not prepare the walking video. Run the vault SQL in Supabase, then try again.' },
      { status: 500 }
    );
  }
}
