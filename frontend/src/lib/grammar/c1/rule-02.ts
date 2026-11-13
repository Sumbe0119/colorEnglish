// frontend/src/lib/grammar/c1/rule-02.ts
// C1 дүрэм 2: Inverted conditionals — Had I known / Were I to / Should you
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule02: GrammarRule = {
  id: 2,
  title: 'Inverted conditionals: Had I known / Were I to / Should you',
  titleMn: 'If-гүй нөхцөл — Had I known, Were I you, Should you need',
  hook: '«Had I known …», «Should you need …», «Were I you …» — if-ийг огт хэлэлгүйгээр нөхцөл илэрхийлдэг албан ёсны, дэгжин хэлбэрийг сурцгаая.',
  summary: 'Албан ёсны хэлэнд if-ийг хасаж, should / were / had-ийг эзний өмнө гаргаж нөхцөл илэрхийлнэ: Should you need help, … (= If you need / should need), Were I you, … / Were he to resign, … (= If I were / If he resigned), Had I known, … (= If I had known). Үгүйсгэхдээ not-ыг эзний ард тавина, товчлохгүй: Had I not seen it, … Үндсэн хэсэг (will / would / would have) огт өөрчлөгдөхгүй.',
  description: 'B1-ийн 5, 6-р дүрэмд Second ба Third conditional-ыг, B2-ийн 3-р дүрэмд mixed conditionals-ыг үзсэн. Утга, цагийн хувьд энэ дүрэм шинэ зүйл нэмэхгүй — зөвхөн ХЭЛБЭР ба ӨНГӨ өөрчлөгдөнө: if-ийг хасаад оронд нь туслах үйл үгийг эзний өмнө гаргана. C1-ийн 1-р дүрэмд сөрөг adverbial-ийн ард асуултын дараалал ордгийг үзсэн; энд мөн адил inversion, гэхдээ if-ийг орлож байгаа юм. Ингэж эхэлж чадах үг ердөө гурав: should (First conditional-ын албан хувилбар — бодит боломжтой нөхцөл, «хэрэв тэгэх тохиолдол гарвал» гэсэн эелдэг, болгоомжтой өнгөтэй), were (Second conditional — одоо ба ирээдүйн бодит бус нөхцөл; were + to V1 нь магадлал багатай ирээдүй), had (Third conditional — өнгөрсний бодит бус нөхцөл). do, did, could, would зэргээр ингэж эхэлж болохгүй. Хэрэглээ нь ажил хэргийн захидал, гэрээ, зарлал, албан илтгэл, эрдэм шинжилгээний бичвэр (Should you have any questions, please do not hesitate to contact us). Ярианд Had I known … ба Were I you … харьцангуй түгээмэл, бусад нь голдуу бичгийн хэлний хэлбэр. Монгол хэлэнд нөхцөлийг үйл үгийн «-вал / -бол», «-сан бол» нөхцөлөөр илэрхийлдэг бөгөөд «хэрэв» гэдэг үгийг хэлэх, хасах нь чөлөөтэй; англиар харин if-ийг хасвал үгийн дарааллыг заавал сольж нөхөх ёстой.',
  structure: 'Should + subject + V1, … will / imperative · Were + subject (+ to V1), … would + V1 · Had + subject + V3, … would have + V3',
  structureParts: [
    { text: 'Should / Were / Had', part: 'verb' },
    { text: 'subject', part: 'subject' },
    { text: 'V1 / to V1 / V3', part: 'verb' },
    { text: ', main clause (will / would / would have)', part: 'plain' },
  ],
  tip: 'If-ийг хасаад туслах үйл үгийг урагш гарга: If you should → Should you · If I were → Were I · If I had known → Had I known. Үгүйсгэл: Had I not … (Hadn\'t I … биш).',
  examples: [
    { en: '[Should you need any further information](m), [please](m) [contact](v) [our office](o).', mn: 'Хэрэв танд нэмэлт мэдээлэл хэрэгтэй бол манай оффистой холбогдоно уу.' },
    { en: '[Were I in your position](m), [I](s) [would accept](v) [the offer](o).', mn: 'Би таны оронд байсан бол саналыг хүлээж авах байсан.' },
    { en: '[Had I known about the delay](m), [I](s) [would have taken](v) [the train](o).', mn: 'Саатлын талаар мэдсэн бол би галт тэргээр явах байсан.' },
    { en: '[Had it not been for your help](m), [we](s) [would never have finished](v) [on time](m).', mn: 'Таны тусламж байгаагүй бол бид хэзээ ч цагтаа дуусгахгүй байсан.' },
  ],
  useCases: [
    {
      title: 'Should + эзэн + V1 — бодит боломжтой нөхцөл (First)',
      description: 'If you need … / If you should need …-ийн албан хувилбар. «Хэрэв тэгэх тохиолдол гарвал» гэсэн эелдэг, болгоомжтой өнгөтэй. Захидал, зарлал, заавар, гэрээнд түгээмэл; үндсэн хэсэгт will, modal эсвэл захирах хэлбэр орно.',
      examples: [
        { en: '[Should you have any questions](m), [please](m) [do not hesitate](v) [to contact us](o).', mn: 'Хэрэв танд асуулт гарвал бидэнтэй чөлөөтэй холбогдоно уу.' },
        { en: '[Should the flight be cancelled](m), [passengers](s) [will receive](v) [a full refund](o).', mn: 'Хэрэв нислэг цуцлагдвал зорчигчдод төлбөрийг бүрэн буцаан олгоно.' },
        { en: '[Should anyone call](m), [tell](v) [them](o) [I\'ll be back at three](o).', mn: 'Хэрэв хэн нэгэн залгавал намайг гурван цагт ирнэ гэж хэлээрэй.' },
      ],
    },
    {
      title: 'Were + эзэн — одоогийн бодит бус байдал (Second)',
      description: 'If I were … / If it were …-ийн албан хувилбар. Одоо тийм биш байдлыг төсөөлнө. Бүх биед were (was биш). Were it not for + нэр үг нь «…байгаагүй бол» гэсэн тогтсон хэлбэр.',
      examples: [
        { en: '[Were I you](m), [I](s) [would speak](v) [to a lawyer](m) [first](m).', mn: 'Би чиний оронд байсан бол эхлээд хуульчтай ярих байсан.' },
        { en: '[Were the rent lower](m), [we](s) [would stay](v) [in this flat](m).', mn: 'Түрээс нь арай хямд байсан бол бид энэ байрандаа үлдэх байсан.' },
        { en: '[Were it not for my family](m), [I](s) [would move](v) [abroad](m).', mn: 'Гэр бүл минь байгаагүй бол би гадаад руу нүүх байсан.' },
      ],
    },
    {
      title: 'Were + эзэн + to V1 — магадлал багатай ирээдүй',
      description: 'If he were to resign … / If he resigned …-ийн албан хувилбар. Ирээдүйд болох магадлал багатай, эсвэл зөвхөн таамаглаж буй үйлдлийг болгоомжтой өгүүлнэ. Хэлэлцээр, дүн шинжилгээ, эрдэм шинжилгээний бичвэрт их гарна.',
      examples: [
        { en: '[Were the government to raise taxes](m), [many small businesses](s) [would close](v).', mn: 'Хэрэв засгийн газар татвар нэмбэл олон жижиг бизнес хаагдах байсан.' },
        { en: '[Were he to resign](m), [who](s) [would replace](v) [him](o)?', mn: 'Хэрэв тэр ажлаасаа гарвал хэн түүнийг орлох вэ?' },
        { en: '[Were we to accept this offer](m), [we](s) [would lose](v) [our independence](o).', mn: 'Хэрэв бид энэ саналыг хүлээж авбал бие даасан байдлаа алдах байсан.' },
      ],
    },
    {
      title: 'Had + эзэн + V3 — өнгөрсний бодит бус нөхцөл (Third)',
      description: 'If I had known …-ийн албан хувилбар. Өнгөрсөнд болоогүй зүйлийг төсөөлж харамсал, шүүмжлэл, дүгнэлт илэрхийлнэ. Гурван хэлбэрээс ярианд хамгийн их сонсогддог нь энэ.',
      examples: [
        { en: '[Had I known you were coming](m), [I](s) [would have cooked](v) [something special](o).', mn: 'Чамайг ирнэ гэдгийг мэдсэн бол би онцгой хоол хийх байсан.' },
        { en: '[Had they left on time](m), [they](s) [would not have missed](v) [the ferry](o).', mn: 'Тэд цагтаа гарсан бол гатлага онгоцноосоо хоцрохгүй байсан.' },
        { en: '[Had the alarm gone off](m), [everyone](s) [could have escaped](v).', mn: 'Дохиолол дуугарсан бол бүгд зугтаж чадах байсан.' },
      ],
    },
    {
      title: 'Үгүйсгэл ба холимог нөхцөл',
      description: 'Үгүйсгэхдээ not-ыг эзний ард бүтнээр нь тавина (Had I not …, Were it not …, Should you not …). Had it not been for + нэр үг = «…байгаагүй бол». Had-тай нөхцөлийг B2-ийн 3-р дүрмийн mixed conditional шиг одоогийн үр дагавартай холбож болно.',
      examples: [
        { en: '[Had I not seen it with my own eyes](m), [I](s) [would not have believed](v) [it](o).', mn: 'Өөрийн нүдээр хараагүй бол би үүнд итгэхгүй байсан.' },
        { en: '[Had it not been for the scholarship](m), [she](s) [could never have studied](v) [abroad](m).', mn: 'Тэтгэлэг байгаагүй бол тэр хэзээ ч гадаадад сурч чадахгүй байсан.' },
        { en: '[Had I taken that job](m), [I](s) [would be living](v) [in London](m) [now](m).', mn: 'Тэр ажлыг авсан бол би одоо Лондонд амьдарч байх байсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Should (First conditional)',
      structure: 'Should + subject + V1, + subject + will / can / may + V1 (эсвэл захирах хэлбэр)',
      examples: [
        { en: '[Should you change your mind](m), [let](v) [me](o) [know](v).', mn: 'Хэрэв бодлоо өөрчилбөл надад мэдэгдээрэй.' },
        { en: '[Should the weather improve](m), [the ceremony](s) [will be held](v) [outdoors](m).', mn: 'Хэрэв цаг агаар сайжирвал ёслолыг гадаа зохион байгуулна.' },
        { en: '[Should you require a receipt](m), [our staff](s) [can print](v) [one](o) [for you](m).', mn: 'Хэрэв танд баримт хэрэгтэй бол манай ажилтнууд хэвлэж өгнө.' },
      ],
    },
    {
      label: 'Were (Second conditional)',
      structure: 'Were + subject (+ to V1) …, + subject + would / could / might + V1',
      examples: [
        { en: '[Were she here](m), [she](s) [would know](v) [what to do](o).', mn: 'Тэр энд байсан бол юу хийхийг мэдэх байсан.' },
        { en: '[Were I to tell you the truth](m), [you](s) [would not believe](v) [me](o).', mn: 'Би чамд үнэнийг хэлбэл чи надад итгэхгүй байх байсан.' },
        { en: '[Were it possible](m), [I](s) [would start](v) [again](m).', mn: 'Боломжтой байсан бол би дахин эхлэх байсан.' },
      ],
    },
    {
      label: 'Had (Third conditional)',
      structure: 'Had + subject + V3, + subject + would / could / might + have + V3',
      examples: [
        { en: '[Had we booked earlier](m), [we](s) [would have paid](v) [less](o).', mn: 'Бид эрт захиалсан бол бага төлөх байсан.' },
        { en: '[Had you asked me](m), [I](s) [would have helped](v) [you](o).', mn: 'Чи надаас гуйсан бол би чамд туслах байсан.' },
        { en: '[The project](s) [would have failed](v) [had the team given up](m).', mn: 'Баг бууж өгсөн бол төсөл бүтэлгүйтэх байсан.' },
      ],
    },
    {
      label: 'Үгүйсгэх',
      structure: 'Should / Were / Had + subject + not + … (товчлохгүй)',
      examples: [
        { en: '[Had he not been wearing a seat belt](m), [he](s) [would have been](v) [seriously injured](o).', mn: 'Тэр суудлын бүсээ зүүгээгүй байсан бол хүнд гэмтэх байсан.' },
        { en: '[Were it not for the noise](m), [this](s) [would be](v) [a perfect place](o) [to live](m).', mn: 'Чимээ шуугиан байгаагүй бол энэ амьдрахад төгс газар байх байсан.' },
        { en: '[Should you not wish to continue](m), [you](s) [may cancel](v) [at any time](m).', mn: 'Хэрэв та үргэлжлүүлэхийг хүсэхгүй бол хэдийд ч цуцалж болно.' },
      ],
    },
  ],
  signalWords: ['should you', 'should + subject + V1', 'were I', 'were … to', 'were it not for', 'had I known', 'had … not', 'had it not been for'],
  notes: [
    'Зөвхөн should, were, had гурав л if-ийг орлож чадна. Did I know the answer, … / Could I help, … / Would he come, … гэж нөхцөл эхлүүлж болохгүй.',
    'Үгүйсгэлийг товчлохгүй: Hadn\'t I known (буруу) → Had I not known (зөв); Weren\'t it for (буруу) → Were it not for (зөв). not үргэлж эзний ард.',
    'was-ийг ингэж урагш гаргахгүй: Was I you (буруу). Inverted conditional-д бүх биед were: Were I, Were he, Were it.',
    'Үндсэн хэсэг ердийн нөхцөлтэй яг адил хэвээр үлдэнэ. Inverted хэсэг ард нь ч орж болно, тэр үед ихэвчлэн таслалгүй: I would have called had I known.',
    'Энд should нь «ёстой» гэсэн үүргийн утгагүй — зөвхөн «тэгэх тохиолдол гарвал» гэсэн магадлалыг заана: Should you see him = If you happen to see him.',
    'Хэлбэр нь асуулттай адилхан харагдавч асуулт биш: асуултын тэмдэг байхгүй, ард нь үндсэн хэсэг залгана. Had I known? (асуулт) / Had I known, I would have come. (нөхцөл).',
  ],
  commonMistakes: [
    {
      wrong: 'Hadn\'t I missed the bus, I would have been on time.',
      correct: 'Had I not missed the bus, I would have been on time.',
      explanation: 'Inverted conditional-д үгүйсгэлийг товчлохгүй. not-ыг эзний ард тусад нь тавина: Had I not …',
    },
    {
      wrong: 'If had I known about it, I would have told you.',
      correct: 'Had I known about it, I would have told you.',
      explanation: 'if ба inversion хоёрыг зэрэг хэрэглэхгүй — аль нэгийг нь сонгоно: If I had known … эсвэл Had I known …',
    },
    {
      wrong: 'Was I you, I would apologise.',
      correct: 'Were I you, I would apologise.',
      explanation: 'Бодит бус нөхцөлийн inversion-д зөвхөн were хэрэглэнэ. Ярианы If I was … хэлбэрийг inversion болгож болохгүй.',
    },
    {
      wrong: 'Should you will need more time, let us know.',
      correct: 'Should you need more time, let us know.',
      explanation: 'should-ын ард V1 шууд орно. Нөхцөлийн хэсэгт will хэрэглэхгүй гэдэг дүрэм энд ч хэвээр.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор нөхцөл нь үйл үгийн «-вал / -бол», «-сан бол» нөхцөлд агуулагддаг тул «хэрэв» гэдэг үгийг хассан ч өгүүлбэр хэвээрээ: «(Хэрэв) мэдсэн бол ирэх байсан». Англиар if-ийг хасвал үгийн дарааллыг заавал солино: If I had known → Had I known. if ч үгүй, inversion ч үгүй бол нөхцөл болохгүй.',
      'Монголоор албан ёсны өнгийг үгийн сонголтоор гаргадаг: «асуулт гарвал» → «асуух зүйл гарсан тохиолдолд», «шаардлагатай гэж үзвэл». Англиар яг энэ өнгийг Should you have any questions, … гэсэн inversion өгдөг.',
      'Цагийн тохирол B1-д үзсэнтэй адил: «-вал» (бодит боломж) = Should + V1; «…байсан бол» (одоо) = Were + эзэн; «-сан бол» (өнгөрсөн) = Had + V3. «Чиний оронд байсан бол» = Were I you; «…байгаагүй бол» = Were it not for / Had it not been for.',
      'Монголоор асуултыг «уу / вэ / бэ» гэсэн сул үгээр хийдэг тул үгийн дараалал асуулт, нөхцөл хоёрт ялгаагүй. Англиар inverted conditional нь асуулттай ижил эхэлдэг тул монгол суралцагч асуулт гэж уншиж андуурдаг — асуултын тэмдэг байхгүй, ард нь үндсэн хэсэг байгааг хараарай.',
    ],
  },
  dialogue: [
    {
      en: 'Temuulen, [have](v) [you](s) [read](v) [the supplier\'s contract](o)?',
      mn: 'Тэмүүлэн, чи нийлүүлэгчийн гэрээг уншсан уу?',
      speaker: 'Saraa',
    },
    {
      en: 'Yes. [Should they deliver late](m), [we](s) [can cancel](v) [the order](o) [without a penalty](m).',
      mn: 'Тийм. Хэрэв тэд хоцорч нийлүүлбэл бид торгуульгүйгээр захиалгаа цуцалж болно.',
      speaker: 'Temuulen',
    },
    {
      en: 'Good. [Had we had that clause](m) [last year](m), [we](s) [would have saved](v) [a lot of money](o).',
      mn: 'Сайн байна. Өнгөрсөн жил тэр заалт байсан бол бид их мөнгө хэмнэх байсан.',
      speaker: 'Saraa',
    },
    {
      en: 'True. [Were I in your position](m), [I](s) [would also ask](v) [for a longer guarantee](o).',
      mn: 'Үнэн. Би таны оронд байсан бол бас илүү урт баталгаат хугацаа шаардах байсан.',
      speaker: 'Temuulen',
    },
    {
      en: '[Would](v) [they](s) [agree](v) [to that](m)?',
      mn: 'Тэд үүнийг зөвшөөрөх болов уу?',
      speaker: 'Saraa',
    },
    {
      en: 'I think so. [Were they to refuse](m), [we](s) [could approach](v) [another supplier](o).',
      mn: 'Зөвшөөрнө гэж бодож байна. Хэрэв тэд татгалзвал бид өөр нийлүүлэгчид хандаж болно.',
      speaker: 'Temuulen',
    },
  ],
  quiz: [
    {
      id: 'c1-02-1',
      ruleId: 2,
      kind: 'fill',
      question: '___ you require any assistance, please do not hesitate to contact us.',
      options: ['Should', 'Would', 'Had', 'Did'],
      answer: 'Should',
      explanation: 'Бодит боломжтой нөхцөл (үндсэн хэсэг нь захирах хэлбэр), ард нь V1 require байна — Should you require = If you require. Had-ийн ард V3 хэрэгтэй; would, did нөхцөл эхлүүлж чадахгүй.',
      hint: 'Албан захидлын төгсгөлийн түгээмэл хэллэг.',
    },
    {
      id: 'c1-02-2',
      ruleId: 2,
      kind: 'fill',
      question: '___ about the strike, we would have booked a different flight.',
      options: ['Had we known', 'Were we known', 'Should we know', 'Have we known'],
      answer: 'Had we known',
      explanation: 'Үндсэн хэсэгт would have booked байгаа тул Third conditional — If we had known → Had we known.',
      hint: 'would have + V3 → нөхцөлд Past Perfect.',
    },
    {
      id: 'c1-02-3',
      ruleId: 2,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Hadn\'t I missed the train, I would have arrived on time.',
        'Were I you, I would reconsider the offer.',
        'Was I you, I would reconsider the offer.',
        'Did I know the answer, I would tell you.',
      ],
      answer: 'Were I you, I would reconsider the offer.',
      explanation: 'Were I you = If I were you. Үгүйсгэлийг товчлохгүй (Had I not missed); was-ийг урагш гаргахгүй; did-ээр нөхцөл эхлүүлэхгүй (If I knew the answer).',
      hint: 'Зөвхөн should / were / had, товчлолгүй.',
    },
    {
      id: 'c1-02-4',
      ruleId: 2,
      kind: 'translate',
      question: 'Тэр эрт ирсэн бол бид түүнтэй уулзах байсан.',
      options: [
        'Had she arrived earlier, we would have met her.',
        'Should she arrive earlier, we would have met her.',
        'Were she arrived earlier, we would have met her.',
        'Had she arrived earlier, we will meet her.',
      ],
      answer: 'Had she arrived earlier, we would have met her.',
      explanation: '«Ирсэн бол уулзах байсан» — өнгөрсний бодит бус нөхцөл: Had + эзэн + V3, would have + V3. should нь бодит боломжтой ирээдүйд, were + V3 гэсэн хэлбэр байхгүй, will нь Third conditional-д тохирохгүй.',
      hint: '«-сан бол» өнгөрсөн = Had + V3.',
    },
  ],
};
