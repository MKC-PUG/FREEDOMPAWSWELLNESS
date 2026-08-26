import { createSupabaseServerClient } from '@/lib/supabase/server';

export type AuditAction =
  | 'match.candidates.view'
  | 'match.candidate.review'
  | 'match.owner_email.sent'
  | 'enrollment.revoked'
  | 'found.report.submit'
  | 'chip.link'
  | 'chip.scan'
  | 'ops.settings.update'
  | 'ops.marketing.approval'
  | 'ops.social.create'
  | 'ops.social.update'
  | 'ops.social.buffer';

export async function writeAuditLog(
  actorId: string,
  action: AuditAction,
  resourceType: string,
  resourceId: string | null,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('audit_log').insert({
      actor_id: actorId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
    });
    if (error) console.warn('[audit]', action, error.message);
  } catch (err) {
    console.warn('[audit] failed', action, err);
  }
}
