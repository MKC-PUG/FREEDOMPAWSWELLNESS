import fs from 'fs';
import path from 'path';
import { LOCKED_STILL_RELATIVE } from '@/lib/ops/studio-catalog';

export function readLockedStill(): Buffer {
  const file = path.join(process.cwd(), LOCKED_STILL_RELATIVE);
  if (!fs.existsSync(file)) {
    throw new Error(`Locked still missing at ${LOCKED_STILL_RELATIVE}.`);
  }
  return fs.readFileSync(file);
}
