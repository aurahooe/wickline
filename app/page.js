'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSupabase } from '../lib/supabase';

export default function Home() {
  const [hour, setHour] = useState(null);
  const [note, setNote] = useState(null);
  const [left, setLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const next = new Date(now);
      next.setMinutes(60, 0, 0);
      const ms = next - now;
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setLeft(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const sb = getSupabase();
    (async () => {
      const { data: h } = await sb
        .from('wickline_hours')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      setHour(h);
      if (h?.note_id) {
        const { data: n } = await sb
          .from('wickline_notes')
          .select('*')
          .eq('id', h.note_id)
          .maybeSingle();
        setNote(n);
      }
    })();
  }, []);

  return (
    <div className="px-6 md:px-12 py-16 md:py-24 max-w-3xl">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-sans text-xs tracking-[0.22em] uppercase text-moss"
      >
        this hour · turns in {left}
      </motion.p>

      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8"
      >
        {note ? (
          <>
            {note.title && (
              <h2 className="text-4xl md:text-5xl leading-[1.1] text-balance">{note.title}</h2>
            )}
            <p className="mt-6 text-lg md:text-xl leading-relaxed whitespace-pre-wrap">{note.body}</p>
          </>
        ) : (
          <>
            <h2 className="text-4xl md:text-5xl leading-[1.1]">The press is waiting.</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/80">
              Leave a note at the desk. Mark it public if you want it on the wall.
              Every hour something is held up to the light.
            </p>
          </>
        )}
      </motion.article>

      {hour?.curator_note && (
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pl-5 border-l border-brass/50 text-ink/70 italic"
        >
          {hour.curator_note}
        </motion.blockquote>
      )}
    </div>
  );
}
