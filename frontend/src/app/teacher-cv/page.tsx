// frontend/src/app/teacher-cv/page.tsx
// Багшаар CV илгээх — нүүр хуудасны footer-оос ирнэ, нэвтрэх шаардлагагүй.
import type { Metadata } from 'next';
import { GraduationCap } from 'lucide-react';
import { PlacementHeader } from '@/components/placement/placement-header';
import { TeacherCvForm } from '@/components/teacher/teacher-cv-form';

export const metadata: Metadata = {
  title: 'Багшаар CV илгээх — ColorEnglish',
  description:
    'ColorEnglish-д англи хэлний багшаар ажиллах хүсэлтээ онлайнаар илгээнэ үү. Нэр, утас, боловсрол, туршлага, сонирхлоо бөглөхөд 5 минут.',
};

export default function TeacherCvPage() {
  return (
    <div className="min-h-screen">
      <PlacementHeader label="Багшаар ажиллах" />
      <main className="mx-auto w-full max-w-3xl space-y-5 px-4 pb-20 pt-6 sm:px-6 sm:pt-10">
        <section className="ce-panel p-6 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15">
            <GraduationCap className="h-6 w-6 text-brand" />
          </div>
          <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-brand">Багшаар CV илгээх</p>
        </section>

        <TeacherCvForm />
      </main>
    </div>
  );
}
