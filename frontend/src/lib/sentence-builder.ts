// frontend/src/lib/sentence-builder.ts
// "Өгүүлбэр бүтээх" тоглоомын өгөгдөл ба туслах функцууд.
// Өгүүлбэрийн БҮХ үг (a / the / to / in зэрэг жижиг үг орсон) холигдож өгөгдөнө,
// тоглогч тэдгээрийг зөв дарааллаар бичнэ. Раунд ахих тусам өгүүлбэр 5 → 8 үг болж хүндэрнэ.
// Цаг дуусвал робот тавцангаас унаж тоглоом дуусна (game over).

export type SentencePuzzle = {
  /** Зөв өгүүлбэр (эхний хувилбар — үгсийг эндээс гаргана, Tip-д харуулна). */
  answer: string;
  /** Зорилтот өгүүлбэрийн монгол утга. */
  mn: string;
  /** Мөн зөв гэж тооцох бусад дараалал. */
  alt?: string[];
  /** Хүндрэлийн түвшин 1–10 (SENTENCE_LEVELS үүсгэхэд автоматаар бөглөгдөнө). */
  level?: number;
};

/** Тоглолт бүр 10 раунд = 10 level (раунд i → level i+1). */
export const ROUNDS_PER_GAME = 10;
export const LEVEL_COUNT = 10;
/**
 * Суурь хугацаа. Үүн дээр үг бүрт SECONDS_PER_WORD, 5-аас илүү үг бүрт SECONDS_PER_EXTRA_WORD нэмэгдэнэ
 * (суурь 30с: 5 үг = 45с, 8 үг = 84с, 12 үг = 136с).
 */
export const BASE_ROUND_SECONDS = 30;
export const SECONDS_PER_EXTRA_WORD = 10;
/** Өгүүлбэрийн үг тус бүрт нэмэгдэх секунд. */
export const SECONDS_PER_WORD = 3;
export const MIN_WORDS = 5;
export const MAX_WORDS = 12;
/** Tip ашигласан раундын тогтмол оноо. */
export const POINTS_WITH_TIP = 4;
/** Үг тутмын үндсэн оноо (5 үг = 10, 8 үг = 16). */
export const POINTS_PER_WORD = 2;
/** Үлдсэн хугацааны урамшуулал (дээд тал нь). */
export const BONUS_MAX = 10;

