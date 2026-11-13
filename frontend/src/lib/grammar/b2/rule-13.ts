// frontend/src/lib/grammar/b2/rule-13.ts
// B2 дүрэм 13: Advanced comparison — the more … the more / much, far, slightly + comparative / by far / as … as
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule13: GrammarRule = {
  id: 13,
  title: 'Advanced comparison',
  titleMn: 'Харьцуулалтын ахисан түвшин — ялгааны хэмжээ, «төдий чинээ», «улам бүр»',
  hook: '«Хэдий чинээ их уншина, төдий чинээ их мэднэ», «Хавьгүй хямд», «Хоёр дахин үнэтэй», «Улам бүр хэцүү болж байна» — харьцуулалтаа нарийн, оновчтой болгож сурцгаая.',
  summary: 'Ялгааны хэмжээг comparative-ийн өмнө much / far / a lot (хавьгүй) эсвэл slightly / a bit / a little (арай) тавьж заана. Superlative-ийг by far-аар хүчжүүлнэ (by far the best). as … as-ийг nearly, almost, just, not nearly, twice, three times-аар нарийсгана. the + comparative, the + comparative нь «хэдий чинээ … төдий чинээ», comparative and comparative нь «улам бүр» гэсэн утгатай.',
  description: 'A2-ийн 14-р дүрэмд бид comparative (bigger, more expensive + than), superlative (the biggest, the most expensive), мөн as … as-ийг үзсэн. Тэр түвшинд бид зөвхөн «А нь Б-ээс том» гэж хэлж чаддаг байсан. B2-д бид ЯЛГАА ХЭР ИХ вэ гэдгийг хэлж сурна. НЭГДҮГЭЭРТ, comparative-ийн өмнө хэмжээ заах үг тавина: их ялгаанд much / far / a lot / considerably (This flat is much bigger), бага ялгаанд slightly / a bit / a little (It\'s slightly cheaper). Энд very хэрэглэж БОЛОХГҮЙ — very bigger гэж байхгүй. ХОЁРДУГААРТ, superlative-ийг by far / easily-ээр хүчжүүлнэ: She is by far the best student. ГУРАВДУГААРТ, as … as-ийг нарийсгана: just as good as (яг адил), nearly / almost as good as (бараг адил), not nearly as good as (хавьгүй дор), not quite as good as (арай дор), twice / three times as big as (хоёр / гурав дахин том). ДӨРӨВДҮГЭЭРТ, хоёр зүйл хамт өөрчлөгдөхийг the + comparative …, the + comparative … гэсэн хос бүтцээр хэлнэ: The more you practise, the better you get (хэдий чинээ их дасгал хийнэ, төдий чинээ сайжирна). Энэ бүтцэд the нь артикль биш, харьцуулалтын тусгай хэлбэр бөгөөд хоёр талд заавал байна. ТАВДУГААРТ, аажим өөрчлөлтийг comparative and comparative-ээр хэлнэ: It\'s getting colder and colder, more and more expensive (улам бүр). Монгол хэлэнд харьцуулалт «-аас» нөхцөл ба «хавьгүй», «арай», «хоёр дахин», «улам», «хэдий чинээ … төдий чинээ» гэсэн үгсээр илэрдэг тул утгын хувьд дүйцэл нь тодорхой, харин англи хэлний хэлбэр (ялангуяа very-г хориглох, the-г давтах) нь анхаарал шаардана.',
  structure: 'much / far / a lot / slightly / a bit + comparative + than · by far + the + superlative · (not) nearly / just / twice + as + adj + as · The + comparative …, the + comparative … · comparative + and + comparative',
  structureParts: [
    { text: 'The more', part: 'modifier' },
    { text: 'you', part: 'subject' },
    { text: 'practise,', part: 'verb' },
    { text: 'the better', part: 'modifier' },
    { text: 'you', part: 'subject' },
    { text: 'get', part: 'verb' },
    { text: '· much / far / slightly + -er', part: 'plain' },
  ],
  tip: 'much / far / a lot + -er = «хавьгүй» · slightly / a bit + -er = «арай» · by far the + -est = «хамгийн … нь маргаангүй» · twice as … as = «хоёр дахин» · not nearly as … as = «хавьгүй дор» · the more …, the more … = «хэдий чинээ … төдий чинээ» · -er and -er = «улам бүр».',
  examples: [
    { en: '[The more](m) [you](s) [read](v), [the more](m) [you](s) [learn](v).', mn: 'Хэдий чинээ их уншина, төдий чинээ их сурна.' },
    { en: '[This flat](s) [is](v) [much bigger](o) [than our old one](m).', mn: 'Энэ байр бидний хуучин байрнаас хавьгүй том.' },
    { en: '[She](s) [is](v) [by far the best player](o) [in the team](m).', mn: 'Тэр бол багийн хамгийн шилдэг тоглогч нь маргаангүй.' },
    { en: '[The new phone](s) [is](v) [twice as expensive](o) [as the old one](m).', mn: 'Шинэ утас хуучнаасаа хоёр дахин үнэтэй.' },
  ],
  useCases: [
    {
      title: 'much / far / a lot + comparative — их ялгаа',
      description: 'Ялгаа их байгааг comparative-ийн өмнө much, far, a lot (ярианы), considerably / significantly (албан) тавьж илэрхийлнэ. very хэрэглэхгүй. Нэр үгтэй бол far more / many more + нэр үг.',
      examples: [
        { en: '[Ulaanbaatar](s) [is](v) [far colder](o) [than Seoul](m) [in winter](m).', mn: 'Өвөл Улаанбаатар Сөүлээс хавьгүй хүйтэн.' },
        { en: '[The exam](s) [was](v) [a lot more difficult](o) [than I expected](m).', mn: 'Шалгалт миний бодсоноос хавьгүй хэцүү байсан.' },
        { en: '[Flights](s) [are](v) [considerably cheaper](o) [in the spring](m).', mn: 'Хавар нислэгийн үнэ мэдэгдэхүйц хямд байдаг.' },
      ],
    },
    {
      title: 'slightly / a bit / a little + comparative — бага ялгаа',
      description: 'Ялгаа бага байгааг slightly (албан талдаа), a bit, a little (ярианы) тавьж илэрхийлнэ. Үгүйсгэлд not much + comparative: It isn\'t much better.',
      examples: [
        { en: '[My brother](s) [is](v) [slightly taller](o) [than me](m).', mn: 'Миний ах надаас арай өндөр.' },
        { en: '[Could](v) [you](s) [speak](v) [a bit more slowly](m), please?', mn: 'Та арай удаан ярьж болох уу?' },
        { en: '[The second hotel](s) [wasn\'t](v) [much better](o) [than the first](m).', mn: 'Хоёр дахь зочид буудал эхнийхээс нэг их дээр байгаагүй.' },
      ],
    },
    {
      title: 'by far + superlative — хамгийн … гэдгийг хүчжүүлэх',
      description: 'Бусдаас илт давуу (эсвэл дор) байгааг by far the + superlative-ээр хэлнэ. easily the best ч мөн адил. one of the + superlative + олон тооны нэр үг нь «хамгийн …-ийн нэг».',
      examples: [
        { en: '[This](s) [is](v) [by far the most interesting book](o) [I\'ve read this year](m).', mn: 'Энэ бол миний энэ жил уншсан номнуудаас хамгийн сонирхолтой нь маргаангүй.' },
        { en: '[Winter](s) [is](v) [by far the worst time](o) [to visit](m).', mn: 'Өвөл бол очиход хамгийн тохиромжгүй үе нь гарцаагүй.' },
        { en: '[It](s) [was](v) [easily the best meal](o) [of the trip](m).', mn: 'Энэ бол аяллын хамгийн сайхан хоол байсан нь эргэлзээгүй.' },
      ],
    },
    {
      title: 'as … as-ийг нарийсгах — just, nearly, not nearly, twice',
      description: 'just as … as = яг адил; nearly / almost as … as = бараг адил; not quite as … as = арай дутуу; not nearly as … as = хавьгүй дутуу; twice / three times / half as … as = хоёр дахин / гурав дахин / хоёр дахин бага. as-ийн хооронд тэмдэг нэрийн үндсэн хэлбэр.',
      examples: [
        { en: '[The sequel](s) [isn\'t](v) [nearly as good](o) [as the first film](m).', mn: 'Үргэлжлэл нь эхний киног бодвол хавьгүй тааруу.' },
        { en: '[Rent](s) [here](m) [is](v) [three times as high](o) [as in my home town](m).', mn: 'Эндхийн түрээс манай төрсөн хотынхоос гурав дахин өндөр.' },
        { en: '[The train](s) [is](v) [just as fast](o) [as the plane](m) [on this route](m).', mn: 'Энэ чиглэлд галт тэрэг онгоцтой яг адил хурдан.' },
      ],
    },
    {
      title: 'the more … the more / more and more — хамт өөрчлөгдөх, аажим өөрчлөгдөх',
      description: 'The + comparative + эзэн + үйл үг, the + comparative + эзэн + үйл үг: нэг зүйл өөрчлөгдөхөд нөгөө нь дагаж өөрчлөгдөнө. comparative and comparative (get, become, grow-тай): тасралтгүй, аажим өөрчлөлт.',
      examples: [
        { en: '[The older](m) [I](s) [get](v), [the less](m) [I](s) [worry](v).', mn: 'Би хэдий чинээ нас ахина, төдий чинээ бага санаа зовдог.' },
        { en: '[The sooner](m) [we](s) [leave](v), [the earlier](m) [we](s)[\'ll arrive](v).', mn: 'Бид хэдий чинээ эрт гарна, төдий чинээ эрт очно.' },
        { en: '[It](s)[\'s getting](v) [harder and harder](o) [to find a cheap flat](m).', mn: 'Хямд байр олох улам бүр хэцүү болж байна.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Хэмжээ заах үг + comparative',
      structure: 'much / far / a lot / considerably · slightly / a bit / a little + comparative (+ than)',
      examples: [
        { en: '[I](s) [feel](v) [much better](o) [today](m).', mn: 'Өнөөдөр миний бие хавьгүй дээр байна.' },
        { en: '[This route](s) [is](v) [a little longer](o) [but](m) [far safer](o).', mn: 'Энэ зам арай урт боловч хавьгүй аюулгүй.' },
        { en: '[She](s) [earns](v) [far more money](o) [than her husband](m).', mn: 'Тэр нөхрөөсөө хавьгүй их мөнгө олдог.' },
      ],
    },
    {
      label: 'by far / easily + superlative',
      structure: 'by far / easily + the + superlative · one of the + superlative + plural noun',
      examples: [
        { en: '[He](s) [is](v) [by far the youngest person](o) [in the office](m).', mn: 'Тэр бол оффисын хамгийн залуу хүн нь гарцаагүй.' },
        { en: '[That](s) [was](v) [by far the hardest decision](o) [of my life](m).', mn: 'Тэр бол миний амьдралын хамгийн хэцүү шийдвэр байсан нь маргаангүй.' },
        { en: '[It](s)[\'s](v) [one of the oldest monasteries](o) [in the country](m).', mn: 'Энэ бол тус улсын хамгийн эртний хийдүүдийн нэг.' },
      ],
    },
    {
      label: 'as … as-ийн хувилбарууд',
      structure: 'just / nearly / almost / not quite / not nearly / twice / half + as + adjective / adverb + as',
      examples: [
        { en: '[My car](s) [is](v) [almost as old](o) [as I am](m).', mn: 'Миний машин бараг надтай чацуу.' },
        { en: '[It](s) [isn\'t](v) [quite as cold](o) [as yesterday](m).', mn: 'Өчигдрийг бодвол арай хүйтэн биш байна.' },
        { en: '[This bag](s) [is](v) [half as heavy](o) [as that one](m).', mn: 'Энэ цүнх тэрнээс хоёр дахин хөнгөн.' },
      ],
    },
    {
      label: 'the … the … / comparative and comparative',
      structure: 'The + comparative + clause, the + comparative + clause · comparative + and + comparative · more and more + adjective',
      examples: [
        { en: '[The harder](m) [you](s) [work](v), [the luckier](m) [you](s) [get](v).', mn: 'Хэдий чинээ шаргуу ажиллана, төдий чинээ аз таарна.' },
        { en: '[The more expensive](m) [the hotel](s), [the better](m) [the service](s).', mn: 'Зочид буудал хэдий чинээ үнэтэй байна, үйлчилгээ нь төдий чинээ сайн.' },
        { en: '[More and more people](s) [are working](v) [from home](m).', mn: 'Улам олон хүн гэрээсээ ажиллах болж байна.' },
      ],
    },
  ],
  signalWords: ['much', 'far', 'a lot', 'considerably', 'slightly', 'a bit', 'a little', 'by far', 'easily', 'just as … as', 'not nearly as … as', 'twice as … as', 'the more … the more', 'more and more'],
  notes: [
    'comparative-ийн өмнө very хэрэглэхгүй: very bigger, very more expensive (буруу) → much bigger, far more expensive (зөв). very зөвхөн үндсэн хэлбэрийн өмнө: very big.',
    'the … the … бүтцэд the хоёр талд заавал байна, comparative нь the-гийн шууд ард ирж, дараа нь эзэн + үйл үг: The more you study, the better you do (The more you study, you do better биш).',
    'the … the … бүтцийн эхний хэсэг нөхцөлийн утгатай тул тэнд will хэрэглэхгүй: The sooner we leave, the earlier we\'ll arrive (The sooner we will leave биш).',
    'twice as big as зөв. three times-аас эхлэн three times as big as ба three times bigger than хоёулаа хэрэглэгддэг, харин twice-ийн ард comparative ирэхгүй: twice bigger (буруу).',
    'not nearly as … as = хавьгүй дутуу (их ялгаа), not quite as … as = арай дутуу (бага ялгаа). Хоёрыг андуурвал утга эрс өөрчлөгдөнө.',
    'Тоолж болох олон тооны нэр үгийн өмнө many more (many more people), тоолж болохгүй нэр үгийн өмнө much more (much more time). far more, a lot more хоёуланд нь болно.',
  ],
  commonMistakes: [
    {
      wrong: 'This laptop is very faster than my old one.',
      correct: 'This laptop is much faster than my old one.',
      explanation: 'comparative-ийг very-ээр хүчжүүлэхгүй — much / far / a lot хэрэглэнэ. Монголоор «маш хурдан» ба «хавьгүй хурдан» хоёр өөр үг байдгийн адил.',
    },
    {
      wrong: 'More you practise, better you become.',
      correct: 'The more you practise, the better you become.',
      explanation: 'Энэ бүтцэд the хоёр хэсэгт заавал байна. Монголоор «хэдий чинээ … төдий чинээ» гэсэн хос үгийг орхиж болдоггүйтэй адил.',
    },
    {
      wrong: 'Their house is twice bigger than ours.',
      correct: 'Their house is twice as big as ours.',
      explanation: 'twice-ийн ард as + үндсэн хэлбэр + as. twice + comparative гэж хэлэхгүй.',
    },
    {
      wrong: 'The weather is getting more cold and more cold.',
      correct: 'The weather is getting colder and colder.',
      explanation: 'Богино тэмдэг нэрд -er and -er (colder and colder). Урт тэмдэг нэрд more and more + үндсэн хэлбэр (more and more difficult) — тэмдэг нэрийг давтахгүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор харьцуулалт «-аас» нөхцөлөөр илэрч, тэмдэг нэр өөрөө хувирдаггүй (надаас өндөр). Ялгааны хэмжээг «хавьгүй», «арай», «бага зэрэг» гэсэн үгээр нэмдэг нь англи хэлний much / slightly + comparative-тай утгаараа таардаг: «хавьгүй өндөр» = much taller, «арай өндөр» = slightly taller.',
      'Монголоор «маш», «их» гэсэн үгийг харьцуулалтад ч хэрэглэж болдог (надаас их өндөр) тул very taller гэх алдаа гардаг. Англиар very ба comparative хамт ордоггүй — much / far / a lot гэж солино.',
      'Монголоор «хэдий чинээ … төдий чинээ», эсвэл «-х тусам» (унших тусам их мэднэ) = the + comparative, the + comparative. Монголд тэмдэг нэр хувирдаггүй бол англиар хоёр талд comparative хэлбэр, хоёр талд the заавал байна.',
      'Монголоор «хоёр дахин том» гэхэд англиар twice as big as гэж as … as бүтэц хэрэглэнэ («хоёр дахин» + comparative биш). «Улам бүр хүйтэн» = colder and colder: монголоор «улам» гэсэн тусдаа үг байдаг бол англиар comparative-ийг давтаж илэрхийлнэ.',
    ],
  },
  dialogue: [
    {
      en: 'Saraa, [how](m) [is](v) [your new flat](s)? [Is](v) [it](s) [better](o) [than the old one](m)?',
      mn: 'Сараа, шинэ байр чинь ямар байна? Хуучнаасаа дээр үү?',
      speaker: 'Temuulen',
    },
    {
      en: '[It](s)[\'s](v) [far better](o). [It](s)[\'s](v) [slightly smaller](o), [but](m) [it](s)[\'s](v) [much warmer](o) [and](m) [a lot quieter](o).',
      mn: 'Хавьгүй дээр. Арай жижиг ч гэсэн хавьгүй дулаан, бас их нам гүм.',
      speaker: 'Saraa',
    },
    {
      en: '[What about](m) [the rent](s)? [Flats](s) [are getting](v) [more and more expensive](o).',
      mn: 'Түрээс нь яаж байна? Байрны үнэ улам бүр өсөж байна шүү дээ.',
      speaker: 'Temuulen',
    },
    {
      en: 'True. [It](s)[\'s](v) [not nearly as cheap](o) [as my old place](m), [but](m) [the centre](s) [is](v) [twice as expensive](o).',
      mn: 'Үнэн. Хуучин байр шиг минь хямд биш, хавьгүй үнэтэй, гэхдээ хотын төв бүр хоёр дахин үнэтэй.',
      speaker: 'Saraa',
    },
    {
      en: '[So](m) [the closer](m) [you](s) [live](v) [to the centre](m), [the more](m) [you](s) [pay](v).',
      mn: 'Тэгэхээр төвд хэдий чинээ ойр амьдарна, төдий чинээ их төлнө гэсэн үг.',
      speaker: 'Temuulen',
    },
    {
      en: 'Exactly. Still, [it](s)[\'s](v) [by far the nicest flat](o) [I\'ve ever lived in](m).',
      mn: 'Яг тийм. Гэсэн ч энэ бол миний амьдарч байсан байрнуудаас хамгийн сайхан нь маргаангүй.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'b2-13-1',
      ruleId: 13,
      kind: 'fill',
      question: 'The more you practise, ___ you get.',
      options: ['the better', 'better', 'the best', 'the more good'],
      answer: 'the better',
      explanation: 'the + comparative …, the + comparative … бүтэц: хоёр талд the + comparative заавал байна. good-ийн comparative нь better (more good биш), superlative (the best) энд тохирохгүй.',
      hint: '«Хэдий чинээ … төдий чинээ» — хоёр талд the.',
    },
    {
      id: 'b2-13-2',
      ruleId: 13,
      kind: 'fill',
      question: 'I\'ve tried every café in this street, and this one is ___ the best.',
      options: ['by far', 'a lot', 'far more', 'very'],
      answer: 'by far',
      explanation: 'Superlative-ийг (the best) by far-аар хүчжүүлнэ: by far the best. a lot, far more нь comparative-тай хэрэглэгдэнэ (a lot better), very the best гэж хэлэхгүй (the very best гэсэн өөр дараалалтай).',
      hint: 'Superlative-ийн өмнөх хүчжүүлэгч.',
    },
    {
      id: 'b2-13-3',
      ruleId: 13,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'This phone is twice as expensive as mine.',
        'This phone is twice more expensive as mine.',
        'This phone is very more expensive than mine.',
        'This phone is not nearly as expensive than mine.',
      ],
      answer: 'This phone is twice as expensive as mine.',
      explanation: 'twice + as + үндсэн хэлбэр + as — зөв. twice-ийн ард comparative ирэхгүй; comparative-ийн өмнө very биш much / far; as … as бүтцийн хоёр дахь үг нь than биш as.',
      hint: 'twice as … as.',
    },
    {
      id: 'b2-13-4',
      ruleId: 13,
      kind: 'translate',
      question: 'Амьдрал улам бүр үнэтэй болж байна.',
      options: [
        'Life is getting more and more expensive.',
        'Life is getting the more and the more expensive.',
        'Life is getting much and much expensive.',
        'Life is getting more and more expensiver.',
      ],
      answer: 'Life is getting more and more expensive.',
      explanation: '«Улам бүр» = comparative and comparative. Урт тэмдэг нэрд more and more + үндсэн хэлбэр. Энд the хэрэггүй, much and much гэсэн хэллэг байхгүй, expensive-д -er залгахгүй.',
      hint: 'more and more + тэмдэг нэр.',
    },
  ],
};
