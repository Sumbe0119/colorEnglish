// frontend/src/lib/grammar/b2/rule-12.ts
// B2 дүрэм 12: as if / as though / suppose / what if
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule12: GrammarRule = {
  id: 12,
  title: 'as if / as though / suppose / what if',
  titleMn: 'as if / as though / suppose / what if — «юм шиг», «гэж бодъё», «…бол яах вэ»',
  hook: '«Тэр бүхнийг мэддэг юм шиг ярьдаг», «Сугалаа хожлоо гэж бодъё», «Бид хоцорвол яах вэ?» — төсөөлөл, таамаг, бодит бус харьцуулалтыг илэрхийлж сурцгаая.',
  summary: 'as if / as though («юм шиг») + одоо цаг нь үнэн байж магадгүй сэтгэгдэл (It looks as if it\'s going to rain), + Past Simple нь одоогийн бодит бус харьцуулалт (He talks as if he knew everything — мэддэггүй), + Past Perfect нь өнгөрсний бодит бус харьцуулалт. suppose / supposing / imagine / what if + Present нь бодитой боломж, + Past Simple нь төсөөлөл, + Past Perfect нь өнгөрсөнд өөрөөр болсон бол гэсэн таамаг.',
  description: 'B1-ийн 5, 6-р дүрэмд бид бодит бус нөхцөл (If I had …, I would …; If I had known, I would have …), 15-р дүрэмд wish / if only-г үзэж, англи хэл «бодит бус» утгыг цагийг нэг алхам ухраах замаар илэрхийлдгийг мэдсэн. B2-ийн 3-р дүрэмд энэ санааг mixed conditionals-аар өргөтгөсөн. Энэ дүрэмд яг тэр «цагийн ухралт» дахин хоёр бүлэг хэллэгт гарч ирнэ. НЭГДҮГЭЭРТ, as if / as though — «юм шиг». Хэрэв тухайн зүйл үнэн байж магадгүй бол ердийн цаг хэрэглэнэ: You look as if you need a rest (чи үнэхээр амрах хэрэгтэй байж магадгүй). Хэрэв үнэн биш гэдгийг мэдэж байвал цагийг ухраана: He treats me as if I were a child (би хүүхэд биш). Өнгөрсөн бодит бус зүйлд Past Perfect: She looked as if she had seen a ghost (сүнс хараагүй). look, sound, feel, seem, smell, taste үйл үгийн ард as if маш түгээмэл. as though нь as if-тэй яг адил утгатай. Ярианд like хэрэглэдэг ч (It looks like it\'s going to rain) албан бичигт as if / as though илүү тохирно. ХОЁРДУГААРТ, suppose / supposing / imagine / what if — «гэж бодъё», «…бол яах вэ». Эдгээр нь if-ийн үүргийг гүйцэтгэж, төсөөллийн нөхцөл тавьдаг. Present Simple-тэй бол бодитой боломж, санал (What if we take a taxi?), Past Simple-тэй бол бодит бус эсвэл магадлал багатай төсөөлөл (Suppose you lost your job, what would you do?), Past Perfect-тэй бол өнгөрсөнд өөрөөр болсон бол (What if you had missed the train?). Монголоор «юм шиг», «мэт», «гэж бодъё», «гэж төсөөл дөө», «-вал яах вэ», «-сан бол яах байсан бэ» гэсэн хэлбэрүүд эдгээр утгыг ялгадаг.',
  structure: 'subject + verb + as if / as though + Present (үнэн байж магадгүй) / Past Simple (одоо, бодит бус) / Past Perfect (өнгөрсөн, бодит бус) · Suppose / Supposing / Imagine / What if + Present / Past Simple / Past Perfect',
  structureParts: [
    { text: 'He', part: 'subject' },
    { text: 'talks', part: 'verb' },
    { text: 'as if / as though', part: 'modifier' },
    { text: 'he knew …', part: 'plain' },
    { text: '· Suppose / What if + clause', part: 'modifier' },
  ],
  tip: 'as if + одоо цаг = үнэн байж магадгүй · as if + Past Simple = одоо үнэн биш · as if + Past Perfect = өнгөрсөнд үнэн биш · what if / suppose + Present = бодитой боломж · + Past Simple = төсөөлөл · + Past Perfect = өнгөрсөнд өөрөөр болсон бол.',
  examples: [
    { en: '[It](s) [looks](v) [as if it\'s going to snow](m).', mn: 'Цас орох гэж байгаа юм шиг харагдаж байна. (үнэхээр орж магадгүй)' },
    { en: '[He](s) [talks](v) [as if he knew everything](m).', mn: 'Тэр бүхнийг мэддэг юм шиг ярьдаг. (мэддэггүй)' },
    { en: '[Suppose you lost your phone](m), [what](o) [would](v) [you](s) [do](v)?', mn: 'Чи утсаа гээчихлээ гэж бодъё, тэгвэл яах вэ?' },
    { en: '[What if](m) [we](s) [had missed](v) [the last train](o)?', mn: 'Бид сүүлчийн галт тэрэгнээс хоцорсон бол яах байсан бэ?' },
  ],
  useCases: [
    {
      title: 'as if / as though + одоо цаг — үнэн байж магадгүй сэтгэгдэл',
      description: 'Харж, сонсож, мэдэрч буй зүйлээсээ дүгнэлт хийж байгаа бөгөөд тэр нь үнэн байж болох үед цагийг ухраахгүй. look, sound, feel, seem, smell, taste-ийн ард түгээмэл. Үндсэн үйл үг өнгөрсөн цагт байвал ард нь мөн өнгөрсөн цаг ирнэ.',
      examples: [
        { en: '[You](s) [look](v) [as if you need a good night\'s sleep](m).', mn: 'Чи сайн унтаж амрах хэрэгтэй юм шиг харагдаж байна.' },
        { en: '[It](s) [sounds](v) [as though they\'re having a party](m) [next door](m).', mn: 'Хажуу айлд үдэшлэг болж байгаа юм шиг сонсогдож байна.' },
        { en: '[It](s) [looked](v) [as if nobody was at home](m).', mn: 'Гэрт хэн ч байхгүй юм шиг харагдаж байсан.' },
      ],
    },
    {
      title: 'as if / as though + Past Simple — одоогийн бодит бус харьцуулалт',
      description: 'Үнэн биш гэдгийг мэдэж байгаа, эсвэл тун эргэлзэж байгаа үед Past Simple хэрэглэнэ — одоогийн тухай ярьж байгаа ч гэсэн. be үйл үг албан хэллэгт бүх биед were. Ихэвчлэн шүүмжлэл, ёжлолын өнгөтэй.',
      examples: [
        { en: '[She](s) [spends](v) [money](o) [as if she were a millionaire](m).', mn: 'Тэр саятан юм шиг мөнгө үрдэг. (саятан биш)' },
        { en: '[He](s) [behaves](v) [as though he owned the place](m).', mn: 'Тэр энэ газрын эзэн юм шиг аашилдаг.' },
        { en: '[They](s) [treat](v) [me](o) [as if I didn\'t exist](m).', mn: 'Тэд намайг байхгүй юм шиг харьцдаг.' },
      ],
    },
    {
      title: 'as if / as though + Past Perfect — өнгөрсний бодит бус харьцуулалт',
      description: 'Үндсэн үйлдлээс өмнө болсон мэт, гэвч бодитоор болоогүй зүйлтэй харьцуулахад Past Perfect хэрэглэнэ. B1-ийн Third conditional, wish + Past Perfect-тэй адил логик.',
      examples: [
        { en: '[She](s) [looked](v) [as if she had seen a ghost](m).', mn: 'Тэр сүнс харсан юм шиг харагдаж байсан.' },
        { en: '[He](s) [talks](v) [about Paris](m) [as though he had lived there](m).', mn: 'Тэр Парист амьдарч байсан юм шиг ярьдаг. (амьдарч байгаагүй)' },
        { en: '[I](s) [felt](v) [as if I hadn\'t slept](m) [for days](m).', mn: 'Би хэдэн өдөр унтаагүй юм шиг санагдсан.' },
      ],
    },
    {
      title: 'suppose / supposing / what if + Present — бодитой боломж, санал',
      description: 'Үнэхээр болж магадгүй зүйлийн тухай асуух, санаа зовох, эсвэл санал дэвшүүлэхэд Present Simple хэрэглэнэ. First conditional-ын if-тэй адил тул ард нь will хэрэглэхгүй.',
      examples: [
        { en: '[What if](m) [it](s) [rains](v) [on the day of the wedding](m)?', mn: 'Хуримын өдөр бороо орвол яах вэ?' },
        { en: '[Suppose](m) [we](s) [meet](v) [at six](m) [instead](m)?', mn: 'Оронд нь зургаан цагт уулзвал ямар вэ?' },
        { en: '[Supposing he doesn\'t agree](m), [what](o) [will](v) [we](s) [do](v)?', mn: 'Тэр зөвшөөрөхгүй бол бид яах вэ?' },
      ],
    },
    {
      title: 'suppose / imagine / what if + Past Simple / Past Perfect — төсөөлөл',
      description: 'Past Simple: одоо эсвэл ирээдүйн бодит бус, магадлал багатай төсөөлөл (үр дүнд would). Past Perfect: өнгөрсөнд өөрөөр болсон бол (үр дүнд would have). Second, Third conditional-ын if-ийн хэсгийг орлоно.',
      examples: [
        { en: '[Imagine you could live anywhere](m). [Where](m) [would](v) [you](s) [go](v)?', mn: 'Чи хаана ч амьдарч болно гэж төсөөл дөө. Хаашаа явах вэ?' },
        { en: '[Suppose someone offered you the job](m), [would](v) [you](s) [accept](v) [it](o)?', mn: 'Хэн нэгэн чамд тэр ажлыг санал болголоо гэж бодъё, чи зөвшөөрөх үү?' },
        { en: '[What if](m) [you](s) [hadn\'t passed](v) [the exam](o)?', mn: 'Чи шалгалтаа даваагүй бол яах байсан бэ?' },
      ],
    },
  ],
  forms: [
    {
      label: 'as if / as though + одоо цаг (бодитой)',
      structure: 'look / sound / feel / seem + as if / as though + Present Simple / Continuous / be going to',
      examples: [
        { en: '[It](s) [feels](v) [as if winter has already arrived](m).', mn: 'Өвөл аль хэдийн ирчихсэн юм шиг санагдаж байна.' },
        { en: '[She](s) [sounds](v) [as though she has a cold](m).', mn: 'Тэр ханиадтай юм шиг сонсогдож байна.' },
        { en: '[It](s) [seems](v) [as if they aren\'t coming](m).', mn: 'Тэд ирэхгүй юм шиг байна.' },
      ],
    },
    {
      label: 'as if / as though + Past Simple / Past Perfect (бодит бус)',
      structure: 'verb + as if / as though + V2 / were (одоо) · had + V3 (өнгөрсөн)',
      examples: [
        { en: '[He](s) [drives](v) [as if he were the only person on the road](m).', mn: 'Тэр зам дээр ганцаараа яваа юм шиг жолооддог.' },
        { en: '[She](s) [acted](v) [as though nothing had happened](m).', mn: 'Тэр юу ч болоогүй юм шиг аашилсан.' },
        { en: '[You](s) [talk](v) [as if it were my fault](m).', mn: 'Чи миний буруу юм шиг ярьж байна.' },
      ],
    },
    {
      label: 'suppose / supposing / imagine',
      structure: 'Suppose / Supposing / Imagine + Present (бодитой) / Past Simple (төсөөлөл) / Past Perfect (өнгөрсөн)',
      examples: [
        { en: '[Suppose the shop is closed](m). [What](o) [will](v) [we](s) [eat](v)?', mn: 'Дэлгүүр хаалттай байлаа гэж бодъё. Бид юу идэх вэ?' },
        { en: '[Supposing you had a year off](m), [how](m) [would](v) [you](s) [spend](v) [it](o)?', mn: 'Чамд нэг жилийн чөлөө байлаа гэж бодъё, чи үүнийг яаж өнгөрөөх вэ?' },
        { en: '[Imagine we had never met](m)!', mn: 'Бид хэзээ ч уулзаагүй байсан гэж төсөөл дөө!' },
      ],
    },
    {
      label: 'what if',
      structure: 'What if + Present (боломж, санал) / Past Simple (төсөөлөл) / Past Perfect (өнгөрсөн)?',
      examples: [
        { en: '[What if](m) [the car](s) [breaks down](v) [on the way](m)?', mn: 'Машин замд эвдэрвэл яах вэ?' },
        { en: '[What if](m) [you](s) [were](v) [in my position](o)?', mn: 'Чи миний оронд байсан бол яах вэ?' },
        { en: '[What if](m) [she](s) [had said](v) [no](o)?', mn: 'Тэр үгүй гэж хэлсэн бол яах байсан бэ?' },
      ],
    },
  ],
  signalWords: ['as if', 'as though', 'look as if', 'sound as though', 'feel as if', 'suppose', 'supposing', 'imagine', 'what if', 'as if I were'],
  notes: [
    'as if ба as though яг адил утгатай, чөлөөтэй сольж болно. as though арай албан ёсны, бичгийн хэлэнд илүү тааралдана.',
    'as if-ийн ардах Past Simple нь цагийг биш, «бодит бус»-ыг заана: He talks as if he knew … — одоо ярьж байна, одоо мэддэггүй. Яг wish + Past Simple, Second conditional шиг.',
    'Албан хэллэгт as if I / he / she / it were. Ярианд was ч сонсогдоно (as if he was the boss), гэхдээ шалгалт, албан бичигт were хэрэглээрэй.',
    'Ярианд as if-ийн оронд like хэрэглэдэг: It looks like it\'s going to rain. Харин нэр үгийн өмнө зөвхөн like: She looks like her mother (as if her mother биш). as if-ийн ард заавал бүтэн өгүүлбэр ирнэ.',
    'suppose / supposing / what if-ийн ард will, would хэрэглэхгүй — if-ийн хэсэгтэй адил дүрэм: What if it will rain (буруу) → What if it rains. Suppose you would win (буруу) → Suppose you won.',
    'I suppose (so) = «тийм байх гэж бодож байна» ба be supposed to = «-х ёстой, -х учиртай» нь өөр хэллэгүүд. Энэ дүрмийн Suppose нь өгүүлбэрийн эхэнд «гэж бодъё» утгаар ирнэ.',
  ],
  commonMistakes: [
    {
      wrong: 'He talks as he knew everything.',
      correct: 'He talks as if he knew everything.',
      explanation: '«Юм шиг» гэсэн утгад as ганцаараа хүрэлцэхгүй — as if / as though хэрэгтэй. as дангаараа «-х үед», «учраас», «шиг (яг тэр үүргээр)» гэсэн өөр утгатай.',
    },
    {
      wrong: 'What if we will miss the flight?',
      correct: 'What if we miss the flight?',
      explanation: 'what if-ийн ард if-ийн хэсэгтэй адил will хэрэглэхгүй. Ирээдүйн бодитой боломжид Present Simple. Монголоор «хоцорвол» ирээдүйн утгатай тул will нэмэх алдаа гардаг.',
    },
    {
      wrong: 'She looked as if she saw a ghost.',
      correct: 'She looked as if she had seen a ghost.',
      explanation: 'Сүнс «харсан» нь looked-оос өмнө болсон мэт төсөөлөгдөж буй бодит бус үйлдэл тул Past Perfect (had seen). Past Simple бол тэр үед яг харж байгаа гэсэн утга болно.',
    },
    {
      wrong: 'Suppose you would win a million dollars, what would you do?',
      correct: 'Suppose you won a million dollars, what would you do?',
      explanation: 'suppose нь if-ийг орлож байгаа тул ард нь would биш, Past Simple (won). would зөвхөн үр дүнгийн хэсэгт (what would you do).',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «юм шиг», «мэт», «аятай» гэсэн үгс as if / as though-ийн утгыг өгнө. Гэхдээ монголоор «мэддэг юм шиг» гэхэд үнэн эсэх нь үйл үгийн хэлбэрт нөлөөлдөггүй, контекстээс ойлгогддог. Англиар үнэн биш бол цагийг ухраана (as if he knew), үнэн байж магадгүй бол ухраахгүй (as if he knows).',
      'Монголоор «харсан юм шиг» (өмнө нь болсон мэт) ба «хардаг юм шиг» (одоо мэт) гэж үйлт нэрийн хэлбэрээр цагийг ялгадаг нь англи хэлний Past Perfect / Past Simple-ийн ялгаатай таардаг: as if she had seen / as if she saw.',
      'Монголоор «гэж бодъё», «гэж төсөөл дөө» нь өгүүлбэрийн ТӨГСГӨЛД ирдэг бол англиар Suppose / Imagine өгүүлбэрийн ЭХЭНД ирнэ: «Чи ажилгүй боллоо гэж бодъё» = Suppose you lost your job.',
      'Монголоор «-вал яах вэ» (хоцорвол яах вэ) = What if + Present, «-сан бол яах байсан бэ» (хоцорсон бол яах байсан бэ) = What if + Past Perfect. Монгол хэлбэр нь бодитой боломж ба өнгөрсний төсөөллийг тодорхой ялгадаг тул орчуулгаасаа цагаа сонгож болно.',
    ],
  },
  dialogue: [
    {
      en: 'Tuya, [you](s) [look](v) [as if you haven\'t slept](m) [all night](m).',
      mn: 'Туяа, чи шөнөжин унтаагүй юм шиг харагдаж байна.',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [haven\'t](v). [I](s) [have](v) [a job interview](o) [tomorrow](m). [What if](m) [they](s) [ask](v) [me](o) [something I can\'t answer](o)?',
      mn: 'Унтаагүй ээ. Маргааш ажлын ярилцлагатай. Тэд миний хариулж чадахгүй зүйл асуувал яах вэ?',
      speaker: 'Tuya',
    },
    {
      en: '[You](s)[\'re talking](v) [as though you had no experience at all](m). [You](s)[\'ve worked](v) [in sales](m) [for five years](m)!',
      mn: 'Чи огт туршлагагүй юм шиг ярьж байна. Чи борлуулалтад таван жил ажилласан шүү дээ!',
      speaker: 'Bat',
    },
    {
      en: 'I know, [but](m) [suppose they wanted someone younger](m). [What](o) [would](v) [I](s) [say](v)?',
      mn: 'Мэднэ ээ, гэхдээ тэд илүү залуу хүн хүсэж байлаа гэж бодъё. Би юу гэж хэлэх вэ?',
      speaker: 'Tuya',
    },
    {
      en: '[Imagine you were the manager](m). [Would](v) [you](s) [turn down](v) [someone with your skills](o)?',
      mn: 'Чи өөрөө менежер нь байлаа гэж төсөөл дөө. Чам шиг ур чадвартай хүнээс татгалзах уу?',
      speaker: 'Bat',
    },
    {
      en: 'Probably not. Thanks, Bat. [I](s) [feel](v) [as if a weight has been lifted](m).',
      mn: 'Татгалзахгүй байх аа. Баярлалаа, Бат. Мөрөн дээрээс ачаа буусан юм шиг санагдаж байна.',
      speaker: 'Tuya',
    },
  ],
  quiz: [
    {
      id: 'b2-12-1',
      ruleId: 12,
      kind: 'fill',
      question: 'He isn\'t the manager, but he behaves as if he ___ the whole company.',
      options: ['owned', 'will own', 'has owned', 'would own'],
      answer: 'owned',
      explanation: 'Тэр компанийн эзэн биш (He isn\'t the manager) — одоогийн бодит бус харьцуулалт тул as if + Past Simple: owned. as if-ийн ард will / would хэрэглэхгүй, has owned бодит бус утгыг илэрхийлэхгүй.',
      hint: 'Одоо үнэн биш = цагийг нэг алхам ухраа.',
    },
    {
      id: 'b2-12-2',
      ruleId: 12,
      kind: 'fill',
      question: 'When she walked in, she looked as though she ___ a ghost. Her face was completely white.',
      options: ['sees', 'has seen', 'had seen', 'would see'],
      answer: 'had seen',
      explanation: 'looked (өнгөрсөн)-оос өмнө болсон мэт бодит бус үйлдэл — as though + Past Perfect: had seen. Үндсэн үйл үг өнгөрсөн цагт байгаа тул sees, has seen тохирохгүй; would as though-ийн ард ирэхгүй.',
      hint: 'Өнгөрсөн үйлдлээс өмнөх бодит бус зүйл.',
    },
    {
      id: 'b2-12-3',
      ruleId: 12,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Suppose you won the lottery, what would you do?',
        'Suppose you would win the lottery, what will you do?',
        'What if we will miss the last bus?',
        'It looks like as if it is going to rain.',
      ],
      answer: 'Suppose you won the lottery, what would you do?',
      explanation: 'Төсөөлөл: Suppose + Past Simple, үр дүнд would — зөв. suppose / what if-ийн ард would, will хэрэглэхгүй; like ба as if хоёрыг давхар хэрэглэхгүй (It looks as if …).',
      hint: 'Suppose нь if-ийн оронд — ард нь would байхгүй.',
    },
    {
      id: 'b2-12-4',
      ruleId: 12,
      kind: 'translate',
      question: 'Тэр надтай хүүхэд юм шиг харьцдаг.',
      options: [
        'She treats me as if I were a child.',
        'She treats me as I were a child.',
        'She treats me as if I would be a child.',
        'She treats me like if I am a child.',
      ],
      answer: 'She treats me as if I were a child.',
      explanation: '«Юм шиг» = as if. Би хүүхэд биш — одоогийн бодит бус харьцуулалт тул Past Simple, be нь were. as ганцаараа болохгүй, as if-ийн ард would ирэхгүй, like if гэсэн хэллэг байхгүй.',
      hint: '«Юм шиг» + үнэн биш = as if + were.',
    },
  ],
};