/** Level 1–4: үгийн тоогоор (5, 6, 7, 8) бүлэглэсэн хялбар өгүүлбэрүүд (одоо цаг, be, энгийн бүтэц). */
const BY_LENGTH: Record<number, SentencePuzzle[]> = {
  5: [
    { answer: 'I go to school today', mn: 'Би өнөөдөр сургуульд явна.', alt: ['Today I go to school'] },
    { answer: 'She likes to read books', mn: 'Тэр ном уншихдаа дуртай.' },
    { answer: 'We live in a city', mn: 'Бид хотод амьдардаг.' },
    { answer: 'He is a good doctor', mn: 'Тэр сайн эмч.' },
    { answer: 'They play football on Sundays', mn: 'Тэд ням гарагт хөлбөмбөг тоглодог.', alt: ['On Sundays they play football'] },
    { answer: 'I have a black dog', mn: 'Надад хар нохой бий.' },
    { answer: 'She drinks coffee every morning', mn: 'Тэр өглөө бүр кофе уудаг.', alt: ['Every morning she drinks coffee'] },
    { answer: 'My mother is cooking dinner', mn: 'Ээж маань оройн хоол хийж байна.' },
    { answer: 'The cat is sleeping now', mn: 'Муур одоо унтаж байна.', alt: ['Now the cat is sleeping'] },
    { answer: 'We eat breakfast at seven', mn: 'Бид долоон цагт өглөөний цай уудаг.', alt: ['At seven we eat breakfast'] },
    { answer: 'I want some hot tea', mn: 'Би халуун цай уумаар байна.' },
    { answer: 'He works in a bank', mn: 'Тэр банкинд ажилладаг.' },
    { answer: 'It is very cold today', mn: 'Өнөөдөр маш хүйтэн байна.', alt: ['Today it is very cold'] },
    { answer: 'They are my best friends', mn: 'Тэд миний хамгийн сайн найзууд.' },
    { answer: 'She speaks English very well', mn: 'Тэр англиар маш сайн ярьдаг.' },
    { answer: 'I love my little sister', mn: 'Би бяцхан дүүдээ хайртай.' },
    { answer: 'We watch TV after dinner', mn: 'Бид оройн хоолны дараа зурагт үздэг.', alt: ['After dinner we watch TV'] },
    { answer: 'He plays the guitar well', mn: 'Тэр гитар сайн тоглодог.' },
    { answer: 'I am very hungry now', mn: 'Би одоо маш их өлсөж байна.', alt: ['Now I am very hungry'] },
    { answer: 'She has a new car', mn: 'Тэр шинэ машинтай.' },
    { answer: 'They went to the park', mn: 'Тэд цэцэрлэгт хүрээлэн рүү явсан.' },
    { answer: 'The children are playing outside', mn: 'Хүүхдүүд гадаа тоглож байна.' },
    { answer: 'I need some cold water', mn: 'Надад хүйтэн ус хэрэгтэй.' },
    { answer: 'It is raining in Ulaanbaatar', mn: 'Улаанбаатарт бороо орж байна.' },
    { answer: 'He reads books at night', mn: 'Тэр шөнө ном уншдаг.', alt: ['At night he reads books'] },
    { answer: 'My father drives a bus', mn: 'Аав маань автобус жолооддог.' },
    { answer: 'We swim in the summer', mn: 'Бид зун сэлдэг.' },
    { answer: 'She is in the kitchen', mn: 'Тэр гал тогоонд байна.' },
  ],
  6: [
    { answer: 'I go to school every day', mn: 'Би өдөр бүр сургуульд явдаг.', alt: ['Every day I go to school'] },
    { answer: 'She likes cats and small dogs', mn: 'Тэр муур болон жижиг нохойд дуртай.' },
    { answer: 'We live in a big city', mn: 'Бид том хотод амьдардаг.' },
    { answer: 'He is a doctor in Darkhan', mn: 'Тэр Дарханд эмч хийдэг.' },
    { answer: 'They play football in the park', mn: 'Тэд цэцэрлэгт хүрээлэнд хөлбөмбөг тоглодог.' },
    { answer: 'She drinks coffee in the morning', mn: 'Тэр өглөө кофе уудаг.', alt: ['In the morning she drinks coffee'] },
    { answer: 'My brother works in a hospital', mn: 'Ах маань эмнэлэгт ажилладаг.' },
    { answer: 'The cat sleeps on the bed', mn: 'Муур орон дээр унтдаг.' },
    { answer: "We eat breakfast at seven o'clock", mn: 'Бид долоон цагт өглөөний цай уудаг.', alt: ["At seven o'clock we eat breakfast"] },
    { answer: 'I want a cup of tea', mn: 'Би нэг аяга цай уумаар байна.' },
    { answer: 'It is very hot in summer', mn: 'Зун маш халуун байдаг.', alt: ['In summer it is very hot'] },
    { answer: 'They are students at this school', mn: 'Тэд энэ сургуульд сурдаг оюутнууд.' },
    { answer: 'She speaks English and Mongolian well', mn: 'Тэр Англи, Монголоор сайн ярьдаг.' },
    { answer: 'I listen to music every evening', mn: 'Би орой бүр хөгжим сонсдог.', alt: ['Every evening I listen to music'] },
    { answer: 'He goes to bed at ten', mn: 'Тэр арван цагт унтдаг.', alt: ['At ten he goes to bed'] },
    { answer: 'We watch a movie every Friday', mn: 'Бид баасан гараг бүр кино үздэг.', alt: ['Every Friday we watch a movie'] },
    { answer: "I wake up at seven o'clock", mn: 'Би долоон цагт босдог.', alt: ["At seven o'clock I wake up"] },
    { answer: 'She has a small red car', mn: 'Тэр жижиг улаан машинтай.' },
    { answer: 'They went to the park yesterday', mn: 'Тэд өчигдөр цэцэрлэгт хүрээлэн рүү явсан.', alt: ['Yesterday they went to the park'] },
    { answer: 'I call my father every Sunday', mn: 'Би ням гараг бүр аавруугаа залгадаг.', alt: ['Every Sunday I call my father'] },
    { answer: 'My mother is cooking dinner now', mn: 'Ээж маань одоо оройн хоол хийж байна.', alt: ['Now my mother is cooking dinner'] },
    { answer: 'We are happy to see you', mn: 'Бид тантай уулзахдаа баяртай байна.' },
    { answer: 'I open the window every morning', mn: 'Би өглөө бүр цонхоо онгойлгодог.', alt: ['Every morning I open the window'] },
    { answer: 'She is reading a new book', mn: 'Тэр шинэ ном уншиж байна.' },
    { answer: "The bus comes at eight o'clock", mn: 'Автобус найман цагт ирдэг.', alt: ["At eight o'clock the bus comes"] },
    { answer: 'It is snowing in the mountains', mn: 'Ууланд цас орж байна.', alt: ['In the mountains it is snowing'] },
    { answer: 'We need some bread and milk', mn: 'Бидэнд талх, сүү хэрэгтэй.' },
  ],
  7: [
    { answer: 'I have a dog and a cat', mn: 'Надад нохой, муур хоёр бий.' },
    { answer: 'The children are playing in the garden', mn: 'Хүүхдүүд цэцэрлэгт тоглож байна.' },
    { answer: 'He writes a letter to his friend', mn: 'Тэр найздаа захиа бичдэг.' },
    { answer: "We usually have lunch at twelve o'clock", mn: 'Бид ихэвчлэн арван хоёр цагт өдрийн хоол иддэг.' },
    { answer: 'My sister lives in a small town', mn: 'Эгч маань жижиг хотод амьдардаг.' },
    { answer: 'I like to play basketball with friends', mn: 'Би найзуудтайгаа сагсан бөмбөг тоглох дуртай.' },
    { answer: 'They are watching TV in the room', mn: 'Тэд өрөөнд зурагт үзэж байна.' },
    { answer: 'He drinks a glass of milk daily', mn: 'Тэр өдөр бүр нэг аяга сүү уудаг.', alt: ['Daily he drinks a glass of milk'] },
    { answer: 'She is cooking rice for her family', mn: 'Тэр гэр бүлдээ будаа чанаж байна.' },
    { answer: 'I went to the shop with Bat', mn: 'Би Баттай хамт дэлгүүр явсан.' },
    { answer: 'We go to the cinema on Saturdays', mn: 'Бид бямба гарагт кино театрт явдаг.', alt: ['On Saturdays we go to the cinema'] },
    { answer: 'The weather is very nice in spring', mn: 'Хавар цаг агаар маш сайхан байдаг.', alt: ['In spring the weather is very nice'] },
    { answer: 'My father reads the newspaper every morning', mn: 'Аав маань өглөө бүр сонин уншдаг.', alt: ['Every morning my father reads the newspaper'] },
    { answer: 'I am learning English at this school', mn: 'Би энэ сургуульд англи хэл сурч байна.' },
    { answer: 'They live in a big house now', mn: 'Тэд одоо том байшинд амьдардаг.', alt: ['Now they live in a big house'] },
    { answer: 'She wants to buy a new phone', mn: 'Тэр шинэ утас авахыг хүсч байна.' },
    { answer: 'He plays the piano in the evening', mn: 'Тэр орой төгөлдөр хуур тоглодог.', alt: ['In the evening he plays the piano'] },
    { answer: 'We are going to the park tomorrow', mn: 'Бид маргааш цэцэрлэгт хүрээлэн рүү явна.', alt: ['Tomorrow we are going to the park'] },
    { answer: 'I drink a cup of coffee daily', mn: 'Би өдөр бүр нэг аяга кофе уудаг.', alt: ['Daily I drink a cup of coffee'] },
    { answer: 'The students are listening to the teacher', mn: 'Оюутнууд багшийгаа сонсож байна.' },
    { answer: 'My friend works at a small bank', mn: 'Найз маань жижиг банкинд ажилладаг.' },
    { answer: 'It is cold and windy in winter', mn: 'Өвөл хүйтэн, салхитай байдаг.', alt: ['In winter it is cold and windy'] },
    { answer: 'She calls her mother every Sunday evening', mn: 'Тэр ням гараг бүрийн орой ээждээ залгадаг.', alt: ['Every Sunday evening she calls her mother'] },
  ],
  8: [
    { answer: 'She goes to work by bus every day', mn: 'Тэр өдөр бүр автобусаар ажилдаа явдаг.', alt: ['Every day she goes to work by bus'] },
    { answer: 'I get up at six in the morning', mn: 'Би өглөө зургаан цагт босдог.', alt: ['In the morning I get up at six'] },
    { answer: 'My brother and I play football after school', mn: 'Ах бид хоёр хичээлийн дараа хөлбөмбөг тоглодог.', alt: ['After school my brother and I play football'] },
    { answer: 'We are going to visit our grandmother tomorrow', mn: 'Бид маргааш эмээ дээрээ очно.', alt: ['Tomorrow we are going to visit our grandmother'] },
    { answer: 'The teacher gives us a lot of homework', mn: 'Багш бидэнд маш их гэрийн даалгавар өгдөг.' },
    { answer: 'He is reading a book in the library', mn: 'Тэр номын санд ном уншиж байна.' },
    { answer: 'I want to learn English in one year', mn: 'Би нэг жилийн дотор англи хэл сурахыг хүсч байна.' },
    { answer: 'They have dinner with their family every evening', mn: 'Тэд орой бүр гэр бүлтэйгээ оройн хоол иддэг.', alt: ['Every evening they have dinner with their family'] },
    { answer: 'She is wearing a beautiful red dress today', mn: 'Тэр өнөөдөр сайхан улаан даашинз өмссөн байна.', alt: ['Today she is wearing a beautiful red dress'] },
    { answer: 'My mother makes tea for us every morning', mn: 'Ээж маань өглөө бүр бидэнд цай хийж өгдөг.', alt: ['Every morning my mother makes tea for us'] },
    { answer: 'We watched a very good movie last night', mn: 'Бид өчигдөр орой маш сайн кино үзсэн.', alt: ['Last night we watched a very good movie'] },
    { answer: 'I go to the gym twice a week', mn: 'Би долоо хоногт хоёр удаа фитнесс явдаг.', alt: ['Twice a week I go to the gym'] },
    { answer: 'The children are swimming in the lake now', mn: 'Хүүхдүүд одоо нууранд сэлж байна.', alt: ['Now the children are swimming in the lake'] },
    { answer: 'He works in a big hospital in Ulaanbaatar', mn: 'Тэр Улаанбаатарын том эмнэлэгт ажилладаг.' },
    { answer: 'My sister is studying at the university now', mn: 'Эгч маань одоо их сургуульд сурч байна.', alt: ['Now my sister is studying at the university'] },
    { answer: 'We like to eat ice cream in summer', mn: 'Бид зун зайрмаг идэх дуртай.', alt: ['In summer we like to eat ice cream'] },
    { answer: 'I am waiting for my friend at home', mn: 'Би гэртээ найзаа хүлээж байна.', alt: ['At home I am waiting for my friend'] },
    { answer: 'She bought some apples at the market yesterday', mn: 'Тэр өчигдөр захаас алим авсан.', alt: ['Yesterday she bought some apples at the market'] },
    { answer: 'They are building a new school in Darkhan', mn: 'Тэд Дарханд шинэ сургууль барьж байна.' },
    { answer: 'The dog is sleeping under the table now', mn: 'Нохой одоо ширээний доор унтаж байна.', alt: ['Now the dog is sleeping under the table'] },
    { answer: 'I drink a glass of water before breakfast', mn: 'Би өглөөний цайны өмнө нэг аяга ус уудаг.', alt: ['Before breakfast I drink a glass of water'] },
    { answer: 'We are very happy to see you again', mn: 'Бид тантай дахин уулзахдаа маш баяртай байна.' },
    { answer: 'He does not like to get up early', mn: 'Тэр эрт босох дургүй.' },
    { answer: 'Please close the door when you go out', mn: 'Гарахдаа хаалгаа хаагаарай.' },
  ],
};

