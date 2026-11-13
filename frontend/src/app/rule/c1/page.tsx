// frontend/src/app/rule/c1/page.tsx
// C1 түвшний дүрэм.
'use client';

import { C1_RULES } from '@/lib/grammar/c1';
import { GrammarLevelPage } from '@/components/rule/grammar-level-page';

export default function C1GrammarPage() {
  return (
    <GrammarLevelPage
      level="c1"
      rules={C1_RULES}
      headingLead="C1 түвшний"
      headingAccent={`${C1_RULES.length} дүрэм`}
      intro="Inversion, албан ёсны нөхцөл өгүүлбэр, subjunctive, ахисан түвшний passive ба participle clause, nominalisation, ellipsis, онцлох бүтэц, hedging, албан бичгийн холбоос үгс — B2-ийн суурин дээр ахисан түвшний дүрмүүдийг сэдэв бүрээр ойлгож, шалгалтаар бататгаарай."
    />
  );
}
