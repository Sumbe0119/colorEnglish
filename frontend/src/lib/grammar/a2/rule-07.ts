// frontend/src/lib/grammar/a2/rule-07.ts
// A2 дүрэм 7: have to / don't have to / must / mustn't
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule07: GrammarRule = {
  id: 7,
  title: 'have to / don\'t have to / must / mustn\'t',
  titleMn: 'have to / must / mustn\'t — заавал ёстой, хэрэггүй, хориотой',
  hook: '«Заавал ёстой», «хэрэггүй», «хориотой» — гурван өөр утга, гэвч don\'t have to ба mustn\'t хоёрыг андуурвал «хийх хэрэггүй» гэснийг «хийж болохгүй» гэж ойлгоно!',
  summary: 'have to нь дүрэм, хууль, ажил гэх мэт гаднаас ирсэн үүрэг, must нь өөрийн хүчтэй үүрэг, зайлшгүй хэрэгцээ. don\'t have to = хийх шаардлагагүй (хийсэн ч болно), харин mustn\'t = хийж болохгүй, хориотой — энэ хоёрыг хэзээ ч бүү андуур.',
  description: 'have to ба must хоёулаа «заавал … ёстой» гэсэн үүрэг хэлнэ. have to нь дүрэм, хууль, сургууль, ажлын шаардлага гэх мэт гаднаас ирсэн үүрэг: «I have to wear a uniform at school». must нь ярьж байгаа хүн өөрөө чухал гэж үзэж байгаа, дотроос ирсэн хүчтэй үүрэг: «I must call my mother». Ярианд have to илүү түгээмэл, must нь албан бичиг, тэмдэглэгээ, хүчтэй зөвлөгөөнд их гардаг. Гэхдээ хамгийн чухал зүйл нь үгүйсгэлд байна: don\'t have to гэвэл «хийх шаардлагагүй, хүсвэл хийж болно» (You don\'t have to pay — үнэгүй), харин mustn\'t гэвэл «хийж болохгүй, хориотой» (You mustn\'t smoke here). Хоёр үгүйсгэл огт өөр утгатай тул монгол хүмүүс энд хамгийн их алдаа гаргадаг. Мөн must нь өнгөрсөн, ирээдүйн хэлбэргүй тул had to, will have to гэж have to-г хэрэглэнэ.',
  structure: 'Subject + have to / has to / must + base verb',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'have to / has to / must', part: 'verb' },
    { text: 'base verb', part: 'verb' },
  ],
  tip: 'don\'t have to = «хэрэггүй» (чөлөөтэй) · mustn\'t = «болохгүй» (хориотой). Санах арга: mustn\'t-д «STOP» тэмдэг, don\'t have to-д «хүсвэл» гэсэн үг зурж төсөөл.',
  examples: [
    { en: '[I](s) [have to get up](v) [at 6](m) [on weekdays](m).', mn: 'Би ажлын өдрүүдэд 6 цагт заавал босох ёстой.' },
    { en: '[You](s) [must see](v) [a doctor](o).', mn: 'Чи заавал эмчид үзүүлэх ёстой.' },
    { en: '[You](s) [don\'t have to pay](v). [It](s)[\'s](v) [free](o).', mn: 'Чи төлөх хэрэггүй. Үнэгүй.' },
    { en: '[You](s) [mustn\'t use](v) [your phone](o) [in the exam](m).', mn: 'Шалгалтын үеэр утас хэрэглэж болохгүй.' },
  ],
  useCases: [
    {
      title: 'Гаднаас ирсэн үүрэг — have to',
      description: 'Дүрэм, хууль, ажил, сургууль, эцэг эх гэх мэт бусдаас ирсэн шаардлагыг have to-гоор хэлнэ. Эзэн he/she/it бол has to. Өнгөрсөнд had to, ирээдүйд will have to.',
      examples: [
        { en: '[Students](s) [have to wear](v) [a uniform](o).', mn: 'Сурагчид дүрэмт хувцас заавал өмсөх ёстой.' },
        { en: '[She](s) [has to work](v) [on Saturdays](m).', mn: 'Тэр бямба гарагуудад заавал ажиллах ёстой.' },
        { en: '[We](s) [had to wait](v) [two hours](m) [at the airport](m).', mn: 'Бид нисэх буудал дээр хоёр цаг хүлээх ёстой болсон.' },
      ],
    },
    {
      title: 'Өөрийн хүчтэй үүрэг — must',
      description: 'Ярьж байгаа хүн өөрөө чухал, зайлшгүй гэж үзэж байгаа зүйлийг must-аар хэлнэ. Мөн хүчтэй зөвлөгөө өгөхөд хэрэглэнэ. must хувирахгүй: I must, she must, they must.',
      examples: [
        { en: '[I](s) [must finish](v) [this report](o) [today](m).', mn: 'Би энэ тайланг өнөөдөр заавал дуусгах ёстой.' },
        { en: '[You](s) [must try](v) [this soup](o). [It](s)[\'s](v) [delicious](o)!', mn: 'Чи энэ шөлийг заавал амсах ёстой. Маш амттай!' },
        { en: '[We](s) [must be](v) [quiet](o) [in the library](m).', mn: 'Бид номын санд заавал чимээгүй байх ёстой.' },
      ],
    },
    {
      title: 'Үүрэг байхгүй — don\'t have to',
      description: 'Ямар нэг зүйл хийх шаардлага байхгүйг хэлнэ. Хийсэн ч болно, хийгээгүй ч болно — сонголт нь өөрт чинь. Монголоор «… хэрэггүй», «… заавал биш» гэсэн утга. needn\'t гэж ч хэлж болно.',
      examples: [
        { en: '[You](s) [don\'t have to come](v) [early](m).', mn: 'Чи эрт ирэх хэрэггүй.' },
        { en: '[He](s) [doesn\'t have to cook](v). [His wife](s) [cooks](v).', mn: 'Тэр хоол хийх хэрэггүй. Эхнэр нь хоол хийдэг.' },
        { en: '[We](s) [don\'t have to go](v) [to school](m) [tomorrow](m). [It](s)[\'s](v) [a holiday](o).', mn: 'Бид маргааш сургуульд явах хэрэггүй. Амралтын өдөр.' },
      ],
    },
    {
      title: 'Хориглох — mustn\'t',
      description: 'Ямар нэг зүйл хийхийг хориглох, хийж болохгүйг хэлнэ. Дүрэм, аюулгүй байдал, ёс суртахууны хориг энд орно. Монголоор «… болохгүй», «… хориотой».',
      examples: [
        { en: '[You](s) [mustn\'t touch](v) [that](o). [It](s)[\'s](v) [hot](o).', mn: 'Түүнд хүрч болохгүй. Халуун байна.' },
        { en: '[Children](s) [mustn\'t play](v) [near the road](m).', mn: 'Хүүхдүүд замын ойролцоо тоглож болохгүй.' },
        { en: '[You](s) [mustn\'t tell](v) [anyone](o). [It](s)[\'s](v) [a secret](o).', mn: 'Чи хэнд ч хэлж болохгүй. Энэ нууц.' },
      ],
    },
    {
      title: 'Үүрэг асуух — Do you have to…?',
      description: 'Хэн нэгэн ямар нэг зүйл хийх ёстой эсэхийг асуухад Do/Does + эзэн + have to хэрэглэнэ. Must-аар асуулт бараг үүсгэдэггүй. Богино хариулт нь do/does-той.',
      examples: [
        { en: '[Do](v) [you](s) [have to work](v) [tomorrow](m)?', mn: 'Чи маргааш ажиллах ёстой юу?' },
        { en: '[Does](v) [she](s) [have to wear](v) [glasses](o)?', mn: 'Тэр нүдний шил зүүх ёстой юу?' },
        { en: '[What time](m) [do](v) [we](s) [have to leave](v)?', mn: 'Бид хэдэн цагт явах ёстой вэ?' },
      ],
    },
  ],
  forms: [
    {
      label: 'Батлах',
      structure: 'Subject + have to / has to + base verb · Subject + must + base verb',
      examples: [
        { en: '[I](s) [have to clean](v) [my room](o) [every Sunday](m).', mn: 'Би ням гараг бүр өрөөгөө заавал цэвэрлэх ёстой.' },
        { en: '[Bat](s) [has to take](v) [medicine](o) [twice a day](m).', mn: 'Бат өдөрт хоёр удаа заавал эм уух ёстой.' },
        { en: '[You](s) [must lock](v) [the door](o) [at night](m).', mn: 'Чи шөнө хаалгаа заавал түгжих ёстой.' },
      ],
    },
    {
      label: 'Үгүйсгэх',
      structure: 'Subject + don\'t / doesn\'t have to + base verb (хэрэггүй) · Subject + mustn\'t + base verb (болохгүй)',
      examples: [
        { en: '[You](s) [don\'t have to bring](v) [food](o). [We](s) [have](v) [everything](o).', mn: 'Чи хоол авчрах хэрэггүй. Бидэнд бүх юм байгаа.' },
        { en: '[She](s) [doesn\'t have to drive](v). [The office](s) [is](v) [near her home](m).', mn: 'Тэр машин барих хэрэггүй. Оффис нь гэрийнх нь ойролцоо.' },
        { en: '[You](s) [mustn\'t park](v) [here](m).', mn: 'Энд машин зогсоож болохгүй.' },
      ],
    },
    {
      label: 'Асуух',
      structure: 'Do / Does + subject + have to + base verb? · Did + subject + have to + base verb?',
      examples: [
        { en: '[Do](v) [I](s) [have to sign](v) [this form](o)?', mn: 'Би энэ маягтад гарын үсэг зурах ёстой юу?' },
        { en: '[Does](v) [he](s) [have to study](v) [tonight](m)?', mn: 'Тэр өнөө орой хичээлээ хийх ёстой юу?' },
        { en: '[Did](v) [you](s) [have to pay](v) [for the ticket](m)?', mn: 'Чи тасалбарын төлбөр төлөх ёстой болсон уу?' },
      ],
    },
    {
      label: 'Богино хариулт',
      structure: 'Yes, subject + do / does. · No, subject + don\'t / doesn\'t.',
      examples: [
        { en: '[Yes](o), [I](s) [do](v).', mn: 'Тийм ээ, ёстой.' },
        { en: '[No](o), [he](s) [doesn\'t](v).', mn: 'Үгүй, хэрэггүй.' },
        { en: '[Yes](o), [we](s) [did](v).', mn: 'Тийм ээ, ёстой болсон.' },
      ],
    },
  ],
  notes: [
    'have to нь энгийн үйл үг шиг хувирна: I/you/we/they have to, he/she/it has to. Асуулт, үгүйсгэлд do/does хэрэгтэй: Do you have to…? She doesn\'t have to…',
    'must нь баймж үйл үг: эзэн бүрд адилхан, -s авахгүй, to авахгүй, асуулт үгүйсгэлд do хэрэггүй. «She must goes», «She must to go» хоёулаа буруу — «She must go» зөв.',
    'must-д өнгөрсөн, ирээдүйн хэлбэр байхгүй. Өнгөрсөнд had to, ирээдүйд will have to: «I had to work yesterday», «You\'ll have to wait».',
    'don\'t have to ≠ mustn\'t. «You don\'t have to wear a tie» = зүүхгүй байж болно (чөлөөтэй). «You mustn\'t wear jeans» = өмсөж болохгүй (хориотой). Энэ ялгааг нэг л удаа сайн ойлговол дахиж андуурахгүй.',
    'Ярианд have to илүү түгээмэл, ялангуяа Америк англиар. must нь албан тэмдэглэгээ («Visitors must sign in»), хүчтэй зөвлөгөө («You must see this film!») болон mustn\'t хориглолтод их гардаг.',
    'have got to (\'ve got to, gotta) бол have to-гийн ярианы хувилбар: «I\'ve got to go». Бичгэнд have to хэрэглэ.',
  ],
  commonMistakes: [
    {
      wrong: 'You mustn\'t pay. It\'s free.',
      correct: 'You don\'t have to pay. It\'s free.',
      explanation: 'Үнэгүй гэдэг нь төлөх шаардлагагүй гэсэн үг — don\'t have to. mustn\'t гэвэл «төлөх хориотой» болно, утга нь тэс өөр. Монголоор «хэрэггүй» → don\'t have to, «болохгүй» → mustn\'t.',
    },
    {
      wrong: 'She must to study for the exam.',
      correct: 'She must study for the exam.',
      explanation: 'must баймж үйл үг тул араас нь to орохгүй, үйл үг үндсэн хэлбэрээрээ орно. to нь зөвхөн have to-д байдаг: has to study.',
    },
    {
      wrong: 'He have to go now.',
      correct: 'He has to go now.',
      explanation: 'have to энгийн үйл үг шиг хувирна: he/she/it-тэй has to. Монголоор эзнээр хувирдаггүй тул мартагддаг.',
    },
    {
      wrong: 'I must work late yesterday.',
      correct: 'I had to work late yesterday.',
      explanation: 'must-д өнгөрсөн цагийн хэлбэр байхгүй. Өнгөрсөн үүргийг had to-гоор хэлнэ. yesterday гэсэн үг байвал must хэрэглэж болохгүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «заавал … ёстой» гэж хэлэхэд гаднаас ирсэн үү, дотроос ирсэн үү гэж ялгадаггүй. Англиар have to (дүрэм, бусдын шаардлага) ба must (өөрийн хүчтэй үүрэг) гэж хоёр өөр үг сонгоно. Эргэлзвэл ярианд have to гэ.',
      'Монголоор «… хэрэггүй» (You don\'t have to) ба «… болохгүй / хориотой» (You mustn\'t) хоёр тодорхой ялгаатай. Гэвч англиар хоёулаа must / have to-гийн үгүйсгэл шиг харагддаг тул монгол хүмүүс «хэрэггүй» гэхдээ mustn\'t гэж андуурдаг. Монгол утгаа эхлээд тодруул: хэрэггүй үү, болохгүй юу?',
      'Монголоор «ёстой» гэдэг үг цагаар хувирдаггүй: «явах ёстой», «явах ёстой байсан». Англиар must-д өнгөрсөн цаг байхгүй тул «ёстой байсан» → had to, «ёстой болно» → will have to гэж have to-г хэрэглэнэ.',
      'Монголоор «ёстой» өгүүлбэрийн сүүлд ирдэг бол англиар have to / must эзэний яг араас, үндсэн үйл үгийн өмнө орно: «Би эрт босох ёстой» → I have to get up early. Үйл үг «нүцгэн» үндсэн хэлбэрээрээ орно гэдгийг санаарай.',
    ],
  },
  dialogue: [
    {
      en: '[Saraa](s), [do](v) [you](s) [have to work](v) [tomorrow](m)?',
      mn: 'Сараа, чи маргааш ажиллах ёстой юу?',
      speaker: 'Bat',
    },
    {
      en: '[No](o), [I](s) [don\'t](v). [It](s)[\'s](v) [Sunday](o). [But](m) [I](s) [have to visit](v) [my grandmother](o).',
      mn: 'Үгүй, хэрэггүй. Ням гараг. Гэхдээ би эмээ дээрээ заавал очих ёстой.',
      speaker: 'Saraa',
    },
    {
      en: '[I](s) [must finish](v) [my project](o). [The teacher](s) [wants](v) [it](o) [on Monday](m).',
      mn: 'Би төслөө заавал дуусгах ёстой. Багш даваа гарагт өгөөч гэсэн.',
      speaker: 'Bat',
    },
    {
      en: '[You](s) [don\'t have to do](v) [it](o) [alone](m). [I](s) [can help](v) [you](o) [in the evening](m).',
      mn: 'Чи ганцаараа хийх хэрэггүй. Би орой чамд тусалж чадна.',
      speaker: 'Saraa',
    },
    {
      en: '[Thanks](o)! [But](m) [we](s) [mustn\'t copy](v) [from the internet](m). [The teacher](s) [checks](v) [everything](o).',
      mn: 'Баярлалаа! Гэхдээ бид интернэтээс хуулж болохгүй. Багш бүгдийг шалгадаг.',
      speaker: 'Bat',
    },
    {
      en: '[Of course](m). [We](s) [had to write](v) [everything](o) [ourselves](m) [last time](m) [too](m).',
      mn: 'Мэдээж. Өнгөрсөн удаа ч бид бүгдийг өөрсдөө бичих ёстой болсон.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-7-1',
      ruleId: 7,
      kind: 'fill',
      question: 'The museum is free. You ___ buy a ticket.',
      options: ['mustn\'t', 'don\'t have to', 'have to', 'must'],
      answer: 'don\'t have to',
      explanation: 'Үнэгүй тул тасалбар авах шаардлагагүй → don\'t have to. mustn\'t гэвэл «тасалбар авах хориотой» гэсэн утга болно. have to / must гэвэл заавал авах ёстой болж утга эсрэгээрээ.',
      hint: '«Хэрэггүй» үү, «болохгүй» юу?',
    },
    {
      id: 'a2-7-2',
      ruleId: 7,
      kind: 'fill',
      question: 'Yesterday I ___ stay at home because I was ill.',
      options: ['must', 'have to', 'had to', 'has to'],
      answer: 'had to',
      explanation: 'Yesterday — өнгөрсөн цаг. must-д өнгөрсөн хэлбэр байхгүй тул had to. have to / has to одоо цаг тул yesterday-тэй таарахгүй.',
      hint: 'must-ийг өнгөрсөнд юугаар сольдог вэ?',
    },
    {
      id: 'a2-7-3',
      ruleId: 7,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ? (Утга: Энд тамхи татаж болохгүй.)',
      options: ['You don\'t have to smoke here.', 'You mustn\'t smoke here.', 'You must to not smoke here.', 'You haven\'t to smoke here.'],
      answer: 'You mustn\'t smoke here.',
      explanation: 'Хориглолт → mustn\'t. «don\'t have to smoke» гэвэл «татах хэрэггүй, гэхдээ болно» гэсэн утгатай. «must to not» — must-ийн араас to орохгүй. «haven\'t to» гэсэн хэлбэр байхгүй, don\'t have to гэнэ.',
      hint: 'Хориглолтын тэмдэг — ямар үг вэ?',
    },
    {
      id: 'a2-7-4',
      ruleId: 7,
      kind: 'translate',
      question: 'Тэр өдөр бүр эрт босох ёстой.',
      options: ['She must to get up early every day.', 'She have to get up early every day.', 'She has to get up early every day.', 'She has get up early every day.'],
      answer: 'She has to get up early every day.',
      explanation: 'She → has to + үндсэн үйл үг. «must to» — must-ийн араас to орохгүй. «She have to» — he/she/it-тэй has. «has get up» — to дутуу.',
      hint: 'he/she/it-тэй have to ямар хэлбэртэй вэ?',
    },
  ],
};
