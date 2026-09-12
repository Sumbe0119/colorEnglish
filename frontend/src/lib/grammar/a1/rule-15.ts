// frontend/src/lib/grammar/a1/rule-15.ts
// A1 дүрэм 15: Past Simple
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule15: GrammarRule = {
  id: 15,
  title: 'Past Simple',
  titleMn: 'Энгийн өнгөрсөн цаг — болж дууссан зүйл',
  hook: 'Өчигдөр юу хийсэн бэ? Өнгөрсөн амралтын өдөр хаана байсан бэ? Дууссан зүйлээ ярих цаг.',
  summary: 'Past Simple (энгийн өнгөрсөн цаг) нь өнгөрсөнд болж дууссан үйлдэл, байдал, баримтыг хэлнэ. Дүрэмт үйл үг -ed авна, дүрэмт бус үйл үг өөрийн хэлбэртэй; үгүйсгэл, асуултад did орно.',
  description: 'Past Simple буюу энгийн өнгөрсөн цаг нь өнгөрсөн тодорхой үед болоод одоо дууссан үйл явдлыг хэлнэ. Монголоор «явсан», «уулзлаа», «байсан» гэж хэлдэг бүх зүйл энд таарна. Нэг дууссан үйлдэл, дараалсан үйлдлүүд, өнгөрсөн зуршил, өнгөрсөн байдал, өнгөрсөн баримт — тав нь бүгд энэ нэг цагт багтана. Хэлбэр нь хоёр төрөл: дүрэмт үйл үг -ed залгана (work → worked), дүрэмт бус үйл үг өөрийн онцгой хэлбэртэй (go → went). Үгүйсгэх, асуухдаа did туслах үйл үг өнгөрсөн цагийг «үүрч», үндсэн үйл үг үндсэн хэлбэртээ буцна. be үйл үгийн өнгөрсөн нь was / were бөгөөд did хэрэггүй.',
  structure: 'Subject + past verb · Subject + was / were',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'past verb', part: 'verb' },
    { text: '·', part: 'plain' },
    { text: 'Subject', part: 'subject' },
    { text: 'was / were', part: 'verb' },
  ],
  tip: 'yesterday / last … / … ago / in 2025 харагдвал Past Simple. Did орвол үйл үг үндсэн хэлбэртээ буцна: did go, didn\'t see.',
  examples: [
    { en: '[I](s) [was](v) [at home](m) [yesterday](m).', mn: 'Би өчигдөр гэртээ байсан.' },
    { en: '[She](s) [played](v) [tennis](o).', mn: 'Тэр теннис тоглосон.' },
    { en: '[We](s) [went](v) [to the cinema](m).', mn: 'Бид кино театрт очсон.' },
    { en: '[He](s) [didn\'t call](v) [me](o).', mn: 'Тэр над руу залгаагүй.' },
  ],
  useCases: [
    {
      title: 'Өнгөрсөнд болж дууссан үйлдэл',
      description: 'Өнгөрсөн тодорхой цагтай холбоотой, аль хэдийн дууссан нэг үйлдэл. Хэзээ болсныг ихэвчлэн хамт хэлнэ.',
      examples: [
        {
          en: '[I](s) [visited](v) [my grandmother](o) [yesterday](m).',
          mn: 'Би өчигдөр эмээ дээрээ очсон.',
        },
        {
          en: '[She](s) [called](v) [me](o) [last night](m).',
          mn: 'Тэр өчигдөр орой над руу залгасан.',
        },
        { en: '[We](s) [went](v) [to Seoul](m) [in 2025](m).', mn: 'Бид 2025 онд Сөүл явсан.' },
      ],
    },
    {
      title: 'Дараалсан үйлдлүүд',
      description: 'Өгүүллэг, түүх ярихдаа болсон үйлдлүүдийг дэс дарааллаар нь хэлнэ. Үйл үг бүр өнгөрсөн цагийн хэлбэртэй.',
      examples: [
        {
          en: '[I](s) [got up](v), [ate](v) [breakfast](o), and [left](v) [the house](o).',
          mn: 'Би босоод, өглөөний цайгаа уугаад, гэрээсээ гарсан.',
        },
        {
          en: '[He](s) [opened](v) [the door](o) and [walked in](v).',
          mn: 'Тэр хаалгаа онгойлгоод орж ирсэн.',
        },
      ],
    },
    {
      title: 'Өнгөрсөн зуршил',
      description: 'Өмнө нь тогтмол хийдэг байсан, одоо хийхээ больсон үйлдлийг ч Past Simple-ээр хэлж болно. Монголоор «хийдэг байсан».',
      examples: [
        {
          en: '[I](s) [played](v) [outside](m) [every day](m) [when I was young](m).',
          mn: 'Би багадаа өдөр бүр гадаа тоглодог байсан.',
        },
        { en: '[She](s) [walked](v) [to school](m).', mn: 'Тэр сургуульдаа алхаж явдаг байсан.' },
      ],
    },
    {
      title: 'Өнгөрсөн байдал, шинж — was / were',
      description: 'Хэн, ямар, хаана байсныг хэлэхэд be үйл үгийн өнгөрсөн хэлбэр was / were-ийг хэрэглэнэ. Монголоор «байсан» гэдэг нь яг энэ.',
      examples: [
        { en: '[I](s) [was](v) [tired](o).', mn: 'Би ядарсан байсан.' },
        { en: '[She](s) [was](v) [at school](m).', mn: 'Тэр сургууль дээрээ байсан.' },
        { en: '[They](s) [were](v) [happy](o).', mn: 'Тэд аз жаргалтай байсан.' },
      ],
    },
    {
      title: 'Өнгөрсөн баримт',
      description: 'Өнгөрсөн тодорхой үед үнэн байсан нөхцөл, баримтыг хэлнэ.',
      examples: [
        {
          en: '[The shop](s) [was](v) [closed](o) [yesterday](m).',
          mn: 'Дэлгүүр өчигдөр хаалттай байсан.',
        },
        {
          en: '[He](s) [lived](v) [in London](m) [in 2019](m).',
          mn: 'Тэр 2019 онд Лондонд амьдарч байсан.',
        },
      ],
    },
  ],
  forms: [
    {
      structure: 'Subject + past verb (worked / went)',
      examples: [
        { en: '[I](s) [worked](v).', mn: 'Би ажилласан.' },
        { en: '[She](s) [played](v).', mn: 'Тэр тоглосон.' },
        { en: '[They](s) [went](v).', mn: 'Тэд явсан.' },
      ],
      label: 'Батлах — үндсэн үйл үг',
    },
    {
      structure: 'Subject + didn\'t + base verb',
      examples: [
        { en: '[I](s) [didn\'t work](v).', mn: 'Би ажиллаагүй.' },
        { en: '[She](s) [didn\'t play](v).', mn: 'Тэр тоглоогүй.' },
        { en: '[They](s) [didn\'t go](v).', mn: 'Тэд яваагүй.' },
      ],
      label: 'Үгүйсгэх — үндсэн үйл үг',
    },
    {
      structure: 'Did + subject + base verb?',
      examples: [
        { en: '[Did](v) [you](s) [work](v)?', mn: 'Чи ажилласан уу?' },
        { en: '[Did](v) [she](s) [play](v)?', mn: 'Тэр тоглосон уу?' },
        { en: '[Did](v) [they](s) [go](v)?', mn: 'Тэд явсан уу?' },
      ],
      label: 'Асуух — үндсэн үйл үг',
    },
    {
      structure: 'I/He/She/It was · You/We/They were',
      examples: [
        { en: '[I](s) [was](v) [home](m).', mn: 'Би гэртээ байсан.' },
        { en: '[They](s) [were](v) [tired](o).', mn: 'Тэд ядарсан байсан.' },
        { en: '[Was](v) [she](s) [there](m)?', mn: 'Тэр тэнд байсан уу?' },
        { en: '[We](s) [weren\'t](v) [late](o).', mn: 'Бид хоцроогүй.' },
      ],
      label: 'be үйл үг — was / were',
    },
  ],
  signalWords: [
    'yesterday',
    'last night',
    'last week',
    'last year',
    'two days ago',
    'in 2020',
    'when I was young',
  ],
  notes: [
    'Дүрэмт үйл үг (regular verb) ихэвчлэн -ed авна: work → worked, play → played. -e-ээр төгссөн бол зөвхөн -d: live → lived.',
    'Дүрэмт бус үйл үг (irregular verb) өөрийн онцгой хэлбэртэй: go → went, see → saw, eat → ate, have → had. Эдгээрийг дүрмээр гаргах боломжгүй, цээжлээрэй.',
    'did / didn\'t орсны дараа үйл үг үндсэн хэлбэрээ (base verb) авна: Did you go?, I didn\'t see. Өнгөрсөн цагийг did өөрөө үүрсэн тул үйл үг дахин өөрчлөгдөхгүй.',
    'be үйл үгийн өнгөрсөн цаг (was / were) асуулт, үгүйсгэлд did хэрэглэхгүй: Was she tired? / She wasn\'t tired. was / were өөрөө эзний урд гарч асуулт үүсгэнэ.',
    'Past Simple-д эзэн ямар ч байсан үйл үгийн хэлбэр адилхан: I went, she went, they went. Present Simple-ийн -s энд байхгүй. Зөвхөн was / were эзнээсээ хамаарна.',
  ],
  commonMistakes: [
    {
      wrong: 'We goed to the cinema.',
      correct: 'We went to the cinema.',
      explanation: 'go бол дүрэмт бус үйл үг, -ed авдаггүй: go → went.',
    },
    {
      wrong: 'She didn\'t played tennis.',
      correct: 'She didn\'t play tennis.',
      explanation: 'didn\'t аль хэдийн өнгөрсөн цагийг заасан тул дараах үйл үг үндсэн хэлбэртээ байна: play.',
    },
    {
      wrong: 'Did he went home?',
      correct: 'Did he go home?',
      explanation: 'Did өнгөрсөн цагийг тэмдэглэсэн учраас үндсэн үйл үг went биш go байна. Нэг өгүүлбэрт өнгөрсөн цагийг хоёр удаа тэмдэглэхгүй.',
    },
    {
      wrong: 'Did she was tired?',
      correct: 'Was she tired?',
      explanation: 'was / were өөрөө асуулт үүсгэнэ, did хэрэггүй. was-ийг эзний урд гаргахад л асуулт болно.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор -сан/-сэн, -лаа/-лээ, -в нөхцөл ямар ч үйл үгэнд адилхан залгагдана: явсан, идсэн, үзсэн. Англиар ийм нэг дүрэм байхгүй — олон түгээмэл үйл үг (go → went, eat → ate, see → saw) өөр хэлбэртэй тул тус тусад нь цээжлэх хэрэгтэй.',
      'Монголоор үгүйсгэхэд өнгөрсөн цагийн нөхцөл үйл үг дээрээ үлддэг: «явсангүй». Англиар өнгөрсөн цаг did рүү нүүж, үйл үг үндсэн хэлбэртээ буцна: didn\'t go (didn\'t went биш).',
      'Монголоор «байсан» гэдэг нь англиар was / were. «Би ядарсан байсан» → I was tired, «Тэд гэртээ байсан» → They were at home. Энд did ер хэрэггүй.',
      'Монголоор асуухад «уу/үү» хойно нэмэгддэг: «Чи явсан уу?». Англиар Did өгүүлбэрийн урд гарч ирнэ: Did you go? Асуултын үг урд, үйл үг үндсэн хэлбэрээр — энэ хоёрыг хамт санаарай.',
    ],
  },
  dialogue: [
    {
      en: '[What](m) [did](v) [you](s) [do](v) [last weekend](m)?',
      mn: 'Чи өнгөрсөн амралтын өдрүүдэд юу хийсэн бэ?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [went](v) [to the countryside](m) [with my family](m).',
      mn: 'Би гэр бүлийнхэнтэйгээ хөдөө явсан.',
      speaker: 'Saraa',
    },
    {
      en: '[Was](v) [the weather](s) [good](o)?',
      mn: 'Цаг агаар сайхан байсан уу?',
      speaker: 'Bat',
    },
    {
      en: '[No](o), [it](s) [wasn\'t](v). [It](s) [rained](v) [all day](m).',
      mn: 'Үгүй ээ, сайхан биш байсан. Өдөржин бороо орсон.',
      speaker: 'Saraa',
    },
    { en: '[Did](v) [you](s) [ride](v) [a horse](o)?', mn: 'Чи морь унасан уу?', speaker: 'Bat' },
    {
      en: '[No](o), [I](s) [didn\'t](v). [I](s) [stayed](v) [in the ger](m) and [drank](v) [tea](o).',
      mn: 'Үгүй, унаагүй. Би гэртээ суугаад цай уусан.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: '15-1',
      explanation: 'yesterday өнгөрсөн цагийг зааж байна. go дүрэмт бус үйл үг: go → went. go / goes нь одоо цаг, going нь ганцаараа үйл үг болж чадахгүй.',
      ruleId: 15,
      kind: 'fill',
      question: 'We ___ to the cinema yesterday.',
      options: ['go', 'goes', 'went', 'going'],
      answer: 'went',
      hint: 'yesterday гэдэг дохио үгийг хараарай. go дүрэмт үйл үг үү, дүрэмт бус уу?',
    },
    {
      id: '15-2',
      explanation: 'didn\'t өнгөрсөн цагийг үүрсэн тул үйл үг үндсэн хэлбэртээ: play. didn\'t played хоёр дахин өнгөрсөн болгож байна; don\'t одоо цаг; not played-д туслах үйл үг дутуу.',
      ruleId: 15,
      kind: 'fill',
      question: 'She ___ tennis last night.',
      options: ['didn\'t play', 'didn\'t played', 'don\'t played', 'not played'],
      answer: 'didn\'t play',
      hint: 'Үгүйсгэлд өнгөрсөн цагийг хэн үүрдэг вэ — did үү, үйл үг үү?',
    },
    {
      id: '15-3',
      explanation: 'be үйл үгийн өнгөрсөн (was) өөрөө эзний урд гарч асуулт үүсгэнэ, did хэрэггүй. tired бол үйл үг биш, тиймээс Did she tired буруу; she-тэй were биш was хэрэглэнэ.',
      ruleId: 15,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Did she was tired yesterday?',
        'Was she tired yesterday?',
        'Did she tired yesterday?',
        'Were she tired yesterday?',
      ],
      answer: 'Was she tired yesterday?',
      hint: 'tired-ийн урд be үйл үг хэрэгтэй. Тэгвэл did хэрэгтэй юу?',
    },
    {
      id: '15-4',
      explanation: 'Өнгөрсөн цагийн үгүйсгэл: didn\'t + үндсэн үйл үг. didn\'t called давхар өнгөрсөн; doesn\'t одоо цаг тул yesterday-тэй таарахгүй; not called-д did дутуу.',
      ruleId: 15,
      kind: 'translate',
      question: 'Тэр өчигдөр над руу залгаагүй.',
      options: [
        'He didn\'t call me yesterday.',
        'He didn\'t called me yesterday.',
        'He doesn\'t call me yesterday.',
        'He not called me yesterday.',
      ],
      answer: 'He didn\'t call me yesterday.',
      hint: '«залгаагүй» — өнгөрсөн цаг, үгүйсгэл. Англиар өнгөрсөн цагийг аль үг үүрэх вэ?',
    },
  ],
};
