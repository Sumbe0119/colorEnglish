// frontend/src/lib/grammar/a1/rule-03.ts
// A1 дүрэм 3: my / your / his / her / its / our / their
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule03: GrammarRule = {
  id: 3,
  title: 'my / your / his / her / its / our / their',
  titleMn: 'Эзэмшил заах үгс — миний, чиний, түүний',
  hook: '«Энэ хэний юм бэ?» — миний, чиний, түүний гэдгийг англиар яаж хэлэх вэ?',
  summary: 'my, your, his, her, its, our, their нь ямар нэг зүйл хэнийх болохыг заана. Дараа нь заавал нэр үг орно: my book, her bag. Эзэмшигчийг нь харж his / her / its-ийг сонгоно.',
  description: 'my, your, his, her, its, our, their гэдэг үгс ямар нэг зүйл хэнийх болохыг заана. Эдгээрийг эзэмшил заах үг (possessive adjective) гэнэ. Дүрэм нь энгийн: эзэмшил заах үгийн дараа заавал нэр үг ордог — my book, her phone, their car. Эзэн төлөөний үг бүр өөрийн хос үгтэй: I → my, she → her, they → their. Англиар эзэмшлийг монголоос хамаагүй олон хэлдэг: «Гараа угаа» гэхэд ч your hands, «Нэр нь Бат» гэхэд ч his name гэж хэлнэ. Энэ долоон үгийг сайн мэдвэл гэр бүл, найз нөхөд, эд зүйлийнхээ тухай ярих бүрд хэрэг болно.',
  structure: 'Possessive adjective + noun',
  structureParts: [
    { text: 'Possessive adjective', part: 'plain' },
    { text: 'noun', part: 'object' },
  ],
  tip: 'I → my · you → your · he → his · she → her · it → its · we → our · they → their. Эхлээд «эзэмшигч нь хэн бэ?» гэж асуугаад дараа нь үгээ сонгоорой.',
  examples: [
    { en: '[This](s) [is](v) [my book](o).', mn: 'Энэ миний ном.' },
    { en: '[His name](s) [is](v) [Ben](o).', mn: 'Түүний нэр Бен.' },
    { en: '[Their house](s) [is](v) [big](o).', mn: 'Тэдний байшин том.' },
    { en: '[I](s) [like](v) [your bag](o).', mn: 'Чиний цүнх надад таалагдаж байна.' },
  ],
  useCases: [
    {
      title: 'Эзэмшил — хэний юм вэ',
      description: 'Ямар нэг зүйл хэнийх болохыг нэр үгийн өмнө хэлнэ. Монголоор «миний утас» гэдэгтэй яг адил дараалалтай: эхлээд эзэмшигч, дараа нь юм.',
      examples: [
        { en: 'my phone', mn: 'миний утас' },
        { en: 'her bag', mn: 'түүний цүнх' },
        { en: 'their car', mn: 'тэдний машин' },
        { en: '[Their car](s) [is](v) [red](o).', mn: 'Тэдний машин улаан.' },
      ],
    },
    {
      title: 'Гэр бүл, найз нөхөд, харилцаа',
      description: 'Хэн нэгний ээж аав, найз, багш, хамтран ажиллагч гэх мэт хүмүүсийн холбоог хэлэхэд хэрэглэнэ. «Манай багш» гэхэд our teacher гэнэ.',
      examples: [
        { en: 'my mother', mn: 'миний ээж' },
        { en: 'his friend', mn: 'түүний найз' },
        { en: 'our teacher', mn: 'манай багш' },
        { en: '[Our teacher](s) [is](v) [very kind](o).', mn: 'Манай багш их сайхан сэтгэлтэй.' },
      ],
    },
    {
      title: 'Биеийн хэсэг, хувцас, хувийн зүйл',
      description: 'Англиар биеийн хэсэг, хувцас, хувийн зүйлийн өмнө эзэмшил заах үгийг бараг үргэлж тавина. Монголоор «гараа», «нүдээ» гэж нөхцөлөөр хэлдэг бол англиар your, her гэдэг үг заавал орно.',
      examples: [
        { en: '[Wash](v) [your hands](o).', mn: 'Гараа угаа.' },
        { en: '[She](s) [closed](v) [her eyes](o).', mn: 'Тэр нүдээ анилаа.' },
        { en: '[He](s) [put on](v) [his jacket](o).', mn: 'Тэр хүрмээ өмслөө.' },
      ],
    },
    {
      title: 'Юм, амьтан, байгууллагын хамаарал — its',
      description: 'it-ийн эзэмшил заах хэлбэр нь its. Юм, амьтан, байгууллагын юу нь гэдгийг хэлнэ. Апострофгүй бичнэ — it\'s бол огт өөр үг (it is).',
      examples: [
        { en: '[The company](s) [changed](v) [its name](o).', mn: 'Компани нэрээ сольсон.' },
        { en: '[The dog](s) [is eating](v) [its food](o).', mn: 'Нохой хоолоо идэж байна.' },
        { en: '[The bird](s) [is](v) [in its nest](m).', mn: 'Шувуу үүрэндээ байна.' },
      ],
    },
  ],
  forms: [
    {
      structure: 'I→my · you→your · he→his · she→her · it→its · we→our · they→their',
      examples: [
        {
          en: '[I](s) [have](v) [a book](o). [My book](s) [is](v) [new](o).',
          mn: 'Надад ном бий. Миний ном шинэ.',
        },
        {
          en: '[She](s) [has](v) [a bag](o). [Her bag](s) [is](v) [blue](o).',
          mn: 'Түүнд цүнх бий. Түүний цүнх цэнхэр.',
        },
        {
          en: '[They](s) [have](v) [a house](o). [Their house](s) [is](v) [large](o).',
          mn: 'Тэдэнд байшин бий. Тэдний байшин том.',
        },
      ],
      label: 'Төлөөний үг → эзэмшил заах үг',
    },
    {
      structure: 'Possessive adjective + noun — эзэн ч болно, тусагдахуун ч болно',
      examples: [
        { en: '[This](s) [is](v) [her bag](o).', mn: 'Энэ түүний цүнх.' },
        { en: '[Our school](s) [is](v) [nearby](m).', mn: 'Манай сургууль ойрхон.' },
        { en: '[Their children](s) [are](v) [outside](m).', mn: 'Тэдний хүүхдүүд гадаа байна.' },
      ],
      label: 'Өгүүлбэрт',
    },
  ],
  notes: [
    'Эзэмшил заах үгийн дараа заавал нэр үг орно: my book, her phone. Ганцаараа зогсохгүй — «This is my.» гэж хэлж болохгүй.',
    'a/an/the-тэй давхар хэрэглэхгүй: my book гэж хэлнэ, my a book, the my book гэж хэлэхгүй. Нэр үгийн өмнө нэг л тодорхойлогч үг байна.',
    'its = түүний (юм, амьтны). it\'s = it is эсвэл it has гэсэн товчилсон хэлбэр. Апостроф байвал эзэмшил биш гэж санаарай.',
    'your нэг хүнийг ч (чиний, таны), олон хүнийг ч (та нарын, танай) заана. Англиар энэ хоёрыг ялгадаггүй.',
    'his / her / its-ийг эзэмшигчээр нь сонгоно, эзэмшигдэж буй зүйлээр биш: Батын цүнх → his bag, Сарнайн ном → her book, нохойн хоол → its food.',
    'Эзэмшил заах үг өөрөө хувирдаггүй. Нэр үг олон тоонд орсон ч my books, their cars гэнэ — my, their-т -s нэмэхгүй.',
  ],
  commonMistakes: [
    {
      wrong: 'She book is blue.',
      correct: 'Her book is blue.',
      explanation: 'She бол эзэн төлөөний үг, юм эзэмшихийг заадаггүй. Нэр үгийн өмнө эзэмшил заах үг her хэрэгтэй.',
    },
    {
      wrong: 'This is my a phone.',
      correct: 'This is my phone.',
      explanation: 'Эзэмшил заах үг өөрөө тодорхойлогч. Тиймээс a/an/the-г давхар тавихгүй — my-ийн дараа шууд нэр үг.',
    },
    {
      wrong: 'The dog hurt it\'s leg.',
      correct: 'The dog hurt its leg.',
      explanation: 'its бол эзэмшил заах үг, апострофгүй. it\'s бол it is / it has гэсэн товчилсон хэлбэр — энд утга таарахгүй.',
    },
    {
      wrong: 'Bat has a car. Her car is red.',
      correct: 'Bat has a car. His car is red.',
      explanation: 'Бат эрэгтэй тул his. Монголоор хоёулаа «түүний» боловч англиар эзэмшигчийн хүйсээр his / her-ийг сонгоно.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «түүний» гэдэг нэг үг эрэгтэй, эмэгтэй, юм бүгдэд таарна. Англиар эзэмшигчийн хүйсээр гурав салгана: Бат → his, Сарнай → her, нохой, машин → its. Эхлээд «эзэмшигч нь хэн бэ?» гэж бодоорой.',
      'Монголоор «гараа угаа», «нүдээ ань» гэж -аа/-ээ нөхцөлөөр эзэмшлийг заадаг. Англиар ийм нөхцөл байхгүй тул үгээр нь хэлнэ: Wash your hands. Close your eyes. «Wash hands» гэвэл дутуу сонсогдоно.',
      'Монголоор «нэр нь Бат», «ном нь» гэж «нь» гэдэг үгийг нэр үгийн АРД тавьдаг. Англиар эзэмшил заах үг үргэлж нэр үгийн ӨМНӨ орно: His name is Bat. Ард нь юу ч залгахгүй.',
      'Монголоор «чиний», «таны», «та нарын», «танай» гэж дөрвөн өөр үг байхад англиар бүгд your. Мөн «манай», «бидний» хоёулаа our — англиар нэг л үг.',
    ],
  },
  dialogue: [
    { en: '[Is](v) [this](s) [your family](o)?', mn: 'Энэ чиний гэр бүл үү?', speaker: 'Bat' },
    {
      en: '[Yes](o). [This](s) [is](v) [my mother](o), and [this](s) [is](v) [my father](o).',
      mn: 'Тийм ээ. Энэ миний ээж, энэ миний аав.',
      speaker: 'Saraa',
    },
    {
      en: '[Who](s) [is](v) [the boy](o)? [Is](v) [he](s) [your brother](o)?',
      mn: 'Энэ хүү хэн бэ? Чиний дүү юу?',
      speaker: 'Bat',
    },
    {
      en: '[Yes](o). [His name](s) [is](v) [Tulga](o). And [these](s) [are](v) [my grandparents](o). [Their house](s) [is](v) [in Darkhan](m).',
      mn: 'Тийм ээ. Нэр нь Тулга. Харин энэ өвөө, эмээ маань. Тэдний гэр Дарханд байдаг.',
      speaker: 'Saraa',
    },
    {
      en: 'And [that](s)[\'s](v) [your dog](o), right? [Its ears](s) [are](v) [very big](o)!',
      mn: 'Харин тэр чиний нохой биз дээ? Чих нь ямар том юм бэ!',
      speaker: 'Bat',
    },
    {
      en: '[Yes](o)! [Its name](s) [is](v) [Bankhar](o). [We](s) [love](v) [our dog](o).',
      mn: 'Тийм ээ! Нэр нь Банхар. Бид нохойгоо их хайрладаг.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: '3-1',
      explanation: 'Sarah эмэгтэй → she. She-ийн эзэмшил заах хэлбэр нь her. His эрэгтэй эзэмшигч, my өөрийн, their олон хүний эзэмшлийг заана.',
      ruleId: 3,
      kind: 'fill',
      question: 'Sarah has a bag. ___ bag is blue.',
      options: ['His', 'Her', 'My', 'Their'],
      answer: 'Her',
      hint: 'Эзэмшигч нь хэн бэ? Sarah → she → ?',
    },
    {
      id: '3-2',
      explanation: 'Муур — амьтан, it. It-ийн эзэмшил заах хэлбэр нь its, апострофгүй. It\'s = it is; it бол эзэн төлөөний үг; their олон эзэмшигчийг заана — муур нэг л байна.',
      ruleId: 3,
      kind: 'fill',
      question: 'Look at the cat. ___ eyes are green.',
      options: ['It\'s', 'Its', 'It', 'Their'],
      answer: 'Its',
      hint: 'Апостроф байвал эзэмшил биш.',
    },
    {
      id: '3-3',
      explanation: 'my-ийн дараа шууд нэр үг орно. a, the-г my-тай давхар тавихгүй. me бол тусагдахуун төлөөний үг, эзэмшил заадаггүй.',
      ruleId: 3,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['This is my phone.', 'This is my a phone.', 'This is me phone.', 'This is the my phone.'],
      answer: 'This is my phone.',
      hint: 'Нэр үгийн өмнө нэг л тодорхойлогч үг байна.',
    },
    {
      id: '3-4',
      explanation: 'Бат эрэгтэй → he → his. He эзэн, him тусагдахуун төлөөний үг — хоёулаа эзэмшил заадаггүй. He\'s = he is, эзэмшил биш.',
      ruleId: 3,
      kind: 'translate',
      question: 'Түүний нэр Бат.',
      options: ['His name is Bat.', 'He name is Bat.', 'Him name is Bat.', 'He\'s name is Bat.'],
      answer: 'His name is Bat.',
      hint: '«Нэр нь» гэдгийг англиар нэр үгийн өмнө эзэмшил заах үгээр хэлнэ.',
    },
  ],
};
