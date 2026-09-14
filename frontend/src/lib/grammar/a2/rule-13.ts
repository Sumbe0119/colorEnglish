// frontend/src/lib/grammar/a2/rule-13.ts
// A2 дүрэм 13: because / although / however
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule13: GrammarRule = {
  id: 13,
  title: 'because / although / however',
  titleMn: 'Холбоос үгс — шалтгаан, үр дагавар, эсрэгцэл',
  hook: '«Бороо орсон учраас гэртээ үлдсэн. Хэдийгээр ядарсан ч ажилласан. Гэвч …» — хоёр санааг нэг утсаар холбож сурцгаая.',
  summary: 'because шалтгаан, so үр дагавар, although / even though нэг өгүүлбэр доторх эсрэгцэл, however шинэ өгүүлбэр эхлүүлэх эсрэгцлийг заана. Эдгээр үгийг зөв газар нь тавьж, таслалыг нь зөв хэрэглэвэл богино өгүүлбэрүүд чинь урсамтгай яриа болно.',
  description: 'A1 түвшинд бид and, but, or гэсэн гурван холбоос үгээр өгүүлбэр холбож сурсан. Одоо санаа хоорондын хамаарлыг илүү нарийн заах үгсийг үзнэ. because (учир нь) шалтгаанаа хэлнэ: I stayed at home because it was raining. so (тиймээс) үр дагаврыг хэлнэ: It was raining, so I stayed at home. although болон even though (хэдийгээр) хоёр эсрэг санааг нэг өгүүлбэрт багтаана: Although it was raining, we went out. however (гэвч, гэхдээ) мөн эсрэгцэл заадаг боловч энэ нь шинэ өгүүлбэрийг эхлүүлдэг, ардаа заавал таслалтай: It was raining. However, we went out. Монголоор шалтгааныг «учир нь», «тул», «болохоор» гэж үйл үгийн ард залгадаг бол англиар because-ийн ард бүтэн өгүүлбэр (эзэн + үйл үг) ирдэг. Энэ дөрвөн үгийг ялгаж чадвал бичих, ярих хэл чинь А1-ийн тасархай өгүүлбэрээс гарч, жинхэнэ холбоотой яриа болно.',
  structure: 'Clause + because / although + subject + verb …',
  structureParts: [
    { text: 'Clause', part: 'plain' },
    { text: 'because / although', part: 'modifier' },
    { text: 'subject', part: 'subject' },
    { text: 'verb …', part: 'verb' },
  ],
  tip: 'because = «яагаад?»-ын хариулт · so = «тэгээд юу болсон?»-ын хариулт · although = нэг өгүүлбэр дотор «хэдийгээр … ч» · however = цэгийн дараа, таслалтай «Гэвч, …».',
  examples: [
    { en: '[I](s) [stayed](v) [at home](m) [because it was raining](m).', mn: 'Бороо орж байсан учраас би гэртээ үлдсэн.' },
    { en: '[It](s) [was](v) [late](o), [so](m) [we](s) [took](v) [a taxi](o).', mn: 'Орой болсон байсан тул бид такси авсан.' },
    { en: '[Although he was tired](m), [he](s) [finished](v) [his homework](o).', mn: 'Хэдийгээр тэр ядарсан ч гэрийн даалгавраа дуусгасан.' },
    { en: '[The hotel](s) [was](v) [expensive](o). [However](m), [the room](s) [was](v) [very small](o).', mn: 'Зочид буудал үнэтэй байсан. Гэвч өрөө нь маш жижиг байсан.' },
  ],
  useCases: [
    {
      title: 'Шалтгаан хэлэх — because',
      description: 'Ямар нэг зүйл яагаад болсныг because-ийн ард бүтэн өгүүлбэрээр тайлбарлана. Ихэвчлэн because өгүүлбэрийн дунд ордог, тэгэхэд таслал хэрэггүй. Өгүүлбэрийн эхэнд тавьбал хоёр хэсгийн дунд таслал тавина.',
      examples: [
        { en: '[She](s) [was](v) [late](o) [because she missed the bus](m).', mn: 'Тэр автобусаа алдсан учраас хоцорсон.' },
        { en: '[Because it was cold](m), [we](s) [closed](v) [the windows](o).', mn: 'Хүйтэн байсан болохоор бид цонхоо хаасан.' },
        { en: '[I](s) [like](v) [this café](o) [because the coffee is cheap](m).', mn: 'Кофе нь хямд учраас би энэ кафед дуртай.' },
      ],
    },
    {
      title: 'Үр дагавар хэлэх — so',
      description: 'so нь because-ийн эсрэг чиглэлтэй: эхлээд шалтгаан, дараа нь so + үр дагавар. so-гийн өмнө таслал тавина. Нэг өгүүлбэрт because болон so хоёрыг хамт хэрэглэхгүй.',
      examples: [
        { en: '[I](s) [was](v) [hungry](o), [so](m) [I](s) [made](v) [a sandwich](o).', mn: 'Би өлссөн байсан тул сэндвич хийсэн.' },
        { en: '[The shop](s) [was](v) [closed](o), [so](m) [we](s) [went](v) [home](m).', mn: 'Дэлгүүр хаалттай байсан болохоор бид гэр лүүгээ явсан.' },
        { en: '[He](s) [didn\'t study](v), [so](m) [he](s) [failed](v) [the test](o).', mn: 'Тэр хичээлээ давтаагүй, тиймээс шалгалтад унасан.' },
      ],
    },
    {
      title: 'Нэг өгүүлбэр доторх эсрэгцэл — although / even though',
      description: 'Хүлээгдэж байснаас өөр зүйл болсныг хэлэхэд although ашиглана. even though нь although-той яг адил утгатай боловч илүү хүчтэй, гайхсан аястай. Эхэнд тавьбал таслалтай, дунд тавьбал таслалгүй.',
      examples: [
        { en: '[Although it was expensive](m), [she](s) [bought](v) [the dress](o).', mn: 'Хэдийгээр үнэтэй байсан ч тэр даашинзыг худалдаж авсан.' },
        { en: '[We](s) [enjoyed](v) [the trip](o) [although the weather was bad](m).', mn: 'Хэдийгээр цаг агаар муу байсан ч бид аялалаа сайхан өнгөрөөсөн.' },
        { en: '[Even though he is 70](m), [he](s) [runs](v) [every morning](m).', mn: 'Тэр 70 настай хэдий ч өглөө бүр гүйдэг.' },
      ],
    },
    {
      title: 'Шинэ өгүүлбэрээр эсрэгцэл — however',
      description: 'however бол «гэвч, гэхдээ» гэсэн утгатай, ихэвчлэн бичгийн хэлэнд хэрэглэдэг. Өмнөх өгүүлбэр цэгээр төгсөж, however шинэ өгүүлбэрийг эхлүүлээд, ардаа заавал таслалтай байна.',
      examples: [
        { en: '[I](s) [wanted](v) [to go out](o). [However](m), [it](s) [started](v) [to snow](o).', mn: 'Би гадуур гармаар байсан. Гэвч цас орж эхэлсэн.' },
        { en: '[The phone](s) [is](v) [very good](o). [However](m), [it](s) [is](v) [too expensive](o).', mn: 'Утас нь маш сайн. Гэхдээ хэт үнэтэй.' },
        { en: '[He](s) [studied](v) [hard](m). [However](m), [he](s) [didn\'t pass](v) [the exam](o).', mn: 'Тэр шаргуу хичээлэлсэн. Гэвч шалгалтаа давж чадаагүй.' },
      ],
    },
    {
      title: 'but / although / however — алийг сонгох вэ',
      description: 'Гурвуулаа эсрэгцэл заана, ялгаа нь байрлал болон хэв маягт. but нь хоёр өгүүлбэрийн дунд, таслалын ард орно (ярианы хэл). although бүлэг өгүүлбэрийн эхэнд орно. however шинэ өгүүлбэр эхлүүлнэ (бичгийн хэл). Нэг өгүүлбэрт but болон although хоёрыг зэрэг хэрэглэхгүй.',
      examples: [
        { en: '[It](s) [was](v) [cold](o), [but](m) [we](s) [went](v) [swimming](o).', mn: 'Хүйтэн байсан, гэхдээ бид усанд сэлэхээр явсан.' },
        { en: '[Although it was cold](m), [we](s) [went](v) [swimming](o).', mn: 'Хэдийгээр хүйтэн байсан ч бид усанд сэлэхээр явсан.' },
        { en: '[It](s) [was](v) [cold](o). [However](m), [we](s) [went](v) [swimming](o).', mn: 'Хүйтэн байсан. Гэвч бид усанд сэлэхээр явсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Шалтгаан — because',
      structure: 'Main clause + because + subject + verb · Because + subject + verb, + main clause',
      examples: [
        { en: '[We](s) [stayed](v) [inside](m) [because it was too hot](m).', mn: 'Хэт халуун байсан учраас бид дотроо үлдсэн.' },
        { en: '[Because I was sick](m), [I](s) [didn\'t go](v) [to work](m).', mn: 'Би өвчтэй байсан болохоор ажилдаа яваагүй.' },
        { en: '[They](s) [are](v) [happy](o) [because they passed the exam](m).', mn: 'Шалгалтаа давсан учраас тэд баяртай байна.' },
      ],
    },
    {
      label: 'Үр дагавар — so',
      structure: 'Clause, + so + subject + verb',
      examples: [
        { en: '[My car](s) [broke down](v), [so](m) [I](s) [walked](v) [to work](m).', mn: 'Машин минь эвдэрсэн тул би ажил руугаа алхсан.' },
        { en: '[It](s) [was](v) [her birthday](o), [so](m) [we](s) [bought](v) [a cake](o).', mn: 'Түүний төрсөн өдөр байсан болохоор бид бялуу авсан.' },
        { en: '[The bus](s) [was](v) [full](o), [so](m) [we](s) [waited](v) [for the next one](m).', mn: 'Автобус дүүрэн байсан тул бид дараагийнхыг хүлээсэн.' },
      ],
    },
    {
      label: 'Эсрэгцэл нэг өгүүлбэрт — although / even though',
      structure: 'Although + subject + verb, + main clause · Main clause + although + subject + verb',
      examples: [
        { en: '[Although she was busy](m), [she](s) [helped](v) [me](o).', mn: 'Хэдийгээр тэр завгүй байсан ч надад тусалсан.' },
        { en: '[I](s) [still feel](v) [tired](o) [even though I slept ten hours](m).', mn: 'Арван цаг унтсан хэдий ч би одоо ч ядарсан хэвээр байна.' },
        { en: '[Even though the film was long](m), [nobody](s) [left](v).', mn: 'Хэдийгээр кино урт байсан ч хэн ч гарч яваагүй.' },
      ],
    },
    {
      label: 'Эсрэгцэл шинэ өгүүлбэрт — however',
      structure: 'Sentence. + However, + subject + verb',
      examples: [
        { en: '[The test](s) [was](v) [difficult](o). [However](m), [most students](s) [passed](v).', mn: 'Шалгалт хэцүү байсан. Гэвч ихэнх сурагчид давсан.' },
        { en: '[I](s) [love](v) [this city](o). [However](m), [the winters](s) [are](v) [very cold](o).', mn: 'Би энэ хотод хайртай. Гэхдээ өвөл нь маш хүйтэн.' },
        { en: '[She](s) [wanted](v) [a new laptop](o). [However](m), [she](s) [didn\'t have](v) [enough money](o).', mn: 'Тэр шинэ зөөврийн компьютер авахыг хүссэн. Гэвч түүнд хангалттай мөнгө байгаагүй.' },
      ],
    },
  ],
  signalWords: ['because', 'so', 'although', 'even though', 'however', 'but', 'because of'],
  notes: [
    'because-ийн ард заавал эзэн + үйл үг бүхий бүтэн өгүүлбэр ирнэ: because it rained. Харин нэр үгийн өмнө because of хэрэглэнэ: because of the rain. «because of it rained» гэж хэлэхгүй.',
    'because өгүүлбэрийн дунд орвол таслал хэрэггүй. Эхэнд орвол хоёр хэсгийн хооронд таслал тавина: Because it was late, we left.',
    'so-гийн өмнө үргэлж таслал байна: It was late, so we left. Нэг өгүүлбэрт because болон so-г хамт хэрэглэхгүй: «Because it was late, so we left» буруу.',
    'although болон even though ижил утгатай; even though нь илүү хүчтэй, «тэгсэн мөртлөө» гэсэн өнгөтэй. Ярианы хэлэнд though-г өгүүлбэрийн төгсгөлд дангаар нь тавьж болно: It was cold. We went out, though.',
    'however-ийн ард заавал таслал тавина, өмнө нь цэг эсвэл цэгтэй таслал байна: … expensive. However, … Дунд нь таслалаар холбож «It was expensive, however I bought it» гэвэл алдаа.',
    'Ярианы хэлэнд эсрэгцлийг ихэвчлэн but-аар, бичгийн хэлэнд although / however-оор илэрхийлдэг. Эссэ, имэйл бичихдээ however-ийг сонгоорой.',
  ],
  commonMistakes: [
    {
      wrong: 'Although it was raining, but we went out.',
      correct: 'Although it was raining, we went out.',
      explanation: 'Монголоор «хэдийгээр … ч гэсэн» гэж хоёр талаас нь заадаг тул although-той but-ыг давхар тавих алдаа гардаг. Англиар нэг эсрэгцэлд нэг л холбоос үг хэрэглэнэ.',
    },
    {
      wrong: 'I stayed at home because of it was raining.',
      correct: 'I stayed at home because it was raining.',
      explanation: 'because of-ийн ард зөвхөн нэр үг орно (because of the rain). Ард нь эзэн + үйл үг байвал зөвхөн because хэрэглэнэ.',
    },
    {
      wrong: 'The hotel was nice, however the food was bad.',
      correct: 'The hotel was nice. However, the food was bad.',
      explanation: 'however нь but шиг хоёр өгүүлбэрийн дунд таслалаар холбогдохгүй. Өмнөх өгүүлбэрийг цэгээр төгсгөж, However-ийн ард таслал тавина.',
    },
    {
      wrong: 'Because I was tired, so I went to bed early.',
      correct: 'I was tired, so I went to bed early.',
      explanation: 'Монголоор «… учраас, тиймээс …» гэж хоёуланг нь хэлэх нь зүйтэй мэт санагддаг. Англиар because эсвэл so хоёрын зөвхөн нэгийг сонгоно.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор шалтгааныг «-сан учраас», «-сан тул», «-сан болохоор» гэж үйл үгийн ард залгадаг бөгөөд шалтгаан нь үргэлж түрүүлж ирдэг. Англиар because нь ихэвчлэн өгүүлбэрийн дунд орж, шалтгаан нь хойно ирдэг: I stayed at home because it was raining.',
      'Монголоор «хэдийгээр … ч» гэж хоёр талаас нь хааж заадаг. Англиар although нэг л газар, бүлэг өгүүлбэрийн эхэнд орно, «ч» гэсэн хоёр дахь үг байхгүй. Тиймээс although-той but давхар хэрэглэх нь алдаа.',
      'Монголоор «гэвч», «гэхдээ» хоёрыг ярианд ч, бичигт ч ялгалгүй хэрэглэдэг. Англиар but ярианы, however бичгийн хэлний үг бөгөөд however-ийн таслал, цэгийн дүрэм хатуу.',
      'Монголоор «-аас болж», «-ын улмаас» гэж нэр үгэнд залгадаг шалтгааныг англиар because of + нэр үг гэж хэлнэ: because of the snow — цаснаас болж. Үйл үгтэй шалтгаан бол because, нэр үгтэй бол because of гэж ялгаж санаарай.',
    ],
  },
  dialogue: [
    {
      en: 'Hi Saraa! [Why](m) [were](v) [you](s) [late](o) [this morning](m)?',
      mn: 'Сайн уу, Сараа! Чи өнөө өглөө яагаад хоцорсон бэ?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [was](v) [late](o) [because my alarm didn\'t ring](m). [So](m) [I](s) [missed](v) [the first bus](o).',
      mn: 'Сэрүүлэг минь дуугараагүй учраас хоцорсон. Тэгээд эхний автобусаа алдчихсан.',
      speaker: 'Saraa',
    },
    {
      en: 'Oh no. [Did](v) [the teacher](s) [say](v) [anything](o)?',
      mn: 'Өө, яасан гэж. Багш юм хэлсэн үү?',
      speaker: 'Bat',
    },
    {
      en: '[Although I was twenty minutes late](m), [she](s) [wasn\'t](v) [angry](o).',
      mn: 'Хэдийгээр би хорин минут хоцорсон ч багш уурлаагүй.',
      speaker: 'Saraa',
    },
    {
      en: '[You](s)[\'re](v) [lucky](o)! [My teacher](s) [is](v) [kind](o). [However](m), [she](s) [hates](v) [late students](o).',
      mn: 'Азтай юм аа! Манай багш эелдэг. Гэхдээ хоцорсон сурагчдад дургүй.',
      speaker: 'Bat',
    },
    {
      en: '[Then](m) [you](s) [should buy](v) [a new alarm clock](o) [because of that](m)!',
      mn: 'Тэгвэл чи түүнээс болж шинэ сэрүүлэгтэй цаг авах хэрэгтэй!',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-13-1',
      ruleId: 13,
      kind: 'fill',
      question: 'We didn\'t go to the park ___ it was raining.',
      options: ['so', 'because', 'although', 'however'],
      answer: 'because',
      explanation: 'Бороо орсон нь паркт очоогүйн шалтгаан тул because. so үр дагавар заана, although эсрэгцэл, however бол шинэ өгүүлбэр эхлүүлдэг тул өгүүлбэрийн дунд ингэж орохгүй.',
      hint: '«Яагаад?» гэсэн асуултын хариулт байна.',
    },
    {
      id: 'a2-13-2',
      ruleId: 13,
      kind: 'fill',
      question: '___ he was very tired, he finished the report.',
      options: ['Because', 'So', 'Although', 'However'],
      answer: 'Although',
      explanation: 'Ядарсан мөртлөө тайлангаа дуусгасан — эсрэгцэл. Because бол шалтгаан болох тул утга таарахгүй, So өгүүлбэрийн эхэнд ингэж орохгүй, However-ийн ард таслал орж, бүлэг өгүүлбэр залгадаггүй.',
      hint: 'Хүлээгдэж байснаас өөр зүйл болжээ.',
    },
    {
      id: 'a2-13-3',
      ruleId: 13,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'It was cold, however we went out.',
        'Although it was cold, but we went out.',
        'It was cold. However, we went out.',
        'Because it was cold, so we went out.',
      ],
      answer: 'It was cold. However, we went out.',
      explanation: 'however шинэ өгүүлбэр эхлүүлж, ардаа таслалтай байна. Таслалаар дунд нь холбох буруу; although-той but давхар орохгүй; because-тэй so давхар орохгүй.',
      hint: 'however-ийн өмнө цэг, ард нь таслал.',
    },
    {
      id: 'a2-13-4',
      ruleId: 13,
      kind: 'translate',
      question: 'Цаснаас болж сургууль хаалттай байсан.',
      options: [
        'The school was closed because of the snow.',
        'The school was closed because the snow.',
        'The school was closed although the snow.',
        'The school was closed so the snow.',
      ],
      answer: 'The school was closed because of the snow.',
      explanation: 'the snow бол нэр үг тул because of. Дангаар because-ийн ард эзэн + үйл үг байх ёстой. although эсрэгцэл, so үр дагавар заадаг тул утга буруу.',
      hint: 'Ард нь үйл үг байна уу, нэр үг байна уу?',
    },
  ],
};
