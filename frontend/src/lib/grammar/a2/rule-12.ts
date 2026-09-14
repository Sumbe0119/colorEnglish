// frontend/src/lib/grammar/a2/rule-12.ts
// A2 дүрэм 12: Relative clauses: who / which / that / where
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule12: GrammarRule = {
  id: 12,
  title: 'Relative clauses: who / which / that / where',
  titleMn: 'Тодотгол гишүүн өгүүлбэр — хэн, юу, хаана гэдгийг тодруулах',
  hook: '«Миний хажууд сууж байгаа хүн», «Би өчигдөр авсан ном», «Бидний уулзсан кафе» — ямар хүн, ямар юм, ямар газар вэ гэдгийг who / which / that / where-ээр нэг өгүүлбэрт багтаана.',
  summary: 'Тодотгол гишүүн өгүүлбэр (relative clause) нь нэр үгийн ард орж, яг аль хүн, юм, газрыг хэлж байгааг тодруулна. Хүнд who / that, юм ба амьтанд which / that, газарт where хэрэглэнэ: The man who lives next door is a doctor.',
  description: 'Хоёр богино өгүүлбэрийг нэг болгож, нэр үгийг тодруулахад relative clause хэрэглэнэ. «I have a friend. He speaks Chinese.» гэхийн оронд «I have a friend who speaks Chinese.» гэж хэлнэ. who (эсвэл that) хүнийг, which (эсвэл that) юм ба амьтныг, where газрыг тодруулна. Энэ гишүүн өгүүлбэр нэр үгийнхээ яг ард орно — англиар тодотгол үргэлж ард нь. Монгол хэлэнд яг эсрэгээрээ: «миний хажууд сууж байгаа хүн» гэхэд тодотгол нэр үгийн өмнө ордог. Тиймээс монгол хүн англиар хэлэхдээ дарааллыг эргүүлж сурах хэрэгтэй: the man + who sits next to me. Бас нэг чухал зүйл: who / which / that өөрөө тэр хүн, юмыг төлөөлж байгаа тул ард нь дахин he, it зэрэг төлөөний үг тавихгүй. that нь ярианы хэлэнд who, which хоёрыг хоёуланг нь орлож чаддаг тул хамгийн түгээмэл.',
  structure: 'Noun + who / which / that / where + clause',
  structureParts: [
    { text: 'Noun', part: 'object' },
    { text: 'who / which / that / where', part: 'modifier' },
    { text: '+ clause (verb …)', part: 'modifier' },
  ],
  tip: 'Хүн → who, юм → which, хоёулаа → that, газар → where. Монголоор «-сан/-даг/-ж байгаа + нэр үг» гэж ӨМНӨ нь хэлдэг бол англиар нэр үг + who/which гэж АРД нь хэлнэ.',
  examples: [
    { en: '[The man](s) [who lives next door](m) [is](v) [a doctor](o).', mn: 'Хажуу айлд амьдардаг хүн бол эмч.' },
    { en: '[This](s) [is](v) [the book](o) [which I bought yesterday](m).', mn: 'Энэ бол миний өчигдөр авсан ном.' },
    { en: '[I](s) [like](v) [the café](o) [where we met](m).', mn: 'Би бидний уулзсан кафед дуртай.' },
    { en: '[She](s) [has](v) [a dog](o) [that runs very fast](m).', mn: 'Тэр маш хурдан гүйдэг нохойтой.' },
  ],
  useCases: [
    {
      title: 'Хүнийг тодруулах: who / that',
      description: 'Аль хүнийг хэлж байгааг тодруулахад нэр үгийн ард who (ярианд that ч болно) хэрэглэнэ. Монголоор «…-даг / -сан / -ж байгаа хүн».',
      examples: [
        { en: '[The woman](s) [who teaches us English](m) [is](v) [from Canada](m).', mn: 'Бидэнд англи хэл заадаг эмэгтэй Канадаас ирсэн.' },
        { en: '[I](s) [have](v) [a cousin](o) [who works in Japan](m).', mn: 'Би Японд ажилладаг үеэлтэй.' },
        { en: '[Do](v) [you](s) [know](v) [the boy](o) [that won the race](m)?', mn: 'Чи уралдаанд түрүүлсэн хүүг мэдэх үү?' },
      ],
    },
    {
      title: 'Юм, амьтныг тодруулах: which / that',
      description: 'Аль юм, амьтныг хэлж байгааг тодруулахад which эсвэл that хэрэглэнэ. Ярианы хэлэнд that илүү түгээмэл, which арай албан ёсны.',
      examples: [
        { en: '[The phone](s) [which I bought last week](m) [doesn\'t work](v).', mn: 'Миний өнгөрсөн долоо хоногт авсан утас ажиллахгүй байна.' },
        { en: '[We](s) [watched](v) [a film](o) [that was really funny](m).', mn: 'Бид үнэхээр инээдтэй кино үзсэн.' },
        { en: '[Is](v) [this](s) [the bus](o) [that goes to the airport](m)?', mn: 'Энэ нисэх буудал руу явдаг автобус мөн үү?' },
      ],
    },
    {
      title: 'Газрыг тодруулах: where',
      description: 'Аль газрыг хэлж байгааг тодруулахад where хэрэглэнэ. where = in which / at which, тиймээс ард нь in, at зэрэг угтвар үг дахин тавихгүй.',
      examples: [
        { en: '[This](s) [is](v) [the restaurant](o) [where we had dinner](m).', mn: 'Энэ бол бидний оройн хоол идсэн ресторан.' },
        { en: '[The town](s) [where I was born](m) [is](v) [very small](o).', mn: 'Миний төрсөн хот маш жижиг.' },
        { en: '[I](s) [want to visit](v) [the school](o) [where my mother studied](m).', mn: 'Би ээжийнхээ сурч байсан сургуулиар очиж үзмээр байна.' },
      ],
    },
    {
      title: 'Хоёр өгүүлбэрийг нэг болгох',
      description: 'Relative clause-ийн гол ажил бол хоёр богино өгүүлбэрийг нэг урт, эмх цэгцтэй өгүүлбэр болгох. Давтагдаж байгаа хүн, юмыг who / which / that-аар сольж холбоно.',
      examples: [
        { en: '[I](s) [have](v) [a friend](o) [who plays the guitar](m).', mn: 'Би гитар тоглодог найзтай. (I have a friend. + He plays the guitar.)' },
        { en: '[Bat](s) [lost](v) [the keys](o) [which his father gave him](m).', mn: 'Бат аавынхаа өгсөн түлхүүрийг гээчихсэн. (Bat lost the keys. + His father gave him the keys.)' },
        { en: '[That](s) [is](v) [the hotel](o) [where we stayed last summer](m).', mn: 'Тэр бол бидний өнгөрсөн зун буусан зочид буудал. (That is the hotel. + We stayed there last summer.)' },
      ],
    },
  ],
  forms: [
    {
      structure: 'Noun (хүн) + who / that + verb …',
      examples: [
        { en: '[A doctor](s) [is](v) [a person](o) [who helps sick people](m).', mn: 'Эмч бол өвчтэй хүмүүст тусалдаг хүн.' },
        { en: '[The girl](s) [who is talking to Saraa](m) [is](v) [my sister](o).', mn: 'Сараатай ярьж байгаа охин бол миний эгч.' },
        { en: '[I](s) [know](v) [someone](o) [that can fix your bike](m).', mn: 'Би чиний дугуйг засаж чадах хүнийг мэднэ.' },
      ],
      label: 'Хүнтэй',
    },
    {
      structure: 'Noun (юм / амьтан) + which / that + verb …',
      examples: [
        { en: '[A fridge](s) [is](v) [a machine](o) [which keeps food cold](m).', mn: 'Хөргөгч бол хоолыг хүйтэн байлгадаг машин.' },
        { en: '[The cat](s) [that sleeps on our sofa](m) [isn\'t](v) [ours](o).', mn: 'Манай буйдан дээр унтдаг муур манайх биш.' },
        { en: '[I](s) [found](v) [the wallet](o) [which you lost](m).', mn: 'Би чиний гээсэн түрийвчийг олчихлоо.' },
      ],
      label: 'Юм, амьтантай',
    },
    {
      structure: 'Noun (газар) + where + subject + verb …',
      examples: [
        { en: '[This](s) [is](v) [the park](o) [where we play football](m).', mn: 'Энэ бол бидний хөлбөмбөг тоглодог цэцэрлэгт хүрээлэн.' },
        { en: '[The village](s) [where my grandparents live](m) [has](v) [no shops](o).', mn: 'Миний өвөө эмээгийн амьдардаг тосгонд дэлгүүр байхгүй.' },
        { en: '[Do](v) [you](s) [remember](v) [the shop](o) [where we bought the tent](m)?', mn: 'Бидний майхан авсан дэлгүүрийг чи санаж байна уу?' },
      ],
      label: 'Газартай',
    },
    {
      structure: 'Noun + who / which + subject + verb (тусагдахууныг тодруулах — who / which орхиж болно)',
      examples: [
        { en: '[The man](s) [who we met at the station](m) [is](v) [a pilot](o).', mn: 'Бидний буудал дээр уулзсан хүн бол нисгэгч.' },
        { en: '[The song](s) [which you sang](m) [was](v) [beautiful](o).', mn: 'Чиний дуулсан дуу сайхан байсан.' },
        { en: '[The pizza](s) [we ordered](m) [was](v) [cold](o).', mn: 'Бидний захиалсан пицца хүйтэн байсан.' },
      ],
      label: 'Тусагдахуун тодруулах',
    },
  ],
  signalWords: ['who', 'which', 'that', 'where', 'whose', 'the person who…', 'the thing that…', 'the place where…'],
  notes: [
    'Хүнд who (эсвэл that), юм болон амьтанд which (эсвэл that), газарт where. that ярианы хэлэнд хамгийн түгээмэл, which арай албан ёсны.',
    'who / which / that өөрөө нэр үгийг төлөөлж байгаа тул ард нь he, she, it, they дахин орохгүй: The man who lives here (✗ who he lives here).',
    'where = in which / at which. where хэрэглэсэн бол in, at угтвар үгийг давтахгүй: the house where I live (✗ where I live in). Харин угтвар үгтэй бол which: the house which I live in.',
    'Тодотгол өгүүлбэр нэр үгийнхээ яг ард орно. Өгүүлбэрийн эзнийг тодруулж байвал үндсэн үйл үг тодотголын дараа ирнэ: The girl who sits next to me is my friend.',
    'who / which / that тусагдахууныг тодруулж байвал (ард нь эзэн + үйл үг байвал) орхиж болно: the book (which) I bought. Харин эзнийг тодруулж байвал орхиж болохгүй: the man who called (✗ the man called).',
    'whose = хэний: The boy whose bike was stolen is crying. — «Дугуй нь хулгайлагдсан хүү уйлж байна». Эзэмшлийг тодруулна, хүн ба юм хоёуланд нь хэрэглэнэ.',
  ],
  commonMistakes: [
    {
      wrong: 'The man who he works with my father is very kind.',
      correct: 'The man who works with my father is very kind.',
      explanation: 'who өөрөө «тэр хүн»-ийг төлөөлж байгаа тул ард нь he давхар тавихгүй. Монголоор «тэр» гэдэг үг ордоггүй ч давтах алдаа их гардаг.',
    },
    {
      wrong: 'I have a friend which lives in Korea.',
      correct: 'I have a friend who lives in Korea.',
      explanation: 'Хүнд which хэрэглэхгүй — who эсвэл that. which зөвхөн юм, амьтанд.',
    },
    {
      wrong: 'This is the house where I live in.',
      correct: 'This is the house where I live. / This is the house which I live in.',
      explanation: 'where өөрөө «-д/-т» (in) гэсэн утгыг агуулдаг тул in давхар тавихгүй. Хэрвээ in хэлмээр байвал where-ийн оронд which хэрэглэнэ.',
    },
    {
      wrong: 'The lives next door man is a doctor.',
      correct: 'The man who lives next door is a doctor.',
      explanation: 'Монгол хэлний дарааллаар тодотголыг нэр үгийн өмнө тавьсан алдаа. Англиар тодотгол өгүүлбэр нэр үгийн АРД орж, who / which / that-аар эхэлнэ.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Хамгийн том ялгаа — дараалал. Монголоор тодотгол нэр үгийн ӨМНӨ: «миний хажууд сууж байгаа хүн». Англиар нэр үгийн АРД: the man who sits next to me. Англиар хэлэхдээ эхлээд нэр үгээ хэлээд, дараа нь who/which-ээр тайлбарлана гэж санаарай.',
      'Монголоор тодотголыг үйл үгийн төгсгөлөөр (-сан/-сэн, -даг/-дэг, -ж байгаа) хийдэг тул холбох үг хэрэггүй: «авсан ном». Англиар холбох үг заавал хэрэгтэй: the book which I bought. who / which / that / where бол монголд байхгүй «холбоос».',
      'Монголоор хүн, юм, газрыг ялгадаггүй — бүгд адилхан «-сан + нэр үг». Англиар тодруулж байгаа зүйл хүн үү (who), юм уу (which), газар уу (where) гэдгээс хамаарч холбох үг өөр байна.',
      'Монголоор «Хажуу айлд амьдардаг хүн эмч» гэхэд эзэн ба өгүүлэхүүн зэрэгцэж байдаг. Англиар эзэн ба үйл үгийн хооронд тодотгол өгүүлбэр бүхлээрээ орж, үндсэн үйл үг хол хойно ирнэ: The man who lives next door is a doctor. Үндсэн үйл үгээ мартаж болохгүй.',
    ],
  },
  dialogue: [
    {
      en: '[Who](s) [is](v) [the woman](o) [who is talking to the teacher](m)?',
      mn: 'Багштай ярьж байгаа эмэгтэй хэн бэ?',
      speaker: 'Bat',
    },
    {
      en: '[That](s)[\'s](v) [the doctor](o) [who works at the hospital near my house](m).',
      mn: 'Тэр бол манай гэрийн ойролцоох эмнэлэгт ажилладаг эмч.',
      speaker: 'Saraa',
    },
    {
      en: '[Is](v) [it](s) [the hospital](o) [where your brother was born](m)?',
      mn: 'Чиний дүүгийн төрсөн эмнэлэг мөн үү?',
      speaker: 'Bat',
    },
    {
      en: '[Yes](o), [it](s) [is](v). [She](s) [is](v) [also the person](o) [who helped my grandmother last year](m).',
      mn: 'Тийм ээ. Тэр бас өнгөрсөн жил миний эмээд тусалсан хүн.',
      speaker: 'Saraa',
    },
    {
      en: '[I](s) [need](v) [a doctor](o) [that speaks English](m). [My friend](s) [from Germany](m) [is](v) [sick](o).',
      mn: 'Надад англиар ярьдаг эмч хэрэгтэй байна. Германаас ирсэн найз маань өвчтэй.',
      speaker: 'Bat',
    },
    {
      en: '[Then](m) [go](v) [to the clinic](m) [which is next to the bank](m). [The doctors](s) [there](m) [speak](v) [English](o).',
      mn: 'Тэгвэл банкны хажууд байдаг эмнэлэгт оч. Тэндхийн эмч нар англиар ярьдаг.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-12-1',
      explanation: 'Хүнийг тодруулж байгаа тул who. which зөвхөн юм, амьтанд, where газарт, whose бол «хэний» гэсэн эзэмшил.',
      ruleId: 12,
      kind: 'fill',
      question: 'The teacher ___ lives near the school is very friendly.',
      options: ['which', 'who', 'where', 'whose'],
      answer: 'who',
      hint: 'Багш — хүн үү, юм уу?',
    },
    {
      id: 'a2-12-2',
      explanation: 'Газрыг тодруулж, ард нь эзэн + үйл үг байгаа тул where. who хүнд, «which» бол in-гүй бол буруу («the town which I grew up in» гэвэл зөв), «that» ч мөн in хэрэгтэй.',
      ruleId: 12,
      kind: 'fill',
      question: 'This is the town ___ I grew up.',
      options: ['who', 'which', 'where', 'that'],
      answer: 'where',
      hint: 'Хот бол газар, ард нь угтвар үг байхгүй.',
    },
    {
      id: 'a2-12-3',
      explanation: 'Юмыг тодруулахад which / that, ард нь давхар it орохгүй. «which it was» — давхар төлөөний үг, «who was» — юманд who хэрэглэхгүй, «where was» — газар биш.',
      ruleId: 12,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['I bought a laptop which it was very cheap.', 'I bought a laptop who was very cheap.', 'I bought a laptop that was very cheap.', 'I bought a laptop where was very cheap.'],
      answer: 'I bought a laptop that was very cheap.',
      hint: 'Зөөврийн компьютер — юм. Төлөөний үг давхардуулахгүй.',
    },
    {
      id: 'a2-12-4',
      explanation: 'Монголоор тодотгол өмнө нь, англиар ард нь: the girl + who sings. «The sings well girl» бол монгол дараалал, «which sings» — хүнд which болохгүй, «who she sings» — давхар төлөөний үг.',
      ruleId: 12,
      kind: 'translate',
      question: 'Сайн дуулдаг охин бол миний найз.',
      options: ['The sings well girl is my friend.', 'The girl which sings well is my friend.', 'The girl who she sings well is my friend.', 'The girl who sings well is my friend.'],
      answer: 'The girl who sings well is my friend.',
      hint: 'Эхлээд нэр үг, дараа нь who + тайлбар.',
    },
  ],
};
