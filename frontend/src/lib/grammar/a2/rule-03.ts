// frontend/src/lib/grammar/a2/rule-03.ts
// A2 дүрэм 3: Present Perfect
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule03: GrammarRule = {
  id: 3,
  title: 'Present Perfect',
  titleMn: 'Одоо төгссөн цаг — өнгөрсөн нь одоотой холбоотой',
  hook: 'Чи хэзээ нэгэн цагт далай харсан удаатай юу? Хэзээ гэдэг нь чухал биш — харсан эсэх нь л чухал.',
  summary: 'Present Perfect (одоо төгссөн цаг) нь хэзээ болсныг заагаагүй, харин одоогийн байдалтай холбоотой өнгөрсөн үйлдлийг хэлнэ: амьдралын туршлага, одоо мэдрэгдэж буй үр дүн, дуусаагүй хугацаа. Томьёо: have / has + үйл үгийн III хэлбэр (past participle).',
  description: 'Present Perfect буюу одоо төгссөн цаг нь өнгөрсөн ба одоог холбосон гүүр юм. Үйлдэл өнгөрсөнд болсон ч бид түүнийг одоогийн өнцгөөс хардаг: «I have seen that movie» гэвэл хэзээ үзсэн нь хамаагүй, одоо би тэр киног мэднэ гэсэн үг. Гурван гол хэрэглээ бий: амьдралын туршлага (ever / never — «…-сан удаатай»), одоо мэдрэгдэж буй үр дүн (just / already / yet — «аль хэдийн», «хараахан …-аагүй»), одоо хүртэл үргэлжилж буй байдал (for / since — «…-аас хойш»). Монгол хэлэнд ийм тусдаа цаг байхгүй тул «-сан» гэж орчуулагддаг ч утгын ялгаа нь «одоотой холбоотой» гэдэгт оршино. Хэлбэр нь have / has + үйл үгийн гуравдугаар хэлбэр; дүрэмт үйл үгийн III хэлбэр -ed (Past Simple-тэй адил), дүрэмт бус үйл үг өөрийн хэлбэртэй (go → gone, see → seen). Тодорхой өнгөрсөн цаг (yesterday, last year) энэ цагтай хамт хэрэглэгдэхгүй гэдгийг эхнээсээ санаарай.',
  structure: 'Subject + have / has + past participle (V3)',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'have / has', part: 'verb' },
    { text: 'past participle (V3)', part: 'verb' },
  ],
  tip: 'I / you / we / they → have, he / she / it → has. Үйл үгийн III хэлбэрийг гурвалж цээжил: go – went – gone, see – saw – seen. Хэзээ гэж асуумааргүй байвал Present Perfect.',
  examples: [
    { en: '[I](s) [have seen](v) [that movie](o).', mn: 'Би тэр киног үзсэн (үзсэн удаатай).' },
    { en: '[She](s) [has lost](v) [her keys](o).', mn: 'Тэр түлхүүрээ гээчихсэн байна.' },
    { en: '[We](s) [have lived](v) [here](m) [for ten years](m).', mn: 'Бид энд арван жил амьдарч байна.' },
    { en: '[They](s) [haven\'t finished](v) [their homework](o) [yet](m).', mn: 'Тэд гэрийн даалгавраа хараахан дуусгаагүй байна.' },
  ],
  useCases: [
    {
      title: 'Амьдралын туршлага (ever / never)',
      description: 'Амьдралдаа хэзээ нэгэн цагт хийсэн эсэхийг хэлнэ; хэзээ хийсэн нь чухал биш. Асуултад ever, үгүйсгэлд never орно. Монголоор «…-сан удаатай», «хэзээ ч …-аагүй».',
      examples: [
        { en: '[Have](v) [you](s) [ever been](v) [to Japan](m)?', mn: 'Чи Япон явж үзсэн удаатай юу?' },
        { en: '[I](s) [have never eaten](v) [sushi](o).', mn: 'Би хэзээ ч суши идэж үзээгүй.' },
        { en: '[He](s) [has met](v) [a famous singer](o).', mn: 'Тэр алдартай дуучинтай уулзаж байсан удаатай.' },
      ],
    },
    {
      title: 'Одоо мэдрэгдэж буй үр дүн',
      description: 'Өнгөрсөнд болсон үйлдлийн үр дүн одоо чухал байна. «I have lost my phone» гэвэл одоо утасгүй байна гэсэн үг. just — «дөнгөж сая», already — «аль хэдийн».',
      examples: [
        { en: '[I](s) [have lost](v) [my phone](o).', mn: 'Би утсаа гээчихсэн байна (одоо утасгүй).' },
        { en: '[She](s) [has just arrived](v) [at the airport](m).', mn: 'Тэр дөнгөж сая нисэх буудалд ирлээ.' },
        { en: '[We](s) [have already had](v) [lunch](o).', mn: 'Бид аль хэдийн өдрийн хоолоо идчихсэн.' },
      ],
    },
    {
      title: 'Дуусаагүй хугацаа (for / since)',
      description: 'Өнгөрсөнд эхлээд одоо хүртэл үргэлжилж байгаа байдлыг хэлнэ. for — хэр удаан (for two years), since — хэзээнээс (since 2020). Монголоор ихэвчлэн «…-аас хойш … байна» гэж орчуулна.',
      examples: [
        { en: '[I](s) [have known](v) [her](o) [since 2020](m).', mn: 'Би түүнийг 2020 оноос хойш мэднэ.' },
        { en: '[He](s) [has worked](v) [at this bank](m) [for five years](m).', mn: 'Тэр энэ банкинд таван жил ажиллаж байна.' },
        { en: '[They](s) [have been](v) [married](o) [since May](m).', mn: 'Тэд тавдугаар сараас хойш гэрлэсэн байгаа.' },
      ],
    },
    {
      title: 'Дуусаагүй цаг хугацааны хүрээнд (today, this week)',
      description: 'today, this week, this month, this year гэсэн хугацаа хараахан дуусаагүй тул түүний дотор болсон зүйлийг Present Perfect-ээр хэлнэ. Хугацаа үргэлжилж байгаа болохоор дахин болох боломж бий.',
      examples: [
        { en: '[I](s) [have drunk](v) [three coffees](o) [today](m).', mn: 'Би өнөөдөр гурван кофе уучихсан байна.' },
        { en: '[She](s) [has called](v) [me](o) [twice](m) [this week](m).', mn: 'Тэр энэ долоо хоногт над руу хоёр удаа залгасан.' },
        { en: '[We](s) [haven\'t seen](v) [Bat](o) [this month](m).', mn: 'Бид энэ сард Батыг хараагүй.' },
      ],
    },
    {
      title: 'have been to — очиж үзсэн',
      description: 'Хаа нэгтээ очоод буцаж ирсэн туршлагыг have been to гэж хэлнэ. go-ийн III хэлбэр gone-ыг энд хэрэглэдэггүй — has gone to гэвэл «яваад одоо тэнд байгаа» гэсэн өөр утгатай.',
      examples: [
        { en: '[I](s) [have been](v) [to London](m) [twice](m).', mn: 'Би Лондонд хоёр удаа очиж үзсэн.' },
        { en: '[Has](v) [she](s) [ever been](v) [to the Gobi](m)?', mn: 'Тэр Говьд очиж үзсэн удаатай юу?' },
        { en: '[We](s) [have never been](v) [abroad](m).', mn: 'Бид хэзээ ч гадаад явж үзээгүй.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Батлах',
      structure: 'I / You / We / They + have + V3 · He / She / It + has + V3',
      examples: [
        { en: '[I](s) [have finished](v) [my work](o).', mn: 'Би ажлаа дуусгачихсан.' },
        { en: '[She](s) [has bought](v) [a new bike](o).', mn: 'Тэр шинэ дугуй авчихсан.' },
        { en: '[They](s) [have moved](v) [to a new flat](m).', mn: 'Тэд шинэ байранд нүүчихсэн.' },
      ],
    },
    {
      label: 'Үгүйсгэх',
      structure: 'Subject + haven\'t / hasn\'t + V3',
      examples: [
        { en: '[I](s) [haven\'t read](v) [that book](o).', mn: 'Би тэр номыг уншаагүй.' },
        { en: '[He](s) [hasn\'t called](v) [me](o) [yet](m).', mn: 'Тэр над руу хараахан залгаагүй байна.' },
        { en: '[We](s) [haven\'t met](v) [her husband](o).', mn: 'Бид түүний нөхөртэй уулзаагүй.' },
      ],
    },
    {
      label: 'Асуух',
      structure: 'Have / Has + subject + V3 …?',
      examples: [
        { en: '[Have](v) [you](s) [eaten](v) [breakfast](o)?', mn: 'Чи өглөөний цайгаа уусан уу?' },
        { en: '[Has](v) [she](s) [ever tried](v) [Korean food](o)?', mn: 'Тэр солонгос хоол идэж үзсэн удаатай юу?' },
        { en: '[How long](m) [have](v) [they](s) [lived](v) [here](m)?', mn: 'Тэд энд хэр удаан амьдарч байгаа вэ?' },
      ],
    },
    {
      label: 'Богино хариулт',
      structure: 'Yes, subject + have / has. · No, subject + haven\'t / hasn\'t.',
      examples: [
        { en: '[Yes](o), [I](s) [have](v).', mn: 'Тийм ээ.' },
        { en: '[No](o), [she](s) [hasn\'t](v).', mn: 'Үгүй.' },
        { en: '[Yes](o), [they](s) [have](v).', mn: 'Тийм ээ.' },
      ],
    },
  ],
  signalWords: ['ever', 'never', 'just', 'already', 'yet', 'for', 'since', 'today', 'this week', 'recently', 'so far', 'how long'],
  notes: [
    'have нь I, you, we, they болон олон тооны нэр үгтэй; has нь he, she, it болон ганц тооны нэр үгтэй: my sister has, the children have.',
    'Дүрэмт үйл үгийн III хэлбэр (past participle) Past Simple-тэй адил -ed: work – worked – worked. Дүрэмт бус үйл үгсийг гурвалжаар цээжил: go – went – gone, see – saw – seen, eat – ate – eaten, take – took – taken, write – wrote – written, do – did – done, be – was/were – been, have – had – had, buy – bought – bought, make – made – made, give – gave – given, come – came – come.',
    'Товчилсон хэлбэр: I\'ve, you\'ve, we\'ve, they\'ve; he\'s, she\'s, it\'s (энд \'s = has, is биш!); haven\'t, hasn\'t. Ярианд товчилсон хэлбэр илүү түгээмэл.',
    'just, already, never, ever нь have / has ба V3-ийн хооронд орно: I have just eaten, She has already left. Харин yet өгүүлбэрийн төгсгөлд, зөвхөн үгүйсгэл ба асуултад орно: I haven\'t finished yet. Have you finished yet?',
    'for-ын ард хугацааны урт (for two hours, for a week, for ages), since-ийн ард эхлэх цэг (since Monday, since 2019, since I was a child) орно.',
    'have been to (очиж үзсэн, буцаж ирсэн) ба have gone to (яваад одоо тэнд байгаа) хоёрыг ялга: She has been to Paris. — Парист очиж үзсэн. She has gone to Paris. — Парис руу явчихсан, одоо энд байхгүй.',
  ],
  commonMistakes: [
    {
      wrong: 'I have saw that movie.',
      correct: 'I have seen that movie.',
      explanation: 'have-ийн дараа II хэлбэр (saw) биш, III хэлбэр (seen) орно. Дүрэмт бус үйл үгийн гурвалжийг бүтнээр нь цээжлэх хэрэгтэй: see – saw – seen.',
    },
    {
      wrong: 'She have finished her homework.',
      correct: 'She has finished her homework.',
      explanation: 'She гуравдугаар биеийн ганц тоо тул has. have зөвхөн I, you, we, they болон олон тоотой.',
    },
    {
      wrong: 'I have seen him yesterday.',
      correct: 'I saw him yesterday.',
      explanation: 'yesterday гэсэн тодорхой өнгөрсөн цаг Present Perfect-тэй хамт хэрэглэгдэхгүй. Хэзээ болсныг хэлсэн бол Past Simple. Present Perfect хэзээ гэдгийг хэлдэггүй.',
    },
    {
      wrong: 'I haven\'t yet finished.',
      correct: 'I haven\'t finished yet.',
      explanation: 'yet өгүүлбэрийн төгсгөлд орно. «Хараахан …-аагүй» гэдэг утгыг yet өгч байгаа ч байрлал нь хамгийн сүүлд.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монгол хэлэнд Present Perfect гэсэн тусдаа цаг байхгүй. «Би тэр киног үзсэн» гэхэд Past Simple ч, Present Perfect ч байж болно. Англиар харин «хэзээ» гэдгийг хэлж байгаа юу, «одоотой холбоотой» гэдгийг хэлж байгаа юу гэдгээрээ хоёр цаг ялгагдана.',
      'Туршлагыг монголоор «…-сан удаатай», «…-ж үзсэн» гэж хэлдэг. Энэ хэлбэр ever / never-тэй Present Perfect-эд яг таарна: Have you ever been to Japan? — Чи Япон явж үзсэн удаатай юу?',
      'Монголоор «гээчихсэн», «дуусгачихсан» гэсэн «-чихсан» хэлбэр үр дүн одоо хэвээр байгааг заадаг. Энэ бол Present Perfect-ийн «одоо мэдрэгдэж буй үр дүн» утгатай хамгийн ойрхон монгол хэлбэр.',
      'Монголоор «Би энд арван жил амьдарч байна» гэж одоо цагаар хэлдэг зүйлийг англиар Present Perfect-ээр хэлнэ: I have lived here for ten years. «I live here for ten years» гэвэл буруу — үргэлжилсэн хугацаа орвол have / has хэрэгтэй.',
    ],
  },
  dialogue: [
    {
      en: '[Have](v) [you](s) [ever been](v) [to the countryside](m) [in winter](m)?',
      mn: 'Чи өвөл хөдөө явж үзсэн удаатай юу?',
      speaker: 'Bat',
    },
    {
      en: '[No](o), [I](s) [haven\'t](v). [I](s)[\'ve](v) [only been](v) [there](m) [in summer](m). [Why](m)?',
      mn: 'Үгүй. Би зөвхөн зун тэнд очиж үзсэн. Яагаад?',
      speaker: 'Saraa',
    },
    {
      en: '[My uncle](s) [has invited](v) [us](o) [to his ger](m). [I](s)[\'ve](v) [already packed](v) [my bag](o)!',
      mn: 'Ах маань биднийг гэртээ урьсан. Би аль хэдийн цүнхээ бэлдчихсэн!',
      speaker: 'Bat',
    },
    {
      en: '[Sounds](v) [great](o)! [Has](v) [he](s) [got](v) [horses](o)?',
      mn: 'Гоё юм! Тэр морьтой юу?',
      speaker: 'Saraa',
    },
    {
      en: '[Yes](o), [he](s) [has](v). [He](s) [has had](v) [horses](o) [since he was young](m).',
      mn: 'Тийм ээ. Тэр залуугаасаа хойш морьтой.',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [have never ridden](v) [a horse](o). [I](s) [haven\'t decided](v) [yet](m), [but](m) [I](s) [want](v) [to try](o)!',
      mn: 'Би хэзээ ч морь унаж үзээгүй. Хараахан шийдээгүй байна, гэхдээ турших хүсэлтэй!',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-3-1',
      ruleId: 3,
      kind: 'fill',
      question: 'I ___ that movie three times.',
      options: ['have saw', 'have seen', 'has seen', 'seen'],
      answer: 'have seen',
      explanation: 'I-тэй have, дараа нь III хэлбэр seen. have saw-д II хэлбэр буруу орсон, has I-тэй болохгүй, зөвхөн seen гэвэл туслах үйл үг дутуу.',
      hint: 'see – saw – seen: гурав дахь хэлбэр хэрэгтэй.',
    },
    {
      id: 'a2-3-2',
      ruleId: 3,
      kind: 'fill',
      question: 'She ___ in this city since 2019.',
      options: ['has lived', 'have lived', 'lives', 'lived'],
      answer: 'has lived',
      explanation: 'since 2019 — өнгөрсөнд эхлээд одоо хүртэл үргэлжилж байгаа → Present Perfect. She-тэй has. lives одоо цаг since-тэй болохгүй, lived дууссан баримт болгоно.',
      hint: 'since харагдвал have / has + V3.',
    },
    {
      id: 'a2-3-3',
      ruleId: 3,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['Have you ever eat sushi?', 'Did you ever eaten sushi?', 'Have you ever eaten sushi?', 'Has you ever eaten sushi?'],
      answer: 'Have you ever eaten sushi?',
      explanation: 'Туршлагын асуулт: Have + you + ever + V3 (eaten). eat үндсэн хэлбэр буруу, did-тэй V3 хэрэглэхгүй, you-тэй has болохгүй.',
      hint: 'ever-тэй асуултад have / has + V3.',
    },
    {
      id: 'a2-3-4',
      ruleId: 3,
      kind: 'translate',
      question: 'Тэд гэрийн даалгавраа хараахан дуусгаагүй байна.',
      options: ['They didn\'t finish their homework yet.', 'They haven\'t finished their homework yet.', 'They haven\'t yet finish their homework.', 'They hasn\'t finished their homework yet.'],
      answer: 'They haven\'t finished their homework yet.',
      explanation: '«хараахан …-аагүй» = haven\'t + V3 + yet. yet-тэй Past Simple (didn\'t) хэрэглэхгүй; yet өгүүлбэрийн төгсгөлд орно; they-тэй hasn\'t болохгүй.',
      hint: '«хараахан» → yet, төгсгөлд.',
    },
  ],
};
