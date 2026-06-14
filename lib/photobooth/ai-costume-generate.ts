import Replicate from 'replicate';
import { getAiCostume, type AiCostumeId } from './ai-costumes';

const MODEL = 'black-forest-labs/flux-kontext-pro' as const;

export function isAiCostumeConfigured(): boolean {
  return Boolean(process.env.REPLICATE_API_TOKEN?.trim());
}

function outputUrl(output: unknown): string {
  if (typeof output === 'string') return output;
  if (output && typeof output === 'object' && 'url' in output) {
    const maybe = (output as { url?: unknown }).url;
    if (typeof maybe === 'function') return String(maybe.call(output));
    if (typeof maybe === 'string') return maybe;
  }
  if (Array.isArray(output) && typeof output[0] === 'string') return output[0];
  throw new Error('Unexpected AI costume output format');
}

export async function generateAiCostumeImage(
  imageBytes: Buffer,
  mimeType: string,
  costumeId: AiCostumeId
): Promise<Buffer> {
  const token = process.env.REPLICATE_API_TOKEN?.trim();
  if (!token) {
    throw new Error('AI costumes are not configured yet. Add REPLICATE_API_TOKEN to enable Magic Look.');
  }

  const costume = getAiCostume(costumeId);
  if (!costume) throw new Error('Unknown costume');

  const dataUri = `data:${mimeType};base64,${imageBytes.toString('base64')}`;
  const replicate = new Replicate({ auth: token });

  const output = await replicate.run(MODEL, {
    input: {
      prompt: costume.prompt,
      input_image: dataUri,
      aspect_ratio: 'match_input_image',
      output_format: 'png',
      safety_tolerance: 2,
      prompt_upsampling: false,
    },
  });

  const url = outputUrl(output);
  const res = await fetch(url);
  if (!res.ok) throw new Error('AI costume download failed');
  return Buffer.from(await res.arrayBuffer());
}
