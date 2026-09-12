// frontend/src/app/rule/page.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, Eye, EyeOff, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { A1_RULES, A1_RULES_BY_ID } from '@/lib/grammar/a1';
import type { QuizQuestion } from '@/lib/grammar/types';
import { isMastered } from '@/lib/grammar/progress';
import { buildFullSet, pickQuickSet, scoreByRule, shuffle } from '@/lib/grammar/quiz-utils';
import { useGrammarProgress } from '@/components/rule/use-grammar-progress';
import { PartLegend } from '@/components/rule/colored-sentence';
import { RuleNav } from '@/components/rule/rule-nav';
import { RuleDetail } from '@/components/rule/rule-detail';
import { PracticePicker } from '@/components/rule/practice-picker';
import { PracticeQuiz } from '@/components/rule/practice-quiz';

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

export default function A1GrammarPage() {
  const [tab, setTab] = useState<Tab>('learn');
  const [activeRuleId, setActiveRuleId] = useState(A1_RULES[0].id);
  const [showMn, setShowMn] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const { progress, markViewed, recordQuiz } = useGrammarProgress();
  const topRef = useRef<HTMLDivElement>(null);

  const activeIndex = Math.max(
    0,
    A1_RULES.findIndex((rule) => rule.id === activeRuleId),
  );
  const activeRule = A1_RULES[activeIndex];
  const prevRule = A1_RULES[activeIndex - 1];
  const nextRule = A1_RULES[activeIndex + 1];

  useEffect(() => {
    if (tab === 'learn') markViewed(activeRuleId);
  }, [tab, activeRuleId, markViewed]);

  const scrollToTop = useCallback(() => {
    // AppShell-ийн <main> гүйдэг тул window биш, элементийг харагдуулна.
    topRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, []);

  const openRule = useCallback(
    (ruleId: number) => {
      setActiveRuleId(ruleId);
      setTab('learn');
      scrollToTop();
    },
    [scrollToTop],
  );

  const startSession = useCallback(
    (next: Omit<Session, 'key' | 'questions'>) => {
      setSession((prev) => ({ ...next, key: (prev?.key ?? 0) + 1, questions: next.build() }));
      setTab('practice');
      scrollToTop();
    },
    [scrollToTop],
  );

  const startRuleQuiz = useCallback(
    (ruleId: number) => {
      const rule = A1_RULES_BY_ID.get(ruleId);
      if (!rule) return;
      startSession({
        title: rule.title,
        subtitle: `${rule.titleMn} · ${rule.quiz.length} асуулт`,
        recordable: true,
        build: () => shuffle(rule.quiz),
      });
    },
    [startSession],
  );

  const startQuick = useCallback(
    () =>
      startSession({
        title: 'Хурдан шалгалт',
        subtitle: 'Дүрэм бүрээс нэг асуулт',
        recordable: false,
        build: () => pickQuickSet(A1_RULES),
      }),
    [startSession],
  );

  const startFull = useCallback(
    () =>
      startSession({
        title: 'Бүрэн шалгалт',
        subtitle: 'Бүх дүрэм, бүх асуулт',
        recordable: true,
        build: () => buildFullSet(A1_RULES),
      }),
    [startSession],
  );

  const restartSession = useCallback(() => {
    setSession((prev) => (prev ? { ...prev, key: prev.key + 1, questions: prev.build() } : prev));
    scrollToTop();
  }, [scrollToTop]);

  const handleFinish = useCallback(
    (answers: Record<string, string>) => {
      if (!session?.recordable) return;
      for (const score of scoreByRule(session.questions, answers)) {
        recordQuiz(score.ruleId, score.correct, score.total);
      }
    },
    [session, recordQuiz],
  );

  const viewedCount = A1_RULES.filter((rule) => progress[rule.id]?.viewed).length;
  const masteredCount = A1_RULES.filter((rule) => isMastered(progress[rule.id])).length;

  return (
    <section ref={topRef} className="scroll-mt-4 text-mist-50">
      {/* ── Толгой ─────────────────────────────────────────────── */}
      <header className="mb-6 md:mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-md border border-brand/40 bg-brand/15 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.15em] text-brand">
            A1
          </span>
          <span className="text-xs uppercase tracking-[0.15em] text-mist-400">Grammar · Дүрэм</span>
        </div>

        <h1 className="max-w-3xl font-display text-2xl font-semibold leading-tight tracking-tight text-mist-50 sm:text-3xl md:text-4xl">
          Англи хэлний суурь <span className="text-brand">15 дүрэм</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-mist-400">
          Дүрэм бүрийг монголоор ойлгож, өнгөөр ялгасан жишээгээр хараад, богино шалгалтаар бататгаарай.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ProgressPill
            icon={BookOpen}
            label="Үзсэн"
            value={viewedCount}
            total={A1_RULES.length}
            className="text-brand"
            bar="bg-brand"
          />
          <ProgressPill
            icon={Target}
            label="Эзэмшсэн"
            value={masteredCount}
            total={A1_RULES.length}
            className="text-success"
            bar="bg-success"
          />
        </div>
      </header>

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
        <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-0 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1">
            <RuleNav rules={A1_RULES} activeId={activeRule.id} progress={progress} onSelect={openRule} />
          </aside>

          <div className="min-w-0">
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
              total={A1_RULES.length}
              showMn={showMn}
              progress={progress[activeRule.id]}
              prevTitle={prevRule?.title}
              nextTitle={nextRule?.title}
              onPrev={prevRule ? () => openRule(prevRule.id) : undefined}
              onNext={nextRule ? () => openRule(nextRule.id) : undefined}
              onPractice={startRuleQuiz}
            />
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
            rulesById={A1_RULES_BY_ID}
            onFinish={handleFinish}
            onRestart={restartSession}
            onExit={() => setSession(null)}
            onStudy={(ruleId) => {
              setSession(null);
              openRule(ruleId);
            }}
          />
        ) : (
          <PracticePicker
            rules={A1_RULES}
            progress={progress}
            onQuick={startQuick}
            onFull={startFull}
            onRule={startRuleQuiz}
          />
        ))}
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
