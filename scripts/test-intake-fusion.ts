/**
 * Unit checks for intake fusion alignment (no API calls).
 * Usage: npx tsx scripts/test-intake-fusion.ts
 */
import {
  fuseFoundIntakeDescriptors,
  fuseIntakeAlignedDescriptors,
  fuseIntakeMirrorFromEnrollment,
} from '@/lib/id/embeddings';

const sampleRows = [
  {
    region: 'eyes',
    angle: null,
    quality_score: 0.5,
    descriptors: ['dark periocular fur', 'round eye set'],
  },
  {
    region: 'face',
    angle: null,
    quality_score: 0.8,
    descriptors: ['short black muzzle', 'wrinkled face'],
  },
  {
    region: 'body',
    angle: 'front',
    quality_score: 0.75,
    descriptors: ['compact black coat', 'pug build'],
  },
  {
    region: 'posture',
    angle: null,
    quality_score: 0.7,
    descriptors: ['resting on side', 'relaxed posture'],
  },
  {
    region: 'gait',
    angle: null,
    quality_score: 0.8,
    descriptors: ['steady trot'],
  },
];

const mirror = fuseIntakeMirrorFromEnrollment(sampleRows);
const found = fuseFoundIntakeDescriptors({
  regions: {
    eyes: { descriptors: sampleRows[0].descriptors },
    face: { descriptors: sampleRows[1].descriptors },
    body: { descriptors: sampleRows[2].descriptors },
    posture: { descriptors: sampleRows[3].descriptors },
  },
});

console.log('Mirror:', mirror);
console.log('Found:', found);

if (mirror !== found) {
  console.error('\n✗ Mirror and found fusion should match for same descriptors');
  process.exit(1);
}

if (!mirror.includes('eyes:') || !mirror.includes('face:') || !mirror.includes('body:')) {
  console.error('\n✗ Missing expected region labels');
  process.exit(1);
}

const legacyFlat = fuseFoundIntakeDescriptors({
  regions: {
    face: { descriptors: ['short black muzzle'] },
  },
  fusedDescriptorText: 'flat; descriptor; list',
});

if (legacyFlat.startsWith('flat;')) {
  console.error('\n✗ Should prefer structured regions over flat fusedDescriptorText');
  process.exit(1);
}

console.log('\n✓ Intake fusion alignment tests passed');
