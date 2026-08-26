import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import {
  DEFAULT_PRODUCTION_CHECKLIST,
  appCtaUrl,
  getPillar,
  type SocialPillarId,
  type SocialPlatform,
  type SocialPostStatus,
} from '@/lib/ops/social-pillars';

export type StoryboardFrame = {
  beat: number;
  visual: string;
  voiceover: string;
  onScreenText?: string;
};

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type SocialPost = {
  id: string;
  pillar: SocialPillarId;
  platform: SocialPlatform;
  status: SocialPostStatus;
  title: string;
  caption: string;
  ctaUrl: string;
  hashtags: string[];
  script: string | null;
  storyboard: StoryboardFrame[];
  productionChecklist: ChecklistItem[];
  bufferPayload: Record<string, unknown> | null;
  bufferSentAt: string | null;
  scheduledFor: string | null;
  postedAt: string | null;
  errorMessage: string | null;
  createdBy: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SocialDashboardStats = {
  total: number;
  draft: number;
  needsApproval: number;
  approved: number;
  scheduled: number;
  posted: number;
  failed: number;
};

function mapRow(row: Record<string, unknown>): SocialPost {
  return {
    id: row.id as string,
    pillar: row.pillar as SocialPillarId,
    platform: row.platform as SocialPlatform,
    status: row.status as SocialPostStatus,
    title: row.title as string,
    caption: (row.caption as string) ?? '',
    ctaUrl: (row.cta_url as string) ?? '',
    hashtags: (row.hashtags as string[]) ?? [],
    script: (row.script as string) ?? null,
    storyboard: (row.storyboard as StoryboardFrame[]) ?? [],
    productionChecklist: (row.production_checklist as ChecklistItem[]) ?? [],
    bufferPayload: (row.buffer_payload as Record<string, unknown>) ?? null,
    bufferSentAt: (row.buffer_sent_at as string) ?? null,
    scheduledFor: (row.scheduled_for as string) ?? null,
    postedAt: (row.posted_at as string) ?? null,
    errorMessage: (row.error_message as string) ?? null,
    createdBy: (row.created_by as string) ?? null,
    approvedBy: (row.approved_by as string) ?? null,
    approvedAt: (row.approved_at as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

async function client() {
  const admin = createSupabaseAdminClient();
  if (admin) return admin;
  return createSupabaseServerClient();
}

export function buildTemplatePackage(pillarId: SocialPillarId, platform: SocialPlatform) {
  const pillar = getPillar(pillarId);
  const hook = pillar.hookIdeas[0] ?? pillar.description;
  const cta = appCtaUrl(pillar.ctaPath);
  const hashtags = [
    '#FreedomPaws',
    '#SuperBud',
    '#DogWellness',
    '#HonorBuddy',
    pillarId === 'adoption_tn' ? '#AdoptTN' : '#PetParents',
  ];

  const script = [
    `HOOK (0–3s): ${hook}`,
    ``,
    `BODY (3–20s): SuperBud (in costume) explains ${pillar.label} in plain language.`,
    `Show the app screen for ${pillar.ctaPath}. Keep wellness-first tone.`,
    `Never claim veterinary diagnosis or guaranteed cure.`,
    ``,
    `CTA (last 5s): “Open Freedom Paws → ${cta}”`,
    `End card: SuperBud shield + Freedom Paws Wellness.`,
  ].join('\n');

  const storyboard: StoryboardFrame[] = [
    {
      beat: 1,
      visual: 'SuperBud hero still (chest emblem visible), energetic open.',
      voiceover: hook,
      onScreenText: 'Freedom Paws × SuperBud',
    },
    {
      beat: 2,
      visual: `App UI mock / screen recording of ${pillar.ctaPath}.`,
      voiceover: pillar.description,
      onScreenText: pillar.label,
    },
    {
      beat: 3,
      visual: 'Real dog + SuperBud end card with CTA URL.',
      voiceover: `Tap the link — start at ${pillar.ctaPath}`,
      onScreenText: cta.replace('https://', ''),
    },
  ];

  const caption = [
    hook,
    '',
    pillar.description,
    '',
    `👉 ${cta}`,
    '',
    hashtags.join(' '),
  ].join('\n');

  return {
    title: `SuperBud · ${pillar.label} · ${platform}`,
    caption,
    ctaUrl: cta,
    hashtags,
    script,
    storyboard,
    productionChecklist: DEFAULT_PRODUCTION_CHECKLIST.map((c) => ({ ...c, done: false })),
  };
}

export async function listSocialPosts(limit = 40): Promise<SocialPost[]> {
  const supabase = await client();
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((r) => mapRow(r as Record<string, unknown>));
}

export async function getSocialDashboardStats(): Promise<SocialDashboardStats> {
  const posts = await listSocialPosts(200);
  const count = (s: SocialPostStatus) => posts.filter((p) => p.status === s).length;
  return {
    total: posts.length,
    draft: count('draft') + count('needs_approval'),
    needsApproval: count('needs_approval'),
    approved: count('approved'),
    scheduled: count('scheduled'),
    posted: count('posted'),
    failed: count('failed'),
  };
}

export async function createSocialPost(input: {
  pillar: SocialPillarId;
  platform: SocialPlatform;
  userId: string;
  title?: string;
  caption?: string;
}): Promise<SocialPost> {
  const pack = buildTemplatePackage(input.pillar, input.platform);
  const supabase = await client();
  const { data, error } = await supabase
    .from('social_posts')
    .insert({
      pillar: input.pillar,
      platform: input.platform,
      status: 'draft',
      title: input.title?.trim() || pack.title,
      caption: input.caption?.trim() || pack.caption,
      cta_url: pack.ctaUrl,
      hashtags: pack.hashtags,
      script: pack.script,
      storyboard: pack.storyboard,
      production_checklist: pack.productionChecklist,
      created_by: input.userId,
      updated_at: new Date().toISOString(),
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapRow(data as Record<string, unknown>);
}

export async function updateSocialPost(
  id: string,
  patch: Partial<{
    status: SocialPostStatus;
    title: string;
    caption: string;
    script: string;
    storyboard: StoryboardFrame[];
    productionChecklist: ChecklistItem[];
    scheduledFor: string | null;
    approvedBy: string | null;
    approvedAt: string | null;
    bufferPayload: Record<string, unknown> | null;
    bufferSentAt: string | null;
    postedAt: string | null;
    errorMessage: string | null;
  }>
): Promise<SocialPost> {
  const supabase = await client();
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.caption !== undefined) row.caption = patch.caption;
  if (patch.script !== undefined) row.script = patch.script;
  if (patch.storyboard !== undefined) row.storyboard = patch.storyboard;
  if (patch.productionChecklist !== undefined) row.production_checklist = patch.productionChecklist;
  if (patch.scheduledFor !== undefined) row.scheduled_for = patch.scheduledFor;
  if (patch.approvedBy !== undefined) row.approved_by = patch.approvedBy;
  if (patch.approvedAt !== undefined) row.approved_at = patch.approvedAt;
  if (patch.bufferPayload !== undefined) row.buffer_payload = patch.bufferPayload;
  if (patch.bufferSentAt !== undefined) row.buffer_sent_at = patch.bufferSentAt;
  if (patch.postedAt !== undefined) row.posted_at = patch.postedAt;
  if (patch.errorMessage !== undefined) row.error_message = patch.errorMessage;

  const { data, error } = await supabase
    .from('social_posts')
    .update(row)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return mapRow(data as Record<string, unknown>);
}

export async function getSocialPost(id: string): Promise<SocialPost | null> {
  const supabase = await client();
  const { data, error } = await supabase.from('social_posts').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapRow(data as Record<string, unknown>);
}

/** Optional OpenAI polish; falls back to template package. */
export async function generateSocialDraft(input: {
  pillar: SocialPillarId;
  platform: SocialPlatform;
  userId: string;
}): Promise<SocialPost> {
  const pack = buildTemplatePackage(input.pillar, input.platform);
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (apiKey) {
    try {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey });
      const pillar = getPillar(input.pillar);
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content:
              'You write short-form social captions for Freedom Paws Wellness. Mascot: SuperBud (patriotic pug superhero). Tone: warm, mission-driven, wellness-first. Never claim veterinary diagnosis or cures. Return JSON only: { "title": string, "caption": string, "script": string }',
          },
          {
            role: 'user',
            content: JSON.stringify({
              pillar: pillar.label,
              description: pillar.description,
              platform: input.platform,
              cta: pack.ctaUrl,
              hooks: pillar.hookIdeas,
            }),
          },
        ],
        response_format: { type: 'json_object' },
      });
      const raw = completion.choices[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(raw) as { title?: string; caption?: string; script?: string };
      return createSocialPost({
        pillar: input.pillar,
        platform: input.platform,
        userId: input.userId,
        title: parsed.title || pack.title,
        caption: parsed.caption || pack.caption,
      }).then(async (post) => {
        if (parsed.script) {
          return updateSocialPost(post.id, { script: parsed.script });
        }
        return post;
      });
    } catch (err) {
      console.error('[social] OpenAI generate failed; using template', err);
    }
  }

  return createSocialPost({
    pillar: input.pillar,
    platform: input.platform,
    userId: input.userId,
  });
}

