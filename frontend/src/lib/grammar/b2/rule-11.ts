// frontend/src/lib/grammar/b2/rule-11.ts
// B2 дүрэм 11: Cleft sentences — It is … that / What … is
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule11: GrammarRule = {
  id: 11,
  title: 'Cleft sentences: It is … that / What … is',
  titleMn: 'Cleft sentences — өгүүлбэрийн нэг хэсгийг онцлох бүтэц',
  hook: '«Цонхыг хагалсан нь БАТ шүү дээ», «Надад хэрэгтэй зүйл бол АМРАЛТ» — өгүүлбэрийн хамгийн чухал хэсгийг тодруулж, онцолж хэлж сурцгаая.',
  summary: 'Cleft sentence нь энгийн өгүүлбэрийг хоёр хэсэгт «хувааж» нэг хэсгийг нь онцолдог. It + be + онцлох хэсэг + that / who … (It was John who called — залгасан нь Жон байсан). What + өгүүлбэр + be + онцлох хэсэг (What I need is a rest — надад хэрэгтэй зүйл бол амралт). Мөн All I want is …, The thing that … is …, What happened was … гэсэн хувилбарууд бий.',
  description: 'Ярианд бид чухал үгээ дуу хоолойгоор онцолдог (JOHN called, not Peter). Бичгээр, мөн илүү тод онцлохыг хүссэн үед англи хэл өгүүлбэрийн бүтцийг өөрчилдөг — үүнийг cleft sentence («хуваасан өгүүлбэр») гэнэ. Хоёр үндсэн төрөл бий. НЭГДҮГЭЭРТ, It-cleft: It + is / was + онцлох хэсэг + that / who + үлдсэн хэсэг. John broke the window → It was John who broke the window (хагалсан хүн нь Жон, өөр хүн биш). Эзэн, тусагдахуун, цаг, газар, шалтгааныг ингэж онцолж болно: It was yesterday that I saw her. It was because of the snow that we were late. Энэ бүтэц B1-ийн 13-р дүрмийн relative clause-тай төстэй харагддаг ч зорилго нь тодорхойлох биш, онцлох, ихэвчлэн «тэр биш, харин энэ» гэж залруулах явдал юм. ХОЁРДУГААРТ, What-cleft (pseudo-cleft): What + эзэн + үйл үг + is / was + онцлох хэсэг. I need a coffee → What I need is a coffee. Энд шинэ, чухал мэдээлэл өгүүлбэрийн төгсгөлд ирж, сонсогчийн хүлээлтийг үүсгэдэг. Үйлдлийг онцлох бол What … do / did + is / was + (to) V1: What she did was call the police. Бүхэл үйл явдлыг онцлох бол What happened was (that) + өгүүлбэр. What-ийн оронд All (ганц л зүйл), The thing (that), The reason (why), The place (where), The person (who) хэрэглэж болно. Монгол хэлэнд ижил утгыг «… нь … юм», «… бол …», «л», «шүү дээ» гэсэн хэлбэр, сул үгээр илэрхийлдэг: «Цонх хагалсан нь Бат» гэдэг нь бүтцээрээ ч It was Bat who broke the window-той тун ойр.',
  structure: 'It + is / was + онцлох хэсэг + that / who + clause · What + clause + is / was + онцлох хэсэг · All / The thing (that) + clause + is / was + …',
  structureParts: [
    { text: 'It', part: 'subject' },
    { text: 'is / was', part: 'verb' },
    { text: 'онцлох хэсэг', part: 'object' },
    { text: 'that / who + clause', part: 'modifier' },
    { text: '· What + clause + is / was + …', part: 'plain' },
  ],
  tip: 'It was X that / who … = «… нь X байсан» (X биш өөр зүйл гэж залруулах) · What I need is X = «надад хэрэгтэй зүйл бол X» · What he did was + V1 = үйлдлийг онцлох · All I want is X = «миний хүсэх ганц зүйл бол X».',
  examples: [
    { en: '[It](s) [was](v) [Bat](o) [who broke the window](m).', mn: 'Цонхыг хагалсан нь Бат байсан. (өөр хүн биш)' },
    { en: '[It](s) [was](v) [last week](o) [that I met her](m).', mn: 'Би түүнтэй өнгөрсөн долоо хоногт л уулзсан юм.' },
    { en: '[What I need](s) [is](v) [a long holiday](o).', mn: 'Надад хэрэгтэй зүйл бол урт амралт.' },
    { en: '[All I want](s) [is](v) [a quiet evening](o) [at home](m).', mn: 'Миний хүсэх ганц зүйл бол гэртээ тайван өнгөрөөх орой.' },
  ],
  useCases: [
    {
      title: 'It-cleft — хүн, зүйлийг онцлох (эзэн, тусагдахуун)',
      description: 'It + is / was + хүн / зүйл + who / that …. Хүнийг онцлоход who эсвэл that, зүйлийг онцлоход that хэрэглэнэ. Ихэвчлэн буруу ойлголтыг залруулах, «тэр биш, энэ» гэж ялгахад хэрэглэнэ.',
      examples: [
        { en: '[It](s) [was](v) [my sister](o) [who paid for the meal](m), [not me](m).', mn: 'Хоолны мөнгийг төлсөн нь би биш, эгч маань байсан.' },
        { en: '[It](s)[\'s](v) [the noise](o) [that bothers me](m), [not the heat](m).', mn: 'Миний санааг зовоож байгаа нь халуун биш, чимээ шуугиан юм.' },
        { en: '[It](s) [was](v) [your email](o) [that I didn\'t receive](m).', mn: 'Миний аваагүй нь чиний имэйл байсан.' },
      ],
    },
    {
      title: 'It-cleft — цаг, газар, шалтгааныг онцлох',
      description: 'Цаг, газар, шалтгаан, арга замыг мөн It is / was … that-ын дунд тавьж онцолно. Эдгээрт that хэрэглэнэ (when, where биш). Шалтгаанд because (of) …, зорилгод to + V1 орж болно.',
      examples: [
        { en: '[It](s) [was](v) [in Erdenet](o) [that we first met](m).', mn: 'Бид анх Эрдэнэтэд л танилцсан юм.' },
        { en: '[It](s) [was](v) [only yesterday](o) [that I heard the news](m).', mn: 'Би энэ мэдээг дөнгөж өчигдөр л сонссон.' },
        { en: '[It](s) [was](v) [because of the traffic](o) [that we missed the flight](m).', mn: 'Бид түгжрэлээс л болж нислэгээсээ хоцорсон юм.' },
      ],
    },
    {
      title: 'What-cleft — зүйл, санааг онцлох',
      description: 'What + эзэн + үйл үг + is / was + онцлох хэсэг. What = the thing that. Шинэ мэдээлэл төгсгөлд ирж онцлогдоно. like, need, want, love, hate, enjoy, surprise, worry зэрэг үйл үгтэй маш түгээмэл.',
      examples: [
        { en: '[What I like about this job](s) [is](v) [the freedom](o).', mn: 'Энэ ажлын надад таалагддаг зүйл бол эрх чөлөө.' },
        { en: '[What surprised me](s) [was](v) [his reaction](o).', mn: 'Намайг гайхшруулсан зүйл бол түүний хариу үйлдэл байсан.' },
        { en: '[What we need](s) [is](v) [more time](o), [not more money](m).', mn: 'Бидэнд хэрэгтэй зүйл бол илүү их мөнгө биш, илүү их цаг.' },
      ],
    },
    {
      title: 'What … do / What happened — үйлдэл, үйл явдлыг онцлох',
      description: 'Үйлдлийг онцлох бол What + эзэн + do / did + is / was + (to) V1. Бүхэл үйл явдлыг онцлох бол What happened was (that) + бүтэн өгүүлбэр. Түүх ярих, тайлбарлахад их хэрэглэнэ.',
      examples: [
        { en: '[What she did](s) [was](v) [call the police](o).', mn: 'Түүний хийсэн зүйл бол цагдаа дуудах байсан.' },
        { en: '[What you should do](s) [is](v) [talk to your manager](o).', mn: 'Чиний хийх ёстой зүйл бол менежертэйгээ ярих.' },
        { en: '[What happened](s) [was](v) [that the bus broke down](o).', mn: 'Болсон явдал нь автобус эвдэрчихсэн юм.' },
      ],
    },
    {
      title: 'All / The thing / The reason — бусад онцлох бүтэц',
      description: 'All (that) … is = «ганц л зүйл бол». The thing (that) … is = What … is. The reason (why) … is that, The place (where) … is, The person (who) … is гэж хүн, газар, шалтгааныг онцолж болно.',
      examples: [
        { en: '[All I did](s) [was](v) [ask a simple question](o).', mn: 'Би зүгээр л нэг энгийн асуулт асуусан төдий.' },
        { en: '[The thing that annoys me](s) [is](v) [his attitude](o).', mn: 'Миний уурыг хүргэдэг зүйл бол түүний хандлага.' },
        { en: '[The reason why I left](s) [was](v) [that I was exhausted](o).', mn: 'Миний явсан шалтгаан бол би туйлдаа хүртэл ядарсан байсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'It-cleft — хүн / зүйл',
      structure: 'It + is / was + noun / pronoun + who / that + clause',
      examples: [
        { en: '[It](s) [was](v) [Tuya](o) [who told me](m).', mn: 'Надад хэлсэн нь Туяа байсан.' },
        { en: '[It](s)[\'s](v) [you](o) [that I\'m worried about](m).', mn: 'Миний санаа зовж байгаа хүн бол чи.' },
        { en: '[It](s) [wasn\'t](v) [the price](o) [that put me off](m).', mn: 'Миний сонирхлыг бууруулсан нь үнэ биш байсан.' },
      ],
    },
    {
      label: 'It-cleft — цаг / газар / шалтгаан',
      structure: 'It + is / was + time / place / reason + that + clause · It was not until … that …',
      examples: [
        { en: '[It](s) [was](v) [in 2020](o) [that she moved abroad](m).', mn: 'Тэр 2020 онд л гадаад руу нүүсэн юм.' },
        { en: '[It](s) [was](v) [not until midnight](o) [that they got home](m).', mn: 'Тэд шөнө дунд болж байж л гэртээ ирсэн.' },
        { en: '[It](s)[\'s](v) [here](o) [that the accident happened](m).', mn: 'Осол яг энд л болсон юм.' },
      ],
    },
    {
      label: 'What-cleft',
      structure: 'What + subject + verb + is / was + noun / (to) V1 / that-clause',
      examples: [
        { en: '[What I love](s) [is](v) [the smell of fresh bread](o).', mn: 'Миний дуртай зүйл бол шинэхэн талхны үнэр.' },
        { en: '[What he did](s) [was](v) [resign](o) [the next day](m).', mn: 'Түүний хийсэн зүйл бол маргааш нь ажлаасаа гарах байв.' },
        { en: '[What worries me](s) [is](v) [that nobody has replied](o).', mn: 'Миний санааг зовоож байгаа зүйл бол хэн ч хариу өгөөгүй нь.' },
      ],
    },
    {
      label: 'All / The thing / The reason …',
      structure: 'All (that) / The thing (that) / The reason (why) + clause + is / was + …',
      examples: [
        { en: '[All you need](s) [is](v) [a passport](o).', mn: 'Чамд хэрэгтэй ганц зүйл бол паспорт.' },
        { en: '[The thing I miss most](s) [is](v) [my mum\'s cooking](o).', mn: 'Миний хамгийн их санадаг зүйл бол ээжийн хоол.' },
        { en: '[The person who helped me](s) [was](v) [a complete stranger](o).', mn: 'Надад тусалсан хүн бол огт танихгүй хүн байсан.' },
      ],
    },
  ],
  signalWords: ['It is … that', 'It was … who', 'It was not until … that', 'What I need is', 'What happened was', 'What … did was', 'All I want is', 'The thing that … is', 'The reason why … is'],
  notes: [
    'It-cleft-д be үйл үг үргэлж ганц тоонд: It is / It was. Онцлох үг олон тоотой байсан ч It were гэхгүй: It was my parents who paid.',
    'that / who-ийн дараах үйл үг онцолж буй үгтэй тохирно: It is my parents who pay (they pay). It is Bat who pays (he pays).',
    'Хүнийг онцлоход who эсвэл that хоёулаа болно. Цаг, газар, шалтгааныг онцлоход that хэрэглэнэ — It was in June that we met (when, where биш). Зүйлийг онцлоход which биш, that.',
    'What-cleft-ийн be нь What-тай өгүүлбэрийн цагтай тохирно: What I need is … (одоо), What I needed was … (өнгөрсөн). What-ийн хэсэг ганц тоо гэж тооцогдоно: What I need is two days off.',
    'What … do бүтцийн ард V1 эсвэл to V1 хоёулаа зөв: What I did was (to) call him. Харин called, calling гэж хувиргахгүй. Үргэлжилж буй үйлдэлд: What I\'m doing is trying to help.',
    'What-cleft-ийг эргүүлж болно: A long holiday is what I need. Харин All-ын ард what хэрэглэхгүй: All what I need (буруу) → All (that) I need (зөв).',
  ],
  commonMistakes: [
    {
      wrong: 'It was Tom which broke the vase.',
      correct: 'It was Tom who broke the vase. / It was Tom that broke the vase.',
      explanation: 'Хүнийг онцлоход who эсвэл that. which нь cleft sentence-д хэрэглэгдэхгүй, ялангуяа хүнд огт тохирохгүй.',
    },
    {
      wrong: 'What I need it is a good rest.',
      correct: 'What I need is a good rest.',
      explanation: 'What I need өөрөө өгүүлбэрийн эзэн. Ард нь it давхар эзэн нэмэхгүй. Монголоор «хэрэгтэй зүйл бол — тэр нь …» гэж бодсоноос it нэмэх алдаа гардаг.',
    },
    {
      wrong: 'All what I want is some peace and quiet.',
      correct: 'All I want is some peace and quiet. / All that I want is some peace and quiet.',
      explanation: 'All-ын ард what ирэхгүй. All (that) + өгүүлбэр. what = the thing that тул all-тай давхардана.',
    },
    {
      wrong: 'What he did was called his lawyer.',
      correct: 'What he did was call his lawyer.',
      explanation: 'What … did was-ын ард үйл үг үндсэн хэлбэрээр (V1 эсвэл to V1). Өнгөрсөн цагийг did, was аль хэдийн үзүүлсэн тул called гэж давхар хувиргахгүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «Цонх хагалсан нь Бат» гэж үйлт нэр + «нь» хэлбэрээр онцолдог. Энэ нь It was Bat who broke the window-той яг адил утгатай: «хагалсан нь» = who broke, «Бат» = онцлох хэсэг. Монгол өгүүлбэрт «нь», «юм», «шүү дээ» байвал англиар cleft sentence тохирох магадлал өндөр.',
      'Монголоор «л» сул үг онцлох үүрэгтэй: «Өчигдөр л сонссон» = It was only yesterday that I heard. Англи хэлэнд ийм сул үг байхгүй тул онцлолыг бүтцээр (It was … that) эсвэл only, just гэсэн үгээр илэрхийлнэ.',
      'Монголоор «Надад хэрэгтэй зүйл бол амралт» гэдэг нь What I need is a rest-тэй үг үгээрээ таардаг: «хэрэгтэй зүйл» = What I need, «бол» = is. Гэхдээ монголд «зүйл» гэдэг нэр үг заавал ордог бол англиар What ганцаараа «зүйл»-ийн утгыг агуулна (the thing what гэж давхардуулахгүй).',
      'Монгол хэлэнд хоосон эзэн It байдаггүй тул суралцагчид It was …-ийг орхиж, эсвэл What-cleft-д it нэмэх алдаа гаргадаг. Санах нь: It-cleft үргэлж It-ээр эхэлнэ, What-cleft-д it огт байхгүй.',
    ],
  },
  dialogue: [
    {
      en: 'Nomin, [why](m) [did](v) [you](s) [tell](v) [the boss](o) [about my mistake](m)?',
      mn: 'Номин, чи яагаад миний алдааны тухай даргад хэлсэн юм бэ?',
      speaker: 'Temuulen',
    },
    {
      en: '[It](s) [wasn\'t](v) [me](o) [who told him](m). [It](s) [was](v) [Bat](o) [who mentioned it](m).',
      mn: 'Түүнд хэлсэн нь би биш. Үүнийг дурдсан нь Бат байсан.',
      speaker: 'Nomin',
    },
    {
      en: 'Really? [What I don\'t understand](s) [is](v) [why he did that](o).',
      mn: 'Нээрээ юу? Миний ойлгохгүй байгаа зүйл бол тэр яагаад тэгсэн нь.',
      speaker: 'Temuulen',
    },
    {
      en: '[What happened](s) [was](v) [that the boss asked him directly](o). [All he did](s) [was](v) [answer honestly](o).',
      mn: 'Болсон явдал нь дарга түүнээс шууд асуусан юм. Тэр зүгээр л үнэнээр хариулсан төдий.',
      speaker: 'Nomin',
    },
    {
      en: 'I see. [The thing that worries me](s) [is](v) [the report](o). [It](s)[\'s](v) [on Friday](o) [that we have to hand it in](m).',
      mn: 'Ойлголоо. Миний санааг зовоож байгаа зүйл бол тайлан. Бид үүнийг баасан гарагт л өгөх ёстой шүү дээ.',
      speaker: 'Temuulen',
    },
    {
      en: 'Don\'t panic. [What you should do](s) [is](v) [fix the numbers](o) [today](m). [I](s)[\'ll help](v) [you](o).',
      mn: 'Бүү сандар. Чиний хийх ёстой зүйл бол өнөөдөр тоонуудаа засах. Би чамд тусалъя.',
      speaker: 'Nomin',
    },
  ],
  quiz: [
    {
      id: 'b2-11-1',
      ruleId: 11,
      kind: 'fill',
      question: 'It was my sister ___ lent me the money, not my brother.',
      options: ['who', 'which', 'what', 'whom'],
      answer: 'who',
      explanation: 'It-cleft-д хүнийг (my sister) онцлоход who (эсвэл that). which хүнд хэрэглэгдэхгүй, what cleft-ийн энэ байрлалд орохгүй, whom нь тусагдахууны хэлбэр — энд sister бол lent үйл үгийн эзэн.',
      hint: 'Онцолж буй үг нь хүн, бас үйлдлийн эзэн.',
    },
    {
      id: 'b2-11-2',
      ruleId: 11,
      kind: 'fill',
      question: '___ I really need right now is a long holiday.',
      options: ['What', 'That', 'It', 'Which'],
      answer: 'What',
      explanation: 'What-cleft: What + I need + is + онцлох хэсэг. What = the thing that («надад хэрэгтэй зүйл»). That, Which ингэж өгүүлбэр эхлүүлж чадахгүй, It бол It is … that бүтцэд хэрэглэгдэнэ.',
      hint: '«Надад хэрэгтэй зүйл бол …».',
    },
    {
      id: 'b2-11-3',
      ruleId: 11,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'It was in 2019 when that we first met.',
        'What I like about him is his sense of humour.',
        'It was Tom which broke the window.',
        'What happened was that the car broken down.',
      ],
      answer: 'What I like about him is his sense of humour.',
      explanation: 'What + өгүүлбэр + is + нэр үг — зөв What-cleft. Цагийг онцлоход зөвхөн that (when that биш); хүнд which биш who / that; What happened was that-ын ард бүтэн өгүүлбэр зөв цагтаа (the car broke down).',
      hint: 'What + clause + is + онцлох хэсэг.',
    },
    {
      id: 'b2-11-4',
      ruleId: 11,
      kind: 'translate',
      question: 'Надад хэрэгтэй ганц зүйл бол жаахан цаг.',
      options: [
        'All I need is a little time.',
        'All what I need is a little time.',
        'It is all I need a little time.',
        'All that I need it is a little time.',
      ],
      answer: 'All I need is a little time.',
      explanation: '«Ганц зүйл бол» = All (that) + өгүүлбэр + is. All-ын ард what ирэхгүй, эзний дараа it давхар нэмэхгүй.',
      hint: 'All + I need + is …',
    },
  ],
};
