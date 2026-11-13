// frontend/src/lib/grammar/b2/rule-10.ts
// B2 дүрэм 10: Participle clauses
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule10: GrammarRule = {
  id: 10,
  title: 'Participle clauses',
  titleMn: 'Participle clauses — өгүүлбэрийг -ing, -ed-ээр хураах',
  hook: '«Тэнд сууж байгаа хүн», «Японд үйлдвэрлэсэн машин», «Ажлаа дуусгаад тэр гэртээ харьсан» — who, which, because, after-гүйгээр хоёр өгүүлбэрийг нэг болгон хурааж сурцгаая.',
  summary: 'Participle clause нь эзэн, цагтай үйл үггүй богиносгосон өгүүлбэр. Present participle (V-ing) нь active утгатай: зэрэг болж буй үйлдэл, шалтгаан (Feeling tired, I went to bed). Past participle (V3) нь passive утгатай (Written in 1890, the novel …). Having + V3 нь гол үйлдлээс өмнө дууссан үйлдэл. Нэр үгийн ард орвол reduced relative clause болно: the man sitting there, the car made in Japan. Participle-ийн эзэн гол өгүүлбэрийн эзэнтэй ижил байх ёстой.',
  description: 'B1-ийн 13-р дүрэмд бид relative clause-ийг (the man who is sitting there), B1-ийн 7-р дүрэмд passive-ийг (the car which was made in Japan), B1-ийн 2-р дүрэмд Past Perfect-ээр «өмнө нь болсон» үйлдлийг үзсэн. Participle clause нь эдгээр бүтцийг хураангуйлж, бичгийн хэлийг нягт, уран болгодог арга юм. Хоёр гол хэрэглээ бий. Нэгдүгээрт, нэр үгийн ард орж түүнийг тодотгоно (reduced relative clause): who is / which was-ийг хаяад participle-ийг үлдээнэ — the man sitting there, the car made in Japan. Хоёрдугаарт, өгүүлбэрийн эхэнд эсвэл төгсгөлд орж цаг, шалтгаан, зэрэг болсон үйлдлийг заана: Because I felt tired → Feeling tired, …; After he had finished → Having finished, … Сонголт нь энгийн: утга нь active бол -ing, passive бол V3, гол үйлдлээс тодорхой өмнө дууссан бол Having + V3. Хамгийн чухал дүрэм: participle clause өөрийн эзэнгүй тул уншигч түүнийг гол өгүүлбэрийн эзэнд автоматаар холбодог. Эзэд өөр бол «dangling participle» гэсэн алдаа гарна: Walking home, the rain started — бороо гэр лүүгээ алхаж байсан мэт болно. Монгол хэл энэ талаар англиас илүү баян: нөхцөл үйлийн «-ж», «-аад», «-нгаа», «-сээр» залгаврууд болон нэр үгийн өмнөх «-ж байгаа», «-сан», «-даг» хэлбэрүүд яг participle clause-ийн үүргийг гүйцэтгэдэг. Тэгэхээр энэ бүтэц монгол хүнд утгын хувьд ойр, зөвхөн байрлал (нэр үгийн ард) болон active / passive-ийн сонголтыг анхаарах хэрэгтэй.',
  structure: 'V-ing … , subject + verb (active) · V3 … , subject + verb (passive) · Having + V3 … , subject + verb (өмнөх үйлдэл) · noun + V-ing / V3 … (reduced relative)',
  structureParts: [
    { text: 'V-ing / V3 / Having + V3 …,', part: 'modifier' },
    { text: 'subject', part: 'subject' },
    { text: 'verb', part: 'verb' },
    { text: '· noun + V-ing / V3', part: 'object' },
  ],
  tip: 'Эзэн өөрөө хийж байвал -ing · эзэнд үйлдэл тусаж байвал V3 · өмнө нь дууссан бол Having + V3 · participle-ийн эзэн = гол өгүүлбэрийн эзэн.',
  examples: [
    { en: '[Feeling tired](m), [I](s) [went](v) [to bed](m) [early](m).', mn: 'Ядарсан болохоор би эрт унтсан.' },
    { en: '[Written in 1890](m), [the novel](s) [is](v) [still popular](o) [today](m).', mn: '1890 онд бичигдсэн тэр роман өнөөдөр ч алдартай хэвээр.' },
    { en: '[Having finished the report](m), [she](s) [went](v) [home](m).', mn: 'Тайлангаа дуусгаад тэр гэртээ харьсан.' },
    { en: '[The man](s) [sitting over there](m) [is](v) [our teacher](o).', mn: 'Тэнд сууж байгаа хүн бол манай багш.' },
  ],
  useCases: [
    {
      title: 'Present participle (-ing) — зэрэг болсон үйлдэл, шалтгаан',
      description: 'Эзэн өөрөө хийж буй (active) үйлдэл. Хоёр үйлдэл зэрэг болох (while), нэг нь нөгөөгийнхөө шалтгаан болох (because), эсвэл дараалан болох үед. Үгүйсгэл: Not + V-ing. Өгүүлбэрийн эхэнд ч, төгсгөлд ч орно.',
      examples: [
        { en: '[She](s) [sat](v) [by the window](m), [reading a book](m).', mn: 'Тэр ном уншингаа цонхны дэргэд суув.' },
        { en: '[Not knowing the way](m), [we](s) [asked](v) [a taxi driver](o).', mn: 'Замаа мэдэхгүй болохоор бид таксины жолоочоос асуусан.' },
        { en: '[Opening the door](m), [he](s) [saw](v) [a stranger](o) [in the hall](m).', mn: 'Хаалгаа онгойлгоод тэр үүдний өрөөнд танихгүй хүн байхыг харав.' },
      ],
    },
    {
      title: 'Past participle (V3) — passive утгатай clause',
      description: 'Эзэнд үйлдэл тусаж байгаа (passive) үед being-гүйгээр шууд V3-аар эхэлнэ. Ихэвчлэн шалтгаан, нөхцөл, нэмэлт мэдээллийг заана. Бичгийн, албан хэв маягт түгээмэл.',
      examples: [
        { en: '[Built in the 16th century](m), [the monastery](s) [attracts](v) [thousands of visitors](o).', mn: '16-р зуунд баригдсан тэр хийд мянга мянган зочин татдаг.' },
        { en: '[Shocked by the news](m), [she](s) [couldn\'t say](v) [a word](o).', mn: 'Мэдээнд цочирдсон тэр нэг ч үг хэлж чадсангүй.' },
        { en: '[Used correctly](m), [this medicine](s) [is](v) [completely safe](o).', mn: 'Зөв хэрэглэвэл энэ эм бүрэн аюулгүй.' },
      ],
    },
    {
      title: 'Having + V3 — гол үйлдлээс өмнө дууссан үйлдэл',
      description: 'Нэг үйлдэл бүрэн дууссаны дараа нөгөө нь болсон гэдгийг тодорхой заана — After + Past Perfect эсвэл Because + Past Perfect-ийн хураангуй. Үгүйсгэл: Not having + V3. Passive: Having been + V3.',
      examples: [
        { en: '[Having lived in Japan for ten years](m), [he](s) [speaks](v) [Japanese](o) [fluently](m).', mn: 'Японд арван жил амьдарсан болохоор тэр японоор чөлөөтэй ярьдаг.' },
        { en: '[Having read the book twice](m), [I](s) [didn\'t want](v) [to see the film](o).', mn: 'Номыг нь хоёр удаа уншчихсан болохоор би киног нь үзэхийг хүсээгүй.' },
        { en: '[Not having eaten all day](m), [we](s) [were](v) [starving](o).', mn: 'Өдөржин юм идээгүй байсан болохоор бид үхтлээ өлссөн байлаа.' },
      ],
    },
    {
      title: 'Reduced relative clauses — нэр үгийн ардах participle',
      description: 'who / which / that + be-г хаяж, participle-ийг нэр үгийн яг ард үлдээнэ. Active бол -ing (the man who is sitting → the man sitting), passive бол V3 (the car which was made → the car made). -ing нь байнгын үйлдлийг ч орлож чадна: people living here = people who live here.',
      examples: [
        { en: '[The girl](s) [talking to Bat](m) [is](v) [my cousin](o).', mn: 'Баттай ярьж байгаа охин бол миний үеэл.' },
        { en: '[The car](s) [made in Japan](m) [costs](v) [less](o).', mn: 'Японд үйлдвэрлэсэн машин нь хямд.' },
        { en: '[Students](s) [living far from campus](m) [can apply](v) [for a bus pass](m).', mn: 'Сургуулиас хол амьдардаг оюутнууд автобусны карт авах хүсэлт гаргаж болно.' },
      ],
    },
    {
      title: 'Нэг эзний дүрэм — dangling participle-ээс зайлсхийх',
      description: 'Participle clause-ийн далд эзэн нь гол өгүүлбэрийн эзэнтэй ижил байх ёстой. Өөр бол утга инээдтэй, буруу болно. Эзэд өөр үед бүтэн өгүүлбэр (while / when / because + эзэн + үйл үг) хэрэглэнэ.',
      examples: [
        { en: '[Walking home](m), [I](s) [got](v) [caught in the rain](o).', mn: 'Гэр лүүгээ алхаж яваад би бороонд цохиулсан. (алхсан нь ч, цохиулсан нь ч би)' },
        { en: '[While I was walking home](m), [it](s) [started](v) [to rain](o).', mn: 'Намайг гэр лүүгээ алхаж явахад бороо орж эхэлсэн. (эзэд өөр тул бүтэн өгүүлбэр)' },
        { en: '[Looking out of the window](m), [she](s) [noticed](v) [a strange car](o).', mn: 'Цонхоор хараад тэр нэг хачин машин анзаарав.' },
      ],
    },
  ],
  forms: [
    {
      label: 'V-ing clause (active)',
      structure: '(Not) + V-ing …, subject + verb · subject + verb …, V-ing …',
      examples: [
        { en: '[Being the youngest child](m), [he](s) [was](v) [always spoilt](o).', mn: 'Отгон хүүхэд болохоор түүнийг үргэлж эрхлүүлдэг байсан.' },
        { en: '[He](s) [walked](v) [out of the room](m), [slamming the door](m).', mn: 'Тэр хаалгаа тас хийтэл хаан өрөөнөөс гарав.' },
        { en: '[Not wanting to wake the baby](m), [she](s) [spoke](v) [very quietly](m).', mn: 'Нялх хүүхдийг сэрээхийг хүсээгүй тул тэр маш аяархан ярив.' },
      ],
    },
    {
      label: 'V3 clause (passive)',
      structure: 'V3 …, subject + verb',
      examples: [
        { en: '[Seen from above](m), [the city](s) [looks](v) [tiny](o).', mn: 'Дээрээс харахад хот өчүүхэн жижиг харагддаг.' },
        { en: '[Surrounded by mountains](m), [the village](s) [is](v) [very peaceful](o).', mn: 'Уулсаар хүрээлэгдсэн тэр тосгон маш амар тайван.' },
        { en: '[Asked about his plans](m), [the minister](s) [refused](v) [to comment](o).', mn: 'Төлөвлөгөөнийх нь талаар асуухад сайд тайлбар өгөхөөс татгалзав.' },
      ],
    },
    {
      label: 'Having + V3 (perfect participle)',
      structure: '(Not) having + V3 …, subject + verb · Having been + V3 …, subject + verb',
      examples: [
        { en: '[Having saved enough money](m), [they](s) [bought](v) [a flat](o).', mn: 'Хангалттай мөнгө хуримтлуулаад тэд байр худалдаж авсан.' },
        { en: '[Having missed the last bus](m), [I](s) [had to walk](v) [home](m).', mn: 'Сүүлийн автобуснаас хоцорчихоод би гэр лүүгээ алхахаас өөр аргагүй болсон.' },
        { en: '[Having been warned about the weather](m), [we](s) [took](v) [warm clothes](o).', mn: 'Цаг агаарын талаар анхааруулга авсан тул бид дулаан хувцас авч явсан.' },
      ],
    },
    {
      label: 'Reduced relative clause',
      structure: 'noun + V-ing … (= who / which + active verb) · noun + V3 … (= who / which + be + V3)',
      examples: [
        { en: '[The woman](s) [waiting outside](m) [wants](v) [to see you](o).', mn: 'Гадаа хүлээж байгаа эмэгтэй тантай уулзахыг хүсэж байна.' },
        { en: '[Most of the people](s) [invited to the wedding](m) [came](v).', mn: 'Хуриманд уригдсан хүмүүсийн ихэнх нь ирсэн.' },
        { en: '[I](s) [love](v) [the photos](o) [taken by your sister](m).', mn: 'Чиний эгчийн авсан зургууд надад их таалагддаг.' },
      ],
    },
  ],
  signalWords: ['V-ing …,', 'V3 …,', 'Having + V3', 'Not knowing', 'Not having + V3', 'Being …', 'noun + V-ing', 'noun + V3', 'made in', 'written by'],
  notes: [
    'Сонголтын түлхүүр — active уу, passive уу: The boy playing football (хүү тоглож байна — active) ба The game played yesterday (тоглолтыг тоглосон — passive). interesting / interested-ийн ялгаатай ижил зарчим.',
    'Өгүүлбэрийн эхэнд орсон participle clause-ийн ард заавал таслал тавина: Feeling ill, he stayed at home. Reduced relative clause (the man sitting there) таслалгүй.',
    'Having + V3-ийг үйлдлүүдийн хооронд тодорхой зай, дараалал байхад хэрэглэнэ. Дараалсан богино үйлдэлд энгийн -ing хангалттай: Taking his keys, he left the house.',
    'Reduced relative clause зөвхөн relative pronoun нь clause-ийн ЭЗЭН үед боломжтой: the man who is sitting → the man sitting. Тусагдахуун бол болохгүй: the man who I met → the man meeting (буруу).',
    'Participle clause-ийн өмнө холбоос үлдээж утгыг тодруулж болно: While waiting for the bus, I read the news. After leaving school, he joined the army. Before going to bed, lock the door.',
    'Энэ бүтэц голчлон бичгийн хэлд — өгүүллэг, мэдээ, албан бичигт. Өдөр тутмын ярианд because, when, after-тай бүтэн өгүүлбэр илүү байгалийн сонсогдоно. Reduced relative clause харин ярианд ч түгээмэл.',
  ],
  commonMistakes: [
    {
      wrong: 'Walking down the street, a dog bit me.',
      correct: 'Walking down the street, I was bitten by a dog. / While I was walking down the street, a dog bit me.',
      explanation: 'Dangling participle: гудамжаар алхаж явсан нь нохой биш, би. Participle-ийн эзэн гол өгүүлбэрийн эзэнтэй (a dog) ижил гэж ойлгогдох тул эзнийг тааруулах эсвэл бүтэн өгүүлбэр хэрэглэнэ.',
    },
    {
      wrong: 'The car making in Japan is very reliable.',
      correct: 'The car made in Japan is very reliable.',
      explanation: 'Машин өөрөө үйлдвэрлэдэггүй, үйлдвэрлэгддэг — passive тул V3: made. -ing хэлбэр нь зөвхөн нэр үг өөрөө үйлдлийг хийж байгаа үед.',
    },
    {
      wrong: 'The man is sitting next to Tuya is her husband.',
      correct: 'The man sitting next to Tuya is her husband.',
      explanation: 'Нэг энгийн өгүүлбэрт хоёр цагтай үйл үг (is sitting … is) холбоосгүй байж болохгүй. Эсвэл who нэмнэ (who is sitting), эсвэл be-г хаяж participle үлдээнэ (sitting).',
    },
    {
      wrong: 'Finishing all his exams, he went on holiday the next week.',
      correct: 'Having finished all his exams, he went on holiday the next week.',
      explanation: 'Шалгалт бүрэн дууссаны ДАРАА амралтанд явсан — тодорхой өмнөх үйлдэл тул Having + V3. Энгийн -ing нь зэрэг эсвэл шууд залгаа болсон үйлдлийг заана.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор тодотгол нэр үгийн өмнө ордог: «тэнд сууж байгаа хүн», «Японд үйлдвэрлэсэн машин». Англиар participle нь нэр үгийн АРД орно: the man sitting there, the car made in Japan. Үгийн дарааллыг эргүүлж сураарай.',
      'Монголын нөхцөл үйлийн залгаврууд participle clause-тай шууд тохирно: «-нгаа / -ж» (уншингаа суув) = sat reading; «-аад / -чихаад» (дуусгаад харьсан) = Having finished, …; «-сан болохоор» (ядарсан болохоор) = Feeling tired, … Монголоор ч эдгээр хэлбэр эзэнгүй, гол өгүүлбэрийн эзэнд хамаардаг.',
      'Монголоор «үйлдвэрлэсэн машин» гэхэд үйл үг active хэлбэртэй ч утга нь passive. Англиар үүнийг заавал ялгана: машин үйлдвэрлэгддэг тул made (V3), making биш. «Нэр үг өөрөө хийж байна уу, түүнд хийгдэж байна уу?» гэж өөрөөсөө асуугаарай.',
      'Монголоор «намайг алхаж явахад бороо орсон» гэж өөр эзнийг «намайг» гэж тодорхой хэлдэг. Англиар participle clause-д эзэн хэлэх боломжгүй тул эзэд өөр бол While I was walking … гэж бүтэн өгүүлбэр болгоно. Walking home, the rain started гэвэл бороо алхсан болно.',
    ],
  },
  dialogue: [
    {
      en: 'Saraa, [who](s)[\'s](v) [the woman](o) [standing next to the director](m)?',
      mn: 'Сараа, захирлын хажууд зогсож байгаа эмэгтэй хэн бэ?',
      speaker: 'Temuulen',
    },
    {
      en: '[That](s)[\'s](v) [Tuya](o). [Having worked in London for five years](m), [she](s)[\'s just come](v) [back](m).',
      mn: 'Тэр бол Туяа. Лондонд таван жил ажиллаад тэр саяхан буцаж ирсэн.',
      speaker: 'Saraa',
    },
    {
      en: 'Oh, [I](s) [think](v) [I](s)[\'ve read](v) [an article](o) [written by her](m).',
      mn: 'Өө, би түүний бичсэн нэг нийтлэлийг уншсан байх аа.',
      speaker: 'Temuulen',
    },
    {
      en: 'Probably. [Not knowing anyone here](m), [she](s) [felt](v) [a bit lost](o) [at first](m).',
      mn: 'Тийм байх. Энд хэнийг ч танихгүй болохоор тэр эхэндээ жаахан төөрсөн мэт байсан.',
      speaker: 'Saraa',
    },
    {
      en: '[Is](v) [she](s) [the one](o) [leading the new project](m)?',
      mn: 'Шинэ төслийг удирдаж байгаа хүн нь тэр үү?',
      speaker: 'Temuulen',
    },
    {
      en: 'Yes. [Asked about it](m) [yesterday](m), [she](s) [said](v) [the team](s) [chosen for the project](m) [would start](v) [next week](m).',
      mn: 'Тийм. Өчигдөр энэ тухай асуухад тэр төсөлд сонгогдсон баг ирэх долоо хоногт эхэлнэ гэж хэлсэн.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'b2-10-1',
      ruleId: 10,
      kind: 'fill',
      question: '___ the book twice already, I didn\'t want to read it again.',
      options: ['Reading', 'Having read', 'Read', 'To read'],
      answer: 'Having read',
      explanation: 'Номыг өмнө нь (twice already) уншаад дуусгасан — гол үйлдлээс өмнө дууссан үйлдэл тул Having + V3. Reading зэрэг болж буй үйлдлийг заана; Read (V3) passive утгатай тул «би» эзэнтэй таарахгүй.',
      hint: 'Өмнө нь дууссан үйлдэл.',
    },
    {
      id: 'b2-10-2',
      ruleId: 10,
      kind: 'fill',
      question: 'The car ___ in the accident belongs to my neighbour.',
      options: ['damaging', 'damaged', 'having damaged', 'was damaged'],
      answer: 'damaged',
      explanation: 'Машин гэмтсэн (passive) — reduced relative clause: the car (which was) damaged. damaging active утгатай; was damaged гэвэл өгүүлбэрт холбоосгүй хоёр цагтай үйл үг болно.',
      hint: 'Машинд үйлдэл тусав — passive participle.',
    },
    {
      id: 'b2-10-3',
      ruleId: 10,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Walking down the street, the rain started.',
        'The woman talked to the manager is my aunt.',
        'Written in 1890, the novel is still popular today.',
        'Having finish the report, she went home.',
      ],
      answer: 'Written in 1890, the novel is still popular today.',
      explanation: 'Роман бичигдсэн (passive) тул V3-аар эхэлсэн clause зөв, эзэн нь таарч байна. Бороо алхдаггүй (dangling participle); active тодотголд talking хэрэгтэй; Having-ийн ард V3 (finished).',
      hint: 'Participle-ийн эзэн гол эзэнтэй таарч байна уу?',
    },
    {
      id: 'b2-10-4',
      ruleId: 10,
      kind: 'translate',
      question: 'Тэнд сууж байгаа эрэгтэй бол манай багш.',
      options: [
        'The man sitting over there is our teacher.',
        'The man sits over there is our teacher.',
        'The man is sitting over there is our teacher.',
        'The man to sit over there is our teacher.',
      ],
      answer: 'The man sitting over there is our teacher.',
      explanation: '«Сууж байгаа эрэгтэй» — нэр үгийн ард active participle: the man sitting (= who is sitting). who-гүйгээр sits эсвэл is sitting гэвэл нэг өгүүлбэрт холбоосгүй хоёр үйл үг болно.',
      hint: 'who is-ийг хаяад -ing үлдээ.',
    },
  ],
};
