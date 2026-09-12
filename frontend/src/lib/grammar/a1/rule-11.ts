// frontend/src/lib/grammar/a1/rule-11.ts
// A1 дүрэм 11: can / can't
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule11: GrammarRule = {
  id: 11,
  title: 'can / can\'t',
  titleMn: 'can / can\'t — чадвар, боломж, зөвшөөрөл',
  hook: '«Би сэлж чадна», «Энд сууж болох уу?», «Туслаач» — гурвууланг нь англиар нэг үгээр хэлнэ: can.',
  summary: 'can = чадвар, боломж, зөвшөөрөл, хүсэлт, санал. Эзэн хэн ч байсан can хувирахгүй, араас нь үйл үгийн үндсэн хэлбэр орно. Үгүйсгэл нь can\'t (cannot), асуулт нь Can + эзэн + үйл үг?',
  description: 'can бол баймж үйл үг (modal verb). Утга нь олон: чадвар («Би сэлж чадна»), боломж («Энд их хүйтэн байж болно»), зөвшөөрөл («Энд сууж болох уу?»), хүсэлт («Туслаач»), санал («Танд туслах уу?»). Дүрэм нь ганцхан: эзэн хэн ч байсан can өөрчлөгдөхгүй, араас нь үйл үгийн үндсэн хэлбэр (base form) шууд орно — -s ч үгүй, to ч үгүй. Асуулт, үгүйсгэл үүсгэхэд do/does хэрэггүй: can өөрөө өгүүлбэрийн эхэнд гарна, not-той нийлээд can\'t болно. Тиймээс can-ийг сурчихвал таван утгыг нэг дор олж авна.',
  structure: 'Subject + can / can\'t + base verb',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'can / can\'t', part: 'verb' },
    { text: 'base verb', part: 'verb' },
  ],
  tip: 'I / He / She / They can + үйл үг. can-д -s нэмэхгүй, дараах үйл үг to авахгүй: can swim, can go — хоёулаа «нүцгэн».',
  examples: [
    { en: '[I](s) [can swim](v).', mn: 'Би сэлж чадна.' },
    { en: '[She](s) [can speak](v) [English](o).', mn: 'Тэр англиар ярьж чадна.' },
    { en: '[Can](v) [I](s) [come in](v)?', mn: 'Би орж болох уу?' },
    { en: '[He](s) [can\'t drive](v).', mn: 'Тэр машин барьж чадахгүй.' },
  ],
  useCases: [
    {
      title: 'Чадвар',
      description: 'Хэн нэгэн ямар нэг зүйлийг хийж чаддаг, эсвэл чаддаггүйг хэлнэ. Монгол хэлний «-ж чадна / -ж чадахгүй»-тэй яг дүйнэ.',
      examples: [
        { en: '[I](s) [can swim](v).', mn: 'Би сэлж чадна.' },
        { en: '[She](s) [can play](v) [the piano](o).', mn: 'Тэр төгөлдөр хуур тоглож чадна.' },
        { en: '[He](s) [can\'t drive](v).', mn: 'Тэр машин барьж чадахгүй.' },
      ],
    },
    {
      title: 'Боломж',
      description: 'Ямар нэг зүйл заримдаа тохиолддог, ийм байж болохыг хэлнэ. Ихэвчлэн can be хэлбэрээр таарна.',
      examples: [
        { en: '[It](s) [can be](v) [very cold](o) [here](m).', mn: 'Энд маш хүйтэн байж болно.' },
        { en: '[This road](s) [can be](v) [busy](o).', mn: 'Энэ зам түгжрэлтэй байж болно.' },
        { en: '[Accidents](s) [can happen](v).', mn: 'Осол гарч болно.' },
      ],
    },
    {
      title: 'Зөвшөөрөл хүсэх, өгөх',
      description: 'Can I…? гэж зөвшөөрөл хүсэх нь ярианы хэлэнд хамгийн түгээмэл. You can… гэж зөвшөөрөл өгнө, You can\'t… гэж хориглоно.',
      examples: [
        { en: '[Can](v) [I](s) [sit](v) [here](m)?', mn: 'Би энд сууж болох уу?' },
        { en: '[You](s) [can use](v) [my phone](o).', mn: 'Чи миний утсыг хэрэглэж болно.' },
        { en: '[You](s) [can\'t park](v) [here](m).', mn: 'Энд машин тавьж болохгүй.' },
      ],
    },
    {
      title: 'Хүсэлт',
      description: 'Can you…? гэж хэн нэгнээс ямар нэг зүйл хийж өгөхийг хүснэ. Энд чадварыг нь асуугаагүй, эелдэгээр гуйж байгаа хэрэг.',
      examples: [
        { en: '[Can](v) [you](s) [help](v) [me](o)?', mn: 'Надад туслаач?' },
        { en: '[Can](v) [you](s) [open](v) [the window](o)?', mn: 'Цонхоо онгойлгож өгөөч?' },
        { en: '[Can](v) [you](s) [speak](v) [more slowly](m)?', mn: 'Арай удаан ярьж өгөөч?' },
      ],
    },
    {
      title: 'Санал, тусламж',
      description: 'Can I…? хэлбэрээр тусламж санал болгоно. Дэлгүүр, ресторанд «Can I help you?» гэж хамгийн олон сонсоно.',
      examples: [
        { en: '[Can](v) [I](s) [help](v) [you](o)?', mn: 'Танд туслах уу?' },
        { en: '[Can](v) [I](s) [carry](v) [your bag](o)?', mn: 'Цүнхийг тань авч өгөх үү?' },
      ],
    },
  ],
  forms: [
    {
      structure: 'Subject + can + base verb',
      examples: [
        { en: '[I](s) [can swim](v).', mn: 'Би сэлж чадна.' },
        { en: '[She](s) [can drive](v).', mn: 'Тэр машин барьж чадна.' },
        { en: '[They](s) [can come](v).', mn: 'Тэд ирж чадна.' },
      ],
      label: 'Батлах',
    },
    {
      structure: 'Subject + cannot / can\'t + base verb',
      examples: [
        { en: '[I](s) [can\'t swim](v).', mn: 'Би сэлж чадахгүй.' },
        { en: '[He](s) [cannot come](v) [today](m).', mn: 'Тэр өнөөдөр ирж чадахгүй.' },
      ],
      label: 'Үгүйсгэх',
    },
    {
      structure: 'Can + subject + base verb?',
      examples: [
        { en: '[Can](v) [you](s) [swim](v)?', mn: 'Чи сэлж чадах уу?' },
        { en: '[Can](v) [she](s) [come](v)?', mn: 'Тэр ирж чадах уу?' },
        { en: '[Can](v) [I](s) [use](v) [this](o)?', mn: 'Би үүнийг хэрэглэж болох уу?' },
      ],
      label: 'Асуух',
    },
    {
      structure: 'Yes, subject + can. · No, subject + can\'t.',
      examples: [
        { en: '[Yes](o), [I](s) [can](v).', mn: 'Тийм ээ, чадна.' },
        { en: '[No](o), [she](s) [can\'t](v).', mn: 'Үгүй, тэр чадахгүй.' },
      ],
      label: 'Богино хариулт',
    },
  ],
  signalWords: ['Can I…?', 'Can you…?', 'can\'t', 'cannot'],
  notes: [
    'can бол баймж үйл үг. Тиймээс he/she/it дээр ч cans болохгүй — can хэвээрээ үлдэнэ.',
    'can-ийн дараа to хэрэглэхгүй: can swim, can go. «can to swim» гэсэн хэлбэр англиар байхгүй.',
    'Асуулт, үгүйсгэлд do/does хэрэглэхгүй. can өөрөө эхэнд гарна: «Can you swim?». Үгүйсгэлд not залгана: can\'t.',
    'can\'t = cannot. cannot-ыг нэг үгээр бичнэ (can not гэж салгахгүй). Ярианд can\'t, албан бичигт cannot илүү тохирно.',
    '«Can you help me?» гэхэд чадварыг нь асуугаагүй, хүсэлт тавьж байна. Хариултад «Sure», «Of course» гэж хэлбэл хамгийн зөв сонсогдоно.',
    'Нэмэлт: can-д -ing, -ed хэлбэр байхгүй. Өнгөрсөн цагт чадварыг could гэж хэлнэ: «I could swim at five» — Би таван настайдаа сэлж чаддаг байсан.',
  ],
  commonMistakes: [
    {
      wrong: 'She can swims.',
      correct: 'She can swim.',
      explanation: 'Баймж үйл үгийн дараа үйл үг үндсэн хэлбэрээрээ орно. Энгийн одоо цагийн -s-ийг энд мартаарай.',
    },
    {
      wrong: 'He cans drive.',
      correct: 'He can drive.',
      explanation: 'can эзнээс хамаарч хувирахгүй. I can, he can, they can — бүгд адилхан.',
    },
    {
      wrong: 'Do you can swim?',
      correct: 'Can you swim?',
      explanation: 'can өөрөө асуулт үүсгэдэг: эхэнд нь гаргахад л болно. do/does нэмэх шаардлагагүй.',
    },
    {
      wrong: 'I can to swim.',
      correct: 'I can swim.',
      explanation: 'can-ийн дараа to орохгүй. «want to swim» гэдэг ч «can swim» гэдэг.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор чадварыг үйл үгийн АРД залгаж хэлнэ: «сэлж чадна». Англиар can үйл үгийн ӨМНӨ орно: «I can swim». Дарааллыг эргүүлээрэй: can + үйл үг.',
      '«Чадна» монголоор хэнд ч хувирдаггүй шиг can ч хувирахгүй. Гэхдээ энгийн одоо цагийн -s зуршлаараа «he cans», «she can swims» гэж бичих алдаа их гардаг. can-ийн ард үйл үг «нүцгэн» үндсэн хэлбэр.',
      'Асуулт үүсгэхэд монголоор төгсгөлд «уу/үү» нэмдэг: «Чи сэлж чадах уу?». Англиар can-ийг эхэнд шилжүүлнэ: «Can you swim?». do/does нэмэх хэрэггүй.',
      'Монголоор зөвшөөрөл, хүсэлтийг өөр өөр үгээр хэлдэг: «сууж болох уу?», «туслаач». Англиар энэ бүхэн can: «Can I sit here?», «Can you help me?». can-ийг зөвхөн «чадна» гэж бус, «болох уу», «-аач» гэж ч ойлгоорой.',
    ],
  },
  dialogue: [
    { en: '[Can](v) [you](s) [swim](v)?', mn: 'Чи сэлж чадах уу?', speaker: 'Bat' },
    {
      en: '[Yes](o), [I](s) [can](v). [I](s) [can swim](v) [very well](m).',
      mn: 'Тийм ээ, чадна. Би маш сайн сэлж чадна.',
      speaker: 'Saraa',
    },
    {
      en: 'Great! [Can](v) [you](s) [help](v) [me](o)? [I](s) [can\'t swim](v).',
      mn: 'Гоё! Надад туслаач? Би сэлж чадахгүй.',
      speaker: 'Bat',
    },
    {
      en: 'Of course. [We](s) [can go](v) [to the pool](m) [on Saturday](m).',
      mn: 'Мэдээж. Бид бямба гарагт усан сан руу явж болно.',
      speaker: 'Saraa',
    },
    {
      en: '[Can](v) [I](s) [bring](v) [my brother](o)?',
      mn: 'Би дүүгээ дагуулж болох уу?',
      speaker: 'Bat',
    },
    {
      en: 'Sure, [he](s) [can come](v) [too](m).',
      mn: 'Мэдээж, тэр ч бас ирж болно.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: '11-1',
      explanation: 'can-ийн дараа үйл үг үндсэн хэлбэрээрээ орно: can run. runs, running, ran гэсэн хувирсан хэлбэрүүд can-ийн ард орохгүй.',
      ruleId: 11,
      kind: 'fill',
      question: 'I can ___ very fast.',
      options: ['runs', 'running', 'run', 'ran'],
      answer: 'run',
      hint: 'can-ийн ард үйл үг ямар нэг залгавар авах уу?',
    },
    {
      id: '11-2',
      explanation: 'Үгүйсгэлд can + not = can\'t (cannot). do/don\'t хэрэггүй, to орохгүй, not нь can-ийн ард залгана.',
      ruleId: 11,
      kind: 'fill',
      question: 'He ___ come today. He is sick.',
      options: ['can\'t', 'don\'t can', 'cannot to', 'not can'],
      answer: 'can\'t',
      hint: 'Өвчтэй хүн ирж чадахгүй. Үгүйсгэлийг can өөрөө үүсгэнэ.',
    },
    {
      id: '11-3',
      explanation: 'Асуултад can эхэнд гарна, do хэрэггүй. Дараах үйл үг -s ч авахгүй, to ч авахгүй: Can you swim?',
      ruleId: 11,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['Do you can swim?', 'Can you swim?', 'Can you swims?', 'Can you to swim?'],
      answer: 'Can you swim?',
      hint: 'Асуултад do/does хэрэгтэй юу? Үйл үг ямар хэлбэртэй байх вэ?',
    },
    {
      id: '11-4',
      explanation: 'Зөвшөөрөл хүсэхэд Can I + үйл үг? хэлбэр. Үйл үг үндсэн хэлбэрээрээ: sitting, sits биш sit. do хэрэггүй, can эзний өмнө гарна.',
      ruleId: 11,
      kind: 'translate',
      question: 'Би энд сууж болох уу?',
      options: ['Can I sit here?', 'Can I sitting here?', 'Do I can sit here?', 'Can I sits here?'],
      answer: 'Can I sit here?',
      hint: '«Болох уу?» гэж зөвшөөрөл хүсэхэд ямар үгээр эхлэх вэ?',
    },
  ],
};
