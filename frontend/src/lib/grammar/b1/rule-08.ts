// frontend/src/lib/grammar/b1/rule-08.ts
// B1 дүрэм 8: Reported speech — statements
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule08: GrammarRule = {
  id: 8,
  title: 'Reported speech: statements',
  titleMn: 'Шууд бус яриа — хэн нэгний хэлснийг дамжуулах (мэдэгдэл)',
  hook: '«Тэр надад “Би ядарч байна” гэсэн» → «Тэр ядарч байна гэж хэлсэн» — хүний хэлсэн үгийг өөрийн үгээр дамжуулж сурцгаая.',
  summary: 'Хэн нэгний хэлсэн үгийг дамжуулахдаа said (that) / told + хүн (that) хэрэглэж, үйл үгийн цагийг нэг алхам ухраана (backshift): Present → Past, Past → Past Perfect, will → would. Төлөөний үг, цаг хугацааны үгс ч дамжуулагчийн өнцгөөс өөрчлөгдөнө.',
  description: 'A1-A2-д бид өөрийнхөө үгийг хэлж сурсан. Одоо ӨӨР хүний хэлснийг дамжуулж сурна. Шууд яриа (direct speech) бол хашилтанд яг хэлсэн үг: She said, "I am tired." Шууд бус яриа (reported speech) бол хашилтгүй, өөрийн өгүүлбэрт багтаасан: She said (that) she was tired. Гурван зүйл өөрчлөгдөнө. Нэгдүгээрт, үйл үгийн цаг нэг алхам ухарна (backshift): am → was, work → worked, worked → had worked, will → would, can → could. Учир нь дамжуулах үед хэлсэн мөч аль хэдийн өнгөрсөн байдаг. Хоёрдугаарт, төлөөний үг өөрчлөгдөнө: I → she/he, my → her/his. Гуравдугаарт, цаг, газрын үг өөрчлөгдөнө: now → then, today → that day, tomorrow → the next day, here → there. say болон tell хоёрын ялгаа: said that … (хүнгүй), told me that … (хүнтэй). B1-ийн 2-р дүрэмд үзсэн Past Perfect энд Past Simple-ийг ухраахад хэрэглэгдэнэ. Монголоор шууд бус ярианд «гэж хэлсэн» гэж холбодог ба цагийг ухраадаггүй тул англи хэлний backshift дүрмийг тусгайлан сурах хэрэгтэй.',
  structure: 'Subject + said (that) / told + person (that) + subject + verb (нэг алхам ухарсан цаг)',
  structureParts: [
    { text: 'She', part: 'subject' },
    { text: 'said (that) / told me (that)', part: 'verb' },
    { text: 'she', part: 'subject' },
    { text: 'was tired (backshift)', part: 'verb' },
  ],
  tip: 'Backshift: Present → Past, Past → Past Perfect, will → would, can → could. said that (хүнгүй) · told + хүн that (хүнтэй). I → he/she, now → then, tomorrow → the next day.',
  examples: [
    { en: '"I am tired." → [She](s) [said](v) [that she was tired](o).', mn: '«Би ядарч байна.» → Тэр ядарч байна гэж хэлсэн.' },
    { en: '"I will call you." → [He](s) [told](v) [me](o) [that he would call me](o).', mn: '«Би чам руу залгана.» → Тэр над руу залгана гэж надад хэлсэн.' },
    { en: '"We went to Paris." → [They](s) [said](v) [they had gone to Paris](o).', mn: '«Бид Парис явсан.» → Тэд Парис явсан гэж хэлсэн.' },
    { en: '"I can\'t come tomorrow." → [She](s) [said](v) [she couldn\'t come the next day](o).', mn: '«Би маргааш ирж чадахгүй.» → Тэр маргааш нь ирж чадахгүй гэж хэлсэн.' },
  ],
  useCases: [
    {
      title: 'Цагийг нэг алхам ухраах — backshift',
      description: 'Дамжуулах үйл үг (said, told) өнгөрсөн цагт байвал хашилт доторх үйл үгийн цагийг нэг алхам ухраана. Present Simple → Past Simple, Present Continuous → Past Continuous, Present Perfect / Past Simple → Past Perfect.',
      examples: [
        { en: '"I live in Darkhan." → [He](s) [said](v) [he lived in Darkhan](o).', mn: '«Би Дарханд амьдардаг.» → Тэр Дарханд амьдардаг гэж хэлсэн.' },
        { en: '"I\'m studying." → [She](s) [said](v) [she was studying](o).', mn: '«Би хичээлээ давтаж байна.» → Тэр хичээлээ давтаж байна гэж хэлсэн.' },
        { en: '"I have finished." → [He](s) [said](v) [he had finished](o).', mn: '«Би дуусгасан.» → Тэр дуусгасан гэж хэлсэн.' },
      ],
    },
    {
      title: 'Модаль үгсийн өөрчлөлт — will, can, may, must',
      description: 'will → would, can → could, may → might, must → had to (эсвэл must хэвээр). would, could, should, might аль хэдийн өнгөрсөн хэлбэр тул өөрчлөгдөхгүй.',
      examples: [
        { en: '"I will help you." → [She](s) [said](v) [she would help me](o).', mn: '«Би чамд туслана.» → Тэр надад туслана гэж хэлсэн.' },
        { en: '"I can swim." → [He](s) [said](v) [he could swim](o).', mn: '«Би сэлж чадна.» → Тэр сэлж чадна гэж хэлсэн.' },
        { en: '"You must leave." → [They](s) [told](v) [us](o) [we had to leave](o).', mn: '«Та нар явах ёстой.» → Тэд биднийг явах ёстой гэж хэлсэн.' },
      ],
    },
    {
      title: 'say ба tell — хүнтэй юу, хүнгүй юу',
      description: 'said-ийн ард шууд that (эсвэл юу ч үгүй) ирнэ, хүн ирэхгүй. told-ийн ард заавал хүн (me, him, us) ирнэ, тэгээд that. said to me гэж хэлж болно, гэхдээ told me илүү байгалийн.',
      examples: [
        { en: '[She](s) [said](v) [that she was busy](o).', mn: 'Тэр завгүй байна гэж хэлсэн.' },
        { en: '[She](s) [told](v) [me](o) [that she was busy](o).', mn: 'Тэр надад завгүй байна гэж хэлсэн.' },
        { en: '[He](s) [told](v) [his boss](o) [he needed a day off](o).', mn: 'Тэр даргадаа нэг өдөр амрах хэрэгтэй гэж хэлсэн.' },
      ],
    },
    {
      title: 'Төлөөний үг, цаг хугацаа, газрын үгс өөрчлөгдөнө',
      description: 'Дамжуулагчийн өнцгөөс төлөөний үг (I → he), эзэмшил (my → his), цаг (today → that day), газар (here → there) өөрчлөгдөнө. Логикоор бодоорой: хэн хэлсэн, хэзээ, хаана.',
      examples: [
        { en: '"I\'ll see you here tomorrow." → [He](s) [said](v) [he would see me there the next day](o).', mn: '«Би чамтай маргааш энд уулзана.» → Тэр надтай маргааш нь тэнд уулзана гэж хэлсэн.' },
        { en: '"My car is broken." → [She](s) [said](v) [her car was broken](o).', mn: '«Миний машин эвдэрсэн.» → Тэр машин нь эвдэрсэн гэж хэлсэн.' },
        { en: '"We did it yesterday." → [They](s) [said](v) [they had done it the day before](o).', mn: '«Бид өчигдөр хийсэн.» → Тэд өмнөх өдөр нь хийсэн гэж хэлсэн.' },
      ],
    },
    {
      title: 'Хэзээ цагийг ухраахгүй вэ',
      description: 'Дамжуулах үйл үг одоо цагт (says, is saying) байвал ухраахгүй. Мөн хэлсэн зүйл одоо ч үнэн хэвээр (ерөнхий үнэн, тогтмол баримт) байвал ухраахгүй байж болно.',
      examples: [
        { en: '[She](s) [says](v) [she is tired](o).', mn: 'Тэр ядарч байна гэж хэлж байна. (одоо цаг — ухраахгүй)' },
        { en: '[The teacher](s) [said](v) [water boils at 100 degrees](o).', mn: 'Багш ус 100 хэмд буцалдаг гэж хэлсэн. (ерөнхий үнэн)' },
        { en: '[He](s) [told](v) [me](o) [he lives in Erdenet](o). (одоо ч тэнд амьдардаг)', mn: 'Тэр надад Эрдэнэтэд амьдардаг гэж хэлсэн.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Одоо цагууд → өнгөрсөн цагууд',
      structure: 'am/is/are → was/were · V1/V-s → V2 · am/is/are + V-ing → was/were + V-ing',
      examples: [
        { en: '"I am happy." → [She](s) [said](v) [she was happy](o).', mn: '«Би баяртай байна.» → Тэр баяртай байна гэж хэлсэн.' },
        { en: '"I work here." → [He](s) [said](v) [he worked there](o).', mn: '«Би энд ажилладаг.» → Тэр тэнд ажилладаг гэж хэлсэн.' },
        { en: '"They are waiting." → [She](s) [said](v) [they were waiting](o).', mn: '«Тэд хүлээж байна.» → Тэр тэднийг хүлээж байна гэж хэлсэн.' },
      ],
    },
    {
      label: 'Өнгөрсөн ба төгссөн цагууд → Past Perfect',
      structure: 'V2 → had + V3 · have/has + V3 → had + V3',
      examples: [
        { en: '"I saw him." → [She](s) [said](v) [she had seen him](o).', mn: '«Би түүнийг харсан.» → Тэр түүнийг харсан гэж хэлсэн.' },
        { en: '"We have eaten." → [They](s) [said](v) [they had eaten](o).', mn: '«Бид хооллосон.» → Тэд хооллосон гэж хэлсэн.' },
        { en: '"I lost my keys." → [He](s) [told](v) [me](o) [he had lost his keys](o).', mn: '«Би түлхүүрээ гээсэн.» → Тэр надад түлхүүрээ гээсэн гэж хэлсэн.' },
      ],
    },
    {
      label: 'Модаль үгс',
      structure: 'will → would · can → could · may → might · must → had to · would/could/should → өөрчлөгдөхгүй',
      examples: [
        { en: '"I\'ll be late." → [She](s) [said](v) [she would be late](o).', mn: '«Би хоцорно.» → Тэр хоцорно гэж хэлсэн.' },
        { en: '"It may rain." → [He](s) [said](v) [it might rain](o).', mn: '«Бороо орж магадгүй.» → Тэр бороо орж магадгүй гэж хэлсэн.' },
        { en: '"You should rest." → [The doctor](s) [said](v) [I should rest](o).', mn: '«Та амрах хэрэгтэй.» → Эмч намайг амрах хэрэгтэй гэж хэлсэн.' },
      ],
    },
    {
      label: 'Цаг, газрын үгс',
      structure: 'now → then · today → that day · tomorrow → the next day · yesterday → the day before · here → there · this → that',
      examples: [
        { en: '"I\'m busy now." → [She](s) [said](v) [she was busy then](o).', mn: '«Би одоо завгүй.» → Тэр тэр үед завгүй байна гэж хэлсэн.' },
        { en: '"I\'ll come tomorrow." → [He](s) [said](v) [he would come the next day](o).', mn: '«Би маргааш ирнэ.» → Тэр маргааш нь ирнэ гэж хэлсэн.' },
        { en: '"I like this book." → [She](s) [said](v) [she liked that book](o).', mn: '«Би энэ номд дуртай.» → Тэр тэр номд дуртай гэж хэлсэн.' },
      ],
    },
  ],
  signalWords: ['said (that)', 'told me (that)', 'explained', 'mentioned', 'that', 'the next day', 'the day before', 'then'],
  notes: [
    'that-ыг орхиж болно: She said she was tired = She said that she was tired. Ярианд ихэвчлэн орхидог.',
    'tell-ийн ард заавал хүн ирнэ: told me, told him, told the teacher. say-ийн ард хүн шууд ирэхгүй: said me (буруу) → said to me / told me (зөв).',
    'Past Perfect-ийг цаашид ухраах боломжгүй тул Past Perfect хэвээр үлдэнэ: "I had seen it" → He said he had seen it.',
    'Ярианы хэлэнд Past Simple-ийг заримдаа Past Perfect болгохгүй, хэвээр нь үлдээдэг: "I saw him" → She said she saw him. Гэхдээ шалгалтад had seen илүү зөв.',
    'Бусад дамжуулах үйл үгс: explained, mentioned, added, replied, admitted, complained. Бүгд said шиг хэрэглэгдэнэ: He explained that he was late because …',
    'Дамжуулах үед контекст өөрчлөгдөөгүй бол (тэр өдөртөө, тэр газраа) цаг, газрын үгсийг өөрчлөх шаардлагагүй: She said she\'d come tomorrow (маргааш болоогүй бол).',
  ],
  commonMistakes: [
    {
      wrong: 'She said me that she was busy.',
      correct: 'She told me that she was busy.',
      explanation: 'say-ийн ард хүн шууд ирэхгүй. Хүнтэй бол tell (told me), хүнгүй бол say (said that). Монголоор «надад хэлсэн» гэдэг тул said me гэх алдаа гардаг.',
    },
    {
      wrong: 'He said that he is tired.',
      correct: 'He said that he was tired.',
      explanation: 'said өнгөрсөн цагт тул хашилт доторх is → was болж ухарна. Монголоор цаг ухраадаггүй (ядарч байна гэж хэлсэн) тул энэ алдаа түгээмэл.',
    },
    {
      wrong: 'She told that she would come.',
      correct: 'She said that she would come. / She told me that she would come.',
      explanation: 'told-ийн ард заавал хүн байна. Хүн байхгүй бол said хэрэглэнэ.',
    },
    {
      wrong: 'They said they will arrive tomorrow.',
      correct: 'They said they would arrive the next day.',
      explanation: 'will → would ухарна. tomorrow нь хэлсэн өдрөөс хойш маргааш тул дамжуулах үед the next day болно (хэрэв өдөр өөрчлөгдсөн бол).',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор шууд бус ярианд «… гэж хэлсэн» гэж хэлсэн үгийг ХЭВЭЭР нь дамжуулдаг: «би ядарч байна гэж хэлсэн» — үйл үгийн цаг өөрчлөгдөхгүй. Англиар цаг заавал нэг алхам ухардаг (was tired). Энэ бол монгол сурагчдын хамгийн их гаргадаг алдаа.',
      'Монголоор «гэж» гэсэн нэг үг бүх дамжуулалтад хэрэглэгддэг. Англиар that (заримдаа орхиж болно) хэрэглэдэг ч say/tell хоёрыг хүнтэй эсэхээр нь ялгадаг. Монголоор «хэлсэн» ба «надад хэлсэн» гэсэн ялгаа яг said / told me-тэй таардаг.',
      'Монголоор төлөөний үгийг дамжуулахдаа заримдаа хэвээр үлдээдэг («би ирнэ гэж хэлсэн» — «би» нь хэлсэн хүн). Англиар заавал дамжуулагчийн өнцгөөс (he would come) өөрчилнө.',
      'Монголоор «маргааш» гэдгийг «маргааш нь» гэж «нь» нэмээд дамжуулдаг нь the next day-тэй яг адил логик. «Өчигдөр» → «өмнөх өдөр нь» = the day before. Монгол хэлний «нь» тодотгогч энд тусална.',
    ],
  },
  dialogue: [
    {
      en: 'Bat, [did](v) [you](s) [talk](v) [to Tuya](m) [yesterday](m)?',
      mn: 'Бат, чи өчигдөр Туяатай ярьсан уу?',
      speaker: 'Saraa',
    },
    {
      en: 'Yes. [She](s) [said](v) [she was moving to Korea next month](o).',
      mn: 'Тийм. Тэр ирэх сард Солонгос руу нүүж байгаа гэж хэлсэн.',
      speaker: 'Bat',
    },
    {
      en: 'Really? [Did](v) [she](s) [say](v) [why](o)?',
      mn: 'Нээрээ юу? Яагаад гэж хэлсэн үү?',
      speaker: 'Saraa',
    },
    {
      en: '[She](s) [told](v) [me](o) [that she had found a job there](o). [She](s) [said](v) [she would earn much more](o).',
      mn: 'Тэр надад тэнд ажил олсон гэж хэлсэн. Илүү их цалин авна гэсэн.',
      speaker: 'Bat',
    },
    {
      en: '[Did](v) [she](s) [mention](v) [when she was leaving](o)?',
      mn: 'Хэзээ явахаа хэлсэн үү?',
      speaker: 'Saraa',
    },
    {
      en: '[She](s) [said](v) [she couldn\'t remember the exact date](o), [but](m) [she](s) [told](v) [me](o) [she would call us before she left](o).',
      mn: 'Тэр яг өдрөө санахгүй байна гэсэн, гэхдээ явахаасаа өмнө бидэн рүү залгана гэж надад хэлсэн.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'b1-08-1',
      ruleId: 8,
      kind: 'fill',
      question: '"I am very tired." → She said that she ___ very tired.',
      options: ['is', 'was', 'has been', 'were'],
      answer: 'was',
      explanation: 'said өнгөрсөн цагт тул am → was гэж нэг алхам ухарна. She ганц тоо тул was, were биш.',
      hint: 'Present → Past.',
    },
    {
      id: 'b1-08-2',
      ruleId: 8,
      kind: 'fill',
      question: '"I will call you tomorrow." → He ___ me he would call me the next day.',
      options: ['said', 'told', 'said to', 'spoke'],
      answer: 'told',
      explanation: 'Ард нь me (хүн) байгаа тул told. said me гэж хэлэхгүй. said to me гэж болох ч сонголтод said to me биш said to байна.',
      hint: 'Ард нь хүн байвал?',
    },
    {
      id: 'b1-08-3',
      ruleId: 8,
      kind: 'correct',
      question: '"We went to the cinema yesterday." Зөв дамжуулсан нь аль вэ?',
      options: [
        'They said they went to the cinema yesterday.',
        'They said they had gone to the cinema the day before.',
        'They told that they had gone to the cinema the day before.',
        'They said they have gone to the cinema yesterday.',
      ],
      answer: 'They said they had gone to the cinema the day before.',
      explanation: 'Past Simple (went) → Past Perfect (had gone), yesterday → the day before. told-ийн ард хүн байх ёстой; have gone бол буруу чиглэлд өөрчилсөн байна.',
      hint: 'Past → Past Perfect, yesterday → ?',
    },
    {
      id: 'b1-08-4',
      ruleId: 8,
      kind: 'translate',
      question: 'Тэр надад англи хэл сурч байгаа гэж хэлсэн.',
      options: [
        'She told me that she was learning English.',
        'She said me that she is learning English.',
        'She told me that she is learning English.',
        'She told that she was learning English.',
      ],
      answer: 'She told me that she was learning English.',
      explanation: '«Надад хэлсэн» = told me. «Сурч байгаа» — хэлэх үедээ Present Continuous байсан тул дамжуулахдаа was learning гэж ухраана.',
      hint: 'told + me, цаг ухарна.',
    },
  ],
};
