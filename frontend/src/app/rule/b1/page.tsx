// frontend/src/app/rule/b1/page.tsx
// B1 түвшний дүрэм.
'use client';

import { B1_RULES } from '@/lib/grammar/b1';
import { GrammarLevelPage } from '@/components/rule/grammar-level-page';

export default function B1GrammarPage() {
  return (
    <GrammarLevelPage
      level="b1"
      rules={B1_RULES}
      headingLead="B1 түвшний"
      headingAccent={`${B1_RULES.length} дүрэм`}
      intro="Present Perfect Continuous, Past Perfect, үйлдэгдэх хэв, шууд бус яриа, хоёр ба гуравдугаар нөхцөл, таамаглалын модаль үгс — A2-ийн суурин дээр дунд түвшний дүрмүүдийг сэдэв бүрээр өмнөх түвшнээс юугаараа ялгаатайг нь ойлгож, шалгалтаар бататгаарай."
    />
  );
}
