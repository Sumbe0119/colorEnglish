// frontend/src/lib/grammar/b1/rule-11.ts
// B1 дүрэм 11: Gerunds & infinitives
// Агуулгыг гараар засаж болно. `en` талбарын markup: [текст](s|v|o|m) — s эзэн, v үйл үг, o тусагдахуун, m нөхцөл.
import type { GrammarRule } from '../types';

export const b1Rule11: GrammarRule = {
  id: 11,
  title: 'Gerunds & infinitives',
  titleMn: 'Verb-ing ба to + Verb — үйл үгийн ард ямар хэлбэр орох вэ',
  hook: '«I enjoy swimming» гэхдээ «I want to swim» — яагаад нэг нь -ing, нөгөө нь to вэ? Үйл үг бүр ардаа ямар хэлбэр авдгийг сурцгаая.',
  summary: 'Хоёр үйл үг дараалан ирэхэд хоёр дахь нь Verb-ing (gerund) эсвэл to + Verb1 (infinitive) хэлбэртэй байна. Аль нь болохыг эхний үйл үг шийднэ: enjoy, finish, mind + V-ing; want, decide, hope + to V1. Зарим үйл үг (stop, remember, try) хоёуланг нь авах ч утга өөрчлөгдөнө.',
  description: 'A1-A2-д бид like + V-ing (I like swimming), want + to V1 (I want to go) зэрэг хэллэгүүдийг тус тусад нь цээжилж ирсэн. Одоо үүнийг систем болгоно. Англи хэлэнд хоёр үйл үг дараалан ирэхэд хоёр дахь үйл үг үндсэн хэлбэрээрээ орж чадахгүй — заавал V-ing эсвэл to V1 хэлбэрт орно. Аль хэлбэр орохыг ЭХНИЙ үйл үг тогтоодог бөгөөд үүнийг логикоор гаргах боломж бага, цээжлэх хэрэгтэй. V-ing авдаг үйл үгс: enjoy, finish, mind, avoid, suggest, keep, practise, give up, can\'t stand. to V1 авдаг үйл үгс: want, decide, hope, plan, need, promise, learn, agree, refuse, would like. Мөн угтвар үгийн ард үргэлж V-ing (interested in learning, good at cooking), тэмдэг нэрийн ард ихэвчлэн to V1 (happy to help, difficult to understand). Зарим үйл үг хоёуланг нь авах ч утга өөр: stop smoking (тамхинаас гарах) — stop to smoke (тамхи татахаар зогсох); remember locking (цоожилснаа санах) — remember to lock (цоожлохоо мартахгүй байх). Монгол хэлэнд «-хыг», «-хаар», «-ж/-ч» гэсэн олон холбох залгавар байдаг ч англи хэлний V-ing / to V1 сонголттой шууд таардаггүй тул үйл үг бүрийг «ямар хэлбэртэй хамт явдаг вэ» гэж хамт цээжилнэ.',
  structure: 'Verb 1 + Verb-ing (enjoy doing) · Verb 1 + to + Verb1 (want to do) · preposition + Verb-ing',
  structureParts: [
    { text: 'Subject', part: 'subject' },
    { text: 'enjoy / want', part: 'verb' },
    { text: 'doing / to do', part: 'object' },
    { text: '· preposition + V-ing', part: 'modifier' },
  ],
  tip: 'V-ing: enjoy, finish, mind, avoid, keep, suggest, угтвар үгийн ард. to V1: want, decide, hope, plan, need, promise, learn. Хоёулаа боловч утга өөр: stop, remember, forget, try.',
  examples: [
    { en: '[I](s) [enjoy](v) [reading](o) [before bed](m).', mn: 'Би унтахын өмнө ном унших дуртай.' },
    { en: '[She](s) [decided](v) [to study](o) [abroad](m).', mn: 'Тэр гадаадад суралцахаар шийдсэн.' },
    { en: '[He](s) [is interested in](v) [learning](o) [Chinese](o).', mn: 'Тэр хятад хэл сурах сонирхолтой.' },
    { en: '[I](s) [stopped](v) [smoking](o) [two years ago](m).', mn: 'Би хоёр жилийн өмнө тамхинаас гарсан.' },
  ],
  useCases: [
    {
      title: 'Verb-ing авдаг үйл үгс',
      description: 'enjoy, finish, mind, avoid, suggest, keep (on), practise, give up, can\'t stand, can\'t help, imagine, consider, miss, deny, admit. Эдгээрийн ард үргэлж V-ing. Цээжлэх л хэрэгтэй.',
      examples: [
        { en: '[Have](v) [you](s) [finished](v) [writing](o) [the report](o)?', mn: 'Чи тайлан бичиж дууссан уу?' },
        { en: '[Would](v) [you](s) [mind](v) [opening](o) [the window](o)?', mn: 'Цонх нээж өгөхөд тань таагүй байх уу? (Цонх нээж өгнө үү?)' },
        { en: '[He](s) [keeps](v) [making](o) [the same mistake](o).', mn: 'Тэр нэг л алдааг дахин дахин гаргасаар байна.' },
      ],
    },
    {
      title: 'to + Verb1 авдаг үйл үгс',
      description: 'want, decide, hope, plan, need, promise, learn, agree, refuse, offer, expect, manage, afford, would like, seem, forget (ирээдүйн). Эдгээрийн ард үргэлж to V1.',
      examples: [
        { en: '[We](s) [hope](v) [to visit](o) [Japan](o) [next year](m).', mn: 'Бид ирэх жил Японд очихоор найдаж байна.' },
        { en: '[She](s) [promised](v) [to call](o) [me](o) [tonight](m).', mn: 'Тэр өнөө орой над руу залгана гэж амласан.' },
        { en: '[I](s) [can\'t afford](v) [to buy](o) [a new car](o).', mn: 'Би шинэ машин авах мөнгөгүй. (санхүүгийн боломжгүй)' },
      ],
    },
    {
      title: 'Угтвар үгийн ард үргэлж Verb-ing',
      description: 'in, at, of, for, about, without, after, before зэрэг угтвар үгийн ард үйл үг орох бол заавал V-ing. Ялангуяа тэмдэг нэр + угтвар үг (good at, interested in, afraid of) хослолуудад.',
      examples: [
        { en: '[She](s)[\'s good at](v) [solving](o) [problems](o).', mn: 'Тэр асуудал шийдвэрлэхдээ сайн.' },
        { en: '[He](s) [left](v) [without saying](m) [goodbye](o).', mn: 'Тэр баяртай гэж хэлэлгүй явсан.' },
        { en: '[Thank you](v) [for helping](m) [me](o).', mn: 'Надад тусалсанд баярлалаа.' },
      ],
    },
    {
      title: 'Хоёуланг нь авах ч утга өөрчлөгддөг үйл үгс',
      description: 'stop, remember, forget, try, regret. V-ing нь ихэвчлэн өмнө болсон / үйл явцын тухай, to V1 нь дараа болох / зорилгын тухай. Утгын ялгааг сайн ойлгох хэрэгтэй.',
      examples: [
        { en: '[I](s) [stopped](v) [smoking](o). / [I](s) [stopped](v) [to smoke](m).', mn: 'Би тамхинаас гарсан. / Би тамхи татахаар зогссон.' },
        { en: '[I](s) [remember](v) [locking](o) [the door](o). / [Remember](v) [to lock](o) [the door](o)!', mn: 'Би хаалгаа цоожилснаа санаж байна. / Хаалгаа цоожлохоо бүү мартаарай!' },
        { en: '[Try](v) [restarting](o) [the computer](o). / [I](s) [tried](v) [to open](o) [the door](o), [but](m) [it](s) [was](v) [locked](o).', mn: 'Компьютерээ дахин асаагаад үзээрэй. / Би хаалгыг онгойлгохыг оролдсон, гэхдээ цоожтой байсан.' },
      ],
    },
    {
      title: 'Хоёуланг нь авч, утга бараг адил үйл үгс',
      description: 'like, love, hate, prefer, start, begin, continue — V-ing ч, to V1 ч болно, утга бараг өөрчлөгдөхгүй. Гэхдээ would like / would love / would prefer-ийн ард үргэлж to V1.',
      examples: [
        { en: '[I](s) [love](v) [cooking](o). = [I](s) [love](v) [to cook](o).', mn: 'Би хоол хийх дуртай.' },
        { en: '[It](s) [started](v) [raining](o). = [It](s) [started](v) [to rain](o).', mn: 'Бороо орж эхэлсэн.' },
        { en: '[I](s)[\'d like](v) [to order](o) [a coffee](o). (would like + to V1 үргэлж)', mn: 'Би кофе захиалмаар байна.' },
      ],
    },
  ],
  forms: [
    {
      label: 'Verb + V-ing',
      structure: 'enjoy / finish / mind / avoid / keep / suggest / practise / give up + V-ing',
      examples: [
        { en: '[I](s) [avoid](v) [eating](o) [late at night](m).', mn: 'Би шөнө оройтож хооллохоос зайлсхийдэг.' },
        { en: '[She](s) [suggested](v) [going](o) [to the cinema](m).', mn: 'Тэр кинотеатрт очихыг санал болгосон.' },
        { en: '[He](s) [gave up](v) [playing](o) [football](o) [after the injury](m).', mn: 'Тэр бэртлийн дараа хөл бөмбөг тоглохоо больсон.' },
      ],
    },
    {
      label: 'Verb + to V1',
      structure: 'want / decide / hope / plan / need / promise / learn / agree / refuse / manage + to V1',
      examples: [
        { en: '[They](s) [agreed](v) [to help](o) [us](o).', mn: 'Тэд бидэнд туслахаар зөвшөөрсөн.' },
        { en: '[He](s) [refused](v) [to answer](o) [the question](o).', mn: 'Тэр асуултад хариулахаас татгалзсан.' },
        { en: '[We](s) [managed](v) [to finish](o) [on time](m).', mn: 'Бид цагтаа дуусгаж чадсан.' },
      ],
    },
    {
      label: 'Verb + object + to V1',
      structure: 'want / ask / tell / advise / allow / remind + person + to V1',
      examples: [
        { en: '[She](s) [wants](v) [me](o) [to help](o) [her](o).', mn: 'Тэр намайг өөрт нь туслахыг хүсэж байна.' },
        { en: '[The doctor](s) [advised](v) [him](o) [to rest](o).', mn: 'Эмч түүнд амрахыг зөвлөсөн.' },
        { en: '[My parents](s) [don\'t allow](v) [me](o) [to stay out](o) [late](m).', mn: 'Эцэг эх минь намайг орой хүртэл гадуур байхыг зөвшөөрдөггүй.' },
      ],
    },
    {
      label: 'Угтвар үг / тэмдэг нэрийн ард',
      structure: 'preposition + V-ing · adjective + to V1 · V-ing эзний байранд',
      examples: [
        { en: '[I](s)[\'m looking forward to](v) [seeing](o) [you](o).', mn: 'Би чамтай уулзахыг тэсэн ядан хүлээж байна.' },
        { en: '[It](s)[\'s](v) [difficult](o) [to learn](m) [a new language](o).', mn: 'Шинэ хэл сурах хэцүү.' },
        { en: '[Swimming](s) [is](v) [good](o) [for your health](m).', mn: 'Усанд сэлэх нь эрүүл мэндэд сайн.' },
      ],
    },
  ],
  signalWords: ['enjoy', 'finish', 'mind', 'avoid', 'want', 'decide', 'hope', 'promise', 'stop', 'remember', 'forget', 'try', 'look forward to'],
  notes: [
    'look forward to-гийн to нь угтвар үг тул ард нь V-ing: I look forward to hearing from you (to hear биш). Мөн be used to + V-ing (B1-ийн 3-р дүрэм).',
    'Модаль үгийн ард (can, must, should, will) to-гүй V1: I can swim (to swim биш). Мөн let, make + хүн + V1: Let me go. She made me cry.',
    'Үйл үг эзний байранд орвол V-ing: Smoking is bad for you. to V1-ээр эхлэх нь албан ёсны, ховор.',
    'Зорилго заахдаа to V1: I went to the shop to buy milk (сүү авахаар). for buying гэж хэлэхгүй.',
    'forget + to V1 = хийхээ мартах (I forgot to call — залгахаа мартсан), forget + V-ing = хийснээ мартах (I\'ll never forget meeting her — түүнтэй уулзсанаа мартахгүй).',
    'regret + to V1 = харамсаж мэдэгдэх (We regret to inform you …), regret + V-ing = хийснээ харамсах (I regret buying that car).',
  ],
  commonMistakes: [
    {
      wrong: 'I enjoy to play football.',
      correct: 'I enjoy playing football.',
      explanation: 'enjoy-ийн ард үргэлж V-ing. Монголоор «тоглох дуртай» гэж «-х» хэлбэр байдаг тул to V1 сонгох алдаа гардаг, гэхдээ enjoy бол V-ing үйл үг.',
    },
    {
      wrong: 'She decided going to university.',
      correct: 'She decided to go to university.',
      explanation: 'decide-ийн ард үргэлж to V1. Шийдвэр нь ирээдүйн үйлдэл рүү чиглэдэг үйл үгс (decide, plan, hope, want) ихэвчлэн to V1 авдаг.',
    },
    {
      wrong: 'I\'m looking forward to see you.',
      correct: 'I\'m looking forward to seeing you.',
      explanation: 'Энд to нь угтвар үг (look forward to = тэсэн ядан хүлээх), тэгэхээр ард нь V-ing. Ихэнх хүн to хараад V1 тавьдаг — энэ бол сонгодог алдаа.',
    },
    {
      wrong: 'Don\'t forget locking the door when you leave.',
      correct: 'Don\'t forget to lock the door when you leave.',
      explanation: 'Ирээдүйд хийх ёстой зүйлийг мартахгүй байх — forget + to V1. forget + V-ing бол өнгөрсөнд хийснээ мартах.',
    },
  ],
  mongolianContrast: {
    title: 'Монгол хэлтэй харьцуулбал',
    points: [
      'Монголоор хоёр үйл үгийг «-хыг» (сурахыг хүсэх), «-хаар» (явахаар шийдэх), «-ж/-ч» (уншиж дуусах), «-х» (тоглох дуртай) гэж олон залгавараар холбодог. Эдгээр нь англи V-ing / to V1-тэй нэг нэгээрээ таардаггүй тул монголоос орчуулж болохгүй, англи үйл үгээ цээжлэх хэрэгтэй.',
      'Монголоор «-ж дуусах» (бичиж дуусах) гэдэг нь finish + V-ing-тэй төстэй, «-хаар шийдэх» нь decide + to V1-тэй төстэй. Иймэрхүү зарим зүй тогтол байгаа ч найдвартай биш.',
      'Монголоор «тамхинаас гарах» ба «тамхи татахаар зогсох» хоёр тодорхой өөр хэллэг. Англиар stop smoking / stop to smoke гэсэн ялгаа нь зөвхөн V-ing / to V1-д байдаг тул илүү анхаарал хэрэгтэй.',
      'Монголоор «цоожилснаа санах» (өнгөрсөн) ба «цоожлохоо санах» (ирээдүй) гэж «-снаа» / «-хоо» гэж ялгадаг нь remember + V-ing / remember + to V1-тэй яг таардаг. Энэ тохиолдолд монгол хэл тусална.',
    ],
  },
  dialogue: [
    {
      en: 'Saraa, [have](v) [you](s) [finished](v) [preparing](o) [for the presentation](m)?',
      mn: 'Сараа, чи илтгэлдээ бэлдэж дууссан уу?',
      speaker: 'Bat',
    },
    {
      en: 'Almost. [I](s) [keep](v) [forgetting](o) [to add the charts](o). [I](s) [need](v) [to do](o) [that](o) [tonight](m).',
      mn: 'Бараг. Би графикуудаа нэмэхээ мартсаар л байна. Өнөө орой хийх хэрэгтэй.',
      speaker: 'Saraa',
    },
    {
      en: '[Would](v) [you](s) [like](v) [me](o) [to help](o)? [I](s) [enjoy](v) [making](o) [charts](o).',
      mn: 'Би туслах уу? Би график хийх дуртай.',
      speaker: 'Bat',
    },
    {
      en: 'Really? [I](s) [can\'t stand](v) [doing](o) [them](o). [Thanks](v) [for offering](m)!',
      mn: 'Нээрээ юу? Би тэднийг хийхийг тэвчдэггүй. Санал болгосонд баярлалаа!',
      speaker: 'Saraa',
    },
    {
      en: 'No problem. [But](m) [remember](v) [to practise](o) [speaking](o) [slowly](m).',
      mn: 'Зүгээр. Гэхдээ удаан ярих дадлага хийхээ бүү мартаарай.',
      speaker: 'Bat',
    },
    {
      en: 'I know. [I](s) [tried](v) [to speak](o) [slowly](m) [last time](m), [but](m) [I](s) [was](v) [too nervous](o). [I](s)[\'ll try](v) [recording](o) [myself](o) [this time](m).',
      mn: 'Мэдэж байна. Өнгөрсөн удаа удаан ярихыг оролдсон ч хэтэрхий сандарсан. Энэ удаа өөрийгөө бичээд үзье.',
      speaker: 'Saraa',
    },
  ],
  quiz: [
    {
      id: 'b1-11-1',
      ruleId: 11,
      kind: 'fill',
      question: 'I really enjoy ___ to music while I work.',
      options: ['listen', 'to listen', 'listening', 'listened'],
      answer: 'listening',
      explanation: 'enjoy-ийн ард үргэлж V-ing. to listen буруу, listen дангаараа хоёр үйл үг дараалахад болохгүй.',
      hint: 'enjoy + ?',
    },
    {
      id: 'b1-11-2',
      ruleId: 11,
      kind: 'fill',
      question: 'She decided ___ a new job.',
      options: ['looking for', 'to look for', 'look for', 'for looking'],
      answer: 'to look for',
      explanation: 'decide-ийн ард үргэлж to V1. Ирээдүйн үйлдэл рүү чиглэсэн шийдвэр.',
      hint: 'decide + ?',
    },
    {
      id: 'b1-11-3',
      ruleId: 11,
      kind: 'correct',
      question: 'Аль өгүүлбэр зөв бэ?',
      options: [
        'I\'m looking forward to see you soon.',
        'He stopped to smoke last year and feels much better.',
        'Would you mind closing the door?',
        'They want that I help them.',
      ],
      answer: 'Would you mind closing the door?',
      explanation: 'mind + V-ing зөв. look forward to + V-ing (seeing); «тамхинаас гарсан» бол stopped smoking; want + хүн + to V1 (want me to help).',
      hint: 'mind-ийн ард V-ing.',
    },
    {
      id: 'b1-11-4',
      ruleId: 11,
      kind: 'translate',
      question: 'Хаалгаа цоожлохоо бүү мартаарай.',
      options: [
        'Don\'t forget to lock the door.',
        'Don\'t forget locking the door.',
        'Don\'t forget lock the door.',
        'Don\'t forget for locking the door.',
      ],
      answer: 'Don\'t forget to lock the door.',
      explanation: '«Цоожлохоо» — ирээдүйд хийх ёстой үйлдэл, тэгэхээр forget + to V1. forget locking гэвэл «цоожилснаа мартах» болно.',
      hint: '«-хоо» = ирээдүйн үйлдэл = to V1.',
    },
  ],
};
