// frontend/src/lib/grammar/b2/rule-03.ts
// B2 дүрэм 3: Mixed conditionals
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule03: GrammarRule = {
  id: 3,
  title: 'Mixed conditionals',
  titleMn: 'Холимог нөхцөл — өнгөрсөн ба одоог нэг өгүүлбэрт холбох',
  hook: '«Би анагаахад сурсан бол одоо эмч байх байсан», «Би ийм ичимхий биш байсан бол өчигдөр түүнтэй ярих байсан» — нөхцөл нь нэг цагт, үр дүн нь өөр цагт байх өгүүлбэрийг хэлж сурцгаая.',
  summary: 'Mixed conditional нь Second ба Third conditional-ын хэсгүүдийг холино. 1-р төрөл: If + Past Perfect, would + V1 — өнгөрсөн бодит бус нөхцөл → одоогийн үр дүн (If I had studied medicine, I would be a doctor now). 2-р төрөл: If + Past Simple, would have + V3 — одоогийн байнгын бодит бус нөхцөл → өнгөрсөн үр дүн (If I weren\'t so shy, I would have spoken to her).',
  description: 'B1-ийн 5-р дүрэмд Second conditional (If I had money, I would buy it — одоо / ирээдүйн бодит бус нөхцөл ба үр дүн), 6-р дүрэмд Third conditional (If I had known, I would have come — өнгөрсний бодит бус нөхцөл ба үр дүн)-ыг үзсэн. Тэдгээрт нөхцөл ба үр дүн хоёулаа нэг цагт байсан. Гэтэл амьдрал дээр өнгөрсөн шийдвэрийн үр дагавар одоо мэдрэгддэг, эсвэл хүний одоогийн зан чанар өнгөрсөнд болсон зүйлийг тайлбарладаг. Ийм үед хоёр нөхцөлийг «холино». 1-р төрөлд if-ийн хэсгийг Third conditional-аас (had + V3), үр дүнг Second conditional-аас (would + V1) авна: If I hadn\'t missed the flight, I would be in Paris now — онгоцноос хоцорсон (өнгөрсөн), тиймээс одоо Парист биш. 2-р төрөлд эсрэгээр if-ийн хэсэг Second conditional-аас (Past Simple), үр дүн Third conditional-аас (would have + V3): If I spoke French, I would have got that job — би франц хэл мэддэггүй (одоо ч үнэн, байнгын), тиймээс тэр ажилд ороогүй (өнгөрсөн). Шинэ хэлбэр цээжлэх шаардлагагүй — мэддэг хоёр бүтцийнхээ талыг зөв сонгоход л хангалттай. Монгол хэлэнд «-сан бол … байх байсан» гэсэн нэг хэв маяг эдгээр бүх утгыг даадаг бөгөөд цагийг «одоо», «өчигдөр» гэх үгсээр ялгадаг. Англиар бол хэсэг тус бүрийн цагийг үйл үгийн хэлбэрээр заавал ялгаж өгнө.',
  structure: 'If + Past Perfect, would + V1 (өнгөрсөн нөхцөл → одоогийн үр дүн) · If + Past Simple, would have + V3 (одоогийн нөхцөл → өнгөрсөн үр дүн)',
  structureParts: [
    { text: 'If', part: 'modifier' },
    { text: 'had + V3 / V2', part: 'verb' },
    { text: ',', part: 'plain' },
    { text: 'would + V1 / would have + V3', part: 'verb' },
  ],
  tip: 'Хэсэг бүрээс «энэ хэзээний тухай вэ?» гэж асуу. Өнгөрсөн нөхцөл = had + V3 · одоогийн нөхцөл = Past Simple · одоогийн үр дүн = would + V1 · өнгөрсөн үр дүн = would have + V3.',
  examples: [
    { en: '[If](m) [I](s) [had studied](v) [medicine](o), [I](s) [would be](v) [a doctor](o) [now](m).', mn: 'Би анагаахад сурсан бол одоо эмч байх байсан. (сураагүй, эмч биш)' },
    { en: '[If](m) [you](s) [had taken](v) [the map](o), [we](s) [wouldn\'t be](v) [lost](o).', mn: 'Чи газрын зургаа авсан бол бид төөрөхгүй байх байсан. (аваагүй, одоо төөрчихсөн)' },
    { en: '[If](m) [I](s) [weren\'t](v) [afraid of flying](o), [I](s) [would have gone](v) [with them](m).', mn: 'Би нисэхээс айдаггүй байсан бол тэдэнтэй хамт явах байсан. (айдаг, яваагүй)' },
    { en: '[If](m) [she](s) [spoke](v) [Chinese](o), [she](s) [would have got](v) [the job](o).', mn: 'Тэр хятад хэлтэй байсан бол тэр ажилд орох байсан. (хэлгүй, ороогүй)' },
  ],
  useCases: [
    {
      title: 'Өнгөрсөн нөхцөл → одоогийн үр дүн',
      description: 'Хамгийн түгээмэл төрөл. Өнгөрсөнд болсон (эсвэл болоогүй) зүйлийн үр дагавар ОДОО мэдрэгдэж байна. if-ийн хэсэг Third conditional шиг Past Perfect, үр дүн Second conditional шиг would + V1. Үр дүнд now, today, still их тааралдана.',
      examples: [
        { en: '[If](m) [I](s) [had saved](v) [more money](o), [I](s) [would have](v) [my own flat](o) [now](m).', mn: 'Би илүү их мөнгө хуримтлуулсан бол одоо өөрийн гэсэн байртай байх байсан.' },
        { en: '[If](m) [he](s) [hadn\'t broken](v) [his leg](o), [he](s) [would be](v) [in the team](o) [today](m).', mn: 'Тэр хөлөө хугалаагүй бол өнөөдөр багт байх байсан.' },
        { en: '[If](m) [we](s) [had left](v) [on time](m), [we](s) [wouldn\'t be](v) [stuck in traffic](o).', mn: 'Бид цагтаа гарсан бол түгжрэлд гацахгүй байх байсан.' },
      ],
    },
    {
      title: 'Одоогийн нөхцөл → өнгөрсөн үр дүн',
      description: 'if-ийн хэсэг нь одоо ч, тэр үед ч үнэн байсан байнгын зүйл (зан чанар, чадвар, нөхцөл байдал) — Past Simple. Үр дүн нь өнгөрсөнд болсон тодорхой үйл явдал — would have + V3.',
      examples: [
        { en: '[If](m) [I](s) [were](v) [taller](o), [I](s) [would have joined](v) [the basketball team](o).', mn: 'Би өндөр байсан бол сагсан бөмбөгийн багт орох байсан.' },
        { en: '[If](m) [he](s) [didn\'t love](v) [her](o), [he](s) [wouldn\'t have married](v) [her](o).', mn: 'Тэр түүнд хайргүй байсан бол түүнтэй гэрлэхгүй байсан.' },
        { en: '[If](m) [I](s) [knew](v) [how to cook](o), [I](s) [would have made](v) [dinner](o) [last night](m).', mn: 'Би хоол хийж чаддаг байсан бол өчигдөр орой хоол хийх байсан.' },
      ],
    },
    {
      title: 'Цэвэр ба холимог нөхцөлийг харьцуулах',
      description: 'Нэг нөхцөлөөс хоёр өөр үр дүн гаргаж болно. Үр дүн өнгөрсөнд байвал Third, одоо байвал Mixed. Үр дүнгийн хэсгийн цагийн үг (then / now) шийднэ.',
      examples: [
        { en: '[If](m) [I](s) [had taken](v) [the job](o), [I](s) [would have moved](v) [to London](m).', mn: 'Би тэр ажлыг авсан бол Лондон руу нүүх байсан. (Third — үр дүн өнгөрсөнд)' },
        { en: '[If](m) [I](s) [had taken](v) [the job](o), [I](s) [would be living](v) [in London](m) [now](m).', mn: 'Би тэр ажлыг авсан бол одоо Лондонд амьдарч байх байсан. (Mixed — үр дүн одоо)' },
        { en: '[If](m) [I](s) [had](v) [a car](o), [I](s) [would drive](v) [you](o) [home](m).', mn: 'Надад машин байсан бол чамайг гэрт чинь хүргээд өгөх байсан. (Second — хоёулаа одоо)' },
      ],
    },
    {
      title: 'would-ын оронд could / might',
      description: 'Үр дүн нь баттай биш, боломж эсвэл чадвар бол would-ын оронд might (магадгүй), could (чадах байсан) хэрэглэнэ. Цагийн логик хэвээрээ.',
      examples: [
        { en: '[If](m) [you](s) [had listened](v) [to me](m), [you](s) [might be](v) [happier](o) [now](m).', mn: 'Чи намайг сонссон бол одоо арай жаргалтай байж магадгүй байсан.' },
        { en: '[If](m) [I](s) [had learnt](v) [to drive](o), [I](s) [could take](v) [you](o) [to the airport](m).', mn: 'Би жолоо сурсан бол чамайг онгоцны буудал хүргэж чадах байсан.' },
        { en: '[If](m) [she](s) [were](v) [more organised](o), [she](s) [might have finished](v) [on time](m).', mn: 'Тэр илүү зохион байгуулалттай байсан бол цагтаа дуусгаж магадгүй байсан.' },
      ],
    },
    {
      title: 'Өнгөрсөн нөхцөл → ирээдүйн үр дүн',
      description: 'Өнгөрсөнд болсон зүйл ирээдүйн төлөвлөгөөнд ч нөлөөлдөг. Үр дүнгийн хэсэгт would + V1 эсвэл would be + V-ing орж, tomorrow, next week гэх мэт ирээдүйн үг дагана.',
      examples: [
        { en: '[If](m) [I](s) [hadn\'t spent](v) [all my money](o), [I](s) [would come](v) [with you](m) [tomorrow](m).', mn: 'Би бүх мөнгөө үрээгүй бол маргааш чамтай хамт явах байсан.' },
        { en: '[If](m) [she](s) [hadn\'t hurt](v) [her knee](o), [she](s) [would be running](v) [in the race](m) [next week](m).', mn: 'Тэр өвдгөө гэмтээгээгүй бол ирэх долоо хоногт уралдаанд гүйх байсан.' },
        { en: '[If](m) [we](s) [had booked](v) [in advance](m), [we](s) [would be flying](v) [to Jeju](m) [on Friday](m).', mn: 'Бид урьдчилж захиалсан бол баасан гарагт Жэжү рүү нисэх байсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Өнгөрсөн нөхцөл → одоогийн үр дүн',
      structure: 'If + subject + had (not) + V3, subject + would (not) + V1',
      examples: [
        { en: '[If](m) [I](s) [had gone](v) [to bed](m) [earlier](m), [I](s) [wouldn\'t be](v) [so tired](o) [now](m).', mn: 'Би эрт унтсан бол одоо ийм ядрахгүй байх байсан.' },
        { en: '[If](m) [they](s) [hadn\'t helped](v) [us](o), [we](s) [would still be](v) [in debt](o).', mn: 'Тэд бидэнд туслаагүй бол бид одоо ч өртэй байх байсан.' },
        { en: '[If](m) [you](s) [had charged](v) [your phone](o), [it](s) [would work](v) [now](m).', mn: 'Чи утсаа цэнэглэсэн бол одоо ажиллах байсан.' },
      ],
    },
    {
      label: 'Одоогийн нөхцөл → өнгөрсөн үр дүн',
      structure: 'If + subject + V2 / were (not), subject + would (not) have + V3',
      examples: [
        { en: '[If](m) [I](s) [were](v) [you](o), [I](s) [would have accepted](v) [the offer](o).', mn: 'Би чиний оронд байсан бол тэр саналыг хүлээж авах байсан.' },
        { en: '[If](m) [he](s) [weren\'t](v) [so lazy](o), [he](s) [would have passed](v) [the exam](o).', mn: 'Тэр ийм залхуу биш байсан бол шалгалтандаа тэнцэх байсан.' },
        { en: '[If](m) [we](s) [had](v) [a bigger car](o), [we](s) [would have taken](v) [everyone](o).', mn: 'Бид илүү том машинтай байсан бол бүгдийг нь авч явах байсан.' },
      ],
    },
    {
      label: 'Асуулт ба үр дүн эхэндээ',
      structure: '(Wh-) + would + subject + V1 / have + V3 + if …? · Үр дүн + if + нөхцөл (таслалгүй)',
      examples: [
        { en: '[Where](m) [would](v) [you](s) [be](v) [now](m) [if](m) [you](s) [hadn\'t met](v) [her](o)?', mn: 'Чи түүнтэй танилцаагүй бол одоо хаана байх байсан бэ?' },
        { en: '[Would](v) [you](s) [have helped](v) [him](o) [if](m) [he](s) [weren\'t](v) [your friend](o)?', mn: 'Тэр чиний найз биш байсан бол чи түүнд туслах байсан уу?' },
        { en: '[I](s) [would be](v) [rich](o) [if](m) [I](s) [had bought](v) [those shares](o).', mn: 'Би тэр хувьцааг авсан бол баян байх байсан.' },
      ],
    },
    {
      label: 'would be + V-ing / could / might',
      structure: 'If + had + V3, would be + V-ing / could + V1 / might + V1 · If + V2, could / might have + V3',
      examples: [
        { en: '[If](m) [it](s) [hadn\'t rained](v), [we](s) [would be sitting](v) [in the park](m) [now](m).', mn: 'Бороо ороогүй бол бид одоо цэцэрлэгт сууж байх байсан.' },
        { en: '[If](m) [I](s) [had kept](v) [the receipt](o), [I](s) [could return](v) [these shoes](o).', mn: 'Би баримтаа хадгалсан бол энэ гутлыг буцааж чадах байсан.' },
        { en: '[If](m) [he](s) [were](v) [more patient](o), [he](s) [might have stayed](v) [in that job](m).', mn: 'Тэр илүү тэвчээртэй байсан бол тэр ажилдаа үлдэж магадгүй байсан.' },
      ],
    },
  ],
  signalWords: ['now', 'today', 'still', 'at the moment', 'yesterday', 'last year', 'then', 'if I had …, I would be', 'if I were …, I would have'],
  notes: [
    'Цагийн үгс зам заана: үр дүнгийн хэсэгт now, today, still, at the moment байвал would + V1 (would have + V3 биш). if-ийн хэсэгт yesterday, last year, this morning байвал Past Perfect.',
    '2-р төрлийн if-ийн хэсэг нь нэг удаагийн үйл явдал биш, байнгын үнэн байх ёстой (зан чанар, чадвар, нөхцөл байдал): If I were braver, If I spoke English. Нэг удаагийн өнгөрсөн үйлдэл бол Past Perfect хэрэгтэй.',
    'if-ийн хэсэгт would орохгүй — холимог нөхцөлд ч адил: If I would have studied (буруу) → If I had studied (зөв).',
    'Товчлол \'d-г ялгаарай: if-ийн хэсэгт I\'d = I had (If I\'d known), үр дүнгийн хэсэгт I\'d = I would (I\'d be). Ард нь V3 байвал had, V1 байвал would.',
    'be үйл үг бодит бус нөхцөлд бүх биед were байх нь зөв хэлбэр (If I were, If he were). Ярианд was ч хэрэглэдэг ч If I were you гэсэн хэллэгт үргэлж were.',
    'B1-ийн 15-р дүрмийн wish-тэй логик нэг: I wish I had studied medicine (өнгөрсөн харамсал) + I would be a doctor now (одоогийн үр дүн) = If I had studied medicine, I would be a doctor now.',
  ],
  commonMistakes: [
    {
      wrong: 'If I had slept well, I wouldn\'t have been tired now.',
      correct: 'If I had slept well, I wouldn\'t be tired now.',
      explanation: 'now — үр дүн одоо байна, тиймээс would + V1. would have + V3 нь өнгөрсөн үр дүнд хэрэглэгддэг. Third conditional-ыг цээжээр хэрэглэхээс өмнө үр дүн хэзээний тухай болохыг шалга.',
    },
    {
      wrong: 'If I would have saved money, I would be rich now.',
      correct: 'If I had saved money, I would be rich now.',
      explanation: 'if-ийн хэсэгт would хэзээ ч орохгүй. Өнгөрсөн бодит бус нөхцөлд Past Perfect: had saved.',
    },
    {
      wrong: 'If he is more careful, he wouldn\'t have lost his passport.',
      correct: 'If he were more careful, he wouldn\'t have lost his passport.',
      explanation: 'Бодит бус нөхцөл (тэр болгоомжгүй хүн) тул Present биш Past Simple: were. is гэвэл бодит нөхцөл болж, үр дүнгийн would have-тай таарахгүй.',
    },
    {
      wrong: 'If I didn\'t miss the bus this morning, I would be at work now.',
      correct: 'If I hadn\'t missed the bus this morning, I would be at work now.',
      explanation: 'Автобуснаас хоцорсон нь өнөө өглөө болсон нэг удаагийн өнгөрсөн үйл явдал — Past Perfect хэрэгтэй. Past Simple нь зөвхөн одоогийн / байнгын бодит бус нөхцөлд.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «-сан бол … байх байсан» гэсэн нэг хэв маяг Second, Third, Mixed гурвыг бүгдийг илэрхийлдэг. Ялгааг зөвхөн «одоо», «өчигдөр» гэх үгс гаргана. Англиар бол эдгээр үгс байсан ч үйл үгийн хэлбэр заавал тохирох ёстой.',
      '«Би анагаахад сурсан бол одоо эмч байх байсан» — монгол өгүүлбэрийн «одоо» гэдэг үг англиар would be-г сонгох дохио. «Одоо» байвал would have been гэж бүү бич.',
      'Монголоор «би ичимхий биш байсан бол» гэхэд энэ нь одоо ч үнэн байнгын шинж үү, зөвхөн тэр өдрийн байдал уу гэдэг ялгардаггүй. Англиар байнгын шинж бол If I weren\'t shy, тухайн үеийн байдал бол If I hadn\'t been shy гэж ялгана.',
      'Монгол хэлэнд нөхцөл үргэлж эхэнд ирдэг («… бол …»). Англиар if-ийн хэсэг эхэнд ч, сүүлд ч байж болно; сүүлд байвал таслал тавихгүй: I would be a doctor now if I had studied medicine.',
    ],
  },
  dialogue: [
    {
      en: 'Saraa, [why](m) [are](v) [you](s) [still at the office](o)?',
      mn: 'Сараа, чи яагаад одоо болтол оффис дээрээ байгаа юм бэ?',
      speaker: 'Bat',
    },
    {
      en: '[If](m) [I](s) [had finished](v) [the report](o) [yesterday](m), [I](s) [would be](v) [at home](o) [now](m).',
      mn: 'Би өчигдөр тайлангаа дуусгасан бол одоо гэртээ байх байсан.',
      speaker: 'Saraa',
    },
    {
      en: '[If](m) [you](s) [weren\'t](v) [such a perfectionist](o), [you](s) [would have finished](v) [it](o) [days ago](m).',
      mn: 'Чи ийм төгс төгөлдөрийг эрхэмлэгч биш байсан бол хэдэн өдрийн өмнө дуусгачих байсан.',
      speaker: 'Bat',
    },
    {
      en: 'Maybe. [But](m) [if](m) [I](s) [hadn\'t checked](v) [everything](o) [twice](m), [we](s) [would be](v) [in trouble](o) [now](m).',
      mn: 'Магадгүй. Гэхдээ би бүгдийг хоёр удаа шалгаагүй бол бид одоо асуудалд орчихсон байх байсан.',
      speaker: 'Saraa',
    },
    {
      en: 'True. [If](m) [I](s) [were](v) [as careful as you](o), [I](s) [wouldn\'t have sent](v) [that email](o) [to the wrong client](m).',
      mn: 'Үнэн. Би чам шиг болгоомжтой байсан бол тэр имэйлийг буруу үйлчлүүлэгч рүү явуулахгүй байсан.',
      speaker: 'Bat',
    },
    {
      en: 'Exactly! [Now](m) [help](v) [me](o), [and](m) [we](s) [can both go](v) [home](m).',
      mn: 'Яг тийм! Одоо надад тусал, тэгвэл бид хоёулаа гэртээ харьж чадна.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'b2-03-1',
      ruleId: 3,
      kind: 'fill',
      question: 'If I had taken that job in London, I ___ in England now.',
      options: ['would have lived', 'would be living', 'will be living', 'had been living'],
      answer: 'would be living',
      explanation: 'Нөхцөл өнгөрсөнд (had taken), үр дүн одоо (now) — холимог нөхцөл: would + V1 / would be + V-ing. would have lived нь өнгөрсөн үр дүн тул now-тай таарахгүй; will ба had been бодит бус үр дүнд орохгүй.',
      hint: 'now = одоогийн үр дүн.',
    },
    {
      id: 'b2-03-2',
      ruleId: 3,
      kind: 'fill',
      question: 'If she ___ so shy, she would have spoken to him at the party last night.',
      options: ['isn\'t', 'wouldn\'t be', 'weren\'t', 'won\'t be'],
      answer: 'weren\'t',
      explanation: 'Ичимхий зан нь байнгын шинж — одоогийн бодит бус нөхцөл: Past Simple (weren\'t). Үр дүн өнгөрсөнд (would have spoken). if-ийн хэсэгт would / will орохгүй, isn\'t бол бодит нөхцөл.',
      hint: 'Байнгын зан чанар → Past Simple.',
    },
    {
      id: 'b2-03-3',
      ruleId: 3,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'If I would have studied medicine, I would be a doctor now.',
        'If we had bought the tickets, we will be at the concert now.',
        'If he was more careful, he wouldn\'t have crash the car.',
        'If I had gone to bed earlier, I wouldn\'t be so tired now.',
      ],
      answer: 'If I had gone to bed earlier, I wouldn\'t be so tired now.',
      explanation: 'If + Past Perfect, would + V1 — өнгөрсөн нөхцөл, одоогийн үр дүн, зөв. Бусад нь: if-ийн хэсэгт would have орохгүй; бодит бус үр дүнд will биш would; would have-ийн ард V3 (crashed) байх ёстой.',
      hint: 'If + had V3, would + V1 … now.',
    },
    {
      id: 'b2-03-4',
      ruleId: 3,
      kind: 'translate',
      question: 'Би өглөөний цайгаа уусан бол одоо өлсөхгүй байх байсан.',
      options: [
        'If I had breakfast, I wouldn\'t have been hungry now.',
        'If I had had breakfast, I wouldn\'t be hungry now.',
        'If I have had breakfast, I won\'t be hungry now.',
        'If I would have breakfast, I wouldn\'t be hungry now.',
      ],
      answer: 'If I had had breakfast, I wouldn\'t be hungry now.',
      explanation: '«Уусан бол» — өнгөрсөн бодит бус нөхцөл: had had (have-ийн Past Perfect). «Одоо өлсөхгүй байх байсан» — одоогийн үр дүн: wouldn\'t be. Бусад хувилбарт цаг нь солигдсон, эсвэл if-ийн хэсэгт would орсон.',
      hint: 'Өнгөрсөн нөхцөл + «одоо» үр дүн.',
    },
  ],
};
