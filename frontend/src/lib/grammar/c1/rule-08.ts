// frontend/src/lib/grammar/c1/rule-08.ts
// C1 дүрэм 8: Advanced participle clauses & absolute constructions
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule08: GrammarRule = {
  id: 8,
  title: 'Advanced participle clauses & absolute constructions',
  titleMn: 'Participle clause-ийн ахисан хэлбэр ба absolute бүтэц — өөрийн эзэнтэй хураангуй өгүүлбэр',
  hook: '«Цаг агаар зөвшөөрвөл», «Бүх зүйлийг харгалзан үзвэл», «Үнэ ингэж өсөж байгаа үед» — урт гишүүн өгүүлбэрийг хоёр гуравхан үгээр шахаж сурцгаая.',
  summary: 'Having been + V3 нь өмнө болсон идэвхгүй үйлдлийг заана (Having been warned, we left early). when / while / if / once / although + participle нь холбоостой хураангуй өгүүлбэр (When asked, he refused). Absolute бүтэц нь ӨӨРИЙН эзэнтэй: Weather permitting, All things considered, The meeting over. With + нэр үг + participle нь дагалдах нөхцөл байдлыг заана. Generally speaking, Judging by, Given that зэрэг нь тогтсон хэллэг.',
  description: 'B2-ийн 10-р дүрэмд бид participle clause-ийн үндсэн гурван хэлбэрийг үзсэн: V-ing (Feeling tired, I went to bed), V3 (Built in 1900, the house …), Having + V3 (Having finished, she left). Тэнд нэг чухал дүрэм байсан: participle clause-ийн эзэн нь үндсэн өгүүлбэрийн эзэнтэй ИЖИЛ байх ёстой. C1 түвшинд дөрвөн шинэ зүйл нэмнэ. Нэгдүгээрт, идэвхгүй төгс хэлбэр Having been + V3 (B1-ийн 7-р дүрмийн passive ба C1-ийн 5-р дүрмийн having been done-той холбоотой). Хоёрдугаарт, when, while, if, once, unless, although зэрэг холбоосыг participle-ийн өмнө үлдээж утгын харьцааг тодорхой болгох арга (When asked … = When he was asked …). Гуравдугаарт, absolute construction — participle clause нь ӨӨРИЙН эзэнтэй болж, үндсэн өгүүлбэрийн эзнээс өөр байж болдог бүтэц: The meeting over, everyone went home. Дөрөвдүгээрт, With + нэр үг + participle (With prices rising, …) болон эзний дүрмээс чөлөөлөгдсөн тогтсон хэллэгүүд (Generally speaking, Judging by, Given that). Эдгээр нь голчлон бичгийн, албан, эрдэм шинжилгээний болон уран зохиолын хэлний хэрэгсэл; харин Weather permitting, All things considered, Generally speaking зэрэг нь ярианд ч түгээмэл. Монгол хэл нь угаасаа «-аад», «-ж», «-вал», «-хад», «-сан тул» гэх мэт нөхцөлөөр үйл үгсийг хэлхэж, гишүүн өгүүлбэр бүр өөрийн эзэнтэй байж чаддаг тул absolute бүтцийн логик монгол хүнд ойр; гол бэрхшээл нь англиар бие даасан үйл үг (is, was) оруулалгүй зөв participle сонгох явдал юм.',
  structure: 'Having been + V3, + main clause · When / While / If / Once + V-ing / V3, + main clause · Noun + V-ing / V3, + main clause · With + noun + V-ing / V3, + main clause',
  structureParts: [
    { text: 'Noun (өөрийн эзэн)', part: 'subject' },
    { text: 'V-ing / V3 / Having been + V3', part: 'verb' },
    { text: ', Subject + Verb …', part: 'plain' },
    { text: '· With + noun + participle', part: 'modifier' },
  ],
  tip: 'Having been + V3 = «-гдсан тул / -гдсаны дараа» · When / If / Once + participle = холбоостой хураангуй · Нэр үг + participle = өөрийн эзэнтэй (Weather permitting) · With + нэр үг + participle = «… байгаа үед / тул» · Participle clause-д is / was хэзээ ч орохгүй.',
  examples: [
    { en: '[Having been warned about the storm](m), [we](s) [stayed](v) [at home](m).', mn: 'Шуурганы талаар сэрэмжлүүлэг авсан тул бид гэртээ үлдэв.' },
    { en: '[When asked about his plans](m), [he](s) [just smiled](v).', mn: 'Төлөвлөгөөнийх нь талаар асуухад тэр зүгээр л инээмсэглэв.' },
    { en: '[Weather permitting](m), [we](s) [will have](v) [lunch](o) [in the garden](m).', mn: 'Цаг агаар зөвшөөрвөл бид цэцэрлэгт үдийн хоол иднэ.' },
    { en: '[With prices rising so fast](m), [many families](s) [are struggling](v).', mn: 'Үнэ ийм хурдан өсөж байгаа үед олон айл өрх хүндрэлтэй байна.' },
  ],
  useCases: [
    {
      title: 'Өмнө болсон идэвхгүй үйлдэл — Having been + V3',
      description: 'Үндсэн үйлдлээс ӨМНӨ болсон, эзэн нь үйлдлийг ХҮРТСЭН тохиолдолд Having been + V3. Ихэвчлэн шалтгаан («-гдсан тул») буюу дараалал («-гдсаны дараа») заана. Үгүйсгэл нь Not having been + V3. Эзэн нь үндсэн өгүүлбэрийн эзэнтэй ижил байх ёстой.',
      examples: [
        { en: '[Having been rejected by three publishers](m), [she](s) [decided](v) [to publish the book herself](o).', mn: 'Гурван хэвлэлийн газраас татгалзсан хариу авсан тул тэр номоо өөрөө хэвлүүлэхээр шийдэв.' },
        { en: '[Having been told the news](m), [he](s) [left](v) [the room](o) [without a word](m).', mn: 'Мэдээг сонссоныхоо дараа тэр үг дуугүй өрөөнөөс гарав.' },
        { en: '[Not having been invited](m), [I](s) [didn\'t feel](v) [I could go](o).', mn: 'Уригдаагүй болохоор би очиж болно гэж бодсонгүй.' },
      ],
    },
    {
      title: 'Холбоос + participle — when asked, while working, if taken',
      description: 'when, while, if, once, unless, until, although, before, after-ийг participle-ийн өмнө үлдээж цаг, нөхцөл, эсрэгцлийн утгыг тодорхой болгоно. Эзэн + be-г хассан хураангуй хэлбэр: When (he was) asked … Заавар, шошго, албан бичигт маш түгээмэл.',
      examples: [
        { en: '[While working in Japan](m), [she](s) [learned](v) [to cook sushi](o).', mn: 'Японд ажиллаж байхдаа тэр суши хийж сурсан.' },
        { en: '[If taken regularly](m), [the medicine](s) [is](v) [very effective](o).', mn: 'Тогтмол уувал энэ эм маш үр дүнтэй.' },
        { en: '[Once opened](m), [the jar](s) [should be kept](v) [in the fridge](m).', mn: 'Нэгэнт онгойлгосон бол лонхыг хөргөгчид хадгалах хэрэгтэй.' },
      ],
    },
    {
      title: 'Өөрийн эзэнтэй — absolute construction',
      description: 'Participle clause нь үндсэн өгүүлбэрийн эзнээс ӨӨР, өөрийн эзэнтэй байна: нэр үг + V-ing / V3 (being-ийг ихэвчлэн хасдаг: The meeting (being) over). Шалтгаан, цаг, нөхцөл, дагалдах байдлыг заана. Ихэнх нь албан буюу уран зохиолын өнгөтэй; зарим нь тогтсон хэллэг болсон.',
      examples: [
        { en: '[The meeting over](m), [everyone](s) [hurried](v) [back to their desks](m).', mn: 'Хурал дуусмагц бүгд ширээ рүүгээ яаран буцав.' },
        { en: '[All things considered](m), [it](s) [was](v) [a successful year](o).', mn: 'Бүх зүйлийг харгалзан үзвэл амжилттай жил байлаа.' },
        { en: '[There being no further questions](m), [the chairman](s) [closed](v) [the session](o).', mn: 'Өөр асуулт гараагүй тул дарга хуралдааныг хаав.' },
      ],
    },
    {
      title: 'Дагалдах нөхцөл байдал — With + нэр үг + participle',
      description: 'with-ээр эхэлсэн absolute бүтэц: With + нэр үг + V-ing (идэвхтэй, үргэлжилж байгаа) / V3 (идэвхгүй, үр дүн). Үндсэн үйлдэлтэй зэрэг оршиж буй нөхцөл байдал буюу шалтгааныг заана. Ярианд ч, бичгэнд ч түгээмэл. Бие даасан үйл үг (is / are) орохгүй.',
      examples: [
        { en: '[With the exams approaching](m), [the library](s) [is](v) [full](o) [every evening](m).', mn: 'Шалгалт ойртож байгаа тул номын сан орой бүр дүүрэн байдаг.' },
        { en: '[She](s) [sat](v) [in silence](m), [with her eyes fixed on the floor](m).', mn: 'Тэр шал руу ширтсээр чимээгүй сууж байв.' },
        { en: '[With so many people working from home](m), [the city centre](s) [is](v) [much quieter](o).', mn: 'Маш олон хүн гэрээсээ ажиллаж байгаа болохоор хотын төв хавьгүй нам гүм болжээ.' },
      ],
    },
    {
      title: 'Тогтсон хэллэгүүд — Generally speaking, Judging by, Given that',
      description: 'Зарим participle хэллэг нь өгүүлбэрийг бүхэлд нь тайлбарлах үүрэгтэй болсон тул эзэн нь үндсэн өгүүлбэрийн эзэнтэй таарах шаардлагагүй: Generally speaking, Strictly speaking, Judging by / from, Considering, Given (that), Assuming (that), Provided (that), Taking everything into account, Compared with.',
      examples: [
        { en: '[Generally speaking](m), [flats](s) [are](v) [cheaper](o) [outside the centre](m).', mn: 'Ерөнхийд нь хэлбэл төвөөс гадна байр хямд байдаг.' },
        { en: '[Judging by his accent](m), [he](s) [must be](v) [from the north](m).', mn: 'Аялгаас нь харахад тэр хойд нутгийнх байх нь гарцаагүй.' },
        { en: '[Given that she had no experience](m), [she](s) [did](v) [remarkably well](m).', mn: 'Ямар ч туршлагагүй байсныг нь бодолцвол тэр гайхалтай сайн ажилласан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Having been + V3',
      structure: '(Not) Having been + V3, + subject + verb',
      examples: [
        { en: '[Having been delayed for two hours](m), [the flight](s) [finally took off](v).', mn: 'Хоёр цаг саатсаны эцэст онгоц сая нэг хөөрөв.' },
        { en: '[Having been brought up in the countryside](m), [he](s) [finds](v) [city life](o) [stressful](o).', mn: 'Хөдөө өссөн болохоор түүнд хотын амьдрал стресстэй санагддаг.' },
        { en: '[Not having been given clear instructions](m), [the team](s) [made](v) [several mistakes](o).', mn: 'Тодорхой заавар аваагүй тул баг хэд хэдэн алдаа гаргав.' },
      ],
    },
    {
      label: 'Холбоос + V-ing / V3',
      structure: 'When / While / If / Once / Unless / Although / Before / After + V-ing / V3, + subject + verb',
      examples: [
        { en: '[Although exhausted](m), [they](s) [kept](v) [walking](o).', mn: 'Тэд туйлдсан ч цааш алхсаар байв.' },
        { en: '[Unless otherwise stated](m), [all prices](s) [include](v) [tax](o).', mn: 'Өөрөөр заагаагүй бол бүх үнэд татвар багтсан.' },
        { en: '[After being interviewed](m), [the candidates](s) [were asked](v) [to wait outside](o).', mn: 'Ярилцлагад орсныхоо дараа нэр дэвшигчдийг гадаа хүлээхийг хүсэв.' },
      ],
    },
    {
      label: 'Absolute: нэр үг + participle',
      structure: 'Noun + V-ing / V3 / (being) + adjective / adverb, + subject + verb',
      examples: [
        { en: '[Time permitting](m), [we](s) [will visit](v) [the museum](o) [as well](m).', mn: 'Цаг гарвал бид музейг бас үзнэ.' },
        { en: '[Her work finished](m), [she](s) [switched off](v) [the computer](o).', mn: 'Ажлаа дуусгаад тэр компьютероо унтраав.' },
        { en: '[The roads being icy](m), [we](s) [decided](v) [to take the train](o).', mn: 'Зам мөстэй байсан тул бид галт тэргээр явахаар шийдэв.' },
      ],
    },
    {
      label: 'With + нэр үг + participle',
      structure: 'With + noun + V-ing (идэвхтэй) / V3 (идэвхгүй), + subject + verb',
      examples: [
        { en: '[With the deadline approaching](m), [nobody](s) [went](v) [home](m) [early](m).', mn: 'Эцсийн хугацаа ойртож байсан тул хэн ч эрт харьсангүй.' },
        { en: '[He](s) [stood](v) [at the door](m) [with his arms folded](m).', mn: 'Тэр гараа зөрүүлэн хаалганы дэргэд зогсож байв.' },
        { en: '[With both parents working full-time](m), [the children](s) [spend](v) [a lot of time](o) [with their grandmother](m).', mn: 'Эцэг эх хоёулаа бүтэн цагаар ажилладаг болохоор хүүхдүүд эмээтэйгээ их цаг өнгөрүүлдэг.' },
      ],
    },
  ],
  signalWords: ['Having been + V3', 'when / while / if / once + participle', 'Weather permitting', 'All things considered', 'There being…', 'With + noun + -ing / V3', 'Generally speaking', 'Judging by', 'Given that', 'Considering', 'Provided that'],
  notes: [
    'Өөрийн эзэнгүй participle clause-ийн эзэн нь үндсэн өгүүлбэрийн эзэнтэй ижил байх ёстой. Walking down the street, the rain started гэвэл «бороо гудамжаар алхаж байсан» гэсэн утга гарна — үүнийг dangling participle гээд алдаанд тооцно.',
    'Эзэн өөр бол хоёр гарц бий: бүтэн гишүүн өгүүлбэр хэрэглэх (While I was walking …) эсвэл absolute бүтцээр өөрийн эзнийг нь тавих (The rain having started, we went inside). Хоёр дахь нь маш албан өнгөтэй.',
    'Having been + V3-ийн оронд ихэвчлэн V3 дангаараа хангалттай: Warned about the storm, we stayed at home. Having been нь «өмнө нь болсон» буюу шалтгааныг онцолно. Идэвхтэй утгад Having + V3: Having finished the report (Having been finished биш).',
    'Холбоос + participle нь эзэн + be-г хассан хэлбэр: When (it is) heated, ice melts. Зөвхөн хоёр өгүүлбэрийн эзэн ижил үед л хасна. because, since (шалтгаан)-ийн ард ингэж хураахгүй — Because tired гэхгүй.',
    'With-бүтцэд бие даасан үйл үг орохгүй: With prices are rising буруу → With prices rising. Мөн with + нэр үг + to + V1 гэвэл ирээдүйд хийх ёстой зүйлийг заана: With so much work to do, I can\'t go out.',
    'Participle clause өгүүлбэрийн эхэнд байвал ард нь таслал тавина. Generally speaking, Judging by, Given, Considering зэрэг тогтсон хэллэг нь эзний дүрмээс чөлөөтэй. Ярианы хэлэнд бүтэн гишүүн өгүүлбэр (because, when, as) илүү байгалийн сонсогдоно.',
  ],
  commonMistakes: [
    {
      wrong: 'Walking into the room, the lights suddenly went out.',
      correct: 'As I walked into the room, the lights suddenly went out.',
      explanation: 'Participle clause-ийн эзэн нь үндсэн өгүүлбэрийн эзэн (the lights) болж ойлгогдоно — гэрэл өрөөнд алхаж ороогүй. Эзэн өөр бол бүтэн гишүүн өгүүлбэр хэрэглэнэ.',
    },
    {
      wrong: 'Having been finished her speech, she sat down.',
      correct: 'Having finished her speech, she sat down.',
      explanation: 'Тэр өөрөө үгээ дуусгасан — идэвхтэй утга тул Having + V3. Having been + V3 нь эзэн үйлдлийг хүртсэн үед л хэрэглэгдэнэ: Having been asked to speak, she stood up.',
    },
    {
      wrong: 'Weather permitted, we will go hiking on Sunday.',
      correct: 'Weather permitting, we will go hiking on Sunday.',
      explanation: 'Цаг агаар өөрөө «зөвшөөрнө» — идэвхтэй утга тул V-ing. Weather permitting бол тогтсон хэллэг, хэлбэрийг нь өөрчлөхгүй.',
    },
    {
      wrong: 'With the deadline is approaching, everyone is working late.',
      correct: 'With the deadline approaching, everyone is working late.',
      explanation: 'with-ийн ард бүтэн өгүүлбэр орохгүй, зөвхөн нэр үг + participle. is-ийг хасна. Бүтэн өгүүлбэр хэрэгтэй бол As the deadline is approaching гэнэ.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монгол хэл үйл үгсийг «-аад», «-ж», «-магц», «-сан тул», «-вал» гэсэн нөхцөлөөр хэлхэж өгүүлбэр хураадаг нь participle clause-тай маш төстэй. «Хурал дуусмагц бүгд гарав» = The meeting over, everyone left. Монголоор бодоход амархан, англиар зөв participle сонгох л үлдэнэ.',
      'Монголоор гишүүн өгүүлбэр бүр өөрийн эзэнтэй байж чаддаг («цаг агаар зөвшөөрвөл бид явна»). Англид энгийн participle clause эзэнгүй тул үндсэн өгүүлбэрийн эзнийг «зээлдэг»; өөр эзэн хэрэгтэй бол заавал өмнө нь бичих (Weather permitting) буюу with хэрэглэнэ.',
      'Монголоор идэвхтэй / идэвхгүйг «-сан» / «-гдсан» гэж ялгадаг: «анхааруулсан» ба «анхааруулагдсан». Англиар мөн адил Having warned (өөрөө анхааруулсан) ба Having been warned (анхааруулга авсан) гэж ялгана — «-гдсан» гэвэл been нэмнэ.',
      'Монголоор «ерөнхийд нь хэлбэл», «… -аас харахад», «… -г бодолцвол» гэсэн оршил хэллэгүүд англиар Generally speaking, Judging by …, Given that … болно. Эдгээрийг If we speak generally гэж үгчлэн орчуулах хэрэггүй — тогтсон participle хэллэгийг шууд цээжил.',
    ],
  },
  dialogue: [
    {
      en: 'Right, [with everyone sitting comfortably](m), [let\'s begin](v). Temuulen, [how](m) [is](v) [the project](s) [going](v)?',
      mn: 'За, бүгд тухтай суусан юм чинь эхэлцгээе. Тэмүүлэн, төсөл ямар явцтай байна?',
      speaker: 'Tuya',
    },
    {
      en: '[Generally speaking](m), very well. [Having been tested twice](m), [the app](s) [is](v) [now](m) [ready for launch](o).',
      mn: 'Ерөнхийд нь хэлбэл маш сайн. Хоёр удаа туршигдсан тул апп одоо нээлтэд бэлэн болсон.',
      speaker: 'Temuulen',
    },
    {
      en: 'Good. [When asked about the price](m), [what](o) [did](v) [the clients](s) [say](v)?',
      mn: 'Сайн байна. Үнийн талаар асуухад үйлчлүүлэгчид юу гэж хэлсэн бэ?',
      speaker: 'Tuya',
    },
    {
      en: '[Most](s) [were](v) [happy](o). [Given that our competitors charge more](m), [I](s) [think](v) [we\'re in a strong position](o).',
      mn: 'Ихэнх нь сэтгэл хангалуун байсан. Өрсөлдөгчид маань илүү үнэтэй байдгийг бодолцвол бид давуу байр суурьтай гэж бодож байна.',
      speaker: 'Temuulen',
    },
    {
      en: '[All things considered](m), [that](s)[\'s](v) [excellent news](o). [So](m) [when](m) [can](v) [we](s) [launch](v)?',
      mn: 'Бүх зүйлийг харгалзан үзвэл энэ маш сайн мэдээ байна. Тэгэхээр хэзээ нээлтээ хийж болох вэ?',
      speaker: 'Tuya',
    },
    {
      en: '[Weather permitting](m), [we](s)[\'ll hold](v) [the outdoor launch event](o) [next Friday](m).',
      mn: 'Цаг агаар зөвшөөрвөл бид гадаа хийх нээлтийн арга хэмжээгээ ирэх баасан гарагт зохион байгуулна.',
      speaker: 'Temuulen',
    },
  ],
  quiz: [
    {
      id: 'c1-08-1',
      ruleId: 8,
      kind: 'fill',
      question: '___ twice by the same dog, the postman refused to deliver to that house.',
      options: ['Having been bitten', 'Having bitten', 'Biting', 'Having been biting'],
      answer: 'Having been bitten',
      explanation: 'Шуудан зөөгч хазуулсан (by the same dog) — идэвхгүй, мөн татгалзахаас өмнө болсон тул Having been + V3. Бусад хувилбар нь идэвхтэй утгатай — шуудан зөөгч өөрөө хазсан болж таарна.',
      hint: 'by … байвал идэвхгүй.',
    },
    {
      id: 'c1-08-2',
      ruleId: 8,
      kind: 'fill',
      question: 'Weather ___, the ceremony will be held in the garden.',
      options: ['permitting', 'permitted', 'permits', 'to permit'],
      answer: 'permitting',
      explanation: 'Weather permitting — «цаг агаар зөвшөөрвөл» гэсэн тогтсон absolute бүтэц. Цаг агаар өөрөө зөвшөөрнө (идэвхтэй) тул V-ing. Бие даасан үйл үг (permits) орвол холбоосгүй хоёр өгүүлбэр болно.',
      hint: 'Өөрийн эзэнтэй participle clause.',
    },
    {
      id: 'c1-08-3',
      ruleId: 8,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'When asked about the scandal, the minister declined to comment.',
        'With the deadline is approaching, everyone was working late.',
        'Walking into the room, the lights suddenly went out.',
        'Having been finished her speech, she sat down.',
      ],
      answer: 'When asked about the scandal, the minister declined to comment.',
      explanation: 'When (he was) asked — холбоос + V3, эзэн нь үндсэн өгүүлбэрийн эзэнтэй ижил тул зөв. with-ийн ард is орохгүй; «гэрэл» өрөөнд алхаж ороогүй (dangling participle); өөрөө үгээ дуусгасан бол Having finished.',
      hint: 'Хоёр хэсгийн эзэн ижил эсэхийг шалга.',
    },
    {
      id: 'c1-08-4',
      ruleId: 8,
      kind: 'translate',
      question: 'Бүх зүйлийг харгалзан үзвэл аялал амжилттай болсон.',
      options: [
        'All things considered, the trip was a success.',
        'All things considering, the trip was a success.',
        'All things are considered, the trip was a success.',
        'Considered all things, the trip was a success.',
      ],
      answer: 'All things considered, the trip was a success.',
      explanation: 'All things considered — тогтсон absolute бүтэц: «бүх зүйл» харгалзан үзэгдэнэ (идэвхгүй) тул V3. considering гэвэл «бүх зүйл» өөрөө бодож байгаа болно; are нэмбэл холбоосгүй хоёр өгүүлбэр болно.',
      hint: 'Нэр үг + V3, бие даасан үйл үггүй.',
    },
  ],
};
