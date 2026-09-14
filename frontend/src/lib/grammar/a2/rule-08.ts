// frontend/src/lib/grammar/a2/rule-08.ts
// A2 дүрэм 8: should / shouldn't
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule08: GrammarRule = {
  id: 8,
  title: 'should / shouldn\'t',
  titleMn: 'should / shouldn\'t — зөвлөгөө, юу зөв болохыг хэлэх',
  hook: '«Чи илүү их унтвал зүгээр», «Тэгж хэлэх хэрэггүй байсан», «Би яах ёстой вэ?» — зөвлөгөө өгөх, асуух бүх зүйлд should ганцаараа хангалттай.',
  summary: 'should нь зөвлөгөө өгөх, ямар нэг зүйл хийх нь зөв, зүйтэй гэсэн бодлоо хэлэхэд хэрэглэнэ: You should sleep more. Баймж үйл үг тул эзнээр хувирахгүй, араас нь to-гүй үндсэн үйл үг орно; үгүйсгэл нь shouldn\'t, асуулт нь Should I…?',
  description: 'should бол баймж үйл үг (modal verb). Утга нь «… хийвэл зүгээр», «… хийх хэрэгтэй», «… хийх нь зөв» — өөрөөр хэлбэл зөвлөгөө, санал, юу зөв болох тухай бодол. must-аас зөөлөн: must гэвэл «заавал», should гэвэл «зүйтэй, хэрэгтэй, гэхдээ сонголт чинь». Эмч «You should drink more water» гэхэд заавал биш, харин тэгвэл сайн гэсэн зөвлөгөө. Бүтэц нь can-тай яг адил: эзэн хэн ч байсан should хувирахгүй, араас нь үйл үгийн үндсэн хэлбэр орно — to ч үгүй, -s ч үгүй. Үгүйсгэлд shouldn\'t (should not), асуултад Should + эзэн + үйл үг? гэнэ, do/does хэрэггүй. Зөвлөгөө өгөхдөө «I think you should…», зөвлөгөө асуухдаа «What should I do?» гэж хэлдэг нь ярианы хамгийн түгээмэл хэлбэр. Монголоор «-вал зүгээр», «… хэрэгтэй», «… ёстой» (зөвлөгөөний өнгө аясаар) гэсэн утгуудыг бүгдийг нь нэг should-оор хэлнэ.',
  structure: 'Subject + should / shouldn\'t + base verb',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'should / shouldn\'t', part: 'verb' },
    { text: 'base verb', part: 'verb' },
  ],
  tip: 'should = зөөлөн зөвлөгөө, must = хатуу үүрэг. Санах арга: should-ийн араас to хэзээ ч бүү тавь — «should go», «should to go» биш. can-тай яг адил дүрэм.',
  examples: [
    { en: '[You](s) [should drink](v) [more water](o).', mn: 'Чи илүү их ус уувал зүгээр.' },
    { en: '[He](s) [shouldn\'t eat](v) [so much sugar](o).', mn: 'Тэр тийм их чихэр идэх хэрэггүй.' },
    { en: '[Should](v) [I](s) [call](v) [her](o) [now](m)?', mn: 'Би одоо түүн рүү залгах уу?' },
    { en: '[I](s) [think](v) [we](s) [should leave](v) [early](m).', mn: 'Бид эрт явбал зүгээр гэж би бодож байна.' },
  ],
  useCases: [
    {
      title: 'Зөвлөгөө өгөх',
      description: 'Хэн нэгэнд юу хийвэл сайн болохыг хэлнэ. Эрүүл мэнд, суралцах, харилцаа — ямар ч сэдэвт тохирно. Зөөлөн, найрсаг сонсогдох тул «I think» нэмбэл бүр эелдэг болно.',
      examples: [
        { en: '[You](s) [should see](v) [a dentist](o).', mn: 'Чи шүдний эмчид үзүүлбэл зүгээр.' },
        { en: '[I](s) [think](v) [you](s) [should talk](v) [to your teacher](m).', mn: 'Чи багштайгаа ярилцвал зүгээр гэж би бодож байна.' },
        { en: '[Students](s) [should read](v) [every day](m).', mn: 'Сурагчид өдөр бүр ном уншвал сайн.' },
      ],
    },
    {
      title: 'Юу буруу болохыг хэлэх — shouldn\'t',
      description: 'Ямар нэг зүйл хийхгүй байх нь зөв гэсэн зөвлөгөө. Хориглолт биш, харин «тэгэх хэрэггүй» гэсэн зөөлөн анхааруулга. mustn\'t-ээс хамаагүй зөөлөн.',
      examples: [
        { en: '[You](s) [shouldn\'t drive](v) [so fast](m).', mn: 'Чи тийм хурдан машин барих хэрэггүй.' },
        { en: '[We](s) [shouldn\'t waste](v) [food](o).', mn: 'Бид хоол хаяж үрэх хэрэггүй.' },
        { en: '[She](s) [shouldn\'t stay up](v) [so late](m).', mn: 'Тэр тийм оройтож унтах хэрэггүй.' },
      ],
    },
    {
      title: 'Зөвлөгөө асуух',
      description: 'Юу хийх нь зөв болохыг мэдэхгүй байхдаа Should I…? эсвэл What should I do? гэж асууна. Ярианд маш их хэрэглэдэг. Хариулт нь ихэвчлэн мөн should-той ирнэ.',
      examples: [
        { en: '[What](o) [should](v) [I](s) [do](v)?', mn: 'Би яах ёстой вэ?' },
        { en: '[Should](v) [we](s) [take](v) [a taxi](o) [or the bus](o)?', mn: 'Бид такси авах уу, автобусаар явах уу?' },
        { en: '[Which phone](o) [should](v) [I](s) [buy](v)?', mn: 'Би аль утсыг авбал дээр вэ?' },
      ],
    },
    {
      title: 'Ерөнхийд нь зөв, зүйтэй гэж үзэх',
      description: 'Хэн нэгэнд хандаагүй, ерөнхийдөө ямар нэг зүйл ийм байх ёстой гэсэн бодлоо хэлнэ. Нийгэм, дүрэм, ёс зүйн тухай яриж байхад тохиромжтой.',
      examples: [
        { en: '[People](s) [should be](v) [kind](o) [to animals](m).', mn: 'Хүмүүс амьтдад сайхан сэтгэлээр хандах ёстой.' },
        { en: '[Everyone](s) [should learn](v) [to swim](o).', mn: 'Хүн бүр сэлж сурах хэрэгтэй.' },
        { en: '[The government](s) [should build](v) [more schools](o).', mn: 'Засгийн газар илүү олон сургууль барих ёстой.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Батлах',
      structure: 'Subject + should + base verb',
      examples: [
        { en: '[You](s) [should wear](v) [a coat](o). [It](s)[\'s](v) [cold](o).', mn: 'Чи пальто өмсвөл зүгээр. Хүйтэн байна.' },
        { en: '[He](s) [should apologize](v) [to Saraa](m).', mn: 'Тэр Сараагаас уучлалт гуйх хэрэгтэй.' },
        { en: '[We](s) [should book](v) [the hotel](o) [now](m).', mn: 'Бид зочид буудлаа одоо захиалбал зүгээр.' },
      ],
    },
    {
      label: 'Үгүйсгэх',
      structure: 'Subject + shouldn\'t (should not) + base verb',
      examples: [
        { en: '[You](s) [shouldn\'t worry](v) [so much](m).', mn: 'Чи тийм их санаа зовох хэрэггүй.' },
        { en: '[They](s) [shouldn\'t spend](v) [all their money](o) [on games](m).', mn: 'Тэд бүх мөнгөө тоглоомд зарцуулах хэрэггүй.' },
        { en: '[I](s) [shouldn\'t drink](v) [coffee](o) [at night](m).', mn: 'Би шөнө кофе уух хэрэггүй.' },
      ],
    },
    {
      label: 'Асуух',
      structure: 'Should + subject + base verb? · Wh- + should + subject + base verb?',
      examples: [
        { en: '[Should](v) [I](s) [tell](v) [him](o) [the truth](o)?', mn: 'Би түүнд үнэнийг хэлэх үү?' },
        { en: '[Should](v) [we](s) [wait](v) [for Bat](m)?', mn: 'Бид Батыг хүлээх үү?' },
        { en: '[Where](m) [should](v) [we](s) [go](v) [for lunch](m)?', mn: 'Бид өдрийн хоолондоо хаашаа явбал дээр вэ?' },
      ],
    },
    {
      label: 'Богино хариулт',
      structure: 'Yes, subject + should. · No, subject + shouldn\'t.',
      examples: [
        { en: '[Yes](o), [you](s) [should](v).', mn: 'Тийм ээ, тэгвэл зүгээр.' },
        { en: '[No](o), [we](s) [shouldn\'t](v).', mn: 'Үгүй, тэгэх хэрэггүй.' },
        { en: '[Yes](o), [she](s) [should](v).', mn: 'Тийм ээ, тэр тэгэх хэрэгтэй.' },
      ],
    },
  ],
  signalWords: ['I think', 'I don\'t think', 'What should I do?', 'maybe', 'in my opinion', 'ought to'],
  notes: [
    'should баймж үйл үг тул эзэн бүрд адилхан: I should, she should, they should. -s хэзээ ч нэмэхгүй.',
    'should-ийн араас үйл үгийн үндсэн хэлбэр шууд орно — to орохгүй: «You should go», «You should to go» биш. Мөн -ing орохгүй: «should going» буруу.',
    'Асуулт, үгүйсгэлд do/does хэрэггүй. should өөрөө эзэнтэйгээ байраа сольж асуулт үүсгэнэ: Should I…? Үгүйсгэл: should not → shouldn\'t.',
    'Хүчний зэрэг: must > should. «You must see a doctor» = заавал (эмчид үзүүлэхгүй бол аюултай). «You should see a doctor» = зүйтэй (зөвлөж байна). Зөвлөгөөнд ихэвчлэн should хангалттай, must гэвэл хэт хатуу сонсогдож болно.',
    '«I don\'t think you should…» гэж хэлэх нь «I think you shouldn\'t…»-ээс илүү эелдэг, түгээмэл: «I don\'t think you should buy that car».',
    'ought to нь should-тэй ижил утгатай, гэхдээ to-той: «You ought to rest». Ярианд should-ийг хамаагүй их хэрэглэдэг тул ought to-г таньж мэдэхэд л хангалттай.',
  ],
  commonMistakes: [
    {
      wrong: 'You should to see a doctor.',
      correct: 'You should see a doctor.',
      explanation: 'should-ийн араас to орохгүй. Энэ бол хамгийн түгээмэл алдаа — have to, ought to-гоос болж to нэмэх сэтгэл төрдөг, гэвч should баймж үйл үг тул can шиг «нүцгэн» үйл үг авна.',
    },
    {
      wrong: 'She shoulds study more.',
      correct: 'She should study more.',
      explanation: 'Баймж үйл үгэнд -s нэмэхгүй. Эзэн she байсан ч should хувирахгүй. Дараах үйл үг ч мөн үндсэн хэлбэрээрээ: study, studies биш.',
    },
    {
      wrong: 'Do I should call him?',
      correct: 'Should I call him?',
      explanation: 'should өөрөө асуулт үүсгэнэ, do хэрэггүй. Баймж үйл үг эзэнтэйгээ байраа сольж өгүүлбэрийн эхэнд гарна: Should + I + call.',
    },
    {
      wrong: 'You must buy this book. It\'s interesting.',
      correct: 'You should buy this book. It\'s interesting.',
      explanation: 'Сонирхолтой ном санал болгож байгаа бол зөөлөн зөвлөгөө → should. must гэвэл «заавал ав» гэсэн тушаал шиг сонсогдоно. (Гэхдээ «You must read it!» гэж маш хүчтэй сэтгэгдэлээ хэлж болно.)',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор зөвлөгөөг олон янзаар хэлдэг: «-вал зүгээр» (уувал зүгээр), «… хэрэгтэй» (амрах хэрэгтэй), «… ёстой» (зөвлөгөөний өнгөөр), «-вал дээр» (явбал дээр). Англиар энэ бүгдийг нэг should-оор хэлнэ. Ямар монгол хэлбэрээр ч бодсон, англиар should гэдгийг санаарай.',
      'Монголоор «ёстой» гэдэг үг заавал (must) ба зүйтэй (should) хоёрын аль алинд хэрэглэгддэг тул монгол хүмүүс зөвлөгөөнд must гэж хэт хатуу хэлдэг. Зөвлөгөө өгч байвал should, дүрэм тушаал бол must гэж ялгаж сонго.',
      'Монголоор «-вал зүгээр», «хэрэгтэй» өгүүлбэрийн сүүлд ирдэг: «Чи илүү унтвал зүгээр». Англиар should эзэний яг араас, үйл үгийн өмнө орно: You should sleep more. Дараалал эсрэгээ.',
      'Монголоор «Би яах ёстой вэ?», «Би яах вэ?» гэсэн асуултыг англиар What should I do? гэнэ. Асуултын үг (What) эхэнд, дараа нь should, дараа нь эзэн (I), дараа нь үйл үг (do) гэсэн хатуу дараалалтай — монголоор энэ дараалал огт байдаггүй.',
    ],
  },
  dialogue: [
    {
      en: '[Saraa](s), [I](s) [have](v) [a headache](o) [every morning](m). [What](o) [should](v) [I](s) [do](v)?',
      mn: 'Сараа, өглөө бүр толгой өвддөг. Би яах ёстой вэ?',
      speaker: 'Bat',
    },
    {
      en: '[How many hours](o) [do](v) [you](s) [sleep](v)?',
      mn: 'Чи хэдэн цаг унтдаг вэ?',
      speaker: 'Saraa',
    },
    {
      en: '[About five](o). [I](s) [play](v) [games](o) [on my phone](m) [until 2 a.m.](m)',
      mn: 'Тав орчим. Би шөнийн 2 цаг хүртэл утсаараа тоглоом тоглодог.',
      speaker: 'Bat',
    },
    {
      en: '[That](s)[\'s](v) [the problem](o)! [You](s) [shouldn\'t use](v) [your phone](o) [in bed](m). [You](s) [should sleep](v) [at least seven hours](o).',
      mn: 'Асуудал чинь тэр байна! Чи орондоо утас хэрэглэх хэрэггүй. Чи дор хаяж долоон цаг унтвал зүгээр.',
      speaker: 'Saraa',
    },
    {
      en: '[Should](v) [I](s) [see](v) [a doctor](o) [too](m)?',
      mn: 'Би бас эмчид үзүүлэх үү?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [don\'t think](v) [you](s) [should](v) [yet](m). [Try](v) [sleeping more](o) [first](m). [If](m) [it](s) [doesn\'t help](v), [then](m) [you](s) [should go](v).',
      mn: 'Одоохондоо хэрэггүй гэж би бодож байна. Эхлээд илүү их унтаж үз. Тус болохгүй бол тэгээд очвол зүгээр.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-8-1',
      ruleId: 8,
      kind: 'fill',
      question: 'You look tired. You ___ go to bed early tonight.',
      options: ['should', 'should to', 'shoulds', 'are should'],
      answer: 'should',
      explanation: 'Зөвлөгөө → should + үндсэн үйл үг. «should to» — to орохгүй. «shoulds» — баймж үйл үгэнд -s байхгүй. «are should» — should-ийн өмнө be орохгүй.',
      hint: 'can-тай яг адил дүрэм.',
    },
    {
      id: 'a2-8-2',
      ruleId: 8,
      kind: 'fill',
      question: '___ I take an umbrella? The sky is grey.',
      options: ['Do should', 'Should', 'Am should', 'Should to'],
      answer: 'Should',
      explanation: 'Асуултад should өөрөө эхэнд гарна: Should I take…? do, am зэрэг туслах үйл үг хэрэггүй. «Should to» гэсэн хэлбэр байхгүй.',
      hint: 'Баймж үйл үг өөрөө асуулт үүсгэнэ.',
    },
    {
      id: 'a2-8-3',
      ruleId: 8,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['He shouldn\'t eats fast food.', 'He doesn\'t should eat fast food.', 'He shouldn\'t eat fast food.', 'He shouldn\'t to eat fast food.'],
      answer: 'He shouldn\'t eat fast food.',
      explanation: 'shouldn\'t + үндсэн үйл үг eat. «shouldn\'t eats» — -s болохгүй. «doesn\'t should» — үгүйсгэлд do хэрэггүй. «shouldn\'t to eat» — to орохгүй.',
      hint: 'Үйл үг «нүцгэн» байх ёстой.',
    },
    {
      id: 'a2-8-4',
      ruleId: 8,
      kind: 'translate',
      question: 'Би яах ёстой вэ?',
      options: ['What I should do?', 'What should I do?', 'What do I should?', 'What should I to do?'],
      answer: 'What should I do?',
      explanation: 'Асуултын үг + should + эзэн + үйл үг: What should I do? «What I should do» — should эзэний өмнө гарах ёстой. «What do I should» — do хэрэггүй. «should I to do» — to орохгүй.',
      hint: 'Wh- + should + эзэн + үйл үг.',
    },
  ],
};
