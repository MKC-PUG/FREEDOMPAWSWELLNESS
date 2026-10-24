import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  createSocialPost,
  sendSocialPostToBuffer,
  updateSocialPost,
} from '@/lib/ops/social-server';
import {
  getStudioTopic,
  isSocialPlatform,
  platformsForJob,
  STUDIO_SEATS,
  type StudioJob,
  type StudioKeyStatus,
  type StudioKind,
  type StudioSeat,
  type StudioStatus,
  type StudioTopic,
} from '@/lib/ops/studio-catalog';
import { assertStudioCopy } from '@/lib/ops/studio-compliance';
import {
  buildEchoPack,
  captionForPlatform,
  draftFactCard,
  draftScript,
  pillarOrDefault,
} from '@/lib/ops/studio-copy';
import { budPrompt, echoPrompt, factPrompt, generalPrompt } from '@/lib/ops/studio-prompts';
import { atHomeComfort } from '@/lib/ops/studio-research';
import { backgroundById, motionById, shortOnScreenText } from '@/lib/ops/studio-plates';
import {
  pollAvatarRender,
  readLockedStill,
  renderKeysReady,
  scriptForSpeech,
  startAvatarRender,
  synthesizeSuperBud,
} from '@/lib/ops/studio-render';

async function db() {
  const admin = createSupabaseAdminClient();
  if (admin) return admin;
  return createSupabaseServerClient();
}

