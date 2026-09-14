// frontend/src/lib/grammar/a2/rule-06.ts
// A2 дүрэм 6: Present Continuous for the future
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule06: GrammarRule = {
  id: 6,
  title: 'Present Continuous for the future',
  titleMn: 'Одоо үргэлжлэх цаг ирээдүйд — цаг, газар нь тогтсон тохиролцоо',
  hook: '«Бид маргааш 6 цагт уулзаж байгаа» — өнөөдөр яриад байгаа юм биш, маргааш болно! Одоо цагаар ирээдүйг хэлдэг энэ сонин арга яаж ажилладаг вэ?',
  summary: 'Present Continuous-ийг хэн нэгэнтэй аль хэдийн тохирсон, цаг газар нь тогтсон ирээдүйн тохиролцоог хэлэхэд хэрэглэнэ. Заавал ирээдүйн цаг заасан үг эсвэл тодорхой нөхцөл байдал хамт байх ёстой: We are meeting tomorrow at 6.',
  description: 'A1-д Present Continuous-ийг «яг одоо болж байгаа үйлдэл» гэж сурсан. Гэвч энэ цаг бас нэг чухал үүрэгтэй: аль хэдийн тохиролцсон, хуваарьт орсон ирээдүйн үйлдлийг хэлнэ. «I\'m flying to Seoul on Friday» гэвэл тасалбар авсан, өдөр нь тодорхой, хүн бүр мэднэ гэсэн үг. Энэ хэлбэр be going to-той ойрхон, гэвч илүү «баттай», бусад хүнтэй хамт тохирсон, дэвтэрт бичсэн зүйл шиг сонсогдоно. will-тэй харин огт өөр: will бол яг одоо гаргаж буй шийдвэр, харин Present Continuous бол хэдийнэ бэлэн болсон тохиролцоо. Хамгийн чухал нь энэ хэлбэр ганцаараа ирээдүй заахгүй — tomorrow, tonight, on Saturday, at 7 гэсэн цагийн үг эсвэл ярианаас ойлгогдох нөхцөл заавал хэрэгтэй, эс бөгөөс сонсогч «яг одоо» гэж ойлгоно. Мөн цаг агаар гэх мэт хүний тохиролцоогүй зүйлд энэ хэлбэрийг хэрэглэдэггүй.',
  structure: 'Subject + am / is / are + verb-ing + future time',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'am / is / are', part: 'verb' },
    { text: 'verb-ing', part: 'verb' },
    { text: 'tomorrow / at 6 / on Saturday', part: 'modifier' },
  ],
  tip: 'Хуанли дээр бичсэн, хэн нэгэнтэй тохирсон уу? → am/is/are + -ing + цаг. Санах арга: «уулзаж байгаа» гэхэд хэнтэй, хэзээ гэдэг нь тодорхой байх ёстой.',
  examples: [
    { en: '[We](s) [are meeting](v) [tomorrow](m) [at 6](m).', mn: 'Бид маргааш 6 цагт уулзаж байгаа.' },
    { en: '[She](s) [is flying](v) [to Seoul](m) [on Friday](m).', mn: 'Тэр баасан гарагт Сөүл рүү нисэж байгаа.' },
    { en: '[I](s)[\'m having](v) [dinner](o) [with my parents](m) [tonight](m).', mn: 'Би өнөө орой аав ээжтэйгээ оройн хоол идэж байгаа.' },
    { en: '[What](o) [are](v) [you](s) [doing](v) [this weekend](m)?', mn: 'Чи энэ амралтын өдрүүдэд юу хийж байгаа вэ?' },
  ],
  useCases: [
    {
      title: 'Хэн нэгэнтэй тохирсон уулзалт',
      description: 'Хоёр ба түүнээс дээш хүн цаг, газраа тогтоод тохирсон уулзалтыг хэлнэ. Энэ бол Present Continuous-ийн ирээдүйн хамгийн түгээмэл хэрэглээ. Нөгөө тал нь мэднэ гэдэг нь чухал.',
      examples: [
        { en: '[I](s)[\'m seeing](v) [the dentist](o) [at 10](m) [tomorrow](m).', mn: 'Би маргааш 10 цагт шүдний эмчид үзүүлж байгаа.' },
        { en: '[We](s)[\'re playing](v) [football](o) [with Bat\'s team](m) [on Sunday](m).', mn: 'Бид ням гарагт Батын багтай хөлбөмбөг тоглож байгаа.' },
        { en: '[She](s)[\'s meeting](v) [her teacher](o) [after class](m).', mn: 'Тэр хичээлийн дараа багштайгаа уулзаж байгаа.' },
      ],
    },
    {
      title: 'Аялал, тээврийн хуваарь',
      description: 'Тасалбар авсан, буудал захиалсан аялалыг хэлэхэд хэрэглэнэ. go, leave, arrive, fly, travel гэсэн хөдөлгөөний үйл үгс энэ хэлбэрт хамгийн их ордог.',
      examples: [
        { en: '[They](s) [are leaving](v) [for Khuvsgul](m) [on Monday morning](m).', mn: 'Тэд даваа гарагийн өглөө Хөвсгөл рүү явж байгаа.' },
        { en: '[My cousin](s) [is arriving](v) [from Germany](m) [next week](m).', mn: 'Миний үеэл дараа долоо хоногт Германаас ирж байгаа.' },
        { en: '[I](s)[\'m taking](v) [the train](o) [to Sainshand](m) [tonight](m).', mn: 'Би өнөө шөнө Сайншанд руу галт тэргээр явж байгаа.' },
      ],
    },
    {
      title: 'Хуанли дээрх үйл явдал',
      description: 'Үдэшлэг, хурим, шалгалт, хурал гэх мэт өдөр нь тогтсон үйл явдлыг хэлнэ. Үйл явдал хүмүүсийн тохиролцоогоор болж байгаа тул Present Continuous тохирно.',
      examples: [
        { en: '[We](s)[\'re having](v) [a party](o) [on Saturday night](m).', mn: 'Бид бямба гарагийн орой үдэшлэг хийж байгаа.' },
        { en: '[My sister](s) [is getting married](v) [in August](m).', mn: 'Миний эгч наймдугаар сард хуримаа хийж байгаа.' },
        { en: '[The students](s) [are taking](v) [the exam](o) [next Tuesday](m).', mn: 'Оюутнууд дараагийн мягмар гарагт шалгалт өгч байгаа.' },
      ],
    },
    {
      title: 'Төлөвлөгөө асуух, урих',
      description: '«What are you doing tonight?» бол хэн нэгнийг урихын өмнө асуудаг хамгийн энгийн асуулт. Хариулт нь ч мөн энэ хэлбэрээр ирдэг. Төлөвлөгөө байхгүй бол «Nothing» гэж хариулж болно.',
      examples: [
        { en: '[What](o) [are](v) [you](s) [doing](v) [tonight](m)?', mn: 'Чи өнөө орой юу хийж байгаа вэ?' },
        { en: '[Are](v) [you](s) [doing](v) [anything](o) [on Friday](m)?', mn: 'Чи баасан гарагт ямар нэг зүйл хийж байгаа юу?' },
        { en: '[Who](o) [are](v) [you](s) [going](v) [with](m)?', mn: 'Чи хэнтэй явж байгаа вэ?' },
      ],
    },
  ],
  forms: [
    {
      label: 'Батлах',
      structure: 'Subject + am / is / are + verb-ing + future time',
      examples: [
        { en: '[I](s)[\'m working](v) [late](m) [tomorrow](m).', mn: 'Би маргааш оройтож ажиллаж байгаа.' },
        { en: '[He](s)[\'s starting](v) [his new job](o) [on Monday](m).', mn: 'Тэр даваа гарагт шинэ ажлаа эхэлж байгаа.' },
        { en: '[We](s)[\'re visiting](v) [the museum](o) [on Thursday](m).', mn: 'Бид пүрэв гарагт музей үзэж байгаа.' },
      ],
    },
    {
      label: 'Үгүйсгэх',
      structure: 'Subject + am not / isn\'t / aren\'t + verb-ing + future time',
      examples: [
        { en: '[I](s)[\'m not coming](v) [to class](m) [tomorrow](m).', mn: 'Би маргааш хичээлд ирэхгүй байгаа.' },
        { en: '[She](s) [isn\'t working](v) [next week](m).', mn: 'Тэр дараа долоо хоногт ажиллахгүй байгаа.' },
        { en: '[They](s) [aren\'t staying](v) [at the hotel](m) [tonight](m).', mn: 'Тэд өнөө шөнө зочид буудалд буухгүй байгаа.' },
      ],
    },
    {
      label: 'Асуух',
      structure: 'Am / Is / Are + subject + verb-ing + future time? · Wh- + am / is / are + subject + verb-ing?',
      examples: [
        { en: '[Are](v) [you](s) [going](v) [to the concert](m) [on Saturday](m)?', mn: 'Чи бямба гарагт концертод явж байгаа юу?' },
        { en: '[Is](v) [Saraa](s) [coming](v) [to the meeting](m) [at 3](m)?', mn: 'Сараа 3 цагийн хуралд ирж байгаа юу?' },
        { en: '[When](m) [are](v) [they](s) [moving](v) [to the new flat](m)?', mn: 'Тэд хэзээ шинэ байрандаа нүүж байгаа вэ?' },
      ],
    },
    {
      label: 'Богино хариулт',
      structure: 'Yes, subject + am / is / are. · No, subject + \'m not / isn\'t / aren\'t.',
      examples: [
        { en: '[Yes](o), [I](s) [am](v).', mn: 'Тийм ээ, явж байгаа.' },
        { en: '[No](o), [she](s) [isn\'t](v).', mn: 'Үгүй, тэр ирэхгүй.' },
        { en: '[Yes](o), [they](s) [are](v).', mn: 'Тийм ээ, тэгж байгаа.' },
      ],
    },
  ],
  signalWords: ['tomorrow', 'tonight', 'on Saturday', 'next week', 'at 7', 'this weekend', 'after class', 'in August'],
  notes: [
    'Ирээдүйн утгатай Present Continuous-д цагийн үг заавал хэрэгтэй: «I\'m meeting Bat» гэвэл яг одоо, «I\'m meeting Bat at 5» гэвэл ирээдүй. Цаг нь ярианаас ойлгогдож байвал орхиж болно: «What are you doing tonight? — I\'m studying.»',
    'Хамгийн их хэрэглэдэг үйл үгс: meet, see, go, come, leave, arrive, fly, have (dinner/lunch/a party), start, play, take, get married. Ихэвчлэн хүний тохиролцоо хэрэгтэй үйлдлүүд.',
    'Цаг агаар, байгалийн үзэгдэлд энэ хэлбэрийг хэрэглэдэггүй: «It\'s raining tomorrow» буруу. Хүн бороотой тохиролцож чадахгүй тул «It\'s going to rain tomorrow» эсвэл «It will rain tomorrow» гэнэ.',
    'be going to-той бараг ижил утгатай: «We\'re having a party» ≈ «We\'re going to have a party». Ялгаа нь: Present Continuous илүү тогтсон, бусадтай тохирсон; be going to бол өөрийн санаа зорилго. Ярианд хоёуланг нь солиод хэрэглэж болно.',
    'will-тэй солиж болохгүй: «I\'ll meet Bat at 6» бол яг одоо гаргасан шийдвэр, харин «I\'m meeting Bat at 6» бол өмнө нь тохирчихсон.',
    'Хуваарь тогтмол (галт тэрэг, кино, хичээл) бол Present Simple ч болно: «The train leaves at 9». Гэвч өөрийн явах тухай бол Present Continuous: «I\'m leaving at 9».',
  ],
  commonMistakes: [
    {
      wrong: 'It is raining tomorrow.',
      correct: 'It is going to rain tomorrow.',
      explanation: 'Present Continuous-ийн ирээдүй зөвхөн хүний тохиролцоонд хэрэглэнэ. Бороо хэнтэй ч тохирдоггүй тул таамаглалын be going to эсвэл will хэрэглэнэ.',
    },
    {
      wrong: 'I meeting my friend tomorrow.',
      correct: 'I am meeting my friend tomorrow.',
      explanation: 'am/is/are орхигдсон. Монголоор «Би маргааш найзтайгаа уулзаж байгаа» гэхэд be байдаггүй тул мартагддаг. -ing-тэй хамт be заавал орно.',
    },
    {
      wrong: 'We are meet at the café at 7.',
      correct: 'We are meeting at the café at 7.',
      explanation: 'be-ийн араас үйл үг -ing авна. «are meet» гэсэн хослол байхгүй. be болон -ing үргэлж хамт: are meeting.',
    },
    {
      wrong: 'What do you do tonight?',
      correct: 'What are you doing tonight?',
      explanation: 'Present Simple (do you do) бол зуршил: «Чи ямар ажил хийдэг вэ?» гэсэн утгатай. Өнөө оройн төлөвлөгөө асуухад Present Continuous хэрэглэнэ.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор ч гэсэн «Би маргааш эмчид үзүүлж байгаа», «Бид бямба гарагт уулзаж байгаа» гэж «-ж байгаа» хэлбэрээр ирээдүйн тохиролцоог хэлдэг. Тиймээс энэ хэрэглээ монгол хүнд харьцангуй ойлгомжтой — гол нь am/is/are-аа орхихгүй байх.',
      'Монголоор «-ж байгаа» гэхэд ирээдүй, одоо хоёрыг зөвхөн цагийн үгээр ялгадаг: «одоо уншиж байгаа» / «маргааш уулзаж байгаа». Англиар ч яг адил: цагийн үг байхгүй бол сонсогч одоо гэж ойлгоно.',
      'Монголоор «Бид маргааш уулзана» гэсэн «-на» хэлбэр ч тохирно, гэвч «уулзаж байгаа» гэвэл илүү баттай, тохирчихсон гэсэн өнгө аястай. Англиар яг энэ ялгаа will (уулзана) ба Present Continuous (уулзаж байгаа) хооронд байна.',
      'Монголоор цаг агаарын тухай «Маргааш бороо орж байгаа» гэж хэлдэггүй, «орно» эсвэл «орох нь» гэдэг. Англиар ч мөн адил: It\'s raining tomorrow буруу, It\'s going to rain / It will rain зөв. Хоёр хэлний логик энд давхцаж байна.',
    ],
  },
  dialogue: [
    {
      en: '[Bat](s), [what](o) [are](v) [you](s) [doing](v) [on Saturday](m)?',
      mn: 'Бат, чи бямба гарагт юу хийж байгаа вэ?',
      speaker: 'Saraa',
    },
    {
      en: '[In the morning](m) [I](s)[\'m helping](v) [my dad](o) [at the garage](m). [Why](m)?',
      mn: 'Өглөө нь би аавдаа гаражид тусалж байгаа. Яагаад?',
      speaker: 'Bat',
    },
    {
      en: '[We](s)[\'re having](v) [a picnic](o) [at Terelj](m) [at 2](m). [Everyone](s) [is coming](v).',
      mn: 'Бид 2 цагт Тэрэлжид зугаалга хийж байгаа. Бүгд ирж байгаа.',
      speaker: 'Saraa',
    },
    {
      en: '[Sounds great](o)! [Who](s) [is driving](v)?',
      mn: 'Гоё сонсогдож байна! Хэн машин барьж байгаа вэ?',
      speaker: 'Bat',
    },
    {
      en: '[Dorj](s) [is taking](v) [his car](o). [We](s)[\'re leaving](v) [from the school](m) [at 1](m).',
      mn: 'Дорж машинаа авч явж байгаа. Бид 1 цагт сургуулиас хөдөлж байгаа.',
      speaker: 'Saraa',
    },
    {
      en: '[OK](m), [I](s)[\'m coming](v). [I](s)[\'ll bring](v) [some food](o).',
      mn: 'За, би явж байгаа. Би хоол авчиръя.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'a2-6-1',
      ruleId: 6,
      kind: 'fill',
      question: 'I ___ my grandmother on Sunday. We talked on the phone yesterday and chose the day.',
      options: ['am visiting', 'visit', 'visiting', 'will visiting'],
      answer: 'am visiting',
      explanation: 'Өдөр нь тогтсон, эмээтэйгээ тохирчихсон → Present Continuous: am visiting. «visit» бол зуршил, «visiting» ганцаараа be-гүй тул буруу, «will visiting» гэсэн хэлбэр байхгүй.',
      hint: 'Хоёр хүн тохирчихсон, өдөр нь тодорхой.',
    },
    {
      id: 'a2-6-2',
      ruleId: 6,
      kind: 'fill',
      question: 'What ___ tonight? Do you want to watch a film?',
      options: ['are you doing', 'do you do', 'you are doing', 'are you do'],
      answer: 'are you doing',
      explanation: 'Өнөө оройн төлөвлөгөө асууж байна → What are you doing tonight? «do you do» зуршил асууна. «you are doing» асуултын дараалал биш. «are you do» — -ing дутуу.',
      hint: 'Урихын өмнө асуудаг хамгийн энгийн асуулт.',
    },
    {
      id: 'a2-6-3',
      ruleId: 6,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['It is snowing tomorrow.', 'It is going to snow tomorrow.', 'It snowing tomorrow.', 'It snows tomorrow.'],
      answer: 'It is going to snow tomorrow.',
      explanation: 'Цаг агаарт Present Continuous-ийн ирээдүйг хэрэглэдэггүй — цастай тохиролцох боломжгүй. Таамаглал тул be going to. «It snowing» be дутуу, «It snows tomorrow» зуршлын цаг тул утга таарахгүй.',
      hint: 'Цас хэнтэй ч тохиролцдоггүй.',
    },
    {
      id: 'a2-6-4',
      ruleId: 6,
      kind: 'translate',
      question: 'Бид маргааш 6 цагт уулзаж байгаа.',
      options: ['We meet tomorrow at 6.', 'We are meeting tomorrow at 6.', 'We meeting tomorrow at 6.', 'We are meet tomorrow at 6.'],
      answer: 'We are meeting tomorrow at 6.',
      explanation: 'Тогтсон уулзалт → are meeting. «We meet» бол зуршил. «We meeting» — are дутуу. «We are meet» — -ing дутуу. be болон -ing үргэлж хамт явна.',
      hint: '«-ж байгаа» = be + -ing.',
    },
  ],
};
