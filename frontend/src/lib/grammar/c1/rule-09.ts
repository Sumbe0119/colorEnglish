// frontend/src/lib/grammar/c1/rule-09.ts
// C1 дүрэм 9: Nominalisation
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule09: GrammarRule = {
  id: 9,
  title: 'Nominalisation',
  titleMn: 'Nominalisation — үйл үг, тэмдэг нэрийг нэр үг болгож албан хэв маягаар бичих',
  hook: '«Засгийн газар шийдсэн» биш «Засгийн газрын шийдвэр», «үнэ өссөн учраас» биш «үнийн өсөлтөөс шалтгаалан» — эрдэм шинжилгээ, албан бичгийн хэлээр бичиж сурцгаая.',
  summary: 'Nominalisation гэдэг нь үйл үг (decide → decision) буюу тэмдэг нэрийг (important → importance) нэр үг болгож, бүтэн өгүүлбэрийг нэр үгийн бүлэг болгон шахах арга юм: The government decided → The government\'s decision; because prices rose → due to the rise in prices. Энэ нь бичвэрийг албан, товч, бодитой болгодог ч хэтрүүлбэл хүнд, ойлгомжгүй болгоно.',
  description: 'Өмнөх түвшнүүдэд бид санаагаа голчлон үйл үгээр илэрхийлж ирсэн: хэн юу хийсэн бэ, яагаад? B2-ийн 15-р дүрэмд whereas, nevertheless, therefore зэрэг холбоосоор өгүүлбэрүүдийг албан хэв маягаар холбож сурсан. C1 түвшинд албан, эрдэм шинжилгээний бичгийн хамгийн тод шинж болох nominalisation-ийг үзнэ: үйлдэл, шинж чанарыг НЭР ҮГ болгон хувиргана. Жишээ нь Prices rose sharply, so people protested гэсэн хоёр өгүүлбэр The sharp rise in prices led to protests гэсэн нэг нягт өгүүлбэр болно. Ингэснээр гурван давуу тал гарна: (1) үйлдэл өөрөө өгүүлбэрийн эзэн, сэдэв болж, дараагийн өгүүлбэрт үргэлжлүүлэн ярихад хялбар; (2) хэн хийсэн нь чухал биш үед үйлдэгчийг орхиж, бодитой, хувийн бус өнгө гаргана (B1-ийн 7-р дүрмийн passive-тай адил зорилго); (3) нэг өгүүлбэрт илүү их мэдээлэл багтаана. Хувиргахад гурван зүйл өөрчлөгдөнө: үйл үг нь дагавар авч нэр үг болно (-tion, -ment, -al, -ance, -ure), дайвар үг нь тэмдэг нэр болно (rose sharply → a sharp rise), эзэн ба тусагдахуун нь \'s буюу of-оор холбогдоно (the government\'s decision, the destruction of the forest). Мөн because, although зэрэг холбоосын оронд due to, despite, following гэх мэт угтвар үг орно. Гэхдээ nominalisation бол зөвхөн бичгийн, албан хэлний хэрэгсэл: өдөр тутмын ярианд, энгийн имэйлд үйл үгтэй хувилбар илүү тод, амьд сонсогдоно. Монгол хэл үйл үгийг нэр үг болгохдоо маш уян хатан («шийдэх → шийдвэр», «өсөх → өсөлт», «хөгжих → хөгжил») тул санаа нь танил; бэрхшээл нь англиар зөв дагавар, зөв угтвар үг (rise in, demand for) сонгоход оршино.',
  structure: 'Subject + Verb (+ Adverb) → (Possessive) + (Adjective) + Noun + of / in / for + Noun · because + clause → due to / despite / following + noun phrase',
  structureParts: [
    { text: 'The government\'s / The', part: 'subject' },
    { text: 'decision / rise / growth', part: 'object' },
    { text: 'of / in / to + Noun', part: 'modifier' },
    { text: '+ Verb …', part: 'verb' },
  ],
  tip: 'Үйл үг → нэр үг (decide → decision) · тэмдэг нэр → нэр үг (important → importance) · дайвар үг → тэмдэг нэр (rose sharply → a sharp rise) · because + өгүүлбэр → due to + нэр үг · Албан бичигт тохирно, ярианд хэтрүүлж болохгүй.',
  examples: [
    { en: '[The government\'s decision](s) [surprised](v) [everyone](o).', mn: 'Засгийн газрын шийдвэр хүн бүрийг гайхшруулав.' },
    { en: '[The flight](s) [was cancelled](v) [due to the heavy snowfall](m).', mn: 'Их цас орсны улмаас нислэг цуцлагдав.' },
    { en: '[The rapid growth of the city](s) [has created](v) [new problems](o).', mn: 'Хотын хурдацтай өсөлт шинэ асуудлуудыг бий болгожээ.' },
    { en: '[There](s) [has been](v) [a sharp increase in unemployment](o).', mn: 'Ажилгүйдэл огцом өссөн байна.' },
  ],
  useCases: [
    {
      title: 'Үйл үгийг нэр үг болгох — decide → decision',
      description: 'Үйлдлийг нэр үг болгож өгүүлбэрийн эзэн буюу тусагдахуун болгоно. Үйлдэгч нь \'s буюу of-оор, үйлдлийн тусагдахуун нь of-оор холбогдоно. She refused to help → her refusal to help; The president arrived → the arrival of the president.',
      examples: [
        { en: '[Her refusal to help](s) [came](v) [as a shock](m).', mn: 'Түүний туслахаас татгалзсан нь цочирдуулав.' },
        { en: '[The arrival of the president](s) [was delayed](v) [by fog](m).', mn: 'Ерөнхийлөгчийн ирэлт манангаас болж хойшлов.' },
        { en: '[The company](s) [announced](v) [the closure of two factories](o).', mn: 'Компани хоёр үйлдвэрээ хаахаа зарлав.' },
      ],
    },
    {
      title: 'Тэмдэг нэрийг нэр үг болгох — important → importance',
      description: 'Шинж чанарыг нэр үг болгож ерөнхий ойлголт мэт ярина: -ance / -ence, -ity, -ness, -th дагавартай. Sleep is important → the importance of sleep; He is able to … → his ability to …',
      examples: [
        { en: '[The importance of sleep](s) [is](v) [often underestimated](o).', mn: 'Нойрны ач холбогдлыг ихэвчлэн дутуу үнэлдэг.' },
        { en: '[His ability to stay calm](s) [impressed](v) [the interviewers](o).', mn: 'Түүний тайван байж чаддаг чадвар ярилцлага авагчдад сайшаагдав.' },
        { en: '[We](s) [were struck](v) [by the beauty of the landscape](m).', mn: 'Бид байгалийн үзэсгэлэнд сэтгэл хөдлөв.' },
      ],
    },
    {
      title: 'Гишүүн өгүүлбэрийг нэр үгийн бүлэг болгох — because prices rose → due to the rise in prices',
      description: 'because, although, after, before + өгүүлбэрийн оронд due to / because of / owing to, despite / in spite of, following, prior to + нэр үгийн бүлэг хэрэглэнэ. Угтвар үгийн ард эзэн + үйл үг орж болохгүй тул үйл үгийг нэр үг болгох шаардлагатай.',
      examples: [
        { en: '[Sales](s) [fell](v) [due to the rise in prices](m).', mn: 'Үнийн өсөлтөөс шалтгаалан борлуулалт буурав.' },
        { en: '[Despite his lack of experience](m), [he](s) [got](v) [the job](o).', mn: 'Туршлага дутмаг байсан ч тэр ажилд оров.' },
        { en: '[Following the announcement](m), [the share price](s) [dropped](v) [sharply](m).', mn: 'Мэдэгдлийн дараа хувьцааны үнэ огцом унав.' },
      ],
    },
    {
      title: 'Хувийн бус, бодитой өнгө — үйлдэгчийг орхих',
      description: 'Хэн хийсэн нь чухал биш буюу тодорхойгүй үед үйлдлийг нэр үг болгож гол сэдэв болгоно. People consume more energy → Energy consumption has increased. Тайлан, судалгаа, мэдээнд There has been + a / an + нэр үг гэсэн бүтэц түгээмэл.',
      examples: [
        { en: '[Energy consumption](s) [has doubled](v) [since 2000](m).', mn: '2000 оноос хойш эрчим хүчний хэрэглээ хоёр дахин нэмэгджээ.' },
        { en: '[The destruction of the rainforest](s) [continues](v) [at an alarming rate](m).', mn: 'Ширэнгэн ойн сүйрэл түгшүүртэй хурдаар үргэлжилсээр байна.' },
        { en: '[There](s) [is](v) [a growing demand for online courses](o).', mn: 'Онлайн сургалтын эрэлт өссөөр байна.' },
      ],
    },
    {
      title: 'Хэзээ хэтэрдэг вэ — нэр үгтэй ба үйл үгтэй хувилбарыг сонгох',
      description: 'Нэр үгийг make, give, carry out, reach, take зэрэг «хөнгөн» үйл үгтэй хослуулбал албан өнгө гарна (carry out an investigation). Гэвч нэг өгүүлбэрт хэд хэдэн nominalisation давхарлавал хүнд, бүрхэг болно. Яриа, энгийн захидалд үйл үгтэй хувилбар илүү тод.',
      examples: [
        { en: '[The police](s) [carried out](v) [an investigation into the causes of the fire](o).', mn: 'Цагдаа галын шалтгааныг тогтоох мөрдөн шалгалт явуулав. (албан, тайлангийн хэв маяг)' },
        { en: '[The police](s) [investigated](v) [why the fire had started](o).', mn: 'Цагдаа гал яагаад гарсныг шалгав. (энгийн, тод хэв маяг)' },
        { en: '[The two sides](s) [finally reached](v) [an agreement](o) [after long discussions](m).', mn: 'Хоёр тал удаан хэлэлцсэний эцэст тохиролцоонд хүрэв.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Possessive + нэр үг (+ to V1)',
      structure: 'noun\'s / my / his / their + (adjective) + noun (+ to + V1)',
      examples: [
        { en: '[The minister\'s resignation](s) [shocked](v) [the country](o).', mn: 'Сайдын огцрол улс орныг цочирдуулав.' },
        { en: '[We](s) [were surprised](v) [by her sudden decision to leave](m).', mn: 'Түүний гэнэт явахаар шийдсэнд бид гайхав.' },
        { en: '[The team\'s failure to qualify](s) [disappointed](v) [the fans](o).', mn: 'Баг шалгарч чадаагүй нь хөгжөөн дэмжигчдийн урмыг хугалав.' },
      ],
    },
    {
      label: 'the + нэр үг + of + нэр үг',
      structure: 'the + (adjective) + noun + of + noun (+ by + үйлдэгч)',
      examples: [
        { en: '[The introduction of the new law](s) [caused](v) [protests](o).', mn: 'Шинэ хуулийг хэрэгжүүлж эхэлсэн нь эсэргүүцэл дагуулав.' },
        { en: '[The development of new vaccines](s) [takes](v) [years](o).', mn: 'Шинэ вакцин боловсруулахад олон жил шаардагддаг.' },
        { en: '[The discovery of oil](s) [transformed](v) [the region\'s economy](o).', mn: 'Газрын тосны нээлт бүс нутгийн эдийн засгийг үндсээр нь өөрчилсөн.' },
      ],
    },
    {
      label: 'Угтвар үг + нэр үгийн бүлэг',
      structure: 'due to / because of / owing to / despite / in spite of / following / prior to + noun phrase',
      examples: [
        { en: '[The match](s) [was postponed](v) [because of the bad weather](m).', mn: 'Цаг агаар муу байснаас тоглолт хойшлов.' },
        { en: '[In spite of the increase in costs](m), [profits](s) [rose](v).', mn: 'Зардал өссөн хэдий ч ашиг нэмэгдэв.' },
        { en: '[Prior to his departure](m), [he](s) [called](v) [a meeting](o).', mn: 'Явахынхаа өмнө тэр хурал зарлав.' },
      ],
    },
    {
      label: 'Хөнгөн үйл үг + нэр үг',
      structure: 'make / give / take / have / reach / carry out + (a / an) + (adjective) + noun',
      examples: [
        { en: '[The committee](s) [made](v) [three recommendations](o).', mn: 'Хороо гурван зөвлөмж гаргав.' },
        { en: '[She](s) [gave](v) [a detailed explanation of the results](o).', mn: 'Тэр үр дүнгийн талаар дэлгэрэнгүй тайлбар өгөв.' },
        { en: '[Scientists](s) [have made](v) [an important discovery](o).', mn: 'Эрдэмтэд чухал нээлт хийжээ.' },
      ],
    },
  ],
  signalWords: ['-tion / -sion', '-ment', '-ance / -ence', '-al', '-ity', '-ness', 'the rise in', 'the lack of', 'due to', 'despite', 'following', 'prior to', 'There has been a…'],
  notes: [
    'Түгээмэл дагаварууд: -tion / -sion (decide → decision, reduce → reduction), -ment (develop → development), -al (arrive → arrival, refuse → refusal), -ance / -ence (perform → performance), -ure (fail → failure), -ity (able → ability), -ness (aware → awareness), -th (grow → growth, strong → strength).',
    'Зарим үг хэлбэрээ өөрчлөхгүйгээр нэр үг болно: rise, fall, increase, decrease, change, demand, lack, delay. increase, decrease-ийн өргөлт шилжинэ: үйл үгэнд inCREASE, нэр үгэнд INcrease.',
    'Үйл үг нэр үг болоход дайвар үг нь тэмдэг нэр болно: Prices rose sharply → a sharp rise in prices; The economy grew rapidly → the rapid growth of the economy. a sharply rise гэж хэлэхгүй.',
    'Нэр үг бүр өөрийн угтвар үгтэй: a rise / increase / fall / decrease IN; a demand / need / reason FOR; a solution / damage / access TO; an effect / impact ON; a lack OF. Эдгээрийг нэр үгтэй нь хамт цээжил.',
    'Үйлдэгч ба тусагдахууныг ингэж холбоно: The army destroyed the city → the army\'s destruction of the city буюу the destruction of the city by the army. Тусагдахуун нь бараг үргэлж of-оор орно.',
    'Хэтрүүлж болохгүй: The implementation of the reduction of costs was a decision of the management гэх мэт давхар nominalisation ойлгоход хүнд. Нэг өгүүлбэрт нэг хоёроор хязгаарлаж, ярианд The managers decided to cut costs гэж үйл үгээр хэл.',
  ],
  commonMistakes: [
    {
      wrong: 'Her refuse to apologise made things worse.',
      correct: 'Her refusal to apologise made things worse.',
      explanation: 'Эзэмшлийн үгийн (her) ард нэр үг хэрэгтэй. refuse бол үйл үг, нэр үгийн хэлбэр нь refusal. Дагаврыг үг бүрээр нь цээжлэх хэрэгтэй.',
    },
    {
      wrong: 'Because of prices increased, sales fell.',
      correct: 'Because of the increase in prices, sales fell.',
      explanation: 'because of, due to, despite нь угтвар үг тул ард нь эзэн + үйл үг биш, нэр үгийн бүлэг орно. Бүтэн өгүүлбэр хэрэгтэй бол because (of-гүй) хэрэглэнэ: Because prices increased, …',
    },
    {
      wrong: 'There was a sharply fall in sales last year.',
      correct: 'There was a sharp fall in sales last year.',
      explanation: 'fall энд нэр үг тул өмнө нь тэмдэг нэр (sharp) орно. Дайвар үг (sharply) зөвхөн үйл үгийг тодотгоно: Sales fell sharply.',
    },
    {
      wrong: 'Despite of his illness, he attended the meeting.',
      correct: 'Despite his illness, he attended the meeting.',
      explanation: 'despite-ийн ард of орохгүй, шууд нэр үг. of нь in spite of-д л байдаг: In spite of his illness. Энэ хоёрыг хольж болохгүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монгол хэл үйл үгийг нэр үг болгохдоо «-лт», «-вэр», «-л», «-аа», «-лага» зэрэг дагавар хэрэглэдэг: шийдэх → шийдвэр, өсөх → өсөлт, хөгжих → хөгжил, шалгах → шалгалт. Англиар яг ийм үүрэгтэй -tion, -ment, -al, -ance дагаврууд бий, гэхдээ аль үгэнд аль нь орохыг таах аргагүй тул үгтэй нь хамт тогтооно.',
      'Монголоор «үнэ өссөн учраас», «үнийн өсөлтөөс шалтгаалан» гэсэн хоёр хувилбарын хоёр дахь нь албан бичгийн хэв маяг байдаг. Англиар яг адил: because prices rose (энгийн) ба due to the rise in prices (албан). Хэв маягийн ялгаа хоёр хэлэнд таардаг.',
      'Монголоор нэр үгсийг харьяалахын тийн ялгалаар («-ын / -ийн») зүүнээс баруун тийш хэлхдэг: «шинэ хуулийн хэрэгжилт». Англиар дараалал нь эсрэгээр, of-оор холбогдоно: the implementation of the new law. Гол нэр үг англиар эхэнд, монголоор төгсгөлд байна.',
      'Монголоор «огцом өссөн» ба «огцом өсөлт» хоёрт «огцом» гэдэг үг хэлбэрээ өөрчлөхгүй. Англиар үйл үгтэй бол дайвар үг (rose sharply), нэр үгтэй бол тэмдэг нэр (a sharp rise) гэж заавал ялгана — монгол хүний хамгийн их гаргадаг алдаа энэ.',
    ],
  },
  dialogue: [
    {
      en: 'Temuulen, [the report](s) [sounds](v) [too informal](o). [Could](v) [we](s) [change](v) [the part about sales](o)?',
      mn: 'Тэмүүлэн, тайлан хэтэрхий энгийн хэллэгтэй сонсогдож байна. Борлуулалтын тухай хэсгийг өөрчилж болох уу?',
      speaker: 'Nomin',
    },
    {
      en: 'Sure. How about this: [The fall in sales](s) [was](v) [due to the rise in prices](m).',
      mn: 'Болно. Ингэвэл ямар вэ: Борлуулалтын бууралт нь үнийн өсөлтөөс шалтгаалсан.',
      speaker: 'Temuulen',
    },
    {
      en: 'Much better. [We](s) [also need](v) [an explanation of the delay in production](o).',
      mn: 'Хамаагүй дээр боллоо. Бидэнд бас үйлдвэрлэлийн саатлын тайлбар хэрэгтэй.',
      speaker: 'Nomin',
    },
    {
      en: '[The delay](s) [was caused](v) [by the late arrival of materials](m). [Shall](v) [I](s) [add](v) [that](o)?',
      mn: 'Саатал нь түүхий эд оройтож ирснээс үүдсэн. Үүнийг нэмэх үү?',
      speaker: 'Temuulen',
    },
    {
      en: 'Yes, please. [But](m) [don\'t overdo](v) [it](o) — [too many nouns](s) [make](v) [a report](o) [hard to read](o).',
      mn: 'Тэг, тэг. Гэхдээ бүү хэтрүүлээрэй — хэт олон нэр үг тайланг уншихад хүнд болгодог.',
      speaker: 'Nomin',
    },
    {
      en: 'Understood. [You](s)[\'ll have](v) [the final version](o) [before the start of the meeting](m).',
      mn: 'Ойлголоо. Хурал эхлэхээс өмнө эцсийн хувилбар танд очсон байна.',
      speaker: 'Temuulen',
    },
  ],
  quiz: [
    {
      id: 'c1-09-1',
      ruleId: 9,
      kind: 'fill',
      question: 'The ___ of the new airport took six years.',
      options: ['construction', 'construct', 'constructive', 'constructed'],
      answer: 'construction',
      explanation: 'The … of-ийн хооронд нэр үг хэрэгтэй: construct (үйл үг) → construction (нэр үг). constructive бол тэмдэг нэр, constructed бол V3.',
      hint: 'the + нэр үг + of.',
    },
    {
      id: 'c1-09-2',
      ruleId: 9,
      kind: 'fill',
      question: 'Many families are struggling because of ___ in food prices.',
      options: ['the sharp rise', 'the sharply rise', 'rose sharply', 'they rose sharply'],
      answer: 'the sharp rise',
      explanation: 'because of бол угтвар үг тул ард нь нэр үгийн бүлэг орно. rise нэр үг болсон тул өмнө нь тэмдэг нэр sharp (sharply биш). Эзэн + үйл үг буюу дан үйл үг because of-ийн ард орохгүй.',
      hint: 'Угтвар үгийн ард нэр үг; нэр үгийн өмнө тэмдэг нэр.',
    },
    {
      id: 'c1-09-3',
      ruleId: 9,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Her refuse to apologise made things worse.',
        'Despite of his illness, he attended the meeting.',
        'The discovery of penicillin changed medicine for ever.',
        'Because of prices increased, sales fell.',
      ],
      answer: 'The discovery of penicillin changed medicine for ever.',
      explanation: 'the + нэр үг (discovery) + of + нэр үг — зөв nominalisation. refuse-ийн нэр үг нь refusal; despite-ийн ард of орохгүй; because of-ийн ард өгүүлбэр биш нэр үгийн бүлэг (the increase in prices) орно.',
      hint: 'Зөв нэр үгийн хэлбэр ба зөв угтвар үгийг хай.',
    },
    {
      id: 'c1-09-4',
      ruleId: 9,
      kind: 'translate',
      question: 'Засгийн газрын татвар нэмэх шийдвэр олон нийтийн эсэргүүцэлтэй тулгарав.',
      options: [
        'The government\'s decision to raise taxes met with public opposition.',
        'The government\'s decide to raise taxes met with public opposition.',
        'The government decision raising taxes met with public oppose.',
        'The government decided to raise taxes met with public opposition.',
      ],
      answer: 'The government\'s decision to raise taxes met with public opposition.',
      explanation: '«Засгийн газрын … шийдвэр» = possessive + нэр үг + to + V1: the government\'s decision to raise taxes. «Эсэргүүцэл» = opposition (oppose биш). decided гэвэл өгүүлбэр хоёр бие даасан үйл үгтэй болж эвдэрнэ.',
      hint: 'decide → decision, oppose → opposition.',
    },
  ],
};
