const PROBLEMS = [
  {
    title: 'Үг бүрийг мэддэг ч өгүүлбэрээ ойлгодоггүй',
    body: 'Үгийг дангаар нь цээжлэхэд ахиц гардаг ч унших үед утгууд хоорондоо хэрхэн холбогдож байгааг ялгаж харахад хэцүү болдог.',
  },
  {
    title: 'Дүрмээ мэддэг ч хэрэглэж чаддаггүй',
    body: 'Зарим дүрмийг мэддэг ч хэрэглэх үед бодит өгүүлбэр дээрээ гацдаг.',
  },
  {
    title: 'Ахиц гарахгүй байгаа мэт мэдрэмж',
    body: 'Олон арга туршиж, олон цаг зарцуулсан ч сурах системгүй бол мэдлэг тогтож, хэрэглээ болох нь удаан байдаг.',
  },
];

export function ProblemSection() {
  return (
    <section className="border-t border-ink-700/80 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mist-400">Асуудал</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold text-mist-50">
          Суралцах үед түгээмэл тулгардаг саад
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-ink-700 bg-ink-900 p-6">
              <h3 className="font-display text-lg font-medium text-mist-50">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist-300">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
