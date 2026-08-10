const MODULES = [
  { code: '001', title: 'Дүрэм', desc: 'Яг таны түвшинд тохирсон, амьдрал дээр шууд хэрэглэгдэх практик хичээлүүд.' },
  { code: '002', title: 'Унших', desc: 'Цаг үеийн бодит мэдээнүүдийг зөв бүтцээр нь ойлгож, уншиж сурах алхамчилсан дасгал.' },
  { code: '003', title: 'Dictation & Quiz', desc: 'Цээж бичиг хийн чихээ онгойлгох дасгалууд.' },
  { code: '004', title: 'Shadowing', desc: '"Friends" цувралын дүрүүдийн яриаг даган дуурайж дуудлага сайжруулна.' },
  { code: '005', title: 'Ярих', desc: 'AI-тай харилцан ярьж алдаагаа тухай бүртээ засуулна.' },
  { code: '006', title: 'Бичих', desc: 'AI багш мэт бичсэнийг шалгаж, дүрмийн алдааг засаж, дээр хувилбар санал болгоно.' },
  { code: '007', title: 'Sentence Sort', desc: 'Үгсийг зөв дараалалд оруулж, өгүүлбэрийн бүтцийг тоглоомоор эзэмшинэ.' },
  { code: '008', title: 'Үгийн сан', desc: 'Шинэ үгсийг өгүүлбэр, утга санааны уялдаагаар нь ойлгож тогтооно.' },
];

export function PracticeSection() {
  return (
    <section className="border-t border-ink-700/80 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mist-400">Дадлага</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-mist-50">
          Түвшин бүрийн дотор 8 төрлийн дадлага
        </h2>
        <p className="mt-4 max-w-2xl text-mist-300">
          A1-ээс B2 хүртэлх 8 бүлэг хичээлийн нэг бүрд доорх 8 төрлийн дадлага давтагдана.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m) => (
            <div
              key={m.code}
              className="group rounded-2xl border border-ink-700 bg-ink-900 p-5 transition-colors hover:border-brand/40"
            >
              <span className="font-mono text-xs text-mist-500">{m.code}</span>
              <h3 className="mt-2 font-display text-base font-medium text-mist-50">{m.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-mist-400">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