/** Level 5: өнгөрсөн ба ирээдүй цаг (past simple, will / going to), 8–9 үг */
const LEVEL_5: SentencePuzzle[] = [
  { answer: 'Yesterday we visited my grandparents in the countryside', mn: 'Өчигдөр бид хөдөө өвөө эмээ дээрээ очсон.', alt: ['We visited my grandparents in the countryside yesterday'] },
  { answer: 'She will call you after the meeting tomorrow', mn: 'Тэр маргааш хурлын дараа чам руу залгана.', alt: ['Tomorrow she will call you after the meeting'] },
  { answer: 'They did not go to school last Monday', mn: 'Тэд өнгөрсөн даваа гарагт сургуульд яваагүй.', alt: ['Last Monday they did not go to school'] },
  { answer: 'I am going to buy a new bicycle soon', mn: 'Би удахгүй шинэ дугуй авах гэж байна.' },
  { answer: 'We played basketball in the park last weekend', mn: 'Бид өнгөрсөн амралтын өдөр цэцэрлэгт хүрээлэнд сагсан бөмбөг тоглосон.', alt: ['Last weekend we played basketball in the park'] },
  { answer: 'He forgot his keys at the office again', mn: 'Тэр түлхүүрээ дахиад л оффист мартчихжээ.' },
  { answer: 'My parents will travel to Japan next spring', mn: 'Аав ээж маань ирэх хавар Япон руу аялна.', alt: ['Next spring my parents will travel to Japan'] },
  { answer: 'The students finished the exam before the bell rang', mn: 'Оюутнууд хонх дуугарахаас өмнө шалгалтаа дуусгасан.' },
  { answer: 'Did you see the new movie last night', mn: 'Чи өчигдөр орой шинэ киног үзсэн үү?' },
  { answer: 'We are going to have a party on Friday', mn: 'Бид баасан гарагт үдэшлэг хийх гэж байна.', alt: ['On Friday we are going to have a party'] },
  { answer: 'She wrote a long letter to her best friend', mn: 'Тэр хамгийн сайн найздаа урт захиа бичсэн.' },
  { answer: 'I will help you with your homework tonight', mn: 'Би өнөө орой чамд гэрийн даалгавраар чинь тусална.', alt: ['Tonight I will help you with your homework'] },
  { answer: 'The bus arrived twenty minutes late this morning', mn: 'Өнөө өглөө автобус хорин минут хоцорч ирсэн.', alt: ['This morning the bus arrived twenty minutes late'] },
];

