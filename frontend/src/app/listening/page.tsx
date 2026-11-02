// frontend/src/app/listening/page.tsx
// Сонсох тоглоом — клипүүдийн жагсаалт (YouTube thumbnail, түвшин, үгийн явц)
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Headphones, Loader2 } from 'lucide-react';
import { fetchClips, type ClipSummary } from '@/lib/listening-services';
import { formatTime, LEVEL_LABELS } from '@/lib/listening';
import { getApiErrorMessage } from '@/lib/api-error';
import { LeaderboardPanel } from '@/components/games/leaderboard';

export default function ListeningPage() {
  const [clips, setClips] = useState<ClipSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClips()
      .then(setClips)
      .catch((err) => setError(getApiErrorMessage(err, 'Клипүүд ачаалж чадсангүй')));
  }, []);

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
          <Headphones className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-mist-50">Сонсох тоглоом</h1>
          <p className="mt-1 text-sm text-mist-400">
            Богино ярилцлага, подкаст, илтгэлийн хэсгээс нэг үг сонгоод, тэр үгийг сонсох бүртээ дар. Бичлэг дуусахад хэдэн удаа хэлэгдсэнийг
            тулгана. Үг бүрийн орчуулга, дүрэм, дуудлагыг хамт сур.
          </p>
        </div>
      </div>

      {error && <p className="mt-6 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
      {!clips && !error && (
        <p className="mt-8 inline-flex items-center gap-2 text-sm text-mist-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Ачаалж байна…
        </p>
      )}
      {clips && clips.length === 0 && (
        <p className="mt-6 rounded-xl border border-ink-600/80 bg-ink-900/60 px-4 py-6 text-center text-sm text-mist-400">
          Одоогоор клип нэмэгдээгүй байна. Админ хэсгээс YouTube клип нэмнэ үү.
        </p>
      )}

      {clips && clips.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clips.map((c) => {
            const done = c.wordTotal > 0 && c.wordDone >= c.wordTotal;
            return (
              <li key={c.id}>
                <Link
                  href={`/listening/${c.id}`}
                  className="group block overflow-hidden rounded-2xl border border-ink-600/80 bg-ink-900/70 transition-colors hover:border-brand/60"
                >
                  <div className="relative aspect-video overflow-hidden bg-ink-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://i.ytimg.com/vi/${c.youtubeId}/hqdefault.jpg`}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <span className="absolute bottom-2 right-2 rounded bg-ink-950/80 px-1.5 py-0.5 font-mono text-[11px] text-mist-100">
                      {formatTime(c.endSec - c.startSec)}
                    </span>
                    <span className="absolute left-2 top-2 rounded-full bg-brand/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {LEVEL_LABELS[c.levelCode] ?? c.levelCode}
                    </span>
                    {done && (
                      <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-success/90 px-2 py-0.5 text-[10px] font-semibold text-ink-950">
                        <Check className="h-3 w-3" /> Дууссан
                      </span>
                    )}
                  </div>
                  <div className="p-3.5">
                    <p className="line-clamp-2 font-semibold text-mist-50">{c.title}</p>
                    {c.description && <p className="mt-1 line-clamp-2 text-xs text-mist-400">{c.description}</p>}
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-mist-400">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-800">
                        <div className="h-full bg-success" style={{ width: `${c.wordTotal ? (c.wordDone / c.wordTotal) * 100 : 0}%` }} />
                      </div>
                      <span className="font-mono">
                        {c.wordDone}/{c.wordTotal} үг
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <LeaderboardPanel scope="LISTENING" limit={10} compact className="mt-8" />
    </div>
  );
}
