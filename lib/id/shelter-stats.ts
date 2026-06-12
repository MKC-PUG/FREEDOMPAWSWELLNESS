import { createSupabaseServerClient } from '@/lib/supabase/server';

export type ShelterDashboardStats = {
  totalReports: number;
  pendingReviews: number;
  matchedReports: number;
  totalEnrollments: number;
  pilotShelters: number;
};

export async function getShelterDashboardStats(): Promise<ShelterDashboardStats> {
  const supabase = await createSupabaseServerClient();

  const [
    { count: totalReports },
    { count: matchedReports },
    { count: totalEnrollments },
    { count: pilotShelters },
  ] = await Promise.all([
    supabase.from('found_dog_reports').select('id', { count: 'exact', head: true }),
    supabase
      .from('found_dog_reports')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'matched'),
    supabase
      .from('biometric_enrollments')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'complete'),
    supabase.from('shelters').select('id', { count: 'exact', head: true }),
  ]);

  const { count: pendingReviews } = await supabase
    .from('match_candidates')
    .select('id', { count: 'exact', head: true })
    .eq('review_status', 'pending');

  return {
    totalReports: totalReports ?? 0,
    pendingReviews: pendingReviews ?? 0,
    matchedReports: matchedReports ?? 0,
    totalEnrollments: totalEnrollments ?? 0,
    pilotShelters: pilotShelters ?? 0,
  };
}
