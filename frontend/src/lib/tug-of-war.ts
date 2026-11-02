// frontend/src/lib/tug-of-war.ts
// "Олс татах" тоглоомын дүрэм, асуултын сан, ботын профайл, туслах функцууд.
// Хоёр баг (улаан / цэнхэр) олсны хоёр талд. Тоглогч бүр өөрийн нөхөж бичих өгүүлбэрт 4 сонголтоос
// зөвийг нь сонгоход олс түүний тал руу PULL_STEP-ээр татагдана. Голын улаан тууз аль нэг багийн
// шугамыг (±1) давбал тэр баг олсыг өөр тийшээ татаж хожно. Хугацаа дуусвал тууз аль талд байгаагаар шийднэ.
// Онлайн горимд backend (backend/src/tug-of-war) яг ижил тогтмолуудыг ашиглана — өөрчилбөл хоёуланг нь өөрчил.

export type Team = 'red' | 'blue';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
/** Тоглолтын нийт хугацаа (секунд). */
export type Duration = 180 | 300 | 480 | 600;

export const TEAMS: Team[] = ['red', 'blue'];
export const DURATIONS: { value: Duration; label: string }[] = [
  { value: 180, label: '3 мин' },
  { value: 300, label: '5 мин' },
  { value: 480, label: '8 мин' },
  { value: 600, label: '10 мин' },
];

/** Зөв хариулт бүрт олс хэр татагдах (±1 = шугам). */
export const PULL_STEP = 0.12;
/** Буруу хариулсны дараа дараагийн асуулт ирэх хүртэлх түгжээ (мс). */
export const WRONG_LOCK_MS = 1200;
/** Зөв хариулсны дараа дараагийн асуулт ирэх хүртэлх богино завсарлага (мс). */
export const CORRECT_LOCK_MS = 450;
export const COUNTDOWN_MS = 3200;
/** Нэг тоглолтод хост серверт илгээх асуултын тоо (дуусвал эхнээс нь давтана). */
export const QUESTIONS_PER_GAME = 60;
/** Зөв хариулт бүрийн оноо, ялалтын урамшуулал (хүндрэлээр). */
export const POINTS_PER_CORRECT = 10;
export const WIN_BONUS: Record<Difficulty, number> = { easy: 20, medium: 40, hard: 60, expert: 80 };

export const TEAM_INFO: Record<Team, { label: string; color: string; dark: string; light: string }> = {
  red: { label: 'Улаан баг', color: '#FF4D4D', dark: '#9E1F1F', light: '#FF8A8A' },
  blue: { label: 'Цэнхэр баг', color: '#4F8CFF', dark: '#1E3F8A', light: '#8FB5FF' },
};

export function otherTeam(t: Team): Team {
  return t === 'red' ? 'blue' : 'red';
}

/** Олсны чиглэл: улаан зүүн тал (-1), цэнхэр баруун тал (+1). */
export function teamSign(t: Team): -1 | 1 {
  return t === 'red' ? -1 : 1;
}

/** Туузны байрлалаас хожсон багийг тодорхойлно (шугам давсан бол). */
export function winnerByLine(pos: number): Team | null {
  if (pos <= -1) return 'red';
  if (pos >= 1) return 'blue';
  return null;
}

/** Хугацаа дуусахад: тууз аль талд байгаа нь хожно, яг голд бол тэнцээ. */
export function winnerByTime(pos: number): Team | 'draw' {
  if (Math.abs(pos) < 1e-6) return 'draw';
  return pos < 0 ? 'red' : 'blue';
}

export type BotProfile = {
  level: Difficulty;
  label: string;
  hint: string;
  /** Зөв хариулах магадлал. */
  accuracy: number;
  /** Хариулах хугацаа [min, max] мс. */
  thinkMs: [number, number];
};

export const BOT_LEVELS: BotProfile[] = [
  { level: 'easy', label: 'Easy', hint: 'Удаан, олон алддаг', accuracy: 0.55, thinkMs: [6500, 10000] },
  { level: 'medium', label: 'Medium', hint: 'Дунд зэрэг', accuracy: 0.7, thinkMs: [4500, 7500] },
  { level: 'hard', label: 'Hard', hint: 'Хурдан, цөөн алддаг', accuracy: 0.85, thinkMs: [2800, 4800] },
  { level: 'expert', label: 'Expert', hint: 'Маш хурдан, бараг алддаггүй', accuracy: 0.95, thinkMs: [1600, 3000] },
];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert' };

