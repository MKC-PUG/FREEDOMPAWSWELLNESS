import { Resend } from 'resend';
import { appOrigin } from '@/lib/site-urls';

function absoluteAppUrl(path: string): string {
  const origin = appOrigin() || 'https://app.freedompawsinc.com';
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${origin.replace(/\/$/, '')}${p}`;
}
import { getOwnerEmailById } from '@/lib/supabase/admin';

export type MatchOwnerAlertInput = {
  ownerId: string;
  petName: string;
  freedomPawsId: string;
  shelterName: string;
  shelterState: string;
  similarityScore: number;
  reportId: string;
};

export type MatchOwnerAlertResult = {
  sent: boolean;
  skippedReason?: string;
  messageId?: string;
};

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function fromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    'Freedom Paws ID <onboarding@resend.dev>'
  );
}

function supportEmail(): string {
  return process.env.FP_SHELTER_SUPPORT_EMAIL?.trim() || 'shelter@freedompawsinc.com';
}

function buildEmailContent(input: MatchOwnerAlertInput) {
  const pct = Math.round(input.similarityScore * 100);
  const appLink = absoluteAppUrl('/id');
  const myPetsLink = absoluteAppUrl('/mypets');
  const support = supportEmail();

  const subject = `Potential match found for ${input.petName} — Freedom Paws ID`;

  const text = `Hello,

A shelter partner in our Freedom Paws ID pilot (${input.shelterName}, ${input.shelterState}) submitted a found-dog intake that was reviewed by staff.

After human review, a potential biometric match was approved for:

  Pet: ${input.petName}
  Freedom Paws ID: ${input.freedomPawsId}
  Match strength (similarity): ${pct}%

This is NOT a confirmed reunion until you verify your dog in person with the shelter. Staff will coordinate next steps through Freedom Paws.

Open the app: ${appLink}
My Pets: ${myPetsLink}

Questions? Email ${support}

— Freedom Paws ID
Educational biometric matching only. Not a government license or veterinary advice.`;

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:520px;color:#0A1625;line-height:1.5">
      <p style="color:#059669;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase">Freedom Paws ID</p>
      <h1 style="font-size:20px;margin:16px 0 8px">Potential match for ${input.petName}</h1>
      <p style="color:#444;font-size:14px">
        A shelter partner (<strong>${input.shelterName}</strong>, ${input.shelterState}) submitted a found-dog intake.
        After <strong>human review</strong>, staff approved a biometric match candidate.
      </p>
      <div style="margin:20px 0;padding:16px;border:1px solid #d1d5db;border-radius:12px;background:#f9fafb">
        <p style="margin:0;font-size:13px;color:#666">Freedom Paws ID</p>
        <p style="margin:4px 0 0;font-size:22px;font-weight:700;font-family:monospace;color:#b45309">${input.freedomPawsId}</p>
        <p style="margin:12px 0 0;font-size:13px">Similarity score: <strong>${pct}%</strong></p>
      </div>
      <p style="font-size:13px;color:#b45309;background:#fffbeb;padding:12px;border-radius:8px">
        <strong>Important:</strong> This is not a confirmed reunion until you verify your dog in person with the shelter.
      </p>
      <p style="margin-top:20px">
        <a href="${appLink}" style="display:inline-block;background:#10b981;color:#000;font-weight:700;padding:12px 20px;border-radius:10px;text-decoration:none">Open Freedom Paws ID</a>
      </p>
      <p style="font-size:12px;color:#888;margin-top:24px">
        Questions? <a href="mailto:${support}">${support}</a><br/>
        Report ref: ${input.reportId.slice(0, 8)}…
      </p>
    </div>
  `;

  return { subject, text, html };
}

/** Send owner email when a match candidate is approved. Never throws — logs on failure. */
export async function sendMatchApprovedOwnerAlert(
  input: MatchOwnerAlertInput
): Promise<MatchOwnerAlertResult> {
  if (!isResendConfigured()) {
    console.warn('[match-owner-alert] RESEND_API_KEY not set — email skipped');
    return { sent: false, skippedReason: 'resend_not_configured' };
  }

  const ownerEmail = await getOwnerEmailById(input.ownerId);
  if (!ownerEmail) {
    console.warn(
      `[match-owner-alert] No owner email for ${input.ownerId} — set SUPABASE_SERVICE_ROLE_KEY`
    );
    return { sent: false, skippedReason: 'owner_email_unavailable' };
  }

  const { subject, text, html } = buildEmailContent(input);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!.trim());
    const { data, error } = await resend.emails.send({
      from: fromAddress(),
      to: ownerEmail,
      subject,
      text,
      html,
      replyTo: supportEmail(),
    });

    if (error) {
      console.error('[match-owner-alert] Resend error:', error);
      return { sent: false, skippedReason: error.message };
    }

    console.info(
      `[match-owner-alert] Sent to owner (${input.freedomPawsId}) messageId=${data?.id ?? 'n/a'}`
    );
    return { sent: true, messageId: data?.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'send_failed';
    console.error('[match-owner-alert]', msg);
    return { sent: false, skippedReason: msg };
  }
}
