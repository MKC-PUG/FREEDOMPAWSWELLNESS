import { NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { CONSULT_DAYS, createConsultShare } from '@/lib/mypets/consult';
import { getPetForUser } from '@/lib/pets/server';

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  const { id } = await params;
  const pet = await getPetForUser(user!.id, id);
  if (!pet) {
    return NextResponse.json({ success: false, error: 'Pet not found.' }, { status: 404 });
  }

  try {
    const share = await createConsultShare({ userId: user!.id, petId: id });
    return NextResponse.json({
      success: true,
      path: `/consult/${share.token}`,
      expiresAt: share.expiresAt,
      days: CONSULT_DAYS,
    });
  } catch (err) {
    console.error('[api/pets vault consult]', err);
    return NextResponse.json(
      { success: false, error: 'Could not create the veterinarian link. Run the vault SQL in Supabase, then try again.' },
      { status: 500 }
    );
  }
}
