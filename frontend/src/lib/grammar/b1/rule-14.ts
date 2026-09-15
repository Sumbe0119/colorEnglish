// frontend/src/lib/grammar/b1/rule-14.ts
// B1 дүрэм 14: Linking words — unless / as long as / in case / so that / in spite of / despite
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule14: GrammarRule = {
  id: 14,
  title: 'unless / as long as / in case / so that / despite',
  titleMn: 'Холбоос үгс — нөхцөл, зорилго, урьдчилан сэргийлэх, эсрэгцлийн дараагийн шат',
  hook: '«Яарахгүй бол хоцорно», «Бороо орвол гэж шүхэр ав», «Амжихын тулд эрт гарсан», «Ядарсан хэдий ч ажилласан» — санаа хоорондын нарийн хамаарлыг илэрхийлж сурцгаая.',
  summary: 'unless (хэрэв … биш бол), as long as / provided that (зөвхөн … л бол), in case (… байж магадгүй гэж, урьдчилан), so that / in order to (… -хын тулд), in spite of / despite (… хэдий ч, нэр үгтэй) — эдгээр нь A2-ийн because / although / however-оос илүү нарийн утгын хамаарлыг илэрхийлнэ.',
  description: 'A2 түвшинд бид because (шалтгаан), so (үр дагавар), although (эсрэгцэл), however (эсрэгцэл, шинэ өгүүлбэр) гэсэн дөрвөн холбоос үгийг үзсэн. B1-д илүү нарийн утгатай холбоос үгс нэмнэ. НӨХЦӨЛ: unless = if … not (Unless you hurry, you\'ll be late — яарахгүй бол хоцорно), as long as / provided that = зөвхөн энэ нөхцөлд (You can borrow it as long as you return it — буцааж өгөх л бол). УРЬДЧИЛАН СЭРГИЙЛЭХ: in case = ямар нэг зүйл болж магадгүй гэж бэлдэх (Take an umbrella in case it rains — бороо орвол гэж шүхэр ав). Энэ if-ээс өөр: if it rains гэвэл бороо орсон ҮЕД шүхэр ав, in case it rains гэвэл ОДОО ав, дараа нь хэрэг болж магадгүй. ЗОРИЛГО: so that + өгүүлбэр (I left early so that I could get a seat), in order to / to + V1 (I left early to get a seat). ЭСРЭГЦЭЛ: A2-ийн although-ийн ард бүтэн өгүүлбэр ирдэг байсан бол in spite of / despite-ийн ард НЭР ҮГ эсвэл V-ing ирнэ: Despite the rain, we went out. In spite of being tired, she finished. Монгол хэлэнд эдгээр утга бүр өөр өөр залгавараар (-гүй бол, -л бол, -вал гэж, -хын тулд, хэдий ч) илэрдэг тул монгол орчуулга нь зөв холбоос үг сонгоход тусална.',
  structure: 'Unless + clause, + main clause · … in case + clause · … so that + clause · Despite + noun / V-ing, + main clause',
  structureParts: [
    { text: 'Unless / In case / Despite', part: 'modifier' },
    { text: 'clause / noun', part: 'plain' },
    { text: ', subject', part: 'subject' },
    { text: 'verb …', part: 'verb' },
  ],
  tip: 'unless = «-гүй бол» · as long as = «-л бол» · in case = «-вал гэж (урьдчилж)» · so that = «-хын тулд» (өгүүлбэртэй) · despite / in spite of = «-ыг үл харгалзан» (нэр үгтэй, although-ийн оронд).',
  examples: [
    { en: '[Unless you hurry](m), [you](s)[\'ll miss](v) [the bus](o).', mn: 'Чи яарахгүй бол автобусаа алдана.' },
    { en: '[Take](v) [a jacket](o) [in case it gets cold](m).', mn: 'Хүйтэрвэл гэж хүрэм аваарай.' },
    { en: '[I](s) [wrote](v) [it](o) [down](m) [so that I wouldn\'t forget](m).', mn: 'Мартахгүйн тулд би түүнийг бичиж авсан.' },
    { en: '[Despite the rain](m), [we](s) [enjoyed](v) [the picnic](o).', mn: 'Бороотой байсан ч бид зугаалгаа сайхан өнгөрөөсөн.' },
  ],
  useCases: [
    {
      title: 'unless — хэрэв … биш бол',
      description: 'unless = if … not. Ард нь батлах өгүүлбэр ирнэ (unless … not гэж давхар үгүйсгэхгүй). Ихэвчлэн First conditional бүтцэд: Unless + Present, will. Анхааруулга, нөхцөл тавихад их хэрэглэнэ.',
      examples: [
        { en: '[You](s) [won\'t pass](v) [the exam](o) [unless you study](m).', mn: 'Чи хичээлээ давтахгүй бол шалгалтаа давахгүй.' },
        { en: '[Unless it rains](m), [we](s)[\'ll have](v) [the party](o) [outside](m).', mn: 'Бороо орохгүй бол бид үдэшлэгээ гадаа хийнэ.' },
        { en: '[I](s) [won\'t go](v) [unless you come with me](m).', mn: 'Чи надтай хамт явахгүй бол би явахгүй.' },
      ],
    },
    {
      title: 'as long as / provided that — зөвхөн … л бол',
      description: 'Нөхцөлийг онцлон тавина: энэ нөхцөл биелвэл л зөвшөөрнө. if-ээс илүү хүчтэй, «ганцхан нөхцөл» гэсэн өнгөтэй. provided that / providing нь арай албан ёсны.',
      examples: [
        { en: '[You](s) [can use](v) [my car](o) [as long as you drive carefully](m).', mn: 'Болгоомжтой жолоодох л бол чи миний машиныг хэрэглэж болно.' },
        { en: '[I](s) [don\'t mind](v) [where we go](o) [as long as it\'s warm](m).', mn: 'Дулаахан л бол хаашаа явах нь надад хамаагүй.' },
        { en: '[Provided that you finish the report](m), [you](s) [can leave](v) [early](m).', mn: 'Тайлангаа дуусгах л бол чи эрт явж болно.' },
      ],
    },
    {
      title: 'in case — … байж магадгүй гэж (урьдчилан бэлдэх)',
      description: 'Ямар нэг зүйл болж болзошгүй тул одоо урьдчилан арга хэмжээ авна. if-ээс ялгаа: if нь «болвол тэгнэ», in case нь «болж магадгүй гэж одоо бэлдэнэ». in case-ийн ард will хэрэглэхгүй, Present Simple.',
      examples: [
        { en: '[Take](v) [your phone](o) [in case you need to call me](m).', mn: 'Над руу залгах хэрэг гарвал гэж утсаа аваарай.' },
        { en: '[I](s)[\'ll leave](v) [the key](o) [under the mat](m) [in case you arrive before me](m).', mn: 'Чи надаас өмнө ирвэл гэж би түлхүүрийг дэвсгэрийн доор үлдээе.' },
        { en: '[We](s) [bought](v) [extra food](o) [in case more people came](m).', mn: 'Илүү олон хүн ирвэл гэж бид нэмэлт хоол авсан.' },
      ],
    },
    {
      title: 'so that / in order to / to — зорилго',
      description: 'so that-ын ард бүтэн өгүүлбэр (эзэн + can / could / will / would + үйл үг). in order to / to-гийн ард V1. Хоёулаа «-хын тулд» гэсэн утгатай. Зорилгын эзэн өөр байвал so that хэрэглэнэ.',
      examples: [
        { en: '[She](s) [studies](v) [hard](m) [so that she can get a scholarship](m).', mn: 'Тэр тэтгэлэг авахын тулд шаргуу сурдаг.' },
        { en: '[I](s) [spoke](v) [slowly](m) [so that everyone would understand](m).', mn: 'Бүгд ойлгохын тулд би удаан ярьсан.' },
        { en: '[He](s) [went](v) [to Korea](m) [in order to find work](m).', mn: 'Тэр ажил олохын тулд Солонгос руу явсан.' },
      ],
    },
    {
      title: 'in spite of / despite — эсрэгцэл, нэр үгтэй (although-ийн хувилбар)',
      description: 'A2-ийн although-ийн ард бүтэн өгүүлбэр ирдэг. in spite of / despite-ийн ард НЭР ҮГ, V-ing, эсвэл the fact that + өгүүлбэр ирнэ. despite-ийн ард of БАЙХГҮЙ. Хоёулаа ижил утгатай, despite арай албан ёсны.',
      examples: [
        { en: '[Although it was raining](m), [we](s) [went](v) [out](m). = [Despite the rain](m), [we](s) [went](v) [out](m).', mn: 'Хэдийгээр бороо орж байсан ч бид гадуур гарсан. = Бороог үл харгалзан бид гадуур гарсан.' },
        { en: '[In spite of being ill](m), [she](s) [went](v) [to work](m).', mn: 'Өвчтэй байсан ч тэр ажилдаа явсан.' },
        { en: '[He](s) [passed](v) [the exam](o) [despite the fact that he hadn\'t studied](m).', mn: 'Тэр хичээлээ давтаагүй байсан ч шалгалтаа давсан.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Нөхцөл — unless / as long as / provided that',
      structure: 'Unless + Present Simple, + will … · … as long as + Present Simple',
      examples: [
        { en: '[Unless we leave now](m), [we](s)[\'ll be](v) [late](o).', mn: 'Одоо гарахгүй бол бид хоцорно.' },
        { en: '[You](s)[\'ll be](v) [fine](o) [as long as you follow the instructions](m).', mn: 'Заавраа дагах л бол чи зүгээр байна.' },
        { en: '[We](s)[\'ll go](v) [camping](o) [provided that the weather is good](m).', mn: 'Цаг агаар сайхан л бол бид майхантай аялна.' },
      ],
    },
    {
      label: 'Урьдчилан сэргийлэх — in case',
      structure: 'Main clause + in case + Present Simple / Past Simple (will байхгүй)',
      examples: [
        { en: '[Write](v) [it](o) [down](m) [in case you forget](m).', mn: 'Мартвал гэж бичиж аваарай.' },
        { en: '[I](s) [took](v) [a map](o) [in case I got lost](m).', mn: 'Төөрвөл гэж би газрын зураг авсан.' },
        { en: '[Keep](v) [the receipt](o) [in case there\'s a problem](m).', mn: 'Асуудал гарвал гэж баримтаа хадгалаарай.' },
      ],
    },
    {
      label: 'Зорилго — so that / in order to / to',
      structure: 'so that + subject + can / could / will / would + V1 · in order to + V1 · to + V1',
      examples: [
        { en: '[I](s)[\'ll send](v) [you](o) [the address](o) [so that you can find us](m).', mn: 'Чи биднийг олохын тулд би чамд хаягаа илгээе.' },
        { en: '[She](s) [moved](v) [to the city](m) [in order to study](m).', mn: 'Тэр суралцахын тулд хот руу нүүсэн.' },
        { en: '[We](s) [got up](v) [early](m) [to catch the first bus](m).', mn: 'Бид эхний автобусанд амжихын тулд эрт боссон.' },
      ],
    },
    {
      label: 'Эсрэгцэл — in spite of / despite',
      structure: 'In spite of / Despite + noun / V-ing / the fact that + clause, + main clause',
      examples: [
        { en: '[Despite his age](m), [he](s) [runs](v) [every day](m).', mn: 'Настай хэдий ч тэр өдөр бүр гүйдэг.' },
        { en: '[In spite of the traffic](m), [we](s) [arrived](v) [on time](m).', mn: 'Түгжрэлтэй байсан ч бид цагтаа ирсэн.' },
        { en: '[She](s) [kept](v) [smiling](o) [despite feeling nervous](m).', mn: 'Сандарч байсан ч тэр инээмсэглэсээр байсан.' },
      ],
    },
  ],
  signalWords: ['unless', 'as long as', 'provided that', 'in case', 'so that', 'in order to', 'in spite of', 'despite', 'even if', 'otherwise'],
  notes: [
    'unless-ийн ард үгүйсгэл давхардуулахгүй: Unless you don\'t hurry (буруу) → Unless you hurry (зөв). unless өөрөө «биш бол» гэсэн утгатай.',
    'in case ба if хоёрын ялгаа: I\'ll take an umbrella if it rains (бороо орвол авна — дараа). I\'ll take an umbrella in case it rains (одоо авна, бороо орж магадгүй). in case-ийн ард will хэрэглэхгүй.',
    'despite-ийн ард of байхгүй: despite of the rain (буруу) → despite the rain / in spite of the rain (зөв).',
    'despite / in spite of-ийн ард бүтэн өгүүлбэр шууд ирэхгүй. Өгүүлбэр залгах бол the fact that нэмнэ эсвэл although хэрэглэнэ: Despite the fact that it rained = Although it rained.',
    'so that-ын that-ыг ярианд орхиж болно: I left early so I could get a seat. Гэхдээ энэ so нь A2-ийн «тиймээс» so-той адил харагддаг тул контекстээс ялгана.',
    'otherwise (эс тэгвэл) нь unless-тэй ойролцоо утгыг шинэ өгүүлбэрээр илэрхийлнэ: Hurry up. Otherwise, you\'ll be late. = Unless you hurry, you\'ll be late.',
  ],
  commonMistakes: [
    {
      wrong: 'Unless you don\'t study, you will fail.',
      correct: 'Unless you study, you will fail.',
      explanation: 'unless аль хэдийн үгүйсгэх утгатай (if … not). Давхар үгүйсгэвэл утга эсрэгээрээ болно. Монголоор «давтахгүй бол» гэж үгүйсгэл байдаг тул don\'t нэмэх алдаа гардаг.',
    },
    {
      wrong: 'Despite of the bad weather, we went hiking.',
      correct: 'Despite the bad weather, we went hiking.',
      explanation: 'despite-ийн ард of байхгүй. of нь зөвхөн in spite of-д байдаг. Хоёрыг холихгүй.',
    },
    {
      wrong: 'In spite of it was late, she kept working.',
      correct: 'Although it was late, she kept working. / In spite of the late hour, she kept working.',
      explanation: 'in spite of-ийн ард бүтэн өгүүлбэр (it was late) ирэхгүй — нэр үг эсвэл V-ing. Өгүүлбэр залгах бол although.',
    },
    {
      wrong: 'Take an umbrella in case it will rain.',
      correct: 'Take an umbrella in case it rains.',
      explanation: 'in case-ийн ард Present Simple, will биш. Цагийн болон нөхцөлийн дагалдах өгүүлбэрт will хэрэглэхгүй гэдэг дүрэм энд ч хүчинтэй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «-гүй бол» (яарахгүй бол) = unless. Монголд үгүйсгэл үйл үг дээрээ байдаг бол англиар unless өөрөө үгүйсгэлийг агуулдаг тул ард нь батлах үйл үг ирнэ: Unless you hurry (not-гүй).',
      'Монголоор «-вал гэж» (бороо орвол гэж шүхэр ав) гэсэн хэллэг in case-ийн утгыг яг өгдөг — урьдчилан бэлдэх. «-вал» дангаараа бол if. Энэ «гэж» in case-ийг if-ээс ялгахад тусална.',
      'Монголоор «-хын тулд» (амжихын тулд) нь so that / in order to хоёуланд нь тохирно. Ялгаа нь англиар so that-ын ард бүтэн өгүүлбэр (эзэн + модаль + үйл үг), in order to-гийн ард V1 ирдэгт байна.',
      'Монголоор «хэдийгээр … ч» (although) ба «-ыг үл харгалзан» (despite) хоёулаа байдаг ба сүүлийнх нь нэр үгтэй хэрэглэгддэг нь англитай яг таардаг: «бороог үл харгалзан» = despite the rain. Монголоор «хэдий ч» гэж хэлсэн бол англиар нэр үг үү, өгүүлбэр үү гэдгээр although / despite-ийг сонгоно.',
    ],
  },
  dialogue: [
    {
      en: 'Bat, [are](v) [we](s) [still going](v) [hiking](o) [tomorrow](m)?',
      mn: 'Бат, бид маргааш явган аялалд явах хэвээр үү?',
      speaker: 'Saraa',
    },
    {
      en: 'Yes, [unless the weather gets really bad](m). [Bring](v) [a raincoat](o) [in case it rains](m).',
      mn: 'Тийм, цаг агаар үнэхээр муудахгүй л бол. Бороо орвол гэж борооны цув аваарай.',
      speaker: 'Bat',
    },
    {
      en: 'OK. [I](s)[\'ll also bring](v) [extra water](o) [so that we don\'t get thirsty](m).',
      mn: 'За. Бид цангахгүйн тулд нэмэлт ус бас авъя.',
      speaker: 'Saraa',
    },
    {
      en: 'Good idea. [We](s) [can take](v) [the short route](o) [as long as everyone is fit enough](m).',
      mn: 'Сайн санаа. Бүгд хангалттай тэнхээтэй л бол бид богино замаар явж болно.',
      speaker: 'Bat',
    },
    {
      en: '[Tuya](s) [wants](v) [to come](o) [despite her sore knee](m).',
      mn: 'Туяа өвдөг нь өвдөж байгаа ч ирэхийг хүсэж байна.',
      speaker: 'Saraa',
    },
    {
      en: 'Fine, [but](m) [she](s) [should bring](v) [a bandage](o) [in case it gets worse](m). [Otherwise](m), [she](s) [might not make](v) [it back](o).',
      mn: 'За, гэхдээ дордвол гэж боолт авчрах хэрэгтэй. Эс тэгвэл буцаж ирж чадахгүй байж магадгүй.',
      speaker: 'Bat',
    },
  ],
  quiz: [
    {
      id: 'b1-14-1',
      ruleId: 14,
      kind: 'fill',
      question: 'You\'ll miss the train ___ you leave right now.',
      options: ['unless', 'if', 'in case', 'so that'],
      answer: 'unless',
      explanation: '«Одоо гарахгүй бол галт тэргээ алдана» — if … not = unless. if гэвэл «гарвал алдана» гэсэн утгагүй утга гарна.',
      hint: '«-гүй бол».',
    },
    {
      id: 'b1-14-2',
      ruleId: 14,
      kind: 'fill',
      question: 'Take some cash ___ the restaurant doesn\'t accept cards.',
      options: ['unless', 'in case', 'so that', 'despite'],
      answer: 'in case',
      explanation: 'Ресторан карт авдаггүй байж магадгүй гэж урьдчилан бэлэн мөнгө ав — in case. unless гэвэл «авдаггүй биш бол» гэсэн утгагүй.',
      hint: '«-вал гэж» урьдчилан бэлдэх.',
    },
    {
      id: 'b1-14-3',
      ruleId: 14,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Despite of the snow, the flight left on time.',
        'In spite of it was snowing, the flight left on time.',
        'Despite the snow, the flight left on time.',
        'Unless it wasn\'t snowing, the flight left on time.',
      ],
      answer: 'Despite the snow, the flight left on time.',
      explanation: 'despite + нэр үг — зөв. despite-ийн ард of байхгүй; in spite of-ийн ард бүтэн өгүүлбэр ирэхгүй; unless-тэй давхар үгүйсгэл буруу.',
      hint: 'despite + нэр үг, of-гүй.',
    },
    {
      id: 'b1-14-4',
      ruleId: 14,
      kind: 'translate',
      question: 'Бүгд сонсохын тулд би чанга ярьсан.',
      options: [
        'I spoke loudly so that everyone could hear.',
        'I spoke loudly in case everyone could hear.',
        'I spoke loudly unless everyone could hear.',
        'I spoke loudly despite everyone could hear.',
      ],
      answer: 'I spoke loudly so that everyone could hear.',
      explanation: '«-хын тулд» = зорилго. Зорилгын эзэн (everyone) өөр тул so that + өгүүлбэр. in case урьдчилан сэргийлэх, unless нөхцөл, despite эсрэгцэл.',
      hint: '«-хын тулд» + өөр эзэн.',
    },
  ],
};
