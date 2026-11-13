// frontend/src/lib/grammar/b2/rule-15.ts
// B2 дүрэм 15: Linkers — whereas / nevertheless / moreover / therefore / so … that / such … that
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b2Rule15: GrammarRule = {
  id: 15,
  title: 'Linkers: whereas / nevertheless / moreover / therefore',
  titleMn: 'Холбоос үгс — эсрэгцүүлэл, нэмэлт, үр дагаврыг албан хэв маягаар илэрхийлэх',
  hook: '«Ах маань даруу, харин дүү маань цовоо», «Үнэтэй байсан. Гэсэн хэдий ч авсан», «Түүнээс гадна…», «Иймээс…», «Маш их ядарсан тул шууд унтсан» — эссэ, тайлан, албан захидалдаа санаагаа цэгцтэй холбож сурцгаая.',
  summary: 'Эсрэгцүүлэл: whereas / while (харин — хоёр баримтыг зэрэгцүүлнэ), nevertheless / nonetheless (гэсэн хэдий ч), on the other hand (нөгөө талаас). Нэмэлт: moreover / furthermore / in addition (түүнээс гадна). Үр дагавар: therefore / consequently / as a result (иймээс, үүний үр дүнд). so + тэмдэг нэр + that / such + (a) + нэр үг + that нь «маш … тул» гэсэн үр дагавар. whereas / while нь нэг өгүүлбэр дотор хоёр хэсгийг холбодог бол бусад нь шинэ өгүүлбэр эхлүүлж, ард нь таслал авна.',
  description: 'A2-ийн 13-р дүрэмд бид because, so, although, however-ийг, B1-ийн 14-р дүрэмд unless, in case, so that, despite / in spite of-ийг үзсэн. B2 түвшинд эссэ, тайлан, албан захидал бичихэд илүү албан ёсны, нарийн холбоос үгс шаардагдана. Тэдгээрийг гурван бүлэгт хуваана. ЭСРЭГЦҮҮЛЭЛ: whereas / while нь хоёр өөр баримтыг зэрэгцүүлж харьцуулна (My brother is quiet, whereas I am talkative) — энэ нь although-оос өөр: although гэнэтийн, хүлээгээгүй үр дүнг заадаг бол whereas зүгээр л ялгааг харуулна. nevertheless / nonetheless нь however-ийн илүү албан, хүчтэй хувилбар бөгөөд «тэгсэн ч гэсэн» гэсэн утгатай. on the other hand нь нэг асуудлын нөгөө талыг танилцуулна. НЭМЭЛТ: moreover / furthermore / in addition / what is more нь and, also-ийн албан хувилбар бөгөөд өмнөх санааг дэмжих шинэ баримт нэмнэ. ҮР ДАГАВАР: therefore / consequently / as a result / thus нь so-ийн албан хувилбар. Мөн so + тэмдэг нэр / дайвар үг + that ба such + (a / an) + (тэмдэг нэр) + нэр үг + that нь шалтгаан нь маш хүчтэй байснаас үр дагавар гарсныг заана. ХАМГИЙН ЧУХАЛ НЬ дүрмийн ялгаа: whereas, while, although нь conjunction — хоёр хэсгийг НЭГ өгүүлбэрт холбоно. Харин nevertheless, moreover, therefore, however зэрэг нь connecting adverb — ШИНЭ өгүүлбэр (эсвэл цэгтэй таслалын дараа) эхлүүлж, ард нь таслал авна; хоёр өгүүлбэрийг зөвхөн таслалаар залгаж болохгүй. Монгол хэлэнд «харин», «гэсэн хэдий ч», «түүнээс гадна», «иймээс» гэсэн дүйцэл бүгд бий, гэхдээ монголоор өгүүлбэрүүдийг нөхцөлөөр (-ж, -аад, -сан тул) залгаж урт өгүүлбэр үүсгэдэг зуршил англи бичигт цэг таслалын алдаа болж хувирдаг.',
  structure: 'clause, whereas / while + clause · Sentence. Nevertheless / Moreover / Therefore, + sentence · so + adjective + that + clause · such + (a / an) + (adjective) + noun + that + clause',
  structureParts: [
    { text: 'Sentence.', part: 'plain' },
    { text: 'Nevertheless / Moreover / Therefore,', part: 'modifier' },
    { text: 'subject', part: 'subject' },
    { text: 'verb …', part: 'verb' },
    { text: '· …, whereas + clause', part: 'modifier' },
  ],
  tip: 'whereas / while = «харин» (нэг өгүүлбэрт, таслалтай) · nevertheless / nonetheless = «гэсэн хэдий ч» (шинэ өгүүлбэр) · moreover / furthermore / in addition = «түүнээс гадна» · therefore / consequently / as a result = «иймээс» · so + adj + that / such + noun + that = «маш … тул».',
  examples: [
    { en: '[My sister](s) [loves](v) [the city](o), [whereas I prefer the countryside](m).', mn: 'Эгч маань хотод дуртай, харин би хөдөөг илүүд үздэг.' },
    { en: '[The tickets](s) [were](v) [expensive](o). [Nevertheless](m), [we](s) [decided](v) [to go](o).', mn: 'Тасалбар үнэтэй байсан. Гэсэн хэдий ч бид явахаар шийдсэн.' },
    { en: '[The flat](s) [is](v) [small](o). [Moreover](m), [it](s) [is](v) [far from the centre](o).', mn: 'Байр жижиг. Түүнээс гадна төвөөс хол.' },
    { en: '[It](s) [was](v) [so cold](o) [that the river froze](m).', mn: 'Маш хүйтэн байсан тул гол хөлдсөн.' },
  ],
  useCases: [
    {
      title: 'whereas / while — хоёр баримтыг зэрэгцүүлэн харьцуулах',
      description: 'Хоёр хүн, зүйл, нөхцөл байдлын ялгааг харуулна. Нэг өгүүлбэрт, ихэвчлэн өмнөө таслалтай. Өгүүлбэрийн эхэнд ч ирж болно. while нь мөн «-ж байхад» гэсэн цагийн утгатай тул тодорхой эсрэгцүүлэлд whereas илүү аюулгүй.',
      examples: [
        { en: '[Summers](s) [here](m) [are](v) [short and hot](o), [whereas winters are long and extremely cold](m).', mn: 'Энд зун богино, халуун, харин өвөл урт, тэсгим хүйтэн байдаг.' },
        { en: '[While some people enjoy working from home](m), [others](s) [find](v) [it](o) [lonely](o).', mn: 'Зарим хүн гэрээсээ ажиллах дуртай байхад бусад нь үүнийг ганцаардмал гэж үздэг.' },
        { en: '[Whereas the old system was slow](m), [the new one](s) [is](v) [remarkably fast](o).', mn: 'Хуучин систем удаан байсан бол шинэ нь гайхалтай хурдан.' },
      ],
    },
    {
      title: 'nevertheless / nonetheless / on the other hand — эсрэг санаа, шинэ өгүүлбэрээр',
      description: 'nevertheless / nonetheless = «тэгсэн ч гэсэн» — өмнөх баримтыг үл харгалзан гарсан үр дүн (however-ээс албан, хүчтэй). on the other hand = «нөгөө талаас» — асуудлын өөр талыг харуулна. Шинэ өгүүлбэр эхлүүлж, ард нь таслал авна.',
      examples: [
        { en: '[The team](s) [played](v) [badly](m). [Nevertheless](m), [they](s) [won](v) [the match](o).', mn: 'Баг муу тоглосон. Гэсэн хэдий ч тэд тоглолтод хожсон.' },
        { en: '[The risks](s) [are](v) [well known](o). [Nonetheless](m), [many people](s) [continue](v) [to smoke](o).', mn: 'Эрсдэл нь сайн мэдэгдэж байгаа. Гэсэн ч олон хүн тамхи татсаар байна.' },
        { en: '[The job](s) [pays](v) [well](m). [On the other hand](m), [the hours](s) [are](v) [very long](o).', mn: 'Энэ ажил сайн цалинтай. Нөгөө талаас ажлын цаг нь маш урт.' },
      ],
    },
    {
      title: 'moreover / furthermore / in addition — баримт нэмэх',
      description: 'Өмнөх санааг дэмжих, бататгах шинэ баримт нэмнэ. and, also-ийн албан хувилбар — эссэ, тайлан, илтгэлд. in addition to + нэр үг / V-ing хэлбэрээр ч хэрэглэнэ. Ярианд what\'s more, besides илүү тохирно.',
      examples: [
        { en: '[Cycling](s) [is](v) [good for your health](o). [Moreover](m), [it](s) [costs](v) [almost nothing](o).', mn: 'Дугуй унах нь эрүүл мэндэд тустай. Түүнээс гадна бараг зардалгүй.' },
        { en: '[The plan](s) [is](v) [too expensive](o). [Furthermore](m), [it](s) [would take](v) [years](o) [to complete](m).', mn: 'Төлөвлөгөө хэтэрхий өртөгтэй. Цаашилбал, үүнийг дуусгахад олон жил шаардагдана.' },
        { en: '[In addition to her full-time job](m), [she](s) [runs](v) [a small online shop](o).', mn: 'Үндсэн ажлаасаа гадна тэр жижиг онлайн дэлгүүр ажиллуулдаг.' },
      ],
    },
    {
      title: 'therefore / consequently / as a result — үр дагавар',
      description: 'Өмнөх өгүүлбэрийн логик үр дүн, дүгнэлтийг заана. so-ийн албан хувилбар. therefore нь логик дүгнэлтэд, consequently / as a result нь бодит үр дагаварт түгээмэл. as a result of + нэр үг хэлбэр ч бий.',
      examples: [
        { en: '[Demand](s) [has fallen](v) [sharply](m). [Therefore](m), [the company](s) [has decided](v) [to cut prices](o).', mn: 'Эрэлт огцом буурсан. Иймээс компани үнээ бууруулахаар шийдсэн.' },
        { en: '[He](s) [ignored](v) [the doctor\'s advice](o). [Consequently](m), [his condition](s) [got](v) [worse](o).', mn: 'Тэр эмчийн зөвлөгөөг үл тоосон. Үүний улмаас биеийн байдал нь дордсон.' },
        { en: '[Many flights](s) [were cancelled](v) [as a result of the storm](m).', mn: 'Шуурганы улмаас олон нислэг цуцлагдсан.' },
      ],
    },
    {
      title: 'so … that / such … that — маш … тул',
      description: 'so + тэмдэг нэр / дайвар үг + that; so much / many + нэр үг + that; such + a / an + (тэмдэг нэр) + ганц тооны нэр үг + that; such + (тэмдэг нэр) + олон тоо / тоолж болохгүй нэр үг + that. Шалтгааны хүч нь үр дагаварт хүргэснийг заана.',
      examples: [
        { en: '[She](s) [spoke](v) [so quietly](m) [that nobody could hear her](m).', mn: 'Тэр маш намуухан ярьсан тул хэн ч сонсож чадаагүй.' },
        { en: '[It](s) [was](v) [such a good film](o) [that I watched it twice](m).', mn: 'Маш сайн кино байсан тул би хоёр удаа үзсэн.' },
        { en: '[There](s) [were](v) [so many people](o) [that we couldn\'t find a seat](m).', mn: 'Маш олон хүн байсан тул бид суудал олж чадаагүй.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Эсрэгцүүлэл — whereas / while (conjunction)',
      structure: 'clause, + whereas / while + clause · Whereas / While + clause, + clause',
      examples: [
        { en: '[Bat](s) [is](v) [very organised](o), [whereas his brother is always late](m).', mn: 'Бат их цэгцтэй, харин дүү нь үргэлж хоцордог.' },
        { en: '[Rents](s) [have risen](v), [while salaries have stayed the same](m).', mn: 'Түрээс өссөн, харин цалин хэвээрээ байна.' },
        { en: '[While I understand your point](m), [I](s) [can\'t agree](v) [with it](m).', mn: 'Би таны санааг ойлгож байгаа ч үүнтэй санал нийлж чадахгүй.' },
      ],
    },
    {
      label: 'Эсрэгцүүлэл — nevertheless / nonetheless / on the other hand (adverb)',
      structure: 'Sentence. + Nevertheless / Nonetheless / On the other hand, + sentence',
      examples: [
        { en: '[It](s) [rained](v) [all week](m). [Nevertheless](m), [we](s) [had](v) [a great holiday](o).', mn: 'Долоо хоногийн турш бороо орсон. Гэсэн хэдий ч бид гайхалтай амарсан.' },
        { en: '[The evidence](s) [is](v) [weak](o). [Nonetheless](m), [the theory](s) [remains](v) [popular](o).', mn: 'Нотолгоо нь сул. Гэсэн ч энэ онол түгээмэл хэвээр байна.' },
        { en: '[A car](s) [gives](v) [you](o) [freedom](o). [On the other hand](m), [it](s) [is](v) [expensive to run](o).', mn: 'Машин чамд эрх чөлөө өгдөг. Нөгөө талаас ашиглалтын зардал нь өндөр.' },
      ],
    },
    {
      label: 'Нэмэлт ба үр дагавар — moreover / therefore … (adverb)',
      structure: 'Sentence. + Moreover / Furthermore / In addition / Therefore / Consequently / As a result, + sentence',
      examples: [
        { en: '[The hotel](s) [was](v) [dirty](o). [In addition](m), [the staff](s) [were](v) [rude](o).', mn: 'Зочид буудал бохир байсан. Дээрээс нь ажилчид нь бүдүүлэг байсан.' },
        { en: '[The road](s) [was](v) [closed](o). [As a result](m), [we](s) [arrived](v) [three hours late](m).', mn: 'Зам хаалттай байсан. Үүний улмаас бид гурван цаг хоцорч ирсэн.' },
        { en: '[She](s) [had](v) [the best results](o); [therefore](m), [she](s) [was offered](v) [the scholarship](o).', mn: 'Тэр хамгийн сайн дүн үзүүлсэн; иймээс түүнд тэтгэлэг санал болгосон.' },
      ],
    },
    {
      label: 'so … that / such … that',
      structure: 'so + adjective / adverb + that · so much / many + noun + that · such + (a / an) + (adjective) + noun + that',
      examples: [
        { en: '[The soup](s) [was](v) [so salty](o) [that I couldn\'t eat it](m).', mn: 'Шөл маш шорвог байсан тул би идэж чадаагүй.' },
        { en: '[They](s) [are](v) [such kind people](o) [that everyone likes them](m).', mn: 'Тэд маш сайхан сэтгэлтэй хүмүүс тул бүгд тэдэнд дуртай.' },
        { en: '[He](s) [made](v) [such a lot of noise](o) [that the baby woke up](m).', mn: 'Тэр маш их чимээ гаргасан тул нялх хүүхэд сэрчихсэн.' },
      ],
    },
  ],
  signalWords: ['whereas', 'while', 'nevertheless', 'nonetheless', 'on the other hand', 'moreover', 'furthermore', 'in addition', 'therefore', 'consequently', 'as a result', 'so … that', 'such … that'],
  notes: [
    'whereas, while, although нь conjunction — хоёр хэсгийг нэг өгүүлбэрт холбоно. nevertheless, moreover, therefore, however нь adverb — хоёр өгүүлбэрийг зөвхөн таслалаар залгаж чадахгүй. It was late, nevertheless we continued (буруу) → It was late. Nevertheless, we continued.',
    'Adverb холбоос өгүүлбэрийн эхэнд ирвэл ард нь таслал тавина: Therefore, … / Moreover, …. Өгүүлбэрийн дунд ч ирж болно: We therefore decided to wait. The plan, however, failed.',
    'whereas ба although ялгаатай: whereas зүгээр л хоёр баримтыг харьцуулна (I like tea, whereas he likes coffee), although хүлээгээгүй үр дүнг заана (Although I like tea, I ordered coffee).',
    'on the other hand нь нэг асуудлын хоёр талыг жинлэхэд (заримдаа on the one hand …-тай хос). on the contrary бол өөр — өмнөх санааг бүрмөсөн үгүйсгэнэ: It wasn\'t boring. On the contrary, I loved it.',
    'so + тэмдэг нэр (so tired), such + нэр үгийн бүлэг (such a tiring day). Нэр үг байвал such, байхгүй бол so. Гэхдээ much / many / few / little-тэй бол so: so many people, so little time.',
    'Эдгээр үгс албан хэв маягт тохирно. Найзтайгаа ярихдаа moreover, consequently гэвэл хэт албархуу сонсогдоно — but, also, so, what\'s more хэрэглээрэй. Эссэд нэг үгийг давтахгүйн тулд ижил утгатай үгсийг сольж хэрэглэ.',
  ],
  commonMistakes: [
    {
      wrong: 'The hotel was expensive, nevertheless we stayed there.',
      correct: 'The hotel was expensive. Nevertheless, we stayed there.',
      explanation: 'nevertheless бол conjunction биш, adverb. Хоёр бүтэн өгүүлбэрийг таслалаар залгаж болохгүй — цэг (эсвэл цэгтэй таслал) тавьж, nevertheless-ийн ард таслал авна.',
    },
    {
      wrong: 'Whereas my brother likes football, but I prefer basketball.',
      correct: 'Whereas my brother likes football, I prefer basketball.',
      explanation: 'whereas өөрөө эсрэгцүүлэх холбоос тул but давхар хэрэглэхгүй. Монголоор «… байхад харин …» гэж хоёр үг ордог тул but нэмэх алдаа гардаг.',
    },
    {
      wrong: 'It was so beautiful day that we went for a walk.',
      correct: 'It was such a beautiful day that we went for a walk.',
      explanation: 'Тэмдэг нэрийн ард нэр үг (day) байгаа тул such a + тэмдэг нэр + нэр үг. so зөвхөн тэмдэг нэр / дайвар үг дангаар байхад: The day was so beautiful that …',
    },
    {
      wrong: 'He studied very hard that he passed every exam.',
      correct: 'He studied so hard that he passed every exam.',
      explanation: 'that-тай үр дагаврын бүтцэд very биш so хэрэглэнэ: so + дайвар үг + that. very нь that-өгүүлбэртэй холбогддоггүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор «харин» (Ах маань өндөр, харин би намхан) нь whereas / while-ийн утгыг өгнө. Мөн «-ж байхад», «… бол … нь» гэсэн хэлбэр ч таарна. Монголоор «харин»-ыг шинэ өгүүлбэрийн эхэнд ч тавьдаг бол англиар whereas хоёр хэсгийг нэг өгүүлбэрт холбоно.',
      'Монголоор «гэсэн хэдий ч», «тэгсэн ч гэсэн» = nevertheless / nonetheless; «түүнээс гадна», «цаашилбал» = moreover / furthermore / in addition; «иймээс», «тиймээс», «үүний улмаас» = therefore / consequently / as a result. Эдгээр нь монголд ч шинэ өгүүлбэр эхлүүлдэг тул байрлал нь адил — англиар ард нь таслал тавихаа л мартахгүй байхад болно.',
      'Монголоор өгүүлбэрүүдийг «-ж, -аад, -сан тул, -сан боловч» гэх мэт нөхцөлөөр залган маш урт нэг өгүүлбэр үүсгэдэг. Үүнийг англи руу шууд буулгавал таслалаар залгасан буруу өгүүлбэр (comma splice) гарна. Англиар богино өгүүлбэрүүдэд хувааж, эхэнд нь тохирох холбоос үг тавина.',
      'Монголоор «маш … тул», «… гэж жигтэйхэн … байсан» гэдэг нь so … that / such … that-тай дүйнэ. Монголд тэмдэг нэрийн ард нэр үг байгаа эсэх нь хэлбэрт нөлөөлдөггүй («маш сайхан тул», «маш сайхан өдөр байсан тул») бол англиар нэр үг байвал such, байхгүй бол so гэж сонгоно.',
    ],
  },
  dialogue: [
    {
      en: 'Saraa, [have](v) [you](s) [finished](v) [your essay](o) [on city life](m)?',
      mn: 'Сараа, чи хотын амьдралын тухай эссэгээ дуусгасан уу?',
      speaker: 'Temuulen',
    },
    {
      en: 'Almost. [I](s) [wrote](v) [that the city offers more jobs](o), [whereas the countryside offers a calmer life](m).',
      mn: 'Бараг. Хот илүү олон ажлын байр санал болгодог, харин хөдөө илүү тайван амьдралыг өгдөг гэж бичсэн.',
      speaker: 'Saraa',
    },
    {
      en: 'Good contrast. [You](s) [could add](v) [that the air is polluted](o). [Moreover](m), [the traffic](s) [is](v) [terrible](o).',
      mn: 'Сайн эсрэгцүүлэл байна. Агаар бохирдолтой гэдгийг нэмж болно. Түүнээс гадна замын түгжрэл аймшигтай.',
      speaker: 'Temuulen',
    },
    {
      en: 'True. [The traffic](s) [is](v) [so bad](o) [that I spend two hours a day on the bus](m). [Nevertheless](m), [I](s) [wouldn\'t move](v).',
      mn: 'Үнэн. Түгжрэл маш их тул би өдөрт хоёр цагийг автобусанд өнгөрөөдөг. Гэсэн хэдий ч би нүүхгүй.',
      speaker: 'Saraa',
    },
    {
      en: '[Why](m) [not](m)?',
      mn: 'Яагаад?',
      speaker: 'Temuulen',
    },
    {
      en: '[My family and my job](s) [are](v) [here](m). [Therefore](m), [my conclusion](s) [is](v) [that the city is still the better choice for me](o).',
      mn: 'Гэр бүл, ажил маань энд байгаа. Иймээс миний дүгнэлт бол хот надад илүү тохиромжтой сонголт хэвээр байна гэсэн үг.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'b2-15-1',
      ruleId: 15,
      kind: 'fill',
      question: 'The north of the country is mountainous, ___ the south is mostly flat.',
      options: ['whereas', 'nevertheless', 'therefore', 'moreover'],
      answer: 'whereas',
      explanation: 'Хоёр баримтыг (хойд хэсэг / өмнөд хэсэг) нэг өгүүлбэр дотор зэрэгцүүлэн харьцуулж байна — conjunction хэрэгтэй: whereas. nevertheless, therefore, moreover нь adverb тул таслалын ард хоёр өгүүлбэрийг холбож чадахгүй, утгаараа ч тохирохгүй.',
      hint: '«Харин» — нэг өгүүлбэр дотор.',
    },
    {
      id: 'b2-15-2',
      ruleId: 15,
      kind: 'fill',
      question: 'The flight was delayed by six hours. ___, we missed our connection in Seoul.',
      options: ['Consequently', 'Nevertheless', 'Whereas', 'On the other hand'],
      answer: 'Consequently',
      explanation: 'Нислэг хойшилсон нь шалтгаан, дамжин суух нислэгээс хоцорсон нь үр дагавар — Consequently. Nevertheless, On the other hand нь эсрэгцүүлэл; Whereas нь conjunction тул ард нь таслалтай дангаар шинэ өгүүлбэр эхлүүлэхгүй.',
      hint: 'Шалтгаан → үр дагавар.',
    },
    {
      id: 'b2-15-3',
      ruleId: 15,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'It was such a boring film that we left early.',
        'It was so boring film that we left early.',
        'The film was such boring that we left early.',
        'Whereas the film was boring, but we stayed until the end.',
      ],
      answer: 'It was such a boring film that we left early.',
      explanation: 'such + a + тэмдэг нэр + нэр үг + that — зөв. Нэр үгтэй бол so биш such a; нэр үггүй тэмдэг нэрд such биш so (so boring that); whereas-тай хамт but давхар хэрэглэхгүй.',
      hint: 'Нэр үг байвал such, байхгүй бол so.',
    },
    {
      id: 'b2-15-4',
      ruleId: 15,
      kind: 'translate',
      question: 'Тэр туйлын их ядарсан байсан. Гэсэн хэдий ч ажлаа дуусгасан.',
      options: [
        'She was exhausted. Nevertheless, she finished the work.',
        'She was exhausted. Therefore, she finished the work.',
        'She was exhausted. Moreover, she finished the work.',
        'She was exhausted. Whereas, she finished the work.',
      ],
      answer: 'She was exhausted. Nevertheless, she finished the work.',
      explanation: '«Гэсэн хэдий ч» = nevertheless — ядарсныг үл харгалзан гарсан үр дүн. Therefore үр дагавар («иймээс»), Moreover нэмэлт («түүнээс гадна»), Whereas бол conjunction тул ингэж шинэ өгүүлбэр эхлүүлэхгүй.',
      hint: '«Гэсэн хэдий ч» — эсрэг үр дүн, шинэ өгүүлбэр.',
    },
  ],
};
