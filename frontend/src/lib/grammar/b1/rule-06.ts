// frontend/src/lib/grammar/b1/rule-06.ts
// B1 дүрэм 6: Third conditional
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule06: GrammarRule = {
  id: 6,
  title: 'Third conditional',
  titleMn: 'Гуравдугаар нөхцөл — өнгөрсөнд өөрөөр болсон бол: харамсал, дүгнэлт',
  hook: '«Хэрэв би эрт гарсан бол автобусандаа амжих байсан» — өнгөрсөнд болчихсон, өөрчилж болохгүй зүйлийг «өөрөөр байсан бол» гэж эргэцүүлж сурцгаая.',
  summary: 'If + Past Perfect, + would have + Verb3 нь өнгөрсөнд бодитоор болоогүй нөхцөл ба түүний өнгөрсөн үр дагаврыг заана. Харамсал, шүүмжлэл, «яасан бол яах байсан» гэсэн дүгнэлтэд хэрэглэнэ. Одоо өөрчилж болохгүй.',
  description: 'B1-ийн өмнөх дүрэмд бид Second conditional (If I had time, I would help) — ОДООГИЙН бодит бус төсөөллийг үзсэн. Third conditional бол ӨНГӨРСНИЙ бодит бус төсөөлөл: аль хэдийн болчихсон зүйлийг «өөрөөр болсон бол» гэж эргэцүүлнэ. If I had left earlier, I would have caught the bus — би эрт гараагүй, автобусаа алдсан, одоо харамсаж байна. Хэлбэр нь хоёр талдаа «нэг алхам ухарсан»: if-ийн хэсэгт Past Perfect (had + V3), үр дагаврын хэсэгт would have + V3. B1-ийн 2-р дүрэмд үзсэн Past Perfect энд дахин гарч ирж байна. Second conditional-тай харьцуулбал: If I knew (одоо мэдэхгүй) — If I had known (тэр үед мэдээгүй). Гол хэрэглээ нь харамсал (I wish I had …-тэй төстэй), хэн нэгнийг шүүмжлэх (If you had listened to me, …), өнгөрсөн үйл явдлын шалтгааныг дүгнэх. would have-ын оронд could have (чадах байсан), might have (магадгүй) хэрэглэж болно. Монголоор «хэрэв … -сан бол … -х байсан» гэж Second conditional-тай адилхан хэлбэрээр хэлдэг тул контекстээс өнгөрсөн үү, одоо юу гэдгийг ялгаж, англиар зөв цагийг сонгох хэрэгтэй.',
  structure: 'If + subject + had + Verb3, + subject + would have + Verb3',
  structureParts: [
    { text: 'If', part: 'modifier' },
    { text: 'subject', part: 'subject' },
    { text: 'had + Verb3', part: 'verb' },
    { text: ', subject + would have + Verb3', part: 'plain' },
  ],
  tip: 'Second = одоо (If I had, I would do). Third = өнгөрсөн (If I had had, I would have done). Хоёр талдаа нэг алхам ухарна: had + V3 … would have + V3.',
  examples: [
    { en: '[If I had left earlier](m), [I](s) [would have caught](v) [the bus](o).', mn: 'Хэрэв би эрт гарсан бол автобусандаа амжих байсан.' },
    { en: '[If you had told me](m), [I](s) [would have helped](v) [you](o).', mn: 'Хэрэв чи надад хэлсэн бол би чамд туслах байсан.' },
    { en: '[She](s) [wouldn\'t have missed](v) [the flight](o) [if she had set an alarm](m).', mn: 'Хэрэв тэр сэрүүлэг тавьсан бол нислэгээ алдахгүй байх байсан.' },
    { en: '[What](o) [would](v) [you](s) [have done](v) [if you had been there](m)?', mn: 'Хэрэв чи тэнд байсан бол юу хийх байсан бэ?' },
  ],
  useCases: [
    {
      title: 'Харамсал — өөрөөр хийсэн бол',
      description: 'Хамгийн түгээмэл хэрэглээ. Өнгөрсөнд хийгээгүй (эсвэл хийсэн) зүйлдээ харамсаж «тэгсэн бол» гэж эргэцүүлнэ. Нөхцөл нь өнгөрсөн бодит байдлын эсрэг.',
      examples: [
        { en: '[If I had studied harder](m), [I](s) [would have passed](v) [the exam](o).', mn: 'Хэрэв би илүү шаргуу хичээлэлсэн бол шалгалтаа давах байсан.' },
        { en: '[If we had booked earlier](m), [we](s) [would have got](v) [cheaper tickets](o).', mn: 'Хэрэв бид эрт захиалсан бол хямд тасалбар авах байсан.' },
        { en: '[I](s) [would have called](v) [you](o) [if I hadn\'t lost my phone](m).', mn: 'Хэрэв би утсаа гээгээгүй бол чам руу залгах байсан.' },
      ],
    },
    {
      title: 'Шүүмжлэл — чи тэгсэн бол',
      description: 'Хэн нэгний өнгөрсөн үйлдлийг шүүмжилж «хэрэв чи … байсан бол ийм зүйл болохгүй байсан» гэж хэлнэ. Ярианы хэлэнд их гардаг, заримдаа зэмлэсэн өнгөтэй.',
      examples: [
        { en: '[If you had listened to me](m), [this](s) [wouldn\'t have happened](v).', mn: 'Хэрэв чи намайг сонссон бол ийм зүйл болохгүй байсан.' },
        { en: '[If he had driven more carefully](m), [he](s) [wouldn\'t have crashed](v).', mn: 'Хэрэв тэр илүү болгоомжтой жолоодсон бол мөргөлдөхгүй байх байсан.' },
        { en: '[You](s) [would have arrived](v) [on time](m) [if you had taken a taxi](m).', mn: 'Хэрэв чи такси авсан бол цагтаа ирэх байсан.' },
      ],
    },
    {
      title: 'Өнгөрсний дүгнэлт — азаар, аз болоход',
      description: 'Заримдаа сайн үр дүн гарсан ч «өөрөөр болсон бол муу байх байсан» гэж дүгнэнэ. Мөн түүхэн үйл явдлын тухай «тэгээгүй бол» гэж ярихад хэрэглэнэ.',
      examples: [
        { en: '[If we had taken that road](m), [we](s) [would have been](v) [stuck in traffic](m). Lucky us!', mn: 'Хэрэв бид тэр замаар явсан бол түгжрэлд гацах байсан. Азтай юм!' },
        { en: '[If she hadn\'t moved to the city](m), [she](s) [would never have met](v) [her husband](o).', mn: 'Хэрэв тэр хот руу нүүгээгүй бол нөхөртэйгөө хэзээ ч уулзахгүй байх байсан.' },
        { en: '[If it hadn\'t rained](m), [the harvest](s) [would have failed](v).', mn: 'Хэрэв бороо ороогүй бол ургац муудах байсан.' },
      ],
    },
    {
      title: 'could have / might have — would have-ын оронд',
      description: 'could have + V3 нь «чадах байсан, боломжтой байсан», might have + V3 нь «магадгүй … байсан» гэсэн утгаар would have-ыг орлоно. Магадлалын түвшин өөр.',
      examples: [
        { en: '[If you had asked me](m), [I](s) [could have lent](v) [you](o) [the money](o).', mn: 'Хэрэв чи надаас гуйсан бол би чамд мөнгө зээлж чадах байсан.' },
        { en: '[If we had left earlier](m), [we](s) [might have avoided](v) [the traffic](o).', mn: 'Хэрэв бид эрт гарсан бол түгжрэлээс зайлсхийж магадгүй байсан.' },
        { en: '[He](s) [could have won](v) [if he hadn\'t fallen](m).', mn: 'Хэрэв тэр унаагүй бол хожиж чадах байсан.' },
      ],
    },
    {
      title: 'Second conditional-аас ялгаа — одоо уу, өнгөрсөн үү',
      description: 'Second conditional одоогийн бодит бус байдал (өөрчлөгдөж болно), Third conditional өнгөрсний бодит бус байдал (өөрчлөгдөхгүй). Монголоор хоёулаа «-сан бол -х байсан» тул англиар цагийг нь сайн ялгах хэрэгтэй.',
      examples: [
        { en: '[If I knew](v) [the answer](o), [I](s) [would tell](v) [you](o).', mn: 'Хэрэв би хариултыг мэддэг байсан бол чамд хэлэх байсан. (одоо мэдэхгүй)' },
        { en: '[If I had known](v) [the answer](o), [I](s) [would have told](v) [you](o).', mn: 'Хэрэв би хариултыг мэдсэн бол чамд хэлэх байсан. (тэр үед мэдээгүй)' },
        { en: '[If I had money](o), [I](s)[\'d buy](v) [it](o). [If I had had money](o) [yesterday](m), [I](s)[\'d have bought](v) [it](o).', mn: 'Хэрэв надад мөнгө байсан бол авах байсан. Хэрэв өчигдөр надад мөнгө байсан бол авчих байсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Батлах',
      structure: 'If + subject + had + V3, + subject + would have + V3',
      examples: [
        { en: '[If she had seen](v) [the sign](o), [she](s) [would have stopped](v).', mn: 'Хэрэв тэр тэмдгийг харсан бол зогсох байсан.' },
        { en: '[If we had known](v) [about the party](o), [we](s) [would have come](v).', mn: 'Хэрэв бид үдэшлэгийн тухай мэдсэн бол ирэх байсан.' },
        { en: '[They](s) [would have won](v) [the match](o) [if they had played better](m).', mn: 'Хэрэв тэд илүү сайн тоглосон бол тэмцээнд ялах байсан.' },
      ],
    },
    {
      label: 'Үгүйсгэх',
      structure: 'If + subject + hadn\'t + V3, + subject + wouldn\'t have + V3',
      examples: [
        { en: '[If I hadn\'t missed](v) [the bus](o), [I](s) [wouldn\'t have been](v) [late](o).', mn: 'Хэрэв би автобусаа алдаагүй бол хоцрохгүй байх байсан.' },
        { en: '[If you hadn\'t helped](v) [me](o), [I](s) [wouldn\'t have finished](v) [on time](m).', mn: 'Хэрэв чи надад туслаагүй бол би цагтаа дуусгахгүй байх байсан.' },
        { en: '[She](s) [wouldn\'t have got](v) [the job](o) [if she hadn\'t prepared](m).', mn: 'Хэрэв тэр бэлдээгүй бол ажилд орохгүй байх байсан.' },
      ],
    },
    {
      label: 'Асуух',
      structure: 'What would + subject + have + V3 + if + subject + had + V3?',
      examples: [
        { en: '[What](o) [would](v) [you](s) [have done](v) [if you had lost your passport](m)?', mn: 'Хэрэв чи паспортоо гээсэн бол юу хийх байсан бэ?' },
        { en: '[Would](v) [you](s) [have come](v) [if I had invited you](m)?', mn: 'Хэрэв би чамайг урьсан бол чи ирэх байсан уу?' },
        { en: '[Where](m) [would](v) [they](s) [have gone](v) [if the hotel had been full](m)?', mn: 'Хэрэв зочид буудал дүүрэн байсан бол тэд хаашаа явах байсан бэ?' },
      ],
    },
    {
      label: 'Товчлол',
      structure: 'I\'d have = I would have · I\'d = I had · would\'ve = would have (ярианд)',
      examples: [
        { en: '[If I\'d known](v), [I](s)[\'d have come](v).', mn: 'Хэрэв би мэдсэн бол ирэх байсан.' },
        { en: '[If you\'d asked](v), [I](s) [would\'ve said](v) [yes](o).', mn: 'Хэрэв чи асуусан бол би тийм гэж хэлэх байсан.' },
        { en: '[We](s)[\'d have missed](v) [it](o) [if we\'d been late](m).', mn: 'Хэрэв бид хоцорсон бол үүнийг алдах байсан.' },
      ],
    },
  ],
  signalWords: ['if … had', 'would have', 'wouldn\'t have', 'could have', 'might have', 'if only', 'if I\'d known'],
  notes: [
    'If-ийн хэсэгт would have хэрэглэхгүй: If I would have known (буруу) → If I had known (зөв). would have зөвхөн үр дагаврын хэсэгт.',
    'would have-ын ард үргэлж Verb3: would have went (буруу) → would have gone (зөв). Дүрмийн бус үйл үгсийн V3-г сайн мэдэх хэрэгтэй.',
    'Third conditional зөвхөн өнгөрсний тухай. Нөхцөл ч, үр дагавар ч аль хэдийн болчихсон, өөрчилж болохгүй. Одоогийн байдлын тухай бол Second conditional.',
    'Ярианы хэлэнд would have → would\'ve → «вудав» шиг сонсогддог. Хүмүүс would of гэж буруу бичдэг — энэ нь алдаа, зөв нь would have / would\'ve.',
    'if only + Past Perfect гэвэл хүчтэй харамсал: If only I had listened! — Би сонссон бол ямар сайн байх байсан бэ! Үүнийг B1-ийн 15-р дүрэмд (wish) дэлгэрүүлнэ.',
    'Second ба Third-ийг холих «холимог нөхцөл» бас байдаг (If I had studied medicine, I would be a doctor now — өнгөрсөн нөхцөл, одоогийн үр дагавар). Энэ B2 түвшний сэдэв.',
  ],
  commonMistakes: [
    {
      wrong: 'If I would have known, I would have come.',
      correct: 'If I had known, I would have come.',
      explanation: 'If-ийн хэсэгт would have хэрэглэхгүй — Past Perfect (had known). Монголоор хоёр талд «-сан бол … байсан» гэдэг тул давхар would тавих алдаа гардаг.',
    },
    {
      wrong: 'If she had studied, she would pass the exam.',
      correct: 'If she had studied, she would have passed the exam.',
      explanation: 'If-ийн хэсэг Past Perfect бол үр дагавар нь would have + V3 байх ёстой. would pass гэвэл одоогийн үр дагавар болж холимог нөхцөл үүснэ, энд өнгөрсөн шалгалтын тухай.',
    },
    {
      wrong: 'If we had left earlier, we would have catch the train.',
      correct: 'If we had left earlier, we would have caught the train.',
      explanation: 'would have-ын ард V3 (caught), V1 биш. have-ын ард үргэлж V3 гэдгийг Present Perfect-ээс санаарай.',
    },
    {
      wrong: 'If I knew about the meeting yesterday, I would have come.',
      correct: 'If I had known about the meeting yesterday, I would have come.',
      explanation: 'yesterday — өнгөрсөн нөхцөл тул if-ийн хэсэгт Past Perfect. Past Simple (knew) хэрэглэвэл Second conditional болж, «одоо мэдэхгүй» гэсэн утга гарна.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор Second ба Third conditional хоёулаа «хэрэв … -сан бол … -х байсан» гэж ИЖИЛ хэлбэрээр хэлэгддэг: «мэддэг байсан бол хэлэх байсан» (одоо) / «мэдсэн бол хэлэх байсан» (өнгөрсөн). Англиар цаг нь ялгаатай (had known / would have told) тул монголоос орчуулахдаа «хэзээний тухай вэ» гэж заавал бодох хэрэгтэй.',
      'Монголоор «-даг байсан бол» (мэддэг байсан бол) нь ихэвчлэн одоогийн байдал (Second), «-сан бол» (мэдсэн бол) нь ихэвчлэн өнгөрсөн (Third) гэж ялгаж болно, гэхдээ энэ хатуу дүрэм биш — контекст шийднэ.',
      'Монголоор «-чих байсан» (авчих байсан, амжчих байсан) гэсэн хэлбэр өнгөрсний бүрэн дууссан үр дагаврыг зааж, would have + V3-тай илүү ойр байдаг: «амжчих байсан» = would have caught.',
      'Монголоор харамслыг «-сан бол яасан юм бэ», «-сан бол дээр байсан» гэж бас хэлдэг. Англиар үүнийг If only I had … / I should have … гэж хэлнэ; Third conditional бол харамслаа бүтэн нөхцөл-үр дагавраар тайлбарлах хэлбэр.',
    ],
  },
  dialogue: [
    {
      en: 'Saraa, [you](s) [look](v) [upset](o). [What](s) [happened](v)?',
      mn: 'Сараа, чи сэтгэл гонсойсон харагдаж байна. Юу болов?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [failed](v) [my driving test](o). [If I had practised more](m), [I](s) [would have passed](v).',
      mn: 'Би жолооны шалгалтад унасан. Хэрэв би илүү их дадлага хийсэн бол давах байсан.',
      speaker: 'Saraa',
    },
    {
      en: 'Oh no. [What](s) [went wrong](v)?',
      mn: 'Ёстой яасан юм. Юу нь болоогүй юм бэ?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [didn\'t see](v) [a stop sign](o). [If I had seen it](m), [I](s) [would have stopped](v), [of course](m).',
      mn: 'Би зогсох тэмдгийг хараагүй. Хэрэв харсан бол мэдээж зогсох байсан.',
      speaker: 'Saraa',
    },
    {
      en: '[If you had told me](m), [I](s) [could have taken](v) [you](o) [out](m) [to practise](m) [last weekend](m).',
      mn: 'Хэрэв чи надад хэлсэн бол би өнгөрсөн амралтын өдөр чамайг дадлага хийлгэж чадах байсан.',
      speaker: 'Bat',
    },
    {
      en: 'I know. [If I hadn\'t been so confident](m), [I](s) [would have asked](v) [for help](o). Next time!',
      mn: 'Мэдэж байна. Хэрэв би тийм их өөртөө итгээгүй бол тусламж гуйх байсан. Дараагийн удаа!',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'b1-06-1',
      ruleId: 6,
      kind: 'fill',
      question: 'If I ___ about the traffic, I would have left earlier.',
      options: ['knew', 'had known', 'would know', 'have known'],
      answer: 'had known',
      explanation: 'Үр дагаврын хэсэгт would have left байгаа тул Third conditional — if-ийн хэсэгт Past Perfect: had known. knew бол Second conditional болно.',
      hint: 'would have байвал if-ийн хэсэгт ямар цаг вэ?',
    },
    {
      id: 'b1-06-2',
      ruleId: 6,
      kind: 'fill',
      question: 'She ___ the job if she had prepared for the interview.',
      options: ['would get', 'got', 'would have got', 'will get'],
      answer: 'would have got',
      explanation: 'If-ийн хэсэг Past Perfect (had prepared) тул үр дагавар would have + V3: would have got. Өнгөрсөн ярилцлагын тухай.',
      hint: 'had prepared → would have …',
    },
    {
      id: 'b1-06-3',
      ruleId: 6,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'If I would have seen you, I would have said hello.',
        'If I had seen you, I would have said hello.',
        'If I had seen you, I would say hello.',
        'If I saw you yesterday, I would have said hello.',
      ],
      answer: 'If I had seen you, I would have said hello.',
      explanation: 'Third conditional: If + had + V3, would have + V3. If-ийн хэсэгт would байхгүй; өнгөрсөн нөхцөлд Past Perfect; хоёр тал зэрэг өнгөрсөн байна.',
      hint: 'Хоёр талдаа нэг алхам ухарсан байх ёстой.',
    },
    {
      id: 'b1-06-4',
      ruleId: 6,
      kind: 'translate',
      question: 'Хэрэв бид эрт гарсан бол галт тэргэндээ амжих байсан.',
      options: [
        'If we had left earlier, we would have caught the train.',
        'If we left earlier, we would catch the train.',
        'If we had left earlier, we would catch the train.',
        'If we would leave earlier, we would have caught the train.',
      ],
      answer: 'If we had left earlier, we would have caught the train.',
      explanation: '«Гарсан бол амжих байсан» — өнгөрсөнд гараагүй, амжаагүй, одоо харамсаж байна. Third conditional: had left … would have caught.',
      hint: 'Болчихсон зүйл — өнгөрсний харамсал.',
    },
  ],
};
