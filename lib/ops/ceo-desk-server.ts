import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  emptyCeoDesk,
  isCeoCardState,
  mergeCeoDesk,
  type CeoCardView,
  type CeoDeskSaved,
} from '@/lib/ops/ceo-desk';

const CEO_KEY = 'ceo_inbox';
const MAX_DRAFT = 8000;
const MAX_NOTE = 4000;

function asSaved(raw: unknown): CeoDeskSaved {
  if (!raw || typeof raw !== 'object') return emptyCeoDesk();
  const cards = (raw as { cards?: unknown }).cards;
  if (!cards || typeof cards !== 'object') return emptyCeoDesk();
  return { cards: cards as CeoDeskSaved['cards'] };
}

export async function getCeoDesk(pendingReviews: number): Promise<CeoCardView[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('ops_settings')
      .select('value')
      .eq('key', CEO_KEY)
      .maybeSingle();
    if (error) {
      console.warn('[ops] ceo inbox read:', error.message);
      return mergeCeoDesk(null, pendingReviews);
    }
    return mergeCeoDesk(asSaved(data?.value), pendingReviews);
  } catch {
    return mergeCeoDesk(null, pendingReviews);
  }
}

export async function saveCeoCard(
  actorId: string,
  pendingReviews: number,
  patch: { id: string; state?: unknown; note?: unknown; draft?: unknown }
): Promise<CeoCardView[]> {
  const known = mergeCeoDesk(null, pendingReviews).some((card) => card.id === patch.id);
  if (!known) throw new Error('Unknown desk card.');

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('ops_settings')
    .select('value')
    .eq('key', CEO_KEY)
    .maybeSingle();
  if (error) throw new Error(error.message);

  const saved = asSaved(data?.value);
  const current = saved.cards[patch.id] ?? {};
  const nextCard: { state?: CeoCardView['state']; note?: string; draft?: string } = { ...current };

  if (patch.state !== undefined) {
    if (!isCeoCardState(patch.state)) throw new Error('Unknown card state.');
    const seed = mergeCeoDesk(null, pendingReviews).find((card) => card.id === patch.id);
    if (patch.state === 'ready' && !seed?.readyLabel) {
      throw new Error(seed?.blockedReason ?? 'This card cannot be marked ready.');
    }
    nextCard.state = patch.state;
  }
  if (typeof patch.note === 'string') nextCard.note = patch.note.slice(0, MAX_NOTE);
  if (typeof patch.draft === 'string') nextCard.draft = patch.draft.slice(0, MAX_DRAFT);

  const next: CeoDeskSaved = {
    cards: { ...saved.cards, [patch.id]: nextCard },
  };

  const { error: writeError } = await supabase.from('ops_settings').upsert(
    {
      key: CEO_KEY,
      value: next,
      updated_at: new Date().toISOString(),
      updated_by: actorId,
    },
    { onConflict: 'key' }
  );
  if (writeError) throw new Error(writeError.message);
  return mergeCeoDesk(next, pendingReviews);
}
