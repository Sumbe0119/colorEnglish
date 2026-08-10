'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkPlus, Volume2, X } from 'lucide-react';
import { ReadingWord, saveReadingWord } from '@/lib/reading-services';
import { useAuthStore } from '@/store/auth-store';
import { toast } from '@/store/toast-store';
import {
  buildReaderSegments,
  buildTokenSpans,
  normalizePhrase,
  speakEnglishWord,
  PassageSegment,
} from '@/components/reading/reading-utils';

type SelectPayload = {
  word: string;
  startOffset: number;
  endOffset: number;
  contextSentence: string;
};

type PendingRange = {
  startIndex: number;
  endIndex: number;
};

export type SpeechHighlight = {
  /** Current speaking char index in body */
  charIndex: number;
  /** True while story TTS is playing */
  active: boolean;
};

const MAX_PHRASE_WORDS = 3;

export function ReadingPassage({
  body,
  words,
  storyId,
  interactive = 'annotated',
  onSelectToken,
  speechHighlight,
  tone = 'default',
  className,
}: {
  body: string;
  words: ReadingWord[];
  /** Student story id — enables «Шинэ үг» save */
  storyId?: string;
  /** annotated = student; all = admin selection */
  interactive?: 'annotated' | 'all';
  onSelectToken?: (token: SelectPayload) => void;
  speechHighlight?: SpeechHighlight;
  /** immersive = mobile reader (cyan text, orange speech highlight) */
  tone?: 'default' | 'immersive';
  className?: string;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [active, setActive] = useState<{
    word: string;
    meaningMn: string;
    readingWordId?: string;
    x: number;
    y: number;
  } | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'exists' | 'error'>(
    'idle',
  );
  const [pending, setPending] = useState<PendingRange | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = () => setActive(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    setActive(null);
    setPending(null);
    setSaveStatus('idle');
  }, [words, body]);

  const annotations = words
    .filter((w) => typeof w.startOffset === 'number' && typeof w.endOffset === 'number')
    .map((w) => ({
      id: w.id,
      word: w.word,
      meaningMn: w.meaningMn,
      startOffset: w.startOffset,
      endOffset: w.endOffset,
    }));

  const segments: PassageSegment[] =
    interactive === 'all'
      ? buildAdminSegments(body, annotations)
      : buildReaderSegments(body, annotations);

  const wordTokens = segments.filter(
    (s): s is Extract<PassageSegment, { kind: 'word' }> => s.kind === 'word',
  );

  const pendingPhrase = pending
    ? wordTokens.slice(pending.startIndex, pending.endIndex + 1)
    : [];
  const pendingLabel = pendingPhrase.map((t) => t.key).join(' ');
  const pendingLen = pending ? pending.endIndex - pending.startIndex + 1 : 0;

  const showPopover = (
    word: string,
    meaningMn: string,
    event: React.MouseEvent<HTMLButtonElement>,
    readingWordId?: string,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const container = containerRef.current?.getBoundingClientRect();
    if (!container) return;
    setSaveStatus('idle');
    setActive({
      word: word.trim(),
      meaningMn,
      readingWordId,
      x: rect.left - container.left + rect.width / 2,
      y: rect.top - container.top - 8,
    });
    speakEnglishWord(normalizePhrase(word));
  };

  const handleSaveWord = async () => {
    if (!active || !storyId) return;
    if (!user) {
      router.push('/login');
      return;
    }
    setSaveStatus('saving');
    try {
      const res = await saveReadingWord({
        word: active.word,
        meaningMn: active.meaningMn,
        storyId,
        readingWordId: active.readingWordId,
      });
      setSaveStatus(res.alreadyExists ? 'exists' : 'saved');
      toast.success(res.alreadyExists ? 'Аль хэдийн хадгалсан' : 'Шинэ үг нэмэгдлээ');
    } catch {
      setSaveStatus('error');
      toast.error('Үг хадгалахад алдаа гарлаа');
    }
  };

  const commitRange = (startIndex: number, endIndex: number) => {
    const slice = wordTokens.slice(startIndex, endIndex + 1);
    if (slice.length === 0) return;
    onSelectToken?.({
      word: slice.map((t) => t.key).join(' '),
      startOffset: slice[0].startOffset,
      endOffset: slice[slice.length - 1].endOffset,
      contextSentence: slice[0].contextSentence ?? '',
    });
    setPending(null);
  };

  const handleAdminWordClick = (
    segment: Extract<PassageSegment, { kind: 'word' }>,
    tokenIndex: number,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    if (segment.meaningMn) {
      showPopover(segment.text, segment.meaningMn, event, segment.annotationId);
      return;
    }

    if (!onSelectToken) return;

    if (
      pending &&
      tokenIndex >= pending.startIndex &&
      tokenIndex <= pending.endIndex
    ) {
      commitRange(pending.startIndex, pending.endIndex);
      return;
    }

    if (pending) {
      const { startIndex, endIndex } = pending;
      const len = endIndex - startIndex + 1;

      if (tokenIndex === startIndex - 1 && len < MAX_PHRASE_WORDS) {
        const next = { startIndex: tokenIndex, endIndex };
        if (next.endIndex - next.startIndex + 1 >= MAX_PHRASE_WORDS) {
          commitRange(next.startIndex, next.endIndex);
        } else {
          setPending(next);
        }
        return;
      }

      if (tokenIndex === endIndex + 1 && len < MAX_PHRASE_WORDS) {
        const next = { startIndex, endIndex: tokenIndex };
        if (next.endIndex - next.startIndex + 1 >= MAX_PHRASE_WORDS) {
          commitRange(next.startIndex, next.endIndex);
        } else {
          setPending(next);
        }
        return;
      }

      setPending({ startIndex: tokenIndex, endIndex: tokenIndex });
      return;
    }

    setPending({ startIndex: tokenIndex, endIndex: tokenIndex });
  };

  const speechActive = speechHighlight?.active ?? false;
  const speechChar = speechHighlight?.charIndex ?? -1;

  let wordTokenCounter = -1;

  return (
    <div ref={containerRef} className="relative">
      {interactive === 'all' && pending && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-brand/30 bg-brand/10 px-3 py-2 text-sm text-mist-200">
          <span>
            Сонгосон ({pendingLen}/{MAX_PHRASE_WORDS}):{' '}
            <strong className="text-brand">{pendingLabel}</strong>
          </span>
          <span className="text-mist-500">
            — хөрш үг нэмэх, эсвэл сонголт дээр дахин дарж батлах
          </span>
          <button
            type="button"
            className="ml-auto text-xs text-mist-400 hover:text-mist-50"
            onClick={(e) => {
              e.stopPropagation();
              setPending(null);
            }}
          >
            Цуцлах
          </button>
          <button
            type="button"
            className="rounded-lg bg-brand/20 px-2 py-1 text-xs text-brand hover:bg-brand/30"
            onClick={(e) => {
              e.stopPropagation();
              commitRange(pending.startIndex, pending.endIndex);
            }}
          >
            Батлах ✓
          </button>
        </div>
      )}

      <p
        className={
          className ??
          (tone === 'immersive'
            ? 'whitespace-pre-wrap font-body text-[1.15rem] leading-[2.05] tracking-wide text-sky-300/95 md:text-xl md:leading-relaxed'
            : 'whitespace-pre-wrap font-display text-lg leading-relaxed text-mist-100 md:text-xl')
        }
      >
        {segments.map((segment, i) => {
          if (segment.kind === 'text') {
            const textRead =
              speechActive && speechChar >= 0 && segment.text.length > 0;
            // crude: if this text block starts before speechChar, tint lightly
            // We don't have startOffset on text segments — skip special style
            void textRead;
            return <span key={i}>{segment.text}</span>;
          }

          wordTokenCounter += 1;
          const tokenIndex = wordTokenCounter;
          const hasMeaning = Boolean(segment.meaningMn);

          const isCurrent =
            speechActive &&
            speechChar >= segment.startOffset &&
            speechChar < segment.endOffset;
          const isRead =
            speechActive && speechChar >= segment.endOffset;

          if (interactive === 'annotated') {
            let baseClass: string;
            if (tone === 'immersive') {
              baseClass = isCurrent
                ? 'mx-0.5 inline rounded-sm bg-orange-500/45 px-0.5 text-orange-50 transition-colors duration-150'
                : isRead
                  ? 'mx-0.5 inline border-b border-orange-400/80 px-0.5 text-sky-200 transition-colors duration-150'
                  : hasMeaning
                    ? 'mx-0.5 inline border-b border-sky-400/35 px-0.5 text-sky-300 transition-colors hover:bg-sky-400/10'
                    : 'mx-0.5 inline px-0.5 text-sky-300/95';
            } else {
              baseClass = isCurrent
                ? 'mx-0.5 inline rounded-md bg-brand px-0.5 text-ink-950 shadow-sm transition-colors duration-150'
                : isRead
                  ? 'mx-0.5 inline rounded-md bg-brand/25 px-0.5 text-mist-50 transition-colors duration-150'
                  : hasMeaning
                    ? 'mx-0.5 inline rounded-md border-b-2 border-brand/40 px-0.5 text-brand transition-colors hover:bg-brand/15 hover:text-brand'
                    : 'mx-0.5 inline px-0.5 text-mist-100';
            }

            if (!hasMeaning) {
              return (
                <span key={`${i}-${segment.startOffset}`} className={baseClass}>
                  {segment.text}
                </span>
              );
            }

            return (
              <button
                key={`${segment.annotationId ?? i}-${segment.startOffset}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPopover(segment.text, segment.meaningMn!, e, segment.annotationId);
                }}
                className={baseClass}
                title={segment.meaningMn}
              >
                {segment.text}
              </button>
            );
          }

          // admin interactive=all
          const inPending =
            pending &&
            tokenIndex >= pending.startIndex &&
            tokenIndex <= pending.endIndex;

          const canExtend =
            pending &&
            pendingLen < MAX_PHRASE_WORDS &&
            (tokenIndex === pending.startIndex - 1 || tokenIndex === pending.endIndex + 1);

          return (
            <button
              key={`${segment.annotationId ?? i}-${segment.startOffset}`}
              type="button"
              onClick={(e) => handleAdminWordClick(segment, tokenIndex, e)}
              className={
                hasMeaning
                  ? 'mx-0.5 inline rounded-md border-b-2 border-brand/40 px-0.5 text-brand transition-colors hover:bg-brand/15 hover:text-brand'
                  : inPending
                    ? 'mx-0.5 inline rounded-md bg-brand/25 px-0.5 text-brand ring-2 ring-brand/50'
                    : canExtend
                      ? 'mx-0.5 inline rounded-md border-b border-dashed border-brand/60 px-0.5 text-brand/80 transition-colors hover:bg-brand/15'
                      : 'mx-0.5 inline rounded-md border-b border-dashed border-mist-600 px-0.5 text-mist-300 transition-colors hover:border-brand/50 hover:text-brand'
              }
              title={
                hasMeaning
                  ? segment.meaningMn
                  : inPending
                    ? 'Дахин дарвал батална'
                    : 'Орчуулга нэмэх'
              }
            >
              {segment.text}
            </button>
          );
        })}
      </p>

      {active && (
        <div
          className="absolute z-20 min-w-[200px] -translate-x-1/2 -translate-y-full rounded-xl border border-brand/30 bg-ink-800 px-4 py-3 shadow-xl"
          style={{ left: active.x, top: active.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="font-display font-semibold text-brand">{active.word}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => speakEnglishWord(normalizePhrase(active.word))}
                className="rounded-lg p-1 text-mist-400 hover:bg-ink-700 hover:text-mist-50"
                title="Дахин унших"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="rounded-lg p-1 text-mist-400 hover:bg-ink-700 hover:text-mist-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-mist-200">{active.meaningMn}</p>
          {storyId && interactive === 'annotated' && (
            <div className="mt-3">
              <button
                type="button"
                disabled={saveStatus === 'saving' || saveStatus === 'saved' || saveStatus === 'exists'}
                onClick={handleSaveWord}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand/20 px-3 py-1.5 text-xs font-medium text-brand transition-colors hover:bg-brand/30 disabled:opacity-70"
              >
                <BookmarkPlus className="h-3.5 w-3.5" />
                {saveStatus === 'saving'
                  ? 'Хадгалж байна…'
                  : saveStatus === 'saved'
                    ? 'Нэмэгдсэн ✓'
                    : saveStatus === 'exists'
                      ? 'Аль хэдийн байна'
                      : saveStatus === 'error'
                        ? 'Алдаа — дахин оролд'
                        : 'Шинэ үг'}
              </button>
            </div>
          )}
        </div>
      )}

      <p className="mt-6 text-xs text-mist-500">
        {interactive === 'all'
          ? '💡 1–3 үг сонгоно: үг дээр дар → хөрш үг нэм → 3 болсон үед автоматаар батална, эсвэл «Батлах».'
          : '💡 Орчуулгатай үг дээр дарж монгол утгыг хараарай. Speak дарж бүтэн өгүүллэгийг сонсоорой.'}
      </p>
    </div>
  );
}

function buildAdminSegments(
  body: string,
  annotations: Array<{
    id: string;
    word: string;
    meaningMn: string;
    startOffset: number;
    endOffset: number;
  }>,
): PassageSegment[] {
  const bySpan = new Map(
    annotations.map((a) => [`${a.startOffset}:${a.endOffset}`, a] as const),
  );
  const multiAnns = annotations
    .filter((a) => a.word.includes(' '))
    .sort((a, b) => a.startOffset - b.startOffset || b.endOffset - a.endOffset);

  const tokens = buildTokenSpans(body);
  const segments: PassageSegment[] = [];
  let cursor = 0;
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];
    if (cursor < token.start) {
      segments.push({ kind: 'text', text: body.slice(cursor, token.start) });
    }

    const multi = multiAnns.find(
      (a) => a.startOffset === token.start || (a.startOffset <= token.start && token.end <= a.endOffset),
    );

    if (multi && multi.startOffset === token.start) {
      let j = i;
      while (j < tokens.length && tokens[j].end <= multi.endOffset) j += 1;
      segments.push({
        kind: 'word',
        text: body.slice(multi.startOffset, multi.endOffset),
        key: multi.word,
        startOffset: multi.startOffset,
        endOffset: multi.endOffset,
        meaningMn: multi.meaningMn,
        annotationId: multi.id,
        contextSentence: token.contextSentence,
      });
      cursor = multi.endOffset;
      i = j;
      continue;
    }

    const ann = bySpan.get(`${token.start}:${token.end}`);
    segments.push({
      kind: 'word',
      text: body.slice(token.start, token.end),
      key: token.key,
      startOffset: token.start,
      endOffset: token.end,
      meaningMn: ann?.meaningMn,
      annotationId: ann?.id,
      contextSentence: token.contextSentence,
    });
    cursor = token.end;
    i += 1;
  }

  if (cursor < body.length) {
    segments.push({ kind: 'text', text: body.slice(cursor) });
  }

  return segments;
}
