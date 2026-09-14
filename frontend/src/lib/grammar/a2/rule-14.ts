// frontend/src/lib/grammar/a2/rule-14.ts
// A2 дүрэм 14: Comparatives & superlatives
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule14: GrammarRule = {
  id: 14,
  title: 'Comparatives & superlatives',
  titleMn: 'Харьцуулсан ба хамгийн зэрэг — -аас илүү, хамгийн',
  hook: 'Улаанбаатар Дархнаас том. Харин Монголын хамгийн том хот аль вэ? — «-аас том», «хамгийн том» гэдгийг англиар яаж хэлэх вэ?',
  summary: 'Хоёр зүйлийг харьцуулахад богино тэмдэг нэрэнд -er, урт тэмдэг нэрийн өмнө more нэмээд than-аар холбоно: bigger than, more interesting than. Гурав ба түүнээс олон зүйлээс хамгийн нь гэхэд the + -est / the most хэрэглэнэ: the biggest, the most interesting.',
  description: 'Хоёр хүн, юмыг харьцуулахад тэмдэг нэрийн харьцуулсан зэрэг (comparative), гурав ба түүнээс олноос хамгийнхыг ялгахад хамгийн зэрэг (superlative) хэрэглэнэ. Аль хэлбэрийг сонгохыг тэмдэг нэрийн урт шийднэ: нэг үет богино үгэнд -er / -est залгана (tall → taller → the tallest), хоёр ба түүнээс олон үет урт үгийн өмнө more / the most тавина (expensive → more expensive → the most expensive). -y-ээр төгссөн хоёр үет үг богино үг шиг -ier / -iest авна: happy → happier → the happiest. Цөөн хэдэн үг өөрийн онцгой хэлбэртэй: good → better → the best, bad → worse → the worst. Харьцуулсан зэргийн ард than (…-аас) ирдэг бол хамгийн зэргийн өмнө үргэлж the тавина. Монголоор «-аас илүү том», «хамгийн том» гэж тусдаа үгээр хэлдэг бол англиар тэмдэг нэр өөрөө хувирдаг гэдгийг санаарай. Мөн дайвар үгийг адилхан харьцуулж болно: faster, more slowly, better.',
  structure: 'A + be + adjective-er / more adjective + than + B · the + adjective-est / the most adjective',
  structureParts: [
    { text: 'A', part: 'subject' },
    { text: 'be', part: 'verb' },
    { text: 'adjective-er / more adjective', part: 'object' },
    { text: 'than B', part: 'modifier' },
    { text: '·', part: 'plain' },
    { text: 'the adjective-est / the most adjective', part: 'object' },
  ],
  tip: 'Богино үг → -er / -est · Урт үг → more / the most · Хамгийн зэрэгт the заавал · Харьцуулбал than. Санах: «-er = -аас илүү, the -est = хамгийн».',
  examples: [
    { en: '[Ulaanbaatar](s) [is](v) [bigger](o) [than Darkhan](m).', mn: 'Улаанбаатар Дархнаас том.' },
    { en: '[This book](s) [is](v) [more interesting](o) [than that one](m).', mn: 'Энэ ном тэр номоос илүү сонирхолтой.' },
    { en: '[Mount Everest](s) [is](v) [the highest mountain](o) [in the world](m).', mn: 'Эверест бол дэлхийн хамгийн өндөр уул.' },
    { en: '[She](s) [is](v) [the most careful driver](o) [in our family](m).', mn: 'Тэр манай гэр бүлийн хамгийн болгоомжтой жолооч.' },
  ],
  useCases: [
    {
      title: 'Хоёр зүйлийг харьцуулах — than',
      description: 'Нэг зүйл нөгөөгөөс ямар байгааг хэлэхэд харьцуулсан зэрэг + than хэрэглэнэ. Монголоор «-аас» гэдэг нөхцөл than-ийн үүргийг гүйцэтгэдэг. than-ийн ард нэр үг, төлөөний үг (me, him) эсвэл бүтэн өгүүлбэр ирж болно.',
      examples: [
        { en: '[My brother](s) [is](v) [taller](o) [than me](m).', mn: 'Миний ах надаас өндөр.' },
        { en: '[The train](s) [is](v) [cheaper](o) [than the plane](m).', mn: 'Галт тэрэг онгоцноос хямд.' },
        { en: '[Today](s) [is](v) [colder](o) [than yesterday](m).', mn: 'Өнөөдөр өчигдрөөс хүйтэн байна.' },
      ],
    },
    {
      title: 'Олноос хамгийнхыг ялгах — the …-est / the most',
      description: 'Гурав ба түүнээс олон зүйлийн дундаас хамгийнхыг хэлэхэд хамгийн зэрэг хэрэглэнэ. Өмнө нь the заавал орно. Ардаа ихэвчлэн in + газар (in the class, in the world) эсвэл of + бүлэг (of all) ирдэг.',
      examples: [
        { en: '[Bat](s) [is](v) [the youngest student](o) [in the class](m).', mn: 'Бат бол ангийн хамгийн бага сурагч.' },
        { en: '[This](s) [is](v) [the most expensive phone](o) [in the shop](m).', mn: 'Энэ бол дэлгүүрийн хамгийн үнэтэй утас.' },
        { en: '[January](s) [is](v) [the coldest month](o) [of the year](m).', mn: 'Нэгдүгээр сар бол жилийн хамгийн хүйтэн сар.' },
      ],
    },
    {
      title: 'Дайвар үгийг харьцуулах',
      description: 'Үйлдлийг хэрхэн хийж байгааг харьцуулахад дайвар үгийг ч харьцуулна. Богино дайвар үг (fast, hard, early) -er авна, -ly-ээр төгссөн дайвар үг more / the most авна. well → better → the best, badly → worse → the worst гэдгийг цээжлээрэй.',
      examples: [
        { en: '[Saraa](s) [runs](v) [faster](m) [than her brother](m).', mn: 'Сараа ахаасаа хурдан гүйдэг.' },
        { en: '[Please](m) [speak](v) [more slowly](m).', mn: 'Илүү удаан ярьж өгнө үү.' },
        { en: '[He](s) [plays](v) [the guitar](o) [better](m) [than me](m).', mn: 'Тэр надаас илүү сайн гитар тоглодог.' },
      ],
    },
    {
      title: 'Ялгааг хүчтэй, сул хэлэх — much / a lot / a little',
      description: 'Хоёр зүйлийн ялгаа хэр их болохыг харьцуулсан зэргийн өмнө much, a lot, far (их) эсвэл a little, a bit (жаахан) тавьж хэлнэ. Харьцуулсан зэргийн өмнө very тавихгүй: «very bigger» буруу.',
      examples: [
        { en: '[The new road](s) [is](v) [much wider](o) [than the old one](m).', mn: 'Шинэ зам хуучнаасаа хамаагүй өргөн.' },
        { en: '[This hotel](s) [is](v) [a lot more comfortable](o).', mn: 'Энэ зочид буудал хамаагүй тухтай.' },
        { en: '[Her flat](s) [is](v) [a little smaller](o) [than mine](m).', mn: 'Түүний байр минийхээс жаахан жижиг.' },
      ],
    },
    {
      title: 'Адилхан гэж хэлэх — as … as',
      description: 'Хоёр зүйл адилхан гэдгийг as + тэмдэг нэр + as гэж хэлнэ. Үгүйсгэвэл not as … as болж «тийм … биш» гэсэн утгатай, харьцуулсан зэргийн зөөлөн хувилбар болдог.',
      examples: [
        { en: '[Bat](s) [is](v) [as tall as](o) [his father](m).', mn: 'Бат аав шигээ өндөр.' },
        { en: '[This test](s) [wasn\'t](v) [as difficult as](o) [the last one](m).', mn: 'Энэ шалгалт өмнөх шигээ хэцүү байгаагүй.' },
        { en: '[My phone](s) [is](v) [as old as](o) [yours](m).', mn: 'Миний утас чинийх шиг хуучин.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Богино тэмдэг нэр (-er / -est)',
      structure: 'tall → taller → the tallest · big → bigger → the biggest · happy → happier → the happiest',
      examples: [
        { en: '[Your bag](s) [is](v) [heavier](o) [than mine](m).', mn: 'Чиний цүнх минийхээс хүнд.' },
        { en: '[Sunday](s) [was](v) [the hottest day](o) [of the week](m).', mn: 'Ням гараг долоо хоногийн хамгийн халуун өдөр байсан.' },
        { en: '[She](s) [is](v) [the happiest person](o) [I know](m).', mn: 'Тэр бол миний мэдэх хамгийн аз жаргалтай хүн.' },
      ],
    },
    {
      label: 'Урт тэмдэг нэр (more / the most)',
      structure: 'expensive → more expensive → the most expensive',
      examples: [
        { en: '[Flying](s) [is](v) [more expensive](o) [than taking the bus](m).', mn: 'Онгоцоор нисэх нь автобусаар явахаас илүү үнэтэй.' },
        { en: '[Maths](s) [is](v) [more difficult](o) [than history](m) [for me](m).', mn: 'Миний хувьд математик түүхээс илүү хэцүү.' },
        { en: '[It](s) [was](v) [the most beautiful place](o) [on our trip](m).', mn: 'Тэр бол манай аяллын хамгийн үзэсгэлэнтэй газар байсан.' },
      ],
    },
    {
      label: 'Онцгой хэлбэрүүд',
      structure: 'good → better → the best · bad → worse → the worst · far → further → the furthest',
      examples: [
        { en: '[Her English](s) [is](v) [better](o) [than mine](m).', mn: 'Түүний англи хэл минийхээс сайн.' },
        { en: '[The weather](s) [is](v) [worse](o) [today](m).', mn: 'Өнөөдөр цаг агаар илүү муу байна.' },
        { en: '[This](s) [is](v) [the best restaurant](o) [in town](m).', mn: 'Энэ бол хотын хамгийн сайн ресторан.' },
      ],
    },
    {
      label: 'Дайвар үгтэй',
      structure: 'fast → faster → the fastest · slowly → more slowly → the most slowly · well → better → the best',
      examples: [
        { en: '[Bat](s) [works](v) [harder](m) [than anyone](m) [in the office](m).', mn: 'Бат оффис дахь хэнээс ч илүү шаргуу ажилладаг.' },
        { en: '[She](s) [drives](v) [the most carefully](m) [of all my friends](m).', mn: 'Тэр миний бүх найзуудаас хамгийн болгоомжтой машин жолооддог.' },
        { en: '[I](s) [slept](v) [worse](m) [than usual](m) [last night](m).', mn: 'Би өчигдөр шөнө ердийнхөөсөө муу унтсан.' },
      ],
    },
  ],
  signalWords: ['than', 'the most', 'the -est', 'as … as', 'much', 'a lot', 'a little', 'in the world', 'of all'],
  notes: [
    'Зөв бичих дүрэм: нэг эгшиг + нэг гийгүүлэгчээр төгссөн богино үгийн сүүлийн гийгүүлэгчийг давхарлана: big → bigger, hot → hotter, thin → thinner. -e-ээр төгссөн бол зөвхөн -r / -st нэмнэ: nice → nicer, large → largest.',
    'Гийгүүлэгч + y-ээр төгссөн үгийн y нь i болно: happy → happier → the happiest, easy → easier, busy → busiest. Хоёр үетэй ч энэ үгс -er / -est авна.',
    'Онцгой хэлбэрүүд: good → better → best, bad → worse → worst, far → further / farther → furthest, little → less → least, many / much → more → most. Эдгээрт -er залгахгүй: «gooder», «badder» гэж байхгүй.',
    'Харьцуулсан зэргийн ард than, хамгийн зэргийн өмнө the. «bigger that» гэж бичдэг алдаа их гардаг — than үг «а» үсэгтэй.',
    'Хамгийн зэргийн ардаа in + газар, бүлэг (in the class, in the world, in my family) эсвэл of + хугацаа, бүлэг (of the year, of all) ирнэ. «of the world» биш, in the world.',
    'than-ийн ард төлөөний үгийн тусагдахуун хэлбэр ярианы хэлэнд түгээмэл: taller than me, better than him. «than I am» ч мөн зөв, гэхдээ илүү албан ёсны.',
  ],
  commonMistakes: [
    {
      wrong: 'This phone is more cheaper than that one.',
      correct: 'This phone is cheaper than that one.',
      explanation: 'Нэг тэмдэг нэрэнд more болон -er хоёрыг давхар хэрэглэхгүй. cheap богино үг тул зөвхөн -er авна.',
    },
    {
      wrong: 'She is the most tall girl in the class.',
      correct: 'She is the tallest girl in the class.',
      explanation: 'tall нэг үет богино үг тул -est авна. the most зөвхөн урт тэмдэг нэртэй хэрэглэнэ: the most beautiful.',
    },
    {
      wrong: 'Bat is taller from me.',
      correct: 'Bat is taller than me.',
      explanation: 'Монголоор «надаас өндөр» гэдгийг from гэж орчуулах алдаа гардаг. Англиар харьцуулалтад үргэлж than хэрэглэнэ.',
    },
    {
      wrong: 'He is best player in the team.',
      correct: 'He is the best player in the team.',
      explanation: 'Хамгийн зэргийн өмнө the заавал орно. Монголоор «хамгийн» гэхэд ялгац гишүүн байдаггүй тул the-г мартах алдаа их гардаг.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «Бат Дорждоос өндөр» гэхэд тэмдэг нэр «өндөр» хувирахгүй, харьцуулалтыг «-аас» нөхцөл л зааж өгдөг. Англиар than нөхцөлийн үүргийг гүйцэтгэдэг боловч тэмдэг нэр өөрөө заавал хувирна: taller. than-ийг тавьчихаад тэмдэг нэрээ хувиргахаа мартахгүй байгаарай.',
      'Монголоор «хамгийн» гэсэн тусдаа үгийг ямар ч тэмдэг нэрийн өмнө тавьдаг: хамгийн том, хамгийн сонирхолтой. Англиар богино үгэнд -est, урт үгэнд the most гэж хоёр өөр арга байдаг бөгөөд урд нь the заавал орно.',
      'Монголоор «илүү» гэдэг үгийг «илүү сайн», «илүү хурдан» гэх мэт хүссэн тэмдэг нэр, дайвар үгийн өмнө чөлөөтэй тавьдаг. Англиар more зөвхөн урт үгтэй; better, faster гэж хэлэхэд more хэрэггүй. «more better» бол монголоос хуулсан алдаа.',
      'Монголоор «Бат аав шигээ өндөр» гэхэд «шиг» гэдэг нэг үг адил байдлыг заадаг. Англиар as tall as гэж тэмдэг нэрийг хоёр талаас нь as-аар хашдаг. Хоёр дахь as-ийг орхивол өгүүлбэр буруу болно.',
    ],
  },
  dialogue: [
    {
      en: '[Which](o) [is](v) [better](o) [for our trip](m), the train or the bus?',
      mn: 'Манай аялалд аль нь дээр вэ, галт тэрэг үү, автобус уу?',
      speaker: 'Bat',
    },
    {
      en: '[The train](s) [is](v) [faster](o) [than the bus](m), [but](m) [it](s)[\'s](v) [much more expensive](o).',
      mn: 'Галт тэрэг автобусаас хурдан, гэхдээ хамаагүй үнэтэй.',
      speaker: 'Saraa',
    },
    {
      en: '[How much](o) [is](v) [the ticket](s)?',
      mn: 'Тасалбар нь хэд вэ?',
      speaker: 'Bat',
    },
    {
      en: '[The bus](s) [is](v) [the cheapest option](o). [It](s)[\'s](v) [only 20,000 tugriks](o).',
      mn: 'Автобус бол хамгийн хямд сонголт. Ердөө 20 000 төгрөг.',
      speaker: 'Saraa',
    },
    {
      en: '[But](m) [the bus](s) [is](v) [not as comfortable as](o) [the train](m). [My back](s) [hurts](v) [after long trips](m).',
      mn: 'Гэхдээ автобус галт тэрэг шиг тухтай биш. Урт аялалын дараа нуруу минь өвддөг.',
      speaker: 'Bat',
    },
    {
      en: 'Okay, [let\'s take](v) [the train](o). [Comfort](s) [is](v) [the most important thing](o)!',
      mn: 'За тэгвэл галт тэргээр явъя. Тухтай байх нь хамгийн чухал!',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-14-1',
      ruleId: 14,
      kind: 'fill',
      question: 'My new laptop is ___ than my old one.',
      options: ['more fast', 'faster', 'fastest', 'the fastest'],
      answer: 'faster',
      explanation: 'Хоёр зүйлийг than-аар харьцуулж байгаа тул харьцуулсан зэрэг. fast богино үг тул -er авна, more fast буруу. fastest / the fastest бол хамгийн зэрэг — than-тай хамт орохгүй.',
      hint: 'than байна — хоёр зүйлийг харьцуулж байна.',
    },
    {
      id: 'a2-14-2',
      ruleId: 14,
      kind: 'fill',
      question: 'This is ___ film I have ever seen.',
      options: ['the most interesting', 'the interestingest', 'more interesting', 'most interesting'],
      answer: 'the most interesting',
      explanation: 'interesting урт үг тул the most. -est залгахгүй. more interesting бол харьцуулсан зэрэг, энд «хамгийн» гэсэн утга хэрэгтэй. the-гүй most interesting хамгийн зэрэг болж чадахгүй.',
      hint: 'Урт тэмдэг нэр, «хамгийн» утгатай — the-гээ бүү мартаарай.',
    },
    {
      id: 'a2-14-3',
      ruleId: 14,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Her English is more good than mine.',
        'Her English is gooder than mine.',
        'Her English is better than mine.',
        'Her English is better from mine.',
      ],
      answer: 'Her English is better than mine.',
      explanation: 'good онцгой хэлбэртэй: better. more good, gooder гэж байхгүй. Харьцуулалтад from биш than хэрэглэнэ.',
      hint: 'good-ын харьцуулсан зэрэг дүрэм дагадаггүй.',
    },
    {
      id: 'a2-14-4',
      ruleId: 14,
      kind: 'translate',
      question: 'Энэ бол хотын хамгийн том дэлгүүр.',
      options: [
        'This is the most big shop in the city.',
        'This is the biggest shop in the city.',
        'This is bigger shop in the city.',
        'This is the bigest shop of the city.',
      ],
      answer: 'This is the biggest shop in the city.',
      explanation: 'big богино үг тул -est, сүүлийн g давхарлана: biggest. the most big буруу; bigger бол харьцуулсан зэрэг; bigest зөв бичгийн алдаа, мөн газар заахад in the city гэнэ.',
      hint: 'Богино үг, нэг эгшиг + нэг гийгүүлэгчээр төгсдөг.',
    },
  ],
};
