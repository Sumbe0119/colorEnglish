// frontend/src/lib/grammar/b1/rule-12.ts
// B1 дүрэм 12: Indirect questions & question tags
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule12: GrammarRule = {
  id: 12,
  title: 'Indirect questions & question tags',
  titleMn: 'Эелдэг шууд бус асуулт ба асуултын сүүл — Could you tell me …? / …, isn\'t it?',
  hook: '«Банк хаана байдгийг хэлж өгөхгүй юу?», «Өнөөдөр дулаахан байна, тийм үү?» — эелдэг асуулт асууж, батлуулж сурцгаая.',
  summary: 'Шууд бус асуулт (Could you tell me where the bank is?) нь энгийн асуултаас илүү эелдэг бөгөөд эхлэл хэллэгийн ард энгийн өгүүлбэрийн дараалал (эзэн + үйл үг) ирнэ, do/does/did алга болно. Асуултын сүүл (You\'re Mongolian, aren\'t you?) нь мэдэгдлийн төгсгөлд туслах үйл үг + төлөөний үг нэмж батлуулах, зөвшөөрөл асуух арга.',
  description: 'A1-д бид энгийн асуултыг (Where is the bank? Do you like tea?) үзсэн. Эдгээр нь зөв боловч танихгүй хүнээс, албан газарт асуухад шууд, бүр бүдүүлэг сонсогдож болно. B1-д хоёр илүү боловсронгуй бүтэц үзнэ. Нэгдүгээрт, ШУУД БУС АСУУЛТ: Could you tell me …?, Do you know …?, I\'d like to know …, I wonder … гэсэн эелдэг эхлэлийн ард асуултаа залгана. Гэхдээ өмнөх дүрэмд үзсэн reported questions-тэй адил ард нь асуултын дараалал БИШ, энгийн дараалал ирнэ: Could you tell me where the bank IS? (where is the bank биш). Yes/No асуултад if / whether нэмнэ: Do you know if the shop is open? Цаг ухраахгүй — энэ шууд бус яриа биш, одоогийн эелдэг асуулт. Хоёрдугаарт, АСУУЛТЫН СҮҮЛ (question tag): мэдэгдлийн ард богино асуулт нэмж «тийм үү?», «биз дээ?» гэж батлуулна. Дүрэм: батлах өгүүлбэрт үгүйсгэсэн сүүл (You\'re tired, aren\'t you?), үгүйсгэсэн өгүүлбэрт батлах сүүл (You aren\'t tired, are you?). Сүүлд өгүүлбэрийн туслах үйл үгийг (be, do, have, will, can) давтана. Монголоор «тийм үү», «биз дээ», «биш үү» гэсэн нэг л сүүл бүх өгүүлбэрт ордог бол англиар туслах үйл үг, төлөөний үг, батлах/үгүйсгэх бүгд өгүүлбэрээ дагаж өөрчлөгддөг тул тусгайлан сурна.',
  structure: 'Could you tell me + wh-word / if + subject + verb? · Statement, + auxiliary (+ not) + pronoun?',
  structureParts: [
    { text: 'Could you tell me', part: 'verb' },
    { text: 'where / if', part: 'modifier' },
    { text: 'the bank is', part: 'plain' },
    { text: '· …, isn\'t it?', part: 'modifier' },
  ],
  tip: 'Шууд бус асуулт: эелдэг эхлэл + асуух үг / if + ЭНГИЙН дараалал, do/did алга. Асуултын сүүл: батлах → үгүйсгэсэн сүүл, үгүйсгэх → батлах сүүл, туслах үйл үгээ давт.',
  examples: [
    { en: '[Could](v) [you](s) [tell](v) [me](o) [where the station is](o)?', mn: 'Буудал хаана байдгийг надад хэлж өгөхгүй юу?' },
    { en: '[Do](v) [you](s) [know](v) [if this bus goes to the airport](o)?', mn: 'Энэ автобус нисэх буудал руу явдаг эсэхийг та мэдэх үү?' },
    { en: '[You](s)[\'re](v) [from Mongolia](m), [aren\'t you](v)?', mn: 'Та Монголоос ирсэн, тийм үү?' },
    { en: '[She](s) [doesn\'t like](v) [coffee](o), [does she](v)?', mn: 'Тэр кофенд дургүй, тийм үү?' },
  ],
  useCases: [
    {
      title: 'Шууд бус асуулт — Wh- асуулт',
      description: 'Could you tell me, Do you know, I\'d like to know, I wonder, Can you tell me зэрэг эхлэлийн ард асуух үг + энгийн дараалал. Танихгүй хүнээс зам асуух, албан газарт мэдээлэл авахад хамгийн тохиромжтой.',
      examples: [
        { en: '[Could](v) [you](s) [tell](v) [me](o) [what time the bank opens](o)?', mn: 'Банк хэдэн цагт нээгддэгийг хэлж өгөхгүй юу?' },
        { en: '[Do](v) [you](s) [know](v) [how much this costs](o)?', mn: 'Энэ ямар үнэтэйг та мэдэх үү?' },
        { en: '[I](s) [wonder](v) [why she left so early](o).', mn: 'Тэр яагаад ийм эрт явсан юм бол гэж би гайхаж байна.' },
      ],
    },
    {
      title: 'Шууд бус асуулт — Yes / No асуулт',
      description: 'Асуух үг байхгүй асуултад if эсвэл whether нэмнэ. Дараа нь мөн л энгийн дараалал. Эцэст нь асуултын тэмдэг тавина (эхлэл нь асуулт бол), I wonder бол цэг.',
      examples: [
        { en: '[Do](v) [you](s) [know](v) [if there\'s a pharmacy near here](o)?', mn: 'Энд ойрхон эмийн сан байгаа эсэхийг та мэдэх үү?' },
        { en: '[Could](v) [you](s) [tell](v) [me](o) [whether the museum is open on Mondays](o)?', mn: 'Музей даваа гаригт нээлттэй байдаг эсэхийг хэлж өгөхгүй юу?' },
        { en: '[I](s)[\'d like to know](v) [if you have any rooms available](o).', mn: 'Танайд сул өрөө байгаа эсэхийг мэдмээр байна.' },
      ],
    },
    {
      title: 'Шууд асуулт vs шууд бус асуулт — дараалал өөрчлөгдөнө',
      description: 'A1-ийн шууд асуулттай харьцуулбал: асуултын дараалал (is the bank, does it cost) энгийн дараалал (the bank is, it costs) болно, do/does/did алга болж үндсэн үйл үг цагаа авна. Reported questions-ээс ялгаа нь цаг ухрахгүй.',
      examples: [
        { en: '[Where](m) [is](v) [the toilet](s)? → [Could](v) [you](s) [tell](v) [me](o) [where the toilet is](o)?', mn: 'Бие засах газар хаана байна? → Бие засах газар хаана байдгийг хэлж өгөхгүй юу?' },
        { en: '[What time](m) [does](v) [it](s) [close](v)? → [Do](v) [you](s) [know](v) [what time it closes](o)?', mn: 'Хэдэн цагт хаадаг вэ? → Хэдэн цагт хаадгийг та мэдэх үү?' },
        { en: '[Did](v) [he](s) [call](v)? → [Do](v) [you](s) [know](v) [if he called](o)?', mn: 'Тэр залгасан уу? → Тэр залгасан эсэхийг чи мэдэх үү?' },
      ],
    },
    {
      title: 'Асуултын сүүл — батлах өгүүлбэрт үгүйсгэсэн сүүл',
      description: 'Мэдэгдэл батлах хэлбэртэй бол сүүл нь үгүйсгэсэн: is → isn\'t, do → don\'t, can → can\'t, will → won\'t, have → haven\'t. Эзнийг төлөөний үгээр давтана. «Тийм үү?», «биз дээ?» гэсэн утга.',
      examples: [
        { en: '[It](s)[\'s](v) [a beautiful day](o), [isn\'t it](v)?', mn: 'Сайхан өдөр байна, тийм үү?' },
        { en: '[You](s) [live](v) [in Ulaanbaatar](m), [don\'t you](v)?', mn: 'Чи Улаанбаатарт амьдардаг, тийм үү?' },
        { en: '[Bat](s) [can speak](v) [Korean](o), [can\'t he](v)?', mn: 'Бат солонгосоор ярьж чадна, тийм үү?' },
      ],
    },
    {
      title: 'Асуултын сүүл — үгүйсгэсэн өгүүлбэрт батлах сүүл',
      description: 'Мэдэгдэл үгүйсгэсэн бол сүүл нь батлах: isn\'t → is, don\'t → do, can\'t → can, haven\'t → have. Мөн never, nobody, hardly зэрэг үгүйсгэх утгатай үг байвал өгүүлбэрийг үгүйсгэсэнд тооцно.',
      examples: [
        { en: '[You](s) [haven\'t seen](v) [my keys](o), [have you](v)?', mn: 'Чи миний түлхүүрийг хараагүй биз?' },
        { en: '[She](s) [isn\'t coming](v), [is she](v)?', mn: 'Тэр ирэхгүй, тийм үү?' },
        { en: '[He](s) [never eats](v) [meat](o), [does he](v)?', mn: 'Тэр мах хэзээ ч иддэггүй, тийм үү?' },
      ],
    },
  ],
  forms: [
    {
      label: 'Шууд бус асуултын эхлэлүүд',
      structure: 'Could you tell me … · Do you know … · Can you tell me … · I\'d like to know … · I wonder … · Do you have any idea …',
      examples: [
        { en: '[Can](v) [you](s) [tell](v) [me](o) [where I can buy a SIM card](o)?', mn: 'Хаанаас SIM карт авч болохыг хэлж өгөхгүй юу?' },
        { en: '[Do](v) [you](s) [have any idea](v) [when the next train leaves](o)?', mn: 'Дараагийн галт тэрэг хэзээ хөдлөхийг та мэдэх үү?' },
        { en: '[I](s) [wonder](v) [if you could help me](o).', mn: 'Та надад тусалж чадах болов уу.' },
      ],
    },
    {
      label: 'Асуултын сүүл — be, do, have, модаль',
      structure: 'am → aren\'t I · is → isn\'t · was → wasn\'t · do/does → don\'t/doesn\'t · did → didn\'t · have → haven\'t · will → won\'t · can → can\'t · should → shouldn\'t',
      examples: [
        { en: '[They](s) [were](v) [late](o), [weren\'t they](v)?', mn: 'Тэд хоцорсон, тийм үү?' },
        { en: '[She](s) [has finished](v), [hasn\'t she](v)?', mn: 'Тэр дуусгасан, тийм үү?' },
        { en: '[You](s)[\'ll help](v) [me](o), [won\'t you](v)?', mn: 'Чи надад туслана, тийм үү?' },
      ],
    },
    {
      label: 'Асуултын сүүл — онцгой тохиолдол',
      structure: 'I am … , aren\'t I? · Let\'s …, shall we? · Захирах хэлбэр, will you? · There is …, isn\'t there?',
      examples: [
        { en: '[I](s)[\'m](v) [right](o), [aren\'t I](v)?', mn: 'Би зөв байна, тийм үү?' },
        { en: '[Let\'s go](v) [for a walk](m), [shall we](v)?', mn: 'Зугаалаад ирье, за юу?' },
        { en: '[Open](v) [the window](o), [will you](v)? [There](s)[\'s](v) [a problem](o), [isn\'t there](v)?', mn: 'Цонхоо нээгээч, за юу? Асуудал байна, тийм үү?' },
      ],
    },
    {
      label: 'Асуултын сүүлд хариулах',
      structure: 'Мэдэгдэл үнэн бол туслах үйл үгээр батална, худал бол үгүйсгэнэ (сүүл ямар ч байсан)',
      examples: [
        { en: '[You](s)[\'re](v) [a student](o), [aren\'t you](v)? — Yes, [I](s) [am](v).', mn: 'Чи оюутан, тийм үү? — Тийм, оюутан.' },
        { en: '[You](s) [don\'t smoke](v), [do you](v)? — No, [I](s) [don\'t](v).', mn: 'Чи тамхи татдаггүй, тийм үү? — Тийм, татдаггүй.' },
        { en: '[She](s) [isn\'t](v) [here](m), [is she](v)? — Yes, [she](s) [is](v). [She](s)[\'s](v) [in the kitchen](m).', mn: 'Тэр энд байхгүй, тийм үү? — Байгаа. Гал тогоонд байна.' },
      ],
    },
  ],
  signalWords: ['Could you tell me', 'Do you know', 'I wonder', 'if', 'whether', 'isn\'t it?', 'don\'t you?', 'aren\'t I?', 'shall we?'],
  notes: [
    'Шууд бус асуултад цаг ухраахгүй (reported speech-ээс ялгаатай): Do you know where she IS? (was биш). Учир нь одоо асууж байгаа эелдэг асуулт.',
    'Шууд бус асуултын төгсгөлийн тэмдэг эхлэлээс хамаарна: Could you tell me …? (асуулт → ?), I wonder … (мэдэгдэл → цэг), I\'d like to know … (цэг).',
    'Асуултын сүүлд эзнийг заавал төлөөний үгээр давтана: Bat is late, isn\'t he? (isn\'t Bat биш). this / that → it, these / those → they.',
    'I am-ын сүүл нь aren\'t I (amn\'t I гэж байхгүй). Let\'s-ийн сүүл shall we. Захирах хэлбэрийн сүүл will you / would you / could you.',
    'Аялга чухал: сүүлийг уруу аялгаар хэлбэл батлуулж байна (хариулт мэдэж байна), өөд аялгаар хэлбэл жинхэнэ асуулт (мэдэхгүй байна).',
    'Хариулахдаа сүүлийг биш, мэдэгдлийг харна. You don\'t like it, do you? — үнэхээр дургүй бол No, I don\'t. Монголоор «тийм, дургүй» гэдэг ч англиар No.',
  ],
  commonMistakes: [
    {
      wrong: 'Could you tell me where is the bank?',
      correct: 'Could you tell me where the bank is?',
      explanation: 'Шууд бус асуултад энгийн дараалал: the bank is. Эхлэл (Could you tell me) аль хэдийн асуултын дараалалтай тул дотоод хэсэг энгийн байна.',
    },
    {
      wrong: 'Do you know what time does the shop open?',
      correct: 'Do you know what time the shop opens?',
      explanation: 'does алга болж, үндсэн үйл үг өөрөө -s авна: the shop opens. Хоёр асуулт нэг өгүүлбэрт давхардахгүй.',
    },
    {
      wrong: 'You like sushi, isn\'t it?',
      correct: 'You like sushi, don\'t you?',
      explanation: 'Сүүл нь өгүүлбэрийн туслах үйл үгийг давтана. like бол Present Simple → do/don\'t. isn\'t it зөвхөн It is … өгүүлбэрт. Монголоор «тийм үү» нэг л хэлбэртэй тул isn\'t it-ийг бүх газар тавих алдаа гардаг.',
    },
    {
      wrong: 'She can swim, can\'t Saraa?',
      correct: 'She can swim, can\'t she?',
      explanation: 'Сүүлд төлөөний үг (she) хэрэглэнэ, нэр (Saraa) биш. Мэдэгдэлд нэр байсан ч сүүлд төлөөний үг болгоно: Saraa can swim, can\'t she?',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор эелдэг асуулт «-ыг хэлж өгөхгүй юу», «-ыг мэдэх үү» гэж хэлдэг нь Could you tell me … / Do you know …-тэй яг таардаг. Ялгаа нь монголд дотоод асуултын дараалал өөрчлөгддөггүй (учир нь монголд асуулт дараалал өөрчилдөггүй), англиар энгийн дараалал болдог.',
      'Монголоор «эсэхийг» = if / whether. «Нээлттэй эсэхийг мэдэх үү» = Do you know if it\'s open. Монгол хэлний «эсэх» нь энэ бүтцийг ойлгоход маш их тусална.',
      'Монголоор асуултын сүүл «тийм үү», «биз дээ», «биш үү» гэсэн цөөн хэлбэртэй бөгөөд өгүүлбэрээс хамаардаггүй. Англиар сүүл нь туслах үйл үг (is / do / can / have), төлөөний үг (he / she / they), батлах / үгүйсгэх бүгдээрээ өгүүлбэрээ дагадаг. Тиймээс isn\'t it-ийг «тийм үү» гэж бүх газар тавьж болохгүй.',
      'Монголоор үгүйсгэсэн асуултад «тийм, дургүй» гэж баталгаажуулдаг бол англиар No, I don\'t гэж баримтын дагуу хариулна. Хариулт нь сүүлд биш, бодит байдалд тохирдог гэдгийг санаарай.',
    ],
  },
  dialogue: [
    {
      en: 'Excuse me, [could](v) [you](s) [tell](v) [me](o) [where the nearest bank is](o)?',
      mn: 'Уучлаарай, хамгийн ойрын банк хаана байдгийг хэлж өгөхгүй юу?',
      speaker: 'Saraa',
    },
    {
      en: 'Sure. [It](s)[\'s](v) [on Peace Avenue](m), [next to the post office](m). [You](s)[\'re](v) [not from here](m), [are you](v)?',
      mn: 'Мэдээж. Энхтайваны өргөн чөлөөнд, шуудангийн хажууд байгаа. Та энд байдаггүй хүн, тийм үү?',
      speaker: 'Bat',
    },
    {
      en: 'No, [I](s)[\'m](v) [visiting](v) [from Darkhan](m). [Do](v) [you](s) [know](v) [if it\'s open on Saturdays](o)?',
      mn: 'Үгүй, би Дарханаас ирсэн зочин. Бямба гарагт нээлттэй байдаг эсэхийг та мэдэх үү?',
      speaker: 'Saraa',
    },
    {
      en: '[I](s) [think](v) [it closes at one on Saturdays](o). [It](s)[\'s](v) [almost twelve](o) [now](m), [isn\'t it](v)?',
      mn: 'Бямба гарагт нэг цагт хаадаг гэж бодож байна. Одоо арван хоёр болох дөхөж байна, тийм үү?',
      speaker: 'Bat',
    },
    {
      en: 'Yes, [it](s) [is](v). [Could](v) [you](s) [tell](v) [me](o) [how long it takes to walk there](o)?',
      mn: 'Тийм. Тийшээ алхахад хэр удах вэ гэдгийг хэлж өгөхгүй юу?',
      speaker: 'Saraa',
    },
    {
      en: '[About ten minutes](m). [You](s) [can make](v) [it](o), [can\'t you](v)? [Just hurry](v)!',
      mn: 'Арав орчим минут. Амжина, тийм үү? Зүгээр л яараарай!',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'b1-12-1',
      ruleId: 12,
      kind: 'fill',
      question: 'Could you tell me ___?',
      options: ['where is the station', 'where the station is', 'where does the station', 'the station where is'],
      answer: 'where the station is',
      explanation: 'Шууд бус асуултад асуух үгийн ард энгийн дараалал: the station is. Асуултын дараалал (is the station) эхлэлд аль хэдийн байгаа тул давхардахгүй.',
      hint: 'Эзэн + үйл үг гэсэн дараалал.',
    },
    {
      id: 'b1-12-2',
      ruleId: 12,
      kind: 'fill',
      question: 'You\'ve been to London, ___?',
      options: ['isn\'t it', 'haven\'t you', 'didn\'t you', 'aren\'t you'],
      answer: 'haven\'t you',
      explanation: 'Мэдэгдэлд have (Present Perfect) байгаа тул сүүлд haven\'t + you. Батлах өгүүлбэр → үгүйсгэсэн сүүл. isn\'t it зөвхөн it is-тэй.',
      hint: 'Туслах үйл үг нь юу вэ?',
    },
    {
      id: 'b1-12-3',
      ruleId: 12,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Do you know if does the shop open on Sunday?',
        'She doesn\'t eat meat, doesn\'t she?',
        'I\'m late, aren\'t I?',
        'Let\'s go home, will we?',
      ],
      answer: 'I\'m late, aren\'t I?',
      explanation: 'I am-ын сүүл aren\'t I — зөв. if-ийн ард does байхгүй (if the shop opens); үгүйсгэсэн өгүүлбэрт батлах сүүл (does she); Let\'s-ийн сүүл shall we.',
      hint: 'I am-ын онцгой сүүл.',
    },
    {
      id: 'b1-12-4',
      ruleId: 12,
      kind: 'translate',
      question: 'Энэ автобус төв рүү явдаг эсэхийг та мэдэх үү?',
      options: [
        'Do you know if this bus goes to the centre?',
        'Do you know does this bus go to the centre?',
        'Do you know that this bus goes to the centre?',
        'Do you know if goes this bus to the centre?',
      ],
      answer: 'Do you know if this bus goes to the centre?',
      explanation: '«Эсэхийг» = if, дараа нь энгийн дараалал this bus goes. that нь Yes/No асуултад хэрэглэгдэхгүй, does давхардахгүй.',
      hint: '«Эсэх» = if + эзэн + үйл үг.',
    },
  ],
};