/** Level 6: present perfect, past continuous, 8–10 үг */
const LEVEL_6: SentencePuzzle[] = [
  { answer: 'I have never been to the sea before', mn: 'Би урьд өмнө далайд очиж үзээгүй.' },
  { answer: 'She has already finished reading that long book', mn: 'Тэр нөгөө урт номоо аль хэдийн уншиж дууссан.' },
  { answer: 'We were watching TV when the lights went out', mn: 'Гэрэл унтрахад бид зурагт үзэж байсан.', alt: ['When the lights went out we were watching TV'] },
  { answer: 'Have you ever eaten Korean food in Ulaanbaatar', mn: 'Чи Улаанбаатарт солонгос хоол идэж үзсэн үү?' },
  { answer: 'They have lived in this city for ten years', mn: 'Тэд энэ хотод арван жил амьдарч байна.' },
  { answer: 'He was sleeping while his mother was cooking dinner', mn: 'Ээжийг нь оройн хоол хийж байхад тэр унтаж байсан.', alt: ['While his mother was cooking dinner he was sleeping'] },
  { answer: 'My brother has just bought a new phone', mn: 'Ах маань дөнгөж сая шинэ утас авлаа.' },
  { answer: 'It was raining when we left the house', mn: 'Биднийг гэрээс гарахад бороо орж байсан.', alt: ['When we left the house it was raining'] },
  { answer: 'I have known my best friend since childhood', mn: 'Би хамгийн сайн найзтайгаа багаасаа танил.' },
  { answer: 'The children were playing outside all afternoon yesterday', mn: 'Хүүхдүүд өчигдөр үдээс хойш бүхэлдээ гадаа тоглож байсан.', alt: ['Yesterday the children were playing outside all afternoon'] },
  { answer: 'She has not seen her cousin for a long time', mn: 'Тэр үеэлтэйгээ удаан хугацаанд уулзаагүй.' },
  { answer: 'We have just arrived at the airport in Tokyo', mn: 'Бид дөнгөж сая Токиогийн нисэх буудалд ирлээ.' },
  { answer: 'Somebody was knocking on the door at midnight', mn: 'Шөнө дунд хэн нэгэн хаалга тогшиж байсан.', alt: ['At midnight somebody was knocking on the door'] },
];

