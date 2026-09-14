// frontend/src/lib/grammar/a2/rule-05.ts
// A2 дүрэм 5: will vs. be going to
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule05: GrammarRule = {
  id: 5,
  title: 'will vs. be going to',
  titleMn: 'will ба be going to — ирээдүйн хоёр хэлбэр: гэнэтийн шийдвэр ба урьдчилсан төлөвлөгөө',
  hook: '«Хүлээгээрэй, би хаалгыг нь онгойлгоё» гэдэг үү, «Би зуны амралтаараа Хөвсгөл явна» гэдэг үү? — хоёулаа ирээдүй, гэвч англиар хоёр өөр үгээр хэлнэ.',
  summary: 'will нь яриж байх мөчид гаргасан гэнэтийн шийдвэр, амлалт, санал, таамаглалд хэрэглэнэ. be going to нь өмнө нь аль хэдийн шийдчихсэн төлөвлөгөө болон одоо харагдаж буй нотолгоонд суурилсан таамаглалд хэрэглэнэ.',
  description: 'Англи хэлэнд ирээдүйг хэлэх хоёр гол хэлбэр бий: will + үйл үг ба be going to + үйл үг. Ялгаа нь «хэзээ шийдсэн бэ?» гэдэгт байна. Утас дуугармагц «I\'ll answer it» гэвэл шийдвэрийг яг одоо гаргаж байна — энэ will. Харин «I\'m going to visit my grandmother on Sunday» гэвэл энэ талаар өмнө нь бодож, шийдчихсэн — энэ be going to. Мөн will-ийг «I think», «probably» гэх мэт өөрийн бодол дээр суурилсан таамаглал, амлалт («I\'ll call you»), санал («I\'ll help you») хэлэхэд хэрэглэнэ. be going to-г одоо нүдэнд харагдаж байгаа нотолгоотой таамаглалд хэрэглэнэ: тэнгэр үүлэрхэг байвал «It\'s going to rain». Монголоор хоёулаа «-на/-нэ» гэж төгсдөг тул ялгааг нь нөхцөл байдлаас нь ойлгож сурах хэрэгтэй. Аль ч хэлбэрт үйл үг үндсэн хэлбэрээрээ орно.',
  structure: 'Subject + will + base verb · Subject + am / is / are + going to + base verb',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'will / am / is / are going to', part: 'verb' },
    { text: 'base verb', part: 'verb' },
    { text: 'tomorrow / next week', part: 'modifier' },
  ],
  tip: 'Яг одоо шийдвэл → will («За, би авъя»). Өмнө нь шийдчихсэн бол → be going to («Би авах гэж байгаа»). Тэнгэрт үүл харагдаж байвал → going to rain, зүгээр л бодож байвал → I think it will rain.',
  examples: [
    { en: '[The phone](s) [is ringing](v). [I](s)[\'ll answer](v) [it](o).', mn: 'Утас дуугарч байна. Би авъя.' },
    { en: '[We](s) [are going to buy](v) [a new car](o) [next month](m).', mn: 'Бид дараа сард шинэ машин авах гэж байгаа.' },
    { en: '[Look at the clouds](m)! [It](s) [is going to rain](v).', mn: 'Үүлийг хараач! Бороо орох нь.' },
    { en: '[I](s) [think](v) [she](s) [will pass](v) [the exam](o).', mn: 'Тэр шалгалтад тэнцэнэ гэж би бодож байна.' },
  ],
  useCases: [
    {
      title: 'Гэнэтийн шийдвэр — will',
      description: 'Ярьж байх мөчид, урьдчилан бодоогүй байж гаргасан шийдвэрийг will-ээр хэлнэ. Ихэвчлэн ямар нэг нөхцөл байдалд хариу үйлдэл үзүүлж байгаа мөч байдаг. Ярианд бараг үргэлж \'ll гэж товчилно.',
      examples: [
        { en: '[It](s)[\'s](v) [cold](o). [I](s)[\'ll close](v) [the window](o).', mn: 'Хүйтэн байна. Би цонхоо хаая.' },
        { en: '[We](s) [don\'t have](v) [milk](o). [I](s)[\'ll go](v) [to the shop](m).', mn: 'Сүү байхгүй байна. Би дэлгүүр явъя.' },
        { en: '[Okay](m), [I](s)[\'ll take](v) [the blue one](o).', mn: 'За, би цэнхэрийг нь авъя.' },
      ],
    },
    {
      title: 'Төлөвлөгөө, санаа зорилго — be going to',
      description: 'Өмнө нь аль хэдийн шийдчихсэн, бодож төлөвлөсөн зүйлээ be going to-гоор хэлнэ. Монголоор «… гэж байгаа», «… гэж төлөвлөж байгаа» гэсэн утга. Хэн нэгний төлөвлөгөөг асуухад ч энэ хэлбэрийг хэрэглэнэ.',
      examples: [
        { en: '[I](s) [am going to study](v) [medicine](o) [next year](m).', mn: 'Би ирэх жил анагаах ухаанаар суралцах гэж байгаа.' },
        { en: '[They](s) [are going to move](v) [to Darkhan](m) [in June](m).', mn: 'Тэд зургадугаар сард Дархан руу нүүх гэж байгаа.' },
        { en: '[What](o) [are](v) [you](s) [going to do](v) [this weekend](m)?', mn: 'Чи энэ амралтын өдрүүдэд юу хийх гэж байгаа вэ?' },
      ],
    },
    {
      title: 'Бодол, таамаглал — will',
      description: 'Өөрийн бодол, туршлага, мэдрэмж дээр тулгуурлан ирээдүйн талаар таамаглахад will хэрэглэнэ. I think, I\'m sure, probably, maybe гэсэн үгстэй хамт байнга ирдэг.',
      examples: [
        { en: '[I](s) [think](v) [it](s) [will be](v) [hot](o) [tomorrow](m).', mn: 'Маргааш халуун байна гэж би бодож байна.' },
        { en: '[She](s) [will probably be](v) [late](o).', mn: 'Тэр магадгүй хоцорно.' },
        { en: '[People](s) [will live](v) [on Mars](m) [one day](m).', mn: 'Хүмүүс хэзээ нэгэн цагт Ангараг дээр амьдарна.' },
      ],
    },
    {
      title: 'Нотолгоотой таамаглал — be going to',
      description: 'Одоо нүдэнд харагдаж, мэдрэгдэж байгаа зүйл дээр тулгуурласан таамаглалд be going to хэрэглэнэ. Монголоор «… нь», «… гэж байна» гэсэн өнгө аястай: «Бороо орох нь».',
      examples: [
        { en: '[She](s) [is going to have](v) [a baby](o) [in May](m).', mn: 'Тэр тавдугаар сард хүүхэдтэй болох гэж байгаа.' },
        { en: '[Watch out](v)! [You](s) [are going to fall](v)!', mn: 'Болгоомжтой! Чи унах нь!' },
        { en: '[It](s)[\'s](v) [7:55](o). [We](s) [are going to miss](v) [the bus](o).', mn: '7:55 болж байна. Бид автобусандаа хоцрох нь.' },
      ],
    },
    {
      title: 'Амлалт, санал — will',
      description: 'Хэн нэгэнд ямар нэг зүйл хийхээ амлах, туслах санал тавихад will хэрэглэнэ. Энд be going to тохирохгүй: амлалт бол яг тэр мөчид өгч буй үг.',
      examples: [
        { en: '[I](s)[\'ll call](v) [you](o) [tonight](m), [I promise](m).', mn: 'Би чам руу орой залгана, амлая.' },
        { en: '[Don\'t worry](v), [I](s)[\'ll help](v) [you](o) [with your homework](m).', mn: 'Санаа зовох хэрэггүй, би чамд гэрийн даалгаварт чинь туслана.' },
        { en: '[I](s)[\'ll carry](v) [your bag](o).', mn: 'Би цүнхийг чинь аваад өгье.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Батлах',
      structure: 'Subject + will (\'ll) + base verb · Subject + am / is / are + going to + base verb',
      examples: [
        { en: '[I](s) [will send](v) [the photos](o) [later](m).', mn: 'Би зургуудыг дараа явуулна.' },
        { en: '[He](s) [is going to sell](v) [his bike](o).', mn: 'Тэр унадаг дугуйгаа зарах гэж байгаа.' },
        { en: '[We](s)[\'re going to visit](v) [Bat](o) [on Sunday](m).', mn: 'Бид ням гарагт Батынд очих гэж байгаа.' },
      ],
    },
    {
      label: 'Үгүйсгэх',
      structure: 'Subject + won\'t + base verb · Subject + am not / isn\'t / aren\'t + going to + base verb',
      examples: [
        { en: '[I](s) [won\'t forget](v) [your birthday](o).', mn: 'Би чиний төрсөн өдрийг мартахгүй.' },
        { en: '[She](s) [isn\'t going to come](v) [to the party](m).', mn: 'Тэр үдэшлэгт ирэхгүй.' },
        { en: '[They](s) [aren\'t going to wait](v) [for us](m).', mn: 'Тэд биднийг хүлээхгүй.' },
      ],
    },
    {
      label: 'Асуух',
      structure: 'Will + subject + base verb? · Am / Is / Are + subject + going to + base verb?',
      examples: [
        { en: '[Will](v) [you](s) [be](v) [at home](m) [tomorrow](m)?', mn: 'Чи маргааш гэртээ байх уу?' },
        { en: '[Are](v) [you](s) [going to cook](v) [tonight](m)?', mn: 'Чи өнөө орой хоол хийх гэж байгаа юу?' },
        { en: '[When](m) [is](v) [he](s) [going to start](v) [his new job](o)?', mn: 'Тэр хэзээ шинэ ажлаа эхлэх гэж байгаа вэ?' },
      ],
    },
    {
      label: 'Богино хариулт',
      structure: 'Yes, subject + will. / No, subject + won\'t. · Yes, subject + am / is / are. / No, subject + \'m not / isn\'t / aren\'t.',
      examples: [
        { en: '[Yes](o), [I](s) [will](v).', mn: 'Тийм ээ, байна.' },
        { en: '[No](o), [she](s) [won\'t](v).', mn: 'Үгүй, тэр тэгэхгүй.' },
        { en: '[Yes](o), [we](s) [are](v).', mn: 'Тийм ээ, тэгэх гэж байгаа.' },
      ],
    },
  ],
  signalWords: ['tomorrow', 'next week', 'next year', 'I think', 'probably', 'soon', 'I promise', 'Look!'],
  notes: [
    'will эзэн бүрд адилхан, хувирахгүй: I will, she will, they will. Дараах үйл үг үндсэн хэлбэрээрээ орно — -s, -ing, to аль нь ч үгүй: «She will go», «She will goes» биш.',
    'Товчилсон хэлбэр: I\'ll, you\'ll, he\'ll, she\'ll, it\'ll, we\'ll, they\'ll. Үгүйсгэл will not → won\'t (willn\'t биш!). Ярианд бараг үргэлж товчилно.',
    'be going to-д be үйл үг эзнээрээ хувирна: I am going to, he is going to, they are going to. going to-гийн араас үйл үгийн үндсэн хэлбэр орно: «going to buy», «going to buying» биш.',
    'Ярианд going to-г «gonna» гэж хэлдэг: «I\'m gonna go». Энэ зөвхөн ярианы хэлбэр — бичгэнд, шалгалтад going to гэж бүтнээр нь бичнэ.',
    'go үйл үгтэй давхардаж болно: «I\'m going to go to the shop» зөв. Ярианд ихэвчлэн «I\'m going to the shop» гэж богиносгодог.',
    'I think, I hope, I\'m sure, probably, maybe гэсэн үгсийн араас ихэвчлэн will ирнэ. Look!, Watch out!, Careful! гэсэн үгсийн араас ихэвчлэн be going to ирнэ — нүдний өмнө болох гэж байгаа зүйл.',
  ],
  commonMistakes: [
    {
      wrong: 'I will going to visit my uncle.',
      correct: 'I\'m going to visit my uncle. / I will visit my uncle.',
      explanation: 'will ба be going to хоёрыг нэг өгүүлбэрт хольж болохгүй. Аль нэгийг нь сонго: will + үндсэн үйл үг эсвэл be + going to + үндсэн үйл үг.',
    },
    {
      wrong: 'She will goes to Erdenet next week.',
      correct: 'She will go to Erdenet next week.',
      explanation: 'will-ийн араас үйл үг үргэлж үндсэн хэлбэрээрээ орно. Эзэн she байсан ч -s нэмэхгүй — баймж үйл үгийн дараах үйл үг «нүцгэн» байна.',
    },
    {
      wrong: 'Look at the sky! It will rain.',
      correct: 'Look at the sky! It\'s going to rain.',
      explanation: 'Нүдэнд харагдаж байгаа нотолгоо (харанхуй тэнгэр) дээр суурилсан таамаглалд be going to хэрэглэнэ. will бол зөвхөн бодол дээр тулгуурлана: «I think it will rain».',
    },
    {
      wrong: 'We going to have lunch at 12.',
      correct: 'We are going to have lunch at 12.',
      explanation: 'be going to-д am/is/are заавал орно. Монголоор «Бид 12 цагт хооллох гэж байгаа» гэхэд be байдаггүй тул орхигдуулах алдаа их гардаг.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор ирээдүйг «-на/-нэ/-но/-нө» нэг л нөхцөлөөр хэлнэ: «явна», «авна». Англиар харин шийдвэрийг хэзээ гаргасан бэ гэдгээс хамаарч will эсвэл be going to гэж хоёр өөр хэлбэр сонгоно.',
      'Монголоор «Би авъя», «Би хаая» гэсэн «-ъя/-ье/-ъё» хэлбэр яг одоо гаргаж буй шийдвэрийг илэрхийлдэг. Энэ бол will-ийн утга: «I\'ll take it», «I\'ll close it». Энэ хэлбэрийг харвал will гэж бодоорой.',
      'Монголоор «… гэж байгаа», «… гэж төлөвлөж байгаа», «… гэж байна» гэсэн хэлбэр be going to-той дүйнэ: «Би нүүх гэж байгаа» → I\'m going to move. «Бороо орох нь» гэсэн «-х нь» хэлбэр ч мөн be going to.',
      'Монголоор амлалтад «-на» дээр «амлая», «заавал» гэх мэт үг нэмдэг бол англиар will өөрөө амлалтын өнгө аястай: «I\'ll call you» гэхэд л амлалт болно. Тусдаа үг нэмэх шаардлагагүй.',
    ],
  },
  dialogue: [
    {
      en: '[Saraa](s), [what](o) [are](v) [you](s) [going to do](v) [in the summer](m)?',
      mn: 'Сараа, чи зун юу хийх гэж байгаа вэ?',
      speaker: 'Bat',
    },
    {
      en: '[I](s)[\'m going to work](v) [at my aunt\'s café](m). [I](s) [decided](v) [last month](m).',
      mn: 'Би нагац эгчийнхээ кафед ажиллах гэж байгаа. Өнгөрсөн сард шийдсэн.',
      speaker: 'Saraa',
    },
    {
      en: '[Nice](o)! [I](s) [don\'t have](v) [a plan](o) [yet](m). [Maybe](m) [I](s)[\'ll go](v) [to the countryside](m).',
      mn: 'Гоё юм! Надад одоохондоо төлөвлөгөө алга. Магадгүй би хөдөө явна.',
      speaker: 'Bat',
    },
    {
      en: '[Look at the sky](m)! [It](s)[\'s going to rain](v). [Do](v) [you](s) [have](v) [an umbrella](o)?',
      mn: 'Тэнгэрийг хараач! Бороо орох нь. Чамд шүхэр байна уу?',
      speaker: 'Saraa',
    },
    {
      en: '[No](o). [Wait](v), [I](s)[\'ll get](v) [my jacket](o) [from the car](m).',
      mn: 'Үгүй. Хүлээж бай, би машинаас хүрмээ аваад ирье.',
      speaker: 'Bat',
    },
    {
      en: '[Hurry](v)! [I](s)[\'ll wait](v) [for you](m) [here](m).',
      mn: 'Хурдал! Би чамайг энд хүлээж байя.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-5-1',
      ruleId: 5,
      kind: 'fill',
      question: 'A: The phone is ringing. B: OK, I ___ answer it.',
      options: ['will', 'am going to', 'going to', 'am'],
      answer: 'will',
      explanation: 'Утас дуугарч байгааг сонсоод яг одоо шийдвэр гаргаж байна → will. am going to бол өмнө нь шийдсэн төлөвлөгөө. going to-д be дутуу, am-ийн араас answer шууд орж болохгүй.',
      hint: 'Шийдвэрийг хэзээ гаргаж байна вэ — одоо юу, өмнө нь үү?',
    },
    {
      id: 'a2-5-2',
      ruleId: 5,
      kind: 'fill',
      question: 'We ___ visit my grandparents next Saturday. We bought the tickets yesterday.',
      options: ['will', 'are going to', 'is going to', 'going to'],
      answer: 'are going to',
      explanation: 'Тасалбараа өчигдөр авчихсан — төлөвлөгөө аль хэдийн шийдэгдсэн → be going to. Эзэн We тул are. will бол гэнэтийн шийдвэр, is going to нь we-тэй таарахгүй, going to-д be дутуу.',
      hint: 'Тасалбар аль хэдийн авчихсан гэдэг нь юу гэсэн үг вэ?',
    },
    {
      id: 'a2-5-3',
      ruleId: 5,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['She will goes home early.', 'She will going to go home early.', 'She is going to go home early.', 'She going to go home early.'],
      answer: 'She is going to go home early.',
      explanation: 'be going to-д is заавал орно, араас нь үндсэн үйл үг go. «will goes» — will-ийн дараа -s болохгүй. «will going to» — хоёр хэлбэрийг хольсон. «She going to» — be дутуу.',
      hint: 'be going to-гийн be хаана байна?',
    },
    {
      id: 'a2-5-4',
      ruleId: 5,
      kind: 'translate',
      question: 'Үүлийг хараач! Бороо орох нь.',
      options: ['Look at the clouds! It will rain.', 'Look at the clouds! It is going to rain.', 'Look at the clouds! It rains.', 'Look at the clouds! It is raining.'],
      answer: 'Look at the clouds! It is going to rain.',
      explanation: 'Үүл харагдаж байна — нотолгоотой таамаглал → be going to. «It will rain» бол зүгээр л бодол. «It rains» одоо энгийн цаг — зуршил. «It is raining» — бороо аль хэдийн орж байна гэсэн утга, харин монгол өгүүлбэрт хараахан ороогүй.',
      hint: '«Хараач!» гэсэн үг нотолгоо байгааг заана.',
    },
  ],
};
