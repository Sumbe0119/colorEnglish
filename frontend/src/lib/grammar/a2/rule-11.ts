// frontend/src/lib/grammar/a2/rule-11.ts
// A2 дүрэм 11: First conditional
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule11: GrammarRule = {
  id: 11,
  title: 'First conditional',
  titleMn: 'Нэгдүгээр нөхцөл — ингэвэл ирээдүйд ингэнэ',
  hook: '«Яарахгүй бол автобусанд хоцорно», «Чи ирвэл би баярлана» — ирээдүйд бодитоор болж мэдэх зүйлийн нөхцөл, үр дүнг хэлэх өгүүлбэр.',
  summary: 'First conditional нь If + Present Simple, will + үндсэн үйл үг бүтэцтэй. Ирээдүйд бодитоор болж болох нөхцөл ба түүний үр дүнг хэлнэ: If it rains, I will stay at home. If-тэй хэсэгт will хэзээ ч орохгүй.',
  description: 'First conditional (нэгдүгээр нөхцөл) нь ирээдүйд болох магадлалтай, бодит нөхцөл ба түүний үр дүнг хэлнэ: If you study hard, you will pass the exam. Нөхцөл нь if-тэй хэсэгт Present Simple цагаар, үр дүн нь үндсэн өгүүлбэрт will + үндсэн үйл үгээр илэрхийлэгдэнэ. Хамгийн чухал дүрэм: if-тэй хэсэг ирээдүйн тухай ярьж байгаа ч will тэнд орохгүй — «If it will rain» гэж хэзээ ч хэлэхгүй. Zero conditional-оос ялгаа нь: тэг нөхцөл «үргэлж ингэдэг» гэсэн факт, харин нэгдүгээр нөхцөл «энэ удаа ингэвэл ингэнэ» гэсэн тодорхой нэг ирээдүйн боломж. Монголоор «…-вал/-бол … -на/-нэ» гэсэн төгсгөлтэй өгүүлбэрүүд яг энд таарна: «Бороо орвол би гэртээ сууна». Амлалт, анхааруулга, санал, айлган сүрдүүлэг, төлөвлөгөө хэлэхэд өдөр тутам маш их хэрэглэдэг бүтэц.',
  structure: 'If + Present Simple, will + base verb',
  structureParts: [
    { text: 'If + subject + verb (present)', part: 'modifier' },
    { text: ',', part: 'plain' },
    { text: 'subject', part: 'subject' },
    { text: 'will + base verb', part: 'verb' },
  ],
  tip: '«If»-ийн хажууд will хэзээ ч суухгүй — will зөвхөн нөгөө талд. Монголоор «-вал … -на»: «-вал» = if + одоо цаг, «-на» = will.',
  examples: [
    { en: '[If it rains tomorrow](m), [I](s) [will stay](v) [at home](m).', mn: 'Маргааш бороо орвол би гэртээ сууна.' },
    { en: '[If you don\'t hurry](m), [you](s)[\'ll miss](v) [the bus](o).', mn: 'Яарахгүй бол чи автобусанд хоцорно.' },
    { en: '[She](s) [will be](v) [happy](o) [if you call her](m).', mn: 'Чи түүн рүү залгавал тэр баярлана.' },
    { en: '[What](o) [will](v) [you](s) [do](v) [if you don\'t get the job](m)?', mn: 'Ажилд орж чадахгүй бол чи юу хийх вэ?' },
  ],
  useCases: [
    {
      title: 'Ирээдүйн бодит боломж, төлөвлөгөө',
      description: 'Ирээдүйд болж мэдэх зүйл ба түүний үр дагаврыг хэлнэ. Нөхцөл биелэх эсэх нь тодорхойгүй, харин бодитой. Монголоор «…-вал … -на».',
      examples: [
        { en: '[If the weather is nice](m), [we](s) [will go](v) [to the park](m).', mn: 'Цаг агаар сайхан байвал бид цэцэрлэгт хүрээлэн явна.' },
        { en: '[If I have time](m), [I](s) [will visit](v) [my grandmother](o).', mn: 'Цаг гарвал би эмээ дээрээ очно.' },
        { en: '[They](s) [will buy](v) [a car](o) [if they save enough money](m).', mn: 'Хангалттай мөнгө хуримтлуулбал тэд машин авна.' },
      ],
    },
    {
      title: 'Анхааруулга, амлалт',
      description: 'Хэн нэгэнд юу болохыг сануулах, эсвэл ямар нэг зүйл хийхээ амлахад хэрэглэнэ. Үгүйсгэлтэй нөхцөл (If you don\'t …) анхааруулгад их тохиолдоно.',
      examples: [
        { en: '[If you touch that](m), [you](s)[\'ll burn](v) [your hand](o).', mn: 'Түүнд хүрвэл гараа түлнэ.' },
        { en: '[If you help me today](m), [I](s)[\'ll help](v) [you](o) [tomorrow](m).', mn: 'Өнөөдөр надад туславал би маргааш чамд туслана.' },
        { en: '[If you don\'t study](m), [you](s) [won\'t pass](v) [the test](o).', mn: 'Хичээлээ хийхгүй бол чи шалгалтад тэнцэхгүй.' },
      ],
    },
    {
      title: 'unless = if … not',
      description: 'unless гэдэг нь «хэрвээ … -гүй бол» гэсэн утгатай. If you don\'t… гэхийг Unless you… гэж товчхон хэлж болно. unless-ийн ард үгүйсгэл давхар тавихгүй.',
      examples: [
        { en: '[Unless you leave now](m), [you](s)[\'ll be](v) [late](o).', mn: 'Одоо явахгүй бол чи хоцорно.' },
        { en: '[We](s) [won\'t go](v) [to the beach](m) [unless it is sunny](m).', mn: 'Нар гарахгүй бол бид далайн эрэг рүү явахгүй.' },
        { en: '[Unless he apologises](m), [I](s) [won\'t talk](v) [to him](m).', mn: 'Тэр уучлалт гуйхгүй бол би түүнтэй ярихгүй.' },
      ],
    },
    {
      title: 'when vs if — баттай ба магадлалтай',
      description: 'when = заавал болно, зөвхөн хэзээ гэдэг нь асуудал. if = болох ч, болохгүй ч байж мэднэ. Нөхцөлийн тал Present Simple, үндсэн тал will — бүтэц нь адилхан, утга нь ялгаатай.',
      examples: [
        { en: '[When I get home](m), [I](s)[\'ll cook](v) [dinner](o).', mn: 'Гэртээ харимагц би оройн хоол хийнэ (заавал харина).' },
        { en: '[If I get home early](m), [I](s)[\'ll cook](v) [dinner](o).', mn: 'Гэртээ эрт харивал би оройн хоол хийнэ (эрт харих эсэх тодорхойгүй).' },
        { en: '[As soon as the shop opens](m), [I](s)[\'ll buy](v) [the tickets](o).', mn: 'Дэлгүүр нээгдмэгц би тасалбар авна.' },
      ],
    },
    {
      title: 'Үндсэн өгүүлбэрт will-ийн оронд might / can',
      description: 'Үр дүн нь баттай биш бол will-ийн оронд might, боломж, зөвшөөрөл бол can хэрэглэж болно. Нөхцөлийн тал Present Simple хэвээр үлдэнэ.',
      examples: [
        { en: '[If you ask him](m), [he](s) [might say](v) [yes](o).', mn: 'Түүнээс асуувал тэр зөвшөөрч магадгүй.' },
        { en: '[If you finish your homework](m), [you](s) [can watch](v) [TV](o).', mn: 'Гэрийн даалгавраа дуусгавал чи зурагт үзэж болно.' },
        { en: '[If we leave at six](m), [we](s) [might catch](v) [the early train](o).', mn: 'Зургаан цагт гарвал бид эрт галт тэргэнд амжиж магадгүй.' },
      ],
    },
  ],
  forms: [
    {
      structure: 'If + subject + verb (present), subject + will + base verb',
      examples: [
        { en: '[If you eat well](m), [you](s) [will feel](v) [better](o).', mn: 'Сайн хооллвол чи илүү сайн болно.' },
        { en: '[If the train is late](m), [we](s) [will take](v) [a taxi](o).', mn: 'Галт тэрэг хоцорвол бид такси авна.' },
        { en: '[Bat](s) [will win](v) [if he practises every day](m).', mn: 'Өдөр бүр дасгал хийвэл Бат ялна.' },
      ],
      label: 'Батлах',
    },
    {
      structure: 'If + subject + don\'t / doesn\'t + verb, subject + will … · …, subject + won\'t + base verb',
      examples: [
        { en: '[If she doesn\'t answer](m), [I](s) [will send](v) [a message](o).', mn: 'Тэр хариулахгүй бол би мессеж явуулна.' },
        { en: '[If we don\'t book now](m), [we](s) [won\'t get](v) [a room](o).', mn: 'Одоо захиалахгүй бол бид өрөө авч чадахгүй.' },
        { en: '[He](s) [won\'t come](v) [if it snows](m).', mn: 'Цас орвол тэр ирэхгүй.' },
      ],
      label: 'Үгүйсгэх',
    },
    {
      structure: 'Will + subject + base verb + if …? · What / Where + will + subject + verb + if …?',
      examples: [
        { en: '[Will](v) [you](s) [come](v) [if I invite you](m)?', mn: 'Би чамайг урьвал чи ирэх үү?' },
        { en: '[What](o) [will](v) [she](s) [say](v) [if she sees this](m)?', mn: 'Тэр үүнийг харвал юу гэх бол?' },
        { en: '[Where](m) [will](v) [we](s) [sleep](v) [if the hotel is full](m)?', mn: 'Зочид буудал дүүрэн байвал бид хаана унтах вэ?' },
      ],
      label: 'Асуух',
    },
    {
      structure: 'Yes, subject + will. · No, subject + won\'t.',
      examples: [
        { en: '[Yes](o), [I](s) [will](v).', mn: 'Тийм ээ, ирнэ.' },
        { en: '[No](o), [she](s) [won\'t](v).', mn: 'Үгүй, ирэхгүй.' },
        { en: '[Yes](o), [we](s) [will](v), [if we have time](m).', mn: 'Тийм ээ, цаг гарвал тэгнэ.' },
      ],
      label: 'Богино хариулт',
    },
  ],
  signalWords: ['if', 'unless', 'when', 'as soon as', 'tomorrow', 'next week', 'later', 'tonight'],
  notes: [
    'If-тэй хэсэгт will хэзээ ч орохгүй, ирээдүйн тухай байсан ч Present Simple: If it rains (✗ If it will rain). Энэ бол монгол хүний хамгийн түгээмэл алдаа.',
    'If-тэй хэсэг эхэнд орвол таслал тавина, сүүлд орвол таслал хэрэггүй: If you call, I\'ll answer. · I\'ll answer if you call.',
    'Товчилсон хэлбэр: I will → I\'ll, will not → won\'t. Ярианд бараг үргэлж товчилно: If you don\'t hurry, you\'ll miss the bus.',
    'unless = if … not. unless-ийн ард үгүйсгэл давхар тавихгүй: Unless you study, you\'ll fail. (✗ Unless you don\'t study.)',
    'when, as soon as, before, after, until зэрэг цагийн холбоосын ард ч мөн will орохгүй: When I arrive, I\'ll call you. (✗ When I will arrive.)',
    'Zero conditional (If + present, present) = үргэлж үнэн факт, зуршил. First conditional (If + present, will) = нэг удаагийн ирээдүйн боломж. «If it rains, the grass gets wet» (үргэлж) vs «If it rains, I\'ll take an umbrella» (маргааш).',
  ],
  commonMistakes: [
    {
      wrong: 'If it will rain, I will stay at home.',
      correct: 'If it rains, I will stay at home.',
      explanation: 'if-тэй хэсэгт will орохгүй. Ирээдүйн тухай ярьж байгаа ч нөхцөлийн талыг Present Simple-ээр хэлнэ. will зөвхөн үр дүнгийн талд.',
    },
    {
      wrong: 'If you study hard, you pass the exam. (нэг удаагийн шалгалт гэсэн утгаар)',
      correct: 'If you study hard, you will pass the exam.',
      explanation: 'Тодорхой нэг ирээдүйн үр дүнг хэлж байвал will хэрэгтэй. will-гүй бол «үргэлж тэнцдэг» гэсэн ерөнхий үнэн (Zero conditional) болно.',
    },
    {
      wrong: 'If she don\'t come, we will start without her.',
      correct: 'If she doesn\'t come, we will start without her.',
      explanation: 'if-тэй хэсэг Present Simple тул she дээр doesn\'t. Нөхцөлийн тал ч мөн энгийн одоо цагийн дүрмээ дагана.',
    },
    {
      wrong: 'Unless you don\'t hurry, you\'ll be late.',
      correct: 'Unless you hurry, you\'ll be late.',
      explanation: 'unless өөрөө «-гүй бол» гэсэн үгүйсгэлийг агуулдаг. Ард нь don\'t нэмбэл давхар үгүйсгэл болж утга нь урвана.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «Бороо орвол би гэртээ сууна» гэхэд «орвол» нь нөхцөл, «сууна» нь ирээдүй. Англиар яг адилхан хуваарилалт: If it rains (Present Simple) = «орвол», I will stay = «сууна». «-вал» дээр will бүү тавь, «-на» дээр л will.',
      'Монголоор «-вал/-бол» төгсгөл өөрөө нөхцөлийг заадаг тул «хэрвээ» гэдэг үг заавал биш. Англиар if-ийг орхиж болохгүй — if байхгүй бол нөхцөл алга болно.',
      'Монголоор «-вал … -даг» (Zero) ба «-вал … -на» (First) гэж төгсгөлөөр ялгадаг. Англиар мөн адил: үндсэн өгүүлбэрт Present Simple бол Zero, will бол First. Монгол төгсгөлөө сонсоод will хэрэгтэй эсэхээ шийд.',
      'Монголоор «-вал» ба «-магц» (as soon as), «-х үед» (when) гэж ялгадаг. Англиар if / when / as soon as гэсэн тусдаа үгээр ялгана, харин гурвуулангийнх нь ард Present Simple орно, will орохгүй.',
    ],
  },
  dialogue: [
    {
      en: '[Are](v) [you](s) [coming](v) [to the picnic](m) [on Saturday](m)?',
      mn: 'Чи бямба гарагт пикникт ирэх үү?',
      speaker: 'Bat',
    },
    {
      en: '[If I finish my report](m), [I](s)[\'ll come](v). [What](o) [will](v) [you](s) [do](v) [if it rains](m)?',
      mn: 'Тайлангаа дуусгавал ирнэ. Бороо орвол чи яах вэ?',
      speaker: 'Saraa',
    },
    {
      en: '[If it rains](m), [we](s)[\'ll move](v) [the picnic](o) [to my flat](m).',
      mn: 'Бороо орвол бид пикникээ миний байр руу нүүлгэнэ.',
      speaker: 'Bat',
    },
    {
      en: '[Good idea](o). [I](s)[\'ll bring](v) [a cake](o) [if I have time to bake](m).',
      mn: 'Сайхан санаа. Жигнэх цаг гарвал би бялуу авчирна.',
      speaker: 'Saraa',
    },
    {
      en: '[Great](o)! [Unless the bus is late](m), [I](s)[\'ll be](v) [there](m) [at ten](m).',
      mn: 'Гоё! Автобус хоцрохгүй бол би арван цагт тэнд очно.',
      speaker: 'Bat',
    },
    {
      en: '[OK](o). [As soon as I arrive](m), [I](s)[\'ll call](v) [you](o).',
      mn: 'За. Би очмогцоо чам руу залгана.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-11-1',
      explanation: 'Нэг удаагийн ирээдүйн үр дүн тул will + үндсэн үйл үг. «miss» will-гүй бол Zero conditional болж утга өөрчлөгдөнө, «will to miss» — will-ийн ард to орохгүй, «are missing» — одоо үргэлжлэх цаг энд таарахгүй.',
      ruleId: 11,
      kind: 'fill',
      question: 'If you don\'t leave now, you ___ the train.',
      options: ['miss', 'will miss', 'will to miss', 'are missing'],
      answer: 'will miss',
      hint: '«-на» төгсгөл = will.',
    },
    {
      id: 'a2-11-2',
      explanation: 'if-тэй хэсэгт Present Simple, will орохгүй. «will call» — if-тэй хэсэгт will буруу, «call» — she дээр -s дутуу, «called» — өнгөрсөн цаг энд таарахгүй.',
      ruleId: 11,
      kind: 'fill',
      question: 'If she ___ me tonight, I\'ll tell her the news.',
      options: ['will call', 'calls', 'call', 'called'],
      answer: 'calls',
      hint: 'If-ийн хажууд will суудаггүй.',
    },
    {
      id: 'a2-11-3',
      explanation: 'If + Present Simple, will + base verb. «If … will snow» буруу, «doesn\'t … will» бол цасны утга урвасан, «snows, we don\'t go» бол Zero conditional (ирээдүйн нэг удаагийн санаанд тохирохгүй).',
      ruleId: 11,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['If it will snow tomorrow, we won\'t go skiing.', 'If it snows tomorrow, we won\'t go skiing.', 'If it snows tomorrow, we don\'t go skiing.', 'If it snow tomorrow, we won\'t go skiing.'],
      answer: 'If it snows tomorrow, we won\'t go skiing.',
      hint: 'Нөхцөл — одоо цаг, үр дүн — will.',
    },
    {
      id: 'a2-11-4',
      explanation: '«Дуусгавал» = If + Present Simple (finish), «явна» = will go. «will finish» if-тэй хэсэгт буруу, «go» will-гүй бол зуршил болно, «finishes» — we-тэй -s болохгүй.',
      ruleId: 11,
      kind: 'translate',
      question: 'Ажлаа эрт дуусгавал бид кинонд явна.',
      options: ['If we will finish work early, we will go to the cinema.', 'If we finish work early, we go to the cinema.', 'If we finish work early, we will go to the cinema.', 'If we finishes work early, we will go to the cinema.'],
      answer: 'If we finish work early, we will go to the cinema.',
      hint: '«-вал» = if + одоо цаг, «-на» = will.',
    },
  ],
};
