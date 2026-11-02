import { createHash, randomBytes } from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { readLockedStill } from '@/lib/ops/studio-still';
import type { CanvaDraft, CanvaKind } from '@/lib/ops/studio-catalog';

const SETTINGS_KEY = 'canva_connection';
const API = 'https://api.canva.com/rest/v1';
const AUTHORIZE = 'https://www.canva.com/api/oauth/authorize';

export const CANVA_SCOPES = [
  'design:meta:read',
  'design:content:read',
  'design:content:write',
  'brandtemplate:meta:read',
  'brandtemplate:content:read',
  'asset:read',
  'asset:write',
].join(' ');

export const CANVA_KINDS: CanvaKind[] = ['end_card', 'thumbnail', 'one_pager'];

export type CanvaTemplateChoice = Record<CanvaKind, string>;

type StoredConnection = {
  refreshToken: string;
  templates: CanvaTemplateChoice;
};

type TokenCache = { token: string; expiresAt: number };
let tokenCache: TokenCache | null = null;
let stillAssetId: string | null = null;

const EMPTY_TEMPLATES: CanvaTemplateChoice = {
  end_card: '',
  thumbnail: '',
  one_pager: '',
};

export function canvaAppConfigured(): boolean {
  return Boolean(process.env.CANVA_CLIENT_ID?.trim() && process.env.CANVA_CLIENT_SECRET?.trim());
}

export function canvaRedirectUri(origin: string): string {
  const fixed = process.env.CANVA_REDIRECT_URI?.trim();
  if (fixed) return fixed;
  return `${origin.replace(/\/$/, '')}/api/ops/canva/callback`;
}

export function createPkce(): { verifier: string; challenge: string; state: string } {
  const verifier = randomBytes(32).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const state = randomBytes(16).toString('base64url');
  return { verifier, challenge, state };
}

export function authorizeUrl(input: {
  origin: string;
  challenge: string;
  state: string;
}): string {
  const clientId = requiredApp('CANVA_CLIENT_ID');
  const url = new URL(AUTHORIZE);
  url.searchParams.set('code_challenge', input.challenge);
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', canvaRedirectUri(input.origin));
  url.searchParams.set('scope', CANVA_SCOPES);
  url.searchParams.set('state', input.state);
  return url.toString();
}

export function parseCanvaDraft(raw: unknown): CanvaDraft | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Record<string, unknown>;
  if (row.status !== 'ready' && row.status !== 'approved') return null;
  if (row.kind !== 'end_card' && row.kind !== 'thumbnail' && row.kind !== 'one_pager') return null;
  return {
    kind: row.kind,
    status: row.status,
    headline: typeof row.headline === 'string' ? row.headline : '',
    cta: typeof row.cta === 'string' ? row.cta : '',
    module: typeof row.module === 'string' ? row.module : '',
    designUrl: typeof row.designUrl === 'string' ? row.designUrl : null,
    exportUrl: typeof row.exportUrl === 'string' ? row.exportUrl : null,
    requestedAt: typeof row.requestedAt === 'string' ? row.requestedAt : '',
    approvedAt: typeof row.approvedAt === 'string' ? row.approvedAt : null,
  };
}

export async function readCanvaConnection(): Promise<StoredConnection | null> {
  const supabase = await settingsClient();
  const { data, error } = await supabase
    .from('ops_settings')
    .select('value')
    .eq('key', SETTINGS_KEY)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return normalizeStored(data?.value);
}

