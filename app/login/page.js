'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getSupabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('in');
  const [msg, setMsg] = useState('');

  async function submit(e) {
    e.preventDefault();
    setMsg('');
    const sb = getSupabase();
    if (mode === 'up') {
      const { error } = await sb.auth.signUp({ email, password });
      setMsg(error ? error.message : 'Account made. You can sign in now — check email if confirmation is on.');
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      setMsg(error ? error.message : 'Signed in. Head to the desk.');
      if (!error) window.location.href = '/desk';
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 md:px-12 py-20 max-w-md"
    >
      <p className="font-sans text-xs tracking-[0.22em] uppercase text-moss">
        {mode === 'in' ? 'return' : 'join'}
      </p>
      <h2 className="text-3xl mt-2">{mode === 'in' ? 'Sign in' : 'Make a key'}</h2>
      <form onSubmit={submit} className="mt-8 space-y-4 font-sans">
        <input
          type="email"
          required
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-rust transition-colors"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-rust transition-colors"
        />
        <button className="mt-4 text-sm tracking-wide uppercase border border-ink/40 px-5 py-2 hover:bg-ink hover:text-paper transition-colors duration-300">
          {mode === 'in' ? 'Enter' : 'Create'}
        </button>
      </form>
      {msg && <p className="mt-4 text-sm text-rust">{msg}</p>}
      <button
        onClick={() => setMode(mode === 'in' ? 'up' : 'in')}
        className="mt-8 font-sans text-sm text-ink/60 hover:text-ink"
      >
        {mode === 'in' ? 'Need a key? Create one.' : 'Already have a key? Sign in.'}
      </button>
    </motion.div>
  );
}
