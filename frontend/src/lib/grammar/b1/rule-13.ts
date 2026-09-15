// frontend/src/lib/grammar/b1/rule-13.ts
// B1 дүрэм 13: Defining vs. non-defining relative clauses
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule13: GrammarRule = {
  id: 13,
  title: 'Defining vs. non-defining relative clauses',
  titleMn: 'Тодотгол гишүүн өгүүлбэрийн хоёр төрөл — заавал хэрэгтэй ба нэмэлт мэдээлэл',
  hook: '«Миний Дарханд амьдардаг ах» (нэг ах) уу, «Миний ах, Дарханд амьдардаг» (ганц ах, нэмэлт мэдээлэл) үү? Таслал утгыг өөрчилдөг.',
  summary: 'Тодорхойлох (defining) тодотгол өгүүлбэр нь ЯМАР хүн/юмны тухай ярьж байгааг тодруулна, таслалгүй, that хэрэглэж болно, тусагдахууны төлөөний үгийг орхиж болно. Тодорхойлохгүй (non-defining) тодотгол өгүүлбэр нь аль хэдийн тодорхой хүн/юмны тухай НЭМЭЛТ мэдээлэл өгнө, таслалтай, that хэрэглэхгүй, төлөөний үгийг орхиж болохгүй. Мөн whose (хэний), whom, where, when-ийг үзнэ.',
  description: 'A2 түвшинд бид who / which / that / where-ээр тодотгол өгүүлбэр үүсгэж сурсан: The man who lives next door is a doctor. Эдгээр нь бүгд ТОДОРХОЙЛОХ (defining) тодотгол байсан — аль хүн, аль юмны тухай ярьж байгааг заана, хасвал утга дутуу болно. B1-д хоёр дахь төрлийг нэмнэ: ТОДОРХОЙЛОХГҮЙ (non-defining) тодотгол. Энэ нь аль хэдийн тодорхой байгаа хүн, юмны тухай нэмэлт, хажуугийн мэдээлэл өгнө: My brother, who lives in Darkhan, is a doctor — надад ганц ах бий, тэр Дарханд амьдардаг (нэмэлт), эмч. Харьцуулбал My brother who lives in Darkhan is a doctor — надад хэд хэдэн ах бий, Дарханд амьдардаг нь эмч. Хоёр төрлийн гурван ялгаа: (1) non-defining нь таслалаар тусгаарлагдана, (2) non-defining-д that хэрэглэхгүй — зөвхөн who / which / whose / where, (3) non-defining-д төлөөний үгийг орхиж болохгүй. Мөн шинэ төлөөний үгс: whose (хэний — эзэмшил), whom (хэнийг — албан ёсны тусагдахуун), when (хэзээ — цаг), why (яагаад — шалтгаан). Which нь non-defining-д өмнөх бүтэн өгүүлбэрийг ч заадаг: He passed the exam, which surprised everyone. Монголоор тодотгол өгүүлбэр тодотгож буй үгийнхээ ӨМНӨ ирдэг (Дарханд амьдардаг ах) бол англиар АРД нь ирдэг (brother who lives in Darkhan), таслалын ялгаа монголд хэлбэрээр биш аялгаар илэрдэг.',
  structure: 'Noun + who / which / that + clause (defining, таслалгүй) · Noun, + who / which + clause, (non-defining, таслалтай)',
  structureParts: [
    { text: 'My brother', part: 'subject' },
    { text: ', who lives in Darkhan,', part: 'modifier' },
    { text: 'is', part: 'verb' },
    { text: 'a doctor', part: 'object' },
  ],
  tip: 'Тодотголыг хасаад утга нь дутуу болбол defining (таслалгүй, that болно). Хасаад ч гол утга бүтэн үлдвэл non-defining (таслалтай, that болохгүй, орхиж болохгүй).',
  examples: [
    { en: '[The woman](s) [who lives next door](m) [is](v) [a teacher](o).', mn: 'Хажууд амьдардаг эмэгтэй багш. (аль эмэгтэй — тодорхойлно)' },
    { en: '[My mother](s), [who is 60](m), [still works](v) [every day](m).', mn: 'Миний ээж, 60 настай, өдөр бүр ажилласаар байгаа. (нэмэлт мэдээлэл)' },
    { en: '[That](s)[\'s](v) [the man](o) [whose car was stolen](m).', mn: 'Тэр бол машиныг нь хулгайлсан тэр хүн.' },
    { en: '[She](s) [passed](v) [the exam](o), [which made her parents very happy](m).', mn: 'Тэр шалгалтаа давсан нь эцэг эхийг нь маш их баярлуулсан.' },
  ],
  useCases: [
    {
      title: 'Тодорхойлох тодотгол — аль нь гэдгийг заана (A2-ийн давталт)',
      description: 'Тодотгол өгүүлбэргүйгээр ямар хүн, юмны тухай ярьж байгаа нь тодорхойгүй болно. Таслалгүй. who / which-ийн оронд that хэрэглэж болно. Тодотгол доторх тусагдахуун бол төлөөний үгийг орхиж болно.',
      examples: [
        { en: '[The book](s) [that you lent me](m) [was](v) [great](o).', mn: 'Чиний надад зээлсэн ном гоё байсан.' },
        { en: '[People](s) [who exercise regularly](m) [live](v) [longer](m).', mn: 'Тогтмол дасгал хийдэг хүмүүс илүү удаан амьдардаг.' },
        { en: '[This](s) [is](v) [the café](o) [(which) I told you about](m).', mn: 'Энэ бол миний чамд ярьж байсан тэр кафе.' },
      ],
    },
    {
      title: 'Тодорхойлохгүй тодотгол — нэмэлт мэдээлэл, таслалтай',
      description: 'Хүн, юм нь аль хэдийн тодорхой (нэр, ганц эцэг эх, хот, эсвэл тодорхой зүйл). Тодотгол нь зөвхөн нэмэлт мэдээлэл, хасвал гол утга хэвээр. Таслалаар тусгаарлана, that хэрэглэхгүй, төлөөний үг орхигдохгүй.',
      examples: [
        { en: '[Ulaanbaatar](s), [which is the capital of Mongolia](m), [is](v) [very cold in winter](o).', mn: 'Улаанбаатар, Монголын нийслэл, өвөлдөө маш хүйтэн байдаг.' },
        { en: '[My father](s), [who is a doctor](m), [works](v) [at the hospital](m).', mn: 'Миний аав, эмч хүн, эмнэлэгт ажилладаг.' },
        { en: '[We](s) [stayed](v) [at the Blue Sky Hotel](m), [which was very expensive](m).', mn: 'Бид Хөх Тэнгэр зочид буудалд байрласан, тэр нь маш үнэтэй байсан.' },
      ],
    },
    {
      title: 'Таслал утгыг өөрчилнө — хоёр төрлийг харьцуулах',
      description: 'Ижил үгс, зөвхөн таслал өөр — утга огт өөр. Defining бол олноос нэгийг ялгана, non-defining бол ганцхан байгаагийн тухай нэмэлт хэлнэ.',
      examples: [
        { en: '[My sister](s) [who lives in London](m) [is](v) [a nurse](o).', mn: 'Лондонд амьдардаг эгч минь сувилагч. (хэд хэдэн эгчтэй, Лондонд байдаг нь)' },
        { en: '[My sister](s), [who lives in London](m), [is](v) [a nurse](o).', mn: 'Миний эгч, Лондонд амьдардаг, сувилагч. (ганцхан эгчтэй)' },
        { en: '[The students](s) [who passed](m) [got](v) [a prize](o). / [The students](s), [who passed](m), [got](v) [a prize](o).', mn: 'Давсан сурагчид шагнал авсан (зарим нь). / Сурагчид, бүгд давсан, шагнал авсан (бүгд).' },
      ],
    },
    {
      title: 'whose — хэний (эзэмшил)',
      description: 'his / her / their / its-ийн оронд тодотголд whose хэрэглэнэ. Хүнд ч, юманд ч болно. Ард нь нэр үг заавал ирнэ. Хоёр төрөлд аль алинд нь хэрэглэнэ.',
      examples: [
        { en: '[I](s) [know](v) [a girl](o) [whose father is a pilot](m).', mn: 'Би аав нь нисгэгч нэг охиныг мэднэ.' },
        { en: '[That](s)[\'s](v) [the house](o) [whose roof was damaged in the storm](m).', mn: 'Тэр бол шуурганд дээвэр нь эвдэрсэн байшин.' },
        { en: '[Bat](s), [whose wife is a teacher](m), [helps](v) [at the school](m).', mn: 'Бат, эхнэр нь багш, сургуульд тусалдаг.' },
      ],
    },
    {
      title: 'where / when / why ба бүтэн өгүүлбэрийг заах which',
      description: 'where (газар), when (цаг), why (шалтгаан) нь тодотголд угтвар үг + which-ийн оронд орно. Non-defining which нь өмнөх бүтэн өгүүлбэрийг заах боломжтой — «энэ нь …» гэсэн утгатай.',
      examples: [
        { en: '[I](s) [remember](v) [the day](o) [when we first met](m).', mn: 'Би бидний анх уулзсан өдрийг санадаг.' },
        { en: '[That](s)[\'s](v) [the reason](o) [why I called you](m).', mn: 'Тэр бол миний чам руу залгасан шалтгаан.' },
        { en: '[He](s) [arrived](v) [two hours late](m), [which annoyed everyone](m).', mn: 'Тэр хоёр цаг хоцорч ирсэн нь бүгдийг бухимдуулсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Defining — who / which / that (таслалгүй)',
      structure: 'Noun + who (хүн) / which (юм) / that (аль аль нь) + verb …',
      examples: [
        { en: '[The doctor](s) [who treated me](m) [was](v) [very kind](o).', mn: 'Намайг эмчилсэн эмч маш эелдэг байсан.' },
        { en: '[I](s) [like](v) [films](o) [that make me laugh](m).', mn: 'Би намайг инээлгэдэг кинонд дуртай.' },
        { en: '[The phone](s) [(which) I bought last week](m) [doesn\'t work](v).', mn: 'Миний өнгөрсөн долоо хоногт авсан утас ажиллахгүй байна.' },
      ],
    },
    {
      label: 'Non-defining — who / which (таслалтай, that байхгүй)',
      structure: 'Noun, + who / which + verb …, + …',
      examples: [
        { en: '[Tuya](s), [who I met at university](m), [now lives](v) [in Korea](m).', mn: 'Туяа, түүнтэй би их сургуульд танилцсан, одоо Солонгост амьдардаг.' },
        { en: '[This laptop](s), [which cost me a fortune](m), [is](v) [already broken](o).', mn: 'Энэ зөөврийн компьютер, надад асар их мөнгө болсон, аль хэдийн эвдэрчихсэн.' },
        { en: '[The Gobi](s), [which is in the south](m), [is](v) [a desert](o).', mn: 'Говь, өмнөд хэсэгт байдаг, цөл юм.' },
      ],
    },
    {
      label: 'whose / whom',
      structure: 'Noun + whose + noun … · Noun + whom (албан ёсны тусагдахуун) · preposition + whom / which',
      examples: [
        { en: '[The boy](s) [whose bike was stolen](m) [is](v) [my neighbour](o).', mn: 'Дугуйг нь хулгайлсан хүү манай хөрш.' },
        { en: '[The woman](s) [whom you spoke to](m) [is](v) [the manager](o).', mn: 'Таны ярьсан эмэгтэй бол менежер.' },
        { en: '[The people](s) [with whom I work](m) [are](v) [friendly](o).', mn: 'Миний хамт ажилладаг хүмүүс найрсаг.' },
      ],
    },
    {
      label: 'where / when / why',
      structure: 'place + where … · time + when … · reason + why …',
      examples: [
        { en: '[This](s) [is](v) [the town](o) [where I grew up](m).', mn: 'Энэ бол миний өссөн хот.' },
        { en: '[2020](s) [was](v) [the year](o) [when everything changed](m).', mn: '2020 бол бүх зүйл өөрчлөгдсөн жил байсан.' },
        { en: '[Do](v) [you](s) [know](v) [the reason](o) [why she left](m)?', mn: 'Тэр яагаад явсан шалтгааныг чи мэдэх үү?' },
      ],
    },
  ],
  signalWords: ['who', 'which', 'that', 'whose', 'whom', 'where', 'when', 'why', ', which', ', who'],
  notes: [
    'Non-defining тодотголд that ХЭЗЭЭ Ч хэрэглэхгүй: My mother, that is 60, … (буруу) → My mother, who is 60, … (зөв).',
    'Non-defining тодотголд төлөөний үгийг орхиж болохгүй: The hotel, we stayed at, … (буруу) → The hotel, which we stayed at, … (зөв).',
    'Defining тодотголд төлөөний үг ТУСАГДАХУУН бол орхиж болно: The book (that) I read. ЭЗЭН бол орхиж болохгүй: The man who called (who-г орхихгүй).',
    'Нэр (Bat, Ulaanbaatar), ганц байдаг зүйл (my mother, the sun), эзэмшлийн үг (my car) зэрэг аль хэдийн тодорхой үгсийн ард ихэвчлэн non-defining ирнэ.',
    'Ярианд таслалыг түр зогсолт, аялгаар илэрхийлнэ. Non-defining тодотгол хэлэхдээ өмнө нь, ард нь бага зэрэг завсарлана.',
    'Бичгийн хэлэнд угтвар үгийг which / whom-ын өмнө тавьж болно: the city in which I live. Ярианд төгсгөлд нь: the city (which) I live in.',
  ],
  commonMistakes: [
    {
      wrong: 'My father, that is a doctor, works at the hospital.',
      correct: 'My father, who is a doctor, works at the hospital.',
      explanation: 'Non-defining тодотголд (таслалтай) that хэрэглэхгүй. Хүнд who, юманд which.',
    },
    {
      wrong: 'Ulaanbaatar which is the capital is very cold.',
      correct: 'Ulaanbaatar, which is the capital, is very cold.',
      explanation: 'Улаанбаатар нэр тул аль хэдийн тодорхой — тодотгол нь нэмэлт мэдээлэл, таслалтай байх ёстой. Таслалгүй бол «хэд хэдэн Улаанбаатараас нийслэл нь» гэсэн утгагүй утга гарна.',
    },
    {
      wrong: 'That\'s the man who his car was stolen.',
      correct: 'That\'s the man whose car was stolen.',
      explanation: 'Эзэмшил заахад who + his биш, whose. whose нь who + his/her/their хоёрыг нэг үгэнд багтаана.',
    },
    {
      wrong: 'I remember the day which we first met.',
      correct: 'I remember the day when we first met. / … the day (that) we first met.',
      explanation: 'Цаг заасан үгийн ард when (эсвэл on which). which дангаараа цагийн утга өгөхгүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор тодотгол өгүүлбэр үргэлж тодотгож буй үгийн ӨМНӨ ирдэг: «Дарханд амьдардаг ах», «чиний надад зээлсэн ном». Англиар АРД нь ирдэг: brother who lives in Darkhan, the book that you lent me. Дараалал эсрэг тул орчуулахдаа өгүүлбэрийг «эргүүлэх» хэрэгтэй.',
      'Монголоор defining ба non-defining-ийн ялгааг хэлбэрээр биш, аялга, завсарлагаар илэрхийлдэг эсвэл «миний ах — тэр Дарханд амьдардаг —» гэж тусад нь хэлдэг. Англиар энэ ялгаа таслал, that хэрэглэх эсэх, төлөөний үг орхих эсэх гэсэн гурван бичгийн дүрмээр тодорхой илэрдэг.',
      'Монголоор «-ын/-ийн нь» (машиныг нь хулгайлсан хүн, аав нь нисгэгч охин) гэсэн эзэмшлийн бүтэц whose-тэй яг таардаг. «нь» харагдвал whose гэж бодоорой.',
      'Монголоор «энэ нь …» (тэр хоцорч ирсэн нь бүгдийг бухимдуулсан) гэж өмнөх бүтэн санааг заадаг «нь» нь non-defining which-тэй таардаг: …, which annoyed everyone.',
    ],
  },
  dialogue: [
    {
      en: 'Bat, [who](s)[\'s](v) [that man](o) [who\'s talking to Tuya](m)?',
      mn: 'Бат, Туяатай ярьж байгаа тэр хүн хэн бэ?',
      speaker: 'Saraa',
    },
    {
      en: '[That](s)[\'s](v) [Mr Dorj](o), [who used to be our English teacher](m). [He](s)[\'s](v) [the one](o) [whose classes were always full](m).',
      mn: 'Тэр бол Дорж багш, манай англи хэлний багш байсан. Хичээл нь үргэлж дүүрэн байдаг тэр хүн.',
      speaker: 'Bat',
    },
    {
      en: 'Oh, [the teacher](s) [that everyone loved](m)! [Where](m) [does](v) [he](s) [work](v) [now](m)?',
      mn: 'Аа, бүгдийн хайртай байсан тэр багш! Одоо хаана ажилладаг вэ?',
      speaker: 'Saraa',
    },
    {
      en: '[At the university](m), [which is why he\'s here today](m). [He](s)[\'s giving](v) [a talk](o) [in the hall](m) [where we had our graduation](m).',
      mn: 'Их сургуульд, тийм учраас өнөөдөр энд байгаа. Бидний төгсөлт болсон тэр танхимд илтгэл тавьж байгаа.',
      speaker: 'Bat',
    },
    {
      en: '[Let\'s go](v) [and say hello](m). [I](s) [still remember](v) [the day](o) [when he told me I\'d pass the exam](m).',
      mn: 'Очиж мэндэлцгээе. Намайг шалгалтаа давна гэж хэлсэн тэр өдрийг би одоо ч санадаг.',
      speaker: 'Saraa',
    },
    {
      en: '[And](m) [you](s) [did](v), [which proved him right](m)!',
      mn: 'Тэгээд чи давсан нь түүнийг зөв гэдгийг батлав!',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'b1-13-1',
      ruleId: 13,
      kind: 'fill',
      question: 'My mother, ___ is a nurse, works at night.',
      options: ['that', 'who', 'which', 'whose'],
      answer: 'who',
      explanation: 'Таслалтай non-defining тодотгол, хүний тухай тул who. that non-defining-д хэрэглэхгүй, which юманд, whose эзэмшилд.',
      hint: 'Таслалтай бол that болохгүй.',
    },
    {
      id: 'b1-13-2',
      ruleId: 13,
      kind: 'fill',
      question: 'That\'s the woman ___ son won the competition.',
      options: ['who', 'which', 'whose', 'that'],
      answer: 'whose',
      explanation: '«Хүү нь тэмцээнд түрүүлсэн эмэгтэй» — эзэмшил (her son) тул whose. Ард нь нэр үг (son) байгаа нь whose-ийн шинж.',
      hint: '«-ын нь» = эзэмшил.',
    },
    {
      id: 'b1-13-3',
      ruleId: 13,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Paris, that is the capital of France, is beautiful.',
        'The man which lives next door is a doctor.',
        'She got the job, which surprised nobody.',
        'The hotel, we stayed in, was expensive.',
      ],
      answer: 'She got the job, which surprised nobody.',
      explanation: 'Non-defining which өмнөх бүтэн өгүүлбэрийг заана — зөв. Paris-ийн ард that болохгүй (which); хүнд which биш who; non-defining-д төлөөний үгийг орхихгүй (which we stayed in).',
      hint: 'Таслалын ард that байж болохгүй, төлөөний үг орхигдохгүй.',
    },
    {
      id: 'b1-13-4',
      ruleId: 13,
      kind: 'translate',
      question: 'Энэ бол миний өссөн хот.',
      options: [
        'This is the town where I grew up.',
        'This is the town which I grew up.',
        'This is the town, where I grew up.',
        'This is the town who I grew up.',
      ],
      answer: 'This is the town where I grew up.',
      explanation: 'Газар + өссөн (in the town) — where. Аль хот гэдгийг тодорхойлж байгаа тул таслалгүй defining. which гэвэл угтвар үг (in which) хэрэгтэй болно.',
      hint: 'Газар заасан defining тодотгол.',
    },
  ],
};
