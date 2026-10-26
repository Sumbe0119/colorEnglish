import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Mic, PenLine, Shuffle, Bot, Headphones, BookMarked, Layers, ClipboardCheck, GraduationCap } from "lucide-react";
import { PublicPricingGrid } from "@/components/billing/public-pricing-grid";
import { LazyEnglishSection } from "@/components/home/lazy-english-section";
import { DailyPriceHighlight } from "@/components/home/daily-price-highlight";
import { LearningStyleSection } from "@/components/home/learning-style-section";
import { LearningStyleStickyBar } from "@/components/home/learning-style-sticky-bar";
import { PlacementTestSection } from "@/components/home/placement-test-section";
import { FaqSection, type FaqItem } from "@/components/home/faq-section";

export const metadata: Metadata = {
  title: "ColorEnglish — Англи хэлийг өнгөөр нь ойлго",
};
const FAQ: FaqItem[] = [
  {
    q: "Хэлний түвшин хамаатай юу?",
    a: "А1-B2 түвшний хооронд суралцагчдад зориулагдсан. Өмнө нь Англи хэл сураагүй ч асуудалгүй. C1 болон түүнээс дээш түвшний мундагуудад маани бол арай л тохиромжгүй.",
  },
  {
    q: "Өөрийн түвшингээ хэрхэн мэдэх вэ?",
    a: "Бүртгүүлэлгүй, нэвтрэлгүй 40 асуулттай түвшин тогтоох тест өгч болно. Дүрэм, үгийн сан, унших даалгавар A1-ээс C1 хүртэл шатлан хэцүүсдэг, 15 орчим минут зарцуулна. Тестээ дуусгасны дараа үр дүнг (түвшин, чадвар тус бүрийн задаргаа, асуулт бүрийн тайлбар, суралцах зөвлөмж) 5,000₮-өөр QPay-ээр төлж нээнэ.",
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
  {
    q: "Дүрмийн хичээл ордог уу?",
    a: "А1-B2 түвшний бүх дүрэм, дасгал ажил, шалгалтыг багтаасан Grammer хичээлүүд орсон.",
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
              ["/placement-test", "Түвшин тогтоох"],
              ["#pricing", "Үнэ"],
              ["#learning-style", "Суралцах аргаа тодорхойлох"],
              ["#faq", "FAQ"],
            ].map(([href, label]) =>
              href.startsWith("#") ? (
                <a key={href} href={href} className="text-sm text-mist-300 hover:text-mist-50 transition-colors">
                  {label}
                </a>
              ) : (
                <Link key={href} href={href} className="text-sm text-mist-300 hover:text-mist-50 transition-colors">
                  {label}
                </Link>
              ),
            )}
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
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/placement-test"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-hover"
            >
              <ClipboardCheck className="h-4 w-4" /> Түвшингээ 15 минутад тогтоох
            </Link>
            <p className="text-xs text-mist-500">Нэвтрэх шаардлагагүй · 40 асуулт · үр дүн 5,000₮</p>
          </div>
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

      {/* Түвшин тогтоох тест — нэвтрэхгүй өгч, үр дүнг QPay-ээр нээнэ */}
      <PlacementTestSection />

      {/* Суралцах арга барил тодорхойлох + графиктай жишээ */}
      <LearningStyleSection />

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
      <FaqSection id="faq" items={FAQ} />

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
      {/* Footer — багшаар CV илгээх (/teacher-cv, нэвтрэхгүй) + холбоосууд */}
      <footer className="border-t border-ink-700 px-6 pb-28 pt-12 sm:pb-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <Link
            href="/teacher-cv"
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-brand/40 px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/10"
          >
            Багшаар CV илгээх <ArrowRight className="h-4 w-4" />
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-mist-400">
            <Link href="#method" className="transition-colors hover:text-mist-50">Арга барил</Link>
            <Link href="/placement-test" className="transition-colors hover:text-mist-50">Түвшин тогтоох</Link>
            <Link href="#pricing" className="transition-colors hover:text-mist-50">Үнэ</Link>
            <Link href="#faq" className="transition-colors hover:text-mist-50">Асуулт хариулт</Link>
            <Link href="/teacher-cv" className="transition-colors hover:text-mist-50">Багшаар CV илгээх</Link>
          </nav>
        </div>
        <p className="mt-10 text-center text-xs text-mist-500">© 2026 ColorEnglish.🇲🇳</p>
      </footer>
      <LearningStyleStickyBar />
    </div>
  );
}
