import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Mic, PenLine, Shuffle, Bot, Headphones, BookMarked, Layers } from 'lucide-react';
import { PublicPricingGrid } from '@/components/billing/public-pricing-grid';

export const metadata: Metadata = {
  title: 'ColorEnglish — Англи хэлийг өнгөөр нь ойлго',
};

const MODULES = [
  { icon: '📖', code: '001', name: 'Дүрэм', desc: 'Яг таны түвшинд тохирсон практик хичээлүүд', c: 'border-subject/20 bg-subject/5 text-subject' },
  { icon: '📰', code: '002', name: 'Унших', desc: 'Бодит мэдээгээр алхамчилсан унших дасгал', c: 'border-verb/20 bg-verb/5 text-verb' },
  { icon: '🎧', code: '003', name: 'Dictation & Quiz', desc: 'Цээж бичиг хийн чихээ онгойлгох дасгал', c: 'border-object/20 bg-object/5 text-object' },
  { icon: '🎙️', code: '004', name: 'Shadowing', desc: '"Friends" цувралаар дуудлага сайжруулах', c: 'border-modifier/20 bg-modifier/5 text-modifier' },
  { icon: '🤖', code: '005', name: 'Ярих', desc: 'AI-тай ярилцаж алдаагаа тухай бүртээ засуул', c: 'border-subject/20 bg-subject/5 text-subject' },
  { icon: '✍️', code: '006', name: 'Бичих', desc: 'AI багшаар бичвэрээ шалгуулж сайжруул', c: 'border-verb/20 bg-verb/5 text-verb' },
  { icon: '🔀', code: '007', name: 'Sentence Sort', desc: 'Тоглоомоор өгүүлбэрийн бүтцийг эзэмш', c: 'border-object/20 bg-object/5 text-object' },
  { icon: '📚', code: '008', name: 'Үгийн сан', desc: 'Контекст дээр суурилсан үгийн сан бүрдүүлэлт', c: 'border-modifier/20 bg-modifier/5 text-modifier' },
];

