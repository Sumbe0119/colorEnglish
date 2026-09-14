// frontend/src/lib/grammar/a2/rule-09.ts
// A2 дүрэм 9: could / might
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const a2Rule09: GrammarRule = {
  id: 9,
  title: 'could / might',
  titleMn: 'could / might — өнгөрсөн чадвар, эелдэг хүсэлт, магадлал',
  hook: '«Таван настайдаа би сэлж чаддаг байсан», «Цонхоо хааж өгөхгүй юу?», «Маргааш бороо орж магадгүй» — гурвууланг нь could, might хоёр хэлж өгнө.',
  summary: 'could = өнгөрсөн цагийн чадвар (чаддаг байсан) болон эелдэг хүсэлт (…-ж өгөхгүй юу?). might / may / could = магадлал (магадгүй … байх). Хоёулаа баймж үйл үг тул эзэн хэн ч байсан хувирахгүй, араас нь үйл үгийн үндсэн хэлбэр орно.',
  description: 'could бол can-ийн өнгөрсөн цагийн хэлбэр. Хэн нэгэн урьд нь ямар нэг зүйлийг хийж чаддаг байсан гэдгийг could, чаддаггүй байсан гэдгийг couldn\'t гэж хэлнэ: When I was five, I could swim. Мөн could-ыг одоо цагт эелдэг хүсэлт хэлэхэд хэрэглэнэ: Could you help me? нь Can you help me?-ээс илүү эелдэг сонсогдоно. might (мөн may, could) бол магадлал заана — ямар нэг зүйл болох эсэхийг сайн мэдэхгүй байхдаа хэлнэ: It might rain. Монголоор «магадгүй … байх», «… байж мэднэ» гэсэн утга. will бол итгэлтэй, баттай ирээдүй, харин might бол ердөө боломж, тиймээс «It will rain» (заавал орно) ба «It might rain» (орж магадгүй) хоёрын ялгаа их. Гурвуулаа баймж үйл үг тул дүрэм нь нэг: эзэн хэн ч байсан хэлбэр солигдохгүй, араас нь to-гүй, -s-гүй үндсэн үйл үг орно, асуулт ба үгүйсгэлд do/does хэрэггүй.',
  structure: 'Subject + could / might (not) + base verb',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'could / might (not)', part: 'verb' },
    { text: 'base verb', part: 'verb' },
  ],
  tip: 'could = «чаддаг байсан» эсвэл «…-ж өгөхгүй юу?»; might = «магадгүй». Хоёулаа can шиг «нүцгэн» — ард нь to ч үгүй, -s ч үгүй: might go, could swim.',
  examples: [
    { en: '[When I was five](m), [I](s) [could swim](v).', mn: 'Таван настайдаа би сэлж чаддаг байсан.' },
    { en: '[Could](v) [you](s) [open](v) [the window](o), [please](m)?', mn: 'Цонхоо онгойлгож өгөхгүй юу?' },
    { en: '[It](s) [might rain](v) [tomorrow](m).', mn: 'Маргааш бороо орж магадгүй.' },
    { en: '[She](s) [might not come](v) [to the party](m).', mn: 'Тэр үдэшлэгт ирэхгүй байж магадгүй.' },
  ],
  useCases: [
    {
      title: 'Өнгөрсөн цагийн чадвар: could / couldn\'t',
      description: 'Урьд нь юу хийж чаддаг байсан, чаддаггүй байсныг хэлнэ. can-ийг өнгөрсөн цагт шилжүүлбэл could болно. Монголоор «-ж чаддаг байсан / чаддаггүй байсан».',
      examples: [
        { en: '[My grandfather](s) [could ride](v) [a horse](o) [at four](m).', mn: 'Миний өвөө дөрвөн настайдаа морь унаж чаддаг байсан.' },
        { en: '[I](s) [couldn\'t read](v) [English](o) [last year](m).', mn: 'Би өнгөрсөн жил англиар уншиж чаддаггүй байсан.' },
        { en: '[Could](v) [you](s) [speak](v) [Russian](o) [as a child](m)?', mn: 'Чи хүүхэд байхдаа оросоор ярьж чаддаг байсан уу?' },
      ],
    },
    {
      title: 'Эелдэг хүсэлт: Could you…? / Could I…?',
      description: 'Хэн нэгнээс ямар нэг зүйл хүсэх, эсвэл өөрөө зөвшөөрөл асуухад Could хэрэглэвэл Can-аас илүү эелдэг, хүндэтгэлтэй болно. Танихгүй хүн, багш, ажлын хамт олонтой ярихад тохиромжтой.',
      examples: [
        { en: '[Could](v) [you](s) [pass](v) [the salt](o), [please](m)?', mn: 'Давсаа өгөөч, болох уу?' },
        { en: '[Could](v) [I](s) [borrow](v) [your pen](o)?', mn: 'Таны үзгийг түр авч болох уу?' },
        { en: '[Could](v) [you](s) [say](v) [that](o) [again](m)?', mn: 'Дахиад нэг хэлж өгөхгүй юу?' },
      ],
    },
    {
      title: 'Магадлал: might / may / could',
      description: 'Ямар нэг зүйл болох эсэхийг баттай мэдэхгүй, харин боломжтой гэж бодож байвал might хэрэглэнэ. may нь might-тай ижил утгатай, арай албан ёсны. could ч мөн энэ утгаар орно: It could be true.',
      examples: [
        { en: '[We](s) [might go](v) [to the countryside](m) [this weekend](m).', mn: 'Бид энэ амралтын өдрүүдэд хөдөө явж магадгүй.' },
        { en: '[He](s) [may be](v) [at the office](m).', mn: 'Тэр оффис дээрээ байж магадгүй.' },
        { en: '[The shop](s) [could be](v) [closed](o) [today](m).', mn: 'Дэлгүүр өнөөдөр хаалттай байж мэднэ.' },
      ],
    },
    {
      title: 'might vs will — магадлал ба итгэл',
      description: 'will бол «заавал болно» гэсэн итгэлтэй ирээдүй, might бол «болох ч юм, болохгүй ч юм» гэсэн эргэлзээ. Хэр итгэлтэй байгаагаа энэ хоёр үгээр л ялгаж хэлнэ.',
      examples: [
        { en: '[I](s) [will call](v) [you](o) [tonight](m).', mn: 'Би орой чам руу залгана (заавал).' },
        { en: '[I](s) [might call](v) [you](o) [tonight](m).', mn: 'Би орой чам руу залгаж магадгүй.' },
        { en: '[They](s) [might not finish](v) [the project](o) [on time](m).', mn: 'Тэд төслөө цагтаа дуусгахгүй байж магадгүй.' },
      ],
    },
  ],
  forms: [
    {
      structure: 'Subject + could / might + base verb',
      examples: [
        { en: '[She](s) [could dance](v) [very well](m) [at school](m).', mn: 'Тэр сургуульд байхдаа маш сайн бүжиглэж чаддаг байсан.' },
        { en: '[The bus](s) [might be](v) [late](o).', mn: 'Автобус хоцорч магадгүй.' },
        { en: '[We](s) [could see](v) [the mountains](o) [from the window](m).', mn: 'Бид цонхоор уулсыг харж чаддаг байсан.' },
      ],
      label: 'Батлах',
    },
    {
      structure: 'Subject + couldn\'t / might not + base verb',
      examples: [
        { en: '[I](s) [couldn\'t sleep](v) [last night](m).', mn: 'Би өчигдөр шөнө унтаж чадаагүй.' },
        { en: '[He](s) [might not like](v) [this film](o).', mn: 'Тэр энэ кинонд дургүй байж магадгүй.' },
        { en: '[They](s) [couldn\'t find](v) [the hotel](o).', mn: 'Тэд зочид буудлыг олж чадаагүй.' },
      ],
      label: 'Үгүйсгэх',
    },
    {
      structure: 'Could + subject + base verb? · (might асуултад ховор)',
      examples: [
        { en: '[Could](v) [you](s) [swim](v) [when you were six](m)?', mn: 'Чи зургаан настайдаа сэлж чаддаг байсан уу?' },
        { en: '[Could](v) [I](s) [use](v) [your phone](o)?', mn: 'Таны утсыг ашиглаж болох уу?' },
        { en: '[Could](v) [we](s) [sit](v) [here](m)?', mn: 'Бид энд сууж болох уу?' },
      ],
      label: 'Асуух',
    },
    {
      structure: 'Yes, subject + could. · No, subject + couldn\'t. · Магадлалд: Maybe. / I\'m not sure.',
      examples: [
        { en: '[Yes](o), [I](s) [could](v).', mn: 'Тийм ээ, чаддаг байсан.' },
        { en: '[No](o), [she](s) [couldn\'t](v).', mn: 'Үгүй, чаддаггүй байсан.' },
        { en: '[Yes](o), [of course](m) [you](s) [can](v).', mn: 'Тийм ээ, мэдээж болно.' },
      ],
      label: 'Богино хариулт',
    },
  ],
  signalWords: ['when I was …', 'as a child', 'last year', 'Could you…?', 'Could I…?', 'maybe', 'perhaps', 'not sure'],
  notes: [
    'could, might, may бол баймж үйл үг: эзэн хэн ч байсан хэлбэр өөрчлөгдөхгүй (he might, she could), ард нь to-гүй, -s-гүй үндсэн үйл үг орно.',
    'Үгүйсгэл: could not → couldn\'t, might not → mightn\'t (ховор, ихэвчлэн might not гэж бүтнээр бичнэ), may not (товчилдоггүй).',
    'Асуулт үүсгэхэд do/does/did хэрэггүй: Could you help me? — could өөрөө эзэнтэйгээ байраа солино.',
    'Магадлал асуухдаа might-ыг ховор хэрэглэнэ. Оронд нь Do you think…? гэж асууна: Do you think it will rain? — Хариуд нь It might.',
    'Эелдэг хүсэлтэд Could you…?-ийн хариулт could биш, can эсвэл sure, of course: «Could you help me?» — «Yes, of course I can.»',
    'Өнгөрсөн цагт нэг удаагийн амжилтыг could-оор хэлдэггүй: «I could pass the exam» биш, «I was able to pass» эсвэл «I passed the exam» гэнэ. could ерөнхий чадварт л хэрэглэнэ.',
  ],
  commonMistakes: [
    {
      wrong: 'She could swam when she was five.',
      correct: 'She could swim when she was five.',
      explanation: 'could өөрөө өнгөрсөн цагийг заачихсан тул араас нь үндсэн үйл үг орно. Баймж үйл үгийн ард үйл үгийг өнгөрсөн цагт хувиргахгүй.',
    },
    {
      wrong: 'It might to rain tomorrow.',
      correct: 'It might rain tomorrow.',
      explanation: 'Баймж үйл үгийн ард to хэзээ ч орохгүй: might rain, could go, may be. Монголоор «-ж магадгүй» гэсэн «-ж» нь to биш.',
    },
    {
      wrong: 'He mights come late.',
      correct: 'He might come late.',
      explanation: 'might-д -s нэмэхгүй. He/She/It байсан ч баймж үйл үг хувирдаггүй.',
    },
    {
      wrong: 'Do you could help me?',
      correct: 'Could you help me?',
      explanation: 'could баймж үйл үг тул асуултад do хэрэггүй. could өөрөө эзэний өмнө гарч асуулт үүсгэнэ.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «чаддаг байсан» гэхэд үйл үг + «-даг байсан» гэж хоёр үг зэрэг хувирна. Англиар харин could нэг үг л өнгөрсөн цагийг заана, үйл үг өөрөө хэвээр үлдэнэ: I could swim.',
      'Монголоор «магадгүй» гэдэг үг өгүүлбэрийн эхэнд эсвэл төгсгөлд тусдаа орно: «Магадгүй бороо орно». Англиар might үйл үгийн өмнө, эзэний ард орж, үйл үгтэйгээ нэг блок болно: It might rain.',
      'Монголоор «…-ж өгөхгүй юу?», «…-ж болох уу?» гэж эелдэг байдлыг үйл үгийн төгсгөлөөр илэрхийлдэг. Англиар can-ийг could болгож солиход л эелдэг болно: Can you → Could you.',
      'Монголоор «орно» (will) ба «орж магадгүй» (might) хоёрын ялгаа төгсгөлөөр гардаг. Англиар ялгаа нь will / might гэсэн үгээр гарна — үйл үг rain хоёуланд нь адилхан.',
    ],
  },
  dialogue: [
    {
      en: '[Could](v) [you](s) [help](v) [me](o) [with this box](m), [please](m)?',
      mn: 'Энэ хайрцгийг зөөхөд надад туслаж өгөхгүй юу?',
      speaker: 'Bat',
    },
    {
      en: '[Sure](o). [Where](m) [are](v) [you](s) [taking](v) [it](o)?',
      mn: 'Мэдээж. Чи үүнийг хаашаа аваачих гэж байгаа юм бэ?',
      speaker: 'Saraa',
    },
    {
      en: '[To my car](m). [I](s) [might move](v) [to a new flat](m) [next month](m).',
      mn: 'Машин руугаа. Би дараа сард шинэ байр руу нүүж магадгүй.',
      speaker: 'Bat',
    },
    {
      en: '[Really](m)? [When I was a child](m), [I](s) [could carry](v) [heavy boxes](o) [easily](m). [Not now](m)!',
      mn: 'Үнэхээр үү? Би хүүхэд байхдаа хүнд хайрцгуудыг амархан өргөж чаддаг байсан. Одоо чадахгүй!',
      speaker: 'Saraa',
    },
    {
      en: '[It](s) [might rain](v) [soon](m). [Could](v) [we](s) [hurry](v)?',
      mn: 'Удахгүй бороо орж магадгүй. Бид яарч болох уу?',
      speaker: 'Bat',
    },
    {
      en: '[Yes](o), [of course](m). [My brother](s) [might come](v) [and help](v) [too](m).',
      mn: 'Тийм ээ, мэдээж. Миний ах ч бас ирж туслах байх.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'a2-9-1',
      explanation: 'Өнгөрсөн цагийн чадварыг could + үндсэн үйл үгээр хэлнэ. can одоо цаг, «could to» хэзээ ч болохгүй, «could ran» — баймж үйл үгийн ард үйл үг хувирахгүй.',
      ruleId: 9,
      kind: 'fill',
      question: 'When my father was young, he ___ very fast.',
      options: ['can run', 'could run', 'could to run', 'could ran'],
      answer: 'could run',
      hint: 'Өнгөрсөн цаг + баймж үйл үгийн ард үндсэн хэлбэр.',
    },
    {
      id: 'a2-9-2',
      explanation: 'Магадлалыг might + үндсэн үйл үгээр хэлнэ. «might to be» — to хэрэггүй, «mights» — -s нэмэхгүй, «might is» — баймж үйл үгийн ард is биш be орно.',
      ruleId: 9,
      kind: 'fill',
      question: 'Saraa isn\'t here. She ___ at the library.',
      options: ['might to be', 'mights be', 'might be', 'might is'],
      answer: 'might be',
      hint: 'Баттай мэдэхгүй байна — магадлал.',
    },
    {
      id: 'a2-9-3',
      explanation: 'Эелдэг хүсэлтэд Could + эзэн + үндсэн үйл үг. do/does хэрэггүй, could-ын ард to орохгүй, «You could close» бол асуулт биш.',
      ruleId: 9,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['Do you could close the door?', 'Could you to close the door?', 'You could close the door?', 'Could you close the door, please?'],
      answer: 'Could you close the door, please?',
      hint: 'Баймж үйл үг өөрөө эзэний өмнө гарна.',
    },
    {
      id: 'a2-9-4',
      explanation: '«Магадгүй» = might, «ирэхгүй» = not come. «will not» бол баттай ирэхгүй гэсэн утга, «might not comes» — -s алдаа, «might doesn\'t come» — баймж үйл үгтэй doesn\'t хэрэглэхгүй.',
      ruleId: 9,
      kind: 'translate',
      question: 'Тэр маргааш ирэхгүй байж магадгүй.',
      options: ['He will not come tomorrow.', 'He might not come tomorrow.', 'He might not comes tomorrow.', 'He might doesn\'t come tomorrow.'],
      answer: 'He might not come tomorrow.',
      hint: 'Баттай биш, зүгээр л боломж.',
    },
  ],
};
