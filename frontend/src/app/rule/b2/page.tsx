// frontend/src/app/rule/b2/page.tsx
// B2 түвшний дүрэм.
'use client';

import { B2_RULES } from '@/lib/grammar/b2';
import { GrammarLevelPage } from '@/components/rule/grammar-level-page';

export default function B2GrammarPage() {
  return (
    <GrammarLevelPage
      level="b2"
      rules={B2_RULES}
      headingLead="B2 түвшний"
      headingAccent={`${B2_RULES.length} дүрэм`}
      intro="Өгүүлэмжийн цагууд, холимог нөхцөл, өнгөрсөн цагийн модаль үгс, causative, мэдээлэх үйл үгс, participle clause, cleft өгүүлбэр, холбоос үгс — B1-ийн суурин дээр ахисан дунд түвшний дүрмүүдийг сэдэв бүрээр ойлгож, шалгалтаар бататгаарай."
    />
  );
}