export function botProfile(level: Difficulty): BotProfile {
  return BOT_LEVELS.find((b) => b.level === level) ?? BOT_LEVELS[0];
}

export const BOT_NAMES = ['Бат', 'Сараа', 'Тэмүүлэн', 'Номин', 'Анар', 'Хулан', 'Ганаа', 'Долгор', 'Мишээл', 'Отгоо'];

export function randomBotName(): string {
  return BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
}

/** Нэг асуулт: өгүүлбэр (___ хоосон зай), 4 сонголт, зөв сонголтын индекс. */
export type TugQuestion = {
  /** Өгүүлбэр — хоосон зайг ___ гэж тэмдэглэнэ. */
  text: string;
  options: string[];
  answer: number;
  /** Монгол утга (сонголтын дор жижгээр). */
  mn: string;
};

type RawQ = [text: string, options: string[], mn: string];

/** Түвшин бүрийн сан: эхний сонголт нь зөв — pickQuestions холино. */
const BANK: Record<1 | 2 | 3 | 4, RawQ[]> = {
  // ── Tier 1: be, одоо цаг, энгийн үг (A1) ──
  1: [
    ['I ___ a student.', ['am', 'is', 'are', 'be'], 'Би сурагч.'],
    ['She ___ my sister.', ['is', 'am', 'are', 'be'], 'Тэр миний эгч.'],
    ['They ___ at home now.', ['are', 'is', 'am', 'be'], 'Тэд одоо гэртээ байна.'],
    ['He ___ to school every day.', ['goes', 'go', 'going', 'gone'], 'Тэр өдөр бүр сургуульд явдаг.'],
    ['We ___ football on Sundays.', ['play', 'plays', 'playing', 'played'], 'Бид ням гарагт хөлбөмбөг тоглодог.'],
    ['I have ___ apple.', ['an', 'a', 'the', 'some'], 'Надад нэг алим бий.'],
    ['This is ___ book.', ['a', 'an', 'any', 'much'], 'Энэ бол ном.'],
    ['My father ___ in a bank.', ['works', 'work', 'working', 'worked'], 'Аав маань банкинд ажилладаг.'],
    ['___ you like tea?', ['Do', 'Does', 'Are', 'Is'], 'Та цайнд дуртай юу?'],
    ['___ she speak English?', ['Does', 'Do', 'Is', 'Are'], 'Тэр англиар ярьдаг уу?'],
    ['The cat is ___ the table.', ['under', 'between', 'into', 'from'], 'Муур ширээн доор байна.'],
    ['I get up ___ seven o’clock.', ['at', 'in', 'on', 'to'], 'Би долоон цагт босдог.'],
    ['We go to school ___ Monday.', ['on', 'in', 'at', 'by'], 'Бид даваа гарагт сургуульд явдаг.'],
    ['There ___ two chairs in the room.', ['are', 'is', 'am', 'be'], 'Өрөөнд хоёр сандал бий.'],
    ['There ___ a dog in the garden.', ['is', 'are', 'am', 'be'], 'Цэцэрлэгт нохой байна.'],
    ['She ___ like coffee.', ['doesn’t', 'don’t', 'isn’t', 'aren’t'], 'Тэр кофенд дургүй.'],
    ['I ___ like fish.', ['don’t', 'doesn’t', 'am not', 'not'], 'Би загасанд дургүй.'],
    ['How ___ are you? I am ten.', ['old', 'many', 'much', 'long'], 'Чи хэдэн настай вэ? Би арван настай.'],
    ['___ is your name?', ['What', 'Who', 'Where', 'When'], 'Таны нэр хэн бэ?'],
    ['___ do you live? In Ulaanbaatar.', ['Where', 'What', 'When', 'Who'], 'Та хаана амьдардаг вэ? Улаанбаатарт.'],
    ['These are ___ books.', ['my', 'me', 'I', 'mine'], 'Эдгээр нь миний номнууд.'],
    ['This is ___ car.', ['his', 'he', 'him', 'himself'], 'Энэ бол түүний машин.'],
    ['I can ___ very fast.', ['run', 'runs', 'running', 'ran'], 'Би маш хурдан гүйж чадна.'],
    ['She ___ TV every evening.', ['watches', 'watch', 'watching', 'watched'], 'Тэр орой бүр зурагт үздэг.'],
    ['It ___ cold today.', ['is', 'are', 'am', 'be'], 'Өнөөдөр хүйтэн байна.'],
    ['We ___ hungry.', ['are', 'is', 'am', 'be'], 'Бид өлсөж байна.'],
    ['I ___ got a brother.', ['have', 'has', 'am', 'is'], 'Надад ах (дүү) бий.'],
    ['He ___ got a new phone.', ['has', 'have', 'is', 'are'], 'Тэр шинэ утастай болсон.'],
    ['Open ___ door, please.', ['the', 'a', 'an', 'some'], 'Хаалгыг нээгээд өгөөч.'],
    ['I like ___ music.', ['listening to', 'listen', 'listens', 'to listening'], 'Би хөгжим сонсох дуртай.'],
  ],
  // ── Tier 2: одоо үргэлжлэх, өнгөрсөн, ирээдүй, тоо / some-any (A2-) ──
  2: [
    ['Look! It ___ now.', ['is raining', 'rains', 'rain', 'rained'], 'Хараач! Одоо бороо орж байна.'],
    ['She ___ a book at the moment.', ['is reading', 'reads', 'read', 'reading'], 'Тэр яг одоо ном уншиж байна.'],
    ['We ___ to the cinema yesterday.', ['went', 'go', 'goes', 'going'], 'Бид өчигдөр кинотеатрт очсон.'],
    ['I ___ my homework last night.', ['did', 'do', 'does', 'done'], 'Би өчигдөр орой гэрийн даалгавраа хийсэн.'],
    ['They ___ in Darkhan in 2010.', ['lived', 'live', 'lives', 'living'], 'Тэд 2010 онд Дарханд амьдарч байсан.'],
    ['He ___ come to the party last week.', ['didn’t', 'doesn’t', 'don’t', 'wasn’t'], 'Тэр өнгөрсөн долоо хоногт үдэшлэгт ирээгүй.'],
    ['___ you see the film yesterday?', ['Did', 'Do', 'Does', 'Were'], 'Чи өчигдөр кино үзсэн үү?'],
    ['I ___ you tomorrow.', ['will call', 'call', 'called', 'calling'], 'Би маргааш чам руу залгана.'],
    ['We ___ visit our grandmother next week.', ['are going to', 'go to', 'went to', 'going'], 'Бид дараа долоо хоногт эмээ дээрээ очно.'],
    ['Is there ___ milk in the fridge?', ['any', 'some', 'a', 'many'], 'Хөргөгчинд сүү байна уу?'],
    ['I need ___ sugar.', ['some', 'any', 'a', 'many'], 'Надад жаахан элсэн чихэр хэрэгтэй.'],
    ['How ___ money do you have?', ['much', 'many', 'often', 'long'], 'Чамд хэр их мөнгө байна вэ?'],
    ['How ___ students are in the class?', ['many', 'much', 'long', 'far'], 'Ангид хэдэн сурагч байна вэ?'],
    ['She is ___ than her brother.', ['taller', 'tall', 'tallest', 'more tall'], 'Тэр ахаасаа илүү өндөр.'],
    ['This is the ___ day of my life.', ['best', 'good', 'better', 'well'], 'Энэ миний амьдралын хамгийн сайхан өдөр.'],
    ['I was tired, ___ I went to bed early.', ['so', 'but', 'because', 'or'], 'Би ядарсан тул эрт унтсан.'],
    ['He is good ___ maths.', ['at', 'in', 'on', 'for'], 'Тэр математикт сайн.'],
    ['I am interested ___ history.', ['in', 'at', 'on', 'of'], 'Би түүхийг сонирхдог.'],
    ['You ___ wear a helmet on a bike.', ['should', 'shouldn’t', 'can’t', 'needn’t'], 'Дугуй унахдаа дуулга өмсөх хэрэгтэй.'],
    ['___ I open the window?', ['Can', 'Do', 'Am', 'Does'], 'Би цонх нээж болох уу?'],
    ['She ___ swim when she was five.', ['could', 'can', 'may', 'must'], 'Тэр таван настайдаа сэлж чаддаг байсан.'],
    ['We ___ lunch when he called.', ['were having', 'had', 'have', 'are having'], 'Түүнийг залгахад бид өдрийн хоол идэж байсан.'],
    ['I usually ___ to work by bus.', ['go', 'am going', 'went', 'gone'], 'Би ихэвчлэн ажилдаа автобусаар явдаг.'],
    ['There isn’t ___ bread left.', ['any', 'some', 'no', 'a'], 'Талх огт үлдсэнгүй.'],
    ['Whose bag is this? It’s ___.', ['mine', 'my', 'me', 'I'], 'Энэ хэний цүнх вэ? Минийх.'],
    ['I ___ never been to Japan.', ['have', 'has', 'am', 'was'], 'Би Японд хэзээ ч очиж байгаагүй.'],
    ['She ___ just finished her work.', ['has', 'have', 'is', 'was'], 'Тэр саяхан ажлаа дуусгасан.'],
    ['Turn ___ the light, please.', ['off', 'out', 'away', 'down'], 'Гэрлээ унтраагаад өгөөч.'],
    ['It’s ___ expensive restaurant.', ['an', 'a', 'the', 'some'], 'Энэ бол үнэтэй ресторан.'],
    ['He ___ his keys this morning.', ['lost', 'loses', 'lose', 'losing'], 'Тэр өнөө өглөө түлхүүрээ гээсэн.'],
  ],
  // ── Tier 3: present perfect / continuous, modal, нөхцөл, холбоос үг (B1-) ──
  3: [
    ['I ___ here since 2015.', ['have lived', 'live', 'lived', 'am living'], 'Би 2015 оноос хойш энд амьдарч байна.'],
    ['She has worked here ___ three years.', ['for', 'since', 'during', 'from'], 'Тэр энд гурван жил ажиллаж байна.'],
    ['Have you ___ eaten sushi?', ['ever', 'never', 'yet', 'already'], 'Чи хэзээ нэгэн цагт суши идэж үзсэн үү?'],
    ['I haven’t finished the report ___.', ['yet', 'already', 'still', 'just'], 'Би тайлангаа хараахан дуусгаагүй байна.'],
    ['If it ___ tomorrow, we will stay at home.', ['rains', 'will rain', 'rained', 'rain'], 'Маргааш бороо орвол бид гэртээ байна.'],
    ['If I ___ rich, I would travel the world.', ['were', 'am', 'will be', 'be'], 'Хэрэв би баян байсан бол дэлхийгээр аялах байсан.'],
    ['The man ___ lives next door is a doctor.', ['who', 'which', 'whose', 'where'], 'Хажуу айлд амьдардаг эр хүн бол эмч.'],
    ['This is the house ___ I was born.', ['where', 'which', 'who', 'when'], 'Энэ миний төрсөн байшин.'],
    ['The book ___ you gave me is great.', ['which', 'who', 'whose', 'where'], 'Таны надад өгсөн ном гайхалтай.'],
    ['You ___ smoke here. It’s forbidden.', ['mustn’t', 'don’t have to', 'shouldn’t have', 'needn’t'], 'Энд тамхи татаж болохгүй. Хориотой.'],
    ['You ___ come if you don’t want to.', ['don’t have to', 'mustn’t', 'can’t', 'couldn’t'], 'Хэрэв хүсэхгүй бол та ирэх албагүй.'],
    ['She ___ be at work; her car is outside.', ['must', 'can’t', 'mustn’t', 'shouldn’t'], 'Тэр ажил дээрээ байгаа нь гарцаагүй; машин нь гадаа байна.'],
    ['I ___ TV when the phone rang.', ['was watching', 'watched', 'am watching', 'watch'], 'Утас дуугарахад би зурагт үзэж байсан.'],
    ['While I ___, I found an old photo.', ['was cleaning', 'cleaned', 'clean', 'am cleaning'], 'Цэвэрлэж байхдаа би хуучин зураг олсон.'],
    ['He is used to ___ early.', ['getting up', 'get up', 'got up', 'gets up'], 'Тэр эрт босож дассан.'],
    ['I look forward to ___ you.', ['seeing', 'see', 'saw', 'seen'], 'Би чамтай уулзахыг тэсэн ядан хүлээж байна.'],
    ['She asked me ___ I was tired.', ['if', 'that', 'what', 'did'], 'Тэр надаас ядарсан эсэхийг асуусан.'],
    ['He said that he ___ busy.', ['was', 'is', 'be', 'were'], 'Тэр завгүй байна гэж хэлсэн.'],
    ['The coffee is ___ hot to drink.', ['too', 'enough', 'very much', 'so much'], 'Кофе нь уухад хэтэрхий халуун байна.'],
    ['He isn’t old ___ to drive.', ['enough', 'too', 'very', 'much'], 'Тэр машин жолоодоход хангалттай настай биш.'],
    ['This bridge ___ in 1990.', ['was built', 'built', 'is built', 'has built'], 'Энэ гүүрийг 1990 онд барьсан.'],
    ['English ___ all over the world.', ['is spoken', 'speaks', 'spoke', 'is speaking'], 'Англи хэлээр дэлхий даяар ярьдаг.'],
    ['I’d rather ___ at home tonight.', ['stay', 'to stay', 'staying', 'stayed'], 'Би өнөө орой гэртээ байхыг илүүд үзнэ.'],
    ['It’s the ___ film I have ever seen.', ['most boring', 'more boring', 'boringest', 'boring'], 'Энэ миний үзсэн хамгийн уйтгартай кино.'],
    ['She drives ___ than her husband.', ['more carefully', 'carefuller', 'most carefully', 'careful'], 'Тэр нөхрөөсөө илүү болгоомжтой машин барьдаг.'],
    ['By the time we arrived, the film ___.', ['had started', 'started', 'has started', 'starts'], 'Биднийг ирэхэд кино эхэлчихсэн байсан.'],
    ['I wish I ___ more free time.', ['had', 'have', 'will have', 'am having'], 'Надад илүү чөлөөт цаг байсан бол гэж хүсдэг.'],
    ['Unless you hurry, you ___ the bus.', ['will miss', 'miss', 'missed', 'would miss'], 'Яаравчлахгүй бол автобусанд хоцорно.'],
    ['I’m not keen ___ horror films.', ['on', 'in', 'at', 'for'], 'Би аймшгийн кинонд тийм ч дуртай биш.'],
    ['He apologised ___ being late.', ['for', 'about', 'of', 'at'], 'Тэр хоцорсондоо уучлалт гуйсан.'],
  ],
  // ── Tier 4: 3-р нөхцөл, perfect continuous, inversion, phrasal, нарийн дүрэм (B1+/B2) ──
  4: [
    ['If I had known, I ___ you.', ['would have told', 'would tell', 'will tell', 'had told'], 'Мэдсэн бол би чамд хэлэх байсан.'],
    ['She ___ for two hours when he finally came.', ['had been waiting', 'waited', 'has waited', 'was waited'], 'Түүнийг ирэхэд тэр хоёр цаг хүлээчихсэн байсан.'],
    ['I ___ English for ten years by next June.', ['will have been studying', 'will study', 'have studied', 'am studying'], 'Ирэх зургадугаар сар гэхэд би англи хэлийг арван жил сурсан байна.'],
    ['___ had I sat down when the phone rang.', ['Hardly', 'Only', 'Never', 'Rarely'], 'Би сууж амжаагүй байтал утас дуугарав.'],
    ['Not only ___ late, but he also forgot the tickets.', ['was he', 'he was', 'he is', 'is he'], 'Тэр хоцорсон төдийгүй тасалбараа ч мартсан.'],
    ['The report ___ by the time the boss arrives.', ['will have been finished', 'will finish', 'is finished', 'has finished'], 'Дарга ирэх үед тайлан дуусчихсан байх болно.'],
    ['He denied ___ the money.', ['taking', 'to take', 'take', 'taken'], 'Тэр мөнгө авснаа үгүйсгэсэн.'],
    ['I regret ___ him the truth.', ['not telling', 'not to tell', 'to not tell', 'don’t tell'], 'Би түүнд үнэнийг хэлээгүйдээ харамсдаг.'],
    ['She suggested ___ to the museum.', ['going', 'to go', 'go', 'went'], 'Тэр музейд очихыг санал болгосон.'],
    ['You ___ have seen him; he was abroad.', ['can’t', 'mustn’t', 'shouldn’t', 'needn’t'], 'Чи түүнийг харсан байх боломжгүй; тэр гадаадад байсан.'],
    ['He ___ have called — she was waiting all day.', ['should', 'can', 'would', 'might not'], 'Тэр залгах ёстой байсан — тэр бүтэн өдөр хүлээсэн.'],
    ['I’d sooner you ___ smoke in here.', ['didn’t', 'don’t', 'won’t', 'not'], 'Чи энд тамхи татахгүй байгаасай гэж хүсэж байна.'],
    ['It’s high time we ___.', ['left', 'leave', 'will leave', 'are leaving'], 'Бидний явах цаг аль хэдийн болсон.'],
    ['The project was called ___ due to lack of funds.', ['off', 'out', 'down', 'up'], 'Хөрөнгө мөнгө дутагдсанаас төслийг цуцалсан.'],
    ['I can’t put ___ with his behaviour any longer.', ['up', 'on', 'off', 'down'], 'Би түүний зан авирыг цаашид тэвчиж чадахгүй.'],
    ['She takes ___ her mother.', ['after', 'up', 'over', 'in'], 'Тэр ээжтэйгээ төстэй (ээжийгээ дуурайсан).'],
    ['Had I ___ earlier, I would have caught the train.', ['left', 'leave', 'leaving', 'been left'], 'Эрт явсан бол би галт тэргэнд амжих байсан.'],
    ['Were it not for your help, I ___ lost.', ['would be', 'will be', 'am', 'were'], 'Таны тусламж байгаагүй бол би төөрөх байсан.'],
    ['The more you practise, ___ you get.', ['the better', 'better', 'the best', 'the good'], 'Хичээх тусам улам сайжирна.'],
    ['He is said ___ a fortune in the stock market.', ['to have made', 'to make', 'making', 'that made'], 'Түүнийг хөрөнгийн зах зээлээс их хөрөнгө олсон гэж ярьдаг.'],
    ['___ the rain, the match went ahead.', ['Despite', 'Although', 'However', 'Even'], 'Бороотой байсан ч тоглолт үргэлжилсэн.'],
    ['___ he was tired, he kept working.', ['Although', 'Despite', 'In spite', 'However'], 'Тэр ядарсан ч ажиллаж байсан.'],
    ['Scarcely ___ the house when it started to rain.', ['had we left', 'we had left', 'we left', 'did we leave'], 'Биднийг гэрээс гармагц бороо орж эхэлсэн.'],
    ['I’d appreciate it if you ___ me know.', ['could let', 'let', 'will let', 'letting'], 'Та надад мэдэгдэж чадвал би талархах болно.'],
    ['The suspect is believed ___ the country.', ['to have left', 'leaving', 'left', 'to leave'], 'Сэжигтнийг улсаас гарсан гэж үзэж байна.'],
    ['Little ___ that the test had been cancelled.', ['did she know', 'she knew', 'she did know', 'knew she'], 'Шалгалт цуцлагдсаныг тэр огт мэдээгүй.'],
    ['I wish you ___ interrupting me.', ['would stop', 'stop', 'stopped', 'will stop'], 'Чи намайг таслахаа болиосой гэж хүсэж байна.'],
    ['They objected ___ treated like children.', ['to being', 'to be', 'being', 'be'], 'Тэд хүүхэд шиг харьцахыг нь эсэргүүцсэн.'],
    ['She made him ___ the whole room.', ['clean', 'to clean', 'cleaning', 'cleaned'], 'Тэр түүгээр бүтэн өрөөг цэвэрлүүлсэн.'],
    ['No sooner had he arrived ___ the meeting began.', ['than', 'when', 'then', 'that'], 'Түүнийг ирмэгц хурал эхэлсэн.'],
  ],
};

