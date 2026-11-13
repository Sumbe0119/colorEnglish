// frontend/src/lib/grammar/c1/rule-15.ts
// C1 дүрэм 15: Formal discourse markers — notwithstanding / albeit / hence
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const c1Rule15: GrammarRule = {
  id: 15,
  title: 'Formal discourse markers: notwithstanding / albeit / hence',
  titleMn: 'Албан ёсны холбоос үгс — notwithstanding, albeit, hence, thereby',
  hook: '«Хэдий тийм боловч», «улмаар», «үүнтэй холбогдуулан», «үүний эсрэгээр» — эрдэм шинжилгээний өгүүлэл, тайлан, албан захидалд таны бичвэрийг C1 түвшинд хүргэх холбоос үгс.',
  summary: 'notwithstanding (+ нэр үг = despite) ба albeit (+ тэмдэг нэр / дайвар үг = although) нь буулт; hence, thus нь үр дүн; thereby + V-ing нь «ингэснээр»; insofar as, inasmuch as нь «…-ийн хэрээр, … гэдэг утгаараа»; in light of нь «…-г харгалзан», with regard to нь «…-ийн тухайд»; that said нь «гэхдээ»; conversely нь «үүний эсрэгээр»; by the same token нь «мөн адил үндэслэлээр». Бүгд албан бичгийн хэлнийх бөгөөд тус бүр өөрийн цэг тэмдэг, ард нь ирэх үгийн төрлийн дүрэмтэй.',
  description: 'Холбоос үгсийг бид шат дараатай үзэж ирсэн: A2-ийн 13-р дүрэмд because, although, however; B1-ийн 14-р дүрэмд despite, so that; B2-ийн 15-р дүрэмд whereas, nevertheless, moreover, therefore. C1-д ижил утгыг илүү албан, илүү нягт илэрхийлдэг холбоосуудыг нэмнэ. Тэдгээрийг B2-ийн хувилбартай нь зэрэгцүүлбэл: despite → notwithstanding; although → albeit; so / therefore → hence / thus; and as a result → thereby + V-ing; however → that said; on the other hand → conversely; similarly → by the same token; about → with regard to; because of / considering → in light of; to the extent that → insofar as; since / in that → inasmuch as. Гол бэрхшээл нь утга биш, харин бүтэц: (1) notwithstanding нь угтвар үг тул ард нь нэр үг ирнэ (Notwithstanding the delays), нэр үгийн ард ч байж болно (The delays notwithstanding). (2) albeit-ийн ард эзэн + үйл үгтэй бүтэн өгүүлбэр ирэхгүй — зөвхөн тэмдэг нэр, дайвар үг, хэллэг (albeit slowly, albeit a small one). (3) thereby-ийн ард -ing хэлбэр ирж, гол өгүүлбэрийн үйлдлийн шууд үр дүнг заана. (4) hence-ийн ард ихэвчлэн үйл үггүй нэр үгийн хэллэг ирдэг (hence the delay). (5) hence, thus, that said, conversely, by the same token нь хоёр бие даасан өгүүлбэрийг холбодог тул өмнө нь цэг эсвэл цэгтэй таслал (;) тавина. Эдгээр үг ярианд, найзтайгаа бичсэн зурваст хэт албан, хиймэл сонсогддог; харин эрдэм шинжилгээний ажил, хууль эрх зүйн баримт, албан тайлан, хурлын илтгэлд зохино. Монгол хэлэнд ч мөн адил хэв маягийн ялгаа бий: ярианы «гэхдээ, тэгээд, тухай» ба албан бичгийн «хэдий тийм боловч, улмаар, …-тай холбогдуулан».',
  structure: 'Notwithstanding + noun, … · …, albeit + adj / adverb / phrase · clause; hence / thus + clause (эсвэл hence + noun) · clause, thereby + V-ing · insofar as / inasmuch as + clause · In light of / With regard to + noun, … · That said, / Conversely, / By the same token, + clause',
  structureParts: [
    { text: 'The company', part: 'subject' },
    { text: 'cut', part: 'verb' },
    { text: 'costs', part: 'object' },
    { text: ', thereby increasing its profits', part: 'modifier' },
  ],
  tip: 'notwithstanding + НЭР ҮГ (= despite) · albeit + ТЭМДЭГ НЭР / ДАЙВАР ҮГ (өгүүлбэр биш) · thereby + V-ING · hence + нэр үг (hence the delay) · that said / conversely / by the same token — өмнө нь цэг эсвэл ; , ард нь таслал · with regard to (regards биш).',
  examples: [
    { en: '[Notwithstanding the delays](m), [the project](s) [was completed](v) [on budget](m).', mn: 'Саатал гарсан хэдий ч төсөл төсөвтөө багтаж дууссан.' },
    { en: '[The plan](s) [was](v) [a success](o), [albeit an expensive one](m).', mn: 'Төлөвлөгөө амжилттай болсон, гэхдээ өндөр өртөгтэй байв.' },
    { en: '[The roads](s) [were](v) [icy](o); [hence the delay](m).', mn: 'Зам мөстэй байсан; саатал үүнээс үүдэлтэй.' },
    { en: '[The company](s) [cut](v) [costs](o), [thereby increasing its profits](m).', mn: 'Компани зардлаа танаж, ингэснээр ашгаа нэмэгдүүлсэн.' },
  ],
  useCases: [
    {
      title: 'Буулт — notwithstanding, albeit, that said',
      description: 'notwithstanding = despite / in spite of (угтвар үг, + нэр үг). albeit = although, гэхдээ зөвхөн тэмдэг нэр, дайвар үг, хэллэгийн өмнө — өмнөх мэдэгдлийг бага зэрэг хязгаарлана. That said = «гэсэн хэдий ч, гэхдээ» — шинэ өгүүлбэрийн эхэнд, however-ээс арай зөөлөн; албан ярианд ч түгээмэл.',
      examples: [
        { en: '[Notwithstanding its high price](m), [the product](s) [sold](v) [well](m).', mn: 'Үнэ өндөр байсан хэдий ч бүтээгдэхүүн сайн борлогдсон.' },
        { en: '[The economy](s) [is growing](v), [albeit slowly](m).', mn: 'Эдийн засаг өсөж байна, удаан ч гэсэн.' },
        { en: '[The results](s) [are](v) [promising](o). [That said](m), [the sample](s) [was](v) [small](o).', mn: 'Үр дүн найдвар төрүүлж байна. Гэхдээ түүвэр бага байсан.' },
      ],
    },
    {
      title: 'Үр дүн — hence, thus, thereby + V-ing',
      description: 'hence = «тиймээс, үүнээс үүдэн» — ард нь бүтэн өгүүлбэр эсвэл үйл үггүй нэр үг (hence the name). thus = «ийнхүү, тиймээс» — өгүүлбэрийн эхэнд эсвэл туслах ба үндсэн үйл үгийн дунд. thereby + V-ing = «ингэснээр, улмаар» — гол өгүүлбэрийн үйлдэл өөрөө ямар үр дүнд хүргэснийг заана.',
      examples: [
        { en: '[Demand](s) [exceeded](v) [supply](o); [hence](m), [prices](s) [rose](v).', mn: 'Эрэлт нийлүүлэлтээс давсан; тиймээс үнэ өссөн.' },
        { en: '[The data](s) [were](v) [incomplete](o); [thus](m), [no firm conclusion](s) [can be drawn](v).', mn: 'Өгөгдөл дутуу байсан; иймд баттай дүгнэлт хийх боломжгүй.' },
        { en: '[The law](s) [was changed](v), [thereby allowing small firms to compete](m).', mn: 'Хууль өөрчлөгдөж, улмаар жижиг компаниуд өрсөлдөх боломжтой болсон.' },
      ],
    },
    {
      title: 'Хэмжээ, үндэслэл — insofar as, inasmuch as',
      description: 'insofar as (британи бичлэгт in so far as ч гэж бичнэ) = «…-ийн хэрээр, … хэмжээнд» — мэдэгдэл зөвхөн тодорхой хүрээнд үнэн гэдгийг заана. inasmuch as = «… гэдэг утгаараа, … учраас» — мэдэгдлийг ямар үндэслэлээр хэлж байгааг тайлбарлана. Хоёулангийнх нь ард бүтэн өгүүлбэр ирнэ.',
      examples: [
        { en: '[The reform](s) [was](v) [successful](o) [insofar as it reduced waiting times](m).', mn: 'Шинэчлэл хүлээх хугацааг богиносгосон хэмжээндээ амжилттай болсон.' },
        { en: '[I](s) [will help](v) [insofar as I can](m).', mn: 'Би чадах хэрээрээ тусална.' },
        { en: '[The two cases](s) [are](v) [similar](o) [inasmuch as both involve fraud](m).', mn: 'Хоёр хэрэг хоёулаа залилантай холбоотой гэдэг утгаараа төстэй.' },
      ],
    },
    {
      title: 'Сэдэв, үндэслэл заах — with regard to, in light of',
      description: 'with regard to + нэр үг = «…-ийн тухайд, …-тай холбогдуулан» — шинэ сэдэв рүү шилжих, албан захидалд асуудлыг нэрлэх. in light of (британи: in the light of) + нэр үг = «…-г харгалзан, …-ийн үүднээс» — шинэ мэдээлэл, нөхцөл байдал шийдвэрт нөлөөлснийг заана.',
      examples: [
        { en: '[With regard to your second question](m), [the answer](s) [is](v) [yes](o).', mn: 'Таны хоёр дахь асуултын тухайд хариулт нь «тийм».' },
        { en: '[In light of recent events](m), [the meeting](s) [has been postponed](v).', mn: 'Сүүлийн үеийн үйл явдлыг харгалзан хурлыг хойшлуулсан.' },
        { en: '[In light of the new evidence](m), [the court](s) [reopened](v) [the case](o).', mn: 'Шинэ нотлох баримтыг харгалзан шүүх хэргийг дахин нээсэн.' },
      ],
    },
    {
      title: 'Эсрэгцэл ба зэрэгцэл — conversely, by the same token',
      description: 'conversely = «үүний эсрэгээр» — өмнөх өгүүлбэрийн яг урвуу тохиолдлыг хэлнэ (on the other hand-аас илүү нарийн, логик урвуулал). by the same token = «мөн адил үндэслэлээр, үүнтэй нэгэн адил» — өмнөх санааны үндэслэл дараагийн санаанд ч хамаатайг заана.',
      examples: [
        { en: '[Higher interest rates](s) [reduce](v) [borrowing](o); [conversely](m), [lower rates](s) [encourage](v) [it](o).', mn: 'Зээлийн хүү өсөхөд зээл авалт буурдаг; үүний эсрэгээр хүү буурахад зээл авалт нэмэгддэг.' },
        { en: '[Teachers](s) [must respect](v) [students](o). [By the same token](m), [students](s) [must respect](v) [teachers](o).', mn: 'Багш нар оюутнуудыг хүндлэх ёстой. Үүнтэй нэгэн адил оюутнууд ч багш нараа хүндлэх ёстой.' },
        { en: '[Some people](s) [work](v) [best](m) [in the morning](m); [conversely](m), [others](s) [are](v) [most productive at night](o).', mn: 'Зарим хүн өглөө хамгийн сайн ажилладаг; үүний эсрэгээр бусад нь шөнө хамгийн бүтээмжтэй байдаг.' },
      ],
    },
  ],
  forms: [
    {
      label: 'notwithstanding / albeit',
      structure: 'Notwithstanding + noun, + clause · noun + notwithstanding, + clause · clause, + albeit + adjective / adverb / noun phrase',
      examples: [
        { en: '[Notwithstanding these objections](m), [the board](s) [approved](v) [the merger](o).', mn: 'Эдгээр эсэргүүцлийг үл харгалзан удирдах зөвлөл нэгдлийг баталсан.' },
        { en: '[These objections notwithstanding](m), [the board](s) [approved](v) [the merger](o).', mn: 'Эдгээр эсэргүүцэл байсан хэдий ч удирдах зөвлөл нэгдлийг баталсан.' },
        { en: '[He](s) [accepted](v) [the offer](o), [albeit reluctantly](m).', mn: 'Тэр саналыг хүлээн авсан, дурамжхан ч гэсэн.' },
      ],
    },
    {
      label: 'hence / thus / thereby',
      structure: 'clause; hence + clause / noun phrase · subject + auxiliary + thus + verb · clause, + thereby + V-ing',
      examples: [
        { en: '[She](s) [grew up](v) [in Paris](m); [hence her perfect French](m).', mn: 'Тэр Парист өссөн; франц хэл нь төгс байгаа нь үүнээс үүдэлтэй.' },
        { en: '[Costs](s) [have risen](v) [and](m) [profits](s) [have](v) [thus](m) [fallen](v).', mn: 'Зардал өсөж, улмаар ашиг буурсан.' },
        { en: '[He](s) [signed](v) [the contract](o), [thereby accepting all its terms](m).', mn: 'Тэр гэрээнд гарын үсэг зурж, ингэснээр бүх нөхцөлийг нь хүлээн зөвшөөрсөн.' },
      ],
    },
    {
      label: 'insofar as / inasmuch as',
      structure: 'main clause + insofar as / inasmuch as + clause · Insofar as + clause, + main clause',
      examples: [
        { en: '[The theory](s) [is](v) [useful](o) [insofar as it explains the data](m).', mn: 'Онол өгөгдлийг тайлбарлаж чадаж буй хэмжээндээ хэрэгтэй.' },
        { en: '[He](s) [is](v) [responsible](o) [inasmuch as he approved the plan](m).', mn: 'Тэр төлөвлөгөөг баталсан гэдэг утгаараа хариуцлага хүлээнэ.' },
        { en: '[Insofar as I am aware](m), [no complaint](s) [has been made](v).', mn: 'Миний мэдэж байгаагаар ямар ч гомдол гараагүй.' },
      ],
    },
    {
      label: 'Өгүүлбэрийн эхний холбоос + таслал',
      structure: 'With regard to / In light of + noun, + clause · Sentence. That said, / Conversely, / By the same token, + clause',
      examples: [
        { en: '[With regard to payment](m), [invoices](s) [are sent](v) [monthly](m).', mn: 'Төлбөрийн тухайд нэхэмжлэхийг сар бүр илгээдэг.' },
        { en: '[In light of your feedback](m), [we](s) [have revised](v) [the proposal](o).', mn: 'Таны саналыг харгалзан бид төслөө шинэчилсэн.' },
        { en: '[The flat](s) [is](v) [tiny](o). [That said](m), [the location](s) [is](v) [perfect](o).', mn: 'Байр маш жижиг. Гэхдээ байршил нь төгс.' },
      ],
    },
  ],
  signalWords: ['notwithstanding', 'albeit', 'hence', 'thus', 'thereby + -ing', 'insofar as', 'inasmuch as', 'in light of', 'with regard to', 'that said', 'conversely', 'by the same token'],
  notes: [
    'albeit-ийн ард эзэн + үйл үгтэй бүтэн өгүүлбэр ирэхгүй: albeit it was expensive (буруу) → albeit expensive / although it was expensive. Дуудлага: «олбиит» (all + be + it).',
    'thereby-ийн ард -ing: …, thereby it reduced costs (буруу) → …, thereby reducing costs. -ing-ийн үйлдэгч нь гол өгүүлбэрийн эзэн эсвэл үйлдэл бүхэлдээ байна. therefore-той бүү андуур: therefore + бүтэн өгүүлбэр.',
    'notwithstanding нь угтвар үг (= despite): ард нь нэр үг ирнэ, бүтэн өгүүлбэр шууд залгахгүй. Notwithstanding the weather was bad (буруу) → Notwithstanding the bad weather. Нэр үгийн ард ч байрлаж болно: the bad weather notwithstanding.',
    'Цэг тэмдэг: hence, thus, that said, conversely, by the same token нь хоёр бие даасан өгүүлбэрийг холбоно — өмнө нь цэг эсвэл цэгтэй таслал (;), ард нь ихэвчлэн таслал. that said, conversely, by the same token-ий өмнө зөвхөн таслал тавибал comma splice алдаа болно.',
    'with regard to — regard ганц тоогоор. with regards to гэж бичихээс зайлсхий (regards нь «мэндчилгээ»: Best regards). Ижил утгатай: as regards, regarding, in regard to. in light of (америк) ба in the light of (британи) хоёулаа зөв.',
    'Хэв маяг: эдгээр нь албан бичгийн үгс. Найзтайгаа ярихад, чатад but, so, about гэж хэл. Албан бичвэрт ч хэтрүүлбэл хүнд, хиймэл болно — нэг догол мөрөнд нэг, хоёр л хэрэглэ. B2-ийн nevertheless, therefore, moreover нь ихэнх тохиолдолд хангалттай.',
  ],
  commonMistakes: [
    {
      wrong: 'The trip was enjoyable, albeit it was short.',
      correct: 'The trip was enjoyable, albeit short.',
      explanation: 'albeit-ийн ард бүтэн өгүүлбэр (it was short) ирэхгүй, зөвхөн тэмдэг нэр / дайвар үг / хэллэг. Бүтэн өгүүлбэр хэрэгтэй бол although it was short.',
    },
    {
      wrong: 'The firm cut prices, thereby it attracted new customers.',
      correct: 'The firm cut prices, thereby attracting new customers.',
      explanation: 'thereby-ийн ард эзэн + үйл үг биш, V-ing ирнэ. «Ингэснээр шинэ хэрэглэгч татсан» гэсэн үр дүнг -ing хэлбэрээр илэрхийлнэ.',
    },
    {
      wrong: 'Notwithstanding the weather was bad, the event went ahead.',
      correct: 'Notwithstanding the bad weather, the event went ahead.',
      explanation: 'notwithstanding нь despite шиг угтвар үг тул ард нь нэр үг ирнэ. Бүтэн өгүүлбэртэй бол although the weather was bad.',
    },
    {
      wrong: 'With regards of your request, we cannot offer a refund.',
      correct: 'With regard to your request, we cannot offer a refund.',
      explanation: 'Тогтсон хэллэг: with regard to — regard ганц тоогоор, угтвар үг нь to. of хэрэглэхгүй.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монгол хэлэнд ч ярианы ба албан бичгийн холбоос ялгаатай: «гэхдээ» ↔ «хэдий тийм боловч», «тэгээд, тиймээс» ↔ «иймд, улмаар», «тухай» ↔ «…-тай холбогдуулан». C1-ийн холбоосууд нь монгол албан бичгийн энэ хэв маягтай дүйнэ: notwithstanding ≈ «…-г үл харгалзан», hence / thus ≈ «иймд», with regard to ≈ «…-тай холбогдуулан, …-ийн тухайд».',
      'Монголоор «ингэснээр», «улмаар», «-снаар» (зардлаа танаж, ингэснээр ашгаа нэмэгдүүлэв) гэж үйлдлийн шууд үр дүнг залгадаг нь thereby + V-ing-тэй яг таарна. Монголын «-ж, … -снаар» гэсэн нөхцөлт хэлбэрийг англиар -ing гүйцэтгэдэг — шинэ эзэн, үйл үг нэмэхгүй.',
      'Монголоор «хэдий … боловч», «… ч гэсэн» нь нэр үг, тэмдэг нэр, бүтэн өгүүлбэр алинтай ч холбогддог. Англиар ард нь ирэх үгийн төрлөөс холбоос шалтгаална: нэр үг бол notwithstanding / despite, тэмдэг нэр / дайвар үг бол albeit, бүтэн өгүүлбэр бол although. «Удаан ч гэсэн» = albeit slowly.',
      'Монголоор эдгээр утга нэр үгийн АРД ирдэг дагавар үг, нөхцөлөөр илэрдэг: «шинэ нотолгоог харгалзан», «төлбөрийн тухайд», «чадах хэрээрээ». Англиар нэр үг, өгүүлбэрийн ӨМНӨ: in light of the new evidence, with regard to payment, insofar as I can. Зөвхөн notwithstanding л монгол шиг нэр үгийн ард байрлаж болдог: these objections notwithstanding.',
    ],
  },
  dialogue: [
    {
      en: 'Nomin, [with regard to the third-quarter figures](m), [what](o) [can](v) [you](s) [tell](v) [us](o)?',
      mn: 'Номин, гуравдугаар улирлын үзүүлэлтийн тухайд та бидэнд юу хэлэх вэ?',
      speaker: 'Temuulen',
    },
    {
      en: '[Sales](s) [rose](v) [by four per cent](m), [albeit more slowly than we had hoped](m).',
      mn: 'Борлуулалт дөрвөн хувиар өссөн, бидний найдаж байснаас удаан ч гэсэн.',
      speaker: 'Nomin',
    },
    {
      en: '[Notwithstanding the weak start](m), [that](s) [is](v) [encouraging](o). And costs?',
      mn: 'Эхлэл сул байсан хэдий ч энэ нь урам өгч байна. Зардал ямар байна?',
      speaker: 'Temuulen',
    },
    {
      en: '[We](s) [moved](v) [the warehouse](o) [to Darkhan](m), [thereby cutting transport costs by a fifth](m). [That said](m), [rents](s) [are rising](v).',
      mn: 'Бид агуулахаа Дархан руу нүүлгэж, ингэснээр тээврийн зардлыг тавны нэгээр бууруулсан. Гэхдээ түрээсийн үнэ өсөж байна.',
      speaker: 'Nomin',
    },
    {
      en: '[In light of that](m), [should](v) [we](s) [sign](v) [a longer lease](o)? [A long contract](s) [protects](v) [us](o); [by the same token](m), [it](s) [limits](v) [our flexibility](o).',
      mn: 'Үүнийг харгалзан бид илүү урт хугацааны түрээсийн гэрээ хийх үү? Урт гэрээ биднийг хамгаална; мөн адил үндэслэлээр бидний уян хатан байдлыг хязгаарлана.',
      speaker: 'Tuya',
    },
    {
      en: 'Good point. [The market](s) [is](v) [unpredictable](o); [hence my caution](m). [Let\'s decide](v) [next week](m).',
      mn: 'Зөв санаа. Зах зээл урьдчилан таамаглах аргагүй; миний болгоомжлол үүнээс үүдэлтэй. Ирэх долоо хоногт шийдье.',
      speaker: 'Temuulen',
    },
  ],
  quiz: [
    {
      id: 'c1-15-1',
      ruleId: 15,
      kind: 'fill',
      question: 'The new system is faster, ___ more expensive.',
      options: ['albeit', 'hence', 'thereby', 'notwithstanding'],
      answer: 'albeit',
      explanation: 'Ард нь тэмдэг нэрийн хэллэг (more expensive) байгаа бөгөөд утга нь буулт («илүү үнэтэй ч гэсэн») тул albeit. hence үр дүн, thereby + V-ing, notwithstanding + нэр үг.',
      hint: '«… ч гэсэн» + тэмдэг нэр.',
    },
    {
      id: 'c1-15-2',
      ruleId: 15,
      kind: 'fill',
      question: 'The government lowered taxes, thereby ___ consumer spending.',
      options: ['boosting', 'boosted', 'to boost', 'it boosted'],
      answer: 'boosting',
      explanation: 'thereby-ийн ард үргэлж V-ing: thereby boosting = «ингэснээр нэмэгдүүлсэн». V2, to-infinitive, эзэн + үйл үг залгахгүй.',
      hint: 'thereby + -ing.',
    },
    {
      id: 'c1-15-3',
      ruleId: 15,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'Notwithstanding the heavy snow, the flight departed on time.',
        'Albeit the hotel was cheap, it was comfortable.',
        'With regards of the contract, nothing has changed.',
        'He resigned, thereby he ended a long career.',
      ],
      answer: 'Notwithstanding the heavy snow, the flight departed on time.',
      explanation: 'notwithstanding + нэр үг — зөв. albeit-ийн ард бүтэн өгүүлбэр ирэхгүй (Although the hotel was cheap); зөв хэллэг нь with regard to; thereby-ийн ард V-ing (thereby ending).',
      hint: 'Холбоос бүрийн ард ямар төрлийн үг ирж байгааг шалга.',
    },
    {
      id: 'c1-15-4',
      ruleId: 15,
      kind: 'translate',
      question: 'Шинэ нотлох баримтыг харгалзан шүүх шийдвэрээ өөрчилсөн.',
      options: [
        'In light of the new evidence, the court changed its decision.',
        'In light the new evidence, the court changed its decision.',
        'By the same token the new evidence, the court changed its decision.',
        'Insofar as the new evidence, the court changed its decision.',
      ],
      answer: 'In light of the new evidence, the court changed its decision.',
      explanation: '«…-г харгалзан» = in light of + нэр үг. of-ийг орхиж болохгүй; by the same token нь нэр үгтэй холбогдохгүй («мөн адил үндэслэлээр»); insofar as-ийн ард бүтэн өгүүлбэр ирнэ.',
      hint: '«Харгалзан» = in light of + нэр үг.',
    },
  ],
};
