export default function MonitorPage() {
  return (
    <div className="min-h-screen bg-[#0A1428] text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-5xl">📡</span>
          <h1 className="text-4xl md:text-5xl font-bold">Monitor My Dog</h1>
        </div>
        <p className="text-[#F5C242] text-lg mb-12">Real-time health &amp; location monitoring for every pet.</p>

        <div className="bg-[#1F2A44] rounded-3xl p-16 text-center">
          <div className="text-8xl mb-8">🛰️</div>
          <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Live vitals, activity tracking, and GPS location for your dog — powered by Freedom Paws wearables.
            We&apos;re building it now.
          </p>
        </div>
      </div>
    </div>
  );
}