export async function writeCanvaConnection(next: StoredConnection): Promise<void> {
  const supabase = await settingsClient();
  const { error } = await supabase.from('ops_settings').upsert({
    key: SETTINGS_KEY,
    value: next,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  tokenCache = null;
}

export async function saveCanvaTemplates(templates: CanvaTemplateChoice): Promise<CanvaTemplateChoice> {
  const current = await readCanvaConnection();
  if (!current?.refreshToken) {
    throw new Error('Connect Canva before saving template ids.');
  }
  const cleaned = cleanTemplates(templates);
  await writeCanvaConnection({ refreshToken: current.refreshToken, templates: cleaned });
  return cleaned;
}

export async function exchangeAuthCode(input: {
  code: string;
  verifier: string;
  origin: string;
}): Promise<void> {
  const current = (await readCanvaConnection()) ?? {
    refreshToken: '',
    templates: { ...EMPTY_TEMPLATES },
  };
  const token = await tokenRequest({
    grant_type: 'authorization_code',
    code: input.code,
    code_verifier: input.verifier,
    redirect_uri: canvaRedirectUri(input.origin),
  });
  if (!token.refresh_token) {
    throw new Error('Canva did not return a refresh token. Reconnect and include offline access.');
  }
  await writeCanvaConnection({
    refreshToken: token.refresh_token,
    templates: current.templates,
  });
}

export async function listBrandTemplates(): Promise<{ id: string; title: string }[]> {
  const payload = await canvaJson<{ items?: { id?: string; title?: string }[] }>(
    '/brand-templates?limit=50'
  );
  return (payload.items ?? [])
    .filter((item) => item.id)
    .map((item) => ({ id: item.id as string, title: item.title?.trim() || 'Untitled template' }));
}

export async function fillBrandTemplate(input: {
  kind: CanvaKind;
  jobId: string;
  headline: string;
  cta: string;
  module: string;
  body: string;
}): Promise<Pick<CanvaDraft, 'designUrl' | 'exportUrl'>> {
  const connection = await readCanvaConnection();
  const templateId = connection?.templates[input.kind]?.trim();
  if (!templateId) {
    throw new Error('Choose a brand template for this layout and save it.');
  }
  const dataset = await canvaJson<{ dataset?: Record<string, { type?: string }> }>(
    `/brand-templates/${encodeURIComponent(templateId)}/dataset`
  );
  const fields = dataset.dataset ?? {};
  const names = Object.keys(fields);
  if (names.length === 0) {
    throw new Error(
      'This brand template has no data fields. In Canva, tag HEADLINE, CTA, and MODULE as text. Tag BODY for the one-page sheet. Tag STILL as an image when the layout uses the locked plate.'
    );
  }
  const data: Record<string, { type: string; text?: string; asset_id?: string }> = {};
  const text: Record<string, string> = {
    HEADLINE: input.headline,
    CTA: input.cta,
    MODULE: input.module,
    BODY: input.body,
  };
  for (const [name, spec] of Object.entries(fields)) {
    const key = name.toUpperCase();
    if (spec.type === 'text' && text[key]) data[name] = { type: 'text', text: text[key] };
    if (spec.type === 'image' && key === 'STILL') {
      data[name] = { type: 'image', asset_id: await lockedStillAsset() };
    }
  }
  if (Object.keys(data).length === 0) {
    throw new Error('The template fields are not HEADLINE, CTA, MODULE, BODY, or STILL.');
  }

  const started = await canvaJson<{ job?: { id?: string } }>('/autofills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brand_template_id: templateId, data }),
  });
  const autofill = await pollJob<{
    result?: { design?: { id?: string; url?: string } };
  }>(`/autofills/${started.job?.id}`);
  const design = autofill.result?.design;
  const designId = design?.id || designIdFromUrl(design?.url);
  if (!designId) throw new Error('Canva filled the template but did not return a design id.');

  const format = input.kind === 'one_pager' ? 'pdf' : 'png';
  const exported = await canvaJson<{ job?: { id?: string } }>('/exports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      design_id: designId,
      format: { type: format, export_quality: 'regular' },
    }),
  });
  const done = await pollJob<{ urls?: string[] }>(`/exports/${exported.job?.id}`);
  const temporary = done.urls?.find((url) => url.startsWith('https://'));
  if (!temporary) throw new Error('Canva did not return an export link.');
  const exportUrl = await persistExport(input.jobId, input.kind, temporary, format);
  return { designUrl: design?.url ?? null, exportUrl };
}

async function lockedStillAsset(): Promise<string> {
  const preset = process.env.CANVA_STILL_ASSET_ID?.trim();
  if (preset) return preset;
  if (stillAssetId) return stillAssetId;
  const bytes = readLockedStill();
  const name = Buffer.from('Freedom Paws locked still').toString('base64');
  const started = await canvaJson<{ job?: { id?: string; asset?: { id?: string } } }>('/asset-uploads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Asset-Upload-Metadata': JSON.stringify({ name_base64: name }),
    },
    body: new Uint8Array(bytes),
  });
  const assetId =
    started.job?.asset?.id ||
    (await pollJob<{ asset?: { id?: string } }>(`/asset-uploads/${started.job?.id}`)).asset?.id;
  if (!assetId) throw new Error('Canva did not accept the locked still.');
  stillAssetId = assetId;
  return assetId;
}

