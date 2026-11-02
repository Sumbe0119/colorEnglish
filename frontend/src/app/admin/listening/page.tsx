// frontend/src/app/admin/listening/page.tsx
// Админ: сонсох тоглоомын клипүүд — YouTube холбоос + хугацаа өгөхөд сервер transcript татаж үгийн давтамж тоолно.
'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Eye, EyeOff, Headphones, Plus, RefreshCw, Sparkles, Trash2 } from 'lucide-react';
import {
  createAdminClip,
  deleteAdminClip,
  getAdminAiStatus,
  getAdminClips,
  refetchAdminClip,
  updateAdminClip,
  warmWordInfos,
  type AdminClip,
  type ListeningLevel,
} from '@/lib/listening-services';
import { formatTime, LEVEL_LABELS } from '@/lib/listening';
import { getApiErrorMessage } from '@/lib/api-error';
import { toast } from '@/store/toast-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { selectClass, textareaClass } from '@/components/admin/admin-form-fields';

const LEVELS: ListeningLevel[] = ['A1', 'A2', 'B1', 'B1_PLUS', 'B2', 'B2_PLUS', 'C1', 'C2'];

type FormState = { youtube: string; startSec: string; endSec: string; title: string; description: string; levelCode: ListeningLevel; isPublished: boolean };
const emptyForm = (): FormState => ({ youtube: '', startSec: '0', endSec: '90', title: '', description: '', levelCode: 'A2', isPublished: true });

/** "1:30" эсвэл "90" → секунд */
function parseSec(v: string): number | null {
  const s = v.trim();
  if (!s) return null;
  if (/^\d+$/.test(s)) return Number(s);
  const m = s.match(/^(\d+):(\d{1,2})$/);
  if (m) return Number(m[1]) * 60 + Number(m[2]);
  return null;
}