/** Level 7: modal үйл үг (should, must, can, may, might), харьцуулал, 8–10 үг */
const LEVEL_7: SentencePuzzle[] = [
  { answer: 'You should drink more water during the hot summer', mn: 'Чи халуун зуны улиралд илүү их ус уух хэрэгтэй.' },
  { answer: 'This mountain is much higher than the one near us', mn: 'Энэ уул манай ойролцоох уулаас хамаагүй өндөр.' },
  { answer: 'We must finish the project before the end of May', mn: 'Бид тавдугаар сарын эцсээс өмнө төслөө дуусгах ёстой.' },
  { answer: 'She is the best singer in our whole school', mn: 'Тэр манай бүх сургуулийн хамгийн сайн дуучин.' },
  { answer: 'Can you speak a little more slowly please', mn: 'Та жаахан удаан ярьж өгнө үү?' },
  { answer: 'My new laptop is faster than my old one', mn: 'Миний шинэ зөөврийн компьютер хуучныхаасаа хурдан.' },
  { answer: 'Students may not use their phones during the exam', mn: 'Оюутнууд шалгалтын үеэр утсаа ашиглаж болохгүй.' },
  { answer: 'He could swim across the river when he was young', mn: 'Тэр залуудаа голыг сэлж гаталж чаддаг байсан.' },
  { answer: 'Winter in Mongolia is colder than winter in Korea', mn: 'Монголын өвөл Солонгосын өвлөөс хүйтэн.' },
  { answer: 'You do not have to come early tomorrow morning', mn: 'Чи маргааш өглөө эрт ирэх шаардлагагүй.', alt: ['Tomorrow morning you do not have to come early'] },
  { answer: 'This is the most interesting book I have read', mn: 'Энэ бол миний уншсан хамгийн сонирхолтой ном.' },
  { answer: 'We might go camping if the weather is nice', mn: 'Цаг агаар сайхан байвал бид аялалд гарч магадгүй.', alt: ['If the weather is nice we might go camping'] },
  { answer: 'Her little brother runs faster than anyone in the class', mn: 'Түүний дүү ангийнхаа хэнээс ч хурдан гүйдэг.' },
];

/** Level 8: нөхцөлт өгүүлбэр (if / unless), холбоос үгтэй (who, which, where, whose), 9–11 үг */
const LEVEL_8: SentencePuzzle[] = [
  { answer: 'If it rains tomorrow we will stay at home', mn: 'Маргааш бороо орвол бид гэртээ байна.', alt: ['We will stay at home if it rains tomorrow'] },
  { answer: 'The woman who lives next door is a famous doctor', mn: 'Хажуу айлд амьдардаг эмэгтэй бол алдартай эмч.' },
  { answer: 'This is the restaurant where we had dinner last year', mn: 'Энэ бол бидний өнгөрсөн жил оройн хоол идсэн ресторан.' },
  { answer: 'If I were rich I would travel around the world', mn: 'Хэрэв би баян байсан бол дэлхийгээр аялах байсан.', alt: ['I would travel around the world if I were rich'] },
  { answer: 'The book that you gave me was really interesting', mn: 'Чиний надад өгсөн ном үнэхээр сонирхолтой байсан.' },
  { answer: 'I will lend you my car if you drive carefully', mn: 'Чи болгоомжтой жолоодвол би машинаа чамд өгнө.', alt: ['If you drive carefully I will lend you my car'] },
  { answer: 'He is the teacher whose class everyone wants to join', mn: 'Тэр бол ангид нь бүгд орохыг хүсдэг багш.' },
  { answer: 'Unless you study harder you will fail the exam', mn: 'Чи илүү хичээж суралцахгүй бол шалгалтад унана.', alt: ['You will fail the exam unless you study harder'] },
  { answer: 'The movie which we watched yesterday was about space', mn: 'Бидний өчигдөр үзсэн кино сансрын тухай байсан.' },
  { answer: 'When the water boils add the rice and some salt', mn: 'Ус буцлахаар будаа болон жаахан давс нэм.' },
  { answer: 'People who exercise every day usually feel much better', mn: 'Өдөр бүр дасгал хийдэг хүмүүс ихэвчлэн хамаагүй сайн мэдрэмжтэй байдаг.' },
  { answer: 'If you heat ice it turns into water quickly', mn: 'Мөсийг халаавал тэр хурдан ус болдог.', alt: ['Ice turns into water quickly if you heat it'] },
  { answer: 'I do not know the man who is talking to Bat', mn: 'Баттай ярьж байгаа эрийг би танихгүй.' },
];

