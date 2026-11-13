// frontend/src/lib/grammar/b2/rule-14.ts
// B2 дүрэм 14: Articles: advanced use — generic reference, the + adjective, geographical names, institutions
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule14: GrammarRule = {
  id: 14,
  title: 'Articles: advanced use',
  titleMn: 'Артикль: ахисан хэрэглээ — ерөнхий утга, the + тэмдэг нэр, газар зүйн нэр, байгууллага',
  hook: '«Life is hard» уу, «The life is hard» уу? «go to hospital» ба «go to the hospital» юугаараа ялгаатай вэ? Яагаад the Gobi мөртлөө Lake Khuvsgul гэдэг вэ? — монгол хүнд хамгийн төвөгтэй сэдвийн нарийн ширийнийг цэгцэлцгээе.',
  summary: 'Ерөнхийд нь ярихад олон тоо болон тоолж болохгүй, хийсвэр нэр үг артикльгүй (Dogs are loyal. Life is short). the + ганц тоо нь төрөл зүйл, шинэ бүтээл, хөгжмийн зэмсгийг (the tiger, the internet, the piano), the + тэмдэг нэр нь бүлэг хүнийг (the rich, the unemployed) заана. Газар зүйн нэрэнд the авдаг (далай, гол, нурууд, цөл, олон тоот улс) ба авдаггүй (тив, ихэнх улс, хот, ганц уул, нуур) бүлэг бий. school / hospital / prison / university / bed / work нь үндсэн зорилгоороо бол артикльгүй, барилга байгууламж болгож яривал the-тэй.',
  description: 'A1-ийн 4-р дүрэмд бид a / an (анх дурдаж буй, олны нэг) ба the (тодорхой, мэдэгдэж буй) гэсэн үндсэн ялгааг үзсэн. B2 түвшинд энэ хангалтгүй болдог — алдааны ихэнх нь «артикль тавих уу, тавихгүй юу» гэдэг дээр гардаг. Монгол хэлэнд артикль огт байдаггүй тул суралцагчид хоёр эсрэг алдаа гаргадаг: шаардлагатай газар орхих (I bought car), эсвэл «чухал үг» бүрд the нэмэх (The life is the gift). Энэ дүрэмд таван зүйлийг цэгцэлнэ. НЭГ: ерөнхий утга (generic reference). Аливаа зүйлийг бүхэлд нь, ерөнхийд нь ярихад олон тооны болон тоолж болохгүй нэр үг АРТИКЛЬГҮЙ: Children need love. Sugar is bad for you. Харин тодорхой нэгийг заавал the: The children next door are noisy. The sugar in this bowl is brown. Ганц тоогоор ерөнхийлөх хоёр арга бий: a / an (A doctor must be patient — аль ч эмч) ба албан, шинжлэх ухааны the (The whale is a mammal — халим гэдэг төрөл). ХОЁР: хийсвэр нэр үг (love, freedom, happiness, education, nature, society) ерөнхий утгаараа артикльгүй, харин of-той эсвэл тодотголтой бол the: the history of Mongolia, the love she felt. ГУРАВ: the + тэмдэг нэр = тухайн шинжтэй бүх хүн, олон тоонд тооцно: The rich are getting richer. ДӨРӨВ: газар зүйн нэр — the авдаг ба авдаггүй бүлгийг цээжлэх хэрэгтэй. ТАВ: байгууллагын нэр — go to school / be in hospital / go to prison гэвэл сурагч, өвчтөн, хоригдлын хувиар; go to the school / the hospital гэвэл зүгээр тэр барилга руу очих. Мөн ертөнцөд ганц байдаг зүйл (the sun, the moon, the world, the internet, the government) the авна.',
  structure: 'Ø + plural / uncountable (ерөнхий) · the + noun (тодорхой, цор ганц) · a / an + singular (аль ч нэг) · the + adjective (бүлэг хүн) · the + rivers / oceans / mountain ranges · Ø + cities / most countries / lakes',
  structureParts: [
    { text: 'Ø', part: 'plain' },
    { text: 'Children', part: 'subject' },
    { text: 'need', part: 'verb' },
    { text: 'Ø love', part: 'object' },
    { text: '· the rich · the Gobi · go to Ø school', part: 'modifier' },
  ],
  tip: 'Ерөнхийд нь = артикльгүй (Life is short) · тодорхой нэг = the (the life of a nomad) · the + тэмдэг нэр = бүлэг хүн (the poor) · гол, далай, нуруу, цөл = the · хот, ихэнх улс, нуур, ганц уул = артикльгүй · go to school (сурахаар) / go to the school (барилга руу).',
  examples: [
    { en: '[Life](s) [is](v) [hard](o) [without friends](m).', mn: 'Найз нөхөдгүй бол амьдрал хэцүү. (ерөнхийд нь — артикльгүй)' },
    { en: '[The rich](s) [should help](v) [the poor](o).', mn: 'Баячууд ядуучуудад туслах ёстой.' },
    { en: '[The Selenge](s) [flows](v) [into Lake Baikal](m).', mn: 'Сэлэнгэ мөрөн Байгал нуурт цутгадаг. (гол — the, нуур — артикльгүй)' },
    { en: '[My grandmother](s) [is](v) [in hospital](m), [so](m) [I](s) [went](v) [to the hospital](m) [to visit her](m).', mn: 'Эмээ маань эмнэлэгт хэвтэж байгаа тул би түүнийг эргэхээр эмнэлэг рүү явсан.' },
  ],
  useCases: [
    {
      title: 'Ерөнхий утга — артикльгүй олон тоо, тоолж болохгүй нэр үг',
      description: 'Аливаа зүйлийг бүхэлд нь, ерөнхийд нь ярихад олон тооны нэр үг болон тоолж болохгүй нэр үг артикльгүй. the тавибал «тодорхой, энэ» гэсэн утга болно. Хийсвэр нэр үг (love, time, money, health, music) мөн адил.',
      examples: [
        { en: '[Teenagers](s) [spend](v) [too much time](o) [on social media](m).', mn: 'Өсвөр насныхан олон нийтийн сүлжээнд хэт их цаг зарцуулдаг.' },
        { en: '[Patience](s) [is](v) [more important](o) [than talent](m).', mn: 'Тэвчээр авьяасаас илүү чухал.' },
        { en: '[I](s) [love](v) [music](o), [but](m) [I](s) [didn\'t like](v) [the music](o) [at the wedding](m).', mn: 'Би хөгжимд дуртай, гэхдээ хуриман дээрх хөгжим надад таалагдаагүй.' },
      ],
    },
    {
      title: 'the / a + ганц тоо — төрөл зүйлийг ерөнхийлөх; цор ганц зүйл',
      description: 'the + ганц тоо: амьтан, ургамлын төрөл, шинэ бүтээл, хөгжмийн зэмсэг (албан, шинжлэх ухааны өнгөтэй). a / an + ганц тоо: «аль ч нэг» төлөөлөгч. Ертөнцөд ганц байдаг зүйл үргэлж the: the sun, the sky, the world, the internet, the environment.',
      examples: [
        { en: '[The snow leopard](s) [is](v) [an endangered species](o).', mn: 'Цоохор ирвэс бол устах аюулд орсон зүйл.' },
        { en: '[A good teacher](s) [listens](v) [to students](m).', mn: 'Сайн багш сурагчдаа сонсдог. (аль ч сайн багш)' },
        { en: '[The internet](s) [has changed](v) [the world](o).', mn: 'Интернэт дэлхийг өөрчилсөн.' },
      ],
    },
    {
      title: 'the + тэмдэг нэр — бүлэг хүн',
      description: 'the + тэмдэг нэр нь тухайн шинжтэй бүх хүнийг заана: the rich, the poor, the young, the elderly, the unemployed, the homeless, the disabled. Үргэлж олон тооны үйл үгтэй, -s залгахгүй. Зарим үндэстэнд ч мөн: the French, the British, the Japanese.',
      examples: [
        { en: '[The young](s) [are](v) [often more optimistic](o) [than the old](m).', mn: 'Залуус ихэвчлэн хөгшчүүлээс илүү өөдрөг байдаг.' },
        { en: '[The government](s) [should do](v) [more](o) [for the unemployed](m).', mn: 'Засгийн газар ажилгүйчүүдийн төлөө илүү ихийг хийх ёстой.' },
        { en: '[The Japanese](s) [live](v) [longer](m) [than most other nations](m).', mn: 'Япончууд бусад ихэнх үндэстнээс урт насалдаг.' },
      ],
    },
    {
      title: 'Газар зүйн нэр — the авах уу, үгүй юу',
      description: 'the АВНА: далай, тэнгис, гол мөрөн, суваг (the Pacific, the Tuul), нурууд (the Altai Mountains), арлын бүлэг, цөл (the Gobi), олон тоот эсвэл Republic / Kingdom / States орсон улс (the Netherlands, the United Kingdom). the АВАХГҮЙ: тив, ихэнх улс, хот, гудамж, ганц уул (Mount Everest), нуур (Lake Khuvsgul).',
      examples: [
        { en: '[The Gobi](s) [covers](v) [parts of Mongolia and China](o).', mn: 'Говь цөл Монгол, Хятадын зарим хэсгийг хамардаг.' },
        { en: '[She](s) [has lived](v) [in the Netherlands and Germany](m).', mn: 'Тэр Нидерланд, Германд амьдарч байсан.' },
        { en: '[They](s) [climbed](v) [Mount Fuji](o) [and then](m) [crossed](v) [the Pacific](o).', mn: 'Тэд Фүжи ууланд авирч, дараа нь Номхон далайг гаталсан.' },
      ],
    },
    {
      title: 'Байгууллага — go to school уу, go to the school уу',
      description: 'school, university, college, hospital, prison, church, bed, work, home нь үндсэн зорилгоороо (сурах, эмчлүүлэх, ял эдлэх, унтах) яригдвал артикльгүй. Барилга, байршил болгож яривал the. Британи англид in hospital, америк англид in the hospital гэдэг.',
      examples: [
        { en: '[My son](s) [started](v) [school](o) [last year](m).', mn: 'Миний хүү өнгөрсөн жил сургуульд орсон. (сурагчийн хувиар)' },
        { en: '[I](s) [went](v) [to the school](m) [to speak to his teacher](m).', mn: 'Би багштай нь ярихаар сургууль руу очсон. (барилга руу)' },
        { en: '[He](s) [was sent](v) [to prison](m) [for five years](m).', mn: 'Тэр таван жилийн хорих ял авсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Артикльгүй (zero article)',
      structure: 'Ø + plural noun / uncountable noun / abstract noun (ерөнхий утга) · Ø + meals, languages, sports, by + transport',
      examples: [
        { en: '[Prices](s) [have risen](v) [sharply](m) [this year](m).', mn: 'Энэ жил үнэ огцом өссөн.' },
        { en: '[Education](s) [changes](v) [lives](o).', mn: 'Боловсрол амьдралыг өөрчилдөг.' },
        { en: '[We](s) [had](v) [dinner](o) [and](m) [went](v) [home](m) [by taxi](m).', mn: 'Бид оройн хоолоо идээд таксигаар гэртээ харьсан.' },
      ],
    },
    {
      label: 'the — тодорхой, цор ганц, тодотголтой',
      structure: 'the + noun (мэдэгдэж буй / ганц байдаг) · the + noun + of … · the + superlative / ordinal · the + musical instrument',
      examples: [
        { en: '[The history of Mongolia](s) [is](v) [fascinating](o).', mn: 'Монголын түүх үнэхээр сонирхолтой.' },
        { en: '[She](s) [plays](v) [the piano](o) [beautifully](m).', mn: 'Тэр төгөлдөр хуурыг гайхалтай сайхан тоглодог.' },
        { en: '[The advice](s) [you gave me](m) [was](v) [very useful](o).', mn: 'Чиний надад өгсөн зөвлөгөө их хэрэг болсон.' },
      ],
    },
    {
      label: 'the + adjective / the + газар зүйн нэр',
      structure: 'the + adjective + plural verb · the + ocean / river / mountain range / desert / plural country',
      examples: [
        { en: '[The elderly](s) [need](v) [better care](o).', mn: 'Ахмад настнуудад илүү сайн халамж хэрэгтэй.' },
        { en: '[The Alps](s) [are](v) [popular](o) [with skiers](m).', mn: 'Альпийн нуруу цаначдын дунд алдартай.' },
        { en: '[The United States](s) [borders](v) [Canada and Mexico](o).', mn: 'Америкийн Нэгдсэн Улс Канад, Мексиктэй хиллэдэг.' },
      ],
    },
    {
      label: 'Байгууллага: Ø (зорилго) / the (барилга)',
      structure: 'go to / be at / be in + Ø school, university, hospital, prison, church, bed, work · the + мөн үг (барилга, байршил)',
      examples: [
        { en: '[She](s)[\'s](v) [at university](m), [studying law](m).', mn: 'Тэр их сургуульд хуулийн чиглэлээр сурч байгаа.' },
        { en: '[The university](s) [is](v) [next to the park](m).', mn: 'Их сургууль цэцэрлэгт хүрээлэнгийн хажууд байдаг.' },
        { en: '[I](s) [usually go](v) [to bed](m) [at eleven](m).', mn: 'Би ихэвчлэн арван нэгэн цагт унтдаг.' },
      ],
    },
  ],
  signalWords: ['in general', 'the + of', 'the rich', 'the poor', 'the unemployed', 'the same', 'the only', 'the sun', 'the internet', 'go to school', 'in hospital', 'at work', 'by car', 'most people'],
  notes: [
    'Ерөнхий утгаар the хэрэглэхгүй: The life is short, I like the dogs (буруу) → Life is short, I like dogs. the тавибал «энэ тодорхой амьдрал / эдгээр нохой» гэсэн утга болно.',
    'Хийсвэр болон тоолж болохгүй нэр үг of-той, эсвэл дагалдах өгүүлбэрээр тодотгогдвол the авна: history → the history of Asia; music → the music I listen to; water → the water in this lake.',
    'the + тэмдэг нэр үргэлж олон тоо, бүлгийг бүхэлд нь заана: The rich are … (The rich is … биш, the riches биш). Нэг хүнийг хэлэх бол нэр үг нэмнэ: a rich man, a homeless person.',
    'Тоолж болох ганц тооны нэр үг артикльгүй (эсвэл my, this зэрэг тодотгогчгүй) бараг хэзээ ч ирдэггүй: She is doctor (буруу) → She is a doctor. Мэргэжил, «ямар» гэдгийг хэлэхэд a / an заавал.',
    'most people (ерөнхийд нь ихэнх хүн) ба most of the people (тодорхой бүлгийн ихэнх) ялгаатай. the most people гэж ерөнхий утгаар хэлэхгүй. Мөн all children / all the children in my class.',
    'Улсын нэр: Mongolia, Japan, France артикльгүй; харин the United States, the United Kingdom, the Netherlands, the Philippines, the Czech Republic the-тэй. Нуур ба ганц уул артикльгүй (Lake Baikal, Mount Everest), гол ба нурууд the-тэй (the Orkhon, the Himalayas).',
  ],
  commonMistakes: [
    {
      wrong: 'The life in the countryside is cheaper than in the city.',
      correct: 'Life in the countryside is cheaper than in the city.',
      explanation: 'Амьдралын тухай ерөнхийд нь ярьж байгаа тул артикльгүй. Харин the life of a herder гэх мэт of-той тодотговол the авна.',
    },
    {
      wrong: 'My father is engineer and my mother is teacher.',
      correct: 'My father is an engineer and my mother is a teacher.',
      explanation: 'Тоолж болох ганц тооны нэр үг (мэргэжил) заавал a / an авна. Монголоор «инженер», «багш» гэж шууд хэлдэг тул артикль орхих нь хамгийн түгээмэл алдаа.',
    },
    {
      wrong: 'The poors need more support from the government.',
      correct: 'The poor need more support from the government.',
      explanation: 'the + тэмдэг нэр өөрөө олон тооны утгатай тул -s залгахгүй, үйл үг нь олон тоонд (need).',
    },
    {
      wrong: 'We went to the Lake Khuvsgul and saw the Mount Otgontenger.',
      correct: 'We went to Lake Khuvsgul and saw Mount Otgontenger.',
      explanation: 'Lake + нэр, Mount + нэр артикльгүй. the нь гол мөрөн, далай, нурууд, цөлд: the Tuul, the Pacific, the Altai Mountains, the Gobi.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монгол хэлэнд артикль байхгүй. Тодорхой эсэхийг «энэ», «тэр», «нөгөө», «нэг» гэсэн үгс, заахын тийн ялгал (ном уншсан / номыг уншсан), мөн контекстээр илэрхийлдэг. «Номыг» гэж «-ыг» залгасан бол ихэвчлэн the book, «нэг ном» бол a book гэж бодож болно.',
      'Монголоор «Амьдрал хэцүү», «Нохой үнэнч амьтан» гэж ерөнхий утгыг нүцгэн нэр үгээр хэлдэг нь англи хэлний артикльгүй хэлбэртэй (Life is hard, Dogs are loyal) таардаг. Гэхдээ англиар тоолж болох нэр үг ерөнхий утгаар ОЛОН ТООНД орох ёстой: «Нохой үнэнч» = Dogs are loyal (Dog is loyal биш).',
      'Монголоор «баячууд», «ядуучууд», «залуус», «ажилгүйчүүд» гэж «-чууд / -с» дагавраар бүлэг хүнийг хэлдэг. Англиар энэ дагаврын үүргийг the гүйцэтгэнэ: the rich, the poor, the young, the unemployed — тэмдэг нэр өөрөө хувирахгүй.',
      'Монголоор «сургуульд явах» гэхэд сурахаар уу, барилга руу юу гэдэг ялгаа хэлбэрээр гардаггүй. Англиар go to school (сурагчийн хувиар) ба go to the school (барилга руу) гэж артиклиар ялгана. Мөн «эмнэлэгт хэвтэх» = be in hospital, «эмнэлэг дээр очих» = go to the hospital.',
    ],
  },
  dialogue: [
    {
      en: 'Nomin, [I](s) [heard](v) [your brother](s) [is](v) [in hospital](m). [Is](v) [he](s) [OK](o)?',
      mn: 'Номин, дүү чинь эмнэлэгт хэвтсэн гэж сонслоо. Зүгээр үү?',
      speaker: 'Bat',
    },
    {
      en: '[He](s)[\'s](v) [much better](o), thanks. [I](s) [went](v) [to the hospital](m) [yesterday](m) [and](m) [the doctors](s) [were](v) [very positive](o).',
      mn: 'Хавьгүй дээрдсэн, баярлалаа. Би өчигдөр эмнэлэг дээр очсон, эмч нар нь их өөдрөг байсан.',
      speaker: 'Nomin',
    },
    {
      en: 'Good. [Health](s) [is](v) [the most important thing](o) [in life](m). [What](o) [does](v) [he](s) [do](v)?',
      mn: 'Сайн байна. Эрүүл мэнд бол амьдралд хамгийн чухал зүйл. Тэр юу хийдэг вэ?',
      speaker: 'Bat',
    },
    {
      en: '[He](s)[\'s](v) [a geologist](o). [He](s) [works](v) [in the Gobi](m) [and](m) [sometimes](m) [near Lake Khuvsgul](m).',
      mn: 'Тэр геологич. Говьд, заримдаа Хөвсгөл нуурын ойролцоо ажилладаг.',
      speaker: 'Nomin',
    },
    {
      en: '[That](s) [sounds](v) [hard](o). [The young](s) [usually prefer](v) [office jobs](o) [in the city](m).',
      mn: 'Хэцүү ажил юм шиг сонсогдож байна. Залуус ихэвчлэн хотод албан тасалгааны ажлыг илүүд үздэг.',
      speaker: 'Bat',
    },
    {
      en: 'Not him. [He](s) [loves](v) [nature](o), [and](m) [he](s) [says](v) [the silence of the desert](s) [is](v) [the best thing](o) [in the world](m).',
      mn: 'Тэр биш. Тэр байгальд хайртай, цөлийн нам гүм бол дэлхий дээрх хамгийн сайхан зүйл гэж хэлдэг.',
      speaker: 'Nomin',
    },
  ],
  quiz: [
    {
      id: 'b2-14-1',
      ruleId: 14,
      kind: 'fill',
      question: 'I think ___ patience is the most important quality in a teacher.',
      options: ['— (артикльгүй)', 'the', 'a', 'an'],
      answer: '— (артикльгүй)',
      explanation: 'patience бол хийсвэр, тоолж болохгүй нэр үг бөгөөд энд ерөнхий утгаар хэрэглэгдэж байна — артикльгүй. Тоолж болохгүй тул a / an авахгүй; the тавибал тодорхой нэг тэвчээрийг заасан болох бөгөөд of … зэрэг тодотгол шаардана.',
      hint: 'Хийсвэр нэр үг, ерөнхий утга.',
    },
    {
      id: 'b2-14-2',
      ruleId: 14,
      kind: 'fill',
      question: '___ unemployed often find it hard to get back into work.',
      options: ['The', 'An', 'A', '— (артикльгүй)'],
      answer: 'The',
      explanation: 'the + тэмдэг нэр = тухайн шинжтэй бүх хүн: the unemployed (ажилгүйчүүд). Үйл үг олон тоонд (find) байгаа нь бүлэг хүнийг зааж байгааг харуулна. Артикльгүй эсвэл a / an-тай тэмдэг нэр дангаараа эзэн болж чадахгүй.',
      hint: 'Бүлэг хүн = ? + тэмдэг нэр.',
    },
    {
      id: 'b2-14-3',
      ruleId: 14,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'The life is hard without the friends.',
        'She plays the violin in an orchestra.',
        'He climbed the Mount Everest last year.',
        'The Lake Baikal is the deepest lake in world.',
      ],
      answer: 'She plays the violin in an orchestra.',
      explanation: 'Хөгжмийн зэмсэг the авна (the violin), анх дурдаж буй ганц тооны нэр үг an (an orchestra) — зөв. Ерөнхий утгаар life, friends артикльгүй; Mount Everest, Lake Baikal артикльгүй; цор ганц зүйл the world.',
      hint: 'Хөгжмийн зэмсэг + the.',
    },
    {
      id: 'b2-14-4',
      ruleId: 14,
      kind: 'translate',
      question: 'Мөнгө аз жаргал авчирдаггүй.',
      options: [
        'Money doesn\'t bring happiness.',
        'The money doesn\'t bring the happiness.',
        'Money doesn\'t bring a happiness.',
        'A money doesn\'t bring happiness.',
      ],
      answer: 'Money doesn\'t bring happiness.',
      explanation: 'Мөнгө, аз жаргалын тухай ерөнхийд нь ярьж байна — тоолж болохгүй, хийсвэр нэр үг ерөнхий утгаар артикльгүй. the тавибал тодорхой мөнгө / аз жаргал болно; тоолж болохгүй нэр үг a авахгүй.',
      hint: 'Ерөнхий үнэн — артикльгүй.',
    },
  ],
};
