// frontend/src/lib/grammar/a2/rule-15.ts
// A2 дүрэм 15: too / enough / much / many / little / few
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule15: GrammarRule = {
  id: 15,
  title: 'too / enough / much / many / little / few',
  titleMn: 'Хэмжээ заах үгс — хэт, хангалттай, их, цөөн',
  hook: '«Хэт халуун», «хангалттай мөнгө», «цөөхөн хүн», «жаахан цаг» — хэмжээгээ англиар нарийн хэлж чадаж байна уу?',
  summary: 'much / little тоологдохгүй, many / few тоологдох нэр үгтэй, a lot of хоёуланд нь орно. too нь «хэт их, хэрэгтэйгээс илүү» гэсэн сөрөг утгатай, enough нь «хангалттай» гэсэн утгатай бөгөөд тэмдэг нэрийн ард, нэр үгийн өмнө ордог.',
  description: 'А1-д бид some / any болон тоологдох, тоологдохгүй нэр үгийн ялгааг үзсэн. Одоо хэмжээг илүү нарийн хэлж сурна. much (их) болон little (бага) нь water, money, time гэх мэт тоологдохгүй нэр үгтэй, many (олон) болон few (цөөн) нь books, people, cars гэх мэт тоологдох нэр үгтэй хэрэглэнэ. a lot of хоёуланд нь тохирох тул батлах өгүүлбэрт хамгийн аюулгүй сонголт юм. a little / a few нь «жаахан, хэдэн» гэсэн эерэг утгатай бол а-гүй little / few нь «бараг байхгүй» гэсэн сөрөг утгатай. too + тэмдэг нэр (too hot) нь «хэрэгтэйгээс хэт их» гэсэн сөрөг утга илэрхийлдэг тул very-тэй андуурч болохгүй. enough (хангалттай) нэр үгийн өмнө (enough money), харин тэмдэг нэрийн ард (big enough) ордог онцлогтой. How much / How many асуултын үгс ч энэ дүрмийг дагана: How much water? How many people?',
  structure: 'too + adjective · adjective + enough · enough + noun · much / little + uncountable · many / few + countable',
  structureParts: [
    { text: 'too', part: 'modifier' },
    { text: 'adjective', part: 'object' },
    { text: '·', part: 'plain' },
    { text: 'adjective', part: 'object' },
    { text: 'enough', part: 'modifier' },
    { text: '·', part: 'plain' },
    { text: 'much / many / little / few', part: 'modifier' },
    { text: 'noun', part: 'object' },
  ],
  tip: 'much / little = тоологдохгүй (усыг тоолж болохгүй) · many / few = тоологдох (номыг тоолж болно) · too = хэтэрхий (муу) · enough = хангалттай: тэмдэг нэрийн АРД, нэр үгийн ӨМНӨ.',
  examples: [
    { en: '[This tea](s) [is](v) [too hot](o). [I](s) [can\'t drink](v) [it](o).', mn: 'Энэ цай хэт халуун байна. Би ууж чадахгүй нь.' },
    { en: '[We](s) [don\'t have](v) [enough time](o).', mn: 'Бидэнд хангалттай цаг алга.' },
    { en: '[There](s) [are](v) [too many people](o) [on the bus](m).', mn: 'Автобусанд хэт олон хүн байна.' },
    { en: '[I](s) [have](v) [a few friends](o) [in Erdenet](m).', mn: 'Эрдэнэтэд надад хэдэн найз бий.' },
  ],
  useCases: [
    {
      title: 'Их хэмжээ — much / many / a lot of',
      description: 'much тоологдохгүй, many тоологдох нэр үгтэй. much-ийг голдуу үгүйсгэх, асуух өгүүлбэрт хэрэглэдэг бол батлах өгүүлбэрт a lot of / lots of илүү байгалийн сонсогддог. many батлах өгүүлбэрт ч орж болно.',
      examples: [
        { en: '[I](s) [don\'t have](v) [much money](o) [this month](m).', mn: 'Энэ сард надад их мөнгө алга.' },
        { en: '[There](s) [are](v) [many restaurants](o) [near the station](m).', mn: 'Буудлын ойролцоо олон ресторан бий.' },
        { en: '[She](s) [drinks](v) [a lot of water](o) [every day](m).', mn: 'Тэр өдөр бүр их ус уудаг.' },
      ],
    },
    {
      title: 'Бага хэмжээ — a little / a few · little / few',
      description: 'a little (тоологдохгүй) болон a few (тоологдох) нь «жаахан, хэдэн бий» гэсэн эерэг утгатай. а-гүй little / few нь «бараг байхгүй, хүрэлцэхгүй» гэсэн сөрөг утгатай. Ганц үсэг утгыг эргүүлдэг тул анхаарлаа хандуулаарай.',
      examples: [
        { en: '[We](s) [have](v) [a little time](o) [before the meeting](m).', mn: 'Хурлын өмнө бидэнд жаахан цаг бий.' },
        { en: '[Few people](s) [came](v) [to the concert](m).', mn: 'Концертод цөөхөн хүн ирсэн.' },
        { en: '[There](s) [is](v) [little milk](o) [left](m), [so](m) [I](s) [need to buy](v) [some](o).', mn: 'Сүү бараг дуусчихсан тул би авах хэрэгтэй.' },
      ],
    },
    {
      title: 'Хэтэрсэн — too / too much / too many',
      description: 'too + тэмдэг нэр нь «хэрэгтэйгээс хэт их» гэсэн сөрөг утга илэрхийлнэ: too small = багадаад болохгүй. Нэр үгтэй бол too much (тоологдохгүй), too many (тоологдох). very нь зүгээр л «маш» гэсэн төвийг сахисан үг, харин too асуудал байгааг заана.',
      examples: [
        { en: '[These shoes](s) [are](v) [too small](o) [for me](m).', mn: 'Энэ гутал надад хэт жижиг байна.' },
        { en: '[You](s) [put](v) [too much sugar](o) [in my coffee](m).', mn: 'Чи миний кофенд хэт их чихэр хийчихжээ.' },
        { en: '[He](s) [has](v) [too many meetings](o) [today](m).', mn: 'Түүнд өнөөдөр хэт олон хурал байна.' },
      ],
    },
    {
      title: 'Хангалттай — enough',
      description: 'enough нь «хэрэгтэй хэмжээнд хүрсэн» гэсэн утгатай. Байрлал нь чухал: нэр үгийн ӨМНӨ (enough chairs), тэмдэг нэр, дайвар үгийн АРД (warm enough, fast enough) орно. Үгүйсгэлд not … enough болно.',
      examples: [
        { en: '[Do](v) [we](s) [have](v) [enough chairs](o) [for everyone](m)?', mn: 'Бидэнд хүн бүрд хүрэлцэх сандал бий юу?' },
        { en: '[The water](s) [isn\'t](v) [warm enough](o) [for swimming](m).', mn: 'Ус сэлэхэд хангалттай бүлээн биш байна.' },
        { en: '[He](s) [is](v) [old enough](o) [to drive](m).', mn: 'Тэр машин жолоодох насанд хүрсэн.' },
      ],
    },
    {
      title: 'Хэмжээ асуух — How much / How many',
      description: 'Хэмжээ, тоо асуухдаа тоологдохгүй нэр үгтэй How much, тоологдох нэр үгтэй How many хэрэглэнэ. Үнэ асуухад мөн How much: How much is it? (мөнгө тоологдохгүй).',
      examples: [
        { en: '[How much coffee](o) [do](v) [you](s) [drink](v) [a day](m)?', mn: 'Чи өдөрт хэр их кофе уудаг вэ?' },
        { en: '[How many brothers](o) [do](v) [you](s) [have](v)?', mn: 'Чи хэдэн ахтай вэ?' },
        { en: '[How much](o) [is](v) [this jacket](s)?', mn: 'Энэ хүрэм хэд вэ?' },
      ],
    },
  ],
  forms: [
    {
      label: 'Тоологдохгүй нэр үгтэй',
      structure: 'much / a little / little / too much / enough + water, money, time, sugar, information',
      examples: [
        { en: '[I](s) [don\'t drink](v) [much tea](o).', mn: 'Би их цай уудаггүй.' },
        { en: '[There](s) [is](v) [a little rice](o) [in the kitchen](m).', mn: 'Гал тогоонд жаахан будаа байна.' },
        { en: '[We](s) [spent](v) [too much money](o) [on the trip](m).', mn: 'Бид аялалдаа хэт их мөнгө зарцуулсан.' },
      ],
    },
    {
      label: 'Тоологдох нэр үгтэй',
      structure: 'many / a few / few / too many / enough + books, people, cars, days',
      examples: [
        { en: '[Do](v) [you](s) [have](v) [many cousins](o)?', mn: 'Чи олон үеэлтэй юу?' },
        { en: '[Only a few students](s) [passed](v) [the test](o).', mn: 'Ердөө хэдхэн сурагч шалгалтаа давсан.' },
        { en: '[There](s) [are](v) [too many cars](o) [in the city centre](m).', mn: 'Хотын төвд хэт олон машин байна.' },
      ],
    },
    {
      label: 'Тэмдэг нэртэй — too / enough',
      structure: 'too + adjective · adjective + enough · not + adjective + enough',
      examples: [
        { en: '[It](s)[\'s](v) [too late](o) [to call her](m).', mn: 'Түүн рүү залгахад хэтэрхий оройтжээ.' },
        { en: '[The room](s) [is](v) [big enough](o) [for four people](m).', mn: 'Өрөө дөрвөн хүнд хангалттай том.' },
        { en: '[This soup](s) [isn\'t](v) [salty enough](o).', mn: 'Энэ шөл хангалттай давстай биш байна.' },
      ],
    },
    {
      label: 'Асуух — How much / How many',
      structure: 'How much + uncountable + …? · How many + plural countable + …?',
      examples: [
        { en: '[How much time](o) [do](v) [we](s) [have](v)?', mn: 'Бидэнд хэр их цаг байна вэ?' },
        { en: '[How many languages](o) [does](v) [she](s) [speak](v)?', mn: 'Тэр хэдэн хэлээр ярьдаг вэ?' },
        { en: '[How much](o) [does](v) [the ticket](s) [cost](v)?', mn: 'Тасалбар ямар үнэтэй вэ?' },
      ],
    },
  ],
  signalWords: ['too', 'enough', 'much', 'many', 'a lot of', 'a little', 'a few', 'little', 'few', 'How much', 'How many'],
  notes: [
    'Тоологдох, тоологдохгүй нэр үгийн товч давталт: тоологдох нэр үг олон тоотой (book → books, person → people), тоологдохгүй нэр үг олон тоогүй, үргэлж ганц тоо (water, money, time, bread, information, advice, furniture). Монголоор тоолж болох мэт санагддаг money, information, advice, furniture, news англиар тоологдохгүй.',
    'much-ийг батлах өгүүлбэрт ярианд ховор хэрэглэдэг: «I have much money» гэхээсээ «I have a lot of money» гэнэ. Үгүйсгэх, асуухад much чөлөөтэй: not much, How much.',
    'Ганц үсэгний ялгаа: a few = хэдэн (эерэг, хангалттай), few = цөөхөн (сөрөг, хүрэлцэхгүй). a little = жаахан (эерэг), little = бага, бараг байхгүй (сөрөг). Ярианд «very few», «very little» гэж хүчитгэдэг.',
    'too болон very хоёр өөр: very hot = маш халуун (ердийн тайлбар), too hot = хэт халуун (асуудал, тэвчихгүй). Мөн өгүүлбэрийн төгсгөлд орсон too нь «бас, мөн» гэсэн огт өөр утгатай: I like it too.',
    'enough-ийн байрлал: нэр үгийн өмнө (enough money, enough chairs), тэмдэг нэр, дайвар үгийн ард (good enough, quickly enough). enough-ийн ард ихэвчлэн for + хүн (enough for everyone) эсвэл to + үйл үг (old enough to drive) ирнэ.',
    'too … to / enough … to бүтэц: She is too young to drive. He is old enough to drive. too-тэй өгүүлбэр «чадахгүй», enough-тэй өгүүлбэр «чадна» гэсэн утгатай.',
  ],
  commonMistakes: [
    {
      wrong: 'I have many money.',
      correct: 'I have a lot of money.',
      explanation: 'money тоологдохгүй нэр үг тул many орохгүй. Батлах өгүүлбэрт a lot of хамгийн байгалийн сонголт; үгүйсгэлд much: I don\'t have much money.',
    },
    {
      wrong: 'The bag is enough big.',
      correct: 'The bag is big enough.',
      explanation: 'Монголоор «хангалттай том» гэж enough түрүүлж ирдэг тул энэ дараалал зөв мэт санагддаг. Англиар тэмдэг нэрийн ард enough орно. Зөвхөн нэр үгийн өмнө enough түрүүлнэ: enough space.',
    },
    {
      wrong: 'This coffee is too delicious!',
      correct: 'This coffee is very delicious!',
      explanation: 'too сөрөг утгатай: хэтэрсэн, асуудалтай. Магтахдаа very хэрэглэнэ. «too delicious» гэвэл амттай нь асуудал болж байна гэсэн үг болно.',
    },
    {
      wrong: 'How many water do you need?',
      correct: 'How much water do you need?',
      explanation: 'water тоологдохгүй тул How much. How many зөвхөн олон тооны тоологдох нэр үгтэй: How many bottles of water?',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «их» гэдэг нэг үг ус, мөнгө, ном, хүн бүгдэд орно: их ус, их ном. Англиар нэр үг тоологдох эсэхээс хамаарч much / many хоёрын аль нэгийг сонгох ёстой. Эргэлзвэл a lot of хэрэглэ — хоёуланд нь болно.',
      'Монголоор «хангалттай» үргэлж тодорхойлж буй үгийнхээ өмнө ирдэг: хангалттай том, хангалттай мөнгө. Англиар enough нэр үгийн өмнө, харин тэмдэг нэрийн АРД орно: enough money, гэхдээ big enough. Энэ урвуу дараалалд дасах хэрэгтэй.',
      'Монголоор «хэт» гэдэг үг «хэт сайхан» гэх мэтээр эерэг утгаар ч хэрэглэгддэг. Англиар too бараг үргэлж сөрөг: too hot, too expensive, too late. Магтахдаа very, really, so хэрэглэнэ.',
      'Монголоор «цөөхөн» ба «хэдэн» хоёрын ялгаа мэдрэгддэг шиг англиар few ба a few хоёр ялгаатай. «Цөөхөн хүн ирсэн» (хүрэлцээгүй) = few people, «хэдэн хүн ирсэн» (зарим нь ирсэн) = a few people. Ганц a үсэг санааг эерэг болгодог.',
    ],
  },
  dialogue: [
    {
      en: '[Are](v) [you](s) [ready](o) [for the picnic](m)? [How many people](o) [are coming](v)?',
      mn: 'Чи пикникт бэлэн үү? Хэдэн хүн ирэх гэж байгаа вэ?',
      speaker: 'Bat',
    },
    {
      en: '[About fifteen](o). [But](m) [I](s) [think](v) [we](s) [don\'t have](v) [enough food](o).',
      mn: 'Арван тав орчим. Гэхдээ бидэнд хангалттай хоол байхгүй гэж бодож байна.',
      speaker: 'Saraa',
    },
    {
      en: '[Really](m)? [I](s) [bought](v) [a lot of bread](o) [and](m) [a few salads](o).',
      mn: 'Үнэхээр үү? Би их талх, хэдэн салат авсан шүү дээ.',
      speaker: 'Bat',
    },
    {
      en: '[Yes](o), [but](m) [there](s) [is](v) [very little meat](o), [and](m) [only a few bottles of water](o).',
      mn: 'Тийм, гэхдээ мах маш бага, ус ч хэдхэн лонх л байна.',
      speaker: 'Saraa',
    },
    {
      en: '[It](s)[\'s](v) [too hot](o) [today](m). [Water](s) [is](v) [more important](o) [than meat](m)!',
      mn: 'Өнөөдөр хэт халуун байна. Ус махнаас чухал!',
      speaker: 'Bat',
    },
    {
      en: '[Okay](o), [I](s)[\'ll buy](v) [ten more bottles](o). [That](s) [should be](v) [enough](o).',
      mn: 'За, би дахиад арван лонх авъя. Тэгвэл хүрэлцэх байх.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-15-1',
      ruleId: 15,
      kind: 'fill',
      question: 'There isn\'t ___ milk in the fridge.',
      options: ['many', 'much', 'few', 'a few'],
      answer: 'much',
      explanation: 'milk тоологдохгүй, өгүүлбэр үгүйсгэх хэлбэртэй тул much. many, few, a few зөвхөн тоологдох олон тооны нэр үгтэй ордог.',
      hint: 'Сүүг тоолж болох уу?',
    },
    {
      id: 'a2-15-2',
      ruleId: 15,
      kind: 'fill',
      question: 'The coffee is ___ for me. I can\'t drink it.',
      options: ['very hot', 'too hot', 'hot enough', 'enough hot'],
      answer: 'too hot',
      explanation: '«Ууж чадахгүй» гэдэг нь хэтэрсэн, асуудалтай гэсэн утга тул too hot. very hot зүгээр л тайлбар; hot enough «хангалттай халуун» гэсэн эерэг утгатай; enough hot дараалал буруу.',
      hint: 'Ууж чадахгүй байгаа — асуудал байна.',
    },
    {
      id: 'a2-15-3',
      ruleId: 15,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'This room is enough big for us.',
        'This room is big enough for us.',
        'This room is too big enough for us.',
        'This room is big too for us.',
      ],
      answer: 'This room is big enough for us.',
      explanation: 'enough тэмдэг нэрийн ард орно: big enough. enough big буруу дараалал. too болон enough хоёрыг давхар хэрэглэхгүй. big too утгагүй.',
      hint: 'Тэмдэг нэрийн ард уу, өмнө үү?',
    },
    {
      id: 'a2-15-4',
      ruleId: 15,
      kind: 'translate',
      question: 'Надад хэдэн асуулт байна.',
      options: [
        'I have a little questions.',
        'I have few questions.',
        'I have a few questions.',
        'I have much questions.',
      ],
      answer: 'I have a few questions.',
      explanation: 'questions тоологдох, «хэдэн» гэдэг эерэг утгатай тул a few. a little тоологдохгүй нэр үгтэй; few «бараг байхгүй» гэсэн сөрөг утгатай; much тоологдох олон тоотой орохгүй.',
      hint: '«Хэдэн» — зарим нь бий, эерэг утга.',
    },
  ],
};
