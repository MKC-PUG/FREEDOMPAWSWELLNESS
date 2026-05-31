import BackLink from '@/app/components/BackLink';

export default function MonitorPage() {
  return (
    <div className="min-h-screen bg-[#0A1428] text-white">
      <div className="max-w-4xl mx-auto px-6 py-8 sm:py-16">
        <BackLink />
        <div className="flex items-center gap-4 mb-3">
          <span className="text-5xl">📡</span>
          <h1 className="text-4xl md:text-5xl font-bold">Monitor My Dog</h1>
        </div>
        <p className="text-[#F5C242] text-lg mb-12">Room camera monitoring while you&apos;re away — coming soon.</p>

        <div className="bg-[#1F2A44] rounded-3xl p-10 sm:p-16 text-center">
          <div className="text-8xl mb-8">🛰️</div>
          <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Live room view with off-the-shelf Wi‑Fi cameras — so you can check on your dog while at work or errands.
            We&apos;re building it now.
          </p>
        </div>
      </div>
    </div>
  );
}
