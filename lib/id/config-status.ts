import { isSupabaseConfigured } from '@/lib/supabase/config';
import { isResendConfigured } from '@/lib/email/match-owner-alert';

export type IdConfigStatus = {
  supabaseUrl: boolean;
  supabaseAnonKey: boolean;
  supabaseReady: boolean;
  serviceRoleKey: boolean;
  openaiApiKey: boolean;
  resendApiKey: boolean;
  resendFromEmail: boolean;
  resendReady: boolean;
  fpOpsEmails: boolean;
  fpOpsPreview: string | null;
  appUrl: boolean;
  appUrlValue: string | null;
  readyForEnroll: boolean;
  readyForMatchEmail: boolean;
  missingForEnroll: string[];
  missingForMatchEmail: string[];
  migrationFiles: string[];
  setupNote: string;
};

export function getIdConfigStatus(): IdConfigStatus {
  const supabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const supabaseAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
  const supabaseReady = isSupabaseConfigured();
  const serviceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  const openaiApiKey = Boolean(process.env.OPENAI_API_KEY?.trim());
  const resendApiKey = Boolean(process.env.RESEND_API_KEY?.trim());
  const resendFromEmail = Boolean(process.env.RESEND_FROM_EMAIL?.trim());
  const resendReady = isResendConfigured();
  const fpOpsRaw = process.env.FP_OPS_EMAILS ?? process.env.FP_OPS_EMAIL ?? '';
  const fpOpsList = fpOpsRaw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
  const fpOpsEmails = fpOpsList.length > 0;
  const appUrlValue = process.env.NEXT_PUBLIC_APP_URL?.trim() || null;
  const appUrl = Boolean(appUrlValue);

  const missingForEnroll: string[] = [];
  if (!supabaseUrl) missingForEnroll.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingForEnroll.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  if (!openaiApiKey) missingForEnroll.push('OPENAI_API_KEY');
  if (!appUrl) missingForEnroll.push('NEXT_PUBLIC_APP_URL');

  const missingForMatchEmail: string[] = [];
  if (!resendApiKey) missingForMatchEmail.push('RESEND_API_KEY');
  if (!resendFromEmail) missingForMatchEmail.push('RESEND_FROM_EMAIL');
  if (!serviceRoleKey) {
    missingForMatchEmail.push('SUPABASE_SERVICE_ROLE_KEY (owner email lookup)');
  }

  const readyForEnroll = missingForEnroll.length === 0;
  const readyForMatchEmail = resendReady && serviceRoleKey;

  return {
    supabaseUrl,
    supabaseAnonKey,
    supabaseReady,
    serviceRoleKey,
    openaiApiKey,
    resendApiKey,
    resendFromEmail,
    resendReady,
    fpOpsEmails,
    fpOpsPreview: fpOpsEmails ? fpOpsList.map((e) => e.replace(/(.{2}).+(@.+)/, '$1…$2')).join(', ') : null,
    appUrl,
    appUrlValue,
    readyForEnroll,
    readyForMatchEmail,
    missingForEnroll,
    missingForMatchEmail,
    migrationFiles: [
      'supabase/migrations/001_freedom_paws_id.sql',
      'supabase/migrations/002_pet_embeddings.sql',
      'supabase/migrations/003_found_match.sql',
      'supabase/migrations/004_audit_settings.sql',
      'supabase/migrations/005_intake_mirror_embeddings.sql',
    ],
    setupNote:
      'Run all four SQL migrations in Supabase SQL Editor and enable Email auth (magic link). Env vars alone are not enough.',
  };
}
