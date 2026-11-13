// frontend/src/lib/grammar/c1/rule-11.ts
// C1 дүрэм 11: Fronting & emphasis
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule11: GrammarRule = {
  id: 11,
  title: 'Fronting & emphasis',
  titleMn: 'Fronting ба emphasis — өгүүлбэрийн гишүүнийг урагшлуулж онцлох',
  hook: '«Би үнэхээр илгээсэн шүү дээ!», «Үүнийг л би хүлээн зөвшөөрч чадахгүй», «Хачирхалтай санагдаж болох ч…» — хэлэх гэснээ өгүүлбэрийн эхэнд гаргаж, үгэндээ жин нэмэх аргуудыг сурцгаая.',
  summary: 'Англи хэлний үгийн дараалал хатуу (S + V + O) тул дарааллыг өөрчлөх нь өөрөө онцлолын хэрэгсэл болдог. Emphatic do / does / did (I did send it) батлах өгүүлбэрийг хүчтэй болгоно. Fronting нь тусагдахуун, нөхцөл, complement-ийг эхэнд гаргана (That I can\'t accept). So / such болон газрын нөхцөлийг эхэнд гаргахад inversion үүснэ (So tired was he that…; On the hill stood a castle; Here comes the bus). All I did was… ба The reason why … is that… нь cleft-ийн ахисан хэлбэрүүд.',
  description: 'B2-ийн 11-р дүрэмд бид cleft өгүүлбэрээр (It was Bat that called; What I need is a rest) нэг гишүүнийг онцолж сурсан. C1-ийн 1-р дүрэмд сөрөг нөхцөлийг эхэнд гаргахад inversion үүсдэгийг үзсэн (Never have I seen…). Энэ дүрэм онцлолын үлдсэн хэрэгслүүдийг нэгтгэнэ. (1) Emphatic do: батлах Present / Past Simple өгүүлбэрт do / does / did нэмж, үндсэн үйл үгийг V1 хэлбэрт оруулна — эсэргүүцэх, батлах, эелдгээр шаардах өнгө өгнө (I did lock the door; Do sit down). (2) Fronting: ердийн үед үйл үгийн ард байдаг тусагдахуун, complement, нөхцөлийг өгүүлбэрийн эхэнд гаргана. Ихэнхдээ inversion болохгүй, эзэн + үйл үгийн дараалал хэвээр: That I can\'t accept; This question we will return to later. (3) Тэмдэг нэр / дайвар үг + as / though: Strange as it may seem — «хэдий хачирхалтай санагдаж болох ч» гэсэн буулт (C1-ийн 12-р дүрэмд дэлгэрэнгүй). (4) So / such-ийг эхэнд гаргавал заавал inversion: So tired was he that he fell asleep; Such was the noise that nobody could sleep. (5) Газар, чиглэлийн нөхцөлийг эхэнд гаргахад үйл үг эзнийхээ өмнө ордог, do туслахгүйгээр: On the hill stood a castle; Here comes the bus. Эзэн нь төлөөний үг бол inversion болохгүй: Here it comes. (6) Cleft-ийн ахисан хэлбэр: All I did was ask («би ердөө л асуусан»), The reason why I left is that… («миний явсан шалтгаан нь…»). Хэв маягийн хувьд emphatic do, Here comes…, All I did was… нь өдөр тутмын ярианд түгээмэл; харин So tired was he…, On the hill stood… зэрэг нь уран зохиол, илтгэл, албан бичгийн хэлний өнгөтэй. Монгол хэлэнд үгийн дараалал харьцангуй чөлөөтэй, онцлолыг «л», «ч», «шүү дээ», «бол» зэрэг сул үгээр илэрхийлдэг бол англи хэлэнд ийм сул үг цөөн тул дараалал ба туслах үйл үг энэ үүргийг гүйцэтгэдэг.',
  structure: 'subject + do / does / did + V1 · Object / Complement + subject + verb · So + adj + be + subject + that … · Place adverbial + verb + noun subject · All (that) + clause + be + V1 · The reason why … is that …',
  structureParts: [
    { text: 'So tired', part: 'object' },
    { text: 'was', part: 'verb' },
    { text: 'he', part: 'subject' },
    { text: 'that he fell asleep', part: 'modifier' },
  ],
  tip: 'do / does / did + V1 = «үнэхээр, шүү дээ» · тусагдахууныг урагшлуулахад inversion БАЙХГҮЙ (That I can\'t accept) · So / Such болон газрын нөхцөл урд гарвал inversion БАЙНА (So tired was he; On the hill stood a castle) · төлөөний үгтэй бол Here it comes · All I did was + V1.',
  examples: [
    { en: '[I](s) [do understand](v) [your concerns](o).', mn: 'Би таны санаа зовнилыг үнэхээр ойлгож байна.' },
    { en: '[That](o) [I](s) [simply can\'t accept](v).', mn: 'Үүнийг л би ердөө хүлээн зөвшөөрч чадахгүй.' },
    { en: '[On the hill](m) [stood](v) [an old castle](s).', mn: 'Толгод дээр нэгэн хуучин цайз сүндэрлэж байв.' },
    { en: '[All I did](s) [was](v) [ask a simple question](o).', mn: 'Миний хийсэн зүйл гэвэл ердөө л энгийн асуулт асуусан.' },
  ],
  useCases: [
    {
      title: 'Emphatic do / does / did — батлах өгүүлбэрийг хүчтэй болгох',
      description: 'Хэн нэгэн эргэлзсэн, үгүйсгэсэн үед «үгүй ээ, үнэхээр тэгсэн» гэж батлах, эсвэл мэдрэмжээ хүчтэй илэрхийлэхэд хэрэглэнэ. Зөвхөн батлах Present Simple / Past Simple-д; ард нь заавал V1. Ярианд do / does / did дээр өргөлт унана. Тушаах хэлбэрт (Do sit down) эелдэг, халуун дулаан урилга болно.',
      examples: [
        { en: '[I](s) [did send](v) [the email](o) — [check](v) [your spam folder](o).', mn: 'Би имэйлийг үнэхээр илгээсэн шүү дээ — спам хавтсаа шалгаарай.' },
        { en: '[She](s) [does look](v) [tired](o), [doesn\'t she](m)?', mn: 'Тэр үнэхээр ядарсан харагдаж байна, тийм ээ?' },
        { en: '[Do sit](v) [down](m) [and make yourself comfortable](m).', mn: 'Та заавал сууж, тухлаарай.' },
      ],
    },
    {
      title: 'Fronting — тусагдахуун, complement, нөхцөлийг эхэнд гаргах',
      description: 'Өмнөх яриатай холбох эсвэл хоёр зүйлийг эсрэгцүүлэхийн тулд ердийн үед үйл үгийн ард байдаг гишүүнийг өгүүлбэрийн эхэнд гаргана. Эзэн + үйл үгийн дараалал ХЭВЭЭР — inversion болохгүй. Асуух үгтэй гишүүн өгүүлбэрийг ч ингэж урагшлуулж болно.',
      examples: [
        { en: '[This question](o) [we](s) [will return to](v) [later](m).', mn: 'Энэ асуулт руу бид дараа эргэж орно.' },
        { en: '[Why he resigned](o) [I](s) [really don\'t know](v).', mn: 'Тэр яагаад ажлаасаа гарсныг би үнэхээр мэдэхгүй.' },
        { en: '[With great care](m) [she](s) [opened](v) [the letter](o).', mn: 'Маш болгоомжтойгоор тэр захидлыг нээв.' },
      ],
    },
    {
      title: 'Тэмдэг нэр / дайвар үг + as / though — урагшлуулсан буулт',
      description: 'Although it may seem strange-ийн оронд тэмдэг нэрийг эхэнд гаргаж Strange as it may seem гэнэ: «хэдий … ч». Үйл үгтэй бол Try as he might, Much as I admire him. Эхэнд although тавихгүй. Бичгийн болон илтгэлийн хэлэнд түгээмэл; C1-ийн 12-р дүрэмд дахин үзнэ.',
      examples: [
        { en: '[Strange as it may seem](m), [I](s) [enjoy](v) [working at night](o).', mn: 'Хэдий хачирхалтай санагдаж болох ч би шөнө ажиллах дуртай.' },
        { en: '[Hard though we tried](m), [we](s) [couldn\'t persuade](v) [her](o).', mn: 'Бид хэчнээн хичээсэн ч түүнийг ятгаж чадсангүй.' },
        { en: '[Much as I admire him](m), [I](s) [can\'t support](v) [this decision](o).', mn: 'Би түүнийг хэчнээн биширдэг ч энэ шийдвэрийг дэмжиж чадахгүй.' },
      ],
    },
    {
      title: 'So / such болон газрын нөхцөл урд гарахад — inversion',
      description: 'So + тэмдэг нэр / дайвар үг, эсвэл Such-ийг эхэнд гаргавал туслах үйл үг (be / do / did) эзнийхээ өмнө орно: So tired was he that… Газар, чиглэлийн нөхцөл (on the hill, here, there, out of…) эхэнд гарч, үйл үг нь байрлал, хөдөлгөөн заасан (stand, lie, sit, hang, come, go) бол үндсэн үйл үг өөрөө эзнийхээ өмнө орно — do туслахгүй. Эзэн нь төлөөний үг бол inversion болохгүй.',
      examples: [
        { en: '[So tired](o) [was](v) [he](s) [that he fell asleep at his desk](m).', mn: 'Тэр тийм их ядарсан байсан тул ширээн дээрээ унтчихжээ.' },
        { en: '[Such](o) [was](v) [the force of the wind](s) [that several trees came down](m).', mn: 'Салхины хүч тийм их байсан тул хэд хэдэн мод унав.' },
        { en: '[Here](m) [comes](v) [the bus](s)! [Out of the fog](m) [appeared](v) [a tall figure](s).', mn: 'Автобус ирж явна! Манан дундаас нэгэн өндөр дүрс гарч ирэв.' },
      ],
    },
    {
      title: 'Cleft-ийн ахисан хэлбэр — All I did was… / The reason why … is that…',
      description: 'B2-ийн What … is бүтцийн төрөл төрөгсөд. All (that) … is / was = «ердөө л, зөвхөн» гэсэн хязгаарласан онцлол; do-ийн дараа V1 ирнэ (All I did was ask). The reason why … is that… шалтгааныг, The thing that … is… нэг зүйлийг онцолно.',
      examples: [
        { en: '[All I want](s) [is](v) [a quiet weekend](o).', mn: 'Миний хүсэж байгаа зүйл бол ердөө л нам гүм амралтын өдрүүд.' },
        { en: '[The reason why I\'m calling](s) [is](v) [that the meeting has been moved](o).', mn: 'Миний залгаж байгаа шалтгаан нь хурал хойшилсон явдал юм.' },
        { en: '[The thing that surprised me most](s) [was](v) [how calm he was](o).', mn: 'Намайг хамгийн их гайхшруулсан зүйл бол түүний хэр тайван байсан нь юм.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Emphatic do',
      structure: 'subject + do / does / did + V1 · Do + V1 (эелдэг тушаал)',
      examples: [
        { en: '[I](s) [do apologise](v) [for the delay](m).', mn: 'Саатсанд би чин сэтгэлээсээ уучлал гуйж байна.' },
        { en: '[He](s) [does know](v) [the answer](o); [he](s) [is](v) [just shy](o).', mn: 'Тэр хариултыг үнэхээр мэддэг; зүгээр л ичимхий юм.' },
        { en: '[We](s) [did warn](v) [them](o) [about the risks](m).', mn: 'Бид тэдэнд эрсдэлийн талаар үнэхээр анхааруулсан шүү дээ.' },
      ],
    },
    {
      label: 'Fronting — inversion-гүй',
      structure: 'Object / Complement / Adverbial + subject + verb',
      examples: [
        { en: '[Some things](o) [you](s) [never forget](v).', mn: 'Зарим зүйлийг хүн хэзээ ч мартдаггүй.' },
        { en: '[Most of the data](o) [we](s) [collected](v) [ourselves](m).', mn: 'Өгөгдлийн ихэнхийг бид өөрсдөө цуглуулсан.' },
        { en: '[Tired](o) [she](s) [certainly was](v), [but](m) [she](s) [kept going](v).', mn: 'Ядарсан нь ядарсан байсан ч тэр зогссонгүй.' },
      ],
    },
    {
      label: 'Fronting — inversion-тэй',
      structure: 'So + adj + be + subject + that … · So + adverb + do / did + subject + V1 + that … · Such + be + subject (+ that …) · Place adverbial + verb + noun subject',
      examples: [
        { en: '[So serious](o) [was](v) [the damage](s) [that the bridge had to be closed](m).', mn: 'Эвдрэл тийм ноцтой байсан тул гүүрийг хаахаас өөр аргагүй болсон.' },
        { en: '[So quickly](m) [did](v) [the news](s) [spread](v) [that the phones never stopped ringing](m).', mn: 'Мэдээ тийм хурдан тарсан тул утас тасралтгүй дуугарч байв.' },
        { en: '[Next to the door](m) [hung](v) [a large mirror](s).', mn: 'Хаалганы хажууд том толь өлгөөтэй байв.' },
      ],
    },
    {
      label: 'All / The reason why / The thing that — cleft',
      structure: 'All (that) + subject + verb + be + noun / V1 · The reason why + clause + be + that + clause · The thing that + clause + be + …',
      examples: [
        { en: '[All you need to do](s) [is](v) [sign here](o).', mn: 'Таны хийх ёстой зүйл бол ердөө л энд гарын үсэг зурах.' },
        { en: '[The reason why prices rose](s) [was](v) [that fuel became more expensive](o).', mn: 'Үнэ өссөн шалтгаан нь шатахуун үнэтэй болсон явдал байв.' },
        { en: '[The thing that matters](s) [is](v) [that everyone is safe](o).', mn: 'Гол зүйл бол бүгд аюулгүй байгаа явдал.' },
      ],
    },
  ],
  signalWords: ['do / does / did + V1', 'That I …', 'So … that', 'Such was …', 'Here comes …', 'There goes …', 'On the … stood …', 'strange as it may seem', 'try as I might', 'All I did was …', 'The reason why … is that …', 'The thing that …'],
  notes: [
    'Emphatic do-ийн ард үргэлж V1: She did went (буруу) → She did go (зөв). be, modal, have got-той хэрэглэхгүй — тэдгээрийг өөрсдийг нь өргөлттэй хэлнэ: I AM listening. I CAN swim.',
    'Тусагдахуун, complement-ийг урагшлуулахад inversion болохгүй: That can\'t I accept (буруу) → That I can\'t accept (зөв). Inversion зөвхөн сөрөг нөхцөл (C1-ийн 1-р дүрэм), so / such, газрын нөхцөлийн дараа үүснэ.',
    'Газрын нөхцөлийн inversion-д do туслахгүй, үргэлжилсэн цаг ч ховор: On the hill did stand a castle (буруу) → On the hill stood a castle. Үйл үг нь байрлал, хөдөлгөөн заасан байна (stand, sit, lie, hang, come, go, appear).',
    'Эзэн нь төлөөний үг бол inversion болохгүй: Here comes it (буруу) → Here it comes. Here comes the bus, гэхдээ Here it comes. There goes our train, гэхдээ There it goes.',
    'All I did was-ийн ард V1 (to-той байж болно): All I did was ask / to ask. asked, asking гэж болохгүй. All-ийн ард what тавихгүй: All what I did (буруу) → All (that) I did.',
    'Хэв маяг: emphatic do, Here comes…, All I did was… нь өдөр тутмын ярианд хэвийн. So tired was he…, Such was…, On the hill stood… нь уран зохиол, илтгэл, албан бичгийн өнгөтэй — энгийн ярианд хэтрүүлбэл хиймэл сонсогдоно. The reason why … is because… ярианд сонсогддог ч албан бичигт is that хэрэглэ.',
  ],
  commonMistakes: [
    {
      wrong: 'I did went to the meeting.',
      correct: 'I did go to the meeting.',
      explanation: 'Emphatic did нь өнгөрсөн цагийг аль хэдийн үзүүлж байгаа тул үндсэн үйл үг V1 (go) байна. Асуух, үгүйсгэх өгүүлбэрийн did-тэй яг адил.',
    },
    {
      wrong: 'Here comes it.',
      correct: 'Here it comes.',
      explanation: 'Here / There-ийн дараах inversion зөвхөн нэр үгэн эзэнтэй үед болно (Here comes the bus). Эзэн нь төлөөний үг бол ердийн дараалал: Here it comes.',
    },
    {
      wrong: 'So tired he was that he fell asleep.',
      correct: 'So tired was he that he fell asleep.',
      explanation: 'So + тэмдэг нэрийг өгүүлбэрийн эхэнд гаргавал inversion заавал: be нь эзнийхээ өмнө орно. Ердийн дарааллаар бол He was so tired that he fell asleep.',
    },
    {
      wrong: 'All I did was asked a question.',
      correct: 'All I did was ask a question.',
      explanation: 'All I did was-ийн ард үйл үг V1 хэлбэртэй (ask / to ask). Өнгөрсөн цагийг did, was хоёр аль хэдийн үзүүлсэн.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монгол хэлэнд үгийн дараалал харьцангуй чөлөөтэй, онцлолыг «л», «ч», «бол», «шүү дээ» зэрэг сул үг болон аялгаар илэрхийлдэг: «Үүнийг л би зөвшөөрөхгүй». Англи хэлний дараалал хатуу (S + V + O) тул гишүүнийг эхэнд гаргах нь өөрөө хүчтэй онцлол болдог: That I can\'t accept.',
      'Монголоор «үнэхээр», «шүү дээ», «-сан шүү» (би илгээсэн шүү дээ) гэж баталдаг бол англиар do / does / did нэмдэг: I did send it. «Үнэхээр» гэж бодогдвол really-гээс гадна emphatic do-г санаарай.',
      'Монголоор газрын нөхцөл өгүүлбэрийн эхэнд ирэх нь хэвийн дараалал: «Толгод дээр хуучин цайз байв». Англиар On the hill stood an old castle гэвэл уран зохиолын өнгөтэй тусгай бүтэц бөгөөд үйл үг эзнийхээ өмнө орно. Өдөр тутмын хэлэнд There was an old castle on the hill.',
      'Монголоор «миний хийсэн зүйл гэвэл ердөө л…», «…-ийн шалтгаан нь … юм» гэсэн бүтэц All I did was…, The reason why … is that…-тэй бараг үг үсгээр таардаг. «Хэдий хачирхалтай санагдаж болох ч» = Strange as it may seem — монголоор «хэдий … ч» эхэнд ирдэг бол англиар тэмдэг нэр нь өөрөө эхэнд гарна.',
    ],
  },
  dialogue: [
    {
      en: 'Nomin, [you](s) [never sent](v) [me](o) [the sales report](o).',
      mn: 'Номин, чи надад борлуулалтын тайланг огт илгээгээгүй.',
      speaker: 'Temuulen',
    },
    {
      en: '[I](s) [did send](v) [it](o) — [on Friday](m). [All you need to do](s) [is](v) [check your spam folder](o).',
      mn: 'Би үнэхээр илгээсэн шүү дээ — баасан гарагт. Чиний хийх зүйл бол ердөө л спам хавтсаа шалгах.',
      speaker: 'Nomin',
    },
    {
      en: 'Ah, [here](m) [it](s) [is](v). Sorry! [The figures](o) [I](s) [understand](v), [but](m) [the conclusion](o) [I](s) [don\'t](v).',
      mn: 'Аа, энд байна. Уучлаарай! Тоонуудыг нь би ойлгож байна, харин дүгнэлтийг нь ойлгохгүй байна.',
      speaker: 'Temuulen',
    },
    {
      en: '[Strange as it may sound](m), [the reason why sales fell](s) [is](v) [that our prices were too low](o).',
      mn: 'Хэдий хачирхалтай сонсогдож болох ч борлуулалт буурсан шалтгаан нь манай үнэ хэт бага байсан явдал юм.',
      speaker: 'Nomin',
    },
    {
      en: 'Too low? [That](o) [I](s) [didn\'t expect](v)!',
      mn: 'Хэт бага уу? Үүнийг л би төсөөлсөнгүй!',
      speaker: 'Temuulen',
    },
    {
      en: '[So cheap](o) [was](v) [the product](s) [that customers doubted its quality](m). [It](s) [does happen](v), believe me.',
      mn: 'Бүтээгдэхүүн тийм хямд байсан тул хэрэглэгчид чанарт нь эргэлзсэн. Ийм юм үнэхээр тохиолддог, надад итгэ.',
      speaker: 'Nomin',
    },
  ],
  quiz: [
    {
      id: 'c1-11-1',
      ruleId: 11,
      kind: 'fill',
      question: 'So ___ that nobody dared to speak.',
      options: ['angry was the manager', 'angry the manager was', 'the manager was angry', 'angry did the manager'],
      answer: 'angry was the manager',
      explanation: 'So + тэмдэг нэр өгүүлбэрийн эхэнд гарвал inversion заавал: So + adj + be + subject + that… be үйл үгтэй тул did хэрэггүй, was нь эзнийхээ өмнө орно.',
      hint: 'So эхэнд гарвал be эзнийхээ өмнө.',
    },
    {
      id: 'c1-11-2',
      ruleId: 11,
      kind: 'fill',
      question: 'I know you think I forgot, but I ___ lock the door before we left.',
      options: ['did', 'do', 'was', 'had'],
      answer: 'did',
      explanation: 'Өнгөрсөн үйлдлийг «үнэхээр түгжсэн шүү дээ» гэж баталж байна — emphatic did + V1 (lock). do одоо цаг тул before we left-тэй таарахгүй; was, had-ийн ард V1 ирэхгүй.',
      hint: 'Өнгөрсөн цагт «үнэхээр тэгсэн» гэж батлах.',
    },
    {
      id: 'c1-11-3',
      ruleId: 11,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Here comes it.',
        'On the hill did stand a castle.',
        'All she did was complained about the food.',
        'Strange as it may seem, I have never been abroad.',
      ],
      answer: 'Strange as it may seem, I have never been abroad.',
      explanation: 'Тэмдэг нэр + as + эзэн + үйл үг — зөв буулт бүтэц. Төлөөний үгтэй бол Here it comes; газрын нөхцөлийн inversion-д did хэрэглэхгүй (stood a castle); All she did was-ийн ард V1 (complain).',
      hint: 'Төлөөний үг, did, V1 гурвыг шалга.',
    },
    {
      id: 'c1-11-4',
      ruleId: 11,
      kind: 'translate',
      question: 'Миний хийсэн зүйл гэвэл ердөө л асуулт асуусан.',
      options: [
        'All I did was ask a question.',
        'All I did was asked a question.',
        'All what I did was ask a question.',
        'All I did it was ask a question.',
      ],
      answer: 'All I did was ask a question.',
      explanation: 'All (that) I did + was + V1. was-ийн ард asked биш ask; All-ийн ард what тавихгүй; илүүдэл it хэрэггүй.',
      hint: 'All I did was + V1.',
    },
  ],
};
