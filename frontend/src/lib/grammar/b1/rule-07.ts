// frontend/src/lib/grammar/b1/rule-07.ts
// B1 дүрэм 7: Passive voice
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule07: GrammarRule = {
  id: 7,
  title: 'Passive voice',
  titleMn: 'Үйлдэгдэх хэв — хэн хийсэн нь биш, юу болсон нь чухал',
  hook: '«Энэ байшинг 1950 онд барьсан», «Миний утсыг хулгайлчихжээ» — хэн хийснийг мэдэхгүй эсвэл чухал биш үед үйлдлийг өөрийг нь онцолж сурцгаая.',
  summary: 'be + Verb3 (past participle) нь үйлдлийн тусагдахууныг өгүүлбэрийн эзэн болгож, үйлдлийг хэн хийсэн нь бус ЮУ БОЛСОН нь чухал гэдгийг заана. Цаг нь be үйл үгээр илэрхийлэгдэнэ: is made, was made, has been made, will be made. Үйлдэгчийг хэлэх бол by + хүн.',
  description: 'A1, A2-д бид үзсэн бүх өгүүлбэр үйлдэх хэвтэй (active) байсан: эзэн үйлдлийг хийнэ — Bat built this house. Үйлдэгдэх хэвэнд (passive) тусагдахуун эзэн болно: This house was built by Bat. Хэзээ хэрэглэх вэ? Үйлдэгчийг мэдэхгүй (My phone was stolen — хэн хулгайлсныг мэдэхгүй), чухал биш (The road is being repaired — хэн засаж байгаа нь сонин биш), эсвэл ойлгомжтой (He was arrested — цагдаа баривчилсан нь ойлгомжтой) үед. Мөн албан бичиг, мэдээ, шинжлэх ухааны бичвэрт үйлдлийг өөрийг нь онцлохын тулд их хэрэглэдэг. Бүтэц нь be + V3, харин be үйл үг нь цагаа дагана: A1-д үзсэн am/is/are (Present Simple passive), A2-д үзсэн was/were (Past Simple passive), have/has been (Present Perfect passive), will be (Future passive), can be (модаль passive). Тэгэхээр passive нь шинэ цаг биш, харин үзсэн цагуудаа өөр өнцгөөс хэрэглэх арга юм. Монгол хэлэнд «-гд» (баригдсан, хулгайлагдсан) залгавар үйлдэгдэх хэвийг үүсгэдэг ч монголоор ихэвчлэн эзэнгүй өгүүлбэрээр «барьсан», «хулгайлчихжээ» гэж хэлдэг тул англиар passive хэрэглэх газрыг таньж сурах нь чухал.',
  structure: 'Subject (object of action) + be (am / is / was / has been / will be) + Verb3 + (by + agent)',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'be', part: 'verb' },
    { text: 'Verb3', part: 'verb' },
    { text: 'by + agent', part: 'modifier' },
  ],
  tip: 'Active: Хэн + хийсэн + юуг. Passive: Юу + be + V3 (+ by хэн). Цаг нь be-д, утга нь V3-д. Хэн хийснийг мэдэхгүй / чухал биш бол passive.',
  examples: [
    { en: '[This house](s) [was built](v) [in 1950](m).', mn: 'Энэ байшинг 1950 онд барьсан.' },
    { en: '[My phone](s) [was stolen](v) [yesterday](m).', mn: 'Миний утсыг өчигдөр хулгайлчихсан.' },
    { en: '[English](s) [is spoken](v) [all over the world](m).', mn: 'Англи хэлээр дэлхий даяар ярьдаг.' },
    { en: '[The Mona Lisa](s) [was painted](v) [by Leonardo da Vinci](m).', mn: 'Мона Лизаг Леонардо да Винчи зурсан.' },
  ],
  useCases: [
    {
      title: 'Үйлдэгч нь тодорхойгүй эсвэл чухал биш',
      description: 'Хамгийн гол шалтгаан. Хэн хийснийг мэдэхгүй, эсвэл мэдсэн ч хэлэх шаардлагагүй. Ийм үед by … хэсгийг орхино. Мэдээ, тайлан, зарлалд их хэрэглэнэ.',
      examples: [
        { en: '[My bike](s) [was stolen](v) [last night](m).', mn: 'Миний дугуйг өчигдөр шөнө хулгайлчихсан.' },
        { en: '[The road](s) [is being repaired](v).', mn: 'Замыг засаж байна.' },
        { en: '[Thousands of cars](s) [are made](v) [in this factory](m) [every year](m).', mn: 'Энэ үйлдвэрт жил бүр мянга мянган машин үйлдвэрлэдэг.' },
      ],
    },
    {
      title: 'Үйлдэгчийг by-аар нэмж хэлэх',
      description: 'Хэн хийсэн нь чухал, шинэ мэдээлэл байвал өгүүлбэрийн төгсгөлд by + үйлдэгч гэж нэмнэ. Ялангуяа зохиогч, бүтээгч, нээгчийн тухай ярихад.',
      examples: [
        { en: '[Harry Potter](s) [was written](v) [by J.K. Rowling](m).', mn: 'Харри Поттерыг Ж.К. Роулинг бичсэн.' },
        { en: '[The telephone](s) [was invented](v) [by Alexander Graham Bell](m).', mn: 'Утсыг Александр Грахам Белл зохион бүтээсэн.' },
        { en: '[The meeting](s) [will be led](v) [by the new manager](m).', mn: 'Хурлыг шинэ менежер удирдана.' },
      ],
    },
    {
      title: 'Тусагдахууныг онцлох — юу болсон нь чухал',
      description: 'Үйлдэгчийг мэдэж байсан ч ярианы сэдэв нь тусагдахуун бол passive хэрэглэнэ. Өгүүлбэрийн эхэнд юуны тухай ярьж байгаагаа тавина.',
      examples: [
        { en: '[This bridge](s) [was designed](v) [by a Mongolian engineer](m).', mn: 'Энэ гүүрийг монгол инженер зохион байгуулсан. (гүүрийн тухай ярьж байна)' },
        { en: '[The prisoners](s) [were released](v) [this morning](m).', mn: 'Хоригдлуудыг өнөө өглөө суллав.' },
        { en: '[The results](s) [will be announced](v) [tomorrow](m).', mn: 'Дүнг маргааш зарлана.' },
      ],
    },
    {
      title: 'Passive-ийн цагууд — be үйл үг цагаа дагана',
      description: 'Passive нь тусдаа цаг биш. A1-A2-д үзсэн цаг бүр passive хэлбэртэй. Зөвхөн be үйл үг өөрчлөгдөж, V3 хэвээрээ үлдэнэ.',
      examples: [
        { en: '[Rice](s) [is grown](v) [in Asia](m). [The letter](s) [was sent](v) [yesterday](m).', mn: 'Будааг Азид тариалдаг. Захидлыг өчигдөр илгээсэн.' },
        { en: '[The room](s) [has been cleaned](v). [The car](s) [is being washed](v) [now](m).', mn: 'Өрөөг цэвэрлэчихсэн. Машиныг одоо угааж байна.' },
        { en: '[Dinner](s) [will be served](v) [at seven](m). [This](s) [can be done](v) [quickly](m).', mn: 'Оройн хоолыг долоон цагт өгнө. Үүнийг хурдан хийж болно.' },
      ],
    },
    {
      title: 'Active-аас passive руу хөрвүүлэх',
      description: 'Active өгүүлбэрийн тусагдахуун passive-ийн эзэн болно. Үйл үгийг тухайн цагийн be + V3 болгоно. Хуучин эзэн by-тай ард орно эсвэл орхигдоно.',
      examples: [
        { en: '[People](s) [speak](v) [English](o) [here](m). → [English](s) [is spoken](v) [here](m).', mn: 'Энд хүмүүс англиар ярьдаг. → Энд англиар ярьдаг.' },
        { en: '[Someone](s) [broke](v) [the window](o). → [The window](s) [was broken](v).', mn: 'Хэн нэгэн цонх хагалсан. → Цонхыг хагалчихсан.' },
        { en: '[They](s) [have built](v) [a new school](o). → [A new school](s) [has been built](v).', mn: 'Тэд шинэ сургууль барьсан. → Шинэ сургууль баригдсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Present Simple passive',
      structure: 'am / is / are + V3',
      examples: [
        { en: '[Coffee](s) [is grown](v) [in Brazil](m).', mn: 'Кофег Бразилд тариалдаг.' },
        { en: '[These phones](s) [are made](v) [in Korea](m).', mn: 'Эдгээр утсыг Солонгост үйлдвэрлэдэг.' },
        { en: '[The office](s) [is cleaned](v) [every evening](m).', mn: 'Оффисыг орой бүр цэвэрлэдэг.' },
      ],
    },
    {
      label: 'Past Simple passive',
      structure: 'was / were + V3',
      examples: [
        { en: '[The letter](s) [was sent](v) [last week](m).', mn: 'Захидлыг өнгөрсөн долоо хоногт илгээсэн.' },
        { en: '[The thieves](s) [were caught](v) [by the police](m).', mn: 'Хулгайч нарыг цагдаа барьсан.' },
        { en: '[When](m) [was](v) [this temple](s) [built](v)?', mn: 'Энэ сүмийг хэзээ барьсан бэ?' },
      ],
    },
    {
      label: 'Present Perfect / Present Continuous passive',
      structure: 'has / have been + V3 · is / are being + V3',
      examples: [
        { en: '[The report](s) [has been finished](v).', mn: 'Тайланг дуусгачихсан.' },
        { en: '[Two people](s) [have been injured](v) [in the accident](m).', mn: 'Ослоор хоёр хүн бэртсэн.' },
        { en: '[The bridge](s) [is being repaired](v) [at the moment](m).', mn: 'Гүүрийг яг одоо засаж байна.' },
      ],
    },
    {
      label: 'Future / модаль passive ба үгүйсгэл, асуулт',
      structure: 'will be + V3 · can / must / should be + V3 · be + not + V3 · Be + subject + V3?',
      examples: [
        { en: '[The results](s) [will be sent](v) [by email](m).', mn: 'Дүнг имэйлээр илгээнэ.' },
        { en: '[This form](s) [must be signed](v). [Smoking](s) [isn\'t allowed](v) [here](m).', mn: 'Энэ маягтад гарын үсэг зурах ёстой. Энд тамхи татахыг хориглоно.' },
        { en: '[Is](v) [breakfast](s) [included](v) [in the price](m)?', mn: 'Өглөөний цай үнэд багтсан уу?' },
      ],
    },
  ],
  signalWords: ['by', 'is made', 'was built', 'has been', 'will be', 'is being', 'can be', 'made in'],
  notes: [
    'Passive зөвхөн тусагдахуунтай (transitive) үйл үгтэй үүснэ. happen, arrive, sleep, die зэрэг тусагдахуунгүй үйл үг passive хэлбэргүй: The accident was happened (буруу) → The accident happened (зөв).',
    'by + үйлдэгч нь заавал биш. Үйлдэгч тодорхойгүй (someone, people, they) бол орхино. Passive өгүүлбэрийн ихэнх нь by-гүй.',
    'Багаж хэрэгслийг with-ээр заана: The window was broken with a stone (чулуугаар). Үйлдэгчийг by-аар: by a boy (хүүгээр).',
    'be-гийн оронд get хэрэглэвэл илүү ярианы өнгөтэй, гэнэтийн зүйлд: He got hurt. My phone got stolen.',
    'Passive нь мэдээ, шинжлэх ухаан, албан бичигт их хэрэглэгддэг: It is said that …, It was reported that … Энгийн ярианд active илүү байгалийн.',
    'born үргэлж passive: I was born in 1995 (I born гэхгүй). Монголоор «төрсөн» гэж active мэт хэлдэг тул алдаа гардаг.',
  ],
  commonMistakes: [
    {
      wrong: 'This house built in 1950.',
      correct: 'This house was built in 1950.',
      explanation: 'Passive-д be үйл үг заавал байна. Монголоор «барьсан» гэж эзэнгүй хэлдэг тул be-г орхих алдаа гардаг. built дангаараа active Past Simple болж «байшин барьсан» гэсэн утгагүй өгүүлбэр болно.',
    },
    {
      wrong: 'The accident was happened at night.',
      correct: 'The accident happened at night.',
      explanation: 'happen тусагдахуунгүй үйл үг — passive хэлбэргүй. Мөн arrive, die, sleep, come, go зэрэг үйл үгс passive-д ордоггүй.',
    },
    {
      wrong: 'I am born in Ulaanbaatar.',
      correct: 'I was born in Ulaanbaatar.',
      explanation: 'born үргэлж passive бөгөөд төрөх нь өнгөрсөн үйл явдал тул was / were born. am born гэвэл «би одоо төрж байна» гэсэн утга гарна.',
    },
    {
      wrong: 'The letter was written from my teacher.',
      correct: 'The letter was written by my teacher.',
      explanation: 'Үйлдэгчийг by-аар заана, from биш. Монголоор «багшаас бичсэн» гэж хэлж болдог тул from сонгох алдаа гардаг.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор үйлдэгч тодорхойгүй үед эзэнгүй өгүүлбэр хэрэглэдэг: «утсыг минь хулгайлчихсан» (хэн гэж хэлэхгүй). Англиар өгүүлбэр эзэнгүй байж болохгүй тул тусагдахууныг эзэн болгож passive хэрэглэнэ: My phone was stolen.',
      'Монголоор «-гд» залгавар (баригдсан, бичигдсэн) passive үүсгэдэг ч өдөр тутмын ярианд харьцангуй бага хэрэглэдэг, албан бичигт илүү. Англиар passive нь ярианд ч, бичигт ч түгээмэл.',
      'Монголоор «Мона Лизаг Леонардо зурсан» гэхэд Мона Лиза тусагдахуун (-г), Леонардо эзэн. Англиар passive-д Мона Лиза эзэн болж өгүүлбэрийн эхэнд орно. Монгол өгүүлбэрийн «-ыг/-ийг» залгавартай үгийг passive-ийн эзэн болгоод, эзнийг by-тай ард нь тавь гэж бодоорой.',
      'Монголоор «би 1995 онд төрсөн» гэж active хэлбэрээр хэлдэг бол англиар was born гэж заавал passive. Мөн «энэ үнэд багтсан уу» = Is it included? гэх мэт монголоор active мэт сонсогддог олон хэллэг англиар passive байдаг.',
    ],
  },
  dialogue: [
    {
      en: 'Bat, [what](s) [happened](v) [to your bike](m)?',
      mn: 'Бат, дугуй чинь яасан бэ?',
      speaker: 'Saraa',
    },
    {
      en: '[It](s) [was stolen](v) [last night](m). [It](s) [was locked](v) [outside my building](m).',
      mn: 'Өчигдөр шөнө хулгайлчихсан. Манай байрны гадаа цоожтой байсан юм.',
      speaker: 'Bat',
    },
    {
      en: 'That\'s terrible! [Has](v) [the police](s) [been told](v)?',
      mn: 'Ямар аймаар юм бэ! Цагдаад мэдэгдсэн үү?',
      speaker: 'Saraa',
    },
    {
      en: 'Yes. [A report](s) [was made](v) [this morning](m), [but](m) [these bikes](s) [are rarely found](v).',
      mn: 'Тийм. Өнөө өглөө мэдүүлэг өгсөн, гэхдээ ийм дугуйг ховор олдог.',
      speaker: 'Bat',
    },
    {
      en: '[Was](v) [it](s) [insured](v)?',
      mn: 'Даатгалтай байсан уу?',
      speaker: 'Saraa',
    },
    {
      en: 'Luckily, yes. [I](s) [was told](v) [that the money will be paid next week](o).',
      mn: 'Азаар тийм. Мөнгийг ирэх долоо хоногт олгоно гэж надад хэлсэн.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'b1-07-1',
      ruleId: 7,
      kind: 'fill',
      question: 'This temple ___ in the 17th century.',
      options: ['built', 'was built', 'is built', 'has built'],
      answer: 'was built',
      explanation: 'Сүм өөрөө барьдаггүй, баригддаг — passive. 17-р зуун гэсэн өнгөрсөн цаг тул was built. built дангаараа active, is built одоо цаг.',
      hint: 'Хэн барьсан нь чухал биш, өнгөрсөн цаг.',
    },
    {
      id: 'b1-07-2',
      ruleId: 7,
      kind: 'fill',
      question: 'The new road ___ at the moment, so the traffic is terrible.',
      options: ['is repaired', 'is being repaired', 'was repaired', 'repairs'],
      answer: 'is being repaired',
      explanation: 'at the moment — яг одоо үргэлжилж байгаа тул Present Continuous passive: is being repaired. is repaired гэвэл байнга засдаг гэсэн утга.',
      hint: 'Яг одоо болж байгаа passive.',
    },
    {
      id: 'b1-07-3',
      ruleId: 7,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'The accident was happened yesterday.',
        'I am born in 2000.',
        'The letter was written by my grandmother.',
        'This car made in Japan.',
      ],
      answer: 'The letter was written by my grandmother.',
      explanation: 'was + V3 + by + үйлдэгч — зөв passive. happen passive болдоггүй; born өнгөрсөн (was born); made-ийн өмнө be (was made) хэрэгтэй.',
      hint: 'be + V3 бүрэн, тусагдахуунтай үйл үг.',
    },
    {
      id: 'b1-07-4',
      ruleId: 7,
      kind: 'translate',
      question: 'Эдгээр утсыг Хятадад үйлдвэрлэдэг.',
      options: [
        'These phones are made in China.',
        'These phones make in China.',
        'These phones are making in China.',
        'These phones were made in China.',
      ],
      answer: 'These phones are made in China.',
      explanation: '«Үйлдвэрлэдэг» — байнгын үнэн, одоо цаг; утас өөрөө үйлдвэрлэдэггүй тул passive: are made. were made гэвэл өнгөрсөн болно.',
      hint: 'Одоо цагийн passive, байнгын үнэн.',
    },
  ],
};
