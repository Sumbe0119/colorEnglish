// frontend/src/lib/grammar/c1/rule-06.ts
// C1 дүрэм 6: Modal nuances — may well / might as well / be bound to
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule06: GrammarRule = {
  id: 6,
  title: 'Modal nuances: may well / might as well / be bound to',
  titleMn: 'Модаль үгсийн нарийн өнгө аяс — магадлал өндөр, тэгсэн нь дээр, гарцаагүй',
  hook: '«Чиний зөв байх магадлал өндөр», «Хүлээгээд яах вэ, явчихъя», «Тэр гарцаагүй хоцорно» — магадлал, хандлагаа төрөлх хэлтэн шиг нарийн ялгаж сурцгаая.',
  summary: 'may / might / could well + V1 нь «нэлээд магадлалтай», might / may as well + V1 нь «өөр дээр сонголт алга, тэгчихье», be bound to / be certain to нь «гарцаагүй болно», be likely / unlikely to нь «магадлал өндөр / бага» гэсэн утгатай. will / would нь таамаглал ба хэвшсэн занг, should нь хүлээлтийг, can\'t help + V-ing нь «өөрийн эрхгүй» гэдгийг илэрхийлнэ.',
  description: 'B1-ийн 10-р дүрэмд бид таамаглалын гурван шатыг үзсэн: must (гарцаагүй), might / may / could (магадгүй), can\'t (байж таарахгүй). B2-ийн 4-р дүрэмд өнгөрсний модаль хэлбэрүүдийг (should have, could have, needn\'t have) нэмсэн. C1 түвшинд энэ гурван шатны ХООРОНДОХ нарийн өнгө аясыг ялгаж сурна. Нэг жижиг үг утгыг эрс өөрчилдөг: may well нь might-аас хүчтэй («нэлээд магадлалтай»), харин may as well огт өөр — «өөр дээр сонголт байхгүй тул тэгсэн нь дээр» гэсэн хайхрамжгүй санал. be bound to нь ирээдүйн тухай «зайлшгүй болно» гэсэн итгэлийг, be likely / unlikely to нь магадлалыг тэмдэг нэрээр илэрхийлдэг тул бичгийн болон албан хэлэнд их тохирно. will нь зөвхөн ирээдүй биш: That will be Bat (Бат байх) гэж одоогийн таамаглалыг, He will leave the door open (тэр заавал л хаалгаа онгорхой орхидог) гэж хэвшсэн, ядаргаатай занг заана; would нь эдгээрийн өнгөрсөн хэлбэр. should нь «ёстой» гэсэн зөвлөгөөнөөс гадна «тэгэх учиртай» гэсэн хүлээлтийг (They should be here soon), can\'t help + V-ing нь өөрийгөө барьж чадахгүй байгааг илэрхийлнэ. Хэв маягийн хувьд may well, be likely to, be bound to нь төвийг сахисан буюу албан бичигт тохиромжтой, might as well болон can\'t help нь ярианы хэлэнд түгээмэл. Монгол хэлэнд эдгээр өнгө аясыг модаль үйл үгээр биш, «байх», «биз», «бололтой», «гарцаагүй», «л», «даа» зэрэг сул үг, дагавраар гаргадаг тул англиар аль бүтцийг сонгохоо монгол орчуулгын өнгөнөөс нь барьж авах хэрэгтэй.',
  structure: 'Subject + may / might / could + well + V1 · Subject + might / may + as well + V1 · Subject + be bound / certain / likely / unlikely + to + V1 · can\'t help + V-ing',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'may well / might as well', part: 'verb' },
    { text: 'Verb1', part: 'verb' },
    { text: '· be bound / likely to + Verb1', part: 'modifier' },
  ],
  tip: 'may well = «нэлээд магадлалтай» · might as well = «тэгсэн нь дээр, өөр сонголт алга» · be bound to = «гарцаагүй болно» · be likely / unlikely to = «магадлал өндөр / бага» · That\'ll be… = «… байх» · can\'t help + V-ing = «өөрийн эрхгүй».',
  examples: [
    { en: '[You](s) [may well be](v) [right](o).', mn: 'Чиний зөв байх магадлал нэлээд өндөр.' },
    { en: '[The shop](s) [is](v) [closed](o). [We](s) [might as well go](v) [home](m).', mn: 'Дэлгүүр хаалттай байна. Гэртээ харьсан нь дээр байх. (өөр хийх юм алга)' },
    { en: '[He](s) [is bound to forget](v) [his keys](o) [again](m).', mn: 'Тэр түлхүүрээ дахиад л мартах нь гарцаагүй.' },
    { en: '[I](s) [can\'t help thinking](v) [we\'ve made a mistake](o).', mn: 'Бид алдаа гаргасан юм биш биз гэж өөрийн эрхгүй бодоод байна.' },
  ],
  useCases: [
    {
      title: 'Нэлээд магадлалтай — may / might / could well',
      description: 'well нэмэхэд магадлал өснө: might = «магадгүй» (50%), may well / might well / could well = «нэлээд магадлалтай, байж ч мэднэ» (70% орчим). Өнгөрсний тухай бол may well have + V3. Албан болон ярианы хэлэнд хоёуланд нь хэрэглэнэ.',
      examples: [
        { en: '[The government](s) [may well lose](v) [the next election](o).', mn: 'Засгийн газар дараагийн сонгуульд ялагдах магадлал нэлээд өндөр.' },
        { en: '[She](s) [might well have missed](v) [the train](o).', mn: 'Тэр галт тэрэгнээсээ хоцорсон байж ч мэднэ.' },
        { en: '[This](s) [could well be](v) [the best film of the year](o).', mn: 'Энэ оны шилдэг кино байж ч магадгүй шүү.' },
      ],
    },
    {
      title: 'Өөр дээр сонголт алга — might as well / may as well',
      description: 'Ямар нэг зүйлийг хийх онцгой хүсэлгүй ч өөр сайн сонголт байхгүй, эсвэл хийсэн ч хийгээгүй ч ялгаагүй үед «тэгчихье дээ», «тэгсэн нь дээр» гэсэн хайхрамжгүй санал. might as well нь may as well-ээс түгээмэл. may well-тэй утга нь огт өөр гэдгийг анхаар.',
      examples: [
        { en: '[The film](s) [has already started](v). [We](s) [might as well watch](v) [something](o) [at home](m).', mn: 'Кино аль хэдийн эхэлчихэж. Гэртээ нэг юм үзсэн нь дээр байх.' },
        { en: '[You](s) [may as well tell](v) [her](o) [the truth](o) — [she](s)[\'ll find out](v) [anyway](m).', mn: 'Чи түүнд үнэнээ хэлчихсэн нь дээр — тэр ямар ч байсан мэдэх болно.' },
        { en: '[Nobody](s) [listens](v) [to me](m). [I](s) [might as well be talking](v) [to the wall](m).', mn: 'Хэн ч намайг сонсдоггүй. Би хананд яриад байгаатай л ялгаагүй.' },
      ],
    },
    {
      title: 'Магадлалын шатлал — be bound to / be certain to / be likely to / be unlikely to',
      description: 'Ирээдүйн тухай таамаглалыг be + тэмдэг нэр + to + V1-ээр илэрхийлнэ. be bound to / be certain to / be sure to = гарцаагүй; be likely to = магадлал өндөр; be unlikely to = магадлал бага. likely, certain-ийг It is likely / certain that … гэж ч эхлүүлж болно. Мэдээ, тайлан, эрдэм шинжилгээний бичигт маш түгээмэл.',
      examples: [
        { en: '[Prices](s) [are bound to rise](v) [next year](m).', mn: 'Ирэх жил үнэ өсөх нь гарцаагүй.' },
        { en: '[The talks](s) [are likely to continue](v) [until Friday](m).', mn: 'Хэлэлцээ баасан гараг хүртэл үргэлжлэх магадлалтай.' },
        { en: '[He](s) [is unlikely to accept](v) [such a low offer](o).', mn: 'Тэр ийм бага саналыг хүлээж авах нь юу л бол.' },
      ],
    },
    {
      title: 'Таамаглал ба хэвшсэн зан — will / would',
      description: 'will + be / V1 нь одоогийн тухай итгэлтэй таамаглал (That\'ll be the postman — шуудан зөөгч байх), will have + V3 нь аль хэдийн болсон гэсэн таамаглал. Мөн will нь хэвшсэн, ихэвчлэн ядаргаатай зан үйлийг заана (He will keep interrupting — заавал л яриа таслаад байдаг); өнгөрсөнд would.',
      examples: [
        { en: '[There](s)[\'s](v) [someone](o) [at the door](m). — [That](s) [will be](v) [the delivery](o).', mn: 'Хаалган дээр хүн ирлээ. — Хүргэлт байх аа.' },
        { en: '[They](s) [will have landed](v) [by now](m).', mn: 'Тэд одоо гэхэд газардчихсан байгаа.' },
        { en: '[She](s) [will leave](v) [her things](o) [all over the house](m).', mn: 'Тэр юмаа заавал л гэр дүүрэн тараагаад орхидог.' },
      ],
    },
    {
      title: 'Хүлээлт ба өөрийн эрхгүй үйлдэл — should / can\'t help + V-ing',
      description: 'should нь зөвлөгөөнөөс гадна «бүх зүйл хэвийн бол тэгэх учиртай» гэсэн хүлээлтийг заана: should + V1 (одоо / ирээдүй), should have + V3 (өдийд болсон байх учиртай). can\'t help + V-ing нь «-хгүй байж чадахгүй», «өөрийн эрхгүй» гэсэн утгатай; өнгөрсөнд couldn\'t help.',
      examples: [
        { en: '[The parcel](s) [should arrive](v) [tomorrow morning](m).', mn: 'Илгээмж маргааш өглөө ирэх ёстой. (тэгж хүлээж байна)' },
        { en: '[They](s) [should have received](v) [my email](o) [by now](m).', mn: 'Тэд өдийд миний имэйлийг авчихсан байх учиртай.' },
        { en: '[She](s) [couldn\'t help laughing](v) [at his joke](m).', mn: 'Тэр түүний онигоонд өөрийн эрхгүй инээчихэв.' },
      ],
    },
  ],
  forms: [
    {
      label: 'may / might / could well',
      structure: 'may / might / could + well + V1 · may / might / could + well + have + V3 (өнгөрсөн)',
      examples: [
        { en: '[It](s) [may well rain](v) [this afternoon](m).', mn: 'Өнөөдөр үдээс хойш бороо орох магадлал өндөр.' },
        { en: '[You](s) [might well find](v) [the course](o) [too easy](o).', mn: 'Чамд энэ курс хэтэрхий амархан санагдаж ч мэднэ.' },
        { en: '[He](s) [may well have forgotten](v) [about the meeting](o).', mn: 'Тэр хурлын тухай мартчихсан байж ч мэднэ.' },
      ],
    },
    {
      label: 'might / may as well',
      structure: 'might / may + as well + V1',
      examples: [
        { en: '[It](s)[\'s](v) [only a ten-minute walk](o). [We](s) [might as well walk](v).', mn: 'Арав л минут алхах зайтай. Алхчихъя даа.' },
        { en: '[Since you\'re here](m), [you](s) [may as well stay](v) [for dinner](m).', mn: 'Нэгэнт ирсэн юм чинь оройн хоол идээд явсан нь дээр.' },
        { en: '[I](s) [might as well finish](v) [the report](o) [tonight](m).', mn: 'Би тайлангаа өнөө орой дуусгачихсан нь дээр юм байна.' },
      ],
    },
    {
      label: 'be bound / certain / likely / unlikely to',
      structure: 'be + bound / certain / sure / likely / unlikely + to + V1 · It is likely / certain that + өгүүлбэр',
      examples: [
        { en: '[You](s)[\'re bound to feel](v) [nervous](o) [before the interview](m).', mn: 'Ярилцлагын өмнө сандрах нь гарцаагүй.' },
        { en: '[The new law](s) [is certain to cause](v) [controversy](o).', mn: 'Шинэ хууль маргаан дагуулах нь тодорхой.' },
        { en: '[It](s) [is unlikely](v) [that the bridge will reopen before June](o).', mn: 'Гүүр зургадугаар сараас өмнө дахин нээгдэх магадлал бага.' },
      ],
    },
    {
      label: 'will / would / should (таамаглал, зан, хүлээлт)',
      structure: 'will / should + be / V1 (одоо) · will / should + have + V3 (өдийд болсон) · will / would + V1 (хэвшсэн зан)',
      examples: [
        { en: '[Don\'t phone now](v). [They](s)[\'ll be having](v) [dinner](o).', mn: 'Одоо битгий залга. Тэд оройн хоолоо идэж байгаа байх.' },
        { en: '[It](s) [shouldn\'t take](v) [more than an hour](o).', mn: 'Нэг цагаас илүү хугацаа орохгүй байх учиртай.' },
        { en: '[My grandfather](s) [would sit](v) [by the stove](m) [for hours](m).', mn: 'Өвөө маань зуухны дэргэд олон цагаар сууна даа.' },
      ],
    },
  ],
  signalWords: ['may well', 'might well', 'could well', 'might as well', 'may as well', 'be bound to', 'be certain to', 'be likely to', 'be unlikely to', 'That\'ll be…', 'should be', 'can\'t help + -ing'],
  notes: [
    'may well ба may as well хоёрыг бүү андуур: You may well be right = «чиний зөв байх магадлал өндөр»; We may as well go = «явчихсан нь дээр, өөр хийх юм алга». Ганц as гэдэг үг утгыг бүхэлд нь өөрчилнө.',
    'be bound to ба must-ын ялгаа: must нь одоо эсвэл өнгөрсний тухай нотолгоонд тулгуурласан дүгнэлт (He must be tired), be bound to нь голчлон ирээдүйд «зайлшгүй болно» гэсэн итгэл (He\'s bound to be tired after the flight).',
    'likely бол тэмдэг нэр тул be үйл үгтэй хэрэглэнэ: He is likely to win / It is likely that he will win. He is likely that… гэсэн хольсон бүтэц буруу. Илүү хүчтэй болгоход very / highly likely, сулруулахад quite unlikely гэнэ.',
    'will-ийг хэвшсэн занд хэрэглэхэд яриандаа will дээр өргөлт өгч, товчлохгүй (He WILL keep interrupting) бол шүүмжлэл, уцаарын өнгө орно. Өргөлтгүй бол зүгээр л ердийн зан: Water will boil at 100 degrees.',
    'can\'t help-ийн ард заавал V-ing: I can\'t help worrying. Мөн can\'t help but + V1 гэсэн хувилбар бий (I can\'t help but wonder), I can\'t help it гэвэл «би яаж ч чадахгүй» гэсэн утгатай.',
    'should-ын хүлээлтийн утгыг ихэвчлэн сайн, хүссэн үр дүнд хэрэглэнэ: The weather should be nice tomorrow. Таагүй зүйлд should тохирохгүй — The traffic should be terrible гэхгүй, will probably be / is likely to be гэнэ.',
  ],
  commonMistakes: [
    {
      wrong: 'We might as well to wait here.',
      correct: 'We might as well wait here.',
      explanation: 'might as well нь модаль бүтэц тул ард нь to-гүй V1 орно. Монголоор «хүлээсэн нь дээр» гэхэд англиар to нэмэх шаардлагагүй.',
    },
    {
      wrong: 'Prices are bound rise next year.',
      correct: 'Prices are bound to rise next year.',
      explanation: 'be bound-ын ард заавал to + V1. Мөн be үйл үгийг орхиж болохгүй: Prices bound to rise ч буруу.',
    },
    {
      wrong: 'I couldn\'t help to laugh.',
      correct: 'I couldn\'t help laughing.',
      explanation: 'can\'t / couldn\'t help-ийн ард V-ing хэрэглэнэ, to + V1 биш. Энд help нь «туслах» биш, «өөрийгөө барих» гэсэн утгатай.',
    },
    {
      wrong: 'He is likely that he will win the election.',
      correct: 'He is likely to win the election. / It is likely that he will win the election.',
      explanation: 'likely-г хоёр янзаар хэрэглэнэ: хүн + be likely to + V1, эсвэл It is likely that + өгүүлбэр. Энэ хоёрыг хольж болохгүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор магадлалын зэргийг «байх», «биз», «бололтой», «байж ч мэднэ», «гарцаагүй», «юу л бол» гэх мэт сул үг, хэллэгээр ялгадаг. Англиар эдгээрийг модаль бүтцээр гаргана: «байж ч мэднэ» = may well, «гарцаагүй» = be bound to, «юу л бол» = be unlikely to.',
      'Монголоор «тэгсэн нь дээр» гэдэг хэллэг хоёр өөр утгатай байж болно: илүүд үзэх (I\'d rather — B1-ийн 15-р дүрэм) болон «өөр сонголт алга, тэгчихье» (might as well). Англиар энэ хоёр өөр бүтэц тул хүсэл байна уу, хайхрамжгүй зөвшөөрөл үү гэдгийг ялгаж сонгоно.',
      'Монголоор хэвшсэн, ядаргаатай занг «заавал л … -даг», «дандаа л … -аад байдаг» гэж «л» сул үгээр онцолдог. Англиар энэ өнгийг өргөлттэй will (He will leave the lights on) эсвэл өнгөрсөнд would-оор гаргана.',
      'Монголоор «өөрийн эрхгүй инээв», «бодохгүй байж чадсангүй» гэж дайвар үг буюу үгүйсгэсэн бүтцээр хэлдэг бол англиар can\'t help + V-ing гэсэн тогтсон бүтэц хэрэглэнэ. «Туслах» гэсэн help-тэй холбож орчуулбал утга алдагдана.',
    ],
  },
  dialogue: [
    {
      en: '[Temuulen](s)[\'s](v) [twenty minutes late](o) [again](m). [He](s)[\'ll be](v) [stuck in traffic](o), I suppose.',
      mn: 'Тэмүүлэн дахиад л хорин минут хоцорч байна. Түгжрэлд гацсан байх даа.',
      speaker: 'Saraa',
    },
    {
      en: '[He](s) [may well be](v). [On a Friday evening](m) [the roads](s) [are bound to be](v) [busy](o).',
      mn: 'Тийм байх магадлал өндөр. Баасан гарагийн орой зам ачаалалтай байх нь гарцаагүй.',
      speaker: 'Bat',
    },
    {
      en: '[He](s) [will leave](v) [everything](o) [until the last minute](m), though. [I](s) [can\'t help feeling](v) [a bit annoyed](o).',
      mn: 'Гэхдээ тэр заавал л бүх юмаа эцсийн мөч хүртэл хойш тавьдаг. Өөрийн эрхгүй жаахан уур хүрээд байна.',
      speaker: 'Saraa',
    },
    {
      en: '[He](s) [should be](v) [here](m) [soon](m). [He](s) [texted](v) [me](o) [ten minutes ago](m).',
      mn: 'Удахгүй ирэх ёстой. Арван минутын өмнө над руу мессеж бичсэн.',
      speaker: 'Bat',
    },
    {
      en: 'Well, [we](s) [might as well order](v) [some drinks](o) [while we wait](m).',
      mn: 'За яах вэ, хүлээх зуураа уух юм захиалчихъя даа.',
      speaker: 'Saraa',
    },
    {
      en: 'Good idea. [Knowing him](m), [he](s)[\'s unlikely to arrive](v) [before seven](m).',
      mn: 'Зөв санаа. Түүнийг мэдэхийн хувьд долоон цагаас өмнө ирэх нь юу л бол.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'c1-06-1',
      ruleId: 6,
      kind: 'fill',
      question: 'The last bus has gone, so we ___ walk home — there\'s no other option.',
      options: ['might as well', 'might well as', 'are unlikely to', 'can\'t help'],
      answer: 'might as well',
      explanation: 'Өөр сонголт байхгүй тул «алхчихъя даа» — might as well + V1. might well as гэсэн дараалал байхгүй; are unlikely to нь утгын хувьд зөрчилдөнө; can\'t help-ийн ард V-ing орох ёстой.',
      hint: '«Өөр сонголт алга, тэгчихье».',
    },
    {
      id: 'c1-06-2',
      ruleId: 6,
      kind: 'fill',
      question: 'With so little preparation, he ___ fail the exam — I\'d be amazed if he passed.',
      options: ['is bound to', 'is bound', 'is unlikely to', 'might as well'],
      answer: 'is bound to',
      explanation: '«Тэнцвэл би гайхна» гэсэн нь унах нь гарцаагүй гэсэн итгэл — be bound to + V1. to-г орхиж болохгүй; is unlikely to эсрэг утгатай; might as well нь «тэгсэн нь дээр» гэсэн санал тул тохирохгүй.',
      hint: 'Ирээдүйд гарцаагүй болох зүйл.',
    },
    {
      id: 'c1-06-3',
      ruleId: 6,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'She is bound passing the exam.',
        'I couldn\'t help laughing when he fell into the pool.',
        'We might as well to take a taxi.',
        'It is likely that rain tomorrow.',
      ],
      answer: 'I couldn\'t help laughing when he fell into the pool.',
      explanation: 'couldn\'t help + V-ing зөв. be bound-ын ард to + V1 (is bound to pass); might as well-ийн ард to-гүй V1 (take); It is likely that-ийн ард бүтэн өгүүлбэр (it will rain) орно.',
      hint: 'can\'t help-ийн ард ямар хэлбэр орох вэ?',
    },
    {
      id: 'c1-06-4',
      ruleId: 6,
      kind: 'translate',
      question: 'Чиний зөв байх магадлал нэлээд өндөр.',
      options: [
        'You may well be right.',
        'You may as well be right.',
        'You can\'t help being right.',
        'You are unlikely to be right.',
      ],
      answer: 'You may well be right.',
      explanation: '«Магадлал нэлээд өндөр» = may well + V1. may as well нь «тэгсэн нь дээр» гэсэн өөр утгатай; can\'t help нь «өөрийн эрхгүй»; unlikely нь «магадлал бага» гэсэн эсрэг утга.',
      hint: 'well уу, as well уу?',
    },
  ],
};
