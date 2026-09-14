// frontend/src/lib/grammar/a2/rule-04.ts
// A2 дүрэм 4: Present Perfect vs. Past Simple
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule04: GrammarRule = {
  id: 4,
  title: 'Present Perfect vs. Past Simple',
  titleMn: 'Одоо төгссөн ба энгийн өнгөрсөн цаг — хэзээ гэдэг нь чухал уу?',
  hook: '«Have you ever been to Khuvsgul?» — «Yes, I went there in 2019.» Нэг яриа, хоёр өөр цаг. Яагаад?',
  summary: 'Хэзээ болсныг заасан, дууссан цаг хугацаа (yesterday, last year, in 2020, ago) байвал Past Simple. Хэзээ гэдгийг заагаагүй эсвэл хугацаа нь дуусаагүй (ever, never, just, already, yet, for, since, today) бол Present Perfect.',
  description: 'Present Perfect ба Past Simple хоёулаа өнгөрсөн үйлдлийг хэлдэг ч харах өнцөг нь өөр. Past Simple үйлдлийг өнгөрсөн цагийн тодорхой нэг цэгт байрлуулна: «I went there in 2019» — хэзээ гэдэг нь тодорхой, тэр хугацаа дууссан. Present Perfect харин хэзээ гэдгийг орхиж, одоотой холбоод хэлнэ: «I have been there» — амьдралынхаа туршид, одоо хүртэл. Тиймээс шийдэх түлхүүр нь цаг заасан үг: yesterday, last week, in 2020, two days ago, when I was a child гэсэн дууссан хугацаа → Past Simple; ever, never, just, already, yet, for, since, today, this week гэсэн дуусаагүй эсвэл тодорхойгүй хугацаа → Present Perfect. Ярианд хоёр цаг ихэвчлэн хамт явдаг: эхлээд Present Perfect-ээр туршлагаа асууж, дараа нь Past Simple-ээр дэлгэрэнгүйг нь ярина. Монгол хэлэнд хоёулаа «-сан» гэж орчуулагддаг тул ялгааг цаг заасан үгээр нь таньж сураарай.',
  structure: 'Subject + have / has + V3 (хэзээ нь чухал биш) · Subject + past verb + finished time',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'have / has + V3', part: 'verb' },
    { text: '·', part: 'plain' },
    { text: 'Subject', part: 'subject' },
    { text: 'past verb', part: 'verb' },
    { text: 'finished time', part: 'modifier' },
  ],
  tip: 'Өөрөөсөө асуу: «Хэзээ?» гэж хэлж байна уу? Тийм бол Past Simple. Хэлэхгүй, эсвэл «одоо хүртэл» гэсэн утгатай бол Present Perfect.',
  examples: [
    { en: '[I](s) [have visited](v) [Khuvsgul](o).', mn: 'Би Хөвсгөлд очиж үзсэн.' },
    { en: '[I](s) [visited](v) [Khuvsgul](o) [in 2019](m).', mn: 'Би 2019 онд Хөвсгөлд очсон.' },
    { en: '[She](s) [has just finished](v) [her exam](o).', mn: 'Тэр дөнгөж сая шалгалтаа өгч дууслаа.' },
    { en: '[She](s) [finished](v) [her exam](o) [an hour ago](m).', mn: 'Тэр нэг цагийн өмнө шалгалтаа өгч дууссан.' },
  ],
  useCases: [
    {
      title: 'Дууссан цаг хугацаа → Past Simple',
      description: 'yesterday, last month, in 2015, three days ago, when I was ten гэсэн үгс хугацааг тодорхой, дууссан болгоно. Ийм үг байвал ямар ч эргэлзээгүй Past Simple.',
      examples: [
        { en: '[We](s) [moved](v) [to Ulaanbaatar](m) [in 2015](m).', mn: 'Бид 2015 онд Улаанбаатар руу нүүсэн.' },
        { en: '[He](s) [broke](v) [his leg](o) [two years ago](m).', mn: 'Тэр хоёр жилийн өмнө хөлөө хугалсан.' },
        { en: '[I](s) [met](v) [her](o) [last summer](m).', mn: 'Би түүнтэй өнгөрсөн зун танилцсан.' },
      ],
    },
    {
      title: 'Тодорхойгүй эсвэл дуусаагүй хугацаа → Present Perfect',
      description: 'Хэзээ гэдгийг хэлээгүй, эсвэл today, this week, so far, in my life гэх мэт хараахан дуусаагүй хугацааны дотор болсон бол Present Perfect. Дахин болох боломж нээлттэй.',
      examples: [
        { en: '[I](s) [have read](v) [two books](o) [this month](m).', mn: 'Би энэ сард хоёр ном уншчихсан байна.' },
        { en: '[She](s) [has changed](v) [jobs](o) [three times](m).', mn: 'Тэр гурван удаа ажлаа сольсон.' },
        { en: '[We](s) [have had](v) [a lot of rain](o) [today](m).', mn: 'Өнөөдөр их бороо орлоо.' },
      ],
    },
    {
      title: 'Ярианы загвар: туршлага асуугаад дэлгэрэнгүй ярих',
      description: 'Эхлээд Present Perfect-ээр «хэзээ нэгэн цагт …?» гэж асууна. Хариулт «тийм» бол дараагийн асуулт, хариулт хэзээ, хаана, хэрхэн гэдэг дэлгэрэнгүй тул Past Simple руу шилжинэ.',
      examples: [
        { en: '[Have](v) [you](s) [ever been](v) [to Khuvsgul](m)? — [Yes](o), [I](s) [went](v) [there](m) [in 2019](m).', mn: 'Чи Хөвсгөлд очиж үзсэн үү? — Тийм ээ, би 2019 онд очсон.' },
        { en: '[Has](v) [she](s) [tried](v) [horse milk](o)? — [Yes](o), [she](s) [tried](v) [it](o) [last summer](m).', mn: 'Тэр айраг ууж үзсэн үү? — Тийм ээ, өнгөрсөн зун ууж үзсэн.' },
        { en: '[I](s)[\'ve](v) [seen](v) [that film](o). [I](s) [saw](v) [it](o) [with my sister](m).', mn: 'Би тэр киног үзсэн. Эгчтэйгээ хамт үзсэн.' },
      ],
    },
    {
      title: 'been ба gone',
      description: 'go-ийн Present Perfect хоёр хэлбэртэй: has been to — очоод буцаж ирсэн, has gone to — яваад одоо тэнд байгаа. Хэрэв хэзээ явсныг хэлбэл Past Simple went болно.',
      examples: [
        { en: '[Bat](s) [has been](v) [to Korea](m). [He](s) [is](v) [back](o) [now](m).', mn: 'Бат Солонгост очиж үзсэн. Одоо буцаж ирсэн.' },
        { en: '[Bat](s) [has gone](v) [to Korea](m). [He](s) [is](v) [there](m) [now](m).', mn: 'Бат Солонгос руу явчихсан. Одоо тэнд байгаа.' },
        { en: '[Bat](s) [went](v) [to Korea](m) [last March](m).', mn: 'Бат өнгөрсөн гуравдугаар сард Солонгос явсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Present Perfect — хэзээ нь чухал биш',
      structure: 'Subject + have / has + V3 (+ ever / never / just / already / yet / for / since)',
      examples: [
        { en: '[I](s) [have already sent](v) [the email](o).', mn: 'Би имэйлээ аль хэдийн илгээчихсэн.' },
        { en: '[They](s) [have known](v) [each other](o) [for years](m).', mn: 'Тэд олон жил бие биенээ мэднэ.' },
        { en: '[He](s) [hasn\'t called](v) [back](m) [yet](m).', mn: 'Тэр хараахан эргэж залгаагүй байна.' },
      ],
    },
    {
      label: 'Past Simple — дууссан цаг хугацаатай',
      structure: 'Subject + past verb + yesterday / last … / … ago / in + year',
      examples: [
        { en: '[I](s) [sent](v) [the email](o) [an hour ago](m).', mn: 'Би нэг цагийн өмнө имэйлээ илгээсэн.' },
        { en: '[They](s) [met](v) [at university](m) [in 2010](m).', mn: 'Тэд 2010 онд их сургуульд танилцсан.' },
        { en: '[He](s) [didn\'t call](v) [yesterday](m).', mn: 'Тэр өчигдөр залгаагүй.' },
      ],
    },
    {
      label: 'Асуух — хоёр цагаар',
      structure: 'Have / Has + subject + V3 …? · Did + subject + base verb + finished time?',
      examples: [
        { en: '[Have](v) [you](s) [ever lost](v) [your passport](o)?', mn: 'Чи паспортоо гээж үзсэн удаатай юу?' },
        { en: '[Did](v) [you](s) [lose](v) [your passport](o) [on the trip](m)?', mn: 'Чи аялалын үеэр паспортоо гээсэн үү?' },
        { en: '[When](m) [did](v) [you](s) [lose](v) [it](o)?', mn: 'Чи хэзээ гээсэн бэ?' },
      ],
    },
  ],
  signalWords: ['ever', 'never', 'just', 'already', 'yet', 'for', 'since', 'today', 'this week', 'so far', 'yesterday', 'last year', 'in 2020', 'ago', 'when I was a child'],
  notes: [
    'Дууссан хугацааны үгс (Past Simple): yesterday, last night / week / year, in 2020, two days ago, when I was a child, at 5 o\'clock. Дуусаагүй эсвэл тодорхойгүй хугацааны үгс (Present Perfect): ever, never, just, already, yet, for, since, today, this week, so far, recently.',
    'When?, What time?, How long ago? гэсэн асуултууд үргэлж Past Simple: When did you arrive? Харин How long? (одоо хүртэл) Present Perfect: How long have you been here?',
    'today, this week, this morning нь хугацаа дуусаагүй бол Present Perfect, дууссан бол Past Simple: I have had two coffees this morning (одоо өглөө хэвээр). I had two coffees this morning (одоо үдээс хойш болсон).',
    'Ярианд эхний асуулт Present Perfect, дараагийн дэлгэрэнгүй Past Simple: Have you seen the new café? — Yes, I went there on Saturday. It was nice.',
    'has been to = очоод буцаж ирсэн; has gone to = яваад одоо тэнд байгаа; went to + цаг = хэзээ явсныг хэлж байгаа. Гурвыг андуурвал утга алдагдана.',
    'Present Perfect-ийг «дөнгөж сая»-гийн утгаар just-тай хэрэглэдэг: I\'ve just eaten. Америк англи хэлэнд Past Simple-ээр ч хэлдэг (I just ate), гэхдээ британи стандартад Present Perfect зөв.',
  ],
  commonMistakes: [
    {
      wrong: 'I have visited my grandparents last weekend.',
      correct: 'I visited my grandparents last weekend.',
      explanation: 'last weekend бол дууссан, тодорхой хугацаа. Ийм үгтэй үргэлж Past Simple. Present Perfect хэзээ гэдгийг хэлдэггүй.',
    },
    {
      wrong: 'Did you ever eat Indian food?',
      correct: 'Have you ever eaten Indian food?',
      explanation: 'ever — «хэзээ нэгэн цагт, амьдралдаа» гэсэн туршлагын асуулт тул Present Perfect. Did-тэй асуулт тодорхой цаг шаарддаг.',
    },
    {
      wrong: 'When have you arrived?',
      correct: 'When did you arrive?',
      explanation: 'When нь яг хэзээ гэдгийг асууж байгаа тул Present Perfect-тэй хамт хэрэглэхгүй. Хэзээ гэж асуувал үргэлж Past Simple.',
    },
    {
      wrong: 'She has gone to Paris twice.',
      correct: 'She has been to Paris twice.',
      explanation: 'Хоёр удаа очиж үзсэн туршлагыг has been to гэнэ. has gone to гэвэл «одоо Парист байгаа» гэсэн утгатай, twice-тэй нийцэхгүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «Би Хөвсгөлд очсон» гэхэд хэзээ гэдгийг хэлээгүй ч, хэлсэн ч үйл үг «-сан» хэвээрээ. Англиар харин цаг заасан үг байгаа эсэхээс хамаарч have visited эсвэл visited гэж өөрчлөгдөнө. Монголд байхгүй энэ ялгааг цаг заасан үгээр нь таниарай.',
      'Монголоор «Чи … үзсэн үү?» гэж асуухад «-сан удаатай юу?» нэмбэл туршлагын асуулт болно — энэ нь Have you ever…? Харин «өчигдөр … үзсэн үү?» гэвэл Did you … yesterday? Монголд нэмэлт үг, англид өөр цаг.',
      'Монголоор «дөнгөж сая», «аль хэдийн», «хараахан …-аагүй» гэсэн үгс өгүүлбэрт нэмэгддэг ч цаг өөрчлөгддөггүй. Англиар just, already, yet харагдвал цаг нь Present Perfect болж, Past Simple-д шилжихгүй.',
      'Монголоор «явчихсан» (одоо байхгүй) ба «явж үзсэн» (буцаж ирсэн) хоёр өөр. Англиар яг үүнтэй адил has gone to / has been to гэж ялгадаг. Монгол хэлний энэ ялгаа англи хэлийг ойлгоход тусална.',
    ],
  },
  dialogue: [
    {
      en: '[Have](v) [you](s) [ever been](v) [to Khuvsgul Lake](m)?',
      mn: 'Чи Хөвсгөл нуурт очиж үзсэн удаатай юу?',
      speaker: 'Bat',
    },
    {
      en: '[Yes](o), [I](s) [have](v). [I](s) [went](v) [there](m) [in 2019](m) [with my family](m).',
      mn: 'Тийм ээ. Би 2019 онд гэр бүлтэйгээ тэнд очсон.',
      speaker: 'Saraa',
    },
    {
      en: '[Lucky you](o)! [I](s) [have never seen](v) [it](o). [What](o) [did](v) [you](s) [do](v) [there](m)?',
      mn: 'Азтай юм! Би хэзээ ч хараагүй. Чи тэнд юу хийсэн бэ?',
      speaker: 'Bat',
    },
    {
      en: '[We](s) [stayed](v) [in a ger camp](m) [and](m) [rode](v) [horses](o) [every day](m).',
      mn: 'Бид гэр баазад байрлаж, өдөр бүр морь унасан.',
      speaker: 'Saraa',
    },
    {
      en: '[I](s)[\'ve](v) [already booked](v) [a trip](o) [for August](m). [Has](v) [the road](s) [got](v) [better](o) [since then](m)?',
      mn: 'Би наймдугаар сард явахаар аль хэдийн захиалчихсан. Тэр үеэс хойш зам сайжирсан уу?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [don\'t know](v). [I](s) [haven\'t been](v) [back](m) [yet](m), [but](m) [my cousin](s) [drove](v) [there](m) [last year](m) [and](m) [said](v) [it was fine](o).',
      mn: 'Мэдэхгүй. Би хараахан дахиж очоогүй байна, гэхдээ үеэл маань өнгөрсөн жил машинаар очоод зүгээр байсан гэсэн.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-4-1',
      ruleId: 4,
      kind: 'fill',
      question: 'I ___ my grandparents last weekend.',
      options: ['have visited', 'visited', 'has visited', 'visit'],
      answer: 'visited',
      explanation: 'last weekend бол дууссан хугацаа → Past Simple (visited). have / has visited Present Perfect тодорхой цагтай хэрэглэгдэхгүй, visit одоо цаг.',
      hint: '«last …» харагдвал Past Simple.',
    },
    {
      id: 'a2-4-2',
      ruleId: 4,
      kind: 'fill',
      question: '___ you ever ___ to Japan?',
      options: ['Did / go', 'Have / been', 'Have / gone', 'Do / go'],
      answer: 'Have / been',
      explanation: 'ever-тэй туршлагын асуулт → Present Perfect, очиж үзсэн утгаар been. Did / go тодорхой цаг шаардана, gone «одоо тэнд байгаа» утгатай тул ever-тэй нийцэхгүй, Do / go одоо цаг.',
      hint: 'ever + очиж үзсэн → have been to.',
    },
    {
      id: 'a2-4-3',
      ruleId: 4,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['When have you arrived?', 'When did you arrive?', 'When you arrived?', 'When did you arrived?'],
      answer: 'When did you arrive?',
      explanation: 'When — яг хэзээ гэж асууж байгаа тул Past Simple: When did you arrive? Present Perfect When-тэй хамт орохгүй; did-ийн дараа үндсэн хэлбэр (arrive), туслах үйл үггүй асуулт буруу.',
      hint: '«Хэзээ?» гэвэл did.',
    },
    {
      id: 'a2-4-4',
      ruleId: 4,
      kind: 'translate',
      question: 'Би тэр киног үзсэн. Өнгөрсөн долоо хоногт үзсэн.',
      options: ['I have seen that film. I have seen it last week.', 'I saw that film. I have seen it last week.', 'I have seen that film. I saw it last week.', 'I seen that film. I saw it last week.'],
      answer: 'I have seen that film. I saw it last week.',
      explanation: 'Эхний өгүүлбэр хэзээ гэдгийг хэлээгүй → Present Perfect (have seen). Хоёр дахь нь last week гэсэн дууссан цагтай → Past Simple (saw). last week-тэй have seen болохгүй; «I seen» гэсэн хэлбэр байхгүй.',
      hint: 'Эхнийх хэзээ нь чухал биш, хоёр дахь нь «өнгөрсөн долоо хоногт».',
    },
  ],
};
