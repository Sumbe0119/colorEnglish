"use client";

import { motion } from "framer-motion";
import { useState, useSyncExternalStore } from "react";
import {
  calculateEnrollmentProgress,
  formatDisplayDate,
  formatIntakeMonth,
  getEnrollmentConfigServerSnapshot,
  getEnrollmentConfigSnapshot,
  subscribeEnrollmentConfig,
} from "@/lib/enrollment";

const courseTopics = [
  "Grammar & Vocabulary Fundamentals",
  "Speaking Club + Weekly Feedback",
  "IELTS/TOEFL Preparation Strategies",
  "1:1 Coaching + Progress Tracking",
];

const pricingPlans = [
  {
    name: "Basic",
    price: "319,000₮",
    features: [
      "180 + нийтлэл",
      "Өнгөцлсөн орчуулга",
      "Дүрмийн тайлбар",
      "Аудио сонсох",
    ],
    accent: "zinc",
  },
  {
    name: "Hero",
    price: "349,000₮",
    features: [
      "Бүх Basic эрхүүд +",
      "'Friends' кино орчуулгатай",
      "Академик уншлагын 83 материал",
      "Нэмэлт 3 сарын эрх",
    ],
    accent: "yellow",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "649,000₮",
    features: [
      "Бүх Hero эрхүүд +",
      "Түвшин бүрийн нэмэгдлүүд",
      "Сонсох чадвар сайжруулах арга техник",
      "Нэмэлт 8 сарын эрх",
    ],
    accent: "violet",
  },
];

const pricingComparisonRows = [
  { label: "Хувийн багш: 1,000,000₮/сар × 3 сар", price: "3,000,000₮", positive: false },
  { label: "Англи хэлний курс", price: "800,000₮ - 1,200,000₮", positive: false },
  { label: "Гадаадад суралцах", price: "5,000,000₮+", positive: false },
  { label: "Color English Pro", price: "649,000₮", positive: true, sub: "2 сар + 8 сар нэмэлт эрхтэй" },
];

const roadmapItems = [
  {
    days: "Days 1-10",
    tag: "A1 Starter",
    title: "Багц үг/тэмдэг сэдвүүд",
    topics: ["My Family", "Daily Routine", "Fruits & Vegetables", "My Classroom"],
  },
  {
    days: "Days 11-20",
    tag: "A2 Foundation",
    title: "Өргөн хүрээний сэдвүүд",
    topics: [
      "Weather & Seasons",
      "Shopping & Money",
      "Travel & Transportation",
      "Food & Restaurants",
    ],
  },
  {
    days: "Days 21-35",
    tag: "B1 Builder",
    title: "Нийгэм, байгаль орчны асуудлууд",
    topics: ["Critical Thinking", "Air Pollution", "E-waste & Recycling", "Health & Wellness"],
  },
  {
    days: "Days 36-50",
    tag: "B2 Accelerator",
    title: "Гүнзгий сэдэв, санал солилцоо",
    topics: [
      "Volunteering & Social Impact",
      "The Lost City of Atlantis",
      "Work-Life Balance",
      "Cultural Diversity",
    ],
  },
  {
    days: "Days 51-60",
    tag: "C1 Mastery",
    title: "Академик болон мэргэжлийн сэдвүүд",
    topics: ["Global Economics", "Debate & Persuasion", "Innovation & AI", "Career Communication"],
  },
];

const faqItems = [
  {
    question: "Ямар ч анхан шатны мэдлэггүй байсан ч болох уу?",
    answer:
      "Тийм. Бид эхний өдөр түвшин тогтоох үнэлгээ авч, таны түвшинд тохирсон замнал руу байршуулдаг.",
  },
  {
    question: "Өдөрт хэр их хугацаа шаардлагатай вэ?",
    answer:
      "Хамгийн багадаа 40 минут тогтмол хичээллэвэл хангалттай. Илүү их цаг зарцуулах тусам ахиц хурдан гарна.",
  },
  {
    question: "60 хоногийн дараа access шууд хаагдах уу?",
    answer:
      "Үндсэн хөтөлбөр 60 хоног үргэлжилнэ. Дараа нь давтлага болон нэмэлт материалын хязгаарлагдмал эрх нээлттэй үлдэнэ.",
  },
  {
    question: "Хичээл хоцорвол нөхөж үзэх боломжтой юу?",
    answer:
      "Тийм. Live session-үүд бичлэгтэй тул та хүссэн үедээ дахин үзэж, багшаасаа асуулт асуух боломжтой.",
  },
];

