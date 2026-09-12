// frontend/src/lib/grammar/a1/rule-01.ts
// A1 дүрэм 1: am / is / are
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule01: GrammarRule = {
  id: 1,
  title: 'am / is / are',
  titleMn: 'Байх үйл үг — одоо цаг',
  hook: 'Би хэн бэ? Тэр ямар байна? Тэд хаана байна? — энэ бүгдийг am / is / are холбож өгнө.',
  summary: 'am / is / are бол be (байх) үйл үгийн одоо цагийн гурван хэлбэр. Эзэн хэн болох, ямар байгаа, хаана байгааг холбож хэлнэ: I am · he/she/it is · you/we/they are.',
  description: 'am / is / are бол «to be» (байх) үйл үгийн одоо цагийн хэлбэрүүд. Энэ үйл үг үйлдэл заадаггүй. Харин эзэн хэн, юу болох, ямар байдалтай байгаа, хаана байгаа гэсэн мэдээллийг эзэнтэй нь холбодог. Монголоор «Би оюутан» гэхэд холбох үг хэрэггүй, харин англиар I болон a student хоёрын хооронд am заавал орно. Аль хэлбэрийг сонгохыг зөвхөн эзэн шийднэ: I → am, he/she/it болон ганц тооны нэр үг → is, you/we/they болон олон тооны нэр үг → are. Энэ бол англи хэлний хамгийн их хэрэглэдэг үйл үг тул эхлээд үүнийг сайн эзэмшээрэй.',
  structure: 'Subject + am / is / are + complement',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'am / is / are', part: 'verb' },
    { text: 'complement', part: 'object' },
  ],
  tip: 'I → am · He/She/It → is · You/We/They → are. Санах арга: am зөвхөн I-тэй, нэг хүн эсвэл нэг юм бол is, хоёроос дээш бол are.',
  examples: [
    { en: '[I](s) [am](v) [a student](o).', mn: 'Би оюутан.' },
    { en: '[She](s) [is](v) [tired](o).', mn: 'Тэр ядарсан байна.' },
    { en: '[They](s) [are](v) [at school](m).', mn: 'Тэд сургууль дээрээ байна.' },
    { en: '[It](s) [is](v) [cold](o) [today](m).', mn: 'Өнөөдөр хүйтэн байна.' },
  ],
  useCases: [
    {
      title: 'Хэн, юу болохыг хэлэх',
      description: 'Мэргэжил, үүрэг, хамаарал, хэн болохыг танилцуулахад хэрэглэнэ. be-ийн дараа нэр үг орно. Ганц тооны мэргэжлийн өмнө a/an ялгац гишүүн заавал тавина.',
      examples: [
        { en: '[I](s) [am](v) [a student](o).', mn: 'Би оюутан.' },
        { en: '[He](s) [is](v) [my brother](o).', mn: 'Тэр миний ах.' },
        { en: '[They](s) [are](v) [teachers](o).', mn: 'Тэд багш нар.' },
      ],
    },
    {
      title: 'Шинж чанар, байдал хэлэх',
      description: 'be-ийн дараа тэмдэг нэр тавьж хүн, юмсын байдал, шинжийг хэлнэ. Монголоор «… байна» гэж төгсдөг ихэнх өгүүлбэр энд орно.',
      examples: [
        { en: '[She](s) [is](v) [happy](o).', mn: 'Тэр баяртай байна.' },
        { en: '[The room](s) [is](v) [clean](o).', mn: 'Өрөө цэвэрхэн байна.' },
        { en: '[We](s) [are](v) [ready](o).', mn: 'Бид бэлэн байна.' },
      ],
    },
    {
      title: 'Байршил хэлэх',
      description: 'Хүн, юм хаана байгааг хэлэхэд be-ийн дараа газар заасан хэсэг орно: at home, on the table, in my bag. Тусдаа «байх» гэсэн үг нэмэх шаардлагагүй.',
      examples: [
        { en: '[My phone](s) [is](v) [on the table](m).', mn: 'Миний утас ширээн дээр байна.' },
        { en: '[We](s) [are](v) [at home](m).', mn: 'Бид гэртээ байна.' },
        { en: '[The books](s) [are](v) [in my bag](m).', mn: 'Номнууд миний цүнхэнд байна.' },
      ],
    },
    {
      title: 'Нас хэлэх',
      description: 'Англиар насыг have биш be үйл үгээр хэлнэ. Тооны дараах «years old» гэдгийг ярианд орхиж болно: My sister is 8.',
      examples: [
        { en: '[I](s) [am](v) [12 years old](o).', mn: 'Би 12 настай.' },
        { en: '[My sister](s) [is](v) [8](o).', mn: 'Миний дүү 8 настай.' },
        { en: '[They](s) [are](v) [15](o).', mn: 'Тэд 15 настай.' },
      ],
    },
    {
      title: 'Цаг агаар, цаг хугацаа, нөхцөл хэлэх',
      description: 'Цаг агаар, цаг, гараг, ерөнхий нөхцөлийг It is … хэлбэрээр хэлнэ. Энд It бол жинхэнэ «тэр» биш, зүгээр л эзэний байрыг дүүргэж байгаа үг. Монголоор энэ It огт орчуулагдахгүй.',
      examples: [
        { en: '[It](s) [is](v) [cold](o).', mn: 'Хүйтэн байна.' },
        { en: '[It](s) [is](v) [8 o\'clock](o).', mn: '8 цаг болж байна.' },
        { en: '[It](s) [is](v) [Monday](o) [today](m).', mn: 'Өнөөдөр даваа гараг.' },
      ],
    },
  ],
  forms: [
    {
      structure: 'I am · He/She/It is · You/We/They are',
      examples: [
        { en: '[I](s) [am](v) [ready](o).', mn: 'Би бэлэн байна.' },
        { en: '[She](s) [is](v) [at home](m).', mn: 'Тэр гэртээ байна.' },
        { en: '[They](s) [are](v) [busy](o).', mn: 'Тэд завгүй байна.' },
      ],
      label: 'Батлах',
    },
    {
      structure: 'Subject + am not / is not / are not',
      examples: [
        { en: '[I](s) [am not](v) [tired](o).', mn: 'Би ядраагүй байна.' },
        { en: '[He](s) [isn\'t](v) [here](m).', mn: 'Тэр энд байхгүй.' },
        { en: '[We](s) [aren\'t](v) [late](o).', mn: 'Бид хоцроогүй.' },
      ],
      label: 'Үгүйсгэх',
    },
    {
      structure: 'Am / Is / Are + subject + …?',
      examples: [
        { en: '[Are](v) [you](s) [okay](o)?', mn: 'Чи зүгээр үү?' },
        { en: '[Is](v) [she](s) [your sister](o)?', mn: 'Тэр чиний эгч үү?' },
        { en: '[Are](v) [they](s) [at school](m)?', mn: 'Тэд сургууль дээрээ байна уу?' },
      ],
      label: 'Асуух',
    },
    {
      structure: 'Yes, subject + am / is / are. · No, subject + \'m not / isn\'t / aren\'t.',
      examples: [
        { en: '[Yes](o), [I](s) [am](v).', mn: 'Тийм ээ.' },
        { en: '[No](o), [he](s) [isn\'t](v).', mn: 'Үгүй.' },
        { en: '[Yes](o), [they](s) [are](v).', mn: 'Тийм ээ.' },
      ],
      label: 'Богино хариулт',
    },
  ],
  notes: [
    'am зөвхөн I-тэй хэрэглэнэ. Өөр ямар ч эзэнтэй am орохгүй.',
    'is нь he, she, it болон ганц тооны нэр үгтэй хэрэглэнэ: my mother is, the cat is, Bat is.',
    'are нь you, we, they болон олон тооны нэр үгтэй хэрэглэнэ: my parents are, the cats are. you ганц хүнийг заасан ч are авна.',
    'Товчилсон хэлбэр: I\'m, he\'s, she\'s, it\'s, we\'re, you\'re, they\'re; isn\'t, aren\'t. Ярианд товчилсон хэлбэр илүү түгээмэл. am not-ыг товчилдоггүй: I\'m not гэнэ.',
    'Богино хариултын батлах хэлбэрийг товчилдоггүй: «Yes, I am.» зөв, «Yes, I\'m.» буруу. Үгүйсгэх хэлбэрийг товчилж болно: «No, he isn\'t.»',
    'and-аар холбосон хоёр эзэн олон тоо болно: «Bat and Saraa are friends.» Хоёулаа ганц тоо байсан ч is биш, are хэрэглэнэ.',
  ],
  commonMistakes: [
    {
      wrong: 'I is a student.',
      correct: 'I am a student.',
      explanation: 'I-тэй үргэлж am. «I is» гэсэн хослол англи хэлэнд огт байхгүй.',
    },
    {
      wrong: 'She are happy.',
      correct: 'She is happy.',
      explanation: 'She бол гуравдугаар биеийн ганц тоо, тиймээс is. are зөвхөн you, we, they болон олон тоотой.',
    },
    {
      wrong: 'Do you are tired?',
      correct: 'Are you tired?',
      explanation: 'be-ийн асуултад do/does туслах үйл үг хэрэглэхгүй. am/is/are өөрөө эзэнтэйгээ байраа сольж өгүүлбэрийн эхэнд гарна.',
    },
    {
      wrong: 'I student.',
      correct: 'I am a student.',
      explanation: 'Монголоор «Би оюутан» гэхэд холбох үг хэрэггүй, харин англиар am заавал орно. Мөн ганц тооны мэргэжлийн өмнө a/an нэмнэ.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «Би оюутан», «Тэр багш» гэхэд эзэн, тайлбар хоёрын хооронд ямар ч үг ордоггүй. Англиар энэ хоёрыг холбох am / is / are заавал хэрэгтэй: I am a student. Англи өгүүлбэр үйл үггүй байж чадахгүй.',
      'Монголоор «ядарсан байна», «гэртээ байна» гэхэд «байна» өгүүлбэрийн сүүлд ордог. Англиар харин be эзэний яг ард, өгүүлбэрийн дунд орно: She is tired. Дараалал нь яг эсрэгээ гэдгийг санаарай.',
      'Монголоор «Би 12 настай» гэхэд «-тай» нөхцөл эзэмшил заадаг тул олон хүн have гэж бодож «I have 12 years» гэдэг. Англиар нас бол байдал: I am 12 years old.',
      'Монголоор «байна» бүх эзэнд адилхан. Англиар харин эзэн бүр өөрийн хэлбэрийг шаарддаг: I am, he is, they are. Эхлээд эзнээ хараад, дараа нь хэлбэрээ сонгодог дадал хэвшүүлээрэй.',
    ],
  },
  dialogue: [
    {
      en: 'Hi! [Are](v) [you](s) [new](o) [here](m)?',
      mn: 'Сайн уу! Чи энд шинээр ирсэн үү?',
      speaker: 'Bat',
    },
    {
      en: '[Yes](o), [I](s) [am](v). [I](s)[\'m](v) [Saraa](o). [I](s)[\'m](v) [a student](o).',
      mn: 'Тийм ээ. Би Сараа. Би оюутан.',
      speaker: 'Saraa',
    },
    {
      en: '[I](s)[\'m](v) [Bat](o). [Is](v) [this](s) [your bag](o)?',
      mn: 'Би Бат. Энэ чиний цүнх үү?',
      speaker: 'Bat',
    },
    {
      en: '[No](o), [it](s) [isn\'t](v). [My bag](s) [is](v) [at home](m).',
      mn: 'Үгүй. Миний цүнх гэртээ байна.',
      speaker: 'Saraa',
    },
    { en: '[Are](v) [you](s) [tired](o)?', mn: 'Чи ядарсан уу?', speaker: 'Bat' },
    {
      en: '[No](o), [I](s)[\'m not](v). [I](s)[\'m](v) [ready](o)!',
      mn: 'Үгүй, ядраагүй. Би бэлэн!',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: '1-1',
      explanation: 'She бол гуравдугаар биеийн ганц тоо тул is. am зөвхөн I-тэй, are олон тоотой, be бол үндсэн хэлбэр — одоо цагийн өгүүлбэрт шууд орохгүй.',
      ruleId: 1,
      kind: 'fill',
      question: 'She ___ my sister.',
      options: ['am', 'is', 'are', 'be'],
      answer: 'is',
      hint: 'Эзэн нь нэг эмэгтэй хүн — ганц тоо.',
    },
    {
      id: '1-2',
      explanation: 'My parents олон тоо тул are. is ганц тоотой, am зөвхөн I-тэй, be бол үндсэн хэлбэр — энд шууд орохгүй.',
      ruleId: 1,
      kind: 'fill',
      question: 'My parents ___ at work now.',
      options: ['is', 'am', 'are', 'be'],
      answer: 'are',
      hint: 'Эзэн нэг хүн үү, хоёр хүн үү?',
    },
    {
      id: '1-3',
      explanation: 'be-ийн асуултад do хэрэггүй: am/is/are өөрөө өгүүлбэрийн эхэнд гарна. you-тэй үргэлж are, is биш.',
      ruleId: 1,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['Do you are tired?', 'Are you tired?', 'Is you tired?', 'You is tired?'],
      answer: 'Are you tired?',
      hint: 'be өөрөө асуулт үүсгэж чадна.',
    },
    {
      id: '1-4',
      explanation: 'Насыг be-ээр хэлнэ: I am 12 years old. «I have 12 years» бол монголоос шууд хуулсан алдаа. I-тэй is болохгүй, үйл үггүй өгүүлбэр ч болохгүй.',
      ruleId: 1,
      kind: 'translate',
      question: 'Би 12 настай.',
      options: ['I have 12 years.', 'I is 12 years old.', 'I am 12 years old.', 'I 12 years old.'],
      answer: 'I am 12 years old.',
      hint: 'Монгол хэлний «-тай» энд have биш.',
    },
  ],
};
