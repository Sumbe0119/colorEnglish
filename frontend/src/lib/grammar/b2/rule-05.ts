// frontend/src/lib/grammar/b2/rule-05.ts
// B2 дүрэм 5: Causative — have / get something done
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule05: GrammarRule = {
  id: 5,
  title: 'Causative: have / get something done',
  titleMn: 'Хийлгэх хэв — have / get something done',
  hook: '«Би үсээ засуулсан», «Бид дээврээ янзлуулна», «Тэр утсаа хулгайд алдчихжээ» — өөрөө хийгээгүй, бусдаар хийлгэсэн зүйлээ англиар зөв хэлж сурцгаая.',
  summary: 'have / get + object + V3 нь ажлыг өөрөө хийлгүй, бусдаар (ихэвчлэн мэргэжлийн хүнээр) хийлгэхийг заана: I had my hair cut — би үсээ засуулсан. get нь илүү ярианы хэлбэр. Хэнээр хийлгэснийг онцлох бол have + хүн + V1 (I had the mechanic check it) эсвэл get + хүн + to + V1 (I got him to check it). Мөн have + object + V3 нь таагүй явдалд өртсөнийг илэрхийлнэ: I had my phone stolen.',
  description: 'B1-ийн 7-р дүрэмд бид Passive voice (be + V3)-ийг үзсэн: My car was repaired — машиныг минь засчихсан, хэн гэдэг нь чухал биш. Causative бол passive-ийн «хамаатан»: мөн л V3 хэрэглэнэ, үйлдэгч нь чухал биш, гэхдээ нэг чухал мэдээлэл нэмэгдэнэ — энэ ажлыг ЭЗЭН ӨӨРӨӨ ЗОХИОН БАЙГУУЛСАН. I had my car repaired = би (засварчинд өгч) машинаа засуулсан. Харьцуул: I repaired my car (өөрөө зассан) → My car was repaired (засагдсан) → I had my car repaired (засуулсан). Үгийн дараалал маш чухал: тусагдахуун нь have ба V3 хоёрын ДУНД орно. Хэрэв I had repaired my car гэвэл энэ нь B1-ийн 2-р дүрмийн Past Perfect болж, «би өөрөө засчихсан байсан» гэсэн огт өөр утга гарна. Үйлдэгч хүнийг нь тусагдахуун болгож хэлэх хоёр бүтэц бий: have + хүн + V1 (үүрэг даалгавар өгөх — to байхгүй) ба get + хүн + to + V1 (ятгаж, гуйж хийлгэх — to заавал). Эцэст нь have + object + V3 нь эзний хүсээгүй, таагүй явдлыг ч илэрхийлдэг: She had her bag stolen. Монгол хэлэнд «-уул/-үүл», «-лга/-лгэ», «-га/-гэ» гэсэн үйлдүүлэх хэвийн дагаврууд (засуулах, хийлгэх, угаалгах) яг энэ утгыг илэрхийлдэг тул ойлголт нь монгол хүнд танил. Бэрхшээл нь ганц дагаврын оронд гурван үгтэй бүтэц, хатуу дараалал хэрэглэхэд л оршино.',
  structure: 'Subject + have / get + object + V3 · have + person + V1 · get + person + to + V1',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'have / get', part: 'verb' },
    { text: 'object', part: 'object' },
    { text: 'V3', part: 'verb' },
  ],
  tip: 'have / get + юмаа + V3 = хийлгэх · have + хүн + V1 = хүнээр хийлгэх (даалгах) · get + хүн + to V1 = хүнийг ятгаж хийлгэх · had + юмаа + V3 = таагүй явдалд өртөх. Тусагдахуун үргэлж дунд нь!',
  examples: [
    { en: '[I](s) [had](v) [my hair](o) [cut](v) [yesterday](m).', mn: 'Би өчигдөр үсээ засуулсан.' },
    { en: '[We](s) [are getting](v) [the roof](o) [repaired](v) [next week](m).', mn: 'Бид ирэх долоо хоногт дээврээ засуулна.' },
    { en: '[The teacher](s) [had](v) [us](o) [write](v) [an essay](o).', mn: 'Багш бидээр эссэ бичүүлсэн.' },
    { en: '[She](s) [had](v) [her phone](o) [stolen](v) [on the bus](m).', mn: 'Тэр автобусанд утсаа хулгайд алдсан.' },
  ],
  useCases: [
    {
      title: 'have something done — үйлчилгээ авах, бусдаар хийлгэх',
      description: 'Ажлыг өөрөө хийхгүй, мэргэжлийн хүн, үйлчилгээний газраар хийлгэнэ. Хэн хийсэн нь ихэвчлэн ойлгомжтой тул хэлэхгүй; хэлэх бол by + хүн. Үсчин, засварын газар, эмнэлэг, хими цэвэрлэгээний тухай ярихад байнга хэрэглэнэ.',
      examples: [
        { en: '[I](s) [have](v) [my car](o) [serviced](v) [twice a year](m).', mn: 'Би машинаа жилд хоёр удаа үйлчилгээнд оруулдаг.' },
        { en: '[She](s) [had](v) [her eyes](o) [tested](v) [last month](m).', mn: 'Тэр өнгөрсөн сард нүдээ шалгуулсан.' },
        { en: '[We](s)[\'re having](v) [the flat](o) [painted](v) [by a professional](m).', mn: 'Бид байраа мэргэжлийн хүнээр будуулж байгаа.' },
      ],
    },
    {
      title: 'get something done — ярианы хэлбэр ба «амжуулах»',
      description: 'have something done-той ижил утгатай, илүү ярианы өнгөтэй. Мөн get something done нь ажлыг (өөрөө ч байж болно) дуусгах, амжуулах гэсэн утгаар хэрэглэгддэг.',
      examples: [
        { en: '[I](s) [need to get](v) [my watch](o) [fixed](v).', mn: 'Би цагаа засуулах хэрэгтэй байна.' },
        { en: '[Where](m) [did](v) [you](s) [get](v) [your nails](o) [done](v)?', mn: 'Чи хумсаа хаана хийлгэсэн бэ?' },
        { en: '[I](s) [must get](v) [this report](o) [finished](v) [by Friday](m).', mn: 'Би энэ тайланг баасан гараг гэхэд дуусгах ёстой.' },
      ],
    },
    {
      title: 'have somebody do — хүнд даалгаж хийлгэх',
      description: 'Үйлдэгч хүнийг нь нэрлэж хэлнэ: have + хүн + V1 (to байхгүй!). Ихэвчлэн эрх мэдэл, үүрэг хариуцлагын харилцаатай: дарга ажилтандаа, багш сурагчдадаа, үйлчлүүлэгч үйлчилгээний ажилтанд даалгана.',
      examples: [
        { en: '[I](s)[\'ll have](v) [my assistant](o) [send](v) [you](o) [the files](o).', mn: 'Би туслахаараа танд файлуудыг явуулуулъя.' },
        { en: '[The manager](s) [had](v) [everyone](o) [work](v) [late](m).', mn: 'Менежер бүгдийг оройтож ажиллуулсан.' },
        { en: '[She](s) [had](v) [the porter](o) [carry](v) [her bags](o) [upstairs](m).', mn: 'Тэр ачаа зөөгчөөр цүнхээ дээшээ зөөлгөсөн.' },
      ],
    },
    {
      title: 'get somebody to do — ятгаж, гуйж хийлгэх',
      description: 'get + хүн + to + V1 (to заавал!). Хүнийг ятгах, гуйх, арга саам хэрэглэж байж хийлгэх гэсэн өнгөтэй. Тушаал биш, хичээл зүтгэл шаардсан.',
      examples: [
        { en: '[I](s) [got](v) [my brother](o) [to help](v) [me](o) [with the move](m).', mn: 'Би ахаараа нүүхэд туслуулсан. (гуйж ятгаад)' },
        { en: '[How](m) [did](v) [you](s) [get](v) [him](o) [to agree](v)?', mn: 'Чи түүнийг яаж зөвшөөрүүлсэн бэ?' },
        { en: '[She](s) [can\'t get](v) [her children](o) [to eat](v) [vegetables](o).', mn: 'Тэр хүүхдүүдээрээ ногоо идүүлж чаддаггүй.' },
      ],
    },
    {
      title: 'Таагүй явдалд өртөх — had my phone stolen',
      description: 'have + object + V3 нь эзний хүсээгүй, хяналтаас гадуур болсон муу зүйлийг илэрхийлнэ. Энд эзэн юу ч зохион байгуулаагүй — хохирогч нь. Энэ утгаар get-ийг бараг хэрэглэдэггүй.',
      examples: [
        { en: '[He](s) [had](v) [his car](o) [broken into](v) [last night](m).', mn: 'Өчигдөр шөнө түүний машиныг эвдэж орсон байна.' },
        { en: '[We](s) [had](v) [our flight](o) [cancelled](v) [at the last minute](m).', mn: 'Бидний нислэг эцсийн мөчид цуцлагдчихсан.' },
        { en: '[She](s) [had](v) [her nose](o) [broken](v) [in a basketball match](m).', mn: 'Тэр сагсан бөмбөгийн тоглолтын үеэр хамраа хугалуулсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'have + object + V3 (бүх цагт)',
      structure: 'have / has / had / will have / am having / have had + object + V3',
      examples: [
        { en: '[I](s)[\'m having](v) [a new kitchen](o) [fitted](v) [at the moment](m).', mn: 'Би яг одоо шинэ гал тогоо суулгуулж байгаа.' },
        { en: '[She](s) [has just had](v) [her flat](o) [redecorated](v).', mn: 'Тэр дөнгөж сая байраа засуулсан.' },
        { en: '[You](s) [should have](v) [that tooth](o) [looked at](v).', mn: 'Чи тэр шүдээ үзүүлэх хэрэгтэй.' },
      ],
    },
    {
      label: 'get + object + V3',
      structure: 'get / gets / got / will get / am getting + object + V3',
      examples: [
        { en: '[I](s) [got](v) [my jacket](o) [cleaned](v) [for the wedding](m).', mn: 'Би хуриманд зориулж хүрмээ цэвэрлүүлсэн.' },
        { en: '[He](s)[\'s getting](v) [his passport](o) [renewed](v).', mn: 'Тэр паспортоо сунгуулж байгаа.' },
        { en: '[We](s) [must get](v) [the heating](o) [checked](v) [before winter](m).', mn: 'Бид өвлөөс өмнө халаалтаа шалгуулах ёстой.' },
      ],
    },
    {
      label: 'have + person + V1 / get + person + to + V1',
      structure: 'have + somebody + V1 (to-гүй) · get + somebody + to + V1',
      examples: [
        { en: '[I](s) [had](v) [the waiter](o) [bring](v) [us](o) [some water](o).', mn: 'Би зөөгчөөр бидэнд ус авчруулсан.' },
        { en: '[I](s) [got](v) [the waiter](o) [to bring](v) [us](o) [some water](o).', mn: 'Би зөөгчөөр бидэнд ус авчруулсан. (гуйж байж)' },
        { en: '[Can](v) [you](s) [get](v) [someone](o) [to look at](v) [my laptop](o)?', mn: 'Чи хэн нэгнээр миний зөөврийн компьютерийг үзүүлж чадах уу?' },
      ],
    },
    {
      label: 'Үгүйсгэл ба асуулт',
      structure: 'don\'t / doesn\'t / didn\'t + have / get + object + V3 · Do / Does / Did + subject + have / get + object + V3?',
      examples: [
        { en: '[I](s) [didn\'t have](v) [the car](o) [washed](v). [I](s) [washed](v) [it](o) [myself](m).', mn: 'Би машинаа угаалгаагүй. Өөрөө угаасан.' },
        { en: '[How often](m) [do](v) [you](s) [have](v) [your teeth](o) [checked](v)?', mn: 'Чи шүдээ хэр олон удаа шалгуулдаг вэ?' },
        { en: '[Did](v) [you](s) [get](v) [your phone](o) [repaired](v) [in the end](m)?', mn: 'Чи эцэст нь утсаа засуулсан уу?' },
      ],
    },
  ],
  signalWords: ['have … done', 'get … done', 'have somebody do', 'get somebody to do', 'at the hairdresser\'s', 'at the garage', 'by a professional', 'had … stolen', 'myself'],
  notes: [
    'Үгийн дараалал утгыг шийднэ: I had my car repaired = засуулсан (causative). I had repaired my car = (өөрөө) засчихсан байсан (Past Perfect). Тусагдахуун have ба V3-ийн дунд байвал causative.',
    'Causative-ийн have бол туслах биш, жинхэнэ үйл үг. Тиймээс асуулт, үгүйсгэлд do / does / did хэрэглэнэ: Did you have your hair cut? (Had you your hair cut? гэхгүй). Мөн I\'ve my hair cut гэж товчлохгүй.',
    'have somebody do-д to байхгүй, get somebody to do-д to заавал. Энэ хоёрыг хольж хутгах нь хамгийн түгээмэл алдаа.',
    'Ижил бүлгийн үйл үгс: make somebody do = албадаж хийлгэх (to-гүй), let somebody do = зөвшөөрөх (to-гүй). have нь make шиг хатуу биш, зүгээр л үүрэг даалгасан гэсэн утгатай.',
    'Өөрөө хийснээ онцлох бол myself, yourself нэмнэ: I painted the flat myself. Causative-тэй харьцуулахад тод ялгаа гарна: I didn\'t have it painted, I did it myself.',
    'need + V-ing нь ойр утгатай: My car needs repairing = My car needs to be repaired ≈ I need to have my car repaired. Эхнийх нь юманд юу хэрэгтэйг, сүүлийнх нь хэн зохион байгуулахыг онцолно.',
  ],
  commonMistakes: [
    {
      wrong: 'I cut my hair at the hairdresser\'s yesterday.',
      correct: 'I had my hair cut at the hairdresser\'s yesterday.',
      explanation: 'I cut my hair гэвэл «би өөрөө хайч бариад үсээ тайрсан» гэсэн утга гарна. Үсчнээр засуулсан бол have + object + V3. Монголоор «үсээ засуулсан» гэдэг шиг англиар ч хийлгэх хэвийг заавал ялгана.',
    },
    {
      wrong: 'I had repaired my car last week.',
      correct: 'I had my car repaired last week.',
      explanation: 'Тусагдахуун (my car) нь have ба V3-ийн дунд байх ёстой. had repaired гэж нийлүүлбэл Past Perfect болж, өөрөө зассан гэсэн утгатай болно.',
    },
    {
      wrong: 'She got her brother carry the bags.',
      correct: 'She got her brother to carry the bags.',
      explanation: 'get + хүн-ий ард to + V1 заавал. to-гүй хэлбэр зөвхөн have-тэй: She had her brother carry the bags.',
    },
    {
      wrong: 'Had you your car serviced last month?',
      correct: 'Did you have your car serviced last month?',
      explanation: 'Causative-ийн have нь жинхэнэ үйл үг тул асуултыг did-ээр үүсгэнэ. Үгүйсгэл нь мөн адил: I didn\'t have it serviced.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монгол хэлэнд үйлдүүлэх хэвийн дагавар байдаг: засах → засуулах, хийх → хийлгэх, угаах → угаалгах, бичих → бичүүлэх. Англиар ийм дагавар байхгүй тул have / get + object + V3 гэсэн бүтэн бүтцээр илэрхийлнэ. Монгол үйл үгэнд «-уул / -лга» дагавар байвал causative гэж бодоорой.',
      'Монголоор хэнээр хийлгэснийг үйлдэхийн тийн ялгалаар хэлдэг: «ахаараа зөөлгөсөн», «засварчнаар засуулсан». Англиар тэр хүн тусагдахууны байранд орно: I had my brother carry it, эсвэл V3-тэй бүтцэд by-аар: I had it repaired by a mechanic.',
      'Монголоор «утсаа хулгайлуулсан», «хамраа хугалуулсан» гэж таагүй явдлыг мөн үйлдүүлэх хэвээр хэлдэг нь англи хэлний I had my phone stolen-тэй яг адил логик. Хоёр хэлэнд хоёуланд нь эзэн үүнийг хүсээгүй гэдэг нь утгаас ойлгогдоно.',
      'Монголоор ярианд «үсээ засчихлаа», «машинаа засчихсан» гэж үйлдүүлэх дагаваргүй хэлэх нь элбэг, сонсогч өөрөө ойлгодог. Англиар I repaired my car гэвэл үнэхээр өөрөө зассан гэж ойлгогдох тул бусдаар хийлгэсэн бол causative-ийг орхиж болохгүй.',
    ],
  },
  dialogue: [
    {
      en: 'Nomin, [your flat](s) [looks](v) [amazing](o)! [Did](v) [you](s) [paint](v) [it](o) [yourself](m)?',
      mn: 'Номин, байр чинь гайхалтай харагдаж байна! Чи өөрөө будсан уу?',
      speaker: 'Saraa',
    },
    {
      en: 'No, [I](s) [had](v) [it](o) [painted](v) [last month](m). [I](s) [also](m) [got](v) [new windows](o) [fitted](v).',
      mn: 'Үгүй ээ, би өнгөрсөн сард будуулсан. Бас шинэ цонх суулгуулсан.',
      speaker: 'Nomin',
    },
    {
      en: '[How](m) [did](v) [you](s) [get](v) [your landlord](o) [to agree](v)?',
      mn: 'Чи байрны эзнээ яаж зөвшөөрүүлсэн юм бэ?',
      speaker: 'Saraa',
    },
    {
      en: '[I](s) [had](v) [my brother](o) [talk](v) [to him](m). [He](s)[\'s](v) [very persuasive](o).',
      mn: 'Би ахаараа түүнтэй яриулсан. Тэр хүнийг их сайн ятгадаг юм.',
      speaker: 'Nomin',
    },
    {
      en: 'Lucky you. [I](s) [had](v) [my bike](o) [stolen](v) [from the hallway](m) [last week](m).',
      mn: 'Чи азтай юм. Би өнгөрсөн долоо хоногт дугуйгаа орцноосоо хулгайд алдчихсан.',
      speaker: 'Saraa',
    },
    {
      en: 'Oh no! [You](s) [should have](v) [a camera](o) [installed](v) [there](m).',
      mn: 'Ээ харла! Чи тэнд камер суулгуулах хэрэгтэй.',
      speaker: 'Nomin',
    },
  ],
  quiz: [
    {
      id: 'b2-05-1',
      ruleId: 5,
      kind: 'fill',
      question: 'We\'re having the kitchen ___ next week.',
      options: ['paint', 'painted', 'painting', 'to paint'],
      answer: 'painted',
      explanation: 'have + object + V3 — гал тогоог бусдаар будуулна. Тусагдахууны ард past participle: painted. paint, painting, to paint энэ бүтцэд орохгүй (гал тогоо өөрөө буддаггүй).',
      hint: 'have + юм + V3.',
    },
    {
      id: 'b2-05-2',
      ruleId: 5,
      kind: 'fill',
      question: 'I couldn\'t fix the car myself, so I got a mechanic ___ at it.',
      options: ['look', 'looked', 'to look', 'looks'],
      answer: 'to look',
      explanation: 'get + хүн + to + V1 — хүнээр хийлгэх. get-ийн ард to заавал байна. to-гүй look нь зөвхөн have-тэй (had a mechanic look); looked, looks энэ бүтцэд орохгүй.',
      hint: 'get somebody … do — юу дутуу байна?',
    },
    {
      id: 'b2-05-3',
      ruleId: 5,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'I had cut my hair by the hairdresser.',
        'She had her bag stolen on the bus.',
        'We got the roof repair last month.',
        'He had the mechanic to check the brakes.',
      ],
      answer: 'She had her bag stolen on the bus.',
      explanation: 'have + object + V3 — таагүй явдалд өртсөн, зөв. Бусад нь: тусагдахуун дунд нь байх ёстой (had my hair cut); get + object + V3 (repaired); have + хүн + V1 нь to-гүй (had the mechanic check).',
      hint: 'have + object + V3 дараалал.',
    },
    {
      id: 'b2-05-4',
      ruleId: 5,
      kind: 'translate',
      question: 'Би машинаа засуулах хэрэгтэй байна.',
      options: [
        'I need to have repaired my car.',
        'I need to have my car repair.',
        'I need my car to have repaired.',
        'I need to have my car repaired.',
      ],
      answer: 'I need to have my car repaired.',
      explanation: '«Засуулах» — үйлдүүлэх хэв: have + object + V3 → have my car repaired. Тусагдахуун have ба V3-ийн дунд байна, ард нь V1 (repair) биш V3 (repaired).',
      hint: '«-уул» дагавар = have + юм + V3.',
    },
  ],
};
