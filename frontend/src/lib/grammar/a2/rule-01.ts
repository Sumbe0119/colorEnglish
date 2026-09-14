// frontend/src/lib/grammar/a2/rule-01.ts
// A2 дүрэм 1: Past Continuous
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule01: GrammarRule = {
  id: 1,
  title: 'Past Continuous',
  titleMn: 'Өнгөрсөн үргэлжлэх цаг — тэр мөчид болж байсан үйлдэл',
  hook: 'Өчигдөр орой 8 цагт чи юу хийж байсан бэ? Дууссан эсэх нь биш, яг тэр мөчид болж байсан нь чухал.',
  summary: 'Past Continuous (өнгөрсөн үргэлжлэх цаг) нь өнгөрсөн тодорхой нэг мөчид болж байсан, үргэлжилж байсан үйлдлийг хэлнэ. Томьёо: was / were + үйл үг-ing; монголоор «…ж / …ч байсан» гэж орчуулна.',
  description: 'Past Continuous буюу өнгөрсөн үргэлжлэх цаг нь өнгөрсөн цагийн тодорхой нэг мөчид эхэлчихсэн, гэхдээ хараахан дуусаагүй байсан үйлдлийг зурж үзүүлнэ. «At 8 o\'clock I was having dinner» гэвэл 8 цагт хоол идэж эхэлсэн гэсэн үг биш — 8 цагт хоол идэх явц дундаа байсан гэсэн үг. Past Simple дууссан баримтыг «хэлдэг» бол Past Continuous тухайн мөчийн зургийг «харуулдаг». Тиймээс түүх ярихдаа орчин, цаг агаар, хүмүүс юу хийж байсныг энэ цагаар дүрсэлж, дараа нь гол үйл явдлаа Past Simple-ээр хэлдэг. Мөн «all day», «all evening» гэх мэт удаан үргэлжилсэн үйлдлийг онцлоход хэрэглэнэ. Монголоор «уншиж байсан», «хүлээж байсан» гэсэн «-ж байсан» хэлбэр яг энэ цагтай таардаг. Хэлбэр нь энгийн: эзэн + was / were + үйл үг-ing; be-ийн өнгөрсөн цаг эзнээсээ хамаарч was эсвэл were болно.',
  structure: 'Subject + was / were + verb-ing',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'was / were', part: 'verb' },
    { text: 'verb-ing', part: 'verb' },
  ],
  tip: 'Present Continuous-ийн am / is / are-ыг was / were болгоход л Past Continuous болно: I am reading → I was reading. Санах арга: «-ж байна» → «-ж байсан».',
  examples: [
    { en: '[I](s) [was reading](v) [a book](o) [at 8 o\'clock yesterday](m).', mn: 'Би өчигдөр 8 цагт ном уншиж байсан.' },
    { en: '[They](s) [were playing](v) [football](o) [in the park](m).', mn: 'Тэд цэцэрлэгт хүрээлэнд хөлбөмбөг тоглож байсан.' },
    { en: '[It](s) [was raining](v) [all day](m).', mn: 'Өдөржин бороо орж байсан.' },
    { en: '[She](s) [wasn\'t sleeping](v) [at midnight](m).', mn: 'Тэр шөнө дунд унтаагүй байсан.' },
  ],
  useCases: [
    {
      title: 'Өнгөрсөн тодорхой мөчид болж байсан үйлдэл',
      description: 'Өнгөрсөн цагийн яг нэг мөчийг (at 7 o\'clock, at that time, then) зааж, тэр үед ямар үйлдэл явагдаж байсныг хэлнэ. Үйлдэл тэр мөчөөс өмнө эхэлж, дараа нь ч үргэлжилсэн байдаг.',
      examples: [
        { en: '[At 7 o\'clock](m) [I](s) [was having](v) [breakfast](o).', mn: '7 цагт би өглөөний цайгаа ууж байсан.' },
        { en: '[She](s) [was driving](v) [to work](m) [at that time](m).', mn: 'Тэр үед тэр ажил руугаа машинаар явж байсан.' },
        { en: '[We](s) [were waiting](v) [for the bus](o) [at noon](m).', mn: 'Үд дунд бид автобус хүлээж байсан.' },
      ],
    },
    {
      title: 'Түүхийн орчин, дэвсгэр дүрслэх',
      description: 'Түүх ярихдаа эхлээд орчноо зурна: цаг агаар ямар байсан, хүмүүс юу хийж байсан. Энэ «дэвсгэр» хэсгийг Past Continuous-ээр хэлнэ. Уншигч тэр газар байгаа мэт мэдрэмж төрүүлнэ.',
      examples: [
        { en: '[The sun](s) [was shining](v) [and](m) [the birds](s) [were singing](v).', mn: 'Нар гийж, шувууд жиргэж байсан.' },
        { en: '[People](s) [were walking](v) [along the street](m).', mn: 'Хүмүүс гудамжаар алхаж байсан.' },
        { en: '[My mother](s) [was cooking](v) [in the kitchen](m).', mn: 'Ээж маань гал тогооны өрөөнд хоол хийж байсан.' },
      ],
    },
    {
      title: 'Удаан үргэлжилсэн үйлдлийг онцлох',
      description: 'all day, all night, the whole morning гэх мэт үгтэй хамт үйлдэл маш удаан үргэлжилсэн гэдгийг онцолно. Заримдаа «хэтэрхий удаан» гэсэн өнгө аястай байдаг.',
      examples: [
        { en: '[He](s) [was studying](v) [all night](m).', mn: 'Тэр шөнөжин хичээлээ хийж байсан.' },
        { en: '[It](s) [was snowing](v) [the whole morning](m).', mn: 'Өглөөжин цас орж байсан.' },
        { en: '[The children](s) [were watching](v) [TV](o) [all afternoon](m).', mn: 'Хүүхдүүд үдээс хойш бүхэлдээ зурагт үзэж байсан.' },
      ],
    },
    {
      title: 'Эелдэг асуулт, тайлбар',
      description: 'Хэн нэгэн юу хийж байсныг эелдгээр лавлах, эсвэл яагаад тэнд байгаагүйгээ тайлбарлахад тохиромжтой. «I was wondering…» гэдэг хүсэлтийг ч зөөллөж хэлдэг.',
      examples: [
        { en: '[What](o) [were](v) [you](s) [doing](v) [yesterday evening](m)?', mn: 'Чи өчигдөр орой юу хийж байсан бэ?' },
        { en: '[Sorry](m), [I](s) [was talking](v) [on the phone](m).', mn: 'Уучлаарай, би утсаар ярьж байсан.' },
        { en: '[I](s) [was wondering](v) [if you could help me](o).', mn: 'Та надад тусалж чадах болов уу гэж бодож байсан юм.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Батлах',
      structure: 'I / He / She / It + was + verb-ing · You / We / They + were + verb-ing',
      examples: [
        { en: '[I](s) [was listening](v) [to music](o).', mn: 'Би хөгжим сонсож байсан.' },
        { en: '[She](s) [was writing](v) [an email](o).', mn: 'Тэр имэйл бичиж байсан.' },
        { en: '[They](s) [were swimming](v) [in the lake](m).', mn: 'Тэд нууранд сэлж байсан.' },
      ],
    },
    {
      label: 'Үгүйсгэх',
      structure: 'Subject + wasn\'t / weren\'t + verb-ing',
      examples: [
        { en: '[He](s) [wasn\'t working](v) [at 6 o\'clock](m).', mn: 'Тэр 6 цагт ажиллаагүй байсан.' },
        { en: '[We](s) [weren\'t watching](v) [the film](o).', mn: 'Бид тэр киног үзээгүй байсан.' },
        { en: '[I](s) [wasn\'t sleeping](v), [I](s) [was thinking](v).', mn: 'Би унтаагүй, бодож байсан.' },
      ],
    },
    {
      label: 'Асуух',
      structure: 'Was / Were + subject + verb-ing …?',
      examples: [
        { en: '[Were](v) [you](s) [studying](v) [last night](m)?', mn: 'Чи өчигдөр шөнө хичээлээ хийж байсан уу?' },
        { en: '[Was](v) [it](s) [raining](v) [in the morning](m)?', mn: 'Өглөө бороо орж байсан уу?' },
        { en: '[Where](m) [were](v) [they](s) [going](v)?', mn: 'Тэд хаашаа явж байсан бэ?' },
      ],
    },
    {
      label: 'Богино хариулт',
      structure: 'Yes, subject + was / were. · No, subject + wasn\'t / weren\'t.',
      examples: [
        { en: '[Yes](o), [I](s) [was](v).', mn: 'Тийм ээ, байсан.' },
        { en: '[No](o), [she](s) [wasn\'t](v).', mn: 'Үгүй, байгаагүй.' },
        { en: '[Yes](o), [they](s) [were](v).', mn: 'Тийм ээ, байсан.' },
      ],
    },
  ],
  signalWords: ['at 8 o\'clock yesterday', 'at that time', 'at that moment', 'all day', 'all night', 'the whole morning', 'yesterday evening', 'then'],
  notes: [
    'was нь I, he, she, it болон ганц тооны нэр үгтэй; were нь you, we, they болон олон тооны нэр үгтэй. you ганц хүнийг заасан ч were авна: Were you sleeping?',
    '-ing залгах дүрэм: дуугүй -e унана (write → writing, drive → driving); богино эгшиг + гийгүүлэгчээр төгссөн бол гийгүүлэгч давхардана (sit → sitting, run → running, swim → swimming); -ie → -ying (lie → lying).',
    'Мэдрэмж, бодол, эзэмшил заасан stative үйл үгсийг Past Continuous-д хэрэглэдэггүй: know, like, love, want, need, believe, have (эзэмших), belong. «I was knowing» гэхгүй, «I knew» гэнэ.',
    'Товчилсон хэлбэр: wasn\'t = was not, weren\'t = were not. Батлах хэлбэрийг товчилдоггүй: «I was» хэвээрээ. Богино хариултад -ing үгийг давтахгүй: «Yes, I was.»',
    'Асуулт үүсгэхэд did хэрэггүй — was / were өөрөө эзний урд гарна: Was she reading? Асуух үг (what, where, why) хамгийн эхэнд орно: What were you doing?',
    'Past Continuous нь ямар нэг үйлдэл дууссан эсэхийг хэлдэггүй. «I was reading the book» гэвэл номоо дуустал уншсан ч байж болно, уншаагүй ч байж болно — зөвхөн тэр мөчид уншиж байсан гэдгийг л хэлнэ.',
  ],
  commonMistakes: [
    {
      wrong: 'I was read a book at 8 o\'clock.',
      correct: 'I was reading a book at 8 o\'clock.',
      explanation: 'was / were-ийн дараа үйл үг заавал -ing авна. was + үндсэн хэлбэр гэсэн хослол байхгүй. «-ж байсан» гэсэн утга -ing-ээс ирдэг.',
    },
    {
      wrong: 'They was playing football.',
      correct: 'They were playing football.',
      explanation: 'They олон тоо тул were. was зөвхөн I, he, she, it болон ганц тооны нэр үгтэй хэрэглэнэ.',
    },
    {
      wrong: 'Did you sleeping at midnight?',
      correct: 'Were you sleeping at midnight?',
      explanation: 'Past Continuous-ийн асуултад did хэрэггүй. was / were өөрөө эзний урд гарч асуулт үүсгэнэ. did зөвхөн Past Simple-д орно.',
    },
    {
      wrong: 'She was knowing the answer.',
      correct: 'She knew the answer.',
      explanation: 'know бол stative үйл үг — үргэлжлэх цагт хэрэглэдэггүй. Мэдэх, хайрлах, хүсэх, хэрэгтэй байх гэсэн үгс Past Simple-ээр хэлнэ.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «уншиж байсан» гэхэд «-ж» нөхцөл үргэлжлэлийг, «байсан» өнгөрсөн цагийг заадаг. Англиар яг үүнтэй адил хоёр хэсэг бий: -ing үргэлжлэлийг, was / were өнгөрснийг заана. Дараалал нь эсрэгээ: was reading — өнгөрсөн нь эхэлж, үргэлжлэл нь ард нь орно.',
      'Монголоор «байсан» бүх эзэнд адилхан: би байсан, тэд байсан. Англиар харин was / were эзнээсээ хамаарч солигддог. Эхлээд эзнээ хараад was уу, were үү гэдгээ шийдээрэй.',
      'Монголоор «Би өчигдөр ном уншсан» болон «Би өчигдөр ном уншиж байсан» хоёр өөр утгатай. Эхнийх нь дууссан баримт (Past Simple), хоёр дахь нь тэр үеийн зураг (Past Continuous). Англи хэлэнд энэ ялгаа яг адилхан чухал.',
      'Монголоор «мэдэж байсан», «хайрлаж байсан» гэж хэлж болдог тул олон хүн «was knowing», «was loving» гэж алддаг. Англиар мэдрэмж, бодол заасан үгс үргэлжлэх цаг авдаггүй: knew, loved гэж энгийн өнгөрсөн цагаар хэлнэ.',
    ],
  },
  dialogue: [
    {
      en: '[I](s) [called](v) [you](o) [at 9 last night](m). [What](o) [were](v) [you](s) [doing](v)?',
      mn: 'Би өчигдөр шөнө 9 цагт чам руу залгасан. Чи юу хийж байсан бэ?',
      speaker: 'Bat',
    },
    {
      en: '[Sorry](m)! [I](s) [was taking](v) [a shower](o). [My phone](s) [was](v) [in the other room](m).',
      mn: 'Уучлаарай! Би шүршүүрт орж байсан. Утас маань нөгөө өрөөнд байсан.',
      speaker: 'Saraa',
    },
    {
      en: '[Were](v) [you](s) [studying](v) [for the test](m) [before that](m)?',
      mn: 'Түүнээс өмнө чи шалгалтдаа бэлдэж байсан уу?',
      speaker: 'Bat',
    },
    {
      en: '[No](o), [I](s) [wasn\'t](v). [I](s) [was helping](v) [my little brother](o) [with his homework](m).',
      mn: 'Үгүй. Би дүүдээ гэрийн даалгаварт нь тусалж байсан.',
      speaker: 'Saraa',
    },
    {
      en: '[And](m) [your parents](s)? [Were](v) [they](s) [watching](v) [TV](o)?',
      mn: 'Аав ээж чинь? Тэд зурагт үзэж байсан уу?',
      speaker: 'Bat',
    },
    {
      en: '[Yes](o), [they](s) [were](v). [It](s) [was raining](v) [all evening](m), [so](m) [everyone](s) [was staying](v) [at home](m).',
      mn: 'Тийм ээ, үзэж байсан. Оройжин бороо орж байсан болохоор бүгд гэртээ байж байсан.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-1-1',
      ruleId: 1,
      kind: 'fill',
      question: 'At 8 o\'clock yesterday, we ___ dinner.',
      options: ['was having', 'were having', 'are having', 'had having'],
      answer: 'were having',
      explanation: 'we олон тоо тул were + having. was ганц тоотой, are having бол одоо цаг, had having гэсэн хэлбэр англи хэлэнд байхгүй.',
      hint: 'Эзэн олон тоо, цаг нь өнгөрсөн.',
    },
    {
      id: 'a2-1-2',
      ruleId: 1,
      kind: 'fill',
      question: 'She ___ to music when I saw her.',
      options: ['was listen', 'were listening', 'was listening', 'listening'],
      answer: 'was listening',
      explanation: 'She ганц тоо тул was, дараа нь -ing: was listening. was listen-д -ing дутуу, were олон тоотой, зөвхөн listening гэвэл be үйл үг дутуу.',
      hint: 'was / were + -ing хоёулаа хэрэгтэй.',
    },
    {
      id: 'a2-1-3',
      ruleId: 1,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['Did they sleeping at midnight?', 'Were they sleeping at midnight?', 'Was they sleeping at midnight?', 'They were sleep at midnight?'],
      answer: 'Were they sleeping at midnight?',
      explanation: 'Past Continuous-ийн асуултад did хэрэггүй — were эзний урд гарна. they-тэй was болохгүй, sleep-д -ing заавал хэрэгтэй.',
      hint: 'be өөрөө асуулт үүсгэнэ, did хэрэггүй.',
    },
    {
      id: 'a2-1-4',
      ruleId: 1,
      kind: 'translate',
      question: 'Өдөржин бороо орж байсан.',
      options: ['It rained all day.', 'It was raining all day.', 'It is raining all day.', 'It was rain all day.'],
      answer: 'It was raining all day.',
      explanation: '«орж байсан» гэсэн үргэлжлэх утга was raining-аар гарна. It rained дууссан баримт (орсон), is raining одоо цаг, was rain-д -ing дутуу.',
      hint: '«-ж байсан» → was / were + -ing.',
    },
  ],
};
