// frontend/src/lib/grammar/a1/rule-12.ts
// A1 дүрэм 12: Present Continuous
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule12: GrammarRule = {
  id: 12,
  title: 'Present Continuous',
  titleMn: 'Одоо үргэлжлэх цаг — яг одоо, энэ үед',
  hook: 'Яг одоо юу хийж байна? Энэ долоо хоногт юу болж байна? Хоёуланг нь нэг цагаар хэлнэ.',
  summary: 'Present Continuous (одоо үргэлжлэх цаг) нь яг одоо эсвэл энэ үед болж байгаа, түр зуурын, өөрчлөгдөж буй үйлдлийг хэлнэ. Томьёо: am/is/are + үйл үг-ing. Хоёулаа заавал хэрэгтэй.',
  description: 'Present Continuous буюу одоо үргэлжлэх цаг нь ярьж байх мөчид болж байгаа үйлдлийг хэлнэ: «I am reading» — би яг одоо уншиж байна. Мөн энэ үед түр үргэлжилж буй ажил, түр зуурын нөхцөл, аажмаар өөрчлөгдөж буй байдал, бүр урьдчилан тохирсон ойрын ирээдүйн төлөвлөгөөг ч илэрхийлнэ. Монголоор «-ж байна» гэж хэлдэг ихэнх зүйл энэ цагт таарна. Бүтэц нь хоёр хэсэгтэй: be (am/is/are) + үйл үг-ing. Аль нэгийг нь орхивол өгүүлбэр буруу болно. Present Simple-ээс ялгах арга энгийн: зуршил бол «-даг», яг одоо бол «-ж байна».',
  structure: 'Subject + am/is/are + verb-ing',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'am/is/are', part: 'verb' },
    { text: 'verb-ing', part: 'verb' },
  ],
  tip: 'be + verb-ing хоёулаа хэрэгтэй: «She is studying». «She studying» ч, «She is study» ч болохгүй — is ба -ing үргэлж хамт явна.',
  examples: [
    { en: '[I](s) [am reading](v) [now](m).', mn: 'Би одоо уншиж байна.' },
    {
      en: '[She](s) [is staying](v) [with her aunt](m) [this week](m).',
      mn: 'Тэр энэ долоо хоногт нагац эгчийнхээ гэрт байж байна.',
    },
    { en: '[We](s) [are meeting](v) [Tom](o) [tomorrow](m).', mn: 'Бид маргааш Томтой уулзана.' },
    { en: '[Look](v)! [The baby](s) [is sleeping](v).', mn: 'Хараач! Хүүхэд унтаж байна.' },
  ],
  useCases: [
    {
      title: 'Яг одоо болж буй үйлдэл',
      description: 'Ярьж байх энэ мөчид үргэлжилж байгаа үйлдэл. Хамгийн үндсэн хэрэглээ — цонхоор харахад юу харагдаж байна, тэр.',
      examples: [
        { en: '[I](s) [am reading](v).', mn: 'Би уншиж байна.' },
        { en: '[She](s) [is cooking](v).', mn: 'Тэр хоол хийж байна.' },
        { en: '[They](s) [are playing](v) [outside](m).', mn: 'Тэд гадаа тоглож байна.' },
      ],
    },
    {
      title: 'Энэ үед үргэлжилж буй зүйл',
      description: 'Яг энэ секундэд хийгээгүй ч энэ үеэр түр үргэлжилж байгаа ажил, хичээл. Ном уншиж дуусаагүй байхад «I am reading a long book» гэж хэлнэ.',
      examples: [
        {
          en: '[I](s) [am learning](v) [German](o) [this year](m).',
          mn: 'Би энэ жил герман хэл сурч байна.',
        },
        {
          en: '[He](s) [is working](v) [on a new project](m).',
          mn: 'Тэр шинэ төсөл дээр ажиллаж байна.',
        },
        { en: '[She](s) [is reading](v) [a long book](o).', mn: 'Тэр урт ном уншиж байна.' },
      ],
    },
    {
      title: 'Түр зуурын нөхцөл',
      description: 'Байнгын биш, тодорхой хугацаанд л үргэлжлэх байдал. Байнга бол «He lives with his uncle», түр бол «He is living with his uncle for now».',
      examples: [
        {
          en: '[We](s) [are staying](v) [at a hotel](m) [this week](m).',
          mn: 'Бид энэ долоо хоногт зочид буудалд байж байна.',
        },
        {
          en: '[He](s) [is living](v) [with his uncle](m) [for now](m).',
          mn: 'Тэр одоохондоо авга ахтайгаа хамт амьдарч байна.',
        },
      ],
    },
    {
      title: 'Өөрчлөгдөж буй байдал',
      description: 'Аажмаар өөрчлөгдөж, хөгжиж буй үйл явц. Цаг агаар, үнэ, чадвар — өдрөөс өдөрт өөр болж байгаа зүйлс.',
      examples: [
        { en: '[The weather](s) [is getting](v) [colder](o).', mn: 'Цаг агаар хүйтэрч байна.' },
        { en: '[Prices](s) [are rising](v).', mn: 'Үнэ өсөж байна.' },
        { en: '[Your English](s) [is improving](v).', mn: 'Чиний англи хэл сайжирч байна.' },
      ],
    },
    {
      title: 'Урьдчилан тохирсон ойрын ирээдүй',
      description: 'Тодорхой хүн, цагтай аль хэдийн тохирчихсон төлөвлөгөө. Хэзээ гэдгийг заасан үг (tomorrow, on Friday, at 3) ихэвчлэн хамт байна.',
      examples: [
        { en: '[I](s) [am meeting](v) [Sara](o) [tomorrow](m).', mn: 'Би маргааш Саратай уулзана.' },
        { en: '[We](s) [are flying](v) [on Friday](m).', mn: 'Бид баасан гарагт нисэж явна.' },
        {
          en: '[He](s) [is seeing](v) [the dentist](o) [at 3](m).',
          mn: 'Тэр 3 цагт шүдний эмчид үзүүлнэ.',
        },
      ],
    },
  ],
  forms: [
    {
      structure: 'Subject + am/is/are + verb-ing',
      examples: [
        { en: '[I](s) [am working](v).', mn: 'Би ажиллаж байна.' },
        { en: '[She](s) [is studying](v).', mn: 'Тэр хичээлээ хийж байна.' },
        { en: '[They](s) [are waiting](v).', mn: 'Тэд хүлээж байна.' },
      ],
      label: 'Батлах',
    },
    {
      structure: 'Subject + am not / isn\'t / aren\'t + verb-ing',
      examples: [
        { en: '[I](s)[\'m](v) [not working](v).', mn: 'Би ажиллахгүй байна.' },
        { en: '[He](s) [isn\'t sleeping](v).', mn: 'Тэр унтаагүй байна.' },
        { en: '[They](s) [aren\'t coming](v).', mn: 'Тэд ирэхгүй байна.' },
      ],
      label: 'Үгүйсгэх',
    },
    {
      structure: 'Am/Is/Are + subject + verb-ing?',
      examples: [
        { en: '[Are](v) [you](s) [working](v)?', mn: 'Чи ажиллаж байна уу?' },
        { en: '[Is](v) [she](s) [sleeping](v)?', mn: 'Тэр унтаж байна уу?' },
        { en: '[Are](v) [they](s) [coming](v)?', mn: 'Тэд ирж байна уу?' },
      ],
      label: 'Асуух',
    },
    {
      structure: 'Yes, subject + am/is/are · No, subject + \'m not / isn\'t / aren\'t',
      examples: [
        { en: '[Yes](o), [I](s) [am](v).', mn: 'Тийм ээ, байна.' },
        { en: '[No](o), [she](s) [isn\'t](v).', mn: 'Үгүй ээ, байхгүй.' },
        { en: '[Yes](o), [they](s) [are](v).', mn: 'Тийм ээ, байна.' },
      ],
      label: 'Богино хариулт',
    },
  ],
  signalWords: ['now', 'right now', 'at the moment', 'currently', 'today', 'this week', 'Look!', 'Listen!'],
  notes: [
    'Ихэнх үйл үгэнд шууд -ing залгана: work → working, read → reading, play → playing.',
    'e-ээр төгссөн үйл үг e-гээ хаяад -ing авна: make → making, write → writing, come → coming.',
    'Богино эгшиг + нэг гийгүүлэгчээр төгссөн богино үйл үг сүүлийн үсгээ давтана: run → running, sit → sitting, swim → swimming, get → getting.',
    'know, like, love, want, need, understand зэрэг төлөв заасан үйл үг ердийн утгаараа continuous-д ховор ордог: «I want tea» гэнэ, «I am wanting tea» гэхгүй.',
    'Ярианд товчилсон хэлбэр түгээмэл: I\'m working, She\'s studying, They\'re waiting. Үгүйсгэлд I\'m not, isn\'t, aren\'t.',
    'Ирээдүйн төлөвлөгөө хэлэхдээ tomorrow, on Friday, at 3 зэрэг цаг заасан үг хамт орно — тэгж байж «одоо» биш, «маргааш» гэдэг нь ойлгогдоно.',
  ],
  commonMistakes: [
    {
      wrong: 'She studying now.',
      correct: 'She is studying now.',
      explanation: 'Present Continuous-д am/is/are заавал хэрэгтэй. Монголоор «байна»-г орхидоггүйтэй адил англиар is-ийг орхиж болохгүй.',
    },
    {
      wrong: 'He is play football.',
      correct: 'He is playing football.',
      explanation: 'be-ийн дараа үйл үг заавал -ing авна. is ганцаараа хангалтгүй.',
    },
    {
      wrong: 'I am knowing the answer.',
      correct: 'I know the answer.',
      explanation: 'know бол төлөв заасан үйл үг. Монголоор «мэдэж байна» гэдэг ч англиар Present Simple: I know.',
    },
    {
      wrong: 'He is runing.',
      correct: 'He is running.',
      explanation: 'run шиг богино эгшиг + нэг гийгүүлэгчтэй үг сүүлийн үсгээ давтана: running, sitting, swimming.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «уншиж байна» гэхэд «байна» үйл үгийн АРД ирдэг. Англиар be (am/is/are) үйл үгийн ӨМНӨ, -ing нь АРД: «I am reading». «байна» = am/is/are, «-ж/-ч» = -ing гэж санавал амархан.',
      'Монголоор «Би мэдэж байна», «Би хүсэж байна» гэж «-ж байна»-гаар хэлдэг. Англиар know, want, like, need зэрэг төлөв заасан үйл үг -ing авахгүй: «I know», «I want». Энэ бол монгол хүний хамгийн түгээмэл алдаа.',
      'Монголоор эзнийг орхиж «Унтаж байна» гэж болно. Англиар эзэн ба be хоёулаа заавал: «She is sleeping». «Sleeping» ганцаараа өгүүлбэр биш.',
      'Монголоор ирээдүйн төлөвлөгөөг «-на»-гаар хэлнэ: «Маргааш Саратай уулзана». Англиар тохирчихсон уулзалтыг одоо үргэлжлэх цагаар хэлж болно: «I am meeting Sara tomorrow».',
    ],
  },
  dialogue: [
    {
      en: '[What](m) [are](v) [you](s) [doing](v) [now](m)?',
      mn: 'Чи одоо юу хийж байна?',
      speaker: 'Bat',
    },
    {
      en: '[I](s)[\'m](v) [cooking](v). [Mom](s) [is watching](v) [TV](o).',
      mn: 'Би хоол хийж байна. Ээж зурагт үзэж байна.',
      speaker: 'Saraa',
    },
    {
      en: '[Is](v) [Dorj](s) [helping](v) [you](o)?',
      mn: 'Дорж чамд тусалж байна уу?',
      speaker: 'Bat',
    },
    {
      en: '[No](o), [he](s) [isn\'t](v). [He](s) [is sleeping](v).',
      mn: 'Үгүй ээ. Тэр унтаж байна.',
      speaker: 'Saraa',
    },
    {
      en: '[Are](v) [you](s) [coming](v) [to the park](m) [tomorrow](m)?',
      mn: 'Чи маргааш цэцэрлэгт хүрээлэн рүү ирэх үү?',
      speaker: 'Bat',
    },
    {
      en: '[Yes](o), [I](s) [am](v). [We](s) [are meeting](v) [at 3](m).',
      mn: 'Тийм ээ, ирнэ. Бид 3 цагт уулзана шүү.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: '12-1',
      explanation: 'The baby = it → is. «Look!» бол дохио үг: яг одоо болж байгаа тул am/is/are + verb-ing. am зөвхөн I-тэй, are олон тоотой, does нь Present Simple-ийн туслах үйл үг.',
      ruleId: 12,
      kind: 'fill',
      question: 'Look! The baby ___ sleeping.',
      options: ['am', 'is', 'are', 'does'],
      answer: 'is',
      hint: 'The baby-г ямар төлөөний үгээр сольж болох вэ?',
    },
    {
      id: '12-2',
      explanation: '«at the moment» → одоо үргэлжлэх цаг. They-тэй are, дараа нь заавал -ing: are playing. «are play»-д -ing дутуу, «is playing»-д is буруу, «playing» ганцаараа be-гүй.',
      ruleId: 12,
      kind: 'fill',
      question: 'They ___ football at the moment.',
      options: ['are playing', 'are play', 'is playing', 'playing'],
      answer: 'are playing',
    },
    {
      id: '12-3',
      explanation: 'is + writing хоёулаа хэрэгтэй. «She writing»-д is алга, «is write»-д -ing алга. write e-гээ хаяад -ing авна: writing, writeing биш.',
      ruleId: 12,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'She is writing a letter now.',
        'She writing a letter now.',
        'She is write a letter now.',
        'She is writeing a letter now.',
      ],
      answer: 'She is writing a letter now.',
      hint: 'be болон -ing хоёулаа байна уу? Үсгийн дүрмийг шалгаарай.',
    },
    {
      id: '12-4',
      explanation: '«сурч байна» → am + learning. I-тэй зөвхөн am; «I learning»-д be алга, «am learn»-д -ing алга, «I is» буруу.',
      ruleId: 12,
      kind: 'translate',
      question: 'Би энэ жил герман хэл сурч байна.',
      options: [
        'I am learning German this year.',
        'I learning German this year.',
        'I am learn German this year.',
        'I is learning German this year.',
      ],
      answer: 'I am learning German this year.',
      hint: 'I-тэй ямар be хэрэглэдэг вэ? Үйл үг ямар төгсгөлтэй вэ?',
    },
  ],
};
