'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Надад одоо ямар түвшин тохирохыг яаж мэдэх вэ?',
    a: 'Бүртгүүлэх үед таны хэлний мэдлэг болон сонирхлыг тодорхойлох богино судалгаа, placement test өгөгдөнө. Үүний дагуу танд тохирсон түвшнээс эхлүүлнэ.',
  },
  {
    q: 'Шалгалтанд алдвал юу болох вэ?',
    a: 'Алдсан асуулт бүр дээр яг юун дээр, яагаад алдсаныг тайлбарлаж өгнө. Дараа нь дахин оролдох боломжтой.',
  },
  {
    q: 'Өдөрт хэр их цаг зарцуулах хэрэгтэй вэ?',
    a: 'Өдөрт ердөө 30–40 минут — 1 унших материал + 2 дагалдах ажил гэсэн бүтэцтэй тул урт хугацаанд тогтвортой үргэлжлүүлэхэд хялбар.',
  },
  {
    q: 'AI-тай ярих, бичих дадлага хэрхэн ажилладаг вэ?',
    a: 'Ярих модульд AI-тай чөлөөтэй ярилцаж, алдаа гарвал тэр дор нь зассан хувилбарыг үзүүлнэ. Бичих модульд таны бичсэн текстийг шинжилж, дүрэм, хэллэгийн алдааг тайлбартай нь засаж, дээр хувилбар санал болгоно.',
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="border-t border-ink-700/80 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mist-400">
          Асуулт ба хариулт
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-mist-50">
          Түгээмэл эргэлзээ
        </h2>

        <div className="mt-10 divide-y divide-ink-700 rounded-2xl border border-ink-700">
          {FAQS.map((item, i) => (
            <div key={item.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="font-medium text-mist-50">{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-mist-400 transition-transform ${
                    open === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm leading-relaxed text-mist-300">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