async function persistExport(
  jobId: string,
  kind: CanvaKind,
  sourceUrl: string,
  ext: 'png' | 'pdf'
): Promise<string> {
  const admin = createSupabaseAdminClient();
  if (!admin) return sourceUrl;
  const downloaded = await fetch(sourceUrl, { signal: AbortSignal.timeout(20_000) });
  if (!downloaded.ok) return sourceUrl;
  const bytes = new Uint8Array(await downloaded.arrayBuffer());
  const path = `canva/${jobId}/${kind}.${ext}`;
  const { error } = await admin.storage.from('social-videos').upload(path, bytes, {
    contentType: ext === 'pdf' ? 'application/pdf' : 'image/png',
    upsert: true,
  });
  if (error) return sourceUrl;
  return admin.storage.from('social-videos').getPublicUrl(path).data.publicUrl;
}

async function pollJob<T>(path: string): Promise<T> {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const payload = await canvaJson<{ job?: { status?: string; error?: { message?: string } } & T }>(path);
    const status = payload.job?.status;
    if (status === 'success') return payload.job as T;
    if (status === 'failed') {
      throw new Error(payload.job?.error?.message || 'Canva job failed.');
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  throw new Error('Canva is still working. Try this layout again in a moment.');
}

async function canvaJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await accessToken();
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
    signal: AbortSignal.timeout(20_000),
  });
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as T & { message?: string; error?: string }) : ({} as T);
  if (!response.ok) {
    const detail =
      (payload as { message?: string }).message ||
      (payload as { error?: string }).error ||
      text.slice(0, 180);
    throw new Error(`Canva ${response.status}: ${detail}`);
  }
  return payload;
}

async function accessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) return tokenCache.token;
  const connection = await readCanvaConnection();
  if (!connection?.refreshToken) {
    throw new Error('Connect Canva on this page first.');
  }
  const token = await tokenRequest({
    grant_type: 'refresh_token',
    refresh_token: connection.refreshToken,
  });
  if (token.refresh_token && token.refresh_token !== connection.refreshToken) {
    await writeCanvaConnection({ ...connection, refreshToken: token.refresh_token });
  }
  tokenCache = {
    token: token.access_token,
    expiresAt: Date.now() + (token.expires_in ?? 3600) * 1000,
  };
  return token.access_token;
}

async function tokenRequest(fields: Record<string, string>): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}> {
  const id = requiredApp('CANVA_CLIENT_ID');
  const secret = requiredApp('CANVA_CLIENT_SECRET');
  const response = await fetch(`${API}/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(fields),
    signal: AbortSignal.timeout(15_000),
  });
  const payload = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    message?: string;
    error_description?: string;
  };
  if (!response.ok || !payload.access_token) {
    throw new Error(
      payload.error_description || payload.message || 'Canva refused the connection. Connect again.'
    );
  }
  return {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    expires_in: payload.expires_in,
  };
}

function requiredApp(name: 'CANVA_CLIENT_ID' | 'CANVA_CLIENT_SECRET'): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not set. Add it in Vercel, then connect Canva.`);
  }
  return value;
}

function designIdFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  const match = url.match(/\/design\/([^/]+)/);
  return match?.[1] ?? null;
}

function cleanTemplates(input: CanvaTemplateChoice): CanvaTemplateChoice {
  return {
    end_card: cleanTemplateId(input.end_card),
    thumbnail: cleanTemplateId(input.thumbnail),
    one_pager: cleanTemplateId(input.one_pager),
  };
}

function cleanTemplateId(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const fromUrl = trimmed.match(/\/brand-templates\/([^/?#]+)/)?.[1] || designIdFromUrl(trimmed);
  return (fromUrl || trimmed).slice(0, 120);
}

function normalizeStored(raw: unknown): StoredConnection | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as { refreshToken?: unknown; templates?: Partial<CanvaTemplateChoice> };
  if (typeof row.refreshToken !== 'string' || !row.refreshToken) return null;
  return {
    refreshToken: row.refreshToken,
    templates: {
      end_card: typeof row.templates?.end_card === 'string' ? row.templates.end_card : '',
      thumbnail: typeof row.templates?.thumbnail === 'string' ? row.templates.thumbnail : '',
      one_pager: typeof row.templates?.one_pager === 'string' ? row.templates.one_pager : '',
    },
  };
}

async function settingsClient() {
  const admin = createSupabaseAdminClient();
  if (admin) return admin;
  return createSupabaseServerClient();
}
