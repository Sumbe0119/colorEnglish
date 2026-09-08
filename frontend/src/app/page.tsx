import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Mic, PenLine, Shuffle, Bot, Headphones, BookMarked, Layers } from "lucide-react";
import { PublicPricingGrid } from "@/components/billing/public-pricing-grid";
import { LazyEnglishSection } from "@/components/home/lazy-english-section";
import { DailyPriceHighlight } from "@/components/home/daily-price-highlight";

export const metadata: Metadata = {
  title: "ColorEnglish — Англи хэлийг өнгөөр нь ойлго",
};
const FAQ = [
  {
    q: "Хэлний түвшин хамаатай юу?",
    a: "А1-B2 түвшний хооронд суралцагчдад зориулагдсан. Өмнө нь Англи хэл сураагүй ч асуудалгүй. C1 болон түүнээс дээш түвшний мундагуудад маани бол арай л тохиромжгүй.",
  },
  {
    q: "Өдөрт хэдэн минут зарцуулах вэ?",
    a: "Хэдэн ч минут байсан болно та туртай үедээ дуртай цагтаа үзэх боломжтой. Хамгийн багадаа 10минут байхад л болоод явчихна.",
  },
  {
    q: "Live хичээлүүд ордог уу?",
    a: "Одоогоор тийм боломж байхгүй. Бидний зорилго бол таныг өөрийнхөө цагт, өөрийнхөө хурдаар суралцахад туслах явдал юм.",
  },
  {
    q: "Сургалтын хөтөлбөрт юу багтаж байгаа вэ",
    a: "Spider Man, Prietas of the Careibbean, Jumanji, Alice in Wonderland гэх мэт Англи хэлний сонирхолтой өгүүллэг ном зохиолуудыг уншиж дадлага хийж хэлний бүтцээ ойлгох сонсох, унших чадваруудыг хөгжүүлхийн зэрэгцээ үгийн сангаа хөгжилтэй байдлаар нэмэх тоглоомнууд багтсан.",
  },
  {
    q: "Анги дүүргэлт байгаа юу?",
    a: "Onile Class биш учир анги дүүргэлт гэж байхгүй дуртай үедээ бүртгүүлж дуртай үедээ хичээлээ үзэх боломжтой.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-ink-700 bg-ink-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="relative block h-9 w-[160px]">
            <Image src="/logo/logo.png" alt="Color English" fill className="object-contain object-left" priority />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {[
              ["#method", "Арга барил"],
              ["#pricing", "Үнэ"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="text-sm text-mist-300 hover:text-mist-50 transition-colors">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-mist-300 hover:text-mist-50 transition-colors">
              Нэвтрэх
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-ink-950 hover:bg-brand-hover transition-colors"
            >
              Бүртгүүлэх <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand/8 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-medium text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
            Reading · үг дээр дарж орчуулга харах + voice
          </p>
          <h1 className="mb-6 font-display text-5xl font-semibold leading-tight text-mist-50 md:text-6xl">
            Сонирхолтой <span className="text-verb">өгүүллэгүүд</span> уншиж, <em>өгүүлбэрийн бүтцийг</em> ойлгоно
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-base text-mist-300">Хэн ч Англи хэлийг ТӨГС ЭЗЭМШИЖ ЧАДНА</p>
          <div className="mx-auto mt-16 max-w-lg rounded-2xl border border-ink-700 bg-ink-800/60 p-6 text-left backdrop-blur">
            <p className="mb-2 text-xs uppercase tracking-widest text-mist-500">Жишээ өгүүлбэр</p>
            <p className="font-display text-xl leading-relaxed">
              <span className="text-subject">She</span> <span className="text-verb">has been studying</span>{" "}
              <span className="text-object">English</span> <span className="text-modifier">for three years.</span>
            </p>
            <div className="mt-3 flex gap-4 text-xs text-mist-400">
              <span>
                <span className="text-subject">■</span> Эзэн
              </span>
              <span>
                <span className="text-verb">■</span> Үйл үг
              </span>
              <span>
                <span className="text-object">■</span> Хамаатуулагч
              </span>
              <span>
                <span className="text-modifier">■</span> Нөхцөл
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* Залхуу Англи хэл — Read / Listen / Speak / Write */}
      <LazyEnglishSection />

      {/* Method */}
      <section id="method" className="border-t border-ink-700 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-brand">Арга барил</p>
          <h2 className="mb-4 font-display text-3xl font-semibold text-mist-50">Дүрэм цээжлэхгүй өгүүлбэрийн бүтцийг ойлгоно</h2>
          <p className="mb-16 max-w-xl text-mist-300">Цээжилсэн сүрдэм үгс биш, тодорхой санаа л амжилт авчирна</p>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                n: "01",
                title: "Унших + Cонсох дасгал",
                body: "Англи хэлээр тогтмол уншиж, сонсох нь тархи тухайн үг, авиа зүй, өгүүлбэрийн бүтцийг аяндаа таньж, ойлгох чадамжийг таний далд ухамсарт суулгадаг.",
              },
              {
                n: "02",
                title: "Бататгах тоглоом dirve + quiz",
                body: "Байнга дүрэм нүдэж танийг залхаагүйгээр тоглоом тоглонгоо л шинэ үг цээжилдэг бол гоё уу ?",
              },
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

      {/* Pricing — admin-ийн идэвхтэй багц (/subscriptions/plans) */}
      <section id="pricing" className="border-t border-ink-700 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-brand">Үнэ</p>
          <h2 className="mb-4 font-display text-3xl font-semibold text-mist-50">Аяга сүүтэй цайны мөнгөөр сурах боломж</h2>
          <DailyPriceHighlight />
          <PublicPricingGrid ctaHref="/register" ctaLabel="Бүртгүүлэх" highlightIndex={1} />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-ink-700 bg-ink-900 px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-brand">Асуулт хариулт</p>
          <h2 className="mb-16 font-display text-3xl font-semibold text-mist-50">Түгээмэл асуулт</h2>
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
        <p className="mb-8 text-mist-300">Өдөр бүр 10 минутыг зарцуулж чадвал сарын дараа та өөртөө ч итгэхгүй үр дүн гарна шүү.</p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-4 text-base font-semibold text-ink-950 hover:bg-brand-hover transition-colors"
        >
          Яг одоо эхэл <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
      <footer className="border-t border-ink-700 px-6 py-8 text-center text-xs text-mist-500">© 2026 ColorEnglish.🇲🇳</footer>
    </div>
  );
}
