// frontend/src/lib/grammar/c1/rule-12.ts
// C1 дүрэм 12: Advanced concession — however / no matter / whatever / much as
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule12: GrammarRule = {
  id: 12,
  title: 'Advanced concession: however / no matter / whatever / much as',
  titleMn: 'Буултын ахисан хэлбэрүүд — «хэчнээн … ч», «юу ч болсон», «хэдий … ч»',
  hook: '«Хэчнээн хичээсэн ч», «Юу ч болсон», «Хэдий ядарсан байсан ч» — although-оос цааш нэг алхам: буулт, эсрэгцлийг илүү хүчтэй, илүү нарийн илэрхийлж сурцгаая.',
  summary: 'however + тэмдэг нэр / дайвар үг («хэчнээн … ч»), no matter how / what / who / where, whatever / whoever / wherever / whenever («юу ч, хэн ч, хаана ч, хэзээ ч … байсан») нь «ямар ч нөхцөлд үр дүн өөрчлөгдөхгүй» гэсэн утгатай. much as («хэчнээн … боловч») ба тэмдэг нэр + as / though (Tired though she was) нь бичгийн хэлний хүчтэй буулт. even though бодит баримтад, even if таамаг нөхцөлд. while / whilst албан бичигт although-ийн утгаар. Be that as it may = «тэр нь тийм байлаа ч».',
  description: 'A2-ийн 13-р дүрэмд although, however-ийг, B1-ийн 14-р дүрэмд despite / in spite of-ийг, B2-ийн 15-р дүрэмд whereas, nevertheless-ийг үзсэн. Эдгээр нь бүгд «А үнэн боловч Б» гэсэн энгийн буулт. C1-д буултыг гурван чиглэлд гүнзгийрүүлнэ. Нэгдүгээрт, «хэмжээ, сонголтоос үл хамаарах» буулт: However hard I try («би хэчнээн хичээсэн ч»), No matter what you say («чи юу ч хэлсэн»), Whatever happens («юу ч болсон»). Энд however нь B2-д үзсэн «гэсэн хэдий ч» гэсэн холбоос биш — ард нь шууд тэмдэг нэр, дайвар үг залгаж, таслалгүй бичигдэнэ. Эдгээр гишүүн өгүүлбэрт ирээдүйн утгыг одоо цагаар хэлнэ (Whatever happens, will happen биш). Хоёрдугаарт, бичгийн хэлний хүчтэй буулт: Much as I like him («би түүнд хэчнээн дуртай ч»), мөн C1-ийн 11-р дүрэмд үзсэн fronting-ийн нэг төрөл болох тэмдэг нэр + as / though — Tired though she was, Difficult as it was. Гуравдугаарт, нарийн ялгаа: even though нь бодитоор болсон зүйлд (Even though it rained — бороо орсон), even if нь болох эсэх нь тодорхойгүй эсвэл бодит бус нөхцөлд (Even if it rains — орж магадгүй). while / whilst нь албан бичиг, эрдэм шинжилгээний хэлэнд although-ийн утгаар өгүүлбэрийн эхэнд ирнэ. Be that as it may нь C1-ийн 4-р дүрмийн subjunctive-ээс үлдсэн тогтсон хэллэг — өмнөх санааг хүлээн зөвшөөрөөд өөрийн байр сууриа хэвээр үлдээнэ. Монгол хэлэнд эдгээр утгын ихэнх нь «хэчнээн / хэдий / юу ч … -сан ч» гэсэн нэг л «ч» нөхцөлөөр илэрдэг тул англи хэлний олон хэлбэрээс зөвийг нь сонгох нь гол бэрхшээл болдог.',
  structure: 'However + adj / adv + subject + verb · No matter how / what / who + clause · Whatever / Whoever / Wherever + clause · Much as + clause · Adj + as / though + subject + verb · Even if / Even though / While + clause',
  structureParts: [
    { text: 'However hard', part: 'modifier' },
    { text: 'I', part: 'subject' },
    { text: 'try', part: 'verb' },
    { text: ', I can\'t remember', part: 'plain' },
  ],
  tip: 'however + adj / adv = хэчнээн … ч (таслалгүй) · no matter + wh- = whatever / whoever / wherever · ард нь will биш одоо цаг · much as + дуртай / хүндэлдэг / хүсдэг · Tired though she was (although биш) · even though = бодит, even if = таамаг.',
  examples: [
    { en: '[However hard I try](m), [I](s) [can\'t remember](v) [his name](o).', mn: 'Би хэчнээн хичээсэн ч түүний нэрийг санаж чадахгүй байна.' },
    { en: '[No matter what you say](m), [she](s) [won\'t change](v) [her mind](o).', mn: 'Чи юу ч хэлсэн тэр бодлоо өөрчлөхгүй.' },
    { en: '[Much as I like the flat](m), [I](s) [can\'t afford](v) [it](o).', mn: 'Энэ байр надад хэчнээн таалагддаг ч би худалдаж авч чадахгүй.' },
    { en: '[Tired though she was](m), [she](s) [finished](v) [the report](o).', mn: 'Хэдий ядарсан байсан ч тэр тайлангаа дуусгасан.' },
  ],
  useCases: [
    {
      title: 'however + тэмдэг нэр / дайвар үг — «хэчнээн … ч»',
      description: 'Хэмжээ, зэрэг хэр их байх нь үр дүнд нөлөөлөхгүй гэдгийг хэлнэ. however-ийн ард ШУУД тэмдэг нэр, дайвар үг (эсвэл much / many) ирнэ, дараа нь эзэн + үйл үг. Таслалгүй. Албан хэлэнд may нэмж болно: however difficult it may be.',
      examples: [
        { en: '[However expensive it is](m), [we](s) [need](v) [a new server](o).', mn: 'Хэчнээн үнэтэй байсан ч бидэнд шинэ сервер хэрэгтэй.' },
        { en: '[However carefully you plan](m), [something](s) [always goes](v) [wrong](o).', mn: 'Хэчнээн нягт төлөвлөсөн ч ямар нэг зүйл үргэлж буруу болдог.' },
        { en: '[You](s) [should finish](v) [the course](o), [however difficult it may be](m).', mn: 'Хэчнээн хэцүү байлаа ч чи курсээ дуусгах хэрэгтэй.' },
      ],
    },
    {
      title: 'no matter + асуух үг — «… -аас үл хамааран»',
      description: 'no matter how / what / who / where / when + гишүүн өгүүлбэр. Утга нь however / whatever / whoever-тэй адил, ярианд арай түгээмэл, арай хүчтэй. no matter-ийн ард заавал асуух үг ирнэ. Ирээдүйн утгад ч одоо цаг.',
      examples: [
        { en: '[No matter how busy he is](m), [he](s) [always calls](v) [his mother](o).', mn: 'Тэр хэчнээн завгүй байсан ч ээж рүүгээ үргэлж залгадаг.' },
        { en: '[No matter who asks](m), [the answer](s) [is](v) [no](o).', mn: 'Хэн ч асуусан хариулт нь «үгүй».' },
        { en: '[No matter where you go](m), [you](s) [will find](v) [kind people](o).', mn: 'Чи хаашаа ч явсан сайхан сэтгэлтэй хүмүүстэй таарна.' },
      ],
    },
    {
      title: 'whatever / whoever / wherever / whenever / whichever',
      description: '-ever үгс нь «юу ч / хэн ч / хаана ч / хэзээ ч / аль нь ч … байсан хамаагүй» гэсэн буултын гишүүн өгүүлбэр үүсгэнэ. Гол өгүүлбэрээс таслалаар тусгаарлагдана. (Whoever finishes first can leave гэх мэт эзэн, тусагдахууны үүрэгтэй хэрэглээг C1-ийн 14-р дүрэмд үзнэ.)',
      examples: [
        { en: '[Whatever happens](m), [I](s) [will support](v) [you](o).', mn: 'Юу ч болсон би чамайг дэмжинэ.' },
        { en: '[Whoever wins the election](m), [taxes](s) [will rise](v).', mn: 'Сонгуульд хэн ч ялсан татвар өснө.' },
        { en: '[Wherever she works](m), [she](s) [makes](v) [friends](o) [quickly](m).', mn: 'Тэр хаана ч ажилласан хурдан найз нөхөдтэй болдог.' },
      ],
    },
    {
      title: 'much as ба тэмдэг нэр + as / though — бичгийн хэлний хүчтэй буулт',
      description: 'much as нь like, admire, respect, would like, enjoy зэрэг сэтгэл хандлагын үйл үгтэй хэрэглэгдэж «хэчнээн … боловч» гэнэ. Тэмдэг нэр / дайвар үг + as / though + эзэн + үйл үг нь although-оос илүү онцолсон хэлбэр — эхэнд although тавихгүй. Try as he might = «тэр хэчнээн оролдсон ч».',
      examples: [
        { en: '[Much as I respect her](m), [I](s) [disagree](v) [with her conclusion](m).', mn: 'Би түүнийг хэчнээн хүндэлдэг ч дүгнэлттэй нь санал нийлэхгүй.' },
        { en: '[Difficult as it was](m), [we](s) [reached](v) [an agreement](o).', mn: 'Хэдий хэцүү байсан ч бид тохиролцоонд хүрсэн.' },
        { en: '[Try as he might](m), [he](s) [couldn\'t open](v) [the door](o).', mn: 'Тэр хэчнээн оролдсон ч хаалгыг онгойлгож чадсангүй.' },
      ],
    },
    {
      title: 'even though / even if ба while / whilst',
      description: 'even though — бодитоор болсон, үнэн зүйл (although-ийн хүчтэй хэлбэр). even if — болох эсэх нь тодорхойгүй эсвэл бодит бус нөхцөл («болсон ч гэсэн»). while / whilst нь албан бичигт өгүүлбэрийн эхэнд «хэдийгээр … боловч» гэсэн утгаар ирнэ (whilst — британи, илүү албан).',
      examples: [
        { en: '[Even though it was snowing](m), [the flight](s) [left](v) [on time](m).', mn: 'Цас орж байсан ч нислэг цагтаа хөөрсөн. (үнэхээр орж байсан)' },
        { en: '[Even if it snows](m), [the flight](s) [will leave](v) [on time](m).', mn: 'Цас орлоо ч гэсэн нислэг цагтаа хөөрнө. (орох эсэх нь тодорхойгүй)' },
        { en: '[While I understand your position](m), [I](s) [cannot agree](v) [with it](m).', mn: 'Би таны байр суурийг ойлгож байгаа боловч санал нийлэх боломжгүй.' },
      ],
    },
  ],
  forms: [
    {
      label: 'however + adj / adv',
      structure: 'However + adjective / adverb / much / many + subject + verb (+ may), + main clause',
      examples: [
        { en: '[However late it is](m), [call](v) [me](o).', mn: 'Хэчнээн орой болсон ч над руу залгаарай.' },
        { en: '[However much he earns](m), [he](s) [is](v) [never satisfied](o).', mn: 'Тэр хэчнээн их мөнгө олсон ч хэзээ ч сэтгэл ханадаггүй.' },
        { en: '[However tempting it may be](m), [don\'t reply](v) [to that email](m).', mn: 'Хэчнээн хариулмаар санагдлаа ч тэр имэйлд бүү хариул.' },
      ],
    },
    {
      label: 'no matter + wh- / -ever',
      structure: 'No matter what / who / how / where / when + clause · Whatever / Whoever / Whichever / Wherever / Whenever + clause (одоо цаг = ирээдүй)',
      examples: [
        { en: '[No matter what happens tomorrow](m), [we](s) [will stay](v) [calm](o).', mn: 'Маргааш юу ч болсон бид тайван байна.' },
        { en: '[Whichever route you take](m), [the journey](s) [takes](v) [an hour](o).', mn: 'Чи аль ч замаар явсан нэг цаг болно.' },
        { en: '[Whenever you arrive](m), [someone](s) [will be](v) [there](m) [to meet you](m).', mn: 'Чи хэзээ ч ирсэн чамайг угтах хүн тэнд байна.' },
      ],
    },
    {
      label: 'much as / adj + as / though',
      structure: 'Much as + subject + verb · Adjective / Adverb + as / though + subject + verb · Try as + subject + might',
      examples: [
        { en: '[Much as we would like to help](m), [our budget](s) [is](v) [limited](o).', mn: 'Бид хэчнээн туслахыг хүсэж байгаа ч төсөв маань хязгаарлагдмал.' },
        { en: '[Young though he is](m), [he](s) [runs](v) [the whole department](o).', mn: 'Хэдий залуу ч тэр бүхэл хэлтсийг удирддаг.' },
        { en: '[Strange as it sounds](m), [I](s) [miss](v) [the cold](o).', mn: 'Хэдий хачирхалтай сонсогдож байгаа ч би хүйтнийг санаж байна.' },
      ],
    },
    {
      label: 'even if / whilst / be that as it may',
      structure: 'Even if + clause (таамаг) · Even though + clause (бодит) · While / Whilst + clause, + main clause · Sentence. Be that as it may, + sentence',
      examples: [
        { en: '[Even if I had the money](m), [I](s) [wouldn\'t buy](v) [that car](o).', mn: 'Надад мөнгө байсан ч гэсэн би тэр машиныг авахгүй.' },
        { en: '[Whilst the results are encouraging](m), [more research](s) [is needed](v).', mn: 'Үр дүн урам өгч байгаа боловч нэмэлт судалгаа шаардлагатай.' },
        { en: '[The plan](s) [has](v) [flaws](o). [Be that as it may](m), [it](s) [is](v) [the best we have](o).', mn: 'Төлөвлөгөөнд дутагдал бий. Тэр нь тийм байлаа ч бидэнд байгаа хамгийн сайн нь энэ.' },
      ],
    },
  ],
  signalWords: ['however + adj / adv', 'no matter how / what / who / where', 'whatever', 'whoever', 'wherever', 'whenever', 'whichever', 'much as', 'adj + as / though', 'try as I might', 'even if', 'even though', 'while / whilst', 'be that as it may'],
  notes: [
    'however хоёр өөр үүрэгтэй. (1) Холбоос: However, the plan failed — «гэсэн хэдий ч», ард нь таслал. (2) Буултын дайвар үг: However hard we tried — «хэчнээн … ч», ард нь шууд тэмдэг нэр / дайвар үг, таслалгүй.',
    'no matter / -ever гишүүн өгүүлбэрт ирээдүйн тухай ярьсан ч одоо цаг: Whatever will happen (буруу) → Whatever happens (зөв). Цаг, нөхцөлийн гишүүн өгүүлбэрийн (when, if) дүрэмтэй адил.',
    'Нэг өгүүлбэрт нэг л буултын холбоос: No matter how tired she was, but she kept working (буруу) — but илүүдэл. Монголоор «… ч, гэхдээ …» гэж давхарлаж болдог тул энэ алдаа түгээмэл.',
    'Тэмдэг нэр + as / though бүтцийн эхэнд although тавихгүй: Although tired she was (буруу) → Tired though she was / Tired as she was / Although she was tired. Энэ байрлалд although биш, зөвхөн though эсвэл as.',
    'even дангаараа холбоос биш: Even it rained (буруу) → Even though it rained (бодит) / Even if it rains (таамаг). even although гэж бас байхгүй.',
    'Хэв маяг: no matter, whatever, even though нь ярианд хэвийн. much as, тэмдэг нэр + as / though, whilst, be that as it may нь бичгийн болон албан ярианы өнгөтэй. while нь «байх зуур» гэсэн цагийн утгатай ч байдаг тул хоёрдмол утга гарахаар бол although хэрэглэ.',
  ],
  commonMistakes: [
    {
      wrong: 'However I try hard, I can\'t do it.',
      correct: 'However hard I try, I can\'t do it.',
      explanation: 'Буултын however-ийн ард тэмдэг нэр / дайвар үг ШУУД залгана: however hard, however expensive. Монголоор «хэчнээн шаргуу» гэдэгтэй яг ижил дараалал.',
    },
    {
      wrong: 'Whatever will happen, I will stay with you.',
      correct: 'Whatever happens, I will stay with you.',
      explanation: 'whatever / no matter-ийн гишүүн өгүүлбэрт ирээдүйн утгыг одоо цагаар илэрхийлнэ. will зөвхөн гол өгүүлбэрт.',
    },
    {
      wrong: 'No matter how tired she was, but she kept working.',
      correct: 'No matter how tired she was, she kept working.',
      explanation: 'no matter аль хэдийн буултыг илэрхийлж байгаа тул but давхар тавихгүй. Англи хэлэнд хоёр өгүүлбэрийг нэг л холбоос холбоно.',
    },
    {
      wrong: 'Even it was raining, we went out.',
      correct: 'Even though it was raining, we went out.',
      explanation: 'even нь дангаараа гишүүн өгүүлбэр эхлүүлж чадахгүй. Бороо үнэхээр орж байсан тул even though; таамаг бол even if.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «хэчнээн / хичнээн / хэдий + тэмдэг нэр + байсан ч» (хэчнээн үнэтэй байсан ч) гэдэг нь however + adjective-тэй яг ижил дараалалтай: however expensive it is. «Хэчнээн» гэсэн үгийн ард тэмдэг нэр шууд ирдгийг санавал However I try hard гэсэн алдаа гарахгүй.',
      'Монголоор «юу ч … -сан», «хэн ч … -сан», «хаана ч … -сан» гэж асуух үг + «ч» хэрэглэдэг. Англиар үүнийг хоёр аргаар хэлнэ: -ever (whatever, whoever, wherever) эсвэл no matter + асуух үг. Хоёулаа ижил утгатай.',
      'Монголоор «-сан ч / -лаа ч» нөхцөл нь бодит (бороо орсон ч бид гарсан) ба таамаг (бороо орсон ч бид гарна) хоёр утгыг ихэвчлэн нэг хэлбэрээр илэрхийлдэг. Англиар заавал ялгана: бодит бол even though, таамаг бол even if.',
      'Монголоор «хэдий … ч гэсэн, гэхдээ …» гэж буултыг давхарлах нь хэвийн. Англиар нэг өгүүлбэрт нэг л буултын үг байна — however / no matter / although-ийн хамт but, yet давхар хэрэглэхгүй. Мөн монголоор буултын хэсэг үргэлж эхэнд ирдэг бол англиар төгсгөлд ч байж болно: You should finish it, however difficult it may be.',
    ],
  },
  dialogue: [
    {
      en: 'Bat, [you](s) [look](v) [exhausted](o). [Are](v) [you](s) [still training](v) [for the marathon](m)?',
      mn: 'Бат, чи их ядарсан харагдаж байна. Марафонд бэлдсээр байгаа юм уу?',
      speaker: 'Tuya',
    },
    {
      en: 'Yes. [However tired I am](m), [I](s) [run](v) [ten kilometres](o) [every evening](m).',
      mn: 'Тийм. Хэчнээн ядарсан ч би орой бүр арван километр гүйдэг.',
      speaker: 'Bat',
    },
    {
      en: '[Even though it\'s minus twenty](m)? [Much as I admire you](m), [I](s) [think](v) [that\'s crazy](o).',
      mn: 'Хасах хорин хэм байхад ч уу? Би чамайг хэчнээн биширдэг ч энэ бол галзуу хэрэг гэж бодож байна.',
      speaker: 'Tuya',
    },
    {
      en: '[Whatever the weather is like](m), [I](s) [can\'t skip](v) [a day](o). [No matter how cold it gets](m), [the race](s) [won\'t wait](v).',
      mn: 'Цаг агаар ямар ч байсан би нэг ч өдөр алгасаж болохгүй. Хэчнээн хүйтэрсэн ч уралдаан хүлээхгүй.',
      speaker: 'Bat',
    },
    {
      en: '[While I see your point](m), [you](s) [should rest](v) [sometimes](m), [even if you feel fine](m).',
      mn: 'Чиний хэлснийг ойлгож байгаа ч, биеийн байдал зүгээр санагдсан ч гэсэн хааяа амрах хэрэгтэй.',
      speaker: 'Tuya',
    },
    {
      en: 'You may be right. [Be that as it may](m), [I](s)[\'m running](v) [tonight](m) — [hard though it is](m), [I](s) [love](v) [it](o).',
      mn: 'Чиний зөв байж магадгүй. Тэр нь тийм байлаа ч би өнөө орой гүйнэ — хэдий хэцүү ч би үүнд дуртай.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'c1-12-1',
      ruleId: 12,
      kind: 'fill',
      question: '___ hard he worked, he couldn\'t meet the deadline.',
      options: ['However', 'Although', 'Whatever', 'Despite'],
      answer: 'However',
      explanation: 'Ард нь шууд дайвар үг (hard) + эзэн + үйл үг байгаа тул however + adverb = «хэчнээн шаргуу ажилласан ч». Although, Whatever, Despite-ийн ард hard шууд залгахгүй.',
      hint: '«Хэчнээн … ч» + дайвар үг.',
    },
    {
      id: 'c1-12-2',
      ruleId: 12,
      kind: 'fill',
      question: 'No matter what ___ tomorrow, we will not cancel the event.',
      options: ['happens', 'will happen', 'happened', 'would happen'],
      answer: 'happens',
      explanation: 'no matter-ийн гишүүн өгүүлбэрт ирээдүйн утгыг (tomorrow) одоо цагаар илэрхийлнэ: happens. will зөвхөн гол өгүүлбэрт (we will not cancel).',
      hint: 'Гишүүн өгүүлбэрт will орохгүй.',
    },
    {
      id: 'c1-12-3',
      ruleId: 12,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Much as I like him, I don\'t trust him.',
        'Even it was late, she kept working.',
        'However the task is difficult, we must finish it.',
        'Although tired she was, she went to the gym.',
      ],
      answer: 'Much as I like him, I don\'t trust him.',
      explanation: 'Much as + эзэн + үйл үг — зөв буулт. even дангаараа холбоос биш (Even though it was late); however-ийн ард тэмдэг нэр шууд ирнэ (However difficult the task is); тэмдэг нэр урагшилсан бүтцэд although биш though / as (Tired though she was).',
      hint: 'even, however, although-ийн ард юу ирж байгааг шалга.',
    },
    {
      id: 'c1-12-4',
      ruleId: 12,
      kind: 'translate',
      question: 'Хэн ч залгасан намайг завгүй гэж хэлээрэй.',
      options: [
        'Whoever calls, tell them I\'m busy.',
        'Whoever will call, tell them I\'m busy.',
        'No matter calls who, tell them I\'m busy.',
        'However calls, tell them I\'m busy.',
      ],
      answer: 'Whoever calls, tell them I\'m busy.',
      explanation: '«Хэн ч … -сан» = whoever + одоо цаг (calls). will хэрэглэхгүй; no matter-ийн ард асуух үг шууд ирнэ (No matter who calls); however нь «хэн» гэсэн утгагүй.',
      hint: '«Хэн ч» = whoever, ард нь одоо цаг.',
    },
  ],
};
