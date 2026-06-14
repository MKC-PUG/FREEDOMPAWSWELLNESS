'use client';

import { useState } from 'react';

export default function WaitlistClient() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'waitlist-page' }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Signup failed.');
      }
    } catch {
      setStatus('error');
      setMessage('Connection error — try again.');
    }
  };

  return (
    <form onSubmit={(e) => void submit(e)} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-white/50">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-2xl border border-white/15 bg-[#0A1625] px-4 py-3.5 text-sm text-white placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full min-h-[52px] rounded-2xl bg-[#F5C242] text-black font-bold text-sm hover:bg-amber-300 disabled:opacity-60 transition"
      >
        {status === 'loading' ? 'Joining…' : 'Join founding community'}
      </button>

      {message && (
        <p
          className={`text-center text-sm leading-relaxed ${
            status === 'success' ? 'text-emerald-300' : 'text-red-300'
          }`}
        >
          {message}
        </p>
      )}

      <p className="text-center text-[10px] text-white/35 leading-relaxed">
        No spam — pilot updates, Safe Picks launches, and shelter partnership news only.
      </p>
    </form>
  );
}
