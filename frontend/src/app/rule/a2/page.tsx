// frontend/src/app/rule/a2/page.tsx
// A2 түвшний дүрэм.
'use client';

import { A2_RULES } from '@/lib/grammar/a2';
import { GrammarLevelPage } from '@/components/rule/grammar-level-page';

export default function A2GrammarPage() {
  return (
    <GrammarLevelPage
      level="a2"
      rules={A2_RULES}
      headingLead="A2 түвшний"
      headingAccent={`${A2_RULES.length} дүрэм`}
      intro="Өнгөрсөн ба ирээдүй цаг, Present Perfect, модаль үйл үг, нөхцөлт өгүүлбэр, харьцуулал — A1-ийн суурин дээр дараагийн шатны дүрмүүдийг монголоор ойлгож, шалгалтаар бататгаарай."
    />
  );
}
