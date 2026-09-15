// frontend/src/lib/grammar/b1/rule-04.ts
// B1 дүрэм 4: Future Continuous & Future Perfect
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule04: GrammarRule = {
  id: 4,
  title: 'Future Continuous & Future Perfect',
  titleMn: 'Ирээдүй үргэлжлэх ба ирээдүй төгссөн цаг — тэр үед хийж байх, тэр үе гэхэд дуусгачихсан байх',
  hook: '«Маргааш энэ цагт би онгоцонд сууж явж байх болно», «Шинэ он гэхэд би энэ номыг дуусгачихсан байна» — ирээдүйн нэг мөчийг дүрсэлж сурцгаая.',
  summary: 'will be + Verb-ing (Future Continuous) нь ирээдүйн тодорхой нэг мөчид явагдаж байх үйлдлийг заана. will have + Verb3 (Future Perfect) нь ирээдүйн тодорхой нэг мөч ГЭХЭД аль хэдийн дууссан байх үйлдлийг заана. Хоёулаа ирээдүйн нэг цэгийг лавлах цэг болгодог.',
  description: 'A2 түвшинд бид will (гэнэтийн шийдвэр, таамаг) болон be going to (төлөвлөгөө), Present Continuous (тогтсон тохиролцоо) гэсэн ирээдүйн гурван хэлбэрийг үзсэн. Эдгээр нь бүгд «ирээдүйд ямар нэг зүйл болно» гэж хэлдэг. B1-д бид ирээдүйн ТОДОРХОЙ НЭГ МӨЧИЙГ лавлах цэг болгож, тэр мөчид юу болж байх, юу дууссан байхыг хэлж сурна. Future Continuous (will be doing) нь A2-д үзсэн Past Continuous (was doing)-ийн ирээдүйн хувилбар: This time tomorrow I\'ll be flying to Seoul — маргааш энэ цагт би нисч явж байх болно. Future Perfect (will have done) нь B1-ийн 2-р дүрэмд үзсэн Past Perfect (had done)-ийн ирээдүйн хувилбар: By 2030 I\'ll have finished university — 2030 он гэхэд би их сургуулиа төгсчихсөн байна. Түлхүүр үг нь by (гэхэд): by next week, by the time you arrive. Мөн Future Continuous-ийг эелдэг асуулт, хэвийн явц дахь үйлдэлд ч хэрэглэдэг: Will you be using the car tonight? Монголоор «-ж байх болно» (Future Continuous), «-чихсан байх болно / -чихсан байна» (Future Perfect) гэсэн хэлбэрүүд утгыг нь тодорхой ялгаж өгдөг.',
  structure: 'Subject + will be + Verb-ing · Subject + will have + Verb3 + by …',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'will be', part: 'verb' },
    { text: 'Verb-ing', part: 'verb' },
    { text: '· will have + Verb3 + by …', part: 'modifier' },
  ],
  tip: 'Future Continuous = «тэр үед … хийж байх болно» (үйл явц дунд нь). Future Perfect = «тэр үе гэхэд … дуусгачихсан байна» (by-тай). Лавлах цэг нь ирээдүйн нэг мөч.',
  examples: [
    { en: '[This time tomorrow](m) [I](s) [will be flying](v) [to Seoul](m).', mn: 'Маргааш энэ цагт би Сөүл рүү нисч явж байх болно.' },
    { en: '[Don\'t call at 8](m). [We](s)[\'ll be having](v) [dinner](o).', mn: '8 цагт бүү залгаарай. Бид оройн хоолоо идэж байх болно.' },
    { en: '[By next year](m), [she](s) [will have finished](v) [her degree](o).', mn: 'Ирэх жил гэхэд тэр дипломоо авчихсан байна.' },
    { en: '[By the time you arrive](m), [I](s)[\'ll have cooked](v) [everything](o).', mn: 'Чамайг ирэх үед би бүгдийг хийчихсэн байх болно.' },
  ],
  useCases: [
    {
      title: 'Ирээдүйн нэг мөчид явагдаж байх үйлдэл — Future Continuous',
      description: 'Ирээдүйн тодорхой цаг (at 10 tomorrow, this time next week) дээр аль хэдийн эхэлсэн, үргэлжилж байх үйлдэл. A2-д үзсэн Past Continuous-той (At 10 yesterday I was working) яг адил логик, зөвхөн ирээдүйд.',
      examples: [
        { en: '[At ten o\'clock tomorrow](m), [I](s)[\'ll be sitting](v) [in an exam](m).', mn: 'Маргааш арван цагт би шалгалт өгч сууж байх болно.' },
        { en: '[This time next week](m), [we](s)[\'ll be lying](v) [on the beach](m).', mn: 'Ирэх долоо хоногийн энэ үед бид далайн эрэг дээр хэвтэж байх болно.' },
        { en: '[She](s)[\'ll be working](v) [late](m) [tonight](m), [so](m) [don\'t wait](v) [for her](o).', mn: 'Тэр өнөө орой оройтож ажиллаж байх болно, тиймээс түүнийг бүү хүлээ.' },
      ],
    },
    {
      title: 'Хэвийн явц дахь ирээдүйн үйлдэл ба эелдэг асуулт',
      description: 'Future Continuous-ийг мөн «яаж ийж байтал болох» хэвийн явцын үйлдэлд, ялангуяа хэн нэгний төлөвлөгөөг эелдгээр асуухад хэрэглэнэ. Will you …? гэвэл хүсэлт мэт сонсогддог бол Will you be …-ing? гэвэл зүгээр л мэдээлэл асууж байгаа юм.',
      examples: [
        { en: '[Will](v) [you](s) [be using](v) [the car](o) [tonight](m)?', mn: 'Чи өнөө орой машин хэрэглэх үү? (хэрэглэх байх гэж бодож асуув)' },
        { en: '[I](s)[\'ll be passing](v) [the post office](o), [so](m) [I](s) [can post](v) [your letter](o).', mn: 'Би шуудангийн хажуугаар өнгөрөх юм, тэгэхээр захиаг чинь хийж өгч болно.' },
        { en: '[Will](v) [you](s) [be coming](v) [to the meeting](m)?', mn: 'Чи хуралд ирэх үү?' },
      ],
    },
    {
      title: 'Ирээдүйн нэг мөч гэхэд дууссан байх үйлдэл — Future Perfect',
      description: 'by (гэхэд) + ирээдүйн цаг гэсэн лавлах цэг байна. Тэр цэг хүрэхээс өмнө үйлдэл дуусчихсан байна. B1-ийн 2-р дүрэмд үзсэн Past Perfect-той (By 5 pm yesterday I had finished) яг адил логик, зөвхөн ирээдүйд.',
      examples: [
        { en: '[By 2030](m), [they](s) [will have built](v) [the new airport](o).', mn: '2030 он гэхэд тэд шинэ нисэх буудлыг барьчихсан байна.' },
        { en: '[I](s)[\'ll have finished](v) [this report](o) [by Friday](m).', mn: 'Баасан гараг гэхэд би энэ тайланг дуусгачихсан байна.' },
        { en: '[By the end of the year](m), [we](s)[\'ll have saved](v) [enough money](o).', mn: 'Жилийн эцэс гэхэд бид хангалттай мөнгө хуримтлуулчихсан байна.' },
      ],
    },
    {
      title: 'Хугацаа, тоо хэмжээний нийлбэр — Future Perfect',
      description: 'Ирээдүйн нэг мөч гэхэд «хэдэн жил болсон байх», «хэдэн удаа хийсэн байх» гэдгийг Future Perfect-ээр хэлнэ. Ойн баяр, хугацааны тэмдэглэлт мөчийг ярихад их хэрэглэнэ.',
      examples: [
        { en: '[Next month](m) [we](s)[\'ll have been](v) [married](o) [for twenty years](m).', mn: 'Ирэх сард бид гэрлээд хорин жил болсон байна.' },
        { en: '[By June](m) [I](s)[\'ll have worked](v) [here](m) [for a decade](m).', mn: 'Зургаадугаар сар гэхэд би энд арван жил ажилласан байна.' },
        { en: '[By tonight](m) [she](s)[\'ll have read](v) [the whole book](o).', mn: 'Өнөө орой гэхэд тэр номыг бүхэлд нь уншчихсан байна.' },
      ],
    },
    {
      title: 'A2-ийн will-ээс ялгаа — болно уу, болж байх уу, дууссан байх уу',
      description: 'A2-д үзсэн will нэг үйлдэл ирээдүйд болно гэдгийг л хэлдэг. Future Continuous тэр үйлдлийн ДУНД байхыг, Future Perfect тэр үйлдэл ДУУССАН байхыг хэлнэ. Гурвыг нь нэг үйлдлээр харьцуулж үзье.',
      examples: [
        { en: '[I](s)[\'ll write](v) [the essay](o) [tomorrow](m).', mn: 'Би маргааш эссэ бичнэ. (болно)' },
        { en: '[At 9 tomorrow](m) [I](s)[\'ll be writing](v) [the essay](o).', mn: 'Маргааш 9 цагт би эссэ бичиж байх болно. (дунд нь)' },
        { en: '[By 9 tomorrow](m) [I](s)[\'ll have written](v) [the essay](o).', mn: 'Маргааш 9 цаг гэхэд би эссэг бичиж дуусгачихсан байна. (дууссан)' },
      ],
    },
  ],
  forms: [
    {
      label: 'Future Continuous — батлах / үгүйсгэх',
      structure: 'Subject + will be + V-ing · Subject + won\'t be + V-ing',
      examples: [
        { en: '[Tomorrow evening](m) [I](s)[\'ll be watching](v) [the match](o).', mn: 'Маргааш орой би тэмцээн үзэж байх болно.' },
        { en: '[He](s) [won\'t be working](v) [next week](m). [He](s)[\'s](v) [on holiday](m).', mn: 'Тэр ирэх долоо хоногт ажиллахгүй байх болно. Амралттай.' },
        { en: '[They](s)[\'ll be travelling](v) [all day](m).', mn: 'Тэд өдөржин аялж явж байх болно.' },
      ],
    },
    {
      label: 'Future Continuous — асуух',
      structure: 'Will + subject + be + V-ing? · Wh- + will + subject + be + V-ing?',
      examples: [
        { en: '[Will](v) [you](s) [be staying](v) [at the hotel](m)?', mn: 'Чи зочид буудалд байрлах уу?' },
        { en: '[What](o) [will](v) [you](s) [be doing](v) [at this time tomorrow](m)?', mn: 'Маргааш энэ цагт чи юу хийж байх вэ?' },
        { en: '[Will](v) [she](s) [be joining](v) [us](o) [for lunch](m)?', mn: 'Тэр бидэнтэй өдрийн хоолонд нэгдэх үү?' },
      ],
    },
    {
      label: 'Future Perfect — батлах / үгүйсгэх',
      structure: 'Subject + will have + V3 · Subject + won\'t have + V3',
      examples: [
        { en: '[By Monday](m) [I](s)[\'ll have finished](v) [the project](o).', mn: 'Даваа гараг гэхэд би төслөө дуусгачихсан байна.' },
        { en: '[She](s) [won\'t have arrived](v) [by six](m). [The traffic](s) [is](v) [terrible](o).', mn: 'Тэр зургаан цаг гэхэд ирээгүй байх болно. Түгжрэл аймаар байна.' },
        { en: '[The film](s) [will have started](v) [by the time we get there](m).', mn: 'Биднийг очих үед кино эхэлчихсэн байх болно.' },
      ],
    },
    {
      label: 'Future Perfect — асуух',
      structure: 'Will + subject + have + V3 + by …? · How long will + subject + have + V3?',
      examples: [
        { en: '[Will](v) [you](s) [have finished](v) [by five](m)?', mn: 'Чи тав гэхэд дуусгачихсан байх уу?' },
        { en: '[How many countries](o) [will](v) [she](s) [have visited](v) [by the end of the trip](m)?', mn: 'Аяллын төгсгөл гэхэд тэр хэдэн улсаар явсан байх вэ?' },
        { en: '[Will](v) [they](s) [have built](v) [the road](o) [by winter](m)?', mn: 'Өвөл гэхэд тэд замыг барьчихсан байх уу?' },
      ],
    },
  ],
  signalWords: ['this time tomorrow', 'at 10 o\'clock tomorrow', 'all day tomorrow', 'by', 'by the time', 'by then', 'by next week', 'in two years\' time'],
  notes: [
    'by гэдэг үг Future Perfect-ийн гол дохио: by Friday = баасан гараг гэхэд (баасан гарагаас өмнө хэзээ ч байж болно). Харин on Friday гэвэл яг баасан гарагт гэсэн утгатай, энгийн will хэрэглэнэ.',
    'by the time + Present Simple (by the time you arrive), will биш. Цагийн дагалдах өгүүлбэрт will хэрэглэхгүй гэдэг A2-ийн 1-р нөхцөлийн дүрэм энд ч хүчинтэй.',
    'Future Continuous-д төлөв заасан үйл үг (know, be, have, like) хэрэглэхгүй: I\'ll be knowing (буруу). Future Perfect-д харин болно: I\'ll have known him for 10 years.',
    'Future Continuous-аар эелдэг асуулт асуухдаа Will you be …-ing? гэдэг нь «чи тэгэх төлөвлөгөөтэй юу» гэсэн төвийг сахисан асуулт. Will you …? гэвэл хүсэлт мэт сонсогдож болно.',
    'will-ийн оронд be going to хэрэглэж болно: I\'m going to be working late. Гэхдээ Future Perfect-д ихэвчлэн will хэрэглэнэ.',
    'Хоёр цагийн товчлол: I\'ll be doing, I\'ll have done. Ярианд \'ll have → «-л эв» шиг богино сонсогддог: I\'ll have finished.',
  ],
  commonMistakes: [
    {
      wrong: 'By next year I will finish my studies.',
      correct: 'By next year I will have finished my studies.',
      explanation: 'by (гэхэд) нь тэр цэгээс өмнө дууссан байхыг заана — Future Perfect. Энгийн will хэрэглэвэл «яг ирэх жил дуусгана» гэсэн өөр утга гарна.',
    },
    {
      wrong: 'This time tomorrow I will fly to Tokyo.',
      correct: 'This time tomorrow I will be flying to Tokyo.',
      explanation: 'this time tomorrow — тэр мөчид нисч явж байх, үйлдлийн дунд байна. Future Continuous. Энгийн will гэвэл «тэр мөчид нисэж эхэлнэ» гэж ойлгогдоно.',
    },
    {
      wrong: 'I\'ll have finished by the time you will arrive.',
      correct: 'I\'ll have finished by the time you arrive.',
      explanation: 'by the time, when, before зэрэг цагийн холбоос үгийн ард will хэрэглэхгүй — Present Simple. Энэ дүрмийг A2-ийн First conditional-д үзсэн.',
    },
    {
      wrong: 'At 8 pm we will be having a car.',
      correct: 'At 8 pm we will be having dinner.',
      explanation: 'have «эзэмших» утгаараа төлөв заасан үйл үг тул -ing хэлбэрт орохгүй. Харин have dinner (хооллох) үйлдэл тул Future Continuous-д болно.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «-ж байх болно» (нисч явж байх болно) гэсэн хэлбэр Future Continuous-ийн утгыг яг өгдөг. Орчуулгад «-ж байх» гарч байвал will be + V-ing гэж бодоорой.',
      'Монголоор «-чихсан байна», «-чихсан байх болно» (дуусгачихсан байна) нь Future Perfect. «Гэхэд» гэдэг үг by-тай яг таардаг: «ирэх жил гэхэд» = by next year.',
      'Монголоор ирээдүйн үйлдлийг ихэвчлэн одоо-ирээдүй хэлбэр «-на» гэж нэг л хэлбэрээр хэлдэг (бичнэ, дуусгана). Англиар will write / will be writing / will have written гурав өөр утгатай тул монгол өгүүлбэрийн «яг тэр үед үү, тэр үе гэхэд үү» гэдгийг бодож сонгох хэрэгтэй.',
      'Монголоор «чамайг ирэх үед» гэхэд ирээдүй байсан ч үйл үг нь «ирэх» (одоо-ирээдүй хэлбэр). Англиар мөн адил by the time you arrive — will хэрэглэхгүй. Энэ талаараа монгол, англи хоёр төстэй.',
    ],
  },
  dialogue: [
    {
      en: 'Saraa, [what](o) [will](v) [you](s) [be doing](v) [this time next month](m)?',
      mn: 'Сараа, ирэх сарын энэ үед чи юу хийж байх вэ?',
      speaker: 'Bat',
    },
    {
      en: '[I](s)[\'ll be studying](v) [for my final exams](m). [They](s) [start](v) [on the 20th](m).',
      mn: 'Би төгсөлтийн шалгалтдаа бэлдэж байх болно. 20-нд эхэлнэ.',
      speaker: 'Saraa',
    },
    {
      en: '[And](m) [by the end of June](m)?',
      mn: 'Зургаадугаар сарын эцэс гэхэд яах вэ?',
      speaker: 'Bat',
    },
    {
      en: '[By then](m) [I](s)[\'ll have finished](v) [everything](o). [I](s)[\'ll have graduated](v)!',
      mn: 'Тэр үе гэхэд би бүгдийг дуусгачихсан байна. Төгсчихсөн байна!',
      speaker: 'Saraa',
    },
    {
      en: 'Great! [Will](v) [you](s) [be looking](v) [for a job](o) [in the summer](m)?',
      mn: 'Гоё юм! Чи зун ажил хайж байх уу?',
      speaker: 'Bat',
    },
    {
      en: 'Yes. [Hopefully](m), [by September](m) [I](s)[\'ll have found](v) [something good](o).',
      mn: 'Тийм. Есдүгээр сар гэхэд сайн ажил олчихсон байна гэж найдаж байна.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'b1-04-1',
      ruleId: 4,
      kind: 'fill',
      question: 'Don\'t phone me at 7. I ___ dinner with my parents.',
      options: ['will have', 'will be having', 'will have had', 'am having had'],
      answer: 'will be having',
      explanation: '7 цагт — ирээдүйн тодорхой мөчид үйлдэл явагдаж байх тул Future Continuous: will be having. have dinner нь үйлдэл тул -ing болно.',
      hint: 'Тэр мөчид хоолоо идэж байх болно.',
    },
    {
      id: 'b1-04-2',
      ruleId: 4,
      kind: 'fill',
      question: 'By the time you get home, I ___ the whole house.',
      options: ['will clean', 'will be cleaning', 'will have cleaned', 'clean'],
      answer: 'will have cleaned',
      explanation: 'By the time (гэхэд) — чамайг ирэх үед үйлдэл аль хэдийн дууссан байх. Future Perfect: will have cleaned.',
      hint: '«Ирэх үед чинь … цэвэрлэчихсэн байна».',
    },
    {
      id: 'b1-04-3',
      ruleId: 4,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'By 2030 they will build a new bridge.',
        'This time tomorrow we will sit on the plane.',
        'She will have finished the book by the time the class will start.',
        'Next year we will have been married for ten years.',
      ],
      answer: 'Next year we will have been married for ten years.',
      explanation: 'Хугацааны нийлбэр (арван жил болсон байна) — Future Perfect зөв. by 2030 бол will have built байх ёстой; this time tomorrow бол will be sitting; by the time-ийн ард will хэрэглэхгүй.',
      hint: '«Гэхэд»-тэй бол Future Perfect, цагийн холбоосын ард will байхгүй.',
    },
    {
      id: 'b1-04-4',
      ruleId: 4,
      kind: 'translate',
      question: 'Маргааш энэ цагт би шалгалт өгч байх болно.',
      options: [
        'This time tomorrow I will be taking an exam.',
        'This time tomorrow I will take an exam.',
        'This time tomorrow I will have taken an exam.',
        'This time tomorrow I take an exam.',
      ],
      answer: 'This time tomorrow I will be taking an exam.',
      explanation: '«Өгч байх болно» — тэр мөчид үйлдлийн дунд байна. Future Continuous. will have taken гэвэл «өгчихсөн байна» болж утга өөрчлөгдөнө.',
      hint: '«-ж байх болно» = will be + V-ing.',
    },
  ],
};
