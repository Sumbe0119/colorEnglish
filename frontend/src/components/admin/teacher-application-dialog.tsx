// frontend/src/components/admin/teacher-application-dialog.tsx
// Админ: багшийн CV-ийн дэлгэрэнгүй — бүх талбар, зураг, төлөв/тэмдэглэл засах, устгах
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays, Clapperboard, Mail, Phone, Save, Trash2, UserRound, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { selectClass, textareaClass } from '@/components/admin/admin-form-fields';
import { getApiErrorMessage } from '@/lib/api-error';
import {
  deleteAdminTeacherApplication,
  formatBirthDate,
  TEACHER_STATUSES,
  TEACHER_STATUS_LABELS,
  updateAdminTeacherApplication,
  type AdminTeacherApplication,
  type TeacherApplicationStatus,
} from '@/lib/teacher-services';
import { cn } from '@/lib/utils';
import { toast } from '@/store/toast-store';

export function teacherStatusClass(status: TeacherApplicationStatus) {
  switch (status) {
    case 'NEW':
      return 'bg-brand/15 text-brand';
    case 'REVIEWED':
      return 'bg-amber-500/15 text-amber-200';
    case 'ACCEPTED':
      return 'bg-emerald-500/15 text-emerald-300';
    case 'REJECTED':
      return 'bg-red-500/15 text-red-300';
    default:
      return 'bg-ink-700 text-mist-400';
  }
}

