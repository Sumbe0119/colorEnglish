// frontend/src/lib/grammar/c1/rule-07.ts
// C1 дүрэм 7: Perfect & continuous infinitives and gerunds
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule07: GrammarRule = {
  id: 7,
  title: 'Perfect & continuous infinitives and gerunds',
  titleMn: 'Төгс ба үргэлжилсэн infinitive, gerund — to have done / to be doing / having done',
  hook: '«Тэр түлхүүрээ гээсэн бололтой», «Тэр унтаж байгаа дүр эсгэв», «Тэр мөнгийг авснаа үгүйсгэв» — infinitive, gerund-ээр цаг хугацааг нарийн ялгаж сурцгаая.',
  summary: 'Infinitive ба gerund нь өөрөө цаг, байдлыг зааж чадна: to have + V3 нь үндсэн үйл үгээс ӨМНӨ болсныг (He seems to have left), to be + V-ing нь тэр мөчид ҮРГЭЛЖИЛЖ байгааг (She pretended to be sleeping), to have been + V-ing нь тэр хүртэл үргэлжилж ирснийг заана. having + V3 нь gerund-ийн төгс хэлбэр (He denied having taken it). would like to have done нь биелээгүй хүслийг илэрхийлнэ.',
  description: 'B1-ийн 11-р дүрэмд бид gerund ба infinitive-ийн энгийн хэлбэрийг (to do / doing), B2-ийн 8-р дүрэмд утга өөрчилдөг хэв маягуудыг (remember to do / remember doing) үзсэн. Мөн B2-ийн 6-р дүрэмд He is said to have left гэсэн бүтцээр to have + V3-тай анх танилцсан, B1-ийн 10 болон B2-ийн 4-р дүрэмд модаль + have + V3 (must have gone, should have told) хэрэглэсэн. C1 түвшинд энэ бүхнийг нэгтгэнэ: infinitive ба gerund нь зөвхөн «үйлдлийн нэр» биш, өөрөө ЦАГ болон БАЙДАЛ (aspect) илэрхийлдэг. Энгийн infinitive (to do) нь үндсэн үйл үгтэй нэгэн зэрэг эсвэл түүнээс хойш болохыг заана. Perfect infinitive (to have done) нь түүнээс өмнө болсныг: He seems to have forgotten = It seems that he has forgotten / forgot. Continuous infinitive (to be doing) нь яг тэр үед үргэлжилж байгааг: He seems to be working = It seems that he is working. Perfect continuous infinitive (to have been doing) нь тэр мөч хүртэл хэсэг хугацаанд үргэлжилж ирснийг заана. Эдгээр нь seem, appear, claim, pretend, happen, be said, be thought зэрэг үйл үгийн ард хамгийн их тохиолдоно. Gerund-ийн төгс хэлбэр having done нь deny, admit, regret, mention болон угтвар үгийн ард «урьд нь тэгсэн» гэдгийг тодотгоно. Эдгээр хэлбэр нь албан бичиг, мэдээ, тайланд түгээмэл боловч seem to have, pretend to be гэх мэт нь өдөр тутмын ярианд ч байнга гардаг. Монгол хэлэнд энэ ялгааг «-сан бололтой», «-ж байгаа бололтой», «-снаа», «-ж байгаа дүр эсгэх» гэж үйл үгийн дагавраар гаргадаг тул монгол хэлбэрээс нь англи хэлбэрийг шууд тааруулж болно.',
  structure: 'Subject + seem / appear / claim / pretend / happen + to have + V3 · to be + V-ing · to have been + V-ing · Subject + deny / admit / regret + having + V3',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'seem / claim / pretend', part: 'verb' },
    { text: 'to have + V3 / to be + V-ing', part: 'verb' },
    { text: '· deny + having + V3', part: 'modifier' },
  ],
  tip: 'to do = нэгэн зэрэг / хожим · to have done = өмнө нь болсон («-сан бололтой») · to be doing = яг одоо үргэлжилж байгаа («-ж байгаа бололтой») · to have been doing = тэр хүртэл үргэлжилсэн · having done = «-снаа» (deny, admit, regret-ийн ард).',
  examples: [
    { en: '[He](s) [seems](v) [to have forgotten](v) [our meeting](o).', mn: 'Тэр бидний уулзалтыг мартсан бололтой.' },
    { en: '[She](s) [pretended](v) [to be reading](v) [a book](o).', mn: 'Тэр ном уншиж байгаа дүр эсгэв.' },
    { en: '[They](s) [appear](v) [to have been arguing](v) [all morning](m).', mn: 'Тэд өглөөжин маргалдаж байсан бололтой.' },
    { en: '[He](s) [denied](v) [having taken](v) [the money](o).', mn: 'Тэр мөнгийг авснаа үгүйсгэв.' },
  ],
  useCases: [
    {
      title: 'Өмнө нь болсон үйлдэл — perfect infinitive (to have + V3)',
      description: 'Үндсэн үйл үгийн цагаас ӨМНӨ болсон үйлдлийг заана. seem, appear, claim, be said, be believed-ийн ард, мөн glad, sorry, lucky зэрэг тэмдэг нэрийн ард хэрэглэнэ. Монголоор «-сан бололтой», «-сан гэж», «-сандаа».',
      examples: [
        { en: '[Someone](s) [seems](v) [to have left](v) [the window](o) [open](o).', mn: 'Хэн нэгэн цонхыг онгорхой орхисон бололтой.' },
        { en: '[He](s) [claims](v) [to have met](v) [the president](o) [twice](m).', mn: 'Тэр ерөнхийлөгчтэй хоёр удаа уулзсан гэж мэдэгддэг.' },
        { en: '[I](s)[\'m](v) [sorry](o) [to have kept](v) [you](o) [waiting](o).', mn: 'Таныг хүлээлгэсэнд уучлаарай.' },
      ],
    },
    {
      title: 'Яг тэр үед үргэлжилж байгаа үйлдэл — continuous infinitive (to be + V-ing)',
      description: 'Үндсэн үйл үгтэй нэгэн зэрэг ҮРГЭЛЖИЛЖ байгаа үйлдлийг заана. seem, appear, pretend, happen-ий ард маш түгээмэл. Монголоор «-ж байгаа бололтой», «-ж байгаа дүр эсгэх», «таарч … -ж байсан».',
      examples: [
        { en: '[The children](s) [seem](v) [to be enjoying](v) [themselves](o).', mn: 'Хүүхдүүд сайхан зугаацаж байгаа бололтой.' },
        { en: '[He](s) [pretended](v) [to be listening](v), [but](m) [he](s) [was](v) [miles away](o).', mn: 'Тэр сонсож байгаа дүр эсгэсэн ч бодол нь өөр газар байв.' },
        { en: '[I](s) [happened](v) [to be passing](v) [when the accident occurred](m).', mn: 'Осол болох үед би таарч хажуугаар нь өнгөрч байлаа.' },
      ],
    },
    {
      title: 'Тэр хүртэл үргэлжилж ирсэн үйлдэл — perfect continuous infinitive (to have been + V-ing)',
      description: 'Үндсэн үйл үгийн мөч хүртэл хэсэг хугацаанд үргэлжилж ирсэн үйлдлийг заана; ихэвчлэн for, all day, since зэрэг хугацааны үгтэй. Present Perfect Continuous / Past Perfect Continuous-ийн infinitive хувилбар гэж ойлгож болно.',
      examples: [
        { en: '[She](s) [seems](v) [to have been crying](v).', mn: 'Тэр уйлж байсан бололтой.' },
        { en: '[He](s) [claims](v) [to have been working](v) [on the project](o) [for years](m).', mn: 'Тэр энэ төсөл дээр олон жил ажиллаж байгаа гэж мэдэгддэг.' },
        { en: '[The company](s) [appears](v) [to have been losing](v) [money](o) [since 2020](m).', mn: 'Компани 2020 оноос хойш алдагдалтай ажиллаж ирсэн бололтой.' },
      ],
    },
    {
      title: 'Урьд нь хийснээ — perfect gerund (having + V3)',
      description: 'deny, admit, regret, mention, recall зэрэг gerund шаарддаг үйл үгийн ард, мөн угтвар үгийн ард (of, for, without, after) урьд нь болсон үйлдлийг тодотгоно. Энгийн gerund (denied taking) ч зөв; having taken нь «өмнө нь» гэдгийг илүү тод, албан өнгөөр хэлнэ.',
      examples: [
        { en: '[She](s) [admitted](v) [having lied](v) [to the police](m).', mn: 'Тэр цагдаад худал хэлснээ хүлээн зөвшөөрөв.' },
        { en: '[I](s) [regret](v) [not having studied](v) [harder](m) [at university](m).', mn: 'Би их сургуульд байхдаа илүү шаргуу суралцаагүйдээ харамсдаг.' },
        { en: '[He](s) [was accused](v) [of having stolen](v) [company data](o).', mn: 'Түүнийг компанийн мэдээлэл хулгайлсан хэрэгт буруутгав.' },
      ],
    },
    {
      title: 'Биелээгүй хүсэл — would like / love / prefer + to have + V3',
      description: 'Өнгөрсөнд хийхийг хүссэн боловч чадаагүй зүйлийг would like to have done гэж хэлнэ. would have liked to do гэсэн хувилбар мөн адил утгатай. Монголоор «-сан бол сайхан байх байлаа», «-мээр байсан юм».',
      examples: [
        { en: '[I](s) [would like](v) [to have met](v) [your grandfather](o).', mn: 'Би чиний өвөөтэй уулзсан бол сайхан байх байлаа. (уулзаж чадаагүй)' },
        { en: '[She](s) [would love](v) [to have seen](v) [his face](o) [at that moment](m).', mn: 'Тэр мөчид түүний царайг харсан бол тэр ямар их баярлах байсан бол.' },
        { en: '[We](s) [would have liked](v) [to stay](v) [longer](m), [but](m) [we](s) [had](v) [a flight to catch](o).', mn: 'Бид удаан баймаар байсан ч онгоцондоо амжих хэрэгтэй байлаа.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Perfect infinitive',
      structure: '(not) to have + V3',
      examples: [
        { en: '[The thieves](s) [appear](v) [to have entered](v) [through the back door](m).', mn: 'Хулгайч нар арын хаалгаар орсон бололтой.' },
        { en: '[He](s) [seems](v) [not to have noticed](v) [the mistake](o).', mn: 'Тэр алдааг анзаараагүй бололтой.' },
        { en: '[I](s)[\'m](v) [glad](o) [to have had](v) [the chance to work with you](o).', mn: 'Тантай хамтран ажиллах боломж олдсонд баяртай байна.' },
      ],
    },
    {
      label: 'Continuous infinitive',
      structure: '(not) to be + V-ing',
      examples: [
        { en: '[You](s) [seem](v) [to be having](v) [trouble with your computer](o).', mn: 'Чиний компьютер асуудалтай байгаа бололтой.' },
        { en: '[It](s)[\'s](v) [nice](o) [to be sitting](v) [in the sun](m) [at last](m).', mn: 'Эцэст нь наранд сууж байгаа нь сайхан байна.' },
        { en: '[The economy](s) [appears](v) [to be recovering](v) [slowly](m).', mn: 'Эдийн засаг аажмаар сэргэж байгаа бололтой.' },
      ],
    },
    {
      label: 'Perfect continuous infinitive',
      structure: '(not) to have been + V-ing',
      examples: [
        { en: '[He](s) [seems](v) [to have been waiting](v) [for hours](m).', mn: 'Тэр олон цаг хүлээсэн бололтой.' },
        { en: '[She](s) [pretended](v) [to have been studying](v) [all evening](m).', mn: 'Тэр оройжин хичээлээ хийж байсан дүр эсгэв.' },
        { en: '[They](s) [are thought](v) [to have been living](v) [abroad](m) [since last year](m).', mn: 'Тэднийг өнгөрсөн жилээс хойш гадаадад амьдарч байгаа гэж үздэг.' },
      ],
    },
    {
      label: 'Perfect gerund',
      structure: '(not) having + V3 · preposition + having + V3',
      examples: [
        { en: '[He](s) [mentioned](v) [having seen](v) [her](o) [at the station](m).', mn: 'Тэр түүнийг буудал дээр харснаа дурдав.' },
        { en: '[She](s) [apologised](v) [for not having replied](v) [sooner](m).', mn: 'Тэр эртхэн хариу бичээгүйдээ уучлалт гуйв.' },
        { en: '[I](s) [don\'t remember](v) [having agreed](v) [to that](m).', mn: 'Би үүнийг зөвшөөрснөө санахгүй байна.' },
      ],
    },
  ],
  signalWords: ['seem to', 'appear to', 'claim to', 'pretend to', 'happen to', 'be said to', 'to have + V3', 'to be + V-ing', 'to have been + V-ing', 'deny / admit / regret + having + V3', 'would like to have + V3'],
  notes: [
    'Цагийн харьцааг ингэж шалга: He seems to work here = It seems that he works here (нэгэн зэрэг); He seems to have worked here = It seems that he worked / has worked here (өмнө нь); He seems to be working = It seems that he is working (яг одоо).',
    'Үгүйсгэлд not-ыг infinitive-ийн өмнө тавина: He seems not to have understood. Ярианы хэлэнд үндсэн үйл үгийг үгүйсгэх нь илүү түгээмэл: He doesn\'t seem to have understood. Gerund-д not having + V3.',
    'deny, admit, regret, remember-ийн ард энгийн gerund ч өнгөрснийг зааж чадна: He denied taking it = He denied having taken it. having + V3 нь алдаа биш, харин «өмнө нь» гэдгийг онцолсон, арай албан хувилбар.',
    'would like to have done ба would have liked to do хоёр адил утгатай. Хоёуланг нь төгс болгосон would have liked to have done ярианд сонсогддог ч бичгийн хэлэнд илүүц гэж үздэг тул нэгийг нь л төгс болго.',
    'Модаль үгийн ард мөн адил хэлбэрүүд to-гүйгээр орно: must have done, might be doing, should have been doing (B1-ийн 10, B2-ийн 4-р дүрэм). Өөрөөр хэлбэл энэ бол танил бүтцийн өргөтгөл юм.',
    'Идэвхгүй хэлбэрүүд — to have been done, having been done — C1-ийн 5-р дүрэмд бий: He claims to have been told nothing; She resented having been ignored. Идэвхтэй / идэвхгүйг эзэн үйлдлийг хийсэн үү, хүртсэн үү гэдгээр ялгана.',
  ],
  commonMistakes: [
    {
      wrong: 'He seems to lost his keys.',
      correct: 'He seems to have lost his keys.',
      explanation: 'to-гийн ард V2 / V3 шууд орохгүй. Өмнө нь болсон үйлдэлд to have + V3. Монголоор «гээсэн бололтой» гэдэг өнгөрсөн хэлбэрийг харвал to have lost гэж бодоорой.',
    },
    {
      wrong: 'She denied to have stolen the bag.',
      correct: 'She denied having stolen the bag.',
      explanation: 'deny нь gerund шаарддаг үйл үг тул төгс хэлбэр нь ч gerund байна: having stolen. to have stolen нь claim, seem, appear зэрэг infinitive шаарддаг үйл үгийн ард орно.',
    },
    {
      wrong: 'They appear to be waiting for two hours.',
      correct: 'They appear to have been waiting for two hours.',
      explanation: 'for two hours — одоог хүртэл үргэлжилж ирсэн хугацаа тул perfect continuous infinitive хэрэгтэй. to be waiting нь зөвхөн «яг одоо хүлээж байгаа» гэдгийг л заана.',
    },
    {
      wrong: 'I would like to saw the match yesterday.',
      correct: 'I would like to have seen the match yesterday.',
      explanation: 'Өнгөрсөнд биелээгүй хүсэлд would like to have + V3. to-гийн ард өнгөрсөн цагийн хэлбэр (saw) орж болохгүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «гээсэн бололтой» ба «гээж байгаа бололтой» хоёрыг үйл үгийн дагавраар (-сан / -ж байгаа) ялгадаг. Англиар яг үүнтэй адил infinitive-ийн хэлбэрээр ялгана: «-сан бололтой» = seems to have + V3, «-ж байгаа бололтой» = seems to be + V-ing.',
      'Монголоор «авснаа үгүйсгэв», «худал хэлснээ хүлээв» гэж өнгөрсөн цагийн нэрлэсэн хэлбэр (-сан + -аа) хэрэглэдэг. Англиар энэ нь having + V3 буюу энгийн gerund: denied having taken / denied taking. «-снаа» гэвэл gerund гэж санаарай.',
      'Монголоор «унтаж байгаа дүр эсгэх», «мэдэхгүй дүр эсгэх» гэж бүтэн үйл үгийн хэлбэрээр хэлдэг. Англиар pretend-ийн ард өгүүлбэр биш infinitive тавьж болно: pretended to be sleeping, pretended not to know.',
      'Монголоор «уулзсан бол сайхан байх байлаа», «үзмээр байсан юм» гэсэн биелээгүй хүслийг нөхцөл буюу хүсэх хэлбэрээр гаргадаг. Англиар would like to have + V3 гэсэн нэг бүтцээр хэлнэ — if хэрэглэх шаардлагагүй.',
    ],
  },
  dialogue: [
    {
      en: '[Have](v) [you](s) [seen](v) [Bat](o)? [He](s) [seems](v) [to have left](v) [without finishing the report](m).',
      mn: 'Чи Батыг харсан уу? Тэр тайлангаа дуусгалгүй явчихсан бололтой.',
      speaker: 'Nomin',
    },
    {
      en: 'Really? [He](s) [claimed](v) [to have sent](v) [it](o) [to everyone](m) [this morning](m).',
      mn: 'Тийм гэж үү? Тэр өнөө өглөө бүгдэд нь явуулсан гэж байсан шүү дээ.',
      speaker: 'Temuulen',
    },
    {
      en: 'Well, [I](s) [haven\'t received](v) [anything](o). [And](m) [he](s) [appears](v) [to have been working](v) [on the wrong file](m) [all week](m).',
      mn: 'Би юу ч аваагүй. Тэгээд ч тэр долоо хоногийн турш буруу файл дээр ажиллаж байсан бололтой.',
      speaker: 'Nomin',
    },
    {
      en: 'Oh dear. [I](s) [happened](v) [to be sitting](v) [next to him](m) [yesterday](m), [and](m) [he](s) [seemed](v) [to be struggling](v) [with the figures](m).',
      mn: 'Яана аа. Өчигдөр би таарч түүний хажууд сууж байсан, тэр тоонуудтайгаа зууралдаж байгаа бололтой байсан.',
      speaker: 'Temuulen',
    },
    {
      en: '[He](s) [should have asked](v) [for help](m). [I](s) [would like](v) [to have known](v) [about this](o) [earlier](m).',
      mn: 'Тэр тусламж хүсэх ёстой байсан. Би үүнийг эртхэн мэдсэн бол зүгээр байлаа.',
      speaker: 'Nomin',
    },
    {
      en: '[I](s)[\'ll call](v) [him](o). [I](s)[\'m](v) [sure](o) [he](s) [won\'t deny](v) [having made](v) [a mistake](o).',
      mn: 'Би түүн рүү залгая. Тэр алдаа гаргаснаа үгүйсгэхгүй гэдэгт итгэлтэй байна.',
      speaker: 'Temuulen',
    },
  ],
  quiz: [
    {
      id: 'c1-07-1',
      ruleId: 7,
      kind: 'fill',
      question: 'She seems ___ her phone — she\'s been searching her bag for ten minutes.',
      options: ['to have lost', 'to lose', 'having lost', 'to be lost'],
      answer: 'to have lost',
      explanation: 'Утсаа гээсэн нь одоо хайж байгаагаас ӨМНӨ болсон — seem + to have + V3. seem-ийн ард gerund (having lost) орохгүй; to lose нь өмнө болсныг заахгүй; to be lost нь идэвхгүй хэлбэр тул ард нь her phone орох боломжгүй.',
      hint: '«Гээсэн бололтой» — өмнө нь болсон.',
    },
    {
      id: 'c1-07-2',
      ruleId: 7,
      kind: 'fill',
      question: 'He denied ___ the money, but the cameras had recorded everything.',
      options: ['having taken', 'to have taken', 'to take', 'have taken'],
      answer: 'having taken',
      explanation: 'deny нь gerund шаарддаг үйл үг. Өмнө нь болсон үйлдлийг тодотгоход perfect gerund: having taken. deny-ийн ард infinitive (to take / to have taken) орохгүй.',
      hint: 'deny + V-ing.',
    },
    {
      id: 'c1-07-3',
      ruleId: 7,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'I would like to have seen that concert, but I was abroad.',
        'He pretended to being asleep when I came in.',
        'They appear to have been waited for hours.',
        'She admitted to have broken the vase.',
      ],
      answer: 'I would like to have seen that concert, but I was abroad.',
      explanation: 'Биелээгүй хүсэл — would like to have + V3 зөв. pretend-ийн ард to be asleep; үргэлжилсэн хэлбэр нь to have been waiting; admit-ийн ард gerund (admitted having broken / admitted breaking).',
      hint: 'Биелээгүй хүслийн бүтцийг хай.',
    },
    {
      id: 'c1-07-4',
      ruleId: 7,
      kind: 'translate',
      question: 'Тэр олон цагийн турш уйлж байсан бололтой.',
      options: [
        'She seems to have been crying for hours.',
        'She seems to be crying for hours.',
        'She seems having cried for hours.',
        'She seems to have been cried for hours.',
      ],
      answer: 'She seems to have been crying for hours.',
      explanation: '«Олон цагийн турш … -ж байсан бололтой» — одоог хүртэл үргэлжилсэн үйлдэл: seem + to have been + V-ing. to be crying нь for hours-тай зохицохгүй; seem-ийн ард gerund орохгүй; cry идэвхгүй хэлбэрт орохгүй.',
      hint: 'Үргэлжилсэн + өмнөх = to have been + V-ing.',
    },
  ],
};