/** Level 9: үйлдэгдэх хэв (passive), шууд бус яриа, too / enough, 9–11 үг */
const LEVEL_9: SentencePuzzle[] = [
  { answer: 'This beautiful bridge was built more than a hundred years ago', mn: 'Энэ үзэсгэлэнт гүүрийг зуу гаруй жилийн өмнө барьсан.' },
  { answer: 'She told me that she would come to the party', mn: 'Тэр надад үдэшлэгт ирнэ гэж хэлсэн.' },
  { answer: 'English is spoken in many countries around the world', mn: 'Англи хэлээр дэлхийн олон оронд ярьдаг.' },
  { answer: 'The letter was sent to the wrong address by mistake', mn: 'Захиаг андуураад буруу хаягаар илгээжээ.' },
  { answer: 'My teacher said that the test would be very easy', mn: 'Багш маань шалгалт маш амархан байна гэж хэлсэн.' },
  { answer: 'The tea was too hot for the little girl to drink', mn: 'Цай бяцхан охиныг уухад хэтэрхий халуун байсан.' },
  { answer: 'These old photos were taken by my grandfather in 1980', mn: 'Эдгээр хуучин зургийг өвөө маань 1980 онд авсан.' },
  { answer: 'He asked me whether I had seen his black jacket', mn: 'Тэр надаас хар хүрмийг нь харсан эсэхийг асуусан.' },
  { answer: 'The new hospital will be opened by the mayor next month', mn: 'Шинэ эмнэлгийг ирэх сард хотын дарга нээнэ.', alt: ['Next month the new hospital will be opened by the mayor'] },
  { answer: 'She is not old enough to drive a car yet', mn: 'Тэр машин жолоодох насанд хараахан хүрээгүй.' },
  { answer: 'Thousands of trees are planted in the city every spring', mn: 'Хавар бүр хотод олон мянган мод тарьдаг.', alt: ['Every spring thousands of trees are planted in the city'] },
  { answer: 'They said that they had never visited the Gobi desert', mn: 'Тэд Говийн цөлд хэзээ ч очиж үзээгүй гэж хэлсэн.' },
  { answer: 'The homework must be handed in before Friday afternoon', mn: 'Гэрийн даалгаврыг баасан гарагийн үдээс өмнө өгөх ёстой.' },
];

/** Level 10: нийлмэл өгүүлбэр (although, even though, by the time, wish, 3-р нөхцөл, perfect continuous), 10–12 үг */
const LEVEL_10: SentencePuzzle[] = [
  { answer: 'Although it was snowing heavily we decided to climb the mountain', mn: 'Цас их орж байсан ч бид уул руу авирахаар шийдсэн.' },
  { answer: 'If she had studied harder she would have passed the exam', mn: 'Тэр илүү хичээж суралцсан бол шалгалтад тэнцэх байсан.' },
  { answer: 'By the time we arrived the concert had already started', mn: 'Биднийг ирэх үед концерт аль хэдийн эхэлсэн байлаа.' },
  { answer: 'I wish I could speak English as fluently as you', mn: 'Би чам шиг англиар чөлөөтэй ярьдаг байсан ч болоосой.' },
  { answer: 'The man who was arrested yesterday had stolen three cars', mn: 'Өчигдөр баривчлагдсан эр гурван машин хулгайлсан байжээ.' },
  { answer: 'Even though he was tired he kept working until midnight', mn: 'Тэр ядарсан ч шөнө дунд хүртэл ажилласаар байсан.' },
  { answer: 'She has been learning English since she was six years old', mn: 'Тэр зургаан настайгаасаа хойш англи хэл сурч байгаа.' },
  { answer: 'Nobody knew why the old factory had been closed so suddenly', mn: 'Хуучин үйлдвэр яагаад ийм гэнэт хаагдсаныг хэн ч мэдээгүй.' },
  { answer: 'The faster you finish your work the sooner you can leave', mn: 'Ажлаа хэдий чинээ хурдан дуусгана төдий чинээ эрт явж болно.' },
  { answer: 'It is important that children learn to read at an early age', mn: 'Хүүхэд бага наснаасаа уншиж сурах нь чухал.' },
  { answer: 'He would have caught the train if he had left earlier', mn: 'Тэр эрт гарсан бол галт тэргэндээ амжих байсан.' },
  { answer: 'We have been waiting for the bus for almost an hour', mn: 'Бид автобусыг бараг нэг цаг хүлээж байна.' },
  { answer: 'Despite the heavy traffic they managed to arrive on time', mn: 'Замын түгжрэлтэй байсан ч тэд цагтаа ирж чадсан.' },
];

export type SentenceLevel = {
  level: number;
  /** Богино нэр (HUD, консол) */
  title: string;
  /** Дүрмийн тайлбар (эхлэх дэлгэц, зөвлөмж) */
  grammar: string;
  sentences: SentencePuzzle[];
};

function withLevel(level: number, list: SentencePuzzle[]): SentencePuzzle[] {
  return list.map((p) => ({ ...p, level }));
}

