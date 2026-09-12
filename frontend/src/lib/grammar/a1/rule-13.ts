// frontend/src/lib/grammar/a1/rule-13.ts
// A1 дүрэм 13: in / on / under / next to
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule13: GrammarRule = {
  id: 13,
  title: 'in / on / under / next to',
  titleMn: 'Байршил заах угтвар үгс',
  hook: 'Утас минь хаана байна? Ширээн дээр үү, цүнхэн дотор уу, сандлын доор уу? — энэ дөрвөн үг хариулна.',
  summary: 'in / on / under / next to бол байршил заах угтвар үгс. Хүн, юмс хаана байгааг хэлнэ: in = дотор, on = гадаргуу дээр, under = доор, next to = яг хажууд. Угтвар үг нэр үгийнхээ ӨМНӨ орно.',
  description: 'in / on / under / next to бол байршил заах угтвар үгс (place preposition). Хүн, юмсын орон зайн байрлалыг хэлнэ. in = дотор, хүрээнд; on = гадаргуу дээр, хүрэлцэж байгаа; under = доод талд; next to = яг хажууд. Хамгийн түгээмэл загвар: эзэн + be + угтвар үг + нэр үг. Монголоор «ширээн дээр» гэхэд «дээр» нэр үгийн ард ордог бол англиар on ширээний өмнө ирнэ: on the table. Энэ дөрвөн үгийг мэдвэл юмаа хаана байгааг хэлж, «хаана?» гэсэн асуултад хариулж чадна.',
  structure: 'Subject + be + preposition + noun',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'be', part: 'verb' },
    { text: 'preposition + noun', part: 'modifier' },
  ],
  tip: 'in = дотор · on = гадаргуу дээр · under = доор · next to = яг хажууд. Угтвар үг нэр үгийнхээ өмнө: on the table.',
  examples: [
    { en: '[The phone](s) [is](v) [on the table](m).', mn: 'Утас ширээн дээр байна.' },
    { en: '[The cat](s) [is](v) [under the chair](m).', mn: 'Муур сандлын доор байна.' },
    { en: '[The bank](s) [is](v) [next to the café](m).', mn: 'Банк кафены яг хажууд байна.' },
    { en: '[The keys](s) [are](v) [in my bag](m).', mn: 'Түлхүүр миний цүнхэнд байна.' },
  ],
  useCases: [
    {
      title: 'in — дотор, хүрээнд',
      description: 'Ямар нэг зүйлийн дотор, хил хязгаартай орон зайд байгааг хэлнэ: цүнх, өрөө, хайрцаг, хот, улс. Монгол хэлний «-д/-т», «дотор» гэсэн утгатай.',
      examples: [
        { en: '[The keys](s) [are](v) [in my bag](m).', mn: 'Түлхүүр миний цүнхэнд байна.' },
        { en: '[She](s) [is](v) [in the room](m).', mn: 'Тэр өрөөнд байна.' },
        { en: '[They](s) [live](v) [in Mongolia](m).', mn: 'Тэд Монголд амьдардаг.' },
      ],
    },
    {
      title: 'on — гадаргуу дээр',
      description: 'Ямар нэг гадаргуутай хүрэлцэж, дээр нь байгааг хэлнэ: ширээ, хана, шал, сандал. Хана босоо ч гадаргуу учраас on the wall гэнэ.',
      examples: [
        { en: '[The book](s) [is](v) [on the desk](m).', mn: 'Ном ширээн дээр байна.' },
        { en: '[There](s) [is](v) [a picture](o) [on the wall](m).', mn: 'Хананд зураг байна.' },
        { en: '[Your coat](s) [is](v) [on the chair](m).', mn: 'Чиний пальто сандал дээр байна.' },
      ],
    },
    {
      title: 'under — доор',
      description: 'Өөр зүйлийн доод талд байгааг хэлнэ. Гээсэн юмаа хайхад хамгийн их хэрэг болдог үг: ор, ширээ, сандлын доор.',
      examples: [
        { en: '[The cat](s) [is](v) [under the table](m).', mn: 'Муур ширээний доор байна.' },
        { en: '[My shoes](s) [are](v) [under the bed](m).', mn: 'Миний гутал орны доор байна.' },
      ],
    },
    {
      title: 'next to — яг хажууд',
      description: 'Хоёр зүйл хоорондоо маш ойр, зэрэгцээ байгааг хэлнэ. next to бол хоёр үгтэй нэг угтвар үг — to-г орхиж болохгүй.',
      examples: [
        { en: '[The bank](s) [is](v) [next to the café](m).', mn: 'Банк кафены яг хажууд байна.' },
        { en: '[Sit](v) [next to me](m).', mn: 'Миний хажууд суу.' },
        {
          en: '[My school](s) [is](v) [next to a park](m).',
          mn: 'Миний сургууль цэцэрлэгт хүрээлэнгийн хажууд байна.',
        },
      ],
    },
    {
      title: 'in / on тээврийн хэрэгсэлтэй',
      description: 'Нэмэлт, түгээмэл хэрэглээ: суугаад л явдаг жижиг тээвэрт in (машин, такси), дотор нь алхаж, зогсож болдог нийтийн тээвэрт on (автобус, галт тэрэг, онгоц).',
      examples: [
        { en: 'in a car · in a taxi', mn: 'машинд · таксинд' },
        { en: 'on a bus · on a train', mn: 'автобусанд · галт тэргэнд' },
        { en: 'on a plane', mn: 'онгоцонд' },
      ],
    },
  ],
  forms: [
    {
      structure: 'Subject + be + preposition + place',
      examples: [
        { en: '[The cup](s) [is](v) [on the table](m).', mn: 'Аяга ширээн дээр байна.' },
        { en: '[The dog](s) [is](v) [under the chair](m).', mn: 'Нохой сандлын доор байна.' },
      ],
      label: 'Байршлын өгүүлбэр',
    },
    {
      structure: 'There is / are + noun + preposition + place',
      examples: [
        { en: '[There](s) [is](v) [a book](o) [on the desk](m).', mn: 'Ширээн дээр ном байна.' },
        { en: '[There](s) [are](v) [shoes](o) [under the bed](m).', mn: 'Орны доор гутал байна.' },
      ],
      label: 'There is / are-тай',
    },
    {
      structure: 'Where + be + subject?',
      examples: [
        {
          en: '[Where](m) [is](v) [my phone](s)? — [It](s)[\'s](v) [in your bag](m).',
          mn: 'Миний утас хаана байна? — Чиний цүнхэнд байгаа.',
        },
        {
          en: '[Where](m) [are](v) [the keys](s)? — [They](s)[\'re](v) [on the table](m).',
          mn: 'Түлхүүр хаана байна? — Ширээн дээр байгаа.',
        },
      ],
      label: 'Асуух',
    },
  ],
  signalWords: ['Where …?', 'in', 'on', 'under', 'next to'],
  notes: [
    'Энэ дүрэмд in / on-ы зөвхөн байршлын утгыг үзэж байна. Цаг хугацааны in / on (in May, on Monday) бол тусдаа хэрэглээ.',
    'next to ≈ beside. Хоёулаа «хажууд» гэсэн утгатай: «The bank is beside the café» ч зөв.',
    'on the wall = хананы гадаргуу дээр өлгөөтэй, наасан. in the wall гэвэл хананы дотор (жишээ нь цахилгааны утас) гэсэн өөр утга гарна.',
    'at бол тодорхой цэг, газар заахад маш түгээмэл (at home, at school). Энэ дүрмийн үндсэн жагсаалтад ороогүй ч дараа заавал таарна.',
    'Угтвар үгийн дараа нэр үг ихэвчлэн the, a, my гэх мэт үгтэй ирнэ: on the table, in my bag. Хоосон «on table» гэж хэлдэггүй.',
    'Угтвар үгтэй бүлэг (on the table) өгүүлбэрт нөхцөл болж, be-ийн ард орно: The phone is on the table.',
  ],
  commonMistakes: [
    {
      wrong: 'The book is in the table.',
      correct: 'The book is on the table.',
      explanation: 'Ном ширээний гадаргуу дээр байгаа тул on. in гэвэл ширээний дотор гэсэн утгатай болно.',
    },
    {
      wrong: 'The cat is next the chair.',
      correct: 'The cat is next to the chair.',
      explanation: 'Угтвар үг нь бүтнээрээ next to. to-г орхивол буруу.',
    },
    {
      wrong: 'I am on a car.',
      correct: 'I am in a car.',
      explanation: 'Машин, таксинд in хэрэглэнэ. on нь автобус, галт тэрэг, онгоц зэрэг нийтийн тээвэрт.',
    },
    {
      wrong: 'The phone is the table on.',
      correct: 'The phone is on the table.',
      explanation: 'Монголоор «ширээн дээр» гэж «дээр» ард ордог ч англиар угтвар үг нэр үгийнхээ өмнө ирнэ.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор байршлыг нэр үгийн АРД хэлдэг: «ширээн дээр», «сандлын доор», «кафены хажууд». Англиар харин угтвар үг нэр үгийн ӨМНӨ орно: on the table, under the chair, next to the café. Дараалал яг эсрэгээ.',
      'Монгол хэлний «-д/-т» нэг нөхцөл in, on хоёрын аль алиных нь үүргийг гүйцэтгэдэг: «цүнхэнд» (дотор) → in my bag, «хананд» (гадаргуу дээр) → on the wall. Англиар дотор уу, гадаргуу дээр үү гэдгийг заавал ялгана.',
      'Монголоор «Утас ширээн дээр байна» гэхэд «байна» сүүлд ордог. Англиар be эзэний яг ард, байршил хамгийн сүүлд: The phone is on the table. Эзэн → be → байршил гэсэн дарааллыг санаарай.',
      'Монголоор «машинд», «автобусанд» хоёулаа «-д». Англиар машинд in, автобусанд on гэдгийг тусад нь цээжлээрэй.',
    ],
  },
  dialogue: [
    { en: '[Where](m) [are](v) [my keys](s)?', mn: 'Миний түлхүүр хаана байна?', speaker: 'Saraa' },
    { en: '[Are](v) [they](s) [in your bag](m)?', mn: 'Чиний цүнхэнд байна уу?', speaker: 'Bat' },
    {
      en: '[No](o). [My bag](s) [is](v) [on the chair](m), but [the keys](s) [aren\'t](v) [in it](m).',
      mn: 'Үгүй. Цүнх маань сандал дээр байгаа, гэхдээ түлхүүр дотор нь алга.',
      speaker: 'Saraa',
    },
    { en: '[Look](v) [under the table](m).', mn: 'Ширээний доор хараач.', speaker: 'Bat' },
    {
      en: '[Oh](o)! [They](s)[\'re](v) [next to the cat](m).',
      mn: 'Өө! Муурны хажууд байна.',
      speaker: 'Saraa',
    },
    {
      en: '[The cat](s) [is](v) [under the table](m) [again](m)!',
      mn: 'Муур дахиад л ширээний доор байна!',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: '13-1',
      explanation: 'Байршил хэлэхэд be-ийн ард угтвар үг орно: under the table = ширээний доор. does, have, are бол үйл үг — is-ийн ард шууд орж чадахгүй.',
      ruleId: 13,
      kind: 'fill',
      question: 'The cat is ___ the table.',
      options: ['under', 'does', 'have', 'are'],
      answer: 'under',
      hint: 'be-ийн ард байршил заах үг хэрэгтэй.',
    },
    {
      id: '13-2',
      explanation: 'Зураг хананы гадаргуу дээр өлгөөтэй тул on. in the wall гэвэл хананы дотор, under буруу утга, next бол to-гүй учраас дутуу.',
      ruleId: 13,
      kind: 'fill',
      question: 'There is a picture ___ the wall.',
      options: ['on', 'in', 'under', 'next'],
      answer: 'on',
      hint: 'Хана бол гадаргуу.',
    },
    {
      id: '13-3',
      explanation: 'next to бүтнээрээ нэг угтвар үг, нэр үгийнхээ өмнө орно. to-г орхих, угтвар үгийг ард нь тавих, be-г орхих гурвуулаа буруу.',
      ruleId: 13,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'The bank is next the café.',
        'The bank is next to the café.',
        'The bank is the café next to.',
        'The bank next to the café.',
      ],
      answer: 'The bank is next to the café.',
      hint: 'Угтвар үг хоёр үгтэй, нэр үгийн өмнө.',
    },
    {
      id: '13-4',
      explanation: 'Цүнхэн дотор тул in. on гэвэл цүнхэн дээр. Угтвар үг нэр үгийн ард орохгүй, be (are) орхиж болохгүй.',
      ruleId: 13,
      kind: 'translate',
      question: 'Түлхүүр миний цүнхэнд байна.',
      options: [
        'The keys are on my bag.',
        'The keys are my bag in.',
        'The keys in my bag.',
        'The keys are in my bag.',
      ],
      answer: 'The keys are in my bag.',
      hint: 'Монгол хэлний «-д» энд «дотор» гэсэн утгатай.',
    },
  ],
};
