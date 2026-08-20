// frontend/src/components/billing/billing-panel.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2, RefreshCw, X } from 'lucide-react';
import {
  checkPayment,
  createPayment,
  formatMnt,
  getPricingPlans,
  getSubscriptionMe,
  listMyPayments,
  PaymentRecord,
  PricingPlan,
  parseQpayBankUrls,
  qrImageSrc,
  SubscriptionMe,
} from '@/lib/billing-services';
import { getApiErrorMessage } from '@/lib/api-error';
import { toast } from '@/store/toast-store';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { QpayBankLinks } from '@/components/billing/qpay-bank-links';

function statusLabel(status: PaymentRecord['status']) {
  switch (status) {
    case 'PAID':
      return 'Төлсөн';
    case 'PENDING':
      return 'Хүлээгдэж буй';
    case 'FAILED':
      return 'Амжилтгүй';
    case 'CANCELED':
      return 'Цуцлагдсан';
    case 'EXPIRED':
      return 'Дууссан';
    default:
      return status;
  }
}

export function BillingPanel({
  compact = false,
  redirectTo,
}: {
  compact?: boolean;
  redirectTo?: string | null;
}) {
  const router = useRouter();
  const [sub, setSub] = useState<SubscriptionMe | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [activePayment, setActivePayment] = useState<PaymentRecord | null>(null);
  const [checking, setChecking] = useState(false);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, p, h] = await Promise.all([
        getSubscriptionMe(),
        getPricingPlans(),
        listMyPayments(),
      ]);
      setSub(s);
      setPlans(p);
      setHistory(h);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Төлбөрийн мэдээлэл ачаалж чадсангүй'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [load]);

  const stopPoll = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const onPaid = async () => {
    stopPoll();
    toast.success('Төлбөр амжилттай! VIP идэвхжлээ');
    setActivePayment(null);
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      await load();
    }
  };

  const startPoll = (paymentId: string) => {
    stopPoll();
    pollRef.current = setInterval(() => {
      void (async () => {
        try {
          const res = await checkPayment(paymentId);
          setActivePayment(res.payment);
          if (res.payment.status === 'PAID') {
            await onPaid();
          }
        } catch {
          // ignore transient poll errors
        }
      })();
    }, 3000);
  };

  const handlePay = async (planId: string) => {
    setPayingId(planId);
    try {
      const payment = await createPayment(planId);
      setActivePayment(payment);
      startPoll(payment.id);
      toast.info('QPay QR гарлаа — төлсний дараа автоматаар шалгана');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Invoice үүсгэхэд алдаа гарлаа'));
    } finally {
      setPayingId(null);
    }
  };

  const handleCheckNow = async () => {
    if (!activePayment) return;
    setChecking(true);
    try {
      const res = await checkPayment(activePayment.id);
      setActivePayment(res.payment);
      if (res.payment.status === 'PAID') {
        await onPaid();
      } else {
        toast.info('Төлбөр хараахан бүртгэгдээгүй байна');
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Шалгалт амжилтгүй'));
    } finally {
      setChecking(false);
    }
  };

  const closePaymentDialog = useCallback(() => {
    stopPoll();
    setActivePayment(null);
    setConfirmCloseOpen(false);
  }, []);

  const requestClosePaymentDialog = useCallback(() => {
    setConfirmCloseOpen(true);
  }, []);

  useEffect(() => {
    if (!activePayment) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClosePaymentDialog();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [activePayment, requestClosePaymentDialog]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  const qr = qrImageSrc(activePayment?.qrImage);
  const bankUrls = parseQpayBankUrls(activePayment?.urlsJson);

  return (
    <div className="space-y-6">
      {!compact && (
        <div>
          <h2 className="font-display text-lg font-semibold text-mist-50">Төлбөр / VIP</h2>
          <p className="mt-1 text-sm text-mist-400">
            QPay-ээр төлж VIP нээнэ. Хугацаа дуусахад автоматаар Free болно.
          </p>
        </div>
      )}

      {!sub?.qpayReady && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          QPay env тохиргоо дутуу байна. Backend `.env`-д QPAY_* шалгана уу.
        </p>
      )}

      <section>
        <h3 className="font-display text-base font-semibold text-mist-50">Багц сонгох / төлөх</h3>
        <div className="mt-3 grid items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="ce-panel flex h-full min-h-[260px] flex-col p-5">
              <p className="font-display text-lg font-semibold text-mist-50">{plan.name}</p>
              <p className="mt-1 min-h-[2.5rem] text-xs leading-relaxed text-mist-400">
                {plan.description || '—'}
              </p>
              <div className="mt-4 flex-1">
                {plan.discountPercent > 0 && (
                  <p className="text-sm text-mist-500 line-through">{formatMnt(plan.priceMnt)}</p>
                )}
                <p className="text-2xl font-semibold text-brand">{formatMnt(plan.amountMnt)}</p>
                <p className="mt-1 text-xs text-mist-400">{plan.durationDays} хоног</p>
                {plan.discountPercent > 0 ? (
                  <p className="mt-1 text-xs font-medium text-emerald-400">
                    −{plan.discountPercent}% хямдрал
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-transparent">—</p>
                )}
              </div>
              <Button
                type="button"
                className="w-full mt-4"
                isLoading={payingId === plan.id}
                onClick={() => handlePay(plan.id)}
              >
                <CreditCard className="h-4 w-4" /> VIP идэвхижүүлэх
              </Button>
            </div>
          ))}
        </div>
        {plans.length === 0 && (
          <p className="mt-3 text-sm text-mist-400">Идэвхтэй багц байхгүй.</p>
        )}
      </section>

      {activePayment && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={requestClosePaymentDialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby="qpay-dialog-title"
        >
          <div
            className="flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-2xl border border-ink-600 bg-ink-900 shadow-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-ink-700 bg-ink-900/95 px-5 py-4">
              <div>
                <h2
                  id="qpay-dialog-title"
                  className="font-display text-lg font-semibold text-mist-50"
                >
                  QPay төлбөр
                </h2>
                <p className="mt-1 text-xs text-mist-400">
                  {formatMnt(activePayment.amountMnt)} · {activePayment.senderInvoiceNo}
                </p>
              </div>
              <button
                type="button"
                onClick={requestClosePaymentDialog}
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
                  <img
                    src={qr}
                    alt="QPay QR"
                    className="h-52 w-52 rounded-xl border border-ink-600 bg-white p-3 sm:h-56 sm:w-56"
                  />
                ) : (
                  <div className="flex h-52 w-52 items-center justify-center rounded-xl border border-dashed border-ink-600 text-xs text-mist-500">
                    QR байхгүй
                  </div>
                )}
              </div>

              <p className="text-center text-sm text-mist-300">
                QR уншуулна уу. Утаснаас банкны апп сонгож болно.
              </p>

              <QpayBankLinks urls={bankUrls} />

              {activePayment.shortUrl && (
                <a
                  href={activePayment.shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-sm text-brand hover:underline"
                >
                  QPay холбоос нээх →
                </a>
              )}
            </div>

            <div className="shrink-0 border-t border-ink-700 bg-ink-900/95 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCheckNow}
                isLoading={checking}
                className="w-full"
              >
                {checking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Төлбөр шалгах
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmCloseOpen}
        title="Төлбөрийн цонхыг хаах уу?"
        description="Хэрэв төлбөрөө төлсөн бол хаалгүй хүлээгээрэй — систем автоматаар шалгана. Хаавал дараа нь дахин нээж шалгах боломжтой."
        confirmLabel="Хаах"
        cancelLabel="Үргэлжлүүлэх"
        confirmVariant="secondary"
        onConfirm={closePaymentDialog}
        onCancel={() => setConfirmCloseOpen(false)}
      />

      <section>
        <h3 className="font-display text-base font-semibold text-mist-50">Төлбөрийн түүх</h3>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-mist-400">Одоогоор төлбөр байхгүй.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {history.map((p) => (
              <li
                key={p.id}
                className="ce-panel flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-mist-100">
                    {p.plan?.name ?? p.planCode} · {formatMnt(p.amountMnt)}
                  </p>
                  <p className="mt-0.5 text-xs text-mist-500">
                    {new Date(p.createdAt).toLocaleString('mn-MN')}
                    {p.subscriptionEnds &&
                      ` · дуусах: ${new Date(p.subscriptionEnds).toLocaleDateString('mn-MN')}`}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs ${
                    p.status === 'PAID'
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : p.status === 'PENDING'
                        ? 'bg-amber-500/15 text-amber-200'
                        : 'bg-ink-700 text-mist-400'
                  }`}
                >
                  {statusLabel(p.status)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
