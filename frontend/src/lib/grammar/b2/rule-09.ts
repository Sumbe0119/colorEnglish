// frontend/src/lib/grammar/b2/rule-09.ts
// B2 дүрэм 9: Relative clauses — whose / whom / preposition + which
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule09: GrammarRule = {
  id: 9,
  title: 'Relative clauses: whose / whom / preposition + which',
  titleMn: 'Relative clauses — whose, whom, угтвар үг + which',
  hook: '«Хүү нь шигшээ багт тоглодог эмэгтэй», «Миний хамт ажилладаг байсан хүн», «Тэр шалгалтандаа унасан нь бүгдийг гайхшруулсан» — who, which, that-аас цааш нэг алхам ахицгаая.',
  summary: 'whose нь харьяаллыг заана (the woman whose son … — хүү нь … эмэгтэй). whom нь тусагдахууны болон угтвар үгийн ардах who-ийн албан хэлбэр. Албан хэлэнд угтвар үг relative pronoun-ийхоо өмнө орно (the company for which I work), ярианд төгсгөлд үлдэнэ (the company I work for). when / where / why нь цаг, газар, шалтгааны нэр үгийн ард орно. Таслалтай which өмнөх бүтэн өгүүлбэрийг заана.',
  description: 'A2-д бид who, which, that-ыг, B1-ийн 13-р дүрэмд defining (тодорхойлох, таслалгүй) ба non-defining (нэмэлт мэдээлэл, таслалтай, that хэрэглэхгүй) relative clause-ийн ялгааг үзсэн. B2 түвшинд дөрвөн шинэ зүйл нэмэгдэнэ. Нэгдүгээрт, whose: his / her / its / their-ийн оронд орж харьяалал заадаг холбох үг — хүнд ч, юманд ч хэрэглэнэ, ард нь заавал нэр үг дагана. Хоёрдугаарт, whom: who-ийн тусагдахууны хэлбэр. Орчин үеийн ярианд who эсвэл юу ч хэрэглэхгүй байх нь түгээмэл боловч угтвар үгийн шууд ард заавал whom байна (to whom, with whom). Гуравдугаарт, угтвар үгийн байрлал: албан бичигт угтвар үгийг which / whom-ийн өмнө аваачдаг (the hotel in which we stayed), ярианд угтвар үг өгүүлбэрийн төгсгөлд үлддэг (the hotel we stayed in). Угтвар үгийн шууд ард that ч, who ч орж болохгүй. Дөрөвдүгээрт, таслалтай which нь ганц нэр үгийг биш, өмнөх өгүүлбэрийг бүхэлд нь тайлбарлаж чадна: He was late, which annoyed me. Монгол хэлэнд relative pronoun гэж байхгүй: тодотгох өгүүлбэр нэр үгийнхээ ӨМНӨ ордог («миний ажилладаг компани», «хүү нь эмч эмэгтэй»), угтвар үгийн оронд тийн ялгалын нөхцөл хэрэглэдэг ч тодотгох өгүүлбэрт тэр нь ихэвчлэн алга болдог. Иймээс монгол хүн англиар угтвар үгээ бүрмөсөн орхих (the company I work), эсвэл whose-ийн оронд who + his гэж хэлэх алдаа түгээмэл гаргадаг.',
  structure: 'noun + whose + noun + clause · noun + (preposition) + whom / which + clause · noun + clause + preposition · clause, which + verb',
  structureParts: [
    { text: 'noun', part: 'subject' },
    { text: 'whose + noun / preposition + whom / which', part: 'modifier' },
    { text: 'subject + verb', part: 'verb' },
    { text: '· …, which + verb', part: 'object' },
  ],
  tip: 'whose + нэр үг = «-ийн … нь» · угтвар үгийн шууд ард зөвхөн whom (хүн) / which (юм), that болохгүй · ярианд угтвар үг төгсгөлд · «, which» = «энэ нь» (бүтэн өгүүлбэрийг заана).',
  examples: [
    { en: '[That](s)[\'s](v) [the woman](o) [whose son plays for the national team](m).', mn: 'Тэр бол хүү нь шигшээ багт тоглодог эмэгтэй.' },
    { en: '[The man](s) [to whom I spoke](m) [was](v) [very helpful](o).', mn: 'Миний ярьсан хүн их тус дэмтэй байсан. (албан)' },
    { en: '[This](s) [is](v) [the company](o) [for which my father worked](m).', mn: 'Энэ бол миний аавын ажиллаж байсан компани. (албан)' },
    { en: '[He](s) [passed](v) [all his exams](o), [which surprised everyone](m).', mn: 'Тэр бүх шалгалтаа давсан нь бүгдийг гайхшруулсан.' },
  ],
  useCases: [
    {
      title: 'whose — харьяалал заах',
      description: 'his, her, its, their-ийг орлоно. Хүн, амьтан, байгууллага, юманд ч хэрэглэнэ. whose-ийн ард артикльгүй нэр үг шууд дагана. Defining ба non-defining хоёуланд орно.',
      examples: [
        { en: '[I](s) [have](v) [a friend](o) [whose father is a pilot](m).', mn: 'Надад аав нь нисгэгч найз бий.' },
        { en: '[The family](s) [whose house was damaged](m) [are staying](v) [with relatives](m).', mn: 'Байшин нь эвдэрсэн айл хамаатныдаа байгаа.' },
        { en: '[It](s)[\'s](v) [a small company](o) [whose products are sold worldwide](m).', mn: 'Энэ бол бүтээгдэхүүн нь дэлхий даяар зарагддаг жижиг компани.' },
      ],
    },
    {
      title: 'whom — тусагдахууны албан хэлбэр',
      description: 'Relative clause дотор хүн нь тусагдахуун бол албан хэлэнд whom. Defining clause-д ярианд who, that эсвэл юу ч хэрэглэхгүй байж болно. Non-defining (таслалтай) clause-д орхиж болохгүй, that ч болохгүй.',
      examples: [
        { en: '[The candidate](s) [whom we interviewed yesterday](m) [has accepted](v) [the job](o).', mn: 'Бидний өчигдөр ярилцлага авсан горилогч ажлыг хүлээж авсан.' },
        { en: '[My uncle](s), [whom you met last year](m), [is moving](v) [to Darkhan](m).', mn: 'Чиний өнгөрсөн жил уулзсан манай авга ах Дархан руу нүүж байгаа.' },
        { en: '[She](s)[\'s](v) [someone](o) [whom everybody respects](m).', mn: 'Тэр бол хүн бүрийн хүндэлдэг хүн.' },
      ],
    },
    {
      title: 'Угтвар үг + which / whom ба төгсгөлд угтвар үг',
      description: 'Үйл үг угтвар үгтэй бол (work for, talk to, stay in) тэр угтвар үг заавал хадгалагдана. Албан хэлэнд which / whom-ийн өмнө, ярианд clause-ийн төгсгөлд тавина. Угтвар үг өмнө нь орсон бол that, who хэрэглэхгүй, орхиж ч болохгүй.',
      examples: [
        { en: '[The hotel](s) [in which we stayed](m) [was](v) [very quiet](o).', mn: 'Бидний байрласан зочид буудал их нам гүм байсан. (албан)' },
        { en: '[The hotel](s) [we stayed in](m) [was](v) [very quiet](o).', mn: 'Бидний байрласан зочид буудал их нам гүм байсан. (ярианы)' },
        { en: '[The people](s) [with whom I work](m) [are](v) [very friendly](o).', mn: 'Миний хамт ажилладаг хүмүүс их найрсаг.' },
      ],
    },
    {
      title: 'when / where / why — цаг, газар, шалтгаан',
      description: 'the day / the year + when, the place / the town + where, the reason + why. Эдгээр нь угтвар үг + which-ийг орлоно: the day when = the day on which, the town where = the town in which. Defining clause-д when, why-г орхиж болно.',
      examples: [
        { en: '[I](s)[\'ll never forget](v) [the day](o) [when we first met](m).', mn: 'Бид анх уулзсан өдрийг би хэзээ ч мартахгүй.' },
        { en: '[That](s)[\'s](v) [the reason](o) [why I left the job](m).', mn: 'Би тэр ажлаас гарсан шалтгаан нь тэр.' },
        { en: '[This](s) [is](v) [the village](o) [where my grandparents grew up](m).', mn: 'Энэ бол миний өвөө эмээгийн өссөн тосгон.' },
      ],
    },
    {
      title: ', which — өмнөх бүтэн өгүүлбэрийг заах',
      description: 'Таслалтай which нь ганц нэр үгийг биш, өмнөх өгүүлбэрт хэлсэн бүх зүйлийг заана — монголоор «…нь», «энэ нь», «тэр нь». Ард нь ихэвчлэн үнэлгээ, үр дагавар орно. Энд what, that, it хэрэглэхгүй.',
      examples: [
        { en: '[He](s) [was](v) [late](o) [again](m), [which annoyed his boss](m).', mn: 'Тэр дахиад хоцорсон нь даргыг нь уурлуулсан.' },
        { en: '[She](s) [speaks](v) [four languages](o), [which is very useful in her job](m).', mn: 'Тэр дөрвөн хэлээр ярьдаг нь ажилд нь маш хэрэгтэй.' },
        { en: '[It](s) [rained](v) [all week](m), [which meant we couldn\'t go camping](m).', mn: 'Долоо хоног даяар бороо орсон тул бид зусланд гарч чадаагүй.' },
      ],
    },
  ],
  forms: [
    {
      label: 'whose + noun',
      structure: 'noun (person / thing) + whose + noun + verb …',
      examples: [
        { en: '[The girl](s) [whose bag was stolen](m) [went](v) [to the police](m).', mn: 'Цүнхээ хулгайд алдсан охин цагдаад очсон.' },
        { en: '[Saraa](s), [whose mother is a doctor](m), [wants](v) [to study medicine](o).', mn: 'Ээж нь эмч Сараа анагаах ухаанд суралцахыг хүсдэг.' },
        { en: '[We](s) [stayed](v) [in a village](m) [whose name I can\'t remember](m).', mn: 'Бид нэрийг нь би санахгүй байгаа нэг тосгонд байрласан.' },
      ],
    },
    {
      label: 'preposition + whom / which (албан)',
      structure: 'noun + preposition + whom (хүн) / which (юм) + subject + verb',
      examples: [
        { en: '[The colleague](s) [with whom I shared an office](m) [has retired](v).', mn: 'Миний нэг өрөөнд суудаг байсан хамтран ажиллагч тэтгэвэртээ гарсан.' },
        { en: '[This](s) [is](v) [the subject](o) [about which he wrote his first book](m).', mn: 'Энэ бол түүний анхны номоо бичсэн сэдэв.' },
        { en: '[The person](s) [to whom the letter was addressed](m) [no longer lives](v) [here](m).', mn: 'Захидлыг хаягласан хүн энд амьдрахаа больсон.' },
      ],
    },
    {
      label: 'preposition at the end (ярианы)',
      structure: 'noun + (who / which / that) + subject + verb + preposition',
      examples: [
        { en: '[The colleague](s) [I shared an office with](m) [has retired](v).', mn: 'Миний нэг өрөөнд суудаг байсан хамтран ажиллагч тэтгэвэртээ гарсан.' },
        { en: '[Is](v) [this](s) [the book](o) [you were talking about](m)?', mn: 'Энэ чиний яриад байсан ном мөн үү?' },
        { en: '[That](s)[\'s](v) [the film](o) [which I told you about](m).', mn: 'Энэ бол миний чамд ярьсан кино.' },
      ],
    },
    {
      label: 'when / where / why ба , which',
      structure: 'the day when … · the place where … · the reason why … · clause + , which + verb',
      examples: [
        { en: '[2020](s) [was](v) [the year](o) [when everything changed](m).', mn: '2020 он бол бүх зүйл өөрчлөгдсөн жил байлаа.' },
        { en: '[Nobody](s) [knows](v) [the reason](o) [why she resigned](m).', mn: 'Тэр яагаад ажлаасаа гарсныг хэн ч мэдэхгүй.' },
        { en: '[The lift](s) [was](v) [broken](o), [which meant we had to use the stairs](m).', mn: 'Цахилгаан шат эвдэрсэн байсан тул бид шатаар явахаас өөр аргагүй болсон.' },
      ],
    },
  ],
  signalWords: ['whose', 'whom', 'to whom', 'with whom', 'in which', 'for which', 'about which', 'the reason why', 'the day when', 'the place where', ', which'],
  notes: [
    'whose ба who\'s хоёр адилхан дуудагддаг ч өөр: whose = харьяалал (the man whose car …), who\'s = who is / who has (the man who\'s waiting …).',
    'Угтвар үгийн шууд ард that ч, who ч орохгүй: the man to who I spoke (буруу), the house in that I live (буруу). Угтвар үг өмнө орсон бол зөвхөн whom / which.',
    'Угтвар үгийг хоёр удаа бүү давт: the hotel in which we stayed in (буруу). Эхэнд эсвэл төгсгөлд — нэг л газар.',
    'where-ийн ард угтвар үг хэрэггүй: the town where I was born = the town in which I was born = the town (which) I was born in. the town where I was born in (буруу).',
    'the reason why-ийн ард because давхар орохгүй: The reason why I left is because … гэхээс The reason why I left is that … гэвэл илүү зөв, цэвэр хэллэг.',
    'Бүтэн өгүүлбэрийг заах which-ийн өмнө заавал таслал тавина. Таслалгүй бол which хамгийн ойрын нэр үгийг заана: He lost the key, which was annoying (гээсэн нь) — He lost the key which opens the safe (тэр түлхүүр).',
  ],
  commonMistakes: [
    {
      wrong: 'I met a girl who her brother is a famous singer.',
      correct: 'I met a girl whose brother is a famous singer.',
      explanation: 'Харьяалал заахад who + her биш, whose нэг үгээр. Монголоор «ах нь» гэдэг «нь»-ийг her гэж тусад нь орчуулах алдаа гардаг.',
    },
    {
      wrong: 'This is the company which I work.',
      correct: 'This is the company which I work for. / This is the company for which I work.',
      explanation: 'work for гэсэн угтвар үг заавал хадгалагдана. Монголоор «миний ажилладаг компани» гэхэд тийн ялгалын нөхцөл алга болдог тул англиар угтвар үгээ орхих алдаа гардаг.',
    },
    {
      wrong: 'The man to who I spoke was the manager.',
      correct: 'The man to whom I spoke was the manager. / The man I spoke to was the manager.',
      explanation: 'Угтвар үгийн шууд ард who биш, whom орно. Ярианд угтвар үгийг төгсгөлд аваачаад who-г орхиж болно.',
    },
    {
      wrong: 'He didn\'t come to the party, what made me sad.',
      correct: 'He didn\'t come to the party, which made me sad.',
      explanation: 'Өмнөх бүтэн өгүүлбэрийг заахад таслал + which. what нь relative clause-д өмнөх зүйлийг заадаггүй (what = the thing that).',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор тодотгох өгүүлбэр нэр үгийнхээ өмнө ордог: «хүү нь шигшээд тоглодог эмэгтэй». Англиар нэр үг эхэлж, тодотгол нь ард нь: the woman whose son plays … Монголын «нь» (хүү нь, аав нь) = whose гэж бодоорой.',
      'Монголоор «миний ярьсан хүн», «миний ажилладаг компани» гэхэд «хүнтэй», «компанид» гэсэн тийн ялгалын нөхцөл алга болдог. Англиар угтвар үг хэзээ ч алга болохгүй: the man I spoke to, the company I work for. Үйл үгээ угтвар үгтэй нь хамт санаарай.',
      'Монгол хэлэнд who / whom шиг ялгаа байхгүй, албан ба ярианы хэв маягийг үгийн сонголтоор ялгадаг. Англиар угтвар үгийн байрлал өөрөө хэв маягийг заана: for which I work (албан бичиг) — I work for (өдөр тутмын яриа).',
      'Монголоор өмнөх өгүүлбэрийг «нь» эсвэл «энэ нь»-ээр холбодог: «Тэр хоцорсон нь намайг уурлуулсан». Англиар таслал + which: He was late, which annoyed me. «Нь»-ийг it гэж орчуулаад хоёр өгүүлбэрийг таслалаар залгаж болохгүй.',
    ],
  },
  dialogue: [
    {
      en: 'Nomin, [who](s) [was](v) [that man](o) [you were talking to](m)?',
      mn: 'Номин, чиний яриад байсан тэр хүн хэн бэ?',
      speaker: 'Temuulen',
    },
    {
      en: '[That](s)[\'s](v) [Mr Bold](o), [whose daughter is in my class](m). [He](s) [runs](v) [the company](o) [for which my brother works](m).',
      mn: 'Тэр бол Болд гуай, охин нь манай ангид сурдаг. Миний ахын ажилладаг компанийг удирддаг хүн.',
      speaker: 'Nomin',
    },
    {
      en: 'Oh, [is](v) [that](s) [the place](o) [where they make furniture](m)?',
      mn: 'Өө, тавилга хийдэг тэр газар уу?',
      speaker: 'Temuulen',
    },
    {
      en: 'Yes. [He](s) [offered](v) [me](o) [a summer job](o), [which was a nice surprise](m).',
      mn: 'Тийм. Тэр надад зуны ажил санал болгосон нь таатай гэнэтийн бэлэг байлаа.',
      speaker: 'Nomin',
    },
    {
      en: 'Great! [Is](v) [that](s) [the reason](o) [why you look so happy](m)?',
      mn: 'Гоё байна! Чи ийм баяртай харагдаж байгаагийн шалтгаан нь тэр үү?',
      speaker: 'Temuulen',
    },
    {
      en: 'Exactly. [The team](s) [I\'ll be working with](m) [is](v) [really young](o), [which makes it even better](m).',
      mn: 'Яг тийм. Миний хамт ажиллах баг үнэхээр залуу байгаа нь бүр ч сайхан.',
      speaker: 'Nomin',
    },
  ],
  quiz: [
    {
      id: 'b2-09-1',
      ruleId: 9,
      kind: 'fill',
      question: 'That\'s the woman ___ son plays for the national team.',
      options: ['who', 'whose', 'whom', 'which'],
      answer: 'whose',
      explanation: 'Ард нь нэр үг (son) дагаж, харьяалал заасан — whose son = «хүү нь». who, whom, which-ийн ард нэр үг ингэж шууд орохгүй.',
      hint: '«хүү НЬ» — харьяалал.',
    },
    {
      id: 'b2-09-2',
      ruleId: 9,
      kind: 'fill',
      question: 'This is the company for ___ my father worked for thirty years.',
      options: ['that', 'who', 'which', 'what'],
      answer: 'which',
      explanation: 'Угтвар үгийн (for) шууд ард юмны тухай бол зөвхөн which. that, who угтвар үгийн ард орохгүй, what нь relative pronoun биш.',
      hint: 'Угтвар үг + юм = ?',
    },
    {
      id: 'b2-09-3',
      ruleId: 9,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'The man to who I spoke was very helpful.',
        'She passed all her exams, what surprised everyone.',
        'The hotel in which we stayed was very quiet.',
        'I met a girl who her brother is a pilot.',
      ],
      answer: 'The hotel in which we stayed was very quiet.',
      explanation: 'Угтвар үг + which зөв бүтэц. Угтвар үгийн ард who биш whom (to whom); бүтэн өгүүлбэрийг заахад what биш , which; харьяалалд who her биш whose.',
      hint: 'Угтвар үгийн ард which / whom.',
    },
    {
      id: 'b2-09-4',
      ruleId: 9,
      kind: 'translate',
      question: 'Тэр шалгалтандаа унасан нь эцэг эхийг нь гайхшруулсан.',
      options: [
        'He failed his exam, which surprised his parents.',
        'He failed his exam, what surprised his parents.',
        'He failed his exam, that surprised his parents.',
        'He failed his exam, who surprised his parents.',
      ],
      answer: 'He failed his exam, which surprised his parents.',
      explanation: '«Унасан нь» — өмнөх бүтэн өгүүлбэрийг заана: таслал + which. what ингэж хэрэглэгдэхгүй, таслалын ард that орохгүй, who зөвхөн хүнийг заана.',
      hint: '«…нь» = , which.',
    },
  ],
};
