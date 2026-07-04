/** Instant shell during Next.js route transitions — matches app chrome. */
export default function AppRouteLoading() {
  return (
    <div
      className="min-h-[50vh] flex flex-col items-center justify-center px-6 py-16"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div
        className="h-10 w-10 rounded-full border-2 border-[#F5C242]/30 border-t-[#F5C242] animate-spin"
        aria-hidden
      />
      <p className="mt-4 text-sm text-white/50 tracking-wide">Loading…</p>
    </div>
  );
}
