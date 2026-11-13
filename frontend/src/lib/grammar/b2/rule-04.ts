// frontend/src/lib/grammar/b2/rule-04.ts
// B2 дүрэм 4: Past modals — should have / could have / needn't have
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule04: GrammarRule = {
  id: 4,
  title: 'Past modals: should have / could have / needn\'t have',
  titleMn: 'Өнгөрсөн цагийн модаль — «тэгэх ёстой байсан», «тэгж болох байсан», «тэгэх хэрэггүй байсан»',
  hook: '«Чи надад эрт хэлэх ёстой байсан юм», «Бид такси барьж болох байсан», «Чи бэлэг авах хэрэггүй байсан шүү дээ» — өнгөрсөнд болсон зүйлийг шүүмжилж, харамсаж, үнэлж сурцгаая.',
  summary: 'modal + have + V3 нь өнгөрсөн үйлдлийг эргэн дүгнэнэ. should / ought to have + V3 = хийх ёстой байсан ч хийгээгүй (шүүмжлэл, харамсал); shouldn\'t have + V3 = хийсэн нь буруу; could have + V3 = боломж байсан ч ашиглаагүй; would have + V3 = хийх байсан ч нөхцөл бүрдээгүй; needn\'t have + V3 = хийсэн ч шаардлагагүй байсан. didn\'t need to + V1 = шаардлагагүй байсан (тиймээс ихэвчлэн хийгээгүй).',
  description: 'A2-т should (зөвлөгөө), could (чадвар, боломж) зэрэг модаль үйл үгсийг одоо цагт, B1-ийн 10-р дүрэмд must / might / can\'t have + V3-ийг өнгөрсний тухай таамаглалд (He must have forgotten — мартсан байх) үзсэн. Мөн B1-ийн 6-р дүрмийн Third conditional-д would have + V3 таарсан. B2-т яг тэр modal + have + V3 бүтцийг таамаглалд биш, өнгөрсөн үйлдлийг ҮНЭЛЭХЭД хэрэглэнэ: юу хийх ёстой байсан, юу хийж болох байсан, юуг дэмий хийсэн бэ. Эдгээрийн гол санаа нь «бодит байдал өөр байсан»: You should have called = чи залгаагүй; We could have won = бид хожоогүй; You needn\'t have cooked = чи хоол хийчихсэн, гэхдээ хэрэггүй байж. Энэ утгаараа B1-ийн 15-р дүрмийн I wish + Past Perfect-тэй ойр: I wish I had studied ≈ I should have studied. Онцгой анхаарах хос нь needn\'t have + V3 ба didn\'t need to + V1: эхнийх нь «хийсэн, гэвч дэмий байсан», хоёр дахь нь «хийх шаардлагагүй байсан» (ихэвчлэн хийгээгүй). Монголоор эдгээрийг «-х ёстой байсан», «-ж болох байсан», «-х хэрэггүй байсан» гэж «байсан» туслах үгээр өнгөрсөн болгодог. Англиар бол модаль үйл үг өөрөө өнгөрсөн хэлбэрт ордоггүй, оронд нь ард нь have + V3 залгадаг.',
  structure: 'Subject + should / ought to / could / would / needn\'t + have + V3',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'should / could / would / needn\'t', part: 'verb' },
    { text: 'have + V3', part: 'verb' },
    { text: 'object', part: 'object' },
  ],
  tip: 'should have = хийх ёстой байсан (хийгээгүй) · shouldn\'t have = хийсэн нь буруу · could have = болох байсан (болоогүй) · would have = тэгэх байсан · needn\'t have = хийсэн ч дэмий · didn\'t need to = шаардлагагүй байсан.',
  examples: [
    { en: '[You](s) [should have told](v) [me](o) [earlier](m).', mn: 'Чи надад эрт хэлэх ёстой байсан юм. (хэлээгүй)' },
    { en: '[I](s) [shouldn\'t have eaten](v) [so much](o).', mn: 'Би ийм их идэх ёсгүй байсан юм. (идчихсэн)' },
    { en: '[We](s) [could have taken](v) [a taxi](o), [but](m) [we](s) [walked](v).', mn: 'Бид такси барьж болох байсан ч алхсан.' },
    { en: '[You](s) [needn\'t have bought](v) [milk](o). [We](s) [had](v) [plenty](o).', mn: 'Чи сүү авах хэрэггүй байсан юм. Манайд хангалттай байсан. (авчихсан)' },
  ],
  useCases: [
    {
      title: 'should have / ought to have — хийх ёстой байсан ч хийгээгүй',
      description: 'Өнгөрсөнд зөв зүйл хийгдээгүйд бусдыг шүүмжлэх, эсвэл өөртөө харамсах. ought to have нь утгын хувьд адил, арай албан. Бодит байдал: тэр үйлдэл БОЛООГҮЙ.',
      examples: [
        { en: '[You](s) [should have asked](v) [for help](o).', mn: 'Чи тусламж гуйх ёстой байсан юм. (гуйгаагүй)' },
        { en: '[I](s) [should have listened](v) [to my parents](m).', mn: 'Би эцэг эхийнхээ үгийг сонсох ёстой байсан юм.' },
        { en: '[They](s) [ought to have warned](v) [us](o) [about the delay](m).', mn: 'Тэд саатлын талаар бидэнд урьдчилан хэлэх ёстой байсан.' },
      ],
    },
    {
      title: 'shouldn\'t have — хийсэн нь буруу байсан',
      description: 'Үйлдэл болчихсон, гэвч тэгэх ёсгүй байсан. Буруугаа хүлээх, бусдыг зэмлэхэд хэрэглэнэ. Мөн бэлэг авахдаа «Оо, зовох хэрэггүй байсан юм» гэж эелдгээр талархахад: You shouldn\'t have!',
      examples: [
        { en: '[I](s) [shouldn\'t have said](v) [that](o). [I](s)[\'m](v) [sorry](o).', mn: 'Би тэгж хэлэх ёсгүй байсан юм. Уучлаарай.' },
        { en: '[He](s) [shouldn\'t have driven](v) [so fast](m) [in the snow](m).', mn: 'Тэр цасан дээр тийм хурдан давхих ёсгүй байсан.' },
        { en: '[Flowers](o) [for me](m)? [You](s) [shouldn\'t have](v)!', mn: 'Надад цэцэг үү? Ингэж зовох хэрэггүй байсан юм!' },
      ],
    },
    {
      title: 'could have — боломж байсан ч болоогүй',
      description: 'Өнгөрсөнд хийх чадвар, боломж байсан боловч ашиглаагүй. Мөн «арай л болчихсонгүй» гэсэн аюул (You could have been hurt), эсвэл зөөлөн зэмлэл (You could have told me!) илэрхийлнэ.',
      examples: [
        { en: '[She](s) [could have become](v) [a singer](o), [but](m) [she](s) [chose](v) [medicine](o).', mn: 'Тэр дуучин болж болох байсан ч анагаахыг сонгосон.' },
        { en: '[Be](v) [careful](o)! [You](s) [could have broken](v) [your arm](o).', mn: 'Болгоомжтой бай! Чи гараа хугалчихаж болох байлаа шүү.' },
        { en: '[You](s) [could have told](v) [me](o) [you were coming](o)!', mn: 'Чи ирэх гэж байгаагаа надад хэлж болох л байсан шүү дээ!' },
      ],
    },
    {
      title: 'would have — тэгэх байсан, гэвч нөхцөл бүрдээгүй',
      description: 'Third conditional-ын үр дүнгийн хэсгийг if-гүйгээр хэлэх хэлбэр. Хийх хүсэл, бэлэн байдал байсан ч нөхцөл байдал саад болсон. Ихэвчлэн but … гэж шалтгаан дагана.',
      examples: [
        { en: '[I](s) [would have called](v) [you](o), [but](m) [my phone](s) [was](v) [dead](o).', mn: 'Би чам руу залгах байсан ч утас маань унтарчихсан байсан.' },
        { en: '[We](s) [would have helped](v) [you](o). [Why](m) [didn\'t](v) [you](s) [ask](v)?', mn: 'Бид чамд туслах л байсан. Чи яагаад гуйгаагүй юм бэ?' },
        { en: '[She](s) [wouldn\'t have agreed](v) [anyway](m).', mn: 'Тэр ямар ч байсан зөвшөөрөхгүй байсан.' },
      ],
    },
    {
      title: 'needn\'t have ба didn\'t need to — дэмий хийсэн үү, хийгээгүй юү',
      description: 'needn\'t have + V3: үйлдлийг ХИЙСЭН, дараа нь шаардлагагүй байсан нь тодорсон. didn\'t need to + V1: шаардлагагүй гэдгийг урьдаас мэдэж байсан, тиймээс ихэвчлэн хийгээгүй. didn\'t have to нь didn\'t need to-той адил.',
      examples: [
        { en: '[I](s) [needn\'t have taken](v) [an umbrella](o). [It](s) [didn\'t rain](v) [at all](m).', mn: 'Би шүхэр авч явах хэрэггүй байсан юм. Бороо огт ороогүй. (авч явсан)' },
        { en: '[I](s) [didn\'t need to take](v) [an umbrella](o), [so](m) [I](s) [left](v) [it](o) [at home](m).', mn: 'Надад шүхэр авах шаардлагагүй байсан тул гэртээ орхисон. (аваагүй)' },
        { en: '[You](s) [needn\'t have worried](v). [Everything](s) [went](v) [well](m).', mn: 'Чи санаа зовох хэрэггүй байсан юм. Бүх зүйл сайн болсон.' },
      ],
    },
  ],
  forms: [
    {
      label: 'should / ought to have + V3',
      structure: 'should (not) have + V3 · ought (not) to have + V3 · Should + subject + have + V3?',
      examples: [
        { en: '[We](s) [should have booked](v) [a table](o).', mn: 'Бид ширээ захиалах ёстой байсан юм.' },
        { en: '[You](s) [shouldn\'t have lent](v) [him](o) [the money](o).', mn: 'Чи түүнд мөнгө зээлүүлэх ёсгүй байсан юм.' },
        { en: '[Should](v) [I](s) [have invited](v) [her](o) [too](m)?', mn: 'Би түүнийг бас урих ёстой байсан уу?' },
      ],
    },
    {
      label: 'could have + V3',
      structure: 'could have + V3 · Could + subject + have + V3?',
      examples: [
        { en: '[I](s) [could have stayed](v) [longer](m), [but](m) [I](s) [was](v) [tired](o).', mn: 'Би удаан байж болох байсан ч ядарчихсан байсан.' },
        { en: '[That](s) [was](v) [dangerous](o). [Someone](s) [could have been killed](v).', mn: 'Тэр аюултай байлаа. Хэн нэгэн амиа алдаж ч болох байсан.' },
        { en: '[Could](v) [we](s) [have done](v) [anything](o) [differently](m)?', mn: 'Бид ямар нэг зүйлийг өөрөөр хийж болох байсан уу?' },
      ],
    },
    {
      label: 'would have + V3',
      structure: 'would (not) have + V3 (+ but …)',
      examples: [
        { en: '[I](s) [would have come](v) [to your party](m), [but](m) [I](s) [was](v) [ill](o).', mn: 'Би үдэшлэгт чинь очих байсан ч өвчтэй байсан.' },
        { en: '[He](s) [would have loved](v) [this film](o).', mn: 'Тэр энэ кинонд үнэхээр дуртай байх байсан. (үзэж чадаагүй)' },
        { en: '[I](s) [wouldn\'t have done](v) [that](o) [in your position](m).', mn: 'Би чиний оронд тэгж хийхгүй байсан.' },
      ],
    },
    {
      label: 'needn\'t have + V3 / didn\'t need to + V1',
      structure: 'needn\'t have + V3 (хийсэн, дэмий) · didn\'t need to / didn\'t have to + V1 (шаардлагагүй байсан)',
      examples: [
        { en: '[You](s) [needn\'t have cooked](v). [We](s)[\'ve already eaten](v).', mn: 'Чи хоол хийх хэрэггүй байсан юм. Бид аль хэдийн идчихсэн. (хийчихсэн)' },
        { en: '[She](s) [didn\'t need to pay](v). [The concert](s) [was](v) [free](o).', mn: 'Тэр мөнгө төлөх шаардлагагүй байсан. Тоглолт үнэгүй байсан.' },
        { en: '[We](s) [needn\'t have hurried](v). [The train](s) [was](v) [late](o) [anyway](m).', mn: 'Бид яарах хэрэггүй байсан юм. Галт тэрэг ямар ч байсан хоцорсон.' },
      ],
    },
  ],
  signalWords: ['should have', 'shouldn\'t have', 'ought to have', 'could have', 'would have', 'needn\'t have', 'didn\'t need to', 'but', 'anyway'],
  notes: [
    'Модалийн ард have хэзээ ч has, had болж хувирахгүй, ард нь заавал V3: He should has gone / He should have went (буруу) → He should have gone (зөв).',
    'Ярианд should\'ve, could\'ve, would\'ve гэж товчилдог бөгөөд энэ нь «should of» шиг сонсогддог. Гэвч should of гэж бичих нь алдаа — үргэлж have.',
    'B1-ийн 10-р дүрмийн must have-тай бүү хольж хутга: He must have left = явсан байх (таамаг). He should have left = явах ёстой байсан (гэвч яваагүй). Монголоор хоёуланд нь «ёстой» гэдэг үг орж болдог тул онцгой анхаар.',
    'had to ба should have: I had to work = ажиллах шаардлагатай болсон, тэгээд ажилласан. I should have worked = ажиллах ёстой байсан ч ажиллаагүй. Бодит байдал эсрэг.',
    'could have (боломж байсан) ба couldn\'t have (байх боломжгүй — таамаг) хоёр тэгш хэмтэй биш: He couldn\'t have known = тэр мэдэх боломжгүй байсан. Чадаагүй гэдгийг хэлэх бол couldn\'t + V1 эсвэл wasn\'t able to.',
    'needn\'t have нь британи англи хэлэнд түгээмэл. Америк англиар ихэвчлэн didn\'t need to / didn\'t have to-г хоёр утганд хоёуланд нь хэрэглэж, утгыг нь нөхцөл байдлаас ойлгодог.',
  ],
  commonMistakes: [
    {
      wrong: 'You should have went to the doctor.',
      correct: 'You should have gone to the doctor.',
      explanation: 'have-ийн ард V3 (past participle) байна, V2 биш. go – went – gone. Дүрмийн бус үйл үгийн гурав дахь хэлбэрийг сайн цээжлээрэй.',
    },
    {
      wrong: 'I should of called you last night.',
      correct: 'I should have called you last night.',
      explanation: 'Ярианд should\'ve нь «should of» гэж сонсогддог ч of гэж бичихгүй. Модалийн ард үргэлж have + V3.',
    },
    {
      wrong: 'I failed the exam. I must have studied harder.',
      correct: 'I failed the exam. I should have studied harder.',
      explanation: 'must have + V3 нь «тэгсэн байх» гэсэн таамаглал. Хийгээгүйдээ харамсахад should have. Монголоор «сурах ёстой байсан» гэдгээс үүдэн must сонгох алдаа гардаг.',
    },
    {
      wrong: 'I needn\'t have taken a coat, so I left it at home.',
      correct: 'I didn\'t need to take a coat, so I left it at home.',
      explanation: 'needn\'t have + V3 нь үйлдлийг хийсэн гэсэн утгатай тул «гэртээ орхисон» гэдэгтэй зөрчилдөнө. Хийгээгүй бол didn\'t need to + V1.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «хэлэх ёстой байсан», «барьж болох байсан» гэж «байсан»-г сүүлд нэмээд өнгөрсөн болгодог. Англиар модаль үйл үг өөрөө өнгөрсөн болохгүй (shoulded гэж байхгүй), оронд нь үндсэн үйл үгийг have + V3 болгоно.',
      'Монголоор «ёстой байсан» нь should have (хийгээгүй), had to (хийсэн), must have (хийсэн байх) гурвын аль нь ч байж болно. Англиар орчуулахдаа «тэр үйлдэл бодитоор болсон уу?» гэж эхлээд асуугаарай.',
      'Монголоор «авах хэрэггүй байсан» гэхэд авсан эсэх нь нөхцөл байдлаас л мэдэгддэг. Англиар needn\'t have bought (авчихсан, дэмий) ба didn\'t need to buy (шаардлагагүй байсан тул аваагүй) гэж хэлбэрээр ялгана.',
      'Монголоор «чи хэлж болох л байсан шүү дээ» гэсэн зөөлөн зэмлэл нь «л», «шүү дээ» гэх сул үгсээр илэрдэг. Англиар энэ өнгийг could have дангаараа, өргөлт, аялгаар гаргана: You could have told me!',
    ],
  },
  dialogue: [
    {
      en: 'Temuulen, [you](s) [missed](v) [the train](o)? [You](s) [should have left](v) [home](o) [earlier](m)!',
      mn: 'Тэмүүлэн, чи галт тэрэгнээсээ хоцорсон уу? Чи гэрээсээ эрт гарах ёстой байсан юм!',
      speaker: 'Tuya',
    },
    {
      en: 'I know. [I](s) [shouldn\'t have stayed up](v) [so late](m) [last night](m).',
      mn: 'Мэдэж байна. Би өчигдөр шөнө тийм орой болтол суух ёсгүй байсан юм.',
      speaker: 'Temuulen',
    },
    {
      en: '[You](s) [could have called](v) [me](o). [I](s) [would have driven](v) [you](o) [to the station](m).',
      mn: 'Чи над руу залгаж болох байсан. Би чамайг буудал руу хүргээд өгөх байсан.',
      speaker: 'Tuya',
    },
    {
      en: '[I](s) [didn\'t want](v) [to wake you](o). [Anyway](m), [I](s) [bought](v) [a new ticket](o).',
      mn: 'Би чамайг сэрээхийг хүсээгүй юм. Ямартай ч шинэ тасалбар авчихсан.',
      speaker: 'Temuulen',
    },
    {
      en: '[You](s) [needn\'t have done](v) [that](o). [The old ticket](s) [was](v) [valid](o) [all day](m).',
      mn: 'Чи тэгэх хэрэггүй байсан юм. Хуучин тасалбар чинь өдөржин хүчинтэй байсан.',
      speaker: 'Tuya',
    },
    {
      en: 'Really? [I](s) [ought to have read](v) [the small print](o)!',
      mn: 'Үнэн үү? Би жижиг үсгээр бичсэнийг унших ёстой байж!',
      speaker: 'Temuulen',
    },
  ],
  quiz: [
    {
      id: 'b2-04-1',
      ruleId: 4,
      kind: 'fill',
      question: 'You ___ me you were coming! I would have cooked something special.',
      options: ['should tell', 'must have told', 'should have told', 'needn\'t have told'],
      answer: 'should have told',
      explanation: 'Хэлээгүй, тиймээс онцгой хоол хийгээгүй — өнгөрсөнд хийх ёстой байсан ч хийгээгүй үйлдэл: should have told. should tell нь одоо / ирээдүйн зөвлөгөө, must have told нь «хэлсэн байх» гэсэн таамаг, needn\'t have told нь хэлсэн гэсэн утгатай.',
      hint: 'Хийх ёстой байсан ч хийгээгүй.',
    },
    {
      id: 'b2-04-2',
      ruleId: 4,
      kind: 'fill',
      question: 'The meeting was cancelled the night before, so I ___ early. I stayed in bed until ten.',
      options: ['needn\'t have got up', 'didn\'t need to get up', 'shouldn\'t have got up', 'must have got up'],
      answer: 'didn\'t need to get up',
      explanation: 'Шаардлагагүйг урьдаас мэдсэн бөгөөд эрт босоогүй (stayed in bed) — didn\'t need to + V1. needn\'t have got up ба shouldn\'t have got up нь эрт боссон гэсэн утгатай тул дараагийн өгүүлбэртэй зөрчилдөнө.',
      hint: 'Эрт боссон уу, босоогүй юу?',
    },
    {
      id: 'b2-04-3',
      ruleId: 4,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'I should have went to the doctor earlier.',
        'She could of helped us, but she didn\'t.',
        'You needn\'t have bought me a present, but thank you!',
        'He ought have apologised to her.',
      ],
      answer: 'You needn\'t have bought me a present, but thank you!',
      explanation: 'needn\'t have + V3 — бэлэг авчихсан, гэвч шаардлагагүй байсан, зөв. Бусад нь: have-ийн ард V3 (gone); of биш have (could have helped); ought-ын ард to заавал (ought to have apologised).',
      hint: 'modal + have + V3 бүрэн эсэхийг шалга.',
    },
    {
      id: 'b2-04-4',
      ruleId: 4,
      kind: 'translate',
      question: 'Чи надаас асуух ёстой байсан юм. (Гэвч асуугаагүй.)',
      options: [
        'You should ask me.',
        'You must have asked me.',
        'You should had asked me.',
        'You should have asked me.',
      ],
      answer: 'You should have asked me.',
      explanation: '«Асуух ёстой байсан» + асуугаагүй — should have + V3. should ask нь одоогийн зөвлөгөө, must have asked нь «асуусан байх» гэсэн таамаг, should had гэсэн хэлбэр байхгүй (модалийн ард үргэлж have).',
      hint: 'should + have + V3.',
    },
  ],
};