const FAQ = [
  { q: 'Хэдэн түвшинтэй вэ?', a: 'A1-ээс B2 хүртэл 8 түвшинтэй. Түвшин бүрийг дуусгахын тулд шалгалт өгнө. Алдсан тохиолдолд яагаад алдсаныг нарийн тайлбарлана.' },
  { q: 'AI багш яаж ажилладаг вэ?', a: '"Ярих" модульд AI-тай бодит харилцаа өрнүүлж, алдаагаа тухай бүртээ засуулна. "Бичих" модульд таны бичсэнийг дүн шинжилгээ хийж, хэллэгийн алдаа болон илүү сайн хувилбаруудыг санал болгоно.' },
  { q: 'Shadowing гэж яах вэ?', a: '"Friends" цувралын бодит диалог сонсоод, шууд дуурайн дуудана. Дуудлага болон өргөл нь хурдан сайжрах хамгийн үр дүнтэй аргын нэг.' },
  { q: 'Өдөрт хэр их цаг зарцуулах вэ?', a: 'Өдөрт 30–40 минут хангалттай. Тогтвортой байх нь нэг удаа урт цаг зарцуулахаас илүү чухал.' },
  { q: 'Нэвтрэхгүйгээр туршиж болох уу?', a: 'Бүртгэл үүсгэсний дараа A1 түвшин үнэгүй боломжтой. Кредит карт шаардахгүй.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-ink-700 bg-ink-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-ink-950 font-display font-bold text-sm">C</span>
            <span className="font-display text-lg font-semibold text-mist-50">Color<span className="text-brand">English</span></span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {[['#method','Арга барил'],['#practice','Дадлага'],['#pricing','Үнэ'],['#faq','FAQ']].map(([href,label]) => (
              <a key={href} href={href} className="text-sm text-mist-300 hover:text-mist-50 transition-colors">{label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-mist-300 hover:text-mist-50 transition-colors">Нэвтрэх</Link>
            <Link href="/register" className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-ink-950 hover:bg-brand-hover transition-colors">
              Эхлэх <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand/8 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-medium text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
            Reading MVP · үг дээр дарж орчуулга + voice
          </p>
          <h1 className="mb-6 font-display text-5xl font-semibold leading-tight text-mist-50 md:text-6xl">
            Жижиг <span className="text-verb">өгүүллэг</span> уншиж,{' '}
            <em>үг бүрийг</em> ойлго
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-base text-mist-300">
            Англи өгүүллэг уншихад үг дээр дарж монгол орчуулга хараад, voice-оор зөв дуудлагыг сонсоорой.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-ink-950 hover:bg-brand-hover transition-colors">
              Үнэгүй эхлэх <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#practice" className="inline-flex items-center gap-2 rounded-xl border border-ink-600 bg-ink-800 px-6 py-3.5 text-sm font-medium text-mist-200 hover:bg-ink-700 transition-colors">
              Хэрхэн ажилладаг вэ?
            </Link>
          </div>
          <div className="mx-auto mt-16 max-w-lg rounded-2xl border border-ink-700 bg-ink-800/60 p-6 text-left backdrop-blur">
            <p className="mb-2 text-xs uppercase tracking-widest text-mist-500">Жишээ өгүүлбэр</p>
            <p className="font-display text-xl leading-relaxed">
              <span className="text-subject">She</span>{' '}
              <span className="text-verb">has been studying</span>{' '}
              <span className="text-object">English</span>{' '}
              <span className="text-modifier">for three years.</span>
            </p>
            <div className="mt-3 flex gap-4 text-xs text-mist-400">
              <span><span className="text-subject">■</span> Эзэн</span>
              <span><span className="text-verb">■</span> Үйл үг</span>
              <span><span className="text-object">■</span> Хамаатуулагч</span>
              <span><span className="text-modifier">■</span> Нөхцөл</span>
            </div>
          </div>
        </div>
      </section>

      {/* Method */}
      <section id="method" className="border-t border-ink-700 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-brand">Арга барил</p>
          <h2 className="mb-4 font-display text-3xl font-semibold text-mist-50">Яагаад ердийн аргаар бүтдэггүй вэ?</h2>
          <p className="mb-16 max-w-xl text-mist-300">Үг дангаараа цээжлэх, дүрэм жагсаалт тогтоох — энэ хоёр бол хамгийн их алдаа гардаг арга. Бид ойлголт дээр суурилна.</p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { n: '01', title: 'Өнгөт дүрслэл', body: 'Өгүүлбэрийн гишүүд бүрийг тусгай өнгөөр тодотгоно — тархи хэлбэр таниж, ойлголт хурдан суурьддаг.' },
              { n: '02', title: 'Контекст дотор', body: 'Дүрэм жагсаалтаас биш, бодит өгүүлбэр, мэдээний нийтлэл, диалог дотор суурьдана.' },
              { n: '03', title: 'Давхар оролт', body: 'Унших + сонсох хосолсон арга — нэг агуулгыг нүд болон чихний хоёуланг нь ашиглан хурдан тогтооно.' },
            ].map((c) => (
              <div key={c.n} className="rounded-2xl border border-ink-700 bg-ink-800 p-6">
                <p className="mb-4 font-mono text-xs text-brand">{c.n}</p>
                <h3 className="mb-2 font-display text-lg font-semibold text-mist-50">{c.title}</h3>
                <p className="text-sm text-mist-300">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice */}
      <section id="practice" className="border-t border-ink-700 bg-ink-900 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-brand">Дадлага</p>
          <h2 className="mb-4 font-display text-3xl font-semibold text-mist-50">Өдөр бүрийн найман хэлбэр</h2>
          <p className="mb-16 max-w-xl text-mist-300">Түвшин бүрт 8 модуль хичээл бий — дүрэм, унших, dictation, shadowing, AI яриа, бичих, тоглоом, үгийн сан.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m) => (
              <div key={m.code} className={`rounded-xl border p-5 ${m.c}`}>
                <div className="mb-3 text-2xl">{m.icon}</div>
                <p className="mb-1 font-mono text-xs opacity-60">{m.code}</p>
                <h3 className="mb-2 font-display text-base font-semibold">{m.name}</h3>
                <p className="text-xs opacity-70">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — admin-ийн идэвхтэй багц (/subscriptions/plans) */}
      <section id="pricing" className="border-t border-ink-700 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-brand">Үнэ</p>
          <h2 className="mb-4 font-display text-3xl font-semibold text-mist-50">Эхлээд үнэгүй, дараа нь шийд</h2>
          <p className="mb-16 max-w-xl text-mist-300">
            Эхний өгүүллэгүүд үнэгүй. VIP багцыг доороос сонгоорой.
          </p>
          <PublicPricingGrid ctaHref="/register" ctaLabel="Бүртгүүлэх" highlightIndex={1} />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-ink-700 bg-ink-900 px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-brand">Асуулт хариулт</p>
          <h2 className="mb-16 font-display text-3xl font-semibold text-mist-50">Түгээмэл эргэлзээ</h2>
          <div className="space-y-4">
            {FAQ.map((f, i) => (
              <div key={i} className="rounded-xl border border-ink-700 bg-ink-800 p-6">
                <h3 className="mb-3 font-display text-base font-semibold text-mist-50">{f.q}</h3>
                <p className="text-sm text-mist-300">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-ink-700 px-6 py-20 text-center">
        <h2 className="mb-4 font-display text-3xl font-semibold text-mist-50">Өнөөдөр эхэл</h2>
        <p className="mb-8 text-mist-300">A1 түвшин үнэгүй. Бүртгүүлэхэд 30 секунд л хангалттай.</p>
        <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-4 text-base font-semibold text-ink-950 hover:bg-brand-hover transition-colors">
          Үнэгүй эхлэх <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <footer className="border-t border-ink-700 px-6 py-8 text-center text-xs text-mist-500">
        © 2025 ColorEnglish. Монголд хийгдсэн 🇲🇳
      </footer>
    </div>
  );
}