export function formatDateTime(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('mn-MN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TeacherApplicationDialog({
  application,
  onClose,
  onUpdated,
  onDeleted,
}: {
  application: AdminTeacherApplication | null;
  onClose: () => void;
  onUpdated: (next: AdminTeacherApplication) => void;
  onDeleted: (id: string) => void;
}) {
  const [status, setStatus] = useState<TeacherApplicationStatus>('NEW');
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Өөр хүсэлт сонгогдоход формын төлвийг шинэчилнэ
  useEffect(() => {
    if (!application) return;
    setStatus(application.status);
    setAdminNote(application.adminNote ?? '');
    setConfirmDelete(false);
  }, [application]);

  const busy = saving || deleting;

  useEffect(() => {
    if (!application) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy && !confirmDelete) onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [application, busy, confirmDelete, onClose]);

  if (!application || typeof document === 'undefined') return null;
  const a = application;
  const dirty = status !== a.status || adminNote.trim() !== (a.adminNote ?? '');

  const save = async () => {
    setSaving(true);
    try {
      const next = await updateAdminTeacherApplication(a.id, {
        status,
        adminNote: adminNote.trim() ? adminNote.trim() : null,
      });
      toast.success(`${next.fullName}: хадгаллаа`);
      onUpdated(next);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Хадгалахад алдаа гарлаа'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await deleteAdminTeacherApplication(a.id);
      toast.success(`${a.fullName}: CV-г устгалаа`);
      setConfirmDelete(false);
      onDeleted(a.id);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Устгахад алдаа гарлаа'));
    } finally {
      setDeleting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[150] flex items-start justify-center overflow-y-auto bg-ink-950/80 p-3 backdrop-blur-sm sm:p-8"
      onClick={() => {
        if (!busy) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-application-title"
    >
      <div
        className="my-auto w-full max-w-3xl rounded-2xl border border-ink-600 bg-ink-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Толгой: зураг + нэр + төлөв */}
        <div className="flex items-start gap-4 border-b border-ink-700 p-5 sm:p-6">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-ink-600 bg-ink-800 sm:h-28 sm:w-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.photoUrl} alt={a.fullName} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="teacher-application-title" className="font-display text-xl font-semibold text-mist-50">
                {a.fullName}
              </h2>
              <span className={cn('rounded-full px-2.5 py-0.5 text-xs', teacherStatusClass(a.status))}>
                {TEACHER_STATUS_LABELS[a.status]}
              </span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-mist-300">
              <CalendarDays className="h-3.5 w-3.5 text-mist-500" />
              {formatBirthDate(a.birthDate)} · {a.age} нас
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <a href={`tel:${a.phone}`} className="inline-flex items-center gap-1.5 font-mono text-mist-100 hover:text-brand">
                <Phone className="h-3.5 w-3.5 text-mist-500" /> {a.phone}
              </a>
              {a.email && (
                <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1.5 text-mist-200 hover:text-brand">
                  <Mail className="h-3.5 w-3.5 text-mist-500" /> {a.email}
                </a>
              )}
            </div>
            {(a.instagram || a.facebook) && (
              <p className="mt-1.5 flex flex-wrap gap-x-4 text-xs text-mist-300">
                {a.instagram && <span>Instagram: <span className="text-mist-100">{a.instagram}</span></span>}
                {a.facebook && <span>Facebook: <span className="text-mist-100">{a.facebook}</span></span>}
              </p>
            )}
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-mist-400">
              <UserRound className="h-3.5 w-3.5 text-mist-500" />
              Холбоо барих: {a.contactName ? `${a.contactName} · ` : ''}
              <a href={`tel:${a.contactPhone}`} className="font-mono text-mist-200 hover:text-brand">
                {a.contactPhone}
              </a>
            </p>
            <p className="mt-1.5 text-[11px] text-mist-500">
              Илгээсэн: {formatDateTime(a.createdAt)}
              {a.reviewedAt && <> · хянасан: {formatDateTime(a.reviewedAt)}</>}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg p-1.5 text-mist-400 hover:bg-ink-800 hover:text-mist-50 disabled:opacity-50"
            aria-label="Хаах"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Агуулга */}
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          {a.aboutMe && <Field label="Өөрийн тухай" value={a.aboutMe} wide />}
          <ListField label="Бусад гадаад хэл" count={a.otherLanguages.length}>
            {a.otherLanguages.map((l, i) => (
              <li key={i}>
                <span className="font-medium">{l.language}</span>
                <span className="text-mist-400"> · {l.level}</span>
              </li>
            ))}
          </ListField>
          <ListField label="Боловсрол" empty={a.legacyEducation} wide count={a.educations.length}>
            {a.educations.map((e, i) => (
              <li key={i}>
                <span className="font-medium">{e.school}</span>
                {e.major && <> · {e.major}</>}
                {e.period && <span className="text-mist-400"> · {e.period}</span>}
              </li>
            ))}
          </ListField>
          <ListField label="Ажлын туршлага" empty={a.legacyExperience} wide count={a.experiences.length}>
            {a.experiences.map((e, i) => (
              <li key={i}>
                <span className="font-medium">{e.company}</span>
                {e.position && <> · {e.position}</>}
                {e.period && <span className="text-mist-400"> · {e.period}</span>}
                {e.description && <p className="mt-0.5 whitespace-pre-wrap text-mist-300">{e.description}</p>}
              </li>
            ))}
          </ListField>
          <ListField label="Гавьяа, шагнал" count={a.awards.length}>
            {a.awards.map((w, i) => (
              <li key={i}>
                {w.title}
                {w.year && <span className="text-mist-400"> · {w.year}</span>}
              </li>
            ))}
          </ListField>
          <ListField label={`Хэлний оноо — ${a.hasLanguageScore ? 'байгаа' : 'байхгүй'}`} count={a.languageScores.length}>
            {a.languageScores.map((l, i) => (
              <li key={i}>
                <span className="font-medium">{l.test}</span>: {l.score}
                {l.year && <span className="text-mist-400"> · {l.year}</span>}
              </li>
            ))}
          </ListField>
          <Field label="Хобби" value={a.hobbies} />
          <Field label="Ойрын 5 жилийн сонирхол, зорилго" value={a.fiveYearGoals} />
          <div className="rounded-xl border border-ink-600/70 bg-ink-800/60 p-4 sm:col-span-2">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-mist-500">
              <Clapperboard className="h-3.5 w-3.5" /> Контент хийх сонирхол
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[11px] normal-case tracking-normal',
                  a.contentInterest ? 'bg-emerald-500/15 text-emerald-300' : 'bg-ink-700 text-mist-300',
                )}
              >
                {a.contentInterest ? 'Тийм' : 'Үгүй'}
              </span>
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-mist-100">{a.contentReason}</p>
          </div>
          {a.note && <Field label="Нэмэлт мэдээлэл" value={a.note} wide />}
        </div>

        {/* Админ: төлөв + тэмдэглэл */}
        <div className="space-y-4 border-t border-ink-700 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
            <div className="space-y-1.5">
              <label htmlFor="teacher-application-status" className="block text-sm font-medium text-mist-200">
                Төлөв
              </label>
              <select
                id="teacher-application-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TeacherApplicationStatus)}
                className={cn(selectClass, 'py-2.5 text-sm')}
                disabled={busy}
              >
                {TEACHER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {TEACHER_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="teacher-application-note" className="block text-sm font-medium text-mist-200">
                Админ тэмдэглэл
              </label>
              <textarea
                id="teacher-application-note"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                maxLength={2000}
                placeholder="Ярилцлагын цаг, сэтгэгдэл…"
                className={cn(textareaClass, 'py-2.5 text-sm')}
                disabled={busy}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              className="gap-1.5 px-3 py-2 text-xs text-red-300 hover:text-red-200"
              disabled={busy}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5" /> Устгах
            </Button>
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" className="px-4 py-2 text-sm" onClick={onClose} disabled={busy}>
                Хаах
              </Button>
              <Button type="button" className="gap-1.5 px-4 py-2 text-sm" isLoading={saving} disabled={!dirty || busy} onClick={() => void save()}>
                {!saving && <Save className="h-4 w-4" />} Хадгалах
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="CV-г устгах уу?"
        description={`${a.fullName} (${a.phone}) — хүсэлт болон цээж зураг бүрмөсөн устах болно.`}
        confirmLabel="Тийм, устгах"
        cancelLabel="Болих"
        isLoading={deleting}
        onConfirm={() => void remove()}
        onCancel={() => {
          if (!deleting) setConfirmDelete(false);
        }}
      />
    </div>,
    document.body,
  );
}

function ListField({
  label,
  empty,
  wide,
  count,
  children,
}: {
  label: string;
  empty?: string | null;
  wide?: boolean;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('rounded-xl border border-ink-600/70 bg-ink-800/60 p-4', wide && 'sm:col-span-2')}>
      <p className="text-xs uppercase tracking-wide text-mist-500">{label}</p>
      {count > 0 ? (
        <ul className="mt-2 space-y-2 text-sm leading-6 text-mist-100">{children}</ul>
      ) : empty ? (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-mist-100">{empty}</p>
      ) : (
        <p className="mt-2 text-sm text-mist-500">—</p>
      )}
    </div>
  );
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={cn('rounded-xl border border-ink-600/70 bg-ink-800/60 p-4', wide && 'sm:col-span-2')}>
      <p className="text-xs uppercase tracking-wide text-mist-500">{label}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-mist-100">{value}</p>
    </div>
  );
}
