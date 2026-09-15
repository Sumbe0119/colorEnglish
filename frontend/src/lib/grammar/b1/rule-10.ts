// frontend/src/lib/grammar/b1/rule-10.ts
// B1 дүрэм 10: Modals of deduction — must / may / might / could / can't
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule10: GrammarRule = {
  id: 10,
  title: 'Modals of deduction: must / might / can\'t (have)',
  titleMn: 'Таамаглалын модаль үгс — гарцаагүй, магадгүй, байж таарахгүй',
  hook: '«Гэрэл нь асаалттай байна — тэр гэртээ байгаа нь гарцаагүй», «Тэр залгаагүй — унтчихсан байж магадгүй» — нотолгоонд тулгуурлан дүгнэлт хийж сурцгаая.',
  summary: 'must (гарцаагүй, 90%+ итгэлтэй), may / might / could (магадгүй, 50%), can\'t (байж таарахгүй, боломжгүй) нь нотолгоонд тулгуурласан логик дүгнэлтийг заана. Одоогийн байдалд модаль + V1 / be + V-ing, өнгөрсөн байдалд модаль + have + V3 хэрэглэнэ.',
  description: 'A2 түвшинд бид must-ыг «заавал ёстой» (You must wear a seatbelt), could / might-ийг «магадгүй, боломж» (It might rain) гэсэн утгаар үзсэн. B1-д эдгээр модаль үгсийн ХОЁР ДАХЬ, маш чухал утгыг үзнэ: нотолгоонд тулгуурласан ТААМАГЛАЛ, ДҮГНЭЛТ (deduction). Ямар нэг нотолгоо хараад логикоор дүгнэнэ: The light is on — she must be at home (гэрэл асаалттай, тэгэхээр тэр гэртээ байгаа нь гарцаагүй). Гурван түвшин байна: must = бараг итгэлтэй (90%+), may / might / could = магадгүй (50%), can\'t = боломжгүй (0%). Анхаар: must-ын эсрэг нь mustn\'t БИШ, can\'t. He can\'t be 50 — he looks 30! Өнгөрсөн байдлын тухай дүгнэхдээ модаль + have + V3 хэрэглэнэ: She must have missed the bus (автобусаа алдсан нь гарцаагүй), He might have forgotten (мартсан байж магадгүй), They can\'t have left yet (явчихсан байж таарахгүй). Яг одоо болж байгаа зүйлд модаль + be + V-ing: He must be sleeping. Монголоор «гарцаагүй», «байх», «байж магадгүй», «байж таарахгүй» гэсэн үгс энэ гурван түвшнийг сайн илэрхийлдэг тул монгол орчуулга нь модаль сонгоход туслана.',
  structure: 'Subject + must / might / can\'t + Verb1 (одоо) · Subject + must / might / can\'t + have + Verb3 (өнгөрсөн)',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'must / might / can\'t', part: 'verb' },
    { text: 'be / Verb1', part: 'verb' },
    { text: '· have + Verb3 (өнгөрсөн)', part: 'modifier' },
  ],
  tip: 'must = «гарцаагүй» (90%) · might / may / could = «магадгүй» (50%) · can\'t = «байж таарахгүй» (0%). Өнгөрсөнд + have + V3. must-ын эсрэг нь can\'t, mustn\'t биш!',
  examples: [
    { en: '[The lights](s) [are](v) [on](m). [She](s) [must be](v) [at home](m).', mn: 'Гэрэл асаалттай байна. Тэр гэртээ байгаа нь гарцаагүй.' },
    { en: '[He](s) [isn\'t answering](v). [He](s) [might be](v) [in a meeting](m).', mn: 'Тэр утсаа авахгүй байна. Хуралд байж магадгүй.' },
    { en: '[That](s) [can\'t be](v) [Bat](o). [He](s)[\'s](v) [in Korea](m) [now](m).', mn: 'Тэр Бат байж таарахгүй. Тэр одоо Солонгост байгаа.' },
    { en: '[The ground](s) [is](v) [wet](o). [It](s) [must have rained](v) [last night](m).', mn: 'Газар нойтон байна. Өчигдөр шөнө бороо орсон нь гарцаагүй.' },
  ],
  useCases: [
    {
      title: 'Бараг итгэлтэй дүгнэлт — must',
      description: 'Нотолгоо хүчтэй, өөр тайлбар бараг байхгүй үед must. «Гарцаагүй … байх», «… байлгүй яахав» гэсэн утга. A2-ийн must (заавал ёстой)-оос утга нь огт өөр — контекстээс ялгана.',
      examples: [
        { en: '[You](s)[\'ve been working](v) [all day](m). [You](s) [must be](v) [exhausted](o).', mn: 'Чи өдөржин ажилласан. Ядарсан нь гарцаагүй.' },
        { en: '[She](s) [speaks](v) [perfect Japanese](o). [She](s) [must have lived](v) [in Japan](m).', mn: 'Тэр японоор төгс ярьдаг. Японд амьдарч байсан нь гарцаагүй.' },
        { en: '[His car](s) [is](v) [outside](m). [He](s) [must be](v) [here](m).', mn: 'Түүний машин гадаа байна. Тэр энд байгаа нь гарцаагүй.' },
      ],
    },
    {
      title: 'Боломжтой, магадгүй — may / might / could',
      description: 'Хэд хэдэн тайлбар боломжтой, аль нь ч байж болно гэсэн үед. may, might, could гурвуулаа бараг ижил утгатай; might арай эргэлзээтэй. Үгүйсгэл нь may not / might not (couldn\'t биш — couldn\'t нь can\'t-тай адил «боломжгүй»).',
      examples: [
        { en: '[Where](m)[\'s](v) [Tuya](s)? — [She](s) [might be](v) [in the library](m).', mn: 'Туяа хаана байна? — Номын санд байж магадгүй.' },
        { en: '[Don\'t eat that](v). [It](s) [could be](v) [bad](o).', mn: 'Түүнийг битгий ид. Муудсан байж магадгүй.' },
        { en: '[He](s) [may not know](v) [about the meeting](o).', mn: 'Тэр хурлын тухай мэдэхгүй байж магадгүй.' },
      ],
    },
    {
      title: 'Боломжгүй — can\'t',
      description: 'Нотолгоо ямар нэг зүйлийг үгүйсгэж байвал can\'t (эсвэл couldn\'t). «Байж таарахгүй», «байх боломжгүй». must-ын эсрэг утга нь энэ. mustn\'t гэвэл «хориотой» гэсэн A2-ийн утга гарна.',
      examples: [
        { en: '[She](s) [can\'t be](v) [hungry](o). [She](s)[\'s just eaten](v) [a big lunch](o).', mn: 'Тэр өлссөн байж таарахгүй. Сая л том хоол идсэн.' },
        { en: '[That](s) [can\'t be](v) [true](o)!', mn: 'Тийм байж таарахгүй! (Тэр үнэн байх боломжгүй!)' },
        { en: '[He](s) [can\'t be](v) [Saraa\'s brother](o). [He](s)[\'s](v) [too old](o).', mn: 'Тэр Сараагийн ах байж таарахгүй. Хэтэрхий том хүн.' },
      ],
    },
    {
      title: 'Өнгөрсний тухай дүгнэлт — модаль + have + V3',
      description: 'Аль хэдийн болсон зүйлийн тухай дүгнэхэд must have / might have / can\'t have + V3. Модаль үг өөрөө өнгөрсөн хэлбэргүй тул have + V3 нэмж өнгөрснийг заана.',
      examples: [
        { en: '[The door](s) [is](v) [open](o). [Someone](s) [must have forgotten](v) [to lock it](o).', mn: 'Хаалга онгорхой байна. Хэн нэгэн цоожлохоо мартсан нь гарцаагүй.' },
        { en: '[He](s) [didn\'t come](v). [He](s) [might have got](v) [lost](o).', mn: 'Тэр ирээгүй. Төөрсөн байж магадгүй.' },
        { en: '[She](s) [can\'t have finished](v) [already](m). [She](s) [started](v) [an hour ago](m).', mn: 'Тэр аль хэдийн дуусгасан байж таарахгүй. Нэг цагийн өмнө л эхэлсэн.' },
      ],
    },
    {
      title: 'Яг одоо болж байгаа зүйлийн тухай — модаль + be + V-ing',
      description: 'Одоо үргэлжилж байгаа үйлдлийн тухай дүгнэхэд модаль + be + V-ing. Мөн A2-ийн модаль (заавал ёстой, зөвшөөрөл)-оос ялгаа нь энд байна: You must be joking (чи тоглож байгаа нь гарцаагүй) — «заавал тогло» биш.',
      examples: [
        { en: '[Don\'t phone now](v). [They](s) [must be having](v) [dinner](o).', mn: 'Одоо битгий залга. Тэд оройн хоолоо идэж байгаа нь гарцаагүй.' },
        { en: '[She](s) [isn\'t here](v). [She](s) [might be working](v) [late](m).', mn: 'Тэр энд байхгүй. Оройтож ажиллаж байж магадгүй.' },
        { en: '[You](s) [can\'t be serious](v)! [You](s) [must be joking](v).', mn: 'Чи нухацтай байж таарахгүй! Тоглож байгаа нь гарцаагүй.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Одоогийн байдал — модаль + be / V1',
      structure: 'must / may / might / could / can\'t + be + adjective / noun · + V1',
      examples: [
        { en: '[He](s) [must be](v) [tired](o) [after the flight](m).', mn: 'Нислэгийн дараа тэр ядарсан нь гарцаагүй.' },
        { en: '[It](s) [might be](v) [a mistake](o).', mn: 'Энэ алдаа байж магадгүй.' },
        { en: '[They](s) [can\'t know](v) [the answer](o) [yet](m).', mn: 'Тэд хариултыг хараахан мэдэхгүй байх боломжтой. (мэддэг байж таарахгүй)' },
      ],
    },
    {
      label: 'Яг одоо — модаль + be + V-ing',
      structure: 'must / might / can\'t + be + V-ing',
      examples: [
        { en: '[She](s) [must be sleeping](v). [Her light](s) [is](v) [off](m).', mn: 'Тэр унтаж байгаа нь гарцаагүй. Гэрэл нь унтраалттай.' },
        { en: '[He](s) [might be driving](v), [so](m) [he](s) [can\'t answer](v).', mn: 'Тэр машин жолоодож байж магадгүй, тиймээс утсаа авч чадахгүй.' },
        { en: '[They](s) [can\'t be studying](v) — [I](s) [can hear](v) [music](o).', mn: 'Тэд хичээл хийж байгаа байж таарахгүй — хөгжим сонсогдож байна.' },
      ],
    },
    {
      label: 'Өнгөрсөн байдал — модаль + have + V3',
      structure: 'must have / might have / may have / could have / can\'t have + V3',
      examples: [
        { en: '[I](s) [can\'t find](v) [my wallet](o). [I](s) [must have left](v) [it](o) [at home](m).', mn: 'Түрийвчээ олохгүй байна. Гэртээ орхисон нь гарцаагүй.' },
        { en: '[She](s) [may have missed](v) [the train](o).', mn: 'Тэр галт тэргээ алдсан байж магадгүй.' },
        { en: '[He](s) [can\'t have seen](v) [us](o). [He](s) [didn\'t say](v) [hello](o).', mn: 'Тэр биднийг харсан байж таарахгүй. Мэндлээгүй шүү дээ.' },
      ],
    },
    {
      label: 'Өнгөрсөн үргэлжилсэн — модаль + have been + V-ing',
      structure: 'must / might / can\'t + have been + V-ing',
      examples: [
        { en: '[Her eyes](s) [are](v) [red](o). [She](s) [must have been crying](v).', mn: 'Нүд нь улаан байна. Уйлж байсан нь гарцаагүй.' },
        { en: '[He](s) [might have been sleeping](v) [when you called](m).', mn: 'Чамайг залгахад тэр унтаж байсан байж магадгүй.' },
        { en: '[They](s) [can\'t have been working](v) — [the office](s) [was](v) [closed](o).', mn: 'Тэд ажиллаж байсан байж таарахгүй — оффис хаалттай байсан.' },
      ],
    },
  ],
  signalWords: ['must be', 'might be', 'may be', 'could be', 'can\'t be', 'must have', 'might have', 'can\'t have', 'probably', 'perhaps'],
  notes: [
    'Таамаглалын must-ын эсрэг нь can\'t, mustn\'t биш. He mustn\'t be at home гэвэл «тэр гэртээ байж болохгүй» (хориг) гэсэн утга гарна. «Гэртээ байж таарахгүй» бол He can\'t be at home.',
    'may / might / could гурав таамаглалд бараг ижил. Гэхдээ үгүйсгэлд couldn\'t нь can\'t-тай адил «боломжгүй» утгатай, харин may not / might not «магадгүй … биш» гэсэн утгатай.',
    'Өнгөрсний таамаглалд must have + V3: must had гэж хэлэхгүй, must have + V2 гэж хэлэхгүй (must have went буруу → must have gone).',
    'Ярианы хэлэнд must have → must\'ve, might have → might\'ve, can\'t have → can\'t\'ve гэж богино дуудна. Бичихдээ have гэж бүтэн бичнэ, of гэж бичихгүй.',
    'A2-ийн must (заавал ёстой) ба B1-ийн must (гарцаагүй) хоёрыг контекстээс ялгана: You must wear a helmet (дүрэм) — You must be cold (дүгнэлт). Ард нь be + тэмдэг нэр байвал ихэвчлэн дүгнэлт.',
    'Таамаглал биш, зүгээр л магадлалыг хэлэхэд probably, perhaps, maybe хэрэглэж болно: She is probably at home = She must be at home (арай сул).',
  ],
  commonMistakes: [
    {
      wrong: 'He mustn\'t be at home. His car isn\'t there.',
      correct: 'He can\'t be at home. His car isn\'t there.',
      explanation: 'Таамаглалын үгүйсгэлд can\'t хэрэглэнэ. mustn\'t «хориотой» гэсэн утгатай. Монголоор «байж таарахгүй» = can\'t be.',
    },
    {
      wrong: 'She must had missed the bus.',
      correct: 'She must have missed the bus.',
      explanation: 'Модаль үгийн ард үргэлж have + V3, had биш. Бүх биед have (has ч биш): He must have, She must have.',
    },
    {
      wrong: 'You must be very tired yesterday.',
      correct: 'You must have been very tired yesterday.',
      explanation: 'yesterday — өнгөрсөн байдлын тухай дүгнэж байна, тэгэхээр must have been. must be зөвхөн одоогийн байдалд.',
    },
    {
      wrong: 'It can be Bat at the door — he said he would come.',
      correct: 'It might be Bat at the door — he said he would come.',
      explanation: 'Таамаглалд can батлах хэлбэрт хэрэглэгддэггүй — зөвхөн can\'t (үгүйсгэл) хэрэглэнэ. «Байж магадгүй» гэхэд might / may / could.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор таамаглалыг «байх» (гэртээ байгаа байх), «гарцаагүй», «байлгүй яахав» гэж илэрхийлдэг нь must-тай таардаг. «Байж магадгүй» = might / may / could. «Байж таарахгүй», «байх боломжгүй» = can\'t. Гурван түвшин монголоор тодорхой ялгагддаг тул сонголт хийхэд амар.',
      'Монголоор «ёстой» гэсэн нэг үг «заавал» (A2 must) болон «гарцаагүй» (B1 must) хоёуланд нь ордоггүй — монголд эдгээр нь өөр үг. Англиар нэг must хоёр утгатай тул контекстээс (дүрэм үү, дүгнэлт үү) ялгана.',
      'Монголоор өнгөрсний таамаглалыг «-сан байх», «-сан нь гарцаагүй», «-сан байж магадгүй» гэж үйл үгийн өнгөрсөн хэлбэр дээр нэмдэг. Англиар модаль үг өөрөө өнгөрсөн хэлбэргүй тул have + V3 нэмдэг: «мартсан нь гарцаагүй» = must have forgotten.',
      'Монголоор «байж таарахгүй» гэдэг нь «болохгүй» (хориг)-оос тодорхой ялгаатай. Англиар can\'t (таамаглал) ба mustn\'t (хориг) хоёрыг андуурах алдаа их гардаг тул монголоор бодохдоо «таарахгүй» → can\'t, «болохгүй» → mustn\'t гэж санаарай.',
    ],
  },
  dialogue: [
    {
      en: 'Bat, [Tuya](s) [isn\'t answering](v) [her phone](o). [Where](m) [could](v) [she](s) [be](v)?',
      mn: 'Бат, Туяа утсаа авахгүй байна. Хаана байж болох вэ?',
      speaker: 'Saraa',
    },
    {
      en: '[It](s)[\'s](v) [two o\'clock](o). [She](s) [must be](v) [at work](m). [She](s) [can\'t answer](v) [during meetings](m).',
      mn: 'Хоёр цаг болж байна. Тэр ажилдаа байгаа нь гарцаагүй. Хурлын үеэр утсаа авч чадахгүй.',
      speaker: 'Bat',
    },
    {
      en: '[But](m) [she](s) [said](v) [she had a day off today](o).',
      mn: 'Гэхдээ тэр өнөөдөр амралттай гэж хэлсэн шүү дээ.',
      speaker: 'Saraa',
    },
    {
      en: 'Hmm, [then](m) [she](s) [can\'t be](v) [at work](m). [She](s) [might be](v) [at the gym](m). [Or](m) [she](s) [might have forgotten](v) [her phone](o) [at home](m).',
      mn: 'Хмм, тэгвэл ажилдаа байж таарахгүй. Фитнесст байж магадгүй. Эсвэл утсаа гэртээ мартсан байж магадгүй.',
      speaker: 'Bat',
    },
    {
      en: 'Wait, [there](s)[\'s](v) [a message](o). [She](s) [says](v) [she\'s at the dentist](o).',
      mn: 'Хүлээгээрэй, мессеж ирлээ. Шүдний эмч дээр байна гэж байна.',
      speaker: 'Saraa',
    },
    {
      en: 'Ah! [That](s) [must have been](v) [painful](o). [No wonder](m) [she](s) [didn\'t pick up](v).',
      mn: 'Аа! Өвдсөн нь гарцаагүй. Утсаа аваагүй нь ойлгомжтой.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'b1-10-1',
      ruleId: 10,
      kind: 'fill',
      question: 'The lights are off and the car isn\'t there. They ___ be at home.',
      options: ['must', 'can\'t', 'mustn\'t', 'might'],
      answer: 'can\'t',
      explanation: 'Нотолгоо (гэрэл унтарсан, машин байхгүй) гэртээ байхыг үгүйсгэж байна — «байж таарахгүй» = can\'t. mustn\'t «хориотой» гэсэн утга.',
      hint: 'Таамаглалын үгүйсгэл.',
    },
    {
      id: 'b1-10-2',
      ruleId: 10,
      kind: 'fill',
      question: 'The streets are wet. It ___ last night.',
      options: ['must rain', 'must have rained', 'must had rained', 'can\'t have rained'],
      answer: 'must have rained',
      explanation: 'Өнгөрсөн шөнийн тухай дүгнэлт — must have + V3. Гудамж нойтон гэсэн нотолгоо хүчтэй тул must. must had буруу хэлбэр.',
      hint: 'Өнгөрсний тухай хүчтэй дүгнэлт.',
    },
    {
      id: 'b1-10-3',
      ruleId: 10,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'She mustn\'t be Mongolian — she doesn\'t speak Mongolian.',
        'He must have went home early.',
        'You\'ve worked 12 hours. You must be exhausted.',
        'It can be Saraa at the door, maybe.',
      ],
      answer: 'You\'ve worked 12 hours. You must be exhausted.',
      explanation: 'Хүчтэй нотолгоо + must be — зөв. Таамаглалын үгүйсгэлд can\'t (mustn\'t биш); must have + V3 (gone); батлах таамаглалд can биш might.',
      hint: 'must be + тэмдэг нэр = дүгнэлт.',
    },
    {
      id: 'b1-10-4',
      ruleId: 10,
      kind: 'translate',
      question: 'Тэр түлхүүрээ гэртээ мартсан байж магадгүй.',
      options: [
        'He might have left his keys at home.',
        'He must leave his keys at home.',
        'He can\'t have left his keys at home.',
        'He might leave his keys at home.',
      ],
      answer: 'He might have left his keys at home.',
      explanation: '«Мартсан байж магадгүй» — өнгөрсөн (мартсан) + магадгүй (might). might have + V3. might leave гэвэл одоо/ирээдүй болно.',
      hint: '«Магадгүй» + өнгөрсөн.',
    },
  ],
};
