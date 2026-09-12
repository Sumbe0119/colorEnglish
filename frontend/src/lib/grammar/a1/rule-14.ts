// frontend/src/lib/grammar/a1/rule-14.ts
// A1 дүрэм 14: What / Where / Who / When / Why / How
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule14: GrammarRule = {
  id: 14,
  title: 'What / Where / Who / When / Why / How',
  titleMn: 'Асуух үгс — WH асуулт',
  hook: '«Тийм/үгүй» гэдэг хариулт хангалтгүй үед юу, хаана, хэн, хэзээ, яагаад, яаж гэж асууна.',
  summary: 'What, Where, Who, When, Why, How гэсэн асуух үгс дэлгэрэнгүй мэдээлэл асууна. Асуух үг үргэлж өгүүлбэрийн эхэнд, ард нь be / do-does / can, дараа нь эзэн орно.',
  description: '«Чи оюутан уу?» гэдэгт «тийм» эсвэл «үгүй» гэж хариулна. Харин «Чи хаана амьдардаг вэ?» гэдэгт бодит мэдээлэл хэрэгтэй. Ийм асуултыг WH асуулт (асуух үгтэй асуулт) гэнэ: What юу, Where хаана, Who хэн, When хэзээ, Why яагаад, How яаж/ямар. Асуух үг үргэлж өгүүлбэрийн эхэнд ирнэ. Ард нь юу орох нь үндсэн үйл үгээс шалтгаална: be үйл үг бол am / is / are өөрөө эзний өмнө гарна («Where are you?»), энгийн одоо цагийн үндсэн үйл үг бол туслах үйл үг do / does хэрэгтэй («Where do you live?»), can зэрэг баймж үйл үг бол can өөрөө эзний өмнө гарна («How can I help?»).',
  structure: 'Question word + be / do-does / can + subject + ...?',
  structureParts: [
    { text: 'Question word', part: 'modifier' },
    { text: 'be / do-does / can', part: 'verb' },
    { text: 'subject', part: 'subject' },
    { text: '...?', part: 'plain' },
  ],
  tip: 'What=юу · Where=хаана · Who=хэн · When=хэзээ · Why=яагаад · How=яаж/ямар. Асуух үг эхэнд, дараа нь be / do / can, дараа нь эзэн.',
  examples: [
    { en: '[What](m) [is](v) [your name](s)?', mn: 'Чиний нэр хэн бэ?' },
    { en: '[Where](m) [do](v) [you](s) [live](v)?', mn: 'Чи хаана амьдардаг вэ?' },
    { en: '[Why](m) [is](v) [she](s) [late](o)?', mn: 'Тэр яагаад хоцорсон бэ?' },
    { en: '[How](m) [can](v) [I](s) [help](v)?', mn: 'Би яаж туслах вэ?' },
  ],
  useCases: [
    {
      title: 'What — юу, ямар',
      description: 'Юм, үйлдэл, нэр, төрөл зэрэг өргөн утгатай мэдээлэл асууна. Хамгийн их хэрэглэдэг асуух үг. «What time» гэвэл цагийг асууна.',
      examples: [
        { en: '[What](m) [is](v) [your name](s)?', mn: 'Чиний нэр хэн бэ?' },
        { en: '[What](m) [do](v) [you](s) [want](v)?', mn: 'Чи юу хүсэж байна?' },
        { en: '[What time](m) [is](v) [it](s)?', mn: 'Цаг хэд болж байна?' },
      ],
    },
    {
      title: 'Where — хаана',
      description: 'Байршил, газар, чиглэл асууна. Хариултад ихэвчлэн in / at / on угтвар үгтэй газар орно: in Darkhan, at home.',
      examples: [
        { en: '[Where](m) [are](v) [you](s)?', mn: 'Чи хаана байна?' },
        { en: '[Where](m) [do](v) [you](s) [live](v)?', mn: 'Чи хаана амьдардаг вэ?' },
        { en: '[Where](m) [is](v) [the station](s)?', mn: 'Буудал хаана байдаг вэ?' },
      ],
    },
    {
      title: 'Who — хэн',
      description: 'Хүний талаар асууна. Who өөрөө эзэн болж болно — тэгвэл do / does хэрэггүй: «Who called you?»',
      examples: [
        { en: '[Who](m) [is](v) [she](s)?', mn: 'Тэр хэн бэ?' },
        { en: '[Who](m) [do](v) [you](s) [live](v) [with](m)?', mn: 'Чи хэнтэй хамт амьдардаг вэ?' },
        { en: '[Who](s) [called](v) [you](o)?', mn: 'Чам руу хэн залгасан бэ?' },
      ],
    },
    {
      title: 'When — хэзээ',
      description: 'Цаг хугацаа, өдөр, огноо асууна. Хариултад at 7, on Monday, in May зэрэг цагийн үг орно.',
      examples: [
        { en: '[When](m) [is](v) [your birthday](s)?', mn: 'Чиний төрсөн өдөр хэзээ вэ?' },
        { en: '[When](m) [do](v) [you](s) [study](v)?', mn: 'Чи хэзээ хичээлээ хийдэг вэ?' },
        { en: '[When](m) [does](v) [the shop](s) [open](v)?', mn: 'Дэлгүүр хэзээ нээгддэг вэ?' },
      ],
    },
    {
      title: 'Why — яагаад',
      description: 'Шалтгаан асууна. Хариулт ихэвчлэн because (учир нь) гэж эхэлнэ: «Why are you sad?» — «Because I\'m tired.»',
      examples: [
        { en: '[Why](m) [are](v) [you](s) [sad](o)?', mn: 'Чи яагаад гунигтай байна?' },
        {
          en: '[Why](m) [do](v) [you](s) [study](v) [English](o)?',
          mn: 'Чи яагаад англи хэл сурдаг вэ?',
        },
        { en: '[Why](m) [did](v) [he](s) [leave](v)?', mn: 'Тэр яагаад явчихсан бэ?' },
      ],
    },
    {
      title: 'How — яаж, ямар',
      description: 'Арга, байдал, хэмжээ асууна. «How are you?» бол мэндчилгээ, «How do you go?» бол арга, «How can I…?» бол боломж асууж байна.',
      examples: [
        { en: '[How](m) [are](v) [you](s)?', mn: 'Чи ямар байна? / Сайн уу?' },
        {
          en: '[How](m) [do](v) [you](s) [go](v) [to school](m)?',
          mn: 'Чи сургууль руугаа яаж явдаг вэ?',
        },
        { en: '[How](m) [can](v) [I](s) [open](v) [this](o)?', mn: 'Би үүнийг яаж нээх вэ?' },
      ],
    },
    {
      title: 'How + тэмдэг нэр / дайвар үг',
      description: 'How old (хэдэн настай), how many (хэдэн ширхэг), how much (хэр их, ямар үнэтэй), how often (хэр олон удаа), how long (хэр удаан), how far (хэр хол) — тогтсон хосууд.',
      examples: [
        { en: '[How old](m) [are](v) [you](s)?', mn: 'Чи хэдэн настай вэ?' },
        { en: '[How many books](o) [do](v) [you](s) [have](v)?', mn: 'Чамд хэдэн ном байгаа вэ?' },
        {
          en: '[How often](m) [do](v) [you](s) [exercise](v)?',
          mn: 'Чи хэр олон удаа дасгал хийдэг вэ?',
        },
        { en: '[How far](m) [is](v) [it](s)?', mn: 'Хэр хол вэ?' },
      ],
    },
  ],
  forms: [
    {
      structure: 'WH-word + am / is / are + subject ...?',
      examples: [
        { en: '[Where](m) [are](v) [you](s)?', mn: 'Чи хаана байна?' },
        { en: '[Who](m) [is](v) [she](s)?', mn: 'Тэр хэн бэ?' },
        { en: '[Why](m) [is](v) [he](s) [angry](o)?', mn: 'Тэр яагаад уурласан бэ?' },
      ],
      label: 'be үйл үгтэй',
    },
    {
      structure: 'WH-word + do / does + subject + base verb ...?',
      examples: [
        { en: '[Where](m) [do](v) [you](s) [live](v)?', mn: 'Чи хаана амьдардаг вэ?' },
        { en: '[What](m) [does](v) [she](s) [want](v)?', mn: 'Тэр юу хүсэж байна?' },
        { en: '[When](m) [do](v) [they](s) [start](v)?', mn: 'Тэд хэзээ эхэлдэг вэ?' },
      ],
      label: 'Энгийн одоо цагийн үйл үгтэй',
    },
    {
      structure: 'WH-word + can + subject + base verb ...?',
      examples: [
        { en: '[How](m) [can](v) [I](s) [help](v)?', mn: 'Би яаж туслах вэ?' },
        { en: '[Where](m) [can](v) [we](s) [park](v)?', mn: 'Бид хаана машинаа тавьж болох вэ?' },
      ],
      label: 'Баймж үйл үг can-тэй',
    },
    {
      structure: 'Who + verb (-s) ...?',
      examples: [
        { en: '[Who](s) [lives](v) [here](m)?', mn: 'Энд хэн амьдардаг вэ?' },
        { en: '[Who](s) [knows](v) [the answer](o)?', mn: 'Хариултыг хэн мэдэх вэ?' },
      ],
      label: 'Who эзэн болсон үед',
    },
  ],
  signalWords: ['What', 'Where', 'Who', 'When', 'Why', 'How', 'How many', 'How much', 'How old', 'How often'],
  notes: [
    'Who өөрөө эзэн болсон үед do / does хэрэглэхгүй, үйл үг гуравдугаар биеийн ганц тоогоор -s авна: «Who lives here?» Харин Who тусагдахуун бол do хэрэгтэй: «Who do you live with?»',
    'How many + тоологдох нэр үгийн олон тоо: «How many books do you have?»',
    'How much + үл тоологдох нэр үг эсвэл үнэ: «How much water do you drink?» / «How much is it?»',
    'Why асуултын хариулт ихэвчлэн Because + шалтгаан: «Why are you late?» — «Because the bus was late.»',
    'Асуух үг үргэлж эхэнд. Дараа нь be / do-does / can, дараа нь эзэн — энэ дараалал WH асуултын бүх хэлбэрт хэвээр (зөвхөн Who эзэн болсон үед туслах үйл үг орохгүй).',
    'What is → What\'s, Where is → Where\'s, Who is → Who\'s, How is → How\'s гэж ярианд товчилно: «What\'s your name?»',
  ],
  commonMistakes: [
    {
      wrong: 'Where you live?',
      correct: 'Where do you live?',
      explanation: 'Энгийн одоо цагийн үндсэн үйл үгтэй асуултад туслах үйл үг do / does заавал хэрэгтэй. Монголоор «чи хаана амьдардаг вэ» гэхэд туслах үг байдаггүй тул хамгийн түгээмэл алдаа.',
    },
    {
      wrong: 'Where do you are?',
      correct: 'Where are you?',
      explanation: 'be үйл үг (am / is / are) байвал do / does хэрэглэхгүй. be өөрөө эзний өмнө гарна.',
    },
    {
      wrong: 'How many money do you have?',
      correct: 'How much money do you have?',
      explanation: 'money бол үл тоологдох нэр үг. Тоологдохгүй юмыг how much гэж асууна; how many зөвхөн тоологдох олон тоотой: how many coins.',
    },
    {
      wrong: 'Where is live your sister?',
      correct: 'Where does your sister live?',
      explanation: 'is болон live хоёрыг нэг асуултад хамт хэрэглэхгүй. Үндсэн үйл үг live тул does + эзэн + live гэсэн дараалал болно.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор асуух үг өгүүлбэрийн дунд, ердийн байрандаа үлддэг: «Чи хаана амьдардаг вэ?» Англиар асуух үг заавал хамгийн эхэнд гарна: «Where do you live?» Асуух үгийг эхэнд тавихаа мартах нь түгээмэл.',
      'Монголоор асуултыг төгсгөлийн «вэ / бэ» бүтээнэ. Англиар ийм үг байхгүй. Оронд нь be / can эзний өмнө гарна, эсвэл do / does нэмэгдэнэ: «Where are you?», «Where do you live?»',
      'Монголоор «хэдэн» гэсэн нэг үг бүх юманд таарна. Англиар тоологдох юманд how many (how many books), тоологдохгүй юманд how much (how much water) гэж хоёр ялгаатай.',
      '«How are you?» гэдгийг «Чи яаж байна?» гэж шууд орчуулахгүй. Энэ бол «Сайн уу? Юу байна?» гэсэн мэндчилгээ. Хариулт нь «I\'m fine, thanks.»',
    ],
  },
  dialogue: [
    {
      en: '[Where](m) [do](v) [you](s) [live](v), Saraa?',
      mn: 'Сараа, чи хаана амьдардаг вэ?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [live](v) [in Darkhan](m). [Why](m) [do](v) [you](s) [ask](v)?',
      mn: 'Би Дарханд амьдардаг. Яагаад асууж байна?',
      speaker: 'Saraa',
    },
    {
      en: '[My brother](s) [lives](v) [there](m) [too](m). [When](m) [do](v) [you](s) [go](v) [home](m)?',
      mn: 'Миний ах бас тэнд амьдардаг. Чи хэзээ гэртээ харьдаг вэ?',
      speaker: 'Bat',
    },
    {
      en: '[On Friday](m). [How](m) [can](v) [I](s) [find](v) [him](o)?',
      mn: 'Баасан гарагт. Би түүнийг яаж олох вэ?',
      speaker: 'Saraa',
    },
    {
      en: '[He](s) [works](v) [at the bank](m). [What](m) [is](v) [your phone number](s)?',
      mn: 'Тэр банкинд ажилладаг. Чиний утасны дугаар хэд вэ?',
      speaker: 'Bat',
    },
    { en: '[It](s)[\'s](v) [9911-2233](o).', mn: '9911-2233.', speaker: 'Saraa' },
  ],
  quiz: [
    {
      id: '14-1',
      explanation: 'live (амьдрах) үйл үгтэй хамт байршил асууж байна, тиймээс Where (хаана). Who хүн, When цаг, What юм асууна.',
      ruleId: 14,
      kind: 'fill',
      question: '___ do you live?',
      options: ['Who', 'Where', 'When', 'What'],
      answer: 'Where',
      hint: 'Хариулт нь «In Darkhan.» гэсэн газар байх болно.',
    },
    {
      id: '14-2',
      explanation: 'water бол үл тоологдох нэр үг, тиймээс how much. how many зөвхөн тоологдох олон тоотой (how many cups). how old нас, how often давтамж асууна.',
      ruleId: 14,
      kind: 'fill',
      question: 'How ___ water do you drink every day?',
      options: ['much', 'many', 'old', 'often'],
      answer: 'much',
      hint: 'Усыг ширхэгээр тоолж болох уу?',
    },
    {
      id: '14-3',
      explanation: 'Асуух үг + do + эзэн + үндсэн үйл үг. «Where you work?» гэдэгт do дутуу, «Where do you are work?» гэдэгт are илүү, сүүлийнх нь монгол дараалал.',
      ruleId: 14,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['Where you work?', 'Where do you work?', 'Where do you are work?', 'You work where do?'],
      answer: 'Where do you work?',
      hint: 'Асуух үг эхэнд, дараа нь туслах үйл үг, дараа нь эзэн.',
    },
    {
      id: '14-4',
      explanation: 'late бол тэмдэг нэр, үйл үг нь be. Тиймээс Why + is + she. «Why she is late?» гэдэгт is эзний өмнө гараагүй, «Why does she late?» гэдэгт үндсэн үйл үг байхгүй атал does хэрэглэсэн.',
      ruleId: 14,
      kind: 'translate',
      question: 'Тэр (эмэгтэй) яагаад хоцорсон бэ?',
      options: ['Why is she late?', 'Why she is late?', 'Why does she late?', 'She is why late?'],
      answer: 'Why is she late?',
      hint: 'Энд үйл үг нь be (is) — do / does хэрэггүй.',
    },
  ],
};
