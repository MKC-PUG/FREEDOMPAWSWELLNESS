'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import BackLink from '@/app/components/BackLink';
import { monitorPrivacyNote } from '@/lib/monitor/help-content';
import {
  MONITOR_STORAGE_KEY,
  type MonitorCameraConfig,
} from '@/lib/monitor/types';
import { wyzeSetupSteps } from '@/lib/monitor/wyze-setup-steps';

type Tab = 'setup' | 'live';

function loadConfig(): MonitorCameraConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(MONITOR_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MonitorCameraConfig;
  } catch {
    return null;
  }
}

function saveConfig(config: MonitorCameraConfig) {
  localStorage.setItem(MONITOR_STORAGE_KEY, JSON.stringify(config));
}

export default function MonitorClient() {
  const [tab, setTab] = useState<Tab>('setup');
  const [config, setConfig] = useState<MonitorCameraConfig | null>(null);
  const [label, setLabel] = useState('Living room');
  const [streamUrl, setStreamUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const stored = loadConfig();
    if (stored) {
      setConfig(stored);
      setLabel(stored.label);
      setStreamUrl(stored.streamUrl);
    }
  }, []);

  const handleSave = useCallback(() => {
    const trimmed = streamUrl.trim();
    if (!trimmed) return;
    const next: MonitorCameraConfig = {
      label: label.trim() || 'My camera',
      streamUrl: trimmed,
      cameraType: 'wyze',
      updatedAt: Date.now(),
    };
    saveConfig(next);
    setConfig(next);
    setSaved(true);
    setVideoError(false);
    setTimeout(() => setSaved(false), 2500);
  }, [label, streamUrl]);

  const handleClear = useCallback(() => {
    localStorage.removeItem(MONITOR_STORAGE_KEY);
    setConfig(null);
    setStreamUrl('');
    setLabel('Living room');
    setVideoError(false);
  }, []);

  const activeUrl = config?.streamUrl?.trim();
  const isGo2rtcPlayer = !!activeUrl && activeUrl.includes('stream.html');
  const isMjpeg =
    !!activeUrl &&
    (activeUrl.includes('mjpeg') || activeUrl.includes('frame.jpeg'));
  const isTunnelStream = !!activeUrl && activeUrl.startsWith('https://');

  return (
    <div className="min-h-screen bg-[#0A1428] text-white">
      <div className="max-w-4xl mx-auto px-6 py-8 sm:py-12">
        <BackLink />

        <div className="flex items-center gap-4 mb-2">
          <span className="text-5xl" aria-hidden="true">
            📡
          </span>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Monitor My Dog</h1>
            <p className="text-[#F5C242] text-base sm:text-lg mt-1">
              Room camera while you&apos;re away — beta
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-white/55 leading-relaxed max-w-2xl">
          Live view only. No cloud recording. You own the camera — Freedom Paws shows your stream
          when you provide a go2rtc link from your home Mac relay.
        </p>

        <div className="mt-4 rounded-2xl border border-[#F5C242]/40 bg-[#16223C] px-4 py-4 text-sm text-white/75 leading-relaxed">
          {isTunnelStream ? (
            <>
              <p className="font-semibold text-[#F5C242]">Away mode — HTTPS tunnel active</p>
              <p className="mt-2">
                Your saved stream uses <strong className="text-white/90">https://</strong> — the
                installed Freedom Paws app icon works from cellular or work Wi‑Fi. Keep go2rtc +
                tunnel running on your Mac at home.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-[#F5C242]">Home Wi‑Fi — use Safari</p>
              <p className="mt-2">
                Local streams use <code className="text-[#F5C242]">http://</code> — open{' '}
                <code className="text-[#F5C242]">http://YOUR_MAC_IP:3000/monitor</code> in{' '}
                <strong className="text-white/90">Safari</strong>, not the home-screen PWA icon.
              </p>
              <p className="mt-2">
                Away from home? Run <code className="text-[#F5C242]">start-tunnel.sh</code>, save an{' '}
                <strong className="text-white/90">https://</strong> stream.html URL — then the app
                icon works. See <Link href="/monitor/help" className="text-[#F5C242] underline">Help</Link>.
              </p>
            </>
          )}
          <p className="mt-2">
            Stream: go2rtc → wyze → links → <strong className="text-white/90">stream.html</strong>.
            Pan/tilt: Wyze app.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/monitor/help"
            className="min-h-[44px] inline-flex items-center rounded-xl border border-white/20 px-5 text-sm font-semibold text-[#F5C242] touch-manipulation"
          >
            Help &amp; troubleshooting →
          </Link>
        </div>

        <div className="mt-8 flex gap-2">
          {(['setup', 'live'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={
                tab === t
                  ? 'min-h-[48px] flex-1 rounded-xl bg-[#F5C242] text-black text-sm font-bold px-4 py-3 touch-manipulation'
                  : 'min-h-[48px] flex-1 rounded-xl border border-white/20 text-white/80 text-sm font-semibold px-4 py-3 touch-manipulation'
              }
            >
              {t === 'setup' ? 'Camera setup' : 'Live view'}
            </button>
          ))}
        </div>

        {tab === 'setup' && (
          <div className="mt-8 space-y-6">
            {wyzeSetupSteps.map((step) => (
              <section
                key={step.title}
                className="bg-[#1F2A44] rounded-3xl p-6 sm:p-8 border border-white/10"
              >
                <h2 className="text-xl font-bold text-[#F5C242]">{step.title}</h2>
                <ul className="mt-4 space-y-3 text-white/80 leading-relaxed text-sm sm:text-base">
                  {step.body.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-[#F5C242] shrink-0">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="bg-[#16223C] rounded-3xl p-6 sm:p-8 border border-[#F5C242]/30">
              <h2 className="text-xl font-bold">Save your camera</h2>
              <p className="mt-2 text-sm text-white/60">
                Beta: from go2rtc → wyze → links, paste the{' '}
                <strong className="text-white/80">stream.html</strong> URL (best on iPhone).
              </p>

              <label className="block mt-6 text-sm font-semibold text-white/80">
                Room name
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="mt-2 w-full min-h-[48px] rounded-xl bg-[#0A1428] border border-white/15 px-4 text-white text-base"
                  placeholder="Living room"
                />
              </label>

              <label className="block mt-4 text-sm font-semibold text-white/80">
                Stream URL (go2rtc)
                <input
                  type="url"
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  className="mt-2 w-full min-h-[48px] rounded-xl bg-[#0A1428] border border-white/15 px-4 text-white text-base"
                  placeholder="http://192.168.1.51:1984/stream.html?src=wyze"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </label>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!streamUrl.trim()}
                  className="min-h-[52px] flex-1 rounded-xl bg-[#F5C242] text-black font-bold disabled:opacity-40 touch-manipulation"
                >
                  {saved ? 'Saved ✓' : 'Save camera'}
                </button>
                {config && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="min-h-[52px] rounded-xl border border-white/20 text-white/70 font-semibold px-6 touch-manipulation"
                  >
                    Remove
                  </button>
                )}
              </div>
            </section>
          </div>
        )}

        {tab === 'live' && (
          <div className="mt-8">
            {!activeUrl ? (
              <div className="bg-[#1F2A44] rounded-3xl p-10 sm:p-16 text-center border border-white/10">
                <div className="text-6xl mb-6" aria-hidden="true">
                  📷
                </div>
                <h2 className="text-2xl font-bold mb-3">No camera connected</h2>
                <p className="text-white/60 max-w-md mx-auto mb-8">
                  Complete setup and save your HLS stream URL first.
                </p>
                <button
                  type="button"
                  onClick={() => setTab('setup')}
                  className="min-h-[52px] rounded-xl bg-[#F5C242] text-black font-bold px-8 touch-manipulation"
                >
                  Go to setup
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-sm text-white/50">Watching</p>
                    <p className="text-lg font-bold text-[#F5C242]">{config?.label}</p>
                  </div>
                  <span
                    className={
                      videoError
                        ? 'text-sm font-semibold text-red-400'
                        : 'text-sm font-semibold text-green-400'
                    }
                  >
                    {videoError ? '● Offline — check Wi‑Fi & relay' : '● Live'}
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video">
                  {isGo2rtcPlayer ? (
                    <iframe
                      key={activeUrl}
                      src={activeUrl}
                      title={`Live view: ${config?.label ?? 'camera'}`}
                      className="w-full h-full border-0"
                      allow="autoplay; fullscreen"
                      onLoad={() => setVideoError(false)}
                    />
                  ) : isMjpeg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={activeUrl}
                      src={activeUrl}
                      alt={`Live view: ${config?.label ?? 'camera'}`}
                      className="w-full h-full object-contain"
                      onError={() => setVideoError(true)}
                      onLoad={() => setVideoError(false)}
                    />
                  ) : (
                    <video
                      key={activeUrl}
                      src={activeUrl}
                      controls
                      playsInline
                      autoPlay
                      muted
                      className="w-full h-full object-contain"
                      onError={() => setVideoError(true)}
                      onLoadedData={() => setVideoError(false)}
                    />
                  )}
                </div>

                <p className="text-xs text-white/45 leading-relaxed">{monitorPrivacyNote}</p>

                <button
                  type="button"
                  onClick={() => setTab('setup')}
                  className="min-h-[48px] text-sm font-semibold text-[#F5C242] touch-manipulation"
                >
                  Edit camera settings →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
