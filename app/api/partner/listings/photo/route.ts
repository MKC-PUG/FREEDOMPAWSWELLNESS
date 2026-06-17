import { NextRequest, NextResponse } from 'next/server';
import { requirePartnerStaff } from '@/lib/api/auth';
import { resolveListingShelterId, assertShelterAccess } from '@/lib/partner/listing-auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

function extForMime(mime: string): string {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  return 'jpg';
}

export async function POST(request: NextRequest) {
  const { user, profile, error } = await requirePartnerStaff();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get('photo');
    const shelterId = resolveListingShelterId(
      profile!,
      (formData.get('shelterId') || '').toString()
    );

    if (!shelterId) {
      return NextResponse.json({ success: false, error: 'Shelter is required.' }, { status: 400 });
    }
    if (!assertShelterAccess(profile!, shelterId)) {
      return NextResponse.json({ success: false, error: 'Not authorized for this shelter.' }, { status: 403 });
    }

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ success: false, error: 'Upload a photo file.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Photo must be under 5 MB.' },
        { status: 400 }
      );
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Use JPG, PNG, or WebP.' },
        { status: 400 }
      );
    }

    const ext = extForMime(file.type);
    const objectPath = `${shelterId}/uploads/${user!.id}/${crypto.randomUUID()}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const supabase = await createSupabaseServerClient();
    const { error: uploadError } = await supabase.storage
      .from('adoption-listings')
      .upload(objectPath, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('[api/partner/listings/photo]', uploadError);
      return NextResponse.json({ success: false, error: 'Upload failed.' }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('adoption-listings').getPublicUrl(objectPath);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: objectPath,
    });
  } catch (err) {
    console.error('[api/partner/listings/photo POST]', err);
    return NextResponse.json({ success: false, error: 'Upload failed.' }, { status: 500 });
  }
}