const paymentFields = [
  { key: "bank", label: "БАНК", value: "Голомт Банк" },
  { key: "account", label: "ДАНСНЫ ДУГААР", value: "2205272133" },
  { key: "iban", label: "IBAN", value: "MN520015002205272133" },
  { key: "name", label: "ДАНСНЫ НЭР", value: "Ууганбаатар" },
  {
    key: "reference",
    label: "ГҮЙЛГЭЭНИЙ УТГА",
    value: "Утасны дугаар | Сошиал хаягийн нэр | Овог нэр",
  },
];

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M12 3L14.6 9.4L21 12L14.6 14.6L12 21L9.4 14.6L3 12L9.4 9.4L12 3Z"
        className="stroke-current"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" className="stroke-current" strokeWidth="1.8" />
      <path d="M12 7.8V12L15.2 13.8" className="stroke-current" strokeWidth="1.8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M5 12.5L9.2 16.5L19 7.5" className="stroke-current" strokeWidth="2.2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M12 3L18.2 5.5V11.4C18.2 15.1 15.6 18.5 12 20.2C8.4 18.5 5.8 15.1 5.8 11.4V5.5L12 3Z"
        className="stroke-current"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path
        d="M12 6.5C10.1 4.9 7.6 4 5 4V17.5C7.6 17.5 10.1 18.4 12 20C13.9 18.4 16.4 17.5 19 17.5V4C16.4 4 13.9 4.9 12 6.5Z"
        className="stroke-current"
        strokeWidth="1.8"
      />
      <path d="M12 6.5V20" className="stroke-current" strokeWidth="1.8" />
    </svg>
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState(1);
  const [copiedField, setCopiedField] = useState("");
  const enrollmentConfig = useSyncExternalStore(
    subscribeEnrollmentConfig,
    getEnrollmentConfigSnapshot,
    getEnrollmentConfigServerSnapshot
  );

  const copyFieldValue = async (key: string, value: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = value;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedField(key);
      window.setTimeout(() => setCopiedField(""), 1400);
    } catch {
      setCopiedField("");
    }
  };

  const highlightSentence = (text: string, highlight: string) => {
    const splitIndex = text.indexOf(highlight);
    if (splitIndex === -1) {
      return text;
    }

    const before = text.slice(0, splitIndex);
    const after = text.slice(splitIndex + highlight.length);

    return (
      <>
        {before}
        <span className="font-black text-yellow-300">{highlight}</span>
        {after}
      </>
    );
  };

  const enrollmentProgress = calculateEnrollmentProgress(
    enrollmentConfig.startDate,
    enrollmentConfig.endDate
  );
  const intakeMonthLabel = formatIntakeMonth(enrollmentConfig.intakeMonth);
  const enrollmentEndDate = formatDisplayDate(enrollmentConfig.endDate);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-800 bg-[#05070f]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <a href="#" className="inline-flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-yellow-300/60 bg-yellow-400/10 font-black text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.25)]">
              <BookIcon />
            </span>
            <span className="text-xl font-black tracking-wide text-zinc-100">
              ColorEnglish
            </span>
          </a>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-7 text-xs font-extrabold tracking-wide text-zinc-300 md:flex">
              <a href="#course" className="transition hover:text-yellow-300">
                Хөтөлбөр
              </a>
              <a href="#roadmap" className="transition hover:text-yellow-300">
                АРГА БАРИЛ
              </a>
              <a href="#faq" className="transition hover:text-yellow-300">
                ҮР ДҮН
              </a>
              <a href="#pricing" className="transition hover:text-yellow-300">
                ҮНЭ
              </a>
              <a href="/dashboard" className="transition hover:text-yellow-300">
                DASHBOARD
              </a>
            </nav>
            <a
              href="#pricing"
              className="rounded-xl bg-yellow-400 px-3 py-2 text-xs font-black text-zinc-900 transition hover:bg-yellow-300 md:px-5 md:text-sm"
            >
              Суудал баталгаажуулах →
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-14 md:gap-16 md:px-10 md:py-16">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl"
        >
          <div className="pointer-events-none absolute right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-3xl" />
          <div className="grid gap-12 py-2 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm font-bold text-zinc-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                60 ӨДРИЙН ОНЛАЙН ХӨТӨЛБӨР
              </p>
              <h1 className="max-w-xl text-5xl font-black leading-[1.08] tracking-tight md:text-7xl">
                60 хоногт англи хэл дээр{" "}
                <span className="text-emerald-400">уншиж орчуулдаг</span> болохоор
                байна уу?
              </h1>
              <p className="mt-6 max-w-lg text-2xl font-extrabold text-zinc-200">
                Дүрэм цээжлэхгүй - зөвхөн өнгөцлөсөн орчуулга
              </p>
              <p className="mt-3 text-sm font-semibold text-zinc-400">
                180 нийтлэл • өдөр бүр 50-60 минут • утас, таблет, компьютер
              </p>

              <div className="mt-7 max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 md:p-5">
                <p className="text-xs font-black text-rose-300">БҮРТГЭЛ ХААГДАХАД:</p>
                <div className="mt-2 grid grid-cols-4 gap-2 text-center">
                  {[
                    { num: "00", label: "өдөр" },
                    { num: "00", label: "цаг" },
                    { num: "00", label: "минут" },
                    { num: "00", label: "секунд" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg bg-zinc-950 px-2 py-2">
                      <p className="text-xl font-black text-zinc-100">{item.num}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="#pricing"
                className="mt-6 inline-flex rounded-xl bg-yellow-400 px-6 py-3 text-base font-black text-zinc-900 transition hover:bg-yellow-300"
              >
                Суудал баталгаажуулах →
              </a>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[30px] bg-yellow-300/15 blur-3xl" />
              <div className="relative rounded-3xl border border-zinc-700 bg-zinc-900/95 p-7 shadow-2xl shadow-black/40">
                <div className="mb-8 flex justify-end gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                </div>
                <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-yellow-400/20 text-yellow-300">
                  <BookIcon />
                </div>
                <h3 className="text-center text-4xl font-black text-zinc-100">
                  Жишээ хичээл үзэх
                </h3>
                <p className="mt-2 text-center text-sm font-semibold text-zinc-400">
                  The Mystery of the Missing Keys
                </p>
                <a
                  href="#course"
                  className="mx-auto mt-7 inline-flex rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-black text-zinc-900 transition hover:bg-yellow-300"
                >
                  Дэлгэрэнгүй харах ↗
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-orange-400/30 bg-zinc-900 p-6 md:p-8"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">
              Элсэлтийн явц ({intakeMonthLabel}) - {enrollmentProgress}%
            </h2>
            <span className="rounded-md bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300">
              Хаагдах: {enrollmentEndDate}
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${enrollmentProgress}%` }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="h-full rounded-full bg-linear-to-r from-fuchsia-500 via-orange-400 to-amber-300"
            />
          </div>
          <p className="mt-3 text-sm text-zinc-400">
            Суудлын тоогоор биш, бүртгэлийн огнооны явцаар автоматаар тооцогдоно.
          </p>
        </motion.section>

        <section id="course" className="grid gap-7 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-fuchsia-400/30 bg-zinc-900 p-6 md:p-7"
          >
            <h3 className="text-xl font-semibold">Сургалтын мэдээлэл</h3>
            <p className="mt-3 text-zinc-300">
              7 хоногт 3 удаагийн live хичээл, 1 удаагийн speaking practice,
              даалгаврын хувийн feedback-тай.
            </p>
            <ul className="mt-5 space-y-3">
              {courseTopics.map((topic) => (
                <li key={topic} className="flex items-center gap-3 text-zinc-200">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                  {topic}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-orange-400/30 bg-zinc-900 p-6 md:p-7"
          >
            <h3 className="text-xl font-semibold">Яагаад энэ хөтөлбөр вэ?</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                "CEFR түвшний үнэлгээ",
                "Real-life conversation scenarios",
                "Progress dashboard",
                "Хичээлийн бичлэг дахин үзэх эрх",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section
          id="roadmap"
          className="relative overflow-hidden rounded-3xl px-5 py-12 md:px-10 md:py-14"
        >
          <div className="relative">
            <h3 className="flex items-center gap-3 text-3xl font-black text-white md:text-4xl">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-br from-fuchsia-500 to-cyan-300 text-zinc-950">
                <SparkIcon />
              </span>
              Сургалтын Roadmap
            </h3>
            <p className="mt-3 text-base font-extrabold text-fuchsia-200 md:text-lg">
              {highlightSentence(
                "Дараалсан сэдвийн түвшнээр 60 өдрийн алхамтай ахиц.",
                "60 өдрийн"
              )}{" "}
              <span className="font-black text-cyan-300">бодитоор</span> харагдана.
            </p>
          </div>

          <div className="relative mt-12 space-y-12">
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-linear-to-b from-emerald-300/0 via-fuchsia-300/85 to-cyan-300/0 md:block" />

            {roadmapItems.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={item.days}
                  className={`relative grid items-center gap-8 md:grid-cols-[1fr_auto_1fr] ${isLeft ? "" : "md:[&>*:first-child]:order-3 md:[&>*:last-child]:order-1"
                    }`}
                >
                  <motion.article
                    initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45 }}
                    className="rounded-2xl border border-cyan-300/50 p-5 shadow-lg shadow-fuchsia-500/10"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h4 className="inline-flex items-center gap-2 text-xl font-black text-cyan-200">
                        <span className="text-fuchsia-300">
                          <ClockIcon />
                        </span>
                        {item.days}
                      </h4>
                      <span className="rounded-md border border-violet-300/55 bg-violet-500/20 px-2 py-1 text-xs font-bold text-violet-200">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-base font-extrabold text-orange-300">
                      {item.title}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm font-bold text-zinc-100">
                      {item.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-2">
                          <span className="mt-0.5 text-cyan-300">
                            <CheckIcon />
                          </span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </motion.article>

                  <div className="relative mx-auto hidden h-4 w-4 rounded-full border border-cyan-200/70 bg-zinc-900 md:block">
                    <span className="absolute inset-1 rounded-full bg-cyan-100" />
                    <span className="absolute inset-0 rounded-full bg-fuchsia-300/70 blur-sm" />
                  </div>

                  <div className="hidden md:block" />
                </div>
              );
            })}
          </div>
        </section>

        <section id="pricing" className="space-y-8 md:space-y-10">
          <h3 className="text-center text-3xl font-black text-zinc-100 md:text-5xl">
            Багцын сонголтууд
          </h3>

          <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900/75 p-4 md:p-6">
            <div className="space-y-3">
              {pricingComparisonRows.map((row) => (
                <div
                  key={row.label}
                  className={`flex items-start justify-between gap-4 border-b border-zinc-800 pb-3 ${row.positive ? "last:border-b-0 last:pb-0" : ""
                    }`}
                >
                  <div>
                    <p
                      className={`text-sm font-bold ${row.positive ? "text-emerald-300" : "text-zinc-300"
                        }`}
                    >
                      {row.label}
                    </p>
                    {row.sub ? <p className="mt-1 text-xs text-zinc-400">{row.sub}</p> : null}
                  </div>
                  <p
                    className={`text-lg font-black ${row.positive ? "text-emerald-300" : "text-rose-300 line-through"
                      }`}
                  >
                    {row.price}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-3xl rounded-2xl border border-emerald-400/35 bg-linear-to-r from-emerald-500/20 to-cyan-500/20 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
                <ShieldIcon />
              </span>
              <div>
                <p className="text-xl font-black text-emerald-200">
                  100% ТӨЛБӨР БУЦААХ БАТАЛГАА
                </p>
                <p className="text-sm font-semibold text-zinc-200">
                  60 хоногийн төлөвлөгөөг бүрэн дуусгасан ч үр дүн гараагүй бол 100%
                  буцаана.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {pricingPlans.map((plan, index) => {
              const planClass =
                plan.accent === "yellow"
                  ? "border-yellow-400 bg-zinc-900 shadow-[0_0_0_1px_rgba(250,204,21,0.25)]"
                  : plan.accent === "violet"
                    ? "border-violet-400/45 bg-zinc-900"
                    : "border-zinc-800 bg-zinc-900";

              const bulletClass =
                plan.accent === "yellow"
                  ? "text-yellow-300"
                  : plan.accent === "violet"
                    ? "text-violet-300"
                    : "text-zinc-400";

              const buttonClass =
                plan.accent === "yellow"
                  ? "bg-yellow-400 text-zinc-900 hover:bg-yellow-300"
                  : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700";

              return (
                <motion.article
                  key={plan.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className={`relative rounded-3xl border p-6 md:p-7 ${planClass} ${plan.highlighted ? "md:-mt-4" : "md:mt-4"}`}
                >
                  {plan.highlighted ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 px-4 py-1 text-xs font-black text-zinc-900">
                      MOST POPULAR
                    </span>
                  ) : null}
                  <h4 className="text-3xl font-black text-zinc-100">{plan.name}</h4>
                  <p className="mt-3 text-5xl font-black text-zinc-100">{plan.price}</p>
                  <ul className="mt-5 space-y-2 text-sm font-bold text-zinc-200">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className={`mt-0.5 ${bulletClass}`}>
                          <CheckIcon />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className={`mt-7 w-full rounded-xl px-4 py-3 font-extrabold transition ${buttonClass}`}
                  >
                    Судал баталгаажуулах
                  </button>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section
          id="payment"
          className="rounded-3xl border border-fuchsia-500/35 bg-[#070913] p-5 shadow-[0_0_0_1px_rgba(168,85,247,0.2)] md:p-9"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-bold text-zinc-100">Хэрхэн төлбөр төлөх вэ?</h3>
              <p className="text-sm text-cyan-300">Шилжүүлэг хийх заавар</p>
            </div>
            <span className="rounded-md border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-semibold text-zinc-300">
              Secure Payment Info
            </span>
          </div>

          <div className="space-y-4">
            {paymentFields.map((field) => (
              <div
                key={field.key}
                className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 md:flex-row md:items-center md:justify-between md:p-5"
              >
                <div>
                  <p className="text-xs font-semibold tracking-wide text-zinc-500">
                    {field.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-zinc-100">{field.value}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyFieldValue(field.key, field.value)}
                  className="rounded-lg bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-2 font-semibold text-white transition hover:brightness-110"
                >
                  {copiedField === field.key ? "Хуулсан" : "Хуулах"}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            Төлбөрөө шилжүүлсний дараа @color.english Instagram хаяг руу баримтаа илгээнэ үү.
          </div>
        </section>

        <section id="faq" className="rounded-3xl border border-zinc-800 bg-[#060a16] p-6 md:p-10">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-zinc-100">Нийтлэг асуултууд</h3>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-yellow-400" />
          </div>

          <div className="mt-9 space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="rounded-2xl border border-zinc-700 bg-zinc-900/80"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-lg font-semibold text-zinc-100">
                      {item.question}
                    </span>
                    <span className="text-xl leading-none text-yellow-300">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5">
                      <div className="mb-3 h-px w-full bg-zinc-700" />
                      <p className="text-zinc-300">{item.answer}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 p-4 text-center">
            <p className="font-semibold text-zinc-100">Нэмэлт асуулт байна уу?</p>
            <p className="mt-1 text-sm text-zinc-300">
              Instagram дээр бидэнд шууд мессеж бичээрэй: @color.english
            </p>
          </div>
        </section>

        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-fuchsia-400/30 bg-zinc-900 p-6 md:p-8"
        >
          <h3 className="text-2xl font-semibold text-fuchsia-300">
            Context мэдээлэл
          </h3>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
              <p className="text-sm text-zinc-400">Хичээлийн цаг</p>
              <p className="mt-2 font-semibold text-zinc-100">
                Даваа, Лхагва, Баасан 19:00
              </p>
            </div>
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
              <p className="text-sm text-zinc-400">Байршил</p>
              <p className="mt-2 font-semibold text-zinc-100">
                Ulaanbaatar, Sukhbaatar District
              </p>
            </div>
            <div className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
              <p className="text-sm text-zinc-400">Холбоо барих</p>
              <p className="mt-2 font-semibold text-zinc-100">
                +976 9911 2233 <br />
                hello@colorenglish.mn
              </p>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="mt-8 border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between md:px-10">
          <p>
            <span className="font-semibold text-fuchsia-300">Color English</span>{" "}
            - Speak with confidence.
          </p>
          <div className="flex gap-5">
            <a href="#course" className="transition hover:text-orange-300">
              Program
            </a>
            <a href="#pricing" className="transition hover:text-orange-300">
              Pricing
            </a>
            <a href="#payment" className="transition hover:text-orange-300">
              Payment
            </a>
            <a href="#contact" className="transition hover:text-orange-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
