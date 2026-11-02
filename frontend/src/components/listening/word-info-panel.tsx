// frontend/src/components/listening/word-info-panel.tsx
// Сонгосон үгийн дэлгэрэнгүй: дуудлага (speaker), орчуулга, үгсийн аймаг, хэлбэрүүд, дүрэм, жишээ, холбоо үг.
'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Loader2, Volume2 } from 'lucide-react';
import { fetchWordInfo, type WordInfo } from '@/lib/listening-services';
import { speakWithElevenLabs, speakWordWithElevenLabs } from '@/components/reading/elevenlabs-speech';

const POS_MN: Record<string, string> = {
  noun: 'нэр үг',
  verb: 'үйл үг',
  adjective: 'тэмдэг нэр',
  adverb: 'дайвар үг',
  preposition: 'угтвар үг',
  conjunction: 'холбоос үг',
  pronoun: 'төлөөний үг',
  determiner: 'тодотгол',
  interjection: 'аялга үг',
  'phrasal verb': 'бүрэлдмэл үйл үг',
  modal: 'модаль үйл үг',
  auxiliary: 'туслах үйл үг',
};

export function SpeakButton({ text, size = 'md', className = '' }: { text: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const [busy, setBusy] = useState(false);
  const dims = size === 'lg' ? 'h-11 w-11' : size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  const icon = size === 'lg' ? 'h-5 w-5' : size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  return (
    <button
      type="button"
      onClick={() => {
        setBusy(true);
        const opts = { onEnd: () => setBusy(false), onError: () => setBusy(false) };
        void (text.split(/\s+/).length > 1 ? speakWithElevenLabs(text, opts) : speakWordWithElevenLabs(text, opts));
      }}
      className={`inline-flex ${dims} shrink-0 items-center justify-center rounded-full border border-brand/50 bg-brand/15 text-brand transition-colors hover:bg-brand/25 ${className}`}
      aria-label={`"${text}" дуудлага сонсох`}
      title="Дуудлага сонсох"
    >
      {busy ? <Loader2 className={`${icon} animate-spin`} /> : <Volume2 className={icon} />}
    </button>
  );
}

export function WordInfoPanel({ word, context, compact = false }: { word: string; context?: string; compact?: boolean }) {
  const [info, setInfo] = useState<WordInfo | null>(null);
  const [source, setSource] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(!compact);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setInfo(null);
    fetchWordInfo(word, context)
      .then((r) => {
        if (cancelled) return;
        setInfo(r.info);
        setSource(r.source);
      })
      .catch(() => {
        if (!cancelled) setError('Үгийн тайлбар ачаалж чадсангүй.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [word, context]);

  return (
    <div className="rounded-2xl border border-ink-600/80 bg-ink-900/80 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <SpeakButton text={word} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-2xl font-bold text-mist-50">{word}</p>
          <p className="text-xs text-mist-400">
            {info?.ipa && <span className="mr-2 font-mono">/{info.ipa}/</span>}
            {info?.pos.map((p) => (
              <span key={p} className="mr-1.5 rounded bg-brand/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                {p}
                {POS_MN[p.toLowerCase()] ? ` · ${POS_MN[p.toLowerCase()]}` : ''}
              </span>
            ))}
            {info?.level && <span className="rounded bg-modifier/15 px-1.5 py-0.5 text-[10px] font-semibold text-modifier">{info.level}</span>}
          </p>
        </div>
        {compact && (
          <button type="button" onClick={() => setOpen((o) => !o)} className="text-xs text-brand hover:underline">
            {open ? 'Хураах' : 'Дэлгэрэнгүй'}
          </button>
        )}
      </div>

      {loading && (
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-mist-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Үгийн тайлбар бэлтгэж байна…
        </p>
      )}
      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      {info && (
        <div className="mt-3 space-y-3 text-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-mist-500">Утга</p>
            <p className="mt-0.5 text-base font-semibold text-success">{info.meaningMn || '—'}</p>
            {info.definitionEn && <p className="mt-0.5 text-mist-300">{info.definitionEn}</p>}
            {info.inContextMn && (
              <p className="mt-1 rounded-lg border border-brand/30 bg-brand/10 px-2.5 py-1.5 text-xs text-mist-200">
                <span className="font-semibold text-brand">Энэ бичлэгт:</span> {info.inContextMn}
              </p>
            )}
          </div>

          {open && (
            <>
              {info.forms && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-mist-500">Хэлбэрүүд</p>
                  <p className="mt-0.5 font-mono text-mist-100">{info.forms}</p>
                </div>
              )}
              {info.grammarMn && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-mist-500">Хэрэглээний дүрэм</p>
                  <p className="mt-0.5 leading-relaxed text-mist-200">{info.grammarMn}</p>
                </div>
              )}
              {info.examples.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-mist-500">Жишээ</p>
                  <ul className="mt-1 space-y-1.5">
                    {info.examples.map((e, i) => (
                      <li key={i} className="flex items-start gap-2 rounded-lg border border-ink-600/60 bg-ink-800/60 px-2.5 py-1.5">
                        <SpeakButton text={e.en} size="sm" className="mt-0.5" />
                        <span>
                          <span className="text-mist-50">{e.en}</span>
                          {e.mn && <span className="block text-xs text-mist-400">{e.mn}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(info.collocations.length > 0 || info.synonyms.length > 0) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {info.collocations.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-mist-500">Холбоо үг</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {info.collocations.map((c) => (
                          <span key={c} className="rounded-md border border-ink-600/70 bg-ink-800/70 px-2 py-0.5 text-xs text-mist-200">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {info.synonyms.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-mist-500">Ойролцоо үг</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {info.synonyms.map((c) => (
                          <span key={c} className="rounded-md border border-ink-600/70 bg-ink-800/70 px-2 py-0.5 text-xs text-mist-200">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {source !== 'claude' && (
                <p className="inline-flex items-center gap-1.5 text-[11px] text-mist-500">
                  <BookOpen className="h-3 w-3" /> Энгийн тайлбар (AI тайлбар тохируулагдаагүй).
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
