// frontend/src/lib/grammar/a1/rule-08.ts
// A1 дүрэм 8: Do / Does
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule08: GrammarRule = {
  id: 8,
  title: 'Do / Does',
  titleMn: 'Do / Does — асуулт үүсгэх туслах үйл үг',
  hook: '«Чи пицца иддэг үү?», «Тэр хөлбөмбөг тоглодог уу?» — англиар ийм асуулт Do эсвэл Does-оор эхэлнэ.',
  summary: 'Do болон Does бол энгийн одоо цагийн асуулт үүсгэх туслах үйл үг. I/you/we/they-тэй Do, he/she/it-тэй Does. Do/Does-ийн дараа үндсэн үйл үг ямар ч залгаваргүй, үндсэн хэлбэрээрээ орно.',
  description: 'Монголоор асуулт хэлэхэд өгүүлбэрийн төгсгөлд «уу/үү» нэмээд л болно. Англиар бол эсрэгээрээ: асуултыг өгүүлбэрийн эхэнд Do эсвэл Does гэсэн туслах үйл үгээр эхлүүлнэ. Энэ хоёр үг энгийн одоо цагийн үндсэн үйл үгтэй yes/no асуулт болон Where, What гэх мэт WH асуулт үүсгэнэ. I/you/we/they-тэй Do, he/she/it-тэй Does хэрэглэнэ. Хамгийн чухал нь: Does орсон үед -s залгавар үндсэн үйл үгээс салж Does руу «нүүдэг». Тиймээс «Does he play?» гэж хэлнэ, «Does he plays?» биш.',
  structure: 'Do / Does + subject + base verb?',
  structureParts: [
    { text: 'Do / Does', part: 'verb' },
    { text: 'subject', part: 'subject' },
    { text: 'base verb', part: 'verb' },
    { text: '?', part: 'plain' },
  ],
  tip: 'Does + he/she/it + үндсэн үйл үг: «Does he play?» — plays биш. -s нэг өгүүлбэрт нэг л удаа: Does дотор байгаа бол үйл үгэнд байхгүй.',
  examples: [
    { en: '[Do](v) [you](s) [like](v) [pizza](o)?', mn: 'Чи пиццанд дуртай юу?' },
    { en: '[Does](v) [he](s) [play](v) [football](o)?', mn: 'Тэр хөлбөмбөг тоглодог уу?' },
    { en: '[Do](v) [they](s) [study](v) [English](o)?', mn: 'Тэд англи хэл сурдаг уу?' },
    { en: '[Where](m) [does](v) [she](s) [work](v)?', mn: 'Тэр хаана ажилладаг вэ?' },
  ],
  useCases: [
    {
      title: 'Yes/No асуулт',
      description: 'Хариулт нь «тийм» эсвэл «үгүй» байх энгийн одоо цагийн асуулт. Do/Does-оор эхлээд эзэн, дараа нь үндсэн үйл үг тавина. Төгсгөлд нь юу ч нэмэхгүй.',
      examples: [
        { en: '[Do](v) [you](s) [work](v) [here](m)?', mn: 'Чи энд ажилладаг уу?' },
        { en: '[Does](v) [she](s) [drive](v)?', mn: 'Тэр машин барьдаг уу?' },
        { en: '[Do](v) [they](s) [live](v) [nearby](m)?', mn: 'Тэд ойрхон амьдардаг уу?' },
      ],
    },
    {
      title: 'WH асуулт',
      description: 'Where, What, When, Why, How гэсэн асуух үгийг хамгийн эхэнд тавьж, дараа нь do/does + эзэн + үндсэн үйл үг. Дэлгэрэнгүй мэдээлэл асуухад хэрэглэнэ.',
      examples: [
        { en: '[Where](m) [do](v) [you](s) [live](v)?', mn: 'Чи хаана амьдардаг вэ?' },
        { en: '[What](m) [does](v) [he](s) [do](v)?', mn: 'Тэр юу хийдэг вэ? (ямар ажилтай вэ)' },
        { en: '[When](m) [does](v) [the class](s) [start](v)?', mn: 'Хичээл хэзээ эхэлдэг вэ?' },
      ],
    },
    {
      title: 'Богино хариулт',
      description: 'Асуултад үндсэн үйл үгийг давтахгүй. Эзэн + do/does (тийм) эсвэл эзэн + don\'t/doesn\'t (үгүй) гэж хариулна. «Yes, I like» гэж хэлдэггүй.',
      examples: [
        {
          en: '[Do](v) [you](s) [like](v) [it](o)? — [Yes](o), [I](s) [do](v).',
          mn: 'Чи үүнд дуртай юу? — Тийм ээ, дуртай.',
        },
        {
          en: '[Does](v) [she](s) [work](v) [here](m)? — [No](o), [she](s) [doesn\'t](v).',
          mn: 'Тэр энд ажилладаг уу? — Үгүй, ажилладаггүй.',
        },
      ],
    },
    {
      title: 'Do нь өөрөө үндсэн үйл үг байж болно',
      description: 'do гэдэг үг бас «хийх» гэсэн утгатай үндсэн үйл үг. Тиймээс нэг өгүүлбэрт туслах do болон үндсэн do зэрэг орж болно. Эхнийх нь асуулт үүсгэнэ, хоёр дахь нь «хийх» гэсэн утга.',
      examples: [
        {
          en: '[Do](v) [you](s) [do](v) [your homework](o) [every day](m)?',
          mn: 'Чи өдөр бүр гэрийн даалгавраа хийдэг үү?',
        },
        {
          en: '[What](m) [does](v) [he](s) [do](v) [after school](m)?',
          mn: 'Тэр сургуулийн дараа юу хийдэг вэ?',
        },
      ],
    },
  ],
  forms: [
    {
      structure: 'Do + subject + base verb?',
      examples: [
        { en: '[Do](v) [you](s) [study](v) [English](o)?', mn: 'Чи англи хэл сурдаг уу?' },
        { en: '[Do](v) [they](s) [play](v) [basketball](o)?', mn: 'Тэд сагсан бөмбөг тоглодог уу?' },
      ],
      label: 'I / You / We / They',
    },
    {
      structure: 'Does + subject + base verb?',
      examples: [
        { en: '[Does](v) [she](s) [study](v) [English](o)?', mn: 'Тэр англи хэл сурдаг уу?' },
        { en: '[Does](v) [it](s) [work](v)?', mn: 'Энэ ажилладаг уу?' },
      ],
      label: 'He / She / It',
    },
    {
      structure: 'WH-word + do/does + subject + base verb?',
      examples: [
        { en: '[Where](m) [do](v) [you](s) [work](v)?', mn: 'Чи хаана ажилладаг вэ?' },
        { en: '[Why](m) [does](v) [he](s) [leave](v) [early](m)?', mn: 'Тэр яагаад эрт явдаг вэ?' },
      ],
      label: 'WH асуулт',
    },
    {
      structure: 'Yes, subject + do/does. · No, subject + don\'t/doesn\'t.',
      examples: [
        { en: '[Yes](o), [I](s) [do](v).', mn: 'Тийм ээ. (би тэгдэг)' },
        { en: '[Yes](o), [she](s) [does](v).', mn: 'Тийм ээ. (тэр тэгдэг)' },
        { en: '[No](o), [he](s) [doesn\'t](v).', mn: 'Үгүй. (тэр тэгдэггүй)' },
      ],
      label: 'Богино хариулт',
    },
  ],
  signalWords: ['every day', 'usually', 'often', 'How often'],
  notes: [
    'be үйл үгийн асуултад do/does хэрэглэхгүй. be өөрөө эзний урд гарна: «Is she happy?», «Are you ready?». «Do you are ready?» гэж хэзээ ч хэлэхгүй.',
    'can зэрэг баймж үйл үгтэй do/does хэрэглэхгүй: «Can you swim?». Баймж үйл үг өөрөө урд гарч асуулт үүсгэнэ.',
    'Does орсон үед үндсэн үйл үг -s авахгүй: «Does she like tea?», «Does she likes tea?» биш. -s нь Does дотор аль хэдийн байгаа.',
    'Who эзэн болж байгаа асуултад do/does хэрэггүй: «Who lives here?». Энд Who нь he/she шиг эзэн учраас үйл үг -s авна.',
    'Эзэн нь нэр үг бол ганц, олон тоог нь хараарай: «Does your father work?» (father = he), «Do your parents work?» (parents = they).',
    'Асуултын Do/Does болон үгүйсгэлийн don\'t/doesn\'t нэг хос: «Do you like tea?» — «I don\'t like tea», «Does she work?» — «She doesn\'t work».',
  ],
  commonMistakes: [
    {
      wrong: 'Does he plays football?',
      correct: 'Does he play football?',
      explanation: 'Does орсны дараа үйл үг үндсэн хэлбэрээрээ орно. -s нь Does дотор байгаа тул plays гэж давтахгүй.',
    },
    {
      wrong: 'Do she like tea?',
      correct: 'Does she like tea?',
      explanation: 'She бол гуравдугаар биеийн ганц тоо. He/she/it-тэй үргэлж Does хэрэглэнэ, Do биш.',
    },
    {
      wrong: 'Do you are ready?',
      correct: 'Are you ready?',
      explanation: 'be үйл үгийн (am/is/are) асуултад do хэрэглэхгүй. be өөрөө эзний урд гарна.',
    },
    {
      wrong: 'Where you live?',
      correct: 'Where do you live?',
      explanation: 'Монголоор асуух үг л хангалттай ч англиар do/does заавал хэрэгтэй. Асуух үгийн дараа do/does, дараа нь эзэн.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор асуултыг өгүүлбэрийн төгсгөлд «уу/үү», «вэ» нэмж үүсгэдэг: «Чи кофе уудаг уу?». Англиар харин эхэнд Do/Does тавьж асуулт болгоно. Төгсгөлд нь юу ч нэмэхгүй, зөвхөн «?» тэмдэг.',
      'Монгол хэлэнд туслах үйл үг байхгүй. Тиймээс do/does-ыг «илүү үг» гэж бодоод орхих алдаа түгээмэл: «Where you live?». Англиар do/does-гүй асуулт дутуу сонсогддог.',
      'Монгол үйл үг эзнээр өөрчлөгддөггүй: «би уудаг», «тэр уудаг». Англиар эзэн he/she/it бол Does гэсэн тусгай хэлбэр авна, харин үндсэн үйл үг -s-ээ гээнэ. Нэг өгүүлбэрт нэг л удаа -s.',
      'Монголоор «Тийм» / «Үгүй» гэхэд хангалттай. Англиар «Yes, I do» / «No, she doesn\'t» гэж эзэн + do/does-ыг давтдаг. Ганцхан «Yes» гэвэл хуурай, бүр ширүүн сонсогдож болно.',
    ],
  },
  dialogue: [
    {
      en: '[Do](v) [you](s) [drink](v) [coffee](o) [in the morning](m)?',
      mn: 'Чи өглөө кофе уудаг уу?',
      speaker: 'Bat',
    },
    {
      en: '[No](o), [I](s) [don\'t](v). [I](s) [drink](v) [tea](o).',
      mn: 'Үгүй, уудаггүй. Би цай уудаг.',
      speaker: 'Saraa',
    },
    {
      en: '[Does](v) [your sister](s) [drink](v) [coffee](o)?',
      mn: 'Эгч чинь кофе уудаг уу?',
      speaker: 'Bat',
    },
    {
      en: '[Yes](o), [she](s) [does](v). [She](s) [loves](v) [it](o).',
      mn: 'Тийм ээ, уудаг. Тэр кофенд их дуртай.',
      speaker: 'Saraa',
    },
    {
      en: '[Where](m) [does](v) [she](s) [buy](v) [it](o)?',
      mn: 'Тэр хаанаас авдаг вэ?',
      speaker: 'Bat',
    },
    {
      en: '[She](s) [buys](v) [it](o) [at the shop](m) [near our home](m).',
      mn: 'Манай гэрийн ойролцоох дэлгүүрээс авдаг.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: '8-1',
      explanation: 'Your father = he тул Does. Do нь I/you/we/they-тэй. Is/Are бол be үйл үг — «work» гэсэн үндсэн үйл үгтэй асуултад орохгүй.',
      ruleId: 8,
      kind: 'fill',
      question: '___ your father work here?',
      options: ['Do', 'Does', 'Is', 'Are'],
      answer: 'Does',
      hint: '«Your father» гэдгийг аль төлөөний үгээр сольж болох вэ?',
    },
    {
      id: '8-2',
      explanation: 'Does-ийн дараа үйл үг үндсэн хэлбэрээрээ орно. -s нь Does дотор байгаа тул speaks буруу; speaking, to speak энд огт орохгүй.',
      ruleId: 8,
      kind: 'fill',
      question: 'Does she ___ English?',
      options: ['speak', 'speaks', 'speaking', 'to speak'],
      answer: 'speak',
      hint: '-s нэг өгүүлбэрт хэдэн удаа байх вэ?',
    },
    {
      id: '8-3',
      explanation: 'He-тэй Does, дараа нь үндсэн үйл үг play. «plays» давхар -s, «Do he» буруу туслах үйл үг, «Is he play» — be-г үндсэн үйл үгтэй хольсон алдаа.',
      ruleId: 8,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Does he plays football?',
        'Do he play football?',
        'Does he play football?',
        'Is he play football?',
      ],
      answer: 'Does he play football?',
      hint: 'Эзэн нь he. Ямар туслах үйл үг, ямар үйл үгийн хэлбэр хэрэгтэй вэ?',
    },
    {
      id: '8-4',
      explanation: 'You-тэй Do, үйл үг work үндсэн хэлбэрээрээ. «Are you work» — be хэрэггүй; «Does you» — you-тэй Does орохгүй; «works» — Do-той -s хэрэггүй.',
      ruleId: 8,
      kind: 'translate',
      question: 'Чи энд ажилладаг уу?',
      options: ['Do you work here?', 'Are you work here?', 'Does you work here?', 'Do you works here?'],
      answer: 'Do you work here?',
      hint: '«Ажилладаг» бол энгийн одоо цагийн үндсэн үйл үг. Ямар туслах үйл үгээр асуух вэ?',
    },
  ],
};
