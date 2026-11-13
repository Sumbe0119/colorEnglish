// frontend/src/lib/grammar/c1/rule-05.ts
// C1 дүрэм 5: Advanced passive forms
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule05: GrammarRule = {
  id: 5,
  title: 'Advanced passive forms',
  titleMn: 'Идэвхгүй хэвийн ахисан хэлбэрүүд — to be done, being done, get-passive, need doing',
  hook: '«Би шүүмжлүүлэх дургүй», «Тайлан алга болсон бололтой», «Биднийг хоёр цаг хүлээлгэсэн» — идэвхгүй хэвийг infinitive, -ing, get, make-тэй хослуулж сурцгаая.',
  summary: 'Идэвхгүй хэв нь infinitive (to be done, to have been done) болон -ing хэлбэрт (being done, having been done) орж чадна: She wants to be promoted; He hates being interrupted. get + V3 нь ярианы, гэнэтийн үйл явдлын passive (He got fired). Хоёр тусагдахуунтай үйл үгийн «хүн» нь эзэн болдог (I was given a prize). make / see / hear нь passive-д to авна (He was made to wait). need + -ing нь идэвхгүй утгатай (The car needs washing).',
  description: 'B1-ийн 7-р дүрэмд passive voice-ийн үндсийг (be + V3), B2-ийн 5-р дүрэмд causative-ийг (have / get something done), 6-р дүрэмд passive reporting-ийг (He is said to be … / He is said to have been …) үзсэн. C1 түвшинд passive нь зөвхөн бүтэн өгүүлбэрийн цагт биш, үйл үгийн БҮХ хэлбэрт нэвтэрнэ: to-infinitive ч, -ing ч идэвхгүй болж чадна. B2-ийн 8-р дүрэмд үзсэн verb patterns (-ing үү, to юу) яг хэвээрээ үйлчилнэ — эхлээд хэв маягаа сонгоод дараа нь идэвхгүй болгоно: want + to → want to be told; enjoy + -ing → enjoy being praised; угтвар үг + -ing → without being asked. Perfect хэлбэрүүд (to have been done, having been done) нь үндсэн үйл үгээс ӨМНӨ болсон үйлдлийг заах бөгөөд C1-ийн 7-р дүрэмд дэлгэрэнгүй үзнэ. Өнгө аясын хувьд perfect passive хэлбэрүүд бичгийн, албан ёсны хэлэнд; get-passive ярианы хэлэнд; need doing өдөр тутмын Британи ярианд түгээмэл. Монгол хэлэнд идэвхгүй, үйлдүүлэх утгыг «-гд-», «-уул- / -үүл-», «-лга-» дагавраар (шүүмжлүүлэх, хүлээлгэх, хулгайлагдах) эсвэл зүгээр л үйлдэгчийг хэлэхгүй орхиж («Надад шагнал өгсөн») илэрхийлдэг. Англиар харин үйлдэл хүртэгчийг заавал эзэн болгож, be + V3-ийг тохирох хэлбэрт нь оруулах ёстой — энэ л монгол суралцагчид хамгийн их хүндрэл учруулдаг.',
  structure: 'to be + V3 · to have been + V3 · being + V3 · having been + V3 · get + V3 · be made / seen / heard + to V1 · need + V-ing',
  structureParts: [
    { text: 'subject', part: 'subject' },
    { text: 'verb', part: 'verb' },
    { text: 'to be / being + V3', part: 'object' },
    { text: '· get + V3 · need + V-ing', part: 'modifier' },
  ],
  tip: 'Эхлээд хэв маягаа сонго (to уу, -ing үү), дараа нь passive болго: want to tell → want to be told · hate criticising → hate being criticised. Өмнө болсон бол to have been / having been + V3. Active: They made me wait → Passive: I was made TO wait.',
  examples: [
    { en: '[Nobody](s) [likes](v) [being criticised](o) [in public](m).', mn: 'Хэн ч олны өмнө шүүмжлүүлэх дургүй.' },
    { en: '[The report](s) [seems](v) [to have been lost](o).', mn: 'Тайлан алга болсон бололтой.' },
    { en: '[He](s) [was made](v) [to apologise](v) [in front of the whole class](m).', mn: 'Түүгээр бүх ангийн өмнө уучлалт гуйлгасан.' },
    { en: '[My bike](s) [got stolen](v) [last night](m).', mn: 'Миний дугуйг өчигдөр шөнө хулгайлчихжээ.' },
  ],
  useCases: [
    {
      title: 'Passive infinitive — to be done / to have been done',
      description: 'to-infinitive шаарддаг үйл үг, бүтцийн ард (want, expect, deserve, hope, seem, need; be + adjective) үйлдэл хүртэгчийн талаас хэлнэ. to be + V3 нь одоо эсвэл ирээдүйн, to have been + V3 нь өмнө болсон үйлдэл. B2-ийн 6-р дүрмийн passive reporting-той байнга хослоно.',
      examples: [
        { en: '[Every employee](s) [deserves](v) [to be treated](o) [with respect](m).', mn: 'Ажилтан бүр хүндэтгэлтэй хандуулах эрхтэй.' },
        { en: '[The results](s) [are expected](v) [to be announced](o) [tomorrow](m).', mn: 'Үр дүнг маргааш зарлах төлөвтэй байна.' },
        { en: '[The bridge](s) [is believed](v) [to have been built](o) [in the 13th century](m).', mn: 'Гүүрийг XIII зуунд барьсан гэж үздэг.' },
      ],
    },
    {
      title: 'Passive gerund — being done / having been done',
      description: '-ing шаарддаг үйл үг (enjoy, hate, avoid, remember, deny, mind), угтвар үгийн ард болон өгүүлбэрийн эзэн болж орно. having been + V3 нь өмнө болсныг онцлох бөгөөд B2-ийн 10-р дүрмийн participle clause-д ч гарна.',
      examples: [
        { en: '[She](s) [remembers](v) [being taken](o) [to the countryside](m) [every summer](m).', mn: 'Тэр зун болгон хөдөө дагуулж явдаг байсныг санадаг.' },
        { en: '[He](s) [left](v) [the room](o) [without being noticed](m).', mn: 'Тэр хэнд ч анзаарагдалгүй өрөөнөөс гарсан.' },
        { en: '[Having been warned](m) [about the storm](m), [we](s) [stayed](v) [at home](m).', mn: 'Шуурганы талаар сэрэмжлүүлэг авсан тул бид гэртээ үлдсэн.' },
      ],
    },
    {
      title: 'get-passive — ярианы, гэнэтийн үйл явдал',
      description: 'be-ийн оронд get хэрэглэвэл ярианы өнгөтэй болж, үйл явдал гэнэт, санамсаргүй, ихэвчлэн таагүй (эсвэл хүсэн хүлээсэн) байдлаар болсныг онцолно. Зөвхөн үйлдэлд, төлөв байдалд биш. Албан бичигт be-passive-ийг сонго.',
      examples: [
        { en: '[Three people](s) [got injured](v) [in the accident](m).', mn: 'Ослоор гурван хүн гэмтсэн.' },
        { en: '[She](s) [got promoted](v) [after only a year](m).', mn: 'Тэр ердөө жилийн дараа тушаал дэвшсэн.' },
        { en: '[Did](v) [you](s) [get paid](v) [last week](m)?', mn: 'Чи өнгөрсөн долоо хоногт цалингаа авсан уу?' },
      ],
    },
    {
      title: 'Хоёр тусагдахуунтай үйл үг ба make / see / hear',
      description: 'give, offer, send, show, tell, pay, promise, teach зэрэг үйл үгийн passive-д ихэвчлэн «хүн» нь эзэн болно (I was offered a job). make, see, hear нь active-д to-гүй V1 авдаг ч passive-д заавал to авна: They made us wait → We were made to wait.',
      examples: [
        { en: '[I](s) [was offered](v) [a job](o) [in Berlin](m).', mn: 'Надад Берлинд ажил санал болгосон.' },
        { en: '[We](s) [were made](v) [to fill in](v) [three forms](o).', mn: 'Бидээр гурван маягт бөглүүлсэн.' },
        { en: '[He](s) [was seen](v) [to enter](v) [the building](o) [at midnight](m).', mn: 'Түүнийг шөнө дунд байранд орохыг харсан байна.' },
      ],
    },
    {
      title: 'need doing — «хийлгэх хэрэгтэй»',
      description: 'need + -ing нь идэвхгүй утгатай: ямар нэг зүйлийг хэн нэгэн хийх шаардлагатай. need to be + V3-тай яг адил утгатай, гэхдээ илүү ярианы. Эзэн нь үйлдэл хүртэх ЗҮЙЛ байна.',
      examples: [
        { en: '[The windows](s) [need](v) [cleaning](o).', mn: 'Цонхнуудыг цэвэрлэх хэрэгтэй.' },
        { en: '[This report](s) [needs](v) [checking](o) [before it is sent](m).', mn: 'Энэ тайланг явуулахаас өмнө шалгах хэрэгтэй.' },
        { en: '[Your hair](s) [needs](v) [cutting](o).', mn: 'Чиний үсийг засуулах хэрэгтэй болжээ.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Passive infinitive',
      structure: 'to be + V3 (одоо / ирээдүй) · to have been + V3 (өмнө нь)',
      examples: [
        { en: '[I](s) [don\'t want](v) [to be disturbed](o).', mn: 'Би саад болуулахыг хүсэхгүй байна.' },
        { en: '[There](s) [is](v) [a lot of work](o) [to be done](m).', mn: 'Хийх ажил их байна.' },
        { en: '[He](s) [claims](v) [to have been robbed](o) [on the train](m).', mn: 'Тэр галт тэргэнд дээрэмдүүлсэн гэж мэдэгдэж байна.' },
      ],
    },
    {
      label: 'Passive gerund',
      structure: 'being + V3 · having been + V3 (өмнө нь)',
      examples: [
        { en: '[Children](s) [love](v) [being read to](o).', mn: 'Хүүхдүүд ном уншуулах дуртай.' },
        { en: '[I](s) [object](v) [to being treated](o) [like a child](m).', mn: 'Би өөртэйгөө хүүхэд шиг харьцуулахыг эсэргүүцэж байна.' },
        { en: '[He](s) [denied](v) [having been paid](o) [for the information](m).', mn: 'Тэр мэдээллийн төлөө мөнгө авснаа үгүйсгэсэн.' },
      ],
    },
    {
      label: 'get-passive',
      structure: 'get + V3 (ярианы; үйл явдал, өөрчлөлт)',
      examples: [
        { en: '[My phone](s) [got broken](v) [on the trip](m).', mn: 'Миний утас аяллын үеэр эвдэрчихсэн.' },
        { en: '[They](s) [got married](v) [in June](m).', mn: 'Тэд зургаадугаар сард гэрлэсэн.' },
        { en: '[Be](v) [careful](o), [or](m) [you](s)[\'ll get hurt](v).', mn: 'Болгоомжтой байгаарай, үгүй бол гэмтчихнэ.' },
      ],
    },
    {
      label: 'make / see / hear + to · need + -ing',
      structure: 'be made / seen / heard + to V1 · need + V-ing = need to be + V3',
      examples: [
        { en: '[The students](s) [were made](v) [to rewrite](v) [the essay](o).', mn: 'Оюутнуудаар эссэг нь дахин бичүүлсэн.' },
        { en: '[She](s) [was heard](v) [to say](v) [that she would resign](o).', mn: 'Түүнийг ажлаасаа гарна гэж хэлэхийг сонссон байна.' },
        { en: '[The roof](s) [needs](v) [to be repaired](o).', mn: 'Дээврийг засах хэрэгтэй. (= The roof needs repairing.)' },
      ],
    },
  ],
  signalWords: ['to be done', 'to have been done', 'being done', 'having been done', 'get + V3', 'was given / offered / told', 'be made to', 'be seen to', 'be heard to', 'need + -ing'],
  notes: [
    'to уу, -ing үү гэдгийг өмнөх үйл үг шийднэ (B2-ийн 8-р дүрэм), passive эсэх нь үүнийг өөрчлөхгүй: want to be invited, enjoy being invited, be afraid of being invited.',
    'Perfect хэлбэр нь үндсэн үйл үгээс өмнөх цагийг заана: He seems to be respected (одоо хүндлэгддэг) / He seems to have been respected (өмнө нь хүндлэгддэг байсан).',
    'get-passive зөвхөн үйлдэл, өөрчлөлтөд: got fired, got caught, got invited. Төлөв байдлын үйл үгтэй хэрэглэхгүй: He got known / got owned (буруу) → He was known. Албан бичигт be хэрэглэ.',
    'Бүх үйл үг «хүн»-ийг эзэн болгож чадахгүй. explain, suggest, describe, say-тэй бол: I was explained the rules (буруу) → The rules were explained to me (зөв).',
    'let-ийн passive бараг хэрэглэгддэггүй — оронд нь be allowed to: They let me leave → I was allowed to leave. see / hear + -ing нь passive-д хэвээр: He was seen entering the building (үйлдлийн явцыг харсан).',
    'need + -ing = need to be + V3. The car needs to wash (буруу — машин өөрөө угаахгүй), needs being washed (буруу). require, want (Британи ярианы) мөн адил: The plants want watering.',
  ],
  commonMistakes: [
    {
      wrong: 'Nobody likes criticising in public.',
      correct: 'Nobody likes being criticised in public.',
      explanation: 'Энд «шүүмжлүүлэх» гэсэн идэвхгүй утга хэрэгтэй — being + V3. criticising гэвэл «бусдыг шүүмжлэх дургүй» гэсэн өөр утга гарна.',
    },
    {
      wrong: 'We were made wait outside for an hour.',
      correct: 'We were made to wait outside for an hour.',
      explanation: 'make нь active-д to-гүй (They made us wait), харин passive-д заавал to авна: were made to wait. see, hear мөн адил.',
    },
    {
      wrong: 'I was explained the problem by the manager.',
      correct: 'The problem was explained to me by the manager.',
      explanation: 'explain нь give шиг хоёр тусагдахуун авдаггүй (explain something to somebody), тиймээс «хүн» эзэн болж чадахгүй.',
    },
    {
      wrong: 'The car needs to wash.',
      correct: 'The car needs washing. / The car needs to be washed.',
      explanation: 'Машин бол үйлдэл хүртэгч. need + -ing эсвэл need to be + V3 гэсэн идэвхгүй утгатай хэлбэрийг хэрэглэнэ.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор идэвхгүй, үйлдүүлэх утгыг ганц дагавраар гаргадаг: шүүмжлэх → шүүмжлүүлэх, урих → уригдах. Англиар дагавар байхгүй тул be + V3-ийг тухайн байрлалд тохирох хэлбэрт оруулна: «шүүмжлүүлэх дургүй» = hate being criticised, «уригдахыг хүсэх» = want to be invited.',
      'Монголоор үйлдэгч тодорхойгүй бол эзэнгүй өгүүлбэр хэлдэг: «Надад ажил санал болгосон», «Бидэнд хэлээгүй». Англиар эзэнгүй өгүүлбэр байхгүй тул «надад / бидэнд» гэсэн хүнийг эзэн болгоно: I was offered a job; We weren\'t told.',
      'Монголын «-уул- / -лга-» нь «хүлээлгэсэн», «бичүүлсэн» гэж албадлагыг заахад хэн албадсаныг хэлэхгүй орхиж болдог. Англиар үүнийг be made to + V1-ээр хэлэх бөгөөд active-д байгаагүй to энд заавал нэмэгдэнэ: «Биднийг хүлээлгэсэн» = We were made to wait.',
      'Монголоор «Машиныг угаах хэрэгтэй» гэхэд машин тусагдахуун хэвээр. Англиар зүйл нь эзэн болж, үйл үг идэвхгүй утгатай -ing авна: The car needs washing. Харин «хулгайлчихжээ», «халагдчихсан» гэх мэт «-чих-»-ийн гэнэтийн өнгө get-passive-тэй ойр: got stolen, got fired.',
    ],
  },
  dialogue: [
    {
      en: 'Tuya, [you](s) [look](v) [annoyed](o). [What](s) [happened](v)?',
      mn: 'Туяа, чи уурласан харагдаж байна. Юу болов?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [was made](v) [to rewrite](v) [the whole report](o). [I](s) [hate](v) [being told](o) [at the last minute](m).',
      mn: 'Надаар тайланг бүхэлд нь дахин бичүүлсэн. Сүүлийн мөчид хэлүүлэхийг би үзэн яддаг.',
      speaker: 'Tuya',
    },
    {
      en: '[Were](v) [you](s) [given](v) [a reason](o)?',
      mn: 'Чамд шалтгааныг нь хэлсэн үү?',
      speaker: 'Bat',
    },
    {
      en: 'Not really. [The figures](s) [seem](v) [to have been changed](o) [without anyone being informed](m).',
      mn: 'Үгүй дээ. Тоонуудыг хэнд ч мэдэгдэлгүйгээр өөрчилсөн бололтой.',
      speaker: 'Tuya',
    },
    {
      en: 'Typical. [By the way](m), [Temuulen](s) [got promoted](v) [yesterday](m).',
      mn: 'Дандаа л ингэдэг. Дашрамд хэлэхэд, Тэмүүлэн өчигдөр тушаал дэвшсэн.',
      speaker: 'Bat',
    },
    {
      en: 'Good for him! [He](s) [deserves](v) [to be recognised](o). Anyway, [this report](s) [still](m) [needs](v) [checking](o).',
      mn: 'Сайн байна! Тэр үнэлэгдэх ёстой хүн. За яах вэ, энэ тайланг бас шалгах хэрэгтэй хэвээр байна.',
      speaker: 'Tuya',
    },
  ],
  quiz: [
    {
      id: 'c1-05-1',
      ruleId: 5,
      kind: 'fill',
      question: 'She remembers ___ to the zoo by her grandfather when she was five.',
      options: ['being taken', 'to be taken', 'taking', 'be taken'],
      answer: 'being taken',
      explanation: 'Өнгөрсөн дурсамж — remember + -ing; by her grandfather гэдэг нь түүнийг аваачсан гэсэн идэвхгүй утга тул being taken. remember to … нь «мартахгүй хийх» гэсэн өөр утгатай.',
      hint: 'remember + -ing (дурсамж) + passive.',
    },
    {
      id: 'c1-05-2',
      ruleId: 5,
      kind: 'fill',
      question: 'We were made ___ for two hours at the border.',
      options: ['to wait', 'wait', 'waiting', 'waited'],
      answer: 'to wait',
      explanation: 'make нь passive-д to + V1 авна: were made to wait. Active-д л to-гүй: They made us wait.',
      hint: 'Passive-д юу нэмэгддэг вэ?',
    },
    {
      id: 'c1-05-3',
      ruleId: 5,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'The windows need to cleaning.',
        'He hates be told what to do.',
        'The painting is thought to have been stolen in the 1990s.',
        'I was explained the rules by the teacher.',
      ],
      answer: 'The painting is thought to have been stolen in the 1990s.',
      explanation: 'Өмнө болсон үйлдэл — to have been + V3 зөв. Бусад нь: need cleaning / need to be cleaned; hates being told; The rules were explained to me.',
      hint: 'Өмнө болсон үйлдлийн passive infinitive.',
    },
    {
      id: 'c1-05-4',
      ruleId: 5,
      kind: 'translate',
      question: 'Надад хоёр дахь боломж олгосон.',
      options: [
        'I was given a second chance.',
        'I was gave a second chance.',
        'I have given a second chance.',
        'I was given to a second chance.',
      ],
      answer: 'I was given a second chance.',
      explanation: 'Үйлдэгч тодорхойгүй, «надад» гэсэн хүн эзэн болно: I was given + зүйл. be-ийн ард V3 (given); have given гэвэл «би өгсөн» гэсэн идэвхтэй утга болно; given-ий ард to хэрэггүй.',
      hint: '«Надад» → I + was + V3.',
    },
  ],
};