/** Хүндрэл бүрийн асуултын түвшингүүд (жингийн хамт). */
const TIERS_BY_DIFFICULTY: Record<Difficulty, (1 | 2 | 3 | 4)[]> = {
  easy: [1, 1, 1, 2],
  medium: [1, 2, 2, 3],
  hard: [2, 3, 3, 4],
  expert: [3, 4, 4, 4],
};

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toQuestion(raw: RawQ): TugQuestion {
  const [text, options, mn] = raw;
  const correct = options[0];
  const shuffled = shuffle(options);
  return { text, options: shuffled, answer: shuffled.indexOf(correct), mn };
}

/**
 * Тоглолтын асуултууд: хүндрэлийн жингээр түвшингүүдээс холино, давхардахгүй.
 * Сан дуусвал (count их бол) дахин холиод үргэлжлүүлнэ.
 */
export function pickQuestions(difficulty: Difficulty, count = QUESTIONS_PER_GAME): TugQuestion[] {
  const tiers = TIERS_BY_DIFFICULTY[difficulty];
  const pools = new Map<number, RawQ[]>();
  const refill = (t: 1 | 2 | 3 | 4) => pools.set(t, shuffle(BANK[t]));
  for (const t of tiers) if (!pools.has(t)) refill(t);
  const out: TugQuestion[] = [];
  const used = new Set<string>();
  let guard = 0;
  while (out.length < count && guard++ < count * 10) {
    const t = tiers[Math.floor(Math.random() * tiers.length)];
    let pool = pools.get(t)!;
    if (pool.length === 0) {
      refill(t);
      pool = pools.get(t)!;
      used.clear();
    }
    const raw = pool.pop()!;
    if (used.has(raw[0]) && out.length < BANK[t].length) continue;
    used.add(raw[0]);
    out.push(toQuestion(raw));
  }
  return out;
}

