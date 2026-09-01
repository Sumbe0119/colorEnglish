'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Headphones, Mic, PenLine } from 'lucide-react';

type SkillId = 'read' | 'listen' | 'speak' | 'write';

const SKILLS: {
  id: SkillId;
  label: string;
  labelMn: string;
  verb: string;
  icon: typeof BookOpen;
  accent: string;
  cardAccent: string;
}[] = [
    {
      id: 'read',
      label: 'Read',
      labelMn: 'Унших',
      verb: 'унш',
      icon: BookOpen,
      accent: 'text-verb border-verb/40 bg-verb/10',
      cardAccent: 'from-verb/25 via-ink-800 to-ink-950',
    },
    {
      id: 'listen',
      label: 'Listen',
      labelMn: 'Сонсох',
      verb: 'сонс',
      icon: Headphones,
      accent: 'text-object border-object/40 bg-object/10',
      cardAccent: 'from-object/25 via-ink-800 to-ink-950',
    },
    {
      id: 'speak',
      label: 'Speak',
      labelMn: 'Ярих',
      verb: 'ярь',
      icon: Mic,
      accent: 'text-modifier border-modifier/40 bg-modifier/10',
      cardAccent: 'from-modifier/25 via-ink-800 to-ink-950',
    },
    {
      id: 'write',
      label: 'Write',
      labelMn: 'Бичих',
      verb: 'бич',
      icon: PenLine,
      accent: 'text-subject border-subject/40 bg-subject/10',
      cardAccent: 'from-subject/25 via-ink-800 to-ink-950',
    },
  ];


const ROTATE_MS = 3500;

export function LazyEnglishSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = SKILLS[activeIndex];


  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % SKILLS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="lazy-english" className="border-t border-ink-700 bg-ink-900 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs uppercase tracking-widest text-brand">Lazy English</p>

        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold text-mist-50 md:text-4xl">
              Learn from —{' '}
              <span
                key={active.id}
                className={`inline-block animate-fade-up ${active.accent.split(' ')[0]}`}
              >
                {active.label}
              </span>
            </h2>
            <p className="mt-3 max-w-xl text-mist-300">
              Та завгүй байсан ч болно өдөрт 10мин зарцуулахад л болно</p>
          </div>
        </div>
      </div>

    </section>
  );
}