/** 1–10 level: тавцан бүр нэг level. Level ахих тусам үг нэмэгдэж, дүрэм хүндэрнэ. */
export const SENTENCE_LEVELS: SentenceLevel[] = [
  { level: 1, title: 'Одоо цаг · энгийн', grammar: 'Энгийн одоо цаг, be үйл үг', sentences: withLevel(1, BY_LENGTH[5]) },
  { level: 2, title: 'Одоо цаг · цагийн үг', grammar: 'Одоо цаг, цагийн нэмэлт (every day, at seven)', sentences: withLevel(2, BY_LENGTH[6]) },
  { level: 3, title: 'Одоо үргэлжлэх', grammar: 'Одоо цаг ба одоо үргэлжлэх цаг (is doing)', sentences: withLevel(3, BY_LENGTH[7]) },
  { level: 4, title: 'Урт өгүүлбэр', grammar: 'Урт өгүүлбэр, going to, after / before', sentences: withLevel(4, BY_LENGTH[8]) },
  { level: 5, title: 'Өнгөрсөн · ирээдүй', grammar: 'Past simple, will, going to', sentences: withLevel(5, LEVEL_5) },
  { level: 6, title: 'Perfect · continuous', grammar: 'Present perfect (have done), past continuous (was doing)', sentences: withLevel(6, LEVEL_6) },
  { level: 7, title: 'Modal · харьцуулал', grammar: 'should / must / can / may, -er than, the most', sentences: withLevel(7, LEVEL_7) },
  { level: 8, title: 'If · who / which', grammar: 'Нөхцөлт өгүүлбэр, холбоос үг (who, which, where, whose)', sentences: withLevel(8, LEVEL_8) },
  { level: 9, title: 'Passive · шууд бус яриа', grammar: 'Үйлдэгдэх хэв (was built), said that, too / enough', sentences: withLevel(9, LEVEL_9) },
  { level: 10, title: 'Нийлмэл өгүүлбэр', grammar: 'Although, by the time, wish, 3-р нөхцөл, perfect continuous', sentences: withLevel(10, LEVEL_10) },
];

/** Бүх өгүүлбэр нэг жагсаалтаар (тест, статистик). */
export const SENTENCE_PUZZLES: SentencePuzzle[] = SENTENCE_LEVELS.flatMap((l) => l.sentences);

export function levelInfo(level: number): SentenceLevel {
  return SENTENCE_LEVELS[Math.max(1, Math.min(LEVEL_COUNT, level)) - 1];
}

/** Эзэмшлийн түлхүүр: жижиг үсэг, цэг таслалгүй хариулт. */
export function puzzleKey(puzzle: SentencePuzzle): string {
  return normalizeSentence(puzzle.answer);
}

