'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      router.push('/admin/symptoms');
      router.refresh();
      return;
    }

    setError(data.error || 'Login failed');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A1428] text-white flex items-center justify-center p-8">
      <form
        onSubmit={(e) => void submit(e)}
        className="w-full max-w-md rounded-3xl border border-[#F5C242]/30 bg-[#1F2A44] p-8"
      >
        <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
        <p className="text-sm text-white/60 mb-6">Symptom lexicon review queue</p>

        <label className="block text-sm text-white/70 mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl bg-[#0A1428] border border-white/20 px-4 py-3 mb-4"
          autoComplete="current-password"
          required
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#F5C242] py-3 font-bold text-black disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
