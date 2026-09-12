// frontend/src/lib/grammar/a1/rule-02.ts
// A1 дүрэм 2: I / you / he / she / it / we / they
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule02: GrammarRule = {
  id: 2,
  title: 'I / you / he / she / it / we / they',
  titleMn: 'Эзэн төлөөний үгс',
  hook: '«Том ирлээ. Том ядарсан. Том унтлаа» — нэг нэрийг дахин давтах уу? Англиар he гээд орлуулчихна.',
  summary: 'I, you, he, she, it, we, they бол эзэн төлөөний үгс. Нэр үгийг давтахгүйн тулд орлуулж, үйл үгийн өмнө тавина: «Tom is 12. He is a student.»',
  description: 'I, you, he, she, it, we, they нь өгүүлбэрийн эзэн болдог төлөөний үгс (subject pronoun — эзэн төлөөний үг). Үйлдлийг хэн эсвэл юу хийж байгааг заана. Гол үүрэг нь нэр үгийг давтахгүй орлуулах: Tom гэж нэг удаа хэлсний дараа he гэнэ, Anna-г she гэнэ, ном, нохой, цаг агаарыг it гэнэ. Хэн ярьж байгаагаас хамаарч I (өөрөө), you (сонсогч), we (би болон бусад), they (олон хүн, юм) гэж сонгоно. Эдгээр долоон үгийг сайн мэдвэл англи өгүүлбэр бүрийн эхлэлийг зөв тавьж чадна.',
  structure: 'Subject pronoun + verb',
  structureParts: [
    { text: 'Subject pronoun', part: 'subject' },
    { text: 'verb', part: 'verb' },
  ],
  tip: 'Tom → he · Anna → she · the dog → it · Tom & Anna → they · би → I (үргэлж том үсгээр)',
  examples: [
    {
      en: '[Tom](s) [is](v) [12](o). [He](s) [is](v) [a student](o).',
      mn: 'Том 12 настай. Тэр сурагч.',
    },
    {
      en: '[Anna](s) [is](v) [here](m). [She](s) [is](v) [my friend](o).',
      mn: 'Анна энд байна. Тэр миний найз.',
    },
    {
      en: '[My parents](s) [are](v) [home](m). [They](s) [are](v) [tired](o).',
      mn: 'Аав ээж маань гэртээ байна. Тэд ядарсан байна.',
    },
    { en: '[It](s) [is](v) [cold](o) [today](m).', mn: 'Өнөөдөр хүйтэн байна.' },
  ],
  useCases: [
    {
      title: 'Өөрийгөө хэлэх — I',
      description: 'Ярьж байгаа хүн өөрийгөө I гэнэ. I үргэлж том үсгээр бичнэ — өгүүлбэрийн эхэнд ч, дунд ч.',
      examples: [
        { en: '[I](s) [am](v) [Mongolian](o).', mn: 'Би монгол хүн.' },
        { en: '[I](s) [like](v) [music](o).', mn: 'Би хөгжимд дуртай.' },
        { en: '[I](s) [have](v) [a sister](o).', mn: 'Би эгчтэй.' },
      ],
    },
    {
      title: 'Сонсож байгаа хүнийг хэлэх — you',
      description: 'Сонсогчийг you гэнэ. Нэг хүн ч, олон хүн ч байсан you — үг өөрчлөгдөхгүй. Үйл үг нь үргэлж олон тооны хэлбэртэй байна: you are.',
      examples: [
        { en: '[You](s) [are](v) [my friend](o).', mn: 'Чи миний найз.' },
        { en: '[You](s) [are](v) all [welcome](o).', mn: 'Та бүхэн тавтай морил.' },
        { en: '[Do](v) [you](s) [understand](v)?', mn: 'Чи ойлгож байна уу?' },
      ],
    },
    {
      title: 'Эрэгтэй, эмэгтэй хүнийг орлуулах — he / she',
      description: 'Эрэгтэй хүнийг he, эмэгтэй хүнийг she гэнэ. Хүний нэрийг нэг удаа хэлээд дараагийн өгүүлбэрт he эсвэл she-ээр орлуулаарай.',
      examples: [
        {
          en: '[Ben](s) [is](v) [my brother](o). [He](s) [is](v) [10](o).',
          mn: 'Бен миний дүү. Тэр 10 настай.',
        },
        {
          en: '[Sara](s) [is](v) [a doctor](o). [She](s) [works](v) [here](m).',
          mn: 'Сара эмч. Тэр энд ажилладаг.',
        },
      ],
    },
    {
      title: 'Юм, амьтан, цаг агаар, цаг — it',
      description: 'Ганц тооны юм, амьтныг it гэнэ. Цаг агаар, цаг хугацааны өгүүлбэр ч it-ээр эхэлнэ. Монголоор «Бороо орж байна» гэхэд эзэн байхгүй ч англиар it заавал хэрэгтэй.',
      examples: [
        {
          en: '[The book](s) [is](v) [new](o). [It](s) [is](v) [expensive](o).',
          mn: 'Ном шинэ. Энэ үнэтэй.',
        },
        { en: '[It](s) [is raining](v).', mn: 'Бороо орж байна.' },
        { en: '[It](s) [is](v) [5 o\'clock](o).', mn: '5 цаг болж байна.' },
      ],
    },
    {
      title: 'Би болон бусад — we',
      description: 'Ярьж байгаа хүн өөрийгөө бусадтай хамт хэлэхдээ we гэнэ: би + чи, би + тэд.',
      examples: [
        { en: '[We](s) [are](v) [classmates](o).', mn: 'Бид ангийнхан.' },
        { en: '[We](s) [live](v) [in Ulaanbaatar](m).', mn: 'Бид Улаанбаатарт амьдардаг.' },
        { en: '[We](s) [study](v) [English](o).', mn: 'Бид англи хэл сурдаг.' },
      ],
    },
    {
      title: 'Олон хүн, олон юм — they',
      description: 'Хоёр ба түүнээс олон хүн, юм, амьтныг they гэнэ. Монголоос ялгаатай нь they хүнд ч, юманд ч адилхан: the shoes → they.',
      examples: [
        {
          en: '[Tom and Anna](s) [are](v) [here](m). [They](s) [are](v) [ready](o).',
          mn: 'Том, Анна хоёр энд байна. Тэд бэлэн.',
        },
        {
          en: '[The shoes](s) [are](v) [new](o). [They](s) [are](v) [black](o).',
          mn: 'Гутал шинэ. Тэдгээр нь хар өнгөтэй.',
        },
      ],
    },
  ],
  forms: [
    {
      structure: 'I am · He/She/It is · You/We/They are',
      examples: [
        { en: '[I](s) [am](v) [ready](o).', mn: 'Би бэлэн.' },
        { en: '[He](s) [is](v) [tall](o).', mn: 'Тэр өндөр.' },
        { en: '[They](s) [are](v) [outside](m).', mn: 'Тэд гадаа байна.' },
      ],
      label: 'be үйл үгтэй',
    },
    {
      structure: 'I/You/We/They + base verb · He/She/It + verb-s',
      examples: [
        { en: '[I](s) [play](v).', mn: 'Би тоглодог.' },
        { en: '[She](s) [plays](v).', mn: 'Тэр тоглодог.' },
        { en: '[They](s) [play](v).', mn: 'Тэд тоглодог.' },
      ],
      label: 'Энгийн одоо цагийн үйл үгтэй',
    },
  ],
  notes: [
    'Эзэн төлөөний үг ихэвчлэн үйл үгийн өмнө байрлана: «She works here». Асуултад туслах үйл үгийн ард орно: «Do you understand?»',
    'You нь ганц, олон тооны аль алинд нь: нэг найздаа ч, бүхэл ангидаа ч «You are welcome» гэнэ. Үйл үг нь үргэлж are — «You is» гэж хэлэхгүй.',
    'It-ийг хүнд хэрэглэхгүй. Хүн бол he эсвэл she. It — юм, амьтан, цаг агаар, цаг хугацаа.',
    'I үргэлж том үсгээр. Өгүүлбэрийн дунд ч гэсэн: «Anna and I are friends».',
    'Нэрийг нэг удаа хэлээд, дараагийн өгүүлбэрт төлөөний үгээр орлуулаарай. Нэрийг давтвал англиар хэт хатуу сонсогдоно.',
    'Нэмэлт: орчин үеийн англи хэлэнд хүйс нь мэдэгдэхгүй нэг хүнийг they гэж хэлж болно (singular they): «Someone left their phone. They may come back.»',
  ],
  commonMistakes: [
    {
      wrong: 'Tom is my friend. Tom is 12.',
      correct: 'Tom is my friend. He is 12.',
      explanation: 'Нэг нэрийг дараалан давтахгүй. Хоёр дахь удаад төлөөний үг хэрэглэвэл байгалийн сонсогдоно. Tom — эрэгтэй тул he.',
    },
    {
      wrong: 'My parents is home. He is tired.',
      correct: 'My parents are home. They are tired.',
      explanation: 'Parents олон тоо. Тиймээс үйл үг нь are, төлөөний үг нь they. He зөвхөн нэг эрэгтэй хүнд.',
    },
    {
      wrong: 'i am ready.',
      correct: 'I am ready.',
      explanation: 'I төлөөний үг өгүүлбэрийн хаана ч байсан том үсгээр бичнэ. Жижиг i англиар алдаа.',
    },
    {
      wrong: 'My teacher is here. It is kind.',
      correct: 'My teacher is here. She is kind.',
      explanation: 'Хүнийг it гэж хэлэхгүй. Багш эмэгтэй бол she, эрэгтэй бол he.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «тэр» гэдэг нэг үг эрэгтэй, эмэгтэй, юмыг бүгдийг заана. Англиар заавал сонгоно: эрэгтэй → he, эмэгтэй → she, юм/амьтан → it. «Тэр эмч» гэхэд эмч нь хэн бэ гэдгээ бодоод байж he/she гэнэ.',
      'Монголоор эзнийг орхиж болно: «Ядарсан байна», «Бороо орж байна». Англиар эзэн заавал: «I am tired», «It is raining». «Am tired», «Is raining» гэж эхэлбэл буруу.',
      'Монголд «чи», «та», «та нар» гэж ялгадаг бол англиар бүгд you. Хүндэтгэлийн тусгай хэлбэр байхгүй — багшдаа ч, найздаа ч you гэнэ.',
      'Монголоор «тэд» голдуу хүнд, харин юманд «тэдгээр» эсвэл нэрийг давтдаг. Англиар they хүнд ч, юманд ч адилхан: «The shoes are new. They are black.»',
    ],
  },
  dialogue: [
    { en: '[Who](s) [is](v) [that girl](o)?', mn: 'Тэр охин хэн бэ?', speaker: 'Bat' },
    {
      en: '[She](s) [is](v) [Nomin](o). [She](s) [is](v) [new](o).',
      mn: 'Тэр Номин. Шинэ ирсэн.',
      speaker: 'Saraa',
    },
    { en: '[Is](v) [he](s) [her brother](o)?', mn: 'Тэр хүү ах нь юм уу?', speaker: 'Bat' },
    {
      en: '[No](o), [he](s) [is](v) [her friend](o). [They](s) [are](v) [from Darkhan](m).',
      mn: 'Үгүй, найз нь. Тэд Дарханаас ирсэн.',
      speaker: 'Saraa',
    },
    {
      en: '[We](s) [are](v) [from Darkhan](m) [too](m)! [I](s) [know](v) [it](o) [well](m).',
      mn: 'Бид ч бас Дарханаас! Би тэр хотыг сайн мэднэ.',
      speaker: 'Bat',
    },
    {
      en: '[Great](o)! [You](s) [can talk](v) [to them](m) [now](m).',
      mn: 'Гоё! Чи одоо тэдэнтэй ярьж болно шүү.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: '2-1',
      explanation: 'Tom эрэгтэй хүний нэр тул he. She — эмэгтэй хүнд, it — юманд, they — олон хүнд.',
      ruleId: 2,
      kind: 'fill',
      question: 'Tom is my friend. ___ is 12 years old.',
      options: ['She', 'He', 'It', 'They'],
      answer: 'He',
      hint: 'Tom хэн бэ — эрэгтэй юү, эмэгтэй юү, юм уу?',
    },
    {
      id: '2-2',
      explanation: 'Shoes олон тоо, юм. Олон юмыг they гэнэ. It зөвхөн ганц юманд, he/she зөвхөн хүнд.',
      ruleId: 2,
      kind: 'fill',
      question: 'The shoes are new. ___ are black.',
      options: ['It', 'He', 'They', 'She'],
      answer: 'They',
      hint: 'Гутал хэд вэ? Үйл үг нь are гэдгийг анзаараарай.',
    },
    {
      id: '2-3',
      explanation: 'Parents олон тоо тул are + they. He нэг эрэгтэйд, is олон тоонд буруу, i жижиг үсгээр бичихгүй.',
      ruleId: 2,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'My parents are home. They are tired.',
        'My parents are home. He is tired.',
        'My parents is home. They is tired.',
        'My parents are home. i am tired.',
      ],
      answer: 'My parents are home. They are tired.',
      hint: 'Аав ээж хоёр хүн — аль төлөөний үг, аль be тохирох вэ?',
    },
    {
      id: '2-4',
      explanation: 'Цаг агаарын өгүүлбэр англиар it-ээр эхэлнэ. Эзэнгүй «Is raining» буруу, he хүнд, «Rain is» бүтэц буруу.',
      ruleId: 2,
      kind: 'translate',
      question: 'Бороо орж байна.',
      options: ['It is raining.', 'Is raining.', 'He is raining.', 'Rain is.'],
      answer: 'It is raining.',
      hint: 'Монголоор эзэн байхгүй ч англиар эзэн хэрэгтэй. Аль үг цаг агаарт тохирох вэ?',
    },
  ],
};
