'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Part = 'subject' | 'verb' | 'object' | 'modifier' | 'plain';

interface Token {
  text: string;
  part: Part;
}

const SENTENCES: { tokens: Token[]; translation: string }[] = [
  {
    tokens: [
      { text: 'She', part: 'subject' },
      { text: 'is learning', part: 'verb' },
      { text: 'English', part: 'object' },
      { text: 'every day', part: 'modifier' },
    ],
    translation: 'Тэр өдөр бүр Англи хэл сурч байна.',
  },
  {
    tokens: [
      { text: 'I', part: 'subject' },
      { text: 'have finished', part: 'verb' },
      { text: 'my homework', part: 'object' },
      { text: 'already', part: 'modifier' },
    ],
    translation: 'Би гэрийн даалгавраа аль хэдийн дуусгасан.',
  },
  {
    tokens: [
      { text: 'They', part: 'subject' },
      { text: 'will watch', part: 'verb' },
      { text: 'a movie', part: 'object' },
      { text: 'tonight', part: 'modifier' },
    ],
    translation: 'Тэд өнөө орой кино үзэх болно.',
  },
];

const partColor: Record<Part, string> = {
  subject: 'text-subject',
  verb: 'text-verb',
  object: 'text-object',
  modifier: 'text-modifier',
  plain: 'text-mist-100',
};

const partHex: Record<Exclude<Part, 'plain'>, string> = {
  subject: '#7C9EFF',
  verb: '#FF8B6B',
  object: '#5FD9A4',
  modifier: '#F4C95D',
};

const partLabel: Record<Exclude<Part, 'plain'>, string> = {
  subject: 'Эзэн',
  verb: 'Үйл үг',
  object: 'Хамаатуулагч',
  modifier: 'Нөхцөл',
};

export function SentenceShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SENTENCES.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const current = SENTENCES[index];

  return (
    <div className="flex h-full flex-col justify-center gap-10 px-12">
      <div>
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-mist-400">
          Үг бүрийг өнгөөр нь ялгаж ойлго
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <p className="font-display text-3xl leading-snug text-balance md:text-4xl">
              {current.tokens.map((token, i) => (
                <span key={i} className={cn('transition-colors', partColor[token.part])}>
                  {token.text}{' '}
                </span>
              ))}
            </p>
            <p className="mt-4 font-body text-base text-mist-300">{current.translation}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-3">
        {(Object.keys(partLabel) as Array<keyof typeof partLabel>).map((part) => (
          <div
            key={part}
            className="flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800/60 px-3 py-1.5"
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: partHex[part] }} />
            <span className="text-xs text-mist-300">{partLabel[part]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
