// frontend/src/lib/grammar/a2/rule-16.ts
// A2 дүрэм 16: Pronouns: object, possessive, indefinite
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule16: GrammarRule = {
  id: 16,
  title: 'Pronouns: object, possessive, indefinite',
  titleMn: 'Төлөөний үгс — тусагдахуун, эзэмшлийн, тодорхойгүй',
  hook: '«Намайг хараач. Энэ минийх. Хэн нэгэн залгасан» — me, mine, someone гэдгийг зөв газар нь тавьж чадаж байна уу?',
  summary: 'Үйл үг, угтвар үгийн ард эзэн төлөөний үг (I, he) биш тусагдахуун төлөөний үг (me, him) орно. mine, yours, hers гэх мэт эзэмшлийн төлөөний үг нэр үггүй дангаараа ордог бол someone, anything, everyone гэх мэт тодорхойгүй төлөөний үгс тодорхой бус хүн, юмыг заана.',
  description: 'А1-д бид I, you, he гэх мэт эзэн төлөөний үг болон my, your, his гэх мэт эзэмшил заах үгсийг үзсэн. Одоо төлөөний үгийн үлдсэн гурван бүлгийг сурна. Нэгдүгээрт, үйлдлийг хүлээн авч байгаа хүн, юмыг тусагдахуун төлөөний үгээр (me, you, him, her, it, us, them) хэлнэ; эдгээр нь үйл үгийн ард (She loves him) болон угтвар үгийн ард (with me, for them) ордог. Хоёрдугаарт, эзэмшлийн төлөөний үг (mine, yours, his, hers, ours, theirs) нь my book гэх мэт үгийн оронд нэр үггүйгээр дангаараа ордог: This book is mine. Гуравдугаарт, тодорхойгүй төлөөний үгс some-, any-, no-, every- угтвартай: someone, anything, nothing, everyone. Эдгээр нь some / any-гийн дүрмийг дагана — some- батлахад, any- үгүйсгэх, асуухад, no- нь батлах үйл үгтэй хамт үгүйсгэлийн утга илэрхийлнэ. Монголоор «намайг», «надад», «минийх» гэж нөхцөлөөр ялгадаг зүйлийг англиар өөр өөр үгээр хэлдэг тул хүснэгтийг бүхэлд нь цээжлэх нь хамгийн хялбар арга.',
  structure: 'Subject + verb + object pronoun · This is + possessive pronoun · some- / any- / no- / every- + one / thing / where',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'verb', part: 'verb' },
    { text: 'me / him / them', part: 'object' },
    { text: '·', part: 'plain' },
    { text: 'mine / yours / hers', part: 'object' },
    { text: '·', part: 'plain' },
    { text: 'someone / anything / nothing / everyone', part: 'object' },
  ],
  tip: 'Үйл үг, угтвар үгийн ард → me, him, them · Нэр үггүй «минийх» → mine · Батлах → some- · Үгүйсгэх, асуух → any- · «Юу ч байхгүй» нэг үгээр → nothing / no one (үйл үг батлах хэлбэртэй).',
  examples: [
    { en: '[Can](v) [you](s) [help](v) [me](o) [with this box](m)?', mn: 'Чи надад энэ хайрцгийг өргөлцөж өгөх үү?' },
    { en: '[This](s) [isn\'t](v) [my umbrella](o). [Mine](s) [is](v) [blue](o).', mn: 'Энэ миний шүхэр биш. Минийх цэнхэр.' },
    { en: '[Someone](s) [called](v) [you](o) [this morning](m).', mn: 'Өнөө өглөө хэн нэгэн чам руу залгасан.' },
    { en: '[I](s) [didn\'t buy](v) [anything](o) [at the market](m).', mn: 'Би захаас юу ч аваагүй.' },
  ],
  useCases: [
    {
      title: 'Үйл үгийн ард — тусагдахуун төлөөний үг',
      description: 'Үйлдэл хэн рүү чиглэж байгааг үйл үгийн ард тусагдахуун төлөөний үгээр хэлнэ. Эзэн төлөөний үг үйл үгийн ӨМНӨ, тусагдахуун төлөөний үг үйл үгийн АРД гэж санаарай: I → me, he → him, she → her, we → us, they → them.',
      examples: [
        { en: '[My parents](s) [visit](v) [us](o) [every Sunday](m).', mn: 'Аав ээж маань ням гараг бүр бидэн дээр ирдэг.' },
        { en: '[I](s) [saw](v) [them](o) [at the cinema](m) [yesterday](m).', mn: 'Би өчигдөр тэднийг кинотеатрт харсан.' },
        { en: '[Do](v) [you](s) [know](v) [her](o)?', mn: 'Чи түүнийг таних уу?' },
      ],
    },
    {
      title: 'Угтвар үгийн ард — with me, for him',
      description: 'to, for, with, about, from гэх мэт угтвар үгийн ард ч заавал тусагдахуун хэлбэр орно. Монголоор «надтай», «түүнд» гэж нөхцөл залгадаг бол англиар угтвар үг + me / him гэж хэлнэ.',
      examples: [
        { en: '[Come](v) [with me](m)!', mn: 'Надтай хамт яв!' },
        { en: '[This present](s) [is](v) [for him](m).', mn: 'Энэ бэлэг түүнд зориулагдсан.' },
        { en: '[She](s) [is talking](v) [about us](m).', mn: 'Тэр бидний тухай ярьж байна.' },
      ],
    },
    {
      title: 'Эзэмшлийн төлөөний үг — mine, yours, hers',
      description: 'Нэр үгээ давтахгүйн тулд my book-ийн оронд mine гэнэ. Эзэмшлийн төлөөний үгийн ард нэр үг ОРОХГҮЙ: «mine book» буруу. his хоёр үүрэгт адилхан (his car / it\'s his), харин her → hers, my → mine болж хувирна.',
      examples: [
        { en: '[Is](v) [this pen](s) [yours](o)? — [No](o), [it](s)[\'s](v) [hers](o).', mn: 'Энэ үзэг чинийх үү? — Үгүй, түүнийх.' },
        { en: '[Our flat](s) [is](v) [small](o), [but](m) [theirs](s) [is](v) [huge](o).', mn: 'Манай байр жижиг, харин тэднийх асар том.' },
        { en: '[A friend of mine](s) [lives](v) [in Japan](m).', mn: 'Миний нэг найз Японд амьдардаг.' },
      ],
    },
    {
      title: 'Тодорхойгүй хүн, юм — some- / any-',
      description: 'someone (somebody), something, somewhere батлах өгүүлбэр болон санал, хүсэлтийн асуултад; anyone (anybody), anything, anywhere үгүйсгэх өгүүлбэр, асуултад орно. Яг some / any-гийн дүрэм.',
      examples: [
        { en: '[There](s) [is](v) [something](o) [in my shoe](m).', mn: 'Миний гутлан дотор ямар нэг юм байна.' },
        { en: '[Is](v) [anyone](s) [at home](m)?', mn: 'Гэрт хэн нэгэн байна уу?' },
        { en: '[Let\'s go](v) [somewhere warm](m) [this winter](m).', mn: 'Энэ өвөл хаа нэг дулаан газар очицгооё.' },
      ],
    },
    {
      title: 'Хэн ч, юу ч, бүгд — no- / every-',
      description: 'no one (nobody), nothing, nowhere нь өөрөө үгүйсгэл тул үйл үг батлах хэлбэртэй байна: I have nothing = I don\'t have anything. everyone, everything, everywhere «бүгд» гэсэн утгатай боловч ганц тооны үйл үг авна: Everyone is here.',
      examples: [
        { en: '[Nobody](s) [answered](v) [the phone](o).', mn: 'Утсанд хэн ч хариулсангүй.' },
        { en: '[There](s) [is](v) [nothing](o) [in the fridge](m).', mn: 'Хөргөгчинд юу ч алга.' },
        { en: '[Everyone](s) [likes](v) [Saraa](o).', mn: 'Сараад бүгд дуртай.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Эзэн → тусагдахуун',
      structure: 'I → me · you → you · he → him · she → her · it → it · we → us · they → them',
      examples: [
        { en: '[He](s) [loves](v) [her](o), [and](m) [she](s) [loves](v) [him](o).', mn: 'Тэр түүнд хайртай, тэр ч бас түүнд хайртай.' },
        { en: '[Wait](v) [for us](m) [at the station](m).', mn: 'Буудал дээр биднийг хүлээгээрэй.' },
        { en: '[The teacher](s) [gave](v) [them](o) [some homework](o).', mn: 'Багш тэдэнд гэрийн даалгавар өгсөн.' },
      ],
    },
    {
      label: 'Эзэмшил заах үг → эзэмшлийн төлөөний үг',
      structure: 'my → mine · your → yours · his → his · her → hers · our → ours · their → theirs',
      examples: [
        { en: '[That](s) [is](v) [my seat](o). [This one](s) [is](v) [yours](o).', mn: 'Тэр миний суудал. Энэ чинийх.' },
        { en: '[Their garden](s) [is](v) [bigger](o) [than ours](m).', mn: 'Тэдний цэцэрлэг манайхаас том.' },
        { en: '[Whose phone](s) [is](v) [this](o)? — [It](s)[\'s](v) [mine](o).', mn: 'Энэ хэний утас вэ? — Минийх.' },
      ],
    },
    {
      label: 'some- / any- (батлах · үгүйсгэх, асуух)',
      structure: 'someone / something / somewhere · anyone / anything / anywhere',
      examples: [
        { en: '[Somebody](s) [left](v) [a bag](o) [on the bus](m).', mn: 'Хэн нэгэн автобусанд цүнхээ орхижээ.' },
        { en: '[I](s) [can\'t find](v) [my keys](o) [anywhere](m).', mn: 'Би түлхүүрээ хаанаас ч олохгүй байна.' },
        { en: '[Would](v) [you](s) [like](v) [something to drink](o)?', mn: 'Та ямар нэг юм уух уу?' },
      ],
    },
    {
      label: 'no- / every- (батлах үйл үгтэй)',
      structure: 'no one / nothing / nowhere · everyone / everything / everywhere + ганц тооны үйл үг',
      examples: [
        { en: '[No one](s) [knows](v) [the answer](o).', mn: 'Хариултыг хэн ч мэдэхгүй.' },
        { en: '[Everything](s) [is](v) [ready](o) [for the party](m).', mn: 'Үдэшлэгт бүх юм бэлэн болсон.' },
        { en: '[Everybody](s) [was](v) [tired](o) [after the trip](m).', mn: 'Аяллын дараа бүгд ядарсан байсан.' },
      ],
    },
  ],
  notes: [
    'Хүснэгт — эзэн / тусагдахуун / эзэмшил заах / эзэмшлийн: I / me / my / mine · you / you / your / yours · he / him / his / his · she / her / her / hers · it / it / its / — · we / us / our / ours · they / them / their / theirs.',
    'Хүснэгт — тодорхойгүй төлөөний үг: хүн — someone (somebody) / anyone (anybody) / no one (nobody) / everyone (everybody); юм — something / anything / nothing / everything; газар — somewhere / anywhere / nowhere / everywhere. -one ба -body хэлбэр ижил утгатай.',
    'you болон it эзэн, тусагдахуун хоёр үүрэгт адилхан; his эзэмшил заах үг, эзэмшлийн төлөөний үг хоёуланд нь адилхан. its-ийн эзэмшлийн төлөөний үг хэлбэр байхгүй. it\'s (= it is) болон its (түүний) хоёрыг андуурч болохгүй.',
    'Эзэмшлийн төлөөний үгэнд апостроф байхгүй: yours, hers, ours, theirs. «your\'s», «her\'s» гэж бичих нь алдаа.',
    'Тодорхойгүй төлөөний үгс бүгд ганц тооны үйл үг авна: Everyone is here. Nobody knows. Something smells good. Everyone гэдэг нь олон хүнийг заадаг ч үйл үг нь -s авна.',
    'Англи хэлэнд давхар үгүйсгэл байхгүй: «I don\'t know nothing» буруу. Эсвэл I don\'t know anything (any- + үгүйсгэх үйл үг), эсвэл I know nothing (no- + батлах үйл үг) гэж хэлнэ. Утга нь адил.',
  ],
  commonMistakes: [
    {
      wrong: 'She gave the book to I.',
      correct: 'She gave the book to me.',
      explanation: 'Угтвар үг (to, for, with)-ийн ард үргэлж тусагдахуун хэлбэр: me, him, them. I зөвхөн өгүүлбэрийн эзэн болно.',
    },
    {
      wrong: 'This is mine book.',
      correct: 'This is my book. / This book is mine.',
      explanation: 'mine-ийн ард нэр үг орохгүй. Нэр үг байвал my, нэр үггүй бол mine. Монголоор «минийх» гэж нэр үггүй хэлдэг байдал англиар mine.',
    },
    {
      wrong: 'I didn\'t see nobody at the park.',
      correct: 'I didn\'t see anybody at the park. / I saw nobody at the park.',
      explanation: 'Монголоор «хэнийг ч хараагүй» гэж давхар үгүйсгэдэг тул англиар ч давхарлах алдаа гардаг. Англиар нэг өгүүлбэрт нэг л үгүйсгэл: didn\'t + anybody эсвэл saw + nobody.',
    },
    {
      wrong: 'Everyone are happy today.',
      correct: 'Everyone is happy today.',
      explanation: 'everyone олон хүнийг заадаг ч дүрмийн хувьд ганц тоо тул is. Мөн everybody, everything, someone, nobody бүгд ганц тооны үйл үгтэй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «би» гэдэг үг «намайг», «надад», «надтай» гэж нөхцөл залгаж хувирдаг. Англиар эдгээр бүх хэлбэрийг me гэсэн нэг үгээр, харин утгыг угтвар үгээр ялгана: me, to me, with me. Эзэн бол I, бусад бүх тохиолдолд me гэж санаарай.',
      'Монголоор «минийх», «чинийх», «тэднийх» гэж «-х» залгаж эзэмшлийн төлөөний үг үүсгэдэг. Англиар мөн my → mine, your → yours гэж хувирдаг боловч his өөрчлөгдөхгүй, her → hers болдог онцлогтой. Хэлбэрүүдийг хостой нь цээжлээрэй.',
      'Монголоор «хэн ч ирээгүй», «юу ч аваагүй» гэж «ч» + үгүйсгэх үйл үгээр давхар үгүйсгэдэг. Англиар nobody, nothing өөрөө үгүйсгэл тул үйл үг батлах хэлбэртэй байна: Nobody came. Үгүйсгэх үйл үгтэй бол anybody, anything хэрэглэнэ.',
      'Монголоор «бүгд ирсэн», «хүн бүр мэднэ» гэхэд олон тоо, ганц тооны ялгаа үйл үгэнд мэдрэгдэхгүй. Англиар everyone, everybody, everything ганц тооны үйл үг авна: Everyone knows. Everything is ready. Утга нь олон боловч хэлбэр нь ганц гэдгийг санаарай.',
    ],
  },
  dialogue: [
    {
      en: 'Saraa, [is](v) [this jacket](s) [yours](o)? [Someone](s) [left](v) [it](o) [in the classroom](m).',
      mn: 'Сараа, энэ хүрэм чинийх үү? Хэн нэгэн ангид орхичихсон байна.',
      speaker: 'Bat',
    },
    {
      en: '[No](o), [it](s) [isn\'t](v) [mine](o). [Mine](s) [is](v) [black](o). [Maybe](m) [it](s)[\'s](v) [Dorj\'s](o)?',
      mn: 'Үгүй, минийх биш. Минийх хар. Магадгүй Доржийнх байх?',
      speaker: 'Saraa',
    },
    {
      en: '[I](s) [asked](v) [him](o), [but](m) [he](s) [said](v) [it](s) [isn\'t](v) [his](o).',
      mn: 'Би түүнээс асуусан, гэхдээ тэр өөрийнх биш гэсэн.',
      speaker: 'Bat',
    },
    {
      en: '[Is](v) [there](s) [anything](o) [in the pockets](m)?',
      mn: 'Халаасанд нь ямар нэг юм байна уу?',
      speaker: 'Saraa',
    },
    {
      en: '[Nothing](o). [Let\'s give](v) [it](o) [to the teacher](m). [She](s) [can ask](v) [everyone](o) [tomorrow](m).',
      mn: 'Юу ч алга. Багшид өгчихье. Тэр маргааш бүгдээс асууж болно.',
      speaker: 'Bat',
    },
    {
      en: 'Good idea. [Nobody](s) [wants](v) [to lose](v) [a warm jacket](o) [in winter](m)!',
      mn: 'Сайн санаа. Өвөл дулаан хүрмээ алдахыг хэн ч хүсэхгүй!',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-16-1',
      ruleId: 16,
      kind: 'fill',
      question: 'My grandmother lives far away, so we don\'t see ___ often.',
      options: ['she', 'her', 'hers', 'herself'],
      answer: 'her',
      explanation: 'see үйл үгийн ард тусагдахуун хэлбэр her орно. she зөвхөн эзэн болно; hers нь эзэмшлийн төлөөний үг («түүнийх»); herself энд утгын хувьд тохирохгүй.',
      hint: 'Үйл үгийн ард ямар хэлбэр орох вэ?',
    },
    {
      id: 'a2-16-2',
      ruleId: 16,
      kind: 'fill',
      question: 'I knocked on the door, but ___ answered.',
      options: ['anyone', 'someone', 'nobody', 'everyone'],
      answer: 'nobody',
      explanation: '«Хэн ч хариулсангүй» гэсэн утга, үйл үг батлах хэлбэртэй (answered) тул nobody. anyone үгүйсгэх үйл үгтэй хэрэгтэй (didn\'t answer); someone, everyone утгын хувьд but-тай зөрчилдөнө.',
      hint: 'but байна — хүлээсэн зүйл болсонгүй.',
    },
    {
      id: 'a2-16-3',
      ruleId: 16,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'This bag is my.',
        'This bag is mine.',
        'This bag is mine bag.',
        'This bag is me.',
      ],
      answer: 'This bag is mine.',
      explanation: 'Нэр үггүй «минийх» гэхэд mine. my-ийн ард заавал нэр үг байх ёстой; mine-ийн ард нэр үг орохгүй; me бол тусагдахуун төлөөний үг, эзэмшил заахгүй.',
      hint: 'Ард нь нэр үг байхгүй бол аль хэлбэр вэ?',
    },
    {
      id: 'a2-16-4',
      ruleId: 16,
      kind: 'translate',
      question: 'Би захаас юу ч аваагүй.',
      options: [
        'I didn\'t buy nothing at the market.',
        'I didn\'t buy anything at the market.',
        'I didn\'t buy something at the market.',
        'I bought anything at the market.',
      ],
      answer: 'I didn\'t buy anything at the market.',
      explanation: 'Үгүйсгэх үйл үг didn\'t-тэй any- хэрэглэнэ. didn\'t + nothing давхар үгүйсгэл тул буруу; something батлах өгүүлбэрт; bought anything гэвэл үгүйсгэл алга болно.',
      hint: 'Нэг өгүүлбэрт нэг л үгүйсгэл.',
    },
  ],
};
