// frontend/src/lib/grammar/b1/rule-03.ts
// B1 дүрэм 3: used to / would / be used to
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule03: GrammarRule = {
  id: 3,
  title: 'used to / would / be used to',
  titleMn: 'used to / would / be used to — өнгөрсөн зуршил ба дасал',
  hook: '«Би багадаа өдөр бүр хөл бөмбөг тоглодог байсан, одоо тоглохоо больсон» — одоо байхгүй болсон өнгөрсөн зуршлыг хэлж, «дассан» гэдгээс нь ялгаж сурцгаая.',
  summary: 'used to + Verb1 нь өнгөрсөнд байнга байсан, одоо байхгүй болсон зуршил, төлөв байдлыг заана. would + Verb1 мөн өнгөрсөн давтагдсан үйлдлийг заах ч төлөв байдалд хэрэглэхгүй. be / get used to + Verb-ing бол огт өөр утгатай: «дассан, дасаж байгаа».',
  description: 'A2 түвшинд бид Past Simple-ээр өнгөрсөн үйлдлийг хэлж сурсан: I played football when I was young. Гэхдээ Past Simple нь энэ үйлдэл нэг удаа болсон уу, байнга болдог байсан уу, одоо болих болсон уу гэдгийг заадаггүй. used to яг үүнийг нэмж хэлнэ: I used to play football — өмнө нь тоглодог байсан, одоо тоглодоггүй. used to-ийн ард үйл үгийн үндсэн хэлбэр ирнэ, үгүйсгэл нь didn\'t use to, асуулт нь Did you use to …? гэж did-ээр үүсдэг. would + Verb1 мөн өнгөрсөн давтагдсан үйлдэлд хэрэглэдэг (Every summer we would visit my grandmother) боловч төлөв байдал (live, be, have, like) заасан үйл үгтэй хэрэглэдэггүй. Хамгийн их андуурдаг зүйл бол be used to + Verb-ing / нэр үг — энэ нь «-д дассан» гэсэн утгатай бөгөөд одоо, өнгөрсөн, ирээдүй аль ч цагт хэрэглэгддэг: I\'m used to getting up early — би эрт босоход дассан. get used to бол «дасах» гэсэн үйл явцыг заана. Монголоор «-даг байсан» (used to), «-д дассан» (be used to), «-д дасах» (get used to) гэж гурвууланг нь тодорхой ялгаж хэлдэг тул орчуулгаараа шалгаж болно.',
  structure: 'Subject + used to + Verb1 · Subject + be / get used to + Verb-ing / noun',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'used to', part: 'verb' },
    { text: 'Verb1', part: 'verb' },
    { text: '· be / get used to + Verb-ing', part: 'modifier' },
  ],
  tip: 'used to + V1 = «-даг байсан» (одоо үгүй) · be used to + V-ing = «-д дассан» · get used to + V-ing = «-д дасах». Ард нь V1 байна уу, V-ing байна уу гэдгээр ялгана.',
  examples: [
    { en: '[I](s) [used to play](v) [football](o) [every day](m), [but](m) [now](m) [I](s) [don\'t have](v) [time](o).', mn: 'Би өдөр бүр хөл бөмбөг тоглодог байсан, гэхдээ одоо цаг байхгүй.' },
    { en: '[She](s) [didn\'t use to like](v) [coffee](o).', mn: 'Тэр өмнө нь кофенд дургүй байсан.' },
    { en: '[Every winter](m) [we](s) [would go](v) [skating](o) [on the river](m).', mn: 'Өвөл бүр бид гол дээр тэшүүрээр гулгадаг байсан.' },
    { en: '[I](s)[\'m used to](v) [getting up early](o).', mn: 'Би эрт босоход дассан.' },
  ],
  useCases: [
    {
      title: 'Одоо байхгүй болсон өнгөрсөн зуршил — used to + V1',
      description: 'Өнгөрсөнд байнга, удаан хугацаанд хийдэг байсан, одоо хийхээ больсон үйлдэл. Монголоор «-даг байсан». Ихэвчлэн «but now …» гэж одоогийн байдалтай харьцуулдаг.',
      examples: [
        { en: '[He](s) [used to smoke](v), [but](m) [he](s) [stopped](v) [two years ago](m).', mn: 'Тэр тамхи татдаг байсан, гэхдээ хоёр жилийн өмнө больсон.' },
        { en: '[We](s) [used to go](v) [to the countryside](m) [every summer](m).', mn: 'Бид зун бүр хөдөө явдаг байсан.' },
        { en: '[I](s) [used to hate](v) [vegetables](o) [when I was a child](m).', mn: 'Би багадаа ногоонд дургүй байсан.' },
      ],
    },
    {
      title: 'Өнгөрсөн төлөв байдал — used to + be / live / have',
      description: 'used to нь зөвхөн үйлдэл биш, өнгөрсөн төлөв байдал (хаана амьдарч байсан, ямар байсан, юутай байсан) заахад бас хэрэглэнэ. Энэ тохиолдолд would хэрэглэж БОЛОХГҮЙ.',
      examples: [
        { en: '[There](s) [used to be](v) [a cinema](o) [here](m).', mn: 'Энд өмнө нь кинотеатр байдаг байсан.' },
        { en: '[She](s) [used to live](v) [in Darkhan](m).', mn: 'Тэр өмнө нь Дарханд амьдардаг байсан.' },
        { en: '[I](s) [used to have](v) [long hair](o).', mn: 'Би өмнө нь урт үстэй байсан.' },
      ],
    },
    {
      title: 'Өнгөрсөн давтагдсан үйлдэл — would + V1',
      description: 'Дурсамж ярихад, ялангуяа бичгийн болон уран яруу хэлэнд would хэрэглэнэ. Зөвхөн үйлдэлд (давтагддаг үйлдэл) хэрэглэнэ, төлөв байдалд хэрэглэхгүй. Ихэвчлэн өмнө нь цаг үеийг тогтоосон байдаг.',
      examples: [
        { en: '[When I was little](m), [my grandfather](s) [would tell](v) [me](o) [stories](o) [every night](m).', mn: 'Намайг багад өвөө маань орой бүр надад үлгэр ярьж өгдөг байсан.' },
        { en: '[On Sundays](m) [we](s) [would walk](v) [to the market](m) [together](m).', mn: 'Ням гаригуудад бид хамтдаа зах руу алхдаг байсан.' },
        { en: '[She](s) [would always bring](v) [us](o) [sweets](o).', mn: 'Тэр бидэнд үргэлж чихэр авчирдаг байсан.' },
      ],
    },
    {
      title: 'Дассан байх — be used to + V-ing / нэр үг',
      description: 'Огт өөр утга: ямар нэг зүйл нь одоо хэвийн, танил, хэцүү биш болсон гэсэн үг. Аль ч цагт хэрэглэнэ (am / was / will be used to). Ард нь V-ing эсвэл нэр үг ирнэ, V1 ирэхгүй.',
      examples: [
        { en: '[I](s)[\'m used to](v) [the cold weather](o). [I](s) [grew up](v) [in Mongolia](m).', mn: 'Би хүйтэн цаг агаарт дассан. Би Монголд өссөн.' },
        { en: '[She](s) [isn\'t used to](v) [driving](o) [on the left](m).', mn: 'Тэр зүүн талаараа машин жолоодоход дасаагүй.' },
        { en: '[He](s) [was used to](v) [working](o) [long hours](m).', mn: 'Тэр урт цагаар ажиллахад дассан байсан.' },
      ],
    },
    {
      title: 'Дасах үйл явц — get used to + V-ing / нэр үг',
      description: 'be used to «аль хэдийн дассан» гэдэг бол get used to нь «дасаж байгаа, дасах» гэсэн өөрчлөлтийн үйл явцыг заана. Шинэ орчин, шинэ ажил, шинэ орон нутгийн тухай ярихад их хэрэглэнэ.',
      examples: [
        { en: '[It](s) [took](v) [me](o) [a month](o) [to get used to the noise](m).', mn: 'Чимээ шуугианд дасахад надад нэг сар зарцуулагдсан.' },
        { en: '[You](s)[\'ll soon get used to](v) [the new system](o).', mn: 'Чи удахгүй шинэ системд дасна.' },
        { en: '[I](s)[\'m slowly getting used to](v) [living](o) [alone](m).', mn: 'Би ганцаараа амьдрахад аажмаар дасаж байна.' },
      ],
    },
  ],
  forms: [
    {
      label: 'used to — батлах / үгүйсгэх / асуух',
      structure: 'used to + V1 · didn\'t use to + V1 · Did + subject + use to + V1?',
      examples: [
        { en: '[I](s) [used to walk](v) [to school](m).', mn: 'Би сургууль руугаа алхдаг байсан.' },
        { en: '[They](s) [didn\'t use to have](v) [a car](o).', mn: 'Тэд өмнө нь машингүй байсан.' },
        { en: '[Did](v) [you](s) [use to live](v) [here](m)?', mn: 'Чи өмнө нь энд амьдардаг байсан уу?' },
      ],
    },
    {
      label: 'would — өнгөрсөн давтагдсан үйлдэл',
      structure: 'Subject + would (\'d) + V1 (зөвхөн үйлдэлд)',
      examples: [
        { en: '[Every morning](m) [he](s)[\'d make](v) [tea](o) [for everyone](m).', mn: 'Өглөө бүр тэр бүгдэд цай хийж өгдөг байсан.' },
        { en: '[We](s) [would spend](v) [hours](o) [by the river](m).', mn: 'Бид голын эрэг дээр олон цаг өнгөрөөдөг байсан.' },
        { en: '[My mother](s) [would sing](v) [while she cooked](m).', mn: 'Ээж маань хоол хийхдээ дуулдаг байсан.' },
      ],
    },
    {
      label: 'be used to — дассан',
      structure: 'am / is / are / was / were + used to + V-ing / noun',
      examples: [
        { en: '[I](s)[\'m used to](v) [spicy food](o).', mn: 'Би халуун ногоотой хоолонд дассан.' },
        { en: '[Are](v) [you](s) [used to](v) [the traffic](o) [yet](m)?', mn: 'Чи түгжрэлд дассан уу?' },
        { en: '[We](s) [weren\'t used to](v) [speaking](o) [English](o) [every day](m).', mn: 'Бид өдөр бүр англиар ярихад дасаагүй байсан.' },
      ],
    },
    {
      label: 'get used to — дасах',
      structure: 'get / got / will get / is getting + used to + V-ing / noun',
      examples: [
        { en: '[I](s) [got used to](v) [the cold](o) [quickly](m).', mn: 'Би хүйтэнд хурдан дассан.' },
        { en: '[She](s) [is getting used to](v) [her new job](o).', mn: 'Тэр шинэ ажилдаа дасаж байна.' },
        { en: '[You](s) [will get used to](v) [waking up](o) [early](m).', mn: 'Чи эрт сэрэхэд дасна.' },
      ],
    },
  ],
  signalWords: ['used to', 'didn\'t use to', 'would', 'be used to', 'get used to', 'when I was a child', 'but now', 'any more'],
  notes: [
    'used to зөвхөн өнгөрсөн цагт байдаг. «Одоо -даг» гэхийг used to-гоор хэлэхгүй — энгийн Present Simple хэрэглэнэ: I usually get up at 7 (I use to гэхгүй).',
    'Үгүйсгэл, асуултад d алга болно: didn\'t use to, Did you use to …? (didn\'t used to гэж бичих нь албан бус, шалгалтад алдаанд тооцно).',
    'would-ыг өнгөрсөн зуршилд хэрэглэхдээ өмнө нь цаг үеийг тогтоосон байх ёстой (When I was young, …). Тогтоогүй бол would нь нөхцөлт утгатай ойлгогдоно.',
    'would-ыг төлөв заасан үйл үгтэй (live, be, have, like, know) хэрэглэхгүй: I would live in Darkhan (буруу) → I used to live in Darkhan (зөв).',
    'be used to-гийн ард V1 ирэхгүй: I\'m used to get up early (буруу) → I\'m used to getting up early (зөв). Энэ used нь тэмдэг нэр, to нь угтвар үг тул ард нь нэр үг / -ing ирдэг.',
    'used to (зуршил) болон be used to (дассан) хоёрын дуудлага бараг адил ч утга огт өөр. Ялгааг ард нь орох үгийн хэлбэрээс (V1 / V-ing) хараарай.',
  ],
  commonMistakes: [
    {
      wrong: 'I use to play tennis every weekend now.',
      correct: 'I play tennis every weekend now.',
      explanation: 'used to зөвхөн өнгөрсөн зуршилд. Одоогийн зуршлыг энгийн Present Simple-ээр хэлнэ. Мөн use to гэсэн одоо цагийн хэлбэр байхгүй.',
    },
    {
      wrong: 'I\'m used to get up early.',
      correct: 'I\'m used to getting up early.',
      explanation: 'be used to-гийн ард V-ing ирнэ. Монголоор «эрт босоход дассан» гэсэн утга. used to get up гэвэл «эрт босдог байсан» (одоо босдоггүй) болж утга өөрчлөгдөнө.',
    },
    {
      wrong: 'When I was a child, I would live in the countryside.',
      correct: 'When I was a child, I used to live in the countryside.',
      explanation: 'live бол төлөв заасан үйл үг — would-той хэрэглэхгүй. Төлөв байдалд зөвхөн used to (эсвэл Past Simple) хэрэглэнэ.',
    },
    {
      wrong: 'Did you used to live in Erdenet?',
      correct: 'Did you use to live in Erdenet?',
      explanation: 'did-тэй асуулт, үгүйсгэлд үндсэн үйл үг V1 хэлбэрт ордог тул use to (d-гүй) байна.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «-даг байсан» (тоглодог байсан, амьдардаг байсан) нь used to-ийн утгыг яг өгдөг — өнгөрсөн зуршил, одоо байхгүй. Орчуулгад «-даг байсан» гарч байвал used to (эсвэл would) гэж таньж болно.',
      'Монголоор «-д дассан» (хүйтэнд дассан, эрт босоход дассан) нь be used to. «Дасах, дасаж байна» нь get used to. Энэ гурван монгол хэлбэр гурван англи бүтэцтэй нэг нэгээрээ таардаг тул монголоор бодоод сонгоход алдахгүй.',
      'Монголоор «-даг байсан» гэдэг хэлбэр төлөв байдалд ч (амьдардаг байсан), үйлдэлд ч (тоглодог байсан) адилхан. Англиар would зөвхөн үйлдэлд орно — «амьдардаг байсан» гэдгийг would live гэж хэлж болохгүй.',
      'Монголоор «би одоо ч гүйдэг» гэхэд «-даг» залгавар байгаа ч used to хэрэглэхгүй — учир нь used to зөвхөн ОДОО БОЛЬСОН зуршилд. «Одоо ч» гэсэн утга байвал Present Simple.',
    ],
  },
  dialogue: [
    {
      en: 'Bat, [did](v) [you](s) [use to live](v) [in the countryside](m)?',
      mn: 'Бат, чи өмнө нь хөдөө амьдардаг байсан уу?',
      speaker: 'Saraa',
    },
    {
      en: 'Yes, [until I was twelve](m). [We](s) [used to have](v) [horses](o), [and](m) [every morning](m) [I](s)[\'d ride](v) [to school](m).',
      mn: 'Тийм, арван хоёр нас хүртлээ. Бид морьтой байсан, өглөө бүр би морьтой сургууль руугаа явдаг байсан.',
      speaker: 'Bat',
    },
    {
      en: 'Wow! [Was](v) [it](s) [hard](o) [to move](m) [to the city](m)?',
      mn: 'Вау! Хот руу нүүх хэцүү байсан уу?',
      speaker: 'Saraa',
    },
    {
      en: 'At first, yes. [I](s) [wasn\'t used to](v) [the noise](o) [and](m) [the traffic](o).',
      mn: 'Эхэндээ тийм. Би чимээ шуугиан, түгжрэлд дасаагүй байсан.',
      speaker: 'Bat',
    },
    {
      en: '[And](m) [now](m)?',
      mn: 'Одоо яасан бэ?',
      speaker: 'Saraa',
    },
    {
      en: '[Now](m) [I](s)[\'m used to](v) [it](o). [But](m) [I](s) [still miss](v) [the countryside](o). [I](s) [don\'t ride](v) [horses](o) [any more](m).',
      mn: 'Одоо дассан. Гэхдээ хөдөөг санасаар л байдаг. Одоо морь унахаа больсон.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'b1-03-1',
      ruleId: 3,
      kind: 'fill',
      question: 'My father ___ smoke, but he stopped five years ago.',
      options: ['used to', 'is used to', 'uses to', 'gets used to'],
      answer: 'used to',
      explanation: 'Өмнө нь тамхи татдаг байсан, одоо больсон — өнгөрсөн зуршил. used to + V1. is used to гэвэл «тамхи татахад дассан» болж утга өөр, ард нь V-ing байх ёстой.',
      hint: '«-даг байсан, одоо больсон».',
    },
    {
      id: 'b1-03-2',
      ruleId: 3,
      kind: 'fill',
      question: 'I\'ve lived in Ulaanbaatar for years, so I ___ the cold winters.',
      options: ['used to', 'am used to', 'would', 'use to'],
      answer: 'am used to',
      explanation: 'Олон жил амьдарсан тул хүйтэн өвөлд «дассан» — be used to + нэр үг. used to гэвэл «хүйтэн өвөл байдаг байсан» гэсэн утгагүй өгүүлбэр болно.',
      hint: '«-д дассан» гэсэн утга.',
    },
    {
      id: 'b1-03-3',
      ruleId: 3,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'When I was a child, I would have a dog.',
        'I\'m used to drive on the right.',
        'She didn\'t use to like fish, but now she loves it.',
        'Did you used to play the piano?',
      ],
      answer: 'She didn\'t use to like fish, but now she loves it.',
      explanation: 'didn\'t use to + V1 зөв. would-ыг have (төлөв) үйл үгтэй хэрэглэхгүй; be used to-гийн ард V-ing (driving); Did-тэй асуултад use to (d-гүй).',
      hint: 'Үгүйсгэлд d алга болдог.',
    },
    {
      id: 'b1-03-4',
      ruleId: 3,
      kind: 'translate',
      question: 'Би шинэ ажилдаа аажмаар дасаж байна.',
      options: [
        'I\'m slowly getting used to my new job.',
        'I slowly used to my new job.',
        'I\'m slowly used to my new job.',
        'I would slowly get my new job.',
      ],
      answer: 'I\'m slowly getting used to my new job.',
      explanation: '«Дасаж байна» — дасах үйл явц үргэлжилж байгаа тул get used to-г одоо үргэлжлэх цагт: am getting used to. am used to гэвэл «аль хэдийн дассан» болно.',
      hint: '«Дасаж байна» = үйл явц, «дассан» = үр дүн.',
    },
  ],
};
