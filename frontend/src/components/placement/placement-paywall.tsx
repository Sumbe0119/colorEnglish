// frontend/src/components/placement/placement-paywall.tsx
// Тест дууссан, үр дүн түгжээтэй — QPay-ээр төлөөд нээнэ.
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  CreditCard,
  Lightbulb,
  ListChecks,
  Loader2,
  Lock,
  Phone,
  RefreshCw,
  RotateCcw,
  Target,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { QpayBankLinks } from '@/components/billing/qpay-bank-links';
import { formatMnt, qrImageSrc } from '@/lib/billing-services';
import {
  checkPlacement,
  formatDuration,
  payPlacement,
  readStoredPayPhone,
  storePayPhone,
  type PlacementAttempt,
  type PlacementSession,
} from '@/lib/placement-services';
import { getApiErrorMessage } from '@/lib/api-error';
import { toast } from '@/store/toast-store';

const PHONE_RE = /^\d{8}$/;
const POLL_MS = 3000;

function unlockItems(totalQuestions: number) {
  return [
    { icon: Target, text: 'Таны түвшин — A1-ээс C1 хүртэл (B1+, B2+ нарийвчлалтай)' },
    { icon: BarChart3, text: '5 түвшин, 3 чадвар (дүрэм · үгийн сан · унших) тус бүрийн задаргаа' },
    { icon: ListChecks, text: `${totalQuestions} асуулт бүрийн зөв хариулт, монгол тайлбар` },
    { icon: Lightbulb, text: 'Яг хаанаас, юунаас эхлэх вэ гэсэн суралцах зөвлөмж' },
  ];
}

type Props = {
  attempt: PlacementAttempt;
  session: PlacementSession;
  onAttemptChange: (attempt: PlacementAttempt) => void;
  onUnlocked: (attempt: PlacementAttempt) => void;
  onRestart: () => void;
};

