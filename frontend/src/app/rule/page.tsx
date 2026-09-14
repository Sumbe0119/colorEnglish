// frontend/src/app/rule/page.tsx
// A1 түвшний дүрэм.
'use client';

import { A1_RULES } from '@/lib/grammar/a1';
import { GrammarLevelPage } from '@/components/rule/grammar-level-page';

export default function A1GrammarPage() {
  return (
    <GrammarLevelPage
      level="a1"
      rules={A1_RULES}
      headingLead="Англи хэлний суурь"
      headingAccent={`${A1_RULES.length} дүрэм`}
      intro="Дүрэм бүрийг монголоор ойлгож, өнгөөр ялгасан жишээгээр хараад, богино шалгалтаар бататгаарай."
    />
  );
}
