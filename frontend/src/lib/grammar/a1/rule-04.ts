// frontend/src/lib/grammar/a1/rule-04.ts
// A1 дүрэм 4: a / an / the
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule04: GrammarRule = {
  id: 4,
  title: 'a / an / the',
  titleMn: 'Ялгац гишүүн — a, an, the',
  hook: '«Нэг ном» уу, «яг тэр ном» уу? Англиар энэ ялгааг a, an, the гэдэг жижигхэн үгс хэлж өгдөг.',
  summary: 'a/an — ганц тооны тоологдох нэр үгийг анх удаа, «ямар нэг» гэсэн утгаар хэлэхэд. the — ярилцагч хоёулаа аль зүйл болохыг мэдэж байхад. Ерөнхий утгатай олон тоо, үл тоологдох нэр үгэнд юу ч хэрэггүй.',
  description: 'Ялгац гишүүн (article) бол нэр үгийн өмнө зогсдог жижигхэн үг. Энэ үг сонсогчид тухайн зүйл шинэ, тодорхой бус юм уу, эсвэл аль нь гэдэг нь аль хэдийн тодорхой юм уу гэдгийг хэлж өгдөг. a/an нь нэг ширхэг, тодорхой бус, тоологдох нэр үгтэй явна: «a dog» — ямар нэг нохой. the нь ярилцагч хоёулаа мэдэж байгаа, тодорхой болсон нэр үгтэй явна: «the dog» — яг тэр нохой. Монгол хэлэнд ийм үг байхгүй тул монгол хүн ялгац гишүүнийг хамгийн их орхидог. Нэр үг бүрийн өмнө «a юу, the юу, юу ч биш үү?» гэж асуух дадал энэ дүрмээс эхэлнэ.',
  structure: 'a/an + singular countable noun · the + specific noun',
  structureParts: [
    { text: 'a/an', part: 'plain' },
    { text: 'singular countable noun', part: 'object' },
    { text: '·', part: 'plain' },
    { text: 'the', part: 'plain' },
    { text: 'specific noun', part: 'object' },
  ],
  tip: 'a/an-ыг үсгээр биш, АВИАГААР сонгоорой: an apple, an hour (h дуудагдахгүй), a university («ю» авиа). Хоёр дахь удаа дурдвал → the.',
  examples: [
    { en: '[I](s) [have](v) [a dog](o).', mn: 'Би нохойтой.' },
    { en: '[She](s) [eats](v) [an apple](o).', mn: 'Тэр алим иддэг.' },
    { en: '[The dog](s) [is](v) [very friendly](o).', mn: 'Тэр нохой их найрсаг.' },
    { en: '[The sun](s) [is](v) [bright](o).', mn: 'Нар хурц гэрэлтэй байна.' },
  ],
  useCases: [
    {
      title: 'a — нэг, тодорхой бус зүйл',
      description: 'Ганц тооны тоологдох нэр үгийг анх удаа дурдах, эсвэл яг аль нь чухал биш үед a хэрэглэнэ. «Надад үзэг хэрэгтэй» гэхэд ямар ч үзэг байж болно — тэгэхээр a pen.',
      examples: [
        { en: '[I](s) [need](v) [a pen](o).', mn: 'Надад үзэг хэрэгтэй.' },
        { en: '[He](s) [bought](v) [a car](o).', mn: 'Тэр машин авсан.' },
        { en: '[There](s) [is](v) [a shop](o) [near here](m).', mn: 'Энд ойрхон дэлгүүр бий.' },
      ],
    },
    {
      title: 'an — эгшиг авиагаар эхлэх үгийн өмнө',
      description: 'Дараагийн үг эгшиг АВИАГААР эхэлбэл a биш an болно. Үсгийг биш, дуудлагыг сонсоорой: hour-ын h дуудагдахгүй тул an hour.',
      examples: [
        { en: 'an apple', mn: 'алим' },
        { en: 'an orange', mn: 'жүрж' },
        { en: 'an hour', mn: 'нэг цаг (h дуудагдахгүй)' },
        { en: '[It](s) [takes](v) [an hour](o).', mn: 'Нэг цаг болно.' },
      ],
    },
    {
      title: 'Мэргэжил, ангилал',
      description: 'Хэн нэгний мэргэжил, эсвэл ямар төрлийн зүйл болохыг хэлэхэд be-ийн дараа a/an заавал орно. Монголоор «Тэр эмч» гэхэд юу ч нэмдэггүй, харин англиар a-г орхиж болохгүй.',
      examples: [
        { en: '[She](s) [is](v) [a doctor](o).', mn: 'Тэр эмч.' },
        { en: '[He](s) [is](v) [an engineer](o).', mn: 'Тэр инженер.' },
        { en: '[It](s) [is](v) [a useful tool](o).', mn: 'Энэ бол хэрэгтэй багаж.' },
      ],
    },
    {
      title: 'the — аль зүйл болох нь тодорхой',
      description: 'Ярилцагч хоёулаа аль зүйлийг ярьж байгаагаа мэдэж байвал the. Өрөөнд нэг л хаалга, ангид нэг л багш байгаа бол шууд the door, the teacher гэнэ.',
      examples: [
        { en: '[Close](v) [the door](o).', mn: 'Хаалгаа хаагаарай.' },
        { en: '[Where](m) [is](v) [the bathroom](s)?', mn: 'Ариун цэврийн өрөө хаана байна вэ?' },
        { en: '[The teacher](s) [is](v) [here](m).', mn: 'Багш энд байна.' },
      ],
    },
    {
      title: 'Өмнө дурдсан зүйлийг дахин хэлэх',
      description: 'Анх удаа a/an, дараагийн удаа the болж хувирна. Хоёр дахь удаад сонсогч аль нохойг, аль номыг ярьж байгааг аль хэдийн мэднэ.',
      examples: [
        {
          en: '[I](s) [saw](v) [a dog](o). [The dog](s) [was](v) [black](o).',
          mn: 'Би нэг нохой харсан. Тэр нохой хар байсан.',
        },
        {
          en: '[She](s) [bought](v) [a book](o). [The book](s) [is](v) [interesting](o).',
          mn: 'Тэр нэг ном авсан. Тэр ном сонирхолтой.',
        },
      ],
    },
    {
      title: 'Цорын ганц, эсвэл тухайн орчинд ганц зүйл',
      description: 'Дэлхий дээр нэг л байдаг зүйл (нар, сар), эсвэл тухайн байшинд нэг л байдаг зүйл (гал тогоо) — the. Аль нь гэдэг нь асуулгүй тодорхой.',
      examples: [
        { en: 'the sun', mn: 'нар' },
        { en: 'the moon', mn: 'сар' },
        { en: 'the kitchen', mn: 'гал тогоо (манай байшингийн)' },
        {
          en: '[The moon](s) [is](v) [beautiful](o) [tonight](m).',
          mn: 'Өнөө орой сар үзэсгэлэнтэй байна.',
        },
      ],
    },
    {
      title: 'Ялгац гишүүнгүй тохиолдол — Ø',
      description: 'Олон тооны, эсвэл үл тоологдох нэр үгийг ерөнхий утгаар хэлэхэд ялгац гишүүн хэрэглэхгүй. «Нохой найрсаг амьтан» — бүх нохойн тухай, тэгэхээр Dogs, the dogs биш.',
      examples: [
        { en: '[Dogs](s) [are](v) [friendly](o).', mn: 'Нохой найрсаг амьтан.' },
        { en: '[I](s) [like](v) [music](o).', mn: 'Би хөгжимд дуртай.' },
        { en: '[Water](s) [is](v) [important](o).', mn: 'Ус чухал.' },
      ],
    },
  ],
  forms: [
    {
      structure: 'a + consonant sound + singular countable noun',
      examples: [
        { en: 'a book', mn: 'ном' },
        { en: 'a dog', mn: 'нохой' },
        { en: 'a university', mn: 'их сургууль («ю» авиагаар эхэлдэг тул a)' },
      ],
      label: 'a — гийгүүлэгч авиа',
    },
    {
      structure: 'an + vowel sound + singular countable noun',
      examples: [
        { en: 'an apple', mn: 'алим' },
        { en: 'an egg', mn: 'өндөг' },
        { en: 'an hour', mn: 'нэг цаг (h дуудагдахгүй тул an)' },
      ],
      label: 'an — эгшиг авиа',
    },
    {
      structure: 'the + specific / known noun',
      examples: [
        { en: 'the book on the table', mn: 'ширээн дээрх ном' },
        { en: 'the teacher', mn: '(манай) багш' },
        { en: 'the sun', mn: 'нар' },
      ],
      label: 'the — тодорхой зүйл',
    },
    {
      structure: 'Ø + plural / uncountable noun in general meaning',
      examples: [
        { en: '[Cats](s) [are](v) [cute](o).', mn: 'Муур өхөөрдөм амьтан.' },
        { en: '[Milk](s) [is](v) [good](o) [for children](m).', mn: 'Сүү хүүхдэд сайн.' },
        { en: '[I](s) [like](v) [coffee](o).', mn: 'Би кофенд дуртай.' },
      ],
      label: 'Ø — ялгац гишүүнгүй',
    },
  ],
  notes: [
    'a/an зөвхөн ганц тооны тоологдох нэр үгтэй явна. Олон тоо (books), үл тоологдох нэр үг (water) — a/an хэрэглэхгүй. Харин the гурвуултай нь явж болно: the book, the books, the water.',
    'an university биш, a university. Учир нь university «ю» авиагаар эхэлдэг — энэ бол гийгүүлэгч авиа. Мөн a European, a one-way ticket.',
    'a hour биш, an hour. hour дахь h дуудагддаггүй, тэгэхээр үг эгшиг авиагаар эхэлж байна. Мөн an honest man.',
    'Хүний нэр, ихэнх хот, улсын нэрийн өмнө ердийн үед ялгац гишүүн хэрэглэхгүй: Sarah, Mongolia, Ulaanbaatar.',
    'Нэмэлт: the-г ихэвчлэн «дө» гэж дуудна, харин эгшиг авиатай үгийн өмнө «ди» болно: the apple, the hour.',
  ],
  commonMistakes: [
    {
      wrong: 'I have apple.',
      correct: 'I have an apple.',
      explanation: 'apple нь ганц тооны тоологдох нэр үг тул өмнө нь заавал ялгац гишүүн хэрэгтэй. Эгшиг авиагаар эхэлдэг тул an.',
    },
    {
      wrong: 'She is engineer.',
      correct: 'She is an engineer.',
      explanation: 'Мэргэжлийг ганц тоогоор хэлэхэд a/an заавал орно. Монголоор «Тэр инженер» гэж юу ч нэмдэггүй, гэхдээ англиар орхиж болохгүй.',
    },
    {
      wrong: 'an university',
      correct: 'a university',
      explanation: 'Ялгац гишүүнийг бичгийн үсгээр биш, эхний авиагаар сонгоно. university «ю» авиагаар эхэлдэг — гийгүүлэгч авиа.',
    },
    {
      wrong: 'I saw a cat. A cat was white.',
      correct: 'I saw a cat. The cat was white.',
      explanation: 'Хоёр дахь удаад сонсогч аль муурыг ярьж байгааг мэднэ. Тодорхой болсон зүйлийг the-гээр хэлнэ. A cat гэвэл өөр, шинэ муур мэт сонсогдоно.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монгол хэлэнд ялгац гишүүн байхгүй. «Би ном уншсан» гэхэд ямар нэг ном уу, яг тэр ном уу гэдэг нь өгүүлбэрээс мэдэгдэхгүй. Англиар заавал сонгоно: a book (ямар нэг), the book (яг тэр).',
      'Ойролцоо хэлбэр монголд бас бий: a/an ≈ «нэг ном», the ≈ «тэр ном». Ялгаа нь — монголоор «нэг», «тэр»-ийг орхиж болно, англиар a, the-г орхиж болохгүй.',
      'Мэргэжил хэлэхэд монгол хүн хамгийн их алддаг. «Тэр эмч» → «She is doctor» биш, «She is a doctor». Монголоор холбох үг ч, ялгац гишүүн ч байхгүй тул хоёуланг нь нэмж сурна.',
      'Эсрэг алдаа бас бий: «Би хөгжимд дуртай» гэж ерөнхийд нь хэлэхэд the хэрэггүй — «I like music». Бүх нохой, бүх ус гэсэн утгаар бол ялгац гишүүнгүй.',
    ],
  },
  dialogue: [
    { en: '[I](s) [have](v) [a new phone](o).', mn: 'Би шинэ утастай боллоо.', speaker: 'Bat' },
    { en: '[Is](v) [the phone](s) [expensive](o)?', mn: 'Тэр утас үнэтэй юу?', speaker: 'Saraa' },
    {
      en: 'No, [it](s) [was](v) [a gift](o) [from my uncle](m).',
      mn: 'Үгүй ээ, авга ахын минь өгсөн бэлэг.',
      speaker: 'Bat',
    },
    {
      en: 'Nice! [Is](v) [the camera](s) [good](o)?',
      mn: 'Гоё юм! Камер нь сайн уу?',
      speaker: 'Saraa',
    },
    { en: 'Yes. [Look](v) [at the photo](m)!', mn: 'Тийм ээ. Энэ зургийг хараач!', speaker: 'Bat' },
    {
      en: 'Wow, [it](s)[\'s](v) [an amazing photo](o)!',
      mn: 'Өө, ёстой гоё зураг байна!',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: '4-1',
      explanation: 'apple эгшиг авиагаар эхэлдэг тул an. a — гийгүүлэгч авиатай үгийн өмнө, the — тодорхой зүйлд, is бол ялгац гишүүн биш, үйл үг.',
      ruleId: 4,
      kind: 'fill',
      question: 'I have ___ apple.',
      options: ['a', 'an', 'the', 'is'],
      answer: 'an',
      hint: 'apple-ийн эхний авиаг сонсоорой.',
    },
    {
      id: '4-2',
      explanation: 'Муурыг өмнө нь дурдсан тул хоёр дахь удаад тодорхой болсон — The. A/An гэвэл өөр шинэ муур мэт сонсогдоно, Some нь тодорхой зүйлийг заадаггүй тул тохирохгүй.',
      ruleId: 4,
      kind: 'fill',
      question: 'I saw a cat. ___ cat was white.',
      options: ['A', 'An', 'The', 'Some'],
      answer: 'The',
      hint: 'Энэ муурыг анх удаа ярьж байна уу, дахин ярьж байна уу?',
    },
    {
      id: '4-3',
      explanation: 'Мэргэжлийн өмнө a/an заавал. engineer эгшиг авиагаар эхэлдэг тул an. Ялгац гишүүнгүй, a engineer, an engineers (олон тоо) — бүгд буруу.',
      ruleId: 4,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: ['She is engineer.', 'She is a engineer.', 'She is an engineer.', 'She is an engineers.'],
      answer: 'She is an engineer.',
      hint: 'Мэргэжил + эгшиг авиа.',
    },
    {
      id: '4-4',
      explanation: 'Нар дэлхий дээр нэг л байдаг, аль нь гэдэг нь тодорхой тул the. Ялгац гишүүнгүй Sun, «ямар нэг нар» гэсэн A sun, гийгүүлэгчийн өмнөх An — бүгд буруу.',
      ruleId: 4,
      kind: 'translate',
      question: 'Нар хурц гэрэлтэй байна.',
      options: ['Sun is bright.', 'A sun is bright.', 'The sun is bright.', 'An sun is bright.'],
      answer: 'The sun is bright.',
      hint: 'Нар хэд байдаг вэ?',
    },
  ],
};
