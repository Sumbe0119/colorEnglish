// frontend/src/lib/grammar/b1/rule-05.ts
// B1 дүрэм 5: Second conditional
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule05: GrammarRule = {
  id: 5,
  title: 'Second conditional',
  titleMn: 'Хоёрдугаар нөхцөл — бодит бус, төсөөллийн «хэрэв … байсан бол … байх байсан»',
  hook: '«Хэрэв би сая доллартай байсан бол дэлхийгээр аялах байсан» — бодит байдалд байхгүй, зүгээр л төсөөлж буй нөхцөлийг хэлж сурцгаая.',
  summary: 'If + Past Simple, + would + Verb1 нь одоо эсвэл ирээдүйд бодитоор болох магадлал багатай, төсөөллийн нөхцөл ба түүний үр дагаврыг заана. Past Simple хэрэглэж байгаа ч өнгөрсөн цагийн тухай биш — «бодит биш» гэдгийг л заана.',
  description: 'A2 түвшинд бид Zero conditional (If you heat ice, it melts — үргэлж үнэн) болон First conditional (If it rains, I will stay home — ирээдүйд бодитоор болж магадгүй) хоёрыг үзсэн. Second conditional бол огт өөр ертөнц: одоо байгаа бодит байдлаас ӨӨР төсөөллийн нөхцөл. If I had a million dollars, I would travel the world — надад сая доллар БАЙХГҮЙ, зүгээр л төсөөлж байна. Хэлбэр нь If + Past Simple, would + Verb1. Энд Past Simple хэрэглэж байгаа нь өнгөрсөн цагийг заадаггүй, харин «энэ бодит биш, зөвхөн төсөөлөл» гэдгийг заана. First conditional-тай харьцуулбал: If I have time, I will help you (цаг гарах магадлалтай) — If I had time, I would help you (одоо цаг байхгүй, харамсалтай). be үйл үгийг бүх биед were гэж хэрэглэдэг: If I were you, I would … — «би чиний оронд байсан бол» гэсэн зөвлөгөөний бүтэц. Мөн would-ын оронд could (чадах байсан), might (магадгүй) хэрэглэж болно. Монголоор «хэрэв … байсан бол … байх байсан» гэсэн хэлбэр бодит бус нөхцөлийг яг илэрхийлдэг тул монгол орчуулга нь дүрмийг ойлгоход тусална.',
  structure: 'If + subject + Past Simple, + subject + would / could / might + Verb1',
  structureParts: [
    { text: 'If', part: 'modifier' },
    { text: 'subject', part: 'subject' },
    { text: 'Past Simple', part: 'verb' },
    { text: ', subject + would + Verb1', part: 'plain' },
  ],
  tip: 'First conditional = бодит боломж (will). Second conditional = төсөөлөл, бодит биш (would). Past Simple хэрэглэсэн ч өнгөрсөн цагийн тухай БИШ.',
  examples: [
    { en: '[If I had a million dollars](m), [I](s) [would travel](v) [the world](o).', mn: 'Хэрэв надад сая доллар байсан бол би дэлхийгээр аялах байсан.' },
    { en: '[If I were you](m), [I](s) [would take](v) [that job](o).', mn: 'Би чиний оронд байсан бол тэр ажлыг авах байсан.' },
    { en: '[What](o) [would](v) [you](s) [do](v) [if you won the lottery](m)?', mn: 'Хэрэв чи сугалаанд хожвол юу хийх байсан бэ?' },
    { en: '[She](s) [would be](v) [happier](o) [if she lived near the sea](m).', mn: 'Хэрэв тэр далайн ойролцоо амьдардаг байсан бол илүү аз жаргалтай байх байсан.' },
  ],
  useCases: [
    {
      title: 'Одоогийн бодит байдлаас өөр төсөөлөл',
      description: 'Одоо тийм биш зүйлийг «тийм байсан бол» гэж төсөөлнө. Нөхцөл нь бодит байдлын эсрэг: If I had more time (надад цаг байхгүй), If I lived in Paris (би Парист амьдардаггүй).',
      examples: [
        { en: '[If I had more free time](m), [I](s) [would learn](v) [to play the guitar](o).', mn: 'Хэрэв надад илүү чөлөөт цаг байсан бол би гитар тоглож сурах байсан.' },
        { en: '[If we lived in the countryside](m), [we](s) [would have](v) [a big dog](o).', mn: 'Хэрэв бид хөдөө амьдардаг байсан бол том нохойтой байх байсан.' },
        { en: '[If he spoke English](m), [he](s) [would get](v) [that job](o).', mn: 'Хэрэв тэр англиар ярьдаг байсан бол тэр ажлыг авах байсан.' },
      ],
    },
    {
      title: 'Ирээдүйд болох магадлал маш бага зүйл',
      description: 'Ирээдүйн тухай ч байж болно, гэхдээ бодитоор болно гэж бодохгүй байгаа зүйл: сугалаанд хожих, ерөнхийлөгч болох. First conditional-тай ялгаа нь ярьж буй хүний итгэлд байна.',
      examples: [
        { en: '[If I won the lottery](m), [I](s) [would buy](v) [a house](o) [for my parents](m).', mn: 'Хэрэв би сугалаанд хожвол эцэг эхдээ байшин авч өгөх байсан.' },
        { en: '[If I became president](m), [I](s) [would build](v) [more schools](o).', mn: 'Хэрэв би ерөнхийлөгч болбол илүү олон сургууль барих байсан.' },
        { en: '[If aliens landed here](m), [what](o) [would](v) [you](s) [say](v) [to them](o)?', mn: 'Хэрэв харь гаригийнхан энд буувал чи тэдэнд юу гэж хэлэх байсан бэ?' },
      ],
    },
    {
      title: 'Зөвлөгөө өгөх — If I were you, …',
      description: 'Хамгийн түгээмэл хэллэгүүдийн нэг. «Би чиний оронд байсан бол» гэж зөвлөгөө өгнө. Энд was биш were хэрэглэнэ (бүх биед). A2-д үзсэн should-оос илүү зөөлөн, хувийн зөвлөгөө.',
      examples: [
        { en: '[If I were you](m), [I](s) [wouldn\'t buy](v) [that car](o).', mn: 'Би чиний оронд байсан бол тэр машиныг авахгүй байх байсан.' },
        { en: '[If I were you](m), [I](s)[\'d talk](v) [to your boss](o).', mn: 'Би чиний оронд байсан бол даргатайгаа ярих байсан.' },
        { en: '[If I were her](m), [I](s) [would accept](v) [the offer](o).', mn: 'Би түүний оронд байсан бол саналыг хүлээж авах байсан.' },
      ],
    },
    {
      title: 'could / might — would-ын оронд',
      description: 'Үр дагаврын хэсэгт would-ын оронд could (чадах байсан, боломжтой байх байсан) эсвэл might (магадгүй … байх байсан) хэрэглэж болно. Утга нь бага зэрэг өөрчлөгдөнө.',
      examples: [
        { en: '[If I had a car](m), [I](s) [could drive](v) [you](o) [to the airport](m).', mn: 'Хэрэв надад машин байсан бол би чамайг нисэх буудал хүргэж чадах байсан.' },
        { en: '[If you asked him nicely](m), [he](s) [might help](v) [you](o).', mn: 'Хэрэв чи түүнээс эелдгээр гуйвал тэр чамд тусалж магадгүй.' },
        { en: '[If we left now](m), [we](s) [could catch](v) [the last bus](o).', mn: 'Хэрэв бид одоо гарвал сүүлийн автобусанд амжиж чадах байсан.' },
      ],
    },
    {
      title: 'First conditional-аас ялгаа — бодит уу, төсөөлөл үү',
      description: 'A2-д үзсэн First conditional (If + Present, will) бодитоор болж магадгүй нөхцөл. Second conditional (If + Past, would) бодит биш эсвэл магадлал маш бага. Ижил нөхцөлийг хоёр янзаар хэлж болох ч утга өөр.',
      examples: [
        { en: '[If I have time](m), [I](s)[\'ll help](v) [you](o).', mn: 'Хэрэв надад цаг гарвал би чамд тусална. (гарч магадгүй)' },
        { en: '[If I had time](m), [I](s)[\'d help](v) [you](o).', mn: 'Хэрэв надад цаг байсан бол би чамд туслах байсан. (одоо цаг байхгүй)' },
        { en: '[If it snows](m), [we](s)[\'ll go](v) [skiing](o). [If it snowed in July](m), [we](s)[\'d be](v) [surprised](o).', mn: 'Хэрэв цас орвол бид цанаар гулгана. Хэрэв долдугаар сард цас орвол бид гайхах байсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Батлах',
      structure: 'If + subject + Past Simple, + subject + would + V1',
      examples: [
        { en: '[If I knew](v) [her number](o), [I](s) [would call](v) [her](o).', mn: 'Хэрэв би түүний дугаарыг мэддэг байсан бол би түүн рүү залгах байсан.' },
        { en: '[If they had](v) [more money](o), [they](s) [would buy](v) [a bigger flat](o).', mn: 'Хэрэв тэдэнд илүү мөнгө байсан бол том байр авах байсан.' },
        { en: '[She](s) [would travel](v) [more](m) [if she didn\'t have children](m).', mn: 'Хэрэв түүнд хүүхэд байгаагүй бол илүү их аялах байсан.' },
      ],
    },
    {
      label: 'Үгүйсгэх',
      structure: 'If + subject + didn\'t + V1, + subject + wouldn\'t + V1',
      examples: [
        { en: '[If I didn\'t like](v) [my job](o), [I](s) [would leave](v).', mn: 'Хэрэв би ажилдаа дургүй байсан бол би явах байсан.' },
        { en: '[If you didn\'t eat](v) [so much sugar](o), [you](s) [wouldn\'t feel](v) [tired](o).', mn: 'Хэрэв чи ийм их сахар иддэггүй байсан бол ядрахгүй байх байсан.' },
        { en: '[He](s) [wouldn\'t be](v) [late](o) [if he got up earlier](m).', mn: 'Хэрэв тэр эрт босдог байсан бол хоцрохгүй байх байсан.' },
      ],
    },
    {
      label: 'Асуух',
      structure: 'What would + subject + V1 + if + subject + Past Simple? · Would + subject + V1 + if …?',
      examples: [
        { en: '[What](o) [would](v) [you](s) [do](v) [if you lost your phone](m)?', mn: 'Хэрэв чи утсаа гээвэл юу хийх байсан бэ?' },
        { en: '[Would](v) [you](s) [move](v) [abroad](m) [if you got a good offer](m)?', mn: 'Хэрэв чи сайн санал авбал гадаад руу нүүх үү?' },
        { en: '[Where](m) [would](v) [you](s) [live](v) [if you could choose](m)?', mn: 'Хэрэв чи сонгож чадах байсан бол хаана амьдрах байсан бэ?' },
      ],
    },
    {
      label: 'be — were бүх биед',
      structure: 'If I / he / she / it were …, + would … (ярианд was ч зөвшөөрөгддөг)',
      examples: [
        { en: '[If I were](v) [rich](o), [I](s) [would help](v) [poor children](o).', mn: 'Хэрэв би баян байсан бол ядуу хүүхдүүдэд туслах байсан.' },
        { en: '[If she were](v) [here](m), [she](s) [would know](v) [what to do](o).', mn: 'Хэрэв тэр энд байсан бол юу хийхээ мэдэх байсан.' },
        { en: '[If it weren\'t](v) [so cold](o), [we](s) [would go](v) [for a walk](m).', mn: 'Хэрэв ийм хүйтэн биш байсан бол бид зугаалах байсан.' },
      ],
    },
  ],
  signalWords: ['if', 'if I were you', 'would', 'wouldn\'t', 'could', 'might', 'what would you do if', 'unless'],
  notes: [
    'If-ийн хэсэгт would хэрэглэхгүй: If I would have money (буруу) → If I had money (зөв). would зөвхөн үр дагаврын хэсэгт.',
    'Second conditional-д Past Simple хэрэглэсэн ч өнгөрсөн цагийн тухай биш — одоо эсвэл ирээдүйн төсөөлөл. Өнгөрсөн цагийн бодит бус нөхцөлийг Third conditional-д (дараагийн дүрэм) үзнэ.',
    'If I were you бол тогтсон хэллэг — were-ийг was-аар сольдоггүй. Бусад тохиолдолд ярианы хэлэнд If he was … гэж хэлж болно, гэхдээ бичгийн хэлэнд were нь илүү зөв.',
    'If-ийн хэсэг эхэнд орвол таслал тавина. Ард орвол таслал хэрэггүй: I would help you if I had time.',
    'would-ыг \'d гэж товчилно: I\'d go, she\'d buy. Энэ \'d нь had-тай адил бичигддэг тул ард нь V1 байвал would, V3 байвал had.',
    'Нөхцөлт өгүүлбэрт «unless» нь «if … not» гэсэн утгатай: Unless I had a car, I couldn\'t get there = If I didn\'t have a car …',
  ],
  commonMistakes: [
    {
      wrong: 'If I would have more money, I would buy a car.',
      correct: 'If I had more money, I would buy a car.',
      explanation: 'If-ийн хэсэгт would хэрэглэхгүй — Past Simple. Монголоор хоёр хэсэгт хоёуланд нь «байсан бол … байх байсан» гэж хэлдэг тул давхар would тавих алдаа гардаг.',
    },
    {
      wrong: 'If I will win the lottery, I would buy a house.',
      correct: 'If I won the lottery, I would buy a house.',
      explanation: 'First болон Second conditional-ыг холисон байна. will/would-ыг if-ийн хэсэгт хэрэглэхгүй; Second conditional-д if-ийн хэсэг Past Simple.',
    },
    {
      wrong: 'If I was you, I would study harder.',
      correct: 'If I were you, I would study harder.',
      explanation: 'If I were you бол тогтсон хэллэг — үргэлж were. Ярианд was сонсогдож болох ч шалгалтад were зөв.',
    },
    {
      wrong: 'If I had time, I will help you.',
      correct: 'If I had time, I would help you.',
      explanation: 'If-ийн хэсэг Past Simple байвал үр дагавар нь would байх ёстой. will хэрэглэвэл First conditional болж, if-ийн хэсэг Present байх ёстой болно.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «хэрэв … байсан бол … байх байсан» гэсэн хэлбэр бодит бус төсөөллийг заадаг нь Second conditional-тай яг таардаг: «сая доллартай байсан бол аялах байсан» = If I had a million dollars, I would travel.',
      'Монголоор «-вал/-бол» залгавар First conditional (бодит) болон Second conditional (төсөөлөл) хоёуланд нь орж болдог: «цаг гарвал туслана» / «цаг байсан бол туслах байсан». Ялгаа нь үр дагаврын үйл үгэнд: «-на» = will, «-х байсан» = would.',
      'Монголоор «би чиний оронд байсан бол» гэдэг хэллэг If I were you-тай яг адил. Монголоор ч «байсан» гэж өнгөрсөн хэлбэр хэрэглэдэг нь англиар were (past) хэрэглэдэгтэй төстэй — өнгөрсөн цаг биш, бодит бус гэдгийг заана.',
      'Монголоор «байх байсан» гэдэг нь заримдаа «байж магадгүй байсан» гэж ойлгогдож болно. Англиар would (тодорхой үр дагавар), might (магадгүй), could (чадах байсан) гэж гурван өөр үгээр ялгадгийг анхаараарай.',
    ],
  },
  dialogue: [
    {
      en: 'Bat, [what](o) [would](v) [you](s) [do](v) [if you won a million dollars](m)?',
      mn: 'Бат, хэрэв чи сая доллар хожвол юу хийх байсан бэ?',
      speaker: 'Saraa',
    },
    {
      en: 'Hmm. [If I won](v) [a million dollars](o), [I](s)[\'d buy](v) [a house](o) [for my parents](m). [And](m) [you](s)?',
      mn: 'Хмм. Хэрэв би сая доллар хожвол эцэг эхдээ байшин авч өгөх байсан. Чи яах вэ?',
      speaker: 'Bat',
    },
    {
      en: '[If I had](v) [that much money](o), [I](s) [wouldn\'t work](v) [any more](m). [I](s)[\'d travel](v) [all the time](m).',
      mn: 'Хэрэв надад тийм их мөнгө байсан бол би ажиллахаа болих байсан. Байнга аялах байсан.',
      speaker: 'Saraa',
    },
    {
      en: 'Really? [Wouldn\'t](v) [you](s) [get](v) [bored](o)?',
      mn: 'Нээрээ юу? Чи уйдахгүй байх байсан гэж үү?',
      speaker: 'Bat',
    },
    {
      en: 'Maybe. [If I were you](m), [I](s)[\'d also open](v) [a small business](o).',
      mn: 'Магадгүй. Би чиний оронд байсан бол бас жижиг бизнес нээх байсан.',
      speaker: 'Saraa',
    },
    {
      en: 'Good idea. [But](m) [first](m) [I](s) [need](v) [to buy a lottery ticket](o)!',
      mn: 'Сайн санаа. Гэхдээ эхлээд би сугалааны тасалбар авах хэрэгтэй!',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'b1-05-1',
      ruleId: 5,
      kind: 'fill',
      question: 'If I ___ a car, I would drive to work.',
      options: ['have', 'had', 'would have', 'will have'],
      answer: 'had',
      explanation: 'Үр дагаврын хэсэгт would байгаа тул Second conditional — if-ийн хэсэгт Past Simple: had. would, will-ийг if-ийн хэсэгт хэрэглэхгүй.',
      hint: 'would байвал if-ийн хэсэгт ямар цаг вэ?',
    },
    {
      id: 'b1-05-2',
      ruleId: 5,
      kind: 'fill',
      question: 'If I ___ you, I would apologise to her.',
      options: ['am', 'was', 'were', 'be'],
      answer: 'were',
      explanation: 'If I were you — тогтсон хэллэг, бүх биед were. «Би чиний оронд байсан бол» гэсэн зөвлөгөө.',
      hint: 'Зөвлөгөөний тогтсон хэллэг.',
    },
    {
      id: 'b1-05-3',
      ruleId: 5,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'If I would have time, I would help you.',
        'If I had time, I will help you.',
        'If I had time, I would help you.',
        'If I have time, I would help you.',
      ],
      answer: 'If I had time, I would help you.',
      explanation: 'Second conditional: If + Past Simple, would + V1. If-ийн хэсэгт would байхгүй; Past Simple-тэй would хослоно, will биш.',
      hint: 'Past Simple + would.',
    },
    {
      id: 'b1-05-4',
      ruleId: 5,
      kind: 'translate',
      question: 'Хэрэв би далайн ойролцоо амьдардаг байсан бол өдөр бүр сэлэх байсан.',
      options: [
        'If I lived near the sea, I would swim every day.',
        'If I live near the sea, I will swim every day.',
        'If I would live near the sea, I would swim every day.',
        'If I lived near the sea, I swim every day.',
      ],
      answer: 'If I lived near the sea, I would swim every day.',
      explanation: '«Амьдардаг байсан бол … сэлэх байсан» — бодит бус төсөөлөл (би далайн ойролцоо амьдардаггүй). If + Past Simple, would + V1.',
      hint: '«-сан бол … -х байсан» = Second conditional.',
    },
  ],
};
