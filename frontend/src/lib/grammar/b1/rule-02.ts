// frontend/src/lib/grammar/b1/rule-02.ts
// B1 дүрэм 2: Past Perfect
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule02: GrammarRule = {
  id: 2,
  title: 'Past Perfect',
  titleMn: 'Өнгөрсөн төгссөн цаг — өнгөрсөн үйлдлээс ч өмнө болсон үйлдэл',
  hook: '«Би буудал дээр очиход галт тэрэг ЯВЧИХСАН байсан» — өнгөрсөн хоёр үйлдлийн аль нь түрүүлж болсныг тодорхой хэлж сурцгаая.',
  summary: 'had + Verb3 нь өнгөрсөн цагийн тодорхой нэг мөчөөс ӨМНӨ аль хэдийн болж дууссан үйлдлийг заана. Хоёр өнгөрсөн үйлдлийг харьцуулан «энэ нь түрүүлж болсон» гэдгийг тодруулна: When I arrived, the train had left.',
  description: 'A2 түвшинд бид Past Simple (I arrived) болон Past Continuous (I was walking) хоёрыг үзсэн — хоёулаа өнгөрсөн нэг цэг дээрх үйлдлийг заадаг. Past Perfect бол «өнгөрсний өнгөрсөн» юм. Өгүүлбэрт өнгөрсөн хоёр үйлдэл байхад аль нь ЭХЭЛЖ болсныг had + Verb3-аар заана. When I got home, my wife had cooked dinner — би гэртээ ирэхээс өмнө эхнэр минь хоол хийчихсэн байсан. Хэрэв When I got home, my wife cooked dinner гэвэл би ирсний ДАРАА хоол хийсэн гэсэн утга болно. Present Perfect (have done) одоо цагтай харьцуулж «одоо хүртэл» гэдэг бол Past Perfect (had done) өнгөрсөн цагийн нэг мөчтэй харьцуулж «тэр үе хүртэл» гэдэг. Хэлбэр нь бүх биед адил had тул Present Perfect-ээс амархан. Монголоор «-чихсан байсан», «-сан байсан» гэсэн давхар өнгөрсөн хэлбэр яг энэ утгыг өгдөг: явчихсан байсан, хийчихсэн байсан.',
  structure: 'Subject + had + Verb3 (past participle) + … (before / when / by the time …)',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'had', part: 'verb' },
    { text: 'Verb3', part: 'verb' },
    { text: 'when / before / by the time …', part: 'modifier' },
  ],
  tip: 'Өнгөрсөн хоёр үйлдэл байвал: түрүүлж болсон нь had + V3, дараа нь болсон нь Past Simple. Монголоор «-чихсан байсан» гэж орчуулагдаж байвал Past Perfect.',
  examples: [
    { en: '[When I arrived](m), [the train](s) [had already left](v).', mn: 'Намайг очиход галт тэрэг аль хэдийн явчихсан байсан.' },
    { en: '[She](s) [had finished](v) [her homework](o) [before dinner](m).', mn: 'Тэр оройн хоолноос өмнө гэрийн даалгавраа дуусгачихсан байсан.' },
    { en: '[I](s) [didn\'t recognise](v) [him](o) [because he had changed so much](m).', mn: 'Тэр маш их өөрчлөгдсөн байсан учраас би түүнийг таниагүй.' },
    { en: '[Had](v) [you](s) [ever been](v) [abroad](m) [before that trip](m)?', mn: 'Тэр аялалаас өмнө чи гадаадад явж байсан уу?' },
  ],
  useCases: [
    {
      title: 'Өнгөрсөн хоёр үйлдлийн дарааллыг тодруулах',
      description: 'Хамгийн гол хэрэглээ. Хоёр өнгөрсөн үйлдлээс аль нь түрүүлж болсныг заана. Түрүүлж болсон нь Past Perfect, дараагийнх нь Past Simple. when, before, after, by the time зэрэг үгстэй хамт ирдэг.',
      examples: [
        { en: '[By the time we got to the cinema](m), [the film](s) [had started](v).', mn: 'Биднийг кинотеатрт очиход кино эхэлчихсэн байсан.' },
        { en: '[He](s) [had already eaten](v) [when I invited him to lunch](m).', mn: 'Намайг өдрийн хоолонд урихад тэр аль хэдийн хооллочихсон байсан.' },
        { en: '[After she had read the letter](m), [she](s) [started](v) [to cry](o).', mn: 'Захидлыг уншсаныхаа дараа тэр уйлж эхэлсэн.' },
      ],
    },
    {
      title: 'Өнгөрсөн үйлдлийн шалтгааныг тайлбарлах',
      description: 'Өнгөрсөн нэг байдал яагаад ийм байсныг түүнээс өмнө болсон үйлдлээр тайлбарлана. Ихэвчлэн because-тэй хамт ирдэг.',
      examples: [
        { en: '[I](s) [was](v) [hungry](o) [because I hadn\'t eaten breakfast](m).', mn: 'Би өглөөний цай уугаагүй байсан учраас өлссөн байсан.' },
        { en: '[She](s) [was](v) [tired](o) [because she had worked all night](m).', mn: 'Тэр шөнөжин ажилласан байсан болохоор ядарсан байсан.' },
        { en: '[The road](s) [was](v) [wet](o) [because it had rained](m).', mn: 'Бороо орсон байсан учраас зам нойтон байсан.' },
      ],
    },
    {
      title: 'Өнгөрсөн нэг мөч хүртэлх туршлага — ever / never',
      description: 'Present Perfect-ээр «одоо хүртэл» туршлагыг хэлдэг байсан бол Past Perfect-ээр «тэр үе хүртэл» туршлагыг хэлнэ. It was the first time … гэсэн бүтэцтэй хамт их хэрэглэнэ.',
      examples: [
        { en: '[It](s) [was](v) [the first time](o) [I had ever flown](m).', mn: 'Энэ бол миний анх удаа онгоцоор нисч байсан явдал байлаа.' },
        { en: '[Before 2019](m), [I](s) [had never seen](v) [the sea](o).', mn: '2019 оноос өмнө би далайг хэзээ ч харж байгаагүй байсан.' },
        { en: '[She](s) [had never eaten](v) [sushi](o) [until she went to Japan](m).', mn: 'Япон явах хүртлээ тэр суши хэзээ ч идэж үзээгүй байсан.' },
      ],
    },
    {
      title: 'Present Perfect-ээс ялгаа — одоо хүртэл үү, тэр үе хүртэл үү',
      description: 'A2-д үзсэн Present Perfect (have done) одоо цагтай холбогддог: «одоо хүртэл». Past Perfect (had done) өнгөрсөн нэг цэгтэй холбогддог: «тэр үе хүртэл». Лавлах цэг нь одоо уу, өнгөрсөн үү гэдгээр сонгоно.',
      examples: [
        { en: '[I](s) [have lost](v) [my keys](o). [I](s) [can\'t get](v) [in](m).', mn: 'Би түлхүүрээ гээчихсэн. Орж чадахгүй байна. (одоо)' },
        { en: '[I](s) [had lost](v) [my keys](o), [so](m) [I](s) [couldn\'t get](v) [in](m).', mn: 'Би түлхүүрээ гээчихсэн байсан болохоор орж чадаагүй. (тэр үед)' },
        { en: '[She](s) [has left](v). [She](s) [had left](v) [when I called](m).', mn: 'Тэр явчихсан. Намайг залгахад тэр явчихсан байсан.' },
      ],
    },
    {
      title: 'Past Simple-ээс ялгаа — дараалал өөрчлөгдвөл утга өөрчлөгдөнө',
      description: 'A2-д үзсэн Past Simple хоёр үйлдэлд хэрэглэвэл тэдгээр нь дарааллаараа болсон гэж ойлгогдоно. Past Perfect хэрэглэвэл түүхэн дараалал өөр гэдгийг заана. Энэ ялгаа утгыг бүрэн өөрчилдөг.',
      examples: [
        { en: '[When I got home](m), [she](s) [cooked](v) [dinner](o).', mn: 'Намайг гэртээ ирэхэд тэр хоол хийсэн. (би ирсний дараа хийсэн)' },
        { en: '[When I got home](m), [she](s) [had cooked](v) [dinner](o).', mn: 'Намайг гэртээ ирэхэд тэр хоол хийчихсэн байсан. (би ирэхээс өмнө хийсэн)' },
        { en: '[The film](s) [started](v) [when we arrived](m). [The film](s) [had started](v) [when we arrived](m).', mn: 'Биднийг очиход кино эхэлсэн. Биднийг очиход кино эхэлчихсэн байсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Батлах',
      structure: 'Subject + had + Verb3 (бүх биед had)',
      examples: [
        { en: '[They](s) [had left](v) [before we arrived](m).', mn: 'Биднийг ирэхээс өмнө тэд явчихсан байсан.' },
        { en: '[He](s) [had lived](v) [in London](m) [before he moved here](m).', mn: 'Энд нүүж ирэхээсээ өмнө тэр Лондонд амьдарч байсан.' },
        { en: '[I](s)[\'d seen](v) [that film](o) [twice](m) [already](m).', mn: 'Би тэр киног аль хэдийн хоёр удаа үзчихсэн байсан.' },
      ],
    },
    {
      label: 'Үгүйсгэх',
      structure: 'Subject + hadn\'t (had not) + Verb3',
      examples: [
        { en: '[She](s) [hadn\'t finished](v) [the report](o) [when the boss asked for it](m).', mn: 'Дарга нь тайланг асуухад тэр дуусгаагүй байсан.' },
        { en: '[We](s) [hadn\'t met](v) [before the party](m).', mn: 'Үдэшлэгээс өмнө бид уулзаж байгаагүй байсан.' },
        { en: '[I](s) [hadn\'t heard](v) [the news](o) [until you told me](m).', mn: 'Чамайг хэлэх хүртэл би энэ мэдээг сонсоогүй байсан.' },
      ],
    },
    {
      label: 'Асуух',
      structure: 'Had + subject + Verb3? · Wh- + had + subject + Verb3?',
      examples: [
        { en: '[Had](v) [you](s) [studied](v) [English](o) [before you came here](m)?', mn: 'Энд ирэхээсээ өмнө чи англи хэл сурч байсан уу?' },
        { en: '[Where](m) [had](v) [she](s) [worked](v) [before that](m)?', mn: 'Түүнээс өмнө тэр хаана ажиллаж байсан бэ?' },
        { en: '[Had](v) [they](s) [already gone](v) [when you got there](m)?', mn: 'Чамайг очиход тэд аль хэдийн явчихсан байсан уу?' },
      ],
    },
    {
      label: 'Богино хариулт ба товчлол',
      structure: 'Yes, I had. / No, I hadn\'t. · I\'d = I had, she\'d = she had',
      examples: [
        { en: '[Had](v) [he](s) [called](v) [you](o)? — Yes, [he](s) [had](v).', mn: 'Тэр чам руу залгасан байсан уу? — Тийм, залгасан байсан.' },
        { en: '[Had](v) [you](s) [been](v) [there](m) [before](m)? — No, [I](s) [hadn\'t](v).', mn: 'Чи өмнө нь тэнд очиж байсан уу? — Үгүй, очоогүй байсан.' },
        { en: '[She](s)[\'d already told](v) [me](o) [everything](o).', mn: 'Тэр надад бүгдийг аль хэдийн хэлчихсэн байсан.' },
      ],
    },
  ],
  signalWords: ['before', 'after', 'when', 'by the time', 'already', 'just', 'never', 'until', 'as soon as'],
  notes: [
    'Past Perfect зөвхөн өөр өнгөрсөн үйлдэл, мөчтэй харьцуулахад хэрэглэнэ. Дангаараа нэг өнгөрсөн үйлдлийг хэлэхэд Past Simple л хангалттай: I went to Paris last year (had gone гэхгүй).',
    'before, after гэсэн үг дарааллыг өөрөө зааж байвал Past Perfect заавал биш: After I finished, I went home = After I had finished, I went home. Хоёулаа зөв.',
    '\'d товчлол had (I\'d seen) болон would (I\'d like) хоёуланд нь хэрэглэгддэг. Ард нь Verb3 байвал had, үндсэн үйл үг байвал would.',
    'Verb3 хэлбэр нь Present Perfect-тэй адил: gone, seen, eaten, written. Дүрмийн бус үйл үгсийн гурав дахь хэлбэрийг давтаарай.',
    'Past Perfect нь мөн шууд бус ярианд (reported speech) Past Simple-ийг «нэг алхам ухраахад» гарч ирдэг — үүнийг B1-ийн 8-р дүрэмд үзнэ.',
    'Ярианы хэлэнд Past Perfect-ийг заримдаа Past Simple-ээр сольж хэлдэг ч бичгийн хэл, шалгалтад ялгааг нь зөв хэрэглэх хэрэгтэй.',
  ],
  commonMistakes: [
    {
      wrong: 'When I arrived, the meeting already started.',
      correct: 'When I arrived, the meeting had already started.',
      explanation: 'already нь «намайг ирэхээс ӨМНӨ» гэдгийг заана — тэгэхээр Past Perfect. Past Simple-ээр хэлбэл би ирсний дараа эхэлсэн гэсэн буруу утга гарна.',
    },
    {
      wrong: 'I had gone to the cinema yesterday.',
      correct: 'I went to the cinema yesterday.',
      explanation: 'Өнгөрсөн ганц үйлдлийг хэлэхэд Past Perfect хэрэггүй. Харьцуулах өөр өнгөрсөн мөч байхгүй бол Past Simple.',
    },
    {
      wrong: 'She has finished her work before she left the office.',
      correct: 'She had finished her work before she left the office.',
      explanation: 'left гэсэн өнгөрсөн цэгтэй харьцуулж байгаа тул Past Perfect (had finished). Present Perfect (has finished) зөвхөн одоо цагтай холбогддог.',
    },
    {
      wrong: 'Before he had come here, he lived in Darkhan.',
      correct: 'Before he came here, he had lived in Darkhan.',
      explanation: 'Түрүүлж болсон үйлдэл (Дархан амьдарсан) нь Past Perfect, дараагийнх нь (энд ирсэн) Past Simple байх ёстой. Хоёуланг нь солиод тавьсан байна.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «-чихсан байсан», «-сан байсан» гэсэн хэлбэр Past Perfect-ийн утгыг яг өгдөг: «явчихсан байсан» = had left. Орчуулахдаа энэ хэлбэрийг харвал Past Perfect гэж таньж болно.',
      'Монголоор «намайг очиход галт тэрэг явсан» гэж хэлбэл ч дарааллыг контекстээс ойлгодог. Англиар the train left / the train had left хоёр өөр утгатай тул давхар өнгөрснийг тодруулж хэлэх нь заавал.',
      'Монголоор шалтгааныг «-сан байсан учраас» гэж хэлдэг нь because + Past Perfect бүтэцтэй яг таардаг: «өглөөний цай уугаагүй байсан учраас» = because I hadn\'t eaten breakfast.',
      'Present Perfect ба Past Perfect-ийн ялгааг монголоор «-чихсан» (одоо) ба «-чихсан байсан» (тэр үед) гэж ялгаж ойлгоорой: гээчихсэн = have lost, гээчихсэн байсан = had lost.',
    ],
  },
  dialogue: [
    {
      en: 'Hi Saraa! [How](m) [was](v) [the concert](s) [last night](m)?',
      mn: 'Сайн уу, Сараа! Өчигдөр орой концерт ямар байсан бэ?',
      speaker: 'Bat',
    },
    {
      en: 'Terrible! [When we arrived](m), [the concert](s) [had already started](v).',
      mn: 'Аймаар! Биднийг очиход концерт аль хэдийн эхэлчихсэн байсан.',
      speaker: 'Saraa',
    },
    {
      en: 'Oh no! [Why](m) [were](v) [you](s) [late](o)?',
      mn: 'Ёстой яасан юм. Та нар яагаад хоцорсон бэ?',
      speaker: 'Bat',
    },
    {
      en: '[Tuya](s) [had forgotten](v) [the tickets](o) [at home](m), [so](m) [we](s) [had to go](v) [back](m).',
      mn: 'Туяа тасалбараа гэртээ мартчихсан байсан болохоор бид буцах хэрэгтэй болсон.',
      speaker: 'Saraa',
    },
    {
      en: '[Had](v) [you](s) [seen](v) [that band](o) [before](m)?',
      mn: 'Чи тэр хамтлагийг өмнө нь үзэж байсан уу?',
      speaker: 'Bat',
    },
    {
      en: 'No, [I](s) [hadn\'t](v). [It](s) [was](v) [the first time](o) [I\'d ever been to a live concert](m). [And](m) [we](s) [missed](v) [half of it](o)!',
      mn: 'Үгүй, үзээгүй байсан. Амьд концертод анх удаа очиж байсан минь тэр. Тэгээд хагасыг нь алдчихлаа!',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'b1-02-1',
      ruleId: 2,
      kind: 'fill',
      question: 'By the time I got to the station, the train ___.',
      options: ['left', 'has left', 'had left', 'was leaving'],
      answer: 'had left',
      explanation: 'By the time + Past Simple (got) байгаа тул түүнээс өмнө болсон үйлдэл нь Past Perfect: had left. has left одоо цагтай холбогдоно, энд өнгөрсөн мөч байна.',
      hint: 'Би очихоос ӨМНӨ галт тэрэг явчихсан байсан.',
    },
    {
      id: 'b1-02-2',
      ruleId: 2,
      kind: 'fill',
      question: 'She was very tired because she ___ all night.',
      options: ['hadn\'t slept', 'didn\'t sleep', 'hasn\'t slept', 'doesn\'t sleep'],
      answer: 'hadn\'t slept',
      explanation: 'Ядарсан (was tired) байдлын шалтгаан нь түүнээс өмнө болсон — унтаагүй байсан. Өнгөрсний өмнөх үйлдэл тул Past Perfect: hadn\'t slept.',
      hint: 'Ядрахаас өмнө шөнөжин унтаагүй байсан.',
    },
    {
      id: 'b1-02-3',
      ruleId: 2,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'I had visited Paris last summer.',
        'When I called her, she has already gone out.',
        'After he had finished dinner, he watched TV.',
        'Before she came here, she has lived in Erdenet.',
      ],
      answer: 'After he had finished dinner, he watched TV.',
      explanation: 'Түрүүлж болсон үйлдэл (хоолоо дуусгасан) Past Perfect, дараагийнх (ТВ үзсэн) Past Simple. Эхнийх нь ганц үйлдэл тул Past Simple байх ёстой; бусад нь өнгөрсөн мөчтэй has хэрэглэсэн алдаатай.',
      hint: 'Хоёр өнгөрсөн үйлдэл, зөв дараалалтай нь аль вэ?',
    },
    {
      id: 'b1-02-4',
      ruleId: 2,
      kind: 'translate',
      question: 'Намайг гэртээ ирэхэд ээж хоол хийчихсэн байсан.',
      options: [
        'When I came home, my mother had cooked dinner.',
        'When I came home, my mother cooked dinner.',
        'When I had come home, my mother cooked dinner.',
        'When I come home, my mother has cooked dinner.',
      ],
      answer: 'When I came home, my mother had cooked dinner.',
      explanation: '«Хийчихсэн байсан» — би ирэхээс өмнө хоол бэлэн болчихсон байсан. Түрүүлж болсон үйлдэл had cooked, дараагийнх came.',
      hint: '«-чихсэн байсан» = had + V3.',
    },
  ],
};
