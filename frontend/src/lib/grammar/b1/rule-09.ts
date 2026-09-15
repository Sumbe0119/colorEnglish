// frontend/src/lib/grammar/b1/rule-09.ts
// B1 дүрэм 9: Reported questions, commands & requests
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule09: GrammarRule = {
  id: 9,
  title: 'Reported questions, commands & requests',
  titleMn: 'Шууд бус яриа — асуулт, тушаал, хүсэлт дамжуулах',
  hook: '«Тэр надаас “Чи хаана амьдардаг вэ?” гэж асуусан» → «Тэр намайг хаана амьдардгийг асуусан» — асуулт, тушаалыг ч дамжуулж сурцгаая.',
  summary: 'Асуултыг дамжуулахдаа asked + (хүн) + асуух үг / if / whether, дараа нь ЭНГИЙН ӨГҮҮЛБЭРИЙН дараалал (эзэн + үйл үг), do/does/did алга болж, цаг нэг алхам ухарна. Тушаал, хүсэлтийг told / asked + хүн + to + Verb1 (үгүйсгэл: not to + Verb1) гэж дамжуулна.',
  description: 'Өмнөх дүрэмд бид мэдэгдлийг said / told-оор дамжуулж сурсан. Одоо асуулт, тушаал, хүсэлтийг дамжуулна. Асуулт дамжуулахад гурван зүйл чухал. Нэгд, дамжуулах үйл үг нь asked (эсвэл wanted to know, wondered). Хоёрт, асуултын дараалал алга болж, ЭНГИЙН өгүүлбэрийн дараалал болно: "Where do you live?" → She asked where I lived (asked where did I live биш!). do/does/did туслах үг алга болж, үндсэн үйл үг өөрөө цагаа авна. Гуравт, Yes/No асуултад асуух үг байхгүй тул if эсвэл whether нэмнэ: "Are you tired?" → He asked if I was tired. Мэдэгдэлтэй адил цаг ухарч, төлөөний үг, цагийн үгс өөрчлөгдөнө. Асуултын тэмдэг (?) тавихгүй. Тушаал, хүсэлт дамжуулах нь илүү энгийн: told + хүн + to + V1 (тушаал), asked + хүн + to + V1 (хүсэлт). Үгүйсгэл нь not to + V1: "Don\'t touch it!" → She told me not to touch it. Энд цаг ухраах шаардлагагүй — to + V1 хэлбэр хэвээр. Монголоор асуултыг дамжуулахдаа «-ыг асуусан», «эсэхийг асуусан» гэдэг нь if/whether-ийн утгыг яг өгдөг, харин тушаалыг «гэж хэлсэн» гэдэг тул to + V1 бүтцийг сурах хэрэгтэй.',
  structure: 'asked + (person) + wh-word / if / whether + subject + verb · told / asked + person + (not) to + Verb1',
  structureParts: [
    { text: 'She asked', part: 'verb' },
    { text: 'me', part: 'object' },
    { text: 'where / if', part: 'modifier' },
    { text: 'I lived (эзэн + үйл үг)', part: 'plain' },
  ],
  tip: 'Асуулт дамжуулахад: асуултын дараалал → энгийн дараалал, do/did алга, ? алга, Yes/No асуултад if. Тушаал: told + хүн + to V1, үгүйсгэл not to V1.',
  examples: [
    { en: '"Where do you live?" → [She](s) [asked](v) [me](o) [where I lived](o).', mn: '«Чи хаана амьдардаг вэ?» → Тэр намайг хаана амьдардгийг асуусан.' },
    { en: '"Are you coming?" → [He](s) [asked](v) [if I was coming](o).', mn: '«Чи ирэх үү?» → Тэр намайг ирэх эсэхийг асуусан.' },
    { en: '"Close the door." → [She](s) [told](v) [me](o) [to close the door](o).', mn: '«Хаалгаа хаа.» → Тэр намайг хаалгаа хаа гэж хэлсэн.' },
    { en: '"Please don\'t be late." → [He](s) [asked](v) [us](o) [not to be late](o).', mn: '«Битгий хоцроорой.» → Тэр биднийг хоцрохгүй байхыг хүссэн.' },
  ],
  useCases: [
    {
      title: 'Wh- асуулт дамжуулах — асуух үг хэвээр, дараалал өөрчлөгдөнө',
      description: 'what, where, when, why, how, who зэрэг асуух үг хэвээр үлдэнэ. Гэхдээ ард нь асуултын дараалал биш, эзэн + үйл үг гэсэн энгийн дараалал ирнэ. do/does/did алга болно, цаг ухарна.',
      examples: [
        { en: '"What time is it?" → [He](s) [asked](v) [what time it was](o).', mn: '«Хэдэн цаг болж байна?» → Тэр хэдэн цаг болж байгааг асуусан.' },
        { en: '"Why did you leave early?" → [She](s) [asked](v) [me](o) [why I had left early](o).', mn: '«Чи яагаад эрт явсан юм бэ?» → Тэр намайг яагаад эрт явсныг асуусан.' },
        { en: '"How much does it cost?" → [They](s) [asked](v) [how much it cost](o).', mn: '«Энэ ямар үнэтэй вэ?» → Тэд үүнийг ямар үнэтэйг асуусан.' },
      ],
    },
    {
      title: 'Yes / No асуулт дамжуулах — if / whether',
      description: 'Асуух үг байхгүй асуултад if (эсвэл whether) нэмнэ. Хоёулаа «эсэх» гэсэн утгатай. whether нь арай албан ёсны, or not-той хамт хэрэглэхэд илүү тохиромжтой.',
      examples: [
        { en: '"Do you like sushi?" → [She](s) [asked](v) [if I liked sushi](o).', mn: '«Чи сушинд дуртай юу?» → Тэр намайг сушинд дуртай эсэхийг асуусан.' },
        { en: '"Have you finished?" → [He](s) [asked](v) [whether I had finished](o).', mn: '«Чи дуусгасан уу?» → Тэр намайг дуусгасан эсэхийг асуусан.' },
        { en: '"Can you drive?" → [They](s) [asked](v) [me](o) [if I could drive](o).', mn: '«Чи машин жолоодож чадах уу?» → Тэд намайг машин жолоодож чадах эсэхийг асуусан.' },
      ],
    },
    {
      title: 'Тушаал дамжуулах — told + хүн + to V1',
      description: 'Захирах хэлбэрийг (Sit down! Be quiet!) дамжуулахдаа told + хүн + to + V1. Цаг ухраахгүй — to V1 хэлбэр хэвээр. Хатуу тушаалд ordered, зөвлөгөөнд advised ч хэрэглэж болно.',
      examples: [
        { en: '"Sit down!" → [The teacher](s) [told](v) [us](o) [to sit down](o).', mn: '«Суу!» → Багш биднийг суу гэж хэлсэн.' },
        { en: '"Wait here." → [She](s) [told](v) [me](o) [to wait there](o).', mn: '«Энд хүлээж бай.» → Тэр намайг тэнд хүлээж бай гэж хэлсэн.' },
        { en: '"Take this medicine twice a day." → [The doctor](s) [told](v) [him](o) [to take the medicine twice a day](o).', mn: '«Энэ эмийг өдөрт хоёр удаа уу.» → Эмч түүнийг эмийг өдөрт хоёр удаа уу гэж хэлсэн.' },
      ],
    },
    {
      title: 'Хүсэлт дамжуулах — asked + хүн + to V1',
      description: 'Please-тэй эелдэг хүсэлтийг asked + хүн + to V1-ээр дамжуулна. asked нь асуулт дамжуулахад ч, хүсэлт дамжуулахад ч хэрэглэгддэг — ард нь to V1 байвал хүсэлт, if / асуух үг байвал асуулт.',
      examples: [
        { en: '"Could you help me, please?" → [She](s) [asked](v) [me](o) [to help her](o).', mn: '«Надад туслаач?» → Тэр намайг өөрт нь туслахыг хүссэн.' },
        { en: '"Please open the window." → [He](s) [asked](v) [me](o) [to open the window](o).', mn: '«Цонхоо нээгээч.» → Тэр намайг цонх нээхийг хүссэн.' },
        { en: '"Can you call me later?" → [She](s) [asked](v) [him](o) [to call her later](o).', mn: '«Дараа над руу залгаач?» → Тэр түүнийг дараа өөр рүү нь залгахыг хүссэн.' },
      ],
    },
    {
      title: 'Үгүйсгэсэн тушаал, хүсэлт — not to V1',
      description: 'Don\'t …! хэлбэрийг дамжуулахдаа not to + V1. not нь to-гийн ӨМНӨ орно: told me not to go (told me to not go биш, told me don\'t go бүр биш).',
      examples: [
        { en: '"Don\'t touch that!" → [She](s) [told](v) [the children](o) [not to touch it](o).', mn: '«Түүнд бүү хүр!» → Тэр хүүхдүүдийг түүнд бүү хүр гэж хэлсэн.' },
        { en: '"Please don\'t tell anyone." → [He](s) [asked](v) [me](o) [not to tell anyone](o).', mn: '«Хэнд ч битгий хэлээрэй.» → Тэр намайг хэнд ч хэлэхгүй байхыг хүссэн.' },
        { en: '"Don\'t forget your keys." → [Mum](s) [reminded](v) [me](o) [not to forget my keys](o).', mn: '«Түлхүүрээ бүү мартаарай.» → Ээж надад түлхүүрээ мартахгүй байхыг сануулсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Wh- асуулт',
      structure: 'asked + (person) + wh-word + subject + verb (ухарсан цаг)',
      examples: [
        { en: '"Where are you going?" → [He](s) [asked](v) [where I was going](o).', mn: '«Чи хаашаа явж байна?» → Тэр намайг хаашаа явж байгааг асуусан.' },
        { en: '"When will you arrive?" → [She](s) [asked](v) [me](o) [when I would arrive](o).', mn: '«Чи хэзээ ирэх вэ?» → Тэр намайг хэзээ ирэхийг асуусан.' },
        { en: '"Who called?" → [He](s) [asked](v) [who had called](o).', mn: '«Хэн залгасан бэ?» → Тэр хэн залгасныг асуусан.' },
      ],
    },
    {
      label: 'Yes / No асуулт',
      structure: 'asked + (person) + if / whether + subject + verb (ухарсан цаг)',
      examples: [
        { en: '"Is she at home?" → [He](s) [asked](v) [if she was at home](o).', mn: '«Тэр гэртээ байна уу?» → Тэр түүнийг гэртээ байгаа эсэхийг асуусан.' },
        { en: '"Did you see the film?" → [She](s) [asked](v) [me](o) [whether I had seen the film](o).', mn: '«Чи киног үзсэн үү?» → Тэр намайг киног үзсэн эсэхийг асуусан.' },
        { en: '"Will it rain?" → [They](s) [wanted to know](v) [if it would rain](o).', mn: '«Бороо орох уу?» → Тэд бороо орох эсэхийг мэдэхийг хүссэн.' },
      ],
    },
    {
      label: 'Тушаал, зөвлөгөө',
      structure: 'told / ordered / advised / warned + person + to + V1',
      examples: [
        { en: '"Be quiet!" → [The teacher](s) [told](v) [them](o) [to be quiet](o).', mn: '«Чимээгүй бай!» → Багш тэднийг чимээгүй бай гэж хэлсэн.' },
        { en: '"You should see a doctor." → [She](s) [advised](v) [me](o) [to see a doctor](o).', mn: '«Чи эмчид үзүүлэх хэрэгтэй.» → Тэр надад эмчид үзүүлэхийг зөвлөсөн.' },
        { en: '"Be careful on the ice!" → [He](s) [warned](v) [us](o) [to be careful on the ice](o).', mn: '«Мөсөн дээр болгоомжтой бай!» → Тэр биднийг мөсөн дээр болгоомжтой байхыг сануулсан.' },
      ],
    },
    {
      label: 'Хүсэлт ба үгүйсгэл',
      structure: 'asked + person + to + V1 · told / asked + person + not to + V1',
      examples: [
        { en: '"Please wait a moment." → [She](s) [asked](v) [me](o) [to wait a moment](o).', mn: '«Түр хүлээгээч.» → Тэр намайг түр хүлээхийг хүссэн.' },
        { en: '"Don\'t be late!" → [He](s) [told](v) [me](o) [not to be late](o).', mn: '«Битгий хоцор!» → Тэр намайг битгий хоцор гэж хэлсэн.' },
        { en: '"Please don\'t smoke here." → [They](s) [asked](v) [him](o) [not to smoke there](o).', mn: '«Энд тамхи битгий татаарай.» → Тэд түүнийг тэнд тамхи татахгүй байхыг хүссэн.' },
      ],
    },
  ],
  signalWords: ['asked', 'wanted to know', 'wondered', 'if', 'whether', 'told … to', 'asked … to', 'not to', 'advised', 'warned'],
  notes: [
    'Дамжуулсан асуултад асуултын тэмдэг (?) тавихгүй — энэ нь одоо мэдэгдэл болсон: She asked where I lived. (цэг)',
    'Дамжуулсан асуултад do / does / did алга болно, үндсэн үйл үг өөрөө цагаа авна: "Where does he work?" → asked where he worked (worked, did work биш).',
    'Асуултын дараалал (is she, do you, can they) энгийн дараалал (she was, I did, they could) болно. Энэ бол хамгийн их алддаг цэг.',
    'if ба whether ижил утгатай. whether … or not гэж хэлж болно: asked whether I was coming or not. if or not гэж хэлэхгүй.',
    'Тушаал, хүсэлтэд цаг ухраахгүй — to V1 хэлбэр цаггүй. Зөвхөн төлөөний үг, цаг/газрын үгс өөрчлөгдөнө.',
    'said-ээр тушаал дамжуулж болохгүй: She said me to go (буруу). Тушаалд told, хүсэлтэд asked, зөвлөгөөнд advised хэрэглэнэ.',
  ],
  commonMistakes: [
    {
      wrong: 'She asked me where did I live.',
      correct: 'She asked me where I lived.',
      explanation: 'Дамжуулсан асуултад асуултын дараалал байхгүй — did алга болж, энгийн дараалал (I lived). Монголоор асуултын дараалал өөрчлөгддөггүй тул энэ алдаа түгээмэл.',
    },
    {
      wrong: 'He asked me that I was tired.',
      correct: 'He asked me if I was tired.',
      explanation: 'Yes/No асуултыг дамжуулахад that биш, if / whether. that зөвхөн мэдэгдэл дамжуулахад.',
    },
    {
      wrong: 'The teacher told us don\'t talk.',
      correct: 'The teacher told us not to talk.',
      explanation: 'Үгүйсгэсэн тушаалыг not to + V1-ээр дамжуулна. don\'t хэлбэр шууд ярианд л байдаг.',
    },
    {
      wrong: 'She said me to close the window.',
      correct: 'She told me to close the window.',
      explanation: 'Тушаал дамжуулахад said хэрэглэхгүй, told + хүн + to V1. Мөн said-ийн ард хүн шууд ирдэггүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор асуултыг дамжуулахдаа «-ыг асуусан» (хаана амьдардгийг асуусан), Yes/No асуултыг «эсэхийг асуусан» (ирэх эсэхийг асуусан) гэдэг. «Эсэх» = if / whether гэж санавал амархан.',
      'Монголоор асуултын үгийн дараалал дамжуулахад өөрчлөгддөггүй (учир нь монголд асуулт дараалал өөрчлөхгүй, «уу/үү, вэ/бэ»-ээр үүсдэг). Англиар асуултын дараалал (do you live) → энгийн дараалал (I lived) болдгийг тусгайлан анхаараарай.',
      'Монголоор тушаалыг «… гэж хэлсэн» (суу гэж хэлсэн) гэж захирах хэлбэрийг хэвээр дамжуулдаг. Англиар to + V1 (told us to sit down) бүтэц болно. «Битгий … гэж хэлсэн» = told … not to.',
      'Монголоор «хүссэн», «гуйсан» (туслахыг хүссэн) гэдэг нь asked + to V1-тэй таардаг. Монголоор «асуусан» ба «хүссэн» хоёр өөр үг байдаг бол англиар хоёулаа asked — ард нь if / асуух үг байвал асуусан, to V1 байвал хүссэн.',
    ],
  },
  dialogue: [
    {
      en: 'Saraa, [how](m) [was](v) [your job interview](s)?',
      mn: 'Сараа, ажлын ярилцлага чинь ямар байсан бэ?',
      speaker: 'Bat',
    },
    {
      en: 'Long! [First](m) [they](s) [asked](v) [me](o) [where I had studied](o) [and](m) [why I wanted the job](o).',
      mn: 'Урт! Эхлээд тэд намайг хаана сурсан, яагаад энэ ажлыг хүсэж байгааг асуусан.',
      speaker: 'Saraa',
    },
    {
      en: '[Did](v) [they](s) [ask](v) [if you could speak English](o)?',
      mn: 'Тэд чамайг англиар ярьж чадах эсэхийг асуусан уу?',
      speaker: 'Bat',
    },
    {
      en: 'Yes, [and](m) [they](s) [asked](v) [me](o) [to describe my last project in English](o).',
      mn: 'Тийм, тэгээд намайг сүүлийн төслөө англиар тайлбарлахыг хүссэн.',
      speaker: 'Saraa',
    },
    {
      en: 'Wow. [What](o) [did](v) [they](s) [say](v) [at the end](m)?',
      mn: 'Вау. Төгсгөлд нь тэд юу гэсэн бэ?',
      speaker: 'Bat',
    },
    {
      en: '[They](s) [told](v) [me](o) [not to worry](o) [and](m) [asked](v) [me](o) [to wait for their call](o).',
      mn: 'Тэд надад санаа зовохгүй байхыг хэлж, тэдний дуудлагыг хүлээхийг хүссэн.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'b1-09-1',
      ruleId: 9,
      kind: 'fill',
      question: '"Where do you work?" → She asked me ___.',
      options: ['where did I work', 'where I worked', 'where do I work', 'that where I worked'],
      answer: 'where I worked',
      explanation: 'Дамжуулсан асуултад did алга болж, энгийн дараалал (I worked) болно, цаг ухарна. that асуултад хэрэглэхгүй.',
      hint: 'do/did алга, эзэн + үйл үг.',
    },
    {
      id: 'b1-09-2',
      ruleId: 9,
      kind: 'fill',
      question: '"Are you hungry?" → He asked ___ I was hungry.',
      options: ['that', 'if', 'what', 'do'],
      answer: 'if',
      explanation: 'Yes/No асуултыг дамжуулахад if (эсвэл whether). that зөвхөн мэдэгдэлд, what асуух үгтэй асуултад.',
      hint: '«Эсэх» гэсэн утгатай үг.',
    },
    {
      id: 'b1-09-3',
      ruleId: 9,
      kind: 'correct',
      question: '"Don\'t open the window!" Зөв дамжуулсан нь аль вэ?',
      options: [
        'She told me don\'t open the window.',
        'She said me not to open the window.',
        'She told me not to open the window.',
        'She told me to not open the window.',
      ],
      answer: 'She told me not to open the window.',
      explanation: 'Үгүйсгэсэн тушаал: told + хүн + not to + V1. don\'t хэвээр үлдэхгүй; said-ээр тушаал дамжуулахгүй; not нь to-гийн өмнө.',
      hint: 'not to + V1.',
    },
    {
      id: 'b1-09-4',
      ruleId: 9,
      kind: 'translate',
      question: 'Тэр намайг хэзээ ирэхийг асуусан.',
      options: [
        'She asked me when I would come.',
        'She asked me when will I come.',
        'She asked me when would I come.',
        'She told me when I would come.',
      ],
      answer: 'She asked me when I would come.',
      explanation: '«Асуусан» = asked, «хэзээ» = when, дараа нь энгийн дараалал + ухарсан цаг: I would come. Асуултын дараалал (will I / would I) байхгүй.',
      hint: 'asked + when + эзэн + үйл үг.',
    },
  ],
};
