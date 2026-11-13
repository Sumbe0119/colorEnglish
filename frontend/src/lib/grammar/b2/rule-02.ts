// frontend/src/lib/grammar/b2/rule-02.ts
// B2 дүрэм 2: Future Perfect Continuous & other future forms
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule02: GrammarRule = {
  id: 2,
  title: 'Future Perfect Continuous & other future forms',
  titleMn: 'Future Perfect Continuous ба ирээдүйн бусад хэлбэр — «тэр үед хэдий хугацаанд хийж байгаа болно»',
  hook: '«Ирэх сар гэхэд би энд арван жил ажиллаж байгаа болно», «Кино яг эхлэх гэж байна», «Би чам руу залгах гэж байсан юм» — ирээдүйг нарийн өнцгөөс харж сурцгаая.',
  summary: 'will have been + V-ing нь ирээдүйн нэг мөч хүртэл үйлдэл хэдий хугацаанд үргэлжилсэн байхыг заана (By June I will have been working here for ten years). be about to = яг одоо болох гэж байна, be due to = хуваарийн дагуу болох ёстой, be to = албан ёсны төлөвлөгөө, заавар. was going to / was about to / would нь «өнгөрсөн дэх ирээдүй» — тэр үед ирээдүй гэж харж байсан зүйл.',
  description: 'B1-ийн 4-р дүрэмд бид Future Continuous (This time tomorrow I will be flying — тэр мөчид үргэлжилж байх) ба Future Perfect (By Friday I will have finished — тэр мөчөөс өмнө дууссан байх)-ийг үзсэн. B2-т гурав дахь хэлбэр нэмэгдэнэ: Future Perfect Continuous. Энэ нь ирээдүйн нэг мөч дээр зогсоод «тэр үед энэ үйлдэл хэдий хугацаанд үргэлжилсэн байх вэ» гэж эргэж харна: By next year, she will have been teaching for twenty years. Бүтэц нь B1-ийн 1-р дүрмийн Present Perfect Continuous (have been + V-ing) болон B2-ийн 1-р дүрмийн Past Perfect Continuous (had been + V-ing)-тай нэг гэр бүл — зөвхөн харах цэг нь ирээдүй рүү шилжсэн. Мөн энэ бүлэгт will, be going to-гоос гадна ирээдүйг илэрхийлдэг гурван хэллэг орно: be about to (тун удахгүй, яг одоо), be due to (цагийн хуваарь, тооцоолсон хугацаа), be to (албан ёсны мэдэгдэл, тушаал). Эцэст нь «өнгөрсөн дэх ирээдүй» (future in the past): түүх ярьж байхдаа тэр үед төлөвлөж, таамаглаж байсан зүйлээ was going to, was about to, would-оор хэлнэ — ихэнхдээ тэр төлөвлөгөө биелээгүй байдаг. Монгол хэлэнд ирээдүйн ийм олон хэлбэр байхгүй, «-х гэж байна», «-х ёстой», «-х гэж байсан» гэх мэт хэллэгээр илэрхийлдэг тул англи хэлбэр бүрийн өнгө аясыг ялгаж сурах нь чухал.',
  structure: 'will have been + V-ing (+ for …) · be about to / be due to / be to + V1 · was going to / was about to / would + V1',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'will have been', part: 'verb' },
    { text: 'V-ing', part: 'verb' },
    { text: 'by … / for …', part: 'modifier' },
  ],
  tip: 'will have been + V-ing = тэр үе гэхэд хэр удаан · be about to = яг одоо болох гэж байна · be due to = хуваарь ёсоор · be to = албан ёсоор · was going to / was about to = тэгэх гэж байсан (ихэвчлэн болоогүй) · would = өнгөрсөн дэх will.',
  examples: [
    { en: '[By June](m), [I](s) [will have been working](v) [here](m) [for ten years](m).', mn: 'Зургаадугаар сар гэхэд би энд арван жил ажиллаж байгаа болно.' },
    { en: '[Hurry up](v)! [The film](s) [is about to start](v).', mn: 'Хурдал! Кино яг эхлэх гэж байна.' },
    { en: '[The train](s) [is due to arrive](v) [at 9.15](m).', mn: 'Галт тэрэг 9.15-д ирэх ёстой. (хуваарь ёсоор)' },
    { en: '[I](s) [was going to call](v) [you](o), [but](m) [I](s) [forgot](v).', mn: 'Би чам руу залгах гэж байсан ч мартчихсан.' },
  ],
  useCases: [
    {
      title: 'Future Perfect Continuous — ирээдүйн мөч хүртэл үргэлжлэх хугацаа',
      description: 'Ирээдүйн тодорхой мөч дээр зогсоод үйлдэл хэдий хугацаанд үргэлжилсэн байхыг хэлнэ. Бараг үргэлж by … (ямар мөч гэхэд) ба for … (хэр удаан) хоёр хамт орно. Үйлдэл тэр мөчид үргэлжилсээр байж болно.',
      examples: [
        { en: '[By next year](m), [she](s) [will have been teaching](v) [for twenty years](m).', mn: 'Ирэх жил гэхэд тэр хорин жил багшилж байгаа болно.' },
        { en: '[By six o\'clock](m), [we](s) [will have been waiting](v) [for three hours](m).', mn: 'Зургаан цаг гэхэд бид гурван цаг хүлээсэн болно.' },
        { en: '[In May](m), [they](s) [will have been living](v) [in this flat](m) [for a decade](m).', mn: 'Тавдугаар сард тэд энэ байранд арван жил амьдарч байгаа болно.' },
      ],
    },
    {
      title: 'Future Perfect ба Future Perfect Continuous — үр дүн үү, үргэлжлэл үү',
      description: 'will have + V3 нь тэр үе гэхэд дууссан үр дүн, тоо хэмжээг онцолно (хэдийг, хэдэн удаа). will have been + V-ing нь үйл явцын үргэлжлэлийг онцолно (хэр удаан). Төлөвийн үйл үгтэй (know, be, have) зөвхөн will have + V3.',
      examples: [
        { en: '[By tonight](m), [I](s) [will have written](v) [ten pages](o).', mn: 'Өнөө орой гэхэд би арван хуудас бичээд дуусгасан байна. (үр дүн, тоо)' },
        { en: '[By tonight](m), [I](s) [will have been writing](v) [for eight hours](m).', mn: 'Өнөө орой гэхэд би найман цаг бичиж байгаа болно. (үргэлжлэл)' },
        { en: '[Next month](m) [we](s) [will have known](v) [each other](o) [for five years](m).', mn: 'Ирэх сард бид бие биеэ таниад таван жил болно. (know — continuous болохгүй)' },
      ],
    },
    {
      title: 'be about to — яг одоо болох гэж байгаа зүйл',
      description: 'Хэдхэн секунд, минутын дараа болох гэж буй үйлдэл. be going to-гоос ч илүү ойрхон. just нэмж улам онцолж болно. Цаг заасан үгтэй (tomorrow, at five) хамт хэрэглэхгүй.',
      examples: [
        { en: '[Be](v) [quiet](o)! [The president](s) [is about to speak](v).', mn: 'Чимээгүй! Ерөнхийлөгч яг үг хэлэх гэж байна.' },
        { en: '[I](s)[\'m just about to leave](v). [Can](v) [I](s) [call](v) [you](o) [back](m)?', mn: 'Би яг гарах гэж байна. Эргээд залгаж болох уу?' },
        { en: '[The shop](s) [is about to close](v), [so](m) [we](s) [should hurry](v).', mn: 'Дэлгүүр хаах гэж байгаа тул бид яарах хэрэгтэй.' },
      ],
    },
    {
      title: 'be due to ба be to — хуваарь, албан ёсны төлөвлөгөө',
      description: 'be due to + V1: цагийн хуваарь, гэрээ, тооцооны дагуу тодорхой цагт болох ёстой зүйл. be to + V1: албан ёсны мэдэгдэл, мэдээний хэллэг, эсвэл дээрээс өгсөн заавар, тушаал. Хоёулаа албан өнгө аястай.',
      examples: [
        { en: '[The plane](s) [is due to land](v) [at midnight](m).', mn: 'Онгоц шөнө дунд газардах ёстой. (хуваарь ёсоор)' },
        { en: '[The Prime Minister](s) [is to visit](v) [Japan](o) [next week](m).', mn: 'Ерөнхий сайд ирэх долоо хоногт Японд айлчилна. (албан ёсны мэдээ)' },
        { en: '[You](s) [are to wait](v) [here](m) [until](m) [I](s) [return](v).', mn: 'Та намайг буцаж иртэл энд хүлээх ёстой. (заавар)' },
      ],
    },
    {
      title: 'Future in the past — өнгөрсөн дэх ирээдүй',
      description: 'Өнгөрсөн нэг мөчөөс харахад ирээдүй байсан зүйл. was / were going to — төлөвлөж байсан (ихэвчлэн биелээгүй); was / were about to — яг хийх гэж байтал; would — will-ийн өнгөрсөн хэлбэр (таамаг, амлалт, хожим болсон зүйл).',
      examples: [
        { en: '[We](s) [were going to travel](v) [abroad](m), [but](m) [we](s) [changed](v) [our plans](o).', mn: 'Бид гадаад явах гэж байсан ч төлөвлөгөөгөө өөрчилсөн.' },
        { en: '[I](s) [was about to go out](v) [when](m) [the phone](s) [rang](v).', mn: 'Намайг яг гарах гэж байтал утас дуугарав.' },
        { en: '[She](s) [knew](v) [that](m) [he](s) [would be](v) [late](o) [again](m).', mn: 'Тэр түүнийг дахиад хоцорно гэдгийг мэдэж байв.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Future Perfect Continuous — эерэг, үгүйсгэл, асуулт',
      structure: 'will have been + V-ing · won\'t have been + V-ing · Will + subject + have been + V-ing? · How long will … have been + V-ing?',
      examples: [
        { en: '[At ten](m), [he](s) [will have been driving](v) [for twelve hours](m).', mn: 'Арван цагт тэр арван хоёр цаг жолоо барьсан байх болно.' },
        { en: '[I](s) [won\'t have been working](v) [here](m) [long enough](m) [to get a bonus](m).', mn: 'Би урамшуулал авах хэмжээний удаан хугацаанд энд ажиллаагүй байх болно.' },
        { en: '[How long](m) [will](v) [you](s) [have been studying](v) [English](o) [by the end of this course](m)?', mn: 'Энэ курс дуусах үед чи англи хэлийг хэр удаан сурч байгаа болох вэ?' },
      ],
    },
    {
      label: 'be about to',
      structure: 'am / is / are (just) about to + V1 · be not about to + V1',
      examples: [
        { en: '[The match](s) [is about to begin](v).', mn: 'Тэмцээн яг эхлэх гэж байна.' },
        { en: '[We](s)[\'re just about to have](v) [dinner](o). [Would](v) [you](s) [like to join](v) [us](o)?', mn: 'Бид яг оройн хоолоо идэх гэж байна. Бидэнтэй нэгдэх үү?' },
        { en: '[Are](v) [you](s) [about to go](v) [out](m)?', mn: 'Чи гарах гэж байна уу?' },
      ],
    },
    {
      label: 'be due to / be to',
      structure: 'am / is / are due to + V1 (+ цаг) · am / is / are to + V1',
      examples: [
        { en: '[The new bridge](s) [is due to open](v) [in September](m).', mn: 'Шинэ гүүр есдүгээр сард нээгдэх ёстой.' },
        { en: '[Her baby](s) [is due to be born](v) [in March](m).', mn: 'Түүний хүүхэд гуравдугаар сард төрөх ёстой.' },
        { en: '[All students](s) [are to hand in](v) [their essays](o) [by Friday](m).', mn: 'Бүх оюутан баасан гараг гэхэд эссэгээ хураалгах ёстой.' },
      ],
    },
    {
      label: 'Future in the past',
      structure: 'was / were going to + V1 · was / were about to + V1 · would + V1',
      examples: [
        { en: '[I](s) [was going to tell](v) [you](o), [but](m) [you](s) [had already left](v).', mn: 'Би чамд хэлэх гэж байсан ч чи аль хэдийн явчихсан байсан.' },
        { en: '[They](s) [were about to give up](v) [when](m) [help](s) [arrived](v).', mn: 'Тэднийг яг бууж өгөх гэж байтал тусламж ирэв.' },
        { en: '[In 2010](m) [he](s) [met](v) [the woman](o) [who](s) [would become](v) [his wife](o).', mn: '2010 онд тэр хожим эхнэр нь болох эмэгтэйтэй танилцсан.' },
      ],
    },
  ],
  signalWords: ['by', 'by the time', 'for', 'by next year', 'by the end of', 'about to', 'just about to', 'due to', 'is to', 'was going to', 'was about to'],
  notes: [
    'Төлөвийн үйл үгс continuous хэлбэрт ордоггүй тул Future Perfect Simple хэрэглэнэ: By May I will have been knowing her (буруу) → I will have known her for a year (зөв).',
    'by the time, when, before-ийн ард ирээдүйн утгатай ч will хэрэглэхгүй, Present Simple тавина: By the time you arrive, we will have been waiting for hours (you will arrive гэхгүй).',
    'be about to нь аль хэдийн «яг одоо» гэсэн утгатай тул tomorrow, next week, at six гэх мэт цагийн үгтэй хамт хэрэглэхгүй. Цаг заах бол be going to эсвэл Present Continuous сонго.',
    'be to нь мэдээний гарчигт be-гүйгээр богиносдог: President to visit China. Мөн эцэг эх, дарга нарын хатуу зааварт: You are not to touch anything.',
    'was going to нь ихэвчлэн «төлөвлөсөн ч болоогүй» гэсэн утга дагуулна, араас нь but … гэж шалтгаанаа хэлдэг. would нь B1-ийн 8-р дүрмийн reported speech-ийн will → would-тай ижил логик: He said he would come.',
    'due to нь нэр үгийн өмнө «-ээс болж» гэсэн огт өөр утгатай угтвар үг болдог: The flight was cancelled due to fog. be due to + V1 (хуваарь) гэдэгтэй бүү хольж хутгаарай.',
  ],
  commonMistakes: [
    {
      wrong: 'By next year, I will be working here for five years.',
      correct: 'By next year, I will have been working here for five years.',
      explanation: 'by … + for … хоёр хамт байвал тэр мөч хүртэлх үргэлжлэл — will have been + V-ing. will be working нь зөвхөн тэр мөчид үргэлжилж байхыг хэлдэг, хугацаа тоолохгүй.',
    },
    {
      wrong: 'By the time you will arrive, we will have been waiting for hours.',
      correct: 'By the time you arrive, we will have been waiting for hours.',
      explanation: 'by the time-ийн ард ирээдүйн утгатай ч Present Simple хэрэглэнэ. will зөвхөн гол өгүүлбэрт орно.',
    },
    {
      wrong: 'I am about to leave tomorrow morning.',
      correct: 'I am leaving tomorrow morning.',
      explanation: 'be about to нь «яг одоо, хэдхэн хормын дараа» гэсэн утгатай тул tomorrow morning гэх мэт цагийн үгтэй таарахгүй. Товлосон ирээдүйд Present Continuous эсвэл be going to хэрэглэнэ.',
    },
    {
      wrong: 'I thought it will rain, so I took an umbrella.',
      correct: 'I thought it would rain, so I took an umbrella.',
      explanation: 'Өнгөрсөн мөчөөс (I thought) харсан ирээдүй — future in the past. will нь would болж ухарна.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «ирэх жил гэхэд би энд арван жил ажиллаж байгаа болно / ажилласан болно» гэж «болно» туслах үйл үгээр ирээдүйн цэгийг заадаг. Англиар «гэхэд» = by, «арван жил» = for ten years, үйл үг нь will have been + V-ing болно.',
      'Монголоор «-х гэж байна» (эхлэх гэж байна, гарах гэж байна) нь be about to-той бараг яг таардаг. Харин «-х гэж байсан» (залгах гэж байсан) нь was going to / was about to буюу өнгөрсөн дэх ирээдүй.',
      'Монголоор хуваарьт үйл явдлыг «галт тэрэг есөд ирэх ёстой» гэж «ёстой»-гоор хэлдэг. Англиар энэ нь must биш (must бол үүрэг), харин is due to arrive. «Ёстой» бүрийг must гэж орчуулах хэрэггүй.',
      'Монголоор «тэр хоцорно гэдгийг би мэдэж байсан» гэхэд «хоцорно» ирээдүй цагаараа үлддэг. Англиар гол үйл үг өнгөрсөн бол (I knew) will нь would болж ухардаг: I knew he would be late.',
    ],
  },
  dialogue: [
    {
      en: 'Bat, [hurry up](v)! [The ceremony](s) [is about to begin](v).',
      mn: 'Бат, хурдал! Ёслол яг эхлэх гэж байна.',
      speaker: 'Tuya',
    },
    {
      en: 'Sorry! [I](s) [was going to leave](v) [earlier](m), [but](m) [my boss](s) [stopped](v) [me](o).',
      mn: 'Уучлаарай! Би эрт гарах гэж байсан ч дарга маань намайг саатуулчихсан.',
      speaker: 'Bat',
    },
    {
      en: '[Our teacher](s) [is due to give](v) [her speech](o) [at six](m).',
      mn: 'Манай багш зургаан цагт үг хэлэх ёстой.',
      speaker: 'Tuya',
    },
    {
      en: '[By the end of this month](m), [she](s) [will have been teaching](v) [for forty years](m). Amazing!',
      mn: 'Энэ сарын эцэс гэхэд тэр дөчин жил багшилсан болно. Гайхалтай!',
      speaker: 'Bat',
    },
    {
      en: 'I know. [The school](s) [is to name](v) [a classroom](o) [after her](m).',
      mn: 'Тийм ээ. Сургууль нэг ангийг түүний нэрээр нэрлэх гэж байгаа.',
      speaker: 'Tuya',
    },
    {
      en: '[I](s) [knew](v) [they](s) [would do](v) [something special](o).',
      mn: 'Тэд ямар нэг онцгой зүйл хийнэ гэдгийг би мэдэж байсан юм.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'b2-02-1',
      ruleId: 2,
      kind: 'fill',
      question: 'By next June, I ___ here for ten years.',
      options: ['will be working', 'am working', 'will have been working', 'have been working'],
      answer: 'will have been working',
      explanation: 'By next June (ирээдүйн мөч) + for ten years (үргэлжилсэн хугацаа) — Future Perfect Continuous: will have been working. will be working хугацаа тоолохгүй, have been working нь одоо хүртэл гэсэн утгатай.',
      hint: 'by … + for … = тэр үе гэхэд хэр удаан.',
    },
    {
      id: 'b2-02-2',
      ruleId: 2,
      kind: 'fill',
      question: 'I ___ call you last night, but my battery died.',
      options: ['am going to', 'was going to', 'will', 'will have'],
      answer: 'was going to',
      explanation: 'last night — өнгөрсөнд төлөвлөсөн ч биелээгүй зүйл (but my battery died). Өнгөрсөн дэх ирээдүй: was going to + V1. Бусад нь одоо / ирээдүйн хэлбэр тул last night-тай таарахгүй.',
      hint: 'Тэгэх гэж байсан ч болоогүй.',
    },
    {
      id: 'b2-02-3',
      ruleId: 2,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'I was about calling you when you rang.',
        'By 2030, she will has been teaching for twenty years.',
        'We were going to visiting them, but the car broke down.',
        'The plane is due to land at 6.45.',
      ],
      answer: 'The plane is due to land at 6.45.',
      explanation: 'be due to + V1 — хуваарьт үйл явдал, зөв. Бусад нь: was about to call (to + V1); will have been (will-ийн ард has биш have); were going to visit (to + V1, -ing биш).',
      hint: 'about to / due to / going to — бүгд + V1.',
    },
    {
      id: 'b2-02-4',
      ruleId: 2,
      kind: 'translate',
      question: 'Ирэх сар гэхэд бид энэ байранд таван жил амьдарч байгаа болно.',
      options: [
        'By next month, we will be living in this flat for five years.',
        'By next month, we will have been living in this flat for five years.',
        'By next month, we have been living in this flat for five years.',
        'By next month, we will have been lived in this flat for five years.',
      ],
      answer: 'By next month, we will have been living in this flat for five years.',
      explanation: '«Ирэх сар гэхэд» = by next month, «таван жил» = for five years — ирээдүйн мөч хүртэлх үргэлжлэл: will have been living. will be living хугацаатай таарахгүй, have been living одоо хүртэл, will have been lived хэлбэр буруу (V-ing байх ёстой).',
      hint: 'will have been + V-ing.',
    },
  ],
};
