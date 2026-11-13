// frontend/src/lib/grammar/c1/rule-13.ts
// C1 дүрэм 13: Hedging & distancing language
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule13: GrammarRule = {
  id: 13,
  title: 'Hedging & distancing language',
  titleMn: 'Hedging ба distancing — хэлэх зүйлээ зөөлрүүлж, болгоомжтой илэрхийлэх',
  hook: '«Таны тооцоо буруу байна» гэхийн оронд «Тооцоонд алдаа байгаа бололтой» — эрдэм шинжилгээ, ажил хэргийн англи хэлэнд шууд батлахаас зайлсхийж, болгоомжтой, эелдэг ярих ур чадварыг эзэмшицгээе.',
  summary: 'Hedging гэдэг нь мэдэгдлээ 100% баттай мэт хэлэхгүй, «бололтой», «хандлагатай», «гэж үзэж болох юм» гэж зөөлрүүлэх арга. Гол хэрэгслүүд: seem / appear to + V1, tend to + V1, It would seem / appear that…, дайвар үгс (apparently, arguably, presumably, to some extent), There is thought / believed to be…, modal үйл үгс (may, might, could) болон would suggest / would argue. Эрдэм шинжилгээний бичвэрт нарийвчлал, ажил хэргийн харилцаанд эелдэг байдлыг хангана.',
  description: 'B2-ийн 6-р дүрэмд бид passive reporting-ийг үзсэн: It is said that… / He is said to… — мэдээллийн эх сурвалжаас өөрийгөө холдуулах (distancing) анхны хэрэгсэл. B2-ийн 4-р дүрэм, C1-ийн 6-р дүрэмд modal үйл үгээр магадлал илэрхийлэхийг, C1-ийн 7-р дүрэмд perfect infinitive-ийг (seem to have done) үзсэн. Энэ дүрэм тэдгээрийг нэг зорилгод нэгтгэнэ: хэлж буй зүйлийнхээ баттай байдлыг зориуд бууруулах. Яагаад хэрэгтэй вэ? Эрдэм шинжилгээний хэлэнд «The results prove that…» гэвэл хэт хүчтэй, няцаагдах эрсдэлтэй; «The results would seem to suggest that…» гэвэл нарийн, шударга. Ажил хэргийн харилцаанд «You made a mistake» гэвэл бүдүүлэг; «There seems to be a mistake» гэвэл хэнийг ч буруутгахгүй эелдэг. Хэрэгслүүд: (1) seem / appear + to-infinitive — сэтгэгдэл, харагдах байдал; өнгөрсөн үйлдэлд to have + V3, үргэлжилж буйд to be + V-ing. (2) tend to — «ихэвчлэн, хандлагатай», ерөнхийлсөн дүгнэлтийг зөөлрүүлнэ. (3) It would seem / appear that… — would нэмснээр бүр илүү болгоомжтой. (4) Дайвар үгс: apparently («сонссоноор, бололтой»), arguably («гэж үзэх үндэстэй»), presumably («тэгж таамаглахад»), seemingly, to some extent («тодорхой хэмжээгээр»). (5) There is thought / believed / said to be… — passive reporting-ийн there-тэй хувилбар. (6) Modal hedges: may / might / could, would suggest / would argue / would say. Монгол хэлэнд энэ утгыг «бололтой», «юм шиг байна», «байх», «гэнэ», «гэж үзэж болно» зэрэг төгсгөлийн хэлбэр, сул үгээр илэрхийлдэг бол англиар үйл үг, дайвар үг, modal-аар илэрхийлдэг. Гол анхаарах зүйл: хэт олон hedge давхарлавал утга бүдгэрнэ — нэг мэдэгдэлд нэг, хоёр л хангалттай.',
  structure: 'subject + seem / appear / tend + to V1 · It would seem / appear that + clause · Apparently / Arguably / Presumably, + clause · There + is / are + thought / believed + to be + noun · subject + may / might / could / would suggest …',
  structureParts: [
    { text: 'The results', part: 'subject' },
    { text: 'would seem to suggest', part: 'verb' },
    { text: 'a link', part: 'object' },
    { text: '· apparently / arguably / to some extent', part: 'modifier' },
  ],
  tip: 'seem / appear to = бололтой · tend to = хандлагатай · it would seem that = бүр болгоомжтой · apparently = сонссоноор (obviously БИШ) · arguably = гэж үзэх үндэстэй · There are thought to be + олон тоо · нэг мэдэгдэлд нэг, хоёр hedge.',
  examples: [
    { en: '[The new policy](s) [appears to be working](v).', mn: 'Шинэ бодлого үр дүнгээ өгч байгаа бололтой.' },
    { en: '[It](s) [would seem](v) [that the figures are incorrect](o).', mn: 'Тоо баримт буруу байгаа юм шиг санагдаж байна.' },
    { en: '[This](s) [is](v) [arguably](m) [the best film of the year](o).', mn: 'Энэ бол энэ жилийн шилдэг кино гэж үзэх үндэстэй.' },
    { en: '[There](s) [are thought to be](v) [around a thousand snow leopards](o) [in Mongolia](m).', mn: 'Монголд мянга орчим цоохор ирвэс байдаг гэж үздэг.' },
  ],
  useCases: [
    {
      title: 'seem / appear to — баримт биш, сэтгэгдэл',
      description: 'Өөрийн ажигласан, харсан зүйл дээр үндэслэсэн болгоомжтой дүгнэлт. Одоогийн байдалд to + V1, үргэлжилж буй үйлдэлд to be + V-ing, өмнө болсон үйлдэлд to have + V3 (C1-ийн 7-р дүрэм). There seems to be… нь асуудлыг хэнийг ч буруутгахгүйгээр хэлэх сонгодог арга. appear нь seem-ээс арай албан.',
      examples: [
        { en: '[She](s) [seems to know](v) [a lot](o) [about the subject](m).', mn: 'Тэр энэ сэдвийн талаар их зүйл мэддэг бололтой.' },
        { en: '[The witness](s) [appears to have changed](v) [his story](o).', mn: 'Гэрч мэдүүлгээ өөрчилсөн бололтой.' },
        { en: '[There](s) [seems to be](v) [a misunderstanding](o).', mn: 'Үл ойлголцол гарсан бололтой.' },
      ],
    },
    {
      title: 'tend to — ерөнхийлсөн дүгнэлтийг зөөлрүүлэх',
      description: '«Бүгд үргэлж тэгдэг» гэхийн оронд «ихэвчлэн тэгдэг, тийм хандлагатай» гэнэ. Ерөнхий дүгнэлтэд үл хамаарах тохиолдол байдгийг хүлээн зөвшөөрсөн шударга хэлбэр. Үгүйсгэл: tend not to (албан) эсвэл don\'t tend to.',
      examples: [
        { en: '[Children](s) [tend to learn](v) [languages](o) [faster than adults](m).', mn: 'Хүүхдүүд насанд хүрэгчдээс хэлийг хурдан сурах хандлагатай.' },
        { en: '[Prices](s) [tend to rise](v) [before the holidays](m).', mn: 'Баярын өмнө үнэ ихэвчлэн өсдөг.' },
        { en: '[People](s) [tend not to read](v) [the small print](o).', mn: 'Хүмүүс жижиг үсгээр бичсэн нөхцөлийг ихэвчлэн уншдаггүй.' },
      ],
    },
    {
      title: 'It would seem / appear that… ба hedging дайвар үгс',
      description: 'It seems that-д would нэмбэл илүү албан, илүү болгоомжтой болно. Дайвар үгс өгүүлбэрийн эхэнд (таслалтай) эсвэл үйл үгийн өмнө ирнэ: apparently — бусдаас сонссон, өөрөө шалгаагүй; presumably — логикоор таамагласан; arguably — нотлох үндэстэй гэж үзсэн.',
      examples: [
        { en: '[It](s) [would appear](v) [that the email was never sent](o).', mn: 'Имэйл огт илгээгдээгүй бололтой.' },
        { en: '[Apparently](m), [the director](s) [has resigned](v).', mn: 'Сонссоноор захирал ажлаасаа гарсан гэнэ.' },
        { en: '[Presumably](m), [they](s) [will announce](v) [the results](o) [next week](m).', mn: 'Тэд үр дүнг ирэх долоо хоногт зарлах байх.' },
      ],
    },
    {
      title: 'There is thought / believed to be… — passive distancing',
      description: 'B2-ийн He is said to…-ийн there-тэй хувилбар: ямар нэг зүйл «байдаг гэж үздэг, тооцдог». Хэн тэгж үздэг нь чухал биш эсвэл тодорхойгүй. be нь ард ирэх нэр үгтэй тоогоор зохицно. Өнгөрсөнд to have been.',
      examples: [
        { en: '[There](s) [is believed to be](v) [a connection](o) [between the two cases](m).', mn: 'Энэ хоёр хэргийн хооронд холбоо бий гэж үзэж байна.' },
        { en: '[There](s) [are said to be](v) [several candidates](o) [for the post](m).', mn: 'Энэ албан тушаалд хэд хэдэн нэр дэвшигч байгаа гэнэ.' },
        { en: '[The painting](s) [is thought to have been stolen](v) [in the 1990s](m).', mn: 'Уг зургийг 1990-ээд онд хулгайлагдсан гэж үздэг.' },
      ],
    },
    {
      title: 'Modal hedges — эрдэм шинжилгээ ба эелдэг ажил хэргийн хэл',
      description: 'may / might / could нь «байж магадгүй» гэж баттай байдлыг бууруулна. would нь suggest, argue, say, think, seem-ийн өмнө орж саналыг зөөлрүүлнэ: I would argue that… = «миний бодлоор … гэж хэлмээр байна». It might be worth + V-ing нь эелдэг зөвлөмж.',
      examples: [
        { en: '[These findings](s) [may indicate](v) [a wider problem](o).', mn: 'Эдгээр үр дүн илүү өргөн хүрээний асуудлыг илтгэж байж магадгүй.' },
        { en: '[The data](s) [would suggest](v) [that demand is falling](o).', mn: 'Өгөгдлөөс харахад эрэлт буурч байгаа бололтой.' },
        { en: '[It](s) [might be](v) [worth checking the figures again](o).', mn: 'Тоонуудыг дахин шалгавал зүгээр болов уу.' },
      ],
    },
  ],
  forms: [
    {
      label: 'seem / appear + infinitive',
      structure: 'subject + seem / appear + to V1 / to be V-ing / to have V3 · It seems / appears (that) + clause',
      examples: [
        { en: '[He](s) [seems to be enjoying](v) [his new job](o).', mn: 'Тэр шинэ ажилдаа дуртай байгаа бололтой.' },
        { en: '[The company](s) [appears to have lost](v) [several major clients](o).', mn: 'Компани хэд хэдэн том харилцагчаа алдсан бололтой.' },
        { en: '[It](s) [seems](v) [that nobody was informed](o).', mn: 'Хэнд ч мэдэгдээгүй бололтой.' },
      ],
    },
    {
      label: 'Hedging дайвар үг, хэллэг',
      structure: 'Apparently / Presumably / Arguably, + clause · subject + be + arguably / seemingly + … · To some extent, + clause',
      examples: [
        { en: '[To some extent](m), [I](s) [agree](v) [with the author](m).', mn: 'Тодорхой хэмжээгээр би зохиогчтой санал нийлж байна.' },
        { en: '[This](s) [is](v) [arguably](m) [her most important work](o).', mn: 'Энэ бол түүний хамгийн чухал бүтээл гэж үзэж болох юм.' },
        { en: '[The two events](s) [are](v) [seemingly](m) [unrelated](o).', mn: 'Энэ хоёр үйл явдал өнгөц харахад хоорондоо холбоогүй.' },
      ],
    },
    {
      label: 'There + passive + to be',
      structure: 'There + is / are + thought / believed / said / estimated / expected + to be / to have been + noun',
      examples: [
        { en: '[There](s) [are estimated to be](v) [three million speakers](o) [of the language](m).', mn: 'Энэ хэлээр гурван сая хүн ярьдаг гэж тооцдог.' },
        { en: '[There](s) [is thought to have been](v) [a settlement](o) [here](m) [in the Bronze Age](m).', mn: 'Хүрэл зэвсгийн үед энд суурин байсан гэж үздэг.' },
        { en: '[There](s) [is expected to be](v) [strong demand](o) [for tickets](m).', mn: 'Тасалбарын эрэлт их байх төлөвтэй.' },
      ],
    },
    {
      label: 'Modal hedges',
      structure: 'subject + may / might / could + V1 · subject + would + suggest / argue / say / seem + (that) …',
      examples: [
        { en: '[This](s) [could be](v) [one explanation](o) [for the delay](m).', mn: 'Энэ нь саатлын нэг тайлбар байж болох юм.' },
        { en: '[I](s) [would say](v) [the second option is safer](o).', mn: 'Миний бодлоор хоёр дахь хувилбар нь аюулгүй юм шиг.' },
        { en: '[The results](s) [might not be](v) [entirely reliable](o).', mn: 'Үр дүн бүрэн найдвартай биш байж магадгүй.' },
      ],
    },
  ],
  signalWords: ['seem to', 'appear to', 'tend to', 'it would seem that', 'it would appear that', 'apparently', 'arguably', 'presumably', 'seemingly', 'to some extent', 'there is thought to be', 'there are believed to be', 'may / might / could', 'would suggest', 'I would argue'],
  notes: [
    'seem, appear (бололтой гэсэн утгаар) нь төлөв байдлын үйл үг тул үргэлжилсэн цагт орохгүй: It is seeming (буруу) → It seems. Үгүйсгэл: He doesn\'t seem to know (түгээмэл) / He seems not to know (албан).',
    'apparently нь «илт, мэдээж» (obviously, clearly) гэсэн үг БИШ. «Сонссоноор, харваас тийм бололтой, гэхдээ би өөрөө шалгаагүй» гэсэн утгатай: Apparently, he\'s leaving = Тэр явах гэнэ.',
    'arguably нь эргэлзээ биш, дэмжлэг: «үүнийг нотлох хангалттай үндэслэл бий» гэсэн утгатай, ихэвчлэн superlative-ийн өмнө ирнэ (arguably the best). presumably = «би тэгж таамаглаж байна».',
    'He seems-ийн ард that-тай өгүүлбэр залгахгүй: He seems that he is tired (буруу). Хоёр зөв хувилбар: He seems to be tired / It seems that he is tired.',
    'There + passive бүтцэд be нь ард ирэх нэр үгтэй зохицно: There is thought to be a problem, гэхдээ There are thought to be many problems.',
    'Хэт их hedge бүү давхарла: It may possibly perhaps seem that… гэвэл утгагүй болно. Нэг мэдэгдэлд нэг, хоёр л хэрэглэ. Баттай баримтад (Water boils at 100°C) hedge хэрэггүй. tend-ийн өмнө be тавихгүй: People are tend to (буруу).',
  ],
  commonMistakes: [
    {
      wrong: 'It is seeming that the plan has failed.',
      correct: 'It seems that the plan has failed.',
      explanation: 'seem нь төлөв байдлын үйл үг тул Present Continuous-д хэрэглэхгүй. Монголоор «санагдаж байна» гэдэг тул -ing сонгох алдаа гардаг.',
    },
    {
      wrong: 'He seems that he is tired.',
      correct: 'He seems to be tired. / It seems that he is tired.',
      explanation: 'Эзэн нь хүн (He) бол seem + to-infinitive. that-тай гишүүн өгүүлбэр зөвхөн хоосон эзэн It-тэй: It seems that…',
    },
    {
      wrong: 'There is thought to be many reasons for this.',
      correct: 'There are thought to be many reasons for this.',
      explanation: 'There-ийн дараах be нь жинхэнэ эзэн болох нэр үгтэй (many reasons — олон тоо) зохицно: are.',
    },
    {
      wrong: 'People are tend to forget passwords.',
      correct: 'People tend to forget passwords.',
      explanation: 'tend нь өөрөө үйл үг тул өмнө нь be тавихгүй. be likely to, be inclined to-той андуурснаас гардаг алдаа.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор hedging-ийг өгүүлбэрийн төгсгөлд сул үг, нөхцөлөөр хийдэг: «бололтой», «юм шиг байна», «байх», «болов уу», «гэнэ». Англиар үйл үгийн өмнө seem / appear / may, эсвэл өгүүлбэрийн эхэнд дайвар үгээр хийнэ. «Бололтой» ≈ seem / appear to, «гэнэ, гэсэн» ≈ apparently / is said to, «байх» ≈ presumably / probably.',
      'Монголоор «…-даг хандлагатай», «ихэвчлэн …-даг» гэдэг нь tend to-тэй таарна: Prices tend to rise = Үнэ ихэвчлэн өсдөг. tend to-г «хандлагатай байна» гэж үгчлэн бодоод be нэмж are tend to гэх алдаанаас болгоомжил.',
      'Монголоор ажил хэргийн харилцаанд «Таны тооцоо буруу байна» гэж шууд хэлэх нь хэвийн сонсогдож болох ч англиар үгчлэн You are wrong, Your calculation is wrong гэвэл хатуу, бүдүүлэг сонсогддог. There seems to be a mistake in the calculation, I\'m not sure this is quite right гэж зөөлрүүлэх нь эелдэг хэм хэмжээ.',
      'Монгол эрдэм шинжилгээний хэлний «…гэж үзэж болно», «…гэж үздэг», «тодорхой хэмжээгээр», «зарим талаар» гэсэн хэллэгүүд arguably, is thought to, to some extent, in some respects-тэй шууд таарна. Санаа нь танил, зөвхөн хэлбэр нь өөр — англиар эдгээр нь үйл үгийн өмнө эсвэл өгүүлбэрийн эхэнд байрлана.',
    ],
  },
  dialogue: [
    {
      en: 'Nomin, [what](o) [do](v) [your results](s) [show](v) [so far](m)?',
      mn: 'Номин, чиний судалгааны үр дүн одоогоор юу харуулж байна вэ?',
      speaker: 'Temuulen',
    },
    {
      en: '[They](s) [would seem to suggest](v) [that students learn faster in small groups](o), [at least to some extent](m).',
      mn: 'Оюутнууд жижиг бүлэгт илүү хурдан суралцдаг бололтой, наад зах нь тодорхой хэмжээгээр.',
      speaker: 'Nomin',
    },
    {
      en: 'Interesting. [But](m) [the sample](s) [appears to be](v) [quite small](o), [doesn\'t it](m)?',
      mn: 'Сонирхолтой юм. Гэхдээ түүвэр нэлээд жижиг юм шиг харагдаж байна, тийм үү?',
      speaker: 'Temuulen',
    },
    {
      en: 'True. [It](s) [may not be](v) [fully representative](o), [so](m) [I](s) [would treat](v) [the figures](o) [with caution](m).',
      mn: 'Үнэн. Бүрэн төлөөлж чадахгүй байж магадгүй, тиймээс би эдгээр тоонд болгоомжтой хандах нь зүйтэй гэж бодож байна.',
      speaker: 'Nomin',
    },
    {
      en: '[Apparently](m), [a team in Erdenet](s) [got](v) [similar results](o). [There](s) [are thought to be](v) [several studies](o) [under way](m).',
      mn: 'Сонссоноор Эрдэнэтийн нэг баг төстэй үр дүн гаргасан гэнэ. Хэд хэдэн судалгаа хийгдэж байгаа гэж үзэж байна.',
      speaker: 'Temuulen',
    },
    {
      en: '[That](s) [is](v) [arguably](m) [good news](o). [Smaller classes](s) [do tend to cost](v) [more](o), though, [so](m) [we](s) [might need](v) [stronger evidence](o).',
      mn: 'Энэ бол сайн мэдээ гэж үзэж болох юм. Гэхдээ жижиг анги үнэхээр илүү зардалтай байх хандлагатай тул бидэнд илүү баттай нотолгоо хэрэгтэй байж магадгүй.',
      speaker: 'Nomin',
    },
  ],
  quiz: [
    {
      id: 'c1-13-1',
      ruleId: 13,
      kind: 'fill',
      question: 'The CEO appears ___ the company last week.',
      options: ['to have left', 'to leave', 'leaving', 'that he left'],
      answer: 'to have left',
      explanation: 'last week — өмнө болсон үйлдэл тул appear + perfect infinitive: to have left. to leave нь одоо / ирээдүйн утгатай; appear-ийн ард -ing болон that he… залгахгүй.',
      hint: 'Өнгөрсөн үйлдэл = to have + V3.',
    },
    {
      id: 'c1-13-2',
      ruleId: 13,
      kind: 'fill',
      question: 'There ___ thought to be around 200 languages spoken in the city.',
      options: ['are', 'is', 'have', 'be'],
      answer: 'are',
      explanation: 'There + be + thought to be бүтцэд be нь ард ирэх нэр үгтэй зохицно: 200 languages — олон тоо тул are.',
      hint: 'Жинхэнэ эзэн нь languages.',
    },
    {
      id: 'c1-13-3',
      ruleId: 13,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Teenagers tend to sleep later than adults.',
        'The plan is seeming to work.',
        'She seems that she is upset.',
        'It would appears that we were wrong.',
      ],
      answer: 'Teenagers tend to sleep later than adults.',
      explanation: 'tend to + V1 — зөв. seem үргэлжилсэн цагт орохгүй (seems to be working); хүн эзэнтэй бол seem + to-infinitive (She seems to be upset); would-ийн ард V1 (would appear).',
      hint: 'seem-ийн хэлбэр, would-ийн дараах үйл үгийг шалга.',
    },
    {
      id: 'c1-13-4',
      ruleId: 13,
      kind: 'translate',
      question: 'Нэхэмжлэхэд алдаа байгаа бололтой.',
      options: [
        'There seems to be a mistake in the invoice.',
        'There seems being a mistake in the invoice.',
        'There is seeming a mistake in the invoice.',
        'There seem be a mistake in the invoice.',
      ],
      answer: 'There seems to be a mistake in the invoice.',
      explanation: '«Байгаа бололтой» = There seems to be + нэр үг. seem-ийн ард to-infinitive (to be); үргэлжилсэн цаг болон to-гүй хэлбэр буруу; a mistake ганц тоо тул seems.',
      hint: 'There seems + to be.',
    },
  ],
};
