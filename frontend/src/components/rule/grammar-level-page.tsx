// frontend/src/components/rule/grammar-level-page.tsx
// Түвшин бүрийн (A1, A2, B1) дүрмийн хуудасны нийтлэг бүтэц — дүрмийн жагсаалт + шалгалт.
// Эхний хичээлүүд үнэгүй; бусад нь VIP бөгөөд өмнөх хичээлийн шалгалтад тэнцсэний дараа нээгдэнэ.
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, BookOpen, Crown, Eye, EyeOff, RotateCcw, Sparkles, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GrammarRule, QuizQuestion } from '@/lib/grammar/types';
import type { GrammarLevel, GrammarQuizResult } from '@/lib/grammar/progress';
import { buildFullSet, pickQuickSet, scoreByRule, shuffle } from '@/lib/grammar/quiz-utils';
import { useGrammarProgress } from '@/components/rule/use-grammar-progress';
import { PartLegend } from '@/components/rule/colored-sentence';
import { RuleNav } from '@/components/rule/rule-nav';
import { RuleDetail } from '@/components/rule/rule-detail';
import { LockedRule } from '@/components/rule/locked-rule';
import { PracticePicker } from '@/components/rule/practice-picker';
import { PracticeQuiz, type QuizSaveState } from '@/components/rule/practice-quiz';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button';

type Tab = 'learn' | 'practice';

type Session = {
  key: number;
  title: string;
  subtitle: string;
  /** Дүрэм бүрийн бүх асуултыг агуулсан үед л явцад бүртгэнэ (хурдан шалгалт бүртгэхгүй). */
  recordable: boolean;
  build: () => QuizQuestion[];
  questions: QuizQuestion[];
};

/** Шалгалтын оноог DB-д хадгалах явц — тухайн session-д хамаарна */
type QuizSave = {
  sessionKey: number;
  results: GrammarQuizResult[];
  status: QuizSaveState['status'];
  newlyUnlocked: number[];
};

/** Түвшин солих холбоосууд — толгой хэсэгт харагдана. */
export const GRAMMAR_LEVELS: { level: GrammarLevel; label: string; href: string }[] = [
  { level: 'a1', label: 'A1', href: '/rule' },
  { level: 'a2', label: 'A2', href: '/rule/a2' },
  { level: 'b1', label: 'B1', href: '/rule/b1' },
];

const DEFAULT_PASS_PERCENT = 75;

type Props = {
  level: GrammarLevel;
  rules: GrammarRule[];
  /** Гарчгийн эхний хэсэг, жишээ нь «Англи хэлний суурь» */
  headingLead: string;
  /** Гарчгийн онцолсон хэсэг, жишээ нь «15 дүрэм» */
  headingAccent: string;
  intro: string;
};

