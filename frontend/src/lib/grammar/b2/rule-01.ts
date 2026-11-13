// frontend/src/lib/grammar/b2/rule-01.ts
// B2 дүрэм 1: Narrative tenses & Past Perfect Continuous
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule01: GrammarRule = {
  id: 1,
  title: 'Narrative tenses & Past Perfect Continuous',
  titleMn: 'Өгүүлэмжийн цагууд ба Past Perfect Continuous — түүхийг амилуулж ярих',
  hook: '«Гэртээ харьж явтал бороо орж эхлэв. Шүхрээ ажил дээрээ мартчихсан байлаа. Автобусыг хорин минут хүлээсэн болохоор бүр даарчихсан байв» — нэг түүхийн дотор дөрвөн өнгөрсөн цагийг зөв хольж сурцгаая.',
  summary: 'Түүх ярихад дөрвөн цаг хамт ажиллана: Past Simple гол үйл явдлуудыг дараалуулна (I got up, left, saw), Past Continuous дэвсгэр дүр зургийг зурна (it was raining), Past Perfect түүхээс өмнө болсныг эргэн сануулна (I had forgotten), Past Perfect Continuous (had been + V-ing) өнгөрсөн нэг мөч хүртэл хэдий хугацаанд үргэлжилснийг заана (I had been waiting for an hour).',
  description: 'A2-т бид Past Simple (болсон үйл явдал) ба Past Continuous (тэр үед үргэлжилж байсан үйлдэл)-ийг, B1-ийн 2-р дүрэмд Past Perfect (өнгөрсний өмнөх өнгөрсөн)-ийг тус тусад нь үзсэн. B2 түвшинд эдгээрийг нэг түүхийн дотор зэрэг хэрэглэж, дээр нь дөрөв дэх цаг болох Past Perfect Continuous-ийг нэмнэ. Үүнийг кино шиг төсөөлөөрэй: Past Simple бол үйл явдлын гол шугам (тэр хаалга онгойлгов, орж ирэв, суув), Past Continuous бол арын дэвсгэр (гадаа цас орж байв, хүмүүс ярилцаж байв), Past Perfect бол «эргэн дурсах» хэсэг (тэр түлхүүрээ гээчихсэн байв), Past Perfect Continuous бол тэр мөч хүртэл үргэлжилж ирсэн үйлдэл (тэр гурван цаг алхаж байсан). Past Perfect Continuous нь B1-ийн 1-р дүрэмд үзсэн Present Perfect Continuous-ийн «өнгөрсөн хувилбар» юм: I have been waiting for an hour (одоо хүртэл) → I had been waiting for an hour (өнгөрсөн тэр мөч хүртэл). Мөн өнгөрсөнд харагдсан үр дүнгийн шалтгааныг тайлбарлана: Her eyes were red because she had been crying. Монгол хэлэнд эдгээр дөрвөн утгыг «-в / -сан», «-ж байв», «-чихсан байв», «-ж байсан» гэх мэт нөхцөл, туслах үйл үгээр илэрхийлдэг ч хил зааг нь англи хэл шиг хатуу биш. Тиймээс англиар түүх ярихдаа үйлдэл бүр цаг хугацааны шугам дээр хаана байгааг ухамсартайгаар сонгох хэрэгтэй.',
  structure: 'Past Simple (V2) · Past Continuous (was / were + V-ing) · Past Perfect (had + V3) · Past Perfect Continuous (had been + V-ing + for / since …)',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'had been', part: 'verb' },
    { text: 'V-ing', part: 'verb' },
    { text: 'for / since / when …', part: 'modifier' },
  ],
  tip: 'Past Simple = юу болов (гол үйл явдал) · Past Continuous = тэр үед юу болж байв (дэвсгэр) · Past Perfect = түүнээс өмнө юу болчихсон байв · Past Perfect Continuous = тэр мөч хүртэл хэдий хугацаанд юу хийж байв.',
  examples: [
    { en: '[When](m) [I](s) [got](v) [to the station](m), [the train](s) [had already left](v).', mn: 'Намайг буудал дээр очиход галт тэрэг аль хэдийн явчихсан байв.' },
    { en: '[It](s) [was raining](v) [and](m) [people](s) [were hurrying](v) [home](m).', mn: 'Бороо орж, хүмүүс гэр лүүгээ яарч байв.' },
    { en: '[She](s) [had been waiting](v) [for an hour](m) [when](m) [the bus](s) [finally](m) [came](v).', mn: 'Автобус эцэст нь ирэхэд тэр нэг цаг хүлээж байсан юм.' },
    { en: '[His clothes](s) [were](v) [dirty](o) [because](m) [he](s) [had been working](v) [in the garden](m).', mn: 'Тэр цэцэрлэгт ажиллаж байсан болохоор хувцас нь бохир байв.' },
  ],
  useCases: [
    {
      title: 'Past Simple — түүхийн гол үйл явдлын цуваа',
      description: 'Ар араасаа болсон, дууссан үйлдлүүдийг болсон дарааллаар нь өгүүлнэ. Түүхийн «араг яс» нь Past Simple. Дарааллаараа байвал Past Perfect хэрэггүй.',
      examples: [
        { en: '[He](s) [opened](v) [the door](o), [looked](v) [around](m) [and](m) [walked](v) [in](m).', mn: 'Тэр хаалга онгойлгож, эргэн тойрноо хараад дотогш оров.' },
        { en: '[I](s) [woke up](v) [late](m), [missed](v) [the bus](o) [and](m) [took](v) [a taxi](o).', mn: 'Би оройтож сэрээд, автобуснаасаа хоцорч, такси барьсан.' },
        { en: '[Suddenly](m) [the lights](s) [went out](v) [and](m) [everyone](s) [stopped](v) [talking](o).', mn: 'Гэнэт гэрэл унтарч, бүгд ярихаа болив.' },
      ],
    },
    {
      title: 'Past Continuous — дэвсгэр дүр зураг ба тасалдсан үйлдэл',
      description: 'Түүхийн эхэнд орчныг дүрсэлнэ (цаг агаар, хүмүүс юу хийж байсан), мөн үргэлжилж байсан үйлдлийг Past Simple-ийн богино үйлдэл тасалдуулахад хэрэглэнэ. when / while / as-тай их тохирно.',
      examples: [
        { en: '[The sun](s) [was shining](v) [and](m) [children](s) [were playing](v) [in the yard](m).', mn: 'Нар гийж, хүүхдүүд хашаанд тоглож байв.' },
        { en: '[I](s) [was crossing](v) [the street](o) [when](m) [someone](s) [called](v) [my name](o).', mn: 'Намайг гудамж хөндлөн гарч явтал хэн нэгэн нэрийг минь дуудав.' },
        { en: '[While](m) [we](s) [were having](v) [dinner](o), [the phone](s) [rang](v).', mn: 'Биднийг оройн хоол идэж байх үед утас дуугарав.' },
      ],
    },
    {
      title: 'Past Perfect — түүхээс өмнө болсныг эргэн сануулах',
      description: 'Түүхийн гол мөчөөс ӨМНӨ аль хэдийн болчихсон үйлдлийг заана (B1-ийн 2-р дүрэм). Түүхийн дундуур «буцаж харах» үед хэрэглэнэ. by the time, already, just, never … before-той түгээмэл.',
      examples: [
        { en: '[I](s) [realised](v) [that](m) [I](s) [had left](v) [my wallet](o) [at home](m).', mn: 'Би түрийвчээ гэртээ орхичихсон байснаа ухаарав.' },
        { en: '[By the time](m) [we](s) [arrived](v), [the guests](s) [had already eaten](v).', mn: 'Биднийг очих үед зочид аль хэдийн хооллочихсон байв.' },
        { en: '[She](s) [was](v) [nervous](o) [because](m) [she](s) [had never flown](v) [before](m).', mn: 'Тэр өмнө нь хэзээ ч онгоцоор нисэж үзээгүй байсан тул сандарч байв.' },
      ],
    },
    {
      title: 'Past Perfect Continuous — өнгөрсөн мөч хүртэл үргэлжилсэн хугацаа',
      description: 'Өнгөрсөн нэг мөчөөс өмнө эхэлж, тэр мөч хүртэл (эсвэл түүний яг өмнө хүртэл) үргэлжилсэн үйлдэл. Хэдий хугацаанд үргэлжилснийг for / since / how long-оор заана. Онцлох зүйл нь үр дүн биш, үргэлжлэл.',
      examples: [
        { en: '[We](s) [had been driving](v) [for six hours](m) [when](m) [we](s) [ran out of](v) [petrol](o).', mn: 'Бид зургаан цаг давхиж байтал бензин дуусчихав.' },
        { en: '[He](s) [had been living](v) [in Darkhan](m) [since 2015](m) [before](m) [he](s) [moved](v) [here](m).', mn: 'Тэр наашаа нүүхээсээ өмнө 2015 оноос хойш Дарханд амьдарч байсан.' },
        { en: '[How long](m) [had](v) [you](s) [been learning](v) [English](o) [when](m) [you](s) [took](v) [the exam](o)?', mn: 'Чи шалгалт өгөхдөө англи хэлийг хэр удаан сурч байсан бэ?' },
      ],
    },
    {
      title: 'Past Perfect Continuous — өнгөрсөнд харагдсан үр дүнгийн шалтгаан',
      description: 'Өнгөрсөн мөчид ямар нэг ул мөр, үр дүн харагдаж байсан (ядарсан, нойтон, бохир), түүний шалтгаан нь түрүүхэн үргэлжилсэн үйлдэл. Үйлдэл тэр мөчид дууссан байж болно.',
      examples: [
        { en: '[Her eyes](s) [were](v) [red](o). [She](s) [had been crying](v).', mn: 'Түүний нүд улайсан байв. Тэр уйлж байсан юм.' },
        { en: '[The ground](s) [was](v) [wet](o) [because](m) [it](s) [had been raining](v) [all night](m).', mn: 'Шөнөжин бороо орсон болохоор газар нойтон байв.' },
        { en: '[I](s) [was](v) [exhausted](o) [because](m) [I](s) [had been studying](v) [since six in the morning](m).', mn: 'Би өглөөний зургаагаас хойш хичээлээ давтаж байсан болохоор туйлдчихсан байлаа.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Past Perfect Continuous — эерэг',
      structure: 'Subject + had been + V-ing (+ for / since …)',
      examples: [
        { en: '[I](s) [had been working](v) [there](m) [for three years](m) [when](m) [I](s) [got](v) [promoted](o).', mn: 'Би албан тушаал ахихдаа тэнд гурван жил ажиллаж байсан.' },
        { en: '[They](s)[\'d been arguing](v) [all morning](m), [so](m) [the atmosphere](s) [was](v) [tense](o).', mn: 'Тэд өглөөжин маргалдсан тул уур амьсгал хурцадмал байв.' },
        { en: '[The baby](s) [had been sleeping](v) [since noon](m).', mn: 'Нялх хүүхэд үдээс хойш унтаж байсан.' },
      ],
    },
    {
      label: 'Үгүйсгэл ба асуулт',
      structure: 'Subject + hadn\'t been + V-ing · Had + subject + been + V-ing? · How long had + subject + been + V-ing?',
      examples: [
        { en: '[I](s) [hadn\'t been feeling](v) [well](m) [for days](m), [so](m) [I](s) [went](v) [to the doctor](m).', mn: 'Хэдэн өдрийн турш бие маань тааруу байсан тул би эмчид очсон.' },
        { en: '[Had](v) [he](s) [been drinking](v) [before](m) [he](s) [drove](v) [home](m)?', mn: 'Тэр гэр лүүгээ машин барихаасаа өмнө архи ууж байсан уу?' },
        { en: '[How long](m) [had](v) [they](s) [been going out](v) [when](m) [they](s) [got](v) [married](o)?', mn: 'Тэд гэрлэхдээ хэр удаан үерхэж байсан бэ?' },
      ],
    },
    {
      label: 'Past Perfect Simple vs Continuous',
      structure: 'had + V3 (үр дүн, хэдэн удаа / хэдэн ширхэг) · had been + V-ing (үргэлжлэл, хэр удаан)',
      examples: [
        { en: '[She](s) [had written](v) [three reports](o) [by lunchtime](m).', mn: 'Тэр үдийн хоол гэхэд гурван тайлан бичээд дуусгачихсан байв. (үр дүн, тоо)' },
        { en: '[She](s) [had been writing](v) [reports](o) [all morning](m).', mn: 'Тэр өглөөжин тайлан бичиж байсан. (үргэлжлэл)' },
        { en: '[I](s) [had known](v) [him](o) [for years](m) [before](m) [we](s) [became](v) [friends](o).', mn: 'Бид найзууд болохоос өмнө би түүнийг олон жил таньдаг байсан. (төлөвийн үйл үг — continuous болохгүй)' },
      ],
    },
    {
      label: 'Дөрвөн цаг нэг түүхэнд',
      structure: 'дэвсгэр (was / were + V-ing) + гол үйл явдал (V2) + өмнөх үйлдэл (had + V3 / had been + V-ing)',
      examples: [
        { en: '[It](s) [was getting](v) [dark](o) [when](m) [we](s) [reached](v) [the village](o).', mn: 'Биднийг тосгонд хүрэхэд харанхуй болж байв.' },
        { en: '[We](s) [had been walking](v) [all day](m) [and](m) [had eaten](v) [nothing](o).', mn: 'Бид өдөржин алхсан бөгөөд юу ч идээгүй байлаа.' },
        { en: '[An old man](s) [who](s) [was sitting](v) [outside](m) [smiled](v) [and](m) [invited](v) [us](o) [in](m).', mn: 'Гадаа сууж байсан нэгэн өвгөн инээмсэглээд биднийг гэртээ урив.' },
      ],
    },
  ],
  signalWords: ['when', 'while', 'as', 'by the time', 'before', 'after', 'for', 'since', 'already', 'suddenly', 'how long', 'all day'],
  notes: [
    'Төлөвийн үйл үгс (know, be, have = эзэмших, like, believe, understand) continuous хэлбэрт ордоггүй: I had been knowing her (буруу) → I had known her for years (зөв).',
    'Past Continuous ба Past Perfect Continuous-ийн ялгаа: I was waiting when he came = тэр ирэх мөчид хүлээж байв (зүгээр дэвсгэр). I had been waiting for an hour when he came = тэр мөч хүртэл аль хэдийн нэг цаг хүлээчихсэн байв. for / since-тэй хугацаа байвал had been + V-ing сонго.',
    'Past Perfect Continuous бол Present Perfect Continuous-ийн өнгөрсөн хувилбар. «Одоо» гэсэн цэгийг «өнгөрсөн тэр мөч» рүү шилжүүлэхэд have been → had been болно.',
    'Үйл явдлуудыг болсон дарааллаар нь өгүүлж байвал Past Perfect хэрэггүй: I got up, had breakfast and left. Past Perfect зөвхөн дарааллыг эвдэж «буцаж харах» үед хэрэгтэй.',
    'Хэдэн удаа, хэдэн ширхэг гэсэн тоо байвал Past Perfect Simple: He had called five times. Хэр удаан гэсэн хугацаа, үргэлжлэлийг онцолбол Continuous: He had been calling all evening.',
    'when-ийн дараах цаг утгыг өөрчилнө: When I arrived, she left = намайг ирмэгц тэр явав (дараа нь). When I arrived, she had left = намайг ирэхэд тэр аль хэдийн явчихсан байв (өмнө нь). When I arrived, she was leaving = яг гарч явж байв.',
  ],
  commonMistakes: [
    {
      wrong: 'I was waiting for two hours when he finally arrived.',
      correct: 'I had been waiting for two hours when he finally arrived.',
      explanation: 'Өнгөрсөн мөч (he arrived) хүртэл хэдий хугацаанд үргэлжилснийг for-оор заасан тул Past Perfect Continuous хэрэгтэй. Монголоор хоёуланг нь «хүлээж байсан» гэдэг тул was waiting сонгох алдаа гардаг.',
    },
    {
      wrong: 'She was tired because she has been running.',
      correct: 'She was tired because she had been running.',
      explanation: 'Түүх өнгөрсөн цаг дээр явж байгаа (was tired) тул шалтгаан нь түүнээс өмнөх үйлдэл — had been running. has been running нь одоотой холбогддог.',
    },
    {
      wrong: 'I had been knowing him for ten years when he moved abroad.',
      correct: 'I had known him for ten years when he moved abroad.',
      explanation: 'know бол төлөвийн үйл үг — continuous хэлбэргүй. Хугацаа заасан ч Past Perfect Simple хэрэглэнэ.',
    },
    {
      wrong: 'When we got to the cinema, the film already started.',
      correct: 'When we got to the cinema, the film had already started.',
      explanation: 'Кино бидний очихоос ӨМНӨ эхэлчихсэн — хоёр өнгөрсөн үйлдлийн эрт болсон нь Past Perfect. Past Simple гэвэл дараалал тодорхойгүй болно.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор түүх ярихдаа «-в», «-сан», «-лаа», «-жээ» гэсэн төгсгөлүүдийг сольж хэрэглэдэг ч эдгээр нь цаг хугацааны дараалал гэхээсээ илүү өгүүлэгчийн өнгө аясыг ялгадаг. Англиар бол цаг бүр үйлдэл цаг хугацааны шугам дээр хаана байгааг хатуу заана.',
      'Монголоор «хүлээж байсан» гэдэг нь was waiting ч, had been waiting ч байж болно. Өгүүлбэрт «нэг цаг», «өглөөнөөс хойш» гэсэн хугацаа + өнгөрсөн өөр мөч (тэр ирэхэд) хоёулаа байвал англиар had been + V-ing гэж бодоорой.',
      'Монголоор «-чихсан байв», «-сан байлаа» (явчихсан байв, мартчихсан байлаа) гэсэн хэлбэр нь Past Perfect-тэй хамгийн ойр. Энэ хэлбэрийг харвал had + V3 сонго.',
      'Монголоор шалтгааныг «уйлсан болохоор нүд нь улайсан байв» гэж энгийн өнгөрсөн цагаар хэлдэг. Англиар шалтгаан болсон үйлдэл түрүүхэн үргэлжилж байсан бол had been crying гэж Past Perfect Continuous-оор ялгаж өгдөг.',
    ],
  },
  dialogue: [
    {
      en: 'Temuulen, [you](s) [look](v) [exhausted](o). [What](s) [happened](v) [last night](m)?',
      mn: 'Тэмүүлэн, чи их ядарсан харагдаж байна. Өчигдөр шөнө юу болсон бэ?',
      speaker: 'Nomin',
    },
    {
      en: '[I](s) [was driving](v) [home](m) [from the countryside](m) [when](m) [my car](s) [broke down](v).',
      mn: 'Хөдөөнөөс гэр лүүгээ давхиж явтал машин маань эвдэрчихсэн.',
      speaker: 'Temuulen',
    },
    {
      en: 'Oh no! [How long](m) [had](v) [you](s) [been driving](v) [by then](m)?',
      mn: 'Ээ харла! Тэр үед чи хэр удаан жолоо барьж байсан юм бэ?',
      speaker: 'Nomin',
    },
    {
      en: '[I](s)[\'d been driving](v) [for about five hours](m), [and](m) [it](s) [had just started](v) [to snow](o).',
      mn: 'Би бараг таван цаг давхиж байсан, тэгээд яг цас орж эхэлчихсэн байсан.',
      speaker: 'Temuulen',
    },
    {
      en: '[Had](v) [you](s) [charged](v) [your phone](o) [before](m) [you](s) [left](v)?',
      mn: 'Чи гарахаасаа өмнө утсаа цэнэглэсэн байсан уу?',
      speaker: 'Nomin',
    },
    {
      en: 'Luckily, yes. [I](s) [called](v) [my brother](o), [and](m) [while](m) [I](s) [was waiting](v), [a lorry driver](s) [stopped](v) [and](m) [helped](v) [me](o).',
      mn: 'Азаар тийм. Би ах руугаа залгасан, тэгээд хүлээж байх хооронд нэг ачааны машины жолооч зогсоод надад тусалсан.',
      speaker: 'Temuulen',
    },
  ],
  quiz: [
    {
      id: 'b2-01-1',
      ruleId: 1,
      kind: 'fill',
      question: 'We ___ for about two hours when the engine suddenly broke down.',
      options: ['had been driving', 'have been driving', 'are driving', 'will have been driving'],
      answer: 'had been driving',
      explanation: 'Өнгөрсөн мөч (the engine broke down) хүртэл хоёр цаг үргэлжилсэн үйлдэл — Past Perfect Continuous: had been driving. have been driving нь одоо хүртэл, will have been driving нь ирээдүйн мөч хүртэл гэсэн утгатай.',
      hint: 'Өнгөрсөн мөч хүртэл хэр удаан үргэлжилсэн бэ?',
    },
    {
      id: 'b2-01-2',
      ruleId: 1,
      kind: 'fill',
      question: 'While I ___ home, I realised that I had left my keys at the office.',
      options: ['was walking', 'had walked', 'am walking', 'have walked'],
      answer: 'was walking',
      explanation: 'while-ийн ард үргэлжилж байсан дэвсгэр үйлдэл — Past Continuous: was walking. Түүний дундуур богино үйлдэл (realised) болсон. had walked гэвэл алхаж дууссан болно, am / have нь одоо цагтай холбоотой.',
      hint: 'while + үргэлжилж байсан үйлдэл.',
    },
    {
      id: 'b2-01-3',
      ruleId: 1,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'She was tired because she has been working all night.',
        'When we arrived, the match had already begun.',
        'I had been knowing him for years before we became friends.',
        'By the time the police arrived, the thief already escapes.',
      ],
      answer: 'When we arrived, the match had already begun.',
      explanation: 'Тэмцээн бидний очихоос өмнө эхэлчихсэн — Past Perfect зөв. Бусад нь: өнгөрсөн түүхэнд has been биш had been working; know continuous болдоггүй (had known); by the time-тэй had already escaped байх ёстой.',
      hint: 'Эрт болсон үйлдэл = had + V3.',
    },
    {
      id: 'b2-01-4',
      ruleId: 1,
      kind: 'translate',
      question: 'Түүнийг ирэхэд би нэг цагийн турш хүлээж байсан.',
      options: [
        'When she arrived, I have been waiting for her for an hour.',
        'When she arrived, I am waiting for her for an hour.',
        'When she arrived, I had been waiting for her for an hour.',
        'When she arrived, I had been waited for her for an hour.',
      ],
      answer: 'When she arrived, I had been waiting for her for an hour.',
      explanation: '«Ирэхэд» гэсэн өнгөрсөн мөч хүртэл «нэг цагийн турш» үргэлжилсэн — had been + V-ing. have been / am нь одоо цагтай холбоотой, had been waited гэсэн хэлбэр буруу (V-ing байх ёстой).',
      hint: 'had been + V-ing + for …',
    },
  ],
};
