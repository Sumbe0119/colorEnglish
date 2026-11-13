// frontend/src/lib/grammar/b2/rule-08.ts
// B2 дүрэм 8: Verb patterns — -ing or to with a change of meaning
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule08: GrammarRule = {
  id: 8,
  title: 'Verb patterns: -ing or to with a change of meaning',
  titleMn: '-ing үү, to юу — хэлбэр солигдоход утга өөрчлөгддөг үйл үгс',
  hook: '«Би хаалгаа түгжсэнээ санаж байна» ба «Хаалгаа түгжихээ санаарай», «Тэр тамхи татахаа больсон» ба «Тэр тамхи татахаар зогссон» — нэг үйл үг, хоёр хэлбэр, хоёр өөр утга. Ялгааг нь сурцгаая.',
  summary: 'remember, forget, stop, try, regret, go on, mean гэсэн үйл үгсийн ард -ing ч, to ч орж болох боловч утга нь өөрчлөгдөнө. Ерөнхий зарчим: -ing нь өмнө нь болсон эсвэл аль хэдийн болж буй үйлдлийг, to нь дараа нь хийх үйлдэл, зорилгыг заана. see / hear / watch + хүн + V1 нь үйлдлийг бүхэлд нь, + V-ing нь үйлдлийн дунд хэсгийг харсан, сонссоныг илэрхийлнэ.',
  description: 'B1-ийн 11-р дүрэмд бид зарим үйл үгийн ард -ing (enjoy, finish, avoid), заримынх нь ард to (want, decide, hope) ордог, харин like, love, start, begin зэрэг нь аль алинтай нь бараг адил утгатай хэрэглэгддэг гэж үзсэн. B2 түвшинд гурав дахь бүлэг гарч ирнэ: хоёр хэлбэртэй хоёулантай нь хэрэглэгддэг, гэхдээ УТГА НЬ ӨӨР болдог үйл үгс. Цээжлэхэд туслах гол зарчим нь цагийн чиглэл юм. -ing хэлбэр «арагшаа» харна: үйлдэл эхлээд болсон, дараа нь түүнийгээ санах, мартах, харамсах, болих (I remember locking the door — түгжсэн, одоо санаж байна). to хэлбэр «урагшаа» харна: эхлээд санах, мартах, зогсох нь болж, дараа нь үйлдэл хийгдэнэ, эсвэл хийгдэх ёстой байсан (Remember to lock the door — эхлээд сана, дараа нь түгж). try-д зарчим арай өөр: try to do нь хичээх, хүч гаргах (амжилт тодорхойгүй), try doing нь туршаад үзэх (хийхэд хэцүү биш, үр дүн нь сонин). Мөн энэ дүрэмд мэдрэхүйн үйл үгсийг үзнэ: I saw him cross the road (хөндлөн гарахыг эхнээс нь дуустал харсан) ба I saw him crossing the road (гарч явахыг нь харсан). Монгол хэлэнд эдгээр ялгаа залгавраар маш тод илэрдэг: «түгжсэнээ санах» (-сан = өнгөрсөн) ба «түгжихээ санах» (-х = ирээдүй), «татахаа болих» ба «татахаар зогсох». Тэгэхээр монгол өгүүлбэрийнхээ залгаврыг ажиглавал англи хэлбэрээ зөв сонгож чадна.',
  structure: 'remember / forget / regret / stop / try / go on / mean + V-ing (өмнөх, бодит үйлдэл) ↔ + to V1 (дараагийн үйлдэл, зорилго) · see / hear / watch + object + V1 (бүхэлд нь) ↔ + V-ing (дунд нь)',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'remember / stop / try', part: 'verb' },
    { text: 'V-ing ↔ to V1', part: 'object' },
    { text: '· see + object + V1 / V-ing', part: 'modifier' },
  ],
  tip: '-ing = арагшаа (болсон үйлдлээ санах, мартах, харамсах, болих) · to = урагшаа (хийх ёстойгоо санах, мартах, хийхээр зогсох) · try to = хичээх, try -ing = туршиж үзэх.',
  examples: [
    { en: '[I](s) [remember](v) [locking the door](o).', mn: 'Би хаалгаа түгжсэнээ санаж байна. (түгжсэн, одоо санаж байна)' },
    { en: '[Remember](v) [to lock the door](o) [when you leave](m).', mn: 'Гарахдаа хаалгаа түгжихээ санаарай. (мартаж болохгүй)' },
    { en: '[He](s) [stopped](v) [smoking](o) [last year](m).', mn: 'Тэр өнгөрсөн жил тамхи татахаа больсон.' },
    { en: '[He](s) [stopped](v) [to smoke](m).', mn: 'Тэр тамхи татахаар зогссон. (өөр зүйл хийж байгаад)' },
  ],
  useCases: [
    {
      title: 'remember / forget — дурсамж уу, үүрэг үү',
      description: 'remember / forget + -ing: өмнө нь болсон зүйлийн дурсамж (forget + -ing ихэвчлэн I\'ll never forget … хэлбэртэй). remember / forget + to: хийх ёстой зүйлээ санах, мартах — эхлээд санана, дараа нь хийнэ.',
      examples: [
        { en: '[I](s)[\'ll never forget](v) [seeing the ocean](o) [for the first time](m).', mn: 'Би далайг анх харснаа хэзээ ч мартахгүй.' },
        { en: '[I](s) [forgot](v) [to buy bread](o), [so](m) [we](s) [have](v) [none](o).', mn: 'Би талх авахаа мартчихсан, тэгээд манайд талх алга.' },
        { en: '[Do](v) [you](s) [remember](v) [meeting her](o) [at my wedding](m)?', mn: 'Чи түүнтэй миний хурим дээр уулзсанаа санаж байна уу?' },
      ],
    },
    {
      title: 'stop / go on — болих уу, зогсох уу; үргэлжлүүлэх үү, шилжих үү',
      description: 'stop + -ing: хийж байсан зүйлээ болих. stop + to: өөр зүйл хийхийн тулд зогсох (to нь зорилго). go on + -ing: хийж байгаагаа үргэлжлүүлэх. go on + to: нэгийг дуусгаад дараагийн шинэ зүйл рүү шилжих.',
      examples: [
        { en: '[We](s) [stopped](v) [at a café](m) [to have a coffee](m).', mn: 'Бид кофе уухаар кафед зогссон.' },
        { en: '[She](s) [went on](v) [talking](o) [for two hours](m).', mn: 'Тэр хоёр цагийн турш тасралтгүй ярьсаар байсан.' },
        { en: '[After university](m), [he](s) [went on](v) [to become a judge](o).', mn: 'Их сургуулиа төгсөөд тэр цаашлаад шүүгч болсон.' },
      ],
    },
    {
      title: 'try — хичээх үү, туршиж үзэх үү',
      description: 'try + to: хэцүү зүйлийг хийхийг хичээх, оролдох — амжилттай болсон эсэх тодорхойгүй, ихэвчлэн болоогүй. try + -ing: асуудлыг шийдэхийн тулд нэг аргыг туршиж үзэх — хийх нь амархан, тус болох эсэх нь асуулт.',
      examples: [
        { en: '[I](s) [tried](v) [to open the window](o), [but](m) [it](s) [was](v) [stuck](o).', mn: 'Би цонхыг онгойлгох гэж оролдсон ч гацчихсан байсан.' },
        { en: '[If you can\'t sleep](m), [try](v) [drinking warm milk](o).', mn: 'Унтаж чадахгүй бол бүлээн сүү уугаад үз.' },
        { en: '[I](s) [tried](v) [restarting the computer](o), [but](m) [nothing](s) [changed](v).', mn: 'Би компьютерээ дахин асаагаад үзсэн ч юу ч өөрчлөгдөөгүй.' },
      ],
    },
    {
      title: 'regret / mean — харамсах, мэдэгдэх; гэсэн үг, зорих',
      description: 'regret + -ing: өмнө хийсэн зүйлдээ харамсах. regret + to (say, tell, inform): муу мэдээ дуулгахдаа «харамсалтай нь» гэж албан ёсоор хэлэх. mean + -ing: «…гэсэн үг», үр дагавар. mean + to: зорих, санаатай хийх.',
      examples: [
        { en: '[I](s) [regret](v) [leaving school](o) [at sixteen](m).', mn: 'Би арван зургаатайдаа сургуулиас гарсандаа харамсдаг.' },
        { en: '[We](s) [regret](v) [to inform you](o) [that your flight has been cancelled](o).', mn: 'Таны нислэг цуцлагдсаныг харамсалтайгаар мэдэгдэж байна.' },
        { en: '[The new job](s) [means](v) [getting up at five](o). [I](s) [didn\'t mean](v) [to wake you](o).', mn: 'Шинэ ажил гэдэг таван цагт босно гэсэн үг. Би чамайг сэрээх гээгүй юм.' },
      ],
    },
    {
      title: 'see / hear / watch + хүн + V1 эсвэл V-ing',
      description: 'Мэдрэхүйн үйл үгийн ард object + V1 (to-гүй): үйлдлийг эхнээс нь дуустал бүтнээр нь харсан, сонссон. object + V-ing: үйлдэл үргэлжилж байхад нь, дунд хэсгийг нь харсан, сонссон. Энд to хэзээ ч орохгүй.',
      examples: [
        { en: '[I](s) [saw](v) [him](o) [cross the road](o).', mn: 'Би түүнийг зам хөндлөн гарахыг харсан. (эхнээс нь дуустал)' },
        { en: '[I](s) [saw](v) [him](o) [crossing the road](o).', mn: 'Би түүнийг зам хөндлөн гарч явахыг харсан. (гарч байх үед нь)' },
        { en: '[We](s) [heard](v) [someone](o) [shouting](o) [outside](m).', mn: 'Бид гадаа хэн нэгэн хашгирч байхыг сонссон.' },
      ],
    },
  ],
  forms: [
    {
      label: 'verb + V-ing — арагшаа харсан утга',
      structure: 'remember / forget / regret / stop / go on + V-ing',
      examples: [
        { en: '[I](s) [don\'t remember](v) [saying that](o).', mn: 'Би тэгж хэлснээ санахгүй байна.' },
        { en: '[She](s) [regrets](v) [not studying harder](o).', mn: 'Тэр илүү шаргуу суралцаагүйдээ харамсдаг.' },
        { en: '[Please](m) [stop](v) [making that noise](o).', mn: 'Тэр чимээг гаргахаа больж үзээч.' },
      ],
    },
    {
      label: 'verb + to V1 — урагшаа харсан утга',
      structure: 'remember / forget / regret / stop / go on / mean + to + V1',
      examples: [
        { en: '[Did](v) [you](s) [remember](v) [to send the email](o)?', mn: 'Чи имэйлээ явуулахаа санасан уу?' },
        { en: '[Don\'t forget](v) [to take your umbrella](o).', mn: 'Шүхрээ авахаа бүү март.' },
        { en: '[I](s) [meant](v) [to call you](o), [but](m) [I](s) [was](v) [too busy](o).', mn: 'Би чам руу залгах санаатай байсан ч хэтэрхий завгүй байлаа.' },
      ],
    },
    {
      label: 'try to V1 ↔ try V-ing',
      structure: 'try + to + V1 (хичээх) · try + V-ing (туршиж үзэх)',
      examples: [
        { en: '[I](s)[\'m trying](v) [to learn Korean](o), [but](m) [it](s)[\'s](v) [hard](o).', mn: 'Би солонгос хэл сурах гэж хичээж байгаа ч хэцүү байна.' },
        { en: '[Try](v) [adding a little salt](o). [It](s) [might taste](v) [better](o).', mn: 'Жаахан давс нэмээд үз. Амт нь дээрдэж магадгүй.' },
        { en: '[He](s) [tried](v) [to lift the box](o), [but](m) [it](s) [was](v) [too heavy](o).', mn: 'Тэр хайрцгийг өргөх гэж оролдсон ч хэтэрхий хүнд байсан.' },
      ],
    },
    {
      label: 'see / hear / watch / feel + object + V1 / V-ing',
      structure: 'see / hear / watch / notice / feel + object + V1 (бүтэн үйлдэл) · + V-ing (үргэлжилж буй үйлдэл)',
      examples: [
        { en: '[I](s) [watched](v) [the children](o) [play the whole match](o).', mn: 'Би хүүхдүүдийн тоглолтыг эхнээс нь дуустал үзсэн.' },
        { en: '[She](s) [heard](v) [the door](o) [close](o).', mn: 'Тэр хаалга хаагдахыг сонссон.' },
        { en: '[Can](v) [you](s) [smell](v) [something](o) [burning](o)?', mn: 'Чамд ямар нэг юм шатаж байгаа үнэр үнэртэж байна уу?' },
      ],
    },
  ],
  signalWords: ['remember', 'forget', 'stop', 'try', 'regret', 'go on', 'mean', 'see / hear / watch + object', 'I\'ll never forget', 'We regret to inform you'],
  notes: [
    'Цагийн чиглэлийг шалгах асуулт: «Аль нь түрүүлж болсон бэ?» Үйлдэл түрүүлсэн бол -ing (I remember paying — төлсөн → санаж байна). Санах, мартах нь түрүүлсэн бол to (I remembered to pay — санасан → төлсөн).',
    'stop + to-ийн to нь үнэндээ зорилгын infinitive (in order to). Тиймээс хоёулаа нэг өгүүлбэрт орж болно: He stopped working to have lunch = Тэр үдийн хоол идэхээр ажлаа түр зогсоосон.',
    'regret + to нь бараг зөвхөн say, tell, inform, announce-тэй, албан бичиг, мэдэгдэлд хэрэглэгдэнэ. Өдөр тутмын ярианд «харамсдаг» гэвэл бараг үргэлж regret + -ing.',
    'forget + -ing нь ихэвчлэн үгүйсгэл, ирээдүйтэй: I\'ll never forget meeting you. «Хийснээ мартсан» гэхдээ I don\'t remember doing … гэж хэлэх нь илүү байгалийн.',
    'like, love, hate, start, begin, continue-ийн ард -ing ч, to ч бараг адил утгатай (B1-ийн 11-р дүрэм). Энэ дүрмийн үйл үгс л утгаа өөрчилдөг тул хоёр бүлгийг бүү хольж бай.',
    'Мэдрэхүйн үйл үгийн ард to орохгүй: I saw him to leave (буруу). Харин passive болоход to буцаж ирнэ: He was seen to leave the building.',
  ],
  commonMistakes: [
    {
      wrong: 'Remember locking the door when you go out.',
      correct: 'Remember to lock the door when you go out.',
      explanation: 'Хараахан хийгээгүй, хийх ёстой зүйлийг сануулж байна — remember + to. remember locking гэвэл «түгжсэнээ сана» гэсэн өнгөрсний дурсамж болно.',
    },
    {
      wrong: 'I stopped to eat sugar because of my teeth.',
      correct: 'I stopped eating sugar because of my teeth.',
      explanation: 'Зуршлаа болих — stop + -ing. stopped to eat sugar гэвэл «чихэр идэхээр зогссон» гэсэн эсрэг утга гарна.',
    },
    {
      wrong: 'I regret to tell her my secret. Now everybody knows.',
      correct: 'I regret telling her my secret. Now everybody knows.',
      explanation: 'Аль хэдийн хэлчихсэн зүйлдээ харамсаж байна — regret + -ing. regret to tell нь «харамсалтай нь хэлэх гэж байна» гэсэн албан мэдэгдлийн утгатай.',
    },
    {
      wrong: 'I heard her to sing in the next room.',
      correct: 'I heard her singing in the next room. / I heard her sing in the next room.',
      explanation: 'see, hear, watch-ийн ард object + V1 эсвэл V-ing орно, to хэзээ ч орохгүй. Монголоор «дуулахыг сонссон» гэдгийг to sing гэж орчуулах алдаа гардаг.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор ялгаа залгавраар тод харагдана: «түгжсэнээ санах» (-сан, өнгөрсөн) = remember locking, «түгжихээ санах» (-х, ирээдүй) = remember to lock. Монгол өгүүлбэртээ «-сан» байвал -ing, «-х» байвал to гэж бодоорой. forget, regret-д мөн адил: «хэлсэндээ харамсах» = regret saying.',
      'stop-ийн хоёр утга монголоор хоёр өөр үйл үг: «болих» (тамхи татахаа болих = stop smoking) ба «зогсох» (тамхи татахаар зогсох = stop to smoke). «-хаа болих» бол -ing, «-хаар / -хын тулд зогсох» бол to.',
      'try-ийн ялгаа: «-х гэж оролдох, хичээх» (онгойлгох гэж оролдсон) = try to open; «-аад үзэх» (уугаад үз) = try drinking. Монголын «-аад үзэх» хэлбэр try + -ing-тэй маш сайн таардаг.',
      'Мэдрэхүйн үйл үгэнд монголоор «гарахыг харсан» ба «гарч явахыг / гарч байхыг харсан» гэж ялгадаг нь see him cross ба see him crossing-тэй таарна. Монголоор хүн нь «-ыг/-ийг» тийн ялгалтай (түүнийг) байдаг шиг англиар object хэлбэртэй: saw him, heard her.',
    ],
  },
  dialogue: [
    {
      en: 'Tuya, [did](v) [you](s) [remember](v) [to book the tickets](o)?',
      mn: 'Туяа, чи тасалбар захиалахаа санасан уу?',
      speaker: 'Bat',
    },
    {
      en: 'Oh no. [I](s) [meant](v) [to do it](o) [last night](m), [but](m) [I](s) [forgot](v). [I](s) [remember](v) [opening the website](o), though.',
      mn: 'Өө, үгүй ээ. Өчигдөр орой хийх санаатай байсан ч мартчихаж. Гэхдээ вэбсайтыг нээснээ санаж байна.',
      speaker: 'Tuya',
    },
    {
      en: '[I](s) [tried](v) [to book](o) [this morning](m), [but](m) [the page](s) [wouldn\'t load](v).',
      mn: 'Би өнөө өглөө захиалах гэж оролдсон ч хуудас нь ачаалагдахгүй байсан.',
      speaker: 'Bat',
    },
    {
      en: '[Try](v) [using your phone](o) instead. [That](s) [worked](v) [for me](m) [last time](m).',
      mn: 'Оронд нь утсаараа ороод үз. Өнгөрсөн удаа надад тэгээд болсон.',
      speaker: 'Tuya',
    },
    {
      en: 'OK. [I](s) [saw](v) [Temuulen](o) [queuing at the ticket office](o) [yesterday](m), [so](m) [the tickets](s) [must be selling](v) [fast](m).',
      mn: 'За. Би өчигдөр Тэмүүлэнг тасалбарын касс дээр дугаарлаж байхыг харсан, тэгэхээр тасалбар хурдан зарагдаж байгаа байх.',
      speaker: 'Bat',
    },
    {
      en: '[Let\'s stop](v) [talking](o) and [book](v) [them](o) [now](m). [I](s) [don\'t want](v) [to regret waiting](o).',
      mn: 'Ярихаа болиод одоо захиалъя. Хүлээснээсээ болж харамсмааргүй байна.',
      speaker: 'Tuya',
    },
  ],
  quiz: [
    {
      id: 'b2-08-1',
      ruleId: 8,
      kind: 'fill',
      question: 'I\'ll never forget ___ the ocean for the first time. It was amazing.',
      options: ['to see', 'seeing', 'see', 'to seeing'],
      answer: 'seeing',
      explanation: 'Өмнө нь болсон зүйлийн дурсамж — forget + -ing: I\'ll never forget seeing. forget to see гэвэл «харахаа мартах» (хийх ёстой зүйл) болно.',
      hint: 'Болсон зүйлийн дурсамж — арагшаа харна.',
    },
    {
      id: 'b2-08-2',
      ruleId: 8,
      kind: 'fill',
      question: 'We had been driving for three hours, so we stopped at a café ___ a coffee.',
      options: ['having', 'to have', 'have', 'to having'],
      answer: 'to have',
      explanation: 'Кофе уухын тулд (зорилго) зогссон — stop + to V1: stopped to have. stop + -ing бол хийж байсан зүйлээ болих гэсэн утга тул энд тохирохгүй.',
      hint: 'Юу хийхээр зогссон бэ? Зорилго.',
    },
    {
      id: 'b2-08-3',
      ruleId: 8,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Remember locking the door when you leave.',
        'I regret to say that to her yesterday.',
        'I tried to open the window, but it was stuck.',
        'I saw him to cross the road.',
      ],
      answer: 'I tried to open the window, but it was stuck.',
      explanation: 'try + to = хичээх, оролдох (болоогүй) — зөв. Хийх ёстой зүйлд remember to lock; өчигдөр хэлчихсэн зүйлд regret saying; see + object-ийн ард to орохгүй (saw him cross).',
      hint: 'Оролдсон ч бүтээгүй = try to.',
    },
    {
      id: 'b2-08-4',
      ruleId: 8,
      kind: 'translate',
      question: 'Би хоёр жилийн өмнө тамхи татахаа больсон.',
      options: [
        'I stopped smoking two years ago.',
        'I stopped to smoke two years ago.',
        'I stopped smoke two years ago.',
        'I stopped to smoking two years ago.',
      ],
      answer: 'I stopped smoking two years ago.',
      explanation: '«-хаа болих» — хийж байсан зүйлээ болих = stop + -ing. stopped to smoke гэвэл «тамхи татахаар зогссон» гэсэн эсрэг утга болно.',
      hint: '«-хаа болих» = stop + -ing.',
    },
  ],
};