function mapJob(row: Record<string, unknown>): StudioJob {
  const ads = row.echo_ads;
  return {
    id: row.id as string,
    kind: row.kind as StudioKind,
    seat: row.seat as StudioSeat,
    status: row.status as StudioStatus,
    title: row.title as string,
    catalogCode: (row.catalog_code as string) ?? null,
    pillar: (row.pillar as string) ?? null,
    platform: (row.platform as string) ?? 'instagram',
    ctaPath: (row.cta_path as string) ?? '',
    factCard: (row.fact_card as string) ?? '',
    script: (row.script as string) ?? '',
    doNotSay: (row.do_not_say as string) ?? '',
    echoCaption: (row.echo_caption as string) ?? '',
    echoArticle: (row.echo_article as string) ?? '',
    echoAds: Array.isArray(ads) ? ads.filter((item) => typeof item === 'string') : [],
    prompt: (row.prompt as string) ?? '',
    audioUrl: (row.audio_url as string) ?? null,
    audioAssetId: (row.audio_asset_id as string) ?? null,
    renderedScript: (row.rendered_script as string) ?? null,
    videoUrl: (row.video_url as string) ?? null,
    heygenVideoId: (row.heygen_video_id as string) ?? null,
    socialPostId: (row.social_post_id as string) ?? null,
    socialPostIds: Array.isArray(row.social_post_ids)
      ? row.social_post_ids.filter((item) => typeof item === 'string')
      : [],
    backgroundId: backgroundById((row.background_id as string) || undefined).id,
    motionId: motionById((row.motion_id as string) || undefined).id,
    onScreenText: (row.on_screen_text as string) ?? '',
    errorMessage: (row.error_message as string) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function missingTable(error: { message?: string } | null): boolean {
  const msg = error?.message ?? '';
  return msg.includes('ops_jobs') || msg.includes('schema cache') || msg.includes('does not exist');
}

function explainWriteError(error: { message?: string }): Error {
  const message = error.message ?? 'Save failed';
  if (
    message.includes('background_id') ||
    message.includes('motion_id') ||
    message.includes('on_screen_text')
  ) {
    return new Error(
      'Run supabase/migrations/018_ops_job_storyboard.sql in the Supabase SQL Editor, then try again.'
    );
  }
  return error instanceof Error ? error : new Error(message);
}

async function updateJob(id: string, patch: Record<string, unknown>): Promise<StudioJob> {
  const supabase = await db();
  const { data, error } = await supabase
    .from('ops_jobs')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw explainWriteError(error);
  return mapJob(data as Record<string, unknown>);
}

function storyboardRow(input: {
  title: string;
  script?: string;
  onScreenText?: string;
  backgroundId?: string;
  motionId?: string;
}): Record<string, string> {
  return {
    script: input.script?.trim() || '',
    on_screen_text: (input.onScreenText?.trim() || shortOnScreenText(input.title)).slice(0, 80),
    background_id: backgroundById(input.backgroundId).id,
    motion_id: motionById(input.motionId).id,
  };
}

export function getStudioKeyStatus(): StudioKeyStatus {
  const keys = renderKeysReady();
  return {
    ...keys,
    draftModel: Boolean(process.env.XAI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim()),
  };
}

export async function listStudioJobs(limit = 40): Promise<StudioJob[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from('ops_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    if (missingTable(error)) {
      throw new Error('ops_jobs table missing. Run supabase/migrations/016_ops_studio_jobs.sql.');
    }
    throw error;
  }
  return (data ?? [])
    .filter((row) => (row as { seat?: string }).seat !== 'forge')
    .map((row) => mapJob(row as Record<string, unknown>));
}

export async function countWaitingOnFounder(): Promise<number> {
  try {
    const supabase = await db();
    const { count, error } = await supabase
      .from('ops_jobs')
      .select('id', { count: 'exact', head: true })
      .in('status', ['research', 'script', 'watch']);
    let total = !error && count ? count : 0;
    const social = await supabase
      .from('social_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'needs_approval');
    if (!social.error && social.count) total += social.count;
    return total;
  } catch {
    return 0;
  }
}

async function getJob(id: string): Promise<StudioJob> {
  const supabase = await db();
  const { data, error } = await supabase.from('ops_jobs').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Job not found');
  return mapJob(data as Record<string, unknown>);
}

function topicFor(job: StudioJob): StudioTopic {
  const topic = job.catalogCode ? getStudioTopic(job.catalogCode) : undefined;
  if (topic) return topic;
  return {
    code: job.catalogCode || 'CUSTOM',
    title: job.title,
    teach: job.factCard || job.title,
    doNotSay: job.doNotSay || 'Diagnosis, reunion rates, and shop links.',
    ctaPath: job.ctaPath || '/diagnostics',
    pillar: pillarOrDefault(job.pillar),
    costume: 'Locked host plate',
  };
}

export async function createVideoJob(input: {
  catalogCode: string;
  platform: string;
  userId: string;
  script?: string;
  onScreenText?: string;
  backgroundId?: string;
  motionId?: string;
}): Promise<StudioJob> {
  const topic = getStudioTopic(input.catalogCode);
  if (!topic) throw new Error('Unknown catalog code');
  if (input.platform !== 'all' && !isSocialPlatform(input.platform)) {
    throw new Error('Unknown platform');
  }
  if (input.script?.trim()) assertStudioCopy(input.script, 'Script');
  if (input.onScreenText?.trim()) assertStudioCopy(input.onScreenText, 'On-screen text');

  const drafted = await draftFactCard(topic);
  const factCard =
    drafted ||
    `Allowed: ${topic.teach}\nAt-home comfort: ${atHomeComfort(`${topic.title} ${topic.teach}`)}\nForbidden: ${topic.doNotSay}\nAdd a public source before you accept this card.`;
  const prompt = factPrompt(topic);
  const supabase = await db();
  const { data, error } = await supabase
    .from('ops_jobs')
    .insert({
      kind: 'superbud_video',
      seat: 'fact',
      status: 'research',
      title: `${topic.code} · ${topic.title}`,
      catalog_code: topic.code,
      pillar: topic.pillar,
      platform: input.platform,
      cta_path: topic.ctaPath,
      fact_card: factCard,
      do_not_say: topic.doNotSay,
      prompt,
      created_by: input.userId,
      ...storyboardRow({
        title: topic.title,
        script: input.script,
        onScreenText: input.onScreenText,
        backgroundId: input.backgroundId,
        motionId: input.motionId,
      }),
    })
    .select('*')
    .single();
  if (error) {
    if (missingTable(error)) {
      throw new Error('ops_jobs table missing. Run supabase/migrations/016_ops_studio_jobs.sql.');
    }
    throw explainWriteError(error);
  }
  return mapJob(data as Record<string, unknown>);
}

export async function createSourcedVideoJob(input: {
  title: string;
  factCard: string;
  doNotSay?: string;
  platform: string;
  userId: string;
  script?: string;
  onScreenText?: string;
  backgroundId?: string;
  motionId?: string;
}): Promise<StudioJob> {
  const title = input.title.trim();
  const factCard = /at-home comfort/i.test(input.factCard)
    ? input.factCard.trim()
    : `${input.factCard.trim()}\nAt-home comfort: ${atHomeComfort(input.title)}`;
  if (title.length < 3) throw new Error('Add a title before queueing.');
  if (factCard.length < 40) throw new Error('The research card is too short to queue.');
  if (input.platform !== 'all' && !isSocialPlatform(input.platform)) {
    throw new Error('Unknown platform');
  }
  assertStudioCopy(factCard, 'Research card');
  if (input.script?.trim()) assertStudioCopy(input.script, 'Script');
  if (input.onScreenText?.trim()) assertStudioCopy(input.onScreenText, 'On-screen text');
  const doNotSay =
    input.doNotSay?.trim() ||
    'Naming a condition as the answer, a treatment promise, a dose, or a reunion promise.';
  const topic = {
    code: 'CUSTOM',
    title,
    teach: factCard,
    doNotSay,
    ctaPath: '/diagnostics',
    pillar: 'diagnostics' as const,
    costume: 'Locked host plate',
  };
  const supabase = await db();
  const { data, error } = await supabase
    .from('ops_jobs')
    .insert({
      kind: 'superbud_video',
      seat: 'fact',
      status: 'research',
      title,
      catalog_code: 'CUSTOM',
      pillar: 'diagnostics',
      platform: input.platform,
      cta_path: '/diagnostics',
      fact_card: factCard,
      do_not_say: doNotSay,
      prompt: factPrompt(topic),
      created_by: input.userId,
      ...storyboardRow({
        title,
        script: input.script,
        onScreenText: input.onScreenText,
        backgroundId: input.backgroundId,
        motionId: input.motionId,
      }),
    })
    .select('*')
    .single();
  if (error) {
    if (missingTable(error)) {
      throw new Error('ops_jobs table missing. Run supabase/migrations/016_ops_studio_jobs.sql.');
    }
    throw explainWriteError(error);
  }
  return mapJob(data as Record<string, unknown>);
}

export async function createGeneralJob(input: {
  seat: string;
  title: string;
  brief: string;
  userId: string;
}): Promise<StudioJob> {
  const seat = STUDIO_SEATS.find((item) => item.id === input.seat)?.id;
  if (!seat) throw new Error('Unknown seat');
  const title = input.title.trim();
  if (!title) throw new Error('Title is required');
  const brief = input.brief.trim();
  const supabase = await db();
  const { data, error } = await supabase
    .from('ops_jobs')
    .insert({
      kind: 'general',
      seat,
      status: 'research',
      title,
      fact_card: brief,
      prompt: generalPrompt(seat, title, brief),
      created_by: input.userId,
    })
    .select('*')
    .single();
  if (error) {
    if (missingTable(error)) {
      throw new Error('ops_jobs table missing. Run supabase/migrations/016_ops_studio_jobs.sql.');
    }
    throw error;
  }
  return mapJob(data as Record<string, unknown>);
}

export async function saveStudioJob(
  id: string,
  patch: {
    factCard?: string;
    script?: string;
    echoCaption?: string;
    echoArticle?: string;
    onScreenText?: string;
    backgroundId?: string;
    motionId?: string;
  }
): Promise<StudioJob> {
  const row: Record<string, unknown> = {};
  if (patch.factCard !== undefined) row.fact_card = patch.factCard;
  if (patch.script !== undefined) row.script = patch.script;
  if (patch.echoCaption !== undefined) row.echo_caption = patch.echoCaption;
  if (patch.echoArticle !== undefined) row.echo_article = patch.echoArticle;
  if (patch.onScreenText !== undefined) row.on_screen_text = patch.onScreenText.trim().slice(0, 80);
  if (patch.backgroundId !== undefined) row.background_id = backgroundById(patch.backgroundId).id;
  if (patch.motionId !== undefined) row.motion_id = motionById(patch.motionId).id;
  return updateJob(id, row);
}

export async function acceptResearch(id: string): Promise<StudioJob> {
  const job = await getJob(id);
  if (job.kind !== 'superbud_video') {
    return updateJob(id, { status: 'script', seat: job.seat, error_message: null });
  }
  if (job.factCard.trim().length < 40) {
    throw new Error('Add the source card before you accept the research.');
  }
  assertStudioCopy(job.factCard, 'Research card');
  const topic = topicFor(job);
  const drafted = await draftScript(topic, job.factCard);
  const script = job.script.trim() || drafted || '';
  return updateJob(id, {
    status: 'script',
    seat: 'bud',
    script,
    prompt: budPrompt(topic, job.factCard),
    error_message: null,
  });
}

async function attachEcho(job: StudioJob, script: string): Promise<Record<string, unknown>> {
  const pack = buildEchoPack({
    title: job.title,
    script,
    ctaPath: job.ctaPath,
  });
  const topic = topicFor(job);
  return {
    echo_caption: pack.caption,
    echo_article: pack.article,
    echo_ads: pack.ads,
    prompt: echoPrompt(topic, script),
  };
}

export async function approveScript(id: string): Promise<StudioJob> {
  const job = await getJob(id);
  if (job.kind !== 'superbud_video') throw new Error('Script approval is for SuperBud videos.');
  const script = job.script.trim();
  if (script.length < 40) throw new Error('Write the spoken script before you approve it.');
  assertStudioCopy(script, 'Script');
  const spoken = scriptForSpeech(script);
  assertStudioCopy(spoken, 'Script');
  const echo = await attachEcho(job, spoken);

  const keys = renderKeysReady();
  if (!keys.elevenlabs || !keys.heygen) {
    const missing = [
      keys.elevenlabs ? null : 'ELEVENLABS_API_KEY',
      keys.heygen ? null : 'HEYGEN_API_KEY',
    ].filter(Boolean);
    return updateJob(id, {
      ...echo,
      script: spoken,
      status: 'watch',
      seat: 'echo',
      error_message: `Social pack is ready. Video render waits on ${missing.join(' and ')}.`,
    });
  }

  try {
    readLockedStill();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Locked still missing';
    return updateJob(id, {
      ...echo,
      script: spoken,
      status: 'watch',
      seat: 'echo',
      error_message: message,
    });
  }

  const audio = await synthesizeSuperBud(spoken);
  if (job.onScreenText.trim()) assertStudioCopy(job.onScreenText, 'On-screen text');
  const render = await startAvatarRender({
    title: job.title,
    audio,
    backgroundId: job.backgroundId,
    motionId: job.motionId,
    onScreenText: job.onScreenText,
  });
  return updateJob(id, {
    ...echo,
    script: spoken,
    status: 'rendering',
    seat: 'bud',
    audio_url: render.audioUrl,
    audio_asset_id: render.audioAssetId,
    rendered_script: spoken,
    heygen_video_id: render.heygenVideoId,
    video_url: null,
    error_message: null,
  });
}

export async function pollStudioRender(id: string): Promise<StudioJob> {
  const job = await getJob(id);
  if (!job.heygenVideoId) throw new Error('This job has no HeyGen render yet.');
  const result = await pollAvatarRender(job.heygenVideoId);
  if (result.status === 'completed' && result.videoUrl) {
    const echo = job.echoCaption ? {} : await attachEcho(job, job.script);
    return updateJob(id, {
      ...echo,
      status: 'watch',
      seat: 'echo',
      video_url: result.videoUrl,
      error_message: null,
    });
  }
  if (result.status === 'failed') {
    return updateJob(id, {
      status: 'script',
      seat: 'bud',
      error_message: result.failure || 'HeyGen render failed. Approve the script to try again.',
    });
  }
  return updateJob(id, { error_message: null });
}

export async function queueSocialPost(id: string, userId: string): Promise<StudioJob> {
  const job = await getJob(id);
  if (job.kind !== 'superbud_video') throw new Error('Social queue is for SuperBud videos.');
  if (job.status !== 'watch' && job.status !== 'queued') {
    throw new Error('Watch the cut and accept it before it can enter the social queue.');
  }
  const caption = job.echoCaption.trim();
  const script = job.script.trim();
  if (!caption || !script) throw new Error('The social pack is empty.');
  assertStudioCopy(caption, 'Caption');
  assertStudioCopy(script, 'Script');
  assertStudioCopy(job.echoArticle, 'Article');

  const destinations = platformsForJob(job.platform);
  let postIds = job.socialPostIds.length
    ? job.socialPostIds
    : job.socialPostId
      ? [job.socialPostId]
      : [];

  if (postIds.length === 0) {
    const created: string[] = [];
    for (const platform of destinations) {
      const text = captionForPlatform(platform, job);
      assertStudioCopy(text, `${platform} caption`);
      const post = await createSocialPost({
        pillar: pillarOrDefault(job.pillar),
        platform,
        userId,
        title: job.title,
        caption: text,
      });
      await updateSocialPost(post.id, {
        script,
        status: 'approved',
        approvedBy: userId,
        approvedAt: new Date().toISOString(),
        errorMessage: null,
      });
      created.push(post.id);
    }
    postIds = created;
  }

  for (const postId of postIds) {
    await sendSocialPostToBuffer(postId);
  }

  try {
    return await updateJob(id, {
      social_post_id: postIds[0] ?? null,
      social_post_ids: postIds,
      status: 'queued',
      seat: 'echo',
      error_message: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('social_post_ids')) {
      throw new Error(
        'Run supabase/migrations/017_ops_job_all_platforms.sql in the Supabase SQL Editor, then queue again.'
      );
    }
    throw error;
  }
}

export async function setStudioStatus(id: string, status: 'hold' | 'done'): Promise<StudioJob> {
  return updateJob(id, { status, error_message: null });
}
