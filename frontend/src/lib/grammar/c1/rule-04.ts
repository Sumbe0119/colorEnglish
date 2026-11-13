// frontend/src/lib/grammar/c1/rule-04.ts
// C1 дүрэм 4: The subjunctive — I suggest that he be…
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule04: GrammarRule = {
  id: 4,
  title: 'The subjunctive: I suggest that he be…',
  titleMn: 'Subjunctive — санал, шаардлага, зайлшгүй байдал: that he be, that she go',
  hook: '«I suggest that he be present» — яагаад he is биш, he be гэж? Санал, шаардлага, зайлшгүй байдлыг илэрхийлдэг албан ёсны subjunctive хэлбэрийг сурцгаая.',
  summary: 'suggest, recommend, insist, demand, propose, request зэрэг үйл үг болон It is essential / vital / important that … бүтцийн ард that + эзэн + үйл үгийн үндсэн хэлбэр (V1) орно: -s залгахгүй, цагаар хувирахгүй, be нь хэвээрээ be (I suggest that he be told; They demanded that she leave). Үгүйсгэхдээ not-ыг үйл үгийн өмнө тавина (that he not be told). Британи англи хэлэнд should + V1 түгээмэл (that he should be told). Be that as it may, so be it зэрэг тогтсон хэллэгт мөн гарна.',
  description: 'B1-ийн 15-р дүрэм (wish / if only) болон B2-ийн 12-р дүрэмд (as if / suppose) I wish I were …, as if he were … гэж were-ийг «бодит бус» утгаар хэрэглэхийг үзсэн — энэ нь past subjunctive юм. Харин энэ дүрмийн гол сэдэв бол present буюу mandative subjunctive: хэн нэгэн ямар нэг зүйл ХИЙХ ЁСТОЙ гэсэн санал, зөвлөмж, шаардлага, тушаал, зайлшгүй байдлыг илэрхийлэх that-clause-д үйл үг ямар ч биед, ямар ч цагт үндсэн хэлбэрээрээ байна. he goes биш he go, he is биш he be, he was биш he be. Үндсэн үйл үг өнгөрсөн цагт байсан ч (demanded, suggested) that-ийн дараах үйл үг ухрахгүй. B2-ийн 7-р дүрэмд reporting verbs-ийн хэв маягийг (suggest doing, advise somebody to do) үзсэн; suggest / recommend / insist + that + subjunctive бол тэдгээрийн хамгийн албан ёсны хувилбар. Хэрэглээ нь хууль, гэрээ, хурлын тэмдэглэл, албан захидал, эрдэм шинжилгээний бичвэр. Америк англи хэлэнд subjunctive өдөр тутмын ярианд ч түгээмэл, Британи англи хэлэнд ихэвчлэн should + V1-ээр орлуулдаг (I suggest that he should apply), албан бус ярианд ердийн цаг ч сонсогддог (I suggest that he applies) — шалгалт, албан бичигт subjunctive эсвэл should нь найдвартай сонголт. Монгол хэлэнд үйл үг биеэр хувирдаггүй, санал шаардлагыг «-хыг санал болгох / шаардах», «-х нь чухал» гэсэн хэлбэрээр хэлдэг тул he be, she go гэсэн «буруу мэт» хэлбэр хачин санагдах, эсвэл монгол бүтцийг дагаад suggest him to go гэж алдах нь элбэг.',
  structure: 'subject + suggest / recommend / insist / demand + (that) + subject + V1 · It is essential / vital / important + (that) + subject + V1 · negative: that + subject + not + V1',
  structureParts: [
    { text: 'I', part: 'subject' },
    { text: 'suggest / insist / demand', part: 'verb' },
    { text: 'that + subject', part: 'plain' },
    { text: 'V1 / be / not + V1', part: 'object' },
  ],
  tip: 'Санал, шаардлагын that-ийн ард үйл үг «хөлддөг»: -s үгүй, цаг үгүй, be = be. I suggest (that) he go · They demanded (that) she be informed · It is vital (that) he not be late · BrE: that he should go.',
  examples: [
    { en: '[I](s) [suggest](v) [that he be given another chance](o).', mn: 'Би түүнд дахин нэг боломж олгохыг санал болгож байна.' },
    { en: '[The doctor](s) [recommended](v) [that she take a week off](o).', mn: 'Эмч түүнд долоо хоног амрахыг зөвлөсөн.' },
    { en: '[It](s) [is](v) [essential](o) [that every member attend the meeting](o).', mn: 'Гишүүн бүр хуралд оролцох нь зайлшгүй чухал.' },
    { en: '[We](s) [insist](v) [that the report not be published](o).', mn: 'Бид тайланг нийтлэхгүй байхыг шаардаж байна.' },
  ],
  useCases: [
    {
      title: 'Санал, шаардлагын үйл үгийн ард',
      description: 'suggest, recommend, propose, advise (санал, зөвлөмж), insist, demand, require, order (шаардлага, тушаал), request, ask (хүсэлт) зэрэг үйл үгийн дараах that-clause-д V1. Үндсэн үйл үг ямар ч цагт байсан that-ийн дараах үйл үг хувирахгүй.',
      examples: [
        { en: '[The board](s) [proposed](v) [that the meeting be postponed](o).', mn: 'Удирдах зөвлөл хурлыг хойшлуулахыг санал болгосон.' },
        { en: '[She](s) [insisted](v) [that he apologise to the staff](o).', mn: 'Тэр эмэгтэй түүнийг ажилтнуудаас уучлалт гуйхыг шаардсан.' },
        { en: '[The union](s) [is demanding](v) [that every worker receive a pay rise](o).', mn: 'Үйлдвэрчний эвлэл ажилтан бүрийн цалинг нэмэхийг шаардаж байна.' },
      ],
    },
    {
      title: 'It is essential / vital / important that …',
      description: 'Зайлшгүй байдал, чухлыг илэрхийлэх тэмдэг нэрийн ард: essential, vital, crucial, imperative, important, necessary, advisable, desirable. It is … that + эзэн + V1.',
      examples: [
        { en: '[It](s) [is](v) [vital](o) [that the patient remain calm](o).', mn: 'Өвчтөн тайван байх нь амин чухал.' },
        { en: '[It](s) [is](v) [essential](o) [that everyone be informed of the changes](o).', mn: 'Хүн бүрд өөрчлөлтийн талаар мэдэгдэх нь зайлшгүй шаардлагатай.' },
        { en: '[It](s) [was](v) [important](o) [that she sign the form herself](o).', mn: 'Тэр маягтад өөрөө гарын үсэг зурах нь чухал байсан.' },
      ],
    },
    {
      title: 'Нэр үгийн ард — recommendation, demand, proposal',
      description: 'Дээрх үйл үгсээс үүссэн нэр үгийн (suggestion, recommendation, proposal, demand, request, requirement, insistence) дараах that-clause-д мөн адил V1. Тайлан, хурлын тэмдэглэл, мэдээнд түгээмэл.',
      examples: [
        { en: '[The judge](s) [rejected](v) [the demand that the witness be named](o).', mn: 'Шүүгч гэрчийн нэрийг зарлах шаардлагыг хүлээж аваагүй.' },
        { en: '[Our recommendation](s) [is](v) [that the company invest in training](o).', mn: 'Бидний зөвлөмж бол компани сургалтад хөрөнгө оруулах явдал юм.' },
        { en: '[There](s) [was](v) [a proposal that the school close early](o).', mn: 'Сургуулийг эрт хаах санал гарсан.' },
      ],
    },
    {
      title: 'Британи хувилбар — should + V1',
      description: 'Британи англи хэлэнд subjunctive-ийн оронд should + V1 маш түгээмэл; утга, албан ёсны түвшин бараг адил. Аль ч хувилбар шалгалт, албан бичигт зөвд тооцогдоно. Нэг бичвэрт аль нэгийг нь тууштай хэрэглээрэй.',
      examples: [
        { en: '[I](s) [suggest](v) [that he should see a specialist](o).', mn: 'Би түүнийг мэргэжлийн эмчид үзүүлэхийг санал болгож байна.' },
        { en: '[It](s) [is](v) [essential](o) [that staff should wear a badge](o).', mn: 'Ажилтнууд энгэрийн тэмдэг зүүх нь зайлшгүй шаардлагатай.' },
        { en: '[They](s) [recommended](v) [that we should book in advance](o).', mn: 'Тэд биднийг урьдчилан захиалахыг зөвлөсөн.' },
      ],
    },
    {
      title: 'Тогтсон хэллэгүүд — be that as it may, so be it',
      description: 'Subjunctive хэдэн тогтсон хэллэгт хадгалагдан үлдсэн: be that as it may (тэр нь тийм байлаа ч), so be it (тэгээд л болог), far be it from me to … (… гэх гэсэнгүй), come what may (юу ч болсон), suffice it to say (… гэхэд л хангалттай), Long live …! (… мандтугай!).',
      examples: [
        { en: '[Be that as it may](m), [we](s) [still](m) [have](v) [to cut costs](o).', mn: 'Тэр нь тийм байлаа ч бид зардлаа танах л хэрэгтэй.' },
        { en: '[If they want to leave](m), [so be it](o).', mn: 'Тэд явахыг хүсэж байгаа бол тэгээд л болог.' },
        { en: '[Far be it from me](m) [to criticise](v), [but](m) [the plan](s) [seems](v) [risky](o).', mn: 'Шүүмжлэх гэсэнгүй, гэхдээ төлөвлөгөө эрсдэлтэй санагдаж байна.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Батлах',
      structure: 'verb / adjective + (that) + subject + V1 (-s үгүй, цагаар хувирахгүй)',
      examples: [
        { en: '[I](s) [recommend](v) [that she take the earlier flight](o).', mn: 'Би түүнийг арай эрт нислэгээр явахыг зөвлөж байна.' },
        { en: '[The client](s) [requested](v) [that we send the invoice by email](o).', mn: 'Үйлчлүүлэгч нэхэмжлэхийг имэйлээр явуулахыг биднээс хүссэн.' },
        { en: '[It](s) [is](v) [crucial](o) [that the government act now](o).', mn: 'Засгийн газар яг одоо арга хэмжээ авах нь нэн чухал.' },
      ],
    },
    {
      label: 'be-тэй (идэвхгүй хэв, тэмдэг нэр)',
      structure: 'that + subject + be + V3 / adjective',
      examples: [
        { en: '[The lawyer](s) [advised](v) [that the contract be signed immediately](o).', mn: 'Хуульч гэрээнд нэн даруй гарын үсэг зурахыг зөвлөсөн.' },
        { en: '[It](s) [is](v) [imperative](o) [that all doors be locked at night](o).', mn: 'Шөнө бүх хаалгыг түгжих нь зайлшгүй шаардлагатай.' },
        { en: '[We](s) [ask](v) [that you be patient](o).', mn: 'Та бүхнийг тэвчээртэй байхыг хүсэж байна.' },
      ],
    },
    {
      label: 'Үгүйсгэх',
      structure: 'that + subject + not + V1 (do / does / did хэрэглэхгүй)',
      examples: [
        { en: '[The doctor](s) [insisted](v) [that he not drive for a week](o).', mn: 'Эмч түүнийг долоо хоног машин барихгүй байхыг шаардсан.' },
        { en: '[It](s) [is](v) [essential](o) [that the public not be misled](o).', mn: 'Олон нийтийг төөрөгдүүлэхгүй байх нь зайлшгүй чухал.' },
        { en: '[I](s) [suggest](v) [that we not discuss this today](o).', mn: 'Үүнийг өнөөдөр хэлэлцэхгүй байхыг би санал болгож байна.' },
      ],
    },
    {
      label: 'should-тай (British)',
      structure: 'that + subject + should (not) + V1',
      examples: [
        { en: '[The teacher](s) [suggested](v) [that Bat should repeat the course](o).', mn: 'Багш Батыг курсээ давтахыг санал болгосон.' },
        { en: '[It](s) [is](v) [important](o) [that nobody should feel excluded](o).', mn: 'Хэн ч өөрийгөө гадуурхагдсан гэж мэдрэхгүй байх нь чухал.' },
        { en: '[They](s) [demanded](v) [that the manager should resign](o).', mn: 'Тэд менежерийг огцрохыг шаардсан.' },
      ],
    },
  ],
  signalWords: ['suggest that', 'recommend that', 'insist that', 'demand that', 'propose that', 'request that', 'it is essential that', 'it is vital that', 'it is important that', 'it is imperative that', 'be that as it may', 'so be it', 'far be it from me'],
  notes: [
    'Subjunctive-д үйл үг бүх биед, бүх цагт V1: үндсэн үйл үг өнгөрсөн цагт байсан ч ухрахгүй. She demanded that he leave (left биш); It was vital that she be there (was биш).',
    'Үгүйсгэхдээ not + V1 — do / does / did хэрэглэхгүй: that he not go (зөв) / that he doesn\'t go, that he don\'t go (subjunctive-д буруу).',
    'suggest, recommend, propose, insist, demand-ийн ард «хүн + to V1» орохгүй: I suggest him to go (буруу). Харин advise, ask, urge, order нь ордог: I advised him to go. suggest / recommend + -ing бас болно: I suggest waiting.',
    'insist, suggest хоёр утгатай. Шаардлага, санал бол subjunctive: She insisted that he be released. Баримт нотлох, сануулах бол ердийн цаг: She insisted that he was innocent (гэм буруугүй гэж зүтгэсэн).',
    'Америк англи хэлэнд subjunctive, Британи англи хэлэнд should + V1 давамгай; Британи ярианд ердийн цаг ч гардаг (I suggest that he goes). Албан бичиг, шалгалтад subjunctive эсвэл should-ыг сонго.',
    'that-ийг албан бус хэлэнд хасаж болно: I suggest he go. Тогтсон хэллэгүүдийг (so be it, come what may, Long live the King) өөрчлөлгүй цээжлээрэй — эдгээрт be, come, live нь subjunctive хэлбэр.',
  ],
  commonMistakes: [
    {
      wrong: 'I suggest him to apply for the job.',
      correct: 'I suggest that he apply for the job.',
      explanation: 'suggest-ийн ард «хүн + to V1» орохгүй. that + эзэн (he — him биш) + V1. Монголоор «түүнийг … -хыг санал болгох» гэдгийг үгчлэн буулгаснаас гардаг алдаа.',
    },
    {
      wrong: 'The manager demanded that she doesn\'t leave early.',
      correct: 'The manager demanded that she not leave early.',
      explanation: 'Subjunctive-ийн үгүйсгэл нь not + V1. does / did туслах үйл үг хэрэглэхгүй.',
    },
    {
      wrong: 'It is essential that he to be present.',
      correct: 'It is essential that he be present.',
      explanation: 'that-clause-д to байхгүй, үйл үгийн үндсэн хэлбэр шууд орно: he be. to-тэй хэлэх бол бүтэц өөр: It is essential for him to be present.',
    },
    {
      wrong: 'She recommended that I should to see a doctor.',
      correct: 'She recommended that I should see a doctor. / She recommended that I see a doctor.',
      explanation: 'should бол modal тул ард нь to-гүй V1. Британи хувилбар (should see) ба subjunctive (see) хоёулаа зөв.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монгол үйл үг биеэр хувирдаггүй («би явна, тэр явна») тул subjunctive үнэндээ монгол сэтгэлгээнд ойр: бүх биед нэг л хэлбэр. Хэцүү нь A1-ээс хойш цээжилсэн «he / she / it + -s» зуршлыг энд зориуд орхих явдал.',
      'Монголоор «түүнийг явахыг шаардсан», «түүнд амрахыг зөвлөсөн» гэж хүнийг тийн ялгалаар тэмдэглээд үйлт нэр залгадаг. Үүнийг дагаад insist him to go гэж алддаг. Англиар that + бүтэн өгүүлбэр хэрэгтэй бөгөөд хүн нь эзний хэлбэрээр байна: insisted that he go.',
      'Монголоор үгүйсгэлийг «-хгүй байхыг» гэж хэлдэг (явахгүй байхыг шаардсан). Англиар үүнийг ганц not-оор, үйл үгийн өмнө тавьж илэрхийлнэ: insisted that he not go.',
      'Монгол хэлний «-тугай / -түгэй» (мандтугай, болтугай) гэсэн хүсэх, ерөөх хэлбэр subjunctive-ийн тогтсон хэллэгтэй хамгийн ойр: Long live the King! = «Хаан мандтугай!», So be it = «тэгээд л болог», Be that as it may = «тэр нь тийм байлаа ч».',
    ],
  },
  dialogue: [
    {
      en: 'Temuulen, [what](o) [does](v) [the safety report](s) [say](v)?',
      mn: 'Тэмүүлэн, аюулгүй байдлын тайланд юу гэж байна?',
      speaker: 'Nomin',
    },
    {
      en: '[It](s) [recommends](v) [that the old lift be replaced](o) [immediately](m).',
      mn: 'Хуучин цахилгаан шатыг нэн даруй солихыг зөвлөсөн байна.',
      speaker: 'Temuulen',
    },
    {
      en: '[Is](v) [it](s) [really](m) [that urgent](o)?',
      mn: 'Үнэхээр тийм яаралтай юу?',
      speaker: 'Nomin',
    },
    {
      en: 'Yes. [The inspector](s) [insisted](v) [that nobody use it](o) [until then](m).',
      mn: 'Тийм. Байцаагч тэр болтол хэн ч үүнийг ашиглахгүй байхыг шаардсан.',
      speaker: 'Temuulen',
    },
    {
      en: 'I see. [I](s) [propose](v) [that we not wait for the next budget](o).',
      mn: 'Ойлголоо. Бид дараагийн төсвийг хүлээхгүй байхыг би санал болгож байна.',
      speaker: 'Nomin',
    },
    {
      en: 'I agree. [It](s) [is](v) [essential](o) [that the work begin this month](o).',
      mn: 'Санал нэг байна. Ажил энэ сардаа эхлэх нь зайлшгүй чухал.',
      speaker: 'Temuulen',
    },
  ],
  quiz: [
    {
      id: 'c1-04-1',
      ruleId: 4,
      kind: 'fill',
      question: 'The committee recommended that the proposal ___ rejected.',
      options: ['be', 'being', 'to be', 'been'],
      answer: 'be',
      explanation: 'recommend + that + эзэн + V1. be үйл үгийн subjunctive хэлбэр нь be: that the proposal be rejected. that-clause-д to, -ing, V3 дангаараа орохгүй.',
      hint: 'be үйл үгийн үндсэн хэлбэр.',
    },
    {
      id: 'c1-04-2',
      ruleId: 4,
      kind: 'fill',
      question: 'The lawyer insisted that his client ___ any questions.',
      options: ['not answer', 'not to answer', 'not answering', 'answer not'],
      answer: 'not answer',
      explanation: 'Subjunctive-ийн үгүйсгэл: not + V1 — that his client not answer. to, -ing орохгүй; not үйл үгийн өмнө байна.',
      hint: 'not хаана байрлах вэ?',
    },
    {
      id: 'c1-04-3',
      ruleId: 4,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'I suggest him to see a specialist.',
        'The manager demanded that the report be finished by Friday.',
        'It is essential that he to sign the contract.',
        'She insisted that he not to be told.',
      ],
      answer: 'The manager demanded that the report be finished by Friday.',
      explanation: 'demand + that + эзэн + be + V3 — зөв. suggest-ийн ард «хүн + to V1» орохгүй (that he see); that-clause-д to байхгүй (that he sign; that he not be told).',
      hint: 'that-ийн ард to байхгүй.',
    },
    {
      id: 'c1-04-4',
      ruleId: 4,
      kind: 'translate',
      question: 'Тэр намайг хуралд оролцохыг шаардсан.',
      options: [
        'She insisted that I attend the meeting.',
        'She insisted me to attend the meeting.',
        'She insisted that I attending the meeting.',
        'She insisted for me attend the meeting.',
      ],
      answer: 'She insisted that I attend the meeting.',
      explanation: '«-хыг шаардсан» = insist + that + эзэн + V1. insist-ийн ард «хүн + to V1» орохгүй; that-clause-д -ing хэлбэр дангаараа үйл үг болохгүй.',
      hint: 'insist + that + эзэн + V1.',
    },
  ],
};
