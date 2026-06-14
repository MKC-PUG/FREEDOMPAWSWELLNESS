'use client';

import { PHOTO_BOOTH_THEMES, type PhotoBoothTheme } from '@/lib/photobooth/themes';

type Props = {
  themeId: string;
  editorActive: boolean;
  onPickTheme: (id: string) => void;
  onSurpriseMe: () => void;
};

export default function PhotoBoothThemeBar({
  themeId,
  editorActive,
  onPickTheme,
  onSurpriseMe,
}: Props) {
  const themeChip = (theme: PhotoBoothTheme) => (
    <button
      key={theme.id}
      type="button"
      onClick={() => onPickTheme(theme.id)}
      className={`shrink-0 snap-start flex items-center gap-2 min-h-[40px] rounded-xl px-3 py-2 text-xs font-bold transition touch-manipulation ${
        themeId === theme.id && editorActive
          ? 'bg-amber-400 text-black ring-2 ring-amber-200'
          : 'bg-[#0F1E38] border border-white/15 text-white'
      }`}
    >
      <span className="text-base leading-none">{theme.emoji}</span>
      <span className="whitespace-nowrap">{theme.name}</span>
    </button>
  );

  return (
    <section className="mb-3">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-sm font-bold text-amber-400 flex-1">
          {editorActive ? 'Background' : 'Step 2 — Pick a background'}
        </p>
        <button
          type="button"
          onClick={onSurpriseMe}
          className="shrink-0 min-h-[36px] rounded-lg border border-amber-400/35 bg-amber-400/10 px-3 text-xs font-bold text-amber-300 touch-manipulation"
        >
          🎲 Surprise Me
        </button>
      </div>
      {!editorActive && (
        <p className="text-[10px] text-white/45 mb-2 leading-relaxed">
          Swipe → tap one · your pet appears below
        </p>
      )}
      <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory photobooth-hscroll">
        {PHOTO_BOOTH_THEMES.map(themeChip)}
      </div>
    </section>
  );
}
