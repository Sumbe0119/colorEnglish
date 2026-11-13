// frontend/src/lib/grammar/b2/rule-07.ts
// B2 дүрэм 7: Reporting verbs
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule07: GrammarRule = {
  id: 7,
  title: 'Reporting verbs',
  titleMn: 'Reporting verbs — said-ийн оронд амлах, татгалзах, зөвлөх, буруутгах',
  hook: '«Тэр надад тусална гэж амласан», «Эмч амрахыг зөвлөсөн», «Тэр хоцорсондоо уучлалт гуйсан» — хэн нэгний үгийг said, told-оор биш, яг ямар зорилгоор хэлснийг нь харуулсан үйл үгээр дамжуулж сурцгаая.',
  summary: 'Reporting verb бүр өөрийн бүтэцтэй: (1) verb + to-infinitive — agree, offer, refuse, promise, threaten; (2) verb + object + to-infinitive — advise, warn, remind, encourage, persuade; (3) verb + -ing — suggest, deny, admit, recommend; (4) verb + preposition + -ing — apologise for, insist on, accuse sb of, blame sb for, congratulate sb on. suggest нь мөн that + өгүүлбэртэй хэрэглэгдэнэ, харин suggest + хүн + to хэзээ ч болохгүй.',
  description: 'B1-ийн 8, 9-р дүрэмд бид reported speech-ийг үзсэн: He said (that) he was tired, She told me to wait, He asked me if I was ready. Тэнд say, tell, ask гурван үйл үг л хэрэглэж, цагийг нэг алхам ухраадаг байсан. B2 түвшинд үгийг үгчлэн дамжуулахын оронд хэлсэн зүйлийн ЗОРИЛГЫГ нэг үйл үгээр хураангуйлдаг: «I\'ll help you» → He offered to help; «You should see a doctor» → She advised me to see a doctor; «I didn\'t take it» → He denied taking it; «I\'m sorry I\'m late» → He apologised for being late. Ингэхэд өгүүлбэр богиносож, цагийн ухралтын тухай бараг бодох хэрэггүй болно, учир нь үйл үгийн ард цагтай өгүүлбэр биш, infinitive эсвэл -ing орно. Хэцүү тал нь үйл үг бүр өөрийн бүтэцтэй: B1-ийн 11-р дүрэмд (gerunds & infinitives) үзсэнтэй адил аль үйл үгийн ард to, алиных нь ард -ing орохыг цээжлэх хэрэгтэй, мөн зарим нь угтвар үг (for, of, on) шаарддаг. Монгол хэлэнд бүх тохиолдолд нэг л загвар үйлчилдэг: хэлсэн агуулга + «гэж» + үйл үг («тусална гэж амласан», «битгий оч гэж сануулсан», «авсан гэж хүлээсэн»), эсвэл «-хыг зөвлөсөн», «-сандаа уучлалт гуйсан». Иймээс монгол хүн бүх үйл үгийн ард that эсвэл to тавих хандлагатай байдаг. Англиар үйл үгээ сонгохдоо бүтцийг нь хамт сонгох ёстой.',
  structure: 'verb + to V1 (promise) · verb + object + to V1 (advise) · verb + V-ing (suggest) · verb (+ object) + preposition + V-ing (apologise for, accuse sb of)',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'reporting verb', part: 'verb' },
    { text: '(object)', part: 'object' },
    { text: 'to V1 / V-ing / preposition + V-ing', part: 'modifier' },
  ],
  tip: 'Амлах, санал болгох, татгалзах → to V1 · Хэн нэгэнд зөвлөх, сануулах, ятгах → хүн + to V1 · suggest, deny, admit → V-ing · apologise FOR, insist ON, accuse sb OF → угтвар үг + V-ing.',
  examples: [
    { en: '[He](s) [offered](v) [to drive me home](o).', mn: 'Тэр намайг гэрт минь хүргэж өгье гэж санал болгосон.' },
    { en: '[The doctor](s) [advised](v) [me](o) [to get more rest](o).', mn: 'Эмч надад илүү их амрахыг зөвлөсөн.' },
    { en: '[She](s) [denied](v) [breaking the window](o).', mn: 'Тэр цонх хагалснаа үгүйсгэсэн.' },
    { en: '[He](s) [apologised](v) [for being late](m).', mn: 'Тэр хоцорсондоо уучлалт гуйсан.' },
  ],
  useCases: [
    {
      title: 'verb + to-infinitive — өөрөө хийх зүйлийн тухай',
      description: 'agree, offer, refuse, promise, threaten. Өгүүлбэрийн эзэн өөрөө хийх (эсвэл хийхгүй) үйлдлийн тухай. Үйл үгийн ард шууд to + V1, хүн орохгүй. Үгүйсгэл: not to + V1.',
      examples: [
        { en: '[She](s) [promised](v) [to call me](o) [every day](m).', mn: 'Тэр над руу өдөр бүр залгана гэж амласан.' },
        { en: '[He](s) [refused](v) [to answer the question](o).', mn: 'Тэр асуултад хариулахаас татгалзсан.' },
        { en: '[They](s) [threatened](v) [to call the police](o).', mn: 'Тэд цагдаа дуудна гэж сүрдүүлсэн.' },
      ],
    },
    {
      title: 'verb + object + to-infinitive — бусдаар хийлгэх',
      description: 'advise, warn, remind, encourage, persuade, invite. Хэн нэгэнд ямар нэг зүйл хийхийг (эсвэл хийхгүй байхыг) хэлнэ. Үйл үгийн ард заавал хүн (object), дараа нь to + V1. B1-д үзсэн told me to / asked me to-ийн өргөтгөл.',
      examples: [
        { en: '[My teacher](s) [encouraged](v) [me](o) [to apply for the scholarship](o).', mn: 'Багш маань намайг тэтгэлэгт өргөдөл гаргахыг урамшуулсан.' },
        { en: '[She](s) [warned](v) [us](o) [not to swim in the river](o).', mn: 'Тэр биднийг голд сэлж болохгүй гэж сануулсан.' },
        { en: '[He](s) [reminded](v) [me](o) [to bring my passport](o).', mn: 'Тэр надад паспортоо авчрахыг сануулсан.' },
      ],
    },
    {
      title: 'verb + -ing — suggest, deny, admit, recommend',
      description: 'Эдгээр үйл үгийн ард to биш, шууд -ing орно. deny / admit нь ихэвчлэн өмнө нь хийсэн үйлдлийн тухай (хийснээ үгүйсгэх / хүлээх), suggest / recommend нь санал, зөвлөмж. Үгүйсгэл: not + V-ing.',
      examples: [
        { en: '[Tuya](s) [suggested](v) [going to the cinema](o).', mn: 'Туяа кино үзэхээр явъя гэж санал болгосон.' },
        { en: '[He](s) [admitted](v) [taking the money](o).', mn: 'Тэр мөнгийг авснаа хүлээсэн.' },
        { en: '[The guide](s) [recommended](v) [booking in advance](o).', mn: 'Хөтөч урьдчилан захиалахыг зөвлөсөн.' },
      ],
    },
    {
      title: 'verb + preposition + -ing — угтвар үгтэй үйл үгс',
      description: 'apologise for, insist on нь шууд угтвар үгтэй; accuse sb of, blame sb for, congratulate sb on, thank sb for нь хүн + угтвар үгтэй. Угтвар үгийн ард үйл үг үргэлж -ing хэлбэртэй. Угтвар үгийг үйл үгтэй нь хамт цээжлээрэй.',
      examples: [
        { en: '[She](s) [apologised](v) [for forgetting my birthday](m).', mn: 'Тэр миний төрсөн өдрийг мартсандаа уучлалт гуйсан.' },
        { en: '[They](s) [accused](v) [him](o) [of stealing the money](m).', mn: 'Тэд түүнийг мөнгө хулгайлсан гэж буруутгасан.' },
        { en: '[Everyone](s) [congratulated](v) [her](o) [on passing the exam](m).', mn: 'Бүгд түүнд шалгалтаа давсанд нь баяр хүргэсэн.' },
      ],
    },
    {
      title: 'suggest that … — that-өгүүлбэртэй хэрэглээ',
      description: 'Хэн хийхийг тодорхой хэлэх бол suggest / recommend / insist + that + эзэн + (should) + V1. suggest-ийн ард хүн + to хэзээ ч орохгүй. Мөн promise, admit, deny, warn нь that-өгүүлбэртэй хэрэглэгдэж болно — тэгвэл B1-д үзсэн цагийн ухралт үйлчилнэ.',
      examples: [
        { en: '[He](s) [suggested](v) [that we should take a taxi](o).', mn: 'Тэр биднийг такси барих хэрэгтэй гэж санал болгосон.' },
        { en: '[The doctor](s) [recommended](v) [that I see a specialist](o).', mn: 'Эмч намайг нарийн мэргэжлийн эмчид үзүүлэхийг зөвлөсөн.' },
        { en: '[She](s) [admitted](v) [that she had made a mistake](o).', mn: 'Тэр алдаа гаргаснаа хүлээсэн.' },
      ],
    },
  ],
  forms: [
    {
      label: 'verb + to V1',
      structure: 'agree / offer / refuse / promise / threaten + (not) to + V1',
      examples: [
        { en: '[My boss](s) [agreed](v) [to give me a day off](o).', mn: 'Дарга маань надад нэг өдрийн чөлөө өгөхийг зөвшөөрсөн.' },
        { en: '[Bat](s) [offered](v) [to carry my bags](o).', mn: 'Бат миний цүнхийг үүрч өгье гэсэн.' },
        { en: '[He](s) [promised](v) [not to tell anyone](o).', mn: 'Тэр хэнд ч хэлэхгүй гэж амласан.' },
      ],
    },
    {
      label: 'verb + object + to V1',
      structure: 'advise / warn / remind / encourage / persuade / invite + object + (not) to + V1',
      examples: [
        { en: '[She](s) [persuaded](v) [her parents](o) [to buy a dog](o).', mn: 'Тэр эцэг эхээ нохой авахыг ятгасан.' },
        { en: '[The police](s) [advised](v) [people](o) [to stay at home](o).', mn: 'Цагдаа хүмүүст гэртээ байхыг зөвлөсөн.' },
        { en: '[He](s) [warned](v) [me](o) [not to trust them](o).', mn: 'Тэр надад тэдэнд бүү итгэ гэж сануулсан.' },
      ],
    },
    {
      label: 'verb + V-ing / verb + that',
      structure: 'suggest / deny / admit / recommend + (not) V-ing · suggest / recommend + that + subject + (should) + V1',
      examples: [
        { en: '[The boy](s) [denied](v) [cheating in the test](o).', mn: 'Хүү шалгалтанд хуулснаа үгүйсгэсэн.' },
        { en: '[I](s) [suggested](v) [not inviting too many people](o).', mn: 'Би хэт олон хүн урихгүй байя гэж санал болгосон.' },
        { en: '[Nomin](s) [suggested](v) [that we meet at the station](o).', mn: 'Номин биднийг буудал дээр уулзъя гэж санал болгосон.' },
      ],
    },
    {
      label: 'verb (+ object) + preposition + V-ing',
      structure: 'apologise for / insist on + V-ing · accuse sb of / blame sb for / congratulate sb on / thank sb for + V-ing',
      examples: [
        { en: '[He](s) [insisted](v) [on paying for dinner](m).', mn: 'Тэр оройн хоолны мөнгийг заавал төлнө гэж зүтгэсэн.' },
        { en: '[She](s) [blamed](v) [me](o) [for losing the keys](m).', mn: 'Тэр түлхүүр гээсэнд намайг буруутгасан.' },
        { en: '[I](s) [thanked](v) [them](o) [for helping us](m).', mn: 'Би тэдэнд бидэнд тусалсанд талархал илэрхийлсэн.' },
      ],
    },
  ],
  signalWords: ['offer to', 'refuse to', 'promise to', 'advise sb to', 'warn sb not to', 'remind sb to', 'suggest + -ing', 'deny + -ing', 'apologise for', 'accuse sb of', 'insist on', 'congratulate sb on'],
  notes: [
    'suggest-ийн ард хүн + to орохгүй: He suggested me to go (буруу) → He suggested going / He suggested that I go / He suggested that I should go (зөв). recommend мөн ихэвчлэн адил.',
    'Үгүйсгэлд not-ыг infinitive эсвэл -ing-ийн өмнө тавина: She promised not to be late. He apologised for not calling. He admitted not reading the report.',
    'refuse ба deny хоёрыг монголоор хоёуланг нь «үгүй гэсэн» гэж ойлгож хольдог. refuse to do = хийхээс татгалзах (ирээдүйн үйлдэл). deny doing = хийснээ үгүйсгэх (өнгөрсөн үйлдэл).',
    'remind sb to do = хийхийг нь сануулах. remind sb of sth = ямар нэг зүйлийг санагдуулах (This song reminds me of my childhood). Хоёр өөр утга.',
    'Өмнө болсон үйлдлийг онцлох бол having + V3 хэрэглэж болно: He admitted having lied. Гэхдээ энгийн -ing ихэвчлэн хангалттай: He admitted lying.',
    'say-ийн ард хүн шууд орохгүй (said me гэхгүй), tell-ийн ард заавал хүн орно. Reporting verb-үүд мөн адил хоёр бүлэг: promise, offer, refuse (хүнгүй) — advise, remind, persuade (хүнтэй).',
  ],
  commonMistakes: [
    {
      wrong: 'She suggested me to take a taxi.',
      correct: 'She suggested taking a taxi. / She suggested that I take a taxi.',
      explanation: 'suggest + хүн + to гэсэн бүтэц байхгүй. Монголоор «надад … гэж санал болгосон» гэдэг тул advise me to-тэй адилтгах алдаа гардаг. suggest + -ing эсвэл suggest that …',
    },
    {
      wrong: 'He apologised to be late.',
      correct: 'He apologised for being late.',
      explanation: 'apologise нь for угтвар үгтэй, угтвар үгийн ард -ing орно. Хэнээс уучлалт гуйснаа хэлэх бол to + хүн: He apologised to me for being late.',
    },
    {
      wrong: 'He denied to break the vase.',
      correct: 'He denied breaking the vase.',
      explanation: 'deny-ийн ард -ing орно, to биш. refuse to-тэй хольж болохгүй: refused to break гэвэл «хагалахаас татгалзсан» гэсэн огт өөр утга.',
    },
    {
      wrong: 'They accused him for stealing the car.',
      correct: 'They accused him of stealing the car.',
      explanation: 'accuse sb OF, харин blame sb FOR. Угтвар үг нь үйл үг бүрт тогтмол байдаг тул хамт цээжилнэ.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор бараг бүх мэдээлэх үйл үг «гэж»-ээр холбогддог: «тусална гэж амласан», «очихгүй гэж татгалзсан», «аваагүй гэж үгүйсгэсэн». Англиар нэг ерөнхий холбоос байхгүй — үйл үг бүр to, -ing эсвэл угтвар үгийн аль нэгийг шаардана: promised to help, refused to go, denied taking.',
      'Монголоор хэлсэн агуулга үйл үгийн ӨМНӨ ордог: «эрт ирэхийг сануулсан». Англиар мэдээлэх үйл үг эхэнд, агуулга нь ард: reminded me to come early. Хүн (me) нь үйл үг ба to хоёрын дунд орно.',
      'Монголоор «-сандаа» (хоцорсондоо уучлалт гуйсан), «-санд» (тусалсанд талархсан) гэсэн шалтгааны нөхцөлийг англиар for + -ing-ээр илэрхийлнэ: apologised for being late, thanked me for helping. «-сан гэж буруутгасан» = accused sb of + -ing.',
      'Монголоор «явъя гэж санал болгосон» гэхэд «явъя» гэсэн уриалах хэлбэр хэвээр үлддэг. Англиар Let\'s go-г дамжуулахдаа let\'s-ийг хаяж, suggest + -ing болгоно: He suggested going. He suggested to go ч, He suggested let\'s go ч буруу.',
    ],
  },
  dialogue: [
    {
      en: 'Temuulen, [how](m) [was](v) [the meeting](s) [with your manager](m)?',
      mn: 'Тэмүүлэн, даргатайгаа хийсэн уулзалт ямар болсон бэ?',
      speaker: 'Saraa',
    },
    {
      en: 'Not bad. [He](s) [apologised](v) [for cancelling my holiday](m) and [promised](v) [to give me a week off](o) [in August](m).',
      mn: 'Гайгүй ээ. Тэр миний амралтыг цуцалсандаа уучлалт гуйгаад, наймдугаар сард долоо хоногийн чөлөө өгнө гэж амласан.',
      speaker: 'Temuulen',
    },
    {
      en: 'That\'s good. [Did](v) [you](s) [mention](v) [the extra hours](o)?',
      mn: 'Сайн байна. Илүү цагийн тухай хэлсэн үү?',
      speaker: 'Saraa',
    },
    {
      en: 'Yes. [He](s) [denied](v) [knowing about them](o) [at first](m), [but](m) [then](m) [he](s) [agreed](v) [to check the records](o).',
      mn: 'Тийм. Эхлээд тэр энэ тухай мэдээгүй гэж үгүйсгэсэн ч дараа нь бүртгэлийг шалгахыг зөвшөөрсөн.',
      speaker: 'Temuulen',
    },
    {
      en: '[My sister](s) [advised](v) [me](o) [to put everything in writing](o) [in situations like that](m).',
      mn: 'Манай эгч ийм тохиолдолд бүгдийг бичгээр үлдээхийг надад зөвлөсөн юм.',
      speaker: 'Saraa',
    },
    {
      en: 'Good idea. [The manager](s) [suggested](v) [sending him an email](o) too, [so](m) [I](s)[\'ll do](v) [that](o) [tonight](m).',
      mn: 'Сайхан санаа. Дарга ч бас өөр рүү нь имэйл явуулахыг санал болгосон, тэгэхээр өнөө орой тэгье.',
      speaker: 'Temuulen',
    },
  ],
  quiz: [
    {
      id: 'b2-07-1',
      ruleId: 7,
      kind: 'fill',
      question: 'He apologised ___ so late.',
      options: ['to arrive', 'for arriving', 'of arriving', 'arriving'],
      answer: 'for arriving',
      explanation: 'apologise нь for угтвар үгтэй, угтвар үгийн ард -ing: apologised for arriving. to-infinitive болон угтвар үггүй -ing эсвэл of энд орохгүй.',
      hint: 'apologise + угтвар үг + -ing.',
    },
    {
      id: 'b2-07-2',
      ruleId: 7,
      kind: 'fill',
      question: 'The doctor advised ___ more rest.',
      options: ['me to get', 'me getting', 'to me get', 'that I to get'],
      answer: 'me to get',
      explanation: 'advise + хүн (object) + to + V1: advised me to get. Хүний ард -ing орохгүй, to нь хүний өмнө орохгүй, that-ийн ард to-infinitive байж болохгүй.',
      hint: 'advise + хүн + to V1.',
    },
    {
      id: 'b2-07-3',
      ruleId: 7,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'She suggested me to take a taxi.',
        'He denied to break the window.',
        'They accused him of stealing the money.',
        'My mum reminded me buying some milk.',
      ],
      answer: 'They accused him of stealing the money.',
      explanation: 'accuse sb of + -ing зөв. suggest-ийн ард хүн + to орохгүй (suggested taking); deny + -ing (denied breaking); remind sb + to V1 (reminded me to buy).',
      hint: 'Үйл үг бүрийн бүтцийг шалга: to уу, -ing үү, угтвар үг үү?',
    },
    {
      id: 'b2-07-4',
      ruleId: 7,
      kind: 'translate',
      question: 'Тэр надад туслахаас татгалзсан.',
      options: [
        'He refused to help me.',
        'He refused helping me.',
        'He refused me to help.',
        'He denied to help me.',
      ],
      answer: 'He refused to help me.',
      explanation: '«Хийхээс татгалзах» = refuse + to V1. refuse-ийн ард -ing ч, хүн + to ч орохгүй. deny нь «хийснээ үгүйсгэх» гэсэн өөр утгатай бөгөөд -ing шаардана.',
      hint: 'refuse + to V1.',
    },
  ],
};
