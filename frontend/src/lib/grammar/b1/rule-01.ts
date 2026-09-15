// frontend/src/lib/grammar/b1/rule-01.ts
// B1 дүрэм 1: Present Perfect Continuous
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule01: GrammarRule = {
  id: 1,
  title: 'Present Perfect Continuous',
  titleMn: 'Одоо төгссөн үргэлжлэх цаг — өнгөрснөөс одоо хүртэл үргэлжилж буй үйлдэл',
  hook: '«Би хоёр цаг хүлээж байна», «Тэр өглөөнөөс хойш ажиллаж байгаа» — өмнө нь эхэлсэн, одоо ч үргэлжилж байгаа, ул мөр нь мэдрэгдэж байгаа үйлдлийг хэлж сурцгаая.',
  summary: 'have / has been + Verb-ing нь өнгөрсөнд эхэлж, одоог хүртэл үргэлжилсэн (эсвэл дөнгөж сая дууссан) үйлдлийг заана. Гол анхаарал нь үйлдлийн үргэлжилсэн хугацаа, явц дээр байдаг: How long have you been waiting? — I\'ve been waiting for two hours.',
  description: 'A2 түвшинд бид Present Perfect (have done) — өнгөрсөн үйлдлийн одоогийн үр дүнг заадаг цагийг, мөн A1-д Present Continuous (am doing) — яг одоо болж байгаа үйлдлийг үзсэн. Present Perfect Continuous бол энэ хоёрын нэгдэл юм: have been + Verb-ing. Энэ цагийн онцлог нь үйлдэл ХЭДИЙНЭЭС ХОЙШ, ХЭР УДААН үргэлжилж байгааг онцолдог. I\'ve been learning English for three years — гурван жилийн өмнө эхэлсэн, одоо ч сурсаар байна. Present Perfect-ээс ялгаа нь: I\'ve read the book гэвэл номыг дуусгасан (үр дүн), харин I\'ve been reading the book гэвэл уншиж байгаа, дуусаагүй (явц). Мөн дөнгөж сая дууссан, ул мөр нь харагдаж байгаа үйлдэлд ч хэрэглэнэ: You\'re wet! Have you been running? Монгол хэлэнд энэ хоёр цагийг «-сан» ба «-ж байгаа» гэж ялгадаг ч «хэр удаан» гэдгийг for / since-ээр заах бүтэц байхгүй тул энэ дүрмийг тусгайлан сурах хэрэгтэй.',
  structure: 'Subject + have / has + been + Verb-ing + (for / since …)',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'have / has been', part: 'verb' },
    { text: 'Verb-ing', part: 'verb' },
    { text: 'for / since …', part: 'modifier' },
  ],
  tip: 'Асуулт нь «Хэр удаан?» бол Present Perfect Continuous. Асуулт нь «Хэдэн удаа? Дууссан уу?» бол Present Perfect.',
  examples: [
    { en: '[I](s) [have been waiting](v) [for you](o) [for two hours](m).', mn: 'Би чамайг хоёр цаг хүлээж байна.' },
    { en: '[She](s) [has been working](v) [here](m) [since 2020](m).', mn: 'Тэр 2020 оноос хойш энд ажиллаж байгаа.' },
    { en: '[How long](m) [have](v) [you](s) [been learning](v) [English](o)?', mn: 'Чи англи хэлийг хэр удаан сурч байгаа вэ?' },
    { en: '[It](s) [has been raining](v) [all day](m).', mn: 'Өдөржин бороо орж байна.' },
  ],
  useCases: [
    {
      title: 'Өнгөрсөнд эхэлж, одоо ч үргэлжилж буй үйлдэл — for / since',
      description: 'Хамгийн түгээмэл хэрэглээ. for-ын ард хугацааны урт (for two hours, for a week), since-ийн ард эхэлсэн цэг (since Monday, since 2019) ирнэ. Үйлдэл одоо ч үргэлжилж байгааг заана.',
      examples: [
        { en: '[We](s) [have been living](v) [in Ulaanbaatar](m) [for ten years](m).', mn: 'Бид Улаанбаатарт арван жил амьдарч байна.' },
        { en: '[He](s) [has been studying](v) [since seven o\'clock](m).', mn: 'Тэр долоон цагаас хойш хичээлээ давтаж байгаа.' },
        { en: '[They](s) [have been talking](v) [on the phone](m) [for an hour](m).', mn: 'Тэд нэг цаг утсаар ярьж байна.' },
      ],
    },
    {
      title: 'Дөнгөж сая дууссан, ул мөр нь харагдаж буй үйлдэл',
      description: 'Үйлдэл яг одоо болохгүй байж болно, гэхдээ түүний нотолгоо, үр нөлөө нь мэдрэгдэж байна: нүд улайсан, гар бохир, ядарсан гэх мэт. Монголоор «… байсан юм байна» гэсэн таамаглал бүхий өнгөтэй.',
      examples: [
        { en: '[Your eyes](s) [are](v) [red](o). [Have](v) [you](s) [been crying](v)?', mn: 'Нүд чинь улайчихаж. Чи уйлж байсан юм уу?' },
        { en: '[I](s)[\'m](v) [tired](o) [because I\'ve been cleaning the house](m).', mn: 'Би гэрээ цэвэрлэж байсан болохоор ядарчихлаа.' },
        { en: '[The ground](s) [is](v) [wet](o). [It](s) [has been raining](v).', mn: 'Газар нойтон байна. Бороо орж байсан юм байна.' },
      ],
    },
    {
      title: 'Present Perfect-ээс ялгаа — явц уу, үр дүн үү',
      description: 'A2-д үзсэн Present Perfect (have done) дууссан үйлдлийн үр дүн, тоо хэмжээг заана. Present Perfect Continuous (have been doing) үйлдлийн явц, үргэлжилсэн хугацааг заана. Ижил нөхцөлд хоёуланг нь хэрэглэж болох ч утга нь өөр.',
      examples: [
        { en: '[I](s) [have read](v) [fifty pages](o).', mn: 'Би тавин хуудас уншсан. (үр дүн — тоо)' },
        { en: '[I](s) [have been reading](v) [for two hours](m).', mn: 'Би хоёр цаг уншиж байна. (явц — хугацаа)' },
        { en: '[She](s) [has written](v) [three emails](o). [She](s) [has been writing](v) [emails](o) [all morning](m).', mn: 'Тэр гурван имэйл бичсэн. Тэр өглөөжин имэйл бичиж байна.' },
      ],
    },
    {
      title: 'Present Continuous-аас ялгаа — одоо уу, хэдийнээс хойш уу',
      description: 'A1-д үзсэн Present Continuous зөвхөн «яг одоо» гэдгийг хэлдэг, харин хэзээ эхэлснийг заадаггүй. Present Perfect Continuous нь «одоо болж байгаа, ГЭХДЭЭ хэзээнээс хойш» гэдгийг нэмж хэлнэ.',
      examples: [
        { en: '[I](s) [am waiting](v) [for the bus](o).', mn: 'Би автобус хүлээж байна. (яг одоо)' },
        { en: '[I](s) [have been waiting](v) [for the bus](o) [for 40 minutes](m).', mn: 'Би 40 минут автобус хүлээж байна. (хэдийнээс хойш)' },
        { en: '[She](s) [is studying](v). [She](s) [has been studying](v) [since morning](m).', mn: 'Тэр хичээлээ давтаж байна. Тэр өглөөнөөс хойш хичээлээ давтаж байгаа.' },
      ],
    },
    {
      title: 'Төлөв заасан үйл үгтэй хэрэглэхгүй — know, like, have, be',
      description: 'know, like, love, believe, understand, have (эзэмших), be зэрэг төлөв заасан үйл үгс -ing хэлбэрт ордоггүй. Эдгээртэй «хэр удаан» гэдгийг заахдаа энгийн Present Perfect хэрэглэнэ.',
      examples: [
        { en: '[I](s) [have known](v) [her](o) [for ten years](m).', mn: 'Би түүнийг арван жил мэднэ. (have been knowing гэхгүй)' },
        { en: '[We](s) [have had](v) [this car](o) [since 2018](m).', mn: 'Бид энэ машиныг 2018 оноос хойш эзэмшиж байгаа.' },
        { en: '[How long](m) [have](v) [you](s) [been](v) [here](m)?', mn: 'Чи энд хэр удаан байгаа вэ?' },
      ],
    },
  ],
  forms: [
    {
      label: 'Батлах',
      structure: 'I / you / we / they + have been + V-ing · he / she / it + has been + V-ing',
      examples: [
        { en: '[I](s) [have been working](v) [here](m) [for five years](m).', mn: 'Би энд таван жил ажиллаж байна.' },
        { en: '[He](s) [has been playing](v) [football](o) [since he was six](m).', mn: 'Тэр зургаан настайгаасаа хойш хөл бөмбөг тоглож байгаа.' },
        { en: '[They](s)[\'ve been building](v) [the bridge](o) [for two years](m).', mn: 'Тэд гүүрийг хоёр жил барьж байна.' },
      ],
    },
    {
      label: 'Үгүйсгэх',
      structure: 'Subject + haven\'t / hasn\'t + been + V-ing',
      examples: [
        { en: '[I](s) [haven\'t been sleeping](v) [well](m) [lately](m).', mn: 'Би сүүлийн үед сайн унтахгүй байна.' },
        { en: '[She](s) [hasn\'t been feeling](v) [well](m) [this week](m).', mn: 'Тэр энэ долоо хоногт биеэ сайн мэдрэхгүй байгаа.' },
        { en: '[We](s) [haven\'t been going](v) [to the gym](m) [recently](m).', mn: 'Бид сүүлийн үед фитнесс явахгүй байна.' },
      ],
    },
    {
      label: 'Асуух',
      structure: 'Have / Has + subject + been + V-ing? · How long have / has + subject + been + V-ing?',
      examples: [
        { en: '[Have](v) [you](s) [been waiting](v) [long](m)?', mn: 'Чи удаан хүлээж байна уу?' },
        { en: '[How long](m) [has](v) [she](s) [been teaching](v) [English](o)?', mn: 'Тэр англи хэлийг хэр удаан зааж байгаа вэ?' },
        { en: '[What](o) [have](v) [you](s) [been doing](v) [all day](m)?', mn: 'Чи өдөржин юу хийж байсан юм бэ?' },
      ],
    },
    {
      label: 'Богино хариулт',
      structure: 'Yes, I have. / No, I haven\'t. · Yes, she has. / No, she hasn\'t.',
      examples: [
        { en: '[Have](v) [you](s) [been studying](v)? — Yes, [I](s) [have](v).', mn: 'Чи хичээлээ давтаж байсан уу? — Тийм, давтаж байсан.' },
        { en: '[Has](v) [it](s) [been snowing](v)? — No, [it](s) [hasn\'t](v).', mn: 'Цас орж байсан уу? — Үгүй, ороогүй.' },
        { en: '[Have](v) [they](s) [been living](v) [here](m) [long](m)? — Yes, [they](s) [have](v).', mn: 'Тэд энд удаан амьдарч байгаа юу? — Тийм, удаан.' },
      ],
    },
  ],
  signalWords: ['for', 'since', 'how long', 'all day', 'all morning', 'lately', 'recently', 'these days'],
  notes: [
    'for + хугацааны урт (for three days, for a long time), since + эхэлсэн цэг (since Monday, since I was a child). Since-ийн ард бүтэн өгүүлбэр ч ирж болно.',
    'Present Perfect Continuous нь үйлдэл дууссан эсэхийг заадаггүй — үргэлжилж байж ч болно, дөнгөж сая дууссан ч байж болно. Контекстээс ойлгоно.',
    'Тоо хэмжээ, хэдэн удаа гэдгийг хэлэхдээ Present Perfect Continuous хэрэглэхгүй: I\'ve written three letters (зөв), I\'ve been writing three letters (буруу).',
    'Төлөв заасан үйл үгс (know, like, love, hate, believe, understand, own, belong, seem) -ing хэлбэргүй. Тэдэнтэй Present Perfect хэрэглэнэ: I\'ve known him for years.',
    'live, work, study, teach зэрэг үйл үгтэй хоёр цаг бараг ижил утгатай: I\'ve lived here for 10 years = I\'ve been living here for 10 years. Continuous нь арай түр зуурын өнгөтэй.',
    'Ярианы хэлэнд have been → \'ve been, has been → \'s been гэж товчилно: I\'ve been thinking about you.',
  ],
  commonMistakes: [
    {
      wrong: 'I am learning English for three years.',
      correct: 'I have been learning English for three years.',
      explanation: 'Монголоор «гурван жил сурч байна» гэж одоо цагаар хэлдэг тул Present Continuous сонгох алдаа гардаг. for / since байвал одоо цаг биш, Present Perfect (Continuous) хэрэглэнэ.',
    },
    {
      wrong: 'I have been knowing him since 2015.',
      correct: 'I have known him since 2015.',
      explanation: 'know бол төлөв заасан үйл үг — -ing хэлбэрт ордоггүй. Ийм үйл үгтэй «хэр удаан» гэдгийг Present Perfect-ээр заана.',
    },
    {
      wrong: 'She has been reading five books this month.',
      correct: 'She has read five books this month.',
      explanation: 'Тоо хэмжээ (five books) байвал үр дүнг заана, тэгэхээр Present Perfect. Continuous хэлбэр зөвхөн явц, хугацаа заана.',
    },
    {
      wrong: 'How long do you wait here?',
      correct: 'How long have you been waiting here?',
      explanation: 'How long + одоо ч үргэлжилж буй үйлдэл бол Present Perfect Continuous. Энгийн одоо цаг зуршил заадаг тул энд таарахгүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «би хоёр цаг хүлээж байна» гэхэд одоо үргэлжлэх хэлбэр «-ж байна»-г хэрэглэдэг. Англиар хугацаа (for two hours) байвал заавал have been waiting гэнэ, am waiting гэхгүй. Энэ бол монгол сурагчдын хамгийн түгээмэл алдаа.',
      'Монголоор «-сан» (уншсан) ба «-ж байгаа» (уншиж байгаа) гэсэн хоёр хэлбэр байгаа нь Present Perfect ба Present Perfect Continuous-ийн ялгааг ойлгоход тусалдаг: I\'ve read — уншсан (дууссан), I\'ve been reading — уншиж байгаа (үргэлжилж байгаа).',
      'Монголоор «-аас хойш» (2020 оноос хойш) нь since, харин «хугацаа + турш / -ийн турш» (хоёр жилийн турш) нь for гэдэгт тохирно. Монголоор хоёуланг нь орхиж «арван жил амьдарч байна» гэж хэлж болдог бол англиар for-г орхиж болохгүй.',
      '«Нүд чинь улайчихаж — уйлж байсан юм уу?» гэдэг монгол хэллэгийн «байсан юм уу» нь Have you been crying?-ийн утгыг яг илэрхийлнэ: одоо уйлахгүй байгаа ч ул мөр нь харагдаж байна.',
    ],
  },
  dialogue: [
    {
      en: 'Hi Bat! [You](s) [look](v) [exhausted](o). [What](o) [have](v) [you](s) [been doing](v)?',
      mn: 'Сайн уу, Бат! Чи их ядарсан харагдаж байна. Юу хийж байсан юм бэ?',
      speaker: 'Saraa',
    },
    {
      en: '[I](s)[\'ve been moving](v) [furniture](o) [all morning](m). [We](s)[\'re moving](v) [to a new flat](m).',
      mn: 'Би өглөөжин тавилга зөөж байлаа. Бид шинэ байр руу нүүж байгаа.',
      speaker: 'Bat',
    },
    {
      en: 'Really? [How long](m) [have](v) [you](s) [been living](v) [in your old flat](m)?',
      mn: 'Нээрээ юу? Чи хуучин байрандаа хэр удаан амьдарч байгаа юм бэ?',
      speaker: 'Saraa',
    },
    {
      en: '[For six years](m). [But](m) [the landlord](s) [has been raising](v) [the rent](o) [every year](m).',
      mn: 'Зургаан жил. Гэхдээ байрны эзэн жил бүр түрээсийг нэмсээр байсан.',
      speaker: 'Bat',
    },
    {
      en: 'I see. [Have](v) [you](s) [finished](v) [packing](o)?',
      mn: 'Ойлголоо. Чи ачаагаа баглаж дууссан уу?',
      speaker: 'Saraa',
    },
    {
      en: 'Not yet. [I](s)[\'ve packed](v) [ten boxes](o), [but](m) [I](s) [haven\'t been sleeping](v) [well](m), [so](m) [I](s)[\'m](v) [slow](o).',
      mn: 'Хараахан үгүй. Арван хайрцаг баглачихсан, гэхдээ сайн унтахгүй байгаа болохоор удаан байна.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'b1-01-1',
      ruleId: 1,
      kind: 'fill',
      question: 'She ___ for the bus for half an hour.',
      options: ['is waiting', 'has been waiting', 'waits', 'has waited three times'],
      answer: 'has been waiting',
      explanation: 'for half an hour гэсэн хугацаа байгаа тул өнгөрснөөс одоо хүртэл үргэлжилж буй үйлдэл — has been waiting. is waiting зөвхөн «яг одоо» гэнэ, хугацаатай нийлэхгүй.',
      hint: 'for + хугацаа байвал аль цаг вэ?',
    },
    {
      id: 'b1-01-2',
      ruleId: 1,
      kind: 'fill',
      question: 'I ___ him since we were children.',
      options: ['have been knowing', 'have known', 'am knowing', 'know'],
      answer: 'have known',
      explanation: 'know бол төлөв заасан үйл үг — -ing хэлбэрт ордоггүй. since байгаа тул Present Perfect: have known.',
      hint: 'know үйл үгийг -ing-тэй хэрэглэж болох уу?',
    },
    {
      id: 'b1-01-3',
      ruleId: 1,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'I am living here for five years.',
        'I have been living here for five years.',
        'I have been living here since five years.',
        'I live here since five years.',
      ],
      answer: 'I have been living here for five years.',
      explanation: 'five years бол хугацааны урт тул for. Хугацаатай өгүүлбэрт Present Perfect Continuous хэрэглэнэ. since-ийн ард эхэлсэн цэг (since 2021) ирнэ, хугацааны урт ирэхгүй.',
      hint: 'for уу, since үү? Одоо цаг уу, төгссөн үргэлжлэх цаг уу?',
    },
    {
      id: 'b1-01-4',
      ruleId: 1,
      kind: 'translate',
      question: 'Чи хэр удаан англи хэл сурч байгаа вэ?',
      options: [
        'How long have you been learning English?',
        'How long do you learn English?',
        'How long are you learning English?',
        'How long did you learn English?',
      ],
      answer: 'How long have you been learning English?',
      explanation: '«Хэр удаан … сурч байгаа» — өнгөрсөнд эхэлж, одоо ч үргэлжилж байгаа үйлдлийн хугацааг асууж байна. How long + Present Perfect Continuous. did гэвэл дууссан үйлдэл болно.',
      hint: 'Одоо ч сурсаар байгаа, хугацааг нь асууж байна.',
    },
  ],
};
