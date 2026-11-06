import OpenAI from 'openai';
import { matchNotGoodList, type HazardHit, type LabelCategory } from '@/lib/wellness/not-good-list';

export type LabelReadResult = {
  transcript: string;
  unreadable: boolean;
  hits: HazardHit[];
  source: 'photo' | 'pasted-text';
};

const READ_PROMPT =
  'You transcribe package text. Return JSON only: {"transcript": string, "unreadable": boolean}. Copy ingredient and material words you can actually read. unreadable is true when you cannot read an ingredient or material panel. Do not judge safety. Do not add ingredients that are not printed. Do not name diseases.';

export async function transcriptFromImage(file: File): Promise<{ transcript: string; unreadable: boolean }> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('Label photo reading needs OPENAI_API_KEY. Paste the ingredient panel instead.');
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = file.type || 'image/jpeg';
  const dataUrl = `data:${mime};base64,${buffer.toString('base64')}`;
  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: READ_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Transcribe this package.' },
          { type: 'image_url', image_url: { url: dataUrl, detail: 'high' } },
        ],
      },
    ],
  });
  const raw = completion.choices[0]?.message?.content ?? '{}';
  const parsed = JSON.parse(raw) as { transcript?: string; unreadable?: boolean };
  const transcript = typeof parsed.transcript === 'string' ? parsed.transcript.trim() : '';
  const unreadable = Boolean(parsed.unreadable) || transcript.length < 3;
  return { transcript, unreadable };
}

export function resultFromText(
  transcript: string,
  category: LabelCategory,
  source: LabelReadResult['source'],
  unreadable = false
): LabelReadResult {
  return {
    transcript,
    unreadable,
    hits: unreadable ? [] : matchNotGoodList(transcript, category),
    source,
  };
}
