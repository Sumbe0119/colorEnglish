// frontend/src/lib/grammar/c1/rule-03.ts
// C1 дүрэм 3: Advanced conditionals — but for / if it weren't for / supposing / otherwise
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule03: GrammarRule = {
  id: 3,
  title: 'Advanced conditionals: but for / if it weren\'t for / supposing / otherwise',
  titleMn: 'Нөхцөлийн нарийн хэлбэрүүд — but for, provided, supposing, otherwise',
  hook: '«Чиний тусламж байгаагүй бол …», «… гэж бодъё», «эс тэгвээс …» — энгийн if-ээс гадна нөхцөл илэрхийлдэг олон нарийн хэрэгслийг эзэмшицгээе.',
  summary: 'if … were to нь магадлал багатай ирээдүйг; if it weren\'t for / if it hadn\'t been for / but for + нэр үг нь «…байгаагүй бол» гэдгийг; provided (that) / providing / on condition that нь «зөвхөн … нөхцөлтэйгээр» гэдгийг; supposing нь «…гэж бодъё» гэсэн төсөөллийг; otherwise / or else нь «эс тэгвээс» гэдгийг илэрхийлнэ. if … should / happen to нь «санамсаргүй тэгвэл», if + will / would нь ирээдүй цаг биш, харин зөвшөөрөл, эелдэг хүсэлтийг заана.',
  description: 'B1-ийн 5, 6-р дүрэмд Second ба Third conditional, 14-р дүрэмд unless / as long as / in case, B2-ийн 3-р дүрэмд mixed conditionals, 12-р дүрэмд suppose / what if-ийг үзсэн. Тэдгээр нь нөхцөлийн «араг яс» байсан бол энэ дүрэм түүн дээр өнгө, нарийн ялгаа нэмнэ. Цагийн дүрэм огт өөрчлөгдөхгүй: provided, on condition that-ийн ард ирээдүйн утгаар Present Simple (will биш), supposing-ийн ард бодит боломжид Present, төсөөлөлд Past, өнгөрсөнд Past Perfect; but for ба if it weren\'t for-ийн үндсэн хэсэгт would / would have. Шинэ зүйл нь утгын нарийн ялгаа: were to нь «болох магадлал бага» гэж зай барина, provided that нь энгийн if-ээс хатуу болзол тавина, but for нь нэг ганц нэр үгээр бүхэл нөхцөлийг орлоно. Өнгө аясын хувьд but for, on condition that, were to нь албан ёсны, бичгийн хэлний; or else, supposing, if you happen to нь ярианы. C1-ийн 2-р дүрэмд үзсэн Were it not for … / Had it not been for … бол if it weren\'t for / if it hadn\'t been for-ийн inverted хувилбар юм. Монгол хэлэнд эдгээр утга «…байгаагүй бол», «нөхцөлтэйгээр», «гэж бодъё», «эс тэгвээс», «үгүй бол» гэсэн бэлэн үгтэй тул утгыг ойлгоход амархан; хэцүү нь бүтэц — but for-ийн ард зөвхөн нэр үг ордог, provided-ийн ард will ордоггүй, одоо ба өнгөрснийг weren\'t / hadn\'t been-ээр ялгадаг гэдгийг мартдаг.',
  structure: 'If + subject + were to + V1, … would + V1 · If it weren\'t for / hadn\'t been for + noun · But for + noun, … would (have) · provided (that) / on condition that + Present · Supposing + clause · …; otherwise / or else + clause',
  structureParts: [
    { text: 'But for / If it weren\'t for', part: 'modifier' },
    { text: 'noun', part: 'object' },
    { text: ', subject', part: 'subject' },
    { text: 'would (have) + verb', part: 'verb' },
  ],
  tip: 'were to = магадлал багатай ирээдүй · but for / if it weren\'t for + нэр үг = «…байгаагүй бол» · provided (that) = «зөвхөн … бол» · supposing = «…гэж бодъё» · otherwise / or else = «эс тэгвээс» · if you will / would = «та … -аад өгвөл» (эелдэг хүсэлт).',
  examples: [
    { en: '[If the company were to close](m), [hundreds of people](s) [would lose](v) [their jobs](o).', mn: 'Хэрэв компани хаагдвал олон зуун хүн ажилгүй болох байсан.' },
    { en: '[But for your advice](m), [I](s) [would have made](v) [a terrible mistake](o).', mn: 'Чиний зөвлөгөө байгаагүй бол би аймшигтай алдаа гаргах байсан.' },
    { en: '[If it weren\'t for the traffic](m), [I](s) [would cycle](v) [to work](m).', mn: 'Замын хөдөлгөөн ийм их биш байсан бол би ажилдаа дугуйгаар явах байсан.' },
    { en: '[You](s) [can borrow](v) [the car](o) [provided that you bring it back by six](m).', mn: 'Зургаан цаг гэхэд буцааж авчрах нөхцөлтэйгээр чи машиныг авч болно.' },
  ],
  useCases: [
    {
      title: 'if … were to — магадлал багатай ирээдүй',
      description: 'Second conditional-ын if + Past Simple-ийг were to + V1 болговол үйлдэл «болох магадлал бага, зөвхөн таамаг» гэсэн өнгөтэй болно. Эмзэг санал, асуултыг зөөлрүүлэхэд ч тохиромжтой. Үндсэн хэсэгт would / could / might.',
      examples: [
        { en: '[If the river were to flood](m), [the whole village](s) [would have to be evacuated](v).', mn: 'Хэрэв гол үерлэвэл тосгоныг бүхэлд нь нүүлгэн шилжүүлэх хэрэгтэй болно.' },
        { en: '[If I were to offer you the job](m), [when](m) [could](v) [you](s) [start](v)?', mn: 'Хэрэв би танд энэ ажлыг санал болговол та хэзээнээс эхэлж чадах вэ?' },
        { en: '[What](o) [would](v) [you](s) [say](v) [if he were to ask you to marry him](m)?', mn: 'Хэрэв тэр чамд гэрлэх санал тавибал чи юу гэж хэлэх вэ?' },
      ],
    },
    {
      title: 'if it weren\'t for / if it hadn\'t been for / but for — «…байгаагүй бол»',
      description: 'Нэг хүн, зүйл, нөхцөл байдал л үр дүнг өөрчилж байгааг онцолно. Одоогийн тухай бол if it weren\'t for, өнгөрсний тухай бол if it hadn\'t been for. but for нь хоёуланг нь орлодог албан ёсны хувилбар. Гурвуулангийнх нь ард нэр үг (эсвэл төлөөний үг, -ing) орно.',
      examples: [
        { en: '[If it weren\'t for my children](m), [I](s) [would travel](v) [much more](m).', mn: 'Хүүхдүүд минь байгаагүй бол би хамаагүй их аялах байсан.' },
        { en: '[If it hadn\'t been for the fog](m), [the plane](s) [would have landed](v) [on time](m).', mn: 'Манан байгаагүй бол онгоц цагтаа газардах байсан.' },
        { en: '[But for the goalkeeper](m), [we](s) [would have lost](v) [by five goals](m).', mn: 'Хаалгач байгаагүй бол бид таван голын зөрүүтэй хожигдох байсан.' },
      ],
    },
    {
      title: 'provided / providing (that), on condition that — болзол тавих',
      description: '«Зөвхөн энэ нөхцөл биелсэн тохиолдолд л» гэсэн утгатай, энгийн if-ээс хатуу. Зөвшөөрөл, гэрээ, тохиролцоонд хэрэглэнэ. Ард нь ирээдүйн утгаар Present Simple (will биш); үндсэн үйл үг өнгөрсөн бол Past Simple.',
      examples: [
        { en: '[You](s) [can take](v) [photos](o) [provided you don\'t use a flash](m).', mn: 'Гэрэл асаахгүй л бол та зураг авч болно.' },
        { en: '[Providing the weather holds](m), [we](s) [will finish](v) [the roof](o) [by Friday](m).', mn: 'Цаг агаар энэ хэвээрээ байвал бид баасан гараг гэхэд дээврээ дуусгана.' },
        { en: '[They](s) [agreed](v) [to sell](v) [the house](o) [on condition that we paid in cash](m).', mn: 'Тэд биднийг бэлнээр төлөх нөхцөлтэйгээр байшингаа зарахыг зөвшөөрсөн.' },
      ],
    },
    {
      title: 'supposing ба otherwise / or else',
      description: 'supposing (that) нь if-ийн оронд «…гэж бодъё, тэгвэл яах вэ» гэсэн төсөөлөл, ихэвчлэн асуулттай. otherwise / or else нь «хэрэв тэгэхгүй бол» гэсэн бүхэл нөхцөлийг ганц үгээр орлож, үр дагаврыг холбоно.',
      examples: [
        { en: '[Supposing you lost your job](m), [how](m) [would](v) [you](s) [pay](v) [the rent](o)?', mn: 'Чи ажлаа алдлаа гэж бодъё, түрээсээ яаж төлөх вэ?' },
        { en: '[We](s) [must leave](v) [now](m); [otherwise](m) [we](s) [will miss](v) [the last train](o).', mn: 'Бид одоо явах ёстой, эс тэгвээс сүүлчийн галт тэрэгнээс хоцорно.' },
        { en: '[Write](v) [it](o) [down](m), [or else](m) [you](s) [will forget](v) [it](o).', mn: 'Үүнийг бичиж ав, үгүй бол мартчихна.' },
      ],
    },
    {
      title: 'if … should / happen to ба if + will / would',
      description: 'if you should / if you happen to нь «санамсаргүй тэгэх юм бол» гэж магадлалыг бууруулна. if + will / would нь ирээдүй цаг биш, харин «хэрэв та зөвшөөрвөл, тэгээд өгвөл» гэсэн эелдэг хүсэлт, урилга — зөвхөн энэ утгаар л if-ийн ард will / would орно.',
      examples: [
        { en: '[If you should see Nomin](m), [tell](v) [her](o) [I called](o).', mn: 'Хэрэв Номинтой таарах юм бол намайг залгасан гэж хэлээрэй.' },
        { en: '[If you happen to pass a chemist\'s](m), [could](v) [you](s) [get](v) [me](o) [some aspirin](o)?', mn: 'Хэрэв эмийн сангийн хажуугаар өнгөрөх юм бол надад аспирин аваад өгөөч.' },
        { en: '[If you will wait here](m), [I](s) [will fetch](v) [the manager](o).', mn: 'Та энд түр хүлээж байвал би менежерийг дуудаад ирье.' },
      ],
    },
  ],
  forms: [
    {
      label: 'if … were to',
      structure: 'If + subject + were to + V1, + subject + would / could / might + V1',
      examples: [
        { en: '[If we were to move the factory](m), [costs](s) [would fall](v) [by a third](m).', mn: 'Хэрэв бид үйлдвэрээ нүүлгэвэл зардал гуравны нэгээр буурах байсан.' },
        { en: '[If she were to find out](m), [she](s) [would be](v) [furious](o).', mn: 'Хэрэв тэр мэдчихвэл маш их уурлах байсан.' },
        { en: '[If prices were to rise again](m), [many families](s) [could not cope](v).', mn: 'Хэрэв үнэ дахин өсвөл олон гэр бүл дийлэхгүй болно.' },
      ],
    },
    {
      label: '«…байгаагүй бол»',
      structure: 'If it weren\'t for + noun (одоо) · If it hadn\'t been for + noun (өнгөрсөн) · But for + noun, + subject + would (have) + V',
      examples: [
        { en: '[If it weren\'t for the heating](m), [this house](s) [would be](v) [freezing](o).', mn: 'Халаалт байгаагүй бол энэ байшин хүйт даасан байх байсан.' },
        { en: '[If it hadn\'t been for you](m), [I](s) [would have given up](v).', mn: 'Чи байгаагүй бол би бууж өгөх байсан.' },
        { en: '[But for the delay](m), [we](s) [would be](v) [there](m) [by now](m).', mn: 'Саатал гараагүй бол бид одоо хүрчихсэн байх байсан.' },
      ],
    },
    {
      label: 'Болзол',
      structure: 'provided / providing (that) · on condition that + Present Simple (ирээдүйн утга)',
      examples: [
        { en: '[I](s)[\'ll lend](v) [you](o) [the money](o) [provided that you pay me back by June](m).', mn: 'Зургаадугаар сар гэхэд буцааж төлөх нөхцөлтэйгээр би чамд мөнгө зээлнэ.' },
        { en: '[Children](s) [may use](v) [the pool](o) [on condition that an adult is present](m).', mn: 'Насанд хүрсэн хүн хамт байх нөхцөлтэйгээр хүүхдүүд усан санд орж болно.' },
        { en: '[Providing nothing goes wrong](m), [the bridge](s) [will open](v) [in May](m).', mn: 'Юм буруу болохгүй л бол гүүр тавдугаар сард нээгдэнэ.' },
      ],
    },
    {
      label: 'supposing · otherwise · if + would',
      structure: 'Supposing + clause, + question · clause; otherwise / or else + clause · If you will / would + V1 (эелдэг хүсэлт)',
      examples: [
        { en: '[Supposing nobody comes](m), [what](o) [will](v) [we](s) [do](v) [with all this food](m)?', mn: 'Хэн ч ирэхгүй бол бид энэ их хоолоо яах вэ?' },
        { en: '[I](s) [had](v) [a map](o); [otherwise](m) [I](s) [would have got lost](v).', mn: 'Надад газрын зураг байсан юм, үгүй бол би төөрөх байсан.' },
        { en: '[If you would take a seat](m), [the doctor](s) [will see](v) [you](o) [shortly](m).', mn: 'Та түр суугаад хүлээж байвал эмч таныг удахгүй үзнэ.' },
      ],
    },
  ],
  signalWords: ['if … were to', 'if it weren\'t for', 'if it hadn\'t been for', 'but for', 'provided (that)', 'providing', 'on condition that', 'supposing', 'otherwise', 'or else', 'if … should', 'if … happen to', 'if you will / would'],
  notes: [
    'but for, if it weren\'t for, if it hadn\'t been for-ийн ард clause биш, зөвхөн нэр үг, төлөөний үг эсвэл -ing орно: But for the rain (зөв) / But for it rained (буруу).',
    'were to-г төлөв байдлын үйл үгтэй (know, like, belong, understand) хэрэглэхгүй: If I were to know (буруу) → If I knew. were to нь үйлдэл, үйл явдалд тохирно.',
    'provided / providing / on condition that-ийн ард ирээдүйн утгаар Present Simple, will биш — B1-ийн 14-р дүрмийн unless / as long as-тай адил. Утга нь «only if»-тэй ойр, энгийн if-ээс хатуу.',
    'supposing-ийн ард цаг нь магадлалыг заана: Supposing it rains (бодит боломж), Supposing it rained (төсөөлөл), Supposing it had rained (өнгөрсний бодит бус) — B2-ийн 12-р дүрмийн suppose-той адил.',
    'otherwise бол хоёр өгүүлбэрийг холбох adverb тул өмнө нь цэг эсвэл цэгтэй таслал тавина; or else бол холбоос бөгөөд илүү ярианы. Do it, or else! гэж дангаар нь хэлбэл заналхийлэл болно.',
    'Энгийн нөхцөлд if-ийн ард will ордоггүй (If it will rain — буруу). Зөвхөн зөвшөөрөл, эелдэг хүсэлтийн утгаар орно: If you will follow me, … / If you would sign here, …',
  ],
  commonMistakes: [
    {
      wrong: 'But for he helped me, I would have failed.',
      correct: 'But for his help, I would have failed.',
      explanation: 'but for-ийн ард эзэн + үйл үгтэй clause орохгүй, зөвхөн нэр үг. Clause хэрэгтэй бол if ашиглана: If he hadn\'t helped me, …',
    },
    {
      wrong: 'You can go out provided that you will finish your homework.',
      correct: 'You can go out provided that you finish your homework.',
      explanation: 'provided that-ийн ард ирээдүйн утгатай ч Present Simple. Монголоор «дуусгавал» гэдэгт ирээдүйн тэмдэг байдаггүйтэй адил.',
    },
    {
      wrong: 'If it weren\'t for your advice last year, I would have lost everything.',
      correct: 'If it hadn\'t been for your advice last year, I would have lost everything.',
      explanation: 'last year — өнгөрсний тухай тул if it hadn\'t been for. if it weren\'t for нь одоогийн байдалд хэрэглэгдэнэ.',
    },
    {
      wrong: 'Hurry up, otherwise we would miss the bus.',
      correct: 'Hurry up, otherwise we will miss the bus.',
      explanation: 'Бодит, болох магадлалтай үр дагавар тул otherwise-ийн ард will. would нь зөвхөн бодит бус нөхцөлд: I ran; otherwise I would have missed it.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «…байгаагүй бол» гэдэг нэг хэлбэр одоо ч, өнгөрсөнд ч хэрэглэгддэг («чи байгаагүй бол би чадахгүй байх байсан»). Англиар одоог if it weren\'t for, өнгөрснийг if it hadn\'t been for гэж ялгана. but for бол хоёуланд тохирох бөгөөд цагийг үндсэн хэсэг (would / would have) харуулна.',
      'Монголоор «…нөхцөлтэйгээр», «-х л юм бол», «зөвхөн … тохиолдолд» = provided (that) / on condition that. Монгол «-вал» хэлбэрт ирээдүйн тэмдэг байхгүйтэй адил англиар ч ард нь Present Simple — will нэмэх хэрэггүй.',
      'Монголоор «эс тэгвээс», «үгүй бол», «тэгэхгүй бол» = otherwise / or else. Эдгээр нь хоёр бүтэн өгүүлбэрийг холбодог; харин unless (B1-ийн 14-р дүрэм) нь «-хгүй бол» гэсэн нөхцөлт clause эхлүүлдэг тул хооронд нь сольж болохгүй.',
      'Монголоор «…гэж бодъё», «…гэж саная» = supposing; «…-х юм бол», «санамсаргүй таарвал» = if you should / happen to; «Та энд хүлээж байвал …», «гарын үсгээ зураад өгвөл …» гэсэн эелдэг хүсэлт = If you will wait … / If you would sign …',
    ],
  },
  dialogue: [
    {
      en: 'Bat, [supposing the bank refused our loan](m), [what](o) [would](v) [we](s) [do](v)?',
      mn: 'Бат аа, банк зээлийг маань өгөхгүй гэлээ гэж бодъё, бид яах вэ?',
      speaker: 'Nomin',
    },
    {
      en: '[We](s)[\'d look](v) [for an investor](o). [But](m) [they](s)[\'ll approve](v) [it](o) [provided that we show a clear plan](m).',
      mn: 'Бид хөрөнгө оруулагч хайна. Гэхдээ тодорхой төлөвлөгөө үзүүлэх л юм бол тэд батална.',
      speaker: 'Bat',
    },
    {
      en: '[If it hadn\'t been for your uncle\'s advice](m), [we](s) [wouldn\'t have](v) [a plan](o) [at all](m).',
      mn: 'Авга ахын чинь зөвлөгөө байгаагүй бол бидэнд төлөвлөгөө огт байхгүй байх байсан.',
      speaker: 'Nomin',
    },
    {
      en: 'True. [But for him](m), [we](s) [would have given up](v) [months ago](m).',
      mn: 'Үнэн. Тэр байгаагүй бол бид хэдэн сарын өмнө бууж өгөх байсан.',
      speaker: 'Bat',
    },
    {
      en: '[We](s) [need](v) [to send the documents](o) [today](m); [otherwise](m) [we](s)[\'ll miss](v) [the deadline](o).',
      mn: 'Бид баримтуудаа өнөөдөр явуулах хэрэгтэй, эс тэгвээс эцсийн хугацаанаас хоцорно.',
      speaker: 'Nomin',
    },
    {
      en: 'OK. [If you happen to see Temuulen](m), [ask](v) [him](o) [to check the figures](o).',
      mn: 'За. Хэрэв Тэмүүлэнтэй таарах юм бол тоонуудыг шалгаад өгөөч гэж хэлээрэй.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'c1-03-1',
      ruleId: 3,
      kind: 'fill',
      question: '___ the lifeguard, the child would have drowned.',
      options: ['But for', 'Unless', 'Provided', 'Otherwise'],
      answer: 'But for',
      explanation: 'Ард нь нэр үг (the lifeguard), үндсэн хэсэгт would have — «аврагч байгаагүй бол»: But for + нэр үг. Unless, Provided-ийн ард clause хэрэгтэй; Otherwise өгүүлбэр холбодог.',
      hint: '«…байгаагүй бол» + нэр үг.',
    },
    {
      id: 'c1-03-2',
      ruleId: 3,
      kind: 'fill',
      question: 'You may leave early ___ you finish the report first.',
      options: ['provided that', 'but for', 'otherwise', 'or else'],
      answer: 'provided that',
      explanation: 'Зөвшөөрөлд болзол тавьж байна — «эхлээд тайлангаа дуусгах нөхцөлтэйгээр»: provided that + Present Simple. but for-ийн ард clause орохгүй; otherwise / or else нь «эс тэгвээс» гэсэн эсрэг утгатай.',
      hint: '«Зөвхөн … нөхцөлтэйгээр».',
    },
    {
      id: 'c1-03-3',
      ruleId: 3,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'But for he helped me, I would have failed the exam.',
        'If it hadn\'t been for your support, I would have given up.',
        'Supposing you would win the lottery, what would you buy?',
        'If the bridge were to collapsed, the town would be cut off.',
      ],
      answer: 'If it hadn\'t been for your support, I would have given up.',
      explanation: 'If it hadn\'t been for + нэр үг, would have + V3 — зөв. but for-ийн ард clause орохгүй (But for his help); supposing-ийн ард would биш Past Simple (you won); were to-ийн ард V1 (collapse).',
      hint: 'for-ийн ард нэр үг, to-ийн ард V1.',
    },
    {
      id: 'c1-03-4',
      ruleId: 3,
      kind: 'translate',
      question: 'Түгжрэл байгаагүй бол бид цагтаа ирэх байсан.',
      options: [
        'If it hadn\'t been for the traffic, we would have arrived on time.',
        'But for the traffic was heavy, we would have arrived on time.',
        'If it hadn\'t been the traffic, we would have arrived on time.',
        'Unless for the traffic, we would have arrived on time.',
      ],
      answer: 'If it hadn\'t been for the traffic, we would have arrived on time.',
      explanation: '«…байгаагүй бол … байсан» (өнгөрсөн) = If it hadn\'t been for + нэр үг, would have + V3. for-ийг орхиж болохгүй; but for-ийн ард clause орохгүй; unless for гэсэн хэллэг байхгүй.',
      hint: 'if it hadn\'t been + for + нэр үг.',
    },
  ],
};
