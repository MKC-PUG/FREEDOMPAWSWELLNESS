import { appCtaUrl, type SocialPillarId, type SocialPlatform } from '@/lib/ops/social-pillars';
import { WELLNESS_DISCLAIMER, type StudioTopic } from '@/lib/ops/studio-catalog';
import { atHomeComfort } from '@/lib/ops/studio-research';
import { assertStudioCopy, findBannedPhrase } from '@/lib/ops/studio-compliance';

export type EchoPack = {
  caption: string;
  article: string;
  ads: string[];
};

export function buildEchoPack(input: {
  title: string;
  script: string;
  ctaPath: string;
}): EchoPack {
  const cta = appCtaUrl(input.ctaPath || '/diagnostics');
  const caption = [input.title, '', input.script.trim(), '', WELLNESS_DISCLAIMER, '', cta].join(
    '\n'
  );
  const article = [input.title, '', input.script.trim(), '', WELLNESS_DISCLAIMER].join('\n');
  const line = input.script.trim().split(/(?<=[.!?])\s+/)[0] || input.title;
  const ads = [`${input.title}. ${line}`.slice(0, 120), `${line} ${cta}`.slice(0, 120)];
  assertStudioCopy(caption, 'Caption');
  assertStudioCopy(article, 'Article');
  for (const ad of ads) assertStudioCopy(ad, 'Ad text');
  return { caption, article, ads };
}

type DraftClient = {
  chat: {
    completions: {
      create: (body: unknown) => Promise<{ choices: Array<{ message?: { content?: string | null } }> }>;
    };
  };
};

export async function draftJson(system: string, user: string): Promise<Record<string, unknown> | null> {
  const xai = process.env.XAI_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (!xai && !openaiKey) return null;

  const OpenAI = (await import('openai')).default;
  const attempts: Array<{ apiKey: string; baseURL?: string; model: string }> = [];
  if (xai) {
    attempts.push({
      apiKey: xai,
      baseURL: 'https://api.x.ai/v1',
      model: process.env.XAI_MODEL?.trim() || 'grok-4',
    });
  }
  if (openaiKey) attempts.push({ apiKey: openaiKey, model: 'gpt-4o-mini' });

  for (const attempt of attempts) {
    try {
      const client = new OpenAI({
        apiKey: attempt.apiKey,
        baseURL: attempt.baseURL,
      }) as unknown as DraftClient;
      const completion = await client.chat.completions.create({
        model: attempt.model,
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      });
      const raw = completion.choices[0]?.message?.content ?? '';
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return parsed;
    } catch (error) {
      console.error('[studio] draft failed', attempt.model, error);
    }
  }
  return null;
}

export async function draftFactCard(topic: StudioTopic): Promise<string | null> {
  const parsed = await draftJson(
    'You are FACT, a research clerk for pet-wellness education. Return JSON only: {"factCard": string}. Include a line that starts with "At-home comfort:" and gives one gentle step an owner can try when the dog is otherwise bright. No drugs, no doses, no essential oils, nothing in the ear or eye. Also say to call their own veterinarian if it continues. Never diagnose or promise a cure.',
    `${topic.code} ${topic.title}. Teach: ${topic.teach}. At-home comfort to include: ${atHomeComfort(`${topic.title} ${topic.teach}`)}. Do not say: ${topic.doNotSay}.`
  );
  const card = typeof parsed?.factCard === 'string' ? parsed.factCard.trim() : '';
  if (!card || findBannedPhrase(card)) return null;
  if (/at-home comfort/i.test(card)) return card;
  return `${card}\nAt-home comfort: ${atHomeComfort(`${topic.title} ${topic.teach}`)}`;
}

export async function draftScript(topic: StudioTopic, factCard: string): Promise<string | null> {
  const parsed = await draftJson(
    'You are BUD, SuperBud’s producer. Return JSON only: {"script": string}. 70 to 110 spoken words. Warm, clear, educational. Include the at-home comfort step from the FACT card as something the owner can try when the dog is otherwise bright. No drugs, no doses, no essential oils. End by telling the owner to call their own veterinarian if it continues or the dog seems worse. Never diagnose, prescribe, or promise a reunion.',
    `Topic ${topic.code}: ${topic.teach}. FACT card: ${factCard}. At-home comfort: ${atHomeComfort(`${topic.title} ${factCard}`)}. Forbidden: ${topic.doNotSay}.`
  );
  const script = typeof parsed?.script === 'string' ? parsed.script.trim() : '';
  if (!script || findBannedPhrase(script)) return null;
  return script;
}

export function captionForPlatform(
  platform: SocialPlatform,
  input: { echoCaption: string; echoArticle: string; ctaPath: string }
): string {
  if (platform === 'youtube') {
    const cta = appCtaUrl(input.ctaPath || '/diagnostics');
    const body = input.echoArticle.trim() || input.echoCaption.trim();
    return body.includes(cta) ? body : `${body}\n\n${cta}`;
  }
  return input.echoCaption.trim();
}

export function pillarOrDefault(value: string | null | undefined): SocialPillarId {
  const allowed: SocialPillarId[] = [
    'adoption_tn',
    'freedom_paws_id',
    'diagnostics',
    'mypets_vault',
    'photobooth',
    'wellness',
    'token_shop',
    'mission',
  ];
  if (value && allowed.includes(value as SocialPillarId)) return value as SocialPillarId;
  return 'diagnostics';
}

export function platformOrDefault(value: string | null | undefined): SocialPlatform {
  if (value === 'instagram' || value === 'tiktok' || value === 'youtube' || value === 'facebook') {
    return value;
  }
  return 'instagram';
}
