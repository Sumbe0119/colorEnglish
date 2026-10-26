// frontend/src/components/teacher/teacher-cv-form.tsx
// Багшаар ажиллах хүсэлтийн (CV) форм — зураг эхлээд upload хийгдэж, дараа нь JSON-оор илгээнэ.
'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { AlertCircle, BadgeCheck, Camera, Loader2, Plus, Send, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BirthDatePicker } from '@/components/teacher/birth-date-picker';
import { getApiErrorMessage } from '@/lib/api-error';
import { getTeacherApplicationErrors, LANGUAGE_LEVELS, submitTeacherApplication, uploadTeacherPhoto, type TeacherApplicationInput } from '@/lib/teacher-services';
import { cn } from '@/lib/utils';
import { toast } from '@/store/toast-store';

const MIN_AGE = 16;
const MAX_AGE = 80;
const TEXT_MAX = 4000;

const phoneSchema = z.string().trim().regex(/^\d{8}$/, 'Утасны дугаар 8 оронтой тоо байна');
const requiredText = (message: string) =>
  z.string().trim().min(1, message).max(TEXT_MAX, `Хэт урт байна (${TEXT_MAX} тэмдэгт хүртэл)`);
const short = (max = 150) => z.string().trim().max(max, 'Хэт урт байна');

function ageFromIso(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  const birth = new Date(y, m - 1, d);
  if (birth.getFullYear() !== y || birth.getMonth() !== m - 1 || birth.getDate() !== d) return null;
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now.getMonth() < m - 1 || (now.getMonth() === m - 1 && now.getDate() < d)) age -= 1;
  return age;
}

const schema = z
  .object({
    lastName: z.string().trim().min(1, 'Овгоо оруулна уу').max(60, 'Хэт урт байна'),
    firstName: z.string().trim().min(1, 'Нэрээ оруулна уу').max(60, 'Хэт урт байна'),
    phone: phoneSchema,
    email: z.union([z.literal(''), z.string().trim().email('И-мэйл хаяг буруу байна').max(120)]),
    instagram: short(100),
    facebook: short(100),
    aboutMe: requiredText('Өөрийнхөө тухай бичнэ үү'),
    otherLanguages: z.array(z.object({ language: short(60).min(1, 'Хэлний нэр'), level: short(40).min(1, 'Түвшин сонгоно уу') })),
    contactName: z.string().trim().max(60, 'Хэт урт байна'),
    contactPhone: phoneSchema,
    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Төрсөн огноогоо сонгоно уу')
      .refine(
        (v) => {
          const age = ageFromIso(v);
          return age !== null && age >= MIN_AGE && age <= MAX_AGE;
        },
        { message: `Төрсөн огноо буруу байна (${MIN_AGE}–${MAX_AGE} насны хооронд)` },
      ),
    photoUrl: z.string().min(1, 'Цээж зургаа оруулна уу'),
    educations: z
      .array(z.object({ school: short().min(1, 'Сургуулийн нэр'), major: short(), period: short(40) }))
      .min(1, 'Боловсролоо нэмнэ үү'),
    experiences: z.array(
      z.object({ company: short().min(1, 'Байгууллагын нэр'), position: short(), period: short(40), description: short(2000) }),
    ),
    awards: z.array(z.object({ title: short(300).min(1, 'Шагналын нэр'), year: short(20) })),
    hasLanguageScore: z.enum(['yes', 'no'], { errorMap: () => ({ message: 'Сонголтоо хийнэ үү' }) }),
    languageScores: z.array(
      z.object({ test: short(60).min(1, 'Шалгалтын нэр'), score: short(30).min(1, 'Оноо'), year: short(20) }),
    ),
    hobbies: requiredText('Хоббигоо бичнэ үү'),
    fiveYearGoals: requiredText('Ойрын 5 жилийн сонирхол, зорилгоо бичнэ үү'),
    contentInterest: z.enum(['yes', 'no'], { errorMap: () => ({ message: 'Сонголтоо хийнэ үү' }) }),
    contentReason: requiredText('Шалтгаанаа бичнэ үү'),
    note: z.string().trim().max(TEXT_MAX, `Хэт урт байна (${TEXT_MAX} тэмдэгт хүртэл)`),
  })
  .superRefine((v, ctx) => {
    if (v.hasLanguageScore === 'yes' && v.languageScores.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['hasLanguageScore'], message: 'Хэлний оноогоо нэмнэ үү' });
    }
  });

type FormValues = z.infer<typeof schema>;

const textareaClass =
  'w-full rounded-xl border border-ink-500 bg-ink-800 px-4 py-3 text-base text-mist-50 placeholder:text-mist-500 transition-colors duration-200 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40';


