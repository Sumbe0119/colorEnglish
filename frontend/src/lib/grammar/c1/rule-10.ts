// frontend/src/lib/grammar/c1/rule-10.ts
// C1 дүрэм 10: Ellipsis & substitution
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule10: GrammarRule = {
  id: 10,
  title: 'Ellipsis & substitution',
  titleMn: 'Ellipsis ба substitution — давтагдсан үгийг орхих, орлуулах',
  hook: '«Тэгэх байх», «Үгүй байгаасай», «Би ч бас», «Очмоор л байна» — нэг үгийг хоёр удаа давтахгүйгээр төрөлх хэлтэн шиг товч, зөв хариулж сурцгаая.',
  summary: 'Substitution нь давтагдах хэсгийг богино үгээр орлуулна: so / not (I think so, I hope not), do so, one / ones. Ellipsis нь давтагдах хэсгийг бүр орхино: туслах үйл үгийн ард (She can and I can\'t), to-гийн ард (I\'d love to), and / but-ын дараах эзэн, туслах үйл үг. So do I / Neither do I нь «би ч бас / би ч бас үгүй» гэсэн товч хариу.',
  description: 'Өмнөх түвшнүүдэд бид богино хариулт (Yes, I do / No, she can\'t), one / ones, So do I / Neither do I зэрэг хэсэгчилсэн жишээг үзэж ирсэн. C1 түвшинд эдгээрийг нэг системд оруулна: англи хэл давталтаас зайлсхийх хоёр аргатай. Substitution (орлуулалт) — давтагдах үг, өгүүлбэрийг богино үгээр солино: бүтэн that-өгүүлбэрийг so / not-оор (Is she coming? — I think so), үйл үгийн бүлгийг do so-гоор, тоолж болох нэр үгийг one / ones-оор. Ellipsis (орхилт) — давтагдах хэсгийг огт хэлэхгүй: туслах үйл үгийн ард (He said he would help, but he hasn\'t), to-гийн ард (You can come if you want to), and / but / or-ын дараах ижил эзэн, туслах үйл үгийг (She opened the door and walked in). Хамгийн чухал зарчим: англи хэлэнд орхисон зүйлийн «ул мөр» заавал үлддэг — туслах үйл үг, to, so, one. I think, I\'d love, Yes I like гэж ул мөргүй орхивол алдаа болно. Хэв маягийн хувьд ихэнх нь ярианы болон бичгийн хэлэнд аль алинд нь зайлшгүй хэрэгтэй; do so болон if so / if not нь арай албан, харин өгүүлбэрийн эхний үгийг орхих (Seen Bat? — Don\'t know) нь зөвхөн чөлөөт ярианд тохирно. Монгол хэл эзэн, тусагдахууныг контекстээс ойлгомжтой бол чөлөөтэй орхидог, «тийм», «тэгнэ», «би ч гэсэн» гэж хариулдаг тул монгол хүн англиар хэтэрхий их орхих (I think.) эсвэл эсрэгээр бүхнийг давтах (Yes, I would like to come to the party) хоёр туйлд орох хандлагатай.',
  structure: 'Subject + think / hope / expect / be afraid + so / not · Subject + auxiliary (үндсэн үйл үггүй) · Subject + verb + to (V1-гүй) · So / Neither + auxiliary + subject · a / the + adjective + one(s)',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'think / hope · auxiliary · would love', part: 'verb' },
    { text: 'so / not · one(s) · to', part: 'object' },
    { text: '· So / Neither + auxiliary + subject', part: 'modifier' },
  ],
  tip: 'I think so / I hope not = өгүүлбэрийг so / not-оор орлуулна · She can, but I can\'t = туслах үйл үгийг үлдээнэ · I\'d love to = to-г үлдээнэ · a new one = нэр үгийг one-оор орлуулна · So do I / Neither do I = «би ч бас / би ч бас үгүй».',
  examples: [
    { en: 'Is Bat coming tonight? — [I](s) [think](v) [so](o).', mn: 'Бат өнөө орой ирэх үү? — Ирэх байх гэж бодож байна.' },
    { en: '[She](s) [can speak](v) [French](o), [but](m) [I](s) [can\'t](v).', mn: 'Тэр францаар ярьж чаддаг, харин би чаддаггүй.' },
    { en: 'Would you like to join us? — [I](s)[\'d love](v) [to](o).', mn: 'Бидэнтэй нэгдэх үү? — Дуртайяа нэгдэнэ.' },
    { en: '[This jacket](s) [is](v) [too small](o). [Have](v) [you](s) [got](v) [a bigger one](o)?', mn: 'Энэ хүрэм хэтэрхий жижиг байна. Арай том нь байна уу?' },
  ],
  useCases: [
    {
      title: 'Өгүүлбэрийг орлуулах — so / not',
      description: 'think, believe, expect, suppose, guess, hope, be afraid, it seems / appears-ийн ард бүтэн that-өгүүлбэрийг so (батлах) буюу not (үгүйсгэх)-оор орлуулна. hope, be afraid, guess-тэй үгүйсгэл нь зөвхөн not: I hope not. think, expect, suppose-той бол ихэвчлэн I don\'t think so.',
      examples: [
        { en: 'Will it rain tomorrow? — [I](s) [hope](v) [not](o).', mn: 'Маргааш бороо орох болов уу? — Орохгүй байгаасай.' },
        { en: 'Is the shop still open? — [I](s) [don\'t think](v) [so](o).', mn: 'Дэлгүүр онгорхой хэвээр байгаа юу? — Үгүй байх аа.' },
        { en: 'Have we missed the train? — [I](s)[\'m afraid](v) [so](o).', mn: 'Бид галт тэрэгнээсээ хоцорчихсон уу? — Харамсалтай нь тийм бололтой.' },
      ],
    },
    {
      title: 'Үйл үг, нэр үгийг орлуулах — do so / one / ones',
      description: 'do so нь өмнө дурдсан үйлдлийг бүхэлд нь орлуулна (арай албан). one (ганц тоо) / ones (олон тоо) нь тоолж болох нэр үгийг орлуулна; өмнө нь тэмдэг нэр, the, this / that, which орж болно.',
      examples: [
        { en: '[He](s) [was asked](v) [to leave](o), [and](m) [he](s) [did](v) [so](o) [immediately](m).', mn: 'Түүнийг гарахыг хүсэхэд тэр даруй тэгэв.' },
        { en: '[These shoes](s) [are](v) [too tight](o). [I](s) [need](v) [bigger ones](o).', mn: 'Энэ гутал хэтэрхий бариу байна. Надад арай том нь хэрэгтэй.' },
        { en: 'Which cake would you like? — [The one with chocolate](o), please.', mn: 'Аль бялууг авах вэ? — Шоколадтайг нь авъя.' },
      ],
    },
    {
      title: 'Туслах үйл үгийн дараах орхилт',
      description: 'Давтагдах үндсэн үйл үг ба түүний ард байгаа бүхнийг орхиж, зөвхөн туслах буюу модаль үйл үгийг (be, have, do, can, will, would …) үлдээнэ. Туслах үйл үггүй цагт do / does / did орно. Харьцуулалт (than I do) ба богино хариултад ч мөн адил.',
      examples: [
        { en: '[He](s) [said](v) [he would call](o), [but](m) [he](s) [hasn\'t](v).', mn: 'Тэр залгана гэсэн ч залгаагүй байна.' },
        { en: '[I](s) [haven\'t read](v) [the book](o), [but](m) [my sister](s) [has](v).', mn: 'Би тэр номыг уншаагүй, харин эгч маань уншсан.' },
        { en: '[She](s) [earns](v) [more](o) [than her husband does](m).', mn: 'Тэр нөхрөөсөө илүү цалин авдаг.' },
      ],
    },
    {
      title: 'to-гийн дараах орхилт',
      description: 'Давтагдах infinitive-ийн үйл үгийг орхиж, зөвхөн to-г үлдээнэ: want to, would like / love to, hope to, promise to, used to, be able to, be going to, have to. be үйл үг бол to be гэж үлдээнэ.',
      examples: [
        { en: '[You](s) [can stay](v) [longer](m) [if you want to](m).', mn: 'Хүсвэл чи удаан байж болно.' },
        { en: '[I](s) [didn\'t phone](v) [her](o), [although](m) [I](s) [had promised](v) [to](o).', mn: 'Би амласан хэрнээ түүн рүү залгасангүй.' },
        { en: '[He](s) [isn\'t](v) [as active](o) [as he used to be](m).', mn: 'Тэр урьдынх шигээ идэвхтэй биш болжээ.' },
      ],
    },
    {
      title: 'So do I / Neither do I ба and / but-ын дараах орхилт',
      description: 'Санал нийлэхэд So + туслах үйл үг + эзэн (батлах), Neither / Nor + туслах үйл үг + эзэн (үгүйсгэх) — үгийн дараалал урвуу. and, but, or-оор холбосон хоёр хэсгийн эзэн ижил бол хоёр дахь эзэн, туслах үйл үгийг орхино.',
      examples: [
        { en: 'I love jazz. — [So](m) [do](v) [I](s).', mn: 'Би жазз хөгжимд дуртай. — Би ч бас.' },
        { en: 'I can\'t drive. — [Neither](m) [can](v) [my brother](s).', mn: 'Би машин барьж чаддаггүй. — Манай ах ч бас чаддаггүй.' },
        { en: '[She](s) [opened](v) [the letter](o) [and](m) [read](v) [it](o) [aloud](m).', mn: 'Тэр захидлыг нээгээд чангаар уншив.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Үйл үг + so / not',
      structure: 'think / believe / expect / suppose / hope / be afraid + so · hope / be afraid / suppose + not · if so / if not',
      examples: [
        { en: 'Is she coming to the party? — [I](s) [expect](v) [so](o).', mn: 'Тэр үдэшлэгт ирэх үү? — Ирэх байх аа.' },
        { en: 'Can we get our money back? — [I](s)[\'m afraid](v) [not](o).', mn: 'Бид мөнгөө буцааж авч болох уу? — Харамсалтай нь болохгүй.' },
        { en: '[Are](v) [you](s) [free](o) [on Friday](m)? [If so](m), [let\'s meet](v) [for lunch](m).', mn: 'Чи баасан гарагт завтай юу? Тийм бол үдийн хоолон дээр уулзъя.' },
      ],
    },
    {
      label: 'one / ones / do so',
      structure: 'a / an + adjective + one · the / this / which + one(s) · do / does / did + so',
      examples: [
        { en: '[I](s) [lost](v) [my umbrella](o), [so](m) [I](s) [bought](v) [a new one](o).', mn: 'Би шүхрээ гээчихээд шинийг авсан.' },
        { en: '[The green apples](s) [are](v) [sweeter](o) [than the red ones](m).', mn: 'Ногоон алим улаанаасаа илүү чихэрлэг.' },
        { en: '[Anyone wishing to cancel](s) [should do](v) [so](o) [in writing](m).', mn: 'Цуцлахыг хүссэн хүн үүнийгээ бичгээр мэдэгдэх ёстой.' },
      ],
    },
    {
      label: 'Туслах үйл үг дангаараа / to дангаараа',
      structure: 'subject + auxiliary / modal (+ not) · subject + verb + to',
      examples: [
        { en: '[I](s)[\'ll help](v) [you](o) [if I can](m).', mn: 'Чадвал би чамд тусална.' },
        { en: '[They](s) [didn\'t win](v), [but](m) [they](s) [could have](v).', mn: 'Тэд хожоогүй, гэхдээ хожиж болох байсан.' },
        { en: '[He](s) [wanted](v) [to come](o), [but](m) [he](s) [wasn\'t able](v) [to](o).', mn: 'Тэр ирэхийг хүссэн ч чадсангүй.' },
      ],
    },
    {
      label: 'So / Neither + туслах үйл үг + эзэн',
      structure: 'So + auxiliary + subject (батлах) · Neither / Nor + auxiliary + subject (үгүйсгэх)',
      examples: [
        { en: 'I\'m exhausted. — [So](m) [am](v) [I](s).', mn: 'Би туйлдаа хүртлээ ядарлаа. — Би ч бас.' },
        { en: 'We didn\'t enjoy the film. — [Neither](m) [did](v) [we](s).', mn: 'Бидэнд кино таалагдаагүй. — Бидэнд ч бас.' },
        { en: '[Bat](s) [has passed](v) [the exam](o), [and](m) [so](m) [has](v) [Tuya](s).', mn: 'Бат шалгалтандаа тэнцсэн, Туяа ч бас тэнцсэн.' },
      ],
    },
  ],
  signalWords: ['I think so', 'I hope not', 'I\'m afraid so', 'I don\'t think so', 'if so / if not', 'do so', 'one / ones', 'So do I', 'Neither do I', 'I\'d love to', 'if you want to', 'used to'],
  notes: [
    'hope, be afraid, guess-ийн үгүйсгэлд зөвхөн not: I hope not, I\'m afraid not (I don\'t hope so гэж хэлэхгүй). think, believe, expect, suppose-той бол I don\'t think so түгээмэл; I think not нь маш албан өнгөтэй.',
    'one / ones зөвхөн тоолж болох нэр үгийг орлуулна. Тоолж болохгүй нэр үгийг давтах буюу орхино: I prefer brown bread to white (white one биш). Тэмдэг нэргүй бол a one гэхгүй: I need a pen — have you got one?',
    'Орхисон үйл үгийн туслах үйл үг нь цаг, биедээ таарах ёстой: She works harder than I do; He has finished, but I haven\'t. Туслах үйл үг байхгүй бол do / does / did оруулна.',
    'to-г орхиж болох цөөн тохиолдол: want, like, wish-ийн ард if, when, whenever, what-тай өгүүлбэрт — Come whenever you like; Do what you want. Бусад үед to заавал үлдэнэ: I\'d love to, I didn\'t mean to.',
    'So do I (санал нийлэх, урвуу дараалал) ба So I do / So it is (гайхан батлах, энгийн дараалал) хоёр өөр: «It\'s snowing!» — «So it is!» = «Нээрээ тийм байна!».',
    'Эзнийг зөвхөн and, but, or, then-ий ард орхино. because, when, if, although-ийн ард орхиж болохгүй: He left because he was tired (because was tired буруу). Чөлөөт ярианд өгүүлбэрийн эхний үгсийг орхидог: (Have you) Seen Bat? — (I) Don\'t know.',
  ],
  commonMistakes: [
    {
      wrong: '"Is he coming tomorrow?" "I think yes."',
      correct: '"Is he coming tomorrow?" "I think so."',
      explanation: 'think, hope, expect-ийн ард yes / no биш so / not орно. Монголоор «тийм гэж бодож байна» гэдгийг үгчилбэл I think yes гарах боловч англиар so нь бүтэн өгүүлбэрийг орлоно.',
    },
    {
      wrong: '"Will the tickets be expensive?" "I don\'t hope so."',
      correct: '"Will the tickets be expensive?" "I hope not."',
      explanation: 'hope-ийн үгүйсгэлд үйл үгийг биш, орлуулсан өгүүлбэрийг үгүйсгэнэ: I hope not = I hope they won\'t be expensive. I\'m afraid not, I guess not мөн адил.',
    },
    {
      wrong: '"Would you like to come with us?" "Yes, I\'d love."',
      correct: '"Would you like to come with us?" "Yes, I\'d love to."',
      explanation: 'Infinitive-ийн үйл үгийг орхиход to заавал үлдэнэ. to бол орхисон «come with you»-ийн ул мөр. I\'d like to, I want to, I\'m going to мөн адил.',
    },
    {
      wrong: '"I don\'t like horror films." "Neither I do."',
      correct: '"I don\'t like horror films." "Neither do I."',
      explanation: 'So / Neither-ийн ард үгийн дараалал урвуу: туслах үйл үг + эзэн. Мөн үгүйсгэсэн өгүүлбэрт So do I биш Neither do I (эсвэл I don\'t either) гэж хариулна.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монгол хэлэнд эзэн, тусагдахууныг контекстээс ойлгомжтой бол чөлөөтэй орхидог: «Үзсэн үү? — Үзсэн.» Англиар эзэн ба туслах үйл үгийг заавал үлдээнэ: Have you seen it? — Yes, I have. Зөвхөн үндсэн үйл үг ба ард байгаа хэсгийг л орхино.',
      'Монголоор «тэгэх байх», «тийм гэж бодож байна», «үгүй байгаасай» гэж «тэг-», «тийм», «үгүй» үгээр орлуулдаг. Англиар энэ үүргийг so / not гүйцэтгэнэ: I think so, I hope not. yes / no-г think, hope-ийн ард хэрэглэхгүй.',
      'Монголоор «би ч бас», «би ч гэсэн» гэдэг нэг хэллэг батлах, үгүйсгэх хоёр өгүүлбэрт хоёуланд нь тохирдог. Англиар батлахад So do I, үгүйсгэхэд Neither do I гэж ялгах ба туслах үйл үг нь өмнөх өгүүлбэрийн цагтай таарах ёстой.',
      'Монголоор нэр үгийг орлуулахдаа «том нь», «улааныг нь» гэж «нь» хэрэглэдэг. Англиар тэмдэг нэр дангаараа үлдэж болохгүй тул one / ones нэмнэ: «том нь» = a bigger one, «улаанууд нь» = the red ones.',
    ],
  },
  dialogue: [
    {
      en: '[Are](v) [you](s) [coming](v) [to the countryside](m) [this weekend](m), Bat?',
      mn: 'Бат, чи энэ амралтын өдрөөр хөдөө явах уу?',
      speaker: 'Saraa',
    },
    {
      en: '[I](s)[\'d love](v) [to](o), [but](m) [I](s)[\'m not](v) [sure](o) [I](s) [can](v). [Is](v) [Tuya](s) [going](v)?',
      mn: 'Явмаар л байна, гэхдээ чадах эсэхээ сайн мэдэхгүй байна. Туяа явах уу?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [think](v) [so](o). [She](s) [said](v) [she would](o), [and](m) [she](s) [usually keeps](v) [her promises](o).',
      mn: 'Явах байх. Явна гэж хэлсэн, тэр ихэвчлэн амласандаа хүрдэг.',
      speaker: 'Saraa',
    },
    {
      en: '[So](m) [does](v) [Temuulen](s), [but](m) [he](s) [hasn\'t replied](v) [yet](m). [Will](v) [the weather](s) [be](v) [bad](o)?',
      mn: 'Тэмүүлэн ч бас тийм, гэхдээ тэр хараахан хариу өгөөгүй байна. Цаг агаар муу байх болов уу?',
      speaker: 'Bat',
    },
    {
      en: '[I](s) [hope](v) [not](o). [I](s) [haven\'t got](v) [a warm jacket](o), [so](m) [I](s) [need](v) [to borrow one](o).',
      mn: 'Үгүй байгаасай. Надад дулаан хүрэм байхгүй болохоор нэгийг зээлэх хэрэгтэй байна.',
      speaker: 'Saraa',
    },
    {
      en: '[I](s)[\'ve got](v) [two](o) — [a thick one and a light one](o). [I](s)[\'ll bring](v) [both](o), [and](m) [you](s) [can choose](v).',
      mn: 'Надад хоёр байгаа — нэг зузаан, нэг нимгэн. Хоёуланг нь аваад очъё, чи сонгож болно.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'c1-10-1',
      ruleId: 10,
      kind: 'fill',
      question: '"Is it going to rain during the picnic?" "I hope ___. We haven\'t got a tent."',
      options: ['not', 'no', 'so', 'it'],
      answer: 'not',
      explanation: 'Майхангүй тул бороо орохгүй байгаасай гэж найдаж байна — hope-ийн үгүйсгэл нь I hope not. no-г hope-ийн ард хэрэглэхгүй; I hope so гэвэл бороо ороосой гэсэн утга гарч контексттэй зөрчилдөнө.',
      hint: 'hope + үгүйсгэсэн орлуулалт.',
    },
    {
      id: 'c1-10-2',
      ruleId: 10,
      kind: 'fill',
      question: '"I\'ve never been to Japan." "___."',
      options: ['Neither have I', 'So have I', 'Neither I have', 'Neither do I'],
      answer: 'Neither have I',
      explanation: 'Үгүйсгэсэн өгүүлбэрт (never) санал нийлэхэд Neither + туслах үйл үг + эзэн. Өмнөх өгүүлбэр Present Perfect тул туслах үйл үг нь have. So нь батлах өгүүлбэрт; Neither I have дараалал буруу.',
      hint: 'Үгүйсгэл + ижил туслах үйл үг + урвуу дараалал.',
    },
    {
      id: 'c1-10-3',
      ruleId: 10,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'I don\'t have a pen. Can you lend me a one?',
        '"Will he pass the exam?" "I think yes."',
        'She asked me to help, and I was happy to.',
        'He can swim, but I don\'t can.',
      ],
      answer: 'She asked me to help, and I was happy to.',
      explanation: 'happy to (help) — үйл үгийг орхиж to-г үлдээсэн зөв ellipsis. Тэмдэг нэргүй бол a one биш one; think-ийн ард yes биш so; модаль үгийн үгүйсгэл нь can\'t (don\'t can биш).',
      hint: 'to үлдсэн өгүүлбэрийг хай.',
    },
    {
      id: 'c1-10-4',
      ruleId: 10,
      kind: 'translate',
      question: 'Би очмоор байна, гэхдээ чадахгүй.',
      options: [
        'I\'d like to go, but I can\'t.',
        'I\'d like to go, but I can\'t to.',
        'I\'d like go, but I can\'t.',
        'I\'d like to go, but I don\'t can.',
      ],
      answer: 'I\'d like to go, but I can\'t.',
      explanation: 'Давтагдах go-г орхиж модаль үгийг дангаар нь үлдээнэ: but I can\'t. Модаль үгийн ард to орохгүй (can\'t to буруу); would like-ийн ард to заавал байна; can-ийн үгүйсгэл нь can\'t.',
      hint: 'Модаль үгийн ард үндсэн үйл үгийг орхино.',
    },
  ],
};
