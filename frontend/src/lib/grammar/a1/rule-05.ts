// frontend/src/lib/grammar/a1/rule-05.ts
// A1 дүрэм 5: Plural nouns
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule05: GrammarRule = {
  id: 5,
  title: 'Plural nouns',
  titleMn: 'Нэр үгийн олон тоо',
  hook: 'Нэг ном — book. Хоёр ном бол book уу, books уу? Хоёр хүүхэд бол childs уу?',
  summary: 'Тоологдох нэр үг нэгээс олон болбол олон тоо (plural) болно. Ихэнхдээ -s нэмнэ; төгсгөлөөс хамаарч -es, -ies болно; зарим үг өөрийн онцгой хэлбэртэй.',
  description: 'Англиар нэр үг (noun) нэг юмыг зааж байвал ганц тоо (singular), нэгээс олныг зааж байвал заавал олон тоо (plural) хэлбэртэй байна. Ихэнх үгэнд зүгээр л -s нэмнэ: book → books. Гэхдээ төгсгөл нь -s, -sh, -ch, -x бол -es (box → boxes), гийгүүлэгч + y бол -ies (city → cities) болно. Цөөн хэдэн үг энэ дүрмийг огт дагахгүй: child → children, man → men. Энэ дүрэм чухал, учир нь олон тоо нь дараа нь be үйл үг (are), тоо (two, three), some/many зэрэг олон зүйлтэй холбогдоно. Монгол хүний хамгийн их эндүүрдэг цэг: тооны дараа ч англиар олон тоо заавал — two books, three children.',
  structure: 'singular noun → plural noun (-s / -es / -ies / irregular)',
  structureParts: [
    { text: 'singular noun', part: 'plain' },
    { text: '→', part: 'plain' },
    { text: 'plural noun', part: 'object' },
    { text: '(-s / -es / -ies / irregular)', part: 'modifier' },
  ],
  tip: 'Дөрвөн үлгэр үг цээжлээрэй: book→books · box→boxes · city→cities · child→children. Шинэ үг аль үлгэрт багтахыг бодоорой.',
  examples: [
    {
      en: '[I](s) [have](v) [one book](o). [You](s) [have](v) [two books](o).',
      mn: 'Надад нэг ном бий. Чамд хоёр ном бий.',
    },
    {
      en: '[There](s) [is](v) [one box](o) [here](m). [There](s) [are](v) [three boxes](o) [there](m).',
      mn: 'Энд нэг хайрцаг байна. Тэнд гурван хайрцаг байна.',
    },
    {
      en: '[One child](s) [is sleeping](v). [Two children](s) [are playing](v).',
      mn: 'Нэг хүүхэд унтаж байна. Хоёр хүүхэд тоглож байна.',
    },
    { en: '[Many cities](s) [have](v) [big parks](o).', mn: 'Олон хот том цэцэрлэгт хүрээлэнтэй.' },
  ],
  useCases: [
    {
      title: 'Ихэнх нэр үг: +s',
      description: 'Энгийн нэр үгийн төгсгөлд -s нэмэхэд л болно. Энэ бол хамгийн түгээмэл хэлбэр — эргэлзвэл эхлээд -s гэж бодоорой.',
      examples: [
        { en: 'book → books', mn: 'ном → номууд' },
        { en: 'car → cars', mn: 'машин → машинууд' },
        { en: 'student → students', mn: 'оюутан → оюутнууд' },
      ],
    },
    {
      title: '-s, -ss, -sh, -ch, -x, зарим -o: +es',
      description: 'Үг -s, -ss, -sh, -ch, -x төгсгөлтэй бол зөвхөн -s нэмэхэд дуудахад хэцүү (boxs?). Тиймээс -es нэмнэ: /из/ гэсэн нэмэлт үетэй дуудна. Зарим -o үг ч -es авна: potato → potatoes.',
      examples: [
        { en: 'bus → buses', mn: 'автобус → автобусууд' },
        { en: 'box → boxes', mn: 'хайрцаг → хайрцгууд' },
        { en: 'watch → watches', mn: 'бугуйн цаг → бугуйн цагууд' },
        { en: 'potato → potatoes', mn: 'төмс → төмснүүд' },
      ],
    },
    {
      title: 'Гийгүүлэгч + y: y-г хасаад -ies',
      description: 'y-ийн өмнө гийгүүлэгч (t, b, l, r…) байвал y-г хасаад -ies залгана. city-д y-ийн өмнө t байгаа тул cities.',
      examples: [
        { en: 'city → cities', mn: 'хот → хотууд' },
        { en: 'baby → babies', mn: 'нялх хүүхэд → нялх хүүхдүүд' },
        { en: 'family → families', mn: 'гэр бүл → гэр бүлүүд' },
      ],
    },
    {
      title: 'Эгшиг + y: y хэвээр, зүгээр +s',
      description: 'y-ийн өмнө эгшиг (a, e, o, u) байвал y-г хөндөхгүй, -s нэмнэ. boy-д y-ийн өмнө o байгаа тул boys, boies биш.',
      examples: [
        { en: 'boy → boys', mn: 'хүү → хөвгүүд' },
        { en: 'key → keys', mn: 'түлхүүр → түлхүүрүүд' },
        { en: 'day → days', mn: 'өдөр → өдрүүд' },
      ],
    },
    {
      title: 'Дүрэмт бус олон тоо',
      description: 'Зарим үг -s/-es дүрмийг огт дагахгүй, үгийн дотоод хэлбэр нь өөрчлөгдөнө. Эдгээрийг дүрмээр гаргаж болохгүй тул тусад нь цээжлээрэй. Бүгд өдөр тутмын үгс.',
      examples: [
        { en: 'child → children', mn: 'хүүхэд → хүүхдүүд' },
        { en: 'man → men, woman → women', mn: 'эрэгтэй → эрэгтэйчүүд, эмэгтэй → эмэгтэйчүүд' },
        { en: 'person → people', mn: 'хүн → хүмүүс' },
        { en: 'mouse → mice', mn: 'хулгана → хулгананууд' },
      ],
    },
    {
      title: 'Ганц ба олон тоо ижил хэлбэртэй үг',
      description: 'Цөөн хэдэн үг олон тоондоо огт өөрчлөгдөхгүй. Юу нь олон болохыг тоо, be үйл үг (are) заана: two sheep, the fish are.',
      examples: [
        { en: 'one sheep → two sheep', mn: 'нэг хонь → хоёр хонь' },
        { en: 'one fish → two fish', mn: 'нэг загас → хоёр загас' },
      ],
    },
    {
      title: 'Үл тоологдох нэр үг: олон тоо байхгүй',
      description: 'water, rice, information, money зэрэг үл тоологдох (uncountable) нэр үгийг ердийн утгаар -s нэмж олон тоо болгодоггүй. Хэмжээг some, a piece of, a glass of гэх мэтээр хэлнэ.',
      examples: [
        { en: 'some water', mn: 'жаахан ус' },
        { en: 'some rice', mn: 'жаахан будаа' },
        { en: 'a piece of information', mn: 'нэг мэдээлэл' },
      ],
    },
  ],
  forms: [
    {
      structure: 'noun + s',
      examples: [
        { en: 'cat → cats', mn: 'муур → муурнууд' },
        { en: 'phone → phones', mn: 'утас → утаснууд' },
      ],
      label: 'Дүрэмт: +s',
    },
    {
      structure: 's / ss / sh / ch / x + es',
      examples: [
        { en: 'class → classes', mn: 'анги → ангиуд' },
        { en: 'dish → dishes', mn: 'таваг → тавгууд' },
        { en: 'box → boxes', mn: 'хайрцаг → хайрцгууд' },
      ],
      label: '-es',
    },
    {
      structure: 'consonant + y → ies',
      examples: [
        { en: 'story → stories', mn: 'үлгэр → үлгэрүүд' },
        { en: 'country → countries', mn: 'улс → улсууд' },
      ],
      label: '-ies',
    },
    {
      structure: 'special plural form (цээжилнэ)',
      examples: [
        { en: 'child → children', mn: 'хүүхэд → хүүхдүүд' },
        { en: 'foot → feet', mn: 'хөл → хөлүүд' },
        { en: 'tooth → teeth', mn: 'шүд → шүднүүд' },
        { en: 'mouse → mice', mn: 'хулгана → хулгананууд' },
      ],
      label: 'Дүрэмт бус',
    },
  ],
  signalWords: ['two / three / ten', 'many', 'some', 'a few', 'these', 'those'],
  notes: [
    'Олон тооны эзэнтэй be үйл үг are (өнгөрсөнд were) хэлбэртэй: «The boys are here», «My books were on the table».',
    'Энгийн одоо цагт олон тооны эзний үйл үг -s авахгүй: «The boys play», «The boys plays» биш. -s нэр үг дээр очно, үйл үг дээр биш.',
    'Тоо (one, two, three…) нэр үгийн өмнө орвол 2-оос эхлээд заавал олон тоо: one book, two books, ten books.',
    'Нэмэлт: -f / -fe төгсгөлтэй зарим үг -ves болно: wife → wives, knife → knives, leaf → leaves. Гэхдээ бүгд биш: roof → roofs.',
    'Олон тооны өмнө a/an хэрэглэхгүй. Оронд нь some, many, эсвэл юу ч тавихгүй: a book, гэхдээ some books / books.',
    'this/that ганц тоотой, these/those олон тоотой явна: this box → these boxes, that child → those children.',
  ],
  commonMistakes: [
    {
      wrong: 'two childs',
      correct: 'two children',
      explanation: 'child дүрэмт бус олон тоотой. -s нэмэхгүй, үг бүхэлдээ өөрчлөгдөнө: children. «childrens» гэж давхар -s нэмэх нь бас буруу.',
    },
    {
      wrong: 'three boxs',
      correct: 'three boxes',
      explanation: '-x төгсгөлтэй нэр үгэнд -es нэмнэ. boxs гэж дуудахад хэцүү тул нэмэлт үе орно: box-es.',
    },
    {
      wrong: 'informations',
      correct: 'information / pieces of information',
      explanation: 'information үл тоологдох нэр үг: олон тоо байхгүй. Тоолох бол a piece of / two pieces of information гэнэ.',
    },
    {
      wrong: 'I have two cat.',
      correct: 'I have two cats.',
      explanation: 'Монголоор «хоёр муур» гэдэг ч англиар тооны дараа олон тоо заавал: two cats. Тоо байгаа учраас -s мартаж болохгүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор тооны дараа нэр үг ганц тоогоороо үлдэнэ: «хоёр ном», «гурван хүүхэд». Англиар эсрэгээрээ — тооноос хойш заавал олон тоо: two books, three children. «two book» бол хамгийн түгээмэл алдаа.',
      'Монголоор олон тооны дагавар (-ууд, -нууд, -чууд, -нар) ихэвчлэн заавал биш: «Хүүхэд тоглож байна» гэхэд олон хүүхэд ч байж болно. Англиар олон бол заавал children — ганц тоогоор орхиж болохгүй.',
      'Монголоор нэр үг олон тоо болоход үйл үг өөрчлөгддөггүй. Англиар эзэн олон тоо болмогц be үйл үг are болж, энгийн одоо цагийн үйл үг -s авахгүй: The boy plays → The boys play.',
      'Монголоор «мэдээллүүд», «зөвлөгөөнүүд» гэж хэлж болдог. Англиар information, advice, money, water үл тоологдох тул -s авахгүй: some information, a piece of advice.',
    ],
  },
  dialogue: [
    {
      en: '[How many children](m) [do](v) [you](s) [have](v), Bat?',
      mn: 'Бат, чи хэдэн хүүхэдтэй вэ?',
      speaker: 'Saraa',
    },
    {
      en: '[I](s) [have](v) [two children](o): [a boy and a girl](o).',
      mn: 'Би хоёр хүүхэдтэй: нэг хүү, нэг охин.',
      speaker: 'Bat',
    },
    {
      en: '[Do](v) [they](s) [like](v) [animals](o)?',
      mn: 'Тэд амьтанд дуртай юу?',
      speaker: 'Saraa',
    },
    {
      en: '[Yes](o). [We](s) [have](v) [two cats and three fish](o) [at home](m).',
      mn: 'Тийм ээ. Манайд хоёр муур, гурван загас бий.',
      speaker: 'Bat',
    },
    {
      en: 'Wow! [Are](v) [the cats](s) [big](o)?',
      mn: 'Хөөх! Муурнууд нь том уу?',
      speaker: 'Saraa',
    },
    {
      en: '[No](o), [they](s) [are](v) [still](m) [babies](o). [Their teeth](s) [are](v) [tiny](o).',
      mn: 'Үгүй, тэд одоохондоо зулзаганууд. Шүд нь жижигхэн.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: '5-1',
      explanation: 'child дүрэмт бус олон тоотой: child → children. childs, childes нь -s/-es дүрмийг буруу хэрэглэсэн, childrens нь олон тоон дээр давхар -s нэмсэн алдаа.',
      ruleId: 5,
      kind: 'fill',
      question: 'one child → two ___',
      options: ['childs', 'childes', 'children', 'childrens'],
      answer: 'children',
      hint: 'Энэ үг -s дүрмийг дагадаггүй. Үлгэр үгийг санаарай.',
    },
    {
      id: '5-2',
      explanation: 'city-д y-ийн өмнө гийгүүлэгч t байгаа тул y-г хасаад -ies: cities. citys, cityes буруу залгасан хэлбэр; many-ийн дараа ганц тоо city байж болохгүй.',
      ruleId: 5,
      kind: 'fill',
      question: 'There are many big ___ in China.',
      options: ['citys', 'cities', 'cityes', 'city'],
      answer: 'cities',
      hint: 'y-ийн өмнө ямар үсэг байна вэ? Гийгүүлэгч бол y өөрчлөгдөнө.',
    },
    {
      id: '5-3',
      explanation: '-x төгсгөлтэй үгэнд -es нэмнэ: boxes. boxs гэж дуудахад хэцүү, boxies буруу дүрэм (y байхгүй), three box нь тооны дараа олон тоо мартсан алдаа.',
      ruleId: 5,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['We need three boxes.', 'We need three boxs.', 'We need three box.', 'We need three boxies.'],
      answer: 'We need three boxes.',
      hint: 'three гэсэн тоо байна. box төгсгөл нь -x.',
    },
    {
      id: '5-4',
      explanation: 'person-ийн олон тоо people (дүрэмт бус). peoples давхар олон тоо, many person ганц тоо тул буруу. Олон тооны эзэнтэй be нь are, is биш.',
      ruleId: 5,
      kind: 'translate',
      question: 'Энэ хотод олон хүн байдаг.',
      options: [
        'There are many people in this city.',
        'There are many peoples in this city.',
        'There are many person in this city.',
        'There is many people in this city.',
      ],
      answer: 'There are many people in this city.',
      hint: 'person → ? Мөн олон тоотой be үйл үг ямар хэлбэртэй вэ?',
    },
  ],
};
