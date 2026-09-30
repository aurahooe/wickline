'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSupabase } from '../../lib/supabase';

export default function Wall() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const sb = getSupabase();
    sb.from('wickline_notes')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setNotes(data || []));
  }, []);

  return (
    <div className="px-6 md:px-12 py-14">
      <p className="font-sans text-xs tracking-[0.22em] uppercase text-moss">public wall</p>
      <h2 className="text-3xl mt-2">What people left in the open</h2>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {notes.map((n, i) => (
          <motion.article
            key={n.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.5 }}
            className="p-6 bg-white/30 border border-ink/10 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-500"
          >
            {n.title && <h3 className="text-xl mb-2">{n.title}</h3>}
            <p className="leading-relaxed whitespace-pre-wrap text-ink/85">{n.body}</p>
            <p className="mt-4 font-sans text-[11px] tracking-wider uppercase text-ink/40">
              {new Date(n.created_at).toLocaleString()}
            </p>
          </motion.article>
        ))}
        {!notes.length && (
          <p className="text-ink/60">The wall is still blank. Be the first to pin something public.</p>
        )}
      </div>
    </div>
  );
}
