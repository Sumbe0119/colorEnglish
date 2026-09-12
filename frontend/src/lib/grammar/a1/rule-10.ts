// frontend/src/lib/grammar/a1/rule-10.ts
// A1 дүрэм 10: There is / There are
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const rule10: GrammarRule = {
  id: 10,
  title: 'There is / There are',
  titleMn: 'Юу байна, юу байдгийг хэлэх',
  hook: '«Ширээн дээр ном байна», «Ойрхон дэлгүүр байдаг уу?» — энэ «байна, байдаг»-ыг англиар яаж хэлэх вэ?',
  summary: 'Ямар нэг хүн, юм хаа нэгтээ байгаа, байдгийг анх хэлэхэд There is / There are хэрэглэнэ. Ганц тоо, үл тоологдох нэр үг → There is. Олон тоо → There are. There энд «тэнд» биш.',
  description: 'There is / There are бол ямар нэг хүн, юм тодорхой газар байгаа, байдаг гэдгийг анх удаа танилцуулж хэлэх бүтэц. Монголоор «Ширээн дээр ном байна» гэдэгтэй адил. Энд There нь «тэнд» гэсэн байршлын утгагүй. Зөвхөн өгүүлбэрийг эхлүүлж өгдөг эзний суудал. Жинхэнэ утга нь ардах is / are болон нэр үгэнд байна. Аль хэлбэрийг сонгохыг зөвхөн ардах нэр үг шийднэ: ганц тооны эсвэл үл тоологдох нэр үг → There is, олон тооны нэр үг → There are. Хаана байгааг заасан хэсэг (on the desk, near here) ихэвчлэн өгүүлбэрийн төгсгөлд орно.',
  structure: 'There + is / are + noun + place',
  structureParts: [
    { text: 'There', part: 'subject' },
    { text: 'is / are', part: 'verb' },
    { text: 'noun', part: 'object' },
    { text: 'place', part: 'modifier' },
  ],
  tip: 'Ардах нэр үгээ хараарай: нэг юм эсвэл үл тоологдох (a book, some water) → There is · олон (two cats, many students) → There are.',
  examples: [
    { en: '[There](s) [is](v) [a book](o) [on the desk](m).', mn: 'Ширээн дээр ном байна.' },
    { en: '[There](s) [are](v) [two cats](o) [outside](m).', mn: 'Гадаа хоёр муур байна.' },
    { en: '[There](s) [is](v) [some water](o) [in the bottle](m).', mn: 'Лонхонд жаахан ус байна.' },
    { en: '[There](s)[\'s](v) [a shop](o) [near here](m).', mn: 'Энд ойрхон дэлгүүр бий.' },
  ],
  useCases: [
    {
      title: 'Нэг хүн, нэг юм байгааг хэлэх',
      description: 'Ганц тооны тоологдох нэр үгтэй There is хэрэглэнэ. Нэр үгийн өмнө a / an ялгац гишүүн заавал орно: a park, a student, a problem.',
      examples: [
        {
          en: '[There](s) [is](v) [a park](o) [near here](m).',
          mn: 'Энд ойрхон цэцэрлэгт хүрээлэн байдаг.',
        },
        { en: '[There](s) [is](v) [a student](o) [outside](m).', mn: 'Гадаа нэг оюутан байна.' },
        { en: '[There](s) [is](v) [a problem](o).', mn: 'Нэг асуудал байна.' },
      ],
    },
    {
      title: 'Олон хүн, олон юм байгааг хэлэх',
      description: 'Олон тооны нэр үгтэй There are хэрэглэнэ. Тоо (two, three), many, some гэсэн үгс олон тоог дохионо. Нэр үг өөрөө -s авсан байхыг мартуузай: three shops.',
      examples: [
        {
          en: '[There](s) [are](v) [three shops](o) [on this street](m).',
          mn: 'Энэ гудамжинд гурван дэлгүүр байдаг.',
        },
        { en: '[There](s) [are](v) [many students](o) [here](m).', mn: 'Энд олон оюутан байна.' },
        {
          en: '[There](s) [are](v) [some apples](o) [in the bag](m).',
          mn: 'Цүнхэнд хэдэн алим байна.',
        },
      ],
    },
    {
      title: 'Үл тоологдох нэр үгтэй',
      description: 'milk, water, coffee, money гэх мэт үл тоологдох нэр үг олон тоо болдоггүй. Тиймээс үргэлж There is. Батлах өгүүлбэрт some нэмбэл «жаахан, хэсэг» гэсэн утга өгнө.',
      examples: [
        {
          en: '[There](s) [is](v) [some milk](o) [in the fridge](m).',
          mn: 'Хөргөгчинд жаахан сүү байна.',
        },
        { en: '[There](s) [is](v) [water](o) [on the floor](m).', mn: 'Шалан дээр ус байна.' },
      ],
    },
    {
      title: 'Байхгүйг хэлэх',
      description: 'is / are-ийн ард not залгаж товчилно: There isn\'t / There aren\'t. Үгүйсгэх өгүүлбэрт some биш, any хэрэглэнэ.',
      examples: [
        { en: '[There](s) [isn\'t](v) [a bank](o) [here](m).', mn: 'Энд банк байхгүй.' },
        { en: '[There](s) [aren\'t](v) [any chairs](o).', mn: 'Сандал огт байхгүй.' },
        { en: '[There](s) [isn\'t](v) [any milk](o).', mn: 'Сүү байхгүй.' },
      ],
    },
    {
      title: 'Байгаа эсэхийг асуух',
      description: 'is / are-ийг there-ийн урд гаргана: Is there …? / Are there …? Асуултад any түгээмэл. Богино хариулт: Yes, there is. / No, there aren\'t.',
      examples: [
        { en: '[Is](v) [there](s) [a bathroom](o)?', mn: 'Ариун цэврийн өрөө байдаг уу?' },
        { en: '[Are](v) [there](s) [any questions](o)?', mn: 'Асуулт байна уу?' },
        { en: '[Is](v) [there](s) [any coffee](o)?', mn: 'Кофе байна уу?' },
      ],
    },
  ],
  forms: [
    {
      structure: 'There is + ганц тоо / үл тоологдох · There are + олон тоо',
      examples: [
        { en: '[There](s) [is](v) [a café](o).', mn: 'Кафе байдаг.' },
        { en: '[There](s) [are](v) [two cafés](o).', mn: 'Хоёр кафе байдаг.' },
        { en: '[There](s)[\'s](v) [a café](o) [near here](m).', mn: 'Энд ойрхон кафе бий.' },
      ],
      label: 'Батлах',
    },
    {
      structure: 'There isn\'t … · There aren\'t …',
      examples: [
        { en: '[There](s) [isn\'t](v) [a lift](o).', mn: 'Лифт байхгүй.' },
        { en: '[There](s) [aren\'t](v) [any taxis](o).', mn: 'Такси байхгүй.' },
      ],
      label: 'Үгүйсгэх',
    },
    {
      structure: 'Is there …? · Are there …?',
      examples: [
        { en: '[Is](v) [there](s) [a shop](o)?', mn: 'Дэлгүүр байдаг уу?' },
        { en: '[Are](v) [there](s) [any shops](o)?', mn: 'Дэлгүүрүүд байдаг уу?' },
      ],
      label: 'Асуух',
    },
    {
      structure: 'Yes, there is / are. · No, there isn\'t / aren\'t.',
      examples: [
        { en: '[Yes](o), [there](s) [is](v).', mn: 'Тийм, байдаг.' },
        { en: '[No](o), [there](s) [aren\'t](v).', mn: 'Үгүй, байхгүй.' },
        { en: '[Yes](o), [there](s) [are](v).', mn: 'Тийм, байдаг.' },
      ],
      label: 'Богино хариулт',
    },
  ],
  signalWords: ['a / an', 'some', 'any', 'many', 'two, three …'],
  notes: [
    'There is-ийг ярианд There\'s гэж товчилно: There\'s a shop near here. Харин There are-ийг ихэвчлэн товчилдоггүй, бүтнээр нь хэлнэ.',
    'Олон тооны нэр үгтэй батлах өгүүлбэрт стандарт, бичгийн хэлээр There are хэрэглэнэ. Ярианд «There\'s two cafés» гэж сонсогдож болох ч шалгалт, бичгийн ажилд There are гэж бичээрэй.',
    'some нь батлах өгүүлбэрт, any нь асуух болон үгүйсгэх хэлбэрт түгээмэл: There is some water. · Is there any water? · There isn\'t any water.',
    'There is / There are шинэ зүйлийг анх танилцуулна. It is / They are нь өмнө дурдсан зүйлээ тайлбарлана: There is a park near here. It is very big.',
    'Хэлбэрийг зөвхөн ардах нэр үг шийднэ: a, an, one эсвэл some + үл тоологдох нэр үг → is; two, three, many, some + олон тооны нэр үг → are.',
    'Богино хариултад нэр үгээ давтахгүй: Is there a bank? — Yes, there is. / No, there isn\'t. «Yes, there is a bank» гэж бүтнээр хэлэх шаардлагагүй.',
  ],
  commonMistakes: [
    {
      wrong: 'There is two students.',
      correct: 'There are two students.',
      explanation: 'two students олон тоо. Хэлбэрийг There биш, ардах нэр үг шийднэ. Олон тоо → are.',
    },
    {
      wrong: 'Are there a bank?',
      correct: 'Is there a bank?',
      explanation: 'a bank ганц тоо. Асуултад ч мөн адил: ганц тоо → Is there, олон тоо → Are there.',
    },
    {
      wrong: 'It is a park near my house.',
      correct: 'There is a park near my house.',
      explanation: '«Байдаг» гэж шинээр танилцуулж байгаа тул There is. It is бол өмнө дурдсан зүйлийг тайлбарлахад л тохирно.',
    },
    {
      wrong: 'There is a milk in the fridge.',
      correct: 'There is some milk in the fridge.',
      explanation: 'milk үл тоологдох нэр үг тул a / an авахгүй. Оронд нь some хэрэглэнэ эсвэл ялгац гишүүнгүй орхино: There is milk.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «Ширээн дээр ном байна» — нэр үг өгүүлбэрийн дунд, «байна» хамгийн сүүлд. Англиар дараалал урвуу: эхлээд There is, дараа нь нэр үг, хамгийн сүүлд газар: There is a book on the desk.',
      'There-ийг «тэнд» гэж орчуулах хэрэггүй. «There is a park» гэдэг нь «Тэнд цэцэрлэгт хүрээлэн байна» биш, зүгээр л «Цэцэрлэгт хүрээлэн байдаг». Хаана байгааг хэлэх бол төгсгөлд нь near here, in the bag гэж тусад нь нэмнэ.',
      'Монголоор «байна» тоогоор өөрчлөгддөггүй: «Нэг муур байна», «Хоёр муур байна». Англиар нэр үгээ дагаж is / are солигдоно, нэр үг ч -s авна: There is a cat. / There are two cats.',
      'Монголоор «гурван оюутан» гэхэд нэр үг ганц тоонд үлдэнэ, ялгац гишүүн ч байхгүй. Англиар тооны дараа -s заавал (three students), ганц тооны нэр үгийн өмнө a / an заавал (a student).',
    ],
  },
  dialogue: [
    {
      en: '[Is](v) [there](s) [a shop](o) [near your house](m)?',
      mn: 'Танай гэрийн ойролцоо дэлгүүр байдаг уу?',
      speaker: 'Saraa',
    },
    {
      en: '[Yes](o), [there](s) [is](v). [There](s)[\'s](v) [a small shop](o) [on the corner](m).',
      mn: 'Байдаг. Булан дээр жижиг дэлгүүр бий.',
      speaker: 'Bat',
    },
    { en: '[Are](v) [there](s) [any cafés](o)?', mn: 'Кафе байдаг уу?', speaker: 'Saraa' },
    {
      en: '[No](o), [there](s) [aren\'t](v). But [there](s) [are](v) [two restaurants](o) [on the next street](m).',
      mn: 'Үгүй ээ, байхгүй. Харин дараагийн гудамжинд хоёр ресторан бий.',
      speaker: 'Bat',
    },
    { en: '[Is](v) [there](s) [a park](o)?', mn: 'Цэцэрлэгт хүрээлэн байдаг уу?', speaker: 'Saraa' },
    {
      en: '[Yes](o), [there](s) [is](v). [There](s) [is](v) [a big park](o) [behind the school](m).',
      mn: 'Байдаг. Сургуулийн ард том цэцэрлэгт хүрээлэн бий.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: '10-1',
      explanation: 'three students олон тоо тул There are. There is ганц тоонд л тохирно. It is шинэ зүйл танилцуулдаггүй. They is гэсэн хэлбэр байхгүй.',
      ruleId: 10,
      kind: 'fill',
      question: '___ three students in the classroom.',
      options: ['There is', 'There are', 'It is', 'They is'],
      answer: 'There are',
      hint: 'Ардах нэр үг ганц тоо юу, олон тоо юу?',
    },
    {
      id: '10-2',
      explanation: 'milk үл тоологдох нэр үг тул is. Асуултад is-ийг there-ийн урд гаргана. Are there олон тоонд л тохирно. Is it шинэ зүйл байгаа эсэхийг асуудаггүй.',
      ruleId: 10,
      kind: 'fill',
      question: '___ any milk in the fridge?',
      options: ['Is there', 'Are there', 'There is', 'Is it'],
      answer: 'Is there',
      hint: 'milk-ийг тоолж болох уу? Асуултад юу урдаа гарах вэ?',
    },
    {
      id: '10-3',
      explanation: 'chairs олон тоо тул aren\'t. isn\'t ганц тоонд л тохирно. Олон тооны нэр үгийн өмнө a орохгүй. not нь are-ийн ард залгана: are not = aren\'t.',
      ruleId: 10,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'There aren\'t any chairs in the room.',
        'There isn\'t any chairs in the room.',
        'There aren\'t a chairs in the room.',
        'There not are any chairs in the room.',
      ],
      answer: 'There aren\'t any chairs in the room.',
      hint: 'chairs олон тоо. Үгүйсгэлд not хаана орох вэ?',
    },
    {
      id: '10-4',
      explanation: 'Шинээр «байдаг» гэж танилцуулж байгаа тул There is. It is бол өмнө дурдсан зүйлийг тайлбарлана. a park ганц тоо тул are буруу. There has гэсэн бүтэц англиар байхгүй.',
      ruleId: 10,
      kind: 'translate',
      question: 'Манай гэрийн ойролцоо цэцэрлэгт хүрээлэн байдаг.',
      options: [
        'There is a park near my house.',
        'It is a park near my house.',
        'There are a park near my house.',
        'There has a park near my house.',
      ],
      answer: 'There is a park near my house.',
      hint: '«Байдаг» гэж анх удаа хэлж байна. a park ганц тоо.',
    },
  ],
};
