'use client';

import { useMemo, useState } from 'react';

type GrammarRule = {
  id: number;
  title: string;
  hook: string;
  structure: string;
  description: string;
  tip: string;
  examples: string[];
};

type QuizQuestion = {
  id: number;
  ruleId: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

const grammarRules: GrammarRule[] = [
  {
    id: 1,
    title: 'am / is / are',
    hook: 'Би хэн бэ? Тэр ямар байна?',
    structure: 'Subject + am / is / are',
    description:
      'Хэн нэгэн хэн болох, ямар байдалтай, хаана байгааг хэлэхэд хэрэглэнэ.',
    tip: 'I → am · He/She/It → is · You/We/They → are',
    examples: [
      'I am a student.',
      'She is happy.',
      'They are at school.',
    ],
  },
  {
    id: 2,
    title: 'I / you / he / she / it / we / they',
    hook: 'Нэрийг дахин дахин хэлэх хэрэггүй.',
    structure: 'Pronoun + verb',
    description:
      'Хүний болон юмсын нэрийг төлөөлүүлж хэрэглэх үгс.',
    tip: 'Tom → he · Anna → she · Tom & Anna → they',
    examples: [
      'Tom is 12. He is a student.',
      'Anna is here. She is my friend.',
      'My parents are home. They are tired.',
    ],
  },
  {
    id: 3,
    title: 'my / your / his / her / our / their',
    hook: 'Энэ хэний юм бэ?',
    structure: 'Possessive adjective + noun',
    description:
      'Ямар нэг зүйл хэнд хамааралтай болохыг хэлнэ.',
    tip: 'I → my · he → his · she → her · they → their',
    examples: [
      'This is my book.',
      'His name is Ben.',
      'Their house is big.',
    ],
  },
  {
    id: 4,
    title: 'a / an / the',
    hook: 'Ямар нэг зүйл үү, яг тэр зүйл үү?',
    structure: 'a/an + noun · the + specific noun',
    description:
      'Тодорхой бус нэг зүйлд a/an, тодорхой зүйлд the хэрэглэнэ.',
    tip: 'Эгшиг авиагаар эхэлбэл ихэвчлэн an хэрэглэнэ.',
    examples: [
      'I have a dog.',
      'She eats an apple.',
      'The dog is very friendly.',
    ],
  },
  {
    id: 5,
    title: 'Plural nouns',
    hook: 'Нэгээс олон болсон үед юу өөрчлөгдөх вэ?',
    structure: 'noun + s / es',
    description:
      'Нэгээс олон хүн, амьтан, юмсыг нэр үгийн олон тоогоор илэрхийлнэ.',
    tip: 'book → books · box → boxes · child → children',
    examples: [
      'one book → two books',
      'one box → three boxes',
      'one child → two children',
    ],
  },
  {
    id: 6,
    title: 'Present Simple',
    hook: 'Өдөр бүр юу хийдэг вэ?',
    structure: 'I/You/We/They + verb · He/She/It + verb-s',
    description:
      'Байнга хийдэг зүйл, зуршил болон ерөнхий үнэнийг хэлнэ.',
    tip: 'He / She / It орвол үйл үгэнд ихэнхдээ -s нэмэгдэнэ.',
    examples: [
      'I go to school every day.',
      'She plays volleyball.',
      'My dad drinks coffee.',
    ],
  },
  {
    id: 7,
    title: "don't / doesn't",
    hook: 'Хийдэггүй зүйлээ яаж хэлэх вэ?',
    structure: "Subject + don't / doesn't + base verb",
    description:
      'Present Simple дээр үйлдлийг үгүйсгэхэд хэрэглэнэ.',
    tip: "doesn't-ийн дараа үйл үг -s авахгүй.",
    examples: [
      "I don't like coffee.",
      "She doesn't play tennis.",
      "They don't live here.",
    ],
  },
  {
    id: 8,
    title: 'Do / Does',
    hook: 'Чи... хийдэг үү?',
    structure: 'Do / Does + subject + base verb?',
    description:
      'Present Simple цаг дээр асуулт асуухад хэрэглэнэ.',
    tip: 'He / She / It → Does · бусад → Do',
    examples: [
      'Do you like pizza?',
      'Does he play football?',
      'Do they study English?',
    ],
  },
  {
    id: 9,
    title: 'have / has',
    hook: 'Чамд юу байдаг вэ?',
    structure: 'I/You/We/They + have · He/She/It + has',
    description:
      'Ямар нэг зүйлтэй, эзэмшдэг болохыг хэлэхэд хэрэглэнэ.',
    tip: 'He / She / It → has',
    examples: [
      'I have a bicycle.',
      'She has a cat.',
      'They have two children.',
    ],
  },
  {
    id: 10,
    title: 'There is / There are',
    hook: 'Энд юу байна?',
    structure: 'There is + singular · There are + plural',
    description:
      'Ямар нэг газар хүн эсвэл юм байгааг хэлнэ.',
    tip: 'Нэг → There is · Олон → There are',
    examples: [
      'There is a book on the desk.',
      'There are two cats outside.',
      'There is a park near here.',
    ],
  },
  {
    id: 11,
    title: 'can / can’t',
    hook: 'Би чадна. Би чадахгүй.',
    structure: 'Subject + can / can’t + base verb',
    description:
      'Чадвар болон боломжийг илэрхийлнэ.',
    tip: 'can-ийн дараах үйл үг үндсэн хэлбэрээрээ байна.',
    examples: [
      'I can swim.',
      'She can speak English.',
      "He can't drive.",
    ],
  },
  {
    id: 12,
    title: 'Present Continuous',
    hook: 'Яг одоо юу болж байна?',
    structure: 'Subject + am/is/are + verb-ing',
    description:
      'Яг одоо болж байгаа үйлдлийг илэрхийлнэ.',
    tip: 'now / right now / at the moment → сайн дохио.',
    examples: [
      'I am reading.',
      'She is cooking.',
      'They are playing.',
    ],
  },
  {
    id: 13,
    title: 'in / on / under / next to',
    hook: 'Юм яг хаана байна?',
    structure: 'Subject + be + preposition + noun',
    description:
      'Ямар нэг зүйл хаана байрлаж байгааг хэлнэ.',
    tip: 'on = дээр · under = доор · in = дотор · next to = хажууд',
    examples: [
      'The phone is on the table.',
      'The cat is under the chair.',
      'The bank is next to the café.',
    ],
  },
  {
    id: 14,
    title: 'What / Where / Who / When / Why / How',
    hook: 'Асуултаа зөв тавьж сур.',
    structure: 'Question word + auxiliary / be + subject?',
    description:
      'Дэлгэрэнгүй мэдээлэл асуухад хэрэглэдэг асуух үгс.',
    tip: 'What юу · Where хаана · Who хэн · Why яагаад · How хэрхэн',
    examples: [
      'What is your name?',
      'Where do you live?',
      'How are you?',
    ],
  },
  {
    id: 15,
    title: 'Past Simple',
    hook: 'Өчигдөр юу болсон бэ?',
    structure: 'Subject + past verb · was / were',
    description:
      'Өнгөрсөнд болсон, дууссан үйл явдлыг хэлнэ.',
    tip: 'yesterday / last week / last year → Past Simple',
    examples: [
      'I was at home yesterday.',
      'She played tennis.',
      'We went to the cinema.',
    ],
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    ruleId: 1,
    question: 'She ___ my sister.',
    options: ['am', 'is', 'are', 'be'],
    answer: 'is',
    explanation: 'She нь ганц тооны 3-р бие тул "is" хэрэглэнэ.',
  },
  {
    id: 2,
    ruleId: 2,
    question: 'Tom is my friend. ___ is 12 years old.',
    options: ['She', 'He', 'It', 'They'],
    answer: 'He',
    explanation: 'Tom нь эрэгтэй хүний нэр тул "He" хэрэглэнэ.',
  },
  {
    id: 3,
    ruleId: 3,
    question: 'Sarah has a bag. ___ bag is blue.',
    options: ['His', 'Her', 'My', 'Their'],
    answer: 'Her',
    explanation: 'Sarah → she. She-ийн эзэмших хэлбэр нь "her".',
  },
  {
    id: 4,
    ruleId: 4,
    question: 'I have ___ apple.',
    options: ['a', 'an', 'the', 'is'],
    answer: 'an',
    explanation:
      '"apple" нь эгшиг авиагаар эхэлдэг учраас "an" хэрэглэнэ.',
  },
  {
    id: 5,
    ruleId: 5,
    question: 'One child → two ___',
    options: ['childs', 'childes', 'children', 'childrens'],
    answer: 'children',
    explanation: '"child" нь дүрэмгүй олон тоотой: child → children.',
  },
  {
    id: 6,
    ruleId: 6,
    question: 'My brother ___ football every Sunday.',
    options: ['play', 'plays', 'playing', 'played'],
    answer: 'plays',
    explanation:
      'My brother = he. Present Simple дээр He/She/It-ийн үйл үг -s авна.',
  },
  {
    id: 7,
    ruleId: 7,
    question: "She doesn't ___ coffee.",
    options: ['likes', 'like', 'liked', 'liking'],
    answer: 'like',
    explanation:
      `"doesn't" орсон үед дараагийн үйл үг үндсэн хэлбэрээрээ байна: like.`,
  },
  {
    id: 8,
    ruleId: 8,
    question: '___ your father work here?',
    options: ['Do', 'Does', 'Is', 'Are'],
    answer: 'Does',
    explanation: 'Your father = he тул "Does" хэрэглэнэ.',
  },
  {
    id: 9,
    ruleId: 9,
    question: 'Emma ___ a new phone.',
    options: ['have', 'has', 'having', 'haves'],
    answer: 'has',
    explanation: 'Emma = she тул have биш "has" хэрэглэнэ.',
  },
  {
    id: 10,
    ruleId: 10,
    question: '___ three students in the classroom.',
    options: [
      'There is',
      'There are',
      'It is',
      'They is',
    ],
    answer: 'There are',
    explanation: '"three students" олон тоо тул There are хэрэглэнэ.',
  },
  {
    id: 11,
    ruleId: 11,
    question: 'I can ___ very fast.',
    options: ['runs', 'running', 'run', 'ran'],
    answer: 'run',
    explanation: '"can"-ийн дараа үйл үг үндсэн хэлбэрээр орно.',
  },
  {
    id: 12,
    ruleId: 12,
    question: 'Look! The baby ___ sleeping.',
    options: ['am', 'is', 'are', 'does'],
    answer: 'is',
    explanation:
      'The baby = it. Present Continuous → is + verb-ing.',
  },
  {
    id: 13,
    ruleId: 13,
    question: 'The cat is ___ the table.',
    options: ['under', 'does', 'have', 'are'],
    answer: 'under',
    explanation: '"under the table" = ширээний доор.',
  },
  {
    id: 14,
    ruleId: 14,
    question: '___ do you live?',
    options: ['Who', 'Where', 'When', 'What'],
    answer: 'Where',
    explanation: 'Байршил асууж байгаа учраас "Where" хэрэглэнэ.',
  },
  {
    id: 15,
    ruleId: 15,
    question: 'We ___ to the cinema yesterday.',
    options: ['go', 'goes', 'went', 'going'],
    answer: 'went',
    explanation:
      '"yesterday" өнгөрсөн цагийг зааж байна. go → went.',
  },
];

type Tab = 'learn' | 'practice';

export default function ALevelRole() {
  const [tab, setTab] = useState<Tab>('learn');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quizQuestions[currentQuestion];

  const progress = useMemo(
    () =>
      finished
        ? 100
        : ((currentQuestion + 1) / quizQuestions.length) * 100,
    [currentQuestion, finished],
  );

  const selectAnswer = (option: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(option);

    setAnswers((prev) => ({
      ...prev,
      [question.id]: option,
    }));

    if (option === question.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (!selectedAnswer) return;

    if (currentQuestion === quizQuestions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer(null);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers({});
    setScore(0);
    setFinished(false);
  };

  const getOptionClass = (option: string) => {
    const base =
      'w-full rounded-xl border px-4 py-3.5 text-left text-sm transition-all duration-200';

    if (!selectedAnswer) {
      return `${base}
        border-[#24334B]
        bg-[#111B2B]
        text-[#C5D0E0]
        hover:border-[#4773AE]
        hover:bg-[#16243A]
      `;
    }

    if (option === question.answer) {
      return `${base}
        border-[#3B82F6]
        bg-[#142A48]
        text-[#D7E8FF]
      `;
    }

    if (
      option === selectedAnswer &&
      selectedAnswer !== question.answer
    ) {
      return `${base}
        border-[#E05C5C]
        bg-[#2A171D]
        text-[#F5C2C2]
      `;
    }

    return `${base}
      border-[#1B2739]
      bg-[#0E1725]
      text-[#58667B]
      opacity-60
    `;
  };

  const percentage = Math.round(
    (score / quizQuestions.length) * 100,
  );

  return (
    <section
      className="min-h-screen px-5 py-12 text-[#E6EDF7] md:px-8"
      style={{
        backgroundColor: '#0B1220',
        backgroundImage:
          'radial-gradient(circle, rgba(110,168,255,0.12) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-md border border-[#29446D] bg-[#13223A] px-2.5 py-1 text-[10px] font-semibold tracking-[0.15em] text-[#6EA8FF]">
              A1
            </span>

            <span className="text-xs text-[#687892]">
              Grammar Training
            </span>
          </div>

          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-[#F1F5FB] md:text-4xl">
            Англи хэлний суурь
            <span className="text-[#6EA8FF]">
              {' '}15 дүрэм
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#8290A7]">
            Эхлээд дүрмээ ойлго. Дараа нь Practice хэсэгт
            өөрийгөө шалга.
          </p>
        </header>

        {/* TAB */}
        <div className="mb-8 inline-flex rounded-xl border border-[#21304A] bg-[#0D1626] p-1">
          <button
            onClick={() => setTab('learn')}
            className={`
              rounded-lg px-5 py-2.5 text-sm transition
              ${
                tab === 'learn'
                  ? 'bg-[#1C3158] text-[#83B4FF]'
                  : 'text-[#6F7F98] hover:text-white'
              }
            `}
          >
            📖 Дүрэм үзэх
          </button>

          <button
            onClick={() => setTab('practice')}
            className={`
              rounded-lg px-5 py-2.5 text-sm transition
              ${
                tab === 'practice'
                  ? 'bg-[#1C3158] text-[#83B4FF]'
                  : 'text-[#6F7F98] hover:text-white'
              }
            `}
          >
            ✓ Practice
          </button>
        </div>

        {/* ======================================= */}
        {/* LEARN */}
        {/* ======================================= */}

        {tab === 'learn' && (
          <div className="grid gap-4 md:grid-cols-2">
            {grammarRules.map((rule) => (
              <article
                key={rule.id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#202D43]
                  bg-[#0D1523]
                  p-6
                  transition-all
                  duration-300
                  hover:border-[#35588C]
                  hover:bg-[#101B2D]
                "
              >
                <span className="pointer-events-none absolute right-5 top-1 text-6xl font-bold text-[#172235] opacity-60">
                  {String(rule.id).padStart(2, '0')}
                </span>

                <div className="relative">
                  <span className="mb-5 inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-[#315587] bg-[#12233D] px-2 text-[11px] font-semibold text-[#72AAFF]">
                    {String(rule.id).padStart(2, '0')}
                  </span>

                  <h2 className="text-xl font-semibold text-[#F3F6FB]">
                    {rule.title}
                  </h2>

                  <p className="mt-2 text-sm font-medium text-[#6EA8FF]">
                    {rule.hook}
                  </p>

                  <p className="mt-5 text-sm leading-6 text-[#8B98AD]">
                    {rule.description}
                  </p>

                  <div className="my-6 rounded-xl border border-[#1F2C41] bg-[#080F1B] px-4 py-4">
                    <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#56657B]">
                      Formula
                    </span>

                    <code className="text-sm text-[#D8E4F5]">
                      {rule.structure}
                    </code>
                  </div>

                  <div className="space-y-2">
                    {rule.examples.map((example) => (
                      <div
                        key={example}
                        className="flex gap-3 rounded-lg bg-[#111B2B] px-3.5 py-3"
                      >
                        <span className="text-[#6EA8FF]">
                          →
                        </span>

                        <span className="text-sm text-[#BAC6D8]">
                          {example}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-[#1C293C] pt-5">
                    <p className="text-xs leading-5 text-[#718198]">
                      <span className="mr-2 font-semibold text-[#6EA8FF]">
                        Санах арга:
                      </span>

                      {rule.tip}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const index =
                        quizQuestions.findIndex(
                          (q) => q.ruleId === rule.id,
                        );

                      setCurrentQuestion(index);
                      setSelectedAnswer(null);
                      setFinished(false);
                      setScore(0);
                      setAnswers({});
                      setTab('practice');
                    }}
                    className="
                      mt-5
                      flex
                      items-center
                      gap-2
                      text-xs
                      font-medium
                      text-[#6EA8FF]
                      transition
                      hover:text-[#A5CAFF]
                    "
                  >
                    Энэ дүрмээр өөрийгөө шалгах
                    <span>→</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ======================================= */}
        {/* PRACTICE */}
        {/* ======================================= */}

        {tab === 'practice' && (
          <div className="mx-auto max-w-3xl">

            {!finished ? (
              <>
                {/* PROGRESS */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-[#718198]">
                      Асуулт {currentQuestion + 1} /{' '}
                      {quizQuestions.length}
                    </span>

                    <span className="text-[#6EA8FF]">
                      {score} зөв
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-[#172235]">
                    <div
                      className="h-full rounded-full bg-[#4D8DDF] transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>

                {/* QUESTION */}
                <div className="rounded-2xl border border-[#24334A] bg-[#0D1523] p-6 md:p-8">
                  <div className="mb-7 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-[#53647E]">
                        Grammar
                      </span>

                      <p className="mt-1 text-xs text-[#6EA8FF]">
                        {
                          grammarRules.find(
                            (r) =>
                              r.id === question.ruleId,
                          )?.title
                        }
                      </p>
                    </div>

                    <span className="text-xs text-[#526078]">
                      {String(
                        currentQuestion + 1,
                      ).padStart(2, '0')}
                    </span>
                  </div>

                  <h2 className="mb-8 text-xl font-semibold leading-8 text-[#F2F6FC] md:text-2xl">
                    {question.question}
                  </h2>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {question.options.map(
                      (option, index) => (
                        <button
                          key={option}
                          onClick={() =>
                            selectAnswer(option)
                          }
                          className={getOptionClass(
                            option,
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-current/20 text-xs opacity-70">
                              {String.fromCharCode(
                                65 + index,
                              )}
                            </span>

                            <span>{option}</span>

                            {selectedAnswer &&
                              option ===
                                question.answer && (
                                <span className="ml-auto text-[#6EA8FF]">
                                  ✓
                                </span>
                              )}

                            {selectedAnswer === option &&
                              option !==
                                question.answer && (
                                <span className="ml-auto text-[#E87878]">
                                  ×
                                </span>
                              )}
                          </div>
                        </button>
                      ),
                    )}
                  </div>

                  {/* FEEDBACK */}
                  {selectedAnswer && (
                    <div
                      className={`
                        mt-6
                        rounded-xl
                        border
                        p-4
                        ${
                          selectedAnswer ===
                          question.answer
                            ? 'border-[#294E7A] bg-[#10233D]'
                            : 'border-[#573039] bg-[#21151B]'
                        }
                      `}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className={
                            selectedAnswer ===
                            question.answer
                              ? 'text-[#72AAFF]'
                              : 'text-[#E87878]'
                          }
                        >
                          {selectedAnswer ===
                          question.answer
                            ? '✓'
                            : '×'}
                        </span>

                        <strong className="text-sm text-[#E8EEF7]">
                          {selectedAnswer ===
                          question.answer
                            ? 'Зөв!'
                            : 'Дахин анхаараарай'}
                        </strong>
                      </div>

                      <p className="text-sm leading-6 text-[#8998AE]">
                        {question.explanation}
                      </p>

                      {selectedAnswer !==
                        question.answer && (
                        <p className="mt-2 text-sm">
                          <span className="text-[#718198]">
                            Зөв хариулт:{' '}
                          </span>

                          <span className="font-medium text-[#79AEFF]">
                            {question.answer}
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* NEXT */}
                  <div className="mt-7 flex justify-end">
                    <button
                      onClick={nextQuestion}
                      disabled={!selectedAnswer}
                      className="
                        rounded-lg
                        bg-[#1D4F8C]
                        px-5
                        py-3
                        text-sm
                        font-medium
                        text-[#EAF3FF]
                        transition
                        hover:bg-[#2865AD]
                        disabled:cursor-not-allowed
                        disabled:opacity-30
                      "
                    >
                      {currentQuestion ===
                      quizQuestions.length - 1
                        ? 'Үр дүн харах'
                        : 'Дараагийн асуулт →'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* ======================================= */
              /* RESULT */
              /* ======================================= */

              <div className="rounded-2xl border border-[#24334A] bg-[#0D1523] p-8 text-center md:p-12">
                <span className="text-xs uppercase tracking-[0.2em] text-[#6EA8FF]">
                  Practice Complete
                </span>

                <div className="my-8">
                  <div className="text-6xl font-semibold tracking-tight text-[#F4F7FB]">
                    {percentage}
                    <span className="text-2xl text-[#718198]">
                      %
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-[#8190A6]">
                    {quizQuestions.length} асуултаас{' '}
                    <span className="font-semibold text-[#8DBAFF]">
                      {score}
                    </span>{' '}
                    зөв хариуллаа.
                  </p>
                </div>

                <div className="mx-auto mb-8 max-w-md rounded-xl border border-[#1D2C42] bg-[#101B2B] p-5">
                  {percentage >= 90 ? (
                    <>
                      <p className="font-medium text-[#E8EFF8]">
                        Маш сайн.
                      </p>
                      <p className="mt-2 text-sm text-[#718198]">
                        A1 дүрмийн суурь ойлголт сайн
                        тогтжээ.
                      </p>
                    </>
                  ) : percentage >= 70 ? (
                    <>
                      <p className="font-medium text-[#E8EFF8]">
                        Сайн байна.
                      </p>
                      <p className="mt-2 text-sm text-[#718198]">
                        Алдсан дүрмүүдээ дахин нэг
                        хараад тестээ давтаарай.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-[#E8EFF8]">
                        Дахин давтах хэрэгтэй.
                      </p>
                      <p className="mt-2 text-sm text-[#718198]">
                        Эхлээд дүрмийн жишээнүүдийг
                        уншаад Practice-аа дахин хийгээрэй.
                      </p>
                    </>
                  )}
                </div>

                {/* RESULT LIST */}
                <div className="mb-8 space-y-2 text-left">
                  {quizQuestions.map(
                    (item, index) => {
                      const userAnswer =
                        answers[item.id];

                      const correct =
                        userAnswer === item.answer;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-lg border border-[#1D2A3E] bg-[#101927] px-4 py-3"
                        >
                          <span
                            className={
                              correct
                                ? 'text-[#6EA8FF]'
                                : 'text-[#E87878]'
                            }
                          >
                            {correct ? '✓' : '×'}
                          </span>

                          <span className="text-xs text-[#60718A]">
                            {String(
                              index + 1,
                            ).padStart(2, '0')}
                          </span>

                          <span className="flex-1 text-sm text-[#AAB7CA]">
                            {
                              grammarRules.find(
                                (r) =>
                                  r.id ===
                                  item.ruleId,
                              )?.title
                            }
                          </span>

                          <span
                            className={
                              correct
                                ? 'text-xs text-[#6EA8FF]'
                                : 'text-xs text-[#E87878]'
                            }
                          >
                            {userAnswer || '—'}
                          </span>
                        </div>
                      );
                    },
                  )}
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      restartQuiz();
                      setTab('learn');
                    }}
                    className="rounded-lg border border-[#2B3B54] bg-[#111B2B] px-5 py-3 text-sm text-[#91A0B5] transition hover:border-[#486A98] hover:text-white"
                  >
                    Дүрмээ дахин үзэх
                  </button>

                  <button
                    onClick={restartQuiz}
                    className="rounded-lg bg-[#1D4F8C] px-5 py-3 text-sm font-medium text-[#EAF3FF] transition hover:bg-[#2865AD]"
                  >
                    ↻ Дахин тест өгөх
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}