export function GrammarLevelPage({ level, rules, headingLead, headingAccent, intro }: Props) {
  const rulesById = useMemo<ReadonlyMap<number, GrammarRule>>(
    () => new Map(rules.map((rule) => [rule.id, rule])),
    [rules],
  );
  const [tab, setTab] = useState<Tab>('learn');
  const [activeRuleId, setActiveRuleId] = useState(rules[0].id);
  const [showMn, setShowMn] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [quizSave, setQuizSave] = useState<QuizSave | null>(null);
  const { progress, meta, status, reload, markViewed, recordQuiz } = useGrammarProgress(level);
  const topRef = useRef<HTMLDivElement>(null);
  const userPickedRule = useRef(false);
  // Шалгалт бүрт давтагдахгүй key — хоцорсон хадгалалтын хариу шинэ шалгалтын төлөвийг дарахгүй
  const sessionSeq = useRef(0);

  const passPercent = meta?.passPercent ?? DEFAULT_PASS_PERCENT;
  const openRules = useMemo(() => rules.filter((rule) => progress[rule.id]?.canOpen), [rules, progress]);

  const activeIndex = Math.max(
    0,
    rules.findIndex((rule) => rule.id === activeRuleId),
  );
  const activeRule = rules[activeIndex];
  const activeState = progress[activeRule.id];
  const prevRule = rules[activeIndex - 1];
  const nextRule = rules[activeIndex + 1];

  // Явц ачаалагдмагц (хэрэглэгч өөрөө сонгоогүй бол) үргэлжлүүлэх хичээл рүү очно:
  // нээлттэй боловч тэнцээгүй эхний хичээл, эсвэл хамгийн сүүлд нээгдсэн хичээл
  useEffect(() => {
    if (status !== 'ready' || userPickedRule.current) return;
    userPickedRule.current = true;
    const next =
      rules.find((rule) => progress[rule.id]?.canOpen && !progress[rule.id]?.passed) ??
      [...rules].reverse().find((rule) => progress[rule.id]?.canOpen);
    if (next) setActiveRuleId(next.id);
  }, [status, rules, progress]);

  useEffect(() => {
    if (tab === 'learn' && status === 'ready') markViewed(activeRuleId);
  }, [tab, activeRuleId, status, markViewed]);

  const scrollToTop = useCallback(() => {
    // AppShell-ийн <main> гүйдэг тул window биш, элементийг харагдуулна.
    topRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, []);

  const openRule = useCallback(
    (ruleId: number) => {
      userPickedRule.current = true;
      setActiveRuleId(ruleId);
      setTab('learn');
      scrollToTop();
    },
    [scrollToTop],
  );

  const startSession = useCallback(
    (next: Omit<Session, 'key' | 'questions'>) => {
      const key = ++sessionSeq.current;
      setQuizSave(null);
      setSession({ ...next, key, questions: next.build() });
      setTab('practice');
      scrollToTop();
    },
    [scrollToTop],
  );

  const startRuleQuiz = useCallback(
    (ruleId: number) => {
      const rule = rulesById.get(ruleId);
      if (!rule) return;
      // Түгжээтэй хичээлийн шалгалтыг өгөхгүй — яагаад түгжээтэйг тайлбарлана
      if (!progress[ruleId]?.canOpen) {
        openRule(ruleId);
        return;
      }
      startSession({
        title: rule.title,
        subtitle: `${rule.titleMn} · ${rule.quiz.length} асуулт`,
        recordable: true,
        build: () => shuffle(rule.quiz),
      });
    },
    [startSession, rulesById, progress, openRule],
  );

  const startQuick = useCallback(
    () =>
      startSession({
        title: 'Хурдан шалгалт',
        subtitle: 'Нээгдсэн дүрэм бүрээс нэг асуулт',
        recordable: false,
        build: () => pickQuickSet(openRules),
      }),
    [startSession, openRules],
  );

  const startFull = useCallback(
    () =>
      startSession({
        title: 'Бүрэн шалгалт',
        subtitle: 'Нээгдсэн бүх дүрэм, бүх асуулт',
        recordable: true,
        build: () => buildFullSet(openRules),
      }),
    [startSession, openRules],
  );

  const restartSession = useCallback(() => {
    const key = ++sessionSeq.current;
    setQuizSave(null);
    setSession((prev) => (prev ? { ...prev, key, questions: prev.build() } : prev));
    scrollToTop();
  }, [scrollToTop]);

  const saveQuiz = useCallback(
    async (sessionKey: number, results: GrammarQuizResult[]) => {
      setQuizSave({ sessionKey, results, status: 'saving', newlyUnlocked: [] });
      try {
        const outcome = await recordQuiz(results);
        setQuizSave((prev) =>
          prev?.sessionKey === sessionKey
            ? { sessionKey, results, status: 'saved', newlyUnlocked: outcome.newlyUnlocked }
            : prev,
        );
      } catch {
        setQuizSave((prev) =>
          prev?.sessionKey === sessionKey ? { sessionKey, results, status: 'error', newlyUnlocked: [] } : prev,
        );
      }
    },
    [recordQuiz],
  );

  const handleFinish = useCallback(
    (answers: Record<string, string>) => {
      if (!session?.recordable) return;
      void saveQuiz(session.key, scoreByRule(session.questions, answers));
    },
    [session, saveQuiz],
  );

  const viewedCount = rules.filter((rule) => progress[rule.id]?.viewed).length;
  const passedCount = rules.filter((rule) => progress[rule.id]?.passed).length;

  const saveState: QuizSaveState | undefined =
    session && quizSave?.sessionKey === session.key
      ? {
          status: quizSave.status,
          passPercent,
          results: quizSave.results.map((r) => ({
            ...r,
            passed: r.correct * 100 >= r.total * passPercent,
            // Энэ удаа унасан ч өмнө нь тэнцсэн бол тэнцсэн хэвээр (passedAt буцахгүй)
            lessonPassed: Boolean(progress[r.ruleId]?.passed),
          })),
          unlocked: quizSave.newlyUnlocked
            .map((ruleId) => ({ rule: rulesById.get(ruleId), state: progress[ruleId] }))
            .filter((u): u is { rule: GrammarRule; state: NonNullable<typeof u.state> } => Boolean(u.rule && u.state))
            .map(({ rule, state }) => ({ ruleId: rule.id, title: rule.title, canOpen: state.canOpen, requiresVip: state.requiresVip })),
        }
      : undefined;

  return (
    <section ref={topRef} className="min-w-0 scroll-mt-4 text-mist-50">
      {/* ── Толгой ─────────────────────────────────────────────── */}
      <header className="mb-6 md:mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Түвшин сонгох"
            className="inline-flex overflow-hidden rounded-md border border-ink-600 bg-ink-900"
          >
            {GRAMMAR_LEVELS.map((item) => {
              const active = item.level === level;
              return (
                <Link
                  key={item.level}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.15em] transition-colors',
                    active ? 'bg-brand/15 text-brand' : 'text-mist-500 hover:bg-ink-800 hover:text-mist-200',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <span className="text-xs uppercase tracking-[0.15em] text-mist-400">Grammar · Дүрэм</span>
        </div>

        <h1 className="max-w-3xl font-display text-2xl font-semibold leading-tight tracking-tight text-mist-50 sm:text-3xl md:text-4xl">
          {headingLead} <span className="text-brand">{headingAccent}</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-mist-400">{intro}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ProgressPill
            icon={BookOpen}
            label="Үзсэн"
            value={viewedCount}
            total={rules.length}
            className="text-brand"
            bar="bg-brand"
          />
          <ProgressPill
            icon={Target}
            label="Тэнцсэн"
            value={passedCount}
            total={rules.length}
            className="text-success"
            bar="bg-success"
          />
        </div>

        {meta && !meta.isPro && (
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-brand/25 bg-brand/[0.06] px-4 py-3 sm:flex-row sm:items-center">
            <Crown className="hidden h-4 w-4 shrink-0 text-brand sm:block" />
            <p className="flex-1 text-xs leading-5 text-mist-300 sm:text-sm">
              Эхний {meta.freeRuleCount} хичээл үнэгүй. Үлдсэн хичээлүүдийг VIP эрхээр, шалгалтдаа тэнцэх бүрд дарааллаар нь нээж үзнэ.
            </p>
            <Link
              href="/billing"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-hover sm:self-auto"
            >
              <Sparkles className="h-3.5 w-3.5" /> VIP авах
            </Link>
          </div>
        )}
      </header>

      {status !== 'ready' && !meta ? (
        status === 'error' ? (
          <div className="ce-panel mx-auto flex max-w-md flex-col items-center px-6 py-10 text-center">
            <AlertCircle className="h-8 w-8 text-danger" />
            <p className="mt-4 text-sm text-mist-300">Хичээлийн явцыг ачаалж чадсангүй.</p>
            <button
              type="button"
              onClick={() => void reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-colors hover:bg-brand-hover"
            >
              <RotateCcw className="h-4 w-4" /> Дахин оролдох
            </button>
          </div>
        ) : (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        )
      ) : (
        <>
          {/* ── Таб ────────────────────────────────────────────────── */}
          <div className="mb-6 flex w-full rounded-xl border border-ink-600 bg-ink-900 p-1 sm:inline-flex sm:w-auto">
            <TabButton
              active={tab === 'learn'}
              onClick={() => {
                // Дундаас нь орхисон шалгалтыг дахин эхлүүлэхгүйн тулд session-ийг хаана.
                setSession(null);
                setTab('learn');
              }}
            >
              <BookOpen className="h-4 w-4" /> Дүрэм
            </TabButton>
            <TabButton active={tab === 'practice'} onClick={() => setTab('practice')}>
              <Target className="h-4 w-4" /> Шалгалт
            </TabButton>
          </div>

          {/* ── Дүрэм ──────────────────────────────────────────────── */}
          {tab === 'learn' && (
            <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
              <aside className="min-w-0 lg:sticky lg:top-0 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
                <RuleNav rules={rules} activeId={activeRule.id} progress={progress} onSelect={openRule} />
              </aside>

              <div className="min-w-0">
                {activeState?.canOpen ? (
                  <>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <PartLegend compact />
                      <button
                        type="button"
                        onClick={() => setShowMn((v) => !v)}
                        aria-pressed={showMn}
                        className={cn(
                          'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors',
                          showMn
                            ? 'border-ink-600 bg-ink-800/60 text-mist-300 hover:text-mist-50'
                            : 'border-brand/40 bg-brand/10 text-brand',
                        )}
                        title="Орчуулгыг нуугаад өөрийгөө шалгаарай"
                      >
                        {showMn ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {showMn ? 'Орчуулга нуух' : 'Орчуулга харуулах'}
                      </button>
                    </div>

                    <RuleDetail
                      key={activeRule.id}
                      rule={activeRule}
                      index={activeIndex}
                      total={rules.length}
                      showMn={showMn}
                      progress={activeState}
                      passPercent={passPercent}
                      prevTitle={prevRule?.title}
                      nextTitle={nextRule?.title}
                      nextState={nextRule ? progress[nextRule.id] : undefined}
                      onPrev={prevRule ? () => openRule(prevRule.id) : undefined}
                      onNext={nextRule ? () => openRule(nextRule.id) : undefined}
                      onPractice={startRuleQuiz}
                    />
                  </>
                ) : (
                  <LockedRule
                    key={activeRule.id}
                    rule={activeRule}
                    index={activeIndex}
                    state={activeState}
                    prevRule={prevRule}
                    prevCanOpen={prevRule ? Boolean(progress[prevRule.id]?.canOpen) : false}
                    freeRuleCount={meta?.freeRuleCount ?? 3}
                    passPercent={passPercent}
                    onOpenPrev={prevRule ? () => openRule(prevRule.id) : undefined}
                    onPracticePrev={prevRule ? () => startRuleQuiz(prevRule.id) : undefined}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── Шалгалт ────────────────────────────────────────────── */}
          {tab === 'practice' &&
            (session ? (
              <PracticeQuiz
                key={session.key}
                questions={session.questions}
                title={session.title}
                subtitle={session.subtitle}
                rulesById={rulesById}
                saveState={saveState}
                onRetrySave={quizSave ? () => void saveQuiz(quizSave.sessionKey, quizSave.results) : undefined}
                onFinish={handleFinish}
                onRestart={restartSession}
                onExit={() => {
                  setQuizSave(null);
                  setSession(null);
                }}
                onStudy={(ruleId) => {
                  setQuizSave(null);
                  setSession(null);
                  openRule(ruleId);
                }}
              />
            ) : (
              <PracticePicker
                rules={rules}
                openRules={openRules}
                progress={progress}
                onQuick={startQuick}
                onFull={startFull}
                onRule={startRuleQuiz}
              />
            ))}
        </>
      )}

      <ScrollToTopButton targetRef={topRef} />
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm transition-colors sm:flex-none sm:px-5',
        active ? 'bg-brand/20 text-brand shadow-glow' : 'text-mist-400 hover:text-mist-50',
      )}
    >
      {children}
    </button>
  );
}

function ProgressPill({
  icon: Icon,
  label,
  value,
  total,
  className,
  bar,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  total: number;
  className: string;
  bar: string;
}) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex min-w-[180px] items-center gap-3">
      <Icon className={cn('h-4 w-4 shrink-0', className)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-mist-400">{label}</span>
          <span className="font-mono text-mist-200">
            {value}/{total}
          </span>
        </div>
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-ink-700">
          <div className={cn('h-full rounded-full transition-all duration-500', bar)} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
