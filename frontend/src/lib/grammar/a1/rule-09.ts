// frontend/src/lib/grammar/a1/rule-09.ts
// A1 дүрэм 9: have / has
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule09: GrammarRule = {
  id: 9,
  title: 'have / has',
  titleMn: 'have / has — …-тай байх, эзэмших',
  hook: 'Юутай вэ? Хэнтэй вэ? Юу өвдөж байна? Энэ бүхнийг ганцхан үйл үг have хэлнэ.',
  summary: 'have / has нь «…-тай байх», эзэмшихээс гадна гэр бүл, гадаад шинж, өвчин зовиур, хоол идэх зэрэг олон хэллэгт орно. I/You/We/They + have, He/She/It + has; do/does-ийн дараа үргэлж have.',
  description: 'have / has бол англи хэлний хамгийн их хэрэглэгддэг үйл үгийн нэг. Үндсэн утга нь «…-тай байх», эзэмших: «I have a phone.» Гэхдээ энэ үйл үг үүгээр зогсдоггүй. Гэр бүл, найз нөхөд (I have two brothers), гадаад шинж (She has blue eyes), өвчин зовиур (I have a cold), хоол идэх, шүршүүрт орох гэх мэт өдөр тутмын тогтсон хэллэгт бүгдэд нь have орно. Дүрэм нь ганцхан: I/You/We/They дээр have, He/She/It дээр has. Харин do/does, don\'t/doesn\'t орвол has алга болж, дахиад have болно.',
  structure: 'I/You/We/They + have · He/She/It + has',
  structureParts: [
    { text: 'I/You/We/They', part: 'subject' },
    { text: 'have', part: 'verb' },
    { text: '·', part: 'plain' },
    { text: 'He/She/It', part: 'subject' },
    { text: 'has', part: 'verb' },
  ],
  tip: 'He / She / It → has. Харин do/does, don\'t/doesn\'t гарч ирмэгц has «нуугдаад» дахин have болно: She has → Does she have? · She doesn\'t have.',
  examples: [
    { en: '[I](s) [have](v) [a bicycle](o).', mn: 'Би унадаг дугуйтай.' },
    { en: '[She](s) [has](v) [a cat](o).', mn: 'Тэр мууртай.' },
    { en: '[We](s) [have](v) [breakfast](o) [at 8](m).', mn: 'Бид 8 цагт өглөөний цай уудаг.' },
    { en: '[They](s) [have](v) [two children](o).', mn: 'Тэд хоёр хүүхэдтэй.' },
  ],
  useCases: [
    {
      title: 'Эзэмшил',
      description: 'Ямар нэг зүйлтэй байгаагаа хэлнэ. Монголоор «-тай/-тэй» гэж хэлдэг бүх зүйл энд орно: утастай, цүнхтэй, машинтай.',
      examples: [
        { en: '[I](s) [have](v) [a phone](o).', mn: 'Би утастай.' },
        { en: '[She](s) [has](v) [a new bag](o).', mn: 'Тэр шинэ цүнхтэй.' },
        { en: '[They](s) [have](v) [a car](o).', mn: 'Тэд машинтай.' },
      ],
    },
    {
      title: 'Гэр бүл, харилцаа',
      description: 'Ах, эгч, хүүхэд, найз зэрэг хэн нэгэнтэй холбоотой байгаагаа хэлнэ. Тооны дараа нэр үг олон тоонд орохыг анхаараарай: two brothers.',
      examples: [
        { en: '[I](s) [have](v) [two brothers](o).', mn: 'Би хоёр ахтай.' },
        { en: '[He](s) [has](v) [three children](o).', mn: 'Тэр гурван хүүхэдтэй.' },
        { en: '[We](s) [have](v) [many friends](o).', mn: 'Бид олон найзтай.' },
      ],
    },
    {
      title: 'Шинж, хэсэг',
      description: 'Хүн, амьтан, юм ямар хэсэг, ямар шинжтэйг хэлнэ. Нүдний өнгө, өрөөний тоо, чихний хэлбэр — бүгд have/has.',
      examples: [
        { en: '[She](s) [has](v) [blue eyes](o).', mn: 'Тэр цэнхэр нүдтэй.' },
        {
          en: '[The house](s) [has](v) [three bedrooms](o).',
          mn: 'Байшин гурван унтлагын өрөөтэй.',
        },
        { en: '[The dog](s) [has](v) [long ears](o).', mn: 'Нохой урт чихтэй.' },
      ],
    },
    {
      title: 'Өвчин, зовиур',
      description: 'Нийтлэг зовиурыг have + нэр үг хэлбэрээр хэлнэ. Монголоор «толгой өвдөж байна» гэдэг бол англиар «толгойн өвчинтэй» гэсэн бүтэц.',
      examples: [
        { en: '[I](s) [have](v) [a headache](o).', mn: 'Миний толгой өвдөж байна.' },
        { en: '[She](s) [has](v) [a cold](o).', mn: 'Тэр ханиад хүрсэн байна.' },
        { en: '[He](s) [has](v) [a toothache](o).', mn: 'Түүний шүд өвдөж байна.' },
      ],
    },
    {
      title: 'Тогтсон үйлдлийн хэллэг',
      description: 'have breakfast / lunch / dinner, have a shower, have a rest, have fun гэх мэт. Энд have нь эзэмших биш, «хийх» гэсэн утгатай.',
      examples: [
        { en: '[We](s) [have](v) [lunch](o) [at noon](m).', mn: 'Бид үд дунд өдрийн хоол иддэг.' },
        {
          en: '[I](s) [have](v) [a shower](o) [every morning](m).',
          mn: 'Би өглөө бүр шүршүүрт ордог.',
        },
        { en: '[Have](v) [fun](o)!', mn: 'Сайхан өнгөрүүлээрэй!' },
      ],
    },
  ],
  forms: [
    {
      structure: 'I/You/We/They + have · He/She/It + has',
      examples: [
        { en: '[I](s) [have](v) [a bike](o).', mn: 'Би дугуйтай.' },
        { en: '[She](s) [has](v) [a bike](o).', mn: 'Тэр дугуйтай.' },
        { en: '[My parents](s) [have](v) [a big house](o).', mn: 'Аав ээж маань том байшинтай.' },
      ],
      label: 'Батлах',
    },
    {
      structure: 'Subject + don\'t / doesn\'t + have',
      examples: [
        { en: '[I](s) [don\'t have](v) [a car](o).', mn: 'Би машингүй.' },
        { en: '[He](s) [doesn\'t have](v) [a car](o).', mn: 'Тэр машингүй.' },
        { en: '[We](s) [don\'t have](v) [time](o).', mn: 'Бидэнд цаг алга.' },
      ],
      label: 'Үгүйсгэх',
    },
    {
      structure: 'Do / Does + subject + have …?',
      examples: [
        { en: '[Do](v) [you](s) [have](v) [a pen](o)?', mn: 'Танд үзэг байна уу?' },
        { en: '[Does](v) [she](s) [have](v) [a sister](o)?', mn: 'Тэр эгчтэй юу?' },
        { en: '[What](m) [do](v) [you](s) [have](v) [in your bag](m)?', mn: 'Цүнхэндээ юутай вэ?' },
      ],
      label: 'Асуух',
    },
    {
      structure: 'Yes, I/you/we/they do. · Yes, he/she/it does. · No, … don\'t / doesn\'t.',
      examples: [
        { en: '[Yes](o), [I](s) [do](v).', mn: 'Тийм ээ, (байгаа).' },
        { en: '[No](o), [she](s) [doesn\'t](v).', mn: 'Үгүй, (байхгүй).' },
      ],
      label: 'Богино хариулт',
    },
  ],
  notes: [
    'has нь зөвхөн энгийн одоо цагийн he/she/it батлах өгүүлбэрт орно: She has, He has, It has, My mother has. Бусад бүх эзэн have авна.',
    'Үгүйсгэх, асуух хэлбэрт does/doesn\'t гуравдугаар биеийг аль хэдийн заасан тул has биш have: «Does she have a cat?», «She doesn\'t have a cat.» «Does she has…?» гэж хэлэхгүй.',
    'Нэмэлт: Британийн англи хэлэнд эзэмшил заахад have got / has got маш түгээмэл: «I\'ve got a car.» = «I have a car.», «She\'s got a cat.» = «She has a cat.»',
    'have олон тогтсон хэллэгт ордог тул үргэлж «байх / эзэмших» гэж шууд орчуулж болохгүй: have breakfast = өглөөний цай уух, have a shower = шүршүүрт орох, have fun = сайхан өнгөрүүлэх.',
    'Эзэмшил, харилцаа, зовиур хэлэхэд be (am/is/are) огт хэрэггүй. «I have a headache.» гэнэ, «I am have» гэхгүй. Эзний дараа шууд have/has тавина.',
    'Эзэмших утгаараа have бол төлөв заасан үйл үг тул -ing хэлбэрт ордоггүй: «I am having a car» буруу. Харин have lunch, have a shower гэх үйлдлийг «I\'m having lunch.» гэж болно.',
  ],
  commonMistakes: [
    {
      wrong: 'She have a cat.',
      correct: 'She has a cat.',
      explanation: 'She бол гуравдугаар биеийн ганц тоо. Батлах өгүүлбэрт he/she/it заавал has авна; have нь I/You/We/They-д л таарна.',
    },
    {
      wrong: 'Does he has a car?',
      correct: 'Does he have a car?',
      explanation: 'Does аль хэдийн he-г заасан. Гуравдугаар биеийн тэмдэг нэг өгүүлбэрт хоёр удаа орохгүй, тиймээс does-ийн дараа үйл үгийн үндсэн хэлбэр have.',
    },
    {
      wrong: 'I am have a headache.',
      correct: 'I have a headache.',
      explanation: 'Монголоор «өвдөж байна» гэхэд байгаа «байна» англиар am болдоггүй. Эзэмшил, зовиурт be хэрэггүй: эзэн + have + нэр үг.',
    },
    {
      wrong: 'I have two brother.',
      correct: 'I have two brothers.',
      explanation: 'Монголоор «хоёр ах» гэж ганц тоогоор хэлдэг ч англиар тооны дараа нэр үг олон тоонд орно: two brothers, three children.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монгол хэлэнд have гэсэн тусдаа үйл үг байхгүй. Эзэмшлийг «-тай/-тэй/-той» залгавар (Би машинтай) эсвэл «Надад машин бий» гэж хэлдэг. Англиар заавал эзэн + have + тусагдахуун: «I have a car.» «Надад» гэдгээс болж «To me a car» гэж орчуулж болохгүй.',
      'Монголоор «Надад муур бий», «Түүнд муур бий» — эзэн солигдсон ч «бий» өөрчлөгдөхгүй. Англиар эзэн солигдоход have → has болно: I have, she has. Энэ өөрчлөлт монголд байхгүй учраас «She have» гэх алдаа хамгийн их гардаг.',
      'Монголоор «Би машинтай» — ялгац гишүүн байхгүй, тооны дараа нэр үг ганц тоогоор: «хоёр ах». Англиар ганц тоологдох зүйлд a/an заавал (I have a car), тооны дараа олон тоо (two brothers).',
      'Монголоор «Толгой өвдөж байна» — эзэн нь толгой, үйл үг нь өвдөх. Англиар эзэн нь хүн, зовиур нь нэр үг: «I have a headache.» «Байна» гэдгээс болж am/is нэмэх хэрэггүй. «Ханиад хүрсэн» = have a cold.',
    ],
  },
  dialogue: [
    {
      en: '[Do](v) [you](s) [have](v) [a pet](o)?',
      mn: 'Чи гэрийн тэжээвэр амьтантай юу?',
      speaker: 'Tuya',
    },
    {
      en: '[Yes](o), [I](s) [do](v). [I](s) [have](v) [a dog](o). [His name](s) [is](v) [Bankhar](o).',
      mn: 'Тийм ээ. Би нохойтой. Нэрийг нь Банхар гэдэг.',
      speaker: 'Naran',
    },
    {
      en: '[Does](v) [your sister](s) [have](v) [a pet](o) [too](m)?',
      mn: 'Эгч чинь бас амьтантай юу?',
      speaker: 'Tuya',
    },
    {
      en: '[No](o), [she](s) [doesn\'t](v). [She](s) [has](v) [a small flat](o).',
      mn: 'Үгүй. Тэр жижигхэн байртай.',
      speaker: 'Naran',
    },
    {
      en: '[I](s) [have](v) [two cats](o). [Come](v) and [see](v) [them](o)!',
      mn: 'Би хоёр мууртай. Ирж хараарай!',
      speaker: 'Tuya',
    },
    {
      en: '[Great](o)! [I](s) [have](v) [time](o) [after school](m).',
      mn: 'Тэгье! Хичээлийн дараа би завтай.',
      speaker: 'Naran',
    },
  ],
  quiz: [
    {
      id: '9-1',
      explanation: 'Emma = she, гуравдугаар биеийн ганц тоо тул has. have нь I/You/We/They-д таарна, haves гэдэг үг байхгүй, having-д be дутуу бөгөөд эзэмшлийг -ing-ээр хэлдэггүй.',
      ruleId: 9,
      kind: 'fill',
      question: 'Emma ___ a new phone.',
      options: ['have', 'has', 'having', 'haves'],
      answer: 'has',
      hint: 'Emma-г ямар төлөөний үгээр сольж болох вэ? Тэр төлөөний үг ямар хэлбэр авдаг вэ?',
    },
    {
      id: '9-2',
      explanation: 'He-тэй үгүйсгэлд doesn\'t, дараа нь үндсэн хэлбэр have. don\'t нь he-д таарахгүй, doesn\'t has-д гуравдугаар биеийн тэмдэг давхардсан, not have-д туслах үйл үг алга.',
      ruleId: 9,
      kind: 'fill',
      question: 'He ___ a bike, so he walks to school.',
      options: ['doesn\'t have', 'don\'t have', 'doesn\'t has', 'not have'],
      answer: 'doesn\'t have',
      hint: 'doesn\'t-ийн дараа has байж болох уу?',
    },
    {
      id: '9-3',
      explanation: 'She-тэй асуултад does эхэнд, дараа нь have. Does she has-д has давхардсан, Do she буруу туслах үйл үг, «She have a sister?»-т do/does алга, has ч биш.',
      ruleId: 9,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Does she have a sister?',
        'Does she has a sister?',
        'Do she have a sister?',
        'She have a sister?',
      ],
      answer: 'Does she have a sister?',
      hint: 'Асуулт does-оор эхэлбэл үндсэн үйл үг ямар хэлбэртэй байх вэ?',
    },
    {
      id: '9-4',
      explanation: 'Англиар зовиурыг эзэн + have + нэр үг гэж хэлнэ. am have-д be илүү, I has буруу хэлбэр, «My head is a headache» гэж англиар хэлдэггүй.',
      ruleId: 9,
      kind: 'translate',
      question: 'Миний толгой өвдөж байна.',
      options: ['I have a headache.', 'I am have a headache.', 'I has a headache.', 'My head is a headache.'],
      answer: 'I have a headache.',
      hint: 'Англиар эзэн нь толгой биш, хүн өөрөө байна. be хэрэггүй.',
    },
  ],
};
