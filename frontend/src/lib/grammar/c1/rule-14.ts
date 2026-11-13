// frontend/src/lib/grammar/c1/rule-14.ts
// C1 дүрэм 14: Advanced relative clauses
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule14: GrammarRule = {
  id: 14,
  title: 'Advanced relative clauses',
  titleMn: 'Тодотгол гишүүн өгүүлбэрийн ахисан хэлбэрүүд — most of whom, whereby, in which case, whoever',
  hook: '«…тэдний ихэнх нь оюутан», «…тэр тохиолдолд бид хойшлуулна», «хэн түрүүлж ирсэн нь…», «анх ирсэн хүн» — хоёр өгүүлбэрийг нэг болгон уях C1 түвшний дөрвөн арга.',
  summary: 'Тоо хэмжээний үг + of whom / of which (most of whom, neither of which, all of which) нь бүлгийн хэсгийн тухай нэмэлт мэдээлэл өгнө. whereby («үүний дагуу, үүгээр») ба wherein («үүн дотор») нь албан хэлний холбоос. in which case / at which point / by which time нь өмнөх бүтэн өгүүлбэртэй холбоно. what / whatever / whoever / whichever нь нэр үггүйгээр өөрөө эзэн, тусагдахуун болдог nominal relative clause үүсгэнэ. the first / last / only + нэр үг + to V1 нь тодотголыг хураангуйлна.',
  description: 'B1-ийн 13-р дүрэмд defining ба non-defining тодотгол өгүүлбэрийг, B2-ийн 9-р дүрэмд whose, whom, угтвар үг + which (the city in which I live) болон өмнөх бүтэн өгүүлбэрийг заах which-ийг (He was late, which annoyed everyone) үзсэн. C1-д эдгээр дээр таван бүтэц нэмнэ. (1) Тоо хэмжээний үг + of whom / of which: I have three brothers, all of whom live abroad. Хоёр өгүүлбэрийг (…three brothers. All of them live abroad.) нэг болгоно; үргэлж таслалтай, non-defining; хүнд whom, юманд which — who, that, them хэрэглэхгүй. (2) whereby = by which / according to which: a system whereby staff can work from home — system, process, agreement, scheme, method зэрэг нэр үгийн ард «үүний дагуу, үүгээр дамжуулан» гэсэн утгаар; wherein = in which, маш албан, хууль зүйн хэлэнд. (3) which + нэр үг бүхий холбоос хэллэг: in which case («тэр тохиолдолд»), at which point («тэр мөчид»), by which time («тэр болтол, тэр үед аль хэдийн»). Эдгээр нь өмнөх бүтэн өгүүлбэрийг заана. (4) Nominal relative clause: what (= the thing that), whatever (= anything that), whoever (= anyone who / the person who), whichever (= any one that) — тодотгох нэр үг нь өөрт нь багтсан тул гишүүн өгүүлбэр бүхэлдээ эзэн эсвэл тусагдахуун болно: Whoever finishes first can leave. (5) To-infinitive-ээр хураангуйлсан тодотгол: the first person who arrived → the first person to arrive; зөвхөн the first / last / next / only болон superlative-ийн ард. Эдгээр нь ихэвчлэн бичгийн, албан хэлний бүтэц боловч in which case, the first to…, whatever / whoever нь ярианд ч түгээмэл. Монголоор тодотгол өгүүлбэр нэр үгийнхээ өмнө ирдэг, харин эдгээр утгыг ихэвчлэн «тэдний ихэнх нь», «тэр тохиолдолд» гэж шинэ өгүүлбэрээр хэлдэг тул англиар нэг өгүүлбэрт уях нь дасгал шаарддаг.',
  structure: 'Noun, + quantifier + of whom / of which + verb · noun + whereby + clause · clause, + in which case / at which point / by which time + clause · What / Whoever / Whichever + clause (= эзэн / тусагдахуун) · the first / last / only + noun + to V1',
  structureParts: [
    { text: 'I have three brothers,', part: 'plain' },
    { text: 'all of whom', part: 'subject' },
    { text: 'live', part: 'verb' },
    { text: 'abroad', part: 'modifier' },
  ],
  tip: 'most of WHOM (хүн) / most of WHICH (юм) — who, that, them биш · whereby = by which · in which case = тэр тохиолдолд · what = the thing that (all what, the thing what гэж байхгүй) · the first / last / only + to V1.',
  examples: [
    { en: '[I](s) [interviewed](v) [ten candidates](o), [most of whom had no experience](m).', mn: 'Би арван нэр дэвшигчтэй ярилцлага хийсэн бөгөөд тэдний ихэнх нь туршлагагүй байв.' },
    { en: '[They](s) [introduced](v) [a system](o) [whereby staff can work from home](m).', mn: 'Тэд ажилтнууд гэрээсээ ажиллах боломжтой тогтолцоо нэвтрүүлсэн.' },
    { en: '[It](s) [may rain](v), [in which case we\'ll meet indoors](m).', mn: 'Бороо орж магадгүй, тэр тохиолдолд бид дотор уулзана.' },
    { en: '[He](s) [was](v) [the first person](o) [to arrive](m) [and the last to leave](m).', mn: 'Тэр хамгийн түрүүнд ирж, хамгийн сүүлд явсан хүн байв.' },
  ],
  useCases: [
    {
      title: 'Тоо хэмжээний үг + of whom / of which — бүлгийн хэсгийн тухай',
      description: 'Өмнө дурдсан бүлгийн бүгд, ихэнх, зарим, аль нь ч биш гэдгийг нэмж хэлнэ. all, both, most, many, some, several, a few, half, none, neither, each, two, the majority, мөн superlative (the cheapest of which) орж болно. Үргэлж таслалтай. Хүнд of whom, юманд of which.',
      examples: [
        { en: '[The company](s) [has](v) [200 employees](o), [many of whom work remotely](m).', mn: 'Компани 200 ажилтантай бөгөөд тэдний олонх нь зайнаас ажилладаг.' },
        { en: '[She](s) [wrote](v) [two novels](o), [neither of which was published](m).', mn: 'Тэр хоёр роман бичсэн ч аль нь ч хэвлэгдээгүй.' },
        { en: '[We](s) [tested](v) [five phones](o), [the cheapest of which performed best](m).', mn: 'Бид таван утас туршсан бөгөөд хамгийн хямд нь хамгийн сайн ажилласан.' },
      ],
    },
    {
      title: 'whereby / wherein — албан хэлний тодотгол холбоос',
      description: 'whereby = by which / according to which: арга, тогтолцоо, гэрээ, журам заасан нэр үгийн (system, process, agreement, scheme, method, arrangement) ард «үүний дагуу, үүгээр» гэж тайлбарлана. wherein = in which: маш албан, хууль зүй, эрдэм шинжилгээний бичвэрт. Аль аль нь таслалгүй defining тодотгол.',
      examples: [
        { en: '[They](s) [signed](v) [an agreement](o) [whereby both sides share the costs](m).', mn: 'Тэд хоёр тал зардлаа хуваан үүрэх гэрээнд гарын үсэг зурсан.' },
        { en: '[We](s) [need](v) [a process](o) [whereby complaints are handled within a week](m).', mn: 'Бидэнд гомдлыг долоо хоногийн дотор шийдвэрлэдэг журам хэрэгтэй.' },
        { en: '[This](s) [is](v) [the chapter](o) [wherein the author explains her method](m).', mn: 'Энэ бол зохиогч арга зүйгээ тайлбарласан бүлэг юм.' },
      ],
    },
    {
      title: 'in which case / at which point / by which time',
      description: 'B2-д үзсэн «бүтэн өгүүлбэрийг заах which»-ийн өргөтгөл: which нь нэр үгийн өмнө тодотгогч болж, өмнөх өгүүлбэрийн нөхцөл байдлыг бүхэлд нь заана. in which case — «хэрэв тэгвэл», at which point — «яг тэр мөчид», by which time — «тэр үед аль хэдийн» (ихэвчлэн Past Perfect-тэй). Өмнө нь таслал.',
      examples: [
        { en: '[The flight](s) [might be cancelled](v), [in which case you will get a refund](m).', mn: 'Нислэг цуцлагдаж магадгүй, тэр тохиолдолд та мөнгөө буцааж авна.' },
        { en: '[The fire alarm](s) [went off](v), [at which point everyone left the building](m).', mn: 'Галын дохиолол дуугарсан бөгөөд тэр мөчид бүгд байрнаас гарсан.' },
        { en: '[The ambulance](s) [arrived](v) [at nine](m), [by which time he had recovered](m).', mn: 'Түргэн тусламж есөн цагт ирсэн ч тэр үед тэр аль хэдийн сэргэчихсэн байв.' },
      ],
    },
    {
      title: 'Nominal relative clauses — what / whatever / whoever / whichever',
      description: 'Эдгээр үгс тодотгох нэр үгээ өөртөө агуулдаг: what = the thing(s) that, whoever = the person / anyone who, whatever = anything that, whichever = any one that. Гишүүн өгүүлбэр бүхэлдээ нэр үг шиг эзэн эсвэл тусагдахуун болно. Эзэн болсон үед таслал тавихгүй. (Whatever happens, I\'ll stay гэх мэт таслалтай буултын хэрэглээг C1-ийн 12-р дүрэмд үзсэн.)',
      examples: [
        { en: '[What she said](s) [surprised](v) [everyone](o).', mn: 'Түүний хэлсэн зүйл бүгдийг гайхшруулсан.' },
        { en: '[Whoever finishes first](s) [can leave](v) [early](m).', mn: 'Хэн түрүүлж дууссан нь эрт явж болно.' },
        { en: '[Take](v) [whichever seat you like](o).', mn: 'Аль таалагдсан суудалдаа суу.' },
      ],
    },
    {
      title: 'To-infinitive-ээр хураангуйлсан тодотгол — the first person to arrive',
      description: 'the first, the last, the next, the only болон superlative-ийн ард who / that + үйл үгийг to + V1 болгож хураана. Аль хэдийн дууссан, одоотой холбоотой үр дүнд to have + V3, идэвхгүй утгад to be + V3. Албан болон өдөр тутмын хэлэнд аль алинд нь түгээмэл.',
      examples: [
        { en: '[Neil Armstrong](s) [was](v) [the first person](o) [to walk on the Moon](m).', mn: 'Нил Армстронг бол саран дээр алхсан анхны хүн.' },
        { en: '[She](s) [is](v) [the only student](o) [to have passed every exam](m).', mn: 'Тэр бол бүх шалгалтаа давсан цорын ганц оюутан.' },
        { en: '[The next train](s) [to arrive at platform two](m) [is](v) [the express to Darkhan](o).', mn: 'Хоёрдугаар тавцанд ирэх дараагийн галт тэрэг бол Дарханы шуурхай галт тэрэг.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Quantifier + of whom / of which',
      structure: 'Noun, + all / both / most / many / some / none / neither / each / two + of whom (хүн) / of which (юм) + verb',
      examples: [
        { en: '[He](s) [has](v) [two sisters](o), [both of whom are doctors](m).', mn: 'Тэр хоёр эгчтэй бөгөөд хоёулаа эмч.' },
        { en: '[I](s) [received](v) [thirty emails](o), [none of which was urgent](m).', mn: 'Би гучин имэйл хүлээн авсан ч аль нь ч яаралтай биш байв.' },
        { en: '[There](s) [were](v) [three proposals](o), [each of which had its merits](m).', mn: 'Гурван санал байсан бөгөөд тус бүр өөрийн давуу талтай байв.' },
      ],
    },
    {
      label: 'whereby / in which case / at which point',
      structure: 'system / process / agreement + whereby + clause · clause, + in which case / at which point / by which time + clause',
      examples: [
        { en: '[It](s) [is](v) [a scheme](o) [whereby students repay the loan after graduating](m).', mn: 'Энэ бол оюутнууд зээлээ төгссөнийхөө дараа төлдөг хөтөлбөр юм.' },
        { en: '[He](s) [may refuse](v), [in which case we will need another plan](m).', mn: 'Тэр татгалзаж магадгүй, тэр тохиолдолд бидэнд өөр төлөвлөгөө хэрэгтэй болно.' },
        { en: '[We](s) [talked](v) [until midnight](m), [at which point I went home](m).', mn: 'Бид шөнө дунд хүртэл ярилцсан бөгөөд тэр үед би гэр лүүгээ явсан.' },
      ],
    },
    {
      label: 'Nominal relative clause',
      structure: 'What / Whatever / Whoever / Whichever + clause + verb … (эзэн) · verb + what / whatever / whoever / whichever + clause (тусагдахуун)',
      examples: [
        { en: '[She](s) [always does](v) [what she promises](o).', mn: 'Тэр амласан зүйлээ үргэлж хийдэг.' },
        { en: '[Whoever broke the window](s) [should pay](v) [for it](m).', mn: 'Цонхыг хэн хагалсан нь төлбөрийг нь төлөх ёстой.' },
        { en: '[Whatever you decide](s) [is](v) [fine with me](o).', mn: 'Чи юу гэж шийдсэн нь надад болно.' },
      ],
    },
    {
      label: 'the first / last / only + to-infinitive',
      structure: 'the first / last / next / only / superlative + noun + to V1 / to have V3 / to be V3',
      examples: [
        { en: '[Who](s) [was](v) [the last person](o) [to use the printer](m)?', mn: 'Принтерийг хамгийн сүүлд хэн ашигласан бэ?' },
        { en: '[It](s) [is](v) [the oldest manuscript](o) [to have survived](m).', mn: 'Энэ бол өнөөг хүртэл хадгалагдан үлдсэн хамгийн эртний гар бичмэл.' },
        { en: '[He](s) [was](v) [the youngest player](o) [to be selected for the team](m).', mn: 'Тэр багт сонгогдсон хамгийн залуу тоглогч байв.' },
      ],
    },
  ],
  signalWords: ['all of whom', 'most of whom', 'both of which', 'neither of which', 'none of which', 'whereby', 'wherein', 'in which case', 'at which point', 'by which time', 'what', 'whatever', 'whoever', 'whichever', 'the first / last / only … to V1'],
  notes: [
    'Тоо хэмжээний үг + of-ийн ард зөвхөн whom (хүн) эсвэл which (юм): most of who, most of that (буруу). …, most of them were… гэвэл хоёр бие даасан өгүүлбэрийг таслалаар залгасан алдаа (comma splice) болно — цэг эсвэл and хэрэгтэй.',
    'Үйл үгийн зохицол: all / most / many / both of whom + олон тоо (are, have); neither / each of which + ганц тоо (was, has); none of which-ийн ард ганц, олон аль аль нь болно.',
    'whereby нь where-ийн албан хувилбар БИШ. Газарт where (the town where I grew up), арга / тогтолцоо / гэрээнд whereby (a system whereby…). wherein маш албан — өдөр тутмын хэлэнд in which гэ.',
    'in which case / at which point / by which time-ийн өмнө таслал тавина, which-ийг that болгож сольж нэг өгүүлбэр болгохгүй: It might snow, in that case… (буруу — comma splice). Цэг тавиад In that case, … гэж шинэ өгүүлбэр эхлүүлж болно.',
    'what нь the thing that гэсэн үг тул өмнө нь нэр үг, all, everything тавихгүй: the thing what, all what, everything what (буруу) → what I know / all (that) I know / everything (that) I know.',
    'To-infinitive-ээр хураах нь зөвхөн the first / last / next / only болон superlative-ийн ард: the first person who arrived = the first person to arrive. Энгийн нэр үгийн ард ингэж хураахгүй (the man to arrive yesterday — буруу). V3 эсвэл V1 шууд залгахгүй: the first person arrived (буруу).',
  ],
  commonMistakes: [
    {
      wrong: 'She has three sons, all of them are engineers.',
      correct: 'She has three sons, all of whom are engineers.',
      explanation: 'Таслалын ард them хэрэглэвэл хоёр бие даасан өгүүлбэр холбоосгүй залгагдана. Нэг өгүүлбэрт уяхын тулд of whom. (Эсвэл цэг тавьж: … three sons. All of them are engineers.)',
    },
    {
      wrong: 'I\'ll tell you all what I know.',
      correct: 'I\'ll tell you all (that) I know. / I\'ll tell you what I know.',
      explanation: 'what нь өөрөө «the thing that» гэсэн утгатай тул all-ийн ард давхар орохгүй. all-ийн ард that (эсвэл юу ч үгүй), эсвэл all-гүйгээр what.',
    },
    {
      wrong: 'He was the first person arrived at the office.',
      correct: 'He was the first person to arrive at the office.',
      explanation: 'the first / last / only-ийн ард тодотголыг хураахдаа to + V1 хэрэглэнэ. Бүтэн хэлбэр нь the first person who arrived.',
    },
    {
      wrong: 'It might snow, in that case the trip will be cancelled.',
      correct: 'It might snow, in which case the trip will be cancelled.',
      explanation: 'that нь хоёр өгүүлбэрийг холбож чадахгүй. Таслалын ард холбох үүргийг which гүйцэтгэнэ: in which case. In that case хэрэглэвэл өмнө нь цэг тавина.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «…бөгөөд тэдний ихэнх нь», «…ч аль нь ч» гэж «бөгөөд / ч» холбоос + «тэдний … нь» хэрэглэдэг эсвэл шинэ өгүүлбэр эхэлдэг. Англиар «тэдний» гэдгийг of whom / of which орлож, хоёр өгүүлбэрийг таслалаар шууд уядаг. «Тэдний ихэнх нь» = most of whom, «аль аль нь» = both of whom, «аль нь ч … -гүй» = neither / none of which.',
      'Монголоор «тэр тохиолдолд», «тэр мөчид», «тэр үед аль хэдийн» гэж заах төлөөний үг «тэр»-ээр өмнөх өгүүлбэртэй холбодог. Англиар that-ийн оронд which тавьж байж нэг өгүүлбэр болно: in which case, at which point, by which time. «Тэр»-ийг үгчлэн that гэж орчуулбал comma splice алдаа гарна.',
      'Монголоор «түүний хэлсэн зүйл», «хэн түрүүлж дууссан нь», «чиний шийдсэн болгон» гэж үйлт нэр + «зүйл / нь / хүн» хэрэглэдэг. Англиар what, whoever, whatever нь «зүйл», «хүн» гэсэн нэр үгийг өөртөө агуулдаг тул давхар нэр үг хэрэггүй — the thing what гэсэн алдаа эндээс гардаг.',
      'Монголоор «анх ирсэн хүн», «хамгийн сүүлд гарсан хүн» гэж үйлт нэр нэр үгийнхээ өмнө ирдэг. Англиар нэр үгийн АРД to + V1: the first person to arrive, the last person to leave. Мөн «…-даг тогтолцоо / журам / гэрээ» гэсэн урт тодотголыг англиар нэр үгийн ард whereby-ээр залгана: a system whereby….',
    ],
  },
  dialogue: [
    {
      en: 'Bat, [how many people](s) [have registered](v) [for the conference](m)?',
      mn: 'Бат, бага хуралд хэдэн хүн бүртгүүлсэн бэ?',
      speaker: 'Saraa',
    },
    {
      en: 'About three hundred, [most of whom are students](m). [We](s) [also invited](v) [twelve speakers](o), [two of whom haven\'t replied](m).',
      mn: 'Гурван зуу орчим, ихэнх нь оюутан. Мөн бид арван хоёр илтгэгч урьсан бөгөөд тэдний хоёр нь хариу өгөөгүй байна.',
      speaker: 'Bat',
    },
    {
      en: '[They](s) [might say](v) [no](o), [in which case we\'ll need replacements](m). [Who](s) [was](v) [the first speaker](o) [to confirm](m)?',
      mn: 'Тэд татгалзаж магадгүй, тэр тохиолдолд бидэнд орлох хүн хэрэгтэй болно. Хамгийн түрүүнд баталгаажуулсан илтгэгч хэн байсан бэ?',
      speaker: 'Saraa',
    },
    {
      en: 'Professor Dorj. [He](s) [suggested](v) [a format](o) [whereby each talk is followed by a short debate](m).',
      mn: 'Дорж профессор. Тэр илтгэл бүрийн дараа богино мэтгэлцээн явуулдаг хэлбэр санал болгосон.',
      speaker: 'Bat',
    },
    {
      en: 'Good idea. [Whoever chairs the first session](s) [will need](v) [a timer](o), though.',
      mn: 'Сайхан санаа байна. Гэхдээ эхний хуралдааныг хэн удирдсан нь цаг хэмжигчтэй байх хэрэгтэй.',
      speaker: 'Saraa',
    },
    {
      en: 'Agreed. [What worries me](s) [is](v) [the lunch break](o) — [last year](m) [the food](s) [arrived](v) [at two](m), [by which time half the audience had left](m).',
      mn: 'Санал нэг байна. Миний санааг зовоож байгаа зүйл бол үдийн завсарлага — өнгөрсөн жил хоол хоёр цагт ирсэн, тэр үед үзэгчдийн тал нь аль хэдийн явчихсан байсан.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'c1-14-1',
      ruleId: 14,
      kind: 'fill',
      question: 'The museum has 5,000 paintings, most of ___ are kept in storage.',
      options: ['which', 'them', 'that', 'whom'],
      answer: 'which',
      explanation: 'Тоо хэмжээний үг + of + which (юм). them гэвэл хоёр өгүүлбэр холбоосгүй залгагдана; of-ийн ард that орохгүй; whom зөвхөн хүнд.',
      hint: 'Зураг — юм; of-ийн ард that, them биш.',
    },
    {
      id: 'c1-14-2',
      ruleId: 14,
      kind: 'fill',
      question: 'I might miss the last bus, ___ I\'ll take a taxi.',
      options: ['in which case', 'by which time', 'whereby', 'in what case'],
      answer: 'in which case',
      explanation: '«Тэр тохиолдолд» — болзошгүй нөхцөлийн үр дагавар тул in which case. by which time «тэр үед аль хэдийн» гэсэн цагийн утгатай; whereby арга, тогтолцоог тайлбарлана; in what case гэж холбохгүй.',
      hint: '«Хэрэв тэгвэл, тэр тохиолдолд».',
    },
    {
      id: 'c1-14-3',
      ruleId: 14,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'She was the only candidate to answer every question.',
        'He has two brothers, both of who live in Erdenet.',
        'I didn\'t hear the thing what he said.',
        'Whoever arrive late must wait outside.',
      ],
      answer: 'She was the only candidate to answer every question.',
      explanation: 'the only + нэр үг + to V1 — зөв хураангуй тодотгол. of-ийн ард who биш whom (both of whom); the thing what гэж байхгүй (what he said); whoever ганц тооны үйл үгтэй (arrives).',
      hint: 'of whom, what, whoever + -s гурвыг шалга.',
    },
    {
      id: 'c1-14-4',
      ruleId: 14,
      kind: 'translate',
      question: 'Хэн түрүүлж дууссан нь эрт явж болно.',
      options: [
        'Whoever finishes first can leave early.',
        'Who finishes first can leave early.',
        'Whatever finishes first can leave early.',
        'Anyone finishes first can leave early.',
      ],
      answer: 'Whoever finishes first can leave early.',
      explanation: '«Хэн … нь» = whoever (= anyone who) — гишүүн өгүүлбэр бүхэлдээ эзэн болно. who дангаараа ингэж хэрэглэгдэхгүй; whatever юманд; anyone-ийн ард who дутуу байна.',
      hint: 'whoever = anyone who.',
    },
  ],
};