export default function AdminListeningPage() {
  const [clips, setClips] = useState<AdminClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminClip | null>(null);
  const [ai, setAi] = useState<boolean | null>(null);
  const [warming, setWarming] = useState(false);

  const warm = async () => {
    setWarming(true);
    try {
      const r = await warmWordInfos();
      if (r.busy) toast.info('Бэлтгэл аль хэдийн явагдаж байна');
      else toast.success(`Үгийн тайлбар: шинээр ${r.generated}, байсан ${r.skipped}, амжилтгүй ${r.failed}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Бэлтгэхэд алдаа'));
    } finally {
      setWarming(false);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setClips(await getAdminClips());
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Клипүүд татахад алдаа'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    getAdminAiStatus()
      .then((r) => setAi(r.ai))
      .catch(() => setAi(null));
  }, [load]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const startSec = parseSec(form.startSec);
    const endSec = parseSec(form.endSec);
    if (startSec == null || endSec == null) {
      toast.error('Хугацааг секундээр (90) эсвэл м:сс (1:30) хэлбэрээр оруулна уу');
      return;
    }
    setSaving(true);
    try {
      await createAdminClip({
        youtube: form.youtube.trim(),
        startSec,
        endSec,
        title: form.title.trim() || undefined,
        description: form.description.trim() || undefined,
        levelCode: form.levelCode,
        isPublished: form.isPublished,
      });
      toast.success('Клип нэмэгдлээ — transcript татаж үгсийг тоолов');
      setForm(emptyForm());
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Клип нэмэхэд алдаа'));
    } finally {
      setSaving(false);
    }
  };

  const patch = async (c: AdminClip, data: Parameters<typeof updateAdminClip>[1], okMsg: string) => {
    setBusyId(c.id);
    try {
      await updateAdminClip(c.id, data);
      toast.success(okMsg);
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Хадгалахад алдаа'));
    } finally {
      setBusyId(null);
    }
  };

  const refetch = async (c: AdminClip) => {
    setBusyId(c.id);
    try {
      await refetchAdminClip(c.id);
      toast.success('Transcript дахин татлаа');
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Transcript татахад алдаа'));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      await deleteAdminClip(deleteTarget.id);
      toast.success('Устгалаа');
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Устгахад алдаа'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/15">
          <Headphones className="h-6 w-6 text-brand" />
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-semibold text-mist-50">Сонсох тоглоом — клипүүд</h1>
          <p className="mt-1 text-sm text-mist-400">
            Англи хадмалтай (transcript) YouTube видеоны хэсгийг оруулна. Сервер хадмалыг татаж, олон давтагдсан үгсийг автоматаар сонгоно.
          </p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs">
            <Sparkles className={`h-3.5 w-3.5 ${ai ? 'text-success' : 'text-warning'}`} />
            {ai == null ? 'AI төлөв тодорхойгүй' : ai ? 'Үгийн тайлбар: Claude AI идэвхтэй' : 'Үгийн тайлбар: AI тохируулаагүй (ANTHROPIC_API_KEY) — энгийн орчуулга ашиглана'}
          </p>
          {ai && (
            <p className="mt-1 text-xs text-mist-500">
              Тайлбарыг клип нэмэгдэх үед сервер нэг удаа үүсгэж кэшилнэ (хэрэглэгч тоглоход AI дуудагдахгүй).{' '}
              <button type="button" onClick={() => void warm()} disabled={warming} className="text-brand hover:underline disabled:opacity-50">
                {warming ? 'Бэлтгэж байна…' : 'Дутууг одоо бэлтгэх'}
              </button>
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleCreate} className="rounded-2xl border border-ink-600/80 bg-ink-900/70 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-mist-500">Шинэ клип</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_120px_120px]">
          <Input placeholder="YouTube холбоос эсвэл ID" value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} required />
          <Input placeholder="Эхлэх (1:05)" value={form.startSec} onChange={(e) => setForm({ ...form, startSec: e.target.value })} required />
          <Input placeholder="Дуусах (2:35)" value={form.endSec} onChange={(e) => setForm({ ...form, endSec: e.target.value })} required />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_160px_auto]">
          <Input placeholder="Гарчиг (хоосон бол автоматаар)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select className={selectClass} value={form.levelCode} onChange={(e) => setForm({ ...form, levelCode: e.target.value as ListeningLevel })}>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABELS[l]}
              </option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 text-sm text-mist-300">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Нийтлэх
          </label>
        </div>
        <textarea
          className={`${textareaClass} mt-3`}
          rows={2}
          placeholder="Тайлбар (юуны тухай, хэн ярьж байгаа)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="mt-3 flex justify-end">
          <Button type="submit" isLoading={saving}>
            <Plus className="h-4 w-4" /> Нэмэх
          </Button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-sm text-mist-400">Ачаалж байна…</p>}
        {!loading && clips.length === 0 && <p className="text-sm text-mist-500">Клип алга.</p>}
        {clips.map((c) => (
          <div key={c.id} className="rounded-2xl border border-ink-600/80 bg-ink-900/60 p-4">
            <div className="flex flex-wrap items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://i.ytimg.com/vi/${c.youtubeId}/mqdefault.jpg`} alt="" className="h-20 w-36 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    defaultValue={c.title}
                    onBlur={(e) => e.target.value.trim() && e.target.value.trim() !== c.title && void patch(c, { title: e.target.value.trim() }, 'Гарчиг хадгаллаа')}
                    className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 font-semibold text-mist-50 hover:border-ink-600 focus:border-brand focus:outline-none"
                  />
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.isPublished ? 'bg-success/15 text-success' : 'bg-ink-700 text-mist-400'}`}>
                    {c.isPublished ? 'Нийтэлсэн' : 'Нуусан'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-mist-400">
                  <a href={`https://youtu.be/${c.youtubeId}?t=${c.startSec}`} target="_blank" rel="noreferrer" className="font-mono text-brand hover:underline">
                    {c.youtubeId}
                  </a>{' '}
                  · {formatTime(c.startSec)}–{formatTime(c.endSec)} · {c.segmentCount} мөр · {c.attempts} оролдлого
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <select className={`${selectClass} !w-auto !py-1 text-xs`} value={c.levelCode} onChange={(e) => void patch(c, { levelCode: e.target.value as ListeningLevel }, 'Түвшин хадгаллаа')}>
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {LEVEL_LABELS[l]}
                      </option>
                    ))}
                  </select>
                  <label className="inline-flex items-center gap-1 text-mist-400">
                    Дараалал
                    <input
                      type="number"
                      defaultValue={c.order}
                      onBlur={(e) => Number(e.target.value) !== c.order && void patch(c, { order: Number(e.target.value) }, 'Дараалал хадгаллаа')}
                      className="w-14 rounded-md border border-ink-600 bg-ink-950 px-1.5 py-0.5 text-mist-100"
                    />
                  </label>
                  <label className="inline-flex items-center gap-1 text-mist-400">
                    Эхлэх
                    <input
                      defaultValue={formatTime(c.startSec)}
                      onBlur={(e) => {
                        const v = parseSec(e.target.value);
                        if (v != null && v !== c.startSec) void patch(c, { startSec: v }, 'Хугацаа хадгалж transcript шинэчиллээ');
                      }}
                      className="w-16 rounded-md border border-ink-600 bg-ink-950 px-1.5 py-0.5 font-mono text-mist-100"
                    />
                  </label>
                  <label className="inline-flex items-center gap-1 text-mist-400">
                    Дуусах
                    <input
                      defaultValue={formatTime(c.endSec)}
                      onBlur={(e) => {
                        const v = parseSec(e.target.value);
                        if (v != null && v !== c.endSec) void patch(c, { endSec: v }, 'Хугацаа хадгалж transcript шинэчиллээ');
                      }}
                      className="w-16 rounded-md border border-ink-600 bg-ink-950 px-1.5 py-0.5 font-mono text-mist-100"
                    />
                  </label>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.words.map((w) => (
                    <span key={w.word} className="rounded-md border border-ink-600/70 bg-ink-800/70 px-2 py-0.5 text-xs text-mist-200">
                      {w.word} <span className="text-mist-500">×{w.count}</span>
                    </span>
                  ))}
                  {c.words.length === 0 && <span className="text-xs text-warning">Давтагдах үг олдсонгүй — хугацааг уртасгана уу</span>}
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <Button variant="ghost" onClick={() => void patch(c, { isPublished: !c.isPublished }, c.isPublished ? 'Нуулаа' : 'Нийтэллээ')} disabled={busyId === c.id}>
                  {c.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" onClick={() => void refetch(c)} disabled={busyId === c.id} title="Transcript дахин татах">
                  <RefreshCw className={`h-4 w-4 ${busyId === c.id ? 'animate-spin' : ''}`} />
                </Button>
                <Button variant="ghost" onClick={() => setDeleteTarget(c)} disabled={busyId === c.id} className="text-danger">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Клип устгах уу?"
        description={deleteTarget ? `«${deleteTarget.title}» болон түүний оролдлогууд устана.` : ''}
        confirmLabel="Устгах"
        onConfirm={() => void remove()}
        onCancel={() => setDeleteTarget(null)}
        isLoading={busyId === deleteTarget?.id}
      />
    </div>
  );
}
