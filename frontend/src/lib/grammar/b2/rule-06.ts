// frontend/src/lib/grammar/b2/rule-06.ts
// B2 дүрэм 6: Passive reporting — It is said that… / He is said to…
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule06: GrammarRule = {
  id: 6,
  title: 'Passive reporting: It is said that… / He is said to…',
  titleMn: 'Passive reporting — «…гэж ярьдаг», «…гэж үздэг», «…гэнэ»',
  hook: '«Тэр их баян гэнэ», «Гал гал тогооноос гарсан гэж үзэж байна», «Ерөнхийлөгч маргааш ирэх төлөвтэй» — мэдээ, албан бичигт хэн хэлснийг нэрлэхгүйгээр бусдын үг, таамгийг дамжуулж сурцгаая.',
  summary: 'Хүмүүсийн ярьдаг, итгэдэг, таамагладаг зүйлийг хэн хэлснийг нэрлэхгүйгээр дамжуулах хоёр бүтэц бий: (1) It + is said / believed / thought / reported + that + өгүүлбэр, (2) Subject + is said + to-infinitive. Infinitive нь цагийг заана: to do (одоо / ерөнхий), to be doing (яг одоо үргэлжилж буй), to have done (өмнө нь болсон). be supposed to нь «…гэж ярьдаг» болон «…ёстой байсан» гэсэн хоёр утгатай.',
  description: 'B1-ийн 7-р дүрэмд бид passive voice-ийг (be + V3) үзээд, үйлдэгч нь тодорхойгүй эсвэл чухал биш үед хэрэглэдэг гэж сурсан. B1-ийн 8-р дүрэмд reported speech-ээр «He said that …» гэж тодорхой хүний үгийг дамжуулсан. Одоо энэ хоёрыг нийлүүлнэ: хэн хэлсэн нь тодорхойгүй, эсвэл «хүмүүс», «мэргэжилтнүүд», «цагдаа» гэх мэт ерөнхий эх сурвалжтай мэдээллийг People say that he is rich гэхийн оронд passive-аар дамжуулна. Эхний арга нь хоосон эзэн it-ээр эхэлнэ: It is said that he is rich. Хоёр дахь арга нь that-өгүүлбэрийн эзнийг гол өгүүлбэрийн эзэн болгож, үйл үгийг нь to-infinitive болгоно: He is said to be rich. Хоёр дахь бүтцэд infinitive-ийн хэлбэр цагийн харьцааг заадаг тул анхаарах хэрэгтэй: одоо үнэн бол to be / to live, яг одоо үргэлжилж байгаа бол to be living, ярьж буй мөчөөс өмнө болсон бол to have left (B1-ийн 10-р дүрэмд үзсэн must have + V3-ийн have + V3 шиг «өмнөх цаг»-ийг заана). Энэ бүтэц мэдээ, тайлан, эрдэм шинжилгээний бичвэрт маш түгээмэл, учир нь бичигч мэдээллийг өөрийн нэрийн өмнөөс батлахгүй, зөвхөн «тэгж ярьж байна» гэж зай барьж дамжуулдаг. Монголоор энэ утгыг өгүүлбэрийн ТӨГСГӨЛД «гэнэ», «гэж ярьдаг», «гэж үздэг», «гэсэн мэдээ байна» гэж хэлдэг бол англиар өгүүлбэрийн ЭХЭНД It is said that … эсвэл эзний яг ард is said to … гэж тавьдаг. Мөн be supposed to гэсэн ойр хэллэгийг энд хамт үзнэ.',
  structure: 'It + is said / believed / thought / reported + that + clause · Subject + is said / believed + to V1 / to be V-ing / to have V3 · Subject + be supposed to + V1',
  structureParts: [
    { text: 'It / Subject', part: 'subject' },
    { text: 'is said / is believed', part: 'verb' },
    { text: 'that + clause / to + infinitive', part: 'object' },
    { text: '· be supposed to + V1', part: 'modifier' },
  ],
  tip: 'It is said that + бүтэн өгүүлбэр · He is said + to V1 (одоо) / to be V-ing (яг одоо) / to have V3 (өмнө нь). that ба to хоёрыг холихгүй: It … that, Subject … to.',
  examples: [
    { en: '[It](s) [is said](v) [that he is very rich](o).', mn: 'Түүнийг их баян гэж ярьдаг.' },
    { en: '[He](s) [is said](v) [to be very rich](o).', mn: 'Тэр их баян гэнэ. (дээрхтэй ижил утга)' },
    { en: '[The fire](s) [is believed](v) [to have started in the kitchen](o).', mn: 'Гал гал тогооноос гарсан гэж үзэж байна.' },
    { en: '[This film](s) [is supposed](v) [to be really good](o).', mn: 'Энэ киног үнэхээр сайн гэж ярьдаг.' },
  ],
  useCases: [
    {
      title: 'It is said that … — хоосон эзэн it + that-өгүүлбэр',
      description: 'Хамгийн энгийн хэлбэр. People say that …-ийг passive болгоход it эзэн болж, that-ийн ард бүтэн өгүүлбэр (эзэн + үйл үг) хэвээрээ орно. say-ээс гадна believe, think, know, report, expect, estimate, understand, claim зэрэг үйл үгтэй хэрэглэнэ.',
      examples: [
        { en: '[It](s) [is said](v) [that this lake never freezes](o).', mn: 'Энэ нуур хэзээ ч хөлддөггүй гэж ярьдаг.' },
        { en: '[It](s) [is believed](v) [that the painting is over 300 years old](o).', mn: 'Энэ зургийг 300 гаруй жилийн настай гэж үздэг.' },
        { en: '[It](s) [has been reported](v) [that two people were injured](o).', mn: 'Хоёр хүн бэртсэн гэж мэдээлсэн байна.' },
      ],
    },
    {
      title: 'Subject + is said to + V1 — одоогийн ба ерөнхий үнэн',
      description: 'Ярьж буй хүн, зүйлээ өгүүлбэрийн эхэнд гаргаж онцолно. that-өгүүлбэрийн эзэн гол эзэн болж, үйл үг нь to + V1 болно. Мэдээлэл одоо ч үнэн, эсвэл ерөнхий баримт үед энгийн infinitive хэрэглэнэ. expect-тэй бол ирээдүйг заана.',
      examples: [
        { en: '[She](s) [is said](v) [to speak six languages](o).', mn: 'Тэр зургаан хэлээр ярьдаг гэнэ.' },
        { en: '[The company](s) [is thought](v) [to employ over 2,000 people](o).', mn: 'Тэр компани 2000 гаруй хүн ажиллуулдаг гэж үздэг.' },
        { en: '[The president](s) [is expected](v) [to arrive tomorrow](o).', mn: 'Ерөнхийлөгч маргааш ирэх төлөвтэй байна.' },
      ],
    },
    {
      title: 'is said to be doing — яг одоо үргэлжилж буй үйлдэл',
      description: 'Мэдээлж буй үйлдэл яг одоо, энэ үед үргэлжилж байгаа бол continuous infinitive: to be + V-ing. It is said that he is living … гэсэн Present Continuous-тай өгүүлбэртэй тэнцэнэ.',
      examples: [
        { en: '[He](s) [is said](v) [to be living in Spain](o) [now](m).', mn: 'Тэр одоо Испанид амьдарч байгаа гэнэ.' },
        { en: '[The police](s) [are reported](v) [to be looking for two men](o).', mn: 'Цагдаа хоёр эрэгтэйг эрж байгаа гэж мэдээлж байна.' },
        { en: '[The band](s) [is rumoured](v) [to be working on a new album](o).', mn: 'Тэр хамтлаг шинэ цомог дээр ажиллаж байгаа гэсэн цуу яриа байна.' },
      ],
    },
    {
      title: 'is said to have done — өмнө нь болсон үйлдэл',
      description: 'Мэдээлж буй үйлдэл ярьж буй мөчөөс ӨМНӨ болсон бол perfect infinitive: to have + V3. It is said that he left … / has left … гэсэн өнгөрсөн цагтай өгүүлбэртэй тэнцэнэ. Passive бол to have been + V3.',
      examples: [
        { en: '[The thieves](s) [are believed](v) [to have left the country](o).', mn: 'Хулгайч нар улсаас гарсан гэж үзэж байна.' },
        { en: '[He](s) [is known](v) [to have worked for the government](o).', mn: 'Тэр засгийн газарт ажиллаж байсан нь мэдэгдэж байгаа.' },
        { en: '[The painting](s) [is thought](v) [to have been stolen](o) [in the 1990s](m).', mn: 'Тэр зургийг 1990-ээд онд хулгайлагдсан гэж үздэг.' },
      ],
    },
    {
      title: 'be supposed to — «гэж ярьдаг» ба «ёстой»',
      description: 'be supposed to хоёр утгатай. (1) is said to-той адил «…гэж ярьдаг, тийм гэсэн» — ярианд илүү түгээмэл. (2) «тэгэх ёстой, тэгэхээр төлөвлөсөн» — дүрэм, тохиролцоо, хүлээлт; ихэвчлэн бодит байдал өөр байгааг сануулна. Утгыг нь нөхцөл байдлаас ялгана.',
      examples: [
        { en: '[That restaurant](s) [is supposed](v) [to be excellent](o).', mn: 'Тэр рестораныг гайхалтай гэж ярьдаг.' },
        { en: '[You](s)[\'re supposed](v) [to wear a helmet](o) [here](m).', mn: 'Энд дуулга өмсөх ёстой. (дүрэм)' },
        { en: '[The train](s) [was supposed](v) [to leave at six](o), [but](m) [it](s) [was cancelled](v).', mn: 'Галт тэрэг зургаан цагт хөдлөх ёстой байсан ч цуцлагдсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'It + passive + that',
      structure: 'It + is / was / has been + said / believed / thought / reported + that + subject + verb',
      examples: [
        { en: '[It](s) [is thought](v) [that the virus spreads through water](o).', mn: 'Тэр вирус усаар дамждаг гэж үздэг.' },
        { en: '[It](s) [is estimated](v) [that the project will cost two million pounds](o).', mn: 'Төсөл хоёр сая фунтийн өртөгтэй болно гэж тооцоолж байна.' },
        { en: '[It](s) [was once believed](v) [that the Earth was flat](o).', mn: 'Нэгэн цагт дэлхийг хавтгай гэж итгэдэг байсан.' },
      ],
    },
    {
      label: 'Subject + passive + to V1 / to be V-ing',
      structure: 'Subject + is / are + said / believed / thought / known + to + V1 · to be + V-ing',
      examples: [
        { en: '[Mongolians](s) [are known](v) [to be very hospitable](o).', mn: 'Монголчуудыг маш зочломтгой гэж мэддэг.' },
        { en: '[The minister](s) [is believed](v) [to be considering a new law](o).', mn: 'Сайд шинэ хууль хэлэлцэж байгаа гэж үзэж байна.' },
        { en: '[Prices](s) [are expected](v) [to rise](o) [next year](m).', mn: 'Үнэ ирэх жил өсөх төлөвтэй байна.' },
      ],
    },
    {
      label: 'Subject + passive + to have V3',
      structure: 'Subject + is / are + said / believed / reported + to have + V3 · to have been + V3',
      examples: [
        { en: '[The driver](s) [is said](v) [to have fallen asleep](o).', mn: 'Жолооч унтчихсан байсан гэнэ.' },
        { en: '[Three climbers](s) [are reported](v) [to have reached the summit](o).', mn: 'Гурван уулчин оргилд хүрсэн гэж мэдээлж байна.' },
        { en: '[The bridge](s) [is believed](v) [to have been built](o) [by the Romans](m).', mn: 'Тэр гүүрийг Ромчууд барьсан гэж үздэг.' },
      ],
    },
    {
      label: 'be supposed to ба өнгөрсөн мэдээлэл',
      structure: 'Subject + am / is / are / was / were supposed to + V1 · Subject + was said / was believed + to + V1',
      examples: [
        { en: '[This tea](s) [is supposed](v) [to help you sleep](o).', mn: 'Энэ цай унтахад тусалдаг гэж ярьдаг.' },
        { en: '[I](s) [was supposed](v) [to call her](o) [yesterday](m), [but](m) [I](s) [forgot](v).', mn: 'Би өчигдөр түүн рүү залгах ёстой байсан ч мартчихсан.' },
        { en: '[The old king](s) [was said](v) [to own a thousand horses](o).', mn: 'Хөгшин хааныг мянган адуутай гэж ярьдаг байжээ.' },
      ],
    },
  ],
  signalWords: ['It is said that', 'is said to', 'is believed to', 'is thought to', 'is reported to', 'is known to', 'is expected to', 'to have + V3', 'be supposed to'],
  notes: [
    'Хоёр бүтцийг холихгүй. It-ээр эхэлбэл that + бүтэн өгүүлбэр; жинхэнэ эзнээр эхэлбэл to-infinitive. He is said that he is rich (буруу), It is said him to be rich (буруу).',
    'Infinitive-ийн сонголт цагийг заана: is said to live (одоо амьдардаг), is said to be living (яг одоо амьдарч байгаа), is said to have lived (өмнө нь амьдарч байсан). Үйлдэл өнгөрсөнд болсон бол to have + V3-ийг мартаж болохгүй.',
    'Мэдээлэх үйл үг өөрөө өнгөрсөн байж болно: It was believed that … / He was said to be … — тэр үед тэгж ярьдаг, итгэдэг байсан гэсэн утга.',
    'expect-тэй бол infinitive ирээдүйг заана: The match is expected to start at eight. Харин say, believe, think-тэй ирээдүйг ихэвчлэн It is said that he will … гэж that-тэй хэлнэ.',
    'Энэ бүтэц албан, мэдээний хэв маяг. Өдөр тутмын ярианд They say …, People say …, Apparently …, I\'ve heard that …, эсвэл be supposed to илүү байгалийн сонсогдоно.',
    'be supposed to-г suppose (таамаглах) үйл үгтэй бүү хольж бай. I suppose he is right = тэр зөв байх гэж бодож байна. He is supposed to be right = түүнийг зөв гэж ярьдаг / тэр зөв байх ёстой.',
  ],
  commonMistakes: [
    {
      wrong: 'He is said that he is a millionaire.',
      correct: 'He is said to be a millionaire. / It is said that he is a millionaire.',
      explanation: 'Жинхэнэ эзнээр (He) эхэлсэн бол to-infinitive, it-ээр эхэлсэн бол that-өгүүлбэр. Монголоор «түүнийг … гэж ярьдаг» гэсэн нэг л хэлбэр байдаг тул хоёр бүтцийг холих алдаа гардаг.',
    },
    {
      wrong: 'The robbers are believed to escape last night.',
      correct: 'The robbers are believed to have escaped last night.',
      explanation: 'Зугтсан нь өмнө нь (last night) болсон үйлдэл тул perfect infinitive: to have + V3. to escape гэвэл одоо эсвэл ерөнхий утгатай болно.',
    },
    {
      wrong: 'It is said the minister to resign soon.',
      correct: 'It is said that the minister will resign soon. / The minister is expected to resign soon.',
      explanation: 'It is said-ийн ард that + бүтэн өгүүлбэр (эзэн + цагтай үйл үг) орно, эзэн + to-infinitive биш.',
    },
    {
      wrong: 'She said to be the best doctor in the city.',
      correct: 'She is said to be the best doctor in the city.',
      explanation: 'Passive тул be үйл үг заавал хэрэгтэй: is said. She said гэвэл «тэр өөрөө хэлсэн» гэсэн active утга болж, өгүүлбэр буруу болно.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор бусдаас сонссон мэдээллийг өгүүлбэрийн төгсгөлд «гэнэ», «гэсэн», «гэж ярьдаг» гэж тэмдэглэдэг: «Тэр их баян гэнэ». Англиар энэ тэмдэглэгээ өгүүлбэрийн эхэнд эсвэл эзний яг ард орно: It is said that he is rich / He is said to be rich.',
      'Монголоор «гэж үздэг», «гэж тооцдог», «гэж мэдээлсэн», «төлөвтэй байна» гэж өөр өөр үгээр ялгадаг шиг англиар үйл үгээ солино: is believed / is thought (гэж үздэг), is estimated (гэж тооцоолдог), is reported (гэж мэдээлсэн), is expected (төлөвтэй).',
      'Монголоор цагийг гишүүн өгүүлбэрийн үйл үг өөрөө заадаг: «амьдардаг гэнэ», «амьдарч байгаа гэнэ», «амьдарч байсан гэнэ». Англиар He is said to …-ийн ард цагтай үйл үг орж болохгүй тул infinitive-ийн гурван хэлбэрээр ялгана: to live, to be living, to have lived.',
      'Монголоор «ёстой байсан» (ирэх ёстой байсан) ба «гэж ярьдаг» хоёр огт өөр үг. Англиар хоёуланг нь be supposed to илэрхийлж чаддаг тул нөхцөл байдлаас утгыг нь ялгана: You were supposed to come (ирэх ёстой байсан) — The film is supposed to be good (сайн гэж ярьдаг).',
    ],
  },
  dialogue: [
    {
      en: 'Nomin, [have](v) [you](s) [heard](v) [about the old cinema](m)? [It](s) [is said](v) [that a foreign company has bought it](o).',
      mn: 'Номин, хуучин кино театрын тухай сонссон уу? Гадаадын нэг компани худалдаж авсан гэж ярьж байна.',
      speaker: 'Bat',
    },
    {
      en: 'Yes, [I](s) [read](v) [about it](m). [The new owner](s) [is believed](v) [to be planning a shopping centre](o).',
      mn: 'Тийм, би энэ тухай уншсан. Шинэ эзэн нь худалдааны төв барихаар төлөвлөж байгаа гэж үзэж байна.',
      speaker: 'Nomin',
    },
    {
      en: 'Really? [The building](s) [is thought](v) [to have been designed](o) [by a famous architect](m).',
      mn: 'Нээрээ юу? Тэр барилгыг алдартай архитектор зохион бүтээсэн гэж үздэг шүү дээ.',
      speaker: 'Bat',
    },
    {
      en: 'Exactly. [It](s)[\'s supposed](v) [to be protected](o), [so](m) [they](s) [can\'t just knock](v) [it](o) [down](m).',
      mn: 'Яг тийм. Хамгаалалтад байх ёстой болохоор зүгээр л нураачихаж болохгүй.',
      speaker: 'Nomin',
    },
    {
      en: '[The work](s) [is expected](v) [to start next month](o), though.',
      mn: 'Гэхдээ ажил ирэх сард эхлэх төлөвтэй байгаа.',
      speaker: 'Bat',
    },
    {
      en: '[It](s) [was reported](v) [that the city council would discuss it first](o). Let\'s wait and see.',
      mn: 'Хотын зөвлөл эхлээд хэлэлцэнэ гэж мэдээлсэн. Хүлээгээд үзье.',
      speaker: 'Nomin',
    },
  ],
  quiz: [
    {
      id: 'b2-06-1',
      ruleId: 6,
      kind: 'fill',
      question: 'The company ___ to be losing millions of pounds every month.',
      options: ['says', 'is said', 'is saying', 'said'],
      answer: 'is said',
      explanation: 'Компанийн тухай бусад хүн ярьж байна — passive reporting: Subject + is said + to-infinitive. says, is saying, said нь active тул ард нь to be losing орж чадахгүй.',
      hint: 'Компани өөрөө хэлээгүй, түүний тухай ярьдаг.',
    },
    {
      id: 'b2-06-2',
      ruleId: 6,
      kind: 'fill',
      question: 'The thieves are believed ___ the country last night.',
      options: ['to leave', 'to have left', 'leaving', 'that they left'],
      answer: 'to have left',
      explanation: 'last night — өмнө нь болсон үйлдэл тул perfect infinitive: to have + V3. to leave одоо / ерөнхий утгатай; жинхэнэ эзэнтэй (The thieves) бүтцэд that-өгүүлбэр орохгүй.',
      hint: 'Өмнө нь болсон үйлдэл = to have + V3.',
    },
    {
      id: 'b2-06-3',
      ruleId: 6,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'It is said that he to be very rich.',
        'He is said that he is very rich.',
        'He is said to be very rich.',
        'He said to be very rich.',
      ],
      answer: 'He is said to be very rich.',
      explanation: 'Жинхэнэ эзэн + is said + to-infinitive зөв. It is said that-ийн ард цагтай үйл үг (he is) хэрэгтэй; He is said-ийн ард that орохгүй; He said гэвэл be үйл үг дутуу, active болно.',
      hint: 'It … that + өгүүлбэр, Subject … to + V1.',
    },
    {
      id: 'b2-06-4',
      ruleId: 6,
      kind: 'translate',
      question: 'Тэр эмэгтэй гурван хэлээр ярьдаг гэнэ.',
      options: [
        'She is said to speak three languages.',
        'She is said speaking three languages.',
        'She is said to have spoken three languages.',
        'It is said her to speak three languages.',
      ],
      answer: 'She is said to speak three languages.',
      explanation: '«Ярьдаг гэнэ» — одоо ч үнэн, ерөнхий баримт тул is said + to V1. to have spoken гэвэл «өмнө нь ярьдаг байсан» болно; is said-ийн ард -ing орохгүй; It is said-ийн ард that + өгүүлбэр хэрэгтэй.',
      hint: '«гэнэ» + одоо цаг = is said to + V1.',
    },
  ],
};
