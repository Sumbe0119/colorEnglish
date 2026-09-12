// frontend/src/lib/grammar/a1/rule-07.ts
// A1 дүрэм 7: don't / doesn't
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule07: GrammarRule = {
  id: 7,
  title: 'don\'t / doesn\'t',
  titleMn: 'Үгүйсгэх — don\'t / doesn\'t',
  hook: 'Хийдэггүй, дургүй, мэдэхгүй, байхгүй — энэ бүхнийг англиар яаж хэлэх вэ?',
  summary: 'Энгийн одоо цагт үйл үгийг don\'t / doesn\'t гэсэн үгээр үгүйсгэнэ. I/You/We/They-тэй don\'t, He/She/It-тэй doesn\'t. Дараа нь үйл үг үргэлж үндсэн хэлбэрээрээ, -s-гүй.',
  description: 'Монголоор «иддэггүй», «мэдэхгүй», «байхгүй» гэж үйл үгийн сүүлд залгаж үгүйсгэдэг. Англиар үүнийг тусдаа үгээр, үйл үгийн ӨМНӨ хийнэ: don\'t (do not) эсвэл doesn\'t (does not). Энэ хоёр бол энгийн одоо цагийн (Present Simple) үгүйсгэх хэлбэр. Сонголт нь зөвхөн эзнээс хамаарна: I/You/We/They-тэй don\'t, He/She/It-тэй doesn\'t. Хамгийн чухал нь don\'t/doesn\'t-ийн дараа үндсэн үйл үг үндсэн хэлбэрээрээ (base form) үлдэнэ: «She likes» гэдэг ч «She doesn\'t like», хэзээ ч «doesn\'t likes» биш. -s аль хэдийн does дотор орчихсон гэж бодоорой.',
  structure: 'Subject + don\'t / doesn\'t + base verb',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'don\'t / doesn\'t', part: 'verb' },
    { text: 'base verb', part: 'verb' },
  ],
  tip: 'doesn\'t-ийн дараа үйл үг -s авахгүй: doesn\'t like, doesn\'t go, doesn\'t have. -s нь does руу «нүүчихсэн», нэг өгүүлбэрт хоёр -s байхгүй.',
  examples: [
    { en: '[I](s) [don\'t like](v) [coffee](o).', mn: 'Би кофенд дургүй.' },
    { en: '[She](s) [doesn\'t play](v) [tennis](o).', mn: 'Тэр теннис тоглодоггүй.' },
    { en: '[They](s) [don\'t live](v) [here](m).', mn: 'Тэд энд амьдардаггүй.' },
    { en: '[My phone](s) [doesn\'t work](v).', mn: 'Миний утас ажиллахгүй байна.' },
  ],
  useCases: [
    {
      title: 'Зуршил, тогтмол үйлдлийг үгүйсгэх',
      description: 'Ер нь хийдэггүй зүйлээ хэлнэ. Монголоор «-даггүй/-дэггүй» гэсэн газар бүрт don\'t/doesn\'t орно: үздэггүй, ажилладаггүй, иддэггүй.',
      examples: [
        { en: '[I](s) [don\'t watch](v) [TV](o).', mn: 'Би зурагт үздэггүй.' },
        { en: '[He](s) [doesn\'t work](v) [on Sundays](m).', mn: 'Тэр ням гарагт ажилладаггүй.' },
        { en: '[They](s) [don\'t eat](v) [meat](o).', mn: 'Тэд мах иддэггүй.' },
      ],
    },
    {
      title: 'Дургүй, хүсэхгүй, мэдэхгүй гэж хэлэх',
      description: 'like, want, know, understand, remember зэрэг бодол, мэдрэмж заасан үйл үгтэй хэрэглэнэ. Монголоор «дургүй», «мэдэхгүй» гэдэг нь англиар don\'t/doesn\'t + үйл үг болно.',
      examples: [
        { en: '[She](s) [doesn\'t like](v) [tea](o).', mn: 'Тэр цайнд дургүй.' },
        { en: '[I](s) [don\'t know](v) [the answer](o).', mn: 'Би хариултыг мэдэхгүй.' },
        { en: '[We](s) [don\'t understand](v).', mn: 'Бид ойлгохгүй байна.' },
      ],
    },
    {
      title: 'Эзэмшлийг үгүйсгэх — don\'t / doesn\'t have',
      description: '«Надад … байхгүй» гэдгийг англиар I don\'t have … гэж хэлнэ. Эзэн нь хүн өөрөө, үйл үг нь have. doesn\'t-ийн дараа has биш, have.',
      examples: [
        { en: '[I](s) [don\'t have](v) [a car](o).', mn: 'Надад машин байхгүй.' },
        { en: '[He](s) [doesn\'t have](v) [a phone](o).', mn: 'Түүнд утас байхгүй.' },
        { en: '[They](s) [don\'t have](v) [children](o).', mn: 'Тэд хүүхэдгүй.' },
      ],
    },
  ],
  forms: [
    {
      structure: 'Subject + don\'t + base verb',
      examples: [
        { en: '[I](s) [don\'t smoke](v).', mn: 'Би тамхи татдаггүй.' },
        { en: '[We](s) [don\'t live](v) [here](m).', mn: 'Бид энд амьдардаггүй.' },
        { en: '[They](s) [don\'t agree](v).', mn: 'Тэд зөвшөөрөхгүй байна.' },
      ],
      label: 'I / You / We / They',
    },
    {
      structure: 'Subject + doesn\'t + base verb',
      examples: [
        { en: '[He](s) [doesn\'t drive](v).', mn: 'Тэр машин жолооддоггүй.' },
        { en: '[She](s) [doesn\'t work](v) [here](m).', mn: 'Тэр энд ажилладаггүй.' },
        { en: '[It](s) [doesn\'t open](v).', mn: 'Энэ нээгдэхгүй байна.' },
      ],
      label: 'He / She / It',
    },
    {
      structure: 'Subject + do not / does not + base verb',
      examples: [
        { en: '[I](s) [do not understand](v).', mn: 'Би ойлгохгүй байна.' },
        { en: '[She](s) [does not eat](v) [meat](o).', mn: 'Тэр мах иддэггүй.' },
      ],
      label: 'Бүтэн хэлбэр',
    },
  ],
  notes: [
    'don\'t = do not, doesn\'t = does not. Ярианд товчилсон хэлбэр (don\'t/doesn\'t) түгээмэл. Бүтэн хэлбэрийг албан бичигт, эсвэл «Би үнэхээр мэдэхгүй!» гэж онцлоход хэрэглэнэ.',
    'doesn\'t орсон үед үндсэн үйл үг үндсэн хэлбэрээрээ байна: goes → go, likes → like, has → have. «She doesn\'t have a dog», «She doesn\'t has» биш.',
    'be үйл үгийг (am/is/are) don\'t/doesn\'t-ээр үгүйсгэдэггүй. be өөрөө not авна: «She isn\'t tired.», «I am not a doctor.»',
    'can-ыг ч don\'t/doesn\'t-ээр үгүйсгэдэггүй: «He can\'t swim.» гэж хэлнэ, «He doesn\'t can swim» биш.',
    'Богино хариултад ч энэ хоёр үг ажиллана: «Do you like tea?» — «No, I don\'t.», «Does she work?» — «No, she doesn\'t.»',
    'Нэмэлт: захирах өгүүлбэрийг ч Don\'t-оор үгүйсгэнэ, эзэнгүй: «Don\'t worry.», «Don\'t touch it.»',
  ],
  commonMistakes: [
    {
      wrong: 'She doesn\'t likes coffee.',
      correct: 'She doesn\'t like coffee.',
      explanation: 'doesn\'t аль хэдийн he/she/it-ийг заасан. -s нэг өгүүлбэрт хоёр удаа орохгүй, тиймээс doesn\'t-ийн дараа үйл үг үндсэн хэлбэрээрээ: like.',
    },
    {
      wrong: 'He don\'t work here.',
      correct: 'He doesn\'t work here.',
      explanation: 'He/She/It-тэй үргэлж doesn\'t. don\'t нь зөвхөн I/You/We/They-д таарна.',
    },
    {
      wrong: 'I don\'t am tired.',
      correct: 'I am not tired.',
      explanation: 'be үйл үгэнд (am/is/are) туслах үйл үг хэрэггүй, өөрөө not авна. don\'t/doesn\'t зөвхөн энгийн үйл үгтэй (like, go, have …) явна.',
    },
    {
      wrong: 'She doesn\'t has a car.',
      correct: 'She doesn\'t have a car.',
      explanation: 'has нь зөвхөн батлах өгүүлбэрт: «She has a car.» Үгүйсгэлд doesn\'t гарч ирмэгц has буцаад have болно.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор үгүйсгэлийг үйл үгийн СҮҮЛД залгана: ид-дэггүй, мэдэх-гүй. Англиар харин тусдаа үг үйл үгийн ӨМНӨ орно: don\'t eat, don\'t know. Монголд ийм туслах үйл үг байхгүй учраас «I eat not» гэж дараалал андуурах нь элбэг.',
      'Монголоор «Би иддэггүй», «Тэр иддэггүй» — үйл үг эзнээр өөрчлөгддөггүй. Англиар эзнээ хараад don\'t эсвэл doesn\'t-ийг сонгох ёстой. «He don\'t» гэдэг алдаа яг эндээс гардаг.',
      '«Надад машин байхгүй» гэхэд монголоор эзэн нь «надад», үйл үг нь «байхгүй». Англиар эзэн нь I, үйл үг нь have: «I don\'t have a car.» «I no car», «Me no have car» гэж орчуулж болохгүй.',
      'Монгол хэлний «биш» ба «-гүй» хоёр англиар өөр өөр: «Би оюутан биш» → I am not (be-тэй), «Би явдаггүй» → I don\'t go (үйл үгтэй). Өгүүлбэрт be байвал not, энгийн үйл үг байвал don\'t/doesn\'t.',
    ],
  },
  dialogue: [
    { en: '[Do](v) [you](s) [want](v) [some coffee](o)?', mn: 'Чи кофе уух уу?', speaker: 'Dorj' },
    {
      en: '[No](o), thanks. [I](s) [don\'t drink](v) [coffee](o). [I](s) [don\'t like](v) [it](o).',
      mn: 'Үгүй ээ, баярлалаа. Би кофе уудаггүй. Надад таалагддаггүй.',
      speaker: 'Oyuna',
    },
    {
      en: '[Really](m)? [My brother](s) [doesn\'t drink](v) [coffee](o). [He](s) [drinks](v) [tea](o).',
      mn: 'Тийм үү? Ах маань ч кофе уудаггүй. Тэр цай уудаг.',
      speaker: 'Dorj',
    },
    {
      en: '[Does](v) [he](s) [drink](v) [milk tea](o)?',
      mn: 'Тэр сүүтэй цай уудаг уу?',
      speaker: 'Oyuna',
    },
    {
      en: '[No](o), [he](s) [doesn\'t](v). [He](s) [doesn\'t like](v) [milk](o).',
      mn: 'Үгүй. Тэр сүүнд дургүй.',
      speaker: 'Dorj',
    },
    {
      en: '[I](s) [don\'t understand](v) [him](o)! [Milk tea](s) [is](v) [the best](o).',
      mn: 'Би түүнийг ойлгохгүй байна! Сүүтэй цай хамгийн сайхан шүү дээ.',
      speaker: 'Oyuna',
    },
  ],
  quiz: [
    {
      id: '7-1',
      explanation: 'doesn\'t орсон үед дараагийн үйл үг үндсэн хэлбэрээрээ байна: like. likes-д -s давхардсан, liked нь өнгөрсөн цаг, liking нь -ing хэлбэр — doesn\'t-тэй хамт орохгүй.',
      ruleId: 7,
      kind: 'fill',
      question: 'She doesn\'t ___ coffee.',
      options: ['likes', 'like', 'liked', 'liking'],
      answer: 'like',
      hint: '-s аль хэдийн doesn\'t дотор байна. Дахин хэрэгтэй юу?',
    },
    {
      id: '7-2',
      explanation: 'My parents = they, олон тоо тул don\'t. doesn\'t нь зөвхөн he/she/it-д. Ганц not-оор үйл үг үгүйсгэхгүй. aren\'t бол be-ийн хэлбэр, live гэсэн энгийн үйл үгтэй хамт орохгүй.',
      ruleId: 7,
      kind: 'fill',
      question: 'My parents ___ live in Ulaanbaatar.',
      options: ['don\'t', 'doesn\'t', 'not', 'aren\'t'],
      answer: 'don\'t',
      hint: 'My parents-ийг ямар төлөөний үгээр сольж болох вэ?',
    },
    {
      id: '7-3',
      explanation: 'He-тэй doesn\'t, дараа нь have үндсэн хэлбэрээрээ. don\'t нь he-д таарахгүй, doesn\'t has-д -s давхардсан, «He not have»-д туслах үйл үг алга.',
      ruleId: 7,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'He doesn\'t have a car.',
        'He don\'t have a car.',
        'He doesn\'t has a car.',
        'He not have a car.',
      ],
      answer: 'He doesn\'t have a car.',
      hint: 'Эзэн нь he. Үгүйсгэлд has хэвээр үлдэх үү?',
    },
    {
      id: '7-4',
      explanation: '«-даггүй» = doesn\'t + үндсэн хэлбэр. don\'t нь she-д буруу, speaks-д -s давхардсан, isn\'t нь be-ийн хэлбэр — энгийн үйл үг speak-ийг isn\'t-ээр үгүйсгэхгүй.',
      ruleId: 7,
      kind: 'translate',
      question: 'Тэр англиар ярьдаггүй.',
      options: [
        'She doesn\'t speak English.',
        'She don\'t speak English.',
        'She doesn\'t speaks English.',
        'She isn\'t speak English.',
      ],
      answer: 'She doesn\'t speak English.',
      hint: '«Ярьдаггүй» гэдэгт be байна уу, энгийн үйл үг байна уу?',
    },
  ],
};
