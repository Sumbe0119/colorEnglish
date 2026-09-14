// frontend/src/lib/grammar/a2/rule-10.ts
// A2 дүрэм 10: Zero conditional
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule10: GrammarRule = {
  id: 10,
  title: 'Zero conditional',
  titleMn: 'Тэг нөхцөл — үргэлж үнэн байдаг зүйл',
  hook: '«Усыг халаавал буцалдаг», «Ядарвал би эрт унтдаг» — хэзээ ч, хэнд ч адилхан үнэн зүйлийг хэлэх нөхцөлт өгүүлбэр.',
  summary: 'Zero conditional нь If + Present Simple, Present Simple бүтэцтэй. Ерөнхий үнэн, байгалийн хууль, зуршил, заавар хэлэхэд хэрэглэнэ — «if» энд «when» (…-х бүрд) гэсэн утгатай.',
  description: 'Zero conditional (тэг нөхцөл) бол хамгийн энгийн нөхцөлт өгүүлбэр. Нэг зүйл болоход өөр нэг зүйл үргэлж, автоматаар дагаж болдог гэдгийг хэлнэ: If you heat ice, it melts. Энд болох эсэх нь эргэлзээтэй ирээдүй биш, харин байгалийн хууль, шинжлэх ухааны факт, хүний зуршил, дүрэм журам, заавар зэрэг үргэлж үнэн зүйл. Тиймээс хоёр хэсэг нь хоёулаа Present Simple цагтай, will огт орохгүй. if-ийг when-ээр солиход утга бараг өөрчлөгдөхгүй, учир нь «хэрвээ» гэхээсээ илүү «…-х бүрд» гэсэн санаа. Монголоор «…-вал/-бол … -даг/-дэг» гэж хэлдэг бүх өгүүлбэр энд таарна: «Бороо орвол би гэртээ суудаг». Заавар өгөхдөө үндсэн өгүүлбэрт захирах хэлбэр (imperative) ч хэрэглэж болно: If you feel sick, see a doctor.',
  structure: 'If + Present Simple, Present Simple',
  structureParts: [
    { text: 'If + subject + verb (present)', part: 'modifier' },
    { text: ',', part: 'plain' },
    { text: 'subject', part: 'subject' },
    { text: 'verb (present)', part: 'verb' },
  ],
  tip: 'Хоёр тал хоёулаа одоо цаг — «if = when» гэж бодоод will-ийг март. If … -s, … -s: He/She/It дээр хоёр талд нь хоёуланд нь -s!',
  examples: [
    { en: '[If you heat water to 100 degrees](m), [it](s) [boils](v).', mn: 'Усыг 100 хэм хүртэл халаавал буцалдаг.' },
    { en: '[If I am tired](m), [I](s) [go](v) [to bed](m) [early](m).', mn: 'Ядарвал би эрт унтдаг.' },
    { en: '[Plants](s) [die](v) [if they don\'t get water](m).', mn: 'Ургамал ус авахгүй бол үхдэг.' },
    { en: '[If you feel sick](m), [see](v) [a doctor](o).', mn: 'Өвдвөл эмчид үзүүл.' },
  ],
  useCases: [
    {
      title: 'Байгалийн хууль, шинжлэх ухааны факт',
      description: 'Хэзээ ч, хаана ч адилхан үнэн байдаг зүйлийг хэлнэ. Нөхцөл биелэх бүрт үр дүн нь автоматаар гардаг. Энэ бол Zero conditional-ийн хамгийн сонгодог хэрэглээ.',
      examples: [
        { en: '[If you mix red and yellow](m), [you](s) [get](v) [orange](o).', mn: 'Улаан, шарыг холивол улбар шар өнгө гардаг.' },
        { en: '[Ice](s) [melts](v) [if the sun shines on it](m).', mn: 'Мөсөн дээр нар тусвал хайлдаг.' },
        { en: '[If it snows a lot](m), [the roads](s) [become](v) [dangerous](o).', mn: 'Их цас орвол зам аюултай болдог.' },
      ],
    },
    {
      title: 'Зуршил, тогтмол үйлдэл',
      description: 'Тодорхой нөхцөлд хүн үргэлж юу хийдгийг хэлнэ. if энд «…-х бүрд» гэсэн утгатай тул when-ээр сольж болно. Монголоор «…-вал/-бол … -даг/-дэг».',
      examples: [
        { en: '[If I have free time](m), [I](s) [read](v) [books](o).', mn: 'Чөлөөт цаг гарвал би ном уншдаг.' },
        { en: '[My mother](s) [drinks](v) [tea](o) [if she has a headache](m).', mn: 'Миний ээж толгой өвдвөл цай уудаг.' },
        { en: '[If we finish work early](m), [we](s) [go](v) [to the gym](m).', mn: 'Ажлаа эрт дуусгавал бид фитнесст явдаг.' },
      ],
    },
    {
      title: 'Дүрэм журам, заавар',
      description: 'Ажлын байр, сургууль, аппликейшн зэрэгт «ингэвэл ингэдэг» гэсэн дүрмийг хэлнэ. Заавар өгөхдөө үндсэн өгүүлбэрт захирах хэлбэр (imperative) хэрэглэж болно.',
      examples: [
        { en: '[If you press this button](m), [the door](s) [opens](v).', mn: 'Энэ товчийг дарвал хаалга онгойдог.' },
        { en: '[If students are late](m), [the teacher](s) [marks](v) [them absent](o).', mn: 'Сурагчид хоцорвол багш тэднийг тасалсанд тооцдог.' },
        { en: '[If you don\'t understand](m), [ask](v) [me](o).', mn: 'Ойлгохгүй бол надаас асуу.' },
      ],
    },
    {
      title: 'if = when: хоёр үг нэг утга',
      description: 'Zero conditional-д if болон when бараг адилхан. «If you heat ice» гэдэг нь «хэрвээ» гэхээсээ илүү «халаах бүрдээ» гэсэн үг. Тиймээс when-тэй өгүүлбэр ч мөн энэ бүтцээр байдаг.',
      examples: [
        { en: '[When it rains](m), [the streets](s) [get](v) [wet](o).', mn: 'Бороо орох бүрд гудамж норно.' },
        { en: '[If it rains](m), [the streets](s) [get](v) [wet](o).', mn: 'Бороо орвол гудамж нордог.' },
        { en: '[When I wake up](m), [I](s) [check](v) [my phone](o).', mn: 'Сэрэх бүрдээ би утсаа шалгадаг.' },
      ],
    },
  ],
  forms: [
    {
      structure: 'If + subject + verb, subject + verb',
      examples: [
        { en: '[If babies are hungry](m), [they](s) [cry](v).', mn: 'Нялх хүүхэд өлсвөл уйлдаг.' },
        { en: '[If you eat too much](m), [you](s) [feel](v) [sick](o).', mn: 'Хэт их идвэл дотор муухайрдаг.' },
        { en: '[If the phone rings](m), [my dog](s) [barks](v).', mn: 'Утас дуугарвал миний нохой хуцдаг.' },
      ],
      label: 'Батлах',
    },
    {
      structure: 'If + subject + don\'t / doesn\'t + verb, … · …, subject + don\'t / doesn\'t + verb',
      examples: [
        { en: '[If I don\'t drink coffee](m), [I](s) [feel](v) [sleepy](o).', mn: 'Кофе уухгүй бол би нойрмоглодог.' },
        { en: '[If she doesn\'t sleep well](m), [she](s) [doesn\'t work](v) [well](m).', mn: 'Тэр сайн унтахгүй бол сайн ажиллаж чаддаггүй.' },
        { en: '[The plant](s) [doesn\'t grow](v) [if it doesn\'t get light](m).', mn: 'Ургамал гэрэл авахгүй бол ургадаггүй.' },
      ],
      label: 'Үгүйсгэх',
    },
    {
      structure: 'What / Where + do / does + subject + verb + if …?',
      examples: [
        { en: '[What](o) [do](v) [you](s) [do](v) [if you can\'t sleep](m)?', mn: 'Унтаж чадахгүй бол чи юу хийдэг вэ?' },
        { en: '[Where](m) [does](v) [he](s) [go](v) [if the library is closed](m)?', mn: 'Номын сан хаалттай бол тэр хаашаа явдаг вэ?' },
        { en: '[Does](v) [ice](s) [melt](v) [if you put it in the sun](m)?', mn: 'Мөсийг наранд тавивал хайлдаг уу?' },
      ],
      label: 'Асуух',
    },
    {
      structure: 'If + subject + verb, + imperative (захирах хэлбэр)',
      examples: [
        { en: '[If you see Bat](m), [say](v) [hello](o) [to him](m).', mn: 'Батыг харвал түүнд мэнд хүргээрэй.' },
        { en: '[If the light is red](m), [stop](v).', mn: 'Гэрэл улаан бол зогс.' },
        { en: '[If you have a question](m), [raise](v) [your hand](o).', mn: 'Асуулт байвал гараа өргө.' },
      ],
      label: 'Зааварт',
    },
  ],
  signalWords: ['if', 'when', 'whenever', 'every time', 'unless', 'always', 'usually'],
  notes: [
    'If-тэй хэсэг өгүүлбэрийн эхэнд орвол таслал тавина: If it rains, I stay home. Ард нь орвол таслал хэрэггүй: I stay home if it rains.',
    'Хоёр талд хоёуланд нь Present Simple — will хэзээ ч орохгүй. Тиймээс He/She/It дээр хоёр талын үйл үг хоёулаа -s авна: If she eats fish, she gets sick.',
    'Zero conditional-д if-ийг when, whenever (…-х бүрд), every time-аар сольж болно, утга нь хадгалагдана.',
    'Үндсэн өгүүлбэрт захирах хэлбэр (imperative) хэрэглэж болно: If you feel sick, see a doctor. Энэ хэлбэр заавар, зөвлөгөөнд их тохиромжтой.',
    'unless = if … not: Unless you water plants, they die. = If you don\'t water plants, they die. unless-ийн ард үгүйсгэл давхар тавихгүй.',
    'Zero conditional нь First conditional-оос ялгаатай: тэг нөхцөл «үргэлж ингэдэг» (факт), нэгдүгээр нөхцөл «ингэвэл ингэнэ» (нэг удаагийн ирээдүй). Дараагийн дүрэмд үзнэ.',
  ],
  commonMistakes: [
    {
      wrong: 'If you heat ice, it will melt. (ерөнхий үнэн гэсэн утгаар)',
      correct: 'If you heat ice, it melts.',
      explanation: 'Байгалийн хууль, үргэлж үнэн зүйлийг хэлэхэд will хэрэггүй. Хоёр тал хоёулаа Present Simple. Монголоор «-даг» гэж төгсөж байвал will бүү тавь.',
    },
    {
      wrong: 'If she drink coffee, she doesn\'t sleep.',
      correct: 'If she drinks coffee, she doesn\'t sleep.',
      explanation: 'if-тэй хэсэг ч Present Simple тул He/She/It дээр -s заавал орно. Хоёр тал хоёулаа дүрмээ дагана.',
    },
    {
      wrong: 'If it rains I stay at home.',
      correct: 'If it rains, I stay at home.',
      explanation: 'If-тэй хэсэг эхэнд орвол таслалаар тусгаарлана. Харин «I stay at home if it rains» гэвэл таслал хэрэггүй.',
    },
    {
      wrong: 'Unless you don\'t study, you fail.',
      correct: 'Unless you study, you fail.',
      explanation: 'unless өөрөө «хэрвээ … -гүй бол» гэсэн үгүйсгэлийг агуулж байгаа тул ард нь don\'t давхар тавихгүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор нөхцөлийг үйл үгийн төгсгөлд «-вал/-вэл/-бол/-бэл» залгаж хэлдэг: «халаавал», «орвол». Англиар нөхцөлийг өгүүлбэрийн эхэнд тусдаа if гэсэн үгээр эхлүүлнэ: If you heat…',
      'Монголоор «-вал … -даг» гэдэг нь яг Zero conditional: «Бороо орвол би гэртээ суудаг» = If it rains, I stay at home. «-даг/-дэг» төгсгөл сонсогдвол will хэрэггүй гэдгийг санаарай.',
      'Монголоор нөхцөл заасан хэсэг бараг үргэлж эхэнд ордог. Англиар if-тэй хэсэг эхэнд ч, сүүлд ч орж болно, зөвхөн таслал л өөрчлөгдөнө: I stay at home if it rains.',
      'Монголоор «хэрвээ» гэдэг үгийг ихэвчлэн орхидог, «-вал» л хангалттай. Англиар if-ийг орхиж болохгүй — үүнгүйгээр нөхцөл байхгүй болно.',
    ],
  },
  dialogue: [
    {
      en: '[What](o) [do](v) [you](s) [do](v) [if you have a headache](m)?',
      mn: 'Толгой өвдвөл чи юу хийдэг вэ?',
      speaker: 'Bat',
    },
    {
      en: '[If I have a headache](m), [I](s) [drink](v) [a lot of water](o) [and rest](v).',
      mn: 'Толгой өвдвөл би их ус ууж, амардаг.',
      speaker: 'Saraa',
    },
    {
      en: '[Does](v) [that](s) [help](v)?',
      mn: 'Тэр нь тус болдог уу?',
      speaker: 'Bat',
    },
    {
      en: '[Usually](m), [yes](o). [If it doesn\'t help](m), [I](s) [take](v) [medicine](o).',
      mn: 'Ихэвчлэн тус болдог. Тус болохгүй бол би эм уудаг.',
      speaker: 'Saraa',
    },
    {
      en: '[I](s) [get](v) [a headache](o) [if I look at my phone too long](m).',
      mn: 'Утсаа хэт удаан харвал миний толгой өвддөг.',
      speaker: 'Bat',
    },
    {
      en: '[Then](m) [put](v) [it](o) [away](m) [if your eyes are tired](m)!',
      mn: 'Тэгвэл нүд чинь ядарвал утсаа хойш нь тавь!',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-10-1',
      explanation: 'Байгалийн хууль тул Zero conditional: хоёр тал хоёулаа Present Simple. «freeze» — It дээр -s дутуу, «will freeze» — ерөнхий үнэнд will хэрэггүй, «freezing» — ганцаараа үйл үг болохгүй.',
      ruleId: 10,
      kind: 'fill',
      question: 'If the temperature falls below zero, water ___.',
      options: ['freeze', 'freezes', 'will freeze', 'freezing'],
      answer: 'freezes',
      hint: 'Үргэлж үнэн факт — «-даг» утгатай.',
    },
    {
      id: 'a2-10-2',
      explanation: 'if-тэй хэсэг ч Present Simple: she дээр -s орно. «will eat», «is eat» буруу хэлбэр, «eat» — -s дутуу.',
      ruleId: 10,
      kind: 'fill',
      question: 'If my sister ___ chocolate, she feels happy.',
      options: ['eat', 'eats', 'will eat', 'is eat'],
      answer: 'eats',
      hint: 'my sister = she → ямар төгсгөл вэ?',
    },
    {
      id: 'a2-10-3',
      explanation: 'If-тэй хэсэг эхэнд орвол таслал тавина, хоёр талд Present Simple. «will get» зуршилд хэрэггүй, «gets» — you-тэй -s болохгүй, таслалгүй хувилбар буруу.',
      ruleId: 10,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['If you don\'t sleep enough, you get tired.', 'If you don\'t sleep enough you will get tired.', 'If you don\'t sleep enough, you gets tired.', 'If you doesn\'t sleep enough, you get tired.'],
      answer: 'If you don\'t sleep enough, you get tired.',
      hint: 'Таслал + хоёр талд одоо цаг.',
    },
    {
      id: 'a2-10-4',
      explanation: '«-вал … -даг» = If + Present Simple, Present Simple. «will stay» — зуршилд will хэрэггүй, «rain» — it дээр -s дутуу, «When … will rain» бол хоёр алдаатай.',
      ruleId: 10,
      kind: 'translate',
      question: 'Бороо орвол бид гэртээ суудаг.',
      options: ['If it rains, we will stay at home.', 'If it rain, we stay at home.', 'If it rains, we stay at home.', 'When it will rain, we stay at home.'],
      answer: 'If it rains, we stay at home.',
      hint: '«суудаг» — зуршил, ирээдүй биш.',
    },
  ],
};