export async function sendSocialPostToBuffer(postId: string): Promise<SocialPost> {
  const post = await getSocialPost(postId);
  if (!post) throw new Error('Post not found');
  if (post.status !== 'approved' && post.status !== 'scheduled') {
    throw new Error('Approve the post before sending to Buffer.');
  }

  const webhook =
    process.env.BUFFER_WEBHOOK_URL?.trim() ||
    process.env.N8N_SOCIAL_BUFFER_WEBHOOK_URL?.trim() ||
    null;

  const payload = {
    source: 'freedom-paws-ops',
    postId: post.id,
    platform: post.platform,
    title: post.title,
    caption: post.caption,
    ctaUrl: post.ctaUrl,
    hashtags: post.hashtags,
    pillar: post.pillar,
    mascot: 'SuperBud',
  };

  if (!webhook) {
    return updateSocialPost(postId, {
      status: 'scheduled',
      bufferPayload: { ...payload, mode: 'dry_run', note: 'Set BUFFER_WEBHOOK_URL to push live.' },
      bufferSentAt: new Date().toISOString(),
      scheduledFor: post.scheduledFor ?? new Date().toISOString(),
      errorMessage: null,
    });
  }

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(12_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return updateSocialPost(postId, {
      status: 'failed',
      errorMessage: `Buffer webhook ${res.status}: ${text.slice(0, 200)}`,
      bufferPayload: payload,
    });
  }

  return updateSocialPost(postId, {
    status: 'scheduled',
    bufferPayload: payload,
    bufferSentAt: new Date().toISOString(),
    scheduledFor: post.scheduledFor ?? new Date().toISOString(),
    errorMessage: null,
  });
}