export function PlacementPaywall({ attempt, session, onAttemptChange, onUnlocked, onRestart }: Props) {
  const [phone, setPhone] = useState(() => attempt.payment.payerPhone ?? readStoredPayPhone());
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [checking, setChecking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [confirmRestartOpen, setConfirmRestartOpen] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { payment } = attempt;
  const price = formatMnt(payment.amountMnt);
  const hasPendingInvoice = payment.hasInvoice && payment.status === 'PENDING';

  const stopPoll = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => () => stopPoll(), [stopPoll]);

  const handleUnlocked = useCallback(
    (a: PlacementAttempt) => {
      stopPoll();
      setDialogOpen(false);
      toast.success('Төлбөр амжилттай — үр дүн нээгдлээ!');
      onUnlocked(a);
    },
    [onUnlocked, stopPoll],
  );

  const startPoll = useCallback(() => {
    stopPoll();
    pollRef.current = setInterval(() => {
      void (async () => {
        try {
          const res = await checkPlacement(session.id, session.token);
          if (res.status === 'UNLOCKED') handleUnlocked(res);
          else onAttemptChange(res);
        } catch {
          // түр зуурын сүлжээний алдааг алгасна
        }
      })();
    }, POLL_MS);
  }, [handleUnlocked, onAttemptChange, session.id, session.token, stopPoll]);

  const openDialog = () => {
    setDialogOpen(true);
    startPoll();
  };

  const handlePay = async () => {
    const digits = phone.replace(/\D/g, '');
    if (!PHONE_RE.test(digits)) {
      setPhoneError('8 оронтой утасны дугаараа оруулна уу');
      document.getElementById('placement-pay-phone')?.focus();
      return;
    }
    setPhoneError(null);
    setPaying(true);
    try {
      const updated = await payPlacement(session.id, session.token, digits);
      storePayPhone(digits);
      if (updated.status === 'UNLOCKED') {
        handleUnlocked(updated);
        return;
      }
      onAttemptChange(updated);
      openDialog();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'QPay invoice үүсгэхэд алдаа гарлаа'));
    } finally {
      setPaying(false);
    }
  };

  const handleCheckNow = async () => {
    setChecking(true);
    try {
      const res = await checkPlacement(session.id, session.token);
      if (res.status === 'UNLOCKED') {
        handleUnlocked(res);
      } else {
        onAttemptChange(res);
        toast.info('Төлбөр хараахан бүртгэгдээгүй байна');
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Шалгалт амжилтгүй'));
    } finally {
      setChecking(false);
    }
  };

  const closeDialog = useCallback(() => {
    stopPoll();
    setDialogOpen(false);
    setConfirmCloseOpen(false);
  }, [stopPoll]);

  useEffect(() => {
    if (!dialogOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConfirmCloseOpen(true);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [dialogOpen]);

  const qr = qrImageSrc(payment.qrImage);

  return (
    <div className="space-y-5">
      {/* Дууссан мэдээлэл */}
      <div className="ce-panel p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success/15">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-semibold text-mist-50">Тест амжилттай дууслаа</h1>
            <p className="mt-1.5 text-sm leading-6 text-mist-300">
              Таны хариултыг дүгнэж, түвшинг тогтоолоо. Үр дүн бэлэн — доорх төлбөрийг төлөөд шууд нээж харна.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-800 px-3 py-1.5 text-mist-200">
                <BookOpenCheck className="h-3.5 w-3.5 text-brand" />
                {attempt.answeredCount ?? attempt.totalQuestions}/{attempt.totalQuestions} хариулсан
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-800 px-3 py-1.5 text-mist-200 tabular-nums">
                <Clock3 className="h-3.5 w-3.5 text-brand" /> {formatDuration(attempt.durationSec)}
              </span>
            </div>
          </div>
        </div>

        {/* Түгжээтэй үр дүнгийн урьдчилсан харагдац */}
        <div className="relative mt-6 overflow-hidden rounded-2xl border border-ink-600 bg-ink-800/70 p-5">
          <div className="flex items-center gap-5 blur-[6px] select-none" aria-hidden>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand/20 font-display text-4xl font-semibold text-brand">
              B?
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-mist-500/40" />
              <div className="h-3 w-56 rounded bg-mist-500/25" />
              <div className="mt-3 flex gap-1.5">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className={i < 5 ? 'h-2.5 w-5 rounded-sm bg-brand/70' : 'h-2.5 w-5 rounded-sm bg-ink-600'} />
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink-950/40 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/40 bg-ink-900">
              <Lock className="h-4 w-4 text-brand" />
            </span>
            <p className="text-sm font-semibold text-mist-50">Таны түвшин тодорхой боллоо</p>
            <p className="text-xs text-mist-300">
              Үр дүнг нээх: <span className="font-semibold text-brand">{price}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Төлбөр */}
      <div className="ce-panel p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-mist-50">Үр дүнгээ {price}-өөр нээх</h2>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {unlockItems(attempt.totalQuestions).map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-2.5 rounded-xl border border-ink-600/70 bg-ink-800/60 px-3.5 py-3 text-sm leading-6 text-mist-200">
              <Icon className="mt-1 h-4 w-4 shrink-0 text-brand" />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        {!payment.qpayReady && (
          <p className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            QPay тохиргоо дутуу байна — одоогоор төлбөр авах боломжгүй. Backend `.env`-д QPAY_* шалгана уу.
          </p>
        )}

        <div className="mt-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-mist-50">
            <Phone className="h-4 w-4 text-brand" /> Утасны дугаар
          </h3>
          <p className="mt-1 text-xs text-mist-400">
            Гүйлгээ таны утсаар бүртгэгдэнэ — гүйлгээний утга:{' '}
            <span className="font-mono text-mist-300">COLORENGLISH TEST {PHONE_RE.test(phone) ? phone : '<утас>'}</span>
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="w-full sm:max-w-[220px]">
              <Input
                id="placement-pay-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="88112233"
                maxLength={8}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, '').slice(0, 8));
                  if (phoneError) setPhoneError(null);
                }}
                error={phoneError ?? undefined}
                disabled={hasPendingInvoice}
              />
            </div>
            {hasPendingInvoice ? (
              <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                <Button type="button" className="flex-1 gap-2" onClick={openDialog}>
                  <CreditCard className="h-4 w-4" /> QR харах · {price}
                </Button>
                <Button type="button" variant="secondary" className="gap-2" isLoading={checking} onClick={() => void handleCheckNow()}>
                  <RefreshCw className="h-4 w-4" /> Төлбөр шалгах
                </Button>
              </div>
            ) : (
              <Button type="button" className="flex-1 gap-2" isLoading={paying} disabled={!payment.qpayReady} onClick={() => void handlePay()}>
                <CreditCard className="h-4 w-4" /> QPay-ээр {price} төлөх
              </Button>
            )}
          </div>
          {hasPendingInvoice && (
            <p className="mt-2 text-xs text-mist-500">
              Invoice {payment.senderInvoiceNo} үүссэн. Төлсөн бол систем 2 минут тутамд автоматаар шалгаж нээнэ.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-ink-700 pt-5 text-xs text-mist-500 sm:flex-row sm:items-center">
          <p>Үр дүн энэ төхөөрөмж дээр хадгалагдана — төлсний дараа хэдэн ч удаа дахин харж болно.</p>
          <button
            type="button"
            onClick={() => setConfirmRestartOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-mist-400 transition-colors hover:bg-ink-800 hover:text-mist-50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Шинээр тест өгөх
          </button>
        </div>
      </div>

      {/* QPay dialog */}
      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setConfirmCloseOpen(true)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="placement-qpay-title"
        >
          <div
            className="flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-2xl border border-ink-600 bg-ink-900 shadow-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-ink-700 px-5 py-4">
              <div>
                <h2 id="placement-qpay-title" className="font-display text-lg font-semibold text-mist-50">
                  QPay төлбөр
                </h2>
                <p className="mt-1 text-xs text-mist-400">{price} · Түвшин тогтоох тестийн үр дүн</p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmCloseOpen(true)}
                className="rounded-lg p-1.5 text-mist-400 hover:bg-ink-800 hover:text-mist-50"
                aria-label="Хаах"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <div className="flex justify-center">
                {qr ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qr} alt="QPay QR" className="h-52 w-52 rounded-xl border border-ink-600 bg-white p-3 sm:h-56 sm:w-56" />
                ) : (
                  <div className="flex h-52 w-52 items-center justify-center rounded-xl border border-dashed border-ink-600 text-xs text-mist-500">
                    QR байхгүй
                  </div>
                )}
              </div>
              <p className="text-center text-sm text-mist-300">QR уншуулна уу. Утаснаас банкны апп сонгож болно.</p>
              <QpayBankLinks urls={payment.urls} />
              {payment.shortUrl && (
                <a href={payment.shortUrl} target="_blank" rel="noreferrer" className="block text-center text-sm text-brand hover:underline">
                  QPay холбоос нээх →
                </a>
              )}
              <p className="flex items-center justify-center gap-2 text-xs text-mist-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Төлбөрийг автоматаар шалгаж байна…
              </p>
            </div>

            <div className="shrink-0 border-t border-ink-700 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Button type="button" variant="secondary" onClick={() => void handleCheckNow()} isLoading={checking} className="w-full">
                {!checking && <RefreshCw className="h-4 w-4" />}
                Төлбөр шалгах
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmCloseOpen}
        title="Төлбөрийн цонхыг хаах уу?"
        description="Төлбөрөө төлсөн бол хаалгүй хүлээгээрэй — систем автоматаар шалгана. Хаасан ч дараа нь «QR харах» дарж үргэлжлүүлж болно."
        confirmLabel="Хаах"
        cancelLabel="Үргэлжлүүлэх"
        confirmVariant="secondary"
        onConfirm={closeDialog}
        onCancel={() => setConfirmCloseOpen(false)}
      />

      <ConfirmDialog
        open={confirmRestartOpen}
        title="Шинээр тест өгөх үү?"
        description="Одоогийн хариулт, түүний үр дүн энэ төхөөрөмжөөс хасагдана. Үр дүнг нь нээх бол шинэ тестийн төлбөрийг дахин төлнө."
        confirmLabel="Тийм, шинээр эхлэх"
        cancelLabel="Болих"
        confirmVariant="secondary"
        onConfirm={() => {
          setConfirmRestartOpen(false);
          stopPoll();
          onRestart();
        }}
        onCancel={() => setConfirmRestartOpen(false)}
      />
    </div>
  );
}