/** Өгүүлбэрийн үгс (цэг таслалгүй). Эхний үгийг жижиг үсгээр — зөв дарааллыг үсгээр таахгүй. */
export function wordsOf(puzzle: SentencePuzzle): string[] {
  return tokenize(puzzle.answer).map((w, i) => (i === 0 && !/^I($|')/.test(w) ? w.toLowerCase() : w));
}

function tokenize(s: string): string[] {
  return s
    .replace(/[’‘`]/g, "'")
    .replace(/[.!?,;:]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function wordCount(puzzle: SentencePuzzle): number {
  return tokenize(puzzle.answer).length;
}

/** Раунд (0-based) → level 1..10. Раундын тоо 10-аас өөр бол тэнцүү тараана. */
export function levelForRound(round: number, total = ROUNDS_PER_GAME): number {
  if (total <= 1) return 1;
  const k = round / (total - 1); // 0 → 1
  return Math.max(1, Math.min(LEVEL_COUNT, 1 + Math.floor(k * LEVEL_COUNT * 0.999)));
}

/** Тухайн өгүүлбэрт өгөх секунд: суурь + үг бүрт 3с + 5-аас илүү үг бүрт 10с (суурь 30с: 5 үг = 45с, 8 үг = 84с). */
export function roundSeconds(puzzle: SentencePuzzle): number {
  const n = wordCount(puzzle);
  return BASE_ROUND_SECONDS + n * SECONDS_PER_WORD + (n - MIN_WORDS) * SECONDS_PER_EXTRA_WORD;
}

/** Том/жижиг үсэг, цэг таслал, давхар зайг үл тооцон харьцуулахад бэлтгэнэ. */
export function normalizeSentence(input: string): string {
  return input
    .replace(/[’‘`]/g, "'")
    .toLowerCase()
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isCorrectAnswer(puzzle: SentencePuzzle, input: string): boolean {
  const n = normalizeSentence(input);
  if (!n) return false;
  if (normalizeSentence(puzzle.answer) === n) return true;
  return (puzzle.alt ?? []).some((a) => normalizeSentence(a) === n);
}

/**
 * Буруу хариултын зөвлөмж: дутуу үг, илүү үг, эсвэл дараалал буруу.
 * Бүх үг өгөгдсөн тул тоглогчид яг юу нь буруу байгааг хэлж болно.
 */
export function answerHint(puzzle: SentencePuzzle, input: string): string {
  const want = wordsOf(puzzle).map((w) => normalizeSentence(w));
  const got = normalizeSentence(input).split(' ').filter(Boolean);
  const pool = [...want];
  const extra: string[] = [];
  for (const g of got) {
    const i = pool.indexOf(g);
    if (i >= 0) pool.splice(i, 1);
    else extra.push(g);
  }
  const parts: string[] = [];
  if (pool.length) parts.push(`дутуу: ${pool.join(', ')}`);
  if (extra.length) parts.push(`илүү: ${extra.join(', ')}`);
  if (!parts.length) return 'Бүх үг зөв, харин дараалал буруу байна. Дахин оролд!';
  return `Буруу байна — ${parts.join(' · ')}.`;
}

/** Tip-д харуулах жишээ өгүүлбэр (цэгтэй). */
export function exampleSentence(puzzle: SentencePuzzle): string {
  const s = puzzle.answer;
  return /[.!?]$/.test(s) ? s : `${s}.`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Нэг тоглолтын өгүүлбэрүүд: раунд бүр өөрийн level-ээс санамсаргүй нэг өгүүлбэр.
 * Асуудалгүй зөв хариулж эзэмшсэн (mastered) өгүүлбэрийг алгасна; тухайн level-ийн бүх өгүүлбэр
 * эзэмшигдсэн бол тэднээс дахин авна (тоглоом зогсохгүй).
 */
export function pickRoundPuzzles(count = ROUNDS_PER_GAME, mastered: ReadonlySet<string> = new Set()): SentencePuzzle[] {
  const fresh = new Map<number, SentencePuzzle[]>();
  const all = new Map<number, SentencePuzzle[]>();
  for (const lv of SENTENCE_LEVELS) {
    all.set(lv.level, shuffle(lv.sentences));
    fresh.set(lv.level, shuffle(lv.sentences.filter((p) => !mastered.has(puzzleKey(p)))));
  }
  const out: SentencePuzzle[] = [];
  for (let i = 0; i < count; i++) {
    const level = levelForRound(i, count);
    const picked = fresh.get(level)?.pop() ?? all.get(level)?.pop();
    if (!picked) break;
    out.push(picked);
  }
  return out;
}

/** Хэрэглэгч тухайн level-д хэдэн өгүүлбэр эзэмшсэнийг тоолно (эхлэх дэлгэцийн явц). */
export function masteryByLevel(mastered: ReadonlySet<string>): { level: number; done: number; total: number }[] {
  return SENTENCE_LEVELS.map((lv) => ({
    level: lv.level,
    done: lv.sentences.filter((p) => mastered.has(puzzleKey(p))).length,
    total: lv.sentences.length,
  }));
}

const MASTERY_KEY = 'ce.sentence-builder.mastered';

/** Эзэмшсэн өгүүлбэрүүдийн түлхүүр (localStorage — сервертэй нэгтгэж ашиглана). */
export function loadMasteredLocal(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(MASTERY_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return new Set(Array.isArray(arr) ? arr.filter((k): k is string => typeof k === 'string') : []);
  } catch {
    return new Set();
  }
}

export function saveMasteredLocal(keys: ReadonlySet<string>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(MASTERY_KEY, JSON.stringify([...keys]));
  } catch {
    // хадгалах боломжгүй (private mode г.м.) — үл тоомсорлоно
  }
}

/** Үгсийг холино — анхны дараалалтай яг адил бол дахин холино. */
export function shuffledWords(puzzle: SentencePuzzle): string[] {
  const base = wordsOf(puzzle);
  let w = shuffle(base);
  for (let tries = 0; tries < 5 && w.every((x, i) => x === base[i]); tries++) w = shuffle(base);
  return w;
}

/** Хариултын оноо: үгийн тоо × 2 + үлдсэн хугацааны урамшуулал. Tip ашигласан бол тогтмол бага оноо. */
export function scoreFor(puzzle: SentencePuzzle, remainMs: number, usedTip: boolean): number {
  if (usedTip) return POINTS_WITH_TIP;
  const total = roundSeconds(puzzle) * 1000;
  const bonus = Math.min(BONUS_MAX, Math.round((remainMs / total) * BONUS_MAX));
  return wordCount(puzzle) * POINTS_PER_WORD + bonus;
}

/**
 * Цаг багасах тусам ногооноос шар, улаан руу шилжих өнгө.
 * fraction = үлдсэн хугацаа / нийт хугацаа (1 → 0).
 */
export function timerColor(fraction: number): string {
  const f = Math.max(0, Math.min(1, fraction));
  const hue = Math.round(130 * f); // 130 = ногоон, 0 = улаан
  const light = 58 + Math.round((1 - f) * 6);
  return `hsl(${hue} 90% ${light}%)`;
}

const BEST_KEY = 'ce.sentence-builder.best';

export type BestScore = { score: number; correct: number; at: string };

export function loadBest(): BestScore | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(BEST_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Partial<BestScore>;
    if (typeof v.score !== 'number' || typeof v.correct !== 'number') return null;
    return { score: v.score, correct: v.correct, at: typeof v.at === 'string' ? v.at : '' };
  } catch {
    return null;
  }
}

export function saveBestIfBetter(result: { score: number; correct: number }): boolean {
  if (typeof window === 'undefined') return false;
  const prev = loadBest();
  if (prev && prev.score >= result.score) return false;
  try {
    window.localStorage.setItem(BEST_KEY, JSON.stringify({ ...result, at: new Date().toISOString() }));
  } catch {
    return false;
  }
  return true;
}
