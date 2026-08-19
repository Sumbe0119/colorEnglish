const PARTS = [
  { label: 'Эзэн', example: 'She', color: 'text-subject', border: 'border-subject/30' },
  { label: 'Үйл үг', example: 'is learning', color: 'text-verb', border: 'border-verb/30' },
  { label: 'Хамаатуулагч', example: 'English', color: 'text-object', border: 'border-object/30' },
  { label: 'Нөхцөл', example: 'every day', color: 'text-modifier', border: 'border-modifier/30' },
];

export function MethodSection() {
  return (
    <section className="bg-ink-900 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mist-400">Арга барил</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-mist-50">
          Дүрмийг цээжлэхээс илүү — ойлгоход чиглэсэн &ldquo;Төвтэй систем&rdquo;
        </h2>
        <p className="mt-4 max-w-2xl text-mist-300">
          Үгийн үүрэг, бүтэц, хэрэглээг өнгөөр ялгаж өгсөн тул өгүүлбэрийг бүхлээр нь ойлгох
          чадвар сууна.
        </p>

        <div className="mt-10 flex flex-wrap gap-3 rounded-2xl border border-ink-700 bg-ink-950 p-6">
          {PARTS.map((p) => (
            <span
              key={p.label}
              className={`rounded-xl border ${p.border} px-4 py-2 font-display text-lg ${p.color}`}
            >
              {p.example}
              <span className="ml-2 align-middle font-mono text-[10px] uppercase tracking-wide text-mist-400">
                {p.label}
              </span>
            </span>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <StatCard value="120" label="нийтлэл" />
          <StatCard value="4,000–6,000" label="үг" />
          <StatCard value="15" label="видео хичээл" />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <InfoCard
            title="Хэрэгжүүлэхэд хялбар"
            body="Өдөр бүр 30–40 минут. 1 унших материал + 2 дагалдах ажил гэсэн бүтэцтэй тул урт хугацаанд тогтвортой сурахад тохиромжтой."
          />
          <InfoCard
            title="Шаталсан ахиц"
            body="Эхний нийтлэлүүд богино, хялбар. Дараагийн шат бүр ахих тусам урт, бүтэц, үгсийн сан нэмэгдэнэ."
          />
          <InfoCard
            title="Контекст дээр сурах"
            body="Тусдаа хүснэгт цээжлүүлэхээс илүү тухайн дүрэм өгүүлбэр дотор яаж ажиллаж байгааг шууд харуулна."
          />
          <InfoCard
            title="Давхар оролт"
            body="Нийтлэлийг сонсох боломжтой. Нэг агуулгыг зөвхөн нүдээр биш, чихээр давхар авах учраас үг тогтоц болон ойлголт хурдан сууна."
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-950 p-6 text-center">
      <p className="font-display text-3xl font-semibold text-brand">{value}</p>
      <p className="mt-1 text-sm text-mist-400">{label}</p>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-950 p-6">
      <h3 className="font-display text-lg font-medium text-mist-50">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-mist-300">{body}</p>
    </div>
  );
}
