// frontend/src/lib/grammar/c1/rule-01.ts
// C1 дүрэм 1: Inversion after negative adverbials
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule01: GrammarRule = {
  id: 1,
  title: 'Inversion after negative adverbials',
  titleMn: 'Сөрөг үгийн дараах inversion — Never have I…, Not only did he…',
  hook: '«Би хэзээ ч ийм зүйл харж байгаагүй!» гэдгийг Never have I seen… гэж хэлбэл хамаагүй хүчтэй сонсогдоно. Сөрөг утгатай үгийг өгүүлбэрийн эхэнд гаргаж, асуултын дарааллаар онцолж сурцгаая.',
  summary: 'Never, Rarely, Seldom, Hardly, No sooner, Not only, Under no circumstances, Only then, Little зэрэг сөрөг буюу хязгаарласан утгатай үг хэллэг өгүүлбэрийн эхэнд орвол ард нь асуултын дараалал орно: туслах үйл үг + эзэн + үндсэн үйл үг (Never have I seen…). Туслах үйл үггүй бол do / does / did нэмнэ (Rarely does he complain). Утга өөрчлөгдөхгүй, зөвхөн онцлол, албан ёсны өнгө нэмэгдэнэ.',
  description: 'Өмнөх түвшнүүдэд бид эзэн ба туслах үйл үгийн байрыг зөвхөн асуултад сольдог гэж сурсан (Have you seen …?). C1 түвшинд энэ дараалал асуулт биш өгүүлбэрт ч гарна: сөрөг эсвэл хязгаарласан утгатай adverbial-ийг онцлохын тулд өгүүлбэрийн эхэнд гаргахад ард нь заавал inversion хийнэ. I have never seen such chaos → Never have I seen such chaos. Утга нь адил боловч хоёр дахь нь илүү хүчтэй, уран, албан ёсны сонсогдоно. Энэ бүтэц илтгэл, албан бичиг, сэтгүүл зүй, уран зохиол, шалгалтын эссэд (IELTS, CAE) түгээмэл; өдөр тутмын ярианд хэт олон хэрэглэвэл хиймэл санагдана. B2-ийн 1-р дүрэмд үзсэн narrative tenses энд хэрэг болно: Hardly / Scarcely … when ба No sooner … than нь ихэвчлэн Past Perfect-тэй явдаг (No sooner had we arrived than it started to rain). B2-ийн 11-р дүрмийн cleft sentences (It was … that / What … is) мөн онцлох арга байсан; inversion бол онцлох хэрэгслийн дараагийн шат бөгөөд C1-ийн 2-р дүрмийн inverted conditionals (Had I known …), 11-р дүрмийн fronting-той нэг гэр бүл юм. Монгол хэлэнд эзэн, үйл үгийн байрыг сольж онцолдог ийм дүрэм байхгүй; бид «хэзээ ч», «огтхон ч», «дөнгөж» зэрэг үг болон өнгө аясаар онцолдог тул англиар сөрөг үгийг эхэнд тавиад ердийн дарааллаар үргэлжлүүлэх (Never I have seen) алдаа их гардаг.',
  structure: 'Negative adverbial + auxiliary (have / had / do / does / did / modal / be) + subject + main verb',
  structureParts: [
    { text: 'Never / Rarely / Not only …', part: 'modifier' },
    { text: 'auxiliary', part: 'verb' },
    { text: 'subject', part: 'subject' },
    { text: 'main verb', part: 'verb' },
  ],
  tip: 'Сөрөг / хязгаарласан үг эхэнд = асуултын дараалал. Never have I … · Rarely does she … · Not only did he …, but he also … · Hardly had I … when … · No sooner had I … than … · Only then did I … · Under no circumstances should you …',
  examples: [
    { en: '[Never](m) [have](v) [I](s) [seen](v) [such a beautiful sunset](o).', mn: 'Би хэзээ ч ийм үзэсгэлэнтэй нар жаргахыг харж байгаагүй.' },
    { en: '[Not only](m) [did](v) [she](s) [win](v) [the race](o), [but](m) [she](s) [also](m) [broke](v) [the record](o).', mn: 'Тэр уралдаанд түрүүлээд зогсохгүй дээд амжилтыг ч эвдсэн.' },
    { en: '[No sooner](m) [had](v) [we](s) [sat down](v) [than the phone rang](m).', mn: 'Биднийг дөнгөж суумагц утас дуугарав.' },
    { en: '[Under no circumstances](m) [should](v) [you](s) [open](v) [this door](o).', mn: 'Ямар ч тохиолдолд та энэ хаалгыг онгойлгож болохгүй.' },
  ],
  useCases: [
    {
      title: 'Never / Rarely / Seldom — давтамжийн сөрөг үг',
      description: '«Хэзээ ч», «ховор», «бараг үгүй» гэсэн утгатай adverb-ийг эхэнд гаргаж туршлага, үнэлгээгээ хүчтэй онцолно. Ихэвчлэн Present Perfect, Past Perfect эсвэл Present Simple-тэй (does / do нэмнэ).',
      examples: [
        { en: '[Never](m) [have](v) [I](s) [heard](v) [such a ridiculous excuse](o).', mn: 'Би хэзээ ч ийм инээдтэй шалтаг сонсож байгаагүй.' },
        { en: '[Rarely](m) [does](v) [the director](s) [visit](v) [our branch](o).', mn: 'Захирал манай салбарт ховорхон л ирдэг.' },
        { en: '[Seldom](m) [had](v) [the city](s) [experienced](v) [such a cold winter](o).', mn: 'Хот ийм хүйтэн өвлийг ховор л үзэж байсан.' },
      ],
    },
    {
      title: 'Hardly / Scarcely … when, No sooner … than — «дөнгөж … -магц»',
      description: 'Нэг үйлдэл дөнгөж дуусмагц нөгөө нь болсныг өгүүлнэ. Эхний хэсэгт Past Perfect + inversion, хоёр дахь хэсэгт Past Simple (ердийн дараалал). Hardly / Scarcely-тэй when, No sooner-тэй than хэрэглэнэ.',
      examples: [
        { en: '[Hardly](m) [had](v) [I](s) [closed](v) [my eyes](o) [when the baby started crying](m).', mn: 'Намайг дөнгөж нүдээ анимагц хүүхэд уйлж эхлэв.' },
        { en: '[No sooner](m) [had](v) [she](s) [left](v) [the office](o) [than it began to snow](m).', mn: 'Түүнийг оффисоос гармагц цас орж эхлэв.' },
        { en: '[Scarcely](m) [had](v) [the plane](s) [taken off](v) [when the engine failed](m).', mn: 'Онгоц дөнгөж хөөрмөгц хөдөлгүүр нь доголдов.' },
      ],
    },
    {
      title: 'Not only … but also — «…-аад зогсохгүй»',
      description: 'Хоёр баримтыг давхарлан онцолно. Inversion зөвхөн Not only-той эхний хэсэгт хийгдэнэ; but … also-той хоёр дахь хэсэг ердийн дараалалтай.',
      examples: [
        { en: '[Not only](m) [did](v) [he](s) [forget](v) [my birthday](o), [but](m) [he](s) [also](m) [arrived](v) [late](m).', mn: 'Тэр миний төрсөн өдрийг мартаад зогсохгүй бас хоцорч ирсэн.' },
        { en: '[Not only](m) [is](v) [the project](s) [over budget](o), [but](m) [it](s) [is](v) [also](m) [behind schedule](o).', mn: 'Төсөл төсвөө хэтрүүлээд зогсохгүй хугацаанаасаа ч хоцорч байна.' },
        { en: '[Not only](m) [can](v) [she](s) [sing](v), [but](m) [she](s) [also](m) [writes](v) [her own songs](o).', mn: 'Тэр дуулж чаддаг төдийгүй дуугаа өөрөө зохиодог.' },
      ],
    },
    {
      title: 'Only then / Only after / Not until — «зөвхөн тэр үед л»',
      description: 'Only + цагийн хэллэг эсвэл Not until эхэнд орвол «тэр болтол үгүй, зөвхөн тэгээд л» гэсэн хязгаарласан утгатай тул inversion хийнэ. Only after / Only when / Not until-ийн ард бүтэн clause байвал inversion нь ҮНДСЭН хэсэгт хийгдэнэ.',
      examples: [
        { en: '[Only then](m) [did](v) [I](s) [understand](v) [what she meant](o).', mn: 'Зөвхөн тэр үед л би түүний юу хэлэх гэснийг ойлгосон.' },
        { en: '[Only after the meeting](m) [did](v) [we](s) [learn](v) [the truth](o).', mn: 'Хурлын дараа л бид үнэнийг мэдсэн.' },
        { en: '[Not until I moved abroad](m) [did](v) [I](s) [appreciate](v) [my hometown](o).', mn: 'Гадаадад нүүсний дараа л би төрсөн нутгаа үнэлж эхэлсэн.' },
      ],
    },
    {
      title: 'Under no circumstances / On no account / Little — хориг ба «огт мэдээгүй»',
      description: 'Under no circumstances, On no account, At no time, In no way нь хатуу хориг, үгүйсгэлийг албан ёсоор илэрхийлнэ (дүрэм журам, анхааруулга). Little did he know … нь «тэр огтхон ч мэдээгүй байв» гэсэн өгүүллэгийн хэллэг.',
      examples: [
        { en: '[Under no circumstances](m) [are](v) [passengers](s) [allowed](v) [to enter the cockpit](o).', mn: 'Зорчигчид ямар ч тохиолдолд нисгэгчийн бүхээгт орохыг хориглоно.' },
        { en: '[On no account](m) [should](v) [this information](s) [be shared](v) [with the press](m).', mn: 'Энэ мэдээллийг ямар ч шалтгаанаар хэвлэлд дамжуулж болохгүй.' },
        { en: '[Little](m) [did](v) [he](s) [know](v) [that his life was about to change](o).', mn: 'Амьдрал нь өөрчлөгдөх гэж байгааг тэр огтхон ч мэдээгүй байв.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Туслах үйл үгтэй (have / had / modal)',
      structure: 'Negative adverbial + have / had / can / should + subject + V3 / V1',
      examples: [
        { en: '[Never](m) [had](v) [they](s) [felt](v) [so welcome](o).', mn: 'Тэд хэзээ ч өөрсдийг нь ингэж халуун дотно угтсаныг мэдэрч байгаагүй.' },
        { en: '[Rarely](m) [can](v) [you](s) [find](v) [such quality](o) [at this price](m).', mn: 'Ийм үнээр ийм чанар ховорхон л олдоно.' },
        { en: '[At no time](m) [have](v) [we](s) [misled](v) [our customers](o).', mn: 'Бид хэзээ ч үйлчлүүлэгчдээ төөрөгдүүлж байгаагүй.' },
      ],
    },
    {
      label: 'do / does / did нэмэх (Present / Past Simple)',
      structure: 'Negative adverbial + do / does / did + subject + V1',
      examples: [
        { en: '[Seldom](m) [does](v) [he](s) [admit](v) [his mistakes](o).', mn: 'Тэр алдаагаа хүлээх нь ховор.' },
        { en: '[Not once](m) [did](v) [she](s) [complain](v) [about the workload](m).', mn: 'Тэр ажлын ачааллын талаар нэг ч удаа гомдоллоогүй.' },
        { en: '[Only rarely](m) [do](v) [we](s) [receive](v) [complaints](o).', mn: 'Бидэнд гомдол тун ховор ирдэг.' },
      ],
    },
    {
      label: 'be үндсэн үйл үг байхад',
      structure: 'Negative adverbial + am / is / are / was / were + subject + …',
      examples: [
        { en: '[Rarely](m) [is](v) [the answer](s) [so simple](o).', mn: 'Хариулт ийм энгийн байх нь ховор.' },
        { en: '[Never](m) [was](v) [a victory](s) [more deserved](o).', mn: 'Ялалт хэзээ ч ийм зүй ёсных байгаагүй.' },
        { en: '[Not only](m) [was](v) [the hotel](s) [expensive](o), [but](m) [it](s) [was](v) [also](m) [dirty](o).', mn: 'Зочид буудал үнэтэй байгаад зогсохгүй бас бохир байсан.' },
      ],
    },
    {
      label: 'Only after / Only when / Not until + clause',
      structure: 'Only after / Only when / Not until + clause (ердийн дараалал) + auxiliary + subject + V (үндсэн хэсэгт inversion)',
      examples: [
        { en: '[Only when the lights went out](m) [did](v) [we](s) [notice](v) [the stars](o).', mn: 'Гэрэл унтарсан үед л бид оддыг анзаарсан.' },
        { en: '[Only after he had apologised](m) [did](v) [she](s) [agree](v) [to speak to him](o).', mn: 'Түүнийг уучлалт гуйсны дараа л тэр эмэгтэй түүнтэй ярихыг зөвшөөрсөн.' },
        { en: '[Not until the following morning](m) [was](v) [the damage](s) [discovered](v).', mn: 'Маргааш өглөө нь л хохирлыг илрүүлсэн.' },
      ],
    },
  ],
  signalWords: ['never', 'rarely', 'seldom', 'hardly … when', 'scarcely … when', 'no sooner … than', 'not only … but also', 'only then', 'only after', 'not until', 'under no circumstances', 'on no account', 'at no time', 'little'],
  notes: [
    'Inversion зөвхөн сөрөг adverbial өгүүлбэрийн ЭХЭНД байхад хийгдэнэ. Дунд нь байвал ердийн дараалал: I have never seen such chaos. / Never have I seen such chaos.',
    'Сөрөг утгыг эхний үг аль хэдийн өгсөн тул үйл үг эерэг хэлбэртэй байна: Never haven\'t I seen (буруу) → Never have I seen (зөв). Англид давхар үгүйсгэл байхгүй.',
    'Хос үгийг холихгүй: Hardly / Scarcely … when (эсвэл before), No sooner … than. No sooner нь sooner гэсэн харьцуулсан зэрэгтэй тул than авдаг гэж тогтоогоорой.',
    'Only after / Only when / Not until-ийн ард clause байвал тэр clause нь ердийн дараалалтай, inversion үндсэн хэсэгт: Only after she left did I realise … (Only after did she leave I realised — буруу).',
    'Not only … but also-д inversion зөвхөн эхний хэсэгт. Хоёр дахь хэсэгт but-ийг хасаж эсвэл also-г as well / too-оор сольж болно: Not only did he call, he also sent flowers.',
    'Эхэнд байгаа үг бүр inversion шаардахгүй. Only нь эзнийг тодотговол (Only Bat knows the answer), эсвэл Not long ago, Not far from here зэрэг цаг, газрын хэллэгт ердийн дараалал хэвээр: Not long ago I met him.',
  ],
  commonMistakes: [
    {
      wrong: 'Never I have seen such a mess.',
      correct: 'Never have I seen such a mess.',
      explanation: 'Never эхэнд орсон тул туслах үйл үг have эзний өмнө гарна. Монголоор үгийн дараалал өөрчлөгддөггүй тул ердийн дарааллаар үргэлжлүүлэх алдаа түгээмэл.',
    },
    {
      wrong: 'Rarely he goes to the theatre.',
      correct: 'Rarely does he go to the theatre.',
      explanation: 'Present Simple-д туслах үйл үг байхгүй тул асуулттай адил does нэмж, үндсэн үйл үгийг V1 болгоно (goes → go).',
    },
    {
      wrong: 'No sooner had I arrived when the meeting started.',
      correct: 'No sooner had I arrived than the meeting started.',
      explanation: 'No sooner-ийн хос нь than. when бол Hardly / Scarcely-ийн хос: Hardly had I arrived when the meeting started.',
    },
    {
      wrong: 'Only after did she leave I realised my mistake.',
      correct: 'Only after she left did I realise my mistake.',
      explanation: 'Only after-ийн дараах clause ердийн дараалалтай (she left), inversion нь үндсэн хэсэгт хийгдэнэ (did I realise).',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монгол хэлэнд үйл үг үргэлж өгүүлбэрийн төгсгөлд байдаг бөгөөд эзэн, туслах үйл үгийн байрыг сольж онцолдог дүрэм байхгүй. Бид «хэзээ ч», «огтхон ч», «ерөөсөө» гэсэн үг, өнгө аясаар онцолдог. Англиар харин сөрөг үгийг эхэнд гаргасан л бол асуултын дарааллыг заавал хэрэглэнэ.',
      'Монголоор «хэзээ ч хараагүй» гэж сөрөг үг + үгүйсгэсэн үйл үг хоёрыг хамт хэрэглэдэг (давхар үгүйсгэл). Англиар Never have I seen — үйл үг эерэг хэвээр, үгүйсгэлийг зөвхөн never өгнө.',
      'Монголоор «дөнгөж … -магц / -тал» (дөнгөж суумагц утас дуугарав) нь Hardly … when / No sooner … than-тай таарна. Монголоор эхний үйлдэл нөхцөл үйлээр (суумагц) илэрдэг бол англиар Past Perfect + inversion, хоёр дахь нь Past Simple.',
      'Монголоор «…-аад зогсохгүй», «төдийгүй» = Not only … but also; «ямар ч тохиолдолд … болохгүй» = Under no circumstances + эерэг үйл үг; «тэр үед л», «-сний дараа л» гэсэн онцлох «л» = Only then / Only after + inversion.',
    ],
  },
  dialogue: [
    {
      en: 'Tuya, [how](m) [was](v) [the conference](s) [in Singapore](m)?',
      mn: 'Туяа, Сингапур дахь хурал ямар болов?',
      speaker: 'Temuulen',
    },
    {
      en: 'Unforgettable. [Never](m) [have](v) [I](s) [spoken](v) [in front of so many people](m).',
      mn: 'Мартагдашгүй. Би хэзээ ч ийм олон хүний өмнө үг хэлж байгаагүй.',
      speaker: 'Tuya',
    },
    {
      en: '[Were](v) [you](s) [nervous](o)?',
      mn: 'Чи сандарсан уу?',
      speaker: 'Temuulen',
    },
    {
      en: 'Terribly. [No sooner](m) [had](v) [I](s) [started](v) [than the projector stopped working](m).',
      mn: 'Аймаар. Намайг дөнгөж эхэлмэгц проектор ажиллахаа больчихсон.',
      speaker: 'Tuya',
    },
    {
      en: 'Oh no! [What](o) [did](v) [you](s) [do](v)?',
      mn: 'Ёстой яасан юм! Чи яасан бэ?',
      speaker: 'Temuulen',
    },
    {
      en: '[I](s) [carried on](v) [without slides](m). [Not only](m) [did](v) [the audience](s) [stay](v), [but](m) [they](s) [also](m) [asked](v) [lots of questions](o). [Only then](m) [did](v) [I](s) [relax](v).',
      mn: 'Би слайдгүйгээр үргэлжлүүлсэн. Үзэгчид үлдээд зогсохгүй бас олон асуулт асуусан. Тэр үед л би тайвширсан.',
      speaker: 'Tuya',
    },
  ],
  quiz: [
    {
      id: 'c1-01-1',
      ruleId: 1,
      kind: 'fill',
      question: 'Never ___ such a moving speech.',
      options: ['I have heard', 'have I heard', 'I heard', 'did I heard'],
      answer: 'have I heard',
      explanation: 'Never өгүүлбэрийн эхэнд орсон тул inversion: туслах үйл үг have + эзэн I + V3 heard. did-ийн ард V1 (hear) байх ёстой тул did I heard буруу.',
      hint: 'Асуултын дарааллыг санаарай.',
    },
    {
      id: 'c1-01-2',
      ruleId: 1,
      kind: 'fill',
      question: 'No sooner had the meeting started ___ the fire alarm went off.',
      options: ['than', 'when', 'that', 'then'],
      answer: 'than',
      explanation: 'No sooner-ийн хос нь than (sooner — харьцуулсан зэрэг). when нь Hardly / Scarcely-тэй хэрэглэгдэнэ.',
      hint: 'sooner бол харьцуулсан зэрэг.',
    },
    {
      id: 'c1-01-3',
      ruleId: 1,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Rarely we see such dedication.',
        'Not only he was late, but he also forgot the documents.',
        'Only after the results were published did we realise the mistake.',
        'Little he knew that his life was about to change.',
      ],
      answer: 'Only after the results were published did we realise the mistake.',
      explanation: 'Only after + clause (ердийн дараалал), дараа нь үндсэн хэсэгт inversion: did we realise. Бусад нь inversion-гүй: Rarely do we see; Not only was he late; Little did he know.',
      hint: 'Inversion үндсэн хэсэгт байгаа эсэхийг шалга.',
    },
    {
      id: 'c1-01-4',
      ruleId: 1,
      kind: 'translate',
      question: 'Ямар ч тохиолдолд та нууц үгээ бусдад хэлж болохгүй.',
      options: [
        'Under no circumstances should you share your password with others.',
        'Under no circumstances you should share your password with others.',
        'Under no circumstances shouldn\'t you share your password with others.',
        'Under no circumstances do you should share your password with others.',
      ],
      answer: 'Under no circumstances should you share your password with others.',
      explanation: 'Under no circumstances эхэнд орсон тул should эзний өмнө гарна. Үгүйсгэл аль хэдийн илэрсэн тул үйл үг эерэг (shouldn\'t биш); modal-тай үед do нэмэхгүй.',
      hint: 'Сөрөг хэллэг + modal + эзэн, үйл үг эерэг.',
    },
  ],
};
