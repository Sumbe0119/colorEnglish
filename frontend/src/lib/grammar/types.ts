// frontend/src/lib/grammar/types.ts
// A1 дүрмийн агуулгын төрлүүд. Агуулга нь ./a1/rule-NN.ts файлуудад.

/** Өгүүлбэрийн гишүүн — ColorEnglish-ийн өнгөт систем (tailwind: subject/verb/object/modifier). */
export type SentencePart = 'subject' | 'verb' | 'object' | 'modifier';

/** Англи өгүүлбэр + монгол орчуулга. `en` нь `[текст](s|v|o|m)` markup агуулж болно. */
export type Example = {
  en: string;
  mn: string;
};

export type UseCase = {
  title: string;
  description: string;
  examples: Example[];
};

export type RuleForm = {
  label: string;
  structure: string;
  examples: Example[];
};

export type CommonMistake = {
  wrong: string;
  correct: string;
  explanation: string;
};

export type StructurePart = {
  text: string;
  part: SentencePart | 'plain';
};

export type DialogueLine = Example & {
  speaker: string;
};

export type MongolianContrast = {
  title: string;
  points: string[];
};

export type QuizKind = 'fill' | 'correct' | 'translate';

export type QuizQuestion = {
  id: string;
  ruleId: number;
  kind: QuizKind;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  hint?: string;
};

export type GrammarRule = {
  id: number;
  title: string;
  titleMn: string;
  hook: string;
  summary: string;
  description: string;
  structure: string;
  structureParts: StructurePart[];
  tip: string;
  examples: Example[];
  useCases: UseCase[];
  forms: RuleForm[];
  signalWords?: string[];
  notes: string[];
  commonMistakes: CommonMistake[];
  mongolianContrast: MongolianContrast;
  dialogue: DialogueLine[];
  quiz: QuizQuestion[];
};
