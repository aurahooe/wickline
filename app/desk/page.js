'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSupabase } from '../../lib/supabase';

export default function Desk() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [mine, setMine] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const sb = getSupabase();
    sb.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        await sb.from('wickline_profiles').upsert({
          id: data.user.id,
          handle: (data.user.email || 'wanderer').split('@')[0],
          display_name: (data.user.email || 'wanderer').split('@')[0],
        });
        const { data: notes } = await sb
          .from('wickline_notes')
          .select('*')
          .eq('user_id', data.user.id)
          .order('created_at', { ascending: false });
        setMine(notes || []);
      }
    });
  }, []);

  async function save(e) {
    e.preventDefault();
    const sb = getSupabase();
    const { error } = await sb.from('wickline_notes').insert({
      user_id: user.id,
      title: title || null,
      body,
      is_public: isPublic,
    });
    if (error) setMsg(error.message);
    else {
      setMsg('Filed.');
      setTitle('');
      setBody('');
      const { data: notes } = await sb
        .from('wickline_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setMine(notes || []);
    }
  }

  async function togglePublic(n) {
    const sb = getSupabase();
    await sb.from('wickline_notes').update({ is_public: !n.is_public }).eq('id', n.id);
    setMine((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_public: !n.is_public } : x)));
  }

  if (!user) {
    return (
      <div className="px-6 md:px-12 py-20">
        <p className="text-lg">The desk is locked. <a className="underline decoration-brass" href="/login">Sign in</a>.</p>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-14 max-w-2xl">
      <p className="font-sans text-xs tracking-[0.22em] uppercase text-moss">your desk</p>
      <h2 className="text-3xl mt-2">Leave something</h2>
      <form onSubmit={save} className="mt-8 space-y-4">
        <input
          placeholder="title, if it needs one"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent border-b border-ink/30 py-2 outline-none focus:border-rust font-sans"
        />
        <textarea
          required
          rows={6}
          placeholder="the note itself"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full bg-white/20 border border-ink/10 p-3 outline-none focus:border-rust leading-relaxed"
        />
        <label className="flex items-center gap-2 font-sans text-sm">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Mark public — show it on the wall
        </label>
        <button className="text-sm tracking-wide uppercase border border-ink/40 px-5 py-2 hover:bg-ink hover:text-paper transition-colors duration-300 font-sans">
          File it
        </button>
      </form>
      {msg && <p className="mt-3 text-sm text-rust">{msg}</p>}
      <div className="mt-14 space-y-6">
        {mine.map((n) => (
          <motion.article
            key={n.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-t border-ink/10 pt-4"
          >
            {n.title && <h3 className="text-xl">{n.title}</h3>}
            <p className="mt-2 whitespace-pre-wrap leading-relaxed">{n.body}</p>
            <button
              onClick={() => togglePublic(n)}
              className="mt-3 font-sans text-xs uppercase tracking-wider text-moss hover:text-rust"
            >
              {n.is_public ? 'public — hide from wall' : 'private — make public'}
            </button>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
