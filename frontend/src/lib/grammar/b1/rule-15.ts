// frontend/src/lib/grammar/b1/rule-15.ts
// B1 дүрэм 15: wish / if only / would rather / it's time
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule15: GrammarRule = {
  id: 15,
  title: 'wish / if only / would rather',
  titleMn: 'wish / if only / would rather — хүсэл, харамсал, илүүд үзэх',
  hook: '«Би баян байсан бол», «Би түүнд хэлээгүй байсан бол», «Чи тамхи татахаа болиосой» — бодит байдлаас өөр байгаасай гэсэн хүслээ илэрхийлж сурцгаая.',
  summary: 'wish / if only + Past Simple нь одоогийн бодит бус хүсэл (I wish I were taller — би өндөр биш), + Past Perfect нь өнгөрсний харамсал (I wish I had studied — сураагүй), + would нь бусдын зан үйл өөрчлөгдөөсэй гэсэн гомдол (I wish you would stop). would rather + V1 илүүд үзэхийг, it\'s time + Past Simple одоо хийх цаг болсныг заана.',
  description: 'B1-ийн 5, 6-р дүрэмд бид Second conditional (If I had money, I would …) болон Third conditional (If I had known, I would have …) гэсэн бодит бус нөхцөлүүдийг үзсэн. wish бол нөхцөлийн if-ийн хэсгийг дангаар нь хүсэл болгон хэлэх арга юм. Цагийн ухралт нөхцөлтэй яг адил: одоогийн бодит бус хүсэлд Past Simple (I wish I had a car — надад машин байхгүй, байгаасай), өнгөрсний харамсалд Past Perfect (I wish I had bought it — аваагүй, авсан бол). Гурав дахь хэлбэр нь wish + would: бусад хүн, гадаад нөхцөл өөрчлөгдөөсэй гэсэн гомдол, уцаар (I wish you would listen — чи сонсдоггүй, сонсоосой). Өөрийнхөө тухай wish I would гэж хэлэхгүй. if only нь wish-тэй адил, гэхдээ илүү хүчтэй сэтгэл хөдлөлтэй. Мөн энэ бүлэгт would rather (илүүд үзэх: I\'d rather stay home — гэртээ байсан нь дээр) болон it\'s time (одоо хийх цаг болсон: It\'s time we left — явах цаг болжээ) орно, учир нь эдгээр ч Past Simple-ийг «бодит бус» утгаар хэрэглэдэг. Монголоор «-сан бол», «-аасай/-оосой», «-сан нь дээр», «-х цаг болжээ» гэсэн хэлбэрүүд эдгээр утгыг тодорхой ялгаж өгдөг.',
  structure: 'I wish / If only + subject + Past Simple (одоо) / Past Perfect (өнгөрсөн) / would + V1 (гомдол) · would rather + V1 · It\'s time + subject + Past Simple',
  structureParts: [
    { text: 'I', part: 'subject' },
    { text: 'wish', part: 'verb' },
    { text: 'I had / I had had / you would', part: 'plain' },
    { text: '· I\'d rather + V1', part: 'modifier' },
  ],
  tip: 'wish + Past Simple = одоо тийм биш, тийм байгаасай · wish + Past Perfect = өнгөрсөнд тэгсэн бол · wish + would = бусад өөрчлөгдөөсэй (гомдол) · would rather + V1 = илүүд үзэх · it\'s time + Past Simple = одоо хийх цаг.',
  examples: [
    { en: '[I](s) [wish](v) [I had more free time](o).', mn: 'Надад илүү чөлөөт цаг байгаасай. (одоо байхгүй)' },
    { en: '[I](s) [wish](v) [I hadn\'t said that](o).', mn: 'Би тэгж хэлээгүй байсан бол. (хэлчихсэн, харамсаж байна)' },
    { en: '[I](s) [wish](v) [you would stop smoking](o).', mn: 'Чи тамхи татахаа болиосой. (болихгүй байна, гомдол)' },
    { en: '[I](s)[\'d rather](v) [stay](v) [at home](m) [tonight](m).', mn: 'Би өнөө орой гэртээ байсан нь дээр.' },
  ],
  useCases: [
    {
      title: 'Одоогийн бодит бус хүсэл — wish + Past Simple',
      description: 'Одоо тийм биш зүйлийг «тийм байгаасай» гэж хүснэ. Second conditional-ын if-ийн хэсэгтэй адил Past Simple. be нь were (бүх биед). Хүсэл биелэх магадлал бага эсвэл байхгүй.',
      examples: [
        { en: '[I](s) [wish](v) [I were taller](o).', mn: 'Би өндөр байгаасай. (би намхан)' },
        { en: '[She](s) [wishes](v) [she lived near the sea](o).', mn: 'Тэр далайн ойролцоо амьдардаг байгаасай гэж хүсдэг.' },
        { en: '[I](s) [wish](v) [I could speak Japanese](o).', mn: 'Би японоор ярьж чаддаг байгаасай.' },
      ],
    },
    {
      title: 'Өнгөрсний харамсал — wish + Past Perfect',
      description: 'Аль хэдийн болчихсон зүйлд харамсаж «тэгсэн бол / тэгээгүй бол» гэнэ. Third conditional-ын if-ийн хэсэгтэй адил Past Perfect. Өөрчилж болохгүй.',
      examples: [
        { en: '[I](s) [wish](v) [I had studied harder at school](o).', mn: 'Би сургуульд илүү шаргуу сурсан бол. (сураагүй)' },
        { en: '[He](s) [wishes](v) [he hadn\'t sold his car](o).', mn: 'Тэр машинаа зараагүй байсан бол гэж харамсдаг.' },
        { en: '[We](s) [wish](v) [we had booked earlier](o).', mn: 'Бид эрт захиалсан бол. (захиалаагүй)' },
      ],
    },
    {
      title: 'Гомдол, уцаар — wish + would',
      description: 'Бусад хүний зан үйл, гадаад нөхцөл өөрчлөгдөөсэй гэсэн гомдол, тэвчээр барагдсан өнгөтэй. Өөрийнхөө тухай (I wish I would) хэлэхгүй — өөрөө шийдэж чадах зүйл. Цаг агаарын тухай ч хэрэглэнэ.',
      examples: [
        { en: '[I](s) [wish](v) [you would turn the music down](o).', mn: 'Чи хөгжмөө намсгаасай. (намсгахгүй байна)' },
        { en: '[I](s) [wish](v) [it would stop raining](o).', mn: 'Бороо зогсоосой. (зогсохгүй байна)' },
        { en: '[She](s) [wishes](v) [her neighbours wouldn\'t make so much noise](o).', mn: 'Тэр хөршүүдээ ийм их чимээ гаргахгүй байгаасай гэж хүсдэг.' },
      ],
    },
    {
      title: 'if only — илүү хүчтэй wish',
      description: 'wish-тэй яг адил дүрэмтэй (Past Simple / Past Perfect / would), гэхдээ илүү хүчтэй сэтгэл хөдлөл, гашуудал, халаглал. Ихэвчлэн анхаарлын тэмдэгтэй.',
      examples: [
        { en: '[If only](m) [I had more money](o)!', mn: 'Надад илүү мөнгө байсан бол!' },
        { en: '[If only](m) [I had listened to you](o)!', mn: 'Би чамайг сонссон бол!' },
        { en: '[If only](m) [he would call](o)!', mn: 'Тэр залгаасай!' },
      ],
    },
    {
      title: 'would rather ба it\'s time — бусад «бодит бус» Past Simple хэрэглээ',
      description: 'would rather + V1 (илүүд үзэх), would rather + хүн + Past Simple (бусад тэгээсэй). it\'s time + Past Simple (одоо хийх цаг болсон, хараахан хийгээгүй). Хоёулаа Past Simple-ийг одоогийн утгаар хэрэглэдэг.',
      examples: [
        { en: '[I](s)[\'d rather](v) [have](v) [tea](o) [than coffee](m).', mn: 'Би кофеноос цайг илүүд үзнэ.' },
        { en: '[I](s)[\'d rather](v) [you didn\'t tell anyone](o).', mn: 'Чи хэнд ч хэлээгүй нь дээр.' },
        { en: '[It](s)[\'s time](v) [we went home](o). [It](s)[\'s](v) [late](o).', mn: 'Бидний гэр лүүгээ явах цаг болжээ. Орой болчихлоо.' },
      ],
    },
  ],
  forms: [
    {
      label: 'wish + Past Simple (одоо)',
      structure: 'I wish + subject + V2 / were / could + V1',
      examples: [
        { en: '[I](s) [wish](v) [I had a bigger flat](o).', mn: 'Надад илүү том байр байгаасай.' },
        { en: '[I](s) [wish](v) [it weren\'t so cold](o).', mn: 'Ийм хүйтэн биш байгаасай.' },
        { en: '[He](s) [wishes](v) [he didn\'t have to work on Saturdays](o).', mn: 'Тэр бямба гаригт ажиллах хэрэггүй байгаасай гэж хүсдэг.' },
      ],
    },
    {
      label: 'wish + Past Perfect (өнгөрсөн)',
      structure: 'I wish + subject + had / hadn\'t + V3',
      examples: [
        { en: '[I](s) [wish](v) [I had gone to the party](o).', mn: 'Би үдэшлэгт очсон бол. (очоогүй)' },
        { en: '[She](s) [wishes](v) [she hadn\'t spent all her money](o).', mn: 'Тэр бүх мөнгөө үрээгүй байсан бол гэж харамсдаг.' },
        { en: '[I](s) [wish](v) [I\'d known you were in town](o).', mn: 'Чамайг хотод байгааг мэдсэн бол.' },
      ],
    },
    {
      label: 'wish + would (гомдол)',
      structure: 'I wish + subject (бусад) + would / wouldn\'t + V1',
      examples: [
        { en: '[I](s) [wish](v) [you would be more careful](o).', mn: 'Чи илүү болгоомжтой байгаасай.' },
        { en: '[I](s) [wish](v) [the bus would come](o).', mn: 'Автобус ирээсэй.' },
        { en: '[We](s) [wish](v) [they wouldn\'t park here](o).', mn: 'Тэд энд машинаа тавихгүй байгаасай.' },
      ],
    },
    {
      label: 'would rather / it\'s time',
      structure: 'would rather + V1 (than …) · would rather + person + Past Simple · It\'s (high) time + subject + Past Simple',
      examples: [
        { en: '[I](s)[\'d rather](v) [walk](v) [than take the bus](m).', mn: 'Би автобусанд суухаас алхсан нь дээр.' },
        { en: '[I](s)[\'d rather](v) [you came tomorrow](o).', mn: 'Чи маргааш ирсэн нь дээр. (надад)' },
        { en: '[It](s)[\'s high time](v) [you found a job](o).', mn: 'Чиний ажил олох цаг аль хэдийн болжээ.' },
      ],
    },
  ],
  signalWords: ['I wish', 'if only', 'would rather', 'it\'s time', 'it\'s high time', 'I wish I were', 'I wish I had', 'I wish you would'],
  notes: [
    'wish-ийн ард Past Simple байгаа ч одоогийн тухай, Past Perfect байгаа ч өнгөрсний тухай. Цаг «нэг алхам ухарсан» — яг Second / Third conditional шиг.',
    'wish + would-ыг өөрийнхөө тухай хэлэхгүй: I wish I would be rich (буруу) → I wish I were rich (зөв). would зөвхөн бусдын үйлдэл, гадаад нөхцөлд.',
    'wish + would нь төлөв байдалд биш, үйлдэлд хэрэглэнэ: I wish you would be taller (буруу — өндөр болох нь үйлдэл биш) → I wish you were taller.',
    'I wish + to V1 гэвэл «хүсэж байна» гэсэн албан ёсны утгатай, огт өөр бүтэц: I wish to speak to the manager = I want to speak to the manager.',
    'hope ба wish-ийн ялгаа: hope бодитой хүсэл (I hope you pass — давна гэж найдаж байна), wish бодит бус хүсэл / харамсал (I wish you had passed — давсан бол).',
    'would rather-ийн ард than харьцуулна: I\'d rather stay than go. Илүүд үзэхийг prefer-ээр ч хэлж болно: I prefer staying to going.',
  ],
  commonMistakes: [
    {
      wrong: 'I wish I have more time.',
      correct: 'I wish I had more time.',
      explanation: 'wish-ийн ард одоогийн хүсэлд Past Simple. Монголоор «байгаасай» гэж одоо цагийн хүсэл тул have сонгох алдаа гардаг.',
    },
    {
      wrong: 'I wish I didn\'t eat so much yesterday.',
      correct: 'I wish I hadn\'t eaten so much yesterday.',
      explanation: 'yesterday — өнгөрсний харамсал тул Past Perfect (hadn\'t eaten). Past Simple бол одоогийн хүсэл.',
    },
    {
      wrong: 'I wish I would have a car.',
      correct: 'I wish I had a car.',
      explanation: 'Өөрийнхөө тухай хүсэлд would хэрэглэхгүй. wish + would зөвхөн бусад хүн, нөхцөлийн тухай гомдолд.',
    },
    {
      wrong: 'It\'s time to we go home.',
      correct: 'It\'s time we went home. / It\'s time to go home.',
      explanation: 'it\'s time-ийн ард эзэнтэй бол Past Simple (we went), эзэнгүй бол to + V1 (to go). Хоёрыг холихгүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «-аасай/-оосой» (байгаасай, ирээсэй) гэсэн хүсэх хэлбэр wish-ийн утгыг илэрхийлдэг. Гэхдээ монголоор одоогийн хүсэл (байгаасай) ба өнгөрсний харамсал (байсан бол) хоёр өөр хэлбэртэй байдаг нь wish + Past Simple / wish + Past Perfect-тэй яг таардаг.',
      'Монголоор «-сан бол» (сурсан бол, хэлээгүй байсан бол) нь өнгөрсний харамслыг заана = wish + Past Perfect / if only + Past Perfect. Энэ хэлбэрийг харвал Past Perfect гэж бодоорой.',
      'Монголоор «болиосой», «ирээсэй» гэж бусдын тухай хүсэхэд мөн «-аасай» хэрэглэдэг бол англиар бусдын үйлдэлд would нэмдэг: I wish you would stop. Өөрийнхөө тухай бол would-гүй: I wish I were.',
      'Монголоор «-сан нь дээр» (гэртээ байсан нь дээр) = would rather + V1, «-х цаг болжээ» (явах цаг болжээ) = it\'s time + Past Simple. Монголоор «дээр» гэдэг харьцуулал англиар than-аар илэрдэг: I\'d rather stay than go.',
    ],
  },
  dialogue: [
    {
      en: 'Saraa, [you](s) [look](v) [worried](o). [What](s)[\'s](v) [wrong](o)?',
      mn: 'Сараа, чи санаа зовсон харагдаж байна. Юу болоо вэ?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [had](v) [an argument](o) [with Tuya](m). [I](s) [wish](v) [I hadn\'t shouted at her](o).',
      mn: 'Би Туяатай маргалдчихлаа. Би түүн рүү хашгираагүй байсан бол.',
      speaker: 'Saraa',
    },
    {
      en: '[What](o) [was](v) [it](s) [about](m)?',
      mn: 'Юуны тухай байсан юм бэ?',
      speaker: 'Bat',
    },
    {
      en: '[She](s)[\'s](v) [always late](o). [I](s) [wish](v) [she would be on time](o) [for once](m)!',
      mn: 'Тэр үргэлж хоцордог. Ганц удаа ч болов цагтаа ирээсэй!',
      speaker: 'Saraa',
    },
    {
      en: 'I understand. [But](m) [I](s)[\'d rather](v) [you talked to her](o) [than stayed angry](m).',
      mn: 'Ойлгож байна. Гэхдээ чи уурлаж суухаас түүнтэй ярьсан нь дээр.',
      speaker: 'Bat',
    },
    {
      en: 'You\'re right. [If only](m) [I were better at apologising](o). Anyway, [it](s)[\'s time](v) [I called her](o).',
      mn: 'Чиний зөв. Би уучлалт гуйхдаа илүү сайн байгаасай. Юутай ч түүн рүү залгах цаг болжээ.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'b1-15-1',
      ruleId: 15,
      kind: 'fill',
      question: 'I wish I ___ more time to travel. I\'m always busy.',
      options: ['have', 'had', 'had had', 'would have'],
      answer: 'had',
      explanation: 'Одоо цаг байхгүй (I\'m always busy), байгаасай гэсэн одоогийн хүсэл — wish + Past Simple: had. would have өөрийнхөө тухай хэрэглэхгүй.',
      hint: 'Одоогийн бодит бус хүсэл.',
    },
    {
      id: 'b1-15-2',
      ruleId: 15,
      kind: 'fill',
      question: 'I failed the test. I wish I ___ harder.',
      options: ['study', 'studied', 'had studied', 'would study'],
      answer: 'had studied',
      explanation: 'Шалгалт аль хэдийн болчихсон — өнгөрсний харамсал. wish + Past Perfect: had studied.',
      hint: 'Болчихсон зүйлд харамсаж байна.',
    },
    {
      id: 'b1-15-3',
      ruleId: 15,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'I wish I would be taller.',
        'I wish you would stop interrupting me.',
        'I wish I have a dog.',
        'If only I didn\'t say that yesterday.',
      ],
      answer: 'I wish you would stop interrupting me.',
      explanation: 'Бусдын үйлдэлд гомдол — wish + you + would зөв. Өөрийнхөө тухай would хэрэглэхгүй (were taller); одоогийн хүсэлд Past Simple (had a dog); өнгөрсний харамсалд Past Perfect (hadn\'t said).',
      hint: 'would зөвхөн бусдын үйлдэлд.',
    },
    {
      id: 'b1-15-4',
      ruleId: 15,
      kind: 'translate',
      question: 'Би далайн ойролцоо амьдардаг байгаасай.',
      options: [
        'I wish I lived near the sea.',
        'I wish I live near the sea.',
        'I wish I had lived near the sea.',
        'I wish I would live near the sea.',
      ],
      answer: 'I wish I lived near the sea.',
      explanation: '«Байгаасай» — одоогийн бодит бус хүсэл (одоо амьдардаггүй). wish + Past Simple: lived. had lived гэвэл өнгөрсний харамсал болно.',
      hint: '«-аасай» одоо = Past Simple.',
    },
  ],
};