export function TeacherCvForm() {
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<{ phone: string; firstName: string } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      lastName: '',
      firstName: '',
      phone: '',
      email: '',
      instagram: '',
      facebook: '',
      aboutMe: '',
      otherLanguages: [],
      contactName: '',
      contactPhone: '',
      birthDate: '',
      photoUrl: '',
      educations: [{ school: '', major: '', period: '' }],
      experiences: [],
      awards: [],
      hasLanguageScore: undefined,
      languageScores: [],
      hobbies: '',
      fiveYearGoals: '',
      contentInterest: undefined,
      contentReason: '',
      note: '',
    },
  });

  const educations = useFieldArray({ control, name: 'educations' });
  const experiences = useFieldArray({ control, name: 'experiences' });
  const awards = useFieldArray({ control, name: 'awards' });
  const otherLanguages = useFieldArray({ control, name: 'otherLanguages' });
  const languageScores = useFieldArray({ control, name: 'languageScores' });

  const photoUrl = watch('photoUrl');
  const birthDate = watch('birthDate');
  const contentInterest = watch('contentInterest');
  const hasLanguageScore = watch('hasLanguageScore');

  /** Хоосон талбарыг undefined болгоно (backend заавал биш талбарт хоосон мөр хүлээхгүй) */
  const clean = <T extends object>(row: T) =>
    Object.fromEntries(Object.entries(row).map(([k, v]) => [k, v || undefined]));

  const onSubmit = async (values: FormValues) => {
    setServerErrors([]);
    try {
      const hasScore = values.hasLanguageScore === 'yes';
      await submitTeacherApplication({
        lastName: values.lastName,
        firstName: values.firstName,
        phone: values.phone,
        email: values.email || undefined,
        aboutMe: values.aboutMe,
        otherLanguages: values.otherLanguages as TeacherApplicationInput['otherLanguages'],
        instagram: values.instagram || undefined,
        facebook: values.facebook || undefined,
        contactName: values.contactName || undefined,
        contactPhone: values.contactPhone,
        birthDate: values.birthDate,
        photoUrl: values.photoUrl,
        educations: values.educations.map(clean) as TeacherApplicationInput['educations'],
        experiences: values.experiences.map(clean) as TeacherApplicationInput['experiences'],
        awards: values.awards.map(clean) as TeacherApplicationInput['awards'],
        hasLanguageScore: hasScore,
        languageScores: (hasScore ? values.languageScores.map(clean) : []) as TeacherApplicationInput['languageScores'],
        hobbies: values.hobbies,
        fiveYearGoals: values.fiveYearGoals,
        contentInterest: values.contentInterest === 'yes',
        contentReason: values.contentReason,
        note: values.note || undefined,
      });
      setSubmitted({ phone: values.phone, firstName: values.firstName });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setServerErrors(getTeacherApplicationErrors(err, 'CV илгээхэд алдаа гарлаа. Дахин оролдоно уу.'));
    }
  };

  if (submitted) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="ce-panel flex flex-col items-center px-6 py-12 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15">
          <BadgeCheck className="h-7 w-7 text-success" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-mist-50">Баярлалаа, {submitted.firstName}!</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-mist-300">
          Таны CV-г хүлээн авлаа. Бид танилцаад <span className="font-mono text-mist-100">{submitted.phone}</span>{' '}
          дугаараар 3 ажлын өдрийн дотор холбогдох болно.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-hover"
        >
          Нүүр хуудас руу буцах
        </Link>
      </motion.section>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Section title="Хувийн мэдээлэл" step={1}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Овог *" placeholder="Бат" autoComplete="family-name" error={errors.lastName?.message} {...register('lastName')} />
          <Input label="Нэр *" placeholder="Болд" autoComplete="given-name" error={errors.firstName?.message} {...register('firstName')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Утасны дугаар *"
            type="tel"
            inputMode="numeric"
            maxLength={8}
            placeholder="99112233"
            autoComplete="tel-national"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="И-мэйл"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Холбоо барих хүний нэр"
            placeholder="Ээж, аав, найз…"
            error={errors.contactName?.message}
            {...register('contactName')}
          />
          <Input
            label="Холбоо барих хүний дугаар *"
            type="tel"
            inputMode="numeric"
            maxLength={8}
            placeholder="88112233"
            error={errors.contactPhone?.message}
            {...register('contactPhone')}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <BirthDatePicker
            label="Төрсөн он, сар, өдөр *"
            value={birthDate}
            error={errors.birthDate?.message}
            onChange={(iso) => setValue('birthDate', iso, { shouldValidate: true, shouldDirty: true })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Instagram нэр" placeholder="@username" autoCapitalize="none" error={errors.instagram?.message} {...register('instagram')} />
          <Input label="Facebook нэр" placeholder="Facebook дээрх нэр эсвэл линк" error={errors.facebook?.message} {...register('facebook')} />
        </div>

        <PhotoField
          value={photoUrl}
          error={errors.photoUrl?.message}
          onChange={(url) => setValue('photoUrl', url, { shouldValidate: true, shouldDirty: true })}
        />

        <TextareaField
          label="Өөрийнхөө тухай *"
          hint="Өөрийгөө танилцуул: хэн бэ, яагаад багш болохыг хүссэн, ямар давуу талтай, хэрхэн заадаг гэх мэт."
          placeholder="Сайн байна уу, намайг … гэдэг. Би англи хэл заахдаа …"
          rows={7}
          error={errors.aboutMe?.message}
          {...register('aboutMe')}
        />

        <ListBlock
          title="Бусад гадаад хэлний мэдлэг"
          hint="Англи хэлнээс гадна мэддэг хэл, түвшин. Байхгүй бол хоосон үлдээнэ."
          addLabel="Гадаад хэл нэмэх"
          onAdd={() => otherLanguages.append({ language: '', level: '' })}
        >
          {otherLanguages.fields.map((f, i) => (
            <Row key={f.id} index={i} onRemove={() => otherLanguages.remove(i)}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Хэл *" placeholder="Орос, Хятад, Япон…" error={errors.otherLanguages?.[i]?.language?.message} {...register(`otherLanguages.${i}.language`)} />
                <div className="space-y-1.5">
                  <label htmlFor={`otherLanguages.${i}.level`} className="block text-sm font-medium text-mist-200">Түвшин *</label>
                  <select
                    id={`otherLanguages.${i}.level`}
                    className="w-full rounded-xl border border-ink-500 bg-ink-800 px-4 py-3 text-base text-mist-50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
                    {...register(`otherLanguages.${i}.level`)}
                  >
                    <option value="">Сонгох</option>
                    {LANGUAGE_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  {errors.otherLanguages?.[i]?.level?.message && <p className="text-xs text-danger">{errors.otherLanguages[i]?.level?.message}</p>}
                </div>
              </div>
            </Row>
          ))}
        </ListBlock>
      </Section>

      <Section title="Боловсрол, туршлага" step={2}>
        <ListBlock
          title="Боловсрол *"
          hint="Төгссөн болон сурч буй сургуулиуд — олныг нэмж болно."
          addLabel="Боловсрол нэмэх"
          error={errors.educations?.root?.message ?? errors.educations?.message}
          onAdd={() => educations.append({ school: '', major: '', period: '' })}
        >
          {educations.fields.map((f, i) => (
            <Row key={f.id} index={i} onRemove={educations.fields.length > 1 ? () => educations.remove(i) : undefined}>
              <Input label="Сургууль *" placeholder="МУИС" error={errors.educations?.[i]?.school?.message} {...register(`educations.${i}.school`)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Мэргэжил" placeholder="Англи хэлний багш" {...register(`educations.${i}.major`)} />
                <Input label="Хугацаа" placeholder="2015–2019" {...register(`educations.${i}.period`)} />
              </div>
            </Row>
          ))}
        </ListBlock>

        <ListBlock
          title="Ажлын туршлага"
          hint="Туршлагагүй бол хоосон үлдээнэ. Олныг нэмж болно."
          addLabel="Ажлын туршлага нэмэх"
          onAdd={() => experiences.append({ company: '', position: '', period: '', description: '' })}
        >
          {experiences.fields.map((f, i) => (
            <Row key={f.id} index={i} onRemove={() => experiences.remove(i)}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Байгууллага *" placeholder="Х сургууль" error={errors.experiences?.[i]?.company?.message} {...register(`experiences.${i}.company`)} />
                <Input label="Албан тушаал" placeholder="Англи хэлний багш" {...register(`experiences.${i}.position`)} />
              </div>
              <Input label="Хугацаа" placeholder="2020–2024" {...register(`experiences.${i}.period`)} />
              <TextareaField label="Ажлын чиг үүрэг" rows={3} placeholder="5–9-р ангийн англи хэлний хичээл заасан…" {...register(`experiences.${i}.description`)} />
            </Row>
          ))}
        </ListBlock>

        <ListBlock
          title="Авч байсан гавьяа, шагнал"
          hint="Байхгүй бол хоосон үлдээнэ."
          addLabel="Шагнал нэмэх"
          onAdd={() => awards.append({ title: '', year: '' })}
        >
          {awards.fields.map((f, i) => (
            <Row key={f.id} index={i} onRemove={() => awards.remove(i)}>
              <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                <Input label="Шагнал, гавьяа *" placeholder="Шилдэг багшаар шалгарсан" error={errors.awards?.[i]?.title?.message} {...register(`awards.${i}.title`)} />
                <Input label="Он" placeholder="2022" {...register(`awards.${i}.year`)} />
              </div>
            </Row>
          ))}
        </ListBlock>

        <div className="space-y-3">
          <p className="block text-sm font-medium text-mist-200">Мэргэжлийн хэлний оноо (IELTS, TOEFL г.м.) байгаа юу? *</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'yes', label: 'Тийм, байгаа' },
              { value: 'no', label: 'Үгүй' },
            ].map((o) => (
              <label key={o.value} className="cursor-pointer">
                <input type="radio" value={o.value} className="peer sr-only" {...register('hasLanguageScore')} />
                <span className="flex items-center justify-center rounded-xl border border-ink-500 bg-ink-800 px-4 py-3 text-sm text-mist-200 transition-colors hover:border-brand/40 peer-checked:border-brand peer-checked:bg-brand/10 peer-checked:text-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40">
                  {o.label}
                </span>
              </label>
            ))}
          </div>
          {errors.hasLanguageScore?.message && <p className="text-xs text-danger">{errors.hasLanguageScore.message}</p>}
          {hasLanguageScore === 'yes' && (
            <ListBlock
              title="Хэлний оноо"
              addLabel="Оноо нэмэх"
              onAdd={() => languageScores.append({ test: '', score: '', year: '' })}
              autoAddWhenEmpty={languageScores.fields.length === 0}
            >
              {languageScores.fields.map((f, i) => (
                <Row key={f.id} index={i} onRemove={() => languageScores.remove(i)}>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Input label="Шалгалт *" placeholder="IELTS" error={errors.languageScores?.[i]?.test?.message} {...register(`languageScores.${i}.test`)} />
                    <Input label="Оноо *" placeholder="7.5" error={errors.languageScores?.[i]?.score?.message} {...register(`languageScores.${i}.score`)} />
                    <Input label="Он" placeholder="2023" {...register(`languageScores.${i}.year`)} />
                  </div>
                </Row>
              ))}
            </ListBlock>
          )}
        </div>
      </Section>

      <Section title="Сонирхол, зорилго" step={3}>
        <TextareaField
          label="Хобби *"
          placeholder="Жишээ: ном унших, аялах, кино, спорт…"
          rows={3}
          error={errors.hobbies?.message}
          {...register('hobbies')}
        />
        <TextareaField
          label="Ойрын 5 жилийн сонирхол, зорилго *"
          hint="Мэргэжлийн болон хувийн хүрээнд юунд хүрэхийг зорьж байна вэ?"
          placeholder="Жишээ: онлайн сургалтын арга зүйд гүнзгийрч, өөрийн курс бүтээх…"
          rows={4}
          error={errors.fiveYearGoals?.message}
          {...register('fiveYearGoals')}
        />
      </Section>

      <Section title="Контент бүтээх" step={4}>
        <div className="space-y-1.5">
          <p className="block text-sm font-medium text-mist-200">Контент (видео хичээл, богино бичлэг г.м.) хийх сонирхолтой юу? *</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'yes', label: 'Тийм, сонирхолтой' },
              { value: 'no', label: 'Үгүй' },
            ].map((o) => (
              <label key={o.value} className="cursor-pointer">
                <input type="radio" value={o.value} className="peer sr-only" {...register('contentInterest')} />
                <span className="flex items-center justify-center rounded-xl border border-ink-500 bg-ink-800 px-4 py-3 text-sm text-mist-200 transition-colors hover:border-brand/40 peer-checked:border-brand peer-checked:bg-brand/10 peer-checked:text-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40">
                  {o.label}
                </span>
              </label>
            ))}
          </div>
          {errors.contentInterest?.message && <p className="text-xs text-danger">{errors.contentInterest.message}</p>}
        </div>
        <TextareaField
          label={contentInterest === 'no' ? 'Яагаад үгүй гэж? *' : 'Яагаад? *'}
          hint={
            contentInterest === 'no'
              ? 'Шалтгаанаа товч бичнэ үү.'
              : 'Ямар төрлийн контент хийх дуртай, өмнө хийсэн зүйл байвал линк, тайлбар.'
          }
          placeholder="Жишээ: TikTok/YouTube дээр англи хэлний богино хичээл хийдэг…"
          rows={4}
          error={errors.contentReason?.message}
          {...register('contentReason')}
        />
        <TextareaField
          label="Нэмэлт мэдээлэл"
          hint="Бидэнд хэлэх өөр зүйл байвал (ажиллах цаг, хүлээлт, асуулт…)"
          rows={3}
          error={errors.note?.message}
          {...register('note')}
        />
      </Section>

      {serverErrors.length > 0 && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {serverErrors.length === 1 ? (
            <span>{serverErrors[0]}</span>
          ) : (
            <div>
              <p className="font-medium">Дараах талбаруудыг шалгана уу:</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5">
                {serverErrors.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="ce-panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-mist-500">
          * тэмдэгтэй талбарууд заавал. Илгээснээр мэдээллийг ColorEnglish-ийн багт ажлын санал тавих зорилгоор ашиглахыг
          зөвшөөрнө.
        </p>
        <Button type="submit" isLoading={isSubmitting} className="shrink-0 gap-2 px-6">
          {!isSubmitting && <Send className="h-4 w-4" />} CV илгээх
        </Button>
      </div>
    </form>
  );
}

function ListBlock({
  title,
  hint,
  addLabel,
  onAdd,
  error,
  autoAddWhenEmpty,
  children,
}: {
  title: string;
  hint?: string;
  addLabel: string;
  onAdd: () => void;
  error?: string;
  autoAddWhenEmpty?: boolean;
  children: React.ReactNode;
}) {
  // Хэлний оноо "Тийм" сонгомогц эхний мөр автоматаар гарч ирнэ
  useEffect(() => {
    if (autoAddWhenEmpty) onAdd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-mist-200">{title}</p>
        {hint && <p className="mt-0.5 text-xs text-mist-400">{hint}</p>}
      </div>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-brand/50 px-3.5 py-2 text-sm text-brand transition-colors hover:bg-brand/10"
      >
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
    </div>
  );
}

function Row({ index, onRemove, children }: { index: number; onRemove?: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-xl border border-ink-600/70 bg-ink-800/40 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-mist-500">#{index + 1}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-mist-400 transition-colors hover:bg-danger/10 hover:text-danger"
            aria-label="Мөр устгах"
          >
            <Trash2 className="h-3.5 w-3.5" /> Устгах
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Section({ title, step, children }: { title: string; step: number; children: React.ReactNode }) {
  return (
    <section className="ce-panel space-y-4 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/15 font-mono text-xs text-brand">{step}</span>
        <h2 className="font-display text-lg font-semibold text-mist-50">{title}</h2>
      </div>
      {children}
    </section>
  );
}

type TextareaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
};

const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(function TextareaField(
  { label, hint, error, className, id, ...props },
  ref,
) {
  const fieldId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="block text-sm font-medium text-mist-200">
        {label}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        className={cn(textareaClass, error && 'border-danger focus:border-danger focus:ring-danger', className)}
        aria-invalid={!!error}
        {...props}
      />
      {error ? <p className="text-xs text-danger">{error}</p> : hint ? <p className="text-xs text-mist-400">{hint}</p> : null}
    </div>
  );
});

function PhotoField({ value, error, onChange }: { value: string; error?: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadTeacherPhoto(file);
      onChange(res.url);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Зураг upload амжилтгүй. Дахин оролдоно уу.'));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <p className="block text-sm font-medium text-mist-200">Цээж зураг *</p>
      <div className="flex flex-wrap items-start gap-4">
        <div
          className={cn(
            'relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border bg-ink-800',
            error ? 'border-danger' : 'border-ink-600',
          )}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Цээж зураг" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1.5 p-2 text-center text-xs text-mist-500">
              <Camera className="h-6 w-6" />
              Зураггүй
            </div>
          )}
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-1.5 top-1.5 rounded-md bg-ink-950/80 p-1 text-mist-300 hover:text-danger"
              title="Устгах"
              aria-label="Зураг устгах"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink-950/60">
              <Loader2 className="h-5 w-5 animate-spin text-brand" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-ink-500 bg-ink-800 px-4 py-2.5 text-sm text-mist-100 transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            {uploading ? 'Upload хийж байна…' : value ? 'Зураг солих' : 'Зураг сонгох'}
          </button>
          <p className="text-xs text-mist-400">Нүүр тод харагдах, саяхны зураг. JPG, PNG, WebP · 5MB хүртэл</p>
          {error && <p className="text-xs text-danger">{error}</p>}
        </div>
      </div>
    </div>
  );
}
