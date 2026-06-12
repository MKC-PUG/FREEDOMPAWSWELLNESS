import BackLink from '@/app/components/BackLink';

export default function EnrollSetupRequired() {
  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/id" label="Back to ID hub" />
        <header className="mt-6 mb-6">
          <h1 className="text-2xl font-bold">Supabase setup required</h1>
          <p className="mt-3 text-sm text-white/70 leading-relaxed">
            Enrollment steps 1–5 need Supabase auth and Postgres. Configure environment
            variables, run the migration, then return here.
          </p>
        </header>
        <ol className="list-decimal pl-5 text-sm text-white/75 space-y-2">
          <li>
            Create a project at{' '}
            <a href="https://supabase.com" className="text-amber-400 underline">
              supabase.com
            </a>
          </li>
          <li>
            Copy URL + anon key (+ service role for match emails) to{' '}
            <code className="text-amber-200">.env.local</code> and Vercel
          </li>
          <li>
            Run SQL migrations <strong>in order</strong>:{' '}
            <code className="text-amber-200">001</code> → <code className="text-amber-200">002</code>{' '}
            → <code className="text-amber-200">003</code> → <code className="text-amber-200">004</code>{' '}
            in <code className="text-amber-200">supabase/migrations/</code>
          </li>
          <li>
            Supabase → Authentication → Providers → enable <strong>Email</strong> (magic link)
          </li>
          <li>
            Check <code className="text-amber-200">/api/id/config-status</code> —{' '}
            <code className="text-amber-200">readyForEnroll: true</code>
          </li>
          <li>Restart <code className="text-amber-200">npm run dev</code> (local) or redeploy (Vercel)</li>
        </ol>
      </div>
    </div>
  );
}
