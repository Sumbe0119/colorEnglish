// frontend/src/lib/grammar/a1/rule-06.ts
// A1 дүрэм 6: Present Simple
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule06: GrammarRule = {
  id: 6,
  title: 'Present Simple',
  titleMn: 'Энгийн одоо цаг — зуршил, үнэн, хуваарь',
  hook: 'Өдөр бүр юу хийдэг вэ? Ер нь юу үргэлж үнэн байдаг вэ? Энэ бүхнийг нэг цагаар хэлнэ.',
  summary: 'Present Simple (энгийн одоо цаг) нь давтагддаг үйлдэл, зуршил, ерөнхий үнэн, хуваарийг хэлнэ. He/She/It дээр үйл үг -s авна; don\'t/doesn\'t, do/does орвол үйл үг үндсэн хэлбэрээрээ үлдэнэ.',
  description: 'Present Simple буюу энгийн одоо цаг нь яг одоо, энэ мөчид болж буй нэг үйлдлийг хэлдэггүй. Харин тогтмол давтагддаг үйлдэл, зуршил, ерөнхий үнэн, байнгын нөхцөл, бодол, дуртай зүйл, албан ёсны хуваарийг хэлнэ. Монголоор «-даг/-дэг» (явдаг, иддэг, ажилладаг) гэж хэлдэг бараг бүх зүйл энэ цагт таарна. Дүрэм нь маш энгийн: I/You/We/They дээр үйл үг өөрчлөгдөхгүй, He/She/It дээр үйл үгэнд -s (эсвэл -es) залгана. Энэ ганцхан -s бол монгол хүний хамгийн их мартдаг үсэг, тиймээс тусгайлан анхаараарай.',
  structure: 'I/You/We/They + base verb · He/She/It + verb-s',
  structureParts: [
    { text: 'I/You/We/They', part: 'subject' },
    { text: 'base verb', part: 'verb' },
    { text: '·', part: 'plain' },
    { text: 'He/She/It', part: 'subject' },
    { text: 'verb-s', part: 'verb' },
  ],
  tip: 'He / She / It → үйл үг -s/-es авна. Харин do/does, don\'t/doesn\'t орвол -s тэдэн рүү «нүүдэг» — үндсэн үйл үг үндсэн хэлбэрээ хадгална.',
  examples: [
    { en: '[I](s) [go](v) [to school](m) [every day](m).', mn: 'Би өдөр бүр сургуульдаа явдаг.' },
    { en: '[She](s) [plays](v) [volleyball](o).', mn: 'Тэр волейбол тоглодог.' },
    { en: '[Water](s) [boils](v) [at 100°C](m).', mn: 'Ус 100 хэмд буцалдаг.' },
    { en: '[My dad](s) [drinks](v) [coffee](o).', mn: 'Аав маань кофе уудаг.' },
  ],
  useCases: [
    {
      title: 'Зуршил, өдөр тутмын үйлдэл',
      description: 'Тогтмол эсвэл тодорхой давтамжтай хийдэг зүйлээ хэлнэ. Өглөө босох, сургуульдаа явах, амралтын өдөр тоглох — бүгд зуршил.',
      examples: [
        { en: '[I](s) [get up](v) [at 7](m).', mn: 'Би 7 цагт босдог.' },
        { en: '[She](s) [walks](v) [to school](m).', mn: 'Тэр сургуульдаа алхаж явдаг.' },
        {
          en: '[We](s) [play](v) [football](o) [on Sundays](m).',
          mn: 'Бид ням гарагт хөлбөмбөг тоглодог.',
        },
      ],
    },
    {
      title: 'Ерөнхий үнэн, баримт',
      description: 'Үргэлж эсвэл тогтвортой үнэн байдаг зүйл: байгалийн хууль, шинжлэх ухааны баримт, амьтдын зан төлөв.',
      examples: [
        { en: '[The sun](s) [rises](v) [in the east](m).', mn: 'Нар зүүн зүгээс мандадаг.' },
        { en: '[Water](s) [freezes](v) [at 0°C](m).', mn: 'Ус 0 хэмд хөлддөг.' },
        { en: '[Cats](s) [like](v) [warm places](o).', mn: 'Муур дулаан газарт дуртай.' },
      ],
    },
    {
      title: 'Байнгын, урт хугацааны нөхцөл',
      description: 'Түр зуурын биш, одоогийн амьдралын тогтвортой байдлыг хэлнэ: хаана амьдардаг, хаана ажилладаг, юу сурдаг.',
      examples: [
        { en: '[I](s) [live](v) [in Ulaanbaatar](m).', mn: 'Би Улаанбаатарт амьдардаг.' },
        { en: '[My father](s) [works](v) [at a bank](m).', mn: 'Аав маань банкинд ажилладаг.' },
        { en: '[She](s) [studies](v) [English](o).', mn: 'Тэр англи хэл сурдаг.' },
      ],
    },
    {
      title: 'Дуртай, дургүй, бодол, мэдрэмж',
      description: 'like, love, hate, want, know, understand, believe зэрэг төлөв заасан үйл үг (state verb) бараг үргэлж энэ цагт байна. Эдгээрийг -ing хэлбэрээр хэлдэггүй.',
      examples: [
        { en: '[I](s) [like](v) [pizza](o).', mn: 'Би пиццанд дуртай.' },
        { en: '[She](s) [knows](v) [the answer](o).', mn: 'Тэр хариултыг мэднэ.' },
        { en: '[They](s) [want](v) [a new car](o).', mn: 'Тэд шинэ машин авмаар байна.' },
      ],
    },
    {
      title: 'Хуваарь, цагийн хүснэгт',
      description: 'Ирээдүйд болох ч албан ёсны хуваарьт тогтсон зүйлд Present Simple хэрэглэнэ: автобус, хичээл, кино, галт тэрэгний цаг.',
      examples: [
        { en: '[The bus](s) [leaves](v) [at 8](m).', mn: 'Автобус 8 цагт хөдөлдөг.' },
        { en: '[School](s) [starts](v) [on Monday](m).', mn: 'Хичээл даваа гарагт эхэлнэ.' },
        { en: '[The movie](s) [begins](v) [at 7:30](m).', mn: 'Кино 7:30-д эхэлнэ.' },
        { en: '[The class](s) [starts](v) [at 9](m).', mn: 'Хичээл 9 цагт эхэлдэг.' },
      ],
    },
    {
      title: 'Давтамжийн дайвар үгтэй',
      description: 'always, usually, often, sometimes, rarely, never зэрэг давтамжийн дайвар үг зуршил хэр олон давтагдахыг заана. Үндсэн үйл үгийн өмнө байрлана.',
      examples: [
        {
          en: '[I](s) [usually](m) [walk](v) [to school](m).',
          mn: 'Би ихэвчлэн сургуульдаа алхаж явдаг.',
        },
        { en: '[She](s) [often](m) [reads](v) [at night](m).', mn: 'Тэр шөнө байнга ном уншдаг.' },
        { en: '[He](s) [never](m) [drinks](v) [coffee](o).', mn: 'Тэр кофе хэзээ ч уудаггүй.' },
      ],
    },
  ],
  forms: [
    {
      structure: 'I/You/We/They + verb · He/She/It + verb-s/-es',
      examples: [
        { en: '[I](s) [play](v) [tennis](o).', mn: 'Би теннис тоглодог.' },
        { en: '[She](s) [plays](v) [tennis](o).', mn: 'Тэр теннис тоглодог.' },
        { en: '[He](s) [watches](v) [TV](o).', mn: 'Тэр зурагт үздэг.' },
      ],
      label: 'Батлах',
    },
    {
      structure: 'Subject + don\'t/doesn\'t + base verb',
      examples: [
        { en: '[I](s) [don\'t eat](v) [meat](o).', mn: 'Би мах иддэггүй.' },
        { en: '[She](s) [doesn\'t drive](v).', mn: 'Тэр машин жолооддоггүй.' },
        { en: '[He](s) [doesn\'t watch](v) [TV](o).', mn: 'Тэр зурагт үздэггүй.' },
      ],
      label: 'Үгүйсгэх',
    },
    {
      structure: 'Do/Does + subject + base verb?',
      examples: [
        { en: '[Do](v) [you](s) [work](v) [here](m)?', mn: 'Та энд ажилладаг уу?' },
        { en: '[Does](v) [she](s) [live](v) [nearby](m)?', mn: 'Тэр ойрхон амьдардаг уу?' },
        { en: '[Do](v) [they](s) [know](v) [him](o)?', mn: 'Тэд түүнийг мэдэх үү?' },
      ],
      label: 'Асуух (Yes/No)',
    },
    {
      structure: 'Question word + do/does + subject + base verb?',
      examples: [
        { en: '[Where](m) [do](v) [you](s) [live](v)?', mn: 'Та хаана амьдардаг вэ?' },
        { en: '[What](m) [does](v) [he](s) [eat](v)?', mn: 'Тэр юу иддэг вэ?' },
        { en: '[When](m) [do](v) [they](s) [start](v)?', mn: 'Тэд хэзээ эхэлдэг вэ?' },
      ],
      label: 'Асуух (асуух үгтэй)',
    },
    {
      structure: 'Yes, I/you/we/they do. · Yes, he/she/it does. · No, … don\'t / doesn\'t.',
      examples: [
        { en: '[Yes](o), [I](s) [do](v).', mn: 'Тийм ээ, (ажилладаг).' },
        { en: '[No](o), [she](s) [doesn\'t](v).', mn: 'Үгүй, (амьдардаггүй).' },
        { en: '[Yes](o), [they](s) [do](v).', mn: 'Тийм ээ, (мэднэ).' },
      ],
      label: 'Богино хариулт',
    },
  ],
  signalWords: ['every day', 'usually', 'often', 'sometimes', 'always', 'never', 'on Mondays', 'once a week'],
  notes: [
    'He/She/It дээр ихэнх үйл үг зүгээр -s авна: work → works, play → plays, live → lives.',
    '-s, -sh, -ch, -x, -o төгсгөлтэй үйл үг ихэвчлэн -es авна: watch → watches, go → goes, wash → washes, fix → fixes.',
    'Гийгүүлэгч + y төгсгөлтэй бол y → ies: study → studies, try → tries. Харин эгшиг + y бол зүгээр -s: play → plays.',
    'have үйл үг онцгой: he/she/it дээр haves биш, has болно. «She has a dog.»',
    'Давтамжийн дайвар үг үндсэн үйл үгийн ӨМНӨ: «She usually walks.» Харин be-ийн ДАРАА: «She is usually early.»',
    'Present Simple яг одоо болж буй зүйлийг хэлдэггүй. «Одоо … хийж байна» гэвэл одоо үргэлжлэх цаг (Present Continuous) хэрэглэнэ.',
  ],
  commonMistakes: [
    {
      wrong: 'He play football.',
      correct: 'He plays football.',
      explanation: 'Батлах өгүүлбэрт he/she/it-ийн үйл үг заавал -s/-es авна. -s-гүй play нь зөвхөн I/You/We/They-тэй явна.',
    },
    {
      wrong: 'She doesn\'t likes coffee.',
      correct: 'She doesn\'t like coffee.',
      explanation: 'doesn\'t аль хэдийн гуравдугаар биеийг заасан. -s нэг өгүүлбэрт хоёр удаа орохгүй, тиймээс үндсэн үйл үг үндсэн хэлбэрээрээ үлдэнэ.',
    },
    {
      wrong: 'Do she live here?',
      correct: 'Does she live here?',
      explanation: 'She-тэй асуултад туслах үйл үг does байна. Do нь I/You/We/They-д л таарна.',
    },
    {
      wrong: 'I am go to school every day.',
      correct: 'I go to school every day.',
      explanation: 'Зуршил хэлэхэд be (am/is/are) хэрэггүй. Үйл үгээ шууд эзний дараа тавина: I go, she goes.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор үйл үг эзнээр өөрчлөгддөггүй: «Би явдаг», «Тэр явдаг» — хоёулаа явдаг. Англиар I go, харин she goes. Тэр ганцхан -s монгол хүнд огт «сонсогддоггүй» учраас хамгийн их мартагддаг.',
      'Монгол хэлний «-даг/-дэг/-дог/-дөг» бол Present Simple-ийн шууд дүйцэл: явдаг = go/goes, иддэг = eat/eats. Харин «-ж байна» бол өөр цаг. Өгүүлбэрээ монголоор «-даг» гэж хэлж байвал Present Simple сонгоорой.',
      'Монголоор асуулт өгүүлбэрийн СҮҮЛД «уу/үү, вэ» нэмнэ, үгүйсгэлийг үйл үгэнд «-даггүй» залгана. Англиар харин ЭХЭНД тусдаа үг do/does, үйл үгийн өмнө don\'t/doesn\'t орно. Энэ туслах үйл үг монголд байхгүй.',
      'Монголоор үйл үг өгүүлбэрийн сүүлд: «Би банкинд ажилладаг». Англиар үйл үг эзний шууд дараа, цаг газар нь сүүлд: «I work at a bank.» Үгийн дарааллыг эргүүлж бичихээс болгоомжлоорой.',
    ],
  },
  dialogue: [
    {
      en: '[What time](m) [do](v) [you](s) [get up](v)?',
      mn: 'Чи хэдэн цагт босдог вэ?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [usually](m) [get up](v) [at 7](m). [My brother](s) [gets up](v) [at 6](m).',
      mn: 'Би ихэвчлэн 7 цагт босдог. Ах маань 6 цагт босдог.',
      speaker: 'Saraa',
    },
    { en: '[Does](v) [he](s) [work](v)?', mn: 'Тэр ажилладаг юм уу?', speaker: 'Bat' },
    {
      en: '[Yes](o), [he](s) [does](v). [He](s) [works](v) [at a bank](m).',
      mn: 'Тийм ээ. Тэр банкинд ажилладаг.',
      speaker: 'Saraa',
    },
    {
      en: '[Do](v) [you](s) [like](v) [your school](o)?',
      mn: 'Чи сургуульдаа дуртай юу?',
      speaker: 'Bat',
    },
    {
      en: '[Yes](o), [I](s) [love](v) [it](o). [I](s) [never](m) [miss](v) [a class](o).',
      mn: 'Тийм ээ, их дуртай. Би хичээл хэзээ ч таслдаггүй.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: '6-1',
      explanation: 'My brother = he. Every Sunday гэсэн зуршил тул Present Simple, he дээр үйл үг -s авна. playing-д be дутуу, played нь өнгөрсөн цаг.',
      ruleId: 6,
      kind: 'fill',
      question: 'My brother ___ football every Sunday.',
      options: ['play', 'plays', 'playing', 'played'],
      answer: 'plays',
      hint: 'My brother-ийг ямар төлөөний үгээр сольж болох вэ? Every Sunday юуг хэлж байна?',
    },
    {
      id: '6-2',
      explanation: 'She-тэй үгүйсгэлд doesn\'t, дараа нь үйл үг үндсэн хэлбэрээрээ. doesn\'t likes-д -s давхардсан, don\'t нь she-д таарахгүй, not like-д туслах үйл үг алга.',
      ruleId: 6,
      kind: 'fill',
      question: 'She ___ coffee in the evening.',
      options: ['doesn\'t like', 'doesn\'t likes', 'don\'t like', 'not like'],
      answer: 'doesn\'t like',
      hint: '-s нэг өгүүлбэрт хоёр удаа орохгүй.',
    },
    {
      id: '6-3',
      explanation: 'She-тэй асуултад does эхэнд, үйл үг үндсэн хэлбэрээрээ. Do she буруу, does + lives-д -s давхардсан, «She live here?»-д туслах үйл үг алга.',
      ruleId: 6,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['Does she live here?', 'Do she live here?', 'Does she lives here?', 'She live here?'],
      answer: 'Does she live here?',
      hint: 'Асуулт do/does-оор эхэлнэ. Аль нь she-д таарах вэ?',
    },
    {
      id: '6-4',
      explanation: '«-даг» = Present Simple. She дээр walks, usually нь үндсэн үйл үгийн өмнө. walk-д -s дутуу, walks usually байрлал буруу, walking-д be алга.',
      ruleId: 6,
      kind: 'translate',
      question: 'Тэр ихэвчлэн сургуульдаа алхаж явдаг.',
      options: [
        'She usually walks to school.',
        'She usually walk to school.',
        'She walks usually to school.',
        'She usually walking to school.',
      ],
      answer: 'She usually walks to school.',
      hint: 'Давтамжийн дайвар үг хаана байрладаг вэ? She дээр үйл үг юу авдаг вэ?',
    },
  ],
};