/** Асуултын текстийг хоосон зайгаар хуваана: ['She ', ' to school.'] */
export function splitBlank(text: string): [string, string] {
  const i = text.indexOf('___');
  if (i < 0) return [text, ''];
  return [text.slice(0, i), text.slice(i + 3)];
}

/** Ботын нэг хариултыг урьдчилан шийднэ: хэзээ, зөв эсэх, аль сонголт. */
export function planBotAnswer(profile: BotProfile, q: TugQuestion): { delayMs: number; option: number; correct: boolean } {
  const [min, max] = profile.thinkMs;
  const delayMs = min + Math.random() * (max - min);
  const correct = Math.random() < profile.accuracy;
  if (correct) return { delayMs, option: q.answer, correct: true };
  const wrong = q.options.map((_, i) => i).filter((i) => i !== q.answer);
  return { delayMs, option: wrong[Math.floor(Math.random() * wrong.length)], correct: false };
}

export function formatClock(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

/** Тоглолтын оноо: зөв хариулт × 10 + хожсон бол хүндрэлийн урамшуулал. */
export function tugScore(correct: number, won: boolean, difficulty: Difficulty): number {
  return correct * POINTS_PER_CORRECT + (won ? WIN_BONUS[difficulty] : 0);
}

// ── Локал хадгалалт ──

const BEST_KEY = 'ce.tug-of-war.best';
const PREFS_KEY = 'ce.tug-of-war.prefs';

export type BestRecord = { score: number; wins: number; plays: number };

export function loadBest(): BestRecord {
  if (typeof window === 'undefined') return { score: 0, wins: 0, plays: 0 };
  try {
    const raw = window.localStorage.getItem(BEST_KEY);
    const v = raw ? (JSON.parse(raw) as Partial<BestRecord>) : {};
    return { score: v.score ?? 0, wins: v.wins ?? 0, plays: v.plays ?? 0 };
  } catch {
    return { score: 0, wins: 0, plays: 0 };
  }
}

/** Тоглолт дууссаны дараа бүртгэнэ; шинэ рекорд бол true. */
export function recordBest(score: number, won: boolean): boolean {
  if (typeof window === 'undefined') return false;
  const prev = loadBest();
  const isNew = score > prev.score;
  try {
    window.localStorage.setItem(
      BEST_KEY,
      JSON.stringify({ score: Math.max(prev.score, score), wins: prev.wins + (won ? 1 : 0), plays: prev.plays + 1 }),
    );
  } catch {
    /* ignore */
  }
  return isNew;
}

export type Prefs = { team: Team; difficulty: Difficulty; duration: Duration };

export function loadPrefs(): Prefs {
  const def: Prefs = { team: 'red', difficulty: 'easy', duration: 180 };
  if (typeof window === 'undefined') return def;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    const v = raw ? (JSON.parse(raw) as Partial<Prefs>) : {};
    return {
      team: v.team === 'blue' ? 'blue' : 'red',
      difficulty: (['easy', 'medium', 'hard', 'expert'] as Difficulty[]).includes(v.difficulty as Difficulty) ? (v.difficulty as Difficulty) : 'easy',
      duration: DURATIONS.some((d) => d.value === v.duration) ? (v.duration as Duration) : 180,
    };
  } catch {
    return def;
  }
}

export function savePrefs(p: Prefs): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}
