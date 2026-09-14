// frontend/src/lib/grammar/a2/rule-02.ts
// A2 дүрэм 2: Past Simple vs. Past Continuous
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule02: GrammarRule = {
  id: 2,
  title: 'Past Simple vs. Past Continuous',
  titleMn: 'Энгийн ба үргэлжлэх өнгөрсөн цаг — урт үйлдлийг богино үйлдэл таслах',
  hook: 'Би ном уншиж байтал чи залгасан. Аль нь урт, аль нь богино вэ? Хоёр цагийг нэг өгүүлбэрт нийлүүлье.',
  summary: 'Урт, дэвсгэр үйлдлийг Past Continuous (was / were + -ing), түүнийг тасалсан богино үйлдлийг Past Simple-ээр хэлнэ. when богино үйлдлийн, while урт үйлдлийн өмнө орно: I was reading when you called.',
  description: 'Өнгөрсөн цагийн түүх ярихад хоёр цаг хамтдаа ажилладаг. Past Continuous нь урт, аль хэдийн явагдаж байсан «дэвсгэр» үйлдлийг зурна; Past Simple нь тэр дунд гэнэт болсон богино, дууссан үйлдлийг хэлнэ. «I was reading when you called» гэвэл унших үйлдэл урт — залгах үйлдэл түүнийг тасалсан. Монголоор «уншиж байтал», «уншиж байх үед» гэсэн хэлбэр яг энэ бүтцийг илэрхийлдэг. when ихэвчлэн богино үйлдлийн (Past Simple) өмнө, while урт үйлдлийн (Past Continuous) өмнө ордог. Хэрэв хоёр урт үйлдэл зэрэг явагдаж байсан бол хоёуланг нь Past Continuous-ээр хэлж, while-аар холбоно. Ямар ч цаг ашиглаж байсан Past Simple-ийн дүрэмт бус хэлбэрүүдийг (went, saw, had…) мартаж болохгүй — А1-д үзсэн тэр жагсаалт энд дахин хэрэгтэй.',
  structure: 'Subject + was / were + verb-ing + when + subject + past verb',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'was / were + verb-ing', part: 'verb' },
    { text: 'when', part: 'modifier' },
    { text: 'subject', part: 'subject' },
    { text: 'past verb', part: 'verb' },
  ],
  tip: 'Урт үйлдэл = -ing, богино үйлдэл = -ed / дүрэмт бус хэлбэр. Санах арга: while-ийн ард -ing, when-ийн ард Past Simple.',
  examples: [
    { en: '[I](s) [was reading](v) [when you called](m).', mn: 'Би уншиж байтал чи залгасан.' },
    { en: '[While](m) [she](s) [was cooking](v), [the phone](s) [rang](v).', mn: 'Тэр хоол хийж байх үед утас дуугарсан.' },
    { en: '[He](s) [fell](v) [when](m) [he](s) [was running](v).', mn: 'Тэр гүйж байгаад унасан.' },
    { en: '[We](s) [were talking](v) [while](m) [they](s) [were eating](v).', mn: 'Тэднийг хоол идэж байхад бид ярьж байсан.' },
  ],
  useCases: [
    {
      title: 'Урт үйлдлийг богино үйлдэл таслах',
      description: 'Хамгийн түгээмэл хэрэглээ. Аль хэдийн явагдаж байсан үйлдлийг (Past Continuous) гэнэт болсон богино үйлдэл (Past Simple) тасална. Богино үйлдлийн өмнө when тавина.',
      examples: [
        { en: '[I](s) [was sleeping](v) [when the alarm rang](m).', mn: 'Би унтаж байтал сэрүүлэг дуугарсан.' },
        { en: '[She](s) [was walking](v) [home](m) [when it started to rain](m).', mn: 'Тэр гэр лүүгээ алхаж байтал бороо орж эхэлсэн.' },
        { en: '[They](s) [were watching](v) [a film](o) [when the lights went out](m).', mn: 'Тэднийг кино үзэж байхад гэрэл унтарсан.' },
      ],
    },
    {
      title: 'while-тэй урт үйлдлийг эхэнд тавих',
      description: 'Урт үйлдлээр эхэлбэл while хэрэглэнэ. Өгүүлбэр While-ээр эхэлбэл хоёр хэсгийн хооронд таслал заавал тавина. Утга нь when-тэй өгүүлбэртэй адил.',
      examples: [
        { en: '[While](m) [I](s) [was studying](v), [my friend](s) [came](v).', mn: 'Намайг хичээлээ хийж байхад найз маань ирсэн.' },
        { en: '[While](m) [we](s) [were driving](v), [we](s) [saw](v) [an accident](o).', mn: 'Бид машинаар явж байхдаа осол харсан.' },
        { en: '[While](m) [he](s) [was shopping](v), [someone](s) [took](v) [his bag](o).', mn: 'Түүнийг дэлгүүр хэсэж байхад хэн нэгэн цүнхийг нь авсан.' },
      ],
    },
    {
      title: 'Хоёр урт үйлдэл зэрэг явагдах',
      description: 'Хоёр үйлдэл хоёулаа урт, нэг зэрэг явагдаж байсан бол хоёуланг нь Past Continuous-ээр хэлж, while-аар холбоно. Энд when ховор хэрэглэнэ.',
      examples: [
        { en: '[While](m) [Dad](s) [was cooking](v), [Mum](s) [was reading](v) [the news](o).', mn: 'Аавыг хоол хийж байхад ээж мэдээ уншиж байсан.' },
        { en: '[The kids](s) [were playing](v) [while](m) [we](s) [were talking](v).', mn: 'Биднийг ярьж байхад хүүхдүүд тоглож байсан.' },
        { en: '[I](s) [was listening](v) [to music](o) [while](m) [I](s) [was cleaning](v).', mn: 'Би цэвэрлэгээ хийхдээ хөгжим сонсож байсан.' },
      ],
    },
    {
      title: 'Дараалсан богино үйлдлүүд',
      description: 'Нэг нэгнийхээ дараа болсон дууссан үйлдлүүдийг бүгдийг нь Past Simple-ээр хэлнэ. Энд when хоёр богино үйлдлийг холбож «дараа нь» гэсэн утга өгнө.',
      examples: [
        { en: '[When](m) [I](s) [got](v) [home](m), [I](s) [opened](v) [the window](o).', mn: 'Би гэртээ ирээд цонх нээсэн.' },
        { en: '[She](s) [stood up](v) [when](m) [the teacher](s) [came in](v).', mn: 'Багш орж ирэхэд тэр босож зогссон.' },
        { en: '[When](m) [the bell](s) [rang](v), [everyone](s) [left](v).', mn: 'Хонх дуугарахад бүгд гарсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'when + Past Simple',
      structure: 'Subject + was / were + verb-ing + when + subject + past verb',
      examples: [
        { en: '[I](s) [was having](v) [lunch](o) [when](m) [you](s) [texted](v) [me](o).', mn: 'Би өдрийн хоолоо идэж байтал чи надад мессеж бичсэн.' },
        { en: '[She](s) [was crossing](v) [the road](o) [when](m) [she](s) [saw](v) [him](o).', mn: 'Тэр зам гарч байхдаа түүнийг харсан.' },
        { en: '[We](s) [were sitting](v) [in the café](m) [when](m) [it](s) [began](v) [to snow](o).', mn: 'Биднийг кафед сууж байхад цас орж эхэлсэн.' },
      ],
    },
    {
      label: 'While + Past Continuous, …',
      structure: 'While + subject + was / were + verb-ing, subject + past verb',
      examples: [
        { en: '[While](m) [I](s) [was waiting](v), [I](s) [read](v) [a magazine](o).', mn: 'Хүлээж байхдаа би сэтгүүл уншсан.' },
        { en: '[While](m) [they](s) [were swimming](v), [it](s) [got](v) [dark](o).', mn: 'Тэднийг сэлж байхад харанхуй болсон.' },
        { en: '[While](m) [he](s) [was sleeping](v), [the cat](s) [broke](v) [a cup](o).', mn: 'Түүнийг унтаж байхад муур аяга хагалсан.' },
      ],
    },
    {
      label: 'Үгүйсгэх',
      structure: 'Subject + wasn\'t / weren\'t + verb-ing … · Subject + didn\'t + base verb …',
      examples: [
        { en: '[I](s) [wasn\'t looking](v) [when](m) [the bus](s) [arrived](v).', mn: 'Автобус ирэхэд би хараагүй байсан.' },
        { en: '[She](s) [didn\'t hear](v) [me](o) [because](m) [she](s) [was listening](v) [to music](o).', mn: 'Тэр хөгжим сонсож байсан болохоор намайг сонсоогүй.' },
        { en: '[They](s) [weren\'t sleeping](v) [when](m) [we](s) [came](v).', mn: 'Биднийг ирэхэд тэд унтаагүй байсан.' },
      ],
    },
    {
      label: 'Асуух',
      structure: 'What + was / were + subject + verb-ing + when …?',
      examples: [
        { en: '[What](o) [were](v) [you](s) [doing](v) [when I called](m)?', mn: 'Намайг залгахад чи юу хийж байсан бэ?' },
        { en: '[Where](m) [was](v) [she](s) [going](v) [when you saw her](m)?', mn: 'Чи түүнийг харахад тэр хаашаа явж байсан бэ?' },
        { en: '[Did](v) [it](s) [rain](v) [while you were walking](m)?', mn: 'Чамайг алхаж байхад бороо орсон уу?' },
      ],
    },
  ],
  signalWords: ['when', 'while', 'as', 'suddenly', 'at that moment', 'just then'],
  notes: [
    'when богино, тасалсан үйлдлийн (Past Simple) өмнө; while урт, үргэлжилж байсан үйлдлийн (Past Continuous) өмнө орно. as нь while-тэй ойролцоо утгатай: As I was leaving, he arrived.',
    'Өгүүлбэр When / While-ээр эхэлбэл хоёр хэсгийн хооронд таслал тавина: While I was cooking, the phone rang. Харин when / while дунд орвол таслал хэрэггүй: The phone rang while I was cooking.',
    'Дүрэмт үйл үг -ed авна: call → called, start → started, arrive → arrived. Дүрэмт бус үйл үгсийг цээжлээрэй: go → went, see → saw, have → had, take → took, come → came, get → got, give → gave, fall → fell, break → broke, hear → heard, say → said, leave → left.',
    'Богино үйлдэл нь урт үйлдлийг заавал зогсоосон байх албагүй: «I was reading when you called» — залгасны дараа би уншсаар байсан ч байж болно. Гол нь залгах үйлдэл унших явц дунд болсон.',
    'suddenly, at that moment, just then гэсэн үгс тасалсан богино үйлдлийг онцолно: I was walking home. Suddenly, I heard a noise.',
    'Хоёр богино, дараалсан үйлдлийг when-ээр холбовол хоёулаа Past Simple болно: When she saw me, she smiled. Энд «хараад, дараа нь инээмсэглэсэн» гэсэн утгатай.',
  ],
  commonMistakes: [
    {
      wrong: 'I was reading when you were calling.',
      correct: 'I was reading when you called.',
      explanation: 'Залгах бол богино, тасалсан үйлдэл — Past Simple. Хоёуланг нь -ing болговол «хоёулаа удаан үргэлжилсэн» гэсэн өөр утга гарна.',
    },
    {
      wrong: 'While I cooked, the phone rang.',
      correct: 'While I was cooking, the phone rang.',
      explanation: 'while-ийн ард урт, дэвсгэр үйлдэл орно, тиймээс Past Continuous. «I cooked» гэвэл хоол хийсэн дууссан баримт болж, утас дуугарах мөчийн зураг алдагдана.',
    },
    {
      wrong: 'When I was getting home, I opened the window.',
      correct: 'When I got home, I opened the window.',
      explanation: 'Гэртээ ирэх бол богино, дууссан үйлдэл. Хоёр богино үйлдэл дараалан болсон бол хоёулаа Past Simple.',
    },
    {
      wrong: 'She was walking home when she seed a cat.',
      correct: 'She was walking home when she saw a cat.',
      explanation: 'see бол дүрэмт бус үйл үг: see → saw. -ed залгаж болохгүй. Past Simple хэсэгт дүрэмт бус хэлбэрээ зөв санах хэрэгтэй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «уншиж байтал», «уншиж байхад» гэсэн «-тал / -хад» нөхцөл урт үйлдлийг заадаг. Англиар энэ үүргийг when + Past Simple эсвэл while + Past Continuous гүйцэтгэнэ: I was reading when you called.',
      'Монголоор урт үйлдэл ихэвчлэн өгүүлбэрийн эхэнд ордог: «Намайг унтаж байхад утас дуугарсан». Англиар хоёр дараалал хоёулаа боломжтой; While-ээр эхэлбэл таслал тавина, when-ээр дунд нь холбовол таслал хэрэггүй.',
      'Монголоор «унасан», «залгасан» гэсэн «-сан» бүх эзэнд адилхан. Англиар дүрэмт үйл үг -ed авдаг ч дүрэмт бус үйл үг (went, saw, took) огт өөр хэлбэртэй тул түүх ярихдаа хоёр төрлөө хамт санах хэрэгтэй.',
      'Монголоор «Аавыг хоол хийж байхад ээж уншиж байсан» гэхэд хоёр урт үйлдлийг хоёуланг нь «-ж байсан» гэж хэлдэг. Англиар яг адилхан: хоёуланг нь Past Continuous-ээр хэлж, while-аар холбоно.',
    ],
  },
  dialogue: [
    {
      en: '[You](s) [look](v) [tired](o). [What](o) [happened](v) [last night](m)?',
      mn: 'Чи ядарсан харагдаж байна. Өчигдөр шөнө юу болсон бэ?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [was sleeping](v) [when](m) [I](s) [heard](v) [a strange noise](o).',
      mn: 'Би унтаж байтал сонин чимээ сонссон.',
      speaker: 'Saraa',
    },
    {
      en: '[Really](m)? [What](o) [did](v) [you](s) [do](v)?',
      mn: 'Үнэхээр үү? Чи яасан бэ?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [got up](v) [and](m) [went](v) [to the kitchen](m). [While](m) [I](s) [was looking](v) [around](m), [the cat](s) [jumped](v) [off the fridge](m)!',
      mn: 'Би босоод гал тогооны өрөө рүү очсон. Намайг эргэн тойрноо харж байхад муур хөргөгчөөс үсэрсэн!',
      speaker: 'Saraa',
    },
    {
      en: '[So](m) [it](s) [was](v) [just the cat](o). [Were](v) [your parents](s) [sleeping](v) [at that time](m)?',
      mn: 'Тэгэхээр зүгээр л муур байж. Тэр үед аав ээж чинь унтаж байсан уу?',
      speaker: 'Bat',
    },
    {
      en: '[Yes](o), [they](s) [were](v). [They](s) [didn\'t hear](v) [anything](o).',
      mn: 'Тийм ээ, унтаж байсан. Тэд юу ч сонсоогүй.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-2-1',
      ruleId: 2,
      kind: 'fill',
      question: 'I was reading when you ___.',
      options: ['called', 'were calling', 'call', 'calling'],
      answer: 'called',
      explanation: 'Залгах бол урт үйлдлийг тасалсан богино үйлдэл — Past Simple (called). were calling хоёр урт үйлдэл болгоно, call одоо цаг, calling-д туслах үйл үг байхгүй.',
      hint: 'when-ийн ард богино, дууссан үйлдэл.',
    },
    {
      id: 'a2-2-2',
      ruleId: 2,
      kind: 'fill',
      question: 'While she ___ dinner, the phone rang.',
      options: ['cooked', 'was cooking', 'cooks', 'were cooking'],
      answer: 'was cooking',
      explanation: 'while-ийн ард урт, дэвсгэр үйлдэл орно: was cooking. cooked дууссан баримт болгоно, cooks одоо цаг, she-тэй were болохгүй.',
      hint: 'while-ийн ард -ing.',
    },
    {
      id: 'a2-2-3',
      ruleId: 2,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['When I got home, I was opening the window.', 'When I was getting home, I opened the window.', 'When I got home, I opened the window.', 'When I got home I was open the window.'],
      answer: 'When I got home, I opened the window.',
      explanation: 'Гэртээ ирэх, цонх нээх хоёулаа богино, дараалсан үйлдэл — хоёулаа Past Simple. Дэвсгэр урт үйлдэл байхгүй тул -ing хэрэггүй; was open гэсэн хэлбэр байхгүй.',
      hint: 'Хоёр богино үйлдэл дараалан болсон.',
    },
    {
      id: 'a2-2-4',
      ruleId: 2,
      kind: 'translate',
      question: 'Биднийг кино үзэж байхад гэрэл унтарсан.',
      options: ['We watched a film when the lights were going out.', 'We were watching a film when the lights went out.', 'We are watching a film when the lights went out.', 'We were watching a film when the lights goed out.'],
      answer: 'We were watching a film when the lights went out.',
      explanation: '«үзэж байхад» урт үйлдэл → were watching; «унтарсан» богино үйлдэл → went out. go бол дүрэмт бус: goed биш, went. are watching одоо цаг.',
      hint: 'Урт = -ing, богино = дүрэмт бус хэлбэр go → went.',
    },
  ],
};
