import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export type PublicPetCard = {
  freedomPawsId: string;
  petName: string;
  breed: string;
  enrolledAt: string;
};

export async function getPublicPetCard(slug: string): Promise<PublicPetCard | null> {
  if (!isSupabaseConfigured() || !slug.trim()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('get_pet_card', { p_slug: slug.trim() });

  if (error) {
    console.error('[getPublicPetCard]', error.message);
    return null;
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;

  return {
    freedomPawsId: row.freedom_paws_id as string,
    petName: row.pet_name as string,
    breed: (row.breed as string) || '',
    enrolledAt: row.enrolled_at as string,
  };
}
